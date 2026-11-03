# python3 gen_bgs7.py → фоны девятого набора локаций (ep21 «Залог»):
# bg_impound (штрафстоянка ночью: забор с сеткой, прожектор, будка), bg_stairs (подъезд: дверь квартиры, глазок, почтовые ящики),
# bg_bank (офис банка: окошки, табло, логотип, кулер)
import random
K = "#000"
random.seed(21)
HEAD = '  <svg id="bg" width="1080" height="1920" viewBox="0 0 1080 1920" style="position:absolute;left:0;top:0">\n'

# ---------- штрафстоянка ночью
mesh = "".join(f'<path d="M{x} 640 L{x + 120} 1100 M{x + 120} 640 L{x} 1100" stroke="#8b93a3" stroke-width="3" opacity=".7"/>' for x in range(-60, 1080, 60))
impound = HEAD + f'''    <defs><linearGradient id="iSky2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#070a16"/><stop offset="1" stop-color="#1e2640"/></linearGradient>
      <radialGradient id="iSpot" cx=".5" cy="0" r="1"><stop offset="0" stop-color="#fff6d6" stop-opacity=".55"/><stop offset="1" stop-color="#fff6d6" stop-opacity="0"/></radialGradient></defs>
    <rect width="1080" height="1920" fill="url(#iSky2)"/>{"".join(f'<circle cx="{random.randint(0, 1080)}" cy="{random.randint(0, 560)}" r="{random.choice([1, 2, 3])}" fill="#fff"/>' for _ in range(30))}
    <!-- прожектор -->
    <path d="M880 1100 V380" stroke="#2a2f3a" stroke-width="16"/><rect x="820" y="350" width="120" height="50" rx="8" fill="#e8ecf0" stroke="{K}" stroke-width="6"/>
    <path d="M880 400 L380 1600 L1080 1600 L1080 900 Z" fill="url(#iSpot)"/>
    <!-- забор с сеткой и колючкой -->
    <g>{mesh}</g><path d="M0 640 H1080 M0 1100 H1080" stroke="#5c626b" stroke-width="12"/>
    <g stroke="#5c626b" stroke-width="14">{"".join(f'<path d="M{x} 600 V1100"/>' for x in range(40, 1080, 250))}</g>
    <path d="M0 610 {"".join(f'q15 -20 30 0 ' for _ in range(36))}" stroke="#9aa3ab" stroke-width="4" fill="none"/>
    <!-- табличка -->
    <g><rect x="80" y="700" width="420" height="120" rx="10" fill="#1d4fb8" stroke="#fff" stroke-width="8"/>
      <text x="290" y="752" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="34" fill="#fff">ШТРАФСТОЯНКА</text>
      <text x="290" y="796" text-anchor="middle" font-family="Onest" font-weight="700" font-size="24" fill="#cfe0ff">круглосуточно · хранение 24/7</text></g>
    <rect y="1100" width="1080" height="820" fill="#2b2f37"/><path d="M0 1100 H1080" stroke="{K}" stroke-width="6"/>
    <g fill="#14171c" opacity=".6"><ellipse cx="300" cy="1500" rx="220" ry="26"/><ellipse cx="820" cy="1760" rx="200" ry="24"/></g>
  </svg>
'''

# ---------- подъезд: дверь квартиры с глазком, коврик, почтовые ящики, лампочка
boxes = "".join(f'<rect x="{x}" y="{y}" width="70" height="60" fill="#5d7a8f" stroke="{K}" stroke-width="4"/><rect x="{x + 15}" y="{y + 12}" width="40" height="8" fill="#2b3a45"/>'
                for x in range(700, 1000, 76) for y in (700, 766, 832))
