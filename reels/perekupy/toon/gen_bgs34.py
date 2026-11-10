# python3 gen_bgs34.py → новые фоны для отдельной серии «Семейный чат» (ep42, не про Толяна):
# bg_ostanovka (остановка вечером под дождём: козырёк, расписание, фонарь, лужи, огни машин), bg_lift (кабина лифта: кнопки,
# зеркало, наклейки, табло этажа), bg_golubyatnya (старый двор днём: голубятня на столбах, сарайки, бельё, голуби, тополь)
import random
K = "#000"
random.seed(46)
HEAD = '  <svg id="bg" width="1080" height="1920" viewBox="0 0 1080 1920" style="position:absolute;left:0;top:0">\n'
F = 'font-family="Unbounded" font-weight="900"'
M = 'font-family="JetBrains Mono" font-weight="800"'

rain = "".join(f'<path d="M{x} {y} l-14 46" stroke="#9fb6d6" stroke-width="3" opacity=".45"/>'
               for x, y in ((random.randint(0, 1100), random.randint(0, 1900)) for _ in range(120)))
ostanovka = HEAD + f'''    <defs><linearGradient id="osSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a2233"/><stop offset="1" stop-color="#34405a"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#osSky)"/>
    <!-- дома вдали -->
    {"".join(f'<rect x="{x}" y="{y}" width="{w}" height="{1000 - y}" fill="#232b3d" stroke="{K}" stroke-width="5"/>' for x, y, w in [(0, 380, 260), (280, 300, 220), (760, 340, 320)])}
    {"".join(f'<rect x="{x}" y="{y}" width="40" height="46" fill="{"#ffd27a" if random.random() < .45 else "#141a28"}"/>' for x0, y0, w in [(0, 380, 260), (280, 300, 220), (760, 340, 320)] for x in range(x0 + 24, x0 + w - 40, 70) for y in range(y0 + 30, 900, 90))}
    <!-- фонарь -->
    <g><path d="M120 1000 V420" stroke="#2b2f37" stroke-width="16"/><path d="M120 430 q60 -40 120 0" fill="none" stroke="#2b2f37" stroke-width="12"/>
      <rect x="210" y="424" width="60" height="26" rx="8" fill="#ffe9a8" stroke="{K}" stroke-width="4" style="filter:drop-shadow(0 0 18px #ffd27a)"/>
      <path d="M210 450 L130 1000 L380 1000 L270 450 Z" fill="#ffe9a8" opacity=".10"/></g>
    <!-- остановка: козырёк, стекло, скамейка, расписание -->
    <g><rect x="330" y="520" width="700" height="40" fill="#3a7bd5" stroke="{K}" stroke-width="7"/><text x="680" y="550" text-anchor="middle" {F} font-size="26" fill="#fff">ОСТАНОВКА «ПОЛИКЛИНИКА»</text>
      <path d="M350 560 V1000 M1010 560 V1000" stroke="#2b2f37" stroke-width="14"/>
      <rect x="360" y="580" width="640" height="300" fill="#9fc3e0" opacity=".22" stroke="#cfd8df" stroke-width="5"/>
      <rect x="700" y="600" width="170" height="220" fill="#f4f1e8" stroke="{K}" stroke-width="5"/><text x="785" y="634" text-anchor="middle" {M} font-size="20" fill="#151515">№ 47</text>
      {"".join(f'<rect x="716" y="{650 + i * 26}" width="{138 - (i % 3) * 22}" height="10" fill="#9aa3ad"/>' for i in range(6))}
      <rect x="420" y="840" width="240" height="22" fill="#8a5a33" stroke="{K}" stroke-width="5"/><path d="M440 862 v40 M640 862 v40" stroke="#2b2f37" stroke-width="10"/></g>
    <!-- урна и бордюр -->
    <rect x="910" y="900" width="60" height="100" fill="#4f6b5a" stroke="{K}" stroke-width="5"/>
    <rect y="1000" width="1080" height="920" fill="#2d323c"/><rect y="1000" width="1080" height="40" fill="#5b6270"/><path d="M0 1000 H1080 M0 1040 H1080" stroke="{K}" stroke-width="6"/>
    <!-- лужи с отражениями огней -->
    {"".join(f'<ellipse cx="{x}" cy="{y}" rx="{rx}" ry="16" fill="#3c4a63" opacity=".9"/><ellipse cx="{x + 30}" cy="{y}" rx="{rx // 4}" ry="5" fill="{c}" opacity=".6"/>' for x, y, rx, c in [(220, 1180, 150, "#ffd27a"), (760, 1300, 130, "#ff3b30"), (420, 1560, 190, "#ffd27a"), (880, 1720, 120, "#9fc3e0")])}
    <path d="M0 1460 H1080" stroke="#e8ecf0" stroke-width="10" stroke-dasharray="80 70" opacity=".5"/>
    {rain}
  </svg>
'''

