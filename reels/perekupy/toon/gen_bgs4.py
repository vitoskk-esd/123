# python3 gen_bgs4.py → фоны шестого набора локаций (ep18 «Перегон»):
# bg_room (комната Толяна ночью, ковёр на стене), bg_train (плацкарт), bg_yard (двор хрущёвки, Самара),
# bg_azs (ночная заправка), bg_dps (пост ДПС ночью), bg_citysign (утро, въезд в город)
import random
K = "#000"
random.seed(18)
HEAD = '  <svg id="bg" width="1080" height="1920" viewBox="0 0 1080 1920" style="position:absolute;left:0;top:0">\n'
dots = lambda n, x0, y0, x1, y1, col, r=(2, 4): "".join(f'<circle cx="{random.randint(x0, x1)}" cy="{random.randint(y0, y1)}" r="{random.randint(*r)}" fill="{col}"/>' for _ in range(n))

# ---------- комната ночью: ковёр, окно с луной, кровать, тумбочка с телефоном
rug = "".join(f'<path d="M{540 + dx} {520 + dy} l60 60 l-60 60 l-60 -60 z" fill="{c}" stroke="#3a0d0d" stroke-width="4"/>'
              for dx, dy, c in [(0, 0, "#e0a030"), (-180, 0, "#2e6a8f"), (180, 0, "#2e6a8f"), (0, -150, "#2e6a8f"), (0, 150, "#2e6a8f"),
                                (-180, -150, "#e0a030"), (180, -150, "#e0a030"), (-180, 150, "#e0a030"), (180, 150, "#e0a030")])
room = HEAD + f'''    <rect width="1080" height="1920" fill="#2a2440"/>
    <rect y="1250" width="1080" height="670" fill="#4a3426"/><g stroke="#3a281d" stroke-width="4">{"".join(f'<path d="M0 {y} H1080"/>' for y in range(1300, 1920, 70))}</g>
    <!-- ковёр на стене -->
    <rect x="240" y="300" width="600" height="440" rx="14" fill="#9b1d20" stroke="{K}" stroke-width="8"/><rect x="270" y="330" width="540" height="380" fill="none" stroke="#e0a030" stroke-width="8" stroke-dasharray="20 10"/>
    {rug}
    <!-- окно с луной -->
    <rect x="860" y="250" width="200" height="320" fill="#0d1430" stroke="{K}" stroke-width="8"/><circle cx="960" cy="340" r="40" fill="#f3ead0"/>
    <path d="M960 250 v320 M860 410 h200" stroke="{K}" stroke-width="6"/>{dots(10, 870, 260, 1050, 560, "#fff", (2, 3))}
    <!-- кровать -->
    <rect x="40" y="1050" width="700" height="220" rx="20" fill="#3d6fa3" stroke="{K}" stroke-width="8"/><rect x="40" y="980" width="200" height="110" rx="30" fill="#f4f1ea" stroke="{K}" stroke-width="7"/>
    <rect x="20" y="900" width="40" height="420" fill="#6b4423" stroke="{K}" stroke-width="6"/>
    <!-- тумбочка, светящийся телефон -->
    <rect x="800" y="1080" width="200" height="220" fill="#7a4f2a" stroke="{K}" stroke-width="7"/><rect x="860" y="1050" width="80" height="34" rx="6" fill="#9fd3ff" stroke="{K}" stroke-width="4"/>
    <ellipse cx="900" cy="1060" rx="160" ry="90" fill="#9fd3ff" opacity=".18"/>
  </svg>
'''

