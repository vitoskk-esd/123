#!/usr/bin/env python3
"""Тайминг рилса с Арбузовым: голос (out/voice/words.json, phrases.json от arbuzov_voice.py) + раскадровка (story.js) → timeline.js.
Владелец 14.10: «сделай ролики так, чтобы не было застоев в кадрах несколько секунд, кадры должны часто меняться».
Поэтому кадр раскадровки (= фраза) режется на планы по ~1,3 с на границах слов: общий → крупно предмет → реакция Арбузова → крупно другой предмет;
про-версия (владелец 14.10: «вяло… хочу более профессиональный»): переход на каждой склейке, цифры — отдельным крупным кадром со счётчиком.
  python3 arb-kit/build_arb.py <папка рилса>
"""
import difflib, json, os, re, sys
REEL = os.path.abspath(sys.argv[1]); OFF = .2          # голос стартует через 0,2 с: первый кадр уже с хуком
P = [l.strip() for l in open(f"{REEL}/phrases.txt", encoding="utf-8") if l.strip()]
W = json.load(open(f"{REEL}/out/voice/words.json")); META = json.load(open(f"{REEL}/out/voice/phrases.json"))
story = open(f"{REEL}/story.js", encoding="utf-8").read()
caps = re.findall(r'cap: "([^"]*)"', story)
assert len(caps) == len(P), f"кадров {len(caps)}, фраз {len(P)}"

def norm(s): return re.sub(r"[^а-яё0-9a-z]", "", s.lower().replace("ё", "е"))
# слова фраз: если Whisper услышал фразу точно — его слова (числа цифрами), иначе слова сценария с временами пропорционально буквам
words, ph = [], []
for i, text in enumerate(P):
    ws = [w for w in W if w["p"] == i]
    s0, s1 = ws[0]["s"] + OFF, ws[-1]["e"] + OFF
    ph.append((s0, s1))
    if META[str(i)]["sim"] >= .97: words += [dict(w=w["w"], s=round(w["s"] + OFF, 3), e=round(w["e"] + OFF, 3), p=i) for w in ws]
    else:
        toks = text.split(); L = sum(len(t) + 1 for t in toks); t = s0
        for tok in toks:
            d = (s1 - s0) * (len(tok) + 1) / L; words.append(dict(w=tok, s=round(t, 3), e=round(t + d * .9, 3), p=i)); t += d
END = round(ph[-1][1] + 1.0, 2)
bounds = [0.0] + [round((ph[i][1] + ph[i + 1][0]) / 2, 3) for i in range(len(P) - 1)] + [END]

# планы
PAT = [["wide", "detail", "react", "detail2"], ["wide", "react", "detail", "detail2"], ["wide", "detail", "detail2", "react"]]
shots = []
for i in range(len(P)):
    a, b = bounds[i], bounds[i + 1]; D = b - a; n = max(1, round(D / 1.35))
    starts = [w["s"] for w in words if w["p"] == i and a + .5 < w["s"] < b - .5]
    cuts = [a]
    for k in range(1, n):
        tgt = a + D * k / n
        c = min(starts, key=lambda s: abs(s - tgt)) if starts else tgt
        if c - cuts[-1] > .55 and b - c > .55: cuts.append(round(c - .04, 3))
    pat = ["wide", "react", "detail", "detail2"] if i == 0 else (["wide", "react", "wide2"] if i == len(P) - 1 else PAT[i % 3])
    for k, c in enumerate(cuts):
        shots.append(dict(t0=round(c, 3), t1=round(cuts[k + 1] if k + 1 < len(cuts) else b, 3), frame=i, kind=pat[k % len(pat)], first=k == 0))

