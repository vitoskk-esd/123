"""Поддержка прямо в боте. Человек: «❓ Помощь» → «✉️ Написать в поддержку» → пишет (текст, фото, голосовое).
Сообщение приходит админу (тебе). Чтобы ответить — ответь на него в Telegram свайпом/«Ответить»: бот перешлёт
ответ человеку. Связка «сообщение у админа → человек» хранится в базе, поэтому работает и после перезапуска."""
import html
import logging

from aiogram import Bot, F, Router
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup
from aiogram.types import CallbackQuery, Message

import keyboards as K
import texts as T
from admin import admin_ids
from ctx import Ctx

log = logging.getLogger(__name__)
router = Router(name="support")


class Sup(StatesGroup):
    message = State()


@router.callback_query(F.data == "sup")
async def ask(cb: CallbackQuery, state: FSMContext) -> None:
    await state.set_state(Sup.message)
    await cb.message.answer(T.SUPPORT_ASK, reply_markup=K.support_cancel())
    await cb.answer()


@router.callback_query(F.data == "sup:x")
async def cancel(cb: CallbackQuery, state: FSMContext) -> None:
    await state.clear()
    await cb.message.edit_text(T.SUPPORT_CANCELLED)
    await cb.answer()


@router.message(Sup.message)
async def got_message(msg: Message, bot: Bot, ctx: Ctx, state: FSMContext) -> None:
    from user import MENU                          # нажал кнопку меню вместо сообщения — выходим из поддержки
    if msg.text and (msg.text.startswith("/") or msg.text in MENU):
        await state.clear()
        return await MENU[msg.text](msg, ctx, state) if msg.text in MENU else None
    await state.clear()
    u = msg.from_user
    who = html.escape(u.full_name) + (f" (@{u.username})" if u.username else "") + f", id {u.id}"
    delivered = False
    for admin in await admin_ids(ctx):
        try:
            head = await bot.send_message(admin, T.SUPPORT_TO_ADMIN.format(who=who))
            copy = await bot.copy_message(admin, msg.chat.id, msg.message_id, reply_to_message_id=head.message_id)
            await ctx.db.add_support_link(admin, head.message_id, u.id)
            await ctx.db.add_support_link(admin, copy.message_id, u.id)
            delivered = True
        except Exception as e:
            log.warning("обращение не доставлено админу %s: %s", admin, e)
    await ctx.db.event(u.id, "support")
    await msg.answer(T.SUPPORT_SENT if delivered else T.SUPPORT_FAILED, reply_markup=K.menu())


async def is_support_reply(msg: Message, ctx: Ctx) -> dict | bool:
    """Админ ответил (Reply) на обращение — кому переслать ответ."""
    if not msg.reply_to_message:
        return False
    uid = await ctx.db.support_user(msg.chat.id, msg.reply_to_message.message_id)
    return {"to_user": uid} if uid else False


@router.message(is_support_reply)
async def admin_reply(msg: Message, bot: Bot, ctx: Ctx, to_user: int) -> None:
    try:
        await bot.send_message(to_user, T.SUPPORT_REPLY_HEAD)
        sent = await bot.copy_message(to_user, msg.chat.id, msg.message_id, reply_markup=K.support_more())
    except Exception as e:
        return await msg.reply(T.SUPPORT_REPLY_FAILED.format(error=e))
    await ctx.db.add_support_link(msg.chat.id, msg.message_id, to_user)   # можно ответить ещё раз на свой же ответ
    log.info("ответ поддержки %s → %s (сообщение %s)", msg.chat.id, to_user, sent.message_id)
    await msg.reply(T.SUPPORT_REPLY_SENT)
