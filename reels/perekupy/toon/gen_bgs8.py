# python3 gen_bgs8.py → фоны десятого набора (ep22 «Двойник»):
# bg_cross (перекрёсток днём: светофор, зебра, дома), bg_parkade (многоуровневый паркинг ночью), bg_numgarage (подпольный гараж с трафаретами номеров),
# bg_expert (эстакада экспертизы ГИБДД), bg_detective (кабинет следователя: доска с фото и красными нитками)
import random
K = "#000"
random.seed(22)
HEAD = '  <svg id="bg" width="1080" height="1920" viewBox="0 0 1080 1920" style="position:absolute;left:0;top:0">\n'
win = lambda x0, y0, cols, rows, w=46, h=56, gx=24, gy=30, lit=.5: "".join(
    f'<rect x="{x0 + c * (w + gx)}" y="{y0 + r * (h + gy)}" width="{w}" height="{h}" fill="{"#ffd27a" if random.random() < lit else "#9fb3c8"}" stroke="{K}" stroke-width="3"/>'
    for c in range(cols) for r in range(rows))

# ---------- перекрёсток днём
cross = HEAD + f'''    <defs><linearGradient id="cSky8" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8ec5ff"/><stop offset="1" stop-color="#d9ecff"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#cSky8)"/>
    <g fill="#fff" opacity=".9"><ellipse cx="180" cy="220" rx="110" ry="38"/><ellipse cx="880" cy="160" rx="140" ry="44"/></g>
    <rect x="0" y="420" width="360" height="680" fill="#c97b5a" stroke="{K}" stroke-width="7"/>{win(30, 460, 5, 7, lit=.2)}
    <rect x="380" y="560" width="300" height="540" fill="#e8e2d4" stroke="{K}" stroke-width="7"/>{win(405, 600, 4, 5, lit=.2)}
    <rect x="700" y="380" width="380" height="720" fill="#7f9bb3" stroke="{K}" stroke-width="7"/>{win(725, 420, 5, 7, lit=.2)}
    <rect x="390" y="1000" width="90" height="100" fill="#6b4423" stroke="{K}" stroke-width="5"/>
    <rect y="1100" width="1080" height="820" fill="#5d636e"/><path d="M0 1100 H1080" stroke="{K}" stroke-width="7"/>
    <rect y="1100" width="1080" height="60" fill="#9aa3ab"/>
    <g fill="#f4f6f8">{"".join(f'<rect x="{x}" y="1620" width="70" height="200"/>' for x in range(30, 1080, 120))}</g>
    <path d="M0 1460 H1080" stroke="#ffd23f" stroke-width="10" stroke-dasharray="80 60"/>
    <!-- светофор -->
    <g><path d="M980 1150 V560" stroke="#2a2f3a" stroke-width="18"/><rect x="930" y="560" width="100" height="250" rx="20" fill="#1c1c20" stroke="{K}" stroke-width="7"/>
      <circle cx="980" cy="610" r="30" fill="#ff3b30" stroke="{K}" stroke-width="5"/><circle cx="980" cy="685" r="30" fill="#5a4a1a" stroke="{K}" stroke-width="5"/>
      <circle cx="980" cy="760" r="30" fill="#1f4a2a" stroke="{K}" stroke-width="5"/></g>
  </svg>
'''

# ---------- многоуровневый паркинг ночью
parkade = HEAD + f'''    <rect width="1080" height="1920" fill="#2b2f37"/>
    <rect y="0" width="1080" height="420" fill="#3d424c"/><path d="M0 420 H1080" stroke="{K}" stroke-width="10"/>
    <g fill="#f4fbff" stroke="{K}" stroke-width="4">{"".join(f'<rect x="{x}" y="320" width="200" height="22" rx="8"/>' for x in (80, 440, 800))}</g>
    <g fill="#fff3c4" opacity=".12">{"".join(f'<path d="M{x + 100} 342 L{x - 120} 1300 L{x + 320} 1300 Z"/>' for x in (80, 440, 800))}</g>
    <g fill="#9aa3ab" stroke="{K}" stroke-width="7">{"".join(f'<rect x="{x}" y="420" width="70" height="700"/>' for x in (120, 890))}</g>
    <g><rect x="110" y="600" width="90" height="90" fill="#ffd23f" stroke="{K}" stroke-width="5"/><text x="155" y="665" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="54">B2</text></g>
    <g><rect x="880" y="600" width="90" height="90" fill="#ffd23f" stroke="{K}" stroke-width="5"/><text x="925" y="665" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="54">B2</text></g>
    <rect y="1120" width="1080" height="800" fill="#3a3f48"/><path d="M0 1120 H1080" stroke="{K}" stroke-width="7"/>
    <g stroke="#ffd23f" stroke-width="8">{"".join(f'<path d="M{x} 1160 L{x * 1.25 - 140} 1920"/>' for x in range(100, 1100, 280))}</g>
    <g><rect x="380" y="520" width="320" height="70" rx="8" fill="#2e7d32" stroke="{K}" stroke-width="5"/>
      <text x="540" y="568" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="34" fill="#fff">ВЫЕЗД →</text></g>
  </svg>
'''

