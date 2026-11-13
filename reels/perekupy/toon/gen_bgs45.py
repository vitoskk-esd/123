# python3 gen_bgs45.py → фоны для отдельного ролика «ОГРАБЛЕНИЕ ВЕКА» (ep53, «Простой ролик 3», киношный формат):
# bg_logovo (логово банды ночью: бетонный ангар, лампа-конус, доска плана с фото и красными нитками, стол с рацией, ящики),
# bg_gorodutro (утренний проспект для погони: многоэтажки, светофор, разметка, солнце низко, пар из люка),
# bg_dvorutro (двор многоэтажки утром: подъезд с козырьком, лавка, детская горка, клумба-шина, рассвет)
import random
K = "#000"
HEAD = '  <svg id="bg" width="1080" height="1920" viewBox="0 0 1080 1920" style="position:absolute;left:0;top:0">\n'
F = 'font-family="Unbounded" font-weight="900"'
M = 'font-family="JetBrains Mono" font-weight="800"'
R = random.randint

random.seed(91)
logovo = HEAD + f'''    <rect width="1080" height="1920" fill="#14161c"/>
    <!-- бетонные плиты -->
    {"".join(f'<rect x="{x}" y="{y}" width="360" height="300" fill="#1c1f27" stroke="#0e1014" stroke-width="6"/>' for x in range(0, 1080, 360) for y in range(0, 1300, 300))}
    {"".join(f'<circle cx="{x + R(-10, 10)}" cy="{y + R(-10, 10)}" r="5" fill="#0e1014"/>' for x in range(30, 1080, 360) for y in range(30, 1300, 300))}
    <!-- лампа и конус света на доску -->
    <path d="M540 0 V120" stroke="#151515" stroke-width="6"/><path d="M470 120 h140 l-20 46 h-100 z" fill="#3a3f46" stroke="{K}" stroke-width="5"/><circle cx="540" cy="172" r="16" fill="#fff6c8"/>
    <path d="M490 176 L590 176 L960 1300 L120 1300 Z" fill="#fff6c8" opacity=".06"/>
    <!-- доска плана -->
    <rect x="150" y="300" width="780" height="560" fill="#c9a06a" stroke="#5b3a1e" stroke-width="16"/>
    {"".join(f'<rect x="{x}" y="{y}" width="150" height="110" fill="#f4f6f8" stroke="{K}" stroke-width="4" transform="rotate({R(-6, 6)} {x + 75} {y + 55})"/><rect x="{x + 15}" y="{y + 12}" width="120" height="70" fill="{c}"/>'
             for x, y, c in ((200, 340, "#8a929b"), (420, 330, "#5a6a8a"), (700, 350, "#a8845a"), (240, 620, "#6a8a5a"), (720, 640, "#8a5a5a")))}
    <path d="M275 400 L495 390 L775 410 M275 400 L315 680 M775 410 L795 700 M495 390 L540 560" stroke="#c0392b" stroke-width="5" fill="none"/>
    {"".join(f'<circle cx="{x}" cy="{y}" r="9" fill="#c0392b" stroke="{K}" stroke-width="3"/>' for x, y in ((275, 400), (495, 390), (775, 410), (315, 680), (795, 700), (540, 560)))}
    <circle cx="540" cy="580" r="78" fill="#fbfaf3" stroke="#c0392b" stroke-width="10"/><text x="540" y="574" text-anchor="middle" {F} font-size="26" fill="#c0392b">ЦЕЛЬ</text><text x="540" y="606" text-anchor="middle" {M} font-size="22" fill="#151515">LEXUS NX</text>
    <text x="440" y="820" {M} font-size="34" fill="#151515">08:00 → 08:07</text>
    <!-- пол, стол с рацией и ящики -->
    <rect y="1300" width="1080" height="620" fill="#22252e"/><path d="M0 1300 H1080" stroke="{K}" stroke-width="7"/>
    {"".join(f'<ellipse cx="{R(80, 1000)}" cy="{R(1360, 1880)}" rx="{R(60, 180)}" ry="{R(8, 18)}" fill="#1a1c24" opacity=".8"/>' for _ in range(8))}
    {"".join(f'<rect x="{x}" y="{1150 - h}" width="{w}" height="{h}" fill="#7a5a33" stroke="{K}" stroke-width="5"/><path d="M{x} {1150 - h} l{w} {h} M{x + w} {1150 - h} l-{w} {h}" stroke="#5b3a1e" stroke-width="4"/>' for x, w, h in ((-10, 150, 150), (950, 140, 220))) }
    <rect x="-10" y="1150" width="1100" height="150" fill="#2b2f37"/>
  </svg>
'''

