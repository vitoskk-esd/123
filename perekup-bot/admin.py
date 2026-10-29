"""Админка (только ADMIN_IDS): цифры бизнеса и скорости, общая база каналов, рассылка, ручной доступ."""
import asyncio
import html
import time
from datetime import datetime

from aiogram import Bot, F, Router
from aiogram.exceptions import TelegramForbiddenError
from aiogram.filters import Command, CommandObject
from aiogram.types import CallbackQuery, LinkPreviewOptions, Message

import keyboards as K
from ctx import Ctx
from links import channel_name, label, parse_link
import texts as T
import vk
from pipeline import seconds

router = Router(name="admin")


async def admin_ids(ctx: Ctx) -> list[int]:
    """Кому приходят обращения в поддержку: ADMIN_IDS или первый, кто написал боту /start."""
    if ctx.cfg.admins:
        return sorted(ctx.cfg.admins)
    first = await ctx.db.first_user()
    return [first] if first else []


async def make_admins_pro(ctx: Ctx) -> None:
    """У админа всегда PRO: при запуске бота и на каждый /start — доступ на 10 лет вперёд, тариф «admin» (= PRO,
    но в выручку и число платящих не попадает)."""
    for uid in await admin_ids(ctx):
        u = await ctx.db.user(uid)
        if u and (u["plan"] != "admin" or u["paid_until"] < time.time() + 365 * 86400):
            await ctx.db.set_user(uid, plan="admin", paid_until=time.time() + 3650 * 86400)


async def is_admin(msg: Message, ctx: Ctx) -> bool:
    """ADMIN_IDS из .env, а если там пусто — тот, кто первым написал боту /start (то есть ты)."""
    return await is_admin_id(ctx, msg.from_user.id)


async def is_admin_id(ctx: Ctx, uid: int) -> bool:
    if ctx.cfg.admins:
        return uid in ctx.cfg.admins
    return uid == await ctx.db.first_user()


async def queue_wait(ctx: Ctx, channel_ids: list[int]) -> str:
    """Сколько ждать, пока подключится последний из этих каналов: каналы впереди в очереди + свои, по одному за паузу.
    У Telegram и ВК очереди свои и идут параллельно — ждать дольше там, где дольше."""
    wait, interval = 0, ctx.cfg.join_interval
    for kind, every in (("tg", ctx.cfg.join_interval), ("vk", ctx.cfg.vk_join_interval)):
        queue = [r["id"] for r in await ctx.db.queued_channels(kind)]
        last = max((queue.index(c) for c in channel_ids if c in queue), default=-1)
        if last >= 0 and (last + 1) * every > wait:
            wait, interval = (last + 1) * every, every
    minutes = max(1, round(wait / 60))
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
    vk_state = vk_status(ctx)
    ai_state = "✅ включена" if ctx.cfg.ai_on else "❌ выключена — добавь GEMINI_API_KEY в «Переменные»"
    await msg.answer(
        f"🤖 Служебный аккаунт: {reader}\n"
        f"🟦 ВКонтакте: {vk_state}\n"
        f"🧠 ИИ-проверка постов: {ai_state}, проверено за сутки: {p['ai'] or 0}\n"
        f"👥 Людей: <b>{s['users']}</b>, с фильтрами: {s['with_filters']}\n{pay}\n\n"
        f"⚡ За сутки: постов {p['n']}, машин с ценой {p['cars'] or 0}, дублей {p['dups'] or 0}\n"
        f"📊 Для оценки «ниже рынка»: {s['market90']} объявлений с ценой за 90 дней "
        f"(оценка появляется, когда той же модели ±1 год набралось 5+)\n"
        f"Отправлено людям: {s['deliveries24']} · средняя задержка: <b>{seconds(p['lat'] and int(p['lat']))}</b>\n"
        f"  из неё: пост шёл от Telegram до бота {seconds(p['recv'] and int(p['recv']))}, "
        f"остальное — проверка, фото и отправка\n\n"
        f"📢 Каналы базы: {ch.get(('joined', 1), 0)} подключено, {ch.get(('queued', 1), 0)} в очереди, "
        f"{ch.get(('awaiting', 1), 0)} ждут одобрения админа, {ch.get(('failed', 1), 0)} с ошибкой · свои у людей: {ch.get(('joined', 0), 0)}\n\n"
        f"🔗 Откуда пришли:\n{src or '—'}\n\n"
        "Команды:\n/add @канал1 vk.com/группа — добавить каналы и группы ВК в общую базу\n/list — общая база: смотреть и удалять каналы\n"
        "/tobase — перенести свои каналы из «📢 Каналы» в общую базу\n"
        "/similar — найти новые каналы через «похожие каналы» Telegram\n"
        "/del @канал — убрать канал\n/vk — подключить служебную страницу ВКонтакте\n/broadcast текст — написать всем")


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
        (await queue_wait(ctx, queued) + "\nХод подключения — в /list." if queued else "") +
        (T.VK_OFFLINE if any(parse_link(p) and parse_link(p)[0] == "vk" for p in parts) and not vk_online(ctx) else ""))


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
    ok = await ctx.db.remove_channel(**{link[0]: link[1]})
    await ctx.refresh_channels()
    await msg.answer("Канал убран — посты из него больше не приходят." if ok else "Такого канала нет в базе.")


