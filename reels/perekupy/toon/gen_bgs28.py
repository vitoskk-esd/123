# python3 gen_bgs28.py → bg_pereezd (замена причала в части 6 по просьбе владельца 09.11): железнодорожный переезд на окраине осенью —
# рельсы на шпалах, красно-белый шлагбаум, светофор с двумя красными огнями, будка дежурной, столбы с проводами, жёлтые деревья, грунтовка
import random
K = "#000"
random.seed(42)
HEAD = '  <svg id="bg" width="1080" height="1920" viewBox="0 0 1080 1920" style="position:absolute;left:0;top:0">\n'
F = 'font-family="Unbounded" font-weight="900"'
pereezd = HEAD + f'''    <defs><linearGradient id="pzSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9cc3e6"/><stop offset="1" stop-color="#e6eef5"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#pzSky)"/><ellipse cx="260" cy="220" rx="170" ry="44" fill="#fff" opacity=".85"/><ellipse cx="820" cy="160" rx="130" ry="36" fill="#fff" opacity=".8"/>
    <!-- жёлтые деревья вдали -->
    {"".join(f'<g><path d="M{x} 760 v-90" stroke="#6b4a2a" stroke-width="14"/><circle cx="{x}" cy="{650 - h}" r="{70 + h // 2}" fill="{c}" stroke="{K}" stroke-width="6"/></g>' for x, h, c in [(80, 30, "#e0a03a"), (240, 0, "#c9822a"), (900, 20, "#e0a03a"), (1030, 40, "#d4902e")])}
    <!-- столбы с проводами -->
    {"".join(f'<g><path d="M{x} 900 V330" stroke="#6b5a4a" stroke-width="16"/><path d="M{x - 50} 360 h100" stroke="#6b5a4a" stroke-width="12"/></g>' for x in (380, 760))}
    <path d="M0 380 Q190 420 380 362 T760 362 T1080 380 M0 400 Q190 440 380 382 T760 382 T1080 400" stroke="#2b2f37" stroke-width="4" fill="none"/>
    <!-- будка дежурной -->
    <g><rect x="560" y="560" width="200" height="200" fill="#e8c547" stroke="{K}" stroke-width="7"/><path d="M540 570 L660 500 L780 570 Z" fill="#c0392b" stroke="{K}" stroke-width="7"/>
      <rect x="600" y="610" width="120" height="80" fill="#9fc3e0" stroke="{K}" stroke-width="5"/><path d="M660 610 v80" stroke="{K}" stroke-width="4"/></g>
    <!-- светофор переезда с двумя красными -->
    <g><path d="M980 1000 V560" stroke="#2b2f37" stroke-width="16"/><path d="M920 600 h120" stroke="#2b2f37" stroke-width="12"/>
      {"".join(f'<g><circle cx="{x}" cy="640" r="34" fill="#151515" stroke="{K}" stroke-width="5"/><circle cx="{x}" cy="640" r="22" fill="#ff3b30" style="filter:drop-shadow(0 0 14px #ff3b30)"/></g>' for x in (930, 1030))}
      <path d="M940 700 l80 60 M1020 700 l-80 60" stroke="#fff" stroke-width="16"/><path d="M940 700 l80 60 M1020 700 l-80 60" stroke="#c0392b" stroke-width="16" stroke-dasharray="20 20"/></g>
    <!-- шлагбаум поднят -->
    <g><rect x="40" y="840" width="70" height="160" fill="#e8ecf0" stroke="{K}" stroke-width="6"/><g transform="rotate(-62 75 860)"><rect x="75" y="846" width="560" height="28" fill="#fff" stroke="{K}" stroke-width="5"/>{"".join(f'<rect x="{75 + k * 80}" y="846" width="40" height="28" fill="#c0392b"/>' for k in range(7))}</g></g>
    <!-- насыпь и рельсы -->
    <rect y="760" width="1080" height="240" fill="#9a8f80"/><path d="M0 760 H1080" stroke="{K}" stroke-width="6"/>
    <g fill="#6b4a2a" stroke="{K}" stroke-width="3">{"".join(f'<rect x="{x}" y="850" width="34" height="90"/>' for x in range(10, 1080, 64))}</g>
    <path d="M0 870 H1080 M0 920 H1080" stroke="#5b6068" stroke-width="12"/><path d="M0 866 H1080 M0 916 H1080" stroke="#c9ced4" stroke-width="4"/>
    <!-- грунтовка с лужами и листьями -->
    <rect y="1000" width="1080" height="920" fill="#a08a6a"/><path d="M0 1000 H1080" stroke="{K}" stroke-width="7"/>
    <path d="M330 1000 L750 1000 L1080 1920 L0 1920 Z" fill="#8a8f96"/><path d="M330 1000 L0 1920 M750 1000 L1080 1920" stroke="#6f747b" stroke-width="6"/>
    {"".join(f'<ellipse cx="{x}" cy="{y}" rx="{rx}" ry="16" fill="#9fb8d0" opacity=".7"/>' for x, y, rx in [(420, 1300, 120), (700, 1560, 150)])}
    {"".join(f'<ellipse cx="{random.randint(20, 1060)}" cy="{random.randint(1020, 1880)}" rx="9" ry="5" fill="{random.choice(["#e0a03a", "#c9822a", "#ff7a1a"])}"/>' for _ in range(40))}
  </svg>
'''
open("bg_pereezd.svg.part", "w").write(pereezd); print("ok")
