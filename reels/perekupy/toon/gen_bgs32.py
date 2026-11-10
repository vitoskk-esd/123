# python3 gen_bgs32.py → bg_studio (ролик-объяснение «Как работает Перехват», владелец 10.11): студия-объяснялка — тёмно-синий фон с сеткой,
# неоновое оранжевое кольцо-радар, стол с ноутбуком, полка с машинками, светлый пол
import random
K = "#000"
random.seed(46)
HEAD = '  <svg id="bg" width="1080" height="1920" viewBox="0 0 1080 1920" style="position:absolute;left:0;top:0">\n'
studio = HEAD + f'''    <defs><radialGradient id="stG" cx="50%" cy="35%" r="70%"><stop offset="0" stop-color="#243a6b"/><stop offset="1" stop-color="#0d1530"/></radialGradient></defs>
    <rect width="1080" height="1920" fill="url(#stG)"/>
    <g stroke="#2c4378" stroke-width="2" opacity=".6">{"".join(f'<path d="M{x} 0 V1000"/>' for x in range(0, 1080, 60))}{"".join(f'<path d="M0 {y} H1080"/>' for y in range(0, 1000, 60))}</g>
    <!-- радар -->
    <g opacity=".9">{"".join(f'<circle cx="540" cy="560" r="{r}" fill="none" stroke="#ff7a1a" stroke-width="5" opacity="{o}"/>' for r, o in [(120, .9), (220, .55), (320, .3)])}
      <path d="M540 560 L540 240" stroke="#ff7a1a" stroke-width="6" opacity=".8"/>
      {"".join(f'<circle cx="{x}" cy="{y}" r="10" fill="#ffd23f" style="filter:drop-shadow(0 0 8px #ffd23f)"/>' for x, y in [(650, 420), (380, 640), (760, 690), (470, 330)])}</g>
    <!-- полка с машинками -->
    <g><rect x="60" y="300" width="220" height="16" fill="#8a5a33" stroke="{K}" stroke-width="4"/>{"".join(f'<rect x="{x}" y="270" width="54" height="30" rx="10" fill="{c}" stroke="{K}" stroke-width="4"/>' for x, c in [(70, "#c0392b"), (140, "#ffd23f"), (210, "#2e86de")])}</g>
    <!-- стол с ноутбуком -->
    <g><rect x="620" y="880" width="420" height="30" fill="#5b3a26" stroke="{K}" stroke-width="6"/><path d="M660 910 v90 M1000 910 v90" stroke="{K}" stroke-width="10"/>
      <path d="M720 880 l20 -110 h200 l20 110 z" fill="#2b2f37" stroke="{K}" stroke-width="6"/><rect x="752" y="786" width="176" height="80" fill="#ff7a1a" opacity=".85"/></g>
    <!-- пол -->
    <rect y="1000" width="1080" height="920" fill="#1b2442"/><path d="M0 1000 H1080" stroke="#ff7a1a" stroke-width="6" opacity=".7"/>
    <ellipse cx="540" cy="1500" rx="420" ry="60" fill="#ff7a1a" opacity=".08"/>
  </svg>
'''
open("bg_studio.svg.part", "w").write(studio); print("ok")
