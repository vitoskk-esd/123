# python3 gen_bgs71.py → фоны для ep79 «Толян · 18: тест-драйв с дедом» (сезон «Свой автосалон», без мата):
# bg_salon2105 (салон «пятёрки» Палыча от торпеды назад: заднее стекло с дорогой и берёзами, вымпел на полке, накидка из деревянных шариков,
#               спинки передних кресел, кубик на зеркале; торпеда с тонким рулём — реквизит DASH05 поверх героев),
# bg_ploshchadkadozhd (площадка Толяна под дождём днём: навес бывшей АЗС, лужи с кругами, мокрый асфальт, через дорогу — здание с пустым щитом),
# bg_rollssalon (салон Rolls-Royce Лёхи: «звёздное небо» на потолке, кремовая кожа, дерево, за окном — башни Сити)
import random
K = "#000"
HEAD = '  <svg id="bg" width="1080" height="1920" viewBox="0 0 1080 1920" style="position:absolute;left:0;top:0">\n'
F = 'font-family="Unbounded" font-weight="900"'
R = random.randint

random.seed(351)
salon = HEAD + f'''    <defs><linearGradient id="s5sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bcd8ea"/><stop offset="1" stop-color="#eef4f6"/></linearGradient></defs>
    <!-- салон «пятёрки» от торпеды назад: потолок, заднее стекло, дорога позади с берёзами -->
    <rect width="1080" height="1920" fill="#b8a888"/>
    <path d="M200 300 H880 L960 900 H120 Z" fill="url(#s5sky)" stroke="#000" stroke-width="10"/>
    <path d="M140 760 H940 L960 900 H120 Z" fill="#7a9a5a"/><path d="M470 900 L530 760 H550 L610 900 Z" fill="#6f747b"/>
    {"".join(f'<path d="M{x} 900 V{R(560, 640)}" stroke="#f4f0e8" stroke-width="{R(8, 12)}"/><ellipse cx="{x}" cy="{R(540, 580)}" rx="{R(34, 46)}" ry="{R(50, 70)}" fill="#8fb04a" opacity=".9"/>' for x in (240, 320, 760, 840))}
    <path d="M200 300 H880" stroke="#9a8a6a" stroke-width="30"/>
    <!-- полка с вымпелом у заднего стекла -->
    <path d="M110 900 H970 V960 H110 Z" fill="#5a4636" stroke="#000" stroke-width="6"/>
    <path d="M700 905 h130 l-65 70 z" fill="#c0392b" stroke="#000" stroke-width="5"/><text x="765" y="935" text-anchor="middle" {F} font-size="22" fill="#ffd23f">ВАЗ</text>
    <!-- заднее сиденье с накидкой из шариков -->
    <path d="M100 960 H980 V1400 H100 Z" fill="#5a4636" stroke="#000" stroke-width="6"/>
    {"".join(f'<circle cx="{150 + i * 46}" cy="{1000 + j * 46}" r="18" fill="#c8a06a" stroke="#6a4a2a" stroke-width="3"/>' for i in range(18) for j in range(8))}
    <!-- спинки передних кресел -->
    {"".join(f'<path d="M{x} 1140 q170 -70 340 0 v780 h-340 z" fill="#4a3a30" stroke="#000" stroke-width="7"/><rect x="{x + 90}" y="980" width="160" height="150" rx="40" fill="#4a3a30" stroke="#000" stroke-width="7"/>' for x in (20, 720))}
    <!-- зеркало и кубик -->
    <rect x="450" y="40" width="180" height="56" rx="12" fill="#2b2c31" stroke="#000" stroke-width="5"/><path d="M540 96 V170" stroke="#151515" stroke-width="3"/>
    <rect x="512" y="170" width="56" height="56" rx="8" fill="#f4f0e8" stroke="#000" stroke-width="5"/>{"".join(f'<circle cx="{x}" cy="{y}" r="6" fill="#151515"/>' for x, y in ((526, 184), (554, 184), (540, 198), (526, 212), (554, 212)))}
  </svg>
'''

