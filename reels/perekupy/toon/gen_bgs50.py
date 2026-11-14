# python3 gen_bgs50.py → фоны для ep58 «Экстрасенс» (киношный формат):
# bg_salonmaga (салон экстрасенса: бархатные шторы, свечи, круглый стол со скатертью, звёзды и знаки зодиака на стене, череп-подсвечник),
# bg_avtobaza (автобаза таксопарка днём: ворота с жёлтыми полосами, ряд боксов, шлагбаум, будка диспетчера, асфальт с масляными пятнами),
# bg_trassatambov (придорожная стоянка вечером: указатель «Тамбов», кафе «Шашлык», поле, столб, гравий)
import random
K = "#000"
HEAD = '  <svg id="bg" width="1080" height="1920" viewBox="0 0 1080 1920" style="position:absolute;left:0;top:0">\n'
F = 'font-family="Unbounded" font-weight="900"'
M = 'font-family="JetBrains Mono" font-weight="800"'
R = random.randint

random.seed(141)
salonmaga = HEAD + f'''    <rect width="1080" height="1920" fill="#1a0f2a"/>
    <!-- бархатные шторы -->
    {"".join(f'<path d="M{x} 0 q{R(-20, 20)} 600 0 1240 h70 q{R(-20, 20)} -640 0 -1240 z" fill="{"#5a1a4a" if k % 2 else "#4a1240"}"/>' for k, x in enumerate(range(-20, 1100, 70)))}
    <path d="M0 0 H1080 V120 Q540 220 0 120 Z" fill="#6a1a3a" stroke="#e6b422" stroke-width="6"/>
    {"".join(f'<circle cx="{x}" cy="{150 + (x % 3) * 8}" r="9" fill="#e6b422"/>' for x in range(40, 1080, 80))}
    <!-- звёзды и знаки зодиака -->
    {"".join(f'<path d="M{x} {y} l6 14 l15 2 l-11 10 l3 15 l-13 -8 l-13 8 l3 -15 l-11 -10 l15 -2 z" fill="#e6b422" opacity="{R(5, 9) / 10}"/>' for x, y in ((180, 320), (900, 280), (760, 460), (300, 520), (540, 300)))}
    <circle cx="540" cy="520" r="170" fill="none" stroke="#e6b422" stroke-width="5" opacity=".6"/><circle cx="540" cy="520" r="130" fill="none" stroke="#e6b422" stroke-width="3" opacity=".5"/>
    {"".join(f'<text x="{540 + 150 * __import__("math").cos(k * 0.5236):.0f}" y="{530 + 150 * __import__("math").sin(k * 0.5236):.0f}" text-anchor="middle" font-size="30" fill="#e6b422" opacity=".7">{s}</text>' for k, s in enumerate("♈♉♊♋♌♍♎♏♐♑♒♓"))}
    <!-- полки со свечами -->
    {"".join(f'<rect x="{x}" y="820" width="180" height="16" fill="#3a2010" stroke="{K}" stroke-width="4"/>' + "".join(f'<rect x="{x + 20 + j * 55}" y="{760 - j * 12}" width="26" height="{60 + j * 12}" fill="#f1e6d2" stroke="{K}" stroke-width="3"/><path d="M{x + 33 + j * 55} {752 - j * 12} q-8 -16 0 -30 q8 14 0 30 z" fill="#ffb84a"/>' for j in range(3)) for x in (60, 840))}
    <!-- пол -->
    <rect y="1240" width="1080" height="680" fill="#2a1630"/><path d="M0 1240 H1080" stroke="{K}" stroke-width="7"/>
    {"".join(f'<path d="M{x} 1240 L{x - 260} 1920" stroke="#3a1e40" stroke-width="5"/>' for x in range(0, 1500, 150))}
  </svg>
'''

