# python3 gen_bgs29.py → bg_aeroport (отдельная серия «60 секунд на осмотр», владелец 10.11): парковка у терминала аэропорта днём —
# стеклянный терминал с вывеской «АЭРОПОРТ», табло вылетов на фасаде, самолёт в небе, тележки для багажа, шлагбаум парковки, разметка
import random
K = "#000"
random.seed(43)
HEAD = '  <svg id="bg" width="1080" height="1920" viewBox="0 0 1080 1920" style="position:absolute;left:0;top:0">\n'
F = 'font-family="Unbounded" font-weight="900"'
M = 'font-family="JetBrains Mono" font-weight="800"'
rows = [("SU 1402", "СОЧИ", "ПОСАДКА", "#4cd964"), ("DP 405", "КАЗАНЬ", "ПО РАСПИС.", "#fff"), ("S7 2031", "НОВОСИБ.", "РЕГИСТР.", "#ffd23f")]
aeroport = HEAD + f'''    <defs><linearGradient id="apSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7fb8e8"/><stop offset="1" stop-color="#dcecf8"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#apSky)"/>
    <!-- самолёт и облака -->
    <ellipse cx="200" cy="160" rx="150" ry="36" fill="#fff" opacity=".85"/><ellipse cx="880" cy="230" rx="120" ry="30" fill="#fff" opacity=".8"/>
    <g transform="rotate(-12 760 120)"><path d="M620 120 h260 q30 0 30 14 t-30 14 h-260 z" fill="#f4f6f8" stroke="{K}" stroke-width="5"/>
      <path d="M720 120 l-60 -60 h40 l80 60 z M720 148 l-60 60 h40 l80 -60 z" fill="#d6dde4" stroke="{K}" stroke-width="5"/><path d="M630 120 l-30 -36 h30 l26 36 z" fill="#c0392b" stroke="{K}" stroke-width="4"/></g>
    <!-- стеклянный терминал -->
    <g><path d="M0 420 Q540 300 1080 420 V1000 H0 Z" fill="#5f8fb5" stroke="{K}" stroke-width="8"/>
      <g stroke="#2b4a66" stroke-width="6">{"".join(f'<path d="M{x} 380 V1000"/>' for x in range(60, 1080, 120))}{"".join(f'<path d="M0 {y} H1080"/>' for y in (560, 700, 840))}</g>
      {"".join(f'<rect x="{x + 6}" y="{y + 6}" width="108" height="128" fill="#bfe0f5" opacity="{random.choice([.18, .35, .5])}"/>' for x in range(0, 1080, 120) for y in (560, 700, 840))}
      <rect x="290" y="440" width="500" height="90" rx="12" fill="#151515" stroke="{K}" stroke-width="6"/><text x="540" y="505" text-anchor="middle" {F} font-size="56" fill="#fff">АЭРОПОРТ</text></g>
    <!-- табло вылетов на фасаде -->
    <g id="board"><rect x="560" y="580" width="460" height="230" rx="10" fill="#0d0e12" stroke="{K}" stroke-width="7"/>
      <text x="580" y="620" {M} font-size="24" fill="#8b93a3">ВЫЛЕТ · DEPARTURES</text>
      {"".join(f'<text x="580" y="{665 + i * 50}" {M} font-size="26" fill="#ffd23f">{a}</text><text x="720" y="{665 + i * 50}" {M} font-size="26" fill="#fff">{b}</text><text x="1005" y="{665 + i * 50}" text-anchor="end" {M} font-size="24" fill="{c}">{s}</text>' for i, (a, b, s, c) in enumerate(rows))}</g>
    <!-- тележки и шлагбаум -->
    <g>{"".join(f'<g><path d="M{x} 990 h90 l14 -70 M{x + 10} 920 h80" stroke="#9aa3ad" stroke-width="8" fill="none"/><circle cx="{x + 12}" cy="996" r="9" fill="#151515"/><circle cx="{x + 82}" cy="996" r="9" fill="#151515"/></g>' for x in (70, 180))}</g>
    <g><rect x="960" y="900" width="60" height="110" fill="#e8ecf0" stroke="{K}" stroke-width="6"/><path d="M990 920 H700" stroke="#ff3b30" stroke-width="16"/><path d="M740 920 h50 M840 920 h50" stroke="#fff" stroke-width="16"/></g>
    <!-- асфальт парковки -->
    <rect y="1000" width="1080" height="920" fill="#62686f"/><path d="M0 1000 H1080" stroke="{K}" stroke-width="8"/><rect y="1000" width="1080" height="40" fill="#b9c2c9"/>
    <g stroke="#fff" stroke-width="9">{"".join(f'<path d="M{x} 1080 l-60 260"/>' for x in range(160, 1080, 240))}</g>
    <text x="540" y="1700" text-anchor="middle" {F} font-size="60" fill="#7b828a">P2</text>
  </svg>
'''
open("bg_aeroport.svg.part", "w").write(aeroport); print("ok")
