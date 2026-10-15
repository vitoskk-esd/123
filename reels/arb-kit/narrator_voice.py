#!/usr/bin/env python3
"""Голос рассказчика рилсов от 3-го лица — №2 «denis» (Yandex LiveTTS), владелец 15.10: «голос номер 2, но доделай, чтобы был с интонацией».
Интонация: phrases_marked.txt — те же фразы с разметкой Яндекса (**ударное слово**, sil<[мс]> паузы, «!»), ударения «+».
На каждую фразу 3 дубля (LiveTTS каждый раз читает по-разному); из дублей, где Whisper услышал текст точно (≥ .97, иначе проскакивает «плати карты»), берём
самый живой — с наибольшим диапазоном тона (pyin, 5–95 %, в полутонах). Выход как у arbuzov_voice.py: out/voice/voice.wav, words.json, phrases.json.
  <python с faster-whisper и librosa> arb-kit/narrator_voice.py <папка рилса>
"""
import difflib, json, os, re, subprocess, sys, time
sys.path.insert(0, "/home/user/123/tools"); import tts_yandex as Y
sys.path.insert(0, "/home/user/123/youtube/characters/voice"); from arbuzov_voice import norm
TAKES, VOICE = 3, "denis"


def main(reel):
    out = f"{reel}/out/voice"; os.makedirs(out, exist_ok=True)
    import librosa, numpy as np
    from faster_whisper import WhisperModel
    asr = WhisperModel("medium", device="cpu", compute_type="int8")
    P = [l.strip() for l in open(f"{reel}/phrases.txt", encoding="utf-8") if l.strip()]
    M = [l.strip() for l in open(f"{reel}/phrases_marked.txt", encoding="utf-8") if l.strip()]
    assert len(P) == len(M), "phrases.txt и phrases_marked.txt — разное число фраз"
    meta_f = f"{out}/phrases.json"; meta = json.load(open(meta_f)) if os.path.exists(meta_f) else {}
    for i, (text, marked) in enumerate(zip(P, M)):
        m = meta.get(str(i))
        if m and m["text"] == text and m.get("marked") == marked and os.path.exists(m["wav"]): continue
        takes = []
        for k in range(TAKES):
            raw, wav = f"{out}/p{i:03d}_{k}_raw.wav", f"{out}/p{i:03d}_{k}.wav"
            for att in range(6):
                try: Y.synth(marked, raw, voice=VOICE, stressed=True); break
                except Exception as e:
                    if att == 5: raise
                    print(f"{i}: синтез — {e}, повтор", flush=True); time.sleep(5 * (att + 1))
            # тишину по краям срезаем, 48 кГц моно
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", raw, "-af", "silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse",
                            "-ar", "48000", "-ac", "1", wav], check=True)
            segs, _ = asr.transcribe(wav, language="ru", beam_size=5, word_timestamps=True)
            words = [dict(w=w.word.strip(), s=round(w.start, 3), e=round(w.end, 3)) for s in segs for w in s.words]
            sim = difflib.SequenceMatcher(None, norm(text), norm(" ".join(x["w"] for x in words))).ratio()
            y, sr = librosa.load(wav, sr=16000); f0, v, _ = librosa.pyin(y, fmin=60, fmax=400, sr=sr); f0 = f0[v]
            st = 12 * np.log2(f0 / np.median(f0)); rng = float(np.percentile(st, 95) - np.percentile(st, 5))
            print(f"{i} дубль {k}: точность {sim:.2f}, тон {rng:.1f} пт | {' '.join(x['w'] for x in words)}", flush=True)
            takes.append(dict(text=text, marked=marked, wav=wav, sim=round(sim, 3), range=round(rng, 1), words=words))
        good = [t for t in takes if t["sim"] >= .97] or sorted(takes, key=lambda t: -t["sim"])[:1]
        meta[str(i)] = max(good, key=lambda t: t["range"]); json.dump(meta, open(meta_f, "w"), ensure_ascii=False, indent=1)
    ins, flt, allw, t = [], [], [], 0.0
    for i in range(len(P)):
        m = meta[str(i)]; ins += ["-i", m["wav"]]
        dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", m["wav"]], capture_output=True, text=True).stdout)
        allw += [dict(w=x["w"], s=round(x["s"] + t, 3), e=round(x["e"] + t, 3), p=i) for x in m["words"]]
        gap = .35 if i < len(P) - 1 else .2
        flt.append(f"[{i}:a]aformat=channel_layouts=mono,apad=pad_dur={gap}[a{i}]"); t += dur + gap
    flt.append("".join(f"[a{i}]" for i in range(len(P))) + f"concat=n={len(P)}:v=0:a=1,highpass=f=70,loudnorm=I=-16:TP=-1.5[o]")
    subprocess.run(["ffmpeg", "-v", "error", "-y", *ins, "-filter_complex", ";".join(flt), "-map", "[o]", "-ar", "48000", f"{out}/voice.wav"], check=True)
    json.dump(allw, open(f"{out}/words.json", "w"), ensure_ascii=False, indent=0)
    print(f"готово: {t:.1f} с, слабых фраз: {sum(1 for v in meta.values() if v['sim'] < .9)}")


if __name__ == "__main__":
    main(os.path.abspath(sys.argv[1]))
