#!/usr/bin/env python3
"""Карусель раскадровки рилса 20 на утверждение: кадры Higgsfield (hf/f01–f11) + номер и фраза закадрового текста.
  <python с PIL> carousel.py  →  board/sheet_1.jpg, board/sheet_2.jpg (сетки) и board/fXX.jpg (кадры с подписью)
"""
import json, os, textwrap
from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__)); OUT = f"{HERE}/board"; os.makedirs(OUT, exist_ok=True)
FONT = os.path.join(HERE, "../../youtube/kit/fonts/Montserrat.ttf")
J = json.load(open(f"{HERE}/hf_jobs.json", encoding="utf-8"))
P = [l.strip() for l in open(f"{HERE}/phrases.txt", encoding="utf-8") if l.strip()]


def font(size, w=700):
    f = ImageFont.truetype(FONT, size)
    try: f.set_variation_by_axes([w])
    except Exception: pass
    return f


cards = []
for k, j in enumerate(J["images"]):
    src = f"{HERE}/hf/{j['id']}.png"
    if not os.path.exists(src): continue
    im = Image.open(src).convert("RGB").resize((720, 1280), Image.LANCZOS)
    card = Image.new("RGB", (720, 1280 + 250), (24, 20, 20)); card.paste(im, (0, 0)); d = ImageDraw.Draw(card)
    d.rounded_rectangle((24, 24, 150, 100), 18, fill=(255, 224, 102)); d.text((87, 62), str(k + 1), font=font(48, 900), fill=(30, 23, 23), anchor="mm")
    clip = next((c for c in J["clips"] if c["from"] == j["id"]), None)
    if clip: d.rounded_rectangle((170, 24, 470, 100), 18, fill=(226, 40, 63)); d.text((320, 62), "оживёт · 4 с", font=font(34), fill="white", anchor="mm")
    d.multiline_text((28, 1300), "\n".join(textwrap.wrap(P[j["phrase"]], 34)[:5]), font=font(30, 500), fill=(240, 236, 230), spacing=8)
    card.save(f"{OUT}/{j['id']}.jpg", quality=88); cards.append(card)

for n, part in enumerate((cards[:6], cards[6:]), 1):
    if not part: continue
    W, H = 720 // 2, 1530 // 2
    sheet = Image.new("RGB", (W * 3 + 40, H * 2 + 30), (12, 10, 10))
    for i, c in enumerate(part): sheet.paste(c.resize((W, H), Image.LANCZOS), (10 + (i % 3) * (W + 10), 10 + (i // 3) * (H + 10)))
    sheet.save(f"{OUT}/sheet_{n}.jpg", quality=88)
print(len(cards), "кадров")
