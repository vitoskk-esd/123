# python3 gen_bgs9.py → фоны одиннадцатого набора (ep23 «Первая цена»):
# bg_kitchen (кухня бабы Гали утром: ковёр, сервант, окно с геранью, отрывной календарь, холодильник с магнитами),
# bg_hq (штаб перекупов в подвале: стена мониторов с лентой объявлений, карта города, коробки пиццы, красная лампа),
# bg_minibus (салон маршрутки днём: поручни, окна с бегущим городом, таблички)
import random
K = "#000"
random.seed(23)
HEAD = '  <svg id="bg" width="1080" height="1920" viewBox="0 0 1080 1920" style="position:absolute;left:0;top:0">\n'

# ---------- кухня бабы Гали
carpet = "".join(f'<rect x="{x}" y="{y}" width="40" height="40" fill="{c}" transform="rotate(45 {x + 20} {y + 20})"/>'
                 for i, x in enumerate(range(90, 470, 56)) for j, y in enumerate(range(330, 700, 56)) for c in [("#c0392b", "#f4d03f", "#1d6fa5")[(i + j) % 3]])
magnets = "".join(f'<rect x="{x}" y="{y}" width="34" height="26" rx="5" fill="{c}" stroke="{K}" stroke-width="3" transform="rotate({r} {x} {y})"/>'
                  for x, y, c, r in [(860, 760, "#ff3b30", -8), (930, 800, "#ffd23f", 6), (880, 860, "#4cd964", 3), (950, 900, "#2e86de", -5), (870, 960, "#ff7ab8", 9)])
kitchen = HEAD + f'''    <rect width="1080" height="1920" fill="#f3e3c3"/>
    <g opacity=".35" fill="#d9b98a">{"".join(f'<circle cx="{x}" cy="{y}" r="7"/>' for x in range(30, 1080, 70) for y in range(40, 1180, 70))}</g>
    <!-- ковёр на стене -->
    <rect x="60" y="300" width="440" height="430" rx="10" fill="#8e1b1b" stroke="{K}" stroke-width="8"/>
    <rect x="80" y="320" width="400" height="390" fill="#a62222"/><g opacity=".9">{carpet}</g>
    <rect x="80" y="320" width="400" height="390" fill="none" stroke="#f4d03f" stroke-width="10"/>
    <!-- окно с геранью -->
    <rect x="560" y="260" width="300" height="420" fill="#bfe3ff" stroke="#fff" stroke-width="18"/><path d="M710 260 V680 M560 470 H860" stroke="#fff" stroke-width="14"/>
    <rect x="560" y="260" width="300" height="420" fill="none" stroke="{K}" stroke-width="6"/>
    <circle cx="640" cy="360" r="40" fill="#fff" opacity=".7"/><rect x="580" y="560" width="120" height="110" fill="#9ccc65" opacity=".6"/>
    <rect x="540" y="680" width="340" height="30" fill="#fff" stroke="{K}" stroke-width="6"/>
    <g><rect x="600" y="620" width="70" height="60" fill="#c0612b" stroke="{K}" stroke-width="5"/>{"".join(f'<circle cx="{x}" cy="{y}" r="16" fill="#ff3b5c" stroke="{K}" stroke-width="4"/>' for x, y in [(612, 590), (640, 574), (666, 594), (628, 604)])}</g>
    <g><rect x="740" y="620" width="70" height="60" fill="#c0612b" stroke="{K}" stroke-width="5"/>{"".join(f'<circle cx="{x}" cy="{y}" r="16" fill="#ff7ab8" stroke="{K}" stroke-width="4"/>' for x, y in [(752, 590), (780, 574), (806, 594), (768, 604)])}</g>
    <!-- отрывной календарь -->
    <g><rect x="900" y="300" width="130" height="170" fill="#fff" stroke="{K}" stroke-width="6"/><rect x="900" y="300" width="130" height="40" fill="#ff3b30" stroke="{K}" stroke-width="6"/>
      <text x="965" y="420" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="72" fill="#151515">4</text><text x="965" y="458" text-anchor="middle" font-family="Onest" font-weight="700" font-size="22">ноября</text></g>
    <!-- холодильник «ЗИЛ» -->
    <rect x="820" y="720" width="220" height="560" rx="30" fill="#f7f7f2" stroke="{K}" stroke-width="8"/><path d="M820 920 H1040" stroke="{K}" stroke-width="6"/>
    <rect x="1000" y="760" width="16" height="120" rx="8" fill="#c9ced6" stroke="{K}" stroke-width="4"/>{magnets}
    <text x="930" y="1080" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="30" fill="#c0392b">ЗиЛ</text>
    <!-- сервант -->
    <rect x="60" y="760" width="360" height="520" fill="#7a4a24" stroke="{K}" stroke-width="8"/><rect x="84" y="784" width="312" height="230" fill="#cfe8f5" stroke="{K}" stroke-width="6"/>
    <path d="M240 784 V1014" stroke="{K}" stroke-width="6"/>
    {"".join(f'<path d="M{x} 990 q0 -50 22 -60 q22 10 22 60 z" fill="#fff" stroke="{K}" stroke-width="4"/><circle cx="{x + 22}" cy="922" r="10" fill="#e74c3c" opacity=".7"/>' for x in (100, 160, 260, 320))}
    {"".join(f'<ellipse cx="{x}" cy="880" rx="30" ry="34" fill="#fff" stroke="{K}" stroke-width="4"/><circle cx="{x}" cy="880" r="14" fill="#2e86de" opacity=".6"/>' for x in (130, 200, 290, 360))}
    <!-- стена/пол -->
    <rect y="1280" width="1080" height="640" fill="#c8a06a"/><path d="M0 1280 H1080" stroke="{K}" stroke-width="8"/>
    <g stroke="#a67c4a" stroke-width="4">{"".join(f'<path d="M0 {y} H1080"/>' for y in range(1360, 1920, 90))}</g>
    <!-- стол с клеёнкой в клетку, чайник -->
    <rect x="300" y="1240" width="520" height="40" fill="#fff" stroke="{K}" stroke-width="6"/>
    <g opacity=".85">{"".join(f'<rect x="{x}" y="1240" width="26" height="40" fill="#e74c3c"/>' for x in range(300, 820, 52))}</g>
    <path d="M330 1280 V1520 M790 1280 V1520" stroke="#7a4a24" stroke-width="20"/>
    <g><ellipse cx="700" cy="1196" rx="70" ry="50" fill="#e74c3c" stroke="{K}" stroke-width="6"/>{"".join(f'<circle cx="{x}" cy="1190" r="8" fill="#fff"/>' for x in (670, 700, 730))}
      <path d="M760 1186 l46 -24" stroke="{K}" stroke-width="10" stroke-linecap="round"/><path d="M660 1150 q40 -40 80 0" stroke="{K}" stroke-width="8" fill="none"/></g>
  </svg>
'''

