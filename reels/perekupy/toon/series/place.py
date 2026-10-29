# python place.py ep04 — голоса серии → реплики по паузам, «блин» → «пииип», таймлайн и губы → vo/<id>/voice.wav, timeline.js
import json, re, subprocess, sys
import numpy as np
sys.path.insert(0, "../..")
import asr

ID = sys.argv[1]; SP = json.load(open(f"{ID}.json")); D = f"vo/{ID}"
SR = 48000
TEMPO = {"tolyan": 1.2, "lis": 1.25}
NAMES = {"tolyan": ["L0", "L1", "L2", "L3"], "lis": ["N1", "N1b", "N2", "N2b", "N3", "N3b", "N4", "N5"]}
db = lambda x: 10 ** (x / 20)


def load(path, tempo):
    """ускоряем и выравниваем громкость по словам: TTS любит «проглатывать» концы фраз"""
    raw = subprocess.run(["ffmpeg", "-v", "quiet", "-i", path, "-af", f"atempo={tempo},dynaudnorm=f=150:g=7:p=0.9:m=6", "-f", "f32le", "-ac", "1", "-ar", str(SR), "-"],
                         capture_output=True).stdout
    return np.frombuffer(raw, np.float32).copy()


def split(x, n):
    """n реплик: режем по n-1 самым длинным паузам; края каждой реплики — до тишины, мягко"""
    fr = int(.02 * SR); m = len(x) // fr
    loud = np.sqrt(np.mean(x[:m * fr].reshape(m, fr) ** 2, axis=1)) > db(-42)
    idx = np.flatnonzero(loud); first, last = idx[0], idx[-1]
    runs, i = [], first
    while i <= last:
        if not loud[i]:
            j = i
            while j <= last and not loud[j]: j += 1
            runs.append((j - i, i, j)); i = j
        else:
            i += 1
    cuts = sorted(sorted(runs, reverse=True)[:n - 1], key=lambda r: r[1])
    bounds = [first] + [c for r in cuts for c in (r[1], r[2])] + [last + 1]
    out = []
    for a, b in zip(bounds[::2], bounds[1::2]):
        s0, s1 = max(0, a * fr - int(.04 * SR)), min(len(x), b * fr + int(.08 * SR))
        out.append((s0, s1))
    return out


def soft(seg):
    seg = seg.copy(); f = int(.012 * SR)
    seg[:f] *= np.linspace(0, 1, f); seg[-f:] *= np.linspace(1, 0, f)
    return seg


def squeeze(seg, keep=.12):
    """паузы внутри реплики длиннее keep → keep: уходят «зависания», темп речи тот же"""
    fr = int(.02 * SR); n = len(seg) // fr
    quiet = [np.sqrt(np.mean(seg[i * fr:(i + 1) * fr] ** 2)) < db(-40) for i in range(n)]
    out, i = [], 0
    while i < n:
        j = i
        while j < n and quiet[j] == quiet[i]: j += 1
        chunk = seg[i * fr:j * fr]
        if quiet[i] and 0 < i and j < n and (j - i) * fr > keep * SR: chunk = chunk[:int(keep * SR)]
        out.append(chunk); i = j
    out.append(seg[n * fr:])
    return np.concatenate(out)


