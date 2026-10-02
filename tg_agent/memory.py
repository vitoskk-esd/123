"""Долговременная память: история каждого чата, черновики на одобрении, ваш стиль."""

from __future__ import annotations

import json
import time
from datetime import date
from pathlib import Path
from typing import Any

from .config import CONFIG


def _read(path: Path, default: Any) -> Any:
    if not path.exists():
        return default
    return json.loads(path.read_text(encoding="utf-8"))


def _write(path: Path, data: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_suffix(".tmp")
    tmp.write_text(json.dumps(data, ensure_ascii=False, indent=1), encoding="utf-8")
    tmp.replace(path)


class ChatMemory:
    """История одного чата: последние сообщения дословно + сжатое резюме всего, что было раньше.

    Резюме обновляет модель (см. brain.summarize), поэтому ассистент помнит людей,
    договорённости и темы даже спустя сотни сообщений.
    """

    def __init__(self, chat_id: int, title: str = ""):
        self.path = CONFIG.chats_dir / f"{chat_id}.json"
        data = _read(self.path, {})
        self.chat_id = chat_id
        self.title = data.get("title") or title
        self.summary: str = data.get("summary", "")
        self.messages: list[dict] = data.get("messages", [])
        # Сообщения, вытесненные из окна, но ещё не вошедшие в резюме.
        self.overflow: list[dict] = data.get("overflow", [])

    def add(self, author: str, text: str, *, me: bool = False, msg_id: int | None = None) -> None:
        if not text:
            return
        if msg_id is not None and any(m.get("id") == msg_id for m in self.messages):
            return
        self.messages.append({"id": msg_id, "author": author, "me": me, "text": text, "ts": int(time.time())})
        extra = len(self.messages) - CONFIG.memory_messages
        if extra > 0:
            self.overflow.extend(self.messages[:extra])
            self.messages = self.messages[extra:]
        self.save()

    def needs_summary(self) -> bool:
        return len(self.overflow) >= max(10, CONFIG.memory_messages // 2)

    def apply_summary(self, summary: str) -> None:
        self.summary = summary
        self.overflow = []
        self.save()

    def transcript(self, messages: list[dict] | None = None) -> str:
        lines = []
        for m in messages if messages is not None else self.messages:
            who = "Я" if m.get("me") else m.get("author") or "собеседник"
            lines.append(f"{who}: {m['text']}")
        return "\n".join(lines)

    def save(self) -> None:
        _write(
            self.path,
            {
                "title": self.title,
                "summary": self.summary,
                "messages": self.messages,
                "overflow": self.overflow,
            },
        )


class State:
    """Черновики на одобрении, правки стиля и дневной счётчик комментариев."""

    def __init__(self) -> None:
        data = _read(CONFIG.state_file, {})
        self.pending: dict[str, dict] = data.get("pending", {})
        self.style: list[dict] = data.get("style", [])
        self.day: str = data.get("day", "")
        self.comments_today: int = data.get("comments_today", 0)
        self.commented: list[str] = data.get("commented", [])

    def save(self) -> None:
        _write(
            CONFIG.state_file,
            {
                "pending": self.pending,
                "style": self.style[-50:],
                "day": self.day,
                "comments_today": self.comments_today,
                "commented": self.commented[-2000:],
            },
        )

    # --- черновики ---
    def add_pending(self, draft_msg_id: int, item: dict) -> None:
        self.pending[str(draft_msg_id)] = item
        self.save()

    def pop_pending(self, draft_msg_id: int) -> dict | None:
        item = self.pending.pop(str(draft_msg_id), None)
        if item is not None:
            self.save()
        return item

    # --- лимит комментариев ---
    def _roll_day(self) -> None:
        today = date.today().isoformat()
        if self.day != today:
            self.day, self.comments_today = today, 0

    def comment_budget_left(self) -> int:
        self._roll_day()
        return CONFIG.max_comments_per_day - self.comments_today

    def mark_commented(self, key: str) -> None:
        self._roll_day()
        self.comments_today += 1
        self.commented.append(key)
        self.save()

    def already_commented(self, key: str) -> bool:
        return key in self.commented

    # --- обучение стилю ---
    def learn(self, kind: str, draft: str, final: str) -> None:
        """Запоминает, как вы поправили черновик: модель будет писать ближе к этому."""
        if draft.strip() == final.strip():
            return
        self.style.append({"kind": kind, "draft": draft, "final": final})
        self.save()

    def style_examples(self, kind: str) -> list[dict]:
        return [s for s in self.style if s["kind"] == kind][-CONFIG.style_examples :]
