#!/usr/bin/env python3
"""Аватарка и шапка YouTube нового образа Арбузова (владелец 15.10: «создадим новый образ Арбузова, новую аватарку и шапку»).
Картинки рисует Higgsfield (reels/arb-story-20/hf/a_dXX.png, b_dXX.png), надписи кладём здесь — нейросеть пишет по-русски с ошибками.
Шапка 2560×1440: всё важное — в безопасной зоне 1546×423 по центру (x 507–2053, y 508–931), её видно и на телефоне.
  <python с PIL> make_brand.py d01 d02 d03   →   out/<d>_banner.jpg (загружать), <d>_banner_desktop.jpg / _mobile.jpg (как увидят), out/<d>_avatar.png (800×800)
"""
import os, sys
from PIL import Image, ImageDraw, ImageFilter, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.abspath(os.path.join(HERE, "../../.."))
SRC = os.path.join(ROOT, "reels/arb-story-20/hf"); OUT = os.path.join(HERE, "out"); os.makedirs(OUT, exist_ok=True)
FONT = os.path.join(ROOT, "youtube/kit/fonts/Unbounded.ttf")
TITLE, TAG = "АРБУЗОВ", "проверяет денежные схемы за тебя"
OL, YEL = (30, 23, 23), (255, 224, 102)


def font(size, wght):
    f = ImageFont.truetype(FONT, size)
    try: f.set_variation_by_axes([wght])
    except Exception: pass
    return f


def cover(im, w, h):
    s = max(w / im.width, h / im.height); im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
    x, y = (im.width - w) // 2, (im.height - h) // 2
    return im.crop((x, y, x + w, y + h))


def text(img, xy, s, f, fill, stroke, shadow=10):
    sh = Image.new("RGBA", img.size, (0, 0, 0, 0)); d = ImageDraw.Draw(sh)
    d.text((xy[0], xy[1] + shadow), s, font=f, fill=OL + (255,), stroke_width=stroke, stroke_fill=OL + (255,))
    img.alpha_composite(sh.filter(ImageFilter.GaussianBlur(2)))
    ImageDraw.Draw(img).text(xy, s, font=f, fill=fill, stroke_width=stroke, stroke_fill=OL)


def banner(d):
    """YouTube показывает на компьютере только полосу 2560×423 по центру, на телефоне — 1546×423. Картинку нейросети целиком
    вписываем так, чтобы герои (по высоте ≈ 15–95 % кадра) попали в эту полосу; вокруг — размытое продолжение того же фона (видно на ТВ)."""
    src = Image.open(f"{SRC}/b_{d}.png").convert("RGB")
    bg = cover(src, 2560, 1440).filter(ImageFilter.GaussianBlur(40))
    bg = Image.blend(bg, Image.new("RGB", bg.size, (20, 14, 12)), .35).convert("RGBA")
    h = round(423 / .80); w = round(src.width * h / src.height)           # 80 % высоты картинки = высота полосы
    pic = src.resize((w, h), Image.LANCZOS).convert("RGBA")
    m = Image.new("L", (w, h), 255); md = ImageDraw.Draw(m)
    for i in range(60): md.rectangle((i, i, w - 1 - i, h - 1 - i), outline=int(255 * i / 60))   # мягкие края
    pic.putalpha(m)
    x0, y0 = 2053 - w + 40, 508 - round(.15 * h)
    bg.alpha_composite(pic, (x0, y0))
    im = bg
    # надпись — слева в безопасной зоне
    text(im, (545, 560), TITLE, font(132, 900), YEL, 9, 12)
    pill_f = font(36, 700); tw = ImageDraw.Draw(im).textlength(TAG, font=pill_f)
    ImageDraw.Draw(im).rounded_rectangle((545, 760, 545 + tw + 50, 832), 20, fill=(226, 40, 63), outline=OL, width=6)
    ImageDraw.Draw(im).text((570, 772), TAG, font=pill_f, fill="white")
    im.convert("RGB").save(f"{OUT}/{d}_banner.jpg", quality=92)
    # как увидят зрители: компьютер (2560×423) и телефон (1546×423)
    im.convert("RGB").crop((0, 508, 2560, 931)).resize((1280, 212)).save(f"{OUT}/{d}_banner_desktop.jpg", quality=88)
    im.convert("RGB").crop((507, 508, 2053, 931)).save(f"{OUT}/{d}_banner_mobile.jpg", quality=88)


