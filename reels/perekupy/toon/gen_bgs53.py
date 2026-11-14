# python3 gen_bgs53.py → фоны для ep61 «Рыбалка» (киношный формат):
# bg_ozero (замёрзшее озеро днём: бледное небо, низкое солнце, ельник по берегу, лёд со снегом, далёкие рыбаки и палатка, лунки),
# bg_podlyod (разрез подо льдом: сверху снег и небо, толща льда с трещинами и двумя лунками, вода с лучами, водоросли, пузыри),
# bg_rybbaza (рыбацкая база на берегу: бревенчатый домик «РЫБАЛКА · МОТЫЛЬ · ЧАЙ», дым из трубы, ели, сугробы, снегопад)
import random
K = "#000"
HEAD = '  <svg id="bg" width="1080" height="1920" viewBox="0 0 1080 1920" style="position:absolute;left:0;top:0">\n'
F = 'font-family="Unbounded" font-weight="900"'
R = random.randint


def firs(y0, n, hmin, hmax, col="#2f4a3a"):
    out = ""
    for _ in range(n):
        x, h = R(-40, 1120), R(hmin, hmax)
        out += f'<path d="M{x} {y0 - h} L{x - h * .32} {y0} H{x + h * .32} Z" fill="{col}" stroke="{K}" stroke-width="4"/><path d="M{x} {y0 - h} L{x - h * .14} {y0 - h * .55} H{x + h * .14} Z" fill="#f4f8fb"/>'
    return out


random.seed(171)
ozero = HEAD + f'''    <defs><linearGradient id="oz" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9cc8ea"/><stop offset="1" stop-color="#e8f2f8"/></linearGradient>
      <linearGradient id="oi" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#dbe9f2"/><stop offset="1" stop-color="#f6fafc"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#oz)"/>
    <circle cx="820" cy="420" r="90" fill="#fff6d0" opacity=".9"/>
    {firs(940, 26, 120, 260)}
    <rect y="930" width="1080" height="990" fill="url(#oi)"/><path d="M0 930 Q300 910 540 935 T1080 925" stroke="{K}" stroke-width="6" fill="none"/>
    {"".join(f'<ellipse cx="{R(0, 1080)}" cy="{R(980, 1880)}" rx="{R(80, 220)}" ry="{R(10, 24)}" fill="#fff" opacity=".8"/>' for _ in range(14))}
    {"".join(f'<path d="M{x} {y} q{R(60, 140)} {R(-8, 8)} {R(160, 260)} {R(-6, 6)}" stroke="#b9d3e2" stroke-width="3" fill="none"/>' for x, y in ((80, 1300), (600, 1500), (300, 1750), (760, 1180)))}
    <!-- далёкие рыбаки и палатка -->
    <path d="M150 1000 l50 -70 l50 70 z" fill="#e0261a" stroke="{K}" stroke-width="4"/>
    {"".join(f'<g><circle cx="{x}" cy="{y - 40}" r="10" fill="#2b2f37"/><rect x="{x - 12}" y="{y - 30}" width="24" height="30" rx="6" fill="{c}"/><ellipse cx="{x + 24}" cy="{y + 2}" rx="12" ry="4" fill="#20303a"/></g>' for x, y, c in ((420, 1000, "#2f6db5"), (700, 990, "#8a3a2a"), (920, 1010, "#5a6a3a")))}
  </svg>
'''

