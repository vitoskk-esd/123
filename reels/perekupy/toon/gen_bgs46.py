# python3 gen_bgs46.py → фоны для «Толян: со ста тысяч», часть 13 «Виталик звонит» (ep54, киношный формат):
# bg_stolovaya (институтская столовая днём: раздача с подносами, меню на доске, столы, окна, плакат «ПРИЯТНОГО АППЕТИТА»),
# bg_pustyr (пустырь за гаражами вечером: сухая трава, бетонные блоки, ржавый забор, лужа, фонарь),
# bg_reka (деревня у реки утром: деревянный дом, мостки, удочки, лодка, туман над водой),
# bg_rynokavto (авторынок выходного дня: ряды машин-силуэтов, флажки, будка «КАССА», вывеска «АВТОРЫНОК ЮЖНЫЙ»)
import random
K = "#000"
HEAD = '  <svg id="bg" width="1080" height="1920" viewBox="0 0 1080 1920" style="position:absolute;left:0;top:0">\n'
F = 'font-family="Unbounded" font-weight="900"'
M = 'font-family="JetBrains Mono" font-weight="800"'
R = random.randint

random.seed(101)
stolovaya = HEAD + f'''    <rect width="1080" height="1920" fill="#e8dcc0"/>
    <rect y="0" width="1080" height="160" fill="#f4ecd8"/>{"".join(f'<rect x="{x}" y="60" width="160" height="26" rx="13" fill="#fff6d8" opacity=".9"/>' for x in (120, 460, 800))}
    <!-- окна -->
    {"".join(f'<rect x="{x}" y="220" width="250" height="380" fill="#bfe3f5" stroke="#f4f6f8" stroke-width="16"/><path d="M{x + 125} 220 V600 M{x} 410 H{x + 250}" stroke="#f4f6f8" stroke-width="10"/>' for x in (60, 415, 770))}
    <!-- плакат и меню -->
    <rect x="300" y="650" width="480" height="90" rx="12" fill="#c0392b" stroke="{K}" stroke-width="5"/><text x="540" y="708" text-anchor="middle" {F} font-size="34" fill="#fff">ПРИЯТНОГО АППЕТИТА</text>
    <rect x="60" y="660" width="200" height="300" fill="#2b3a2b" stroke="#8a5a33" stroke-width="12"/>{"".join(f'<text x="80" y="{710 + k * 56}" {M} font-size="24" fill="#f4f6f8">{t}</text>' for k, t in enumerate(("МЕНЮ", "борщ   90", "котлета 70", "компот 25")))}
    <!-- раздача -->
    <rect x="300" y="820" width="780" height="300" fill="#c9ced6" stroke="{K}" stroke-width="6"/><rect x="300" y="790" width="780" height="40" fill="#8a929b" stroke="{K}" stroke-width="5"/>
    {"".join(f'<ellipse cx="{x}" cy="800" rx="46" ry="14" fill="#f4f6f8" stroke="{K}" stroke-width="4"/><path d="M{x - 30} 790 q30 -40 60 0" fill="#e8a33a" stroke="{K}" stroke-width="3"/>' for x in (400, 540, 680, 820, 960))}
    <!-- пол-плитка и столы -->
    <rect y="1120" width="1080" height="800" fill="#cfc4a8"/><path d="M0 1120 H1080" stroke="{K}" stroke-width="7"/>
    {"".join(f'<path d="M0 {y} H1080" stroke="#b9ad90" stroke-width="3"/>' for y in range(1200, 1920, 90))}
    {"".join(f'<rect x="{x}" y="1240" width="220" height="24" rx="6" fill="#e8e4d8" stroke="{K}" stroke-width="5"/><path d="M{x + 20} 1264 v80 M{x + 200} 1264 v80" stroke="#5b6670" stroke-width="10"/>' for x in (20, 840))}
  </svg>
'''

