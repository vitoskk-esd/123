# python cut.py → markii.png: Toyota Mark II владельца (3/4) без белого фона и серой тени; x1, контур уже нарисован
import numpy as np
from PIL import Image
from scipy import ndimage
a = np.asarray(Image.open("source.jpg").convert("RGB")).astype(int)
line = a.max(2) < 70                                         # чёрный контур рисунка
lab, _ = ndimage.label(~line)
edge = set(lab[0]) | set(lab[-1]) | set(lab[:, 0]) | set(lab[:, -1]); edge.discard(0)
fg = ~np.isin(lab, list(edge))                               # всё внутри контура + сам контур
lab2, n = ndimage.label(fg); sizes = ndimage.sum(fg, lab2, range(1, n + 1)); fg = lab2 == (1 + int(np.argmax(sizes)))
fg = ndimage.binary_fill_holes(fg)
ys, xs = np.nonzero(fg); y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
alpha = (ndimage.gaussian_filter(fg.astype(float), .7) * 255).clip(0, 255)
Image.fromarray(np.dstack([a, alpha]).astype(np.uint8)[y0:y1, x0:x1]).save("markii.png"); print((x0, y0, x1, y1))
