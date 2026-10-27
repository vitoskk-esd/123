"""Сквозная проверка без Telegram: апдейты идут в диспетчер aiogram, посты — в pipeline, ответы бота перехватывает
подменная сессия, служебный аккаунт и Робокасса — заглушки."""
import asyncio
import itertools
import time
from datetime import datetime
from pathlib import Path

import pytest
from aiogram import Bot
from aiogram.client.session.base import BaseSession
from aiogram.fsm.storage.memory import MemoryStorage
from aiogram.methods import AnswerCallbackQuery, CopyMessage, EditMessageReplyMarkup, EditMessageText, GetMe, SendMessage, SendPhoto
from aiogram.types import CallbackQuery, Chat, Message, MessageId, PhotoSize, Update, User
from telethon.tl.types import Channel, ChatPhotoEmpty

import jobs
from main import build_dispatcher
from config import Config
from ctx import Ctx
from db import DB
from pipeline import RawPost, process
import connect
from userbot import Reader
from words import load_dictionary

ROOT = Path(__file__).resolve().parents[1]
USER, OTHER, ADMIN = 111, 222, 999
CH1, CH2, OWN = -1001000000001, -1001000000002, -1001000000003
ids = itertools.count(1)


class FakeSession(BaseSession):
    """Записывает все запросы бота и отвечает правдоподобными объектами."""
    def __init__(self):
        super().__init__()
        self.sent: list = []

    async def make_request(self, bot, method, timeout=None):
        self.sent.append(method)
        if isinstance(method, (AnswerCallbackQuery, EditMessageReplyMarkup)):
            return True
        if isinstance(method, CopyMessage):
            return MessageId(message_id=next(ids))
        if isinstance(method, GetMe):
            return User(id=42, is_bot=True, first_name="Перехват", username="perekhvat_bot")
        if isinstance(method, (SendMessage, EditMessageText)):
            return Message(message_id=next(ids), date=datetime.now(), chat=Chat(id=method.chat_id or USER, type="private"),
                           text=method.text)
        if isinstance(method, SendPhoto):
            return Message(message_id=next(ids), date=datetime.now(), chat=Chat(id=method.chat_id, type="private"),
                           caption=method.caption, photo=[PhotoSize(file_id=f"ph{next(ids)}", file_unique_id="u", width=1080, height=1240)])
        return True

    async def stream_content(self, *a, **k):
        yield b""

    async def close(self):
        pass

    def texts(self, chat_id):
        return [m.caption if isinstance(m, SendPhoto) else m.text for m in self.sent
                if isinstance(m, (SendMessage, EditMessageText, SendPhoto)) and m.chat_id == chat_id]


class FakePay:
    def __init__(self):
        self.statuses: dict[str, str] = {}

    async def create(self, uid, amount, description):
        pid = f"pay{next(ids)}"
        self.statuses[pid] = "pending"
        return pid, f"https://yoomoney.example/{pid}"

    async def status(self, pid):
        return self.statuses[pid]


def user(uid):
    return User(id=uid, is_bot=False, first_name="Тест", username=f"u{uid}")


def msg(text, uid=USER):
    return Update(update_id=next(ids), message=Message(
        message_id=next(ids), date=datetime.now(), chat=Chat(id=uid, type="private"), from_user=user(uid), text=text))


def cb(data, uid=USER):
    m = Message(message_id=next(ids), date=datetime.now(), chat=Chat(id=uid, type="private"), from_user=user(uid), text="x")
    return Update(update_id=next(ids), callback_query=CallbackQuery(id=str(next(ids)), from_user=user(uid), chat_instance="c",
                                                                    data=data, message=m))


def post(chat_id, text):
    return RawPost(chat_id, next(ids), text, time.time() - 1.5)


DP = None   # роутеры живут на уровне модулей и подключаются к диспетчеру один раз


@pytest.fixture
async def env(tmp_path):
    global DP
    cfg = Config(token="1:x", admins=frozenset({ADMIN}), db_path=tmp_path / "t.db", cars_path=ROOT / "cars.yaml",
                 rk_login="shop", rk_pass1="p1", rk_pass2="p2")
    ctx = Ctx(db=await DB(cfg.db_path).open(), cfg=cfg, dict=load_dictionary(cfg.cars_path), pay=FakePay())
    for tg, uname, base in ((CH1, "avto_msk", 1), (CH2, "perekup_rf", 1), (OWN, "my_secret_cars", 0)):
        cid, _ = await ctx.db.add_channel(username=uname, base=bool(base), region="msk" if tg == CH1 else None)
        await ctx.db.channel_joined(cid, tg, uname.replace("_", " ").title(), uname, "main")
    await ctx.refresh_channels()
    try:
        DP = DP or build_dispatcher(ctx)
        DP["ctx"] = ctx
        DP.fsm.storage = MemoryStorage()
        session = FakeSession()
        yield DP, Bot("1:x", session=session), session, ctx
    finally:
        await ctx.db.close()


async def make_filter(dp, bot, text, uid=USER, plan="pro"):
    """Человек с оплаченным тарифом (по умолчанию PRO) создаёт фильтр."""
    await dp.feed_update(bot, msg("/start reels", uid))
    if plan:
        ctx = dp["ctx"]
        await ctx.db.set_user(uid, paid_until=time.time() + 30 * 86400, plan=plan)
    await dp.feed_update(bot, msg(text, uid))
    await dp.feed_update(bot, cb("f:save", uid))


