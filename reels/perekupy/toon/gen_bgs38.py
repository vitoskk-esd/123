# python3 gen_bgs38.py → новые фоны для отдельной серии «Продаю сам» (ep46, рубрика «Схемы»):
# bg_taxiin (салон такси ночью: торпедо, руль, держатель телефона, шашечки, огни города в лобовом стекле),
# bg_stoyanka (платная стоянка ночью: будка охранника, шлагбаум, прожектор, сетка-забор, разметка),
# bg_ploshchadka (двор с детской площадкой на рассвете: качели, горка, рукоход, песочница, многоэтажка)
import random
K = "#000"
random.seed(50)
HEAD = '  <svg id="bg" width="1080" height="1920" viewBox="0 0 1080 1920" style="position:absolute;left:0;top:0">\n'
F = 'font-family="Unbounded" font-weight="900"'
M = 'font-family="JetBrains Mono" font-weight="800"'

# камера — на торпедо, смотрит на водителя: за ним передние сиденья, задний диван и заднее стекло с ночным городом.
# Руль и край приборной панели — отдельным слоем поверх героя (TAXI_DASH в сцене), чтобы он «сидел» в машине.
taxiin = HEAD + f'''    <defs><linearGradient id="txSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0c1430"/><stop offset="1" stop-color="#2a2152"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="#1b1d22"/>
    <!-- потолок и плафон -->
    <path d="M0 0 H1080 V200 Q540 260 0 200 Z" fill="#2b2d33" stroke="{K}" stroke-width="6"/><rect x="470" y="150" width="140" height="44" rx="12" fill="#fff6c8" stroke="{K}" stroke-width="4" opacity=".8"/>
    <!-- заднее стекло: ночной город -->
    <path d="M140 300 Q540 240 940 300 L900 700 L180 700 Z" fill="url(#txSky)" stroke="{K}" stroke-width="10"/>
    {"".join(f'<rect x="{x}" y="{y}" width="{w}" height="{700 - y}" fill="#1c2340" stroke="#0a0d1a" stroke-width="3"/>' for x, y, w in [(190, 480, 110), (310, 420, 90), (410, 520, 130), (550, 450, 100), (660, 400, 120), (790, 500, 100)])}
    {"".join(f'<rect x="{random.randint(200, 880)}" y="{random.randint(420, 690)}" width="10" height="13" fill="#ffd27a" opacity=".85"/>' for _ in range(50))}
    {"".join(f'<circle cx="{x}" cy="{y}" r="{r}" fill="{c}" opacity=".7" style="filter:blur(3px)"/>' for x, y, r, c in [(330, 670, 18, "#ff3b30"), (370, 674, 16, "#ff3b30"), (700, 660, 20, "#ffd27a")])}
    <!-- задний диван -->
    <path d="M100 700 H980 V1000 H100 Z" fill="#2f3138" stroke="{K}" stroke-width="7"/>
    <g stroke="#3b3e46" stroke-width="6">{"".join(f'<path d="M{x} 710 V990"/>' for x in range(250, 980, 180))}</g>
    <!-- спинки передних сидений (водитель — по центру, перед ней) -->
    <path d="M300 1000 q-10 -360 120 -380 q130 20 120 380 z" fill="#3b3f46" stroke="{K}" stroke-width="7"/>
    <path d="M760 1000 q-10 -300 110 -320 q120 20 110 320 z" fill="#3b3f46" stroke="{K}" stroke-width="7"/>
    <rect x="370" y="560" width="100" height="70" rx="18" fill="#45484f" stroke="{K}" stroke-width="5"/>
    <!-- салон: пол и обивка дверей -->
    <rect y="1000" width="1080" height="920" fill="#24262c"/><path d="M0 1000 H1080" stroke="{K}" stroke-width="7"/>
    <path d="M0 200 L120 300 L120 1000 L0 1100 Z" fill="#2b2d33" stroke="{K}" stroke-width="6"/><path d="M1080 200 L960 300 L960 1000 L1080 1100 Z" fill="#2b2d33" stroke="{K}" stroke-width="6"/>
  </svg>
'''

