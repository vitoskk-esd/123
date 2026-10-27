"""Фон раз в 30 секунд: проверка платежей и напоминания «пробный период / доступ заканчивается».
Каждое напоминание уходит один раз — отметка в таблице marks. Без ЮKassa (тестовый режим) ничего не делает."""
import asyncio
import logging
import time

from aiogram import Bot
from aiogram.exceptions import TelegramForbiddenError

import keyboards as K
import plans
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
    now = now or time.time()
    all_plans = plans.plans(ctx.cfg)
    # оплатил, но не нажал «Я оплатил» — продлеваем сами
    for p in await ctx.db.pending_payments():
        try:
            until = await apply_payment(ctx, p["user_id"], p["yk_id"], await ctx.pay.status(p["yk_id"]))
        except Exception as e:
            log.info("статус платежа %s: %s", p["yk_id"], e)
            continue
        if until:
            await send(bot, ctx, p["user_id"], T.PAY_OK.format(plan=all_plans[p["plan"] or "basic"].title, until=fmt_date(until)))
    # тариф скоро закончится: пробный день — за 3 часа, месячный — за сутки
    for u in await ctx.db.users("paid_until>? AND paid_until<?", now, now + DAY):
        plan = all_plans.get(u["plan"] or "basic", all_plans["basic"])
        if plan.id == "trial" and u["paid_until"] - now > 3 * 3600:
            continue
        if await ctx.db.mark_once(f"ends:{u['id']}:{int(u['paid_until'])}"):
            s = await ctx.db.user_stats(u["id"], now - 30 * DAY)
            when = "Через 3 часа" if plan.id == "trial" else "Завтра"
            # после пробного дня предлагаем «Простой» и PRO, иначе — продлить свой тариф или перейти на PRO
            buttons = K.plans(all_plans, False) if plan.id == "trial" else K.plans(all_plans, False, only=plan.id)
            await send(bot, ctx, u["id"], T.ACCESS_ENDS.format(when=when, plan=plan.title, n=s["n"], good=s["good"]), buttons)
    # доступ закончился
    for u in await ctx.db.users("MAX(trial_until, paid_until)<? AND MAX(trial_until, paid_until)>?", now, now - 2 * DAY):
        end = int(max(u["trial_until"], u["paid_until"]))
        if await ctx.db.mark_once(f"ended:{u['id']}:{end}"):
            await send(bot, ctx, u["id"], T.ACCESS_ENDED, K.plans(all_plans, not u["trial_used"]))


async def loop(bot: Bot, ctx: Ctx) -> None:
    while True:
        try:
            await tick(bot, ctx)
        except Exception:
            log.exception("фоновая задача упала")
        await asyncio.sleep(30)
