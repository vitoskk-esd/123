#!/usr/bin/env python3
"""Пробы базовых голосов SpeechKit для Арбузова (без обработки). Обработка «характера» — make_voices.sh."""
import os, sys
sys.path.insert(0, "/home/user/123/tools"); import tts_yandex as Y
T = "Йоу! Я Арб+узов. Банки любят мелкий шрифт, а я люблю его читать. Сегодня считаем, сколько реально можно забрать с кредитки. Погнали!"
for v, role in [("denis", None), ("sergey", None), ("vasily", None), ("anton", None), ("ermil", "good"), ("zahar", "good"), ("filipp", None), ("kirill", None), ("alexander", None)]:
    f = f"raw/{v}.wav"
    if os.path.exists(f) and os.path.getsize(f) > 1000: continue
    try: Y.synth(T, f, voice=v, role=role, stressed=True); print(v, os.path.getsize(f), flush=True)
    except Exception as e: print(v, "ERR", e, flush=True)