def avatar(d):
    im = cover(Image.open(f"{SRC}/a_{d}.png").convert("RGB"), 800, 800)
    im.save(f"{OUT}/{d}_avatar.png")
    m = Image.new("L", (800, 800), 0); ImageDraw.Draw(m).ellipse((0, 0, 799, 799), fill=255)
    c = Image.new("RGBA", (800, 800), (0, 0, 0, 0)); c.paste(im, (0, 0), m); c.save(f"{OUT}/{d}_avatar_circle.png")


def banner_clean(name, top=.12, span=.80, feather=150):
    """Шапка без текста (владелец 15.10: «текст отстой, можно просто без текста»): картинка целиком по центру, герои (по высоте
    top … top+span кадра) — в полосе 423 px, которую видно на телефоне и компьютере; по краям — размытое продолжение того же фона."""
    src = Image.open(f"{SRC}/{name}.png").convert("RGB")
    bg = cover(src, 2560, 1440).filter(ImageFilter.GaussianBlur(45))
    bg = Image.blend(bg, Image.new("RGB", bg.size, (24, 18, 16)), .25).convert("RGBA")
    h = round(423 / span); w = round(src.width * h / src.height)
    pic = src.resize((w, h), Image.LANCZOS).convert("RGBA")
    m = Image.new("L", (w, h), 255); md = ImageDraw.Draw(m)
    for i in range(feather): md.line([(i, 0), (i, h)], fill=int(255 * (i / feather) ** 1.5)); md.line([(w - 1 - i, 0), (w - 1 - i, h)], fill=int(255 * (i / feather) ** 1.5))
    pic.putalpha(m)
    bg.alpha_composite(pic, ((2560 - w) // 2, 508 - round(top * h)))
    im = bg.convert("RGB"); im.save(f"{OUT}/{name}_banner.jpg", quality=92)
    im.crop((0, 508, 2560, 931)).resize((1280, 212)).save(f"{OUT}/{name}_banner_desktop.jpg", quality=88)
    im.crop((507, 508, 2053, 931)).save(f"{OUT}/{name}_banner_mobile.jpg", quality=88)


def feathered(im, f):
    im = im.convert("RGBA")
    if f:
        m = Image.new("L", im.size, 255); md = ImageDraw.Draw(m)
        for i in range(f): md.rectangle((i, i, im.width - 1 - i, im.height - 1 - i), outline=int(255 * i / f))
        im.putalpha(m)
    return im


def banner_wide(name, cy):
    """Шапка без текста из «отдалённой» картинки (герои мелкие, по центру высоты кадра ≈ cy): картинка на всю ширину 2560,
    сдвинута так, чтобы герои стояли в полосе 423 px; пустые края сверху/снизу (видно только на ТВ) — размытый фон."""
    src = Image.open(f"{SRC}/{name}.png").convert("RGB")
    w = round(2560 * float(os.environ.get("SC", ".94"))); h = round(src.height * w / src.width)
    bg = cover(src, 2560, 1440).filter(ImageFilter.GaussianBlur(45)).convert("RGBA")
    bg.alpha_composite(feathered(src.resize((w, h), Image.LANCZOS), 0 if w >= 2560 else 60), ((2560 - w) // 2, round(719.5 - cy * h)))
    im = bg.convert("RGB"); im.save(f"{OUT}/{name}_banner.jpg", quality=92)
    im.crop((0, 508, 2560, 931)).resize((1280, 212)).save(f"{OUT}/{name}_banner_desktop.jpg", quality=88)
    im.crop((507, 508, 2053, 931)).save(f"{OUT}/{name}_banner_mobile.jpg", quality=88)


if __name__ == "__main__":
    for d in sys.argv[1:]:
        if d.startswith("w_"): banner_wide(d, float(os.environ.get("CY", ".535"))); print(d, "ok"); continue
        if d.startswith("g_"): banner_clean(d); print(d, "ok"); continue
        if os.path.exists(f"{SRC}/b_{d}.png"): banner(d)
        if os.path.exists(f"{SRC}/a_{d}.png"): avatar(d)
        print(d, "ok")