# субтитры: куски по 2–3 слова, разрыв на знаках препинания
NEG = re.compile(r"^(не|нет|без|ни|сгор|исчез|отказ|бросен|теря|минус)", re.I)
keys = [norm(w) for c in caps for k in re.findall(r"\*(.+?)\*", c) for w in k.split() if norm(w)]
chunks = []
for i in range(len(P)):
    ws = [w for w in words if w["p"] == i]; cur = []
    for j, w in enumerate(ws):
        cur.append(w)
        if len(cur) >= 3 or re.search(r"[,.:?!—–]$", w["w"]) or (len(cur) == 2 and j + 1 < len(ws) and len(ws[j + 1]["w"]) > 9) or j == len(ws) - 1:
            chunks.append(dict(t0=cur[0]["s"] - .05, p=i, w=[dict(t=x["w"], c="k" if re.search(r"\d|₽|%", x["w"]) or (norm(x["w"])[:5] and any(norm(x["w"])[:5] == k[:5] for k in keys)) else ("r" if NEG.match(x["w"]) else "")) for x in cur])); cur = []
for k, c in enumerate(chunks): c["t1"] = round(min(chunks[k + 1]["t0"] if k + 1 < len(chunks) else END, (bounds[c["p"] + 1])), 3); c["t0"] = round(c["t0"], 3)

# цифра крупно: план, на котором звучит кусок с числом, становится кадром «word» (не первый план фразы — там общий вид)
# в story.js у кадра можно задать big: "..." — что показать крупно (иначе — кусок субтитров с цифрой)
BIG = [(re.search(r'big: "([^"]*)"', f) or [None, None])[1] for f in story.split("{ time:")[1:]]
for i in range(len(P)):
    num = [c for c in chunks if c["p"] == i and any(re.search(r"\d", w["t"]) for w in c["w"])]
    sh = [s for s in shots if s["frame"] == i and not s["first"]]
    if (num or BIG[i]) and sh:
        tgt = min(sh, key=lambda s: abs(s["t0"] - num[0]["t0"])) if num else sh[0]
        tgt["kind"] = "word"; tgt["text"] = BIG[i] or " ".join(w["t"] for w in num[0]["w"]).strip(",.:—")
TR = ["whip", "zoom", "slam", "whipL"]
for k, s in enumerate(shots): s["tr"] = "none" if k == 0 else TR[k % 4]

# эмоции для реакций и рта
acts = []
for i, text in enumerate(P):
    low = text.lower()
    mood, arm = ("shock", "shrug") if "?" in text else (("happy", "up") if re.search(r"тысяч|процент|рубл|бонус|верн", low) else (("smirk", "point") if i % 2 else ("happy", "wave")))
    if re.search(r"не засчит|без |сгор|исчез|отказ|бросен", low): mood, arm = "shock", "shrug"
    acts.append(dict(t=round(bounds[i], 3), mood=mood, arm=arm))

sfx = {"whoosh": [round(s["t0"] - .04, 3) for s in shots[1:]], "pop": [round(s["t0"] + .3, 3) for s in shots if s["first"]],
       "coin": [round(s["t0"] + .15, 3) for s in shots if s["kind"] == "word"], "impact": [round(s["t0"] + .02, 3) for s in shots if s["tr"] == "slam"]}
tl = dict(size=[1080, 1920], fps=30, duration=END, off=OFF, words=[dict(w=w["w"], s=w["s"], e=w["e"]) for w in words], acts=acts, shots=shots, chunks=chunks,
          music=[dict(t=0, part="main"), dict(t=bounds[-2], part="outro")], sfx=sfx, bpm=120, hats=.6)
open(f"{REEL}/timeline.js", "w").write("window.TL = " + json.dumps(tl, ensure_ascii=False) + ";\n")
os.makedirs(f"{REEL}/out", exist_ok=True)
open(f"{REEL}/out/segs.js", "w").write("window.SEGS = " + json.dumps([dict(mode="arb", t0=s["t0"], t1=s["t1"]) for s in shots]) + ";\n")
lens = [s["t1"] - s["t0"] for s in shots]
print(f"{os.path.basename(REEL)}: {END} с, планов {len(shots)} (средний {sum(lens) / len(lens):.2f} с, самый длинный {max(lens):.2f} с), кусков субтитров {len(chunks)}")
