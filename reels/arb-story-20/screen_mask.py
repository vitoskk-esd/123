#!/usr/bin/env python3
"""Верхний слой для вставки экрана телефона (cut3.html): тот же рисунок, но белый экран прозрачный — пальцы и рамка телефона
остаются поверх нашего интерфейса. Прозрачно только внутри четырёхугольника экрана (quads.json, с запасом), где пиксель почти белый.
  <python с PIL и numpy> screen_mask.py p10 p16 n02card
"""
import json, os, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
HERE = os.path.dirname(os.path.abspath(__file__)); Q = json.load(open(f"{HERE}/quads.json"))
for key in sys.argv[1:]:
    img = key.replace("card", ""); quad = Q[key]
    im = Image.open(f"{HERE}/hf/{img}.png").convert("RGB").resize((1080, 1920), Image.LANCZOS); a = np.asarray(im).astype(int)
    inside = Image.new("L", (1080, 1920), 0); ImageDraw.Draw(inside).polygon([tuple(p) for p in quad], fill=255)
    inside = np.asarray(inside.filter(ImageFilter.MaxFilter(15))) > 0
    white = (a.min(axis=2) > 205) & (a.max(axis=2) - a.min(axis=2) < 40)
    full = key.endswith("card")        # карточка уведомления: прозрачна целиком (нарисованный значок не должен просвечивать)
    if full: inside = np.asarray(Image.fromarray((inside * 255).astype(np.uint8)).filter(ImageFilter.MinFilter(9))) > 0
    alpha = np.where(inside & (white | full), 0, 255).astype(np.uint8)
    al = Image.fromarray(alpha).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(1.2))
    out = im.convert("RGBA"); out.putalpha(al); out.save(f"{HERE}/out/img/{key}_top.png")
    print(key, "прозрачно", int((np.asarray(al) < 128).sum()), "px")
