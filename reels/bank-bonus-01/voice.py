#!/usr/bin/env python3
"""Озвучка ролика и пересчёт timeline.js под реальную речь.

python3 voice.py  ->  out/voice.wav  +  перезаписанный timeline.js

Движок по умолчанию — Chatterbox Multilingual (Resemble AI, MIT): живая,
неровная интонация вместо «дикторской». Тембр берётся из референса
(REF_TEXT голосом REF_VOICE через edge-tts), ударения размечены в SCRIPT
знаком «+» перед ударной гласной. Каждую фразу проверяет Whisper: если модель
проглотила или исказила слова, фраза перегенерируется с другим seed.
Тайминги слов для субтитров тоже берутся из Whisper.

VOICE_ENGINE=elevenlabs — голос ElevenLabs (самый живой; нужен ключ в переменной
ELEVENLABS_API_KEY и ELEVENLABS_VOICE_ID — выбрать голос помогает el_samples.py).
VOICE_ENGINE=edge — голос edge-tts без Chatterbox.

Зависимости: pip install edge-tts faster-whisper chatterbox-tts
(torch для CPU: pip install torch torchaudio --index-url https://download.pytorch.org/whl/cpu)
"""
import array
import asyncio
import difflib
import hashlib
import json
import os
import re
import ssl
import subprocess
import wave

import edge_tts

DIR = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(DIR, "out")
TTS = os.path.join(OUT, "tts")
SR = 48000
ENGINE = os.environ.get("VOICE_ENGINE", "chatterbox")
LEAD = 0.18        # сцена появляется чуть раньше первого слова
TAIL = 1.5         # хвост после последней фразы под стрелку и фейд

# Chatterbox: тембр из референса. Низкий тёплый мужской голос, читающий по-русски
# разговорный текст: модель копирует тембр и манеру, а не текст.
# Своя запись голоса (15–25 с живой речи) вместо синтетического референса:
# VOICE_REF=my_voice.m4a ./build.sh — модель клонирует тембр и манеру записи.
REF_FILE = os.environ.get("VOICE_REF", "")
REF_VOICE = "en-US-AndrewMultilingualNeural"
REF_TEXT = ("Слушай, я тут недавно разбирался, как банки привлекают новых клиентов. "
            "Оказалось, всё довольно просто: они платят тебе за то, что ты открываешь карту. "
            "Честно, сам сначала не поверил.")
TEMPO = 1.06       # ускорение при генерации (без изменения высоты); входит в ключ кэша
SPEED = 1.04       # дополнительное ускорение при сборке, кэш не сбрасывает
QC_MIN = 0.95      # минимальное совпадение распознанного текста со сценарием
TRIES = 4

# ElevenLabs: голос, модель и манера. stability ниже — живее и неровнее, style — экспрессия.
EL_VOICE = os.environ.get("ELEVENLABS_VOICE_ID", "")
EL_MODEL = os.environ.get("ELEVENLABS_MODEL", "eleven_multilingual_v2")
EL_SETTINGS = dict(stability=0.35, similarity_boost=0.8, style=0.35, use_speaker_boost=True)

# edge-tts: голос и темп, если ENGINE = "edge"
EDGE_VOICE = "ru-RU-DmitryNeural"
EDGE_RATE = 18

# Сценарий: сцены -> фразы. Фраза = (текст, пауза после неё, подача).
# «+» перед гласной — ударение. Подача: exag (эмоциональность Chatterbox, 0.25–1),
# cfg (ниже — размереннее), rate (поправка темпа edge-tts, %).
SCRIPT = [
    [("Стоп!", 0.28, dict(exag=.9, cfg=.5, rate=-6)),
     ("Б+анки пр+ямо сейч+ас разда+ют д+еньги,", 0.0, dict(exag=.65))],
    [("и п+очти никт+о их не забир+ает.", 0.26, dict(exag=.55))],
    [("Н+овому кли+енту по приглаш+ению банк пл+атит б+онус.", 0.14, dict()),
     ("Пр+осто за к+арту и п+ервую пок+упку.", 0.26, dict())],
    [("+Это не кред+ит и не р+озыгрыш.", 0.12, dict()),
     ("+Это рекл+амный бюдж+ет б+анка, и он м+ожет дост+аться теб+е.", 0.28, dict(exag=.6))],
    [("А теп+ерь ч+естно:", 0.08, dict(exag=.6)),
     ("ты пл+атишь за обсл+уживание?", 0.12, dict(exag=.6)),
     ("Кэшб+эк од+ин проц+ент?", 0.34, dict(exag=.65))],
    [("Зн+ачит, ты к+ормишь банк, кот+орый теб+е не пл+атит ничег+о.", 0.32, dict(exag=.45, cfg=.3, rate=-8))],
    [("Я собр+ал в телегр+аме все акту+альные б+онусы: как+ой банк, ск+олько пл+атит и как+ие усл+овия.", 0.28, dict(exag=.55, rate=4))],
    [("Сс+ылка в проф+иле.", 0.14, dict(exag=.7, rate=-4)),
     ("Забир+ай, пок+а +акции не зак+ончились.", 0.0, dict(exag=.6))],
]

