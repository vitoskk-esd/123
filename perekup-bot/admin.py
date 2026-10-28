"""Админка (только ADMIN_IDS): цифры бизнеса и скорости, общая база каналов, рассылка, ручной доступ."""
import asyncio

from aiogram import Bot, Router
from aiogram.exceptions import TelegramForbiddenError
from aiogram.filters import Command, CommandObject
from aiogram.types import Message

from ctx import Ctx
from links import label, parse_link
import texts as T
from pipeline import seconds

router = Router(name="admin")


async def admin_ids(ctx: Ctx) -> list[int]:
    """Кому приходят обращения в поддержку: ADMIN_IDS или первый, кто написал боту /start."""
    if ctx.cfg.admins:
        return sorted(ctx.cfg.admins)
    first = await ctx.db.first_user()
    return [first] if first else []


async def is_admin(msg: Message, ctx: Ctx) -> bool:
    """ADMIN_IDS из .env, а если там пусто — тот, кто первым написал боту /start (то есть ты)."""
    if ctx.cfg.admins:
        return msg.from_user.id in ctx.cfg.admins
    return msg.from_user.id == await ctx.db.first_user()


async def queue_wait(ctx: Ctx, channel_ids: list[int]) -> str:
    """Сколько ждать, пока подключится последний из этих каналов: каналы впереди в очереди + свои, по одному за паузу."""
    queue = [r["id"] for r in await ctx.db.queued_channels()]
    last = max((queue.index(c) for c in channel_ids if c in queue), default=-1)
    interval = ctx.cfg.join_interval
    minutes = max(1, round((last + 1) * interval / 60))
    every = f"{interval} с" if interval < 60 else f"{interval / 60:g} мин".replace(".", ",")
    return T.CHANNELS_WAIT.format(minutes=minutes, interval=every)

@router.message(Command("admin"))
async def admin(msg: Message, ctx: Ctx) -> None:
    if not await is_admin(msg, ctx):
        return
    s = await ctx.db.admin_stats()
    p = s["posts24"]
    ch = {(r["status"], r["base"]): r["n"] for r in s["channels"]}
    mrr = s["basic"] * ctx.cfg.price_basic + s["pro"] * ctx.cfg.price_pro
    pay = (f"Пробный день: {s['trial']} · Простой: <b>{s['basic']}</b> · PRO: <b>{s['pro']}</b>\n"
           f"В месяц ≈ <b>{mrr:,} ₽</b> · выручка за 30 дней: {s['revenue30']:,} ₽".replace(",", " ")
           ) if ctx.cfg.payments_on else "Оплата не подключена — бот бесплатный для всех."
    src = "\n".join(f"• {r['source']}: {r['users']} чел., оплатили {r['paid'] or 0}" for r in s["sources"])
    reader = "✅ подключён" if ctx.reader and ctx.reader.online else "❌ не подключён — /connect"
    ai_state = "✅ включена" if ctx.cfg.ai_on else "❌ выключена — добавь GEMINI_API_KEY в «Переменные»"
    await msg.answer(
        f"🤖 Служебный аккаунт: {reader}\n"
        f"🧠 ИИ-проверка постов: {ai_state}, проверено за сутки: {p['ai'] or 0}\n"
        f"👥 Людей: <b>{s['users']}</b>, с фильтрами: {s['with_filters']}\n{pay}\n\n"
        f"⚡ За сутки: постов {p['n']}, машин с ценой {p['cars'] or 0}, дублей {p['dups'] or 0}\n"
        f"Отправлено людям: {s['deliveries24']} · средняя задержка: <b>{seconds(p['lat'] and int(p['lat']))}</b>\n"
        f"  из неё: пост шёл от Telegram до бота {seconds(p['recv'] and int(p['recv']))}, "
        f"остальное — проверка, фото и отправка\n\n"
        f"📢 Каналы базы: {ch.get(('joined', 1), 0)} подключено, {ch.get(('queued', 1), 0)} в очереди, "
        f"{ch.get(('awaiting', 1), 0)} ждут одобрения админа, {ch.get(('failed', 1), 0)} с ошибкой · свои у людей: {ch.get(('joined', 0), 0)}\n\n"
        f"🔗 Откуда пришли:\n{src or '—'}\n\n"
        "Команды:\n/add @канал1 @канал2 — добавить каналы в общую базу\n/list — список каналов\n"
        "/tobase — перенести свои каналы из «📢 Каналы» в общую базу\n"
        "/similar — найти новые каналы через «похожие каналы» Telegram\n"
        "/del @канал — убрать канал\n/broadcast текст — написать всем")


