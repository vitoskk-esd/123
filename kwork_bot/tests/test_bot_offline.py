"""Офлайн-тесты бота: без Claude API, Telegram и Kwork.

    python -m unittest discover -s kwork_bot/tests -t .
"""

from __future__ import annotations

import asyncio
import datetime as dt
import io
import json
import os
import sys
import tempfile
import threading
import types
import unittest
import zipfile
from pathlib import Path
from unittest import mock

sys.modules.setdefault("anthropic", types.SimpleNamespace(Anthropic=lambda: None))

from kwork_agent import storage  # noqa: E402
from kwork_agent.config import CONFIG  # noqa: E402
from kwork_agent.uniqueness import find_duplicate  # noqa: E402
from kwork_bot import content, db, examples, images, payments  # noqa: E402
from kwork_bot.config import BOT_CONFIG  # noqa: E402

NICHES = ["Нарисую логотип", "Сделаю фирменный стиль", "Оформлю карточки Wildberries", "Создам баннер для сайта",
          "Разработаю брендбук", "Сверстаю презентацию", "Нарисую иконки для приложения", "Оформлю Instagram",
          "Сделаю обложку для YouTube", "Создам визитку", "Нарисую стикеры для Telegram", "Подготовлю макет буклета"]


def desc(no: int, words: str = "") -> str:
    # Уникальные «слова», чтобы проверка на похожесть не склеила разные кворки.
    return (words + " " + " ".join(f"u{no:03d}w{j:03d}" for j in range(60))).strip()


def fake_listing(no: int, **kw) -> dict:
    base = dict(idea_no=no, idea=NICHES[(no - 1) % len(NICHES)], title=NICHES[(no - 1) % len(NICHES)],
                category_hint="Дизайн > Логотипы", description=desc(no), requirements="Название и пожелания.",
                price_rub=1500, days=3, tags=["логотип"], cover_text="Логотип")
    base.update(kw)
    return base


EXAMPLE = {"title": "Разработаю логотип для вашего бренда", "description": desc(500, "логотип бренда"),
           "requirements": "Название компании", "price_rub": 1200, "days": 2, "category_hint": "Логотипы",
           "cover_url": "", "url": ""}

PAGE = ('<meta property="og:title" content="Разработка логотипа за 3 000 руб., исполнитель X – Kwork">'
        '<meta property="og:image" content="https://cdn-edge.kwork.ru/pics/t3/1.jpg">'
        '<script>window.x={"cartItems":[],"kwork":{"gtitle":"Разработка логотипа","price":3000,"days":"3",'
        '"categoryTitle":"Логотип и брендинг","gdesc":"<p><strong>С нуля.</strong></p><p>&mdash; исходники</p>",'
        '"ginst":"<p>Название компании</p>","packages":{"standard":{"price":3000}}},"other":1};</script>')


class FakeLLM:
    """Отвечает на запрос идей списком ниш, на запрос текстов — кворками по номерам идей из промпта."""

    def __init__(self, broken: set[int] = frozenset()):
        self.broken = set(broken)  # номера идей, которые в первый раз «пишутся» с ошибкой
        self.prompts: list[str] = []
        self.lock = threading.Lock()

    def ask(self, prompt, schema=None, **kw):
        with self.lock:
            self.prompts.append(prompt)
        if "summary" in schema["properties"]:
            return {"skills": "логотипы и фирменный стиль", "style": "коротко, списками",
                    "summary": "вы дизайнер логотипов", "visual_brief": "pencils, sketches, color swatches"}
        if list(schema["properties"]) == ["items"]:  # рубрики для загруженных кворков
            nos = [int(line.split(".")[0]) for line in prompt.splitlines() if line[:1].isdigit()]
            return {"items": [{"row": n, "category_hint": "Дизайн > Логотипы", "volume": f"1 макет №{n}",
                               "attribute_hints": ["Figma", "Логотип"]} for n in nos]}
        if list(schema["properties"]) == ["kworks"]:  # варианты полей рубрики Kwork
            nos = [int(line.split(".")[0]) for line in prompt.split("КВОРКИ:")[1].splitlines() if line[:1].isdigit()]
            return {"kworks": [{"no": n, "ids": []} for n in nos]}
        if list(schema["properties"]) == ["visual_brief"]:
            return {"visual_brief": "pencils and paper"}
        if "ideas" in schema["properties"]:
            start = prompt.count("\n- ") if "(пока нет)" not in prompt else 0
            need = int(prompt.split("Придумай ")[1].split()[0])
            return {"ideas": [{"name": f"Логотип для: {NICHES[(start + k) % len(NICHES)]} {start + k}",
                               "audience": "малый бизнес", "result": "логотип"} for k in range(need)]}
        nos = [int(line.split(".")[0]) for line in prompt.split("ИДЕИ")[1].split("ТРЕБОВАНИЯ")[0].splitlines()
               if line[:1].isdigit()]
        out = []
        for no in nos:
            with self.lock:
                bad = no in self.broken
                self.broken.discard(no)
            out.append(fake_listing(no, description="коротко") if bad else fake_listing(no))
        return {"listings": out}


