# python3 gen_bgs26.py → ещё два новых фона для части 5 «Бот против бота» (v2 — с уникальными событиями, владелец 09.11):
# bg_spalnya (спальня Жоры на рассвете: кровать с леопардовым пледом, будильник, постер «Мерседеса», цепь на лампе),
# bg_bankomat (улица у отделения банка: фасад «БАНК», банкомат с козырьком, табличка «очередь», урна, лужи)
import random
K = "#000"
random.seed(40)
HEAD = '  <svg id="bg" width="1080" height="1920" viewBox="0 0 1080 1920" style="position:absolute;left:0;top:0">\n'
F = 'font-family="Unbounded" font-weight="900"'
M = 'font-family="JetBrains Mono" font-weight="800"'
spalnya = HEAD + f'''    <rect width="1080" height="1920" fill="#6b5a8a"/>
    <g stroke="#62527f" stroke-width="10">{"".join(f'<path d="M{x} 0 V1000"/>' for x in range(40, 1080, 80))}</g>
    <!-- окно с рассветом -->
    <g><rect x="620" y="180" width="380" height="420" rx="16" fill="#ffb37a" stroke="{K}" stroke-width="8"/><circle cx="810" cy="520" r="70" fill="#ffe07a"/>
      <path d="M810 180 v420 M620 390 h380" stroke="{K}" stroke-width="7"/><path d="M600 170 q30 230 0 450 M1020 170 q-30 230 0 450" stroke="#c0392b" stroke-width="40" fill="none"/></g>
    <!-- постер «Мерседеса» -->
    <g transform="rotate(-3 300 330)"><rect x="110" y="200" width="380" height="260" fill="#f4f6f8" stroke="{K}" stroke-width="7"/><rect x="130" y="220" width="340" height="180" fill="#2b2f37"/>
      <path d="M170 360 l40 -50 h180 l40 50 z" fill="#c9a06b" stroke="{K}" stroke-width="5"/><text x="300" y="440" text-anchor="middle" {F} font-size="26" fill="#151515">МЕЧТА</text></g>
    <!-- тумбочка, будильник, лампа с цепью -->
    <g><rect x="40" y="820" width="200" height="180" fill="#8a5a33" stroke="{K}" stroke-width="7"/><rect x="80" y="740" width="110" height="80" rx="20" fill="#ff3b30" stroke="{K}" stroke-width="6"/>
      <text x="135" y="795" text-anchor="middle" {M} font-size="30" fill="#fff">7:02</text>
      <path d="M200 820 v-120" stroke="{K}" stroke-width="8"/><path d="M160 700 h80 l-14 -60 h-52 z" fill="#ffd23f" stroke="{K}" stroke-width="6"/>
      <path d="M170 700 q30 40 60 0" stroke="#e8c547" stroke-width="7" fill="none"/></g>
    <!-- кровать с леопардовым пледом -->
    <g><rect x="260" y="760" width="800" height="120" rx="16" fill="#5b3a26" stroke="{K}" stroke-width="8"/><rect x="280" y="880" width="780" height="140" fill="#e0b25a" stroke="{K}" stroke-width="8"/>
      {"".join(f'<ellipse cx="{x}" cy="{y}" rx="18" ry="11" fill="#5a3a1a" opacity=".85"/>' for x, y in [(330 + i * 70 + (j % 2) * 35, 905 + j * 36) for i in range(11) for j in range(3)])}</g>
    <!-- пол -->
    <rect y="1020" width="1080" height="900" fill="#8a6d48"/><path d="M0 1020 H1080" stroke="{K}" stroke-width="7"/>
    <g stroke="#7a5f3e" stroke-width="5">{"".join(f'<path d="M{x} 1020 l-60 900"/>' for x in range(60, 1200, 110))}</g>
  </svg>
'''
bankomat = HEAD + f'''    <rect width="1080" height="1920" fill="#c9d6e3"/>
    <!-- фасад отделения -->
    <g><rect x="40" y="220" width="1000" height="780" fill="#e8ecf0" stroke="{K}" stroke-width="8"/><rect x="40" y="220" width="1000" height="130" fill="#1f6b3a" stroke="{K}" stroke-width="8"/>
      <text x="540" y="310" text-anchor="middle" {F} font-size="72" fill="#fff">БАНК</text>
      <rect x="90" y="420" width="320" height="400" fill="#9fc3e0" stroke="{K}" stroke-width="7"/><path d="M250 420 v400" stroke="{K}" stroke-width="5"/>
      <!-- банкомат -->
      <g><rect x="560" y="430" width="300" height="570" fill="#2b2f37" stroke="{K}" stroke-width="8"/><rect x="540" y="400" width="340" height="50" fill="#1f6b3a" stroke="{K}" stroke-width="6"/>
        <rect x="600" y="480" width="220" height="150" fill="#7fd6a0" stroke="{K}" stroke-width="6"/><text x="710" y="560" text-anchor="middle" {M} font-size="26" fill="#151515">ОПЛАТА ЖКХ…</text>
        <g fill="#9aa3ad">{"".join(f'<rect x="{620 + i * 62}" y="{660 + j * 50}" width="48" height="36" rx="6"/>' for i in range(3) for j in range(3))}</g>
        <rect x="620" y="830" width="180" height="20" fill="#151515"/><text x="710" y="420" text-anchor="middle" {M} font-size="24" fill="#fff">24 ЧАСА</text></g>
      <rect x="900" y="520" width="110" height="80" fill="#ffd23f" stroke="{K}" stroke-width="5"/><text x="955" y="570" text-anchor="middle" {F} font-size="16" fill="#151515">ОЧЕРЕДЬ</text></g>
    <!-- урна -->
    <g><path d="M460 1000 l10 -110 h70 l10 110 z" fill="#5b6068" stroke="{K}" stroke-width="6"/></g>
    <!-- тротуар, лужи -->
    <rect y="1000" width="1080" height="920" fill="#8d949c"/><path d="M0 1000 H1080" stroke="{K}" stroke-width="7"/>
    <g stroke="#7d848c" stroke-width="5">{"".join(f'<path d="M{x} 1000 l-40 920"/>' for x in range(60, 1200, 120))}</g>
    {"".join(f'<ellipse cx="{x}" cy="{y}" rx="{rx}" ry="16" fill="#aec4d8" opacity=".7"/>' for x, y, rx in [(240, 1260, 140), (820, 1420, 120), (480, 1720, 180)])}
  </svg>
'''
for n, s in (("spalnya", spalnya), ("bankomat", bankomat)): open(f"bg_{n}.svg.part", "w").write(s)
print("ok")
