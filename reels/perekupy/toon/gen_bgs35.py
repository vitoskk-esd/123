# python3 gen_bgs35.py → новые фоны для «Толян: со ста тысяч», часть 8 «Школьная парковка» (каждая серия — новые фоны):
# bg_shkpark (парковка учителей с другой стороны: забор, флагшток, стена школы с панно «ЗНАНИЕ — СИЛА», места с табличками, пустое «ДИРЕКТОР»),
# bg_kabinet (кабинет математики: меловая доска, портреты, парты, глобус), bg_masterskaya (школьная мастерская труда: верстаки, тиски, стружка,
# плакат «ТЕХНИКА БЕЗОПАСНОСТИ»), bg_uchitelskaya (учительская: стол с чайником, доска расписания, шкаф с журналами, фикус)
import random
K = "#000"
random.seed(47)
HEAD = '  <svg id="bg" width="1080" height="1920" viewBox="0 0 1080 1920" style="position:absolute;left:0;top:0">\n'
F = 'font-family="Unbounded" font-weight="900"'
M = 'font-family="JetBrains Mono" font-weight="800"'

shkpark = HEAD + f'''    <rect width="1080" height="1920" fill="#cde7f7"/><ellipse cx="260" cy="150" rx="150" ry="36" fill="#fff" opacity=".9"/>
    <!-- стена школы: кирпич + панно -->
    <rect x="0" y="230" width="1080" height="770" fill="#e3b58a" stroke="{K}" stroke-width="8"/>
    <g stroke="#c9946a" stroke-width="3">{"".join(f'<path d="M0 {y} H1080"/>' for y in range(270, 1000, 40))}</g>
    <rect x="160" y="300" width="760" height="300" rx="18" fill="#2f6db5" stroke="{K}" stroke-width="7"/>
    <text x="540" y="410" text-anchor="middle" {F} font-size="62" fill="#fff">ЗНАНИЕ —</text><text x="540" y="500" text-anchor="middle" {F} font-size="62" fill="#ffd23f">СИЛА</text>
    <circle cx="250" cy="450" r="46" fill="#ffd23f" stroke="{K}" stroke-width="6"/><path d="M226 450 l18 18 l30 -36" fill="none" stroke="{K}" stroke-width="8"/>
    {"".join(f'<rect x="{x}" y="640" width="130" height="140" fill="#9fc3e0" stroke="{K}" stroke-width="6"/><path d="M{x + 65} 640 v140" stroke="{K}" stroke-width="4"/>' for x in (60, 290, 660, 890))}
    <!-- флагшток -->
    <g><path d="M520 1000 V560" stroke="#8a929b" stroke-width="12"/><path d="M526 570 h110 v70 h-110 z" fill="#fff" stroke="{K}" stroke-width="4"/><rect x="526" y="593" width="110" height="24" fill="#2f6db5"/><rect x="526" y="617" width="110" height="23" fill="#c0392b"/></g>
    <!-- забор-сетка вдоль парковки -->
    <rect x="0" y="880" width="1080" height="120" fill="none"/><g stroke="#4d5662" stroke-width="5" opacity=".8">{"".join(f'<path d="M{x} 880 V1000"/>' for x in range(0, 1081, 90))}<path d="M0 880 H1080"/></g>
    <g stroke="#7c8792" stroke-width="2" opacity=".55">{"".join(f'<path d="M{x} 880 l120 120 M{x + 120} 880 l-120 120"/>' for x in range(-120, 1080, 60))}</g>
    <!-- асфальт парковки: разметка и таблички мест -->
    <rect y="1000" width="1080" height="920" fill="#7a828b"/><path d="M0 1000 H1080" stroke="{K}" stroke-width="7"/>
    <g stroke="#f4f1e8" stroke-width="10">{"".join(f'<path d="M{x} 1080 l-30 520"/>' for x in (40, 300, 560, 820, 1060))}</g>
    {"".join(f'<g><rect x="{x}" y="1030" width="200" height="56" rx="8" fill="{c}" stroke="{K}" stroke-width="5"/><text x="{x + 100}" y="1068" text-anchor="middle" {F} font-size="{22 if len(t) < 9 else 17}" fill="{fc}">{t}</text></g>' for x, t, c, fc in [(70, "ФИЗРУК", "#fff", "#151515"), (330, "МАТЕМАТИКА", "#fff", "#151515"), (590, "ТРУД", "#fff", "#151515"), (850, "ДИРЕКТОР", "#c0392b", "#fff")])}
    {"".join(f'<ellipse cx="{random.randint(60, 1020)}" cy="{random.randint(1650, 1880)}" rx="{random.randint(40, 110)}" ry="10" fill="#6d757e" opacity=".8"/>' for _ in range(6))}
    <!-- листья -->
    {"".join(f'<ellipse cx="{random.randint(20, 1060)}" cy="{random.randint(1100, 1900)}" rx="14" ry="8" fill="{random.choice(["#e8a33a", "#d9732b", "#c9b23a"])}" transform="rotate({random.randint(0, 180)})" opacity=".9"/>' for _ in range(0))}
  </svg>
'''

