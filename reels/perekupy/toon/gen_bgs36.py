# python3 gen_bgs36.py → новые фоны для отдельной серии «Столб, газета и бот» (ep44, деревня):
# bg_derevnya (сельская улица: магазин «ПРОДУКТЫ», столб с объявлениями, колодец, избы с наличниками, лужа),
# bg_dvor (двор Фёдора: низкий забор к соседу, дом Митрича за забором, стог сена, курятник, колесо трактора),
# bg_izba (в избе: печь, окно с наличниками, ходики, стол с самоваром — без ковра)
import random
K = "#000"
random.seed(48)
HEAD = '  <svg id="bg" width="1080" height="1920" viewBox="0 0 1080 1920" style="position:absolute;left:0;top:0">\n'
F = 'font-family="Unbounded" font-weight="900"'
M = 'font-family="JetBrains Mono" font-weight="800"'


def izba(x, y, w, h, wall="#a0703f", roof="#6b4a8a", win="#cfe8f5"):
    return (f'<g><rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{wall}" stroke="{K}" stroke-width="7"/>'
            + "".join(f'<path d="M{x} {yy} H{x + w}" stroke="#7a522b" stroke-width="4"/>' for yy in range(y + 30, y + h, 34))
            + f'<path d="M{x - 30} {y + 6} L{x + w / 2} {y - h * .55} L{x + w + 30} {y + 6} Z" fill="{roof}" stroke="{K}" stroke-width="7" stroke-linejoin="round"/>'
            + "".join(f'<g><rect x="{wx}" y="{y + h * .3}" width="{w * .2}" height="{h * .38}" fill="{win}" stroke="{K}" stroke-width="5"/>'
                      f'<path d="M{wx - 10} {y + h * .3} h{w * .2 + 20} l-10 -18 h-{w * .2} z" fill="#fff" stroke="{K}" stroke-width="4"/>'
                      f'<path d="M{wx + w * .1} {y + h * .3} v{h * .38}" stroke="{K}" stroke-width="3"/></g>' for wx in (x + w * .15, x + w * .62))
            + '</g>')


derevnya = HEAD + f'''    <rect width="1080" height="1920" fill="#cfe4f2"/><ellipse cx="820" cy="150" rx="150" ry="40" fill="#fff" opacity=".9"/><circle cx="160" cy="160" r="60" fill="#ffe38a"/>
    <!-- лес вдали -->
    {"".join(f'<path d="M{x} 760 l40 -140 l40 140 z" fill="#4f7a4a" stroke="{K}" stroke-width="4"/>' for x in range(-20, 1080, 60))}
    {izba(40, 560, 300, 260)}
    <!-- магазин «ПРОДУКТЫ» -->
    <g><rect x="560" y="520" width="480" height="380" fill="#e8dcc2" stroke="{K}" stroke-width="8"/><rect x="540" y="490" width="520" height="50" fill="#5b8a5a" stroke="{K}" stroke-width="7"/>
      <rect x="640" y="560" width="320" height="70" rx="8" fill="#c0392b" stroke="{K}" stroke-width="6"/><text x="800" y="608" text-anchor="middle" {F} font-size="38" fill="#fff">ПРОДУКТЫ</text>
      <rect x="610" y="660" width="140" height="240" fill="#6b4a2b" stroke="{K}" stroke-width="6"/><rect x="800" y="670" width="190" height="130" fill="#9fc3e0" stroke="{K}" stroke-width="6"/>
      <rect x="820" y="820" width="150" height="40" fill="#fff" stroke="{K}" stroke-width="4"/><text x="895" y="848" text-anchor="middle" {M} font-size="18" fill="#151515">8:00–20:00</text></g>
    <!-- колодец -->
    <g><rect x="380" y="820" width="130" height="90" fill="#8a929b" stroke="{K}" stroke-width="6"/><path d="M390 820 V700 M500 820 V700 M370 700 L445 650 L520 700 Z" fill="#6b4a2b" stroke="{K}" stroke-width="7"/></g>
    <!-- забор вдоль улицы -->
    <g>{"".join(f'<path d="M{x} 1000 v-110 l12 -14 l12 14 v110 z" fill="#c9a26b" stroke="{K}" stroke-width="4"/>' for x in range(0, 540, 30))}</g>
    <!-- дорога: грунт, лужи, колея -->
    <rect y="1000" width="1080" height="920" fill="#a08a6a"/><path d="M0 1000 H1080" stroke="{K}" stroke-width="7"/>
    <path d="M120 1920 L420 1000 M960 1920 L660 1000" stroke="#8a7458" stroke-width="40"/>
    {"".join(f'<ellipse cx="{x}" cy="{y}" rx="{rx}" ry="18" fill="#7f99b0" stroke="#5b6b7a" stroke-width="4" opacity=".9"/>' for x, y, rx in [(300, 1300, 120), (760, 1560, 160), (480, 1800, 100)])}
    {"".join(f'<path d="M{random.randint(20, 1060)} {random.randint(1050, 1900)} l6 -14 l6 14" stroke="#5f9d48" stroke-width="5" fill="none"/>' for _ in range(40))}
  </svg>
'''

