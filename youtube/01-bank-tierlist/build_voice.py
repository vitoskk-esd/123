"""Ролик №1: монтаж записи владельца -> out/rec_edited.wav + out/words.json (слова с таймингами монтажа).

Порядок: чистка (гул, шум) -> вырезаем повторные дубли и недочитанный кусок (CUTS, секунды исходника,
каждый край подтягивается к самой тихой точке рядом) -> длинные паузы сжимаем -> склейка с микрофейдами.
Тайминги слов не распознаём заново: пересчитываем из распознавания исходника по карте склеек.

  python build_voice.py            -> монтаж и слова
  python build_voice.py --vc       -> + замена тембра «вариант 5» по фразам (долго, в фоне)
"""
import array, json, math, os, subprocess, sys, wave

DIR = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(DIR, "out")
REC = os.path.join(DIR, "rec", "my_voice_full.m4a")
SR = 48000

# Что вырезаем (секунды исходной записи). Края уточняются по тишине (snap).
CUTS = [  # (начало, конец, что вырезано[, радиус подтяжки к тишине])
    (10.45, 20.30, "первый дубль «Большинство видео про бонусы… мелким шр-»"),
    (115.45, 118.90, "два фальстарта «Уровень C. Кэшбэк по…»"),
    (221.4, 247.45, "ловушка с ИП прочитана наполовину + первый дубль «А какие банки…»"),
    (262.62, 270.55, "первый дубль «У большинства крупных банков…»"),
    (294.95, 300.85, "два обрыва «Честно… / честно объяснять другу условия, что делать, в…»"),
    (314.50, 322.80, "пауза с шумом + фальстарт «Уровень S.»"),
    (333.48, 340.30, "первый дубль «Люди приходят… банк платит тебе»"),
    (367.44, 368.63, "повтор «проще всего,»", 0.03),
    (452.25, 456.20, "первый дубль «Итого… за несколько»"),
]
END = None          # конец ролика — по последнему слову (см. ниже)
PAUSE_MAX = 0.70    # паузы длиннее — сжимаем до PAUSE_TO
PAUSE_TO = 0.42


def run(*a):
    subprocess.run(a, check=True)


def load(path):
    with wave.open(path) as w:
        return array.array("h", w.readframes(w.getnframes()))


def energy(pcm, win):
    """Пик (дБ) в окнах по win отсчётов."""
    out = []
    for i in range(0, len(pcm), win):
        m = max((abs(x) for x in pcm[i:i + win]), default=0)
        out.append(20 * math.log10(max(m, 1) / 32768))
    return out


