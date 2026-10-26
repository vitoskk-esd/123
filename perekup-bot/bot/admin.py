"""Админка (только ADMIN_IDS): цифры бизнеса и скорости, общая база каналов, рассылка, ручной доступ."""
import asyncio

from aiogram import Bot, Router
from aiogram.exceptions import TelegramForbiddenError
from aiogram.filters import Command, CommandObject
from aiogram.types import Message

from .ctx import Ctx
from .links import label, parse_link
from .pipeline import seconds

router = Router(name="admin")


async def is_admin(msg: Message, ctx: Ctx) -> bool:
    """ADMIN_IDS из .env, а если там пусто — тот, кто первым написал боту /start (то есть ты)."""
    if ctx.cfg.admins:
        return msg.from_user.id in ctx.cfg.admins
    return msg.from_user.id == await ctx.db.first_user()


@router.message(Command("admin"))
async def admin(msg: Message, ctx: Ctx) -> None:
    if not await is_admin(msg, ctx):
        return
    s = await ctx.db.admin_stats()
    p = s["posts24"]
    ch = {(r["status"], r["base"]): r["n"] for r in s["channels"]}
    pay = (f"Пробный период: {s['trial']} · Платят сейчас: <b>{s['paying']}</b> · "
           f"выручка за 30 дней: {s['revenue30']:,} ₽".replace(",", " ")) if ctx.cfg.payments_on else "Оплата не подключена — бот бесплатный для всех."
    src = "\n".join(f"• {r['source']}: {r['users']} чел." for r in s["sources"])
    await msg.answer(
        f"👥 Людей: <b>{s['users']}</b>, с фильтрами: {s['with_filters']}\n{pay}\n\n"
        f"⚡ За сутки: постов {p['n']}, машин с ценой {p['cars'] or 0}, дублей {p['dups'] or 0}\n"
        f"Отправлено людям: {s['deliveries24']} · средняя задержка: <b>{seconds(p['lat'] and int(p['lat']))}</b>\n\n"
        f"📢 Каналы базы: {ch.get(('joined', 1), 0)} подключено, {ch.get(('queued', 1), 0)} в очереди, "
        f"{ch.get(('failed', 1), 0)} с ошибкой · свои у людей: {ch.get(('joined', 0), 0)}\n\n"
        f"🔗 Откуда пришли:\n{src or '—'}\n\n"
        "Команды:\n/add @канал1 @канал2 — добавить каналы в общую базу\n/list — список каналов\n"
        "/del @канал — убрать канал\n/broadcast текст — написать всем")


@router.message(Command("add"))
async def addbase(msg: Message, command: CommandObject, ctx: Ctx) -> None:
    """/add https://t.me/a @b t.me/+hash [msk] — регион последним словом, если весь список из одного города."""
    if not await is_admin(msg, ctx):
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
    await msg.answer(
        (f"В очередь на подключение: {len(added)}\n" + "\n".join(added) if added else "Пришли ссылки: /add @канал1 t.me/канал2") +
        (f"\n\nНе понял: {', '.join(bad)}" if bad else "") +
        f"\n\nПодключаю по одному раз в {ctx.cfg.join_interval} с — так Telegram не заблокирует аккаунт. Ход — в /list.")


@router.message(Command("del"))
async def delbase(msg: Message, command: CommandObject, ctx: Ctx) -> None:
    """/del @канал — убрать канал совсем (например, попросил владелец)."""
    if not await is_admin(msg, ctx):
        return
    link = parse_link(command.args or "")
    if not link:
        return await msg.answer("Формат: /del @канал или ссылка.")
    ok = await ctx.db.remove_channel(*(link[1], None) if link[0] == "username" else (None, link[1]))
    await ctx.refresh_channels()
    await msg.answer("Канал убран — посты из него больше не приходят." if ok else "Такого канала нет в базе.")


@router.message(Command("list"))
async def base(msg: Message, ctx: Ctx) -> None:
    if not await is_admin(msg, ctx):
        return
    rows = await ctx.db.base_channels()
    icon = {"joined": "✅", "queued": "⏳", "failed": "❌"}
    lines = [f"{icon.get(r['status'], '?')} {r['title'] or ('@' + r['username'] if r['username'] else 'закрытый')} "
             f"· {r['region'] or '—'} · постов {r['posts']}" + (f" · {r['error']}" if r["error"] else "") for r in rows]
    text = "\n".join(lines) or "База пуста. Добавь каналы: /add @канал1 @канал2"
    for i in range(0, len(text), 3800):
        await msg.answer(text[i:i + 3800])


@router.message(Command("broadcast"))
async def broadcast(msg: Message, command: CommandObject, bot: Bot, ctx: Ctx) -> None:
    """/broadcast текст — или ответь /broadcast на любое сообщение, и бот разошлёт его копию."""
    if not await is_admin(msg, ctx):
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
