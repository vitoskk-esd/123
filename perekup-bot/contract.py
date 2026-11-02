"""📝 Договор купли-продажи (PRO и пробный день): данные одним сообщением → проверка → Word + PDF."""
import asyncio
import html
import logging

from aiogram import Bot, F, Router
from aiogram.filters import Command, StateFilter
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup
from aiogram.types import BufferedInputFile, CallbackQuery, Message

import dkp
import keyboards as K
import plans
import texts as T
from ctx import Ctx

log = logging.getLogger(__name__)
router = Router()
MENU_TEXTS = {T.MENU_FILTERS, T.OLD_MENU_FILTERS, T.MENU_CHANNELS, T.MENU_STATS, T.MENU_SUB, T.MENU_HELP, T.MENU_IDEA, T.MENU_DKP, T.MENU_ADMIN}


class D(StatesGroup):
    data = State()


async def allowed(ctx: Ctx, uid: int) -> bool:
    plan = plans.current(ctx.cfg, await ctx.db.user(uid))
    return bool(plan and plan.dkp)


async def ask(msg: Message, ctx: Ctx, state: FSMContext, uid: int | None = None) -> None:
    uid = uid or msg.from_user.id
    if not await allowed(ctx, uid):
        return await msg.answer(T.DKP_LOCKED, reply_markup=K.plans(plans.plans(ctx.cfg), False, only="pro"))
    await state.set_state(D.data)
    await state.set_data({"dkp": {}})
    await msg.answer(T.DKP_ASK.format(template=html.escape(dkp.template())), reply_markup=K.dkp_start())


@router.message(Command("dkp"))
async def dkp_cmd(msg: Message, ctx: Ctx, state: FSMContext) -> None:
    await ask(msg, ctx, state)


@router.message(StateFilter(D.data), F.text, ~F.text.in_(MENU_TEXTS), ~F.text.startswith("/"))
async def got_data(msg: Message, ctx: Ctx, state: FSMContext) -> None:
    found = await dkp.extract(ctx.cfg, msg.text)
    data = {**(await state.get_data()).get("dkp", {}), **found}
    await state.update_data(dkp=data)
    if not found:
        return await msg.answer(T.DKP_NOTHING, reply_markup=K.dkp_check())
    lines, missing = dkp.summary(data)
    tail = T.DKP_MISSING.format(fields=", ".join(missing)) if missing else T.DKP_ALL
    await msg.answer(T.DKP_CHECK.format(lines=lines, tail=tail), reply_markup=K.dkp_check())


async def send_docs(bot: Bot, chat_id: int, data: dict) -> None:
    docx, pdf = await asyncio.gather(asyncio.to_thread(dkp.docx_bytes, data), asyncio.to_thread(dkp.pdf_bytes, data))
    await bot.send_document(chat_id, BufferedInputFile(docx, dkp.filename(data, "docx")), caption=T.DKP_DOCX)
    await bot.send_document(chat_id, BufferedInputFile(pdf, dkp.filename(data, "pdf")), caption=T.DKP_DONE)


@router.callback_query(F.data.in_({"dkp:make", "dkp:blank", "dkp:reset"}))
async def dkp_btn(cb: CallbackQuery, bot: Bot, ctx: Ctx, state: FSMContext) -> None:
    if not await allowed(ctx, cb.from_user.id):
        await cb.answer()
        return await cb.message.answer(T.DKP_LOCKED, reply_markup=K.plans(plans.plans(ctx.cfg), False, only="pro"))
    if cb.data == "dkp:reset":
        await cb.answer()
        return await ask(cb.message, ctx, state, cb.from_user.id)
    await cb.answer("Собираю договор…")
    data = {} if cb.data == "dkp:blank" else (await state.get_data()).get("dkp", {})
    try:
        await send_docs(bot, cb.from_user.id, data)
    except Exception:
        log.exception("договор не собран")
        return await cb.message.answer(T.DKP_FAIL)
    await state.clear()                          # паспортные данные дальше не храним
    await ctx.db.event(cb.from_user.id, "dkp", "blank" if cb.data == "dkp:blank" else "filled")
