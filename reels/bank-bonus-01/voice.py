#!/usr/bin/env python3
"""Озвучка ролика нейроголосом (edge-tts) и пересчёт timeline.js под реальную речь.

python3 voice.py  ->  out/voice.wav  +  перезаписанный timeline.js

Каждая фраза синтезируется отдельно (с кэшем в out/tts/), обрезается по краям
и склеивается с короткими паузами, так что темп задаём мы, а не синтезатор.
Тайминги слов берутся из WordBoundary-событий edge-tts: по ним строятся
сцены, субтитры и звуковые акценты.
"""
import array
import asyncio
import hashlib
import json
import os
import ssl
import subprocess

import edge_tts

DIR = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(DIR, "out")
TTS = os.path.join(OUT, "tts")
SR = 48000
VOICE = "ru-RU-DmitryNeural"
RATE = "+18%"      # живой разговорный темп
LEAD = 0.18        # сцена появляется чуть раньше первого слова
TAIL = 1.5         # хвост после последней фразы под стрелку и фейд

# Сценарий: сцены -> фразы. Фраза = (текст для синтеза, пауза после неё, подача).
# Подача — (rate, pitch) поверх базовой; None = базовая.
SCRIPT = [
    [("Стоп!", 0.28, ("-6%", "+2Hz")),
     ("Банки прямо сейчас раздают деньги,", 0.0, None)],
    [("и почти никто их не забирает.", 0.26, ("+0%", "-2Hz"))],
    [("Новому клиенту по приглашению банк платит бонус.", 0.14, None),
     ("Просто за карту и первую покупку.", 0.26, None)],
    [("Это не кредит и не розыгрыш.", 0.12, None),
     ("Это рекламный бюджет банка, и он может достаться тебе.", 0.28, None)],
    [("А теперь честно:", 0.08, None),
     ("ты платишь за обслуживание?", 0.12, None),
     ("Кэшбэк один процент?", 0.34, None)],
    [("Значит, ты кормишь банк, который тебе не платит ничего.", 0.32, ("-8%", "-4Hz"))],
    [("Я собрал в телеграме все актуальные бонусы: какой банк, сколько платит и какие условия.", 0.28, ("+4%", "+0Hz"))],
    [("Ссылка в профиле.", 0.14, ("-4%", "+0Hz")),
     ("Забирай, пока акции не закончились.", 0.0, None)],
]

# edge-tts сам выбирает certifi; в этом окружении TLS идёт через прокси со своим CA.
_ca = os.environ.get("SSL_CERT_FILE") or ("/root/.ccr/ca-bundle.crt" if os.path.exists("/root/.ccr/ca-bundle.crt") else None)
if _ca:
    edge_tts.communicate._SSL_CTX = ssl.create_default_context(cafile=_ca)


async def synth(text, rate, pitch):
    key = hashlib.sha1(f"{VOICE}|{rate}|{pitch}|{text}".encode()).hexdigest()[:12]
    mp3, meta = os.path.join(TTS, key + ".mp3"), os.path.join(TTS, key + ".json")
    if not os.path.exists(meta):
        com = edge_tts.Communicate(text, VOICE, rate=rate, pitch=pitch, boundary="WordBoundary",
                                   proxy=os.environ.get("HTTPS_PROXY"))
        words, audio = [], bytearray()
        async for ch in com.stream():
            if ch["type"] == "audio":
                audio += ch["data"]
            elif ch["type"] == "WordBoundary":
                words.append({"w": ch["text"], "a": ch["offset"] / 1e7, "d": ch["duration"] / 1e7})
        with open(mp3, "wb") as f:
            f.write(audio)
        with open(meta, "w") as f:
            json.dump(words, f, ensure_ascii=False)
    pcm = subprocess.run(["ffmpeg", "-v", "error", "-i", mp3, "-ac", "1", "-ar", str(SR), "-f", "s16le", "-"],
                         check=True, capture_output=True).stdout
    with open(meta) as f:
        return array.array("h", pcm), json.load(f)


def trim(pcm, words):
    """Обрезка тишины: начало — по первому слову, конец — по реальной энергии сигнала."""
    a = max(0, int((words[0]["a"] - 0.03) * SR))
    last = int((words[-1]["a"]) * SR)
    win, thr = int(0.01 * SR), 500  # ~ -36 dBFS
    b = last
    for i in range(last, len(pcm) - win, win):
        if max(abs(x) for x in pcm[i:i + win]) > thr:
            b = i + win
    # тихий хвост вопросительной интонации энергия может не поймать — не режем раньше конца слова
    b = max(b, int((words[-1]["a"] + words[-1]["d"]) * SR))
    b = min(len(pcm), b + int(0.04 * SR))
    return pcm[a:b], a / SR


