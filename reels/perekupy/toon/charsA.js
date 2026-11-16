// «Арбитражники»: Никита — главный герой (владелец 16.11 прислал фото: «сделай Никиту максимально похожим на этого человека»).
// Черты с фото: пышная волнистая каштановая шевелюра с чёлкой набок и торчащими прядями, вытянутое лицо, светлая кожа, голубые глаза,
// длинный прямой нос, широкая открытая улыбка; голубой вязаный свитер на молнии со стойкой, белая футболка; тёмные брюки.
// Основа — CHARS.perekup (те же части и id: -head, -armL, -armR, -mouth-*, -lids), поверх — своя голова и одежда.
// o.cash — веер купюр в правой кисти (рисуется в группе -armR, поворачивается вместе с рукой — у кисти, а не у локтя).
(() => {
  const K = "#151515";
  CHARS.nikita = (p, o = {}) => {
    const hr = "#8a5528", hl = "#b9793c", sk = "#f3cdb0", sd = "#dcae8c", sw = "#9cc3dc", swd = "#7ea6c2";
    let s = CHARS.perekup(p, { jacket: sw, pants: "#3a4250", hair: hr, skin: sk, look: o.look || "grin", item: o.item });
    // 1) шевелюра сзади (за лицом и ушами): широкая пышная масса
    const back = `<path d="M100 262 q-30 -8 -26 -44 q-26 -18 -10 -50 q-18 -34 12 -58 q-2 -40 40 -52 q16 -34 58 -30 q30 -26 66 -8 q40 -8 60 26 q42 6 46 48 q30 26 14 60 q20 30 -6 56 q6 34 -26 44 q-10 -34 -26 -56 l-176 0 q-16 26 -26 64 z" fill="${hr}" stroke="${K}" stroke-width="6" stroke-linejoin="round"/>
      <path d="M86 176 q-14 -14 -6 -30 M104 112 q-6 -18 8 -28 M330 120 q10 -16 -2 -30 M346 190 q14 -14 6 -32" fill="none" stroke="${hl}" stroke-width="6" stroke-linecap="round"/>`;
    s = s.replace(`<ellipse cx="122" cy="232"`, `${back}<ellipse cx="122" cy="232"`);
    // 2) вытянутое лицо (чуть уже и длиннее), светлая кожа
    s = s.replace(`<path d="M120 200 q0 -120 90 -120 q90 0 90 120 q0 70 -30 108 q-26 32 -60 32 q-34 0 -60 -32 q-30 -38 -30 -108 z" fill="${sk}"`,
      `<path d="M126 196 q0 -118 84 -118 q84 0 84 118 q0 80 -26 116 q-24 34 -58 34 q-34 0 -58 -34 q-26 -36 -26 -116 z" fill="${sk}"`);
    // 3) чёлка набок с торчащими прядями (поверх лба, выше бровей)
    const front = `<path d="M118 176 q-6 -88 52 -112 q52 -24 110 -6 q50 18 52 92 q-14 -26 -36 -34 q8 30 -6 54 q-14 -40 -48 -52 q-18 30 -60 36 q12 -18 10 -36 q-40 18 -50 62 q-12 -14 -24 -4 z" fill="${hr}" stroke="${K}" stroke-width="6" stroke-linejoin="round"/>
      <path d="M160 92 q18 -16 40 -14 q20 -14 46 -2 M150 128 q22 -20 48 -16 q26 -16 48 -6 M262 96 q22 6 32 22 q12 10 14 24" fill="none" stroke="${hl}" stroke-width="7" stroke-linecap="round"/>
      <path d="M232 28 q16 -24 36 -18 q-20 6 -22 24 M150 40 q-20 -18 -38 -6 q20 2 26 20 M300 66 q26 -10 38 6 q-22 -2 -30 14" fill="${hr}" stroke="${K}" stroke-width="5" stroke-linejoin="round"/>`;
    s = s.replace(/<path d="M124 186 q-4 -102 86 -104 q90 2 86 104 q-26 -46 -86 -46 q-60 0 -86 46 z"[^>]*\/>/, front);
    // 4) брови светлее, глаза голубые (радужка + зрачок + блик)
    s = s.replace(`<path d="M150 186 q28 -14 52 -2 M218 184 q26 -12 52 2" stroke="${K}" stroke-width="12"`, `<path d="M152 188 q26 -12 50 -2 M218 186 q24 -10 50 2" stroke="#5a3418" stroke-width="10"`);
    for (const cx of [180, 248]) s = s.replace(`<circle cx="${cx}" cy="218" r="7" fill="${K}"/>`,
      `<circle cx="${cx}" cy="218" r="10" fill="#6f9cc6"/><circle cx="${cx}" cy="218" r="5" fill="${K}"/><circle cx="${cx + 3}" cy="214" r="2.6" fill="#fff"/>`);
    // 5) длинный прямой нос
    s = s.replace(`<path d="M206 224 q-14 32 -2 42 q10 6 20 0" fill="${sd}"`, `<path d="M210 214 q-12 38 -8 52 q10 8 22 0" fill="${sd}"`);
    // 6) широкая открытая улыбка с зубами (по умолчанию «grin»)
    s = s.replace(/<path d="M162 282 q48 40 96 0 q-48 16 -96 0 z"[^>]*\/>/,
      `<path d="M156 276 q54 56 108 0 q-54 10 -108 0 z" fill="#7a2a2a" stroke="${K}" stroke-width="6" stroke-linejoin="round"/><path d="M162 278 q48 8 96 0 l-4 12 q-44 8 -88 0 z" fill="#fff"/>`);
    // 7) свитер: стойка на молнии, белая футболка, вязаные рубчики
    s = s.replace(`<path d="M180 356 l30 34 l30 -34" fill="none" stroke="${K}" stroke-width="5"/>`,
      `<path d="M196 356 h28 v14 h-28 z" fill="#f4f4f4" stroke="${K}" stroke-width="4"/><path d="M170 350 q40 -16 80 0 l-4 34 q-36 -12 -72 0 z" fill="${swd}" stroke="${K}" stroke-width="6" stroke-linejoin="round"/>
       <path d="M210 352 v32" stroke="#d8dde2" stroke-width="5"/>${[140, 160, 180, 240, 260, 280].map(x => `<path d="M${x} 400 v150" stroke="${swd}" stroke-width="4" opacity=".7"/>`).join("")}`);
    // 8) веер купюр в правой кисти (кисть — у (318, 530))
    if (o.cash) s = s.replace(new RegExp(`(<g id="${p}-armR"[^>]*>)`), `$1<g transform="translate(318 540)">${[-28, -6, 16].map(a => `<g transform="rotate(${a})"><rect x="-26" y="-96" width="52" height="96" rx="6" fill="#8fd17a" stroke="${K}" stroke-width="5"/><circle cx="0" cy="-48" r="13" fill="none" stroke="#3f7a32" stroke-width="4"/></g>`).join("")}</g>`);
    // 9) телефон у уха: рука поверх пышной шевелюры (иначе волосы прячут телефон и кисть)
    if (o.item === "phone") { const m = s.match(new RegExp(`<g id="${p}-armR"[\\s\\S]*?</g>(?=\\s*<g id="${p}-head")`));
      if (m) s = s.replace(m[0], "").replace(/<\/svg>\s*$/, m[0] + "</svg>"); }
    return s;
  };
})();