@router.message(Command("add"))
async def addbase(msg: Message, command: CommandObject, ctx: Ctx) -> None:
    """/add https://t.me/a @b t.me/+hash [msk] — регион последним словом, если весь список из одного города."""
    if not await is_admin(msg, ctx):
        return
    parts = (command.args or "").split()
    region = parts[-1] if parts and parts[-1] in ctx.dict.regions else None
    added, bad, queued = [], [], []
    for p in parts[:-1] if region else parts:
        link = parse_link(p)
        if not link:
            bad.append(p)
            continue
        cid, new = await ctx.db.add_channel(**{link[0]: link[1]}, region=region, base=True, added_by=msg.from_user.id)
        status = (await ctx.db.channel(cid))["status"]
        if status == "awaiting":                               # заявка у админа канала — напишу, когда одобрит
            await ctx.db.add_approval_waiter(cid, msg.from_user.id)
        elif status != "joined":                               # уже подключён — ждать нечего
            await ctx.db.add_waiter(cid, msg.from_user.id)
            queued.append(cid)
        added.append(label(*link) + ("" if new else " (уже был)"))
    await ctx.refresh_channels()            # уже подключённый свой канал стал общим — посты сразу всем
    await msg.answer(
        (f"В очередь на подключение: {len(added)}\n" + "\n".join(added) if added else "Пришли ссылки: /add @канал1 t.me/канал2") +
        (f"\n\nНе понял: {', '.join(bad)}" if bad else "") +
        (await queue_wait(ctx, queued) + "\nХод подключения — в /list." if queued else ""))


@router.message(Command("similar"))
async def similar(msg: Message, ctx: Ctx) -> None:
    """/similar — «похожие каналы» от Telegram для каналов базы: новые автомобильные каналы с их активностью."""
    if not await is_admin(msg, ctx):
        return
    if not (ctx.reader and ctx.reader.online):
        return await msg.answer("Служебный аккаунт не подключён — /connect")
    await msg.answer("🔎 Спрашиваю у Telegram похожие каналы для каждого канала базы и смотрю, как часто они постят. "
                     "Это займёт несколько минут — пришлю список сюда.")

    async def run():
        known = {(r["username"] or "").lower() for r in await ctx.db.base_channels()} | \
                {(r["username"] or "").lower() for r in await ctx.db._all("SELECT username FROM channels")}
        try:
            rows = await ctx.reader.similar(known)
        except Exception as e:
            return await msg.answer(f"Не получилось: {e}")
        if not rows:
            return await msg.answer("Новых автомобильных каналов в «похожих» не нашлось.")
        active = [r for r in rows if r.get("weekdays", 0) >= 4]
        lines = [f"{'✅' if r.get('weekdays', 0) >= 4 else '▫️'} @{r['username']} — {r['title'][:40]} · "
                 f"{r['subs']:,} подп. · {r.get('week', '?')} постов/нед".replace(",", " ") for r in rows]
        text = ("Похожие каналы (✅ — посты почти каждый будний день):\n\n" + "\n".join(lines) +
                (f"\n\nДобавить активные ({len(active)}):\n/add " + " ".join("@" + r["username"] for r in active) if active else ""))
        for i in range(0, len(text), 3800):
            await msg.answer(text[i:i + 3800])

    task = asyncio.create_task(run())
    ctx.background.add(task)
    task.add_done_callback(ctx.background.discard)


@router.message(Command("tobase"))
async def tobase(msg: Message, ctx: Ctx) -> None:
    """/tobase — все каналы, которые админ добавил себе через «📢 Каналы», переносим в общую базу для всех."""
    if not await is_admin(msg, ctx):
        return
    rows = [r for r in await ctx.db.own_channels(msg.from_user.id) if r["status"] in ("joined", "queued", "awaiting")]
    if not rows:
        return await msg.answer("Своих каналов нет — добавь их через «📢 Каналы» или сразу в базу: /add @канал1 @канал2")
    await ctx.db.channels_to_base([r["id"] for r in rows])
    await ctx.refresh_channels()
    names = [r["title"] or (r["username"] and "@" + r["username"]) or "закрытый канал" for r in rows]
    waiting = sum(r["status"] != "joined" for r in rows)
    await msg.answer(f"✅ В общую базу перенесено каналов: {len(rows)}. Теперь посты из них приходят всем по их фильтрам.\n\n"
                     + "\n".join(f"• {n}" for n in names)
                     + (f"\n\nЕщё подключаются: {waiting} — как подключатся, тоже будут для всех." if waiting else ""))


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
    icon = {"joined": "✅", "queued": "⏳", "awaiting": "🕓", "failed": "❌"}
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
