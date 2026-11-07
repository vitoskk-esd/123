# python3 gen_bgs21.py → ещё два новых фона для сериала «Толян: со ста тысяч» (владелец 07.11: в каждой серии — новые фоны, локации и люди):
# bg_podezd (двор у подъезда днём: козырёк, домофон, лавочка, клумба из шины, ведро с водой), bg_vokzal (площадь у вокзала: здание с часами, такси, голуби, урна)
import random
K = "#000"
random.seed(35)
HEAD = '  <svg id="bg" width="1080" height="1920" viewBox="0 0 1080 1920" style="position:absolute;left:0;top:0">\n'
podezd = HEAD + f'''    <rect width="1080" height="1920" fill="#bcd9ee"/><ellipse cx="820" cy="180" rx="120" ry="34" fill="#fff"/>
    <rect x="0" y="260" width="1080" height="760" fill="#d9c9a8" stroke="{K}" stroke-width="7"/>
    <g fill="#8fb4cf" stroke="{K}" stroke-width="5">{"".join(f'<rect x="{x}" y="{y}" width="120" height="110"/>' for x in (40, 230, 760, 920) for y in (300, 460))}</g>
    <!-- подъезд: козырёк, дверь, домофон -->
    <g><path d="M400 640 h300 l30 50 h-360 z" fill="#8e9aa6" stroke="{K}" stroke-width="7"/><rect x="460" y="690" width="180" height="330" fill="#7a4a24" stroke="{K}" stroke-width="7"/>
      <rect x="660" y="760" width="40" height="70" rx="6" fill="#2b2f37" stroke="{K}" stroke-width="4"/><circle cx="680" cy="780" r="6" fill="#4cd964"/>
      <rect x="490" y="610" width="120" height="30" fill="#1f4fb8" stroke="{K}" stroke-width="4"/><text x="550" y="633" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="20" fill="#fff">ПОДЪЕЗД 3</text></g>
    <!-- лавочка и клумба из шины -->
    <g><rect x="90" y="930" width="240" height="22" fill="#7a5a36" stroke="{K}" stroke-width="5"/><rect x="90" y="890" width="240" height="20" fill="#7a5a36" stroke="{K}" stroke-width="5"/><path d="M110 952 v60 M310 952 v60" stroke="{K}" stroke-width="8"/></g>
    <g><ellipse cx="880" cy="1000" rx="110" ry="36" fill="#2b2b2e" stroke="{K}" stroke-width="6"/><ellipse cx="880" cy="992" rx="80" ry="22" fill="#6b4a2a"/>{"".join(f'<circle cx="{850 + i * 20}" cy="{968 - (i % 2) * 14}" r="14" fill="{c}" stroke="{K}" stroke-width="3"/>' for i, c in enumerate(["#ff3b30", "#ffd23f", "#fff", "#ff7a1a"]))}</g>
    <!-- асфальт двора -->
    <rect y="1020" width="1080" height="900" fill="#7c828a"/><path d="M0 1020 H1080" stroke="{K}" stroke-width="7"/>
    {"".join(f'<ellipse cx="{random.randint(60, 1020)}" cy="{random.randint(1150, 1880)}" rx="{random.randint(50, 130)}" ry="{random.randint(10, 24)}" fill="#6b7178" opacity=".7"/>' for _ in range(8))}
    <g><path d="M60 1560 l18 120 h110 l18 -120 z" fill="#2e86de" stroke="{K}" stroke-width="6"/><path d="M60 1560 h146" stroke="{K}" stroke-width="8"/><ellipse cx="133" cy="1562" rx="70" ry="10" fill="#bfe6ff"/></g>
  </svg>
'''
birds = "".join(f'<g><ellipse cx="{x}" cy="{y}" rx="20" ry="13" fill="#8e9aa6" stroke="{K}" stroke-width="4"/><circle cx="{x + 16}" cy="{y - 10}" r="8" fill="#8e9aa6" stroke="{K}" stroke-width="4"/></g>' for x, y in [(120, 1180), (190, 1190), (950, 1170)])
vokzal = HEAD + f'''    <defs><linearGradient id="vkSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6b26b"/><stop offset="1" stop-color="#fde3c3"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#vkSky)"/>
    <!-- здание вокзала с часами -->
    <g><rect x="80" y="520" width="920" height="480" fill="#e8d6b8" stroke="{K}" stroke-width="8"/><path d="M60 520 L540 360 L1020 520 Z" fill="#c0653a" stroke="{K}" stroke-width="8"/>
      <circle cx="540" cy="460" r="62" fill="#fff" stroke="{K}" stroke-width="7"/><path d="M540 460 V418 M540 460 L572 476" stroke="{K}" stroke-width="7" stroke-linecap="round"/>
      {"".join(f'<path d="M{x} 1000 V640 q60 -70 120 0 V1000" fill="#8fb4cf" stroke="{K}" stroke-width="6"/>' for x in (140, 340, 620, 820))}
      <rect x="300" y="560" width="480" height="54" fill="#1f4fb8" stroke="{K}" stroke-width="5"/><text x="540" y="598" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="34" fill="#fff">ВОКЗАЛ</text></g>
    <!-- площадь, такси -->
    <rect y="1000" width="1080" height="920" fill="#a9aeb5"/><path d="M0 1000 H1080" stroke="{K}" stroke-width="7"/>
    <g stroke="#979ca3" stroke-width="5">{"".join(f'<path d="M0 {y} H1080"/>' for y in range(1060, 1920, 80))}{"".join(f'<path d="M{x + (y // 80 % 2) * 60} {y} v80" />' for y in range(1000, 1920, 80) for x in range(0, 1080, 120))}</g>
    <g><rect x="760" y="1030" width="290" height="110" rx="28" fill="#ffd23f" stroke="{K}" stroke-width="6"/><rect x="800" y="1010" width="200" height="50" rx="16" fill="#ffd23f" stroke="{K}" stroke-width="6"/>
      <rect x="860" y="990" width="80" height="26" fill="#151515"/><text x="900" y="1010" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="18" fill="#ffd23f">TAXI</text>
      <circle cx="820" cy="1140" r="26" fill="#151515"/><circle cx="990" cy="1140" r="26" fill="#151515"/></g>
    <g><rect x="40" y="1060" width="44" height="80" rx="8" fill="#5b6068" stroke="{K}" stroke-width="5"/></g>{birds}
  </svg>
'''
open("bg_podezd.svg.part", "w").write(podezd); open("bg_vokzal.svg.part", "w").write(vokzal); print("ok")
