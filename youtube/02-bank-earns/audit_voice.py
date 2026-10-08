"""Проверка готового голоса: нечёткие слова, запинки, обрезанные слова, склейки посреди звука.

  python audit_voice.py out/voice_final.wav [out/audit.json]

1) Режем файл по паузам на куски ≤ 20 с, каждый распознаём Whisper medium со словами и вероятностями.
   Флаги: слово с вероятностью < 0.45; повтор слова/начала слова подряд («на проду… на продукты»);
   оборванное слово (…, -, «—»); кусок, текст которого расходится с распознаванием исходника (< 0.85).
2) Все стыки (склейки монтажа, сжатия пауз, границы кусков VC) переводим во время готового файла и
   смотрим громкость ±40 мс: если с обеих сторон речь (> −38 дБ) — склейка режет звук.
Итог — список мест с временем и текстом, out/audit.json.
"""
import array, difflib, json, math, os, re, subprocess, sys, wave

DIR = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(DIR, "out")
sys.path.insert(0, "/home/user/123/reels/zero-card-07")
import voice as V

norm = lambda w: re.sub(r"[^а-яa-z0-9]", "", w.lower().replace("ё", "е"))


def pcm_of(path):
    with wave.open(path) as w:
        return w.getframerate(), array.array("h", w.readframes(w.getnframes()))


def db(a, sr, t, win=.04):
    i0, i1 = max(0, int(t * sr)), min(len(a), int((t + win) * sr))
    s = a[i0:i1]
    return 20 * math.log10(max(1, math.sqrt(sum(x * x for x in s) / max(1, len(s)))) / 32768) if len(s) else -99


def chunks(path, dur):
    err = subprocess.run(["ffmpeg", "-i", path, "-af", "silencedetect=n=-40dB:d=0.25", "-f", "null", "-"], capture_output=True, text=True).stderr
    st = [float(x) for x in re.findall(r"silence_start: ([0-9.]+)", err)]
    en = [float(x) for x in re.findall(r"silence_end: ([0-9.]+)", err)]
    cuts = [(x + y) / 2 for x, y in zip(st, en)]
    segs, a, last = [], 0.0, 0.0
    for c in cuts + [dur]:
        if c - a > 20 and last > a + 3:
            segs.append((a, last)); a = last
        last = c
    segs.append((a, dur))
    return segs


def joints_final():
    """Все стыки во времени готового файла."""
    jf = os.path.join(OUT, "joints_final.json")
    if os.path.exists(jf): return [("стык", t) for t in json.load(open(jf))]
    fin = json.load(open(os.path.join(OUT, "words_final.json")))
    keep = fin["tighten"]
    remap = lambda t: next((off + t - x for off, (x, y) in zip([sum(b - a for a, b in keep[:i]) for i in range(len(keep))], keep) if x <= t < y), None)
    js = []
    off = 0.0
    for x, y in keep[:-1]:
        off += y - x; js.append(("пауза/вырез", off))
    m = json.load(open(os.path.join(OUT, "vcp", "pieces.json")))
    for x, y in m["segs"][:-1]:
        t = remap(y)
        if t is not None: js.append(("граница VC", t))
    seg = json.load(open(os.path.join(OUT, "words.json")))["segments"]
    off = 0.0
    for x, y in seg[:-1]:
        off += y - x
        t = remap(off)
        if t is not None: js.append(("склейка монтажа", t))
    return sorted(js, key=lambda j: j[1])


def main(path, dst):
    sr, a = pcm_of(path)
    dur = len(a) / sr
    ref = json.load(open(os.path.join(OUT, "words_final.json")))["words"]
    report = {"file": path, "chunks": [], "flags": [], "joints": []}
    m = V.whisper("medium")
    for i, (x, y) in enumerate(chunks(path, dur)):
        tmp = os.path.join(OUT, f"_aud_{i}.wav")
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", path, "-ss", f"{x:.3f}", "-to", f"{y:.3f}", "-ac", "1", "-ar", "16000", tmp], check=True)
        segs, _ = m.transcribe(tmp, language="ru", beam_size=5, word_timestamps=True, vad_filter=False, condition_on_previous_text=False)
        ws = [{"w": w.word.strip(), "a": round(x + w.start, 2), "p": round(w.probability, 2)} for s in segs for w in s.words if w.end - w.start >= .02]
        os.remove(tmp)
        got = " ".join(w["w"] for w in ws)
        want = " ".join(w["w"] for w in ref if x - .05 <= w["a"] < y - .05 and w.get("d", 1) > 0)
        sim = difflib.SequenceMatcher(None, " ".join(norm(t) for t in want.split()), " ".join(norm(t) for t in got.split()), autojunk=False).ratio()
        report["chunks"].append({"x": round(x, 2), "y": round(y, 2), "sim": round(sim, 3), "got": got, "want": want})
        print(f"[{x:6.1f}–{y:6.1f}] {sim:.2f}  {got}", flush=True)
        if sim < .85: report["flags"].append({"t": round(x, 2), "kind": "расхождение с исходником", "text": got, "want": want, "sim": round(sim, 2)})
        for k, w in enumerate(ws):
            n = norm(w["w"])
            if w["p"] < .45: report["flags"].append({"t": w["a"], "kind": "нечёткое слово", "text": w["w"], "p": w["p"]})
            if re.search(r"(\.\.\.|…|-|—)$", w["w"]) and len(n) > 0: report["flags"].append({"t": w["a"], "kind": "оборванное слово", "text": w["w"]})
            if k and n and len(n) >= 2:
                prev = norm(ws[k - 1]["w"])
                if prev and (prev == n or (len(prev) >= 3 and n.startswith(prev) and prev != n)):
                    report["flags"].append({"t": w["a"], "kind": "повтор/запинка", "text": f"{ws[k - 1]['w']} {w['w']}"})
    for kind, t in joints_final():
        l, r = db(a, sr, t - .045), db(a, sr, t + .005)
        if l > -38 and r > -38:
            report["joints"].append({"t": round(t, 3), "kind": kind, "left_db": round(l, 1), "right_db": round(r, 1)})
    json.dump(report, open(dst, "w"), ensure_ascii=False, indent=1)
    print(f"\nкусков {len(report['chunks'])}, флагов {len(report['flags'])}, склеек в звуке {len(report['joints'])}")
    for f in report["flags"]: print("ФЛАГ", f)
    for j in report["joints"]: print("СТЫК", j)


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2] if len(sys.argv) > 2 else os.path.join(OUT, "audit.json"))
