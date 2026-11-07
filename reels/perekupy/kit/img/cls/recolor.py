# python recolor.py → cls_34_cherry.png и cls_34_black.png: тот же белый CLS (вид 3/4), кузов перекрашен по пикселям (CSS-фильтр давал золото вместо вишни);
# диски (светлые пятна внутри кругов колёс, отрезанные шиной), фары, стёкла и контур не трогаем — красим только светлые бесцветные пиксели кузова с сохранением светотени.
import numpy as np
from PIL import Image
from scipy import ndimage
im = np.asarray(Image.open("cls_34.png").convert("RGBA")).astype(float)
rgb, a = im[..., :3], im[..., 3]
mx, mn = rgb.max(2), rgb.min(2)
h, w = a.shape; yy, xx = np.mgrid[:h, :w]
WH = [(432, 252, 80), (726, 226, 64)]
wheels = np.zeros_like(a, bool)
for cx, cy, r in WH: wheels |= (xx - cx) ** 2 + (yy - cy) ** 2 < r ** 2
light = (mn > 140) & (mx - mn < 26) & (a > 0)
# светлые пятна, отрезанные шиной от кузова (диски), — не красим: компонента связности почти целиком внутри круга колеса
lab, n = ndimage.label(light); idx = np.arange(1, n + 1)
inw = ndimage.mean(wheels.astype(float), lab, idx)
body = light & ~np.isin(lab, idx[inw > .6]) & ((yy < 285) | (mn > 215))   # серая тень под днищем (низ кадра) — не кузов
L = (rgb.mean(2) / 255)[..., None]
for name, col, k in (("cherry", [150, 18, 40], 1.25), ("black", [30, 32, 38], 1.6)):
    out = rgb.copy(); tint = np.array(col) * np.clip(L * k, 0, 1.4)
    if name == "black": tint = np.array(col) + (L * 255 - 200).clip(0) * .8      # блики остаются светлыми
    out[body] = tint[body]
    Image.fromarray(np.dstack([out.clip(0, 255), a]).astype(np.uint8)).save(f"cls_34_{name}.png")
print(int(body.sum()))
