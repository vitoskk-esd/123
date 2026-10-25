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

        class Cheap(FakeLLM):
            def ask(self, prompt, schema=None, **kw):
                return {"listings": [fake_listing(1, price_rub=600)]}

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

        self.assertEqual(content.next_cover(self.uid, first["id"])["palette"], 3)
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

    def test_ai_backgrounds_and_cover_switch(self):
        from PIL import Image

        prompts = []

        def fake_generate(model, args, out):
            prompts.append((model, args["prompt"]))
            out.parent.mkdir(parents=True, exist_ok=True)
            Image.new("RGB", (900, 600), (200, 30, 30)).save(out)
            return out

        with mock.patch.object(BOT_CONFIG, "images", "higgsfield"), mock.patch.object(BOT_CONFIG, "backgrounds", 2), \
             mock.patch.object(images, "hf_generate", fake_generate):
            content.ensure_visual_brief(self.uid, llm=FakeLLM())
            prog = {}
            self.assertEqual(len(images.make_backgrounds(self.uid, prog)), 2)
            self.assertEqual(prog["done"], 2)
        # В промпт картинки — английское описание, без русского текста (его модели рисуют каракулями).
        self.assertEqual({m for m, _ in prompts}, {BOT_CONFIG.image_model})
        for _, text in prompts:
            self.assertIn("pencils and paper", text)
            self.assertFalse(any("а" <= ch <= "я" for ch in text.lower()))
            llm = FakeLLM()
            content.generate_ideas(self.uid, 2, {}, llm=llm)
            first = content.generate_listings(self.uid, {}, llm=llm)[0]
        cover = Image.open(db.cover_path(self.uid, first["id"]))
        self.assertEqual(cover.size, (660, 440))
        self.assertGreater(cover.getpixel((650, 220))[0], 150)  # справа виден красный фон
        self.assertLess(cover.getpixel((5, 430))[0], 60)        # слева тень под текстом
        self.assertEqual(content.next_cover(self.uid, first["id"])["bg"], first["bg"] + 1)

    def test_image_errors_fall_back_to_gradients(self):
        def boom(*a):
            raise RuntimeError("429")

        with mock.patch.object(BOT_CONFIG, "images", "higgsfield"), mock.patch.object(images, "hf_generate", boom):
            prog = {}
            self.assertEqual(images.make_backgrounds(self.uid, prog), [])
            self.assertIn("429", prog["error"])
        l = {"id": "x", "title": "t", "cover_text": "Тест", "days": 1, "price_rub": 500}
        self.assertTrue(images.render_cover(self.uid, l).exists())


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
        bg = images.backgrounds_dir(self.uid) / "bg1.png"
        bg.parent.mkdir(parents=True, exist_ok=True)
        noise = Image.effect_noise((1248, 832), 40).convert("RGB")
        Image.blend(Image.new("RGB", noise.size, (40, 60, 120)), noise, 0.35).save(bg)
        listings = []
        for no in range(1, 301):
            l = fake_listing(no, id=f"id{no:03d}", palette=1, bg=0, cover_text=f"Услуга номер {no} для бизнеса")
            images.render_cover(self.uid, l)
            listings.append(l)
        db.save_listings(self.uid, listings)
        size_mb = len(build_zip(self.uid)) / 1024 / 1024
        self.assertLess(size_mb, 45, f"архив {size_mb:.1f} МБ")


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
