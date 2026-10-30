"""Админка (только ADMIN_IDS): цифры бизнеса и скорости, общая база каналов, рассылка, ручной доступ."""
import asyncio
import logging
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
log = logging.getLogger(__name__)


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
    for kind, every in (("tg", ctx.cfg.join_interval), ("vk", 3)):       # открытые сообщества ВК — сразу
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
        "👑 Админ-панель — кнопка внизу или /panel\n\nКоманды:\n/add @канал1 vk.com/группа — добавить каналы и группы ВК в общую базу\n/list — общая база: смотреть и удалять каналы\n"
        "/tobase — перенести свои каналы из «📢 Каналы» в общую базу\n"
        "/similar — найти новые каналы через «похожие каналы» Telegram\n"
        "/vkfind — найти 50 барахолок с авто в ВК (5000+ подписчиков, 3+ поста почти каждый день)\n"
        "/del @канал — убрать канал\n/vk — подключить служебную страницу ВКонтакте · /vkcheck — проверить ВК\n/broadcast текст — написать всем")


def source_name(src: str | None) -> str:
    """Метка из ссылки t.me/<бот>?start=… → понятное название источника."""
    s = (src or "").lower()
    if s in ("", "direct"):
        return "неизвестно"
    if s.startswith(("inst", "ig", "reels")):
        return "Instagram"
    if s.startswith(("threads", "thr")):
        return "Threads"
    return src


def by_source(rows) -> dict[str, int]:
    out: dict[str, int] = {}
    for r in rows:
        k = source_name(r["source"]); out[k] = out.get(k, 0) + r["n"]
    order = {"Instagram": 0, "Threads": 1}
    return dict(sorted(out.items(), key=lambda kv: (order.get(kv[0], 2 if kv[0] != "неизвестно" else 3), -kv[1])))


def msk_day_start(now: float) -> float:
    return now - (now + 3 * 3600) % 86400


async def notify_new_user(bot: Bot, ctx: Ctx, user, source: str | None) -> None:
    """Новый человек нажал «Старт» — админу: кто и откуда пришёл (если админ не выключил это в панели)."""
    if not await notify_on(ctx):
        return
    p = await ctx.db.panel(msk_day_start(time.time()))
    who = html.escape(user.first_name or "без имени") + (f" (@{user.username})" if user.username else "") + f" · id {user.id}"
    text = T.NEW_USER.format(who=who, src=source_name(source), total=p["total"], today=sum(r["n"] for r in p["today"]))
    for uid in await admin_ids(ctx):
        if uid != user.id:
            try:
                await bot.send_message(uid, text)
            except Exception:
                pass


async def paylog(bot: Bot, ctx: Ctx, u, pay, until: float) -> None:
    """Оплата прошла — сразу в канал «оплаты» (или админу в личку, если канала нет)."""
    import plans
    plan = plans.plans(ctx.cfg).get(pay["plan"] or "basic")
    k = await ctx.db.paid_count(u["id"])
    n, total = await ctx.db.paid_since(msk_day_start(time.time()))
    who = html.escape(u["first_name"] or "без имени") + (f" (@{u['username']})" if u["username"] else "") + f" · id {u['id']}"
    word = "оплата" if n % 10 == 1 and n % 100 != 11 else "оплаты" if n % 10 in (2, 3, 4) and n % 100 not in (12, 13, 14) else "оплат"
    text = T.PAYLOG.format(amount=f"{pay['amount']:,}".replace(",", " "), plan=plan.title if plan else pay["plan"], who=who,
                           until=datetime.fromtimestamp(until).strftime("%d.%m.%Y"), src=source_name(u["source"]),
                           kind=T.PAYLOG_FIRST if k <= 1 else T.PAYLOG_AGAIN.format(k=k), n=n, word=word, sum=f"{total:,}".replace(",", " "))
    targets = [ctx.paylog_chat] if ctx.paylog_chat else await admin_ids(ctx)
    for chat in targets:
        try:
            await bot.send_message(chat, text)
        except Exception as e:
            log.warning("оплата не записана в канал %s: %s", chat, e)
            if chat == ctx.paylog_chat:                   # канал недоступен — хотя бы админу в личку
                for uid in await admin_ids(ctx):
                    try:
                        await bot.send_message(uid, text)
                    except Exception:
                        pass


