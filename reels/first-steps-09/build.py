#!/usr/bin/env python3
"""Рилс #9 на «Студии» 9:16: python3 build.py -> timeline.js (страница reel.html).

Голос — «E» (tools/voice_e.py, без записи владельца): out/voice/voice.wav. Слова — out/words.json: Whisper по готовому голосу,
выровненный по тексту сценария (phrases.txt), поэтому якоря и субтитры пишутся словами сценария, а не как расслышал Whisper.
  python3 build.py words   — Whisper → out/words.json (нужен venv с faster-whisper)
  python3 build.py         — timeline.js
"""
import json, os, re, sys
DIR = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(DIR))
sys.path.insert(0, os.path.join(ROOT, "youtube", "kit"))
from anchors import Words, norm

WJ = os.path.join(DIR, "out", "words.json")
TEXT = " ".join(l.strip() for l in open(os.path.join(DIR, "phrases.txt"), encoding="utf-8") if l.strip())

if sys.argv[1:] == ["words"]:
    sys.path.insert(0, os.path.join(ROOT, "reels", "zero-card-07"))
    import voice as V, subprocess
    src, f16 = os.path.join(DIR, "out", "voice", "voice.wav"), os.path.join(DIR, "out", "voice16.wav")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", src, "-ar", "16000", "-ac", "1", f16], check=True)
    got = V.transcribe(f16, "medium")
    toks = [t for t in TEXT.split() if norm(t)]
    at = V.align(" ".join(toks), got)
    dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", src],
                               capture_output=True, text=True).stdout)
    # конец слова: по слову Whisper, которое ближе всего по времени начала; не дальше начала следующего
    ws = []
    for i, (t, a) in enumerate(zip(toks, at)):
        g = min(got, key=lambda w: abs(w["a"] - a))
        nxt = at[i + 1] if i + 1 < len(at) else dur
        ws.append({"w": t, "a": round(a, 3), "d": round(max(.08, min(g["d"] if abs(g["a"] - a) < .15 else .35, nxt - a)), 3)})
    json.dump({"duration": round(dur, 3), "words": ws, "heard": " ".join(w["w"] for w in got)}, open(WJ, "w"), ensure_ascii=False, indent=0)
    print(f"{len(ws)} слов, {dur:.1f} с; Whisper: {' '.join(w['w'] for w in got)}"); sys.exit()

W = Words(WJ)
MAXC, BASE = [0], [0]


def T(phrase):
    W.cur = MAXC[0]; i, j = W._find(phrase); BASE[0] = i; MAXC[0] = max(MAXC[0], i + 1)
    return round(W.ws[i]["a"], 3)


def A(phrase):
    W.cur = BASE[0]; i, j = W._find(phrase); MAXC[0] = max(MAXC[0], i + 1)
    return round(W.ws[i]["a"], 3)


def E(phrase):
    W.cur = BASE[0]; i, j = W._find(phrase); MAXC[0] = max(MAXC[0], j + 1)
    return round(W.ws[j]["a"] + W.ws[j]["d"], 3)


SC = []


def scene(t0, **s):
    s["t0"] = round(max(0, t0 - .1), 3); SC.append(s); return s


def kin(t, lines, acc="g", size=170, sub=None):
    """lines: [[(слово, время, акцент?)]]"""
    return scene(t, type="kinetic", acc=acc, size=size, align="c",
                 lines=[[{"w": w, "at": a, **({"c": acc} if c else {})} for w, a, c in ln] for ln in lines],
                 **({"sub": sub} if sub else {}))


# ---------------- 0. Хук: кадр 0 уже с текстом ----------------
t = T("Если бы мне")
kin(0, [[("18", 0, True), ("лет", .12, False)], [("0", .3, True), ("₽", .4, False)]], size=230,
    sub={"t": "3 шага, чтобы банки платили тебе", "at": .7})
SC[0]["t0"] = 0
t = T("И банки платили")
kin(t, [[("Банки", t, False), ("платят", A("платили"), False)], [("тебе", A("мне"), True)], [("а", A("а не"), False), ("не", A("не наоборот"), False), ("наоборот", A("наоборот"), False)]], size=150)

# ---------------- 1. Дебетовая с бонусом ----------------
t = T("Шаг первый")
scene(t, type="card", acc="g", n="1", kicker="шаг", title="Дебетовая с бонусом", brand="DEBIT", titleAt=t + .15)
t = T("Кредитного риска")
scene(t, type="split", acc="g", title="Дебетовая карта",
      l={"k": "кредитный риск", "v": "0", "c": "g", "at": t},
      r={"k": "банк платит", "v": "бонус", "sub": "просто за то, что пришёл", "c": "y", "at": A("банк платит")}, mid="+")

# ---------------- 2. Накопительный ----------------
t = T("Шаг второй")
scene(t, type="card", acc="b", n="2", kicker="шаг", title="Накопи&shy;тельный счёт", brand="SAVINGS", titleAt=t + .15)
t = T("Новичкам банки")
scene(t, type="bars", acc="g", title="Новичкам платят больше", max=18, dec=1,
      bars=[{"label": "Деньги просто на карте", "v": 0, "c": "r", "at": t + .1},
            {"label": "Приветственная ставка*", "v": 15.5, "c": "g", "at": A("платят больше")}],
      note="* пример: 15,5&nbsp;% первые 3&nbsp;месяца, условия на&nbsp;30.09.2026")

