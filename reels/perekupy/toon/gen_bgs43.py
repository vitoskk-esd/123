# python3 gen_bgs43.py → фоны для отдельной серии «ТОРГ · Дуэль» (ep51, «Простой ролик 2», киношный формат):
# bg_duelpolden (аллея гаражного кооператива в полдень: ворота в перспективе, пыль, столб с проводами, солнце в зените — вестерн),
# bg_duelzakat (та же аллея на закате — другой свет и тени),
# bg_boksarkady (гараж деда Аркадия: зелёные стены, плакат BMW, мотоцикл «Урал», стопка шин, верстак, лампа)
import random
K = "#000"
HEAD = '  <svg id="bg" width="1080" height="1920" viewBox="0 0 1080 1920" style="position:absolute;left:0;top:0">\n'
F = 'font-family="Unbounded" font-weight="900"'
M = 'font-family="JetBrains Mono" font-weight="800"'
R = random.randint


def alley(sunset):
    random.seed(70)
    sky = ('<stop offset="0" stop-color="#3a3a7a"/><stop offset=".5" stop-color="#ff8a5a"/><stop offset="1" stop-color="#ffd08a"/>' if sunset else
           '<stop offset="0" stop-color="#7fc0ee"/><stop offset=".7" stop-color="#dff0fa"/><stop offset="1" stop-color="#fff6e0"/>')
    sun = (f'<circle cx="540" cy="820" r="110" fill="#ffe2a0"/><circle cx="540" cy="820" r="220" fill="#ffd08a" opacity=".35"/>' if sunset else
           f'<circle cx="540" cy="160" r="80" fill="#fffbe6"/><circle cx="540" cy="160" r="170" fill="#fff6c8" opacity=".35"/>')
    wall, door, ground = ("#7a5a6a", ["#4a5a8a", "#6a3a4a", "#3a6a5a", "#7a5a3a"], "#b07a5a") if sunset else ("#c9c2b0", ["#2f6db5", "#c0392b", "#4f9d48", "#e8a33a"], "#d9c4a0")
    def side(s):          # ряд гаражей в перспективе: s = -1 левый, +1 правый
        out = []
        for k in range(6):
            x0 = 540 + s * (90 + k * 70); x1 = 540 + s * (90 + (k + 1) * 70 + (k + 1) * 40)
            far = 1 - k / 7; t0, b0 = 900 - 220 * (1 - far) * 0 - 60 * far, 1000
            y0 = 880 - 90 * k; y1 = 900 - 90 * (k + 1)
            out.append(f'<path d="M{x0} {y0} L{x1} {y1} L{x1} {1000 + 120 * (k + 1)} L{x0} {1000 + 120 * k} Z" fill="{wall}" stroke="{K}" stroke-width="5"/>')
            dx0, dx1 = x0 + (x1 - x0) * .15, x0 + (x1 - x0) * .85
            out.append(f'<path d="M{dx0} {y0 + 40 + 12 * k} L{dx1} {y1 + 40 + 12 * k} L{dx1} {1000 + 120 * (k + .85)} L{dx0} {1000 + 120 * (k + .15)} Z" fill="{door[k % 4]}" stroke="{K}" stroke-width="4"/>')
            out.append(f'<text x="{(dx0 + dx1) / 2}" y="{(y0 + y1) / 2 + 80}" text-anchor="middle" {M} font-size="{16 + k * 4}" fill="#fff" opacity=".8">№{12 + k * (s + 3)}</text>')
        return "".join(out)
    return HEAD + f'''    <defs><linearGradient id="dl{int(sunset)}" x1="0" y1="0" x2="0" y2="1">{sky}</linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#dl{int(sunset)})"/>{sun}
    <!-- дальний край аллеи: забор и тополя -->
    {"".join(f'<ellipse cx="{x}" cy="{R(700, 760)}" rx="{R(30, 50)}" ry="{R(90, 140)}" fill="{"#5a4a5a" if sunset else "#6a9a4a"}" opacity=".8"/>' for x in range(380, 720, 60))}
    <rect x="380" y="820" width="320" height="80" fill="{"#6a5a6a" if sunset else "#a8a29a"}" stroke="{K}" stroke-width="4"/>
    <!-- столб с проводами -->
    <g><path d="M180 1000 V380" stroke="#5b3a1e" stroke-width="20"/><path d="M120 420 h120" stroke="#5b3a1e" stroke-width="12"/>
      <path d="M120 430 Q560 560 1080 470 M240 430 Q600 600 1080 520" stroke="#151515" stroke-width="3" fill="none"/></g>
    <rect y="900" width="1080" height="1020" fill="{ground}"/>
    {side(1)}{side(-1)}
    <!-- пыльная дорога -->
    <path d="M470 900 L610 900 L1080 1920 L0 1920 Z" fill="{ground}"/><path d="M470 900 L610 900" stroke="{K}" stroke-width="4"/>
    {"".join(f'<path d="M{R(300, 780)} {R(1000, 1880)} q{R(20, 60)} -{R(4, 10)} {R(60, 120)} 0" stroke="{"#8a5a4a" if sunset else "#c0a47a"}" stroke-width="{R(4, 8)}" fill="none"/>' for _ in range(40))}
    {"".join(f'<ellipse cx="{R(100, 980)}" cy="{R(1500, 1880)}" rx="{R(80, 200)}" ry="{R(20, 40)}" fill="#fff6e0" opacity=".18"/>' for _ in range(5))}
  </svg>
'''


