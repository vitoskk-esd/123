"""Экраны человека: старт → фильтр обычными словами → каналы (база и свои) → статистика → подписка."""
import re
import time
from datetime import datetime

from aiogram import F, Router
from aiogram.filters import Command, CommandObject, CommandStart
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup
from aiogram.types import CallbackQuery, Message

import keyboards as K
import texts as T
from admin import is_admin, queue_wait
from ctx import Ctx
from db import DAY
from links import label, parse_link
from pipeline import seconds
from query import describe, parse_filter

router = Router(name="user")


class S(StatesGroup):
    filter = State()
    channel = State()


def fmt_date(ts: float) -> str:
    return datetime.fromtimestamp(ts).strftime("%d.%m.%Y")


# ---------- старт ----------
@router.message(CommandStart())
async def start(msg: Message, command: CommandObject, ctx: Ctx, state: FSMContext) -> None:
    await state.clear()
    source = re.sub(r"[^\w-]", "", command.args or "")[:32] or None   # t.me/<бот>?start=reels — откуда пришёл
    new = await ctx.db.add_user(msg.from_user.id, msg.from_user.username, msg.from_user.first_name, source, None,
                                ctx.cfg.trial_days)
    channels = await ctx.db.channel_count_for(msg.from_user.id)
    trial = T.WELCOME_TRIAL.format(days=ctx.cfg.trial_days) if ctx.cfg.payments_on else ""
    await msg.answer(T.WELCOME.format(brand=T.BRAND, channels=channels, trial=trial), reply_markup=K.menu())
    if ctx.reader and not ctx.reader.online and await is_admin(msg, ctx):
        await msg.answer(T.NEED_CONNECT)
        return
    if new or not await ctx.db.filters(msg.from_user.id):
        await msg.answer(T.ASK_FILTER, reply_markup=K.new_filter())
        await state.set_state(S.filter)


# ---------- фильтры ----------
@router.message(Command("filter"))
@router.callback_query(F.data == "f:new")
async def ask_filter(ev, ctx: Ctx, state: FSMContext) -> None:
    msg = ev.message if isinstance(ev, CallbackQuery) else ev
    if len(await ctx.db.filters(ev.from_user.id)) >= ctx.cfg.max_filters:
        await msg.answer(T.FILTER_LIMIT.format(n=ctx.cfg.max_filters))
    else:
        await state.set_state(S.filter)
        await msg.answer(T.ASK_FILTER)
    if isinstance(ev, CallbackQuery):
        await ev.answer()


async def show_filter_card(msg: Message, ctx: Ctx, state: FSMContext, text: str, intro: str) -> bool:
    f = parse_filter(text, ctx.dict)
    if f.empty:
        return False
    await state.update_data(pending=f.dumps(), pending_text=text.strip()[:200])
    await msg.answer(intro.format(card=describe(f, ctx.dict)), reply_markup=K.confirm_filter())
    return True


@router.message(S.filter, F.text)
async def got_filter(msg: Message, ctx: Ctx, state: FSMContext) -> None:
    if msg.text.startswith("/") or msg.text in MENU:
        await state.clear()
        return await MENU[msg.text](msg, ctx, state) if msg.text in MENU else None
    if not await show_filter_card(msg, ctx, state, msg.text, T.FILTER_CARD):
        await msg.answer(T.FILTER_EMPTY)


@router.callback_query(F.data == "f:save")
async def save_filter(cb: CallbackQuery, ctx: Ctx, state: FSMContext) -> None:
    data = await state.get_data()
    if not data.get("pending"):
        return await cb.answer()
    await state.clear()
    await cb.message.edit_reply_markup(reply_markup=None)
    if len(await ctx.db.filters(cb.from_user.id)) >= ctx.cfg.max_filters:
        await cb.message.answer(T.FILTER_LIMIT.format(n=ctx.cfg.max_filters))
        return await cb.answer()
    await ctx.db.add_filter(cb.from_user.id, data["pending_text"], data["pending"])
    await ctx.db.event(cb.from_user.id, "filter")
    channels = await ctx.db.channel_count_for(cb.from_user.id)
    await cb.message.answer(T.FILTER_SAVED.format(channels=channels), reply_markup=K.menu())
    await cb.answer()


async def show_filters(msg: Message, ctx: Ctx, state: FSMContext, uid: int | None = None) -> None:
    rows = await ctx.db.filters(uid or msg.chat.id)
    if not rows:
        await msg.answer(T.FILTERS_NONE, reply_markup=K.new_filter())
        return
    items = "\n".join(T.FILTER_ITEM.format(icon="🟢" if r["active"] else "⏸", n=i, text=r["text"])
                      for i, r in enumerate(rows, 1))
    await msg.answer(T.FILTERS.format(items=items), reply_markup=K.filters(rows))