# ---------- штаб перекупов
feed = ["BMW X5 · 2,1 млн", "Солярис · 690 т.", "Приора · 210 т.", "Камри · 1,9 млн", "Гранта · 540 т.", "Октавия · 1,1 млн", "Рио · 820 т.", "Логан · 450 т."]
mons = "".join(f'''<g><rect x="{x}" y="{y}" width="300" height="190" rx="10" fill="#0d1a12" stroke="#2b2f37" stroke-width="12"/>
      {"".join(f'<rect x="{x + 16}" y="{y + 16 + k * 42}" width="268" height="32" rx="5" fill="#16301f"/><text x="{x + 28}" y="{y + 39 + k * 42}" font-family="JetBrains Mono" font-weight="800" font-size="18" fill="#4cd964">{feed[(i * 2 + k) % len(feed)]}</text>' for k in range(4))}</g>'''
               for i, (x, y) in enumerate([(40, 250), (390, 250), (740, 250), (40, 480), (390, 480), (740, 480)]))
hq = HEAD + f'''    <rect width="1080" height="1920" fill="#1b1d22"/>
    <g stroke="#262931" stroke-width="5">{"".join(f'<path d="M0 {y} H1080"/>' for y in range(60, 1100, 70))}{"".join(f'<path d="M{x + (y // 70 % 2) * 60} {y} V{y + 70}"/>' for y in range(60, 1100, 70) for x in range(0, 1080, 120))}</g>
    <!-- красная лампа-маячок -->
    <path d="M540 0 V120" stroke="#111" stroke-width="5"/><path d="M500 120 h80 l-10 50 h-60 z" fill="#ff3b30" stroke="{K}" stroke-width="6"/><circle cx="540" cy="200" r="240" fill="#ff3b30" opacity=".10"/>
    <!-- стена мониторов -->
    {mons}
    <!-- карта города с флажками -->
    <g><rect x="40" y="720" width="460" height="300" fill="#e9e2c8" stroke="{K}" stroke-width="8"/>
      <path d="M60 860 q120 -60 220 0 t200 -20 M180 730 q20 140 -30 280 M360 740 q-30 150 40 270" stroke="#9fc5e8" stroke-width="16" fill="none"/>
      {"".join(f'<path d="M{x} {y} v-46 l30 12 l-30 12" fill="#ff3b30" stroke="{K}" stroke-width="4"/><circle cx="{x}" cy="{y}" r="6" fill="{K}"/>' for x, y in [(120, 820), (240, 960), (330, 800), (430, 920), (200, 880)])}
      <text x="270" y="1008" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="22" fill="#151515">ЗОНА ВЫКУПА</text></g>
    <!-- доска «план» -->
    <g><rect x="560" y="720" width="480" height="300" fill="#f4f6f8" stroke="{K}" stroke-width="8"/>
      <text x="800" y="776" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="34" fill="#151515">ПЛАН НА ДЕНЬ</text>
      <text x="600" y="840" font-family="Onest" font-weight="800" font-size="30" fill="#1d4fb8">1. Звонить ПЕРВЫМ</text>
      <text x="600" y="890" font-family="Onest" font-weight="800" font-size="30" fill="#1d4fb8">2. «Я не перекуп»</text>
      <text x="600" y="940" font-family="Onest" font-weight="800" font-size="30" fill="#1d4fb8">3. Минус 50% сразу</text>
      <text x="600" y="990" font-family="Onest" font-weight="800" font-size="30" fill="#ff3b30">4. Не моргать</text></g>
    <!-- стол -->
    <rect y="1100" width="1080" height="820" fill="#2a2d34"/><path d="M0 1100 H1080" stroke="{K}" stroke-width="8"/>
    <rect x="0" y="1300" width="1080" height="60" fill="#5d4a3a" stroke="{K}" stroke-width="7"/>
    {"".join(f'<g transform="rotate({r} {x} 1290)"><rect x="{x - 90}" y="1270" width="180" height="24" fill="#d9a35b" stroke="{K}" stroke-width="5"/><text x="{x}" y="1289" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="15" fill="#7a3b12">ПИЦЦА</text></g>' for x, r in [(140, -4), (900, 5)])}
    {"".join(f'<g><rect x="{x}" y="1240" width="44" height="58" rx="6" fill="#fff" stroke="{K}" stroke-width="5"/><path d="M{x + 44} 1256 q20 4 0 26" stroke="{K}" stroke-width="5" fill="none"/></g>' for x in (420, 640))}
  </svg>
'''

