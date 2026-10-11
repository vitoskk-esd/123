#!/usr/bin/env python3
"""Голос «E»: строгий отбор по разборчивости (рилс #12, владелец 11.10: «слова в звуке не внятные и жуются»).

Что выяснили замером (Whisper base/small — «слабое ухо»: сильная medium угадывает и смазанные слова, поэтому старый отбор
по ней пропускал «жёваные» дубли; доля верных слов по всему тексту рилса #12):
  исходный синтез TTS ........................ 0,972      после перекраски VC (как было) ...... 0,917
  без шумодава и эха в склейке ............... 0,921      ровный темп без разброса ............ 0,930
  темп 0,94 .................................. 0,944
и seed перекраски меняет результат (фраза 3: средняя уверенность по словам 0,934 … 0,953 на seed 0…3).

Поэтому на каждую фразу: два лучших дубля TTS (из уже сделанных voice_e.py, при нехватке — новый seed) × VC_SEEDS перекраски →
срез хвоста → оценка Whisper small (точное совпадение слов × средняя уверенность) → лучший. Склейка — tts_v5.humanize с
fx="clean" (без шумодава и эха «комнаты») и ровным темпом TEMPO (по умолчанию 0,96, чуть медленнее — чётче).

  <python с chatterbox> tools/voice_e_clear.py <рилс>/out/voice     → voice.wav (старый — voice_prev.wav), clear.json
"""
import glob, json, os, re, shutil, subprocess, sys, zlib
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "reels", "zero-card-07"))
import voice_e as E, tts_v5 as T

VC_SEEDS = [int(x) for x in os.environ.get("VC_SEEDS", "0,1,2,3").split(",")]
TEMPO = float(os.environ.get("TEMPO", ".96"))


def main(out_dir):
    import difflib, torch, torchaudio, voice as V
    from chatterbox.vc import ChatterboxVC
    meta = json.load(open(os.path.join(out_dir, "phrases.json")))
    small = V.whisper("small")
    norm = lambda s: [re.sub(r"[^а-я0-9]", "", w.lower().replace("ё", "е")) for w in s.split()]

    def score(wav, text):
        f16 = wav[:-4] + ".s16.wav"; subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", wav, "-ar", "16000", "-ac", "1", f16], check=True)
        segs, _ = small.transcribe(f16, language="ru", beam_size=5, word_timestamps=True)
        ws = [w for s in segs for w in s.words]
        heard = " ".join(w.word.strip() for w in ws)
        said = re.sub(r"телеграмм", "телеграм", heard, flags=re.I)
        sim = difflib.SequenceMatcher(None, [w for w in norm(text) if w], [w for w in norm(said) if w], autojunk=False).ratio()
        prob = sum(w.probability for w in ws) / max(1, len(ws))
        return sim * prob, sim, prob, heard

    vc = ChatterboxVC.from_pretrained("cpu"); vc.set_target_voice(V.VC_TARGET)
    res, parts, prev = {}, [], None
    for k in sorted(meta, key=int):
        text = meta[k]["text"]; crc = f"{zlib.crc32(text.encode()):08x}"
        takes = sorted(glob.glob(os.path.join(out_dir, f"t{crc}_s*.wav")))
        if len(takes) < 2:
            f = os.path.join(out_dir, f"t{crc}_s31.wav")
            if not os.path.exists(f): T.synth(text, f, seed=31, ref=E.ref(), **E.PARAMS)
            takes = sorted(set(takes + [f]))
        tts = sorted(((score(t, text), t) for t in takes), reverse=True)[:2]
        print(f"{k} дубли TTS: " + ", ".join(f"{os.path.basename(t)} {s[0]:.3f}" for s, t in tts), flush=True)
        best = None
        for (_, t) in tts:
            for sd in VC_SEEDS:
                src, pre = t, 0.0
                if prev and torchaudio.info(t).num_frames / torchaudio.info(t).sample_rate < 4.0:   # короткая фраза — с контекстом, как в voice_e
                    x, sr = torchaudio.load(prev); y, _ = torchaudio.load(t); pre = (x.shape[1] + int(.25 * sr)) / sr
                    src = os.path.join(out_dir, f"cctx{k}.wav"); torchaudio.save(src, torch.cat([x, torch.zeros(1, int(.25 * sr)), y], 1), sr)
                torch.manual_seed(sd); out = vc.generate(audio=src)
                e = os.path.join(out_dir, f"c{k}_{zlib.crc32(t.encode()):08x}_v{sd}.wav")
                torchaudio.save(e, out[:, int((pre - .05) * vc.sr) if pre else 0:], vc.sr)
                e = E.trim(e, log=lambda s: None)
                sc = score(e, text)
                print(f"   {os.path.basename(t)} vc{sd}: {sc[0]:.3f} (слова {sc[1]:.2f}, уверенность {sc[2]:.3f}) — {sc[3]}", flush=True)
                if best is None or sc[0] > best[0][0]: best = (sc, e, t)
        sc, e, t = best
        res[k] = {"text": text, "tts": t, "e": e, "score": round(sc[0], 4), "sim": round(sc[1], 3), "prob": round(sc[2], 3), "heard": sc[3],
                  "was": meta[k]["e"]}
        print(f"{k} ВЫБРАН {os.path.basename(e)} {sc[0]:.3f} — {sc[3]}", flush=True)
        parts.append(e); prev = t
        json.dump(res, open(os.path.join(out_dir, "clear.json"), "w"), ensure_ascii=False, indent=1)
    dst = os.path.join(out_dir, "voice.wav")
    if os.path.exists(dst) and not os.path.exists(os.path.join(out_dir, "voice_prev.wav")): shutil.copy(dst, os.path.join(out_dir, "voice_prev.wav"))
    print(T.humanize(parts, dst, breath_db=None, fx="clean", tempo=TEMPO))


if __name__ == "__main__":
    main(sys.argv[1])
