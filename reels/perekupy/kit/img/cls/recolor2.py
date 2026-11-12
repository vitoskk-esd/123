# чёрный CLS из белой вырезки: кузов = светлые бесцветные пиксели (без дисков, фар, стёкол), маска сглажена — без зерна по краям линий
import numpy as np
from PIL import Image
from scipy import ndimage
im = np.asarray(Image.open("cls_34.png").convert("RGBA")).astype(float)
rgb, a = im[..., :3], im[..., 3]; mx, mn = rgb.max(2), rgb.min(2)
h, w = a.shape; yy, xx = np.mgrid[:h, :w]
wheels = np.zeros((h, w), bool)
for cx, cy, r in ((415, 268, 74), (712, 250, 62)): wheels |= (xx - cx) ** 2 + (yy - cy) ** 2 < r ** 2
light = (mn > 120) & (mx - mn < 30) & (a > 0)
lab, n = ndimage.label(light); idx = np.arange(1, n + 1)
inw = ndimage.mean(wheels.astype(float), lab, idx); big = ndimage.sum(light, lab, idx)
body = np.isin(lab, idx[(inw < .5) & (big > 60)])
body = ndimage.binary_closing(body, iterations=2) & (mn > 80) & (a > 0) & ~(wheels & ~np.isin(lab, idx[(inw < .5) & (big > 60)]))
body &= ~((xx > 62) & (xx < 166) & (yy > 220) & (yy < 256))      # номер не красим
soft = ndimage.gaussian_filter(body.astype(float), .7)[..., None]
L = ndimage.gaussian_filter(rgb.mean(2), .8)[..., None] / 255
for name, base, k in (("black", [18, 19, 23], 1.0), ("cherry", [120, 14, 34], 1.0)):
    tint = np.array(base) * (.75 + .35 * L) + ((L * 255 - 200).clip(0) * k)       # светотень и блики сохраняются
    out = rgb * (1 - soft) + tint * soft
    Image.fromarray(np.dstack([out.clip(0, 255), a]).astype(np.uint8)).save(f"cls_34_{name}.png")
bg = Image.new("RGBA", (w, h), (255, 0, 255, 255)); bg.alpha_composite(Image.open("cls_34_black.png")); bg.convert("RGB").save("bprev.jpg")
