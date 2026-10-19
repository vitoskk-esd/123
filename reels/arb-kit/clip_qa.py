#!/usr/bin/env python3
"""Проверка плавности клипов Kling до монтажа (владелец 19.10: «движения не плавные, когда кладёт вещи — очень размыты»).
По каждому клипу печатает:
  «двойки»  — доля пар кадров, где новый кадр почти повторяет прошлый, а следующий скачет (анимация на двойках = 12 рисунков/с, рывки);
  смаз      — секунды, где в движущихся клетках кадра резкость падает ниже 25 % от обычной (размытые руки и предметы на взмахах);
  рывок     — самый большой скачок между кадрами относительно медианного движения;
  замер     — сколько секунд в конце картинка стоит (последний кадр «прибит»).
Вердикт: ПЕРЕДЕЛАТЬ (смаз, рывок — перегенерировать с правилами MOTION/beats из tools/higgsfield/gen.py) или ОК;
«двойки» чинит arb-kit/smooth.py (RIFE дорисовывает промежуточные кадры), замер в конце — обрезка в монтаже.
  python3 arb-kit/clip_qa.py <клип.mp4> [ещё клипы…]
"""
import subprocess, sys
import numpy as np

W, H = 270, 480


def frames(f):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", f, "-vf", f"scale={W}:{H},format=gray", "-f", "rawvideo", "-"], capture_output=True).stdout
    return np.frombuffer(raw, np.uint8).reshape(-1, H, W).astype(np.float32)


def fps(f):
    r = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v", "-show_entries", "stream=r_frame_rate", "-of", "csv=p=0", f],
                       capture_output=True, text=True).stdout.strip().split("/")
    return float(r[0]) / float(r[1] if len(r) > 1 else 1)


def sharp(a):   # дисперсия лапласиана: падает, когда кадр размыт
    return float(np.var(4 * a[1:-1, 1:-1] - a[:-2, 1:-1] - a[2:, 1:-1] - a[1:-1, :-2] - a[1:-1, 2:]))


def tile_sharp(a, t=24):   # резкость по клеткам t×t: дисперсия лапласиана в каждой
    l = 4 * a[1:-1, 1:-1] - a[:-2, 1:-1] - a[2:, 1:-1] - a[1:-1, :-2] - a[1:-1, 2:]
    h, w = (l.shape[0] // t) * t, (l.shape[1] // t) * t
    return l[:h, :w].reshape(h // t, t, w // t, t).var((1, 3))


def local_blur(F, t=24):
    """Кадры со смазом там, где движется рука или предмет: в худшей четверти движущихся клеток резкость < 25 % от обычной резкости этих клеток.
    Смаз локальный (руки, предмет в полёте) — по всему кадру его не видно, поэтому меряем по клеткам."""
    S = np.array([tile_sharp(x, t) for x in F]); ref = np.percentile(S, 80, axis=0) + 1
    out = []
    for i in range(1, len(F)):
        m = np.abs(F[i] - F[i - 1])[1:-1, 1:-1]; h, w = S.shape[1] * t, S.shape[2] * t
        mv = m[:h, :w].reshape(S.shape[1], t, S.shape[2], t).mean((1, 3)) > 6
        if mv.mean() > .01 and np.percentile(S[i][mv] / ref[mv], 25) < .25: out.append(i)   # худшая четверть движущихся клеток
    return out


def qa(f):
    F, r = frames(f), fps(f)
    d = np.abs(np.diff(F, axis=0)).mean((1, 2)); s = np.array([sharp(x) for x in F])
    moving = d > 0.6   # участки, где в кадре вообще есть движение
    # двойки: в движении малый шаг чередуется с большим
    pairs = [(d[i], d[i + 1]) for i in range(len(d) - 1) if moving[i] or moving[i + 1]]
    twos = sum(1 for a, b in pairs if min(a, b) < .3 * max(a, b)) / max(1, len(pairs))
    blur_t = [i / r for i in local_blur(F)]
    jump = float(d.max() / max(1e-6, np.median(d[moving]) if moving.any() else 1))
    still = 0
    for x in d[::-1]:
        if x > .15: break
        still += 1
    bad, fix = [], []   # bad — перегенерировать; fix — чинится в движке
    if len(blur_t) / r > .25: bad.append(f"смаз {len(blur_t) / r:.1f} с ({blur_t[0]:.1f}–{blur_t[-1]:.1f} с)")
    if jump > 4: bad.append(f"рывок ×{jump:.1f}")
    if twos > .35: fix.append(f"двойки {twos:.0%} → arb-kit/smooth.py")
    if still / r > .6: fix.append(f"замер в конце {still / r:.1f} с → обрезать в монтаже")
    print(f"{f}: {len(F)} кадров, {r:.0f} к/с · двойки {twos:.0%} · смаз {len(blur_t) / r:.1f} с · рывок ×{jump:.1f} · замер {still / r:.1f} с"
          f"\n  → {'ПЕРЕДЕЛАТЬ: ' + ', '.join(bad) if bad else 'ОК'}" + (f"; в движке: {', '.join(fix)}" if fix else ""))
    return not bad


if __name__ == "__main__":
    ok = [qa(f) for f in sys.argv[1:]]
    sys.exit(0 if all(ok) else 1)
