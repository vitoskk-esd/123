# python3 gen_bgs25.py → новые фоны для «Толян: со ста тысяч», часть 5 «Бот против бота» (каждая серия — новые фоны):
# bg_pekarnya (пекарня утром: витрина с булками и круассанами, касса, меловое меню, окно с рассветом), bg_prospekt (проспект в пробке: ряд машин,
# светофор, рекламный щит, высотки), bg_chastnik (частный сектор: деревянный дом с наличниками, ворота, будка, коробки «переезд»),
# bg_kampus (кампус университета: корпус с колоннами, часы, лестница, деревья, вывеска «УНИВЕРСИТЕТ»)
import random
K = "#000"
random.seed(39)
HEAD = '  <svg id="bg" width="1080" height="1920" viewBox="0 0 1080 1920" style="position:absolute;left:0;top:0">\n'
F = 'font-family="Unbounded" font-weight="900"'
M = 'font-family="JetBrains Mono" font-weight="800"'

buns = "".join(f'<ellipse cx="{x}" cy="{y}" rx="{rx}" ry="{ry}" fill="{c}" stroke="{K}" stroke-width="4"/>' for x, y, rx, ry, c in
               [(150, 770, 46, 26, "#d9963f"), (250, 772, 46, 26, "#c97f2e"), (350, 770, 46, 26, "#d9963f"), (170, 860, 50, 22, "#e8b25a"),
                (280, 862, 50, 22, "#e8b25a"), (390, 860, 50, 22, "#c97f2e"), (650, 770, 60, 24, "#b8692a"), (780, 772, 60, 24, "#b8692a")])
pekarnya = HEAD + f'''    <rect width="1080" height="1920" fill="#f4e3c8"/>
    <g stroke="#e8d3b0" stroke-width="5">{"".join(f'<path d="M0 {y} H1080"/>' for y in range(60, 640, 80))}</g>
    <!-- окно с рассветом -->
    <g><rect x="60" y="160" width="380" height="380" rx="20" fill="#ffb37a" stroke="{K}" stroke-width="8"/><circle cx="250" cy="470" r="70" fill="#ffe07a"/>
      <rect x="60" y="440" width="380" height="100" fill="#8a7a9a" opacity=".7"/><path d="M250 160 v380 M60 350 h380" stroke="{K}" stroke-width="7"/></g>
    <!-- меловое меню -->
    <g><rect x="540" y="160" width="480" height="380" rx="14" fill="#2b3a2f" stroke="#8a5a33" stroke-width="16"/>
      <text x="780" y="230" text-anchor="middle" {F} font-size="40" fill="#fff">ПЕКАРНЯ</text>
      {"".join(f'<text x="580" y="{300 + i * 60}" font-family="Unbounded" font-weight="800" font-size="28" fill="#f4e3c8">{n}</text><text x="990" y="{300 + i * 60}" text-anchor="end" {M} font-size="30" fill="#ffd23f">{p}</text>' for i, (n, p) in enumerate([("КРУАССАН", "120"), ("БУЛКА С МАКОМ", "70"), ("КОФЕ", "150"), ("ЧАЙ", "60")]))}</g>
    <!-- витрина -->
    <g><rect x="60" y="680" width="820" height="260" rx="16" fill="#dff3f6" opacity=".9" stroke="{K}" stroke-width="8"/><path d="M60 820 h820" stroke="#9aa3ad" stroke-width="6"/>{buns}
      <rect x="40" y="940" width="1000" height="60" fill="#8a5a33" stroke="{K}" stroke-width="7"/>
      <rect x="900" y="800" width="140" height="140" rx="12" fill="#2b2f37" stroke="{K}" stroke-width="6"/><rect x="920" y="820" width="100" height="50" fill="#4cd964"/></g>
    <!-- пол — плитка шахматкой -->
    <rect y="1000" width="1080" height="920" fill="#c9a77a"/><path d="M0 1000 H1080" stroke="{K}" stroke-width="7"/>
    <g fill="#b38f62">{"".join(f'<rect x="{x}" y="{y}" width="90" height="90"/>' for y in range(1000, 1920, 90) for x in range(((y - 1000) // 90 % 2) * 90, 1080, 180))}</g>
  </svg>
'''

