#!/usr/bin/env python3
"""Озвучка рекламы Альфа-Карты синтезом (владелец 11.10: «запиши этот ролик с помощью ИИ»; до этого — «с хорошей дикцией и
правильным произношением всех слов»). Главное — разборчивость: синтез Chatterbox по образцу живой речи БЕЗ перекраски тембра
(перекраска VC «жуёт» стыки слов, рилс #12), ударения RUAccent + поправки ниже, на каждую фразу 4 дубля → Whisper medium,
берётся самый точный; фраза ставится на свою сцену (тайминги — voiceover.md) и при нужде ускоряется, чтобы уложиться.
  <python с chatterbox> ads/alfa-01/voice_ad.py  → ads/alfa-01/out/vo/voice.wav, затем alfa_main_vo.mp4 (голос + музыка, −14 LUFS)
"""
import json, os, subprocess, sys
sys.path.insert(0, "/home/user/123/tools"); sys.path.insert(0, "/home/user/123/reels/zero-card-07")
import tts_v5 as T, voice_e as E

HERE = os.path.dirname(os.path.abspath(__file__)); OUT = os.path.join(HERE, "out/vo"); os.makedirs(OUT, exist_ok=True)
# «кэшбэ́к» — как во всём канале (tts_v5.STRESS_FIX); остальные — чтобы не зависеть от словаря
T.STRESS_FIX.update({"менеджеру": "м+енеджеру", "пятидесяти": "пят+идесяти", "альфа": "+альфа", "банке": "б+анке", "карта": "к+арта",
                     "обслуживание": "обсл+уживание", "оформи": "оф+орми", "бесплатно": "беспл+атно", "категориях": "катег+ориях"})
# (текст, начало слота, конец слота) — сцены ролика 15 с
PH = [("Лучшие условия — в Альфа-Банке!", .15, 2.3),
      ("Альфа-Карта: обслуживание — ноль рублей.", 2.55, 5.3),
      ("Кэшбэк до пятидесяти процентов у партнёров банка.", 5.55, 8.5),
      ("Кэшбэк в категориях — выбираешь сам.", 8.75, 11.3),
      ("Оформляй бесплатно — напиши менеджеру!", 11.6, 14.6)]
PARAMS = dict(exaggeration=.6, cfg_weight=.45, temperature=.8)
dur = lambda f: float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f], capture_output=True, text=True).stdout)

res = []
for i, (text, a, b) in enumerate(PH):
    print(i, "ударения:", T.stress(text), flush=True)
    best = None
    for s in (3, 7, 13, 21):
        f = os.path.join(OUT, f"p{i}_s{s}.wav")
        if not os.path.exists(f): T.synth(text, f, seed=s, ref=E.ref(), **PARAMS)
        f = E.trim(f, log=lambda x: None)
        sim, heard = E.check(f, text)
        print(f"{i} seed {s}: {sim:.3f} {dur(f):.2f} с — {heard}", flush=True)
        key = (round(sim, 2), -dur(f))                      # точнее — лучше; при равной точности — короче (живее темп)
        if best is None or key > best[0]: best = (key, f, sim, heard)
        if sim >= .999 and dur(f) <= (b - a) * 1.15: break
    res.append(dict(text=text, a=a, b=b, file=best[1], sim=best[2], heard=best[3], d=dur(best[1])))
json.dump(res, open(os.path.join(OUT, "pick.json"), "w"), ensure_ascii=False, indent=1)

# сборка дорожки: каждая фраза — на свою сцену; длиннее слота — ускоряем (не больше ×1,3), голос — чистка и компрессия
inputs, filt = [], []
for k, r in enumerate(res):
    tempo = min(1.3, max(1.0, r["d"] / (r["b"] - r["a"])))
    inputs += ["-i", r["file"]]
    filt.append(f"[{k}:a]aresample=48000,atempo={tempo:.3f},adelay={int(r['a'] * 1000)}|{int(r['a'] * 1000)}[v{k}]")
    print(f"{k}: {r['d']:.2f} с в слот {r['b'] - r['a']:.2f} с → темп {tempo:.2f} · {r['sim']:.3f} «{r['heard']}»")
filt.append("".join(f"[v{k}]" for k in range(len(res))) + f"amix=inputs={len(res)}:normalize=0,highpass=f=80,equalizer=f=3500:t=q:w=1.4:g=3,acompressor=threshold=-18dB:ratio=3:attack=5:release=80,apad,atrim=0:15[vo]")
voice = os.path.join(OUT, "voice.wav")
subprocess.run(["ffmpeg", "-y", "-v", "error", *inputs, "-filter_complex", ";".join(filt), "-map", "[vo]", "-ac", "1", voice], check=True)
# сведение: музыка приседает под голос, итог −14 LUFS
dst = os.path.join(HERE, "alfa_main_vo.mp4")
subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", os.path.join(HERE, "out/v_main.mp4"), "-i", voice, "-i", os.path.join(HERE, "out/music.wav"), "-filter_complex",
                "[1:a]loudnorm=I=-14:TP=-1.5,aresample=48000,asplit=2[v][sc];[2:a]aresample=48000,volume=0.45[m];"
                "[m][sc]sidechaincompress=threshold=0.03:ratio=6:attack=15:release=300[md];[md][v]amix=inputs=2:duration=first:normalize=0,loudnorm=I=-14:TP=-1.5[a]",
                "-map", "0:v", "-map", "[a]", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart", dst], check=True)
print("готово:", dst)
