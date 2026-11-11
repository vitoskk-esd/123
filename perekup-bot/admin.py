"""Админка (только ADMIN_IDS): цифры бизнеса и скорости, общая база каналов, рассылка, ручной доступ."""
import asyncio
import logging
import html
import re
import time
from datetime import datetime, timedelta, timezone

from aiogram import Bot, F, Router
from aiogram.exceptions import TelegramForbiddenError
from aiogram.filters import Command, CommandObject
from aiogram.types import BufferedInputFile, CallbackQuery, LinkPreviewOptions, Message

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


def region_label(ctx: Ctx, ch) -> str:
    """Город канала для админа: заданный, угаданный (по названию/нику/истории) или «не знаю» — такой канал не попадает в фильтры с городом."""
    if ch["region"]:
        return ctx.dict.regions.get(ch["region"], ch["region"])
    live = next((c for c in ctx.channels.values() if c["id"] == ch["id"]), {})
    if live.get("region_guess"):
        return ctx.dict.regions.get(live["region_guess"], live["region_guess"]) + " (определил сам)"
    return "не знаю — посты без города не идут в фильтры с городом"


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

async def answer_long(msg: Message, text: str, **kw) -> None:
    """Длинный ответ — частями по строкам: Telegram не принимает сообщения длиннее 4096 символов
    (из-за этого на список из сотни ссылок бот молчал — владелец 12.11)."""
    while text:
        cut = text.rfind("\n", 0, 3800) if len(text) > 3800 else len(text)
        cut = cut if cut > 0 else min(len(text), 3800)
        await msg.answer(text[:cut], link_preview_options=LinkPreviewOptions(is_disabled=True), **kw)
        text = text[cut:].lstrip("\n")


def link_tokens(text: str) -> tuple[list, list[str]]:
    """Ссылки на каналы/группы из текста (без повторов) и куски, которые на ссылку не похожи."""
    links, bad, seen = [], [], set()
    for tok in [x for x in re.split(r"[\s,;]+", text or "") if x]:
        link = parse_link(tok)
        if not link:
            bad.append(tok[:60])
        elif link not in seen:
            seen.add(link); links.append(link)
    return links, bad


async def add_links_to_base(msg: Message, ctx: Ctx, text: str, region: str | None = None, markup=None) -> None:
    """Админ присылает ссылки (через /add, «📢 Каналы» или просто сообщением) → в общую базу. Отвечает итогом:
    сколько взял в работу, какие уже были в базе / в очереди / ждут одобрения, что не понял."""
    uid = msg.from_user.id
    links, bad = link_tokens(text)
    if not links:
        return await msg.answer("Пришли ссылки на каналы или группы ВК: @канал, t.me/канал, t.me/+приглашение, vk.com/группа"
                                + (f"\n\nНе понял: {', '.join(bad[:20])}" if bad else ""), reply_markup=markup)
    taken, retry, ready, in_queue, awaiting, queued_ids = [], [], [], [], [], []
    for kind, value in links:
        cid, new = await ctx.db.add_channel(**{kind: value}, region=region, base=True, added_by=uid)
        await ctx.db.set_channel_state(uid, cid, None)
        ch = await ctx.db.channel(cid)
        name = ch["title"] or label(kind, value)
        if ch["status"] == "joined":
            ready.append(name)
        elif ch["status"] == "awaiting":
            await ctx.db.add_approval_waiter(cid, uid)
            awaiting.append(name)
        else:
            if ch["status"] == "failed":
                await ctx.db._run("UPDATE channels SET status='queued', error=NULL WHERE id=?", cid)
            await ctx.db.add_waiter(cid, uid)
            queued_ids.append(cid)
            (taken if new else retry if ch["status"] == "failed" else in_queue).append(name)
    await ctx.refresh_channels()            # уже подключённый свой канал стал общим — посты сразу всем
    lst = lambda xs: ", ".join(xs)
    parts = [f"📥 Получил ссылок: <b>{len(links)}</b>."]
    if taken or retry:
        parts.append(f"✅ <b>Взял в работу: {len(taken) + len(retry)}</b> — подключаю по одному, потом они будут в общей базе для всех.\n{lst(taken + retry)}")
    if ready:
        parts.append(f"♻️ <b>Уже были в базе и работают: {len(ready)}</b> — ничего делать не нужно.\n{lst(ready)}")
    if in_queue:
        parts.append(f"⏳ <b>Уже стоят в очереди на подключение: {len(in_queue)}</b> — повторно не добавлял.\n{lst(in_queue)}")
    if awaiting:
        parts.append(f"🔐 <b>Ждут одобрения админа канала: {len(awaiting)}</b> — напишу, когда одобрят.\n{lst(awaiting)}")
    if bad:
        parts.append(f"❌ <b>Не понял (не ссылка на канал): {len(bad)}</b>\n{lst(bad)}")
    wait = (await queue_wait(ctx, queued_ids) + "\nХод подключения — в /list.") if queued_ids else ""
    wait += await queue_status(ctx) if queued_ids else ""
    vk_off = T.VK_OFFLINE if any(k == "vk" for k, _ in links) and not vk_online(ctx) else ""
    await answer_long(msg, "\n\n".join(parts) + wait + vk_off, reply_markup=markup)


