# python3 gen_bgs44.py → фоны для «Толян: со ста тысяч», часть 12 «Пункт седьмой» (ep52, киношный формат):
# bg_moyka (мойка самообслуживания ночью: боксы с номерами, пена, шланги, неон «МОЙКА 24», мокрый пол с бликами) — флешбэк сделки,
# bg_zhorakuhnya (кухня Жоры в хрущёвке вечером: плитка, окно с ночным двором, холодильник с магнитами, отрывной календарь, чайник),
# bg_parkovkatc (парковка у торгового центра днём: фасад ТЦ, разметка, фонари, тележки, шлагбаум),
# bg_shaurma (ларёк с шаурмой ночью: прилавок, меню-табло, вертел, неон, столик-стойка, лужи),
# bg_naberezhnaya (набережная на закате: перила, река с бликами, мост, фонари, скамейка)
import random
K = "#000"
HEAD = '  <svg id="bg" width="1080" height="1920" viewBox="0 0 1080 1920" style="position:absolute;left:0;top:0">\n'
F = 'font-family="Unbounded" font-weight="900"'
M = 'font-family="JetBrains Mono" font-weight="800"'
R = random.randint

random.seed(81)
moyka = HEAD + f'''    <rect width="1080" height="1920" fill="#10131c"/>
    <rect y="0" width="1080" height="260" fill="#1a1f2e"/><path d="M0 260 H1080" stroke="#2a3248" stroke-width="12"/>
    <!-- неоновая вывеска -->
    <rect x="300" y="70" width="480" height="130" rx="24" fill="#0d0e12" stroke="#5ad0ff" stroke-width="8"/>
    <text x="540" y="160" text-anchor="middle" {F} font-size="72" fill="#5ad0ff">МОЙКА 24</text>
    <!-- три бокса: перегородки, номера, шланги -->
    {"".join(f'<rect x="{x}" y="300" width="340" height="1000" fill="#1c2233" stroke="{K}" stroke-width="6"/><rect x="{x + 20}" y="330" width="300" height="120" rx="12" fill="#26304a"/><text x="{x + 170}" y="415" text-anchor="middle" {F} font-size="64" fill="#ffd23f">{n}</text>'
             f'<path d="M{x + 60} 460 q-30 300 40 520" stroke="#ffd23f" stroke-width="14" fill="none"/><rect x="{x + 230}" y="520" width="80" height="150" rx="10" fill="#c0392b" stroke="{K}" stroke-width="5"/><circle cx="{x + 270}" cy="560" r="16" fill="#4cd964"/>'
             for x, n in ((10, 1), (370, 2), (730, 3)))}
    {"".join(f'<rect x="{x}" y="300" width="22" height="1000" fill="#8a929b" stroke="{K}" stroke-width="4"/>' for x in (0, 360, 720, 1058))}
    <!-- пена на стенах -->
    {"".join(f'<circle cx="{R(380, 700)}" cy="{R(900, 1250)}" r="{R(14, 40)}" fill="#e8f4ff" opacity=".55"/>' for _ in range(26))}
    <!-- мокрый пол -->
    <rect y="1300" width="1080" height="620" fill="#141a28"/><path d="M0 1300 H1080" stroke="{K}" stroke-width="7"/>
    {"".join(f'<rect x="{R(0, 1000)}" y="{R(1340, 1880)}" width="{R(80, 260)}" height="{R(6, 14)}" rx="6" fill="#5ad0ff" opacity=".22"/>' for _ in range(22))}
    <path d="M540 1300 V1920" stroke="#ffd23f" stroke-width="10" stroke-dasharray="60 50" opacity=".5"/>
  </svg>
'''

