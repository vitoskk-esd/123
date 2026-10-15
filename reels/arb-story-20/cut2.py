#!/usr/bin/env python3
"""Монтаж рилса 20, версия 2 «всё живое» (владелец 15.10: «нужно всё намного лучше, без этих субтитров… не шаблонные ролики»;
понравилось только «на доске написал вопросы»). План — SHOTS_v2.md. Каждый план — живое видео (кадры клипа out/clips/<id>),
склейка за 0,08 с до слова; «удар» камеры (punch) на ключевых словах; пометки маркером (marks) рисуются штрихом под голос.
Звук: фоны сцен (room/rain/murmur), предметы (notif, beep, keys, pen, coin, click), музыка тише голоса.
  python3 cut2.py   → timeline2.js, out/segs2.js   (тайминг голоса — из timeline.js, build_arb.py)
"""
import json, os, re
HERE = os.path.dirname(os.path.abspath(__file__))
s = open(f"{HERE}/timeline.js").read(); T = json.loads(s[s.index("=") + 1:].strip().rstrip(";"))
W, SC = T["words"], T["scenes"]
for w in W: w["p"] = next(i for i, sc in enumerate(SC) if sc["t0"] - .05 <= w["s"] < sc["t1"] + .01)


def norm(x): return re.sub(r"[^а-яa-z0-9]", "", x.lower().replace("ё", "е"))


def at(p, key=None, nth=0):
    """Начало слова key во фразе p (key ≤ 3 букв — точное совпадение, иначе по первым 5 буквам); без key — начало фразы."""
    if key is None: return SC[p]["t0"]
    k = norm(key); ws = [w for w in W if w["p"] == p and (norm(w["w"]) == k if len(k) <= 3 else norm(w["w"]).startswith(k[:5]))]
    assert ws, f"нет слова «{key}» во фразе {p}"
    return ws[nth]["s"]


# план: (клип, фраза, слово начала, вид, удары на словах [(фраза, слово)]); часть склеек — на слово позже начала фразы,
# чтобы пометка на последнем слове прошлой фразы («НЕ НОВЫЙ?!», «6 мес.», «ДА ✓», «QR ≠ покупка», «+1000 ₽») успела прочитаться (≥ 0,9 с)
SHOTS = [
    ("c01", 0, None, {}, []),
    ("k02", 0, "Однажды", {}, [(0, "пуш")]),
    ("k03", 0, "банк", {}, [(0, "новенький")]),
    ("k04", 1, None, {}, []),
    ("c03", 1, "а", {}, [(1, "не")]),
    ("k06", 2, "весной", {"look": "memory"}, []),
    ("k07", 2, "а", {}, [(2, "полгода")]),
    ("k08", 3, "не", {}, []),
    ("k09", 3, "спросил", {}, [(3, "да")]),
    ("c06", 4, "пошёл", {}, []),
    ("k11", 4, "Покупку", {}, [(4, "засчитали")]),
    ("k12", 5, "платить", {}, []),
    ("c09", 5, "и", {}, [(5, "тысяча")]),
    ("k14", 6, "Арбузова", {"lock": True}, []),
    ("k15", 7, None, {}, []),
]
END = T["duration"]
FALLBACK = dict(k02="n02", k03="n03", k04="f02", k06="f04", k07="n07", k08="f05", k09="n09", k11="f07", k12="f08", k14="f10", k15="f11")
shots = []
for k, (clip, p, key, o, punch) in enumerate(SHOTS):
    t0 = 0 if k == 0 else round(at(p, key) - .08, 3)
    sh = dict(clip=clip, t0=t0, punch=[round(at(pp, ww) - .03, 3) for pp, ww in punch], **o)
    if not os.path.exists(f"{HERE}/hf/{clip}.mp4"): sh["img"] = FALLBACK[clip]   # видео ещё нет — рисунок с движением камеры
    shots.append(sh)
for k, sh in enumerate(shots):
    sh["t1"] = shots[k + 1]["t0"] if k + 1 < len(shots) else END
    sh["rate"] = round(min(1.0, 4.9 / max(.1, sh["t1"] - sh["t0"] + .2)), 3)   # длинный план — клип чуть медленнее, а не стоп-кадр

