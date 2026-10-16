#!/usr/bin/env python3
"""Монтаж рилса 21 «Арбузов привёл друга» на движке arb-kit/cut3.html (типы планов: clip, img, phone, board, card, calflip).
Владелец 16.10 о рилсе 20: «кадры менялись слишком быстро, я не успевал» → планы 2,5–4 с с движением камеры внутри;
«максимально прорабатывать мелкие детали»; «видео цельное, как у амоБлога» → одна цветокоррекция и зерно на весь ролик (TL.grade, TL.grain);
понравилась доска «ТЕОРИЯ» — она здесь на фразе «как это работает». Новая обстановка: столовая универа и общага.
Тайминг — слова голоса (out/voice/words.json от narrator_voice.py), голос стартует через OFF с.
  python3 cut3.py  → timeline3.js, out/segs3.js
"""
import json, os, re
HERE = os.path.dirname(os.path.abspath(__file__)); OFF = .2
P = [l.strip() for l in open(f"{HERE}/phrases.txt", encoding="utf-8") if l.strip()]
W = [dict(w, s=round(w["s"] + OFF, 3), e=round(w["e"] + OFF, 3)) for w in json.load(open(f"{HERE}/out/voice/words.json"))]
END = round(W[-1]["e"] + 1.2, 2)


def norm(x): return re.sub(r"[^а-яa-z0-9]", "", x.lower().replace("ё", "е"))


def at(p, key=None, nth=0, end=False):
    """Момент слова key во фразе p (по началу слова; end=True — по концу). Без key — начало фразы."""
    ws = [w for w in W if w["p"] == p]
    if key is None: return ws[0]["s"]
    k = norm(key); ws = [w for w in ws if (norm(w["w"]) == k if len(k) <= 3 else norm(w["w"]).startswith(k[:5]))]
    assert len(ws) > nth, f"нет слова «{key}» (№{nth}) во фразе {p}"
    return ws[nth]["e" if end else "s"]


