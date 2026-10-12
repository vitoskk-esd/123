#!/usr/bin/env python3
"""Озвучка через Yandex SpeechKit v3 (владелец 12.10.2026: Яндекс вместо локального синтеза, голос №7 — madirus).
Ключ — сетевой секрет окружения «Yandex SpeechKit» (заголовок Authorization: Api-Key …, хост tts.api.cloud.yandex.net):
скрипт ключа не видит, прокси подставляет его сам. Ударения — наш словарь (tts_v5.stress → «+» перед ударной гласной, как у Яндекса).
  python tools/tts_yandex.py "текст" out.wav [voice] [role]
"""
import base64, json, os, re, sys, urllib.request
URL = "https://tts.api.cloud.yandex.net/tts/v3/utteranceSynthesis"
VOICE = os.environ.get("YA_VOICE", "madirus")


def to_plus(text):
    """«кэшбэ́к» (U+0301 после гласной, формат tts_v5.stress) → «кэшб+эк» (формат Яндекса)."""
    return re.sub("([аеёиоуыэюяАЕЁИОУЫЭЮЯ])́", r"+\1", text)


def synth(text, out, voice=VOICE, role=None, speed=None, stressed=False):
    if not stressed:
        sys.path.insert(0, os.path.dirname(os.path.abspath(__file__))); import tts_v5
        text = to_plus(tts_v5.stress(text))
    hints = [{"voice": voice}] + ([{"role": role}] if role else []) + ([{"speed": speed}] if speed else [])
    body = json.dumps({"text": text, "hints": hints, "outputAudioSpec": {"containerAudio": {"containerAudioType": "WAV"}},
                       "loudnessNormalizationType": "LUFS"}).encode()
    raw = urllib.request.urlopen(urllib.request.Request(URL, body, {"Content-Type": "application/json"}), timeout=120).read().decode()
    data = b"".join(base64.b64decode(json.loads(l)["result"]["audioChunk"]["data"]) for l in raw.splitlines() if l.strip())
    open(out, "wb").write(data)
    return text


if __name__ == "__main__":
    print(synth(sys.argv[1], sys.argv[2], *(sys.argv[3:5])))
