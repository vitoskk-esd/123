# python3 build2.py ep06 → ep06.html (каркас + фон локации + сценарий; сцена — ep06.js/.css)
import json, sys
# фоны всех локаций — для серий со сменой сцен (bgs.js, генерируется)
json_bgs = {k: open(f"../bg_{k}.svg.part").read() for k in ["city", "night", "garages", "highway", "sto", "winter", "market", "mall", "dealer", "interior", "tireshop", "pit", "ditch"]}
open("bgs.js", "w").write("window.BGS=" + json.dumps(json_bgs, ensure_ascii=False) + ";")
ID = sys.argv[1]; sp = json.load(open(f"{ID}.json"))
s = open("base.tpl.html").read().replace("@@BG@@\n", open(f"../bg_{sp['location']}.svg.part").read()).replace("@@ID@@", ID)
open(f"{ID}.html", "w").write(s.replace("@@EP@@", json.dumps(sp, ensure_ascii=False)))
