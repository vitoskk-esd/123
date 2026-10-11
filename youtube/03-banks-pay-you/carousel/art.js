// Арт-библиотека ролика №3 (11.10): единый стиль кадров — ночная иллюстрация без 3D, мягкий объём градиентами, контровой
// свет, глубина резкости (размытый передний план), зерно. Палитра: ночь #070b17–#1b2350, жёлтый #ffd60a (курьер, монеты),
// зелёный #2ee07a (деньги пришли), фиолетовый #8a5cf6 (друг), бирюзовый #2ec4b6 (герой), красный #ff3d4f (опасность).
// Персонажи: герой (худи бирюзовое), курьер (жёлтый короб), друг (фиолетовое худи). Всё — SVG-строки, координаты 1920×1080.
(function () {
  const A = {};
  const rnd = (seed) => { let s = seed % 2147483647 || 1; return () => (s = (s * 16807) % 2147483647) / 2147483647; };
  A.rnd = rnd;
  const lerp = (a, b, k) => a + (b - a) * k;
  A.lerp = lerp;

  A.defs = () => `<defs>
    <filter id="b2" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2"/></filter>
    <filter id="b6" x="-150%" y="-150%" width="400%" height="400%"><feGaussianBlur stdDeviation="6"/></filter>
    <filter id="b14" x="-150%" y="-150%" width="400%" height="400%"><feGaussianBlur stdDeviation="14"/></filter>
    <filter id="b30" x="-150%" y="-150%" width="400%" height="400%"><feGaussianBlur stdDeviation="30"/></filter>
    <filter id="b60" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="60"/></filter>
    <filter id="glow" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="10" result="g"/><feMerge><feMergeNode in="g"/><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <filter id="soft" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="18" stdDeviation="18" flood-color="#000" flood-opacity=".45"/></filter>
    <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .09 0"/></filter>
    <radialGradient id="coinG" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="#fff6c2"/><stop offset=".45" stop-color="#ffd60a"/><stop offset="1" stop-color="#c48f00"/></radialGradient>
    <linearGradient id="boxG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffe45c"/><stop offset=".55" stop-color="#ffd000"/><stop offset="1" stop-color="#d9a400"/></linearGradient>
    <radialGradient id="vig" cx="50%" cy="50%" r="75%"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".62"/></radialGradient>
    <linearGradient id="glass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity=".16"/><stop offset="1" stop-color="#ffffff" stop-opacity=".05"/></linearGradient>
  </defs>`;

  // финиш кадра: виньетка + зерно
  A.finish = () => `<rect width="1920" height="1080" fill="url(#vig)"/><rect width="1920" height="1080" filter="url(#grain)" opacity=".55"/>`;

  A.coin = (x, y, r = 40, o = {}) => `<g transform="translate(${x} ${y}) rotate(${o.rot || 0}) scale(${o.sx ?? 1} 1)" opacity="${o.op ?? 1}" ${o.blur ? `filter="url(#${o.blur})"` : ""}>
    <circle r="${r * 1.5}" fill="#ffd60a" opacity=".18" filter="url(#b14)"/>
    <circle cy="${r * .12}" r="${r}" fill="#a87a00"/><circle r="${r}" fill="url(#coinG)"/><circle r="${r * .78}" fill="none" stroke="#c99400" stroke-width="${r * .07}" opacity=".7"/>
    <text y="${r * .36}" text-anchor="middle" font-family="Unb" font-weight="900" font-size="${r * 1.0}" fill="#8a6300">₽</text>
    <path d="M${-r * .62} ${-r * .38} A${r * .8} ${r * .8} 0 0 1 ${r * .1} ${-r * .74}" stroke="#fff" stroke-width="${r * .1}" fill="none" stroke-linecap="round" opacity=".7"/></g>`;

  // подпись-заголовок: [{t, size, color, font, w}] от (x, y) вниз
  A.title = (x, y, lines, o = {}) => { let yy = y, s = "";
    lines.forEach(L => { const fs = L.size || 96; yy += fs * (L.lh || 1.08);
      s += `<text x="${x}" y="${yy}" font-family="${L.font || "Unb"}" font-weight="${L.w || 900}" font-size="${fs}" fill="${L.color || "#f5f1e8"}" letter-spacing="${L.ls ?? -.02}em" ${L.anchor ? `text-anchor="${L.anchor}"` : ""} ${L.op ? `opacity="${L.op}"` : ""}>${L.t}</text>`; });
    return `<g ${o.shadow !== false ? 'filter="url(#soft)"' : ""}>${s}</g>`; };

  // плашка главы вверху слева и сноска внизу
  A.chapter = (num, name, time) => `<g transform="translate(80 70)">
    <rect width="${num.length * 22 + 44}" height="54" rx="27" fill="#ffd60a"/><text x="22" y="37" font-family="Unb" font-weight="900" font-size="24" fill="#0b0f1c" letter-spacing=".04em">${num}</text>
    <text x="${num.length * 22 + 66}" y="37" font-family="Mont" font-weight="700" font-size="28" fill="#f5f1e8">${name}</text>
    ${time ? `<text x="0" y="96" font-family="Mono" font-size="20" fill="#8fa2d6" letter-spacing=".08em">${time}</text>` : ""}</g>`;
  A.foot = (txt = "Условия на дату записи, проверяй на сайте банка. Не реклама конкретного банка") =>
    `<text x="960" y="1050" text-anchor="middle" font-family="Mont" font-weight="500" font-size="22" fill="#c9d3f2" opacity=".55">${txt}</text>`;
  A.note = (x, y, txt, o = {}) => `<text x="${x}" y="${y}" font-family="Mont" font-weight="600" font-size="${o.size || 24}" fill="${o.color || "#9fb0dd"}" ${o.anchor ? `text-anchor="${o.anchor}"` : ""}>${txt}</text>`;

  // «таблетка» с текстом (бейдж суммы, категория)
  A.pill = (x, y, txt, o = {}) => { const fs = o.size || 34, w = o.w || txt.length * fs * .62 + fs * 1.3, h = fs * 1.9;
    return `<g transform="translate(${x} ${y}) rotate(${o.rot || 0})" ${o.noshadow ? "" : 'filter="url(#soft)"'}><rect x="${o.center ? -w / 2 : 0}" y="${-h / 2}" width="${w}" height="${h}" rx="${h / 2}" fill="${o.bg || "#2ee07a"}" ${o.stroke ? `stroke="${o.stroke}" stroke-width="2"` : ""}/>
      <text x="${o.center ? 0 : w / 2}" y="${fs * .36}" text-anchor="middle" font-family="${o.font || "Mont"}" font-weight="800" font-size="${fs}" fill="${o.fg || "#06140b"}">${txt}</text></g>`; };

  // дождь: косые штрихи, ближние — крупнее и размыты
  A.rain = (seed, n = 260, o = {}) => { const r = rnd(seed), ang = o.ang ?? 12, dx = Math.tan(ang * Math.PI / 180); let s = "";
    for (let i = 0; i < n; i++) { const z = r(), x = r() * 2100 - 90, y = r() * 1180 - 50, L = 30 + z * 110;
      s += `<line x1="${x}" y1="${y}" x2="${x - dx * L}" y2="${y + L}" stroke="#c8d8ff" stroke-width="${(1 + z * 2.6).toFixed(1)}" stroke-linecap="round" opacity="${(.1 + z * .32).toFixed(2)}"/>`; }
    return `<g ${o.blur ? `filter="url(#${o.blur})"` : ""}>${s}</g>`; };

  // боке (огни города в размытии)
  A.bokeh = (seed, n, box, cols, o = {}) => { const r = rnd(seed); let s = "";
    for (let i = 0; i < n; i++) { const [x0, y0, x1, y1] = box, rr = (o.r0 || 10) + r() * (o.r1 || 40);
      s += `<circle cx="${lerp(x0, x1, r())}" cy="${lerp(y0, y1, r())}" r="${rr}" fill="${cols[Math.floor(r() * cols.length)]}" opacity="${(.15 + r() * .45).toFixed(2)}"/>`; }
    return `<g filter="url(#${o.blur || "b6"})">${s}</g>`; };

  const limb = (pts, w, col, extra = "") => `<path d="M${pts.map(p => p.join(" ")).join(" L")}" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" fill="none" ${extra}/>`;
  A.limb = limb;

  // человек анфас/вполоборота. Начало координат — между стоп. pose: точки локтя/кисти, колена/стопы; c — цвета
  A.person = (o = {}) => {
    const c = Object.assign({ top: "#2ec4b6", topD: "#1f9a8f", topL: "#7ff0e4", pants: "#1d2747", pantsD: "#141b33", skin: "#f1c48f", skinD: "#dba46c", hair: "#2b1a10", shoe: "#f3f3f3", sole: "#c9ccd6" }, o.c || {});
    const P = Object.assign({ la: [[-64, -215], [-60, -148]], ra: [[64, -215], [60, -148]], ll: [[-22, -88], [-24, 0]], rl: [[22, -88], [24, 0]], tilt: 0, mouth: "smile", eyes: "open", look: 0 }, o.pose || {});
    const shL = [-44, -282], shR = [44, -282], hpL = [-20, -168], hpR = [20, -168];
    const shoe = (f, side) => `<g transform="translate(${f[0] + side * 4} ${f[1]})"><ellipse cx="${side * 8}" cy="-6" rx="26" ry="13" fill="${c.shoe}"/><rect x="${side * 8 - 26}" y="-4" width="52" height="7" rx="3" fill="${c.sole}"/></g>`;
    const leg = (hp, L, side) => limb([hp, L[0], L[1]], 34, side > 0 ? c.pantsD : c.pants) + shoe(L[1], side);
    const arm = (sh, L, dark) => limb([sh, L[0], L[1]], 26, dark ? c.topD : c.top) + `<circle cx="${L[1][0]}" cy="${L[1][1]}" r="12.5" fill="${dark ? c.skinD : c.skin}"/>`;
    const face = () => { const lk = P.look * 6;
      const eyes = P.eyes === "closed" ? `<path d="M${-19 + lk} -337 q7 5 14 0 M${5 + lk} -337 q7 5 14 0" stroke="#2a1a12" stroke-width="3.4" fill="none" stroke-linecap="round"/>`
        : `<ellipse cx="${-12 + lk}" cy="-338" rx="4.2" ry="5.2" fill="#22150e"/><ellipse cx="${12 + lk}" cy="-338" rx="4.2" ry="5.2" fill="#22150e"/><circle cx="${-10.5 + lk}" cy="-340" r="1.4" fill="#fff"/><circle cx="${13.5 + lk}" cy="-340" r="1.4" fill="#fff"/>`;
      const m = { smile: `<path d="M${-9 + lk} -318 q9 8 18 0" stroke="#7a3b22" stroke-width="3.4" fill="none" stroke-linecap="round"/>`,
        open: `<path d="M${-10 + lk} -320 q10 14 20 0z" fill="#7a3b22"/>`, flat: `<path d="M${-7 + lk} -318 h14" stroke="#7a3b22" stroke-width="3.4" stroke-linecap="round"/>`,
        sad: `<path d="M${-8 + lk} -314 q8 -7 16 0" stroke="#7a3b22" stroke-width="3.4" fill="none" stroke-linecap="round"/>` }[P.mouth];
      return eyes + `<path d="M${-20 + lk} -350 q8 -5 15 -1 M${5 + lk} -351 q8 -4 15 1" stroke="${c.hair}" stroke-width="3.6" fill="none" stroke-linecap="round"/>` + m +
        `<circle cx="${-22 + lk}" cy="-324" r="7" fill="#ff7a7a" opacity=".22"/><circle cx="${22 + lk}" cy="-324" r="7" fill="#ff7a7a" opacity=".22"/>`; };
    const head = `<g transform="rotate(${P.tilt} 0 -300)"><rect x="-11" y="-312" width="22" height="22" rx="6" fill="${c.skinD}"/>
      <circle cx="-34" cy="-334" r="8" fill="${c.skinD}"/><circle cx="34" cy="-334" r="8" fill="${c.skinD}"/>
      <circle cx="0" cy="-338" r="35" fill="${c.skin}"/><path d="M18 -366 a35 35 0 0 1 6 52 a40 40 0 0 0 -6 -52z" fill="${c.skinD}" opacity=".35"/>
      ${o.hair === "bun" ? `<circle cx="0" cy="-384" r="17" fill="${c.hair}"/>` : ""}
      <path d="M-36 -340 C-40 -386 40 -392 36 -342 C30 -358 14 -366 -2 -362 C-16 -366 -30 -358 -36 -340Z" fill="${c.hair}"/>
      ${o.hair === "long" ? `<path d="M-36 -345 C-46 -300 -40 -280 -30 -270 L-26 -330Z M36 -345 C46 -300 40 -280 30 -270 L26 -330Z" fill="${c.hair}"/>` : ""}
      ${o.cap ? `<path d="M-37 -346 C-36 -392 36 -392 37 -346Z" fill="${o.cap}"/><path d="M8 -350 h46 a6 6 0 0 1 0 10 h-46z" fill="${o.cap}"/>` : ""}
      ${o.back ? `<path d="M-37 -336 C-40 -394 40 -394 37 -336 C36 -314 22 -302 0 -301 C-22 -302 -36 -314 -37 -336Z" fill="${c.hair}"/><path d="M-22 -372 C-10 -386 14 -386 24 -370" stroke="#fff" stroke-opacity=".18" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M-30 -330 q14 10 30 6 M4 -318 q14 -2 26 -14" stroke="#000" stroke-opacity=".25" stroke-width="3" fill="none"/>` : face()}</g>`;
    const torso = `<path d="M-50 -286 C-62 -246 -56 -196 -48 -150 L48 -150 C56 -196 62 -246 50 -286 C30 -300 -30 -300 -50 -286Z" fill="${c.top}"/>
      <path d="M16 -296 C42 -292 62 -250 50 -150 L30 -150 C38 -200 36 -262 16 -296Z" fill="${c.topD}"/>
      <path d="M-50 -286 C-58 -250 -56 -210 -52 -180" stroke="${c.topL}" stroke-width="4" fill="none" opacity=".55" stroke-linecap="round"/>
      <path d="M-28 -206 L28 -206 L33 -168 L-33 -168Z" fill="${c.topD}" opacity=".55"/>
      <ellipse cx="0" cy="-290" rx="36" ry="13" fill="${c.topD}"/>
      <path d="M-9 -284 v34 M9 -284 v30" stroke="${c.topL}" stroke-width="3.5" stroke-linecap="round" opacity=".9"/>
      <rect x="-50" y="-160" width="100" height="16" rx="8" fill="${c.topD}"/>`;
    const back = arm(shR, P.ra, true), front = arm(shL, P.la, false);
    const extra = o.phone ? A.handPhone(P[o.phone][1], o.phoneRot || 0, o.phoneScreen) : "";
    const hood = o.back ? `<path d="M-40 -292 C-46 -246 46 -246 40 -292 C20 -300 -20 -300 -40 -292Z" fill="${c.topD}"/>` : "";
    return `<g transform="translate(${o.x || 0} ${o.y || 0}) scale(${(o.flip ? -1 : 1) * (o.s || 1)} ${o.s || 1})">
      ${o.noShadow ? "" : `<ellipse cx="0" cy="4" rx="90" ry="16" fill="#000" opacity=".4" filter="url(#b6)"/>`}
      ${o.behind || ""}${back}${leg(hpR, P.rl, 1)}${leg(hpL, P.ll, -1)}${torso}${hood}${head}${front}${extra}${o.front || ""}</g>`;
  };
  // телефон в руке (маленький, экран светится)
  A.handPhone = (h, rot, screen = "#5fd0ff") => `<g transform="translate(${h[0]} ${h[1]}) rotate(${rot})"><rect x="-17" y="-52" width="34" height="62" rx="7" fill="#11151f"/><rect x="-14" y="-48" width="28" height="52" rx="5" fill="${screen}"/>
    <circle r="40" cy="-20" fill="${screen}" opacity=".25" filter="url(#b14)"/><circle r="12" fill="${"#f1c48f"}"/></g>`;

  // курьер сбоку, идёт вправо (капюшон, светоотражающая полоса, жёлтый короб за спиной)
  A.courierSide = (o = {}) => { const ph = o.phase ?? .3, sw = Math.sin(ph * Math.PI * 2);
    const kneeF = [26 + sw * 10, -92], footF = [44 + sw * 22, 0], kneeB = [-24 - sw * 6, -90], footB = [-48 - sw * 16, -2];
    const rim = o.rim || "#ff9a4a";
    return `<g transform="translate(${o.x || 0} ${o.y || 0}) scale(${(o.flip ? -1 : 1) * (o.s || 1)} ${o.s || 1})">
      <ellipse cx="0" cy="6" rx="110" ry="16" fill="#000" opacity=".45" filter="url(#b6)"/>
      ${limb([[-6, -232], [26, -196], [46, -160]], 24, "#1b2440")}<circle cx="46" cy="-158" r="11" fill="#c99467"/>
      ${limb([[-4, -168], kneeB, footB], 32, "#151c33")}<path d="M${footB[0] - 22} ${footB[1] - 4} h46 a8 8 0 0 1 0 12 h-46z" fill="#0b0f1c"/>
      ${limb([[6, -168], kneeF, footF], 32, "#1e2747")}<path d="M${footF[0] - 20} ${footF[1] - 6} h48 a8 8 0 0 1 0 12 h-48z" fill="#0b0f1c"/><path d="M${footF[0] - 18} ${footF[1] + 4} h44" stroke="#dfe6ff" stroke-width="3" opacity=".6"/>
      <path d="M-34 -292 C-46 -240 -42 -190 -34 -158 L34 -158 C40 -200 38 -262 24 -294 C6 -306 -20 -304 -34 -292Z" fill="#26325a"/>
      <path d="M-38 -212 L36 -212 L35 -198 L-39 -198Z" fill="#dfe6ff" opacity=".85"/>
      <path d="M24 -294 C38 -262 40 -200 34 -158" stroke="${rim}" stroke-width="5" fill="none" opacity=".75" stroke-linecap="round"/>
      <g transform="rotate(-4 -70 -240)"><rect x="-150" y="-330" width="118" height="150" rx="14" fill="url(#boxG)"/>
        <rect x="-150" y="-330" width="118" height="22" rx="10" fill="#fff07a"/><rect x="-150" y="-262" width="118" height="10" fill="#c99a00" opacity=".55"/>
        <rect x="-112" y="-232" width="42" height="18" rx="5" fill="#c99a00" opacity=".6"/><path d="M-32 -326 v140" stroke="${rim}" stroke-width="5" opacity=".7"/></g>
      <path d="M-34 -292 L-40 -200" stroke="#151c33" stroke-width="9" stroke-linecap="round"/>
      <g><circle cx="16" cy="-334" r="31" fill="#c99467"/><path d="M40 -340 q10 6 2 14" fill="#c99467"/>
        <path d="M-22 -326 C-30 -380 46 -392 50 -350 C44 -356 30 -364 20 -362 C6 -366 -6 -352 -6 -330 C-8 -310 -2 -300 4 -296 L-24 -300Z" fill="#1f2a4d"/>
        <ellipse cx="30" cy="-338" rx="3.6" ry="4.6" fill="#22150e"/><path d="M24 -350 q8 -3 14 1" stroke="#22150e" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M30 -318 q6 2 10 -2" stroke="#6b3420" stroke-width="3" fill="none" stroke-linecap="round"/></g>
      ${limb([[2, -276], [-18 - sw * 8, -222], [-4 - sw * 14, -170]], 25, "#2e3b6a")}<circle cx="${-4 - sw * 14}" cy="-168" r="12" fill="#e2ad7a"/>
      ${o.bag ? `<g transform="translate(${-4 - sw * 14} -150)"><path d="M-20 0 h40 l-4 46 h-32z" fill="#c98b4a"/><path d="M-12 2 v-10 a12 12 0 0 1 24 0 v10" stroke="#7a4f27" stroke-width="4" fill="none"/></g>` : ""}
    </g>`; };

  // банковская карта (без брендов), плоская, со светом
  A.card = (x, y, w, o = {}) => { const h = w * .63, c1 = o.c1 || "#1f6bff", c2 = o.c2 || "#7a3cff", id = "cg" + Math.round(x + y * 7 + w);
    return `<g transform="translate(${x} ${y}) rotate(${o.rot || 0})" ${o.blur ? `filter="url(#${o.blur})"` : 'filter="url(#soft)"'} opacity="${o.op ?? 1}">
      <defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs>
      <rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="${w * .06}" fill="url(#${id})"/>
      <path d="M${-w / 2} ${-h * .1} C${-w * .1} ${-h * .5} ${w * .2} ${h * .3} ${w / 2} ${-h * .2} V${-h / 2 + w * .06} a${w * .06} ${w * .06} 0 0 0 ${-w * .06} ${-w * .06} H${-w / 2 + w * .06} a${w * .06} ${w * .06} 0 0 0 ${-w * .06} ${w * .06}Z" fill="#fff" opacity=".1"/>
      <rect x="${-w * .38}" y="${-h * .18}" width="${w * .15}" height="${w * .11}" rx="${w * .02}" fill="#f4d27a"/>
      <text x="${-w * .38}" y="${h * .3}" font-family="Mono" font-size="${w * .055}" fill="#fff" opacity=".8" letter-spacing=".12em">•••• ${o.num || "2026"}</text>
      ${o.label ? `<text x="${w * .4}" y="${-h * .28}" text-anchor="end" font-family="Unb" font-weight="900" font-size="${w * .075}" fill="#fff">${o.label}</text>` : ""}
      ${o.big ? `<text x="${w * .4}" y="${h * .36}" text-anchor="end" font-family="Unb" font-weight="900" font-size="${w * .22}" fill="#fff" opacity=".95">${o.big}</text>` : ""}
      <rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="${w * .06}" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width="2"/></g>`; };

  // стеклянная карточка-уведомление
  A.notif = (x, y, w, o = {}) => { const h = o.h || 150;
    return `<g transform="translate(${x} ${y}) rotate(${o.rot || 0})" filter="url(#soft)">
      <rect width="${w}" height="${h}" rx="30" fill="${o.bg || "rgba(18,24,44,.82)"}" stroke="#fff" stroke-opacity=".14" stroke-width="2"/>
      <rect x="28" y="30" width="58" height="58" rx="16" fill="${o.ic || "#2ee07a"}"/><text x="57" y="72" text-anchor="middle" font-family="Unb" font-weight="900" font-size="30" fill="#06140b">${o.icon || "₽"}</text>
      <text x="108" y="52" font-family="Mont" font-weight="600" font-size="24" fill="#9fb0dd">${o.app || "Банк · сейчас"}</text>
      <text x="108" y="94" font-family="Mont" font-weight="800" font-size="36" fill="#fff">${o.title}</text>
      ${o.sub ? `<text x="108" y="130" font-family="Mont" font-weight="500" font-size="26" fill="#c9d3f2">${o.sub}</text>` : ""}</g>`; };

  // билинейная точка в четырёхугольнике (для перспективы фасадов)
  A.quad = (q, u, v) => { const [p00, p10, p01, p11] = q; return [lerp(lerp(p00[0], p10[0], u), lerp(p01[0], p11[0], u), v), lerp(lerp(p00[1], p10[1], u), lerp(p01[1], p11[1], u), v)]; };
  A.poly = (pts, fill, extra = "") => `<path d="M${pts.map(p => p.map(n => n.toFixed(1)).join(" ")).join(" L")}Z" fill="${fill}" ${extra}/>`;

  window.A = A;
})();
