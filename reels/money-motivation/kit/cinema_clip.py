"""Формат референсов владельца 15.11 (Гоггинс/JRE, «В погоне за счастьем», «Бронксская повесть», Тайсон):
сильный момент из интервью/фильма почти без монтажа — оригинальный голос, тихая эмоциональная музыка под речью,
небольшие белые субтитры короткими фразами (1–3 слова) по центру, медленный наезд, киношный цвет или ч/б с полосами,
затемнение в конце.
  python3 kit/cinema_clip.py папка/config.json   → папка/reel.mp4
config: src, start, end, words (tsv «время<TAB>слово», время от начала src), style: "color" | "bw",
        sub_font: "sans" | "serif", focus_y (доля кадра — где лицо, для кропа/полос), credit (подпись источника) """
import json, os, re, subprocess, sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter
C = json.load(open(sys.argv[1])); D = os.path.dirname(os.path.abspath(sys.argv[1])); K = os.path.dirname(os.path.abspath(__file__))
W, H, FPS = 1080, 1920, 30
A, B = C["start"], C["end"]; SPEECH = B - A; TAIL = 1.4; DUR = round(SPEECH + TAIL, 2)
BW = C.get("style") == "bw"
FONT = {"sans": "/usr/share/fonts/opentype/inter/InterDisplay-MediumItalic.otf" if C.get("italic") else "/usr/share/fonts/opentype/inter/InterDisplay-Medium.otf",
        "serif": os.path.join(K, "..", "fonts", "CormorantGaramond-SemiBoldItalic.ttf")}[C.get("sub_font", "sans")]
SIZE = 54 if C.get("sub_font", "sans") == "sans" else 62

# слова → фразы по 1–3 слова (рвём на знаках препинания)
words = []
for line in open(os.path.join(D, C["words"]), encoding="utf-8"):
    p = line.strip().split("\t")
    if len(p) == 2 and A - 0.05 <= float(p[0]) < B: words.append((float(p[0]) - A, p[1]))
for i, (s, w) in enumerate(C.get("fix", {}).items()): pass
fix = {int(k): v for k, v in C.get("fix", {}).items()}
words = [(t, fix.get(i, w)) for i, (t, w) in enumerate(words) if fix.get(i, w) != ""]
chunks, cur = [], []
for i, (t, w) in enumerate(words):
    cur.append((t, w))
    nxt = words[i + 1][0] if i + 1 < len(words) else SPEECH
    if re.search(r"[.,:;!?…—]$", w) or len(cur) >= 3 or nxt - t > 1.1:
        chunks.append(cur); cur = []
if cur: chunks.append(cur)
merged = []                                            # слишком короткая фраза (< 0.4 с) — склеиваем со следующей
for k, ch in enumerate(chunks):
    nxt = chunks[k + 1][0][0] if k + 1 < len(chunks) else SPEECH
    if merged and merged[-1][1]: merged[-1] = (merged[-1][0] + ch, nxt - ch[0][0] < 0.4); continue
    merged.append((ch, nxt - ch[0][0] < 0.4))
chunks = [c for c, _ in merged]
subs = []
for k, ch in enumerate(chunks):
    s = ch[0][0] - 0.04; e = (chunks[k + 1][0][0] - 0.04) if k + 1 < len(chunks) else SPEECH - 0.05
    e = min(e, ch[-1][0] + 1.6)
    subs.append((s, e, re.sub(r"-\s+-?", "", " ".join(w for _, w in ch))))
json.dump(subs, open(os.path.join(D, "subs.json"), "w"), ensure_ascii=False, indent=0)

# слой субтитров
font = ImageFont.truetype(FONT, SIZE)
SUB_Y = int(H * C.get("sub_y", 0.60))
ov = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgba", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-", "-c:v", "qtrle", f"{D}/subs.mov"], stdin=subprocess.PIPE)
empty = Image.new("RGBA", (W, H), (0, 0, 0, 0)); cache = {}
def layer(txt, a):
    key = (txt, round(a, 2))
    if key in cache: return cache[key]
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    d.text((W / 2, SUB_Y), txt, font=font, fill=(255, 255, 255, 255), anchor="mm")
    sh = im.split()[3].filter(ImageFilter.GaussianBlur(6)).point(lambda v: int(v * 0.85))
    s = Image.new("RGBA", (W, H), (0, 0, 0, 0)); s.putalpha(sh); im = Image.alpha_composite(s, im)
    if a < 1: im.putalpha(im.split()[3].point(lambda v: int(v * a)))
    cache.clear() if len(cache) > 40 else None; cache[key] = im; return im
