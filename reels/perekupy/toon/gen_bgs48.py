# python3 gen_bgs48.py → фоны для «Толян: со ста тысяч», часть 15 «Миллион» (ep56, финал, киношный формат):
# bg_estakada (ночная эстакада: бетонные опоры, натриевые фонари, разметка, огни города внизу),
# bg_dachakoop (дачный кооператив днём: штакетник, теплица, яблоня, сарай, гравийная дорога, ворота гаража),
# bg_zags (ЗАГС в солнечный день: фасад с колоннами, кольца над входом, ступени, клумбы, голуби),
# bg_jdmgarazh (гараж японщика ночью: неон «1JZ», стопка колёс, плакаты, верстак, поднятые ворота)
import random
K = "#000"
HEAD = '  <svg id="bg" width="1080" height="1920" viewBox="0 0 1080 1920" style="position:absolute;left:0;top:0">\n'
F = 'font-family="Unbounded" font-weight="900"'
M = 'font-family="JetBrains Mono" font-weight="800"'
R = random.randint

random.seed(121)
estakada = HEAD + f'''    <defs><linearGradient id="es" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#090c22"/><stop offset=".55" stop-color="#1c1f48"/><stop offset="1" stop-color="#3a2a52"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#es)"/>
    {"".join(f'<circle cx="{R(0, 1080)}" cy="{R(0, 520)}" r="{R(1, 3)}" fill="#fff" opacity="{R(3, 8) / 10}"/>' for _ in range(50))}
    <!-- город вдали -->
    {"".join(f'<rect x="{x}" y="{y}" width="{w}" height="{900 - y}" fill="#141838"/>' + "".join(f'<rect x="{x + 6 + i * 18}" y="{y + 10 + j * 26}" width="8" height="12" fill="#ffc46a" opacity="{R(3, 10) / 10}"/>' for i in range(w // 18) for j in range((880 - y) // 26) if R(0, 2) == 0) for x, y, w in ((0, 620, 140), (150, 560, 100), (260, 660, 170), (450, 590, 120), (590, 640, 150), (760, 540, 130), (900, 610, 180)))}
    <!-- опоры эстакады -->
    {"".join(f'<rect x="{x}" y="900" width="70" height="420" fill="#3a3d4a" stroke="{K}" stroke-width="5"/><rect x="{x - 14}" y="890" width="98" height="30" fill="#4a4e5c" stroke="{K}" stroke-width="5"/>' for x in (90, 480, 880))}
    <!-- полотно и отбойник -->
    <rect y="1120" width="1080" height="40" fill="#5b6070" stroke="{K}" stroke-width="6"/>{"".join(f'<rect x="{x}" y="1084" width="10" height="40" fill="#8a929b"/>' for x in range(20, 1080, 60))}
    <path d="M0 1086 H1080" stroke="#c9ced6" stroke-width="10"/>
    <rect y="1160" width="1080" height="760" fill="#2b2e3a"/>
    {"".join(f'<path d="M{x} 1500 h120" stroke="#f4f6f8" stroke-width="12" opacity=".75"/>' for x in range(-40, 1080, 260))}
    <path d="M0 1240 H1080 M0 1860 H1080" stroke="#ffd23f" stroke-width="8" opacity=".6"/>
    <!-- натриевые фонари -->
    {"".join(f'<path d="M{x} 1100 V700 q0 -40 50 -40" stroke="#2b2f37" stroke-width="12" fill="none"/><rect x="{x + 40}" y="652" width="60" height="18" rx="6" fill="#ffb84a"/>' for x in (200, 760))}
    {"".join(f'<ellipse cx="{R(80, 1000)}" cy="{R(1260, 1880)}" rx="{R(80, 180)}" ry="{R(8, 16)}" fill="#ffb84a" opacity=".12"/>' for _ in range(8))}
  </svg>
'''

