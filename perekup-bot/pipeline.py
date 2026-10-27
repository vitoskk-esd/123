"""Путь поста от канала до человека — здесь решается скорость.

1. Служебный аккаунт получил пост (userbot.py) → RawPost.
2. Разбор правилами — доли миллисекунды.
3. Дубль? Цена рынка? Кому подходит? Всё — запросы к локальной SQLite.
4. Если в посте есть фото — служебный аккаунт пересылает его в закрытый канал-буфер (~0,5 с), и каждому уходит
   одно сообщение: фото машины, а в подписи — карточка. Фото Telegram копирует у себя, заново оно не загружается.
   Нет фото или канал запрещает пересылку — уходит обычная карточка с текстом поста.
"""
import asyncio
import html
import logging
import re
import time
from collections.abc import Awaitable, Callable
from dataclasses import dataclass, field
from statistics import median

from aiogram import Bot
from aiogram.exceptions import TelegramForbiddenError, TelegramRetryAfter
from aiogram.types import LinkPreviewOptions

import keyboards as K
import texts as T
from ctx import Ctx
from db import DAY, DEDUP_DAYS, has_access
import ai
from parse import Listing, car_key, fingerprint, looks_like_ad, parse_post
from query import Filter, matches

log = logging.getLogger(__name__)
NOT_CLEAN = {"damaged", "parts", "notrun"}      # такие цены не идут в оценку рынка
MARKET_DAYS = 90         # цены за сколько дней берём для оценки рынка
MARKET_MIN = 5           # меньше объявлений — оценку не показываем, чтобы не врать
SHOW_DISCOUNT = 5        # «ниже рынка» пишем от 5%
CAPTION_MAX = 1024       # лимит Telegram на подпись к фото
PHOTO_TIMEOUT = 3        # сколько ждём пересылку фото; дольше — шлём без фото, скорость важнее


@dataclass
class RawPost:
    chat_id: int                 # id канала в формате -100…
    msg_id: int
    text: str
    date: float                  # время публикации (unix)
    photo: Callable[[], Awaitable[int | None]] | None = None   # переслать фото в буфер → id сообщения там
    recv: float | None = None    # когда пост дошёл до бота — разница с date = задержка Telegram


@dataclass
class Result:
    listing: Listing | None = None
    post_id: int | None = None
    duplicate: bool = False
    discount: int | None = None
    market: int | None = None
    samples: int = 0
    sent: list[int] = field(default_factory=list)
    latency_ms: int | None = None
    teaser: bool = False         # анонс «скоро в продаже» — не шлём


class RateLimiter:
    """Не больше ~30 сообщений в секунду (лимит Telegram на бота) — иначе Telegram начнёт тормозить сам."""

    def __init__(self, per_second: int = 28):
        self.per_second = per_second
        self.sent: list[float] = []
        self.lock = asyncio.Lock()

    async def wait(self) -> None:
        async with self.lock:
            now = time.monotonic()
            self.sent = [t for t in self.sent if now - t < 1]
            if len(self.sent) >= self.per_second:
                await asyncio.sleep(1 - (now - self.sent[0]))
            self.sent.append(time.monotonic())


LIMIT = RateLimiter()


async def _send(coro_factory, uid: int, ctx: Ctx):
    """Отправка с одним повтором при «подожди N секунд» от Telegram."""
    for attempt in (1, 2):
        await LIMIT.wait()
        try:
            return await coro_factory()
        except TelegramRetryAfter as e:
            if attempt == 2:
                raise
            await asyncio.sleep(e.retry_after)
        except TelegramForbiddenError:
            await ctx.db.mark_blocked(uid)
            return None


def post_url(channel: dict, msg_id: int) -> str | None:
    if channel.get("username"):
        return f"https://t.me/{channel['username']}/{msg_id}"
    tg = abs(channel["tg_id"])
    if tg > 10**12:   # -100XXXXXXXXXX → внутренний id для t.me/c/ (откроется у тех, кто в канале)
        return f"https://t.me/c/{tg - 10**12}/{msg_id}"
    return None


def rub(v: int) -> str:
    return f"{v:,}".replace(",", " ") + " ₽"


def seconds(ms: int | None) -> str:
    if ms is None:
        return "—"
    return f"{ms / 1000:.1f} с".replace(".", ",") if ms < 60_000 else f"{ms // 60_000} мин"