async def test_filter_delivery_market_and_dedup(env):
    dp, bot, s, ctx = env
    await make_filter(dp, bot, "камри до 1,3 млн, от 2010, Москва, без битых")
    assert "Так ищем?" in s.texts(USER)[-2] and "Toyota Camry" in s.texts(USER)[-2]
    assert "Фильтр сохранён" in s.texts(USER)[-1] and "<b>2</b>" in s.texts(USER)[-1]   # две базы; свой канал — чужой

    # рынок: пять Камри 2011–2013 по 1,45–1,6 млн — дороже фильтра, никому не уходят, но учатся в цену рынка
    for p in (1_450_000, 1_480_000, 1_500_000, 1_550_000, 1_600_000):
        r = await process(bot, ctx, post(CH2, f"Toyota Camry 2012, цена {p:,} ₽, пробег {p // 10} км".replace(",", " ")))
        assert not r.sent
    r = await process(bot, ctx, post(CH1, "СРОЧНО Toyota Camry 2012\nЦена 1 250 000 ₽, торг\nпробег 180 000 км"))
    assert r.sent == [USER] and r.discount == 17
    card = s.texts(USER)[-1]
    assert "−17% к рынку" in card and "1 250 000 ₽" in card and "срочно · торг" in card and "Москва и МО" in card
    assert "рынок ≈ 1 500 000 ₽ (5 объявл.)" in card and "⏱ 1," in card
    assert "<blockquote expandable>СРОЧНО Toyota Camry 2012" in card                 # сам пост — в том же сообщении
    sent = [m for m in s.sent if isinstance(m, SendMessage) and m.chat_id == USER][-1]
    assert sent.link_preview_options.url == "https://t.me/avto_msk/" + sent.link_preview_options.url.rsplit("/", 1)[1]

    # та же машина в другом канале (другие слова, другой номер) — второй раз не присылаем
    r2 = await process(bot, ctx, post(CH2, "Продаю камри 2012 года! пробег 180 тыс, отдам за 1 250 000. Тел 8 999 000 11 22"))
    assert r2.duplicate and r2.sent == []
    # битая — фильтр «без битых» отсекает
    assert not (await process(bot, ctx, post(CH1, "Toyota Camry 2014, после ДТП, 900 000 ₽"))).sent

    await dp.feed_update(bot, msg("📊 Статистика"))
    assert "<b>За 7 дней</b>: 1 машин" in s.texts(USER)[-1]
    await dp.feed_update(bot, msg("/admin", ADMIN))
    assert "Отправлено людям: 1" in s.texts(ADMIN)[-1] and "дублей 1" in s.texts(ADMIN)[-1]
    await dp.feed_update(bot, msg("/admin"))                            # не админ — тишина
    assert "Бизнес" not in s.texts(USER)[-1]
    await dp.feed_update(bot, msg("/del @avto_msk", ADMIN))          # владелец канала попросил убрать
    assert CH1 not in ctx.channels
    assert not (await process(bot, ctx, post(CH1, "Toyota Camry 2013, 1 200 000 ₽"))).sent


async def test_no_scam_warning_and_disclaimer(env):
    """Предупреждений о мошенниках нет; в приветствии — отказ от ответственности."""
    dp, bot, s, ctx = env
    await make_filter(dp, bot, "любые до 1 млн")
    welcome = next(t for t in s.texts(USER) if "Это <b>Перехват</b>" in t)
    assert "не несём никакой ответственности" in welcome and "мошенник" not in welcome
    r = await process(bot, ctx, post(CH1, "Toyota RAV4 2019 всего 900 000 ₽! Дистанционное оформление, доставка в любой регион"))
    assert r.sent == [USER] and "мошенник" not in s.texts(USER)[-1]


async def test_channels_own_and_disable(env):
    dp, bot, s, ctx = env
    await make_filter(dp, bot, "солярис до 900к")
    await make_filter(dp, bot, "солярис до 900к", uid=OTHER)
    own = await ctx.db.channel_by_tg(OWN)
    await ctx.db.set_channel_state(USER, own["id"], "own")
    r = await process(bot, ctx, post(OWN, "Hyundai Solaris 2016, 750 000 ₽"))
    assert r.sent == [USER]                                              # свой канал — только тому, кто добавил

    ch1 = await ctx.db.channel_by_tg(CH1)
    await dp.feed_update(bot, cb(f"c:tg:{ch1['id']}:0"))                # USER отключил канал из базы
    r = await process(bot, ctx, post(CH1, "Hyundai Solaris 2015, 700 000 ₽, Москва"))
    assert r.sent == [OTHER]

    await dp.feed_update(bot, msg("📢 Каналы"))
    assert "отключено тобой: 1" in s.texts(USER)[-1] and "твои — 1" in s.texts(USER)[-1]
    await dp.feed_update(bot, cb("c:add"))
    await dp.feed_update(bot, msg("https://t.me/new_cars_spb\n@avto_msk\nкакая-то ерунда"))
    reply = s.texts(USER)[-1]
    assert "в очереди на подключение" in reply and "уже есть в общей базе" in reply and "не похоже на ссылку" in reply
    assert "Подключение займёт время — примерно 2 мин." in reply and "раз в 1,5 мин" in reply   # один канал × 90 с
    queued = await ctx.db.queued_channels()
    assert [q["username"] for q in queued] == ["new_cars_spb"]


