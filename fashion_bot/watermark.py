"""Водяной знак магазина и подготовка фото под Telegram и Instagram."""

from __future__ import annotations

import io
from pathlib import Path

from .config import CONFIG, ROOT

INSTAGRAM_SIZES = {"portrait": (1080, 1350), "square": (1080, 1080)}
TELEGRAM_MAX_SIDE = 2048

# Шрифт должен уметь кириллицу, если в названии магазина есть русские буквы.
FONT_CANDIDATES = [
    ROOT / "assets/fonts/WorkSans-Bold.ttf",
    ROOT / "assets/fonts/JetBrainsMono-Bold.ttf",
    Path("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"),
    Path("/usr/share/fonts/dejavu/DejaVuSans-Bold.ttf"),
    Path("/Library/Fonts/Arial Bold.ttf"),
    Path("/System/Library/Fonts/Supplemental/Arial Bold.ttf"),
    Path("C:/Windows/Fonts/arialbd.ttf"),
]


def _glyph(font, ch: str) -> bytes:
    from PIL import Image, ImageDraw

    img = Image.new("L", (64, 64))
    ImageDraw.Draw(img).text((0, 0), ch, font=font, fill=255)
    return img.tobytes()


def _supports(font, text: str) -> bool:
    """Нет ли в тексте символов, которых нет в шрифте (они рисуются одинаковыми «квадратиками»)."""
    from PIL import ImageFont

    small = font.font_variant(size=40) if isinstance(font, ImageFont.FreeTypeFont) else font
    missing = _glyph(small, "\U0010fffd")
    return all(ch.isspace() or _glyph(small, ch) != missing for ch in set(text))


def _font(size: int, text: str):
    from PIL import ImageFont

    candidates = [ROOT / CONFIG.watermark_font] if CONFIG.watermark_font else []
    for path in candidates + FONT_CANDIDATES:
        if path.exists():
            font = ImageFont.truetype(str(path), size)
            if _supports(font, text):
                return font
    return ImageFont.load_default(size)


