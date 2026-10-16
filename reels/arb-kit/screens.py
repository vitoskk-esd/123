#!/usr/bin/env python3
"""Экраны телефонов на рисунках для cut3.html: находит белый экран (самую большую почти белую область), размечает 4 угла
в координатах кадра 1080×1920 → <рилс>/quads.json и делает верхний слой <рилс>/out/img/<кадр>_top.png, где белый экран прозрачный
(пальцы и рамка остаются поверх интерфейса). В рилсе 20 углы размечали вручную по сетке — здесь автоматически.
  <python с PIL, numpy, scipy> arb-kit/screens.py <папка рилса> s03c s06 s15:2r    # :2 — два телефона в кадре (ключи s15a, s15b слева направо);
  r — экран частично закрыт пальцами: углы — прямоугольник минимальной площади вокруг видимой белой части (без перспективы)
"""
import json, os, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy import ndimage

reel = os.path.abspath(sys.argv[1]); qf = f"{reel}/quads.json"
Q = json.load(open(qf)) if os.path.exists(qf) else {}
os.makedirs(f"{reel}/out/img", exist_ok=True)
for arg in sys.argv[2:]:
    key, n = (arg.split(":") + ["1"])[:2]; rect = n.endswith("r"); n = int(n.rstrip("r") or 1)
    im = Image.open(f"{reel}/hf/{key}.png").convert("RGB").resize((1080, 1920), Image.LANCZOS); a = np.asarray(im).astype(int)
    white = (a.min(axis=2) > 212) & (a.max(axis=2) - a.min(axis=2) < 30)
    lab, k = ndimage.label(ndimage.binary_opening(white, iterations=2))
    sizes = ndimage.sum(white, lab, range(1, k + 1)); big = [i + 1 for i in np.argsort(-sizes)[:n] if sizes[i] > 6000]
    assert len(big) == n, f"{key}: нашёл {len(big)} белых экранов из {n}"
    quads = []
    for b in big:
        ys, xs = np.nonzero(ndimage.binary_fill_holes(lab == b)); cx, cy = xs.mean(), ys.mean()
        # наклонённый телефон: крайние точки ищем в осях самого экрана (главные оси облака точек), а не кадра
        ev, vec = np.linalg.eigh(np.cov(np.vstack([xs - cx, ys - cy]))); v = vec[:, 1] if abs(vec[1, 1]) > abs(vec[0, 1]) else vec[:, 0]
        if v[1] < 0: v = -v                                   # v — вдоль длинной стороны, вниз
        u = np.array([v[1], -v[0]])                           # поперёк, вправо
        if u[0] < 0: u = -u
        a_, b_ = (xs - cx) * u[0] + (ys - cy) * u[1], (xs - cx) * v[0] + (ys - cy) * v[1]
        sa, sb = a_ / np.abs(a_).max(), b_ / np.abs(b_).max()
        pick = lambda k: (xs[k], ys[k])
        pts = [pick(np.argmin(sa + sb)), pick(np.argmax(sa - sb)), pick(np.argmax(sa + sb)), pick(np.argmin(sa - sb))]
        # скруглённые углы экрана «съедают» крайние точки — чуть раздвигаем от центра
        if rect:   # вращающиеся «штангенциркули» по выпуклой оболочке: прямоугольник минимальной площади
            from scipy.spatial import ConvexHull
            P = np.c_[xs, ys].astype(float); H = P[ConvexHull(P).vertices]; best = None
            for i in range(len(H)):
                e = H[(i + 1) % len(H)] - H[i]; e /= np.linalg.norm(e); nrm = np.array([-e[1], e[0]])
                pa, pb = H @ e, H @ nrm; area = (pa.max() - pa.min()) * (pb.max() - pb.min())
                if best is None or area < best[0]: best = (area, e, nrm, pa.min(), pa.max(), pb.min(), pb.max())
            _, e, nrm, a0, a1, b0, b1 = best
            cs = [e * x + nrm * y for x, y in ((a0, b0), (a1, b0), (a1, b1), (a0, b1))]
            cs.sort(key=lambda c: c[1]); top, bot = sorted(cs[:2], key=lambda c: c[0]), sorted(cs[2:], key=lambda c: c[0])
            pts = [tuple(top[0]), tuple(top[1]), tuple(bot[1]), tuple(bot[0])]
        quads.append([[round(cx + (x - cx) * 1.03), round(cy + (y - cy) * 1.03)] for x, y in pts])
    quads.sort(key=lambda q: q[0][0])
    names = [key] if n == 1 else [key + "ab"[j] for j in range(n)]
    for nm, q in zip(names, quads): Q[nm] = q; print(nm, q)
    inside = Image.new("L", (1080, 1920), 0); d = ImageDraw.Draw(inside)
    for q in quads: d.polygon([tuple(p) for p in q], fill=255)
    inside = np.asarray(inside.filter(ImageFilter.MaxFilter(15))) > 0
    alpha = np.where(inside & white, 0, 255).astype(np.uint8)
    al = Image.fromarray(alpha).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(1.2))
    out = im.convert("RGBA"); out.putalpha(al); out.save(f"{reel}/out/img/{key}_top.png")
json.dump(Q, open(qf, "w"), indent=0)