async def test_no_plan_then_buy_basic(env):
    """Без тарифа машины не приходят; оплатил «Простой» — приходят 30 дней; повторный «Я оплатил» не продлевает дважды."""
    dp, bot, s, ctx = env
    await make_filter(dp, bot, "приора до 300к", plan=None)
    assert "выбери тариф" in s.texts(USER)[-1] and "Пробный день — 250 ₽" in s.texts(USER)[-1]
    assert (await process(bot, ctx, post(CH1, "Приора 2011, 260 000 руб"))).sent == []
    await dp.feed_update(bot, msg("💳 Подписка"))
    assert "Подписки нет" in s.texts(USER)[-1] and "Простой — 990 ₽" in s.texts(USER)[-1] and "PRO — 2490 ₽" in s.texts(USER)[-1]
    assert isinstance(s.sent[-1], SendPhoto)                              # тарифы — картинкой-сравнением

    await dp.feed_update(bot, cb("s:pay:basic"))
    pay = await ctx.db.last_pending(USER)
    assert (pay["amount"], pay["plan"]) == (990, "basic")
    await dp.feed_update(bot, cb("s:check"))                              # ещё не оплатил
    assert (await ctx.db.user(USER))["paid_until"] == 0
    ctx.pay.statuses[pay["yk_id"]] = "succeeded"
    await dp.feed_update(bot, cb("s:check"))
    await dp.feed_update(bot, cb("s:check"))                              # повторное нажатие не продлевает второй раз
    u = await ctx.db.user(USER)
    assert 29 * 86400 < u["paid_until"] - time.time() <= 30 * 86400 and u["plan"] == "basic"
    assert any("Оплата прошла! <b>Простой</b>" in t for t in s.texts(USER))
    r = await process(bot, ctx, post(CH1, "Приора 2012, 280 000 руб"))
    assert r.sent == [] and r.delayed == [USER]                            # «Простой» — с задержкой


async def test_trial_day_once_and_basic_limits_and_upgrade(env):
    """Пробный день — 250 ₽ на 24 часа и только один раз; «Простой» — до 3 фильтров; переход на PRO не сжигает дни."""
    dp, bot, s, ctx = env
    await dp.feed_update(bot, msg("/start"))
    assert any("1 день за 250 ₽" in t for t in s.texts(USER))
    await dp.feed_update(bot, cb("s:pay:trial"))
    pay = await ctx.db.last_pending(USER)
    assert (pay["amount"], pay["plan"]) == (250, "trial")
    ctx.pay.statuses[pay["yk_id"]] = "succeeded"
    await dp.feed_update(bot, cb("s:check"))
    u = await ctx.db.user(USER)
    assert u["trial_used"] == 1 and 23 * 3600 < u["paid_until"] - time.time() <= 24 * 3600
    await ctx.db.set_user(USER, paid_until=time.time() - 1)                 # день прошёл
    await dp.feed_update(bot, cb("s:pay:trial"))                            # второй раз — нельзя
    assert "только один раз" in s.texts(USER)[-1]

    await ctx.db.set_user(USER, paid_until=time.time() + 10 * 86400, plan="basic")   # «Простой», осталось 10 дней
    for t in ("камри до 1 млн", "солярис до 900к"):
        await dp.feed_update(bot, msg(t)); await dp.feed_update(bot, cb("f:save"))
    await dp.feed_update(bot, msg("веста до 1 млн")); await dp.feed_update(bot, cb("f:save"))
    assert len(await ctx.db.filters(USER)) == 2 and "до 2 фильтров" in s.texts(USER)[-1]   # третий — только в PRO

    await dp.feed_update(bot, cb("s:pay:pro"))
    pay = await ctx.db.last_pending(USER)
    assert pay["amount"] == 2490 and "пересчитаем" in s.texts(USER)[-1]
    ctx.pay.statuses[pay["yk_id"]] = "succeeded"
    await dp.feed_update(bot, cb("s:check"))
    u = await ctx.db.user(USER)
    days = (u["paid_until"] - time.time()) / 86400
    assert u["plan"] == "pro" and 33.8 < days < 34.1                        # 30 дней PRO + 10 дней «Простого» ≈ 3,98 дня PRO
    await dp.feed_update(bot, msg("веста до 1 млн")); await dp.feed_update(bot, cb("f:save"))
    assert len(await ctx.db.filters(USER)) == 3                             # в PRO лимита нет


async def test_basic_plan_extra_filters_do_not_deliver(env):
    """Перешёл с PRO на «Простой» с 4 фильтрами — работают первые 2."""
    dp, bot, s, ctx = env
    for t in ("солярис до 900к", "приора до 300к", "веста до 1 млн", "камри до 1 млн"):
        await make_filter(dp, bot, t)
    await ctx.db.set_user(USER, plan="basic")
    r = await process(bot, ctx, post(CH1, "Toyota Camry 2012, 900 000 ₽"))
    assert r.sent == r.delayed == []
    assert (await process(bot, ctx, post(CH1, "Lada Priora 2011, 260 000 ₽"))).delayed == [USER]
    for t in list(ctx.background):
        t.cancel()


