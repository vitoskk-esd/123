# python3 gen_bgs6.py → фоны восьмого набора локаций (ep20 «Утопленник»):
# bg_flood (затопленный тоннель под мостом, ливень), bg_dryroom (гараж-«сушилка»: вентиляторы, лампа, тазики),
# bg_parking (парковка у супермаркета днём)
import random
K = "#000"
random.seed(20)
HEAD = '  <svg id="bg" width="1080" height="1920" viewBox="0 0 1080 1920" style="position:absolute;left:0;top:0">\n'
RAIN = '  <div id="rainfx" style="position:absolute;inset:0;pointer-events:none;z-index:40"></div>\n'

# ---------- затопленный тоннель: арка моста, бетон, вода до середины, мусор и пузыри
flood = HEAD + f'''    <defs><linearGradient id="fSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2b3445"/><stop offset="1" stop-color="#55607a"/></linearGradient>
      <linearGradient id="fWater" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6b7d5a" stop-opacity=".92"/><stop offset="1" stop-color="#3d4a33"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#fSky)"/>
    <!-- мост и арка тоннеля -->
    <rect y="380" width="1080" height="200" fill="#7c828c" stroke="{K}" stroke-width="8"/>
    <g stroke="#5f656e" stroke-width="6">{"".join(f'<path d="M{x} 380 V580"/>' for x in range(60, 1080, 120))}</g>
    <path d="M0 580 H1080 V1920 H0 Z" fill="#4a4f58"/>
    <path d="M120 1920 V900 Q540 560 960 900 V1920 Z" fill="#1c2027" stroke="{K}" stroke-width="10"/>
    <g fill="#ffd27a" opacity=".85">{"".join(f'<rect x="{x}" y="{y}" width="40" height="14" rx="6"/>' for x, y in [(330, 760), (520, 700), (710, 760)])}</g>
    <!-- знак ограничения высоты -->
    <g><circle cx="540" cy="480" r="62" fill="#fff" stroke="#e53935" stroke-width="16"/><text x="540" y="498" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="40">2,5м</text></g>
    <!-- вода -->
    <path d="M0 1240 Q270 1210 540 1240 T1080 1240 V1920 H0 Z" fill="url(#fWater)"/>
    <path d="M0 1240 Q270 1210 540 1240 T1080 1240" stroke="#cfe3c4" stroke-width="8" fill="none" opacity=".7"/>
    <g fill="none" stroke="#cfe3c4" stroke-width="5" opacity=".5">{"".join(f'<ellipse cx="{random.randint(60, 1020)}" cy="{random.randint(1300, 1880)}" rx="{random.randint(30, 80)}" ry="8"/>' for _ in range(10))}</g>
    <g><rect x="120" y="1250" width="70" height="40" rx="6" fill="#d35400" stroke="{K}" stroke-width="4" transform="rotate(-12 155 1270)"/>
      <ellipse cx="880" cy="1262" rx="44" ry="14" fill="#2e86de" stroke="{K}" stroke-width="4"/></g>
  </svg>
''' + RAIN

# ---------- гараж-«сушилка»: вентиляторы, лампа, тазики, бутылки «ёлочек»
fan = lambda x, y, r: (f'<g><circle cx="{x}" cy="{y}" r="{r}" fill="#dfe4ea" stroke="{K}" stroke-width="7"/>'
                       f'<g id="fanb{x}" style="transform-origin:{x}px {y}px">{"".join(f"<ellipse cx=\"{x}\" cy=\"{y - r * .5}\" rx=\"{r * .22}\" ry=\"{r * .45}\" fill=\"#9aa3ab\" stroke=\"{K}\" stroke-width=\"4\" transform=\"rotate({a} {x} {y})\"/>" for a in (0, 120, 240))}</g>'
                       f'<circle cx="{x}" cy="{y}" r="{r * .14}" fill="#5c626b"/><path d="M{x} {y + r} v{r * .9}" stroke="#555" stroke-width="12"/>'
                       f'<rect x="{x - r * .6}" y="{y + r * 1.9}" width="{r * 1.2}" height="20" rx="8" fill="#555" stroke="{K}" stroke-width="4"/></g>')
