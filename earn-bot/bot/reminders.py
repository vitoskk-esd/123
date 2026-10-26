"""Фоновые напоминания: раз в минуту отправляет созревшие дожимы (nudge), напоминания об условии банка (cond) и «застрял до квиза» (stall)."""
import asyncio
import logging

from aiogram import Bot
from aiogram.exceptions import TelegramForbiddenError

from . import keyboards as K
from . import texts as T
from .ctx import Ctx

log = logging.getLogger(__name__)


async def message_for(r, ctx: Ctx) -> tuple[str, object] | None:
    """Текст и клавиатура напоминания или None, если оно уже не нужно."""
    if r["kind"] == "stall":
        user = await ctx.db.user(r["user_id"])
        return (T.STALL, None) if user and not user["consent"] else None
    o = ctx.catalog.get(r["offer_id"])
    if not o or not o.active:
        return None
    if r["kind"] == "nudge":
        if await ctx.db.has_claim(r["user_id"], o.id):
            return None
        sent = await ctx.db.sent_count(r["user_id"], "nudge", o.id) - 1   # текущее уже помечено отправленным
        text = T.NUDGE[min(max(sent, 0), len(T.NUDGE) - 1)]
        return text.format(bank=o.bank, title=o.title, payout=o.payout), K.link(o)
    if r["kind"] == "cond":
        return T.CONDITION_REMINDER.format(bank=o.bank, condition=o.condition or "условие акции"), None
    return None


async def tick(bot: Bot, ctx: Ctx) -> int:
    sent = 0
    for r in await ctx.db.due_reminders():
        await ctx.db.mark_sent(r["id"])
        msg = await message_for(r, ctx)
        if not msg:
            continue
        try:
            await bot.send_message(r["user_id"], msg[0], reply_markup=msg[1])
            sent += 1
        except TelegramForbiddenError:
            await ctx.db.mark_blocked(r["user_id"])
        except Exception as e:
            log.warning("напоминание %s не отправлено: %s", r["id"], e)
        await asyncio.sleep(0.05)
    return sent


async def loop(bot: Bot, ctx: Ctx) -> None:
    while True:
        try:
            await tick(bot, ctx)
        except Exception:
            log.exception("ошибка в цикле напоминаний")
        await asyncio.sleep(60)
