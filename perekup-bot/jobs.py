"""Фон раз в 30 секунд: проверка платежей и напоминания «пробный период / доступ заканчивается».
Каждое напоминание уходит один раз — отметка в таблице marks. Без Робокассы (тестовый режим) ничего не делает."""
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
    if await ctx.db.mark_once("trial_reset_paid_13_11"):       # один раз: бравшим бесплатный пробный — можно купить платный
        log.info("пробный день снова доступен: %d", await ctx.db.reset_free_trials())
    # оплатил, но не нажал «Я оплатил» — продлеваем сами
    for p in await ctx.db.pending_payments():
        try:
            status = await ctx.pay.status(p["yk_id"])
            until = await apply_payment(ctx, p["user_id"], p["yk_id"], status, bot)
        except Exception as e:
            log.info("статус платежа %s: %s", p["yk_id"], e)
            continue
        plan = all_plans.get(p["plan"] or "basic", all_plans["basic"])
        if until and p["auto"] == 2:                      # автосписание прошло
            await send(bot, ctx, p["user_id"], T.AUTOPAY_OK.format(plan=plan.title, until=fmt_date(until), price=p["amount"]), K.autopay_manage(True))
        elif until:
            from user import paid_message
            text, markup = await paid_message(ctx, p["user_id"], plan, until)
            await send(bot, ctx, p["user_id"], text, markup)
        elif status == "canceled" and p["auto"] == 2:     # банк отклонил автосписание
            await autopay_failed(bot, ctx, p["user_id"], plan)
    # автопродление: за час до конца срока списываем по материнскому платежу (один раз за период)
    if ctx.cfg.autopay_live:
        for u in await ctx.db.users("autorenew=1 AND paid_until<? AND paid_until>?", now + 3600, now - 2 * DAY):
            plan = all_plans.get(u["renew_plan"] or "basic", all_plans["basic"])
            if not await ctx.db.mark_once(f"renew:{u['id']}:{int(u['paid_until'])}"):
                continue
            if plan.id == "trial" or not u["renew_inv"]:
                await autopay_failed(bot, ctx, u["id"], plan)
                continue
            try:
                inv = await ctx.pay.charge(u["renew_inv"], plan.price, T.PAY_DESCRIPTION.format(plan=plan.title, days=plan.days))
            except Exception as e:
                log.warning("автосписание %s: %s", u["id"], e)
                await autopay_failed(bot, ctx, u["id"], plan)
                continue
            await ctx.db.add_payment(u["id"], inv, plan.price, plan.id, auto=2)
    # подарок «бесплатный пробный день» убран (владелец 13.11): пробный день снова платный — 490 ₽
    # тариф скоро закончится: пробный день — за 3 часа, месячный — за сутки
    for u in await ctx.db.users("paid_until>? AND paid_until<?", now, now + DAY):
        plan = all_plans.get(u["plan"] or "basic", all_plans["basic"])
        if plan.id == "trial" and u["paid_until"] - now > 3 * 3600:
            continue
        if await ctx.db.mark_once(f"ends:{u['id']}:{int(u['paid_until'])}"):
            if u["autorenew"] and ctx.cfg.autopay_live and plan.id != "trial":     # подписка продлится сама — напоминаем о списании
                rp = all_plans.get(u["renew_plan"] or plan.id, plan)
                await send(bot, ctx, u["id"], T.AUTOPAY_REMIND.format(plan=rp.title, price=rp.price, days=rp.days), K.autopay_manage(True))
                continue
            s = await ctx.db.user_stats(u["id"], now - 30 * DAY)
            when = "Через 3 часа" if plan.id == "trial" else "Завтра"
            # после пробного дня предлагаем «Простой» и PRO, иначе — продлить свой тариф или перейти на PRO
            buttons = K.plans(plans.plans(ctx.cfg, u, now), False) if plan.id == "trial" else K.plans(all_plans, False, only=plan.id)
            deal = T.TRIAL_ENDS_DEAL.format(pro_trial=ctx.cfg.price_pro_trial, pro=ctx.cfg.price_pro) if plan.id == "trial" else ""
            await send(bot, ctx, u["id"], T.ACCESS_ENDS.format(when=when, plan=plan.title, n=s["n"], good=s["good"]) + deal, buttons)
    # доступ закончился
    for u in await ctx.db.users("MAX(trial_until, paid_until)<? AND MAX(trial_until, paid_until)>?", now, now - 2 * DAY):
        end = int(max(u["trial_until"], u["paid_until"]))
        if u["autorenew"] and ctx.cfg.autopay_live:       # идёт автосписание — «доступ закончился» не пишем
            continue
        if await ctx.db.mark_once(f"ended:{u['id']}:{end}"):
            if u["plan"] == "trial":          # после пробного дня — итог дня и «Простой» / PRO на месяц (владелец 10.11)
                from pipeline import cars_word, wait_text
                s, b = await ctx.db.user_stats(u["id"], now - 2 * DAY), all_plans["basic"]
                await send(bot, ctx, u["id"], T.TRIAL_ENDED.format(
                    n=s["n"], word=cars_word(s["n"]), good=T.TRIAL_ENDED_GOOD.format(k=s["good"]) if s["good"] else "",
                    basic=b.price, pro=all_plans["pro"].price, delay=wait_text(b.delay) if b.delay else "0 с",
                    basic_filters=f"{b.max_filters} фильтр{'а' if 1 < b.max_filters < 5 else 'ов' if b.max_filters >= 5 else ''}"), K.plans(all_plans, False))
            else:
                await send(bot, ctx, u["id"], T.ACCESS_ENDED, K.plans(all_plans, not u["trial_used"]))


