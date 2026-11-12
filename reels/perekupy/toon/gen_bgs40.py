# python3 gen_bgs40.py → фоны для отдельной серии «ПЕРЕГОН · 900 км за ночь» (ep48, киношный формат cine.js):
# bg_avtobus (междугородний автобус ночью: ряды кресел с чехлами, окна с размытыми огнями трассы, багажные полки, синие лампочки),
# bg_gostinica (стоянка у гостиницы ночью, снег: фасад с вывеской, фонарь, сугробы, разметка),
# bg_metel (вид из-за руля ночью в метель: лобовое, дворники, «ёлочка» на зеркале, приборка, столбики трассы, фары фуры вдали),
# bg_salonmark (салон Mark II — камера на торпедо смотрит на водителя: велюровые сиденья, заднее стекло со снегом),
# bg_kafe24 (придорожное кафе 24 часа, 3 ночи: витрина с пельменями, меню мелом, неон «24», окно в снег, клеёнка),
# bg_obochina (обочина трассы на рассвете: снежное поле, лес, розовое небо, километровый столб, дорожный знак, отбойник)
import random, math
K = "#000"
random.seed(60)
HEAD = '  <svg id="bg" width="1080" height="1920" viewBox="0 0 1080 1920" style="position:absolute;left:0;top:0">\n'
F = 'font-family="Unbounded" font-weight="900"'
M = 'font-family="JetBrains Mono" font-weight="800"'
C = 'font-family="Caveat" font-weight="700"'
R = random.randint
snow = lambda n, y0=0, y1=1920, a=.8: "".join(f'<circle cx="{R(0, 1080)}" cy="{R(y0, y1)}" r="{random.choice([2, 3, 3, 4, 5])}" fill="#fff" opacity="{a * random.uniform(.5, 1):.2f}"/>' for _ in range(n))

# ---------- автобус ночью
avtobus = HEAD + f'''    <defs><linearGradient id="abN" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a0f22"/><stop offset="1" stop-color="#1e2444"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="#2a3042"/>
    <!-- потолок, полки, синие лампочки -->
    <path d="M0 0 H1080 V240 Q540 300 0 240 Z" fill="#1f2433" stroke="{K}" stroke-width="6"/>
    <path d="M0 250 H1080 V330 H0 Z" fill="#3a4152" stroke="{K}" stroke-width="6"/><path d="M0 330 H1080" stroke="#151a26" stroke-width="10"/>
    {"".join(f'<circle cx="{x}" cy="200" r="9" fill="#5ab0ff"/><circle cx="{x}" cy="200" r="24" fill="#5ab0ff" opacity=".25"/>' for x in range(90, 1080, 180))}
    <g fill="#4a5163" stroke="{K}" stroke-width="4">{"".join(f'<rect x="{x}" y="262" width="150" height="56" rx="8"/>' for x in (40, 420, 800))}</g>
    <!-- окна: ночная трасса, огни размыты в полосы -->
    {"".join(f'<g><rect x="{x}" y="380" width="300" height="360" rx="26" fill="url(#abN)" stroke="#151a26" stroke-width="12"/>'
             + "".join(f'<rect x="{x + 10}" y="{y}" width="280" height="{R(4, 9)}" rx="4" fill="{c}" opacity=".55"/>' for y, c in [(R(560, 700), random.choice(["#ffd27a", "#ff7a3a", "#fff6c8"])) for _ in range(5)])
             + f'<path d="M{x + 10} 690 q140 -30 280 0 v40 h-280 z" fill="#0b0f1c"/></g>' for x in (20, 390, 760))}
    <g stroke="#e8e4d8" stroke-width="4" opacity=".5">{"".join(f'<path d="M{x + 30} 410 l60 -10"/>' for x in (20, 390, 760))}</g>
    <!-- шторки -->
    {"".join(f'<path d="M{x} 370 q30 180 -6 380 h44 q-20 -200 6 -380 z" fill="#7a2a3a" stroke="{K}" stroke-width="4"/>' for x in (330, 700))}
    <!-- ряды кресел (дальние → ближние) с белыми чехлами -->
    {"".join(f'<g><path d="M{x} {y} q0 -{h} {w / 2} -{h} q{w / 2} 0 {w / 2} {h} v{h * .9} h-{w} z" fill="#2f5b9a" stroke="{K}" stroke-width="6"/>'
             f'<path d="M{x + w * .15} {y - h * .78} h{w * .7} v{h * .32} h-{w * .7} z" fill="#f4f1e8" stroke="{K}" stroke-width="4"/>'
             f'<path d="M{x + w * .2} {y - h * .1} h{w * .6}" stroke="#244a80" stroke-width="5"/></g>'
             for x, y, w, h in [(60, 860, 200, 120), (300, 860, 200, 120), (600, 860, 200, 120), (840, 860, 200, 120),
                                (20, 1000, 260, 160), (300, 1000, 260, 160), (620, 1000, 260, 160), (900, 1000, 260, 160)])}
    <!-- пол-проход -->
    <rect y="1150" width="1080" height="770" fill="#3a3f4a"/><path d="M0 1150 H1080" stroke="{K}" stroke-width="7"/>
    <path d="M440 1150 L640 1150 L780 1920 L300 1920 Z" fill="#4a505c" stroke="{K}" stroke-width="4"/>
    {"".join(f'<path d="M{410 - (y - 1150) * .18} {y} H{670 + (y - 1150) * .18}" stroke="#2f343e" stroke-width="5"/>' for y in range(1200, 1920, 90))}
  </svg>
'''

