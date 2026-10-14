/* Арбузов для крупного плана (портретный формат, владелец 14.10: «весь визуал канала» → «портрет как у амоБлога»).
   Детальная голова-арбуз: фактурная корка с неровными полосами, срез мякоти с салатовой и белой каймой, семечки с бликами,
   выразительные глаза (радужка, веки, блики), кепка со швами, рот с зубами, контровой свет, зерно.
   ArbuzovP.svg({ mood, look, rim, rim2, w, h })
     mood: smirk | shock | grin | sly | angry ;  look: смещение зрачков (-1…1) ;  rim / rim2 — цвета контрового света. */
(function () {
  let uid = 0;
  const OL = "#1c1012";
  function svg(o = {}) {
    const id = "ap" + (++uid), mood = o.mood || "smirk", lk = (o.look ?? .35) * 18, rim = o.rim || "#ffd84d", rim2 = o.rim2 || "#3be8ff";
    const st = (w) => `stroke="${OL}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
    // неровные полосы корки (меридианы с «волной»)
    const stripe = (k) => {
      const x0 = 500 + k * 120; let d = `M${500 + k * 40} 90`;
      for (let i = 1; i <= 16; i++) { const y = 90 + i * 58, bulge = Math.sin((y - 90) / 860 * Math.PI) * k * 105;
        d += ` L ${500 + k * 40 + bulge + (i % 2 ? 14 : -14)} ${y}`; }
      return `<path d="${d}" fill="none" stroke="#0e4a20" stroke-width="${58 - Math.abs(k) * 6}" stroke-linejoin="round" filter="url(#${id}w)"/>`;
    };
    const eye = (cx, side) => {
      const sh = mood === "shock", sl = mood === "sly" || mood === "smirk", an = mood === "angry";
      const ry = sh ? 100 : 88, pr = sh ? 15 : 22, ir = sh ? 30 : 40;
      const cid = `${id}k${side}`;
      const lidPath = sl ? `M${cx - 90} ${548} Q ${cx} ${516} ${cx + 90} ${548} L ${cx + 90} 440 L ${cx - 90} 440 Z`
        : an ? `M${cx - 90} ${side < 0 ? 520 : 470} L ${cx + 90} ${side < 0 ? 470 : 520} L ${cx + 90} 430 L ${cx - 90} 430 Z` : "";
      const lidLine = sl ? `<path d="M${cx - 82} ${548} Q ${cx} ${516} ${cx + 82} ${548}" fill="none" ${st(13)}/>`
        : an ? `<path d="M${cx - 80} ${side < 0 ? 517 : 473} L ${cx + 80} ${side < 0 ? 473 : 517}" ${st(13)}/>` : "";
      const lid = lidPath ? `<clipPath id="${cid}"><ellipse cx="${cx}" cy="560" rx="84" ry="${ry + 4}"/></clipPath><path d="${lidPath}" fill="#e85068" clip-path="url(#${cid})"/>${lidLine}` : "";
      return `<g>
        <ellipse cx="${cx}" cy="560" rx="80" ry="${ry}" fill="url(#${id}e)" ${st(9)}/>
        <circle cx="${cx + lk}" cy="${572 + (sh ? 0 : 6)}" r="${ir}" fill="url(#${id}i)"/>
        <circle cx="${cx + lk}" cy="${572 + (sh ? 0 : 6)}" r="${pr}" fill="#0d0708"/>
        <ellipse cx="${cx + lk + ir * .35}" cy="${560 - ir * .1}" rx="${ir * .3}" ry="${ir * .24}" fill="#fff"/><circle cx="${cx + lk - ir * .35}" cy="${590}" r="${ir * .12}" fill="#fff" opacity=".8"/>
        ${lid}
        <path d="M${cx - 70} ${560 + ry * .72} Q ${cx} ${560 + ry * 1.02} ${cx + 70} ${560 + ry * .72}" fill="none" stroke="#b8344a" stroke-width="6" opacity=".55"/>
      </g>`;
    };
    const brows = mood === "shock" ? `<path d="M318 418 Q 380 360 452 396" fill="none" ${st(22)}/><path d="M548 396 Q 620 360 682 418" fill="none" ${st(22)}/>`
      : mood === "angry" ? `<path d="M316 424 L 462 470" ${st(24)}/><path d="M538 470 L 684 424" ${st(24)}/>`
      : mood === "grin" ? `<path d="M322 440 Q 388 404 456 432" fill="none" ${st(20)}/><path d="M544 432 Q 612 404 678 440" fill="none" ${st(20)}/>`
      : `<path d="M318 452 L 458 444" ${st(22)}/><path d="M540 430 Q 610 392 684 418" fill="none" ${st(22)}/>`;
    const mouth = mood === "shock"
      ? `<ellipse cx="500" cy="760" rx="62" ry="78" fill="#4a0d18" ${st(10)}/><path d="M452 712 Q 500 698 548 712 L 544 732 Q 500 722 456 732 Z" fill="#fff"/><ellipse cx="500" cy="806" rx="38" ry="22" fill="#e45a74"/>`
      : mood === "grin" ? `<path d="M370 708 Q 500 860 630 708 Z" fill="#4a0d18" ${st(10)}/><path d="M384 716 Q 500 740 616 716 L 606 742 Q 500 760 394 742 Z" fill="#fff"/><path d="M430 790 Q 500 760 570 790 Q 500 836 430 790 Z" fill="#e45a74"/>`
      : mood === "angry" ? `<path d="M410 770 Q 500 730 590 770" fill="none" ${st(14)}/><path d="M440 752 L 560 752 L 556 772 L 444 772 Z" fill="#fff" ${st(5)}/>`
      : `<path d="M402 742 Q 500 790 612 712" fill="none" ${st(14)}/><path d="M540 742 Q 580 734 604 718 L 600 740 Q 572 756 540 758 Z" fill="#fff" ${st(4)}/><path d="M612 712 q 14 -4 18 -18" fill="none" ${st(10)}/>`;
    const seeds = [[320, 680, -30], [690, 680, 30], [360, 780, -20], [640, 790, 20], [260, 600, -45], [742, 600, 45], [500, 870, 0], [420, 860, -10], [585, 860, 12], [300, 520, -55], [705, 520, 55]]
      .map(([x, y, a]) => `<g transform="translate(${x} ${y}) rotate(${a})"><path d="M0 -20 Q 13 -2 0 20 Q -13 -2 0 -20 Z" fill="#1a0b0b"/><path d="M-3 -10 Q 1 -4 -2 4" stroke="#fff" stroke-width="3" opacity=".55" fill="none"/></g>`).join("");
    return `<svg viewBox="0 0 1000 1000" ${o.w ? `width="${o.w}"` : ""} ${o.h ? `height="${o.h}"` : ""} xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="${id}r" cx="34%" cy="26%" r="85%"><stop offset="0" stop-color="#9af0a8"/><stop offset=".35" stop-color="#47c066"/><stop offset=".75" stop-color="#22893f"/><stop offset="1" stop-color="#0d4a20"/></radialGradient>
    <radialGradient id="${id}f" gradientUnits="userSpaceOnUse" cx="430" cy="520" r="330"><stop offset="0" stop-color="#ffb0b8"/><stop offset=".55" stop-color="#f45b72"/><stop offset="1" stop-color="#c22f4d"/></radialGradient>
    <radialGradient id="${id}e" cx="40%" cy="35%" r="75%"><stop offset="0" stop-color="#ffffff"/><stop offset=".8" stop-color="#eef0f5"/><stop offset="1" stop-color="#c9ccd8"/></radialGradient>
    <radialGradient id="${id}i" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#8b5a2b"/><stop offset=".7" stop-color="#4a2a12"/><stop offset="1" stop-color="#1e0f06"/></radialGradient>
    <linearGradient id="${id}c" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff4b57"/><stop offset=".6" stop-color="#d81e35"/><stop offset="1" stop-color="#8e0d1f"/></linearGradient>
    <clipPath id="${id}h"><circle cx="500" cy="540" r="420"/></clipPath>
    <clipPath id="${id}m"><ellipse cx="500" cy="620" rx="300" ry="262"/></clipPath>
    <filter id="${id}w"><feTurbulence type="fractalNoise" baseFrequency=".02" numOctaves="2" seed="7"/><feDisplacementMap in="SourceGraphic" scale="34"/></filter>
    <filter id="${id}b"><feGaussianBlur stdDeviation="14"/></filter><filter id="${id}b2"><feGaussianBlur stdDeviation="5"/></filter>
    <filter id="${id}n"><feTurbulence type="fractalNoise" baseFrequency=".75" numOctaves="3" seed="3"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .32 0"/></filter>
  </defs>
  <!-- голова-арбуз -->
  <circle cx="500" cy="540" r="420" fill="url(#${id}r)"/>
  <g clip-path="url(#${id}h)">
    ${[-3, -2, -1, 0, 1, 2, 3].map(stripe).join("")}
    ${Array.from({ length: 70 }, (_, k) => { const a = k * 2.399, rr = 60 + (k * 53) % 360; return `<circle cx="${500 + Math.cos(a) * rr}" cy="${540 + Math.sin(a) * rr}" r="${2 + (k % 3)}" fill="#c8f5b0" opacity=".25"/>`; }).join("")}
    <rect x="80" y="120" width="840" height="840" filter="url(#${id}n)" fill="#000"/>
    <ellipse cx="310" cy="250" rx="150" ry="80" fill="#fff" opacity=".28" transform="rotate(-32 310 250)" filter="url(#${id}b)"/>
    <ellipse cx="270" cy="230" rx="44" ry="20" fill="#fff" opacity=".7" transform="rotate(-32 270 230)" filter="url(#${id}b2)"/>
    <path d="M880 330 Q 960 560 860 800" fill="none" stroke="${rim2}" stroke-width="50" opacity=".75" filter="url(#${id}b)"/>
    <path d="M120 360 Q 60 560 150 790" fill="none" stroke="${rim}" stroke-width="40" opacity=".55" filter="url(#${id}b)"/>
    <ellipse cx="500" cy="990" rx="520" ry="200" fill="#021a0b" opacity=".6" filter="url(#${id}b)"/>
  </g>
  <circle cx="500" cy="540" r="420" fill="none" ${st(12)}/>
  <!-- срез мякоти: салатовая и белая кайма, мякоть -->
  <ellipse cx="500" cy="620" rx="326" ry="288" fill="#bff0a0" ${st(9)}/>
  <ellipse cx="500" cy="620" rx="312" ry="274" fill="#f3fbe8"/>
  <ellipse cx="500" cy="620" rx="300" ry="262" fill="url(#${id}f)" ${st(6)}/>
  <g clip-path="url(#${id}m)">
    <ellipse cx="500" cy="360" rx="320" ry="80" fill="#7a1024" opacity=".3" filter="url(#${id}b)"/>
    ${Array.from({ length: 40 }, (_, k) => { const a = k * 2.399, rr = 40 + (k * 37) % 240; return `<ellipse cx="${500 + Math.cos(a) * rr}" cy="${640 + Math.sin(a) * rr * .8}" rx="10" ry="3" fill="#ffd0d6" opacity=".35" transform="rotate(${k * 23} ${500 + Math.cos(a) * rr} ${640 + Math.sin(a) * rr * .8})"/>`; }).join("")}
    <rect x="200" y="350" width="600" height="540" filter="url(#${id}n)" fill="#000" opacity=".6"/>
  </g>
  ${seeds}
  <ellipse cx="300" cy="700" rx="56" ry="30" fill="#ff3b5c" opacity=".45" filter="url(#${id}b2)"/><ellipse cx="700" cy="700" rx="56" ry="30" fill="#ff3b5c" opacity=".45" filter="url(#${id}b2)"/>
  ${eye(390, -1)}${eye(610, 1)}${brows}${mouth}
  <!-- кепка задом наперёд: купол со швами, козырёк назад-влево, пуговка -->
  <path d="M138 400 Q 150 120 500 92 Q 850 120 862 400 Q 500 330 138 400 Z" fill="url(#${id}c)" ${st(12)}/>
  <path d="M500 96 Q 470 240 470 350 M 500 96 Q 650 200 700 356 M 500 96 Q 350 200 300 360" fill="none" stroke="#7a0b1b" stroke-width="6" opacity=".7"/>
  <path d="M170 380 Q 500 318 830 380" fill="none" stroke="#fff" stroke-width="5" stroke-dasharray="14 12" opacity=".5"/>
  <path d="M250 200 Q 360 128 480 118" fill="none" stroke="#fff" stroke-width="18" stroke-linecap="round" opacity=".35"/>
  <path d="M190 360 Q 40 360 -2 420 Q 60 470 200 420 Z" fill="#a8132a" ${st(12)}/><path d="M30 418 Q 100 400 186 396" fill="none" stroke="#fff" stroke-width="5" stroke-dasharray="12 10" opacity=".45"/>
  <ellipse cx="500" cy="94" rx="30" ry="18" fill="#8e0d1f" ${st(8)}/>
  <g transform="translate(640 240) rotate(12)"><path d="M-40 -6 L 40 -6 L 0 44 Z" fill="#ff5a6e" ${st(5)}/><path d="M-40 -6 L 40 -6" stroke="#2fa84f" stroke-width="10"/><circle cx="-8" cy="12" r="3.5" fill="${OL}"/><circle cx="10" cy="16" r="3.5" fill="${OL}"/></g>
</svg>`;
  }
  (typeof window !== "undefined" ? window : globalThis).ArbuzovP = { svg };
})();
