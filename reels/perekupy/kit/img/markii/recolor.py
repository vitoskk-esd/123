# python recolor.py → markii_cherry.png и markii_black.png: тот же белый Mark II, кузов перекрашен по пикселям (CSS-фильтр давал золото вместо вишни);
# диски (светлые пятна внутри кругов колёс, отрезанные шиной), фары, стёкла и контур не трогаем — красим только светлые бесцветные пиксели кузова с сохранением светотени.
import numpy as np
from PIL import Image
from scipy import ndimage
im = np.asarray(Image.open("markii.png").convert("RGBA")).astype(float)
rgb, a = im[..., :3], im[..., 3]
mx, mn = rgb.max(2), rgb.min(2)
h, w = a.shape; yy, xx = np.mgrid[:h, :w]
WH = [(545, 388, 108), (908, 300, 78)]
wheels = np.zeros_like(a, bool)
for cx, cy, r in WH: wheels |= (xx - cx) ** 2 + (yy - cy) ** 2 < r ** 2
light = (mn > 140) & (mx - mn < 26) & (a > 0)
# светлые пятна, отрезанные шиной от кузова (диски), — не красим: компонента связности почти целиком внутри круга колеса
lab, n = ndimage.label(light); idx = np.arange(1, n + 1)
inw = ndimage.mean(wheels.astype(float), lab, idx)
body = light & ~np.isin(lab, idx[inw > .6])
L = (rgb.mean(2) / 255)[..., None]
for name, col, k in (("cherry", [150, 18, 40], 1.25), ("black", [30, 32, 38], 1.6)):
    out = rgb.copy(); tint = np.array(col) * np.clip(L * k, 0, 1.4)
    if name == "black": tint = np.array(col) + (L * 255 - 200).clip(0) * 1.4      # блики остаются светлыми
    out[body] = tint[body]
    Image.fromarray(np.dstack([out.clip(0, 255), a]).astype(np.uint8)).save(f"markii_{name}.png")
print(int(body.sum()))