class Base(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        BOT_CONFIG.data_dir = Path(self.tmp.name) / "bot"
        CONFIG.data_dir = Path(self.tmp.name) / "agent"
        # Тесты никогда не ходят в платный Higgsfield, даже если ключ есть в окружении.
        for name, value in (("images", "template"), ("hf_key", "")):
            patcher = mock.patch.object(BOT_CONFIG, name, value)
            patcher.start()
            self.addCleanup(patcher.stop)
        self.uid = 42
        db.save_profile(self.uid, {**db.load_profile(self.uid), "skills": "логотипы", "min_price": 1000, "palette": 2})

    def tearDown(self):
        self.tmp.cleanup()


class ContentTests(Base):
    def test_ideas_and_listings_end_to_end(self):
        progress = {}
        llm = FakeLLM(broken={3})
        ideas = content.generate_ideas(self.uid, 12, progress, llm=llm)
        self.assertEqual(len(ideas), 12)
        listings = content.generate_listings(self.uid, progress, llm=llm)
        self.assertEqual(len(listings), 12)  # идея №3 сначала не прошла проверку и была переписана
        self.assertEqual(progress["done"], 12)
        self.assertTrue(any("ПРОШЛАЯ ПОПЫТКА ОТКЛОНЕНА" in p for p in llm.prompts))
        self.assertEqual({l["palette"] for l in listings}, {2})
        for l in listings:
            self.assertTrue(db.cover_path(self.uid, l["id"]).exists())
        self.assertEqual(content.missing_ideas(self.uid), [])

    def test_price_below_user_minimum_is_rejected(self):
        content.generate_ideas(self.uid, 1, {}, llm=FakeLLM())

        profile = db.load_profile(self.uid)
        profile["min_price"] = 1500
        db.save_profile(self.uid, profile)

        class Cheap(FakeLLM):
            def ask(self, prompt, schema=None, **kw):
                return {"listings": [fake_listing(1, price_rub=600)]}  # 600 → допустимые 1000 < 1500

        self.assertEqual(content.generate_listings(self.uid, {}, llm=Cheap()), [])

    def test_edits(self):
        llm = FakeLLM()
        content.generate_ideas(self.uid, 3, {}, llm=llm)
        first, second, _ = content.generate_listings(self.uid, {}, llm=llm)

        class Rewriter:
            def ask(self, prompt, schema=None, **kw):
                return {"listings": [fake_listing(first["idea_no"], title="Нарисую новый логотип",
                                                  description=desc(99, "другой"))]}

        new = content.rewrite_listing(self.uid, first["id"], "короче", llm=Rewriter())
        self.assertEqual(new["id"], first["id"])
        self.assertEqual(new["title"], "Нарисую новый логотип")
        self.assertEqual(len(list(db.covers_dir(self.uid).glob("*.jpg"))), 3)

        changed = content.next_cover(self.uid, first["id"])
        self.assertEqual(changed["variant"], 1)  # другая обработка фона, бесплатно
        self.assertIn("fp", changed)
        self.assertEqual(content.set_price(self.uid, first["id"], 2500)["price_rub"], 2500)
        with self.assertRaises(ValueError):
            content.set_price(self.uid, first["id"], 10)

        content.delete_listing(self.uid, second["id"])
        self.assertEqual(len(db.load_listings(self.uid)), 2)
        self.assertEqual(content.missing_ideas(self.uid), [])  # удалённый не вернётся при «Дописать»

    def test_export_and_import_into_agent(self):
        llm = FakeLLM()
        content.generate_ideas(self.uid, 4, {}, llm=llm)
        content.generate_listings(self.uid, {}, llm=llm)
        from kwork_bot.export import build_zip

        data = build_zip(self.uid)
        z = zipfile.ZipFile(io.BytesIO(data))
        self.assertEqual(len([n for n in z.namelist() if n.startswith("covers/")]), 4)
        csv_text = z.read("kworks.csv").decode("utf-8-sig")
        self.assertEqual(len(csv_text.strip().splitlines()), 5)
        self.assertIn("Название", csv_text.splitlines()[0])

        from kwork_agent.importer import import_archive

        path = Path(self.tmp.name) / "kwork.zip"
        path.write_bytes(data)
        self.assertEqual(import_archive(path), 4)
        self.assertEqual(import_archive(path), 0)  # повторный импорт не дублирует
        queue = storage.load_listings()
        self.assertEqual({l["status"] for l in queue}, {"draft"})

        from kwork_agent.cover import cover_for

        cover = CONFIG.data_dir / "covers" / f"{queue[0]['id']}.jpg"
        self.assertEqual(cover_for(queue[0]), cover)
        self.assertEqual(cover.read_bytes(), z.read(f"covers/{queue[0]['id']}.jpg"))


class ExamplesAndImagesTests(Base):
    def test_parse_kwork_page(self):
        k = examples.parse_page(PAGE, "https://kwork.ru/logo/1/x")
        self.assertEqual(k["title"], "Разработка логотипа")
        self.assertEqual(k["price_rub"], 3000)
        self.assertEqual(k["days"], 3)
        self.assertEqual(k["description"], "С нуля.\n— исходники")
        self.assertEqual(k["requirements"], "Название компании")
        self.assertEqual(k["cover_url"], "https://cdn-edge.kwork.ru/pics/t3/1.jpg")
        with self.assertRaises(ValueError):
            examples.parse_page("<html>не кворк</html>", "https://kwork.ru/")

    def test_only_kwork_urls(self):
        self.assertEqual(examples.find_urls("a https://kwork.ru/x/1/y, b http://evil.ru/z"), ["https://kwork.ru/x/1/y"])
        text = "профиль https://kwork.ru/user/Nik.Design и https://kwork.ru/logo/1/a"
        self.assertEqual(examples.find_profile(text), "Nik.Design")
        self.assertEqual(examples.find_urls(text), ["https://kwork.ru/logo/1/a"])  # профиль — не кворк
        for bad in ("https://kwork.ru.evil.com/a", "http://kwork.ru/a", "https://evil.com/kwork.ru"):
            with self.assertRaises(ValueError):
                examples._get(bad, 10)

    def test_pasted_text(self):
        k = examples.from_text("Сделаю логотип\n" + "Описание услуги. " * 20 + "\nЦена 1 500 ₽")
        self.assertEqual(k["title"], "Сделаю логотип")
        self.assertEqual(k["price_rub"], 1500)
        with self.assertRaises(ValueError):
            examples.from_text("коротко")

    def test_examples_shape_generation_and_block_duplicates(self):
        examples.add_example(self.uid, dict(EXAMPLE))
        llm = FakeLLM()
        profile = content.analyze_examples(self.uid, llm=llm)
        self.assertEqual(profile["min_price"], max(CONFIG.price_min, 1200))
        content.generate_ideas(self.uid, 2, {}, llm=llm)

        class Copycat(FakeLLM):
            def ask(self, prompt, schema=None, cached_context="", **kw):
                self.prompts.append((prompt, cached_context))
                return {"listings": [fake_listing(1, title=EXAMPLE["title"], description=EXAMPLE["description"]),
                                     fake_listing(2)]}

        cc = Copycat()
        out = content.generate_listings(self.uid, {}, llm=cc)
        self.assertEqual([l["idea_no"] for l in out], [2])  # копия образца отклонена
        self.assertIn("АКТИВНЫЕ КВОРКИ ПРОДАВЦА", cc.prompts[0][1])  # образцы — в кэшируемой части
        self.assertIn("стиле кворков продавца", cc.prompts[0][0])

    def _fake_images(self, seeds):
        """Подделка Higgsfield: каждая «картинка» — шум с заданным зерном (одинаковое зерно — одинаковая картинка)."""
        import random

        from PIL import Image

        calls = []

        def fake_generate(model, args, out):
            seed = seeds[len(calls)] if len(calls) < len(seeds) else len(calls) + 1000
            calls.append((model, args["prompt"]))
            rnd = random.Random(seed)
            img = Image.new("RGB", (64, 42))
            img.putdata([(rnd.randrange(256), 40, 200) for _ in range(64 * 42)])
            out.parent.mkdir(parents=True, exist_ok=True)
            img.resize((1248, 832), Image.NEAREST).save(out)
            return out

        return calls, fake_generate

    def _listings(self, n):
        listings = [fake_listing(i, id=f"k{i}", palette=1, cover_text=f"Услуга номер {i}") for i in range(1, n + 1)]
        db.save_listings(self.uid, listings)
        return listings

    def _backgrounds(self, n=2):
        calls, fake = self._fake_images(seeds=list(range(1, n + 1)))
        with mock.patch.object(BOT_CONFIG, "images", "higgsfield"), mock.patch.object(BOT_CONFIG, "backgrounds", n), \
             mock.patch.object(images, "hf_generate", fake):
            content.ensure_visual_brief(self.uid, llm=FakeLLM())
            prog = {}
            self.assertEqual(len(images.make_backgrounds(self.uid, prog)), n)
        self.assertEqual(prog["done"], n)
        return calls

    def test_few_backgrounds_many_unique_covers(self):
        import hashlib

        from PIL import Image

        calls = self._backgrounds(2)  # ИИ рисует только 2 фона…
        for _, prompt in calls:      # …по английскому описанию ниши (русский текст модели рисуют каракулями)
            self.assertIn("pencils and paper", prompt)
            self.assertFalse(any("а" <= ch <= "я" for ch in prompt.lower()))
        listings = self._listings(12)  # …а обложек 12, и все разные
        prog = {}
        self.assertEqual(images.unique_covers(self.uid, listings, prog), 0)
        self.assertEqual(prog["done"], 12)
        marks = [images.cover_fingerprint(db.cover_path(self.uid, l["id"])) for l in listings]
        self.assertFalse(any(images.covers_similar(a, b) for i, a in enumerate(marks) for b in marks[i + 1:]))
        files = {hashlib.sha256(db.cover_path(self.uid, l["id"]).read_bytes()).digest() for l in listings}
        self.assertEqual(len(files), 12)
        cover = Image.open(db.cover_path(self.uid, "k1"))
        self.assertEqual(cover.size, (660, 440))
        self.assertLess(cover.getpixel((5, 430))[2], 60)  # слева тень под текстом
        self.assertEqual(content.uniqueness_report(self.uid), (0, 0))

    def test_gradient_covers_stay_unique(self):
        """Без ИИ-фонов (градиент) обложки тоже не похожи: раньше примерно каждая 15-я партия
        из 5 обложек оставалась с похожей парой — гладкий градиент почти не менял отпечаток."""
        import random

        rnd = random.Random(7)
        for batch in range(8):
            uid = 100 + batch
            db.save_profile(uid, {**db.load_profile(uid), "palette": batch})
            ls = [fake_listing(i + 1, id="%010x" % rnd.getrandbits(40), palette=batch % 6) for i in range(6)]
            db.save_listings(uid, ls)
            self.assertEqual(images.unique_covers(uid, ls), 0, batch)
            marks = [l["fp"] for l in ls]
            self.assertFalse([1 for i, a in enumerate(marks) for b in marks[i + 1:] if images.covers_similar(a, b)])

    def test_similar_cover_gets_other_variation(self):
        self._backgrounds(1)
        listings = self._listings(2)
        real = images.render_cover
        tries = []

        def first_two_same(uid, listing):
            import shutil

            tries.append(listing.get("variant", 0))
            # первая попытка второго кворка — точная копия обложки первого
            if listing["id"] == "k2" and listing.get("variant", 0) == 0:
                out = db.cover_path(uid, "k2")
                shutil.copy(db.cover_path(uid, "k1"), out)
                return out
            return real(uid, listing)

        with mock.patch.object(images, "render_cover", first_two_same):
            images.unique_covers(self.uid, listings, {})
        self.assertEqual(listings[1]["variant"], 1)  # копию заметили и сменили обработку
        self.assertFalse(images.covers_similar(listings[0]["fp"], listings[1]["fp"]))

    def test_other_background_button_is_free_and_unique(self):
        self._backgrounds(1)
        listings = self._listings(2)
        images.unique_covers(self.uid, listings, {})
        before = listings[0]["fp"]
        with mock.patch.object(images, "hf_generate", side_effect=AssertionError("платно!")):
            content.next_cover(self.uid, "k1")
        after = db.load_listings(self.uid)[0]
        self.assertNotEqual(before, after["fp"])
        self.assertFalse(images.covers_similar(after["fp"], listings[1]["fp"]))

    def test_next_batch_never_repeats_previous_one(self):
        self._backgrounds(1)
        first = self._listings(1)
        images.unique_covers(self.uid, first, {})
        old_mark = db.load_listings(self.uid)[0]["fp"]
        content.reset(self.uid)  # первая партия уходит в историю
        self.assertEqual(db.load_history(self.uid)[0]["fp"], old_mark)
        self.assertTrue(find_duplicate(first[0], content.previous_texts(self.uid)))  # тот же текст не пройдёт
        self._backgrounds(1)  # тот же фон (то же зерно) и та же обработка — копия прошлой обложки
        second = [fake_listing(1, id="k1", palette=1, cover_text=first[0]["cover_text"])]
        db.save_listings(self.uid, second)
        images.unique_covers(self.uid, second, {})
        self.assertGreater(second[0].get("variant", 0), 0)
        self.assertFalse(images.covers_similar(old_mark, second[0]["fp"]))

    def test_uniqueness_report_catches_twins(self):
        import shutil

        self._backgrounds(1)
        listings = self._listings(2)
        images.unique_covers(self.uid, listings, {})
        self.assertEqual(content.uniqueness_report(self.uid), (0, 0))
        shutil.copy(db.cover_path(self.uid, "k1"), db.cover_path(self.uid, "k2"))
        listings[1].update(title=listings[0]["title"])
        db.save_listings(self.uid, listings)
        self.assertEqual(content.uniqueness_report(self.uid), (1, 1))

    def test_image_errors_fall_back_to_gradients(self):
        def boom(*a):
            raise RuntimeError("429")

        listings = self._listings(1)
        with mock.patch.object(BOT_CONFIG, "images", "higgsfield"), mock.patch.object(images, "hf_generate", boom):
            prog = {}
            self.assertEqual(images.make_backgrounds(self.uid, prog), [])
            self.assertIn("429", prog["error"])
        self.assertTrue(images.render_cover(self.uid, listings[0]).exists())

class SetupWizardTests(unittest.TestCase):
    def test_clean(self):
        from kwork_bot.setup import clean

        self.assertEqual(clean('  "HF_KEY=abc:def" ', "HF_KEY"), "abc:def")
        self.assertEqual(clean("kwork_bot_token = 1:x", "KWORK_BOT_TOKEN"), "1:x")
        self.assertEqual(clean("sk-ant-1 ", "ANTHROPIC_API_KEY"), "sk-ant-1")

    def test_wizard_retries_bad_key_and_writes_env(self):
        from kwork_bot import setup

        def tg(token):
            if token != "1:good":
                raise ValueError("Telegram не принял токен")
            return "my_bot"

        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / ".env.local").write_text("HF_KEY=id:secret\n")
            answers = iter(["1:bad", "KWORK_BOT_TOKEN=1:good", "", "sk-ant-ok"])
            steps = [(n, t, h, {"KWORK_BOT_TOKEN": tg}.get(n, lambda v: None), r) for n, t, h, _, r in setup._steps("claude")]
            clean_env = {k: v for k, v in os.environ.items()
                         if k not in ("KWORK_BOT_TOKEN", "ANTHROPIC_API_KEY", "HF_KEY", "KWORK_BOT_RETURN_URL")}
            with mock.patch.object(setup, "ROOT", root), mock.patch.object(setup, "ENV", root / ".env"), \
                 mock.patch.object(setup, "STEPS", steps), mock.patch.dict(os.environ, clean_env, clear=True), \
                 mock.patch("builtins.print"), mock.patch.object(BOT_CONFIG, "llm", "claude"):
                self.assertTrue(setup.needs_setup())
                setup.run_setup(ask=lambda prompt: next(answers))
                self.assertFalse(setup.needs_setup())
            env = (root / ".env").read_text()
        self.assertIn("KWORK_BOT_TOKEN=1:good", env)
        self.assertIn("KWORK_BOT_RETURN_URL=https://t.me/my_bot", env)
        self.assertIn("ANTHROPIC_API_KEY=sk-ant-ok", env)  # пустой ответ на обязательный ключ — переспросили
        self.assertIn("HF_KEY=id:secret", env)              # взят из .env.local без вопросов


