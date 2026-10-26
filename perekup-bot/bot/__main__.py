"""Запуск (из папки perekup-bot, с заполненным .env):
  python -m bot                 — бот + чтение каналов + фоновые задачи
  python -m bot login main      — один раз: войти в служебный аккаунт (телефон и код из Telegram)
"""
import asyncio
import logging
import sys

import yaml
from aiogram import Bot, Dispatcher
from aiogram.client.default import DefaultBotProperties
from aiogram.enums import ParseMode
from aiogram.fsm.storage.memory import MemoryStorage

from . import admin, jobs, user
from .config import get_config
from .ctx import Ctx
from .db import DB
from .links import parse_link
from .payments import YooKassa
from .words import load_dictionary

log = logging.getLogger("bot")


def build_dispatcher(ctx: Ctx) -> Dispatcher:
    dp = Dispatcher(storage=MemoryStorage(), ctx=ctx)
    dp.include_router(admin.router)   # админские команды раньше пользовательских
    dp.include_router(user.router)
    return dp


async def seed_channels(ctx: Ctx) -> int:
    """channels.yaml → общая база (уже добавленные пропускаются)."""
    if not ctx.cfg.channels_path.exists():
        return 0
    data = yaml.safe_load(ctx.cfg.channels_path.read_text(encoding="utf-8")) or {}
    added = 0
    for item in data.get("channels") or []:
        link, region = (item, None) if isinstance(item, str) else (item.get("link", ""), item.get("region"))
        parsed = parse_link(str(link))
        if parsed:
            _, new = await ctx.db.add_channel(**{parsed[0]: parsed[1]}, region=region, base=True)
            added += new
    return added


async def main() -> None:
    logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")
    logging.getLogger("telethon").setLevel(logging.WARNING)
    cfg = get_config()
    ctx = Ctx(db=await DB(cfg.db_path).open(), cfg=cfg, dict=load_dictionary(cfg.cars_path), pay=YooKassa(cfg))
    if len(sys.argv) > 1 and sys.argv[1] == "login":
        from .userbot import login
        await login(sys.argv[2] if len(sys.argv) > 2 else cfg.sessions[0], ctx)
        return
    if not cfg.token:
        raise SystemExit("Нет BOT_TOKEN в .env — создай бота у @BotFather и впиши токен.")
    if not cfg.api_id or not cfg.api_hash:
        raise SystemExit("Нет TG_API_ID / TG_API_HASH — получи их на my.telegram.org → API development tools.")
    if not cfg.buffer_channel:
        log.warning("BUFFER_CHANNEL_ID не задан — люди получат карточку и текст поста, но без фото.")
    log.info("новых каналов из channels.yaml: %d", await seed_channels(ctx))

    from .userbot import Reader
    bot = Bot(cfg.token, default=DefaultBotProperties(parse_mode=ParseMode.HTML))
    reader = Reader(bot, ctx)
    ctx.reader = reader
    await reader.start()
    dp = build_dispatcher(ctx)
    tasks = [asyncio.create_task(reader.run()), asyncio.create_task(jobs.loop(bot, ctx))]
    try:
        await dp.start_polling(bot)
    finally:
        for t in tasks:
            t.cancel()
        await ctx.db.close()


if __name__ == "__main__":
    asyncio.run(main())