random.seed(92)
gorodutro = HEAD + f'''    <defs><linearGradient id="gu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffb36a"/><stop offset=".6" stop-color="#ffe2b0"/><stop offset="1" stop-color="#fff2d8"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#gu)"/>
    <circle cx="820" cy="760" r="120" fill="#fff6d8"/><circle cx="820" cy="760" r="240" fill="#fff2c0" opacity=".35"/>
    <!-- многоэтажки в два плана -->
    {"".join(f'<rect x="{x}" y="{y}" width="{w}" height="{1100 - y}" fill="#c9a08a" opacity=".7"/>' for x, y, w in ((-20, 420, 220), (240, 300, 180), (560, 380, 200), (880, 260, 220)))}
    {"".join(f'<rect x="{x}" y="{y}" width="{w}" height="{1100 - y}" fill="{c}" stroke="{K}" stroke-width="5"/>' + "".join(f'<rect x="{x + 18 + i * 46}" y="{y + 30 + j * 70}" width="28" height="40" fill="{"#ffe2a0" if R(0, 5) == 0 else "#8a6a6a"}"/>' for i in range(w // 46 - 0) for j in range((1060 - y) // 70)) for x, y, w, c in ((0, 560, 280, "#a87a6a"), (330, 640, 230, "#8a6a7a"), (780, 540, 300, "#9a7a5a")))}
    <!-- светофор -->
    <path d="M640 1300 V820" stroke="#2b2f37" stroke-width="18"/><rect x="606" y="740" width="68" height="190" rx="14" fill="#2b2f37" stroke="{K}" stroke-width="5"/>
    {"".join(f'<circle cx="640" cy="{776 + k * 56}" r="20" fill="{c}"/>' for k, c in enumerate(("#5a2a2a", "#5a4a2a", "#4cd964")))}
    <!-- проспект -->
    <rect y="1100" width="1080" height="820" fill="#5b5f68"/><path d="M0 1100 H1080" stroke="{K}" stroke-width="7"/>
    <rect y="1100" width="1080" height="60" fill="#8a8f98"/>
    {"".join(f'<rect x="{x}" y="1480" width="120" height="16" fill="#f4f6f8"/>' for x in range(-40, 1080, 220))}
    {"".join(f'<ellipse cx="{R(100, 980)}" cy="{R(1560, 1880)}" rx="{R(60, 160)}" ry="{R(8, 16)}" fill="#4a4e56" opacity=".7"/>' for _ in range(6))}
    <ellipse cx="300" cy="1700" rx="80" ry="22" fill="#3a3e46" stroke="{K}" stroke-width="4"/>
  </svg>
'''

random.seed(93)
dvorutro = HEAD + f'''    <defs><linearGradient id="du" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9fd0f0"/><stop offset="1" stop-color="#ffe9c8"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#du)"/>
    <!-- панельная девятиэтажка -->
    <rect x="-20" y="160" width="1120" height="1000" fill="#d8d2c4" stroke="{K}" stroke-width="6"/>
    {"".join(f'<path d="M-20 {y} H1100" stroke="#b9b2a2" stroke-width="4"/>' for y in range(260, 1160, 100))}
    {"".join(f'<rect x="{x}" y="{y}" width="90" height="60" fill="{"#ffe2a0" if R(0, 6) == 0 else "#7aa6c8"}" stroke="{K}" stroke-width="4"/>' for x in range(40, 1080, 170) for y in range(190, 1000, 100))}
    <!-- подъезд с козырьком -->
    <rect x="420" y="900" width="240" height="260" fill="#6a4a3a" stroke="{K}" stroke-width="6"/><path d="M380 900 h320 l-20 -40 h-280 z" fill="#8a929b" stroke="{K}" stroke-width="5"/>
    <rect x="510" y="830" width="60" height="26" fill="#2f6db5"/><text x="540" y="851" text-anchor="middle" {F} font-size="18" fill="#fff">3</text>
    <!-- асфальт двора -->
    <rect y="1160" width="1080" height="760" fill="#7a7e86"/><path d="M0 1160 H1080" stroke="{K}" stroke-width="7"/>
    <!-- лавка, горка, клумба-шина -->
    <g><rect x="60" y="1230" width="240" height="24" rx="8" fill="#4f9d48" stroke="{K}" stroke-width="5"/><path d="M80 1254 v50 M280 1254 v50" stroke="#2b2f37" stroke-width="10"/></g>
    <g><path d="M860 1300 V1180 h60 V1300 M860 1180 q-70 0 -120 120" stroke="#c0392b" stroke-width="14" fill="none"/><path d="M860 1180 l-120 120" stroke="#ffd23f" stroke-width="20"/></g>
    <ellipse cx="200" cy="1420" rx="110" ry="36" fill="#1d1d1f" stroke="{K}" stroke-width="5"/><ellipse cx="200" cy="1408" rx="80" ry="22" fill="#ff6fae"/>
    {"".join(f'<circle cx="{R(140, 260)}" cy="{R(1392, 1416)}" r="9" fill="#ffd23f"/>' for _ in range(6))}
    {"".join(f'<ellipse cx="{R(100, 980)}" cy="{R(1500, 1880)}" rx="{R(60, 160)}" ry="{R(8, 16)}" fill="#6a6e76" opacity=".7"/>' for _ in range(7))}
  </svg>
'''

for n, s in (("logovo", logovo), ("gorodutro", gorodutro), ("dvorutro", dvorutro)):
    open(f"bg_{n}.svg.part", "w").write(s)
print("ok")