@router.callback_query(F.data.startswith("f:t:") | F.data.startswith("f:d:"))
async def edit_filter(cb: CallbackQuery, ctx: Ctx, state: FSMContext) -> None:
    fid = int(cb.data.split(":")[2])
    if cb.data.startswith("f:t:"):
        await ctx.db.toggle_filter(cb.from_user.id, fid)
    else:
        await ctx.db.delete_filter(cb.from_user.id, fid)
    rows = await ctx.db.filters(cb.from_user.id)
    if rows:
        items = "\n".join(T.FILTER_ITEM.format(icon="🟢" if r["active"] else "⏸", n=i, text=r["text"])
                          for i, r in enumerate(rows, 1))
        await cb.message.edit_text(T.FILTERS.format(items=items), reply_markup=K.filters(rows))
    else:
        await cb.message.edit_text(T.FILTERS_NONE, reply_markup=K.new_filter())
    await cb.answer()


@router.callback_query(F.data.startswith("f:p:"))
async def pause_filter(cb: CallbackQuery, ctx: Ctx) -> None:
    row = await ctx.db.filter(cb.from_user.id, int(cb.data.split(":")[2]))
    if row and row["active"]:
        await ctx.db.toggle_filter(cb.from_user.id, row["id"])
    await cb.answer(T.FILTER_PAUSED, show_alert=True)


# ---------- каналы ----------
async def show_channels(msg: Message, ctx: Ctx, state: FSMContext, uid: int | None = None) -> None:
    uid = uid or msg.chat.id
    base = [r for r in await ctx.db.base_channels() if r["status"] == "joined"]
    off = await ctx.db.off_channels(uid) & {r["id"] for r in base}
    own = await ctx.db.own_channels(uid)
    ready = [r for r in own if r["status"] == "joined"]
    queued = len([r for r in own if r["status"] == "queued"])
    await msg.answer(T.CHANNELS.format(total=len(base) - len(off) + len(ready), base=len(base), off=len(off), own=len(ready),
                                       pending=f" (+{queued} подключаю)" if queued else ""), reply_markup=K.channels())


@router.callback_query(F.data == "c:add")
async def ask_channel(cb: CallbackQuery, state: FSMContext) -> None:
    await state.set_state(S.channel)
    await cb.message.answer(T.ASK_CHANNEL)
    await cb.answer()


@router.message(S.channel, F.text)
async def got_channel(msg: Message, ctx: Ctx, state: FSMContext) -> None:
    if msg.text.startswith("/") or msg.text in MENU:
        await state.clear()
        return await MENU[msg.text](msg, ctx, state) if msg.text in MENU else None
    await state.clear()
    uid = msg.from_user.id
    replies, mine = [], []
    for line in [x for x in re.split(r"[\s,]+", msg.text) if x]:
        link = parse_link(line)
        if not link:
            replies.append(T.CHANNEL_BAD.format(link=line[:60]))
            continue
        own = [r for r in await ctx.db.own_channels(uid)]
        if len(own) >= ctx.cfg.max_own_channels:
            replies.append(T.OWN_LIMIT.format(n=ctx.cfg.max_own_channels))
            break
        kind, value = link
        cid, _ = await ctx.db.add_channel(**{kind: value}, base=False, added_by=uid)
        ch = await ctx.db.channel(cid)
        name = ch["title"] or label(kind, value)
        if ch["base"]:
            await ctx.db.set_channel_state(uid, cid, None)   # был отключён — включаем обратно
            replies.append(T.CHANNEL_IN_BASE.format(name=name))
            continue
        await ctx.db.set_channel_state(uid, cid, "own")
        if ch["status"] == "joined":
            replies.append(T.CHANNEL_JOINED.format(name=name))
        else:
            if ch["status"] == "failed":
                await ctx.db._run("UPDATE channels SET status='queued', error=NULL WHERE id=?", cid)
            await ctx.db.add_waiter(cid, uid)
            replies.append(T.CHANNEL_QUEUED.format(name=name))
            mine.append(cid)
    wait = await queue_wait(ctx, mine) if mine else ""
    await msg.answer("\n".join(replies) + wait or T.ASK_CHANNEL, reply_markup=K.menu())



@router.callback_query(F.data.startswith("c:base:") | F.data.startswith("c:tg:"))
async def base_list(cb: CallbackQuery, ctx: Ctx) -> None:
    parts = cb.data.split(":")
    if parts[1] == "tg":
        cid, page = int(parts[2]), int(parts[3])
        off = await ctx.db.off_channels(cb.from_user.id)
        await ctx.db.set_channel_state(cb.from_user.id, cid, None if cid in off else "off")
    else:
        page = int(parts[2])
    rows = [r for r in await ctx.db.base_channels() if r["status"] == "joined"]
    markup = K.base_list(rows, await ctx.db.off_channels(cb.from_user.id), page)
    if parts[1] == "tg":
        await cb.message.edit_reply_markup(reply_markup=markup)
    else:
        await cb.message.answer(T.BASE_LIST if rows else "В общей базе пока нет каналов.", reply_markup=markup)
    await cb.answer()


