#!/usr/bin/env python3
"""Рилс #13 «Предодобрено — не одобрено»: стиль A «тёмный финтех» (владелец 12.10: «вариант номер 1»), голос Василия.
  <python с whisper> build.py words — Whisper → out/words.json (по phrases.txt)
  python3 build.py               — timeline.js: куски субтитров (2–3 слова), сцены с событиями, звуки
Разметка CHUNKS: «|» — новый кусок; *слово* — голубой (действие), ~слово~ — зелёный (выгода), ^слово^ — красный (потеря).
"""
import json, os, re, sys
DIR = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(os.path.dirname(DIR))
sys.path.insert(0, os.path.join(ROOT, "youtube", "kit"))
from anchors import Words, norm
WJ = os.path.join(DIR, "out", "words.json")
TEXT = " ".join(l.strip() for l in open(os.path.join(DIR, "phrases.txt"), encoding="utf-8") if l.strip())

if sys.argv[1:] == ["words"]:
    sys.path.insert(0, os.path.join(ROOT, "reels", "zero-card-07"))
    import voice as V, subprocess
    src, f16 = os.path.join(DIR, "out", "voice", "voice.wav"), os.path.join(DIR, "out", "voice16.wav")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", src, "-ar", "16000", "-ac", "1", f16], check=True)
    got = V.transcribe(f16, "medium"); toks = [t for t in TEXT.split() if norm(t)]; at = V.align(" ".join(toks), got)
    dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", src], capture_output=True, text=True).stdout)
    ws = []
    for i, (t, a) in enumerate(zip(toks, at)):
        g = min(got, key=lambda w: abs(w["a"] - a)); nxt = at[i + 1] if i + 1 < len(at) else dur
        ws.append({"w": t, "a": round(a, 3), "d": round(max(.08, min(g["d"] if abs(g["a"] - a) < .15 else .35, nxt - a)), 3)})
    json.dump({"duration": round(dur, 3), "words": ws}, open(WJ, "w"), ensure_ascii=False, indent=0)
    print(f"{len(ws)} слов, {dur:.1f} с; Whisper: {' '.join(w['w'] for w in got)}"); sys.exit()

W = Words(WJ); VW = W.ws
CHUNKS = """
Час ночи. | Пуш от *банка:* | «Вам предодобрена | кредитная карта».
Звучит как ~подарок.~ | Но «предодобрено» — | это не ^«одобрено».^
Это *рассылка:* | банк прикинул | по общим данным, | что тебе можно | что-то предложить.
Нажмёшь *«Оформить»* — | и это уже *заявка.* | Банк запросит | твою кредитную историю, | и это будет | в ней ^видно.^
Много заявок ^подряд^ — | для банков это | ^тревожный^ сигнал.
Кредитка бывает ~полезной.~ | Но открывай её, | когда решил *сам,* | а не когда | тебе написали ночью.
Как пользоваться кредиткой | и не платить ~проценты~ — | у меня в *телеграме,* | ссылка в профиле.
"""
CLS = {"*": "k", "~": "g", "^": "r"}
shown, chunks, vi = [], [], 0
for piece in [p.strip() for p in CHUNKS.replace("\n", " | ").split("|") if p.strip()]:
    i0 = len(shown)
    for tok in piece.split():
        m = re.match(r"^([«]?)([*~^])(.+?)\2(.*)$", tok)
        cls, word = (CLS[m.group(2)], m.group(1) + m.group(3) + m.group(4)) if m else ("", tok)
        if not norm(word): shown[-1]["w"] += " " + word; continue
        assert norm(VW[vi]["w"])[:4] == norm(word)[:4], f"рассинхрон: «{word}» ↔ «{VW[vi]['w']}» ({vi})"
        shown.append({"w": word, "a": VW[vi]["a"], "c": cls}); vi += 1
    chunks.append({"i0": i0, "i1": len(shown) - 1})
assert vi == len(VW), f"в кусках {vi} слов, в голосе {len(VW)}"
END = round(VW[-1]["a"] + VW[-1]["d"] + .6, 2)
def A(ph): i, j = W._find(ph); return round(W.ws[i]["a"], 3)
def P(ph): i, j = W._find(ph); W.cur = i; return round(W.ws[i]["a"], 3)
SC = []
def scene(id, start, **ev): SC.append({"id": id, "t0": 0 if not SC else round(start - .12, 3), "ev": ev})
p = P("Час ночи"); scene("s_hook", p, push=A("Пуш от"), gift=A("Звучит как"))
p = P("Но предодобрено"); scene("s_ne", p, ne=A("это не"))
p = P("Это рассылка"); scene("s_fan", p, chip=A("рассылка"), data=A("по общим"))
p = P("Нажмёшь Оформить"); scene("s_apply", p, tap=A("Оформить"), row=A("уже заявка"), hist=A("кредитную историю"), seen=A("в ней видно"))
p = P("Много заявок"); scene("s_many", p, stamp=A("тревожный сигнал"))
p = P("Кредитка бывает"); scene("s_self", p, self_=A("решил сам"), night=A("написали ночью"))
p = P("Как пользоваться"); scene("s_tg", p, btn=A("ссылка в профиле"))
for i, s in enumerate(SC): s["t1"] = SC[i + 1]["t0"] if i + 1 < len(SC) else END
for k, c in enumerate(chunks): c["t0"] = 0 if k == 0 else round(shown[c["i0"]]["a"] - .08, 3)
for k, c in enumerate(chunks): c["t1"] = chunks[k + 1]["t0"] if k + 1 < len(chunks) else END
r2 = lambda x: round(x, 3); ev = {s["id"]: s["ev"] for s in SC}
sfx = {"whoosh": [r2(s["t0"] - .08) for s in SC[1:]], "notif": [ev["s_hook"]["push"]], "impact": [ev["s_ne"]["ne"], ev["s_many"]["stamp"]],
       "pop": [ev["s_fan"]["chip"], ev["s_apply"]["row"], ev["s_self"]["self_"]], "click": [ev["s_apply"]["tap"], ev["s_tg"]["btn"]],
       "paper": [ev["s_apply"]["hist"]], "thud": [ev["s_many"]["stamp"] + .05]}
tl = {"size": [1080, 1920], "duration": END, "fps": 30, "words": shown, "chunks": chunks, "scenes": SC,
      "music": [{"t": 0, "part": "main"}, {"t": r2(SC[-1]["t0"]), "part": "outro"}], "sfx": {k: sorted(v) for k, v in sfx.items()}, "bpm": 96, "hats": .5}
open(os.path.join(DIR, "timeline.js"), "w").write("window.TL = " + json.dumps(tl, ensure_ascii=False) + ";\n")
print(f"сцен {len(SC)}, кусков {len(chunks)}, слов {len(shown)}, {END:.1f} с"); [print(f"  {s['t0']:5.2f}–{s['t1']:5.2f} {s['id']} {s['ev']}") for s in SC]