dvor = HEAD + f'''    <rect width="1080" height="1920" fill="#d6ebf5"/><ellipse cx="280" cy="140" rx="170" ry="40" fill="#fff" opacity=".9"/>
    <!-- дом Митрича за забором -->
    {izba(520, 430, 420, 330, wall="#b98a5a", roof="#2f6db5")}
    <text x="730" y="455" text-anchor="middle" {M} font-size="20" fill="#151515">ул. Лесная, 12</text>
    <!-- курятник и стог (двор Фёдора) -->
    <g><rect x="40" y="620" width="240" height="190" fill="#8a6d48" stroke="{K}" stroke-width="7"/><path d="M20 630 L160 540 L300 630 Z" fill="#6b4a2b" stroke="{K}" stroke-width="7"/>
      <rect x="130" y="700" width="60" height="110" fill="#3b2a1a" stroke="{K}" stroke-width="5"/><path d="M190 810 l60 90" stroke="#6b4a2b" stroke-width="10"/></g>
    <g><path d="M300 900 q10 -220 120 -230 q110 10 120 230 z" fill="#e3c27a" stroke="{K}" stroke-width="7"/>
      {"".join(f'<path d="M{330 + i * 20} {880 - (i % 3) * 30} l8 -40" stroke="#c9a24a" stroke-width="4"/>' for i in range(10))}</g>
    <!-- низкий забор к соседу (через него разговаривают) -->
    <rect x="0" y="860" width="1080" height="20" fill="#8a5a33" stroke="{K}" stroke-width="4"/><rect x="0" y="940" width="1080" height="20" fill="#8a5a33" stroke="{K}" stroke-width="4"/>
    <g>{"".join(f'<path d="M{x} 1000 v-170 l14 -18 l14 18 v170 z" fill="#c9a26b" stroke="{K}" stroke-width="4"/>' for x in range(0, 1080, 34))}</g>
    <!-- двор: трава, колесо трактора, ведро -->
    <rect y="1000" width="1080" height="920" fill="#7fb05a"/><path d="M0 1000 H1080" stroke="{K}" stroke-width="7"/>
    <g><circle cx="900" cy="1180" r="110" fill="#2b2b2e" stroke="{K}" stroke-width="8"/><circle cx="900" cy="1180" r="55" fill="#c0392b" stroke="{K}" stroke-width="6"/>
      {"".join(f'<rect x="895" y="1068" width="10" height="24" fill="#151515" transform="rotate({i * 24} 900 1180)"/>' for i in range(15))}</g>
    <g><path d="M120 1500 h80 l-10 90 h-60 z" fill="#9aa3ad" stroke="{K}" stroke-width="5"/><path d="M125 1500 q35 -40 70 0" fill="none" stroke="{K}" stroke-width="4"/></g>
    {"".join(f'<path d="M{random.randint(20, 1060)} {random.randint(1040, 1900)} l6 -16 l6 16" stroke="#4f8a3a" stroke-width="5" fill="none"/>' for _ in range(60))}
  </svg>
'''

