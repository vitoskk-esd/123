# python3 gen_bgs74.py → фоны для ep82 «Толян · 21: кто первый» (сезон «Свой автосалон», без мата):
# bg_loftblogera (студия автоблогера Кирилла: кирпич, неоновая вывеска «KIRILL DRIVE», кольцевая лампа, софтбокс, штатив, полка с моделями машин),
# bg_ofiszhorynoch (кабинет Жоры ночью: окно с вывеской «ЖОРА МОТОРС» снаружи, стол, ноутбук, кубок «ЛУЧШИЙ ПРОДАВЕЦ 2009», лампа),
# bg_ploshchadkanoch (площадка Толяна ночью в воскресенье: навес с гирляндой, луна, будка со светом, часы на столбе 23:5x)
import random
K = "#000"
HEAD = '  <svg id="bg" width="1080" height="1920" viewBox="0 0 1080 1920" style="position:absolute;left:0;top:0">\n'
F = 'font-family="Unbounded" font-weight="900"'
R = random.randint

random.seed(381)
loft = HEAD + f"""    <rect width="1080" height="1920" fill="#7a3e2e"/>
    {"".join(f'<rect x="{x + (40 if (y // 50) % 2 else 0)}" y="{y}" width="76" height="40" fill="{random.choice(["#8a4634", "#9a5038", "#82402f"])}" stroke="#5e2c20" stroke-width="4"/>' for y in range(0, 1300, 50) for x in range(-40, 1080, 80))}
    <!-- неоновая вывеска -->
    <rect x="250" y="250" width="580" height="150" rx="24" fill="#1a1020" opacity=".55"/>
    <text x="540" y="350" text-anchor="middle" {F} font-size="76" fill="none" stroke="#ff4fd8" stroke-width="10" opacity=".35">KIRILL DRIVE</text>
    <text x="540" y="350" text-anchor="middle" {F} font-size="76" fill="#ffd6f6" stroke="#ff4fd8" stroke-width="3">KIRILL DRIVE</text>
    <!-- полка с моделями машин -->
    <rect x="60" y="560" width="300" height="20" fill="#3a2a20" stroke="{K}" stroke-width="5"/>
    {"".join(f'<path d="M{x} 556 q10 -26 40 -26 q24 0 34 26 z" fill="{c}" stroke="{K}" stroke-width="4"/><circle cx="{x + 14}" cy="558" r="7" fill="#151515"/><circle cx="{x + 64}" cy="558" r="7" fill="#151515"/>' for x, c in ((80, "#ff3b30"), (180, "#ffd23f"), (270, "#2f6db5")))}
    <!-- кольцевая лампа на штативе -->
    <circle cx="880" cy="760" r="120" fill="none" stroke="#fffbe8" stroke-width="34"/><circle cx="880" cy="760" r="120" fill="none" stroke="{K}" stroke-width="5"/><circle cx="880" cy="760" r="154" fill="#fff6d0" opacity=".15"/>
    <path d="M880 880 V1310 M880 1310 l-90 70 M880 1310 l90 70 M880 1310 v80" stroke="#2b2c31" stroke-width="12"/>
    <!-- софтбокс -->
    <path d="M60 720 h220 l-40 220 h-140 z" fill="#f4f0e8" stroke="{K}" stroke-width="6" opacity=".95"/><path d="M170 940 V1320 M170 1320 l-70 60 M170 1320 l70 60" stroke="#2b2c31" stroke-width="10"/>
    <!-- пол-бетон -->
    <rect y="1300" width="1080" height="620" fill="#6e6e72"/><path d="M0 1300 H1080" stroke="{K}" stroke-width="7"/>
    {"".join(f'<path d="M{R(0, 1080)} {R(1340, 1900)} l{R(40, 120)} {R(-6, 6)}" stroke="#5e5e62" stroke-width="5"/>' for _ in range(14))}
  </svg>
"""

