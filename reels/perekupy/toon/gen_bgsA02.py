# python3 gen_bgsA02.py → фоны для «Арбитражников» ep02 «Никита: друзья → выплата» (владелец 16.11: «абсолютно другие фоны и локации»)
# bg_kovorking (ночной коворкинг: окна в город, подвесные лампы, растения, длинный стол, неон «COWORK»),
# bg_minifutbol (футбольная коробка вечером: газон, сетка-ограждение, ворота, прожекторы, закат и панельки),
# bg_pizzeria (пиццерия: кирпич, дровяная печь с огнём, меловая доска-меню, гирлянды, столики)
import random
K = "#000"
HEAD = '  <svg id="bg" width="1080" height="1920" viewBox="0 0 1080 1920" style="position:absolute;left:0;top:0">\n'
F = 'font-family="Unbounded" font-weight="900"'
R = random.randint

random.seed(511)
kov = HEAD + f'''    <rect width="1080" height="1920" fill="#1d2a2a"/>
    <!-- панорамные окна: ночной город -->
    <rect x="40" y="140" width="1000" height="760" fill="#0b1426" stroke="{K}" stroke-width="10"/>
    {"".join(f'<rect x="{x}" y="{y}" width="{w}" height="{900 - y}" fill="#121d36"/>' + "".join(f'<rect x="{x + 8 + i * 24}" y="{y + 12 + j * 30}" width="12" height="14" fill="{"#ffd36a" if R(0, 3) else "#24324f"}"/>' for i in range(max(1, (w - 10) // 24)) for j in range((900 - y - 20) // 30)) for x, y, w in ((50, 520, 150), (210, 380, 130), (350, 600, 120), (480, 300, 160), (650, 470, 140), (800, 360, 120), (930, 560, 100)))}
    {"".join(f'<path d="M{x} 140 V900" stroke="{K}" stroke-width="10"/>' for x in (290, 540, 790))}
    <!-- неон -->
    <rect x="330" y="190" width="420" height="96" rx="20" fill="#08241f" stroke="#2ff5c4" stroke-width="8"/>
    <text x="540" y="256" text-anchor="middle" {F} font-size="54" fill="#7affdd">COWORK</text>
    <!-- подвесные лампы -->
    {"".join(f'<path d="M{x} 0 V{y}" stroke="{K}" stroke-width="5"/><path d="M{x - 50} {y + 50} Q{x} {y - 10} {x + 50} {y + 50} Z" fill="#2b2f37" stroke="{K}" stroke-width="6"/><ellipse cx="{x}" cy="{y + 52}" rx="40" ry="10" fill="#fff2b0"/>' for x, y in ((200, 980), (540, 940), (880, 980)))}
    <!-- растения в кадках -->
    {"".join(f'<rect x="{x - 50}" y="1010" width="100" height="120" rx="14" fill="#c86a3a" stroke="{K}" stroke-width="7"/>' + "".join(f'<path d="M{x} 1010 q{dx} -110 {dx * 2} -170" stroke="#2f8f3a" stroke-width="18" fill="none" stroke-linecap="round"/>' for dx in (-40, -10, 25, 50)) for x in (80, 1000))}
    <!-- пол и длинный стол -->
    <rect y="1130" width="1080" height="790" fill="#5a4636"/><path d="M0 1130 H1080" stroke="{K}" stroke-width="7"/>
    {"".join(f'<path d="M{x} 1130 L{x * 1.6 - 324} 1920" stroke="#4a3828" stroke-width="5"/>' for x in range(0, 1100, 90))}
    <rect x="150" y="1180" width="780" height="40" fill="#c89a5a" stroke="{K}" stroke-width="8"/><path d="M190 1220 V1360 M890 1220 V1360" stroke="{K}" stroke-width="14"/>
    <rect x="230" y="1130" width="44" height="50" rx="8" fill="#e8e4f0" stroke="{K}" stroke-width="5"/><rect x="800" y="1120" width="70" height="60" rx="6" fill="#2ff5c4" stroke="{K}" stroke-width="5"/>
  </svg>
'''

