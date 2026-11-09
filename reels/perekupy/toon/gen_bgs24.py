# python3 gen_bgs24.py → новые фоны для «Толян: со ста тысяч», часть 4 «Партнёр или ловушка» (каждая серия — новые фоны):
# bg_bilyard (бильярдная вечером: зелёный стол, лампы-абажуры, стойка с киями, табло), bg_zhk (двор новостройки: высотки, детская площадка, парковка),
# bg_tramvai (салон трамвая: поручни, сиденья, окна с городом, табло остановок), bg_elektrik (мастерская автоэлектрика: стенд с приборкой, ноутбук, провода),
# bg_park (городской парк: пруд с уткой, ивы, дорожка, лавочка, фонарь), bg_fitnes (у фитнес-клуба: стеклянный вход, вывеска, велопарковка)
import random
K = "#000"
random.seed(38)
HEAD = '  <svg id="bg" width="1080" height="1920" viewBox="0 0 1080 1920" style="position:absolute;left:0;top:0">\n'
F = 'font-family="Unbounded" font-weight="900"'
M = 'font-family="JetBrains Mono" font-weight="800"'

lamps = "".join(f'<g><path d="M{x} 0 v260" stroke="{K}" stroke-width="5"/><path d="M{x - 110} 330 q110 -110 220 0 z" fill="#1f6b3a" stroke="{K}" stroke-width="6"/>'
                f'<ellipse cx="{x}" cy="338" rx="100" ry="14" fill="#fff2a8" style="filter:drop-shadow(0 0 22px #ffe066)"/></g>' for x in (300, 780))
bilyard = HEAD + f'''    <rect width="1080" height="1920" fill="#3a2b2b"/>
    <g stroke="#2e2222" stroke-width="6">{"".join(f'<path d="M{x} 0 V1000"/>' for x in range(0, 1080, 90))}</g>
    <!-- табло и стойка с киями -->
    <g><rect x="60" y="420" width="300" height="160" rx="12" fill="#151515" stroke="{K}" stroke-width="6"/><text x="210" y="480" text-anchor="middle" {M} font-size="30" fill="#ffd23f">СТОЛ 3</text>
      <text x="210" y="545" text-anchor="middle" {M} font-size="46" fill="#ff3b30">00:47</text></g>
    <g><rect x="820" y="400" width="200" height="560" fill="#6b4a2a" stroke="{K}" stroke-width="7"/>{"".join(f'<path d="M{850 + i * 26} 420 v520" stroke="#e8c48a" stroke-width="9"/>' for i in range(6))}</g>
    <text x="540" y="200" text-anchor="middle" {F} font-size="58" fill="#ff7a1a" style="filter:drop-shadow(0 0 12px #ff7a1a)">БИЛЬЯРД · БАР</text>
    {lamps}
    <!-- бильярдный стол -->
    <g><path d="M120 900 L960 900 L1040 1080 L40 1080 Z" fill="#2f8f4e" stroke="#5b3a1e" stroke-width="26" stroke-linejoin="round"/>
      {"".join(f'<circle cx="{x}" cy="{y}" r="18" fill="#151515"/>' for x, y in [(130, 905), (540, 900), (950, 905), (55, 1075), (1025, 1075)])}
      {"".join(f'<circle cx="{x}" cy="{y}" r="20" fill="{c}" stroke="{K}" stroke-width="4"/>' for x, y, c in [(600, 980, "#ffd23f"), (640, 958, "#c0392b"), (640, 1002, "#2e86de"), (680, 936, "#8e44ad"), (680, 980, "#151515"), (300, 990, "#fff")])}
      <rect x="140" y="1080" width="60" height="140" fill="#5b3a1e" stroke="{K}" stroke-width="6"/><rect x="880" y="1080" width="60" height="140" fill="#5b3a1e" stroke="{K}" stroke-width="6"/></g>
    <!-- пол -->
    <rect y="1080" width="1080" height="840" fill="#5a2f2f"/><path d="M0 1080 H1080" stroke="{K}" stroke-width="7"/>
    <g stroke="#4a2626" stroke-width="5">{"".join(f'<path d="M0 {y} H1080"/>' for y in range(1180, 1920, 110))}</g>
  </svg>
'''

