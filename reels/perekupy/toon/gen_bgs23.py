# python3 gen_bgs23.py → новые фоны для «Толян: со ста тысяч», часть 3 «Конкурент» (каждая серия — новые фоны):
# bg_pochta (у отделения почты: бело-синий фасад, ящики, лавка, сугробы), bg_shaurma (ночная шаурмичная: окно выдачи, вертел, меню, неон),
# bg_laundry (прачечная самообслуживания ночью: ряд машинок, сушилки, автомат, лампы), bg_sad (СНТ: дачные домики, теплица, грядки, калитка),
# bg_most (под путепроводом: бетонные опоры, граффити, фонари, лужи)
import random
K = "#000"
random.seed(37)
HEAD = '  <svg id="bg" width="1080" height="1920" viewBox="0 0 1080 1920" style="position:absolute;left:0;top:0">\n'
F = 'font-family="Unbounded" font-weight="900"'

pochta = HEAD + f'''    <rect width="1080" height="1920" fill="#c8d7e6"/>
    {"".join(f'<circle cx="{random.randint(0, 1080)}" cy="{random.randint(0, 560)}" r="{random.choice([4, 5, 6])}" fill="#fff" opacity=".85"/>' for _ in range(60))}
    <!-- фасад почты -->
    <g><rect x="40" y="300" width="1000" height="700" fill="#f2f4f7" stroke="{K}" stroke-width="8"/><rect x="40" y="300" width="1000" height="120" fill="#1f4fb8" stroke="{K}" stroke-width="8"/>
      <text x="540" y="385" text-anchor="middle" {F} font-size="64" fill="#fff">ПОЧТА</text>
      <path d="M120 330 h90 l-45 40 z M120 330 v60 h90 v-60" fill="none" stroke="#fff" stroke-width="8"/>
      {"".join(f'<g><rect x="{x}" y="480" width="200" height="240" fill="#9fc3e0" stroke="{K}" stroke-width="7"/><path d="M{x + 100} 480 v240 M{x} 600 h200" stroke="{K}" stroke-width="5"/></g>' for x in (90, 790))}
      <rect x="400" y="560" width="280" height="440" fill="#6b7f96" stroke="{K}" stroke-width="8"/><path d="M540 560 v440" stroke="{K}" stroke-width="6"/>
      <rect x="440" y="610" width="80" height="140" fill="#bcd6ea" stroke="{K}" stroke-width="5"/><rect x="560" y="610" width="80" height="140" fill="#bcd6ea" stroke="{K}" stroke-width="5"/>
      <rect x="380" y="510" width="320" height="40" fill="#ffd23f" stroke="{K}" stroke-width="5"/><text x="540" y="540" text-anchor="middle" {F} font-size="24" fill="#151515">ПН–ПТ 8:00–20:00</text></g>
    <!-- почтовый ящик и лавка -->
    <g><rect x="320" y="760" width="60" height="90" rx="8" fill="#1f4fb8" stroke="{K}" stroke-width="6"/><rect x="330" y="780" width="40" height="10" fill="#151515"/></g>
    <g><rect x="760" y="880" width="240" height="26" fill="#8a5a33" stroke="{K}" stroke-width="5"/><rect x="760" y="840" width="240" height="22" fill="#8a5a33" stroke="{K}" stroke-width="5"/><path d="M780 906 v60 M980 906 v60" stroke="{K}" stroke-width="8"/></g>
    <!-- сугробы и тротуар -->
    <path d="M40 1000 q60 -50 140 -10 q60 -40 120 0 v10 h-260 z M760 1000 q80 -60 160 -10 q60 -30 120 0 v10 h-280 z" fill="#fff" stroke="{K}" stroke-width="5"/>
    <rect y="1000" width="1080" height="920" fill="#7d858e"/><path d="M0 1000 H1080" stroke="{K}" stroke-width="8"/>
    <rect y="1000" width="1080" height="90" fill="#aeb6bf"/><path d="M0 1090 H1080" stroke="{K}" stroke-width="6"/>
    {"".join(f'<ellipse cx="{random.randint(60, 1020)}" cy="{random.randint(1150, 1880)}" rx="{random.randint(60, 150)}" ry="{random.randint(10, 22)}" fill="#e8eef3" opacity=".8"/>' for _ in range(8))}
  </svg>
'''

