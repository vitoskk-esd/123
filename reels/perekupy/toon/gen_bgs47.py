# python3 gen_bgs47.py → фоны для «Толян: со ста тысяч», часть 14 «Ва-банк» (ep55, киношный формат):
# bg_kryshanoch (крыша многоэтажки ночью: огни города, антенны, парапет, луна),
# bg_kottedzh (коттеджный посёлок днём: шлагбаум, кирпичный забор, ворота, туи, дорожка),
# bg_avtoelektrika (бокс автоэлектрика: стенд с проводами, диагностический стол, плакат схемы, лампа, подъёмник),
# bg_bcparking (парковка у бизнес-центра вечером: стеклянный фасад, фонари, разметка, закат в стёклах)
import random
K = "#000"
HEAD = '  <svg id="bg" width="1080" height="1920" viewBox="0 0 1080 1920" style="position:absolute;left:0;top:0">\n'
F = 'font-family="Unbounded" font-weight="900"'
M = 'font-family="JetBrains Mono" font-weight="800"'
R = random.randint

random.seed(111)
kryshanoch = HEAD + f'''    <defs><linearGradient id="kn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b1030"/><stop offset=".7" stop-color="#2a2a5a"/><stop offset="1" stop-color="#4a3a6a"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#kn)"/>
    {"".join(f'<circle cx="{R(0, 1080)}" cy="{R(0, 600)}" r="{R(1, 3)}" fill="#fff" opacity="{R(4, 9) / 10}"/>' for _ in range(70))}
    <circle cx="830" cy="230" r="70" fill="#f4f0d8"/><circle cx="860" cy="215" r="60" fill="#0f1438"/>
    <!-- огни города -->
    {"".join(f'<rect x="{x}" y="{y}" width="{w}" height="{1100 - y}" fill="#151a3a"/>' + "".join(f'<rect x="{x + 8 + i * 22}" y="{y + 12 + j * 30}" width="10" height="14" fill="#ffd27a" opacity="{R(3, 10) / 10}"/>' for i in range(w // 22) for j in range((1080 - y) // 30) if R(0, 2) == 0) for x, y, w in ((0, 760, 160), (170, 660, 120), (300, 820, 200), (520, 700, 140), (680, 780, 180), (880, 640, 200)))}
    <!-- антенны -->
    <path d="M160 1180 V900 M120 940 h80 M130 980 h60" stroke="#3a3f56" stroke-width="8"/><path d="M920 1180 V960 M880 1000 h80" stroke="#3a3f56" stroke-width="8"/>
    <!-- крыша и парапет -->
    <rect y="1100" width="1080" height="80" fill="#3a3f46" stroke="{K}" stroke-width="6"/>
    <rect y="1180" width="1080" height="740" fill="#4a4e58"/>{"".join(f'<path d="M{x} 1180 L{x - 200} 1920" stroke="#3e424c" stroke-width="5"/>' for x in range(0, 1400, 160))}
    <rect x="700" y="1260" width="220" height="140" fill="#5b6070" stroke="{K}" stroke-width="5"/><circle cx="810" cy="1330" r="44" fill="#3a3f46" stroke="{K}" stroke-width="5"/>
  </svg>
'''

random.seed(112)
kottedzh = HEAD + f'''    <defs><linearGradient id="kd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8ec9f0"/><stop offset="1" stop-color="#eaf6fc"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#kd)"/>
    {"".join(f'<ellipse cx="{x}" cy="{R(140, 260)}" rx="{R(70, 120)}" ry="{R(24, 40)}" fill="#fff" opacity=".9"/>' for x in (160, 520, 900))}
    <!-- коттедж за забором -->
    <rect x="300" y="420" width="520" height="460" fill="#e8d8c0" stroke="{K}" stroke-width="6"/><path d="M260 440 L560 260 L860 440 Z" fill="#6a3a3a" stroke="{K}" stroke-width="6"/>
    {"".join(f'<rect x="{x}" y="{y}" width="110" height="120" fill="#bfe3f5" stroke="#f4f6f8" stroke-width="10"/>' for x, y in ((360, 500), (640, 500), (360, 700), (640, 700)))}
    <!-- кирпичный забор и ворота -->
    <rect x="-20" y="760" width="1120" height="360" fill="#a8543a" stroke="{K}" stroke-width="6"/>
    {"".join(f'<path d="M-20 {y} H1100" stroke="#8a3e2a" stroke-width="4"/>' for y in range(800, 1120, 40))}
    <rect x="380" y="800" width="320" height="320" fill="#2b2f37" stroke="{K}" stroke-width="6"/>{"".join(f'<path d="M{x} 800 V1120" stroke="#4a4e58" stroke-width="8"/>' for x in range(400, 700, 30))}
    {"".join(f'<path d="M{x} 1120 q-40 -120 0 -300 q40 180 0 300 z" fill="#2e7a4a" stroke="{K}" stroke-width="4"/>' for x in (60, 200, 880, 1020))}
    <!-- шлагбаум и плитка -->
    <rect x="-20" y="1120" width="1120" height="800" fill="#c9c2b0"/>{"".join(f'<path d="M0 {y} H1080" stroke="#b0a890" stroke-width="3"/>' for y in range(1180, 1920, 70))}
    <rect x="40" y="1080" width="40" height="160" fill="#5b6670"/><path d="M80 1100 H520" stroke="#c0392b" stroke-width="18" stroke-dasharray="50 40"/>
  </svg>
'''

