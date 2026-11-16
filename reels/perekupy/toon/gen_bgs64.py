# python3 gen_bgs64.py → фоны для ep72 «Шиномонтаж: первый снег» (киношный формат, с матом):
# bg_shinomontazh (снаружи: гаражный бокс, вывеска «ШИНОМОНТАЖ У КОЛЯНА», штабеля шин, снег на крыше и земле, сугробы),
# bg_shinobox (внутри бокса: шиномонтажный станок, балансировка, шины на стеллаже, компрессор, плакат, окно со снегом),
# bg_ochered (дорога зимой: очередь машин до горизонта, снег, фонари, указатель «ШИНОМОНТАЖ 200 м»)
import random
K = "#000"
HEAD = '  <svg id="bg" width="1080" height="1920" viewBox="0 0 1080 1920" style="position:absolute;left:0;top:0">\n'
F = 'font-family="Unbounded" font-weight="900"'
R = random.randint
TIRE = lambda x, y, r: f'<circle cx="{x}" cy="{y}" r="{r}" fill="#26282e" stroke="{K}" stroke-width="5"/><circle cx="{x}" cy="{y}" r="{r * .5}" fill="#4a4f5a" stroke="{K}" stroke-width="4"/>'

random.seed(281)
shm = HEAD + f'''    <defs><linearGradient id="sm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8a9ab0"/><stop offset="1" stop-color="#d8e0e8"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#sm)"/>
    <!-- бокс -->
    <rect x="120" y="560" width="840" height="700" fill="#c8b8a0" stroke="{K}" stroke-width="8"/>
    <path d="M90 560 H990 L960 500 H120 Z" fill="#f4f6f8" stroke="{K}" stroke-width="6"/>
    <rect x="230" y="640" width="620" height="120" rx="12" fill="#ffd23f" stroke="{K}" stroke-width="7"/><text x="540" y="694" text-anchor="middle" {F} font-size="38" fill="#151515">ШИНОМОНТАЖ</text><text x="540" y="740" text-anchor="middle" {F} font-size="30" fill="#c0392b">«У КОЛЯНА»</text>
    <rect x="300" y="820" width="480" height="440" fill="#3a3d46" stroke="{K}" stroke-width="7"/>{"".join(f'<path d="M300 {y} H780" stroke="#2b2f37" stroke-width="5"/>' for y in range(860, 1260, 40))}
    <!-- штабеля шин -->
    {"".join(TIRE(x, y, 56) for x in (60, 1020) for y in (1200, 1110, 1020, 930))}
    <!-- земля в снегу -->
    <rect y="1260" width="1080" height="660" fill="#e8eef4"/><path d="M0 1260 H1080" stroke="{K}" stroke-width="6"/>
    {"".join(f'<ellipse cx="{R(0, 1080)}" cy="{R(1300, 1880)}" rx="{R(60, 160)}" ry="{R(10, 20)}" fill="#c8d4e0" opacity=".7"/>' for _ in range(14))}
    <path d="M0 1260 q120 -50 240 0 z M840 1260 q120 -60 240 0 z" fill="#ffffff" stroke="#c8d4e0" stroke-width="4"/>
  </svg>
'''

random.seed(282)
box = HEAD + f'''    <rect width="1080" height="1920" fill="#5a6070"/>
    {"".join(f'<path d="M0 {y} H1080" stroke="#4e5462" stroke-width="4"/>' for y in range(100, 1300, 100))}
    <!-- окно со снегом -->
    <rect x="620" y="260" width="360" height="300" fill="#c8d8e8" stroke="{K}" stroke-width="8"/><path d="M800 260 V560 M620 410 H980" stroke="{K}" stroke-width="6"/>
    {"".join(f'<circle cx="{R(630, 970)}" cy="{R(270, 550)}" r="{R(3, 6)}" fill="#fff"/>' for _ in range(30))}
    <!-- стеллаж с шинами -->
    <rect x="40" y="200" width="460" height="760" fill="none" stroke="#3a2a1a" stroke-width="14"/>{"".join(f'<path d="M40 {y} H500" stroke="#3a2a1a" stroke-width="12"/>' for y in (460, 720))}
    {"".join(TIRE(x, y, 66) for x in (130, 270, 410) for y in (380, 640, 890))}
    <!-- плакат -->
    <rect x="620" y="620" width="300" height="200" fill="#fbf6ec" stroke="{K}" stroke-width="6"/><text x="770" y="690" text-anchor="middle" {F} font-size="28" fill="#c0392b">ЗИМА</text><text x="770" y="740" text-anchor="middle" {F} font-size="26" fill="#151515">БЛИЗКО</text><text x="770" y="790" text-anchor="middle" font-family="JetBrains Mono" font-weight="800" font-size="22" fill="#151515">переобуйся!</text>
    <!-- компрессор -->
    <rect x="860" y="1020" width="160" height="240" rx="20" fill="#c0392b" stroke="{K}" stroke-width="7"/><circle cx="940" cy="1080" r="34" fill="#f4f0e8" stroke="{K}" stroke-width="5"/>
    <!-- пол -->
    <rect y="1300" width="1080" height="620" fill="#4a4e58"/><path d="M0 1300 H1080" stroke="{K}" stroke-width="7"/>
    {"".join(f'<ellipse cx="{R(0, 1080)}" cy="{R(1360, 1880)}" rx="{R(40, 120)}" ry="{R(8, 18)}" fill="#3a3d46" opacity=".6"/>' for _ in range(10))}
  </svg>
'''

random.seed(283)
och = HEAD + f'''    <defs><linearGradient id="oc" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9aa8bc"/><stop offset="1" stop-color="#e2e8ee"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#oc)"/>
    <!-- дорога в перспективу -->
    <path d="M500 760 H580 L1080 1920 H0 Z" fill="#8a8e98"/><path d="M500 760 L0 1920 M580 760 L1080 1920" stroke="#e8eef4" stroke-width="30"/>
    <rect y="700" width="1080" height="70" fill="#d8e0e8"/>
    <!-- очередь машин: всё меньше к горизонту -->
    {"".join(f'<g transform="translate({540 - 30 * (1 - k / 14)} {1800 - k * 75}) scale({1.05 - k * .07})"><path d="M-120 0 q10 -70 60 -76 h120 q50 6 60 76 v40 h-240 z" fill="{("#c0392b", "#2f6db5", "#ffd23f", "#4a4f5a", "#2f8a4a", "#f4f0e8")[k % 6]}" stroke="{K}" stroke-width="6"/><circle cx="-80" cy="10" r="16" fill="#ff3b30"/><circle cx="80" cy="10" r="16" fill="#ff3b30"/></g>' for k in range(13, -1, -1))}
    <!-- фонари -->
    {"".join(f'<path d="M{x} 1500 V600" stroke="#2b2f37" stroke-width="12"/><circle cx="{x}" cy="590" r="18" fill="#ffd27a"/>' for x in (80, 1000))}
    <!-- указатель -->
    <rect x="740" y="820" width="300" height="110" fill="#2f6db5" stroke="{K}" stroke-width="6"/><text x="890" y="866" text-anchor="middle" {F} font-size="26" fill="#fff">ШИНОМОНТАЖ</text><text x="890" y="908" text-anchor="middle" {F} font-size="26" fill="#ffd23f">→ 200 м</text>
  </svg>
'''

for n, s in (("shinomontazh", shm), ("shinobox", box), ("ochered", och)):
    open(f"bg_{n}.svg.part", "w").write(s)
print("ok")
