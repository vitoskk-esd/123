"""Запуск: python -m bot  (из папки earn-bot, с заполненным .env)."""
import asyncio
import logging

from aiogram import Bot, Dispatcher
from aiogram.client.default import DefaultBotProperties
from aiogram.enums import ParseMode
from aiogram.fsm.storage.memory import MemoryStorage

from . import admin, reminders, user
from .config import get_config
from .ctx import Ctx
from .db import DB
from .offers import load_catalog


def build_dispatcher(ctx: Ctx) -> Dispatcher:
    dp = Dispatcher(storage=MemoryStorage(), ctx=ctx)
    dp.include_router(admin.router)   # админские команды раньше пользовательских
    dp.include_router(user.router)
    return dp


async def main() -> None:
    logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")
    cfg = get_config()
    if not cfg.token:
        raise SystemExit("Нет BOT_TOKEN в .env — создай бота у @BotFather и впиши токен.")
    if not cfg.admins:
        logging.warning("ADMIN_IDS пуст — заявки некому одобрять. Узнай свой id у @userinfobot.")
    ctx = Ctx(db=await DB(cfg.db_path).open(), cfg=cfg, catalog=load_catalog(cfg.offers_path))
    bot = Bot(cfg.token, default=DefaultBotProperties(parse_mode=ParseMode.HTML))
    dp = build_dispatcher(ctx)
    task = asyncio.create_task(reminders.loop(bot, ctx))
    try:
        await dp.start_polling(bot)
    finally:
        task.cancel()
        await ctx.db.close()


if __name__ == "__main__":
    asyncio.run(main())
