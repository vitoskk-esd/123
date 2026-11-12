# python3 gen_bgs42.py → фоны для отдельной серии «ЖИЗНЬ ОДНОЙ ЭВО» (ep50, киношный формат):
# bg_tokiosalon (автосалон в Токио 2007: неон, стеклянная витрина с огнями города, поворотный круг, флажки «NEW»),
# bg_rorosudno (порт: борт автовоза, портовый кран, контейнеры, чайки, море на рассвете),
# bg_trek (трек-дэй: пит-лейн, шины-барьер, флаги, трибуна, солнце),
# bg_sugrob (зимняя ночь за городом: сугробы, фонарь, отбойник, лес, снег),
# bg_bokssemen (гараж Семёныча: буржуйка, полки с банками, советские плакаты, лампа на проводе, верстак),
# bg_osendvor (осенний двор: пятиэтажка, жёлтые деревья, листья, лавочка, горка)
import random, math
K = "#000"
random.seed(62)
HEAD = '  <svg id="bg" width="1080" height="1920" viewBox="0 0 1080 1920" style="position:absolute;left:0;top:0">\n'
F = 'font-family="Unbounded" font-weight="900"'
M = 'font-family="JetBrains Mono" font-weight="800"'
C = 'font-family="Caveat" font-weight="700"'
R = random.randint

tokiosalon = HEAD + f'''    <defs><linearGradient id="tkN" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a0820"/><stop offset="1" stop-color="#3a1850"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="#14121c"/>
    <!-- витрина: ночной Токио -->
    <rect x="0" y="160" width="1080" height="840" fill="url(#tkN)"/>
    {"".join(f'<rect x="{x}" y="{y}" width="{w}" height="{1000 - y}" fill="#1a1530" stroke="#0a0814" stroke-width="3"/>' for x, y, w in [(R(-40, 1040), R(300, 700), R(70, 160)) for _ in range(14)])}
    {"".join(f'<rect x="{R(0, 1060)}" y="{R(320, 980)}" width="{R(6, 40)}" height="{R(8, 60)}" fill="{random.choice(["#ff3bd0", "#5ad0ff", "#ffd23f", "#ff5a3a", "#fff6c8"])}" opacity="{random.choice([.5, .8, 1])}"/>' for _ in range(80))}
    {"".join(f'<path d="M{x} 160 V1000" stroke="#2a2440" stroke-width="16"/>' for x in range(0, 1081, 270))}
    <!-- вывеска -->
    <rect x="200" y="40" width="680" height="110" rx="16" fill="#151515" stroke="#ff3b30" stroke-width="6"/><text x="540" y="116" text-anchor="middle" {F} font-size="58" fill="#ff3b30">EVOLUTION IX</text>
    <!-- флажки NEW -->
    {"".join(f'<g><path d="M{x} 1000 V720" stroke="#8a929b" stroke-width="8"/><path d="M{x} 720 h110 l-20 40 l20 40 h-110 z" fill="#ff3b30" stroke="{K}" stroke-width="4"/><text x="{x + 45}" y="772" text-anchor="middle" {F} font-size="26" fill="#fff">NEW</text></g>' for x in (60, 900))}
    <!-- глянцевый пол и поворотный круг -->
    <rect y="1000" width="1080" height="920" fill="#d9d6e0"/><path d="M0 1000 H1080" stroke="{K}" stroke-width="7"/>
    {"".join(f'<rect x="{x}" y="1010" width="{w}" height="700" fill="{c}" opacity=".12"/>' for x, w, c in [(80, 40, "#ff3bd0"), (400, 60, "#5ad0ff"), (800, 40, "#ffd23f")])}
    <ellipse cx="540" cy="1560" rx="500" ry="140" fill="#b9b6c2" stroke="{K}" stroke-width="6"/><ellipse cx="540" cy="1560" rx="440" ry="116" fill="#c9c6d2"/>
    {"".join(f'<path d="M{540 + 470 * math.cos(a / 12 * math.pi)} {1560 + 128 * math.sin(a / 12 * math.pi)} l0 0" stroke="#ff3bd0" stroke-width="10" stroke-linecap="round"/>' for a in range(24))}
  </svg>
'''