# ---------- подпольный гараж: красная лампа, верстак, трафареты цифр, дрель, болгарка, штампы
stencil = "".join(f'<text x="{x}" y="{y}" font-family="JetBrains Mono" font-weight="800" font-size="64" fill="none" stroke="#d9dde2" stroke-width="3">{ch}</text>'
                  for x, y, ch in [(90, 560, "7"), (160, 560, "J"), (230, 560, "T"), (300, 560, "3"), (90, 650, "Z"), (160, 650, "9"), (230, 650, "4"), (300, 650, "К")])
numgarage = HEAD + f'''    <defs><radialGradient id="nRed" cx=".5" cy=".2" r=".8"><stop offset="0" stop-color="#ff5a3c" stop-opacity=".5"/><stop offset="1" stop-color="#ff5a3c" stop-opacity="0"/></radialGradient></defs>
    <rect width="1080" height="1920" fill="#23201f"/>
    <g stroke="#2e2a28" stroke-width="20">{"".join(f'<path d="M{x} 0 V1200"/>' for x in range(40, 1080, 90))}</g>
    <rect width="1080" height="1920" fill="url(#nRed)"/>
    <path d="M540 0 V170" stroke="#111" stroke-width="5"/><circle cx="540" cy="190" r="26" fill="#ff5a3c" stroke="{K}" stroke-width="5"/>
    <!-- доска с трафаретами -->
    <rect x="60" y="480" width="340" height="200" fill="#3a3330" stroke="{K}" stroke-width="7"/>{stencil}
    <!-- инструменты на стене -->
    <g><rect x="640" y="460" width="380" height="240" fill="#4a3f2c" stroke="{K}" stroke-width="7"/>
      <path d="M690 520 h110 l20 20 h-130 z" fill="#ff9f0a" stroke="{K}" stroke-width="4"/><circle cx="880" cy="560" r="44" fill="#9aa3ab" stroke="{K}" stroke-width="6"/>
      <rect x="690" y="610" width="140" height="40" rx="10" fill="#2e86de" stroke="{K}" stroke-width="5"/></g>
    <!-- верстак -->
    <rect x="40" y="1080" width="1000" height="60" fill="#6b4423" stroke="{K}" stroke-width="7"/><rect x="80" y="1140" width="40" height="200" fill="#4a2e18"/><rect x="960" y="1140" width="40" height="200" fill="#4a2e18"/>
    <g>{"".join(f'<rect x="{120 + i * 46}" y="1040" width="36" height="40" fill="#c0c4ca" stroke="{K}" stroke-width="3"/>' for i in range(8))}</g>
    <text x="300" y="1030" text-anchor="middle" font-family="Onest" font-weight="700" font-size="24" fill="#cfd5dd">набор клейм 0–9 A–Z</text>
    <rect y="1340" width="1080" height="580" fill="#2b2726"/><path d="M0 1340 H1080" stroke="{K}" stroke-width="7"/>
    <g fill="#ff9f0a">{"".join(f'<circle cx="{random.randint(100, 980)}" cy="{random.randint(1360, 1880)}" r="{random.randint(2, 5)}"/>' for _ in range(30))}</g>
  </svg>
'''