def main():
    os.makedirs(OUT, exist_ok=True)
    clean = os.path.join(OUT, "rec_clean_full.wav")
    run("ffmpeg", "-v", "error", "-y", "-i", REC, "-af", "highpass=f=70,afftdn=nf=-25", "-ac", "1", "-ar", str(SR), clean)
    pcm = load(clean)
    dur = len(pcm) / SR
    W = int(SR * .01)                      # окно 10 мс
    E = energy(pcm, W)
    quiet = lambda t: E[min(len(E) - 1, max(0, int(t * 100)))]

    def snap(t, r=0.25):
        """Самая тихая точка в ±r от t (среднее по 30 мс)."""
        best = None
        for k in range(int((t - r) * 100), int((t + r) * 100) + 1):
            if 1 <= k < len(E) - 1:
                v = (E[k - 1] + E[k] + E[k + 1]) / 3
                if best is None or v < best[0]:
                    best = (v, k / 100)
        return best[1]

    # распознавание кусками по ≤ 25 с (yt1_chunks.py): длинное «склеивало» дубли; галлюцинации на тишине — долой
    words = [w for w in json.load(open(os.path.join(OUT, "transcript_chunks.json")))["words"]
             if w["w"] not in ("Корректор", ".Кулакова") and not (w["w"] == "оформлением" and w["a"] > 221)]
    # кусок 237–255 с распознался одной фразой на оба дубля — тайминги второго берём из длинного распознавания
    long_ = json.load(open(os.path.join(OUT, "transcript.json")))["novad"]
    words = [w for w in words if not 247.4 < w["a"] < 255.0] + [w for w in long_ if 247.4 < w["a"] < 255.0]
    # Длинное распознавание «склеило» три попытки фразы в одну — слова последней берём из
    # отдельного распознавания этого куска (out/snip_c.wav, начало 296.5 с)
    words = [w for w in words if not 294.9 < w["a"] < 302.7] + [
        {"w": w, "a": a, "d": d} for w, a, d in [("честно", 300.95, .22), ("объяснять", 301.18, .38), ("другу", 301.58, .36),
                                                 ("условия,", 301.96, .48), ("что", 302.46, .2), ("сделать,", 302.68, .36)]]
    words.sort(key=lambda w: w["a"])
    last = words[-1]
    end = END or min(dur, last["a"] + last["d"] + 0.6)

    # 1) вырезы дублей
    keep, a = [], 0.0
    for x, y, why, *r in CUTS:
        xs, ys = snap(x, *r), snap(y, *r)
        keep.append([a, xs]); a = ys
        print(f"вырез {xs:7.2f}–{ys:7.2f} ({ys - xs:4.1f} с): {why}")
    keep.append([a, end])
    # 2) сжатие пауз: тишина (пик < −42 дБ) длиннее PAUSE_MAX внутри оставленных кусков
    sil, k0 = [], None
    for k, v in enumerate(E + [0]):
        if v < -42 and k0 is None: k0 = k
        if v >= -42 and k0 is not None:
            if (k - k0) / 100 > PAUSE_MAX: sil.append((k0 / 100, k / 100))
            k0 = None
    segs = []
    for x, y in keep:
        cur = x
        for s0, s1 in sil:
            if s0 >= x and s1 <= y and s0 > cur:
                mid = (s0 + s1) / 2
                segs.append([cur, mid - PAUSE_TO / 2]); cur = mid + PAUSE_TO / 2
        segs.append([cur, y])
    segs = [[round(x, 3), round(y, 3)] for x, y in segs if y - x > 0.05]
    # 3) склейка с микрофейдами
    fade = .012
    parts = "".join(f"[0:a]atrim={x}:{y},asetpts=PTS-STARTPTS,afade=t=in:d={fade},afade=t=out:st={y - x - fade:.3f}:d={fade}[p{i}];"
                    for i, (x, y) in enumerate(segs))
    edited = os.path.join(OUT, "rec_edited.wav")
    run("ffmpeg", "-v", "error", "-y", "-i", clean, "-filter_complex",
        parts + "".join(f"[p{i}]" for i in range(len(segs))) + f"concat=n={len(segs)}:v=0:a=1,apad=pad_dur=0.6,loudnorm=I=-18:TP=-2[o]",
        "-map", "[o]", "-ac", "1", "-ar", str(SR), edited)
    # 4) карта времени: слово из оставленного куска -> время в монтаже
    off, mapped = 0.0, []
    for x, y in segs:
        for w in words:
            if x - 0.02 <= w["a"] < y:
                mapped.append({"w": w["w"], "a": round(off + w["a"] - x, 3), "d": round(w["d"], 3), "src": round(w["a"], 2)})
        off += y - x
    json.dump({"segments": segs, "duration": round(off, 2), "words": mapped}, open(os.path.join(OUT, "words.json"), "w"), ensure_ascii=False, indent=0)
    json.dump({"keep": segs, "note": [c[2] for c in CUTS]}, open(os.path.join(DIR, "rec_edit.json"), "w"), ensure_ascii=False, indent=1)
    print(f"исходник {dur:.1f} с -> монтаж {off:.1f} с, кусков {len(segs)}, слов {len(mapped)} из {len(words)}")

    if "--vc" in sys.argv:
        sys.path.insert(0, "/home/user/123/reels/zero-card-07")
        import voice as V
        V.OUT = OUT
        V.VC_TRIES = int(os.environ.get("VC_TRIES", "2"))
        V.vc_by_phrases(edited, os.path.join(OUT, "voice_vc.wav"), mapped)
        print("VC_DONE", flush=True)


if __name__ == "__main__":
    main()