# ---------- плацкарт: полки, столик с чаем в подстаканнике и курицей в фольге, окно с ночными огнями
train = HEAD + f'''    <rect width="1080" height="1920" fill="#7a8a6a"/>
    <rect x="0" y="0" width="1080" height="180" fill="#5f6d52"/>
    <!-- окно -->
    <rect x="300" y="420" width="480" height="420" rx="40" fill="#0c1222" stroke="{K}" stroke-width="10"/>
    <g id="trainLights">{"".join(f'<rect x="{random.randint(310, 760)}" y="{random.randint(600, 820)}" width="{random.randint(8, 30)}" height="6" fill="#ffd27a" opacity=".8"/>' for _ in range(14))}</g>
    <path d="M300 640 h480" stroke="#3a4560" stroke-width="6"/>
    <!-- верхние полки -->
    <rect x="-20" y="300" width="300" height="60" fill="#3d5a7a" stroke="{K}" stroke-width="7"/><rect x="800" y="300" width="300" height="60" fill="#3d5a7a" stroke="{K}" stroke-width="7"/>
    <path d="M60 300 v-120 M1020 300 v-120" stroke="#9aa3ab" stroke-width="10"/>
    <!-- нижние полки -->
    <rect x="-20" y="1100" width="360" height="90" fill="#3d5a7a" stroke="{K}" stroke-width="8"/><rect x="740" y="1100" width="360" height="90" fill="#3d5a7a" stroke="{K}" stroke-width="8"/>
    <rect x="-20" y="1190" width="360" height="300" fill="#5f6d52"/><rect x="740" y="1190" width="360" height="300" fill="#5f6d52"/>
    <!-- столик -->
    <rect x="340" y="960" width="400" height="40" fill="#c9b48a" stroke="{K}" stroke-width="7"/><path d="M540 1000 v260" stroke="#9aa3ab" stroke-width="14"/>
    <g><rect x="400" y="860" width="56" height="100" rx="6" fill="#f4e7c3" opacity=".8" stroke="{K}" stroke-width="5"/><rect x="394" y="900" width="68" height="60" rx="6" fill="#b08d57" stroke="{K}" stroke-width="5"/>
      <path d="M462 915 q24 10 0 30" stroke="{K}" stroke-width="5" fill="none"/></g>
    <g><ellipse cx="640" cy="935" rx="80" ry="34" fill="#d9dde2" stroke="{K}" stroke-width="5"/><path d="M590 930 l20 -12 l18 10 l22 -14 l24 12 l20 -6" stroke="#aab1ba" stroke-width="4" fill="none"/></g>
    <rect y="1490" width="1080" height="430" fill="#5a4636"/><path d="M0 1490 H1080" stroke="{K}" stroke-width="7"/>
  </svg>
'''

# ---------- двор хрущёвки днём: панельная пятиэтажка с балконами, качели, лавка, берёза
balc = "".join(f'<g><rect x="{x}" y="{y}" width="110" height="80" fill="#cfd6dd" stroke="{K}" stroke-width="5"/><rect x="{x + 8}" y="{y + 8}" width="94" height="40" fill="#7fa7c9" stroke="{K}" stroke-width="3"/></g>'
               for x in (90, 290, 490, 690, 890) for y in (360, 500, 640, 780, 920))
yard = HEAD + f'''    <defs><linearGradient id="ySky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9cc9f0"/><stop offset="1" stop-color="#e2f0fb"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#ySky)"/>
    <rect x="40" y="300" width="1000" height="780" fill="#e7e1d3" stroke="{K}" stroke-width="8"/>
    <g stroke="#c8c0ae" stroke-width="4">{"".join(f'<path d="M40 {y} H1040"/>' for y in range(440, 1080, 140))}{"".join(f'<path d="M{x} 300 V1080"/>' for x in range(240, 1040, 200))}</g>
    {balc}
    <rect x="490" y="980" width="110" height="100" fill="#6b4423" stroke="{K}" stroke-width="6"/>
    <rect y="1080" width="1080" height="840" fill="#8a8f96"/><path d="M0 1080 H1080" stroke="{K}" stroke-width="6"/>
    <path d="M0 1300 Q540 1260 1080 1300 V1920 H0 Z" fill="#7fae52"/>
    <!-- берёза -->
    <g><rect x="930" y="700" width="34" height="620" fill="#f4f4f4" stroke="{K}" stroke-width="6"/>{"".join(f'<path d="M930 {y} h16" stroke="{K}" stroke-width="6"/>' for y in range(760, 1300, 70))}
      {"".join(f'<circle cx="{x}" cy="{y}" r="{r}" fill="#9cc64e" stroke="{K}" stroke-width="5"/>' for x, y, r in [(900, 700, 90), (1000, 660, 100), (950, 600, 90)])}</g>
    <!-- качели и лавка -->
    <g><path d="M120 1320 L180 1130 L240 1320 M380 1320 L320 1130 L260 1320 M180 1130 H320" stroke="#c0392b" stroke-width="12" fill="none"/>
      <path d="M220 1140 v110 M280 1140 v110" stroke="#555" stroke-width="5"/><rect x="205" y="1250" width="90" height="20" fill="#f1c40f" stroke="{K}" stroke-width="4"/></g>
    <g><rect x="600" y="1360" width="260" height="24" fill="#6b4423" stroke="{K}" stroke-width="5"/><rect x="600" y="1310" width="260" height="20" fill="#6b4423" stroke="{K}" stroke-width="5"/>
      <path d="M620 1384 v50 M840 1384 v50" stroke="#333" stroke-width="10"/></g>
  </svg>
'''

