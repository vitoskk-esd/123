# python3 gen_bgs37.py → новые фоны для «Толян: со ста тысяч», часть 9 «Машина директора»:
# bg_kabdir (кабинет директора: флаг, портрет-герб, книжный шкаф, большой стол с зелёным сукном, дисковый телефон, грамоты),
# bg_garazh (школьный гараж-хозблок изнутри: кирпич, полки с банками, отрывной календарь 1994, лампа на проводе, чехол — машина под ним — отдельным слоем),
# bg_stadion (школьный стадион: беговая дорожка, трибуны, футбольные ворота, табло, школа вдали),
# bg_dvordir (задний двор частного дома директора: кирпичный дом, открытые ворота, гараж, беседка с мангалом, грядки — финал, владелец 12.11)
import random
K = "#000"
random.seed(49)
HEAD = '  <svg id="bg" width="1080" height="1920" viewBox="0 0 1080 1920" style="position:absolute;left:0;top:0">\n'
F = 'font-family="Unbounded" font-weight="900"'
M = 'font-family="JetBrains Mono" font-weight="800"'

kabdir = HEAD + f'''    <rect width="1080" height="1920" fill="#e9dcc0"/>
    <g stroke="#dccba8" stroke-width="3">{"".join(f'<path d="M{x} 0 V1000"/>' for x in range(30, 1080, 50))}</g>
    <!-- флаг и герб -->
    <g><path d="M90 1000 V300" stroke="#8a929b" stroke-width="10"/><path d="M96 310 q60 20 120 0 v150 q-60 20 -120 0 z" fill="#fff" stroke="{K}" stroke-width="4"/>
      <path d="M96 360 q60 20 120 0 v50 q-60 20 -120 0 z" fill="#2f6db5"/><path d="M96 410 q60 20 120 0 v50 q-60 20 -120 0 z" fill="#c0392b"/></g>
    <g><rect x="380" y="200" width="320" height="230" fill="#f4efe2" stroke="#8a6d48" stroke-width="12"/><circle cx="540" cy="315" r="70" fill="#ffd23f" stroke="{K}" stroke-width="5"/>
      <text x="540" y="332" text-anchor="middle" {F} font-size="40" fill="#c0392b">№ 12</text></g>
    <!-- грамоты -->
    {"".join(f'<g transform="rotate({r} {x + 70} {y + 50})"><rect x="{x}" y="{y}" width="140" height="100" fill="#fffdf4" stroke="#c9a24a" stroke-width="6"/><rect x="{x + 20}" y="{y + 20}" width="100" height="10" fill="#c0392b"/><rect x="{x + 20}" y="{y + 45}" width="80" height="8" fill="#9aa3ad"/><rect x="{x + 20}" y="{y + 62}" width="90" height="8" fill="#9aa3ad"/></g>' for x, y, r in [(260, 480, -2), (440, 470, 1), (620, 485, -1)])}
    <!-- шкаф с папками -->
    <g><rect x="790" y="180" width="260" height="820" fill="#7a522b" stroke="{K}" stroke-width="8"/><path d="M790 440 H1050 M790 700 H1050" stroke="{K}" stroke-width="6"/>
      {"".join(f'<rect x="{x}" y="{y}" width="34" height="210" fill="{c}" stroke="{K}" stroke-width="3"/>' for y in (215, 475) for x, c in zip(range(806, 1040, 40), ["#2f6db5", "#c0392b", "#4f9d48", "#e8a33a", "#6b4a8a", "#2f6db5"]))}</g>
    <!-- пол и стол директора -->
    <rect y="1000" width="1080" height="920" fill="#8c5f3a"/><path d="M0 1000 H1080" stroke="{K}" stroke-width="7"/>
    <g stroke="#7a522b" stroke-width="5">{"".join(f'<path d="M0 {y} H1080"/>' for y in range(1070, 1920, 80))}</g>
    <!-- стол директора — у стены, на заднем плане (владелец 12.11: «директор стоит прямо на столе»), герои стоят перед ним -->
    <g><rect x="300" y="900" width="480" height="34" fill="#5b3a1e" stroke="{K}" stroke-width="6"/><rect x="318" y="892" width="444" height="12" fill="#2f6b3a" stroke="{K}" stroke-width="3"/>
      <rect x="318" y="934" width="90" height="150" fill="#5b3a1e" stroke="{K}" stroke-width="5"/><rect x="672" y="934" width="90" height="150" fill="#5b3a1e" stroke="{K}" stroke-width="5"/>
      <path d="M360 892 q0 -28 22 -34 h56 q22 6 22 34 z" fill="#151515" stroke="{K}" stroke-width="3"/><circle cx="410" cy="872" r="12" fill="#e8ecf0" stroke="{K}" stroke-width="2"/>
      <rect x="560" y="862" width="110" height="30" fill="#fff" stroke="{K}" stroke-width="3"/><rect x="574" y="848" width="82" height="14" fill="#f4efe2" stroke="{K}" stroke-width="2"/>
      <path d="M520 930 l-30 150 M560 930 l30 150" stroke="none"/></g>
    <!-- кресло за столом -->
    <path d="M500 892 v-120 q40 -30 80 0 v120" fill="#3b2a1a" stroke="{K}" stroke-width="5"/>
  </svg>
'''

