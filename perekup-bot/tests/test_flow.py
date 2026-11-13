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
from aiogram.methods import AnswerCallbackQuery, CopyMessage, CopyMessages, EditMessageReplyMarkup, EditMessageText, ForwardMessage, GetMe, SendMediaGroup, SendMessage, SendPhoto
from aiogram.types import CallbackQuery, Chat, Message, MessageId, PhotoSize, Update, User
from telethon.tl.types import Channel, ChatPhotoEmpty

import jobs
import texts as T
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
        if isinstance(method, CopyMessages):
            return [MessageId(message_id=next(ids)) for _ in method.message_ids]
        if isinstance(method, GetMe):
            return User(id=42, is_bot=True, first_name="Перехват", username="perekhvat_bot")
        if isinstance(method, (SendMessage, EditMessageText)):
            return Message(message_id=next(ids), date=datetime.now(), chat=Chat(id=method.chat_id or USER, type="private"),
                           text=method.text)
        if isinstance(method, SendMediaGroup):
            return [Message(message_id=next(ids), date=datetime.now(), chat=Chat(id=method.chat_id, type="private"),
                            photo=[PhotoSize(file_id=f"wp{k}", file_unique_id="u", width=900, height=1000)]) for k in range(len(method.media))]
        if isinstance(method, ForwardMessage):
            return Message(message_id=next(ids), date=datetime.now(), chat=Chat(id=method.chat_id, type="channel"),
                           photo=[PhotoSize(file_id=f"src{method.message_id}", file_unique_id="u", width=1280, height=960)])
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


async def make_filter(dp, bot, text, uid=USER, plan="pro", trial_used=False):
    """Человек с оплаченным тарифом (по умолчанию PRO) создаёт фильтр. trial_used — пробный день он уже брал."""
    await dp.feed_update(bot, msg("/start reels", uid))
    ctx = dp["ctx"]
    if plan:
        await ctx.db.set_user(uid, paid_until=time.time() + 30 * 86400, plan=plan)
    if trial_used:
        await ctx.db.set_user(uid, trial_used=1)
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
    welcome = next(t for t in s.texts(USER) if "<b>Перехват</b> — бот" in t)
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
    await make_filter(dp, bot, "приора до 300к", plan=None, trial_used=True)     # пробный день уже брал
    assert "выбери тариф" in s.texts(USER)[-1] and "Пробный день — бесплатно" not in s.texts(USER)[-1]
    assert (await process(bot, ctx, post(CH1, "Приора 2011, 260 000 руб"))).sent == []
    await dp.feed_update(bot, msg("💳 Подписка"))
    assert "Твой тариф" not in s.texts(USER)[-1] and "Простой — 1390 ₽" in s.texts(USER)[-1] and "PRO — 2490 ₽" in s.texts(USER)[-1]
    assert isinstance(s.sent[-1], SendPhoto)                              # тарифы — картинкой-сравнением

    await dp.feed_update(bot, cb("s:pay:basic"))
    pay = await ctx.db.last_pending(USER)
    assert (pay["amount"], pay["plan"]) == (1390, "basic")
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
    """Пробный день — 500 ₽ (владелец 13.11): под фото приветствия «Хочу попробовать» → предложение + «Другие тарифы»; после оплаты — 24 часа,
    один раз; в нём 1 фильтр; «Простой» — до 2 фильтров; переход на PRO не сжигает дни."""
    from user import apply_payment
    dp, bot, s, ctx = env
    await dp.feed_update(bot, msg("/start"))
    assert not any("Дарю тебе пробный день" in t for t in s.texts(USER))   # бесплатного подарка больше нет
    tries = [m for m in s.sent if isinstance(m, SendMessage) and m.chat_id == USER and m.text == T.TRY_PROMPT]
    assert len(tries) == 1 and [b.callback_data for row in tries[0].reply_markup.inline_keyboard for b in row] == ["s:try"]
    await dp.feed_update(bot, cb("s:try"))
    last = [m for m in s.sent if isinstance(m, SendMessage) and m.chat_id == USER][-1]
    assert "Попробуй «Перехват» целый день — 500 ₽" in last.text
    assert [b.callback_data for row in last.reply_markup.inline_keyboard for b in row] == ["s:pay:trial", "s:plans"]
    await dp.feed_update(bot, cb("s:pay:trial"))
    pay = await ctx.db.last_pending(USER)
    assert pay and pay["amount"] == 500 and pay["plan"] == "trial" and (await ctx.db.user(USER))["paid_until"] < time.time()   # без оплаты не включается
    await apply_payment(ctx, USER, pay["yk_id"], "succeeded")
    u = await ctx.db.user(USER)
    assert u["trial_used"] == 1 and u["plan"] == "trial" and 23 * 3600 < u["paid_until"] - time.time() <= 24 * 3600
    await dp.feed_update(bot, msg("камри до 1 млн")); await dp.feed_update(bot, cb("f:save"))
    await dp.feed_update(bot, msg("солярис до 900к")); await dp.feed_update(bot, cb("f:save"))
    assert len(await ctx.db.filters(USER)) == 1 and "«Пробный день» — 1 фильтр" in s.texts(USER)[-1]   # в пробном — один фильтр
    await ctx.db.delete_filter(USER, (await ctx.db.filters(USER))[0]["id"])
    await ctx.db.set_user(USER, paid_until=time.time() - 1)                 # день прошёл
    await dp.feed_update(bot, cb("s:pay:trial"))                            # второй раз — нельзя
    assert "только один раз" in s.texts(USER)[-1]

    await ctx.db.set_user(USER, paid_until=time.time() + 10 * 86400, plan="basic")   # «Простой», осталось 10 дней
    for t in ("солярис до 900к", "приора до 300к", "веста до 1 млн"):
        await dp.feed_update(bot, msg(t)); await dp.feed_update(bot, cb("f:save"))
    assert len(await ctx.db.filters(USER)) == 2 and "до 2 фильтров" in s.texts(USER)[-1]   # третий — только в PRO

    await dp.feed_update(bot, cb("s:pay:pro"))
    pay = await ctx.db.last_pending(USER)
    assert pay["amount"] == 2490 and "пересчитаем" in s.texts(USER)[-1]
    ctx.pay.statuses[pay["yk_id"]] = "succeeded"
    await dp.feed_update(bot, cb("s:check"))
    u = await ctx.db.user(USER)
    days = (u["paid_until"] - time.time()) / 86400
    assert u["plan"] == "pro" and 35.4 < days < 35.7                        # 30 дней PRO + 10 дней «Простого» ≈ 5,58 дня PRO
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
    assert reader.client.calls == ["JoinChannelRequest", "UpdateNotifySettingsRequest", "EditPeerFoldersRequest"]
    assert -1000000000777 in ctx.channels
    row = await ctx.db.channel(cid)
    assert row["muted"] == 1 and row["archived"] == 1                                      # без уведомлений, в архиве
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


async def test_welcome_photos_after_start(env):
    """После /start — приветствие и альбом из фото-примеров (папка welcome/); второй раз — те же фото по file_id, без загрузки."""
    from aiogram.types import FSInputFile
    dp, bot, s, ctx = env
    await dp.feed_update(bot, msg("/start", USER))
    album = [m for m in s.sent if isinstance(m, SendMediaGroup) and m.chat_id == USER]
    n = len(list((Path(__file__).parents[1] / "welcome").glob("*.jpg")))
    assert n >= 5 and len(album) == 1 and len(album[0].media) == n
    assert all(isinstance(m.media, FSInputFile) for m in album[0].media) and album[0].media[0].caption == T.WELCOME_PHOTOS
    i_welcome = next(i for i, m in enumerate(s.sent) if isinstance(m, SendMessage) and m.chat_id == USER and "бот, который ловит" in m.text)
    assert i_welcome < s.sent.index(album[0])                                    # сначала текст, потом фото
    await dp.feed_update(bot, msg("/start", OTHER))
    album = [m for m in s.sent if isinstance(m, SendMediaGroup) and m.chat_id == OTHER]
    assert [m.media for m in album[0].media] == [f"wp{k}" for k in range(n)]      # уже загруженные — по file_id


def test_dkp_parse_words_and_files():
    """Шаблон «поле: значение» разбирается (длинные подписи раньше коротких), сумма прописью, Word и PDF собираются."""
    import dkp
    d = dkp.parse("Продавец ФИО: Иванов Пётр Сергеевич\nПродавец паспорт: 9205 123456\nПродавец паспорт выдан: МВД, 14.05.2020\n"
                  "Покупатель: Смирнов С. О.\nVIN: JT2AE09B000000001\nМарка, модель: Toyota Corolla\nЦена: 350к\nЧто-то лишнее")
    assert d["seller_passport"] == "9205 123456" and d["seller_issued"] == "МВД, 14.05.2020" and d["buyer_name"] == "Смирнов С. О."
    assert d["price"] == "350000" and d["car"] == "Toyota Corolla"
    assert dkp.words(1_250_000) == "один миллион двести пятьдесят тысяч" and dkp.words(21_001) == "двадцать одна тысяча один"
    text = " ".join(t for _, t in dkp.paragraphs(d))
    assert "350 000 (триста пятьдесят тысяч) рублей" in text and "/ Иванов П. С. /" in text and dkp.BLANK in text   # чего нет — линия
    assert dkp.docx_bytes(d)[:2] == b"PK" and dkp.pdf_bytes(d)[:4] == b"%PDF"


async def test_dkp_in_bot_pro_only(env):
    """«📝 Договор купли-продажи»: на «Простом» — предложение PRO; на PRO — шаблон, разбор, Word + PDF; данные не остаются."""
    from aiogram.methods import SendDocument
    dp, bot, s, ctx = env
    await dp.feed_update(bot, msg("/start", ADMIN))
    await dp.feed_update(bot, msg("/start", USER))
    await ctx.db.set_user(USER, paid_until=time.time() + 86400 * 30, plan="basic")
    await dp.feed_update(bot, msg(T.MENU_DKP, USER))
    assert "в тарифе <b>PRO</b>" in s.texts(USER)[-1]
    await ctx.db.set_user(USER, paid_until=time.time() + 86400 * 30, plan="pro")
    await dp.feed_update(bot, msg(T.MENU_DKP, USER))
    assert "в договоре есть всегда" in s.texts(USER)[-1]                               # сначала выбор: бот или от руки
    await dp.feed_update(bot, cb("dkp:without", USER))
    assert "от руки" in s.texts(USER)[-1] and "Продавец паспорт:" not in s.texts(USER)[-1]
    await dp.feed_update(bot, msg("Продавец паспорт: 9205 123456\nПродавец ФИО: Иванов Пётр", USER))
    assert "9205" not in s.texts(USER)[-1]                                            # выбрал «от руки» — паспорт не вписываем
    import dkp
    assert "паспорт " + dkp.BLANK in " ".join(t for _, t in dkp.paragraphs({"seller_name": "Иванов Пётр"}))   # строка в договоре есть всегда
    await dp.feed_update(bot, cb("dkp:reset", USER)); await dp.feed_update(bot, cb("dkp:with", USER))
    assert "Продавец паспорт:" in s.texts(USER)[-1] and "не сохраняю" in s.texts(USER)[-1]
    await dp.feed_update(bot, msg("Продавец ФИО: Иванов Пётр\nМарка, модель: Kia Rio\nЦена: 650 000\nVIN: Z94CB41AAER000001", USER))
    t = s.texts(USER)[-1]
    assert "Kia Rio" in t and "650 000 ₽" in t and "Не хватает" in t and "Покупатель ФИО" in t and "паспорт" not in t.split("Не хватает")[1]
    await dp.feed_update(bot, msg("Покупатель ФИО: Смирнов Сергей", USER))           # паспорта — по желанию, без них «всё главное есть»
    assert "Всё главное есть" in s.texts(USER)[-1]                                    # дописал — данные сложились
    await dp.feed_update(bot, cb("dkp:make", USER))
    docs = [m for m in s.sent if isinstance(m, SendDocument) and m.chat_id == USER]
    assert [d.document.filename.rsplit(".", 1)[1] for d in docs] == ["docx", "pdf"] and docs[0].document.filename.startswith("DKP_Kia_Rio_")
    assert await dp.fsm.storage.get_data(key=__import__("aiogram").fsm.storage.base.StorageKey(bot_id=bot.id, chat_id=USER, user_id=USER)) == {}
    await dp.feed_update(bot, msg("камри до 1,5 млн", USER))                           # дальше текст — снова фильтр, а не договор
    assert "Похоже на фильтр" in s.texts(USER)[-1]
    await dp.feed_update(bot, msg(T.MENU_DKP, USER)); await dp.feed_update(bot, cb("dkp:blank", USER))   # пустой бланк — сразу с выбора
    assert len([m for m in s.sent if isinstance(m, SendDocument) and m.chat_id == USER]) == 4


