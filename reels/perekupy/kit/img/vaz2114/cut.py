# python cut.py → vaz2114_white.png: машина владельца (ВАЗ-2114) без серого фона, x2, с тенью
import numpy as np
from PIL import Image
from scipy import ndimage
im = Image.open("source.webp").convert("RGB"); a = np.asarray(im).astype(int)
bg = np.median(a[:5, :5].reshape(-1, 3), axis=0)
d = np.abs(a - bg).sum(2)
near = d < 40                                             # похоже на фон
lab, _ = ndimage.label(near)
edge = set(lab[0]) | set(lab[-1]) | set(lab[:, 0]) | set(lab[:, -1]); edge.discard(0)
fg = ~np.isin(lab, list(edge))
inner = ndimage.binary_erosion(fg, iterations=3)
k = np.clip((d - 12) / 160, 0, 1)                           # доля машины в пикселе края (фон серый, машина далеко от серого)
k = np.where(inner, 1, np.where(ndimage.binary_dilation(fg, iterations=2), k, 0))
a = np.where(k[..., None] > .02, (a - bg * (1 - k[..., None])) / np.maximum(k[..., None], .02), a).clip(0, 255)   # убираем серый из края
alpha = k * 255
ys, xs = np.nonzero(alpha > 10); y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
rgba = np.dstack([a, alpha]).astype(np.uint8)[y0:y1, x0:x1]
out = Image.fromarray(rgba); out = out.resize((out.width * 2, out.height * 2), Image.LANCZOS)
out.save("vaz2114_white.png"); print(out.size, bg)
# контур #151515 как у персонажей — белая машина не теряется на светлых фонах
m = np.asarray(out)[..., 3] > 100
ring = ndimage.binary_dilation(m, iterations=5)
o = np.zeros((*m.shape, 4), np.uint8); o[ring] = (21, 21, 21, 255)
base = Image.fromarray(o).filter(__import__("PIL.ImageFilter", fromlist=["x"]).GaussianBlur(.8))
base.alpha_composite(out); base.save("vaz2114_white.png")
