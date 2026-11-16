# python3 gen_bgsA01.py → фоны для «Арбитражников» ep01 «Инфоцыган: курс за 150 000» (новая тема: арбитраж трафика на банки)
# bg_arbkomnata (комната Стаса ночью: стол, ноутбук светится, плакаты, кровать, окно в ночной город, гирлянда),
# bg_gelikarenda (ночная улица у проката «АРЕНДА АВТО»: неоновая вывеска, стеклянная витрина, мокрый асфальт с отражениями),
# bg_babkadvor (деревенский двор днём: изба с резными наличниками, забор, лавочка, подсолнухи, куры)
import random
K = "#000"
HEAD = '  <svg id="bg" width="1080" height="1920" viewBox="0 0 1080 1920" style="position:absolute;left:0;top:0">\n'
F = 'font-family="Unbounded" font-weight="900"'
R = random.randint

random.seed(401)
room = HEAD + f'''    <rect width="1080" height="1920" fill="#2a2440"/>
    <!-- обои с ромбами -->
    {"".join(f'<path d="M{x} {y} l30 40 l-30 40 l-30 -40 z" fill="none" stroke="#3a3256" stroke-width="4"/>' for x in range(0, 1100, 120) for y in range(0, 1200, 160))}
    <!-- окно: ночной город -->
    <rect x="600" y="260" width="400" height="520" rx="10" fill="#0d1430" stroke="{K}" stroke-width="10"/>
    {"".join(f'<rect x="{x}" y="{y}" width="{w}" height="{780 - y}" fill="#141c3c"/>' + "".join(f'<rect x="{x + 10 + i * 26}" y="{y + 14 + j * 34}" width="12" height="16" fill="{"#ffd36a" if R(0, 3) else "#2a3352"}"/>' for i in range(max(1, (w - 14) // 26)) for j in range((780 - y - 20) // 34)) for x, y, w in ((610, 470, 110), (730, 400, 130), (870, 520, 120)))}
    <path d="M800 260 V780 M600 520 H1000" stroke="{K}" stroke-width="10"/>
    <rect x="590" y="780" width="420" height="30" fill="#5a4a7a" stroke="{K}" stroke-width="7"/>
    <!-- плакаты -->
    <rect x="70" y="250" width="230" height="320" fill="#ff7a1a" stroke="{K}" stroke-width="7" transform="rotate(-4 185 410)"/>
    <text x="185" y="390" text-anchor="middle" {F} font-size="40" fill="#151515" transform="rotate(-4 185 410)">CPA</text>
    <text x="185" y="450" text-anchor="middle" {F} font-size="26" fill="#151515" transform="rotate(-4 185 410)">≠ ЛАМБА</text>
    <rect x="330" y="300" width="200" height="200" fill="#4cd964" stroke="{K}" stroke-width="7" transform="rotate(5 430 400)"/>
    <path d="M370 430 l40 -50 l30 30 l50 -70" fill="none" stroke="#151515" stroke-width="12" stroke-linecap="round" transform="rotate(5 430 400)"/>
    <!-- гирлянда -->
    <path d="M0 150 Q540 260 1080 150" fill="none" stroke="#151515" stroke-width="4"/>
    {"".join(f'<circle cx="{x}" cy="{150 + 110 * 4 * (x / 1080) * (1 - x / 1080) * 0.9}" r="12" fill="{("#ffd36a", "#ff6fae", "#5ac8fa")[i % 3]}" stroke="{K}" stroke-width="3"/>' for i, x in enumerate(range(40, 1080, 80)))}
    <!-- кровать слева, стол справа -->
    <rect y="1180" width="1080" height="740" fill="#3a2f4e"/><path d="M0 1180 H1080" stroke="{K}" stroke-width="7"/>
    <rect x="-20" y="1000" width="420" height="260" rx="20" fill="#5a6abf" stroke="{K}" stroke-width="8"/><rect x="10" y="960" width="160" height="80" rx="30" fill="#e8e4f0" stroke="{K}" stroke-width="7"/>
    <rect x="560" y="1060" width="500" height="40" fill="#8a5a33" stroke="{K}" stroke-width="8"/><path d="M590 1100 V1300 M1030 1100 V1300" stroke="{K}" stroke-width="16"/>
    <!-- кружка и энергетик на столе -->
    <rect x="980" y="1000" width="44" height="60" rx="8" fill="#ffd23f" stroke="{K}" stroke-width="6"/><rect x="600" y="1010" width="50" height="50" rx="8" fill="#e8e4f0" stroke="{K}" stroke-width="6"/>
    <!-- ковёр -->
    <ellipse cx="540" cy="1600" rx="460" ry="150" fill="#4a3a66" stroke="{K}" stroke-width="7"/><ellipse cx="540" cy="1600" rx="330" ry="100" fill="none" stroke="#6a5a8a" stroke-width="10"/>
  </svg>
'''

