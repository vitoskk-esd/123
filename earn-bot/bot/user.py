"""Воронка пользователя: старт → 18+ → квиз «где уже клиент» → каталог → ссылка → «Я оформил» → баланс → вывод."""
import re

from aiogram import Bot, F, Router
from aiogram.filters import CommandObject, CommandStart
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup
from aiogram.types import CallbackQuery, Message

from . import keyboards as K
from . import texts as T
from .ctx import CONDITION_DELAY, NUDGE_DELAYS, STALL_DELAY, Ctx
from .offers import Offer

router = Router(name="user")


class Claim(StatesGroup):
    name = State()
    phone4 = State()
    proof = State()


class Withdraw(StatesGroup):
    phone = State()
    bank = State()


def offer_card(o: Offer) -> str:
    steps = "\n".join(f"{i}. {s}" for i, s in enumerate(o.steps, 1))
    bonus = T.OFFER_BANK_BONUS.format(bank_bonus=o.bank_bonus) if o.bank_bonus else ""
    return T.OFFER_CARD.format(bank=o.bank, title=o.title, payout=o.payout, bank_bonus_line=bonus,
                               condition=o.condition or "по условиям акции", deadline_days=o.deadline_days, steps=steps)


async def show_catalog(msg: Message, ctx: Ctx, uid: int) -> None:
    offers = ctx.catalog.eligible(await ctx.db.banks(uid))
    if not offers:
        await msg.answer(T.CATALOG_EMPTY, reply_markup=K.menu())
        return
    await msg.answer(T.CATALOG, reply_markup=K.catalog(offers))


# ---------- 1. старт: источник из ссылки t.me/<бот>?start=<источник> ----------
@router.message(CommandStart())
async def start(msg: Message, command: CommandObject, ctx: Ctx, state: FSMContext) -> None:
    await state.clear()
    source = re.sub(r"[^\w-]", "", command.args or "")[:32] or None
    await ctx.db.add_user(msg.from_user.id, msg.from_user.username, msg.from_user.first_name, source)
    user = await ctx.db.user(msg.from_user.id)
    if user["consent"]:   # уже прошёл вступление — сразу к акциям
        await msg.answer(T.CATALOG, reply_markup=K.menu())
        await show_catalog(msg, ctx, msg.from_user.id)
        return
    top = max((o.payout for o in ctx.catalog.active), default=0)
    await msg.answer(T.WELCOME.format(brand=T.BRAND, max_payout=top), reply_markup=K.start())
    await ctx.db.schedule(msg.from_user.id, "stall", None, [STALL_DELAY])


@router.callback_query(F.data == "go")
async def go(cb: CallbackQuery) -> None:
    await cb.message.answer(T.AGE_Q, reply_markup=K.age())
    await cb.answer()


# ---------- 2. возраст ----------
@router.callback_query(F.data.startswith("age:"))
async def age(cb: CallbackQuery, ctx: Ctx, state: FSMContext) -> None:
    await cb.message.edit_reply_markup(reply_markup=None)
    if cb.data == "age:n":
        await cb.message.answer(T.AGE_NO)
        await ctx.db.cancel(cb.from_user.id, "stall")
    else:
        await ctx.db.set_flag(cb.from_user.id, "age_ok")
        await ctx.db.set_flag(cb.from_user.id, "consent", log=False)   # вступление пройдено: повторный /start — сразу в каталог
        await state.update_data(banks=[])
        await cb.message.answer(T.QUIZ, reply_markup=K.quiz(ctx.catalog.banks, set()))
    await cb.answer()


# ---------- 3. квиз: где уже есть карта ----------
@router.callback_query(F.data.startswith("qb:"))
async def quiz_toggle(cb: CallbackQuery, ctx: Ctx, state: FSMContext) -> None:
    picked = set((await state.get_data()).get("banks", []))
    picked ^= {cb.data[3:]}
    await state.update_data(banks=sorted(picked))
    await cb.message.edit_reply_markup(reply_markup=K.quiz(ctx.catalog.banks, picked))
    await cb.answer()


