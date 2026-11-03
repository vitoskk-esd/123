# python cut.py → camry_side.png: белая Камри владельца сбоку без белого фона и серой тени; по чёрному контуру рисунка
import numpy as np
from PIL import Image
from scipy import ndimage
a = np.asarray(Image.open("side_source.webp").convert("RGB")).astype(int)
line = a.max(2) < 90                                          # чёрный контур
line = ndimage.binary_dilation(line, iterations=1)            # закрываем микроразрывы в тонких линиях
lab, _ = ndimage.label(~line)
edge = set(lab[0]) | set(lab[-1]) | set(lab[:, 0]) | set(lab[:, -1]); edge.discard(0)
fg = ndimage.binary_fill_holes(~np.isin(lab, list(edge)))
lab2, n = ndimage.label(fg); sizes = ndimage.sum(fg, lab2, range(1, n + 1)); fg = lab2 == (1 + int(np.argmax(sizes)))
ys, xs = np.nonzero(fg); y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
alpha = (ndimage.gaussian_filter(fg.astype(float), .7) * 255).clip(0, 255)
img = Image.fromarray(np.dstack([a, alpha]).astype(np.uint8)[y0:y1, x0:x1])
img.resize((img.width * 3 // 4, img.height * 3 // 4), Image.LANCZOS).save("camry_side.png"); print(img.size)