random.seed(71)
boksarkady = HEAD + f'''    <rect width="1080" height="1920" fill="#5f7f5a"/>
    <rect y="0" width="1080" height="560" fill="#6f8f6a"/><path d="M0 560 H1080" stroke="#4a6a45" stroke-width="10"/>
    {"".join(f'<path d="M{R(0, 1080)} {R(0, 1100)} q{R(10, 30)} {R(10, 40)} 0 {R(40, 90)}" stroke="#4a6a45" stroke-width="3" fill="none" opacity=".5"/>' for _ in range(30))}
    <!-- лампа и луч -->
    <path d="M540 0 V170" stroke="#151515" stroke-width="5"/><path d="M480 170 h120 l-16 40 h-88 z" fill="#c9ced6" stroke="{K}" stroke-width="5"/><circle cx="540" cy="222" r="18" fill="#fff6c8"/>
    <!-- плакат BMW и календарь -->
    <g transform="rotate(-3 220 360)"><rect x="80" y="220" width="280" height="300" fill="#151515" stroke="{K}" stroke-width="6"/><ellipse cx="220" cy="330" rx="90" ry="62" fill="none" stroke="#c9ced6" stroke-width="10"/><path d="M190 290 V360 H260" fill="none" stroke="#c9ced6" stroke-width="12" stroke-linecap="round"/><text x="220" y="470" text-anchor="middle" {F} font-size="34" fill="#f4f6f8">LS 400</text></g>
    <g><rect x="780" y="240" width="200" height="240" fill="#fff" stroke="{K}" stroke-width="5"/><rect x="780" y="240" width="200" height="70" fill="#c0392b"/><text x="880" y="290" text-anchor="middle" {F} font-size="30" fill="#fff">1994</text>
      <path d="M800 340 h160 M800 380 h160 M800 420 h120" stroke="#888" stroke-width="6"/></g>
    <!-- мотоцикл «Урал» с коляской (силуэт) -->
    <g><circle cx="200" cy="1000" r="70" fill="#1d1d1f" stroke="{K}" stroke-width="6"/><circle cx="420" cy="1000" r="70" fill="#1d1d1f" stroke="{K}" stroke-width="6"/>
      <path d="M200 1000 L280 880 H380 L420 1000 M280 880 l-30 -60 h60" stroke="#3a5a3a" stroke-width="22" fill="none" stroke-linejoin="round"/><rect x="290" y="840" width="110" height="50" rx="20" fill="#3a5a3a" stroke="{K}" stroke-width="5"/>
      <path d="M440 960 q60 -80 180 -60 q40 20 30 80 z" fill="#3a5a3a" stroke="{K}" stroke-width="6"/><circle cx="600" cy="1010" r="50" fill="#1d1d1f" stroke="{K}" stroke-width="6"/></g>
    <!-- шины и верстак -->
    {"".join(f'<ellipse cx="900" cy="{1040 - k * 46}" rx="110" ry="40" fill="#1d1d1f" stroke="{K}" stroke-width="5"/>' for k in range(4))}
    <g><rect x="620" y="560" width="400" height="30" fill="#8a5a33" stroke="{K}" stroke-width="5"/>{"".join(f'<path d="M{x} 560 v-50" stroke="#8a929b" stroke-width="10"/>' for x in (660, 720, 780))}</g>
    <rect y="1060" width="1080" height="860" fill="#6a6660"/><path d="M0 1060 H1080" stroke="{K}" stroke-width="7"/>
    {"".join(f'<ellipse cx="{R(60, 1020)}" cy="{R(1150, 1880)}" rx="{R(50, 140)}" ry="{R(10, 24)}" fill="#4a4640" opacity=".6"/>' for _ in range(7))}
  </svg>
'''

for n, s in (("duelpolden", alley(False)), ("duelzakat", alley(True)), ("boksarkady", boksarkady)):
    open(f"bg_{n}.svg.part", "w").write(s)
print("ok")