async def test_motorcycle_sent_with_label(env):
    """Мотоцикл приходит тем, у кого фильтр без марки, — с подписью «🏍 Мотоцикл · Ducati Panigale 899»; фильтру «камри» — нет."""
    dp, bot, s, ctx = env
    await make_filter(dp, bot, "любые до 1,5 млн", uid=USER)
    await make_filter(dp, bot, "камри до 1,5 млн", uid=OTHER)
    r = await process(bot, ctx, post(CH1, "Ducati Panigale 899\nСпортбайк, АБС.\n2015г\n18.000 пробега.\n850.000₽\n+79620202299"))
    assert r.sent == [USER] and "🏍 Мотоцикл · Ducati Panigale 899 2015" in s.texts(USER)[-1] and "Ducato" not in s.texts(USER)[-1]


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
    """«✉️ Написать в поддержку» в меню → сообщение уходит админу; ответ админа (Reply) приходит человеку."""
    dp, bot, s, ctx = env
    await dp.feed_update(bot, msg("/start"))
    kb = [b.text for row in [m for m in s.sent if isinstance(m, SendMessage) and m.chat_id == USER][0].reply_markup.keyboard for b in row]
    assert T.MENU_SUPPORT in kb and T.MENU_IDEA not in kb
    await dp.feed_update(bot, msg(T.MENU_SUPPORT))
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


async def test_support_link_to_work_account(env):
    """Аккаунт поддержки задан (/support @…) — «Написать в поддержку» открывает личный чат с ним; /support off — снова через бота."""
    dp, bot, s, ctx = env
    await dp.feed_update(bot, msg("/start", uid=ADMIN))
    await dp.feed_update(bot, msg("/support @Perekhvat_Help", uid=ADMIN))
    assert "@Perekhvat_Help" in s.texts(ADMIN)[-1]
    await dp.feed_update(bot, msg("/start"))
    await dp.feed_update(bot, msg(T.MENU_SUPPORT))
    help_msg = [m for m in s.sent if isinstance(m, SendMessage) and m.chat_id == USER][-1]
    btn = help_msg.reply_markup.inline_keyboard[0][0]
    assert btn.url == "https://t.me/Perekhvat_Help" and not btn.callback_data
    await dp.feed_update(bot, cb("sup"))                                   # старая кнопка в чате — тоже ссылка, а не переписка
    last = [m for m in s.sent if isinstance(m, SendMessage) and m.chat_id == USER][-1]
    assert last.reply_markup.inline_keyboard[0][0].url == "https://t.me/Perekhvat_Help"
    await dp.feed_update(bot, msg("/support нет такого!", uid=ADMIN))
    assert "Не похоже" in s.texts(ADMIN)[-1]
    await dp.feed_update(bot, msg("/support off", uid=ADMIN))
    await dp.feed_update(bot, msg(T.MENU_SUPPORT))
    help_msg = [m for m in s.sent if isinstance(m, SendMessage) and m.chat_id == USER][-1]
    assert help_msg.text == T.SUPPORT_ASK and help_msg.reply_markup.inline_keyboard[0][0].callback_data == "sup:x"
    await dp.feed_update(bot, msg("/support @Perekhvat_Help", uid=USER))      # не админ — ничего не меняет
    assert await ctx.db.get_setting("support_username") == "-"


async def test_support_falls_back_to_reader_account(env):
    """Аккаунт не задан — кнопка ведёт к служебному аккаунту (его @ бот запомнил при подключении)."""
    dp, bot, s, ctx = env
    await ctx.db.set_setting("reader_username", "perekhvat_reader")
    await dp.feed_update(bot, msg("/start"))
    await dp.feed_update(bot, msg(T.MENU_SUPPORT))
    help_msg = [m for m in s.sent if isinstance(m, SendMessage) and m.chat_id == USER][-1]
    assert help_msg.reply_markup.inline_keyboard[0][0].url == "https://t.me/perekhvat_reader"


async def test_accidents_on_card_and_filter(env):
    dp, bot, s, ctx = env
    await make_filter(dp, bot, "камри до 1 млн")
    assert (await process(bot, ctx, post(CH1, "Toyota Camry 2012, 900 000 ₽, ДТП: 2"))).sent == [USER]
    assert "💥 ДТП: <b>2</b> (со слов продавца)" in s.texts(USER)[-1]
    assert (await process(bot, ctx, post(CH1, "Toyota Camry 2013, 950 000 ₽, без ДТП"))).sent == [USER]
    assert "✅ ДТП: не было" in s.texts(USER)[-1]
    await make_filter(dp, bot, "солярис до 1 млн, без битых", uid=OTHER)
    assert not (await process(bot, ctx, post(CH1, "Hyundai Solaris 2016, 700 000 ₽, 1 мелкое дтп"))).sent   # «без битых» — ДТП отсекает


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
    assert "Иванов Иван Иванович, ИНН 123456789012" in text and "ivan@mail.ru" in text and "Пробный день — 500 ₽ за 1 день" in text
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


async def test_admin_moves_own_channels_to_base(env):
    """Админ добавил каналы себе через «📢 Каналы» — /tobase делает их общими: посты идут всем, не только ему."""
    dp, bot, s, ctx = env
    await make_filter(dp, bot, "камри до 1,5 млн", uid=ADMIN)
    await make_filter(dp, bot, "камри до 1,5 млн", uid=USER)
    await ctx.db.set_channel_state(ADMIN, (await ctx.db.channel_by_tg(OWN))["id"], "own")
    assert (await process(bot, ctx, post(OWN, "Toyota Camry 2012, 1 100 000 ₽"))).sent == [ADMIN]   # пока только у админа
    await dp.feed_update(bot, msg("/tobase", ADMIN))
    assert "перенесено каналов: 1" in s.texts(ADMIN)[-1] and "My Secret Cars" in s.texts(ADMIN)[-1]
    r = await process(bot, ctx, post(OWN, "Toyota Camry 2013, 1 200 000 ₽"))
    assert sorted(r.sent) == sorted([USER, ADMIN])
    await dp.feed_update(bot, msg("/tobase", USER))                                          # не админ — молчим
    assert not any("перенесено" in t for t in s.texts(USER))


async def test_admin_adds_channels_straight_to_base(env):
    """Админ присылает каналы через «📢 Каналы» — они сразу в общей базе для всех, без лимитов тарифа."""
    dp, bot, s, ctx = env
    await make_filter(dp, bot, "камри до 1,5 млн", uid=ADMIN, plan="basic")       # у «Простого» своих каналов нет
    await make_filter(dp, bot, "камри до 1,5 млн", uid=USER)
    await dp.feed_update(bot, cb("c:add", ADMIN))
    assert "общую базу" in s.texts(ADMIN)[-1]
    await dp.feed_update(bot, msg("@my_secret_cars\n@avto_kzn", ADMIN))
    reply = s.texts(ADMIN)[-1]
    assert "Получил ссылок: <b>2</b>" in reply and "Уже были в базе и работают: 1" in reply and "My Secret Cars" in reply
    assert "Взял в работу: 1" in reply and "@avto_kzn" in reply and "PRO" not in reply
    r = await process(bot, ctx, post(OWN, "Toyota Camry 2013, 1 200 000 ₽"))
    assert sorted(r.sent) == [USER, ADMIN] and not r.delayed                       # админ всегда PRO — сразу
    assert (await ctx.db.queued_channels())[0]["base"] == 1
    await dp.feed_update(bot, cb("c:add"))                                          # обычный человек — как раньше, себе
    assert "общую базу" not in s.texts(USER)[-1]


class SimilarTelethon(FakeTelethon):
    """«Похожие каналы»: автоканал, который постит каждый день, автоканал-молчун, нерелевантный и уже известный."""
    async def get_input_entity(self, chat_id):
        return chat_id

    async def __call__(self, request):
        self.calls.append(type(request).__name__)
        from telethon.tl.types.messages import Chats
        ch = lambda i, u, t, n: Channel(id=i, title=t, photo=ChatPhotoEmpty(), date=None, access_hash=1, username=u,
                                        participants_count=n)
        return Chats(chats=[ch(501, "avto_daily", "Авторынок Тест", 12000), ch(502, "avto_sleepy", "Авто ниже рынка", 9000),
                            ch(503, "cooking", "Рецепты", 50000), ch(504, "avto_msk", "Уже в базе", 7000)])

    async def get_messages(self, username, limit=60):
        from types import SimpleNamespace
        from datetime import timedelta, timezone
        now = datetime.now(timezone.utc)
        days = range(1, 9) if username == "avto_daily" else [20]
        return [SimpleNamespace(date=now - timedelta(days=d)) for d in days]


async def test_admin_finds_similar_channels(env):
    """/similar: похожие каналы от Telegram → только автомобильные и новые, активные отмечены и попадают в /add."""
    import asyncio
    dp, bot, s, ctx = env
    reader = Reader(bot, ctx, SimilarTelethon())
    reader.runner = asyncio.get_running_loop().create_future()                 # «онлайн»
    ctx.reader = reader
    rows = await reader.similar({"avto_msk"})
    names = {r["username"]: r for r in rows}
    assert set(names) == {"avto_daily", "avto_sleepy"} and names["avto_daily"]["hits"] == 2      # два канала базы
    assert names["avto_daily"]["weekdays"] >= 4 and names["avto_sleepy"]["weekdays"] == 0
    await dp.feed_update(bot, msg("/similar", ADMIN))
    await asyncio.gather(*ctx.background)
    text = s.texts(ADMIN)[-1]
    assert "✅ @avto_daily" in text and "/add @avto_daily" in text and "@avto_sleepy" in text.split("/add")[0]
    assert "cooking" not in text and "/add @avto_daily @avto_sleepy" not in text


async def test_already_joined_channels_get_muted(env):
    """Каналы, в которые служебный аккаунт вступил раньше, при запуске тоже глушатся и уходят в архив — один раз."""
    import userbot
    dp, bot, s, ctx = env
    reader = Reader(bot, ctx, FakeTelethon())

    async def no_sleep(_):
        pass
    orig, userbot.asyncio.sleep = userbot.asyncio.sleep, no_sleep
    try:
        reader.client.get_input_entity = lambda chat_id: _same(chat_id)
        await ctx.db._run("UPDATE channels SET muted=1, archived=0")                   # заглушены прошлой версией, не в архиве
        await reader.mute_all()
        assert reader.client.calls == ["EditPeerFoldersRequest"]                        # все три — одной пачкой в архив
        await ctx.db._run("UPDATE channels SET muted=0, archived=0")
        reader.client.calls.clear()
        await reader.mute_all()
        assert reader.client.calls.count("UpdateNotifySettingsRequest") == 3 and reader.client.calls.count("EditPeerFoldersRequest") == 3
        await reader.mute_all()
        assert len(reader.client.calls) == 6                                            # второй раз — не трогаем
    finally:
        userbot.asyncio.sleep = orig


