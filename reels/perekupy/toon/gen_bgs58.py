# python3 gen_bgs58.py → фоны для ep66 «Музей: перекуп обыкновенный» (киношный формат):
# bg_muzeyzal (зал музея: колонны, прожекторы на потолке, паркет «ёлочкой», вывеска «КАК ПОКУПАЛИ МАШИНЫ · 1995–2025», рамы на стенах),
# bg_diorama (диорама «Рынок в 5 утра»: синие сумерки, туман, ряды машин-силуэтов, фонари, палатка «ЧАЙ»),
# bg_muzeyvhod (вход в музей днём: ступени, колонны, баннер «МУЗЕЙ АВТОТОРГОВЛИ», школьный автобус, деревья)
import random
K = "#000"
HEAD = '  <svg id="bg" width="1080" height="1920" viewBox="0 0 1080 1920" style="position:absolute;left:0;top:0">\n'
F = 'font-family="Unbounded" font-weight="900"'
R = random.randint

random.seed(221)
zal = HEAD + f'''    <rect width="1080" height="1920" fill="#e8e2d6"/>
    <rect width="1080" height="140" fill="#2b2f37"/>{"".join(f'<path d="M{x} 140 l-30 60 h60 z" fill="#3a3d46"/><path d="M{x - 30} 200 L{x - 160} 1240 H{x + 160} L{x + 30} 200 Z" fill="#fff6d0" opacity=".14"/>' for x in (180, 540, 900))}
    <rect x="190" y="230" width="700" height="110" rx="10" fill="#2b2f37" stroke="#c9a06a" stroke-width="6"/>
    <text x="540" y="282" text-anchor="middle" {F} font-size="34" fill="#e6c88a">КАК ПОКУПАЛИ МАШИНЫ</text><text x="540" y="324" text-anchor="middle" font-family="Onest" font-weight="800" font-size="28" fill="#c9b48a">1995 – 2025</text>
    <!-- колонны -->
    {"".join(f'<rect x="{x}" y="200" width="90" height="1040" fill="#f4f0e8" stroke="#b9b0a0" stroke-width="5"/><rect x="{x - 14}" y="200" width="118" height="40" fill="#e0d8c8" stroke="#b9b0a0" stroke-width="5"/><rect x="{x - 14}" y="1200" width="118" height="40" fill="#e0d8c8" stroke="#b9b0a0" stroke-width="5"/>' for x in (20, 970))}
    <!-- рамы -->
    {"".join(f'<rect x="{x}" y="420" width="200" height="260" fill="#cbb89a" stroke="#8a6a3a" stroke-width="12"/><path d="M{x + 20} 640 l50 -80 l40 50 l30 -30 l40 60 z" fill="#8a9a7a"/>' for x in (180, 700))}
    <!-- паркет ёлочкой -->
    <rect y="1240" width="1080" height="680" fill="#b98a5a"/><path d="M0 1240 H1080" stroke="{K}" stroke-width="7"/>
    {"".join(f'<path d="M{x} {y} l40 30 l40 -30" stroke="#a87a4a" stroke-width="5" fill="none"/>' for x in range(-40, 1080, 80) for y in range(1280, 1920, 60))}
  </svg>
'''

