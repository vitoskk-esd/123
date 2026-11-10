# python3 gen_bgs33.py → bg_ink (моушн-обзор бота, только инфографика, владелец 10.11): почти чёрный холст с тонкой сеткой и мягким оранжевым свечением
HEAD = '  <svg id="bg" width="1080" height="1920" viewBox="0 0 1080 1920" style="position:absolute;left:0;top:0">\n'
ink = HEAD + '''    <defs><radialGradient id="inkG" cx="50%" cy="42%" r="65%"><stop offset="0" stop-color="#1a1d24"/><stop offset="1" stop-color="#0c0d10"/></radialGradient></defs>
    <rect width="1080" height="1920" fill="url(#inkG)"/>
    <g stroke="#1f232b" stroke-width="2">''' + "".join(f'<path d="M{x} 0 V1920"/>' for x in range(0, 1080, 54)) + "".join(f'<path d="M0 {y} H1080"/>' for y in range(0, 1920, 54)) + '''</g>
    <ellipse cx="540" cy="820" rx="520" ry="420" fill="#ff7a1a" opacity=".05"/>
  </svg>
'''
open("bg_ink.svg.part", "w").write(ink); print("ok")