rorosudno = HEAD + f'''    <defs><linearGradient id="rsS" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7fb4e6"/><stop offset=".55" stop-color="#ffd8b0"/><stop offset="1" stop-color="#ffe9cf"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#rsS)"/>
    <!-- море и сопки -->
    <path d="M0 760 Q200 660 420 720 T820 700 T1080 690 V840 H0 Z" fill="#6a7fa0" opacity=".8"/>
    <rect y="820" width="1080" height="180" fill="#3f6f9a"/>{"".join(f'<path d="M{R(0, 1080)} {R(840, 990)} h{R(30, 90)}" stroke="#a9c9e6" stroke-width="4" opacity=".7"/>' for _ in range(30))}
    <!-- портовый кран -->
    <g><path d="M120 1000 V300 M220 1000 V300" stroke="#e8a33a" stroke-width="22"/><path d="M120 400 L220 500 M220 400 L120 500 M120 600 L220 700 M220 600 L120 700" stroke="#e8a33a" stroke-width="10"/>
      <path d="M60 300 H900" stroke="#e8a33a" stroke-width="30"/><path d="M60 300 H900" stroke="{K}" stroke-width="3" opacity=".4"/><rect x="230" y="320" width="90" height="70" fill="#c0392b" stroke="{K}" stroke-width="5"/>
      <path d="M700 300 V560" stroke="#151515" stroke-width="5"/></g>
    <!-- борт автовоза -->
    <g><path d="M520 1000 V560 q0 -60 60 -60 h500 V1000 z" fill="#f4f6f8" stroke="{K}" stroke-width="8"/><rect x="520" y="820" width="560" height="60" fill="#c0392b"/>
      {"".join(f'<circle cx="{x}" cy="640" r="22" fill="#9fc3e0" stroke="{K}" stroke-width="5"/>' for x in range(600, 1080, 90))}
      <text x="800" y="760" text-anchor="middle" {F} font-size="44" fill="#2f4fb8">AUTO CARRIER</text></g>
    <!-- контейнеры -->
    {"".join(f'<rect x="{x}" y="{y}" width="180" height="90" fill="{c}" stroke="{K}" stroke-width="5"/>' for x, y, c in [(0, 910, "#2f6db5"), (180, 910, "#c0392b"), (0, 820, "#4f9d48"), (300, 820, "#e8a33a")])}
    <!-- причал -->
    <rect y="1000" width="1080" height="920" fill="#8a8680"/><path d="M0 1000 H1080" stroke="{K}" stroke-width="7"/>
    <g stroke="#ffd23f" stroke-width="10">{"".join(f'<path d="M{x} 1060 l60 0"/>' for x in range(20, 1080, 140))}</g>
    {"".join(f'<path d="M{x} {y} q12 -12 24 0 q12 -12 24 0" fill="none" stroke="#fff" stroke-width="4"/>' for x, y in [(380, 200), (460, 240), (880, 160)])}
  </svg>
'''