random.seed(222)
dio = HEAD + f'''    <defs><linearGradient id="dr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a2440"/><stop offset=".6" stop-color="#4a5a7a"/><stop offset="1" stop-color="#8a8a9a"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#dr)"/>
    {"".join(f'<circle cx="{R(0, 1080)}" cy="{R(0, 500)}" r="{R(1, 3)}" fill="#fff" opacity="{R(3, 8) / 10}"/>' for _ in range(30))}
    <!-- ряды машин-силуэтов -->
    {"".join(f'<path d="M{x} {y} q20 -40 70 -44 h80 q40 4 60 44 h30 v40 h-260 v-40 z" fill="#2a3040" stroke="#151515" stroke-width="4"/>' for y in (900, 1040) for x in range(-60 + (y // 140) * 60, 1080, 300))}
    <!-- фонари -->
    {"".join(f'<path d="M{x} 1240 V700" stroke="#2b2f37" stroke-width="12"/><circle cx="{x}" cy="690" r="20" fill="#ffd27a"/><circle cx="{x}" cy="690" r="80" fill="#ffd27a" opacity=".2"/>' for x in (150, 930))}
    <!-- палатка ЧАЙ -->
    <path d="M620 760 L780 680 L940 760 Z" fill="#c0392b" stroke="{K}" stroke-width="5"/><rect x="640" y="760" width="280" height="200" fill="#5a3820" stroke="{K}" stroke-width="5"/>
    <text x="780" y="840" text-anchor="middle" {F} font-size="40" fill="#ffd23f">ЧАЙ</text>
    <!-- туман и земля -->
    <rect y="1180" width="1080" height="740" fill="#5a5a62"/><path d="M0 1180 H1080" stroke="{K}" stroke-width="6"/>
    {"".join(f'<ellipse cx="{R(0, 1080)}" cy="{R(1000, 1500)}" rx="{R(200, 400)}" ry="{R(40, 80)}" fill="#dfe6f0" opacity=".22"/>' for _ in range(8))}
  </svg>
'''

random.seed(223)
vhod = HEAD + f'''    <defs><linearGradient id="mv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8ccdf2"/><stop offset="1" stop-color="#dff0fa"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#mv)"/>
    <!-- фронтон и колонны -->
    <path d="M60 520 L540 300 L1020 520 Z" fill="#f4f0e8" stroke="{K}" stroke-width="7"/>
    <rect x="60" y="520" width="960" height="60" fill="#e0d8c8" stroke="{K}" stroke-width="6"/>
    {"".join(f'<rect x="{x}" y="580" width="70" height="520" fill="#f4f0e8" stroke="#b9b0a0" stroke-width="5"/>' for x in (110, 300, 710, 900))}
    <rect x="400" y="640" width="280" height="460" fill="#6b4423" stroke="{K}" stroke-width="7"/>
    <rect x="160" y="400" width="760" height="90" rx="10" fill="#c0392b" stroke="{K}" stroke-width="6" transform="translate(0 -20)"/>
    <text x="540" y="450" text-anchor="middle" {F} font-size="42" fill="#fff">МУЗЕЙ АВТОТОРГОВЛИ</text>
    <!-- ступени -->
    {"".join(f'<rect x="{100 - k * 30}" y="{1100 + k * 30}" width="{880 + k * 60}" height="30" fill="#d8d2c4" stroke="#b9b0a0" stroke-width="4"/>' for k in range(4))}
    <!-- деревья -->
    {"".join(f'<path d="M{x} 1260 V960" stroke="#5a3820" stroke-width="20"/><circle cx="{x}" cy="900" r="100" fill="#4a8a3a" stroke="{K}" stroke-width="6"/>' for x in (20, 1060))}
    <!-- площадь и автобус -->
    <rect y="1220" width="1080" height="700" fill="#b8b4ac"/><path d="M0 1220 H1080" stroke="{K}" stroke-width="7"/>
    <rect x="560" y="1300" width="560" height="220" rx="24" fill="#ffd23f" stroke="{K}" stroke-width="7"/>{"".join(f'<rect x="{x}" y="1330" width="90" height="80" fill="#a8cfe8" stroke="{K}" stroke-width="4"/>' for x in range(590, 1080, 110))}
    <text x="820" y="1470" text-anchor="middle" {F} font-size="38" fill="#151515">ДЕТИ</text>
    {"".join(f'<circle cx="{x}" cy="1520" r="46" fill="#151515" stroke="#5b6670" stroke-width="12"/>' for x in (660, 1000))}
  </svg>
'''

for n, s in (("muzeyzal", zal), ("diorama", dio), ("muzeyvhod", vhod)):
    open(f"bg_{n}.svg.part", "w").write(s)
print("ok")
