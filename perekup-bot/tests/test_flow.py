"""Сквозная проверка без Telegram: апдейты идут в диспетчер aiogram, посты — в pipeline, ответы бота перехватывает
подменная сессия, служебный аккаунт и ЮKassa — заглушки."""
import asyncio
import itertools
import time
from datetime import datetime
from pathlib import Path

import pytest
from aiogram import Bot
from aiogram.client.session.base import BaseSession
from aiogram.fsm.storage.memory import MemoryStorage
from aiogram.methods import AnswerCallbackQuery, EditMessageReplyMarkup, EditMessageText, SendMessage
from aiogram.types import CallbackQuery, Chat, Message, Update, User
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
        if isinstance(method, (SendMessage, EditMessageText)):
            return Message(message_id=next(ids), date=datetime.now(), chat=Chat(id=method.chat_id or USER, type="private"),
                           text=method.text)
        return True

    async def stream_content(self, *a, **k):
        yield b""

    async def close(self):
        pass

    def texts(self, chat_id):
        return [m.text for m in self.sent if isinstance(m, (SendMessage, EditMessageText)) and m.chat_id == chat_id]


class FakePay:
    def __init__(self):
        self.statuses: dict[str, str] = {}

    async def create(self, uid):
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
                 yk_shop_id="shop", yk_secret="secret")
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


async def make_filter(dp, bot, text, uid=USER):
    await dp.feed_update(bot, msg("/start reels", uid))
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
    assert r.sent == [USER] and r.discount == 17 and not r.scam
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


async def test_scam_warning(env):
    dp, bot, s, ctx = env
    await make_filter(dp, bot, "любые до 1 млн")
    r = await process(bot, ctx, post(CH1, "Toyota RAV4 2019 всего 900 000 ₽! Дистанционное оформление, доставка в любой регион"))
    assert r.scam and r.sent == [USER]
    assert "похоже на мошенников" in s.texts(USER)[-1] and "дистанционно" in s.texts(USER)[-1]


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
    assert "подключаю" in reply and "уже есть в общей базе" in reply and "не похоже на ссылку" in reply
    queued = await ctx.db.queued_channels()
    assert [q["username"] for q in queued] == ["new_cars_spb"]


async def test_no_access_missed_then_payment(env):
    dp, bot, s, ctx = env
    await make_filter(dp, bot, "приора до 300к")
    await ctx.db._run("UPDATE users SET trial_until=0 WHERE id=?", USER)     # пробный период кончился
    r = await process(bot, ctx, post(CH1, "Приора 2011, 260 000 руб"))
    assert r.sent == []
    await dp.feed_update(bot, msg("💳 Подписка"))
    assert "не активна" in s.texts(USER)[-1]

    await dp.feed_update(bot, cb("s:pay"))
    pid = (await ctx.db.last_pending(USER))["yk_id"]
    await dp.feed_update(bot, cb("s:check"))                              # ещё не оплатил
    assert (await ctx.db.user(USER))["paid_until"] == 0
    ctx.pay.statuses[pid] = "succeeded"
    await dp.feed_update(bot, cb("s:check"))
    await dp.feed_update(bot, cb("s:check"))                              # повторное нажатие не продлевает второй раз
    u = await ctx.db.user(USER)
    assert 29 * 86400 < u["paid_until"] - time.time() <= 30 * 86400
    assert any("Оплата прошла" in t for t in s.texts(USER))
    assert (await process(bot, ctx, post(CH1, "Приора 2012, 280 000 руб"))).sent == [USER]


async def test_jobs_access_reminder(env):
    dp, bot, s, ctx = env
    await make_filter(dp, bot, "веста до 1 млн")
    await ctx.db._run("UPDATE users SET trial_until=? WHERE id=?", time.time() + 3600, USER)
    await jobs.tick(bot, ctx)
    await jobs.tick(bot, ctx)                                               # второй раз — не дублируем
    assert sum("Завтра заканчивается доступ" in t for t in s.texts(USER)) == 1


class FakeTelethon:
    """Минимум клиента Telethon для вступления в канал."""
    def __init__(self):
        self.calls = []

    async def get_entity(self, username):
        return Channel(id=777, title="Авто Казань", photo=ChatPhotoEmpty(), date=None, access_hash=1, username=username)

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
    assert "Канал «Авто Казань» подключён" in s.texts(USER)[-1]


async def test_free_mode_without_yookassa(env):
    """ЮKassa не настроена — бот бесплатный для всех, первый написавший /start — админ."""
    dp, bot, s, ctx = env
    object.__setattr__(ctx.cfg, "yk_shop_id", "")
    object.__setattr__(ctx.cfg, "admins", frozenset())
    await make_filter(dp, bot, "приора до 300к")
    await ctx.db._run("UPDATE users SET trial_until=0 WHERE id=?", USER)
    assert (await process(bot, ctx, post(CH1, "Приора 2011, 260 000 руб"))).sent == [USER]
    await dp.feed_update(bot, msg("💳 Подписка"))
    assert "бесплатно" in s.texts(USER)[-1]
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
