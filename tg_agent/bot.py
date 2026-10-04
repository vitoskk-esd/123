"""Автокомментарии к постам каналов, на которые подписан ваш аккаунт (Telethon).

Пост вышел → через случайные 3–5 минут ассистент перечитывает его (вдруг отредактировали
или удалили), решает, есть ли что сказать по существу, и публикует комментарий.
"""

from __future__ import annotations

import asyncio
import logging
import time

from telethon import TelegramClient, events, utils
from telethon.errors import (
    ChatWriteForbiddenError,
    SessionPasswordNeededError,
    FloodWaitError,
    MsgIdInvalidError,
    UserBannedInChannelError,
)
from telethon.tl.functions.channels import GetFullChannelRequest

from . import brain
from .config import CONFIG
from .memory import State
from .schedule import Scheduler

log = logging.getLogger("tg_agent")


# Публичные ключи официального Telegram Desktop (опубликованы в его открытом исходном коде).
# Клиент при этом представляется как Telegram Desktop на Windows, чтобы ключи и
# описание устройства не противоречили друг другу.
DESKTOP_KEYS = {
    "api_id": 2040,
    "api_hash": "b18441a1ff607e10a989891a5462e627",
    "device_model": "Desktop",
    "system_version": "Windows 10",
    "app_version": "5.5.5 x64",
    "lang_code": "ru",
    "system_lang_code": "ru-RU",
}


def make_client() -> TelegramClient:
    CONFIG.data_dir.mkdir(parents=True, exist_ok=True)
    if CONFIG.api_id and CONFIG.api_hash:
        return TelegramClient(CONFIG.session, CONFIG.api_id, CONFIG.api_hash)
    if CONFIG.use_desktop_keys:
        keys = dict(DESKTOP_KEYS)
        return TelegramClient(CONFIG.session, keys.pop("api_id"), keys.pop("api_hash"), **keys)
    raise SystemExit(
        "Заполните TG_API_ID и TG_API_HASH (https://my.telegram.org → API development tools) "
        "или включите TG_USE_DESKTOP_KEYS=1."
    )


async def ensure_login(client: TelegramClient) -> None:
    """Вход по QR-коду: работает на сервере без клавиатуры, код из SMS вводить не нужно.

    QR печатается в лог. Сканируйте его телефоном: Telegram → Настройки → Устройства →
    Подключить устройство. Сессия сохраняется в файл, повторно сканировать не придётся.
    """
    await client.connect()
    if await client.is_user_authorized():
        return
    import qrcode

    qr_login = await client.qr_login()
    while True:
        qr = qrcode.QRCode(border=2)
        qr.add_data(qr_login.url)
        print("\n" + "=" * 60)
        print("ВХОД В TELEGRAM: отсканируйте QR-код телефоном")
        print("Telegram → Настройки → Устройства → Подключить устройство")
        print("=" * 60, flush=True)
        qr.print_ascii(invert=True)
        print("Код обновляется каждые ~30 секунд, если не успели — сканируйте новый ниже.", flush=True)
        try:
            await qr_login.wait()
            break
        except asyncio.TimeoutError:
            await qr_login.recreate()
        except SessionPasswordNeededError:
            if not CONFIG.password:
                raise SystemExit(
                    "На аккаунте включён облачный пароль. Добавьте его в переменную TG_2FA_PASSWORD и перезапустите."
                )
            await client.sign_in(password=CONFIG.password)
            break
    me = await client.get_me()
    print(f"Вход выполнен: {utils.get_display_name(me)}", flush=True)


def post_link(chat, msg_id: int) -> str:
    if getattr(chat, "username", None):
        return f"https://t.me/{chat.username}/{msg_id}"
    return f"https://t.me/c/{chat.id}/{msg_id}"


def _matches(chat, refs: list[str]) -> bool:
    ids = {str(chat.id), str(utils.get_peer_id(chat))}
    name = (getattr(chat, "username", None) or "").lower()
    return any(r.lstrip("@").lower() == name or r in ids for r in refs if r)