async def main():
    os.makedirs(TTS, exist_ok=True)
    out, t, lines = array.array("h"), 0.0, []
    for scene in SCRIPT:
        words, text = [], []
        for phrase, gap, style in scene:
            rate, pitch = style or (RATE, "+0Hz")
            if style:
                rate = f"{int(RATE[:-1]) + int(rate[:-1]):+d}%"
            pcm, ws = await synth(phrase, rate, pitch)
            pcm, off = trim(pcm, ws)
            # слова фразы в тексте субтитров, с пунктуацией; время — из WordBoundary
            toks = phrase.split()
            assert len(toks) == len(ws), (phrase, [w["w"] for w in ws])
            words += [{"w": tok, "a": round(t + w["a"] - off, 3)} for tok, w in zip(toks, ws)]
            text.append(phrase)
            out.extend(pcm)
            t += len(pcm) / SR
            out.extend(array.array("h", bytes(int(gap * SR) * 2)))
            t += int(gap * SR) / SR
        lines.append({"text": " ".join(text), "words": words})

    # сцены: старт чуть раньше первого слова, конец = старт следующей
    for i, l in enumerate(lines):
        l["start"] = 0.0 if i == 0 else round(l["words"][0]["a"] - LEAD, 2)
    duration = round(t + TAIL, 1)
    for i, l in enumerate(lines):
        l["end"] = lines[i + 1]["start"] if i + 1 < len(lines) else duration

    with open(os.path.join(OUT, "voice.wav"), "wb") as f:
        import wave
        w = wave.open(f, "wb")
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes(out.tobytes())
        w.close()

    write_timeline(lines, duration)
    print(f"voice {t:.2f}s, ролик {duration}s")
    for l in lines:
        print(f"  {l['start']:6.2f}–{l['end']:6.2f}  {l['text']}")


def write_timeline(lines, duration):
    rows = []
    for l in lines:
        ws = ", ".join(f'{{ w: {json.dumps(w["w"], ensure_ascii=False)}, a: {w["a"]} }}' for w in l["words"])
        rows.append(f'    {{ start: {l["start"]}, end: {l["end"]}, text: {json.dumps(l["text"], ensure_ascii=False)},\n'
                    f'      words: [{ws}] }},')
    js = TEMPLATE.replace("%DURATION%", str(duration)).replace("%LINES%", "\n".join(rows))
    with open(os.path.join(DIR, "timeline.js"), "w") as f:
        f.write(js)


TEMPLATE = """// Общий таймлайн ролика: сцены, субтитры (текст озвучки) и звуковые события.
// Используется и в reel.html (картинка), и в audio.js (музыка + SFX).
// СГЕНЕРИРОВАН voice.py по реальной озвучке — правьте сценарий там, а не здесь.
const TIMELINE = {
  duration: %DURATION%,
  fps: 30,
  // Каждая реплика = одна сцена. start/end в секундах, words[].a — момент, когда слово звучит.
  lines: [
%LINES%
  ],
};
// Время слова: W(сцена, "слово") — по первому совпадению без учёта регистра и пунктуации.
TIMELINE.W = (i, key) => {
  const norm = s => s.toLowerCase().replace(/[^а-яёa-z0-9]/g, "");
  const w = TIMELINE.lines[i].words.find(x => norm(x.w) === norm(key));
  if (!w) throw new Error(`нет слова «${key}» в сцене ${i}`);
  return w.a;
};
TIMELINE.S = i => TIMELINE.lines[i].start;
TIMELINE.E = i => TIMELINE.lines[i].end;
{
  const { W, S } = TIMELINE;
  // Звуковые акценты (секунды) — привязаны к словам и сценам
  TIMELINE.sfx = {
    impact: [0.0, W(0, "Банки"), S(5), S(7)],
    whoosh: [S(1), S(2), S(3), S(4), S(6)],
    coin: [W(0, "Банки") + .15, W(0, "раздают") + .1, W(0, "деньги") + .05, W(2, "бонус") + .05, W(3, "тебе") + .1],
    tick: [0, 1, 2].map(k => S(4) + .6 + k * .35).concat([0, 1, 2, 3].map(k => W(6, "бонусы") + k * .35)),
    riser: [S(7) - 1.4, S(7)], // начало, конец
    breakAt: [S(5), S(5) + .6], // музыка проваливается на фразе-ударе
    musicStart: W(0, "Банки"), // с этого момента вступают барабаны и бас
  };
}
if (typeof module !== "undefined") module.exports = TIMELINE;
"""

if __name__ == "__main__":
    asyncio.run(main())