plain = lambda s: s.replace("+", "")
stressed = lambda s: re.sub(r"\+(\w)", lambda m: m.group(1) + "́", s)
# Whisper пишет «кэшбек 1 %» и т. п. — приводим обе стороны к одному виду
norm = lambda s: re.sub(r"[^а-яa-z0-9 ]", "", s.lower().replace("ё", "е").replace("э", "е")
                        .replace("1 %", "1%").replace("1%", "один процент")).split()

# edge-tts сам выбирает certifi; в этом окружении TLS идёт через прокси со своим CA.
_ca = os.environ.get("SSL_CERT_FILE") or ("/root/.ccr/ca-bundle.crt" if os.path.exists("/root/.ccr/ca-bundle.crt") else None)
if _ca:
    edge_tts.communicate._SSL_CTX = ssl.create_default_context(cafile=_ca)


def key(*parts):
    return hashlib.sha1("|".join(map(str, parts)).encode()).hexdigest()[:12]


def load_pcm(path, tempo=1.0):
    af = ["-af", f"atempo={tempo}"] if tempo != 1.0 else []
    pcm = subprocess.run(["ffmpeg", "-v", "error", "-i", path, *af, "-ac", "1", "-ar", str(SR), "-f", "s16le", "-"],
                         check=True, capture_output=True).stdout
    return array.array("h", pcm)


async def edge(text, voice, rate, path):
    """edge-tts -> mp3; возвращает тайминги слов из WordBoundary."""
    com = edge_tts.Communicate(text, voice, rate=f"{rate:+d}%", boundary="WordBoundary",
                               proxy=os.environ.get("HTTPS_PROXY"))
    words = []
    with open(path, "wb") as f:
        async for ch in com.stream():
            if ch["type"] == "audio":
                f.write(ch["data"])
            elif ch["type"] == "WordBoundary":
                words.append({"w": ch["text"], "a": ch["offset"] / 1e7, "d": ch["duration"] / 1e7})
    return words


_models = {}


def whisper():
    if "asr" not in _models:
        from faster_whisper import WhisperModel
        _models["asr"] = WhisperModel("small", device="cpu", compute_type="int8")
    return _models["asr"]


def transcribe(path):
    segs, _ = whisper().transcribe(path, language="ru", beam_size=5, word_timestamps=True)
    return [{"w": w.word.strip(), "a": w.start, "d": w.end - w.start} for s in segs for w in s.words]


def similarity(phrase, words):
    a, b = " ".join(norm(phrase)), " ".join(norm(" ".join(w["w"] for w in words)))
    return difflib.SequenceMatcher(None, a, b).ratio()


def align(phrase, words):
    """Время каждого слова сценария по словам Whisper; несопоставленные — интерполяцией."""
    toks = phrase.split()
    want = [" ".join(norm(t)) for t in toks]
    got = [" ".join(norm(w["w"])) for w in words]
    t = [None] * len(toks)
    for blk in difflib.SequenceMatcher(None, want, got).get_matching_blocks():
        for k in range(blk.size):
            t[blk.a + k] = words[blk.b + k]["a"]
    if t[0] is None:
        t[0] = words[0]["a"] if words else 0.0
    end = words[-1]["a"] + words[-1]["d"] if words else 1.0
    i = 0
    while i < len(t):
        if t[i] is None:
            j = i
            while j < len(t) and t[j] is None:
                j += 1
            hi = t[j] if j < len(t) else end
            lo = t[i - 1]
            for k in range(i, j):
                t[k] = lo + (hi - lo) * (k - i + 1) / (j - i + 1)
            i = j
        i += 1
    return t


def chatterbox_tts():
    if "tts" not in _models:
        import torch
        from chatterbox.mtl_tts import ChatterboxMultilingualTTS
        torch.set_num_threads(os.cpu_count() or 4)
        _models["tts"] = ChatterboxMultilingualTTS.from_pretrained(device="cpu")
    return _models["tts"]