random.seed(402)
rent = HEAD + f'''    <defs><linearGradient id="rn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a0d1e"/><stop offset="1" stop-color="#1c1430"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#rn)"/>
    <!-- небоскрёбы вдали -->
    {"".join(f'<rect x="{x}" y="{y}" width="{w}" height="{1000 - y}" fill="#141a32"/>' + "".join(f'<rect x="{x + 8 + i * 22}" y="{y + 12 + j * 30}" width="10" height="14" fill="#2c3a6a"/>' for i in range(max(1, (w - 10) // 22)) for j in range((1000 - y - 20) // 30) if R(0, 2)) for x, y, w in ((-20, 300, 160), (150, 180, 120), (290, 360, 140), (760, 220, 150), (920, 330, 180)))}
    <!-- витрина проката -->
    <rect x="80" y="560" width="920" height="620" fill="#10131f" stroke="{K}" stroke-width="10"/>
    <rect x="110" y="700" width="860" height="460" fill="#1b2a3a" stroke="#2f4a62" stroke-width="6"/>
    <path d="M540 700 V1160" stroke="#2f4a62" stroke-width="6"/>
    <rect x="160" y="590" width="760" height="90" rx="16" fill="#120c24" stroke="#ff4fd8" stroke-width="8"/>
    <text x="540" y="655" text-anchor="middle" {F} font-size="58" fill="#ff8af0">АРЕНДА АВТО</text>
    <rect x="700" y="760" width="230" height="110" rx="12" fill="#fbfaf3" stroke="{K}" stroke-width="6"/>
    <text x="815" y="808" text-anchor="middle" {F} font-size="28" fill="#151515">ПОЧАСОВО</text><text x="815" y="850" text-anchor="middle" {F} font-size="26" fill="#c0392b">от 5 000 ₽/ч</text>
    <!-- асфальт с отражениями -->
    <rect y="1180" width="1080" height="740" fill="#15131f"/><path d="M0 1180 H1080" stroke="{K}" stroke-width="7"/>
    <rect x="160" y="1200" width="760" height="70" fill="#ff4fd8" opacity=".14"/>
    {"".join(f'<rect x="{R(0, 1000)}" y="{R(1260, 1880)}" width="{R(80, 220)}" height="6" rx="3" fill="#ff8af0" opacity=".25"/>' for _ in range(18))}
    {"".join(f'<rect x="{x}" y="1560" width="120" height="14" fill="#cfc6e0" opacity=".5"/>' for x in range(-40, 1080, 220))}
  </svg>
'''

random.seed(403)
dvor = HEAD + f'''    <defs><linearGradient id="dv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7cc7f0"/><stop offset="1" stop-color="#e4f5fb"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#dv)"/>
    <circle cx="880" cy="230" r="80" fill="#ffe27a"/>
    <!-- изба -->
    <path d="M140 640 L420 380 L700 640 Z" fill="#7a3a24" stroke="{K}" stroke-width="9" stroke-linejoin="round"/>
    <rect x="170" y="640" width="500" height="520" fill="#a8683a" stroke="{K}" stroke-width="9"/>
    {"".join(f'<path d="M170 {y} H670" stroke="#7a4a24" stroke-width="5"/>' for y in range(690, 1160, 50))}
    <rect x="250" y="760" width="150" height="180" fill="#9fd6ff" stroke="{K}" stroke-width="8"/><path d="M325 760 V940 M250 850 H400" stroke="{K}" stroke-width="6"/>
    <path d="M230 760 q95 -50 190 0 l-10 -20 q-85 -40 -170 0 z M230 944 h190" fill="#fbfaf3" stroke="{K}" stroke-width="6"/>
    <rect x="470" y="800" width="130" height="360" fill="#5a3218" stroke="{K}" stroke-width="8"/><circle cx="580" cy="990" r="8" fill="#f5c542"/>
    <!-- антенна -->
    <path d="M520 470 V330 M480 360 H560 M490 390 H550" stroke="{K}" stroke-width="6"/>
    <!-- забор -->
    {"".join(f'<path d="M{x} 1260 V1010 l25 -30 l25 30 V1260 z" fill="#c9a26a" stroke="{K}" stroke-width="6"/>' for x in range(680, 1080, 60))}
    <!-- подсолнухи -->
    {"".join(f'<path d="M{x} 1260 V{y}" stroke="#2f7a2f" stroke-width="10"/><circle cx="{x}" cy="{y}" r="44" fill="#ffd23f" stroke="{K}" stroke-width="6"/><circle cx="{x}" cy="{y}" r="20" fill="#6a3a14"/>' for x, y in ((730, 860), (840, 820), (950, 880)))}
    <!-- земля, тропинка, куры -->
    <rect y="1180" width="1080" height="740" fill="#8bbf5a"/><path d="M0 1180 H1080" stroke="{K}" stroke-width="7"/>
    <path d="M440 1180 Q520 1500 380 1920 H760 Q640 1500 600 1180 Z" fill="#d9b884"/>
    {"".join(f'<g transform="translate({x} {y})"><ellipse cx="0" cy="0" rx="34" ry="26" fill="#fbfaf3" stroke="{K}" stroke-width="5"/><circle cx="28" cy="-24" r="14" fill="#fbfaf3" stroke="{K}" stroke-width="5"/><path d="M28 -40 l6 -10 l6 10 z" fill="#e0302a"/><path d="M42 -24 l12 4 l-12 4 z" fill="#ffb03a"/></g>' for x, y in ((180, 1700), (880, 1640), (960, 1780)))}
  </svg>
'''

for n, s in (("arbkomnata", room), ("gelikarenda", rent), ("babkadvor", dvor)):
    open(f"bg_{n}.svg.part", "w").write(s)
print("ok")
