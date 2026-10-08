#!/usr/bin/env python3
"""Образец «Студии» v6 для ролика №2 (15 с): python3 studio_demo.py -> timeline_studio.js; страница studio.html.
Хук + начало главы 1 по сценарию, монтаж в ритм 100 BPM (доля 0,6 с)."""
import json, os
DIR = os.path.dirname(os.path.abspath(__file__))
B = .6  # доля
def W(words, t0, step=.16, acc=None):
    out = []
    for i, w in enumerate(words.split()):
        c = None
        if acc and w.strip(".,—") in acc: c = acc[w.strip(".,—")]
        out.append({"w": w, "at": round(t0 + i * step, 3), **({"c": c} if c else {})})
    return out

sc = []
# 0.0–2.4 «В этом году банки заработают»
sc.append({"type": "kinetic", "t0": 0, "t1": 2.4, "size": 168, "acc": "g", "push": 1.06, "tout": "zoom",
           "lines": [W("В этом году", -.6, .0), W("банки", .55, .2), W("заработают", .8, .2, {"заработают": "g"})]})
# 2.4–4.8 число-герой 4,4 трлн ₽
sc.append({"type": "count", "t0": 2.4, "t1": 4.8, "acc": "g", "c": "g", "from": 0, "to": 4.4, "dec": 1, "a": 2.45, "b": 3.6, "unit": "трлн ₽",
           "label": "прогноз ЦБ: чистая прибыль банков в 2026", "labelAt": 3.5, "tin": "zoom", "tout": "whip", "push": 1.04})
# 4.8–6.6 «И часть этих денег — ТВОИ.»
sc.append({"type": "kinetic", "t0": 4.8, "t1": 6.6, "size": 170, "acc": "r", "tin": "whip", "push": 1.07, "align": "c",
           "lines": [W("И часть этих денег —", 4.78, .12), [{"w": "твои.", "at": 5.75, "c": "r", "big": 1.35}]]})
# 6.6–9.6 телефон: списания
sc.append({"type": "phone", "t0": 6.6, "t1": 9.6, "acc": "r", "tin": "zoom", "push": 1.03,
           "total": {"label": "Ушло банку за месяц", "from": 0, "to": -2137, "a": 6.9, "b": 8.7, "c": "r"},
           "rows": [{"i": "₽", "t": "Обслуживание", "am": "−99 ₽", "c": "r", "at": 6.95}, {"i": "%", "t": "Проценты", "am": "−1 840 ₽", "c": "r", "at": 7.35},
                    {"i": "✉", "t": "Уведомления", "am": "−59 ₽", "c": "r", "at": 7.75}, {"i": "★", "t": "Кэшбэк баллами", "am": "+12", "c": "#8b96a5", "at": 8.15, "strike": 8.9}],
           "side": [{"t": "Ты платишь", "at": 7.0, "c": "w"}, {"t": "и даже не", "at": 7.5, "c": "w"}, {"t": "замечаешь", "at": 8.0, "c": "r"}]})
# 9.6–11.4 «Банк — не благотворительность.» (жёсткая склейка на долю)
sc.append({"type": "kinetic", "t0": 9.6, "t1": 11.4, "size": 150, "acc": "y", "align": "c", "push": 1.08,
           "lines": [W("Банк —", 9.58, .1), W("не", 10.0, .1), W("благотворительность.", 10.2, .1, {"благотворительность.": "y"})]})
# 11.4–15 глава 1: 3D-карта + «Проценты по кредитке», затем гонка столбиков
sc.append({"type": "card", "t0": 11.4, "t1": 13.5, "acc": "r", "c": "r", "n": "1", "kicker": "способ", "title": "Проценты по кредитке", "titleAt": 11.65,
           "tin": "zoom", "tout": "zoom", "push": 1.05})
sc.append({"type": "bars", "t0": 13.5, "t1": 15.0, "acc": "r", "tin": "zoom", "push": 1.04, "title": "Сколько стоят деньги", "max": 52,
           "bars": [{"label": "Ключевая ставка", "v": 14, "c": "b", "at": 13.6}, {"label": "Кредитка, ПСК", "v": 48, "c": "r", "at": 13.9}],
           "note": "Данные: ЦБ, ОКБ · 2026"})

tl = {"duration": 15, "fps": 30, "scenes": sc,
      "hits": [{"t": 2.4, "kind": "flash"}, {"t": 4.8}, {"t": 5.75}, {"t": 6.6}, {"t": 9.6}, {"t": 10.1}, {"t": 11.4, "kind": "flash"}, {"t": 13.5}],
      "kick": [{"t": 2.4, "a": .05}, {"t": 5.75, "a": .05}, {"t": 9.6, "a": .04}, {"t": 11.4, "a": .06}, {"t": 13.9, "a": .03}],
      # звук для kit/audio.js
      "music": [{"t": 0, "part": "intro"}, {"t": 2.4, "part": "main"}, {"t": 9.45, "part": "stop"}, {"t": 9.6, "part": "main"}],
      "sfx": {"whoosh": [2.2, 4.62, 6.4, 11.2, 13.3], "impact": [2.4, 5.75, 9.6, 11.4], "pop": [6.95, 7.35, 7.75, 8.15, 13.6, 13.9],
              "ticks": [[2.45, 3.6], [6.9, 8.7]], "coin": [3.6], "sting": [11.4], "thud": [10.1]},
      "bpm": 100, "hats": .7}
open(os.path.join(DIR, "timeline_studio.js"), "w").write("window.TL = " + json.dumps(tl, ensure_ascii=False) + ";\n")
print("сцен", len(sc))
