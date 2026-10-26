"""Фон раз в 30 секунд: проверка платежей и напоминания «пробный период / доступ заканчивается».
Каждое напоминание уходит один раз — отметка в таблице marks. Без ЮKassa (тестовый режим) ничего не делает."""
import asyncio
import logging
import time

from aiogram import Bot
from aiogram.exceptions import TelegramForbiddenError

import keyboards as K
import texts as T
from ctx import Ctx
from db import DAY
from user import apply_payment, fmt_date

log = logging.getLogger(__name__)


async def send(bot: Bot, ctx: Ctx, uid: int, text: str, markup=None) -> None:
    try:
        await bot.send_message(uid, text, reply_markup=markup)
    except TelegramForbiddenError:
        await ctx.db.mark_blocked(uid)
    except Exception as e:
        log.warning("сообщение %s не отправлено: %s", uid, e)


async def tick(bot: Bot, ctx: Ctx, now: float | None = None) -> None:
    if not ctx.cfg.payments_on:
        return
    now, c = now or time.time(), ctx.cfg
    # оплатил, но не нажал «Я оплатил» — продлеваем сами
    for p in await ctx.db.pending_payments():
        try:
            until = await apply_payment(ctx, p["user_id"], p["yk_id"], await ctx.pay.status(p["yk_id"]))
        except Exception as e:
            log.info("статус платежа %s: %s", p["yk_id"], e)
            continue
        if until:
            await send(bot, ctx, p["user_id"], T.PAY_OK.format(until=fmt_date(until)))
    # доступ заканчивается завтра
    for u in await ctx.db.users("MAX(trial_until, paid_until)>? AND MAX(trial_until, paid_until)<?", now, now + DAY):
        end = int(max(u["trial_until"], u["paid_until"]))
        if await ctx.db.mark_once(f"ends:{u['id']}:{end}"):
            s = await ctx.db.user_stats(u["id"], now - 30 * DAY)
            await send(bot, ctx, u["id"], T.ACCESS_ENDS.format(n=s["n"], good=s["good"], price=c.price, days=c.period_days),
                       K.pay(c.price))
    # доступ закончился
    for u in await ctx.db.users("MAX(trial_until, paid_until)<? AND MAX(trial_until, paid_until)>?", now, now - 2 * DAY):
        end = int(max(u["trial_until"], u["paid_until"]))
        if await ctx.db.mark_once(f"ended:{u['id']}:{end}"):
            await send(bot, ctx, u["id"], T.ACCESS_ENDED.format(price=c.price, days=c.period_days), K.pay(c.price))


async def loop(bot: Bot, ctx: Ctx) -> None:
    while True:
        try:
            await tick(bot, ctx)
        except Exception:
            log.exception("фоновая задача упала")
        await asyncio.sleep(30)
