# python3 gen_bgs49.py → фоны для ep57 «Суд: перекупы против бота» (киношный формат):
# bg_zalsuda (зал суда: деревянные панели, высокое окно с жалюзи, эмблема-весы, судейская трибуна, часы, паркет),
# bg_veranda (деревенская веранда днём: резные наличники, крыльцо, подсолнухи, штакетник, двор),
# bg_komnatanoch (комната перекупа ночью: стол, монитор светит, банки энергетика, кровать, окно с ночным городом)
import random
K = "#000"
HEAD = '  <svg id="bg" width="1080" height="1920" viewBox="0 0 1080 1920" style="position:absolute;left:0;top:0">\n'
F = 'font-family="Unbounded" font-weight="900"'
M = 'font-family="JetBrains Mono" font-weight="800"'
R = random.randint

random.seed(131)
zalsuda = HEAD + f'''    <rect width="1080" height="1920" fill="#6a4426"/>
    <!-- деревянные панели -->
    {"".join(f'<rect x="{x}" y="0" width="128" height="1240" fill="{"#7a4e2c" if k % 2 else "#704729"}" stroke="#4a2e18" stroke-width="5"/><rect x="{x + 18}" y="80" width="92" height="420" rx="6" fill="none" stroke="#5a3820" stroke-width="5"/><rect x="{x + 18}" y="560" width="92" height="420" rx="6" fill="none" stroke="#5a3820" stroke-width="5"/>' for k, x in enumerate(range(0, 1080, 135)))}
    <!-- высокое окно с жалюзи -->
    <rect x="740" y="120" width="260" height="520" fill="#cfe6f2" stroke="{K}" stroke-width="7"/>{"".join(f'<rect x="746" y="{y}" width="248" height="18" fill="#e9eef2" stroke="#9aa6b2" stroke-width="2"/>' for y in range(128, 640, 30))}
    <!-- эмблема: весы -->
    <circle cx="540" cy="260" r="150" fill="#2b2f37" stroke="#e6b422" stroke-width="12"/>
    <path d="M540 160 V360 M470 380 h140 M420 200 h240" stroke="#e6b422" stroke-width="12" stroke-linecap="round"/>
    <path d="M420 200 l-40 90 h80 z M660 200 l-40 90 h80 z" fill="#e6b422" stroke="{K}" stroke-width="4"/>
    <!-- часы -->
    <circle cx="190" cy="250" r="70" fill="#fbfaf3" stroke="{K}" stroke-width="7"/><path d="M190 250 V200 M190 250 h34" stroke="{K}" stroke-width="7" stroke-linecap="round"/>
    <!-- судейская трибуна -->
    <rect x="160" y="760" width="760" height="480" fill="#5a3820" stroke="{K}" stroke-width="7"/>
    <rect x="140" y="730" width="800" height="50" fill="#7a4e2c" stroke="{K}" stroke-width="7"/>
    {"".join(f'<rect x="{x}" y="820" width="200" height="360" rx="8" fill="none" stroke="#3e2614" stroke-width="6"/>' for x in (200, 440, 680))}
    <rect x="410" y="850" width="260" height="70" rx="8" fill="#e6b422" stroke="{K}" stroke-width="5"/><text x="540" y="898" text-anchor="middle" {F} font-size="34" fill="#151515">СУДЬЯ</text>
    <!-- паркет -->
    <rect y="1240" width="1080" height="680" fill="#a8743f"/><path d="M0 1240 H1080" stroke="{K}" stroke-width="8"/>
    {"".join(f'<path d="M{x} {y} l60 30 l-60 30 l-60 -30 z" fill="none" stroke="#8a5a2f" stroke-width="3"/>' for x in range(0, 1140, 120) for y in range(1260, 1920, 60))}
  </svg>
'''

