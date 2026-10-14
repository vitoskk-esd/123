#!/usr/bin/env python3
"""Голос Арбузова — вариант 7 «Живой сочный» (владелец 13.10: «Голос номер 7»).
Цепочка на каждую фразу: Yandex LiveTTS «sergey» (живая интонация) → Chatterbox VC в тембр out/v1_sochny.wav
(denis +2 полутона, make_voices.sh) → проверка Whisper по словам. VC иногда смазывает слова («Орбузов», «Поднали») —
тогда новый дубль TTS с другим темпом (1.0 → 0.95 → 1.05 → 0.9, atempo — LiveTTS не принимает speed), лучший по совпадению. Склейка с паузами, −16 LUFS,
слова с временами — words.json (для рта персонажа и монтажа).
  <python venv с chatterbox и faster-whisper> arbuzov_voice.py phrases.txt out_dir
"""
import difflib, json, os, re, subprocess, sys, time
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, "/home/user/123/tools"); import tts_yandex as Y
TARGET = os.path.join(HERE, "out/v1_sochny.wav")
SPEEDS = (None, .95, 1.05, .9)
# ударения там, где синтезатор ошибается (как в роликах №4–5, ya_live.py)
FIX = {"кэшбэк": "кэшб+эк", "кэшбэка": "кэшб+эка", "кэшбэком": "кэшб+эком", "кэшбэке": "кэшб+эке", "Арбузов": "Арб+узов", "Арбузова": "Арб+узова",
       "договор": "догов+ор", "договора": "догов+ора", "начал": "н+ачал", "звонит": "звон+ит", "вычет": "в+ычет", "вычета": "в+ычета"}
def fix(t): return re.sub(r"[А-Яа-яЁё]+", lambda m: FIX.get(m.group(), m.group()), t)


NUMW = ("ноль", "один", "одна", "одну", "два", "двух", "две", "три", "трех", "четыр", "пять", "пяти", "шест", "семь", "семи", "восем", "девят", "десят",
        "двадц", "тридц", "сорок", "пятьд", "шестьд", "сто", "двест", "тысяч", "милли", "полто", "полов", "проце")
def norm(s):   # слова по основе (5 букв); числа выкидываем с обеих сторон — Whisper пишет их цифрами
    ws = [w[:5] for w in re.sub(r"[^а-я0-9 ]", " ", s.lower().replace("ё", "е")).split() if w]
    return [w for w in ws if not (w.isdigit() or any(w.startswith(n[:5]) for n in NUMW))]


def main(src, out):
    os.makedirs(out, exist_ok=True)
    import torchaudio
    from chatterbox.vc import ChatterboxVC
    from faster_whisper import WhisperModel
    vc = ChatterboxVC.from_pretrained("cpu"); vc.set_target_voice(TARGET)
    asr = WhisperModel("medium", device="cpu", compute_type="int8")
    P = [l.strip() for l in open(src) if l.strip()]
    meta_f = os.path.join(out, "phrases.json"); meta = json.load(open(meta_f)) if os.path.exists(meta_f) else {}
    for i, text in enumerate(P):
        m = meta.get(str(i))
        if m and m["text"] == text and os.path.exists(m["wav"]): continue
        best = None
        for k, sp in enumerate(SPEEDS):
            raw, wav = f"{out}/p{i:03d}_{k}_tts.wav", f"{out}/p{i:03d}_{k}.wav"
            for att in range(6):   # сервис синтеза иногда отвечает 502 — повторяем с паузой
                try: Y.synth(fix(text), raw, voice="sergey", stressed=True); break   # LiveTTS не принимает speed — темп меняем после синтеза
                except Exception as e:
                    if att == 5: raise
                    print(f"{i}: синтез — {e}, повтор через {5 * (att + 1)} с", flush=True); time.sleep(5 * (att + 1))
            if sp: subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", raw, "-af", f"atempo={sp}", raw + ".t.wav"], check=True); os.replace(raw + ".t.wav", raw)
            torchaudio.save(wav, vc.generate(audio=raw), vc.sr)
            segs, _ = asr.transcribe(wav, language="ru", beam_size=5, word_timestamps=True)
            words = [dict(w=w.word.strip(), s=round(w.start, 3), e=round(w.end, 3)) for s in segs for w in s.words]
            sim = difflib.SequenceMatcher(None, norm(text), norm(" ".join(x["w"] for x in words))).ratio()
            print(f"{i} дубль {k} ({sp or 1.0}): {sim:.2f} | {' '.join(x['w'] for x in words)}", flush=True)
            if not best or sim > best["sim"]: best = dict(text=text, wav=wav, sim=round(sim, 3), words=words)
            if sim >= .97: break
        meta[str(i)] = best; json.dump(meta, open(meta_f, "w"), ensure_ascii=False, indent=1)
    # склейка: 0,35 с между фразами; слова — со сдвигом на начало фразы
    ins, flt, allw, t = [], [], [], 0.0
    for i in range(len(P)):
        m = meta[str(i)]; ins += ["-i", m["wav"]]
        dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", m["wav"]], capture_output=True, text=True).stdout)
        allw += [dict(w=x["w"], s=round(x["s"] + t, 3), e=round(x["e"] + t, 3), p=i) for x in m["words"]]
        gap = .35 if i < len(P) - 1 else .2
        flt.append(f"[{i}:a]aresample=48000,aformat=channel_layouts=mono,apad=pad_dur={gap}[a{i}]"); t += dur + gap
    flt.append("".join(f"[a{i}]" for i in range(len(P))) + f"concat=n={len(P)}:v=0:a=1,highpass=f=70,loudnorm=I=-16:TP=-1.5[o]")
    subprocess.run(["ffmpeg", "-v", "error", "-y", *ins, "-filter_complex", ";".join(flt), "-map", "[o]", "-ar", "48000", f"{out}/voice.wav"], check=True)
    json.dump(allw, open(f"{out}/words.json", "w"), ensure_ascii=False, indent=0)
    weak = [f"{k}: {v['sim']} {v['text']}" for k, v in meta.items() if v["sim"] < .97]
    print("фраз:", len(P), "слабых:", len(weak), *weak, sep="\n")


if __name__ == "__main__":
    main(*sys.argv[1:3])