# ---------- салон маршрутки
city = "".join(f'<rect x="{x}" y="{360 - h}" width="{w}" height="{h + 200}" fill="{c}" stroke="{K}" stroke-width="4"/>'
               for x, w, h, c in [(-20, 160, 120, "#9fb8c8"), (150, 130, 200, "#c6a98a"), (290, 180, 90, "#a7c4a0"), (480, 140, 170, "#d1b3c4"), (630, 200, 110, "#9fb8c8"), (840, 150, 220, "#c6a98a"), (1000, 140, 140, "#a7c4a0")])
minibus = HEAD + f'''    <rect width="1080" height="1920" fill="#e6e1d6"/>
    <!-- окна -->
    <g><rect x="30" y="240" width="1020" height="420" rx="30" fill="#bfe3ff" stroke="{K}" stroke-width="10"/>
      <g opacity=".95">{city}</g><rect x="30" y="560" width="1020" height="100" fill="#8b93a3"/>
      <g fill="#fff" opacity=".6"><path d="M90 260 l-60 150 h40 l60 -150 z M600 260 l-60 150 h30 l60 -150 z"/></g>
      <path d="M370 240 V660 M720 240 V660" stroke="#3a3d46" stroke-width="22"/>
      <rect x="30" y="240" width="1020" height="420" rx="30" fill="none" stroke="{K}" stroke-width="10"/></g>
    <!-- поручень и ручки -->
    <path d="M0 180 H1080" stroke="#c9ced6" stroke-width="22"/><path d="M0 180 H1080" stroke="{K}" stroke-width="4" opacity=".4"/>
    {"".join(f'<g><path d="M{x} 180 V250" stroke="#2b2b2e" stroke-width="8"/><path d="M{x - 24} 250 h48 l-6 40 h-36 z" fill="#ffd23f" stroke="{K}" stroke-width="5"/></g>' for x in (180, 460, 760, 980))}
    <!-- таблички -->
    <g><rect x="60" y="700" width="420" height="120" rx="12" fill="#fff" stroke="{K}" stroke-width="6"/>
      <text x="270" y="752" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="28" fill="#151515">ОСТАНОВКА</text>
      <text x="270" y="796" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="28" fill="#ff3b30">ПО ТРЕБОВАНИЮ</text></g>
    <g><rect x="600" y="700" width="420" height="120" rx="12" fill="#ffd23f" stroke="{K}" stroke-width="6"/>
      <text x="810" y="752" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="28" fill="#151515">ОПЛАТА ПРИ ВХОДЕ</text>
      <text x="810" y="796" text-anchor="middle" font-family="Onest" font-weight="800" font-size="26" fill="#151515">сдачи с 5000 нет</text></g>
    <!-- кресла -->
    <rect y="1100" width="1080" height="820" fill="#3a3d46"/><path d="M0 1100 H1080" stroke="{K}" stroke-width="8"/>
    {"".join(f'<g><rect x="{x}" y="900" width="250" height="420" rx="30" fill="#2b4c7e" stroke="{K}" stroke-width="7"/>'
             f'<g opacity=".45">{"".join(f"<circle cx=\"{x + 30 + k * 40}\" cy=\"{940 + m * 46}\" r=\"6\" fill=\"#ffd23f\"/>" for k in range(5) for m in range(8))}</g>'
             f'<rect x="{x + 20}" y="880" width="210" height="50" rx="20" fill="#24406a" stroke="{K}" stroke-width="6"/></g>' for x in (-40, 780))}
    <g stroke="#c9ced6" stroke-width="16"><path d="M250 180 V1100"/><path d="M830 180 V1100"/></g>
    <g stroke="#1f2228" stroke-width="5">{"".join(f'<path d="M0 {y} H1080"/>' for y in range(1200, 1920, 60))}</g>
  </svg>
'''

for n, s in [("kitchen", kitchen), ("hq", hq), ("minibus", minibus)]:
    open(f"bg_{n}.svg.part", "w").write(s)
print("ok")
