#!/usr/bin/env python3
"""Вырезает Арбузова из картинок ChatGPT на пурпурном фоне (#FF00FF) → PNG с прозрачностью + разметка лица.
Владелец 15.10: рисовку делаем в ChatGPT (фоны и позы), анимацию — кодом. Нарисованный рот стирается (закрашивается цветом лица),
рот рисует движок под голос (виземы А/О/Е/М/С); глаза размечаются для моргания.
  <python с numpy и PIL> tools/sprite_cut.py src_dir out_dir   → out_dir/<имя>.png и out_dir/sprites.json
"""
import json, os, sys
import numpy as np
from PIL import Image, ImageFilter, ImageDraw

def comps(mask, min_px=30):
    """связные области маски (4-соседство) → список (кол-во, y0, x0, y1, x1, массив точек)"""
    H, W = mask.shape; seen = np.zeros_like(mask, bool); out = []
    ys, xs = np.nonzero(mask)
    for y, x in zip(ys, xs):
        if seen[y, x]: continue
        st = [(y, x)]; seen[y, x] = True; pts = []
        while st:
            cy, cx = st.pop(); pts.append((cy, cx))
            for ny, nx in ((cy + 1, cx), (cy - 1, cx), (cy, cx + 1), (cy, cx - 1)):
                if 0 <= ny < H and 0 <= nx < W and mask[ny, nx] and not seen[ny, nx]:
                    seen[ny, nx] = True; st.append((ny, nx))
        if len(pts) >= min_px:
            p = np.array(pts); out.append((len(pts), p[:, 0].min(), p[:, 1].min(), p[:, 0].max(), p[:, 1].max(), p))
    return sorted(out, key=lambda c: -c[0])

def cut(path):
    im = np.asarray(Image.open(path).convert("RGB")).astype(np.int32); R, G, B = im[..., 0], im[..., 1], im[..., 2]
    mag = np.minimum(R, B) - G                                   # «пурпурность»
    alpha = np.clip((150 - mag) / 90, 0, 1)                      # фон (mag ≥ 150) прозрачный, край — мягкий
    # убираем пурпурный оттенок с края: где фон просвечивает — тянем цвет к тёмному контуру
    edge = (alpha < 1) & (alpha > 0)
    for ch in (0, 2): im[..., ch] = np.where(edge, np.minimum(im[..., ch], G + 10), im[..., ch])
    a8 = (alpha * 255).astype(np.uint8)
    ys, xs = np.nonzero(a8 > 20); y0, y1, x0, x1 = ys.min() - 8, ys.max() + 8, xs.min() - 8, xs.max() + 8
    rgb = im[y0:y1, x0:x1].copy(); a8 = a8[y0:y1, x0:x1]
    R, G, B = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    # лицо — розовая мякоть
    face = (R > 200) & (G > 95) & (G < 175) & (B > 95) & (B < 175) & (np.abs(G - B) < 45) & (a8 > 200)
    fc = comps(face, 2000)[0]; fy0, fx0, fy1, fx1 = fc[1:5]
    fh, fw = fy1 - fy0, fx1 - fx0
    # рот — самая крупная «не-лицевая» область в нижней центральной части лица
    ry0, ry1, rx0, rx1 = fy0 + int(fh * .52), fy1 - int(fh * .04), fx0 + int(fw * .18), fx1 - int(fw * .18)
    sub = ~face[ry0:ry1, rx0:rx1] & (a8[ry0:ry1, rx0:rx1] > 200)
    m = comps(sub, 150)[0]; my0, mx0, my1, mx1 = m[1] + ry0, m[2] + rx0, m[3] + ry0, m[4] + rx0
    # глаза — две крупные белые области в верхней части лица
    ey1 = fy0 + int(fh * .62); white = (R > 235) & (G > 235) & (B > 235)
    eyes = [c for c in comps(white[fy0 - int(fh * .1):ey1, fx0:fx1], 200)[:2]]
    eyes = [dict(x0=int(c[2] + fx0), y0=int(c[1] + fy0 - int(fh * .1)), x1=int(c[4] + fx0), y1=int(c[3] + fy0 - int(fh * .1))) for c in eyes]
    # стираем рот: заливаем цветом лица вокруг рта, края смягчаем
    ring = face[max(0, my0 - 25):my1 + 25, max(0, mx0 - 25):mx1 + 25]
    col = np.median(rgb[max(0, my0 - 25):my1 + 25, max(0, mx0 - 25):mx1 + 25][ring], axis=0).astype(np.uint8)
    out = Image.fromarray(np.dstack([rgb.astype(np.uint8), a8]), "RGBA")
    patch = Image.new("L", out.size, 0); d = ImageDraw.Draw(patch); pad = 7
    d.ellipse([mx0 - pad, my0 - pad, mx1 + pad, my1 + pad], fill=255); patch = patch.filter(ImageFilter.GaussianBlur(3))
    fill = Image.new("RGBA", out.size, tuple(int(v) for v in col) + (255,))
    out = Image.composite(fill, out, Image.fromarray(np.minimum(np.asarray(patch), a8)))
    return out, dict(w=out.width, h=out.height, face=dict(x0=int(fx0), y0=int(fy0), x1=int(fx1), y1=int(fy1), color="#%02x%02x%02x" % tuple(col)),
                     mouth=dict(cx=int((mx0 + mx1) / 2), cy=int((my0 + my1) / 2), w=int(mx1 - mx0), h=int(my1 - my0)), eyes=eyes)

if __name__ == "__main__":
    src, dst = sys.argv[1:3]; os.makedirs(dst, exist_ok=True); meta = {}
    for f in sorted(os.listdir(src)):
        n, ext = os.path.splitext(f)
        if ext.lower() not in (".webp", ".png", ".jpg", ".jpeg"): continue
        im, m = cut(os.path.join(src, f)); im.save(os.path.join(dst, n + ".png")); meta[n] = m
        print(n, m["w"], m["h"], "рот", m["mouth"], "глаз", len(m["eyes"]))
    json.dump(meta, open(os.path.join(dst, "sprites.json"), "w"), ensure_ascii=False, indent=1)
