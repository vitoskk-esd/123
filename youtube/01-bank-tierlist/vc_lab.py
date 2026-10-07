"""Подбор настроек замены тембра на самых плохих кусках: что даёт самую разборчивую речь.

  python vc_lab.py 23,79,71,65,70,68

Варианты: base (как было: шумодав, 10 шагов), steps (20 шагов), temp (20 шагов, шум ×0.5),
raw (без шумодава, 10 шагов), raw_steps (без шумодава, 20 шагов, шум ×0.5).
Оценка — Whisper medium: похожесть на распознавание исходника куска (без VC).
"""
import json, os, subprocess, sys, time
sys.path.insert(0, "/home/user/123/reels/zero-card-07")
import voice as V
import torch, torchaudio

DIR = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(DIR, "out"); LAB = os.path.join(OUT, "vclab"); os.makedirs(LAB, exist_ok=True)
m = json.load(open(os.path.join(OUT, "vcp", "pieces.json")))
from chatterbox.vc import ChatterboxVC
vc = ChatterboxVC.from_pretrained("cpu")
vc.set_target_voice(V.VC_TARGET)
dec = vc.s3gen.flow.decoder
_fwd = dec.forward


def run(src, steps, temp, seed, out):
    def fwd(*a, **k):
        k["n_timesteps"] = steps; k["temperature"] = temp
        return _fwd(*a, **k)
    dec.forward = fwd
    torch.manual_seed(seed)
    torchaudio.save(out, vc.generate(audio=src), vc.sr)
    dec.forward = _fwd


def cut(srcfile, x, y, dst):
    xa, ya = max(0, x - .3), min(m["dur"], y + .3)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", srcfile, "-ss", str(xa), "-to", str(ya), "-ac", "1", "-ar", "24000", dst], check=True)
    return x - xa


def slow(src, k):
    d = src[:-4] + f".slow{k}.wav"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", src, "-af", f"atempo={k}", d], check=True); return d


def fast(f, k):
    d = f[:-4] + ".fast.wav"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", f, "-af", f"atempo={1 / k:.5f}", d], check=True); return d


def crop(f, off, ln):
    c = f[:-4] + ".crop.wav"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", f, "-ss", f"{off:.3f}", "-t", f"{ln:.3f}", "-ac", "1", "-ar", "48000", c], check=True)
    return c


VARS = {"raw": ("rec_edited_raw.wav", 10, 1.0, 1.0), "raw_slow85": ("rec_edited_raw.wav", 10, 1.0, .85), "raw_slow75": ("rec_edited_raw.wav", 10, 1.0, .75)}
res = {}
for i in map(int, sys.argv[1].split(",")):
    x, y = m["segs"][i]
    ref = os.path.join(LAB, f"ref_{i}.wav"); subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", os.path.join(OUT, "rec_edited_raw.wav"), "-ss", str(x), "-to", str(y), "-ac", "1", "-ar", "16000", ref], check=True)
    want = " ".join(w["w"] for w in V.transcribe(ref, "medium"))
    res[i] = {"want": want}
    for name, (sf, steps, temp, k) in VARS.items():
        src = os.path.join(LAB, f"src_{i}_{sf[:-4]}.wav"); off = cut(os.path.join(OUT, sf), x, y, src)
        t0 = time.time(); out = os.path.join(LAB, f"{i}_{name}.wav")
        if k != 1.0:
            run(slow(src, k), steps, temp, 0, out); out = fast(out, k)
        else: run(src, steps, temp, 0, out)
        c = crop(out, off, y - x)
        got = V.transcribe(c, "medium")
        sim = V.similarity(want, got)
        res[i][name] = {"sim": round(sim, 3), "got": " ".join(w["w"] for w in got), "sec": round(time.time() - t0, 1)}
        print(f"{i:3d} {name:9s} {sim:.2f} {time.time() - t0:5.1f}s | {res[i][name]['got'][:80]}", flush=True)
    print(f"    want: {want}", flush=True)
json.dump(res, open(os.path.join(LAB, "lab2.json"), "w"), ensure_ascii=False, indent=1)
import statistics
for name in VARS: print(name, "средняя", round(statistics.mean(res[i][name]["sim"] for i in res), 3))
