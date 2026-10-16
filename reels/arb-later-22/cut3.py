#!/usr/bin/env python3
"""Монтаж рилса 22 «Почему ты откладываешь свою жизнь» — новый формат (разбор амоБлога: reels/arb-friend-21/AMO_DIFF_v4.md).
8 сцен по 4–9 с вместо 18 коротких планов; внутри сцены 2–5 событий по словам голоса: предметы падают в кадр (layers),
персонаж меняет позу (poses), пометки маркером и надписи «в мире» (TL.worldMarks — в координатах рисунка, едут с камерой),
таймер, уведомления/лента на экране телефона (feed), камера по маршруту (camk), между сценами — смаз (TL.whip). Звук — на каждое событие.
Субтитров и заголовка сверху нет (владелец 16.10).
  python3 cut3.py  → timeline3.js, out/segs3.js
"""
import json, os, re
HERE = os.path.dirname(os.path.abspath(__file__)); OFF = .2
W = [dict(w, s=round(w["s"] + OFF, 3), e=round(w["e"] + OFF, 3)) for w in json.load(open(f"{HERE}/out/voice/words.json"))]
END = round(W[-1]["e"] + 1.3, 2)


def norm(x): return re.sub(r"[^а-яa-z0-9]", "", x.lower().replace("ё", "е"))


def at(p, key=None, nth=0, end=False):
    ws = [w for w in W if w["p"] == p]
    if key is None: return ws[0]["s"]
    k = norm(key); ws = [w for w in ws if (norm(w["w"]) == k if len(k) <= 3 else norm(w["w"]).startswith(k[:5]))]
    assert len(ws) > nth, f"нет слова «{key}» (№{nth}) во фразе {p}"
    return ws[nth]["e" if end else "s"]


QUADS = json.load(open(f"{HERE}/quads.json")) if os.path.exists(f"{HERE}/quads.json") else {}
SIZES = json.load(open(f"{HERE}/out/img/sizes.json")) if os.path.exists(f"{HERE}/out/img/sizes.json") else {}


