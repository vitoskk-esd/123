"""Запуск бота: python -m kwork_bot (без ключей сначала откроется мастер настройки)

    python -m kwork_bot setup   # заново пройти настройку ключей
"""

from __future__ import annotations

import asyncio
import logging
import os
import sys

from aiogram import Bot, Dispatcher
from aiogram.client.default import DefaultBotProperties
from aiogram.types import BotCommand

from .bot import router
from .config import BOT_CONFIG


async def main() -> int:
    if not BOT_CONFIG.token:
        print("Нет токена бота. Создайте бота в @BotFather и впишите KWORK_BOT_TOKEN в .env")
        return 2
    if BOT_CONFIG.llm == "claude" and not os.getenv("ANTHROPIC_API_KEY"):
        print("Внимание: нет ANTHROPIC_API_KEY — бот запустится, но не сможет писать тексты.")
    print(f"Тексты пишет: {BOT_CONFIG.llm} ({BOT_CONFIG.model}), обложки: {BOT_CONFIG.images}.")
    if not BOT_CONFIG.images_enabled:
        print("Нет HF_KEY — обложки будут простыми градиентными (без ИИ-фонов Higgsfield).")
    if not BOT_CONFIG.payments_enabled:
        print("ЮKassa не настроена (YOOKASSA_SHOP_ID / YOOKASSA_SECRET_KEY): оплата выключена, "
              "бесплатный доступ — только у владельца.")
    bot = Bot(BOT_CONFIG.token, default=DefaultBotProperties(parse_mode="HTML"))
    dp = Dispatcher()
    dp.include_router(router)
    await bot.set_my_commands([BotCommand(command="start", description="Главное меню")])
    me = await bot.get_me()
    print(f"Бот @{me.username} запущен. Остановить — Ctrl+C.")
    await dp.start_polling(bot)
    return 0


def apply_env() -> None:
    """Настройки читаются при импорте — после мастера подхватываем свежие ключи."""
    BOT_CONFIG.token = os.getenv("KWORK_BOT_TOKEN", "")
    BOT_CONFIG.hf_key = os.getenv("HF_KEY", "")
    BOT_CONFIG.gemini_key = os.getenv("GEMINI_API_KEY", "")
    BOT_CONFIG.return_url = os.getenv("KWORK_BOT_RETURN_URL", BOT_CONFIG.return_url)
    if BOT_CONFIG.hf_key and not os.getenv("KWORK_BOT_IMAGES"):
        BOT_CONFIG.images = "higgsfield"


if __name__ == "__main__":
    from .setup import needs_setup, run_setup

    if sys.argv[1:] == ["setup"] or needs_setup():
        try:
            run_setup()
        except (KeyboardInterrupt, EOFError):
            print("\nНастройка прервана.")
            sys.exit(1)
        apply_env()
        if sys.argv[1:] == ["setup"]:
            print("Запустить бота: python -m kwork_bot")
            sys.exit(0)
    logging.basicConfig(level=logging.WARNING)
    try:
        sys.exit(asyncio.run(main()))
    except KeyboardInterrupt:
        print("Бот остановлен.")
