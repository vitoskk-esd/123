# python cut.py → vaz2115.png: серая пятнашка (верхняя, стоковая) без белого фона, отражения и значка автора; x3, контур
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage
im = Image.open("source.jpg").convert("RGB")
a = np.asarray(im).astype(int)[0:185]                       # верхняя машина, до низа колёс (ниже — тень и отражение)
light = (a.min(2) > 190)                                      # белый фон и светлое отражение
lab, _ = ndimage.label(light)
edge = set(lab[0]) | set(lab[-1]) | set(lab[:, 0]) | set(lab[:, -1]); edge.discard(0)
fg = ndimage.binary_fill_holes(~np.isin(lab, list(edge)))
fg = ndimage.binary_opening(fg, iterations=1)
lab2, n = ndimage.label(fg); sizes = ndimage.sum(fg, lab2, range(1, n + 1)); fg = lab2 == (1 + int(np.argmax(sizes)))   # только машина
ys, xs = np.nonzero(fg); y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
alpha = (ndimage.gaussian_filter(fg.astype(float), .6) * 255).clip(0, 255)
img = Image.fromarray(np.dstack([a, alpha]).astype(np.uint8)[y0:y1, x0:x1])
img = img.resize((img.width * 3, img.height * 3), Image.LANCZOS)
m = np.asarray(img)[..., 3] > 100
ring = ndimage.binary_dilation(m, iterations=6)
o = np.zeros((*m.shape, 4), np.uint8); o[ring] = (21, 21, 21, 255)
base = Image.fromarray(o).filter(ImageFilter.GaussianBlur(.8)); base.alpha_composite(img); base.save("vaz2115.png"); print(base.size, (x0, y0, x1, y1))
