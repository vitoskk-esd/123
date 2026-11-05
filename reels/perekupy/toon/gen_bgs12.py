# python3 gen_bgs12.py → фоны четырнадцатого набора (ep26 «Подборщик»):
# bg_cafe (кофейня днём: стойка, кофемашина, меловая доска-меню, лампы, столик у окна), bg_lot (автоплощадка «С ПРОБЕГОМ»: гирлянда
# флажков, будка-офис, таблички «КРЕДИТ 0%», «ОБМЕН», «ТРЕЙД-ИН», асфальт)
import random
K = "#000"
random.seed(26)
HEAD = '  <svg id="bg" width="1080" height="1920" viewBox="0 0 1080 1920" style="position:absolute;left:0;top:0">\n'

# ---------- кофейня
cafe = HEAD + f'''    <rect width="1080" height="1920" fill="#f1e4d0"/>
    <g opacity=".5" stroke="#e2cfb1" stroke-width="6">{"".join(f'<path d="M{x} 0 V1080"/>' for x in range(0, 1080, 90))}</g>
    <!-- меловая доска -->
    <g><rect x="60" y="250" width="440" height="330" rx="10" fill="#2f3a33" stroke="#7a4a24" stroke-width="14"/>
      <text x="280" y="320" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="38" fill="#f4f6f8">МЕНЮ</text>
      {"".join(f'<text x="100" y="{y}" font-family="Onest" font-weight="800" font-size="30" fill="#f4f6f8">{t}</text><text x="460" y="{y}" text-anchor="end" font-family="Onest" font-weight="800" font-size="30" fill="#ffd23f">{p}</text>' for y, t, p in [(380, "Капучино", "220"), (430, "Раф", "260"), (480, "Латте", "240"), (530, "Круассан", "190")])}</g>
    <!-- окно -->
    <rect x="580" y="230" width="440" height="520" fill="#cfe8f5" stroke="#7a4a24" stroke-width="14"/><path d="M800 230 V750 M580 490 H1020" stroke="#7a4a24" stroke-width="10"/>
    <g opacity=".8"><rect x="600" y="560" width="190" height="170" fill="#a7c4a0"/><rect x="820" y="520" width="180" height="210" fill="#c6a98a"/></g>
    <!-- лампы -->
    {"".join(f'<g><path d="M{x} 0 V150" stroke="#2b2b2e" stroke-width="5"/><path d="M{x - 50} 150 h100 l-30 -50 h-40 z" fill="#2b2b2e" stroke="{K}" stroke-width="4"/><circle cx="{x}" cy="165" r="16" fill="#ffe9a8"/><circle cx="{x}" cy="200" r="120" fill="#ffe9a8" opacity=".15"/></g>' for x in (300, 780))}
    <!-- стойка с кофемашиной -->
    <rect x="0" y="860" width="1080" height="60" fill="#7a4a24" stroke="{K}" stroke-width="7"/><rect x="0" y="920" width="1080" height="160" fill="#8b5a2b" stroke="{K}" stroke-width="7"/>
    <g><rect x="80" y="700" width="220" height="160" rx="14" fill="#c9ced6" stroke="{K}" stroke-width="7"/><rect x="110" y="730" width="160" height="40" rx="8" fill="#2b2f37"/>
      <path d="M150 800 v30 M230 800 v30" stroke="{K}" stroke-width="10"/><rect x="170" y="824" width="40" height="36" rx="4" fill="#fff" stroke="{K}" stroke-width="4"/></g>
    {"".join(f'<g><rect x="{x}" y="810" width="44" height="50" rx="6" fill="#fff" stroke="{K}" stroke-width="4"/><path d="M{x + 44} 822 q18 4 0 24" stroke="{K}" stroke-width="4" fill="none"/></g>' for x in (380, 450))}
    <!-- пол -->
    <rect y="1080" width="1080" height="840" fill="#b98b5e"/><g stroke="#a3784e" stroke-width="5">{"".join(f'<path d="M0 {y} H1080"/>' for y in range(1140, 1920, 70))}</g>
    <path d="M0 1080 H1080" stroke="{K}" stroke-width="7"/>
  </svg>
'''

# ---------- автоплощадка
flags = "".join(f'<path d="M{x} {300 + abs(((x // 60) % 6) - 3) * 8} l30 0 l-15 40 z" fill="{("#ff3b30", "#ffd23f", "#2e86de", "#4cd964")[(x // 60) % 4]}" stroke="{K}" stroke-width="3"/>' for x in range(0, 1080, 60))
lot = HEAD + f'''    <defs><linearGradient id="ltSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fc3ee"/><stop offset="1" stop-color="#e3f1fb"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#ltSky)"/><ellipse cx="260" cy="150" rx="120" ry="34" fill="#fff"/>
    <!-- столбы и гирлянда флажков -->
    <path d="M20 1080 V260 M1060 1080 V260" stroke="#4a4e58" stroke-width="16"/><path d="M20 290 Q540 340 1060 290" stroke="#2b2f37" stroke-width="5" fill="none"/>{flags}
    <!-- будка-офис -->
    <g><rect x="580" y="560" width="440" height="520" fill="#f4f6f8" stroke="{K}" stroke-width="8"/><rect x="560" y="520" width="480" height="60" fill="#ff3b30" stroke="{K}" stroke-width="7"/>
      <text x="800" y="563" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="34" fill="#fff">АВТО С ПРОБЕГОМ</text>
      <rect x="620" y="640" width="170" height="160" fill="#bfe3ff" stroke="{K}" stroke-width="6"/><rect x="830" y="640" width="150" height="440" fill="#c9ced6" stroke="{K}" stroke-width="6"/>
      <circle cx="850" cy="870" r="8" fill="#4a4e58"/></g>
    <!-- таблички -->
    {"".join(f'<g transform="rotate({r} {x + 110} {y + 40})"><rect x="{x}" y="{y}" width="220" height="80" rx="10" fill="{bg}" stroke="{K}" stroke-width="6"/><text x="{x + 110}" y="{y + 52}" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="28" fill="{fg}">{t}</text></g>'
             for x, y, t, bg, fg, r in [(60, 420, "КРЕДИТ 0%*", "#ffd23f", "#151515", -4), (320, 470, "ОБМЕН", "#2e86de", "#fff", 3), (100, 620, "ТРЕЙД-ИН", "#4cd964", "#151515", -2)])}
    <path d="M170 700 V1080 M430 550 V1080" stroke="#4a4e58" stroke-width="10"/>
    <!-- асфальт -->
    <rect y="1080" width="1080" height="840" fill="#6b7078"/><path d="M0 1080 H1080" stroke="{K}" stroke-width="6"/>
    <g stroke="#fff" stroke-width="10">{"".join(f'<path d="M{x} 1100 l-30 260"/>' for x in range(100, 1080, 300))}</g>
    <g fill="#5b6068" opacity=".7"><ellipse cx="300" cy="1600" rx="200" ry="20"/><ellipse cx="820" cy="1750" rx="160" ry="16"/></g>
  </svg>
'''

for n, s in [("cafe", cafe), ("lot", lot)]:
    open(f"bg_{n}.svg.part", "w").write(s)
print("ok")
