#!/usr/bin/env python3
"""Проба 2: ударения (RUAccent + ручные) и три варианта «живости». A — по умолчанию, B — живее (exaggeration .65,
cfg .35, temperature .9), C — B + «живая запись» (паузы, вдохи, микрофон, комната)."""
import os, sys, json
sys.path.insert(0, "/home/user/123/tools"); sys.path.insert(0, "/home/user/123/reels/zero-card-07")
import tts_v5 as T, voice as V
D = os.path.dirname(os.path.abspath(__file__)); O = os.path.join(D, "out2"); os.makedirs(O, exist_ok=True)
PHR = ["Если бы мне снова было восемнадцать и на карте было ноль рублей, я бы начал с этих трёх шагов.",
       "И банки платили бы мне, а не наоборот.",
       "Шаг первый: дебетовая карта с бонусом за первые покупки. Кредитного риска нет вообще, а банк платит просто за то, что ты пришёл."]
CFG = {"A": dict(exaggeration=.5, cfg_weight=.5, temperature=.8), "B": dict(exaggeration=.65, cfg_weight=.35, temperature=.9)}
for name, cfg in CFG.items():
    parts = []
    for i, p in enumerate(PHR):
        f = T.synth(p, os.path.join(O, f"{name}{i}.wav"), seed=1, **cfg)
        f16 = f[:-4] + ".16.wav"; os.system(f"ffmpeg -v error -y -i {f} -ar 16000 -ac 1 {f16}")
        got = V.transcribe(f16, "medium"); print(f"{name}{i}: {V.similarity(p, got):.2f} — {' '.join(w['w'] for w in got)}", flush=True)
        parts.append(f)
    if name == "A" or name == "B":
        lst = os.path.join(O, f"{name}.txt"); open(lst, "w").write("".join(f"file '{x}'\n" for x in parts))
        os.system(f"ffmpeg -v error -y -f concat -safe 0 -i {lst} -af apad=pad_dur=0 -c:a aac -b:a 128k {os.path.join(D, f'proba2_{name}.m4a')}")
    if name == "B":
        T.humanize(parts, os.path.join(O, "C.wav"))
        os.system(f"ffmpeg -v error -y -i {os.path.join(O, 'C.wav')} -c:a aac -b:a 128k {os.path.join(D, 'proba2_C.m4a')}")
print("готово", flush=True)
