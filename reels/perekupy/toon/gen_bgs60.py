# python3 gen_bgs60.py → фоны для ep68 «Автошкола: Тамара Павловна» (киношный формат):
# bg_avtodrom (автодром автошколы днём: будка «АВТОШКОЛА ЗЕЛЁНЫЙ СВЕТ», эстакада, конусы, разметка, учебный светофор, тополя),
# bg_perekrestok (городской перекрёсток: светофор, зебра, панельки, провода троллейбуса, вывеска «ВЫКУП АВТО» у Жоры),
# bg_uchebka (салон учебной машины, вид через лобовое: задний диван, заднее стекло с улицей, стойки, потолок; торпеда — реквизит спереди)
import random
K = "#000"
HEAD = '  <svg id="bg" width="1080" height="1920" viewBox="0 0 1080 1920" style="position:absolute;left:0;top:0">\n'
F = 'font-family="Unbounded" font-weight="900"'
R = random.randint

random.seed(241)
drom = HEAD + f'''    <defs><linearGradient id="ad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7cc4ee"/><stop offset="1" stop-color="#d8eef8"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#ad)"/>
    {"".join(f'<ellipse cx="{x}" cy="{y}" rx="{R(90, 150)}" ry="{R(30, 45)}" fill="#fff" opacity=".85"/>' for x, y in ((180, 260), (760, 200), (980, 380)))}
    <!-- тополя -->
    {"".join(f'<path d="M{x} 1120 V820" stroke="#5a3820" stroke-width="16"/><ellipse cx="{x}" cy="760" rx="70" ry="190" fill="#4a8a3a" stroke="{K}" stroke-width="6"/>' for x in (60, 200, 880, 1020))}
    <!-- будка автошколы -->
    <rect x="300" y="760" width="480" height="360" fill="#f4f0e8" stroke="{K}" stroke-width="7"/><path d="M280 760 L540 640 L800 760 Z" fill="#4cd964" stroke="{K}" stroke-width="7"/>
    <rect x="330" y="800" width="420" height="90" rx="10" fill="#2f9a6a" stroke="{K}" stroke-width="6"/><text x="540" y="842" text-anchor="middle" {F} font-size="30" fill="#fff">АВТОШКОЛА</text><text x="540" y="878" text-anchor="middle" {F} font-size="26" fill="#ffd23f">«ЗЕЛЁНЫЙ СВЕТ»</text>
    <rect x="380" y="930" width="120" height="190" fill="#6b4423" stroke="{K}" stroke-width="6"/><rect x="560" y="930" width="160" height="110" fill="#a8cfe8" stroke="{K}" stroke-width="6"/>
    <!-- учебный светофор -->
    <path d="M900 1180 V860" stroke="#2b2f37" stroke-width="14"/><rect x="866" y="760" width="68" height="190" rx="14" fill="#2b2f37" stroke="{K}" stroke-width="6"/>{"".join(f'<circle cx="900" cy="{y}" r="22" fill="{c}"/>' for y, c in ((795, "#5a1a1a"), (855, "#5a4a1a"), (915, "#4cd964")))}
    <!-- асфальт площадки, разметка, конусы -->
    <rect y="1120" width="1080" height="800" fill="#7a7a80"/><path d="M0 1120 H1080" stroke="{K}" stroke-width="7"/>
    {"".join(f'<rect x="{x}" y="1480" width="90" height="18" fill="#f4f0e8"/>' for x in range(0, 1080, 160))}
    <path d="M60 1300 H1020" stroke="#ffd23f" stroke-width="10"/>
    {"".join(f'<path d="M{x} 1260 l18 -64 h12 l18 64 z" fill="#ff7a1a" stroke="{K}" stroke-width="5"/><rect x="{x + 8}" y="1222" width="32" height="10" fill="#fff"/>' for x in (120, 300, 760, 940))}
    <!-- эстакада -->
    <path d="M-20 1190 L180 1090 H330 L380 1190 Z" fill="#9a9aa0" stroke="{K}" stroke-width="6"/>
  </svg>
'''

