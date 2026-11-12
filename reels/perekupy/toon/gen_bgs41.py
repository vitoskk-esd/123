# python3 gen_bgs41.py → фоны для «Толян: со ста тысяч», часть 11 «Партнёры» (ep49, киношный формат):
# bg_bowling (боулинг ночью: неоновые дорожки, кегли, табло «STRIKE», диванчики, шары на возврате),
# bg_notarius (кабинет нотариуса: стеллаж с папками, печать, герб-рамка, стол у стены, кулер, жалюзи),
# bg_biblioteka (читальный зал института днём: стеллажи, лампы с зелёными абажурами, окна, плакат «ТИШИНА»),
# bg_neongarazh (тюнинг-гараж Виталика ночью: неоновые полосы, плакаты, стеллаж с дисками, компрессор),
# bg_promzona (промзона на закате: бетонный забор с граффити, ангар, прожектор, лужи, трубы)
import random
K = "#000"
random.seed(61)
HEAD = '  <svg id="bg" width="1080" height="1920" viewBox="0 0 1080 1920" style="position:absolute;left:0;top:0">\n'
F = 'font-family="Unbounded" font-weight="900"'
M = 'font-family="JetBrains Mono" font-weight="800"'
C = 'font-family="Caveat" font-weight="700"'
R = random.randint

# ---------- боулинг
bowling = HEAD + f'''    <defs><linearGradient id="bwL" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a1a4a"/><stop offset="1" stop-color="#d9a35a"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="#120c22"/>
    <!-- табло над дорожками -->
    <rect x="0" y="120" width="1080" height="200" fill="#1a1230" stroke="{K}" stroke-width="6"/>
    {"".join(f'<g><rect x="{x}" y="150" width="240" height="140" rx="10" fill="#0a0814" stroke="#3a2a6a" stroke-width="6"/><text x="{x + 120}" y="{215 + 0}" text-anchor="middle" {F} font-size="34" fill="{c}">{t}</text><text x="{x + 120}" y="262" text-anchor="middle" {M} font-size="22" fill="#8b93a3">{s}</text></g>'
             for x, t, c, s in [(30, "STRIKE", "#ff3bd0", "ДОРОЖКА 5"), (300, "ТОЛЯН", "#5ad0ff", "142"), (570, "ЖОРА", "#ffd23f", "138"), (840, "9 | 1", "#4cd964", "SPARE")])}
    <!-- дорожки в перспективе -->
    {"".join(f'<path d="M{540 + (x - 540) * .28} 700 L{540 + (x + 160 - 540) * .28} 700 L{x + 160} 1920 L{x} 1920 Z" fill="url(#bwL)" stroke="#0a0814" stroke-width="8"/>' for x in range(-560, 1700, 230))}
    {"".join(f'<path d="M{540 + (x + 80 - 540) * .28} 700 L{x + 80} 1920" stroke="#ff3bd0" stroke-width="3" opacity=".35"/>' for x in range(-560, 1700, 230))}
    <!-- кегли вдали -->
    {"".join(f'<g>{"".join(f"<ellipse cx=\"{cx + dx}\" cy=\"{690 - row * 8}\" rx=\"7\" ry=\"14\" fill=\"#fff\" stroke=\"{K}\" stroke-width=\"2\"/>" for row in range(4) for dx in range(-row * 8, row * 8 + 1, 16))}</g>' for cx in (540 + (x + 80 - 540) * .28 for x in range(-330, 1240, 230)))}
    <rect x="0" y="560" width="1080" height="110" fill="#0a0814"/><path d="M0 670 H1080" stroke="#ff3bd0" stroke-width="6" opacity=".8"/>
    {"".join(f'<path d="M{x} 600 h70" stroke="{c}" stroke-width="8" stroke-linecap="round"/>' for x, c in zip(range(40, 1080, 160), ["#5ad0ff", "#ff3bd0", "#ffd23f"] * 3))}
    <!-- диванчики и возврат шаров -->
    <g><path d="M-20 1460 h360 v-160 q0 -40 -40 -40 h-280 q-40 0 -40 40 z" fill="#6a2a8a" stroke="{K}" stroke-width="7"/><path d="M-20 1380 h360" stroke="#4a1a6a" stroke-width="10"/></g>
    <g><rect x="820" y="1240" width="260" height="140" rx="40" fill="#2b2f37" stroke="{K}" stroke-width="7"/>
      {"".join(f'<circle cx="{x}" cy="1236" r="40" fill="{c}" stroke="{K}" stroke-width="6"/>' for x, c in [(870, "#c0392b"), (960, "#2f6db5"), (1050, "#ffd23f")])}</g>
  </svg>
'''