norm = lambda s: re.sub(r"[^а-я0-9]", "", s.lower().replace("ё", "е"))
segs, bleep_rel, report = {}, {}, []
for spk, names in NAMES.items():
    x = load(f"{D}/{spk}.wav", TEMPO[spk])
    tmp = f"{D}/{spk}_fast.wav"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "1", "-i", "-", tmp], input=x.tobytes(), check=True)
    words = asr.words(tmp, "small")
    parts = split(x, len(names))
    for name, (a, b), want in zip(names, parts, SP[spk]):
        inside = lambda t0, t1: min(t1, b / SR) - max(t0, a / SR) > .5 * (t1 - t0) or (t0 < b / SR and t1 > a / SR + .05 and t1 - t0 > .3)
        got = " ".join(w for w, t0, t1 in words if inside(t0, t1))
        report.append(f"{name}: «{got}»  ← {want}")
        bl = []          # «блин» глушим от конца предыдущего слова до начала следующего — слово целиком, соседей не трогаем
        for j, (w, t0, t1) in enumerate(words):
            if inside(t0, t1) and norm(w).startswith("блин"):
                lo = max(t0 - .25, words[j - 1][2] if j else 0, a / SR); hi = min(t1 + .15, words[j + 1][1] if j + 1 < len(words) else 1e9, b / SR)
                # само слово — непрерывный звук, начавшийся не раньше начала слова по Whisper: от него и глушим
                lv = lambda tt: np.sqrt(np.mean(x[int(tt * SR):int((tt + .01) * SR)] ** 2)) > db(-34)
                # начало: первый звук после тишины в окне (хвост предыдущего слова пропускаем); тишины нет — с начала окна
                quiet = lambda tt: np.sqrt(np.mean(x[int(tt * SR):int((tt + .03) * SR)] ** 2)) < db(-40)
                gap = next((tt for tt in np.arange(lo, t0 + .1, .01) if quiet(tt)), None)
                st = lo if gap is None else next((tt for tt in np.arange(gap, hi, .01) if lv(tt)), None)
                if st is not None:
                    en = st
                    while en < hi and (lv(en) or lv(en + .01) or lv(en + .02)): en += .01
                    lo, hi = max(lo, st - .04), min(hi, max(en + .04, t1 + .03, st + .36))   # короче «блин» не бывает
                bl.append((lo - a / SR, hi - a / SR))
        seg = x[a:b]
        if bl:
            bleep_rel[name] = bl
            segs[name] = (spk, soft(seg))
        else:
            segs[name] = (spk, soft(squeeze(seg)))
print("\n".join(report))
want_bleeps = {f"L{i}" for i, t in enumerate(SP["tolyan"]) if "блин" in t.lower()}
assert set(bleep_rel) == want_bleeps, f"«блин» найден в {sorted(bleep_rel)}, а в сценарии — {sorted(want_bleeps)}"

dur = lambda i: len(segs[i][1]) / SR
t, T = {}, {}
t["L0"] = .3; pos = t["L0"] + dur("L0") + .25
for k in (1, 2, 3):
    T[f"p{k}"] = pos; t[f"N{k}"] = pos + .15
    T[f"r{k}"] = t[f"N{k}"] + dur(f"N{k}") + .1; t[f"N{k}b"] = T[f"r{k}"] + .05
    t[f"L{k}"] = max(T[f"r{k}"] + SP["real"][k - 1], t[f"N{k}b"] + dur(f"N{k}b") + .25)
    pos = t[f"L{k}"] + dur(f"L{k}") + .8               # плашка «проверь» успевает прочитаться
T["sum"] = pos; t["N4"] = pos + 1.3; pos = t["N4"] + dur("N4") + .4
T["end"] = pos; t["N5"] = pos + .25; pos = t["N5"] + dur("N5") + 1.0
DUR = round(pos, 2); N = int(DUR * SR)
tracks = {k: np.zeros(N, np.float32) for k in NAMES}
for i, (spk, seg) in segs.items():
    s0 = int(t[i] * SR); tracks[spk][s0:s0 + len(seg)] += seg[:N - s0]
bleeps = []
for name, lst in sorted(bleep_rel.items()):
    for a0, b0 in lst:
        d0, d1 = t[name] + a0, t[name] + b0
        tracks["tolyan"][int(d0 * SR):int(d1 * SR)] = 0
        bleeps.append([round(float(d0), 3), round(float(d1), 3), name])
mix = sum(tracks.values())
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "1", "-i", "-", f"{D}/voice.wav"],
               input=mix.astype(np.float32).tobytes(), check=True)
lip = {}
for k, x in tracks.items():
    fr = int(SR / 30); n = N // fr
    rms = np.sqrt(np.mean(x[:n * fr].reshape(n, fr) ** 2, axis=1))
    peak = np.percentile(rms[rms > 1e-4], 95) if (rms > 1e-4).any() else 1
    lip[k] = [round(float(min(1, v / peak)), 2) for v in rms]
T = {k: round(v, 3) for k, v in T.items()}
starts = {i: round(t[i], 3) for i in t}; ends = {i: round(t[i] + dur(i), 3) for i in t}
open(f"{D}/timeline.js", "w").write("window.TT=" + json.dumps({"T": T, "start": starts, "end": ends, "bleeps": bleeps}, ensure_ascii=False) +
                                    ";window.LIP=" + json.dumps(lip) + f";window.DURATION={DUR};window.LEAD=0;\n")
print("DUR", DUR, "T", T, "bleeps", bleeps)