async def test_basic_vs_pro_speed_market_and_own_channels(env):
    """PRO получает машину сразу и видит «ниже рынка»; «Простой» — через задержку, с замком и подсказкой про PRO;
    свои каналы и фильтр «ниже рынка» на «Простом» недоступны."""
    dp, bot, s, ctx = env
    object.__setattr__(ctx.cfg, "basic_delay", 2)
    await make_filter(dp, bot, "камри до 1,5 млн", uid=OTHER, plan="pro")
    await make_filter(dp, bot, "камри до 1,5 млн", uid=USER, plan="basic")
    for p in (1_450_000, 1_480_000, 1_500_000, 1_550_000, 1_600_000):            # рынок ≈ 1,5 млн
        await process(bot, ctx, post(CH2, f"Toyota Camry 2012, цена {p:,} ₽".replace(",", " ")))
    for t in list(ctx.background):
        t.cancel()
    s.sent.clear()
    r = await process(bot, ctx, RawPost(CH1, next(ids), "Toyota Camry 2012, 1 250 000 ₽", time.time()))
    assert r.sent == [OTHER] and r.delayed == [USER]
    assert "−17% к рынку" in s.texts(OTHER)[-1] and "В PRO" not in s.texts(OTHER)[-1]
    assert not s.texts(USER)                                                       # «Простой» ещё ждёт
    await asyncio.gather(*ctx.background)
    card = s.texts(USER)[-1]
    assert "Toyota Camry 2012" in card and "−17%" not in card and "🔒 Насколько машина ниже рынка — в PRO" in card
    assert "⚡ В PRO эта машина пришла бы на 2 с раньше" in card
    # та же машина из другого канала, пока «Простой» ждал, — не дублируется
    assert USER not in (await process(bot, ctx, post(CH2, "Toyota Camry 2012, 1 250 000 ₽, Москва"))).delayed

    own = await ctx.db.channel_by_tg(OWN)
    await ctx.db.set_channel_state(USER, own["id"], "own")                         # остался свой канал с PRO
    r = await process(bot, ctx, post(OWN, "Toyota Camry 2014, 1 100 000 ₽"))
    assert USER not in r.sent + r.delayed
    await dp.feed_update(bot, cb("c:add")); await dp.feed_update(bot, msg("@new_cars_spb"))
    assert "только общая база каналов" in s.texts(USER)[-1]
    await dp.feed_update(bot, msg("тойота ниже рынка на 15%")); await dp.feed_update(bot, cb("f:save"))
    assert "Фильтр «ниже рынка» — в тарифе PRO" in s.texts(USER)[-1]


async def test_jobs_access_reminder(env):
    dp, bot, s, ctx = env
    await make_filter(dp, bot, "веста до 1 млн")
    await ctx.db.set_user(USER, paid_until=time.time() + 3600, plan="basic")
    await jobs.tick(bot, ctx)
    await jobs.tick(bot, ctx)                                               # второй раз — не дублируем
    assert sum("Завтра заканчивается тариф <b>Простой</b>" in t for t in s.texts(USER)) == 1
    await ctx.db.set_user(USER, paid_until=time.time() + 5 * 3600, plan="trial")
    await jobs.tick(bot, ctx)
    assert not any("Через 3 часа" in t for t in s.texts(USER))               # пробный день: рано — за 3 часа
    await ctx.db.set_user(USER, paid_until=time.time() + 2 * 3600)
    await jobs.tick(bot, ctx)
    assert any("Через 3 часа заканчивается тариф <b>Пробный день</b>" in t for t in s.texts(USER))


class FakeTelethon:
    """Минимум клиента Telethon для вступления в канал."""
    def __init__(self):
        self.calls = []

    async def get_entity(self, username):
        if username == "broken_link":
            from telethon.errors import UsernameNotOccupiedError
            raise UsernameNotOccupiedError(request=None)
        ids = {"avto_kzn": 777, "avto_ufa": 778}
        titles = {"avto_kzn": "Авто Казань", "avto_ufa": "Авто Уфа"}
        return Channel(id=ids[username], title=titles[username], photo=ChatPhotoEmpty(), date=None, access_hash=1, username=username)

    async def __call__(self, request):
        self.calls.append(type(request).__name__)


async def test_reader_joins_queue_and_notifies(env):
    dp, bot, s, ctx = env
    await dp.feed_update(bot, msg("/start"))
    cid, _ = await ctx.db.add_channel(username="avto_kzn", base=False, added_by=USER)
    await ctx.db.set_channel_state(USER, cid, "own")
    await ctx.db.add_waiter(cid, USER)
    reader = Reader(bot, ctx, FakeTelethon())
    await reader.join_one(await ctx.db.channel(cid))
    ch = await ctx.db.channel(cid)
    assert ch["status"] == "joined" and ch["tg_id"] == -1000000000777 and ch["account"] == "main"
    assert reader.client.calls == ["JoinChannelRequest"] and -1000000000777 in ctx.channels
    assert "Канал «Авто Казань» подключён" in s.texts(USER)[-2]
    assert "Всё готово — каналы загружены" in s.texts(USER)[-1]                 # единственный канал партии


async def test_all_channels_ready_message_after_last(env):
    """Человек прислал три ссылки: про каждую — своё сообщение, а «всё готово» — один раз, после последней."""
    dp, bot, s, ctx = env
    await make_filter(dp, bot, "камри до 1,5 млн")
    await dp.feed_update(bot, cb("c:add"))
    await dp.feed_update(bot, msg("@avto_kzn\n@broken_link\n@avto_ufa"))
    reader = Reader(bot, ctx, FakeTelethon())
    for _ in range(3):
        await reader.join_one((await ctx.db.queued_channels())[0])
        if len(await ctx.db.queued_channels()) > 0:
            assert not any("Всё готово" in t for t in s.texts(USER))         # пока не все — итога нет
    final = s.texts(USER)[-1]
    assert sum("Всё готово" in t for t in s.texts(USER)) == 1
    assert "Подключено: <b>2</b>, не получилось: 1" in final and "пришлю сразу" in final


