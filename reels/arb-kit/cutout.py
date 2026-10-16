#!/usr/bin/env python3
"""Предметы-слои для cut3.html (рилс 22, новый формат): предмет нарисован на белом фоне (hf/p_*.png) → прозрачный фон.
Прозрачным становится только белый фон, связанный с краями картинки (заливка от краёв), — белые блики внутри предмета остаются.
Результат обрезан по предмету: <рилс>/out/img/<id>.png; размеры печатаются (нужны для layers в монтаже).
  <python с PIL, numpy, scipy> arb-kit/cutout.py <папка рилса> p_dumb p_book …
"""
import json, os, sys
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

reel = os.path.abspath(sys.argv[1]); os.makedirs(f"{reel}/out/img", exist_ok=True)
sf = f"{reel}/out/img/sizes.json"; sizes = json.load(open(sf)) if os.path.exists(sf) else {}
for key in sys.argv[2:]:
    im = Image.open(f"{reel}/hf/{key}.png").convert("RGB"); a = np.asarray(im).astype(int)
    light = (a.min(axis=2) > 225) & (a.max(axis=2) - a.min(axis=2) < 25)
    lab, _ = ndimage.label(light)
    edge = set(np.unique(np.r_[lab[0], lab[-1], lab[:, 0], lab[:, -1]])) - {0}
    bg = np.isin(lab, list(edge))
    # замкнутый фон (внутри ручки сумки и т. п.): большие почти чисто-белые области тоже фон, мелкие блики остаются
    big = [i for i, n in enumerate(ndimage.sum(light, lab, range(1, lab.max() + 1)), 1) if n > 0.002 * light.size]
    bg |= np.isin(lab, big) & (a.min(axis=2) > 238)
    alpha = Image.fromarray(np.where(bg, 0, 255).astype(np.uint8)).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(1))
    out = im.convert("RGBA"); out.putalpha(alpha)
    box = alpha.point(lambda v: 255 if v > 20 else 0).getbbox(); out = out.crop(box)
    out.save(f"{reel}/out/img/{key}.png"); sizes[key] = out.size
    print(key, out.size)
json.dump(sizes, open(sf, "w"))
