"""Экраны человека: старт → фильтр обычными словами → каналы (база и свои) → статистика → подписка."""
import html
import logging
import re
import time
from datetime import datetime

from aiogram import F, Router
from aiogram.filters import Command, CommandObject, CommandStart
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup
from aiogram.types import CallbackQuery, Message

import keyboards as K
import plans
import texts as T
from admin import is_admin, is_admin_id, make_admins_pro, queue_wait
from ctx import Ctx
from db import DAY
from links import label, parse_link
from pipeline import seconds, wait_text
from query import Filter, describe, parse_filter

router = Router(name="user")
log = logging.getLogger(__name__)


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
    await make_admins_pro(ctx)
    channels = await ctx.db.channel_count_for(msg.from_user.id)
    trial = T.WELCOME_TRIAL.format(price=ctx.cfg.price_trial) if ctx.cfg.payments_on else ""
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
    limit = await filter_limit(ctx, ev.from_user.id)
    if limit:
        await msg.answer(limit, reply_markup=K.plans(plans.plans(ctx.cfg), False, only="pro"))
    else:
        await state.set_data({})          # новый фильтр, а не правка старого
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


@router.message(S.filter, F.text & ~F.text.startswith("/"))
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
    uid = cb.from_user.id
    if data.get("edit_id") and await ctx.db.update_filter(uid, data["edit_id"], data["pending_text"], data["pending"]):
        n = [r["id"] for r in await ctx.db.filters(uid)].index(data["edit_id"]) + 1
        await cb.message.answer(T.FILTER_UPDATED.format(n=n), reply_markup=K.filter_saved(data["edit_id"]))
        return await cb.answer()
    limit = await filter_limit(ctx, uid)
    if limit:
        await cb.message.answer(limit, reply_markup=K.plans(plans.plans(ctx.cfg), False, only="pro"))
        return await cb.answer()
    plan = plans.current(ctx.cfg, await ctx.db.user(uid))
    if plan and not plan.market and Filter.loads(data["pending"]).min_discount:
        await cb.message.answer(T.DISCOUNT_FILTER_PRO, reply_markup=K.plans(plans.plans(ctx.cfg), False, only="pro"))
        return await cb.answer()
    fid = await ctx.db.add_filter(uid, data["pending_text"], data["pending"])
    await ctx.db.event(uid, "filter")
    if not plans.current(ctx.cfg, await ctx.db.user(uid)):      # без тарифа машины не придут — сразу говорим
        await offer_plans(cb.message, ctx, uid, T.NEED_PLAN)
        return await cb.answer()
    channels = await ctx.db.channel_count_for(uid)
    await cb.message.answer(T.FILTER_SAVED.format(channels=channels), reply_markup=K.filter_saved(fid))
    await cb.answer()


async def filter_limit(ctx: Ctx, uid: int) -> str | None:
    """Текст «упёрся в лимит тарифа» или None. Без тарифа фильтр создать можно — машины пойдут после оплаты."""
    plan = plans.current(ctx.cfg, await ctx.db.user(uid)) or plans.plans(ctx.cfg)["basic"]
    if len(await ctx.db.filters(uid)) >= plan.max_filters:
        return T.FILTER_LIMIT_PLAN.format(plan=plan.title, n=plan.max_filters)
    return None


@router.callback_query(F.data.startswith("f:e:"))
async def edit_filter_ask(cb: CallbackQuery, ctx: Ctx, state: FSMContext) -> None:
    """✏️ — показать, что ищем сейчас, и принять фильтр заново; сохранится в тот же фильтр."""
    fid = int(cb.data.split(":")[2])
    rows = await ctx.db.filters(cb.from_user.id)
    row = next((r for r in rows if r["id"] == fid), None)
    if not row:
        return await cb.answer()
    await state.set_state(S.filter)
    await state.set_data({"edit_id": fid})
    n = rows.index(row) + 1
    await cb.message.answer(T.EDIT_FILTER.format(n=n, card=describe(Filter.loads(row["data"]), ctx.dict),
                                                 text=html.escape(row["text"])))
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
                                       pending=f" (+{queued} подключаю)" if queued else ""),
                     reply_markup=K.channels(admin=await is_admin_id(ctx, uid)))


