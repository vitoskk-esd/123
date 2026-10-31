# python fox_cut.py → fox_cut.png: лиса с биноклем (аватарка бота) с кольцами, без тёмно-серого фона
import numpy as np
from PIL import Image
from scipy import ndimage
a = np.asarray(Image.open("fox_avatar.jpg").convert("RGB")).astype(int)
bgc = np.median(a[:20, :20].reshape(-1, 3), axis=0)
d = np.abs(a - bgc).max(2)
lab, _ = ndimage.label(d < 12)                                   # фон: однородный тёмно-серый, чёрная кепка темнее
edge = set(lab[0]) | set(lab[-1]) | set(lab[:, 0]) | set(lab[:, -1]); edge.discard(0)
bg = np.isin(lab, list(edge))
# серый между кольцами тоже фон (крупные пятна), мелкие серые точки внутри рисунка оставляем
inner = (d < 12) & ~bg
li, k = ndimage.label(inner); big = np.isin(li, [i + 1 for i, sz in enumerate(ndimage.sum(inner, li, range(1, k + 1))) if sz > 400])
fg = ~bg & ~big
fg = ndimage.binary_opening(fg, iterations=1)
lab2, n = ndimage.label(fg); sizes = ndimage.sum(fg, lab2, range(1, n + 1)); fg = lab2 == (1 + int(np.argmax(sizes)))
alpha = (ndimage.gaussian_filter(fg.astype(float), .8) * 255).clip(0, 255)
ys, xs = np.nonzero(fg)
Image.fromarray(np.dstack([a, alpha]).astype(np.uint8)[ys.min():ys.max() + 1, xs.min():xs.max() + 1]).save("fox_cut.png")
print("ok", bgc, xs.min(), xs.max(), ys.min(), ys.max())