# пометки маркером: kind text/arrow/circle/strike/check/underline; координаты экрана 1080×1920 (уточняются по кадрам)
MARKS = [
    dict(kind="text", t=(0, "Это"), text="это Арбузов", x=70, y=300, r=-6, c="#fff6a8"),
    dict(kind="arrow", t=(0, "Арбузов"), d="M330 430 C 380 540, 420 620, 455 700", c="#fff6a8"),
    dict(kind="circle", t=(0, "пуш"), cx=690, cy=1070, rx=190, ry=170, c="#fff6a8"),
    dict(kind="text", t=(0, "тысячу"), text="+1000 ₽", x=260, y=250, r=-5, c="#fff6a8", size=150),
    dict(kind="text", t=(1, "не"), text="НЕ НОВЫЙ?!", x=70, y=260, r=-7, c="#ff4d4d", size=120),
    dict(kind="strike", t=(2, "бросил"), d="M560 1040 L 880 860", c="#ff4d4d"),
    dict(kind="text", t=(2, "полгода"), text="6 мес. без заявок", x=40, y=230, r=-4, c="#ff4d4d", size=82),
    dict(kind="arrow", t=(2, "полгода"), d="M560 360 C 700 450, 790 560, 840 760", c="#ff4d4d"),
    dict(kind="text", t=(3, "клиент"), text="я новый?", x=80, y=280, r=-5, c="#fff6a8", size=120),
    dict(kind="text", t=(3, "да"), text="ДА ✓", x=640, y=250, r=6, c="#7dff7a", size=150),
    dict(kind="text", t=(4, "засчитали"), text="QR ≠ покупка", x=90, y=280, r=-5, c="#ff4d4d", size=120),
    dict(kind="check", t=(5, "картой"), d="M700 380 L 780 470 L 930 290", c="#7dff7a"),
    dict(kind="text", t=(5, "тысяча"), text="+1000 ₽", x=260, y=240, r=-4, c="#fff6a8", size=150),
    dict(kind="circle", t=(5, "тысяча"), cx=520, cy=330, rx=330, ry=140, c="#fff6a8"),
    dict(kind="board", t=(6, "проверь"), lines=[[(6, "проверь"), "1. Ты новичок?"], [(6, "спроси"), "2. Спроси в чате"], [(6, "плати"), "3. Картой, не QR!"]], x=100, y=555, size=58, c="#1d3c8f"),
]
marks = []
for m in MARKS:
    m = dict(m); m["t"] = round(at(*m["t"]) - .05, 3)
    if "lines" in m: m["lines"] = [[round(at(*tt) - .05, 3), txt] for tt, txt in m["lines"]]
    marks.append(m)

# звук
def span(a, b): return [round(shots[a]["t0"], 3), round(shots[b]["t1"], 3)]
sfx = dict(
    room=[span(0, 4), span(6, 8)], hum=[span(7, 8)], rain=[span(10, 10)], murmur=[span(9, 9), span(11, 11)],
    notif=[round(at(0, "пуш") - .15, 3), round(at(5, "пуш") - .1, 3)], beep=[round(at(4, "QR") - .1, 3), round(at(5, "картой") - .1, 3)],
    keys=[[shots[3]["t0"] + .2, shots[3]["t1"] - .2], [at(3, "спросил"), at(3, "клиент") + .3]],
    coin=[round(shots[12]["t0"] + d, 3) for d in (.3, .55, .8, 1.1)],
    click=[round(shots[14]["t1"] - 1.0, 3)], thud=[round(at(1, "не") - .02, 3)],
    pen=[[m["t"], .45] for m in marks if m["kind"] != "board"] + [[t, .9] for m in marks if m["kind"] == "board" for t, _ in m["lines"]],
    whoosh=[round(shots[5]["t0"] - .1, 3), round(shots[6]["t0"] - .1, 3)],   # вход и выход из воспоминания
)
music = [dict(t=0, part="intro"), dict(t=round(shots[3]["t0"], 3), part="main"), dict(t=round(shots[4]["t0"] + .1, 3), part="stop"),
         dict(t=round(shots[5]["t0"], 3), part="intro"), dict(t=round(shots[7]["t0"], 3), part="main"), dict(t=round(shots[14]["t0"], 3), part="outro")]
TL = dict(size=[1080, 1920], fps=30, duration=END, off=T["off"], words=W, shots=shots, marks=marks, sfx=sfx, music=music, bpm=100, hats=.45)
open(f"{HERE}/timeline2.js", "w").write("window.TL = " + json.dumps(TL, ensure_ascii=False) + ";\n")
os.makedirs(f"{HERE}/out", exist_ok=True)
open(f"{HERE}/out/segs2.js", "w").write("window.SEGS = " + json.dumps([dict(mode="cut", t0=sh["t0"], t1=sh["t1"]) for sh in shots]) + ";\n")
print(f"{END} с, планов {len(shots)} (в среднем {END / len(shots):.2f} с), пометок {len(marks)}")
for sh in shots: print(f"  {sh['clip']}: {sh['t0']:.2f}–{sh['t1']:.2f} ({sh['t1'] - sh['t0']:.2f} с, скорость {sh['rate']})")
