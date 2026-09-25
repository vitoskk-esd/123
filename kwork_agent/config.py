"""Настройки агента. Всё берётся из переменных окружения (или файла .env)."""

from __future__ import annotations

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


def _bool(name: str, default: bool) -> bool:
    return os.getenv(name, "1" if default else "0").lower() in ("1", "true", "yes", "on")


@dataclass
class Config:
    model: str = os.getenv("KWORK_AGENT_MODEL", "claude-opus-5")
    data_dir: Path = Path(os.getenv("KWORK_AGENT_DATA", ROOT / "data"))

    # Ниша, вокруг которой агент исследует рынок и пишет объявления.
    niche: str = os.getenv(
        "KWORK_NICHE",
        "автоматизация бизнес-процессов с помощью ИИ, контент-заводы на нейросетях, "
        "ИИ-агенты и чат-боты, генерация контента, парсинг и обработка данных с ИИ",
    )

    # Сколько объявлений в день: старт, прирост в день и потолок.
    # Прирост срабатывает только если вчера ≥ ramp_success_ratio публикаций прошли.
    start_per_day: int = _int("KWORK_START_PER_DAY", 15)
    daily_increase: int = _int("KWORK_DAILY_INCREASE", 3)
    max_per_day: int = _int("KWORK_MAX_PER_DAY", 45)
    ramp_success_ratio: float = float(os.getenv("KWORK_RAMP_SUCCESS_RATIO", "0.7"))
    # Сколько минут максимум тратить на публикацию за прогон (лимит GitHub — 6 часов).
    publish_time_budget_min: int = _int("KWORK_PUBLISH_TIME_BUDGET_MIN", 300)

    # Ограничения полей кворка. Проверьте актуальные правила Kwork и при
    # необходимости поменяйте через переменные окружения.
    title_max: int = _int("KWORK_TITLE_MAX", 80)
    description_min: int = _int("KWORK_DESCRIPTION_MIN", 300)
    description_max: int = _int("KWORK_DESCRIPTION_MAX", 1200)
    requirements_max: int = _int("KWORK_REQUIREMENTS_MAX", 600)
    price_min: int = _int("KWORK_PRICE_MIN", 500)
    price_max: int = _int("KWORK_PRICE_MAX", 50000)

    # Kwork.
    kwork_base_url: str = os.getenv("KWORK_BASE_URL", "https://kwork.ru")
    kwork_new_url: str = os.getenv("KWORK_NEW_URL", "https://kwork.ru/new")
    kwork_login: str = os.getenv("KWORK_LOGIN", "")
    kwork_password: str = os.getenv("KWORK_PASSWORD", "")
    # True — агент заполняет форму, но не отправляет кворк на модерацию.
    dry_run: bool = _bool("KWORK_DRY_RUN", False)
    headless: bool = _bool("KWORK_HEADLESS", True)
    # Прикладывать скриншот страницы к каждому шагу браузерного агента
    # (точнее, но дороже).
    browser_screenshots: bool = _bool("KWORK_AGENT_SCREENSHOTS", True)
    browser_max_steps: int = _int("KWORK_AGENT_MAX_STEPS", 45)

    research_max_searches: int = _int("KWORK_RESEARCH_MAX_SEARCHES", 12)

    seed_topics: list[str] = field(
        default_factory=lambda: [
            "автоматизация бизнес-процессов нейросетями для малого бизнеса",
            "контент-завод на нейросетях: статьи, посты, видео, Reels",
            "ИИ-агенты и ассистенты для отдела продаж и поддержки",
            "n8n, Make, Zapier автоматизации с GPT/Claude",
            "Telegram-боты с ИИ для бизнеса",
            "ИИ-генерация карточек товаров для Wildberries и Ozon",
            "RAG база знаний компании на нейросети",
            "самые востребованные услуги по ИИ на фриланс-биржах Kwork, FL.ru, Upwork",
        ]
    )

    @property
    def state_file(self) -> Path:
        return self.data_dir / "kwork_state.json"


CONFIG = Config()
