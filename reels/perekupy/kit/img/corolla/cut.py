# python cut.py → corolla.png: Toyota Corolla владельца (мятная, бронзовые диски) без бежевого фона, x2, с контуром
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage
a = np.asarray(Image.open("source.jpg").convert("RGB")).astype(int)[6:-6, 6:-6]     # без тонкой рамки по краю картинки
bgc = np.median(a[:10, :10].reshape(-1, 3), axis=0)
near = np.abs(a - bgc).max(2) < 22
lab, _ = ndimage.label(near)
edge = set(lab[0]) | set(lab[-1]) | set(lab[:, 0]) | set(lab[:, -1]); edge.discard(0)
fg = ndimage.binary_fill_holes(~np.isin(lab, list(edge)))
fg = ndimage.binary_opening(fg, iterations=1)
lab2, n = ndimage.label(fg); sizes = ndimage.sum(fg, lab2, range(1, n + 1)); fg = lab2 == (1 + int(np.argmax(sizes)))
ys, xs = np.nonzero(fg); y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
k = np.clip(np.abs(a - bgc).max(2) / 60, 0, 1)                    # мягкий край, бежевый вычитаем из полупрозрачных пикселей
edgeband = fg & ~ndimage.binary_erosion(fg, iterations=2)
alpha = np.where(edgeband, k, fg.astype(float))
a = np.where((edgeband & (k > .05))[..., None], (a - bgc * (1 - k[..., None])) / np.maximum(k[..., None], .05), a).clip(0, 255)
img = Image.fromarray(np.dstack([a, alpha * 255]).astype(np.uint8)[y0:y1, x0:x1])
img = img.resize((img.width * 2, img.height * 2), Image.LANCZOS)
m = np.asarray(img)[..., 3] > 100
ring = ndimage.binary_dilation(m, iterations=4)
o = np.zeros((*m.shape, 4), np.uint8); o[ring] = (21, 21, 21, 255)
base = Image.fromarray(o).filter(ImageFilter.GaussianBlur(.8)); base.alpha_composite(img); base.save("corolla.png"); print(base.size, bgc)
