#!/usr/bin/env python3
"""Рилс #10 «Сколько бонусов ты не забрал за год» на «Студии» 9:16: python3 build.py -> timeline.js (страница reel.html).

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
t = T("Ты отказался")
kin(0, [[("−10\u00a0000\u00a0₽", 0, True)], [("за", .25, False), ("год", .35, False)]], acc="r", size=200,
    sub={"t": "и ты даже этого не заметил", "at": A("даже этого")})
SC[0]["t0"] = 0

# ---------------- 1. Бонус за карту ----------------
t = T("Банки платят новым")
scene(t, type="count", acc="g", c="g", **{"from": 0}, to=2000, a=A("от тысячи"), b=E("двух тысяч"), unit=" ₽",
      label="бонус новому клиенту за одну карту", labelAt=A("за одну карту"))
t = T("Такие акции")
scene(t, type="list", acc="g", title="Акции для новых клиентов",
      items=[{"t": "Бонус за первую покупку", "at": t + .1, "mk": "ok"},
             {"t": "Сертификат на маркетплейс", "at": A("идут постоянно"), "mk": "ok"},
             {"t": "У каждого банка — своя", "at": A("у каждого"), "mk": "ok", "c": "y"}])
t = T("Пять новых карт")
scene(t, type="calc", acc="g", lines=[{"t": "5 карт за год", "at": t}, {"t": "× 1\u00a0000–2\u00a0000 ₽", "at": A("это уже")}],
      res={"v": "5–10 тыс. ₽", "at": A("от пяти"), "c": "g"})

# ---------------- 2. Накопительный ----------------
t = T("Плюс накопительный")
scene(t, type="bars", acc="g", title="Новичкам платят больше", max=18, dec=1,
      bars=[{"label": "Деньги просто на карте", "v": 0, "c": "r", "at": t + .1},
            {"label": "Приветственная ставка*", "v": 15, "c": "g", "at": A("пятнадцать процентов")}],
      note="* пример: 15–15,5\u00a0% первые 2–3\u00a0месяца, условия на\u00a030.09.2026")
t = T("Десять тысяч на таком")
scene(t, type="calc", acc="g", lines=[{"t": "10\u00a0000 ₽ × 15\u00a0%", "at": t}, {"t": "× 3 мес. из 12", "at": A("за три месяца")}],
      res={"v": "≈ 375 ₽", "at": A("почти четыреста"), "c": "g"})

# ---------------- 3. Условия ----------------
t = T("Главное читай условия")
scene(t, type="list", acc="y", title="Читай условия",
      items=[{"t": "Только новым клиентам", "at": A("только новым"), "mk": "ok"},
             {"t": "Только за покупки", "at": A("только за покупки"), "mk": "ok"},
             {"t": "Переводы не считаются", "at": A("а не за"), "mk": "no"}])
t = T("И не плати")
scene(t, type="stamp", acc="r", text="Платное обслуживание", at=A("съест весь"), sub="съест весь бонус — выбирай бесплатное")

# ---------------- 4. CTA ----------------
t = T("Какие банки платят")
scene(t, type="tg", acc="g", name="Бонусы банков", text="Какие банки платят новичкам прямо сейчас",
      items=[{"t": "сколько и за что — собираю и обновляю", "at": A("я собираю")}], link={"t": "в профиле ↑", "at": A("в профиле")})
t = T("Отправь этот ролик")
kin(t, [[("до", t, False), ("10\u00a0000\u00a0₽", A("этот ролик"), True)], [("в", A("другу"), False), ("год", A("другу") + .1, False)]], acc="g", size=170,
    sub={"t": "отправь другу, который ещё ничего не забрал", "at": A("который до")})
END = round(E("у банков") + 1.6, 2)

# ---------------- без пустого экрана: сцена начинается за 0,35 с до своего первого элемента ----------------
def first_at(s):
    ts = [s[k] for k in ("a", "at", "titleAt") if isinstance(s.get(k), (int, float))]
    for k in ("lines", "items", "bars", "marks"):
        for x in s.get(k) or []:
            if isinstance(x, list): ts += [w["at"] for w in x]
            elif isinstance(x, dict) and "at" in x: ts.append(x["at"])
    for k in ("l", "r", "link", "res"):
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
    elif ty == "count":
        sfx["ticks"].append([r2(s["a"]), r2(s["b"])]); sfx["coin"].append(r2(s["b"]))
    elif ty == "calc":
        for it in s["lines"]: sfx["ui"].append(r2(it["at"]))
        sfx["thud"].append(r2(s["res"]["at"]))
    elif ty == "tg":
        sfx["pop"].append(r2(s["link"]["at"]))
music.append({"t": r2(SC[-2]["t0"]), "part": "outro"})

caps = [{"w": w["w"].lower(), "a": w["a"], "d": w["d"]} for w in W.ws_all]
tl = {"size": [1080, 1920], "duration": END, "fps": 30, "scenes": SC, "hits": hits, "kick": kick, "music": music, "sfx": sfx,
      "bpm": 104, "hats": .7, "caps": caps, "progress": False,   # полоса прогресса убрана по просьбе владельца (09.10)
     
      "foot": "Условия зависят от банка и акции. Не реклама конкретного банка"}
open(os.path.join(DIR, "timeline.js"), "w").write("window.TL = " + json.dumps(tl, ensure_ascii=False) + ";\n")
lens = [s["t1"] - s["t0"] for s in SC]
print(f"сцен {len(SC)}, длительность {END:.1f} с, самая длинная {max(lens):.1f} с ({SC[lens.index(max(lens))]['type']})")
for s in SC: print(f"  {s['t0']:5.2f}–{s['t1']:5.2f} {s['type']}")