stairs = HEAD + f'''    <rect width="1080" height="1920" fill="#5f7d6e"/><rect y="0" width="1080" height="980" fill="#9fb8a6"/>
    <path d="M0 980 H1080" stroke="#4a6355" stroke-width="10"/>
    <path d="M540 0 V160" stroke="#111" stroke-width="5"/><circle cx="540" cy="180" r="24" fill="#fff3c4" stroke="{K}" stroke-width="5"/><circle cx="540" cy="180" r="260" fill="#fff3c4" opacity=".12"/>
    <!-- дверь -->
    <rect x="160" y="420" width="420" height="860" fill="#6b3a1f" stroke="{K}" stroke-width="10"/>
    <g stroke="#4a2814" stroke-width="5" fill="none">{"".join(f'<rect x="{200}" y="{y}" width="340" height="180" rx="8"/>' for y in (470, 690, 910))}</g>
    <circle cx="370" cy="560" r="16" fill="#c0c4ca" stroke="{K}" stroke-width="5"/><circle cx="370" cy="560" r="6" fill="#111"/>
    <rect x="510" y="830" width="40" height="70" rx="10" fill="#d4ac0d" stroke="{K}" stroke-width="5"/>
    <rect x="300" y="380" width="140" height="36" rx="6" fill="#e8ecf0" stroke="{K}" stroke-width="4"/>
    <text x="370" y="407" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="26">кв. 47</text>
    {boxes}
    <rect x="200" y="1280" width="340" height="40" rx="6" fill="#a0522d" stroke="{K}" stroke-width="5"/>
    <text x="370" y="1310" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="22" fill="#f4e7c3">WELCOME</text>
    <g fill="#4a6355">{"".join(f'<rect x="{620 + i * 70}" y="{1320 - i * 60}" width="460" height="60"/>' for i in range(6))}</g>
  </svg>
'''

# ---------- офис банка
bank = HEAD + f'''    <rect width="1080" height="1920" fill="#eef2f7"/>
    <rect y="0" width="1080" height="140" fill="#1d4fb8"/>
    <text x="540" y="95" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="58" fill="#fff">БАНК «НАДЁЖНЫЙ»</text>
    <g><rect x="300" y="220" width="480" height="150" rx="16" fill="#0d0f12" stroke="{K}" stroke-width="8"/>
      <text x="540" y="282" text-anchor="middle" font-family="JetBrains Mono" font-weight="800" font-size="40" fill="#4cd964">А-102 → 4</text>
      <text x="540" y="342" text-anchor="middle" font-family="JetBrains Mono" font-weight="800" font-size="40" fill="#ff3b30">А-103 → 2</text></g>
    {"".join(f'<g><rect x="{x}" y="560" width="230" height="420" fill="#fff" stroke="{K}" stroke-width="7"/><rect x="{x + 20}" y="590" width="190" height="200" fill="#cfe3f2" stroke="{K}" stroke-width="5"/>'
             f'<rect x="{x + 75}" y="510" width="80" height="44" rx="8" fill="#1d4fb8" stroke="{K}" stroke-width="5"/><text x="{x + 115}" y="543" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="28" fill="#fff">{i + 1}</text></g>' for i, x in enumerate((40, 300, 560, 820)))}
    <rect y="980" width="1080" height="940" fill="#c9d3df"/><path d="M0 980 H1080" stroke="{K}" stroke-width="7"/>
    <g stroke="#aab6c5" stroke-width="4">{"".join(f'<path d="M{x} 980 L{x * 1.5 - 270} 1920"/>' for x in range(0, 1081, 120))}</g>
    <g><rect x="60" y="1100" width="110" height="200" rx="10" fill="#fff" stroke="{K}" stroke-width="6"/><rect x="75" y="1040" width="80" height="70" rx="20" fill="#9fd3ff" stroke="{K}" stroke-width="5"/></g>
    <g><rect x="700" y="400" width="360" height="80" rx="10" fill="#ffd23f" stroke="{K}" stroke-width="5"/>
      <text x="880" y="452" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="26">АВТОКРЕДИТ 0%*</text></g>
  </svg>
'''

for n, s in [("impound", impound), ("stairs", stairs), ("bank", bank)]:
    open(f"bg_{n}.svg.part", "w").write(s)
print("ok")