trek = HEAD + f'''    <rect width="1080" height="1920" fill="#8fc6ea"/><circle cx="880" cy="200" r="90" fill="#fff3c4"/>
    <!-- трибуна и флаги -->
    <g><path d="M0 780 L1080 700 V880 H0 Z" fill="#c9ced6" stroke="{K}" stroke-width="6"/>{"".join(f'<path d="M0 {800 + k * 20} L1080 {720 + k * 20}" stroke="#a8aeb8" stroke-width="5"/>' for k in range(1, 4))}
      {"".join(f'<circle cx="{x}" cy="{790 - x * .074 + R(-6, 6)}" r="9" fill="{random.choice(["#c0392b", "#2f6db5", "#ffd23f", "#4f9d48", "#fff"])}"/>' for x in range(20, 1080, 26))}</g>
    {"".join(f'<g><path d="M{x} 700 V480" stroke="#8a929b" stroke-width="6"/><path d="M{x} 480 h70 v44 h-70 z" fill="{c}" stroke="{K}" stroke-width="3"/></g>' for x, c in [(80, "#151515"), (330, "#ffd23f"), (600, "#c0392b"), (860, "#2f6db5")])}
    <path d="M80 480 h70 v44 h-70 z" fill="none"/>{"".join(f'<rect x="{80 + (i % 4) * 17}" y="{480 + (i // 4) * 11}" width="17" height="11" fill="{"#fff" if (i + i // 4) % 2 else "#151515"}"/>' for i in range(16))}
    <!-- шины-барьер -->
    <g>{"".join(f'<ellipse cx="{x}" cy="{y}" rx="44" ry="20" fill="#1d1d1f" stroke="{K}" stroke-width="4"/><ellipse cx="{x}" cy="{y}" rx="20" ry="9" fill="#3a3a40"/>' for x in range(20, 1080, 80) for y in (900, 940, 980))}
      <path d="M0 880 H1080" stroke="#ff3b30" stroke-width="10"/></g>
    <!-- асфальт трека с бордюром -->
    <rect y="1000" width="1080" height="920" fill="#4a4e58"/><path d="M0 1000 H1080" stroke="{K}" stroke-width="7"/>
    <g>{"".join(f'<path d="M{x} 1020 h60 v30 h-60 z" fill="{"#c0392b" if (x // 60) % 2 else "#fff"}"/>' for x in range(0, 1080, 60))}</g>
    {"".join(f'<path d="M{R(0, 1080)} {R(1100, 1900)} q80 -10 160 0" stroke="#2a2d34" stroke-width="{R(6, 12)}" fill="none" opacity=".6"/>' for _ in range(10))}
    <text x="540" y="1180" text-anchor="middle" {F} font-size="60" fill="#fff" opacity=".18">PIT LANE</text>
  </svg>
'''

sugrob = HEAD + f'''    <rect width="1080" height="1920" fill="#0d1428"/>{"".join(f'<circle cx="{R(0, 1080)}" cy="{R(0, 800)}" r="2" fill="#fff" opacity=".5"/>' for _ in range(40))}
    {"".join(f'<path d="M{x} 900 l{w / 2} -{h} l{w / 2} {h} z" fill="#1a2436" stroke="#0a0f1c" stroke-width="3"/>' for x, w, h in [(x, R(50, 80), R(160, 300)) for x in range(-30, 1080, 46)])}
    <!-- фонарь -->
    <g><path d="M860 1080 V420 q0 -40 -60 -40 h-30" fill="none" stroke="#2b2f37" stroke-width="14"/><path d="M740 370 h60 l-10 22 h-40 z" fill="#ffe2a0" stroke="{K}" stroke-width="4"/></g>
    <!-- поле, сугробы, отбойник -->
    <rect y="900" width="1080" height="1020" fill="#dfe8f2"/><path d="M0 900 H1080" stroke="{K}" stroke-width="5"/>
    <path d="M0 1000 L1080 960" stroke="#9aa3ab" stroke-width="16"/>{"".join(f'<path d="M{x} {1000 - x * .037} v44" stroke="#6b7280" stroke-width="8"/>' for x in range(40, 1080, 120))}
    <path d="M0 1240 q160 -120 340 -40 q120 -80 260 -10 q200 -90 480 -10 V1300 H0 Z" fill="#f4f8fc" stroke="{K}" stroke-width="5"/>
    <rect y="1290" width="1080" height="630" fill="#3a4050"/><path d="M0 1290 H1080" stroke="{K}" stroke-width="5"/><path d="M0 1560 H1080" stroke="#e8e4d8" stroke-width="8" stroke-dasharray="60 60"/>
    {"".join(f'<ellipse cx="{R(40, 1040)}" cy="{R(1320, 1880)}" rx="{R(60, 160)}" ry="{R(8, 18)}" fill="#e8eef5" opacity=".5"/>' for _ in range(10))}
  </svg>
'''