# ---------- нотариус
notarius = HEAD + f'''    <rect width="1080" height="1920" fill="#e6dfcf"/>
    <g fill="#d9d0bc">{"".join(f'<rect x="0" y="{y}" width="1080" height="14"/>' for y in range(0, 1000, 60))}</g>
    <!-- окно с жалюзи -->
    <g><rect x="620" y="200" width="380" height="460" fill="#cfe7f7" stroke="#8a929b" stroke-width="12"/>{"".join(f'<rect x="626" y="{y}" width="368" height="18" fill="#f4f6f8" stroke="#b9bfca" stroke-width="2"/>' for y in range(210, 650, 30))}</g>
    <!-- стеллаж с папками -->
    <g><rect x="40" y="160" width="460" height="840" fill="#7a522b" stroke="{K}" stroke-width="8"/>{"".join(f'<path d="M40 {y} H500" stroke="{K}" stroke-width="6"/>' for y in (370, 580, 790))}
      {"".join(f'<rect x="{x}" y="{y}" width="36" height="190" fill="{c}" stroke="{K}" stroke-width="3"/>' for y in (175, 385, 595, 805) for x, c in zip(range(56, 490, 44), ["#2f6db5", "#c0392b", "#e8a33a", "#4f9d48", "#6b4a8a", "#2f6db5", "#e8a33a", "#c0392b", "#4f9d48", "#2f6db5"]))}</g>
    <!-- герб в рамке и часы -->
    <g><rect x="680" y="720" width="180" height="200" fill="#f4efe2" stroke="#c9a24a" stroke-width="10"/><path d="M770 760 l40 30 l-15 70 h-50 l-15 -70 z" fill="#c9a24a" stroke="{K}" stroke-width="3"/></g>
    <g><circle cx="940" cy="800" r="56" fill="#fff" stroke="{K}" stroke-width="7"/><path d="M940 800 v-34 M940 800 l24 14" stroke="{K}" stroke-width="6" stroke-linecap="round"/></g>
    <!-- стол у стены (на заднем плане) с печатью и бумагами -->
    <g><rect x="300" y="930" width="520" height="36" fill="#5b3a1e" stroke="{K}" stroke-width="6"/><rect x="320" y="966" width="100" height="160" fill="#5b3a1e" stroke="{K}" stroke-width="5"/><rect x="700" y="966" width="100" height="160" fill="#5b3a1e" stroke="{K}" stroke-width="5"/>
      <rect x="380" y="900" width="170" height="30" fill="#fff" stroke="{K}" stroke-width="3"/><path d="M640 930 v-40 h30 v40 z" fill="#2b2f37" stroke="{K}" stroke-width="3"/><ellipse cx="655" cy="884" rx="26" ry="12" fill="#2f4fb8" stroke="{K}" stroke-width="3"/></g>
    <!-- кулер -->
    <g><rect x="920" y="960" width="110" height="180" fill="#e8ecf0" stroke="{K}" stroke-width="5"/><path d="M930 960 q0 -110 45 -120 q45 10 45 120 z" fill="#9fd0f2" stroke="{K}" stroke-width="5" opacity=".9"/></g>
    <rect y="1150" width="1080" height="770" fill="#9a8466"/><path d="M0 1150 H1080" stroke="{K}" stroke-width="7"/>
    {"".join(f'<path d="M0 {y} H1080" stroke="#8a7458" stroke-width="5"/>' for y in range(1230, 1920, 100))}
    <rect x="160" y="1300" width="760" height="420" rx="30" fill="#7a2a2a" opacity=".55"/>
  </svg>
'''

