# python3 gen_bgs16.py → фон восемнадцатого набора (ep28 «Жизнь одной четырки»):
# bg_airfield (дрифт-день на старом аэродроме: бетонка с разметкой, конусы, дым от шин, флажки, старт-арка, зрители за сеткой)
import random
K = "#000"
random.seed(30)
HEAD = '  <svg id="bg" width="1080" height="1920" viewBox="0 0 1080 1920" style="position:absolute;left:0;top:0">\n'

smoke = "".join(f'<ellipse cx="{x}" cy="{y}" rx="{random.randint(90, 180)}" ry="{random.randint(50, 90)}" fill="#e8ecf0" opacity="{random.choice([.35, .5, .65])}"/>' for x, y in
                [(random.randint(0, 1080), random.randint(1000, 1300)) for _ in range(14)])
flags = "".join(f'<path d="M{x} {300 + abs(((x // 60) % 6) - 3) * 8} l30 0 l-15 40 z" fill="{("#ff3b30", "#ffd23f", "#2e86de", "#4cd964")[(x // 60) % 4]}" stroke="{K}" stroke-width="3"/>' for x in range(0, 1080, 60))
airfield = HEAD + f'''    <defs><linearGradient id="afSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9cc9f0"/><stop offset="1" stop-color="#e6eef5"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#afSky)"/><ellipse cx="300" cy="170" rx="130" ry="36" fill="#fff"/><ellipse cx="840" cy="230" rx="110" ry="30" fill="#fff"/>
    <!-- ангар вдали -->
    <path d="M560 760 Q760 560 960 760 Z" fill="#8b93a3" stroke="{K}" stroke-width="6"/><rect x="560" y="760" width="400" height="120" fill="#7a8292" stroke="{K}" stroke-width="6"/>
    <rect x="700" y="790" width="120" height="90" fill="#2b2f37"/>
    <!-- старт-арка с флажками -->
    <path d="M20 1000 V260 M1060 1000 V260" stroke="#2b2f37" stroke-width="16"/><path d="M20 290 Q540 340 1060 290" stroke="#2b2f37" stroke-width="5" fill="none"/>{flags}
    <rect x="300" y="420" width="480" height="110" rx="12" fill="#151515" stroke="{K}" stroke-width="6"/>
    <text x="540" y="497" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="58" fill="#ff7a1a">DRIFT DAY</text>
    <!-- сетка и зрители -->
    <rect y="880" width="1080" height="120" fill="#a7c4a0"/>
    <g stroke="#5c626b" stroke-width="3" opacity=".8">{"".join(f'<path d="M{x} 860 L{x + 40} 1000 M{x + 40} 860 L{x} 1000"/>' for x in range(0, 1080, 40))}</g>
    {"".join(f'<g><circle cx="{x}" cy="910" r="18" fill="{c}" stroke="{K}" stroke-width="4"/><rect x="{x - 20}" y="928" width="40" height="50" rx="10" fill="{d}" stroke="{K}" stroke-width="4"/></g>' for x, c, d in [(80, "#e8b48c", "#2e86de"), (170, "#c99b78", "#ffd23f"), (260, "#e8b48c", "#4cd964"), (860, "#c99b78", "#ff3b30"), (960, "#e8b48c", "#151515")])}
    <!-- бетонка -->
    <rect y="1000" width="1080" height="920" fill="#8a8f96"/><path d="M0 1000 H1080" stroke="{K}" stroke-width="6"/>
    <g stroke="#7a7f86" stroke-width="5">{"".join(f'<path d="M0 {y} H1080"/>' for y in range(1100, 1920, 140))}{"".join(f'<path d="M{x} 1000 V1920"/>' for x in range(0, 1080, 270))}</g>
    <g fill="#fff">{"".join(f'<rect x="{x}" y="1560" width="120" height="18" rx="4"/>' for x in range(20, 1080, 220))}</g>
    <!-- следы шин -->
    <g stroke="#2b2b2e" stroke-width="16" fill="none" opacity=".55"><path d="M-40 1450 Q400 1250 1120 1380"/><path d="M-40 1490 Q400 1290 1120 1420"/></g>
    <!-- конусы -->
    {"".join(f'<g><path d="M{x - 26} {y} L{x} {y - 70} L{x + 26} {y} Z" fill="#ff7a1a" stroke="{K}" stroke-width="5"/><path d="M{x - 14} {y - 30} h28" stroke="#fff" stroke-width="8"/><rect x="{x - 34}" y="{y}" width="68" height="12" fill="#ff7a1a" stroke="{K}" stroke-width="4"/></g>' for x, y in [(120, 1320), (420, 1250), (760, 1290), (980, 1350)])}
    <g>{smoke}</g>
  </svg>
'''
open("bg_airfield.svg.part", "w").write(airfield)
print("ok")
