# python cut.py → gelik_side.png (сбоку, мордой вправо) и gelik_34.png (3/4 спереди): Гелик (Mercedes G 63) владельца без белого фона
import numpy as np
from PIL import Image
from scipy import ndimage
src = np.asarray(Image.open("source.webp").convert("RGB")).astype(int)
def cut(box, out):
    x0, y0, x1, y1 = box; a = src[y0:y1, x0:x1]
    lab, _ = ndimage.label(a.min(2) > 236)
    edge = set(lab[0]) | set(lab[-1]) | set(lab[:, 0]) | set(lab[:, -1]); edge.discard(0)
    fg = ndimage.binary_fill_holes(~np.isin(lab, list(edge)))
    lab2, n = ndimage.label(fg); sizes = ndimage.sum(fg, lab2, range(1, n + 1)); fg = lab2 == (1 + int(np.argmax(sizes)))
    ys, xs = np.nonzero(fg); yy0, yy1, xx0, xx1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
    alpha = (ndimage.gaussian_filter(fg.astype(float), .6) * 255).clip(0, 255)
    Image.fromarray(np.dstack([a, alpha]).astype(np.uint8)[yy0:yy1, xx0:xx1]).save(out); print(out, xx1 - xx0, yy1 - yy0)
cut((10, 560, 630, 900), "gelik_side.png")
cut((630, 560, 1095, 900), "gelik_34.png")
