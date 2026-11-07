# python3 gen_bgs20.py → фоны двадцать второго набора (сериал «Толян: со ста тысяч», владелец 07.11: «нужны новые фоны», ковёр в комнате надоел):
# bg_coffee (кофейня внутри днём: стойка, кофемашина, меловое меню, лампы-шары, окно на улицу), bg_kiosk (ночной ларёк «24 ЧАСА» у дороги, фонарь, мотыльки),
# bg_shed (гараж деда изнутри: стеллаж с банками, плакат «Жигули», верстак, лампочка, приоткрытые ворота с полосой света)
import random
K = "#000"
random.seed(34)
HEAD = '  <svg id="bg" width="1080" height="1920" viewBox="0 0 1080 1920" style="position:absolute;left:0;top:0">\n'

coffee = HEAD + f'''    <rect width="1080" height="1920" fill="#e9d8c2"/>
    <g stroke="#d9c4a8" stroke-width="4">{"".join(f'<path d="M{x} 0 V1180"/>' for x in range(0, 1080, 60))}</g>
    <!-- окно на улицу -->
    <g><rect x="40" y="520" width="420" height="460" fill="#a9d3ef" stroke="{K}" stroke-width="8"/><path d="M250 520 V980 M40 750 H460" stroke="{K}" stroke-width="7"/>
      <rect x="40" y="880" width="420" height="100" fill="#7c8796"/><rect x="70" y="900" width="150" height="50" rx="16" fill="#c0392b" stroke="{K}" stroke-width="4"/><rect x="270" y="896" width="160" height="56" rx="16" fill="#2e86de" stroke="{K}" stroke-width="4"/>
      <text x="250" y="600" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="30" fill="#6b4a2a" opacity=".45" transform="scale(-1 1) translate(-500 0)">КОФЕ</text></g>
    <!-- меловое меню -->
    <g><rect x="560" y="300" width="440" height="330" rx="10" fill="#2b2f2a" stroke="#6b4a2a" stroke-width="14"/>
      <text x="780" y="360" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="34" fill="#f4f1e8">МЕНЮ</text>
      {"".join(f'<text x="590" y="{y}" font-family="JetBrains Mono" font-weight="800" font-size="26" fill="#f4f1e8">{t}</text><text x="970" y="{y}" text-anchor="end" font-family="JetBrains Mono" font-weight="800" font-size="26" fill="#ffd23f">{p}</text>' for y, t, p in [(420, "Капучино", "190"), (470, "Раф", "250"), (520, "Американо", "160"), (570, "Круассан", "140")])}</g>
    <!-- лампы-шары -->
    {"".join(f'<g><path d="M{x} 0 V{y - 40}" stroke="{K}" stroke-width="4"/><circle cx="{x}" cy="{y}" r="40" fill="#ffe6a8" stroke="{K}" stroke-width="5"/><circle cx="{x}" cy="{y}" r="90" fill="#ffe6a8" opacity=".25"/></g>' for x, y in [(160, 260), (540, 200), (900, 240)])}
    <!-- стойка и кофемашина -->
    <g><rect x="520" y="760" width="560" height="420" fill="#6b4a2a" stroke="{K}" stroke-width="8"/><rect x="520" y="740" width="560" height="40" fill="#8a6a4a" stroke="{K}" stroke-width="7"/>
      <rect x="640" y="620" width="220" height="130" rx="14" fill="#9aa3ab" stroke="{K}" stroke-width="7"/><rect x="670" y="650" width="70" height="40" rx="6" fill="#151515"/><circle cx="800" cy="670" r="18" fill="#ff7a1a" stroke="{K}" stroke-width="4"/>
      <path d="M700 750 v-30 M800 750 v-30" stroke="{K}" stroke-width="10"/>
      {"".join(f'<rect x="{x}" y="700" width="34" height="44" rx="6" fill="#f4f1e8" stroke="{K}" stroke-width="4"/>' for x in (900, 950, 1000))}</g>
    <!-- растение -->
    <g><rect x="460" y="1040" width="70" height="90" fill="#c0653a" stroke="{K}" stroke-width="5"/>{"".join(f'<ellipse cx="{495 + dx}" cy="{1010 + dy}" rx="24" ry="44" fill="#2f7a3a" stroke="{K}" stroke-width="4" transform="rotate({r} {495 + dx} {1010 + dy})"/>' for dx, dy, r in [(-30, 0, -30), (0, -20, 0), (30, 0, 30)])}</g>
    <!-- пол -->
    <rect y="1180" width="1080" height="740" fill="#b88a5c"/><path d="M0 1180 H1080" stroke="{K}" stroke-width="7"/>
    <g stroke="#a27850" stroke-width="5">{"".join(f'<path d="M{x} 1180 L{x - 200} 1920"/>' for x in range(0, 1400, 140))}</g>
  </svg>
'''

