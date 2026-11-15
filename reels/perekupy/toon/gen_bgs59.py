# python3 gen_bgs59.py → фоны для ep67 «Гараж: мастер без цензуры» (киношный формат):
# bg_gskvorota (въезд в ГСК «МОТОР» вечером: шлагбаум, будка сторожа, ряд гаражных ворот с номерами, фонарь, слякоть),
# bg_yamaboks (бокс Гаврилыча: кафель, смотровая яма с жёлто-чёрным краем, щит с ключами, календарь 1998, переноска, верстак),
# bg_podyamoy (вид из смотровой ямы вверх: бетонные стены, ступени, полка с банками, лампа-переноска; днище машины — реквизит сверху)
import random
K = "#000"
HEAD = '  <svg id="bg" width="1080" height="1920" viewBox="0 0 1080 1920" style="position:absolute;left:0;top:0">\n'
F = 'font-family="Unbounded" font-weight="900"'
R = random.randint

random.seed(231)
vor = HEAD + f'''    <defs><linearGradient id="gv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c2236"/><stop offset=".55" stop-color="#3d4560"/><stop offset="1" stop-color="#6a6470"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#gv)"/>
    {"".join(f'<circle cx="{R(0, 1080)}" cy="{R(0, 600)}" r="{R(1, 3)}" fill="#fff" opacity="{R(3, 8) / 10}"/>' for _ in range(26))}
    <!-- ряд гаражей -->
    <rect x="-20" y="640" width="1120" height="620" fill="#8a7f72" stroke="{K}" stroke-width="7"/>
    <rect x="-20" y="610" width="1120" height="44" fill="#4a4a50" stroke="{K}" stroke-width="6"/>
    {"".join(f'<rect x="{x}" y="760" width="230" height="500" fill="{c}" stroke="{K}" stroke-width="7"/><path d="M{x + 115} 760 V1260" stroke="{K}" stroke-width="5"/><rect x="{x + 70}" y="800" width="90" height="56" rx="8" fill="#f4f0e8" stroke="{K}" stroke-width="4"/><text x="{x + 115}" y="840" text-anchor="middle" {F} font-size="30" fill="#151515">{n}</text>' for x, c, n in ((20, "#4f7a5a", "17"), (290, "#8a3a2a", "18"), (560, "#3f5f8a", "19"), (830, "#6b6b5a", "20")))}
    <!-- вывеска -->
    <rect x="270" y="470" width="540" height="110" rx="10" fill="#c0392b" stroke="{K}" stroke-width="7"/>
    <text x="540" y="545" text-anchor="middle" {F} font-size="52" fill="#fff">ГСК «МОТОР»</text>
    <!-- фонарь -->
    <path d="M980 1300 V420 q0 -40 -60 -40 h-40" stroke="#2b2f37" stroke-width="14" fill="none"/><path d="M850 370 h70 l-10 30 h-50 z" fill="#2b2f37"/><ellipse cx="885" cy="404" rx="30" ry="10" fill="#ffd27a"/>
    <path d="M855 404 L700 1300 H1070 L915 404 Z" fill="#ffd27a" opacity=".12"/>
    <!-- будка и шлагбаум -->
    <rect x="40" y="1080" width="190" height="230" fill="#e0d8c8" stroke="{K}" stroke-width="7"/><rect x="70" y="1120" width="130" height="80" fill="#ffd27a" stroke="{K}" stroke-width="5"/><path d="M30 1080 L135 1030 L240 1080 Z" fill="#5a5a62" stroke="{K}" stroke-width="6"/>
    <path d="M240 1250 H700" stroke="#c0392b" stroke-width="22" stroke-dasharray="60 40"/><path d="M240 1250 H700" stroke="{K}" stroke-width="28" opacity=".0"/><rect x="225" y="1230" width="34" height="90" fill="#2b2f37"/>
    <!-- слякоть -->
    <rect y="1300" width="1080" height="620" fill="#5f5a58"/><path d="M0 1300 H1080" stroke="{K}" stroke-width="7"/>
    {"".join(f'<ellipse cx="{R(0, 1080)}" cy="{R(1380, 1880)}" rx="{R(60, 170)}" ry="{R(12, 26)}" fill="#3e4250" opacity=".55"/>' for _ in range(14))}
    {"".join(f'<ellipse cx="{R(0, 1080)}" cy="{R(1340, 1900)}" rx="{R(20, 60)}" ry="{R(6, 12)}" fill="#e8ecf2" opacity=".5"/>' for _ in range(16))}
  </svg>
'''