kabinet = HEAD + f'''    <rect width="1080" height="1920" fill="#dfe8d4"/>
    <rect y="0" width="1080" height="130" fill="#cfdac2" stroke="{K}" stroke-width="6"/>
    {"".join(f'<rect x="{x}" y="30" width="200" height="70" rx="10" fill="#fff7dc" stroke="{K}" stroke-width="5" style="filter:drop-shadow(0 0 16px #fff2c0)"/>' for x in (150, 730))}
    <!-- доска -->
    <rect x="60" y="330" width="960" height="540" rx="10" fill="#8a5a33" stroke="{K}" stroke-width="8"/>
    <rect x="86" y="354" width="908" height="490" fill="#25463a" stroke="{K}" stroke-width="5"/>
    <path d="M120 420 q80 -16 160 6 M120 800 h120" stroke="#e8efe6" stroke-width="5" opacity=".25" fill="none"/>
    <rect x="60" y="866" width="960" height="22" fill="#6b4a2b" stroke="{K}" stroke-width="5"/><rect x="760" y="854" width="70" height="16" rx="4" fill="#fff"/><rect x="860" y="852" width="90" height="22" rx="6" fill="#c9b08a" stroke="{K}" stroke-width="3"/>
    <!-- портреты учёных -->
    {"".join(f'<g><rect x="{x}" y="170" width="120" height="140" fill="#f4efe2" stroke="{K}" stroke-width="5"/><circle cx="{x + 60}" cy="225" r="30" fill="#d9c6a5" stroke="{K}" stroke-width="4"/><path d="M{x + 24} 300 q36 -40 72 0" fill="#6b6b6b" stroke="{K}" stroke-width="4"/><path d="M{x + 30} 214 q30 -34 60 0" fill="#e8e8e8" stroke="{K}" stroke-width="3"/></g>' for x in (120, 300, 660, 840))}
    <text x="540" y="260" text-anchor="middle" {F} font-size="34" fill="#2b2f37">π ≈ 3,14</text>
    <!-- глобус и шкаф -->
    <g><rect x="900" y="900" width="140" height="100" fill="#a0703f" stroke="{K}" stroke-width="5"/><circle cx="970" cy="860" r="46" fill="#5aa0d6" stroke="{K}" stroke-width="5"/><path d="M940 840 q20 -10 40 6 q10 20 -10 34 M960 900 v-0" stroke="#5f9d48" stroke-width="14" fill="none"/></g>
    <!-- пол и парты -->
    <rect y="1000" width="1080" height="920" fill="#b98a5a"/><path d="M0 1000 H1080" stroke="{K}" stroke-width="7"/>
    <g stroke="#a07548" stroke-width="5">{"".join(f'<path d="M0 {y} H1080"/>' for y in range(1060, 1920, 70))}</g>
    {"".join(f'<g><rect x="{x}" y="{y}" width="300" height="34" fill="#e8d2a8" stroke="{K}" stroke-width="5"/><path d="M{x + 20} {y + 34} v{90 + (y - 1300) // 6} M{x + 280} {y + 34} v{90 + (y - 1300) // 6}" stroke="#3b3f46" stroke-width="10"/></g>' for x, y in [(60, 1600), (720, 1600), (60, 1760), (720, 1760)])}
    <rect x="380" y="1080" width="320" height="40" fill="#8a5a33" stroke="{K}" stroke-width="6"/><path d="M400 1120 v120 M680 1120 v120" stroke="#3b3f46" stroke-width="12"/>
    <g><rect x="420" y="1040" width="90" height="40" fill="#f4f1e8" stroke="{K}" stroke-width="4"/><rect x="560" y="1046" width="70" height="34" fill="#2f6db5" stroke="{K}" stroke-width="4"/></g>
  </svg>
'''

