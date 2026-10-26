"""Сквозная проверка воронки без Telegram: апдейты идут в диспетчер, ответы бота перехватывает подменная сессия."""
import itertools
import time
from datetime import datetime
from pathlib import Path

import pytest
from aiogram import Bot
from aiogram.client.session.base import BaseSession
from aiogram.fsm.storage.memory import MemoryStorage
from aiogram.methods import AnswerCallbackQuery, EditMessageReplyMarkup, EditMessageText, SendMessage, SendPhoto
from aiogram.types import CallbackQuery, Chat, Message, PhotoSize, Update, User

from bot import reminders
from bot.__main__ import build_dispatcher
from bot.config import Config
from bot.ctx import Ctx
from bot.db import DB
from bot.offers import load_catalog

ROOT = Path(__file__).resolve().parents[1]
USER, ADMIN = 111, 999
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
        if isinstance(method, (SendMessage, SendPhoto, EditMessageText)):
            return Message(message_id=next(ids), date=datetime.now(), chat=Chat(id=getattr(method, "chat_id", USER) or USER, type="private"),
                           text=getattr(method, "text", None) or getattr(method, "caption", None) or "")
        return True

    async def stream_content(self, *a, **k):
        yield b""

    async def close(self):
        pass

    def texts(self, chat_id=None):
        return [getattr(m, "text", None) or getattr(m, "caption", "") for m in self.sent
                if isinstance(m, (SendMessage, SendPhoto, EditMessageText)) and (chat_id is None or m.chat_id == chat_id)]


def user(uid=USER):
    return User(id=uid, is_bot=False, first_name="Тест", username="test")


def msg(text=None, uid=USER, photo=False):
    return Update(update_id=next(ids), message=Message(
        message_id=next(ids), date=datetime.now(), chat=Chat(id=uid, type="private"), from_user=user(uid), text=text,
        photo=[PhotoSize(file_id="PHOTO", file_unique_id="u", width=10, height=10)] if photo else None))


def cb(data, uid=USER):
    m = Message(message_id=next(ids), date=datetime.now(), chat=Chat(id=uid, type="private"), from_user=user(uid), text="x")
    return Update(update_id=next(ids), callback_query=CallbackQuery(id=str(next(ids)), from_user=user(uid), chat_instance="c", data=data, message=m))


DP = None   # роутеры живут на уровне модулей и подключаются к диспетчеру один раз — один диспетчер на все тесты


@pytest.fixture
async def env(tmp_path):
    global DP
    cfg = Config(token="1:x", admins=frozenset({ADMIN}), db_path=tmp_path / "f.db", offers_path=ROOT / "offers.yaml",
                 min_payout=300, privacy_url="https://example.com/privacy")
    ctx = Ctx(db=await DB(cfg.db_path).open(), cfg=cfg, catalog=load_catalog(cfg.offers_path))
    try:
        DP = DP or build_dispatcher(ctx)
        DP["ctx"] = ctx
        DP.fsm.storage = MemoryStorage()   # состояния диалогов — заново для каждого теста
        session = FakeSession()
        yield DP, Bot("1:x", session=session), session, ctx
    finally:
        await ctx.db.close()


async def test_full_funnel(env):
    dp, bot, s, ctx = env
    feed = lambda u: dp.feed_update(bot, u)
    await feed(msg("/start reels"))
    assert "Как это работает" in s.texts(USER)[-1]
    await feed(cb("go")); await feed(cb("age:y")); await feed(cb("ok"))
    await feed(cb("qb:alfa")); await feed(cb("qb:alfa")); await feed(cb("qb:tbank"))   # Альфу отметил и снял, Т-Банк — клиент
    await feed(cb("qdone"))
    assert "доступно акций: <b>1</b>" in " ".join(s.texts(USER))                     # осталась только Альфа
    await feed(cb("o:alfa_credit")); await feed(cb("lnk:alfa_credit"))
    assert len(await ctx.db.due_reminders(time.time() + 4 * 24 * 3600)) == 3            # три дожима поставлены
    await feed(cb("done:alfa_credit"))
    await feed(msg("Иван П.")); await feed(msg("12a")); await feed(msg("1234")); await feed(msg("текст вместо скрина")); await feed(msg(photo=True))
    assert any("Заявка #1" in t for t in s.texts(ADMIN))                                 # админу пришёл скрин с кнопками
    assert not [r for r in await ctx.db.due_reminders(time.time() + 4 * 24 * 3600) if r["kind"] == "nudge"]   # дожимы сняты
    await feed(cb("ca:1", uid=ADMIN))
    assert await ctx.db.balance(USER) == 500
    await feed(cb("ca:1", uid=USER))                                                    # не админ — кнопка ничего не делает
    await feed(msg("💰 Баланс")); await feed(cb("wd")); await feed(msg("8 999 123-45-67")); await feed(msg("Сбер"))
    assert await ctx.db.balance(USER) == 0
    assert any("Вывод #1: 500 ₽" in t and "+79991234567" in t for t in s.texts(ADMIN))
    await feed(cb("pp:1", uid=ADMIN))
    funnel = dict(await ctx.db.funnel())
    assert funnel["Получили выплату"] == 1 and funnel["Запустили бота"] == 1
    assert (await ctx.db.user(USER))["source"] == "reels"


async def test_nudge_and_admin_stats(env):
    dp, bot, s, ctx = env
    feed = lambda u: dp.feed_update(bot, u)
    await feed(msg("/start")); await feed(cb("go")); await feed(cb("age:y")); await feed(cb("ok")); await feed(cb("qdone"))
    await feed(cb("lnk:tbank_debit"))
    await ctx.db._run("UPDATE reminders SET due_at=0 WHERE kind='nudge'")               # «прошло» 3 дня
    assert await reminders.tick(bot, ctx) == 3
    assert "ещё не прислал подтверждение" in s.texts(USER)[-3]
    await feed(msg("/admin", uid=ADMIN))
    assert "Взяли ссылку: <b>1</b>" in s.texts(ADMIN)[-1]
    await feed(msg("/admin"))                                                            # не админ — тишина
    assert "Воронка" not in s.texts(USER)[-1]


async def test_under_18_stops(env):
    dp, bot, s, ctx = env
    await dp.feed_update(bot, msg("/start")); await dp.feed_update(bot, cb("go")); await dp.feed_update(bot, cb("age:n"))
    assert "рано" in s.texts(USER)[-1]
    assert not (await ctx.db.user(USER))["consent"]
