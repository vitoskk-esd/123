#!/usr/bin/env python3
"""Монтаж рилса 20, версия 3 (владелец 15.10: «посмотри ещё раз амоБлог… больше деталей… показать на телефоне, как Арбузов
пишет в поддержку и ему пришёл ответ… больше кадров»; «Бу появляется не в каждом кадре»). Разбор и план — AMO_DIFF_v3.md.
Планы привязаны к словам голоса (timeline.js от build_arb.py). Типы: clip, img, phone (экран кодом по 4 углам), board, card, calflip.
  python3 cut3.py  → timeline3.js, out/segs3.js
"""
import json, os, re
HERE = os.path.dirname(os.path.abspath(__file__))
s = open(f"{HERE}/timeline.js").read(); T = json.loads(s[s.index("=") + 1:].strip().rstrip(";"))
W, SC, END = T["words"], T["scenes"], T["duration"]
for w in W: w["p"] = next(i for i, sc in enumerate(SC) if sc["t0"] - .05 <= w["s"] < sc["t1"] + .01)


def norm(x): return re.sub(r"[^а-яa-z0-9]", "", x.lower().replace("ё", "е"))


def at(p, key=None, nth=0, end=False):
    if key is None: return SC[p]["t0"]
    k = norm(key); ws = [w for w in W if w["p"] == p and (norm(w["w"]) == k if len(k) <= 3 else norm(w["w"]).startswith(k[:5]))]
    assert ws, f"нет слова «{key}» во фразе {p}"
    return ws[nth]["e" if end else "s"]


# экраны: четырёхугольник экрана на рисунке (TL, TR, BR, BL) в координатах кадра 1080×1920 и логический размер экрана
PUSHCARD_N02 = dict(img="n02", quad=[[620, 952], [795, 980], [735, 1225], [563, 1198]], sw=520, sh=600, rad=40, glow="rgba(160,210,255,.6)", top="n02card_top")
PHONE_P16 = dict(img="p16", quad=None, sw=600, sh=1266, rad=46, top="p16_top")     # углы — по кадру p16 (QUADS ниже)
PHONE_P10 = dict(img="p10", quad=None, sw=600, sh=1380, rad=46, top="p10_top")
QUADS = json.load(open(f"{HERE}/quads.json"))   # углы экранов, размечены по сетке 1080×1920
for ph in (PHONE_P16, PHONE_P10):
    if ph["img"] in QUADS: ph["quad"] = QUADS[ph["img"]]