async def notify_on(ctx: Ctx) -> bool:
    return await ctx.db.get_setting("notify_new") != "0"


async def panel_text(bot: Bot, ctx: Ctx) -> str:
    now = time.time()
    p = await ctx.db.panel(msk_day_start(now))
    fmt = lambda d: " — " + " · ".join(f"{k} {v}" for k, v in d.items()) if d else ""
    names = {"pro": "PRO", "basic": "Простой", "trial": "Пробный день"}
    subs = {names.get(r["p"], r["p"]): r["n"] for r in p["subs"]}
    me = await bot.me()
    rub = lambda v: f"{v:,}".replace(",", " ")
    return T.PANEL.format(
        date=datetime.fromtimestamp(now).strftime("%d.%m.%Y %H:%M"), total=p["total"],
        blocked=f" (заблокировали бота: {p['blocked']})" if p["blocked"] else "",
        today=sum(r["n"] for r in p["today"]), today_src=fmt(by_source(p["today"])),
        week=sum(r["n"] for r in p["week"]), week_src=fmt(by_source(p["week"])),
        all_src=" · ".join(f"{k} {v}" for k, v in by_source(p["all"]).items()) or "—",
        subs=sum(subs.values()), pro=subs.get("PRO", 0), basic=subs.get("Простой", 0), trial=subs.get("Пробный день", 0),
        paid_n=p["paid"]["n"], paid_sum=rub(p["paid"]["s"]), paid30_n=p["paid30"]["n"], paid30_sum=rub(p["paid30"]["s"]),
        free="" if ctx.cfg.payments_on else T.PANEL_FREE, link=f"https://t.me/{me.username}",
        ideas=T.PANEL_IDEAS.format(n=p["ideas"], week=p["ideas7"]),
        paylog=T.PANEL_PAYLOG.format(link=await ctx.db.get_setting("paylog_link")) if ctx.paylog_chat else T.PANEL_NO_PAYLOG)


