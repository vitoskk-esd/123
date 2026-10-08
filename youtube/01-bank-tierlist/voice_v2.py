"""Голос v2: чистка запинок + разборчивая замена тембра + мягкие стыки.

Почему (owner, 2026-10-07: «много запинок и плохо обрезанных слов»): аудит показал, что (1) VC размывал слова,
потому что на вход шёл монтаж с шумодавом — без шумодава разборчивость заметно выше (vc_lab.py);
(2) в записи остались фальстарты; (3) в фразе «кредитка — это деньги банка, а не твои» «а не» не прозвучало.

  python voice_v2.py edit     -> out/rec_v2.wav + out/words_v2.json (вырезы и вставка, время монтажа v1)
  python voice_v2.py vc       -> out/vc2/… куски, по 3 попытки на кусок, лучшая по Whisper medium
  python voice_v2.py build    -> out/voice_final.wav + out/words_final.json + out/joints_final.json
"""
import hashlib, json, os, re, subprocess, sys
import numpy as np, soundfile as sf

DIR = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(DIR, "out"); VC2 = os.path.join(OUT, "vc2")
SRC = os.path.join(OUT, "rec_edited_raw.wav")      # монтаж v1 без шумодава (тайминг = rec_edited.wav)
REC2 = os.path.join(OUT, "rec_v2.wav")
SR = 48000
# время монтажа v1 (out/rec_edited.wav); края подтягиваются к самой тихой точке ±0.15 с
CUTS = [(63.25, 66.55, "дубль «Шанс почти нулевой, зато—»"),
        (76.35, 79.05, "фальстарты «где-то одни… где-то один бань…»"),
        (121.22, 122.42, "обрыв «а на проду—»"),
        (143.00, 143.85, "фальстарт «А вот где…»"),
        (342.75, 345.42, "первый дубль «Вот сколько можно получить прямо сейчас…»")]
# вставки: (куда, откуда_начало, откуда_конец, слова) — «а не» из «…клиентам, а не зарплата»
# «а не» из «…клиентам, а не зарплата» распознаётся как «они» («деньги банка, они твои» — смысл наоборот!).
# Перебор (Whisper medium + small): чисто читается только «не» из «ты не впариваешь» -> «деньги банка, не твои».
INSERTS = [(395.13, 237.85, 238.05, ["не"], .14, .03)]
# Фальстарты, найденные уже после VC (время rec_v2, Whisper medium по исходнику): режутся из готового голоса
POST_CUTS = [(108.05, 108.97, "«запчасти для коров.» перед «запчасти для тракторов»"),
             (158.96, 161.45, "«За одну покупку от 500 до…» перед дублем"),
             (290.72, 292.55, "«рекомендуй только то, что сам» перед дублем"),
             (389.93, 391.12, "«И проверь ск…» перед «и проверь, сколько стоит»")]
# Фразы, которые VC смазал: переделываем отдельно (время rec_v2 по Whisper medium; края подтягиваются к тишине)
PATCH_SPANS = [(73.28, 77.6, "Где-то один балл равен рублю, а где-то… только в"), (80.76, 84.38, "И у баллов бывает срок жизни…"),
               (142.62, 144.8, "Уровень B. Приветственные бонусы"), (164.48, 166.50, "Звучит как подарок, но есть три подвоха"),
               (185.51, 189.09, "Перед оформлением прочитать правила…"), (282.61, 286.09, "Второе — это доход, а значит налог…"),
               (286.37, 289.57, "С выплат от компании налог 6%…"), (306.56, 308.96, "Я обещал способ…"),
               (309.11, 312.47, "Иногда в личку пишут…"), (319.47, 322.39, "За передачу карты третьим лицам…"),
               (322.43, 325.81, "До трёх лет лишения свободы…"), (331.97, 334.77, "Допустим, тебе 18…"),
               (334.99, 337.99, "Вот сколько можно получить…"), (338.57, 340.83, "Альфа-Банк. Кредитная карта. Плюс 1000 рублей"),
               (347.11, 348.87, "Две покупки, каждая от 500 рублей"), (365.31, 373.68, "Если расставить их по тир-листу…"),
               (373.75, 377.12, "В A — Уралсиб…")]