# (тип, начало (фраза, слово), параметры). p21 — крупно: надписи на пачках у краёв кадра — «каракули» нейросети, их не показываем
P = [
    ("clip", (0, None), dict(clip="c01", cam=[[540, 900, 1.0], [520, 880, 1.06]])),
    ("img", (0, "Однажды"), dict(img="p02", cam=[[540, 960, 1.0], [640, 930, 1.35]])),
    ("phone", (0, "пришёл"), dict(**PUSHCARD_N02, screen="pushcard", title="1 000 ₽ за первую карту", body="Бонус новым клиентам. Оформите карту за 2 минуты",
                                  cam=[[640, 1070, 1.9], [680, 1090, 2.3]])),
    ("clip", (0, "банк"), dict(clip="k03", cam=[[540, 960, 1.0], [540, 920, 1.08]], punch=[(0, "новенький")])),
    ("clip", (0, "просто"), dict(clip="k05", cam=[[540, 960, 1.0], [540, 940, 1.06]])),
    ("phone", (1, None), dict(**PHONE_P16, screen="form", cam=[[563, 990, 2.25], [563, 990, 2.4]])),
    ("clip", (1, "а"), dict(clip="k07", cam=[[540, 960, 1.0], [540, 880, 1.1]])),
    ("phone", (1, "вы"), dict(**PHONE_P16, screen="reject", cam=[[563, 990, 2.4], [563, 990, 2.5]], punch=[(1, "не")])),
    ("clip", (2, None), dict(clip="c03", cam=[[540, 900, 1.1], [560, 860, 1.25]])),
    ("clip", (2, "весной"), dict(clip="k06", look="memory", flash=True, cam=[[540, 960, 1.0], [540, 960, 1.05]])),
    ("phone", (2, "анкету"), dict(**PHONE_P10, screen="swipe", look="memory", cam=[[800, 1110, 1.8], [820, 1120, 2.1]])),
    ("board", (2, "а"), dict(cam=[[540, 960, 1.0], [540, 960, 1.03]])),
    ("clip", (2, "обычно"), dict(clip="k07c" if False else "k07", cam=[[540, 960, 1.0], [600, 880, 1.12]], punch=[(2, "полгода")])),
    ("clip", (3, None), dict(clip="k08", cam=[[540, 960, 1.0], [520, 900, 1.08]])),
    ("img", (3, "Нашёл"), dict(img="p15", cam=[[540, 960, 1.0], [540, 1000, 1.15]])),
    ("phone", (3, "сначала"), dict(**PHONE_P16, screen="chat", cam=[[563, 990, 2.25], [563, 990, 2.45]])),
    ("clip", (3, "да"), dict(clip="k18", from_=1.6, cam=[[540, 960, 1.0], [540, 940, 1.05]])),
    ("img", (4, "карту"), dict(img="p19", cam=[[540, 960, 1.05], [520, 900, 1.25]])),
    ("clip", (4, "пошёл"), dict(clip="c06", cam=[[540, 960, 1.0], [600, 900, 1.1]])),
    ("img", (4, "QR"), dict(img="p21", cam=[[600, 980, 1.5], [600, 940, 1.6]])),
    ("clip", (4, "засчитали"), dict(clip="k11", cam=[[540, 960, 1.0], [540, 940, 1.06]])),
    ("clip", (5, "платить"), dict(clip="k12", cam=[[540, 960, 1.0], [700, 1300, 1.25]])),
    ("calflip", (5, "и"), dict(img="n07", area=[870, 940, 150, 200], cam=[[700, 900, 1.25], [760, 900, 1.45]])),
    ("phone", (5, "пришёл"), dict(**PUSHCARD_N02, screen="bonus", cam=[[660, 1080, 2.0], [680, 1090, 2.35]])),
    ("clip", (5, "плюс"), dict(clip="c09", cam=[[540, 960, 1.0], [540, 940, 1.06]], punch=[(5, "тысяча")])),
    ("card", (6, "Арбузова"), dict(text="Схема Арбузова", cam=[[540, 960, 1.0], [540, 960, 1.04]])),
    ("clip", (6, "проверь"), dict(clip="k14", rate=.95, cam=[[540, 960, 1.0], [540, 960, 1.0]])),
    ("clip", (7, None), dict(clip="k15", cam=[[540, 960, 1.0], [540, 930, 1.08]])),
]
FALLBACK = dict(k05="p05", k07="p07", k11="f07", k12="f08", k14="f10", k15="f11", k18="f05")
shots = []
for k, (typ, (p, key), o) in enumerate(P):
    o = dict(o); t0 = 0 if k == 0 else round(at(p, key) - .08, 3)
    if "from_" in o: o["from"] = o.pop("from_")
    o["punch"] = [round(at(pp, ww) - .03, 3) for pp, ww in o.get("punch", [])]
    if typ == "clip" and not os.path.exists(f"{HERE}/hf/{o['clip']}.mp4"): typ, o["img"] = "img", FALLBACK[o["clip"]]
    if typ == "phone" and not o.get("quad"): typ = "img"                    # углы экрана ещё не размечены
    shots.append(dict(type=typ, t0=t0, **o))
for k, sh in enumerate(shots):
    sh["t1"] = shots[k + 1]["t0"] if k + 1 < len(shots) else END
    if sh["type"] == "clip" and "rate" not in sh: sh["rate"] = round(min(1.0, (4.9 - sh.get("from", .15)) / max(.1, sh["t1"] - sh["t0"] + .1)), 3)
