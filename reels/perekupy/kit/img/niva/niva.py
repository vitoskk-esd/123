# python3 niva.py → niva_side.svg (вид сбоку, мордой влево) и niva_34.svg (3/4 спереди): салатовая Нива 3-дв. по картинке владельца (10.11),
# стёкла — дырки в кузове (evenodd) и полупрозрачные: за ними виден водитель; нарисована вектором в стиле сериала (чёрный контур 7 px), т. к. исходник пришёл только картинкой в чат.
K = "#151515"; G = "#7cb518"; GD = "#5e8f10"; GL = "#9bd13a"; GL2 = "#cfe8f5"


def wheel(cx, cy, r=92):
    lugs = "".join(f'<circle cx="{cx + 30 * __import__("math").cos(a)}" cy="{cy + 30 * __import__("math").sin(a)}" r="6" fill="#8a929b"/>' for a in [i * 1.2566 for i in range(5)])
    tread = "".join(f'<rect x="{cx - 6}" y="{cy - r - 4}" width="12" height="16" rx="3" fill="#2b2b2e" transform="rotate({i * 20} {cx} {cy})"/>' for i in range(18))
    return (f'{tread}<circle cx="{cx}" cy="{cy}" r="{r}" fill="#2b2b2e" stroke="{K}" stroke-width="7"/><circle cx="{cx}" cy="{cy}" r="{r * .56}" fill="#d6dbe0" stroke="{K}" stroke-width="6"/>'
            f'{"".join(f"<circle cx=\"{cx + r * .38 * __import__("math").cos(a)}\" cy=\"{cy + r * .38 * __import__("math").sin(a)}\" r=\"7\" fill=\"#9aa3ad\" stroke=\"{K}\" stroke-width=\"2\"/>" for a in [i * .785 for i in range(8)])}'
            f'<circle cx="{cx}" cy="{cy}" r="{r * .2}" fill="#8a929b" stroke="{K}" stroke-width="5"/>{lugs}')


side = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 470">
  <ellipse cx="500" cy="440" rx="470" ry="22" fill="#000" opacity=".28"/>
  <!-- кузов -->
  <path fill-rule="evenodd" d="M40 300 Q36 250 70 236 L300 214 L372 108 Q384 92 410 92 L860 90 Q890 92 900 120 L930 230 Q944 250 944 300 L944 352 L40 352 Z
    M318 214 L386 118 Q392 110 404 110 L540 110 L540 214 Z M560 110 L830 110 Q852 112 856 132 L866 214 L560 214 Z" fill="{G}" stroke="{K}" stroke-width="8" stroke-linejoin="round"/>
  <path d="M70 236 L300 214" stroke="{GL}" stroke-width="6"/><path d="M60 262 H930" stroke="{GD}" stroke-width="4"/>
  <!-- арки -->
  <path d="M120 352 Q130 232 236 232 Q342 232 352 352 Z" fill="{GD}" stroke="{K}" stroke-width="7"/>
  <path d="M640 352 Q650 232 756 232 Q862 232 872 352 Z" fill="{GD}" stroke="{K}" stroke-width="7"/>
  <!-- стёкла -->
  <path d="M318 214 L386 118 Q392 110 404 110 L540 110 L540 214 Z" fill="{GL2}" fill-opacity=".6" stroke="{K}" stroke-width="7" stroke-linejoin="round"/>
  <path d="M560 110 L830 110 Q852 112 856 132 L866 214 L560 214 Z" fill="{GL2}" fill-opacity=".6" stroke="{K}" stroke-width="7" stroke-linejoin="round"/>
  <path d="M340 200 L400 124 M600 200 L660 124" stroke="#fff" stroke-width="9" opacity=".6"/>
  <!-- дверь, ручка, зеркало, вентиляция -->
  <path d="M310 218 L310 346 M548 106 L548 346" stroke="{K}" stroke-width="6"/><rect x="480" y="232" width="50" height="12" rx="6" fill="#d6dbe0" stroke="{K}" stroke-width="4"/>
  <path d="M330 200 l-34 -8 v-24 l40 6 z" fill="#2b2b2e" stroke="{K}" stroke-width="5"/>
  {"".join(f'<path d="M{884 + i * 4} {150 + i * 16} l8 2" stroke="{K}" stroke-width="6" stroke-linecap="round"/>' for i in range(3))}
  <!-- молдинг-порог, бамперы, фары, поворотник -->
  <rect x="120" y="340" width="760" height="18" fill="#2b2b2e" stroke="{K}" stroke-width="5"/>
  <rect x="14" y="320" width="96" height="36" rx="8" fill="#2b2b2e" stroke="{K}" stroke-width="6"/><rect x="900" y="320" width="80" height="36" rx="8" fill="#2b2b2e" stroke="{K}" stroke-width="6"/>
  <rect x="40" y="258" width="18" height="40" rx="4" fill="#2b2b2e" stroke="{K}" stroke-width="4"/><rect x="934" y="250" width="18" height="44" rx="4" fill="#d9362b" stroke="{K}" stroke-width="4"/>
  <rect x="80" y="252" width="20" height="10" fill="#ffb02e" stroke="{K}" stroke-width="3"/>
  <path d="M896 356 v54 h22 v-54" fill="#2b2b2e" stroke="{K}" stroke-width="5"/>
  <!-- колёса -->
  {wheel(236, 360)}{wheel(756, 360)}
</svg>'''
open("niva_side.svg", "w").write(side)
print("ok")