towers = "".join(f'''<g><rect x="{x}" y="{y}" width="{w}" height="{1000 - y}" fill="{c}" stroke="{K}" stroke-width="7"/>
      {"".join(f'<rect x="{x + 20 + i * 50}" y="{yy}" width="30" height="40" fill="{random.choice(["#cfe3f2", "#9fc3e0", "#fff6c8"])}" stroke="{K}" stroke-width="3"/>' for i in range((w - 30) // 50) for yy in range(y + 30, 960, 70))}</g>''' for x, y, w, c in [(30, 160, 330, "#e8d9c4"), (390, 80, 300, "#f2b27a"), (720, 200, 330, "#c9d6e3")])
zhk = HEAD + f'''    <rect width="1080" height="1920" fill="#bfe0f5"/>
    {towers}
    <text x="540" y="60" text-anchor="middle" {F} font-size="40" fill="#1f4fb8">ЖК «СОЛНЕЧНЫЙ»</text>
    <!-- детская площадка -->
    <g><path d="M60 1000 v-150 h200 v150" fill="none" stroke="#c0392b" stroke-width="12"/><path d="M110 850 v100 M210 850 v100" stroke="#555" stroke-width="5"/><rect x="95" y="945" width="130" height="16" fill="#ffd23f" stroke="{K}" stroke-width="4"/>
      <path d="M820 1000 l60 -160 h80 v160" fill="#4cd964" stroke="{K}" stroke-width="6"/><path d="M820 1000 l60 -160" stroke="#ff7a1a" stroke-width="16"/></g>
    <!-- газон, асфальт парковки с разметкой -->
    <rect y="1000" width="1080" height="920" fill="#6f7680"/><rect y="1000" width="1080" height="60" fill="#7fbf5a"/><path d="M0 1000 H1080 M0 1060 H1080" stroke="{K}" stroke-width="6"/>
    <g stroke="#fff" stroke-width="9">{"".join(f'<path d="M{x} 1100 v240"/>' for x in range(120, 1080, 260))}</g>
  </svg>
'''

win = "".join(f'''<g><rect x="{x}" y="300" width="300" height="400" rx="20" fill="#9fc3e0" stroke="{K}" stroke-width="8"/>
      <rect x="{x + 30}" y="560" width="70" height="140" fill="#d9a066"/><rect x="{x + 120}" y="500" width="90" height="200" fill="#c9d6e3"/><rect x="{x + 220}" y="580" width="60" height="120" fill="#e8d9c4"/>
      <path d="M{x} 470 h300" stroke="{K}" stroke-width="6"/></g>''' for x in (40, 390, 740))
tramvai = HEAD + f'''    <rect width="1080" height="1920" fill="#e9e2c9"/>
    <rect y="0" width="1080" height="200" fill="#d8d0b4"/>
    <!-- табло остановок -->
    <g><rect x="300" y="60" width="480" height="100" rx="12" fill="#151515" stroke="{K}" stroke-width="6"/><text x="540" y="125" text-anchor="middle" {M} font-size="36" fill="#ff7a1a">→ ПЛ. ЛЕНИНА</text></g>
    {win}
    <!-- поручни -->
    <path d="M0 240 H1080" stroke="#c9a20c" stroke-width="16"/>{"".join(f'<path d="M{x} 240 V1000" stroke="#c9a20c" stroke-width="14"/>' for x in (360, 720))}
    {"".join(f'<g><path d="M{x} 248 v50" stroke="#555" stroke-width="5"/><path d="M{x - 18} 298 h36 v30 h-36 z" fill="none" stroke="#2e86de" stroke-width="7"/></g>' for x in range(90, 1080, 150))}
    <!-- сиденья -->
    {"".join(f'<g><rect x="{x}" y="760" width="220" height="150" rx="20" fill="#c0392b" stroke="{K}" stroke-width="7"/><rect x="{x}" y="900" width="220" height="40" rx="10" fill="#9b2c22" stroke="{K}" stroke-width="6"/></g>' for x in (60, 800))}
    <!-- пол — рифлёный -->
    <rect y="1000" width="1080" height="920" fill="#8a8f96"/><path d="M0 1000 H1080" stroke="{K}" stroke-width="8"/>
    <g stroke="#7a7f86" stroke-width="6">{"".join(f'<path d="M{x} 1000 l-40 920"/>' for x in range(40, 1200, 70))}</g>
  </svg>
'''

