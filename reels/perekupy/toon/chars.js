// Персонажи сериала «Перекупы»: векторные, разобраны на части для анимации кодом.
// У каждой части свой id-префикс: <pfx>-head, -eyes, -lids, -mouth-*, -armL, -armR, -sweat …
// Рот переключается классом: показываем один из -mouth-grin / -talk / -o / -nerv / -flat.
(function () {
  const K = "#151515", W = 7;            // контур
  window.CHARS = {};

  // ---------- ТОЛЯН: перекуп. Кожанка, барсетка, цепь, золотой зуб ----------
  CHARS.tolyan = p => `
<svg viewBox="0 0 420 800" class="char" id="${p}">
 <g id="${p}-body">
  <!-- ноги: спортивки с лампасами, кроссовки -->
  <path d="M150 560 L140 735 L195 735 L210 600 L225 735 L280 735 L268 560 Z" fill="#232c47" stroke="${K}" stroke-width="${W}" stroke-linejoin="round"/>
  <path d="M152 575 L146 728 M266 575 L272 728" stroke="#f2f2f2" stroke-width="9"/>
  <path d="M120 740 q0 -26 30 -26 h48 q14 0 14 26 z M212 740 q0 -26 14 -26 h48 q32 0 32 26 z" fill="#f4f4f4" stroke="${K}" stroke-width="${W}" stroke-linejoin="round"/>
  <!-- торс: кожанка нараспашку, футболка, цепь -->
  <path d="M118 390 q-10 90 20 178 h146 q30 -88 20 -178 q-30 -40 -93 -40 q-63 0 -93 40 z" fill="#1d1d1f" stroke="${K}" stroke-width="${W}" stroke-linejoin="round"/>
  <path d="M175 360 h70 l-6 205 h-58 z" fill="#f3f3f3" stroke="${K}" stroke-width="5"/>
  <path d="M178 368 q32 52 64 0" fill="none" stroke="#f5c542" stroke-width="9" stroke-linecap="round"/>
  <circle cx="210" cy="420" r="11" fill="#f5c542" stroke="${K}" stroke-width="4"/>
  <path d="M150 380 l25 -20 l6 70 z M270 380 l-25 -20 l-6 70 z" fill="#2c2c30" stroke="${K}" stroke-width="5" stroke-linejoin="round"/>
  <path d="M135 470 q8 -30 6 -60" stroke="#3a3a40" stroke-width="6" fill="none" stroke-linecap="round"/>
 </g>
 <!-- левая рука с барсеткой (вращается у плеча) -->
 <g id="${p}-armL" style="transform-origin:128px 400px">
  <path d="M128 395 q-38 40 -40 120 q2 18 22 16 q22 -60 44 -96" fill="#1d1d1f" stroke="${K}" stroke-width="${W}" stroke-linejoin="round"/>
  <rect x="58" y="470" width="78" height="58" rx="12" fill="#7a4520" stroke="${K}" stroke-width="${W}"/>
  <path d="M66 486 h62" stroke="#5a3214" stroke-width="5"/><circle cx="97" cy="505" r="6" fill="#f5c542" stroke="${K}" stroke-width="3"/>
  <circle cx="106" cy="532" r="17" fill="#e8b48c" stroke="${K}" stroke-width="${W}"/>
 </g>
 <!-- правая рука с ключами (вращается у плеча) -->
 <g id="${p}-armR" style="transform-origin:292px 400px">
  <path d="M292 395 q38 40 42 118 q-2 18 -22 16 q-22 -58 -44 -94" fill="#1d1d1f" stroke="${K}" stroke-width="${W}" stroke-linejoin="round"/>
  <circle cx="318" cy="530" r="18" fill="#e8b48c" stroke="${K}" stroke-width="${W}"/>
  <g id="${p}-keys"><circle cx="330" cy="556" r="10" fill="none" stroke="#b9b9b9" stroke-width="5"/><rect x="324" y="562" width="14" height="30" rx="4" fill="#2b2b2b" stroke="${K}" stroke-width="3"/></g>
 </g>
 <!-- голова (вращается у шеи) -->
 <g id="${p}-head" style="transform-origin:210px 360px">
  <path d="M188 330 h44 v40 h-44 z" fill="#d9a07a" stroke="${K}" stroke-width="${W}"/>
  <ellipse cx="122" cy="232" rx="20" ry="28" fill="#e8b48c" stroke="${K}" stroke-width="${W}"/>
  <ellipse cx="298" cy="232" rx="20" ry="28" fill="#e8b48c" stroke="${K}" stroke-width="${W}"/>
  <path d="M120 200 q0 -120 90 -120 q90 0 90 120 q0 70 -30 108 q-26 32 -60 32 q-34 0 -60 -32 q-30 -38 -30 -108 z" fill="#e8b48c" stroke="${K}" stroke-width="${W}"/>
  <!-- ёжик -->
  <path d="M124 178 q-2 -96 86 -98 q88 2 86 98 q-30 -36 -86 -38 q-56 2 -86 38 z" fill="#4a3a2e" stroke="${K}" stroke-width="5"/>
  <g fill="#3a2d22">${Array.from({ length: 30 }, (_, i) => `<circle cx="${140 + (i * 37) % 140}" cy="${100 + (i * 23) % 38}" r="2.4"/>`).join("")}</g>
  <!-- щетина -->
  <path d="M146 262 q4 64 64 74 q60 -10 64 -74 q-20 30 -64 34 q-44 -4 -64 -34 z" fill="#c99b78" opacity=".55"/>
  <g fill="#7b5a44" opacity=".6">${Array.from({ length: 40 }, (_, i) => `<circle cx="${156 + (i * 41) % 110}" cy="${284 + (i * 17) % 44}" r="1.8"/>`).join("")}</g>
  <!-- брови -->
  <g id="${p}-brows"><path d="M150 186 q28 -14 52 -2" stroke="${K}" stroke-width="12" stroke-linecap="round" fill="none"/>
   <path d="M218 184 q26 -12 52 2" stroke="${K}" stroke-width="12" stroke-linecap="round" fill="none"/></g>
  <!-- глаза: прищур хитреца -->
  <g id="${p}-eyes"><ellipse cx="176" cy="214" rx="20" ry="16" fill="#fff" stroke="${K}" stroke-width="5"/><circle cx="182" cy="216" r="8" fill="${K}"/>
   <ellipse cx="244" cy="214" rx="20" ry="16" fill="#fff" stroke="${K}" stroke-width="5"/><circle cx="250" cy="216" r="8" fill="${K}"/></g>
  <g id="${p}-lids" style="transform-origin:210px 214px"><path d="M154 216 a22 18 0 0 1 44 0 z M222 216 a22 18 0 0 1 44 0 z" fill="#e8b48c"/><path d="M152 216 h48 M220 216 h48" stroke="${K}" stroke-width="6" stroke-linecap="round"/></g>
  <g id="${p}-shades" style="display:none"><path d="M146 200 h62 q4 34 -28 36 q-34 0 -34 -36 z M212 200 h62 q0 36 -34 36 q-32 -2 -28 -36 z" fill="#0d0d10" stroke="${K}" stroke-width="5" stroke-linejoin="round"/>
   <path d="M206 206 h8" stroke="${K}" stroke-width="6"/><path d="M158 208 l14 0 M224 208 l14 0" stroke="#5b6170" stroke-width="5" stroke-linecap="round"/></g>
  <path id="${p}-pick" d="M246 296 l38 -10" stroke="#d9b37a" stroke-width="5" stroke-linecap="round" style="display:none"/>
  <!-- нос -->
  <path d="M206 222 q-16 34 -2 44 q10 6 20 0" fill="#d9a07a" stroke="${K}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- рты -->
  <g class="mouth" id="${p}-mouth-grin"><path d="M160 282 q50 44 100 0 q-50 18 -100 0 z" fill="#fff" stroke="${K}" stroke-width="6" stroke-linejoin="round"/><rect x="214" y="288" width="16" height="16" fill="#f5c542" stroke="${K}" stroke-width="3"/></g>
  <g class="mouth" id="${p}-mouth-talk" style="display:none"><path d="M166 280 q44 60 88 0 z" fill="#5a1e1e" stroke="${K}" stroke-width="6" stroke-linejoin="round"/><path d="M168 282 h84 v10 h-84 z" fill="#fff"/><rect x="214" y="282" width="14" height="10" fill="#f5c542"/><ellipse cx="210" cy="312" rx="18" ry="8" fill="#e05a5a"/></g>
  <g class="mouth" id="${p}-mouth-o" style="display:none"><ellipse cx="210" cy="294" rx="18" ry="24" fill="#5a1e1e" stroke="${K}" stroke-width="6"/></g>
  <g class="mouth" id="${p}-mouth-nerv" style="display:none"><path d="M168 290 q14 -12 28 0 t28 0 t28 0" fill="none" stroke="${K}" stroke-width="7" stroke-linecap="round"/><rect x="214" y="284" width="14" height="12" fill="#f5c542" stroke="${K}" stroke-width="3"/></g>
  <!-- капля пота -->
  <path id="${p}-sweat" d="M300 150 q14 24 0 34 q-14 -10 0 -34 z" fill="#7cc8ff" stroke="${K}" stroke-width="4" opacity="0"/>
 </g>
</svg>`;

  // ---------- СЕРЁГА: покупатель. Худи, рюкзак, наивные большие глаза ----------
  CHARS.seryoga = p => `
<svg viewBox="0 0 420 800" class="char" id="${p}">
 <g id="${p}-body">
  <path d="M158 560 L150 735 L200 735 L210 600 L220 735 L270 735 L262 560 Z" fill="#3d6fb6" stroke="${K}" stroke-width="${W}" stroke-linejoin="round"/>
  <path d="M130 740 q0 -24 26 -24 h42 q12 0 12 24 z M210 740 q0 -24 12 -24 h42 q28 0 28 24 z" fill="#ff8a3d" stroke="${K}" stroke-width="${W}" stroke-linejoin="round"/>
  <path d="M128 395 q-8 88 20 172 h124 q28 -84 20 -172 q-28 -36 -82 -36 q-54 0 -82 36 z" fill="#25b39b" stroke="${K}" stroke-width="${W}" stroke-linejoin="round"/>
  <path d="M168 372 q42 40 84 0" fill="none" stroke="${K}" stroke-width="5"/>
  <path d="M190 392 v46 M230 392 v46" stroke="#f2f2f2" stroke-width="6" stroke-linecap="round"/>
  <rect x="160" y="470" width="100" height="44" rx="12" fill="#1f9a85" stroke="${K}" stroke-width="5"/>
  <path d="M140 392 q-6 60 6 120 M280 392 q6 60 -6 120" stroke="#1a6e60" stroke-width="10" fill="none"/>
 </g>
 <g id="${p}-armL" style="transform-origin:136px 404px">
  <path d="M136 398 q-34 46 -32 120 q4 16 22 12 q12 -60 36 -96" fill="#25b39b" stroke="${K}" stroke-width="${W}" stroke-linejoin="round"/>
  <circle cx="116" cy="530" r="17" fill="#f2c9a5" stroke="${K}" stroke-width="${W}"/>
 </g>
 <g id="${p}-armR" style="transform-origin:284px 404px">
  <path d="M284 398 q34 46 34 120 q-4 16 -22 12 q-12 -60 -36 -96" fill="#25b39b" stroke="${K}" stroke-width="${W}" stroke-linejoin="round"/>
  <circle cx="306" cy="530" r="17" fill="#f2c9a5" stroke="${K}" stroke-width="${W}"/>
  <!-- толщиномер в руке -->
  <g id="${p}-gauge" opacity="0"><rect x="280" y="470" width="62" height="96" rx="14" fill="#ffd23f" stroke="${K}" stroke-width="6"/>
   <rect x="290" y="484" width="42" height="30" rx="5" fill="#1b2a1b" stroke="${K}" stroke-width="3"/><circle cx="311" cy="540" r="9" fill="#e63946" stroke="${K}" stroke-width="3"/>
   <path d="M311 566 v26" stroke="${K}" stroke-width="7" stroke-linecap="round"/></g>
 </g>
 <g id="${p}-head" style="transform-origin:210px 368px">
  <path d="M192 330 h36 v42 h-36 z" fill="#e6b896" stroke="${K}" stroke-width="${W}"/>
  <ellipse cx="128" cy="236" rx="18" ry="26" fill="#f2c9a5" stroke="${K}" stroke-width="${W}"/>
  <ellipse cx="292" cy="236" rx="18" ry="26" fill="#f2c9a5" stroke="${K}" stroke-width="${W}"/>
  <path d="M126 210 q0 -120 84 -120 q84 0 84 120 q0 66 -26 100 q-24 30 -58 30 q-34 0 -58 -30 q-26 -34 -26 -100 z" fill="#f2c9a5" stroke="${K}" stroke-width="${W}"/>
  <!-- лохматая чёлка -->
  <path d="M120 196 q-6 -112 92 -116 q96 2 88 112 q-18 -26 -40 -30 q6 22 -6 30 q-14 -34 -44 -36 q4 26 -12 34 q-12 -30 -38 -28 q-26 6 -40 34 z" fill="#8a5a2b" stroke="${K}" stroke-width="6" stroke-linejoin="round"/>
  <g id="${p}-brows"><path d="M156 178 q22 -12 42 -2" stroke="${K}" stroke-width="9" stroke-linecap="round" fill="none"/>
   <path d="M222 176 q20 -10 42 2" stroke="${K}" stroke-width="9" stroke-linecap="round" fill="none"/></g>
  <!-- большие наивные глаза -->
  <g id="${p}-eyes"><ellipse cx="178" cy="222" rx="26" ry="30" fill="#fff" stroke="${K}" stroke-width="5"/><circle cx="182" cy="228" r="13" fill="${K}"/><circle cx="187" cy="222" r="4" fill="#fff"/>
   <ellipse cx="244" cy="222" rx="26" ry="30" fill="#fff" stroke="${K}" stroke-width="5"/><circle cx="248" cy="228" r="13" fill="${K}"/><circle cx="253" cy="222" r="4" fill="#fff"/></g>
  <g id="${p}-lids" style="transform-origin:210px 196px;transform:scaleY(0)"><path d="M150 222 v-34 h56 v34 z M216 222 v-34 h56 v34 z" fill="#f2c9a5" stroke="${K}" stroke-width="5"/></g>
  <path d="M208 240 q-10 22 4 28" fill="none" stroke="${K}" stroke-width="5" stroke-linecap="round"/>
  <ellipse cx="160" cy="276" rx="16" ry="9" fill="#ff9c8a" opacity=".55"/><ellipse cx="262" cy="276" rx="16" ry="9" fill="#ff9c8a" opacity=".55"/>
  <g class="mouth" id="${p}-mouth-flat"><path d="M188 296 q22 12 44 0" fill="none" stroke="${K}" stroke-width="6" stroke-linecap="round"/></g>
  <g class="mouth" id="${p}-mouth-talk" style="display:none"><path d="M186 290 q24 44 48 0 z" fill="#5a1e1e" stroke="${K}" stroke-width="6" stroke-linejoin="round"/><ellipse cx="210" cy="306" rx="11" ry="6" fill="#e05a5a"/></g>
  <g class="mouth" id="${p}-mouth-o" style="display:none"><ellipse cx="210" cy="300" rx="12" ry="16" fill="#5a1e1e" stroke="${K}" stroke-width="6"/></g>
  <g class="mouth" id="${p}-mouth-meh" style="display:none"><path d="M188 300 h44" stroke="${K}" stroke-width="7" stroke-linecap="round"/></g>
 </g>
</svg>`;

  // ---------- машина сбоку: белая «Приора», отдельные части для анимации ----------
  CHARS.car = (p, glass = 1, body = "#f4f6f8", glassCol = "#9cc7e6") => `
<svg viewBox="0 0 900 360" class="car" id="${p}">
 <ellipse cx="450" cy="336" rx="400" ry="18" fill="rgba(0,0,0,.25)"/>
 <path d="M60 250 q-6 -60 40 -74 l120 -24 q60 -80 150 -88 h170 q70 6 130 84 l110 22 q44 10 50 60 v40 q0 14 -14 14 h-546 q-14 0 -14 -14 z" fill="${body}" stroke="${K}" stroke-width="8" stroke-linejoin="round"/>
 <path d="M244 150 q50 -64 128 -70 h70 v72 z" fill="${glassCol}" fill-opacity="${glass}" stroke="${K}" stroke-width="6" stroke-linejoin="round"/>
 <path d="M460 80 h80 q60 6 106 70 h-186 z" fill="${glassCol}" fill-opacity="${glass}" stroke="${K}" stroke-width="6" stroke-linejoin="round"/>
 <path d="M452 80 v196" stroke="${K}" stroke-width="5"/>
 <path d="M248 160 v116 M650 158 v118" stroke="#c9ced4" stroke-width="5"/>
 <rect x="390" y="182" width="40" height="10" rx="5" fill="#9aa1a8"/><rect x="590" y="182" width="40" height="10" rx="5" fill="#9aa1a8"/>
 <path d="M60 236 h40 M800 230 h40" stroke="#ffb703" stroke-width="12" stroke-linecap="round"/>
 <g id="${p}-door"><path d="M454 158 h194 v118 h-194 z" fill="none"/></g>
 <g id="${p}-hood"><path d="M650 152 l120 22 q36 8 42 46" fill="none" stroke="${K}" stroke-width="0"/></g>
 <g><circle cx="210" cy="292" r="56" fill="#2b2b2e" stroke="${K}" stroke-width="8"/><circle cx="210" cy="292" r="26" fill="#c7cbd0" stroke="${K}" stroke-width="5"/>
    <circle cx="700" cy="292" r="56" fill="#2b2b2e" stroke="${K}" stroke-width="8"/><circle cx="700" cy="292" r="26" fill="#c7cbd0" stroke="${K}" stroke-width="5"/></g>
</svg>`;

  // переключение рта: show(pfx, "talk")
  window.mouth = (pfx, name) => {
    document.querySelectorAll(`#${pfx} .mouth`).forEach(m => { m.style.display = m.id === `${pfx}-mouth-${name}` ? "" : "none"; });
  };
})();