@router.callback_query((F.data == "c:own") | F.data.startswith("c:rm:"))
async def own_list(cb: CallbackQuery, ctx: Ctx) -> None:
    if cb.data.startswith("c:rm:"):
        await ctx.db.set_channel_state(cb.from_user.id, int(cb.data.split(":")[2]), None)
    rows = await ctx.db.own_channels(cb.from_user.id)
    text = T.OWN_LIST if rows else T.OWN_NONE
    if cb.data.startswith("c:rm:"):
        await cb.message.edit_text(text, reply_markup=K.own_list(rows))
    else:
        await cb.message.answer(text, reply_markup=K.own_list(rows))
    await cb.answer()


# ---------- статистика ----------
async def stats_values(ctx: Ctx, uid: int) -> dict:
    now = time.time()
    w, m = await ctx.db.user_stats(uid, now - 7 * DAY), await ctx.db.user_stats(uid, now - 30 * DAY)
    top = T.STATS_TOP.format(items=", ".join(f"{n} ({c})" for n, c in w["top"])) if w["top"] else ""
    return dict(n7=w["n"], good7=w["good"], great7=w["great"], lat7=seconds(w["lat"] and int(w["lat"])),
                best7=seconds(w["best"]), dups7=w["dups"], top=top, n30=m["n"], good30=m["good"])


@router.message(Command("stats"))
async def show_stats(msg: Message, ctx: Ctx, state: FSMContext, uid: int | None = None) -> None:
    await msg.answer(T.STATS.format(**await stats_values(ctx, uid or msg.chat.id)))


# ---------- подписка ----------
async def show_sub(msg: Message, ctx: Ctx, state: FSMContext, uid: int | None = None) -> None:
    c = ctx.cfg
    if not c.payments_on:
        return await msg.answer(T.SUB_FREE)
    u = await ctx.db.user(uid or msg.chat.id)
    until = max(u["trial_until"], u["paid_until"])
    if until > time.time():
        tpl = T.SUB_ACTIVE if u["paid_until"] > time.time() else T.SUB_TRIAL
        text = tpl.format(until=fmt_date(until), price=c.price, days=c.period_days)
    else:
        text = T.SUB_NONE.format(price=c.price, days=c.period_days)
    await msg.answer(text, reply_markup=K.pay(c.price))


@router.callback_query(F.data == "s:pay")
async def pay(cb: CallbackQuery, ctx: Ctx) -> None:
    c = ctx.cfg
    try:
        pid, url = await ctx.pay.create(cb.from_user.id)
    except Exception:
        await cb.message.answer(T.PAY_ERROR)
        return await cb.answer()
    await ctx.db.add_payment(cb.from_user.id, pid, c.price)
    await cb.message.answer(T.PAY_LINK.format(price=c.price, days=c.period_days), reply_markup=K.pay_link(url, c.price))
    await cb.answer()


async def apply_payment(ctx: Ctx, uid: int, yk_id: str, status: str) -> float | None:
    """Итог платежа → продление. Возвращает новую дату доступа, если продлили именно сейчас."""
    if status not in ("succeeded", "canceled") or not await ctx.db.finish_payment(yk_id, status):
        return None
    if status == "canceled":
        return None
    await ctx.db.event(uid, "paid")
    return await ctx.db.extend(uid, ctx.cfg.period_days)


@router.callback_query(F.data == "s:check")
async def check(cb: CallbackQuery, ctx: Ctx) -> None:
    p = await ctx.db.last_pending(cb.from_user.id)
    if not p:
        return await cb.answer(T.PAY_WAIT, show_alert=True)
    status = await ctx.pay.status(p["yk_id"])
    until = await apply_payment(ctx, cb.from_user.id, p["yk_id"], status)
    if until:
        await cb.message.edit_reply_markup(reply_markup=None)
        await cb.message.answer(T.PAY_OK.format(until=fmt_date(until)))
        await cb.answer()
    else:
        await cb.answer(T.PAY_FAIL if status == "canceled" else T.PAY_WAIT, show_alert=True)


# ---------- помощь и меню ----------
async def show_help(msg: Message, ctx: Ctx, state: FSMContext) -> None:
    await msg.answer(T.HELP, reply_markup=K.menu())


MENU = {T.MENU_FILTERS: show_filters, T.MENU_CHANNELS: show_channels, T.MENU_STATS: show_stats,
        T.MENU_SUB: show_sub, T.MENU_HELP: show_help}


@router.message(F.text.in_(MENU))
async def menu(msg: Message, ctx: Ctx, state: FSMContext) -> None:
    await state.clear()
    await MENU[msg.text](msg, ctx, state)


@router.message(Command("help"))
async def help_cmd(msg: Message, ctx: Ctx, state: FSMContext) -> None:
    await show_help(msg, ctx, state)


@router.message(F.text & ~F.text.startswith("/"))
async def free_text(msg: Message, ctx: Ctx, state: FSMContext) -> None:
    """Написал что-то без кнопок — если это похоже на фильтр, предлагаем сохранить."""
    if await ctx.db.user(msg.from_user.id) is None:
        await ctx.db.add_user(msg.from_user.id, msg.from_user.username, msg.from_user.first_name, None, None, ctx.cfg.trial_days)
    if not await show_filter_card(msg, ctx, state, msg.text, T.FREE_TEXT_FILTER):
        await show_help(msg, ctx, state)