moths = "".join(f'<circle cx="{random.randint(560, 760)}" cy="{random.randint(380, 560)}" r="5" fill="#fff6c8"/>' for _ in range(10))
stars = "".join(f'<circle cx="{random.randint(0, 1080)}" cy="{random.randint(0, 600)}" r="{random.choice([2, 3])}" fill="#fff" opacity=".7"/>' for _ in range(60))
kiosk = HEAD + f'''    <defs><radialGradient id="ksLamp" cx=".6" cy=".28" r=".55"><stop offset="0" stop-color="#ffe9a8" stop-opacity=".55"/><stop offset="1" stop-color="#ffe9a8" stop-opacity="0"/></radialGradient></defs>
    <rect width="1080" height="1920" fill="#0f1426"/>{stars}
    <!-- дома вдали с редкими окнами -->
    <g>{"".join(f'<rect x="{x}" y="{y}" width="{w}" height="{1000 - y}" fill="#1b2236" stroke="{K}" stroke-width="4"/>' for x, y, w in [(0, 560, 260), (270, 620, 200), (820, 540, 260)])}
      {"".join(f'<rect x="{x}" y="{y}" width="26" height="34" fill="#ffd77a" opacity="{random.choice([.2, .9])}"/>' for x in (30, 90, 150, 210, 300, 360, 420, 850, 910, 970, 1030) for y in (600, 680, 760, 840))}</g>
    <!-- фонарь -->
    <g><path d="M680 1000 V420" stroke="#2b2f37" stroke-width="16"/><path d="M680 420 h-70" stroke="#2b2f37" stroke-width="12"/><path d="M570 420 h80 l-12 26 h-56 z" fill="#ffe9a8" stroke="{K}" stroke-width="5"/>{moths}</g>
    <rect width="1080" height="1920" fill="url(#ksLamp)"/>
    <!-- ларёк -->
    <g><rect x="140" y="700" width="460" height="300" fill="#e8ecf0" stroke="{K}" stroke-width="8"/><rect x="120" y="650" width="500" height="70" fill="#d6243a" stroke="{K}" stroke-width="7"/>
      <text x="370" y="700" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="40" fill="#fff">24 ЧАСА</text>
      <rect x="180" y="750" width="380" height="170" fill="#ffd77a" stroke="{K}" stroke-width="6"/><rect x="300" y="880" width="140" height="40" fill="#8a6a4a" stroke="{K}" stroke-width="4"/>
      {"".join(f'<rect x="{x}" y="780" width="38" height="70" rx="6" fill="{c}" stroke="{K}" stroke-width="3"/>' for x, c in [(200, "#2e86de"), (250, "#4cd964"), (480, "#ff7a1a"), (520, "#c0392b")])}
      <text x="370" y="830" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="26" fill="#6b4a2a">ХОТ-ДОГ · КОФЕ</text></g>
    <!-- тротуар и дорога -->
    <rect y="1000" width="1080" height="160" fill="#3a3f4a"/><path d="M0 1000 H1080" stroke="{K}" stroke-width="6"/>
    <rect y="1160" width="1080" height="760" fill="#22262e"/><path d="M0 1160 H1080" stroke="{K}" stroke-width="8"/>
    <g stroke="#e8ecf0" stroke-width="10" opacity=".7">{"".join(f'<path d="M{x} 1520 h120"/>' for x in range(0, 1080, 240))}</g>
    <ellipse cx="640" cy="1080" rx="340" ry="50" fill="#ffe9a8" opacity=".18"/>
  </svg>
'''