cars = "".join(f'<g><rect x="{x}" y="{y}" width="{w}" height="70" rx="22" fill="{c}" stroke="{K}" stroke-width="6"/><path d="M{x + 30} {y} l26 -40 h{w - 120} l26 40" fill="{c}" stroke="{K}" stroke-width="6"/>'
               f'<path d="M{x + 60} {y - 4} l18 -28 h{w - 160} l18 28 z" fill="#9fc3e0"/><circle cx="{x + 46}" cy="{y + 70}" r="22" fill="#151515"/><circle cx="{x + w - 46}" cy="{y + 70}" r="22" fill="#151515"/>'
               f'<rect x="{x + w - 16}" y="{y + 16}" width="16" height="16" fill="#ff3b30"/></g>' for x, y, w, c in [(-60, 920, 300, "#e8ecf0"), (280, 930, 280, "#ffd23f"), (600, 920, 300, "#2e86de"), (930, 928, 260, "#c0392b")])
prospekt = HEAD + f'''    <rect width="1080" height="1920" fill="#c8dcef"/>
    {"".join(f'<g><rect x="{x}" y="{y}" width="{w}" height="{900 - y}" fill="{c}" stroke="{K}" stroke-width="7"/>' + "".join(f'<rect x="{x + 18 + i * 44}" y="{yy}" width="26" height="34" fill="#fff6c8" opacity=".8"/>' for i in range((w - 20) // 44) for yy in range(y + 24, 870, 60)) + '</g>' for x, y, w, c in [(0, 200, 260, "#9aa7b8"), (300, 120, 220, "#b8c2cf"), (560, 260, 230, "#8b98aa"), (830, 160, 250, "#a9b4c2")])}
    <!-- рекламный щит -->
    <g><path d="M540 900 V700" stroke="#2b2f37" stroke-width="18"/><rect x="330" y="520" width="420" height="190" fill="#ff7a1a" stroke="{K}" stroke-width="8"/>
      <text x="540" y="600" text-anchor="middle" {F} font-size="44" fill="#fff">ШИНЫ −20%</text><text x="540" y="665" text-anchor="middle" {M} font-size="30" fill="#151515">ПР. МИРА, 12</text></g>
    <!-- светофор -->
    <g><path d="M980 1000 V560" stroke="#2b2f37" stroke-width="16"/><rect x="940" y="420" width="80" height="200" rx="14" fill="#151515" stroke="{K}" stroke-width="5"/>
      <circle cx="980" cy="460" r="24" fill="#ff3b30" style="filter:drop-shadow(0 0 12px #ff3b30)"/><circle cx="980" cy="520" r="24" fill="#4a3a10"/><circle cx="980" cy="580" r="24" fill="#0f3a1a"/></g>
    <!-- асфальт с пробкой -->
    <rect y="900" width="1080" height="1020" fill="#4d535b"/><path d="M0 900 H1080" stroke="{K}" stroke-width="7"/>
    {cars}
    <g stroke="#e8ecf0" stroke-width="10" stroke-dasharray="80 60"><path d="M0 1100 H1080"/><path d="M0 1520 H1080"/></g>
  </svg>
'''

