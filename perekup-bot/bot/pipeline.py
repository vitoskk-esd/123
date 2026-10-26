"""Путь поста от канала до человека — здесь решается скорость.

1. Служебный аккаунт получил пост (userbot.py) → RawPost.
2. Разбор правилами — доли миллисекунды.
3. Дубль? Цена рынка? Кому подходит? Всё — запросы к локальной SQLite.
4. Всем подходящим одновременно уходит одно сообщение: оценка, маркеры, текст поста и превью со ссылкой на пост.
"""
import asyncio
import html
import logging
import time
from dataclasses import dataclass, field
from statistics import median

from aiogram import Bot
from aiogram.exceptions import TelegramForbiddenError, TelegramRetryAfter
from aiogram.types import LinkPreviewOptions

from . import keyboards as K
from . import texts as T
from .ctx import Ctx
from .db import DAY, DEDUP_DAYS, has_access
from .parse import Listing, car_key, fingerprint, parse_post
from .query import Filter, matches

log = logging.getLogger(__name__)
NOT_CLEAN = {"damaged", "parts", "notrun"}      # такие цены не идут в оценку рынка
MARKET_DAYS = 90         # цены за сколько дней берём для оценки рынка
MARKET_MIN = 5           # меньше объявлений — оценку не показываем, чтобы не врать
SHOW_DISCOUNT = 5        # «ниже рынка» пишем от 5%
SCAM_DISCOUNT = 45       # дешевле рынка почти вдвое — скорее всего мошенники


@dataclass
class RawPost:
    chat_id: int                 # id канала в формате -100…
    msg_id: int
    text: str
    date: float                  # время публикации (unix)


@dataclass
class Result:
    listing: Listing | None = None
    post_id: int | None = None
    duplicate: bool = False
    discount: int | None = None
    market: int | None = None
    samples: int = 0
    scam: bool = False
    sent: list[int] = field(default_factory=list)
    latency_ms: int | None = None


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


def card_text(ctx: Ctx, r: Result, channel: dict, filter_text: str, latency_ms: int) -> str:
    L, d = r.listing, ctx.dict
    lines = []
    if r.scam:
        why = [d.markers[m].label for m in L.markers if m in d.markers and d.markers[m].kind == "scam"]
        if r.discount is not None and r.discount >= SCAM_DISCOUNT:
            why.insert(0, f"цена на {r.discount}% ниже рынка")
        lines.append(T.CARD_SCAM.format(why=": " + ", ".join(why) if why else ""))
    elif r.discount is not None and r.discount >= SHOW_DISCOUNT:
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
    lines.append("\n<blockquote expandable>" + html.escape(L.text[:2500]) + "</blockquote>")
    return "\n".join(lines)


async def analyse(ctx: Ctx, raw: RawPost, channel: dict) -> Result:
    """Разбор, дубль, рынок. Без отправки — удобно и для тестов."""
    r = Result()
    L = r.listing = parse_post(raw.text, ctx.dict, channel.get("region"))
    if not L.is_car or not L.price:
        return r
    now = time.time()
    fp, ckey = fingerprint(raw.text), car_key(L)
    r.duplicate = await ctx.db.seen_before(fp, ckey, now - DEDUP_DAYS * DAY)
    scam_marker = any(ctx.dict.markers[m].kind == "scam" for m in L.markers if m in ctx.dict.markers)
    clean = not (set(L.markers) & NOT_CLEAN) and not scam_marker
    r.post_id = await ctx.db.add_post(channel["id"], raw.msg_id, L, fp, ckey, r.duplicate, clean)
    if L.model:
        # рынок — медиана той же модели ±1 год, без дублей и без битых: медиана не боится единичных выбросов
        prices = await ctx.db.market_prices(L.make, L.model, L.year, now - MARKET_DAYS * DAY, r.post_id)
        r.samples = len(prices)
        if r.samples >= MARKET_MIN:
            r.market = round(median(prices))
            r.discount = round((r.market - L.price) / r.market * 100)
    r.scam = scam_marker or (r.discount is not None and r.discount >= SCAM_DISCOUNT)
    return r


async def process(bot: Bot, ctx: Ctx, raw: RawPost) -> Result:
    channel = ctx.channels.get(raw.chat_id)
    if not channel:
        return Result()
    r = await analyse(ctx, raw, channel)
    L = r.listing
    if not r.post_id:
        return r
    fp, ckey = fingerprint(raw.text), car_key(L)

    # кому подходит: первый подходящий фильтр каждого человека; кому эта машина уже уходила — пропускаем
    already = await ctx.db.delivered_to(fp, ckey, time.time() - DEDUP_DAYS * DAY)
    targets: dict[int, tuple] = {}
    now = time.time()
    for row in await ctx.db.subscribers(channel):
        uid = row["id"]
        if uid in targets or uid in already:
            continue
        if ctx.cfg.payments_on and not has_access(row, now):
            continue
        if matches(Filter.loads(row["data"]), L, r.discount):
            targets[uid] = (row["fid"], row["text"])
    if not targets:
        await ctx.db.finish_post(r.post_id, 0, 0)
        return r

    url = post_url(channel, raw.msg_id)
    preview = LinkPreviewOptions(url=url, prefer_small_media=True) if url else LinkPreviewOptions(is_disabled=True)
    done: list[tuple] = []

    async def send_card(uid: int, fid: int, ftext: str):
        text = card_text(ctx, r, channel, ftext, int((time.time() - raw.date) * 1000))
        if await _send(lambda: bot.send_message(uid, text, reply_markup=K.card(url, fid), link_preview_options=preview), uid, ctx):
            r.sent.append(uid)
            done.append((uid, r.post_id, fp, ckey, fid, r.discount, int((time.time() - raw.date) * 1000)))

    results = await asyncio.gather(*(send_card(uid, fid, ft) for uid, (fid, ft) in targets.items()), return_exceptions=True)
    for e in results:
        if isinstance(e, Exception):
            log.warning("сообщение не отправлено: %s", e)
    if done:   # в базу — после рассылки, одной транзакцией: запись не тормозит отправку
        await ctx.db.add_deliveries(done)
    r.latency_ms = min(d[-1] for d in done) if done else None
    await ctx.db.finish_post(r.post_id, r.latency_ms or 0, len(r.sent))
    return r
