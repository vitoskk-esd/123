# python3 gen_bgs72.py → фоны для ep80 «Толян · 19: открытие у Жоры» (сезон «Свой автосалон», без мата):
# bg_otkrytiezhory («ЖОРА МОТОРС» в день открытия: стеклянный фасад, вывеска, красная дорожка, сцена с колонками, флажки),
# bg_dvasalona (общий план с дороги: слева площадка Толяна под навесом бывшей АЗС, справа «ЖОРА МОТОРС», между ними дорога с зеброй),
# bg_ploshchadkasolnce (площадка Толяна солнечным утром: навес, будка, бурьян, солнечные блики, табличка «ОТКРЫТО»)
import random
K = "#000"
HEAD = '  <svg id="bg" width="1080" height="1920" viewBox="0 0 1080 1920" style="position:absolute;left:0;top:0">\n'
F = 'font-family="Unbounded" font-weight="900"'
R = random.randint

random.seed(361)
otkr = HEAD + f'''    <defs><linearGradient id="ozsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8ec5ea"/><stop offset="1" stop-color="#e8f2f6"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#ozsky)"/>
    {"".join(f'<ellipse cx="{R(0, 1080)}" cy="{R(100, 380)}" rx="{R(90, 170)}" ry="{R(24, 40)}" fill="#fff" opacity=".85"/>' for _ in range(4))}
    <!-- фасад: стекло, вывеска -->
    <rect x="-20" y="520" width="1120" height="720" fill="#3a3f52" stroke="{K}" stroke-width="8"/>
    <rect x="40" y="560" width="1000" height="150" fill="#c0392b" stroke="{K}" stroke-width="7"/><text x="540" y="665" text-anchor="middle" {F} font-size="92" fill="#fff">ЖОРА МОТОРС</text>
    {"".join(f'<rect x="{x}" y="760" width="230" height="440" fill="#8fb4d4" stroke="{K}" stroke-width="7"/><path d="M{x + 30} 790 l60 -0 M{x + 30} 820 l120 0" stroke="#d8ecf8" stroke-width="10"/>' for x in (40, 290, 560, 810))}
    <!-- флажки -->
    <path d="M0 470 Q540 540 1080 470" stroke="#151515" stroke-width="4" fill="none"/>{"".join(f'<path d="M{20 + k * 54} {476 + 64 * (1 - ((k * 54 - 520) / 540) ** 2)} l20 44 l20 -44 z" fill="{("#ff3b30", "#ffd23f", "#2f6db5", "#4cd964")[k % 4]}" stroke="{K}" stroke-width="3"/>' for k in range(20))}
    <!-- красная дорожка и сцена с колонками -->
    <rect y="1240" width="1080" height="680" fill="#8f939a"/><path d="M0 1240 H1080" stroke="{K}" stroke-width="6"/>
    <path d="M440 1240 H640 L760 1920 H320 Z" fill="#c0392b" stroke="{K}" stroke-width="6"/><path d="M460 1240 L350 1920 M620 1240 L730 1920" stroke="#ffd23f" stroke-width="8"/>
    {"".join(f'<rect x="{x}" y="1080" width="110" height="170" rx="12" fill="#1d1d1f" stroke="{K}" stroke-width="6"/><circle cx="{x + 55}" cy="1130" r="26" fill="#3a3c42" stroke="{K}" stroke-width="5"/><circle cx="{x + 55}" cy="1205" r="34" fill="#3a3c42" stroke="{K}" stroke-width="5"/>' for x in (60, 910))}
  </svg>
'''

