# python3 gen_bgs39.py → фоны для «Толян: со ста тысяч», часть 10 «Жора просит о помощи» (первая серия в «киношном» формате:
# фон — дальний слой параллакса, свет/тени/дождь/передний план — слоями cine.js поверх):
# bg_obshaga (комната в общаге ночью: двухъярусная кровать, окно с дождём и огнями города, плакаты, стол с лампой, лапша),
# bg_zhlot (площадка «АВТО У ЖОРЫ» ночью под дождём: гирлянда, вывеска с перегоревшими лампами, сетка, эстакада вдали, мокрый асфальт),
# bg_zhlotday (та же площадка утром после дождя: солнце, лужи с небом, гирлянда погашена),
# bg_vagonchik (вагончик-офис Жоры: вагонка, обогреватель, доска «ключи», тетрадь долгов, чайник, окно с дождём),
# bg_rassvet (частный сектор на рассвете: туман, деревянные дома с наличниками, жёлтая газовая труба, колонка, берёзы, лужи)
import random
K = "#000"
random.seed(51)
HEAD = '  <svg id="bg" width="1080" height="1920" viewBox="0 0 1080 1920" style="position:absolute;left:0;top:0">\n'
F = 'font-family="Unbounded" font-weight="900"'
M = 'font-family="JetBrains Mono" font-weight="800"'
C = 'font-family="Caveat" font-weight="700"'
R = random.randint


def city(y0, y1, n=9, col="#151a30", win="#ffd27a", wp=.5):
    out = []
    x = -20
    while x < 1100:
        w = R(70, 150); h = R(120, y1 - y0)
        out.append(f'<rect x="{x}" y="{y1 - h}" width="{w}" height="{h}" fill="{col}"/>')
        for wy in range(y1 - h + 16, y1 - 14, 28):
            for wx in range(x + 10, x + w - 14, 22):
                if random.random() < wp * .45:
                    out.append(f'<rect x="{wx}" y="{wy}" width="10" height="14" fill="{win}" opacity="{random.choice([.5, .7, .9])}"/>')
        x += w + R(0, 12)
    return "".join(out)


