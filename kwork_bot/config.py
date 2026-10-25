"""Настройки Telegram-бота. Берутся из переменных окружения (или файла .env в корне)."""

from __future__ import annotations

import os
from dataclasses import dataclass, field
from pathlib import Path

# kwork_agent.config при импорте подхватывает .env — используем тот же файл.
from kwork_agent.config import ROOT  # noqa: F401


def _ids(name: str) -> set[int]:
    return {int(x) for x in os.getenv(name, "").replace(" ", "").split(",") if x}


# Кто пишет тексты: gemini (по умолчанию; в облачной среде ключ уже подключён) или claude.
_LLM = os.getenv("KWORK_BOT_LLM", "gemini")
_GEMINI = _LLM == "gemini"


@dataclass
class BotConfig:
    token: str = os.getenv("KWORK_BOT_TOKEN", "")
    data_dir: Path = Path(os.getenv("KWORK_BOT_DATA", ROOT / "data" / "bot"))
    llm: str = _LLM
    # Тексты кворков (их много) — быстрая дешёвая модель; идеи и разбор образцов (несколько
    # запросов на человека) — та же Gemini с «высоким» размышлением или Claude Sonnet.
    model: str = os.getenv("KWORK_BOT_MODEL", "gemini-3.5-flash" if _GEMINI else "claude-haiku-5-5")
    ideas_model: str = os.getenv("KWORK_BOT_IDEAS_MODEL", "gemini-3.5-flash" if _GEMINI else "claude-sonnet-5-5")
    # Gemini: если модель перегружена (503) — пробуем следующие. Проверено 25.10: отвечали все три,
    # но то одна, то другая выдавала 503/502.
    fallback_models: list[str] = field(default_factory=lambda: [
        m for m in os.getenv("KWORK_BOT_FALLBACK_MODELS",
                             "gemini-3-flash-preview,gemini-flash-lite-latest").split(",") if m])
    # Ключ Gemini из aistudio.google.com. В облачной среде Claude Code его подставляет прокси — можно не задавать.
    gemini_key: str = os.getenv("GEMINI_API_KEY", "")
    effort: str = os.getenv("KWORK_BOT_EFFORT", "medium")

    # Картинки: несколько ИИ-фонов на клиента (Higgsfield API), обработка и текст поверх — бесплатно.
    hf_key: str = os.getenv("HF_KEY", "")  # формат key-id:key-secret
    # higgsfield — ИИ-фоны, template — только градиенты (бесплатно). По умолчанию higgsfield, если есть ключ.
    images: str = os.getenv("KWORK_BOT_IMAGES", "higgsfield" if os.getenv("HF_KEY") else "template")
    # Recraft V4.1 ($0.035) выиграл пробу 25.10: чистые фоны без надписей. Z-Image ($0.015) и
    # Soul 2 ($0.006) дешевле, но рисовали «каракули» вместо текста.
    image_model: str = os.getenv("KWORK_BOT_IMAGE_MODEL", "recraft/v4.1/text-to-image")
    # Сколько общих ИИ-фонов на клиента; уникальной каждую обложку делает обработка фона.
    backgrounds: int = int(os.getenv("KWORK_BOT_BACKGROUNDS", "4"))
    # Сколько запросов к модели идёт одновременно при генерации текстов.
    parallel: int = int(os.getenv("KWORK_BOT_PARALLEL", "6"))
    max_listings: int = int(os.getenv("KWORK_BOT_MAX_LISTINGS", "300"))
    # Сколько кворков Kwork разрешает держать одному продавцу (вместе с уже имеющимися).
    kwork_limit: int = int(os.getenv("KWORK_LIMIT", "300"))

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