async def health(bot: Bot, ctx: Ctx) -> str:
    """Самопроверка всех настроек и связей: что не так и как исправить — по строке на пункт."""
    import shutil
    from config import DATA
    cfg, now, lines, bad = ctx.cfg, time.time(), [], 0
    def add(ok, text, fix=""):
        nonlocal bad
        icon = "✅" if ok is True else "⚠️" if ok is None else "❌"
        bad += ok is not True
        lines.append(f"{icon} {text}" + (f" — {fix}" if fix and ok is not True else ""))
    ago = lambda t: "ещё не было" if not t else f"{int((now - t) // 60)} мин назад" if now - t < 86400 else f"{int((now - t) // 86400)} дн. назад"
    add(True if cfg.admins else None, f"админ: {'ADMIN_IDS ' + ', '.join(map(str, sorted(cfg.admins))) if cfg.admins else 'первый, кто написал /start'}",
        "надёжнее указать свой id в переменной ADMIN_IDS")
    add(str(cfg.db_path).startswith("/data"), f"база: {cfg.db_path}", "база не в постоянной папке /data — пропадёт при пересборке")
    try:
        free = shutil.disk_usage(DATA).free / 1e9
        add(free > 1 or None, f"свободно на диске: {free:.1f} ГБ", "место заканчивается — расширь диск в Amvera")
    except Exception:
        pass
    add(True if cfg.payments_on else None, "оплата (Робокасса): " + ("подключена" if cfg.payments_on else "не подключена — бот бесплатный для всех"),
        "впиши ROBOKASSA_LOGIN, ROBOKASSA_PASSWORD1, ROBOKASSA_PASSWORD2")
    add(bool(cfg.seller_name and cfg.seller_inn), f"реквизиты в оферте: {cfg.seller_name or '—'}, ИНН {cfg.seller_inn or '—'}",
        "впиши SELLER_NAME и SELLER_INN — без них Робокасса не примет магазин")
    add(True if cfg.seller_contact else None, f"контакт для клиентов: {cfg.seller_contact or '—'}", "впиши SELLER_CONTACT (email или телефон)")
    add(True, f"цены: пробный день {cfg.price_trial} ₽, Простой {cfg.price_basic} ₽, PRO {cfg.price_pro} ₽")
    if cfg.ai_on:
        import ai
        r = await ai.ask(ctx.dict, "Продам Toyota Camry 2015, пробег 120 000 км, цена 1 450 000 ₽, Казань", cfg.ai_key, cfg.ai_model)
        add(bool(r), f"ИИ-проверка ({cfg.ai_model}): " + ("отвечает" if r else "не ответила"),
            "проверь GEMINI_API_KEY; на бесплатном ключе суточный лимит — при большом потоке нужен платный")
    else:
        add(None, "ИИ-проверка выключена", "добавь GEMINI_API_KEY — без неё PRO-фильтры чуть менее точные")
    add(bool(ctx.reader and ctx.reader.online), "служебный аккаунт Telegram: " + ("подключён" if ctx.reader and ctx.reader.online else "не подключён"), "/connect")
    tg = sum(1 for ch in ctx.channels.values() if ch.get("tg_id")); vkn = sum(1 for ch in ctx.channels.values() if ch.get("vk_id"))
    add(tg < 480 or None, f"каналов Telegram: {tg} из 500 на аккаунт", "скоро лимит — нужен второй служебный аккаунт")
    t = await ctx.db.last_post_at(False)
    add(True if tg == 0 or (t and now - t < 3 * 3600) else None, f"последний пост из Telegram: {ago(t)}", "долго тишина — проверь служебный аккаунт")
    add(bool(ctx.buffer_chat) or None, "канал для фото машин: " + ("есть" if ctx.buffer_chat else "нет — машины без фото"), "создаётся сам при /connect")
    add(bool(ctx.paylog_chat) or None, "канал оплат: " + ("есть" if ctx.paylog_chat else "нет — оплаты приходят тебе в личку"), "создаётся сам при /connect")
    vk_ok = vk_online(ctx)
    add(True if vk_ok and not ctx.vk.error else None if vk_ok else (None if vkn == 0 else False),
        "ВКонтакте: " + (f"подключён ({ctx.vk.name})" + (f", ошибка: {ctx.vk.error}" if ctx.vk.error else "") if vk_ok else "не подключён"),
        "подробно — /vkcheck")
    if vkn:
        add(True if ctx.vk and ctx.vk.service else None, "сервисный ключ ВК: " + ("есть" if ctx.vk and ctx.vk.service else "нет"),
            "добавь VK_SERVICE_TOKEN — его ВК не ограничивает за «подозрительный» аккаунт")
        t = await ctx.db.last_post_at(True)
        add(True if t and now - t < 6 * 3600 else None, f"сообществ ВК: {vkn}, последний пост из ВК: {ago(t)}", "долго тишина — /vkcheck")
    queued = len(await ctx.db.queued_channels()) + len(await ctx.db.queued_channels("vk"))
    add(queued < 20 or None, f"в очереди на подключение: {queued}", "много в очереди — подключение идёт по одному, подожди")
    return T.HEALTH.format(lines="\n".join(html.escape(l) for l in lines), summary=T.HEALTH_OK if not bad else T.HEALTH_BAD)


@router.message(Command("health"))
async def health_cmd(msg: Message, bot: Bot, ctx: Ctx) -> None:
    if await is_admin(msg, ctx):
        await msg.answer(await health(bot, ctx), link_preview_options=LinkPreviewOptions(is_disabled=True))


@router.callback_query(F.data == "adm:health")
async def health_btn(cb: CallbackQuery, bot: Bot, ctx: Ctx) -> None:
    if not await is_admin(cb, ctx):
        return await cb.answer()
    await cb.answer("Проверяю…")
    await cb.message.answer(await health(bot, ctx), link_preview_options=LinkPreviewOptions(is_disabled=True))


@router.message(F.text == T.MENU_ADMIN)
@router.message(Command("panel"))
async def panel(msg: Message, bot: Bot, ctx: Ctx) -> None:
    if not await is_admin(msg, ctx):
        return
    await msg.answer(await panel_text(bot, ctx), reply_markup=K.admin_panel(await notify_on(ctx)), link_preview_options=LinkPreviewOptions(is_disabled=True))