random.seed(122)
dachakoop = HEAD + f'''    <defs><linearGradient id="dk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7cc4ee"/><stop offset="1" stop-color="#e6f4fb"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#dk)"/>
    {"".join(f'<ellipse cx="{x}" cy="{R(130, 260)}" rx="{R(70, 120)}" ry="{R(24, 40)}" fill="#fff" opacity=".9"/>' for x in (140, 560, 920))}
    <!-- лес вдали -->
    {"".join(f'<path d="M{x} 760 l40 -150 l40 150 z" fill="#2e6a40"/>' for x in range(-40, 1100, 60))}
    <!-- сарай и теплица -->
    <rect x="80" y="480" width="360" height="330" fill="#8a5a33" stroke="{K}" stroke-width="6"/><path d="M50 500 L260 380 L470 500 Z" fill="#5b6670" stroke="{K}" stroke-width="6"/>
    {"".join(f'<path d="M{x} 500 V810" stroke="#6b4423" stroke-width="5"/>' for x in range(110, 440, 40))}<rect x="210" y="600" width="100" height="210" fill="#5a3a20" stroke="{K}" stroke-width="5"/>
    <path d="M600 810 V560 q170 -120 340 0 V810 Z" fill="#cfeaf2" stroke="{K}" stroke-width="6" opacity=".9"/>{"".join(f'<path d="M{x} 810 V{560 - (0 if x in (600, 940) else 60)}" stroke="#8a929b" stroke-width="5"/>' for x in (600, 685, 770, 855, 940))}
    {"".join(f'<circle cx="{R(620, 920)}" cy="{R(640, 790)}" r="{R(10, 18)}" fill="#c0392b"/>' for _ in range(7))}
    <!-- яблоня -->
    <path d="M980 900 V620" stroke="#6b4423" stroke-width="26"/><circle cx="980" cy="560" r="130" fill="#3f8a4a" stroke="{K}" stroke-width="5"/>{"".join(f'<circle cx="{R(880, 1080)}" cy="{R(470, 650)}" r="11" fill="#e04a3a"/>' for _ in range(9))}
    <!-- штакетник -->
    <rect y="820" width="1080" height="12" fill="#c9a26a"/>{"".join(f'<path d="M{x} 960 V800 l12 -18 l12 18 V960 z" fill="#e8d0a0" stroke="{K}" stroke-width="4"/>' for x in range(0, 1080, 40))}
    <rect y="900" width="1080" height="12" fill="#c9a26a"/>
    <!-- гравийка -->
    <rect y="960" width="1080" height="960" fill="#b8ab90"/>{"".join(f'<circle cx="{R(0, 1080)}" cy="{R(980, 1910)}" r="{R(3, 7)}" fill="#8a7e66" opacity=".7"/>' for _ in range(160))}
    <path d="M0 1080 Q540 1040 1080 1080" stroke="#5a8a3a" stroke-width="40" fill="none" opacity=".5"/>
  </svg>
'''

random.seed(123)
zags = HEAD + f'''    <defs><linearGradient id="zg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fd0f5"/><stop offset="1" stop-color="#eef8fd"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#zg)"/>
    <!-- фасад -->
    <rect x="60" y="300" width="960" height="900" fill="#f1e6d2" stroke="{K}" stroke-width="6"/>
    <path d="M30 320 L540 150 L1050 320 Z" fill="#e2d2b6" stroke="{K}" stroke-width="6"/>
    <text x="540" y="290" text-anchor="middle" {F} font-size="58" fill="#8a5a33">ЗАГС</text>
    {"".join(f'<rect x="{x}" y="420" width="70" height="680" fill="#fbf6ec" stroke="{K}" stroke-width="5"/><rect x="{x - 12}" y="400" width="94" height="28" fill="#e2d2b6" stroke="{K}" stroke-width="4"/>' for x in (150, 330, 680, 860))}
    <!-- двери и кольца -->
    <rect x="440" y="700" width="200" height="400" fill="#6a3a2a" stroke="{K}" stroke-width="6"/><path d="M540 700 V1100" stroke="{K}" stroke-width="5"/>
    <circle cx="510" cy="560" r="50" fill="none" stroke="#e6b422" stroke-width="16"/><circle cx="570" cy="560" r="50" fill="none" stroke="#e6b422" stroke-width="16"/>
    <!-- ступени -->
    {"".join(f'<rect x="{300 - k * 40}" y="{1100 + k * 30}" width="{480 + k * 80}" height="30" fill="#d9d2c4" stroke="{K}" stroke-width="4"/>' for k in range(4))}
    <!-- клумбы -->
    {"".join(f'<rect x="{x}" y="1140" width="200" height="70" fill="#7a5a3a" stroke="{K}" stroke-width="5"/>' + "".join(f'<circle cx="{x + 20 + i * 32}" cy="{1132}" r="16" fill="{c}"/>' for i, c in enumerate(("#ff6fae", "#ffd23f", "#ff6fae", "#fff", "#ff6fae", "#ffd23f"))) for x in (40, 840))}
    <!-- площадь -->
    <rect y="1220" width="1080" height="700" fill="#cfc8b8"/>{"".join(f'<path d="M0 {y} H1080" stroke="#b9b1a0" stroke-width="3"/>' for y in range(1280, 1920, 80))}
    {"".join(f'<path d="M{x} {y} q14 -16 28 0 q-6 10 -14 8 z" fill="#8a929b" stroke="{K}" stroke-width="3"/>' for x, y in ((180, 1700), (240, 1740), (880, 1680)))}
  </svg>
'''

