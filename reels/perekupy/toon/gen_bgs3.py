# python3 gen_bgs3.py → фоны пятого набора локаций (ep17 «Договор с того света»):
# bg_mreo (зал регистрации ГИБДД с очередью), bg_window (окно инспектора, вид от посетителя),
# bg_desk (стол сверху — для договора крупно), bg_dacha (дача бабы Гали, яблоня)
import random
K = "#000"
random.seed(17)
HEAD = '  <svg id="bg" width="1080" height="1920" viewBox="0 0 1080 1920" style="position:absolute;left:0;top:0">\n'

# ---------- зал регистрации: табло очереди, окна, стулья
windows = "".join(f'<g><rect x="{x}" y="640" width="200" height="300" fill="#2b3a40" stroke="{K}" stroke-width="7"/>'
                  f'<rect x="{x + 14}" y="654" width="172" height="200" fill="#9fc3c9" stroke="{K}" stroke-width="5"/>'
                  f'<path d="M{x + 14} {700 + i * 9} h172" stroke="#e8eef0" stroke-width="14" opacity=".8"/>'
                  f'<rect x="{x + 60}" y="590" width="80" height="44" rx="8" fill="#1d6fb8" stroke="{K}" stroke-width="5"/>'
                  f'<text x="{x + 100}" y="623" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="30" fill="#fff">{i + 1}</text></g>'
                  for i, x in enumerate((40, 300, 560, 820)))
chairs = "".join(f'<g><rect x="{x}" y="1310" width="110" height="90" rx="18" fill="#2e86de" stroke="{K}" stroke-width="6"/>'
                 f'<rect x="{x}" y="1390" width="110" height="34" rx="10" fill="#2573bf" stroke="{K}" stroke-width="6"/>'
                 f'<path d="M{x + 14} 1424 v70 M{x + 96} 1424 v70" stroke="#5c626b" stroke-width="10"/></g>' for x in range(30, 1080, 130))
mreo = HEAD + f'''    <defs><linearGradient id="mWall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfe3d6"/><stop offset="1" stop-color="#b6d2c1"/></linearGradient>
      <linearGradient id="mFloor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c9c2b3"/><stop offset="1" stop-color="#9d9586"/></linearGradient></defs>
    <rect width="1080" height="1100" fill="url(#mWall)"/>
    <rect y="1000" width="1080" height="100" fill="#8fb39f"/>
    <g fill="#f7fbff" stroke="{K}" stroke-width="5"><rect x="120" y="90" width="300" height="24" rx="10"/><rect x="660" y="90" width="300" height="24" rx="10"/></g>
    <!-- табло электронной очереди -->
    <g><rect x="230" y="200" width="620" height="300" rx="20" fill="#0d0f12" stroke="{K}" stroke-width="9"/>
      <text x="540" y="260" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="30" fill="#8b93a3">ЭЛЕКТРОННАЯ ОЧЕРЕДЬ</text>
      <text x="300" y="350" font-family="JetBrains Mono" font-weight="800" font-size="62" fill="#ff3b30">Б-346 → 2</text>
      <text x="300" y="440" font-family="JetBrains Mono" font-weight="800" font-size="62" fill="#4cd964">Б-347 → 3</text></g>
    <g><rect x="380" y="530" width="320" height="44" rx="8" fill="#fff" stroke="{K}" stroke-width="5"/>
      <text x="540" y="562" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="24" fill="#1d6fb8">РЕГИСТРАЦИЯ ТС</text></g>
    {windows}
    <rect y="1100" width="1080" height="820" fill="url(#mFloor)"/>
    <g stroke="#8a8274" stroke-width="4">{"".join(f'<path d="M{x} 1100 L{x * 1.6 - 324} 1920"/>' for x in range(0, 1081, 120))}{"".join(f'<path d="M0 {y} H1080"/>' for y in (1180, 1290, 1430, 1610, 1840))}</g>
    {chairs}
    <!-- фикус -->
    <g><path d="M990 1300 l-40 -200 M1000 1300 l10 -240 M1010 1300 l50 -190" stroke="#2d6a3e" stroke-width="10"/>
      {"".join(f'<ellipse cx="{x}" cy="{y}" rx="34" ry="16" fill="#3f9b57" stroke="{K}" stroke-width="4" transform="rotate({r} {x} {y})"/>' for x, y, r in [(950, 1110, -30), (1010, 1070, 20), (1060, 1120, 40), (970, 1180, 10), (1040, 1190, -20)])}
      <path d="M950 1300 h110 l-14 110 h-82 z" fill="#b5651d" stroke="{K}" stroke-width="6"/></g>
  </svg>
'''

