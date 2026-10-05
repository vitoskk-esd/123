"""Настройки агента. Всё берётся из переменных окружения (или файла .env)."""

from __future__ import annotations

import datetime as dt
import os
from dataclasses import dataclass, field
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def _load_dotenv() -> None:
    env = ROOT / ".env"
    if not env.exists():
        return
    for line in env.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


_load_dotenv()


def _int(name: str, default: int) -> int:
    return int(os.getenv(name, default))


def _float(name: str, default: float) -> float:
    return float(os.getenv(name, default))


def _bool(name: str, default: bool) -> bool:
    return os.getenv(name, "1" if default else "0").lower() in ("1", "true", "yes", "on")


def _list(name: str, default: str = "") -> list[str]:
    return [x.strip() for x in os.getenv(name, default).split(",") if x.strip()]


def _channel_posts(raw: str) -> dict[str, int]:
    """«telegram:3,vk:2» → {"telegram": 3, "vk": 2}."""
    out: dict[str, int] = {}
    for part in raw.split(","):
        if ":" in part:
            name, n = part.split(":", 1)
            out[name.strip()] = int(n)
    return out


def _end_of_month(today: dt.date) -> dt.date:
    nxt = (today.replace(day=28) + dt.timedelta(days=4)).replace(day=1)
    return nxt - dt.timedelta(days=1)


@dataclass
class Config:
    model: str = os.getenv("BANK_AGENT_MODEL", "claude-opus-5-5")
    data_dir: Path = Path(os.getenv("BANK_AGENT_DATA", ROOT / "data" / "bank"))
    products_file: Path = Path(os.getenv("BANK_PRODUCTS_FILE", ROOT / "data" / "bank" / "products.json"))
    timezone: str = os.getenv("BANK_TZ", "Europe/Moscow")

    # --- Цель ---------------------------------------------------------------
    goal: int = _int("BANK_GOAL", 100)
    # Дедлайн цели (ГГГГ-ММ-ДД). По умолчанию — последний день текущего месяца.
    goal_deadline: str = os.getenv("BANK_GOAL_DEADLINE", "")

    # --- Воронка: стартовые допущения, пока нет своей статистики ------------
    # Клик → заявка. Обзоры партнёрок дают 10–15% для тёплого трафика.
    cr_click_to_app: float = _float("BANK_CR_CLICK_APP", 0.12)
    # Заявка → засчитанное банком действие (выдача/активация). Обычно 30–40%.
    cr_app_to_conv: float = _float("BANK_CR_APP_CONV", 0.35)
    # Средняя цена клика в посевах (Telegram/MAX/VK), чтобы оценить бюджет.
    avg_cpc_rub: float = _float("BANK_AVG_CPC_RUB", 25)

    # --- Контент ------------------------------------------------------------
    # Сколько материалов в день на каждый канал. dzen и shorts — черновики
    # для ручной публикации (у площадок нет открытого API для этого).
    channel_posts: dict[str, int] = field(
        default_factory=lambda: _channel_posts(
            os.getenv("BANK_CHANNEL_POSTS", "telegram:2,vk:2,max:2,dzen:1,shorts:2")
        )
    )
    # Время выхода постов (местное). Посты дня раскладываются по этим слотам.
    post_times: list[str] = field(default_factory=lambda: _list("BANK_POST_TIMES", "09:30,13:00,19:30"))
    # Доля постов на «разведку» — каналы/продукты, по которым мало данных.
    explore_share: float = _float("BANK_EXPLORE_SHARE", 0.25)
    # Вторая проверка постов моделью (недостоверные обещания, выдуманные условия).
    llm_review: bool = _bool("BANK_LLM_REVIEW", True)
    # Без токена erid реклама в Рунете незаконна. 0 — на свой риск.
    require_erid: bool = _bool("BANK_REQUIRE_ERID", True)
    # 1 — ничего не публиковать, только готовить посты (для первой проверки).
    dry_run: bool = _bool("BANK_DRY_RUN", True)
    research: bool = _bool("BANK_RESEARCH", True)
    research_max_searches: int = _int("BANK_RESEARCH_MAX_SEARCHES", 12)

    # --- Трекинг кликов -----------------------------------------------------
    # Публичный адрес сервера `serve` (например https://go.example.ru). Пусто —
    # ссылки ведут прямо на партнёрскую ссылку (клики тогда не считаются).
    tracker_url: str = os.getenv("BANK_TRACKER_URL", "").rstrip("/")
    tracker_host: str = os.getenv("BANK_TRACKER_HOST", "0.0.0.0")
    tracker_port: int = _int("BANK_TRACKER_PORT", 8080)
    # Соль для обезличивания id пользователей и IP в базе.
    salt: str = os.getenv("BANK_SALT", "change-me")

    # --- Каналы публикации ----------------------------------------------------
    telegram_bot_token: str = os.getenv("TELEGRAM_BOT_TOKEN", "")
    telegram_channel: str = os.getenv("TELEGRAM_CHANNEL", "")  # @mychannel или -100…
    max_bot_token: str = os.getenv("MAX_BOT_TOKEN", "")
    max_api_base: str = os.getenv("MAX_API_BASE", "https://platform-api2.max.ru").rstrip("/")
    max_channel_id: str = os.getenv("MAX_CHANNEL_ID", "")
    vk_user_token: str = os.getenv("VK_USER_TOKEN", "")  # для публикации на стене сообщества
    vk_group_token: str = os.getenv("VK_GROUP_TOKEN", "")  # для бота в сообщениях сообщества
    vk_group_id: str = os.getenv("VK_GROUP_ID", "")  # число без минуса
    vk_api_version: str = os.getenv("VK_API_VERSION", "5.199")

    # --- Бот-консультант ------------------------------------------------------
    bots: list[str] = field(default_factory=lambda: _list("BANK_BOTS", "telegram,max,vk"))
    bot_daily_limit: int = _int("BANK_BOT_DAILY_LIMIT", 40)  # сообщений к ИИ на человека в день
    bot_history: int = _int("BANK_BOT_HISTORY", 12)
    # Владелец: куда слать отчёты и кто может вводить /conv, /stats.
    admin_telegram: list[str] = field(default_factory=lambda: _list("BANK_ADMIN_TELEGRAM"))
    admin_max: list[str] = field(default_factory=lambda: _list("BANK_ADMIN_MAX"))
    admin_vk: list[str] = field(default_factory=lambda: _list("BANK_ADMIN_VK"))
    # Как подписываться: агент — помощник независимого партнёра, не банк.
    owner_name: str = os.getenv("BANK_OWNER_NAME", "")

    def deadline(self, today: dt.date) -> dt.date:
        if self.goal_deadline:
            return dt.date.fromisoformat(self.goal_deadline)
        return _end_of_month(today)

    def admins(self, platform: str) -> list[str]:
        return {"telegram": self.admin_telegram, "max": self.admin_max, "vk": self.admin_vk}.get(platform, [])


CONFIG = Config()
