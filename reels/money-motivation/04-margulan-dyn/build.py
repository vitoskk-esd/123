"""Рилс №4 — динамичный формат (владелец 15.11: «другой формат, чтобы было интереснее смотреть, качество лучше»).
Спикер на весь экран (без лишнего увеличения), наезды на ключевых словах, субтитры по словам с жёлтым текущим словом,
«180°» + оборот камеры, зеркальный переворот на «наоборот», вставка-сток «отдавай много и сразу»,
графика-лестница «получай постепенно» со спикером в круге, тёмный трэп-бит и звук на каждое событие.
  python3 build.py   → reel.mp4
"""
import math, subprocess, numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageChops

W, H, FPS = 1080, 1920, 30
SRC = "../03-margulan/src/clip.mp4"
SPEECH, DUR = 13.2, 13.7
BLACK = "/usr/share/fonts/opentype/inter/InterDisplay-Black.otf"
XB = "/usr/share/fonts/opentype/inter/InterDisplay-ExtraBold.otf"
YEL, WHITE = (255, 212, 0), (255, 255, 255)

# ---------- слова (Gemini, с) ----------
WORDS = [(0.00, "Для"), (0.08, "того,"), (0.16, "чтобы"), (0.34, "добиться"), (0.72, "успеха"), (1.24, "в"), (1.34, "любом"),
         (1.74, "деле"), (2.06, "с"), (2.18, "нуля,"), (2.84, "вы"), (3.04, "должны"), (3.26, "действовать"), (3.84, "контр-"),
         (4.48, "интуитивно,"), (5.64, "на"), (5.84, "180"), (6.82, "градусов"), (7.28, "наоборот:"), (8.24, "вы"), (8.42, "должны"),
         (8.64, "отдавать"), (9.22, "много"), (9.90, "и"), (10.02, "сразу,"), (10.66, "а"), (10.82, "получать"), (11.46, "помаленьку"),
         (12.08, "и"), (12.28, "постепенно.")]
CHUNKS = [[0, 1, 2], [3, 4], [5, 6, 7], [8, 9], [10, 11, 12], [13], [14], [15, 16, 17], [18]]   # индексы слов; дальше — вставки

# ---------- сцены ----------
BROLL_A, BROLL_B = 8.20, 10.62          # сток «отдавай»
GRAPH_A = 10.62                         # графика-лестница до конца
SPIN_A, SPIN_B = 6.86, 7.26             # оборот камеры 360°
FLIP_A, FLIP_B = 7.24, 7.48             # зеркальный переворот на «наоборот»
HOOK_B = 2.6

def ease_out(x): x = min(1, max(0, x)); return 1 - (1 - x) ** 3
def ease_io(x): x = min(1, max(0, x)); return x * x * (3 - 2 * x)

# камера: (время, масштаб, сдвиг_y, наклон°); между ключами — щелчок 0.14 с ease-out, затем медленный дрейф
CAM = [(0.0, 1.00, 0, 0), (0.70, 1.08, -40, 0), (2.16, 1.00, 0, 0), (2.82, 1.03, -10, 0), (3.82, 1.12, -60, -1.2),
       (5.62, 1.00, 0, 0), (7.26, 1.06, -20, 0)]
def cam(t):
    k = max(i for i, c in enumerate(CAM) if c[0] <= t)
    t0, s1, y1, r1 = CAM[k]; s0, y0, r0 = (CAM[k - 1][1:] if k else CAM[0][1:])
    p = ease_out((t - t0) / 0.14)
    s = s0 + (s1 - s0) * p; y = y0 + (y1 - y0) * p; r = r0 + (r1 - r0) * p
    s *= 1 + 0.012 * min(1, (t - t0) / 1.5)            # дрейф внутри плана
    if SPIN_A <= t <= SPIN_B:                           # оборот + наезд
        q = ease_io((t - SPIN_A) / (SPIN_B - SPIN_A)); r += 360 * q; s *= 1 + 0.18 * math.sin(math.pi * q)
    fx = 1.0
    if t >= FLIP_A:                                     # зеркало: scaleX 1 → -1
        q = ease_io((t - FLIP_A) / (FLIP_B - FLIP_A)); fx = math.cos(math.pi * q)
        if abs(fx) < 0.04: fx = 0.04 if q < 0.5 else -0.04
    return s, y, r, fx

