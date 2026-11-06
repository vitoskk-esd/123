# python3 gen_bgs17.py → фоны девятнадцатого набора (ep29 «Перегон из Якутска»):
# bg_icecross (ледовая переправа через Лену: лёд до горизонта, тайга на том берегу, вешки-ёлочки, знак «ДО 3 Т», трещины, морозная дымка)
# bg_zimnik (ночная зимняя трасса в тайге: сугробы, ели, звёзды, километровый столб «ЛЕНА», колея)
import random
K = "#000"
random.seed(31)
HEAD = '  <svg id="bg" width="1080" height="1920" viewBox="0 0 1080 1920" style="position:absolute;left:0;top:0">\n'


def fir(x, y, h, c="#1f3b33", snow=True):
    w = h * .42
    p = f'<path d="M{x} {y - h} L{x - w} {y} L{x + w} {y} Z" fill="{c}" stroke="{K}" stroke-width="4"/>'
    if snow:
        p += f'<path d="M{x} {y - h} L{x - w * .35} {y - h * .62} q{w * .35} 8 {w * .7} 0 Z" fill="#f4f8fb"/>'
    return p


forest = "".join(fir(x, 760 + random.randint(-8, 8), random.randint(70, 130), random.choice(["#1f3b33", "#24453c", "#2c4f44"])) for x in range(-20, 1110, 34))
poles = "".join(f'<g><path d="M{x} {y} v-{h}" stroke="#3a2a1a" stroke-width="6"/>{fir(x, y - h + 40, 44, "#2c6b3f", False)}</g>'
                for x, y, h in [(220, 1080, 70), (330, 1000, 52), (400, 945, 40), (450, 905, 32), (860, 1080, 70), (750, 1000, 52), (680, 945, 40), (630, 905, 32)])
cracks = "".join(f'<path d="M{x} {y} l{random.randint(-60, 60)} {random.randint(20, 50)} l{random.randint(-50, 50)} {random.randint(20, 40)} l{random.randint(-40, 40)} {random.randint(10, 30)}" stroke="#7fa6c4" stroke-width="4" fill="none"/>'
                 for x, y in [(random.randint(0, 1080), random.randint(1150, 1800)) for _ in range(9)])
icecross = HEAD + f'''    <defs><linearGradient id="icSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9fc2de"/><stop offset=".7" stop-color="#e9eef3"/><stop offset="1" stop-color="#fbe3c4"/></linearGradient>
      <linearGradient id="icIce" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#dfeaf2"/><stop offset="1" stop-color="#b9d0e2"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#icSky)"/>
    <circle cx="820" cy="560" r="70" fill="#fff3d6" opacity=".9"/><ellipse cx="820" cy="560" rx="190" ry="60" fill="#fff" opacity=".35"/>
    <!-- дальний берег, тайга -->
    <path d="M0 740 Q300 690 540 720 T1080 700 V780 H0 Z" fill="#cfdbe4" stroke="{K}" stroke-width="4"/>
    {forest}
    <!-- лёд -->
    <rect y="780" width="1080" height="1140" fill="url(#icIce)"/><path d="M0 780 H1080" stroke="{K}" stroke-width="5"/>
    <g fill="#f6fafd" opacity=".8">{"".join(f'<ellipse cx="{random.randint(0, 1080)}" cy="{random.randint(820, 1880)}" rx="{random.randint(60, 160)}" ry="{random.randint(8, 18)}"/>' for _ in range(18))}</g>
    {cracks}
    <!-- ледовая дорога: расчищенная полоса, сужается к горизонту -->
    <path d="M480 790 L600 790 L1000 1920 L80 1920 Z" fill="#c4d6e4" stroke="#8fb0c8" stroke-width="5"/>
    <g stroke="#fff" stroke-width="6" opacity=".8"><path d="M540 800 L540 1920" stroke-dasharray="40 50"/></g>
    {poles}
    <!-- знак -->
    <g><path d="M120 1180 V900" stroke="#2b2f37" stroke-width="12"/><rect x="20" y="760" width="250" height="150" rx="12" fill="#1f4fb8" stroke="{K}" stroke-width="6"/>
      <text x="145" y="815" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="26" fill="#fff">ЛЕДОВАЯ</text>
      <text x="145" y="850" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="26" fill="#fff">ПЕРЕПРАВА</text>
      <text x="145" y="890" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="28" fill="#ffd23f">ДО 3 Т</text></g>
    <!-- морозная дымка -->
    <rect y="700" width="1080" height="160" fill="#fff" opacity=".25"/>
  </svg>
'''
stars = "".join(f'<circle cx="{random.randint(0, 1080)}" cy="{random.randint(0, 700)}" r="{random.choice([2, 2, 3, 4])}" fill="#fff" opacity="{random.choice([.5, .8, 1])}"/>' for _ in range(90))
taiga = "".join(fir(x, 900 + random.randint(-10, 10), random.randint(160, 260), random.choice(["#0f1f1b", "#13261f", "#182d26"])) for x in range(-40, 1120, 70))
zimnik = HEAD + f'''    <defs><linearGradient id="zmSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#070b1c"/><stop offset=".75" stop-color="#1b2a4a"/><stop offset="1" stop-color="#2f4a6e"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#zmSky)"/>{stars}
    <circle cx="200" cy="260" r="56" fill="#eef3ff"/><circle cx="220" cy="248" r="56" fill="#0e1530"/>
    {taiga}
    <!-- сугробы и трасса -->
    <path d="M0 900 Q260 870 540 900 T1080 890 V1920 H0 Z" fill="#c9d6e6" stroke="{K}" stroke-width="5"/>
    <path d="M430 905 L650 905 L1080 1920 L0 1920 Z" fill="#8e9db2" stroke="{K}" stroke-width="5"/>
    <g stroke="#6f7f96" stroke-width="10" fill="none" opacity=".8"><path d="M500 910 L250 1920"/><path d="M580 910 L830 1920"/></g>
    <g fill="#e4ecf5">{"".join(f'<ellipse cx="{x}" cy="{y}" rx="{random.randint(80, 160)}" ry="{random.randint(24, 40)}" stroke="{K}" stroke-width="4"/>' for x, y in [(60, 1150), (1010, 1180), (40, 1520), (1040, 1560)])}</g>
    <!-- километровый столб -->
    <g><rect x="880" y="980" width="40" height="150" fill="#f4f6f8" stroke="{K}" stroke-width="5"/><rect x="880" y="980" width="40" height="40" fill="#151515"/>
      <rect x="830" y="900" width="200" height="80" rx="8" fill="#1f6b3a" stroke="{K}" stroke-width="5"/>
      <text x="930" y="934" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="22" fill="#fff">«ЛЕНА»</text>
      <text x="930" y="964" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="22" fill="#fff">1 237 КМ</text></g>
    <!-- лёгкий туман у земли -->
    <rect y="860" width="1080" height="90" fill="#9fb3cf" opacity=".25"/>
  </svg>
'''
open("bg_icecross.svg.part", "w").write(icecross)
open("bg_zimnik.svg.part", "w").write(zimnik)
print("ok")
