"""Запуск бота: python -m kwork_bot"""

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
    if not os.getenv("ANTHROPIC_API_KEY"):
        print("Внимание: нет ANTHROPIC_API_KEY — бот запустится, но не сможет писать тексты.")
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


if __name__ == "__main__":
    logging.basicConfig(level=logging.WARNING)
    sys.exit(asyncio.run(main()))