def transform(img, s, dy, r, fx):
    """Масштаб s, сдвиг dy, поворот r°, зеркало fx вокруг центра кадра (обратное аффинное)."""
    cx, cy = W / 2, H / 2
    a = math.radians(r); ca, sa = math.cos(a), math.sin(a)
    # выход (u,v) → вход: x = cx + ((u-cx)*ca + (v-cy-dy)*sa)/(s*fx) ...
    A = ca / (s * fx); B = sa / (s * fx); D = -sa / s; E = ca / s
    C = cx - A * cx - B * (cy + dy); F = cy - D * cx - E * (cy + dy)
    return img.transform((W, H), Image.AFFINE, (A, B, C, D, E, F), Image.BICUBIC, fillcolor=(8, 8, 10))

# ---------- шрифты и текстовые плашки ----------
def font(p, s): return ImageFont.truetype(p, s)
def stroke_text(d, xy, txt, f, fill, sw=7, anchor="mm"):
    d.text(xy, txt, font=f, fill=fill, stroke_width=sw, stroke_fill=(0, 0, 0), anchor=anchor)

def captions(t, d):
    for ch in CHUNKS:
        a = WORDS[ch[0]][0] - 0.05; b = WORDS[ch[-1] + 1][0] - 0.05 if ch[-1] + 1 < len(WORDS) else SPEECH
        if not (a <= t < b): continue
        if 5.80 <= t < 7.24: return                     # на «180°» — только большая цифра
        words = [WORDS[i][1].upper().rstrip(",.:") for i in ch]
        cur = max([j for j, i in enumerate(ch) if WORDS[i][0] - 0.03 <= t] or [0])
        f = font(BLACK, 84); fb = font(BLACK, 96)
        widths = [(fb if j == cur else f).getlength(w) for j, w in enumerate(words)]
        gap = 26; total = sum(widths) + gap * (len(words) - 1)
        if total > W - 80:                               # не влезает — уменьшаем
            k = (W - 80) / total; f = font(BLACK, int(84 * k)); fb = font(BLACK, int(96 * k))
            widths = [(fb if j == cur else f).getlength(w) for j, w in enumerate(words)]; total = sum(widths) + gap * (len(words) - 1)
        x = (W - total) / 2; y = 1290
        pop = ease_out((t - (WORDS[ch[cur]][0] - 0.03)) / 0.12)
        for j, w in enumerate(words):
            ff = fb if j == cur else f
            if j == cur and pop < 1: ff = font(BLACK, int(ff.size * (0.86 + 0.14 * pop)))
            col = YEL if j == cur else WHITE
            stroke_text(d, (x + widths[j] / 2, y), w, ff, col, sw=8)
            x += widths[j] + gap
        return

def hook(t, im):
    if t >= HOOK_B: return
    p = ease_out(t / 0.18) if t > 0.02 else 1.0
    out = 1 - ease_out((t - (HOOK_B - 0.2)) / 0.2) if t > HOOK_B - 0.2 else 1
    lay = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(lay)
    f1 = font(BLACK, 66); t1 = "ПРАВИЛО УСПЕХА С НУЛЯ"; w1 = f1.getlength(t1)
    d.rounded_rectangle([(W - w1) / 2 - 30, 238, (W + w1) / 2 + 30, 342], 22, fill=(255, 255, 255, 255))
    d.text((W / 2, 290), t1, font=f1, fill=(10, 10, 10), anchor="mm")
    f2 = font(BLACK, 64); stroke_text(d, (W / 2, 410), "РАБОТАЕТ НА 100%", f2, YEL, sw=6)
    sc = 1.12 - 0.12 * p
    if sc != 1:                                          # масштаб вокруг центра плашки (W/2, 290)
        big = lay.resize((int(W * sc), int(H * sc)), Image.BICUBIC); lay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        lay.paste(big, (int(W / 2 - W / 2 * sc), int(290 - 290 * sc)))
    lay.putalpha(lay.split()[3].point(lambda v: int(v * min(p, out))))
    im.alpha_composite(lay)

