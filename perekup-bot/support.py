"""Поддержка прямо в боте. Человек: «❓ Помощь» → «✉️ Написать в поддержку» → пишет (текст, фото, голосовое).
Сообщение приходит админу (тебе). Чтобы ответить — ответь на него в Telegram свайпом/«Ответить»: бот перешлёт
ответ человеку. Связка «сообщение у админа → человек» хранится в базе, поэтому работает и после перезапуска."""
import html
import logging

from aiogram import Bot, F, Router
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup
from aiogram.filters import Command, CommandObject
from aiogram.types import CallbackQuery, Message
import re

import keyboards as K
import texts as T
from admin import admin_ids, is_admin
from ctx import Ctx

log = logging.getLogger(__name__)
router = Router(name="support")


async def support_username(ctx: Ctx) -> str:
    """Кому писать в поддержку: /support в боте → SUPPORT_USERNAME в переменных → служебный аккаунт (его @ бот узнаёт сам). Пусто — поддержка внутри бота."""
    name = await ctx.db.get_setting("support_username")
    if name == "-":                      # /support off — вернуть переписку через бота
        return ""
    return name or ctx.cfg.support_username or await ctx.db.get_setting("reader_username") or ""


async def support_url(ctx: Ctx) -> str | None:
    name = await support_username(ctx)
    return f"https://t.me/{name}" if name else None


class Sup(StatesGroup):
    message = State()
    idea = State()


async def ask_idea(msg: Message, ctx: Ctx, state: FSMContext, uid: int | None = None) -> None:
    """«💡 Предложить идею»: просим одним сообщением; оно уйдёт админу, ответить можно свайпом — как в поддержке."""
    await state.set_state(Sup.idea)
    await msg.answer(T.IDEA_ASK, reply_markup=K.support_cancel())


@router.message(Command("support"))
async def set_support(msg: Message, ctx: Ctx, command: CommandObject) -> None:
    """Админ: /support @аккаунт — кнопка поддержки ведёт в личку этого аккаунта; /support off — переписка через бота; без слов — что сейчас."""
    if not await is_admin(msg, ctx):
        return
    arg = (command.args or "").strip()
    if not arg:
        name = await support_username(ctx)
        return await msg.answer(T.SUPPORT_NOW.format(now=f"личный чат с @{name}" if name else "переписку через бота"))
    if arg.lower() in ("off", "выкл", "бот", "-"):
        await ctx.db.set_setting("support_username", "-")
        return await msg.answer(T.SUPPORT_OFF)
    name = re.sub(r"^(https?://)?(t\.me/|telegram\.me/)?@?", "", arg).split("?")[0].strip("/")
    if not re.fullmatch(r"[A-Za-z][A-Za-z0-9_]{3,31}", name):
        return await msg.answer(T.SUPPORT_BAD)
    await ctx.db.set_setting("support_username", name)
    await msg.answer(T.SUPPORT_SET.format(name=name))


@router.callback_query(F.data == "sup")
async def ask(cb: CallbackQuery, state: FSMContext, ctx: Ctx) -> None:
    if url := await support_url(ctx):     # старые кнопки в чатах: тоже отправляем в личку аккаунта поддержки
        await cb.message.answer(T.SUPPORT_LINK, reply_markup=K.support_link(url))
        return await cb.answer()
    await state.set_state(Sup.message)
    await cb.message.answer(T.SUPPORT_ASK, reply_markup=K.support_cancel())
    await cb.answer()


@router.callback_query(F.data == "sup:x")
async def cancel(cb: CallbackQuery, state: FSMContext) -> None:
    await state.clear()
    await cb.message.edit_text(T.SUPPORT_CANCELLED)
    await cb.answer()


@router.message(Sup.message)
@router.message(Sup.idea)
async def got_message(msg: Message, bot: Bot, ctx: Ctx, state: FSMContext) -> None:
    from user import MENU                          # нажал кнопку меню вместо сообщения — выходим из поддержки
    if msg.text and (msg.text.startswith("/") or msg.text in MENU):
        await state.clear()
        return await MENU[msg.text](msg, ctx, state) if msg.text in MENU else None
    idea = await state.get_state() == Sup.idea.state
    await state.clear()
    u = msg.from_user
    who = html.escape(u.full_name) + (f" (@{u.username})" if u.username else "") + f", id {u.id}"
    delivered = False
    for admin in await admin_ids(ctx):
        try:
            head = await bot.send_message(admin, (T.IDEA_TO_ADMIN if idea else T.SUPPORT_TO_ADMIN).format(who=who))
            copy = await bot.copy_message(admin, msg.chat.id, msg.message_id, reply_to_message_id=head.message_id)
            await ctx.db.add_support_link(admin, head.message_id, u.id)
            await ctx.db.add_support_link(admin, copy.message_id, u.id)
            delivered = True
        except Exception as e:
            log.warning("обращение не доставлено админу %s: %s", admin, e)
    await ctx.db.event(u.id, "idea" if idea else "support", (msg.text or msg.caption or "")[:500] or None)
    await msg.answer((T.IDEA_THANKS if idea else T.SUPPORT_SENT) if delivered else T.SUPPORT_FAILED, reply_markup=K.menu())


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
