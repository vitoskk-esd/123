# Голос: сжать длинные паузы → vo/voice.wav; слова whisper → время каждого слова субтитров (wordTimes по сценам) + огибающая рта
import json, wave, difflib, re, sys
import numpy as np
SR = 48000; LEAD = float(sys.argv[1]) if len(sys.argv) > 1 else .15; MAXGAP, NEWGAP = .42, .3
w = json.load(open("vo/words_t.json")); L = json.load(open("lines.json"))
with wave.open("vo/t.wav") as f: a = np.frombuffer(f.readframes(f.getnframes()), np.int16).astype(np.float32) / 32768
# сегменты речи с короткими паузами
cuts = []; prev_end = None
for x in w:
    s, e = x[1], x[2]
    if prev_end is not None and s - prev_end > MAXGAP: cuts.append((prev_end + NEWGAP / 2, s - NEWGAP / 2))
    prev_end = e
start = max(0, w[0][1] - .04)
keep = []; pos = start
for c0, c1 in cuts: keep.append((pos, c0)); pos = c1
keep.append((pos, min(len(a) / SR, w[-1][2] + .5)))
def remap(t):
    acc = LEAD
    for k0, k1 in keep:
        if t <= k1: return acc + max(0, t - k0)
        acc += k1 - k0
    return acc
fade = int(.035 * SR); parts = [np.zeros(int(LEAD * SR), np.float32)]
for k0, k1 in keep:
    seg = a[int(k0 * SR):int(k1 * SR)].copy(); n = min(fade, len(seg) // 2)
    seg[:n] *= np.linspace(0, 1, n); seg[-n:] *= np.linspace(1, 0, n); parts.append(seg)
v = np.concatenate(parts)
with wave.open("vo/voice.wav", "wb") as f: f.setnchannels(1); f.setsampwidth(2); f.setframerate(SR); f.writeframes((np.clip(v, -1, 1) * 32767).astype(np.int16).tobytes())
W = [(x[0], remap(x[1]), remap(x[2])) for x in w]
norm = lambda s: re.sub(r"[^0-9a-zа-я]", "", s.lower().replace("ё", "е"))
toks = [];
for i, sc in enumerate(L):
    for k, t in enumerate([x for x in re.split(r"[ \n\t]+", sc["line"]) if x]): toks.append((i, k, norm(t)))
A = [t[2] for t in toks]; B = [norm(x[0]) for x in W]
tt = [None] * len(toks)
for blk in difflib.SequenceMatcher(None, A, B, autojunk=False).get_matching_blocks():
    for j in range(blk.size): tt[blk.a + j] = W[blk.b + j][1]
# частичные совпадения (цифры «87000» ~ «87», «телеграмканал» ~ «телеграм»): ищем слово whisper, начинающееся так же, между якорями
known = [i for i, x in enumerate(tt) if x is not None]
for i in range(len(tt)):
    if tt[i] is None:
        lo = max([k for k in known if k < i], default=None); hi = min([k for k in known if k > i], default=None)
        t0 = tt[lo] if lo is not None else LEAD; t1 = tt[hi] if hi is not None else W[-1][2]
        cand = [x for x in W if t0 < x[1] < t1 and A[i][:2] and norm(x[0])[:2] == A[i][:2]]
        if cand: tt[i] = cand[0][1]
known = [i for i, x in enumerate(tt) if x is not None]
for i in range(len(tt)):
    if tt[i] is None:
        lo = max([k for k in known if k < i], default=None); hi = min([k for k in known if k > i], default=None)
        t0 = tt[lo] if lo is not None else LEAD; t1 = tt[hi] if hi is not None else W[-1][2]
        n0 = lo if lo is not None else -1; n1 = hi if hi is not None else len(tt)
        tt[i] = t0 + (t1 - t0) * (i - n0) / (n1 - n0)
for i in range(1, len(tt)): tt[i] = max(tt[i], tt[i - 1] + .05)
WT = [[] for _ in L]
for (i, k, _), t in zip(toks, tt): WT[i].append(round(t, 3))
json.dump({"wordTimes": WT, "end": round(W[-1][2], 3)}, open("vo/timing.json", "w"))
# огибающая рта: RMS по кадрам 30 к/с, нормировка по 95-му перцентилю
hop = SR // 30; rms = np.array([np.sqrt(np.mean(v[i:i + hop] ** 2) + 1e-12) for i in range(0, len(v), hop)])
m = np.clip(rms / np.percentile(rms, 95), 0, 1); m[m < .08] = 0
json.dump([round(float(x), 2) for x in m], open("vo/mouth.json", "w"))
print("voice", round(len(v) / SR, 2), "s; pauses cut", len(cuts), "; unmatched->interp ok; last word", round(W[-1][2], 2))