stoyanka = HEAD + f'''    <rect width="1080" height="1920" fill="#14182a"/>
    {"".join(f'<circle cx="{random.randint(0, 1080)}" cy="{random.randint(0, 420)}" r="2.5" fill="#fff" opacity=".6"/>' for _ in range(40))}
    <!-- дома вдали -->
    {"".join(f'<rect x="{x}" y="{y}" width="{w}" height="{900 - y}" fill="#1f2438" stroke="#0a0d1a" stroke-width="4"/>' for x, y, w in [(0, 380, 280), (300, 300, 240), (560, 420, 220), (800, 340, 280)])}
    {"".join(f'<rect x="{random.randint(10, 1060)}" y="{random.randint(320, 880)}" width="22" height="26" fill="#ffd27a" opacity=".7"/>' for _ in range(40))}
    <!-- прожектор -->
    <g><path d="M980 1000 V560" stroke="#2b2f37" stroke-width="14"/><rect x="930" y="520" width="100" height="56" fill="#e8ecf0" stroke="{K}" stroke-width="5"/>
      <path d="M940 570 L260 1400 L860 1400 Z" fill="#fff6c8" opacity=".12"/></g>
    <!-- забор-сетка -->
    <g stroke="#4a5568" stroke-width="5">{"".join(f'<path d="M{x} 800 V1000"/>' for x in range(0, 1081, 100))}<path d="M0 800 H1080"/></g>
    <g stroke="#3a4558" stroke-width="2">{"".join(f'<path d="M{x} 800 l100 200 M{x + 100} 800 l-100 200"/>' for x in range(-100, 1080, 50))}</g>
    <!-- будка охранника и шлагбаум -->
    <g><rect x="40" y="760" width="220" height="240" fill="#c9c2b0" stroke="{K}" stroke-width="7"/><path d="M20 770 h260 l-20 -40 h-220 z" fill="#8a5a33" stroke="{K}" stroke-width="6"/>
      <rect x="70" y="800" width="160" height="90" fill="#ffd27a" stroke="{K}" stroke-width="5" opacity=".9"/><text x="150" y="948" text-anchor="middle" {F} font-size="22" fill="#151515">ОХРАНА</text>
      <rect x="270" y="900" width="30" height="100" fill="#3b3f46" stroke="{K}" stroke-width="4"/><path d="M285 910 L700 860" stroke="#fff" stroke-width="22"/>
      {"".join(f'<path d="M{330 + i * 74} {907 - i * 9} l36 -4" stroke="#ff3b30" stroke-width="22"/>' for i in range(5))}</g>
    <rect x="720" y="700" width="230" height="70" rx="8" fill="#2f6db5" stroke="{K}" stroke-width="5"/><text x="835" y="746" text-anchor="middle" {F} font-size="30" fill="#fff">P 24/7</text>
    <!-- асфальт и разметка мест -->
    <rect y="1000" width="1080" height="920" fill="#33373f"/><path d="M0 1000 H1080" stroke="{K}" stroke-width="7"/>
    <g stroke="#e8ecf0" stroke-width="8" opacity=".7">{"".join(f'<path d="M{x} 1060 l-40 420"/>' for x in range(120, 1081, 220))}</g>
    {"".join(f'<ellipse cx="{random.randint(60, 1020)}" cy="{random.randint(1500, 1880)}" rx="{random.randint(40, 120)}" ry="10" fill="#2a2d34"/>' for _ in range(6))}
  </svg>
'''

ploshchadka = HEAD + f'''    <defs><linearGradient id="dawn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffb37a"/><stop offset=".6" stop-color="#ffe2b8"/><stop offset="1" stop-color="#d6ecf7"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#dawn)"/><circle cx="860" cy="420" r="90" fill="#ffd27a" opacity=".9"/>
    <!-- многоэтажка -->
    <rect x="40" y="220" width="560" height="780" fill="#e3dccd" stroke="{K}" stroke-width="8"/>
    {"".join(f'<rect x="{x}" y="{y}" width="70" height="76" fill="{"#ffd27a" if random.random() < .3 else "#9fc3e0"}" stroke="{K}" stroke-width="4"/>' for x in range(80, 580, 110) for y in range(260, 960, 110))}
    <!-- деревья -->
    {"".join(f'<g><path d="M{x} 1000 V840" stroke="#6b4a2b" stroke-width="18"/><ellipse cx="{x}" cy="790" rx="90" ry="120" fill="#5f9d48" stroke="{K}" stroke-width="6"/></g>' for x in (700, 980))}
    <!-- площадка: качели, горка, рукоход -->
    <g><path d="M620 1000 l60 -220 l60 220 M680 780 h200 M820 1000 l60 -220 l60 220" fill="none" stroke="#2f6db5" stroke-width="14"/>
      <path d="M740 780 v150 M800 780 v150" stroke="#8a929b" stroke-width="5"/><rect x="725" y="925" width="90" height="16" fill="#c0392b" stroke="{K}" stroke-width="4"/></g>
    <g><path d="M120 1000 v-180 h60 v180" fill="none" stroke="#e3a33a" stroke-width="12"/><path d="M180 830 q120 20 200 170" fill="none" stroke="#ff3b30" stroke-width="30" stroke-linecap="round"/>
      <path d="M120 900 h60 M120 960 h60" stroke="#e3a33a" stroke-width="8"/></g>
    <!-- газон, дорожка, песочница -->
    <rect y="1000" width="1080" height="920" fill="#8cc06a"/><path d="M0 1000 H1080" stroke="{K}" stroke-width="7"/>
    <path d="M380 1000 L700 1000 L900 1920 L180 1920 Z" fill="#b9b2a6" stroke="{K}" stroke-width="5"/>
    <g><rect x="760" y="1500" width="280" height="140" fill="#e8c77a" stroke="{K}" stroke-width="7"/><rect x="740" y="1480" width="320" height="30" fill="#8a5a33" stroke="{K}" stroke-width="6"/></g>
    {"".join(f'<path d="M{random.randint(20, 1060)} {random.randint(1040, 1900)} l6 -14 l6 14" stroke="#5f9d48" stroke-width="5" fill="none"/>' for _ in range(40))}
  </svg>
'''
for n, s in (("taxiin", taxiin), ("stoyanka", stoyanka), ("ploshchadka", ploshchadka)): open(f"bg_{n}.svg.part", "w").write(s)
print("ok")
