# python3 gen_bgs2.py → фоны четвёртого набора локаций (ep16 «Первый снег»):
# bg_interior (из-за руля, лобовое со снегом), bg_tireshop (шиномонтаж и очередь), bg_pit (из смотровой ямы, снизу вверх), bg_ditch (трасса с кюветом)
import random
K = "#000"
random.seed(16)
HEAD = '  <svg id="bg" width="1080" height="1920" viewBox="0 0 1080 1920" style="position:absolute;left:0;top:0">\n'
SNOW = '  <div id="snowfx" style="position:absolute;inset:0;pointer-events:none;z-index:40"></div>\n'


def flakes(n, x0, y0, x1, y1, col="#eef3fb"):
    return "".join(f'<circle cx="{random.randint(x0, x1)}" cy="{random.randint(y0, y1)}" r="{random.choice([3, 4, 5, 7])}" fill="{col}" opacity="{random.choice([.5, .7, .9])}"/>' for _ in range(n))


# ---------- салон: камера с водительского места
interior = HEAD + f'''    <defs>
      <linearGradient id="iSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#101a33"/><stop offset="1" stop-color="#3a4a72"/></linearGradient>
      <linearGradient id="iDash" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2c2f36"/><stop offset="1" stop-color="#121317"/></linearGradient>
      <radialGradient id="iHead" cx=".5" cy="1" r=".9"><stop offset="0" stop-color="#ffe9b0" stop-opacity=".55"/><stop offset="1" stop-color="#ffe9b0" stop-opacity="0"/></radialGradient>
    </defs>
    <rect width="1080" height="1920" fill="#0b0c10"/>
    <!-- за стеклом: ночная дорога, снег, фары встречных -->
    <path d="M60 330 Q540 250 1020 330 L1080 1120 L0 1120 Z" fill="url(#iSky)"/>
    <path d="M0 1120 L470 760 L610 760 L1080 1120 Z" fill="#cfd8e6"/>
    <path d="M520 770 L500 1120 M560 770 L580 1120" stroke="#9aa6b8" stroke-width="10" stroke-dasharray="40 50"/>
    <path d="M0 920 Q260 760 470 760 L470 790 Q240 820 0 1000 Z M1080 920 Q820 760 610 760 L610 790 Q840 820 1080 1000 Z" fill="#e9eff7"/>
    <g fill="#0d1428"><path d="M90 760 l40 -90 l40 90 z M180 770 l30 -70 l30 70 z M860 760 l40 -100 l40 100 z M950 770 l30 -70 l30 70 z"/></g>
    <ellipse cx="560" cy="790" rx="150" ry="70" fill="url(#iHead)"/><circle cx="530" cy="785" r="9" fill="#fff6d8"/><circle cx="590" cy="785" r="9" fill="#fff6d8"/>
    <g>{flakes(70, 80, 340, 1000, 1100)}</g>
    <!-- стойки и рамка стекла -->
    <path d="M0 260 L120 300 Q540 210 960 300 L1080 260 L1080 0 L0 0 Z" fill="#17181d" stroke="{K}" stroke-width="8"/>
    <path d="M0 260 L120 300 L20 1150 L0 1150 Z M1080 260 L960 300 L1060 1150 L1080 1150 Z" fill="#1d1f25" stroke="{K}" stroke-width="8"/>
    <!-- зеркало и ёлочка -->
    <path d="M540 250 v60" stroke="#111" stroke-width="14"/><rect x="400" y="300" width="280" height="80" rx="30" fill="#2a2d34" stroke="{K}" stroke-width="7"/>
    <rect x="418" y="314" width="244" height="52" rx="20" fill="#3d4f74"/>
    <path d="M540 380 v70" stroke="#d9d9d9" stroke-width="3"/><path d="M540 450 l-34 70 h22 l-26 50 h76 l-26 -50 h22 z" fill="#2ecc71" stroke="{K}" stroke-width="5" stroke-linejoin="round"/>
    <!-- дворники (лежат внизу) -->
    <path d="M150 1110 L520 1040" stroke="#0d0d0f" stroke-width="16" stroke-linecap="round"/><path d="M560 1110 L930 1040" stroke="#0d0d0f" stroke-width="16" stroke-linecap="round"/>
    <!-- торпедо -->
    <path d="M0 1120 Q540 1050 1080 1120 L1080 1920 L0 1920 Z" fill="url(#iDash)" stroke="{K}" stroke-width="8"/>
    <path d="M0 1240 Q540 1180 1080 1240" stroke="#3a3e47" stroke-width="6" fill="none"/>
    <!-- приборка -->
    <path d="M230 1200 Q540 1150 850 1200 L820 1360 Q540 1320 260 1360 Z" fill="#101114" stroke="{K}" stroke-width="7"/>
    <circle cx="410" cy="1280" r="62" fill="#0a0a0c" stroke="#ff7a1a" stroke-width="7"/><path d="M410 1280 l-30 -36" stroke="#ff3b30" stroke-width="7" stroke-linecap="round"/>
    <circle cx="670" cy="1280" r="62" fill="#0a0a0c" stroke="#ff7a1a" stroke-width="7"/><path d="M670 1280 l36 -20" stroke="#ff3b30" stroke-width="7" stroke-linecap="round"/>
    <text x="540" y="1300" text-anchor="middle" font-family="JetBrains Mono" font-weight="800" font-size="34" fill="#7cc8ff">−2°</text>
    <!-- руль -->
    <circle cx="540" cy="1620" r="330" fill="none" stroke="#141519" stroke-width="64"/>
    <circle cx="540" cy="1620" r="330" fill="none" stroke="{K}" stroke-width="6"/><circle cx="540" cy="1620" r="362" fill="none" stroke="{K}" stroke-width="6"/><circle cx="540" cy="1620" r="298" fill="none" stroke="{K}" stroke-width="6"/>
    <path d="M250 1660 Q540 1560 830 1660 L760 1760 Q540 1700 320 1760 Z" fill="#17181c" stroke="{K}" stroke-width="7"/>
    <circle cx="540" cy="1680" r="80" fill="#202228" stroke="{K}" stroke-width="7"/><text x="540" y="1698" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="40" fill="#8b93a3">ВАЗ</text>
  </svg>
''' + SNOW

