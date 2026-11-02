"""Подборка для того, кто нажал /start: 3 машины ниже рынка, пойманные за последние сутки, с фото.

Кандидатов собирает разбор постов: скидка к рынку от MIN_DISCOUNT% (и не больше MAX_DISCOUNT% — дальше почти всегда
ошибка цены), не битая, не дубль, есть фото. Фото смотрит ИИ: это машина снаружи? где на фото надписи, @ники,
телефоны, водяные знаки и логотипы каналов, госномера — эти места замазываем. Канал-источник нигде не показываем.
Каждому — свои варианты: кому какие машины уже показывали, помним.
"""
import asyncio
import base64
import html
import io
import json
import logging
import random
import time

from aiogram import Bot
from aiogram.types import BufferedInputFile, InputMediaPhoto

import ai
import texts as T
from ctx import Ctx
from db import DAY

log = logging.getLogger(__name__)
MIN_DISCOUNT, MAX_DISCOUNT = 10, 50
SHOW = 3                 # сколько машин в подборке
DAILY_CHECKS = 80        # сколько фото в сутки проверяет ИИ (бесплатный лимит не тратим на всё подряд)
NOT_SHOW = {"damaged", "parts", "notrun", "credit", "dupdoc"}
NUMS = ["1️⃣", "2️⃣", "3️⃣", "4️⃣"]

VISION = ("Это фото из объявления о продаже машины. Ответь JSON.\n"
          "car — на фото именно автомобиль (легковой, кроссовер, внедорожник, пикап), а не скриншот, текст, документ, "
          "человек, запчасть, салон крупным планом или коллаж из надписей.\n"
          "exterior — машина снята снаружи и видна целиком или почти целиком.\n"
          "quality — от 1 до 5: насколько фото чёткое и симпатичное для витрины.\n"
          "hide — прямоугольники [ymin, xmin, ymax, xmax] в шкале 0–1000 вокруг всего, что нужно замазать: любые надписи "
          "и водяные знаки поверх фото, названия и логотипы каналов, @ники, ссылки, телефоны, а также госномер машины. "
          "Нечего замазывать — пустой список.")
SCHEMA = {"type": "object", "properties": {
    "car": {"type": "boolean"}, "exterior": {"type": "boolean"}, "quality": {"type": "integer"},
    "hide": {"type": "array", "items": {"type": "array", "items": {"type": "integer"}}}},
    "required": ["car", "exterior", "quality", "hide"]}


def worth(r, markers) -> bool:
    """Годится ли машина в подборку — до проверки фото."""
    L = r.listing
    return (not r.duplicate and r.discount is not None and MIN_DISCOUNT <= r.discount <= MAX_DISCOUNT
            and bool(L.make and L.model and L.year and L.price) and not (set(markers) & NOT_SHOW))


def look(cfg, jpeg: bytes) -> dict | None:
    """ИИ смотрит фото (синхронно, в потоке)."""
    body = {"contents": [{"role": "user", "parts": [{"inline_data": {"mime_type": "image/jpeg", "data": base64.b64encode(jpeg).decode()}},
                                                    {"text": VISION}]}],
            "generationConfig": {"responseMimeType": "application/json", "responseJsonSchema": SCHEMA, "maxOutputTokens": 400,
                                 "temperature": 0}}
    for m in dict.fromkeys((cfg.ai_model, ai.FALLBACK)):
        try:
            return ai._post(cfg.ai_key, m, body, timeout=25)
        except Exception as e:
            log.info("фото для подборки не проверено (%s): %s", m, e)
    return None


