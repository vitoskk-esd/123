"""Админка (только ADMIN_IDS): цифры бизнеса и скорости, общая база каналов, рассылка, ручной доступ."""
import asyncio
import re

from aiogram import Bot, Router
from aiogram.exceptions import TelegramForbiddenError
from aiogram.filters import Command, CommandObject
from aiogram.types import Message

from .ctx import Ctx
from .links import label, parse_link
from .pipeline import seconds

router = Router(name="admin")


def is_admin(msg: Message, ctx: Ctx) -> bool:
    return msg.from_user.id in ctx.cfg.admins


@router.message(Command("admin"))
async def admin(msg: Message, ctx: Ctx) -> None:
    if not is_admin(msg, ctx):
        return
    s = await ctx.db.admin_stats()
    p = s["posts24"]
    ch = {(r["status"], r["base"]): r["n"] for r in s["channels"]}
    acc = ", ".join(f"{a or '—'}: {n}" for a, n in s["accounts"].items()) or "—"
    src = "\n".join(f"• {r['source']}: {r['users']} чел., оплатили {r['paid'] or 0}" for r in s["sources"])
    await msg.answer(
        "📈 <b>Бизнес</b>\n"
        f"Людей: <b>{s['users']}</b> (с фильтрами {s['with_filters']}, заблокировали бота {s['blocked']})\n"
        f"Пробный период: {s['trial']} · Платят сейчас: <b>{s['paying']}</b> (автопродление {s['autopay']})\n"
        f"MRR ≈ <b>{s['paying'] * ctx.cfg.price:,} ₽</b> · выручка за 30 дней: {s['revenue30']:,} ₽\n".replace(",", " ") +
        f"Платили хоть раз: {s['ever_paid']} · ушли: {s['churned']}\n\n"
        "⚡ <b>Посты за сутки</b>\n"
        f"Всего: {p['n']} · машины с ценой: {p['cars'] or 0} · дубли: {p['dups'] or 0} · через ИИ: {p['llm'] or 0}\n"
        f"Доставок: {s['deliveries24']} · средняя задержка: <b>{seconds(p['lat'] and int(p['lat']))}</b>\n\n"
        "📢 <b>Каналы</b>\n"
        f"База: {ch.get(('joined', 1), 0)} подключено, {ch.get(('queued', 1), 0)} в очереди, {ch.get(('failed', 1), 0)} ошибок\n"
        f"Свои у людей: {ch.get(('joined', 0), 0)} (+{ch.get(('queued', 0), 0)} в очереди)\n"
        f"Аккаунты: {acc} (лимит Telegram — 500 каналов на аккаунт)\n\n"
        f"🔗 <b>Источники</b>\n{src or '—'}\n\n"
        "Команды: /addbase ссылки [регион] · /base · /delbase @канал · /broadcast текст · /grant id дни · /reload")


@router.message(Command("addbase"))
async def addbase(msg: Message, command: CommandObject, ctx: Ctx) -> None:
    """/addbase https://t.me/a @b t.me/+hash [msk] — регион последним словом, если весь список из одного города."""
    if not is_admin(msg, ctx):
        return
    parts = (command.args or "").split()
    region = parts[-1] if parts and parts[-1] in ctx.dict.regions else None
    added, bad = [], []
    for p in parts[:-1] if region else parts:
        link = parse_link(p)
        if not link:
            bad.append(p)
            continue
        cid, new = await ctx.db.add_channel(**{link[0]: link[1]}, region=region, base=True, added_by=msg.from_user.id)
        if (await ctx.db.channel(cid))["status"] != "joined":   # уже подключён — ждать нечего
            await ctx.db.add_waiter(cid, msg.from_user.id)
        added.append(label(*link) + ("" if new else " (уже был)"))
    regions = ", ".join(sorted(ctx.dict.regions))
    await msg.answer(
        (f"В очередь на подключение: {len(added)}\n" + "\n".join(added) if added else "Пришли ссылки: /addbase @канал1 t.me/канал2 [регион]") +
        (f"\n\nНе понял: {', '.join(bad)}" if bad else "") +
        f"\n\nКаналы подключаются по одному раз в {ctx.cfg.join_interval} с — так Telegram не заблокирует аккаунт."
        f"\nКоды регионов: {regions}")


@router.message(Command("delbase"))
async def delbase(msg: Message, command: CommandObject, ctx: Ctx) -> None:
    """/delbase @канал — убрать канал совсем (например, попросил владелец)."""
    if not is_admin(msg, ctx):
        return
    link = parse_link(command.args or "")
    if not link:
        return await msg.answer("Формат: /delbase @канал или ссылка.")
    ok = await ctx.db.remove_channel(*(link[1], None) if link[0] == "username" else (None, link[1]))
    await ctx.refresh_channels()
    await msg.answer("Канал убран — посты из него больше не приходят." if ok else "Такого канала нет в базе.")


@router.message(Command("base"))
async def base(msg: Message, ctx: Ctx) -> None:
    if not is_admin(msg, ctx):
        return
    rows = await ctx.db.base_channels()
    icon = {"joined": "✅", "queued": "⏳", "failed": "❌"}
    lines = [f"{icon.get(r['status'], '?')} {r['title'] or ('@' + r['username'] if r['username'] else 'закрытый')} "
             f"· {r['region'] or '—'} · постов {r['posts']}" + (f" · {r['error']}" if r["error"] else "") for r in rows]
    text = "\n".join(lines) or "База пуста. Добавь каналы: /addbase @канал1 @канал2"
    for i in range(0, len(text), 3800):
        await msg.answer(text[i:i + 3800])


@router.message(Command("grant"))
async def grant(msg: Message, command: CommandObject, ctx: Ctx) -> None:
    if not is_admin(msg, ctx):
        return
    m = re.fullmatch(r"\s*(\d+)\s+(-?\d+)\s*", command.args or "")
    if not m or not await ctx.db.user(int(m.group(1))):
        return await msg.answer("Формат: /grant <id> <дней>. Человек должен хоть раз запустить бота.")
    until = await ctx.db.extend(int(m.group(1)), int(m.group(2)))
    from .user import fmt_date
    await msg.answer(f"Готово, доступ до {fmt_date(until)}.")


@router.message(Command("reload"))
async def reload(msg: Message, ctx: Ctx) -> None:
    if not is_admin(msg, ctx):
        return
    try:
        d = ctx.reload()
    except Exception as e:   # ошибка в cars.yaml не должна ронять бота — работаем на старом справочнике
        return await msg.answer(f"Ошибка в cars.yaml, оставил прежний справочник: {e}")
    await msg.answer(f"Справочник обновлён: {len(d.makes)} марок, {len(d.models)} моделей, {len(d.regions)} регионов.")


@router.message(Command("broadcast"))
async def broadcast(msg: Message, command: CommandObject, bot: Bot, ctx: Ctx) -> None:
    """/broadcast текст — или ответь /broadcast на любое сообщение, и бот разошлёт его копию."""
    if not is_admin(msg, ctx):
        return
    src = msg.reply_to_message
    if not src and not command.args:
        return await msg.answer("Напиши /broadcast текст или ответь /broadcast на сообщение.")
    ok = fail = 0
    for u in await ctx.db.users():
        try:
            if src:
                await bot.copy_message(u["id"], msg.chat.id, src.message_id)
            else:
                await bot.send_message(u["id"], command.args)
            ok += 1
        except TelegramForbiddenError:
            await ctx.db.mark_blocked(u["id"])
            fail += 1
        except Exception:
            fail += 1
        await asyncio.sleep(0.05)
    await msg.answer(f"Разослано: {ok}, не доставлено: {fail}.")
