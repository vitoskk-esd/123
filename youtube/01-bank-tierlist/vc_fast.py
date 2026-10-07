"""Быстрая замена тембра «вариант 5» для длинного ролика.

Проход 1 (vc): режем out/rec_edited.wav по паузам на куски ≥ 3 с, каждый — один прогон VC (seed 0)
с запасом 0.3 с по краям, кладём на прежнее место -> out/voice_vc.wav. Без распознавания на каждый
прогон (на 7 минутах оно занимало часы). Куски — out/vcp/piece_NNN.wav (+ seed), список — out/vcp/pieces.json.
Проход 2 (check): распознаём каждый кусок VC и исходника (small), сравниваем -> out/vcp/check.json.
Проход 3 (redo N,N,...): для плохих кусков 3 новых seed, берём лучший по разборчивости (medium).
"""
import array, json, os, re, subprocess, sys, time, wave
sys.path.insert(0, "/home/user/123/reels/zero-card-07")
import voice as V

DIR = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(DIR, "out")
VCP = os.path.join(OUT, "vcp")
SRC = os.path.join(OUT, "rec_edited.wav")
DST = os.path.join(OUT, "voice_vc.wav")
SR = V.SR
PAD = 0.3


def pieces():
    err = subprocess.run(["ffmpeg", "-i", SRC, "-af", "silencedetect=n=-40dB:d=0.18", "-f", "null", "-"], capture_output=True, text=True).stderr
    st = [float(x) for x in re.findall(r"silence_start: ([0-9.]+)", err)]
    en = [float(x) for x in re.findall(r"silence_end: ([0-9.]+)", err)]
    dur = len(V.load_pcm(SRC)) / SR
    segs, a = [], 0.0
    for c in [(x + y) / 2 for x, y in zip(st, en)] + [dur]:
        if c - a >= 3.0 or c >= dur - .01:
            segs.append([round(a, 3), round(min(c, dur), 3)]); a = c
    if len(segs) > 1 and segs[-1][1] - segs[-1][0] < 1.0:
        segs[-2][1] = segs[-1][1]; segs.pop()
    return segs, dur


_vc = None


def vc_piece(i, x, y, dur, seed):
    global _vc
    import torch, torchaudio
    if _vc is None:
        from chatterbox.vc import ChatterboxVC
        _vc = ChatterboxVC.from_pretrained("cpu")
    xa, ya = max(0.0, x - PAD), min(dur, y + PAD)
    src = os.path.join(VCP, f"src_{i:03d}.wav")
    if not os.path.exists(src):
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", SRC, "-ss", str(xa), "-to", str(ya), "-ac", "1", "-ar", "24000", src], check=True)
    out = os.path.join(VCP, f"piece_{i:03d}_s{seed}.wav")
    if not os.path.exists(out):
        torch.manual_seed(seed)
        torchaudio.save(out, _vc.generate(audio=src, target_voice_path=V.VC_TARGET), _vc.sr)
    # обрезка ровно до [x, y] в 48 кГц
    crop = out[:-4] + ".crop.wav"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", out, "-ss", f"{x - xa:.3f}", "-t", f"{y - x:.3f}", "-ac", "1", "-ar", str(SR), crop], check=True)
    return crop


