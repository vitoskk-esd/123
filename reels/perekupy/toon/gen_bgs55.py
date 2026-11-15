# python3 gen_bgs55.py → фоны для ep63 «Викторина» (киношный формат):
# bg_kvizstudiya (студия телевикторины: тёмно-синий зал, лучи прожекторов, светодиодный пол кругами, большой экран-логотип «ВОПРОС НА МИЛЛИОН», стойки),
# bg_kvizzal (трибуны со зрителями-силуэтами, пульты голосования, табло «АПЛОДИСМЕНТЫ»),
# bg_kuhnyastasa (кухня Стаса утром: холодильник с магнитами, окно с двором, кофеварка, стол с ноутбуком и ключами)
import random
K = "#000"
HEAD = '  <svg id="bg" width="1080" height="1920" viewBox="0 0 1080 1920" style="position:absolute;left:0;top:0">\n'
F = 'font-family="Unbounded" font-weight="900"'
R = random.randint

random.seed(191)
studio = HEAD + f'''    <defs><radialGradient id="ks" cx=".5" cy=".35" r=".8"><stop offset="0" stop-color="#2a3a8a"/><stop offset="1" stop-color="#070a24"/></radialGradient>
      <radialGradient id="kf" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#5a7aff" stop-opacity=".7"/><stop offset="1" stop-color="#5a7aff" stop-opacity="0"/></radialGradient></defs>
    <rect width="1080" height="1920" fill="url(#ks)"/>
    {"".join(f'<path d="M{x} 0 L{x - 160} 1300 H{x + 160} Z" fill="#9fb4ff" opacity=".08"/>' for x in (120, 540, 960))}
    <!-- большой экран -->
    <rect x="190" y="220" width="700" height="400" rx="20" fill="#0b1040" stroke="#7a8cff" stroke-width="10"/>
    <circle cx="540" cy="420" r="150" fill="none" stroke="#ffd23f" stroke-width="12"/><circle cx="540" cy="420" r="120" fill="#141a5a"/>
    <text x="540" y="400" text-anchor="middle" {F} font-size="44" fill="#ffd23f">ВОПРОС</text><text x="540" y="456" text-anchor="middle" {F} font-size="38" fill="#fff">НА МИЛЛИОН</text>
    <!-- лестница огней по бокам -->
    {"".join(f'<rect x="{x}" y="{y}" width="60" height="24" rx="6" fill="{"#ffd23f" if (y // 60) % 3 == 0 else "#3a4aa0"}"/>' for x in (60, 960) for y in range(240, 1100, 60))}
    <!-- светодиодный пол -->
    <rect y="1200" width="1080" height="720" fill="#080b2a"/><path d="M0 1200 H1080" stroke="#7a8cff" stroke-width="6"/>
    <ellipse cx="540" cy="1640" rx="520" ry="200" fill="url(#kf)"/>
    {"".join(f'<ellipse cx="540" cy="1640" rx="{r}" ry="{r * .38:.0f}" fill="none" stroke="#7a8cff" stroke-width="5" opacity="{.8 - r / 900:.2f}"/>' for r in (140, 260, 380, 500))}
  </svg>
'''

random.seed(192)
zal = HEAD + f'''    <defs><linearGradient id="kz" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#070a24"/><stop offset="1" stop-color="#1a2260"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#kz)"/>
    <rect x="240" y="140" width="600" height="130" rx="16" fill="#0b1040" stroke="#ff3bd0" stroke-width="8"/>
    <text x="540" y="230" text-anchor="middle" {F} font-size="56" fill="#ff7ae6">АПЛОДИСМЕНТЫ</text>
    {"".join(f'<rect x="0" y="{y}" width="1080" height="18" fill="#2a3480"/>' for y in range(560, 1500, 230))}
    {"".join(f'<g><circle cx="{x}" cy="{y - 70}" r="{s}" fill="#0a0d2a"/><path d="M{x - s * 1.6} {y} q{s * 1.6} {-s * 2.2} {s * 3.2} 0 z" fill="#0a0d2a"/><rect x="{x - 10}" y="{y - 30}" width="20" height="26" rx="4" fill="{["#ffd23f", "#4cd964", "#2f6db5", "#ff3b30"][R(0, 3)]}" opacity=".8"/></g>' for row, y in enumerate(range(560, 1500, 230)) for x in range(40 + (row % 2) * 60, 1080, 120) for s in (30 + row * 4,))}
    <rect y="1500" width="1080" height="420" fill="#080b2a"/><path d="M0 1500 H1080" stroke="#7a8cff" stroke-width="6"/>
  </svg>
'''

random.seed(193)
kuh = HEAD + f'''    <rect width="1080" height="1920" fill="#e9dcc6"/>
    {"".join(f'<rect x="{x}" y="{y}" width="58" height="58" fill="none" stroke="#d8c9ae" stroke-width="3"/>' for x in range(0, 1080, 60) for y in range(700, 1180, 60))}
    <!-- окно -->
    <rect x="380" y="180" width="420" height="440" fill="#a8d8f0" stroke="#fbf6ec" stroke-width="16"/><path d="M590 180 V620 M380 400 H800" stroke="#fbf6ec" stroke-width="12"/>
    <rect x="400" y="460" width="160" height="150" fill="#c9a06a"/><rect x="610" y="430" width="170" height="180" fill="#9aa6b8"/><circle cx="460" cy="300" r="40" fill="#6abf69"/>
    <!-- холодильник -->
    <rect x="40" y="320" width="260" height="900" rx="20" fill="#f4f6f8" stroke="{K}" stroke-width="7"/><path d="M40 640 H300" stroke="{K}" stroke-width="6"/><rect x="250" y="400" width="16" height="160" rx="6" fill="#b9bfca"/>
    {"".join(f'<rect x="{x}" y="{y}" width="40" height="30" rx="6" fill="{c}" transform="rotate({R(-10, 10)} {x + 20} {y + 15})"/>' for x, y, c in ((80, 360, "#ff3b30"), (150, 420, "#ffd23f"), (90, 700, "#2f6db5"), (180, 780, "#4cd964")))}
    <!-- столешница, кофеварка -->
    <rect x="320" y="1000" width="760" height="40" fill="#8a5a33" stroke="{K}" stroke-width="6"/><rect x="320" y="1040" width="760" height="180" fill="#c9a06a" stroke="{K}" stroke-width="6"/>
    <rect x="880" y="860" width="140" height="140" rx="14" fill="#2b2f37" stroke="{K}" stroke-width="6"/><rect x="915" y="930" width="60" height="70" fill="#fbf6ec" stroke="{K}" stroke-width="4"/>
    <!-- пол -->
    <rect y="1220" width="1080" height="700" fill="#b98a5a"/><path d="M0 1220 H1080" stroke="{K}" stroke-width="7"/>
    {"".join(f'<path d="M{x} 1220 L{x - 180} 1920" stroke="#a87a4a" stroke-width="4"/>' for x in range(0, 1300, 110))}
  </svg>
'''

for n, s in (("kvizstudiya", studio), ("kvizzal", zal), ("kuhnyastasa", kuh)):
    open(f"bg_{n}.svg.part", "w").write(s)
print("ok")
