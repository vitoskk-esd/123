# python3 gen_bgs73.py → фоны для ep81 «Толян · 20: подстава» (сезон «Свой автосалон», без мата):
# bg_utrotolyana (кухня Толяна утром: окно на панельки и рассвет, стол с кружкой, холодильник с магнитами, плакат с вишнёвым Марком),
# bg_garazhizavodskaya (ГСК «Заводской» вечером: ряды гаражей с номерами, один открыт и светится, фонарь, лужи, табличка),
# bg_ofisrimmy (кабинет Риммы Захаровны: стол с бумагами, калькулятор, фикус, календарь «НЕДЕЛЯ 6», рамка с фото площадки, окно)
import random
K = "#000"
HEAD = '  <svg id="bg" width="1080" height="1920" viewBox="0 0 1080 1920" style="position:absolute;left:0;top:0">\n'
F = 'font-family="Unbounded" font-weight="900"'
R = random.randint

random.seed(371)
utro = HEAD + f"""    <defs><linearGradient id="utsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffb47a"/><stop offset="1" stop-color="#ffe2b8"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="#e8d8c0"/>{"".join(f'<path d="M{x} 0 V1300" stroke="#dccab0" stroke-width="40"/>' for x in range(30, 1080, 120))}
    <!-- окно: рассвет над панельками -->
    <rect x="300" y="200" width="600" height="620" fill="url(#utsky)" stroke="#f4f0e8" stroke-width="24"/>
    <circle cx="700" cy="640" r="90" fill="#ffd97a"/>
    {"".join(f'<rect x="{x}" y="{y}" width="{w}" height="{820 - y}" fill="#8a7a8a"/>' + "".join(f'<rect x="{x + 12 + i * 26}" y="{y + 14 + j * 34}" width="14" height="18" fill="{"#ffe08a" if (i + j + x) % 3 == 0 else "#6a5a6a"}"/>' for i in range(w // 26) for j in range((820 - y) // 34)) for x, y, w in ((312, 520, 140), (470, 470, 120), (760, 540, 130)))}
    <path d="M600 200 V820 M300 510 H900" stroke="#f4f0e8" stroke-width="14"/>
    <!-- плакат с Марком II -->
    <rect x="40" y="260" width="220" height="300" fill="#151515" stroke="{K}" stroke-width="6"/><rect x="56" y="276" width="188" height="200" fill="#8a1a2a"/>
    <path d="M70 430 q40 -50 110 -50 q40 0 60 40 v20 h-170 z" fill="#c0283a" stroke="{K}" stroke-width="4"/><text x="150" y="530" text-anchor="middle" {F} font-size="30" fill="#ffd23f">MARK II</text>
    <!-- холодильник с магнитами -->
    <rect x="900" y="560" width="200" height="760" rx="18" fill="#f4f6f8" stroke="{K}" stroke-width="7"/><path d="M900 860 H1100" stroke="{K}" stroke-width="6"/>
    {"".join(f'<rect x="{x}" y="{y}" width="34" height="34" rx="6" fill="{c}" stroke="{K}" stroke-width="3"/>' for x, y, c in ((930, 620, "#ff3b30"), (980, 680, "#ffd23f"), (940, 740, "#2f6db5"), (1000, 620, "#4cd964")))}
    <!-- стол и кружка -->
    <rect y="1300" width="1080" height="620" fill="#b8865a"/><path d="M0 1300 H1080" stroke="{K}" stroke-width="7"/>
    {"".join(f'<path d="M0 {y} H1080" stroke="#a87650" stroke-width="5"/>' for y in range(1380, 1920, 80))}
    <rect x="760" y="1180" width="110" height="130" rx="14" fill="#f4f0e8" stroke="{K}" stroke-width="6"/><path d="M870 1210 q50 10 0 70" stroke="{K}" stroke-width="10" fill="none"/>
    <path d="M790 1160 q10 -30 0 -50 M830 1160 q10 -30 0 -50" stroke="#b8a8a0" stroke-width="5" fill="none"/>
  </svg>
"""