random.seed(512)
fut = HEAD + f'''    <defs><linearGradient id="fz" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a3f8a"/><stop offset=".55" stop-color="#ff8a5a"/><stop offset="1" stop-color="#ffd27a"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#fz)"/>
    <!-- панельки на закате -->
    {"".join(f'<rect x="{x}" y="{y}" width="{w}" height="{900 - y}" fill="#4a3a6a" stroke="{K}" stroke-width="5"/>' + "".join(f'<rect x="{x + 12 + i * 40}" y="{y + 16 + j * 46}" width="22" height="26" fill="{"#ffd36a" if R(0, 4) == 0 else "#5d4c80"}"/>' for i in range((w - 12) // 40) for j in range((900 - y - 20) // 46)) for x, y, w in ((-20, 420, 300), (300, 480, 240), (560, 380, 280), (860, 460, 240)))}
    <!-- прожекторы -->
    {"".join(f'<path d="M{x} 1180 V260" stroke="#2b2f37" stroke-width="16"/><rect x="{x - 60}" y="210" width="120" height="70" rx="10" fill="#fff6c8" stroke="{K}" stroke-width="7"/><path d="M{x - 60} 280 L{x - 260} 1180 H{x + 260} L{x + 60} 280 Z" fill="#fff6c8" opacity=".12"/>' for x in (90, 990))}
    <!-- сетка-ограждение -->
    <rect x="0" y="700" width="1080" height="480" fill="none"/>
    {"".join(f'<path d="M{x} 700 L{x + 480} 1180" stroke="#cfd6e0" stroke-width="3" opacity=".55"/><path d="M{x} 1180 L{x + 480} 700" stroke="#cfd6e0" stroke-width="3" opacity=".55"/>' for x in range(-480, 1080, 60))}
    <path d="M0 700 H1080" stroke="#2b2f37" stroke-width="12"/>{"".join(f'<path d="M{x} 700 V1180" stroke="#2b2f37" stroke-width="12"/>' for x in (0, 360, 720, 1080))}
    <!-- ворота -->
    <rect x="380" y="900" width="320" height="250" fill="none" stroke="#fbfaf3" stroke-width="14"/>
    {"".join(f'<path d="M{x} 900 V1150" stroke="#fbfaf3" stroke-width="3" opacity=".6"/>' for x in range(400, 700, 30))}{"".join(f'<path d="M380 {y} H700" stroke="#fbfaf3" stroke-width="3" opacity=".6"/>' for y in range(920, 1150, 30))}
    <!-- газон с полосами и разметкой -->
    <rect y="1150" width="1080" height="770" fill="#3fa34d"/>{"".join(f'<rect y="{y}" width="1080" height="80" fill="#38944a"/>' for y in range(1150, 1920, 160))}
    <path d="M0 1150 H1080" stroke="#fbfaf3" stroke-width="10"/><ellipse cx="540" cy="1650" rx="300" ry="90" fill="none" stroke="#fbfaf3" stroke-width="10"/>
    <!-- мяч -->
    <circle cx="930" cy="1760" r="44" fill="#fbfaf3" stroke="{K}" stroke-width="6"/><path d="M930 1735 l20 15 l-8 24 h-24 l-8 -24 z" fill="#151515"/>
  </svg>
'''

random.seed(513)
piz = HEAD + f'''    <rect width="1080" height="1920" fill="#8a3a24"/>
    <!-- кирпич -->
    {"".join(f'<rect x="{x + (y // 54 % 2) * 60}" y="{y}" width="116" height="50" fill="{("#a04a2c", "#9a4428", "#ab5232")[R(0, 2)]}" stroke="#6a2a18" stroke-width="4"/>' for x in range(-120, 1080, 120) for y in range(0, 1200, 54))}
    <!-- гирлянда -->
    <path d="M0 130 Q540 240 1080 130" fill="none" stroke="#151515" stroke-width="4"/>
    {"".join(f'<circle cx="{x}" cy="{130 + 440 * (x / 1080) * (1 - x / 1080) * .9}" r="13" fill="#ffd36a" stroke="{K}" stroke-width="3"/>' for x in range(40, 1080, 70))}
    <!-- дровяная печь -->
    <path d="M90 1120 V700 Q90 470 330 470 Q570 470 570 700 V1120 Z" fill="#d8ccb8" stroke="{K}" stroke-width="10"/>
    <path d="M190 1000 V820 Q190 700 330 700 Q470 700 470 820 V1000 Z" fill="#2a1408" stroke="{K}" stroke-width="8"/>
    <path d="M220 1000 q20 -110 60 -60 q20 -90 60 -10 q30 -80 60 0 q30 -40 40 70 z" fill="#ff7a1a" stroke="#ffd23f" stroke-width="5"/>
    <rect x="290" y="300" width="80" height="170" fill="#c8ccd0" stroke="{K}" stroke-width="8"/>
    <!-- меловая доска-меню -->
    <rect x="640" y="380" width="380" height="520" rx="14" fill="#203028" stroke="#8a5a33" stroke-width="16"/>
    <text x="830" y="460" text-anchor="middle" font-family="Caveat" font-weight="700" font-size="64" fill="#fbfaf3">МЕНЮ</text>
    {"".join(f'<text x="670" y="{y}" font-family="Caveat" font-weight="700" font-size="44" fill="#e8f0e8">{t}</text>' for y, t in ((550, "Маргарита ...... 490"), (620, "Пепперони ...... 590"), (690, "4 сыра ............ 640"), (760, "Лимонад .......... 190"), (840, "★ ПИЦЦА ДНЯ ★")))}
    <!-- пол и столики -->
    <rect y="1120" width="1080" height="800" fill="#3a2a22"/><path d="M0 1120 H1080" stroke="{K}" stroke-width="7"/>
    {"".join(f'<rect x="{x}" y="{y}" width="60" height="60" fill="{"#e8dcc8" if (x // 60 + y // 60) % 2 else "#2a1e18"}"/>' for x in range(0, 1080, 60) for y in range(1120, 1920, 60))}
  </svg>
'''

for n, s in (("kovorking", kov), ("minifutbol", fut), ("pizzeria", piz)):
    open(f"bg_{n}.svg.part", "w").write(s)
print("ok")
