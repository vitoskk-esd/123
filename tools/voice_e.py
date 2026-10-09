#!/usr/bin/env python3
"""Голос «E» — стандарт озвучки без записи владельца (выбран владельцем 09.10, проба 3).

Цепочка на каждую фразу:
  1) Chatterbox Multilingual TTS по образцу ЖИВОЙ речи (интонации и подача человека), ударения — tts_v5.stress (RUAccent + STRESS_FIX);
  2) Whisper medium сверяет текст; слабый дубль (< MIN_SIM) — новый seed, лучший из попыток;
  3) Chatterbox VC перекрашивает в тембр «вариант 5» (voice_target_v5.wav);
  4) tts_v5.humanize склеивает фразы «как живую запись» (паузы, вдохи, разброс темпа, микрофон в комнате).

Образец живой речи (REF): 15 с владельца из записи ролика №2 — ТОЛЬКО локально (scratchpad/ref_live.wav), в репозиторий не
попадает. Если его нет (новый контейнер), берётся REF_V5 — тот же фрагмент, уже перекрашенный в «вариант 5»
(tools/voice_e_ref_v5.wav, это голос «варианта 5», а не владельца).

  python3 tools/voice_e.py phrases.txt out_dir        (одна фраза — одна строка) → out_dir/voice.wav, out_dir/phrases.json
"""
import json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "reels", "zero-card-07"))
import tts_v5 as T

SCRATCH = "/tmp/claude-0/-home-user-123/8ca4fbe8-9858-5867-9610-cc1983112730/scratchpad"
REF_LIVE = os.path.join(SCRATCH, "ref_3.0.wav")
REF_V5 = os.path.join(os.path.dirname(os.path.abspath(__file__)), "voice_e_ref_v5.wav")
PARAMS = dict(exaggeration=.55, cfg_weight=.4, temperature=.85)       # проба 3, «D»
SEEDS, MIN_SIM = (2, 5, 11), .88          # Whisper пишет числа цифрами («18») — сходство чуть ниже 1 даже у чистого дубля


def ref():
    return REF_LIVE if os.path.exists(REF_LIVE) else REF_V5


def check(wav, text):
    import voice as V
    f16 = wav[:-4] + ".16.wav"
    os.system(f"ffmpeg -v error -y -i {wav} -ar 16000 -ac 1 {f16}")
    got = V.transcribe(f16, "medium")
    return V.similarity(text, got), " ".join(w["w"] for w in got)


def voice_e(phrases, out_dir, log=print):
    import torch, torchaudio, voice as V
    os.makedirs(out_dir, exist_ok=True)
    meta = json.load(open(os.path.join(out_dir, "phrases.json"))) if os.path.exists(os.path.join(out_dir, "phrases.json")) else {}
    raw = []
    for i, p in enumerate(phrases):
        key = f"{i}"
        if meta.get(key, {}).get("text") == p and os.path.exists(meta[key]["tts"]):
            raw.append(meta[key]["tts"]); continue                 # уже озвучено — не пересобираем
        best = None; log(f"{i} ударения: {T.stress(p)}")
        for s in SEEDS:
            f = os.path.join(out_dir, f"t{i}_s{s}.wav")
            T.synth(p, f, seed=s, ref=ref(), **PARAMS)
            sim, got = check(f, p); log(f"{i} seed {s}: {sim:.2f} — {got}")
            if best is None or sim > best[0]: best = (sim, f, got)
            if sim >= MIN_SIM: break
        meta[key] = {"text": p, "tts": best[1], "sim": round(best[0], 3), "heard": best[2]}
        json.dump(meta, open(os.path.join(out_dir, "phrases.json"), "w"), ensure_ascii=False, indent=1)
        raw.append(best[1])
    from chatterbox.vc import ChatterboxVC
    vc = ChatterboxVC.from_pretrained("cpu"); vc.set_target_voice(V.VC_TARGET)
    parts = []
    for i, f in enumerate(raw):
        e = os.path.join(out_dir, f"e{i}.wav"); torch.manual_seed(0)
        torchaudio.save(e, vc.generate(audio=f), vc.sr); parts.append(e)
        sim, got = check(e, phrases[i]); meta[f"{i}"].update(sim_e=round(sim, 3)); log(f"{i} E: {sim:.2f} — {got}")
    json.dump(meta, open(os.path.join(out_dir, "phrases.json"), "w"), ensure_ascii=False, indent=1)
    return T.humanize(parts, os.path.join(out_dir, "voice.wav"))


if __name__ == "__main__":
    ph = [l.strip() for l in open(sys.argv[1], encoding="utf-8") if l.strip()]
    print(voice_e(ph, sys.argv[2], log=lambda s: print(s, flush=True)))
