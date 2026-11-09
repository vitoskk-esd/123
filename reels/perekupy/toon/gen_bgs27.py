# python3 gen_bgs27.py → новые фоны для «Толян: со ста тысяч», часть 6 «Первая машина за полмиллиона» (каждая серия — новые фоны):
# bg_balkon (балкон панельки ночью: перила, банки, сушилка с бельём, огни города), bg_stomat (у стоматологии: белый фасад с зубом-вывеской, крыльцо, клумба),
# bg_mangal (шашлычная у трассы: мангал с дымом, навес, пластиковые столы, вывеска «ШАШЛЫК»), bg_prichal (речной причал: деревянные мостки, лодки, фонарь, закат)
import random
K = "#000"
random.seed(41)
HEAD = '  <svg id="bg" width="1080" height="1920" viewBox="0 0 1080 1920" style="position:absolute;left:0;top:0">\n'
F = 'font-family="Unbounded" font-weight="900"'
M = 'font-family="JetBrains Mono" font-weight="800"'

balkon = HEAD + f'''    <defs><linearGradient id="bkSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0d1530"/><stop offset="1" stop-color="#2b2a55"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#bkSky)"/>
    {"".join(f'<circle cx="{random.randint(0, 1080)}" cy="{random.randint(0, 380)}" r="3" fill="#fff" opacity=".75"/>' for _ in range(36))}
    <!-- огни города -->
    {"".join(f'<g><rect x="{x}" y="{y}" width="{w}" height="{760 - y}" fill="#1b2142"/>' + "".join(f'<rect x="{x + 10 + i * 30}" y="{yy}" width="16" height="20" fill="#ffd27a" opacity="{random.choice([.2, .6, .9])}"/>' for i in range((w - 10) // 30) for yy in range(y + 16, 740, 40)) + '</g>' for x, y, w in [(0, 420, 200), (220, 360, 180), (420, 450, 160), (600, 330, 220), (840, 400, 240)])}
    <!-- стена дома, сушилка с бельём -->
    <rect x="0" y="0" width="80" height="1000" fill="#c9b8a0" stroke="{K}" stroke-width="7"/>
    <path d="M80 300 H1000" stroke="#8a8f96" stroke-width="5"/>
    {"".join(f'<path d="M{x} 300 v{h} h{w} v-{h}" fill="{c}" stroke="{K}" stroke-width="4"/>' for x, w, h, c in [(220, 90, 110, "#ff6fae"), (360, 70, 150, "#7fb2e5"), (480, 110, 90, "#fff"), (650, 80, 130, "#ffd23f")])}
    <!-- перила и банки -->
    <rect x="80" y="760" width="1000" height="240" fill="#5b6f86" stroke="{K}" stroke-width="8"/>
    <g stroke="#4a5c70" stroke-width="10">{"".join(f'<path d="M{x} 770 V990"/>' for x in range(120, 1080, 60))}</g>
    <rect x="70" y="740" width="1010" height="30" fill="#8a8f96" stroke="{K}" stroke-width="6"/>
    {"".join(f'<g><rect x="{x}" y="660" width="60" height="80" rx="10" fill="{c}" opacity=".85" stroke="{K}" stroke-width="5"/><rect x="{x + 6}" y="648" width="48" height="16" fill="#c9a20c" stroke="{K}" stroke-width="4"/></g>' for x, c in [(860, "#c0392b"), (940, "#4cd964")])}
    <!-- пол балкона -->
    <rect y="1000" width="1080" height="920" fill="#6b5a4a"/><path d="M0 1000 H1080" stroke="{K}" stroke-width="7"/>
    <g stroke="#5c4c3e" stroke-width="5">{"".join(f'<path d="M0 {y} H1080"/>' for y in range(1080, 1920, 80))}</g>
  </svg>
'''

stomat = HEAD + f'''    <rect width="1080" height="1920" fill="#d6ecf7"/>
    <g><rect x="60" y="260" width="960" height="740" fill="#f8fbfd" stroke="{K}" stroke-width="8"/><rect x="60" y="260" width="960" height="140" fill="#2ec4b6" stroke="{K}" stroke-width="8"/>
      <text x="600" y="355" text-anchor="middle" {F} font-size="58" fill="#fff">СТОМАТОЛОГИЯ</text>
      <path d="M150 300 q30 -20 60 0 q30 -20 60 0 q0 50 -15 90 q-10 20 -20 -10 q-10 -20 -25 -20 q-15 0 -25 20 q-10 30 -20 10 q-15 -40 -15 -90 z" fill="#fff" stroke="{K}" stroke-width="6" transform="translate(-30 0)"/>
      {"".join(f'<rect x="{x}" y="460" width="220" height="280" fill="#bfe0f5" stroke="{K}" stroke-width="7"/>' for x in (110, 750))}
      <rect x="440" y="560" width="200" height="440" fill="#9fc3e0" stroke="{K}" stroke-width="8"/><path d="M540 560 v440" stroke="{K}" stroke-width="5"/>
      <rect x="400" y="500" width="280" height="50" rx="8" fill="#ffd23f" stroke="{K}" stroke-width="5"/><text x="540" y="535" text-anchor="middle" {M} font-size="24" fill="#151515">ПН–СБ 9:00–21:00</text></g>
    <!-- крыльцо и клумба -->
    <rect x="380" y="1000" width="320" height="40" fill="#c9ced4" stroke="{K}" stroke-width="5"/>
    <g>{"".join(f'<circle cx="{x}" cy="{980 - (i % 2) * 14}" r="16" fill="{c}" stroke="{K}" stroke-width="3"/>' for i, (x, c) in enumerate([(120, "#ff6fae"), (160, "#ffd23f"), (200, "#ff3b30"), (880, "#ff6fae"), (920, "#ffd23f"), (960, "#ff7a1a")]))}</g>
    <!-- парковка -->
    <rect y="1040" width="1080" height="880" fill="#6f7680"/><path d="M0 1040 H1080" stroke="{K}" stroke-width="7"/>
    <g stroke="#fff" stroke-width="9">{"".join(f'<path d="M{x} 1080 l-50 240"/>' for x in range(160, 1080, 250))}</g>
  </svg>
'''

