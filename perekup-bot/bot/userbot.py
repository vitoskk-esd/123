"""Служебные аккаунты Telegram (Telethon), которые читают каналы. Обычный бот чужие каналы читать не может —
поэтому посты получает отдельный аккаунт: Telegram присылает ему новые посты сразу, без опроса.

• Один аккаунт — до 500 каналов (лимит Telegram). Больше каналов — добавь аккаунт в TG_SESSIONS:
  новые каналы сами распределятся на наименее загруженный.
• Вступление в каналы — по одному с паузой JOIN_INTERVAL: массовые вступления Telegram наказывает блокировкой.
• Каждый канал читает ровно один аккаунт — иначе пост пришёл бы дважды.

Вход в аккаунт (один раз, на сервере): python -m bot login main
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
SESSIONS = ROOT / "sessions"
ACCOUNT_LIMIT = 480        # с запасом до 500
FATAL = (errors.InviteHashExpiredError, errors.InviteHashInvalidError, errors.UsernameNotOccupiedError,
         errors.UsernameInvalidError, errors.ChannelPrivateError, errors.ChannelInvalidError, ValueError)


def client_for(name: str, ctx: Ctx) -> TelegramClient:
    SESSIONS.mkdir(exist_ok=True)
    return TelegramClient(str(SESSIONS / name), ctx.cfg.api_id, ctx.cfg.api_hash,
                          device_model="Perekhvat reader", flood_sleep_threshold=60)


class Reader:
    def __init__(self, bot: Bot, ctx: Ctx):
        self.bot, self.ctx = bot, ctx
        self.clients: dict[str, TelegramClient] = {}
        self.buffer: dict[str, object] = {}
        self.tasks: set[asyncio.Task] = set()

    # ---------- запуск ----------
    async def start(self) -> None:
        for name in self.ctx.cfg.sessions:
            c = client_for(name, self.ctx)
            await c.connect()
            if not await c.is_user_authorized():
                raise SystemExit(f"Аккаунт «{name}» не авторизован. Запусти: python -m bot login {name}")
            self.clients[name] = c
            await self._sync(name, c)
            if self.ctx.cfg.buffer_channel:
                try:
                    self.buffer[name] = await c.get_entity(self.ctx.cfg.buffer_channel)
                except Exception as e:
                    log.warning("аккаунт %s не видит буферный канал %s (%s) — посты придут без фото",
                                name, self.ctx.cfg.buffer_channel, e)
            c.add_event_handler(self._on_message(name), events.NewMessage())
            c.add_event_handler(self._on_album(name), events.Album())
        await self.ctx.refresh_channels()
        log.info("служебных аккаунтов: %d, каналов: %d", len(self.clients), len(self.ctx.channels))

    async def _sync(self, name: str, c: TelegramClient) -> None:
        """Каналы, где аккаунт уже состоит, — помечаем подключёнными (например, после ручного вступления)."""
        queued = {(r["username"] or "").lower(): r for r in await self.ctx.db.queued_channels() if r["username"]}
        async for d in c.iter_dialogs():
            if not (d.is_channel or d.is_group):
                continue
            uname = (getattr(d.entity, "username", None) or "").lower()
            row = queued.get(uname) if uname else None
            if row:
                await self.ctx.db.channel_joined(row["id"], d.id, d.name, uname or None, name)

    # ---------- приём постов ----------
    def _mine(self, name: str, chat_id: int) -> bool:
        ch = self.ctx.channels.get(chat_id)
        return bool(ch) and (ch["account"] or name) == name

    def _forwarder(self, name: str, event, ids: list[int]):
        async def forward() -> list[int]:
            target = self.buffer.get(name)
            if target is None:
                return []
            chat = await event.get_input_chat()      # лениво: нужен, только если пост кому-то подошёл
            msgs = await self.clients[name].forward_messages(target, ids, from_peer=chat)
            msgs = msgs if isinstance(msgs, list) else [msgs]
            return [m.id for m in msgs if m]
        return forward

    def _spawn(self, coro) -> None:
        t = asyncio.create_task(coro)
        self.tasks.add(t)
        t.add_done_callback(self.tasks.discard)

    def _on_message(self, name: str):
        async def handler(e: events.NewMessage.Event) -> None:
            m = e.message
            if m.grouped_id or not self._mine(name, e.chat_id):   # альбом придёт целиком в _on_album
                return
            raw = RawPost(e.chat_id, [m.id], m.message or "", m.date.timestamp(), bool(m.media),
                          self._forwarder(name, e, [m.id]))
            self._spawn(self._process(raw))
        return handler

    def _on_album(self, name: str):
        async def handler(e: events.Album.Event) -> None:
            if not self._mine(name, e.chat_id):
                return
            ids = [m.id for m in e.messages]
            text = next((m.message for m in e.messages if m.message), "")
            raw = RawPost(e.chat_id, ids, text, e.messages[0].date.timestamp(), True,
                          self._forwarder(name, e, ids))
            self._spawn(self._process(raw))
        return handler

    async def _process(self, raw: RawPost) -> None:
        try:
            await process(self.bot, self.ctx, raw)
        except Exception:
            log.exception("пост %s/%s не обработан", raw.chat_id, raw.msg_ids)

    # ---------- вступление в каналы ----------
    async def _pick_account(self) -> str | None:
        load = await self.ctx.db.account_load()
        free = [(load.get(n, 0), n) for n in self.clients if load.get(n, 0) < ACCOUNT_LIMIT]
        return min(free)[1] if free else None

    async def join_one(self, row) -> None:
        name = await self._pick_account()
        if not name:
            log.warning("все служебные аккаунты заполнены — добавь новый в TG_SESSIONS")
            return
        c = self.clients[name]
        try:
            if row["invite"]:
                try:
                    upd = await c(ImportChatInviteRequest(row["invite"]))
                    entity = upd.chats[0]
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
        except errors.ChannelsTooMuchError:
            return await self._failed(row, "у служебного аккаунта лимит каналов")
        except FATAL as e:
            return await self._failed(row, type(e).__name__.replace("Error", ""))
        tg_id = utils.get_peer_id(entity)
        await self.ctx.db.channel_joined(row["id"], tg_id, getattr(entity, "title", "") or "",
                                         getattr(entity, "username", None), name)
        await self.ctx.refresh_channels()
        ch = await self.ctx.db.channel_by_tg(tg_id)
        title = ch["title"] or row["username"] or "канал"
        for uid in await self.ctx.db.pop_waiters(row["id"]) + (await self.ctx.db.pop_waiters(ch["id"]) if ch["id"] != row["id"] else []):
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
        await asyncio.gather(self.join_loop(), *(c.run_until_disconnected() for c in self.clients.values()))


async def login(name: str, ctx: Ctx) -> None:
    """Интерактивный вход: телефон → код из Telegram → (пароль 2FA). Создаёт sessions/<name>.session."""
    c = client_for(name, ctx)
    await c.start()
    me = await c.get_me()
    print(f"Готово: аккаунт «{name}» — {me.first_name} (@{me.username}). Файл: sessions/{name}.session")
    await c.disconnect()
