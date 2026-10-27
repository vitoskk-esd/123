"""Служебный аккаунт Telegram (Telethon), который читает каналы. Обычный бот чужие каналы читать не может —
поэтому посты получает отдельный аккаунт: Telegram присылает ему новые посты сразу, без опроса.

Подключается из чата с ботом: админ пишет /connect (см. connect.py). Ключ входа (сессия) хранится в базе,
поэтому после перезапуска в облаке входить заново не нужно.
Вступление в каналы — по одному с паузой JOIN_INTERVAL: массовые вступления Telegram наказывает блокировкой.
Один аккаунт — до 500 каналов (лимит Telegram).
"""
import asyncio
import logging
import time

from aiogram import Bot
from telethon import TelegramClient, errors, events, utils
from telethon.sessions import StringSession
from telethon.tl.functions.channels import JoinChannelRequest
from telethon.tl.functions.messages import CheckChatInviteRequest, ImportChatInviteRequest

import keyboards as K
import texts as T
from ctx import Ctx
from pipeline import RawPost, process

log = logging.getLogger(__name__)
CONNECT_TIMEOUT = 60
FATAL = (errors.InviteHashExpiredError, errors.InviteHashInvalidError, errors.UsernameNotOccupiedError,
         errors.UsernameInvalidError, errors.ChannelPrivateError, errors.ChannelInvalidError,
         errors.ChannelsTooMuchError, ValueError)


async def api_keys(ctx: Ctx) -> tuple[int, str]:
    """Ключи из переменных окружения, а если их нет — те, что админ прислал в /connect."""
    if ctx.cfg.api_id and ctx.cfg.api_hash:
        return ctx.cfg.api_id, ctx.cfg.api_hash
    api_id = await ctx.db.get_setting("api_id")
    return int(api_id or 0), await ctx.db.get_setting("api_hash")


async def new_client(ctx: Ctx, session: str = "") -> TelegramClient:
    api_id, api_hash = await api_keys(ctx)
    c = TelegramClient(StringSession(session), api_id, api_hash, device_model="Perekhvat reader", flood_sleep_threshold=60)
    await asyncio.wait_for(c.connect(), CONNECT_TIMEOUT)
    return c


class Reader:
    def __init__(self, bot: Bot, ctx: Ctx, client=None):
        self.bot, self.ctx, self.client = bot, ctx, client
        self.tasks: set[asyncio.Task] = set()
        self.runner: asyncio.Task | None = None

    @property
    def online(self) -> bool:
        return bool(self.runner and not self.runner.done())

    async def resume(self) -> bool:
        """При запуске бота: если аккаунт уже подключали — входим по сохранённой сессии."""
        session = await self.ctx.db.get_setting("session")
        if not session:
            return False
        try:
            client = await new_client(self.ctx, session)
            if not await client.is_user_authorized():
                await client.disconnect()
                return False
        except Exception as e:
            log.warning("служебный аккаунт не подключился: %s", e)
            return False
        await self.attach(client)
        return True

    async def attach(self, client: TelegramClient) -> None:
        """Начать читать каналы этим (уже вошедшим) клиентом."""
        if self.online:
            self.runner.cancel()
        self.client = client
        await self.ctx.db.set_setting("session", client.session.save())
        client.add_event_handler(self._on_message, events.NewMessage())
        await self.ctx.refresh_channels()
        self.runner = asyncio.create_task(self.run())
        log.info("служебный аккаунт читает каналы: %d", len(self.ctx.channels))

    async def _on_message(self, e: events.NewMessage.Event) -> None:
        m = e.message
        if not m.message or e.chat_id not in self.ctx.channels:   # фото альбома без подписи — пропускаем
            return
        task = asyncio.create_task(self._process(RawPost(e.chat_id, m.id, m.message, m.date.timestamp())))
        self.tasks.add(task)
        task.add_done_callback(self.tasks.discard)

    async def _process(self, raw: RawPost) -> None:
        try:
            await process(self.bot, self.ctx, raw)
        except Exception:
            log.exception("пост %s/%s не обработан", raw.chat_id, raw.msg_id)

    # ---------- вступление в каналы ----------
    async def join_one(self, row) -> None:
        c = self.client
        try:
            if row["invite"]:
                try:
                    entity = (await c(ImportChatInviteRequest(row["invite"]))).chats[0]
                except errors.UserAlreadyParticipantError:
                    entity = (await c(CheckChatInviteRequest(row["invite"]))).chat
            else:
                entity = await c.get_entity(row["username"])
                await c(JoinChannelRequest(entity))
        except errors.FloodWaitError as e:
            log.warning("Telegram просит подождать %s с перед вступлением", e.seconds)
            await asyncio.sleep(e.seconds)
            return
        except errors.InviteRequestSentError:
            return await self._failed(row, "в канал нужно одобрение админа — заявка отправлена")
        except FATAL as e:
            return await self._failed(row, type(e).__name__.replace("Error", ""))
        tg_id = utils.get_peer_id(entity)
        await self.ctx.db.channel_joined(row["id"], tg_id, getattr(entity, "title", "") or "",
                                         getattr(entity, "username", None), "main")
        await self.ctx.refresh_channels()
        ch = await self.ctx.db.channel_by_tg(tg_id)
        title = ch["title"] or row["username"] or "канал"
        waiters = await self.ctx.db.pop_waiters(row["id"]) + (await self.ctx.db.pop_waiters(ch["id"]) if ch["id"] != row["id"] else [])
        for uid in waiters:
            await self._notify(uid, T.CHANNEL_JOINED.format(name=title))
            await self._batch_done(uid, ch["id"], True)

    async def _failed(self, row, error: str) -> None:
        await self.ctx.db.channel_failed(row["id"], error)
        name = row["username"] and f"@{row['username']}" or "закрытый канал"
        for uid in await self.ctx.db.pop_waiters(row["id"]):
            await self._notify(uid, T.CHANNEL_FAILED.format(name=name, error=error))
            await self._batch_done(uid, row["id"], False)

    async def _batch_done(self, uid: int, cid: int, ok: bool) -> None:
        """Когда подключился последний из присланных каналов — одно итоговое сообщение «всё готово, можно искать»."""
        result = await self.ctx.db.batch_done(uid, cid, ok)
        if not result or not result[0]:
            return
        good, bad = result
        total = await self.ctx.db.channel_count_for(uid)
        failed = T.ALL_CHANNELS_FAILED_PART.format(n=bad) if bad else ""
        has_filters = bool(await self.ctx.db.filters(uid))
        text = T.ALL_CHANNELS_READY.format(n=good, total=total, failed=failed,
                                           next=T.ALL_READY_WATCHING if has_filters else T.ALL_READY_NEED_FILTER)
        try:
            await self.bot.send_message(uid, text, reply_markup=None if has_filters else K.new_filter())
        except Exception as e:
            log.info("не смог уведомить %s: %s", uid, e)

    async def _notify(self, uid: int, text: str) -> None:
        try:
            await self.bot.send_message(uid, text)
        except Exception as e:
            log.info("не смог уведомить %s: %s", uid, e)

    async def join_loop(self) -> None:
        while True:
            started, queued = time.time(), []
            try:
                queued = await self.ctx.db.queued_channels()
                if queued:
                    await self.join_one(queued[0])
            except Exception:
                log.exception("ошибка при вступлении в канал")
            await asyncio.sleep(max(5, self.ctx.cfg.join_interval - (time.time() - started)) if queued else 15)

    async def run(self) -> None:
        await asyncio.gather(self.join_loop(), self.client.run_until_disconnected())
