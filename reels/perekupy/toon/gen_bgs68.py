# python3 gen_bgs68.py → фоны для ep76 «Ржавчина: заселяемся» (сценка без рассказчика, по референсу 16.11, с матом):
# bg_garazhtolyana (новый тёплый гараж Толяна: плитка, стеллаж с колёсами, верстак, лампа, плакат «КРЕДИТ · осталось 47 платежей», ворота),
# bg_salontolyana (салон машины крупно: торпеда, руль, кнопка подогрева, ёлочка на зеркале, вид на гараж за стеклом),
# bg_vorotavesna (ряд гаражей весной снаружи: открытые ворота № 47, сосульки, талый снег, лужи)
import random
K = "#000"
HEAD = '  <svg id="bg" width="1080" height="1920" viewBox="0 0 1080 1920" style="position:absolute;left:0;top:0">\n'
F = 'font-family="Unbounded" font-weight="900"'
R = random.randint

random.seed(321)
gar = HEAD + f'''    <rect width="1080" height="1920" fill="#d8cfc0"/>
    {"".join(f'<path d="M0 {y} H1080" stroke="#c4b9a8" stroke-width="4"/>' for y in range(120, 1180, 90))}{"".join(f'<path d="M{x + (k % 2) * 60} {120 + k * 90} v90" stroke="#c4b9a8" stroke-width="4"/>' for k in range(12) for x in range(0, 1080, 120))}
    <!-- лампа и свет -->
    <path d="M540 0 V110" stroke="#151515" stroke-width="6"/><path d="M470 110 h140 l-30 40 h-80 z" fill="#2b2f37" stroke="{K}" stroke-width="5"/><ellipse cx="540" cy="160" rx="34" ry="14" fill="#fff6c8"/>
    <!-- плакат-пасхалка -->
    <rect x="70" y="250" width="290" height="360" fill="#f4f0e8" stroke="{K}" stroke-width="6" transform="rotate(-3 215 430)"/>
    <g transform="rotate(-3 215 430)"><text x="215" y="320" text-anchor="middle" {F} font-size="44" fill="#c0392b">КРЕДИТ</text><text x="215" y="370" text-anchor="middle" font-family="Onest" font-weight="800" font-size="26" fill="#151515">на машину</text>
    <text x="215" y="470" text-anchor="middle" {F} font-size="78" fill="#151515">47</text><text x="215" y="515" text-anchor="middle" font-family="Onest" font-weight="800" font-size="26" fill="#151515">платежей осталось</text>
    {"".join(f'<path d="M{110 + k * 36} 545 l18 30 M{128 + k * 36} 545 l-18 30" stroke="#c0392b" stroke-width="5"/>' for k in range(6))}</g>
    <!-- стеллаж с колёсами -->
    <rect x="740" y="230" width="300" height="760" fill="#5b6670" stroke="{K}" stroke-width="6"/>{"".join(f'<path d="M740 {y} h300" stroke="{K}" stroke-width="6"/>' for y in (480, 730))}
    {"".join(f'<circle cx="{820 + k * 140}" cy="{y}" r="62" fill="#1d1d1f" stroke="{K}" stroke-width="5"/><circle cx="{820 + k * 140}" cy="{y}" r="26" fill="#8a949e"/>' for k in range(2) for y in (410, 660))}
    {"".join(f'<rect x="{760 + k * 70}" y="{900 - h}" width="54" height="{h}" rx="6" fill="{c}" stroke="{K}" stroke-width="4"/>' for k, (h, c) in enumerate(((120, "#ff7a1a"), (90, "#2f6db5"), (140, "#c0392b"), (100, "#4cd964"))))}
    <!-- верстак -->
    <rect x="380" y="820" width="320" height="40" fill="#8a6a4a" stroke="{K}" stroke-width="5"/><path d="M400 860 v200 M680 860 v200" stroke="{K}" stroke-width="12"/>
    <rect x="420" y="760" width="90" height="60" fill="#c0392b" stroke="{K}" stroke-width="4"/><rect x="560" y="780" width="110" height="40" fill="#5b6670" stroke="{K}" stroke-width="4"/>
    <!-- пол -->
    <rect y="1180" width="1080" height="740" fill="#8f939a"/><path d="M0 1180 H1080" stroke="{K}" stroke-width="6"/>
    {"".join(f'<path d="M{x} 1180 L{540 + (x - 540) * 2.2} 1920" stroke="#7f838a" stroke-width="4"/>' for x in range(0, 1100, 180))}
    {"".join(f'<ellipse cx="{R(0, 1080)}" cy="{R(1260, 1880)}" rx="{R(30, 90)}" ry="{R(8, 18)}" fill="#6f737a" opacity=".5"/>' for _ in range(8))}
  </svg>
'''