elektrik = HEAD + f'''    <rect width="1080" height="1920" fill="#2b3540"/>
    <g stroke="#26303a" stroke-width="6">{"".join(f'<path d="M0 {y} H1080"/>' for y in range(80, 1000, 90))}</g>
    <g transform="rotate(-2 540 170)"><rect x="240" y="110" width="600" height="110" rx="20" fill="#151515" stroke="#2ec4b6" stroke-width="8" style="filter:drop-shadow(0 0 14px #2ec4b6)"/>
      <text x="540" y="186" text-anchor="middle" {F} font-size="50" fill="#2ec4b6">⚡ АВТОЭЛЕКТРИК</text></g>
    <!-- стенд с приборной панелью -->
    <g><rect x="80" y="320" width="520" height="300" rx="20" fill="#151515" stroke="{K}" stroke-width="8"/>
      <circle cx="230" cy="470" r="100" fill="#0d0e12" stroke="#ff7a1a" stroke-width="10"/><circle cx="450" cy="470" r="100" fill="#0d0e12" stroke="#ff7a1a" stroke-width="10"/>
      <path d="M230 470 l60 -50 M450 470 l-30 -70" stroke="#ff3b30" stroke-width="8"/>
      <rect x="250" y="560" width="180" height="40" rx="6" fill="#2b3a2b"/><text x="340" y="590" text-anchor="middle" {M} font-size="28" fill="#4cd964">120 000</text></g>
    <!-- провода на стене -->
    {"".join(f'<path d="M{x} 300 q{random.randint(-60, 60)} 120 {random.randint(-30, 30)} 300" stroke="{c}" stroke-width="7" fill="none"/>' for x, c in [(660, "#ff3b30"), (700, "#ffd23f"), (740, "#2e86de"), (780, "#4cd964"), (820, "#ff7a1a")])}
    <!-- верстак с ноутбуком и мультиметром -->
    <g><rect x="40" y="820" width="1000" height="40" fill="#8a5a33" stroke="{K}" stroke-width="7"/><path d="M80 860 v140 M1000 860 v140" stroke="{K}" stroke-width="12"/>
      <rect x="640" y="660" width="300" height="170" rx="10" fill="#1d2330" stroke="{K}" stroke-width="7"/><rect x="660" y="680" width="260" height="130" fill="#2e86de" opacity=".85"/>
      <path d="M600 830 h380 l-30 -10 h-320 z" fill="#9aa3ad" stroke="{K}" stroke-width="5"/>
      <rect x="160" y="740" width="90" height="80" rx="10" fill="#ffd23f" stroke="{K}" stroke-width="5"/><rect x="175" y="755" width="60" height="26" fill="#cfe9c4"/></g>
    <!-- пол — бетон с пятнами -->
    <rect y="1000" width="1080" height="920" fill="#59606a"/><path d="M0 1000 H1080" stroke="{K}" stroke-width="8"/>
    {"".join(f'<ellipse cx="{random.randint(60, 1020)}" cy="{random.randint(1100, 1880)}" rx="{random.randint(50, 130)}" ry="{random.randint(10, 22)}" fill="#40464e" opacity=".7"/>' for _ in range(7))}
  </svg>
'''