random.seed(124)
jdmgarazh = HEAD + f'''    <rect width="1080" height="1920" fill="#14161e"/>
    <rect y="0" width="1080" height="1260" fill="#1d2030"/>
    {"".join(f'<path d="M0 {y} H1080" stroke="#242838" stroke-width="3"/>' for y in range(60, 1260, 60))}
    <!-- неон -->
    <rect x="300" y="170" width="480" height="170" rx="24" fill="none" stroke="#ff3bd0" stroke-width="10" opacity=".9"/>
    <text x="540" y="290" text-anchor="middle" {F} font-size="110" fill="#ff7ae6" stroke="#ff3bd0" stroke-width="3">1JZ</text>
    <!-- плакаты -->
    <rect x="60" y="300" width="200" height="280" fill="#c0392b" stroke="{K}" stroke-width="5"/><circle cx="160" cy="400" r="60" fill="#fbfaf3"/><circle cx="160" cy="400" r="40" fill="#c0392b"/>
    <text x="160" y="540" text-anchor="middle" {F} font-size="30" fill="#fbfaf3">DRIFT</text>
    <rect x="820" y="300" width="200" height="280" fill="#2f6db5" stroke="{K}" stroke-width="5"/><text x="920" y="420" text-anchor="middle" {F} font-size="36" fill="#ffd23f">TURBO</text>
    <text x="920" y="480" text-anchor="middle" {M} font-size="26" fill="#fbfaf3">2.5 L · 280</text>
    <!-- полки и верстак -->
    <rect x="60" y="820" width="380" height="24" fill="#5b6670" stroke="{K}" stroke-width="4"/>{"".join(f'<rect x="{x}" y="{R(740, 780)}" width="{R(30, 60)}" height="{R(40, 80)}" fill="{c}" stroke="{K}" stroke-width="3"/>' for x, c in ((80, "#ffd23f"), (160, "#c0392b"), (240, "#4cd964"), (330, "#ff7a1a")))}
    <rect x="620" y="900" width="420" height="40" fill="#8a929b" stroke="{K}" stroke-width="5"/><path d="M650 940 v320 M1010 940 v320" stroke="#5b6670" stroke-width="14"/>
    <!-- стопка колёс -->
    {"".join(f'<ellipse cx="190" cy="{1230 - k * 60}" rx="130" ry="40" fill="#151515" stroke="#3a3f46" stroke-width="6"/><ellipse cx="190" cy="{1230 - k * 60}" rx="70" ry="20" fill="#8a929b"/>' for k in range(4))}
    <!-- поднятые ворота -->
    <rect x="0" y="0" width="1080" height="70" fill="#3a3f46" stroke="{K}" stroke-width="5"/>{"".join(f'<path d="M0 {y} H1080" stroke="#2b2f37" stroke-width="3"/>' for y in (20, 40, 60))}
    <!-- пол с бликом неона -->
    <rect y="1260" width="1080" height="660" fill="#2b2e3a"/><path d="M0 1260 H1080" stroke="{K}" stroke-width="7"/>
    <ellipse cx="540" cy="1420" rx="420" ry="40" fill="#ff3bd0" opacity=".12"/>
    {"".join(f'<ellipse cx="{R(80, 1000)}" cy="{R(1340, 1880)}" rx="{R(60, 160)}" ry="{R(8, 16)}" fill="#3a3d4a" opacity=".8"/>' for _ in range(6))}
  </svg>
'''

for n, s in (("estakada", estakada), ("dachakoop", dachakoop), ("zags", zags), ("jdmgarazh", jdmgarazh)):
    open(f"bg_{n}.svg.part", "w").write(s)
print("ok")
