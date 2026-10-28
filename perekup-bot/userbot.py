"""Служебный аккаунт Telegram (Telethon), который читает каналы. Обычный бот чужие каналы читать не может —
поэтому посты получает отдельный аккаунт: Telegram присылает ему новые посты сразу, без опроса.

Подключается из чата с ботом: админ пишет /connect (см. connect.py). Ключ входа (сессия) хранится в базе,
поэтому после перезапуска в облаке входить заново не нужно.
Посты приходят двумя путями, что раньше — то и уходит (второй раз тот же пост не обрабатывается):
• Telegram сам присылает новые посты — но у больших каналов с опозданием до минуты;
• бот сам опрашивает каналы по кругу (POLL_RPS каналов в секунду) — каждый канал раз в несколько секунд.
Вступление в каналы — по одному с паузой JOIN_INTERVAL: массовые вступления Telegram наказывает блокировкой.
Один аккаунт — до 500 каналов (лимит Telegram).
"""
import asyncio
import logging
import re
import time
from datetime import datetime, timedelta, timezone
from collections import deque

from aiogram import Bot
from telethon import TelegramClient, errors, events, utils
from telethon.sessions import StringSession
from telethon.tl.functions.account import UpdateNotifySettingsRequest, UpdateStatusRequest
from telethon.tl.functions.channels import (CreateChannelRequest, EditAdminRequest, GetChannelRecommendationsRequest,
                                            JoinChannelRequest)
from telethon.tl.types import ChatAdminRights, InputNotifyPeer, InputPeerChannel, InputPeerNotifySettings
from telethon.tl.functions.messages import CheckChatInviteRequest, ImportChatInviteRequest

import keyboards as K
import texts as T
from ctx import Ctx
from pipeline import RawPost, process

