#!/usr/bin/env python3
"""Голос ролика №5 «Заработок на кредитке» (как №4) — живой голос Yandex SpeechKit LiveTTS «vasily», амплуа «sales» (владелец 12.10: «голос мне нравится,
собирай ролик номер 3»; до этого: «звук похож на робота… ставь правильно ударения»).
Почему звучит живо, в отличие от ya_voice.py (Антон): 1) модель livetts; 2) соседние фразы одного раздела — одним запросом
(до 240 знаков), интонация течёт через точки; 3) ударения «+» только в словах, где синтезатор ошибается (FIX ниже), а не в каждом
слове — так советует документация SpeechKit (разметка на каждом слове делает речь рубленой). Между запросами — пауза 0,4 с,
между разделами сценария — 0,9 с. Каждый кусок сверяется Whisper medium (voice_e.check); отчёт — voice/ya_live/report.txt.
  <python с whisper> voice/ya_live.py → voice/out/voice.wav
"""
import json, os, re, subprocess, sys
sys.path.insert(0, "/home/user/123/tools"); sys.path.insert(0, "/home/user/123/reels/zero-card-07")
import tts_yandex as Y, voice_e as E
HERE = os.path.dirname(os.path.abspath(__file__)); D = os.path.join(HERE, "ya_live"); os.makedirs(D, exist_ok=True)
VOICE, ROLE = os.environ.get("YA_VOICE", "vasily"), os.environ.get("YA_ROLE", "sales")
FIX = {"кэшбэк": "кэшб+эк", "кэшбэка": "кэшб+эка", "кэшбэком": "кэшб+эком", "кэшбэке": "кэшб+эке", "хэдхантера": "хэдх+антера",
       "начал": "н+ачал", "начала": "н+ачала", "начали": "н+ачали", "звонит": "звон+ит", "договор": "догов+ор", "договора": "догов+ора"}
fix = lambda s: re.sub(r"[А-Яа-яЁё]+", lambda m: (lambda w: (w[0].upper() + w[1:]) if m.group()[0].isupper() and w[0] != "+" else w)(FIX[m.group().lower()]) if m.group().lower() in FIX else m.group(), s)
P = [l.strip() for l in open(os.path.join(HERE, "phrases.txt")) if l.strip()]
SEC = [l.strip() for l in open(os.path.join(HERE, "sections.txt"))]
# куски: подряд идущие фразы одного раздела, до 240 знаков
G, cur = [], None
for i, p in enumerate(P):
    if cur and SEC[i] == cur["sec"] and len(cur["text"]) + 1 + len(p) <= 240: cur["ids"].append(i); cur["text"] += " " + p
    else: cur = dict(sec=SEC[i], ids=[i], text=p); G.append(cur)
meta_f = os.path.join(D, "meta.json"); meta = json.load(open(meta_f)) if os.path.exists(meta_f) else {}
for k, g in enumerate(G):
    f = os.path.join(D, f"g{k:03d}.wav"); m = meta.get(str(k)); key = f"{VOICE}/{ROLE}/{g['text']}"
    if m and m.get("key") == key and os.path.exists(f): continue
    said = fix(g["text"]); Y.synth(said, f, voice=VOICE, role=ROLE, stressed=True)
    sim, heard = E.check(f, g["text"])
    meta[str(k)] = dict(key=key, ids=g["ids"], sec=g["sec"], said=said, sim=round(sim, 3), heard=heard, e=f)
    json.dump(meta, open(meta_f, "w"), ensure_ascii=False, indent=1)
    print(f"{k} {sim:.2f} [{g['ids'][0]}–{g['ids'][-1]}] {heard}", flush=True)
weak = [f"{k}: {v['sim']} | {v['said']} | слышно: {v['heard']}" for k, v in sorted(meta.items(), key=lambda x: int(x[0])) if int(k) < len(G) and v["sim"] < .95]
open(os.path.join(D, "report.txt"), "w").write("\n".join(weak) + "\n"); print("кусков:", len(G), "слабых:", len(weak), flush=True)
# склейка: паузы 0,4 с внутри раздела и 0,9 с между разделами; обработка — только срез низа и громкость (без «улучшайзеров»)
ins, flt = [], []
for k, g in enumerate(G):
    gap = 0 if k == len(G) - 1 else (.9 if G[k + 1]["sec"] != g["sec"] else .4)
    ins += ["-i", meta[str(k)]["e"]]; flt.append(f"[{k}:a]aresample=48000,aformat=channel_layouts=mono,apad=pad_dur={gap}[a{k}]")
flt.append("".join(f"[a{k}]" for k in range(len(G))) + f"concat=n={len(G)}:v=0:a=1,highpass=f=60,loudnorm=I=-16:TP=-1.5[o]")
out = os.path.join(HERE, "out/voice.wav")
subprocess.run(["ffmpeg", "-v", "error", "-y", *ins, "-filter_complex", ";".join(flt), "-map", "[o]", "-ar", "48000", out], check=True)
print(out)