# чат: моменты внутри плана — печатает с «спросил», отправляет перед «Ответ», «оператор печатает…», ответ на «да»
ch = next(sh for sh in shots if sh.get("screen") == "chat")
ch.update(tq=round(at(3, "спросил") - ch["t0"], 2), ts=round(at(3, "клиент", end=True) - ch["t0"] + .05, 2))
ch.update(tdots=round(ch["ts"] + .25, 2), ta=round(at(3, "Ответ") - ch["t0"] - .05, 2))
# доска «ТЕОРИЯ»: что рисуется и когда
bd = next(sh for sh in shots if sh["type"] == "board"); b0 = bd["t0"]
B = lambda p, w: round(at(p, w) - .05, 3)
bd["parts"] = [
    dict(t=b0 + .05, text="ТЕОРИЯ", x=330, y=260, size=120, c="#1e1717"),
    dict(t=b0 + .25, d="M300 300 C 450 285, 640 295, 760 288", w=8, c="#e2283f", dur=.3),
    dict(t=B(2, "новичок"), d="M290 560 a 70 70 0 1 0 0.1 0 M290 700 L290 900 M290 760 L200 840 M290 760 L380 840 M290 900 L220 1040 M290 900 L360 1040", dur=.6),
    dict(t=B(2, "новичок") + .3, text="новичок =", x=470, y=760, size=110),
    dict(t=B(2, "карты"), d="M180 1180 h300 a20 20 0 0 1 20 20 v150 a20 20 0 0 1 -20 20 h-300 a20 20 0 0 1 -20 -20 v-150 a20 20 0 0 1 20 -20 M160 1240 h340 M220 1310 h80", dur=.5),
    dict(t=B(2, "карты") + .35, d="M150 1150 L 520 1410 M520 1150 L 150 1410", c="#e2283f", w=12, dur=.3),
    dict(t=B(2, "заявок"), d="M620 1150 h230 v300 h-230 Z M660 1220 h150 M660 1280 h150 M660 1340 h100", dur=.5),
    dict(t=B(2, "заявок") + .35, d="M590 1130 L 880 1470 M880 1130 L 590 1470", c="#e2283f", w=12, dur=.3),
    dict(t=B(2, "заявок") + .2, text="нет карты", x=150, y=1520, size=72),
    dict(t=B(2, "заявок") + .45, text="нет заявок", x=600, y=1540, size=72),
]
# пометки маркером и реплики
MARKS = [
    dict(kind="text", t=(0, "Это"), text="это Арбузов", x=70, y=300, r=-6, c="#fff6a8"),
    dict(kind="arrow", t=(0, "Арбузов"), d="M330 430 C 380 540, 420 620, 455 700", c="#fff6a8"),
    dict(kind="text", t=(0, "тысячу"), text="+1000 ₽", x=260, y=250, r=-5, c="#fff6a8", size=150),
    dict(kind="text", t=(1, "не"), text="НЕ НОВЫЙ?!", x=120, y=1520, r=-7, c="#ff4d4d", size=120),
    dict(kind="strike", t=(2, "анкету"), d="M280 560 L 820 1380", c="#ff4d4d"),
    dict(kind="text", t=(2, "полгода"), text="6 мес. без заявок", x=40, y=230, r=-4, c="#ff4d4d", size=82),
    dict(kind="arrow", t=(2, "полгода"), d="M560 360 C 700 450, 790 560, 840 760", c="#ff4d4d"),
    dict(kind="text", t=(3, "другой"), text="какой?..", x=560, y=760, r=6, c="#fff6a8", size=110),
    dict(kind="text", t=(3, "да"), text="ДА ✓", x=600, y=250, r=6, c="#7dff7a", size=150),
    dict(kind="bubble", t=(4, "QR"), text="По QR акция не считается!", x=80, y=200, w=620, size=66, tail="right:120px"),
    dict(kind="text", t=(4, "засчитали"), text="QR ≠ покупка", x=90, y=280, r=-5, c="#ff4d4d", size=120),
    dict(kind="check", t=(5, "картой"), d="M700 380 L 780 470 L 930 290", c="#7dff7a"),
    dict(kind="text", t=(5, "месяц"), text="через месяц", x=90, y=300, r=-4, c="#fff6a8", size=110),
    dict(kind="text", t=(5, "тысяча"), text="+1000 ₽", x=260, y=240, r=-4, c="#fff6a8", size=150),
    dict(kind="circle", t=(5, "тысяча"), cx=520, cy=330, rx=330, ry=140, c="#fff6a8"),
    dict(kind="text", t=(6, "проверь"), text="1. Ты новичок?", x=105, y=555, size=58, c="#1d3c8f", board=True),
    dict(kind="text", t=(6, "спроси"), text="2. Спроси в чате", x=105, y=630, size=58, c="#1d3c8f", board=True),
    dict(kind="text", t=(6, "плати"), text="3. Картой, не QR!", x=105, y=705, size=58, c="#1d3c8f", board=True),
]
marks = []
for m in MARKS:
    m = dict(m); m["t"] = round(at(*m["t"]) - .05, 3); marks.append(m)