# ---------- ночная заправка: навес со светом, колонки, табло цен, магазин «24»
azs = HEAD + f'''    <defs><linearGradient id="aSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#05070f"/><stop offset="1" stop-color="#1c2340"/></linearGradient>
      <radialGradient id="aLight" cx=".5" cy="0" r="1"><stop offset="0" stop-color="#fff6d6" stop-opacity=".55"/><stop offset="1" stop-color="#fff6d6" stop-opacity="0"/></radialGradient></defs>
    <rect width="1080" height="1920" fill="url(#aSky)"/>{dots(40, 0, 0, 1080, 600, "#fff", (1, 3))}
    <!-- магазин -->
    <rect x="620" y="760" width="440" height="340" fill="#e8e2d4" stroke="{K}" stroke-width="8"/><rect x="660" y="840" width="360" height="200" fill="#ffe9a8" stroke="{K}" stroke-width="6"/>
    <rect x="740" y="700" width="200" height="70" rx="12" fill="#2e86de" stroke="{K}" stroke-width="6"/><text x="840" y="750" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="44" fill="#fff">24</text>
    <!-- табло цен -->
    <g><path d="M140 640 V360" stroke="#333" stroke-width="16"/><rect x="40" y="360" width="300" height="230" rx="12" fill="#0d0f12" stroke="{K}" stroke-width="8"/>
      <text x="70" y="430" font-family="JetBrains Mono" font-weight="800" font-size="34" fill="#fff">АИ-92</text><text x="320" y="430" text-anchor="end" font-family="JetBrains Mono" font-weight="800" font-size="34" fill="#ff3b30">58,40</text>
      <text x="70" y="500" font-family="JetBrains Mono" font-weight="800" font-size="34" fill="#fff">АИ-95</text><text x="320" y="500" text-anchor="end" font-family="JetBrains Mono" font-weight="800" font-size="34" fill="#ff3b30">64,10</text>
      <text x="70" y="570" font-family="JetBrains Mono" font-weight="800" font-size="34" fill="#fff">ДТ</text><text x="320" y="570" text-anchor="end" font-family="JetBrains Mono" font-weight="800" font-size="34" fill="#ff3b30">70,90</text></g>
    <!-- навес и свет -->
    <rect x="90" y="640" width="530" height="70" fill="#f4f6f8" stroke="{K}" stroke-width="8"/><rect x="90" y="690" width="530" height="20" fill="#ff3b30"/>
    <path d="M355 710 L60 1500 L650 1500 Z" fill="url(#aLight)"/>
    <path d="M150 710 V1120 M560 710 V1120" stroke="#d9dde2" stroke-width="22"/>
    <rect y="1100" width="1080" height="820" fill="#2b2f37"/><path d="M0 1100 H1080" stroke="{K}" stroke-width="6"/>
    <!-- колонки -->
    {"".join(f'<g><rect x="{x}" y="900" width="110" height="220" rx="10" fill="#f4f6f8" stroke="{K}" stroke-width="7"/><rect x="{x + 15}" y="920" width="80" height="50" fill="#0d0f12"/><path d="M{x + 110} 980 q40 0 40 60 v60" stroke="{K}" stroke-width="8" fill="none"/></g>' for x in (220, 400))}
    <path d="M0 1500 H1080" stroke="#ffd23f" stroke-width="8" stroke-dasharray="60 40"/>
  </svg>
'''