random.seed(382)
zho = HEAD + f"""    <rect width="1080" height="1920" fill="#2a2430"/>{"".join(f'<path d="M{x} 0 V1320" stroke="#302a36" stroke-width="30"/>' for x in range(20, 1080, 90))}
    <!-- окно: ночь, снаружи красная вывеска -->
    <rect x="120" y="220" width="560" height="620" fill="#141830" stroke="#4a4050" stroke-width="22"/>
    {"".join(f'<circle cx="{R(140, 660)}" cy="{R(240, 520)}" r="{R(2, 4)}" fill="#fff" opacity=".8"/>' for _ in range(20))}
    <rect x="170" y="600" width="460" height="110" fill="#c0392b" opacity=".85"/><text x="400" y="675" text-anchor="middle" {F} font-size="52" fill="#fff">ЖОРА МОТОРС</text>
    <path d="M400 220 V840 M120 530 H680" stroke="#4a4050" stroke-width="12"/>
    <!-- кубок на полке -->
    <rect x="740" y="520" width="280" height="18" fill="#5a4030" stroke="{K}" stroke-width="5"/>
    <path d="M840 440 h80 q0 60 -40 66 q-40 -6 -40 -66 z" fill="#ffd23f" stroke="{K}" stroke-width="5"/><rect x="860" y="500" width="40" height="20" fill="#ffd23f" stroke="{K}" stroke-width="4"/>
    <rect x="760" y="420" width="70" height="90" fill="#f4f0e8" stroke="{K}" stroke-width="4"/><text x="795" y="470" text-anchor="middle" {F} font-size="16" fill="#151515">2009</text>
    <!-- лампа на столе: пятно света -->
    <ellipse cx="760" cy="1300" rx="380" ry="90" fill="#ffd98a" opacity=".18"/>
    <path d="M900 1300 V1150 l-60 -60" stroke="#2b2c31" stroke-width="12" fill="none"/><path d="M800 1060 l70 -20 l20 60 z" fill="#c0392b" stroke="{K}" stroke-width="5"/>
    <!-- стол -->
    <rect y="1300" width="1080" height="620" fill="#3a2418"/><path d="M0 1300 H1080" stroke="{K}" stroke-width="8"/>
    {"".join(f'<path d="M0 {y} H1080" stroke="#45301f" stroke-width="5"/>' for y in range(1380, 1920, 90))}
  </svg>
"""

random.seed(383)
noch = HEAD + f"""    <defs><linearGradient id="pnsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0c1030"/><stop offset="1" stop-color="#2a2a5a"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#pnsky)"/>
    {"".join(f'<circle cx="{R(0, 1080)}" cy="{R(60, 560)}" r="{R(2, 4)}" fill="#fff" opacity=".85"/>' for _ in range(40))}
    <circle cx="880" cy="230" r="70" fill="#f4f0d8"/><circle cx="905" cy="215" r="62" fill="#0e1234"/>
    <!-- навес с гирляндой -->
    <rect x="-20" y="640" width="1120" height="60" fill="#3a3e4a" stroke="{K}" stroke-width="7"/>
    <path d="M60 700 V1240 M540 700 V1240 M1020 700 V1240" stroke="#4a4e5a" stroke-width="22"/>
    <path d="M-10 720 Q270 800 540 720 Q810 800 1090 720" stroke="#151515" stroke-width="4" fill="none"/>
    {"".join(f'<circle cx="{x}" cy="{720 + 80 * (1 - ((x % 540) / 270 - 1) ** 2) * .5 + 8}" r="11" fill="{["#ffd23f", "#ff3b30", "#4cd964", "#5ab0ff"][i % 4]}"/><circle cx="{x}" cy="{720 + 80 * (1 - ((x % 540) / 270 - 1) ** 2) * .5 + 8}" r="26" fill="{["#ffd23f", "#ff3b30", "#4cd964", "#5ab0ff"][i % 4]}" opacity=".25"/>' for i, x in enumerate(range(20, 1080, 60)))}
    <!-- будка со светом -->
    <rect x="700" y="880" width="300" height="360" fill="#e8e4dc" stroke="{K}" stroke-width="7"/><rect x="740" y="930" width="220" height="140" fill="#ffe7a0" stroke="{K}" stroke-width="5"/>
    <!-- часы на столбе -->
    <path d="M200 1240 V880" stroke="#2b2f37" stroke-width="12"/><rect x="110" y="790" width="180" height="96" rx="12" fill="#151515" stroke="#2b2f37" stroke-width="6"/>
    <text x="200" y="858" text-anchor="middle" font-family="JetBrains Mono" font-weight="800" font-size="52" fill="#ff3b30">23:58</text>
    <!-- асфальт -->
    <rect y="1240" width="1080" height="680" fill="#2e2e36"/><path d="M0 1240 H1080" stroke="{K}" stroke-width="6"/>
    {"".join(f'<path d="M{x} 1600 h90" stroke="#5a5a62" stroke-width="10"/>' for x in range(30, 1080, 200))}
  </svg>
"""

for n, s in (("loftblogera", loft), ("ofiszhorynoch", zho), ("ploshchadkanoch", noch)):
    open(f"bg_{n}.svg.part", "w").write(s)
print("ok")
