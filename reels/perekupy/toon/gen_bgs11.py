# python3 gen_bgs11.py → фоны тринадцатого набора (ep25 «Тест-драйв»):
# bg_street (тихая улица днём: шаурмичная «24», лавочка, урна, фонарь, парковочные места), bg_police (кабинет участкового: стол с
# монитором и стопкой дел, сейф, плакат «Осторожно, мошенники!», карта района, окно с решёткой)
import random
K = "#000"
random.seed(25)
HEAD = '  <svg id="bg" width="1080" height="1920" viewBox="0 0 1080 1920" style="position:absolute;left:0;top:0">\n'

# ---------- улица у шаурмичной
bricks = "".join(f'<rect x="{x + (y // 40 % 2) * 40}" y="{y}" width="78" height="38" fill="#c9714a" stroke="#a85a37" stroke-width="3"/>' for y in range(300, 1080, 40) for x in range(-40, 1080, 80))
street = HEAD + f'''    <defs><linearGradient id="stSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fc3ee"/><stop offset="1" stop-color="#dcecf8"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#stSky)"/><ellipse cx="760" cy="150" rx="140" ry="40" fill="#fff"/>
    <!-- кирпичный дом с шаурмичной -->
    <g>{bricks}</g><rect x="0" y="300" width="1080" height="780" fill="none" stroke="{K}" stroke-width="8"/>
    <rect x="60" y="560" width="520" height="140" rx="12" fill="#2b7a2b" stroke="{K}" stroke-width="7"/>
    <text x="320" y="652" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="64" fill="#ffd23f">ШАУРМА 24</text>
    <rect x="80" y="730" width="230" height="350" fill="#cfe3f2" stroke="{K}" stroke-width="7"/><rect x="340" y="730" width="220" height="350" fill="#2b2f37" stroke="{K}" stroke-width="7"/>
    <path d="M450 730 V1080" stroke="#4a4e58" stroke-width="5"/><circle cx="430" cy="910" r="8" fill="#c9ced6"/>
    <g><rect x="100" y="760" width="190" height="90" fill="#fff" stroke="{K}" stroke-width="4"/><text x="195" y="800" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="22">ШАУРМА</text>
      <text x="195" y="834" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="28" fill="#c0392b">249 ₽</text></g>
    {"".join(f'<rect x="{x}" y="380" width="140" height="130" fill="#bfe3ff" stroke="{K}" stroke-width="6"/><path d="M{x + 70} 380 V510" stroke="{K}" stroke-width="4"/>' for x in (640, 860))}
    <rect x="640" y="600" width="360" height="200" fill="#bfe3ff" stroke="{K}" stroke-width="6"/><path d="M820 600 V800" stroke="{K}" stroke-width="4"/>
    <!-- фонарь и урна -->
    <path d="M1010 1080 V700" stroke="#2b2f37" stroke-width="14"/><path d="M970 700 h80 l-12 30 h-56 z" fill="#ffe9a8" stroke="{K}" stroke-width="5"/>
    <!-- тротуар, лавочка -->
    <rect y="1080" width="1080" height="150" fill="#b8bec7"/><path d="M0 1080 H1080 M0 1230 H1080" stroke="{K}" stroke-width="6"/>
    <g><rect x="620" y="1100" width="300" height="22" fill="#7a4a24" stroke="{K}" stroke-width="5"/><rect x="620" y="1060" width="300" height="20" fill="#7a4a24" stroke="{K}" stroke-width="5"/>
      <path d="M640 1122 v60 M900 1122 v60" stroke="#333" stroke-width="10"/></g>
    <g><path d="M560 1110 h50 l-6 80 h-38 z" fill="#3a6b3a" stroke="{K}" stroke-width="5"/></g>
    <!-- дорога с разметкой парковки -->
    <rect y="1230" width="1080" height="690" fill="#5b616b"/>
    <g stroke="#fff" stroke-width="10">{"".join(f'<path d="M{x} 1240 l-40 220"/>' for x in range(80, 1080, 260))}</g>
    <g fill="#fff">{"".join(f'<rect x="{x}" y="1620" width="110" height="16" rx="4"/>' for x in range(20, 1080, 190))}</g>
  </svg>
'''

