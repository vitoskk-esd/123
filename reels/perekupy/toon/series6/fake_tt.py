# python3 fake_tt.py ep15 — черновой таймлайн без голоса (для вёрстки сцен): 0,36 с на слово, паузы из сценария
import json, sys
ID = sys.argv[1]; SP = json.load(open(f"{ID}.json")); import os; os.makedirs(f"vo/{ID}", exist_ok=True)
pos, st, en, words = .35, {}, {}, {}
for ln in SP["lines"]:
    pos += ln.get("pause", 0); st[ln["id"]] = round(pos, 3); ws = ln["text"].split(); words[ln["id"]] = []
    for w in ws: words[ln["id"]].append([w, round(pos, 3), round(pos + .3, 3)]); pos += .36
    en[ln["id"]] = round(pos, 3); pos += .3
D = round(pos + 1.4, 2); n = int(D * 30)
open(f"vo/{ID}/timeline.js", "w").write("window.TT=" + json.dumps({"start": st, "end": en, "bleeps": [], "words": words}, ensure_ascii=False)
  + ";window.LIP=" + json.dumps({k: [0] * n for k in {l["who"] for l in SP["lines"]}}) + f";window.DURATION={D};window.LEAD=0;\n")
print("DUR", D)