menu = [("ШАУРМА", "220"), ("ДОНЕР", "190"), ("ЧАЙ", "50"), ("КОФЕ", "90")]
shaurma = HEAD + f'''    <defs><linearGradient id="shSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0d1530"/><stop offset="1" stop-color="#26244a"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#shSky)"/>
    {"".join(f'<circle cx="{random.randint(0, 1080)}" cy="{random.randint(0, 300)}" r="3" fill="#fff" opacity=".7"/>' for _ in range(30))}
    <!-- павильон -->
    <g><rect x="80" y="320" width="920" height="680" fill="#e8d9b5" stroke="{K}" stroke-width="8"/><rect x="60" y="260" width="960" height="110" fill="#c0392b" stroke="{K}" stroke-width="8"/>
      <text x="540" y="337" text-anchor="middle" {F} font-size="60" fill="#ffd23f" style="filter:drop-shadow(0 0 10px #ffb300)">ШАУРМА 24</text>
      <!-- окно выдачи -->
      <rect x="140" y="440" width="480" height="340" fill="#ffcf7a" stroke="{K}" stroke-width="8"/><rect x="120" y="780" width="520" height="34" fill="#9aa3ad" stroke="{K}" stroke-width="6"/>
      <!-- вертел -->
      <g><path d="M380 470 v290" stroke="#555" stroke-width="10"/><path d="M340 500 q40 -20 80 0 l-10 230 q-30 16 -60 0 z" fill="#a0522d" stroke="{K}" stroke-width="6"/>
        {"".join(f'<path d="M{344 + i * 4} {520 + i * 40} q36 -10 72 0" stroke="#7a3b1a" stroke-width="5" fill="none"/>' for i in range(5))}
        <rect x="440" y="490" width="40" height="250" fill="#ff7a1a" opacity=".55"/></g>
      <!-- меню -->
      <rect x="680" y="440" width="270" height="340" fill="#151515" stroke="{K}" stroke-width="6"/>
      {"".join(f'<text x="700" y="{500 + i * 72}" font-family="Unbounded" font-weight="800" font-size="26" fill="#fff">{n}</text><text x="930" y="{500 + i * 72}" text-anchor="end" font-family="JetBrains Mono" font-weight="800" font-size="28" fill="#ffd23f">{p}</text>' for i, (n, p) in enumerate(menu))}
      <!-- столик-стойка -->
      <rect x="680" y="860" width="300" height="24" fill="#9aa3ad" stroke="{K}" stroke-width="5"/><path d="M830 884 v116" stroke="{K}" stroke-width="10"/></g>
    <!-- неоновая лента -->
    <path d="M80 1000 H1000" stroke="#ff2da6" stroke-width="8" style="filter:drop-shadow(0 0 12px #ff2da6)"/>
    <!-- асфальт ночью с отблесками -->
    <rect y="1004" width="1080" height="916" fill="#22232b"/>
    {"".join(f'<ellipse cx="{x}" cy="{y}" rx="{rx}" ry="12" fill="{c}" opacity=".35"/>' for x, y, rx, c in [(300, 1180, 160, "#ffb300"), (760, 1260, 120, "#ff2da6"), (520, 1520, 200, "#ffb300"), (180, 1700, 120, "#ff2da6")])}
  </svg>
'''

machines = "".join(f'''<g><rect x="{x}" y="640" width="200" height="360" rx="10" fill="#f4f6f8" stroke="{K}" stroke-width="7"/><rect x="{x}" y="640" width="200" height="70" rx="10" fill="#dfe4ea" stroke="{K}" stroke-width="6"/>
      <circle cx="{x + 40}" cy="675" r="12" fill="{c}"/><rect x="{x + 80}" y="664" width="90" height="22" rx="4" fill="#151515"/>
      <circle cx="{x + 100}" cy="840" r="72" fill="#9aa3ad" stroke="{K}" stroke-width="8"/><circle cx="{x + 100}" cy="840" r="52" fill="{w}" stroke="{K}" stroke-width="5"/></g>''' for x, c, w in [(40, "#4cd964", "#5f8fb5"), (270, "#ff3b30", "#c9d6e3"), (500, "#4cd964", "#7fb2e5"), (730, "#ffd23f", "#c9d6e3")])