random.seed(322)
salon = HEAD + f'''    <rect width="1080" height="1920" fill="#cfc6b4"/>
    <!-- за стеклом: гараж (размыто) -->
    <rect x="0" y="0" width="1080" height="900" fill="#d8cfc0"/><rect x="740" y="160" width="300" height="600" fill="#6b757e"/><rect x="70" y="200" width="250" height="300" fill="#f4f0e8"/>
    <!-- стойки и крыша -->
    <path d="M0 0 H1080 V90 Q540 140 0 90 Z" fill="#2a2b30"/><path d="M0 0 L0 1000 L120 900 L80 80 Z M1080 0 L1080 1000 L960 900 L1000 80 Z" fill="#2a2b30" stroke="{K}" stroke-width="6"/>
    <!-- зеркало и ёлочка -->
    <rect x="430" y="110" width="220" height="70" rx="20" fill="#3a3c42" stroke="{K}" stroke-width="6"/><path d="M540 180 V300" stroke="#e8e0c8" stroke-width="4"/>
    <path d="M540 300 l-60 120 h30 l-40 80 h30 l-30 70 h140 l-30 -70 h30 l-40 -80 h30 z" fill="#2f8a3a" stroke="{K}" stroke-width="5" stroke-linejoin="round"/>
    <!-- торпеда -->
    <path d="M0 900 Q540 800 1080 900 V1380 H0 Z" fill="#2b2c31" stroke="{K}" stroke-width="7"/>
    <rect x="380" y="960" width="320" height="200" rx="20" fill="#14161b" stroke="{K}" stroke-width="6"/><rect x="400" y="980" width="280" height="160" rx="12" fill="#2f6db5" opacity=".75"/>
    <text x="540" y="1075" text-anchor="middle" {F} font-size="40" fill="#fff">22°C</text>
    {"".join(f'<rect x="{410 + k * 90}" y="1200" width="70" height="50" rx="10" fill="#3a3c42" stroke="{K}" stroke-width="4"/>' for k in range(3))}
    <!-- руль -->
    <circle cx="190" cy="1260" r="230" fill="none" stroke="#1d1d1f" stroke-width="60"/><circle cx="190" cy="1260" r="80" fill="#1d1d1f" stroke="{K}" stroke-width="6"/><path d="M110 1260 h-130 M270 1260 h130" stroke="#1d1d1f" stroke-width="50"/>
    <!-- кресла -->
    <path d="M0 1380 H1080 V1920 H0 Z" fill="#3a2e28"/>{"".join(f'<path d="M{x} 1440 q120 -40 240 0 v480 h-240 z" fill="#4a3a32" stroke="{K}" stroke-width="6"/>' for x in (80, 760))}
    {"".join(f'<path d="M{x + 30} {y} h180" stroke="#5a4a40" stroke-width="5"/>' for x in (80, 760) for y in range(1520, 1900, 60))}
  </svg>
'''

random.seed(323)
vesna = HEAD + f'''    <defs><linearGradient id="vg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9fd0ec"/><stop offset="1" stop-color="#e4f2f4"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#vg)"/>
    <!-- ряд гаражей, ворота Толяна открыты -->
    <rect x="-20" y="560" width="1120" height="700" fill="#b9b2a4" stroke="{K}" stroke-width="7"/><path d="M-20 560 H1100 V500 H-20 Z" fill="#6a6a6a" stroke="{K}" stroke-width="6"/>
    {"".join(f'<path d="M{x} 560 V1260" stroke="{K}" stroke-width="6"/>' for x in (330, 750))}
    <rect x="370" y="640" width="340" height="620" fill="#3a3c42" stroke="{K}" stroke-width="7"/><rect x="390" y="660" width="300" height="600" fill="#6a5a4a"/>
    <rect x="20" y="660" width="280" height="600" fill="#2f6d5a" stroke="{K}" stroke-width="6"/><rect x="790" y="660" width="270" height="600" fill="#8a3a2a" stroke="{K}" stroke-width="6"/>
    <rect x="460" y="590" width="160" height="44" fill="#ffd23f" stroke="{K}" stroke-width="5"/><text x="540" y="622" text-anchor="middle" {F} font-size="26" fill="#151515">№ 47</text>
    <!-- сосульки и капель -->
    {"".join(f'<path d="M{x} 560 l12 {R(40, 110)} l12 -{R(40, 110)} z" fill="#dff3fb" stroke="#7ab8d8" stroke-width="3"/>' for x in range(0, 1080, 46))}
    <!-- талый снег и лужи -->
    <rect y="1260" width="1080" height="660" fill="#8a8478"/><path d="M0 1260 H1080" stroke="{K}" stroke-width="6"/>
    {"".join(f'<path d="M{x} 1260 q{R(30, 60)} -{R(20, 50)} {R(80, 160)} 0 z" fill="#f4f8fa" stroke="#b8c8d0" stroke-width="3"/>' for x in range(-40, 1080, 150))}
    {"".join(f'<ellipse cx="{R(0, 1080)}" cy="{R(1350, 1880)}" rx="{R(60, 180)}" ry="{R(14, 30)}" fill="#7ab8d8" opacity=".7"/>' for _ in range(9))}
  </svg>
'''

for n, s in (("garazhtolyana", gar), ("salontolyana", salon), ("vorotavesna", vesna)):
    open(f"bg_{n}.svg.part", "w").write(s)
print("ok")