garazh = HEAD + f'''    <rect width="1080" height="1920" fill="#7a5e4a"/>
    <!-- кирпич -->
    {"".join(f'<rect x="{x + (r % 2) * 40}" y="{120 + r * 40}" width="78" height="36" fill="{random.choice(["#8a5a3f", "#94634a", "#7f523a"])}" stroke="#5b3a2a" stroke-width="3"/>' for r in range(22) for x in range(-40, 1080, 80))}
    <!-- полки с банками и инструментом -->
    <g><rect x="40" y="300" width="300" height="20" fill="#6b4a2b" stroke="{K}" stroke-width="5"/><rect x="40" y="470" width="300" height="20" fill="#6b4a2b" stroke="{K}" stroke-width="5"/>
      {"".join(f'<rect x="{x}" y="{y}" width="44" height="64" rx="8" fill="{c}" stroke="{K}" stroke-width="4"/>' for (x, y, c) in [(60, 236, "#c9dbe8"), (120, 236, "#e8c77a"), (180, 236, "#c9dbe8"), (250, 236, "#c0392b"), (70, 406, "#4f9d48"), (150, 406, "#e8c77a"), (230, 406, "#c9dbe8")])}</g>
    <!-- отрывной календарь 1994 -->
    <g><rect x="780" y="260" width="200" height="250" fill="#fff" stroke="{K}" stroke-width="6"/><rect x="780" y="260" width="200" height="60" fill="#c0392b"/>
      <text x="880" y="302" text-anchor="middle" {F} font-size="34" fill="#fff">1994</text><text x="880" y="430" text-anchor="middle" {F} font-size="96" fill="#151515">12</text>
      <text x="880" y="480" text-anchor="middle" {M} font-size="24" fill="#151515">МАЯ</text></g>
    <!-- лампа на проводе -->
    <path d="M540 0 V260" stroke="#151515" stroke-width="5"/><path d="M490 300 q50 -60 100 0 z" fill="#3b3f46" stroke="{K}" stroke-width="5"/>
    <circle cx="540" cy="306" r="18" fill="#fff6c8" style="filter:drop-shadow(0 0 22px #fff2c0)"/>
    <path d="M540 310 L200 1000 L880 1000 Z" fill="#fff6c8" opacity=".12"/>
    <!-- бетонный пол с пятном масла -->
    <rect y="1000" width="1080" height="920" fill="#8a8f96"/><path d="M0 1000 H1080" stroke="{K}" stroke-width="7"/>
    <ellipse cx="560" cy="1520" rx="170" ry="34" fill="#4a4e55" opacity=".6"/>
    {"".join(f'<path d="M{random.randint(20, 1060)} {random.randint(1040, 1900)} l{random.randint(-40, 40)} {random.randint(10, 30)}" stroke="#6e737a" stroke-width="4"/>' for _ in range(20))}
  </svg>
'''