class HiggsfieldClientTests(unittest.TestCase):
    def test_submit_poll_download(self):
        calls = []
        replies = iter([
            {"request_id": "r1", "status_url": "https://api.higgsfield.ai/requests/r1/status"},
            {"status": "queued"},
            {"status": "completed", "images": [{"url": "https://cdn.higgsfield.ai/r1.png"}]},
        ])

        def fake_hf(method, url, body=None):
            calls.append((method, url, body))
            return next(replies)

        class Resp(io.BytesIO):
            def __enter__(self):
                return self

            def __exit__(self, *a):
                return False

        with tempfile.TemporaryDirectory() as tmp, mock.patch.object(images, "_hf", fake_hf), \
             mock.patch.object(images.time, "sleep", lambda s: None), \
             mock.patch("urllib.request.urlopen", lambda url, timeout: Resp(b"PNG")):
            out = images.hf_generate("recraft/v4.1/text-to-image", {"prompt": "p"}, Path(tmp) / "a.png")
            self.assertEqual(out.read_bytes(), b"PNG")
        self.assertEqual(calls[0], ("POST", "https://api.higgsfield.ai/recraft/v4.1/text-to-image", {"prompt": "p"}))
        self.assertEqual(calls[1][1], "https://api.higgsfield.ai/requests/r1/status")

    def test_failed_job_raises(self):
        replies = iter([{"request_id": "r2"}, {"status": "nsfw"}])
        with mock.patch.object(images, "_hf", lambda *a, **k: next(replies)):
            with self.assertRaises(RuntimeError):
                images.hf_generate("m", {}, Path("/nonexistent/x.png"))


