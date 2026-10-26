"""Подключение служебного аккаунта прямо в чате с ботом (только админ): /connect →
api_id → api_hash (если их нет в переменных) → телефон → код из Telegram → пароль, если включён.

Код просим писать с пробелами: Telegram сбрасывает код входа, если увидит его целиком в чьём-то сообщении.
Сообщения с кодом и паролем бот сразу удаляет из чата.
"""
import asyncio
import logging
import re

from aiogram import F, Router
from aiogram.filters import Command
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup
from aiogram.types import Message
from telethon import TelegramClient, errors

import texts as T
from admin import is_admin
from ctx import Ctx
from userbot import api_keys, new_client

log = logging.getLogger(__name__)
router = Router(name="connect")
pending: dict[int, tuple[TelegramClient, str, str]] = {}   # админ → (клиент, телефон, phone_code_hash)


class C(StatesGroup):
    api_id = State()
    api_hash = State()
    phone = State()
    code = State()
    password = State()


async def _hide(msg: Message) -> None:
    try:
        await msg.delete()
    except Exception:
        pass


@router.message(Command("connect"))
async def connect(msg: Message, ctx: Ctx, state: FSMContext) -> None:
    if not await is_admin(msg, ctx):
        return
    api_id, api_hash = await api_keys(ctx)
    if api_id and api_hash:
        await state.set_state(C.phone)
        await msg.answer(T.CONNECT_PHONE)
    else:
        await state.set_state(C.api_id)
        await msg.answer(T.CONNECT_API_ID)


@router.message(C.api_id, F.text)
async def got_api_id(msg: Message, ctx: Ctx, state: FSMContext) -> None:
    if not msg.text.strip().isdigit():
        return await msg.answer(T.CONNECT_API_ID_BAD)
    await ctx.db.set_setting("api_id", msg.text.strip())
    await state.set_state(C.api_hash)
    await msg.answer(T.CONNECT_API_HASH)


@router.message(C.api_hash, F.text)
async def got_api_hash(msg: Message, ctx: Ctx, state: FSMContext) -> None:
    value = msg.text.strip()
    if not re.fullmatch(r"[0-9a-f]{32}", value):
        return await msg.answer(T.CONNECT_API_HASH_BAD)
    await ctx.db.set_setting("api_hash", value)
    await _hide(msg)
    await state.set_state(C.phone)
    await msg.answer(T.CONNECT_PHONE)


@router.message(C.phone, F.text)
async def got_phone(msg: Message, ctx: Ctx, state: FSMContext) -> None:
    phone = re.sub(r"[^\d+]", "", msg.text)
    if phone.startswith("8") and len(phone) == 11:
        phone = "+7" + phone[1:]
    if not re.fullmatch(r"\+?\d{10,15}", phone):
        return await msg.answer(T.CONNECT_PHONE_BAD)
    try:
        client = await new_client(ctx)
        sent = await client.send_code_request(phone)
    except (errors.ApiIdInvalidError, ValueError):
        await ctx.db.set_setting("api_id", "")
        await state.set_state(C.api_id)
        return await msg.answer(T.CONNECT_KEYS_BAD)
    except errors.FloodWaitError as e:
        await state.clear()
        return await msg.answer(T.CONNECT_FLOOD.format(minutes=e.seconds // 60 + 1))
    except (OSError, asyncio.TimeoutError, errors.RPCError) as e:
        await state.clear()
        return await msg.answer(T.CONNECT_ERROR.format(error=e))
    pending[msg.from_user.id] = (client, phone, sent.phone_code_hash)
    await state.set_state(C.code)
    await msg.answer(T.CONNECT_CODE)


async def _done(msg: Message, ctx: Ctx, state: FSMContext, client: TelegramClient) -> None:
    pending.pop(msg.from_user.id, None)
    await state.clear()
    await ctx.reader.attach(client)
    me = await client.get_me()
    await msg.answer(T.CONNECT_DONE.format(name=me.first_name or me.username or "аккаунт"))


@router.message(C.code, F.text)
async def got_code(msg: Message, ctx: Ctx, state: FSMContext) -> None:
    await _hide(msg)
    code = re.sub(r"\D", "", msg.text)
    if msg.from_user.id not in pending:
        await state.clear()
        return await msg.answer(T.CONNECT_AGAIN)
    client, phone, code_hash = pending[msg.from_user.id]
    try:
        await client.sign_in(phone, code, phone_code_hash=code_hash)
    except errors.SessionPasswordNeededError:
        await state.set_state(C.password)
        return await msg.answer(T.CONNECT_PASSWORD)
    except (errors.PhoneCodeInvalidError, errors.PhoneCodeEmptyError):
        return await msg.answer(T.CONNECT_CODE_BAD)
    except errors.PhoneCodeExpiredError:
        pending.pop(msg.from_user.id, None)
        await state.clear()
        return await msg.answer(T.CONNECT_CODE_EXPIRED)
    await _done(msg, ctx, state, client)


@router.message(C.password, F.text)
async def got_password(msg: Message, ctx: Ctx, state: FSMContext) -> None:
    await _hide(msg)
    if msg.from_user.id not in pending:
        await state.clear()
        return await msg.answer(T.CONNECT_AGAIN)
    client = pending[msg.from_user.id][0]
    try:
        await client.sign_in(password=msg.text)
    except errors.PasswordHashInvalidError:
        return await msg.answer(T.CONNECT_PASSWORD_BAD)
    await _done(msg, ctx, state, client)
