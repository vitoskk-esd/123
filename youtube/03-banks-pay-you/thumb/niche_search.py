# Поиск YouTube (страница результатов): ролики по запросам ниши, сортировка по просмотрам — всё время и за год.
import json, re, sys, urllib.parse, subprocess
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36"
def search(q, sp):
    url = "https://www.youtube.com/results?search_query=" + urllib.parse.quote(q) + "&sp=" + sp
    html = subprocess.run(["curl", "-s", "--max-time", "30", "-A", UA, "-H", "Accept-Language: ru-RU,ru", url], capture_output=True, text=True).stdout
    m = re.search(r"var ytInitialData = (\{.*?\});</script>", html)
    if not m: return []
    data = json.loads(m.group(1)); out = []
    def walk(o):
        if isinstance(o, dict):
            if "videoRenderer" in o:
                v = o["videoRenderer"]; vc = v.get("viewCountText", {}); txt = vc.get("simpleText") or "".join(r.get("text", "") for r in vc.get("runs", []))
                n = int(re.sub(r"\D", "", txt) or 0)
                out.append({"id": v["videoId"], "title": "".join(r["text"] for r in v["title"]["runs"]), "views": n,
                            "ch": "".join(r["text"] for r in v.get("ownerText", {}).get("runs", [])), "age": v.get("publishedTimeText", {}).get("simpleText", ""),
                            "len": v.get("lengthText", {}).get("simpleText", "")})
            for x in o.values(): walk(x)
        elif isinstance(o, list):
            for x in o: walk(x)
    walk(data); return out
Q = ["бонусы банков новым клиентам", "бонус за дебетовую карту", "как заработать на банках", "деньги от банков бесплатно", "приведи друга банк бонус",
     "кэшбэк какую карту выбрать", "подработка для студента", "как заработать студенту без опыта", "банки платят", "заработок на банковских картах"]
SP = {"всё время": "CAM%253D", "за год": "CAMSAggF"}
seen = {}
for q in Q:
    for lab, sp in SP.items():
        for v in search(q, sp):
            if v["id"] not in seen or seen[v["id"]]["views"] < v["views"]: v["q"] = q; v["when"] = lab; seen[v["id"]] = v
res = sorted(seen.values(), key=lambda v: -v["views"])
json.dump(res, open(sys.argv[1], "w"), ensure_ascii=False, indent=0)
for v in res[:60]: print(f"{v['views']:>10,} | {v['age']:<18} | {v['len']:>7} | {v['ch'][:24]:<24} | {v['title'][:80]} | {v['id']} | {v['q']}")
