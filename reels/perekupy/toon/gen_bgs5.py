# python3 gen_bgs5.py → фоны седьмого набора локаций (ep19 «Шрот»):
# bg_shrot (авторазборка: горы кузовов, кран с магнитом, забор из профлиста), bg_container (контейнер-контора разборки),
# bg_hood (вид из моторного отсека вверх: открытый капот, лампа гаража)
import random
K = "#000"
random.seed(19)
HEAD = '  <svg id="bg" width="1080" height="1920" viewBox="0 0 1080 1920" style="position:absolute;left:0;top:0">\n'
COLS = ["#c0392b", "#2e86de", "#95a5a6", "#27ae60", "#8e44ad", "#d35400", "#7f8c8d", "#f1c40f"]


def wreck(x, y, w, h, c, rot=0):
    """смятый кузов сбоку: корпус, выбитые стёкла, ржавые пятна"""
    return (f'<g transform="rotate({rot} {x + w / 2} {y + h / 2})"><path d="M{x} {y + h} l{w * .06} {-h * .55} l{w * .22} {-h * .1} l{w * .12} {-h * .35} h{w * .3} l{w * .14} {h * .38} l{w * .16} {h * .08} v{h * .54} z" fill="{c}" stroke="{K}" stroke-width="6" stroke-linejoin="round"/>'
            f'<path d="M{x + w * .4} {y + h * .12} h{w * .26} l{w * .1} {h * .3} h{-w * .42} z" fill="#1c2230" stroke="{K}" stroke-width="4"/>'
            f'<ellipse cx="{x + w * .3}" cy="{y + h * .7}" rx="{w * .07}" ry="{h * .12}" fill="#8a4a1c" opacity=".8"/></g>')


piles = "".join(wreck(x, y, w, h, random.choice(COLS), r) for x, y, w, h, r in
                [(-40, 900, 380, 150, -6), (10, 780, 360, 140, 8), (40, 660, 330, 130, -4), (680, 920, 420, 160, 5), (720, 790, 360, 140, -7),
                 (760, 670, 320, 130, 4), (320, 980, 300, 120, 2)])
shrot = HEAD + f'''    <defs><linearGradient id="sSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8a96a8"/><stop offset="1" stop-color="#cfd5dd"/></linearGradient>
      <linearGradient id="sMud" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6d5a45"/><stop offset="1" stop-color="#4a3c2e"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#sSky)"/>
    <!-- забор из профлиста -->
    <rect y="760" width="1080" height="320" fill="#7c8a96" stroke="{K}" stroke-width="6"/><g stroke="#5f6c78" stroke-width="10">{"".join(f'<path d="M{x} 760 V1080"/>' for x in range(20, 1080, 40))}</g>
    <!-- кран с магнитом -->
    <g><path d="M520 1080 V360 L860 300" stroke="#f1c40f" stroke-width="26" fill="none"/><path d="M520 1080 V360 L860 300" stroke="{K}" stroke-width="4" fill="none"/>
      <path d="M840 304 V520" stroke="#333" stroke-width="5"/><ellipse cx="840" cy="540" rx="70" ry="26" fill="#3a3a40" stroke="{K}" stroke-width="6"/>
      <rect x="470" y="980" width="110" height="100" fill="#d4ac0d" stroke="{K}" stroke-width="6"/></g>
    {piles}
    <!-- вывеска -->
    <g><rect x="200" y="440" width="520" height="120" rx="10" fill="#151515" stroke="#ffd23f" stroke-width="8"/>
      <text x="460" y="495" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="40" fill="#ffd23f">АВТОРАЗБОРКА</text>
      <text x="460" y="540" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="26" fill="#fff">ЗАПЧАСТИ Б/У · МОТОРЫ</text>
      <path d="M300 560 V760 M620 560 V760" stroke="#333" stroke-width="12"/></g>
    <rect y="1080" width="1080" height="840" fill="url(#sMud)"/>
    <g fill="#3d3226" opacity=".7"><ellipse cx="260" cy="1500" rx="200" ry="30"/><ellipse cx="800" cy="1700" rx="240" ry="34"/><ellipse cx="560" cy="1300" rx="120" ry="18"/></g>
    {"".join(f'<g><ellipse cx="{x}" cy="{y}" rx="70" ry="24" fill="#1c1c1f" stroke="{K}" stroke-width="5"/><ellipse cx="{x}" cy="{y}" rx="30" ry="9" fill="#3a3a40"/></g>' for x, y in [(90, 1220), (90, 1190), (90, 1160), (980, 1260), (980, 1230)])}
  </svg>
'''

