#!/usr/bin/env python3
"""Повторная проверка нарезки голоса (09.10, владелец: «слишком много моментов, где не вырезал лишнее»).
Распознаём ИСХОДНИК после вырезов (rec_v2.wav без POST_CUTS) короткими окнами 3–7 с по тихим точкам — так Whisper
не «проглатывает» повторы, как на длинных кусках. Потом выравниваем слова со сценарием (read.txt) и ищем:
повторы фраз рядом, оборванные слова, вставки, которых нет в сценарии, длинные паузы.
python recheck_cuts.py -> out/recheck_words.json, out/recheck.md"""
import json, os, re, sys, difflib
import numpy as np, soundfile as sf
sys.path.insert(0, "/home/user/123/reels/zero-card-07")
import voice as V
DIR = os.path.dirname(os.path.abspath(__file__)); OUT = os.path.join(DIR, "out")
import importlib.util
spec = importlib.util.spec_from_file_location("vv", os.path.join(DIR, "voice_v2.py")); vv = importlib.util.module_from_spec(spec); spec.loader.exec_module(vv)
a, sr = sf.read(os.path.join(OUT, "rec_v2.wav"))
if a.ndim > 1: a = a.mean(1)
dur = len(a) / sr
def rms(t0, t1):
    s = a[int(t0 * sr):int(t1 * sr)]; return 20 * np.log10(np.sqrt(np.mean(s ** 2)) + 1e-9)
# окна по тихим точкам: каждые ~5 с ищем самую тихую точку в ±1,5 с
cuts, t = [0.0], 0.0
while t + 6.5 < dur:
    c = t + 5.0
    best = min((rms(x / 100 - .05, x / 100 + .05), x / 100) for x in range(int((c - 1.5) * 100), int((c + 1.5) * 100), 2))
    cuts.append(best[1]); t = best[1]
cuts.append(dur)
words = []
tmp = os.path.join(OUT, "_win16.wav")
for x, y in zip(cuts, cuts[1:]):
    sf.write(os.path.join(OUT, "_win.wav"), a[int(x * sr):int(y * sr)], sr)
    os.system(f'ffmpeg -v error -y -i {os.path.join(OUT, "_win.wav")} -ar 16000 -ac 1 {tmp}')
    for w in V.transcribe(tmp, "medium"):
        words.append({"w": w["w"], "a": round(x + w["a"], 2), "d": round(w["d"], 2)})
    print(f"{x:6.1f}–{y:6.1f} {' '.join(w['w'] for w in words if x <= w['a'] < y)[:110]}", flush=True)
json.dump({"cuts": cuts, "words": words}, open(os.path.join(OUT, "recheck_words.json"), "w"), ensure_ascii=False, indent=0)
