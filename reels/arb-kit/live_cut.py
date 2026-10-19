#!/usr/bin/env python3
"""Монтаж рилса из живых клипов (рилс 23 и дальше; скиллы reel-production «Живое видео…», kinetic-reel-edit).
Склеивает клипы Kling в 60 к/с (сглаженные arb-kit/smooth.py), камера — медленный дрейф и панч-ин на текстовом моменте,
переходы на слове (пиксельный распад, смаз, склейка), 2–4 текстовых момента (крупное слово в кадре, может стоять за Арбузовым),
экран телефона вклеивается в неподвижный крупный план, свет — виньетка + зерно. Звук: TL для youtube/kit/audio.js + голос → mix.sh.
Монтажный лист — <рилс>/edit.py: функция edit(W) (W — слова голоса из out/voice/words.json) возвращает dict (см. рилс 23).
  <python с numpy, scipy, PIL, torch> arb-kit/live_cut.py <папка рилса> [--from 12.5 --to 16 --png]   # кусок/кадры для проверки
"""
import importlib.util, json, math, os, subprocess, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont
from scipy import ndimage

KIT = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(os.path.dirname(KIT))
FW, FH, FPS = 1080, 1920, 60
FONTS = {"hero": ("DelaGothicOne-Regular.ttf", None), "black": ("Unbounded[wght].ttf", b"Black"),
         "bold": ("Manrope[wght].ttf", b"ExtraBold"), "pixel": ("PressStart2P-Regular.ttf", None)}
RED, WHITE, TEAL = (232, 38, 46), (246, 244, 238), (64, 224, 208)


def font(kind, size):
    f, var = FONTS[kind]; ft = ImageFont.truetype(f"{KIT}/fonts/{f}", size)
    if var: ft.set_variation_by_name(var)
    return ft


# ---------- клипы ----------
class Clip:
    """Последовательное чтение кадров 1080×1920 из mp4 (60 к/с после smooth.py); назад — перезапуск."""
    def __init__(self, path):
        self.path, self.p, self.i, self.last = path, None, -1, None
        self.n = int(subprocess.run(["ffprobe", "-v", "error", "-count_packets", "-select_streams", "v", "-show_entries",
                                     "stream=nb_read_packets", "-of", "csv=p=0", path], capture_output=True, text=True).stdout.strip())

    def get(self, i):
        i = max(0, min(self.n - 1, i))
        if i < self.i or self.p is None:
            if self.p: self.p.kill()
            self.p = subprocess.Popen(["ffmpeg", "-v", "error", "-i", self.path, "-vf", f"scale={FW}:{FH}", "-f", "rawvideo",
                                       "-pix_fmt", "rgb24", "-"], stdout=subprocess.PIPE); self.i = -1
        while self.i < i:
            b = self.p.stdout.read(FW * FH * 3)
            if len(b) < FW * FH * 3: break
            self.last = np.frombuffer(b, np.uint8).reshape(FH, FW, 3); self.i += 1
        return self.last


def ensure_60(reel, cid):
    """hf/<id>.mp4 (24 к/с) → out/clips60/<id>.mp4 (60 к/с, RIFE дорисовывает промежуточные кадры)."""
    dst = f"{reel}/out/clips60/{cid}.mp4"
    if not os.path.exists(dst):
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        subprocess.run([sys.executable, f"{KIT}/smooth.py", f"{reel}/hf/{cid}.mp4", dst, "--fps", str(FPS)], check=True)
    return dst