class GeminiTests(unittest.TestCase):
    def _http_error(self, code):
        import urllib.error

        return urllib.error.HTTPError("u", code, "x", {}, io.BytesIO(b'{"error":"busy"}'))

    def test_request_shape_and_fallback(self):
        from kwork_bot import gemini_llm

        sent = []
        replies = iter([self._http_error(503),
                        {"candidates": [{"content": {"parts": [{"text": "думаю", "thought": True},
                                                               {"text": '{"ok": 1}'}]}}]}])

        def fake_post(self_, model, body):
            sent.append((model, body))
            r = next(replies)
            if isinstance(r, Exception):
                raise r
            return r

        with mock.patch.object(gemini_llm.GeminiLLM, "_post", fake_post):
            llm = gemini_llm.GeminiLLM("main-model", fallbacks=["spare-model"])
            out = llm.ask("вопрос", system="сис", schema={"type": "object"}, effort="high", cached_context="образцы")
        self.assertEqual(out, {"ok": 1})
        self.assertEqual([m for m, _ in sent], ["main-model", "spare-model"])  # 503 → запасная модель
        body = sent[0][1]
        self.assertEqual(body["systemInstruction"]["parts"][0]["text"], "образцы\n\nсис")
        self.assertEqual(body["generationConfig"]["responseJsonSchema"], {"type": "object"})
        self.assertEqual(body["generationConfig"]["thinkingConfig"], {"thinkingLevel": "high"})

    def test_retries_then_gives_up(self):
        from kwork_bot import gemini_llm

        calls = []

        def busy(self_, model, body):
            calls.append(model)
            raise self._http_error(503)

        with mock.patch.object(gemini_llm.GeminiLLM, "_post", busy), \
             mock.patch.object(gemini_llm.time, "sleep", lambda s: None):
            with self.assertRaises(gemini_llm.GeminiError):
                gemini_llm.GeminiLLM("a", fallbacks=["b"]).ask("q")
        self.assertEqual(len(calls), 2 * gemini_llm.ROUNDS)

    def test_bad_request_is_not_retried_forever(self):
        from kwork_bot import gemini_llm

        def forbidden(self_, model, body):
            raise self._http_error(403)

        with mock.patch.object(gemini_llm.GeminiLLM, "_post", forbidden):
            with self.assertRaises(gemini_llm.GeminiError):
                gemini_llm.GeminiLLM("a", fallbacks=[]).ask("q")


class LLMRequestTests(unittest.TestCase):
    def _capture(self, model, **ask_kw):
        from kwork_agent.llm import LLM

        sent = {}

        class Stream:
            def __enter__(self):
                return self

            def __exit__(self, *a):
                return False

            def get_final_message(self):
                return types.SimpleNamespace(stop_reason="end_turn",
                                             content=[types.SimpleNamespace(type="text", text='{"ok": 1}')])

        def stream(**kw):
            sent.update(kw)
            return Stream()

        client = types.SimpleNamespace(beta=types.SimpleNamespace(messages=types.SimpleNamespace(stream=stream)))
        LLM(client=client, model=model).ask("q", system="sys", schema={"type": "object"}, **ask_kw)
        return sent

    def test_haiku_has_no_fallbacks(self):
        sent = self._capture("claude-haiku-5-5")
        self.assertEqual(sent["betas"], [])
        self.assertNotIn("fallbacks", sent["extra_body"])
        self.assertEqual(sent["extra_body"]["output_config"]["format"]["type"], "json_schema")

    def test_sonnet_keeps_fallbacks_and_cache(self):
        sent = self._capture("claude-sonnet-5-5", cached_context="образцы")
        self.assertEqual(sent["extra_body"]["fallbacks"], "default")
        self.assertEqual(sent["system"][0], {"type": "text", "text": "sys"})
        self.assertEqual(sent["system"][1]["cache_control"], {"type": "ephemeral"})


class ArchiveSizeTests(Base):
    def test_300_covers_fit_telegram_limit(self):
        """Бот может отправить файл до 50 МБ — архив на 300 кворков с ИИ-фонами должен влезать с запасом."""
        from PIL import Image

        from kwork_bot.export import build_zip

        # Фон с шумом — худший случай для сжатия (реальные фоны Recraft сжимаются лучше).
        noise = Image.effect_noise((1320, 880), 40).convert("RGB")
        bg = images.backgrounds_dir(self.uid) / "bg1.jpg"
        bg.parent.mkdir(parents=True, exist_ok=True)
        Image.blend(Image.new("RGB", noise.size, (40, 60, 120)), noise, 0.35).save(bg, "JPEG", quality=90)
        listings = [fake_listing(no, id=f"id{no:03d}", palette=1, cover_text=f"Услуга номер {no} для бизнеса")
                    for no in range(1, 301)]
        for l in listings:
            images.render_cover(self.uid, l)
        db.save_listings(self.uid, listings)
        size_mb = len(build_zip(self.uid)) / 1024 / 1024
        self.assertLess(size_mb, 45, f"архив {size_mb:.1f} МБ")


