# python3 gen_bgs57.py → фоны для ep65 «Стрим: Жора в эфире» (киношный формат):
# bg_strimgarazh (гараж-студия Жоры: кольцевая лампа, неон «ZHORA TV», светодиодная лента, постеры, стопка шин, подъёмник),
# bg_parkovkaosen (осенняя парковка у магазина «ПРОДУКТЫ»: жёлтые деревья, листья на асфальте, тележки, разметка),
# bg_salonavto (салон машины изнутри: руль, приборка, лобовое стекло с улицей, ароматизатор-ёлочка)
import random
K = "#000"
HEAD = '  <svg id="bg" width="1080" height="1920" viewBox="0 0 1080 1920" style="position:absolute;left:0;top:0">\n'
F = 'font-family="Unbounded" font-weight="900"'
R = random.randint

random.seed(211)
garazh = HEAD + f'''    <rect width="1080" height="1920" fill="#2a2d38"/>
    {"".join(f'<path d="M0 {y} H1080" stroke="#24262f" stroke-width="40"/>' for y in range(40, 1240, 120))}
    <!-- неон ZHORA TV -->
    <rect x="300" y="160" width="480" height="150" rx="20" fill="#14101f" stroke="#ff3bd0" stroke-width="8"/>
    <text x="540" y="262" text-anchor="middle" {F} font-size="76" fill="#ff7ae6" stroke="#ff3bd0" stroke-width="2">ZHORA TV</text>
    <!-- светодиодная лента -->
    <path d="M0 110 H1080" stroke="#3fd0ff" stroke-width="10" opacity=".8"/>
    <!-- постеры -->
    <rect x="60" y="360" width="200" height="280" fill="#ffd23f" stroke="{K}" stroke-width="6" transform="rotate(-4 160 500)"/><text x="160" y="520" text-anchor="middle" {F} font-size="44" fill="#151515" transform="rotate(-4 160 500)">JDM</text>
    <rect x="820" y="380" width="200" height="260" fill="#c0392b" stroke="{K}" stroke-width="6" transform="rotate(3 920 510)"/><text x="920" y="530" text-anchor="middle" {F} font-size="40" fill="#fff" transform="rotate(3 920 510)">ТОРГ</text>
    <!-- кольцевая лампа на штативе -->
    <circle cx="540" cy="620" r="150" fill="none" stroke="#fff6e0" stroke-width="34"/><circle cx="540" cy="620" r="150" fill="none" stroke="#151515" stroke-width="4"/>
    <path d="M540 770 V1240 M540 1240 l-90 40 M540 1240 l90 40" stroke="#2b2f37" stroke-width="12"/>
    <!-- шины и подъёмник -->
    {"".join(f'<ellipse cx="140" cy="{1220 - k * 60}" rx="110" ry="34" fill="#151515" stroke="#3a3d46" stroke-width="10"/>' for k in range(5))}
    <path d="M840 1240 V760 M1000 1240 V760" stroke="#c0392b" stroke-width="22"/><path d="M820 900 H1020" stroke="#5b6670" stroke-width="18"/>
    <!-- пол -->
    <rect y="1240" width="1080" height="680" fill="#3a3d46"/><path d="M0 1240 H1080" stroke="{K}" stroke-width="7"/>
    {"".join(f'<ellipse cx="{R(80, 1000)}" cy="{R(1300, 1880)}" rx="{R(60, 140)}" ry="{R(10, 20)}" fill="#151515" opacity=".35"/>' for _ in range(5))}
  </svg>
'''

