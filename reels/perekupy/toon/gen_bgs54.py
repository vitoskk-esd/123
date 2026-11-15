# python3 gen_bgs54.py → фоны для ep62 «Чёрная пятница» (киношный формат):
# bg_blackfriday (площадка Жоры ночью: тёмное небо, вагончик-офис, пустая рама баннера на столбах (сам баннер — реквизит), гирлянда флажков, фонари, разметка),
# bg_bfutro (та же площадка утром: рассвет, забор с распахнутыми воротами, стойки с лентой для очереди, табличка «ВХОД», лужи),
# bg_budkazhory (будка Жоры ночью изнутри: стол, лампа, принтер наклеек, табличка «КАССА», календарь, чайник, окно с неоном)
import random
K = "#000"
HEAD = '  <svg id="bg" width="1080" height="1920" viewBox="0 0 1080 1920" style="position:absolute;left:0;top:0">\n'
F = 'font-family="Unbounded" font-weight="900"'
R = random.randint


def lot(fill, line):
    return (f'<rect y="1180" width="1080" height="740" fill="{fill}"/><path d="M0 1180 H1080" stroke="{K}" stroke-width="7"/>'
            + "".join(f'<path d="M{x} 1220 L{x - 140} 1920" stroke="{line}" stroke-width="10" opacity=".7"/>' for x in (120, 520, 920)))


def flags(y, cols):
    return f'<path d="M0 {y} Q540 {y + 80} 1080 {y}" stroke="#151515" stroke-width="4" fill="none"/>' + "".join(
        f'<path d="M{x} {y + 80 * 4 * (x / 1080) * (1 - x / 1080)} l26 0 l-13 34 z" fill="{cols[k % len(cols)]}" stroke="{K}" stroke-width="3"/>' for k, x in enumerate(range(20, 1080, 52)))


random.seed(181)
night = HEAD + f'''    <defs><linearGradient id="bf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#07081a"/><stop offset="1" stop-color="#1c1438"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#bf)"/>
    {"".join(f'<circle cx="{R(0, 1080)}" cy="{R(0, 500)}" r="{R(1, 3)}" fill="#fff" opacity="{R(4, 9) / 10}"/>' for _ in range(40))}
    <!-- вагончик-офис -->
    <rect x="640" y="820" width="400" height="360" fill="#3a3f46" stroke="{K}" stroke-width="7"/><rect x="700" y="880" width="140" height="110" fill="#ffd27a" stroke="#151515" stroke-width="8"/>
    <rect x="880" y="900" width="100" height="280" fill="#2b2f37" stroke="{K}" stroke-width="6"/>
    <!-- рама баннера на столбах -->
    <path d="M90 1180 V420 M990 1180 V420" stroke="#5b6670" stroke-width="22"/><path d="M90 430 H990" stroke="#5b6670" stroke-width="14"/>
    {flags(330, ["#ff3b30", "#ffd23f", "#2f6db5", "#4cd964"])}
    <!-- фонари -->
    {"".join(f'<path d="M{x} 1260 V760" stroke="#2b2f37" stroke-width="14"/><circle cx="{x}" cy="750" r="22" fill="#fff6c8"/>' for x in (40, 600))}
    {lot("#24262f", "#f4f6f8")}
    {"".join(f'<ellipse cx="{R(80, 1000)}" cy="{R(1260, 1880)}" rx="{R(60, 160)}" ry="{R(8, 16)}" fill="#ff3bd0" opacity=".1"/>' for _ in range(6))}
  </svg>
'''