def card_text(ctx: Ctx, r: Result, channel: dict, filter_text: str, latency_ms: int, limit: int = 4096) -> str:
    L, d = r.listing, ctx.dict
    lines = []
    if r.discount is not None and r.discount >= SHOW_DISCOUNT:
        lines.append(T.CARD_DISCOUNT.format(d=r.discount))
    lines.append(T.CARD_TITLE.format(car=html.escape(d.car_name(L.make, L.model)), year=f" {L.year}" if L.year else "",
                                     price=rub(L.price)))
    info = []
    if L.mileage:
        info.append(f"🛣 {L.mileage:,} км".replace(",", " "))
    if L.region:
        info.append(f"📍 {d.regions.get(L.region, L.region)}")
    if info:
        lines.append(" · ".join(info))
    if L.accidents is not None:
        lines.append(T.CARD_ACCIDENTS.format(n=L.accidents) if L.accidents else T.CARD_NO_ACCIDENTS)
    if r.market:
        lines.append(T.CARD_MARKET.format(market=rub(r.market), n=r.samples))
    good = [d.markers[m].label for m in L.markers if m in d.markers and d.markers[m].kind == "good"]
    bad = [d.markers[m].label for m in L.markers if m in d.markers and d.markers[m].kind == "bad"]
    if good:
        lines.append("⚡ " + " · ".join(good))
    if bad:
        lines.append("❗ " + " · ".join(bad))
    name = channel.get("title") or (f"@{channel['username']}" if channel.get("username") else "канал")
    lines.append(T.CARD_SOURCE.format(channel=html.escape(name), latency=seconds(latency_ms)))
    lines.append(T.CARD_FILTER.format(filter=html.escape(filter_text[:80])))
    head = "\n".join(lines)
    room = min(2500, limit - len(re.sub(r"<[^>]+>", "", head)) - 10)    # теги в лимит Telegram не входят
    post = L.text if len(L.text) <= room else L.text[:max(0, room - 1)].rstrip() + "…"
    return head + ("\n\n<blockquote expandable>" + html.escape(post) + "</blockquote>" if room > 20 else "")


# слова, при которых правила могут ошибиться — тогда пост перепроверяет ИИ
TRICKY = re.compile(r"скоро|через|анонс|выстав|куплю|обмен|не\s|нет\b|без\b|никак|по цене|дешевле|вместо|как у|"
                    r"дтп|авари|бит|залог|кредит|вложен|ремонт|такси|дубликат|запчаст|ход", re.I)


def worth_ai(L: Listing, text: str, filters: list[Filter], d) -> bool:
    """ИИ зовём, только если пост может кому-то подойти И правила могли ошибиться. Простой пост
    («Камри 2012, 900 000 ₽, Москва») правила разбирают сами — не ждём ИИ лишние 1–3 секунды."""
    if not filters:
        return False
    if not (L.is_car and L.price):
        return looks_like_ad(text)          # правила не поняли пост — пусть посмотрит ИИ
    wanted = any(not f.cars for f in filters) or any(mk == L.make for f in filters for mk, _ in f.cars)
    several = len({mk for mk, _ in d.find_cars(L.tokens)}) > 1     # в посте несколько марок — правила могли выбрать не ту
    if not (wanted or several):
        return False                        # эту марку никто не ищет — лимит не тратим
    return several or bool(TRICKY.search(text))


async def analyse(ctx: Ctx, raw: RawPost, channel: dict, filters: list[Filter] | None = None) -> Result:
    """Разбор (правила + ИИ-проверка), дубль, рынок. Без отправки — удобно и для тестов."""
    r = Result()
    L = r.listing = parse_post(raw.text, ctx.dict, channel.get("region"))
    if L.teaser:                            # «скоро в продаже» — купить ещё нельзя, не отвлекаем людей
        r.teaser = True
        return r
    if ctx.cfg.ai_on and worth_ai(L, raw.text, filters or [], ctx.dict):
        checked = await ai.ask(ctx.dict, raw.text, ctx.cfg.ai_key, ctx.cfg.ai_model)
        if checked:
            L = r.listing = ai.apply(L, checked, ctx.dict)
            if L.teaser:
                r.teaser = True
                return r
    if not L.is_car or not L.price:
        return r
    now = time.time()
    fp, ckey = fingerprint(raw.text), car_key(L)
    r.duplicate = await ctx.db.seen_before(fp, ckey, now - DEDUP_DAYS * DAY)
    clean = not (set(L.markers) & NOT_CLEAN)
    r.post_id = await ctx.db.add_post(channel["id"], raw.msg_id, L, fp, ckey, r.duplicate, clean)
    if L.model:
        # рынок — медиана той же модели ±1 год, без дублей и без битых: медиана не боится единичных выбросов
        prices = await ctx.db.market_prices(L.make, L.model, L.year, now - MARKET_DAYS * DAY, r.post_id)
        r.samples = len(prices)
        if r.samples >= MARKET_MIN:
            r.market = round(median(prices))
            r.discount = round((r.market - L.price) / r.market * 100)
    return r