random.seed(102)
pustyr = HEAD + f'''    <defs><linearGradient id="pu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5a5a8a"/><stop offset=".6" stop-color="#e8a07a"/><stop offset="1" stop-color="#ffd8a8"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#pu)"/>
    <!-- дальний ряд гаражей и ржавый забор -->
    <rect x="-20" y="760" width="1120" height="200" fill="#6a5a6a" stroke="{K}" stroke-width="5"/>{"".join(f'<rect x="{x}" y="800" width="120" height="160" fill="{c}" stroke="{K}" stroke-width="4"/>' for x, c in ((20, "#7a4a3a"), (180, "#4a5a6a"), (340, "#6a6a3a"), (500, "#5a3a4a"), (660, "#3a5a4a"), (820, "#7a5a3a"), (980, "#4a4a6a")))}
    {"".join(f'<rect x="{x}" y="900" width="70" height="150" fill="#9a5a3a" stroke="{K}" stroke-width="4" transform="rotate({R(-4, 4)} {x} 1050)"/>' for x in range(-20, 1080, 75))}
    <!-- фонарь -->
    <path d="M900 1300 V640" stroke="#3a3f46" stroke-width="16"/><path d="M900 650 h-70" stroke="#3a3f46" stroke-width="12"/><circle cx="830" cy="665" r="20" fill="#fff6c8"/>
    <!-- земля, трава, лужа, бетонные блоки -->
    <rect y="1050" width="1080" height="870" fill="#8a7a5a"/><path d="M0 1050 H1080" stroke="{K}" stroke-width="6"/>
    {"".join(f'<path d="M{x} {y} l-8 -40 M{x} {y} l6 -48 M{x} {y} l16 -34" stroke="#b8a060" stroke-width="5" fill="none"/>' for x, y in ((R(0, 1080), R(1080, 1880)) for _ in range(40)))}
    <ellipse cx="760" cy="1720" rx="200" ry="40" fill="#8ab0d0" stroke="#5a6a7a" stroke-width="5" opacity=".9"/>
    {"".join(f'<rect x="{x}" y="{y}" width="200" height="110" fill="#a8a29a" stroke="{K}" stroke-width="6"/><path d="M{x} {y + 30} h200" stroke="#8a847c" stroke-width="5"/>' for x, y in ((-40, 1160), (900, 1180)))}
  </svg>
'''

random.seed(103)
reka = HEAD + f'''    <defs><linearGradient id="rk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a8d8f0"/><stop offset="1" stop-color="#f4f0e0"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#rk)"/>
    <!-- дальний лес и река -->
    {"".join(f'<path d="M{x} 900 l40 -{R(120, 200)} l40 {R(120, 200)} z" fill="#4a7a5a"/>' for x in range(-40, 1080, 70))}
    <rect y="900" width="1080" height="260" fill="#7ab0d0"/>{"".join(f'<rect x="{R(0, 1000)}" y="{R(920, 1140)}" width="{R(60, 160)}" height="6" rx="3" fill="#e8f4ff" opacity=".7"/>' for _ in range(16))}
    <ellipse cx="540" cy="930" rx="700" ry="40" fill="#fff" opacity=".35"/>
    <!-- лодка и мостки -->
    <path d="M120 1060 h220 l-30 40 h-160 z" fill="#8a5a33" stroke="{K}" stroke-width="5"/>
    <rect x="620" y="1100" width="460" height="30" fill="#a8845a" stroke="{K}" stroke-width="5"/>{"".join(f'<path d="M{x} 1130 v60" stroke="#6b4a2b" stroke-width="12"/>' for x in (660, 820, 980))}
    {"".join(f'<path d="M{x} 1100 L{x + 120} 860" stroke="#3a2a1a" stroke-width="5"/><path d="M{x + 120} 860 q20 120 -10 230" stroke="#c9ced6" stroke-width="2" fill="none"/>' for x in (700, 860))}
    <!-- деревянный дом -->
    <rect x="-40" y="560" width="380" height="440" fill="#a8743a" stroke="{K}" stroke-width="6"/>{"".join(f'<path d="M-40 {y} h380" stroke="#8a5a2a" stroke-width="5"/>' for y in range(600, 1000, 40))}
    <path d="M-80 580 L150 420 L380 580 Z" fill="#6a3a2a" stroke="{K}" stroke-width="6"/><rect x="120" y="680" width="120" height="120" fill="#bfe3f5" stroke="#f4f6f8" stroke-width="12"/>
    <!-- трава у берега -->
    <rect y="1160" width="1080" height="760" fill="#7aa85a"/><path d="M0 1160 H1080" stroke="#4a7a3a" stroke-width="8"/>
    {"".join(f'<path d="M{R(0, 1080)} {R(1200, 1880)} l-6 -30 m6 30 l8 -34" stroke="#4a7a3a" stroke-width="5" fill="none"/>' for _ in range(50))}
    <path d="M0 1500 Q540 1460 1080 1520" stroke="#b89a6a" stroke-width="80" fill="none" opacity=".7"/>
  </svg>
'''