random.seed(113)
avtoelektrika = HEAD + f'''    <rect width="1080" height="1920" fill="#3a4250"/>
    <rect y="0" width="1080" height="1240" fill="#46505e"/>
    <!-- стенд с проводами -->
    <rect x="60" y="300" width="420" height="520" fill="#2b2f37" stroke="{K}" stroke-width="6"/>
    {"".join(f'<path d="M{80 + k * 40} 320 q{R(-30, 30)} 200 {R(-20, 20)} 480" stroke="{c}" stroke-width="7" fill="none"/>' for k, c in enumerate(("#c0392b", "#ffd23f", "#2f6db5", "#4cd964", "#ff7a1a", "#c0392b", "#f4f6f8", "#ffd23f", "#2f6db5", "#4cd964")))}
    <!-- плакат схемы -->
    <rect x="560" y="300" width="440" height="320" fill="#fbfaf3" stroke="{K}" stroke-width="6"/>
    <text x="780" y="350" text-anchor="middle" {F} font-size="26" fill="#151515">СХЕМА ЭЛЕКТРИКИ</text>
    {"".join(f'<path d="M{R(590, 960)} {R(380, 590)} h{R(30, 120)} v{R(-40, 40)}" stroke="#2f6db5" stroke-width="4" fill="none"/>' for _ in range(16))}{"".join(f'<circle cx="{R(600, 960)}" cy="{R(380, 590)}" r="8" fill="#c0392b"/>' for _ in range(8))}
    <!-- лампа -->
    <path d="M780 0 V140" stroke="#151515" stroke-width="5"/><path d="M720 140 h120 l-16 40 h-88 z" fill="#c9ced6" stroke="{K}" stroke-width="5"/><circle cx="780" cy="190" r="16" fill="#fff6c8"/>
    <!-- диагностический стол -->
    <rect x="560" y="900" width="460" height="40" fill="#8a929b" stroke="{K}" stroke-width="5"/><path d="M590 940 v300 M990 940 v300" stroke="#5b6670" stroke-width="14"/>
    <rect x="620" y="760" width="200" height="140" rx="10" fill="#151515" stroke="{K}" stroke-width="5"/><rect x="636" y="776" width="168" height="100" fill="#2f6db5"/>
    <!-- пол со стоком и колонны подъёмника -->
    <rect y="1240" width="1080" height="680" fill="#5b6070"/><path d="M0 1240 H1080" stroke="{K}" stroke-width="7"/>
    <rect x="20" y="900" width="60" height="340" fill="#ffd23f" stroke="{K}" stroke-width="5"/><rect x="1000" y="900" width="60" height="340" fill="#ffd23f" stroke="{K}" stroke-width="5"/>
    {"".join(f'<ellipse cx="{R(80, 1000)}" cy="{R(1320, 1880)}" rx="{R(60, 160)}" ry="{R(8, 16)}" fill="#4a4e58" opacity=".7"/>' for _ in range(7))}
  </svg>
'''

random.seed(114)
bcparking = HEAD + f'''    <defs><linearGradient id="bc" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a3a7a"/><stop offset=".6" stop-color="#ff9a6a"/><stop offset="1" stop-color="#ffd8a8"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#bc)"/>
    <!-- стеклянный фасад бизнес-центра -->
    <rect x="80" y="160" width="920" height="1000" fill="#2f4a6a" stroke="{K}" stroke-width="6"/>
    {"".join(f'<rect x="{x}" y="{y}" width="104" height="86" fill="{"#ffb36a" if (x + y) % 7 == 0 else "#4a7aa8"}" opacity=".9"/>' for x in range(96, 990, 112) for y in range(176, 1150, 96))}
    <rect x="80" y="160" width="920" height="70" fill="#151a2a"/><text x="540" y="210" text-anchor="middle" {F} font-size="40" fill="#ffd23f">БЦ «ГОРИЗОНТ»</text>
    <!-- фонари -->
    {"".join(f'<path d="M{x} 1300 V880" stroke="#2b2f37" stroke-width="14"/><circle cx="{x}" cy="870" r="22" fill="#fff6c8"/>' for x in (60, 1020))}
    <!-- парковка -->
    <rect y="1160" width="1080" height="760" fill="#5b5f68"/><path d="M0 1160 H1080" stroke="{K}" stroke-width="7"/>
    {"".join(f'<path d="M{x} 1200 L{x - 120} 1920" stroke="#f4f6f8" stroke-width="10" opacity=".8"/>' for x in (180, 600, 1020))}
    {"".join(f'<ellipse cx="{R(80, 1000)}" cy="{R(1260, 1880)}" rx="{R(60, 160)}" ry="{R(8, 16)}" fill="#ffb36a" opacity=".15"/>' for _ in range(7))}
  </svg>
'''

for n, s in (("kryshanoch", kryshanoch), ("kottedzh", kottedzh), ("avtoelektrika", avtoelektrika), ("bcparking", bcparking)):
    open(f"bg_{n}.svg.part", "w").write(s)
print("ok")
