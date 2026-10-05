"""Настройки Telegram-ассистента. Всё берётся из переменных окружения (или файла .env)."""

from __future__ import annotations

import os
from dataclasses import dataclass, field
from pathlib import Path

# Подтягивает .env так же, как kwork_agent.
from kwork_agent.config import ROOT


def _int(name: str, default: int) -> int:
    return int(os.getenv(name, default))


def _float(name: str, default: float) -> float:
    return float(os.getenv(name, default))


def _bool(name: str, default: bool) -> bool:
    return os.getenv(name, "1" if default else "0").lower() in ("1", "true", "yes", "on")


def _list(name: str) -> list[str]:
    return [x.strip() for x in os.getenv(name, "").split(",") if x.strip()]


@dataclass
class Config:
    # https://my.telegram.org → API development tools.
    # Если создать приложение там не получается — TG_USE_DESKTOP_KEYS=1 (см. TG_AGENT.md).
    api_id: int = _int("TG_API_ID", 0)
    api_hash: str = os.getenv("TG_API_HASH", "")
    use_desktop_keys: bool = _bool("TG_USE_DESKTOP_KEYS", False)
    # Облачный пароль Telegram (двухэтапная проверка), если он включён.
    password: str = os.getenv("TG_2FA_PASSWORD", "")

    # Кто пишет комментарии: "claude" (Anthropic) или "yandex" (YandexGPT, доступен из РФ).
    llm_provider: str = os.getenv("TG_LLM_PROVIDER", "claude").lower()
    model: str = os.getenv("TG_AGENT_MODEL", "claude-opus-5-5")
    # YandexGPT: Yandex Cloud → сервисный аккаунт с ролью ai.languageModels.user → API-ключ.
    yandex_api_key: str = os.getenv("YANDEX_API_KEY", "")
    yandex_folder_id: str = os.getenv("YANDEX_FOLDER_ID", "")
    yandex_model: str = os.getenv("YANDEX_MODEL", "yandexgpt/latest")
    data_dir: Path = Path(os.getenv("TG_AGENT_DATA", ROOT / "data" / "tg"))

    # Ваш канал (@username): под его постами ассистент не комментирует.
    my_channel: str = os.getenv("TG_MY_CHANNEL", "")
    # Кто вы: ниша и экспертиза. От этого зависит голос комментариев.
    persona: str = os.getenv(
        "TG_PERSONA",
        "практик в автоматизации бизнеса с помощью ИИ: внедряю ИИ-агентов, чат-ботов "
        "и контент-заводы для малого бизнеса, знаю цифры и подводные камни из реальных проектов",
    )

    # Каналы, под постами которых не комментировать (@username или id через запятую).
    skip_channels: list[str] = field(default_factory=lambda: _list("TG_SKIP_CHANNELS"))

    # Комментарий уходит через случайные 3–5 минут после выхода поста.
    delay_min_minutes: float = _float("TG_DELAY_MIN_MINUTES", 3)
    delay_max_minutes: float = _float("TG_DELAY_MAX_MINUTES", 5)
    # Пауза между двумя вашими комментариями, если посты вышли почти одновременно:
    # без неё пачка комментариев за минуту выглядит как бот.
    gap_min_minutes: float = _float("TG_GAP_MIN_MINUTES", 2)
    gap_max_minutes: float = _float("TG_GAP_MAX_MINUTES", 4)
    # Не больше стольких комментариев в сутки (защита от ограничений за спам).
    max_comments_per_day: int = _int("TG_MAX_COMMENTS_PER_DAY", 15)
    # Посты короче этого (символов) пропускаются — комментировать нечего.
    min_post_chars: int = _int("TG_MIN_POST_CHARS", 60)
    # Присылать в «Избранное» отчёт о каждом комментарии со ссылкой на него.
    report: bool = _bool("TG_REPORT", True)
    # Порт страницы с QR-кодом для входа (0 — выключено). На сервере удобно 80:
    # тогда QR открывается в браузере по адресу http://IP-сервера
    login_port: int = _int("TG_LOGIN_PORT", 0)

    @property
    def session(self) -> str:
        """Файл сессии Telegram (= доступ к аккаунту). Лежит рядом с остальными данными."""
        return os.getenv("TG_SESSION", str(self.data_dir / "account"))

    @property
    def state_file(self) -> Path:
        return self.data_dir / "state.json"


CONFIG = Config()
