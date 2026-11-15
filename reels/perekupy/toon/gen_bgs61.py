# python3 gen_bgs61.py → фоны для ep69 «Свадьба: тесть-полковник» (киношный формат):
# bg_dvorbraka (Дворец бракосочетаний летом: розово-кремовый фасад, колонны, золотые кольца, красная дорожка, арка из шаров),
# bg_kortezh (проспект: третий светофор, разметка, пробка сзади, гудки, рекламный щит «СВАДЕБНЫЙ САЛОН»),
# bg_godovshina (банкетный зал: люстры, столы в белых скатертях, баннер «1 ГОД ВМЕСТЕ», шары)
import random
K = "#000"
HEAD = '  <svg id="bg" width="1080" height="1920" viewBox="0 0 1080 1920" style="position:absolute;left:0;top:0">\n'
F = 'font-family="Unbounded" font-weight="900"'
R = random.randint

random.seed(251)
dvor = HEAD + f'''    <defs><linearGradient id="db" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8ccdf2"/><stop offset="1" stop-color="#e6f4fb"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#db)"/>
    <rect x="40" y="380" width="1000" height="780" fill="#f6e3dc" stroke="{K}" stroke-width="7"/>
    <path d="M20 380 L540 220 L1060 380 Z" fill="#f0d2c8" stroke="{K}" stroke-width="7"/>
    <circle cx="500" cy="320" r="34" fill="none" stroke="#e6b84a" stroke-width="12"/><circle cx="560" cy="320" r="34" fill="none" stroke="#e6b84a" stroke-width="12"/>
    <rect x="250" y="420" width="580" height="80" rx="10" fill="#fff" stroke="{K}" stroke-width="5"/><text x="540" y="474" text-anchor="middle" {F} font-size="30" fill="#b03a5a">ДВОРЕЦ БРАКОСОЧЕТАНИЯ</text>
    {"".join(f'<rect x="{x}" y="520" width="60" height="640" fill="#fff8f4" stroke="#c9a8a0" stroke-width="5"/>' for x in (110, 280, 740, 910))}
    <rect x="420" y="640" width="240" height="520" rx="110" fill="#8a5a3a" stroke="{K}" stroke-width="7"/><path d="M540 650 V1160" stroke="{K}" stroke-width="5"/>
    <!-- арка из шаров -->
    {"".join(f'<circle cx="{540 + 300 * __import__("math").cos(a / 18 * 3.1416)}" cy="{1160 - 420 * __import__("math").sin(a / 18 * 3.1416)}" r="34" fill="{("#ff8fb1", "#fff", "#ffd23f")[a % 3]}" stroke="{K}" stroke-width="4"/>' for a in range(0, 19))}
    <!-- ступени и дорожка -->
    {"".join(f'<rect x="{120 - k * 30}" y="{1160 + k * 32}" width="{840 + k * 60}" height="32" fill="#e8dcd4" stroke="#b9a89e" stroke-width="4"/>' for k in range(4))}
    <path d="M440 1160 H640 L760 1920 H320 Z" fill="#c0392b" stroke="{K}" stroke-width="6"/>
    <rect y="1288" width="1080" height="632" fill="#cfc8bc"/><path d="M440 1288 H640 L760 1920 H320 Z" fill="#c0392b"/><path d="M0 1288 H1080" stroke="{K}" stroke-width="6"/>
    {"".join(f'<circle cx="{R(0, 1080)}" cy="{R(1300, 1900)}" r="{R(5, 9)}" fill="{("#ff8fb1", "#fff", "#ffd23f")[R(0, 2)]}"/>' for _ in range(40))}
  </svg>
'''