jars = "".join(f'<g><rect x="{x}" y="{y}" width="48" height="66" rx="8" fill="#cfe9c4" stroke="{K}" stroke-width="4" opacity=".95"/><rect x="{x - 2}" y="{y - 10}" width="52" height="14" fill="#c9a20c" stroke="{K}" stroke-width="3"/><circle cx="{x + 24}" cy="{y + 36}" r="14" fill="#2f7a3a" opacity=".7"/></g>'
               for x, y in [(60, 640), (120, 640), (180, 640), (240, 640), (80, 790), (150, 790), (220, 790)])
shed = HEAD + f'''    <rect width="1080" height="1920" fill="#4a4540"/>
    <g stroke="#3e3a35" stroke-width="5">{"".join(f'<path d="M0 {y} H1080"/>' for y in range(80, 1200, 80))}</g>
    <!-- стеллаж с банками -->
    <g><path d="M40 560 V1200 M320 560 V1200" stroke="#6b5a3a" stroke-width="14"/><path d="M30 720 H330 M30 870 H330 M30 1030 H330" stroke="#6b5a3a" stroke-width="16"/>{jars}
      <rect x="70" y="950" width="200" height="74" rx="10" fill="#c0392b" stroke="{K}" stroke-width="5"/><text x="170" y="998" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="22" fill="#fff">ИНСТРУМЕНТ</text></g>
    <!-- плакат «ЖИГУЛИ» -->
    <g transform="rotate(2 640 520)"><rect x="470" y="380" width="340" height="260" fill="#f4e7c3" stroke="{K}" stroke-width="7"/><rect x="490" y="400" width="300" height="160" fill="#7cc8ff"/>
      <rect x="540" y="470" width="200" height="60" rx="14" fill="#e8d6a8" stroke="{K}" stroke-width="5"/><circle cx="580" cy="535" r="16" fill="#151515"/><circle cx="700" cy="535" r="16" fill="#151515"/>
      <text x="640" y="610" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="34" fill="#c0392b">ЖИГУЛИ</text></g>
    <!-- лампочка -->
    <g><path d="M900 0 V300" stroke="#151515" stroke-width="5"/><circle cx="900" cy="330" r="34" fill="#ffe6a8" stroke="{K}" stroke-width="5"/><circle cx="900" cy="330" r="160" fill="#ffe6a8" opacity=".18"/></g>
    <!-- верстак -->
    <g><rect x="700" y="980" width="380" height="40" fill="#7a5a36" stroke="{K}" stroke-width="6"/><path d="M730 1020 V1200 M1050 1020 V1200" stroke="#5a4226" stroke-width="16"/>
      <path d="M760 900 l60 80 M840 890 l20 90" stroke="#9aa3ab" stroke-width="12" stroke-linecap="round"/><rect x="900" y="930" width="120" height="50" rx="8" fill="#2e86de" stroke="{K}" stroke-width="5"/></g>
    <!-- приоткрытые ворота: полоса утреннего света на полу -->
    <rect y="1200" width="1080" height="720" fill="#5b5650"/><path d="M0 1200 H1080" stroke="{K}" stroke-width="7"/>
    <path d="M380 1200 L700 1200 L980 1920 L120 1920 Z" fill="#fff3d6" opacity=".22"/>
    {"".join(f'<ellipse cx="{random.randint(80, 1000)}" cy="{random.randint(1300, 1880)}" rx="{random.randint(40, 110)}" ry="{random.randint(10, 26)}" fill="#3a3632" opacity=".6"/>' for _ in range(7))}
  </svg>
'''
for n, s in (("coffee", coffee), ("kiosk", kiosk), ("shed", shed)): open(f"bg_{n}.svg.part", "w").write(s)
print("ok")