# ---------- пост ДПС ночью: будка «ПОСТ», шлагбаум, конусы, фонарь
dps = HEAD + f'''    <defs><linearGradient id="pSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#070a16"/><stop offset="1" stop-color="#232b48"/></linearGradient>
      <radialGradient id="pLamp2" cx=".5" cy="0" r="1"><stop offset="0" stop-color="#ffe9a8" stop-opacity=".5"/><stop offset="1" stop-color="#ffe9a8" stop-opacity="0"/></radialGradient></defs>
    <rect width="1080" height="1920" fill="url(#pSky)"/>{dots(30, 0, 0, 1080, 700, "#fff", (1, 3))}
    <path d="M0 900 L380 860 L700 860 L1080 900 Z" fill="#141a2c"/>
    <g fill="#0e1424">{"".join(f'<path d="M{x} 900 l24 -{h} l24 {h} z"/>' for x, h in [(20, 90), (70, 120), (900, 100), (960, 130), (1020, 80)])}</g>
    <!-- будка -->
    <rect x="640" y="620" width="340" height="480" fill="#e8ecf0" stroke="{K}" stroke-width="8"/><rect x="680" y="700" width="260" height="170" fill="#ffe9a8" stroke="{K}" stroke-width="6"/>
    <rect x="640" y="560" width="340" height="70" fill="#1d6fb8" stroke="{K}" stroke-width="7"/><text x="810" y="610" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="42" fill="#fff">ПОСТ</text>
    <!-- фонарь -->
    <path d="M200 1100 V520 h120" stroke="#2a2f3a" stroke-width="16" fill="none"/><ellipse cx="320" cy="530" rx="34" ry="14" fill="#ffe9a8"/><path d="M320 530 L80 1500 L560 1500 Z" fill="url(#pLamp2)"/>
    <rect y="1100" width="1080" height="820" fill="#2b2f37"/><path d="M0 1100 H1080" stroke="{K}" stroke-width="6"/>
    <!-- шлагбаум -->
    <g><rect x="560" y="1000" width="50" height="120" fill="#e8ecf0" stroke="{K}" stroke-width="6"/>
      <path d="M585 1020 L40 990" stroke="#fff" stroke-width="26"/><path d="M585 1020 L40 990" stroke="#e53935" stroke-width="26" stroke-dasharray="50 50"/><path d="M585 1020 L40 990" stroke="{K}" stroke-width="4" fill="none" opacity=".5"/></g>
    {"".join(f'<g><path d="M{x} 1260 l30 -90 l30 90 z" fill="#ff7a1a" stroke="{K}" stroke-width="5"/><path d="M{x + 12} 1220 h36" stroke="#fff" stroke-width="10"/></g>' for x in (140, 300, 900))}
    <path d="M0 1500 H1080" stroke="#f4f6f8" stroke-width="8" stroke-dasharray="60 40"/>
  </svg>
'''

# ---------- утро, въезд в город: рассвет, синий указатель «МОСКВА 10»
citysign = HEAD + f'''    <defs><linearGradient id="cSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3b4f8f"/><stop offset=".55" stop-color="#f6a46b"/><stop offset="1" stop-color="#ffd9a8"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#cSky)"/>
    <circle cx="300" cy="880" r="110" fill="#ffe08a" opacity=".9"/>
    <g fill="#6a5a7a">{"".join(f'<rect x="{x}" y="{y}" width="{w}" height="{980 - y}"/>' for x, y, w in [(560, 700, 90), (660, 640, 70), (740, 720, 110), (860, 600, 80), (950, 680, 130)])}</g>
    <path d="M0 980 H1080 V1920 H0 Z" fill="#7a8a5a"/>
    <path d="M380 980 L700 980 L1080 1920 L0 1920 Z" fill="#4f5562" stroke="{K}" stroke-width="7"/>
    <path d="M540 990 L540 1920" stroke="#f4f6f8" stroke-width="12" stroke-dasharray="60 60"/>
    <!-- указатель -->
    <g><path d="M860 1220 V860" stroke="#9aa3ab" stroke-width="20"/><rect x="700" y="620" width="340" height="250" rx="14" fill="#1d4fb8" stroke="#f4f6f8" stroke-width="10"/>
      <text x="870" y="725" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="54" fill="#fff">МОСКВА</text>
      <text x="870" y="820" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="64" fill="#fff">10 км</text></g>
  </svg>
'''

for n, s in [("room", room), ("train", train), ("yard", yard), ("azs", azs), ("dps", dps), ("citysign", citysign)]:
    open(f"bg_{n}.svg.part", "w").write(s)
print("ok")