# ---------- шиномонтаж: серое небо, первый снег, очередь
cars = "".join(f'<g transform="translate({x} {y}) scale({s})"><path d="M0 60 q0 -30 30 -36 l60 -10 q30 -34 80 -36 h70 q40 4 70 40 l50 8 q24 4 24 30 v20 h-384 z" fill="{c}" stroke="{K}" stroke-width="7"/>'
               f'<path d="M110 14 q24 -26 60 -28 h40 v30 z M224 16 v-30 h20 q30 4 52 32 z" fill="#2c3a52"/><circle cx="80" cy="80" r="26" fill="#1a1a1a" stroke="{K}" stroke-width="6"/><circle cx="300" cy="80" r="26" fill="#1a1a1a" stroke="{K}" stroke-width="6"/></g>'
               for x, y, s, c in [(-120, 1180, .9, "#c0392b"), (210, 1170, .9, "#2e86de"), (560, 1160, .9, "#95a5a6"), (880, 1150, .9, "#27ae60")])
stack = lambda x, y, n: "".join(f'<ellipse cx="{x}" cy="{y - i * 38}" rx="74" ry="26" fill="#1c1c1f" stroke="{K}" stroke-width="6"/><ellipse cx="{x}" cy="{y - i * 38}" rx="34" ry="11" fill="#3a3a40"/>' for i in range(n))
tireshop = HEAD + f'''    <defs>
      <linearGradient id="tSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7d8aa0"/><stop offset="1" stop-color="#c9d1dd"/></linearGradient>
      <linearGradient id="tGround" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5b6370"/><stop offset="1" stop-color="#363b44"/></linearGradient>
    </defs>
    <rect width="1080" height="1920" fill="url(#tSky)"/>
    <g fill="#9aa5b6">{"".join(f'<rect x="{x}" y="{y}" width="{w}" height="{1000 - y}"/>' for x, y, w in [(0, 520, 160), (180, 600, 120), (820, 560, 140), (970, 500, 110)])}</g>
    <!-- здание шиномонтажа -->
    <rect x="120" y="560" width="840" height="520" fill="#e8e2d4" stroke="{K}" stroke-width="8"/>
    <rect x="160" y="600" width="760" height="110" rx="16" fill="#ffd23f" stroke="{K}" stroke-width="7"/>
    <text x="540" y="678" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="54" fill="#151515">ШИНОМОНТАЖ 24</text>
    <g><rect x="180" y="740" width="320" height="340" fill="#1d2027" stroke="{K}" stroke-width="7"/><rect x="580" y="740" width="320" height="340" fill="#1d2027" stroke="{K}" stroke-width="7"/>
      <path d="M180 740 h320 v40 h-320 z M580 740 h320 v40 h-320 z" fill="#c9ced6" stroke="{K}" stroke-width="5"/>
      {stack(260, 1060, 6)}{stack(420, 1060, 4)}{stack(820, 1060, 5)}
      <rect x="640" y="900" width="120" height="180" fill="#2e86de" stroke="{K}" stroke-width="6"/><circle cx="700" cy="930" r="30" fill="#ffd23f" stroke="{K}" stroke-width="5"/></g>
    <!-- доска очереди -->
    <g transform="rotate(-3 900 470)"><rect x="740" y="400" width="300" height="150" rx="12" fill="#1f3b2d" stroke="#6b4a2b" stroke-width="12"/>
      <text x="890" y="460" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="30" fill="#fff">ОЧЕРЕДЬ</text>
      <text x="890" y="515" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="40" fill="#ffd23f">~ 6 ЧАСОВ</text></g>
    <!-- асфальт со снегом -->
    <rect y="1080" width="1080" height="840" fill="url(#tGround)"/>
    <g fill="#e9eff7" opacity=".9"><path d="M0 1080 h1080 v18 q-200 14 -420 0 q-240 -12 -660 6 z"/><ellipse cx="160" cy="1600" rx="200" ry="30"/><ellipse cx="820" cy="1720" rx="260" ry="36"/><ellipse cx="520" cy="1450" rx="140" ry="20"/></g>
    {cars}
    <g>{flakes(90, 0, 0, 1080, 1900, "#f4f7fc")}</g>
  </svg>
''' + SNOW