PATCH_ATTEMPTS = [(1.0, 0), (.85, 0), (1.0, 1), (.85, 1), (.75, 0), (.9, 2)]
# попытки: (замедление входа VC, seed). vc_lab: без шумодава лучше всегда; замедление ×0.85 помогает быстрым фразам,
# но портит часть других — поэтому пробуем оба и берём самую разборчивую (Whisper medium против исходника)
ATTEMPTS = [(1.0, 0), (.85, 0), (1.0, 1), (.85, 1)]
EXTRA_ATTEMPTS = [(.9, 2), (1.0, 2), (.85, 3), (1.0, 3)]   # второй проход для кусков < 0.85 (python voice_v2.py vc2)
GOOD = 0.95


def rms_db(a, i0, i1):
    s = a[max(0, i0):max(0, i1)]
    return 20 * np.log10(np.sqrt((s ** 2).mean()) + 1e-7) if len(s) else -120


def snap(a, t, r=.15):
    w = int(SR * .02); best = (1e9, t)
    for k in range(int((t - r) * 100), int((t + r) * 100) + 1):
        i = int(k / 100 * SR); v = rms_db(a, i - w // 2, i + w // 2)
        if v < best[0]: best = (v, k / 100)
    return best[1]


def edit():
    a, sr = sf.read(SRC); assert sr == SR
    ops = [("cut", snap(a, x), snap(a, y), why) for x, y, why in CUTS]
    ops += [("ins", at, s0, s1, ws, g1, g2) for at, s0, s1, ws, g1, g2 in INSERTS]
    ops.sort(key=lambda o: o[1])
    fade = int(SR * .012)
    def piece(x, y):
        p = a[int(x * SR):int(y * SR)].copy()
        if len(p) > 2 * fade: p[:fade] *= np.linspace(0, 1, fade); p[-fade:] *= np.linspace(1, 0, fade)
        return p
    out, cur, mp = [], 0.0, []      # mp: (v1_начало, v1_конец, v2_начало) — карта времени
    pos = 0.0
    for o in ops:
        if o[0] == "cut":
            _, x, y, why = o
            out.append(piece(cur, x)); mp.append((cur, x, pos)); pos += x - cur; cur = y
            print(f"вырез {x:7.2f}–{y:7.2f}: {why}")
        else:
            _, at, s0, s1, ws, g1, g2 = o
            out.append(piece(cur, at)); mp.append((cur, at, pos)); pos += at - cur; cur = at
            ins = piece(s0, s1)
            out += [np.zeros(int(SR * g1)), ins, np.zeros(int(SR * g2))]; mp.append(("ins", ws, pos + g1, s1 - s0))
            pos += int(SR * g1) / SR + len(ins) / SR + int(SR * g2) / SR
            print(f"вставка «{' '.join(ws)}» в {at:.2f} из {s0:.2f}–{s1:.2f}")
    dur = len(a) / SR
    out.append(piece(cur, dur)); mp.append((cur, dur, pos)); pos += dur - cur
    sf.write(REC2, np.concatenate(out), SR)
    words = json.load(open(os.path.join(OUT, "words.json")))["words"]
    w2 = []
    for m in mp:
        if m[0] == "ins":
            _, ws, p0, ln = m
            w2 += [{"w": w, "a": round(p0 + k * ln / len(ws), 3), "d": round(ln / len(ws), 3)} for k, w in enumerate(ws)]
            continue
        x, y, p0 = m
        w2 += [{**w, "a": round(p0 + w["a"] - x, 3)} for w in words if x - .02 <= w["a"] < y]
    w2.sort(key=lambda w: w["a"])
    json.dump({"duration": round(pos, 3), "map": mp, "words": w2}, open(os.path.join(OUT, "words_v2.json"), "w"), ensure_ascii=False, indent=0)
    print(f"монтаж v2: {pos:.1f} с, слов {len(w2)}")


def pieces(path):
    err = subprocess.run(["ffmpeg", "-i", path, "-af", "silencedetect=n=-40dB:d=0.2", "-f", "null", "-"], capture_output=True, text=True).stderr
    st = [float(x) for x in re.findall(r"silence_start: ([0-9.]+)", err)]
    en = [float(x) for x in re.findall(r"silence_end: ([0-9.]+)", err)]
    dur = sf.info(path).duration
    segs, a = [], 0.0
    for c in [(x + y) / 2 for x, y in zip(st, en)] + [dur]:
        if c - a >= 3.0 or c >= dur - .01:
            segs.append([round(a, 3), round(min(c, dur), 3)]); a = c
    if len(segs) > 1 and segs[-1][1] - segs[-1][0] < 1.0:
        segs[-2][1] = segs[-1][1]; segs.pop()
    return segs, dur


def vc(attempts=None, only=None):
    attempts = attempts or ATTEMPTS
    sys.path.insert(0, "/home/user/123/reels/zero-card-07")
    import voice as V, torch, torchaudio
    from chatterbox.vc import ChatterboxVC
    os.makedirs(VC2, exist_ok=True)
    model = ChatterboxVC.from_pretrained("cpu"); model.set_target_voice(V.VC_TARGET)
    segs, dur = pieces(REC2)
    meta_p = os.path.join(VC2, "pieces.json")
    meta = json.load(open(meta_p)) if os.path.exists(meta_p) else {}
    if meta.get("segs") != segs:   # куски сдвинулись (правка монтажа): оставляем результаты кусков с тем же [x, y]
        keep = {str(i): r for i, (x, y) in enumerate(segs) for r in meta.get("res", {}).values() if abs(r["x"] - x) < .06 and abs(r["y"] - y) < .06}
        meta = {"segs": segs, "dur": dur, "res": keep, "patches": meta.get("patches", {})}
    a, _ = sf.read(REC2)
    PAD = .3
    for i, (x, y) in enumerate(segs):
        key = hashlib.md5(f"{x},{y}".encode()).hexdigest()[:8]
        r = meta["res"].get(str(i))
        if only is not None and i not in only: continue
        if only is None and r and r.get("key") == key and r["best"]["sim"] >= (GOOD if attempts is ATTEMPTS else .85): continue
        xa, ya = max(0.0, x - PAD), min(dur, y + PAD)
        src = os.path.join(VC2, f"src_{i:03d}.wav"); sf.write(src, a[int(xa * SR):int(ya * SR)], SR)
        ref16 = os.path.join(VC2, f"ref_{i:03d}.wav")
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", REC2, "-ss", f"{x:.3f}", "-to", f"{y:.3f}", "-ac", "1", "-ar", "16000", ref16], check=True)
        want = r["want"] if r and r.get("key") == key else " ".join(w["w"] for w in V.transcribe(ref16, "medium"))
        tries = r["tries"] if r and r.get("key") == key else []
        for tempo, seed in attempts:
            tag = f"t{int(tempo * 100)}s{seed}"
            if any(t["tag"] == tag for t in tries): continue
            if tries and max(t["sim"] for t in tries) >= (.97 if only else GOOD): break
            vin = src
            if tempo != 1.0:
                vin = src[:-4] + f".t{int(tempo * 100)}.wav"; subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", src, "-af", f"atempo={tempo}", vin], check=True)
            raw = os.path.join(VC2, f"vc_{i:03d}_{tag}.wav")
            torch.manual_seed(seed); torchaudio.save(raw, model.generate(audio=vin), model.sr)
            if tempo != 1.0:
                f2 = raw[:-4] + ".fast.wav"; subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", raw, "-af", f"atempo={1 / tempo:.5f}", f2], check=True)
                subprocess.run(["mv", f2, raw], check=True)
            crop = raw[:-4] + ".crop.wav"
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", raw, "-ss", f"{x - xa:.3f}", "-t", f"{y - x:.3f}", "-ac", "1", "-ar", str(SR), crop], check=True)
            got = V.transcribe(crop, "medium")
            sim = V.similarity(want, got) if want.strip() else 1.0
            tries.append({"tag": tag, "sim": round(sim, 3), "got": " ".join(w["w"] for w in got)})
            print(f"кусок {i:3d}/{len(segs)} {x:6.1f}–{y:6.1f} {tag}: {sim:.2f}  {tries[-1]['got'][:70]}", flush=True)
        best = max(tries, key=lambda t: t["sim"])
        meta["res"][str(i)] = {**(r or {}), "key": key, "x": x, "y": y, "want": want, "tries": tries, "best": best}
        meta["res"][str(i)].pop("plan", None)
        json.dump(meta, open(meta_p, "w"), ensure_ascii=False, indent=0)
    sims = [r["best"]["sim"] for r in meta["res"].values()]
    print(f"VC готово: кусков {len(segs)}, средняя {np.mean(sims):.3f}, ниже {GOOD}: {sum(s < GOOD for s in sims)}, ниже 0.85: {sum(s < .85 for s in sims)}", flush=True)


def composite(limit=.97):
    """Для кусков ниже limit: внутри куска по паузам исходника выбираем для каждой фразы самую разборчивую
    из уже сделанных попыток (все попытки на одном таймлайне) -> res[i]["plan"] = [[от, до, tag], ...]."""
    sys.path.insert(0, "/home/user/123/reels/zero-card-07")
    import voice as V
    meta_p = os.path.join(VC2, "pieces.json"); meta = json.load(open(meta_p))
    norm = lambda w: re.sub(r"[^а-яa-z0-9]", "", w.lower().replace("ё", "е"))
    sim = lambda a, b: __import__("difflib").SequenceMatcher(None, " ".join(norm(x["w"]) for x in a), " ".join(norm(x["w"]) for x in b), autojunk=False).ratio() if a else 1.0
    for i, r in meta["res"].items():
        if r["best"]["sim"] >= limit or len(r["tries"]) < 2 or "plan" in r: continue
        x, y = r["x"], r["y"]
        ref = os.path.join(VC2, f"ref_{int(i):03d}.wav")
        src_w = V.transcribe(ref, "medium")
        err = subprocess.run(["ffmpeg", "-i", ref, "-af", "silencedetect=n=-38dB:d=0.12", "-f", "null", "-"], capture_output=True, text=True).stderr
        st = [float(v) for v in re.findall(r"silence_start: ([0-9.]+)", err)]; en = [float(v) for v in re.findall(r"silence_end: ([0-9.]+)", err)]
        cuts = [0.0] + [(a + b) / 2 for a, b in zip(st, en) if .4 < (a + b) / 2 < y - x - .4] + [y - x]
        tw = {}
        for t in r["tries"]:
            tw[t["tag"]] = V.transcribe(os.path.join(VC2, f"vc_{int(i):03d}_{t['tag']}.crop.wav"), "medium")
        plan, tot = [], []
        for a, b in zip(cuts, cuts[1:]):
            want = [w for w in src_w if a - .05 <= w["a"] < b - .05]
            sc = {tag: sim(want, [w for w in ws if a - .15 <= w["a"] < b - .05]) for tag, ws in tw.items()}
            best = max(sc, key=lambda k: (sc[k], k == r["best"]["tag"]))
            if plan and plan[-1][2] == best: plan[-1][1] = round(b, 3)
            else: plan.append([round(a, 3), round(b, 3), best])
            tot.append((sc[best], b - a))
        r["plan"] = plan
        json.dump(meta, open(meta_p, "w"), ensure_ascii=False, indent=0)   # сохраняем по куску: переживает перезапуск
        est = sum(s_ * d for s_, d in tot) / sum(d for _, d in tot)
        print(f"кусок {i}: было {r['best']['sim']:.2f}, фраз {len(cuts) - 1}, план {[(p[0], p[1], p[2]) for p in plan]}, по фразам ~{est:.2f}", flush=True)
    json.dump(meta, open(meta_p, "w"), ensure_ascii=False, indent=0)


def patch():
    """Переделка смазанных фраз по отдельности: несколько попыток, берём лучшую, но только если она
    разборчивее того, что уже стоит в voice_vc2.wav на этом месте."""
    sys.path.insert(0, "/home/user/123/reels/zero-card-07")
    import voice as V, torch, torchaudio
    from chatterbox.vc import ChatterboxVC
    model = ChatterboxVC.from_pretrained("cpu"); model.set_target_voice(V.VC_TARGET)
    a, _ = sf.read(REC2); cur, _ = sf.read(os.path.join(OUT, "voice_vc2.wav"))
    meta_p = os.path.join(VC2, "pieces.json"); meta = json.load(open(meta_p)); meta.setdefault("patches", {})
    PD = os.path.join(VC2, "patch"); os.makedirs(PD, exist_ok=True)
    tmp16 = os.path.join(PD, "_16.wav")
    def tr(arr):
        sf.write(os.path.join(PD, "_48.wav"), arr, SR)
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", os.path.join(PD, "_48.wav"), "-ar", "16000", "-ac", "1", tmp16], check=True)
        return V.transcribe(tmp16, "medium")
    for x0, x1, why in PATCH_SPANS:
        x, y = snap(a, x0 - .05, .2), snap(a, x1 + .05, .2)
        key = f"{x:.2f}-{y:.2f}"
        if key in meta["patches"]: continue
        want = " ".join(w["w"] for w in tr(a[int(x * SR):int(y * SR)]))
        base = V.similarity(want, tr(cur[int(x * SR):int(y * SR)]))
        xa, ya = max(0, x - .3), y + .3
        src = os.path.join(PD, f"src_{key}.wav"); sf.write(src, a[int(xa * SR):int(ya * SR)], SR)
        best = (base, None)
        for tempo, seed in PATCH_ATTEMPTS:
            vin = src
            if tempo != 1.0:
                vin = src[:-4] + f".t{int(tempo * 100)}.wav"; subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", src, "-af", f"atempo={tempo}", vin], check=True)
            raw = os.path.join(PD, f"vc_{key}_t{int(tempo * 100)}s{seed}.wav")
            torch.manual_seed(seed); torchaudio.save(raw, model.generate(audio=vin), model.sr)
            r48 = raw[:-4] + ".48.wav"
            af = ["-af", f"atempo={1 / tempo:.5f}"] if tempo != 1.0 else []
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", raw, *af, "-ar", str(SR), "-ac", "1", r48], check=True)
            p, _ = sf.read(r48); off = int(round((x - xa) * SR)); seg = p[off:off + int((y - x) * SR)]
            sim = V.similarity(want, tr(seg))
            print(f"  {why[:40]:40s} {key} t{int(tempo * 100)}s{seed}: {sim:.2f} (было {base:.2f})", flush=True)
            if sim > best[0]: best = (sim, r48)
            if sim >= .97: break
        meta["patches"][key] = {"x": x, "y": y, "why": why, "want": want, "base": round(base, 3), "sim": round(best[0], 3), "file": best[1]}
        print(f"фраза «{why}»: было {base:.2f} -> {best[0]:.2f}{'' if best[1] else ' (оставляем как было)'}", flush=True)
        json.dump(meta, open(meta_p, "w"), ensure_ascii=False, indent=0)


def piece_audio(i, r, X, n):
    """Аудио куска (48 кГц) на отрезке [x - X, y + X] из лучшей попытки или по плану фраз."""
    def load(tag):
        f = os.path.join(VC2, f"vc_{i:03d}_{tag}.wav"); a, rsr = sf.read(f)
        if rsr != SR:
            tmp = os.path.join(VC2, "_rs.wav"); subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", f, "-ar", str(SR), tmp], check=True); a, _ = sf.read(tmp)
        return a
    x = r["x"]; off = int(round((x - max(0.0, x - .3)) * SR)) - X
    plan = r.get("plan") or [[0.0, r["y"] - x, r["best"]["tag"]]]
    out = np.zeros(n); F = int(SR * .015)
    for k, (a, b, tag) in enumerate(plan):
        src = load(tag)[max(0, off):]; src = np.pad(src, (0, max(0, n - len(src))))[:n]
        i0 = 0 if k == 0 else X + int(a * SR) - F; i1 = n if k == len(plan) - 1 else X + int(b * SR) + F
        w = np.zeros(n); w[i0:i1] = 1
        if k > 0: w[i0:i0 + 2 * F] = np.linspace(0, 1, 2 * F)
        if k < len(plan) - 1: w[i1 - 2 * F:i1] = np.linspace(1, 0, 2 * F)
        out += src * w
    return out


def build():
    meta = json.load(open(os.path.join(VC2, "pieces.json")))
    segs, dur = meta["segs"], meta["dur"]
    N = int(round(dur * SR)); out = np.zeros(N + SR)
    X = int(SR * .02)   # перекрытие ±20 мс с линейным кроссфейдом
    for i, (x, y) in enumerate(segs):
        i0 = int(round(x * SR)); i1 = int(round(y * SR))
        a0, a1 = max(0, i0 - X), min(N, i1 + X)
        p = piece_audio(i, meta["res"][str(i)], i0 - a0, a1 - a0)
        w = np.ones(len(p))
        if i > 0: w[:2 * X] = np.linspace(0, 1, 2 * X)
        if i < len(segs) - 1: w[-2 * X:] = np.linspace(1, 0, 2 * X)
        out[a0:a1] += p * w
    out = out[:N]
    vcf = os.path.join(OUT, "voice_vc2.wav"); sf.write(vcf, out, SR)
    F = int(SR * .02)
    for pt in meta.get("patches", {}).values():   # заплатки фраз (кроссфейд 20 мс по краям, края — в паузах)
        if not pt.get("file"): continue
        p, _ = sf.read(pt["file"]); xa = max(0, pt["x"] - .3); off = int(round((pt["x"] - xa) * SR))
        i0, i1 = int(pt["x"] * SR), int(pt["y"] * SR); seg = p[off - F:off - F + (i1 - i0) + 2 * F]
        seg = np.pad(seg, (0, (i1 - i0) + 2 * F - len(seg)))
        w = np.ones(len(seg)); w[:2 * F] = np.linspace(0, 1, 2 * F); w[-2 * F:] = np.linspace(1, 0, 2 * F)
        out[i0 - F:i1 + F] = out[i0 - F:i1 + F] * (1 - w) + seg * w
    # сжатие длинных пауз (как tighten.py: ищем по исходнику v2, режем середину в VC)
    a, _ = sf.read(REC2); win = int(SR * .05)
    db = np.array([rms_db(a, k, k + win) for k in range(0, len(a) - win, win)])
    med = np.array([np.median(db[max(0, k - 3):k + 4]) for k in range(len(db))])
    gaps, k0 = [], None
    for k, v in enumerate(list(med) + [0]):
        if v < -42 and k0 is None: k0 = k
        if v >= -42 and k0 is not None:
            if (k - k0) * .05 > .8: gaps.append((k0 * .05, k * .05))
            k0 = None
    cuts = sorted([(gx + .225, gy - .225) for gx, gy in gaps] + [(snap(a, cx), snap(a, cy)) for cx, cy, _ in POST_CUTS])
    merged = []
    for cx, cy in cuts:
        if merged and cx <= merged[-1][1]: merged[-1][1] = max(merged[-1][1], cy)
        else: merged.append([cx, cy])
    keep, cur = [], 0.0
    for cx, cy in merged:
        keep.append([cur, cx]); cur = cy
    keep.append([cur, dur])
    fade = int(SR * .01); parts = []
    for x, y in keep:
        p = out[int(x * SR):int(y * SR)].copy()
        if len(p) > 2 * fade: p[:fade] *= np.linspace(0, 1, fade); p[-fade:] *= np.linspace(1, 0, fade)
        parts.append(p)
    fin = np.concatenate(parts)
    for f in ("voice_final.wav", "words_final.json"):
        bak = os.path.join(OUT, f.replace(".", "_v1.", 1))
        if os.path.exists(os.path.join(OUT, f)) and not os.path.exists(bak): os.rename(os.path.join(OUT, f), bak)
    sf.write(os.path.join(OUT, "voice_final.wav"), fin, SR, subtype="PCM_16")

    def remap(t):
        off = 0.0
        for x, y in keep:
            if t < x: return off
            if t < y: return off + t - x
            off += y - x
        return off
    # слова — из распознавания самого монтажа v2 (Whisper medium по кускам, out/words_v2m.json): старое распознавание
    # исходника склеивало дубли (терялось «Шанс почти нулевой»); если его нет — из words_v2.json
    wm = os.path.join(OUT, "words_v2m.json")
    w2 = json.load(open(wm)) if os.path.exists(wm) else json.load(open(os.path.join(OUT, "words_v2.json")))["words"]
    ws = [{**w, "a": round(remap(w["a"]), 3)} for w in w2]
    total = sum(y - x for x, y in keep)
    json.dump({"duration": round(total, 2), "tighten": keep, "words": ws}, open(os.path.join(OUT, "words_final.json"), "w"), ensure_ascii=False, indent=0)
    joints = sorted([round(remap(y), 3) for x, y in segs[:-1]] + [round(sum(b - a for a, b in keep[:k + 1]), 3) for k in range(len(keep) - 1)])
    json.dump(joints, open(os.path.join(OUT, "joints_final.json"), "w"))
    print(f"голос v2: {dur:.1f} с -> {total:.1f} с (пауз сжато {len(gaps)}), стыков {len(joints)}")


if __name__ == "__main__":
    {"edit": edit, "vc": vc, "vc2": lambda: vc(ATTEMPTS + EXTRA_ATTEMPTS), "composite": composite, "build": build, "patch": patch,
     "more": lambda: vc(ATTEMPTS + EXTRA_ATTEMPTS + [(.8, 4), (.9, 4)], only={int(v) for v in sys.argv[2].split(",")})}[sys.argv[1]]()