mangal = HEAD + f'''    <defs><linearGradient id="mgSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffb37a"/><stop offset="1" stop-color="#ffe2b8"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#mgSky)"/>
    <!-- навес и вывеска -->
    <g><path d="M40 360 H1040 L980 460 H100 Z" fill="#c0392b" stroke="{K}" stroke-width="8"/><path d="M100 460 V1000 M980 460 V1000" stroke="#6b4a2a" stroke-width="22"/>
      <rect x="300" y="200" width="480" height="140" rx="16" fill="#151515" stroke="{K}" stroke-width="6"/><text x="540" y="295" text-anchor="middle" {F} font-size="66" fill="#ffd23f" style="filter:drop-shadow(0 0 10px #ff7a1a)">ШАШЛЫК</text></g>
    <!-- мангал с дымом -->
    <g><rect x="620" y="800" width="360" height="90" fill="#2b2f37" stroke="{K}" stroke-width="7"/><path d="M640 890 v110 M960 890 v110" stroke="{K}" stroke-width="10"/>
      {"".join(f'<path d="M{x} 790 h120" stroke="#9aa3ad" stroke-width="6"/><g>{"".join(f"<rect x=\"{x + 14 + k * 26}\" y=\"778\" width=\"20\" height=\"20\" rx=\"5\" fill=\"#a0522d\" stroke=\"{K}\" stroke-width=\"3\"/>" for k in range(4))}</g>' for x in (640, 820))}
      <rect x="630" y="810" width="340" height="20" fill="#ff7a1a" opacity=".7"/>
      {"".join(f'<circle cx="{700 + i * 50}" cy="{700 - i * 60}" r="{40 + i * 12}" fill="#e8e3dc" opacity="{.75 - i * .12}"/>' for i in range(5))}</g>
    <!-- пластиковые столы -->
    {"".join(f'<g><ellipse cx="{x}" cy="900" rx="110" ry="24" fill="#fff" stroke="{K}" stroke-width="6"/><path d="M{x} 924 v76" stroke="{K}" stroke-width="10"/><rect x="{x - 150}" y="900" width="50" height="100" fill="#fff" stroke="{K}" stroke-width="5"/></g>' for x in (260,))}
    <!-- обочина трассы -->
    <rect y="1000" width="1080" height="920" fill="#a08a6a"/><path d="M0 1000 H1080" stroke="{K}" stroke-width="7"/>
    <rect y="1500" width="1080" height="420" fill="#4d535b"/><path d="M0 1500 H1080" stroke="{K}" stroke-width="6"/>
    <g stroke="#e8ecf0" stroke-width="10" stroke-dasharray="80 60"><path d="M0 1720 H1080"/></g>
  </svg>
'''

prichal = HEAD + f'''    <defs><linearGradient id="prSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff9a6a"/><stop offset=".55" stop-color="#ffd2a1"/><stop offset="1" stop-color="#bfe0f5"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#prSky)"/><circle cx="760" cy="560" r="110" fill="#ffe07a" opacity=".9"/>
    <!-- дальний берег -->
    <path d="M0 640 q200 -50 400 -10 t400 -20 t280 10 V700 H0 Z" fill="#6f8f5a" stroke="{K}" stroke-width="6"/>
    <!-- река с бликами -->
    <rect y="700" width="1080" height="300" fill="#5fa8d3"/>
    {"".join(f'<path d="M{x} {y} h{w}" stroke="#ffe7b0" stroke-width="6" opacity=".8"/>' for x, y, w in [(640, 740, 220), (680, 790, 160), (600, 850, 260), (700, 920, 140)])}
    <!-- лодки -->
    {"".join(f'<g><path d="M{x} {y} h160 l-30 40 h-100 z" fill="{c}" stroke="{K}" stroke-width="6"/><path d="M{x + 80} {y} v-90 l50 70 z" fill="#fff" stroke="{K}" stroke-width="5"/></g>' for x, y, c in [(120, 820, "#c0392b"), (420, 870, "#2e86de")])}
    <!-- мостки и фонарь -->
    <path d="M600 1000 L1080 860 L1080 1000 Z" fill="#8a5a33" stroke="{K}" stroke-width="7"/>
    {"".join(f'<path d="M{x} {1000 - (x - 600) * 140 // 480} v90" stroke="#6b4a2a" stroke-width="14"/>' for x in range(640, 1080, 90))}
    <g><path d="M560 1000 V620" stroke="#2b2f37" stroke-width="14"/><rect x="536" y="580" width="48" height="56" rx="8" fill="#fff2a8" stroke="{K}" stroke-width="5"/></g>
    <!-- набережная -->
    <rect y="1000" width="1080" height="920" fill="#c9b8a0"/><path d="M0 1000 H1080" stroke="{K}" stroke-width="7"/>
    <g stroke="#b8a68c" stroke-width="5">{"".join(f'<path d="M0 {y} H1080"/>' for y in range(1100, 1920, 100))}{"".join(f'<path d="M{x} 1000 V1920"/>' for x in range(0, 1080, 135))}</g>
  </svg>
'''
for n, s in (("balkon", balkon), ("stomat", stomat), ("mangal", mangal), ("prichal", prichal)): open(f"bg_{n}.svg.part", "w").write(s)
print("ok")