# ---------- общага ночью ----------
obshaga = HEAD + f'''    <defs><linearGradient id="obSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a1028"/><stop offset="1" stop-color="#2a2152"/></linearGradient>
      <linearGradient id="obWall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a4462"/><stop offset="1" stop-color="#2c3450"/></linearGradient>
      <clipPath id="obWin"><rect x="560" y="300" width="420" height="560"/></clipPath></defs>
    <rect width="1080" height="1920" fill="url(#obWall)"/>
    <g stroke="#343d5a" stroke-width="10">{"".join(f'<path d="M{x} 0 V1150"/>' for x in range(20, 1080, 64))}</g>
    <g fill="#46506e">{"".join(f'<circle cx="{x}" cy="{y}" r="4"/>' for x in range(52, 1080, 64) for y in range(60, 1150, 90))}</g>
    <!-- окно: ночной город под дождём -->
    <g clip-path="url(#obWin)"><rect x="560" y="300" width="420" height="560" fill="url(#obSky)"/>
      <g>{city(520, 860, col="#141a34")}</g>
      {"".join(f'<circle cx="{R(570, 970)}" cy="{R(320, 850)}" r="{R(3, 7)}" fill="#cfe2ff" opacity=".55"/>' for _ in range(70))}
      {"".join(f'<path d="M{x} {y} q-3 {R(20, 40)} 2 {R(40, 80)}" stroke="#9fb6e8" stroke-width="3" fill="none" opacity=".5"/>' for x, y in [(R(570, 970), R(300, 760)) for _ in range(26)])}
    </g>
    <rect x="550" y="290" width="440" height="580" fill="none" stroke="#e8e4d8" stroke-width="20"/><path d="M770 300 V860 M560 560 H980" stroke="#e8e4d8" stroke-width="14"/>
    <rect x="530" y="866" width="480" height="30" fill="#d6d0c0" stroke="{K}" stroke-width="5"/>
    <!-- штора в клетку -->
    <path d="M520 260 q40 300 -10 640 h120 q-40 -320 10 -640 z" fill="#b8562e" stroke="{K}" stroke-width="6"/>
    <g stroke="#8e3f1e" stroke-width="6">{"".join(f'<path d="M{528 + k * 26} 270 q8 300 -6 620"/>' for k in range(4))}{"".join(f'<path d="M516 {y} h120"/>' for y in range(320, 900, 60))}</g>
    <path d="M500 250 H1020" stroke="#8a929b" stroke-width="12" stroke-linecap="round"/>
    <!-- плакаты на скотче -->
    <g transform="rotate(-4 250 360)"><rect x="140" y="240" width="230" height="300" fill="#151515" stroke="{K}" stroke-width="6"/>
      <path d="M160 470 q60 -70 190 -40 l-10 40 z" fill="#ff7a1a"/><rect x="170" y="420" width="140" height="44" rx="14" fill="#e8ecf0" stroke="{K}" stroke-width="4"/>
      <circle cx="195" cy="468" r="16" fill="#151515" stroke="#e8ecf0" stroke-width="5"/><circle cx="290" cy="468" r="16" fill="#151515" stroke="#e8ecf0" stroke-width="5"/>
      <text x="255" y="300" text-anchor="middle" {F} font-size="40" fill="#ffd23f">ДРИФТ</text><text x="255" y="340" text-anchor="middle" {M} font-size="20" fill="#e8ecf0">ТОЛЬЯТТИ · 2009</text>
      <path d="M140 250 l30 -20 M370 250 l-30 -20" stroke="#e8e0b0" stroke-width="16" opacity=".8"/></g>
    <g transform="rotate(3 410 640)"><rect x="330" y="580" width="160" height="120" fill="#f4f1e8" stroke="{K}" stroke-width="5"/>
      <text x="410" y="620" text-anchor="middle" {C} font-size="30" fill="#c0392b">НЕ ЗАБЫТЬ:</text><text x="410" y="656" text-anchor="middle" {C} font-size="26" fill="#222">сессия!!!</text>
      <text x="410" y="686" text-anchor="middle" {C} font-size="24" fill="#222">Ильдару 500 ₽</text></g>
    <!-- полка с лапшой и кружкой -->
    <rect x="120" y="760" width="300" height="16" fill="#8a5a33" stroke="{K}" stroke-width="5"/>
    {"".join(f'<g><rect x="{x}" y="704" width="56" height="56" fill="{c}" stroke="{K}" stroke-width="4"/><text x="{x + 28}" y="738" text-anchor="middle" {F} font-size="12" fill="#fff">ЛАПША</text></g>' for x, c in [(140, "#c0392b"), (202, "#e8a33a"), (264, "#c0392b")])}
    <path d="M340 760 v-44 h48 v44 z" fill="#2f6db5" stroke="{K}" stroke-width="4"/><path d="M388 726 q22 4 0 24" fill="none" stroke="{K}" stroke-width="5"/>
    <!-- двухъярусная кровать -->
    <g><path d="M30 520 V1260 M470 520 V1260" stroke="#7a828c" stroke-width="22"/><path d="M30 520 V1260 M470 520 V1260" stroke="{K}" stroke-width="3" fill="none" opacity=".6"/>
      <rect x="40" y="790" width="420" height="60" rx="10" fill="#d6dbe3" stroke="{K}" stroke-width="6"/><path d="M40 850 h420 v26 h-420 z" fill="#7a828c" stroke="{K}" stroke-width="5"/>
      <path d="M50 760 q100 -50 220 -10 q120 30 180 0 v40 h-400 z" fill="#5f7fb5" stroke="{K}" stroke-width="5"/>
      <path d="M40 520 h430" stroke="#7a828c" stroke-width="16"/><path d="M40 600 h430 M40 680 h430" stroke="#7a828c" stroke-width="8"/>
      <rect x="40" y="1110" width="420" height="70" rx="10" fill="#d6dbe3" stroke="{K}" stroke-width="6"/><path d="M40 1180 h420 v26 h-420 z" fill="#7a828c" stroke="{K}" stroke-width="5"/>
      <path d="M60 1060 q90 -40 200 0 q90 26 190 -6 l10 56 h-410 z" fill="#c9a24a" stroke="{K}" stroke-width="5"/><ellipse cx="120" cy="1090" rx="70" ry="28" fill="#f4f1e8" stroke="{K}" stroke-width="5"/></g>
    <!-- стол под окном: настольная лампа (выключена), конспекты -->
    <g><rect x="600" y="1000" width="420" height="26" fill="#a87a4c" stroke="{K}" stroke-width="6"/><path d="M620 1026 V1260 M1000 1026 V1260" stroke="#7a522b" stroke-width="16"/>
      <path d="M660 1000 v-16 h70 v16 z" fill="#2b2f37" stroke="{K}" stroke-width="4"/><path d="M695 984 l40 -110 l70 30" fill="none" stroke="#2b2f37" stroke-width="10"/>
      <path d="M790 880 l60 -10 l20 60 l-70 20 z" fill="#2b2f37" stroke="{K}" stroke-width="5"/>
      <g transform="rotate(-6 900 990)"><rect x="840" y="970" width="150" height="26" fill="#f4f1e8" stroke="{K}" stroke-width="4"/><rect x="850" y="958" width="140" height="16" fill="#2f6db5" stroke="{K}" stroke-width="3"/></g></g>
    <!-- пол: линолеум -->
    <rect y="1150" width="1080" height="770" fill="#7a4e33"/><path d="M0 1150 H1080" stroke="{K}" stroke-width="7"/>
    <g fill="none" stroke="#6a4229" stroke-width="5">{"".join(f'<path d="M{x} 1150 L{x * 1.6 - 324} 1920"/>' for x in range(-200, 1400, 120))}</g>
    <g stroke="#6a4229" stroke-width="4">{"".join(f'<path d="M0 {y} H1080"/>' for y in (1260, 1420, 1640))}</g>
    <path d="M520 1240 q30 -10 60 4 q20 30 -30 34 q-50 -8 -30 -38 z" fill="#2b2f37" stroke="{K}" stroke-width="4"/>
  </svg>
'''