async def _same(x):
    return x


# ---------- ВКонтакте ----------
from aiogram.methods import DeleteMessage
from ctx import VK_KEY
from links import parse_link
from vk import VKError, VKReader


class FakeVK:
    """API ВК: открытое сообщество avto_kzn (777) и закрытое club888 — вступление по одобрению."""
    def __init__(self):
        self.calls: list = []
        self.groups = [{"id": 777, "name": "Авто Казань", "screen_name": "avto_kzn", "is_closed": 0, "is_member": 0},
                       {"id": 888, "name": "Тачки ВК", "screen_name": "club888", "is_closed": 1, "is_member": 0}]
        self.feed: list = []
        self.wall: dict = {}

    def find(self, ref):
        return next((g for g in self.groups if str(ref) in (g["screen_name"], str(g["id"]))), None)

    async def call(self, method, **p):
        self.calls.append(method)
        if method == "users.get":
            return [{"first_name": "Служебная", "last_name": "Страница"}]
        if method == "groups.getById":
            refs = str(p.get("group_ids") or p.get("group_id")).split(",")
            gs = [dict(g) for g in map(self.find, refs) if g]
            if len(gs) < len(refs):                  # как ВК: хоть одно несуществующее — ошибка на всю пачку
                raise VKError(100, "invalid group id")
            return {"groups": gs}
        if method == "groups.join":
            g = self.find(p["group_id"])
            g["is_member"] = int(not g["is_closed"])
            return 1
        if method == "newsfeed.get":
            return {"items": [i for i in self.feed if i["date"] >= p["start_time"]]}
        if method == "wall.get":
            return {"items": self.wall.get(-p["owner_id"], [])}


def vk_post(gid, pid, text, photo=False):
    item = {"source_id": -gid, "post_id": pid, "id": pid, "date": int(time.time()) - 2, "text": text}
    if photo:
        item["attachments"] = [{"type": "photo", "photo": {"sizes": [
            {"width": 130, "url": "https://sun.userapi.com/s.jpg"}, {"width": 1080, "url": "https://sun.userapi.com/m.jpg"},
            {"width": 2560, "url": "https://sun.userapi.com/w.jpg"}]}}]
    return item


def test_vk_links():
    assert parse_link("https://vk.com/Avto_Kzn") == ("vk", "avto_kzn")
    assert parse_link("m.vk.com/public123/") == ("vk", "club123")
    assert parse_link("https://vk.com/wall-123_45") == ("vk", "club123")
    assert parse_link("vk.com/id5") is None and parse_link("https://vk.com/feed") is None
    assert parse_link("@avto_kzn") == ("username", "avto_kzn")


async def test_vk_group_joins_and_posts_reach_people(env):
    """Человек прислал группу ВК → служебная страница вступила → новый пост из ленты пришёл карточкой с фото
    и ссылкой на пост ВК; тот же пост со стены второй раз не приходит."""
    dp, bot, s, ctx = env
    await make_filter(dp, bot, "камри до 1,5 млн")
    await dp.feed_update(bot, cb("c:add"))
    await dp.feed_update(bot, msg("https://vk.com/avto_kzn"))
    assert "в очереди" in s.texts(USER)[-1] and "подключение ВК ещё настраивается" in s.texts(USER)[-1]
    assert not await ctx.db.queued_channels() and len(await ctx.db.queued_channels("vk")) == 1

    reader = VKReader(bot, ctx)
    reader.api = api = FakeVK()
    await reader.join_one((await ctx.db.queued_channels("vk"))[0])
    assert api.calls == ["groups.getById"]                            # открытое — без вступления, сразу
    assert VK_KEY + 777 in ctx.channels
    assert "«ВК · Авто Казань» подключён" in s.texts(USER)[-2] and "Всё готово" in s.texts(USER)[-1]

    ctx.buffer_chat = -1009999999999
    reader.since = int(time.time()) - 60
    await reader.poll_wall(777)                                    # первый опрос стены только запоминает место
    api.feed.append(vk_post(777, 51, "Toyota Camry 2013, 1 200 000 ₽, Казань", photo=True))
    api.wall[777] = [vk_post(777, 51, "Toyota Camry 2013, 1 200 000 ₽, Казань", photo=True)]
    await reader.poll_feed()
    await asyncio.gather(*reader.tasks)
    photo = [m for m in s.sent if isinstance(m, SendPhoto) and m.chat_id == ctx.buffer_chat][-1]
    assert photo.photo == "https://sun.userapi.com/m.jpg"                       # не больше 1280 px
    copy = [m for m in s.sent if isinstance(m, CopyMessage)][-1]
    assert copy.chat_id == USER and "ВК · Авто Казань" in copy.caption
    assert copy.reply_markup.inline_keyboard[0][0].url == "https://vk.com/wall-777_51"
    await reader.poll_wall(777)
    await reader.poll_feed()
    assert not reader.tasks and len([m for m in s.sent if isinstance(m, CopyMessage)]) == 1


async def test_vk_closed_group_waits_for_approval(env):
    dp, bot, s, ctx = env
    await make_filter(dp, bot, "камри до 1,5 млн")
    await dp.feed_update(bot, cb("c:add"))
    await dp.feed_update(bot, msg("vk.com/club888\nvk.com/nobody_here"))
    reader = VKReader(bot, ctx)
    reader.api = api = FakeVK()
    for _ in range(2):
        await reader.join_one((await ctx.db.queued_channels("vk"))[0])
    texts = s.texts(USER)
    assert "Не получилось подключить «ВК · vk.com/nobody_here»: сообщество не найдено" in texts[-1]
    assert "пока не добавлен" in texts[-2] and "Тачки ВК" in texts[-2]
    await reader.check_approvals()
    assert (await ctx.db.awaiting_channels("vk"))[0]["status"] == "awaiting" and not await ctx.db.awaiting_channels()
    api.groups[1]["is_member"] = 1
    await reader.check_approvals()
    assert VK_KEY + 888 in ctx.channels and "одобрил заявку" in s.texts(USER)[-1]


async def test_admin_connects_vk_in_chat(env):
    """/vk — инструкция со ссылкой; /vk <адрес из браузера> — ключ проверен и сохранён, сообщение с ключом удалено."""
    dp, bot, s, ctx = env
    api = FakeVK()
    ctx.vk = VKReader(bot, ctx, make_api=lambda token: api)
    try:
        await dp.feed_update(bot, msg("/start", ADMIN))
        await dp.feed_update(bot, msg("/vk", ADMIN))
        assert "oauth.vk.com/authorize" in s.texts(ADMIN)[-1] and "не подключён" in s.texts(ADMIN)[-1]
        token = "vk1.a." + "x" * 60
        await dp.feed_update(bot, msg(f"/vk https://oauth.vk.com/blank.html#access_token={token}&expires_in=0&user_id=1", ADMIN))
        assert any(isinstance(m, DeleteMessage) for m in s.sent)
        assert "ВКонтакте подключён: страница «Служебная Страница»" in s.texts(ADMIN)[-1]
        assert await ctx.db.get_setting("vk_token") == token and ctx.vk.online
        await dp.feed_update(bot, msg("/admin", ADMIN))
        assert "ВКонтакте: ✅ «Служебная Страница»" in s.texts(ADMIN)[-1]
    finally:
        ctx.vk.runner.cancel()
        ctx.vk = None


def last_markup(s):
    return [m for m in s.sent if isinstance(m, (SendMessage, EditMessageText))][-1].reply_markup


async def test_admin_views_and_deletes_base_channels(env):
    """Админ: «📢 Каналы» → «🗂 Общая база» → карточка канала → удалить. Обычный человек этой кнопки не видит."""
    dp, bot, s, ctx = env
    await dp.feed_update(bot, msg("/start", ADMIN))
    await dp.feed_update(bot, msg(T.MENU_CHANNELS, ADMIN))
    buttons = [b.callback_data for row in last_markup(s).inline_keyboard for b in row]
    assert "a:base:0" in buttons
    await dp.feed_update(bot, msg("/start"))
    await dp.feed_update(bot, msg(T.MENU_CHANNELS))
    assert "a:base:0" not in [b.callback_data for row in last_markup(s).inline_keyboard for b in row]

    await dp.feed_update(bot, cb("a:base:0", ADMIN))
    assert "Общая база</b>: 2" in s.texts(ADMIN)[-1]
    names = [b.text for row in last_markup(s).inline_keyboard for b in row]
    assert any("Avto Msk" in n for n in names) and any("Perekup Rf" in n for n in names)
    cid = (await ctx.db.channel_by_tg(CH1))["id"]
    await dp.feed_update(bot, cb(f"a:ch:{cid}:0", ADMIN))
    assert "Avto Msk" in s.texts(ADMIN)[-1] and "https://t.me/avto_msk" in s.texts(ADMIN)[-1] and "читаю" in s.texts(ADMIN)[-1]
    await dp.feed_update(bot, cb(f"a:del:{cid}:0", ADMIN))
    assert "Удалить «Avto Msk»" in s.texts(ADMIN)[-1] and CH1 in ctx.channels      # без подтверждения не удаляем
    await dp.feed_update(bot, cb(f"a:delok:{cid}:0", ADMIN))
    assert "удалён из общей базы" in s.texts(ADMIN)[-1] and "Общая база</b>: 1" in s.texts(ADMIN)[-1]
    assert CH1 not in ctx.channels and (await ctx.db.channel(cid))["status"] == "removed"

    await dp.feed_update(bot, cb("a:base:0"))                                     # не админ — ничего
    assert "Общая база" not in (s.texts(USER) or [""])[-1]


async def test_admin_always_pro_and_market_from_history(env):
    """Админ всегда на PRO. История канала при подключении попадает в оценку рынка — «ниже рынка» работает сразу."""
    dp, bot, s, ctx = env
    await make_filter(dp, bot, "камри до 1,5 млн", uid=ADMIN, plan=None)
    u = await ctx.db.user(ADMIN)
    assert u["plan"] == "admin" and u["paid_until"] > time.time() + 3000 * 86400
    import plans
    assert plans.current(ctx.cfg, u).id == "pro"
    assert (await ctx.db.admin_stats())["paying"] == 0                              # админ — не платящий клиент

    from pipeline import learn_history
    ch = ctx.channels[CH2]
    old = [(1000 + i, f"Продам Toyota Camry 2012, пробег {150 + i * 10} тыс км, цена {p:,} ₽, Казань".replace(",", " "),
            time.time() - (i + 1) * 86400) for i, p in enumerate((1_450_000, 1_480_000, 1_500_000, 1_520_000, 1_550_000, 1_600_000))]
    old.append((2000, "Toyota Camry 2012, цена 1 500 000 ₽ — ПРОДАНО", time.time() - 3600))             # продана — не берём
    old.append((2001, "Toyota Camry 2012, цена 900 000 ₽", time.time() - 200 * 86400))                 # старше 90 дней
    assert await learn_history(ctx, ch, old) == 6
    assert (await ctx.db.channel(ch["id"]))["history"] == 1 and (await ctx.db.channel(ch["id"]))["posts"] == 0
    assert await learn_history(ctx, ch, old) == 0                                    # второй раз те же посты не берём

    r = await process(bot, ctx, post(CH1, "Toyota Camry 2012, 1 200 000 ₽, пробег 180 тыс"))
    assert r.market == 1_510_000 and r.discount == 21 and r.sent == [ADMIN]
    card = s.texts(ADMIN)[-1]
    assert "−21% к рынку" in card and "рынок ≈ 1 510 000 ₽ (6 объявл.)" in card