def big180(t, im):
    if not (5.82 <= t < 7.28): return
    p = ease_out((t - 5.82) / 0.16); sc = 1.35 - 0.35 * p
    lay = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(lay)
    stroke_text(d, (W / 2, 1180), "180°", font(BLACK, int(330 * sc)), YEL, sw=14)
    if t >= 6.80: stroke_text(d, (W / 2, 1400), "ГРАДУСОВ", font(BLACK, 92), WHITE, sw=9)
    im.alpha_composite(lay)

def label(d, x, y, txt, f, bg, fg, p):
    w = f.getlength(txt); off = (1 - p) * -60
    d.rounded_rectangle([x + off, y, x + off + w + 56, y + f.size + 44], 18, fill=bg + (int(255 * p),))
    d.text((x + off + 28, y + 20), txt, font=f, fill=fg + (int(255 * p),))

def broll_labels(t, im):
    lay = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(lay)
    f = font(BLACK, 112)
    for tt, y, txt, bg, fg in [(8.62, 980, "ОТДАВАЙ", (255, 255, 255), (10, 10, 10)), (9.20, 1150, "МНОГО", YEL, (10, 10, 10)),
                               (10.0, 1320, "И СРАЗУ", (10, 10, 10), (255, 255, 255))]:
        if t >= tt: label(d, 70, y, txt, f, bg, fg, ease_out((t - tt) / 0.16))
    im.alpha_composite(lay)

# графика «лестница»
def graph(t, spk):
    im = Image.new("RGBA", (W, H), (9, 10, 14, 255))
    g = Image.new("L", (W, H), 0); ImageDraw.Draw(g).ellipse([-300, 300, W + 300, 1900], fill=60)
    g = g.filter(ImageFilter.GaussianBlur(160)); glow = Image.new("RGBA", (W, H), (40, 200, 120, 255)); glow.putalpha(g)
    im.alpha_composite(glow)
    d = ImageDraw.Draw(im)
    for gx in range(90, W, 150): d.line([(gx, 520), (gx, 1500)], fill=(255, 255, 255, 18), width=2)
    for gy in range(520, 1501, 140): d.line([(90, gy), (W - 90, gy)], fill=(255, 255, 255, 18), width=2)
    p0 = ease_out((t - GRAPH_A) / 0.2)
    stroke_text(d, (W / 2, 300), "ПОЛУЧАЙ", font(BLACK, 96), WHITE, sw=0)
    if t >= 11.44: stroke_text(d, (W / 2, 410), "ПОМАЛЕНЬКУ", font(BLACK, 84), (180, 180, 190), sw=0)
    if t >= 12.26:
        q = ease_out((t - 12.26) / 0.16); stroke_text(d, (W / 2, 410 if t < 11.44 else 520), "И ПОСТЕПЕННО", font(BLACK, int(104 * (1.2 - 0.2 * q))), YEL, sw=0)
    bars = [11.0, 11.35, 11.7, 12.05, 12.4, 12.75]
    base = 1480; bw = 110; x0 = 150; tops = []
    for i, bt in enumerate(bars):
        if t < bt: break
        q = ease_out((t - bt) / 0.22); h = (120 + i * 125) * q
        x = x0 + i * 140
        col = (61, 220, 132, 255) if i < 5 else (255, 212, 0, 255)
        d.rounded_rectangle([x, base - h, x + bw, base], 14, fill=col)
        tops.append((x + bw / 2, base - h - 30))
    if len(tops) > 1: d.line(tops, fill=(255, 255, 255, 200), width=6, joint="curve")
    # спикер в круге
    r = 170; cxy = (W - 90 - r, 1650)
    face = spk.crop((540 - 330, 820 - 330 - 60, 540 + 330, 820 + 330 - 60)).resize((2 * r, 2 * r), Image.LANCZOS)
    m = Image.new("L", (2 * r, 2 * r), 0); ImageDraw.Draw(m).ellipse([0, 0, 2 * r - 1, 2 * r - 1], fill=255)
    d.ellipse([cxy[0] - r - 8, cxy[1] - r - 8, cxy[0] + r + 8, cxy[1] + r + 8], fill=(255, 255, 255, 255))
    im.paste(face, (cxy[0] - r, cxy[1] - r), m)
    if p0 < 1:
        im = Image.blend(Image.new("RGBA", (W, H), (9, 10, 14, 255)), im, p0)
    return im