@router.callback_query((F.data == "adm:panel") | (F.data == "adm:notify"))
async def panel_refresh(cb: CallbackQuery, bot: Bot, ctx: Ctx) -> None:
    if not await is_admin(cb, ctx):
        return await cb.answer()
    note = "Обновлено"
    if cb.data == "adm:notify":                  # уведомления о каждом новом человеке — вкл/выкл
        on = not await notify_on(ctx)
        await ctx.db.set_setting("notify_new", "1" if on else "0")
        note = "Уведомления о новых включены" if on else "Уведомления о новых выключены"
    try:
        await cb.message.edit_text(await panel_text(bot, ctx), reply_markup=K.admin_panel(await notify_on(ctx)),
                                   link_preview_options=LinkPreviewOptions(is_disabled=True))
    except Exception:
        pass                                     # ничего не изменилось — Telegram не даёт «править» тем же текстом
    await cb.answer(note)


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


@router.message(Command("vkfind"))
async def vkfind(msg: Message, ctx: Ctx) -> None:
    """/vkfind — служебная страница ВК ищет барахолки с авто по России и проверяет их активность."""
    if not await is_admin(msg, ctx):
        return
    if not vk_online(ctx):
        return await msg.answer("ВКонтакте не подключён — /vk")
    await msg.answer("🔎 Ищу в ВК барахолки с авто по России: 5000+ подписчиков, 3+ поста в день минимум 5 дней из 7, "
                     "в постах — продажа машин. Это займёт 1–3 минуты — пришлю до 50 ссылок сюда.")

    async def run():
        known = {r["vk_id"] for r in await ctx.db._all("SELECT vk_id FROM channels WHERE vk_id IS NOT NULL")}
        try:
            rows, n = await ctx.vk.find(known, 50, progress=lambda t: msg.answer("⏳ " + t))
        except vk.VKError as e:
            why = ("ВК ограничил частые запросы служебной странице — попробуй через час-другой. Новым страницам ВК "
                   "доверяет меньше; помогает, если зайти в неё с телефона и немного ей попользоваться.") if e.code in (6, 9) else ""
            return await msg.answer(f"❌ ВК не дал искать: {e}. {why}")
        except Exception as e:
            return await msg.answer(f"Не получилось: {e}")
        funnel = (f"Запросов к поиску: {n['queries']} (ответил ВК на {n['answered']}) → автомобильных открытых групп: {n['found']} → "
                  f"с 5000+ подписчиков: {n['big']} → постят 3+ раза в день минимум 5 дней из 7: {n['active']} → "
                  f"в постах машины с ценой: {n['fit']}")
        if not rows:
            return await msg.answer("Подходящих групп не нашлось.\n\n" + funnel)
        lines = [f"{i}. vk.com/{r['screen']} — {html.escape(r['name'][:40])} · {r['members']:,} подп. · "
                 f"{r['week']} постов/нед · машины {r['cars']}%".replace(",", " ") for i, r in enumerate(rows, 1)]
        text = f"Нашёл {len(rows)} (по числу постов за неделю):\n\n" + "\n".join(lines) + "\n\n" + funnel
        while text:
            cut = text.rfind("\n", 0, 3800) if len(text) > 3800 else len(text)
            await msg.answer(text[:cut], link_preview_options=LinkPreviewOptions(is_disabled=True))
            text = text[cut:].lstrip("\n")
        await msg.answer("Добавить все в общую базу — скопируй и отправь:\n\n<code>/add " +
                         " ".join(f"vk.com/{r['screen']}" for r in rows) + "</code>")

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


@router.message(Command("vkcheck"))
async def vkcheck(msg: Message, ctx: Ctx) -> None:
    """/vkcheck — пошагово проверить ВК: ключи, чтение сообщества и стены, пачки, лента; очередь и её ошибка."""
    if not await is_admin(msg, ctx):
        return
    if not (ctx.vk and (ctx.vk.api or ctx.vk.service)):
        return await msg.answer("ВКонтакте не подключён — /vk" + (f"\nПричина: {ctx.vk.error}" if ctx.vk and ctx.vk.error else ""))
    lines = await ctx.vk.check()
    bad = "\n".join(lines)
    hint = T.VK_HINT_FLOOD if ("код 9" in bad or "код 6" in bad or "код 29" in bad) else ("" if "❌" in bad else T.VK_HINT_OK)
    await msg.answer(T.VK_CHECK.format(lines=html.escape(bad), hint=hint), link_preview_options=LinkPreviewOptions(is_disabled=True))


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
