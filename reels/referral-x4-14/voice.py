#!/usr/bin/env python3
"""Голос рилса #14 «За друга с кредиткой — до 4 раз больше» — живой голос Yandex SpeechKit LiveTTS «vasily», амплуа «sales», как у ролика №3 (владелец 12.10:
«голос как в ролике номер 3»). Соседние фразы — одним запросом (до 240 знаков), ударения «+» только где синтезатор ошибается.
  python3 reels/referral-x4-14/voice.py → out/voice/voice.wav
"""
import os, subprocess, sys
DIR = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, os.path.join(DIR, "../../tools"))
import tts_yandex as Y
OUT = os.path.join(DIR, "out", "voice"); os.makedirs(OUT, exist_ok=True)
P = [l.strip() for l in open(os.path.join(DIR, "phrases.txt"), encoding="utf-8") if l.strip()]
FIX = {"кредитку": "кред+итку", "кредиткой": "кред+иткой", "кредиткам": "кред+иткам", "кредитки": "кред+итки"}
G, cur = [], ""
for p in P:
    if cur and len(cur) + 1 + len(p) > 240: G.append(cur); cur = p
    else: cur = (cur + " " + p).strip()
G.append(cur)
fs = []
for i, g in enumerate(G):
    for k, v in FIX.items(): g = g.replace(k, v).replace(k.capitalize(), v[0].upper() + v[1:])
    f = os.path.join(OUT, f"g{i}.wav"); Y.synth(g, f, voice="vasily", role="sales", stressed=True); fs.append(f); print(i, g, flush=True)
flt = "".join(f"[{k}:a]aresample=48000,aformat=channel_layouts=mono,apad=pad_dur={.35 if k < len(fs) - 1 else 0}[a{k}];" for k in range(len(fs)))
flt += "".join(f"[a{k}]" for k in range(len(fs))) + f"concat=n={len(fs)}:v=0:a=1,highpass=f=60,loudnorm=I=-16:TP=-1.5[o]"
subprocess.run(["ffmpeg", "-v", "error", "-y", *sum((["-i", f] for f in fs), []), "-filter_complex", flt, "-map", "[o]", "-ar", "48000", os.path.join(OUT, "voice.wav")], check=True)
print(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", os.path.join(OUT, "voice.wav")], capture_output=True, text=True).stdout.strip(), "с")
