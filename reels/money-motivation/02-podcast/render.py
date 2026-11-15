"""Формат «подкаст-цитата» (референс владельца DMnFlK_T1Hk): видео в квадрате со скруглёнными углами на чёрном,
2 статичных плана (средний → крупный), тёплый грейдинг, фразы по 2–4 слова с pop-in, акцентное слово курсивом с засечками,
голос-баритон, lo-fi под голосом и «дроп» на чёрном экране в конце."""
import json, subprocess, numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
W, H, FPS = 1080, 1920, 30
SQ, SX, SY, R = 960, 60, 470, 40                     # квадрат: размер, позиция, радиус углов
BOLD = "/usr/share/fonts/opentype/inter/InterDisplay-SemiBold.otf"
SERIF = "../fonts/CormorantGaramond-SemiBoldItalic.ttf"
VOICE = "voice/g25_Charon.wav"
# начала фраз (с), по паузам голоса; первая пара делится по числу гласных
STARTS = [0.26, 1.08, 3.22, 4.83, 6.95, 9.49, 11.19, 12.61]
PHRASES = json.load(open("phrases.json"))
VOICE_END, DUR = 14.7, 18.0
PLAN2 = 6.95                                          # склейка на крупный план — на фразе «Богатые…»

# ---------- слой текста (RGBA-видео) ----------
TX0, TX1, TY = SX + int(SQ * 0.47), SX + int(SQ * 0.965), SY + int(SQ * 0.06)
def fit(text, path, size, maxw):
    while size > 20:
        f = ImageFont.truetype(path, size)
        if f.getlength(text) <= maxw: return f
        size -= 2
    return ImageFont.truetype(path, size)
def phrase_layer(a, b):
    lay = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(lay)
    maxw = TX1 - TX0; y = TY
    if a:
        f = fit(a, BOLD, 66, maxw); d.text((TX0, y), a, font=f, fill=(255, 255, 255, 255)); y += int(f.size * 1.18)
    if b:
        f = fit(b, SERIF, 158, maxw); d.text((TX0 - 4, y - int(f.size * 0.12)), b, font=f, fill=(255, 255, 255, 255))
    sh = lay.split()[3].filter(ImageFilter.GaussianBlur(10)).point(lambda v: int(v * 0.75))
    shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0)); shadow.putalpha(sh)
    return Image.alpha_composite(shadow, lay)
layers = [phrase_layer(a, b) for a, b in PHRASES]
POP = 0.16
def ease(x): return 1 - (1 - x) ** 3
def frame(t):
    if t >= VOICE_END: return None
    k = max([i for i, s in enumerate(STARTS) if s - 0.04 <= t] or [-1])
    if k < 0: k = 0                                   # кадр 0 — уже с первой фразой (хук виден до запуска)
    p = 1.0 if (k == 0 and t < 0.3) else ease(min(1, max(0, (t - (STARTS[k] - 0.04)) / POP)))
    if p >= 1: return layers[k]
    sc = 0.9 + 0.1 * p
    L = layers[k]; cx, cy = TX0, TY + 60
    big = L.resize((int(W * sc), int(H * sc)), Image.BICUBIC)
    out = Image.new("RGBA", (W, H), (0, 0, 0, 0)); out.paste(big, (int(cx - cx * sc), int(cy - cy * sc)))
    a = out.split()[3].point(lambda v: int(v * p)); out.putalpha(a); return out
empty = Image.new("RGBA", (W, H), (0, 0, 0, 0)).tobytes()
ov = subprocess.Popen(["ffmpeg","-v","error","-y","-f","rawvideo","-pix_fmt","rgba","-s",f"{W}x{H}","-r",str(FPS),"-i","-","-c:v","qtrle","text.mov"], stdin=subprocess.PIPE)
for n in range(int(DUR * FPS)):
    im = frame(n / FPS); ov.stdin.write(empty if im is None else im.tobytes())
ov.stdin.close(); ov.wait()

# маска скруглённого квадрата
m = Image.new("L", (SQ, SQ), 0); ImageDraw.Draw(m).rounded_rectangle([0, 0, SQ - 1, SQ - 1], R, fill=255); m.save("mask.png")

# ---------- видео ----------
grade = "eq=contrast=1.07:saturation=1.05:gamma=0.97,colorbalance=rs=0.05:bs=-0.06:rm=0.06:bm=-0.05:rh=0.03:bh=-0.04,vignette=PI/5"
p1 = f"[0:v]fps={FPS},crop=860:860:100:420,scale={SQ}:{SQ},{grade},trim=duration={PLAN2},setpts=PTS-STARTPTS[a]"
p2 = f"[1:v]fps={FPS},crop=720:720:360:480,scale={SQ}:{SQ}:flags=lanczos,{grade},trim=duration={VOICE_END-PLAN2:.3f},setpts=PTS-STARTPTS[b]"
fc = ";".join([p1, p2,
    "[a][b]concat=n=2:v=1:a=0,format=rgba[sq]", "[2:v]format=gray[mk]", "[sq][mk]alphamerge[sqa]",
    f"color=black:s={W}x{H}:r={FPS}:d={DUR}[bg]", f"[bg][sqa]overlay={SX}:{SY}:eof_action=pass:repeatlast=0:enable='lt(t,{VOICE_END})'[v0]",
    "[v0][3:v]overlay=0:0:format=auto,format=yuv420p[v]",
    "[4:a]highpass=f=60,acompressor=threshold=-20dB:ratio=2.5:attack=10:release=150,loudnorm=I=-16:TP=-1.5,apad[vo]",
    "[5:a]volume=0.33[mu]", "[vo][mu]amix=inputs=2:duration=longest:normalize=0,atrim=duration=%.2f,loudnorm=I=-14:TP=-1.0[a]" % DUR])
subprocess.run(["ffmpeg","-v","error","-y","-ss","0","-t","8","-i","broll/pod3.mp4","-ss","7.5","-t","9","-i","broll/pod3.mp4",
    "-loop","1","-i","mask.png","-i","text.mov","-i",VOICE,"-i","lofi.wav","-filter_complex",fc,"-map","[v]","-map","[a]","-t",str(DUR),
    "-c:v","libx264","-preset","slow","-crf","21","-maxrate","10M","-bufsize","20M","-r",str(FPS),"-c:a","aac","-b:a","192k","-ar","48000",
    "-movflags","+faststart","reel.mp4"], check=True)
print("готово", DUR)