def own_reference(src):
    """Запись с телефона -> чистый референс: моно 24 кГц, срезан гул, тишина по краям
    и длинные паузы убраны, громкость выровнена, не длиннее 25 с."""
    path = os.path.join(TTS, f"ref_own_{key(os.path.getsize(src), os.path.getmtime(src), src)}.wav")
    if not os.path.exists(path):
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", src, "-af",
                        "highpass=f=70,afftdn=nf=-25,"
                        "silenceremove=start_periods=1:start_threshold=-45dB:"
                        "stop_periods=-1:stop_duration=0.6:stop_threshold=-45dB,"
                        "loudnorm=I=-18:TP=-2,atrim=0:25",
                        "-ac", "1", "-ar", "24000", path], check=True)
    return path


async def reference():
    if REF_FILE:
        return own_reference(os.path.join(DIR, REF_FILE) if not os.path.isabs(REF_FILE) else REF_FILE)
    path = os.path.join(TTS, f"ref_{key(REF_VOICE, REF_TEXT)}.wav")
    if not os.path.exists(path):
        mp3 = path[:-4] + ".mp3"
        await edge(REF_TEXT, REF_VOICE, 0, mp3)
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", mp3, "-ac", "1", "-ar", "24000", path], check=True)
    return path


def elevenlabs(text, path, prev="", nxt="", voice=None, settings=None):
    """ElevenLabs TTS -> mp3; тайминги слов из посимвольного выравнивания ответа.
    prev/nxt — соседние фразы: модель учитывает их для связной интонации, но не озвучивает."""
    import base64
    import requests
    r = requests.post(
        f"https://api.elevenlabs.io/v1/text-to-speech/{voice or EL_VOICE}/with-timestamps",
        params={"output_format": "mp3_44100_128"},
        headers={"xi-api-key": os.environ["ELEVENLABS_API_KEY"]},
        json={"text": text, "model_id": EL_MODEL, "voice_settings": settings or EL_SETTINGS,
              "previous_text": prev or None, "next_text": nxt or None},
        timeout=120)
    r.raise_for_status()
    d = r.json()
    with open(path, "wb") as f:
        f.write(base64.b64decode(d["audio_base64"]))
    al = d["alignment"]
    chars, st, en = al["characters"], al["character_start_times_seconds"], al["character_end_times_seconds"]
    # слово = непрерывная последовательность непробельных символов
    words, cur = [], None
    for c, a, b in zip(chars, st, en):
        if c.isspace():
            cur = None
            continue
        if cur is None:
            cur = {"w": "", "a": a, "d": 0.0}
            words.append(cur)
        cur["w"] += c
        cur["d"] = b - cur["a"]
    return words


async def synth(phrase, style, prev="", nxt=""):
    """Фраза -> (pcm 48 кГц, слова с временем относительно начала pcm)."""
    if ENGINE == "elevenlabs":
        k = key("el", EL_VOICE, EL_MODEL, json.dumps(EL_SETTINGS, sort_keys=True), prev, nxt, plain(phrase))
        mp3, meta = os.path.join(TTS, k + ".mp3"), os.path.join(TTS, k + ".json")
        if not os.path.exists(meta):
            ws = elevenlabs(plain(phrase), mp3, prev, nxt)
            json.dump(ws, open(meta, "w"), ensure_ascii=False)
        return trim(load_pcm(mp3), json.load(open(meta)), phrase)
    if ENGINE == "edge":
        rate = EDGE_RATE + style.get("rate", 0)
        k = key("edge", EDGE_VOICE, rate, plain(phrase))
        mp3, meta = os.path.join(TTS, k + ".mp3"), os.path.join(TTS, k + ".json")
        if not os.path.exists(meta):
            ws = await edge(plain(phrase), EDGE_VOICE, rate, mp3)
            json.dump(ws, open(meta, "w"), ensure_ascii=False)
        return trim(load_pcm(mp3), json.load(open(meta)), phrase)

    exag, cfg = style.get("exag", .5), style.get("cfg", .4)
    ref = await reference()
    k = key("cbx", ref, exag, cfg, TEMPO, phrase)
    wav, meta = os.path.join(TTS, k + ".wav"), os.path.join(TTS, k + ".json")
    if os.path.exists(meta) and similarity(plain(phrase), json.load(open(meta))) < QC_MIN:
        os.remove(meta)  # кэш не проходит текущую проверку — генерируем заново
    if not os.path.exists(meta):
        import torch
        import torchaudio
        tts, best = chatterbox_tts(), None
        for seed in range(TRIES):
            torch.manual_seed(seed)
            out = tts.generate(stressed(phrase), language_id="ru", audio_prompt_path=ref,
                               exaggeration=exag, cfg_weight=cfg, temperature=.8)
            tmp = os.path.join(TTS, f"{k}_s{seed}.wav")
            torchaudio.save(tmp, out, tts.sr)
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", tmp, "-af", f"atempo={TEMPO}", tmp + ".t.wav"], check=True)
            os.replace(tmp + ".t.wav", tmp)
            ws = transcribe(tmp)
            score = similarity(plain(phrase), ws)
            print(f"    seed {seed}: {score:.2f}  {' '.join(w['w'] for w in ws)}", flush=True)
            if best is None or score > best[0]:
                best = (score, tmp, ws)
            if score >= QC_MIN:
                break
        if best[0] < QC_MIN:
            print(f"  ! «{plain(phrase)}»: лучшее совпадение {best[0]:.2f}, проверьте на слух")
        os.replace(best[1], wav)
        json.dump(best[2], open(meta, "w"), ensure_ascii=False)
    pcm, ws = trim(load_pcm(wav, SPEED), [dict(w, a=w["a"] / SPEED, d=w["d"] / SPEED) for w in json.load(open(meta))], phrase)
    return pcm, ws