# ---------- стоянка у гостиницы ночью
gostinica = HEAD + f'''    <rect width="1080" height="1920" fill="#0f1426"/>{snow(60, 0, 600, .6)}
    <!-- фасад гостиницы -->
    <rect x="80" y="200" width="920" height="820" fill="#3a3a4e" stroke="{K}" stroke-width="8"/>
    {"".join(f'<rect x="{x}" y="{y}" width="90" height="100" fill="{"#ffd27a" if random.random() < .45 else "#1c2236"}" stroke="{K}" stroke-width="5"/>' for x in range(130, 960, 140) for y in range(400, 900, 150))}
    <rect x="240" y="230" width="600" height="120" rx="16" fill="#151515" stroke="{K}" stroke-width="6"/>
    <text x="540" y="290" text-anchor="middle" {F} font-size="38" fill="#ff5a8a">ГОСТИНИЦА</text><text x="540" y="334" text-anchor="middle" {F} font-size="30" fill="#5ad0ff">«ВОЛЖАНКА»</text>
    <!-- вход с козырьком -->
    <rect x="440" y="860" width="200" height="160" fill="#ffe2a0" stroke="{K}" stroke-width="6"/><path d="M410 860 h260 l-20 -40 h-220 z" fill="#8a2a3a" stroke="{K}" stroke-width="6"/>
    <path d="M540 860 v160" stroke="{K}" stroke-width="5"/>
    <!-- фонарь -->
    <g><path d="M900 1040 V560 q0 -40 -60 -40 h-40" fill="none" stroke="#2b2f37" stroke-width="14"/><path d="M770 510 h70 l-10 24 h-50 z" fill="#e8ecf0" stroke="{K}" stroke-width="4"/></g>
    <!-- сугробы и асфальт со снегом -->
    <rect y="1020" width="1080" height="900" fill="#4a5060"/><path d="M0 1020 H1080" stroke="{K}" stroke-width="7"/>
    <path d="M0 1020 q120 -60 240 -10 q80 -40 170 0 V1060 H0 Z M700 1020 q130 -70 380 -20 V1060 H700 Z" fill="#e8eef5" stroke="{K}" stroke-width="5"/>
    <g stroke="#e8eef5" stroke-width="10" opacity=".55">{"".join(f'<path d="M{x} 1080 l-60 500"/>' for x in range(120, 1081, 300))}</g>
    {"".join(f'<ellipse cx="{R(40, 1040)}" cy="{R(1100, 1880)}" rx="{R(60, 160)}" ry="{R(10, 22)}" fill="#e8eef5" opacity=".5"/>' for _ in range(10))}
  </svg>
'''

