"""Генерация обложки кворка (картинка с крупным текстом на градиенте)."""

from __future__ import annotations

import hashlib
import textwrap
from pathlib import Path

from .config import CONFIG

SIZE = (660, 440)
PALETTES = [
    ((12, 18, 38), (34, 197, 94)),
    ((20, 10, 40), (168, 85, 247)),
    ((8, 24, 48), (56, 189, 248)),
    ((30, 12, 12), (249, 115, 22)),
    ((10, 30, 28), (45, 212, 191)),
    ((22, 22, 30), (250, 204, 21)),
]
FONT_CANDIDATES = [
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    "/usr/share/fonts/dejavu/DejaVuSans-Bold.ttf",
    "/Library/Fonts/Arial Bold.ttf",
    "C:/Windows/Fonts/arialbd.ttf",
]


def _font(size: int):
    from PIL import ImageFont

    for path in FONT_CANDIDATES:
        if Path(path).exists():
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


def make_cover(listing: dict) -> Path:
    from PIL import Image, ImageDraw

    seed = int(hashlib.md5(listing["id"].encode()).hexdigest(), 16)
    bg, accent = PALETTES[seed % len(PALETTES)]
    img = Image.new("RGB", SIZE, bg)
    draw = ImageDraw.Draw(img)

    # Диагональный градиент от фона к акценту.
    w, h = SIZE
    for y in range(h):
        for x in range(0, w, 4):
            t = min(1.0, (x / w * 0.5 + y / h * 0.5) ** 2 * 0.55)
            color = tuple(int(bg[i] + (accent[i] - bg[i]) * t) for i in range(3))
            draw.line([(x, y), (x + 4, y)], fill=color)

    draw.rectangle([40, 48, 120, 56], fill=accent)
    text = listing.get("cover_text") or listing["title"]
    lines = textwrap.wrap(text.upper(), width=18)[:4]
    font = _font(52 if len(lines) <= 2 else 42)
    y = 90
    for line in lines:
        draw.text((40, y), line, font=font, fill=(255, 255, 255))
        y += font.size + 12 if hasattr(font, "size") else 50

    sub = _font(22)
    draw.text((40, h - 70), f"{listing['days']} дн. · от {listing['price_rub']} ₽", font=sub, fill=accent)

    out_dir = CONFIG.data_dir / "covers"
    out_dir.mkdir(parents=True, exist_ok=True)
    path = out_dir / f"{listing['id']}.png"
    img.save(path)
    return path