random.seed(82)
zhorakuhnya = HEAD + f'''    <rect width="1080" height="1920" fill="#d8cfa8"/>
    <!-- плитка на стене -->
    <rect y="760" width="1080" height="560" fill="#e9ecef"/>
    {"".join(f'<path d="M0 {y} H1080" stroke="#b9c3cc" stroke-width="3"/>' for y in range(800, 1320, 60))}{"".join(f'<path d="M{x} 760 V1320" stroke="#b9c3cc" stroke-width="3"/>' for x in range(30, 1080, 60))}
    <!-- окно с ночным двором -->
    <rect x="360" y="230" width="420" height="480" fill="#1d2a4a" stroke="#f4f6f8" stroke-width="18"/><path d="M570 230 V710 M360 470 H780" stroke="#f4f6f8" stroke-width="14"/>
    {"".join(f'<rect x="{R(380, 740)}" y="{R(260, 680)}" width="26" height="34" fill="#ffd27a" opacity=".8"/>' for _ in range(9))}
    <rect x="330" y="700" width="480" height="30" fill="#f4f6f8" stroke="{K}" stroke-width="4"/><circle cx="420" cy="680" r="26" fill="#4f9d48" stroke="{K}" stroke-width="4"/>
    <!-- отрывной календарь -->
    <g><rect x="120" y="300" width="170" height="220" fill="#fff" stroke="{K}" stroke-width="6"/><rect x="120" y="300" width="170" height="56" fill="#c0392b"/>
      <text x="205" y="342" text-anchor="middle" {F} font-size="26" fill="#fff">НОЯБРЬ</text><path d="M140 380 h130 M140 470 h100" stroke="#ddd" stroke-width="5"/></g>
    <!-- холодильник с магнитами -->
    <rect x="850" y="380" width="220" height="940" rx="20" fill="#f4f6f8" stroke="{K}" stroke-width="7"/><path d="M850 700 H1070" stroke="{K}" stroke-width="5"/>
    {"".join(f'<rect x="{R(870, 1030)}" y="{R(420, 660)}" width="34" height="26" rx="5" fill="{c}" stroke="{K}" stroke-width="3"/>' for c in ("#ffd23f", "#2f6db5", "#c0392b", "#4f9d48"))}
    <!-- столешница, плита, чайник -->
    <rect x="0" y="1300" width="820" height="40" fill="#8a5a33" stroke="{K}" stroke-width="5"/>
    <path d="M90 1300 q0 -110 90 -110 q90 0 90 110 z" fill="#c0392b" stroke="{K}" stroke-width="6"/><path d="M180 1190 v-30" stroke="{K}" stroke-width="10"/>
    <!-- пол — линолеум -->
    <rect y="1340" width="1080" height="580" fill="#a8845a"/><path d="M0 1340 H1080" stroke="{K}" stroke-width="7"/>
    {"".join(f'<path d="M0 {y} H1080" stroke="#8a6a44" stroke-width="3" opacity=".6"/>' for y in range(1420, 1920, 90))}
  </svg>
'''

random.seed(83)
parkovkatc = HEAD + f'''    <defs><linearGradient id="ptc" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8ec9f0"/><stop offset="1" stop-color="#e6f4fb"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#ptc)"/>
    {"".join(f'<ellipse cx="{x}" cy="{R(150, 260)}" rx="{R(70, 120)}" ry="{R(26, 40)}" fill="#fff" opacity=".85"/>' for x in (180, 520, 880))}
    <!-- фасад торгового центра -->
    <rect x="0" y="420" width="1080" height="640" fill="#cfd6de" stroke="{K}" stroke-width="6"/>
    <rect x="0" y="420" width="1080" height="120" fill="#2f6db5"/><text x="540" y="505" text-anchor="middle" {F} font-size="64" fill="#fff">ТЦ «ГАЛАКТИКА»</text>
    {"".join(f'<rect x="{x}" y="580" width="150" height="300" fill="#8ec9f0" stroke="{K}" stroke-width="5" opacity=".9"/>' for x in range(40, 1080, 210))}
    <rect x="430" y="880" width="220" height="180" fill="#1d2a4a" stroke="{K}" stroke-width="6"/><path d="M540 880 V1060" stroke="#cfd6de" stroke-width="6"/>
    <!-- фонари -->
    {"".join(f'<path d="M{x} 1300 V640" stroke="#5b6670" stroke-width="16"/><path d="M{x} 650 h60" stroke="#5b6670" stroke-width="12"/><rect x="{x + 50}" y="640" width="40" height="22" fill="#fff6c8" stroke="{K}" stroke-width="4"/>' for x in (120, 900))}
    <!-- асфальт и разметка -->
    <rect y="1060" width="1080" height="860" fill="#6a6f78"/><path d="M0 1060 H1080" stroke="{K}" stroke-width="7"/>
    {"".join(f'<path d="M{540 + (x - 540) * .35} 1080 L{x} 1920" stroke="#f4f6f8" stroke-width="10" opacity=".8"/>' for x in (-300, 180, 900, 1380))}
    <!-- тележки и шлагбаум вдали -->
    {"".join(f'<g transform="translate({x} 1110)"><rect width="90" height="54" fill="none" stroke="#c0392b" stroke-width="6"/><path d="M0 54 v20 M90 54 v20" stroke="#151515" stroke-width="5"/><circle cx="10" cy="80" r="7" fill="#151515"/><circle cx="80" cy="80" r="7" fill="#151515"/></g>' for x in (720, 800))}
    <path d="M60 1150 H330" stroke="#c0392b" stroke-width="16" stroke-dasharray="40 30"/><rect x="40" y="1120" width="40" height="70" fill="#5b6670"/>
    {"".join(f'<ellipse cx="{R(80, 1000)}" cy="{R(1300, 1880)}" rx="{R(60, 160)}" ry="{R(8, 18)}" fill="#5a5f68" opacity=".6"/>' for _ in range(8))}
  </svg>
'''

