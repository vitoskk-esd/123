# дочистка Cullinan: ниже линии низа кузова оставляем только шины (эллипсы, размечены по исходнику по сетке),
# а на внешнем ободке эллипса ещё и светлые пиксели (серая тень, белый фон) — шина там тёмная. Владелец 16.11: «вырезал половину колёс».
import sys, numpy as np
from PIL import Image
from scipy import ndimage
f, wheels, line = sys.argv[1], eval(sys.argv[2]), eval(sys.argv[3])
white_boxes = eval(sys.argv[4]) if len(sys.argv) > 4 else []     # просветы белого фона между шиной и бампером: (x0, y0, x1, y1)
im = np.asarray(Image.open(f).convert("RGBA")).copy(); h, w = im.shape[:2]
yy, xx = np.mgrid[:h, :w]
yl = np.interp(xx, [p[0] for p in line], [p[1] for p in line])
lum = im[..., :3].mean(-1)
d = np.full((h, w), 9.0)
for cx, cy, rx, ry in wheels: d = np.minimum(d, np.sqrt(((xx - cx) / rx) ** 2 + ((yy - cy) / ry) ** 2))
below = yy > yl
kill = below & ((d >= 1) | ((d > .97) & (lum > 110)))
for x0, y0, x1, y1 in white_boxes: kill |= (xx >= x0) & (xx < x1) & (yy >= y0) & (yy < y1) & (lum > 170)
a = im[..., 3].astype(float); a[kill] = 0
a = ndimage.gaussian_filter((a > 127).astype(float), .6) * 255
im[..., 3] = a.clip(0, 255).astype(np.uint8)
Image.fromarray(im).save(f)