laundry = HEAD + f'''    <rect width="1080" height="1920" fill="#d7e8e4"/>
    <!-- кафель на стене -->
    <g stroke="#bcd3cd" stroke-width="4">{"".join(f'<path d="M0 {y} H1080"/>' for y in range(40, 640, 70))}{"".join(f'<path d="M{x} 0 V640"/>' for x in range(0, 1080, 70))}</g>
    <!-- лампы -->
    {"".join(f'<g><path d="M{x} 0 v90" stroke="{K}" stroke-width="5"/><path d="M{x - 60} 90 h120 l-20 40 h-80 z" fill="#2b2f37" stroke="{K}" stroke-width="5"/><ellipse cx="{x}" cy="140" rx="40" ry="10" fill="#fff6c8"/></g>' for x in (200, 540, 880))}
    <!-- вывеска и окно на ночную улицу -->
    <g><rect x="80" y="200" width="420" height="300" fill="#141a33" stroke="{K}" stroke-width="8"/><path d="M290 200 v300" stroke="{K}" stroke-width="6"/>
      <circle cx="420" cy="260" r="26" fill="#fff6c8"/>{"".join(f'<rect x="{x}" y="{y}" width="26" height="36" fill="#ffd23f" opacity=".7"/>' for x, y in [(110, 380), (160, 380), (330, 340), (380, 400)])}</g>
    <g transform="rotate(2 780 300)"><rect x="580" y="220" width="420" height="140" rx="20" fill="#2ec4b6" stroke="{K}" stroke-width="8"/><text x="790" y="290" text-anchor="middle" {F} font-size="44" fill="#fff">ПРАЧЕЧНАЯ</text><text x="790" y="336" text-anchor="middle" font-family="JetBrains Mono" font-weight="800" font-size="28" fill="#151515">24/7 · 1 ЦИКЛ 250 ₽</text></g>
    <!-- стиральные машины в ряд -->
    {machines}
    <!-- автомат с порошком -->
    <g><rect x="950" y="560" width="120" height="440" fill="#ff7a1a" stroke="{K}" stroke-width="7"/><rect x="965" y="600" width="90" height="180" fill="#ffe0c2" stroke="{K}" stroke-width="5"/></g>
    <!-- пол — светлая плитка, корзина с бельём -->
    <rect y="1000" width="1080" height="920" fill="#eef2f1"/><path d="M0 1000 H1080" stroke="{K}" stroke-width="8"/>
    <g stroke="#cfd8d6" stroke-width="5">{"".join(f'<path d="M0 {y} H1080"/>' for y in range(1100, 1920, 100))}{"".join(f'<path d="M{x} 1000 V1920"/>' for x in range(0, 1080, 120))}</g>
  </svg>
'''

beds = "".join(f'<g><rect x="{x}" y="1080" width="200" height="90" rx="20" fill="#6b4a2a" stroke="{K}" stroke-width="6"/>{"".join(f"<path d=\"M{x + 30 + i * 46} 1084 q-14 -40 0 -60 q14 20 0 60\" fill=\"#3fae4f\" stroke=\"{K}\" stroke-width=\"4\"/>" for i in range(4))}</g>' for x in (60, 820))
sad = HEAD + f'''    <defs><linearGradient id="sdSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd7a8"/><stop offset=".6" stop-color="#ffeccf"/><stop offset="1" stop-color="#e9f3e0"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#sdSky)"/><circle cx="880" cy="240" r="80" fill="#ffb347" opacity=".9"/>
    <!-- дачные домики вдали -->
    <g><rect x="40" y="520" width="260" height="220" fill="#7fb2e5" stroke="{K}" stroke-width="7"/><path d="M20 530 l150 -130 l150 130 z" fill="#c0392b" stroke="{K}" stroke-width="7"/><rect x="120" y="580" width="100" height="90" fill="#fff6c8" stroke="{K}" stroke-width="5"/><path d="M170 580 v90 M120 625 h100" stroke="{K}" stroke-width="4"/></g>
    <g><rect x="780" y="560" width="220" height="180" fill="#f2d16b" stroke="{K}" stroke-width="7"/><path d="M760 570 l130 -110 l130 110 z" fill="#4f6b3a" stroke="{K}" stroke-width="7"/><rect x="850" y="610" width="80" height="70" fill="#fff6c8" stroke="{K}" stroke-width="5"/></g>
    <!-- теплица -->
    <g><path d="M380 740 v-150 q130 -120 260 0 v150 z" fill="#dff3f0" opacity=".85" stroke="{K}" stroke-width="7"/><path d="M445 740 v-190 M510 740 v-215 M575 740 v-190" stroke="#8aa" stroke-width="5"/><path d="M380 650 h260" stroke="#8aa" stroke-width="5"/>
      {"".join(f'<circle cx="{x}" cy="{y}" r="11" fill="#ff3b30"/>' for x, y in [(420, 690), (470, 670), (540, 700), (600, 680)])}</g>
    <!-- деревянный забор с калиткой -->
    <g>{"".join(f'<path d="M{x} 1000 v-230 l20 -26 l20 26 v230 z" fill="#b58a5a" stroke="{K}" stroke-width="5"/>' for x in range(0, 1080, 48) if not 440 <= x <= 600)}
      <path d="M0 830 H440 M640 830 H1080 M0 940 H440 M640 940 H1080" stroke="#8a5a33" stroke-width="14"/>
      <path d="M460 1000 v-220 h160 v220" fill="none" stroke="#4f6b3a" stroke-width="12"/><path d="M470 990 l140 -200 M470 790 l140 200" stroke="#4f6b3a" stroke-width="8"/>
      <rect x="640" y="860" width="140" height="60" rx="8" fill="#fff" stroke="{K}" stroke-width="5"/><text x="710" y="900" text-anchor="middle" {F} font-size="26" fill="#151515">№ 47</text></g>
    <!-- грунтовая дорога, трава, грядки -->
    <rect y="1000" width="1080" height="920" fill="#8fbf5a"/><path d="M0 1000 H1080" stroke="{K}" stroke-width="8"/>
    <path d="M300 1000 L780 1000 L1080 1920 L0 1920 Z" fill="#c9a77a"/><path d="M300 1000 L0 1920 M780 1000 L1080 1920" stroke="#8a6d48" stroke-width="6"/>
    {beds}
    {"".join(f'<ellipse cx="{random.randint(320, 760)}" cy="{random.randint(1200, 1880)}" rx="{random.randint(40, 110)}" ry="{random.randint(8, 18)}" fill="#a88a60" opacity=".8"/>' for _ in range(8))}
  </svg>
'''

