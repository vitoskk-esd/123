/* Арбузов — персонаж-ведущий канала «Арбузов» (владелец 13.10: «выбираю арбузика, его будут звать Арбузов»).
   Один SVG из частей — основа для анимации (рот под голос, моргание, руки, эмоции).
   Arbuzov.svg({ mood, arm, look, theme, view, blink, mouth })
     mood:  talk | happy | shock | wink | smirk
     arm:   point | phone | up | down
     theme: pop (контур тёмный) | neon (светящийся контур на тёмном) | doodle (дрожащая «маркерная» линия)
     view:  full (весь рост) | head (для аватарки) | bust (по пояс)
     mouth: null | "A" | "O" | "E" | "S" | "M" — фонема (S — приоткрыт, согласные) (перекрывает рот эмоции, для синхрона с голосом)
*/
(function () {
  let uid = 0;
  const T = {
    pop:    { ol: "#1d1b2c", skin: "#2fa84f", stripe: "#17702f", face: "#ff6b78", cap: "#ff3b4f", cap2: "#d81f36", seed: "#2b1d1d", shoe: "#fff", hand: "#fff", sh: "rgba(0,0,0,.15)" },
    neon:   { ol: "#0b0f0d", skin: "#2fd36a", stripe: "#0f8a3a", face: "#ff5c7a", cap: "#ff2d55", cap2: "#c8143a", seed: "#2b1d1d", shoe: "#f4fff6", hand: "#f4fff6", sh: "rgba(47,211,106,.25)" },
    doodle: { ol: "#232031", skin: "#3bb15a", stripe: "#1b7a37", face: "#ff7884", cap: "#ff4053", cap2: "#d92a40", seed: "#2b1d1d", shoe: "#fff", hand: "#fff", sh: "rgba(0,0,0,.12)" },
  };
  function svg(o = {}) {
    const mood = o.mood || "talk", arm = o.arm || "point", th = o.theme || "pop", c = T[th], id = "az" + (++uid);
    const OL = c.ol, st = (w = 7) => `stroke="${OL}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
    const look = o.look ?? (mood === "talk" ? 6 : 0), blink = o.blink || 0;
    const eye = (x, y, r, side) => {
      if (mood === "happy" || (mood === "wink" && side > 0) || blink >= 1)
        return `<path d="M${x - r} ${y + 4} Q ${x} ${y - r - 6} ${x + r} ${y + 4}" fill="none" ${st(8)}/>`;
      const ry = r * (mood === "shock" ? 1.25 : 1.12) * (1 - blink);
      const lid = mood === "smirk" ? `<path d="M${x - r - 4} ${y - r * .2} L ${x + r + 4} ${y - r * .2} L ${x + r + 4} ${y - r * 1.4} L ${x - r - 4} ${y - r * 1.4} Z" fill="${c.face}"/><path d="M${x - r - 2} ${y - r * .2} L ${x + r + 2} ${y - r * .2}" ${st(7)}/>` : "";
      return `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${ry}" fill="#fff" ${st(6)}/>
        <circle cx="${x + look}" cy="${y + 2}" r="${r * (mood === "shock" ? .38 : .52)}" fill="${OL}"/><circle cx="${x + look + r * .2}" cy="${y - r * .2}" r="${r * .16}" fill="#fff"/>${lid}`;
    };
    const brows = (cx, cy, g) => mood === "shock"
      ? `<path d="M${cx - g - 22} ${cy - 10} Q ${cx - g} ${cy - 30} ${cx - g + 22} ${cy - 14}" fill="none" ${st(7)}/><path d="M${cx + g - 22} ${cy - 14} Q ${cx + g} ${cy - 30} ${cx + g + 22} ${cy - 10}" fill="none" ${st(7)}/>`
      : mood === "smirk" ? `<path d="M${cx - g - 22} ${cy + 2} L ${cx - g + 22} ${cy - 2}" ${st(7)}/><path d="M${cx + g - 22} ${cy - 16} Q ${cx + g} ${cy - 26} ${cx + g + 22} ${cy - 14}" fill="none" ${st(7)}/>`
      : mood === "talk" || mood === "wink" ? `<path d="M${cx - g - 20} ${cy} L ${cx - g + 20} ${cy - 8}" ${st(7)}/><path d="M${cx + g - 20} ${cy - 8} L ${cx + g + 20} ${cy}" ${st(7)}/>` : "";
    const mouth = (cx, cy, w) => {
      const v = o.mouth;
      if (v === "S") return `<path d="M${cx - w * .5} ${cy + 4} Q ${cx} ${cy + w * .42} ${cx + w * .5} ${cy + 4} Q ${cx} ${cy + w * .12} ${cx - w * .5} ${cy + 4} Z" fill="#7a1f2b" ${st(6)}/>`;
      if (v === "M") return `<path d="M${cx - w * .5} ${cy + 6} Q ${cx} ${cy + 14} ${cx + w * .5} ${cy + 6}" fill="none" ${st(7)}/>`;
      if (v === "O") return `<ellipse cx="${cx}" cy="${cy + w * .3}" rx="${w * .38}" ry="${w * .5}" fill="#7a1f2b" ${st(6)}/>`;
      if (v === "E") return `<path d="M${cx - w * .8} ${cy} Q ${cx} ${cy + w * .5} ${cx + w * .8} ${cy} Q ${cx} ${cy + w * .15} ${cx - w * .8} ${cy} Z" fill="#7a1f2b" ${st(6)}/>`;
      if (v === "A" || mood === "happy") return `<path d="M${cx - w} ${cy} Q ${cx} ${cy + w * 1.1} ${cx + w} ${cy} Z" fill="#7a1f2b" ${st(6)}/><path d="M${cx - w * .55} ${cy + w * .55} Q ${cx} ${cy + w * .3} ${cx + w * .55} ${cy + w * .55} Q ${cx} ${cy + w * .95} ${cx - w * .55} ${cy + w * .55}" fill="#ff8a9a"/>`;
      if (mood === "shock") return `<ellipse cx="${cx}" cy="${cy + w * .3}" rx="${w * .45}" ry="${w * .6}" fill="#7a1f2b" ${st(6)}/>`;
      if (mood === "smirk" || mood === "wink") return `<path d="M${cx - w * .7} ${cy + 8} Q ${cx + w * .1} ${cy + w * .55} ${cx + w * .85} ${cy - 8}" fill="none" ${st(8)}/>`;
      return `<path d="M${cx - w * .8} ${cy} Q ${cx} ${cy + w * .9} ${cx + w * .8} ${cy} Q ${cx} ${cy + w * .25} ${cx - w * .8} ${cy} Z" fill="#7a1f2b" ${st(6)}/><path d="M${cx - w * .35} ${cy + w * .45} Q ${cx} ${cy + w * .3} ${cx + w * .35} ${cy + w * .45}" fill="none" stroke="#ff8a9a" stroke-width="8" stroke-linecap="round"/>`;
    };
    const phone = (x, y, r = 0) => `<g transform="translate(${x} ${y}) rotate(${r})"><rect x="-38" y="-70" width="76" height="140" rx="16" fill="#2b2b3a" ${st(6)}/><rect x="-28" y="-56" width="56" height="104" rx="8" fill="#57f0a2"/><text x="0" y="6" text-anchor="middle" font-family="Unb" font-weight="900" font-size="22" fill="#0b2a1a">₽</text></g>`;
    const hand = (x, y) => `<circle cx="${x}" cy="${y}" r="18" fill="${c.hand}" ${st(6)}/>`;
    const arms = arm === "point" ? `<path d="M90 420 Q 40 470 70 540" fill="none" ${st(16)}/>${hand(70, 548)}<path d="M510 400 Q 580 330 600 270" fill="none" ${st(16)}/>${hand(600, 262)}`
      : arm === "phone" ? `<path d="M90 420 Q 40 470 70 540" fill="none" ${st(16)}/>${hand(70, 548)}<path d="M510 420 Q 570 410 560 330" fill="none" ${st(16)}/>${phone(560, 300, 12)}`
      : arm === "down" ? `<path d="M90 420 Q 40 470 70 540" fill="none" ${st(16)}/>${hand(70, 548)}<path d="M510 420 Q 560 470 530 540" fill="none" ${st(16)}/>${hand(530, 548)}`
      : `<path d="M90 420 Q 20 360 40 290" fill="none" ${st(16)}/><path d="M510 420 Q 580 360 560 290" fill="none" ${st(16)}/>${hand(40, 282)}${hand(560, 282)}`;
    const vb = o.view === "head" ? "80 92 440 440" : o.view === "bust" ? "-40 60 680 560" : "-40 -20 680 780";
    const filt = th === "doodle" ? `<filter id="${id}f"><feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="2" seed="${o.seed || 3}"/><feDisplacementMap in="SourceGraphic" scale="7"/></filter>`
      : th === "neon" ? `<filter id="${id}f" x="-20%" y="-20%" width="140%" height="140%"><feMorphology in="SourceAlpha" operator="dilate" radius="5" result="d"/><feFlood flood-color="#7dffb0"/><feComposite in2="d" operator="in" result="rim"/><feGaussianBlur in="rim" stdDeviation="14" result="glow"/><feMerge><feMergeNode in="glow"/><feMergeNode in="rim"/><feMergeNode in="SourceGraphic"/></feMerge></filter>` : "";
    return `<svg viewBox="${vb}" ${o.w ? `width="${o.w}"` : ""} ${o.h ? `height="${o.h}"` : ""} xmlns="http://www.w3.org/2000/svg"><defs>${filt}</defs>
  ${o.view === "head" ? "" : `<ellipse cx="300" cy="730" rx="180" ry="22" fill="${c.sh}"/>`}
  <g ${filt ? `filter="url(#${id}f)"` : ""}>
  <path d="M235 600 L225 690" ${st(16)}/><path d="M365 600 L375 690" ${st(16)}/>
  <path d="M180 700 Q 185 668 228 670 L 262 676 Q 272 700 250 712 L 190 712 Q 176 710 180 700 Z" fill="${c.shoe}" ${st(6)}/><path d="M420 700 Q 415 668 372 670 L 338 676 Q 328 700 350 712 L 410 712 Q 424 710 420 700 Z" fill="${c.shoe}" ${st(6)}/>
  <ellipse cx="300" cy="400" rx="230" ry="240" fill="${c.skin}" ${st(8)}/>
  ${[-150, -85, -25, 35, 95, 155].map(dx => `<path d="M${300 + dx * .2} 165 Q ${300 + dx * 1.35} 400 ${300 + dx * .2} 636" fill="none" stroke="${c.stripe}" stroke-width="22" stroke-linecap="round" opacity=".9"/>`).join("")}
  <ellipse cx="230" cy="290" rx="60" ry="34" fill="rgba(255,255,255,.18)" transform="rotate(-25 230 290)"/>
  <path d="M150 230 Q 170 120 300 112 Q 430 120 450 230 Q 300 200 150 230 Z" fill="${c.cap}" ${st(7)}/><path d="M400 200 Q 480 190 520 220 Q 480 240 430 232" fill="${c.cap2}" ${st(7)}/>
  <circle cx="300" cy="116" r="12" fill="${c.cap2}" ${st(5)}/>
  <ellipse cx="300" cy="400" rx="150" ry="120" fill="${c.face}" ${st(7)}/>
  ${[[-70, -40], [-20, -70], [40, -55], [85, -20], [-90, 30], [80, 40]].map(([x, y]) => `<ellipse cx="${300 + x}" cy="${400 + y}" rx="6" ry="10" fill="${c.seed}" opacity=".55" transform="rotate(${x / 3} ${300 + x} ${400 + y})"/>`).join("")}
  ${eye(248, 380, 30, -1)}${eye(352, 380, 30, 1)}${brows(300, 335, 52)}${mouth(300, 440, 46)}
  ${o.view === "head" ? "" : arms}
  </g></svg>`;
  }
  (typeof window !== "undefined" ? window : globalThis).Arbuzov = { svg, themes: T };
})();
