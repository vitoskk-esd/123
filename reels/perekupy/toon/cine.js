// «Киношный» формат «Перекупов» (с части 10, ep47). Сцена = слои мира с глубиной + экранные слои.
// Камера — «план» {x, y, s, r}: точка мира (x, y) в центре кадра, зум s, наклон r (голландский угол).
// Слой глубины d двигается и зумится на долю d от движения камеры: дальний фон (d≈.7) отстаёт, передний план (d≈1.4) обгоняет — параллакс.
// Всё строится строками HTML (для раскадровки) и DOM-ом (для видео — CINE.apply на каждом кадре).
(() => {
  const C = window.CINE = {};
  const CX = 540, CY = 960, FAR_OVER = 1.12;
  C.SIZES = { "w124/w124_34.png": [746, 327], "w124/w124_side.png": [732, 233], "hyundai/hyundai.png": [1138, 360], "hyundai/hyundai_taxi.png": [1138, 360],
    "granta/granta_34.png": [791, 366], "granta/granta_34r.png": [683, 344], "granta/granta_side.png": [777, 266], "vaz2110/vaz2110_34.png": [735, 342],
    "vaz2110/vaz2110_side.png": [749, 252], "camry/camry.png": [1317, 627], "corolla/corolla.png": [1358, 462], "priora/priora_white.png": [1263, 410],
    "priora/priora_black.png": [1263, 410], "vaz2114/vaz2114_white.png": [1006, 332], "markii/markii.png": [983, 467], "niva/niva_34.png": [669, 361],
    "evo/evo_34.png": [796, 371], "vaz2115/vaz2115.png": [1305, 375], "vaz2105/vaz2105_34.png": [775, 352], "x6/x6_34.png": [745, 356], "prado/prado_34.png": [732, 366],
    "bmw/bmw_34.png": [696, 280], "cls/cls_34.png": [787, 338], "vaz2114t/vaz2114t_34.png": [766, 315], "gelik/gelik_34.png": [456, 314] };
  C.IMG = "../../kit/img/";
  // детерминированный «рандом» для дождя/пылинок
  const rnd = seed => () => (seed = (seed * 16807) % 2147483647) / 2147483647;

  // ---- матрица слоя глубины d для плана sh
  C.layerT = (sh, d, over = 1) => {
    const s = (1 + (sh.s - 1) * d) * over, x = CX + (sh.x - CX) * d, y = CY + (sh.y - CY) * d, r = (sh.r || 0) * Math.min(d, 1);
    return `translate(${CX}px,${CY}px) rotate(${r}deg) scale(${s}) translate(${-x}px,${-y}px)`;
  };
  // точка мира (слой d=1) → экран
  C.toScreen = (sh, px, py) => [(px - sh.x) * sh.s + CX, (py - sh.y) * sh.s + CY];

  // ---- герои: x — центр, foot — линия ступней, h — рост (кадр SVG 420×800, ступни на 740)
  // pose: {armL, armR, head (градусы), phone: true — Толян прижал телефон к уху}; o — опции CHARS.perekup; extra: {rim: цвет контрового, side: ±1, dim}
  C.ANCH = {};
  C.ch = (kind, p, x, foot, h, o, pose = {}, extra = {}) => {
    const s = h / 740, l = x - 210 * s, t = foot - 740 * s;
    let svg = CHARS[kind](p, o);
    const rot = (part, deg) => { if (deg != null) svg = svg.replace(new RegExp(`(id="${p}-${part}" style="transform-origin:[^"]*)"`), `$1;transform:rotate(${deg}deg)"`); };
    if (pose.phone) {   // телефон в правой руке — рука согнута к уху
      svg = svg.replace(new RegExp(`(<g id="${p}-armR"[^>]*>)`), `$1<g transform="rotate(170 318 500)"><rect x="296" y="452" width="44" height="80" rx="9" fill="#111" stroke="#151515" stroke-width="5"/><rect x="303" y="461" width="30" height="58" rx="4" fill="#7fd0ff"/></g>`);
      pose = { ...pose, armR: pose.armR ?? -160 };
    }
    rot("armL", pose.armL); rot("armR", pose.armR); rot("head", pose.head);
    const filt = [extra.rim ? `drop-shadow(${(extra.side || -1) * 7}px -2px 0 ${extra.rim})` : "", extra.dim ? `brightness(${extra.dim})` : "", extra.blur ? `blur(${extra.blur}px)` : ""].join(" ");
    C.ANCH[p] = [x, t + 70 * s, s];
    return (extra.noShadow ? "" : C.shadow(x, foot, 300 * s, 46 * s))
      + `<div class="char" data-p="${p}" style="left:${l}px;top:${t}px;width:${420 * s}px;height:${800 * s}px;z-index:${extra.z || 6};filter:${filt || "none"};${extra.style || ""}">${svg}</div>`;
  };
  // контактная тень (под ногами, под машиной)
  C.shadow = (x, y, w, h, a = 1, z = 2) => `<div class="shd" style="left:${x - w / 2}px;top:${y - h / 2}px;width:${w}px;height:${h}px;opacity:${a};z-index:${z}"></div>`;

  // ---- машины: left, ground (низ колёс), w; o: {sheen (0..1 — позиция блика), refl (мокрый асфальт), lights: [[fx, fy, r, цвет]], z, flip, dim}
  C.car = (img, l, ground, w, o = {}) => {
    const [nw, nh] = C.SIZES[img] || [1000, 400], h = w * nh / nw, t = ground - h * .97, src = C.IMG + img;
    const fl = o.flip ? "transform:scaleX(-1);" : "";
    const lights = (o.lights || []).map(([fx, fy, r = 70, c = "#fff6c8"]) => C.glow(l + (o.flip ? 1 - fx : fx) * w, t + fy * h, r, c, .9, (o.z || 5) + 1)).join("");
    return C.shadow(l + w / 2, ground - 4, w * 1.02, h * .22, .95, (o.z || 5) - 1)
      + (o.refl ? `<img class="carw refl" src="${src}" style="left:${l}px;top:${ground - 6}px;width:${w}px;z-index:1;${o.flip ? "transform:scale(-1,-1);" : ""}">` : "")
      + `<div class="carw" style="left:${l}px;top:${t}px;width:${w}px;height:${h}px;z-index:${o.z || 5};${fl}${o.dim ? `filter:brightness(${o.dim})` : ""}">
          <img src="${src}">${o.sheen != null ? `<div class="sheen mk-${img.replace(/[\/.]/g, "-")}" style="background-position:${o.sheen * 100}% 0"></div>` : ""}</div>` + lights;
  };
  // ценник/табличка за лобовым стеклом
  C.tag = (x, y, big, small, rot = -4, z = 7, bg = "#ffd23f") => `<div style="left:${x}px;top:${y}px;z-index:${z};transform:rotate(${rot}deg);background:${bg};border:4px solid #151515;border-radius:8px;padding:4px 10px;
    font-family:Unbounded;font-weight:900;font-size:24px;color:#151515;white-space:nowrap;text-align:center;line-height:1.1">${big}${small ? `<br><span style="font-family:'JetBrains Mono';font-size:16px">${small}</span>` : ""}</div>`;

  // ---- свет
  C.glow = (x, y, r, c = "#ffd27a", a = .8, z = 30) => `<div class="glow" style="left:${x - r}px;top:${y - r}px;width:${2 * r}px;height:${2 * r}px;z-index:${z};opacity:${a};
    background:radial-gradient(closest-side, ${c}, ${c}88 35%, ${c}00)"></div>`;
  // луч/конус: многоугольник в мире, градиент от источника (dir — CSS-угол градиента)
  C.beam = (pts, c = "#fff6c8", a = .35, dir = "180deg", z = 29) => {
    const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]), l = Math.min(...xs), t = Math.min(...ys), w = Math.max(...xs) - l, h = Math.max(...ys) - t;
    return `<div class="beam" style="left:${l}px;top:${t}px;width:${w}px;height:${h}px;z-index:${z};opacity:${a};background:linear-gradient(${dir}, ${c}, ${c}00);
      clip-path:polygon(${pts.map(([x, y]) => `${x - l}px ${y - t}px`).join(",")})"></div>`;
  };

  // ---- экранные эффекты
  C.rain = (n = 140, seed = 7, a = 1, len = 90) => { const r = rnd(seed); let s = "";
    for (let i = 0; i < n; i++) s += `<i style="left:${(r() * 1200 - 60).toFixed(0)}px;top:${(r() * 1980 - 60).toFixed(0)}px;height:${(len * (.6 + r() * .8)).toFixed(0)}px;opacity:${(a * (.35 + r() * .6)).toFixed(2)}"></i>`;
    return `<div class="fx rain">${s}</div>`; };
  C.lens = (seed = 3, n = 7) => { const r = rnd(seed); let s = "";
    for (let i = 0; i < n; i++) { const d = 30 + r() * 70; s += `<div class="lens" style="left:${(r() * 1000).toFixed(0)}px;top:${(r() * 1800).toFixed(0)}px;width:${d.toFixed(0)}px;height:${(d * 1.1).toFixed(0)}px"></div>`; }
    return `<div class="fx">${s}</div>`; };
  C.fog = (y, h, c = "#fff4e0", a = .35) => `<div class="fog" style="top:${y}px;height:${h}px;background:${c};opacity:${a}"></div>`;
  C.motes = (x, y, w, h, n = 24, seed = 5) => { const r = rnd(seed); let s = "";
    for (let i = 0; i < n; i++) s += `<div class="mote" style="left:${(x + r() * w).toFixed(0)}px;top:${(y + r() * h).toFixed(0)}px;opacity:${(.3 + r() * .6).toFixed(2)};transform:scale(${(.5 + r()).toFixed(2)})"></div>`;
    return s; };
  // цветокоррекция по времени суток
  C.GRADES = {
    night: { mul: "linear-gradient(#3d4f9c, #5b6fb8 60%, #4a5a9e)", ma: .85, tone: "radial-gradient(ellipse at 50% 30%, #6f8cff55, #00000088)", ta: .9 },
    rain: { mul: "linear-gradient(#34457f, #5a6aa8 55%, #3e4c86)", ma: .8, tone: "linear-gradient(#00000066, #8fa8ff33 60%, #00000088)", ta: 1 },
    warm: { mul: "linear-gradient(#ffcf9a, #ffb070 70%, #d98a5a)", ma: .55, tone: "radial-gradient(ellipse at 30% 70%, #ff9a3c66, #00000066)", ta: .9 },
    dawn: { mul: "linear-gradient(#ffd9b0, #ffe6c8 50%, #e8b494)", ma: .5, tone: "radial-gradient(ellipse at 65% 38%, #fff2c0aa, #ff8a6022 55%, #3a204066)", ta: 1 },
    day: { mul: "linear-gradient(#fff2dc, #fffaf0)", ma: .35, tone: "radial-gradient(ellipse at 80% 15%, #fff6d0aa, #00000022)", ta: .8 },
    phone: { mul: "linear-gradient(#2a3a80, #3a4a9a)", ma: .9, tone: "radial-gradient(ellipse at 50% 45%, #8fd0ff66, #000000aa)", ta: 1 },
  };
  C.grade = g => { const G = C.GRADES[g]; if (!G) return "";
    return `<div class="mul" style="background:${G.mul};opacity:${G.ma}"></div><div class="tone" style="background:${G.tone};opacity:${G.ta}"></div>`; };

  // ---- кадр целиком (строкой) для плана sh. sc: {bg, far, haze, mid, fg, lights, grade, fx, hud, bubbles: [{p | at:[x,y], html, fs}], id}
  C.frame = (sc, sh) => {
    const blur = (sc.farBlur ?? 1.2) + Math.max(0, sh.s - 1) * 2.2;
    const far = `<div class="cl far" style="transform:${C.layerT(sh, sc.dFar ?? .7, FAR_OVER)};filter:blur(${blur.toFixed(1)}px) ${sc.farFilter || ""}">${sc.bg ? BGS[sc.bg] : ""}${sc.far || ""}</div>`;
    const mid = `<div class="cl mid" style="transform:${C.layerT(sh, 1)}">${sc.mid || ""}</div>`;
    const fg = sc.fg ? `<div class="cl fgl" style="transform:${C.layerT(sh, sc.dFg ?? 1.4)}">${sc.fg}</div>` : "";
    const lights = sc.lights ? `<div class="cl lights" style="transform:${C.layerT(sh, 1)}">${sc.lights}</div>` : "";
    const haze = sc.haze ? `<div class="haze" style="background:${sc.haze}"></div>` : "";
    const bubs = (sc.bubbles || []).map(b => { const [wx, wy] = b.at || C.ANCH[b.p]; const [sx, sy] = C.toScreen(sh, wx, wy);
      return `<div class="bub2${b.cls ? " " + b.cls : ""}"${b.id ? ` id="b_${b.id}"` : ""}${sc.bx ? ` data-lo="${sc.bx[0]}" data-hi="${sc.bx[1]}"` : ""} data-wx="${wx}" data-wy="${wy}" data-ax="${sx.toFixed(0)}" data-ay="${sy.toFixed(0)}" style="${b.fs ? `font-size:${b.fs}px;` : ""}">${b.html}</div>`; }).join("");
    const hud = sc.hud ? `<div class="tag"><b>ПЕРЕКУПЫ</b><span>${sc.hud.tag}</span></div>${sc.hud.cap ? `<div class="cnt" style="left:60px;right:auto">💰 ${sc.hud.cap} ₽${sc.hud.d ? ` <em>${sc.hud.d}</em>` : ""}</div>` : ""}
      ${sc.hud.lis ? `<div style="position:absolute;right:50px;top:170px;z-index:58;display:flex;gap:14px;align-items:center"><div style="display:flex;gap:6px;align-items:center;height:60px">${[26, 44, 30, 52].map(h => `<i style="width:10px;height:${h}px;background:#ff7a1a;border-radius:5px"></i>`).join("")}</div><img src="../../brand/fox_cut.png" style="width:96px;height:96px;border-radius:50%;border:6px solid #ff7a1a;background:#111"></div>` : ""}` : "";
    return `<div class="cf${sc.freeze ? " freeze" : ""}"${sc.id ? ` id="${sc.id}"` : ""}>${far}${haze}${mid}${fg}${C.grade(sc.grade)}${lights}<div class="vig"></div>${sc.fx || ""}${sc.over || ""}${bubs}${hud}</div>`;
  };
  // раскладка пузырей после вставки в DOM: центр над головой, в пределах кадра, хвост — на говорящего
  C.place = (b, ax, ay) => {
    const w = b._w ?? (b._w = b.offsetWidth), h = b._h ?? (b._h = b.offsetHeight);
    const lo = +(b.dataset.lo || 30), hi = +(b.dataset.hi || 1050);      // границы кадра (у половинки разделённого экрана — своя полоса)
    const l = Math.max(lo, Math.min(hi - w, ax - w / 2)), t = Math.max(390, ay - h - 70);
    b.style.left = l + "px"; b.style.top = t + "px"; b.style.setProperty("--tx", Math.max(40, Math.min(w - 110, ax - l - 30)) + "px");
    b.style.setProperty("--sk", (ax - l - 30 > w / 2 ? -30 : 30) + "deg");
  };
  C.layout = root => root.querySelectorAll(".bub2").forEach(b => C.place(b, +b.dataset.ax, +b.dataset.ay));
  // ---- видео: кадр монтируется один раз, план (el.cam) меняется на каждом кадре; hand — «ручная камера» в пикселях экрана
  C.mount = (parent, def, sh) => {
    parent.insertAdjacentHTML("beforeend", C.frame(def, sh)); const el = parent.lastElementChild;
    el.def = def; el.cam = { r: 0, ...sh }; el.style.opacity = 0;
    el.L = { far: el.querySelector(".far"), mid: el.querySelector(".mid"), fg: el.querySelector(".fgl"), lights: el.querySelector(".lights") };
    el.bubs = [...el.querySelectorAll(".bub2")]; return el;
  };
  C.apply = (el, hand = [0, 0, 0]) => {
    const d = el.def, c = el.cam, sh = { x: c.x - hand[0] / c.s, y: c.y - hand[1] / c.s, s: c.s, r: (c.r || 0) + hand[2] };
    const blur = (d.farBlur ?? 1.2) + Math.max(0, sh.s - 1) * 2.2;
    el.L.far.style.transform = C.layerT(sh, d.dFar ?? .7, FAR_OVER); el.L.far.style.filter = `blur(${blur.toFixed(1)}px) ${d.farFilter || ""}`;
    el.L.mid.style.transform = C.layerT(sh, 1);
    if (el.L.lights) el.L.lights.style.transform = C.layerT(sh, 1);
    if (el.L.fg) el.L.fg.style.transform = C.layerT(sh, d.dFg ?? 1.4);
    el.bubs.forEach(b => { const [ax, ay] = C.toScreen(sh, +b.dataset.wx, +b.dataset.wy); C.place(b, ax, ay); });
  };
  C.mouth = (root, p, kind) => root.querySelectorAll(`[id^="${p}-mouth-"]`).forEach(m => { m.style.display = m.id === `${p}-mouth-${kind}` ? "" : "none"; });
})();
