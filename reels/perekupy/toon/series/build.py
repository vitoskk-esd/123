# python3 build.py ep04 → ep04.html (шаблон + фон + сценарий)
import json, sys
ID = sys.argv[1]
s = open("ep.tpl.html").read().replace("@@BG@@\n", open("../bg_night.svg.part").read()).replace("@@ID@@", ID)
s = s.replace("@@EP@@", json.dumps(json.load(open(f"{ID}.json")), ensure_ascii=False))
open(f"{ID}.html", "w").write(s)