# ---------- вид из-за руля в метель
metel = HEAD + f'''    <defs><radialGradient id="mtL" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff6d8"/><stop offset="1" stop-color="#fff6d8" stop-opacity="0"/></radialGradient>
      <linearGradient id="mtS" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#05070f"/><stop offset="1" stop-color="#1c2236"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#mtS)"/>
    <!-- дорога в свете фар -->
    <path d="M500 900 L580 900 L1080 1500 L0 1500 Z" fill="#3a4050"/><path d="M540 900 L540 1500" stroke="#e8e4d8" stroke-width="10" stroke-dasharray="40 50"/>
    <path d="M0 1500 L500 900 L380 900 L0 1250 Z M1080 1500 L580 900 L700 900 L1080 1250 Z" fill="#d6dde6"/>
    {"".join(f'<g><rect x="{540 + s * (60 + d * 1.2)}" y="{900 + d * .75}" width="{6 + d * .03}" height="{30 + d * .14}" fill="#f4f6f8" stroke="{K}" stroke-width="2"/><rect x="{540 + s * (60 + d * 1.2)}" y="{900 + d * .75}" width="{6 + d * .03}" height="{8 + d * .03}" fill="#ff3b30"/></g>' for d in (60, 180, 360) for s in (-1, 1))}
    <!-- фары фуры вдали -->
    <circle cx="520" cy="890" r="16" fill="#fff6d8"/><circle cx="560" cy="890" r="16" fill="#fff6d8"/><circle cx="540" cy="890" r="120" fill="url(#mtL)" opacity=".7"/>
    <ellipse cx="540" cy="1200" rx="520" ry="260" fill="#fff6d8" opacity=".08"/>
    {snow(160, 300, 1500, .9)}
    {"".join(f'<path d="M{x} {y} l{(x - 540) * .05:.0f} {(y - 900) * .05:.0f}" stroke="#fff" stroke-width="3" opacity=".6"/>' for x, y in [(R(0, 1080), R(300, 1500)) for _ in range(70)])}
    <!-- стойки и рамка лобового -->
    <path d="M0 200 L160 200 L40 1500 L0 1500 Z M1080 200 L920 200 L1040 1500 L1080 1500 Z" fill="#151518" stroke="{K}" stroke-width="6"/>
    <path d="M0 0 H1080 V240 Q540 180 0 240 Z" fill="#1d1d22" stroke="{K}" stroke-width="6"/>
    <!-- зеркало и «ёлочка» -->
    <rect x="460" y="236" width="160" height="56" rx="20" fill="#2b2b30" stroke="{K}" stroke-width="5"/><path d="M540 292 v60" stroke="#ddd" stroke-width="3"/>
    <path d="M540 350 l-40 70 h20 l-30 60 h100 l-30 -60 h20 z" fill="#4cd964" stroke="{K}" stroke-width="4"/>
    <!-- дворники -->
    <path d="M150 1440 L620 1060" stroke="#111" stroke-width="16" stroke-linecap="round"/><path d="M600 1460 L1000 1160" stroke="#111" stroke-width="14" stroke-linecap="round"/>
    <!-- торпедо, приборы, руль -->
    <path d="M0 1460 Q540 1380 1080 1460 V1920 H0 Z" fill="#1f1d22" stroke="{K}" stroke-width="8"/>
    <g><circle cx="420" cy="1600" r="70" fill="#0b0b0e" stroke="#555" stroke-width="5"/><circle cx="660" cy="1600" r="70" fill="#0b0b0e" stroke="#555" stroke-width="5"/>
      {"".join(f'<path d="M{cx + 52 * math.cos(a / 10)} {1600 + 52 * math.sin(a / 10)} l{8 * math.cos(a / 10):.1f} {8 * math.sin(a / 10):.1f}" stroke="#ff7a1a" stroke-width="4"/>' for cx in (420, 660) for a in range(-31, 2, 3))}
      <path d="M420 1600 l40 -36 M660 1600 l-20 -50" stroke="#ff3b30" stroke-width="6" stroke-linecap="round"/>
      <circle cx="420" cy="1600" r="90" fill="#ff7a1a" opacity=".08"/><circle cx="660" cy="1600" r="90" fill="#ff7a1a" opacity=".08"/></g>
    <path d="M200 1920 Q200 1560 540 1560 Q880 1560 880 1920" fill="none" stroke="#151515" stroke-width="70"/><path d="M200 1920 Q200 1560 540 1560 Q880 1560 880 1920" fill="none" stroke="#2b2b30" stroke-width="56"/>
  </svg>
'''