random.seed(372)
gsk = HEAD + f"""    <defs><linearGradient id="gzsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a2a52"/><stop offset="1" stop-color="#b86a5a"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#gzsky)"/>
    <!-- табличка -->
    <rect x="330" y="430" width="420" height="100" fill="#2f6db5" stroke="{K}" stroke-width="6"/><text x="540" y="497" text-anchor="middle" {F} font-size="40" fill="#fff">ГСК «ЗАВОДСКОЙ»</text>
    <path d="M390 530 V620 M690 530 V620" stroke="#4a4e54" stroke-width="10"/>
    <!-- ряд гаражей -->
    <rect x="-20" y="620" width="1120" height="600" fill="#8a8478" stroke="{K}" stroke-width="7"/><rect x="-20" y="600" width="1120" height="40" fill="#5a5a5a" stroke="{K}" stroke-width="6"/>
    {"".join(f'<rect x="{x}" y="700" width="230" height="520" fill="{c}" stroke="{K}" stroke-width="6"/><text x="{x + 115}" y="760" text-anchor="middle" {F} font-size="34" fill="#f4f0e8">{n}</text>' for x, c, n in ((10, "#5a6a7a", 12), (270, "#7a5a4a", 13), (790, "#4a6a5a", 15)))}
    <!-- открытый гараж со светом -->
    <rect x="530" y="700" width="230" height="520" fill="#ffe7a0" stroke="{K}" stroke-width="6"/><path d="M530 700 h230 v90 h-230 z" fill="#5a5a5a" stroke="{K}" stroke-width="5"/><text x="645" y="760" text-anchor="middle" {F} font-size="34" fill="#f4f0e8">14</text>
    <path d="M560 1220 L460 1500 H860 L760 1220 Z" fill="#ffe7a0" opacity=".25"/>
    <!-- фонарь -->
    <path d="M980 1240 V560 M980 560 h-60" stroke="#2b2f37" stroke-width="12"/><ellipse cx="910" cy="575" rx="36" ry="14" fill="#ffd98a"/><path d="M910 590 L820 1240 H1000 Z" fill="#ffd98a" opacity=".12"/>
    <!-- грунт, лужи -->
    <rect y="1220" width="1080" height="700" fill="#5a5650"/><path d="M0 1220 H1080" stroke="{K}" stroke-width="6"/>
    {"".join(f'<ellipse cx="{R(0, 1080)}" cy="{R(1300, 1880)}" rx="{R(70, 170)}" ry="{R(12, 26)}" fill="#7a6a8a" opacity=".55"/>' for _ in range(7))}
  </svg>
"""

random.seed(373)
ofis = HEAD + f"""    <rect width="1080" height="1920" fill="#d8dce0"/>{"".join(f'<path d="M0 {y} H1080" stroke="#ccd0d6" stroke-width="3"/>' for y in range(40, 1300, 60))}
    <!-- окно -->
    <rect x="560" y="200" width="460" height="560" fill="#a8cce4" stroke="#f4f0e8" stroke-width="22"/><path d="M790 200 V760" stroke="#f4f0e8" stroke-width="12"/>
    {"".join(f'<rect x="{x}" y="{y}" width="{w}" height="{760 - y}" fill="#8aa0b4"/>' for x, y, w in ((580, 520, 90), (690, 460, 80), (820, 540, 120), (950, 480, 60)))}
    <!-- календарь «НЕДЕЛЯ 6» -->
    <rect x="80" y="240" width="300" height="360" fill="#f4f0e8" stroke="{K}" stroke-width="6"/><rect x="80" y="240" width="300" height="90" fill="#c0392b" stroke="{K}" stroke-width="6"/>
    <text x="230" y="302" text-anchor="middle" {F} font-size="36" fill="#fff">НЕДЕЛЯ</text><text x="230" y="510" text-anchor="middle" {F} font-size="170" fill="#151515">6</text>
    <!-- рамка с фото площадки -->
    <rect x="120" y="680" width="240" height="180" fill="#8a6a3a" stroke="{K}" stroke-width="6"/><rect x="136" y="696" width="208" height="148" fill="#bcd8ea"/>
    <rect x="146" y="740" width="188" height="20" fill="#e8e4dc" stroke="{K}" stroke-width="3"/><path d="M170 760 V840 M310 760 V840" stroke="#8a9096" stroke-width="8"/>
    <!-- фикус -->
    <path d="M960 1300 h-120 l20 -140 h80 z" fill="#c06a3a" stroke="{K}" stroke-width="6"/>{"".join(f'<ellipse cx="{900 + dx}" cy="{1100 + dy}" rx="34" ry="70" fill="#3a8a3a" stroke="#1f5a1f" stroke-width="4" transform="rotate({dx} {900 + dx} {1100 + dy})"/>' for dx, dy in ((-60, 10), (0, -50), (60, 0), (-30, -110), (40, -120)))}
    <!-- стол с бумагами и калькулятором -->
    <rect y="1300" width="1080" height="620" fill="#6a4a30"/><path d="M0 1300 H1080" stroke="{K}" stroke-width="8"/>
    {"".join(f'<rect x="{x}" y="{y}" width="230" height="300" fill="#fbfaf3" stroke="{K}" stroke-width="5" transform="rotate({a} {x + 115} {y + 150})"/>' for x, y, a in ((120, 1360, -6), (180, 1380, 4)))}
    <rect x="680" y="1380" width="200" height="270" rx="16" fill="#2b2c31" stroke="{K}" stroke-width="6"/><rect x="700" y="1400" width="160" height="60" fill="#cfe9c4"/>
    {"".join(f'<rect x="{700 + i * 42}" y="{1480 + j * 42}" width="32" height="32" rx="6" fill="#5a5c62"/>' for i in range(4) for j in range(4))}
  </svg>
"""

for n, s in (("utrotolyana", utro), ("garazhizavodskaya", gsk), ("ofisrimmy", ofis)):
    open(f"bg_{n}.svg.part", "w").write(s)
print("ok")
