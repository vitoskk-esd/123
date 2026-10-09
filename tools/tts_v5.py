#!/usr/bin/env python3
"""Голос «вариант 5» без записи владельца: Chatterbox Multilingual TTS (MIT) по образцу voice_target_v5.wav.

Ударения: RUAccent (словарь + модель омографов) → знак ударения U+0301 после ударной гласной (так обучена модель);
у односложных слов знак снимаем (иначе синтез их выделяет); ручные исправления — STRESS_FIX (слово → с «+» перед ударной).
Пишите сложные слова в тексте сразу с «+»: «нач+ал» — такое ударение не трогается.

Импорт: from tts_v5 import stress, synth, humanize."""
import os, re, random, subprocess, sys
VOW = "аеёиоуыэюяАЕЁИОУЫЭЮЯ"
# «на́чал», «на́чала» — так говорит владелец (09.10), хотя по норме «нача́л»
# «дебит+овая»: с «дебет-» модель говорит «дебютовая» (3 попытки из 3, 09.10) — безударное е и так звучит как и
STRESS_FIX = {"начал": "н+ачал", "начала": "н+ачала", "начали": "н+ачали", "бонусом": "б+онусом", "звонит": "звон+ит",
              "кредитка": "кред+итка", "кредитку": "кред+итку", "кредитки": "кред+итки", "кэшбэк": "кэшб+эк", "кэшбэка": "кэшб+эка",
              "дебетовая": "дебит+овая", "дебетовую": "дебит+овую", "обеспечение": "обесп+ечение", "договор": "догов+ор",
              "процентов": "проц+ентов", "сто": "сто", "мне": "мне",
              # слов нет в словаре RUAccent, а его запасная ONNX-модель падает (token_type_ids) — ставим сами
              "телеграм": "телегр+ам", "телеграме": "телегр+аме", "телеграма": "телегр+ама", "телеграмм": "телегр+амм",
              "телеграмме": "телегр+амме", "новичкам": "новичк+ам", "льготного": "льг+отного"}
_acc = None


def stress(text):
    """«Шаг первый» → «Ша́г пе́рвый» (знак U+0301), ё не трогаем, у односложных слов знак снимаем."""
    global _acc
    if _acc is None:
        from ruaccent import RUAccent
        _acc = RUAccent(); _acc.load(omograph_model_size="turbo3.1", use_dictionary=True, tiny_mode=False)
    W = r"[+А-Яа-яЁё]+"
    plain = re.sub(r"\+", "", text)
    try:
        auto = re.findall(W, _acc.process_all(plain))       # слова с ударениями от словаря, по порядку
    except ValueError:                                      # незнакомое слово: модель RUAccent падает — по словам, без него
        auto = []
        for w in re.findall(W, plain):
            try: auto.append(STRESS_FIX.get(w.lower()) or re.findall(W, _acc.process_all(w))[0])
            except ValueError: auto.append(w)
    orig = re.findall(W, text)
    if len(auto) != len(orig): auto = orig                  # на всякий случай: не сбиваем порядок
    it = iter(zip(orig, auto))
    def one(m):
        o, a = next(it)
        w = o if "+" in o else STRESS_FIX.get(o.lower(), a)
        if sum(ch in VOW for ch in w) <= 1: w = w.replace("+", "")
        return re.sub("\\+([" + VOW + "])", lambda k: k.group(1) + "\u0301", w).replace("+", "")
    return re.sub(W, one, text)


_tts = None


def synth(text, out_wav, seed=0, exaggeration=.65, cfg_weight=.35, temperature=.9, ref=None):
    global _tts
    import torch, torchaudio
    sys.path.insert(0, "/home/user/123/reels/zero-card-07")
    import voice as V
    if _tts is None:
        from chatterbox.mtl_tts import ChatterboxMultilingualTTS
        _tts = ChatterboxMultilingualTTS.from_pretrained(device="cpu")
    torch.manual_seed(seed)
    wav = _tts.generate(stress(text), language_id="ru", audio_prompt_path=ref or V.VC_TARGET,
                        exaggeration=exaggeration, cfg_weight=cfg_weight, temperature=temperature)
    torchaudio.save(out_wav, wav, _tts.sr)
    return out_wav


def humanize(parts, out_wav, sr=48000, seed=7, room_db=None, breath_db=-42):
    """Склейка фраз «как живая запись»: паузы разной длины, тихий вдох перед частью фраз, лёгкий разброс темпа,
    цепочка «микрофон в комнате» (срез низа, присутствие 3 кГц, мягкий компрессор, короткое раннее отражение) + шумодав.
    Фон комнаты (room_db) по умолчанию выключен: после компрессора и нормализации −62 дБ превращались в слышное шипение
    в паузах (владелец, рилс #9: «убери фоновый шум, очень чётко слышен»)."""
    import numpy as np, soundfile as sf
    rnd = random.Random(seed); chunks = []
    def load(p, tempo):
        tmp = p[:-4] + ".h.wav"
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", p, "-af", f"atempo={tempo:.3f}", "-ar", str(sr), "-ac", "1", tmp], check=True)
        return sf.read(tmp)[0]
    def breath(dur):
        n = int(dur * sr); x = np.random.default_rng(rnd.randint(0, 9999)).standard_normal(n)
        # «шум вдоха»: полоса 400–3500 Гц, огибающая подъём-спад
        X = np.fft.rfft(x); f = np.fft.rfftfreq(n, 1 / sr); X[(f < 400) | (f > 3500)] = 0; x = np.fft.irfft(X, n)
        env = np.sin(np.linspace(0, np.pi, n)) ** 1.6; x = x * env; return x / (np.abs(x).max() + 1e-9) * 10 ** (breath_db / 20)
    for i, p in enumerate(parts):
        if i:
            gap = rnd.uniform(.22, .5)
            if rnd.random() < .5:
                b = breath(rnd.uniform(.28, .4)); chunks += [np.zeros(int(.05 * sr)), b, np.zeros(int(max(0, gap - len(b) / sr - .05) * sr))]
            else:
                chunks.append(np.zeros(int(gap * sr)))
        chunks.append(load(p, rnd.uniform(.97, 1.03)))
    y = np.concatenate(chunks); y = y / (np.abs(y).max() + 1e-9) * .8
    room = np.random.default_rng(1).standard_normal(len(y)) * 10 ** (room_db / 20) if room_db else 0
    raw = out_wav[:-4] + ".raw.wav"; sf.write(raw, y + room, sr)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", raw, "-af",
                    "afftdn=nr=14:nf=-60,highpass=f=85,equalizer=f=3000:t=q:w=1.2:g=2.5,equalizer=f=220:t=q:w=1:g=1.5,"
                    "acompressor=threshold=-20dB:ratio=2.5:attack=8:release=120,aecho=0.85:0.5:23|37:0.10|0.06,"
                    "loudnorm=I=-16:TP=-1.5", out_wav], check=True)
    os.remove(raw); return out_wav


if __name__ == "__main__":
    print(stress(" ".join(sys.argv[1:]) or "Если бы мне снова было восемнадцать, я бы начал с этих трёх шагов."))