random.seed(232)
boks = HEAD + f'''    <rect width="1080" height="1920" fill="#c9b98a"/>
    <!-- кафель по низу стен -->
    <rect y="760" width="1080" height="560" fill="#e8e4d8"/>{"".join(f'<path d="M0 {y} H1080" stroke="#b8b2a2" stroke-width="4"/>' for y in range(800, 1320, 60))}{"".join(f'<path d="M{x} 760 V1320" stroke="#b8b2a2" stroke-width="4"/>' for x in range(0, 1080, 90))}
    <!-- лампа под потолком -->
    <path d="M540 0 V120" stroke="#151515" stroke-width="6"/><path d="M490 120 h100 l30 50 h-160 z" fill="#3a3d46" stroke="{K}" stroke-width="5"/><ellipse cx="540" cy="174" rx="40" ry="12" fill="#fff6d0"/>
    <!-- щит с ключами -->
    <rect x="60" y="300" width="330" height="400" fill="#7a5a3a" stroke="{K}" stroke-width="7"/>{"".join(f'<circle cx="{x}" cy="{y}" r="6" fill="#151515"/><path d="M{x} {y} v{R(70, 120)}" stroke="#9aa4ae" stroke-width="{R(10, 16)}" stroke-linecap="round"/>' for x in range(95, 380, 45) for y in (340, 520))}
    <!-- календарь 1998 -->
    <rect x="740" y="300" width="260" height="340" fill="#fbf6ec" stroke="{K}" stroke-width="6"/><rect x="760" y="320" width="220" height="170" fill="#4a7ab0"/><path d="M780 470 l60 -90 l40 50 l30 -30 l50 70 z" fill="#d8e6f0"/><text x="870" y="560" text-anchor="middle" {F} font-size="52" fill="#c0392b">1998</text>
    <!-- верстак и канистры -->
    <rect x="720" y="1060" width="340" height="40" fill="#5a3820" stroke="{K}" stroke-width="6"/><rect x="740" y="1100" width="26" height="220" fill="#3a2a1a"/><rect x="1020" y="1100" width="26" height="220" fill="#3a2a1a"/>
    <rect x="760" y="960" width="90" height="100" rx="10" fill="#c0392b" stroke="{K}" stroke-width="5"/><rect x="870" y="980" width="70" height="80" rx="8" fill="#2f6db5" stroke="{K}" stroke-width="5"/>
    <!-- пол и яма -->
    <rect y="1320" width="1080" height="600" fill="#8a8680"/><path d="M0 1320 H1080" stroke="{K}" stroke-width="7"/>
    {"".join(f'<ellipse cx="{R(0, 1080)}" cy="{R(1400, 1880)}" rx="{R(40, 120)}" ry="{R(10, 22)}" fill="#3a3632" opacity=".45"/>' for _ in range(10))}
    <path d="M150 1420 H930 L990 1600 H90 Z" fill="#1e1c1a" stroke="{K}" stroke-width="7"/>
    <path d="M150 1420 H930" stroke="#ffd23f" stroke-width="18" stroke-dasharray="40 40"/><path d="M90 1600 H990" stroke="#ffd23f" stroke-width="18" stroke-dasharray="40 40"/>
  </svg>
'''

random.seed(233)
yama = HEAD + f'''    <rect width="1080" height="1920" fill="#2a2724"/>
    <!-- проём ямы сверху (там — днище машины) -->
    <rect x="80" y="0" width="920" height="560" fill="#4a4640"/>
    <!-- бетонные стены в перспективе -->
    <path d="M0 0 L80 0 L80 560 L300 1500 L0 1920 Z" fill="#6a655e" stroke="{K}" stroke-width="7"/>
    <path d="M1080 0 L1000 0 L1000 560 L780 1500 L1080 1920 Z" fill="#5e5a54" stroke="{K}" stroke-width="7"/>
    <path d="M80 560 H1000 L780 1500 H300 Z" fill="#3a3632" stroke="{K}" stroke-width="7"/>
    {"".join(f'<path d="M{R(10, 260)} {R(600, 1700)} l{R(20, 60)} {R(10, 50)}" stroke="#4a4640" stroke-width="5"/>' for _ in range(14))}
    <!-- полка с банками на левой стене -->
    <path d="M20 900 L230 1000" stroke="#5a3820" stroke-width="18"/>{"".join(f'<rect x="{x}" y="{y}" width="46" height="62" rx="6" fill="{c}" stroke="{K}" stroke-width="4"/>' for x, y, c in ((40, 845, "#c0392b"), (100, 872, "#e6c88a"), (160, 900, "#2f6db5")))}
    <!-- ступени в торце -->
    {"".join(f'<rect x="{430 + k * 6}" y="{1180 + k * 70}" width="{220 - k * 12}" height="40" fill="#5a5650" stroke="{K}" stroke-width="5"/>' for k in range(4))}
    <!-- пол ямы, лужа -->
    <path d="M300 1500 H780 L1080 1920 H0 Z" fill="#26231f"/><ellipse cx="560" cy="1720" rx="260" ry="50" fill="#3a4a5a" opacity=".6"/>
  </svg>
'''

for n, s in (("gskvorota", vor), ("yamaboks", boks), ("podyamoy", yama)):
    open(f"bg_{n}.svg.part", "w").write(s)
print("ok")
