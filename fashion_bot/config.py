"""Настройки бота. Всё берётся из переменных окружения (или файла .env в корне репозитория)."""

from __future__ import annotations

import os
from dataclasses import dataclass
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
    return int(os.getenv(name) or default)


def _float(name: str, default: float) -> float:
    return float(os.getenv(name) or default)


def _bool(name: str, default: bool) -> bool:
    return (os.getenv(name) or ("1" if default else "0")).lower() in ("1", "true", "yes", "on")


def _str(name: str, default: str = "") -> str:
    return os.getenv(name) or default


@dataclass
class Config:
    model: str = _str("FASHION_BOT_MODEL", "claude-opus-5-5")
    data_dir: Path = Path(_str("FASHION_BOT_DATA", str(ROOT / "data" / "fashion_bot")))
    sources_file: Path = Path(_str("FASHION_SOURCES_FILE", str(Path(__file__).parent / "sources.txt")))

    # --- О магазине и канале ---------------------------------------------
    shop_name: str = _str("SHOP_NAME", "MY BRAND STORE")
    # Строка в конце каждого поста, например «Оригиналы в наличии и под заказ — @my_shop».
    shop_cta: str = _str("SHOP_CTA")
    # О чём канал: по этому описанию Claude отбирает новости.
    focus: str = _str(
        "FASHION_FOCUS",
        "брендовая оригинальная одежда и обувь: релизы и коллаборации кроссовок (Nike, Jordan, "
        "adidas, New Balance, Asics, Salomon и др.), стритвир (Supreme, Stüssy, Palace, "
        "Carhartt WIP и др.), люкс и премиум (Louis Vuitton, Prada, Balenciaga, Loewe, "
        "Moncler, Stone Island и др.), новые коллекции, дропы, тренды, громкие новости брендов",
    )
    language: str = _str("FASHION_LANGUAGE", "русский")
    # Указывать источник в посте (рекомендуется: фото и новости принадлежат изданиям).
    source_credit: bool = _bool("FASHION_SOURCE_CREDIT", True)
    telegram_hashtags: int = _int("TELEGRAM_HASHTAGS", 3)
    instagram_hashtags: int = _int("INSTAGRAM_HASHTAGS", 15)

    # --- Сколько и когда публиковать ---------------------------------------
    posts_per_cycle: int = _int("FASHION_POSTS_PER_CYCLE", 1)
    max_posts_per_day: int = _int("FASHION_MAX_POSTS_PER_DAY", 6)
    # Новости старше этого не берём.
    max_age_hours: int = _int("FASHION_MAX_AGE_HOURS", 36)
    # Режим `run`: раз в сколько минут выходить с постом и в какие часы.
    interval_min: int = _int("FASHION_INTERVAL_MIN", 120)
    active_hours: str = _str("FASHION_ACTIVE_HOURS", "9-22")
    timezone: str = _str("FASHION_TZ", "Europe/Moscow")
    # 1 — ничего не публиковать: готовые посты сохраняются в data/fashion_bot/previews
    # и (если задан TELEGRAM_ADMIN_CHAT) присылаются вам в личку для проверки.
    dry_run: bool = _bool("FASHION_DRY_RUN", False)

    # --- Фото --------------------------------------------------------------
    images_per_post: int = _int("FASHION_IMAGES_PER_POST", 4)
    min_image_side: int = _int("FASHION_MIN_IMAGE_SIDE", 600)
    max_image_candidates: int = _int("FASHION_MAX_IMAGE_CANDIDATES", 10)
    # portrait — 1080×1350 (4:5, больше места в ленте), square — 1080×1080.
    instagram_format: str = _str("INSTAGRAM_FORMAT", "portrait")
    # pad — фото целиком, поля цветом краёв фото; blur — поля из размытого фото; crop — обрезать.
    instagram_fit: str = _str("INSTAGRAM_FIT", "pad")

    # --- Водяной знак ------------------------------------------------------
    # PNG-логотип с прозрачным фоном. Если не задан — пишется текст watermark_text.
    watermark_logo: str = _str("WATERMARK_LOGO")
    watermark_text: str = _str("WATERMARK_TEXT")  # по умолчанию — SHOP_NAME
    watermark_font: str = _str("WATERMARK_FONT")
    # bottom-right | bottom-left | top-right | top-left | center | tile
    watermark_position: str = _str("WATERMARK_POSITION", "bottom-right")
    watermark_opacity: float = _float("WATERMARK_OPACITY", 0.8)
    # Ширина знака относительно меньшей стороны фото.
    watermark_scale: float = _float("WATERMARK_SCALE", 0.28)
    watermark_margin: float = _float("WATERMARK_MARGIN", 0.035)

    # --- Telegram ----------------------------------------------------------
    telegram_token: str = _str("TELEGRAM_BOT_TOKEN")
    telegram_channel: str = _str("TELEGRAM_CHANNEL")  # @my_channel или -100…
    # Ваш личный chat id: сюда приходят ошибки и посты в режиме проверки.
    telegram_admin_chat: str = _str("TELEGRAM_ADMIN_CHAT")

    # --- Instagram (официальный API, профессиональный аккаунт) -------------
    instagram_user_id: str = _str("INSTAGRAM_USER_ID")
    instagram_token: str = _str("INSTAGRAM_ACCESS_TOKEN")
    # graph.instagram.com — вход через Instagram; graph.facebook.com — через Facebook-страницу.
    instagram_host: str = _str("INSTAGRAM_API_HOST", "graph.instagram.com")
    instagram_api_version: str = _str("INSTAGRAM_API_VERSION", "v25.0")
    # Instagram скачивает фото по публичной ссылке, поэтому их нужно куда-то выложить:
    # imgbb — бесплатный хостинг (нужен IMGBB_API_KEY), local — своя папка на веб-сервере.
    image_host: str = _str("IMAGE_HOST", "imgbb")
    imgbb_key: str = _str("IMGBB_API_KEY")
    public_image_dir: str = _str("PUBLIC_IMAGE_DIR")
    public_image_base_url: str = _str("PUBLIC_IMAGE_BASE_URL")

    @property
    def telegram_enabled(self) -> bool:
        return bool(self.telegram_token and self.telegram_channel)

    @property
    def instagram_enabled(self) -> bool:
        return bool(self.instagram_user_id and self.instagram_token)

    @property
    def mark_text(self) -> str:
        return self.watermark_text or self.shop_name


CONFIG = Config()
