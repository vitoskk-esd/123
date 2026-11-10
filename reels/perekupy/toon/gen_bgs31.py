# python3 gen_bgs31.py → новые фоны для «Толян: со ста тысяч», часть 7 «Машина-двойник» (каждая серия — новые фоны):
# bg_kino (у кинотеатра ночью: неоновая вывеска «КИНО», афиши, касса, ступени, попкорн-ларёк), bg_shkola (школьный двор днём: трёхэтажная школа,
# окна, спортплощадка с турником и воротами, парковка учителей), bg_stroyka (стройка ночью: каркас дома, башенный кран, прожектор, бетонные блоки, забор)
import random
K = "#000"
random.seed(45)
HEAD = '  <svg id="bg" width="1080" height="1920" viewBox="0 0 1080 1920" style="position:absolute;left:0;top:0">\n'
F = 'font-family="Unbounded" font-weight="900"'
M = 'font-family="JetBrains Mono" font-weight="800"'

kino = HEAD + f'''    <defs><linearGradient id="knSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#120d2b"/><stop offset="1" stop-color="#2d1f4f"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#knSky)"/>
    <g><rect x="40" y="260" width="1000" height="740" fill="#3a2a55" stroke="{K}" stroke-width="8"/>
      <rect x="240" y="300" width="600" height="150" rx="20" fill="#151515" stroke="{K}" stroke-width="6"/>
      <text x="540" y="410" text-anchor="middle" {F} font-size="110" fill="#ff2da6" style="filter:drop-shadow(0 0 16px #ff2da6)">КИНО</text>
      {"".join(f'<circle cx="{x}" cy="{y}" r="9" fill="#ffd27a" style="filter:drop-shadow(0 0 6px #ffd27a)"/>' for x in range(250, 840, 40) for y in (290, 460))}
      {"".join(f'<g><rect x="{x}" y="520" width="200" height="290" fill="{c}" stroke="{K}" stroke-width="7"/><rect x="{x + 14}" y="534" width="172" height="200" fill="{c2}"/><rect x="{x + 30}" y="750" width="140" height="18" fill="#fff" opacity=".8"/><rect x="{x + 50}" y="778" width="100" height="12" fill="#fff" opacity=".6"/></g>' for x, c, c2 in [(90, "#c0392b", "#1d1d3a"), (790, "#1f4fb8", "#2b1d1d")])}
      <rect x="400" y="560" width="280" height="440" fill="#9fc3e0" stroke="{K}" stroke-width="8"/><path d="M540 560 v440" stroke="{K}" stroke-width="5"/>
      <rect x="420" y="500" width="240" height="44" rx="8" fill="#ffd23f" stroke="{K}" stroke-width="5"/><text x="540" y="532" text-anchor="middle" {M} font-size="26" fill="#151515">СЕАНС 22:40</text></g>
    <!-- ступени и попкорн -->
    {"".join(f'<rect x="{360 - i * 40}" y="{1000 + i * 30}" width="{360 + i * 80}" height="30" fill="#5b4a6e" stroke="{K}" stroke-width="4"/>' for i in range(2))}
    <g><rect x="860" y="860" width="160" height="140" fill="#fff" stroke="{K}" stroke-width="6"/>{"".join(f'<rect x="{860 + i * 32}" y="860" width="16" height="140" fill="#ff3b30"/>' for i in range(5))}
      {"".join(f'<circle cx="{880 + i * 22}" cy="{850 - (i % 2) * 10}" r="14" fill="#fff2c8" stroke="{K}" stroke-width="3"/>' for i in range(6))}</g>
    <!-- площадь -->
    <rect y="1060" width="1080" height="860" fill="#3d3550"/><path d="M0 1060 H1080" stroke="{K}" stroke-width="7"/>
    {"".join(f'<ellipse cx="{x}" cy="{y}" rx="{rx}" ry="12" fill="{c}" opacity=".35"/>' for x, y, rx, c in [(300, 1200, 160, "#ff2da6"), (760, 1300, 120, "#ffd27a"), (520, 1600, 200, "#ff2da6")])}
  </svg>
'''