random.seed(132)
veranda = HEAD + f'''    <defs><linearGradient id="vr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8ccff2"/><stop offset="1" stop-color="#eaf7fd"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#vr)"/>
    {"".join(f'<ellipse cx="{x}" cy="{R(120, 240)}" rx="{R(70, 120)}" ry="{R(22, 36)}" fill="#fff" opacity=".9"/>' for x in (200, 640, 960))}
    <!-- изба: брёвна, наличники -->
    <rect x="-20" y="340" width="700" height="760" fill="#a8743f" stroke="{K}" stroke-width="6"/>
    {"".join(f'<path d="M-20 {y} H680" stroke="#8a5a2f" stroke-width="6"/>' for y in range(380, 1100, 46))}
    <path d="M-40 360 L330 150 L700 360 Z" fill="#5b6670" stroke="{K}" stroke-width="6"/>
    {"".join(f'<rect x="{x}" y="500" width="150" height="190" fill="#bfe3f5" stroke="#fbfaf3" stroke-width="16"/><path d="M{x - 20} 500 h190 l-20 -40 h-150 z" fill="#2f6db5" stroke="{K}" stroke-width="4"/><path d="M{x - 10} 690 h170 l-14 30 h-142 z" fill="#2f6db5" stroke="{K}" stroke-width="4"/><path d="M{x + 75} 500 V690 M{x} 590 H{x + 150}" stroke="#fbfaf3" stroke-width="8"/>' for x in (80, 380))}
    <!-- крыльцо -->
    <rect x="460" y="900" width="320" height="200" fill="#c9a26a" stroke="{K}" stroke-width="6"/>{"".join(f'<path d="M{460 + k * 40} {900 + k * 50} H780" stroke="#8a5a2f" stroke-width="5"/>' for k in range(4))}
    <!-- подсолнухи и штакетник -->
    {"".join(f'<path d="M{x} 1080 V{y}" stroke="#3f8a4a" stroke-width="10"/><circle cx="{x}" cy="{y}" r="44" fill="#ffd23f" stroke="{K}" stroke-width="5"/><circle cx="{x}" cy="{y}" r="20" fill="#6b4423"/>' for x, y in ((820, 760), (920, 700), (1010, 790)))}
    {"".join(f'<path d="M{x} 1140 V990 l12 -18 l12 18 V1140 z" fill="#e8d0a0" stroke="{K}" stroke-width="4"/>' for x in range(700, 1080, 40))}
    <!-- двор -->
    <rect y="1100" width="1080" height="820" fill="#9cc46a"/>{"".join(f'<path d="M{R(0, 1080)} {R(1140, 1900)} l6 -18 l6 18" stroke="#6f9a46" stroke-width="4" fill="none"/>' for _ in range(90))}
    <path d="M300 1920 Q460 1400 560 1100" stroke="#c9b08a" stroke-width="160" fill="none" opacity=".8"/>
  </svg>
'''

random.seed(133)
komnatanoch = HEAD + f'''    <rect width="1080" height="1920" fill="#14182a"/>
    <rect y="0" width="1080" height="1240" fill="#1c2238"/>
    <!-- окно с ночным городом -->
    <rect x="620" y="200" width="380" height="440" fill="#0b1030" stroke="{K}" stroke-width="7"/>
    {"".join(f'<rect x="{x}" y="{y}" width="{w}" height="{640 - y}" fill="#151a3a"/>' + "".join(f'<rect x="{x + 6 + i * 16}" y="{y + 10 + j * 22}" width="7" height="10" fill="#ffc46a" opacity="{R(3, 10) / 10}"/>' for i in range(w // 16) for j in range((630 - y) // 22) if R(0, 2) == 0) for x, y, w in ((630, 420, 90), (730, 360, 80), (820, 460, 90), (915, 390, 80)))}
    <path d="M810 200 V640 M620 420 H1000" stroke="{K}" stroke-width="7"/>
    <!-- постеры -->
    <rect x="80" y="220" width="200" height="270" fill="#c0392b" stroke="{K}" stroke-width="5" transform="rotate(-4 180 355)"/><text x="180" y="370" text-anchor="middle" {F} font-size="34" fill="#fbfaf3" transform="rotate(-4 180 355)">AVTO</text>
    <rect x="320" y="260" width="220" height="160" fill="#2f6db5" stroke="{K}" stroke-width="5"/><text x="430" y="355" text-anchor="middle" {M} font-size="30" fill="#ffd23f">ПРОДАМ</text>
    <!-- кровать -->
    <rect x="40" y="1000" width="420" height="200" fill="#3a3f56" stroke="{K}" stroke-width="6"/><rect x="60" y="960" width="140" height="60" rx="20" fill="#c9ced6" stroke="{K}" stroke-width="5"/>
    <!-- стол -->
    <rect x="520" y="900" width="540" height="36" fill="#5b4a3a" stroke="{K}" stroke-width="5"/><path d="M550 936 v300 M1030 936 v300" stroke="#3a2e22" stroke-width="16"/>
    {"".join(f'<rect x="{x}" y="{850 if k % 2 else 862}" width="34" height="{50 if k % 2 else 38}" rx="6" fill="{c}" stroke="{K}" stroke-width="4"/>' for k, (x, c) in enumerate(((560, "#4cd964"), (600, "#ff3bd0"), (980, "#4cd964"), (1020, "#ffd23f"))))}
    <!-- пол -->
    <rect y="1240" width="1080" height="680" fill="#262a3a"/><path d="M0 1240 H1080" stroke="{K}" stroke-width="7"/>
    {"".join(f'<path d="M0 {y} H1080" stroke="#2e3346" stroke-width="3"/>' for y in range(1300, 1920, 70))}
  </svg>
'''

for n, s in (("zalsuda", zalsuda), ("veranda", veranda), ("komnatanoch", komnatanoch)):
    open(f"bg_{n}.svg.part", "w").write(s)
print("ok")
