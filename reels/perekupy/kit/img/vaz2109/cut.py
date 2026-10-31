# python cut.py → vaz2109.png: девятка владельца (вид 3/4) без белого фона и зелёного свечения, x2, с контуром
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage
a = np.asarray(Image.open("source.jpg").convert("RGB")).astype(int)
r, g, b = a[..., 0], a[..., 1], a[..., 2]
bgish = ((r > 205) & (g > 205) & (b > 205)) | ((g > r + 25) & (g > 140))      # белый фон или зелёно-бирюзовое свечение
lab, _ = ndimage.label(bgish)
edge = set(lab[0]) | set(lab[-1]) | set(lab[:, 0]) | set(lab[:, -1]); edge.discard(0)
bg = np.isin(lab, list(edge))
fg = ndimage.binary_fill_holes(~bg)
fg = ndimage.binary_opening(fg, iterations=2)
lab2, n = ndimage.label(fg); sizes = ndimage.sum(fg, lab2, range(1, n + 1)); fg = lab2 == (1 + int(np.argmax(sizes)))   # только машина
ys, xs = np.nonzero(fg); y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
alpha = (ndimage.gaussian_filter(fg.astype(float), 1.0) * 255).clip(0, 255)
green = fg & (g > r + 8) & (g > b) & (r + g + b < 330)                      # тень и кайма, окрашенные свечением → нейтральная тень
a = a.copy(); a[green] = (24, 26, 30); alpha = np.where(green, alpha * .75, alpha)
img = Image.fromarray(np.dstack([a, alpha]).astype(np.uint8)[y0:y1, x0:x1]).resize(((x1 - x0) * 2, (y1 - y0) * 2), Image.LANCZOS)
m = np.asarray(img)[..., 3] > 100
ring = ndimage.binary_dilation(m, iterations=5)
o = np.zeros((*m.shape, 4), np.uint8); o[ring] = (21, 21, 21, 255)
base = Image.fromarray(o).filter(ImageFilter.GaussianBlur(.8)); base.alpha_composite(img); base.save("vaz2109.png"); print(base.size)
