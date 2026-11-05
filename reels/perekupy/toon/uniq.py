# python3 ../uniq.py ep14 — из готовой серии 6 разных роликов для разных аккаунтов (владелец 05.11: «один оригинал и 5 уникальных»).
# Отличия настоящие, а не «трюки»: другой порядок сцен и хук, другая длина, свой вопрос/титр на первом кадре, своя музыка (синтез audio.js
# в другом стиле), своя обложка и подпись. Голос и эффекты — те же дорожки серии (final/<ep>.voice.wav, .sfx.wav), лимит TTS не тратим.
# Сцены режем по границам смены сцен (после свайпа), карточки-титры — стоп-кадр с размытием. Выход: final/uniq/<ep>_v1..v6.mp4 + caption_vN.txt
import json, os, subprocess, sys

EP = sys.argv[1]
K = "../../kit"
FONT = "/home/user/123/perekup-bot/Inter-Bold.otf"
SPEC = json.load(open(f"uniq_{EP}.json"))
OUT = "final/uniq"; os.makedirs(OUT, exist_ok=True)
VID, VOICE, SFX = f"out_{EP}.mp4", f"final/perekupy_{EP}.voice.wav", f"final/perekupy_{EP}.sfx.wav"
SR = 48000


def esc(t):
    return t.replace("\\", "\\\\").replace(":", "\\:").replace("'", "’").replace("%", "\\%")


def text_filters(texts, w=1080):
    """[(текст, t0, t1, y, размер, цвет, плашка)] → drawtext; строки через \n, по центру, с жирной обводкой."""
    out = []
    for t, a, b, y, fs, color, box in texts:
        lines = t.split("\n")
        for k, ln in enumerate(lines):
            yy = y + k * int(fs * 1.18)
            boxp = f":box=1:boxcolor={box}:boxborderw=18" if box else ""
            out.append(f"drawtext=fontfile={FONT}:text='{esc(ln)}':enable='between(t,{a},{b})':fontsize={fs}:fontcolor={color}:borderw=8:bordercolor=black"
                       f"{boxp}:x=(w-text_w)/2:y={yy}")
    return out


def build(v):
    name, segs = v["id"], v["segments"]
    vparts, aparts, inputs, dur, n = [], [], ["-i", VID, "-i", VOICE, "-i", SFX], 0.0, 0
    for s in segs:
        if s.get("card"):                                   # карточка: стоп-кадр из серии, размыт и затемнён, текст поверх
            t, d = s["frame"], s["card"]
            vparts.append(f"[0:v]trim=start={t}:end={t + .04},setpts=PTS-STARTPTS,tpad=stop_mode=clone:stop_duration={d},trim=duration={d},"
                          f"boxblur=24:2,eq=brightness=-0.28:saturation=0.8,fps=30,format=yuv420p[v{n}]")
            aparts.append(f"anullsrc=r={SR}:cl=mono,atrim=duration={d}[vo{n}];anullsrc=r={SR}:cl=mono,atrim=duration={d}[sf{n}]")
        else:
            a, b = s["from"], s["to"]
            vparts.append(f"[0:v]trim=start={a}:end={b},setpts=PTS-STARTPTS,fps=30,format=yuv420p[v{n}]")
            aparts.append(f"[1:a]atrim=start={a}:end={b},asetpts=PTS-STARTPTS,aformat=sample_rates={SR}:channel_layouts=mono,afade=t=in:d=0.03,afade=t=out:st={b - a - .04:.3f}:d=0.04[vo{n}];"
                          f"[2:a]atrim=start={a}:end={b},asetpts=PTS-STARTPTS,aformat=sample_rates={SR}:channel_layouts=mono[sf{n}]")
            d = b - a
        dur += d; n += 1
    vf = ",".join(text_filters([tuple(x) for x in v.get("texts", [])]) + v.get("look", []))
    nv = sum(1 for s in segs); na = sum(1 for s in segs if not s.get("card"))
    pre = f"[0:v]split={nv}" + "".join(f"[i{k}]" for k in range(nv)) + ";"
    if na:
        pre += f"[1:a]asplit={na}" + "".join(f"[a{k}]" for k in range(na)) + f";[2:a]asplit={na}" + "".join(f"[b{k}]" for k in range(na)) + ";"
    iv = iter(range(nv)); ia = iter(range(na))
    vparts = [x.replace("[0:v]", f"[i{next(iv)}]", 1) for x in vparts]
    aparts = [(lambda k: x.replace("[1:a]", f"[a{k}]", 1).replace("[2:a]", f"[b{k}]", 1))(next(ia)) if "[1:a]" in x else x for x in aparts]
    fc = pre + ";".join(vparts) + ";" + "".join(f"[v{i}]" for i in range(n)) + f"concat=n={n}:v=1:a=0[vc];[vc]{vf or 'null'}[vout];" \
        + ";".join(aparts) + ";" + "".join(f"[vo{i}]" for i in range(n)) + f"concat=n={n}:v=0:a=1[voice];" + "".join(f"[sf{i}]" for i in range(n)) + f"concat=n={n}:v=0:a=1[sfx]"
    tmp = f"{OUT}/{name}"
    subprocess.run(["ffmpeg", "-v", "error", "-y", *inputs, "-filter_complex", fc, "-map", "[vout]", "-c:v", "libx264", "-preset", "medium", "-crf", "19",
                    "-pix_fmt", "yuv420p", "-an", f"{tmp}.video.mp4", "-map", "[voice]", f"{tmp}.voice.wav", "-map", "[sfx]", f"{tmp}.sfx.wav"], check=True)
    # своя музыка: тот же синтезатор, другой стиль и темп, ровно на длину варианта
    score = {"dur": round(dur, 2), "events": [], "music": dict({"start": 0}, **v["music"], end=round(dur - 1.2, 2)), "lead": 0}
    json.dump(score, open(f"{tmp}.score.json", "w"))
    subprocess.run(["node", f"{K}/audio.js", f"{tmp}.score.json", f"{tmp}.music.wav", f"{tmp}.nosfx.wav"], check=True, capture_output=True)
    vol = v.get("music_vol", .16)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", f"{tmp}.voice.wav", "-i", f"{tmp}.music.wav", "-i", f"{tmp}.sfx.wav", "-filter_complex",
                    "[0]asplit=2[v][k1];[1]equalizer=f=2500:t=q:w=1.3:g=-5,volume=" + str(vol) + "[m];[m][k1]sidechaincompress=threshold=0.02:ratio=9:attack=8:release=260[md];"
                    "[2]volume=0.75[s];[v]pan=stereo|c0=c0|c1=c0[vs];[s]pan=stereo|c0=c0|c1=c0[ss];[vs][md][ss]amix=inputs=3:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=11,aresample=48000",
                    "-ar", "48000", f"{tmp}.wav"], check=True)
    final = f"{OUT}/perekupy_{EP}_{name}.mp4"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", f"{tmp}.video.mp4", "-i", f"{tmp}.wav", "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-c:a", "aac",
                    "-b:a", "192k", "-shortest", "-movflags", "+faststart", final], check=True)
    for ext in (".video.mp4", ".voice.wav", ".sfx.wav", ".music.wav", ".nosfx.wav", ".wav", ".score.json"):
        os.remove(tmp + ext)
    open(f"{OUT}/caption_{name}.txt", "w").write(v["caption"].strip() + "\n")
    print(name, round(dur, 1), "с", final)


for v in SPEC["variants"]:
    if len(sys.argv) > 2 and v["id"] not in sys.argv[2:]:
        continue
    build(v)
