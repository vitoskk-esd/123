# python3 gen_bgs51.py → фоны для ep59 «Свидание» (киношный формат):
# bg_prihozhaya (прихожая вечером: зеркало в раме, вешалка с куртками, обувная полка, обои в полоску, лампа-бра),
# bg_restoran (ресторан вечером: красные портьеры, окно с ночным городом, свечи на стенах, гирлянда, белые скатерти дальних столов),
# bg_restoranpark (парковка у ресторана ночью: фасад с неоновой вывеской «Ресторан», фонари, разметка, мокрый асфальт)
import random
K = "#000"
HEAD = '  <svg id="bg" width="1080" height="1920" viewBox="0 0 1080 1920" style="position:absolute;left:0;top:0">\n'
F = 'font-family="Unbounded" font-weight="900"'
R = random.randint

random.seed(151)
prihozhaya = HEAD + f'''    <rect width="1080" height="1920" fill="#c9a98a"/>
    {"".join(f'<rect x="{x}" y="0" width="40" height="1240" fill="#bb9a7c"/>' for x in range(0, 1080, 80))}
    <!-- зеркало в раме -->
    <rect x="300" y="200" width="480" height="820" rx="20" fill="#6b4423" stroke="{K}" stroke-width="7"/>
    <rect x="330" y="230" width="420" height="760" rx="12" fill="#bcd6e4"/>
    <path d="M360 300 l120 -60 M360 380 l200 -100 M620 900 l100 -50" stroke="#e8f4fa" stroke-width="14" opacity=".8"/>
    <!-- лампа-бра -->
    <path d="M200 340 v-60" stroke="#3a2a1a" stroke-width="8"/><path d="M160 340 h80 l-16 50 h-48 z" fill="#ffe8a8" stroke="{K}" stroke-width="5"/>
    <path d="M880 340 v-60" stroke="#3a2a1a" stroke-width="8"/><path d="M840 340 h80 l-16 50 h-48 z" fill="#ffe8a8" stroke="{K}" stroke-width="5"/>
    <!-- вешалка -->
    <rect x="40" y="520" width="200" height="22" fill="#6b4423" stroke="{K}" stroke-width="5"/>
    {"".join(f'<path d="M{x} 542 q-30 120 -10 340 h80 q20 -220 -10 -340 z" fill="{c}" stroke="{K}" stroke-width="5"/>' for x, c in ((80, "#2b2f37"), (170, "#8a3a2a")))}
    <!-- обувная полка -->
    <rect x="820" y="1080" width="220" height="160" fill="#8a5a33" stroke="{K}" stroke-width="6"/><path d="M820 1160 h220" stroke="{K}" stroke-width="5"/>
    {"".join(f'<ellipse cx="{x}" cy="1145" rx="34" ry="14" fill="#151515"/>' for x in (870, 950, 1010))}
    <!-- пол-паркет и коврик -->
    <rect y="1240" width="1080" height="680" fill="#9a6a3f"/><path d="M0 1240 H1080" stroke="{K}" stroke-width="7"/>
    {"".join(f'<path d="M{x} 1240 L{x - 160} 1920" stroke="#86592f" stroke-width="4"/>' for x in range(0, 1300, 110))}
    <ellipse cx="540" cy="1640" rx="380" ry="90" fill="#7a2a3a" opacity=".85"/>
  </svg>
'''