# ---------- эстакада экспертизы
expert = HEAD + f'''    <rect width="1080" height="1920" fill="#d6dde4"/>
    <rect y="0" width="1080" height="160" fill="#1d4fb8"/>
    <text x="540" y="104" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="50" fill="#fff">ЭКСПЕРТИЗА ТС</text>
    <g fill="#f4fbff" stroke="{K}" stroke-width="5"><rect x="140" y="250" width="300" height="26" rx="10"/><rect x="640" y="250" width="300" height="26" rx="10"/></g>
    <path d="M290 276 L60 1200 L520 1200 Z M790 276 L560 1200 L1020 1200 Z" fill="#fff" opacity=".22"/>
    <g><rect x="60" y="430" width="300" height="200" fill="#fff" stroke="{K}" stroke-width="6"/><text x="210" y="480" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="24">ГДЕ ИСКАТЬ VIN</text>
      <path d="M90 560 q60 -60 120 -50 q60 10 120 -10 v70 h-240 z" fill="#c9ced6" stroke="{K}" stroke-width="4"/>
      <circle cx="140" cy="530" r="10" fill="#ff3b30"/><circle cx="250" cy="520" r="10" fill="#ff3b30"/><circle cx="310" cy="560" r="10" fill="#ff3b30"/></g>
    <!-- эстакада -->
    <path d="M60 1120 L1020 1120 L1020 1160 L60 1160 Z" fill="#ffd23f" stroke="{K}" stroke-width="7"/>
    <g stroke="#151515" stroke-width="10">{"".join(f'<path d="M{x} 1120 l40 40"/>' for x in range(60, 1020, 80))}</g>
    <rect x="120" y="1160" width="50" height="300" fill="#5c626b" stroke="{K}" stroke-width="5"/><rect x="910" y="1160" width="50" height="300" fill="#5c626b" stroke="{K}" stroke-width="5"/>
    <rect y="1460" width="1080" height="460" fill="#9aa3ab"/><path d="M0 1460 H1080" stroke="{K}" stroke-width="7"/>
  </svg>
'''

# ---------- кабинет следователя: жалюзи, стол с лампой, доска с фото и красными нитками
pins = [(160, 360), (420, 300), (700, 340), (900, 420), (280, 560), (620, 600), (860, 640)]
board = "".join(f'<g><rect x="{x - 60}" y="{y - 50}" width="120" height="100" fill="#f4f1ea" stroke="{K}" stroke-width="4" transform="rotate({random.randint(-8, 8)} {x} {y})"/>'
                f'<circle cx="{x}" cy="{y - 44}" r="9" fill="#e53935" stroke="{K}" stroke-width="3"/></g>' for x, y in pins)
threads = "".join(f'<path d="M{a[0]} {a[1] - 44} L{b[0]} {b[1] - 44}" stroke="#e53935" stroke-width="4"/>' for a, b in zip(pins, pins[1:] + pins[:2]))
detective = HEAD + f'''    <rect width="1080" height="1920" fill="#4a5a6a"/>
    <rect x="40" y="220" width="1000" height="560" fill="#b08d57" stroke="{K}" stroke-width="10"/>
    {threads}{board}
    <g stroke="#2f3a45" stroke-width="10">{"".join(f'<path d="M60 {y} H1020" opacity=".0"/>' for y in range(0))}</g>
    <rect x="740" y="860" width="300" height="300" fill="#cfe3f2" stroke="{K}" stroke-width="8"/>
    <g stroke="#f4f6f8" stroke-width="16">{"".join(f'<path d="M744 {y} H1036"/>' for y in range(880, 1160, 28))}</g>
    <rect y="1200" width="1080" height="720" fill="#3a2a1f"/>
    <rect x="40" y="1240" width="1000" height="80" fill="#6b4423" stroke="{K}" stroke-width="8"/>
    <g><path d="M200 1240 L250 1120 L320 1100" stroke="#2a2d34" stroke-width="12" fill="none"/><path d="M290 1080 L380 1110 L340 1150 Z" fill="#2e7d32" stroke="{K}" stroke-width="5"/>
      <ellipse cx="200" cy="1240" rx="60" ry="14" fill="#2a2d34"/></g>
    <g><rect x="560" y="1190" width="220" height="50" fill="#f4f1ea" stroke="{K}" stroke-width="4" transform="rotate(-4 670 1215)"/>
      <rect x="600" y="1170" width="220" height="50" fill="#e9e2d0" stroke="{K}" stroke-width="4" transform="rotate(3 710 1195)"/></g>
  </svg>
'''

for n, s in [("cross", cross), ("parkade", parkade), ("numgarage", numgarage), ("expert", expert), ("detective", detective)]:
    open(f"bg_{n}.svg.part", "w").write(s)
print("ok")