bokssemen = HEAD + f'''    <rect width="1080" height="1920" fill="#6a4a3a"/>
    {"".join(f'<rect x="{x}" y="{y}" width="118" height="54" fill="{random.choice(["#7a5642", "#6e4c3a", "#82604a"])}" stroke="#4a3226" stroke-width="4"/>' for y in range(0, 1060, 58) for x in range(-60 if (y // 58) % 2 else 0, 1080, 122))}
    <!-- лампа на проводе -->
    <path d="M540 0 V200" stroke="#151515" stroke-width="5"/><path d="M490 200 h100 l-14 36 h-72 z" fill="#3a3f46" stroke="{K}" stroke-width="5"/><circle cx="540" cy="248" r="18" fill="#fff6c8"/>
    <!-- советские плакаты -->
    <g transform="rotate(-3 210 380)"><rect x="90" y="250" width="240" height="300" fill="#e8dcc0" stroke="{K}" stroke-width="5"/><text x="210" y="320" text-anchor="middle" {F} font-size="30" fill="#c0392b">ВОДИТЕЛЬ,</text>
      <text x="210" y="360" text-anchor="middle" {F} font-size="22" fill="#151515">БЕРЕГИ</text><text x="210" y="392" text-anchor="middle" {F} font-size="22" fill="#151515">МАШИНУ!</text><circle cx="210" cy="470" r="50" fill="#2f6db5" stroke="{K}" stroke-width="4"/></g>
    <g transform="rotate(2 880 360)"><rect x="770" y="250" width="220" height="220" fill="#fff" stroke="{K}" stroke-width="5"/><rect x="770" y="250" width="220" height="70" fill="#c0392b"/>
      <text x="880" y="298" text-anchor="middle" {F} font-size="26" fill="#fff">2021</text>{"".join(f'<path d="M{790 + (d % 6) * 32} {340 + (d // 6) * 26} l20 16 M{810 + (d % 6) * 32} {340 + (d // 6) * 26} l-20 16" stroke="#c0392b" stroke-width="3"/>' for d in range(30))}</g>
    <!-- полки с банками и запчастями -->
    <rect x="380" y="560" width="320" height="16" fill="#8a5a33" stroke="{K}" stroke-width="5"/><rect x="380" y="740" width="320" height="16" fill="#8a5a33" stroke="{K}" stroke-width="5"/>
    {"".join(f'<rect x="{x}" y="{y - h}" width="44" height="{h}" fill="{c}" stroke="{K}" stroke-width="4"/>' for x, y, h, c in [(395, 560, 70, "#c9a24a"), (450, 560, 54, "#9fc3e0"), (505, 560, 80, "#c0392b"), (560, 560, 60, "#4f9d48"), (395, 740, 60, "#e8e4d8"), (470, 740, 90, "#3a3f46"), (560, 740, 50, "#c9a24a")])}
    <!-- буржуйка с трубой -->
    <g><path d="M140 1060 V820 h170 v240 z" fill="#2b2b2e" stroke="{K}" stroke-width="7"/><rect x="170" y="880" width="110" height="80" fill="#ff7a1a" stroke="{K}" stroke-width="5"/><path d="M225 820 V560 H330 V0" fill="none" stroke="#3a3a40" stroke-width="40"/></g>
    <!-- верстак с тисками -->
    <g><rect x="720" y="900" width="340" height="40" fill="#8a5a33" stroke="{K}" stroke-width="6"/><path d="M740 940 V1060 M1040 940 V1060" stroke="#5b3a1e" stroke-width="18"/>
      <rect x="760" y="860" width="80" height="40" fill="#2f6db5" stroke="{K}" stroke-width="4"/><path d="M880 900 l40 -50 l30 10" stroke="#8a929b" stroke-width="10" fill="none"/></g>
    <rect y="1060" width="1080" height="860" fill="#5a5856"/><path d="M0 1060 H1080" stroke="{K}" stroke-width="7"/>
    {"".join(f'<ellipse cx="{R(60, 1020)}" cy="{R(1150, 1880)}" rx="{R(50, 140)}" ry="{R(10, 26)}" fill="#3a3836" opacity=".6"/>' for _ in range(7))}
  </svg>
'''