log = logging.getLogger(__name__)
CONNECT_TIMEOUT = 60
APPROVAL_CHECK = 300           # раз в 5 минут смотрим, одобрил ли админ заявку в канал
APPROVAL_WAIT = 7 * 86400      # неделю без одобрения — сдаёмся
CAR_TITLE = re.compile(r"авто|машин|перекуп|рынок|рынк|тачк|выкуп|car|auto|avto|продаж|ниже\s+рынка|по\s+низу", re.I)
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
        self.buffer = None                                     # InputPeerChannel канала с фото
        self.done: set[tuple[int, int]] = set()                # (канал, пост), уже взятые в работу
        self.done_order: deque = deque()
        self.peers: dict[int, object] = {}                     # канал → InputPeer для опроса
        self.last: dict[int, int] = {}                         # канал → id последнего поста, который видели

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
        client.add_event_handler(self._on_edit, events.MessageEdited())
        await self.ensure_buffer()
        await self.ctx.refresh_channels()
        try:
            await client.get_dialogs()          # кэш каналов — чтобы опрашивать их без лишних запросов
        except Exception as e:
            log.warning("не загрузил список каналов: %s", e)
        self.runner = asyncio.create_task(self.run())
        log.info("служебный аккаунт читает каналы: %d", len(self.ctx.channels))

    async def ensure_buffer(self) -> None:
        """Закрытый канал для фото машин: служебный аккаунт создаёт его сам (один раз) и делает бота админом.
        Не получилось — бот работает, просто без фото."""
        self.buffer = None
        cid, access = await self.ctx.db.get_setting("buffer_id"), await self.ctx.db.get_setting("buffer_hash")
        if not cid:
            try:
                ch = (await self.client(CreateChannelRequest(
                    title="Перехват — фото машин", about="Служебный канал бота: сюда пересылаются фото машин. Не удаляй.",
                    broadcast=True))).chats[0]
                me = await self.bot.me()
                await self.client(EditAdminRequest(ch, me.username, ChatAdminRights(post_messages=True, edit_messages=True,
                                                                                     delete_messages=True), rank="bot"))
            except Exception as e:
                log.warning("канал для фото не создан (%s) — посты будут без фото", e)
                return
            cid, access = str(ch.id), str(ch.access_hash)
            await self.ctx.db.set_setting("buffer_id", cid)
            await self.ctx.db.set_setting("buffer_hash", access)
        self.buffer = InputPeerChannel(int(cid), int(access))
        self.ctx.buffer_chat = int(f"-100{cid}")

    def _photo(self, peer_of, msg_id: int):
        async def forward() -> int | None:
            if self.buffer is None:
                return None
            sent = await self.client.forward_messages(self.buffer, msg_id, from_peer=await peer_of())
            sent = sent[0] if isinstance(sent, list) else sent
            return sent.id if sent else None
        return forward

    def _take(self, chat_id: int, m, peer_of) -> None:
        """Взять пост в работу — один раз, каким бы путём он ни пришёл первым."""
        key = (chat_id, m.id)
        if key in self.done:
            return
        self.done.add(key)
        self.done_order.append(key)
        if len(self.done_order) > 20000:
            self.done.discard(self.done_order.popleft())
        self.last[chat_id] = max(self.last.get(chat_id, 0), m.id)
        if not m.message:                                       # фото альбома без подписи — пропускаем
            return
        photo = self._photo(peer_of, m.id) if m.photo else None
        raw = RawPost(chat_id, m.id, m.message, m.date.timestamp(), photo, recv=time.time())
        task = asyncio.create_task(self._process(raw))
        self.tasks.add(task)
        task.add_done_callback(self.tasks.discard)

    async def _on_message(self, e: events.NewMessage.Event) -> None:
        if e.chat_id in self.ctx.channels:
            self._take(e.chat_id, e.message, e.get_input_chat)

    async def _peer(self, chat_id: int):
        if chat_id not in self.peers:
            self.peers[chat_id] = await self.client.get_input_entity(chat_id)
        return self.peers[chat_id]

    async def poll_once(self, chat_id: int) -> None:
        """Новые посты канала, которых ещё не видели. Первый опрос только запоминает, где мы, — старое не шлём."""
        peer = await self._peer(chat_id)
        if chat_id not in self.last:
            msgs = await self.client.get_messages(peer, limit=1)
            self.last[chat_id] = msgs[0].id if msgs else 0
            return
        msgs = await self.client.get_messages(peer, limit=10, min_id=self.last[chat_id])
        for m in sorted(msgs, key=lambda x: x.id):
            self._take(chat_id, m, lambda p=peer: _same(p))

    async def poll_loop(self) -> None:
        """Сами опрашиваем каналы по кругу, не дожидаясь, пока Telegram пришлёт пост."""
        online_at = 0.0
        while True:
            chans = list(self.ctx.channels)
            if not chans or self.ctx.cfg.poll_rps <= 0:
                await asyncio.sleep(5)
                continue
            for chat_id in chans:
                started = time.time()
                if started - online_at > 60:       # «в сети» — Telegram охотнее присылает обновления
                    online_at = started
                    try:
                        await self.client(UpdateStatusRequest(offline=False))
                    except Exception:
                        pass
                try:
                    if chat_id in self.ctx.channels:
                        await self.poll_once(chat_id)
                except errors.FloodWaitError as e:
                    log.warning("опрос каналов: Telegram просит подождать %s с", e.seconds)
                    await asyncio.sleep(e.seconds)
                except Exception as e:
                    log.info("опрос канала %s: %s", chat_id, e)
                await asyncio.sleep(max(0.0, 1 / self.ctx.cfg.poll_rps - (time.time() - started)))

    async def _on_edit(self, e: events.MessageEdited.Event) -> None:
        """Анонс «скоро в продаже» отредактировали в «в продаже» — теперь это продажа, присылаем."""
        m = e.message
        if not m.message or e.chat_id not in self.ctx.channels or not await self.ctx.db.is_teaser(e.chat_id, m.id):
            return
        photo = self._photo(e.get_input_chat, m.id) if m.photo else None
        task = asyncio.create_task(self._process(RawPost(e.chat_id, m.id, m.message, time.time(), photo, recv=time.time())))
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
            return await self._awaiting(row)
        except FATAL as e:
            return await self._failed(row, type(e).__name__.replace("Error", ""))
        tg_id = utils.get_peer_id(entity)
        await self.ctx.db.channel_joined(row["id"], tg_id, getattr(entity, "title", "") or "",
                                         getattr(entity, "username", None), "main")
        await self.ctx.refresh_channels()
        ch = await self.ctx.db.channel_by_tg(tg_id)
        await self.mute(ch, entity)
        title = ch["title"] or row["username"] or "канал"
        waiters = await self.ctx.db.pop_waiters(row["id"]) + (await self.ctx.db.pop_waiters(ch["id"]) if ch["id"] != row["id"] else [])
        for uid in waiters:
            await self._notify(uid, T.CHANNEL_JOINED.format(name=title))
            await self._batch_done(uid, ch["id"], 1)

    async def _awaiting(self, row) -> None:
        """Канал с одобрением заявок: ждём админа, а не пишем «не получилось». Одобрит — check_approvals подключит."""
        title = None
        if row["invite"]:
            try:
                title = getattr(await self.client(CheckChatInviteRequest(row["invite"])), "title", None)
            except Exception:
                pass
        name = title or (row["username"] and f"@{row['username']}") or "закрытый канал"
        for uid in await self.ctx.db.channel_awaiting(row["id"], title):
            await self._notify(uid, T.CHANNEL_AWAITING.format(name=name))
            await self._batch_done(uid, row["id"], 2)

    async def mute(self, ch, entity=None) -> None:
        """Каналы читает бот, а не человек: у служебного аккаунта уведомления из них выключаем навсегда."""
        try:
            peer = entity if entity is not None else await self._peer(ch["tg_id"])
            await self.client(UpdateNotifySettingsRequest(peer=InputNotifyPeer(peer),
                                                          settings=InputPeerNotifySettings(mute_until=2 ** 31 - 1)))
            await self.ctx.db.set_muted(ch["id"])
        except errors.FloodWaitError as e:
            await asyncio.sleep(e.seconds)
        except Exception as e:
            log.info("не выключил уведомления в %s: %s", ch["title"], e)

    async def mute_all(self) -> None:
        """Каналы, в которые вступили раньше, — тоже без уведомлений (по одному в 2 секунды, чтобы не злить Telegram)."""
        for ch in await self.ctx.db.unmuted_channels():
            await self.mute(ch)
            await asyncio.sleep(2)

    async def similar(self, known: set[str], limit: int = 60) -> list[dict]:
        """Похожие каналы от Telegram для каждого канала базы → автомобильные, которых ещё нет в базе, с активностью:
        сколько постов за неделю и в сколько из 5 последних будних дней были посты."""
        found: dict[str, dict] = {}
        for ch in [c for c in self.ctx.channels.values() if c["base"]]:
            try:
                res = await self.client(GetChannelRecommendationsRequest(channel=await self._peer(ch["tg_id"])))
            except errors.FloodWaitError as e:
                await asyncio.sleep(e.seconds)
                continue
            except Exception as e:
                log.info("похожие для %s: %s", ch["title"], e)
                continue
            for c in getattr(res, "chats", []):
                name = (getattr(c, "username", None) or "").lower()
                if not name or name in known or not CAR_TITLE.search(c.title or ""):
                    continue
                f = found.setdefault(name, {"username": c.username, "title": c.title, "subs": c.participants_count or 0, "hits": 0})
                f["hits"] += 1                                 # у скольких каналов базы он в «похожих»
            await asyncio.sleep(1)
        top = sorted(found.values(), key=lambda f: (-f["hits"], -f["subs"]))[:limit]
        now = datetime.now(timezone(timedelta(hours=3)))
        weekdays = [d for d in ((now - timedelta(days=i)).date() for i in range(1, 9)) if d.weekday() < 5][:5]
        for f in top:
            try:
                msgs = await self.client.get_messages(f["username"], limit=60)
                dates = [m.date.astimezone(now.tzinfo) for m in msgs if m.date]
                f["week"] = sum(d >= now - timedelta(days=7) for d in dates)
                f["weekdays"] = len({d.date() for d in dates} & set(weekdays))
            except errors.FloodWaitError as e:
                await asyncio.sleep(e.seconds)
            except Exception as e:
                log.info("активность %s: %s", f["username"], e)
            await asyncio.sleep(1)
        return top

    async def check_approvals(self) -> None:
        """Одобрил ли админ заявку: по приглашению Telegram отвечает «вы уже участник», по @нику — канал без пометки «вышел».
        Неделю без ответа — сдаёмся и честно говорим об этом."""
        for row in await self.ctx.db.awaiting_channels():
            name = row["title"] or (row["username"] and f"@{row['username']}") or "закрытый канал"
            try:
                if row["invite"]:
                    res = await self.client(CheckChatInviteRequest(row["invite"]))
                    entity = getattr(res, "chat", None) if type(res).__name__ == "ChatInviteAlready" else None
                else:
                    entity = await self.client.get_entity(row["username"])
                    entity = None if getattr(entity, "left", True) else entity
            except errors.FloodWaitError as e:
                await asyncio.sleep(e.seconds)
                return
            except Exception as e:
                log.info("заявка в %s: %s", name, e)
                entity = None
            if entity:
                tg_id = utils.get_peer_id(entity)
                await self.ctx.db.channel_joined(row["id"], tg_id, getattr(entity, "title", "") or "",
                                                 getattr(entity, "username", None), "main")
                await self.ctx.refresh_channels()
                ch = await self.ctx.db.channel_by_tg(tg_id)
                await self.mute(ch, entity)
                for uid in await self.ctx.db.pop_approval_waiters(row["id"]) + (
                        await self.ctx.db.pop_approval_waiters(ch["id"]) if ch["id"] != row["id"] else []):
                    await self._notify(uid, T.CHANNEL_APPROVED.format(name=ch["title"] or name))
            elif time.time() - (row["awaiting_at"] or time.time()) > APPROVAL_WAIT:
                await self.ctx.db.channel_failed(row["id"], "админ не одобрил заявку")
                for uid in await self.ctx.db.pop_approval_waiters(row["id"]):
                    await self._notify(uid, T.CHANNEL_NOT_APPROVED.format(name=name))

    async def _failed(self, row, error: str) -> None:
        await self.ctx.db.channel_failed(row["id"], error)
        name = row["username"] and f"@{row['username']}" or "закрытый канал"
        for uid in await self.ctx.db.pop_waiters(row["id"]):
            await self._notify(uid, T.CHANNEL_FAILED.format(name=name, error=error))
            await self._batch_done(uid, row["id"], 0)

    async def _batch_done(self, uid: int, cid: int, ok: int) -> None:
        """Когда подключился последний из присланных каналов — одно итоговое сообщение «всё готово, можно искать»."""
        result = await self.ctx.db.batch_done(uid, cid, ok)
        if not result or not result[0]:
            return
        good, bad, wait = result
        total = await self.ctx.db.channel_count_for(uid)
        failed = (T.ALL_CHANNELS_FAILED_PART.format(n=bad) if bad else "") + (T.ALL_CHANNELS_AWAITING_PART.format(n=wait) if wait else "")
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
        checked = 0.0
        while True:
            started, queued = time.time(), []
            try:
                queued = await self.ctx.db.queued_channels()
                if queued:
                    await self.join_one(queued[0])
                if started - checked > APPROVAL_CHECK:
                    checked = started
                    await self.check_approvals()
            except Exception:
                log.exception("ошибка при вступлении в канал")
            await asyncio.sleep(max(5, self.ctx.cfg.join_interval - (time.time() - started)) if queued else 15)

    async def run(self) -> None:
        await asyncio.gather(self.join_loop(), self.poll_loop(), self.mute_all(), self.client.run_until_disconnected())


async def _same(peer):
    return peer