random.seed(104)
rynokavto = HEAD + f'''    <defs><linearGradient id="ra" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7fc0ee"/><stop offset="1" stop-color="#eaf6fc"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#ra)"/>
    <!-- вывеска на арке -->
    <path d="M60 900 V420 M1020 900 V420" stroke="#3a3f46" stroke-width="22"/><rect x="40" y="380" width="1000" height="140" fill="#c0392b" stroke="{K}" stroke-width="6"/>
    <text x="540" y="472" text-anchor="middle" {F} font-size="62" fill="#fff">АВТОРЫНОК «ЮЖНЫЙ»</text>
    <!-- флажки -->
    <path d="M60 560 Q540 660 1020 560" stroke="#151515" stroke-width="3" fill="none"/>{"".join(f'<path d="M{x} {560 + 100 * (1 - ((x - 540) / 480) ** 2)} l18 46 l18 -46 z" fill="{("#ffd23f", "#2f6db5", "#c0392b", "#4f9d48")[k % 4]}"/>' for k, x in enumerate(range(100, 1000, 70)))}
    <!-- ряды машин-силуэтов вдали -->
    {"".join(f'<path d="M{x} 960 q10 -40 50 -44 h70 q30 0 50 44 z" fill="{c}" stroke="{K}" stroke-width="4"/><circle cx="{x + 30}" cy="962" r="12" fill="#151515"/><circle cx="{x + 140}" cy="962" r="12" fill="#151515"/>' for x, c in ((0, "#c9ced6"), (210, "#2f6db5"), (420, "#e8e4d8"), (630, "#151515"), (840, "#c0392b")))}
    <!-- будка кассы -->
    <rect x="860" y="980" width="200" height="220" fill="#f4f6f8" stroke="{K}" stroke-width="6"/><rect x="890" y="1020" width="140" height="80" fill="#bfe3f5" stroke="{K}" stroke-width="4"/>
    <rect x="880" y="990" width="160" height="26" fill="#ffd23f"/><text x="960" y="1010" text-anchor="middle" {F} font-size="20" fill="#151515">КАССА</text>
    <!-- асфальт с разметкой мест -->
    <rect y="1200" width="1080" height="720" fill="#7a7e86"/><path d="M0 1200 H1080" stroke="{K}" stroke-width="7"/>
    {"".join(f'<path d="M{x} 1240 L{x - 80} 1900" stroke="#f4f6f8" stroke-width="10" opacity=".8"/>' for x in (120, 560, 1000))}
    {"".join(f'<ellipse cx="{R(80, 1000)}" cy="{R(1300, 1880)}" rx="{R(60, 160)}" ry="{R(8, 16)}" fill="#6a6e76" opacity=".7"/>' for _ in range(7))}
  </svg>
'''

for n, s in (("stolovaya", stolovaya), ("pustyr", pustyr), ("reka", reka), ("rynokavto", rynokavto)):
    open(f"bg_{n}.svg.part", "w").write(s)
print("ok")
