#!/usr/bin/env python3
"""Озвучка рекламы v4 — Yandex SpeechKit, голос anton (владелец 12.10: «запускай голос Антона для рекламного ролика про Альфу и ролик номер 3»).
Весь текст одним запросом (владелец 11.10: «ровно и чётко, как одно предложение»), скорость подбирается под 15 с,
обработка мягкая, как v3: срез низа, немного тепла, де-эссер, лёгкий компрессор; сведение с музыкой −14 LUFS.
  <python с ruaccent> ads/alfa-01/voice_ad_ya.py → ads/alfa-01/alfa_main_vo.mp4
"""
import os, subprocess, sys
sys.path.insert(0, "/home/user/123/tools")
import tts_v5 as T, tts_yandex as Y

HERE = os.path.dirname(os.path.abspath(__file__)); OUT = os.path.join(HERE, "out/vo_ya"); os.makedirs(OUT, exist_ok=True)
TEXT = ("Лучшие условия — в Альфа-Банке! Альфа-Карта: обслуживание — ноль рублей. Кэшбэк до пятидесяти процентов у партнёров банка. "
        "Кэшбэк в категориях — выбираешь сам. Оформляй бесплатно — напиши менеджеру!")
T.STRESS_FIX.update({"менеджеру": "м+енеджеру", "пятидесяти": "пят+идесяти", "альфа": "+альфа", "банке": "б+анке", "карта": "к+арта",
                     "обслуживание": "обсл+уживание", "бесплатно": "беспл+атно", "категориях": "катег+ориях", "оформляй": "оформл+яй"})
dur = lambda f: float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f], capture_output=True, text=True).stdout)
# v4.1 (владелец 12.10: «поставь правильно ударения, чтобы было с интонацией»): текст размечен вручную — «+» перед ударной
# гласной, **акцент** на ключевых словах, заглавные в начале фраз
said = ("**Л+учшие** усл+овия — в +Альфа-Б+анке! +Альфа-К+арта: обсл+уживание — **ноль** рубл+ей. "     # ≤ 250 знаков — лимит одного запроса,
        "Кэшб+эк — до **пят+идесяти** проц+ентов у партн+ёров б+анка. Кэшб+эк в катег+ориях — выбир+аешь **сам**. "   # паузы дают точки и тире
        "Оформл+яй **беспл+атно** — напиш+и м+энэджэру!")   # вариант №2 владельца (12.10)
print("разметка:", said, flush=True)
f, sp = os.path.join(OUT, "full.wav"), 1.0
for _ in range(4):                                   # 13,6–14,4 с: спокойно, но укладывается в 15 с с запасом на начало
    Y.synth(said, f, speed=sp, stressed=True); d = dur(f); print(f"скорость {sp:.2f}: {d:.2f} с", flush=True)
    if 13.2 <= d <= 14.4: break
    sp = round(sp * d / 13.8, 2)
voice = os.path.join(OUT, "voice.wav")
subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", f, "-af",
                "aresample=48000,adelay=250|250,highpass=f=70,equalizer=f=150:t=q:w=1:g=1.5,deesser=i=0.3,"
                "acompressor=threshold=-20dB:ratio=2:attack=10:release=150,apad,atrim=0:15", "-ac", "1", voice], check=True)
dst = os.path.join(HERE, "alfa_main_vo.mp4")
subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", os.path.join(HERE, "out/v_main.mp4"), "-i", voice, "-i", os.path.join(HERE, "out/music.wav"), "-filter_complex",
                "[1:a]loudnorm=I=-14:TP=-1.5,aresample=48000,asplit=2[v][sc];[2:a]aresample=48000,volume=0.4[m];"
                "[m][sc]sidechaincompress=threshold=0.03:ratio=5:attack=20:release=400[md];[md][v]amix=inputs=2:duration=first:normalize=0,loudnorm=I=-14:TP=-1.5[a]",
                "-map", "0:v", "-map", "[a]", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart", dst], check=True)
print("готово:", dst)
