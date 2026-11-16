# python3 gen_bgs67.py → фоны для ep75 «Деревня: зверь, а не машина» (киношный формат, с матом):
# bg_selogryaz (деревенская улица осенью: избы с наличниками, забор, колодец, берёзы, колея в грязи, вывеска «д. ГРЯЗЕВО»),
# bg_lugkoleya (полевая дорога: огромная лужа с колеёй, поле, лес вдали, столб ЛЭП, низкое небо),
# bg_dvoregorych (двор деда: крыльцо избы, поленница, бельё на верёвке, будка, лавка)
import random
K = "#000"
HEAD = '  <svg id="bg" width="1080" height="1920" viewBox="0 0 1080 1920" style="position:absolute;left:0;top:0">\n'
F = 'font-family="Unbounded" font-weight="900"'
R = random.randint
IZBA = lambda x, y, w, c: (f'<rect x="{x}" y="{y}" width="{w}" height="{w * .7}" fill="{c}" stroke="{K}" stroke-width="6"/>'
    + "".join(f'<path d="M{x} {y + k * w * .1} H{x + w}" stroke="#5a3820" stroke-width="3"/>' for k in range(1, 7))
    + f'<path d="M{x - 30} {y} L{x + w / 2} {y - w * .45} L{x + w + 30} {y} Z" fill="#6a6a6a" stroke="{K}" stroke-width="6"/>'
    + f'<rect x="{x + w * .3}" y="{y + w * .18}" width="{w * .4}" height="{w * .3}" fill="#a8cfe8" stroke="#f4f0e8" stroke-width="10"/><path d="M{x + w * .5} {y + w * .18} V{y + w * .48}" stroke="#f4f0e8" stroke-width="6"/>')

random.seed(311)
selo = HEAD + f'''    <defs><linearGradient id="sg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9aa8b8"/><stop offset="1" stop-color="#dfe4e8"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#sg)"/>
    {IZBA(40, 760, 360, "#8a5a33")}{IZBA(680, 720, 380, "#7a4a2a")}
    {"".join(f'<path d="M{x} 1150 V760" stroke="#e8e4d8" stroke-width="18"/><path d="M{x - 6} 820 h12 M{x - 4} 900 h10" stroke="#151515" stroke-width="4"/><ellipse cx="{x}" cy="700" rx="70" ry="110" fill="#c8a03a" stroke="{K}" stroke-width="5"/>' for x in (520, 600))}
    <!-- забор, колодец -->
    {"".join(f'<rect x="{x}" y="1060" width="30" height="120" fill="#a8885a" stroke="{K}" stroke-width="3"/>' for x in range(0, 1080, 44))}
    <rect x="430" y="1080" width="120" height="100" fill="#8a6a4a" stroke="{K}" stroke-width="5"/><path d="M420 1080 L490 1010 L560 1080 Z" fill="#5a4030" stroke="{K}" stroke-width="5"/>
    <!-- вывеска -->
    <rect x="760" y="1210" width="280" height="80" fill="#2f6db5" stroke="{K}" stroke-width="5"/><text x="900" y="1263" text-anchor="middle" {F} font-size="34" fill="#fff">д. ГРЯЗЕВО</text><path d="M900 1290 V1380" stroke="#5b6670" stroke-width="10"/>
    <!-- грязь и колея -->
    <rect y="1180" width="1080" height="740" fill="#6a5238"/><path d="M0 1180 H1080" stroke="{K}" stroke-width="6"/>
    {"".join(f'<path d="M{x} 1920 Q{x + 60} 1500 {540 + (x - 300) * .2} 1200" stroke="#4a3826" stroke-width="40" fill="none"/>' for x in (240, 760))}
    {"".join(f'<ellipse cx="{R(0, 1080)}" cy="{R(1250, 1880)}" rx="{R(40, 140)}" ry="{R(10, 26)}" fill="#7a8a98" opacity=".55"/>' for _ in range(10))}
  </svg>
'''

