// Массовка серий с 23-й: перекупы-«не перекупы» (очередь во дворе, штаб). Без реплик — говорят только Толян и основные герои.
// CHARS.perekup(p, {jacket, pants, cap, hair, skin, item: "phone"|"cash"|"flowers"|"bag"|"", look: "grin"|"o"|"angry",
//                   glasses, mustache, coat (длинное пальто, цвет), police (фуражка и погоны), tie}) — с ep25 и говорящие: рты -mouth-talk/-grin/-o/-flat
(() => {
  const K = "#151515", W = 7;
  CHARS.perekup = (p, o = {}) => {
    const jk = o.jacket || "#3b3f46", pt = o.pants || "#232c47", sk = o.skin || "#e8b48c", hr = o.hair || "#3a2d22", cap = o.cap;
    const sd = "#c99b78";
    const item = o.item === "phone" ? `<rect x="300" y="196" width="34" height="62" rx="8" fill="#111" stroke="${K}" stroke-width="5"/><rect x="306" y="204" width="22" height="40" rx="4" fill="#5ac8fa"/>`
      : o.item === "cash" ? `<g transform="rotate(-14 330 470)"><rect x="296" y="440" width="96" height="52" rx="6" fill="#7fbf6a" stroke="${K}" stroke-width="5"/><rect x="300" y="430" width="96" height="52" rx="6" fill="#8fd17a" stroke="${K}" stroke-width="5"/>
          <circle cx="348" cy="456" r="14" fill="none" stroke="#3f7a32" stroke-width="5"/><text x="348" y="463" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="20" fill="#3f7a32">₽</text></g>`
      : o.item === "gauge" ? `<g><rect x="296" y="470" width="62" height="96" rx="12" fill="#ffd23f" stroke="${K}" stroke-width="6"/><rect x="304" y="480" width="46" height="34" rx="4" fill="#cfe9c4" stroke="${K}" stroke-width="4"/>
          <path d="M327 566 v34" stroke="${K}" stroke-width="10" stroke-linecap="round"/><circle cx="327" cy="604" r="9" fill="#9aa3ab" stroke="${K}" stroke-width="4"/></g>`
      : o.item === "bag" ? `<g><path d="M300 470 q32 -40 64 0" fill="none" stroke="${K}" stroke-width="7"/><rect x="282" y="470" width="104" height="70" rx="12" fill="#1f2a44" stroke="${K}" stroke-width="6"/><path d="M282 498 h104" stroke="#3b4a6b" stroke-width="5"/></g>`
      : o.item === "flowers" ? `<g><path d="M330 520 L350 430" stroke="#2f7a2f" stroke-width="8"/>${[[338, 420, "#ff4d6d"], [362, 428, "#ffd23f"], [348, 404, "#ff7ab8"], [322, 410, "#ff4d6d"]].map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="16" fill="${c}" stroke="${K}" stroke-width="4"/>`).join("")}
          <path d="M318 470 L360 470 L346 520 L330 520 Z" fill="#f4e7c3" stroke="${K}" stroke-width="5"/></g>` : "";
    const armR = o.item === "phone"
      ? `<path d="M292 395 q40 -20 34 -150 q-4 -14 -24 -8 q-8 90 -40 130" fill="${jk}" stroke="${K}" stroke-width="${W}" stroke-linejoin="round"/><circle cx="314" cy="236" r="18" fill="${sk}" stroke="${K}" stroke-width="${W}"/>`
      : `<path d="M292 395 q38 40 42 118 q-2 18 -22 16 q-22 -58 -44 -94" fill="${jk}" stroke="${K}" stroke-width="${W}" stroke-linejoin="round"/><circle cx="318" cy="530" r="18" fill="${sk}" stroke="${K}" stroke-width="${W}"/>`;
    const brows = o.look === "angry" ? `<path d="M150 178 l52 16 M270 178 l-52 16" stroke="${K}" stroke-width="12" stroke-linecap="round"/>`
      : `<path d="M150 186 q28 -14 52 -2 M218 184 q26 -12 52 2" stroke="${K}" stroke-width="12" stroke-linecap="round" fill="none"/>`;
    const def = o.look === "o" ? "o" : o.look === "angry" ? "flat" : "grin";
    const mouths = [["grin", `<path d="M162 282 q48 40 96 0 q-48 16 -96 0 z" fill="#fff" stroke="${K}" stroke-width="6" stroke-linejoin="round"/>`],
      ["talk", `<path d="M168 280 q42 56 84 0 z" fill="#5a1e1e" stroke="${K}" stroke-width="6" stroke-linejoin="round"/><path d="M170 282 h80 v9 h-80 z" fill="#fff"/>`],
      ["o", `<ellipse cx="210" cy="294" rx="16" ry="20" fill="#5a1e1e" stroke="${K}" stroke-width="6"/>`],
      ["flat", o.look === "angry" ? `<path d="M170 300 q40 -22 80 0" stroke="${K}" stroke-width="8" fill="none" stroke-linecap="round"/>`
        : `<path d="M176 292 h68" stroke="${K}" stroke-width="8" stroke-linecap="round"/>`]]
      .map(([n, d]) => `<g class="mouth" id="${p}-mouth-${n}"${n === def ? "" : ' style="display:none"'}>${d}</g>`).join("");
    const glasses = o.glasses ? `<g><circle cx="176" cy="216" r="26" fill="#cfe8f5" fill-opacity=".35" stroke="${K}" stroke-width="6"/><circle cx="244" cy="216" r="26" fill="#cfe8f5" fill-opacity=".35" stroke="${K}" stroke-width="6"/>
      <path d="M202 214 h16 M150 210 l-26 -6 M270 210 l26 -6" stroke="${K}" stroke-width="5"/></g>` : "";
    const mustache = o.mustache ? `<path d="M168 270 q20 -14 42 -4 q22 -10 42 4 q-20 12 -42 4 q-22 8 -42 -4 z" fill="${hr}" stroke="${K}" stroke-width="4"/>` : "";
    const police = o.police ? `<g><path d="M116 168 q-6 -96 94 -100 q100 4 94 100 z" fill="#1f2f5a" stroke="${K}" stroke-width="${W}" stroke-linejoin="round"/>
      <path d="M118 150 h184 v22 h-184 z" fill="#c0392b" stroke="${K}" stroke-width="5"/><path d="M128 172 q82 30 164 0 l-8 14 q-74 22 -148 0 z" fill="#111" stroke="${K}" stroke-width="5"/>
      <circle cx="210" cy="126" r="13" fill="#f5c542" stroke="${K}" stroke-width="4"/></g>` : "";
    const head = cap ? `<path d="M126 186 q0 -104 84 -104 q84 0 84 104 z" fill="${cap}" stroke="${K}" stroke-width="${W}" stroke-linejoin="round"/>
        <path d="M200 178 q70 -16 132 10 q-8 18 -40 14 q-50 -10 -92 -6 z" fill="${cap}" stroke="${K}" stroke-width="6" stroke-linejoin="round"/><circle cx="210" cy="86" r="8" fill="${cap}" stroke="${K}" stroke-width="4"/>`
      : `<path d="M124 186 q-4 -102 86 -104 q90 2 86 104 q-26 -46 -86 -46 q-60 0 -86 46 z" fill="${hr}" stroke="${K}" stroke-width="5"/>`;
    return `<svg viewBox="0 0 420 800" class="char" id="${p}">
 <g id="${p}-body">
  <path d="M150 560 L140 735 L195 735 L210 600 L225 735 L280 735 L268 560 Z" fill="${pt}" stroke="${K}" stroke-width="${W}" stroke-linejoin="round"/>
  <path d="M120 740 q0 -26 30 -26 h48 q14 0 14 26 z M212 740 q0 -26 14 -26 h48 q32 0 32 26 z" fill="#2b2b2e" stroke="${K}" stroke-width="${W}" stroke-linejoin="round"/>
  <path d="M118 390 q-10 90 20 178 h146 q30 -88 20 -178 q-30 -40 -93 -40 q-63 0 -93 40 z" fill="${jk}" stroke="${K}" stroke-width="${W}" stroke-linejoin="round"/>
  ${o.coat ? `<path d="M118 400 q-26 160 -6 290 h196 q20 -130 -6 -290 z" fill="${o.coat}" stroke="${K}" stroke-width="${W}" stroke-linejoin="round"/>` : ""}
  <path d="M210 352 v214" stroke="${K}" stroke-width="5"/><path d="M180 356 l30 34 l30 -34" fill="none" stroke="${K}" stroke-width="5"/>
  ${o.tie ? `<path d="M202 372 h16 l8 90 l-16 22 l-16 -22 z" fill="${o.tie}" stroke="${K}" stroke-width="4"/>` : ""}
  ${o.police ? `<path d="M126 384 h46 M248 384 h46" stroke="#f5c542" stroke-width="10" stroke-linecap="round"/>` : ""}
 </g>
 <g id="${p}-armL" style="transform-origin:128px 400px">
  <path d="M128 395 q-38 40 -40 120 q2 18 22 16 q22 -60 44 -96" fill="${jk}" stroke="${K}" stroke-width="${W}" stroke-linejoin="round"/>
  <circle cx="106" cy="532" r="17" fill="${sk}" stroke="${K}" stroke-width="${W}"/>
 </g>
 <g id="${p}-armR" style="transform-origin:292px 400px">${armR}${item}</g>
 <g id="${p}-head" style="transform-origin:210px 360px">
  <path d="M188 330 h44 v40 h-44 z" fill="${sd}" stroke="${K}" stroke-width="${W}"/>
  <ellipse cx="122" cy="232" rx="20" ry="28" fill="${sk}" stroke="${K}" stroke-width="${W}"/><ellipse cx="298" cy="232" rx="20" ry="28" fill="${sk}" stroke="${K}" stroke-width="${W}"/>
  <path d="M120 200 q0 -120 90 -120 q90 0 90 120 q0 70 -30 108 q-26 32 -60 32 q-34 0 -60 -32 q-30 -38 -30 -108 z" fill="${sk}" stroke="${K}" stroke-width="${W}"/>
  ${o.beard ? `<path d="M140 250 q4 90 70 92 q66 -2 70 -92 q-20 40 -70 42 q-50 -2 -70 -42 z" fill="${hr}" stroke="${K}" stroke-width="5"/>` : ""}
  ${o.police ? "" : head}
  ${brows}
  <ellipse cx="176" cy="216" rx="18" ry="15" fill="#fff" stroke="${K}" stroke-width="5"/><circle cx="180" cy="218" r="7" fill="${K}"/>
  <ellipse cx="244" cy="216" rx="18" ry="15" fill="#fff" stroke="${K}" stroke-width="5"/><circle cx="248" cy="218" r="7" fill="${K}"/>
  <path d="M206 224 q-14 32 -2 42 q10 6 20 0" fill="${sd}" stroke="${K}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
  ${mouths}${mustache}${glasses}${police}
 </g>
</svg>`;
  };
})();
