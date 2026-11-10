# python cut.py → niva_side.png (сбоку, мордой влево), niva_side_r.png (мордой вправо), niva_34.png (3/4 спереди), niva_34r.png (3/4 сзади):
# салатовая Нива владельца (10.11, source.webp) без белого фона и серой тени. Фон и тень — нейтрально-серые/белые, заливаем от краёв
# кадра; диски (тоже серые) внутри чёрных шин и стёкла внутри рамок не достаются. Кайма — срезаем на 1 px.
import numpy as np
from PIL import Image
from scipy import ndimage
src = np.asarray(Image.open("source.webp").convert("RGB")).astype(int)


def cut(box, out):
    x0, y0, x1, y1 = box; a = src[y0:y1, x0:x1]
    bg = ((a.max(-1) - a.min(-1)) < 20) & (a.min(-1) > 105)
    lab, _ = ndimage.label(bg)
    edge = set(lab[0]) | set(lab[-1]) | set(lab[:, 0]) | set(lab[:, -1]); edge.discard(0)
    fg = ~np.isin(lab, list(edge))
    fg = ndimage.binary_opening(fg, iterations=1)
    lab3, n3 = ndimage.label(fg); sizes = ndimage.sum(fg, lab3, range(1, n3 + 1)); fg = lab3 == (1 + int(np.argmax(sizes)))
    fg = ndimage.binary_fill_holes(fg)
    fg = ndimage.binary_erosion(fg, iterations=1)
    ys, xs = np.nonzero(fg); yy0, yy1, xx0, xx1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
    alpha = (ndimage.gaussian_filter(fg.astype(float), .6) * 255).clip(0, 255)
    Image.fromarray(np.dstack([a, alpha]).astype(np.uint8)[yy0:yy1, xx0:xx1]).save(out); print(out, xx1 - xx0, yy1 - yy0)


cut((20, 340, 800, 645), "niva_side.png")
cut((825, 340, 1536, 645), "niva_side_r.png")
cut((40, 635, 760, 1015), "niva_34.png")
cut((830, 635, 1500, 1015), "niva_34r.png")