lift = HEAD + f'''    <rect width="1080" height="1920" fill="#6f6a62"/>
    <!-- стенки кабины: панели под «дерево» -->
    {"".join(f'<rect x="{x}" y="120" width="180" height="880" fill="{c}" stroke="{K}" stroke-width="6"/>' for x, c in [(0, "#8a7356"), (180, "#94805f"), (900, "#8a7356")])}
    <!-- зеркало -->
    <rect x="380" y="180" width="320" height="520" rx="14" fill="#b9cdd8" stroke="{K}" stroke-width="8"/><path d="M420 260 l120 -60 M440 340 l200 -100" stroke="#fff" stroke-width="10" opacity=".5"/>
    <!-- панель кнопок и табло этажа -->
    <g><rect x="740" y="200" width="130" height="560" rx="12" fill="#c3c8cf" stroke="{K}" stroke-width="7"/>
      <rect x="760" y="220" width="90" height="70" rx="8" fill="#151515" stroke="{K}" stroke-width="4"/><text x="805" y="272" text-anchor="middle" {M} font-size="46" fill="#ff3b30" style="filter:drop-shadow(0 0 8px #ff3b30)">7▲</text>
      {"".join(f'<circle cx="{785 + (i % 2) * 42}" cy="{330 + (i // 2) * 62}" r="17" fill="{"#ffd23f" if i == 6 else "#e8ecf0"}" stroke="{K}" stroke-width="4"/><text x="{785 + (i % 2) * 42}" y="{337 + (i // 2) * 62}" text-anchor="middle" {M} font-size="16" fill="#151515">{i + 1}</text>' for i in range(14))}
      <rect x="768" y="770" width="76" height="40" rx="6" fill="#ff3b30" stroke="{K}" stroke-width="4"/><text x="806" y="798" text-anchor="middle" {M} font-size="18" fill="#fff">ВЫЗОВ</text></g>
    <!-- наклейки и надписи -->
    <g transform="rotate(-6 150 420)"><rect x="60" y="380" width="200" height="90" fill="#ffd23f" stroke="{K}" stroke-width="5"/><text x="160" y="418" text-anchor="middle" {M} font-size="20" fill="#151515">РЕМОНТ ДВЕРЕЙ</text><text x="160" y="448" text-anchor="middle" {M} font-size="20" fill="#151515">8-900-…</text></g>
    <g transform="rotate(4 980 520)"><rect x="920" y="470" width="130" height="90" fill="#fff" stroke="{K}" stroke-width="5"/><text x="985" y="508" text-anchor="middle" {F} font-size="16" fill="#c0392b">НЕ КУРИТЬ</text><text x="985" y="538" text-anchor="middle" {M} font-size="14" fill="#151515">ТСЖ «ЛАДОГА»</text></g>
    <text x="120" y="760" {M} font-size="34" fill="#2b2f37" opacity=".55" transform="rotate(-8 120 760)">ВОВА + ЛЕНА</text>
    <!-- лампа и решётка вентиляции -->
    <rect x="0" y="0" width="1080" height="120" fill="#4a4640" stroke="{K}" stroke-width="6"/><rect x="340" y="34" width="400" height="50" rx="10" fill="#fff6d8" stroke="{K}" stroke-width="5" style="filter:drop-shadow(0 0 20px #fff2c0)"/>
    <!-- пол: линолеум «плитка» -->
    <rect y="1000" width="1080" height="920" fill="#5c5348"/><path d="M0 1000 H1080" stroke="{K}" stroke-width="8"/>
    <g stroke="#4c4439" stroke-width="5">{"".join(f'<path d="M{x} 1000 L{x * 1.6 - 324} 1920"/>' for x in range(0, 1181, 135))}{"".join(f'<path d="M0 {y} H1080"/>' for y in (1120, 1290, 1520, 1820))}</g>
    <!-- двери кабины по краям -->
    <rect x="0" y="120" width="40" height="1800" fill="#9aa3ad" stroke="{K}" stroke-width="6"/><rect x="1040" y="120" width="40" height="1800" fill="#9aa3ad" stroke="{K}" stroke-width="6"/>
  </svg>
'''