@router.callback_query(F.data == "c:add")
async def ask_channel(cb: CallbackQuery, ctx: Ctx, state: FSMContext) -> None:
    await state.set_state(S.channel)
    await cb.message.answer(T.ASK_CHANNEL_ADMIN if await is_admin(cb, ctx) else T.ASK_CHANNEL)
    await cb.answer()


@router.message(S.channel, F.text & ~F.text.startswith("/"))
async def got_channel(msg: Message, ctx: Ctx, state: FSMContext) -> None:
    if msg.text.startswith("/") or msg.text in MENU:
        await state.clear()
        return await MENU[msg.text](msg, ctx, state) if msg.text in MENU else None
    await state.clear()
    uid = msg.from_user.id
    if await is_admin(msg, ctx):
        return await add_to_base(msg, ctx)
    replies, mine, upsell = [], [], False
    for line in [x for x in re.split(r"[\s,]+", msg.text) if x]:
        link = parse_link(line)
        if not link:
            replies.append(T.CHANNEL_BAD.format(link=line[:60]))
            continue
        own = [r for r in await ctx.db.own_channels(uid)]
        plan = plans.current(ctx.cfg, await ctx.db.user(uid)) or plans.plans(ctx.cfg)["basic"]
        if len(own) >= plan.max_own:
            what = f"до {plan.max_own} своих каналов" if plan.max_own else "только общая база каналов"
            replies.append(T.OWN_LIMIT_PLAN.format(plan=plan.title, what=what))
            upsell = True
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
        elif ch["status"] == "awaiting":           # заявку уже отправили — ждём админа вместе со всеми
            await ctx.db.add_approval_waiter(cid, uid)
            replies.append(T.CHANNEL_AWAITING.format(name=name))
        else:
            if ch["status"] == "failed":
                await ctx.db._run("UPDATE channels SET status='queued', error=NULL WHERE id=?", cid)
            await ctx.db.add_waiter(cid, uid)
            replies.append(T.CHANNEL_QUEUED.format(name=name))
            mine.append(cid)
    wait = (await queue_wait(ctx, mine) if mine else "") + vk_note(ctx, msg.text)
    markup = K.plans(plans.plans(ctx.cfg), False, only="pro") if upsell else K.menu()
    await msg.answer("\n".join(replies) + wait or T.ASK_CHANNEL, reply_markup=markup)



def vk_note(ctx: Ctx, text: str) -> str:
    """Прислали группу ВК, а служебная страница ВК не подключена — честно говорим, что подключим позже."""
    vk_sent = any((parse_link(x) or ("",))[0] == "vk" for x in re.split(r"[\s,]+", text) if x)
    return T.VK_OFFLINE if vk_sent and not (ctx.vk and ctx.vk.online) else ""


async def add_to_base(msg: Message, ctx: Ctx) -> None:
    """Админ присылает каналы через «📢 Каналы» — они сразу идут в общую базу для всех, без лимитов тарифа."""
    uid = msg.from_user.id
    replies, queued = [], []
    for line in [x for x in re.split(r"[\s,]+", msg.text) if x]:
        link = parse_link(line)
        if not link:
            replies.append(T.CHANNEL_BAD.format(link=line[:60]))
            continue
        kind, value = link
        cid, _ = await ctx.db.add_channel(**{kind: value}, base=True, added_by=uid)   # свой канал админа тоже станет общим
        await ctx.db.set_channel_state(uid, cid, None)
        ch = await ctx.db.channel(cid)
        name = ch["title"] or label(kind, value)
        if ch["status"] == "joined":
            replies.append(T.CHANNEL_BASE_ADDED.format(name=name))
        elif ch["status"] == "awaiting":
            await ctx.db.add_approval_waiter(cid, uid)
            replies.append(T.CHANNEL_AWAITING.format(name=name))
        else:
            if ch["status"] == "failed":
                await ctx.db._run("UPDATE channels SET status='queued', error=NULL WHERE id=?", cid)
            await ctx.db.add_waiter(cid, uid)
            replies.append(T.CHANNEL_BASE_QUEUED.format(name=name))
            queued.append(cid)
    await ctx.refresh_channels()
    wait = (await queue_wait(ctx, queued) if queued else "") + vk_note(ctx, msg.text)
    await msg.answer("\n".join(replies) + wait or T.ASK_CHANNEL_ADMIN, reply_markup=K.menu())


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
def can_trial(u) -> bool:
    return not u["trial_used"] and u["paid_until"] <= time.time()


