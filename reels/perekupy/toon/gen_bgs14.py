# python3 gen_bgs14.py → фоны шестнадцатого набора (ep27 «Японский аукцион»):
# bg_port (порт Владивостока утром: сопки, вантовый мост, портовый кран с машиной на стропах, контейнеры, чайки, вода),
# bg_flat (комната Серёги ночью: стол с ноутбуком — свет экрана, банки энергетика, постер с машиной, окно с городом, кровать)
import random
K = "#000"
random.seed(28)
HEAD = '  <svg id="bg" width="1080" height="1920" viewBox="0 0 1080 1920" style="position:absolute;left:0;top:0">\n'

# ---------- порт Владивостока
conts = "".join(f'<rect x="{x}" y="{y}" width="180" height="90" fill="{c}" stroke="{K}" stroke-width="5"/>' + "".join(f'<path d="M{x + 12 + i * 18} {y + 8} v74" stroke="{K}" stroke-width="2" opacity=".35"/>' for i in range(9))
                for (x, y, c) in [(-20, 1000, "#c0392b"), (160, 1000, "#2e86de"), (340, 1000, "#27ae60"), (-20, 910, "#e67e22"), (160, 910, "#8e44ad"), (700, 1000, "#c0392b"), (880, 1000, "#f1c40f"), (790, 910, "#2e86de")])
port = HEAD + f'''    <defs><linearGradient id="ptSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7fb6e6"/><stop offset="1" stop-color="#f3d9b8"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#ptSky)"/>
    <!-- сопки -->
    <path d="M0 760 Q180 600 360 720 T720 690 T1080 720 V1000 H0 Z" fill="#6f8f7a" stroke="{K}" stroke-width="5"/>
    <path d="M0 820 Q240 700 480 800 T1080 790 V1000 H0 Z" fill="#587a64"/>
    <!-- вантовый мост -->
    <g stroke="#e9ecef" fill="none"><path d="M120 420 L150 860 M150 420 L120 860" stroke-width="16"/><path d="M930 420 L960 860 M960 420 L930 860" stroke-width="16"/>
      <path d="M0 820 H1080" stroke-width="20"/>{"".join(f'<path d="M135 440 L{x} 820" stroke-width="3"/><path d="M945 440 L{1080 - x} 820" stroke-width="3"/>' for x in range(170, 540, 40))}</g>
    <!-- вода -->
    <rect y="860" width="1080" height="60" fill="#3b7fb0"/><g stroke="#cfe8f5" stroke-width="4" opacity=".7">{"".join(f'<path d="M{x} 885 q20 -8 40 0"/>' for x in range(0, 1080, 90))}</g>
    <!-- портовый кран -->
    <g><rect x="560" y="300" width="40" height="760" fill="#f39c12" stroke="{K}" stroke-width="6"/>
      <g stroke="{K}" stroke-width="4">{"".join(f'<path d="M560 {y} L600 {y + 40} M600 {y} L560 {y + 40}"/>' for y in range(320, 1040, 40))}</g>
      <rect x="380" y="270" width="520" height="40" fill="#f39c12" stroke="{K}" stroke-width="6"/><rect x="600" y="230" width="90" height="70" fill="#d35400" stroke="{K}" stroke-width="6"/>
      <path id="craneRope" d="M820 310 V560" stroke="{K}" stroke-width="4"/></g>
    {conts}
    <!-- причал -->
    <rect y="1090" width="1080" height="830" fill="#7f8c8d"/><path d="M0 1090 H1080" stroke="{K}" stroke-width="7"/>
    <g fill="#f1c40f">{"".join(f'<rect x="{x}" y="1110" width="80" height="14"/>' for x in range(20, 1080, 160))}</g>
    <g stroke="#6c7a7b" stroke-width="5">{"".join(f'<path d="M0 {y} H1080"/>' for y in range(1200, 1920, 90))}</g>
    <g><rect x="40" y="1050" width="30" height="40" fill="#2b2f37"/><circle cx="55" cy="1048" r="18" fill="#2b2f37"/></g>
    <!-- чайки -->
    <g stroke="{K}" stroke-width="5" fill="none">{"".join(f'<path d="M{x} {y} q14 -14 28 0 q14 -14 28 0"/>' for x, y in [(160, 360), (260, 300), (780, 420), (860, 360)])}</g>
  </svg>
'''

# ---------- комната Серёги ночью
flat = HEAD + f'''    <rect width="1080" height="1920" fill="#1d2233"/>
    <g stroke="#262c40" stroke-width="5">{"".join(f'<path d="M{x} 0 V1100"/>' for x in range(60, 1080, 120))}</g>
    <!-- окно с ночным городом -->
    <rect x="620" y="240" width="380" height="440" fill="#0d1226" stroke="#3a4260" stroke-width="16"/><path d="M810 240 V680 M620 460 H1000" stroke="#3a4260" stroke-width="10"/>
    <g>{"".join(f'<rect x="{x}" y="{y}" width="12" height="16" fill="#ffd77a" opacity="{random.choice([.3, .9])}"/>' for x in range(650, 990, 34) for y in range(500, 670, 40))}</g>
    <circle cx="700" cy="320" r="34" fill="#f4f6f8" opacity=".9"/>
    <!-- постер с машиной -->
    <g transform="rotate(-3 290 420)"><rect x="110" y="270" width="360" height="300" fill="#ff3b30" stroke="{K}" stroke-width="7"/>
      <path d="M150 480 q20 -60 80 -66 l40 -44 h120 l40 44 q50 6 60 66 z" fill="#151515"/><circle cx="210" cy="490" r="26" fill="#151515" stroke="#fff" stroke-width="5"/><circle cx="410" cy="490" r="26" fill="#151515" stroke="#fff" stroke-width="5"/>
      <text x="290" y="330" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="34" fill="#fff">JDM</text></g>
    <!-- стол, ноутбук, свет экрана -->
    <circle cx="540" cy="900" r="420" fill="#5ac8fa" opacity=".12"/>
    <rect x="0" y="1060" width="1080" height="44" fill="#6b4423" stroke="{K}" stroke-width="7"/>
    <g><path d="M330 1060 L360 780 H720 L750 1060 Z" fill="#2b2f37" stroke="{K}" stroke-width="7"/><path d="M372 796 H708 L686 1040 H394 Z" fill="#5ac8fa" opacity=".85"/>
      <rect x="290" y="1048" width="500" height="20" rx="6" fill="#3a3f4a" stroke="{K}" stroke-width="5"/></g>
    {"".join(f'<g><rect x="{x}" y="980" width="44" height="80" rx="8" fill="{c}" stroke="{K}" stroke-width="5"/><rect x="{x}" y="1000" width="44" height="18" fill="#151515" opacity=".4"/></g>' for x, c in [(130, "#4cd964"), (190, "#ff3b30"), (860, "#4cd964")])}
    <!-- пол, кровать -->
    <rect y="1104" width="1080" height="816" fill="#2a2f45"/><g stroke="#232840" stroke-width="5">{"".join(f'<path d="M0 {y} H1080"/>' for y in range(1170, 1920, 70))}</g>
  </svg>
'''

for n, s in [("port", port), ("flat", flat)]:
    open(f"bg_{n}.svg.part", "w").write(s)
print("ok")