async def autopay_failed(bot: Bot, ctx: Ctx, uid: int, plan) -> None:
    """Автосписание не прошло: выключаем автопродление и предлагаем продлить вручную."""
    await ctx.db.set_user(uid, autorenew=0)
    await ctx.db.event(uid, "autopay_fail", plan.id)
    await send(bot, ctx, uid, T.AUTOPAY_FAIL.format(price=plan.price, plan=plan.title), K.plans(plans.plans(ctx.cfg), False, only=plan.id if plan.id != "trial" else None))


VK_WARN = (800, 1000)        # сообществ ВК: на сколько предупреждаем админа, что пора ускорять опрос
TG_WARN = (400, 480)         # каналов Telegram: лимит одного служебного аккаунта — 500


async def capacity(bot: Bot, ctx: Ctx) -> None:
    """Источников стало много — один раз на каждый порог пишем админу, пока задержка не выросла."""
    from admin import admin_ids
    vk = sum(1 for ch in ctx.channels.values() if ch.get("vk_id"))
    tg = sum(1 for ch in ctx.channels.values() if ch.get("tg_id"))
    rps = ctx.cfg.vk_wall_rps or 1
    for n in VK_WARN:
        if vk >= n and await ctx.db.mark_once(f"cap:vk:{n}"):
            for uid in await admin_ids(ctx):
                await send(bot, ctx, uid, T.CAP_VK.format(n=vk, every=round(vk / 25 / rps), at1000=round(1000 / 25 / rps)))
    for n in TG_WARN:
        if tg >= n and await ctx.db.mark_once(f"cap:tg:{n}"):
            for uid in await admin_ids(ctx):
                await send(bot, ctx, uid, T.CAP_TG.format(n=tg))


_regions_at = 0.0


async def regions(bot: Bot, ctx: Ctx) -> None:
    """Раз в час — города каналов по истории: новый канал без города в названии узнаёт свой город по первым машинам."""
    global _regions_at
    if time.time() - _regions_at > 3600:
        _regions_at = time.time()
        await ctx.guess_regions()


async def loop(bot: Bot, ctx: Ctx) -> None:
    while True:
        for job in (tick, capacity, regions):
            try:
                await job(bot, ctx)
            except Exception:
                log.exception("фоновая задача упала")
        await asyncio.sleep(30)
