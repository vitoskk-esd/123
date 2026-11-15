# python3 gen_bgs63.py → фоны для ep71 «Эвакуатор: постоянный клиент» (киношный формат):
# bg_trassa5km (трасса на закате: поля, ЛЭП, километровый столбик «5», отбойник, обочина),
# bg_kabinaevak (кабина эвакуатора: лобовое с дорогой, торпеда, рация, иконка и ёлочка; руль — реквизит),
# bg_dachavity (дача Вити: кирпичный дом, табличка «ДАЧА ИМ. ЖОРЫ», забор, грядки, баня, закат)
import random
K = "#000"
HEAD = '  <svg id="bg" width="1080" height="1920" viewBox="0 0 1080 1920" style="position:absolute;left:0;top:0">\n'
F = 'font-family="Unbounded" font-weight="900"'
R = random.randint

random.seed(271)
trassa = HEAD + f'''    <defs><linearGradient id="ts" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5a4a8a"/><stop offset=".5" stop-color="#ff8a5a"/><stop offset="1" stop-color="#ffd27a"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#ts)"/>
    <circle cx="760" cy="880" r="120" fill="#ffe08a" opacity=".9"/>
    <!-- поля и ЛЭП -->
    <path d="M0 960 Q300 920 600 950 T1080 940 V1180 H0 Z" fill="#8a7a3a"/>
    {"".join(f'<path d="M{x} 1000 L{x - 30} 760 M{x} 1000 L{x + 30} 760 M{x - 50} 780 H{x + 50}" stroke="#3a3040" stroke-width="7"/>' for x in (180, 620, 1000))}
    <path d="M130 782 Q400 840 570 782 T950 782" stroke="#3a3040" stroke-width="3" fill="none"/>
    <!-- дорога -->
    <rect y="1180" width="1080" height="740" fill="#55565c"/><path d="M0 1180 H1080" stroke="{K}" stroke-width="7"/>
    {"".join(f'<rect x="{x}" y="1520" width="130" height="18" fill="#f4f0e8"/>' for x in range(-60, 1080, 230))}
    <rect y="1180" width="1080" height="70" fill="#8a7a5a"/>
    <!-- отбойник -->
    <path d="M0 1160 H1080" stroke="#c8ccd0" stroke-width="22"/>{"".join(f'<path d="M{x} 1160 V1230" stroke="#8a8e94" stroke-width="10"/>' for x in range(40, 1080, 160))}
    <!-- километровый столбик -->
    <rect x="70" y="1000" width="90" height="190" fill="#f4f0e8" stroke="{K}" stroke-width="6"/><rect x="70" y="1000" width="90" height="60" fill="{K}"/><text x="115" y="1130" text-anchor="middle" {F} font-size="64" fill="{K}">5</text><text x="115" y="1046" text-anchor="middle" {F} font-size="28" fill="#f4f0e8">КМ</text>
  </svg>
'''

random.seed(272)
kab = HEAD + f'''    <rect width="1080" height="1920" fill="#2b2f37"/>
    <!-- лобовое: дорога в сумерках -->
    <path d="M60 180 H1020 L980 980 H100 Z" fill="#ff9a6a" stroke="{K}" stroke-width="10"/>
    <path d="M100 760 H980 V980 H100 Z" fill="#55565c"/><path d="M540 760 L380 980 M540 760 L700 980" stroke="#f4f0e8" stroke-width="10" stroke-dasharray="40 30"/>
    <path d="M100 760 Q300 700 540 740 T980 750 V760 H100 Z" fill="#8a7a3a"/>
    <circle cx="760" cy="560" r="70" fill="#ffe08a" opacity=".85"/>
    <!-- стойки и козырёк -->
    <rect x="0" y="0" width="1080" height="180" fill="#3a3d46" stroke="{K}" stroke-width="7"/><rect x="140" y="190" width="300" height="80" rx="10" fill="#4a4f5a" stroke="{K}" stroke-width="5"/>
    <!-- иконка и ёлочка -->
    <rect x="560" y="200" width="70" height="90" fill="#e6c88a" stroke="{K}" stroke-width="4"/><path d="M800 180 V260" stroke="{K}" stroke-width="4"/><path d="M800 260 l-30 50 h18 l-24 44 h72 l-24 -44 h18 z" fill="#4cd964" stroke="{K}" stroke-width="4"/>
    <!-- торпеда -->
    <path d="M0 1000 Q540 940 1080 1000 V1920 H0 Z" fill="#1f2228" stroke="{K}" stroke-width="8"/>
    <rect x="420" y="1060" width="240" height="110" rx="12" fill="#151515" stroke="#3a3d46" stroke-width="6"/><rect x="440" y="1080" width="200" height="40" fill="#2f8a4a" opacity=".7"/>
  </svg>
'''

random.seed(273)
dacha = HEAD + f'''    <defs><linearGradient id="dv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6a8ad0"/><stop offset=".7" stop-color="#ffb07a"/><stop offset="1" stop-color="#ffd8a0"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#dv)"/>
    <!-- дом -->
    <rect x="200" y="620" width="680" height="560" fill="#b8584a" stroke="{K}" stroke-width="8"/>
    {"".join(f'<path d="M200 {y} H880" stroke="#8a3a30" stroke-width="3"/>' for y in range(650, 1180, 34))}
    <path d="M160 620 L540 360 L920 620 Z" fill="#4a4f5a" stroke="{K}" stroke-width="8"/>
    {"".join(f'<rect x="{x}" y="740" width="150" height="170" fill="#a8cfe8" stroke="{K}" stroke-width="6"/><path d="M{x + 75} 740 V910 M{x} 825 H{x + 150}" stroke="{K}" stroke-width="5"/>' for x in (260, 670))}
    <rect x="470" y="900" width="140" height="280" fill="#6b4423" stroke="{K}" stroke-width="7"/>
    <!-- табличка -->
    <rect x="300" y="520" width="480" height="90" rx="8" fill="#e6c88a" stroke="{K}" stroke-width="6"/><text x="540" y="578" text-anchor="middle" {F} font-size="36" fill="#5a3820">ДАЧА ИМ. ЖОРЫ</text>
    <!-- баня -->
    <rect x="900" y="900" width="220" height="280" fill="#8a6a4a" stroke="{K}" stroke-width="6"/><path d="M880 900 L1010 800 L1140 900 Z" fill="#5a4030" stroke="{K}" stroke-width="6"/>
    <!-- забор, грядки -->
    <rect y="1180" width="1080" height="740" fill="#7a9a4a"/><path d="M0 1180 H1080" stroke="{K}" stroke-width="7"/>
    {"".join(f'<rect x="{x}" y="1080" width="34" height="200" fill="#c8a878" stroke="{K}" stroke-width="4"/>' for x in range(-10, 200, 50))}
    {"".join(f'<rect x="{x}" y="{y}" width="260" height="60" rx="20" fill="#6b4a2a" stroke="{K}" stroke-width="4"/>' + "".join(f'<path d="M{x + 30 + k * 50} {y} q-10 -30 0 -50 q10 20 0 50" fill="#4cd964" stroke="{K}" stroke-width="3"/>' for k in range(5)) for x, y in ((80, 1700), (720, 1720)))}
  </svg>
'''

for n, s in (("trassa5km", trassa), ("kabinaevak", kab), ("dachavity", dacha)):
    open(f"bg_{n}.svg.part", "w").write(s)
print("ok")
