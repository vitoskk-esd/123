# python3 build2.py ep47 → ep47.html (каркас + «киношный» слой cine.js + реквизит props.js + сцена ep47.js/.css)
import json, sys
ID = sys.argv[1]; sp = json.load(open(f"{ID}.json"))
s = open("base.tpl.html").read().replace("@@BG@@\n", "").replace("@@ID@@", ID)
s = s.replace('<link rel="stylesheet" href="common.css">', '<link rel="stylesheet" href="common.css"><link rel="stylesheet" href="../cine.css">')
s = s.replace(f'<script src="{ID}.js"></script>', f'<script src="../cine.js"></script><script src="props.js"></script><script src="props55.js"></script><script src="{ID}.js"></script>')
open(f"{ID}.html", "w").write(s.replace("@@EP@@", json.dumps(sp, ensure_ascii=False)))
# маски бликов по силуэту машин (mask-image с file:// блокирует CORS) → masks.css с data-URI
import base64, re
used = sorted(set(re.findall(r'"([a-z0-9]+/[a-z0-9_]+\.png)"', open(f"{ID}.js").read() + open("props.js").read() + open("props55.js").read())))
css = "".join(f'.mk-{u.replace("/", "-").replace(".", "-")}{{-webkit-mask-image:url(data:image/png;base64,{base64.b64encode(open("../../kit/img/" + u, "rb").read()).decode()});'
              f'mask-image:url(data:image/png;base64,{base64.b64encode(open("../../kit/img/" + u, "rb").read()).decode()})}}\n' for u in used)
open("masks.css", "w").write(css)
h = open(f"{ID}.html").read().replace('<link rel="stylesheet" href="../cine.css">', '<link rel="stylesheet" href="../cine.css"><link rel="stylesheet" href="masks.css">')
open(f"{ID}.html", "w").write(h)
print("masks:", used)
