# python3 build2.py ep06 → ep06.html (каркас + фон локации + сценарий; сцена — ep06.js/.css)
import json, sys
ID = sys.argv[1]; sp = json.load(open(f"{ID}.json"))
s = open("base.tpl.html").read().replace("@@BG@@\n", open(f"../bg_{sp['location']}.svg.part").read()).replace("@@ID@@", ID)
open(f"{ID}.html", "w").write(s.replace("@@EP@@", json.dumps(sp, ensure_ascii=False)))
