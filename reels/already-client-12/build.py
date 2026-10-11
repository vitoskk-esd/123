#!/usr/bin/env python3
"""Рилс #12 «Где ты уже клиент?» — монтаж по референсам владельца (кинетическая типографика + карточки, светлый фон).

  python3 build.py words   — Whisper → out/words.json (выровнен по phrases.txt)
  python3 build.py         — timeline.js: слова с выделениями, куски текста (chunks), сцены с событиями и кликами, звук

Разметка кусков текста: «|» — новый кусок; *слово* — синий, _слово_ — курсив с засечками синим, !слово! — курсив красным,
~слово~ — курсив зелёным, ^слово^ — красный; {слова голоса=показать} — несколько слов голоса одним показом (числа цифрами).
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
    dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", src], capture_output=True, text=True).stdout)
    ws = []
    for i, (t, a) in enumerate(zip(toks, at)):
        g = min(got, key=lambda w: abs(w["a"] - a)); nxt = at[i + 1] if i + 1 < len(at) else dur
        ws.append({"w": t, "a": round(a, 3), "d": round(max(.08, min(g["d"] if abs(g["a"] - a) < .15 else .35, nxt - a)), 3)})
    json.dump({"duration": round(dur, 3), "words": ws}, open(WJ, "w"), ensure_ascii=False, indent=0)
    print(f"{len(ws)} слов, {dur:.1f} с; Whisper: {' '.join(w['w'] for w in got)}"); sys.exit()

W = Words(WJ)
VW = W.ws   # слова голоса (только со смыслом), по порядку = токены phrases.txt

CHUNKS = """
Оформил карту | ради *бонуса,* | а банк считает тебя | !старым! клиентом.
И бонуса не будет: | его платят только тем, | кто пришёл в банк _впервые._
Самое _обидное_ — | ты мог даже не помнить, | что у тебя там был счёт: | карта для стипендии, | зарплатная или детская.
Узнать это можно | за {две минуты=2 минуты} | в личном кабинете налоговой.
Заходишь через Госуслуги | и открываешь раздел | «Сведения о банковских счетах».
Там все твои банки, | номера счетов, | даты открытия и закрытия, | начиная с {две тысячи четырнадцатого=2014} года.
Банка нет в списке — | значит, для него ты _новичок,_ | и бонус ~твой.~
Подробная инструкция | лежит у меня в телеграме — | ссылка в профиле.
Так что, прежде чем оформлять | *новую* карту, | вспомни:
"""
CLS = {"*": "k", "_": "s", "!": "sr", "~": "sg", "^": "r"}

# --- слова на экране: токены кусков сопоставляются со словами голоса по порядку ---
shown, chunks, vi = [], [], 0
for piece in [p.strip() for p in CHUNKS.replace("\n", " | ").split("|") if p.strip()]:
    i0 = len(shown)
    for tok in re.findall(r"\{[^}]*\}|\S+", piece):
        if tok.startswith("{"):
            said, disp = tok[1:-1].split("="); n = len([x for x in said.split() if norm(x)])
            shown.append({"w": disp, "a": VW[vi]["a"], "c": "k"}); vi += n; continue
        m = re.match(r"^([*_!~^])(.+?)\1([^\w]*)$", tok) or re.match(r"^([*_!~^])(.+)$", tok)
        cls, word = (CLS[m.group(1)], m.group(2) + (m.group(3) if m.lastindex and m.lastindex >= 3 and m.group(3) else "")) if m else ("", tok)
        word = word.replace("*", "").replace("~", "").replace("_", "").replace("!", "") if cls else word
        if not norm(word): shown[-1]["w"] += " " + word; continue        # «—» и т. п. — к предыдущему слову
        assert vi < len(VW), f"слов в кусках больше, чем в голосе: {word}"
        assert norm(VW[vi]["w"])[:4] == norm(word)[:4], f"рассинхрон: «{word}» ↔ «{VW[vi]['w']}» (слово {vi})"
        shown.append({"w": word, "a": VW[vi]["a"], "c": cls}); vi += 1
    chunks.append({"i0": i0, "i1": len(shown) - 1})
assert vi == len(VW), f"в кусках {vi} слов, в голосе {len(VW)}"
END = round(VW[-1]["a"] + VW[-1]["d"] + .5, 2)

def A(phrase):
    i, j = W._find(phrase); return round(W.ws[i]["a"], 3)
def P(phrase):
    i, j = W._find(phrase); W.cur = i; return round(W.ws[i]["a"], 3)

SC = []
def scene(id, start, bg, pos="low", clicks=None, **ev):
    SC.append({"id": id, "t0": 0 if not SC else round(start - .15, 3), "bg": bg, "ev": ev, "pos": pos, **({"clicks": clicks} if clicks else {})})

p = P("Оформил карту"); scene("s_card", p, "sky", card=A("карту"), old=A("старым"))
p = P("И бонуса не"); scene("s_push", p, "space", pos="top", no=A("бонуса не"), sad=A("его платят"))
p = P("Самое обидное"); a, b, c = A("карта для"), A("зарплатная"), A("или детская")
scene("s_list", p, "white", a=a, b=b, c=c)
p = P("Узнать это"); m = A("за две"); scene("s_search", p, "white", min=m, clicks=[{"t": m - .15, "id": "q_bar"}])
p = P("Заходишь через"); g, o = A("Госуслуги"), A("Сведения о"); scene("s_cab", p, "sky", gos=g, open=o, clicks=[{"t": g, "id": "c_gos"}, {"t": o, "id": "c_item"}])
p = P("Там все"); scene("s_tbl", p, "white", pos="top", banks=A("все твои"), year=A("начиная с"))
p = P("Банка нет"); scene("s_ok", p, "warm", pos="top", new=A("новичок"), mine=A("бонус твой"))
p = P("Подробная инструкция"); l = A("ссылка в"); scene("s_end", p, "space", link=l, clicks=[{"t": l, "id": "e_btn"}])
p = P("Так что"); scene("s_none", p, "sky", pos="mid")
for i, s in enumerate(SC): s["t1"] = SC[i + 1]["t0"] if i + 1 < len(SC) else END

# куски текста: от первого слова до первого слова следующего куска; позиция — как у сцены
for k, c in enumerate(chunks):
    c["t0"] = 0 if k == 0 else round(shown[c["i0"]]["a"] - .12, 3)
for k, c in enumerate(chunks):
    c["t1"] = chunks[k + 1]["t0"] if k + 1 < len(chunks) else END
    sc = next(s for s in SC if s["t0"] <= c["t0"] + .2 < s["t1"] or s is SC[-1])
    c["pos"] = sc["pos"]

r2 = lambda x: round(x, 3)
sfx = {k: [] for k in ("whoosh", "impact", "pop", "ticks", "coin", "thud", "ui", "click", "notif")}
for s in SC[1:]: sfx["whoosh"].append(r2(s["t0"] - .1))
for s in SC:
    for c in s.get("clicks", []):
        (sfx["click"] if c.get("click", True) else sfx["ui"]).append(r2(c["t"]))
ev = {s["id"]: s["ev"] for s in SC}
sfx["thud"].append(ev["s_card"]["old"]); sfx["notif"].append(ev["s_push"]["no"]); sfx["pop"] += [ev["s_search"]["min"], ev["s_tbl"]["year"]]
sfx["ticks"].append([SC[3]["t0"] + .1, ev["s_search"]["min"] - .5]); sfx["coin"].append(ev["s_ok"]["mine"])
sfx = {k: (sorted(v) if k != "ticks" else v) for k, v in sfx.items()}
tl = {"size": [1080, 1920], "duration": END, "fps": 30, "words": shown, "chunks": chunks, "scenes": SC,
      "query": "в каких банках у меня есть счета", "music": [{"t": 0, "part": "main"}, {"t": r2(SC[-2]["t0"]), "part": "outro"}],
      "sfx": sfx, "bpm": 100, "hats": .6}
open(os.path.join(DIR, "timeline.js"), "w").write("window.TL = " + json.dumps(tl, ensure_ascii=False) + ";\n")
print(f"сцен {len(SC)}, кусков текста {len(chunks)}, слов на экране {len(shown)}, длительность {END:.1f} с")
for s in SC: print(f"  {s['t0']:5.2f}–{s['t1']:5.2f} {s['id']}")