async def test_free_mode_without_robokassa(env):
    """Робокасса не настроена — бот бесплатный для всех, первый написавший /start — админ."""
    dp, bot, s, ctx = env
    object.__setattr__(ctx.cfg, "rk_login", "")
    object.__setattr__(ctx.cfg, "admins", frozenset())
    await make_filter(dp, bot, "приора до 300к")
    await ctx.db._run("UPDATE users SET trial_until=0 WHERE id=?", USER)
    assert (await process(bot, ctx, post(CH1, "Приора 2011, 260 000 руб"))).sent == [USER]
    await dp.feed_update(bot, msg("💳 Подписка"))                           # тарифы видно — их проверяет Робокасса
    sub = s.texts(USER)[-1]
    assert isinstance(s.sent[-1], SendPhoto) and "бесплатно для всех" in sub and "PRO — 2490 ₽" in sub and len(sub) <= 1024
    await dp.feed_update(bot, cb("s:pay:pro"))                             # а платить пока некуда
    assert s.sent[-1].show_alert and "бесплатный" in s.sent[-1].text and await ctx.db.last_pending(USER) is None
    await dp.feed_update(bot, msg("/admin"))
    assert "Оплата не подключена" in s.texts(USER)[-1]
    await dp.feed_update(bot, msg("/start", OTHER))
    await dp.feed_update(bot, msg("/admin", OTHER))                        # второй человек — не админ
    assert not any("Людей" in t for t in s.texts(OTHER))


class FakeLogin:
    """Клиент Telethon для входа: код → облачный пароль → готово."""
    def __init__(self):
        self.signed = []
        self.session = type("S", (), {"save": lambda self: "SESSION-STRING"})()

    async def send_code_request(self, phone):
        self.phone = phone
        return type("R", (), {"phone_code_hash": "HASH"})()

    async def sign_in(self, phone=None, code=None, phone_code_hash=None, password=None):
        self.signed.append((phone, code, phone_code_hash, password))
        if password is None:
            from telethon.errors import SessionPasswordNeededError
            raise SessionPasswordNeededError(request=None)

    def add_event_handler(self, *a):
        pass

    async def get_me(self):
        return type("U", (), {"first_name": "Служебный", "username": "svc"})()

    async def run_until_disconnected(self):
        await asyncio.Event().wait()


async def test_connect_service_account_in_chat(env, monkeypatch):
    """Админ подключает служебный аккаунт прямо в чате: api_id → api_hash → телефон → код → пароль."""
    dp, bot, s, ctx = env
    fake = FakeLogin()

    async def fake_client(ctx, session=""):
        return fake
    monkeypatch.setattr(connect, "new_client", fake_client)
    ctx.reader = Reader(bot, ctx)
    await dp.feed_update(bot, msg("/start", ADMIN))
    assert "/connect" in s.texts(ADMIN)[-1]                                 # админу сразу подсказка
    for text in ("/connect", "12345", "0123456789abcdef0123456789abcdef", "8 (999) 123-45-67", "1 2 3 4 5", "секрет"):
        await dp.feed_update(bot, msg(text, ADMIN))
    assert fake.phone == "+79991234567"
    assert fake.signed == [("+79991234567", "12345", "HASH", None), (None, None, None, "секрет")]
    assert "Готово" in s.texts(ADMIN)[-1] and ctx.reader.online
    assert await ctx.db.get_setting("session") == "SESSION-STRING"         # после перезапуска входить не нужно
    assert await ctx.db.get_setting("api_id") == "12345"
    deleted = [m for m in s.sent if type(m).__name__ == "DeleteMessage"]
    assert len(deleted) >= 3                                               # hash, код и пароль убраны из чата
    await dp.feed_update(bot, msg("/connect", USER))                        # не админ — ничего
    assert not any("api_id" in t for t in s.texts(USER))
    ctx.reader.runner.cancel()


async def test_edit_filter(env):
    """✏️ меняет тот же фильтр, а не создаёт новый; после правки машины идут по новым условиям."""
    dp, bot, s, ctx = env
    await make_filter(dp, bot, "камри до 1 млн")
    fid = (await ctx.db.filters(USER))[0]["id"]
    saved = [m for m in s.sent if isinstance(m, SendMessage) and m.chat_id == USER][-1]
    assert "Изменить фильтр" in str(saved.reply_markup)                       # кнопка сразу после сохранения
    await dp.feed_update(bot, cb(f"f:e:{fid}"))
    assert "Меняем фильтр #1" in s.texts(USER)[-1] and "<code>камри до 1 млн</code>" in s.texts(USER)[-1]
    await dp.feed_update(bot, msg("солярис до 900к, Москва"))
    await dp.feed_update(bot, cb("f:save"))
    rows = await ctx.db.filters(USER)
    assert len(rows) == 1 and rows[0]["id"] == fid and rows[0]["text"] == "солярис до 900к, Москва"
    assert "Фильтр #1 изменён" in s.texts(USER)[-1]
    assert not (await process(bot, ctx, post(CH1, "Toyota Camry 2012, 950 000 ₽"))).sent      # старый фильтр больше не работает
    assert (await process(bot, ctx, post(CH1, "Hyundai Solaris 2016, 750 000 ₽, Москва"))).sent == [USER]
    await dp.feed_update(bot, cb("f:new"))                                     # новый фильтр после правки — именно новый
    await dp.feed_update(bot, msg("приора до 300к"))
    await dp.feed_update(bot, cb("f:save"))
    assert len(await ctx.db.filters(USER)) == 2