random.seed(172)
podlyod = HEAD + f'''    <defs><linearGradient id="pw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3f8fbf"/><stop offset=".5" stop-color="#1f5a88"/><stop offset="1" stop-color="#0b2240"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#pw)"/>
    <!-- лучи сквозь лунки -->
    {"".join(f'<path d="M{x - 50} 470 L{x - 260} 1920 H{x + 260} L{x + 50} 470 Z" fill="#cfefff" opacity=".13"/>' for x in (330, 800))}
    <!-- над льдом: небо и снег -->
    <rect width="1080" height="380" fill="#cfe6f5"/><rect y="330" width="1080" height="60" fill="#f6fafc"/>
    <!-- толща льда -->
    <path d="M0 380 H270 V480 H0 Z M390 380 H740 V480 H390 Z M860 380 H1080 V480 H860 Z" fill="#a9d6ee" fill-opacity=".9" stroke="{K}" stroke-width="5"/>
    {"".join(f'<path d="M{x} 390 l{R(-20, 20)} {R(20, 40)} l{R(-20, 20)} {R(20, 40)}" stroke="#e8f6fd" stroke-width="3" fill="none"/>' for x in (60, 180, 470, 600, 700, 940, 1030))}
    <!-- водоросли и камни на дне -->
    {"".join(f'<path d="M{x} 1920 q{R(-40, 40)} -{R(120, 200)} {R(-20, 20)} -{R(260, 420)}" stroke="#2f7a4a" stroke-width="{R(10, 18)}" fill="none" stroke-linecap="round"/>' for x in (40, 120, 230, 880, 960, 1050))}
    {"".join(f'<ellipse cx="{x}" cy="1900" rx="{R(60, 110)}" ry="{R(26, 40)}" fill="#3a4a5a" stroke="{K}" stroke-width="5"/>' for x in (180, 520, 900))}
    {"".join(f'<circle cx="{R(40, 1040)}" cy="{R(600, 1800)}" r="{R(4, 12)}" fill="none" stroke="#cfefff" stroke-width="3" opacity=".6"/>' for _ in range(22))}
  </svg>
'''

random.seed(173)
baza = HEAD + f'''    <defs><linearGradient id="rb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b8cfe0"/><stop offset="1" stop-color="#e6eef4"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#rb)"/>
    {firs(900, 18, 160, 320, "#33503e")}
    <!-- домик -->
    <rect x="200" y="560" width="640" height="560" fill="#8a5a33" stroke="{K}" stroke-width="7"/>
    {"".join(f'<path d="M200 {y} H840" stroke="#6b4423" stroke-width="5"/>' for y in range(600, 1120, 40))}
    <path d="M160 580 L520 340 L880 580 Z" fill="#f4f8fb" stroke="{K}" stroke-width="7"/>
    <rect x="680" y="380" width="60" height="140" fill="#6b4423" stroke="{K}" stroke-width="6"/>
    {"".join(f'<circle cx="{710 + k * 18}" cy="{350 - k * 60}" r="{30 + k * 8}" fill="#fff" opacity="{.75 - k * .15}"/>' for k in range(4))}
    <rect x="270" y="760" width="170" height="150" fill="#ffd27a" stroke="#f4f8fb" stroke-width="12"/><path d="M355 760 V910 M270 835 H440" stroke="#f4f8fb" stroke-width="8"/>
    <rect x="560" y="820" width="160" height="300" fill="#5a3820" stroke="{K}" stroke-width="7"/>
    <rect x="240" y="610" width="560" height="110" rx="12" fill="#fbf6ec" stroke="{K}" stroke-width="6"/>
    <text x="520" y="664" text-anchor="middle" {F} font-size="44" fill="#c0392b">РЫБАЛКА</text>
    <text x="520" y="706" text-anchor="middle" font-family="Onest" font-weight="800" font-size="30" fill="#2b2f37">мотыль · чай · прокат ледобуров</text>
    <!-- сугробы и стоянка -->
    <rect y="1120" width="1080" height="800" fill="#f2f7fa"/><path d="M0 1120 Q270 1090 540 1125 T1080 1110" stroke="{K}" stroke-width="6" fill="#f2f7fa"/>
    {"".join(f'<ellipse cx="{x}" cy="{y}" rx="{R(120, 240)}" ry="{R(30, 50)}" fill="#fff" stroke="#c9dbe6" stroke-width="4"/>' for x, y in ((100, 1160), (980, 1170), (560, 1880)))}
    {"".join(f'<path d="M{x} 1300 L{x - 80} 1920" stroke="#c9dbe6" stroke-width="16" opacity=".7"/>' for x in (380, 700))}
    {"".join(f'<circle cx="{R(0, 1080)}" cy="{R(0, 1900)}" r="{R(3, 7)}" fill="#fff" opacity=".85"/>' for _ in range(70))}
  </svg>
'''

for n, s in (("ozero", ozero), ("podlyod", podlyod), ("rybbaza", baza)):
    open(f"bg_{n}.svg.part", "w").write(s)
print("ok")
