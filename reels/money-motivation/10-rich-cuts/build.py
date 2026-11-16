"""Рилс по референсу владельца DcZMK72TUZr: быстрая нарезка «богатой жизни» (машины, деньги, яхты, салюты, город ночью),
склейка на каждую долю спокойного бита 108 BPM, единая ночная цветокоррекция, лёгкий наезд в каждом плане, зерно;
сверху — спокойный русский голос с мотивирующей цитатой и небольшие субтитры. Сток — Pexels (бесплатно, см. CREDITS.md).
  python3 build.py → reel.mp4"""
import os, subprocess, json
from PIL import Image, ImageDraw, ImageFont, ImageFilter
W, H, FPS, BPM = 1080, 1920, 30, 108
B = 60 / BPM; NB = 32; DUR = NB * B; VO_AT = 2 * B
SHOTS = [("amg", 2, .5), ("car_man", 15, .5), ("cash1", 2.5, .5), ("fw2", 7, .55), ("lambo", 2.0, .8), ("dock", 3, .5), ("aventador", 2, .45), ("towers", 2, .5),
         ("watch", 7, .5), ("cashcase", 3.5, .5), ("yachtparty", 3.5, .45), ("lambo", 5, .8), ("pool2", 2, .5), ("night_drive", 10, .5), ("cash2", 4, .5), ("fw3", 38, .6),
         ("briefcase", 5, .5), ("aventador", 6, .55), ("fw4", 14, .7), ("car_man", 22, .5), ("cash3", 4, .5), ("dock", 9, .5), ("amg", 6, .5), ("towers", 6, .5),
         ("lambo", 7.5, .75), ("watch", 15, .5), ("night_drive", 25, .5), ("cashcase", 6.5, .5), ("fw3", 44, .55), ("yachtparty", 6.5, .5), ("fw2", 9, .55), ("fw3", 50, .5)]
assert len(SHOTS) == NB
GRADE = ("eq=contrast=1.1:saturation=0.95:brightness=-0.04:gamma=0.95,colorbalance=rs=0.02:bs=0.05:rm=0.02:bm=0.02:rh=0.04:bh=-0.03,"
         "vignette=PI/5,noise=alls=5:allf=t")
os.makedirs("seg", exist_ok=True)
frames = [round((k + 1) * B * FPS) - round(k * B * FPS) for k in range(NB)]
lst = []
for k, (clip, ss, fx) in enumerate(SHOTS):
    n = frames[k]; d = n / FPS; out = f"seg/s{k:02d}.mp4"
    vf = (f"fps={FPS},scale={W}:{H}:force_original_aspect_ratio=increase:flags=lanczos,crop={W}:{H}:(iw-{W})*{fx}:(ih-{H})/2,"
          f"scale=w='{W}*(1.0+0.07*t/{d:.3f})':h=-2:eval=frame:flags=bicubic,crop={W}:{H},{GRADE},format=yuv420p")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(ss), "-i", f"broll/{clip}.mp4", "-vf", vf, "-frames:v", str(n), "-an",
                    "-c:v", "libx264", "-preset", "fast", "-crf", "16", "-r", str(FPS), out], check=True)
    lst.append(f"file '{out}'")
open("seg/list.txt", "w").write("\n".join(l.replace("seg/", "") for l in lst) + "\n")
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", "seg/list.txt", "-c", "copy", "cuts.mp4"], check=True)

# субтитры: небольшие, курсив с засечками, по фразам голоса (время — от начала голоса)
SUBS = [(0.0, 2.6, "Однажды всё это станет"), (2.6, 4.6, "твоей обычной жизнью."), (4.98, 6.6, "Не потому что повезло —"),
        (7.17, 8.95, "а потому что ты продолжал,"), (9.24, 11.2, "когда никто не верил."), (11.68, 13.2, "Работай тихо."), (13.45, 15.5, "Пусть говорит результат.")]
font = ImageFont.truetype("../fonts/CormorantGaramond-SemiBoldItalic.ttf", 66)
def layer(txt, a):
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    d.text((W / 2, int(H * .74)), txt, font=font, fill=(255, 255, 255, 255), anchor="mm")
    sh = im.split()[3].filter(ImageFilter.GaussianBlur(8)).point(lambda v: int(v * .9)); s = Image.new("RGBA", (W, H), (0, 0, 0, 0)); s.putalpha(sh)
    im = Image.alpha_composite(s, im)
    if a < 1: im.putalpha(im.split()[3].point(lambda v: int(v * a)))
    return im
empty = Image.new("RGBA", (W, H), (0, 0, 0, 0)).tobytes(); cache = {}
p = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgba", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-", "-c:v", "qtrle", "subs.mov"], stdin=subprocess.PIPE)
NF = sum(frames)
for f in range(NF):
    t = f / FPS - VO_AT; fr = empty
    for s0, s1, txt in SUBS:
        if s0 <= t < s1:
            a = round(min(1, (t - s0) / .15, (s1 - t) / .15), 2); key = (txt, a)
            if key not in cache: cache.clear(); cache[key] = layer(txt, a).tobytes()
            fr = cache[key]; break
    p.stdin.write(fr)
p.stdin.close(); p.wait()

# звук: музыка + голос с 2-й доли; в конце — затемнение
subprocess.run(["python3", "../kit/music_calm.py", str(DUR + .3), "music.wav", str(BPM)], check=True, capture_output=True)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", "voice/q.wav", "-af", f"highpass=f=70,acompressor=threshold=-20dB:ratio=2.5,loudnorm=I=-14:TP=-1.5,aresample=48000,adelay={int(VO_AT * 1000)}|{int(VO_AT * 1000)}",
                "-ac", "2", "voice_d.wav"], check=True)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", "music.wav", "-af", f"atrim=duration={DUR:.3f},loudnorm=I=-26:TP=-6,aresample=48000,afade=t=out:st={DUR - 1.2:.2f}:d=1.2", "-ac", "2", "music_n.wav"], check=True)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", "voice_d.wav", "-i", "music_n.wav", "-filter_complex", "[0][1]amix=inputs=2:duration=longest:normalize=0,alimiter=limit=0.89[a]", "-map", "[a]", "mix.wav"], check=True)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", "cuts.mp4", "-i", "subs.mov", "-i", "mix.wav", "-filter_complex",
                f"[0:v][1:v]overlay=0:0:format=auto,fade=t=out:st={DUR - .6:.2f}:d=0.6,format=yuv420p[v]", "-map", "[v]", "-map", "2:a", "-t", f"{DUR:.3f}",
                "-c:v", "libx264", "-preset", "slow", "-crf", "19", "-maxrate", "14M", "-bufsize", "28M", "-r", str(FPS), "-c:a", "aac", "-b:a", "192k", "-ar", "48000",
                "-movflags", "+faststart", "reel.mp4"], check=True)
print("готово reel.mp4", round(DUR, 2), "с,", NB, "планов")
