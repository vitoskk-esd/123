#!/usr/bin/env python3
"""Рилс #14 «За друга с кредиткой — до 4 раз больше»: стиль D «Кинетика на светлом» (владелец 13.10), голос Василия.
  <python с whisper> build.py words — Whisper → out/words.json (по phrases.txt)
  python3 build.py               — timeline.js: куски субтитров (2–3 слова), сцены с событиями, звуки
Разметка CHUNKS: «|» — новый кусок; *слово* — фиолетовый (действие), ~слово~ — зелёный (выгода), ^слово^ — красный (потеря).
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
# --- ниже: куски и сцены рилса #14 ---
CHUNKS = """
За одного | друга банк | заплатит тебе ~тысячу.~ | За другого — | до ~четырёх.~ | А разница | в *одной* *карте.*
Друг оформил | по твоей ссылке | *обычную* *карту* — | тебе обычно платят | от ~тысячи~ | до ~тысячи~ ~восьмисот~ рублей.
А если он | оформил *кредитку* — | бывает ~две~ с ~половиной~ | и даже ~четыре~ ~тысячи~.
Почему банк | такой *щедрый?* | Клиент с кредиткой | ему выгоднее всех: | банк ждёт, | что ты ^не^ ^уложишься^ | в срок | и заплатишь ^проценты.^
А средняя | полная стоимость | по кредиткам — | под ^пятьдесят^ ^процентов^ | годовых.
Правило одно: | *гаси* *всё* | до конца | льготного периода, | и проценты — ~ноль.~ | Друг не уверен, | что вернёт вовремя, — | ^не^ ^уговаривай^.
Какие кредитки | самые выгодные — | скоро разберу | на *ютубе.* | *Подпишись.*
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
END = round(VW[-1]["a"] + VW[-1]["d"] + .8, 2)
def A(ph): i, j = W._find(ph); return round(W.ws[i]["a"], 3)
def P(ph): i, j = W._find(ph); W.cur = i; return round(W.ws[i]["a"], 3)
SC = []
def scene(id, start, **ev): SC.append({"id": id, "t0": 0 if not SC else round(start - .12, 3), "ev": ev})
p = P("За одного друга"); scene("s_hook", p, one=A("тысячу"), four=A("до четырёх"), card=A("в одной карте"))
p = P("Друг оформил"); scene("s_debit", p, link=A("по твоей ссылке"), sum=A("от тысячи"))
p = P("А если он"); scene("s_credit", p, card=A("кредитку"), sum=A("две с половиной"), four=A("четыре тысячи"))
p = P("Почему банк"); scene("s_why", p, best=A("выгоднее всех"), late=A("не уложишься"), pct=A("заплатишь проценты"))
p = P("А средняя"); scene("s_psk", p, num=A("под пятьдесят"))
p = P("Правило одно"); scene("s_rule", p, pay=A("гаси всё"), zero=A("и проценты"), friend=A("Друг не уверен"), no=A("не уговаривай"))
p = P("Какие кредитки"); scene("s_cta", p, yt=A("на ютубе"), sub=A("Подпишись"))
for i, s in enumerate(SC): s["t1"] = SC[i + 1]["t0"] if i + 1 < len(SC) else END
for k, c in enumerate(chunks): c["t0"] = 0 if k == 0 else round(shown[c["i0"]]["a"] - .08, 3)
for k, c in enumerate(chunks): c["t1"] = chunks[k + 1]["t0"] if k + 1 < len(chunks) else END
r2 = lambda x: round(x, 3); ev = {s["id"]: s["ev"] for s in SC}
sfx = {"whoosh": [r2(s["t0"] - .08) for s in SC[1:]],
       "coin": [ev["s_hook"]["one"], ev["s_hook"]["four"], ev["s_debit"]["sum"], ev["s_credit"]["sum"], ev["s_credit"]["four"]],
       "pop": [ev["s_hook"]["card"], ev["s_debit"]["link"], ev["s_why"]["best"], ev["s_rule"]["friend"]],
       "impact": [ev["s_psk"]["num"], ev["s_rule"]["no"]], "notif": [ev["s_rule"]["zero"]],
       "click": [ev["s_cta"]["sub"]], "tick": [ev["s_why"]["pct"]]}
tl = {"size": [1080, 1920], "duration": END, "fps": 30, "words": shown, "chunks": chunks, "scenes": SC,
      "music": [{"t": 0, "part": "main"}, {"t": r2(SC[-1]["t0"]), "part": "outro"}], "sfx": {k: sorted(v) for k, v in sfx.items()}, "bpm": 100, "hats": .5}
open(os.path.join(DIR, "timeline.js"), "w").write("window.TL = " + json.dumps(tl, ensure_ascii=False) + ";\n")
print(f"сцен {len(SC)}, кусков {len(chunks)}, слов {len(shown)}, {END:.1f} с"); [print(f"  {s['t0']:5.2f}–{s['t1']:5.2f} {s['id']} {s['ev']}") for s in SC]
