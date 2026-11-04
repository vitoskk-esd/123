# python recolor.py → hyundai_taxi.png: тот же Hyundai владельца, кузов жёлтый (такси в прошлом); диски и стёкла не трогаем
import numpy as np
from PIL import Image
im = np.asarray(Image.open("hyundai.png").convert("RGBA")).astype(float)
rgb, a = im[..., :3], im[..., 3]
mx, mn = rgb.max(2), rgb.min(2)
h, w = a.shape; yy, xx = np.mgrid[:h, :w]
wheels = ((xx - 205) ** 2 + (yy - 288) ** 2 < 78 ** 2) | ((xx - 912) ** 2 + (yy - 288) ** 2 < 78 ** 2)
body = (mn > 150) & (mx - mn < 30) & ~wheels & (a > 0)
L = (rgb.mean(2) / 255)[..., None]
yellow = np.array([255, 196, 0]) * np.clip(L * 1.08, 0, 1)
rgb[body] = yellow[body]
Image.fromarray(np.dstack([rgb, a]).astype(np.uint8)).save("hyundai_taxi.png")
print(body.sum())
