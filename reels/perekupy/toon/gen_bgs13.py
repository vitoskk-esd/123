# python3 gen_bgs13.py → фоны пятнадцатого набора (ep26 «Подборщик», вариант 2 — по просьбе владельца «скучно и однообразно»):
# bg_ferris (кабинка колеса обозрения на закате: город внизу, спицы колеса, соседняя кабинка), bg_carwash (мойка самообслуживания:
# боксы, пистолеты, пена, табло «МОЙКА 24»), bg_sauna (парилка: вагонка, полок, каменка, ковш, пар), bg_banya (ночная улица у бани:
# вывеска «БАНЯ № 1», фонарь, сугробы пара, припаркованные машины)
import random
K = "#000"
random.seed(27)
HEAD = '  <svg id="bg" width="1080" height="1920" viewBox="0 0 1080 1920" style="position:absolute;left:0;top:0">\n'

# ---------- кабинка колеса обозрения
city = "".join(f'<rect x="{x}" y="{1150 - h}" width="{w}" height="{h + 300}" fill="{c}"/>' + "".join(
    f'<rect x="{x + 10 + i * 22}" y="{1170 - h + j * 30}" width="10" height="14" fill="#ffd77a" opacity="{random.choice([.2, .9])}"/>' for i in range(w // 22 - 1) for j in range(h // 30))
    for x, w, h, c in [(-20, 140, 260, "#3b2a4a"), (130, 110, 380, "#4a3358"), (250, 160, 220, "#3b2a4a"), (420, 120, 330, "#2f2240"), (550, 180, 260, "#4a3358"), (740, 130, 420, "#3b2a4a"), (880, 220, 300, "#2f2240")])
ferris = HEAD + f'''    <defs><linearGradient id="fwSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2b3a7a"/><stop offset=".55" stop-color="#e0678a"/><stop offset="1" stop-color="#ffb36b"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#fwSky)"/><circle cx="820" cy="760" r="90" fill="#ffd77a" opacity=".9"/>
    <g opacity=".95">{city}</g>
    <!-- спицы колеса и соседняя кабинка -->
    <g stroke="#2b2f37" stroke-width="12" opacity=".85"><path d="M540 1500 L-200 300 M540 1500 L1300 380 M540 1500 L540 -100"/></g>
    <g id="nextcab"><path d="M300 470 V560" stroke="#2b2f37" stroke-width="8"/><rect x="200" y="560" width="200" height="170" rx="30" fill="#ff3b30" stroke="{K}" stroke-width="7"/>
      <rect x="222" y="582" width="156" height="92" rx="14" fill="#bfe3ff" stroke="{K}" stroke-width="5"/></g>
    <!-- рама нашей кабинки -->
    <path d="M0 0 H1080 V1920 H0 Z M90 240 H990 Q1010 240 1010 270 V1290 Q1010 1320 980 1320 H100 Q70 1320 70 1290 V270 Q70 240 90 240 Z" fill="#ffd23f" fill-rule="evenodd" stroke="{K}" stroke-width="10"/>
    <path d="M540 240 V1320" stroke="#e8b923" stroke-width="18"/><path d="M540 240 V1320" stroke="{K}" stroke-width="4" opacity=".5"/>
    <rect x="0" y="1320" width="1080" height="600" fill="#e8b923"/><rect x="60" y="1380" width="960" height="70" rx="20" fill="#c0392b" stroke="{K}" stroke-width="7"/>
    <g stroke="#c9a21f" stroke-width="5">{"".join(f'<path d="M0 {y} H1080"/>' for y in range(1480, 1920, 60))}</g>
  </svg>
'''

# ---------- мойка самообслуживания
foam = "".join(f'<circle cx="{random.randint(40, 1040)}" cy="{random.randint(1060, 1400)}" r="{random.randint(14, 40)}" fill="#fff" stroke="#bcd9ef" stroke-width="3" opacity=".9"/>' for _ in range(45))
carwash = HEAD + f'''    <rect width="1080" height="1920" fill="#1f3a5a"/>
    <!-- навес и табло -->
    <rect y="0" width="1080" height="260" fill="#2e86de" stroke="{K}" stroke-width="8"/>
    <g><rect x="300" y="60" width="480" height="140" rx="16" fill="#0d0f12" stroke="{K}" stroke-width="7"/>
      <text x="540" y="128" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="54" fill="#4cd964">МОЙКА 24</text>
      <text x="540" y="180" text-anchor="middle" font-family="JetBrains Mono" font-weight="800" font-size="30" fill="#ffd23f">ПЕНА · ВОСК · 10 ₽/мин</text></g>
    <!-- стены бокса -->
    <rect x="0" y="260" width="1080" height="820" fill="#dfe6ee"/>
    <g stroke="#c2ccd8" stroke-width="5">{"".join(f'<path d="M0 {y} H1080"/>' for y in range(320, 1080, 60))}</g>
    <path d="M60 260 V1080 M1020 260 V1080" stroke="#2b2f37" stroke-width="30"/>
    <!-- пистолеты и пульт -->
    <g><rect x="110" y="520" width="200" height="300" rx="14" fill="#ffd23f" stroke="{K}" stroke-width="7"/>
      {"".join(f'<circle cx="{150 + (i % 2) * 120}" cy="{580 + (i // 2) * 70}" r="24" fill="{c}" stroke="{K}" stroke-width="5"/>' for i, c in enumerate(["#4cd964", "#2e86de", "#ff3b30", "#fff", "#ffd23f", "#9b59b6"]))}
      <path d="M310 600 q120 40 150 260" stroke="{K}" stroke-width="10" fill="none"/></g>
    <g><path d="M900 280 V720" stroke="#2b2f37" stroke-width="10"/><path d="M880 720 h40 l-6 50 h-28 z" fill="#2b2f37"/></g>
    <!-- пол с решёткой и пена -->
    <rect y="1080" width="1080" height="840" fill="#5c626b"/><path d="M0 1080 H1080" stroke="{K}" stroke-width="7"/>
    <g stroke="#4a4f57" stroke-width="8">{"".join(f'<path d="M{x} 1400 V1920"/>' for x in range(300, 800, 30))}</g>
    <g>{foam}</g>
  </svg>
'''

# ---------- парилка
steam = "".join(f'<ellipse cx="{random.randint(0, 1080)}" cy="{random.randint(200, 900)}" rx="{random.randint(80, 200)}" ry="{random.randint(30, 60)}" fill="#fff" opacity="{random.choice([.12, .18, .25])}"/>' for _ in range(18))
sauna = HEAD + f'''    <rect width="1080" height="1920" fill="#c98f52"/>
    <g stroke="#a8743f" stroke-width="5">{"".join(f'<path d="M0 {y} H1080"/>' for y in range(40, 1100, 46))}</g>
    <!-- табличка и термометр -->
    <g><rect x="60" y="260" width="480" height="110" rx="12" fill="#7a4a24" stroke="{K}" stroke-width="6"/>
      <text x="300" y="330" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="34" fill="#f4e7c3">С ЛЁГКИМ ПАРОМ</text></g>
    <g><circle cx="900" cy="330" r="80" fill="#f4e7c3" stroke="#7a4a24" stroke-width="12"/><path d="M900 330 L950 290" stroke="#c0392b" stroke-width="8" stroke-linecap="round"/>
      <text x="900" y="390" text-anchor="middle" font-family="JetBrains Mono" font-weight="800" font-size="26" fill="#151515">110°</text></g>
    <!-- каменка с ковшом -->
    <g><rect x="760" y="760" width="250" height="320" fill="#4a4e58" stroke="{K}" stroke-width="7"/>
      {"".join(f'<circle cx="{780 + i * 32}" cy="{752 - (i % 2) * 14}" r="22" fill="#8b93a3" stroke="{K}" stroke-width="4"/>' for i in range(7))}
      <g><rect x="620" y="900" width="110" height="80" rx="10" fill="#a8743f" stroke="{K}" stroke-width="6"/><path d="M730 920 l80 -60" stroke="#7a4a24" stroke-width="12" stroke-linecap="round"/></g></g>
    <!-- полок -->
    <rect x="0" y="1060" width="1080" height="60" fill="#d9a066" stroke="{K}" stroke-width="7"/><rect x="0" y="1120" width="1080" height="260" fill="#b9814a" stroke="{K}" stroke-width="7"/>
    <g stroke="#9a6a3a" stroke-width="5">{"".join(f'<path d="M0 {y} H1080"/>' for y in range(1160, 1380, 44))}</g>
    <rect y="1380" width="1080" height="540" fill="#8b5a2b"/>
    <g>{steam}</g>
  </svg>
'''

# ---------- ночная улица у бани
banya = HEAD + f'''    <defs><linearGradient id="bnSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#05070f"/><stop offset="1" stop-color="#1b2238"/></linearGradient>
      <radialGradient id="bnLamp" cx=".5" cy="0" r="1"><stop offset="0" stop-color="#ffe9a8" stop-opacity=".5"/><stop offset="1" stop-color="#ffe9a8" stop-opacity="0"/></radialGradient></defs>
    <rect width="1080" height="1920" fill="url(#bnSky)"/>{"".join(f'<circle cx="{random.randint(0, 1080)}" cy="{random.randint(0, 500)}" r="{random.choice([1, 2])}" fill="#fff"/>' for _ in range(40))}
    <!-- здание бани -->
    <rect x="80" y="420" width="760" height="660" fill="#6b3a1f" stroke="{K}" stroke-width="8"/>
    <g stroke="#55301a" stroke-width="6">{"".join(f'<path d="M80 {y} H840"/>' for y in range(470, 1080, 50))}</g>
    <g><rect x="200" y="330" width="520" height="120" rx="12" fill="#151515" stroke="{K}" stroke-width="7"/>
      <text x="460" y="412" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="64" fill="#ff9f0a">БАНЯ № 1</text></g>
    {"".join(f'<rect x="{x}" y="560" width="150" height="130" fill="#ffd77a" stroke="{K}" stroke-width="6"/>' for x in (150, 640))}
    <rect x="380" y="760" width="160" height="320" fill="#3a2010" stroke="{K}" stroke-width="7"/><circle cx="520" cy="930" r="8" fill="#d4ac0d"/>
    <g fill="#fff" opacity=".25">{"".join(f'<ellipse cx="{x}" cy="{y}" rx="70" ry="34"/>' for x, y in [(230, 520), (300, 480), (700, 500), (760, 470)])}</g>
    <!-- фонарь -->
    <path d="M960 1080 V560" stroke="#2b2f37" stroke-width="14"/><path d="M920 560 h80 l-12 30 h-56 z" fill="#ffe9a8" stroke="{K}" stroke-width="5"/>
    <path d="M960 590 L700 1500 L1080 1500 L1080 900 Z" fill="url(#bnLamp)"/>
    <!-- улица -->
    <rect y="1080" width="1080" height="840" fill="#20232a"/><path d="M0 1080 H1080" stroke="{K}" stroke-width="6"/>
    <g fill="#f4f6f8" opacity=".4">{"".join(f'<rect x="{x}" y="1500" width="110" height="14" rx="4"/>' for x in range(20, 1080, 190))}</g>
  </svg>
'''

for n, s in [("ferris", ferris), ("carwash", carwash), ("sauna", sauna), ("banya", banya)]:
    open(f"bg_{n}.svg.part", "w").write(s)
print("ok")
