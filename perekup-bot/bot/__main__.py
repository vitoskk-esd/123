"""Запуск (из папки perekup-bot, с заполненным .env) — или просто двойной клик по файлу «Запуск»:
  python -m bot          — бот + чтение каналов
  python -m bot login    — один раз: войти в служебный аккаунт (телефон и код из Telegram)
"""
import asyncio
import logging
import sys

from aiogram import Bot, Dispatcher
from aiogram.client.default import DefaultBotProperties
from aiogram.enums import ParseMode
from aiogram.fsm.storage.memory import MemoryStorage

from . import admin, jobs, user
from .config import get_config
from .ctx import Ctx
from .db import DB
from .payments import YooKassa
from .words import load_dictionary

log = logging.getLogger("bot")


def build_dispatcher(ctx: Ctx) -> Dispatcher:
    dp = Dispatcher(storage=MemoryStorage(), ctx=ctx)
    dp.include_router(admin.router)   # админские команды раньше пользовательских
    dp.include_router(user.router)
    return dp


async def main() -> None:
    logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")
    logging.getLogger("telethon").setLevel(logging.WARNING)
    cfg = get_config()
    if not cfg.api_id or not cfg.api_hash:
        raise SystemExit("Нет TG_API_ID / TG_API_HASH в .env — получи их на my.telegram.org → API development tools.")
    logging_in = sys.argv[1:2] == ["login"]
    if not cfg.token and not logging_in:
        raise SystemExit("Нет BOT_TOKEN в .env — создай бота у @BotFather и впиши токен.")
    ctx = Ctx(db=await DB(cfg.db_path).open(), cfg=cfg, dict=load_dictionary(cfg.cars_path), pay=YooKassa(cfg))
    from .userbot import Reader, login
    tasks = []
    try:   # базу закрываем при любом выходе — иначе программа не завершится
        if logging_in:
            return await login(ctx)
        if not cfg.payments_on:
            log.warning("ЮKassa не настроена — тестовый режим: бот бесплатный для всех.")
        bot = Bot(cfg.token, default=DefaultBotProperties(parse_mode=ParseMode.HTML))
        reader = Reader(bot, ctx)
        await reader.start()
        tasks = [asyncio.create_task(reader.run()), asyncio.create_task(jobs.loop(bot, ctx))]
        log.info("бот запущен — напиши ему /start в Telegram")
        await build_dispatcher(ctx).start_polling(bot)
    finally:
        for t in tasks:
            t.cancel()
        await ctx.db.close()


if __name__ == "__main__":
    asyncio.run(main())