def _text_mark(text: str, width: int):
    """Текст белым цветом с тёмной обводкой — читается и на светлом, и на тёмном фото."""
    from PIL import Image, ImageDraw

    probe = 100
    font = _font(probe, text)
    left, top, right, bottom = font.getbbox(text)
    size = max(10, int(probe * width / max(1, right - left)))
    font = _font(size, text)
    stroke = max(1, size // 18)
    left, top, right, bottom = font.getbbox(text, stroke_width=stroke)
    mark = Image.new("RGBA", (right - left + 2, bottom - top + 2), (0, 0, 0, 0))
    ImageDraw.Draw(mark).text(
        (-left + 1, -top + 1), text, font=font, fill=(255, 255, 255, 255),
        stroke_width=stroke, stroke_fill=(0, 0, 0, 160),
    )
    return mark


def _logo_mark(path: str, width: int):
    from PIL import Image

    with Image.open(path) as logo:
        logo = logo.convert("RGBA")
        ratio = width / logo.width
        return logo.resize((width, max(1, int(logo.height * ratio))), Image.LANCZOS)


def make_mark(width: int):
    if CONFIG.watermark_logo:
        logo = Path(CONFIG.watermark_logo)
        mark = _logo_mark(str(logo if logo.is_absolute() else ROOT / logo), width)
    else:
        mark = _text_mark(CONFIG.mark_text, width)
    if CONFIG.watermark_opacity < 1:
        alpha = mark.getchannel("A").point(lambda a: int(a * CONFIG.watermark_opacity))
        mark.putalpha(alpha)
    return mark


def apply_watermark(img, position: str | None = None):
    """Накладывает знак магазина на картинку PIL и возвращает новую RGB-картинку."""
    from PIL import Image

    position = position or CONFIG.watermark_position
    base = img.convert("RGBA")
    w, h = base.size
    short = min(w, h)
    layer = Image.new("RGBA", base.size, (0, 0, 0, 0))

    if position == "tile":
        mark = make_mark(max(20, int(short * CONFIG.watermark_scale * 0.7))).rotate(30, expand=True, resample=Image.BICUBIC)
        step_x, step_y = int(mark.width * 1.8), int(mark.height * 2.2)
        for row, y in enumerate(range(-mark.height, h + mark.height, step_y)):
            shift = step_x // 2 if row % 2 else 0
            for x in range(-mark.width + shift, w + mark.width, step_x):
                layer.paste(mark, (x, y), mark)
    else:
        mark = make_mark(max(20, int(short * CONFIG.watermark_scale)))
        m = int(short * CONFIG.watermark_margin)
        xs = {"left": m, "right": w - mark.width - m, "center": (w - mark.width) // 2}
        ys = {"top": m, "bottom": h - mark.height - m, "center": (h - mark.height) // 2}
        if position == "center":
            x, y = xs["center"], ys["center"]
        else:
            vert, _, horiz = position.partition("-")
            x, y = xs.get(horiz, xs["right"]), ys.get(vert, ys["bottom"])
        layer.paste(mark, (x, y), mark)

    return Image.alpha_composite(base, layer).convert("RGB")


def _edge_color(img, box) -> tuple[int, int, int]:
    from PIL import ImageStat

    return tuple(int(c) for c in ImageStat.Stat(img.crop(box)).median)


def fit_instagram(img):
    """Приводит фото к формату ленты Instagram.

    pad — фото целиком, свободные поля залиты цветом краёв фото (для студийных снимков
    товара выглядит бесшовно); blur — поля из размытого фото; crop — обрезка по центру.
    """
    from PIL import Image, ImageFilter, ImageOps

    size = INSTAGRAM_SIZES.get(CONFIG.instagram_format, INSTAGRAM_SIZES["portrait"])
    img = img.convert("RGB")
    if CONFIG.instagram_fit == "crop":
        return ImageOps.fit(img, size, Image.LANCZOS)
    fg = ImageOps.contain(img, size, Image.LANCZOS)
    x, y = (size[0] - fg.width) // 2, (size[1] - fg.height) // 2
    if CONFIG.instagram_fit == "blur":
        canvas = ImageOps.fit(img, size, Image.LANCZOS).filter(ImageFilter.GaussianBlur(40))
    else:
        canvas = Image.new("RGB", size)
        w, h = fg.size
        if y:  # поля сверху и снизу
            canvas.paste(_edge_color(fg, (0, 0, w, 3)), (0, 0, size[0], y + 1))
            canvas.paste(_edge_color(fg, (0, h - 3, w, h)), (0, y + h - 1, size[0], size[1]))
        else:  # поля слева и справа
            canvas.paste(_edge_color(fg, (0, 0, 3, h)), (0, 0, x + 1, size[1]))
            canvas.paste(_edge_color(fg, (w - 3, 0, w, h)), (x + w - 1, 0, size[0], size[1]))
    canvas.paste(fg, (x, y))
    return canvas


def _open(data: bytes):
    from PIL import Image, ImageOps

    img = Image.open(io.BytesIO(data))
    img = ImageOps.exif_transpose(img)
    if img.mode in ("RGBA", "LA", "P"):
        img = img.convert("RGBA")
        bg = Image.new("RGB", img.size, (255, 255, 255))
        bg.paste(img, mask=img.getchannel("A"))
        img = bg
    return img.convert("RGB")


def prepare_images(photos: list[bytes], out_dir: Path) -> tuple[list[Path], list[Path]]:
    """Готовит два набора JPEG с водяным знаком: для Telegram (исходные пропорции) и Instagram."""
    out_dir.mkdir(parents=True, exist_ok=True)
    tg, ig = [], []
    for i, data in enumerate(photos, 1):
        img = _open(data)
        tg_img = img.copy()
        tg_img.thumbnail((TELEGRAM_MAX_SIDE, TELEGRAM_MAX_SIDE))
        p = out_dir / f"tg_{i}.jpg"
        apply_watermark(tg_img).save(p, "JPEG", quality=92)
        tg.append(p)
        p = out_dir / f"ig_{i}.jpg"
        apply_watermark(fit_instagram(img)).save(p, "JPEG", quality=92)
        ig.append(p)
    return tg, ig
