"""Запуск: python main.py (в облаке Amvera — сам, по amvera.yml). Нужна одна переменная — BOT_TOKEN.
Служебный аккаунт подключается потом из чата с ботом: /connect."""
import asyncio
import logging

from aiogram import Bot, Dispatcher
from aiogram.client.default import DefaultBotProperties
from aiogram.enums import ParseMode
from aiogram.fsm.storage.memory import MemoryStorage

import admin
import connect
import jobs
import support
import user
from config import get_config
from ctx import Ctx
from db import DB
from payments import YooKassa
from words import load_dictionary

log = logging.getLogger("bot")


def build_dispatcher(ctx: Ctx) -> Dispatcher:
    dp = Dispatcher(storage=MemoryStorage(), ctx=ctx)
    dp.include_router(admin.router)   # админские команды раньше пользовательских
    dp.include_router(connect.router)
    dp.include_router(support.router)  # ответ админа на обращение — раньше, чем «свободный текст» пользователя
    dp.include_router(user.router)
    return dp


async def main() -> None:
    logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")
    logging.getLogger("telethon").setLevel(logging.WARNING)
    cfg = get_config()
    if not cfg.token:
        raise SystemExit("Нет BOT_TOKEN — впиши токен от @BotFather в переменные (в облаке) или в файл .env.")
    ctx = Ctx(db=await DB(cfg.db_path).open(), cfg=cfg, dict=load_dictionary(cfg.cars_path), pay=YooKassa(cfg))
    from userbot import Reader
    bot = Bot(cfg.token, default=DefaultBotProperties(parse_mode=ParseMode.HTML))
    ctx.reader = Reader(bot, ctx)
    if not cfg.payments_on:
        log.warning("ЮKassa не настроена — бот бесплатный для всех.")
    if not await ctx.reader.resume():
        log.warning("служебный аккаунт не подключён — напиши боту /start, потом /connect")
    jobs_task = asyncio.create_task(jobs.loop(bot, ctx))
    log.info("бот запущен — напиши ему /start в Telegram")
    try:
        await build_dispatcher(ctx).start_polling(bot)
    finally:
        jobs_task.cancel()
        await ctx.db.close()


if __name__ == "__main__":
    asyncio.run(main())
