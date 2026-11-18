# python3 gen_bgs75.py → фоны для ep83 «Толян · 22: Жора на паузе» (сезон «Свой автосалон», без мата):
# bg_zhorazakryt (салон «ЖОРА МОТОРС» закрыт: стеклянный фасад, на двери цепь и листок «ПЕРЕУЧЁТ», сдувшиеся шары, пустая площадка, серое небо),
# bg_lestnicazhory (лестничная площадка у квартиры Жоры: дверь с номером 47, коврик, почтовые ящики, батарея, окно в подъезде),
# bg_gostinayazhory (гостиная Жоры: ковёр на стене, стенка, большой телевизор, торшер, шторы; экран, приставка и диван — реквизит поверх)
import random
K = "#000"
HEAD = '  <svg id="bg" width="1080" height="1920" viewBox="0 0 1080 1920" style="position:absolute;left:0;top:0">\n'
F = 'font-family="Unbounded" font-weight="900"'
R = random.randint

random.seed(391)
zak = HEAD + f"""    <defs><linearGradient id="zksky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9aa3ad"/><stop offset="1" stop-color="#cfd3d8"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#zksky)"/>
    {"".join(f'<ellipse cx="{R(0, 1080)}" cy="{R(80, 420)}" rx="{R(120, 220)}" ry="{R(30, 60)}" fill="#b6bcc4" opacity=".8"/>' for _ in range(7))}
    <!-- фасад -->
    <rect x="40" y="520" width="1000" height="760" fill="#3a3f4a" stroke="{K}" stroke-width="8"/>
    <rect x="80" y="560" width="920" height="130" fill="#c0392b" stroke="{K}" stroke-width="7"/><text x="540" y="650" text-anchor="middle" {F} font-size="76" fill="#fff">ЖОРА МОТОРС</text>
    {"".join(f'<rect x="{x}" y="730" width="200" height="550" fill="#7f97ad" stroke="{K}" stroke-width="6"/><path d="M{x + 30} 760 l60 140" stroke="#c4d4e2" stroke-width="10" opacity=".6"/>' for x in (80, 300, 780))}
    <!-- дверь с цепью и листком -->
    <rect x="520" y="730" width="240" height="550" fill="#5a6a7a" stroke="{K}" stroke-width="7"/><path d="M640 730 V1280" stroke="{K}" stroke-width="6"/>
    <path d="M600 1000 q40 30 80 0 q-40 40 -80 0" fill="none" stroke="#8a8f96" stroke-width="12"/>{"".join(f'<ellipse cx="{595 + i * 18}" cy="{1000 + (i % 2) * 10}" rx="10" ry="6" fill="none" stroke="#a0a5ac" stroke-width="5"/>' for i in range(6))}
    <rect x="610" y="1040" width="60" height="44" rx="6" fill="#8a6a2a" stroke="{K}" stroke-width="5"/>
    <rect x="555" y="800" width="170" height="130" fill="#fbfaf3" stroke="{K}" stroke-width="4" transform="rotate(-3 640 865)"/>
    <text x="640" y="878" text-anchor="middle" {F} font-size="27" fill="#c0392b" transform="rotate(-3 640 865)">ПЕРЕУЧЁТ</text>
    <!-- асфальт, сдувшиеся шары -->
    <rect y="1280" width="1080" height="640" fill="#6a6a70"/><path d="M0 1280 H1080" stroke="{K}" stroke-width="7"/>
    {"".join(f'<path d="M{x} 1330 q30 -20 50 10 q-10 30 -50 -10" fill="{c}" stroke="{K}" stroke-width="4"/><path d="M{x + 40} 1340 q20 60 -10 120" stroke="#3a3a3a" stroke-width="3" fill="none"/>' for x, c in ((120, "#c0392b"), (220, "#ffd23f"), (880, "#c0392b")))}
    {"".join(f'<ellipse cx="{R(0, 1080)}" cy="{R(1400, 1880)}" rx="{R(60, 150)}" ry="{R(10, 22)}" fill="#7e7e86" opacity=".7"/>' for _ in range(6))}
  </svg>
"""

