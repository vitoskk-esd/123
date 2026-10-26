"""Путь поста от канала до человека — здесь решается скорость.

1. Служебный аккаунт получил пост (userbot.py) → RawPost.
2. Разбор правилами (миллисекунды); если модель или цена не нашлись — ИИ с коротким таймаутом.
3. Дубль? Цена рынка? Кому подходит? Всё — запросы к локальной SQLite.
4. Всем подходящим одновременно уходит карточка (марка, цена, −X% к рынку, маркеры, ссылка на пост).
   Параллельно служебный аккаунт пересылает пост в буферный канал, и бот копирует его людям с фото —
   без повторной загрузки фото.
"""
import asyncio
import html
import logging
import time
from collections.abc import Awaitable, Callable
from dataclasses import dataclass, field

from aiogram import Bot
from aiogram.exceptions import TelegramForbiddenError, TelegramRetryAfter

from . import keyboards as K
from . import llm, market
from . import texts as T
from .ctx import Ctx
from .db import DAY, DEDUP_DAYS, has_access
from .parse import Listing, car_key, fingerprint, looks_like_ad, parse_post
from .query import Filter, matches

log = logging.getLogger(__name__)
NOT_CLEAN = {"damaged", "parts", "notrun"}      # такие цены не идут в оценку рынка


@dataclass
class RawPost:
    chat_id: int                 # id канала в формате -100…
    msg_ids: list[int]           # несколько — если пост-альбом
    text: str
    date: float                  # время публикации (unix)
    has_media: bool = False
    forward: Callable[[], Awaitable[list[int]]] | None = None   # переслать в буфер → id сообщений там


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
    missed: list[int] = field(default_factory=list)
    latency_ms: int | None = None


class RateLimiter:
    """Не больше N сообщений в секунду (лимит Bot API ~30/с на всех) — иначе Telegram начнёт тормозить сам."""

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


FREE_LIMIT = RateLimiter()          # обычная рассылка: фото и запасной текст поста
PAID_LIMIT = RateLimiter(900)       # карточки при PAID_BROADCAST=1 — Telegram пропускает до 1000/с за звёзды


async def _send(coro_factory, uid: int, ctx: Ctx, limit: RateLimiter = FREE_LIMIT):
    """Отправка с одним повтором при «подожди N секунд» от Telegram."""
    for attempt in (1, 2):
        await limit.wait()
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


def card_text(ctx: Ctx, r: Result, channel: dict, filter_text: str, latency_ms: int, with_text: bool) -> str:
    L, d = r.listing, ctx.dict
    lines = []
    if r.scam:
        why = [d.markers[m].label for m in L.markers if m in d.markers and d.markers[m].kind == "scam"]
        if r.discount is not None and r.discount >= market.SCAM_FROM:
            why.insert(0, f"цена на {r.discount}% ниже рынка")
        lines.append(T.CARD_SCAM.format(why=": " + ", ".join(why) if why else ""))
    elif r.discount is not None and r.discount >= market.SHOW_FROM:
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
    if with_text:   # пост не удалось переслать (канал запрещает пересылку) — показываем его текст
        lines.append("\n<blockquote>" + html.escape(L.text[:700]) + "</blockquote>")
    return "\n".join(lines)


