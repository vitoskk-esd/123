// Новые герои «Перекупов» в том же стиле, что chars.js (420×800, контур #151515, части с id-префиксом).
// Вика — подкованная покупательница; Михалыч — мастер СТО. Рты: -mouth-flat / -talk / -o / -grin (ухмылка) / -meh.
(function () {
  const K = "#151515", W = 7;

  // ---------- ВИКА: бомбер, джинсы, высокий хвост, уверенный прищур ----------
  CHARS.vika = p => `
<svg viewBox="0 0 420 800" class="char" id="${p}">
 <g id="${p}-body">
  <path d="M162 560 L156 735 L204 735 L210 610 L216 735 L264 735 L258 560 Z" fill="#2c3e66" stroke="${K}" stroke-width="${W}" stroke-linejoin="round"/>
  <path d="M190 640 l6 40 M234 650 l-4 36" stroke="#4a5f8f" stroke-width="5" stroke-linecap="round"/>
  <path d="M136 740 q0 -24 24 -24 h40 q12 0 12 24 z M208 740 q0 -24 12 -24 h40 q26 0 26 24 z" fill="#f4f4f4" stroke="${K}" stroke-width="${W}" stroke-linejoin="round"/>
  <path d="M136 735 h76 M208 735 h78" stroke="#ff3b30" stroke-width="6"/>
  <!-- бомбер: бордовый, резинка по низу, молния -->
  <path d="M134 398 q-8 84 16 160 h120 q24 -76 16 -160 q-28 -36 -76 -36 q-48 0 -76 36 z" fill="#8e1f3a" stroke="${K}" stroke-width="${W}" stroke-linejoin="round"/>
  <path d="M150 548 h120 v18 h-120 z" fill="#5c1426" stroke="${K}" stroke-width="5"/>
  <path d="M210 372 v176" stroke="#d8c08a" stroke-width="6"/>
  <path d="M176 368 q34 26 68 0" fill="none" stroke="${K}" stroke-width="5"/>
  <path d="M168 372 q42 30 84 0 v10 q-42 30 -84 0 z" fill="#5c1426" stroke="${K}" stroke-width="4"/>
  <rect x="226" y="420" width="34" height="24" rx="5" fill="#ffd23f" stroke="${K}" stroke-width="4"/>
 </g>
 <g id="${p}-armL" style="transform-origin:140px 404px">
  <path d="M140 398 q-32 46 -30 118 q4 16 22 12 q10 -58 34 -94" fill="#8e1f3a" stroke="${K}" stroke-width="${W}" stroke-linejoin="round"/>
  <circle cx="122" cy="528" r="16" fill="#f0c3a0" stroke="${K}" stroke-width="${W}"/>
 </g>
 <g id="${p}-armR" style="transform-origin:280px 404px">
  <path d="M280 398 q32 46 32 118 q-4 16 -22 12 q-10 -58 -34 -94" fill="#8e1f3a" stroke="${K}" stroke-width="${W}" stroke-linejoin="round"/>
  <circle cx="300" cy="528" r="16" fill="#f0c3a0" stroke="${K}" stroke-width="${W}"/>
 </g>
 <g id="${p}-head" style="transform-origin:210px 368px">
  <!-- высокий хвост за головой -->
  <path id="${p}-tail" d="M262 112 q78 -6 70 90 q-6 70 -40 110 q24 -70 -4 -120 q-14 -28 -38 -40 z" fill="#2b1a14" stroke="${K}" stroke-width="6" stroke-linejoin="round"/>
  <path d="M194 334 h32 v40 h-32 z" fill="#e0ad8c" stroke="${K}" stroke-width="${W}"/>
  <ellipse cx="134" cy="238" rx="16" ry="24" fill="#f0c3a0" stroke="${K}" stroke-width="${W}"/>
  <ellipse cx="286" cy="238" rx="16" ry="24" fill="#f0c3a0" stroke="${K}" stroke-width="${W}"/>
  <circle cx="134" cy="266" r="7" fill="#ffd23f" stroke="${K}" stroke-width="3"/><circle cx="286" cy="266" r="7" fill="#ffd23f" stroke="${K}" stroke-width="3"/>
  <path d="M132 214 q0 -116 78 -116 q78 0 78 116 q0 62 -24 96 q-22 28 -54 28 q-32 0 -54 -28 q-24 -34 -24 -96 z" fill="#f0c3a0" stroke="${K}" stroke-width="${W}"/>
  <!-- волосы: гладко назад, прядь у лица -->
  <path d="M128 206 q-6 -118 84 -122 q86 2 84 116 q-24 -54 -84 -62 q-30 2 -50 22 q-18 18 -34 46 z" fill="#2b1a14" stroke="${K}" stroke-width="6" stroke-linejoin="round"/>
  <path d="M140 196 q-10 40 2 74" stroke="#2b1a14" stroke-width="12" fill="none" stroke-linecap="round"/>
  <rect x="246" y="96" width="26" height="18" rx="6" fill="#ff3b30" stroke="${K}" stroke-width="4" transform="rotate(-20 259 105)"/>
  <!-- брови: дерзкие, одна выше -->
  <g id="${p}-brows"><path d="M160 186 q22 -14 42 -4" stroke="${K}" stroke-width="9" stroke-linecap="round" fill="none"/>
   <path d="M220 178 q22 -12 42 0" stroke="${K}" stroke-width="9" stroke-linecap="round" fill="none"/></g>
  <!-- глаза: миндаль, ресницы -->
  <g id="${p}-eyes"><path d="M160 220 q20 -22 40 0 q-20 16 -40 0 z" fill="#fff" stroke="${K}" stroke-width="5"/><circle cx="182" cy="219" r="9" fill="${K}"/><circle cx="186" cy="215" r="3" fill="#fff"/>
   <path d="M222 220 q20 -22 40 0 q-20 16 -40 0 z" fill="#fff" stroke="${K}" stroke-width="5"/><circle cx="244" cy="219" r="9" fill="${K}"/><circle cx="248" cy="215" r="3" fill="#fff"/>
   <path d="M158 214 l-10 -6 M264 214 l10 -6" stroke="${K}" stroke-width="5" stroke-linecap="round"/></g>
  <g id="${p}-lids" style="transform-origin:210px 216px;transform:scaleY(0)"><path d="M156 222 v-20 h48 v20 z M218 222 v-20 h48 v20 z" fill="#f0c3a0" stroke="${K}" stroke-width="5"/></g>
  <path d="M210 232 q-10 22 2 28" fill="none" stroke="${K}" stroke-width="5" stroke-linecap="round"/>
  <ellipse cx="164" cy="268" rx="14" ry="8" fill="#ff8a8a" opacity=".5"/><ellipse cx="256" cy="268" rx="14" ry="8" fill="#ff8a8a" opacity=".5"/>
  <g class="mouth" id="${p}-mouth-flat"><path d="M192 292 q18 6 36 0" fill="none" stroke="#b5243f" stroke-width="7" stroke-linecap="round"/></g>
  <g class="mouth" id="${p}-mouth-grin" style="display:none"><path d="M188 292 q26 10 44 -8" fill="none" stroke="#b5243f" stroke-width="7" stroke-linecap="round"/></g>
  <g class="mouth" id="${p}-mouth-talk" style="display:none"><path d="M190 286 q20 36 40 0 z" fill="#5a1e1e" stroke="#b5243f" stroke-width="6" stroke-linejoin="round"/><path d="M193 288 h34 v6 h-34 z" fill="#fff"/></g>
  <g class="mouth" id="${p}-mouth-o" style="display:none"><ellipse cx="210" cy="296" rx="10" ry="13" fill="#5a1e1e" stroke="#b5243f" stroke-width="6"/></g>
  <g class="mouth" id="${p}-mouth-meh" style="display:none"><path d="M192 296 h36" stroke="#b5243f" stroke-width="7" stroke-linecap="round"/></g>
 </g>
</svg>`;

  // ---------- МИХАЛЫЧ: мастер СТО. Синий комбинезон, седые виски, усы, ключ в руке ----------
  CHARS.mihalych = p => `
<svg viewBox="0 0 420 800" class="char" id="${p}">
 <g id="${p}-body">
  <path d="M146 556 L138 735 L198 735 L210 610 L222 735 L282 735 L274 556 Z" fill="#2f5d9c" stroke="${K}" stroke-width="${W}" stroke-linejoin="round"/>
  <path d="M118 740 q0 -26 30 -26 h50 q12 0 12 26 z M210 740 q0 -26 12 -26 h50 q30 0 30 26 z" fill="#3a2a20" stroke="${K}" stroke-width="${W}" stroke-linejoin="round"/>
  <!-- комбинезон с животиком -->
  <path d="M120 392 q-20 96 18 172 h144 q38 -76 18 -172 q-30 -40 -90 -40 q-60 0 -90 40 z" fill="#2f5d9c" stroke="${K}" stroke-width="${W}" stroke-linejoin="round"/>
  <path d="M172 362 h76 l-8 58 h-60 z" fill="#d7d2c4" stroke="${K}" stroke-width="5"/>
  <path d="M166 372 l10 100 M254 372 l-10 100" stroke="#24497d" stroke-width="12"/>
  <rect x="176" y="452" width="68" height="54" rx="8" fill="#24497d" stroke="${K}" stroke-width="5"/>
  <path d="M186 470 h48" stroke="#ffd23f" stroke-width="5"/>
  <ellipse cx="150" cy="520" rx="16" ry="10" fill="#1b1b1b" opacity=".35"/><ellipse cx="262" cy="470" rx="12" ry="8" fill="#1b1b1b" opacity=".3"/>
  <path d="M232 400 h22 l-2 30 h-18 z" fill="#d23b3b" stroke="${K}" stroke-width="4"/>
 </g>
 <g id="${p}-armL" style="transform-origin:128px 404px">
  <path d="M128 398 q-38 44 -38 122 q4 16 24 12 q12 -60 40 -98" fill="#2f5d9c" stroke="${K}" stroke-width="${W}" stroke-linejoin="round"/>
  <circle cx="104" cy="532" r="19" fill="#d79c7a" stroke="${K}" stroke-width="${W}"/>
  <path d="M94 528 l18 4" stroke="#3a3a3a" stroke-width="4" opacity=".6"/>
 </g>
 <g id="${p}-armR" style="transform-origin:292px 404px">
  <path d="M292 398 q38 44 40 122 q-4 16 -24 12 q-12 -60 -40 -98" fill="#2f5d9c" stroke="${K}" stroke-width="${W}" stroke-linejoin="round"/>
  <circle cx="318" cy="532" r="19" fill="#d79c7a" stroke="${K}" stroke-width="${W}"/>
  <!-- гаечный ключ -->
  <g id="${p}-wrench"><path d="M318 520 l40 -90" stroke="#a8afb8" stroke-width="16" stroke-linecap="round"/>
   <path d="M346 412 a24 24 0 1 1 30 22 l-8 -14 l-14 -2 z" fill="#a8afb8" stroke="${K}" stroke-width="5" stroke-linejoin="round"/></g>
 </g>
 <g id="${p}-head" style="transform-origin:210px 364px">
  <path d="M188 330 h44 v40 h-44 z" fill="#c98e6c" stroke="${K}" stroke-width="${W}"/>
  <ellipse cx="122" cy="236" rx="20" ry="28" fill="#d79c7a" stroke="${K}" stroke-width="${W}"/>
  <ellipse cx="298" cy="236" rx="20" ry="28" fill="#d79c7a" stroke="${K}" stroke-width="${W}"/>
  <path d="M120 206 q0 -118 90 -118 q90 0 90 118 q0 72 -30 108 q-26 30 -60 30 q-34 0 -60 -30 q-30 -36 -30 -108 z" fill="#d79c7a" stroke="${K}" stroke-width="${W}"/>
  <!-- лысина с бликом, седые виски -->
  <ellipse cx="190" cy="118" rx="26" ry="10" fill="#ecb896" opacity=".8"/>
  <path d="M122 214 q-10 -60 26 -86 q-10 40 -6 90 z M298 214 q10 -60 -26 -86 q10 40 6 90 z" fill="#c9c9c9" stroke="${K}" stroke-width="5" stroke-linejoin="round"/>
  <!-- кепка-«таблетка» на затылке не нужна — морщины на лбу -->
  <path d="M168 150 q42 -12 84 0 M176 166 q34 -8 68 0" stroke="#a86f50" stroke-width="5" fill="none" stroke-linecap="round"/>
  <!-- брови кустистые -->
  <g id="${p}-brows"><path d="M150 192 q26 -16 54 -2" stroke="#9a9a9a" stroke-width="14" stroke-linecap="round" fill="none"/>
   <path d="M216 190 q28 -14 54 2" stroke="#9a9a9a" stroke-width="14" stroke-linecap="round" fill="none"/></g>
  <!-- очки на кончике носа -->
  <g id="${p}-eyes"><circle cx="178" cy="222" r="8" fill="${K}"/><circle cx="242" cy="222" r="8" fill="${K}"/></g>
  <g id="${p}-lids" style="transform-origin:210px 222px;transform:scaleY(0)"><path d="M164 228 v-14 h30 v14 z M228 228 v-14 h30 v14 z" fill="#d79c7a"/></g>
  <g fill="none" stroke="${K}" stroke-width="5"><rect x="152" y="230" width="50" height="34" rx="10"/><rect x="218" y="230" width="50" height="34" rx="10"/><path d="M202 244 h16"/></g>
  <path d="M206 228 q-18 36 -2 46 q12 6 22 0" fill="#c98e6c" stroke="${K}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- усы -->
  <path id="${p}-stache" d="M156 290 q20 -24 54 -12 q34 -12 54 12 q-20 10 -54 0 q-34 10 -54 0 z" fill="#b8b8b8" stroke="${K}" stroke-width="5" stroke-linejoin="round"/>
  <g class="mouth" id="${p}-mouth-flat"><path d="M190 306 q20 6 40 0" fill="none" stroke="${K}" stroke-width="6" stroke-linecap="round"/></g>
  <g class="mouth" id="${p}-mouth-talk" style="display:none"><path d="M188 300 q22 34 44 0 z" fill="#5a1e1e" stroke="${K}" stroke-width="6" stroke-linejoin="round"/></g>
  <g class="mouth" id="${p}-mouth-o" style="display:none"><ellipse cx="210" cy="310" rx="12" ry="14" fill="#5a1e1e" stroke="${K}" stroke-width="6"/></g>
  <g class="mouth" id="${p}-mouth-grin" style="display:none"><path d="M188 304 q22 14 44 0" fill="none" stroke="${K}" stroke-width="6" stroke-linecap="round"/></g>
  <g class="mouth" id="${p}-mouth-meh" style="display:none"><path d="M190 310 h40" stroke="${K}" stroke-width="7" stroke-linecap="round"/></g>
 </g>
</svg>`;
  // ---------- БАБА ГАЛЯ: «первая хозяйка». Платок, кофта, юбка, сумка, хитрые глаза за очками ----------
  CHARS.galya = p => `
<svg viewBox="0 0 420 800" class="char" id="${p}">
 <g id="${p}-body">
  <path d="M180 640 v94 M240 640 v94" stroke="#c9a68a" stroke-width="22" stroke-linecap="round"/>
  <path d="M150 744 q0 -22 22 -22 h36 q8 0 8 22 z M206 744 q0 -22 8 -22 h36 q24 0 24 22 z" fill="#3a2a20" stroke="${K}" stroke-width="${W}" stroke-linejoin="round"/>
  <!-- юбка в клетку -->
  <path d="M140 520 q-14 70 -20 140 h180 q-6 -70 -20 -140 z" fill="#6b4c8a" stroke="${K}" stroke-width="${W}" stroke-linejoin="round"/>
  <path d="M150 560 h120 M140 610 h140 M175 520 v140 M245 520 v140" stroke="#4e3570" stroke-width="5"/>
  <!-- кофта вязаная -->
  <path d="M134 420 q-6 70 6 112 h140 q12 -42 6 -112 q-26 -40 -76 -40 q-50 0 -76 40 z" fill="#c4553f" stroke="${K}" stroke-width="${W}" stroke-linejoin="round"/>
  <path d="M210 392 v138" stroke="${K}" stroke-width="5"/>
  <g fill="#f3e3c3" stroke="${K}" stroke-width="3">${[430, 466, 502].map(y => `<circle cx="210" cy="${y}" r="7"/>`).join("")}</g>
  <path d="M150 450 q8 4 16 0 M150 480 q8 4 16 0 M254 450 q8 4 16 0 M254 480 q8 4 16 0" stroke="#9b3a28" stroke-width="4" fill="none"/>
 </g>
 <g id="${p}-armL" style="transform-origin:142px 420px">
  <path d="M142 416 q-30 40 -28 104 q4 16 22 12 q10 -52 30 -84" fill="#c4553f" stroke="${K}" stroke-width="${W}" stroke-linejoin="round"/>
  <!-- сумка -->
  <path d="M96 500 q22 -40 44 0" fill="none" stroke="#3a2a20" stroke-width="7"/>
  <rect x="84" y="500" width="68" height="58" rx="12" fill="#5b3a26" stroke="${K}" stroke-width="${W}"/><circle cx="118" cy="520" r="5" fill="#f5c542"/>
  <circle cx="126" cy="532" r="15" fill="#e7b896" stroke="${K}" stroke-width="${W}"/>
 </g>
 <g id="${p}-armR" style="transform-origin:278px 420px">
  <path d="M278 416 q30 40 30 104 q-4 16 -22 12 q-10 -52 -30 -84" fill="#c4553f" stroke="${K}" stroke-width="${W}" stroke-linejoin="round"/>
  <circle cx="294" cy="532" r="15" fill="#e7b896" stroke="${K}" stroke-width="${W}"/>
 </g>
 <g id="${p}-head" style="transform-origin:210px 392px">
  <!-- платок -->
  <path d="M118 250 q-8 -150 92 -156 q100 6 92 156 q-6 70 -40 104 l-52 4 l-52 -4 q-34 -34 -40 -104 z" fill="#e8c547" stroke="${K}" stroke-width="${W}" stroke-linejoin="round"/>
  <g fill="#c2402f">${[[150, 140], [210, 120], [270, 140], [140, 200], [280, 200], [160, 300], [260, 300]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9"/>`).join("")}</g>
  <path d="M170 360 l40 30 l40 -30 l-14 -10 h-52 z" fill="#e8c547" stroke="${K}" stroke-width="6" stroke-linejoin="round"/>
  <path d="M146 220 q0 -80 64 -80 q64 0 64 80 q0 56 -20 84 q-18 24 -44 24 q-26 0 -44 -24 q-20 -28 -20 -84 z" fill="#ecc0a0" stroke="${K}" stroke-width="${W}"/>
  <path d="M150 196 q30 -30 60 -26 q30 -4 60 26 q-30 -14 -60 -12 q-30 -2 -60 12 z" fill="#d9d9d9" stroke="${K}" stroke-width="4"/>
  <path d="M168 270 q-6 10 0 18 M252 270 q6 10 0 18 M178 206 q10 -6 20 0" stroke="#c99878" stroke-width="4" fill="none" stroke-linecap="round"/>
  <g id="${p}-brows"><path d="M168 200 q14 -8 28 0" stroke="#9a9a9a" stroke-width="7" stroke-linecap="round" fill="none"/><path d="M224 200 q14 -8 28 0" stroke="#9a9a9a" stroke-width="7" stroke-linecap="round" fill="none"/></g>
  <g id="${p}-eyes"><path d="M172 226 q12 -10 24 0" stroke="${K}" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M224 226 q12 -10 24 0" stroke="${K}" stroke-width="6" fill="none" stroke-linecap="round"/>
   <circle cx="184" cy="226" r="5" fill="${K}"/><circle cx="236" cy="226" r="5" fill="${K}"/></g>
  <g id="${p}-lids" style="transform-origin:210px 224px;transform:scaleY(0)"><path d="M170 230 v-14 h28 v14 z M222 230 v-14 h28 v14 z" fill="#ecc0a0"/></g>
  <g fill="none" stroke="#7a5230" stroke-width="5"><circle cx="184" cy="226" r="20"/><circle cx="236" cy="226" r="20"/><path d="M204 226 h12"/></g>
  <path d="M208 236 q-12 22 0 28 q8 3 14 -2" fill="#e2ab88" stroke="${K}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
  <ellipse cx="168" cy="262" rx="13" ry="8" fill="#ff8a8a" opacity=".55"/><ellipse cx="252" cy="262" rx="13" ry="8" fill="#ff8a8a" opacity=".55"/>
  <g class="mouth" id="${p}-mouth-flat"><path d="M192 288 q18 10 36 0" fill="none" stroke="${K}" stroke-width="6" stroke-linecap="round"/></g>
  <g class="mouth" id="${p}-mouth-grin" style="display:none"><path d="M188 284 q22 20 44 0" fill="none" stroke="${K}" stroke-width="6" stroke-linecap="round"/><rect x="214" y="288" width="10" height="8" fill="#f5c542"/></g>
  <g class="mouth" id="${p}-mouth-talk" style="display:none"><path d="M190 282 q20 32 40 0 z" fill="#5a1e1e" stroke="${K}" stroke-width="6" stroke-linejoin="round"/></g>
  <g class="mouth" id="${p}-mouth-o" style="display:none"><ellipse cx="210" cy="292" rx="10" ry="14" fill="#5a1e1e" stroke="${K}" stroke-width="6"/></g>
  <g class="mouth" id="${p}-mouth-meh" style="display:none"><path d="M194 292 h32" stroke="${K}" stroke-width="7" stroke-linecap="round"/></g>
 </g>
</svg>`;
})();