class BulkImportTests(Base):
    """Готовые кворки с Яндекс Диска: папка «фото» + таблица."""

    def make_disk(self):
        import random

        import openpyxl
        from PIL import Image

        src = Path(self.tmp.name) / "disk"
        (src / "фото").mkdir(parents=True)
        for name, seed in (("1.jpg", 1), ("2.jpg", 2), ("3.jpg", 3), ("4.jpg", 2)):  # 4.jpg — копия 2.jpg
            rnd = random.Random(seed)
            img = Image.new("RGB", (60, 40))
            img.putdata([(rnd.randrange(256), rnd.randrange(256), 90) for _ in range(60 * 40)])
            img.resize((1200, 800), Image.NEAREST).save(src / "фото" / name)
        wb = openpyxl.Workbook()
        ws = wb.active
        ws.append(["Фото", "Название кворка", "Описание", "Цена", "Срок"])
        ws.append(["1.jpg", "Разработаю логотип", desc(1, "логотип"), 2000, 3])
        ws.append(["2", "Сделаю визитку", desc(2, "визитка"), None, None])
        ws.append(["3.jpg", "Нарисую баннер", desc(3, "баннер") + " пишите t.me/me", 1000, 2])
        ws.append(["4.jpg", "Оформлю презентацию", desc(4, "презентация"), 1500, 2])
        ws.append(["9.jpg", "Создам лендинг", desc(5, "лендинг"), 3000, 5])
        wb.save(src / "кворки.xlsx")

        def item(path):
            return {"name": path.name, "type": "dir" if path.is_dir() else "file",
                    "path": "/" + str(path.relative_to(src)), "file": str(path), "size": 1}

        def list_dir(link, path="/"):
            return [item(x) for x in sorted((src / path.lstrip("/")).iterdir())]

        def download(it, out):
            out.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy(it["file"], out)
            return out

        import shutil
        return mock.patch.multiple("kwork_bot.disk", list_dir=list_dir, download=download)

    def test_prepare_checks_and_finish(self):
        from kwork_bot import bulk

        with self.make_disk():
            st = bulk.prepare(self.uid, "https://disk.yandex.ru/d/abc", {})
        self.assertEqual([r["row"] for r in st["rows"]], [2, 3, 5])
        problems = " ".join(st["problems"])
        self.assertIn("строка 4", problems)        # контакты в тексте — Kwork запрещает
        self.assertIn("строка 6", problems)        # фото 9.jpg нет в папке
        self.assertEqual(st["twins"], [[3, 5]])    # 2.jpg и 4.jpg одинаковые
        self.assertEqual(bulk.missing(st), {"price": 1, "days": 1})
        bulk.apply_defaults(self.uid, 1500, 5)
        profile = db.load_profile(self.uid)
        profile["bulk"]["photo_choice"] = "uniquify"
        db.save_profile(self.uid, profile)
        self.assertEqual(bulk.finish(self.uid, {}, llm=FakeLLM()), 3)
        listings = db.load_listings(self.uid)
        self.assertEqual({l["price_rub"] for l in listings}, {2000, 1500})
        # Рубрика — настоящая из списка Kwork, с номерами для расширения; «что нужно» дополнено до 100 символов.
        self.assertTrue(all(l["own_photo"] and l["category_hint"] == "Дизайн > Логотип и брендинг"
                            and (l["section_id"], l["category_id"]) == (15, 25)
                            and len(l["requirements"]) >= 100 for l in listings))
        # Объёма в таблице нет — его подобрал ИИ вместе с рубрикой; рубрика требует портфолио.
        self.assertEqual(sorted(l["volume"] for l in listings), ["1 макет №2", "1 макет №3", "1 макет №5"])
        self.assertTrue(all(l["needs_portfolio"] for l in listings))
        self.assertTrue(all(l["attribute_hints"] == ["Figma", "Логотип"] for l in listings))  # для полей рубрики
        self.assertIn("3 кворков", content.portfolio_note(self.uid))
        self.assertEqual(content.uniqueness_report(self.uid), (0, 0))  # копию фото уникализировали
        # Фото клиента не перерисовывается при правке цены, а «Другой фон» обрабатывает его, а не рисует обложку.
        before = db.cover_path(self.uid, listings[0]["id"]).read_bytes()
        content.set_price(self.uid, listings[0]["id"], 2500)
        self.assertEqual(db.cover_path(self.uid, listings[0]["id"]).read_bytes(), before)
        content.next_cover(self.uid, listings[0]["id"])
        self.assertNotEqual(db.cover_path(self.uid, listings[0]["id"]).read_bytes(), before)

    def test_without_choice_twins_stay(self):
        from kwork_bot import bulk

        with self.make_disk():
            bulk.prepare(self.uid, "https://disk.yandex.ru/d/abc", {})
        bulk.apply_defaults(self.uid, 1500, 5)
        bulk.finish(self.uid, {}, llm=FakeLLM())
        self.assertEqual(content.uniqueness_report(self.uid)[1], 1)  # без «уникализировать» копия остаётся

    def test_csv_cp1251_and_links(self):
        from kwork_bot import bulk, disk

        path = Path(self.tmp.name) / "t.csv"
        path.write_bytes("Название;Описание кворка;Цена, руб.;Рубрика;Объём услуг\nЛого;Текст;1 500 руб.;Дизайн;1 логотип\n;;;;\n"
                         .encode("cp1251"))
        rows = bulk.read_table(path)
        self.assertEqual(len(rows), 1)
        self.assertEqual((rows[0]["title"], rows[0]["price_rub"], rows[0]["category_hint"], rows[0]["volume"]),
                         ("Лого", 1500, "Дизайн", "1 логотип"))
        template = Path(self.tmp.name) / "template.xlsx"
        template.write_bytes(bulk.template_xlsx())
        self.assertEqual(bulk.read_table(template)[0]["volume"], "1 логотип в 3 вариантах")
        self.assertEqual(disk.find_link("вот https://disk.yandex.ru/d/AbC-12_x."), "https://disk.yandex.ru/d/AbC-12_x")
        self.assertIsNone(disk.find_link("https://evil.com/disk.yandex.ru"))

    def test_bot_dialog(self):
        from aiogram import Bot, Dispatcher
        from aiogram.types import CallbackQuery, Chat, Message, Update, User

        from kwork_bot import bot as botmod

        tg = FakeTelegram()
        bot = Bot("1:TEST", session=tg.session)
        dp = Dispatcher()
        botmod.router._parent_router = None
        dp.include_router(botmod.router)
        user, chat = User(id=self.uid, is_bot=False, first_name="Т"), Chat(id=self.uid, type="private")
        n = iter(range(1, 10**6))

        async def text(t):
            msg = Message(message_id=next(n), date=dt.datetime.now(), chat=chat, from_user=user, text=t)
            await dp.feed_update(bot, Update(update_id=next(n), message=msg))

        async def press(data):
            msg = Message(message_id=next(n), date=dt.datetime.now(), chat=chat, from_user=user, text="x")
            cb = CallbackQuery(id=str(next(n)), from_user=user, chat_instance="c", data=data, message=msg)
            await dp.feed_update(bot, Update(update_id=next(n), callback_query=cb))

        async def scenario():
            await text("/start")
            self.assertIn("bulk", tg.buttons())
            await press("bulk")
            self.assertIn("SendDocument", [type(c).__name__ for c in tg.calls])  # шаблон таблицы
            await text("https://disk.yandex.ru/d/abc")
            while botmod.JOBS:
                await asyncio.sleep(0.05)
            self.assertIn("Нашёл кворков с фото: <b>3</b>", " ".join(tg.texts()))
            self.assertIn("bp:1000", tg.buttons())
            await press("bp:1000")
            await press("bd:5")
            self.assertIn("tw:uniq", tg.buttons())
            await press("tw:uniq")
            while botmod.JOBS or "Готово" not in " ".join(tg.texts()):
                await asyncio.sleep(0.05)

        with self.make_disk(), mock.patch.object(content, "_llm", lambda *a, **k: FakeLLM()):
            asyncio.run(scenario())
        self.assertIn("Готово: <b>3</b> кворков из вашей таблицы", " ".join(tg.texts()))
        self.assertIn("все тексты и фото уникальны", " ".join(tg.texts()))


class SellerKworksTests(Base):
    def test_list_request(self):
        sent = {}

        class Resp(io.BytesIO):
            def __enter__(self):
                return self

            def __exit__(self, *a):
                return False

        def fake_urlopen(req, timeout):
            sent.update(url=req.full_url, body=json.loads(req.data), headers=dict(req.headers))
            return Resp(json.dumps({"success": True, "data": {"total": 12, "data": [
                {"url": "/logo/1/a"}, {"url": "/logo/2/b"}]}}).encode())

        with mock.patch("urllib.request.urlopen", fake_urlopen):
            self.assertEqual(examples.seller_kworks("Nik"),
                             (12, ["https://kwork.ru/logo/1/a", "https://kwork.ru/logo/2/b"]))
        self.assertEqual(sent["url"], "https://kwork.ru/user_kworks/nik")
        self.assertEqual(sent["body"], {"username": "Nik", "offset": 0, "limit": 10})  # больше 10 Kwork не отдаёт

        with mock.patch("urllib.request.urlopen", lambda req, timeout: Resp(b'{"success":false,"data":null}')):
            with self.assertRaises(ValueError):
                examples.seller_kworks("Nik")


