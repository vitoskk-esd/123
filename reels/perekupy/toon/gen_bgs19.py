# python3 gen_bgs19.py → фон двадцать первого набора (ep31 «Продаю сам»):
# bg_metro (у метро днём: павильон входа с красной «М», ларёк «ЦВЕТЫ», остановка, урна, голуби, парковка вдоль тротуара)
import random
K = "#000"
random.seed(33)
HEAD = '  <svg id="bg" width="1080" height="1920" viewBox="0 0 1080 1920" style="position:absolute;left:0;top:0">\n'
birds = "".join(f'<g><ellipse cx="{x}" cy="{y}" rx="20" ry="13" fill="#8e9aa6" stroke="{K}" stroke-width="4"/><circle cx="{x + 16}" cy="{y - 10}" r="8" fill="#8e9aa6" stroke="{K}" stroke-width="4"/></g>'
                for x, y in [(160, 1160), (230, 1172), (880, 1150)])
metro = HEAD + f'''    <defs><linearGradient id="mtSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fbde6"/><stop offset="1" stop-color="#e4eef6"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#mtSky)"/><ellipse cx="260" cy="200" rx="120" ry="34" fill="#fff"/><ellipse cx="860" cy="280" rx="100" ry="28" fill="#fff"/>
    <!-- дома вдали -->
    {"".join(f'<rect x="{x}" y="{y}" width="{w}" height="{1000 - y}" fill="{c}" stroke="{K}" stroke-width="5"/>' for x, y, w, c in [(0, 520, 220, "#c9c2b6"), (230, 460, 260, "#b8c2cc"), (720, 500, 360, "#cfc6b8")])}
    <g fill="#7fa6c4">{"".join(f'<rect x="{x}" y="{y}" width="34" height="44"/>' for x in (30, 90, 150, 260, 330, 400, 760, 830, 900, 970) for y in (560, 640, 720, 800))}</g>
    <!-- павильон метро -->
    <g><rect x="340" y="640" width="400" height="360" fill="#dfe4ea" stroke="{K}" stroke-width="7"/><path d="M320 640 L540 560 L760 640 Z" fill="#9aa3ab" stroke="{K}" stroke-width="7"/>
      <circle cx="540" cy="720" r="58" fill="#fff" stroke="{K}" stroke-width="6"/><text x="540" y="752" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="80" fill="#d6243a">М</text>
      <rect x="420" y="800" width="240" height="200" fill="#2b2f37" stroke="{K}" stroke-width="6"/><path d="M540 800 V1000" stroke="#9aa3ab" stroke-width="6"/></g>
    <!-- ларёк «ЦВЕТЫ» -->
    <g><rect x="40" y="820" width="250" height="180" fill="#f4f6f8" stroke="{K}" stroke-width="6"/><rect x="30" y="790" width="270" height="50" fill="#2f7a3a" stroke="{K}" stroke-width="6"/>
      <text x="165" y="826" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="28" fill="#fff">ЦВЕТЫ</text>
      <rect x="60" y="860" width="210" height="90" fill="#cfe9f5" stroke="{K}" stroke-width="4"/>{"".join(f'<circle cx="{x}" cy="930" r="14" fill="{c}" stroke="{K}" stroke-width="3"/>' for x, c in [(90, "#ff3b30"), (130, "#ffd23f"), (170, "#ff3b30"), (210, "#f4f6f8"), (245, "#ffd23f")])}</g>
    <!-- остановка -->
    <g><rect x="800" y="780" width="240" height="20" fill="#2b2f37"/><path d="M810 800 V1000 M1030 800 V1000" stroke="#2b2f37" stroke-width="12"/>
      <rect x="830" y="820" width="180" height="120" fill="#cfe9f5" stroke="{K}" stroke-width="5" opacity=".8"/><rect x="960" y="700" width="60" height="60" rx="30" fill="#ffd23f" stroke="{K}" stroke-width="5"/>
      <text x="990" y="742" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="30" fill="#151515">А</text></g>
    <!-- тротуар, бордюр, парковка -->
    <rect y="1000" width="1080" height="220" fill="#c3c8cf"/><path d="M0 1000 H1080" stroke="{K}" stroke-width="6"/>
    <g stroke="#aab0b8" stroke-width="5">{"".join(f'<path d="M{x} 1000 v220"/>' for x in range(0, 1080, 90))}</g>
    <rect y="1220" width="1080" height="700" fill="#6b7078"/><path d="M0 1220 H1080" stroke="{K}" stroke-width="8"/>
    <g stroke="#fff" stroke-width="8">{"".join(f'<path d="M{x} 1240 l-40 200"/>' for x in range(120, 1080, 260))}</g>
    <g><rect x="620" y="1090" width="44" height="80" rx="8" fill="#5b6068" stroke="{K}" stroke-width="5"/></g>{birds}
  </svg>
'''
open("bg_metro.svg.part", "w").write(metro)
print("ok")
