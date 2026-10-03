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
import sys
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
    [("Теб+е восемн+адцать, и теб+е предлаг+ают прод+ать к+арту?", 0.3, dict(exag=.6))],
    [("Не вед+ись, +это уголо+вка.", 0.2, dict(exag=.8, rate=-4)),
     ("+Есть сп+особ зак+оннее и в+ыгоднее.", 0.3, dict(exag=.6))],
    [("Б+анки с+ами пл+атят н+овым клие+нтам: б+онусами и кэшб+эком за к+арту, оформл+енную на теб+я.", 0.28, dict())],
    [("Деб+етовые, кред+итные к+арты: +если собр+ать +акции н+ескольких б+анков, выход+ит до пятн+адцати т+ысяч рубл+ей.", 0.3, dict(exag=.65))],
    [("Всё зак+онно: к+арта тво+я, п+ользуешься ей сам.", 0.14, dict()),
     ("Кред+итку т+олько с льг+отным пери+одом, и гас+и вовр+емя.", 0.3, dict(exag=.45, rate=-6))],
    [("Как+ие б+анки, ск+олько пл+атят и в как+ом пор+ядке оформл+ять: подр+обный гайд оставил у себ+я в телегр+аме.", 0.14, dict()),
     ("Сс+ылка в ш+апке пр+офиля.", 0.0, dict(exag=.7, rate=-4))],
]

plain = lambda s: s.replace("+", "")
stressed = lambda s: re.sub(r"\+(\w)", lambda m: m.group(1) + "́", s)
# Whisper пишет «кэшбек 1 %» и т. п. — приводим обе стороны к одному виду
norm = lambda s: re.sub(r"[^а-яa-z0-9 ]", "", s.lower().replace("ё", "е").replace("э", "е")
                        .replace("1 %", "1%").replace("1%", "один процент")
                        .replace("15 000", "15000").replace("15000", "пятнадцати тысяч")
                        .replace(" 15 ", " пятнадцати ")).split()

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


def whisper(size="small"):
    if size not in _models:
        from faster_whisper import WhisperModel
        _models[size] = WhisperModel(size, device="cpu", compute_type="int8")
    return _models[size]


def transcribe(path, size="small", vad=False):
    segs, _ = whisper(size).transcribe(path, language="ru", beam_size=5, word_timestamps=True, vad_filter=vad)
    # слова нулевой длины — «галлюцинации» Whisper на тишине (например, повтор последней фразы)
    return [{"w": w.word.strip(), "a": w.start, "d": w.end - w.start}
            for s in segs for w in s.words if w.end - w.start >= 0.03]


def similarity(phrase, words):
    a, b = " ".join(norm(phrase)), " ".join(norm(" ".join(w["w"] for w in words)))
    return difflib.SequenceMatcher(None, a, b, autojunk=False).ratio()


def align(phrase, words):
    """Время каждого слова сценария по словам Whisper; несопоставленные — интерполяцией."""
    toks = phrase.split()
    want = [" ".join(norm(t)) for t in toks]
    got = [" ".join(norm(w["w"])) for w in words]
    t = [None] * len(toks)
    for blk in difflib.SequenceMatcher(None, want, got, autojunk=False).get_matching_blocks():
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


# ---------- своя запись сценария + лёгкое изменение голоса ----------
# VOICE_REC=my_voice.m4a VOICE_FX=low ./build.sh
# Интонация и паузы остаются живыми, меняется только тембр:
#   none    — без изменений (только чистка шума)
#   low     — на 1.5 тона ниже вместе с тембром («крупнее» голос)
#   high    — на 1.5 тона выше вместе с тембром
#   formant — та же высота, но тембр ниже/глубже: голос «другого человека»
#   vc      — тембр полностью заменяется нейросетью (Chatterbox VC) на голос из референса
REC_FILE = os.environ.get("VOICE_REC", "")
FX = os.environ.get("VOICE_FX", "vc")
VC_TRIES = int(os.environ.get("VC_TRIES", "4"))
FX_CHAINS = {
    "none": "anull",
    "low": "rubberband=pitch=0.917:formant=shifted",
    "high": "rubberband=pitch=1.091:formant=shifted",
    "formant": f"asetrate={int(SR * 0.88)},aresample={SR},atempo={1 / 0.88:.4f},"
               f"rubberband=pitch={1 / 0.88:.4f}:formant=preserved",
}


