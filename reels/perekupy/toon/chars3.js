// «Жизнь одной Приоры»: сама Приора — персонаж (глаз-фара, рот на бампере, эмоции), реквизит: шашки такси, столб, эвакуатор.
(function () {
  const K = "#151515";
  // Приора сбоку: CHARS.car + лицо (глаз на передней фаре, рот на бампере), шашки такси, вмятина, заплатки, дым
  // Кузов ВАЗ-2170 «Приора» сбоку по пропорциям (4,35 × 1,42 м, база 2,49 м): высокий короткий багажник,
  // характерная линия окон, чёрные ручки и зеркала, молдинг, штампованные диски с колпаками, эмблема-ладья.
  CHARS.prioraBody = (p, body = "#e9ecef", glass = "#1b2230") => {
    const wheel = x => `<g class="${p}-wheel" style="transform-origin:${x}px 285px"><circle cx="${x}" cy="285" r="56" fill="#1f2023" stroke="${K}" stroke-width="8"/>
      <circle cx="${x}" cy="285" r="36" fill="#c9ced6" stroke="${K}" stroke-width="5"/>${[0, 1, 2, 3, 4, 5].map(i => `<circle cx="${x + 22 * Math.cos(i * 1.047)}" cy="${285 + 22 * Math.sin(i * 1.047)}" r="6" fill="#7d838c"/>`).join("")}
      <circle cx="${x}" cy="285" r="10" fill="#7d838c" stroke="${K}" stroke-width="3"/></g>`;
    return `<svg viewBox="0 0 900 360" class="car" id="${p}">
 <ellipse cx="460" cy="338" rx="400" ry="16" fill="rgba(0,0,0,.28)"/>
 <path d="M862 236 L864 206 Q862 190 846 184 L760 172 Q700 166 642 158 L560 86 Q545 74 520 72 L392 72 Q372 74 360 84 L272 148 L196 150 Q160 152 152 164 L148 244 Q150 296 170 300 L166 300 A70 70 0 0 1 298 300 L634 300 A70 70 0 0 1 766 300 L848 300 Q866 296 864 268 Z"
   fill="${body}" stroke="${K}" stroke-width="8" stroke-linejoin="round"/>
 <!-- стёкла: лобовое, передняя и задняя двери, тонировка -->
 <path d="M628 160 L552 92 Q544 86 530 86 L478 86 L478 160 Z" fill="${glass}" stroke="${K}" stroke-width="6" stroke-linejoin="round"/>
 <path d="M466 160 L466 86 L398 86 Q384 88 374 96 L306 152 L304 160 Z" fill="${glass}" stroke="${K}" stroke-width="6" stroke-linejoin="round"/>
 <path d="M630 158 L560 92" stroke="#3a4250" stroke-width="5"/>
 <path d="M478 84 V300 M300 160 V298 M632 160 V300" stroke="${K}" stroke-width="5"/>
 <!-- молдинг, ручки, зеркало, лючок бака -->
 <path d="M158 232 H860" stroke="#2b2d31" stroke-width="12"/>
 <rect x="580" y="182" width="34" height="12" rx="5" fill="#1b1b1d"/><rect x="420" y="182" width="34" height="12" rx="5" fill="#1b1b1d"/>
 <path d="M624 162 q-6 -22 18 -26 l14 2 q4 14 -6 22 z" fill="#1b1b1d" stroke="${K}" stroke-width="5" stroke-linejoin="round"/>
 <rect x="212" y="176" width="34" height="28" rx="6" fill="none" stroke="#9aa1a8" stroke-width="4"/>
 <!-- оптика: фара, поворотник, фонарь; бамперы и эмблема-ладья -->
 <path d="M864 198 L812 192 Q800 194 802 210 L862 216 Z" fill="#dfe8f2" stroke="${K}" stroke-width="5" stroke-linejoin="round"/>
 <rect x="836" y="218" width="24" height="10" rx="4" fill="#ffb703" stroke="${K}" stroke-width="3"/>
 <path d="M152 170 L194 168 L192 204 L150 206 Z" fill="#d62828" stroke="${K}" stroke-width="5" stroke-linejoin="round"/><path d="M152 186 H192" stroke="#ff9f9f" stroke-width="4"/>
 <path d="M150 248 Q152 292 172 298 L298 298" fill="none" stroke="#3a3c40" stroke-width="10"/>
 <path d="M766 298 L846 298 Q864 292 863 254" fill="none" stroke="#3a3c40" stroke-width="10"/>
 <ellipse cx="862" cy="240" rx="6" ry="9" fill="#c9ced6" stroke="${K}" stroke-width="3"/>
 <path d="M196 150 L272 148" stroke="${K}" stroke-width="5"/>
 ${wheel(232)}${wheel(700)}
</svg>`;
  };

  CHARS.priora = (p, o = {}) => {
    const body = o.color || "#e9ecef";
    let s = CHARS.prioraBody(p, body, o.glass || "#1b2230").replace(/<\/svg>\s*$/, "");
    if (o.patch) s += `<path d="M480 162 H630 V226 H480 Z M480 238 H630 V296 H480 Z" fill="#c0392b" opacity=".9" stroke="${K}" stroke-width="5"/>
      <path d="M636 160 L760 174 Q800 180 800 196 L800 296 L770 296 A70 70 0 0 0 640 296 Z" fill="#2f5d9c" opacity=".9" stroke="${K}" stroke-width="5"/>
      <g stroke="#ffd23f" stroke-width="5" stroke-dasharray="10 8"><path d="M478 160 v138 M634 160 v138"/></g>`;
    if (o.taxi) s += `<g id="${p}-taxi"><rect x="420" y="28" width="110" height="44" rx="8" fill="#ffd23f" stroke="${K}" stroke-width="6"/>
      <g fill="${K}">${[0, 1, 2, 3, 4].map(i => `<rect x="${424 + i * 21}" y="${i % 2 ? 32 : 50}" width="20" height="18"/>`).join("")}</g></g>
      <g fill="${K}">${Array.from({ length: 16 }, (_, i) => `<rect x="${300 + i * 20}" y="${242 + (i % 2) * 10}" width="10" height="10"/>`).join("")}</g>`;
    if (o.dent) s += `<path d="M846 186 q-30 30 -14 60 q10 20 -6 50" fill="none" stroke="${K}" stroke-width="7"/><path d="M790 196 l40 10 M796 262 l30 -6" stroke="#9aa1a8" stroke-width="5"/>`;
    // лицо: глаз-фара спереди справа, рот на бампере
    const eye = o.eye || "open";
    s += `<g id="${p}-face">
      <circle cx="832" cy="203" r="27" fill="#fff" stroke="${K}" stroke-width="6"/>
      ${eye === "dead" ? `<path d="M818 189 l28 28 M846 189 l-28 28" stroke="${K}" stroke-width="7" stroke-linecap="round"/>`
        : eye === "sly" ? `<circle cx="838" cy="208" r="10" fill="${K}"/><path d="M804 194 q30 -16 58 0" stroke="${K}" stroke-width="8" fill="none"/>`
        : `<circle cx="840" cy="203" r="11" fill="${K}"/><circle cx="844" cy="198" r="4" fill="#fff"/>`}
      <path d="M810 170 q22 -12 44 -2" stroke="${K}" stroke-width="7" fill="none" stroke-linecap="round" ${eye === "sad" ? 'transform="rotate(14 832 168)"' : ""}/>
      ${o.mouth === "o" ? `<ellipse cx="848" cy="270" rx="10" ry="12" fill="#5a1e1e" stroke="${K}" stroke-width="5"/>`
        : o.mouth === "sad" ? `<path d="M830 280 q18 -14 34 0" stroke="${K}" stroke-width="7" fill="none" stroke-linecap="round"/>`
        : `<path d="M828 266 q18 16 34 0" stroke="${K}" stroke-width="7" fill="none" stroke-linecap="round"/>`}
    </g>`;
    if (o.smoke) s += `<g fill="#d9dde2" stroke="${K}" stroke-width="5">${[[740, 130, 34], [780, 90, 44], [840, 54, 54]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join("")}</g>`;
    return s + "</svg>";
  };
  // столб: прямой или погнутый
  CHARS.pole = (bent = false) => `<svg viewBox="0 0 200 700"><path d="${bent ? "M100 700 V360 q0 -80 60 -140 l20 -20" : "M100 700 V40"}" stroke="#6b7280" stroke-width="30" fill="none" stroke-linecap="round"/>
    <path d="${bent ? "M180 200 h-60" : "M100 40 h70"}" stroke="#6b7280" stroke-width="16" stroke-linecap="round"/><ellipse cx="${bent ? 120 : 170}" cy="${bent ? 210 : 50}" rx="26" ry="12" fill="#ffe7a8"/></svg>`;
  // эвакуатор
  CHARS.tow = () => `<svg viewBox="0 0 1100 420"><rect x="40" y="200" width="760" height="40" fill="#e67e22" stroke="${K}" stroke-width="8"/>
    <path d="M800 120 h170 q40 0 50 40 l20 80 h-240 z" fill="#e67e22" stroke="${K}" stroke-width="8" stroke-linejoin="round"/><path d="M830 140 h110 l20 60 h-130 z" fill="#9cc7e6" stroke="${K}" stroke-width="6"/>
    <rect x="890" y="96" width="70" height="20" rx="6" fill="#ffd23f" stroke="${K}" stroke-width="5"/>
    ${[160, 340, 880].map(x => `<circle cx="${x}" cy="290" r="54" fill="#2b2b2e" stroke="${K}" stroke-width="8"/><circle cx="${x}" cy="290" r="22" fill="#c7cbd0"/>`).join("")}
    <rect x="40" y="240" width="1000" height="34" fill="#c35f12" stroke="${K}" stroke-width="6"/></svg>`;
})();