osendvor = HEAD + f'''    <rect width="1080" height="1920" fill="#b9d6ea"/>
    <rect x="40" y="180" width="1000" height="840" fill="#d9c9b0" stroke="{K}" stroke-width="8"/>
    {"".join(f'<g><rect x="{x}" y="{y}" width="90" height="100" fill="{"#ffe2a0" if random.random() < .2 else "#9fc3e0"}" stroke="{K}" stroke-width="5"/><path d="M{x} {y + 100} h90 v12 h-90 z" fill="#e8e4d8" stroke="{K}" stroke-width="3"/></g>' for x in range(90, 1000, 150) for y in range(240, 900, 160))}
    <rect x="460" y="880" width="160" height="140" fill="#7a522b" stroke="{K}" stroke-width="6"/><path d="M430 880 h220 l-20 -30 h-180 z" fill="#c9b8a0" stroke="{K}" stroke-width="5"/>
    <!-- деревья в золоте -->
    {"".join(f'<g><path d="M{x} 1040 V760" stroke="#5a3a22" stroke-width="20"/>' + "".join(f'<ellipse cx="{x + dx}" cy="{720 + dy}" rx="90" ry="70" fill="{c}" stroke="{K}" stroke-width="4"/>' for dx, dy, c in [(-60, 20, "#e8a33a"), (50, -20, "#d9822a"), (0, -70, "#f0c04a"), (60, 50, "#c0602a")]) + "</g>" for x in (140, 940))}
    <!-- асфальт двора, листья, лавочка, горка -->
    <rect y="1020" width="1080" height="900" fill="#6a6a70"/><path d="M0 1020 H1080" stroke="{K}" stroke-width="7"/>
    {"".join(f'<ellipse cx="{R(0, 1080)}" cy="{R(1040, 1900)}" rx="{R(8, 16)}" ry="{R(5, 9)}" fill="{random.choice(["#e8a33a", "#d9822a", "#f0c04a", "#c0602a"])}" transform="rotate({R(0, 180)} 0 0)"/>' for _ in range(0))}
    {"".join(f'<ellipse cx="{x}" cy="{y}" rx="{R(9, 16)}" ry="{R(5, 9)}" fill="{random.choice(["#e8a33a", "#d9822a", "#f0c04a", "#c0602a"])}"/>' for x, y in [(R(0, 1080), R(1040, 1900)) for _ in range(90)])}
    <g><rect x="60" y="1000" width="200" height="16" fill="#8a5a33" stroke="{K}" stroke-width="4"/><path d="M80 1016 v30 M240 1016 v30" stroke="#5b3a1e" stroke-width="10"/></g>
    <g><path d="M760 1020 v-140 h50 v140" fill="none" stroke="#2f6db5" stroke-width="10"/><path d="M810 890 q90 10 140 130" fill="none" stroke="#c0392b" stroke-width="24" stroke-linecap="round"/></g>
  </svg>
'''

for n, s in (("tokiosalon", tokiosalon), ("rorosudno", rorosudno), ("trek", trek), ("sugrob", sugrob), ("bokssemen", bokssemen), ("osendvor", osendvor)):
    open(f"bg_{n}.svg.part", "w").write(s)
print("ok")
