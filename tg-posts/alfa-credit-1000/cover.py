"""Обложки поста про кредитку Альфа-Банка: рисунок hf/c1f, c2, c3 (1:1, светлый) + заголовок в свободной верхней зоне. python cover.py → cover_v1..3.png"""
from PIL import Image, ImageDraw, ImageFont
K = "../../reels/arb-kit/fonts/"
def F(f, s, var=None):
    ft = ImageFont.truetype(K + f, s)
    if var: ft.set_variation_by_name(var)
    return ft
NAVY, RED = (24, 36, 64), (232, 38, 46)
HERO, SUB = lambda s: F("DelaGothicOne-Regular.ttf", s), lambda s: F("Manrope[wght].ttf", s, b"ExtraBold")
RUB = lambda s: F("Unbounded[wght].ttf", s, b"Black")   # в Dela Gothic нет знака ₽
COVERS = {   # картинка, строки (текст, шрифт, цвет), отступ сверху
    1: ("c1f", [("+1 000 ₽", RUB(140), RED), ("за пару часов", SUB(58), NAVY)], 56),
    2: ("c2", [("+1 000 ₽", RUB(112), RED), ("в день получения карты", SUB(50), NAVY)], 40),
    3: ("c3", [("5 ПОКУПОК", HERO(108), NAVY), ("= +1 000 ₽", RUB(92), RED)], 44),
}
for n, (src, lines, top) in COVERS.items():
    im = Image.open(f"hf/{src}.png").convert("RGB").resize((1080, 1080), Image.LANCZOS); d = ImageDraw.Draw(im); y = top
    for text, ft, col in lines:
        l, t, r, b = ft.getbbox(text)
        d.text(((1080 - (r - l)) / 2 - l, y - t), text, font=ft, fill=col, stroke_width=7, stroke_fill=(255, 255, 255))
        y += (b - t) + 18
    im.save(f"cover_v{n}.png")
print("ok")
