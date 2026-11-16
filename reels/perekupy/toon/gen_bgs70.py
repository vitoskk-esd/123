# python3 gen_bgs70.py → фоны для ep78 «Толян · 17: учёба в Москве» (без мата):
# bg_moskvasiti (Москва-Сити днём с набережной: «Федерация» со шпилем, золотой «Меркурий», «ОКО», закрученная «Эволюция», «Город столиц»,
#                река, гранитный парапет, фонари, прогулочный теплоход),
# bg_ofis60 (офис Лёхи на 60-м этаже: панорамное окно на башни Сити, кофемашина; стеклянная доска — реквизит BOARD78 в props78.js),
# bg_sitinoch (Сити ночью с крыши парковки: огни окон, подсветка, красные огни на шпилях, мокрый асфальт)
import random
K = "#000"
HEAD = '  <svg id="bg" width="1080" height="1920" viewBox="0 0 1080 1920" style="position:absolute;left:0;top:0">\n'
F = 'font-family="Unbounded" font-weight="900"'
R = random.randint


def city(base, s=1.0, night=False, dx=0):
    """Силуэт Москва-Сити: низ башен на y=base, s — масштаб, dx — сдвиг."""
    X = lambda x: dx + 540 + (x - 540) * s
    Y = lambda h: base - h * s
    win = (lambda x, y, w, h, c: "".join(f'<rect x="{x + R(4, int(w) - 10)}" y="{y + R(10, int(h) - 20)}" width="{6 * s:.0f}" height="{9 * s:.0f}" fill="{c}" opacity=".9"/>' for _ in range(int(w * h / 900))) if night else "")
    g = []
    # «Город столиц» — ступенчатые блоки (слева)
    for k, (x, w, h) in enumerate(((60, 110, 620), (120, 110, 700), (170, 100, 560))):
        c = "#4a5a6e" if night else "#8aa0b8"
        g.append(f'<rect x="{X(x)}" y="{Y(h)}" width="{w * s}" height="{h * s}" fill="{c}" stroke="{K}" stroke-width="5"/>{win(X(x), Y(h), w * s, h * s, "#ffd98a")}')
    # «Империя» — скруглённый верх
    c = "#3a4a5e" if night else "#6a88a8"
    g.append(f'<path d="M{X(250)} {base} V{Y(780)} Q{X(310)} {Y(860)} {X(370)} {Y(780)} V{base} Z" fill="{c}" stroke="{K}" stroke-width="5"/>{win(X(255), Y(770), 110 * s, 760 * s, "#cfe6ff")}')
    # «Эволюция» — закрученная башня
    c = "#56708c" if night else "#9cc0dc"
    g.append(f'<path d="M{X(380)} {base} L{X(395)} {Y(720)} Q{X(440)} {Y(760)} {X(490)} {Y(720)} L{X(505)} {base} Z" fill="{c}" stroke="{K}" stroke-width="5"/>'
             + "".join(f'<path d="M{X(380 + k * 3)} {Y(60 + k * 70)} Q{X(445)} {Y(100 + k * 70)} {X(505 - k * 3)} {Y(40 + k * 70)}" stroke="{"#2a3a4e" if night else "#5a7c9a"}" stroke-width="5" fill="none"/>' for k in range(10)))
    # «Федерация» — две башни, «Восток» со шпилем
    c1, c2 = ("#3e5876", "#4a6888") if night else ("#5d8ab8", "#7aa6d0")
    g.append(f'<path d="M{X(520)} {base} V{Y(900)} L{X(585)} {Y(1010)} L{X(650)} {Y(900)} V{base} Z" fill="{c1}" stroke="{K}" stroke-width="5"/><path d="M{X(585)} {Y(1010)} V{Y(1110)}" stroke="{K}" stroke-width="{6 * s}"/>'
             + f'<path d="M{X(655)} {base} V{Y(700)} L{X(705)} {Y(780)} L{X(755)} {Y(700)} V{base} Z" fill="{c2}" stroke="{K}" stroke-width="5"/>'
             + "".join(f'<path d="M{X(520)} {Y(h)} H{X(650)}" stroke="{"#2a3e58" if night else "#4a76a2"}" stroke-width="3"/>' for h in range(80, 900, 60))
             + win(X(525), Y(890), 120 * s, 880 * s, "#cfe6ff") + (f'<circle cx="{X(585)}" cy="{Y(1110)}" r="{8 * s}" fill="#ff3b30"/>' if night else ""))
    # «Меркурий» — золотистая гранёная
    c = "#8a6a3a" if night else "#d8a85a"
    g.append(f'<path d="M{X(770)} {base} V{Y(760)} L{X(820)} {Y(860)} L{X(870)} {Y(780)} V{base} Z" fill="{c}" stroke="{K}" stroke-width="5"/><path d="M{X(820)} {Y(860)} V{base}" stroke="{"#6a4a1a" if night else "#b8883a"}" stroke-width="5"/>'
             + win(X(775), Y(750), 90 * s, 740 * s, "#ffe2a0"))
    # «ОКО» — две башни со скошенным верхом
    c = "#2e3a4a" if night else "#4a5e78"
    g.append(f'<path d="M{X(880)} {base} V{Y(950)} L{X(960)} {Y(1000)} V{base} Z" fill="{c}" stroke="{K}" stroke-width="5"/><path d="M{X(965)} {base} V{Y(560)} L{X(1040)} {Y(600)} V{base} Z" fill="{c}" stroke="{K}" stroke-width="5"/>'
             + win(X(885), Y(940), 70 * s, 930 * s, "#ffd98a") + (f'<circle cx="{X(960)}" cy="{Y(1000)}" r="{8 * s}" fill="#ff3b30"/>' if night else ""))
    return "".join(g)


