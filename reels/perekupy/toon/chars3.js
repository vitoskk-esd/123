// «Жизнь одной Приоры»: сама Приора — персонаж (глаз-фара, рот на бампере, эмоции), реквизит: шашки такси, столб, эвакуатор.
(function () {
  const K = "#151515";
  // Приора сбоку: CHARS.car + лицо (глаз на передней фаре, рот на бампере), шашки такси, вмятина, заплатки, дым
  CHARS.priora = (p, o = {}) => {
    const body = o.color || "#e9ecef";
    let s = CHARS.car(p, .6, body, "#0b0d12").replace(/<\/svg>\s*$/, "");
    if (o.patch) s += `<path d="M454 158 h194 v118 h-194 z" fill="#c0392b" opacity=".85" stroke="${K}" stroke-width="5"/>
      <path d="M650 152 l120 22 q36 8 42 46 l0 50 h-162 z" fill="#2f5d9c" opacity=".85" stroke="${K}" stroke-width="5"/>
      <g stroke="#ffd23f" stroke-width="5" stroke-dasharray="10 8"><path d="M454 160 v118 M650 156 v118"/></g>`;
    if (o.taxi) s += `<g id="${p}-taxi"><rect x="400" y="40" width="110" height="44" rx="8" fill="#ffd23f" stroke="${K}" stroke-width="6"/>
      <g fill="${K}">${[0, 1, 2, 3, 4].map(i => `<rect x="${404 + i * 21}" y="${i % 2 ? 44 : 62}" width="20" height="18"/>`).join("")}</g>
      <path d="M440 84 v-6 M470 84 v-6" stroke="${K}" stroke-width="6"/></g>
      <path d="M248 180 h610" stroke="#ffd23f" stroke-width="14" opacity=".9"/>`;
    if (o.dent) s += `<path d="M770 170 q30 30 10 70 q-20 20 -30 60" fill="none" stroke="${K}" stroke-width="7"/><path d="M720 200 l40 10 M730 250 l30 -6" stroke="#9aa1a8" stroke-width="5"/>`;
    // лицо: глаз-фара спереди справа, рот на бампере
    const eye = o.eye || "open";
    s += `<g id="${p}-face">
      <circle cx="808" cy="206" r="30" fill="#fff" stroke="${K}" stroke-width="6"/>
      ${eye === "dead" ? `<path d="M792 190 l32 32 M824 190 l-32 32" stroke="${K}" stroke-width="7" stroke-linecap="round"/>`
        : eye === "sly" ? `<circle cx="814" cy="212" r="11" fill="${K}"/><path d="M776 196 q32 -18 64 0" stroke="${K}" stroke-width="8" fill="none"/>`
        : `<circle cx="816" cy="206" r="12" fill="${K}"/><circle cx="820" cy="201" r="4" fill="#fff"/>`}
      <path d="M786 172 q24 -14 48 -2" stroke="${K}" stroke-width="7" fill="none" stroke-linecap="round" ${eye === "sad" ? 'transform="rotate(14 810 170)"' : ""}/>
      ${o.mouth === "o" ? `<ellipse cx="846" cy="262" rx="12" ry="14" fill="#5a1e1e" stroke="${K}" stroke-width="5"/>`
        : o.mouth === "sad" ? `<path d="M826 270 q20 -16 40 0" stroke="${K}" stroke-width="7" fill="none" stroke-linecap="round"/>`
        : `<path d="M822 256 q22 18 44 0" stroke="${K}" stroke-width="7" fill="none" stroke-linecap="round"/>`}
    </g>`;
    if (o.smoke) s += `<g fill="#d9dde2" stroke="${K}" stroke-width="5">${[[700, 100, 34], [740, 60, 44], [800, 30, 54]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join("")}</g>`;
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
