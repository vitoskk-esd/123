"""Служебный аккаунт Telegram (Telethon), который читает каналы. Обычный бот чужие каналы читать не может —
поэтому посты получает отдельный аккаунт: Telegram присылает ему новые посты сразу, без опроса.

Вступление в каналы — по одному с паузой JOIN_INTERVAL: массовые вступления Telegram наказывает блокировкой.
Один аккаунт — до 500 каналов (лимит Telegram).
Вход в аккаунт (один раз): python -m bot login — его сам делает файл «Запуск».
"""
import asyncio
import logging
import time

from aiogram import Bot
from telethon import TelegramClient, errors, events, utils
from telethon.tl.functions.channels import JoinChannelRequest
from telethon.tl.functions.messages import CheckChatInviteRequest, ImportChatInviteRequest

from . import texts as T
from .config import ROOT
from .ctx import Ctx
from .pipeline import RawPost, process

log = logging.getLogger(__name__)
SESSION = ROOT / "sessions" / "main"
CONNECT_TIMEOUT = 60
FATAL = (errors.InviteHashExpiredError, errors.InviteHashInvalidError, errors.UsernameNotOccupiedError,
         errors.UsernameInvalidError, errors.ChannelPrivateError, errors.ChannelInvalidError,
         errors.ChannelsTooMuchError, ValueError)


def make_client(ctx: Ctx) -> TelegramClient:
    SESSION.parent.mkdir(exist_ok=True)
    return TelegramClient(str(SESSION), ctx.cfg.api_id, ctx.cfg.api_hash, device_model="Perekhvat reader",
                          flood_sleep_threshold=60)


async def connect(client: TelegramClient) -> None:
    log.info("подключаюсь к Telegram…")
    try:
        await asyncio.wait_for(client.connect(), CONNECT_TIMEOUT)
    except (OSError, asyncio.TimeoutError) as e:
        raise SystemExit(f"Не получилось подключиться к Telegram ({str(e) or 'нет ответа'}). Проверь интернет; если Telegram "
                         "у тебя работает только через VPN — включи VPN на весь компьютер.")


class Reader:
    def __init__(self, bot: Bot, ctx: Ctx, client=None):
        self.bot, self.ctx, self.client = bot, ctx, client
        self.tasks: set[asyncio.Task] = set()

    async def start(self) -> None:
        self.client = make_client(self.ctx)
        await connect(self.client)
        if not await self.client.is_user_authorized():
            await self.client.disconnect()
            raise SystemExit("Служебный аккаунт не подключён. Удали папку sessions и запусти файл «Запуск» снова.")
        self.client.add_event_handler(self._on_message, events.NewMessage())
        await self.ctx.refresh_channels()
        log.info("каналов подключено: %d", len(self.ctx.channels))

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

    async def _failed(self, row, error: str) -> None:
        await self.ctx.db.channel_failed(row["id"], error)
        name = row["username"] and f"@{row['username']}" or "закрытый канал"
        for uid in await self.ctx.db.pop_waiters(row["id"]):
            await self._notify(uid, T.CHANNEL_FAILED.format(name=name, error=error))

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


async def login(ctx: Ctx) -> None:
    """Вход: телефон → код из Telegram → (пароль 2FA). Создаёт sessions/main.session."""
    c = make_client(ctx)
    await connect(c)
    await c.start()
    me = await c.get_me()
    print(f"Готово: служебный аккаунт — {me.first_name} (@{me.username}).")
    await c.disconnect()
