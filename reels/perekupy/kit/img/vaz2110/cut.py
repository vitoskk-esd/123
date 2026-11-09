# python cut.py → vaz2110_34.png (3/4 спереди, мордой влево), vaz2110_side.png (сбоку, мордой влево), vaz2110_side_r.png (мордой вправо):
# голубая «десятка» владельца (09.11) без серо-голубого фона и тёмно-синей тени. Фон — близко к (176,197,216); тень — тёмная, с синим уклоном.
# Заливаем от краёв кадра только по фону+тени: стёкла (тоже тёмно-синие) внутри чёрной обводки не трогаются. Кайма — срезаем на 1 px.
import numpy as np
from PIL import Image
from scipy import ndimage
src = np.asarray(Image.open("source.webp").convert("RGB")).astype(int)
BG = np.array([176, 197, 216])


def cut(box, out):
    x0, y0, x1, y1 = box; a = src[y0:y1, x0:x1]
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    bg = (np.abs(a - BG).sum(-1) < 40)
    shadow = (b - r > 16) & (b < 135) & (b - g > 7) & (r > 25)
    lab, _ = ndimage.label(bg | shadow)
    edge = set(lab[0]) | set(lab[-1]) | set(lab[:, 0]) | set(lab[:, -1]); edge.discard(0)
    fg = ~np.isin(lab, list(edge))
    fg = ndimage.binary_opening(fg, iterations=1)
    lab3, n3 = ndimage.label(fg); sizes = ndimage.sum(fg, lab3, range(1, n3 + 1)); fg = lab3 == (1 + int(np.argmax(sizes)))
    fg = ndimage.binary_fill_holes(fg)
    fg = ndimage.binary_erosion(fg, iterations=1)
    ys, xs = np.nonzero(fg); yy0, yy1, xx0, xx1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
    alpha = (ndimage.gaussian_filter(fg.astype(float), .6) * 255).clip(0, 255)
    Image.fromarray(np.dstack([a, alpha]).astype(np.uint8)[yy0:yy1, xx0:xx1]).save(out); print(out, xx1 - xx0, yy1 - yy0)


cut((0, 630, 790, 1015), "vaz2110_34.png")
cut((0, 355, 775, 625), "vaz2110_side.png")
cut((775, 355, 1536, 625), "vaz2110_side_r.png")
