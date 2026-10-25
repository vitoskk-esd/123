"""Настройки Telegram-бота. Берутся из переменных окружения (или файла .env в корне)."""

from __future__ import annotations

import os
from dataclasses import dataclass, field
from pathlib import Path

# kwork_agent.config при импорте подхватывает .env — используем тот же файл.
from kwork_agent.config import ROOT  # noqa: F401


def _ids(name: str) -> set[int]:
    return {int(x) for x in os.getenv(name, "").replace(" ", "").split(",") if x}


@dataclass
class BotConfig:
    token: str = os.getenv("KWORK_BOT_TOKEN", "")
    data_dir: Path = Path(os.getenv("KWORK_BOT_DATA", ROOT / "data" / "bot"))
    # Тексты кворков (их много) — самая дешёвая модель Haiku. Идеи и разбор образцов
    # (несколько запросов на человека) — Sonnet: от них зависит качество всей партии.
    model: str = os.getenv("KWORK_BOT_MODEL", "claude-haiku-5-5")
    ideas_model: str = os.getenv("KWORK_BOT_IDEAS_MODEL", "claude-sonnet-5-5")
    effort: str = os.getenv("KWORK_BOT_EFFORT", "medium")

    # Картинки: несколько ИИ-фонов на человека (Higgsfield API), текст поверх рисуется бесплатно.
    hf_key: str = os.getenv("HF_KEY", "")  # формат key-id:key-secret
    # higgsfield — ИИ-фоны, template — только градиенты (бесплатно). По умолчанию higgsfield, если есть ключ.
    images: str = os.getenv("KWORK_BOT_IMAGES", "higgsfield" if os.getenv("HF_KEY") else "template")
    # Recraft V4.1 ($0.035) выиграл пробу 25.10: чистые фоны без надписей. Z-Image ($0.015) и
    # Soul 2 ($0.006) дешевле, но рисовали «каракули» вместо текста.
    image_model: str = os.getenv("KWORK_BOT_IMAGE_MODEL", "recraft/v4.1/text-to-image")
    backgrounds: int = int(os.getenv("KWORK_BOT_BACKGROUNDS", "4"))
    # Сколько запросов к модели идёт одновременно при генерации текстов.
    parallel: int = int(os.getenv("KWORK_BOT_PARALLEL", "6"))
    max_listings: int = int(os.getenv("KWORK_BOT_MAX_LISTINGS", "300"))

    # Доступ: админы пользуются бесплатно. Если список пуст — владельцем станет
    # первый, кто напишет боту /start (он сохраняется в data/bot/owner.json).
    admins: set[int] = field(default_factory=lambda: _ids("KWORK_BOT_ADMINS"))
    # 1 — все пользуются бесплатно (для бета-теста с друзьями).
    free_access: bool = os.getenv("KWORK_BOT_FREE_ACCESS", "0") in ("1", "true", "yes")

    # ЮKassa: shopId и секретный ключ из личного кабинета yookassa.ru → Интеграция → Ключи API.
    yookassa_shop_id: str = os.getenv("YOOKASSA_SHOP_ID", "")
    yookassa_secret: str = os.getenv("YOOKASSA_SECRET_KEY", "")
    price_rub: int = int(os.getenv("KWORK_BOT_PRICE_RUB", "3000"))
    # Куда вернуть человека после оплаты (обычно ссылка на бота: https://t.me/имя_бота).
    return_url: str = os.getenv("KWORK_BOT_RETURN_URL", "https://t.me")
    # 1 — отправлять чеки по 54-ФЗ через ЮKassa (бот спросит e-mail покупателя перед оплатой).
    receipts: bool = os.getenv("YOOKASSA_RECEIPTS", "0") in ("1", "true", "yes")

    @property
    def images_enabled(self) -> bool:
        return self.images == "higgsfield" and self.backgrounds > 0

    @property
    def payments_enabled(self) -> bool:
        return bool(self.yookassa_shop_id and self.yookassa_secret)


BOT_CONFIG = BotConfig()
