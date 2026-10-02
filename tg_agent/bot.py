"""Работа с Telegram через ваш аккаунт (Telethon).

Ничего не публикуется само: каждый комментарий и ответ приходит черновиком в «Избранное»,
а вы ответом на черновик решаете, что с ним делать:

    +            опубликовать как есть
    -            пропустить
    заново       написать другой вариант
    любой текст  опубликовать ваш текст вместо черновика (ассистент запомнит правку)
"""

from __future__ import annotations

import asyncio
import logging

from telethon import TelegramClient, events, utils
from telethon.errors import FloodWaitError, MsgIdInvalidError
from telethon.tl.functions.channels import GetFullChannelRequest

from . import brain
from .config import CONFIG
from .memory import ChatMemory, State

log = logging.getLogger("tg_agent")

APPROVE = {"+", "ок", "ok", "да", "го", "👍"}
REJECT = {"-", "нет", "skip", "👎"}
REDO = {"заново", "ещё", "еще", "другой"}


def make_client() -> TelegramClient:
    if not CONFIG.api_id or not CONFIG.api_hash:
        raise SystemExit("Заполните TG_API_ID и TG_API_HASH в .env (https://my.telegram.org → API development tools).")
    CONFIG.data_dir.mkdir(parents=True, exist_ok=True)
    return TelegramClient(CONFIG.session, CONFIG.api_id, CONFIG.api_hash)


def post_link(chat, msg_id: int) -> str:
    if getattr(chat, "username", None):
        return f"https://t.me/{chat.username}/{msg_id}"
    return f"https://t.me/c/{chat.id}/{msg_id}"


def _matches(chat, refs: list[str]) -> bool:
    ids = {str(chat.id), str(utils.get_peer_id(chat))}
    name = (getattr(chat, "username", None) or "").lower()
    return any(r.lstrip("@").lower() == name or r in ids for r in refs)