# ---------- площадка Жоры: ночь под дождём / утро после дождя ----------
def lot(night):
    sky = ('<linearGradient id="lSkyN" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#080b1c"/><stop offset="1" stop-color="#262a4a"/></linearGradient>' if night else
           '<linearGradient id="lSkyD" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6fb4ea"/><stop offset=".7" stop-color="#cfe7f7"/><stop offset="1" stop-color="#f4ecd8"/></linearGradient>')
    sid = "lSkyN" if night else "lSkyD"
    random.seed(77)
    clouds = "".join(f'<ellipse cx="{x}" cy="{y}" rx="{rx}" ry="{rx * .32:.0f}" fill="{"#1a1f38" if night else "#fff"}" opacity="{.8 if night else .9}"/>'
                     for x, y, rx in [(150, 170, 200), (420, 120, 170), (760, 190, 230), (980, 110, 160), (600, 260, 140)])
    sun = "" if night else '<circle cx="880" cy="300" r="80" fill="#fff3c4"/><circle cx="880" cy="300" r="130" fill="#fff3c4" opacity=".35"/>'
    far = city(520, 760, col="#161b33" if night else "#9fb0c4", win="#ffd27a" if night else "#dfe8ef", wp=.6 if night else .0)
    overpass = f'''<g><rect x="-10" y="640" width="1100" height="34" fill="{"#20253e" if night else "#a7b1bd"}" stroke="{K}" stroke-width="4"/>
      {"".join(f'<rect x="{x}" y="674" width="26" height="140" fill="{"#1c2036" if night else "#98a3b0"}"/>' for x in range(60, 1080, 240))}
      {"".join(f'<rect x="{x}" y="630" width="44" height="12" rx="4" fill="{"#ff3b30" if k % 2 else "#fff6c8"}" opacity="{.9 if night else 0}"/>' for k, x in enumerate(range(30, 1080, 130)))}</g>'''
    # гирлянда: провод провисает между столбами, лампочки — горят через одну ночью
    def garland(x0, x1, y, sag):
        pts = []
        n = 11
        for i in range(n + 1):
            t = i / n; x = x0 + (x1 - x0) * t; yy = y + sag * 4 * t * (1 - t)
            pts.append((x, yy))
        wire = "M" + " L".join(f"{x:.0f} {y:.0f}" for x, y in pts)
        bulbs = "".join(f'<circle cx="{x:.0f}" cy="{y + 14:.0f}" r="11" fill="{("#ffd27a" if (i % 4) else "#55504a") if night else "#e8e0c8"}" stroke="{K}" stroke-width="3"/>'
                        for i, (x, y) in enumerate(pts[1:-1]))
        return f'<path d="{wire}" stroke="#111" stroke-width="4" fill="none"/>{bulbs}'
    flags = "".join(f'<path d="M{x} {y} l24 0 l-12 34 z" fill="{c}" stroke="{K}" stroke-width="2"/>'
                    for (x, y), c in zip([(60 + i * 64, 560 + int(70 * 4 * (i / 15) * (1 - i / 15))) for i in range(16)], ["#c0392b", "#ffd23f", "#2f6db5", "#4cd964"] * 4))
    sign_bulbs = "".join(f'<circle cx="{x}" cy="{y}" r="8" fill="{("#ffd27a" if random.random() < .65 else "#4a4640") if night else "#d8d2c4"}" stroke="{K}" stroke-width="2"/>'
                         for x, y in [(x, 360) for x in range(250, 860, 40)] + [(x, 520) for x in range(250, 860, 40)])
    ground = "#1b1f27" if night else "#5b6068"
    refl = ("".join(f'<ellipse cx="{x}" cy="{R(1150, 1700)}" rx="{R(14, 30)}" ry="{R(90, 200)}" fill="{c}" opacity=".16"/>'
                    for x, c in [(R(40, 1040), random.choice(["#ffd27a", "#ff7a3a", "#9fc3ff"])) for _ in range(14)]) if night else
            "".join(f'<ellipse cx="{R(60, 1020)}" cy="{R(1250, 1850)}" rx="{R(80, 220)}" ry="{R(18, 40)}" fill="#9fd0f2" opacity=".55" stroke="#4a5560" stroke-width="3"/>' for _ in range(7)))
    puddles = "".join(f'<ellipse cx="{R(60, 1020)}" cy="{R(1180, 1880)}" rx="{R(80, 200)}" ry="{R(14, 30)}" fill="#252a35" stroke="#3a4150" stroke-width="3"/>' for _ in range(8)) if night else ""
    return HEAD + f'''    <defs>{sky}</defs>
    <rect width="1080" height="1920" fill="url(#{sid})"/>{sun}{clouds}
    {far}{overpass}
    <!-- вагончик-офис -->
    <g><rect x="760" y="760" width="300" height="250" fill="{"#5a6a3a" if night else "#7f945a"}" stroke="{K}" stroke-width="7"/><path d="M750 760 h320" stroke="{K}" stroke-width="10"/>
      <rect x="800" y="810" width="120" height="90" fill="{"#ffb347" if night else "#bfe0f2"}" stroke="{K}" stroke-width="6"/><path d="M860 810 v90" stroke="{K}" stroke-width="4"/>
      <rect x="950" y="820" width="70" height="190" fill="#3b3f46" stroke="{K}" stroke-width="5"/><circle cx="1004" cy="920" r="6" fill="#ffd23f"/>
      <path d="M940 1010 h90 v-14 h-90 z" fill="#8a929b" stroke="{K}" stroke-width="3"/></g>
    <!-- забор-сетка -->
    <g stroke="{"#3a4256" if night else "#8a96a5"}" stroke-width="6">{"".join(f'<path d="M{x} 840 V1010"/>' for x in range(0, 760, 95))}<path d="M0 846 H760"/></g>
    <g stroke="{"#2e3546" if night else "#a3adb9"}" stroke-width="2">{"".join(f'<path d="M{x} 846 l80 160 M{x + 80} 846 l-80 160" />' for x in range(-80, 760, 40))}</g>
    <!-- вывеска на двух столбах -->
    <g><path d="M220 1010 V560 M890 1010 V560" stroke="#2b2f37" stroke-width="18"/>
      <rect x="220" y="340" width="670" height="200" rx="14" fill="{"#c0392b" if night else "#d9473a"}" stroke="{K}" stroke-width="8"/>{sign_bulbs}
      <text x="555" y="430" text-anchor="middle" {F} font-size="64" fill="#fff6e0">АВТО У ЖОРЫ</text>
      <text x="555" y="492" text-anchor="middle" {M} font-size="30" fill="#ffd23f">ВЫКУП · ОБМЕН · КРЕДИТ</text></g>
    {garland(0, 540, 590, 90)}{garland(540, 1080, 600, 80)}
    <path d="M0 560 Q520 680 1080 560" stroke="#111" stroke-width="3" fill="none"/>{flags}
    <!-- асфальт -->
    <rect y="1010" width="1080" height="910" fill="{ground}"/><path d="M0 1010 H1080" stroke="{K}" stroke-width="7"/>
    <g stroke="{"#2a2f3a" if night else "#6a7079"}" stroke-width="6">{"".join(f'<path d="M{x} 1040 l-60 520"/>' for x in range(150, 1081, 260))}</g>
    {puddles}{refl}
  </svg>
'''