async def test_post_comes_with_car_photo(env):
    """Есть фото — одно сообщение: фото из канала-буфера, карточка в подписи (не длиннее 1024). Нет — обычная карточка."""
    dp, bot, s, ctx = env
    await make_filter(dp, bot, "любые до 2 млн")
    ctx.buffer_chat = -1009999999999

    async def forwarded():
        return 555
    long_text = "Toyota Camry 2014, 1 500 000 ₽, Москва. " + "Состояние отличное, всё работает. " * 80
    r = await process(bot, ctx, RawPost(CH1, next(ids), long_text, time.time() - 1, forwarded))
    assert r.sent == [USER]
    copy = [m for m in s.sent if isinstance(m, CopyMessage)][-1]
    assert (copy.chat_id, copy.from_chat_id, copy.message_id) == (USER, -1009999999999, 555)
    import re
    visible = re.sub(r"<[^>]+>", "", copy.caption)
    assert "Toyota Camry 2014" in visible and "1 500 000 ₽" in visible and len(visible) <= 1024 and visible.rstrip().endswith("…")

    async def forbidden():
        raise RuntimeError("ChatForwardsRestrictedError")
    r = await process(bot, ctx, RawPost(CH1, next(ids), "Hyundai Solaris 2016, 750 000 ₽", time.time() - 1, forbidden))
    assert r.sent == [USER] and "Hyundai Solaris 2016" in s.texts(USER)[-1]          # без фото — обычная карточка


class FakeCreator(FakeTelethon):
    async def __call__(self, request):
        self.calls.append(type(request).__name__)
        if type(request).__name__ == "CreateChannelRequest":
            ch = Channel(id=4242, title=request.title, photo=ChatPhotoEmpty(), date=None, access_hash=99)
            return type("R", (), {"chats": [ch]})()


async def test_reader_creates_photo_channel_once(env):
    dp, bot, s, ctx = env
    reader = Reader(bot, ctx, FakeCreator())
    await reader.ensure_buffer()
    assert reader.client.calls == ["CreateChannelRequest", "EditAdminRequest"]          # создал и сделал бота админом
    assert ctx.buffer_chat == -1004242 and await ctx.db.get_setting("buffer_hash") == "99"
    await reader.ensure_buffer()                                                          # после перезапуска — тот же канал
    assert reader.client.calls == ["CreateChannelRequest", "EditAdminRequest"]


async def test_support_chat_in_bot(env):
    """«❓ Помощь» → «Написать в поддержку» → сообщение уходит админу; ответ админа (Reply) приходит человеку."""
    dp, bot, s, ctx = env
    await dp.feed_update(bot, msg("/start"))
    await dp.feed_update(bot, msg("❓ Помощь"))
    help_msg = [m for m in s.sent if isinstance(m, SendMessage) and m.chat_id == USER][-1]
    assert "Написать в поддержку" in str(help_msg.reply_markup)
    await dp.feed_update(bot, cb("sup"))
    await dp.feed_update(bot, msg("Не приходят машины по фильтру"))
    assert "отправлено менеджеру" in s.texts(USER)[-1]
    head = [m for m in s.sent if isinstance(m, SendMessage) and m.chat_id == ADMIN][-1]
    assert "Обращение в поддержку" in head.text and "id 111" in head.text
    copies = [m for m in s.sent if isinstance(m, CopyMessage) and m.chat_id == ADMIN]
    assert copies and copies[-1].from_chat_id == USER                          # само сообщение человека — копией
    # админ отвечает на шапку обращения
    head_id = (await ctx.db._one("SELECT msg_id FROM support WHERE admin_id=? ORDER BY msg_id LIMIT 1", ADMIN))["msg_id"]
    original = Message(message_id=head_id, date=datetime.now(), chat=Chat(id=ADMIN, type="private"), text="x")
    reply = Update(update_id=next(ids), message=Message(message_id=next(ids), date=datetime.now(), chat=Chat(id=ADMIN, type="private"),
                                                        from_user=user(ADMIN), text="Проверь, что фильтр не на паузе", reply_to_message=original))
    await dp.feed_update(bot, reply)
    assert "Ответ поддержки" in s.texts(USER)[-1]
    to_user = [m for m in s.sent if isinstance(m, CopyMessage) and m.chat_id == USER][-1]
    assert to_user.from_chat_id == ADMIN
    assert any("Ответ отправлен" in t for t in s.texts(ADMIN))
    # обычное сообщение после этого — не в поддержку, а как всегда (похоже на фильтр → карточка)
    await dp.feed_update(bot, msg("камри до 1 млн"))
    assert "Похоже на фильтр" in s.texts(USER)[-1]


async def test_accidents_on_card_and_filter(env):
    dp, bot, s, ctx = env
    await make_filter(dp, bot, "камри до 1 млн")
    assert (await process(bot, ctx, post(CH1, "Toyota Camry 2012, 900 000 ₽, ДТП: 2"))).sent == [USER]
    assert "💥 ДТП: <b>2</b> (со слов продавца)" in s.texts(USER)[-1]
    assert (await process(bot, ctx, post(CH1, "Toyota Camry 2013, 950 000 ₽, без ДТП"))).sent == [USER]
    assert "✅ ДТП: не было" in s.texts(USER)[-1]
    await make_filter(dp, bot, "солярис до 1 млн, без битых", uid=OTHER)
    assert not (await process(bot, ctx, post(CH1, "Hyundai Solaris 2016, 700 000 ₽, 1 мелкое дтп"))).sent   # «без битых» — ДТП отсекает


