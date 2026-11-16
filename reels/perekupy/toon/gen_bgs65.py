# python3 gen_bgs65.py → фоны для ep73 «Кулинарное шоу: блюдо от шефа» (киношный формат, без мата):
# bg_kulinarshow (ТВ-кухня: плита, вытяжка, полки со специями, логотип «ВКУСНО И ДЁШЕВО», студийный свет, табло «В ЭФИРЕ»),
# bg_kulinarzal (студия общим планом: зрители-силуэты на трибуне, табло «АПЛОДИСМЕНТЫ», камеры, софиты),
# bg_testdraiv (улица для тест-драйва: дома, тротуар, припаркованные машины-силуэты, «лежачий полицейский», знак 20)
import random
K = "#000"
HEAD = '  <svg id="bg" width="1080" height="1920" viewBox="0 0 1080 1920" style="position:absolute;left:0;top:0">\n'
F = 'font-family="Unbounded" font-weight="900"'
R = random.randint

random.seed(291)
kuh = HEAD + f'''    <rect width="1080" height="1920" fill="#f4e6d0"/>
    <!-- плитка -->
    {"".join(f'<rect x="{x}" y="{y}" width="90" height="60" fill="{"#ffffff" if (x // 90 + y // 60) % 2 else "#e8f4f0"}" stroke="#d0c8b8" stroke-width="2"/>' for x in range(0, 1080, 90) for y in range(560, 1180, 60))}
    <!-- логотип -->
    <rect x="200" y="220" width="680" height="170" rx="30" fill="#ff7a1a" stroke="{K}" stroke-width="8"/><text x="540" y="292" text-anchor="middle" {F} font-size="52" fill="#fff">ВКУСНО</text><text x="540" y="360" text-anchor="middle" {F} font-size="44" fill="#ffd23f">И ДЁШЕВО</text>
    <!-- табло «В ЭФИРЕ» -->
    <rect x="820" y="80" width="220" height="80" rx="12" fill="#c0392b" stroke="{K}" stroke-width="6"/><circle cx="860" cy="120" r="14" fill="#fff"/><text x="955" y="132" text-anchor="middle" {F} font-size="28" fill="#fff">В ЭФИРЕ</text>
    <!-- вытяжка и полки -->
    <path d="M380 420 H700 L760 560 H320 Z" fill="#c8ccd0" stroke="{K}" stroke-width="7"/>
    <path d="M30 640 H260 M820 640 H1050" stroke="#8a5a33" stroke-width="16"/>
    {"".join(f'<rect x="{x}" y="570" width="44" height="70" rx="8" fill="{c}" stroke="{K}" stroke-width="4"/>' for x, c in ((50, "#c0392b"), (110, "#ffd23f"), (170, "#4cd964"), (840, "#2f6db5"), (900, "#ff7a1a"), (960, "#8a5a33")))}
    <!-- столешница и плита -->
    <rect y="1180" width="1080" height="140" fill="#3a3d46" stroke="{K}" stroke-width="7"/>
    {"".join(f'<ellipse cx="{x}" cy="1215" rx="70" ry="18" fill="#26282e" stroke="#ff3b30" stroke-width="5"/>' for x in (380, 700))}
    <rect y="1320" width="1080" height="600" fill="#e8dcc8"/><path d="M0 1320 H1080" stroke="{K}" stroke-width="7"/>
    {"".join(f'<rect x="{x}" y="1340" width="200" height="300" fill="#d8ccb8" stroke="#b8ac98" stroke-width="5"/><rect x="{x + 80}" y="1360" width="40" height="10" rx="5" fill="#8a8e94"/>' for x in range(20, 1080, 220))}
  </svg>
'''