# ---------- библиотека
biblioteka = HEAD + f'''    <rect width="1080" height="1920" fill="#e9dcc0"/>
    <!-- окна -->
    {"".join(f'<g><path d="M{x} 520 v-260 q0 -80 90 -80 q90 0 90 80 v260 z" fill="#cfe7f7" stroke="#8a6d48" stroke-width="12"/><path d="M{x + 90} 180 V520 M{x} 360 H{x + 180}" stroke="#8a6d48" stroke-width="8"/></g>' for x in (80, 820))}
    <!-- стеллажи -->
    {"".join(f'<g><rect x="{x}" y="140" width="260" height="900" fill="#6b4422" stroke="{K}" stroke-width="7"/>' + "".join(f'<path d="M{x} {y} H{x + 260}" stroke="{K}" stroke-width="6"/>' for y in range(320, 1040, 180)) +
             "".join(f'<rect x="{x + 10 + i * 26}" y="{y - 150 + (i % 3) * 6}" width="22" height="{144 - (i % 3) * 6}" fill="{random.choice(["#8a2a2a", "#2f4f8a", "#3a6a3a", "#8a6a2a", "#4a2a5a"])}" stroke="{K}" stroke-width="2"/>' for y in range(320, 1040, 180) for i in range(9)) + "</g>" for x in (300, 560))}
    <text x="540" y="110" text-anchor="middle" {F} font-size="44" fill="#c0392b">ТИШИНА</text>
    <!-- длинный стол с лампами -->
    <rect y="1150" width="1080" height="770" fill="#8c5f3a"/><path d="M0 1150 H1080" stroke="{K}" stroke-width="7"/>
    <g stroke="#7a522b" stroke-width="5">{"".join(f'<path d="M0 {y} H1080"/>' for y in range(1220, 1920, 80))}</g>
    <g><rect x="0" y="1060" width="1080" height="34" fill="#5b3a1e" stroke="{K}" stroke-width="6"/>{"".join(f'<g><path d="M{x} 1060 v-90" stroke="#c9a24a" stroke-width="8"/><path d="M{x - 60} 990 q60 -70 120 0 z" fill="#2f7a4a" stroke="{K}" stroke-width="5"/></g>' for x in (170, 910))}
      <rect x="380" y="1036" width="160" height="24" fill="#f4f1e8" stroke="{K}" stroke-width="3"/><rect x="560" y="1030" width="120" height="30" fill="#2f4f8a" stroke="{K}" stroke-width="3"/></g>
  </svg>
'''

# ---------- неоновый гараж Виталика
neongarazh = HEAD + f'''    <rect width="1080" height="1920" fill="#15121f"/>
    <g stroke="#221c33" stroke-width="5">{"".join(f'<path d="M{x} 0 V1060"/>' for x in range(0, 1080, 90))}</g>
    <!-- неоновые полосы на потолке -->
    {"".join(f'<g><rect x="{x}" y="{y}" width="{w}" height="14" rx="7" fill="{c}"/><rect x="{x - 20}" y="{y - 20}" width="{w + 40}" height="54" rx="27" fill="{c}" opacity=".18"/></g>' for x, y, w, c in [(80, 120, 380, "#ff3bd0"), (600, 160, 400, "#5ad0ff"), (240, 260, 600, "#ff3bd0")])}
    <!-- плакаты и вывеска -->
    <g transform="rotate(-3 220 520)"><rect x="90" y="400" width="260" height="240" fill="#0d0e12" stroke="#5ad0ff" stroke-width="6"/><text x="220" y="500" text-anchor="middle" {F} font-size="40" fill="#5ad0ff">STANCE</text><text x="220" y="560" text-anchor="middle" {M} font-size="24" fill="#ff3bd0">LOW &amp; SLOW</text></g>
    <g><rect x="620" y="380" width="380" height="110" rx="20" fill="#0d0e12" stroke="#ff3bd0" stroke-width="6"/><text x="810" y="452" text-anchor="middle" {F} font-size="44" fill="#ff3bd0">VITALIK</text></g>
    <!-- стеллаж с дисками -->
    <g><rect x="620" y="560" width="380" height="460" fill="#2b2f37" stroke="{K}" stroke-width="6"/>{"".join(f'<path d="M620 {y} H1000" stroke="{K}" stroke-width="6"/>' for y in (710, 860))}
      {"".join(f'<g><circle cx="{x}" cy="{y}" r="56" fill="#8a929b" stroke="{K}" stroke-width="5"/><circle cx="{x}" cy="{y}" r="18" fill="#2b2f37"/>' + "".join(f'<path d="M{x} {y} l{40 * __import__("math").cos(a)} {40 * __import__("math").sin(a)}" stroke="#2b2f37" stroke-width="8"/>' for a in (0, 1.26, 2.51, 3.77, 5.03)) + "</g>" for x in (690, 810, 930) for y in (640, 790, 940))}</g>
    <!-- компрессор и канистры -->
    <g><rect x="80" y="880" width="200" height="140" rx="16" fill="#c0392b" stroke="{K}" stroke-width="6"/><circle cx="130" cy="1030" r="22" fill="#151515"/><circle cx="240" cy="1030" r="22" fill="#151515"/>
      <rect x="320" y="920" width="80" height="100" fill="#e8a33a" stroke="{K}" stroke-width="5"/></g>
    <!-- пол: глянцевый бетон с отражениями неона -->
    <rect y="1060" width="1080" height="860" fill="#2a2633"/><path d="M0 1060 H1080" stroke="{K}" stroke-width="7"/>
    {"".join(f'<rect x="{x}" y="1100" width="{w}" height="600" fill="{c}" opacity=".08"/>' for x, w, c in [(80, 380, "#ff3bd0"), (600, 400, "#5ad0ff"), (240, 600, "#ff3bd0")])}
  </svg>
'''