stadion = HEAD + f'''    <rect width="1080" height="1920" fill="#cde7f7"/><ellipse cx="760" cy="150" rx="160" ry="38" fill="#fff" opacity=".9"/>
    <!-- школа вдали и трибуны -->
    <rect x="600" y="360" width="460" height="300" fill="#f2d16b" stroke="{K}" stroke-width="7"/>
    {"".join(f'<rect x="{x}" y="{y}" width="60" height="70" fill="#9fc3e0" stroke="{K}" stroke-width="4"/>' for x in range(630, 1040, 90) for y in (390, 500))}
    <g>{"".join(f'<rect x="20" y="{560 + i * 40}" width="{520 - i * 10}" height="40" fill="{["#2f6db5", "#c0392b", "#2f6db5", "#c0392b", "#2f6db5"][i]}" stroke="{K}" stroke-width="5"/>' for i in range(5))}</g>
    <!-- табло -->
    <g><rect x="680" y="690" width="320" height="120" rx="10" fill="#151515" stroke="{K}" stroke-width="6"/><text x="840" y="768" text-anchor="middle" {M} font-size="48" fill="#ff3b30">8 «А» 3:2</text></g>
    <!-- газон и беговая дорожка -->
    <rect y="820" width="1080" height="1100" fill="#7fbf5a"/><path d="M0 820 H1080" stroke="{K}" stroke-width="6"/>
    <rect y="900" width="1080" height="200" fill="#c0603a"/><g stroke="#fff" stroke-width="5">{"".join(f'<path d="M0 {y} H1080"/>' for y in (940, 980, 1020, 1060))}</g>
    <path d="M0 900 H1080 M0 1100 H1080" stroke="{K}" stroke-width="6"/>
    <!-- ворота -->
    <g><path d="M700 1500 V1260 H1040 V1500" fill="none" stroke="#fff" stroke-width="12"/><g stroke="#e8ecf0" stroke-width="3">{"".join(f'<path d="M{x} 1260 V1500"/>' for x in range(720, 1040, 24))}{"".join(f'<path d="M700 {y} H1040"/>' for y in range(1280, 1500, 24))}</g></g>
    <circle cx="420" cy="1700" r="40" fill="#fff" stroke="{K}" stroke-width="5"/><path d="M400 1690 l20 -14 l20 14 l-8 22 h-24 z" fill="#151515"/>
  </svg>
'''
dvordir = HEAD + f'''    <rect width="1080" height="1920" fill="#d7ecf7"/><ellipse cx="230" cy="140" rx="160" ry="40" fill="#fff" opacity=".9"/>
    <!-- задняя стена дома: кирпич, окна, крыльцо -->
    <rect x="0" y="300" width="640" height="700" fill="#c97b5a" stroke="{K}" stroke-width="8"/>
    <g stroke="#b06a4c" stroke-width="3">{"".join(f'<path d="M0 {y} H640"/>' for y in range(340, 1000, 36))}</g>
    <path d="M-20 310 L320 120 L660 310 Z" fill="#4a5a6a" stroke="{K}" stroke-width="8" stroke-linejoin="round"/>
    {"".join(f'<rect x="{x}" y="420" width="150" height="170" fill="#bfe0f5" stroke="{K}" stroke-width="6"/><path d="M{x + 75} 420 v170" stroke="{K}" stroke-width="4"/>' for x in (70, 400))}
    <rect x="250" y="700" width="130" height="300" fill="#6b4a2b" stroke="{K}" stroke-width="6"/><rect x="220" y="960" width="190" height="40" fill="#9aa3ad" stroke="{K}" stroke-width="5"/>
    <!-- гараж и открытые ворота -->
    <g><rect x="640" y="520" width="440" height="480" fill="#d9c7a7" stroke="{K}" stroke-width="7"/><rect x="690" y="600" width="340" height="400" fill="#3b3f46" stroke="{K}" stroke-width="6"/>
      {"".join(f'<path d="M690 {y} H1030" stroke="#2b2f37" stroke-width="5"/>' for y in range(640, 1000, 40))}<text x="860" y="575" text-anchor="middle" {M} font-size="22" fill="#151515">ГАРАЖ</text></g>
    <!-- беседка с мангалом -->
    <g><path d="M40 1000 V820 M300 1000 V820" stroke="#6b4a2b" stroke-width="14"/><path d="M10 830 L170 740 L330 830 Z" fill="#8a5a33" stroke="{K}" stroke-width="7"/>
      <rect x="90" y="920" width="160" height="50" fill="#2b2b2e" stroke="{K}" stroke-width="5"/><path d="M110 970 v30 M230 970 v30" stroke="#2b2b2e" stroke-width="8"/>
      {"".join(f'<path d="M{x} 900 q8 -24 0 -46" stroke="#cfd8df" stroke-width="5" fill="none" opacity=".8"/>' for x in (130, 170, 210))}</g>
    <!-- двор: плитка-дорожка к гаражу, газон, грядки -->
    <rect y="1000" width="1080" height="920" fill="#7fb05a"/><path d="M0 1000 H1080" stroke="{K}" stroke-width="7"/>
    <path d="M600 1000 L1080 1000 L1080 1920 L380 1920 Z" fill="#b9b2a6" stroke="{K}" stroke-width="5"/>
    <g stroke="#9a938a" stroke-width="4">{"".join(f'<path d="M{600 - (y - 1000) * .24:.0f} {y} H1080"/>' for y in range(1080, 1920, 90))}</g>
    {"".join(f'<rect x="{x}" y="{y}" width="260" height="70" rx="10" fill="#6b4a2b" stroke="{K}" stroke-width="5"/>' + "".join(f'<path d="M{x + 20 + i * 40} {y + 10} q10 -30 20 0" stroke="#4f9d48" stroke-width="7" fill="none"/>' for i in range(6)) for x, y in [(40, 1600), (40, 1740)])}
  </svg>
'''
for n, s in (("kabdir", kabdir), ("garazh", garazh), ("stadion", stadion), ("dvordir", dvordir)): open(f"bg_{n}.svg.part", "w").write(s)
print("ok")