class KworkRulesTests(unittest.TestCase):
    def test_rules_from_real_form(self):
        from kwork_bot import kwork_rules as r

        self.assertEqual(sum(len(x["subs"]) for x in r.sections()), 54)
        cat = r.find_category("Дизайн > Логотипы")
        self.assertEqual((cat["section_id"], cat["id"]), (15, 25))
        self.assertIsNone(r.find_category("абракадабра"))
        self.assertEqual([r.snap_price(p) for p in (None, 600, 4500, 26000, 10**6)], [500, 1000, 4500, 27000, 130000])
        listing = {"category_hint": "полиграфия", "days": 99, "price_rub": 4200, "requirements": "ТЗ"}
        self.assertEqual(r.normalize(listing), [])
        self.assertEqual((listing["category_id"], listing["days"], listing["price_rub"]), (27, 30, 4500))
        self.assertTrue(r.INSTRUCTION_MIN <= len(listing["requirements"]) <= r.INSTRUCTION_MAX)
        self.assertEqual(r.normalize({"category_hint": "что-то своё"}), ["рубрика не из списка Kwork"])

    def test_volume_and_portfolio(self):
        """«Объём услуг в 1 кворке» Kwork требует всегда; в части рубрик нужно ещё и портфолио."""
        from kwork_bot import kwork_rules as r

        logo = {"category_hint": "Дизайн > Логотип и брендинг", "volume": "  1 логотип   в 3 вариантах "}
        helper = {"category_hint": "Бизнес и жизнь > Персональный помощник"}
        self.assertEqual(r.normalize(logo) + r.normalize(helper), [])
        self.assertEqual(logo["volume"], "1 логотип в 3 вариантах")
        self.assertEqual(helper["volume"], r.DEFAULT_VOLUME)
        self.assertEqual((logo["needs_portfolio"], helper["needs_portfolio"]), (True, False))
        bot = {"category_hint": "Скрипты, боты", "attribute_hints": [" Telegram ", "", "Python", 3] + ["x"] * 20}
        r.normalize(bot)
        self.assertEqual(bot["attribute_hints"][:3], ["Telegram", "Python", "3"])
        self.assertLessEqual(len(bot["attribute_hints"]), 10)
        self.assertIn("attribute_hints", content.BOT_LISTING_SCHEMA["properties"]["listings"]["items"]["required"])
        long = r.fit_volume("слово " * 30)
        self.assertLessEqual(len(long), r.VOLUME_MAX)
        self.assertFalse(long.endswith(" "))
        types = {c.get("portfolio") for s in r.sections() for c in s["subs"]}
        self.assertEqual(types, {"photo", "video", "audio", "pdf", "none"})  # у каждой рубрики есть тип


class KworkFieldsTests(Base):
    """Поля рубрик Kwork («Тип», «Язык разработки», «Платформа»…) — снимок дерева и выбор вариантов."""

    def test_snapshot_covers_all_categories(self):
        from kwork_bot import kwork_fields as kf
        from kwork_bot.kwork_rules import sections

        ids = [c["id"] for s in sections() for c in s["subs"]]
        self.assertTrue(all(isinstance(kf.tree_for(i), list) for i in ids))
        self.assertGreater(sum(1 for i in ids if kf.tree_for(i)), 45)
        bots = kf.tree_for(41)
        self.assertEqual(bots[0]["title"], "Тип")
        chat = next(o for o in bots[0]["options"] if o["label"] == "Чат-боты")
        self.assertIn("Платформа", [f["title"] for f in chat["fields"]])
        self.assertIn("Поле «Тип»", kf.describe(bots))

    def test_resolve_follows_tree_and_limits(self):
        from kwork_bot import kwork_fields as kf

        tree = [{"id": "1", "title": "Тип", "required": True, "multiple": False, "max": 0, "options": [
            {"id": "10", "label": "Парсеры"},
            {"id": "11", "label": "Чат-боты", "fields": [
                {"id": "2", "title": "Платформа", "required": True, "multiple": True, "max": 2, "options": [
                    {"id": "20", "label": "Telegram"}, {"id": "21", "label": "Сайт"}, {"id": "22", "label": "Email"},
                    {"id": "23", "label": "Другие"}]},
                {"id": "3", "title": "Язык", "required": True, "multiple": True, "max": 0, "options": [
                    {"id": "30", "label": "C++"}, {"id": "31", "label": "Python"}]}]}]}]
        attrs, guessed = kf.resolve(tree, ["11", "22", "20", "21", "31", "99"])
        self.assertEqual([(a["field"], a["ids"]) for a in attrs],
                         [("Тип", ["11"]), ("Платформа", ["22", "20"]), ("Язык", ["31"])])  # лимит 2, порядок ИИ
        self.assertEqual(guessed, [])
        attrs, guessed = kf.resolve(tree, ["11", "31"])  # платформу ИИ не выбрал — «Другие», на проверку
        self.assertEqual(attrs[1], {"field": "Платформа", "ids": ["23"], "labels": ["Другие"]})
        self.assertEqual(guessed, ["Платформа"])
        attrs, _ = kf.resolve(tree, ["10", "20"])  # «Платформа» не показывается под «Парсерами»
        self.assertEqual([a["field"] for a in attrs], ["Тип"])

    def test_archive_gets_fields_for_old_kworks(self):
        """Кворки без полей (созданные раньше) получают их при сборке архива; повторно ИИ не спрашиваем."""
        db.save_listings(self.uid, [fake_listing(1, id="a1", category_hint="Разработка и IT > Скрипты, боты и mini apps")])
        from kwork_bot.kwork_rules import normalize
        listings = db.load_listings(self.uid)
        normalize(listings[0])
        db.save_listings(self.uid, listings)
        self.assertTrue(content.needs_attributes(self.uid))
        llm = FakeLLM()
        self.assertEqual(content.ensure_attributes(self.uid, llm=llm), 1)  # ИИ ничего не выбрал — проверить вручную
        l = db.load_listings(self.uid)[0]
        self.assertEqual(l["attributes"][0]["field"], "Тип")
        self.assertIn("Тип", l["attributes_guessed"])
        self.assertFalse(content.needs_attributes(self.uid))
        content.ensure_attributes(self.uid, llm=llm)
        self.assertEqual(len(llm.prompts), 1)


class CoverModerationTests(Base):
    """Модерация Kwork отклоняет обложку с ценой, если она расходится с ценой кворка."""

    def test_no_price_on_cover(self):
        from kwork_bot.kwork_rules import fit_cover_text

        self.assertEqual(fit_cover_text("Бот для записи", "Создам бота"), "Бот для записи")
        for bad in ("Логотип от 1500 ₽", "Скидка 50%", "Сайт за 3 000 руб", ""):
            cleaned = fit_cover_text(bad, "Создам сайт-визитку на Tilda")
            self.assertEqual(cleaned, "сайт-визитку на Tilda", bad)
        # На обложке только заголовок: ни цены, ни срока.
        from PIL import ImageDraw

        drawn = []
        real = ImageDraw.ImageDraw.text
        with mock.patch.object(ImageDraw.ImageDraw, "text", lambda self, xy, text, *a, **k: (drawn.append(text), real(self, xy, text, *a, **k))):
            images.render_cover(self.uid, fake_listing(1, id="p1", price_rub=1500, days=2, cover_text="Логотип"))
        self.assertEqual(drawn, ["ЛОГОТИП"])

    def test_old_covers_are_redrawn(self):
        self.assertFalse(images.outdated_covers([fake_listing(2, id="o2", own_photo=True)]))  # фото клиента не трогаем
        ls = [fake_listing(1, id="o1")]
        db.save_listings(self.uid, ls)
        self.assertTrue(images.outdated_covers(ls))  # обложки старых партий — с ценой
        images.unique_covers(self.uid, ls)
        self.assertFalse(images.outdated_covers(db.load_listings(self.uid)))