# ---------- смотровая яма: камера снизу, над головой днище
rust = "".join(f'<ellipse cx="{random.randint(140, 940)}" cy="{random.randint(120, 560)}" rx="{random.randint(30, 80)}" ry="{random.randint(14, 34)}" fill="{random.choice(["#8a4a1c", "#a35a20", "#6b3814"])}" opacity=".85"/>' for _ in range(16))
holes = "".join(f'<ellipse cx="{x}" cy="{y}" rx="{r}" ry="{r * .6}" fill="#0b0b0b" stroke="#c2691f" stroke-width="5"/>' for x, y, r in [(330, 380, 26), (720, 250, 20), (610, 470, 16)])
pit = HEAD + f'''    <defs>
      <linearGradient id="pWall" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2a2d33"/><stop offset="1" stop-color="#4a4f58"/></linearGradient>
      <linearGradient id="pWall2" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="#2a2d33"/><stop offset="1" stop-color="#4a4f58"/></linearGradient>
      <radialGradient id="pLamp" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff2c4" stop-opacity=".55"/><stop offset="1" stop-color="#fff2c4" stop-opacity="0"/></radialGradient>
    </defs>
    <rect width="1080" height="1920" fill="#16181d"/>
    <!-- днище над головой -->
    <path d="M60 60 H1020 V660 H60 Z" fill="#3b3f47" stroke="{K}" stroke-width="8"/>
    <path d="M120 120 H960 V600 H120 Z" fill="#4a4f58" stroke="{K}" stroke-width="6"/>
    {rust}{holes}
    <path d="M200 330 H900" stroke="#6d737d" stroke-width="40" stroke-linecap="round"/><path d="M200 330 H900" stroke="{K}" stroke-width="6" stroke-dasharray="1 0" fill="none" opacity=".4"/>
    <path d="M780 300 q60 0 60 60 v120" stroke="#9aa1ab" stroke-width="30" fill="none" stroke-linecap="round"/><rect x="800" y="470" width="80" height="150" rx="20" fill="#7b818b" stroke="{K}" stroke-width="6"/>
    <g fill="#141416" stroke="{K}" stroke-width="7"><rect x="20" y="140" width="120" height="260" rx="40"/><rect x="940" y="140" width="120" height="260" rx="40"/></g>
    <!-- стены ямы, уходящие вверх -->
    <path d="M0 660 L220 760 L220 1920 L0 1920 Z" fill="url(#pWall)" stroke="{K}" stroke-width="8"/>
    <path d="M1080 660 L860 760 L860 1920 L1080 1920 Z" fill="url(#pWall2)" stroke="{K}" stroke-width="8"/>
    <g stroke="#23262c" stroke-width="5">{"".join(f'<path d="M0 {y} L220 {y + 60}"/><path d="M1080 {y} L860 {y + 60}"/>' for y in range(820, 1920, 140))}</g>
    <rect x="220" y="760" width="640" height="1160" fill="#1f2228"/>
    <path d="M220 1700 H860 V1920 H220 Z" fill="#2b2620"/><ellipse cx="420" cy="1780" rx="120" ry="20" fill="#121212" opacity=".7"/>
    <!-- переноска -->
    <path d="M300 660 q-20 120 40 200" stroke="#ff9f0a" stroke-width="8" fill="none"/><rect x="315" y="850" width="56" height="100" rx="20" fill="#ffd23f" stroke="{K}" stroke-width="6"/>
    <circle cx="343" cy="900" r="300" fill="url(#pLamp)"/>
  </svg>
'''

