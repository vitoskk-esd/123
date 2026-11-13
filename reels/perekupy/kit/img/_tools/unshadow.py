# python unshadow.py <png> [--lo=28 --hi=42 --from=.78] — снять ровную серую тень под машиной (листы владельца: тень однотонная ~34),
# не трогая шины (почти чёрные, с рисунком) и кузов. Тень = нейтральные пиксели тона lo..hi ниже доли высоты `from`, связанные с прозрачным фоном.
# Потом: белые «обрезки» фона, которые после этого оказались снаружи, тоже убираем; остаётся одна самая большая деталь (машина).
# Владелец 13.11 про Lexus NX: «обрезал колёса… вырежи нормально, чтобы нигде не было белых обрезков и все колёса были на месте».
import sys
import numpy as np
from PIL import Image
from scipy import ndimage

f = sys.argv[1]
opt = {k: float(v) for k, v in (a[2:].split("=") for a in sys.argv[2:] if a.startswith("--"))}
lo, hi, frm = opt.get("lo", 28), opt.get("hi", 42), opt.get("from", .78)
im = np.asarray(Image.open(f).convert("RGBA")).astype(int); h, w = im.shape[:2]
rgb, a = im[..., :3], im[..., 3]
lum, sat = rgb.mean(-1), rgb.max(-1) - rgb.min(-1)
yy = np.mgrid[:h, :w][0]
low = yy > frm * h
transp = a < 128
cand = (a >= 128) & low & (sat < 8) & (lum >= lo) & (lum <= hi)
# мягкий край тени (переход тень → фон) — тоже тень
edge = (a >= 128) & low & (sat < 10) & (lum > hi) & (lum < 200)
removed = np.zeros_like(transp)
for _ in range(3):
    lab, n = ndimage.label(cand | (edge & ndimage.binary_dilation(removed | transp, iterations=2)))
    touch = set(np.unique(lab[ndimage.binary_dilation(transp | removed, iterations=1)])) - {0}
    rm = np.isin(lab, list(touch))
    if not (rm & ~removed).any():
        break
    removed |= rm
alpha = np.where(removed, 0, a)
# белые обрезки фона снаружи: почти белые нейтральные пятна внизу, касающиеся прозрачного
# (с серой каймой 90…200 вокруг — она отделяла белый клин от прозрачного); только небольшие пятна, чтобы не задеть кузов
white = (alpha >= 128) & low & (lum > 90) & (sat < 10)
lab, n = ndimage.label(white)
touch = set(np.unique(lab[ndimage.binary_dilation(alpha < 128, iterations=1)])) - {0}
sizes = dict(zip(range(1, n + 1), ndimage.sum(white, lab, range(1, n + 1))))
alpha = np.where(np.isin(lab, [k for k in touch if sizes[k] < 4000]), 0, alpha)
fg = alpha >= 128
# тонкие хвосты края тени (1–4 px по высоте) у низа шин и светлые полоски под бампером: внизу оставляем только то, что «толще» 6 px по вертикали
thick = ndimage.binary_opening(fg, structure=np.ones((7, 1), bool))
fg = np.where(yy > (frm - .06) * h, thick, fg)
lab, n = ndimage.label(fg)
if n > 1:
    sizes = ndimage.sum(fg, lab, range(1, n + 1)); fg = lab == (1 + int(np.argmax(sizes)))
alpha = (ndimage.gaussian_filter(fg.astype(float), .5) * 255).clip(0, 255) * (fg | ndimage.binary_dilation(fg, iterations=1))
out = np.dstack([rgb, alpha]).astype(np.uint8)
ys, xs = np.nonzero(alpha > 8)
out = out[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
Image.fromarray(out).save(f)
print(f, "снято тени:", int(removed.sum()), "px →", out.shape[1], "×", out.shape[0])