def span(a, b): return [round(shots[a]["t0"], 3), round(shots[b]["t1"], 3)]
sfx = dict(room=[span(0, 0), span(2, 7), span(12, 13), span(15, 17)], hum=[span(13, 16)], rain=[span(20, 20)], murmur=[span(18, 19), span(21, 21)],
           notif=[round(shots[2]["t0"] + .15, 3), round(shots[23]["t0"] + .1, 3), round(ch["t0"] + ch["ta"], 3)],
           click=[round(shots[5]["t0"] + 1.85, 3), round(ch["t0"] + ch["ts"], 3), round(shots[27]["t1"] - 1.0, 3)],
           keys=[[shots[5]["t0"] + .1, shots[5]["t0"] + 1.7], [ch["t0"] + ch["tq"], ch["t0"] + ch["ts"] - .1]],
           thud=[round(shots[7]["t0"] + .05, 3)], beep=[round(at(4, "QR") - .3, 3), round(at(5, "картой") - .1, 3)],
           coin=[round(shots[4]["t0"] + d, 3) for d in (.2, .5, .9)] + [round(shots[24]["t0"] + d, 3) for d in (.3, .55, .8, 1.1)],
           paper=[round(shots[22]["t0"] + d, 3) for d in (0, .17, .34, .51, .68)],
           pen=[[m["t"], .45] for m in marks] + [[p["t"], .5] for p in bd["parts"]],
           whoosh=[round(shots[9]["t0"] - .1, 3), round(shots[11]["t0"] - .1, 3), round(shots[25]["t0"] - .1, 3)], sting=[round(shots[25]["t0"], 3)])
music = [dict(t=0, part="intro"), dict(t=round(shots[5]["t0"], 3), part="main"), dict(t=round(shots[7]["t0"], 3), part="stop"),
         dict(t=round(shots[9]["t0"], 3), part="intro"), dict(t=round(shots[13]["t0"], 3), part="main"), dict(t=round(shots[27]["t0"], 3), part="outro")]
TL = dict(size=[1080, 1920], fps=30, duration=END, off=T["off"], words=W, shots=shots, marks=marks, sfx=sfx, music=music, bpm=100, hats=.45)
open(f"{HERE}/timeline3.js", "w").write("window.TL = " + json.dumps(TL, ensure_ascii=False) + ";\n")
os.makedirs(f"{HERE}/out", exist_ok=True)
open(f"{HERE}/out/segs3.js", "w").write("window.SEGS = " + json.dumps([dict(mode="cut", t0=sh["t0"], t1=sh["t1"]) for sh in shots]) + ";\n")
print(f"{END} с, планов {len(shots)} (в среднем {END / len(shots):.2f} с), пометок {len(marks)}")
for sh in shots: print(f"  {sh['type']:7s} {sh.get('clip') or sh.get('img') or sh.get('screen') or sh.get('text', '')}: {sh['t0']:.2f}–{sh['t1']:.2f} ({sh['t1'] - sh['t0']:.2f} с)")
