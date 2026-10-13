#!/usr/bin/env python3
"""Слова голоса ролика №3 (Yandex LiveTTS) по кускам — устойчиво к перезапускам контейнера (12.10: контейнер перезапускался каждые
30–45 мин, а Whisper medium по всей 14-минутной дорожке не успевал). Каждый кусок voice/ya_live/gNNN.wav распознаётся отдельно
и кэшируется в gNNN.words.json; сдвиг куска = сумма длительностей предыдущих + паузы склейки (0,4 с внутри раздела, 0,9 с между
разделами — как в ya_live.py). Итог — voice/words.json в формате build3.py words.
  <python с whisper> voice/ya_words.py
"""
import json, os, subprocess, sys
sys.path.insert(0, "/home/user/123/reels/zero-card-07")
import voice as V
HERE = os.path.dirname(os.path.abspath(__file__)); D = os.path.join(HERE, "ya_live")
meta = json.load(open(os.path.join(D, "meta.json"))); G = [meta[str(k)] for k in range(len(meta))]
dur = lambda f: float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f], capture_output=True, text=True).stdout)
out, off = [], 0.0
for k, g in enumerate(G):
    f = g["e"]; cj = f[:-4] + ".words.json"
    if not os.path.exists(cj):
        f16 = f[:-4] + ".w16.wav"; subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", f, "-ar", "16000", "-ac", "1", f16], check=True)
        json.dump(V.transcribe(f16, "medium"), open(cj, "w"), ensure_ascii=False); print(k, "распознан", flush=True)
    for w in json.load(open(cj)): out.append({**w, "a": round(w["a"] + off, 3)})
    gap = 0 if k == len(G) - 1 else (.9 if G[k + 1]["sec"] != g["sec"] else .4)
    off += dur(f) + gap
json.dump(out, open(os.path.join(HERE, "words.json"), "w"), ensure_ascii=False)
print(len(out), "слов,", round(off, 1), "с; голос:", round(dur(os.path.join(HERE, "out/voice.wav")), 1), "с")