# ---------- текст ----------
def sprite(text, kind, size, color, stroke=0, arc=0.0):
    """Слово → RGBA. arc — изгиб дугой (доля: 0.15 — заметная дуга вверх)."""
    ft = font(kind, size)
    if not arc:
        l, t, r, b = ft.getbbox(text, stroke_width=stroke); im = Image.new("RGBA", (r - l + 8, b - t + 8))
        ImageDraw.Draw(im).text((4 - l, 4 - t), text, font=ft, fill=color + (255,), stroke_width=stroke, stroke_fill=(0, 0, 0, 255))
        return im
    letters = [sprite(ch, kind, size, color, stroke) if ch != " " else Image.new("RGBA", (size // 3, 2)) for ch in text]
    widths = [l.width * .92 for l in letters]; total = sum(widths); R = total / (arc * 2 * math.pi) * 1.0
    can = Image.new("RGBA", (int(total * 1.2), int(size * 2.6))); cx, cy = can.width / 2, can.height - size * .2 + R; a = -total / 2
    for l, w in zip(letters, widths):
        ang = (a + w / 2) / R; r = l.rotate(-math.degrees(ang), expand=True, resample=Image.BICUBIC)
        x = cx + math.sin(ang) * R - r.width / 2; y = cy - math.cos(ang) * R - r.height / 2; can.alpha_composite(r, (int(x), int(y))); a += w
    return can.crop(can.getbbox())


def ease_back(x):
    c = 1.9; x = min(max(x, 0), 1); return 1 + (c + 1) * (x - 1) ** 3 + c * (x - 1) ** 2


def place(frame, spr, x, y, scale=1.0, alpha=1.0, rot=0.0, dx=0, dy=0):
    """Наложить спрайт центром в (x, y) — доли кадра; scale/rot/alpha — анимация."""
    if scale <= 0 or alpha <= 0: return
    s = spr if scale == 1 and rot == 0 else spr.resize((max(1, int(spr.width * scale)), max(1, int(spr.height * scale))), Image.BICUBIC)
    if rot: s = s.rotate(rot, expand=True, resample=Image.BICUBIC)
    if alpha < 1: a = s.getchannel("A").point(lambda v: int(v * alpha)); s = s.copy(); s.putalpha(a)
    frame.alpha_composite(s, (int(x * FW - s.width / 2 + dx), int(y * FH - s.height / 2 + dy)))


def word_state(w, t, out_t):
    """Анимация одного слова момента: появление (slam/rise/count), дрожь после удара, уход пикселями."""
    a = t - w["t"]
    if a < 0: return None
    st = dict(scale=1.0, alpha=1.0, dx=0, dy=0, rot=w.get("rot", 0))
    anim = w.get("anim", "rise")
    if anim == "slam":
        k = a / .11; st["scale"] = 1.55 - .55 * ease_back(k) if k < 1 else 1.0; st["alpha"] = min(1, k * 2 + .3)
        if .11 <= a < .32: rnd = np.random.default_rng(int(t * 1000)); st["dx"], st["dy"] = rnd.integers(-7, 8, 2)
    elif anim == "rise":
        k = min(1, a / .14); st["alpha"] = k; st["dy"] = (1 - k) ** 2 * 26
    elif anim == "pop":
        k = a / .12; st["scale"] = .7 + .3 * ease_back(k) if k < 1 else 1.0; st["alpha"] = min(1, k * 2)
    if t > out_t: st["out"] = (t - out_t) / .14
    return st


def pixel_out(spr, k, seed):
    """Уход слова: распад на квадраты 14 px за время k 0→1."""
    if k >= 1: return None
    a = np.array(spr.getchannel("A")); h, w = a.shape; g = 14
    rnd = np.random.default_rng(seed).random(((h + g - 1) // g, (w + g - 1) // g))
    keep = np.kron(rnd > k, np.ones((g, g)))[:h, :w]; s = spr.copy(); s.putalpha(Image.fromarray((a * keep).astype(np.uint8))); return s


def draw_moment(frame, m, t, subject=None):
    """Текстовый момент: слова появляются на своих временах, держатся до m['out'], уходят распадом. subject — маска Арбузова
    (для слов с behind=True: слово под головой, голова перекрывает его)."""
    if not (m["words"][0]["t"] <= t <= m["out"] + .2): return frame
    back = Image.new("RGBA", (FW, FH)); front = Image.new("RGBA", (FW, FH))
    for i, w in enumerate(m["words"]):
        st = word_state(w, t, m["out"])
        if not st: continue
        spr = w["_spr"]
        if w.get("count"):   # счётчик: число бежит к w["count"][1]
            a, b = w["count"]; k = min(1, (t - w["t"]) / w.get("count_dur", .5)); v = round(a + (b - a) * (1 - (1 - k) ** 3))
            spr = sprite(w["fmt"].format(v), w["kind"], w["size"], w["color"], w.get("stroke", 0))
        if "out" in st:
            spr = pixel_out(spr, st["out"], i * 7 + 3)
            if spr is None: continue
        place(back if w.get("behind") else front, spr, w["x"], w["y"], st["scale"], st["alpha"], st["rot"], st["dx"], st["dy"])
    orig = frame; frame = Image.alpha_composite(frame, back)
    if subject is not None:   # голова/фигура Арбузова (из кадра без текста) поверх слов «за ним»
        fg = orig.copy(); fg.putalpha(Image.fromarray(subject)); frame = Image.alpha_composite(frame, fg)
    return Image.alpha_composite(frame, front)


def head_mask(rgb, box):
    """Маска Арбузова в рамке box (доли кадра): арбуз (зелёный) + кепка (красная) + толстовка (серая, низкая насыщенность)
    — связная область вокруг арбуза. Хватает для слова, спрятанного за голову/плечи."""
    x0, y0, x1, y1 = int(box[0] * FW), int(box[1] * FH), int(box[2] * FW), int(box[3] * FH)
    a = rgb[y0:y1, x0:x1].astype(np.float32) / 255; r, g, b = a[..., 0], a[..., 1], a[..., 2]
    mx, mn = a.max(2), a.min(2); s = (mx - mn) / (mx + 1e-6)
    green = (g >= r) & (g >= b * .95) & (s > .28) & (mx > .12)
    red = (r > g * 1.6) & (r > b * 1.5) & (s > .45) & (mx > .25)
    m = ndimage.binary_opening(green | red, iterations=2); lab, n = ndimage.label(m)
    if n == 0: return np.zeros((FH, FW), np.uint8)
    sizes = ndimage.sum(m, lab, range(1, n + 1)); big = np.isin(lab, [i + 1 for i, v in enumerate(sizes) if v > .25 * sizes.max()])
    big = ndimage.binary_fill_holes(ndimage.binary_closing(big, iterations=6))
    out = np.zeros((FH, FW), np.uint8); out[y0:y1, x0:x1] = big * 255
    return np.array(Image.fromarray(out).filter(ImageFilter.GaussianBlur(1.5)))


# ---------- экран телефона ----------
def persp_coeffs(src, dst):
    """Коэффициенты PIL PERSPECTIVE: точки dst (кадр) → src (картинка экрана)."""
    A, B = [], []
    for (x, y), (u, v) in zip(dst, src):
        A += [[x, y, 1, 0, 0, 0, -u * x, -u * y], [0, 0, 0, x, y, 1, -v * x, -v * y]]; B += [u, v]
    return np.linalg.solve(np.array(A, float), np.array(B, float)).tolist()


def put_screen(frame, ui, quad):
    """Картинка экрана ui (RGBA, пропорции экрана) → четырёхугольник quad (TL, TR, BR, BL в пикселях кадра)."""
    w, h = ui.size; c = persp_coeffs([(0, 0), (w, 0), (w, h), (0, h)], quad)
    warped = ui.transform((FW, FH), Image.PERSPECTIVE, c, Image.BICUBIC)
    m = Image.new("L", (FW * 2, FH * 2)); ImageDraw.Draw(m).polygon([(x * 2, y * 2) for x, y in quad], fill=255)
    warped.putalpha(Image.fromarray(np.minimum(np.array(warped.getchannel("A")), np.array(m.resize((FW, FH), Image.LANCZOS)))))
    return Image.alpha_composite(frame, warped)


# ---------- переходы, камера, свет ----------
def camera(img, z, cx, cy):
    """Наезд z (1 — без), центр (cx, cy) в долях кадра."""
    if abs(z - 1) < 1e-4 and cx == .5 and cy == .5: return img
    w, h = FW / z, FH / z; x0 = min(max(cx * FW - w / 2, 0), FW - w); y0 = min(max(cy * FH - h / 2, 0), FH - h)
    return img.resize((FW, FH), Image.BICUBIC, box=(x0, y0, x0 + w, y0 + h))


def pixel_trans(a, b, k, seed):
    """Пиксельный распад A→B: квадраты 90 px меняются в случайном порядке, в момент смены вспыхивают красным/белым/чёрным."""
    g = 90; gh, gw = (FH + g - 1) // g, (FW + g - 1) // g; r = np.random.default_rng(seed).random((gh, gw))
    sw = np.kron(r < k, np.ones((g, g), bool))[:FH, :FW]; fl = np.kron((r >= k - .22) & (r < k), np.ones((g, g), bool))[:FH, :FW]
    col = np.kron(np.random.default_rng(seed + 1).integers(0, 3, (gh, gw)), np.ones((g, g), int))[:FH, :FW]
    out = np.where(sw[..., None], b, a).copy(); pal = np.array([RED, WHITE, (12, 12, 14)], np.uint8)
    out[fl] = pal[col[fl]]; return out


def whip(a, b, k):
    """Смаз-панорама: A уезжает влево, B приезжает справа, в середине — сильный горизонтальный смаз."""
    src, off = (a, -k * FW * .5) if k < .5 else (b, (1 - k) * FW * .5)
    s = np.roll(src, int(off), axis=1); blur = int(10 + 70 * (1 - abs(k - .5) * 2))
    return ndimage.uniform_filter1d(s, blur, axis=1)


VIG = None


def grade(rgb, n):
    """Виньетка + лёгкое зерно — один «свет» на весь рилс."""
    global VIG
    if VIG is None:
        yy, xx = np.mgrid[0:FH, 0:FW]; d = ((xx - FW / 2) / (FW * .62)) ** 2 + ((yy - FH / 2) / (FH * .62)) ** 2
        VIG = (1 - .32 * np.clip(d - .35, 0, 1) ** 1.2)[..., None].astype(np.float32)
    noise = np.random.default_rng(n).normal(0, 5.5, (FH // 2, FW // 2, 1)).astype(np.float32).repeat(2, 0).repeat(2, 1)
    return np.clip(rgb.astype(np.float32) * VIG + noise, 0, 255).astype(np.uint8)


# ---------- сборка ----------
def load_edit(reel):
    W = json.load(open(f"{reel}/out/voice/words.json"))
    spec = importlib.util.spec_from_file_location("edit", f"{reel}/edit.py"); mod = importlib.util.module_from_spec(spec); spec.loader.exec_module(mod)
    return mod.edit(W)


def render(reel, t_from=None, t_to=None, png=False):
    E = load_edit(reel); S = E["shots"]; END = E["end"]; OFF = E.get("voice_off", .3)
    clips = {}   # открываем клип при первом обращении (проба куска не трогает остальные клипы)
    def clip(c):
        if c not in clips: clips[c] = Clip(ensure_60(reel, c))
        return clips[c]
    for m in E["moments"]:
        for w in m["words"]: w["_spr"] = sprite(w["text"], w["kind"], w["size"], w["color"], w.get("stroke", 0), w.get("arc", 0))
    uis = {k: Image.open(f"{reel}/{v}").convert("RGBA") for k, v in E.get("screens_ui", {}).items()}
    n0, n1 = int((t_from or 0) * FPS), int((t_to or END) * FPS)
    out = f"{reel}/out/live.mp4" if t_from is None else f"{reel}/out/live_{t_from:g}-{t_to:g}.mp4"
    enc = None if png else subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{FW}x{FH}", "-r", str(FPS),
                                             "-i", "-", "-c:v", "libx264", "-crf", "16", "-preset", "medium", "-pix_fmt", "yuv420p", out], stdin=subprocess.PIPE)
    starts = [s["t"] for s in S]

    def shot_frame(si, t):
        """Кадр плана si в момент t (до камеры): клип + экран + текст."""
        s = S[si]; src = s.get("src", 0) + (t - s["t"]) * s.get("speed", 1)
        if "src2" in s and t >= s["t2"]: src = s["src2"] + (t - s["t2"]) * s.get("speed", 1)
        rgb = clip(s["clip"]).get(int(round(src * FPS))); img = Image.fromarray(rgb).convert("RGBA")
        for sc in s.get("screens", []):
            if sc["t0"] <= t: img = put_screen(img, uis[sc["ui"]], sc["quad"])
        for m in E["moments"]:
            if m["shot"] == si:
                subj = head_mask(rgb, m["mask_box"]) if any(w.get("behind") for w in m["words"]) else None
                img = draw_moment(img, m, t, subj)
        return img

    def cam(si, t):
        s = S[si]; t1 = starts[si + 1] if si + 1 < len(S) else END; k = (t - s["t"]) / max(.1, t1 - s["t"])
        z0, z1 = s.get("zoom", (1.0, 1.04)); cx, cy = s.get("center", (.5, .5)); z = z0 + (z1 - z0) * k
        for m in E["moments"]:
            if m.get("punch") and m["shot"] == si:
                d = t - m["punch"]
                if 0 <= d < .07: z *= 1 + .1 * d / .07
                elif .07 <= d < .25: z *= 1 + .1 * (1 - (d - .07) / .18) ** 2
        return z, cx, cy

    DUR = {"pixel": .18, "whip": .2}

    def full(si, t):
        z, cx, cy = cam(si, t); return np.array(camera(shot_frame(si, t), z, cx, cy).convert("RGB"))

    for n in range(n0, n1):
        t = n / FPS; si = max(i for i, st in enumerate(starts) if st <= t)
        # окно перехода вокруг склейки Tb: план A держит последний кадр после Tb, план B — первый кадр до Tb
        j = next((j for j in (si, si + 1) if 0 < j < len(S) and S[j].get("trans", "cut") in DUR
                  and abs(t - S[j]["t"]) < DUR[S[j]["trans"]] / 2), None)
        if j is None: cur = full(si, t)
        else:
            Tb, D = S[j]["t"], DUR[S[j]["trans"]]; k = (t - (Tb - D / 2)) / D
            A = full(j - 1, min(t, Tb - 1 / FPS)); B = full(j, max(t, Tb))
            cur = pixel_trans(A, B, k, j) if S[j]["trans"] == "pixel" else whip(A, B, k)
        frame = grade(cur, n)
        if png: Image.fromarray(frame).save(f"{reel}/out/still_{t:06.2f}.jpg", quality=90)
        else: enc.stdin.write(frame.tobytes())
        if n % 60 == 0: print(f"\r  {t:5.1f}/{END:.1f} с", end="", flush=True)
    if enc: enc.stdin.close(); enc.wait()
    print(f"\n→ {out if not png else reel + '/out/still_*.jpg'}")
    if t_from is None and not png: mix(reel, E, out, OFF)


def mix(reel, E, video, off):
    """Звук: TL (музыка + SFX) → youtube/kit/audio.js; голос со сдвигом off; сведение — mix.sh (−14 LUFS)."""
    tl = dict(duration=E["end"], bpm=E.get("bpm", 92), music=E.get("music", [{"t": 0, "part": "main"}]), sfx=E["sfx"], sfxGain=E.get("sfxGain", 1))
    open(f"{reel}/out/live_tl.js", "w").write("window.TL = " + json.dumps(tl, ensure_ascii=False) + ";\n")
    subprocess.run(["node", f"{ROOT}/youtube/kit/audio.js", f"{reel}/out/live_tl.js", "live_music_sfx.wav"], check=True, capture_output=True)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", f"{reel}/out/voice/voice.wav", "-af", f"adelay={int(off * 1000)}:all=1",
                    f"{reel}/out/voice_off.wav"], check=True)
    subprocess.run(["bash", f"{ROOT}/youtube/02-bank-earns/mix.sh", video, f"{reel}/out/voice_off.wav", f"{reel}/out/live_music_sfx.wav",
                    f"{reel}/reel.mp4"], check=True)
    print(f"→ {reel}/reel.mp4")


if __name__ == "__main__":
    a = sys.argv[1:]; opt = lambda k: float(a[a.index(k) + 1]) if k in a else None
    render(os.path.abspath(a[0]), opt("--from"), opt("--to"), "--png" in a)
