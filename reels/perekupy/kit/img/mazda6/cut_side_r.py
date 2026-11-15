# Mazda 6 сбоку мордой вправо — ручная вырезка из листа владельца (15.11, после «ты плохо вырезал мазду»):
# 1) белый фон — заливка от краёв кадра по почти-белым пикселям; 2) тень под машиной (серо-голубая, светлее контура) —
# ниже линии порогов убираем всё, кроме кругов колёс и чёрного контура/красного; 3) оставляем одну (самую большую) связную область;
# 4) кайма: край на 1 пиксель внутрь, светлые полупрозрачные пиксели по краю — убираем.
import numpy as np
from PIL import Image
from scipy import ndimage
X0, Y0, X1, Y1 = 805, 345, 1536, 616
src = np.asarray(Image.open("source.webp").convert("RGB")).astype(int)[Y0:Y1, X0:X1]
h, w = src.shape[:2]
r, g, b = src[..., 0], src[..., 1], src[..., 2]
lum, sat = src.mean(-1), src.max(-1) - src.min(-1)
white = (lum > 212) & (sat < 28)
lab, n = ndimage.label(white)
edge = set(lab[0]) | set(lab[-1]) | set(lab[:, 0]) | set(lab[:, -1]); edge.discard(0)
bg = np.isin(lab, list(edge))
yy, xx = np.mgrid[:h, :w]; Y, X = yy + Y0, xx + X0
wheel = np.zeros((h, w), bool); well = np.zeros((h, w), bool)
for cx, cy, rr in ((952, 548, 55), (1398, 548, 55)):
    wheel |= (X - cx) ** 2 + (Y - cy) ** 2 < rr ** 2            # шина
    well |= ((X - cx) ** 2 + (Y - cy) ** 2 < (rr + 10) ** 2) & (Y < 586)   # ниша арки — только выше порогов
red = (r > 120) & (r - g > 55) & (r - b > 55)
ink = lum < 48
shadow = (Y >= 574) & ~wheel & ~red & ~ink
shadow |= (Y >= 586) & ~wheel                      # ниже порогов — только круги шин
car = ~bg & ~shadow
# вне колёс: ничего ниже красного кузова (+3 px контура) — хвостики тени под бамперами
for x in range(w):
    if (wheel | well)[:, x].any(): continue
    ys = np.nonzero(red[:, x] & car[:, x])[0]
    if len(ys): car[ys.max() + 4:, x] = False
car = ndimage.binary_closing(car, structure=np.ones((1, 7))) & ~(bg & ~well & (Y < 574))   # щели в 1–3 px у арок
lab2, n2 = ndimage.label(car)
sizes = ndimage.sum(car, lab2, range(1, n2 + 1)); car = lab2 == (1 + int(np.argmax(sizes)))
car = ndimage.binary_fill_holes(car) & ~(bg & ~ndimage.binary_fill_holes(car))
# кайма: светлые пиксели на краю (смесь с белым фоном)
for _ in range(2):
    border = car & ~ndimage.binary_erosion(car)
    car &= ~(border & (lum > 175) & (sat < 60))
alpha = ndimage.gaussian_filter(car.astype(float), .55)
alpha = np.where(car, np.maximum(alpha, .5), alpha * .6)
out = np.zeros((h, w, 4), np.uint8); out[..., :3] = src; out[..., 3] = (alpha * 255).clip(0, 255)
out[out[..., 3] == 0, :3] = 0
ys, xs = np.nonzero(out[..., 3] > 10)
Image.fromarray(out[ys.min():ys.max() + 1, xs.min():xs.max() + 1]).save("mazda6_side_r.png")
print("размер", xs.max() - xs.min() + 1, ys.max() - ys.min() + 1)
