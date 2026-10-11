#!/usr/bin/env python3
"""Озвучка рекламы v3 (владелец 11.10: «звук стал максимально плохим, слышны обрывки… сразу видно, что ИИ; звук должен быть ровным
и чётким, как одно предложение; ты повысил тембр — похож на робота; сделай естественным, человеческим, мужским, лет 34»).
Что изменилось против v2: весь текст — ОДНИМ дублем (интонация течёт, нет склеек фраз); никакого сдвига высоты (rubberband давал
«робота»), никакого гейта (срезал концы слов — «обрывки»); образец — сухой мужской голос «вариант 5»; обработка — только мягкая:
срез низа, немного тепла, лёгкий компрессор, де-эссер. 4 дубля → Whisper medium по всему тексту → лучший.
  <python с chatterbox> ads/alfa-01/voice_ad3.py → ads/alfa-01/alfa_main_vo.mp4
"""
import os, subprocess, sys
sys.path.insert(0, "/home/user/123/tools"); sys.path.insert(0, "/home/user/123/reels/zero-card-07")
import tts_v5 as T, voice_e as E, voice as V

HERE = os.path.dirname(os.path.abspath(__file__)); OUT = os.path.join(HERE, "out/vo3"); os.makedirs(OUT, exist_ok=True)
TEXT = ("Лучшие условия — в Альфа-Банке! Альфа-Карта: обслуживание — ноль рублей. Кэшбэк до пятидесяти процентов у партнёров банка. "
        "Кэшбэк в категориях — выбираешь сам. Оформляй бесплатно — напиши менеджеру!")
SAY = TEXT.replace("менеджеру", "мэнэджэру")          # синтезу — как звучит (иначе «менеджёру»); проверка — по обычному тексту
T.STRESS_FIX.update({"мэнэджэру": "м+энэджэру", "пятидесяти": "пят+идесяти", "альфа": "+альфа", "банке": "б+анке", "карта": "к+арта",
                     "обслуживание": "обсл+уживание", "бесплатно": "беспл+атно", "категориях": "катег+ориях"})
PARAMS = dict(exaggeration=.5, cfg_weight=.5, temperature=.75)
dur = lambda f: float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f], capture_output=True, text=True).stdout)

print("ударения:", T.stress(SAY), flush=True)
best = None
for s in (5, 11, 17, 29):
    f = os.path.join(OUT, f"full_s{s}.wav")
    if not os.path.exists(f): T.synth(SAY, f, seed=s, ref=V.VC_TARGET, **PARAMS)
    f = E.trim(f, log=lambda x: None)
    sim, heard = E.check(f, TEXT); d = dur(f)
    print(f"seed {s}: {sim:.3f} {d:.2f} с — {heard}", flush=True)
    key = (round(sim, 2), -abs(d - 12.8))                 # точнее; при равной точности — ближе к 12,8 с (спокойный темп в 15 с)
    if best is None or key > best[0]: best = (key, f, sim, heard, d)
_, f, sim, heard, d = best
tempo = max(1.0, min(1.08, d / 14.4))
print(f"ВЫБРАН {os.path.basename(f)}: {sim:.3f}, {d:.2f} с, темп {tempo:.3f} — {heard}", flush=True)
voice = os.path.join(OUT, "voice.wav")
subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", f, "-af",
                f"aresample=48000,atempo={tempo:.3f},adelay=250|250,highpass=f=70,equalizer=f=150:t=q:w=1:g=2,equalizer=f=3000:t=q:w=1.5:g=1.5,"
                "deesser=i=0.3,acompressor=threshold=-20dB:ratio=2:attack=10:release=150,apad,atrim=0:15", "-ac", "1", voice], check=True)
dst = os.path.join(HERE, "alfa_main_vo.mp4")
subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", os.path.join(HERE, "out/v_main.mp4"), "-i", voice, "-i", os.path.join(HERE, "out/music.wav"), "-filter_complex",
                "[1:a]loudnorm=I=-14:TP=-1.5,aresample=48000,asplit=2[v][sc];[2:a]aresample=48000,volume=0.4[m];"
                "[m][sc]sidechaincompress=threshold=0.03:ratio=5:attack=20:release=400[md];[md][v]amix=inputs=2:duration=first:normalize=0,loudnorm=I=-14:TP=-1.5[a]",
                "-map", "0:v", "-map", "[a]", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart", dst], check=True)
print("готово:", dst)