async def analyse(ctx: Ctx, raw: RawPost, channel: dict) -> Result:
    """Разбор, дубль, рынок. Без отправки — удобно и для тестов."""
    r = Result()
    L = parse_post(raw.text, ctx.dict, channel.get("region"))
    if not L.complete and ctx.cfg.llm_fallback and looks_like_ad(raw.text):
        L = await llm.enrich(L, ctx.dict, ctx.cfg.gemini_key, ctx.cfg.gemini_model)
    r.listing = L
    if not L.is_car or not L.price:
        return r
    now = time.time()
    fp, ckey = fingerprint(raw.text), car_key(L)
    r.duplicate = await ctx.db.seen_before(fp, ckey, now - DEDUP_DAYS * DAY)
    scam_marker = any(ctx.dict.markers[m].kind == "scam" for m in L.markers if m in ctx.dict.markers)
    clean = not (set(L.markers) & NOT_CLEAN) and not scam_marker
    r.post_id = await ctx.db.add_post(channel["id"], raw.msg_ids[0], L, fp, ckey, r.duplicate, clean)
    if L.model:
        prices = await ctx.db.market_prices(L.make, L.model, L.year, now - market.WINDOW_DAYS * DAY, r.post_id)
        r.market, r.samples = market.estimate(prices), len(prices)
        r.discount = market.discount(L.price, r.market)
    r.scam = scam_marker or (r.discount is not None and r.discount >= market.SCAM_FROM)
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
    since = time.time() - DEDUP_DAYS * DAY

    # кому подходит: первый подходящий фильтр каждого человека
    already = await ctx.db.delivered_to(fp, ckey, since)
    targets: dict[int, tuple] = {}
    now = time.time()
    for row in await ctx.db.subscribers(channel):
        uid = row["id"]
        if uid in targets or uid in r.missed or uid in already:
            continue
        if not matches(Filter.loads(row["data"]), L, r.discount):
            continue
        if not has_access(row, now):
            r.missed.append(uid)
            continue
        targets[uid] = (row["fid"], row["text"])
    if r.missed and not r.duplicate:    # та же машина из другого канала — не считаем дважды
        await ctx.db.add_missed_many(r.missed, (r.discount or 0) >= 10)
    if not targets:
        await ctx.db.finish_post(r.post_id, 0, 0)
        return r

    fwd = asyncio.create_task(raw.forward()) if raw.forward and raw.has_media and ctx.cfg.buffer_channel else None
    url = post_url(channel, raw.msg_ids[0])
    done: list[tuple] = []

    async def send_card(uid: int, fid: int, ftext: str):
        latency = int((time.time() - raw.date) * 1000)
        text = card_text(ctx, r, channel, ftext, latency, with_text=not fwd)
        paid = ctx.cfg.paid_broadcast
        m = await _send(lambda: bot.send_message(uid, text, reply_markup=K.card(url, fid), disable_web_page_preview=fwd is not None,
                                                 allow_paid_broadcast=paid or None),
                        uid, ctx, PAID_LIMIT if paid else FREE_LIMIT)
        if m:
            r.sent.append(uid)
            done.append((uid, r.post_id, fp, ckey, fid, r.discount, int((time.time() - raw.date) * 1000)))

    results = await asyncio.gather(*(send_card(uid, fid, ft) for uid, (fid, ft) in targets.items()), return_exceptions=True)
    for e in results:
        if isinstance(e, Exception):
            log.warning("карточка не отправлена: %s", e)
    if done:   # в базу — после рассылки, одной транзакцией: запись не тормозит отправку
        await ctx.db.add_deliveries(done)
    r.latency_ms = min(d[-1] for d in done) if done else None

    if fwd:
        try:
            ids = await fwd
        except Exception as e:     # канал запретил пересылку — люди уже получили карточку со ссылкой
            log.info("пересылка в буфер не удалась: %s", e)
            ids = []
        if ids:
            await asyncio.gather(*(_send(lambda uid=uid: bot.copy_messages(uid, ctx.cfg.buffer_channel, ids), uid, ctx)
                                   for uid in r.sent), return_exceptions=True)
        else:   # фото не пришли — досылаем текст поста, чтобы его можно было прочитать
            await asyncio.gather(*(_send(lambda uid=uid: bot.send_message(
                uid, "<blockquote>" + html.escape(L.text[:3500]) + "</blockquote>"), uid, ctx) for uid in r.sent),
                return_exceptions=True)
    await ctx.db.finish_post(r.post_id, r.latency_ms or 0, len(r.sent))
    return r