# ---------------- 3. Кредитка — последней ----------------
t = T("Шаг третий")
scene(t, type="card", acc="y", n="3", kicker="шаг · и только потом", title="Кредитка", brand="CREDIT", titleAt=t + .15)
t = T("Когда ты уверен")
scene(t, type="cal", acc="g", title="Льготный период", days=35, **{"from": 1}, to=30, a=t, b=E("льготного периода"),
      marks=[{"d": 30, "text": "вернул всё", "c": "g", "at": A("вернёшь всё")}])
t = T("Иначе заплатишь")
scene(t, type="stamp", acc="r", text="≈ 50 % годовых", at=A("пятьдесят"), sub="средняя ПСК кредиток — 48&nbsp;% и&nbsp;выше (ОКБ,&nbsp;2026)")

# ---------------- 4. CTA ----------------
t = T("Какие банки платят")
scene(t, type="tg", acc="g", name="Бонусы банков", text="Какие банки платят новичкам прямо сейчас",
      items=[{"t": "сколько и за что — собираю и обновляю", "at": A("я собираю")}], link={"t": "в профиле ↑", "at": A("в профиле")})
t = T("Отправь этот ролик")
scene(t, type="list", acc="g", title="Отправь другу, которому 18",
      items=[{"t": "Дебетовая с бонусом", "at": t + .1, "mk": "n"},
             {"t": "Накопительный счёт", "at": t + .35, "mk": "n"},
             {"t": "Кредитка — последней", "at": t + .6, "mk": "n", "c": "y"}])
END = round(E("сейчас восемнадцать") + 1.6, 2)

# ---------------- без пустого экрана: сцена начинается за 0,35 с до своего первого элемента ----------------
def first_at(s):
    ts = [s[k] for k in ("a", "at", "titleAt") if isinstance(s.get(k), (int, float))]
    for k in ("lines", "items", "bars", "marks"):
        for x in s.get(k) or []:
            if isinstance(x, list): ts += [w["at"] for w in x]
            elif isinstance(x, dict) and "at" in x: ts.append(x["at"])
    for k in ("l", "r", "link"):
        if isinstance(s.get(k), dict) and "at" in s[k]: ts.append(s[k]["at"])
    return min(ts) if ts else None
for s in SC[1:]:
    f = first_at(s)
    if f is not None and f - s["t0"] > .45: s["t0"] = round(f - .35, 3)

# ---------------- переходы, удары, звук ----------------
for i, s in enumerate(SC):
    s["t1"] = SC[i + 1]["t0"] if i + 1 < len(SC) else END
    s.setdefault("push", 1.06)
    s["tin"] = "zoom" if s["type"] in ("card", "tg", "stamp") else ("whip" if i % 2 else "zoom")
for i, s in enumerate(SC[:-1]):
    if SC[i + 1]["tin"] in ("zoom", "whip"): s["tout"] = SC[i + 1]["tin"]
SC[0]["tin"] = "cut"

r2 = lambda x: round(x, 3)
hits, kick, music = [], [], [{"t": 0, "part": "main"}]
sfx = {k: [] for k in ("whoosh", "impact", "pop", "ticks", "coin", "sting", "thud", "riser", "ui")}
sfx["impact"].append(.02); kick.append({"t": .02, "a": .05})
for s in SC:
    t0, ty = s["t0"], s["type"]
    if s["tin"] in ("zoom", "whip") and t0 > .3: sfx["whoosh"].append(r2(t0 - .18))
    hits.append({"t": r2(t0 + .1), **({"kind": "flash"} if ty == "card" else {})})
    if ty == "card":
        sfx["sting"].append(r2(t0 + .1)); kick.append({"t": r2(t0 + .1), "a": .06})
    elif ty == "stamp":
        sfx["impact"].append(r2(s["at"])); hits.append({"t": r2(s["at"]), "kind": "flash"}); kick.append({"t": r2(s["at"]), "a": .06})
    elif ty == "kinetic":
        for ln in s["lines"]:
            for w in ln:
                if w.get("c") and w["at"] > .5: kick.append({"t": r2(w["at"]), "a": .03})
    elif ty == "list":
        for it in s["items"]: sfx["pop"].append(r2(it["at"]))
    elif ty in ("bars", "split"):
        for it in s.get("bars") or [s["l"], s["r"]]: sfx["ui"].append(r2(it["at"]))
    elif ty == "cal":
        sfx["ticks"].append([r2(s["a"]), r2(s["b"])]); sfx["coin"].append(r2(s["marks"][0]["at"]))
    elif ty == "tg":
        sfx["pop"].append(r2(s["link"]["at"]))
music.append({"t": r2(SC[-2]["t0"]), "part": "outro"})

caps = [{"w": re.sub(r"^(восемнадцать)", "18", re.sub(r"^ноль$", "0", w["w"].lower())).replace("пятьдесят", "50"), "a": w["a"], "d": w["d"]}
        for w in W.ws_all]
tl = {"size": [1080, 1920], "duration": END, "fps": 30, "scenes": SC, "hits": hits, "kick": kick, "music": music, "sfx": sfx,
      "bpm": 104, "hats": .7, "caps": caps, "progress": False,   # полоса прогресса убрана по просьбе владельца (09.10)
     
      "foot": "Условия зависят от банка и акции. Не реклама конкретного банка"}
open(os.path.join(DIR, "timeline.js"), "w").write("window.TL = " + json.dumps(tl, ensure_ascii=False) + ";\n")
lens = [s["t1"] - s["t0"] for s in SC]
print(f"сцен {len(SC)}, длительность {END:.1f} с, самая длинная {max(lens):.1f} с ({SC[lens.index(max(lens))]['type']})")
for s in SC: print(f"  {s['t0']:5.2f}–{s['t1']:5.2f} {s['type']}")
