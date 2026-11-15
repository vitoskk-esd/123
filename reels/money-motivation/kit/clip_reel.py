"""Рилс по референсу владельца (DMnFlK_T1Hk) из куска чужого интервью/выступления:
квадрат со скруглёнными углами на чёрном, 2 плана (общий → наезд на лицо), тёплый грейдинг, фразы 2–4 слова с pop-in
(акцентное слово — крупный курсив с засечками), живой голос спикера + тихий lo-fi, в конце чёрный экран с «дропом» бита.

  python3 kit/clip_reel.py папка_ролика/config.json      → папка_ролика/reel.mp4

config.json:
  src            — исходный клип (mp4)
  start, end     — какой кусок брать (с, во времени исходника)
  crop1, crop2   — [x, y, size] квадратов в пикселях исходника: общий план и крупный
  plan2_at       — когда (с от start) переключиться на крупный план
  phrases        — [[строка, акцент, начало_с_от_start], ...]
  text_box       — [x0, x1, y] доли квадрата: где стоит текст (по умолчанию справа сверху)
  signature      — подпись под квадратом (ник аккаунта), можно ""
  source_credit  — мелкая подпись источника в квадрате, можно ""
  tail           — сколько секунд чёрного экрана с битом в конце (по умолчанию 3)
"""
import json, os, subprocess, sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter
cfg_path = sys.argv[1]; D = os.path.dirname(os.path.abspath(cfg_path)); K = os.path.dirname(os.path.abspath(__file__))
C = json.load(open(cfg_path))
W, H, FPS = 1080, 1920, 30
SQ, SX, SY, R = 960, 60, 470, 40
BOLD = "/usr/share/fonts/opentype/inter/InterDisplay-SemiBold.otf"
SERIF = os.path.join(K, "..", "fonts", "CormorantGaramond-SemiBoldItalic.ttf")
SPEECH = C["end"] - C["start"]; TAIL = C.get("tail", 3.0); DUR = round(SPEECH + TAIL, 2)
PH = C["phrases"]; STARTS = [p[2] for p in PH]
bx = C.get("text_box", [0.47, 0.965, 0.06])
TX0, TX1, TY = SX + int(SQ * bx[0]), SX + int(SQ * bx[1]), SY + int(SQ * bx[2])

def fit(text, path, size, maxw):
    while size > 20:
        f = ImageFont.truetype(path, size)
        if f.getlength(text) <= maxw: return f
        size -= 2
    return ImageFont.truetype(path, size)
def phrase_layer(a, b):
    lay = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(lay); maxw = TX1 - TX0; y = TY
    if a:
        f = fit(a, BOLD, 66, maxw); d.text((TX0, y), a, font=f, fill=(255, 255, 255, 255)); y += int(f.size * 1.18)
    if b:
        f = fit(b, SERIF, 158, maxw); d.text((TX0 - 4, y - int(f.size * 0.12)), b, font=f, fill=(255, 255, 255, 255))
    sh = lay.split()[3].filter(ImageFilter.GaussianBlur(10)).point(lambda v: int(v * 0.8))
    shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0)); shadow.putalpha(sh)
    return Image.alpha_composite(shadow, lay)
static = Image.new("RGBA", (W, H), (0, 0, 0, 0)); ds = ImageDraw.Draw(static)
if C.get("signature"):
    f = ImageFont.truetype(SERIF, 54); s = C["signature"]; ds.text(((W - f.getlength(s)) / 2, SY + SQ + 30), s, font=f, fill=(255, 255, 255, 230))
if C.get("source_credit"):
    f = ImageFont.truetype(BOLD, 26); s = C["source_credit"]; ds.text((SX + 28, SY + SQ - 56), s, font=f, fill=(255, 255, 255, 150))
layers = [Image.alpha_composite(static, phrase_layer(a, b)) for a, b, _ in PH]
POP = 0.16
def ease(x): return 1 - (1 - x) ** 3
def frame(t):
    if t >= SPEECH: return None
    k = max([i for i, s in enumerate(STARTS) if s - 0.04 <= t] or [0])
    p = 1.0 if (k == 0 and t < STARTS[0] + 0.3) else ease(min(1, max(0, (t - (STARTS[k] - 0.04)) / POP)))
    if p >= 1: return layers[k]
    sc = 0.9 + 0.1 * p; L = phrase_layer(PH[k][0], PH[k][1]); cx, cy = TX0, TY + 60
    big = L.resize((int(W * sc), int(H * sc)), Image.BICUBIC)
    out = Image.new("RGBA", (W, H), (0, 0, 0, 0)); out.paste(big, (int(cx - cx * sc), int(cy - cy * sc)))
    out.putalpha(out.split()[3].point(lambda v: int(v * p))); return Image.alpha_composite(static, out)
