#!/usr/bin/env python3
"""Тайминг ролика №6: слова голоса (voice/out/words.json, phrases.json) → сегменты сцен, планы камеры, позы Арбузова → timeline6.js.
Сцены — по раскадровке (board/, утверждена владельцем 14.10). Заставка «хрум» 0–1 с, голос с OFF.
  python3 build6.py   (после голоса: characters/voice/arbuzov_voice.py voice/phrases.txt voice/out)
"""
import json, os, re
HERE = os.path.dirname(os.path.abspath(__file__))
OFF = 1.0                                    # голос после звуковой подписи
P = [l.strip() for l in open(f"{HERE}/voice/phrases.txt") if l.strip()]
SEC = [l.strip() for l in open(f"{HERE}/voice/sections.txt") if l.strip()]
W = json.load(open(f"{HERE}/voice/out/words.json"))
words = [dict(w=x["w"], s=round(x["s"] + OFF, 3), e=round(x["e"] + OFF, 3), p=x["p"]) for x in W]
pstart = {}; pend = {}
for x in words: pstart.setdefault(x["p"], x["s"]); pend[x["p"]] = x["e"]
dur = round(max(pend.values()) + 2.5, 2)

def find(sub, after=0):
    for i in range(after, len(P)):
        if sub.lower() in P[i].lower(): return i
    raise SystemExit(f"нет фразы: {sub}")

# сцена для каждой фразы
scene = []
for i, s in enumerate(SEC):
    sec = s.split("|")[0]
    scene.append({"hook": 1, "ch1": 2, "ch2": 4, "ch3": 7, "ch4": 8, "ch5": 9, "ch6": 10, "final": 11}[sec])
def setr(a, b, sc):
    for i in range(a, b): scene[i] = sc
c1 = SEC.index("ch1"); c2 = SEC.index("ch2"); c3 = SEC.index("ch3"); c4 = SEC.index("ch4"); c6 = SEC.index("ch6"); cf = SEC.index("final")
setr(find("Но есть ловушка", c1), find("Ещё один момент, который пугает", c1), 3)
setr(find("И ещё одно правило, самое важное", c2), c3, 5)
cta = [i for i, s in enumerate(SEC) if "cta" in s]
setr(cta[0], find("Дальше — деньги", cta[0]), 6)
setr(find("Дальше — деньги", cta[0]), c4, 8)
setr(find("А ещё проверь, нет ли у тебя денег", c6), cf, 2)
setr(len(P) - 2, len(P), 12)

# сегменты: подряд идущие фразы одной сцены; границы — середина паузы между фразами
segs = []
for i in range(len(P)):
    if segs and segs[-1]["scene"] == scene[i]: segs[-1]["p1"] = i; continue
    segs.append(dict(scene=scene[i], p0=i, p1=i))
for k, s in enumerate(segs):
    s["t0"] = 0.0 if k == 0 else round((pend[segs[k - 1]["p1"]] + pstart[s["p0"]]) / 2, 3)
for k, s in enumerate(segs):
    s["t1"] = segs[k + 1]["t0"] if k + 1 < len(segs) else dur

# позиция героя по сцене (из раскадровки) — для крупного плана: центр лица
HERO = {1: (600, 150, 700), 2: (560, 210, 560), 3: (800, 230, 560), 4: (260, 220, 560), 5: (260, 200, 600), 6: (220, 190, 600), 7: (820, 260, 520),
        8: (440, 230, 560), 9: (700, 280, 520), 10: (720, 330, 480), 11: (650, 120, 620), 12: (650, 170, 620)}
for s in segs:
    x, y, w = HERO[s["scene"]]; k = w / 600; face = (x + 300 * k, y + 400 * k)
    plans = [dict(z=1.0, x=960, y=540), dict(z=1.45, x=face[0], y=face[1] - 20), dict(z=1.22, x=1920 - face[0] * .6 + 200, y=520), dict(z=1.12, x=960, y=560)]
    n = max(1, round((s["t1"] - s["t0"]) / 9.5)); L = (s["t1"] - s["t0"]) / n
    s["shots"] = []
    for j in range(n):
        pl = plans[j % len(plans)] if n > 1 else plans[0]
        z = pl["z"]; xx = min(max(pl["x"], 960 / z), 1920 - 960 / z); yy = min(max(pl["y"], 540 / z), 1080 - 540 / z)
        s["shots"].append(dict(t0=round(s["t0"] + j * L, 3), t1=round(s["t0"] + (j + 1) * L, 3), z=z, x=round(xx), y=round(yy)))

# позы и эмоции по фразам
BASE = {1: "phone", 2: "wave", 3: "shrug", 4: "phone", 5: "shrug", 6: "point", 7: "point", 8: "shrug", 9: "point", 10: "up", 11: "up", 12: "wave"}
acts = []
for i, p in enumerate(P):
    t = pstart[i] - .15; sc = scene[i]; low = p.lower()
    if p.endswith("?"): mood, arm = "shock", "shrug"
    elif re.search(r"тысяч|процент|рубл|бонус", low): mood, arm = "happy", "point"
    elif re.search(r"нет|не |ловушк|сгора|теря|статья|дроп", low): mood, arm = "smirk", "down"
    else: mood, arm = ("smirk", BASE[sc]) if i % 2 else ("happy", "down")
    if sc in (1, 11): arm = {"down": "phone" if sc == 1 else "up", "shrug": "shrug"}.get(arm, arm) if sc == 11 else "phone"
    acts.append(dict(t=round(t, 3), mood=mood, arm=arm))

out = dict(duration=dur, off=OFF, words=[dict(w=x["w"], s=x["s"], e=x["e"]) for x in words], acts=acts,
           segs=[dict(scene=s["scene"], t0=s["t0"], t1=s["t1"], shots=s["shots"]) for s in segs])
open(f"{HERE}/timeline6.js", "w").write("const TL6 = " + json.dumps(out, ensure_ascii=False) + ";\n")
print("длительность", dur, "с; сегментов", len(segs))
for s in segs: print(f"  сцена {s['scene']:>2}  {s['t0']:7.1f}–{s['t1']:7.1f}  планов {len(s['shots'])}  фразы {s['p0']}–{s['p1']}")