# ---------- трасса за городом, кювет, сугробы
ditch = HEAD + f'''    <defs>
      <linearGradient id="dSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3d4a6e"/><stop offset="1" stop-color="#a6b2c8"/></linearGradient>
      <linearGradient id="dField" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e3e9f2"/><stop offset="1" stop-color="#b9c4d4"/></linearGradient>
    </defs>
    <rect width="1080" height="1920" fill="url(#dSky)"/>
    <path d="M0 880 Q300 820 600 870 T1080 850 V1920 H0 Z" fill="url(#dField)"/>
    <g fill="#26324f">{"".join(f'<path d="M{x} 880 l26 -{h} l26 {h} z"/>' for x, h in [(40, 80), (90, 110), (150, 70), (700, 90), (760, 120), (830, 80), (900, 100), (980, 70)])}</g>
    <!-- столбы с проводами -->
    <g stroke="#1b2235" stroke-width="10">{"".join(f'<path d="M{x} {y} v-{h}"/><path d="M{x - 30} {y - h + 20} h60" stroke-width="7"/>' for x, y, h in [(120, 900, 260), (420, 880, 200), (700, 875, 160)])}</g>
    <path d="M120 660 Q270 700 420 700 Q560 710 700 735" stroke="#1b2235" stroke-width="3" fill="none"/>
    <!-- дорога по диагонали, кювет справа -->
    <path d="M330 880 L520 880 L760 1920 L-200 1920 Z" fill="#59606d" stroke="{K}" stroke-width="7"/>
    <path d="M425 890 L280 1920" stroke="#e9eff7" stroke-width="14" stroke-dasharray="70 70"/>
    <path d="M520 880 L572 880 L1040 1920 L760 1920 Z" fill="#7d8aa0" stroke="{K}" stroke-width="5"/>
    <path d="M546 880 L900 1920" stroke="#5f6b82" stroke-width="10" opacity=".7"/>
    <g fill="#f4f7fc" stroke="{K}" stroke-width="6"><ellipse cx="80" cy="1800" rx="230" ry="80"/><ellipse cx="660" cy="1120" rx="70" ry="22"/><ellipse cx="840" cy="1450" rx="120" ry="34"/><ellipse cx="1040" cy="1820" rx="160" ry="50"/></g>
    <!-- знак «гололёд» -->
    <g><path d="M880 1080 V880" stroke="#1b2235" stroke-width="12"/><path d="M880 760 L960 900 L800 900 Z" fill="#fff" stroke="#e53935" stroke-width="14" stroke-linejoin="round"/>
      <path d="M850 880 q15 -40 40 -40 l10 20" stroke="{K}" stroke-width="7" fill="none"/></g>
    <g>{flakes(110, 0, 0, 1080, 1900, "#f6f9fd")}</g>
  </svg>
''' + SNOW

for n, s in [("interior", interior), ("tireshop", tireshop), ("pit", pit), ("ditch", ditch)]:
    open(f"bg_{n}.svg.part", "w").write(s)
print("ok")
