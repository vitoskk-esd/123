# python3 gen_bgs30.py → bg_gostinaya (серия «60 секунд на осмотр», начало: дом Вики вечером, владелец 10.11) — современная гостиная
# вечером: диван, торшер, телевизор на тумбе, окно с ночным городом, полка с цветком и фото, светлые стены (без ковра на стене)
import random
K = "#000"
random.seed(44)
HEAD = '  <svg id="bg" width="1080" height="1920" viewBox="0 0 1080 1920" style="position:absolute;left:0;top:0">\n'
gostinaya = HEAD + f'''    <rect width="1080" height="1920" fill="#e9dccb"/>
    <rect y="0" width="1080" height="1000" fill="#d9c9b4"/><path d="M0 230 H1080" stroke="#cbb9a2" stroke-width="10"/>
    <!-- окно с ночным городом -->
    <g><rect x="620" y="290" width="400" height="430" rx="10" fill="#141a33" stroke="{K}" stroke-width="8"/>
      {"".join(f'<rect x="{x}" y="{y}" width="{w}" height="{720 - y}" fill="#1f2648"/>' for x, y, w in [(630, 520, 90), (730, 470, 110), (850, 540, 80), (940, 500, 70)])}
      {"".join(f'<rect x="{random.randint(640, 990)}" y="{random.randint(490, 700)}" width="12" height="16" fill="#ffd27a" opacity="{random.choice([.4, .8])}"/>' for _ in range(26))}
      <circle cx="700" cy="360" r="28" fill="#f4f0d0"/><path d="M820 290 v430 M620 505 h400" stroke="{K}" stroke-width="6"/>
      <path d="M600 280 q20 230 0 460 M1040 280 q-20 230 0 460" stroke="#7fa8a0" stroke-width="44" fill="none"/></g>
    <!-- полка с цветком и фото -->
    <g><rect x="80" y="380" width="380" height="20" fill="#8a5a33" stroke="{K}" stroke-width="5"/>
      <rect x="110" y="290" width="80" height="90" fill="#fff" stroke="{K}" stroke-width="5"/><rect x="120" y="300" width="60" height="60" fill="#9fc3e0"/>
      <path d="M380 380 v-30 h50 v30" fill="#c0392b" stroke="{K}" stroke-width="5"/><path d="M405 350 q-30 -60 0 -90 q30 30 0 90 M405 350 q40 -40 30 -80" fill="#3fae4f" stroke="{K}" stroke-width="4"/></g>
    <!-- телевизор на тумбе -->
    <g><rect x="90" y="520" width="380" height="230" rx="10" fill="#151515" stroke="{K}" stroke-width="7"/><rect x="106" y="536" width="348" height="198" fill="#2b4a7a" opacity=".7"/>
      <rect x="60" y="860" width="440" height="140" fill="#8a5a33" stroke="{K}" stroke-width="7"/><path d="M280 750 v110" stroke="{K}" stroke-width="10"/></g>
    <!-- торшер -->
    <g><path d="M560 1000 V560" stroke="#2b2f37" stroke-width="10"/><path d="M500 560 h120 l-24 -90 h-72 z" fill="#ffe7a8" stroke="{K}" stroke-width="6"/>
      <ellipse cx="560" cy="600" rx="140" ry="40" fill="#fff2c8" opacity=".35"/></g>
    <!-- диван -->
    <g><rect x="620" y="800" width="440" height="200" rx="30" fill="#4f6b8a" stroke="{K}" stroke-width="8"/><rect x="600" y="760" width="480" height="90" rx="30" fill="#5d7c9e" stroke="{K}" stroke-width="7"/>
      <rect x="680" y="770" width="110" height="80" rx="16" fill="#ffd23f" stroke="{K}" stroke-width="5"/></g>
    <!-- пол — светлый ламинат -->
    <rect y="1000" width="1080" height="920" fill="#c9a77a"/><path d="M0 1000 H1080" stroke="{K}" stroke-width="7"/>
    <g stroke="#b8956a" stroke-width="5">{"".join(f'<path d="M0 {y} H1080"/>' for y in range(1080, 1920, 90))}</g>
  </svg>
'''
open("bg_gostinaya.svg.part", "w").write(gostinaya); print("ok")