def trim(pcm, ws, phrase):
    """Обрезка тишины по энергии сигнала (с запасом на тихие края) и тайминги слов сценария."""
    win = int(0.01 * SR)
    peak = max(abs(x) for x in pcm) or 1
    thr = peak * 0.02  # −34 дБ от пика
    loud = [i for i in range(0, len(pcm) - win, win) if max(abs(x) for x in pcm[i:i + win]) > thr]
    a = max(0, loud[0] - int(0.03 * SR))
    if ws:
        # Chatterbox иногда «дотягивает» после фразы вдох или бормотание: звук дальше
        # конца последнего распознанного слова (+0.25 с на тихий хвост интонации) не берём
        lim = int((ws[-1]["a"] + ws[-1]["d"] + 0.25) * SR)
        loud = [i for i in loud if i < lim] or loud
        last_end = int((ws[-1]["a"] + ws[-1]["d"]) * SR)
    b = min(len(pcm), loud[-1] + win + int(0.06 * SR))
    if ws:  # тихий хвост вопросительной интонации не режем раньше конца последнего слова
        b = min(len(pcm), max(b, last_end + int(0.04 * SR)))
    toks = plain(phrase).split()
    if ENGINE in ("edge", "elevenlabs"):
        assert len(toks) == len(ws), (phrase, [w["w"] for w in ws])
        times = [w["a"] for w in ws]
    else:
        times = align(plain(phrase), ws)
    off = a / SR
    return pcm[a:b], [{"w": tok, "a": max(0.0, tm - off)} for tok, tm in zip(toks, times)]


def humanize(src, dst):
    """Тихий «воздух» комнаты: короткие ранние отражения и едва слышный фон вместо цифровой тишины."""
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", src,
                    "-f", "lavfi", "-i", f"anoisesrc=color=pink:amplitude=0.0016:sample_rate={SR}",
                    "-filter_complex",
                    "[0:a]asplit=2[d][w];"
                    "[w]aecho=0.8:0.5:23|37|53:0.22|0.15|0.09,lowpass=f=5000,volume=0.6[r];"
                    "[d][r]amix=inputs=2:weights=1 0.35:normalize=0[v];"
                    "[1:a]lowpass=f=3000[n];"
                    "[v][n]amix=inputs=2:duration=first:normalize=0",
                    "-ac", "1", "-ar", str(SR), dst], check=True)


async def main():
    os.makedirs(TTS, exist_ok=True)
    out, t, lines = array.array("h"), 0.0, []
    flat = [plain(ph) for scene in SCRIPT for ph, _, _ in scene]
    n = 0
    for scene in SCRIPT:
        words, text = [], []
        for phrase, gap, style in scene:
            print(f"  {plain(phrase)}", flush=True)
            prev, nxt = " ".join(flat[max(0, n - 2):n]), " ".join(flat[n + 1:n + 3])
            n += 1
            pcm, ws = await synth(phrase, style, prev, nxt)
            words += [{"w": w["w"], "a": round(t + w["a"], 3)} for w in ws]
            text.append(plain(phrase))
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

    raw = os.path.join(OUT, "voice_raw.wav")
    with wave.open(raw, "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes(out.tobytes())
    if ENGINE == "elevenlabs":  # у ElevenLabs и так живая запись, ничего не добавляем
        os.replace(raw, os.path.join(OUT, "voice.wav"))
    else:
        humanize(raw, os.path.join(OUT, "voice.wav"))

    write_timeline(lines, duration)
    print(f"voice ({ENGINE}) {t:.2f}s, ролик {duration}s")
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
