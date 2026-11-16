# python3 gen_bgs69.py → фоны для ep77 «Толян: свой автосалон · 1» (мини-сериал, без мата):
# bg_ploshchadkasdam (бывшая АЗС на выезде из города днём: навес без колонок, баннер «СДАЁТСЯ», бурьян, трещины, будка оператора),
# bg_garazhpalycha (гараж деда Палыча: машина под брезентом, полки с банками, календарь 1998, вымпел, лампа),
# bg_ploshchadkavecher (та же площадка вечером: гирлянда, самодельная вывеска «АВТОСАЛОН ТОЛЯНА», через дорогу — здание с пустым щитом)
import random
K = "#000"
HEAD = '  <svg id="bg" width="1080" height="1920" viewBox="0 0 1080 1920" style="position:absolute;left:0;top:0">\n'
F = 'font-family="Unbounded" font-weight="900"'
R = random.randint

def lot(sky1, sky2, ground, extra_far="", extra_near=""):
    return HEAD + f'''    <defs><linearGradient id="s{sky1[1:]}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{sky1}"/><stop offset="1" stop-color="{sky2}"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#s{sky1[1:]})"/>{extra_far}
    <!-- навес бывшей АЗС -->
    <rect x="80" y="560" width="920" height="90" fill="#d8d4cc" stroke="{K}" stroke-width="7"/><rect x="80" y="630" width="920" height="20" fill="#c0392b"/>
    {"".join(f'<rect x="{x}" y="650" width="44" height="560" fill="#9aa0a6" stroke="{K}" stroke-width="6"/>' for x in (200, 836))}
    {"".join(f'<rect x="{x}" y="1150" width="120" height="60" fill="#7f858b" stroke="{K}" stroke-width="5"/>' for x in (380, 580))}
    <!-- будка оператора -->
    <rect x="-20" y="900" width="170" height="310" fill="#e8e0cc" stroke="{K}" stroke-width="6"/><rect x="20" y="960" width="90" height="90" fill="#7aa8c8" stroke="{K}" stroke-width="5"/>
    <!-- асфальт с трещинами и бурьян -->
    <rect y="1210" width="1080" height="710" fill="{ground}"/><path d="M0 1210 H1080" stroke="{K}" stroke-width="6"/>
    {"".join(f'<path d="M{R(0, 1080)} {R(1260, 1880)} l{R(-60, 60)} {R(20, 60)} l{R(-40, 40)} {R(20, 50)}" stroke="#4a4e54" stroke-width="5" fill="none"/>' for _ in range(12))}
    {"".join(f'<path d="M{x} 1215 q-10 -50 6 -80 M{x + 10} 1215 q4 -60 22 -70 M{x + 20} 1215 q14 -40 34 -46" stroke="#6a8a3a" stroke-width="6" fill="none"/>' for x in (150, 300, 760, 960))}
    {extra_near}
  </svg>
'''

random.seed(331)
sdam = lot("#9fc8e8", "#e6f0f4", "#6f747b", extra_far=f'''
    <path d="M0 900 {"".join(f"L{x} {R(820, 880)} " for x in range(0, 1100, 90))} V1210 H0 Z" fill="#8aa080"/>
    <rect x="660" y="760" width="360" height="160" fill="#fff" stroke="{K}" stroke-width="7" transform="rotate(2 840 840)"/>
    <text x="840" y="840" text-anchor="middle" {F} font-size="58" fill="#c0392b" transform="rotate(2 840 840)">СДАЁТСЯ</text>
    <text x="840" y="890" text-anchor="middle" font-family="Onest" font-weight="800" font-size="30" fill="#151515" transform="rotate(2 840 840)">8-9••-•••-••-••</text>''')

