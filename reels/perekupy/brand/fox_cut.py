# python fox_cut.py → fox_cut.png: лиса с аватарки без оранжевого фона и тёмного круга (контур лисы сохраняется)
import numpy as np
from PIL import Image
from scipy import ndimage
a = np.asarray(Image.open("../kit/img/fox.png").convert("RGB")).astype(int)
r, g, b = a[..., 0], a[..., 1], a[..., 2]
bgish = (r > 150) & (b < 90) & (g > 70) & (g < 150) & (r - g > 60)       # оранжевый фон и тёмно-оранжевый круг
bgish |= (r > 120) & (r < 215) & (g > 60) & (g < 120) & (b < 60)
lab, _ = ndimage.label(bgish)
edge = set(lab[0]) | set(lab[-1]) | set(lab[:, 0]) | set(lab[:, -1]); edge.discard(0)
bg = np.isin(lab, list(edge))
fg = ndimage.binary_fill_holes(~bg)
lab2, n = ndimage.label(fg); sizes = ndimage.sum(fg, lab2, range(1, n + 1)); fg = lab2 == (1 + int(np.argmax(sizes)))
alpha = (ndimage.gaussian_filter(fg.astype(float), .8) * 255).clip(0, 255)
ys, xs = np.nonzero(fg)
Image.fromarray(np.dstack([a, alpha]).astype(np.uint8)[ys.min():ys.max() + 1, xs.min():xs.max() + 1]).save("fox_cut.png")
print("ok", xs.min(), xs.max(), ys.min(), ys.max())
