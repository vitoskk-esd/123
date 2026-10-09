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
  Переозвучить фразу: поставить "redo": true у неё в phrases.json (или поменять текст); SEEDS=3,7,13 — другие попытки.
"""
import json, os, re, sys, zlib
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "reels", "zero-card-07"))
import tts_v5 as T

SCRATCH = "/tmp/claude-0/-home-user-123/8ca4fbe8-9858-5867-9610-cc1983112730/scratchpad"
REF_LIVE = os.path.join(SCRATCH, "ref_3.0.wav")
REF_V5 = os.path.join(os.path.dirname(os.path.abspath(__file__)), "voice_e_ref_v5.wav")
PARAMS = dict(exaggeration=.55, cfg_weight=.4, temperature=.85)       # проба 3, «D»
SEEDS, MIN_SIM = (2, 5, 11, 17, 23), .96
NUM = {"0": "ноль", "1": "первый", "2": "второй", "3": "третий",     # «Шаг 1» — так Whisper пишет «Шаг первый»
       "5": "пять", "10": "десять", "15": "пятнадцать", "18": "восемнадцать",
       "20": "двадцать", "30": "тридцать", "50": "пятьдесят", "100": "сто"}


def ref():
    return REF_LIVE if os.path.exists(REF_LIVE) else REF_V5


def check(wav, text):
    import voice as V
    f16 = wav[:-4] + ".16.wav"
    os.system(f"ffmpeg -v error -y -i {wav} -ar 16000 -ac 1 {f16}")
    got = V.transcribe(f16, "medium")
    heard = " ".join(w["w"] for w in got)
    # Whisper пишет числа цифрами («18», «50 %») — переводим в слова, иначе чистый дубль получает 0,74
    said = re.sub(r"\d+", lambda m: NUM.get(m.group(), m.group()), heard.replace("%", " процентов"))
    said = re.sub(r"телеграмм", "телеграм", said, flags=re.I)                # Whisper пишет с двумя «м»
    # по словам, а не по буквам: лишнее «в» или «нуля» вместо «нуле» по буквам почти не заметно (0,98), по словам — 0,93
    a = [re.sub(r"[^а-я0-9]", "", w.lower().replace("ё", "е")) for w in text.split()]
    b = [re.sub(r"[^а-я0-9]", "", w.lower().replace("ё", "е")) for w in said.split()]
    import difflib
    return difflib.SequenceMatcher(None, [w for w in a if w], [w for w in b if w], autojunk=False).ratio(), heard


def voice_e(phrases, out_dir, log=print):
    """Каждая фраза: дубль TTS → перекраска VC → проверка ИТОГОВОГО звука. Перекраска детерминирована (тот же дубль —
    та же ошибка), поэтому при ошибке после VC берём новый дубль TTS (следующий seed), а не повторяем VC."""
    import torch, torchaudio, voice as V
    from chatterbox.vc import ChatterboxVC
    os.makedirs(out_dir, exist_ok=True)
    mp = os.path.join(out_dir, "phrases.json")
    meta = json.load(open(mp)) if os.path.exists(mp) else {}
    vc = None
    seeds = [int(x) for x in os.environ["SEEDS"].split(",")] if os.environ.get("SEEDS") else SEEDS
    parts, prev = [], None
    for i, p in enumerate(phrases):
        key = f"{i}"
        done = next((m for m in meta.values() if m.get("text") == p and os.path.exists(m.get("e", "")) and not m.get("redo")
                     and m.get("sim_e", 0) >= MIN_SIM), None)
        if done:                                                   # уже готово (по тексту — строки можно вставлять)
            meta[key] = done; parts.append(done["e"]); prev = done["tts"]; continue
        log(f"{i} ударения: {T.stress(p)}")
        if vc is None:
            vc = ChatterboxVC.from_pretrained("cpu"); vc.set_target_voice(V.VC_TARGET)
        best = None
        for s in seeds:
            f = os.path.join(out_dir, f"t{zlib.crc32(p.encode()):08x}_s{s}.wav")
            if not os.path.exists(f): T.synth(p, f, seed=s, ref=ref(), **PARAMS)
            sim, got = check(f, p); log(f"{i} seed {s}: {sim:.2f} — {got}")
            if sim < MIN_SIM - .08 and s != seeds[-1]: continue        # дубль уже кривой — перекрашивать незачем
            e = os.path.join(out_dir, f"e{i}_{zlib.crc32(f.encode()):08x}.wav"); torch.manual_seed(0)
            src, pre = f, 0.0
            if prev and torchaudio.info(f).num_frames / torchaudio.info(f).sample_rate < 4.0:
                # короткую фразу VC превращает в кашу («От прахи до друбок»): даём контекст — предыдущая фраза + 0,25 с
                # тишины, после перекраски отрезаем её (VC сохраняет тайминг)
                x, sr = torchaudio.load(prev); y, sr2 = torchaudio.load(f); assert sr == sr2
                pre = (x.shape[1] + int(.25 * sr)) / sr
                src = os.path.join(out_dir, f"ctx{i}.wav"); torchaudio.save(src, torch.cat([x, torch.zeros(1, int(.25 * sr)), y], 1), sr)
            out = vc.generate(audio=src)
            torchaudio.save(e, out[:, int((pre - .05) * vc.sr) if pre else 0:], vc.sr)
            se, ge = check(e, p); log(f"{i} E seed {s}: {se:.2f} — {ge}")
            if best is None or se > best["sim_e"]:
                best = {"text": p, "tts": f, "sim": round(sim, 3), "heard": got, "e": e, "sim_e": round(se, 3), "heard_e": ge}
            if se >= MIN_SIM: break
        meta[key] = best; parts.append(best["e"]); prev = best["tts"]
        json.dump(meta, open(mp, "w"), ensure_ascii=False, indent=1)
    json.dump(meta, open(mp, "w"), ensure_ascii=False, indent=1)
    weak = [f"{k}: {m['heard_e']}" for k, m in meta.items() if m.get("sim_e", 1) < MIN_SIM and "heard_e" in m]
    if weak: log("СЛАБЫЕ после всех попыток — проверить на слух:\n  " + "\n  ".join(weak))
    return T.humanize(parts, os.path.join(out_dir, "voice.wav"))


if __name__ == "__main__":
    ph = [l.strip() for l in open(sys.argv[1], encoding="utf-8") if l.strip()]
    print(voice_e(ph, sys.argv[2], log=lambda s: print(s, flush=True)))