dryroom = HEAD + f'''    <rect width="1080" height="1920" fill="#3a3f48"/>
    <g stroke="#30343c" stroke-width="6">{"".join(f'<path d="M0 {y} H1080"/>' for y in range(80, 1200, 80))}</g>
    <path d="M540 0 V160" stroke="#111" stroke-width="5"/><path d="M460 160 h160 l-30 50 h-100 z" fill="#2b2f37" stroke="{K}" stroke-width="5"/>
    <path d="M540 210 L180 1300 L900 1300 Z" fill="#fff3c4" opacity=".14"/>
    <!-- полка с «ёлочками» -->
    <rect x="60" y="560" width="360" height="16" fill="#6b4423" stroke="{K}" stroke-width="5"/>
    {"".join(f'<path d="M{x} 556 l-16 -34 h10 l-14 -26 h40 l-14 26 h10 l-16 34 z" fill="#2ecc71" stroke="{K}" stroke-width="3"/>' for x in range(90, 420, 40))}
    <text x="240" y="620" text-anchor="middle" font-family="Onest" font-weight="700" font-size="24" fill="#cfd5dd">ёлочки ×10</text>
    <rect y="1200" width="1080" height="720" fill="#2b2f37"/><path d="M0 1200 H1080" stroke="{K}" stroke-width="7"/>
    {fan(140, 900, 110)}{fan(940, 900, 110)}
    <g><ellipse cx="300" cy="1560" rx="110" ry="30" fill="#7fa7c9" stroke="{K}" stroke-width="5"/><ellipse cx="780" cy="1620" rx="90" ry="24" fill="#7fa7c9" stroke="{K}" stroke-width="5"/></g>
    <g fill="#4a6b8a" opacity=".5"><ellipse cx="540" cy="1420" rx="300" ry="40"/></g>
  </svg>
'''

# ---------- парковка у супермаркета днём
parking = HEAD + f'''    <defs><linearGradient id="pSky3" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9cc9f0"/><stop offset="1" stop-color="#e2f0fb"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#pSky3)"/>
    <g fill="#fff" opacity=".9"><ellipse cx="220" cy="250" rx="120" ry="40"/><ellipse cx="860" cy="200" rx="140" ry="44"/></g>
    <rect x="60" y="560" width="960" height="460" fill="#e8e2d4" stroke="{K}" stroke-width="8"/>
    <rect x="60" y="560" width="960" height="110" fill="#c0392b" stroke="{K}" stroke-width="8"/>
    <text x="540" y="638" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="58" fill="#fff">ПРОДУКТЫ 24</text>
    <rect x="420" y="800" width="240" height="220" fill="#9fc3c9" stroke="{K}" stroke-width="7"/><path d="M540 800 V1020" stroke="{K}" stroke-width="6"/>
    <g fill="#9fc3c9" stroke="{K}" stroke-width="6"><rect x="120" y="720" width="220" height="160"/><rect x="740" y="720" width="220" height="160"/></g>
    <rect y="1020" width="1080" height="900" fill="#6f7680"/><path d="M0 1020 H1080" stroke="{K}" stroke-width="7"/>
    <g stroke="#f4f6f8" stroke-width="10">{"".join(f'<path d="M{x} 1150 L{x * 1.3 - 160} 1920"/>' for x in range(60, 1100, 240))}</g>
    <g><rect x="880" y="1080" width="110" height="80" rx="8" fill="#9aa3ab" stroke="{K}" stroke-width="5"/><path d="M890 1160 v40 M980 1160 v40" stroke="#333" stroke-width="8"/>
      <path d="M870 1080 l-30 -40" stroke="#333" stroke-width="8"/></g>
    <g fill="#3a3f48" opacity=".5"><ellipse cx="300" cy="1700" rx="160" ry="20"/></g>
  </svg>
'''

for n, s in [("flood", flood), ("dryroom", dryroom), ("parking", parking)]:
    open(f"bg_{n}.svg.part", "w").write(s)
print("ok")
