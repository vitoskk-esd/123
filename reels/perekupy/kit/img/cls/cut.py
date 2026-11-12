# (12.11) вырезка заново: python ../_tools/cut_sheet.py . cls --shadow-l=46 → python fix34.py cls_34.png "[(415,268,70,72),(712,250,56,70),(86,304,58,17)]" (третий эллипс — дальнее переднее колесо под бампером) "[(0,290),(340,300),(470,290),(640,262),(787,240)]" (дочистка тени под кузовом) → python recolor2.py (чёрный и вишнёвый)
# python cut.py → prado_side.png (сбоку, мордой вправо) и prado_34.png (3/4 спереди): ВАЗ-2114 владельца (корч: каркас, растяжка, спойлер) без белого фона и без тени.
# Тень под машиной того же серого, что и кузов, — убираем её полосой: ниже начала тени оставляем только тёмные шины; затем
# белое, отрезанное от краёв (просвет между порогом и тенью), тоже фон; кайма по контуру — срезаем на 1 px.
import numpy as np
from PIL import Image
from scipy import ndimage
src = np.asarray(Image.open("source.webp").convert("RGB")).astype(int)


def cut(box, out, grey_shadow=False, band=True):
    x0, y0, x1, y1 = box; a = src[y0:y1, x0:x1]
    v, sat = a.mean(2), a.max(2) - a.min(2)
    white = a.min(2) > 225
    grey = (sat < 10) & (v > 95) & (v < 140)
    gf = grey.mean(1)                                         # доля серого в строке
    rows = np.flatnonzero(gf > .25)
    ground = a.shape[0]
    if len(rows):                                             # тень — нижний сплошной блок «серых» строк: идём от него вверх
        ground = rows.max()
        while ground > 0 and gf[ground - 1] > .18:
            ground -= 1
    shadow = np.zeros_like(white)
    if band: shadow[ground:] = ~(v[ground:] < 80)       # ниже — только тёмное (шины); у светлых дисков X6 — выключено
    if band == "light": shadow[:] = False; shadow[ground:] = (v[ground:] > 120) & (sat[ground:] < 16)   # белый Прадо: светлая тень; диски внутри шин отрезаны от края — остаются
    bg = white | shadow
    if grey_shadow:                                           # косая тень (вид 3/4): бесцветная серая, кузов — бежевый; диски внутри шин не задеваем
        bg |= (sat < 9) & (v > 100) & (v < 175)
    lab, _ = ndimage.label(bg)
    edge = set(lab[0]) | set(lab[-1]) | set(lab[:, 0]) | set(lab[:, -1]); edge.discard(0)
    out_bg = np.isin(lab, list(edge))
    # белые «окна», отрезанные от краёв, но большие и снизу (просвет под порогом) — тоже фон
    lab2, n = ndimage.label(white & ~out_bg)
    for k in range(1, n + 1):
        m = lab2 == k; ys = np.nonzero(m)[0]
        if band is True and m.sum() > 400 and ys.max() >= ground - 8:          # только просветы у земли; номер и фары внутри кузова не трогаем
            out_bg |= m
    fg = ~out_bg
    fg = ndimage.binary_opening(fg, iterations=1)
    lab3, n3 = ndimage.label(fg); sizes = ndimage.sum(fg, lab3, range(1, n3 + 1)); fg = lab3 == (1 + int(np.argmax(sizes)))
    fg = ndimage.binary_erosion(fg, iterations=1)             # светлая кайма по контуру
    ys, xs = np.nonzero(fg); yy0, yy1, xx0, xx1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
    alpha = (ndimage.gaussian_filter(fg.astype(float), .6) * 255).clip(0, 255)
    Image.fromarray(np.dstack([a, alpha]).astype(np.uint8)[yy0:yy1, xx0:xx1]).save(out); print(out, xx1 - xx0, yy1 - yy0, "тень с", ground)


cut((0, 350, 800, 625), "cls_side.png", band="light")
cut((800, 350, 1536, 625), "cls_side_r.png", band="light")
cut((0, 630, 810, 1000), "cls_34.png", band="light")
cut((815, 630, 1536, 1000), "cls_34r.png", band="light")