@router.callback_query(F.data == "qdone")
async def quiz_done(cb: CallbackQuery, ctx: Ctx, state: FSMContext) -> None:
    uid = cb.from_user.id
    picked = set((await state.get_data()).get("banks", []))
    await state.clear()
    await ctx.db.set_banks(uid, picked)
    await ctx.db.event(uid, "quiz_done")
    await ctx.db.cancel(uid, "stall")
    await cb.message.edit_reply_markup(reply_markup=None)
    offers = ctx.catalog.eligible(picked)
    if offers:
        await cb.message.answer(T.QUIZ_RESULT.format(n=len(offers), total=sum(o.payout for o in offers)), reply_markup=K.menu())
        await cb.message.answer(T.CATALOG, reply_markup=K.catalog(offers))
    else:
        await cb.message.answer(T.QUIZ_NONE, reply_markup=K.menu())
    await cb.answer()


# ---------- 5. каталог и карточка акции ----------
@router.message(F.text == T.MENU_OFFERS)
async def offers_menu(msg: Message, ctx: Ctx) -> None:
    await show_catalog(msg, ctx, msg.from_user.id)


@router.callback_query(F.data == "cat")
async def back_to_catalog(cb: CallbackQuery, ctx: Ctx) -> None:
    offers = ctx.catalog.eligible(await ctx.db.banks(cb.from_user.id))
    await cb.message.edit_text(T.CATALOG if offers else T.CATALOG_EMPTY, reply_markup=K.catalog(offers) if offers else None)
    await cb.answer()


@router.callback_query(F.data.startswith("o:"))
async def offer_view(cb: CallbackQuery, ctx: Ctx) -> None:
    o = ctx.catalog.get(cb.data[2:])
    if not o or not o.active:
        await cb.answer("Эта акция уже закончилась", show_alert=True)
        return
    await ctx.db.event(cb.from_user.id, "offer_view", o.id)
    await cb.message.edit_text(offer_card(o), reply_markup=K.offer(o))
    await cb.answer()


# ---------- 6. ссылка: считаем клик и ставим дожимы ----------
@router.callback_query(F.data.startswith("lnk:"))
async def get_link(cb: CallbackQuery, ctx: Ctx) -> None:
    o = ctx.catalog.get(cb.data[4:])
    if not o or not o.active:
        await cb.answer("Эта акция уже закончилась", show_alert=True)
        return
    await ctx.db.event(cb.from_user.id, "click", o.id)
    if not await ctx.db.has_claim(cb.from_user.id, o.id):
        await ctx.db.schedule(cb.from_user.id, "nudge", o.id, NUDGE_DELAYS)
    await cb.message.answer(T.LINK_MSG.format(bank=o.bank, title=o.title), reply_markup=K.link(o))
    await cb.answer()


# ---------- 7. «Я оформил»: имя → 4 цифры телефона → скриншот ----------
@router.callback_query(F.data.startswith("done:"))
async def claim_start(cb: CallbackQuery, ctx: Ctx, state: FSMContext) -> None:
    o = ctx.catalog.get(cb.data[5:])
    if not o:
        await cb.answer()
        return
    if await ctx.db.has_claim(cb.from_user.id, o.id):
        await cb.answer(T.ALREADY_CLAIMED, show_alert=True)
        return
    await state.set_state(Claim.name)
    await state.update_data(offer=o.id)
    await cb.message.answer(T.CLAIM_NAME)
    await cb.answer()


@router.message(Claim.name, F.text)
async def claim_name(msg: Message, state: FSMContext) -> None:
    await state.update_data(name=msg.text.strip()[:60])
    await state.set_state(Claim.phone4)
    await msg.answer(T.CLAIM_PHONE)


@router.message(Claim.phone4, F.text)
async def claim_phone(msg: Message, state: FSMContext) -> None:
    digits = re.sub(r"\D", "", msg.text)
    if len(digits) != 4:
        await msg.answer(T.CLAIM_PHONE_BAD)
        return
    await state.update_data(phone4=digits)
    await state.set_state(Claim.proof)
    await msg.answer(T.CLAIM_PROOF)