def clean_recording(src, dst, seconds=None):
    """Чистка записи с телефона: гул и шум, тишина в начале, длинные паузы сжаты до ~0.35 с."""
    cut = ["-t", str(seconds)] if seconds else []
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", src, *cut, "-af",
                    "highpass=f=70,afftdn=nf=-25,"
                    "silenceremove=start_periods=1:start_threshold=-42dB:"
                    "stop_periods=-1:stop_duration=0.5:stop_threshold=-42dB:stop_silence=0.35,"
                    "loudnorm=I=-18:TP=-2",
                    "-ac", "1", "-ar", str(SR), dst], check=True)


# Эталон тембра для VOICE_FX=vc (вариант 5, выбранный по пробам): хранится в репозитории,
# чтобы результат не зависел от того, как edge-tts синтезирует референс в другой день.
VC_TARGET = os.path.join(DIR, "voice_target_v5.wav")


def apply_fx(src, dst, fx, ref=None):
    if fx == "vc":
        ref = VC_TARGET if os.path.exists(VC_TARGET) else ref
        import torchaudio
        from chatterbox.vc import ChatterboxVC
        if "vc" not in _models:
            _models["vc"] = ChatterboxVC.from_pretrained("cpu")
        vc = _models["vc"]
        wav = vc.generate(audio=src, target_voice_path=ref)
        tmp = dst + ".vc.wav"
        torchaudio.save(tmp, wav, vc.sr)
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", tmp, "-ac", "1", "-ar", str(SR), dst], check=True)
        os.remove(tmp)
    else:
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", src, "-af", FX_CHAINS[fx],
                        "-ac", "1", "-ar", str(SR), dst], check=True)


def fx_samples(rec, ref):
    """Первые ~20 с записи во всех вариантах -> out/fx/*.mp3, чтобы выбрать на слух."""
    d = os.path.join(OUT, "fx")
    os.makedirs(d, exist_ok=True)
    clean = os.path.join(d, "clean.wav")
    clean_recording(rec, clean, seconds=20)
    for i, fx in enumerate(["none", "low", "high", "formant", "vc"], 1):
        wav = os.path.join(d, f"{fx}.wav")
        apply_fx(clean, wav, fx, ref)
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", wav, "-b:a", "160k",
                        os.path.join(d, f"{i}_{fx}.mp3")], check=True)
        print(os.path.join(d, f"{i}_{fx}.mp3"))


# Монтаж записи: какие отрезки оставить (секунды исходного файла). Запинки и повторные
# дубли вырезаются по паузам; стыки сглаживаются, чтобы не было щелчков.
# VOICE_REC_EDIT=rec_edit.json -> {"keep": [[начало, конец], ...]}
REC_EDIT = os.environ.get("VOICE_REC_EDIT", "")


def edit_recording(src, dst, keep, fade=0.015, tail_fade=0.25, pad=0.6):
    """Последний отрезок затухает плавно (tail_fade), после него — тишина (pad): иначе
    замена тембра нейросетью «зажёвывает» звук, обрывающийся на самом краю файла."""
    fades = [fade] * (len(keep) - 1) + [tail_fade]
    parts = "".join(f"[0:a]atrim={a}:{b},asetpts=PTS-STARTPTS,afade=t=in:d={fade},"
                    f"afade=t=out:st={b - a - fo:.3f}:d={fo}[p{i}];" for i, ((a, b), fo) in enumerate(zip(keep, fades)))
    concat = ("".join(f"[p{i}]" for i in range(len(keep))) + f"concat=n={len(keep)}:v=0:a=1,"
              f"apad=pad_dur={pad}")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", src, "-filter_complex", parts + concat,
                    "-ac", "1", "-ar", str(SR), dst], check=True)