random.seed(362)
dva = HEAD + f'''    <defs><linearGradient id="dssky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9fd0ec"/><stop offset="1" stop-color="#eef6f8"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#dssky)"/>
    <!-- слева: навес бывшей АЗС (площадка Толяна) -->
    <rect x="-20" y="620" width="440" height="70" fill="#d8d4cc" stroke="{K}" stroke-width="7"/><rect x="-20" y="676" width="440" height="14" fill="#c0392b"/>
    {"".join(f'<rect x="{x}" y="690" width="30" height="430" fill="#9aa0a6" stroke="{K}" stroke-width="5"/>' for x in (40, 340))}
    <!-- справа: «ЖОРА МОТОРС» с шарами -->
    <rect x="560" y="560" width="540" height="560" fill="#3a3f52" stroke="{K}" stroke-width="7"/><rect x="590" y="590" width="470" height="100" fill="#c0392b" stroke="{K}" stroke-width="6"/>
    <text x="825" y="660" text-anchor="middle" {F} font-size="50" fill="#fff">ЖОРА МОТОРС</text>
    {"".join(f'<rect x="{x}" y="730" width="140" height="330" fill="#8fb4d4" stroke="{K}" stroke-width="6"/>' for x in (600, 760, 920))}
    {"".join(f'<path d="M{x} 1120 V{y + 60}" stroke="#151515" stroke-width="2"/><ellipse cx="{x}" cy="{y}" rx="26" ry="32" fill="{c}" stroke="{K}" stroke-width="4"/>' for x, y, c in ((580, 520, "#ff3b30"), (612, 470, "#ffd23f"), (1060, 500, "#2f6db5"), (1030, 450, "#ff6fae"), (548, 470, "#4cd964")))}
    <!-- дорога с зеброй -->
    <rect y="1120" width="1080" height="800" fill="#6f747b"/><path d="M0 1120 H1080" stroke="{K}" stroke-width="6"/>
    <rect y="1120" width="1080" height="40" fill="#b8b2a4"/>{"".join(f'<rect x="{x}" y="1420" width="70" height="220" fill="#f4f0e8" opacity=".9" transform="skewX(-12)"/>' for x in range(140, 1080, 120))}
    <rect y="1880" width="1080" height="40" fill="#b8b2a4"/>
  </svg>
'''

random.seed(363)
solnce = HEAD + f'''    <defs><linearGradient id="pssky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd9a8"/><stop offset=".5" stop-color="#bfe0f2"/><stop offset="1" stop-color="#eef6f8"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#pssky)"/>
    <circle cx="900" cy="260" r="110" fill="#ffe08a"/>{"".join(f'<path d="M900 260 L{900 + 230 * __import__("math").cos(a / 6)} {260 + 230 * __import__("math").sin(a / 6)}" stroke="#ffe08a" stroke-width="10" opacity=".6"/>' for a in range(0, 38, 3))}
    <path d="M0 900 {"".join(f"L{x} {R(840, 890)} " for x in range(0, 1100, 90))} V1210 H0 Z" fill="#9ab88a"/>
    <!-- навес бывшей АЗС -->
    <rect x="60" y="560" width="960" height="90" fill="#e8e4dc" stroke="{K}" stroke-width="7"/><rect x="60" y="630" width="960" height="20" fill="#c0392b"/>
    {"".join(f'<rect x="{x}" y="650" width="44" height="560" fill="#a8aeb4" stroke="{K}" stroke-width="6"/>' for x in (180, 856))}
    <!-- будка с табличкой «ОТКРЫТО» -->
    <rect x="-20" y="900" width="190" height="310" fill="#f4f0e8" stroke="{K}" stroke-width="6"/><rect x="20" y="960" width="110" height="90" fill="#9ac8e8" stroke="{K}" stroke-width="5"/>
    <rect x="10" y="1080" width="140" height="56" fill="#4cd964" stroke="{K}" stroke-width="5"/><text x="80" y="1118" text-anchor="middle" {F} font-size="26" fill="#151515">ОТКРЫТО</text>
    <!-- асфальт с бликами -->
    <rect y="1210" width="1080" height="710" fill="#7f848a"/><path d="M0 1210 H1080" stroke="{K}" stroke-width="6"/>
    {"".join(f'<path d="M{R(0, 1080)} {R(1260, 1880)} l{R(-60, 60)} {R(20, 60)}" stroke="#5f646a" stroke-width="5" fill="none"/>' for _ in range(10))}
    {"".join(f'<path d="M{x} 1215 q-10 -50 6 -80 M{x + 10} 1215 q4 -60 22 -70" stroke="#6a9a3a" stroke-width="6" fill="none"/>' for x in (240, 980))}
  </svg>
'''

for n, s in (("otkrytiezhory", otkr), ("dvasalona", dva), ("ploshchadkasolnce", solnce)):
    open(f"bg_{n}.svg.part", "w").write(s)
print("ok")
