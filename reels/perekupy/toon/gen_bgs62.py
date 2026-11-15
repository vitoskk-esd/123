# python3 gen_bgs62.py → фоны для ep70 «Детектив: дело утопленницы» (киношный формат, без мата):
# bg_detbyuro (контора частного детектива ночью: окно с дождём и жалюзи, неоновая вывеска напротив, стол с лампой, вентилятор, шкаф с делами),
# bg_dopros (комната допроса: серая плитка, зеркало Гезелла, часы, одна лампа над столом — сама лампа реквизит),
# bg_prichaltuman (речной причал в тумане: табличка «КУПАТЬСЯ ЗАПРЕЩЕНО», камыш, мостки, вода)
import random
K = "#000"
HEAD = '  <svg id="bg" width="1080" height="1920" viewBox="0 0 1080 1920" style="position:absolute;left:0;top:0">\n'
F = 'font-family="Unbounded" font-weight="900"'
R = random.randint

random.seed(261)
byuro = HEAD + f'''    <rect width="1080" height="1920" fill="#2a2f3e"/>
    <!-- окно: ночь, дождь, неон -->
    <rect x="160" y="260" width="760" height="760" fill="#14182a" stroke="{K}" stroke-width="10"/>
    <rect x="560" y="420" width="300" height="110" rx="12" fill="#14182a" stroke="#ff4fa0" stroke-width="8"/><text x="710" y="492" text-anchor="middle" {F} font-size="40" fill="#ff4fa0">ОТЕЛЬ</text>
    {"".join(f'<rect x="{x}" y="{y}" width="40" height="60" fill="#ffd27a" opacity=".55"/>' for x, y in ((220, 700), (300, 700), (220, 800), (420, 640), (420, 760)))}
    {"".join(f'<path d="M{R(170, 910)} {R(270, 1000)} l-8 30" stroke="#a8c8f0" stroke-width="3" opacity=".7"/>' for _ in range(70))}
    {"".join(f'<rect x="160" y="{y}" width="760" height="26" fill="#c9b48a" opacity=".85"/>' for y in range(270, 600, 52))}
    <path d="M540 260 V1020 M160 640 H920" stroke="{K}" stroke-width="8"/>
    <!-- полосы света от жалюзи на стене -->
    {"".join(f'<path d="M0 {y} L1080 {y + 120}" stroke="#ffd27a" stroke-width="22" opacity=".06"/>' for y in range(1050, 1300, 60))}
    <!-- шкаф с делами -->
    <rect x="-20" y="700" width="150" height="560" fill="#5a3820" stroke="{K}" stroke-width="7"/>{"".join(f'<rect x="10" y="{y}" width="90" height="120" fill="#6b4a2a" stroke="{K}" stroke-width="5"/><rect x="40" y="{y + 50}" width="30" height="12" fill="#c9a06a"/>' for y in (740, 880, 1020))}
    <!-- вентилятор под потолком -->
    <path d="M540 0 V120" stroke="{K}" stroke-width="6"/><ellipse cx="540" cy="130" rx="200" ry="18" fill="#3a3d46" stroke="{K}" stroke-width="5"/>
    <!-- пол, стол -->
    <rect y="1300" width="1080" height="620" fill="#4a3a2e"/><path d="M0 1300 H1080" stroke="{K}" stroke-width="7"/>
    {"".join(f'<path d="M{x} 1300 L{x * 1.4 - 216} 1920" stroke="#3a2c22" stroke-width="5"/>' for x in range(0, 1100, 120))}
  </svg>
'''

random.seed(262)
dopros = HEAD + f'''    <rect width="1080" height="1920" fill="#7a8088"/>
    {"".join(f'<path d="M0 {y} H1080" stroke="#6a7078" stroke-width="4"/>' for y in range(80, 1300, 80))}{"".join(f'<path d="M{x} 0 V1300" stroke="#6a7078" stroke-width="4"/>' for x in range(0, 1080, 120))}
    <!-- зеркало Гезелла -->
    <rect x="160" y="380" width="760" height="420" fill="#2a3038" stroke="{K}" stroke-width="12"/><path d="M200 420 L360 760 M300 420 L460 760" stroke="#5b6670" stroke-width="10" opacity=".5"/>
    <!-- часы -->
    <circle cx="900" cy="230" r="70" fill="#f4f0e8" stroke="{K}" stroke-width="8"/><path d="M900 230 V180 M900 230 L935 245" stroke="{K}" stroke-width="7"/>
    <!-- дверь -->
    <rect x="-10" y="560" width="140" height="740" fill="#5b6670" stroke="{K}" stroke-width="7"/><rect x="20" y="620" width="80" height="60" fill="#a8c4d8" stroke="{K}" stroke-width="4"/>
    <!-- пол -->
    <rect y="1300" width="1080" height="620" fill="#4a4f5a"/><path d="M0 1300 H1080" stroke="{K}" stroke-width="7"/>
    <ellipse cx="540" cy="1560" rx="460" ry="120" fill="#fff6d0" opacity=".14"/>
  </svg>
'''

random.seed(263)
prichal = HEAD + f'''    <defs><linearGradient id="pr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9aa8b4"/><stop offset="1" stop-color="#d4dce2"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#pr)"/>
    <!-- дальний берег -->
    <path d="M0 980 Q200 900 420 950 T860 930 T1080 960 V1040 H0 Z" fill="#6a7a6a" opacity=".8"/>
    <!-- вода -->
    <rect y="1020" width="1080" height="900" fill="#5a7a8a"/>
    {"".join(f'<path d="M{R(0, 1000)} {R(1060, 1880)} q30 -10 60 0 t60 0" stroke="#cfe0ea" stroke-width="4" fill="none" opacity=".6"/>' for _ in range(40))}
    <!-- мостки -->
    <path d="M620 1200 L1100 1120 V1240 L620 1300 Z" fill="#8a6a4a" stroke="{K}" stroke-width="6"/>{"".join(f'<path d="M{x} {1300 - (x - 620) * .17} V{1500 - (x - 620) * .17}" stroke="#5a4030" stroke-width="16"/>' for x in (660, 820, 980))}
    <!-- камыш -->
    {"".join(f'<path d="M{x} 1500 q{R(-20, 20)} -180 {R(-30, 30)} -{R(240, 360)}" stroke="#4a6a3a" stroke-width="8" fill="none"/><ellipse cx="{x}" cy="{1500 - R(250, 330)}" rx="10" ry="34" fill="#6b4a2a"/>' for x in (30, 70, 110, 960, 1010))}
    <!-- табличка -->
    <path d="M220 1500 V1080" stroke="#5a4030" stroke-width="16"/><rect x="60" y="960" width="330" height="150" fill="#f4f0e8" stroke="{K}" stroke-width="6"/>
    <text x="225" y="1022" text-anchor="middle" {F} font-size="30" fill="#c0392b">КУПАТЬСЯ</text><text x="225" y="1068" text-anchor="middle" {F} font-size="30" fill="#c0392b">ЗАПРЕЩЕНО</text>
    <!-- туман -->
    {"".join(f'<ellipse cx="{R(0, 1080)}" cy="{R(900, 1300)}" rx="{R(250, 420)}" ry="{R(40, 70)}" fill="#eef2f4" opacity=".35"/>' for _ in range(7))}
  </svg>
'''

for n, s in (("detbyuro", byuro), ("dopros", dopros), ("prichaltuman", prichal)):
    open(f"bg_{n}.svg.part", "w").write(s)
print("ok")
