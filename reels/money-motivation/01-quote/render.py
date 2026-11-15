"""Тёмная цитата: стоковый фон (затемнён, почти ч/б, медленный наезд, зерно) + весь текст на экране с подсветкой
текущей строки под голос + голос и свой эмбиент. Выход: reel.mp4 (1080×1920, 30 к/с)."""
import json, subprocess
import numpy as np
from PIL import Image, ImageDraw, ImageFont
W, H, FPS = 1080, 1920, 30
FONT = "/usr/share/fonts/opentype/inter/InterDisplay-Medium.otf"
seg = json.load(open("segments.json"))["segments"]
DUR = round(float(subprocess.run(["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0","voice.wav"],capture_output=True,text=True).stdout), 2)

# строки экрана и какие куски речи их подсвечивают
SCREEN = [("Тебе не нужны", [0]), ("богатые родители.", [0]), ("Не нужны связи.", [1]), ("Не нужна удача.", [2]),
          ("Нужно делать скучное.", [3]), ("Каждый день. Годами.", [4, 5]), ("Поэтому богатых так мало.", [6]),
          (None, []), ("А ты сейчас пролистаешь.", [7])]
CTA = "сохрани, если досмотрел"
SIZE, LEAD, DIM, FADE = 72, 98, 0.36, 0.18
ACCENT = (255, 70, 70)

def active_until(i):            # строка горит от начала своего куска до начала следующего куска речи
    s = seg[i][0] - 0.06
    e = seg[i+1][0] - 0.06 if i + 1 < len(seg) else DUR + 1
    return s, e

def level(t, chunks):
    if not chunks: return 0
    s, _ = active_until(chunks[0]); _, e = active_until(chunks[-1])
    if chunks[0] == 0: s = -1                                  # кадр 0 уже с подсветкой первой строки
    up = np.clip((t - s) / FADE, 0, 1); down = np.clip((e - t) / FADE, 0, 1)
    return float(min(up, down))

font = ImageFont.truetype(FONT, SIZE); small = ImageFont.truetype(FONT, 40)
y0 = 1060 - (len(SCREEN) * LEAD) // 2          # центр блока ниже середины: лицо в первом плане — в верхней трети
# виньетка-подложка под текст (статичная)
yy, xx = np.mgrid[0:H, 0:W]
shade = np.clip(0.62 - 0.5 * (((xx - W/2) / (W*0.62))**2 + ((yy - (y0 + len(SCREEN)*LEAD/2)) / (H*0.42))**2), 0, 0.5)
base = np.zeros((H, W, 4), np.uint8); base[..., 3] = (shade * 255).astype(np.uint8)
base_img = Image.fromarray(base, "RGBA")

def frame(t):
    im = base_img.copy(); d = ImageDraw.Draw(im)
    for k, (txt, chunks) in enumerate(SCREEN):
        if not txt: continue
        a = DIM + (1 - DIM) * level(t, chunks)
        col = ACCENT if (k == len(SCREEN) - 1 and level(t, chunks) > 0.5) else (255, 255, 255)
        w = d.textlength(txt, font=font)
        y = y0 + k * LEAD
        d.text(((W - w) / 2 + 2, y + 3), txt, font=font, fill=(0, 0, 0, int(140 * a)))     # мягкая тень
        d.text(((W - w) / 2, y), txt, font=font, fill=col + (int(255 * a),))
    w = d.textlength(CTA, font=small)
    d.text(((W - w) / 2, y0 + len(SCREEN) * LEAD + 40), CTA, font=small, fill=(255, 255, 255, 150))
    return im

# проверка ширины строк
for txt, _ in SCREEN:
    if txt: assert ImageDraw.Draw(base_img).textlength(txt, font=font) < W - 110, txt

ov = subprocess.Popen(["ffmpeg","-v","error","-y","-f","rawvideo","-pix_fmt","rgba","-s",f"{W}x{H}","-r",str(FPS),"-i","-",
                       "-c:v","qtrle","overlay.mov"], stdin=subprocess.PIPE)
cache = {}
for n in range(int(DUR * FPS)):
    t = n / FPS
    key = tuple(round(level(t, c), 3) for _, c in SCREEN)
    if key not in cache: cache = {key: frame(t).tobytes()}
    ov.stdin.write(cache[key])
ov.stdin.close(); ov.wait()

# фон: (клип, смещение в клипе) на каждый отрезок; склейки на начале строк, финал = первый план → бесшовная петля
cuts = [0, active_until(1)[0], active_until(3)[0], active_until(4)[0], active_until(6)[0], active_until(7)[0], DUR]
clips = [("car_man", 15.0), ("watch", 2.0), ("briefcase", 1.0), ("amg", 1.0), ("towers", 0.5), ("car_man", 15.0)]
inp, fc = [], []
for i, ((name, off), a, b) in enumerate(zip(clips, cuts, cuts[1:])):
    d = b - a
    inp += ["-ss", f"{off}", "-t", f"{d + 0.1:.3f}", "-i", f"broll/{name}.mp4"]
    fc.append(f"[{i}:v]fps={FPS},scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H},"
              f"scale=w='{W}*(1.0+0.05*t/{d:.3f})':h=-2:eval=frame,crop={W}:{H},setsar=1,trim=duration={d:.3f},setpts=PTS-STARTPTS[v{i}]")
n = len(clips)
fc.append("".join(f"[v{i}]" for i in range(n)) + f"concat=n={n}:v=1:a=0,"
          "eq=saturation=0.5:contrast=1.08:brightness=-0.02:gamma=0.95,colorbalance=bs=0.05:bm=0.02,"
          "vignette=PI/5,noise=alls=4:allf=t,format=yuv420p[bg]")
fc.append(f"[bg][{n}:v]overlay=0:0:format=auto,format=yuv420p[v]")
fc.append(f"[{n+2}:a]volume=1.0[m];[{n+1}:a][m]amix=inputs=2:duration=first:normalize=0,loudnorm=I=-14:TP=-1.0[a]")
cmd = ["ffmpeg","-v","error","-y", *inp, "-i","overlay.mov","-i","voice.wav","-i","music.wav",
       "-filter_complex", ";".join(fc), "-map","[v]","-map","[a]","-t",f"{DUR}",
       "-c:v","libx264","-preset","slow","-crf","23","-maxrate","12M","-bufsize","24M","-profile:v","high","-r",str(FPS),"-c:a","aac","-b:a","192k","-ar","48000",
       "-movflags","+faststart","reel.mp4"]
subprocess.run(cmd, check=True)
# версия без музыки — чтобы в Instagram поставить трендовый трек самому
subprocess.run(["ffmpeg","-v","error","-y","-i","reel.mp4","-i","voice.wav","-map","0:v","-map","1:a","-c:v","copy",
                "-af","loudnorm=I=-14:TP=-1.0","-c:a","aac","-b:a","192k","-t",f"{DUR}","reel_voice_only.mp4"], check=True)
print("готово", DUR, "с, кусков:", len(seg), "склейки:", [round(c, 2) for c in cuts])
