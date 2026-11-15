# дочистка тени под кузовом Mazda 6 (15.11): нижний край красного кузова по столбцам (сглаженный) — ниже него оставляем только колёса.
# Колёса — эллипсы вокруг светлых дисков (низкая насыщенность, светлые), радиус = диск + шина.
import sys, numpy as np
from PIL import Image
from scipy import ndimage
f = sys.argv[1]; tire = float(sys.argv[2]) if len(sys.argv) > 2 else 1.35
im = np.asarray(Image.open(f).convert("RGBA")).copy(); h, w = im.shape[:2]
r, g, b, a = [im[..., i].astype(int) for i in range(4)]
red = (a > 128) & (r > 110) & (r - g > 50) & (r - b > 50)
bottom = np.full(w, -1)
for x in range(w):
    ys = np.nonzero(red[:, x])[0]
    if len(ys): bottom[x] = ys.max()
xs = np.nonzero(bottom >= 0)[0]
bottom = np.interp(np.arange(w), xs, bottom[xs])
bottom = ndimage.maximum_filter1d(bottom, 25) + 3                      # держимся нижней кромки (обвес)
rim = (a > 128) & (np.abs(r - b) < 25) & (np.abs(r - g) < 25) & ((r + g + b) / 3 > 140)
rim &= np.arange(h)[:, None] > h * .45
lab, n = ndimage.label(ndimage.binary_closing(rim, iterations=4))
yy, xx = np.mgrid[:h, :w]; keep = np.zeros((h, w), bool); wheels = []
for i in range(1, n + 1):
    ys, xs2 = np.nonzero(lab == i)
    if len(ys) < 400: continue
    cx, cy = xs2.mean(), ys.mean(); rx, ry = (xs2.max() - xs2.min()) / 2 * tire, (ys.max() - ys.min()) / 2 * tire
    wheels.append((round(cx), round(cy), round(rx), round(ry)))
    keep |= ((xx - cx) / rx) ** 2 + ((yy - cy) / ry) ** 2 < 1
kill = (yy > bottom[None, :]) & ~keep
a2 = a.copy(); a2[kill] = 0
a2 = (ndimage.gaussian_filter((a2 > 127).astype(float), .6) * 255).clip(0, 255)
im[..., 3] = a2.astype(np.uint8); im[im[..., 3] == 0, :3] = 0
Image.fromarray(im).save(f)
print(f, "колёса", wheels)
