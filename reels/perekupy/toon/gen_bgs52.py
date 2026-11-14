# python3 gen_bgs52.py → фоны для ep60 «Школа перекупов» (киношный формат):
# bg_klass (класс: зелёная доска во всю стену, парты рядами, портреты на стене, окно с жалюзи, часы, глобус),
# bg_shkolnyidvor (двор автошколы-«курсов»: кирпичное здание с вывеской «КУРСЫ ПЕРЕКУПА», турник, стоянка с разметкой, клёны),
# bg_uchitelskaya2 (кабинет Михалыча: стопки газет, дисковый телефон на тумбе, доска объявлений с вырезками, календарь 1998, лампа)
import random
K = "#000"
HEAD = '  <svg id="bg" width="1080" height="1920" viewBox="0 0 1080 1920" style="position:absolute;left:0;top:0">\n'
F = 'font-family="Unbounded" font-weight="900"'
R = random.randint

random.seed(161)
klass = HEAD + f'''    <rect width="1080" height="1920" fill="#d8c9a0"/>
    <rect y="0" width="1080" height="120" fill="#efe6cc"/><path d="M0 120 H1080" stroke="{K}" stroke-width="5"/>
    <!-- портреты -->
    {"".join(f'<rect x="{x}" y="150" width="110" height="140" fill="#fbf6ec" stroke="#6b4423" stroke-width="10"/><circle cx="{x + 55}" cy="205" r="30" fill="#b9a68a"/><path d="M{x + 18} 285 q37 -50 74 0" fill="#7a6a55"/>' for x in (120, 470, 850))}
    <!-- часы -->
    <circle cx="350" cy="220" r="56" fill="#fbf6ec" stroke="{K}" stroke-width="7"/><path d="M350 220 V180 M350 220 L380 236" stroke="{K}" stroke-width="7" stroke-linecap="round"/>
    <!-- доска -->
    <rect x="40" y="330" width="1000" height="560" rx="10" fill="#6b4423" stroke="{K}" stroke-width="7"/>
    <rect x="62" y="352" width="956" height="516" fill="#2f5a3e"/>
    {"".join(f'<path d="M{R(80, 900)} {R(370, 840)} q{R(30, 90)} {R(-20, 20)} {R(80, 160)} {R(-10, 10)}" stroke="#d7e4da" stroke-width="{R(2, 5)}" opacity=".12" fill="none"/>' for _ in range(16))}
    <rect x="62" y="868" width="956" height="22" fill="#8a5a33" stroke="{K}" stroke-width="4"/>
    <rect x="160" y="856" width="40" height="14" rx="4" fill="#fbf6ec"/><rect x="760" y="852" width="90" height="20" rx="4" fill="#c9b48a" stroke="{K}" stroke-width="3"/>
    <!-- окно с жалюзи -->
    <rect x="-20" y="930" width="160" height="300" fill="#9fd6ff" stroke="{K}" stroke-width="6"/>
    {"".join(f'<path d="M-20 {y} H140" stroke="#efe6cc" stroke-width="12"/>' for y in range(950, 1230, 34))}
    <!-- глобус на шкафу -->
    <rect x="920" y="1000" width="160" height="240" fill="#8a5a33" stroke="{K}" stroke-width="6"/>
    <circle cx="990" cy="950" r="46" fill="#4aa0d8" stroke="{K}" stroke-width="6"/><path d="M968 930 q20 10 10 30 q24 10 30 -10" fill="#6abf69" stroke="{K}" stroke-width="3"/><path d="M990 996 v8 M960 1004 h60" stroke="{K}" stroke-width="7"/>
    <!-- пол-линолеум -->
    <rect y="1240" width="1080" height="680" fill="#a8743f"/><path d="M0 1240 H1080" stroke="{K}" stroke-width="7"/>
    {"".join(f'<path d="M0 {y} H1080" stroke="#946433" stroke-width="3"/>' for y in range(1310, 1920, 80))}
  </svg>
'''