def mostly_links(text: str) -> bool:
    """Сообщение — список ссылок на каналы (а не фильтр «камри до 1 млн»)."""
    links, bad = link_tokens(text)
    return bool(links) and len(links) >= len(bad)


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
        "/vkfind 300 — таблица: 300 групп ВК с Б/У машинами (5000+, посты каждый день, без импорта)\n"
        "/tgfind 800 — таблица: 800 Telegram-каналов с Б/У машинами (3000+, 5+ постов в неделю, без импорта)\n"
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
    if s.startswith(("youtube", "yt", "shorts")):
        return "YouTube"
    if s.startswith(("tiktok", "tt", "tik")):
        return "TikTok"
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
                           until=datetime.fromtimestamp(until, MSK).strftime("%d.%m.%Y %H:%M МСК"), src=source_name(u["source"]),
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
        date=datetime.fromtimestamp(now, MSK).strftime("%d.%m.%Y %H:%M МСК"), total=p["total"],
        blocked=f" (заблокировали бота: {p['blocked']})" if p["blocked"] else "",
        today=sum(r["n"] for r in p["today"]), today_src=fmt(by_source(p["today"])),
        week=sum(r["n"] for r in p["week"]), week_src=fmt(by_source(p["week"])),
        all_src=" · ".join(f"{k} {v}" for k, v in by_source(p["all"]).items()) or "—",
        buyers_src=" · ".join(f"{k} {v}" for k, v in by_source(p["buyers"]).items()) or "—",
        subs=subs.get("PRO", 0) + subs.get("Простой", 0), pro=subs.get("PRO", 0), basic=subs.get("Простой", 0), trial=subs.get("Пробный день", 0),
        trial_all=p["trial_all"], trial7=p["trial7"], trial_paid=p["trial_paid"],
        trial_conv=f" ({round(p['trial_paid'] / p['trial_all'] * 100)}%)" if p["trial_all"] else "",
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
    add(bool(cfg.seller_inn), f"реквизиты в оферте: ИНН {cfg.seller_inn or '—'}" + (f", {cfg.seller_name}" if cfg.seller_name else ", без ФИО"),
        "впиши SELLER_INN — без него Робокасса не примет магазин")
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


MSK = timezone(timedelta(hours=3))
PLAN_NAMES = {"pro": "PRO", "basic": "Простой", "": "Простой", "trial": "Пробный день", "admin": "админ"}