@router.message(Claim.proof, F.photo | F.document)
async def claim_proof(msg: Message, ctx: Ctx, state: FSMContext, bot: Bot) -> None:
    if msg.document and not (msg.document.mime_type or "").startswith("image/"):
        await msg.answer(T.CLAIM_PROOF_BAD)
        return
    proof = msg.photo[-1].file_id if msg.photo else msg.document.file_id
    data = await state.get_data()
    await state.clear()
    o = ctx.catalog.get(data["offer"])
    uid = msg.from_user.id
    cid = await ctx.db.add_claim(uid, o.id, data["name"], data["phone4"], proof)
    await ctx.db.cancel(uid, "nudge", o.id)
    await ctx.db.schedule(uid, "cond", o.id, [CONDITION_DELAY])
    await msg.answer(T.CLAIM_OK.format(condition=o.condition or "по условиям акции"), reply_markup=K.menu())
    caption = (f"🆕 Заявка #{cid}\n{o.bank} — {o.title} (+{o.payout} ₽)\n"
               f"Имя в банке: {data['name']}\nТелефон …{data['phone4']}\n"
               f"Пользователь: {msg.from_user.full_name} @{msg.from_user.username or '—'} (id {uid})\n\n"
               "Одобряй, когда бонус «Приведи друга» за этого человека пришёл тебе.")
    send = bot.send_photo if msg.photo else bot.send_document
    for admin in ctx.cfg.admins:
        try:
            await send(admin, proof, caption=caption, reply_markup=K.claim_admin(cid))
        except Exception:   # админ ещё не нажал /start в боте — заявка всё равно видна в /claims
            pass


@router.message(Claim.proof)
async def claim_proof_bad(msg: Message) -> None:
    await msg.answer(T.CLAIM_PROOF_BAD)


# ---------- 8. баланс и вывод ----------
@router.message(F.text == T.MENU_BALANCE)
async def balance(msg: Message, ctx: Ctx) -> None:
    uid = msg.from_user.id
    lines = []
    for c in await ctx.db.user_claims(uid):
        o = ctx.catalog.get(c["offer_id"])
        name = f"{o.bank} — {o.title}" if o else c["offer_id"]
        amount = f" · +{c['amount']} ₽" if c["status"] == "approved" else ""
        lines.append(f"• {name}: {T.CLAIM_STATUS.get(c['status'], c['status'])}{amount}")
    bal = await ctx.db.balance(uid)
    await msg.answer(T.BALANCE.format(balance=bal, history="\n".join(lines) or T.BALANCE_HISTORY_EMPTY),
                     reply_markup=K.withdraw() if bal > 0 else None)


@router.callback_query(F.data == "wd")
async def withdraw_start(cb: CallbackQuery, ctx: Ctx, state: FSMContext) -> None:
    if await ctx.db.balance(cb.from_user.id) < ctx.cfg.min_payout:
        await cb.answer(T.WITHDRAW_MIN.format(min=ctx.cfg.min_payout), show_alert=True)
        return
    await state.set_state(Withdraw.phone)
    await cb.message.answer(T.WITHDRAW_PHONE)
    await cb.answer()


@router.message(Withdraw.phone, F.text)
async def withdraw_phone(msg: Message, state: FSMContext) -> None:
    digits = re.sub(r"\D", "", msg.text)
    if len(digits) == 11 and digits[0] in "78":
        digits = "7" + digits[1:]
    if len(digits) != 11:
        await msg.answer(T.WITHDRAW_PHONE_BAD)
        return
    await state.update_data(phone="+" + digits)
    await state.set_state(Withdraw.bank)
    await msg.answer(T.WITHDRAW_BANK)


@router.message(Withdraw.bank, F.text)
async def withdraw_bank(msg: Message, ctx: Ctx, state: FSMContext, bot: Bot) -> None:
    data = await state.get_data()
    await state.clear()
    uid = msg.from_user.id
    amount = await ctx.db.balance(uid)
    pid = await ctx.db.request_payout(uid, amount, data["phone"], msg.text.strip()[:40])
    if not pid:
        await msg.answer(T.WITHDRAW_MIN.format(min=ctx.cfg.min_payout), reply_markup=K.menu())
        return
    await msg.answer(T.WITHDRAW_OK.format(amount=amount), reply_markup=K.menu())
    text = (f"💸 Вывод #{pid}: {amount} ₽\nСБП: {data['phone']} · {msg.text.strip()[:40]}\n"
            f"Пользователь: {msg.from_user.full_name} @{msg.from_user.username or '—'} (id {uid})")
    for admin in ctx.cfg.admins:
        try:
            await bot.send_message(admin, text, reply_markup=K.payout_admin(pid))
        except Exception:
            pass


@router.message(F.text == T.MENU_HELP)
async def help_(msg: Message) -> None:
    await msg.answer(T.HELP.format(contact=T.HELP_CONTACT))