chastnik = HEAD + f'''    <rect width="1080" height="1920" fill="#cfe6f5"/><ellipse cx="820" cy="200" rx="150" ry="40" fill="#fff" opacity=".85"/>
    <!-- деревянный дом с наличниками -->
    <g><rect x="120" y="440" width="560" height="460" fill="#a0683a" stroke="{K}" stroke-width="8"/>
      <g stroke="#7a4e2a" stroke-width="6">{"".join(f'<path d="M120 {y} H680"/>' for y in range(480, 900, 40))}</g>
      <path d="M90 450 L400 220 L710 450 Z" fill="#5a6b7a" stroke="{K}" stroke-width="8"/>
      {"".join(f'<g><rect x="{x}" y="560" width="120" height="160" fill="#9fc3e0" stroke="{K}" stroke-width="6"/><path d="M{x + 60} 560 v160 M{x} 640 h120" stroke="{K}" stroke-width="4"/><path d="M{x - 16} 560 l76 -40 l76 40 z" fill="#f4f6f8" stroke="{K}" stroke-width="5"/><rect x="{x - 16}" y="720" width="152" height="20" fill="#f4f6f8" stroke="{K}" stroke-width="5"/></g>' for x in (190, 470))}</g>
    <!-- ворота и забор -->
    <g><rect x="700" y="600" width="360" height="400" fill="#2e7d4f" stroke="{K}" stroke-width="8"/><path d="M880 600 v400" stroke="{K}" stroke-width="6"/>
      {"".join(f'<path d="M{x} 600 v400" stroke="#24643f" stroke-width="5"/>' for x in range(730, 1060, 30))}
      <rect x="860" y="560" width="200" height="40" fill="#fff" stroke="{K}" stroke-width="5"/><text x="960" y="590" text-anchor="middle" {F} font-size="24" fill="#151515">ул. Садовая, 9</text></g>
    <!-- будка и коробки «переезд» -->
    <g><path d="M30 1000 v-120 l70 -50 l70 50 v120 z" fill="#8a5a33" stroke="{K}" stroke-width="6"/><path d="M75 1000 v-60 q25 -30 50 0 v60" fill="#151515"/></g>
    {"".join(f'<g><rect x="{x}" y="{y}" width="{w}" height="{h}" fill="#c9a06b" stroke="{K}" stroke-width="5"/><path d="M{x} {y + 20} h{w}" stroke="#a07a48" stroke-width="5"/></g>' for x, y, w, h in [(560, 900, 120, 100), (600, 820, 90, 80)])}
    <text x="645" y="960" text-anchor="middle" {F} font-size="18" fill="#151515">ПЕРЕЕЗД</text>
    <!-- грунтовка и трава -->
    <rect y="1000" width="1080" height="920" fill="#9a8a6a"/><path d="M0 1000 H1080" stroke="{K}" stroke-width="7"/><rect y="1000" width="1080" height="50" fill="#7fbf5a"/>
    {"".join(f'<ellipse cx="{random.randint(60, 1020)}" cy="{random.randint(1120, 1880)}" rx="{random.randint(60, 150)}" ry="{random.randint(10, 22)}" fill="#86775a" opacity=".8"/>' for _ in range(9))}
  </svg>
'''

kampus = HEAD + f'''    <rect width="1080" height="1920" fill="#d6e9f7"/>
    <!-- корпус с колоннами -->
    <g><rect x="60" y="300" width="960" height="560" fill="#efe4cf" stroke="{K}" stroke-width="8"/><path d="M40 310 L540 140 L1040 310 Z" fill="#e2d3b5" stroke="{K}" stroke-width="8"/>
      <circle cx="540" cy="240" r="46" fill="#fff" stroke="{K}" stroke-width="6"/><path d="M540 240 v-30 M540 240 h22" stroke="{K}" stroke-width="5"/>
      <rect x="240" y="320" width="600" height="70" fill="#1f4fb8" stroke="{K}" stroke-width="6"/><text x="540" y="370" text-anchor="middle" {F} font-size="40" fill="#fff">УНИВЕРСИТЕТ</text>
      {"".join(f'<g><rect x="{x}" y="400" width="50" height="460" fill="#f8f2e4" stroke="{K}" stroke-width="6"/><rect x="{x - 10}" y="390" width="70" height="20" fill="#e2d3b5" stroke="{K}" stroke-width="5"/></g>' for x in range(140, 1000, 140))}
      <rect x="470" y="660" width="140" height="200" fill="#6b4a2a" stroke="{K}" stroke-width="7"/></g>
    <!-- лестница -->
    {"".join(f'<rect x="{300 - i * 40}" y="{860 + i * 46}" width="{480 + i * 80}" height="46" fill="#c9ced4" stroke="{K}" stroke-width="5"/>' for i in range(3))}
    <!-- деревья -->
    {"".join(f'<g><path d="M{x} 1000 V780" stroke="#6b4a2a" stroke-width="24"/><circle cx="{x}" cy="740" r="100" fill="#e0943a" stroke="{K}" stroke-width="7"/></g>' for x in (70, 1010))}
    <!-- площадь, плитка -->
    <rect y="1000" width="1080" height="920" fill="#b9b2a6"/><path d="M0 1000 H1080" stroke="{K}" stroke-width="7"/>
    <g stroke="#a59e92" stroke-width="5">{"".join(f'<path d="M0 {y} H1080"/>' for y in range(1100, 1920, 100))}{"".join(f'<path d="M{x} 1000 V1920"/>' for x in range(0, 1080, 135))}</g>
    {"".join(f'<ellipse cx="{random.randint(60, 1020)}" cy="{random.randint(1050, 1250)}" rx="14" ry="8" fill="#e0943a"/>' for _ in range(14))}
  </svg>
'''
for n, s in (("pekarnya", pekarnya), ("prospekt", prospekt), ("chastnik", chastnik), ("kampus", kampus)): open(f"bg_{n}.svg.part", "w").write(s)
print("ok")