random.seed(152)
restoran = HEAD + f'''    <rect width="1080" height="1920" fill="#3a1418"/>
    <!-- окно с ночным городом -->
    <rect x="300" y="160" width="480" height="560" fill="#141838" stroke="#e6b422" stroke-width="10"/>
    {"".join(f'<rect x="{x}" y="{y}" width="{w}" height="{720 - y}" fill="#1c2048"/>' + "".join(f'<rect x="{x + 6 + i * 16}" y="{y + 10 + j * 22}" width="7" height="10" fill="#ffc46a" opacity="{R(3, 10) / 10}"/>' for i in range(w // 16) for j in range((700 - y) // 22) if R(0, 2) == 0) for x, y, w in ((310, 420, 100), (420, 360, 90), (520, 450, 110), (640, 380, 130)))}
    <path d="M540 160 V720 M300 440 H780" stroke="#e6b422" stroke-width="8"/>
    <!-- портьеры -->
    {"".join(f'<path d="M{x} 100 q{s * 30} 400 {s * 10} 900 h{s * 120} q{-s * 20} -500 {s * 40} -900 z" fill="#8a1a2a" stroke="{K}" stroke-width="5"/>' for x, s in ((200, 1), (880, -1)))}
    <path d="M150 100 H930" stroke="#e6b422" stroke-width="14"/>
    <!-- гирлянда и бра-свечи -->
    {"".join(f'<circle cx="{x}" cy="{70 + (x // 60 % 2) * 20}" r="10" fill="#ffd27a"/>' for x in range(40, 1080, 60))}
    {"".join(f'<rect x="{x - 8}" y="560" width="16" height="70" fill="#f1e6d2" stroke="{K}" stroke-width="3"/><path d="M{x} 552 q-8 -16 0 -30 q8 14 0 30 z" fill="#ffb84a"/><rect x="{x - 30}" y="630" width="60" height="12" fill="#e6b422"/>' for x in (90, 990))}
    <!-- дальние столики -->
    {"".join(f'<ellipse cx="{x}" cy="1060" rx="120" ry="26" fill="#fbf6ec"/><path d="M{x - 115} 1060 v140 h230 v-140" fill="#f1e6d2"/>' for x in (130, 950))}
    <!-- пол -->
    <rect y="1240" width="1080" height="680" fill="#5a2a22"/><path d="M0 1240 H1080" stroke="{K}" stroke-width="7"/>
    {"".join(f'<path d="M0 {y} H1080" stroke="#4a221c" stroke-width="3"/>' for y in range(1300, 1920, 70))}
  </svg>
'''

random.seed(153)
restoranpark = HEAD + f'''    <defs><linearGradient id="rp" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b1030"/><stop offset="1" stop-color="#2a2050"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#rp)"/>
    {"".join(f'<circle cx="{R(0, 1080)}" cy="{R(0, 300)}" r="{R(1, 3)}" fill="#fff" opacity="{R(4, 9) / 10}"/>' for _ in range(40))}
    <!-- фасад ресторана -->
    <rect x="60" y="320" width="960" height="860" fill="#3a2a2a" stroke="{K}" stroke-width="6"/>
    {"".join(f'<rect x="{x}" y="600" width="180" height="300" fill="#ffc46a" opacity=".85" stroke="#1a1010" stroke-width="10"/>' for x in (110, 330, 750))}
    <rect x="560" y="640" width="150" height="540" fill="#5a3820" stroke="{K}" stroke-width="6"/>
    <rect x="200" y="400" width="680" height="140" rx="20" fill="none" stroke="#ff3bd0" stroke-width="10"/>
    <text x="540" y="500" text-anchor="middle" {F} font-size="86" fill="#ff7ae6" stroke="#ff3bd0" stroke-width="2">РЕСТОРАН</text>
    <!-- фонари -->
    {"".join(f'<path d="M{x} 1400 V880" stroke="#2b2f37" stroke-width="14"/><circle cx="{x}" cy="870" r="22" fill="#fff6c8"/>' for x in (40, 1040))}
    <!-- мокрый асфальт, разметка -->
    <rect y="1180" width="1080" height="740" fill="#2b2e3a"/><path d="M0 1180 H1080" stroke="{K}" stroke-width="7"/>
    {"".join(f'<path d="M{x} 1220 L{x - 140} 1920" stroke="#f4f6f8" stroke-width="10" opacity=".7"/>' for x in (160, 600, 1040))}
    {"".join(f'<ellipse cx="{R(80, 1000)}" cy="{R(1260, 1880)}" rx="{R(60, 160)}" ry="{R(8, 16)}" fill="#ff7ae6" opacity=".12"/>' for _ in range(6))}
  </svg>
'''

for n, s in (("prihozhaya", prihozhaya), ("restoran", restoran), ("restoranpark", restoranpark)):
    open(f"bg_{n}.svg.part", "w").write(s)
print("ok")
