"""Обложка поста: рисунок hf/cN.png (1:1, светлый) + заголовок в свободной верхней зоне. python cover.py → cover_v1..3.png"""
from PIL import Image, ImageDraw, ImageFont
K = "../../reels/arb-kit/fonts/"
def F(f, s, var=None):
    ft = ImageFont.truetype(K + f, s)
    if var: ft.set_variation_by_name(var)
    return ft
NAVY, RED = (24, 36, 64), (232, 38, 46)
POS = {1: ("c", 70, 118), 2: ("l", 70, 118), 3: ("l", 44, 84)}   # где заголовок: по центру или слева, отступ сверху
for n, (al, top, sz) in POS.items():
    im = Image.open(f"hf/c{n}.png").convert("RGB").resize((1080, 1080), Image.LANCZOS); d = ImageDraw.Draw(im)
    lines = [("СТРАШНО", F("DelaGothicOne-Regular.ttf", sz), NAVY), ("НАЧАТЬ?", F("DelaGothicOne-Regular.ttf", sz), RED)] + (
            [("почему так — и как обойти", F("Manrope[wght].ttf", 40, b"ExtraBold"), NAVY)] if n != 3 else [])
    y = top
    for text, ft, col in lines:
        l, t, r, b = ft.getbbox(text); w = r - l
        x = (1080 - w) / 2 - l if al == "c" else 64 - l
        d.text((x, y - t), text, font=ft, fill=col, stroke_width=6, stroke_fill=(255, 255, 255))
        y += (b - t) + (22 if ft.size > 60 else 0) + 6
    im.save(f"cover_v{n}.png")
print("ok")