random.seed(392)
les = HEAD + f"""    <rect width="1080" height="1920" fill="#7a9a8a"/><rect y="0" width="1080" height="760" fill="#e8e2cf"/><path d="M0 760 H1080" stroke="#5a7a6a" stroke-width="10"/>
    {"".join(f'<path d="M{R(0, 1080)} {R(800, 1300)} l{R(-30, 30)} {R(20, 60)}" stroke="#6a8a7a" stroke-width="3"/>' for _ in range(16))}
    <!-- окно подъезда -->
    <rect x="70" y="220" width="260" height="380" fill="#bfd8e8" stroke="#f4f0e8" stroke-width="18"/><path d="M200 220 V600 M70 410 H330" stroke="#f4f0e8" stroke-width="10"/>
    <!-- почтовые ящики -->
    <rect x="80" y="820" width="280" height="240" fill="#4a5a8a" stroke="{K}" stroke-width="6"/>
    {"".join(f'<rect x="{92 + i * 90}" y="{834 + j * 72}" width="76" height="58" fill="#5a6a9a" stroke="{K}" stroke-width="4"/><text x="{130 + i * 90}" y="{870 + j * 72}" text-anchor="middle" font-family="JetBrains Mono" font-weight="800" font-size="20" fill="#fff">{40 + i + j * 3}</text>' for i in range(3) for j in range(3))}
    <!-- батарея -->
    <rect x="90" y="1180" width="260" height="150" rx="10" fill="#e8e4dc" stroke="{K}" stroke-width="6"/>{"".join(f'<path d="M{110 + i * 30} 1190 V1320" stroke="#c8c4bc" stroke-width="10"/>' for i in range(8))}
    <!-- дверь 47 -->
    <rect x="520" y="420" width="420" height="1010" fill="#6a3a22" stroke="{K}" stroke-width="9"/>
    {"".join(f'<rect x="{560 + (i % 2) * 180}" y="{470 + (i // 2) * 240}" width="160" height="210" fill="none" stroke="#5a2e1a" stroke-width="6"/>' for i in range(8))}
    <circle cx="890" cy="940" r="20" fill="#ffd23f" stroke="{K}" stroke-width="5"/><circle cx="730" cy="560" r="14" fill="#151515"/>
    <rect x="690" y="460" width="80" height="46" rx="6" fill="#ffd23f" stroke="{K}" stroke-width="4"/><text x="730" y="494" text-anchor="middle" {F} font-size="30" fill="#151515">47</text>
    <!-- пол и коврик -->
    <rect y="1430" width="1080" height="490" fill="#b8a888"/><path d="M0 1430 H1080" stroke="{K}" stroke-width="7"/>
    {"".join(f'<path d="M{x} 1430 L{x - 120} 1920" stroke="#a89878" stroke-width="5"/>' for x in range(0, 1300, 120))}
    <rect x="560" y="1460" width="340" height="110" rx="10" fill="#8a3a3a" stroke="{K}" stroke-width="6"/><text x="730" y="1530" text-anchor="middle" {F} font-size="30" fill="#f4d0a0">ДОБРО ПОЖАЛОВАТЬ</text>
  </svg>
"""

random.seed(393)
gos = HEAD + f"""    <rect width="1080" height="1920" fill="#d8c8a8"/>{"".join(f'<path d="M{x} 0 V1300" stroke="#cdbd9c" stroke-width="22"/>' for x in range(10, 1080, 70))}
    <!-- ковёр на стене -->
    <rect x="60" y="140" width="420" height="560" rx="10" fill="#8a1f2a" stroke="{K}" stroke-width="7"/><rect x="90" y="170" width="360" height="500" fill="none" stroke="#e0b060" stroke-width="10"/>
    <path d="M270 210 L410 420 L270 630 L130 420 Z" fill="#c0392b" stroke="#e0b060" stroke-width="8"/><path d="M270 300 L350 420 L270 540 L190 420 Z" fill="#2a3a6a" stroke="#e0b060" stroke-width="6"/>
    {"".join(f'<circle cx="{110 + i * 64}" cy="200" r="9" fill="#e0b060"/><circle cx="{110 + i * 64}" cy="640" r="9" fill="#e0b060"/>' for i in range(6))}
    <!-- стенка с сервизом -->
    <rect x="520" y="120" width="520" height="620" fill="#6a4228" stroke="{K}" stroke-width="7"/><rect x="545" y="150" width="225" height="300" fill="#a8c4d4" opacity=".55" stroke="{K}" stroke-width="5"/><rect x="790" y="150" width="225" height="300" fill="#a8c4d4" opacity=".55" stroke="{K}" stroke-width="5"/>
    {"".join(f'<ellipse cx="{x}" cy="{y}" rx="26" ry="16" fill="#f4f0e8" stroke="#2a5aa0" stroke-width="4"/>' for x in (590, 660, 730, 840, 910, 980) for y in (250, 380))}
    <!-- шторы и окно с вечером -->
    <rect x="-20" y="740" width="1120" height="40" fill="#5a3a22" stroke="{K}" stroke-width="5"/>
    <!-- торшер -->
    <path d="M980 1300 V880" stroke="#2b2c31" stroke-width="10"/><path d="M920 880 h120 l-30 -110 h-60 z" fill="#f0c860" stroke="{K}" stroke-width="6"/><ellipse cx="980" cy="900" rx="160" ry="60" fill="#ffe08a" opacity=".2"/>
    <!-- пол с паласом -->
    <rect y="1300" width="1080" height="620" fill="#8a5a3a"/><path d="M0 1300 H1080" stroke="{K}" stroke-width="7"/>
    <ellipse cx="540" cy="1680" rx="520" ry="190" fill="#3a5a8a" stroke="{K}" stroke-width="6"/><ellipse cx="540" cy="1680" rx="400" ry="130" fill="none" stroke="#e0b060" stroke-width="8"/>
  </svg>
"""

for n, s in (("zhorazakryt", zak), ("lestnicazhory", les), ("gostinayazhory", gos)):
    open(f"bg_{n}.svg.part", "w").write(s)
print("ok")
