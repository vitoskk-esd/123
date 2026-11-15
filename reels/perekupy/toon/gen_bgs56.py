# python3 gen_bgs56.py → фоны для ep64 «Тёща: машина на дачу» (киношный формат):
# bg_zalteshi (зал у тёщи вечером: ковёр на стене, сервант с хрусталём, люстра, фотографии в рамках, телевизор с салфеткой, обои в цветочек),
# bg_dvorteshi (двор хрущёвки днём: пятиэтажка, лавочка у подъезда, бельё на верёвке, клумба в шине, тополь),
# bg_dachaogorod (дача утром: грядки, теплица из поликарбоната, домик, забор из штакетника, бочка с водой, подсолнухи)
import random
K = "#000"
HEAD = '  <svg id="bg" width="1080" height="1920" viewBox="0 0 1080 1920" style="position:absolute;left:0;top:0">\n'
F = 'font-family="Unbounded" font-weight="900"'
R = random.randint

random.seed(201)
zal = HEAD + f'''    <rect width="1080" height="1920" fill="#e8d6b0"/>
    {"".join(f'<g opacity=".35"><circle cx="{x}" cy="{y}" r="10" fill="#c0392b"/><circle cx="{x + 14}" cy="{y + 8}" r="7" fill="#6abf69"/></g>' for x in range(30, 1080, 110) for y in range(60, 1240, 120))}
    <!-- ковёр на стене -->
    <rect x="200" y="160" width="680" height="480" fill="#8a1a2a" stroke="{K}" stroke-width="7"/>
    <rect x="230" y="190" width="620" height="420" fill="none" stroke="#e6b422" stroke-width="10"/>
    <path d="M540 210 L820 400 L540 590 L260 400 Z" fill="#2f5a8a" stroke="#e6b422" stroke-width="8"/><path d="M540 290 L700 400 L540 510 L380 400 Z" fill="#c0392b" stroke="#e6b422" stroke-width="6"/>
    {"".join(f'<path d="M{x} 640 v24" stroke="#e6b422" stroke-width="5"/>' for x in range(210, 880, 20))}
    <!-- люстра -->
    <path d="M540 0 V90" stroke="#5a3820" stroke-width="6"/>{"".join(f'<path d="M540 100 Q{540 + d} 110 {540 + d * 1.4} 150" stroke="#e6b422" stroke-width="6" fill="none"/><circle cx="{540 + d * 1.4}" cy="158" r="14" fill="#fff6d0"/>' for d in (-80, -40, 40, 80))}
    <!-- сервант -->
    <rect x="20" y="700" width="300" height="540" fill="#6b4423" stroke="{K}" stroke-width="7"/><rect x="40" y="720" width="260" height="260" fill="#cfe8f5" stroke="{K}" stroke-width="5"/>
    {"".join(f'<path d="M{x} {y} l14 -40 h22 l14 40 z" fill="#e8f6ff" stroke="#7fb6d6" stroke-width="3"/>' for x in (60, 130, 200) for y in (840, 960))}
    <!-- телевизор с салфеткой -->
    <rect x="780" y="760" width="260" height="200" rx="14" fill="#2b2f37" stroke="{K}" stroke-width="7"/><rect x="800" y="780" width="220" height="160" fill="#3a4a5a"/>
    <path d="M790 760 q120 -30 240 0 l-20 30 h-200 z" fill="#fbf6ec" stroke="#c9b48a" stroke-width="3"/><rect x="760" y="960" width="300" height="280" fill="#8a5a33" stroke="{K}" stroke-width="7"/>
    <!-- пол -->
    <rect y="1240" width="1080" height="680" fill="#9a6a3f"/><path d="M0 1240 H1080" stroke="{K}" stroke-width="7"/>
    <ellipse cx="540" cy="1640" rx="460" ry="120" fill="#7a2a3a" opacity=".8"/>
  </svg>
'''

