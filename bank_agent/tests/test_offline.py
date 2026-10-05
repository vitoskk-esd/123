"""Офлайн-тесты: логика агента без обращения к API и площадкам.

    python -m unittest discover -s bank_agent/tests -t .
"""

from __future__ import annotations

import datetime as dt
import http.client
import json
import random
import sys
import tempfile
import types
import unittest
from pathlib import Path

# Позволяет запускать тесты без установленного SDK.
sys.modules.setdefault("anthropic", types.SimpleNamespace(Anthropic=lambda: None))

from bank_agent import channels, net, storage, tracker  # noqa: E402
from bank_agent.channels import Incoming  # noqa: E402
from bank_agent.compliance import assemble, check_body, check_final  # noqa: E402
from bank_agent.config import CONFIG  # noqa: E402
from bank_agent.consultant import Consultant  # noqa: E402
from bank_agent.content import generate_day  # noqa: E402
from bank_agent.db import DB, iso, now  # noqa: E402
from bank_agent.funnel import allocate, goal_status  # noqa: E402
from bank_agent.products import Product, link, parse_subid, problems  # noqa: E402
from bank_agent.publish import publish_due  # noqa: E402
from bank_agent.report import daily_report, import_conversions  # noqa: E402

GOOD = ("Тратите на продукты и такси? У этой карты повышенный кэшбэк на выбранные категории, а "
        "обслуживание бесплатное при выполнении условия. Как получить бонус: оформите карту, активируйте "
        "её и сделайте первую покупку в течение 30 дней.")


def product(**kw) -> Product:
    base = dict(
        id="alfa", bank="АО «Тест-Банк»", name="Тест-Карта", type="debit",
        referral_url="https://partner.example/ref?x=1", subid_param="sub1",
        conditions_url="https://bank.example/tariffs", key_benefits=["кэшбэк на категории"],
        target_action="активировать карту и купить от 500 ₽ за 30 дней", client_bonus="500 ₽",
        payout_rub=1200, erid="2VtzqTest",
    )
    base.update(kw)
    return Product(**base)


class FakeLLM:
    def __init__(self, asks=(), chats=()):
        self.asks, self.chats = list(asks), list(chats)
        self.prompts = []

    def ask(self, prompt, **kw):
        self.prompts.append(prompt)
        item = self.asks.pop(0)
        return item(prompt) if callable(item) else item

    def chat(self, system, history, schema):
        self.history = history
        return self.chats.pop(0)


