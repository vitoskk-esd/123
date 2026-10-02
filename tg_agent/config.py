"""Настройки Telegram-ассистента. Всё берётся из переменных окружения (или файла .env)."""

from __future__ import annotations

import os
from dataclasses import dataclass, field
from pathlib import Path

# Подтягивает .env так же, как kwork_agent.
from kwork_agent.config import ROOT  # noqa: F401  (импорт загружает .env)


def _int(name: str, default: int) -> int:
    return int(os.getenv(name, default))


def _list(name: str) -> list[str]:
    return [x.strip() for x in os.getenv(name, "").split(",") if x.strip()]


@dataclass
class Config:
    # https://my.telegram.org → API development tools
    api_id: int = _int("TG_API_ID", 0)
    api_hash: str = os.getenv("TG_API_HASH", "")
    session: str = os.getenv("TG_SESSION", str(ROOT / "data" / "tg" / "account"))

    model: str = os.getenv("TG_AGENT_MODEL", "claude-opus-5-5")
    data_dir: Path = Path(os.getenv("TG_AGENT_DATA", ROOT / "data" / "tg"))

    # Ваш канал (@username) — бот упоминает его только когда это уместно в личке.
    my_channel: str = os.getenv("TG_MY_CHANNEL", "")
    # Кто вы: ниша и экспертиза. От этого зависит голос комментариев.
    persona: str = os.getenv(
        "TG_PERSONA",
        "практик в автоматизации бизнеса с помощью ИИ: внедряю ИИ-агентов, чат-ботов "
        "и контент-заводы для малого бизнеса, знаю цифры и подводные камни из реальных проектов",
    )

    # Каналы, к постам которых НЕ писать черновики (@username или id через запятую).
    skip_channels: list[str] = field(default_factory=lambda: _list("TG_SKIP_CHANNELS"))
    # Группы, где ассистент следит за беседой целиком. В остальных группах —
    # только когда вас упомянули или ответили на ваше сообщение. Личка — всегда.
    watch_groups: list[str] = field(default_factory=lambda: _list("TG_WATCH_GROUPS"))

    # Не больше стольких опубликованных комментариев в сутки (защита от бана за спам).
    max_comments_per_day: int = _int("TG_MAX_COMMENTS_PER_DAY", 15)
    # Посты короче этого (символов) пропускаются — комментировать нечего.
    min_post_chars: int = _int("TG_MIN_POST_CHARS", 60)

    # Память чата: сколько последних сообщений держать дословно.
    memory_messages: int = _int("TG_MEMORY_MESSAGES", 40)
    # Сколько последних правок черновиков показывать модели как образец вашего стиля.
    style_examples: int = _int("TG_STYLE_EXAMPLES", 8)

    @property
    def state_file(self) -> Path:
        return self.data_dir / "state.json"

    @property
    def chats_dir(self) -> Path:
        return self.data_dir / "chats"


CONFIG = Config()
