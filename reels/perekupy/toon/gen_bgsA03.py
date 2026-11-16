# python3 gen_bgsA03.py → фоны для «Арбитражников» ep03 «Никита: ролик → 12 заявок» (новая тема: клиенты из коротких видео)
# bg_domstudiya (комната Никиты как домашняя студия: кольцевая лампа, штатив, гирлянда, полка, тёплый вечер),
# bg_metrovagon (вагон метро изнутри: сиденья, поручни, окна-тоннель, схема линий),
# bg_eskalator (эскалатор метро: наклонные ступени, лампы-светильники, силуэты людей с телефонами)
import random
K = "#000"
HEAD = '  <svg id="bg" width="1080" height="1920" viewBox="0 0 1080 1920" style="position:absolute;left:0;top:0">\n'
F = 'font-family="Unbounded" font-weight="900"'
R = random.randint

random.seed(611)
dom = HEAD + f'''    <rect width="1080" height="1920" fill="#3a2a3e"/>
    <!-- обои в полоску -->
    {"".join(f'<rect x="{x}" y="0" width="45" height="1200" fill="#43304a"/>' for x in range(0, 1080, 90))}
    <!-- окно с вечерним небом -->
    <rect x="620" y="220" width="380" height="460" rx="12" fill="#ff9a6a" stroke="{K}" stroke-width="10"/>
    <rect x="620" y="220" width="380" height="230" rx="12" fill="#7a5ab8"/><circle cx="900" cy="420" r="50" fill="#ffd27a"/>
    <path d="M810 220 V680 M620 450 H1000" stroke="{K}" stroke-width="10"/>
    <!-- полка с вещами -->
    <path d="M60 520 H420" stroke="#8a5a33" stroke-width="18"/>
    {"".join(f'<rect x="{x}" y="{520 - h}" width="{w}" height="{h}" rx="6" fill="{c}" stroke="{K}" stroke-width="5"/>' for x, w, h, c in ((80, 40, 90, "#2f6db5"), (126, 36, 70, "#ffd23f"), (168, 44, 100, "#e0302a"), (250, 90, 60, "#2f8f3a"), (360, 46, 80, "#fbfaf3")))}
    <!-- гирлянда -->
    <path d="M0 140 Q540 250 1080 140" fill="none" stroke="#151515" stroke-width="4"/>
    {"".join(f'<circle cx="{x}" cy="{140 + 440 * (x / 1080) * (1 - x / 1080) * .9}" r="12" fill="{("#ffd36a", "#ff6fae", "#7affdd")[i % 3]}" stroke="{K}" stroke-width="3"/>' for i, x in enumerate(range(40, 1080, 75)))}
    <!-- кольцевая лампа на штативе (слева) -->
    <circle cx="200" cy="820" r="130" fill="none" stroke="#151515" stroke-width="40"/><circle cx="200" cy="820" r="130" fill="none" stroke="#fffbe0" stroke-width="26"/>
    <path d="M200 950 V1500 M200 1500 L120 1640 M200 1500 L280 1640 M200 1500 V1650" stroke="#2b2f37" stroke-width="16" stroke-linecap="round"/>
    <!-- пол, ковёр -->
    <rect y="1220" width="1080" height="700" fill="#5a3e3a"/><path d="M0 1220 H1080" stroke="{K}" stroke-width="7"/>
    <rect x="260" y="1500" width="620" height="260" rx="40" fill="#7a3a6a" stroke="{K}" stroke-width="7"/><rect x="300" y="1530" width="540" height="200" rx="30" fill="none" stroke="#9a5a8a" stroke-width="8"/>
  </svg>
'''