random.seed(162)
dvor = HEAD + f'''    <defs><linearGradient id="dv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8ccdf2"/><stop offset="1" stop-color="#d7eefa"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#dv)"/>
    {"".join(f'<ellipse cx="{x}" cy="{y}" rx="{R(90, 150)}" ry="{R(26, 40)}" fill="#fff" opacity=".85"/>' for x, y in ((180, 170), (760, 120), (980, 260)))}
    <!-- кирпичное здание -->
    <rect x="80" y="380" width="920" height="820" fill="#b2533a" stroke="{K}" stroke-width="7"/>
    {"".join(f'<path d="M80 {y} H1000" stroke="#9a4430" stroke-width="3"/>' for y in range(410, 1200, 30))}
    {"".join(f'<rect x="{x}" y="{y}" width="150" height="190" fill="#bfe3f6" stroke="#fbf6ec" stroke-width="12"/><path d="M{x + 75} {y} V{y + 190}" stroke="#fbf6ec" stroke-width="8"/>' for x in (150, 465, 780) for y in (600,))}
    <rect x="430" y="880" width="220" height="320" fill="#5a3820" stroke="{K}" stroke-width="7"/><path d="M540 880 V1200" stroke="{K}" stroke-width="5"/>
    <rect x="170" y="430" width="740" height="120" rx="14" fill="#fbf6ec" stroke="{K}" stroke-width="7"/>
    <text x="540" y="512" text-anchor="middle" {F} font-size="58" fill="#c0392b">КУРСЫ ПЕРЕКУПА</text>
    <!-- клёны -->
    {"".join(f'<path d="M{x} 1240 V880" stroke="#5a3820" stroke-width="26"/><circle cx="{x}" cy="820" r="130" fill="#e08a2a" stroke="{K}" stroke-width="6"/><circle cx="{x + s * 70}" cy="740" r="90" fill="#f0a838" stroke="{K}" stroke-width="6"/>' for x, s in ((40, 1), (1040, -1)))}
    <!-- турник -->
    <path d="M760 1240 V1080 M900 1240 V1080 M750 1084 H910" stroke="#3a6a9a" stroke-width="14" stroke-linecap="round"/>
    <!-- асфальт со стоянкой -->
    <rect y="1220" width="1080" height="700" fill="#7d8088"/><path d="M0 1220 H1080" stroke="{K}" stroke-width="7"/>
    {"".join(f'<path d="M{x} 1260 L{x - 120} 1920" stroke="#f4f6f8" stroke-width="10" opacity=".75"/>' for x in (120, 560, 1000))}
    {"".join(f'<path d="M{R(60, 1020)} {R(1280, 1880)} l{R(-14, 14)} {R(6, 14)}" stroke="#e08a2a" stroke-width="10" stroke-linecap="round"/>' for _ in range(14))}
  </svg>
'''

random.seed(163)
uch = HEAD + f'''    <rect width="1080" height="1920" fill="#7a8a6a"/>
    {"".join(f'<path d="M{x} 0 V1240" stroke="#6e7e60" stroke-width="18"/>' for x in range(30, 1080, 70))}
    <!-- доска объявлений с газетными вырезками -->
    <rect x="300" y="200" width="560" height="460" fill="#c9a06a" stroke="#6b4423" stroke-width="12"/>
    {"".join(f'<g transform="rotate({R(-6, 6)} {x + 70} {y + 50})"><rect x="{x}" y="{y}" width="140" height="100" fill="#efe6cc" stroke="{K}" stroke-width="3"/>' + "".join(f'<path d="M{x + 12} {y + 18 + k * 16} h{R(70, 116)}" stroke="#7a7466" stroke-width="5"/>' for k in range(5)) + f'<circle cx="{x + 70}" cy="{y + 6}" r="7" fill="#c0392b"/></g>' for x, y in ((330, 230), (510, 240), (690, 225), (340, 400), (520, 420), (700, 390)))}
    <path d="M520 450 l100 40 M380 300 l120 120" stroke="#c0392b" stroke-width="6" opacity=".7"/>
    <!-- календарь 1998 -->
    <rect x="90" y="240" width="160" height="220" fill="#fbf6ec" stroke="{K}" stroke-width="6"/><rect x="90" y="240" width="160" height="60" fill="#c0392b"/>
    <text x="170" y="285" text-anchor="middle" {F} font-size="34" fill="#fff">1998</text>
    {"".join(f'<rect x="{104 + i * 28}" y="{316 + j * 28}" width="20" height="18" fill="#d8cfbf"/>' for i in range(5) for j in range(5))}
    <!-- лампа под абажуром -->
    <path d="M540 0 V120" stroke="#2b2f37" stroke-width="6"/><path d="M470 120 h140 l40 70 h-220 z" fill="#2f6a3a" stroke="{K}" stroke-width="6"/>
    <!-- тумба и стопки газет -->
    <rect x="880" y="900" width="200" height="340" fill="#6b4423" stroke="{K}" stroke-width="6"/>
    {"".join(f'<rect x="{x}" y="{1240 - (k + 1) * 26}" width="170" height="26" fill="{c}" stroke="{K}" stroke-width="3"/>' for x, n in ((20, 9), (200, 6)) for k, c in zip(range(n), ["#efe6cc", "#e2d8bf"] * 6))}
    <!-- шкаф с папками -->
    <rect x="930" y="300" width="150" height="560" fill="#8a5a33" stroke="{K}" stroke-width="6"/>
    {"".join(f'<rect x="{944 + i * 32}" y="{330 + j * 170}" width="26" height="130" fill="{c}" stroke="{K}" stroke-width="3"/>' for j in range(3) for i, c in enumerate(("#c0392b", "#2f6db5", "#e6b422", "#2f5a3e")))}
    <!-- пол -->
    <rect y="1240" width="1080" height="680" fill="#8a6a4a"/><path d="M0 1240 H1080" stroke="{K}" stroke-width="7"/>
    {"".join(f'<path d="M{x} 1240 L{x - 200} 1920" stroke="#7a5c3e" stroke-width="4"/>' for x in range(0, 1400, 120))}
  </svg>
'''

for n, s in (("klass", klass), ("shkolnyidvor", dvor), ("uchitelskaya2", uch)):
    open(f"bg_{n}.svg.part", "w").write(s)
print("ok")