def blur(jpeg: bytes, boxes: list) -> bytes:
    """Замазать места [ymin, xmin, ymax, xmax] (0–1000): крупная мозаика + размытие, с запасом по краям."""
    from PIL import Image, ImageFilter
    im = Image.open(io.BytesIO(jpeg)).convert("RGB")
    W, H = im.size
    for b in boxes:
        if len(b) != 4:
            continue
        y0, x0, y1, x1 = (max(0, min(1000, int(v))) for v in b)
        if y1 <= y0 or x1 <= x0:
            continue
        py, px = (y1 - y0) * .12 + 6, (x1 - x0) * .06 + 6
        box = (int(max(0, x0 - px) * W / 1000), int(max(0, y0 - py) * H / 1000), int(min(1000, x1 + px) * W / 1000), int(min(1000, y1 + py) * H / 1000))
        if box[2] - box[0] < 4 or box[3] - box[1] < 4:
            continue
        part = im.crop(box)
        small = part.resize((max(1, part.width // 18), max(1, part.height // 18)), Image.BILINEAR)
        im.paste(small.resize(part.size, Image.NEAREST).filter(ImageFilter.GaussianBlur(6)), box)
    out = io.BytesIO(); im.save(out, "JPEG", quality=88)
    return out.getvalue()


async def collect(bot: Bot, ctx: Ctx, r, photo_task, latency_ms: int) -> None:
    """Кандидат в подборку: достаём фото из буфера, проверяем ИИ, замазываем, кладём готовое фото обратно в буфер."""
    try:
        if not (ctx.cfg.ai_on and ctx.buffer_chat) or await ctx.db.showcase_checked_since(time.time() - DAY) >= DAILY_CHECKS:
            return
        L = r.listing
        if await ctx.db.showcase_has(r.post_id, L.make, L.model, L.year, L.price, time.time() - DAY):
            return
        photo_id = await asyncio.wait_for(photo_task, 30)
        if not photo_id:
            return
        fwd = await bot.forward_message(ctx.buffer_chat, ctx.buffer_chat, photo_id, disable_notification=True)
        try:
            if not fwd.photo:
                return
            data = await bot.download(fwd.photo[-1].file_id)
        finally:
            try:
                await bot.delete_message(ctx.buffer_chat, fwd.message_id)
            except Exception:
                pass
        jpeg = data.getvalue()
        seen = await asyncio.to_thread(look, ctx.cfg, jpeg)
        ok = bool(seen and seen.get("car") and seen.get("exterior") and (seen.get("quality") or 0) >= 3)
        file_id = None
        if ok:
            clean = await asyncio.to_thread(blur, jpeg, seen.get("hide") or [])
            sent = await bot.send_photo(ctx.buffer_chat, BufferedInputFile(clean, "car.jpg"), disable_notification=True)
            file_id = sent.photo[-1].file_id
        await ctx.db.add_showcase(r.post_id, L, r.discount, latency_ms, file_id, "ok" if ok else "bad" if seen else "fail",
                                  (seen or {}).get("quality"))
    except Exception as e:
        log.info("подборка: машина не добавлена (%s)", e)


def caption(ctx: Ctx, rows) -> str:
    d, lines = ctx.dict, [T.SHOWCASE_HEAD]
    for k, r in enumerate(rows):
        car = html.escape(d.car_name(r["make"], r["model"]))
        info = [f"📍 {html.escape(d.regions.get(r['region'], r['region']))}"] if r["region"] else []
        if r["mileage"]:
            info.append(f"{r['mileage']:,} км".replace(",", " "))
        info.append(f"⏱ поймал за {r['latency_ms'] / 1000:.1f} с".replace(".", ",") if r["latency_ms"] and r["latency_ms"] < 60_000 else "⏱ сразу после публикации")
        lines.append(T.SHOWCASE_ITEM.format(n=NUMS[k], car=car, year=r["year"], price=f"{r['price']:,}".replace(",", " "),
                                            d=r["discount"], info=" · ".join(info)))
    lines.append(T.SHOWCASE_TAIL)
    return "\n\n".join(lines)


def pick(rows, n: int = SHOW) -> list:
    """Из свежих кандидатов — n разных машин: чем больше скидка и лучше фото, тем вероятнее; разные марки, если можно."""
    pool = sorted(rows, key=lambda r: -(r["discount"] + 3 * (r["quality"] or 3)))[:15]
    out, makes = [], set()
    while pool and len(out) < n:
        weights = [max(1, r["discount"]) * (0.35 if r["make"] in makes else 1) for r in pool]
        r = random.choices(pool, weights)[0]
        pool.remove(r)
        out.append(r); makes.add(r["make"])
    return out


async def send(bot: Bot, ctx: Ctx, uid: int) -> bool:
    """Подборка человеку после /start: свои варианты, которых он ещё не видел. Нечего показать — молчим."""
    try:
        rows = await ctx.db.showcase_fresh(uid, time.time() - DAY)
        chosen = pick(rows)
        if len(chosen) < 2:
            return False
        media = [InputMediaPhoto(media=r["file_id"]) for r in chosen]
        media[0].caption = caption(ctx, chosen)
        await bot.send_media_group(uid, media)
        await ctx.db.showcase_seen(uid, [r["post_id"] for r in chosen])
        return True
    except Exception as e:
        log.info("подборка не отправлена: %s", e)
        return False