class Agent:
    def __init__(self, client: TelegramClient, llm) -> None:
        self.client = client
        self.llm = llm
        self.state = State()
        self.scheduler = Scheduler()
        self.queued: set[str] = set()
        self.blocked: set[int] = set()  # каналы, где писать нельзя (бан, закрытые комментарии)
        self._tasks: set[asyncio.Task] = set()
        self._comments_enabled: dict[int, bool] = {}

    async def comments_enabled(self, channel) -> bool:
        if channel.id not in self._comments_enabled:
            full = await self.client(GetFullChannelRequest(channel))
            self._comments_enabled[channel.id] = bool(full.full_chat.linked_chat_id)
        return self._comments_enabled[channel.id]

    async def on_channel_post(self, event) -> None:
        chat = await event.get_chat()
        if not getattr(chat, "broadcast", False) or chat.id in self.blocked:
            return
        if _matches(chat, CONFIG.skip_channels + [CONFIG.my_channel]):
            return
        key = f"{event.chat_id}:{event.id}"
        if len(event.message.message or "") < CONFIG.min_post_chars:
            return
        if key in self.queued or self.state.already_commented(key):
            return
        if self.state.comment_budget_left() - len(self.queued) <= 0:
            log.info("Дневной лимит комментариев исчерпан — «%s» пропущен", chat.title)
            return
        if not await self.comments_enabled(chat):
            return

        at = self.scheduler.plan(event.message.date.timestamp(), time.time())
        self.queued.add(key)
        log.info("«%s»: новый пост, комментарий через %.1f мин", chat.title, (at - time.time()) / 60)
        task = asyncio.create_task(self.comment_later(chat, event.chat_id, event.id, key, at))
        self._tasks.add(task)
        task.add_done_callback(self._tasks.discard)

    async def comment_later(self, chat, chat_id: int, post_id: int, key: str, at: float) -> None:
        try:
            await asyncio.sleep(max(0.0, at - time.time()))
            await self.comment(chat, chat_id, post_id, key)
        except Exception:
            log.exception("«%s»: не удалось оставить комментарий", chat.title)
        finally:
            self.queued.discard(key)

    async def comment(self, chat, chat_id: int, post_id: int, key: str) -> None:
        # Перечитываем пост: за эти минуты его могли отредактировать или удалить.
        post = await self.client.get_messages(chat_id, ids=post_id)
        if not post or len(post.message or "") < CONFIG.min_post_chars:
            return
        if self.state.comment_budget_left() <= 0:
            return
        # Вызов Claude синхронный — уводим в поток, чтобы не блокировать клиент.
        result = await asyncio.to_thread(brain.write_comment, self.llm, chat.title, post.message)
        text = result["comment"].strip()
        if not result["worth_commenting"] or not text:
            log.info("«%s»: пропуск (%s)", chat.title, result["reason"])
            return

        for attempt in range(2):
            try:
                sent = await self.client.send_message(chat_id, text, comment_to=post_id)
                break
            except FloodWaitError as e:
                if attempt or e.seconds > 3600:
                    raise
                log.warning("Telegram просит подождать %s с", e.seconds)
                await asyncio.sleep(e.seconds + 5)
            except (ChatWriteForbiddenError, UserBannedInChannelError, MsgIdInvalidError) as e:
                log.warning("«%s»: писать нельзя (%s) — канал больше не трогаем", chat.title, type(e).__name__)
                self.blocked.add(chat.id)
                return

        link = f"{post_link(chat, post_id)}?comment={sent.id}"
        self.state.mark_commented(key, chat.title, text, link)
        log.info("«%s»: комментарий опубликован %s", chat.title, link)
        if CONFIG.report:
            await self.client.send_message("me", f"💬 «{chat.title}»\n{link}\n\n{text}", link_preview=False)

    async def run(self) -> None:
        await ensure_login(self.client)
        me = await self.client.get_me()
        self.client.add_event_handler(
            self.on_channel_post, events.NewMessage(func=lambda e: e.is_channel and not e.is_group)
        )
        log.info(
            "Запущен как %s. Задержка %g–%g мин, лимит %d комментариев в сутки.",
            utils.get_display_name(me),
            CONFIG.delay_min_minutes,
            CONFIG.delay_max_minutes,
            CONFIG.max_comments_per_day,
        )
        await self.client.run_until_disconnected()