for n in range(int(DUR * FPS)):
    t = n / FPS; im = empty
    for s, e, txt in subs:
        if s <= t < e:
            a = min(1, (t - s) / 0.08, (e - t) / 0.08); im = layer(txt, a); break
    ov.stdin.write(im.tobytes())
ov.stdin.close(); ov.wait()

MUSIC = C.get("music")                                 # готовый трек (путь от папки ролика) или своя фортепианная подложка
if MUSIC:
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(C.get("music_start", 0)), "-i", os.path.join(D, MUSIC), "-t", str(DUR + 0.5),
                    "-af", "afade=t=in:d=0.4", "-ar", "48000", "-ac", "2", f"{D}/music.wav"], check=True)
else:
    subprocess.run(["python3", os.path.join(K, "piano.py"), str(DUR + 0.5), f"{D}/music.wav"], check=True)
src = os.path.join(D, C["src"]); fy = C.get("focus_y", 0.45)
# видео: вертикальный кадр с медленным наездом; bw — ч/б, полосы сверху/снизу (видимая часть 1080×1150)
zoom = f"scale=w='{W}*(1.0+0.07*t/{SPEECH:.2f})':h=-2:eval=frame,crop={W}:{H}"
if BW:
    vis = 1150; top = int(H * 0.47 - vis / 2)
    v = (f"[0:v]fps={FPS},scale={W}:-2,{zoom},crop={W}:{vis}:0:'min(max(0,{H}*{fy}-{vis}/2),{H}-{vis})',"
         f"hue=s=0,eq=contrast=1.25:brightness=-0.03:gamma=0.92,vignette=PI/4,noise=alls=5:allf=t,"
         f"pad={W}:{H}:0:{top}:black")
else:
    v = (f"[0:v]fps={FPS},scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H},{zoom},"
         "eq=contrast=1.08:saturation=0.92:gamma=0.97,colorbalance=rs=0.02:bs=0.03:rh=0.03:bh=-0.02,vignette=PI/5")
# звук отдельными шагами (loudnorm + apad в одном графе зависали)
src_a = ["-ss", str(A), "-t", str(SPEECH + 0.3), "-i", src]
subprocess.run(["ffmpeg", "-v", "error", "-y", *src_a, "-af", f"atrim=duration={SPEECH:.3f},highpass=f=70,acompressor=threshold=-20dB:ratio=2.5,"
                f"afade=t=out:st={SPEECH-0.15:.3f}:d=0.15,loudnorm=I=-14:TP=-1.5,aresample=48000", "-ac", "2", f"{D}/voice.wav"], check=True)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", f"{D}/music.wav", "-af", f"atrim=duration={DUR},loudnorm=I={C.get('music_lufs', -24)}:TP=-6,aresample=48000,"
                f"afade=t=out:st={DUR-1.2:.2f}:d=1.2", "-ac", "2", f"{D}/music_n.wav"], check=True)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", f"{D}/voice.wav", "-i", f"{D}/music_n.wav", "-filter_complex",
                "[0:a][1:a]amix=inputs=2:duration=longest:normalize=0,alimiter=limit=0.89[a]", "-map", "[a]", f"{D}/mix.wav"], check=True)
fc = (f"{v},trim=duration={SPEECH:.3f},setpts=PTS-STARTPTS,tpad=stop_mode=add:stop_duration={TAIL}:color=black,"
      f"fade=t=out:st={SPEECH - 0.7:.3f}:d=0.7,format=yuv420p[vb];[vb][1:v]overlay=0:0:format=auto,format=yuv420p[v]")
subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(A), "-t", str(SPEECH + 0.3), "-i", src, "-i", f"{D}/subs.mov", "-i", f"{D}/mix.wav",
                "-filter_complex", fc, "-map", "[v]", "-map", "2:a", "-t", str(DUR), "-c:v", "libx264", "-preset", "slow", "-crf", "19",
                "-maxrate", "12M", "-bufsize", "24M", "-r", str(FPS), "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-movflags", "+faststart",
                f"{D}/reel.mp4"], check=True)
print("готово", f"{D}/reel.mp4", DUR, "с;", len(subs), "фраз")