zhlot, zhlotday = lot(True), lot(False)

# ---------- вагончик-офис Жоры ----------
random.seed(52)
vagonchik = HEAD + f'''    <rect width="1080" height="1920" fill="#a8743f"/>
    <g stroke="#8e5f31" stroke-width="5">{"".join(f'<path d="M{x} 0 V1150"/>' for x in range(0, 1080, 54))}</g>
    <g fill="#6e4520" opacity=".5">{"".join(f'<ellipse cx="{R(0, 1080)}" cy="{R(0, 1150)}" rx="{R(6, 12)}" ry="{R(3, 5)}"/>' for _ in range(60))}</g>
    <!-- потолок и лампа дневного света -->
    <rect width="1080" height="120" fill="#7a522b" stroke="{K}" stroke-width="6"/><rect x="340" y="120" width="400" height="34" rx="10" fill="#f4f6e8" stroke="{K}" stroke-width="5"/>
    <!-- окно с дождём -->
    <g><rect x="60" y="300" width="300" height="300" fill="#141a34" stroke="#e8e4d8" stroke-width="16"/><path d="M210 300 V600" stroke="#e8e4d8" stroke-width="10"/>
      {"".join(f'<circle cx="{R(76, 344)}" cy="{R(316, 590)}" r="{R(3, 6)}" fill="#cfe2ff" opacity=".6"/>' for _ in range(40))}
      <circle cx="290" cy="520" r="26" fill="#ffd27a" opacity=".5"/><circle cx="130" cy="540" r="18" fill="#ff3b30" opacity=".45"/></g>
    <!-- доска с ключами от машин: бирки с ценами -->
    <g><rect x="430" y="250" width="290" height="300" fill="#d8c49a" stroke="{K}" stroke-width="7"/><text x="575" y="300" text-anchor="middle" {F} font-size="30" fill="#5b3a1e">КЛЮЧИ</text>
      {"".join(f'<g><circle cx="{x}" cy="{y}" r="6" fill="#151515"/><path d="M{x} {y} v20" stroke="#8a929b" stroke-width="4"/><rect x="{x - 12}" y="{y + 20}" width="24" height="40" rx="5" fill="#2b2b2b" stroke="{K}" stroke-width="3"/>'
                f'<rect x="{x + 10}" y="{y + 24}" width="34" height="22" fill="{c}" stroke="{K}" stroke-width="2" transform="rotate(14 {x + 10} {y + 24})"/></g>'
                for (x, y), c in zip([(470 + i * 60, 340 + j * 100) for j in range(2) for i in range(4)], ["#ffd23f", "#ff7a7a", "#ffd23f", "#9fd0ff", "#ff7a7a", "#ffd23f", "#9fd0ff", "#ffd23f"]))}</g>
    <!-- доска «ДОЛГИ» мелом от руки -->
    <g transform="rotate(2 905 400)"><rect x="770" y="240" width="270" height="330" fill="#22302a" stroke="#7a522b" stroke-width="14"/>
      <text x="905" y="300" text-anchor="middle" {C} font-size="48" fill="#f4f1e8">ДОЛГИ</text>
      <text x="790" y="356" {C} font-size="34" fill="#e8e4d8">Ашоту — 300</text><text x="790" y="402" {C} font-size="34" fill="#e8e4d8">Кредит — 450</text>
      <text x="790" y="448" {C} font-size="34" fill="#e8e4d8">Аренда — 60</text><path d="M790 470 h220" stroke="#e8e4d8" stroke-width="4"/>
      <text x="790" y="520" {C} font-size="40" fill="#ff7a7a">= 810 !!!</text></g>
    <!-- календарь -->
    <g><rect x="80" y="660" width="200" height="250" fill="#fff" stroke="{K}" stroke-width="5"/><rect x="80" y="660" width="200" height="110" fill="#2f6db5"/>
      <text x="180" y="730" text-anchor="middle" {F} font-size="28" fill="#fff">НОЯБРЬ</text>
      {"".join(f'<text x="{100 + (d % 7) * 26}" y="{800 + (d // 7) * 24}" {M} font-size="14" fill="#333">{d + 1}</text>' for d in range(30))}
      {"".join(f'<path d="M{96 + (d % 7) * 26} {788 + (d // 7) * 24} l18 16 M{114 + (d % 7) * 26} {788 + (d // 7) * 24} l-18 16" stroke="#c0392b" stroke-width="3"/>' for d in range(11))}</g>
    <!-- обогреватель-«дуйка» со спиралью -->
    <g><rect x="40" y="1000" width="200" height="160" rx="18" fill="#d9d4c8" stroke="{K}" stroke-width="6"/><rect x="60" y="1020" width="160" height="110" rx="10" fill="#3a1e10" stroke="{K}" stroke-width="4"/>
      {"".join(f'<path d="M70 {1034 + k * 18} q20 -10 40 0 t40 0 t40 0 t40 0" stroke="#ff7a1a" stroke-width="6" fill="none"/>' for k in range(5))}</g>
    <!-- стол Жоры: тетрадь, калькулятор, чайник, кружка -->
    <g><rect x="380" y="960" width="680" height="34" fill="#6b4a2b" stroke="{K}" stroke-width="6"/><path d="M410 994 V1240 M1030 994 V1240" stroke="#4e341d" stroke-width="20"/>
      <g transform="rotate(-5 560 940)"><rect x="470" y="918" width="200" height="44" fill="#2f6b3a" stroke="{K}" stroke-width="4"/><path d="M570 918 v44" stroke="{K}" stroke-width="3"/>
        <text x="520" y="948" text-anchor="middle" {C} font-size="22" fill="#fff">ДОЛГИ</text></g>
      <rect x="720" y="910" width="90" height="52" rx="6" fill="#2b2f37" stroke="{K}" stroke-width="4"/><rect x="730" y="918" width="70" height="16" fill="#cfe9c4"/>
      <path d="M880 962 v-70 q0 -24 40 -24 q40 0 40 24 v70 z" fill="#e8ecf0" stroke="{K}" stroke-width="5"/><path d="M960 900 q30 4 26 40" fill="none" stroke="{K}" stroke-width="6"/>
      <path d="M990 962 v-46 h44 v46 z" fill="#c0392b" stroke="{K}" stroke-width="4"/></g>
    <!-- пол: потёртый линолеум -->
    <rect y="1150" width="1080" height="770" fill="#5a5e4a"/><path d="M0 1150 H1080" stroke="{K}" stroke-width="7"/>
    <g fill="#4a4e3c">{"".join(f'<rect x="{x}" y="{y}" width="60" height="60" opacity=".6"/>' for x in range(0, 1080, 120) for y in range(1180, 1920, 120))}</g>
  </svg>
'''