random.seed(182)
utro = HEAD + f'''    <defs><linearGradient id="bu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffb38a"/><stop offset=".6" stop-color="#ffd9b8"/><stop offset="1" stop-color="#e8e6ef"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#bu)"/>
    <circle cx="200" cy="560" r="110" fill="#fff2c8" opacity=".9"/>
    {"".join(f'<rect x="{x}" y="{R(500, 700)}" width="{R(90, 150)}" height="900" fill="#c7a6b8" opacity=".55"/>' for x in range(-20, 1080, 140))}
    <!-- забор с воротами -->
    <rect y="900" width="1080" height="280" fill="#8a8f98"/>{"".join(f'<path d="M{x} 900 V1180" stroke="#6b7079" stroke-width="6"/>' for x in range(0, 1080, 40))}
    <path d="M0 900 H1080" stroke="{K}" stroke-width="7"/>
    <rect x="380" y="880" width="320" height="300" fill="#e8e6ef"/>
    <path d="M380 1180 L250 1120 V860 L380 880 Z" fill="#5b6670" stroke="{K}" stroke-width="6"/><path d="M700 1180 L830 1120 V860 L700 880 Z" fill="#5b6670" stroke="{K}" stroke-width="6"/>
    <rect x="440" y="780" width="200" height="80" rx="10" fill="#fbf6ec" stroke="{K}" stroke-width="6"/><text x="540" y="836" text-anchor="middle" {F} font-size="44" fill="#151515">ВХОД</text>
    {flags(330, ["#151515", "#ffd23f"])}
    {lot("#6e7280", "#f4f6f8")}
    <!-- стойки с лентой для очереди -->
    {"".join(f'<path d="M{x} 1500 V1330" stroke="#c9ccd2" stroke-width="12"/><ellipse cx="{x}" cy="1502" rx="30" ry="9" fill="#5b6670"/>' for x in (120, 360, 600, 840))}
    {"".join(f'<path d="M{a} 1340 Q{(a + b) / 2} 1380 {b} 1340" stroke="#c0392b" stroke-width="10" fill="none"/>' for a, b in ((120, 360), (360, 600), (600, 840)))}
    {"".join(f'<ellipse cx="{R(80, 1000)}" cy="{R(1560, 1880)}" rx="{R(60, 150)}" ry="{R(10, 18)}" fill="#bcd6e4" opacity=".55"/>' for _ in range(4))}
  </svg>
'''

random.seed(183)
budka = HEAD + f'''    <rect width="1080" height="1920" fill="#4a4f3a"/>
    {"".join(f'<path d="M{x} 0 V1240" stroke="#40452f" stroke-width="16"/>' for x in range(30, 1080, 60))}
    <!-- окно с неоном снаружи -->
    <rect x="560" y="200" width="420" height="380" fill="#1c1438" stroke="#2b2f37" stroke-width="14"/><path d="M770 200 V580" stroke="#2b2f37" stroke-width="10"/>
    <rect x="590" y="300" width="360" height="90" rx="12" fill="none" stroke="#ff3bd0" stroke-width="8" opacity=".85"/><text x="770" y="365" text-anchor="middle" {F} font-size="44" fill="#ff7ae6">−50%</text>
    <!-- календарь и табличка -->
    <rect x="100" y="220" width="300" height="380" fill="#fbf6ec" stroke="{K}" stroke-width="6"/><rect x="120" y="240" width="260" height="170" fill="#c0392b"/>
    <path d="M150 380 q40 -60 100 -60 q60 0 100 60 z" fill="#ffd23f" stroke="{K}" stroke-width="4"/><circle cx="190" cy="384" r="16" fill="#151515"/><circle cx="310" cy="384" r="16" fill="#151515"/>
    {"".join(f'<rect x="{130 + i * 50}" y="{430 + j * 34}" width="36" height="24" fill="{"#c0392b" if (i, j) == (4, 3) else "#d8cfbf"}"/>' for i in range(5) for j in range(5))}
    <rect x="120" y="680" width="260" height="90" rx="10" fill="#151515"/><text x="250" y="740" text-anchor="middle" {F} font-size="48" fill="#ffd23f">КАССА</text>
    <!-- лампа -->
    <path d="M760 0 V640" stroke="#151515" stroke-width="5"/><path d="M700 640 h120 l30 60 h-180 z" fill="#2f6a3a" stroke="{K}" stroke-width="6"/>
    <!-- стол -->
    <rect x="0" y="1180" width="1080" height="60" fill="#8a5a33" stroke="{K}" stroke-width="7"/><rect x="0" y="1240" width="1080" height="680" fill="#5a3a22"/>
    <!-- чайник, кружка -->
    <path d="M60 1180 v-110 q0 -30 30 -30 h90 q30 0 30 30 v110 z" fill="#c9ccd2" stroke="{K}" stroke-width="6"/><path d="M210 1080 q40 0 40 40" stroke="{K}" stroke-width="10" fill="none"/>
    <rect x="900" y="1090" width="80" height="90" rx="10" fill="#ffd23f" stroke="{K}" stroke-width="6"/>
  </svg>
'''

for n, s in (("blackfriday", night), ("bfutro", utro), ("budkazhory", budka)):
    open(f"bg_{n}.svg.part", "w").write(s)
print("ok")