# ---------- окно инспектора: вид от посетителя, стекло со щелью, жалюзи, стойка
window = HEAD + f'''    <defs><linearGradient id="wWall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfe3d6"/><stop offset="1" stop-color="#b3cfbe"/></linearGradient>
      <linearGradient id="wIn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a3138"/><stop offset="1" stop-color="#3b434c"/></linearGradient>
      <radialGradient id="wMon" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#9fd3ff" stop-opacity=".45"/><stop offset="1" stop-color="#9fd3ff" stop-opacity="0"/></radialGradient></defs>
    <rect width="1080" height="1920" fill="url(#wWall)"/>
    <rect x="90" y="560" width="900" height="760" fill="#e9ecef" stroke="{K}" stroke-width="10"/>
    <rect x="130" y="600" width="820" height="680" fill="url(#wIn)" stroke="{K}" stroke-width="6"/>
    <circle cx="700" cy="980" r="260" fill="url(#wMon)"/>
    <g><rect x="560" y="900" width="260" height="170" rx="10" fill="#111" stroke="{K}" stroke-width="6"/><rect x="574" y="914" width="232" height="142" fill="#2f6fb0"/>
      <path d="M690 1070 v40 h-50 h100" stroke="#111" stroke-width="12" fill="none"/></g>
    <g fill="#f2f4f6" stroke="#9aa3ab" stroke-width="3">{"".join(f'<rect x="130" y="{y}" width="820" height="26"/>' for y in range(600, 800, 30))}</g>
    <path d="M130 600 H950" stroke="{K}" stroke-width="8"/>
    <rect x="130" y="600" width="820" height="680" fill="#cfe8f7" opacity=".14"/>
    <path d="M200 640 l120 -40 M220 700 l180 -60" stroke="#fff" stroke-width="10" opacity=".35"/>
    <!-- щель для документов и стойка -->
    <rect x="80" y="1300" width="920" height="80" fill="#b07a4a" stroke="{K}" stroke-width="8"/>
    <rect x="380" y="1250" width="320" height="50" rx="10" fill="#1a1d22" stroke="{K}" stroke-width="6"/>
    <rect y="1380" width="1080" height="540" fill="#9a6a3e"/><path d="M0 1380 H1080" stroke="{K}" stroke-width="8"/>
    <g><rect x="410" y="470" width="260" height="70" rx="12" fill="#1d6fb8" stroke="{K}" stroke-width="6"/>
      <text x="540" y="519" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="38" fill="#fff">ОКНО 3</text></g>
    <g><rect x="760" y="1210" width="190" height="60" rx="6" fill="#f7f1e3" stroke="{K}" stroke-width="5"/>
      <text x="855" y="1247" text-anchor="middle" font-family="Onest" font-weight="700" font-size="22" fill="#333">ст. инспектор</text></g>
  </svg>
'''

# ---------- стол сверху: доски, кружка, ручка, ключи
planks = "".join(f'<rect x="0" y="{y}" width="1080" height="190" fill="{c}" stroke="#4a2e18" stroke-width="5"/>'
                 f'<path d="M0 {y + 60} q300 -20 600 6 t480 -4" stroke="#5c3a1f" stroke-width="3" fill="none" opacity=".5"/>'
                 for y, c in zip(range(0, 1920, 190), ["#8a5a33", "#93613a", "#875731", "#8f5e36"] * 3))
desk = HEAD + f'''    {planks}
    <g><circle cx="900" cy="300" r="120" fill="#f4f4f4" stroke="{K}" stroke-width="8"/><circle cx="900" cy="300" r="92" fill="#4a2c16"/>
      <path d="M1010 270 q70 0 70 40 q0 40 -70 40" stroke="{K}" stroke-width="18" fill="none"/></g>
    <circle cx="190" cy="1650" r="110" fill="none" stroke="#5a3a20" stroke-width="10" opacity=".4"/>
    <g transform="rotate(-25 880 1600)"><rect x="700" y="1585" width="360" height="30" rx="14" fill="#1d6fb8" stroke="{K}" stroke-width="5"/><path d="M700 1585 l-40 15 l40 15 z" fill="#d9d9d9" stroke="{K}" stroke-width="4"/></g>
    <g><circle cx="150" cy="380" r="34" fill="none" stroke="#c0c4ca" stroke-width="9"/><rect x="170" y="400" width="140" height="44" rx="12" fill="#2a2a2a" stroke="{K}" stroke-width="5" transform="rotate(30 170 400)"/></g>
  </svg>
'''

