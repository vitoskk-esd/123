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
from telethon.tl.functions.folders import EditPeerFoldersRequest
from telethon.tl.functions.channels import (CreateChannelRequest, EditAdminRequest, GetChannelRecommendationsRequest,
                                            GetFullChannelRequest, JoinChannelRequest)
from telethon.tl.types import (ChatAdminRights, InputFolderPeer, InputNotifyPeer, InputPeerChannel,
                               InputPeerNotifySettings)
from telethon.tl.functions.messages import CheckChatInviteRequest, ExportChatInviteRequest, ImportChatInviteRequest

import keyboards as K
import texts as T
from ctx import Ctx
from pipeline import HISTORY, RawPost, learn_history, process

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
        self.albums: dict[tuple[int, int], list[int]] = {}     # (канал, пост) → id фото альбома в буфере
        self.about: dict[int, tuple[float, str]] = {}           # канал → (когда, описание + закреп) для контактов

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
        try:                                    # @ служебного аккаунта — запасной адрес для «Написать в поддержку»
            me = await client.get_me()
            await self.ctx.db.set_setting("reader_username", getattr(me, "username", None) or "")
        except Exception as e:
            log.warning("не узнал @ служебного аккаунта: %s", e)
        client.add_event_handler(self._on_message, events.NewMessage())
        client.add_event_handler(self._on_edit, events.MessageEdited())
        await self.ensure_buffer()
        await self.ensure_paylog()
        await self.ctx.refresh_channels()
        try:
            await client.get_dialogs()          # кэш каналов — чтобы опрашивать их без лишних запросов
        except Exception as e:
            log.warning("не загрузил список каналов: %s", e)
        self.runner = asyncio.create_task(self.run())
        self.runner.add_done_callback(self._on_stop)
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

    async def ensure_paylog(self) -> None:
        """Закрытый канал «оплаты» для админа: служебный аккаунт создаёт его один раз, делает бота админом и сохраняет
        ссылку-приглашение (её видно в админ-панели). Сюда бот пишет каждую оплату сразу. Не получилось — оплаты идут админу в личку."""
        cid = await self.ctx.db.get_setting("paylog_id")
        if not cid:
            try:
                ch = (await self.client(CreateChannelRequest(
                    title="Перехват — оплаты", about="Каждая оплата подписки в боте — сразу сюда. Закрытый канал для админа.",
                    broadcast=True))).chats[0]
                me = await self.bot.me()
                await self.client(EditAdminRequest(ch, me.username, ChatAdminRights(post_messages=True, edit_messages=True,
                                                                                     delete_messages=True), rank="bot"))
                link = (await self.client(ExportChatInviteRequest(ch))).link
            except Exception as e:
                log.warning("канал оплат не создан (%s) — оплаты будут приходить админу в личку", e)
                return
            cid = str(ch.id)
            await self.ctx.db.set_setting("paylog_id", cid)
            await self.ctx.db.set_setting("paylog_link", link)
        self.ctx.paylog_chat = int(f"-100{cid}")

    def _photo(self, peer_of, msg_id: int):
        async def forward() -> int | None:
            if self.buffer is None:
                return None
            sent = await self.client.forward_messages(self.buffer, msg_id, from_peer=await peer_of())
            sent = sent[0] if isinstance(sent, list) else sent
            return sent.id if sent else None
        return forward

    async def album(self, chat_id: int, msg_id: int) -> list[int]:
        """«📸 Все фото»: все фото и видео альбома этого поста → в канал-буфер одним запросом (альбом сохраняется) → id там.
        Пост без альбома — одно его фото. Кэшируем: повторное нажатие не пересылает заново."""
        key = (chat_id, msg_id)
        if key in self.albums:
            return self.albums[key]
        if self.buffer is None or not self.client:
            return []
        peer = await self._peer(chat_id)
        msgs = [m for m in await self.client.get_messages(peer, ids=list(range(max(1, msg_id - 10), msg_id + 11))) if m]
        me = next((m for m in msgs if m.id == msg_id), None)
        if not me:
            return []
        group = sorted((m for m in msgs if me.grouped_id and m.grouped_id == me.grouped_id and (m.photo or m.video)), key=lambda m: m.id) \
            or ([me] if me.photo else [])
        if not group:
            return []
        sent = await self.client.forward_messages(self.buffer, [m.id for m in group], from_peer=peer)
        ids = [s.id for s in (sent if isinstance(sent, list) else [sent]) if s]
        self.albums[key] = ids
        if len(self.albums) > 2000:
            self.albums.pop(next(iter(self.albums)))
        return ids

    @staticmethod
    def extras(m) -> str:
        """Ссылки, которых не видно в тексте поста: скрытые ссылки («Написать» → t.me/…) и URL-кнопки под постом."""
        urls = [getattr(e, "url", None) for e in (getattr(m, "entities", None) or [])]
        for row in getattr(getattr(m, "reply_markup", None), "rows", None) or []:
            urls += [getattr(b, "url", None) for b in getattr(row, "buttons", []) or []]
        return " ".join(u for u in urls if u)

    async def channel_about(self, chat_id: int) -> str:
        """Описание канала + закреплённое сообщение (текст и ссылки) — там контакты, когда в постах их нет. Кэш на 6 часов."""
        hit = self.about.get(chat_id)
        if hit and time.time() - hit[0] < 6 * 3600:
            return hit[1]
        peer = await self._peer(chat_id)
        full = (await self.client(GetFullChannelRequest(peer))).full_chat
        text = full.about or ""
        if getattr(full, "pinned_msg_id", None):
            pin = await self.client.get_messages(peer, ids=full.pinned_msg_id)
            if pin:
                text += "\n" + (pin.message or "") + " " + self.extras(pin)
        self.about[chat_id] = (time.time(), text)
        return text

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
        raw = RawPost(chat_id, m.id, m.message, m.date.timestamp(), photo, recv=time.time(), extra=self.extras(m),
                      about=lambda c=chat_id: self.channel_about(c))
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
            chans = [c for c in self.ctx.channels if c < 0]       # только Telegram; сообщества ВК читает vk.py
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
        task = asyncio.create_task(self._process(RawPost(e.chat_id, m.id, m.message, time.time(), photo, recv=time.time(), extra=self.extras(m),
                                                         about=lambda c=e.chat_id: self.channel_about(c))))
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
            self.join_pause_until = time.time() + e.seconds        # видно админу в /list: очередь стоит не просто так
            await asyncio.sleep(e.seconds)
            return
        except errors.InviteRequestSentError:
            return await self._awaiting(row)
        except FATAL as e:
            return await self._failed(row, type(e).__name__.replace("Error", ""))
        self.join_pause_until = 0.0
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
        """Каналы читает бот, а не человек: у служебного аккаунта уведомления из них выключаем навсегда,
        а сам канал убираем в архив — в списке чатов аккаунта чисто."""
        try:
            peer = utils.get_input_peer(entity) if entity is not None else await self._peer(ch["tg_id"])
            await self.client(UpdateNotifySettingsRequest(peer=InputNotifyPeer(peer),
                                                          settings=InputPeerNotifySettings(mute_until=2 ** 31 - 1)))
            await self.ctx.db.set_muted(ch["id"])
            await self.client(EditPeerFoldersRequest([InputFolderPeer(peer, folder_id=1)]))    # 1 — архив
            await self.ctx.db.set_archived([ch["id"]])
        except errors.FloodWaitError as e:
            await asyncio.sleep(e.seconds)
        except Exception as e:
            log.info("не выключил уведомления / не убрал в архив %s: %s", ch["title"], e)

    async def mute_all(self) -> None:
        """Каналы, в которые вступили раньше: выключаем уведомления (по одному в 2 секунды, чтобы не злить Telegram)
        и убираем в архив пачками по 50."""
        for ch in await self.ctx.db.unmuted_channels():
            await self.mute(ch)
            await asyncio.sleep(2)
        rows = await self.ctx.db.unarchived_channels()
        for i in range(0, len(rows), 50):
            part = rows[i:i + 50]
            try:
                peers = [InputFolderPeer(await self._peer(ch["tg_id"]), folder_id=1) for ch in part]
                await self.client(EditPeerFoldersRequest(peers))
                await self.ctx.db.set_archived([ch["id"] for ch in part])
            except errors.FloodWaitError as e:
                await asyncio.sleep(e.seconds)
            except Exception as e:
                log.info("не убрал каналы в архив: %s", e)
            await asyncio.sleep(2)

    async def similar(self, known: set[str], limit: int = 60) -> list[dict]:
        """Похожие каналы от Telegram для каждого канала базы → автомобильные, которых ещё нет в базе, с активностью:
        сколько постов за неделю и в сколько из 5 последних будних дней были посты."""
        found: dict[str, dict] = {}
        for ch in [c for c in self.ctx.channels.values() if c["base"] and c["tg_id"]]:
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

    async def tgfind(self, known: set[str], want: int = 800, progress=None) -> tuple[list[dict], list[dict], dict]:
        """Большой поиск для таблицы (владелец 11.11): публичные Telegram-каналы и группы с продажей Б/У машин по России —
        3000+ подписчиков, 5+ постов за 7 дней, в постах машины с ценой, без импорта «под заказ». Кандидаты: поиск Telegram по фразам
        «авто/авторынок/продажа авто + город» + «похожие каналы» у каждого подошедшего. → (подходящие, отсеянные, цифры)"""
        import finder
        from telethon.tl.functions.contacts import SearchRequest
        cand: dict[str, object] = {}
        qs = finder.queries(words=("авто", "авторынок", "продажа авто"))

        def take(chats):
            for c in chats:
                name = (getattr(c, "username", None) or "").lower()
                if (name and name not in known and name not in cand and (getattr(c, "broadcast", False) or getattr(c, "megagroup", False))
                        and finder.CAR_TITLE.search(c.title or "") and (getattr(c, "participants_count", None) or 3000) >= 3000):
                    cand[name] = c
        for i, q in enumerate(qs):
            try:
                take((await self.client(SearchRequest(q=q, limit=100))).chats)
            except errors.FloodWaitError as e:
                await asyncio.sleep(e.seconds + 1)
            except Exception as e:
                log.info("поиск «%s»: %s", q, e)
            await asyncio.sleep(1.2)
            if progress and i and i % 150 == 0:
                await progress(f"поиск: {i} из {len(qs)} фраз — кандидатов {len(cand)}")
        stats = {"queries": len(qs), "found": len(cand)}
        if progress:
            await progress(f"кандидатов: {len(cand)} — проверяю посты каждого (и «похожие» у подходящих)")
        ok, rej, done = [], [], set()
        while len(ok) < want:
            todo = sorted((n for n in cand if n not in done), key=lambda n: -(getattr(cand[n], "participants_count", 0) or 0))
            if not todo:
                break
            for name in todo[:50]:
                done.add(name)
                c = cand[name]
                try:
                    msgs = await self.client.get_messages(c, limit=40)
                    subs = getattr(c, "participants_count", None) or (await self.client.get_participants(c, limit=0)).total
                except errors.FloodWaitError as e:
                    await asyncio.sleep(e.seconds + 1)
                    continue
                except Exception as e:
                    log.info("проверка @%s: %s", name, e)
                    continue
                posts = [(m.date, m.message or "") for m in msgs if m.date]
                j = finder.judge(posts, self.ctx.dict, title=c.title or "", subs=subs or 0)
                row = dict(j, link=f"https://t.me/{c.username}", title=c.title or "")
                if j["ok"]:
                    ok.append(row)
                    try:                                  # «похожие каналы» у подошедшего — свежие кандидаты
                        take(getattr(await self.client(GetChannelRecommendationsRequest(channel=c)), "chats", []))
                    except Exception:
                        pass
                elif j["car_share"] >= .3:
                    rej.append(row)
                await asyncio.sleep(1)
                if len(ok) >= want:
                    break
            if progress:
                await progress(f"проверено {len(done)} — подходят {len(ok)}")
        stats.update(checked=len(done), fit=len(ok))
        ok.sort(key=lambda r: -r["subs"])
        return ok[:want], rej, stats

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
        await batch_done(self.bot, self.ctx, uid, cid, ok)

    async def _notify(self, uid: int, text: str) -> None:
        await notify(self.bot, uid, text)

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

    async def history_loop(self) -> None:
        """Один раз на канал: последние HISTORY постов — в оценку рынка (новые каналы — через минуту после вступления)."""
        await asyncio.sleep(20)
        while True:
            for ch in await self.ctx.db.history_todo("tg"):
                try:
                    msgs = await self.client.get_messages(await self._peer(ch["tg_id"]), limit=HISTORY)
                    n = await learn_history(self.ctx, dict(ch), [(m.id, m.message or "", m.date.timestamp())
                                                                 for m in msgs if m.date and m.message])
                    log.info("история %s: %d машин с ценой — в оценку рынка", ch["title"], n)
                except errors.FloodWaitError as e:
                    await asyncio.sleep(e.seconds)
                    continue
                except Exception as e:
                    log.info("история %s: %s", ch["title"], e)
                    await self.ctx.db.set_history(ch["id"])          # не застреваем на одном канале
                await asyncio.sleep(3)
            await asyncio.sleep(60)

    def _on_stop(self, task: asyncio.Task) -> None:
        """Служебный аккаунт перестал читать каналы не по нашей команде (сессию закрыли в «Активных сеансах», бан, обрыв) —
        пишем админам сразу, а не ждём, пока заметят тишину в /health (владелец 12.11: «возможно случайно сессию закрыл»)."""
        if task.cancelled() or task is not self.runner:
            return
        e = task.exception()
        revoked = isinstance(e, (errors.AuthKeyUnregisteredError, errors.SessionRevokedError, errors.UserDeactivatedError,
                                 errors.AuthKeyDuplicatedError, errors.UserDeactivatedBanError))
        log.warning("служебный аккаунт остановился: %r", e)
        t = asyncio.get_event_loop().create_task(self._alert(T.READER_REVOKED if revoked else T.READER_STOPPED.format(err=str(e or "соединение закрыто")[:200])))
        self.tasks.add(t); t.add_done_callback(self.tasks.discard)

    async def _alert(self, text: str) -> None:
        import admin                                   # admin импортирует userbot — берём лениво
        for uid in await admin.admin_ids(self.ctx):
            await notify(self.bot, uid, text)

    async def run(self) -> None:
        await asyncio.gather(self.join_loop(), self.poll_loop(), self.mute_all(), self.history_loop(),
                             self.client.run_until_disconnected())


async def batch_done(bot: Bot, ctx: Ctx, uid: int, cid: int, ok: int) -> None:
    """Когда подключился последний из присланных каналов — одно итоговое сообщение «всё готово, можно искать»."""
    result = await ctx.db.batch_done(uid, cid, ok)
    if not result or not result[0]:
        return
    good, bad, wait = result
    total = await ctx.db.channel_count_for(uid)
    failed = (T.ALL_CHANNELS_FAILED_PART.format(n=bad) if bad else "") + (T.ALL_CHANNELS_AWAITING_PART.format(n=wait) if wait else "")
    has_filters = bool(await ctx.db.filters(uid))
    text = T.ALL_CHANNELS_READY.format(n=good, total=total, failed=failed,
                                       next=T.ALL_READY_WATCHING if has_filters else T.ALL_READY_NEED_FILTER)
    try:
        await bot.send_message(uid, text, reply_markup=None if has_filters else K.new_filter())
    except Exception as e:
        log.info("не смог уведомить %s: %s", uid, e)


async def notify(bot: Bot, uid: int, text: str) -> None:
    try:
        await bot.send_message(uid, text)
    except Exception as e:
        log.info("не смог уведомить %s: %s", uid, e)


async def _same(peer):
    return peer