async def test_ai_check_fixes_rules(env, monkeypatch):
    """ИИ поправляет правила: снимает ложную метку, отсекает «куплю», не тратится на чужие марки; молчит — работают правила."""
    import ai
    dp, bot, s, ctx = env
    object.__setattr__(ctx.cfg, "ai_proxy", True)
    calls = []

    async def fake_ask(d, text, key, model):
        calls.append(text)
        if text.startswith("КУПЛЮ"):
            return {"is_car_sale": False, "markers": [], "accidents": -1}
        if "молчит" in text:
            return None                                                           # таймаут / лимит
        return {"is_car_sale": True, "make": "Toyota", "model": "Camry", "year": 2012, "price_rub": 900000,
                "markers": ["haggle"], "accidents": 0}
    monkeypatch.setattr(ai, "ask", fake_ask)
    await make_filter(dp, bot, "камри до 1 млн")
    r = await process(bot, ctx, post(CH1, "Камри 2012, 900 000 ₽, вложения минимальные, торг"))
    assert r.sent == [USER] and r.listing.parsed_by == "ai"
    assert "требует вложений" not in s.texts(USER)[-1] and "торг" in s.texts(USER)[-1] and "ДТП: не было" in s.texts(USER)[-1]
    assert not (await process(bot, ctx, post(CH1, "КУПЛЮ камри 2012 до 900 000 ₽ в любом состоянии"))).sent
    n = len(calls)
    await process(bot, ctx, post(CH1, "BMW X5 2010, 900 000 ₽"))                 # BMW никто не ищет — ИИ не зовём
    assert len(calls) == n
    r = await process(bot, ctx, post(CH1, "Toyota Camry 2014, 980 000 ₽, Москва"))   # простой пост — без ИИ, без ожидания
    assert len(calls) == n and r.sent == [USER] and r.listing.parsed_by == "rules"
    r = await process(bot, ctx, post(CH1, "Toyota Camry 2011 молчит, 850 000 ₽, требует вложений"))
    assert r.sent == [USER] and r.listing.parsed_by == "rules" and "требует вложений" in s.texts(USER)[-1]


async def test_teaser_not_sent_until_edited_into_sale(env):
    """«Через 5 минут в продаже» — не шлём; канал отредактировал пост в «В ПРОДАЖЕ» — шлём."""
    dp, bot, s, ctx = env
    await make_filter(dp, bot, "камри до 1 млн")
    msg_id = next(ids)
    teaser = "⏳ Через 5 минут в продаже!\nToyota Camry 2012\nЦена 900 000 ₽\nМосква"
    r = await process(bot, ctx, RawPost(CH1, msg_id, teaser, time.time()))
    assert r.teaser and r.sent == [] and await ctx.db.is_teaser(CH1, msg_id)
    sale = "✅ В ПРОДАЖЕ!\nToyota Camry 2012\nЦена 900 000 ₽\nМосква"
    r = await process(bot, ctx, RawPost(CH1, msg_id, sale, time.time()))       # то же сообщение после правки
    assert r.sent == [USER] and not await ctx.db.is_teaser(CH1, msg_id)


class FakePollClient:
    """Канал, в котором можно «публиковать» посты; get_messages отдаёт новые после min_id."""
    def __init__(self):
        from types import SimpleNamespace
        self.ns = SimpleNamespace
        self.posts = [self.ns(id=1, message="старый пост Toyota Camry 2010, 500 000 ₽", photo=None, date=datetime.now())]
        self.calls = 0

    def publish(self, text):
        m = self.ns(id=self.posts[-1].id + 1, message=text, photo=None, date=datetime.now())
        self.posts.append(m)
        return m

    async def get_input_entity(self, chat_id):
        return f"peer{chat_id}"

    async def get_messages(self, peer, limit=10, min_id=0):
        self.calls += 1
        return sorted([m for m in self.posts if m.id > min_id], key=lambda m: -m.id)[:limit]


async def test_polling_catches_posts_and_never_duplicates(env):
    """Бот сам опрашивает канал: старое не шлёт, новое шлёт; тот же пост от Telegram второй раз не уходит."""
    dp, bot, s, ctx = env
    await make_filter(dp, bot, "камри до 1 млн")
    reader = Reader(bot, ctx, FakePollClient())
    await reader.poll_once(CH1)                                   # первый опрос — только запоминаем, где мы
    await asyncio.gather(*reader.tasks)
    assert not any("Toyota Camry 2010" in t for t in s.texts(USER))
    m = reader.client.publish("Toyota Camry 2013, 950 000 ₽, Москва")
    await reader.poll_once(CH1)
    await asyncio.gather(*reader.tasks)
    assert sum("Toyota Camry 2013" in t for t in s.texts(USER)) == 1
    reader._take(CH1, m, None)                                     # тот же пост пришёл push-ем от Telegram
    await asyncio.gather(*reader.tasks)
    assert sum("Toyota Camry 2013" in t for t in s.texts(USER)) == 1
    row = await ctx.db._one("SELECT recv_ms FROM posts ORDER BY id DESC LIMIT 1")
    assert row["recv_ms"] is not None                               # задержка Telegram записана для /admin


async def test_offer_with_requisites(env):
    """Оферта и реквизиты для проверки Робокассой: /offer, кнопка в «Помощи», ссылка в приветствии и при оплате."""
    dp, bot, s, ctx = env
    await dp.feed_update(bot, msg("/start"))
    assert any("/offer" in t for t in s.texts(USER))
    await dp.feed_update(bot, msg("/offer"))
    assert "Реквизиты исполнителя можно запросить" in s.texts(USER)[-1]
    for k, v in (("seller_name", "Иванов Иван Иванович"), ("seller_inn", "123456789012"), ("seller_contact", "ivan@mail.ru")):
        object.__setattr__(ctx.cfg, k, v)
    await dp.feed_update(bot, cb("offer"))
    text = s.texts(USER)[-1]
    assert "Иванов Иван Иванович, ИНН 123456789012" in text and "ivan@mail.ru" in text and "Пробный день — 250 ₽" in text
    assert "PRO — 2490 ₽" in text and len(text) < 4096
    await dp.feed_update(bot, cb("s:pay:pro"))
    assert "условия оферты — /offer" in s.texts(USER)[-1]


