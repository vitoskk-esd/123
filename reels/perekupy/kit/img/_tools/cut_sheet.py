# python cut_sheet.py <папка> <имя> [--white-holes] → <имя>_side.png (мордой влево), _side_r.png (вправо), _34.png (3/4 спереди), _34r.png (3/4 сзади)
# Лист владельца 3×2 на белом фоне (спереди/сзади, сбоку ×2, 3/4 ×2). Ракурсы ищем сами (пятна не-белого), фон отделяем по контуру:
# «стенка» — тёмные и цветные пиксели (контур, шины, кузов), чуть утолщённые, чтобы закрыть щели в контуре; всё, до чего от края кадра
# можно дойти, не пересекая стенку, — фон (и белый, и серая тень). Так белая машина (Гранта) не «вытекает» вместе с белым фоном.
# --shadow-l=N: тень под машиной — нейтральные пиксели светлее N (по умолчанию 60; у CLS тень тёмная — 46).
# --white-holes: замкнутые чисто-белые просветы (между антикрылом и багажником у Эво) — тоже фон.
import sys
import numpy as np
from PIL import Image
from scipy import ndimage
d, name = sys.argv[1], sys.argv[2]
src = np.asarray(Image.open(f"{d}/source.webp").convert("RGB")).astype(int)
lum, sat = src.mean(-1), src.max(-1) - src.min(-1)
content = (lum < 225) | (sat > 30)


def bands(v, gap=12, minlen=60):
    """Отрезки, где есть содержимое, разделённые пустыми промежутками ≥ gap."""
    out, start, empty = [], None, 0
    for i, x in enumerate(v):
        if x:
            if start is None: start = i
            empty = 0
        elif start is not None:
            empty += 1
            if empty >= gap:
                if i - empty - start >= minlen: out.append((start, i - empty + 1))
                start, empty = None, 0
    if start is not None and len(v) - start >= minlen: out.append((start, len(v)))
    return out


rows_c, cols_c = content.sum(1), None
H, Wd = content.shape
r1 = 250 + int(np.argmin(rows_c[250:450]))               # между верхним рядом и боковыми видами
r2 = int(H * .55) + int(np.argmin(rows_c[int(H * .55):int(H * .72)]))   # между боковыми и 3/4
boxes = []
for y0, y1 in ((0, r1), (r1, r2), (r2, H)):
    cc = content[y0:y1].sum(0); xm = int(Wd * .42) + int(np.argmin(cc[int(Wd * .42):int(Wd * .58)]))
    boxes += [(slice(y0, y1), slice(0, xm)), (slice(y0, y1), slice(xm, Wd))]
names = ["front", "back", "side", "side_r", "34", "34r"]
for nm, sl in zip(names, boxes):
    if nm in ("front", "back"):
        continue
    a = src[sl]; L, Sa = a.mean(-1), a.max(-1) - a.min(-1)
    wall = (L < 120) | (Sa > 30)
    wall = ndimage.binary_dilation(wall, iterations=2)
    free = ~wall
    lab, _ = ndimage.label(free)
    edge = set(lab[0]) | set(lab[-1]) | set(lab[:, 0]) | set(lab[:, -1]); edge.discard(0)
    bg = np.isin(lab, list(edge))
    bg = ndimage.binary_dilation(bg, iterations=2) & ~((L < 120) | (Sa > 30))     # вернуть фону полосу, съеденную утолщением стенки
    # тень под машиной: серо-нейтральная полоса снизу, достижимая от фона
    low = np.arange(a.shape[0])[:, None] > .72 * a.shape[0]
    SHL = next((int(x.split("=")[1]) for x in sys.argv if x.startswith("--shadow-l=")), 60)   # тень темнее (CLS: ядро ~57) — порог ниже, шины ~20–40
    sh = low & (Sa < 14) & (a.min(-1) > SHL - 5) & ~(L < SHL)
    lab2, _ = ndimage.label(sh | bg)
    bg = np.isin(lab2, list(set(lab2[bg].ravel()) - {0}))
    if "--white-holes" in sys.argv:
        holes, _ = ndimage.label((a.min(-1) > 246) & ~bg)
        for k, s2 in enumerate(ndimage.find_objects(holes), 1):
            if (holes[s2] == k).sum() > 300:
                bg |= holes == k
    fg = ~bg
    lab3, n3 = ndimage.label(fg); sizes = ndimage.sum(fg, lab3, range(1, n3 + 1)); fg = lab3 == (1 + int(np.argmax(sizes)))
    fg = ndimage.binary_erosion(fg, iterations=1)
    ys, xs = np.nonzero(fg)
    alpha = (ndimage.gaussian_filter(fg.astype(float), .6) * 255).clip(0, 255)
    out = np.dstack([a, alpha]).astype(np.uint8)[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
    Image.fromarray(out).save(f"{d}/{name}_{nm}.png"); print(f"{d}/{name}_{nm}.png", out.shape[1], out.shape[0])
