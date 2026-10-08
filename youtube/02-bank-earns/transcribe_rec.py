#!/usr/bin/env python3
"""Запись владельца -> out/rec_edited_raw.wav (48 кГц, моно, без шумодава) + out/words.json (Whisper medium по кускам ~40 с,
границы — в самых тихих местах). Нужно, чтобы найти дубли, фальстарты и пропуски против script.md."""
import json, os, subprocess, sys
import numpy as np, soundfile as sf
DIR = os.path.dirname(os.path.abspath(__file__)); OUT = os.path.join(DIR, "out"); os.makedirs(OUT, exist_ok=True)
SR = 48000
src = os.path.join(DIR, "rec", "my_voice_02.m4a"); raw = os.path.join(OUT, "rec_edited_raw.wav")
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", src, "-af", "highpass=f=70", "-ac", "1", "-ar", str(SR), raw], check=True)
a, _ = sf.read(raw); dur = len(a) / SR
hop = int(.02 * SR); env = np.array([np.sqrt(np.mean(a[i:i + hop] ** 2) + 1e-12) for i in range(0, len(a) - hop, hop)])
cuts = [0.0]
while dur - cuts[-1] > 50:
    lo, hi = int((cuts[-1] + 32) / .02), int((cuts[-1] + 45) / .02)
    cuts.append(round((lo + int(np.argmin(env[lo:hi]))) * .02, 2))
cuts.append(dur)
sys.path.insert(0, "/home/user/123/reels/zero-card-07"); import voice as V
words = []
for x, y in zip(cuts, cuts[1:]):
    p16 = os.path.join(OUT, "_chunk16.wav")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{x:.2f}", "-to", f"{y:.2f}", "-i", raw, "-ar", "16000", "-ac", "1", p16], check=True)
    ws = V.transcribe(p16, "medium")
    words += [{"w": w["w"], "a": round(x + w["a"], 3), "d": round(w["d"], 3)} for w in ws]
    print(f"{x:7.1f}–{y:7.1f}: {' '.join(w['w'] for w in ws)[:110]}", flush=True)
json.dump({"duration": round(dur, 2), "words": words}, open(os.path.join(OUT, "words.json"), "w"), ensure_ascii=False, indent=0)
print("слов", len(words), "длительность", round(dur, 1))