random.seed(242)
cross = HEAD + f'''    <defs><linearGradient id="pk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a8d4f0"/><stop offset="1" stop-color="#eaf4fa"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#pk)"/>
    <!-- панельки -->
    {"".join(f'<rect x="{x}" y="{y}" width="{w}" height="{1150 - y}" fill="{c}" stroke="{K}" stroke-width="6"/>' + "".join(f'<rect x="{x + 20 + i * 56}" y="{y + 26 + j * 70}" width="34" height="42" fill="{"#ffd27a" if R(0, 9) == 0 else "#a8c4d8"}" stroke="{K}" stroke-width="3"/>' for i in range((w - 30) // 56) for j in range((1100 - y) // 70)) for x, y, w, c in ((-20, 360, 380, "#d8d2c4"), (700, 300, 400, "#cfd8dc")))}
    <!-- провода -->
    <path d="M0 520 Q540 600 1080 520" stroke="#151515" stroke-width="4" fill="none"/><path d="M0 560 Q540 640 1080 560" stroke="#151515" stroke-width="4" fill="none"/>
    <!-- вывеска выкупа -->
    <rect x="380" y="820" width="320" height="110" rx="8" fill="#ffd23f" stroke="{K}" stroke-width="6"/><text x="540" y="868" text-anchor="middle" {F} font-size="32" fill="#151515">ВЫКУП АВТО</text><text x="540" y="908" text-anchor="middle" font-family="JetBrains Mono" font-weight="800" font-size="24" fill="#c0392b">ДОРОГО · ЖОРА</text>
    <path d="M420 930 V1150 M660 930 V1150" stroke="#2b2f37" stroke-width="10"/>
    <!-- светофор -->
    <path d="M980 1300 V700" stroke="#2b2f37" stroke-width="16"/><rect x="940" y="600" width="80" height="220" rx="16" fill="#2b2f37" stroke="{K}" stroke-width="6"/>{"".join(f'<circle cx="980" cy="{y}" r="26" fill="{c}"/>' for y, c in ((642, "#ff3b30"), (710, "#5a4a1a"), (778, "#1a4a2a")))}
    <circle cx="980" cy="642" r="60" fill="#ff3b30" opacity=".25"/>
    <!-- тротуар и дорога, зебра -->
    <rect y="1150" width="1080" height="120" fill="#b8b4ac"/><path d="M0 1150 H1080" stroke="{K}" stroke-width="6"/>
    <rect y="1270" width="1080" height="650" fill="#5f6066"/><path d="M0 1270 H1080" stroke="{K}" stroke-width="7"/>
    {"".join(f'<rect x="{x}" y="1310" width="70" height="560" fill="#f4f0e8" opacity=".9"/>' for x in range(40, 1080, 130))}
  </svg>
'''

random.seed(243)
uch = HEAD + f'''    <rect width="1080" height="1920" fill="#3a3d46"/>
    <!-- потолок -->
    <path d="M0 0 H1080 V240 Q540 320 0 240 Z" fill="#8a8680"/>{"".join(f'<circle cx="{R(80, 1000)}" cy="{R(40, 220)}" r="{R(3, 6)}" fill="#6a665e"/>' for _ in range(20))}
    <!-- заднее стекло с улицей -->
    <path d="M190 400 Q540 330 890 400 L840 760 H240 Z" fill="#a8d4f0" stroke="{K}" stroke-width="8"/>
    <path d="M250 640 h120 v-160 h-120 z M700 600 h130 v-200 h-130 z" fill="#cfd8dc" stroke="{K}" stroke-width="4" opacity=".9"/><path d="M240 700 H840" stroke="#5f6066" stroke-width="40"/>
    <!-- задний диван -->
    <path d="M120 760 H960 Q1000 760 1000 820 V1200 H80 V820 Q80 760 120 760 Z" fill="#4a4f5a" stroke="{K}" stroke-width="7"/>
    <path d="M540 780 V1200" stroke="#33373f" stroke-width="8"/>{"".join(f'<rect x="{x}" y="700" width="150" height="90" rx="20" fill="#4a4f5a" stroke="{K}" stroke-width="6"/>' for x in (200, 730))}
    <!-- стойки салона -->
    <path d="M0 240 L170 380 L120 1920 H0 Z" fill="#2b2f37" stroke="{K}" stroke-width="7"/><path d="M1080 240 L910 380 L960 1920 H1080 Z" fill="#2b2f37" stroke="{K}" stroke-width="7"/>
    <!-- ёлочка-освежитель -->
    <path d="M540 300 V380" stroke="#151515" stroke-width="4"/><path d="M540 380 l-34 60 h20 l-26 50 h80 l-26 -50 h20 z" fill="#4cd964" stroke="{K}" stroke-width="5"/>
  </svg>
'''

for n, s in (("avtodrom", drom), ("perekrestok", cross), ("uchebka", uch)):
    open(f"bg_{n}.svg.part", "w").write(s)
print("ok")