async def test_implausible_discount_takes_other_sum(env):
    """«−80% к рынку» почти всегда значит, что взяли не ту сумму: берём другую сумму поста, похожую на цену;
    другой нет — цену оставляем, но «ниже рынка» не пишем и в оценку рынка такой пост не берём."""
    dp, bot, s, ctx = env
    await make_filter(dp, bot, "любая тойота до 2 млн", uid=ADMIN, plan=None)
    from pipeline import learn_history
    ch = ctx.channels[CH2]
    old = [(3000 + i, f"Toyota RAV4 2010, цена {p:,} ₽, Москва".replace(",", " "), time.time() - (i + 1) * 86400)
           for i, p in enumerate((950_000, 980_000, 999_000, 1_020_000, 1_050_000, 1_100_000))]
    assert await learn_history(ctx, ch, old) == 6
    r = await process(bot, ctx, post(CH1, "Toyota RAV4 2010, 200к сверху всех, полный привод, 960 000"))
    assert r.listing.price == 960_000 and r.discount == 5
    r = await process(bot, ctx, post(CH1, "Toyota RAV4 2010, автомат, всего 190к, Москва"))
    assert r.listing.price == 190_000 and r.discount is None and "к рынку" not in s.texts(ADMIN)[-1]


async def test_vk_token_variable_accepts_whole_address(env, monkeypatch):
    """В переменную VK_TOKEN вставили весь адрес из браузера — бот сам берёт из него ключ."""
    dp, bot, s, ctx = env
    import dataclasses
    token = "vk1.a." + "y" * 60
    ctx.cfg = dataclasses.replace(ctx.cfg, vk_token=f"https://oauth.vk.com/blank.html#access_token={token}&user_id=5")
    got = []
    reader = VKReader(bot, ctx, make_api=lambda t: got.append(t) or FakeVK())
    try:
        assert await reader.resume() and got == [token]
    finally:
        reader.runner.cancel()


async def test_vk_bad_variable_reason_in_admin(env):
    dp, bot, s, ctx = env
    import dataclasses
    ctx.cfg = dataclasses.replace(ctx.cfg, vk_token="https://oauth.vk.com/blank.html#error=access_denied")
    ctx.vk = VKReader(bot, ctx, make_api=lambda t: FakeVK())
    try:
        assert not await ctx.vk.resume()
        await dp.feed_update(bot, msg("/start", ADMIN))
        await dp.feed_update(bot, msg("/admin", ADMIN))
        assert "ВКонтакте: ❌ не подключён (в переменной VK_TOKEN нет ключа" in s.texts(ADMIN)[-1]
    finally:
        ctx.vk = None


async def test_vk_flood_control_on_start_does_not_block(env):
    """ВК ответил «Flood control (код 9)» на первый запрос — ключ рабочий, страница всё равно подключается."""
    dp, bot, s, ctx = env

    class FloodVK(FakeVK):
        async def call(self, method, **p):
            if method == "users.get":
                raise VKError(9, "Flood control")
            return await super().call(method, **p)
    ctx.vk = VKReader(bot, ctx, make_api=lambda t: FloodVK())
    try:
        await dp.feed_update(bot, msg("/start", ADMIN))
        await dp.feed_update(bot, msg("/vk vk1.a." + "z" * 60, ADMIN))
        assert ctx.vk.online and "ВКонтакте подключён" in s.texts(ADMIN)[-1]
    finally:
        ctx.vk.runner.cancel()
        ctx.vk = None


