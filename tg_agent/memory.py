"""Состояние между перезапусками: дневной счётчик и посты, под которыми уже есть комментарий."""

from __future__ import annotations

import json
from datetime import date

from .config import CONFIG


class State:
    def __init__(self) -> None:
        path = CONFIG.state_file
        data = json.loads(path.read_text(encoding="utf-8")) if path.exists() else {}
        self.day: str = data.get("day", "")
        self.comments_today: int = data.get("comments_today", 0)
        self.commented: list[str] = data.get("commented", [])
        self.log: list[dict] = data.get("log", [])

    def save(self) -> None:
        path = CONFIG.state_file
        path.parent.mkdir(parents=True, exist_ok=True)
        data = {
            "day": self.day,
            "comments_today": self.comments_today,
            "commented": self.commented[-2000:],
            "log": self.log[-300:],
        }
        tmp = path.with_suffix(".tmp")
        tmp.write_text(json.dumps(data, ensure_ascii=False, indent=1), encoding="utf-8")
        tmp.replace(path)

    def _roll_day(self) -> None:
        today = date.today().isoformat()
        if self.day != today:
            self.day, self.comments_today = today, 0

    def comment_budget_left(self) -> int:
        self._roll_day()
        return CONFIG.max_comments_per_day - self.comments_today

    def already_commented(self, key: str) -> bool:
        return key in self.commented

    def mark_commented(self, key: str, channel: str, text: str, link: str) -> None:
        self._roll_day()
        self.comments_today += 1
        self.commented.append(key)
        self.log.append({"day": self.day, "channel": channel, "text": text, "link": link})
        self.save()