shkola = HEAD + f'''    <rect width="1080" height="1920" fill="#bfe0f5"/><ellipse cx="840" cy="170" rx="140" ry="36" fill="#fff" opacity=".85"/>
    <g><rect x="40" y="260" width="1000" height="600" fill="#f2d16b" stroke="{K}" stroke-width="8"/><rect x="20" y="230" width="1040" height="40" fill="#c0392b" stroke="{K}" stroke-width="7"/>
      {"".join(f'<rect x="{x}" y="{y}" width="110" height="120" fill="#9fc3e0" stroke="{K}" stroke-width="5"/>' for x in range(80, 1000, 160) for y in (300, 470))}
      <rect x="430" y="640" width="220" height="220" fill="#8a5a33" stroke="{K}" stroke-width="7"/><path d="M540 640 v220" stroke="{K}" stroke-width="5"/>
      <rect x="360" y="580" width="360" height="50" rx="8" fill="#1f4fb8" stroke="{K}" stroke-width="5"/><text x="540" y="616" text-anchor="middle" {F} font-size="30" fill="#fff">ШКОЛА № 12</text></g>
    <!-- спортплощадка: турник и ворота -->
    <g><path d="M70 1000 V840 M220 1000 V840 M60 840 H230" stroke="#2b2f37" stroke-width="12"/>
      <path d="M780 1000 V860 H1020 V1000" fill="none" stroke="#fff" stroke-width="12"/><g stroke="#cfd8df" stroke-width="3">{"".join(f'<path d="M{x} 860 V1000"/>' for x in range(800, 1020, 22))}{"".join(f'<path d="M780 {y} H1020"/>' for y in range(880, 1000, 22))}</g></g>
    <!-- газон, асфальт парковки учителей -->
    <rect y="1000" width="1080" height="920" fill="#7d858e"/><rect y="1000" width="1080" height="60" fill="#7fbf5a"/><path d="M0 1000 H1080 M0 1060 H1080" stroke="{K}" stroke-width="6"/>
    <g stroke="#fff" stroke-width="9">{"".join(f'<path d="M{x} 1100 l-50 240"/>' for x in range(160, 1080, 250))}</g>
    <g><rect x="840" y="1440" width="200" height="60" rx="8" fill="#fff" stroke="{K}" stroke-width="5"/><text x="940" y="1480" text-anchor="middle" {F} font-size="22" fill="#151515">УЧИТЕЛЯ</text></g>
  </svg>
'''

stroyka = HEAD + f'''    <defs><linearGradient id="srSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b1022"/><stop offset="1" stop-color="#1d2540"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#srSky)"/>
    {"".join(f'<circle cx="{random.randint(0, 1080)}" cy="{random.randint(0, 400)}" r="3" fill="#fff" opacity=".7"/>' for _ in range(30))}
    <!-- каркас дома -->
    <g><rect x="80" y="300" width="560" height="700" fill="#3b4150" stroke="{K}" stroke-width="8"/>
      <g stroke="#2b303c" stroke-width="12">{"".join(f'<path d="M80 {y} H640"/>' for y in range(400, 1000, 120))}{"".join(f'<path d="M{x} 300 V1000"/>' for x in range(200, 640, 140))}</g>
      {"".join(f'<rect x="{x + 10}" y="{y + 14}" width="110" height="92" fill="#0b1022"/>' for x in range(80, 620, 140) for y in range(300, 900, 120))}</g>
    <!-- башенный кран -->
    <g><path d="M820 1000 V180" stroke="#ffd23f" stroke-width="22"/><path d="M560 200 H1060" stroke="#ffd23f" stroke-width="20"/>
      <g stroke="#ffd23f" stroke-width="5">{"".join(f'<path d="M{x} 190 l20 20 M{x + 20} 190 l-20 20"/>' for x in range(570, 1050, 40))}</g>
      <path d="M640 210 V420" stroke="#151515" stroke-width="5"/><rect x="610" y="420" width="60" height="40" fill="#8a8f96" stroke="{K}" stroke-width="4"/>
      <circle cx="820" cy="180" r="10" fill="#ff3b30" style="filter:drop-shadow(0 0 10px #ff3b30)"/></g>
    <!-- прожектор -->
    <g><path d="M980 1000 V640" stroke="#2b2f37" stroke-width="12"/><rect x="940" y="600" width="80" height="50" fill="#e8ecf0" stroke="{K}" stroke-width="5"/>
      <path d="M940 640 L560 1000 L760 1000 Z" fill="#fff6c8" opacity=".14"/></g>
    <!-- забор и бетонные блоки -->
    <rect x="0" y="880" width="1080" height="120" fill="#4f6b8a" opacity=".6"/><g stroke="#3b5470" stroke-width="8">{"".join(f'<path d="M{x} 880 V1000"/>' for x in range(30, 1080, 60))}</g>
    {"".join(f'<rect x="{x}" y="{y}" width="{w}" height="70" fill="#9aa3ad" stroke="{K}" stroke-width="6"/>' for x, y, w in [(60, 930, 200), (100, 860, 140), (700, 940, 180)])}
    <!-- грунт с колеями -->
    <rect y="1000" width="1080" height="920" fill="#4a4238"/><path d="M0 1000 H1080" stroke="{K}" stroke-width="7"/>
    <path d="M200 1920 L460 1000 M880 1920 L620 1000" stroke="#3a332b" stroke-width="40"/>
    {"".join(f'<ellipse cx="{random.randint(60, 1020)}" cy="{random.randint(1100, 1880)}" rx="{random.randint(50, 130)}" ry="{random.randint(10, 20)}" fill="#5c5245" opacity=".8"/>' for _ in range(8))}
  </svg>
'''
for n, s in (("kino", kino), ("shkola", shkola), ("stroyka", stroyka)): open(f"bg_{n}.svg.part", "w").write(s)
print("ok")