class Agent:
    def __init__(self, client: TelegramClient, llm) -> None:
        self.client = client
        self.llm = llm
        self.state = State()
        self.me = None
        self._comments_enabled: dict[int, bool] = {}

    async def ask(self, fn, *args):
        """Вызовы Claude синхронные — уводим их в поток, чтобы не блокировать клиент."""
        return await asyncio.to_thread(fn, self.llm, *args)

    # ------------------------------------------------------------ черновики
    async def send_draft(self, header: str, text: str, item: dict) -> None:
        body = f"{header}\n\n{text}\n\n— ответьте на это сообщение: «+» опубликовать, «-» пропустить, «заново» или свой текст"
        msg = await self.client.send_message("me", body, link_preview=False)
        item["text"] = text
        self.state.add_pending(msg.id, item)

    async def mark(self, draft_id: int, status: str) -> None:
        try:
            draft = await self.client.get_messages("me", ids=draft_id)
            if draft:
                await draft.edit(f"{status}\n\n{draft.raw_text}", link_preview=False)
        except Exception as e:  # отметка — косметика, падать из-за неё не стоит
            log.debug("не удалось отметить черновик: %s", e)

    # ------------------------------------------------------------ комментарии к постам
    async def comments_enabled(self, channel) -> bool:
        if channel.id not in self._comments_enabled:
            full = await self.client(GetFullChannelRequest(channel))
            self._comments_enabled[channel.id] = bool(full.full_chat.linked_chat_id)
        return self._comments_enabled[channel.id]

    async def on_channel_post(self, event) -> None:
        chat = await event.get_chat()
        if not getattr(chat, "broadcast", False) or _matches(chat, CONFIG.skip_channels):
            return
        text = event.message.message or ""
        key = f"{event.chat_id}:{event.id}"
        if len(text) < CONFIG.min_post_chars or self.state.already_commented(key):
            return
        if self.state.comment_budget_left() <= 0:
            log.info("Дневной лимит комментариев исчерпан — пост %s пропущен", key)
            return
        if not await self.comments_enabled(chat):
            return
        await self.draft_comment(chat, event.chat_id, event.id, text)

    async def draft_comment(self, chat, chat_id: int, post_id: int, text: str) -> None:
        result = await self.ask(brain.write_comment, chat.title, text, self.state.style_examples("comment"))
        if not result["worth_commenting"] or not result["comment"].strip():
            log.info("«%s»: пропуск (%s)", chat.title, result["reason"])
            return
        await self.send_draft(
            f"💬 Комментарий к посту «{chat.title}»\n{post_link(chat, post_id)}",
            result["comment"].strip(),
            {"kind": "comment", "chat_id": chat_id, "msg_id": post_id, "post": text, "title": chat.title},
        )

    async def publish_comment(self, item: dict, text: str) -> str:
        key = f"{item['chat_id']}:{item['msg_id']}"
        if self.state.comment_budget_left() <= 0:
            return "⛔ дневной лимит комментариев исчерпан (TG_MAX_COMMENTS_PER_DAY)"
        await self.client.send_message(item["chat_id"], text, comment_to=item["msg_id"])
        self.state.mark_commented(key)
        return "✅ опубликовано"

    # ------------------------------------------------------------ чаты
    async def should_watch(self, event, chat) -> bool:
        if event.is_private:
            return not getattr(chat, "bot", False) and chat.id != self.me.id
        return event.is_group and _matches(chat, CONFIG.watch_groups)

    async def addressed_to_me(self, event) -> bool:
        if event.is_private or event.mentioned:
            return True
        reply = await event.get_reply_message() if event.message.reply_to_msg_id else None
        return bool(reply and reply.out)

    async def on_chat_message(self, event) -> None:
        if not (event.is_private or event.is_group) or not event.raw_text:
            return
        chat = await event.get_chat()
        watched = await self.should_watch(event, chat)
        if event.out:
            # Ваши собственные сообщения тоже идут в память — так ассистент знает контекст.
            if watched:
                self.memory(event, chat).add("Я", event.raw_text, me=True, msg_id=event.id)
            return
        addressed = await self.addressed_to_me(event)
        if not watched and not addressed:
            return
        sender = await event.get_sender()
        mem = self.memory(event, chat)
        mem.add(utils.get_display_name(sender) if sender else "собеседник", event.raw_text, msg_id=event.id)
        if mem.needs_summary():
            mem.apply_summary(await self.ask(brain.summarize, mem))
        if addressed:
            await self.draft_reply(event.chat_id, event.id, mem, event.is_private)

    def memory(self, event, chat) -> ChatMemory:
        return ChatMemory(event.chat_id, utils.get_display_name(chat))

    async def draft_reply(self, chat_id: int, msg_id: int, mem: ChatMemory, is_private: bool) -> None:
        result = await self.ask(brain.write_reply, mem, self.state.style_examples("reply"), is_private)
        if not result["should_reply"] or not result["reply"].strip():
            return
        last = mem.messages[-1]["text"] if mem.messages else ""
        await self.send_draft(
            f"✉️ Ответ в «{mem.title}» на: «{last[:200]}»",
            result["reply"].strip(),
            {"kind": "reply", "chat_id": chat_id, "msg_id": msg_id, "private": is_private, "title": mem.title},
        )

    async def publish_reply(self, item: dict, text: str) -> str:
        chat = item["chat_id"]
        async with self.client.action(chat, "typing"):
            await asyncio.sleep(min(2 + len(text) / 25, 12))
        sent = await self.client.send_message(chat, text, reply_to=None if item.get("private") else item["msg_id"])
        ChatMemory(chat, item.get("title", "")).add("Я", text, me=True, msg_id=sent.id)
        return "✅ отправлено"

    # ------------------------------------------------------------ ваши решения в «Избранном»
    async def on_saved_message(self, event) -> None:
        draft_id = event.message.reply_to_msg_id
        if not draft_id or str(draft_id) not in self.state.pending:
            return
        command = event.raw_text.strip()
        item = self.state.pop_pending(draft_id)
        low = command.lower()
        try:
            if low in REJECT:
                status = "⏭ пропущено"
            elif low in REDO:
                status = "🔁 переписан ниже"
                await self.redo(item)
            else:
                text = item["text"] if low in APPROVE else command
                if low not in APPROVE:
                    self.state.learn(item["kind"], item["text"], text)
                publish = self.publish_comment if item["kind"] == "comment" else self.publish_reply
                status = await publish(item, text)
        except FloodWaitError as e:
            self.state.add_pending(draft_id, item)
            status = f"⏳ Telegram просит подождать {e.seconds} с — повторите позже"
        except MsgIdInvalidError:
            status = "⚠️ пост удалён или комментарии закрыты"
        except Exception as e:
            log.exception("ошибка публикации")
            status = f"⚠️ ошибка: {e}"
        await self.mark(draft_id, status)
        await event.delete()  # убираем вашу команду, чтобы «Избранное» не захламлялось

    async def redo(self, item: dict) -> None:
        if item["kind"] == "comment":
            chat = await self.client.get_entity(item["chat_id"])
            await self.draft_comment(chat, item["chat_id"], item["msg_id"], item["post"])
        else:
            mem = ChatMemory(item["chat_id"], item.get("title", ""))
            await self.draft_reply(item["chat_id"], item["msg_id"], mem, item.get("private", False))

    # ------------------------------------------------------------ запуск
    def register(self) -> None:
        c = self.client
        c.add_event_handler(self.on_saved_message, events.NewMessage(chats="me", outgoing=True))
        c.add_event_handler(self.on_channel_post, events.NewMessage(func=lambda e: e.is_channel and not e.is_group))
        c.add_event_handler(
            self.on_chat_message, events.NewMessage(func=lambda e: not e.is_channel or e.is_group)
        )

    async def run(self) -> None:
        await self.client.start()
        self.me = await self.client.get_me()
        self.register()
        log.info("Запущен как %s. Черновики приходят в «Избранное».", utils.get_display_name(self.me))
        await self.client.run_until_disconnected()
