"""Сжатие длинных пауз ПОСЛЕ замены тембра (чтобы не перезапускать её): паузы ищем по чистому
монтажу out/rec_edited.wav (RMS по 50 мс, сглажено медианой 350 мс — щелчки и короткие вдохи
паузу не разрывают), вырезаем середину из ЛЮБОГО файла с тем же таймингом и сдвигаем слова.

  python tighten.py out/voice_vc.wav out/voice_final.wav   -> + out/words_final.json
"""
import array, json, math, os, statistics, subprocess, sys, wave

DIR = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(DIR, "out")
GAP, KEEP, THR = 0.80, 0.45, -42.0
# Дубли, найденные уже после замены тембра (время МОНТАЖА, out/rec_edited.wav) — вырезаются целиком
EXTRA = [(63.25, 66.55, "первый дубль «Шанс почти нулевой, зато—»")]


def gaps(path):
    with wave.open(path) as w:
        sr = w.getframerate(); a = array.array("h", w.readframes(w.getnframes()))
    win = int(sr * .05)
    db = []
    for i in range(0, len(a) - win, win):
        s = a[i:i + win]
        db.append(20 * math.log10(max(1, math.sqrt(sum(x * x for x in s) / win)) / 32768))
    med = [statistics.median(db[max(0, k - 3):k + 4]) for k in range(len(db))]
    out, k0 = [], None
    for k, v in enumerate(med + [0]):
        if v < THR and k0 is None: k0 = k
        if v >= THR and k0 is not None:
            if (k - k0) * .05 > GAP: out.append((k0 * .05, k * .05))
            k0 = None
    return out, len(a) / sr


def main(src, dst):
    gs, dur = gaps(os.path.join(OUT, "rec_edited.wav"))
    # что убрать: середины длинных пауз (от паузы остаётся KEEP) + EXTRA; пересечения сливаем
    cut = sorted([(x + KEEP / 2, y - KEEP / 2) for x, y in gs] + [(a, b) for a, b, _ in EXTRA])
    merged = []
    for a, b in cut:
        if merged and a <= merged[-1][1]: merged[-1][1] = max(merged[-1][1], b)
        else: merged.append([a, b])
    keep, cur = [], 0.0
    for a, b in merged:
        keep.append([cur, a]); cur = b
    keep.append([cur, dur])
    fade = .01
    parts = "".join(f"[0:a]atrim={x:.3f}:{y:.3f},asetpts=PTS-STARTPTS,afade=t=in:d={fade},afade=t=out:st={y - x - fade:.3f}:d={fade}[p{i}];"
                    for i, (x, y) in enumerate(keep))
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", src, "-filter_complex",
                    parts + "".join(f"[p{i}]" for i in range(len(keep))) + f"concat=n={len(keep)}:v=0:a=1[o]",
                    "-map", "[o]", dst], check=True)
    d = json.load(open(os.path.join(OUT, "words.json")))

    def remap(t):  # время монтажа -> время после сжатия; попавшее в вырезанную середину паузы — к стыку
        off = 0.0
        for x, y in keep:
            if t < x: return off
            if t < y: return off + t - x
            off += y - x
        return off
    ws = [{**w, "a": round(remap(w["a"]), 3)} for w in d["words"]]
    off = sum(y - x for x, y in keep)
    json.dump({"duration": round(off, 2), "tighten": keep, "words": ws}, open(os.path.join(OUT, "words_final.json"), "w"), ensure_ascii=False, indent=0)
    print(f"пауз сжато: {len(gs)}, {dur:.1f} с -> {off:.1f} с; слов {len(ws)} из {len(d['words'])}")


if __name__ == "__main__":
    main(*sys.argv[1:3])
