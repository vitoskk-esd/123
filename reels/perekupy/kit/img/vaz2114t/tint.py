# python tint.py → vaz2114t_side_tint.png: та же четырка сбоку, все стёкла «в ноль» (чёрные, салон не просвечивает) — для «жизни внука».
# Стёкла заданы многоугольниками по сетке (цветовая маска цепляла стойки, крышу и капот): заднее глухое, задняя и передняя двери.
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
im = Image.open("vaz2114t_side.png").convert("RGBA")
w, h = im.size
WIN = [
    [(85, 75), (84, 56), (150, 30), (202, 14), (161, 80), (92, 80)],      # заднее глухое (треугольное)
    [(213, 15), (298, 15), (298, 81), (176, 81)],              # задняя дверь
    [(308, 15), (398, 15), (461, 80), (308, 82)],              # передняя дверь
]
m = Image.new("L", (w * 4, h * 4), 0); d = ImageDraw.Draw(m)
for p in WIN:
    d.polygon([(x * 4, y * 4) for x, y in p], fill=255)
m = m.resize((w, h), Image.LANCZOS)
mask = np.asarray(m).astype(float) / 255
yy, xx = np.mgrid[:h, :w]
glass = np.zeros((h, w, 3)); glass[:] = [14, 15, 18]
shine = (((xx - yy * 1.6) % 150) < 9)                          # лёгкий диагональный блик — чтобы читалось как стекло
glass[shine] = [52, 56, 64]
a = np.asarray(im).astype(float)
a[..., :3] = a[..., :3] * (1 - mask[..., None]) + glass * mask[..., None]
Image.fromarray(a.astype(np.uint8)).save("vaz2114t_side_tint.png")
print("ok")