async def process(bot: Bot, ctx: Ctx, raw: RawPost) -> Result:
    channel = ctx.channels.get(raw.chat_id)
    if not channel:
        return Result()
    rows = await ctx.db.subscribers(channel)
    # фото пересылаем сразу, параллельно с ИИ-проверкой, — а не после неё
    photo_task = None
    if raw.photo and ctx.buffer_chat and rows:
        quick = parse_post(raw.text, ctx.dict)
        if (quick.is_car or looks_like_ad(raw.text)) and not quick.teaser:
            photo_task = asyncio.create_task(raw.photo())
            photo_task.add_done_callback(lambda t: t.cancelled() or t.exception())   # ошибку разберём ниже
    r = await analyse(ctx, raw, channel, [Filter.loads(row["data"]) for row in rows])
    L = r.listing
    if r.teaser:
        await ctx.db.add_teaser(raw.chat_id, raw.msg_id)   # пришлём, когда анонс отредактируют в продажу
        return r
    await ctx.db.drop_teaser(raw.chat_id, raw.msg_id)
    if not r.post_id:
        return r
    fp, ckey = fingerprint(raw.text), car_key(L)

    # кому подходит: первый подходящий фильтр каждого человека; кому эта машина уже уходила — пропускаем
    already = await ctx.db.delivered_to(fp, ckey, time.time() - DEDUP_DAYS * DAY)
    targets: dict[int, tuple] = {}
    now = time.time()
    for row in rows:
        uid = row["id"]
        if uid in targets or uid in already:
            continue
        if ctx.cfg.payments_on and not has_access(row, now):
            continue
        if matches(Filter.loads(row["data"]), L, r.discount):
            targets[uid] = (row["fid"], row["text"])
    recv_ms = int((raw.recv - raw.date) * 1000) if raw.recv else None
    if not targets:
        await ctx.db.finish_post(r.post_id, 0, 0, recv_ms)
        return r

    url = post_url(channel, raw.msg_id)
    preview = LinkPreviewOptions(url=url, prefer_small_media=True) if url else LinkPreviewOptions(is_disabled=True)
    photo_id = None
    if photo_task:
        try:
            photo_id = await asyncio.wait_for(photo_task, PHOTO_TIMEOUT)
        except Exception as e:     # канал запретил пересылку, сеть — шлём без фото
            log.info("фото не переслано: %s", e)
    done: list[tuple] = []

    def message(uid: int, fid: int, ftext: str):
        latency = int((time.time() - raw.date) * 1000)
        if photo_id:
            caption = card_text(ctx, r, channel, ftext, latency, CAPTION_MAX)
            return lambda: bot.copy_message(uid, ctx.buffer_chat, photo_id, caption=caption, reply_markup=K.card(url, fid))
        text = card_text(ctx, r, channel, ftext, latency)
        return lambda: bot.send_message(uid, text, reply_markup=K.card(url, fid), link_preview_options=preview)

    async def send_card(uid: int, fid: int, ftext: str):
        if await _send(message(uid, fid, ftext), uid, ctx):
            r.sent.append(uid)
            done.append((uid, r.post_id, fp, ckey, fid, r.discount, int((time.time() - raw.date) * 1000)))

    results = await asyncio.gather(*(send_card(uid, fid, ft) for uid, (fid, ft) in targets.items()), return_exceptions=True)
    for e in results:
        if isinstance(e, Exception):
            log.warning("сообщение не отправлено: %s", e)
    if done:   # в базу — после рассылки, одной транзакцией: запись не тормозит отправку
        await ctx.db.add_deliveries(done)
    r.latency_ms = min(d[-1] for d in done) if done else None
    await ctx.db.finish_post(r.post_id, r.latency_ms or 0, len(r.sent), recv_ms)
    return r