def plans_text(ctx: Ctx, u) -> str:
    p = plans.plans(ctx.cfg)
    trial = T.PLAN_TRIAL_TEXT.format(price=p["trial"].price) if can_trial(u) else ""
    b = p["basic"]
    return T.PLANS.format(trial=trial, basic=b.price, pro=p["pro"].price, delay=wait_text(b.delay) if b.delay else "0 с",
                          basic_filters=f"{b.max_filters} {'фильтр' if b.max_filters == 1 else 'фильтра' if b.max_filters < 5 else 'фильтров'}",
                          basic_own=f"до {b.max_own} своих каналов" if b.max_own else "без своих каналов и групп")


_plans_photo: dict[tuple, str] = {}     # картинка сравнения тарифов → file_id в Telegram (рисуем один раз)


async def send_plans(msg: Message, ctx: Ctx, uid: int, intro: str = "") -> None:
    """Картинка «Простой против PRO» + короткая подпись + кнопки тарифов."""
    u = await ctx.db.user(uid)
    p = plans.plans(ctx.cfg)
    b = p["basic"]
    plan = plans.current(ctx.cfg, u)
    status = (T.SUB_FREE if plan is plans.FREE else
              T.SUB_STATUS_ACTIVE.format(plan=plan.title, until=fmt_date(max(u["paid_until"], u["trial_until"])))
              if plan else T.SUB_STATUS_NONE)
    status = (intro + "\n\n" if intro else "") + status
    caption = T.PLANS_CAPTION.format(
        status=status,
        trial=T.PLAN_TRIAL_SHORT.format(price=p["trial"].price) if can_trial(u) else "",
        basic=b.price, pro=p["pro"].price, delay=wait_text(b.delay) if b.delay else "0 с",
        basic_filters=f"{b.max_filters} {'фильтр' if b.max_filters == 1 else 'фильтра' if b.max_filters < 5 else 'фильтров'}")
    markup = K.plans(p, can_trial(u))
    key = (b, p["pro"], p["trial"])
    try:
        if key not in _plans_photo:
            from aiogram.types import BufferedInputFile
            import plans_image
            photo = BufferedInputFile(plans_image.render(b, p["pro"], p["trial"]), "plans.png")
        else:
            photo = _plans_photo[key]
        sent = await msg.answer_photo(photo, caption=caption, reply_markup=markup)
        if sent.photo:
            _plans_photo[key] = sent.photo[-1].file_id
    except Exception as e:      # не нарисовалось (нет шрифта и т.п.) — тарифы текстом
        log.warning("картинка тарифов: %s", e)
        await msg.answer(status + plans_text(ctx, u), reply_markup=markup)


async def offer_plans(msg: Message, ctx: Ctx, uid: int, intro: str = "") -> None:
    await send_plans(msg, ctx, uid, intro)


async def show_sub(msg: Message, ctx: Ctx, state: FSMContext, uid: int | None = None) -> None:
    await send_plans(msg, ctx, uid or msg.chat.id)


@router.callback_query(F.data.startswith("s:pay"))
async def pay(cb: CallbackQuery, ctx: Ctx) -> None:
    if not ctx.cfg.payments_on:      # тарифы видно (их проверяет Робокасса), но платить пока некуда
        return await cb.answer(T.PAY_SOON, show_alert=True)
    all_plans = plans.plans(ctx.cfg)
    plan = all_plans.get(cb.data.split(":")[2] if cb.data.count(":") == 2 else "basic", all_plans["basic"])
    u = await ctx.db.user(cb.from_user.id)
    if plan.id == "trial" and not can_trial(u):
        await cb.message.answer(T.TRIAL_USED, reply_markup=K.plans(all_plans, False))
        return await cb.answer()
    try:
        pid, url = await ctx.pay.create(cb.from_user.id, plan.price, T.PAY_DESCRIPTION.format(plan=plan.title, days=plan.days))
    except Exception as e:
        log.warning("оплата не создана: %s", e)
        await cb.message.answer(T.PAY_ERROR)
        return await cb.answer()
    await ctx.db.add_payment(cb.from_user.id, pid, plan.price, plan.id)
    current = plans.current(ctx.cfg, u)
    switch = T.PAY_SWITCH.format(old=current.title) if current and current.id not in (plan.id, "free") and u["plan"] else ""
    days_word = "день" if plan.days == 1 else "дней"
    await cb.message.answer(T.PAY_LINK.format(plan=plan.title, price=plan.price, days=plan.days, days_word=days_word) + switch,
                            reply_markup=K.pay_link(url, plan.price))
    await cb.answer()