# ---------- контейнер-контора: гофра, полки с запчастями, стол с кассой, лампочка
shelf = lambda y: f'<rect x="40" y="{y}" width="430" height="16" fill="#6b4423" stroke="{K}" stroke-width="5"/>'
container = HEAD + f'''    <rect width="1080" height="1920" fill="#3d6b7a"/>
    <g stroke="#2f5562" stroke-width="16">{"".join(f'<path d="M{x} 0 V1300"/>' for x in range(30, 1080, 60))}</g>
    <rect y="1300" width="1080" height="620" fill="#5a4636"/><path d="M0 1300 H1080" stroke="{K}" stroke-width="7"/>
    <!-- лампочка -->
    <path d="M700 0 V220" stroke="#111" stroke-width="5"/><circle cx="700" cy="240" r="28" fill="#fff3c4" stroke="{K}" stroke-width="5"/><circle cx="700" cy="240" r="200" fill="#fff3c4" opacity=".12"/>
    <!-- полки с запчастями -->
    {shelf(520)}{shelf(760)}{shelf(1000)}
    <g>{"".join(f'<ellipse cx="{x}" cy="{y}" rx="40" ry="28" fill="#d9e4ee" stroke="{K}" stroke-width="5"/>' for x, y in [(100, 490), (200, 490)])}
      <rect x="280" y="440" width="150" height="80" fill="#c9a56b" stroke="{K}" stroke-width="5"/><text x="355" y="490" text-anchor="middle" font-family="Onest" font-weight="700" font-size="22">КОРОБКА</text>
      <rect x="70" y="680" width="120" height="80" fill="#7f8c8d" stroke="{K}" stroke-width="5"/><rect x="230" y="700" width="200" height="60" rx="10" fill="#c0392b" stroke="{K}" stroke-width="5"/>
      <circle cx="120" cy="950" r="46" fill="#2b2b2e" stroke="{K}" stroke-width="6"/><circle cx="120" cy="950" r="20" fill="#9aa3ab"/><rect x="220" y="930" width="220" height="70" fill="#5c626b" stroke="{K}" stroke-width="5"/></g>
    <!-- окно на разборку -->
    <rect x="600" y="420" width="420" height="280" fill="#cfd5dd" stroke="{K}" stroke-width="8"/>
    {wreck(620, 590, 220, 90, "#2e86de", -4)}{wreck(800, 600, 200, 80, "#c0392b", 6)}<path d="M810 420 V700 M600 560 H1020" stroke="{K}" stroke-width="6"/>
    <!-- календарь -->
    <rect x="620" y="760" width="200" height="240" fill="#fff" stroke="{K}" stroke-width="6"/><rect x="620" y="760" width="200" height="50" fill="#ff3b30"/>
    <text x="720" y="795" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="26" fill="#fff">НОЯБРЬ</text>
    <!-- стол с кассой -->
    <rect x="80" y="1160" width="920" height="60" fill="#8a5a33" stroke="{K}" stroke-width="7"/><rect x="120" y="1220" width="40" height="200" fill="#6b4423"/><rect x="920" y="1220" width="40" height="200" fill="#6b4423"/>
    <rect x="720" y="1060" width="200" height="100" rx="10" fill="#2b2f37" stroke="{K}" stroke-width="6"/><rect x="740" y="1075" width="100" height="30" fill="#4cd964"/>
  </svg>
'''

# ---------- вид из моторного отсека: края отсека снизу, открытый капот с упором, лампа гаража
hood = HEAD + f'''    <defs><radialGradient id="hLamp" cx=".5" cy=".3" r=".6"><stop offset="0" stop-color="#fff6d6" stop-opacity=".7"/><stop offset="1" stop-color="#fff6d6" stop-opacity="0"/></radialGradient></defs>
    <rect width="1080" height="1920" fill="#2a2f38"/>
    <rect width="1080" height="1920" fill="url(#hLamp)"/>
    <!-- потолок гаража и лампа -->
    <g stroke="#1c2027" stroke-width="10">{"".join(f'<path d="M0 {y} H1080"/>' for y in (120, 260, 400))}</g>
    <rect x="390" y="200" width="300" height="30" rx="12" fill="#f4fbff" stroke="{K}" stroke-width="6"/>
    <!-- открытый капот (вид снизу) -->
    <path d="M60 560 L1020 560 L940 160 L140 160 Z" fill="#e8ecef" stroke="{K}" stroke-width="10" stroke-linejoin="round"/>
    <path d="M200 520 L880 520 L830 220 L250 220 Z" fill="#c9ced6" stroke="#9aa3ab" stroke-width="6"/>
    <path d="M300 520 L340 240 M540 520 V220 M780 520 L740 240" stroke="#aab1ba" stroke-width="8"/>
    <path d="M900 1100 L960 560" stroke="#555" stroke-width="12"/>
    <!-- края моторного отсека снизу -->
    <path d="M0 1500 Q540 1380 1080 1500 V1920 H0 Z" fill="#14171c" stroke="{K}" stroke-width="10"/>
    <path d="M0 1100 L120 1500 L0 1500 Z M1080 1100 L960 1500 L1080 1500 Z" fill="#1d2128" stroke="{K}" stroke-width="8"/>
    <g><rect x="120" y="1560" width="260" height="140" rx="16" fill="#3a3f48" stroke="{K}" stroke-width="7"/><circle cx="250" cy="1630" r="40" fill="#ffd23f" stroke="{K}" stroke-width="6"/>
      <rect x="700" y="1560" width="240" height="160" rx="12" fill="#2b2f37" stroke="{K}" stroke-width="7"/><path d="M720 1600 h200 M720 1640 h200 M720 1680 h200" stroke="#555" stroke-width="6"/>
      <path d="M380 1640 Q540 1560 700 1640" stroke="#111" stroke-width="22" fill="none"/></g>
  </svg>
'''

for n, s in [("shrot", shrot), ("container", container), ("hood", hood)]:
    open(f"bg_{n}.svg.part", "w").write(s)
print("ok")
