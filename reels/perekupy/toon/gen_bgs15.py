# python3 gen_bgs15.py → фон семнадцатого набора (ep28 «Скриншот»):
# bg_embank (набережная вечером: река, мост с огнями, фонари, парапет, ларёк «КОФЕ», парковка у парапета)
import random
K = "#000"
random.seed(29)
HEAD = '  <svg id="bg" width="1080" height="1920" viewBox="0 0 1080 1920" style="position:absolute;left:0;top:0">\n'

lights = "".join(f'<circle cx="{x}" cy="{y}" r="5" fill="#ffd77a"/>' for x in range(30, 1080, 46) for y in (690,))
embank = HEAD + f'''    <defs><linearGradient id="ebSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2b3a7a"/><stop offset=".6" stop-color="#d9775a"/><stop offset="1" stop-color="#f3c27a"/></linearGradient>
      <radialGradient id="ebLamp" cx=".5" cy="0" r="1"><stop offset="0" stop-color="#ffe9a8" stop-opacity=".55"/><stop offset="1" stop-color="#ffe9a8" stop-opacity="0"/></radialGradient></defs>
    <rect width="1080" height="1920" fill="url(#ebSky)"/>
    <!-- дальний берег и мост -->
    <path d="M0 640 L120 600 L200 620 L320 560 L420 600 L560 540 L700 590 L820 550 L1080 600 V760 H0 Z" fill="#3a3358" stroke="{K}" stroke-width="4"/>
    {"".join(f'<rect x="{x}" y="{y}" width="12" height="16" fill="#ffd77a" opacity="{random.choice([.3, .9])}"/>' for x in range(20, 1060, 38) for y in (620, 660))}
    <g><path d="M0 690 Q540 600 1080 690" stroke="#1f2238" stroke-width="18" fill="none"/>{"".join(f'<path d="M{x} 760 V{690 - int(90 - abs(x - 540) / 6)}" stroke="#1f2238" stroke-width="10"/>' for x in range(60, 1080, 160))}{lights}</g>
    <!-- река -->
    <rect y="760" width="1080" height="300" fill="#2c4a7a"/>
    <g stroke="#f3c27a" stroke-width="5" opacity=".55">{"".join(f'<path d="M{x} {y} h{random.randint(30, 80)}"/>' for x, y in [(random.randint(0, 1000), random.randint(780, 1040)) for _ in range(26)])}</g>
    <!-- парапет -->
    <rect y="1040" width="1080" height="70" fill="#9aa3ab" stroke="{K}" stroke-width="6"/><g stroke="#7f8890" stroke-width="5">{"".join(f'<path d="M{x} 1040 V1110"/>' for x in range(0, 1080, 90))}</g>
    <!-- фонари -->
    {"".join(f'<g><path d="M{x} 1110 V620" stroke="#2b2f37" stroke-width="12"/><path d="M{x - 40} 620 h80 l-12 28 h-56 z" fill="#ffe9a8" stroke="{K}" stroke-width="5"/><path d="M{x} 648 L{x - 220} 1500 L{x + 220} 1500 Z" fill="url(#ebLamp)"/></g>' for x in (120, 960))}
    <!-- ларёк «КОФЕ» -->
    <g><rect x="640" y="880" width="260" height="230" fill="#e8ecf0" stroke="{K}" stroke-width="7"/><rect x="620" y="850" width="300" height="50" fill="#16a085" stroke="{K}" stroke-width="6"/>
      <text x="770" y="887" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="30" fill="#fff">КОФЕ 24</text>
      <rect x="670" y="920" width="200" height="110" fill="#ffd77a" stroke="{K}" stroke-width="5"/></g>
    <!-- брусчатка / парковка -->
    <rect y="1110" width="1080" height="810" fill="#6b7078"/><path d="M0 1110 H1080" stroke="{K}" stroke-width="6"/>
    <g stroke="#5b6068" stroke-width="4">{"".join(f'<path d="M0 {y} H1080"/>' for y in range(1170, 1920, 60))}{"".join(f'<path d="M{x + (y // 60 % 2) * 45} {y} v60"/>' for y in range(1110, 1920, 60) for x in range(0, 1080, 90))}</g>
  </svg>
'''
open("bg_embank.svg.part", "w").write(embank)
print("ok")