# ---------- дача: дом, штакетник, яблоня с яблоками, грядки, холмик с цветами под яблоней
apples = "".join(f'<circle cx="{random.randint(560, 960)}" cy="{random.randint(560, 860)}" r="16" fill="#e53935" stroke="{K}" stroke-width="4"/>' for _ in range(16))
dacha = HEAD + f'''    <defs><linearGradient id="dSky2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8ec5ff"/><stop offset="1" stop-color="#e3f1ff"/></linearGradient>
      <linearGradient id="dGrass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fbf5a"/><stop offset="1" stop-color="#5f8f3a"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#dSky2)"/>
    <g fill="#fff" opacity=".9"><ellipse cx="200" cy="260" rx="110" ry="40"/><ellipse cx="270" cy="240" rx="80" ry="40"/><ellipse cx="820" cy="180" rx="120" ry="40"/></g>
    <path d="M0 980 Q300 930 600 960 T1080 950 V1920 H0 Z" fill="url(#dGrass)"/>
    <!-- домик -->
    <g><rect x="60" y="700" width="380" height="300" fill="#c9893f" stroke="{K}" stroke-width="8"/>
      <path d="M30 710 L250 520 L470 710 Z" fill="#7a3b2e" stroke="{K}" stroke-width="8" stroke-linejoin="round"/>
      <rect x="130" y="770" width="110" height="100" fill="#cfe8f7" stroke="{K}" stroke-width="7"/><path d="M185 770 v100 M130 820 h110" stroke="{K}" stroke-width="5"/>
      <rect x="300" y="820" width="90" height="180" fill="#8a4f24" stroke="{K}" stroke-width="7"/><circle cx="372" cy="910" r="7" fill="#ffd23f"/>
      {"".join(f'<path d="M60 {y} H440" stroke="#a96f30" stroke-width="4"/>' for y in range(730, 1000, 30))}</g>
    <!-- яблоня -->
    <g><path d="M760 1100 C750 1000 770 920 740 860 M760 1000 C800 950 850 930 880 880" stroke="#6b4423" stroke-width="40" fill="none" stroke-linecap="round"/>
      <path d="M760 1100 C750 1000 770 920 740 860" stroke="{K}" stroke-width="6" fill="none" opacity=".4"/>
      {"".join(f'<circle cx="{x}" cy="{y}" r="{r}" fill="#4f9a3c" stroke="{K}" stroke-width="6"/>' for x, y, r in [(640, 760, 120), (760, 640, 150), (900, 720, 130), (820, 820, 120), (690, 860, 100)])}
      {apples}</g>
    <!-- холмик с цветами под яблоней -->
    <g><ellipse cx="900" cy="1150" rx="130" ry="44" fill="#7b5a3a" stroke="{K}" stroke-width="6"/>
      {"".join(f'<g><path d="M{x} 1140 v-34" stroke="#2d6a3e" stroke-width="5"/><circle cx="{x}" cy="1102" r="11" fill="{c}" stroke="{K}" stroke-width="3"/></g>' for x, c in [(850, "#ffd23f"), (885, "#ff7a1a"), (920, "#ffd23f"), (950, "#e53935")])}</g>
    <!-- штакетник -->
    <g fill="#e8d3a8" stroke="{K}" stroke-width="5">{"".join(f'<path d="M{x} 1340 v-150 l20 -24 l20 24 v150 z"/>' for x in range(-10, 1090, 56))}</g>
    <path d="M0 1230 H1080 M0 1310 H1080" stroke="#b8a074" stroke-width="12"/>
    <!-- грядки -->
    <g>{"".join(f'<rect x="{x}" y="{y}" width="300" height="70" rx="20" fill="#6d4c33" stroke="{K}" stroke-width="5"/>' for x, y in [(60, 1500), (520, 1560), (160, 1720)])}
      {"".join(f'<path d="M{x} {y} q10 -30 20 0 q10 -30 20 0" stroke="#3f8a35" stroke-width="7" fill="none"/>' for x, y in [(90, 1510), (180, 1510), (270, 1510), (560, 1570), (660, 1570), (760, 1570), (200, 1730), (300, 1730)])}</g>
  </svg>
'''

for n, s in [("mreo", mreo), ("window", window), ("desk", desk), ("dacha", dacha)]:
    open(f"bg_{n}.svg.part", "w").write(s)
print("ok")
