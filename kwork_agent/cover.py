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


def _wrap(draw, text: str, font, max_w: int) -> list[str]:
    lines: list[str] = []
    for word in text.split():
        if lines and draw.textlength(f"{lines[-1]} {word}", font=font) <= max_w:
            lines[-1] += f" {word}"
        else:
            lines.append(word)
    return lines


def _fit(draw, text: str, max_w: int):
    """Самый крупный шрифт, при котором текст влезает по ширине в 4 строки."""
    for size in (56, 50, 44, 38, 32, 28):
        font = _font(size)
        lines = _wrap(draw, text, font, max_w)
        if len(lines) <= 4 and all(draw.textlength(l, font=font) <= max_w for l in lines):
            return font, lines
    return font, textwrap.wrap(text, width=30)[:4]


def draw_texts(img, listing: dict, accent: tuple, max_w: int | None = None) -> None:
    """Полоска-акцент, крупный заголовок и строка «срок · цена» поверх картинки."""
    from PIL import ImageDraw

    draw = ImageDraw.Draw(img)
    w, h = img.size
    draw.rectangle([40, 48, 120, 56], fill=accent)
    text = (listing.get("cover_text") or listing["title"]).upper()
    font, lines = _fit(draw, text, max_w or w - 80)
    y = 90
    for line in lines:
        draw.text((40, y), line, font=font, fill=(255, 255, 255))
        y += font.size + 12 if hasattr(font, "size") else 50
    draw.text((40, h - 70), f"{listing['days']} дн. · от {listing['price_rub']} ₽", font=_font(22), fill=accent)


def make_cover(listing: dict, out_dir: Path | None = None, palette: int | None = None) -> Path:
    """palette — номер цвета из PALETTES; по умолчанию выбирается по id объявления."""
    from PIL import Image, ImageDraw

    seed = int(hashlib.md5(listing["id"].encode()).hexdigest(), 16)
    bg, accent = PALETTES[(seed if palette is None else palette) % len(PALETTES)]
    img = Image.new("RGB", SIZE, bg)
    draw = ImageDraw.Draw(img)

    # Диагональный градиент от фона к акценту.
    w, h = SIZE
    for y in range(h):
        for x in range(0, w, 4):
            t = min(1.0, (x / w * 0.5 + y / h * 0.5) ** 2 * 0.55)
            color = tuple(int(bg[i] + (accent[i] - bg[i]) * t) for i in range(3))
            draw.line([(x, y), (x + 4, y)], fill=color)

    draw_texts(img, listing, accent)

    out_dir = out_dir or CONFIG.data_dir / "covers"
    out_dir.mkdir(parents=True, exist_ok=True)
    path = out_dir / f"{listing['id']}.png"
    img.save(path)
    return path


def cover_for(listing: dict) -> Path:
    """Готовая обложка (например, пришла из бота через import) или новая."""
    for ext in ("jpg", "png"):
        path = CONFIG.data_dir / "covers" / f"{listing['id']}.{ext}"
        if path.exists():
            return path
    return make_cover(listing)
