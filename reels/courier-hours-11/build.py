#!/usr/bin/env python3
"""Рилс #11 «Сколько часов курьером стоит один бонус» — первый на «Рилсах v2» (reel.html + reel.js, 9:16).

Голос «E» (tools/voice_e.py): out/voice/voice.wav. Слова — out/words.json (Whisper по готовому голосу, выровнен по phrases.txt).
  python3 build.py words   — Whisper → out/words.json (venv с faster-whisper)
  python3 build.py         — timeline.js: кадры (по фразам), ключевые слова (ev), субтитры v2, музыка и звуки
"""
import json, os, sys
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
    ws = []
    for i, (t, a) in enumerate(zip(toks, at)):
        g = min(got, key=lambda w: abs(w["a"] - a))
        nxt = at[i + 1] if i + 1 < len(at) else dur
        ws.append({"w": t, "a": round(a, 3), "d": round(max(.08, min(g["d"] if abs(g["a"] - a) < .15 else .35, nxt - a)), 3)})
    json.dump({"duration": round(dur, 3), "words": ws, "heard": " ".join(w["w"] for w in got)}, open(WJ, "w"), ensure_ascii=False, indent=0)
    print(f"{len(ws)} слов, {dur:.1f} с; Whisper: {' '.join(w['w'] for w in got)}"); sys.exit()

W = Words(WJ)
def P(phrase):   # начало фразы: дальше A/E ищут слова от него
    i, j = W._find(phrase); W.cur = i; return round(W.ws[i]["a"], 3)
def A(phrase):
    i, j = W._find(phrase); return round(W.ws[i]["a"], 3)
def E(phrase):
    i, j = W._find(phrase); return round(W.ws[j]["a"] + W.ws[j]["d"], 3)

SHOTS, CAPS = [], []
def shot(id, start, dark=False, capOff=False, **ev):
    SHOTS.append({"id": id, "t0": 0 if not SHOTS else round(start - .08, 3), "ev": ev, "dark": dark, "capOff": capOff})
def caps(*items):   # (время, html): субтитр живёт до следующего
    for t, h in items: CAPS.append({"t0": round(max(0, t - .04), 3), "html": h})
K = lambda s: f'<span class="k">{s}</span>'
R = lambda s: f'<span class="r">{s}</span>'

p = P("Две тысячи рублей")
shot("hook", p, dark=True, six=A("до шести"), kur=A("работы курьером"))
caps((0, K("2 000 ₽")), (A("это до шести"), f"это до {K('6 часов')}"), (A("работы курьером"), f"работы {K('курьером')}"))

p = P("А банк платит")
shot("push", p, same=A("столько же"), card=A("за одну обычную"), buy=A("и одну покупку"))
caps((p, "а банк платит"), (A("столько же"), K("столько же")), (A("за одну обычную"), f"за {K('1 карту')}"), (A("и одну покупку"), f"и {K('1 покупку')}"))

p = P("Курьер в Москве")
shot("search", p, ans=A("от трёхсот"), src=A("это данные"))
caps((p, "курьер в москве"), (A("от трёхсот"), f"{K('350–500 ₽')} в час"), (A("это данные"), f"данные {K('вакансий')}"))

p = P("А бонус новому")
shot("edit", p, dark=True, bonus=A("от тысячи"), top=A("до двух"))
caps((p, f"а бонус {K('новичку')}"), (A("от тысячи"), f"от {K('1 000')}"), (A("до двух"), f"до {K('2 000 ₽')}"))

p = P("Заявка занимает")
shot("ai", p, mins=A("несколько минут"), buy=A("всего одна"))
caps((p, f"заявка — {K('минуты')}"), (A("а потом"), f"и {K('1 покупка')}"))

p = P("Главное правило")
shot("office", p, new=A("только новым"), buy=A("и только за"), tr=A("переводы не"))
caps((p, f"главное {K('правило')}"), (A("только новым"), f"только {K('новым')}"), (A("и только за"), f"только {K('покупки')}"),
     (A("переводы не"), f"переводы {R('не считаются')}"))

p = P("И проверь")
shot("stamp", p, dark=True, free=A("бесплатное"), eat=A("съест весь"))
caps((p, f"проверь {K('обслуживание')}"), (A("иначе оно"), f"иначе {R('съест бонус')}"))

p = P("Какие банки платят")
shot("tg", p, capOff=True, link=A("ссылка в профиле"))
caps((p, ""))

p = P("Так что")
shot("loop", p, dark=True, hand=A("прежде чем"), cut=A("вспомни"))
caps((p, f"прежде чем {K('брать смену')}"), (A("вспомни"), K("вспомни")))

END = round(E("вспомни") + .45, 2)
for i, s in enumerate(SHOTS):
    s["t1"] = SHOTS[i + 1]["t0"] if i + 1 < len(SHOTS) else END
for i, c in enumerate(CAPS):
    c["t1"] = CAPS[i + 1]["t0"] if i + 1 < len(CAPS) else END
CAPS = [c for c in CAPS if c["html"]]

r2 = lambda x: round(x, 3)
sfx = {k: [] for k in ("whoosh", "impact", "pop", "ticks", "coin", "sting", "thud", "ui", "notif", "mark")}
sfx["impact"].append(.02)
for s in SHOTS[1:]: sfx["whoosh"].append(r2(s["t0"] - .15))
ev = {s["id"]: s["ev"] for s in SHOTS}
sfx["pop"] += [ev["hook"]["six"], ev["push"]["card"], ev["push"]["buy"], ev["stamp"]["free"]]
sfx["mark"] += [ev["hook"]["kur"], ev["office"]["new"], ev["office"]["buy"], ev["office"]["tr"]]
sfx["notif"].append(ev["push"]["same"]); sfx["ui"] += [ev["search"]["ans"], ev["tg"]["link"]]
sfx["ticks"].append([SHOTS[2]["t0"] + .1, ev["search"]["ans"] - .25])
sfx["coin"] += [ev["edit"]["top"]]; sfx["thud"] += [ev["stamp"]["eat"]]; sfx["sting"] += [ev["ai"]["mins"]]
music = [{"t": 0, "part": "main"}, {"t": r2(SHOTS[-2]["t0"]), "part": "outro"}]
tl = {"size": [1080, 1920], "duration": END, "fps": 30, "shots": SHOTS, "caps": CAPS, "music": music,
      "sfx": {k: sorted(v) if k != "ticks" else v for k, v in sfx.items()}, "bpm": 104, "hats": .7,
      "foot": "Условия зависят от банка и акции. Не реклама конкретного банка"}
open(os.path.join(DIR, "timeline.js"), "w").write("window.TL = " + json.dumps(tl, ensure_ascii=False) + ";\n")
print(f"кадров {len(SHOTS)}, длительность {END:.1f} с")
for s in SHOTS: print(f"  {s['t0']:5.2f}–{s['t1']:5.2f} {s['id']:7s} " + " ".join(f"{k}={v - s['t0']:.2f}" for k, v in s["ev"].items()))
gaps = []
for s in SHOTS:
    pts = [s["t0"]] + sorted(s["ev"].values()) + [s["t1"]]
    gaps += [b - a for a, b in zip(pts, pts[1:])]
print(f"самый длинный план без смены: {max(gaps):.1f} с (цель 1,5–2 с)")