QUADS = json.load(open(f"{HERE}/quads.json")) if os.path.exists(f"{HERE}/quads.json") else {}
def screen_h(q, sw=600):   # высота логического экрана по пропорциям нарисованного (иначе интерфейс сплющится)
    if not q: return 1266
    d = lambda a, b: ((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2) ** .5
    return round(sw * (d(q[0], q[3]) + d(q[1], q[2])) / (d(q[0], q[1]) + d(q[3], q[2])))


def phone(img, **o):   # телефон на рисунке: экран кодом по 4 углам (quads.json от arb-kit/screens.py), пальцы поверх (out/img/<img>_top.png)
    return dict(img=img, quad=QUADS.get(img), sw=600, sh=screen_h(QUADS.get(img)), rad=30, top=f"{img}_top", **o)

PUSH = dict(title="Приведи друга — заплатим обоим", body="Тебе до 1 500 ₽, другу — 500 ₽", tsize=50)
BON = dict(screen="lock", tcolor="#1f9d47", tsize=112, date="", time="20:15")
# (тип, (фраза, слово[, №]), параметры); clip — живая вставка Kling (hf/<clip>.mp4), пока её нет — рисунок img с камерой
SH = [
    ("clip", (0, None), dict(clip="v01", img="s01bf", cam=[[540, 1000, 1.05], [520, 940, 1.14]])),
    ("img", (0, "Сегодня"), dict(img="s02", cam=[[540, 900, 1.0], [600, 820, 1.18]])),
    ("phone", (1, None), phone("s03c", screen="lock", tn=.35, **PUSH, cam=[[480, 1280, 1.45], [450, 1380, 1.9]])),
    ("img", (1, "Тебе"), dict(img="s04", cam=[[540, 960, 1.0], [540, 900, 1.08]])),
    ("clip", (2, None), dict(clip="v05", img="s05", cam=[[540, 960, 1.0], [540, 920, 1.08]])),
    ("phone", (2, "кивнул"), phone("s06", screen="issued", cam=[[540, 920, 1.5], [540, 900, 1.6]])),   # лицо Огурцова вне кадра: он смотрел бы на тыльную сторону телефона
    ("clip", (3, None), dict(clip="v07", img="s07", cam=[[540, 960, 1.0], [540, 1000, 1.08]])),
    ("img", (3, "Карту"), dict(img="s08", cam=[[540, 1000, 1.0], [560, 960, 1.12]])),
    ("board", (4, None), dict(cam=[[540, 960, 1.0], [540, 960, 1.03]])),
    ("clip", (5, None), dict(clip="v10", img="s10", cam=[[540, 960, 1.0], [560, 920, 1.08]])),
    ("clip", (5, "Кабачкову"), dict(clip="v11", img="s11", cam=[[540, 960, 1.0], [540, 900, 1.08]])),
    ("phone", (5, "Скинул"), phone("s12", screen="invite", cam=[[580, 950, 1.55], [585, 940, 1.8]])),
    ("clip", (5, "карту"), dict(clip="v13", img="s13", cam=[[540, 960, 1.0], [600, 1000, 1.1]])),
    ("calflip", (6, None), dict(img="s14", area=[227, 440, 110, 170], cam=[[420, 700, 1.4], [300, 520, 1.9]])),
    ("phone", (6, "Арбузову"), dict(img="s15", top="s15_top", sw=600, rad=24, k="A", scr=[dict(quad=QUADS.get("s15a"), sh=screen_h(QUADS.get("s15a")), title="+1 500 ₽", body="Бонус за друга", tn=.3, **BON),
        dict(quad=QUADS.get("s15b"), sh=screen_h(QUADS.get("s15b")), title="+500 ₽", body="Бонус за карту", tn=9, **BON)], cam=[[237, 830, 1.8], [237, 820, 2.0]])),
    ("phone", (6, "Кабачкову"), dict(img="s15", top="s15_top", sw=600, rad=24, k="B", scr=[dict(quad=QUADS.get("s15a"), sh=screen_h(QUADS.get("s15a")), title="+1 500 ₽", body="Бонус за друга", tn=-5, **BON),
        dict(quad=QUADS.get("s15b"), sh=screen_h(QUADS.get("s15b")), title="+500 ₽", body="Бонус за карту", tn=.3, **BON)], cam=[[651, 865, 1.8], [651, 855, 2.0]])),
    ("img", (7, None), dict(img="s17", cam=[[600, 1000, 1.0], [640, 920, 1.22]])),
    ("clip", (8, None), dict(clip="v18", img="s18", cam=[[540, 960, 1.0], [540, 900, 1.1]])),
]
shots = []
for k, (typ, anc, o) in enumerate(SH):
    o = dict(o); t0 = 0 if k == 0 else round(at(*anc) - .08, 3)
    o["punch"] = [round(at(*pp) - .03, 3) for pp in o.get("punch", [])]
    if typ == "clip" and not os.path.exists(f"{HERE}/hf/{o['clip']}.mp4"): typ = "img"
    if typ == "phone" and not (o.get("quad") or (o.get("scr") and all(e["quad"] for e in o["scr"]))): typ = "img"   # углы экрана ещё не размечены
    shots.append(dict(type=typ, t0=t0, **o))
for k, sh in enumerate(shots):
    sh["t1"] = shots[k + 1]["t0"] if k + 1 < len(shots) else END
    if sh["type"] == "clip": sh["rate"] = round(min(1.0, (4.9 - .15) / max(.1, sh["t1"] - sh["t0"] + .1)), 3)
S = {(sh.get("img") or sh["type"]) + sh.get("k", ""): sh for sh in shots}
# моменты на экранах
iss = S["s06"]; iss["td"] = round(at(2, "оформил") - iss["t0"], 2)
inv = S["s12"]; inv.update(ts=.3, ta=round(at(5, "Кабачков", 1) - inv["t0"] - .55, 2))
two, twoB = S["s15A"], S["s15B"]

# доска «ТЕОРИЯ»: ссылка → заявка друга → покупки в первый месяц → бонус обоим
bd = next(sh for sh in shots if sh["type"] == "board"); b0 = bd["t0"]
B = lambda w, n=0: round(at(4, w, n) - .05, 3)
bd["parts"] = [
    dict(t=b0 + .05, text="ТЕОРИЯ", x=330, y=250, size=120, c="#1e1717"),
    dict(t=b0 + .25, d="M300 290 C 450 275, 640 285, 760 278", w=8, c="#e2283f", dur=.3),
    # 1. ссылка от тебя: звено цепи
    dict(t=B("ссылка"), d="M150 470 h120 a50 50 0 0 1 0 100 h-120 a50 50 0 0 1 0 -100 M250 520 h80 M330 470 h120 a50 50 0 0 1 0 100 h-120 a50 50 0 0 1 0 -100", dur=.55),
    dict(t=B("тебя"), text="ссылка от тебя", x=600, y=545, size=76),
    dict(t=B("тебя") + .3, d="M300 620 C 300 680, 300 700, 300 740 M270 710 L300 745 L330 710", w=8, dur=.3),
    # 2. заявка друга по ссылке: анкета
    dict(t=B("заявка"), d="M200 780 h200 v240 h-200 Z M235 840 h130 M235 890 h130 M235 940 h90", dur=.55),
    dict(t=B("друга"), text="заявка друга", x=600, y=880, size=76),
    dict(t=B("ссылке", 1), text="по ссылке!", x=640, y=970, size=64, c="#e2283f"),
    dict(t=B("ссылке", 1) + .3, d="M300 1050 C 300 1110, 300 1130, 300 1170 M270 1140 L300 1175 L330 1140", w=8, dur=.3),
    # 3. покупки в первый месяц: корзина
    dict(t=B("покупки"), d="M150 1210 h50 l40 170 h190 l40 -130 h-250 M250 1430 a18 18 0 1 0 0.1 0 M400 1430 a18 18 0 1 0 0.1 0", dur=.6),
    dict(t=B("месяц"), text="покупки 1-й мес.", x=560, y=1330, size=72),
    dict(t=B("несколько"), text="≈ несколько тыс. ₽", x=560, y=1420, size=64, c="#e2283f"),
    dict(t=B("несколько") + .3, d="M150 1540 C 400 1525, 700 1560, 940 1535", w=8, c="#1e1717", dur=.35),
    dict(t=B("несколько") + .5, text="= бонус обоим ✓", x=250, y=1660, size=96, c="#1f8f3a"),
]
# пометки маркером
MARKS = [
    dict(kind="text", t=(0, "Огурцов"), text="Огурцов", x=60, y=330, r=-6, c="#fff6a8", size=110),
    dict(kind="arrow", t=(0, "лучший"), d="M230 470 C 250 520, 280 560, 310 610", c="#fff6a8"),
    dict(kind="text", t=(1, "Тебе"), text="до 1 500 ₽", x=60, y=430, r=-4, c="#fff6a8", size=110),
    dict(kind="text", t=(1, "другу"), text="500 ₽", x=680, y=480, r=5, c="#fff6a8", size=110),
    dict(kind="text", t=(3, "Через"), text="через месяц…", x=60, y=300, r=-4, c="#fff6a8", size=100),
    dict(kind="text", t=(3, "никому"), text="0 ₽", x=660, y=560, r=6, c="#ff4d4d", size=170),
    dict(kind="text", t=(3, "ссылке"), text="без ссылки = 0 ₽", x=70, y=260, r=-5, c="#ff4d4d", size=110),
    dict(kind="text", t=(5, "Кабачкову"), text="Кабачков", x=560, y=300, r=5, c="#fff6a8", size=110),
    dict(kind="check", t=(5, "купил"), d="M150 1120 L 230 1210 L 380 1030", c="#7dff7a"),
    dict(kind="text", t=(6, "полторы"), text="+1 500 ₽", x=80, y=240, r=-4, c="#7dff7a", size=150),
    dict(kind="text", t=(6, "пятьсот"), text="+500 ₽", x=120, y=240, r=-4, c="#7dff7a", size=150),
    dict(kind="text", t=(7, "только"), text="1. по ссылке", x=0, y=0, c="#1d3c8f", board=True),
    dict(kind="text", t=(7, "новый"), text="2. друг — новый", x=0, y=0, c="#1d3c8f", board=True),
    dict(kind="text", t=(7, "условие"), text="3. покупки ✓", x=0, y=0, c="#1d3c8f", board=True),
]
FRIDGE = json.load(open(f"{HERE}/fridge.json")) if os.path.exists(f"{HERE}/fridge.json") else None   # где на двери холодильника писать (x, y, шаг)
marks = []
for m in MARKS:
    m = dict(m); m["t"] = round(at(*m["t"]) - .05, 3)
    if m.get("board"):
        if not FRIDGE: continue
        j = sum(1 for x in marks if x.get("board")); m.update(x=FRIDGE["x"], y=FRIDGE["y"] + j * FRIDGE["step"], size=FRIDGE.get("size", 58), r=FRIDGE.get("r", 0))
    marks.append(m)

def span(a, b): return [round(shots[a]["t0"], 3), round(shots[b]["t1"], 3)]
ix = {id(sh): k for k, sh in enumerate(shots)}; K = lambda key: ix[id(S[key])]
cf = S["s14"]
sfx = dict(murmur=[span(0, K("s06"))], room=[span(K("s07"), K("s08")), span(K("s10"), K("s12")), span(K("s14"), len(shots) - 1)], hum=[span(K("s07"), K("s07"))],
           notif=[round(S["s03c"]["t0"] + .35, 3), round(two["t0"] + .3, 3), round(twoB["t0"] + .3, 3), round(inv["t0"] + inv["ta"], 3)],
           click=[round(iss["t0"] + .2, 3), round(inv["t0"] + .3, 3)],
           thud=[round(at(5, "постучал") + d, 3) for d in (0, .22, .44)], beep=[round(S["s13"]["t0"] + .6, 3)],
           coin=[round(S["s02"]["t0"] + d, 3) for d in (.3, .6, 1.0, 1.5)] + [round(two["t0"] + d, 3) for d in (.45, .7)] + [round(twoB["t0"] + .45, 3)],
           paper=[round(cf["t0"] + d, 3) for d in (0, .17, .34, .51, .68)] if cf["type"] == "calflip" else [],
           pen=[[m["t"], .45] for m in marks] + [[p["t"], .5] for p in bd["parts"]],
           whoosh=[round(S["s02"]["t0"] - .1, 3), round(bd["t0"] - .1, 3), round(S["s17"]["t0"] - .1, 3)], sting=[round(two["t0"] + .3, 3)])
music = [dict(t=0, part="intro"), dict(t=round(S["s03c"]["t0"], 3), part="main"), dict(t=round(S["s07"]["t0"], 3), part="stop"),
         dict(t=round(bd["t0"], 3), part="intro"), dict(t=round(S["s10"]["t0"], 3), part="main"), dict(t=round(S["s18"]["t0"], 3), part="outro")]
TL = dict(size=[1080, 1920], fps=30, duration=END, off=OFF, words=W, shots=shots, marks=marks, sfx=sfx, music=music, bpm=96, hats=.4,
          grade="saturate(.92) contrast(1.04) sepia(.08)", grain=.06)
open(f"{HERE}/timeline3.js", "w").write("window.TL = " + json.dumps(TL, ensure_ascii=False) + ";\n")
os.makedirs(f"{HERE}/out", exist_ok=True)
open(f"{HERE}/out/segs3.js", "w").write("window.SEGS = " + json.dumps([dict(mode="cut", t0=sh["t0"], t1=sh["t1"]) for sh in shots]) + ";\n")
print(f"{END} с, планов {len(shots)} (в среднем {END / len(shots):.2f} с), пометок {len(marks)}")
for sh in shots: print(f"  {sh['type']:7s} {sh.get('clip') or sh.get('img') or sh.get('screen', '')}: {sh['t0']:.2f}–{sh['t1']:.2f} ({sh['t1'] - sh['t0']:.2f} с)")
