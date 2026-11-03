// Новые машины для серий с 22-й: седан бизнес-класса (Camry-подобный) и полицейская ДПС-раскраска на нём, эвакуатор-платформа.
// Рисунок в стиле сериала: толстый чёрный контур, плоские цвета, блик. Вид сбоку, мордой вправо.
(() => {
  const K = "#151515";
  const shade = (hex, k) => { const n = parseInt(hex.slice(1), 16), c = [n >> 16, (n >> 8) & 255, n & 255].map(v => Math.max(0, Math.min(255, Math.round(v * k))));
    return "#" + c.map(v => v.toString(16).padStart(2, "0")).join(""); };
  const wheel = (cx, cy, rim) => `<g><circle cx="${cx}" cy="${cy}" r="62" fill="#1c1c20" stroke="${K}" stroke-width="8"/>
    <circle cx="${cx}" cy="${cy}" r="40" fill="${rim}" stroke="${K}" stroke-width="5"/>
    ${[0, 72, 144, 216, 288].map(a => `<path d="M${cx} ${cy} l0 -36" stroke="${shade(rim, .6)}" stroke-width="9" stroke-linecap="round" transform="rotate(${a} ${cx} ${cy})"/>`).join("")}
    <circle cx="${cx}" cy="${cy}" r="10" fill="${shade(rim, .5)}" stroke="${K}" stroke-width="3"/></g>`;

  // o: {color, rim, glass, police, plate, sticker}
  CHARS.sedan = (p, o = {}) => {
    const c = o.color || "#16181d", rim = o.rim || "#c9ced6", g = o.glass || "#2a3446", dk = shade(c, .72), lt = shade(c, 1.35);
    const police = o.police ? `<path d="M150 214 L860 214 L862 246 L148 246 Z" fill="#1d4fb8"/>
      <text x="470" y="292" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="46" fill="#1d4fb8">ДПС</text>
      <g><rect x="380" y="56" width="180" height="26" rx="10" fill="#2a2d34" stroke="${K}" stroke-width="5"/>
        <rect id="${p}-lr" x="386" y="60" width="80" height="18" rx="6" fill="#ff3b30"/><rect id="${p}-lb" x="474" y="60" width="80" height="18" rx="6" fill="#2e86de"/></g>` : "";
    return `<svg viewBox="0 0 1000 380" class="car" id="${p}">
 <ellipse cx="500" cy="356" rx="440" ry="18" fill="rgba(0,0,0,.28)"/>
 <path d="M40 270 C40 228 62 206 110 198 L250 176 C300 120 360 86 440 82 L640 84 C710 88 770 130 820 178 L920 196 C960 204 978 228 976 262 L972 300 C970 316 958 322 942 322 L60 322 C46 322 40 312 40 298 Z" fill="${c}" stroke="${K}" stroke-width="9" stroke-linejoin="round"/>
 <path d="M60 300 L960 300" stroke="${dk}" stroke-width="16" opacity=".6"/>
 <path d="M90 214 C300 200 700 200 940 210" stroke="${lt}" stroke-width="7" fill="none" opacity=".55"/>
 <path d="M282 178 C330 126 380 100 440 98 L520 98 L520 182 Z" fill="${g}" stroke="${K}" stroke-width="7" stroke-linejoin="round"/>
 <path d="M540 98 L636 100 C690 104 740 140 780 182 L540 182 Z" fill="${g}" stroke="${K}" stroke-width="7" stroke-linejoin="round"/>
 <path d="M300 170 L360 118 M560 170 L610 116" stroke="#ffffff" stroke-width="10" opacity=".22" stroke-linecap="round"/>
 <path d="M530 98 V318 M300 182 C296 240 300 290 306 318 M780 182 C786 240 784 290 778 318" stroke="${dk}" stroke-width="5" fill="none"/>
 <rect x="440" y="208" width="54" height="10" rx="5" fill="${lt}" stroke="${K}" stroke-width="3"/><rect x="640" y="208" width="54" height="10" rx="5" fill="${lt}" stroke="${K}" stroke-width="3"/>
 <path d="M905 214 C930 214 958 222 968 238 L922 240 Z" fill="#fff6d6" stroke="${K}" stroke-width="5"/>
 <path d="M46 228 L86 222 L84 250 L44 252 Z" fill="#e53935" stroke="${K}" stroke-width="5"/>
 <rect x="925" y="262" width="46" height="22" rx="4" fill="#fff" stroke="${K}" stroke-width="4"/>
 ${police}
 ${wheel(220, 318, rim)}${wheel(800, 318, rim)}
</svg>`;
  };

  // эвакуатор-платформа, вид сбоку мордой вправо; на платформу ставим машины отдельно
  CHARS.flatbed = (p) => `<svg viewBox="0 0 1200 420" id="${p}">
 <ellipse cx="600" cy="396" rx="560" ry="18" fill="rgba(0,0,0,.28)"/>
 <path d="M60 250 L900 250 L900 300 L60 300 Z" fill="#e67e22" stroke="${K}" stroke-width="9"/>
 <path d="M60 250 L20 300 L60 300 Z" fill="#d35400" stroke="${K}" stroke-width="7"/>
 <path d="M900 140 L1060 140 C1110 140 1150 180 1156 240 L1160 330 L900 330 Z" fill="#f4f6f8" stroke="${K}" stroke-width="9" stroke-linejoin="round"/>
 <path d="M960 160 L1060 160 C1090 160 1116 190 1120 230 L960 230 Z" fill="#2a3446" stroke="${K}" stroke-width="6"/>
 <rect x="930" y="110" width="140" height="30" rx="10" fill="#ff9f0a" stroke="${K}" stroke-width="5"/>
 <path d="M60 300 L1160 300 L1160 330 L60 330 Z" fill="#2b2f37" stroke="${K}" stroke-width="7"/>
 <text x="480" y="290" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="34" fill="#151515">ЭВАКУАТОР 24/7</text>
 ${[200, 360, 1040].map(x => wheel(x, 340, "#9aa3ab")).join("")}
</svg>`;
})();