random.seed(612)
vag = HEAD + f'''    <rect width="1080" height="1920" fill="#c9d3dc"/>
    <!-- окна: тёмный тоннель с полосами света -->
    {"".join(f'<rect x="{x}" y="420" width="300" height="360" rx="30" fill="#1b2230" stroke="{K}" stroke-width="9"/>' + "".join(f'<path d="M{x + 20} {460 + j * 90} H{x + 280}" stroke="#ffd27a" stroke-width="6" opacity=".35"/>' for j in range(4)) for x in (40, 390, 740))}
    <!-- схема линий над окнами -->
    <rect x="120" y="230" width="840" height="130" rx="14" fill="#fbfaf3" stroke="{K}" stroke-width="7"/>
    {"".join(f'<path d="M160 {y} H920" stroke="{c}" stroke-width="12" stroke-linecap="round"/>' for y, c in ((265, "#e0302a"), (295, "#2f8f3a"), (325, "#2f6db5")))}
    {"".join(f'<circle cx="{x}" cy="{y}" r="11" fill="#fbfaf3" stroke="{K}" stroke-width="5"/>' for x in range(200, 920, 120) for y in (265, 295, 325))}
    <!-- поручни -->
    <path d="M0 160 H1080" stroke="#9aa3ab" stroke-width="16"/><path d="M0 160 H1080" stroke="#d8dde2" stroke-width="6"/>
    {"".join(f'<path d="M{x} 160 V1240" stroke="#9aa3ab" stroke-width="18"/><path d="M{x} 160 V1240" stroke="#e8ecef" stroke-width="6"/>' for x in (360, 720))}
    <!-- сиденья -->
    <rect y="1060" width="1080" height="70" fill="#2f6db5" stroke="{K}" stroke-width="7"/><rect y="1130" width="1080" height="120" fill="#1f4fb8" stroke="{K}" stroke-width="7"/>
    {"".join(f'<path d="M{x} 1060 V1250" stroke="#163d8a" stroke-width="6"/>' for x in range(120, 1080, 180))}
    <!-- пол -->
    <rect y="1250" width="1080" height="670" fill="#8a8e94"/><path d="M0 1250 H1080" stroke="{K}" stroke-width="7"/>
    {"".join(f'<circle cx="{x}" cy="{y}" r="5" fill="#6a6e74"/>' for x in range(30, 1080, 70) for y in range(1290, 1920, 70))}
  </svg>
'''

random.seed(613)
esk = HEAD + f'''    <defs><linearGradient id="ek" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a3550"/><stop offset="1" stop-color="#5a6a8a"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#ek)"/>
    <!-- свод с лампами -->
    {"".join(f'<g transform="translate({540 + (k - 3) * 30} {120 + k * 150})"><rect x="-120" y="0" width="240" height="22" rx="11" fill="#fff6c8"/><rect x="-140" y="-10" width="280" height="42" rx="20" fill="none" stroke="#c8b070" stroke-width="5"/></g>' for k in range(7))}
    <!-- три полотна эскалатора по диагонали -->
    {"".join(f'<path d="M{x} 1920 L{x + 520} 0 L{x + 760} 0 L{x + 240} 1920 Z" fill="{c}" stroke="{K}" stroke-width="7"/>' for x, c in ((-520, "#3a3f4a"), (-160, "#454b58"), (200, "#3a3f4a")))}
    {"".join(f'<path d="M{-520 + i * 360 + y * 0.27} {1920 - y} h240" stroke="#2a2e36" stroke-width="5"/>' for i in range(3) for y in range(0, 1920, 60))}
    <!-- поручни-балюстрады -->
    {"".join(f'<path d="M{x} 1920 L{x + 520} 0" stroke="#151515" stroke-width="30"/><path d="M{x} 1920 L{x + 520} 0" stroke="#c8a050" stroke-width="12"/>' for x in (-160, 200, 560))}
    <!-- силуэты людей с телефонами (свет экрана) -->
    {"".join(f'<g transform="translate({x} {y})"><circle cx="0" cy="-90" r="34" fill="#232838"/><rect x="-40" y="-56" width="80" height="140" rx="30" fill="#232838"/><rect x="18" y="-60" width="22" height="36" rx="5" fill="#9fd6ff"/><circle cx="30" cy="-42" r="40" fill="#9fd6ff" opacity=".18"/></g>' for x, y in ((180, 520), (560, 340), (760, 900), (330, 1150), (980, 610)))}
  </svg>
'''

for n, s in (("domstudiya", dom), ("metrovagon", vag), ("eskalator", esk)):
    open(f"bg_{n}.svg.part", "w").write(s)
print("ok")