# ---------- частный сектор на рассвете ----------
random.seed(53)
def house(x, w, roof, wall, trim):
    win = lambda wx: f'''<g><rect x="{wx}" y="800" width="80" height="100" fill="#ffd9a0" stroke="{K}" stroke-width="5"/><path d="M{wx + 40} 800 v100 M{wx} 850 h80" stroke="{K}" stroke-width="4"/>
      <path d="M{wx - 14} 800 l54 -34 l54 34 z" fill="{trim}" stroke="{K}" stroke-width="4"/><rect x="{wx - 14}" y="900" width="108" height="14" fill="{trim}" stroke="{K}" stroke-width="4"/>
      <rect x="{wx - 26}" y="796" width="18" height="110" fill="{trim}" stroke="{K}" stroke-width="3"/><rect x="{wx + 88}" y="796" width="18" height="110" fill="{trim}" stroke="{K}" stroke-width="3"/></g>'''
    return f'''<g><rect x="{x}" y="740" width="{w}" height="260" fill="{wall}" stroke="{K}" stroke-width="7"/>
      <g stroke="#00000022" stroke-width="5">{"".join(f'<path d="M{x} {y} h{w}"/>' for y in range(770, 1000, 30))}</g>
      <path d="M{x - 30} 744 L{x + w / 2} 600 L{x + w + 30} 744 Z" fill="{roof}" stroke="{K}" stroke-width="7"/>
      {win(x + w / 2 - 110)}{win(x + w / 2 + 50)}</g>'''