class CoverWeightTests(unittest.TestCase):
    def test_kwork_minimum_30kb(self):
        """Kwork молча не загружает обложку, если файл не больше 30 720 байт."""
        from PIL import Image

        with tempfile.TemporaryDirectory() as tmp:
            for color in ((0, 0, 0), (12, 18, 38), (250, 250, 250)):  # однотонные — самые лёгкие
                out = Path(tmp) / "c.jpg"
                images.save_cover_jpeg(Image.new("RGB", (660, 440), color), out)
                self.assertGreater(out.stat().st_size, 30720, color)
                self.assertEqual(Image.open(out).size, (660, 440))


class ExtensionPackageTests(unittest.TestCase):
    def test_extension_zip(self):
        from kwork_bot.export import extension_filename, extension_help, extension_version, extension_zip

        z = zipfile.ZipFile(io.BytesIO(extension_zip()))
        names = set(z.namelist())
        # Папка и файл — с номером версии: новую папку не спутать со старой при обновлении.
        folder = f"kwork_extension_v{extension_version()}"
        for f in ("manifest.json", "background.js", "filler.js", "panel.js", "unzip.js"):
            self.assertIn(f"{folder}/{f}", names)
        self.assertIn(extension_version(), extension_filename())
        self.assertIn(folder, extension_help())
        self.assertIn("Удалить", extension_help())
        manifest = json.loads(z.read(f"{folder}/manifest.json"))
        self.assertEqual(manifest["manifest_version"], 3)
        self.assertIn("https://kwork.ru/*", manifest["host_permissions"])
        self.assertLessEqual(int(manifest["minimum_chrome_version"]), 109)  # Chrome на Windows 7

    def test_bot_archive_readable_by_extension(self):
        """listings.json и обложки — без сжатия: расширение читает их без сторонних библиотек."""
        from kwork_bot.export import build_zip

        with tempfile.TemporaryDirectory() as tmp, mock.patch.object(BOT_CONFIG, "data_dir", Path(tmp)):
            l = fake_listing(1, id="x1")
            db.save_listings(7, [l])
            images.render_cover(7, l)
            z = zipfile.ZipFile(io.BytesIO(build_zip(7)))
        self.assertEqual(z.getinfo("listings.json").compress_type, zipfile.ZIP_STORED)
        self.assertEqual(z.getinfo("covers/x1.jpg").compress_type, zipfile.ZIP_STORED)
        # Версия расширения, для которой собран архив: старое расширение попросит обновиться.
        from kwork_bot.export import extension_version
        self.assertEqual(json.loads(z.read("kwork_meta.json")), {"extension_version": extension_version()})

    def test_old_kworks_get_volume_in_archive(self):
        """Кворки, созданные до поля «Объём», в архиве получают объём — иначе Kwork не даст сохранить."""
        from kwork_bot.export import build_zip
        from kwork_bot.kwork_rules import DEFAULT_VOLUME

        with tempfile.TemporaryDirectory() as tmp, mock.patch.object(BOT_CONFIG, "data_dir", Path(tmp)):
            db.save_listings(7, [fake_listing(1, id="x1"), fake_listing(2, id="x2", volume="до 10 страниц")])
            z = zipfile.ZipFile(io.BytesIO(build_zip(7)))
        listings = json.loads(z.read("listings.json"))
        self.assertEqual([l["volume"] for l in listings], [DEFAULT_VOLUME, "до 10 страниц"])
        table = z.read("kworks.csv").decode("utf-8-sig")
        self.assertIn("Объём услуг в 1 кворке", table.splitlines()[0])
        self.assertIn("до 10 страниц", table)


class KworkLimitTests(Base):
    def test_room_respects_kwork_limit(self):
        profile = db.load_profile(self.uid)
        profile.update(examples=[dict(EXAMPLE)], existing_kworks=None)
        db.save_profile(self.uid, profile)
        self.assertEqual(content.room(self.uid), 299)  # профиль не открылся — считаем образцы
        profile["existing_kworks"] = 295
        db.save_profile(self.uid, profile)
        self.assertEqual(content.room(self.uid), 5)
        profile["existing_kworks"] = 310
        db.save_profile(self.uid, profile)
        self.assertEqual(content.room(self.uid), 0)

    def test_seller_count_from_profile(self):
        with mock.patch.object(examples, "seller_kworks", lambda name: (7, [])):
            self.assertEqual(examples.seller_kwork_count("WasilevDesign"), 7)

        def broken(name):
            raise ValueError("нет")

        page = b'<script>{"user":{"totalKworks":12,"totalReviewsCount":501}}</script>'
        with mock.patch.object(examples, "seller_kworks", broken), \
             mock.patch.object(examples, "_get", lambda url, limit: page):
            self.assertEqual(examples.seller_kwork_count("WasilevDesign"), 12)  # запасной путь — страница профиля
        self.assertIsNone(examples.seller_kwork_count("../etc/passwd"))
        self.assertEqual(examples.parse_page(PAGE.replace('"gtitle"', '"username":"Nik","gtitle"'), "u")["username"], "Nik")


class AccessAndPaymentTests(Base):
    def test_first_user_becomes_owner(self):
        self.assertFalse(db.has_access(1))
        self.assertTrue(db.claim_owner(1))
        self.assertFalse(db.claim_owner(2))
        self.assertTrue(db.has_access(1))
        self.assertFalse(db.has_access(2))

    def test_yookassa_requests(self):
        sent = []

        class Resp(io.BytesIO):
            def __enter__(self):
                return self

            def __exit__(self, *a):
                return False

        def fake_urlopen(req, timeout):
            sent.append(req)
            if req.get_method() == "POST":
                return Resp(json.dumps({"id": "pay_1", "status": "pending",
                                        "confirmation": {"confirmation_url": "https://yoomoney.ru/pay"}}).encode())
            return Resp(json.dumps({"id": "pay_1", "status": "succeeded"}).encode())

        with mock.patch.object(BOT_CONFIG, "yookassa_shop_id", "123"), \
             mock.patch.object(BOT_CONFIG, "yookassa_secret", "sec"), \
             mock.patch.object(BOT_CONFIG, "receipts", True), \
             mock.patch("urllib.request.urlopen", fake_urlopen):
            self.assertEqual(payments.create_payment(7, "a@b.ru"), ("pay_1", "https://yoomoney.ru/pay"))
            self.assertEqual(payments.payment_status("pay_1"), "succeeded")
        body = json.loads(sent[0].data)
        self.assertEqual(body["amount"], {"value": f"{BOT_CONFIG.price_rub}.00", "currency": "RUB"})
        self.assertEqual(body["receipt"]["customer"]["email"], "a@b.ru")
        self.assertIn("Idempotence-key", sent[0].headers)
        self.assertTrue(sent[0].headers["Authorization"].startswith("Basic "))
        self.assertTrue(sent[1].full_url.endswith("/payments/pay_1"))


# --- Диалог целиком: настоящий aiogram, поддельный Telegram ------------------------------------------------

