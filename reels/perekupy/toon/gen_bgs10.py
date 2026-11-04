# python3 gen_bgs10.py → фоны двенадцатого набора (ep24 «Такси под прикрытием»):
# bg_taxipark (таксопарк ночью: ворота, табло смены, диспетчерская, ряд машин с шашками), bg_paintbooth (покрасочная камера: белые стены,
# лампы, плёнка, жёлтые брызги, краскопульты), bg_clinic (улица у поликлиники днём: здание с вывеской, остановка с лавкой и расписанием)
import random
K = "#000"
random.seed(24)
HEAD = '  <svg id="bg" width="1080" height="1920" viewBox="0 0 1080 1920" style="position:absolute;left:0;top:0">\n'

# ---------- таксопарк ночью
taxis = "".join(f'''<g transform="translate({x} 880)"><path d="M0 120 q10 -60 70 -66 l40 -50 h150 l50 50 q60 6 70 66 v40 h-380 z" fill="#f5c400" stroke="{K}" stroke-width="6"/>
      <path d="M120 10 h140 l40 44 h-220 z" fill="#2a3446" stroke="{K}" stroke-width="5"/><rect x="150" y="-20" width="80" height="26" fill="#fff" stroke="{K}" stroke-width="4"/>
      {"".join(f'<rect x="{150 + i * 16}" y="{-20 + (i % 2) * 13}" width="16" height="13" fill="#151515"/>' for i in range(5))}
      <circle cx="80" cy="160" r="34" fill="#1c1c20" stroke="{K}" stroke-width="5"/><circle cx="300" cy="160" r="34" fill="#1c1c20" stroke="{K}" stroke-width="5"/></g>''' for x in (-120, 300, 720))
taxipark = HEAD + f'''    <defs><linearGradient id="tpSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#060914"/><stop offset="1" stop-color="#1b2238"/></linearGradient>
      <radialGradient id="tpLamp" cx=".5" cy="0" r="1"><stop offset="0" stop-color="#ffe9a8" stop-opacity=".5"/><stop offset="1" stop-color="#ffe9a8" stop-opacity="0"/></radialGradient></defs>
    <rect width="1080" height="1920" fill="url(#tpSky)"/>{"".join(f'<circle cx="{random.randint(0, 1080)}" cy="{random.randint(0, 500)}" r="{random.choice([1, 2])}" fill="#fff"/>' for _ in range(40))}
    <!-- ангар -->
    <rect x="0" y="520" width="1080" height="560" fill="#2b2f37" stroke="{K}" stroke-width="8"/>
    <g stroke="#363b45" stroke-width="6">{"".join(f'<path d="M{x} 520 V1080"/>' for x in range(60, 1080, 90))}</g>
    <rect x="160" y="380" width="760" height="130" rx="14" fill="#f5c400" stroke="{K}" stroke-width="8"/>
    <text x="540" y="470" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="64" fill="#151515">ТАКСОПАРК</text>
    {"".join(f'<rect x="{180 + i * 40}" y="388" width="40" height="20" fill="{("#151515", "#f5c400")[i % 2]}"/>' for i in range(18))}
    <!-- табло смены -->
    <g><rect x="60" y="580" width="420" height="200" rx="12" fill="#0d0f12" stroke="#4a4e58" stroke-width="8"/>
      <text x="270" y="640" text-anchor="middle" font-family="JetBrains Mono" font-weight="800" font-size="32" fill="#ffd23f">СМЕНА 24/7</text>
      <text x="270" y="700" text-anchor="middle" font-family="JetBrains Mono" font-weight="800" font-size="30" fill="#4cd964">ЗАКАЗОВ: 18 432</text>
      <text x="270" y="752" text-anchor="middle" font-family="JetBrains Mono" font-weight="800" font-size="30" fill="#ff3b30">ПРОБЕГ: 600 000+</text></g>
    <!-- диспетчерская -->
    <g><rect x="640" y="580" width="380" height="220" fill="#3a3f4a" stroke="{K}" stroke-width="7"/><rect x="670" y="610" width="320" height="140" fill="#ffd77a" stroke="{K}" stroke-width="6"/>
      <text x="830" y="790" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="26" fill="#fff">ДИСПЕТЧЕР</text></g>
    <path d="M540 520 V560" stroke="#111" stroke-width="5"/><path d="M500 560 h80 l-10 30 h-60 z" fill="#ffe9a8" stroke="{K}" stroke-width="5"/>
    <path d="M540 590 L120 1400 L960 1400 Z" fill="url(#tpLamp)"/>
    {taxis}
    <!-- асфальт -->
    <rect y="1080" width="1080" height="840" fill="#20232a"/><path d="M0 1080 H1080" stroke="{K}" stroke-width="6"/>
    <g fill="#f5c400">{"".join(f'<rect x="{x}" y="1400" width="90" height="16" rx="4"/>' for x in range(20, 1080, 160))}</g>
    <g fill="#2e3440" opacity=".7"><ellipse cx="300" cy="1640" rx="220" ry="20"/><ellipse cx="800" cy="1760" rx="180" ry="16"/></g>
  </svg>
'''