random.seed(202)
dvor = HEAD + f'''    <defs><linearGradient id="dt" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9fd0f0"/><stop offset="1" stop-color="#e2f2fb"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#dt)"/>
    <!-- пятиэтажка -->
    <rect x="-20" y="200" width="1120" height="1000" fill="#d9c8a8" stroke="{K}" stroke-width="7"/>
    {"".join(f'<rect x="{x}" y="{y}" width="110" height="120" fill="#a8cfe8" stroke="#fbf6ec" stroke-width="10"/>' for x in range(40, 1080, 190) for y in range(250, 1000, 180))}
    <rect x="440" y="960" width="200" height="240" fill="#5a3820" stroke="{K}" stroke-width="7"/><path d="M400 950 h280 l-30 -40 h-220 z" fill="#8a8f98" stroke="{K}" stroke-width="5"/>
    <!-- бельё на верёвке -->
    <path d="M60 1120 Q300 1160 540 1120" stroke="#151515" stroke-width="3" fill="none"/>
    {"".join(f'<rect x="{x}" y="{1130 + (x - 300) ** 2 // 4000}" width="70" height="{R(70, 110)}" fill="{c}" stroke="{K}" stroke-width="3"/>' for x, c in ((120, "#ff8a8a"), (230, "#fbf6ec"), (340, "#8ad0ff"), (440, "#ffd23f")))}
    <!-- тополь -->
    <path d="M980 1240 V800" stroke="#5a3820" stroke-width="26"/><ellipse cx="980" cy="700" rx="130" ry="220" fill="#4a8a3a" stroke="{K}" stroke-width="6"/>
    <!-- асфальт, лавочка, клумба в шине -->
    <rect y="1200" width="1080" height="720" fill="#8f939b"/><path d="M0 1200 H1080" stroke="{K}" stroke-width="7"/>
    <rect x="660" y="1220" width="260" height="22" fill="#8a5a33" stroke="{K}" stroke-width="5"/><path d="M680 1242 v40 M900 1242 v40" stroke="{K}" stroke-width="8"/>
    <ellipse cx="160" cy="1300" rx="110" ry="36" fill="#2b2f37" stroke="{K}" stroke-width="5"/><ellipse cx="160" cy="1290" rx="80" ry="22" fill="#6a4a2a"/>
    {"".join(f'<circle cx="{x}" cy="1270" r="16" fill="{c}" stroke="{K}" stroke-width="3"/>' for x, c in ((120, "#ff3b30"), (160, "#ffd23f"), (200, "#ff7ae6")))}
  </svg>
'''

random.seed(203)
dacha = HEAD + f'''    <defs><linearGradient id="dg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8ccdf2"/><stop offset="1" stop-color="#e6f4fb"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#dg)"/>
    <circle cx="880" cy="230" r="80" fill="#fff6c8"/>
    <!-- домик -->
    <rect x="60" y="560" width="400" height="420" fill="#c9a06a" stroke="{K}" stroke-width="7"/><path d="M30 580 L260 380 L490 580 Z" fill="#8a3a2a" stroke="{K}" stroke-width="7"/>
    <rect x="140" y="680" width="120" height="120" fill="#a8cfe8" stroke="#fbf6ec" stroke-width="10"/><rect x="320" y="740" width="100" height="240" fill="#6b4423" stroke="{K}" stroke-width="6"/>
    <!-- теплица -->
    <path d="M560 980 V720 Q760 560 960 720 V980 Z" fill="#e8f6ff" fill-opacity=".7" stroke="#7fb6d6" stroke-width="7"/>{"".join(f'<path d="M{x} 980 V{720 - (40 if 640 < x < 880 else 0)}" stroke="#7fb6d6" stroke-width="4"/>' for x in range(620, 960, 80))}
    {"".join(f'<circle cx="{x}" cy="{R(840, 940)}" r="14" fill="#ff3b30"/>' for x in range(600, 940, 60))}
    <!-- забор из штакетника -->
    {"".join(f'<path d="M{x} 1000 V880 l12 -18 l12 18 V1000 Z" fill="#a8743f" stroke="{K}" stroke-width="3"/>' for x in range(0, 1080, 36))}
    <path d="M0 920 H1080 M0 970 H1080" stroke="#7a4f2a" stroke-width="8"/>
    <!-- подсолнухи -->
    {"".join(f'<path d="M{x} 1000 V780" stroke="#3a7a2a" stroke-width="8"/><circle cx="{x}" cy="770" r="40" fill="#ffd23f" stroke="{K}" stroke-width="4"/><circle cx="{x}" cy="770" r="18" fill="#6b4423"/>' for x in (500, 1010))}
    <!-- огород: грядки, бочка -->
    <rect y="1000" width="1080" height="920" fill="#6a8a3a"/><path d="M0 1000 H1080" stroke="{K}" stroke-width="7"/>
    {"".join(f'<rect x="{x}" y="{y}" width="300" height="70" rx="14" fill="#6b4a2a" stroke="{K}" stroke-width="4"/>' + "".join(f'<path d="M{x + 20 + k * 40} {y + 10} l-10 -26 M{x + 20 + k * 40} {y + 10} l10 -26" stroke="#4cd964" stroke-width="6"/>' for k in range(7)) for x, y in ((40, 1120), (740, 1120), (40, 1720), (740, 1720)))}
    <ellipse cx="980" cy="1040" rx="70" ry="20" fill="#2f5a8a"/><rect x="910" y="1040" width="140" height="160" fill="#2f5a8a" stroke="{K}" stroke-width="6"/>
  </svg>
'''

for n, s in (("zalteshi", zal), ("dvorteshi", dvor), ("dachaogorod", dacha)):
    open(f"bg_{n}.svg.part", "w").write(s)
print("ok")
