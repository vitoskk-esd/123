// «Жизнь одной Приоры»: сама Приора — персонаж (глаз-фара, рот на бампере, эмоции), реквизит: шашки такси, столб, эвакуатор.
(function () {
  const K = "#151515";
  // Приора сбоку: CHARS.car + лицо (глаз на передней фаре, рот на бампере), шашки такси, вмятина, заплатки, дым
  // Кузов ВАЗ-2170 «Приора» седан сбоку (4,35 × 1,42 м, база 2,49 м, мелкие свесы). Узнаваемое: длинная фара, уходящая
  // по крылу назад; высокий короткий багажник с «утиным хвостиком»; большой фонарь, заходящий на бок; в задней двери —
  // маленькое неподвижное стекло-«форточка»; ручки и зеркала в цвет кузова.
  // pacan: чёрный глянец, тонировка в ноль, занижение (колёса в арках впритык), чёрное литьё с хромом, хромированная труба,
  // наклейка (STICKER) на стекле задней двери.
  CHARS.STICKER = CHARS.STICKER || "../../kit/img/sticker.png";
  CHARS.prioraBody = (p, body = "#e9ecef", glass = "#1b2230", o = {}) => {
    const low = o.pacan ? 14 : 0, R = o.pacan ? 58 : 54;
    const wy = 284 - (o.pacan ? 2 : 0);
    const wheel = x => o.pacan
      ? `<g class="${p}-wheel"><circle cx="${x}" cy="${wy}" r="${R}" fill="#141416" stroke="${K}" stroke-width="7"/>
         <circle cx="${x}" cy="${wy}" r="${R - 12}" fill="#2a2c31" stroke="#c9ced6" stroke-width="5"/>
         ${Array.from({ length: 10 }, (_, i) => `<path d="M${x} ${wy} L${x + (R - 15) * Math.cos(i * .628)} ${wy + (R - 15) * Math.sin(i * .628)}" stroke="#0e0f11" stroke-width="7" stroke-linecap="round"/>`).join("")}
         <circle cx="${x}" cy="${wy}" r="11" fill="#c9ced6" stroke="${K}" stroke-width="3"/></g>`
      : `<g class="${p}-wheel"><circle cx="${x}" cy="${wy}" r="${R}" fill="#1f2023" stroke="${K}" stroke-width="8"/>
         <circle cx="${x}" cy="${wy}" r="34" fill="#c9ced6" stroke="${K}" stroke-width="5"/>${[0, 1, 2, 3, 4, 5, 6, 7].map(i => `<rect x="${x - 3}" y="${wy - 30}" width="6" height="12" rx="2" fill="#8d939b" transform="rotate(${i * 45} ${x} ${wy})"/>`).join("")}
         <circle cx="${x}" cy="${wy}" r="9" fill="#8d939b" stroke="${K}" stroke-width="3"/></g>`;
    const y = v => v + low;                  // занижение: кузов ниже, колёса на месте
    const shine = o.pacan ? `<path d="M${200} ${y(176)} L${780} ${y(176)}" stroke="#ffffff" stroke-width="5" opacity=".35"/>
      <path d="M${560} ${y(104)} Q${470} ${y(86)} ${400} ${y(96)}" stroke="#ffffff" stroke-width="4" opacity=".3" fill="none"/>` : "";
    return `<svg viewBox="0 0 900 360" class="car" id="${p}">
 <ellipse cx="462" cy="338" rx="396" ry="14" fill="rgba(0,0,0,.3)"/>
 ${wheel(232)}${wheel(700)}
 <path d="M856 ${y(292)} Q872 ${y(286)} 870 ${y(252)} L868 ${y(224)} Q866 ${y(204)} 852 ${y(196)} L790 ${y(180)} Q720 ${y(168)} 640 ${y(160)}
   L560 ${y(92)} Q548 ${y(82)} 528 ${y(80)} L412 ${y(80)} Q394 ${y(82)} 382 ${y(92)} L300 ${y(150)} L206 ${y(152)} Q192 ${y(152)} 186 ${y(146)}
   L172 ${y(150)} Q160 ${y(156)} 160 ${y(172)} L158 ${y(252)} Q160 ${y(290)} 178 ${y(294)}
   L${232 - R - 8} ${y(294)} L${232 - R - 8} ${wy} A${R + 8} ${R + 8} 0 0 1 ${232 + R + 8} ${wy} L${232 + R + 8} ${y(294)}
   L${700 - R - 8} ${y(294)} L${700 - R - 8} ${wy} A${R + 8} ${R + 8} 0 0 1 ${700 + R + 8} ${wy} L${700 + R + 8} ${y(294)} Z"
   fill="${body}" stroke="${K}" stroke-width="8" stroke-linejoin="round"/>
 ${shine}
 <!-- стёкла: передняя дверь, задняя дверь с «форточкой» -->
 <path d="M630 ${y(160)} L556 ${y(96)} Q548 ${y(90)} 534 ${y(90)} L486 ${y(90)} L486 ${y(160)} Z" fill="${glass}" stroke="${K}" stroke-width="6" stroke-linejoin="round"/>
 <path d="M474 ${y(160)} L474 ${y(90)} L414 ${y(90)} Q398 ${y(92)} 388 ${y(100)} L316 ${y(156)} L316 ${y(160)} Z" fill="${glass}" stroke="${K}" stroke-width="6" stroke-linejoin="round"/>
 <path d="M362 ${y(118)} V${y(160)}" stroke="${K}" stroke-width="6"/>
 ${o.pacan && CHARS.STICKER ? `<image href="${CHARS.STICKER}" x="388" y="${y(102)}" width="66" height="60" opacity=".95"/>` : ""}
 <path d="M640 ${y(158)} L566 ${y(94)}" stroke="#4a5262" stroke-width="5" opacity=".7"/>
 <!-- двери, ручки, зеркало, лючок -->
 <path d="M480 ${y(84)} V${y(292)} M316 ${y(160)} V${y(290)} M636 ${y(160)} L640 ${y(292)}" stroke="${K}" stroke-width="5"/>
 <path d="M316 ${y(290)} H636" stroke="${K}" stroke-width="4" opacity=".6"/>
 <path d="M200 ${y(214)} H850" stroke="${K}" stroke-width="3" opacity=".35"/>
 <rect x="582" y="${y(176)}" width="36" height="12" rx="5" fill="${body}" stroke="${K}" stroke-width="4"/><rect x="424" y="${y(176)}" width="36" height="12" rx="5" fill="${body}" stroke="${K}" stroke-width="4"/>
 <path d="M628 ${y(162)} q-8 -24 16 -30 l18 4 q6 16 -6 24 z" fill="${o.pacan ? "#0e0f11" : body}" stroke="${K}" stroke-width="5" stroke-linejoin="round"/>
 <path d="M206 ${y(170)} h34 v26 h-34 z" fill="none" stroke="${K}" stroke-width="4" opacity=".55"/>
 <!-- длинная фара по крылу, ПТФ, фонарь с заходом на бок, бамперы -->
 <path d="M868 ${y(214)} L866 ${y(232)} L828 ${y(226)} Q800 ${y(212)} 784 ${y(190)} L852 ${y(198)} Q866 ${y(204)} 868 ${y(214)} Z" fill="#e9f1f8" stroke="${K}" stroke-width="5" stroke-linejoin="round"/>
 <path d="M842 ${y(206)} L800 ${y(198)}" stroke="#ffb703" stroke-width="6" stroke-linecap="round"/>
 <circle cx="852" cy="${y(270)}" r="9" fill="#f4f6f8" stroke="${K}" stroke-width="4"/>
 <path d="M160 ${y(168)} Q164 ${y(158)} 178 ${y(158)} L226 ${y(160)} Q232 ${y(184)} 222 ${y(200)} L162 ${y(204)} Z" fill="#d62828" stroke="${K}" stroke-width="5" stroke-linejoin="round"/>
 <path d="M166 ${y(182)} H222" stroke="#ff9f9f" stroke-width="4"/>
 <path d="M158 ${y(244)} Q160 ${y(288)} 180 ${y(292)} L${232 - R - 8} ${y(292)}" fill="none" stroke="${o.pacan ? "#0e0f11" : "#3a3c40"}" stroke-width="10"/>
 <path d="M${700 + R + 8} ${y(292)} L854 ${y(292)} Q870 ${y(286)} 869 ${y(250)}" fill="none" stroke="${o.pacan ? "#0e0f11" : "#3a3c40"}" stroke-width="10"/>
 <ellipse cx="868" cy="${y(240)}" rx="5" ry="8" fill="#c9ced6" stroke="${K}" stroke-width="3"/>
 ${o.pacan ? `<rect x="150" y="${y(286)}" width="40" height="14" rx="6" fill="#c9ced6" stroke="${K}" stroke-width="4"/>` : ""}
</svg>`;
  };

  CHARS.priora = (p, o = {}) => {
    const body = o.color || "#e9ecef";
    const pac = !!o.pacan, low = pac ? 14 : 0;
    let s = CHARS.prioraBody(p, pac ? "#16181d" : body, pac ? "#050608" : (o.glass || "#1b2230"), o).replace(/<\/svg>\s*$/, "");
    s += `<g transform="translate(0 ${low})">`;
    if (o.patch) s += `<path d="M484 162 H634 V290 H484 Z" fill="#c0392b" opacity=".9" stroke="${K}" stroke-width="5"/>
      <path d="M642 162 L760 172 Q786 176 790 190 L800 226 L800 288 L764 290 A64 64 0 0 0 642 290 Z" fill="#2f5d9c" opacity=".9" stroke="${K}" stroke-width="5"/>
      <g stroke="#ffd23f" stroke-width="5" stroke-dasharray="10 8"><path d="M484 160 v130 M638 160 v130"/></g>`;
    if (o.taxi) s += `<g id="${p}-taxi"><rect x="420" y="28" width="110" height="44" rx="8" fill="#ffd23f" stroke="${K}" stroke-width="6"/>
      <g fill="${K}">${[0, 1, 2, 3, 4].map(i => `<rect x="${424 + i * 21}" y="${i % 2 ? 32 : 50}" width="20" height="18"/>`).join("")}</g></g>
      <g fill="${K}">${Array.from({ length: 16 }, (_, i) => `<rect x="${300 + i * 20}" y="${242 + (i % 2) * 10}" width="10" height="10"/>`).join("")}</g>`;
    if (o.dent) s += `<path d="M846 186 q-30 30 -14 60 q10 20 -6 50" fill="none" stroke="${K}" stroke-width="7"/><path d="M790 196 l40 10 M796 262 l30 -6" stroke="#9aa1a8" stroke-width="5"/>`;
    // лицо: глаз-фара спереди справа, рот на бампере
    const eye = o.eye || "open";
    s += `<g id="${p}-face">
      <circle cx="836" cy="210" r="25" fill="#fff" stroke="${K}" stroke-width="6"/>
      ${eye === "dead" ? `<path d="M824 198 l24 24 M848 198 l-24 24" stroke="${K}" stroke-width="7" stroke-linecap="round"/>`
        : eye === "sly" ? `<circle cx="842" cy="214" r="10" fill="${K}"/><path d="M810 200 q28 -14 54 0" stroke="${K}" stroke-width="8" fill="none"/>`
        : `<circle cx="844" cy="210" r="10" fill="${K}"/><circle cx="848" cy="205" r="4" fill="#fff"/>`}
      <path d="M816 178 q22 -12 42 -2" stroke="${K}" stroke-width="7" fill="none" stroke-linecap="round" ${eye === "sad" ? 'transform="rotate(14 832 168)"' : ""}/>
      ${o.mouth === "o" ? `<ellipse cx="852" cy="262" rx="9" ry="11" fill="#5a1e1e" stroke="${K}" stroke-width="5"/>`
        : o.mouth === "sad" ? `<path d="M836 270 q16 -12 30 0" stroke="${K}" stroke-width="7" fill="none" stroke-linecap="round"/>`
        : `<path d="M834 258 q16 14 32 0" stroke="${K}" stroke-width="7" fill="none" stroke-linecap="round"/>`}
    </g>`;
    s += "</g>";
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
  // Приора спереди — «морда»: фары-капли (они же глаза), хромированная планка решётки с ладьёй (рот), бампер с
  // туманками и сеткой, номер. o.pacan — чёрная, тонировка, полоса на лобовом; o.eye: open/sly/sad/dead; o.mouth: smile/sad/o.
  CHARS.prioraFront = (p, o = {}) => {
    const body = o.pacan ? "#16181d" : (o.color || "#e9ecef"), glass = o.pacan ? "#050608" : "#1b2230", eye = o.eye || "open";
    const lamp = (sx) => {           // sx = 1 — правая фара (на картинке справа), -1 — левая
      const X = v => 300 + sx * v;
      const pupil = eye === "dead" ? `<path d="M${X(132)} 262 l26 26 M${X(158)} 262 l-26 26" stroke="${K}" stroke-width="7" stroke-linecap="round"/>`
        : `<circle cx="${X(eye === "sly" ? 150 : 146)}" cy="${eye === "sly" ? 280 : 276}" r="15" fill="${K}"/><circle cx="${X(150)}" cy="270" r="5" fill="#fff"/>`;
      const lid = eye === "sly" ? `<path d="M${X(92)} 262 L${X(232)} 240 L${X(232)} 258 L${X(96)} 270 Z" fill="${body}"/>`
        : eye === "sad" ? `<path d="M${X(92)} 252 L${X(160)} 250 L${X(92)} 268 Z" fill="${body}"/>` : "";
      return `<path d="M${X(90)} 258 L${X(222)} 236 Q${X(250)} 234 ${X(252)} 254 L${X(240)} 294 Q${X(232)} 306 ${X(210)} 306 L${X(104)} 304 Q${X(88)} 300 ${X(88)} 284 Z"
          fill="#eef4f9" stroke="${K}" stroke-width="7" stroke-linejoin="round"/>
        <path d="M${X(200)} 250 L${X(236)} 246 L${X(230)} 266 L${X(202)} 268 Z" fill="#ffb703" stroke="${K}" stroke-width="4"/>
        <circle cx="${X(146)}" cy="276" r="24" fill="#fff" stroke="${K}" stroke-width="5"/>${pupil}${lid}
        <path d="M${X(100)} ${eye === "sad" ? 232 : 236} Q${X(160)} ${eye === "sly" ? 214 : 220} ${X(226)} ${eye === "sad" ? 214 : 222}" stroke="${K}" stroke-width="8" fill="none" stroke-linecap="round"/>`;
    };
    const mouth = o.mouth === "sad" ? "M228 300 Q300 284 372 300" : o.mouth === "o" ? null : "M226 292 Q300 314 374 292";
    return `<svg viewBox="0 0 600 520" class="car" id="${p}">
 <ellipse cx="300" cy="490" rx="280" ry="18" fill="rgba(0,0,0,.3)"/>
 <rect x="74" y="${o.pacan ? 400 : 390}" width="96" height="${o.pacan ? 80 : 92}" rx="22" fill="#141416" stroke="${K}" stroke-width="7"/>
 <rect x="430" y="${o.pacan ? 400 : 390}" width="96" height="${o.pacan ? 80 : 92}" rx="22" fill="#141416" stroke="${K}" stroke-width="7"/>
 <!-- кузов: крыша, стойки, лобовое, капот, бампер -->
 <path d="M178 58 Q300 44 422 58 L478 176 L520 236 Q560 252 560 300 L556 426 Q554 446 532 448 L68 448 Q46 446 44 426 L40 300 Q40 252 80 236 L122 176 Z"
   fill="${body}" stroke="${K}" stroke-width="8" stroke-linejoin="round"/>
 <path d="M188 74 Q300 62 412 74 L456 172 Q300 160 144 172 Z" fill="${glass}" stroke="${K}" stroke-width="6" stroke-linejoin="round"/>
 ${o.pacan ? `<path d="M188 74 Q300 62 412 74 L420 92 Q300 82 180 92 Z" fill="#000"/>` : ""}
 <path d="M220 90 L176 160 M260 84 L232 150" stroke="#4a5262" stroke-width="5" opacity=".6"/>
 <path d="M150 182 Q300 172 450 182 L496 236 M104 236 L150 182" stroke="${K}" stroke-width="4" fill="none" opacity=".55"/>
 <path d="M232 186 Q300 180 368 186" stroke="${K}" stroke-width="4" fill="none" opacity=".4"/>
 <!-- зеркала -->
 <path d="M122 176 L76 166 Q58 166 60 186 L66 204 Q92 206 112 196 Z" fill="${o.pacan ? "#0e0f11" : body}" stroke="${K}" stroke-width="6" stroke-linejoin="round"/>
 <path d="M478 176 L524 166 Q542 166 540 186 L534 204 Q508 206 488 196 Z" fill="${o.pacan ? "#0e0f11" : body}" stroke="${K}" stroke-width="6" stroke-linejoin="round"/>
 ${lamp(-1)}${lamp(1)}
 <!-- решётка: чёрная полоса, хромированная планка-рот, ладья -->
 <path d="M220 270 Q300 262 380 270 L376 304 Q300 314 224 304 Z" fill="#101114" stroke="${K}" stroke-width="5"/>
 ${mouth ? `<path d="${mouth}" stroke="#d9dee5" stroke-width="12" fill="none" stroke-linecap="round"/><path d="${mouth}" stroke="${K}" stroke-width="3" fill="none" opacity=".4"/>`
   : `<ellipse cx="300" cy="300" rx="26" ry="18" fill="#5a1e1e" stroke="#d9dee5" stroke-width="8"/>`}
 <ellipse cx="300" cy="274" rx="26" ry="17" fill="#cfd5dd" stroke="${K}" stroke-width="5"/>
 <path d="M288 284 Q300 262 312 266 Q300 270 300 284 Z" fill="#2f5d9c"/>
 <!-- бампер: сетка, туманки, номер -->
 <path d="M196 348 L404 348 L384 404 L216 404 Z" fill="#101114" stroke="${K}" stroke-width="5"/>
 <g stroke="#2d2f35" stroke-width="4">${[0, 1, 2, 3].map(i => `<path d="M${206 + i * 4} ${362 + i * 12} H${394 - i * 4}"/>`).join("")}</g>
 <circle cx="112" cy="370" r="22" fill="#f4f6f8" stroke="${K}" stroke-width="5"/><circle cx="488" cy="370" r="22" fill="#f4f6f8" stroke="${K}" stroke-width="5"/>
 <rect x="226" y="412" width="148" height="32" rx="5" fill="#fff" stroke="${K}" stroke-width="5"/>
 <text x="300" y="437" text-anchor="middle" font-family="JetBrains Mono" font-weight="800" font-size="24" fill="${K}">${o.plate || "А777АА"}</text>
 ${o.pacan && CHARS.STICKER ? "" : ""}
</svg>`;
  };
})();
