"""Офлайн-тесты: проверяют логику без обращения к API и Kwork.

    python -m unittest discover -s kwork_agent/tests -t .
"""

from __future__ import annotations

import json
import os
import sys
import tempfile
import types
import unittest
from pathlib import Path

# Позволяет запускать тесты без установленного SDK.
sys.modules.setdefault("anthropic", types.SimpleNamespace(Anthropic=lambda: None))

from kwork_agent import storage  # noqa: E402
from kwork_agent.config import CONFIG  # noqa: E402
from kwork_agent.generator import generate_listings, validate  # noqa: E402
from kwork_agent.uniqueness import find_duplicate, jaccard  # noqa: E402

DESC = (
    "Настрою для вашего бизнеса автоматическую обработку заявок: нейросеть читает входящие "
    "письма и сообщения, определяет тип запроса, заполняет карточку в CRM и ставит задачу "
    "менеджеру. Вы перестанете терять клиентов и тратить часы на ручной разбор входящих. "
    "В работу входит анализ процесса, настройка сценария, тестирование на реальных данных "
    "и инструкция для сотрудников."
)


def listing(**kw):
    base = dict(
        idea="Обработка заявок", title="Настрою ИИ-обработку заявок в CRM",
        category_hint="Разработка и IT > Скрипты", description=DESC,
        requirements="Доступ к CRM и примеры заявок.", price_rub=3000, days=3,
        tags=["ии", "crm"], cover_text="ИИ обработка заявок",
    )
    base.update(kw)
    return base


class FakeLLM:
    def __init__(self, batches):
        self.batches = list(batches)
        self.prompts = []

    def ask(self, prompt, **kw):
        self.prompts.append(prompt)
        return {"listings": self.batches.pop(0)}


class Tests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        CONFIG.data_dir = Path(self.tmp.name)

    def tearDown(self):
        self.tmp.cleanup()

    def test_validate_ok(self):
        self.assertEqual(validate(listing()), [])

    def test_validate_catches_contacts_and_lengths(self):
        errs = validate(listing(title="x" * 200, description=DESC + " пишите на test@mail.ru", price_rub=10))
        self.assertTrue(any("назван" in e for e in errs))
        self.assertTrue(any("контакт" in e for e in errs))
        self.assertTrue(any("цена" in e for e in errs))

    def test_duplicates(self):
        a = listing()
        b = listing(title="Настрою ИИ обработку заявок в CRM системе")
        c = listing(
            title="Создам контент-завод для Telegram-канала",
            description="Запущу автоматический выпуск постов: нейросеть собирает новости ниши, "
                        "пишет тексты в вашем стиле, подбирает картинки и публикует по расписанию.",
        )
        self.assertIsNotNone(find_duplicate(b, [a]))
        self.assertIsNone(find_duplicate(c, [a]))
        self.assertLess(jaccard(a["description"], c["description"]), 0.3)

    def test_generate_rejects_duplicates_and_retries(self):
        storage.save_listings([dict(listing(), id="old", status="submitted")])
        kb = storage.load_knowledge()
        kb["service_ideas"].append({"name": "Контент-завод", "audience": "", "problem": "",
                                    "deliverable": "", "tools": "", "price_rub": 5000, "used": False})
        storage.save_knowledge(kb)
        good = listing(
            idea="Контент-завод",
            title="Создам контент-завод для Telegram-канала",
            description=("Запущу автоматический выпуск постов для канала: нейросеть собирает новости "
                         "ниши, пишет тексты в вашем стиле, подбирает картинки и публикует по "
                         "расписанию. Вы утверждаете контент-план, остальное работает само. "
                         "Передам настроенный сценарий и видеоинструкцию, помогу с первым запуском и отвечу на вопросы в течение недели."),
        )
        llm = FakeLLM([[listing(title="Настрою ИИ обработку заявок в CRM!")], [good]])
        out = generate_listings(llm, n=1)
        self.assertEqual([l["title"] for l in out], [good["title"]])
        self.assertIn("слишком похоже", llm.prompts[1])
        saved = storage.load_listings()
        self.assertEqual(len(saved), 2)
        self.assertEqual(saved[-1]["status"], "draft")
        self.assertTrue(storage.load_knowledge()["service_ideas"][0]["used"])

    def test_strategy_seeded(self):
        self.assertIn("Стратегия", storage.load_strategy())
        storage.save_strategy("# Новая")
        self.assertTrue((CONFIG.data_dir / "strategy_history" / f"{storage.today()}.md").exists())

    def test_tool_schemas_are_strict(self):
        from kwork_agent.publisher import TOOLS

        for t in TOOLS:
            schema = t["input_schema"]
            self.assertFalse(schema["additionalProperties"])
            self.assertEqual(set(schema["required"]), set(schema["properties"]))
            json.dumps(t)


if __name__ == "__main__":
    os.environ.setdefault("PYTHONDONTWRITEBYTECODE", "1")
    unittest.main()