izba_in = HEAD + f'''    <rect width="1080" height="1920" fill="#c99b68"/>
    <g stroke="#a8784a" stroke-width="6">{"".join(f'<path d="M0 {y} H1080"/>' for y in range(60, 1000, 70))}</g>
    <!-- печь -->
    <g><rect x="40" y="380" width="360" height="620" fill="#f4efe2" stroke="{K}" stroke-width="8"/><rect x="20" y="340" width="400" height="50" fill="#e8e2d0" stroke="{K}" stroke-width="7"/>
      <path d="M130 760 h180 v-100 q-90 -70 -180 0 z" fill="#2b2b2e" stroke="{K}" stroke-width="7"/><rect x="160" y="120" width="120" height="220" fill="#f4efe2" stroke="{K}" stroke-width="7"/>
      <path d="M90 860 h260" stroke="#d9cdb4" stroke-width="10"/></g>
    <!-- окно с наличниками -->
    <g><rect x="560" y="300" width="300" height="320" fill="#bfe0f5" stroke="{K}" stroke-width="8"/><path d="M710 300 v320 M560 460 h300" stroke="{K}" stroke-width="6"/>
      <path d="M530 300 h360 l-30 -50 h-300 z" fill="#fff" stroke="{K}" stroke-width="6"/><path d="M540 620 h340 l-20 40 h-300 z" fill="#fff" stroke="{K}" stroke-width="6"/>
      <path d="M580 600 q20 -60 50 -40 M820 610 q-30 -50 -50 -30" stroke="#4f9d48" stroke-width="10" fill="none"/></g>
    <!-- ходики -->
    <g><rect x="930" y="220" width="110" height="140" rx="10" fill="#8a5a33" stroke="{K}" stroke-width="6"/><circle cx="985" cy="280" r="40" fill="#fff" stroke="{K}" stroke-width="5"/>
      <path d="M985 280 v-28 M985 280 h18" stroke="{K}" stroke-width="5"/><path d="M985 360 v120" stroke="#8a929b" stroke-width="4"/><circle cx="985" cy="490" r="14" fill="#ffd23f" stroke="{K}" stroke-width="4"/></g>
    <!-- пол и стол с самоваром -->
    <rect y="1000" width="1080" height="920" fill="#9a6b3f"/><path d="M0 1000 H1080" stroke="{K}" stroke-width="7"/>
    <g stroke="#835a33" stroke-width="5">{"".join(f'<path d="M0 {y} H1080"/>' for y in range(1080, 1920, 90))}</g>
    <g><rect x="480" y="1460" width="520" height="36" fill="#c9a26b" stroke="{K}" stroke-width="7"/><path d="M510 1496 v220 M970 1496 v220" stroke="#6b4a2b" stroke-width="16"/>
      <path d="M520 1460 h460 v18 h-460 z" fill="#fff" opacity=".8"/>
      <path d="M640 1460 q-10 -90 40 -120 h60 q50 30 40 120 z" fill="#e3b04a" stroke="{K}" stroke-width="6"/><rect x="680" y="1310" width="40" height="30" fill="#c9922a" stroke="{K}" stroke-width="5"/>
      <path d="M780 1400 h40" stroke="{K}" stroke-width="7"/><rect x="860" y="1420" width="50" height="40" rx="6" fill="#fff" stroke="{K}" stroke-width="4"/></g>
  </svg>
'''
for n, s in (("derevnya", derevnya), ("dvor", dvor), ("izba", izba_in)): open(f"bg_{n}.svg.part", "w").write(s)
print("ok")
