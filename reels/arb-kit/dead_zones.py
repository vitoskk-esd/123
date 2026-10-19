#!/usr/bin/env python3
"""Автопроверка готового ролика на «мёртвые зоны» (engine-roadmap: S8 / «0. Автопроверка»): отрезки дольше порога,
где кадр почти не меняется — зритель на них скучает и листает дальше. Меряем среднюю разницу соседних кадров
(уменьшенных до 135×240, 10 к/с); склейки и вспышки не мешают — считается только «тихое» движение.
  python3 arb-kit/dead_zones.py <ролик.mp4> [--max 3.0] [--quiet 1.2]
--max   — сколько секунд тишины терпим (по умолчанию 3 с — правило владельца «план не короче 2,5 с, но внутри что-то происходит»);
--quiet — порог движения (средняя разница яркости 0–255 между кадрами через 0,1 с), ниже которого кадр «стоит».
Печатает отрезки «с–по» и итог; код выхода 1, если есть мёртвые зоны.
"""
import subprocess, sys
import numpy as np

W, H, R = 135, 240, 10


def motion(path):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-vf", f"fps={R},scale={W}:{H},format=gray", "-f", "rawvideo", "-"],
                         capture_output=True).stdout
    F = np.frombuffer(raw, np.uint8).reshape(-1, H, W).astype(np.float32)
    return np.abs(np.diff(F, axis=0)).mean((1, 2))


def main(path, mx=3.0, quiet=1.2):
    d = motion(path); still = d < quiet; zones, start = [], None
    for i, s in enumerate(list(still) + [False]):
        if s and start is None: start = i
        if not s and start is not None:
            if (i - start) / R >= mx: zones.append((start / R, i / R))
            start = None
    dur = len(d) / R
    for a, b in zones: print(f"  мёртвая зона {a:5.1f}–{b:5.1f} с ({b - a:.1f} с)")
    print(f"{path}: {dur:.1f} с, среднее движение {d.mean():.2f}, мёртвых зон {len(zones)} (порог {mx:g} с)")
    return not zones


if __name__ == "__main__":
    a = sys.argv[1:]; opt = lambda k, v: float(a[a.index(k) + 1]) if k in a else v
    sys.exit(0 if main(a[0], opt("--max", 3.0), opt("--quiet", 1.2)) else 1)