async def apply_payment(ctx: Ctx, uid: int, yk_id: str, status: str) -> float | None:
    """Итог платежа → тариф и срок. Возвращает новую дату доступа, если продлили именно сейчас."""
    if status not in ("succeeded", "canceled") or not await ctx.db.finish_payment(yk_id, status):
        return None
    if status == "canceled":
        return None
    p = await ctx.db.payment(yk_id)
    plan_id = p["plan"] or "basic"
    u = await ctx.db.user(uid)
    until = plans.new_period(ctx.cfg, u, plan_id)
    await ctx.db.set_user(uid, paid_until=until, plan=plan_id, **({"trial_used": 1} if plan_id == "trial" else {}))
    await ctx.db.event(uid, "paid", plan_id)
    return until


@router.callback_query(F.data == "s:check")
async def check(cb: CallbackQuery, ctx: Ctx) -> None:
    p = await ctx.db.last_pending(cb.from_user.id)
    if not p:
        return await cb.answer(T.PAY_WAIT, show_alert=True)
    status = await ctx.pay.status(p["yk_id"])
    until = await apply_payment(ctx, cb.from_user.id, p["yk_id"], status)
    if until:
        plan = plans.plans(ctx.cfg)[p["plan"] or "basic"]
        await cb.message.edit_reply_markup(reply_markup=None)
        await cb.message.answer(T.PAY_OK.format(plan=plan.title, until=fmt_date(until)))
        await cb.answer()
    else:
        await cb.answer(T.PAY_FAIL if status == "canceled" else T.PAY_WAIT, show_alert=True)


# ---------- помощь и меню ----------
async def show_help(msg: Message, ctx: Ctx, state: FSMContext) -> None:
    await msg.answer(T.HELP, reply_markup=K.help_menu())


MENU = {T.MENU_FILTERS: show_filters, T.OLD_MENU_FILTERS: show_filters, T.MENU_CHANNELS: show_channels, T.MENU_STATS: show_stats,
        T.MENU_SUB: show_sub, T.MENU_HELP: show_help}


@router.message(F.text.in_(MENU))
async def menu(msg: Message, ctx: Ctx, state: FSMContext) -> None:
    await state.clear()
    await MENU[msg.text](msg, ctx, state)


@router.message(Command("help"))
async def help_cmd(msg: Message, ctx: Ctx, state: FSMContext) -> None:
    await show_help(msg, ctx, state)


def offer_text(cfg) -> str:
    p = plans.plans(cfg)
    seller = (T.OFFER_SELLER.format(name=cfg.seller_name, inn=cfg.seller_inn,
                                    contact=cfg.seller_contact + ", " if cfg.seller_contact else "")
              if cfg.seller_name and cfg.seller_inn else T.OFFER_SELLER_EMPTY)
    return T.OFFER.format(seller=seller, trial=p["trial"].price, basic=p["basic"].price, pro=p["pro"].price,
                          contact_tail=f" или {cfg.seller_contact}" if cfg.seller_contact else "")


@router.message(Command("offer"))
async def offer_cmd(msg: Message, ctx: Ctx) -> None:
    await msg.answer(offer_text(ctx.cfg))


@router.callback_query(F.data == "offer")
async def offer_cb(cb: CallbackQuery, ctx: Ctx) -> None:
    await cb.message.answer(offer_text(ctx.cfg))
    await cb.answer()


@router.message(F.text & ~F.text.startswith("/"))
async def free_text(msg: Message, ctx: Ctx, state: FSMContext) -> None:
    """Написал что-то без кнопок — если это похоже на фильтр, предлагаем сохранить."""
    if await ctx.db.user(msg.from_user.id) is None:
        await ctx.db.add_user(msg.from_user.id, msg.from_user.username, msg.from_user.first_name, None, None, ctx.cfg.trial_days)
    if not await show_filter_card(msg, ctx, state, msg.text, T.FREE_TEXT_FILTER):
        await show_help(msg, ctx, state)
