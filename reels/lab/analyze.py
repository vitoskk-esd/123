#!/usr/bin/env python3
"""Разбор чужого (или своего) рилса по видеофайлу — без Instagram и без API.

python3 reels/lab/analyze.py путь/к/ролику.mp4 [имя]

Пишет в reels/lab/breakdowns/<имя>/:
  report.md     — длительность, формат, склейки и темп, речь по словам, громкость, паузы
  sheet_*.jpg   — листы кадров: хук (первые 3 с, каждые 0.5 с) и весь ролик по склейкам
Дальше Claude смотрит листы кадров глазами и дописывает в report.md разбор: хук, структура,
графика, текст на экране, переходы, звук, CTA — и выводы в reels/lab/trends.md.

Сам видеофайл в репозиторий не кладётся (чужой контент): только отчёт и уменьшенные кадры.
"""
import json
import os
import re
import subprocess
import sys

LAB = os.path.dirname(os.path.abspath(__file__))


def sh(*a):
    return subprocess.run(a, capture_output=True, text=True)


def probe(path):
    d = json.loads(sh("ffprobe", "-v", "error", "-show_entries", "format=duration:stream=codec_type,width,height,r_frame_rate",
                      "-of", "json", path).stdout)
    v = next(s for s in d["streams"] if s["codec_type"] == "video")
    num, den = map(int, v["r_frame_rate"].split("/"))
    return float(d["format"]["duration"]), v["width"], v["height"], num / den, any(s["codec_type"] == "audio" for s in d["streams"])


def cuts(path, thr=0.3):
    err = sh("ffmpeg", "-i", path, "-vf", f"select='gt(scene,{thr})',showinfo", "-f", "null", "-").stderr
    return [float(x) for x in re.findall(r"pts_time:([0-9.]+)", err)]


def sheet(path, times, out, cols=4, w=270):
    times = [t for t in times]
    rows = (len(times) + cols - 1) // cols
    tmp = []
    for i, t in enumerate(times):
        f = f"{out}_{i:02d}.jpg"
        sh("ffmpeg", "-v", "error", "-y", "-ss", f"{t:.2f}", "-i", path, "-frames:v", "1", "-vf",
           f"scale={w}:-2,drawtext=text='{t:.1f}s':x=8:y=8:fontsize=22:fontcolor=white:box=1:boxcolor=black@0.6", f)
        tmp.append(f)
    inputs = sum((["-i", f] for f in tmp), [])
    n = len(tmp)
    # xstack layout: позиции через w0/h0
    pos = []
    for i in range(n):
        c, r = i % cols, i // cols
        x = "+".join(["w0"] * c) or "0"
        y = "+".join(["h0"] * r) or "0"
        pos.append(f"{x}_{y}")
    if n == 1:
        os.replace(tmp[0], out + ".jpg")
        return
    sh("ffmpeg", "-v", "error", "-y", *inputs, "-filter_complex",
       f"xstack=inputs={n}:layout={'|'.join(pos)}:fill=black", out + ".jpg")
    for f in tmp:
        os.remove(f)


def speech(path):
    try:
        from faster_whisper import WhisperModel
    except ImportError:
        return None
    m = WhisperModel("medium", device="cpu", compute_type="int8")
    segs, info = m.transcribe(path, beam_size=5, word_timestamps=True, vad_filter=True)
    words = [(w.word.strip(), w.start, w.end) for s in segs for w in s.words]
    return info.language, words


def loudness(path):
    err = sh("ffmpeg", "-i", path, "-af", "ebur128", "-f", "null", "-").stderr
    m = re.search(r"Integrated loudness:\s+I:\s+(-?[0-9.]+) LUFS", err)
    return float(m.group(1)) if m else None


def main():
    src = sys.argv[1]
    name = sys.argv[2] if len(sys.argv) > 2 else os.path.splitext(os.path.basename(src))[0]
    out = os.path.join(LAB, "breakdowns", name)
    os.makedirs(out, exist_ok=True)
    dur, w, h, fps, has_audio = probe(src)
    cs = cuts(src)
    hook = [i * 0.5 for i in range(7) if i * 0.5 < dur]
    sheet(src, hook, os.path.join(out, "sheet_hook"))
    shots = [0.05] + [c + 0.05 for c in cs]
    if len(shots) > 24:  # слишком много склеек — равномерная выборка
        step = len(shots) / 24
        shots = [shots[int(i * step)] for i in range(24)]
    if len(shots) < 8:
        shots = [dur * i / 12 for i in range(12)]
    sheet(src, shots, os.path.join(out, "sheet_shots"))
    sp = speech(src) if has_audio else None
    lu = loudness(src) if has_audio else None
    L = [f"# Разбор: {name}", "",
         f"- Длительность: {dur:.1f} с, кадр {w}×{h}, {fps:.0f} fps, звук: {'есть' if has_audio else 'нет'}",
         f"- Склеек (смен сцены): {len(cs)}; средний план {dur / (len(cs) + 1):.2f} с; темп {(len(cs)) / dur:.2f} склейки/с",
         f"- Первая склейка: {cs[0]:.2f} с" if cs else "- Склеек не найдено (один план или плавная анимация)",
         f"- Громкость: {lu} LUFS" if lu is not None else "- Громкость: —", ""]
    if sp:
        lang, words = sp
        text = " ".join(w for w, _, _ in words)
        first3 = " ".join(w for w, a, _ in words if a < 3.0)
        rate = len(words) / max(0.1, (words[-1][2] - words[0][1])) if words else 0
        pauses = [(words[i][2], words[i + 1][1] - words[i][2]) for i in range(len(words) - 1) if words[i + 1][1] - words[i][2] > 0.5]
        L += [f"## Речь ({lang})", "",
              f"- Первое слово: {words[0][1]:.2f} с" if words else "- Речи нет",
              f"- Первые 3 секунды: «{first3}»",
              f"- Темп: {rate:.1f} слов/с",
              f"- Паузы > 0.5 с: " + (", ".join(f"{a:.1f} с ({d:.1f})" for a, d in pauses) or "нет"), "",
              f"Текст: {text}", "",
              "_Под музыкой Whisper иногда «досочиняет» фразы (особенно в конце: «подписывайтесь на канал»)"
              " и путает слова — сверяй текст с кадрами и не делай выводов по одному слову._", ""]
    L += ["## Кадры", "", "- `sheet_hook.jpg` — первые 3 секунды каждые 0.5 с",
          "- `sheet_shots.jpg` — по одному кадру на сцену", "",
          "## Разбор (заполняет Claude по кадрам)", "",
          "- Хук (визуал / голос / текст на экране):", "- Структура и удержание:",
          "- Графика и стиль:", "- Переходы и монтаж:", "- Звук и музыка:", "- CTA:",
          "- Что забрать себе:", ""]
    open(os.path.join(out, "report.md"), "w").write("\n".join(L))
    print(os.path.join(out, "report.md"))


if __name__ == "__main__":
    main()