def channel_url(ch) -> str | None:
    if ch["vk"]:
        return f"https://vk.com/{ch['vk']}"
    if ch["username"]:
        return f"https://t.me/{ch['username']}"
    return f"https://t.me/+{ch['invite']}" if ch["invite"] else None


async def base_page(ctx: Ctx, page: int) -> tuple[str, object]:
    rows = await ctx.db.base_channels()
    if not rows:
        return T.ADMIN_BASE_EMPTY, None
    page = min(page, (len(rows) - 1) // K.PAGE)
    n = lambda st: sum(r["status"] == st for r in rows)
    text = T.ADMIN_BASE.format(n=len(rows), joined=n("joined"), queued=n("queued"), awaiting=n("awaiting"), failed=n("failed"))
    return text, K.admin_base(rows, page)


@router.message(Command("list"))
async def base(msg: Message, ctx: Ctx) -> None:
    """/list — общая база кнопками: нажал на канал — карточка, оттуда можно удалить."""
    if not await is_admin(msg, ctx):
        return
    text, markup = await base_page(ctx, 0)
    await msg.answer(text, reply_markup=markup)


@router.callback_query(F.data.startswith("a:"))
async def base_buttons(cb: CallbackQuery, ctx: Ctx) -> None:
    if not await is_admin(cb, ctx):
        return await cb.answer()
    parts = cb.data.split(":")
    action, page = parts[1], int(parts[-1])
    if action == "base":
        text, markup = await base_page(ctx, page)
        if cb.message.text and cb.message.text.startswith("🗂"):
            await cb.message.edit_text(text, reply_markup=markup)
        else:
            await cb.message.answer(text, reply_markup=markup)
        return await cb.answer()
    ch = await ctx.db.channel(int(parts[2]))
    if not ch or not ch["base"]:
        await cb.answer("Этого канала уже нет в общей базе.", show_alert=True)
        text, markup = await base_page(ctx, page)
        return await cb.message.edit_text(text, reply_markup=markup)
    name = channel_name(ch)
    if action == "ch":
        when = lambda ts: datetime.fromtimestamp(ts).strftime("%d.%m.%Y %H:%M") if ts else "—"
        status = {"joined": "читаю", "queued": "в очереди на вступление", "awaiting": "ждём одобрения админа",
                  "failed": "не подключился"}.get(ch["status"], ch["status"])
        url = channel_url(ch)
        text = T.ADMIN_CHANNEL.format(
            icon=K.STATUS_ICON.get(ch["status"], "?"), name=html.escape(name),
            kind="ВКонтакте" if ch["vk"] else "Telegram", link=f" · {url}" if url else "", status=status,
            error=f" ({html.escape(ch['error'])})" if ch["error"] else "", region=ch["region"] or "—", posts=ch["posts"],
            last=when(ch["last_post_at"]), added=when(ch["created_at"]))
        await cb.message.edit_text(text, reply_markup=K.admin_channel(ch["id"], page, url),
                                   link_preview_options=LinkPreviewOptions(is_disabled=True))
    elif action == "del":
        await cb.message.edit_text(T.ADMIN_DEL_ASK.format(name=html.escape(name)), reply_markup=K.admin_del_confirm(ch["id"], page))
    elif action == "delok":
        await ctx.db.remove_from_base(ch["id"])
        await ctx.refresh_channels()
        text, markup = await base_page(ctx, page)
        await cb.message.edit_text(T.ADMIN_DELETED.format(name=html.escape(name)) + "\n\n" + text, reply_markup=markup)
    await cb.answer()


def vk_online(ctx: Ctx) -> bool:
    return bool(ctx.vk and ctx.vk.online)


def vk_status(ctx: Ctx) -> str:
    if not vk_online(ctx):
        why = f" ({ctx.vk.error})" if ctx.vk and ctx.vk.error else ""
        return f"❌ не подключён{why} — /vk"
    return f"✅ «{ctx.vk.name}»" + (f" · ⚠️ {ctx.vk.error}" if ctx.vk.error else "")


@router.message(Command("vk"))
async def vk_connect(msg: Message, command: CommandObject, ctx: Ctx) -> None:
    """/vk — как подключить служебную страницу ВК; /vk <адрес из браузера или ключ> — подключить."""
    if not await is_admin(msg, ctx):
        return
    if not command.args:
        return await msg.answer(T.VK_HOW.format(status=vk_status(ctx), url=vk.auth_url(ctx.cfg.vk_app_id)),
                                link_preview_options=LinkPreviewOptions(is_disabled=True))
    try:
        await msg.delete()                       # ключ даёт доступ к странице — в переписке его не оставляем
    except Exception:
        pass
    token = vk.token_from(command.args)
    if not token:
        return await msg.answer(T.VK_TOKEN_BAD)
    try:
        name = await ctx.vk.attach(token)
    except Exception as e:
        return await msg.answer(T.VK_TOKEN_FAIL.format(error=e))
    queued = len(await ctx.db.queued_channels("vk"))
    await msg.answer(T.VK_CONNECTED.format(name=name, queued=queued))


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