random.seed(352)
dozhd = HEAD + f'''    <defs><linearGradient id="pdsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6f7c8a"/><stop offset="1" stop-color="#b8c2cc"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#pdsky)"/>
    {"".join(f'<ellipse cx="{R(0, 1080)}" cy="{R(80, 420)}" rx="{R(160, 280)}" ry="{R(40, 70)}" fill="#5f6b78" opacity=".7"/>' for _ in range(6))}
    <!-- через дорогу: здание с пустым щитом -->
    <rect x="560" y="700" width="480" height="250" fill="#5a5f6e" stroke="{K}" stroke-width="6"/>{"".join(f'<rect x="{590 + k * 110}" y="820" width="70" height="90" fill="#9aa8b4"/>' for k in range(4))}
    <rect x="580" y="600" width="440" height="110" fill="#e8e4dc" stroke="{K}" stroke-width="6"/><path d="M620 710 V760 M980 710 V760" stroke="{K}" stroke-width="8"/>
    <!-- навес бывшей АЗС -->
    <rect x="40" y="560" width="520" height="90" fill="#c8c4bc" stroke="{K}" stroke-width="7"/><rect x="40" y="630" width="520" height="20" fill="#c0392b"/>
    {"".join(f'<rect x="{x}" y="650" width="40" height="560" fill="#8a9096" stroke="{K}" stroke-width="6"/>' for x in (120, 460))}
    <!-- мокрый асфальт, лужи, отражения -->
    <rect y="1210" width="1080" height="710" fill="#4f545b"/><path d="M0 1210 H1080" stroke="{K}" stroke-width="6"/>
    {"".join(f'<ellipse cx="{x}" cy="{y}" rx="{R(90, 190)}" ry="{R(16, 30)}" fill="#7f8a96" opacity=".75"/><ellipse cx="{x + R(-20, 20)}" cy="{y}" rx="{R(20, 40)}" ry="{R(4, 8)}" fill="none" stroke="#c8d4de" stroke-width="3"/>' for x, y in ((180, 1400), (760, 1480), (420, 1700), (920, 1780), (140, 1840)))}
    {"".join(f'<path d="M{x} 1220 v{R(60, 140)}" stroke="#c0392b" stroke-width="10" opacity=".25"/>' for x in (60, 80))}
  </svg>
'''

random.seed(353)
rolls = HEAD + f'''    <defs><linearGradient id="rrsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0d1030"/><stop offset="1" stop-color="#3a2a5a"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="#1a1416"/>
    <!-- потолок «звёздное небо» -->
    <path d="M0 0 H1080 V420 Q540 520 0 420 Z" fill="#0c0d18"/>{"".join(f'<circle cx="{R(10, 1070)}" cy="{R(10, 440)}" r="{R(2, 5)}" fill="#fff" opacity="{R(5, 10) / 10}"/>' for _ in range(140))}
    <!-- окно: башни Сити ночью -->
    <rect x="620" y="520" width="440" height="520" rx="40" fill="url(#rrsky)" stroke="#2a2420" stroke-width="18"/>
    {"".join(f'<rect x="{x}" y="{y}" width="{w}" height="{1040 - y}" fill="{c}"/>' for x, y, w, c in ((660, 640, 70, "#3e5876"), (740, 580, 80, "#4a6888"), (830, 700, 60, "#8a6a3a"), (900, 620, 70, "#2e3a4a"), (980, 720, 60, "#3a4a5e")))}
    {"".join(f'<rect x="{R(665, 1030)}" y="{R(600, 1020)}" width="5" height="8" fill="#ffd98a"/>' for _ in range(60))}
    <!-- дерево и кремовая кожа -->
    <path d="M0 1040 H1080 V1140 H0 Z" fill="#6a3a1a" stroke="{K}" stroke-width="6"/><path d="M0 1080 H1080" stroke="#8a5a2a" stroke-width="6"/>
    <path d="M0 1140 H1080 V1920 H0 Z" fill="#e8dcc4"/>
    {"".join(f'<path d="M{x} 1240 q160 -60 320 0 v680 h-320 z" fill="#f2e8d4" stroke="#b8a888" stroke-width="6"/>' + "".join(f'<path d="M{x + 40} {y} h240" stroke="#d8c8a8" stroke-width="5"/>' for y in range(1320, 1920, 70)) for x in (40, 700))}
    <rect x="420" y="1260" width="220" height="660" rx="30" fill="#6a3a1a" stroke="{K}" stroke-width="6"/><circle cx="530" cy="1360" r="40" fill="#c9cdd2" stroke="{K}" stroke-width="5"/>
  </svg>
'''

for n, s in (("salon2105", salon), ("ploshchadkadozhd", dozhd), ("rollssalon", rolls)):
    open(f"bg_{n}.svg.part", "w").write(s)
print("ok")