random.seed(212)
park = HEAD + f'''    <defs><linearGradient id="po" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a8c8e0"/><stop offset="1" stop-color="#e8eef2"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#po)"/>
    <!-- магазин -->
    <rect x="80" y="480" width="920" height="700" fill="#d8d2c4" stroke="{K}" stroke-width="7"/>
    <rect x="160" y="540" width="760" height="130" rx="12" fill="#2f8a3a" stroke="{K}" stroke-width="6"/><text x="540" y="630" text-anchor="middle" {F} font-size="72" fill="#fff">ПРОДУКТЫ</text>
    <rect x="160" y="740" width="300" height="440" fill="#a8cfe8" stroke="{K}" stroke-width="6"/><rect x="620" y="740" width="300" height="440" fill="#a8cfe8" stroke="{K}" stroke-width="6"/>
    <rect x="470" y="820" width="140" height="360" fill="#7a8a9a" stroke="{K}" stroke-width="6"/>
    <!-- жёлтые деревья -->
    {"".join(f'<path d="M{x} 1260 V900" stroke="#5a3820" stroke-width="24"/><circle cx="{x}" cy="840" r="120" fill="#e8a020" stroke="{K}" stroke-width="6"/><circle cx="{x + s * 60}" cy="760" r="80" fill="#f0c040" stroke="{K}" stroke-width="6"/>' for x, s in ((40, 1), (1040, -1)))}
    <!-- асфальт, разметка, листья, тележки -->
    <rect y="1200" width="1080" height="720" fill="#7d8088"/><path d="M0 1200 H1080" stroke="{K}" stroke-width="7"/>
    {"".join(f'<path d="M{x} 1240 L{x - 130} 1920" stroke="#f4f6f8" stroke-width="10" opacity=".75"/>' for x in (130, 560, 990))}
    {"".join(f'<path d="M{R(30, 1050)} {R(1230, 1900)} l{R(-16, 16)} {R(8, 16)}" stroke="{["#e8a020", "#c0392b", "#f0c040"][R(0, 2)]}" stroke-width="12" stroke-linecap="round"/>' for _ in range(26))}
    {"".join(f'<g><rect x="{x}" y="1150" width="110" height="70" fill="none" stroke="#9aa3ad" stroke-width="6"/><path d="M{x} 1180 h110 M{x + 10} 1220 v20 M{x + 100} 1220 v20" stroke="#9aa3ad" stroke-width="5"/></g>' for x in (700, 830))}
  </svg>
'''

random.seed(213)
salon = HEAD + f'''    <defs><linearGradient id="sa" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9fd0f0"/><stop offset="1" stop-color="#d8eef8"/></linearGradient></defs>
    <!-- улица за лобовым -->
    <rect width="1080" height="1920" fill="url(#sa)"/>
    {"".join(f'<rect x="{x}" y="{R(260, 420)}" width="{R(120, 200)}" height="700" fill="{["#c9b8a0", "#b8c4d0", "#d8c8a8"][R(0, 2)]}" stroke="#7a8a9a" stroke-width="4"/>' for x in range(-40, 1080, 170))}
    <rect y="900" width="1080" height="300" fill="#8f939b"/>
    <!-- рамка лобового и стойки -->
    <path d="M0 0 H1080 V200 Q540 120 0 200 Z" fill="#1d1f26"/><path d="M0 0 L160 0 L40 1200 L0 1200 Z M1080 0 L920 0 L1040 1200 L1080 1200 Z" fill="#1d1f26"/>
    <!-- зеркало и ёлочка -->
    <rect x="440" y="150" width="200" height="60" rx="20" fill="#2b2f37" stroke="#151515" stroke-width="6"/><path d="M540 210 V300" stroke="#151515" stroke-width="3"/>
    <path d="M540 300 l-36 70 h24 l-30 56 h84 l-30 -56 h24 z" fill="#2f9a3a" stroke="#151515" stroke-width="4"/>
    <!-- приборная панель -->
    <path d="M0 1100 Q540 980 1080 1100 V1920 H0 Z" fill="#2b2d34" stroke="#151515" stroke-width="7"/>
    <path d="M0 1140 Q540 1030 1080 1140" stroke="#3a3d46" stroke-width="20" fill="none"/>
    <!-- руль -->
    <circle cx="300" cy="1500" r="260" fill="none" stroke="#151515" stroke-width="60"/><circle cx="300" cy="1500" r="260" fill="none" stroke="#3a3d46" stroke-width="44"/>
    <circle cx="300" cy="1500" r="70" fill="#3a3d46" stroke="#151515" stroke-width="8"/><path d="M60 1500 H230 M370 1500 H540 M300 1570 V1760" stroke="#3a3d46" stroke-width="40"/>
    <!-- приборы -->
    {"".join(f'<circle cx="{x}" cy="1200" r="54" fill="#14161c" stroke="#7a8a9a" stroke-width="6"/><path d="M{x} 1200 l30 -26" stroke="#ff7a1a" stroke-width="6"/>' for x in (240, 360))}
  </svg>
'''

for n, s in (("strimgarazh", garazh), ("parkovkaosen", park), ("salonavto", salon)):
    open(f"bg_{n}.svg.part", "w").write(s)
print("ok")