def assemble(segs, choice):
    out = array.array("h")
    for i, (x, y) in enumerate(segs):
        p = V.load_pcm(os.path.join(VCP, f"piece_{i:03d}_s{choice.get(str(i), 0)}.crop.wav"))
        n = int(round(y * SR)) - int(round(x * SR))
        p = p[:n] + array.array("h", bytes(max(0, n - len(p)) * 2))
        out.extend(p)
    with wave.open(DST, "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(out.tobytes())


def main():
    os.makedirs(VCP, exist_ok=True)
    mode = sys.argv[1]
    meta_p = os.path.join(VCP, "pieces.json")
    if mode == "vc":
        segs, dur = pieces()
        json.dump({"segs": segs, "dur": dur, "choice": {}}, open(meta_p, "w"))
        t0 = time.time()
        for i, (x, y) in enumerate(segs):
            vc_piece(i, x, y, dur, 0)
            el = time.time() - t0
            print(f"кусок {i + 1}/{len(segs)} {x:6.1f}–{y:6.1f}  прошло {el / 60:4.1f} мин, осталось ~{el / (i + 1) * (len(segs) - i - 1) / 60:4.1f} мин", flush=True)
        assemble(segs, {})
        print("VC_PASS1_DONE", flush=True)
    elif mode == "check":
        m = json.load(open(meta_p)); res = []
        for i, (x, y) in enumerate(m["segs"]):
            s0 = os.path.join(VCP, f"chk_src_{i:03d}.wav")
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", SRC, "-ss", str(x), "-to", str(y), "-ac", "1", "-ar", "16000", s0], check=True)
            want = " ".join(w["w"] for w in V.transcribe(s0, "small"))
            c = m["choice"].get(str(i), 0)
            got = V.transcribe(os.path.join(VCP, f"piece_{i:03d}_s{c}.crop.wav"), "small")
            sim = V.similarity(want, got) if want.strip() else 1.0
            res.append({"i": i, "x": x, "y": y, "sim": round(sim, 3), "want": want, "got": " ".join(w["w"] for w in got)})
            print(f"{i:3d} {x:6.1f}–{y:6.1f} {sim:.2f}", flush=True)
        json.dump(res, open(os.path.join(VCP, "check.json"), "w"), ensure_ascii=False, indent=1)
        bad = [r["i"] for r in res if r["sim"] < 0.85]
        print("ПЛОХИЕ:", ",".join(map(str, bad)), flush=True)
    elif mode == "rescore":  # точная модель (medium, с VAD и без) для подозрительных кусков; правит check.json
        m = json.load(open(meta_p)); chk = json.load(open(os.path.join(VCP, "check.json")))
        for i in map(int, sys.argv[2].split(",")):
            s0 = os.path.join(VCP, f"chk_src_{i:03d}.wav")
            want = " ".join(w["w"] for w in V.transcribe(s0, "medium"))
            crop = os.path.join(VCP, f"piece_{i:03d}_s{m['choice'].get(str(i), 0)}.crop.wav")
            sim = max(V.similarity(want, V.transcribe(crop, "medium", vad=v)) for v in (True, False))
            chk[i].update({"want": want, "sim": round(sim, 3), "medium": True})
            print(f"{i:3d} medium {sim:.2f}", flush=True)
        json.dump(chk, open(os.path.join(VCP, "check.json"), "w"), ensure_ascii=False, indent=1)
        print("ПЛОХИЕ:", ",".join(str(r["i"]) for r in chk if r["sim"] < 0.85), flush=True)
    elif mode == "redo":
        m = json.load(open(meta_p)); chk = {r["i"]: r for r in json.load(open(os.path.join(VCP, "check.json")))}
        for i in map(int, sys.argv[2].split(",")):
            x, y = m["segs"][i]; want = chk[i]["want"]
            best = (chk[i]["sim"], m["choice"].get(str(i), 0))
            for seed in (1, 2, 3):
                crop = vc_piece(i, x, y, m["dur"], seed)
                sim = max(V.similarity(want, V.transcribe(crop, "medium", vad=v)) for v in (True, False))
                print(f"  кусок {i} seed {seed}: {sim:.2f}", flush=True)
                if sim > best[0]: best = (sim, seed)
                if sim >= 0.97: break
            m["choice"][str(i)] = best[1]
            print(f"кусок {i}: seed {best[1]}, {best[0]:.2f}", flush=True)
            json.dump(m, open(meta_p, "w"))
        assemble(m["segs"], m["choice"])
        print("REDO_DONE", flush=True)


if __name__ == "__main__":
    main()
