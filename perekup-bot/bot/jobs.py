"""Фоновые задачи раз в 30 секунд: статусы платежей, автопродление, конец пробного периода и доступа,
«ты пропустил N машин» для тех, у кого нет доступа, итоги недели по понедельникам.
Каждое сообщение уходит один раз — отметка в таблице marks."""
import asyncio
import logging
import time
from datetime import datetime, timedelta, timezone

from aiogram import Bot
from aiogram.exceptions import TelegramForbiddenError

from . import keyboards as K
from . import texts as T
from .ctx import Ctx
from .db import DAY
from .user import apply_payment, fmt_date, stats_values

log = logging.getLogger(__name__)
MSK = timezone(timedelta(hours=3))
MISSED_NUDGES = 5          # сколько раз напомнить о пропущенных машинах, потом тишина


async def send(bot: Bot, ctx: Ctx, uid: int, text: str, markup=None) -> bool:
    try:
        await bot.send_message(uid, text, reply_markup=markup)
        return True
    except TelegramForbiddenError:
        await ctx.db.mark_blocked(uid)
    except Exception as e:
        log.warning("сообщение %s не отправлено: %s", uid, e)
    return False


async def check_payments(bot: Bot, ctx: Ctx) -> None:
    if not ctx.pay or not ctx.pay.enabled:
        return
    for p in await ctx.db.pending_payments():
        try:
            status, method = await ctx.pay.status(p["yk_id"])
        except Exception as e:
            log.info("статус платежа %s: %s", p["yk_id"], e)
            continue
        until = await apply_payment(ctx, p["user_id"], p["yk_id"], status, method)
        if until:
            await send(bot, ctx, p["user_id"], (T.RENEW_OK if p["auto"] else T.PAY_OK).format(until=fmt_date(until)))
        elif status == "canceled" and p["auto"]:
            await send(bot, ctx, p["user_id"], T.RENEW_FAIL, K.pay(ctx.cfg.price))


async def renewals(bot: Bot, ctx: Ctx, now: float) -> None:
    """Автопродление за сутки до конца доступа: одна попытка на каждый оплаченный период."""
    if not ctx.pay or not ctx.pay.enabled or not ctx.cfg.autopay:
        return
    for u in await ctx.db.users("autopay=1 AND pm_id!='' AND paid_until>? AND paid_until<?", now, now + DAY):
        if not await ctx.db.mark_once(f"renew:{u['id']}:{int(u['paid_until'])}"):
            continue
        try:
            pid, _ = await ctx.pay.charge(u["id"], u["pm_id"], u["email"])
            await ctx.db.add_payment(u["id"], pid, ctx.cfg.price, auto=True)
        except Exception as e:
            log.warning("автопродление %s не прошло: %s", u["id"], e)
            await send(bot, ctx, u["id"], T.RENEW_FAIL, K.pay(ctx.cfg.price))


async def access_reminders(bot: Bot, ctx: Ctx, now: float) -> None:
    c = ctx.cfg
    # пробный период кончается завтра — показываем, что он уже дал
    for u in await ctx.db.users("paid_until<? AND trial_until>? AND trial_until<?", now, now, now + DAY):
        if await ctx.db.mark_once(f"trial_ends:{u['id']}"):
            s = await ctx.db.user_stats(u["id"], u["created_at"])
            await send(bot, ctx, u["id"], T.TRIAL_ENDS.format(n=s["n"], good=s["good"], price=c.price, days=c.period_days),
                       K.pay(c.price))
    # доступ закончился (пробный или оплаченный, без автопродления)
    for u in await ctx.db.users("MAX(trial_until, paid_until)<? AND MAX(trial_until, paid_until)>? "
                                "AND NOT (autopay=1 AND pm_id!='')", now, now - 2 * DAY):   # с автопродлением — своё сообщение
        end = int(max(u["trial_until"], u["paid_until"]))
        if await ctx.db.mark_once(f"ended:{u['id']}:{end}"):
            await ctx.db.set_user(u["id"], missed=0, missed_good=0)
            await send(bot, ctx, u["id"], T.ACCESS_ENDED.format(price=c.price, days=c.period_days), K.pay(c.price))


async def missed_nudges(bot: Bot, ctx: Ctx, now: float) -> None:
    """Раз в день в 12:00 по Москве: «пока нет подписки, вышло N машин под твои фильтры»."""
    msk = datetime.fromtimestamp(now, MSK)
    if msk.hour != 12:
        return
    day = msk.strftime("%Y-%m-%d")
    for u in await ctx.db.users("MAX(trial_until, paid_until)<? AND missed>=3", now):
        sent = (await ctx.db._one("SELECT COUNT(*) n FROM marks WHERE key LIKE ?", f"missed:{u['id']}:%"))["n"]
        if sent < MISSED_NUDGES and await ctx.db.mark_once(f"missed:{u['id']}:{day}"):
            await send(bot, ctx, u["id"], T.MISSED_NUDGE.format(n=u["missed"], good=u["missed_good"], price=ctx.cfg.price),
                       K.pay(ctx.cfg.price))


async def weekly(bot: Bot, ctx: Ctx, now: float) -> None:
    """Понедельник, 10:00 по Москве: итоги недели тем, у кого есть доступ и были машины."""
    msk = datetime.fromtimestamp(now, MSK)
    if msk.weekday() != 0 or msk.hour != 10:
        return
    week = msk.strftime("%G-%V")
    for u in await ctx.db.users("MAX(trial_until, paid_until)>?", now):
        v = await stats_values(ctx, u["id"])
        if v["n7"] and await ctx.db.mark_once(f"weekly:{u['id']}:{week}"):
            await send(bot, ctx, u["id"], T.WEEKLY.format(**v))
            await asyncio.sleep(0.05)


async def tick(bot: Bot, ctx: Ctx, now: float | None = None) -> None:
    now = now or time.time()
    for job in (check_payments(bot, ctx), renewals(bot, ctx, now), access_reminders(bot, ctx, now),
                missed_nudges(bot, ctx, now), weekly(bot, ctx, now)):
        try:
            await job
        except Exception:
            log.exception("фоновая задача упала")


async def loop(bot: Bot, ctx: Ctx) -> None:
    while True:
        await tick(bot, ctx)
        await asyncio.sleep(30)