masterskaya = HEAD + f'''    <rect width="1080" height="1920" fill="#9aa6a0"/>
    <rect y="0" width="1080" height="110" fill="#7f8a85" stroke="{K}" stroke-width="6"/>{"".join(f'<rect x="{x}" y="34" width="180" height="40" rx="8" fill="#eef6ff" stroke="{K}" stroke-width="4" style="filter:drop-shadow(0 0 14px #e6f0ff)"/>' for x in (130, 450, 770))}
    <!-- стена с инструментами -->
    <rect x="40" y="200" width="620" height="420" fill="#c9a26b" stroke="{K}" stroke-width="7"/>
    {"".join(f'<circle cx="{x}" cy="{y}" r="5" fill="#5b4636"/>' for x in range(70, 660, 40) for y in range(230, 620, 40))}
    <g stroke="{K}" stroke-width="5">
      <path d="M110 260 v170" stroke="#6b4a2b" stroke-width="16"/><rect x="86" y="240" width="48" height="40" fill="#8a929b"/>
      <path d="M210 250 v210" stroke="#8a929b" stroke-width="10"/><path d="M190 250 h40" stroke="#8a929b" stroke-width="14"/>
      <path d="M300 260 l60 200" stroke="#c0392b" stroke-width="14"/><circle cx="300" cy="260" r="20" fill="#8a929b"/>
      <rect x="400" y="250" width="200" height="60" fill="#d9d9d9"/><path d="M410 310 l10 14 l10 -14 l10 14 l10 -14 l10 14 l10 -14 l10 14 l10 -14 l10 14 l10 -14 l10 14 l10 -14 l10 14 l10 -14 l10 14 l10 -14 l10 14 l10 -14" fill="none"/>
      <path d="M420 400 h160 v40 h-160 z" fill="#ffd23f"/><path d="M580 410 h40" stroke="#151515" stroke-width="10"/></g>
    <!-- плакат ТБ -->
    <g transform="rotate(2 860 380)"><rect x="720" y="210" width="300" height="360" fill="#fff" stroke="{K}" stroke-width="6"/><rect x="720" y="210" width="300" height="70" fill="#c0392b"/>
      <text x="870" y="256" text-anchor="middle" {F} font-size="26" fill="#fff">ТЕХНИКА</text><text x="870" y="320" text-anchor="middle" {F} font-size="24" fill="#151515">БЕЗОПАСНОСТИ</text>
      {"".join(f'<rect x="750" y="{y}" width="{220 - (y % 3) * 30}" height="14" fill="#9aa3ad"/>' for y in range(350, 550, 34))}</g>
    <!-- верстак с тисками -->
    <g><rect x="60" y="760" width="760" height="60" fill="#8a5a33" stroke="{K}" stroke-width="7"/><path d="M90 820 v180 M790 820 v180" stroke="#5b4636" stroke-width="22"/>
      <rect x="560" y="690" width="120" height="70" fill="#3b4a6b" stroke="{K}" stroke-width="6"/><rect x="530" y="700" width="40" height="40" fill="#2b3a5a" stroke="{K}" stroke-width="5"/><path d="M680 725 h70" stroke="#8a929b" stroke-width="10"/>
      <rect x="140" y="724" width="260" height="36" fill="#e8c77a" stroke="{K}" stroke-width="5"/></g>
    <!-- станок -->
    <g><rect x="860" y="660" width="170" height="340" fill="#4f7a5a" stroke="{K}" stroke-width="7"/><circle cx="945" cy="740" r="44" fill="#9aa3ad" stroke="{K}" stroke-width="6"/><rect x="890" y="820" width="110" height="40" fill="#2b3a2f"/></g>
    <!-- пол со стружкой -->
    <rect y="1000" width="1080" height="920" fill="#6f6a62"/><path d="M0 1000 H1080" stroke="{K}" stroke-width="7"/>
    {"".join(f'<path d="M{x} {y} q12 -14 24 0 q12 14 24 0" stroke="#e8c77a" stroke-width="5" fill="none"/>' for x, y in ((random.randint(30, 1030), random.randint(1060, 1880)) for _ in range(40)))}
  </svg>
'''