# ---------- покрасочная камера
splats = "".join(f'<circle cx="{random.randint(40, 1040)}" cy="{random.randint(320, 1060)}" r="{random.choice([6, 9, 14, 20])}" fill="#f5c400" opacity="{random.choice([.5, .7, .9])}"/>' for _ in range(60))
paintbooth = HEAD + f'''    <rect width="1080" height="1920" fill="#eef1f4"/>
    <!-- потолочные фильтры и лампы -->
    <rect y="0" width="1080" height="240" fill="#d9dee4"/><g stroke="#c2c9d1" stroke-width="5">{"".join(f'<path d="M{x} 0 V240"/>' for x in range(0, 1080, 60))}</g>
    {"".join(f'<rect x="{x}" y="250" width="280" height="40" rx="10" fill="#fff" stroke="{K}" stroke-width="5"/>' for x in (60, 400, 740))}
    <path d="M0 290 H1080" stroke="{K}" stroke-width="6"/>
    <!-- стены с брызгами -->
    <g stroke="#dbe1e7" stroke-width="5">{"".join(f'<path d="M{x} 290 V1080"/>' for x in range(90, 1080, 180))}</g>
    {splats}
    <!-- плёнка-маскировка -->
    <path d="M40 320 q40 300 -10 740 h120 q-30 -400 10 -740 z" fill="#cfe8f5" opacity=".75" stroke="#9bbfd4" stroke-width="4"/>
    <path d="M930 320 q-30 300 20 740 h110 V320 z" fill="#cfe8f5" opacity=".75" stroke="#9bbfd4" stroke-width="4"/>
    <!-- краскопульты на стене -->
    {"".join(f'<g transform="translate({x} 520)"><path d="M0 0 h70 v30 h-40 l-10 60 h-20 z" fill="#c9ced6" stroke="{K}" stroke-width="5"/><rect x="10" y="-60" width="34" height="60" rx="6" fill="#f5c400" stroke="{K}" stroke-width="4"/></g>' for x in (320, 460))}
    <g><rect x="600" y="460" width="300" height="120" rx="10" fill="#151515" stroke="{K}" stroke-width="5"/>
      <text x="750" y="510" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="28" fill="#ffd23f">ПОКРАСКА</text>
      <text x="750" y="556" text-anchor="middle" font-family="Onest" font-weight="800" font-size="24" fill="#fff">любой цвет · быстро</text></g>
    <!-- решётка пола -->
    <rect y="1080" width="1080" height="840" fill="#5c626b"/><path d="M0 1080 H1080" stroke="{K}" stroke-width="7"/>
    <g stroke="#4a4f57" stroke-width="6">{"".join(f'<path d="M0 {y} H1080"/>' for y in range(1120, 1920, 40))}{"".join(f'<path d="M{x} 1080 V1920"/>' for x in range(0, 1080, 40))}</g>
    <g fill="#f5c400" opacity=".35"><ellipse cx="540" cy="1320" rx="420" ry="60"/></g>
  </svg>
'''