random.seed(84)
shaurma = HEAD + f'''    <rect width="1080" height="1920" fill="#0f1018"/>
    {"".join(f'<rect x="{x}" y="{R(160, 420)}" width="{R(90, 160)}" height="900" fill="#171a26"/>' for x in range(0, 1080, 170))}
    {"".join(f'<rect x="{R(0, 1040)}" y="{R(200, 700)}" width="18" height="22" fill="#ffd27a" opacity=".55"/>' for _ in range(24))}
    <!-- ларёк -->
    <rect x="80" y="520" width="920" height="820" fill="#c0392b" stroke="{K}" stroke-width="8"/>
    <rect x="80" y="520" width="920" height="150" fill="#ffd23f" stroke="{K}" stroke-width="8"/><text x="540" y="625" text-anchor="middle" {F} font-size="82" fill="#151515">ШАУРМА</text>
    <rect x="140" y="700" width="800" height="380" fill="#ffe2a0" stroke="{K}" stroke-width="7"/>
    <!-- меню-табло -->
    <rect x="170" y="730" width="330" height="200" fill="#151515"/>{"".join(f'<text x="190" y="{775 + k * 46}" {M} font-size="30" fill="#ffd23f">{t}</text>' for k, t in enumerate(("КЛАССИКА  220", "СЫРНАЯ   260", "ДВОЙНАЯ  340", "ЧАЙ       50")))}
    <!-- вертел -->
    <rect x="690" y="720" width="22" height="330" fill="#8a929b"/><path d="M640 760 q61 -30 122 0 v240 q-61 40 -122 0 z" fill="#b8742a" stroke="{K}" stroke-width="6"/>
    <rect x="780" y="740" width="120" height="300" fill="#ff7a1a" opacity=".55"/>
    <!-- прилавок -->
    <rect x="80" y="1080" width="920" height="60" fill="#8a929b" stroke="{K}" stroke-width="6"/>
    <rect x="80" y="1140" width="920" height="200" fill="#a33025" stroke="{K}" stroke-width="6"/>
    <!-- мокрый асфальт -->
    <rect y="1340" width="1080" height="580" fill="#22242e"/><path d="M0 1340 H1080" stroke="{K}" stroke-width="7"/>
    {"".join(f'<ellipse cx="{R(60, 1020)}" cy="{R(1400, 1880)}" rx="{R(60, 180)}" ry="{R(10, 22)}" fill="#ffd23f" opacity=".12"/>' for _ in range(8))}
    <!-- столик-стойка -->
    <path d="M880 1340 V1560 M820 1560 h120" stroke="#5b6670" stroke-width="14"/><rect x="800" y="1320" width="160" height="26" fill="#8a929b" stroke="{K}" stroke-width="5"/>
  </svg>
'''

random.seed(85)
naberezhnaya = HEAD + f'''    <defs><linearGradient id="nbz" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a3a7a"/><stop offset=".55" stop-color="#ff8a5a"/><stop offset="1" stop-color="#ffd08a"/></linearGradient>
      <linearGradient id="nbr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffb36a"/><stop offset="1" stop-color="#5a4a7a"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#nbz)"/>
    <circle cx="760" cy="760" r="110" fill="#ffe2a0"/><circle cx="760" cy="760" r="220" fill="#ffd08a" opacity=".3"/>
    <!-- мост -->
    <path d="M-40 640 Q540 420 1120 640" stroke="#3a2f4a" stroke-width="26" fill="none"/>{"".join(f'<path d="M{x} {640 - 220 * (1 - ((x - 540) / 580) ** 2)} V900" stroke="#3a2f4a" stroke-width="10"/>' for x in range(0, 1081, 90))}
    <rect x="-20" y="880" width="1120" height="40" fill="#3a2f4a"/>
    <!-- река с бликами -->
    <rect y="920" width="1080" height="420" fill="url(#nbr)"/>
    {"".join(f'<rect x="{760 - R(20, 200) + R(0, 40)}" y="{y}" width="{R(80, 240)}" height="8" rx="4" fill="#fff2c0" opacity=".6"/>' for y in range(950, 1320, 34))}
    <!-- перила и фонари -->
    <rect y="1300" width="1080" height="24" fill="#2b2f37"/>{"".join(f'<path d="M{x} 1324 V1420" stroke="#2b2f37" stroke-width="10"/>' for x in range(20, 1080, 70))}
    <rect y="1410" width="1080" height="20" fill="#2b2f37"/>
    {"".join(f'<path d="M{x} 1420 V820" stroke="#2b2f37" stroke-width="16"/><circle cx="{x}" cy="810" r="30" fill="#fff6c8" stroke="{K}" stroke-width="5"/>' for x in (130, 950))}
    <!-- плитка набережной -->
    <rect y="1430" width="1080" height="490" fill="#b08a6a"/>
    {"".join(f'<path d="M0 {y} H1080" stroke="#8a6a4a" stroke-width="4"/>' for y in range(1500, 1920, 80))}
    <g><rect x="40" y="1460" width="260" height="26" rx="8" fill="#8a5a33" stroke="{K}" stroke-width="5"/><path d="M60 1486 v60 M280 1486 v60" stroke="#2b2f37" stroke-width="10"/></g>
  </svg>
'''

for n, s in (("moyka", moyka), ("zhorakuhnya", zhorakuhnya), ("parkovkatc", parkovkatc), ("shaurma", shaurma), ("naberezhnaya", naberezhnaya)):
    open(f"bg_{n}.svg.part", "w").write(s)
print("ok")
