#!/usr/bin/env python3
"""Анализ out/recheck_words.json: что в голосе лишнее относительно сценария. -> out/recheck.md"""
import json, os, re, difflib, bisect
DIR = os.path.dirname(os.path.abspath(__file__)); OUT = os.path.join(DIR, "out")
norm = lambda w: re.sub(r"[^а-яa-z0-9]", "", w.lower().replace("ё", "е"))
R = json.load(open(os.path.join(OUT, "recheck_words.json")))["words"]
import importlib.util
spec = importlib.util.spec_from_file_location("vv", os.path.join(DIR, "voice_v2.py")); vv = importlib.util.module_from_spec(spec)
src = open(os.path.join(DIR, "voice_v2.py")).read()
post = eval(re.search(r"POST_CUTS = (\[.*?\])\n(?!\s)", src, re.S).group(1))
inpost = lambda t: any(x <= t <= y for x, y, _ in post)
W = [w for w in R if norm(w["w"]) and not inpost(w["a"])]
# время в финальном ролике: по словам v2 ↔ final (одинаковые индексы)
v2 = json.load(open(os.path.join(OUT, "words_v2.json")))["words"]; fin = json.load(open(os.path.join(OUT, "words_final.json")))["words"]
ta = [w["a"] for w in v2]; tb = [w["a"] for w in fin]
def to_final(t):
    i = bisect.bisect_left(ta, t)
    if i <= 0: return tb[0] - (ta[0] - t)
    if i >= len(ta): return tb[-1] + (t - ta[-1])
    k = (t - ta[i - 1]) / max(.01, ta[i] - ta[i - 1]); return tb[i - 1] + k * (tb[i] - tb[i - 1])
mm = lambda t: f"{int(t // 60)}:{t % 60:04.1f}"
script = [norm(x) for x in open(os.path.join(DIR, "read.txt")).read().split() if norm(x)]
got = [norm(w["w"]) for w in W]
flags = []
sm = difflib.SequenceMatcher(None, script, got, autojunk=False)
for op, i1, i2, j1, j2 in sm.get_opcodes():
    if op in ("insert", "replace") and (j2 - j1) >= 2 and (op == "insert" or (j2 - j1) > (i2 - i1) + 1):
        seg = W[j1:j2]; flags.append((seg[0]["a"], seg[-1]["a"] + seg[-1]["d"], "вставка (нет в сценарии)", " ".join(w["w"] for w in seg)))
# повторы n-грамм рядом
for n in (5, 4, 3, 2):
    for i in range(len(got) - n):
        g = got[i:i + n]
        if sum(len(x) for x in g) < 7: continue
        for j in range(i + 1, min(len(got) - n, i + 40)):
            if got[j:j + n] == g and W[j]["a"] - W[i]["a"] < 20 and j >= i + n:
                flags.append((W[i]["a"], W[j + n - 1]["a"] + W[j + n - 1]["d"], f"повтор {n} слов", " ".join(w["w"] for w in W[i:j + n])))
                break
for w in W:
    if w["w"].endswith(("...", "…")): flags.append((w["a"], w["a"] + w["d"], "оборванное слово", w["w"]))
# слить пересекающиеся
flags.sort(); merged = []
for f in flags:
    if merged and f[0] <= merged[-1][1] + .3: merged[-1] = (merged[-1][0], max(merged[-1][1], f[1]), merged[-1][2] + " + " + f[2] if f[2] not in merged[-1][2] else merged[-1][2], merged[-1][3] if len(merged[-1][3]) >= len(f[3]) else f[3])
    else: merged.append(f)
with open(os.path.join(OUT, "recheck.md"), "w") as fo:
    for x, y, k, txt in merged:
        line = f"{mm(to_final(x))} (исх. {x:.1f}–{y:.1f}) {k}: {txt[:160]}"; print(line); fo.write(line + "\n")
print(len(merged), "мест")
