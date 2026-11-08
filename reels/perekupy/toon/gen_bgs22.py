# python3 gen_bgs22.py → новые фоны для «Толян: со ста тысяч», часть 2 «Приора и первая ошибка» (каждая серия — новые фоны):
# bg_barber (барбершоп: кресло, зеркало с лампами, полосатый столб, кирпич), bg_bizpark (парковка бизнес-центра: стеклянный фасад, шлагбаум, «ВЫЕЗД»),
# bg_gibdd (зал регистрации ГИБДД: окна приёма, табло очереди, стулья в ряд, герб-круг), bg_razbor (двор разборки: горы колёс, капоты у забора, кран-балка, «КУПЛЮ АВТО»)
import random
K = "#000"
random.seed(36)
HEAD = '  <svg id="bg" width="1080" height="1920" viewBox="0 0 1080 1920" style="position:absolute;left:0;top:0">\n'
barber = HEAD + f'''    <rect width="1080" height="1920" fill="#3b2f2a"/>
    <g stroke="#2f2521" stroke-width="5">{"".join(f'<path d="M0 {y} H1080"/>' for y in range(60, 1200, 60))}{"".join(f'<path d="M{x + (y // 60 % 2) * 60} {y} v60"/>' for y in range(0, 1200, 60) for x in range(0, 1080, 120))}</g>
    <!-- зеркало с лампами -->
    <g><rect x="420" y="380" width="460" height="560" rx="24" fill="#1d2330" stroke="#c9a20c" stroke-width="14"/><rect x="450" y="410" width="400" height="500" rx="14" fill="#9fb3c8" opacity=".55"/>
      {"".join(f'<circle cx="{x}" cy="{y}" r="16" fill="#ffe6a8" stroke="{K}" stroke-width="4"/>' for x, y in [(420 + i * 92, 370) for i in range(6)] + [(408, 450 + i * 110) for i in range(4)] + [(892, 450 + i * 110) for i in range(4)])}</g>
    <!-- полосатый столб -->
    <g><rect x="140" y="420" width="70" height="420" rx="30" fill="#fff" stroke="{K}" stroke-width="7"/>
      {"".join(f'<path d="M140 {y} l70 -50 v30 l-70 50 z" fill="#d6243a"/>' for y in range(500, 860, 80))}{"".join(f'<path d="M140 {y + 30} l70 -50 v20 l-70 50 z" fill="#2e86de"/>' for y in range(500, 860, 80))}
      <rect x="130" y="400" width="90" height="30" rx="10" fill="#c9a20c" stroke="{K}" stroke-width="5"/><rect x="130" y="830" width="90" height="30" rx="10" fill="#c9a20c" stroke="{K}" stroke-width="5"/></g>
    <!-- полка с флаконами и вывеска -->
    <g><rect x="420" y="960" width="460" height="24" fill="#6b4a2a" stroke="{K}" stroke-width="5"/>{"".join(f'<rect x="{x}" y="900" width="34" height="60" rx="8" fill="{c}" stroke="{K}" stroke-width="4"/>' for x, c in [(450, "#4cd964"), (500, "#ff7a1a"), (550, "#2e86de"), (780, "#c0392b"), (830, "#ffd23f")])}</g>
    <text x="270" y="300" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="54" fill="#ffd23f">BARBER</text>
    <!-- пол — шахматка -->
    <rect y="1180" width="1080" height="740" fill="#e8ecf0"/><path d="M0 1180 H1080" stroke="{K}" stroke-width="7"/>
    <g fill="#2b2b2e">{"".join(f'<rect x="{x}" y="{y}" width="90" height="90"/>' for y in range(1180, 1920, 90) for x in range(((y - 1180) // 90 % 2) * 90, 1080, 180))}</g>
  </svg>
'''
bizpark = HEAD + f'''    <rect width="1080" height="1920" fill="#cfe3f2"/>
    <!-- стеклянный фасад бизнес-центра -->
    <g><rect x="60" y="120" width="960" height="900" fill="#5f8fb5" stroke="{K}" stroke-width="8"/>
      <g stroke="#2b4a66" stroke-width="5">{"".join(f'<path d="M{x} 120 V1020"/>' for x in range(140, 1020, 80))}{"".join(f'<path d="M60 {y} H1020"/>' for y in range(200, 1020, 80))}</g>
      {"".join(f'<rect x="{x + 4}" y="{y + 4}" width="72" height="72" fill="#bfe0f5" opacity="{random.choice([.15, .35, .5])}"/>' for x in range(60, 1020, 80) for y in range(120, 1020, 80))}
      <rect x="400" y="860" width="280" height="160" fill="#2b2f37" stroke="{K}" stroke-width="6"/><rect x="330" y="800" width="420" height="60" fill="#151515" stroke="{K}" stroke-width="5"/>
      <text x="540" y="842" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="34" fill="#fff">БЦ «ГОРИЗОНТ»</text></g>
    <!-- асфальт парковки, разметка, шлагбаум -->
    <rect y="1020" width="1080" height="900" fill="#5b6068"/><path d="M0 1020 H1080" stroke="{K}" stroke-width="8"/>
    <g stroke="#fff" stroke-width="9">{"".join(f'<path d="M{x} 1060 l-60 260"/>' for x in range(160, 1080, 230))}</g>
    <g><rect x="940" y="1000" width="60" height="120" fill="#e8ecf0" stroke="{K}" stroke-width="6"/><path d="M970 1030 H560" stroke="#d6243a" stroke-width="18"/><path d="M600 1030 h60 M720 1030 h60 M840 1030 h60" stroke="#fff" stroke-width="18"/></g>
    <g><rect x="40" y="900" width="200" height="60" rx="10" fill="#1f6b3a" stroke="{K}" stroke-width="5"/><text x="140" y="940" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="26" fill="#fff">ВЫЕЗД →</text></g>
  </svg>
'''
gibdd = HEAD + f'''    <rect width="1080" height="1920" fill="#dfe6ea"/><rect y="0" width="1080" height="160" fill="#c9d3da"/>
    <!-- окна приёма -->
    <g>{"".join(f'<g><rect x="{x}" y="420" width="240" height="380" fill="#b8c6cf" stroke="{K}" stroke-width="7"/><rect x="{x + 20}" y="460" width="200" height="200" fill="#e8f2f7" stroke="{K}" stroke-width="5"/><rect x="{x + 70}" y="680" width="100" height="24" fill="#151515"/><rect x="{x + 60}" y="380" width="120" height="40" fill="#1f4fb8" stroke="{K}" stroke-width="5"/><text x="{x + 120}" y="410" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="26" fill="#fff">{n}</text></g>' for x, n in [(80, "1"), (420, "2"), (760, "3")])}</g>
    <!-- табло очереди -->
    <g><rect x="300" y="200" width="480" height="140" rx="12" fill="#151515" stroke="{K}" stroke-width="6"/><text x="540" y="262" text-anchor="middle" font-family="JetBrains Mono" font-weight="800" font-size="40" fill="#ff3b30">Б-047 → ОКНО 2</text>
      <text x="540" y="312" text-anchor="middle" font-family="JetBrains Mono" font-weight="800" font-size="30" fill="#ffd23f">ВАШ НОМЕР: Б-112</text></g>
    <!-- герб-круг -->
    <circle cx="140" cy="270" r="70" fill="#f4e7c3" stroke="#c9a20c" stroke-width="10"/><path d="M140 225 l30 30 l-30 60 l-30 -60 z" fill="#c0392b" stroke="{K}" stroke-width="4"/>
    <!-- стулья в ряд -->
    <g>{"".join(f'<g><rect x="{x}" y="900" width="120" height="20" fill="#2e86de" stroke="{K}" stroke-width="5"/><rect x="{x}" y="830" width="120" height="70" fill="#2e86de" stroke="{K}" stroke-width="5"/><path d="M{x + 10} 920 v60 M{x + 110} 920 v60" stroke="{K}" stroke-width="7"/></g>' for x in range(60, 1080, 150))}</g>
    <!-- пол — плитка -->
    <rect y="1000" width="1080" height="920" fill="#b9c2c9"/><path d="M0 1000 H1080" stroke="{K}" stroke-width="7"/>
    <g stroke="#a7b0b8" stroke-width="5">{"".join(f'<path d="M0 {y} H1080"/>' for y in range(1100, 1920, 110))}{"".join(f'<path d="M{x} 1000 V1920"/>' for x in range(0, 1080, 135))}</g>
  </svg>
'''
tires = "".join(f'<g><ellipse cx="{x}" cy="{y}" rx="70" ry="24" fill="#2b2b2e" stroke="{K}" stroke-width="5"/><ellipse cx="{x}" cy="{y}" rx="34" ry="11" fill="#4a4a4e"/></g>' for x, y in [(110, 960), (110, 920), (110, 880), (110, 840), (230, 960), (230, 920), (170, 800)])
razbor = HEAD + f'''    <rect width="1080" height="1920" fill="#c9b8a0"/><ellipse cx="300" cy="200" rx="140" ry="40" fill="#fff" opacity=".8"/>
    <!-- забор из профнастила -->
    <rect x="0" y="560" width="1080" height="440" fill="#7a8592" stroke="{K}" stroke-width="7"/>
    <g stroke="#66707c" stroke-width="10">{"".join(f'<path d="M{x} 560 V1000"/>' for x in range(20, 1080, 40))}</g>
    <g transform="rotate(-2 700 640)"><rect x="520" y="590" width="400" height="90" fill="#ffd23f" stroke="{K}" stroke-width="7"/><text x="720" y="650" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="40" fill="#151515">КУПЛЮ АВТО</text></g>
    <!-- кран-балка -->
    <g><path d="M380 300 V1000 M1000 300 V1000" stroke="#d68a1a" stroke-width="20"/><path d="M360 300 H1020" stroke="#d68a1a" stroke-width="26"/><path d="M700 300 V520" stroke="#151515" stroke-width="5"/><path d="M680 520 h40 l-20 30 z" fill="#151515"/></g>
    {tires}
    <!-- капоты и двери у забора -->
    {"".join(f'<path d="M{x} 1000 l20 -170 h{w} l20 170 z" fill="{c}" stroke="{K}" stroke-width="6"/>' for x, w, c in [(420, 120, "#c0392b"), (580, 140, "#2e86de"), (780, 120, "#e8ecf0"), (920, 110, "#4cd964")])}
    <!-- грунт -->
    <rect y="1000" width="1080" height="920" fill="#8a7a62"/><path d="M0 1000 H1080" stroke="{K}" stroke-width="7"/>
    {"".join(f'<ellipse cx="{random.randint(60, 1020)}" cy="{random.randint(1100, 1880)}" rx="{random.randint(50, 140)}" ry="{random.randint(12, 26)}" fill="#6e604c" opacity=".7"/>' for _ in range(9))}
  </svg>
'''
for n, s in (("barber", barber), ("bizpark", bizpark), ("gibdd", gibdd), ("razbor", razbor)): open(f"bg_{n}.svg.part", "w").write(s)
print("ok")
