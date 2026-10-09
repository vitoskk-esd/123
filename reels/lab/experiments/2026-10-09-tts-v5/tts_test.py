#!/usr/bin/env python3
"""Проба: голос «вариант 5» без записи владельца — Chatterbox Multilingual TTS (MIT), образец — voice_target_v5.wav.
Каждая фраза синтезируется отдельно (несколько попыток), лучшая по разборчивости (Whisper medium против текста)."""
import os, sys, json, time, torch, torchaudio
sys.path.insert(0, "/home/user/123/reels/zero-card-07")
import voice as V
from chatterbox.mtl_tts import ChatterboxMultilingualTTS
D = os.path.dirname(os.path.abspath(__file__)); os.makedirs(os.path.join(D, "out"), exist_ok=True)
PHR = ["Если бы мне снова было восемнадцать и на карте было ноль рублей, я бы начал с этих трёх шагов.",
       "И банки платили бы мне, а не наоборот.",
       "Шаг первый: дебетовая карта с бонусом за первые покупки."]
t0 = time.time(); m = ChatterboxMultilingualTTS.from_pretrained(device="cpu"); print("модель", round(time.time() - t0), "с", flush=True)
res = []
for i, p in enumerate(PHR):
    best = None
    for seed in (0, 1):
        torch.manual_seed(seed); t = time.time()
        wav = m.generate(p, language_id="ru", audio_prompt_path=V.VC_TARGET, exaggeration=.5, cfg_weight=.5)
        f = os.path.join(D, "out", f"p{i}_s{seed}.wav"); torchaudio.save(f, wav, m.sr)
        f16 = f[:-4] + ".16.wav"; os.system(f"ffmpeg -v error -y -i {f} -ar 16000 -ac 1 {f16}")
        got = V.transcribe(f16, "medium"); sim = V.similarity(p, got)
        print(f"фраза {i} seed {seed}: {sim:.2f} за {time.time() - t:.0f} с — {' '.join(w['w'] for w in got)}", flush=True)
        if not best or sim > best[0]: best = (sim, f)
    res.append({"text": p, "sim": best[0], "file": best[1]})
json.dump(res, open(os.path.join(D, "out", "res.json"), "w"), ensure_ascii=False, indent=1)
os.system("ffmpeg -v error -y " + " ".join(f"-i {r['file']}" for r in res) + f" -filter_complex \"{''.join(f'[{k}]' for k in range(len(res)))}concat=n={len(res)}:v=0:a=1\" {os.path.join(D, 'tts_sample.wav')}")
