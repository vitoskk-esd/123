#!/usr/bin/env python3
"""Пофразная замена тембра для рилса (как в youtube/01-bank-tierlist/voice_v2.py).

python vc_fix.py  ->  out/voice.wav (старый — out/voice_v1.wav)

Почему: voice.py режет по паузам, а в записи без шумодава между причинами пауз почти нет — кусок 9–22 с
VC смазал («нужную» → «маленькую», «ссылка в шапке профиля» → «целка в шапке по офиле»).
Здесь: границы — по знакам препинания сценария (минимум громкости между словами), на кусок до 6 попыток
(темп 1.0/0.85/0.75 × seed), лучшая — по совпадению с распознаванием ИСХОДНОЙ записи этого куска.
Тайминги не меняются: кадры и субтитры перерендеривать не нужно, только пересвести звук."""
import importlib.util, json, os, re, subprocess, sys
import numpy as np, soundfile as sf

DIR = os.path.dirname(os.path.abspath(__file__)); OUT = os.path.join(DIR, "out")
sys.argv = [sys.argv[0]]
spec = importlib.util.spec_from_file_location("V", os.path.join(DIR, "voice.py")); V = importlib.util.module_from_spec(spec); spec.loader.exec_module(V)
SR = V.SR
ATTEMPTS = [(1.0, 0), (.85, 0), (1.0, 1), (.85, 1), (.75, 0), (.9, 2)]
CLEAN = os.path.join(OUT, "rec_clean.wav")
PD = os.path.join(OUT, "vcfix"); os.makedirs(PD, exist_ok=True)

a, sr = sf.read(CLEAN); assert sr == SR
dur = len(a) / SR
# огибающая громкости по копии с шумодавом — для поиска тихих мест между фразами
dn = os.path.join(PD, "_dn.wav")
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", CLEAN, "-af", "afftdn=nf=-25", dn], check=True)
d, _ = sf.read(dn); hop = int(.01 * SR)
rms = np.array([np.sqrt(np.mean(d[i:i + hop] ** 2) + 1e-12) for i in range(0, len(d) - hop, hop)])

js = open(os.path.join(DIR, "timeline.js")).read()
words = [(m.group(1), float(m.group(2))) for m in re.finditer(r'\{ w: "([^"]+)", a: ([0-9.]+) \}', js)]
cuts = [0.0]
for (w, t), (_, t2) in zip(words, words[1:]):
    if re.search(r"[,.?!:—]$", w) and t2 - t > .3:
        lo, hi = int((t + .2) / .01), int(t2 / .01)
        c = (lo + int(np.argmin(rms[lo:hi]))) * .01 if hi > lo else (t + t2) / 2
        if c - cuts[-1] >= 1.2: cuts.append(round(c, 3))
cuts.append(dur)
segs = list(zip(cuts, cuts[1:]))
print(f"кусков: {len(segs)}", flush=True)

import torch, torchaudio
from chatterbox.vc import ChatterboxVC
vc = ChatterboxVC.from_pretrained("cpu")

def tr(arr):
    p48, p16 = os.path.join(PD, "_48.wav"), os.path.join(PD, "_16.wav")
    sf.write(p48, arr, SR); subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", p48, "-ar", "16000", "-ac", "1", p16], check=True)
    return V.transcribe(p16, "medium")

