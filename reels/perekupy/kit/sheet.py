# контактный лист: python sheet.py <папка> <out.jpg> [cols]
import sys, glob
from PIL import Image, ImageDraw
d, out = sys.argv[1], sys.argv[2]; cols = int(sys.argv[3]) if len(sys.argv) > 3 else 6
fs = sorted(glob.glob(f"{d}/f_*.jpg"), key=lambda f: float(f.split("_")[-1][:-4]))
W, H = 330, 587
rows = (len(fs) + cols - 1) // cols
sh = Image.new("RGB", (cols * (W + 10), rows * (H + 34)), "white"); dr = ImageDraw.Draw(sh)
for k, f in enumerate(fs):
    x, y = (k % cols) * (W + 10), (k // cols) * (H + 34)
    sh.paste(Image.open(f).resize((W, H)), (x + 5, y + 28)); dr.text((x + 8, y + 8), f.split("_")[-1][:-4] + " s", fill="black")
sh.save(out, quality=86)