pigeons = "".join(f'<g transform="translate({x} {y}) scale({s})"><ellipse cx="0" cy="0" rx="26" ry="16" fill="#8f98a6" stroke="{K}" stroke-width="4"/><circle cx="22" cy="-12" r="10" fill="#7a8494" stroke="{K}" stroke-width="4"/><path d="M30 -12 l10 3 -10 3" fill="#ffb02e"/><path d="M-26 0 l-16 -8 v16 z" fill="#6f7886" stroke="{K}" stroke-width="3"/></g>'
                  for x, y, s in [(560, 296, 1), (640, 300, -1), (720, 296, 1), (860, 1180, 1.2), (300, 1420, -1.2), (980, 1500, 1)])
golubyatnya = HEAD + f'''    <rect width="1080" height="1920" fill="#cfe6f2"/><ellipse cx="220" cy="160" rx="160" ry="40" fill="#fff" opacity=".9"/><ellipse cx="860" cy="110" rx="110" ry="28" fill="#fff" opacity=".8"/>
    <!-- пятиэтажка сзади -->
    <rect x="0" y="240" width="1080" height="760" fill="#d9c7a7" stroke="{K}" stroke-width="7"/>
    {"".join(f'<rect x="{x}" y="{y}" width="90" height="100" fill="#8fb3c9" stroke="{K}" stroke-width="5"/>' for x in range(40, 1040, 150) for y in (280, 430))}
    <!-- голубятня на столбах -->
    <g><path d="M520 1000 V560 M800 1000 V560" stroke="#6b4a2b" stroke-width="18"/><path d="M520 760 L800 640 M800 760 L520 640" stroke="#6b4a2b" stroke-width="9"/>
      <rect x="470" y="330" width="380" height="240" fill="#4f7fa8" stroke="{K}" stroke-width="8"/><path d="M450 336 L660 220 L870 336 Z" fill="#c0392b" stroke="{K}" stroke-width="8" stroke-linejoin="round"/>
      <rect x="520" y="380" width="120" height="120" fill="#2b3a4a" stroke="{K}" stroke-width="5"/><g stroke="#cfd8df" stroke-width="4">{"".join(f'<path d="M{x} 380 V500"/>' for x in range(536, 640, 20))}</g>
      <rect x="680" y="380" width="130" height="150" fill="#3e6a90" stroke="{K}" stroke-width="5"/><text x="745" y="470" text-anchor="middle" {F} font-size="24" fill="#fff">ГОЛУБИ</text>
      <path d="M450 580 H870" stroke="{K}" stroke-width="8"/><path d="M470 300 H850" stroke="#6b4a2b" stroke-width="10"/></g>
    <!-- сарайки и бельё -->
    {"".join(f'<rect x="{x}" y="800" width="150" height="200" fill="{c}" stroke="{K}" stroke-width="6"/><rect x="{x + 40}" y="850" width="70" height="150" fill="#5b4636" stroke="{K}" stroke-width="4"/>' for x, c in [(0, "#7a8a5a"), (150, "#8a6d48"), (880, "#6d7f8f")])}
    <path d="M60 640 Q260 690 460 640" stroke="#2b2f37" stroke-width="4" fill="none"/>
    {"".join(f'<rect x="{x}" y="{650 + abs(260 - x) // 12}" width="56" height="{h}" fill="{c}" stroke="{K}" stroke-width="4"/>' for x, h, c in [(110, 80, "#ff7a1a"), (190, 64, "#fff"), (270, 90, "#3a7bd5"), (350, 70, "#ffd23f")])}
    <!-- тополь -->
    <g><path d="M980 1000 V560" stroke="#5b4636" stroke-width="30"/><ellipse cx="980" cy="480" rx="120" ry="200" fill="#5f9d48" stroke="{K}" stroke-width="7"/></g>
    <!-- двор: асфальт в трещинах и песочница -->
    <rect y="1000" width="1080" height="920" fill="#8a8f96"/><path d="M0 1000 H1080" stroke="{K}" stroke-width="7"/>
    <path d="M120 1100 l80 60 -30 70 90 40 M760 1650 l60 -50 80 30" stroke="#6e737a" stroke-width="6" fill="none"/>
    <rect x="80" y="1720" width="300" height="120" fill="#e8c77a" stroke="{K}" stroke-width="7"/><rect x="60" y="1700" width="340" height="30" fill="#8a5a33" stroke="{K}" stroke-width="6"/>
    {"".join(f'<circle cx="{random.randint(80, 1000)}" cy="{random.randint(1060, 1880)}" r="5" fill="#d6dde4"/>' for _ in range(30))}
    {pigeons}
  </svg>
'''
for n, s in (("ostanovka", ostanovka), ("lift", lift), ("golubyatnya", golubyatnya)): open(f"bg_{n}.svg.part", "w").write(s)
print("ok")
