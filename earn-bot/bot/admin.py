"""Админка (только ADMIN_IDS): /admin — воронка и деньги, /claims — заявки, /payouts — выводы, /broadcast — рассылка,
/reload — перечитать offers.yaml, /offers — список акций. Кнопки одобрения приходят и сами — при каждой новой заявке."""
import asyncio

from aiogram import Bot, F, Router
from aiogram.exceptions import TelegramForbiddenError, TelegramRetryAfter
from aiogram.filters import BaseFilter, Command, CommandObject
from aiogram.types import CallbackQuery, Message, TelegramObject

from . import keyboards as K
from . import texts as T
from .ctx import Ctx

router = Router(name="admin")


class IsAdmin(BaseFilter):
    async def __call__(self, event: TelegramObject, ctx: Ctx) -> bool:
        return event.from_user is not None and event.from_user.id in ctx.cfg.admins


router.message.filter(IsAdmin())
router.callback_query.filter(IsAdmin())


@router.message(Command("admin"))
async def stats(msg: Message, ctx: Ctx) -> None:
    lines = ["📊 <b>Воронка</b> (уникальные люди)"]
    funnel = await ctx.db.funnel()
    top = funnel[0][1] or 1
    for label, n in funnel:
        lines.append(f"{label}: <b>{n}</b> ({n * 100 // top}%)")
    lines.append("\n🎁 <b>Акции</b>: ссылки / заявки / одобрено")
    for r in await ctx.db.offer_stats():
        lines.append(f"{r['offer_id']}: {r['clicks'] or 0} / {r['claims'] or 0} / {r['approved'] or 0}")
    lines.append("\n📣 <b>Источники</b> (?start=…): люди / одобрено")
    for r in await ctx.db.source_stats():
        lines.append(f"{r['source']}: {r['users']} / {r['approved'] or 0}")
    t = await ctx.db.totals()
    lines.append(f"\n💰 Начислено: {t['earned']} ₽ · выплачено: {t['paid']} ₽ · ждут вывода: {t['waiting']} ₽")
    lines.append("\n/claims — заявки · /payouts — выводы · /broadcast — рассылка · /reload — акции")
    await msg.answer("\n".join(lines))


@router.message(Command("claims"))
async def claims(msg: Message, ctx: Ctx) -> None:
    rows = await ctx.db.pending_claims()
    if not rows:
        await msg.answer("Новых заявок нет.")
    for c in rows[:20]:
        o = ctx.catalog.get(c["offer_id"])
        await msg.answer(f"Заявка #{c['id']} · {o.bank + ' — ' + o.title if o else c['offer_id']}\n"
                         f"{c['name']} · тел …{c['phone4']} · id {c['user_id']}", reply_markup=K.claim_admin(c["id"]))


@router.callback_query(F.data.startswith(("ca:", "cr:")))
async def decide_claim(cb: CallbackQuery, ctx: Ctx, bot: Bot) -> None:
    approve, cid = cb.data.startswith("ca:"), int(cb.data[3:])
    c = await ctx.db.claim(cid)
    o = ctx.catalog.get(c["offer_id"]) if c else None
    row = await ctx.db.decide_claim(cid, approve, o.payout if o else 0)
    if not row:
        await cb.answer("Заявка уже решена", show_alert=True)
        return
    await ctx.db.cancel(row["user_id"], "cond", row["offer_id"])
    bank, title = (o.bank, o.title) if o else (row["offer_id"], "")
    text = T.APPROVED.format(bank=bank, title=title, amount=row["amount"]) if approve else T.REJECTED.format(bank=bank, title=title)
    try:
        await bot.send_message(row["user_id"], text)
    except TelegramForbiddenError:
        await ctx.db.mark_blocked(row["user_id"])
    await cb.message.edit_reply_markup(reply_markup=None)
    await cb.answer("Одобрено" if approve else "Отклонено")


@router.message(Command("payouts"))
async def payouts(msg: Message, ctx: Ctx) -> None:
    rows = await ctx.db.open_payouts()
    if not rows:
        await msg.answer("Заявок на вывод нет.")
    for p in rows[:20]:
        await msg.answer(f"Вывод #{p['id']}: {p['amount']} ₽ → {p['phone']} ({p['bank']}) · id {p['user_id']}",
                         reply_markup=K.payout_admin(p["id"]))


@router.callback_query(F.data.startswith(("pp:", "pr:")))
async def decide_payout(cb: CallbackQuery, ctx: Ctx, bot: Bot) -> None:
    paid, pid = cb.data.startswith("pp:"), int(cb.data[3:])
    row = await ctx.db.decide_payout(pid, paid)
    if not row:
        await cb.answer("Уже обработано", show_alert=True)
        return
    text = T.PAID.format(amount=row["amount"], bank=row["bank"]) if paid else T.PAYOUT_REJECTED.format(amount=row["amount"])
    try:
        await bot.send_message(row["user_id"], text)
    except TelegramForbiddenError:
        await ctx.db.mark_blocked(row["user_id"])
    await cb.message.edit_reply_markup(reply_markup=None)
    await cb.answer("Отмечено")


@router.message(Command("reload"))
async def reload(msg: Message, ctx: Ctx) -> None:
    try:
        cat = ctx.reload()
    except Exception as e:   # ошибка в offers.yaml — старый каталог остаётся
        await msg.answer(f"❌ offers.yaml не прочитан, работает старый каталог: {e}")
        return
    await msg.answer(f"✅ Акций в каталоге: {len(cat.active)} активных из {len(cat.offers)}.")


@router.message(Command("offers"))
async def offers(msg: Message, ctx: Ctx) -> None:
    await msg.answer("\n".join(f"{'🟢' if o.active else '⚪️'} {o.id}: {o.bank} — {o.title}, +{o.payout} ₽"
                               for o in ctx.catalog.offers) or "Каталог пуст.")


@router.message(Command("broadcast"))
async def broadcast(msg: Message, command: CommandObject, ctx: Ctx, bot: Bot) -> None:
    """/broadcast текст — всем; или ответом /broadcast на любое сообщение (с картинкой) — копия этого сообщения всем."""
    source = msg.reply_to_message
    if not command.args and not source:
        await msg.answer("Напиши /broadcast текст — или ответь командой /broadcast на сообщение, которое разослать.")
        return
    users = await ctx.db.audience()
    await msg.answer(f"Рассылка на {len(users)} человек началась…")
    ok = 0
    for uid in users:
        try:
            if source:
                await bot.copy_message(uid, msg.chat.id, source.message_id)
            else:
                await bot.send_message(uid, command.args)
            ok += 1
        except TelegramForbiddenError:
            await ctx.db.mark_blocked(uid)
        except TelegramRetryAfter as e:
            await asyncio.sleep(e.retry_after)
        except Exception:
            pass
        await asyncio.sleep(0.05)   # ≈20 сообщений в секунду — в пределах лимита Telegram
    await msg.answer(f"✅ Доставлено: {ok} из {len(users)}.")