park = HEAD + f'''    <defs><linearGradient id="pkSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a8d8ff"/><stop offset="1" stop-color="#e6f5ff"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#pkSky)"/>
    <!-- ивы -->
    {"".join(f'<g><path d="M{x} 1000 V560" stroke="#6b4a2a" stroke-width="34"/><ellipse cx="{x}" cy="520" rx="200" ry="180" fill="#6fae4f" stroke="{K}" stroke-width="7"/>{"".join(f"<path d=\"M{x - 160 + i * 40} 560 q10 140 0 260\" stroke=\"#4f8f3a\" stroke-width=\"8\" fill=\"none\"/>" for i in range(9))}</g>' for x in (170, 900))}
    <!-- пруд с уткой -->
    <g><ellipse cx="560" cy="930" rx="330" ry="70" fill="#5fa8d3" stroke="{K}" stroke-width="7"/><path d="M380 920 q30 -8 60 0 M620 950 q30 -8 60 0" stroke="#e6f5ff" stroke-width="5" fill="none"/>
      <g><ellipse cx="690" cy="905" rx="34" ry="20" fill="#fff" stroke="{K}" stroke-width="5"/><circle cx="716" cy="882" r="14" fill="#2f8f4e" stroke="{K}" stroke-width="4"/><path d="M728 884 l16 4 l-16 4 z" fill="#ff7a1a"/></g></g>
    <!-- лавочка и фонарь -->
    <g><rect x="380" y="800" width="200" height="20" fill="#8a5a33" stroke="{K}" stroke-width="5"/><rect x="380" y="770" width="200" height="18" fill="#8a5a33" stroke="{K}" stroke-width="5"/></g>
    <g><path d="M640 1000 V600" stroke="#2b2f37" stroke-width="12"/><rect x="618" y="560" width="44" height="50" rx="8" fill="#fff2a8" stroke="{K}" stroke-width="5"/></g>
    <!-- трава и дорожка -->
    <rect y="1000" width="1080" height="920" fill="#7fbf5a"/><path d="M0 1000 H1080" stroke="{K}" stroke-width="8"/>
    <path d="M380 1000 L700 1000 L1080 1700 L1080 1920 L0 1920 L0 1700 Z" fill="#d9c49a"/><path d="M380 1000 L0 1700 M700 1000 L1080 1700" stroke="#a88a60" stroke-width="6"/>
    {"".join(f'<circle cx="{random.randint(20, 1060)}" cy="{random.randint(1020, 1200)}" r="7" fill="{random.choice(["#fff", "#ffd23f", "#ff6fae"])}"/>' for _ in range(24))}
  </svg>
'''

fitnes = HEAD + f'''    <rect width="1080" height="1920" fill="#dfe8ef"/>
    <!-- фасад со стеклом -->
    <g><rect x="40" y="200" width="1000" height="800" fill="#2b2f37" stroke="{K}" stroke-width="8"/>
      {"".join(f'<rect x="{x}" y="380" width="200" height="420" fill="#5f8fb5" stroke="{K}" stroke-width="6"/>' for x in (80, 300, 780))}
      <rect x="540" y="560" width="200" height="440" fill="#9fc3e0" stroke="{K}" stroke-width="7"/><path d="M640 560 v440" stroke="{K}" stroke-width="5"/>
      {"".join(f'<g><rect x="{x}" y="640" width="12" height="80" fill="#151515"/><rect x="{x - 24}" y="660" width="60" height="40" rx="8" fill="#151515"/></g>' for x in (150, 380))}
      <rect x="80" y="230" width="920" height="120" fill="#ff3b30" stroke="{K}" stroke-width="7"/><text x="540" y="312" text-anchor="middle" {F} font-size="66" fill="#fff">ЖЕЛЕЗО · FITNESS</text>
      <rect x="790" y="420" width="180" height="70" rx="10" fill="#ffd23f" stroke="{K}" stroke-width="5"/><text x="880" y="466" text-anchor="middle" {M} font-size="28" fill="#151515">24/7</text></g>
    <!-- велопарковка -->
    <g>{"".join(f'<path d="M{x} 1000 v-70 q30 -30 60 0 v70" fill="none" stroke="#9aa3ad" stroke-width="10"/>' for x in (80, 180, 280))}</g>
    <!-- плитка тротуара, асфальт -->
    <rect y="1000" width="1080" height="920" fill="#5b6068"/><rect y="1000" width="1080" height="120" fill="#b9c2c9"/><path d="M0 1000 H1080 M0 1120 H1080" stroke="{K}" stroke-width="6"/>
    <g stroke="#a7b0b8" stroke-width="4">{"".join(f'<path d="M{x} 1000 v120"/>' for x in range(0, 1080, 90))}</g>
    <g stroke="#fff" stroke-width="9">{"".join(f'<path d="M{x} 1160 l-50 220"/>' for x in range(200, 1080, 240))}</g>
  </svg>
'''
for n, s in (("bilyard", bilyard), ("zhk", zhk), ("tramvai", tramvai), ("elektrik", elektrik), ("park", park), ("fitnes", fitnes)): open(f"bg_{n}.svg.part", "w").write(s)
print("ok")