# ---------- кабинет участкового
police = HEAD + f'''    <rect width="1080" height="1920" fill="#dfe6d3"/><rect y="0" width="1080" height="700" fill="#e9eedf"/>
    <path d="M0 700 H1080" stroke="#a9b39a" stroke-width="10"/>
    <!-- окно с решёткой -->
    <rect x="640" y="250" width="360" height="380" fill="#bfe3ff" stroke="{K}" stroke-width="10"/>
    <g stroke="#2b2f37" stroke-width="10">{"".join(f'<path d="M{x} 250 V630"/>' for x in range(700, 1000, 60))}<path d="M640 440 H1000"/></g>
    <!-- плакат -->
    <g><rect x="80" y="240" width="420" height="300" fill="#fff" stroke="{K}" stroke-width="7"/><rect x="80" y="240" width="420" height="70" fill="#c0392b"/>
      <text x="290" y="288" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="30" fill="#fff">ОСТОРОЖНО,</text>
      <text x="290" y="360" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="38" fill="#151515">МОШЕННИКИ!</text>
      <text x="290" y="420" text-anchor="middle" font-family="Onest" font-weight="800" font-size="24" fill="#151515">Не отдавайте ключи</text>
      <text x="290" y="456" text-anchor="middle" font-family="Onest" font-weight="800" font-size="24" fill="#151515">незнакомцам</text>
      <text x="290" y="510" text-anchor="middle" font-family="Onest" font-weight="700" font-size="20" fill="#6b7280">ОМВД по району</text></g>
    <!-- сейф и шкаф -->
    <rect x="60" y="600" width="200" height="330" fill="#6b7280" stroke="{K}" stroke-width="7"/><circle cx="160" cy="740" r="34" fill="#c9ced6" stroke="{K}" stroke-width="6"/>
    <path d="M160 740 l20 -14" stroke="{K}" stroke-width="6"/>
    <!-- стол -->
    <rect x="220" y="930" width="760" height="40" fill="#7a4a24" stroke="{K}" stroke-width="7"/><rect x="240" y="970" width="720" height="360" fill="#8b5a2b" stroke="{K}" stroke-width="7"/>
    <path d="M600 970 V1330" stroke="{K}" stroke-width="5"/><circle cx="560" cy="1150" r="8" fill="#d4ac0d"/><circle cx="640" cy="1150" r="8" fill="#d4ac0d"/>
    <g><rect x="300" y="760" width="260" height="170" fill="#2b2f37" stroke="{K}" stroke-width="7"/><rect x="316" y="776" width="228" height="128" fill="#4c7aa8"/>
      <rect x="410" y="930" width="40" height="8" fill="{K}"/></g>
    <g>{"".join(f'<rect x="{700 + k * 4}" y="{900 - k * 18}" width="200" height="18" fill="{("#f4e7c3", "#e8d6a8")[k % 2]}" stroke="{K}" stroke-width="3"/>' for k in range(5))}
      <text x="805" y="860" text-anchor="middle" font-family="Onest" font-weight="800" font-size="16">ДЕЛО №</text></g>
    <g><rect x="600" y="880" width="60" height="50" rx="6" fill="#fff" stroke="{K}" stroke-width="4"/><path d="M660 892 q20 4 0 24" stroke="{K}" stroke-width="4" fill="none"/></g>
    <!-- пол -->
    <rect y="1330" width="1080" height="590" fill="#9a8a6a"/><g stroke="#86775a" stroke-width="5">{"".join(f'<path d="M0 {y} H1080"/>' for y in range(1390, 1920, 70))}</g>
  </svg>
'''

for n, s in [("street", street), ("police", police)]:
    open(f"bg_{n}.svg.part", "w").write(s)
print("ok")