# ---------- улица у поликлиники
trees = "".join(f'<g><rect x="{x - 14}" y="860" width="28" height="220" fill="#7a4a24" stroke="{K}" stroke-width="5"/>'
                f'<circle cx="{x}" cy="820" r="90" fill="#7fae52" stroke="{K}" stroke-width="6"/><circle cx="{x - 50}" cy="870" r="60" fill="#8fbe60" stroke="{K}" stroke-width="5"/></g>' for x in (90, 1000))
win = "".join(f'<rect x="{x}" y="{y}" width="90" height="100" fill="#bfe3ff" stroke="{K}" stroke-width="5"/>' for x in range(200, 900, 140) for y in (440, 600))
clinic = HEAD + f'''    <defs><linearGradient id="clSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fc3ee"/><stop offset="1" stop-color="#e3f1fb"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#clSky)"/>
    <ellipse cx="220" cy="180" rx="110" ry="34" fill="#fff"/><ellipse cx="820" cy="140" rx="130" ry="38" fill="#fff"/>
    <!-- здание поликлиники -->
    <rect x="160" y="300" width="760" height="780" fill="#f2efe6" stroke="{K}" stroke-width="8"/>
    <rect x="200" y="320" width="680" height="90" rx="10" fill="#1d6fa5" stroke="{K}" stroke-width="6"/>
    <text x="540" y="360" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="30" fill="#fff">ГОРОДСКАЯ ПОЛИКЛИНИКА</text>
    <text x="540" y="398" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="30" fill="#ffd23f">№ 3</text>
    {win}
    <g><rect x="460" y="800" width="160" height="280" fill="#cfe3f2" stroke="{K}" stroke-width="7"/><path d="M540 800 V1080" stroke="{K}" stroke-width="5"/>
      <rect x="500" y="740" width="80" height="50" fill="#fff" stroke="{K}" stroke-width="5"/><path d="M540 748 v34 M523 765 h34" stroke="#e53935" stroke-width="10"/></g>
    <text x="300" y="900" text-anchor="middle" font-family="Onest" font-weight="800" font-size="24" fill="#6b7280">Приём с 8:00</text>
    {trees}
    <!-- тротуар и дорога -->
    <rect y="1080" width="1080" height="160" fill="#b8bec7"/><path d="M0 1080 H1080 M0 1240 H1080" stroke="{K}" stroke-width="6"/>
    <rect y="1240" width="1080" height="680" fill="#5b616b"/>
    <g fill="#fff">{"".join(f'<rect x="{x}" y="1560" width="110" height="16" rx="4"/>' for x in range(20, 1080, 190))}</g>
    <!-- остановка -->
    <g><path d="M640 900 h400 v20 h-400 z" fill="#2e86de" stroke="{K}" stroke-width="6"/><path d="M660 920 V1150 M1020 920 V1150" stroke="#3a3d46" stroke-width="14"/>
      <rect x="680" y="930" width="320" height="150" fill="#cfe8f5" opacity=".6" stroke="{K}" stroke-width="5"/>
      <rect x="700" y="1110" width="280" height="22" fill="#7a4a24" stroke="{K}" stroke-width="5"/>
      <rect x="560" y="850" width="60" height="60" rx="8" fill="#ffd23f" stroke="{K}" stroke-width="5"/><text x="590" y="892" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="34">А</text>
      <path d="M590 910 V1150" stroke="#3a3d46" stroke-width="10"/>
      <rect x="720" y="950" width="120" height="90" fill="#fff" stroke="{K}" stroke-width="4"/>
      <text x="780" y="980" text-anchor="middle" font-family="Onest" font-weight="800" font-size="16">Расписание</text>
      <text x="780" y="1008" text-anchor="middle" font-family="Onest" font-weight="700" font-size="14">№ 12 — когда-нибудь</text></g>
  </svg>
'''

for n, s in [("taxipark", taxipark), ("paintbooth", paintbooth), ("clinic", clinic)]:
    open(f"bg_{n}.svg.part", "w").write(s)
print("ok")
