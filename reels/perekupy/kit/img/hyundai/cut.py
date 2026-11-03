# python cut.py → hyundai.png: белый Hyundai владельца (сбоку) без белого фона и бежевого круга, с тенью под колёсами
import numpy as np
from PIL import Image
from scipy import ndimage
a = np.asarray(Image.open("source.png").convert("RGB")).astype(int)[:1000]   # до тени: между порогом и тенью — фон, его не берём
r, g, b = a[..., 0], a[..., 1], a[..., 2]
white = (a.min(2) > 244)
beige = (r > 235) & (g > 215) & (b > 180) & (r - b > 25)
lab, _ = ndimage.label(white | beige)
edge = set(lab[0]) | set(lab[-1]) | set(lab[:, 0]) | set(lab[:, -1]); edge.discard(0)
fg = ndimage.binary_fill_holes(~np.isin(lab, list(edge)))
fg = ndimage.binary_opening(fg, iterations=2)
fg[958:, :] &= (a[958:].max(2) < 140)                       # ниже порога кузова — только тёмные шины, фон между ними убираем
lab2, n = ndimage.label(fg); sizes = ndimage.sum(fg, lab2, range(1, n + 1)); fg = lab2 == (1 + int(np.argmax(sizes)))
ys, xs = np.nonzero(fg); y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
alpha = (ndimage.gaussian_filter(fg.astype(float), .7) * 255).clip(0, 255)
img = Image.fromarray(np.dstack([a, alpha]).astype(np.uint8)[y0:y1, x0:x1])
img.resize((img.width * 3 // 4, img.height * 3 // 4), Image.LANCZOS).save("hyundai.png"); print(img.size)