random.seed(142)
avtobaza = HEAD + f'''    <defs><linearGradient id="ab" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9cc8e8"/><stop offset="1" stop-color="#e8f2f8"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#ab)"/>
    <!-- ряд боксов -->
    <rect x="-20" y="560" width="1120" height="560" fill="#b8b0a0" stroke="{K}" stroke-width="6"/>
    {"".join(f'<rect x="{x}" y="700" width="220" height="420" fill="#6b7480" stroke="{K}" stroke-width="5"/>' + "".join(f'<path d="M{x} {y} h220" stroke="#5b6470" stroke-width="4"/>' for y in range(740, 1120, 40)) + f'<text x="{x + 110}" y="670" text-anchor="middle" {M} font-size="40" fill="#151515">{n}</text>' for x, n in ((40, "07"), (300, "08"), (560, "09"), (820, "10")))}
    <rect x="-20" y="520" width="1120" height="60" fill="#ffd23f" stroke="{K}" stroke-width="6"/>{"".join(f'<path d="M{x} 520 l40 60 h40 l-40 -60 z" fill="#151515"/>' for x in range(-20, 1100, 120))}
    <!-- будка диспетчера и шлагбаум -->
    <rect x="760" y="900" width="260" height="300" fill="#e8e2d0" stroke="{K}" stroke-width="6"/><rect x="790" y="940" width="200" height="110" fill="#bfe3f5" stroke="{K}" stroke-width="5"/>
    <text x="890" y="1110" text-anchor="middle" {F} font-size="28" fill="#151515">ДИСПЕТЧЕР</text>
    <rect x="720" y="1100" width="30" height="160" fill="#5b6670"/><path d="M750 1120 H360" stroke="#c0392b" stroke-width="18" stroke-dasharray="50 40"/>
    <!-- асфальт -->
    <rect y="1200" width="1080" height="720" fill="#6a6e76"/><path d="M0 1200 H1080" stroke="{K}" stroke-width="7"/>
    {"".join(f'<ellipse cx="{R(60, 1020)}" cy="{R(1280, 1880)}" rx="{R(50, 130)}" ry="{R(10, 22)}" fill="#3a3d44" opacity=".7"/>' for _ in range(9))}
    {"".join(f'<path d="M{x} 1500 h140" stroke="#f4f6f8" stroke-width="12" opacity=".7"/>' for x in range(-40, 1080, 260))}
  </svg>
'''

random.seed(143)
trassatambov = HEAD + f'''    <defs><linearGradient id="tt" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a3a7a"/><stop offset=".55" stop-color="#ff9a6a"/><stop offset="1" stop-color="#ffd8a8"/></linearGradient></defs>
    <rect width="1080" height="1920" fill="url(#tt)"/>
    <!-- поле и лесополоса -->
    <rect y="900" width="1080" height="300" fill="#8a9a4a"/>{"".join(f'<circle cx="{x}" cy="{R(880, 905)}" r="{R(30, 55)}" fill="#3e5a2a"/>' for x in range(-20, 1100, 45))}
    <!-- указатель -->
    <path d="M150 1200 V760" stroke="#5b6670" stroke-width="14"/><path d="M370 1200 V760" stroke="#5b6670" stroke-width="14"/>
    <rect x="90" y="640" width="340" height="140" fill="#2f6db5" stroke="#f4f6f8" stroke-width="8"/>
    <text x="260" y="700" text-anchor="middle" {F} font-size="46" fill="#f4f6f8">ТАМБОВ</text><text x="260" y="755" text-anchor="middle" {M} font-size="34" fill="#f4f6f8">12 км →</text>
    <!-- кафе -->
    <rect x="560" y="700" width="460" height="500" fill="#c9a26a" stroke="{K}" stroke-width="6"/><path d="M530 720 L790 600 L1050 720 Z" fill="#8a3a2a" stroke="{K}" stroke-width="6"/>
    <rect x="600" y="760" width="380" height="80" fill="#c0392b" stroke="{K}" stroke-width="5"/><text x="790" y="815" text-anchor="middle" {F} font-size="44" fill="#ffd23f">ШАШЛЫК</text>
    <rect x="620" y="880" width="140" height="120" fill="#ffd8a8" stroke="{K}" stroke-width="5"/><rect x="820" y="880" width="140" height="320" fill="#5a3820" stroke="{K}" stroke-width="5"/>
    <!-- гравий -->
    <rect y="1200" width="1080" height="720" fill="#a89c84"/><path d="M0 1200 H1080" stroke="{K}" stroke-width="7"/>
    {"".join(f'<circle cx="{R(0, 1080)}" cy="{R(1220, 1910)}" r="{R(3, 7)}" fill="#7e735e" opacity=".8"/>' for _ in range(170))}
  </svg>
'''

for n, s in (("salonmaga", salonmaga), ("avtobaza", avtobaza), ("trassatambov", trassatambov)):
    open(f"bg_{n}.svg.part", "w").write(s)
print("ok")
