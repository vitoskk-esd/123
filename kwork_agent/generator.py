"""Генерация уникальных объявлений (кворков) по стратегии и базе знаний."""

from __future__ import annotations

import re
import uuid

from . import storage
from .config import CONFIG
from .llm import LLM
from .uniqueness import find_duplicate

LISTING_SCHEMA = {
    "type": "object",
    "additionalProperties": False,
    "required": ["listings"],
    "properties": {
        "listings": {
            "type": "array",
            "items": {
                "type": "object",
                "additionalProperties": False,
                "required": [
                    "idea", "title", "category_hint", "description",
                    "requirements", "price_rub", "days", "tags", "cover_text",
                ],
                "properties": {
                    "idea": {"type": "string", "description": "На какой идее услуги основано"},
                    "title": {"type": "string"},
                    "category_hint": {
                        "type": "string",
                        "description": "Рубрика Kwork в виде «Раздел > Подраздел»",
                    },
                    "description": {"type": "string"},
                    "requirements": {"type": "string", "description": "Что нужно от покупателя для начала работы"},
                    "price_rub": {"type": "integer"},
                    "days": {"type": "integer"},
                    "tags": {"type": "array", "items": {"type": "string"}},
                    "cover_text": {"type": "string", "description": "2–5 слов крупным шрифтом на обложку"},
                },
            },
        }
    },
}

_FORBIDDEN = re.compile(
    r"(https?://|www\.|@[a-z0-9_]{3,}|t\.me|telegram\.me|whatsapp|\+7\d{10}|\b8\d{10}\b|[\w.]+@[\w.]+\.\w+)",
    re.IGNORECASE,
)


def validate(listing: dict) -> list[str]:
    errors = []
    if len(listing["title"]) > CONFIG.title_max:
        errors.append(f"название длиннее {CONFIG.title_max} символов")
    if not CONFIG.description_min <= len(listing["description"]) <= CONFIG.description_max:
        errors.append(
            f"описание должно быть {CONFIG.description_min}–{CONFIG.description_max} символов "
            f"(сейчас {len(listing['description'])})"
        )
    if len(listing["requirements"]) > CONFIG.requirements_max:
        errors.append(f"«что нужно от покупателя» длиннее {CONFIG.requirements_max} символов")
    if not CONFIG.price_min <= listing["price_rub"] <= CONFIG.price_max:
        errors.append(f"цена вне диапазона {CONFIG.price_min}–{CONFIG.price_max}")
    if not 1 <= listing["days"] <= 30:
        errors.append("срок должен быть 1–30 дней")
    text = " ".join([listing["title"], listing["description"], listing["requirements"]])
    if _FORBIDDEN.search(text):
        errors.append("есть контакты или ссылки — Kwork это запрещает")
    return errors


def _prompt(n: int, kb: dict, strategy: str, existing: list[dict], rejected: list[str]) -> str:
    ideas = [i for i in kb["service_ideas"] if not i.get("used")][-40:]
    ideas_txt = "\n".join(
        f"- {i['name']} | аудитория: {i['audience']} | боль: {i['problem']} | "
        f"результат: {i['deliverable']} | ~{i['price_rub']} ₽"
        for i in ideas
    ) or "(идей пока нет — придумай сам исходя из ниши)"
    titles = "\n".join(f"- {l['title']}" for l in existing[-300:]) or "(пока нет)"
    insights = "\n".join(f"- {i['insight']}" for i in kb["insights"][-25:]) or "(пока нет)"
    rejected_txt = ""
    if rejected:
        rejected_txt = "\n\nЭти варианты были отклонены, не повторяй их ошибки:\n" + "\n".join(rejected)

    return f"""Создай {n} новых уникальных объявлений (кворков) для Kwork в нише: {CONFIG.niche}.

СТРАТЕГИЯ (следуй ей):
{strategy}

СВЕЖИЕ ЗНАНИЯ О РЫНКЕ:
{insights}

ИДЕИ УСЛУГ (выбирай разные, по одной на объявление):
{ideas_txt}

КЛЮЧЕВЫЕ СЛОВА ПОКУПАТЕЛЕЙ: {", ".join(storage.top_items(kb["keywords"], 40))}

УЖЕ ОПУБЛИКОВАНО — нельзя повторять ни услугу, ни формулировки:
{titles}

ТРЕБОВАНИЯ:
- Название до {CONFIG.title_max} символов, начинается с глагола в 1-м лице («Настрою…», «Создам…»).
- Описание {CONFIG.description_min}–{CONFIG.description_max} символов, на русском, живым языком,
  с абзацами; без контактов, ссылок, e-mail, телефонов и названий мессенджеров.
- requirements — что покупатель должен прислать для старта (до {CONFIG.requirements_max} символов).
- Цена в рублях {CONFIG.price_min}–{CONFIG.price_max}, срок 1–30 дней, реалистичные для объёма.
- Все {n} объявлений должны решать разные задачи и отличаться по смыслу и тексту.
- Обещай только то, что реально сделать; никаких гарантий дохода.{rejected_txt}"""


BATCH = 5  # столько объявлений за один запрос к модели — чтобы ответ не обрезался


def pending_count() -> int:
    return sum(1 for l in storage.load_listings() if l["status"] in ("draft", "failed") and l.get("attempts", 0) < 3)


def generate_listings(llm: LLM, n: int) -> list[dict]:
    kb = storage.load_knowledge()
    strategy = storage.load_strategy()
    listings = storage.load_listings()
    accepted: list[dict] = []
    rejected: list[str] = []

    for _ in range(n // BATCH + 4):
        need = min(BATCH, n - len(accepted))
        if need <= 0:
            break
        data = llm.ask(
            _prompt(need, kb, strategy, listings + accepted, rejected[-15:]),
            system="Ты — сильный копирайтер и продавец услуг по ИИ-автоматизации на Kwork.",
            schema=LISTING_SCHEMA,
            effort="high",
            max_tokens=32000,
        )
        for cand in data["listings"]:
            errors = validate(cand)
            dup = find_duplicate(cand, listings + accepted)
            if dup:
                errors.append(f"слишком похоже на «{dup['title']}»")
            if errors:
                rejected.append(f"- «{cand['title']}»: {'; '.join(errors)}")
                storage.log(f"Отклонено: «{cand['title']}» — {'; '.join(errors)}")
                continue
            cand.update(
                id=uuid.uuid4().hex[:10],
                created=storage.today(),
                status="draft",
            )
            accepted.append(cand)
            if len(accepted) >= n:
                break
        # Сохраняем после каждой пачки — если прогон оборвётся, готовое не потеряется.
        storage.save_listings(listings + accepted)

    used = {a["idea"].lower() for a in accepted}
    for idea in kb["service_ideas"]:
        if idea["name"].lower() in used:
            idea["used"] = True
    storage.save_knowledge(kb)
    storage.save_listings(listings + accepted)
    storage.log(f"Сгенерировано объявлений: {len(accepted)} из {n}")
    return accepted