# ---------- салон Mark II, камера смотрит на водителя
salonmark = HEAD + f'''    <rect width="1080" height="1920" fill="#1b1a1e"/>
    <path d="M0 0 H1080 V200 Q540 250 0 200 Z" fill="#2b2a30" stroke="{K}" stroke-width="6"/>
    <!-- заднее стекло: метель, фары сзади -->
    <path d="M150 300 Q540 240 930 300 L890 700 L190 700 Z" fill="#0d1220" stroke="{K}" stroke-width="10"/>
    {snow(70, 300, 700, .9)}<circle cx="420" cy="640" r="20" fill="#fff6d8" opacity=".6"/><circle cx="470" cy="640" r="20" fill="#fff6d8" opacity=".6"/>
    <!-- задний диван — бордовый велюр -->
    <path d="M100 700 H980 V1000 H100 Z" fill="#5a1f2a" stroke="{K}" stroke-width="7"/>
    <g stroke="#4a1822" stroke-width="7">{"".join(f'<path d="M{x} 710 V990"/>' for x in range(220, 980, 140))}</g>
    <!-- спинки передних сидений -->
    <path d="M300 1000 q-10 -360 120 -380 q130 20 120 380 z" fill="#6b2a35" stroke="{K}" stroke-width="7"/><path d="M760 1000 q-10 -300 110 -320 q120 20 110 320 z" fill="#6b2a35" stroke="{K}" stroke-width="7"/>
    <rect x="370" y="560" width="100" height="70" rx="18" fill="#7a3340" stroke="{K}" stroke-width="5"/>
    <rect y="1000" width="1080" height="920" fill="#24222a"/><path d="M0 1000 H1080" stroke="{K}" stroke-width="7"/>
    <path d="M0 200 L120 300 L120 1000 L0 1100 Z M1080 200 L960 300 L960 1000 L1080 1100 Z" fill="#2b2a30" stroke="{K}" stroke-width="6"/>
    <path d="M10 360 L110 380 L110 700 L10 760 Z M1070 360 L970 380 L970 700 L1070 760 Z" fill="#0d1220" stroke="{K}" stroke-width="5"/>
  </svg>
'''

# ---------- придорожное кафе 24 часа
kafe24 = HEAD + f'''    <rect width="1080" height="1920" fill="#c9b48a"/>
    <g fill="#bba478">{"".join(f'<rect x="{x}" y="0" width="30" height="1150"/>' for x in range(0, 1080, 90))}</g>
    <rect width="1080" height="110" fill="#8a6d48" stroke="{K}" stroke-width="6"/>
    <!-- окно в метель (место для машины с котом — в сцене) -->
    <rect x="600" y="300" width="440" height="520" fill="#101628" stroke="#e8e4d8" stroke-width="18"/><path d="M820 300 V820" stroke="#e8e4d8" stroke-width="10"/>
    {"".join(f'<circle cx="{R(612, 1030)}" cy="{R(312, 810)}" r="{R(2, 5)}" fill="#fff" opacity=".8"/>' for _ in range(60))}
    <!-- неон «24» и меню мелом -->
    <g><rect x="640" y="160" width="160" height="100" rx="18" fill="#151515" stroke="{K}" stroke-width="5"/><text x="720" y="236" text-anchor="middle" {F} font-size="64" fill="#ff3b6a">24</text></g>
    <g transform="rotate(-2 290 330)"><rect x="80" y="170" width="420" height="330" fill="#22302a" stroke="#7a522b" stroke-width="14"/>
      <text x="290" y="230" text-anchor="middle" {C} font-size="50" fill="#f4f1e8">МЕНЮ</text>
      {"".join(f'<text x="110" y="{290 + k * 54}" {C} font-size="38" fill="#e8e4d8">{t}</text>' for k, t in enumerate(["Пельмени ........ 250", "Блины .............. 120", "Чай ..................... 50", "Кофе 3 в 1 .......... 60"]))}</g>
    <!-- холодильник-витрина и стойка -->
    <g><rect x="40" y="620" width="520" height="300" fill="#e8ecf0" stroke="{K}" stroke-width="7"/><rect x="60" y="640" width="480" height="200" fill="#bfe0f2" stroke="{K}" stroke-width="5"/>
      {"".join(f'<ellipse cx="{x}" cy="{y}" rx="34" ry="18" fill="#e8c77a" stroke="{K}" stroke-width="3"/>' for x in range(110, 520, 80) for y in (700, 780))}
      <text x="300" y="895" text-anchor="middle" {F} font-size="26" fill="#c0392b">ПИРОЖКИ · ПЕЛЬМЕНИ</text></g>
    <rect x="0" y="940" width="1080" height="60" fill="#8a5a33" stroke="{K}" stroke-width="7"/><rect x="0" y="1000" width="1080" height="150" fill="#6b4422" stroke="{K}" stroke-width="5"/>
    <!-- самовар и касса на стойке -->
    <g><path d="M120 940 v-90 q0 -30 50 -30 q50 0 50 30 v90 z" fill="#d9a03a" stroke="{K}" stroke-width="5"/><rect x="150" y="790" width="40" height="30" fill="#b9802a" stroke="{K}" stroke-width="4"/></g>
    <rect x="820" y="880" width="120" height="60" rx="6" fill="#2b2f37" stroke="{K}" stroke-width="4"/>
    <!-- пол-плитка -->
    <rect y="1150" width="1080" height="770" fill="#8e8a80"/>{"".join(f'<path d="M0 {y} H1080" stroke="#7a766c" stroke-width="5"/>' for y in range(1220, 1920, 110))}
    {"".join(f'<path d="M{x} 1150 L{x * 1.5 - 270} 1920" stroke="#7a766c" stroke-width="5"/>' for x in range(-180, 1300, 140))}
  </svg>
'''