async def test_admin_shows_sources_with_payments(env):
    """Ссылки t.me/<бот>?start=<метка> — в /admin видно, сколько людей пришло по каждой и сколько оплатили."""
    dp, bot, s, ctx = env
    await make_filter(dp, bot, "приора до 300к", plan=None)                 # пришёл по ?start=reels
    await dp.feed_update(bot, cb("s:pay:basic"))
    pay = await ctx.db.last_pending(USER)
    ctx.pay.statuses[pay["yk_id"]] = "succeeded"
    await dp.feed_update(bot, cb("s:check"))
    await dp.feed_update(bot, msg("/start avito", OTHER))
    await dp.feed_update(bot, msg("/admin", ADMIN))
    text = s.texts(ADMIN)[-1]
    assert "reels: 1 чел., оплатили 1" in text and "avito: 1 чел., оплатили 0" in text


async def test_only_real_sales_reach_people(env):
    """Курс, проданная машина, новость, анонс — не шлём; обычное объявление — шлём. ИИ выключен — решают правила."""
    dp, bot, s, ctx = env
    await make_filter(dp, bot, "любая машина до 1,5 млн")
    junk = [
        "Друзья, наше обучение будет стоить всего 35.000₽🔥\nЗа 2 месяца выйдешь на доход х3. Старт требует вложений.",
        "⛔️ПРОДАН⛔️\n\n🚘 KIA CERATO, 2009, пробег 180 000 км, за 301 777 ₽",
        "Китайцы выпустили «убийцу Camry» дешевле Lada Granta. Сядьте, джентльмены: BAIC Arcfox S3 представили "
        "в Китае, стоит от 79 900 юаней (около 964 000 ₽)",
        "Завтра ожидайте гранту 2012 года, эур, газ. По цене будет до 165.000₽!!!",
    ]
    for text in junk:
        assert not (await process(bot, ctx, post(CH1, text))).sent, text
    r = await process(bot, ctx, post(CH1, "Продам Гранту 2018 года, один владелец, пробег 90 000 км. Цена 695 000 ₽. 89001234567"))
    assert r.sent == [USER] and r.verdict == "sale"


class ApprovalTelethon(FakeTelethon):
    """Канал по приглашению с одобрением заявок: сначала «заявка отправлена», после одобрения — «вы уже участник»."""
    def __init__(self):
        super().__init__()
        self.approved = False

    async def __call__(self, request):
        self.calls.append(type(request).__name__)
        from telethon import errors
        from telethon.tl.types import ChatInvite, ChatInviteAlready, PhotoEmpty
        name = type(request).__name__
        if name == "ImportChatInviteRequest":
            raise errors.InviteRequestSentError(request=None)
        if name == "CheckChatInviteRequest":
            if self.approved:
                return ChatInviteAlready(chat=Channel(id=901, title="Тачки ниже рынка", photo=ChatPhotoEmpty(), date=None,
                                                      access_hash=1, left=False))
            return ChatInvite(title="Тачки ниже рынка", photo=PhotoEmpty(id=0), participants_count=100, color=0,
                              request_needed=True)
        return await super().__call__(request)


async def test_channel_waits_for_admin_approval(env):
    """Канал с одобрением заявок: не «не получилось», а «ждём админа»; одобрил — подключаем и пишем человеку."""
    dp, bot, s, ctx = env
    await make_filter(dp, bot, "камри до 1,5 млн")
    await dp.feed_update(bot, cb("c:add"))
    await dp.feed_update(bot, msg("@avto_kzn\nhttps://t.me/+AbCdEf123456"))
    reader = Reader(bot, ctx, ApprovalTelethon())
    for _ in range(2):
        await reader.join_one((await ctx.db.queued_channels())[0])
    texts = s.texts(USER)
    assert "пока не добавлен" in texts[-2] and "Тачки ниже рынка" in texts[-2] and "Не получилось" not in texts[-2]
    assert "Подключено: <b>1</b>, ждут одобрения админа: 1" in texts[-1]
    ch = (await ctx.db.awaiting_channels())[0]
    assert ch["status"] == "awaiting" and not await ctx.db.queued_channels()
    await make_filter(dp, bot, "солярис до 1 млн", uid=OTHER)
    await dp.feed_update(bot, cb("c:add", OTHER))
    await dp.feed_update(bot, msg("https://t.me/+AbCdEf123456", OTHER))       # второй человек — тоже ждёт
    assert "пока не добавлен" in s.texts(OTHER)[-1]
    await reader.check_approvals()                                             # админ ещё не одобрил
    assert (await ctx.db.channel(ch["id"]))["status"] == "awaiting"
    reader.client.approved = True
    await reader.check_approvals()
    assert -1000000000901 in ctx.channels
    assert "одобрил заявку" in s.texts(USER)[-1] and "одобрил заявку" in s.texts(OTHER)[-1]
    await reader.check_approvals()                                             # повторно не пишем
    assert sum("одобрил заявку" in t for t in s.texts(USER)) == 1