most = HEAD + f'''    <rect width="1080" height="1920" fill="#5b6f86"/>
    <!-- полотно путепровода сверху -->
    <rect x="0" y="0" width="1080" height="320" fill="#8a929b" stroke="{K}" stroke-width="8"/><rect x="0" y="300" width="1080" height="60" fill="#6c747d" stroke="{K}" stroke-width="7"/>
    <g stroke="#727a83" stroke-width="5">{"".join(f'<path d="M{x} 0 V300"/>' for x in range(60, 1080, 120))}</g>
    <!-- бетонные опоры -->
    {"".join(f'<g><rect x="{x}" y="360" width="170" height="640" fill="#a7afb7" stroke="{K}" stroke-width="8"/><rect x="{x - 20}" y="360" width="210" height="50" fill="#959da6" stroke="{K}" stroke-width="7"/><path d="M{x + 30} 430 v540" stroke="#959da6" stroke-width="8"/></g>' for x in (60, 850))}
    <!-- стена с граффити между опорами -->
    <rect x="230" y="520" width="620" height="480" fill="#b9b2a6" stroke="{K}" stroke-width="7"/>
    {"".join(f'<text x="{x}" y="{y}" text-anchor="middle" {F} font-size="54" fill="{c}" stroke="{K}" stroke-width="3" transform="rotate({r} {x} {y})">{t}</text>' for t, c, x, y, r in [("ПЕРЕКУП", "#ff2da6", 420, 640, -6), ("2009", "#ffd23f", 720, 720, 5), ("ГОРОД СПИТ", "#2ec4b6", 540, 860, -3)])}
    <!-- фонари -->
    {"".join(f'<g><path d="M{x} 1000 V560 h50" stroke="#2b2f37" stroke-width="12" fill="none"/><path d="M{x + 30} 560 h60 l-10 26 h-40 z" fill="#2b2f37"/><ellipse cx="{x + 60}" cy="600" rx="26" ry="10" fill="#fff2a8" style="filter:drop-shadow(0 0 16px #ffe066)"/></g>' for x in (300, 700))}
    <!-- асфальт, лужи, бордюр -->
    <rect y="1000" width="1080" height="920" fill="#3d434b"/><path d="M0 1000 H1080" stroke="{K}" stroke-width="8"/><rect y="1000" width="1080" height="40" fill="#9aa3ad"/>
    <g stroke="#e8ecf0" stroke-width="10" stroke-dasharray="80 70"><path d="M0 1500 H1080"/></g>
    {"".join(f'<ellipse cx="{x}" cy="{y}" rx="{rx}" ry="{ry}" fill="#7f95ad" opacity=".55"/>' for x, y, rx, ry in [(260, 1260, 150, 24), (820, 1340, 110, 18), (520, 1700, 180, 26)])}
  </svg>
'''
for n, s in (("pochta", pochta), ("shaurma", shaurma), ("laundry", laundry), ("sad", sad), ("most", most)): open(f"bg_{n}.svg.part", "w").write(s)
print("ok")
