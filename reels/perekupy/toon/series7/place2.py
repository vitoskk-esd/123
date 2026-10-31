# python place2.py ep06 — реплики героев (vo/<герой>.wav из tts_batch.py) → по паузам, «блин» → «пииип»,
# раскладка подряд по сценарию (gap/pause), губы → vo/<id>/voice.wav, timeline.js
import json, os, re, subprocess, sys
import numpy as np
sys.path.insert(0, "../..")
import asr

ID = sys.argv[1]; SP = json.load(open(f"{ID}.json")); V = json.load(open("voices.json")); IDX = json.load(open("vo/index.json"))
D = f"vo/{ID}"; os.makedirs(D, exist_ok=True)
SR = 48000
db = lambda x: 10 ** (x / 20)
norm = lambda s: re.sub(r"[^а-я0-9]", "", s.lower().replace("ё", "е"))


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


def split_words(x, words, texts):
    """реплики по словам: Whisper-слова сопоставляем с текстом сценария; граница между репликами — самая длинная
    пауза между последним словом одной и первым словом следующей; края — до тишины"""
    import difflib
    exp, owner = [], []
    for k, tx in enumerate(texts):
        for w in tx.split():
            if norm(w): exp.append(norm(w)); owner.append(k)
    got = [norm(w) for w, _, _ in words]
    sm = difflib.SequenceMatcher(None, exp, got, autojunk=False)
    first, last = {}, {}
    for blk in sm.get_matching_blocks():
        for d in range(blk.size):
            k, j = owner[blk.a + d], blk.b + d
            first.setdefault(k, j); last[k] = j
    for k in range(len(texts)):                     # реплика не совпала ни словом («три, два, один» → «3, 2, 1») —
        if k not in first and k - 1 in last and k + 1 in first and last[k - 1] + 1 < first[k + 1]:   # всё, что между соседями
            first[k], last[k] = last[k - 1] + 1, first[k + 1] - 1
    assert len(first) == len(texts), f"не нашёл реплики {sorted(set(range(len(texts))) - set(first))}"
    cuts = []
    for k in range(1, len(texts)):
        i0, j0 = last[k - 1], first[k]
        assert i0 < j0, f"реплики {k - 1} и {k} перепутаны"
        m = max(range(i0, j0), key=lambda m: words[m + 1][1] - words[m][2])
        cuts.append((words[m][2] + words[m + 1][1]) / 2)
    bounds = [0.0] + cuts + [len(x) / SR]
    out, fr = [], int(.01 * SR)
    for a, b in zip(bounds, bounds[1:]):
        i0, i1 = int(a * SR), int(b * SR)
        lv = [np.sqrt(np.mean(x[i:i + fr] ** 2)) > db(-42) for i in range(i0, i1 - fr, fr)]
        on = [n for n, v in enumerate(lv) if v]
        s0 = i0 + max(0, on[0] * fr - int(.04 * SR)) if on else i0
        s1 = min(i1, i0 + (on[-1] + 1) * fr + int(.08 * SR)) if on else i1
        out.append((s0, s1))
    return out


def soft(seg):
    seg = seg.copy(); f = int(.012 * SR)
    seg[:f] *= np.linspace(0, 1, f); seg[-f:] *= np.linspace(1, 0, f)
    return seg


def squeeze(seg, keep=.12, cuts=None):
    """паузы внутри реплики длиннее keep → keep: уходят «зависания», темп речи тот же.
    cuts — сюда пишем вырезанные куски [(начало, длина) в секундах исходной реплики], чтобы сдвинуть время слов"""
    fr = int(.02 * SR); n = len(seg) // fr
    quiet = [np.sqrt(np.mean(seg[i * fr:(i + 1) * fr] ** 2)) < db(-40) for i in range(n)]
    out, i = [], 0
    while i < n:
        j = i
        while j < n and quiet[j] == quiet[i]: j += 1
        chunk = seg[i * fr:j * fr]
        if quiet[i] and 0 < i and j < n and (j - i) * fr > keep * SR:
            if cuts is not None: cuts.append(((i * fr + int(keep * SR)) / SR, (len(chunk) - int(keep * SR)) / SR))
            chunk = chunk[:int(keep * SR)]
        out.append(chunk); i = j
    out.append(seg[n * fr:])
    return np.concatenate(out)


segs, bleep_rel, report, line_words = {}, {}, [], {}
for who, lines in IDX.items():
    if not any(e == ID for e, _, _ in lines): continue
    x = load(f"vo/{who}.wav", V[who]["tempo"])
    tmp = f"vo/{who}_fast.wav"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "1", "-i", "-", tmp], input=x.tobytes(), check=True)
    words = asr.words(tmp, "small")
    parts = split_words(x, words, [t for _, _, t in lines])
    for (e, name, want), (a, b) in zip(lines, parts):
        if e != ID: continue
        inside = lambda t0, t1: min(t1, b / SR) - max(t0, a / SR) > .5 * (t1 - t0) or (t0 < b / SR and t1 > a / SR + .05 and t1 - t0 > .3)
        got = " ".join(w for w, t0, t1 in words if inside(t0, t1))
        report.append(f"{name} [{who}]: «{got}»  ← {want}")
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
        seg, cuts = x[a:b], []
        if bl:
            bleep_rel[name] = bl; segs[name] = (who, soft(seg))
        else:
            segs[name] = (who, soft(squeeze(seg, cuts=cuts)))
        shift = lambda tt: tt - sum(min(d, max(0, tt - c0)) for c0, d in cuts)     # время в реплике после сжатия пауз
        line_words[name] = [[w, round(shift(t0 - a / SR), 3), round(shift(t1 - a / SR), 3)] for w, t0, t1 in words if inside(t0, t1)]
print("\n".join(report))
want = {ln["id"] for ln in SP["lines"] if "блин" in ln["text"].lower()}
assert set(bleep_rel) == want, f"«блин» найден в {sorted(bleep_rel)}, а в сценарии — {sorted(want)}"
dur = lambda i: len(segs[i][1]) / SR
t, pos = {}, .35
for ln in SP["lines"]:
    pos += ln.get("pause", 0); t[ln["id"]] = pos; pos += dur(ln["id"]) + ln.get("gap", .3)
DUR = round(pos + 1.4, 2); N = int(DUR * SR)
tracks = {who: np.zeros(N, np.float32) for who, _ in segs.values()}
for i, (who, seg) in segs.items():
    s0 = int(t[i] * SR); tracks[who][s0:s0 + len(seg)] += seg[:N - s0]
bleeps = []
for name, lst in sorted(bleep_rel.items()):
    for a0, b0 in lst:
        d0, d1 = t[name] + a0, t[name] + b0
        tracks[segs[name][0]][int(d0 * SR):int(d1 * SR)] = 0
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
starts = {i: round(t[i], 3) for i in t}; ends = {i: round(t[i] + dur(i), 3) for i in t}
open(f"{D}/timeline.js", "w").write("window.TT=" + json.dumps({"start": starts, "end": ends, "bleeps": bleeps,
    "words": {i: [[w, round(t[i] + a0, 3), round(t[i] + b0, 3)] for w, a0, b0 in ws] for i, ws in line_words.items()}}, ensure_ascii=False) +
                                    ";window.LIP=" + json.dumps(lip) + f";window.DURATION={DUR};window.LEAD=0;\n")
print("DUR", DUR, "bleeps", bleeps)