def contacts_xlsx(rows, now: float) -> bytes:
    """База контактов в Excel: сводка сверху, дальше по строке на человека; фильтры и закреплённая шапка."""
    import io
    from openpyxl import Workbook
    from openpyxl.styles import Alignment, Font, PatternFill
    from openpyxl.utils import get_column_letter
    when = lambda ts: datetime.fromtimestamp(ts, MSK).strftime("%d.%m.%Y %H:%M") if ts else ""
    wb = Workbook(); ws = wb.active; ws.title = "Контакты"
    with_nick = sum(1 for r in rows if r["username"])
    ws.append([f"База контактов «Перехват» · {when(now)} МСК"])
    ws.append([f"Всего людей: {len(rows)} · с @username: {with_nick} · платили хоть раз: {sum(1 for r in rows if r['paid_n'])} · "
               f"заблокировали бота: {sum(1 for r in rows if r['blocked'])}"])
    ws.append([])
    head = ["№", "Telegram ID", "@username", "Написать", "Имя", "Фамилия", "Язык", "Откуда пришёл", "Первый заход", "Последний заход",
            "Тариф", "Оплачен до", "Заплатил всего, ₽", "Оплат", "Заблокировал бота"]
    ws.append(head)
    for i, r in enumerate(rows, 1):
        paid = r["paid_until"] or 0
        ws.append([i, r["id"], f"@{r['username']}" if r["username"] else "",
                   f"https://t.me/{r['username']}" if r["username"] else f"tg://user?id={r['id']}",
                   r["first_name"] or "", r["last_name"] or "", r["lang"] or "", source_name(r["source"]),
                   when(r["created_at"]), when(r["last_seen"] or r["created_at"]),
                   PLAN_NAMES.get(r["plan"] or "", r["plan"]) if paid > now else "—", when(paid) if paid > now else "",
                   r["paid_sum"], r["paid_n"], "да" if r["blocked"] else ""])
        ws.cell(row=ws.max_row, column=4).hyperlink = ws.cell(row=ws.max_row, column=4).value
    ws["A1"].font = Font(bold=True, size=14)
    for c in ws[4]:
        c.font = Font(bold=True, color="FFFFFF"); c.fill = PatternFill("solid", fgColor="FF7A1A"); c.alignment = Alignment(vertical="center")
    for k, w in enumerate([5, 14, 20, 30, 18, 18, 6, 14, 17, 17, 13, 17, 16, 7, 10], 1):
        ws.column_dimensions[get_column_letter(k)].width = w
    ws.freeze_panes = "A5"
    ws.auto_filter.ref = f"A4:{get_column_letter(len(head))}{ws.max_row}"
    buf = io.BytesIO(); wb.save(buf)
    return buf.getvalue()


@router.message(Command("contacts"))
@router.callback_query(F.data == "adm:contacts")
async def contacts(ev, ctx: Ctx) -> None:
    """📇 База контактов — только админу: Excel со всеми, кто нажимал /start."""
    msg = ev.message if isinstance(ev, CallbackQuery) else ev
    if not await is_admin(ev, ctx):
        return await ev.answer() if isinstance(ev, CallbackQuery) else None
    if isinstance(ev, CallbackQuery):
        await ev.answer("Собираю файл…")
    now = time.time()
    rows = await ctx.db.contacts()
    name = f"kontakty_{datetime.fromtimestamp(now, MSK).strftime('%Y-%m-%d')}.xlsx"
    await msg.answer_document(BufferedInputFile(contacts_xlsx(rows, now), filename=name),
                              caption=T.CONTACTS.format(n=len(rows), nick=sum(1 for r in rows if r["username"])))


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
    await add_links_to_base(msg, ctx, " ".join(parts[:-1] if region else parts), region)


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


async def send_table(msg: Message, rows: list, rej: list, name: str, sheet: str, caption: str) -> None:
    import finder
    data = finder.table(rows, rej, sheet)
    await msg.answer_document(BufferedInputFile(data, name), caption=caption)


@router.message(Command("tgfind"))
async def tgfind(msg: Message, ctx: Ctx, command: CommandObject) -> None:
    """/tgfind [N] — служебный аккаунт ищет N (по умолчанию 800) Telegram-каналов с продажей Б/У машин по России → таблица .xlsx."""
    if not await is_admin(msg, ctx):
        return
    if not (ctx.reader and ctx.reader.online):
        return await msg.answer("Служебный аккаунт не подключён — /connect")
    want = int(command.args) if (command.args or "").strip().isdigit() else 800
    await msg.answer(f"🔎 Ищу {want} Telegram-каналов с продажей Б/У машин по России: 3000+ подписчиков, 5+ постов за неделю, "
                     "без импорта «под заказ». Это долго (час-два: Telegram не даёт искать быстро) — буду писать, как идёт, "
                     "а в конце пришлю таблицу .xlsx.")

    async def run():
        known = {(r["username"] or "").lower() for r in await ctx.db._all("SELECT username FROM channels WHERE username IS NOT NULL")}
        try:
            rows, rej, n = await ctx.reader.tgfind(known, want, progress=lambda t: msg.answer("⏳ " + t))
        except Exception as e:
            return await msg.answer(f"Не получилось: {e}")
        await send_table(msg, rows, rej, "telegram_kanaly.xlsx", "Telegram",
                         f"✅ Подходят: {len(rows)} (лист «Telegram»), отсеяны с причиной: {len(rej)} (лист «Отсеяны»).\n"
                         f"Фраз поиска: {n['queries']} → кандидатов: {n['found']} → проверено: {n['checked']}.\n"
                         "В Google Таблицах: Файл → Импорт → Загрузить.")

    task = asyncio.create_task(run())
    ctx.background.add(task)
    task.add_done_callback(ctx.background.discard)