# ---------- промзона на закате
promzona = HEAD + f'''    <defs><linearGradient id="pzS" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a3a6a"/><stop offset=".6" stop-color="#e88a5a"/><stop offset="1" stop-color="#f4c98a"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#pzS)"/>
    <!-- трубы и ангар -->
    <g><rect x="760" y="240" width="60" height="560" fill="#5a4a5a" stroke="{K}" stroke-width="5"/><rect x="860" y="320" width="50" height="480" fill="#5a4a5a" stroke="{K}" stroke-width="5"/>
      <path d="M760 280 h60 M760 340 h60 M860 360 h50" stroke="#c0392b" stroke-width="14"/><ellipse cx="790" cy="220" rx="70" ry="30" fill="#c9b8c8" opacity=".6"/></g>
    <path d="M520 820 q240 -220 560 -40 V1000 H520 Z" fill="#6a5a6a" stroke="{K}" stroke-width="7"/>{"".join(f'<path d="M{x} {900 - (x - 520) * 0} V1000" stroke="#5a4a5a" stroke-width="5"/>' for x in range(560, 1080, 60))}
    <!-- бетонный забор с граффити -->
    <g>{"".join(f'<rect x="{x}" y="760" width="180" height="250" fill="#a8a29a" stroke="{K}" stroke-width="6"/>' for x in range(-40, 600, 180))}
      <text x="140" y="900" {F} font-size="56" fill="#4cd964" transform="rotate(-6 140 900)">ЖОРА</text><text x="330" y="960" {F} font-size="40" fill="#ff3bd0" transform="rotate(4 330 960)">+ ВИТЯ</text>
      <path d="M60 820 q60 -30 120 0 t120 0" stroke="#2f6db5" stroke-width="10" fill="none"/></g>
    <!-- прожектор -->
    <g><path d="M980 1010 V560" stroke="#2b2f37" stroke-width="14"/><rect x="930" y="520" width="100" height="56" fill="#e8ecf0" stroke="{K}" stroke-width="5"/></g>
    <!-- асфальт, лужи с закатом -->
    <rect y="1010" width="1080" height="910" fill="#5a5660"/><path d="M0 1010 H1080" stroke="{K}" stroke-width="7"/>
    {"".join(f'<ellipse cx="{R(60, 1020)}" cy="{R(1250, 1880)}" rx="{R(90, 220)}" ry="{R(16, 34)}" fill="#e8a37a" opacity=".55" stroke="#3a3640" stroke-width="3"/>' for _ in range(6))}
    {"".join(f'<path d="M{R(0, 1080)} {R(1050, 1900)} l{R(20, 60)} {R(-4, 4)}" stroke="#4a4650" stroke-width="5"/>' for _ in range(30))}
  </svg>
'''

for n, s in (("bowling", bowling), ("notarius", notarius), ("biblioteka", biblioteka), ("neongarazh", neongarazh), ("promzona", promzona)):
    open(f"bg_{n}.svg.part", "w").write(s)
print("ok")