class FakeTelegram:
    """Подменяет HTTP-сессию aiogram: запоминает вызовы API и возвращает правдоподобные ответы."""

    def __init__(self):
        from aiogram.client.session.base import BaseSession
        from aiogram.types import Chat, Message, User

        calls = self.calls = []
        counter = iter(range(1000, 10**6))

        class Session(BaseSession):
            async def make_request(self, bot, method, timeout=None):
                calls.append(method)
                ret = method.__returning__
                if ret is Message or getattr(ret, "__origin__", None) is None and ret is not bool and \
                        "Message" in str(ret):
                    return Message(message_id=next(counter), date=dt.datetime.now(),
                                   chat=Chat(id=1, type="private"),
                                   text=getattr(method, "text", None) or getattr(method, "caption", None) or ""
                                   ).as_(bot)  # как настоящий aiogram: ответ привязан к боту
                if ret is User:
                    return User(id=1, is_bot=True, first_name="bot", username="test_bot")
                return True

            async def close(self):
                pass

            async def stream_content(self, *a, **kw):
                yield b""

        self.session = Session()

    def texts(self) -> list[str]:
        return [getattr(c, "text", None) or getattr(c, "caption", None) or "" for c in self.calls]

    def buttons(self) -> list[str]:
        """callback_data всех кнопок из последнего сообщения с клавиатурой."""
        for c in reversed(self.calls):
            markup = getattr(c, "reply_markup", None)
            if markup:
                return [b.callback_data or b.url for row in markup.inline_keyboard for b in row]
        return []


class DialogTest(Base):
    def test_full_dialog(self):
        from aiogram import Bot, Dispatcher
        from aiogram.types import CallbackQuery, Chat, Message, Update, User

        from kwork_bot import bot as botmod

        tg = FakeTelegram()
        bot = Bot("1:TEST", session=tg.session)
        dp = Dispatcher()
        botmod.router._parent_router = None  # роутер можно подключить заново в каждом тесте
        dp.include_router(botmod.router)
        user = User(id=self.uid, is_bot=False, first_name="Тест")
        chat = Chat(id=self.uid, type="private")
        n = iter(range(1, 10**6))
        llm = FakeLLM()

        async def text(t):
            msg = Message(message_id=next(n), date=dt.datetime.now(), chat=chat, from_user=user, text=t)
            await dp.feed_update(bot, Update(update_id=next(n), message=msg))

        async def press(data):
            msg = Message(message_id=next(n), date=dt.datetime.now(), chat=chat, from_user=user, text="x")
            cb = CallbackQuery(id=str(next(n)), from_user=user, chat_instance="c", data=data, message=msg)
            await dp.feed_update(bot, Update(update_id=next(n), callback_query=cb))

        async def scenario():
            await text("/start")
            self.assertIn("владелец", " ".join(tg.texts()))
            self.assertIn("new", tg.buttons())
            await press("new")
            self.assertIn("no_examples", tg.buttons())
            await text("Мои кворки: https://kwork.ru/logo/1/a https://kwork.ru/logo/2/b")
            self.assertIn("ex_done", tg.buttons())
            self.assertIn("Образцов: <b>1</b>", tg.texts()[-1])  # два одинаковых названия — один образец
            await press("ex_done")
            self.assertIn("вы дизайнер логотипов", " ".join(tg.texts()))
            self.assertIn("cnt_custom", tg.buttons())
            await press("cnt_custom")
            await text("пять")
            self.assertIn("от 1 до", tg.texts()[-1])
            await text("5")
            self.assertIn("pal:0", tg.buttons())
            await press("pal:1")
            while botmod.JOBS or not db.load_listings(self.uid):
                await asyncio.sleep(0.05)
            await asyncio.sleep(0.1)
            self.assertIn("Готово: <b>5</b>", " ".join(tg.texts()))
            self.assertIn("все тексты и фоны уникальны", " ".join(tg.texts()))
            await press("v:0")
            self.assertIn("1/5", tg.texts()[-1])
            lid = db.load_listings(self.uid)[0]["id"]
            await press(f"pr:{lid}")
            await text("2 500 ₽")
            self.assertEqual(db.load_listings(self.uid)[0]["price_rub"], 2500)
            await press("zip")
            self.assertEqual(type(tg.calls[-1]).__name__, "SendDocument")

        with mock.patch.object(content, "_llm", lambda *a, **k: llm), \
             mock.patch.object(examples, "fetch_kwork", lambda url: dict(EXAMPLE, url=url)):
            asyncio.run(scenario())
        self.assertEqual(db.load_profile(self.uid)["palette"], 1)

    def test_profile_link_takes_kworks_automatically(self):
        from aiogram import Bot, Dispatcher
        from aiogram.types import Chat, Message, Update, User

        from kwork_bot import bot as botmod

        tg = FakeTelegram()
        bot = Bot("1:TEST", session=tg.session)
        dp = Dispatcher()
        botmod.router._parent_router = None
        dp.include_router(botmod.router)
        user, chat = User(id=self.uid, is_bot=False, first_name="Т"), Chat(id=self.uid, type="private")
        links = [f"https://kwork.ru/logo/{i}/k{i}" for i in range(1, 8)]

        def fake_fetch(url):
            no = int(url.split("/")[-2])
            return dict(EXAMPLE, title=f"Кворк продавца {no}", description=desc(600 + no), url=url, username="Seller")

        async def scenario():
            for n, t in enumerate(["/start", "https://kwork.ru/user/seller"], 1):
                if t != "/start":
                    await botmod.ask_examples(Message(message_id=99, date=dt.datetime.now(), chat=chat, text="x").as_(bot),
                                              dp.fsm.get_context(bot, self.uid, self.uid))
                msg = Message(message_id=n, date=dt.datetime.now(), chat=chat, from_user=user, text=t)
                await dp.feed_update(bot, Update(update_id=n, message=msg))

        with mock.patch.object(examples, "fetch_kwork", fake_fetch), \
             mock.patch.object(examples, "seller_kworks", lambda name: (7, links)), \
             mock.patch.object(examples, "seller_kwork_count", lambda name: 7), \
             mock.patch.object(content, "_llm", lambda *a, **k: FakeLLM()):
            asyncio.run(scenario())
        got = db.load_profile(self.uid)["examples"]
        self.assertEqual(len(got), examples.MAX_EXAMPLES)          # из профиля взяли ровно 5
        self.assertIn("Взял из вашего профиля кворков: 5", " ".join(tg.texts()))
        self.assertEqual(db.load_profile(self.uid)["existing_kworks"], 7)  # и сразу перешли к разбору
        self.assertIn("можно создать ещё <b>293</b>", " ".join(tg.texts()))

    def test_stranger_sees_paywall(self):
        db.claim_owner(1)
        from aiogram import Bot, Dispatcher
        from aiogram.types import Chat, Message, Update, User

        from kwork_bot import bot as botmod

        tg = FakeTelegram()
        bot = Bot("1:TEST", session=tg.session)
        dp = Dispatcher()
        botmod.router._parent_router = None
        dp.include_router(botmod.router)
        msg = Message(message_id=1, date=dt.datetime.now(), chat=Chat(id=5, type="private"),
                      from_user=User(id=5, is_bot=False, first_name="X"), text="/start")
        with mock.patch.object(BOT_CONFIG, "yookassa_shop_id", "1"), mock.patch.object(BOT_CONFIG, "yookassa_secret", "s"):
            asyncio.run(dp.feed_update(bot, Update(update_id=1, message=msg)))
        self.assertIn(f"{BOT_CONFIG.price_rub} ₽", tg.texts()[-1])
        self.assertEqual(tg.buttons(), ["pay"])


if __name__ == "__main__":
    unittest.main()