# ---------- обочина на рассвете
obochina = HEAD + f'''    <defs><linearGradient id="obS" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a5a9a"/><stop offset=".5" stop-color="#f2a3b0"/><stop offset="1" stop-color="#ffd8b0"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#obS)"/>
    <circle cx="820" cy="820" r="120" fill="#fff0c8" opacity=".9"/><circle cx="820" cy="820" r="220" fill="#fff0c8" opacity=".25"/>
    <!-- лес полосой -->
    {"".join(f'<path d="M{x} 900 l{w / 2} -{h} l{w / 2} {h} z" fill="#3a4a5a" opacity=".85"/>' for x, w, h in [(x, R(40, 70), R(90, 180)) for x in range(-20, 1080, 34)])}
    <!-- снежное поле и дорога -->
    <rect y="900" width="1080" height="1020" fill="#eef2f8"/><path d="M0 900 H1080" stroke="{K}" stroke-width="5"/>
    <path d="M0 1080 L1080 1010 L1080 1240 L0 1380 Z" fill="#5a6070" stroke="{K}" stroke-width="5"/><path d="M0 1230 L1080 1125" stroke="#e8e4d8" stroke-width="8" stroke-dasharray="50 60"/>
    <path d="M0 1380 q300 -40 520 -60 q280 -20 560 -80 V1300 q-280 60 -560 80 q-220 20 -520 70 z" fill="#f8fafc" stroke="{K}" stroke-width="4"/>
    <!-- отбойник -->
    <path d="M0 1050 L1080 985" stroke="#c9ced6" stroke-width="18"/>{"".join(f'<path d="M{x} {1050 - x * .06} v40" stroke="#8a929b" stroke-width="8"/>' for x in range(40, 1080, 120))}
    <!-- километровый столб и знак -->
    <g><rect x="160" y="1300" width="40" height="150" fill="#f4f6f8" stroke="{K}" stroke-width="4"/><rect x="160" y="1300" width="40" height="30" fill="#151515"/><text x="180" y="1390" text-anchor="middle" {M} font-size="20" fill="#151515" transform="rotate(-90 180 1390)">750</text></g>
    <g><path d="M900 1010 V780" stroke="#8a929b" stroke-width="10"/><rect x="760" y="680" width="280" height="110" fill="#2f6db5" stroke="#fff" stroke-width="6"/>
      <text x="900" y="728" text-anchor="middle" {M} font-size="26" fill="#fff">ДОМОЙ  140</text><text x="900" y="770" text-anchor="middle" {M} font-size="26" fill="#fff">КАЗАНЬ 760</text></g>
    {"".join(f'<path d="M{R(0, 1080)} {R(1400, 1900)} q20 -8 40 0" stroke="#c9d6e3" stroke-width="5" fill="none"/>' for _ in range(30))}
  </svg>
'''

for n, s in (("avtobus", avtobus), ("gostinica", gostinica), ("metel", metel), ("salonmark", salonmark), ("kafe24", kafe24), ("obochina", obochina)):
    open(f"bg_{n}.svg.part", "w").write(s)
print("ok")
