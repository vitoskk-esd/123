# python3 gen_bgs18.py → фон двадцатого набора (ep30 «Марафет за ночь»):
# bg_box (гаражный бокс ночью изнутри: лампа-переноска, стеллаж с канистрами, верстак, шланг, ведро, плакат «НЕ КУРИТЬ», бетонный пол с пятнами)
import random
K = "#000"
random.seed(32)
HEAD = '  <svg id="bg" width="1080" height="1920" viewBox="0 0 1080 1920" style="position:absolute;left:0;top:0">\n'
cans = "".join(f'<g><rect x="{x}" y="{y}" width="56" height="74" rx="8" fill="{c}" stroke="{K}" stroke-width="5"/><rect x="{x + 18}" y="{y - 12}" width="20" height="14" fill="#2b2b2e" stroke="{K}" stroke-width="4"/></g>'
               for x, y, c in [(70, 616, "#c0392b"), (140, 616, "#2e86de"), (210, 616, "#f1c40f"), (90, 786, "#27ae60"), (170, 786, "#c0392b"), (250, 786, "#8e8e93")])
spots = "".join(f'<ellipse cx="{random.randint(60, 1020)}" cy="{random.randint(1300, 1880)}" rx="{random.randint(40, 120)}" ry="{random.randint(12, 30)}" fill="#1c1c1f" opacity=".55"/>' for _ in range(10))
box = HEAD + f'''    <defs><radialGradient id="bxLamp" cx=".62" cy=".3" r=".75"><stop offset="0" stop-color="#ffe6a8" stop-opacity=".6"/><stop offset="1" stop-color="#ffe6a8" stop-opacity="0"/></radialGradient></defs>
    <rect width="1080" height="1920" fill="#3b3a3f"/>
    <!-- стена: шлакоблок -->
    <g stroke="#2e2d31" stroke-width="5">{"".join(f'<path d="M0 {y} H1080"/>' for y in range(80, 1200, 70))}{"".join(f'<path d="M{x + (y // 70 % 2) * 60} {y} v70"/>' for y in range(80, 1200, 70) for x in range(0, 1080, 120))}</g>
    <!-- стеллаж с канистрами -->
    <g><path d="M50 560 V1200 M330 560 V1200" stroke="#6b5a3a" stroke-width="14"/><path d="M40 690 H340 M40 860 H340 M40 1030 H340" stroke="#6b5a3a" stroke-width="16"/>{cans}
      <rect x="80" y="960" width="200" height="64" rx="8" fill="#5b6068" stroke="{K}" stroke-width="5"/></g>
    <!-- верстак, тиски, переноска -->
    <g><rect x="620" y="980" width="440" height="40" fill="#7a5a36" stroke="{K}" stroke-width="6"/><path d="M650 1020 V1200 M1030 1020 V1200" stroke="#5a4226" stroke-width="16"/>
      <rect x="700" y="930" width="80" height="50" fill="#5b6068" stroke="{K}" stroke-width="5"/><rect x="860" y="900" width="120" height="80" rx="10" fill="#c0392b" stroke="{K}" stroke-width="5"/>
      <path d="M900 900 q20 -40 40 0" fill="none" stroke="{K}" stroke-width="6"/></g>
    <g><path d="M700 120 Q720 300 680 420" stroke="#151515" stroke-width="6" fill="none"/><path d="M660 420 h44 l-8 60 h-28 z" fill="#ffd77a" stroke="{K}" stroke-width="5"/></g>
    <rect width="1080" height="1920" fill="url(#bxLamp)"/>
    <!-- плакат -->
    <g transform="rotate(-3 540 700)"><rect x="420" y="560" width="190" height="250" fill="#f4e7c3" stroke="{K}" stroke-width="6"/>
      <circle cx="515" cy="650" r="56" fill="none" stroke="#c0392b" stroke-width="12"/><path d="M475 690 L555 610" stroke="#c0392b" stroke-width="12"/>
      <text x="515" y="770" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="24" fill="#151515">НЕ КУРИТЬ</text></g>
    <!-- пол -->
    <rect y="1200" width="1080" height="720" fill="#55565c"/><path d="M0 1200 H1080" stroke="{K}" stroke-width="6"/>{spots}
    <!-- шланг и ведро -->
    <path d="M1080 1500 q-160 -40 -260 40 q-90 70 -200 20" fill="none" stroke="#2e86de" stroke-width="16" stroke-linecap="round"/>
    <g><path d="M880 1640 l14 120 h110 l14 -120 z" fill="#8e9aa6" stroke="{K}" stroke-width="6"/><path d="M880 1640 h138" stroke="{K}" stroke-width="8"/></g>
  </svg>
'''
open("bg_box.svg.part", "w").write(box)
print("ok")