uchitelskaya = HEAD + f'''    <rect width="1080" height="1920" fill="#efe2c8"/>
    <!-- обои-полоска -->
    <g stroke="#e3d3b2" stroke-width="18">{"".join(f'<path d="M{x} 0 V1000"/>' for x in range(20, 1080, 60))}</g>
    <!-- доска расписания -->
    <rect x="80" y="220" width="560" height="500" rx="10" fill="#fff" stroke="{K}" stroke-width="8"/><rect x="80" y="220" width="560" height="70" rx="10" fill="#2f6db5" stroke="{K}" stroke-width="8"/>
    <text x="360" y="268" text-anchor="middle" {F} font-size="32" fill="#fff">РАСПИСАНИЕ</text>
    <g stroke="#9aa3ad" stroke-width="3">{"".join(f'<path d="M100 {y} H620"/>' for y in range(330, 720, 48))}<path d="M200 300 V710 M420 300 V710"/></g>
    {"".join(f'<rect x="{x}" y="{y}" width="{w}" height="16" fill="{c}"/>' for x, y, w, c in [(220, 340, 170, "#c0392b"), (440, 340, 150, "#2f6db5"), (220, 388, 140, "#4f9d48"), (440, 388, 160, "#c0392b"), (220, 436, 160, "#2f6db5"), (440, 436, 120, "#e8a33a"), (220, 484, 120, "#e8a33a"), (440, 484, 170, "#4f9d48")])}
    <!-- шкаф с журналами -->
    <g><rect x="720" y="200" width="300" height="800" fill="#a0703f" stroke="{K}" stroke-width="8"/><path d="M720 440 H1020 M720 680 H1020" stroke="{K}" stroke-width="6"/>
      {"".join(f'<rect x="{x}" y="{y}" width="38" height="200" fill="{c}" stroke="{K}" stroke-width="4"/>' for y in (230, 470) for x, c in zip(range(740, 1000, 44), ["#c0392b", "#2f6db5", "#4f9d48", "#e8a33a", "#6b4a8a", "#c0392b"]))}
      <text x="870" y="800" text-anchor="middle" {F} font-size="22" fill="#fff">ЖУРНАЛЫ</text></g>
    <!-- фикус -->
    <g><path d="M140 1000 V820" stroke="#4f6b3a" stroke-width="10"/>{"".join(f'<ellipse cx="{140 + dx}" cy="{820 + dy}" rx="34" ry="16" fill="#4f9d48" stroke="{K}" stroke-width="4" transform="rotate({r} {140 + dx} {820 + dy})"/>' for dx, dy, r in [(-30, 0, -30), (30, -20, 30), (-20, -50, -40), (24, -70, 40), (0, -100, 0)])}<path d="M100 1000 l10 -70 h60 l10 70 z" fill="#c0392b" stroke="{K}" stroke-width="5"/></g>
    <!-- стол, чайник, кружки -->
    <rect y="1000" width="1080" height="920" fill="#8c6b4a"/><path d="M0 1000 H1080" stroke="{K}" stroke-width="7"/>
    <g stroke="#7a5b3d" stroke-width="5">{"".join(f'<path d="M{x} 1000 L{x * 1.5 - 270} 1920"/>' for x in range(0, 1181, 120))}</g>
    <g><rect x="200" y="1500" width="680" height="40" fill="#e8d2a8" stroke="{K}" stroke-width="7"/><path d="M230 1540 v200 M850 1540 v200" stroke="#5b4636" stroke-width="16"/>
      <path d="M420 1500 q0 -70 50 -70 q50 0 50 70 z" fill="#f4f1e8" stroke="{K}" stroke-width="5"/><path d="M520 1460 q30 0 24 30" fill="none" stroke="{K}" stroke-width="6"/>
      {"".join(f'<rect x="{x}" y="1462" width="40" height="38" rx="6" fill="{c}" stroke="{K}" stroke-width="4"/>' for x, c in [(600, "#c0392b"), (660, "#2f6db5"), (300, "#ffd23f")])}</g>
  </svg>
'''
for n, s in (("shkpark", shkpark), ("kabinet", kabinet), ("masterskaya", masterskaya), ("uchitelskaya", uchitelskaya)): open(f"bg_{n}.svg.part", "w").write(s)
print("ok")
