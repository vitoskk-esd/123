#!/usr/bin/env python3
"""Голос ролика №3 через Yandex SpeechKit, голос — YA_VOICE (по умолчанию madirus; владелец 12.10: «давай всё-таки поменяем голос на другой»).
Ударения — наш словарь (tts_v5.stress + STRESS_FIX), «+» перед ударной гласной; фраза длиннее 240 знаков делится по предложениям
(лимит запроса — 250). Каждая фраза сверяется Whisper medium (voice_e.check), слабые — в отчёт voice/ya/report.txt.
Склейка — tts_v5.humanize(fx="clean", темп 1,0) → voice/out/voice.wav.
  <python с ruaccent и whisper> voice/ya_voice.py
"""
import json, os, re, sys
sys.path.insert(0, "/home/user/123/tools"); sys.path.insert(0, "/home/user/123/reels/zero-card-07")
import tts_v5 as T, tts_yandex as Y, voice_e as E
HERE = os.path.dirname(os.path.abspath(__file__)); D = os.path.join(HERE, "ya"); os.makedirs(D, exist_ok=True)
T.STRESS_FIX.update({"хэдхантера": "хэдх+антера", "менеджеру": "м+энэджэру", "оформляй": "оформл+яй"})
P = [l.strip() for l in open(os.path.join(HERE, "phrases.txt")) if l.strip()]
meta_f = os.path.join(D, "meta.json"); meta = json.load(open(meta_f)) if os.path.exists(meta_f) else {}

def chunks(s, lim=240):
    if len(s) <= lim: return [s]
    out, cur = [], ""
    for part in re.split(r"(?<=[.!?…])\s+", s):
        if cur and len(cur) + 1 + len(part) > lim: out.append(cur); cur = part
        else: cur = (cur + " " + part).strip()
    return out + [cur]

for i, p in enumerate(P):
    f = os.path.join(D, f"p{i:03d}.wav"); m = meta.get(str(i))
    if m and m.get("text") == p and m.get("voice") == Y.VOICE and os.path.exists(f): continue
    said = Y.to_plus(T.stress(p)); parts = chunks(said)
    if len(parts) == 1: Y.synth(said, f, stressed=True)
    else:                                                    # длинная фраза — куски подряд с паузой 0,25 с
        import subprocess
        fs = []
        for k, c in enumerate(parts): g = f[:-4] + f"_{k}.wav"; Y.synth(c, g, stressed=True); fs.append(g)
        flt = "".join(f"[{k}:a]apad=pad_dur=0.25[a{k}];" for k in range(len(fs))) + "".join(f"[a{k}]" for k in range(len(fs))) + f"concat=n={len(fs)}:v=0:a=1[o]"
        subprocess.run(["ffmpeg", "-v", "error", "-y", *sum((["-i", g] for g in fs), []), "-filter_complex", flt, "-map", "[o]", f], check=True)
    sim, heard = E.check(f, p)
    meta[str(i)] = dict(text=p, voice=Y.VOICE, said=said, sim=round(sim, 3), heard=heard, e=f)
    json.dump(meta, open(meta_f, "w"), ensure_ascii=False, indent=1)
    print(f"{i} {sim:.2f} — {heard}", flush=True)

weak = [f"{k}: {v['sim']} | {v['text']} | слышно: {v['heard']}" for k, v in sorted(meta.items(), key=lambda x: int(x[0])) if v["sim"] < .95]
open(os.path.join(D, "report.txt"), "w").write("\n".join(weak) + "\n"); print("слабые:", len(weak))
print(T.humanize([meta[str(i)]["e"] for i in range(len(P))], os.path.join(HERE, "out/voice.wav"), breath_db=None, fx="clean", tempo=1.0))