random.seed(252)
kort = HEAD + f'''    <defs><linearGradient id="kz" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9fd0f0"/><stop offset="1" stop-color="#eef6fb"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#kz)"/>
    <!-- дома -->
    {"".join(f'<rect x="{x}" y="{y}" width="{w}" height="{1160 - y}" fill="{c}" stroke="{K}" stroke-width="6"/>' + "".join(f'<rect x="{x + 24 + i * 60}" y="{y + 30 + j * 74}" width="36" height="46" fill="#bcd4e4" stroke="{K}" stroke-width="3"/>' for i in range((w - 40) // 60) for j in range((1100 - y) // 74)) for x, y, w, c in ((-30, 420, 330, "#e8d8b8"), (320, 520, 300, "#d8c8d8"), (650, 380, 460, "#c8d8c8")))}
    <!-- щит -->
    <rect x="360" y="620" width="380" height="150" fill="#fff" stroke="{K}" stroke-width="6"/><text x="550" y="690" text-anchor="middle" {F} font-size="30" fill="#b03a5a">СВАДЕБНЫЙ</text><text x="550" y="738" text-anchor="middle" {F} font-size="30" fill="#b03a5a">САЛОН «ЛЕБЕДЬ»</text>
    <!-- светофор -->
    <path d="M90 1300 V700" stroke="#2b2f37" stroke-width="16"/><rect x="50" y="600" width="80" height="220" rx="16" fill="#2b2f37" stroke="{K}" stroke-width="6"/>{"".join(f'<circle cx="90" cy="{y}" r="26" fill="{c}"/>' for y, c in ((642, "#5a1a1a"), (710, "#5a4a1a"), (778, "#4cd964")))}
    <circle cx="90" cy="778" r="60" fill="#4cd964" opacity=".25"/>
    <!-- дорога, разметка, пробка вдали -->
    <rect y="1160" width="1080" height="120" fill="#b8b4ac"/><path d="M0 1160 H1080" stroke="{K}" stroke-width="6"/>
    <rect y="1280" width="1080" height="640" fill="#5f6066"/><path d="M0 1280 H1080" stroke="{K}" stroke-width="7"/>
    {"".join(f'<rect x="{x}" y="1560" width="110" height="16" fill="#f4f0e8"/>' for x in range(-40, 1080, 200))}
    {"".join(f'<path d="M{x} 1330 q14 -36 54 -40 h70 q34 4 50 40 h20 v34 h-214 v-34 z" fill="{c}" stroke="{K}" stroke-width="4" opacity=".85"/>' for x, c in ((620, "#2f6db5"), (840, "#c0392b"), (1000, "#ffd23f")))}
  </svg>
'''

random.seed(253)
god = HEAD + f'''    <rect width="1080" height="1920" fill="#f3e6d4"/>
    <rect width="1080" height="160" fill="#c9a06a"/>
    {"".join(f'<path d="M{x} 0 V120" stroke="#8a6a3a" stroke-width="5"/><path d="M{x - 80} 120 h160 l-30 70 h-100 z" fill="#ffe6a8" stroke="#8a6a3a" stroke-width="5"/>{"".join(f"<circle cx=\"{x - 60 + i * 30}\" cy=\"{200 + (i % 2) * 14}\" r=\"8\" fill=\"#fff6d0\"/>" for i in range(5))}' for x in (220, 860))}
    <rect x="200" y="320" width="680" height="130" rx="16" fill="#fff" stroke="#c9a06a" stroke-width="8"/><text x="540" y="410" text-anchor="middle" {F} font-size="58" fill="#b03a5a">1 ГОД ВМЕСТЕ</text>
    {"".join(f'<path d="M{x} 520 q-10 80 6 180" stroke="#8a8a8a" stroke-width="3" fill="none"/><ellipse cx="{x}" cy="490" rx="40" ry="50" fill="{c}" stroke="{K}" stroke-width="4"/>' for x, c in ((120, "#ff8fb1"), (190, "#fff"), (890, "#ffd23f"), (960, "#ff8fb1")))}
    <!-- окна с портьерами -->
    {"".join(f'<rect x="{x}" y="560" width="200" height="420" fill="#a8cfe8" stroke="{K}" stroke-width="6"/><path d="M{x} 560 q50 200 10 420 h-30 v-420 z M{x + 200} 560 q-50 200 -10 420 h30 v-420 z" fill="#b03a5a" stroke="{K}" stroke-width="4"/>' for x in (260, 620))}
    <!-- столы -->
    <rect y="1150" width="1080" height="770" fill="#c9a88a"/><path d="M0 1150 H1080" stroke="{K}" stroke-width="7"/>
    {"".join(f'<path d="M{x} 1080 h300 l30 170 h-360 z" fill="#fff" stroke="{K}" stroke-width="6"/><path d="M{x + 40} 1060 q10 -40 20 0 M{x + 230} 1060 q10 -40 20 0" stroke="{K}" stroke-width="5" fill="#ffd27a"/><rect x="{x + 120}" y="1030" width="60" height="50" fill="#ff8fb1" stroke="{K}" stroke-width="4"/>' for x in (-60, 820))}
  </svg>
'''

for n, s in (("dvorbraka", dvor), ("kortezh", kort), ("godovshina", god)):
    open(f"bg_{n}.svg.part", "w").write(s)
print("ok")