random.seed(341)
siti = HEAD + f'''    <defs><linearGradient id="ms" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8ec5ea"/><stop offset="1" stop-color="#e8f2f6"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#ms)"/>
    {"".join(f'<ellipse cx="{R(0, 1080)}" cy="{R(120, 420)}" rx="{R(90, 180)}" ry="{R(24, 40)}" fill="#fff" opacity=".8"/>' for _ in range(5))}
    {city(1150, 1.0)}
    <!-- набережная напротив, река, теплоход -->
    <rect y="1150" width="1080" height="40" fill="#9a9488" stroke="{K}" stroke-width="5"/>
    <rect y="1190" width="1080" height="220" fill="#5d86a8"/>{"".join(f'<path d="M{R(0, 1000)} {R(1210, 1400)} h{R(40, 120)}" stroke="#a8c8e0" stroke-width="5"/>' for _ in range(16))}
    <path d="M620 1300 h300 l-30 50 h-250 z" fill="#f4f0e8" stroke="{K}" stroke-width="6"/><rect x="680" y="1260" width="180" height="42" fill="#fff" stroke="{K}" stroke-width="5"/>{"".join(f'<rect x="{695 + k * 40}" y="1268" width="24" height="22" fill="#7ab8d8"/>' for k in range(4))}
    <!-- гранитный парапет и фонари (передний план) -->
    <rect y="1410" width="1080" height="90" fill="#b8a48a" stroke="{K}" stroke-width="6"/>{"".join(f'<path d="M{x} 1410 v90" stroke="#9a8670" stroke-width="5"/>' for x in range(0, 1100, 180))}
    {"".join(f'<path d="M{x} 1410 V1060" stroke="#2b2f37" stroke-width="12"/><path d="M{x - 40} 1070 h80" stroke="#2b2f37" stroke-width="8"/><circle cx="{x - 40}" cy="1088" r="16" fill="#fff6c8" stroke="{K}" stroke-width="4"/><circle cx="{x + 40}" cy="1088" r="16" fill="#fff6c8" stroke="{K}" stroke-width="4"/>' for x in (120, 960))}
    <rect y="1500" width="1080" height="420" fill="#8f939a"/>{"".join(f'<path d="M0 {y} H1080" stroke="#7f838a" stroke-width="4"/>' for y in range(1560, 1920, 70))}
  </svg>
'''

random.seed(342)
ofis = HEAD + f'''    <rect width="1080" height="1920" fill="#2a2b30"/>
    <!-- панорамное окно: Сити рядом, ниже уровень облаков -->
    <defs><linearGradient id="os" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7fb8e0"/><stop offset="1" stop-color="#d8ecf4"/></linearGradient></defs>
    <rect x="40" y="120" width="1000" height="1160" fill="url(#os)"/>
    {city(1500, 1.25, dx=-60)}
    <rect x="40" y="120" width="1000" height="1160" fill="none" stroke="#151515" stroke-width="16"/>{"".join(f'<path d="M{x} 120 V1280" stroke="#151515" stroke-width="12"/>' for x in (373, 706))}
    <rect y="1280" width="1080" height="640" fill="#3a2e28"/><path d="M0 1280 H1080" stroke="{K}" stroke-width="6"/>
    {"".join(f'<path d="M0 {y} H1080" stroke="#33282a" stroke-width="4"/>' for y in range(1340, 1920, 90))}
    <!-- кофемашина на тумбе -->
    <rect x="60" y="1060" width="200" height="220" fill="#5a4030" stroke="{K}" stroke-width="5"/><rect x="100" y="940" width="120" height="120" rx="12" fill="#c9cdd2" stroke="{K}" stroke-width="5"/><rect x="140" y="1010" width="40" height="40" fill="#151515"/>
  </svg>
'''

random.seed(343)
noch = HEAD + f'''    <defs><linearGradient id="ns" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0d1030"/><stop offset="1" stop-color="#3a2a5a"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#ns)"/>
    {"".join(f'<circle cx="{R(0, 1080)}" cy="{R(40, 500)}" r="{R(1, 3)}" fill="#fff" opacity=".7"/>' for _ in range(40))}
    {city(1240, 1.05, night=True)}
    <!-- подсветка у подножия и крыша парковки -->
    <rect y="1200" width="1080" height="60" fill="#ffb84a" opacity=".25"/>
    <rect y="1240" width="1080" height="680" fill="#24262e"/><path d="M0 1240 H1080" stroke="{K}" stroke-width="6"/>
    <rect y="1240" width="1080" height="30" fill="#8a8f98" stroke="{K}" stroke-width="5"/>
    {"".join(f'<path d="M{x} 1300 l60 600" stroke="#f4f0e8" stroke-width="8" opacity=".5"/>' for x in range(-200, 1100, 260))}
    {"".join(f'<ellipse cx="{R(0, 1080)}" cy="{R(1350, 1880)}" rx="{R(60, 160)}" ry="{R(10, 20)}" fill="#ffd98a" opacity=".12"/>' for _ in range(10))}
  </svg>
'''

for n, s in (("moskvasiti", siti), ("ofis60", ofis), ("sitinoch", noch)):
    open(f"bg_{n}.svg.part", "w").write(s)
print("ok")
