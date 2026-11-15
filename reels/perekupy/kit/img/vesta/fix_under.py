# дочистка тени под кузовом CLS 3/4: ниже линии низа кузова оставляем только колёса (эллипсы шин)
import sys, numpy as np
from PIL import Image
from scipy import ndimage
f, wheels = sys.argv[1], eval(sys.argv[2]); line = eval(sys.argv[3])     # wheels: [(cx, cy, rx, ry)], line: [(x, y)] — низ кузова
im = np.asarray(Image.open(f).convert("RGBA")).copy(); h, w = im.shape[:2]
yy, xx = np.mgrid[:h, :w]
yl = np.interp(xx, [p[0] for p in line], [p[1] for p in line])
inw = np.zeros((h, w), bool)
for cx, cy, rx, ry in wheels: inw |= ((xx - cx) / rx) ** 2 + ((yy - cy) / ry) ** 2 < 1
kill = (yy > yl) & ~inw
a = im[..., 3].astype(float); a[kill] = 0
a = ndimage.gaussian_filter((a > 127).astype(float), .6) * 255
im[..., 3] = a.clip(0, 255).astype(np.uint8)
Image.fromarray(im).save(f.replace(".png", "_fix.png"))
bg = Image.new("RGBA", (w, h), (255, 0, 255, 255)); bg.alpha_composite(Image.fromarray(im)); bg.convert("RGB").save("fixprev.jpg")