random.seed(332)
vecher = lot("#2a2f5a", "#e88a5a", "#4f545b", extra_far=f'''
    <!-- через дорогу: здание с пустым щитом -->
    <rect x="560" y="700" width="480" height="250" fill="#3a3f52" stroke="{K}" stroke-width="6"/>{"".join(f'<rect x="{590 + k * 110}" y="820" width="70" height="90" fill="#f5c46a" opacity=".8"/>' for k in range(4))}
    <rect x="580" y="600" width="440" height="110" fill="#f4f0e8" stroke="{K}" stroke-width="6"/><path d="M620 710 V760 M980 710 V760" stroke="{K}" stroke-width="8"/>''',
    extra_near=f'''
    <!-- гирлянда и самодельная вывеска Толяна -->
    <path d="M80 560 Q540 640 1000 560" stroke="#151515" stroke-width="4" fill="none"/>{"".join(f'<circle cx="{80 + k * 46}" cy="{560 + 80 * (1 - ((k * 46 - 460) / 460) ** 2)}" r="9" fill="{("#ffd23f", "#ff6b6b", "#7fd0ff")[k % 3]}"/>' for k in range(21))}
    <rect x="240" y="420" width="600" height="120" fill="#ffd23f" stroke="{K}" stroke-width="8" transform="rotate(-2 540 480)"/>
    <text x="540" y="500" text-anchor="middle" {F} font-size="54" fill="#151515" transform="rotate(-2 540 480)">АВТОСАЛОН ТОЛЯНА</text>''')

random.seed(333)
palych = HEAD + f'''    <rect width="1080" height="1920" fill="#6a5a4a"/>
    {"".join(f'<rect x="{(k % 2) * -60 + x}" y="{60 + k * 70}" width="120" height="70" fill="#7a6a58" stroke="#5a4a3a" stroke-width="4"/>' for k in range(16) for x in range(0, 1140, 120))}
    <!-- лампа -->
    <path d="M540 0 V220" stroke="#151515" stroke-width="5"/><path d="M490 220 h100 l-20 30 h-60 z" fill="#2b5a3a" stroke="{K}" stroke-width="5"/><ellipse cx="540" cy="262" rx="26" ry="12" fill="#fff2b0"/>
    <!-- календарь 1998 и вымпел -->
    <rect x="80" y="300" width="230" height="300" fill="#f4f0e8" stroke="{K}" stroke-width="6" transform="rotate(-2 195 450)"/><rect x="95" y="320" width="200" height="140" fill="#c0392b" transform="rotate(-2 195 450)"/>
    <text x="195" y="410" text-anchor="middle" {F} font-size="52" fill="#fff" transform="rotate(-2 195 450)">1998</text>
    {"".join(f'<rect x="{105 + (k % 6) * 32}" y="{480 + (k // 6) * 26}" width="24" height="18" fill="#c9c2b4" transform="rotate(-2 195 450)"/>' for k in range(18))}
    <path d="M820 300 h180 l-90 160 z" fill="#c0392b" stroke="{K}" stroke-width="6"/><text x="910" y="350" text-anchor="middle" {F} font-size="26" fill="#ffd23f">ЛУЧШИЙ</text><text x="910" y="380" text-anchor="middle" {F} font-size="22" fill="#ffd23f">ВОДИТЕЛЬ</text>
    <!-- полки с банками -->
    <rect x="740" y="560" width="300" height="20" fill="#8a6a4a" stroke="{K}" stroke-width="4"/><rect x="740" y="760" width="300" height="20" fill="#8a6a4a" stroke="{K}" stroke-width="4"/>
    {"".join(f'<rect x="{760 + k * 70}" y="{y - 90}" width="54" height="90" rx="10" fill="{c}" stroke="{K}" stroke-width="4" opacity=".9"/><rect x="{760 + k * 70}" y="{y - 100}" width="54" height="16" fill="#c9a03a" stroke="{K}" stroke-width="3"/>' for y in (560, 760) for k, c in enumerate(("#c0392b", "#e8a03a", "#6a9a3a", "#c0392b")))}
    <!-- пол -->
    <rect y="1200" width="1080" height="720" fill="#5a5e64"/><path d="M0 1200 H1080" stroke="{K}" stroke-width="6"/>
    {"".join(f'<ellipse cx="{R(0, 1080)}" cy="{R(1260, 1880)}" rx="{R(40, 120)}" ry="{R(8, 20)}" fill="#3a3e44" opacity=".5"/>' for _ in range(8))}
  </svg>
'''

for n, s in (("ploshchadkasdam", sdam), ("garazhpalycha", palych), ("ploshchadkavecher", vecher)):
    open(f"bg_{n}.svg.part", "w").write(s)
print("ok")
