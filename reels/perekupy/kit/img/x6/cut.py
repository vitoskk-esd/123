# python cut.py → x6_side.png (сбоку, мордой вправо) и x6_34.png (3/4 спереди): BMW X6 владельца без белого фона и без тени.
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
        if band and m.sum() > 400 and ys.max() >= ground - 8:          # только просветы у земли; номер и фары внутри кузова не трогаем
            out_bg |= m
    fg = ~out_bg
    fg = ndimage.binary_opening(fg, iterations=1)
    lab3, n3 = ndimage.label(fg); sizes = ndimage.sum(fg, lab3, range(1, n3 + 1)); fg = lab3 == (1 + int(np.argmax(sizes)))
    fg = ndimage.binary_erosion(fg, iterations=1)             # светлая кайма по контуру
    ys, xs = np.nonzero(fg); yy0, yy1, xx0, xx1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
    alpha = (ndimage.gaussian_filter(fg.astype(float), .6) * 255).clip(0, 255)
    Image.fromarray(np.dstack([a, alpha]).astype(np.uint8)[yy0:yy1, xx0:xx1]).save(out); print(out, xx1 - xx0, yy1 - yy0, "тень с", ground)


cut((795, 350, 1536, 645), "x6_side.png", grey_shadow=True, band=False)
cut((15, 640, 785, 1005), "x6_34.png", grey_shadow=True, band=False)