empty = Image.new("RGBA", (W, H), (0, 0, 0, 0)).tobytes()
ov = subprocess.Popen(["ffmpeg","-v","error","-y","-f","rawvideo","-pix_fmt","rgba","-s",f"{W}x{H}","-r",str(FPS),"-i","-","-c:v","qtrle",f"{D}/text.mov"], stdin=subprocess.PIPE)
for n in range(int(DUR * FPS)):
    im = frame(n / FPS); ov.stdin.write(empty if im is None else im.tobytes())
ov.stdin.close(); ov.wait()
m = Image.new("L", (SQ, SQ), 0); ImageDraw.Draw(m).rounded_rectangle([0, 0, SQ - 1, SQ - 1], R, fill=255); m.save(f"{D}/mask.png")
subprocess.run(["python3", os.path.join(K, "lofi.py"), str(SPEECH), str(DUR)], cwd=D, check=True, capture_output=True)

grade = "eq=contrast=1.06:saturation=1.04:gamma=0.98,colorbalance=rs=0.04:bs=-0.05:rm=0.05:bm=-0.04:rh=0.02:bh=-0.03,vignette=PI/5"
P2 = C.get("plan2_at", SPEECH)
c1, c2 = C["crop1"], C.get("crop2", C["crop1"])
p1 = f"[0:v]fps={FPS},crop={c1[2]}:{c1[2]}:{c1[0]}:{c1[1]},scale={SQ}:{SQ}:flags=lanczos,{grade},trim=duration={P2:.3f},setpts=PTS-STARTPTS[a]"
parts = [p1]; cat = "[a]"
if P2 < SPEECH:
    parts.append(f"[1:v]fps={FPS},crop={c2[2]}:{c2[2]}:{c2[0]}:{c2[1]},scale={SQ}:{SQ}:flags=lanczos,{grade},trim=start={P2:.3f}:duration={SPEECH-P2:.3f},setpts=PTS-STARTPTS[b]")
    cat = "[a][b]concat=n=2:v=1:a=0"
else:
    cat = "[a]null"
fc = ";".join(parts + [f"{cat},format=rgba[sq]", "[2:v]format=gray[mk]", "[sq][mk]alphamerge[sqa]",
    f"color=black:s={W}x{H}:r={FPS}:d={DUR}[bg]", f"[bg][sqa]overlay={SX}:{SY}:eof_action=pass:repeatlast=0:enable='lt(t,{SPEECH})'[v0]",
    "[v0][3:v]overlay=0:0:format=auto,format=yuv420p[v]",
    f"[0:a]atrim=duration={SPEECH:.3f},asetpts=PTS-STARTPTS,highpass=f=70,acompressor=threshold=-20dB:ratio=2.5:attack=10:release=150,"
    f"afade=t=out:st={SPEECH-0.12:.3f}:d=0.12,loudnorm=I=-15:TP=-1.5,apad[vo]",
    "[4:a]volume=0.30[mu]", f"[vo][mu]amix=inputs=2:duration=longest:normalize=0,atrim=duration={DUR},loudnorm=I=-14:TP=-1.0[a]"])
src = os.path.join(D, C["src"])
subprocess.run(["ffmpeg","-v","error","-y","-ss",str(C["start"]),"-t",str(SPEECH+0.5),"-i",src,"-ss",str(C["start"]),"-t",str(SPEECH+0.5),"-i",src,
    "-loop","1","-i",f"{D}/mask.png","-i",f"{D}/text.mov","-i",f"{D}/lofi.wav","-filter_complex",fc,"-map","[v]","-map","[a]","-t",str(DUR),
    "-c:v","libx264","-preset","slow","-crf","21","-maxrate","10M","-bufsize","20M","-r",str(FPS),"-c:a","aac","-b:a","192k","-ar","48000",
    "-movflags","+faststart",f"{D}/reel.mp4"], check=True)
print("готово:", f"{D}/reel.mp4", DUR, "с")