random.seed(312)
lug = HEAD + f'''    <defs><linearGradient id="lg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7a8898"/><stop offset="1" stop-color="#c8d0d8"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#lg)"/>
    {"".join(f'<ellipse cx="{R(0, 1080)}" cy="{R(80, 500)}" rx="{R(160, 300)}" ry="{R(40, 70)}" fill="#6a7888" opacity=".6"/>' for _ in range(6))}
    <!-- лес вдали и поле -->
    <path d="M0 900 {"".join(f"L{x} {R(780, 860)} " for x in range(0, 1100, 60))} V960 H0 Z" fill="#3a5a3a"/>
    <rect y="940" width="1080" height="300" fill="#8a8a4a"/>{"".join(f'<path d="M{x} 1240 L{x + 30} 950" stroke="#7a7a3a" stroke-width="6"/>' for x in range(-40, 1100, 70))}
    <path d="M900 1200 V700 M860 730 H940" stroke="#4a3a2a" stroke-width="12"/>
    <!-- дорога и лужа -->
    <rect y="1240" width="1080" height="680" fill="#6a5238"/><path d="M0 1240 H1080" stroke="{K}" stroke-width="6"/>
    <ellipse cx="540" cy="1640" rx="620" ry="260" fill="#5a6a74" stroke="#3a2e22" stroke-width="10"/>
    {"".join(f'<path d="M{R(80, 900)} {R(1480, 1820)} q40 -12 80 0" stroke="#9aaab4" stroke-width="5" fill="none"/>' for _ in range(16))}
  </svg>
'''

random.seed(313)
dvor = HEAD + f'''    <defs><linearGradient id="dg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a8c4dc"/><stop offset="1" stop-color="#e8ecf0"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#dg)"/>
    {IZBA(300, 640, 520, "#8a5a33")}
    <!-- крыльцо -->
    <rect x="460" y="1000" width="200" height="200" fill="#a8885a" stroke="{K}" stroke-width="6"/>{"".join(f'<rect x="{430 - k * 20}" y="{1200 + k * 30}" width="{260 + k * 40}" height="30" fill="#c8a878" stroke="{K}" stroke-width="4"/>' for k in range(3))}
    <!-- поленница -->
    <rect x="20" y="1000" width="240" height="260" fill="#5a3820" stroke="{K}" stroke-width="5"/>{"".join(f'<circle cx="{40 + (i % 6) * 40}" cy="{1030 + (i // 6) * 40}" r="17" fill="#c8a06a" stroke="#5a3820" stroke-width="4"/>' for i in range(36))}
    <!-- бельё -->
    <path d="M840 760 Q960 800 1080 760" stroke="#151515" stroke-width="4" fill="none"/>{"".join(f'<rect x="{x}" y="780" width="60" height="90" fill="{c}" stroke="{K}" stroke-width="3"/>' for x, c in ((870, "#c0392b"), (950, "#f4f0e8"), (1020, "#2f6db5")))}
    <!-- будка -->
    <rect x="860" y="1120" width="170" height="150" fill="#8a6a4a" stroke="{K}" stroke-width="5"/><path d="M845 1120 L945 1050 L1045 1120 Z" fill="#5a4030" stroke="{K}" stroke-width="5"/><ellipse cx="945" cy="1220" rx="40" ry="50" fill="#151515"/>
    <!-- земля -->
    <rect y="1290" width="1080" height="630" fill="#7a6a4a"/><path d="M0 1290 H1080" stroke="{K}" stroke-width="6"/>
    {"".join(f'<ellipse cx="{R(0, 1080)}" cy="{R(1330, 1880)}" rx="{R(30, 90)}" ry="{R(8, 18)}" fill="#5a4a32" opacity=".6"/>' for _ in range(14))}
  </svg>
'''

for n, s in (("selogryaz", selo), ("lugkoleya", lug), ("dvoregorych", dvor)):
    open(f"bg_{n}.svg.part", "w").write(s)
print("ok")