async def test_admin_finds_vk_groups(env):
    """/vkfind: открытые автобарахолки 5000+ подписчиков, где 3+ поста в день минимум 5 дней из 7 и в постах машины."""
    dp, bot, s, ctx = env
    day = 86400
    base = (int(time.time() + 3 * 3600) // day) * day - 3 * 3600      # полночь по Москве сегодня
    def wall(per_day, text="Продам Toyota Camry 2012, цена 1 200 000 ₽"):
        return [{"id": i, "date": base - d * day + 3600 + i, "text": text} for d in range(1, 8) for i in range(per_day)]

    class FindVK(FakeVK):
        async def call(self, method, **p):
            if method == "groups.search":
                return {"items": [{"id": 1, "name": "Авто барахолка России", "is_closed": 0},
                                  {"id": 2, "name": "Авторынок Казань", "is_closed": 0},
                                  {"id": 3, "name": "Авто малышка", "is_closed": 0},
                                  {"id": 4, "name": "Новости авто", "is_closed": 0},
                                  {"id": 5, "name": "Котики", "is_closed": 0}]}
            if method == "groups.getById" and "group_ids" in p:
                m = {1: 120000, 2: 9000, 3: 3000, 4: 50000, 5: 90000}
                return {"groups": [{"id": int(i), "name": f"g{i}", "screen_name": f"g{i}", "members_count": m[int(i)]}
                                   for i in p["group_ids"].split(",")]}
            if method == "wall.get":
                return {"items": {1: wall(5), 2: wall(3), 3: wall(9), 4: wall(6, "Росстат: продажи новых авто выросли")}[-p["owner_id"]]}
            return await super().call(method, **p)
    ctx.vk = VKReader(bot, ctx, make_api=lambda t: FindVK())
    ctx.vk.api = FindVK()
    ctx.vk.runner = asyncio.create_task(asyncio.sleep(3600))           # «подключён»
    try:
        await dp.feed_update(bot, msg("/start", ADMIN))
        await dp.feed_update(bot, msg("/vkfind", ADMIN))
        await asyncio.gather(*ctx.background)
        found = s.texts(ADMIN)[-2]
        assert "vk.com/g1" in found and "vk.com/g2" in found                     # 3 — мало подписчиков, 4 — не продажа, 5 — не авто
        assert "vk.com/g3" not in found and "vk.com/g4" not in found and "vk.com/g5" not in found
        assert found.index("vk.com/g1") < found.index("vk.com/g2") and "35 постов/нед" in found
        assert "/add vk.com/g1 vk.com/g2" in s.texts(ADMIN)[-1]
        assert "автомобильных открытых групп: 4" in found and "в постах машины с ценой: 2" in found
    finally:
        ctx.vk.runner.cancel()
        ctx.vk = None


async def test_admin_commands_hidden_from_users(env):
    """Обычный человек шлёт админские команды — бот молчит и ничего не делает: ни поиска, ни добавления, ни рассылки."""
    dp, bot, s, ctx = env
    ctx.vk = VKReader(bot, ctx, make_api=lambda t: FakeVK())
    ctx.vk.api = api = FakeVK()
    ctx.vk.runner = asyncio.create_task(asyncio.sleep(3600))
    try:
        await dp.feed_update(bot, msg("/start"))
        before = len(s.sent)
        for c in ("/vkfind", "/vkfind 300", "/tgfind 800", "/admin", "/add @new_cars vk.com/avto_kzn", "/del @avto_msk", "/list", "/similar", "/tobase",
                  "/vk vk1.a." + "q" * 60, "/broadcast привет", "/connect"):
            await dp.feed_update(bot, msg(c))
        assert all(m.chat_id == USER for m in s.sent[before:] if hasattr(m, "chat_id"))
        assert not any("барахолк" in (t or "") or "Служебный аккаунт" in (t or "") or "очередь" in (t or "")
                       for t in s.texts(USER)[1:])
        assert not ctx.background and api.calls == [] and CH1 in ctx.channels
        assert not await ctx.db.queued_channels() and not await ctx.db.queued_channels("vk")
        await dp.feed_update(bot, cb("a:base:0"))
        assert not any("Общая база</b>" in (t or "") for t in s.texts(USER))
    finally:
        ctx.vk.runner.cancel()
        ctx.vk = None


async def test_vkfind_reports_flood_control(env, monkeypatch):
    """ВК отвечает «Flood control» на поиск — бот после повторов честно пишет админу, что случилось."""
    dp, bot, s, ctx = env
    import vk as vkmod
    monkeypatch.setattr(vkmod, "FLOOD_PAUSE", 0)

    class FloodFind(FakeVK):
        async def call(self, method, **p):
            if method == "groups.search":
                raise VKError(9, "Flood control")
            return await super().call(method, **p)
    ctx.vk = VKReader(bot, ctx, make_api=lambda t: FloodFind())
    ctx.vk.api = FloodFind()
    ctx.vk.runner = asyncio.create_task(asyncio.sleep(3600))
    try:
        await dp.feed_update(bot, msg("/start", ADMIN))
        await dp.feed_update(bot, msg("/vkfind", ADMIN))
        await asyncio.gather(*ctx.background)
        assert "ВК не дал искать: Flood control (код 9)" in s.texts(ADMIN)[-1] and "через час" in s.texts(ADMIN)[-1]
    finally:
        ctx.vk.runner.cancel()
        ctx.vk = None


async def test_vk_execute_batches():
    """Пачка запросов собирается в один execute с JSON-параметрами; неудачный вызов внутри → None."""
    from vk import VK
    api = VK("t")
    sent = []
    async def fake_call(method, **p):
        sent.append((method, p["code"]))
        return [{"items": [1]}, False]
    api.call = fake_call
    res = await api.many("groups.search", [{"q": "авто казань", "count": 100}, {"q": "x"}])
    assert res == [{"items": [1]}, None] and sent[0][0] == "execute"
    assert sent[0][1] == 'return [API.groups.search({"q": "авто казань", "count": 100}),API.groups.search({"q": "x"})];'


async def test_vk_open_groups_connect_at_once(env):
    """Пять открытых сообществ из очереди подключаются одним запросом — без вступлений и пауз; стены читаются пачкой."""
    dp, bot, s, ctx = env
    api = FakeVK()
    api.groups += [{"id": 900 + i, "name": f"Авто {i}", "screen_name": f"auto{i}", "is_closed": 0, "is_member": 0} for i in range(5)]
    await make_filter(dp, bot, "камри до 1,5 млн")
    await dp.feed_update(bot, cb("c:add"))
    await dp.feed_update(bot, msg("\n".join(f"vk.com/auto{i}" for i in range(5))))
    assert "примерно 1 мин" in s.texts(USER)[-1]
    reader = VKReader(bot, ctx); reader.api = api
    assert await reader.join_batch(await ctx.db.queued_channels("vk")) is None
    assert api.calls == ["groups.getById"] and all(VK_KEY + 900 + i in ctx.channels for i in range(5))
    assert not await ctx.db.queued_channels("vk") and "Всё готово" in s.texts(USER)[-1] and "Подключено: <b>5</b>" in s.texts(USER)[-1]


async def test_vk_walls_polled_in_packs(env):
    """Стены всех сообществ читаются пачкой: новый пост открытого сообщества приходит без вступления в него."""
    dp, bot, s, ctx = env
    await make_filter(dp, bot, "камри до 1,5 млн")
    api = FakeVK()
    reader = VKReader(bot, ctx); reader.api = api
    cid, _ = await ctx.db.add_channel(vk="avto_kzn", base=True)
    await reader.join_batch([await ctx.db.channel(cid)])
    api.wall[777] = []
    task = asyncio.create_task(reader.wall_loop())
    try:
        await asyncio.sleep(.1)
        assert reader.last.get(777) == 0                                   # первый круг — только запомнили место
        api.wall[777] = [vk_post(777, 5, "Toyota Camry 2013, 1 200 000 ₽, Казань")]
        await asyncio.sleep(1.2)
        await asyncio.gather(*reader.tasks)
        assert any("Toyota Camry 2013" in (t or "") for t in s.texts(USER))
    finally:
        task.cancel()


async def test_vkcheck_shows_flood_and_service_token_hint(env):
    """/vkcheck: пошагово, с точной ошибкой ВК; на «Flood control» — подсказка про сервисный ключ.
    Застрявшее в очереди сообщество: причина в /list, ждущему — одно сообщение."""
    dp, bot, s, ctx = env

    class FloodVK(FakeVK):
        async def call(self, method, **p):
            if method != "users.get":
                raise VKError(9, "Flood control")
            return await super().call(method, **p)
    ctx.vk = VKReader(bot, ctx); ctx.vk.api = FloodVK()
    try:
        await make_filter(dp, bot, "камри до 1,5 млн")
        await dp.feed_update(bot, cb("c:add"))
        await dp.feed_update(bot, msg("vk.com/avto_kzn"))
        for _ in range(2):
            assert await ctx.vk.join_batch(await ctx.db.queued_channels("vk")) == 60
        assert sum("ВКонтакте временно ограничил" in t for t in s.texts(USER)) == 1     # одно сообщение, не спам
        assert "Flood control" in (await ctx.db.queued_channels("vk"))[0]["error"]
        await dp.feed_update(bot, msg("/start", ADMIN))
        await dp.feed_update(bot, msg("/vkcheck", ADMIN))
        t = s.texts(ADMIN)[-1]
        assert "✅ ключ служебной страницы" in t and "❌ сообщество из очереди vk.com/avto_kzn: Flood control (код 9)" in t
        assert "VK_SERVICE_TOKEN" in t and "последняя ошибка" in t
    finally:
        ctx.vk = None


async def test_vk_service_token_only_reads_open_groups(env, monkeypatch):
    """Только сервисный ключ (без служебной страницы): открытые сообщества подключаются и читаются, закрытые — понятный отказ."""
    dp, bot, s, ctx = env
    import dataclasses
    ctx.cfg = dataclasses.replace(ctx.cfg, vk_service="svc")
    api = FakeVK()
    reader = VKReader(bot, ctx, make_api=lambda t: api)
    try:
        assert await reader.resume() and reader.online and reader.api is None and reader.rd is api
        a, _ = await ctx.db.add_channel(vk="avto_kzn", base=True)
        b, _ = await ctx.db.add_channel(vk="club888", base=True)
        await reader.join_batch(await ctx.db.queued_channels("vk"))
        assert VK_KEY + 777 in ctx.channels and "groups.join" not in api.calls
        assert "нужен ключ служебной страницы" in (await ctx.db.channel(b))["error"]
    finally:
        reader.runner.cancel()


async def test_admin_warned_when_vk_sources_grow(env):
    """Сообществ ВК 800+ — админу одно сообщение (и ещё одно на 1000), без повторов на каждом круге."""
    dp, bot, s, ctx = env
    await dp.feed_update(bot, msg("/start", ADMIN))
    for i in range(810):
        ctx.channels[VK_KEY + 5000 + i] = {"vk_id": 5000 + i, "tg_id": None, "base": 1}
    for _ in range(3):
        await jobs.capacity(bot, ctx)
    warn = [t for t in s.texts(ADMIN) if "Сообществ ВК уже" in t]
    assert len(warn) == 1 and "810" in warn[0] and "раз в 32 с" in warn[0]
    for i in range(810, 1000):
        ctx.channels[VK_KEY + 5000 + i] = {"vk_id": 5000 + i, "tg_id": None, "base": 1}
    await jobs.capacity(bot, ctx); await jobs.capacity(bot, ctx)
    assert len([t for t in s.texts(ADMIN) if "Сообществ ВК уже" in t]) == 2
    assert not [t for t in s.texts(USER) if "Сообществ ВК" in t]


async def test_admin_notified_of_new_users_and_panel(env):
    """Новые люди — админу сообщение «пришёл из Instagram / Threads / неизвестно»; «👑 Админ-панель» — только у админа:
    всего людей, сегодня по источникам, подписки по тарифам, оплаты."""
    dp, bot, s, ctx = env
    await dp.feed_update(bot, msg("/start", ADMIN))
    kb = [b.text for row in [m for m in s.sent if isinstance(m, SendMessage) and m.chat_id == ADMIN][-2].reply_markup.keyboard for b in row]
    assert T.MENU_ADMIN in kb
    await dp.feed_update(bot, msg("/start inst", USER))
    assert "Новый пользователь" in s.texts(ADMIN)[-1] and "Пришёл из: <b>Instagram</b>" in s.texts(ADMIN)[-1]
    assert T.MENU_ADMIN not in [b.text for row in [m for m in s.sent if isinstance(m, SendMessage) and m.chat_id == USER][0].reply_markup.keyboard for b in row]
    await dp.feed_update(bot, msg("/start threads", OTHER))
    assert "Пришёл из: <b>Threads</b>" in s.texts(ADMIN)[-1] and "сегодня новых: 3" in s.texts(ADMIN)[-1]
    await dp.feed_update(bot, msg("/start", 333))
    assert "Пришёл из: <b>неизвестно</b>" in s.texts(ADMIN)[-1]
    n = len(s.texts(ADMIN)); await dp.feed_update(bot, msg("/start inst", USER))              # повторный старт — без уведомления
    assert len(s.texts(ADMIN)) == n
    await ctx.db.set_user(USER, paid_until=time.time() + 86400 * 30, plan="pro")
    from user import activate_trial
    await activate_trial(ctx, OTHER)                                         # OTHER на пробном дне (оплату здесь не проверяем)
    await ctx.db.set_user(USER, trial_used=1)                                # USER брал пробный раньше и потом купил PRO
    await ctx.db.add_payment(USER, "p1", 2490, "pro"); await ctx.db.finish_payment("p1", "succeeded")
    await dp.feed_update(bot, msg(T.MENU_ADMIN, ADMIN))
    t = s.texts(ADMIN)[-1]
    assert "Всего пользователей: <b>4</b>" in t and "Сегодня новых: <b>4</b> — Instagram 1 · Threads 1" in t
    assert "На пробном дне прямо сейчас: 1</b>" in t and "брали всего: 2 · за 7 дней: 1 · потом купили тариф: 1 (50%)" in t
    assert "Платные подписки сейчас: 1</b>" in t and "PRO — <b>1</b>" in t and "Простой — <b>0</b>" in t
    assert "Оплат за всё время: 1 на 2 490 ₽" in t
    assert "?start=inst" in t and "?start=threads" in t
    await dp.feed_update(bot, msg(T.MENU_ADMIN, USER))                                       # не админ — не видит
    assert not any("Админ-панель" in (x or "") for x in s.texts(USER))


async def test_youtube_and_tiktok_links_tracked(env):
    """Ссылки ?start=youtube и ?start=tiktok: админ видит, откуда пришёл человек, сколько новых из каждой соцсети
    и сколько из них заплатили — какая соцсеть приводит покупателей."""
    dp, bot, s, ctx = env
    await dp.feed_update(bot, msg("/start", ADMIN))
    await dp.feed_update(bot, msg("/start youtube", USER))
    assert "Пришёл из: <b>YouTube</b>" in s.texts(ADMIN)[-1]
    await dp.feed_update(bot, msg("/start tiktok", OTHER))
    assert "Пришёл из: <b>TikTok</b>" in s.texts(ADMIN)[-1]
    await dp.feed_update(bot, msg("/start tiktok", 333))
    await ctx.db.add_payment(OTHER, "t1", 490, "trial"); await ctx.db.finish_payment("t1", "succeeded")
    await ctx.db.add_payment(OTHER, "t2", 2490, "pro"); await ctx.db.finish_payment("t2", "succeeded")   # повторная — тот же человек
    await dp.feed_update(bot, msg(T.MENU_ADMIN, ADMIN))
    t = s.texts(ADMIN)[-1]
    assert "Сегодня новых: <b>4</b> — " in t and "YouTube 1" in t and "TikTok 2" in t
    assert "Купили хоть раз: TikTok 1" in t
    assert "?start=youtube" in t and "?start=tiktok" in t


async def test_contacts_export_for_admin(env):
    """Каждый, кто нажал /start, — в базе контактов: «📇 База контактов» в админ-панели присылает Excel (только админу)."""
    import io
    from aiogram.methods import SendDocument
    from openpyxl import load_workbook
    dp, bot, s, ctx = env
    await dp.feed_update(bot, msg("/start", ADMIN))
    await dp.feed_update(bot, msg("/start youtube", USER))
    await dp.feed_update(bot, msg("/start tiktok", OTHER))
    await ctx.db.add_payment(OTHER, "c1", 490, "trial"); await ctx.db.finish_payment("c1", "succeeded")
    await ctx.db.set_user(OTHER, paid_until=time.time() + 86400, plan="trial")
    await dp.feed_update(bot, msg(T.MENU_ADMIN, ADMIN))
    assert T.BTN_CONTACTS in [b.text for row in last_markup(s).inline_keyboard for b in row]
    await dp.feed_update(bot, cb("adm:contacts", USER))                               # не админ — ничего
    assert not any(isinstance(m, SendDocument) for m in s.sent)
    await dp.feed_update(bot, cb("adm:contacts", ADMIN))
    doc = [m for m in s.sent if isinstance(m, SendDocument)][-1]
    assert doc.chat_id == ADMIN and doc.document.filename.startswith("kontakty_") and "3 чел." in doc.caption
    ws = load_workbook(io.BytesIO(doc.document.data)).active
    assert "Всего людей: 3" in ws["A2"].value
    rows = {r[1]: r for r in ws.iter_rows(min_row=5, values_only=True)}
    assert rows[USER][2] == f"@u{USER}" and rows[USER][3] == f"https://t.me/u{USER}" and rows[USER][7] == "YouTube"
    assert rows[OTHER][7] == "TikTok" and rows[OTHER][10] == "Пробный день" and rows[OTHER][12] == 490 and rows[OTHER][13] == 1
    await dp.feed_update(bot, msg("/contacts", ADMIN))                                 # и командой
    assert len([m for m in s.sent if isinstance(m, SendDocument)]) == 2


async def test_admin_can_turn_off_new_user_notifications(env):
    dp, bot, s, ctx = env
    await dp.feed_update(bot, msg("/start", ADMIN))
    await dp.feed_update(bot, msg(T.MENU_ADMIN, ADMIN))
    assert [b.text for row in last_markup(s).inline_keyboard for b in row][-1] == T.BTN_NOTIFY_ON
    await dp.feed_update(bot, cb("adm:notify", ADMIN))
    assert [b.text for row in last_markup(s).inline_keyboard for b in row][-1] == T.BTN_NOTIFY_OFF
    n = len(s.texts(ADMIN))
    await dp.feed_update(bot, msg("/start inst", USER))
    assert not any("Новый пользователь" in t for t in s.texts(ADMIN)[n:])          # выключено — молчим
    await dp.feed_update(bot, cb("adm:notify", ADMIN))                               # включили обратно
    await dp.feed_update(bot, msg("/start threads", OTHER))
    assert "Пришёл из: <b>Threads</b>" in s.texts(ADMIN)[-1]
    await dp.feed_update(bot, cb("adm:notify", USER))                                # не админ — ничего не меняет
    assert await ctx.db.get_setting("notify_new") == "1"


class FakePaylogCreator(FakeCreator):
    async def __call__(self, request):
        r = await super().__call__(request)
        if type(request).__name__ == "ExportChatInviteRequest":
            return type("I", (), {"link": "https://t.me/+PayLogInvite"})()
        return r


async def test_payments_go_live_to_paylog_channel(env):
    """Служебный аккаунт один раз создаёт закрытый канал «оплаты»; каждая оплата — сразу туда: сумма, тариф, кто,
    до какого числа, откуда пришёл, первая или повторная, итог за сегодня. Ссылка на канал — в админ-панели."""
    dp, bot, s, ctx = env
    reader = Reader(bot, ctx, FakePaylogCreator())
    await reader.ensure_paylog(); await reader.ensure_paylog()
    assert reader.client.calls == ["CreateChannelRequest", "EditAdminRequest", "ExportChatInviteRequest"]
    assert ctx.paylog_chat == -1004242 and await ctx.db.get_setting("paylog_link") == "https://t.me/+PayLogInvite"
    await dp.feed_update(bot, msg("/start inst"))
    for plan in ("basic", "pro"):
        await dp.feed_update(bot, cb(f"s:pay:{plan}"))
        pay = await ctx.db.last_pending(USER)
        ctx.pay.statuses[pay["yk_id"]] = "succeeded"
        await dp.feed_update(bot, cb("s:check"))
    log1, log2 = s.texts(ctx.paylog_chat)
    assert "Оплата +1 390 ₽</b> · Простой" in log1 and "первая оплата" in log1 and "Instagram" in log1 and "@u111" in log1
    assert "Оплата +2 490 ₽</b> · PRO" in log2 and "2-я оплата" in log2 and "Сегодня: 2 оплаты на 3 880 ₽" in log2
    await dp.feed_update(bot, msg("/start", ADMIN))
    await dp.feed_update(bot, msg(T.MENU_ADMIN, ADMIN))
    assert "Канал оплат (каждая оплата — сразу): https://t.me/+PayLogInvite" in s.texts(ADMIN)[-1]


async def test_payment_goes_to_admin_without_paylog_channel(env):
    dp, bot, s, ctx = env
    await dp.feed_update(bot, msg("/start", ADMIN))
    await dp.feed_update(bot, msg("/start threads"))
    await dp.feed_update(bot, cb("s:pay:basic"))
    pay = await ctx.db.last_pending(USER)
    ctx.pay.statuses[pay["yk_id"]] = "succeeded"
    await jobs.tick(bot, ctx)                                             # оплатил, но не нажал «Я оплатил» — фон засчитал
    assert "Оплата +1 390 ₽</b> · Простой" in s.texts(ADMIN)[-1] and "Threads" in s.texts(ADMIN)[-1]


async def test_health_check_lists_problems(env):
    """«🩺 Проверка бота»: по строке на настройку, ❌ — мешает работе, с подсказкой, как исправить; не админу — ничего."""
    dp, bot, s, ctx = env
    await dp.feed_update(bot, msg("/start", ADMIN))
    await dp.feed_update(bot, cb("adm:health", ADMIN))
    t = s.texts(ADMIN)[-1]
    assert "Проверка бота" in t and "❌ реквизиты в оферте" in t and "SELLER_INN" in t
    assert "❌ служебный аккаунт Telegram: не подключён — /connect" in t and "✅ оплата (Робокасса): подключена" in t
    assert "ИИ" not in t and "Есть что поправить" in t
    n = len(s.texts(USER)); await dp.feed_update(bot, cb("adm:health", USER))
    assert len(s.texts(USER)) == n


async def test_users_suggest_ideas(env):
    """«💡 Предложить идею» есть у всех: просим мнение, идея уходит админу (ответить можно свайпом), человеку — спасибо;
    в админ-панели — сколько идей."""
    dp, bot, s, ctx = env
    await dp.feed_update(bot, msg("/start", ADMIN))
    await dp.feed_update(bot, msg("/start"))
    kb = [b.text for row in [m for m in s.sent if isinstance(m, SendMessage) and m.chat_id == USER][0].reply_markup.keyboard for b in row]
    assert T.MENU_IDEA not in kb                                       # «Предложить идею» теперь в «❓ Помощь»
    await dp.feed_update(bot, msg(T.MENU_HELP))
    help_msg = [m for m in s.sent if isinstance(m, SendMessage) and m.chat_id == USER][-1]
    assert help_msg.reply_markup.inline_keyboard[0][0].callback_data == "idea"
    await dp.feed_update(bot, cb("idea"))
    assert "Мы ценим каждого клиента" in s.texts(USER)[-1] and "что-то не нравится" in s.texts(USER)[-1]
    await dp.feed_update(bot, msg("Добавьте фильтр по цвету кузова"))
    assert "Спасибо! Идея уже у команды" in s.texts(USER)[-1]
    head = [m for m in s.sent if isinstance(m, SendMessage) and m.chat_id == ADMIN and "Идея от пользователя" in (m.text or "")]
    assert head and "@u111" in head[-1].text
    copy = [m for m in s.sent if isinstance(m, CopyMessage) and m.chat_id == ADMIN][-1]
    assert copy.from_chat_id == USER
    await dp.feed_update(bot, msg(T.MENU_IDEA)); await dp.feed_update(bot, msg(T.MENU_FILTERS))   # старая кнопка меню тоже работает; передумал — меню работает
    assert "Спасибо!" not in s.texts(USER)[-1]
    await dp.feed_update(bot, msg(T.MENU_ADMIN, ADMIN))
    assert "Идей от пользователей: 1 (за 7 дней: 1)" in s.texts(ADMIN)[-1]


async def test_offer_with_inn_only(env):
    """ФИО можно не показывать: только ИНН и контакт."""
    dp, bot, s, ctx = env
    import dataclasses
    dp["ctx"].cfg = ctx.cfg = dataclasses.replace(ctx.cfg, seller_inn="123456789012", seller_contact="ivan@mail.ru")
    await dp.feed_update(bot, msg("/offer"))
    t = s.texts(USER)[-1]
    assert "Самозанятый (плательщик НПД), ИНН 123456789012" in t and "ivan@mail.ru" in t and "Иванов" not in t


async def test_vk_sessions_closed(env):
    """Плохой ключ и остановка бота — соединения с ВК закрываются (в логе нет «Unclosed client session»)."""
    dp, bot, s, ctx = env
    closed = []

    class ClosingVK(FakeVK):
        def __init__(self, bad=False):
            super().__init__(); self.bad = bad
        async def call(self, method, **p):
            if self.bad:
                raise VKError(5, "User authorization failed")
            return await super().call(method, **p)
        async def close(self):
            closed.append(self)
    reader = VKReader(bot, ctx, make_api=lambda t: ClosingVK(bad=t == "bad"))
    try:
        await reader.attach("bad")
    except VKError:
        pass
    assert len(closed) == 1
    await reader.attach("good")
    await reader.close(); await asyncio.sleep(0)
    assert len(closed) == 2 and reader.runner.done()


async def test_city_from_channel_title(env):
    """Скрин 04.11: пост без города из «АвтоРынок ДНР» не уходит в фильтр «Москва», уходит в «Донецк»; пост без города из
    канала без города в названии — не уходит в фильтр с городом (уходит в фильтр «вся Россия»)."""
    dp, bot, s, ctx = env
    DNR = -1001000000077
    cid, _ = await ctx.db.add_channel(username="avtorynok_dnr_x", base=True)
    await ctx.db.channel_joined(cid, DNR, "АвтоРынок ДНР", None, "main")
    await ctx.refresh_channels()
    await make_filter(dp, bot, "Москва до 1,5 миллиона любая марка", uid=USER)
    await make_filter(dp, bot, "донецк до 1 млн", uid=OTHER)
    text = "Продам! Я собственник✅\nHYUNDAI Solaris.\nГод 2012\nПробег 186000\nЦена 845 000"
    r = await process(bot, ctx, post(DNR, text))
    assert r.sent == [OTHER] and "📍 ДНР" in s.texts(OTHER)[-1]
    r = await process(bot, ctx, post(CH2, "Kia Rio 2016\nПробег 120000\nЦена 790 000"))   # perekup_rf: город неизвестен
    assert USER not in r.sent and OTHER not in r.sent


async def test_vk_group_region_code_in_title(env):
    """Владелец 12.11: группа ВК «38 Авторынок» (номер региона вместо города) — посты без города уходят в фильтр
    «Иркутская область», а в фильтр «Москва» — нет."""
    dp, bot, s, ctx = env
    cid, _ = await ctx.db.add_channel(vk="avtorynok38_x", base=True)
    await ctx.db.vk_joined(cid, 777038, "38 Авторынок")
    await ctx.refresh_channels()
    await make_filter(dp, bot, "Иркутская область до 1 млн", uid=USER)
    await make_filter(dp, bot, "Москва до 1 млн", uid=OTHER)
    r = await process(bot, ctx, post(VK_KEY + 777038, "Toyota Corolla 2012\nПробег 160000\nЦена 890 000"))
    assert USER in r.sent and OTHER not in r.sent and "📍 Иркутск" in s.texts(USER)[-1]


async def test_city_in_oblast_filter_and_card(env):
    """Владелец 12.11: фильтр «Иркутская область» ловит пост из Ангарска (город → область по справочнику), в карточке —
    «📍 Ангарск · Иркутская область»; фильтр «Москва» этот пост не получает."""
    dp, bot, s, ctx = env
    await make_filter(dp, bot, "Иркутская область до 1 млн", uid=USER)
    await make_filter(dp, bot, "Москва до 1 млн", uid=OTHER)
    r = await process(bot, ctx, post(CH2, "Toyota Corolla 2012\nПробег 160000\nЦена 890 000\nг. Ангарск"))
    assert USER in r.sent and OTHER not in r.sent and "📍 Ангарск · Иркутская область" in s.texts(USER)[-1]


async def test_city_learned_from_history(env):
    """Канал без города в названии узнаёт город по своим машинам: 10 постов из Казани → посты без города считаются казанскими."""
    dp, bot, s, ctx = env
    for i in range(10):
        await process(bot, ctx, post(CH2, f"Lada Vesta 20{10 + i % 9}\nЦена {500 + i * 7} 000\nКазань"))
    await ctx.guess_regions()
    assert next(c for c in ctx.channels.values() if c["username"] == "perekup_rf")["region_guess"] == "kzn"
    await make_filter(dp, bot, "казань до 1 млн", uid=USER)
    assert USER in (await process(bot, ctx, post(CH2, "Kia Rio 2016\nПробег 120000\nЦена 790 000"))).sent


async def test_private_channel_marked_on_card(env):
    """Закрытый канал (без @имени): в карточке — пометка «🔒 Закрытый канал», кнопка поста подписана «если ты в канале»
    и рядом «Вступить в канал» по приглашению; у открытого канала — как раньше (владелец 09.11)."""
    dp, bot, s, ctx = env
    PRIV = -1001234567890
    cid, _ = await ctx.db.add_channel(invite="AbCdEfGhIjKlMn", base=True)
    await ctx.db.channel_joined(cid, PRIV, "Перекупы закрытый клуб", None, "main")
    await ctx.refresh_channels()
    await make_filter(dp, bot, "камри до 1 млн")
    raw = post(PRIV, "Toyota Camry 2012, 900 000 ₽, пробег 180 тыс, звоните +7 900 000-00-00")
    assert (await process(bot, ctx, raw)).sent == [USER]
    card = [m for m in s.sent if isinstance(m, SendMessage) and m.chat_id == USER][-1]
    assert "🔒 <b>Закрытый канал</b>" in card.text and "по заявке" in card.text
    btns = [b for row in card.reply_markup.inline_keyboard for b in row]
    assert btns[0].text == T.BTN_OPEN_PRIVATE and btns[0].url == f"https://t.me/c/1234567890/{raw.msg_id}"
    assert btns[1].text == T.BTN_JOIN and btns[1].url == "https://t.me/+AbCdEfGhIjKlMn"
    assert T.BTN_ALBUM not in [b.text for b in btns]                       # в посте нет фото — и кнопки нет
    assert (await process(bot, ctx, post(CH1, "Toyota Camry 2013, 950 000 ₽, пробег 150 тыс"))).sent == [USER]
    card = [m for m in s.sent if isinstance(m, SendMessage) and m.chat_id == USER][-1]
    assert "Закрытый канал" not in card.text
    btns = [b for row in card.reply_markup.inline_keyboard for b in row]
    assert btns[0].text == T.BTN_OPEN and T.BTN_JOIN not in [b.text for b in btns]



async def test_all_photos_button_only_for_private(env):
    """«📸 Все фото» — только у закрытых каналов и только если в посте есть фото: служебный аккаунт пересылает альбом в буфер,
    бот копирует его человеку одним альбомом без подписи; одно фото / не достали — всплывающее объяснение (владелец 09.11)."""
    dp, bot, s, ctx = env
    PRIV = -1001234567891
    cid, _ = await ctx.db.add_channel(invite="ZyXwVuTsRqPoNm", base=True)
    await ctx.db.channel_joined(cid, PRIV, "Закрытые тачки", None, "main")
    await ctx.refresh_channels()
    await make_filter(dp, bot, "камри до 1 млн")
    ctx.buffer_chat = -1009999999999

    async def forwarded():
        return 555

    class FakeReader:
        online = True
        def __init__(self): self.calls = []
        async def album(self, chat_id, msg_id):
            self.calls.append((chat_id, msg_id))
            return [] if msg_id == 1 else [msg_id] if msg_id == 2 else [700, 701, 702, 703]
    ctx.reader = FakeReader()
    raw = RawPost(PRIV, next(ids), "Toyota Camry 2012, 900 000 ₽, пробег 180 тыс", time.time() - 1.5, forwarded)
    assert (await process(bot, ctx, raw)).sent == [USER]
    card = [m for m in s.sent if isinstance(m, CopyMessage) and m.chat_id == USER][-1]
    btns = [b for row in card.reply_markup.inline_keyboard for b in row]
    assert btns[0].text == T.BTN_ALBUM and btns[0].callback_data == f"ph:{PRIV}:{raw.msg_id}"
    await dp.feed_update(bot, cb(btns[0].callback_data))
    assert ctx.reader.calls == [(PRIV, raw.msg_id)]
    album = [m for m in s.sent if isinstance(m, CopyMessages)][-1]
    assert album.chat_id == USER and album.from_chat_id == ctx.buffer_chat and album.message_ids == [700, 701, 702, 703] and album.remove_caption
    await dp.feed_update(bot, cb(f"ph:{PRIV}:2"))
    assert [m for m in s.sent if isinstance(m, AnswerCallbackQuery)][-1].text == T.ALBUM_ONE
    await dp.feed_update(bot, cb(f"ph:{PRIV}:1"))
    assert [m for m in s.sent if isinstance(m, AnswerCallbackQuery)][-1].text == T.ALBUM_FAIL
    # открытый канал с фото — кнопки нет
    assert (await process(bot, ctx, RawPost(CH1, next(ids), "Toyota Camry 2013, 950 000 ₽, пробег 150 тыс", time.time() - 1.5, forwarded))).sent == [USER]
    card = [m for m in s.sent if isinstance(m, CopyMessage) and m.chat_id == USER][-1]
    assert T.BTN_ALBUM not in [b.text for row in card.reply_markup.inline_keyboard for b in row]


async def test_reader_album_forwards_whole_group(env):
    """Reader.album: берёт сообщения вокруг поста с тем же grouped_id (фото/видео), пересылает их в буфер одним запросом, кэширует."""
    from types import SimpleNamespace as NS
    from userbot import Reader
    dp, bot, s, ctx = env

    class Client:
        def __init__(self): self.forwards = []
        async def get_input_entity(self, chat_id): return "peer"
        async def get_messages(self, peer, ids):
            msgs = {100: NS(id=100, grouped_id=7, photo=True, video=None), 101: NS(id=101, grouped_id=7, photo=True, video=None),
                    102: NS(id=102, grouped_id=7, photo=None, video=True), 103: NS(id=103, grouped_id=None, photo=True, video=None),
                    99: NS(id=99, grouped_id=8, photo=True, video=None)}
            return [msgs.get(i) for i in ids]
        async def forward_messages(self, to, ids, from_peer):
            self.forwards.append(list(ids)); return [NS(id=900 + i) for i in ids]
    r = Reader(bot, ctx, Client()); r.buffer = "buf"
    assert await r.album(-1001, 101) == [1000, 1001, 1002] and r.client.forwards == [[100, 101, 102]]
    assert await r.album(-1001, 101) == [1000, 1001, 1002] and len(r.client.forwards) == 1      # кэш
    assert await r.album(-1001, 103) == [1003]                                                  # без альбома — одно фото


def test_fmt_date_moscow_time():
    """Срок доступа — дата и время по Москве (UTC+3), а не только дата по часам сервера (владелец 09.11)."""
    from datetime import datetime, timezone
    from user import fmt_date
    paid = datetime(2026, 11, 9, 15, 0, tzinfo=timezone.utc).timestamp()          # 18:00 МСК
    assert fmt_date(paid + 86400) == "10.11.2026 в 18:00 МСК"                    # пробный день — ровно 24 часа
    assert fmt_date(datetime(2026, 11, 9, 22, 30, tzinfo=timezone.utc).timestamp()) == "10.11.2026 в 01:30 МСК"   # по UTC ещё 9-е


def test_contacts_from_post_text():
    """Контакты продавца из текста: телефоны в любом виде → +7 999 123-45-67, WhatsApp, @ники и t.me/ники; без @канала и ботов."""
    from pipeline import contacts
    t = ("Продам. Звонить 8 (999) 123-45-67 или +7 912 000 11 22, WhatsApp wa.me/79161234567. Пишите @seller_msk или https://t.me/manager_ivan. "
         "Подписывайтесь @avto_msk, бот @perekhvat_bot, VIN XTA21099012345678, цена 145.000₽")
    assert contacts(t, {"username": "avto_msk"}) == ["+7 999 123-45-67", "+7 912 000-11-22", "WhatsApp +79161234567", "@seller_msk"]
    assert contacts("звоните 89991234567 и пишите t.me/manager_ivan", None) == ["+7 999 123-45-67", "@manager_ivan"]
    assert contacts("Toyota Camry 2014, 1 500 000 ₽, пробег 180 000 км", None) == []


async def test_contacts_survive_long_caption(env):
    """Длинный пост с фото: подпись режется на 1024 символах, но телефон и @ник продавца из конца поста — в строке «📞 Связь» наверху (владелец 10.11)."""
    dp, bot, s, ctx = env
    await make_filter(dp, bot, "любые до 2 млн")
    ctx.buffer_chat = -1009999999999

    async def forwarded():
        return 556
    long_text = "Toyota Camry 2014, 1 500 000 ₽, Москва. " + "Состояние отличное, всё работает. " * 80 + "\n📲 Звонить: +7 (999) 765-43-21, пишите @camry_owner"
    assert (await process(bot, ctx, RawPost(CH1, next(ids), long_text, time.time() - 1, forwarded))).sent == [USER]
    copy = [m for m in s.sent if isinstance(m, CopyMessage)][-1]
    import re
    visible = re.sub(r"<[^>]+>", "", copy.caption)
    assert len(visible) <= 1024 and "📞 Связь: +7 999 765-43-21 · @camry_owner" in visible


async def test_contacts_from_buttons_and_channel_info(env):
    """Контакта в тексте нет: берём из кнопок/скрытых ссылок поста; нет и там — из описания и закрепа канала (закрытые каналы, владелец 10.11)."""
    dp, bot, s, ctx = env
    await make_filter(dp, bot, "камри до 1 млн")
    # кнопка «Написать менеджеру» под постом
    raw = RawPost(CH1, next(ids), "Toyota Camry 2012, 900 000 ₽, пробег 180 тыс", time.time() - 1.5, extra="https://t.me/manager_ivan")
    assert (await process(bot, ctx, raw)).sent == [USER]
    assert "📞 <b>Связь:</b> @manager_ivan" in s.texts(USER)[-1]
    # в посте пусто — контакты канала
    calls = []

    async def about():
        calls.append(1)
        return "Авто под заказ. По всем вопросам: +7 (900) 111-22-33, WhatsApp wa.me/79001112233"
    raw = RawPost(CH1, next(ids), "Toyota Camry 2013, 950 000 ₽, пробег 150 тыс", time.time() - 1.5, about=about)
    assert (await process(bot, ctx, raw)).sent == [USER]
    assert "📞 <b>Связь (контакты канала):</b> +7 900 111-22-33 · WhatsApp +79001112233" in s.texts(USER)[-1] and calls == [1]
    # контакт в тексте есть — описание канала не трогаем
    raw = RawPost(CH1, next(ids), "Toyota Camry 2014, 990 000 ₽, звоните 89991234567", time.time() - 1.5, about=about)
    assert (await process(bot, ctx, raw)).sent == [USER]
    assert "📞 <b>Связь:</b> +7 999 123-45-67" in s.texts(USER)[-1] and calls == [1]


def test_reader_extras_reads_buttons_and_hidden_links():
    from types import SimpleNamespace as NS
    from userbot import Reader
    m = NS(entities=[NS(url="https://t.me/seller_pro"), NS()], reply_markup=NS(rows=[NS(buttons=[NS(url="https://wa.me/79161234567"), NS(text="Подробнее")])]))
    assert Reader.extras(m) == "https://t.me/seller_pro https://wa.me/79161234567"
    assert Reader.extras(NS(entities=None, reply_markup=None)) == ""


async def test_missed_preview_before_plan(env):
    """Без тарифа после сохранения фильтра — «что ты пропустил за сутки»: сколько вышло, примеры без контактов, затем тарифы
    с бесплатным пробным днём (владелец 10.11). Пусто — совет расширить фильтр."""
    dp, bot, s, ctx = env
    for t in ("Toyota Camry 2012, 900 000 ₽, Москва, пробег 180 тыс, звоните +7 999 111-22-33", "Toyota Camry 2013, 950 000 ₽, пробег 150 тыс",
              "Hyundai Solaris 2016, 700 000 ₽"):
        await process(bot, ctx, post(CH1, t))
    await dp.feed_update(bot, msg("/start"))
    await ctx.db.set_user(USER, trial_used=1)                                # пробный день уже брал — показываем «что пропустил»
    await dp.feed_update(bot, msg("камри до 1 млн")); await dp.feed_update(bot, cb("f:save"))
    texts = s.texts(USER)
    preview = next(t for t in texts if "За последние сутки под этот фильтр вышло" in t)
    assert "вышло 2 машины" in preview and "Toyota Camry" in preview and "900 000 ₽" in preview and "+7 999" not in preview
    assert "выбери тариф" in texts[-1] and "Простой" in str([getattr(m, "reply_markup", None) for m in s.sent if getattr(m, "chat_id", None) == USER and getattr(m, "reply_markup", None)][-1])
    await dp.feed_update(bot, msg("приора до 100к")); await dp.feed_update(bot, cb("f:save"))
    assert any("ничего не вышло" in t for t in s.texts(USER))


async def test_trial_ends_offers_month_plans(env):
    """Пробный день кончился — отдельное сообщение: итог дня и «Простой» / PRO на месяц кнопками (без повторного пробного)."""
    import jobs
    dp, bot, s, ctx = env
    await dp.feed_update(bot, msg("/start"))
    await ctx.db.set_user(USER, paid_until=time.time() - 60, plan="trial", trial_used=1)
    await jobs.tick(bot, ctx)
    last = [m for m in s.sent if isinstance(m, SendMessage) and m.chat_id == USER][-1]
    assert "Пробный день закончился" in last.text and "Простой — 1390 ₽" in last.text and "PRO — 2490 ₽" in last.text
    btns = [b.callback_data for row in last.reply_markup.inline_keyboard for b in row]
    assert btns == ["s:pay:basic", "s:pay:pro"]


async def test_try_button_after_trial_and_other_plans(env):
    """Пробный уже брал — «Хочу попробовать» сразу показывает тарифы; «Другие тарифы» — картинка тарифов с кнопками; первый фильтр пробный не включает."""
    dp, bot, s, ctx = env
    await dp.feed_update(bot, msg("/start"))
    photos = lambda: [m for m in s.sent if isinstance(m, SendPhoto) and m.chat_id == USER]
    await dp.feed_update(bot, cb("s:plans"))
    assert photos() and "Пробный день — 500 ₽" in photos()[-1].caption
    await dp.feed_update(bot, msg("камри до 1 млн")); await dp.feed_update(bot, cb("f:save"))
    assert (await ctx.db.user(USER))["paid_until"] < time.time() and not await ctx.db._all("SELECT * FROM events WHERE kind='trial'")
    await ctx.db.set_user(USER, trial_used=1)
    await dp.feed_update(bot, cb("s:try"))
    assert "только один раз" in photos()[-1].caption
    assert "s:pay:trial" not in [b.callback_data for row in photos()[-1].reply_markup.inline_keyboard for b in row]


async def test_trial_once_per_account(env):
    """Пробный день — один раз на аккаунт: take_trial второй раз не проходит; кнопка пробного после этого — «только один раз»."""
    from user import activate_trial
    dp, bot, s, ctx = env
    await dp.feed_update(bot, msg("/start"))
    assert await activate_trial(ctx, USER) and not await activate_trial(ctx, USER)
    await ctx.db.set_user(USER, paid_until=time.time() - 60)
    await dp.feed_update(bot, cb("s:pay:trial"))
    assert "только один раз" in s.texts(USER)[-1]


async def make_admins_pro_if_any(ctx):
    from admin import make_admins_pro
    await make_admins_pro(ctx)


async def test_sub_screen_shows_current_plan_only_when_active(env):
    """«Подписка»: есть тариф — «Твой тариф сейчас: PRO — до …»; нет — про статус ни слова."""
    dp, bot, s, ctx = env
    await dp.feed_update(bot, msg("/start"))
    await ctx.db.set_user(USER, trial_used=1)
    await dp.feed_update(bot, msg("💳 Подписка"))
    assert "Твой тариф" not in s.texts(USER)[-1] and "Подписки нет" not in s.texts(USER)[-1]
    await ctx.db.set_user(USER, paid_until=time.time() + 5 * 86400, plan="pro")
    await dp.feed_update(bot, msg("💳 Подписка"))
    assert "Твой тариф сейчас: PRO" in s.texts(USER)[-1] and "МСК" in s.texts(USER)[-1]


# ---------- поиск новых источников в таблицу (владелец 11.11) ----------
def _posts(n_days, text, per_day=1):
    from datetime import timedelta, timezone
    now = datetime.now(timezone.utc)
    return [(now - timedelta(days=d, hours=i + 1), text) for d in range(n_days) for i in range(per_day)]


def test_finder_judge_used_cars_not_import():
    """Б/У с ценой каждый день — подходит; импорт «под заказ», мало подписчиков, редкие посты и не-объявления — отсеиваются с причиной."""
    import finder
    from words import load_dictionary
    d = load_dictionary(ROOT / "cars.yaml")
    used = "Продам Toyota Camry 2012, пробег 180 000 км, Казань. Цена 1 200 000 ₽, торг."
    imp = "Привезём Toyota Camry 2021 из Кореи под заказ, растаможка включена. Цена 2 400 000 ₽."
    assert finder.judge(_posts(7, used), d, subs=9000)["ok"]
    assert finder.judge(_posts(7, used), d, subs=9000)["region"] == "Татарстан"
    assert finder.judge(_posts(7, imp), d, subs=9000)["reason"] == "импорт / под заказ"
    assert finder.judge(_posts(7, used), d, subs=1200)["reason"] == "мало подписчиков"
    assert finder.judge(_posts(3, used), d, subs=9000)["reason"].startswith("постов за неделю")
    assert finder.judge(_posts(7, "Росстат: продажи новых машин выросли на 12% за месяц"), d, subs=9000)["reason"] == "не объявления о продаже авто"
    r = finder.judge(_posts(4, used, per_day=3), d, subs=9000, min_subs=5000, min_week=7, min_days=6)
    assert r["reason"] == "посты не каждый день (4 из 7)"
    data = finder.table([dict(r, link="https://t.me/x", title="X")], [], "Telegram")
    assert data[:2] == b"PK"                                                     # .xlsx


async def test_admin_tgfind_table(env):
    """/tgfind 2: поиск Telegram по фразам → проверка постов → таблица .xlsx с подходящими; импорт и уже известные — нет."""
    import userbot
    from types import SimpleNamespace
    from aiogram.methods import SendDocument
    dp, bot, s, ctx = env
    used = "Продам Lada Vesta 2019, пробег 60 000 км, Самара. Цена 1 050 000 ₽."
    imp = "Авто из Японии под заказ: Toyota Prius 2018, растаможка под ключ. Цена 1 500 000 ₽."

    class FindTelethon(SimilarTelethon):
        async def __call__(self, request):
            from telethon.tl.types.messages import Chats
            ch = lambda i, u, t, n: Channel(id=i, title=t, photo=ChatPhotoEmpty(), date=None, access_hash=1, username=u,
                                            participants_count=n, broadcast=True)
            if type(request).__name__ == "SearchRequest":
                return SimpleNamespace(chats=[ch(601, "avto_samara_bu", "Авторынок Самара", 15000), ch(602, "japan_auto", "Авто из Японии", 40000),
                                              ch(603, "avto_msk", "Уже в базе", 7000), ch(604, "small_avto", "Авто мало", 900)])
            return Chats(chats=[])

        async def get_messages(self, c, limit=40):
            text = imp if c.username == "japan_auto" else used
            return [SimpleNamespace(date=dt, message=t) for dt, t in _posts(7, text)]
    reader = Reader(bot, ctx, FindTelethon())
    reader.runner = asyncio.get_running_loop().create_future()
    ctx.reader = reader

    async def no_sleep(_):
        pass
    orig, userbot.asyncio.sleep = userbot.asyncio.sleep, no_sleep
    try:
        await dp.feed_update(bot, msg("/tgfind 2", ADMIN))
        await asyncio.gather(*ctx.background)
    finally:
        userbot.asyncio.sleep = orig
    doc = [m for m in s.sent if isinstance(m, SendDocument)][-1]
    assert doc.document.filename == "telegram_kanaly.xlsx" and "Подходят: 1" in doc.caption and "отсеяны с причиной: 1" in doc.caption
    from openpyxl import load_workbook
    import io
    wb = load_workbook(io.BytesIO(doc.document.data))
    links = [r[0].value for r in wb["Telegram"].iter_rows(min_row=2)]
    assert links == ["https://t.me/avto_samara_bu"] and wb["Отсеяны"]["J2"].value == "импорт / под заказ"


async def test_admin_vkfind_table(env):
    """/vkfind 300: группы ВК 5000+ с постами каждый день и машинами с ценой → таблица; импорт и «через день» — в отсеянных."""
    from aiogram.methods import SendDocument
    dp, bot, s, ctx = env
    day = 86400
    used = "Продам Hyundai Solaris 2016, пробег 120 000 км, Пермь. Цена 850 000 ₽"
    def wall(days, text, per_day=2):
        return [{"id": d * 10 + i, "date": int(time.time()) - d * day - 3600 * (i + 1), "text": text} for d in days for i in range(per_day)]

    class TableVK(FakeVK):
        async def call(self, method, **p):
            if method == "groups.search":
                return {"items": [{"id": 11, "name": "Авторынок Пермь", "is_closed": 0}, {"id": 12, "name": "Авто из Кореи", "is_closed": 0},
                                  {"id": 13, "name": "Авто барахолка", "is_closed": 0}]}
            if method == "groups.getById" and "group_ids" in p:
                return {"groups": [{"id": int(i), "name": f"g{i}", "screen_name": f"g{i}", "members_count": 20000, "description": ""}
                                   for i in p["group_ids"].split(",")]}
            if method == "wall.get":
                return {"items": {11: wall(range(7), used), 12: wall(range(7), "Привезём из Кореи под заказ Kia K5 2022, цена 2 900 000 ₽"),
                                  13: wall(range(0, 7, 2), used)}[-p["owner_id"]]}
            return await super().call(method, **p)
    ctx.vk = VKReader(bot, ctx, make_api=lambda t: TableVK())
    ctx.vk.api = TableVK()
    ctx.vk.runner = asyncio.create_task(asyncio.sleep(3600))
    try:
        await dp.feed_update(bot, msg("/vkfind 300", ADMIN))
        await asyncio.gather(*ctx.background)
    finally:
        ctx.vk.runner.cancel()
        ctx.vk = None
    doc = [m for m in s.sent if isinstance(m, SendDocument)][-1]
    from openpyxl import load_workbook
    import io
    wb = load_workbook(io.BytesIO(doc.document.data))
    assert [r[0].value for r in wb["ВКонтакте"].iter_rows(min_row=2)] == ["https://vk.com/g11"]
    assert {r[9].value for r in wb["Отсеяны"].iter_rows(min_row=2)} == {"импорт / под заказ", "посты не каждый день (4 из 7)"}


async def test_admin_bulk_links_report(env):
    """Админ вставляет 300 ссылок просто сообщением (без кнопки и /add) — бот отвечает итогом, частями ≤ 4096 символов:
    сколько взял в работу, какие уже в базе, какие уже в очереди, что не понял. Раньше длинный ответ Telegram отклонял — бот «молчал»."""
    dp, bot, s, ctx = env
    await dp.feed_update(bot, msg("/start", ADMIN))
    links = [f"https://t.me/new_avto_channel_{i}" for i in range(300)]
    before = len(s.sent)
    await dp.feed_update(bot, msg("\n".join(links + ["@avto_msk", "привет"]), ADMIN))
    out = [m.text for m in s.sent[before:] if isinstance(m, SendMessage)]
    assert out and all(len(t) <= 4096 for t in out) and len(out) >= 2
    text = "\n".join(out)
    assert "Получил ссылок: <b>301</b>" in text and "Взял в работу: 300" in text and "Уже были в базе и работают: 1" in text
    assert "Не понял (не ссылка на канал): 1" in text and "привет" in text
    await dp.feed_update(bot, msg("/add t.me/new_avto_channel_5 t.me/new_avto_channel_6", ADMIN))
    assert "Уже стоят в очереди на подключение: 2" in s.texts(ADMIN)[-1] and "Взял в работу" not in s.texts(ADMIN)[-1]
    before = len(s.sent)
    await dp.feed_update(bot, msg("t.me/some_cars_x", USER))                    # обычный человек — не в базу
    assert not await ctx.db._one("SELECT 1 FROM channels WHERE username='some_cars_x' AND base=1")


async def test_list_shows_queue_pace_and_tg_limit(env):
    """/list объясняет, почему очередь медленная: темп вступлений, пауза от Telegram и лимит 500 каналов на аккаунт (владелец 12.11)."""
    dp, bot, s, ctx = env
    await dp.feed_update(bot, msg("/start", ADMIN))
    await dp.feed_update(bot, msg("\n".join(f"t.me/queue_cars_{i}" for i in range(470)), ADMIN))
    assert "500" in "\n".join(s.texts(ADMIN)[-3:])                                   # предупреждение уже при добавлении

    class R:
        online, join_pause_until = True, time.time() + 3600
    ctx.reader = R()
    try:
        await dp.feed_update(bot, msg("/list", ADMIN))
    finally:
        ctx.reader = None
    text = s.texts(ADMIN)[-1]
    assert "раз в 90 с" in text and "≈ 11,8 ч" in text and "Telegram попросил паузу" in text and "Premium" in text