out = np.zeros(len(a)); report = []
# REDO=8,9,10 — второй проход только для этих кусков (сильнее замедление, новые seed); остальные — из прошлого прохода
REDO = [int(v) for v in os.environ.get("REDO", "").split(",") if v]
prev = {r["x"]: r for r in json.load(open(os.path.join(OUT, "vcfix.json")))} if REDO else {}
ATT2 = [(.7, 0), (.7, 1), (.65, 0), (.8, 3), (.75, 4), (.7, 5), (.6, 0), (.85, 6)]
for i, (x, y) in enumerate(segs):
    if REDO and i not in REDO and x in prev:
        r = prev[x]; xa = max(0, x - .3); n = int(round((y - x) * SR))
        p, _ = sf.read(os.path.join(PD, f"vc_{i}_{r['tag']}.48.wav")); off = int(round((x - xa) * SR))
        seg = np.pad(p[off:off + n], (0, max(0, n - len(p[off:off + n])))); s0, F = int(round(x * SR)), int(.01 * SR)
        if i > 0: seg[:F] *= np.linspace(0, 1, F)
        if i < len(segs) - 1: seg[-F:] *= np.linspace(1, 0, F)
        out[s0:s0 + len(seg)] += seg[:len(out) - s0]; report.append(r); continue
    want = " ".join(w["w"] for w in tr(a[int(x * SR):int(y * SR)]))
    xa, ya = max(0, x - .3), min(dur, y + .3)
    src = os.path.join(PD, f"src_{i}.wav"); sf.write(src, a[int(xa * SR):int(ya * SR)], SR)
    best = (-1, None, "")
    for tempo, seed in (ATT2 if REDO else ATTEMPTS):
        vin = src
        if tempo != 1.0:
            vin = os.path.join(PD, f"src_{i}_t{int(tempo * 100)}.wav")
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", src, "-af", f"atempo={tempo}", vin], check=True)
        raw = os.path.join(PD, f"vc_{i}_t{int(tempo * 100)}s{seed}.wav")
        torch.manual_seed(seed); torchaudio.save(raw, vc.generate(audio=vin, target_voice_path=V.VC_TARGET), vc.sr)
        r48 = raw[:-4] + ".48.wav"
        af = ["-af", f"atempo={1 / tempo:.5f}"] if tempo != 1.0 else []
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", raw, *af, "-ar", str(SR), "-ac", "1", r48], check=True)
        p, _ = sf.read(r48); off = int(round((x - xa) * SR)); n = int(round((y - x) * SR))
        seg = np.pad(p[off:off + n], (0, max(0, n - len(p[off:off + n]))))
        got = tr(seg); sim = V.similarity(want, got)
        print(f"  {i:2d} {x:5.2f}–{y:5.2f} t{int(tempo * 100)}s{seed}: {sim:.2f}  «{' '.join(w['w'] for w in got)}»", flush=True)
        if sim > best[0]: best = (sim, seg, f"t{int(tempo * 100)}s{seed}")
        if sim >= .97: break
    if REDO and x in prev and prev[x]["sim"] >= best[0]:   # второй проход не лучше — оставляем прежний
        r = prev[x]; p, _ = sf.read(os.path.join(PD, f"vc_{i}_{r['tag']}.48.wav")); off = int(round((x - xa) * SR)); n = int(round((y - x) * SR))
        best = (r["sim"], np.pad(p[off:off + n], (0, max(0, n - len(p[off:off + n])))), r["tag"])
    s0, F = int(round(x * SR)), int(.01 * SR)
    seg = best[1].copy()
    if i > 0: seg[:F] *= np.linspace(0, 1, F)
    if i < len(segs) - 1: seg[-F:] *= np.linspace(1, 0, F)
    out[s0:s0 + len(seg)] += seg[:len(out) - s0]
    report.append({"x": x, "y": y, "want": want, "sim": round(best[0], 3), "tag": best[2]})
    print(f"кусок {i}: «{want}» -> {best[0]:.2f} ({best[2]})", flush=True)

vw = os.path.join(OUT, "voice.wav")
if os.path.exists(vw) and not os.path.exists(os.path.join(OUT, "voice_v1.wav")): os.replace(vw, os.path.join(OUT, "voice_v1.wav"))
sf.write(vw, out, SR, subtype="PCM_16")
json.dump(report, open(os.path.join(OUT, "vcfix.json"), "w"), ensure_ascii=False, indent=1)
print("готово:", vw, "средняя", round(float(np.mean([r["sim"] for r in report])), 3))