def screen_h(q, sw):
    d = lambda a, b: ((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2) ** .5
    return round(sw * (d(q[0], q[3]) + d(q[1], q[2])) / (d(q[0], q[1]) + d(q[3], q[2]))) if q else 800


def phone(img, sw=380, **o):   # маленький экран на рисунке → узкий логический экран, чтобы текст был крупнее
    return dict(img=img, quad=QUADS.get(img), sw=sw, sh=screen_h(QUADS.get(img), sw), rad=22, top=f"{img}_top", **o)


def layer(src, x, y, w, t, **o):   # предмет-слой: ширина w в координатах кадра 1080×1920, высота — по пропорциям вырезки
    iw, ih = SIZES[src]; return dict(src=src, x=x, y=y, w=w, h=round(w * ih / iw), t=round(t, 3), **o)


# ---- сцены: (тип, начало (фраза, слово[, №]), параметры) ----
B = lambda p, w, n=0: round(at(p, w, n) - .04, 3)
DROP = dict(anim="drop", dur=.55, from_=900, clipY=1585)   # падают в коробку r02: ниже переднего борта (y≈1585) не видно
SH = [
    ("img", (0, None), dict(img="r01", poses=[dict(t=B(0, "Уже"), img="r01b")], camk=[[0, 360, 640, 1.3], [2.6, 420, 760, 1.18], [4.4, 470, 820, 1.12]])),
    ("img", (1, None), dict(img="r02", camk=[[0, 480, 1250, 1.25], [5.8, 470, 1300, 1.32]], layers=[
        layer("p_dumb", 600, 1370, 210, B(1, "Спортзал"), r=-8, **{k: v for k, v in DROP.items()}),
        layer("p_book", 650, 1300, 140, B(1, "Английский"), r=12, **DROP),
        layer("p_piggy", 615, 1320, 180, B(1, "накопления"), r=-4, **DROP),
        layer("p_bag", 610, 1350, 200, B(1, "Всё"), r=6, **DROP)])),
    ("board", (2, None), dict(cam=[[540, 960, 1.0], [540, 940, 1.04]])),
    ("img", (4, None), dict(img="r04f", camk=[[0, 540, 1150, 1.15], [3.4, 540, 1250, 1.28]])),
    ("clip", (4, "просто"), dict(clip="v04", img="r04b", cam=[[540, 1200, 1.15], [540, 1250, 1.22]])),
    ("img", (5, "план"), dict(img="r05", camk=[[0, 520, 700, 1.9], [2.2, 520, 690, 2.0], [3.4, 540, 1150, 1.08], [4.4, 540, 1180, 1.06]])),
    ("phone", (6, None), phone("r06", screen="feed", lock=True, time="19:42", date="вторник, 16 октября", items=[],
                               camk=[[0, 560, 1000, 1.05], [4.6, 600, 980, 1.2], [5.6, 780, 870, 2.3], [9.3, 780, 870, 2.4]],
                               layers=[layer("p_piggy", 330, 1080, 200, B(6, "Первые"), anim="pop", dur=.4)])),
    ("phone", (7, None), phone("r07", screen="feed", head=dict(name="Шаги с наградой", sub="канал · ссылка в профиле", a="₽", c="#ffd23f"), items=[],
                               camk=[[0, 560, 880, 1.3], [1.1, 410, 840, 2.4], [4.8, 410, 830, 2.5]])),
    ("clip", (8, None), dict(clip="v08b", img="r08b", cam=[[540, 1000, 1.05], [540, 980, 1.1]])),
]
shots = []
for k, (typ, anc, o) in enumerate(SH):
    o = dict(o); t0 = 0 if k == 0 else round(at(*anc) - .08, 3)
    if typ == "clip" and not os.path.exists(f"{HERE}/hf/{o['clip']}.mp4"): typ = "img"
    if typ == "phone" and not o.get("quad"): typ = "img"
    for L in o.get("layers", []):
        if "from_" in L: L["from"] = L.pop("from_")
    for p in o.get("poses", []):   # поза телефона — свои углы экрана и свой верхний слой
        if typ == "phone" and p["img"] in QUADS: p.update(quad=QUADS[p["img"]], top=f"{p['img']}_top", sh=screen_h(QUADS[p["img"]], o["sw"]))
    shots.append(dict(type=typ, t0=t0, **o))
for k, sh in enumerate(shots):
    sh["t1"] = shots[k + 1]["t0"] if k + 1 < len(shots) else END
    if sh["type"] == "clip": sh["rate"] = round(min(1.0, (4.9 - .15) / max(.1, sh["t1"] - sh["t0"] + .1)), 3)
S = {sh.get("clip") or sh.get("img") or sh["type"]: sh for sh in shots}

# телефон на кухне: уведомления банка по словам; на «бонус» — поза «кулак радости»
kit = S["r06"]; rel = lambda p, w, n=0: round(at(p, w, n) - kit["t0"] - .05, 2)
kit["items"] = [dict(t=rel(6, "Оформил"), title="Карта оформлена ✓", size=34),
                dict(t=rel(6, "оплатил"), title="Покупка 350 ₽", body="Продукты у дома", size=34),
                dict(t=rel(6, "бонус"), title="+500 ₽", body="Бонус за первую карту", c="#1f9d47", size=64, ic="#1f9d47")]
if "r06b" in QUADS: kit["poses"] = [dict(t=B(6, "бонус"), img="r06b", quad=QUADS["r06b"], top="r06b_top", sh=screen_h(QUADS["r06b"], kit["sw"]))]
# телефон на балконе: лента канала — маленькие шаги с наградой (без названий банков)
bal = S["r07"]; relb = lambda p, w, n=0: round(at(p, w, n) - bal["t0"] - .05, 2)
STEP = dict(from_="Шаг недели", icon="✓", ic="#2f5bea", size=34)
bal["items"] = [dict(t=relb(7, "маленькие"), title="Карта → бонус новичку", **STEP),
                dict(t=relb(7, "наградой"), title="Кэшбэк: 2 минуты", **STEP),
                dict(t=relb(7, "своём"), title="Накопительный: 1 минута", **STEP)]
for it in bal["items"]: it["from"] = it.pop("from_")

# доска «почему откладываем»: линия + жёлтый акцент (деньги/главное) и красный (ошибка)
bd = S["board"]; b0 = bd["t0"]; Y = "rgba(255,206,0,.55)"
bd["parts"] = [
    dict(t=b0 + .05, text="ПОЧЕМУ «ПОТОМ»?", x=170, y=250, size=110, c="#1e1717"),
    dict(t=b0 + .3, d="M160 290 C 400 275, 700 292, 920 280", w=8, c="#e2283f", dur=.35),
    dict(t=B(2, "прокрастинацию"), text="прокрастинация =", x=170, y=450, size=84, c="#1e1717"),
    dict(t=B(2, "дело") - .1, d="M150 820 h360 a24 24 0 0 1 24 24 v150 a24 24 0 0 1 -24 24 h-360 a24 24 0 0 1 -24 -24 v-150 a24 24 0 0 1 24 -24 Z", dur=.45),
    dict(t=B(2, "дело"), text="ДЕЛО", x=230, y=950, size=110),
    dict(t=B(2, "неприятное") - .25, d="M560 680 C 700 672, 860 690, 990 676", w=46, c=Y, dur=.3),
    dict(t=B(2, "неприятное"), d="M250 700 q -70 0 -70 -60 q 0 -64 76 -62 q 14 -74 96 -72 q 76 2 92 62 q 74 -8 86 56 q 48 14 36 66 q -6 22 -40 10 Z", dur=.5),
    dict(t=B(2, "неприятное") + .3, d="M330 712 l -34 70 l 46 0 l -34 86", c="#e2283f", w=10, dur=.3),
    dict(t=B(2, "неприятное") + .1, text="неприятное", x=575, y=650, size=72, c="#e2283f"),
    dict(t=B(2, "чувство"), text="чувство", x=600, y=730, size=72, c="#e2283f"),
    dict(t=B(2, "него") - .1, d="M820 860 a 30 30 0 1 0 0.1 0 M820 920 L 806 1010 M812 940 L 866 966 M812 940 L 756 918 M806 1010 L 858 1068 M806 1010 L 752 1080 M700 900 h-90 M710 950 h-120 M700 1000 h-90", dur=.5),
    dict(t=B(2, "него") + .2, text="бежим от него", x=600, y=1150, size=64),
    dict(t=B(3, "Поэтому"), text="что сделал Арбузов:", x=150, y=1350, size=80, c="#1e1717"),
    dict(t=B(3, "три") - .05, d="M250 1520 a 70 70 0 1 0 0.1 0", w=40, c=Y, dur=.25),
    dict(t=B(3, "три"), text="1", x=230, y=1550, size=96),
    dict(t=B(3, "три") + .2, d="M540 1520 a 70 70 0 1 0 0.1 0", w=40, c=Y, dur=.25),
    dict(t=B(3, "три") + .2, text="2", x=518, y=1550, size=96),
    dict(t=B(3, "вещи") + .05, d="M830 1520 a 70 70 0 1 0 0.1 0", w=40, c=Y, dur=.25),
    dict(t=B(3, "вещи") + .05, text="3", x=808, y=1550, size=96),
]
# пометки — в координатах рисунка (worldMarks)
MARKS = [
    dict(kind="text", t=(0, "новую"), text="НОВАЯ ЖИЗНЬ!", x=192, y=222, r=-3, c="#fff6a8", size=58),
    *[dict(kind="circle", t=(0, "каждый"), dt=.16 * j, cx=203, cy=320 + 47 * j, rx=19, ry=17, c="#ff4d4d") for j in range(5)],
    dict(kind="text", t=(0, "года"), text="×104", x=560, y=470, r=6, c="#ff4d4d", size=120),
    dict(kind="text", t=(1, "Потом"), text="ПОТОМ", x=330, y=1630, r=-8, c="#ff4d4d", size=120),
    dict(kind="timer", t=(4, "2"), from_=120, x=600, y=380, c="#fff6a8", size=130),
    dict(kind="text", t=(4, "пойти"), text="пойти в зал", x=70, y=560, r=-4, c="#fff6a8", size=90),
    dict(kind="strike", t=(4, "зал"), d="M60 605 L 560 580", c="#ff4d4d"),
    dict(kind="text", t=(4, "кроссовки"), text="надеть кроссовки ✓", x=60, y=440, r=-4, c="#7dff7a", size=90),
    dict(kind="text", t=(5, "план"), text="ЕСЛИ → ТО", x=330, y=470, r=-4, c="#fff6a8", size=48),
    dict(kind="text", t=(5, "7"), text="19:00 →", x=470, y=650, r=-4, c="#1d3c8f", size=34, board=True),
    dict(kind="text", t=(5, "кроссовки"), text="кроссовки", x=468, y=690, r=-4, c="#1d3c8f", size=30, board=True),
    dict(kind="check", t=(5, "двери"), d="M700 1470 L 760 1530 L 870 1400", c="#7dff7a"),
    dict(kind="text", t=(6, "награда"), text="3. награда сразу", x=180, y=300, r=-4, c="#fff6a8", size=80),
    dict(kind="text", t=(7, "Ссылка"), text="ссылка в профиле ↑", x=195, y=505, r=-4, c="#fff6a8", size=40),
    dict(kind="text", t=(8, "понедельника"), text="с понедельника", x=110, y=300, r=-4, c="#ff4d4d", size=96),
    dict(kind="strike", t=(8, "понедельника"), dt=.45, d="M100 345 L 720 320", c="#ff4d4d"),
    dict(kind="text", t=(8, "Сегодня"), text="СЕГОДНЯ ✓", x=150, y=430, r=-5, c="#7dff7a", size=150),
]
marks = []
for m in MARKS:
    m = dict(m); m["t"] = round(at(*m["t"]) - .05 + m.pop("dt", 0), 3)
    if "from_" in m: m["from"] = m.pop("from_")
    marks.append(m)

# звук на каждое событие
def span(a, b): return [round(a["t0"], 3), round(b["t1"], 3)]
evt = lambda sh, it: round(sh["t0"] + it["t"], 3)
drops = [L["t"] + L["dur"] * .36 for L in S["r02"]["layers"]]
sfx = dict(room=[span(S["r01"], S["r02"]), span(S["r04f"], S["r07"])], hum=[span(S["r06"], S["r07"])],
           thud=[round(x, 3) for x in drops], whoosh=[round(sh["t0"] - .06, 3) for sh in shots[1:]],
           beep=[round(B(0, "Уже") + d, 3) for d in (0, .25, .5, .75)],                       # будильник
           tick=[m["t"] + .1 for m in marks if m["kind"] == "circle"],
           ticks=[[at(4, "2"), S["v04"]["t0"]], [S["r05"]["t0"], S["r05"]["t0"] + 2.2]],          # таймер и часы у двери
           notif=[evt(kit, it) for it in kit["items"]] + [evt(bal, it) for it in bal["items"]],
           coin=[round(evt(kit, kit["items"][2]) + d, 3) for d in (.15, .35, .55)], sting=[evt(kit, kit["items"][2])],
           pop=[S["r06"]["layers"][0]["t"]],
           pen=[[m["t"], .45] for m in marks if m["kind"] != "timer"] + [[p["t"], .5] for p in bd["parts"]])
music = [dict(t=0, part="intro"), dict(t=round(S["r02"]["t0"], 3), part="main"), dict(t=round(bd["t0"], 3), part="stop"),
         dict(t=round(S["r04f"]["t0"], 3), part="main"), dict(t=round(S["v08b"]["t0"], 3), part="outro")]
TL = dict(size=[1080, 1920], fps=30, duration=END, off=OFF, words=W, shots=shots, marks=marks, sfx=sfx, music=music, bpm=100, hats=.45,
          grade="saturate(.94) contrast(1.04) sepia(.06)", grain=.05, whip=True, worldMarks=True)
open(f"{HERE}/timeline3.js", "w").write("window.TL = " + json.dumps(TL, ensure_ascii=False) + ";\n")
os.makedirs(f"{HERE}/out", exist_ok=True)
open(f"{HERE}/out/segs3.js", "w").write("window.SEGS = " + json.dumps([dict(mode="cut", t0=sh["t0"], t1=sh["t1"]) for sh in shots]) + ";\n")
print(f"{END} с, сцен {len(shots)} (в среднем {END / len(shots):.2f} с), пометок {len(marks)}, событий доски {len(bd['parts'])}")
for sh in shots: print(f"  {sh['type']:6s} {sh.get('clip') or sh.get('img') or ''}: {sh['t0']:.2f}–{sh['t1']:.2f} ({sh['t1'] - sh['t0']:.2f} с)")