def from_recording(rec, ref):
    """Своя запись всего сценария: тайминги слов — по распознаванию, сцены — по сценарию."""
    clean, fxw = os.path.join(OUT, "rec_clean.wav"), os.path.join(OUT, "voice.wav")
    if REC_EDIT:
        path = REC_EDIT if os.path.isabs(REC_EDIT) else os.path.join(DIR, REC_EDIT)
        edited = os.path.join(OUT, "rec_edited.wav")
        edit_recording(rec, edited, json.load(open(path))["keep"])
        rec = edited
    clean_recording(rec, clean)
    flat_text = " ".join(plain(ph) for sc in SCRIPT for ph, _, _ in sc)
    if FX == "vc":
        # в замене тембра есть случайность, и на быстрой речи она иногда «смазывает» слова:
        # делаем несколько прогонов и оставляем самый разборчивый (по Whisper)
        import torch
        best = None
        for seed in range(VC_TRIES):
            torch.manual_seed(seed)
            cand = os.path.join(OUT, f"voice_vc_s{seed}.wav")
            apply_fx(clean, cand, FX, ref)
            score = max(similarity(flat_text, transcribe(cand, "medium", vad=v)) for v in (True, False))
            print(f"  VC seed {seed}: разборчивость {score:.3f}", flush=True)
            if best is None or score > best[0]:
                best = (score, cand)
        os.replace(best[1], fxw)
    else:
        apply_fx(clean, fxw, FX, ref)
    # распознаём до эффекта (так точнее, а тайминг эффект не меняет); medium — small путает
    # границы коротких слов вроде «Стоп! Банки…», а для живой записи это и есть синхрон субтитров
    # два прохода — с VAD и без: на разных записях ошибается то один, то другой
    # (VAD однажды «съел» конец фразы), берём тот, что ближе к сценарию
    ws = max((transcribe(clean, "medium", vad=v) for v in (True, False)),
             key=lambda r: similarity(flat_text, r))
    # Whisper любит «досочинять» повтор последней фразы на тишине в конце —
    # отбрасываем слова, начинающиеся после того, как голос в файле реально закончился
    pcm, win = load_pcm(clean), int(0.01 * SR)
    thr = max(abs(x) for x in pcm) * 0.01  # −40 дБ от пика
    voice_end = max(i for i in range(0, len(pcm) - win, win) if max(abs(x) for x in pcm[i:i + win]) > thr) / SR
    ws = [w for w in ws if w["a"] < voice_end]
    script = [[plain(ph) for ph, _, _ in scene] for scene in SCRIPT]
    flat = " ".join(" ".join(sc) for sc in script)
    print(f"  сценарий/запись: совпадение {similarity(flat, ws):.2f}")
    times, toks, k, lines = align(flat, ws), flat.split(), 0, []
    for sc in script:
        n = len(" ".join(sc).split())
        lines.append({"text": " ".join(sc),
                      "words": [{"w": toks[k + j], "a": round(times[k + j], 3)} for j in range(n)]})
        k += n
    with wave.open(fxw) as w:
        t = w.getnframes() / w.getframerate()
    # длина ролика — по последнему слову, а не по файлу: в конце записи тишина и запас для VC
    return lines, min(t, ws[-1]["a"] + ws[-1]["d"] + 0.4)


def finish(lines, t):
    # сцены: старт чуть раньше первого слова, конец = старт следующей
    for i, l in enumerate(lines):
        l["start"] = 0.0 if i == 0 else round(l["words"][0]["a"] - LEAD, 2)
    duration = round(t + TAIL, 1)
    for i, l in enumerate(lines):
        l["end"] = lines[i + 1]["start"] if i + 1 < len(lines) else duration
    write_timeline(lines, duration)
    print(f"voice ({'запись, ' + FX if REC_FILE else ENGINE}) {t:.2f}s, ролик {duration}s")
    for l in lines:
        print(f"  {l['start']:6.2f}–{l['end']:6.2f}  {l['text']}")


async def main():
    os.makedirs(TTS, exist_ok=True)
    if REC_FILE:
        rec = REC_FILE if os.path.isabs(REC_FILE) else os.path.join(DIR, REC_FILE)
        ref = await reference()  # нужен только для VOICE_FX=vc
        if len(sys.argv) > 1 and sys.argv[1] == "fx-samples":
            return fx_samples(rec, ref)
        return finish(*from_recording(rec, ref))
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

    raw = os.path.join(OUT, "voice_raw.wav")
    with wave.open(raw, "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes(out.tobytes())
    if ENGINE == "elevenlabs":  # у ElevenLabs и так живая запись, ничего не добавляем
        os.replace(raw, os.path.join(OUT, "voice.wav"))
    else:
        humanize(raw, os.path.join(OUT, "voice.wav"))
    finish(lines, t)


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
    impact: [0.0, W(1, "уголовка"), W(3, "пятнадцати"), S(5)],
    whoosh: [S(1), W(1, "Есть"), S(2), S(3), S(4), S(5)],
    coin: [W(2, "бонусами") + .05, W(2, "кэшбэком") + .05].concat([0, 1, 2, 3].map(k => W(3, "Дебетовые") + .3 + k * .45)),
    tick: [W(4, "законно"), W(4, "твоя"), W(4, "сам"), W(4, "льготным")],
    riser: [W(3, "пятнадцати") - 1.2, W(3, "пятнадцати")], // начало, конец
    breakAt: [S(1), W(1, "Есть")], // музыка замирает на «не ведись, это уголовка»
    musicStart: S(1), // до этого — только тревожный пэд под хук
  };
}
if (typeof module !== "undefined") module.exports = TIMELINE;
"""

if __name__ == "__main__":
    asyncio.run(main())