random.seed(292)
zal = HEAD + f'''    <rect width="1080" height="1920" fill="#1b1d2a"/>
    <!-- софиты -->
    {"".join(f'<path d="M{x} 0 L{x - 160} 900 H{x + 160} Z" fill="#fff6d0" opacity=".08"/><circle cx="{x}" cy="40" r="34" fill="#fff6d0"/>' for x in (180, 540, 900))}
    <!-- табло «АПЛОДИСМЕНТЫ» -->
    <rect x="240" y="180" width="600" height="110" rx="14" fill="#3a1010" stroke="{K}" stroke-width="7"/><text x="540" y="254" text-anchor="middle" {F} font-size="44" fill="#5a2a2a">АПЛОДИСМЕНТЫ</text>
    <!-- трибуны со зрителями -->
    {"".join(f'<rect x="-20" y="{y}" width="1120" height="110" fill="{c}" stroke="{K}" stroke-width="5"/>' for y, c in ((420, "#2a2d3e"), (530, "#30344a"), (640, "#363a52")))}
    {"".join(f'<circle cx="{x + (r % 2) * 40}" cy="{400 + r * 110}" r="34" fill="{("#3a3d52", "#44485e", "#4e5268")[r]}"/><rect x="{x + (r % 2) * 40 - 40}" y="{430 + r * 110}" width="80" height="60" rx="30" fill="{("#3a3d52", "#44485e", "#4e5268")[r]}"/>' for r in range(3) for x in range(40, 1080, 110))}
    <!-- сцена и камеры -->
    <rect y="760" width="1080" height="1160" fill="#2b2f37"/><path d="M0 760 H1080" stroke="#ffd23f" stroke-width="10"/>
    {"".join(f'<g transform="translate({x} 1500)"><rect x="-60" y="-60" width="120" height="80" rx="10" fill="#151515"/><rect x="50" y="-40" width="40" height="40" fill="#151515"/><path d="M0 20 L-50 300 M0 20 L50 300 M0 20 V300" stroke="#151515" stroke-width="10"/></g>' for x in (80, 1000))}
  </svg>
'''

random.seed(293)
ulica = HEAD + f'''    <defs><linearGradient id="ut" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8ccdf2"/><stop offset="1" stop-color="#e6f4fb"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#ut)"/>
    {"".join(f'<rect x="{x}" y="{y}" width="{w}" height="{1180 - y}" fill="{c}" stroke="{K}" stroke-width="6"/>' + "".join(f'<rect x="{x + 22 + i * 62}" y="{y + 30 + j * 80}" width="38" height="50" fill="#bcd4e4" stroke="{K}" stroke-width="3"/>' for i in range((w - 30) // 62) for j in range((1120 - y) // 80)) for x, y, w, c in ((-20, 480, 360, "#e8c8a8"), (360, 560, 330, "#c8d8e8"), (710, 420, 400, "#d8e8c8")))}
    <!-- знак 20 -->
    <path d="M960 1280 V1000" stroke="#5b6670" stroke-width="12"/><circle cx="960" cy="950" r="62" fill="#fff" stroke="#c0392b" stroke-width="16"/><text x="960" y="972" text-anchor="middle" {F} font-size="54" fill="#151515">20</text>
    <!-- тротуар и дорога -->
    <rect y="1180" width="1080" height="110" fill="#c8c4bc"/><path d="M0 1180 H1080" stroke="{K}" stroke-width="6"/>
    <rect y="1290" width="1080" height="630" fill="#5f6066"/><path d="M0 1290 H1080" stroke="{K}" stroke-width="7"/>
    {"".join(f'<rect x="{x}" y="1600" width="120" height="16" fill="#f4f0e8"/>' for x in range(-40, 1080, 220))}
    <!-- лежачий полицейский -->
    <path d="M0 1760 Q540 1700 1080 1760 V1800 H0 Z" fill="#ffd23f" stroke="{K}" stroke-width="6"/>{"".join(f'<path d="M{x} 1730 l40 70" stroke="#151515" stroke-width="18"/>' for x in range(20, 1080, 110))}
  </svg>
'''

for n, s in (("kulinarshow", kuh), ("kulinarzal", zal), ("testdraiv", ulica)):
    open(f"bg_{n}.svg.part", "w").write(s)
print("ok")