# ---------- чтение кадров ----------
def reader(args):
    return subprocess.Popen(["ffmpeg", "-v", "error", *args, "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], stdout=subprocess.PIPE)
def read(p): return Image.frombytes("RGB", (W, H), p.stdout.read(W * H * 3))

spk = reader(["-ss", "0", "-t", str(DUR + 0.5), "-i", SRC, "-vf",
              f"fps={FPS},scale={W}:{H}:flags=lanczos,unsharp=5:5:0.9:3:3:0.3,eq=contrast=1.06:saturation=1.08:gamma=0.98,"
              "colorbalance=rs=0.02:bs=-0.03,tpad=stop_mode=clone:stop_duration=2"])
brl = reader(["-ss", "0.2", "-i", "broll/give.mp4", "-vf",
              f"fps={FPS},scale={W}:{H}:force_original_aspect_ratio=increase:flags=lanczos,crop={W}:{H},"
              "eq=brightness=-0.06:contrast=1.08:saturation=1.1,colorbalance=rs=0.03:bs=-0.04,vignette=PI/5,tpad=stop_mode=clone:stop_duration=5"])

enc = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
                        "-c:v", "libx264", "-preset", "slow", "-crf", "17", "-pix_fmt", "yuv420p", "video.mp4"], stdin=subprocess.PIPE)
grain = [Image.fromarray((np.random.default_rng(i).normal(0, 7, (H // 2, W // 2)) + 128).clip(0, 255).astype(np.uint8)).resize((W, H)) for i in range(6)]
prev = None
for n in range(int(DUR * FPS)):
    t = n / FPS
    s_img = read(spk)
    if BROLL_A <= t < BROLL_B:
        base = read(brl).convert("RGBA")
        z = 1 + 0.05 * (t - BROLL_A) / (BROLL_B - BROLL_A)
        base = base.resize((int(W * z), int(H * z)), Image.BICUBIC).crop((int((W * z - W) / 2), int((H * z - H) / 2), int((W * z - W) / 2) + W, int((H * z - H) / 2) + H))
        broll_labels(t, base); im = base
    elif t >= GRAPH_A:
        im = graph(t, s_img)
    else:
        s, dy, r, fx = cam(t)
        if SPIN_A <= t <= SPIN_B:                       # смаз движения при обороте: среднее трёх положений
            fr = [transform(s_img, *cam(t + k / (FPS * 3))) for k in (-1, 0, 1)]
            im = Image.blend(Image.blend(fr[0], fr[2], 0.5), fr[1], 0.4)
        else:
            im = transform(s_img, s, dy, r, fx)
        im = im.convert("RGBA")
        d = ImageDraw.Draw(im); captions(t, d); hook(t, im); big180(t, im)
    # вспышки на ударах
    for ft in (5.84, 7.26, BROLL_A):
        if ft <= t < ft + 0.12:
            im = Image.blend(im, Image.new("RGBA", (W, H), (255, 255, 255, 255)), 0.55 * (1 - (t - ft) / 0.12))
    rgb = im.convert("RGB")
    rgb = ImageChops.overlay(rgb, Image.merge("RGB", [grain[n % 6]] * 3)) if True else rgb
    enc.stdin.write(rgb.tobytes())
enc.stdin.close(); enc.wait()
print("video.mp4 ok")