rassvet = HEAD + f'''    <defs><linearGradient id="rsSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5a6fae"/><stop offset=".45" stop-color="#f2a3a0"/><stop offset=".75" stop-color="#ffd59a"/><stop offset="1" stop-color="#fff0cf"/></linearGradient>
      <radialGradient id="rsSun"><stop offset="0" stop-color="#fffbe6"/><stop offset=".35" stop-color="#ffe7a8" stop-opacity=".9"/><stop offset="1" stop-color="#ffd59a" stop-opacity="0"/></radialGradient></defs>
    <rect width="1080" height="1920" fill="url(#rsSky)"/>
    <circle cx="700" cy="720" r="320" fill="url(#rsSun)"/><circle cx="700" cy="720" r="70" fill="#fffbe6"/>
    <g fill="#fff6dc" opacity=".25">{"".join(f'<path d="M700 720 L{700 + 1400 * __import__("math").cos(a / 10)} {720 + 1400 * __import__("math").sin(a / 10)} L{700 + 1400 * __import__("math").cos(a / 10 + .05)} {720 + 1400 * __import__("math").sin(a / 10 + .05)} Z"/>' for a in range(-32, 2, 3))}</g>
    <!-- дальний план: водонапорная башня, крыши, лес -->
    <path d="M0 760 Q200 700 380 740 T760 730 T1080 720 V800 H0 Z" fill="#c98f86" opacity=".7"/>
    <g fill="#b27e7a"><rect x="880" y="520" width="30" height="240"/><path d="M850 520 h90 l-10 -90 h-70 z"/><path d="M860 430 l35 -40 l35 40 z"/></g>
    {"".join(f'<path d="M{x} 780 l40 -60 l40 60 z" fill="#a8746e"/>' for x in range(-20, 1080, 70))}
    <rect y="760" width="1080" height="60" fill="#ffe3b8" opacity=".55"/>
    <!-- дома с наличниками -->
    {house(-60, 420, "#5a6a7a", "#6b8fae", "#f4f1e8")}{house(640, 460, "#8a5a33", "#c98a4a", "#f4f1e8")}
    <!-- берёза -->
    <g><path d="M470 1000 V560" stroke="#f4f1e8" stroke-width="26"/>{"".join(f'<path d="M462 {y} h16" stroke="{K}" stroke-width="5"/>' for y in range(600, 1000, 46))}
      {"".join(f'<ellipse cx="{470 + dx}" cy="{560 + dy}" rx="80" ry="60" fill="#c9b24a" stroke="{K}" stroke-width="4" opacity=".95"/>' for dx, dy in [(-60, 0), (50, -30), (0, -80), (70, 40), (-70, 70)])}</g>
    <!-- забор-штакетник и жёлтая газовая труба -->
    <g>{"".join(f'<path d="M{x} 1010 v-150 l14 -18 l14 18 v150 z" fill="#d6c3a0" stroke="{K}" stroke-width="4"/>' for x in range(0, 1080, 38))}
      <path d="M0 900 H1080 M0 980 H1080" stroke="#a88c62" stroke-width="10"/></g>
    <g><path d="M0 870 H1080" stroke="#f5c542" stroke-width="20"/><path d="M0 870 H1080" stroke="{K}" stroke-width="3" opacity=".5"/>
      {"".join(f'<path d="M{x} 880 V1010" stroke="#f5c542" stroke-width="10"/>' for x in (150, 520, 900))}
      <path d="M380 870 v-70 h60 v70" stroke="#f5c542" stroke-width="20" fill="none"/></g>
    <!-- калитка и скамейка -->
    <g><rect x="580" y="830" width="120" height="180" fill="#6b8fae" stroke="{K}" stroke-width="6"/><circle cx="680" cy="920" r="7" fill="#151515"/>
      <text x="640" y="800" text-anchor="middle" {M} font-size="22" fill="#151515" opacity=".8">УЛ. САДОВАЯ, 7</text></g>
    <g><rect x="740" y="960" width="180" height="16" fill="#8a5a33" stroke="{K}" stroke-width="4"/><path d="M760 976 v34 M900 976 v34" stroke="#5b3a1e" stroke-width="10"/></g>
    <!-- колонка -->
    <g><rect x="980" y="880" width="40" height="130" rx="10" fill="#3a7d5a" stroke="{K}" stroke-width="5"/><path d="M1000 880 v-30 h50" stroke="#3a7d5a" stroke-width="12" fill="none"/>
      <path d="M1020 930 h30 v10" stroke="#3a7d5a" stroke-width="10" fill="none"/></g>
    <!-- просёлок с колеёй и лужами -->
    <rect y="1010" width="1080" height="910" fill="#a8896a"/><path d="M0 1010 H1080" stroke="{K}" stroke-width="6"/>
    <g fill="none" stroke="#8e7254" stroke-width="16">{"".join(f'<path d="M{x} 1020 Q{x + 40} 1400 {x * 1.7 - 300} 1920"/>' for x in (300, 420, 680, 800))}</g>
    {"".join(f'<ellipse cx="{x}" cy="{y}" rx="{rx}" ry="{rx * .16:.0f}" fill="#f6c9a8" stroke="#7a6046" stroke-width="4"/>' for x, y, rx in [(260, 1240, 170), (780, 1380, 210), (420, 1660, 230), (900, 1780, 150)])}
    {"".join(f'<path d="M{R(10, 1070)} {R(1030, 1900)} l6 -16 l6 16" stroke="#6f8a3a" stroke-width="5" fill="none"/>' for _ in range(50))}
    <!-- туман -->
    <rect y="900" width="1080" height="260" fill="#fff4e0" opacity=".28"/>
  </svg>
'''

for n, s in (("obshaga", obshaga), ("zhlot", zhlot), ("zhlotday", zhlotday), ("vagonchik", vagonchik), ("rassvet", rassvet)):
    open(f"bg_{n}.svg.part", "w").write(s)
print("ok")