class Base(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        CONFIG.data_dir = Path(self.tmp.name)
        CONFIG.tracker_url = "https://go.example.ru"
        CONFIG.require_erid = True
        CONFIG.dry_run = False
        CONFIG.llm_review = False
        CONFIG.channel_posts = {"telegram": 2, "dzen": 1}
        CONFIG.admin_telegram = ["42"]
        self.db = DB(CONFIG.data_dir / "t.sqlite")

    def tearDown(self):
        self.db.conn.close()
        self.tmp.cleanup()


class ComplianceTests(Base):
    def test_clean_body_passes_and_final_has_marking(self):
        p = product()
        self.assertEqual(check_body(GOOD, p, "telegram"), [])
        text = assemble(GOOD, p, "https://go.example.ru/go/alfa?s=telegram", "Оформить")
        self.assertEqual(check_final(text, p), [])
        self.assertIn("Реклама. АО «Тест-Банк». erid: 2VtzqTest", text)

    def test_forbidden_claims(self):
        p = product()
        for bad in ("Одобрение гарантировано! " + GOOD, GOOD + " Одобрят всем без отказа.",
                    GOOD + " Я сам пользуюсь этой картой.", GOOD + " Подробнее: https://evil.example",
                    GOOD + " Как в инстаграме.", "Мы — официальный представитель банка. " + GOOD):
            self.assertTrue(check_body(bad, p, "telegram"), bad)

    def test_credit_needs_psk(self):
        p = product(type="credit", credit_disclosure="ПСК 0–49,9%")
        self.assertTrue(check_body(GOOD + " Льготный период 120 дней.", p, "vk"))
        self.assertEqual(check_body(GOOD + " Льготный период 120 дней, ПСК — в условиях.", p, "vk"), [])
        self.assertIn("нет раскрытия стоимости кредита", check_final("Реклама erid: 2VtzqTest", p))

    def test_product_problems(self):
        self.assertEqual(problems(product()), [])
        self.assertTrue(any("erid" in x for x in problems(product(erid=""))))
        self.assertTrue(any("credit_disclosure" in x for x in problems(product(type="credit"))))


class LinkTests(Base):
    def test_tracked_and_direct_links(self):
        p = product()
        self.assertEqual(link(p, "vk", "ab12"), "https://go.example.ru/go/alfa?s=vk&p=ab12")
        CONFIG.tracker_url = ""
        self.assertEqual(link(p, "vk", "ab12"), "https://partner.example/ref?x=1&sub1=vk-ab12")
        self.assertEqual(parse_subid("vk-ab12"), ("vk", "ab12"))
        self.assertEqual(parse_subid("bottg-0"), ("bottg", None))
        with self.assertRaises(ValueError):
            link(p, "Bad_Source")

    def test_tracker_counts_people_not_previews(self):
        catalog = {"products": {"alfa": product()}}
        server = tracker.start(self.db, catalog, "127.0.0.1", 0)
        port = server.server_address[1]
        try:
            def get(path, ua):
                c = http.client.HTTPConnection("127.0.0.1", port, timeout=5)
                c.request("GET", path, headers={"User-Agent": ua})
                r = c.getresponse()
                return r.status, r.getheader("Location")

            status, loc = get("/go/alfa?s=vk&p=ab12", "Mozilla/5.0 (iPhone)")
            self.assertEqual(status, 302)
            self.assertEqual(loc, "https://partner.example/ref?x=1&sub1=vk-ab12")
            get("/go/alfa?s=vk&p=ab12", "TelegramBot (like TwitterBot)")
            self.assertEqual(get("/go/nope?s=vk", "Mozilla")[0], 404)
        finally:
            server.shutdown()
            server.server_close()
        clicks = self.db.all("SELECT * FROM clicks")
        self.assertEqual(len(clicks), 1)
        self.assertEqual((clicks[0]["source"], clicks[0]["post_id"]), ("vk", "ab12"))


class FunnelTests(Base):
    def test_goal_math_uses_prior_then_facts(self):
        st = goal_status(self.db, dt.date(2026, 10, 5), [product(payout_rub=1000)])
        self.assertEqual(st.days_left, 27)
        self.assertAlmostEqual(st.cr, CONFIG.cr_click_to_app * CONFIG.cr_app_to_conv)
        self.assertGreater(st.clicks_needed_per_day, 50)
        self.assertFalse(st.cr_is_measured)
        self.assertAlmostEqual(st.break_even_cpc, 1000 * st.cr)

    def test_allocate(self):
        stats = {"a": {"clicks": 500, "conv": 30, "revenue": 30000.0}, "b": {"clicks": 500, "conv": 0, "revenue": 0.0}}
        picks = allocate(20, ["a", "b"], stats, prior_epc=40, explore_share=0.2, rng=random.Random(1))
        self.assertEqual(len(picks), 20)
        self.assertGreater(picks.count("a"), picks.count("b"))
        self.assertEqual(allocate(3, ["a"], {}, 40, 0.5), ["a", "a", "a"])


def fake_posts(bad_first: bool):
    calls = {"n": 0}

    def respond(prompt):
        calls["n"] += 1
        slots = [int(s) for s in __import__("re").findall(r"Слот (\d+):", prompt)]
        posts = []
        for s in slots:
            body = GOOD + f" Разбор №{s}: {'кэшбэк продукты такси' if s % 2 else 'бонус шаги активация'} {s * 7}."
            if bad_first and calls["n"] == 1 and s == 1:
                body = "Одобрение гарантировано всем! " + body
            posts.append({"slot": s, "idea": f"Тема {s}", "from_idea": "", "body": body, "cta": "Оформить карту"})
        return {"posts": posts}

    return respond


class ContentTests(Base):
    def test_generate_retries_rejected_and_queues(self):
        llm = FakeLLM(asks=[fake_posts(bad_first=True), fake_posts(bad_first=False)])
        recs = generate_day(llm, self.db, [product()], ["telegram", "dzen"], dt.date(2026, 10, 5), random.Random(0))
        self.assertEqual(len(recs), 3)
        self.assertEqual(len(llm.prompts), 2)
        self.assertIn("ИСПРАВЬ", llm.prompts[1])
        self.assertEqual(sorted(r["status"] for r in recs), ["outbox", "queued", "queued"])
        for r in recs:
            self.assertIn("erid: 2VtzqTest", r["text"])
            self.assertIn(f"/go/alfa?s={r['channel']}&p={r['id']}", r["text"])
        self.assertEqual(len(list(storage.outbox_dir().glob("dzen-*.md"))), 1)

    def test_publish_due(self):
        generate_day(FakeLLM(asks=[fake_posts(False)]), self.db, [product()], ["telegram"],
                     dt.date(2026, 10, 5), random.Random(0))

        class FakePublisher:
            sent = []

            def publish(self, channel, text, url):
                self.sent.append((channel, url))
                return "777"

        pub = FakePublisher()
        attempted, ok = publish_due(self.db, [product()], pub, at=now() + dt.timedelta(days=400))
        self.assertEqual((attempted, ok), (2, 2))
        self.assertTrue(all(u.startswith("https://go.example.ru/go/alfa?s=telegram&p=") for _, u in pub.sent))
        self.assertEqual(self.db.one("SELECT COUNT(*) n FROM posts WHERE status='published'")["n"], 2)


class ConsultantTests(Base):
    def make(self, chats=()):
        return Consultant(FakeLLM(chats=list(chats)), self.db, [product()], status_fn=lambda: "статус")

    def test_dialog_recommends_with_tracked_button_and_marking(self):
        c = self.make([{"reply": "Вам подойдёт Тест-Карта.", "recommend": ["alfa"],
                        "quick_replies": ["А какие условия?"], "offer_reminder": True}])
        self.assertIn("не сотрудник банка", c.handle(Incoming("telegram", "7", data="start"))[0].text)
        out = c.handle(Incoming("telegram", "7", text="Нужна карта с кэшбэком"))[0]
        self.assertIn("erid: 2VtzqTest", out.text)
        urls = [b.url for row in out.buttons for b in row if b.url]
        self.assertTrue(urls[0].startswith("https://go.example.ru/go/alfa?s=bottg&u="))
        datas = [b.data for row in out.buttons for b in row if b.data]
        self.assertIn("r:alfa", datas)
        self.assertIn("q:0", datas)
        self.assertEqual(c.llm.history[-1], {"role": "user", "content": "Нужна карта с кэшбэком"})

    def test_reminders_and_stop(self):
        c = self.make()
        c.handle(Incoming("max", "9", data="r:alfa"))
        self.assertEqual(self.db.one("SELECT COUNT(*) n FROM reminders")["n"], 2)
        self.assertEqual(c.due_reminders(), [])
        self.db.execute("UPDATE reminders SET due_at=? WHERE step=1", (iso(now() - dt.timedelta(minutes=1)),))
        due = c.due_reminders()
        self.assertEqual(len(due), 1)
        self.assertIn("активировать карту", due[0][2].text)
        c.handle(Incoming("max", "9", text="/stop"))
        self.assertEqual(c.due_reminders(), [])

    def test_card_number_and_admin(self):
        c = self.make()
        self.assertIn("Ваш id в telegram: 7", c.handle(Incoming("telegram", "7", text="/id"))[0].text)
        self.assertIn("никогда", c.handle(Incoming("telegram", "7", text="моя карта 2200 1234 5678 9012"))[0].text)
        self.assertIn("Записал 3", c.handle(Incoming("telegram", "42", text="/conv 3 alfa vk"))[0].text)
        self.assertEqual(self.db.one("SELECT SUM(count) n FROM conversions")["n"], 3)
        self.assertEqual(c.handle(Incoming("telegram", "42", text="/stats"))[0].text, "статус")
        # Не-админ не может записывать конверсии — его сообщение уходит модели как обычное.
        c.llm.chats.append({"reply": "Не понял", "recommend": [], "quick_replies": [], "offer_reminder": False})
        c.handle(Incoming("telegram", "7", text="/conv 3 alfa"))
        self.assertEqual(self.db.one("SELECT SUM(count) n FROM conversions")["n"], 3)


class AlfaCreditTests(Base):
    """Готовый набор для фокуса на кредитке Альфа-Банка."""

    def setUp(self):
        super().setUp()
        from bank_agent.products import CATALOGS_DIR, load_catalog, sellable
        self.p = load_catalog(CATALOGS_DIR / "alfa-credit.json")[0]
        self.p.terms_valid_until = "2099-12-31"  # тесты не должны зависеть от сегодняшней даты
        self.assertEqual(sellable([self.p]), [self.p])

    def test_link_keeps_erid_and_marking(self):
        CONFIG.tracker_url = ""
        self.assertEqual(link(self.p, "vk", "ab12"),
                         "https://t.fincpanetwork.ru/click/3161/339?erid=2W5zFJjJPEG&sub1=vk-ab12")
        text = assemble("Кредитка с льготным периодом 60 дней. ПСК — ниже.", self.p, "https://x.example", "Оформить")
        self.assertEqual(check_final(text, self.p), [])
        self.assertIn("Реклама. АО «Альфа-Банк», ИНН 7728168971. erid: 2W5zFJjJPEG", text)
        self.assertIn("ПСК 58,522–59,023%", text)

    def test_claim_rules(self):
        ok = ("Кредитка как подушка безопасности: если гасить покупки в течение льготного периода, "
              "проценты не начисляются. До 60 дней без процентов, ПСК указана ниже. Снятие наличных "
              "до 50 000 ₽ в месяц без комиссии. Главное — не пропускать минимальный платёж.")
        self.assertEqual(check_body(ok, self.p, "vk"), [])
        bad = {
            ok + " А ещё 150 дней без процентов!": "150 дней",
            ok + " Кэшбэк в выбранных категориях!": "кэшбэк",
            ok + " Обслуживание 0 ₽ навсегда.": "навсегда",
            ok + " Отличный подарок школьникам.": "несовершеннолетним",
            ok + " Получите +30% к одобрению.": "одобрения",
        }
        for text, why in bad.items():
            self.assertTrue(any(why in i for i in check_body(text, self.p, "vk")), text)
        self.assertTrue(any("1-го числа" in i for i in check_body(
            ok + " У вас 60 дней без процентов с момента покупки.", self.p, "vk")))
        for fine in (" Продление до 150 дней — платная услуга.",
                     " 60 дней считаются с 1-го числа месяца первой покупки.",
                     " До 150 дней без процентов на перевод для погашения кредитки другого банка.",
                     " Кэшбэк баллами — только с платной подпиской «Альфа-Смарт».",
                     " Обслуживание 0 ₽ и в первый год, и со второго."):
            self.assertEqual(check_body(ok + fine, self.p, "vk"), [], fine)

    def test_terms_expiry_and_page_check(self):
        from bank_agent.products import check_terms, sellable
        self.assertTrue(any("действовали до" in x for x in problems(product(terms_valid_until="2020-01-01"))))
        page = "Диапазон полной стоимости кредита: 58,522%\u00a0— 59,023%, ставка 58,49% — 58,99% годовых. " \
               "Предложение с 10.08.2026 г. по 15.10.2026 г. Снятие наличных до 50 000 ₽ в месяц без комиссии. " \
               "Обслуживание в 1-й год — 0 ₽, со 2-го — 0 ₽"
        self.assertEqual(check_terms([self.p], fetch=lambda url: page), {})
        self.assertEqual(sellable([self.p]), [self.p])
        # Банк сменил ПСК — продукт уходит на паузу, публикация не идёт.
        changed = check_terms([self.p], fetch=lambda url: page.replace("58,522", "61,100"))
        self.assertEqual(changed, {"alfa-credit": ["58,522% — 59,023%"]})
        self.assertEqual(sellable([self.p]), [])
        # Страница не открылась — прошлый вердикт сохраняется, а не сбрасывается.
        def down(url):
            raise OSError("timeout")
        self.assertEqual(check_terms([self.p], fetch=down), changed)

    def test_bot_menu_and_reminders(self):
        c = Consultant(FakeLLM(), self.db, [self.p])
        start = c.handle(Incoming("vk", "5", data="start"))[0]
        self.assertIn("с 18 лет", start.text)
        self.assertIn("m:grace", [b.data for row in start.buttons for b in row])
        confirm = c.handle(Incoming("vk", "5", data="r:alfa-credit"))[0].text
        self.assertIn("через 2 дн.", confirm)
        self.assertIn("через терминал", confirm)
        due = [r["due_at"] for r in self.db.all("SELECT due_at FROM reminders ORDER BY step")]
        self.assertEqual(len(due), 2)
        self.db.execute("UPDATE reminders SET due_at=?", (iso(now() - dt.timedelta(minutes=1)),))
        msgs = c.due_reminders()
        self.assertIn("ПСК", msgs[0][2].text)
        self.assertIn("последнее", msgs[1][2].text)

    def test_credit_funnel(self):
        st = goal_status(self.db, dt.date(2026, 10, 5), [self.p])
        self.assertAlmostEqual(st.cr, 0.098 * 0.3101)
        self.assertAlmostEqual(st.break_even_cpc, 3680 * 0.098 * 0.3101)
        self.assertEqual(st.clicks_needed_per_day, 122)


class ReportTests(Base):
    def test_import_csv_and_report(self):
        csv_path = Path(self.tmp.name) / "export.csv"
        csv_path.write_text(
            "ID лида;Дата;Оффер;Sub1;Статус;Вознаграждение\n"
            "1;03.10.2026;alfa;vk-ab12;Подтверждён;1 200,00\n"
            "2;04.10.2026;alfa;bottg-0;В обработке;1200\n"
            "3;04.10.2026;alfa;vk-ab12;Отклонён;0\n", encoding="utf-8")
        stats = import_conversions(self.db, csv_path, [product()])
        self.assertEqual(stats, {"added": 1, "pending": 1, "skipped": 1, "duplicates": 0})
        self.assertEqual(import_conversions(self.db, csv_path, [product()])["duplicates"], 2)
        row = self.db.one("SELECT * FROM conversions WHERE ext_id='1'")
        self.assertEqual((row["source"], row["post_id"], row["payout_rub"]), ("vk", "ab12", 1200.0))
        self.assertTrue(row["ts"].startswith("2026-10-03"))
        text = daily_report(self.db, [product()], dt.date(2026, 10, 5))
        self.assertIn("Цель: 100", text)
        self.assertIn("сейчас 1 (1%), в обработке 1", text)


class ChallengeTests(Base):
    """Режим без бюджета: поиск вопросов людей, план владельца, экономия на исследовании."""

    def test_find_questions_and_owner_plan(self):
        from bank_agent.questions import find_questions
        posts = [
            {"owner_id": 1, "id": 10, "text": "Посоветуйте кредитку с беспроцентным периодом?", "comments": {"can_post": 1}},
            {"owner_id": 2, "id": 20, "text": "Продаю диван, недорого", "comments": {"can_post": 1}},
            {"owner_id": 3, "id": 30, "text": "Какую кредитку оформить? Комменты закрыты", "comments": {"can_post": 0}},
            {"owner_id": 4, "id": 40, "text": "Кто пользовался кредиткой Альфы?", "marked_as_ads": 1},
        ]
        seen_queries = []

        def search(q, start):
            seen_queries.append(q)
            return posts

        llm = FakeLLM(asks=[lambda prompt: {"answers": [
            {"id": "1_10", "relevant": True, "reply": "Смотрите на ПСК и условия льготного периода."}]}])
        p = product(type="credit", credit_disclosure="ПСК 58%")
        found = find_questions(llm, [p], search=search)
        self.assertEqual([f["url"] for f in found], ["https://vk.com/wall1_10"])
        self.assertIn("[1_10]", llm.prompts[0])
        self.assertNotIn("[2_20]", llm.prompts[0])   # не вопрос
        self.assertNotIn("[3_30]", llm.prompts[0])   # комментарии закрыты
        self.assertNotIn("[4_40]", llm.prompts[0])   # реклама
        self.assertIn("посоветуйте кредитную карту", seen_queries)
        # Повторно уже виденные посты модели не отправляются.
        self.assertEqual(find_questions(FakeLLM(), [p], search=search), [])
        CONFIG.ads_budget_rub = 0
        storage.outbox_dir().joinpath("shorts-ab.md").write_text("x", encoding="utf-8")
        report = daily_report(self.db, [product()], dt.date(2026, 10, 5))
        self.assertIn("Ваш план на сегодня", report)
        self.assertIn("VK Клипы 1 ролика", report)
        self.assertIn("ответить людям во VK (1 вопросов)", report)
        self.assertIn("Режим без бюджета", report)
        self.assertNotIn("посевами", report)

    def test_research_cadence(self):
        from bank_agent.cycle import _research_due
        CONFIG.research_every_days = 3
        try:
            self.assertTrue(_research_due())
            kb = storage.load_knowledge()
            kb["research_log"].append({"date": (dt.date.today() - dt.timedelta(days=2)).isoformat(), "focus": []})
            storage.save_knowledge(kb)
            self.assertFalse(_research_due())
        finally:
            CONFIG.research_every_days = 1


class SetupTests(Base):
    def test_wizard_updates_env_without_losing_lines(self):
        from bank_agent import setup
        setup.ENV = Path(self.tmp.name) / ".env"
        setup.ENV.write_text("# комментарий\nKWORK_DRY_RUN=1\nBANK_TRACKER_URL=\nBANK_SALT=change-me\n", encoding="utf-8")
        answers = iter(["", "https://go.example.ru/"] + [""] * 20)
        setup.run_setup(ask=lambda q: next(answers))
        env = setup.read_env()
        self.assertEqual(env["BANK_TRACKER_URL"], "https://go.example.ru")
        self.assertEqual(env["KWORK_DRY_RUN"], "1")
        self.assertEqual(env["BANK_DRY_RUN"], "1")
        self.assertNotEqual(env["BANK_SALT"], "change-me")
        self.assertIn("# комментарий", setup.ENV.read_text(encoding="utf-8"))


class ChannelTests(unittest.TestCase):
    def test_keyboards(self):
        b = [[channels.Button("Оформить", url="https://x.example")], [channels.Button("Ещё", data="q:0")]]
        vk = json.loads(channels.VK._keyboard(b))
        self.assertEqual(vk["buttons"][0][0]["action"]["type"], "open_link")
        self.assertEqual(json.loads(vk["buttons"][1][0]["action"]["payload"]), {"d": "q:0"})
        mx = channels.Max._attachments(b)[0]["payload"]["buttons"]
        self.assertEqual((mx[0][0]["type"], mx[1][0]["payload"]), ("link", "q:0"))

    def test_telegram_poll_private_only(self):
        updates = {"ok": True, "result": [
            {"update_id": 5, "message": {"chat": {"id": 1, "type": "private"}, "text": "привет"}},
            {"update_id": 6, "message": {"chat": {"id": -100, "type": "group"}, "text": "спам"}},
            {"update_id": 7, "callback_query": {"id": "cb", "from": {"id": 1}, "data": "m:card"}},
        ]}
        orig = net.request
        net.request = lambda *a, **k: updates
        try:
            tg = channels.Telegram("t")
            got = tg.poll()
        finally:
            net.request = orig
        self.assertEqual([(i.user_id, i.text, i.data) for i in got], [("1", "привет", None), ("1", "", "m:card")])
        self.assertEqual(tg.offset, 8)


if __name__ == "__main__":
    unittest.main()
