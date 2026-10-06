"""Публикация в Telegram-канал через Bot API (бот должен быть администратором канала)."""

from __future__ import annotations

import json
import time
from contextlib import ExitStack
from pathlib import Path

import requests

from .config import CONFIG

TEXT_MAX = 4096
ALBUM_MAX = 10


class TelegramError(RuntimeError):
    pass


class Telegram:
    def __init__(self, token: str | None = None):
        self.token = token or CONFIG.telegram_token

    def call(self, method: str, data: dict | None = None, files: dict | None = None) -> dict:
        url = f"https://api.telegram.org/bot{self.token}/{method}"
        for _ in range(3):
            r = requests.post(url, data=data or {}, files=files, timeout=120)
            try:
                payload = r.json()
            except ValueError:
                payload = {"description": f"HTTP {r.status_code}"}
            if payload.get("ok"):
                return payload["result"]
            retry = payload.get("parameters", {}).get("retry_after")
            if r.status_code == 429 and retry:
                time.sleep(int(retry) + 1)
                if files:
                    for f in files.values():
                        f.seek(0)
                continue
            break
        raise TelegramError(f"{method}: {payload.get('description', r.text)}")

    def send_message(self, chat: str, text: str, html: bool = True) -> int:
        data = {"chat_id": chat, "text": text[:TEXT_MAX], "disable_web_page_preview": "true"}
        if html:
            data["parse_mode"] = "HTML"
        return self.call("sendMessage", data)["message_id"]

    def send_post(self, chat: str, images: list[Path], caption_html: str, caption_len: int) -> list[int]:
        """Фото (или альбом) с подписью. Если подпись длиннее лимита — отдельным сообщением после фото."""
        from .writer import TELEGRAM_CAPTION_MAX

        images = images[:ALBUM_MAX]
        fits = caption_len <= TELEGRAM_CAPTION_MAX
        ids: list[int] = []
        with ExitStack() as stack:
            files = {f"p{i}": stack.enter_context(open(p, "rb")) for i, p in enumerate(images)}
            if len(images) == 1:
                data = {"chat_id": chat, "photo": "attach://p0"}
                if fits:
                    data.update(caption=caption_html, parse_mode="HTML")
                ids.append(self.call("sendPhoto", data, files)["message_id"])
            else:
                media = [{"type": "photo", "media": f"attach://p{i}"} for i in range(len(images))]
                if fits:
                    media[0].update(caption=caption_html, parse_mode="HTML")
                result = self.call("sendMediaGroup", {"chat_id": chat, "media": json.dumps(media)}, files)
                ids += [m["message_id"] for m in result]
        if not fits:
            ids.append(self.send_message(chat, caption_html))
        return ids


class TelegramPublisher:
    name = "telegram"

    def __init__(self, tg: Telegram | None = None, chat: str | None = None):
        self.tg = tg or Telegram()
        self.chat = chat or CONFIG.telegram_channel

    def publish(self, post) -> dict:
        ids = self.tg.send_post(self.chat, post.tg_images, post.telegram_html, post.telegram_len)
        return {"message_ids": ids}


def notify_admin(text: str) -> None:
    """Короткое сообщение владельцу (ошибки, отчёты). Молча пропускается, если чат не задан."""
    if not (CONFIG.telegram_token and CONFIG.telegram_admin_chat):
        return
    try:
        Telegram().send_message(CONFIG.telegram_admin_chat, text, html=False)
    except Exception:  # noqa: BLE001 — уведомление не должно ронять бота
        pass
