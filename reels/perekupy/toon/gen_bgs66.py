# python3 gen_bgs66.py → фоны для ep74 «Футбол: матч за Камри» (киношный формат, без мата):
# bg_futbolpole (ночной стадион: трибуны, прожекторы, газон в полоску, ворота, табло — само табло реквизит),
# bg_kommentatorka (комментаторская кабина: окно на поле, пульт, мониторы, шарфы болельщиков),
# bg_varkomnata (комната видеоповторов: стена мониторов, пульт с кнопками, синий свет, надпись «VAR»)
import random
K = "#000"
HEAD = '  <svg id="bg" width="1080" height="1920" viewBox="0 0 1080 1920" style="position:absolute;left:0;top:0">\n'
F = 'font-family="Unbounded" font-weight="900"'
R = random.randint

random.seed(301)
pole = HEAD + f'''    <rect width="1080" height="1920" fill="#0e1430"/>
    {"".join(f'<circle cx="{R(0, 1080)}" cy="{R(0, 400)}" r="{R(1, 3)}" fill="#fff" opacity=".6"/>' for _ in range(30))}
    <!-- прожекторы -->
    {"".join(f'<path d="M{x} 520 V140" stroke="#3a3d46" stroke-width="16"/><rect x="{x - 70}" y="80" width="140" height="80" fill="#e8eef4" stroke="{K}" stroke-width="6"/><path d="M{x - 70} 160 L{x - 300} 1400 H{x + 300} L{x + 70} 160 Z" fill="#fff6d0" opacity=".08"/>' for x in (120, 960))}
    <!-- трибуны с болельщиками -->
    <rect y="520" width="1080" height="420" fill="#2a2f4a"/>
    {"".join(f'<circle cx="{x + (r % 2) * 25}" cy="{560 + r * 62}" r="20" fill="{("#c0392b", "#2f6db5", "#ffd23f", "#4a4f6a", "#ff7a1a")[R(0, 4)]}"/>' for r in range(6) for x in range(10, 1080, 50))}
    <!-- газон -->
    <rect y="940" width="1080" height="980" fill="#2f8a3a"/>{"".join(f'<rect x="0" y="{940 + k * 120}" width="1080" height="60" fill="#3a9a46"/>' for k in range(9))}
    <path d="M0 940 H1080" stroke="#f4f0e8" stroke-width="8"/><ellipse cx="540" cy="1400" rx="300" ry="90" fill="none" stroke="#f4f0e8" stroke-width="8"/><path d="M540 940 V1920" stroke="#f4f0e8" stroke-width="8"/>
    <!-- ворота -->
    <path d="M330 1000 V860 H750 V1000" stroke="#f4f0e8" stroke-width="14" fill="none"/>{"".join(f'<path d="M{x} 860 V1000" stroke="#c8ccd0" stroke-width="2"/>' for x in range(350, 750, 25))}{"".join(f'<path d="M330 {y} H750" stroke="#c8ccd0" stroke-width="2"/>' for y in range(880, 1000, 25))}
  </svg>
'''

random.seed(302)
kab = HEAD + f'''    <rect width="1080" height="1920" fill="#3a3d52"/>
    <!-- окно на поле -->
    <rect x="40" y="200" width="1000" height="620" fill="#0e1430" stroke="{K}" stroke-width="10"/>
    <rect x="50" y="560" width="980" height="250" fill="#2f8a3a"/>{"".join(f'<rect x="50" y="{560 + k * 50}" width="980" height="25" fill="#3a9a46"/>' for k in range(5))}
    {"".join(f'<circle cx="{x}" cy="{R(420, 540)}" r="10" fill="{("#c0392b", "#2f6db5", "#ffd23f")[R(0, 2)]}"/>' for x in range(60, 1030, 28))}
    <path d="M540 200 V820" stroke="{K}" stroke-width="8"/>
    <!-- шарфы -->
    <path d="M60 160 q120 60 240 0" stroke="#c0392b" stroke-width="30" fill="none"/><path d="M780 160 q120 60 240 0" stroke="#ff7a1a" stroke-width="30" fill="none"/>
    <!-- пульт -->
    <rect y="1240" width="1080" height="680" fill="#2b2f37" stroke="{K}" stroke-width="8"/>
    {"".join(f'<rect x="{x}" y="1080" width="220" height="150" rx="12" fill="#151515" stroke="#4a4f5a" stroke-width="6"/><rect x="{x + 16}" y="1096" width="188" height="118" fill="#2f6db5" opacity=".5"/>' for x in (60, 800))}
    {"".join(f'<circle cx="{x}" cy="1320" r="16" fill="{c}"/>' for x, c in ((420, "#c0392b"), (470, "#4cd964"), (520, "#ffd23f"), (570, "#2f6db5"), (620, "#ff7a1a")))}
  </svg>
'''

random.seed(303)
var = HEAD + f'''    <rect width="1080" height="1920" fill="#101828"/>
    <text x="540" y="200" text-anchor="middle" {F} font-size="110" fill="#2f6db5" opacity=".5">VAR</text>
    {"".join(f'<rect x="{x}" y="{y}" width="300" height="190" rx="10" fill="#151a26" stroke="#2f6db5" stroke-width="6"/><rect x="{x + 14}" y="{y + 14}" width="272" height="162" fill="#1e3a2a"/><rect x="{x + 14}" y="{y + 100}" width="272" height="20" fill="#2f8a3a"/>' for x in (60, 390, 720) for y in (300, 520))}
    <rect y="1260" width="1080" height="660" fill="#1b2232" stroke="{K}" stroke-width="8"/>
    {"".join(f'<rect x="{x}" y="1300" width="70" height="44" rx="8" fill="{c}" stroke="{K}" stroke-width="4"/>' for x, c in ((180, "#c0392b"), (270, "#4cd964"), (360, "#ffd23f"), (630, "#2f6db5"), (720, "#e8eef4"), (810, "#ff7a1a")))}
    <ellipse cx="540" cy="900" rx="600" ry="400" fill="#2f6db5" opacity=".1"/>
  </svg>
'''

for n, s in (("futbolpole", pole), ("kommentatorka", kab), ("varkomnata", var)):
    open(f"bg_{n}.svg.part", "w").write(s)
print("ok")