@router.message(Command("vkfind"))
async def vkfind(msg: Message, ctx: Ctx, command: CommandObject) -> None:
    """/vkfind — служебная страница ВК ищет барахолки с авто по России и проверяет их активность.
    /vkfind N — большой поиск: N групп (5000+ подписчиков, посты каждый день, без импорта) → таблица .xlsx."""
    if not await is_admin(msg, ctx):
        return
    if not vk_online(ctx):
        return await msg.answer("ВКонтакте не подключён — /vk")
    if (command.args or "").strip().isdigit():
        want = int(command.args)
        await msg.answer(f"🔎 Ищу {want} групп ВК с продажей Б/У машин по России: 5000+ подписчиков, посты каждый день, "
                         "без импорта. Займёт 10–30 минут — в конце пришлю таблицу .xlsx.")

        async def big():
            known = {r["vk_id"] for r in await ctx.db._all("SELECT vk_id FROM channels WHERE vk_id IS NOT NULL")}
            try:
                rows, rej, n = await ctx.vk.find_table(known, want, progress=lambda t: msg.answer("⏳ " + t))
            except vk.VKError as e:
                return await msg.answer(f"❌ ВК не дал искать: {e}. Если это «flood control» — попробуй через час-другой.")
            except Exception as e:
                return await msg.answer(f"Не получилось: {e}")
            await send_table(msg, rows, rej, "vk_gruppy.xlsx", "ВКонтакте",
                             f"✅ Подходят: {len(rows)} (лист «ВКонтакте»), отсеяны с причиной: {len(rej)} (лист «Отсеяны»).\n"
                             f"Фраз поиска: {n['queries']} → открытых автомобильных групп: {n['found']} → с 5000+ подписчиков: {n['big']}.\n"
                             "В Google Таблицах: Файл → Импорт → Загрузить.")
        task = asyncio.create_task(big())
        ctx.background.add(task)
        task.add_done_callback(ctx.background.discard)
        return
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
    return text + await queue_status(ctx), K.admin_base(rows, page)


TG_LIMIT = 500     # столько каналов Telegram разрешает одному аккаунту (с Premium — 1000)


async def queue_status(ctx: Ctx) -> str:
    """Почему очередь идёт медленно: темп вступлений, пауза от Telegram, лимит каналов на аккаунт (владелец 12.11)."""
    out = []
    tg_q = len(await ctx.db.queued_channels("tg"))
    if tg_q:
        hours = tg_q * ctx.cfg.join_interval / 3600
        out.append(f"⏳ Вступаю по одному каналу раз в {ctx.cfg.join_interval} с — очередь из {tg_q} займёт ≈ "
                   + (f"{hours:.1f} ч".replace(".", ",") if hours >= 1 else f"{max(1, round(hours * 60))} мин") + ".")
    pause = getattr(ctx.reader, "join_pause_until", 0) if ctx.reader else 0
    if pause and pause > time.time():
        out.append("⏸ Telegram попросил паузу на вступления до " + datetime.fromtimestamp(pause, MSK).strftime("%H:%M МСК")
                   + " (так он ограничивает частые вступления) — потом продолжу сам.")
    load = await ctx.db.tg_load()
    if load >= TG_LIMIT - 50:
        out.append(f"⚠️ Служебный аккаунт уже в {load} каналах Telegram (с очередью). Telegram разрешает одному аккаунту не больше "
                   f"{TG_LIMIT} (с Telegram Premium — 1000): сверх лимита каналы не подключатся. Нужен Premium на служебный аккаунт "
                   "или второй служебный аккаунт.")
    return ("\n\n" + "\n".join(out)) if out else ""


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
        when = lambda ts: datetime.fromtimestamp(ts, MSK).strftime("%d.%m.%Y %H:%M МСК") if ts else "—"
        status = {"joined": "читаю", "queued": "в очереди на вступление", "awaiting": "ждём одобрения админа",
                  "failed": "не подключился"}.get(ch["status"], ch["status"])
        url = channel_url(ch)
        text = T.ADMIN_CHANNEL.format(
            icon=K.STATUS_ICON.get(ch["status"], "?"), name=html.escape(name),
            kind="ВКонтакте" if ch["vk"] else "Telegram", link=f" · {url}" if url else "", status=status,
            error=f" ({html.escape(ch['error'])})" if ch["error"] else "", region=region_label(ctx, ch), posts=ch["posts"],
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
