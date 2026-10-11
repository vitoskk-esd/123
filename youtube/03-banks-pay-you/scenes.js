// Живые сцены ролика №3 для режима «illu» (kit/yt/modes/illu.js). Стиль и персонажи — из одобренной карусели (carousel/art.js).
// Каждая сцена: bg(d) — статичный слой, fg(t, d, h) — живой слой под камерой, hud(t, d, h) — подписи, events(d) — звуки.
// Метки времени (d.at) ставит сборка (build3.py) по словам голоса; если метки нет — элемент не появляется.
(function () {
  const W = typeof window !== "undefined" ? window : global;
  const A = () => W.A;
  const SC = W.SCENES = W.SCENES || {};
  const cl = (x) => Math.max(0, Math.min(1, x)), lerp = (a, b, k) => a + (b - a) * k;
  const out5 = (x) => 1 - Math.pow(1 - cl(x), 5), out3 = (x) => 1 - Math.pow(1 - cl(x), 3), bell = (x) => Math.sin(Math.PI * cl(x));
  const hash = (a, b = 0) => { const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return s - Math.floor(s); };

  // ── общие помощники ──────────────────────────────────────────────────────────────────────────────────────
  // подпись: строки выезжают снизу по очереди; out — метка, когда уходит
  const T = (h, name, x, y, lines, o = {}) => { const t0 = h.at(name); if (h.t < t0) return "";
    const fo = o.out ? cl((h.t - h.at(o.out)) / .35) : 0; if (fo >= 1) return "";
    let yy = y, s = "";
    lines.forEach((L, i) => { const fs = L.size || 90, k = out5((h.t - t0 - i * .12 - (L.d || 0)) / .55); yy += fs * (L.lh || 1.08);
      if (k <= 0) return;
      s += `<text x="${x}" y="${(yy + (1 - k) * 46).toFixed(1)}" opacity="${(k * (1 - fo)).toFixed(3)}" font-family="${L.font || "Unb"}" font-weight="${L.w || 900}" font-size="${fs}" fill="${L.color || "#f5f1e8"}" letter-spacing="${L.ls ?? -.02}em" ${o.anchor ? `text-anchor="${o.anchor}"` : ""}>${L.t}</text>`; });
    return `<g filter="url(#soft)">${s}</g>`; };
  // «выпрыгивающий» элемент: масштаб с пружиной вокруг (x, y)
  const POP = (h, name, x, y, inner, o = {}) => { const t0 = h.at(name); if (h.t < t0) return ""; const k = h.U.back((h.t - t0) / (o.d || .45));
    const fo = o.out ? cl((h.t - h.at(o.out)) / .3) : 0; if (fo >= 1) return "";
    const fl = o.float ? Math.sin((h.t - t0) * 2 + x) * 6 : 0;
    return `<g transform="translate(${x} ${(y + fl).toFixed(1)}) scale(${Math.max(0, k * (1 - .3 * fo)).toFixed(3)}) rotate(${(o.rot || 0) * (1 - out3((h.t - t0) / .6))})" opacity="${(cl((h.t - t0) / .15) * (1 - fo)).toFixed(2)}">${inner}</g>`; };
  // живой дождь: штрихи падают и повторяются; n — плотность (0…1 через op)
  const rain = (t, seed, n, box, o = {}) => { const [x0, y0, x1, y1] = box, H = y1 - y0, ang = o.ang ?? 14, dx = Math.tan(ang * Math.PI / 180), v = o.v || 1500; let s = "";
    for (let i = 0; i < n; i++) { const z = hash(i, seed), L = 30 + z * 100, x = x0 + hash(seed, i) * (x1 - x0 + 200), y = y0 + (((hash(i + 7, seed) * H + t * v * (.7 + z * .6)) % (H + L)) + H + L) % (H + L) - L;
      s += `<line x1="${(x - dx * (y - y0)).toFixed(0)}" y1="${y.toFixed(0)}" x2="${(x - dx * (y - y0 + L)).toFixed(0)}" y2="${(y + L).toFixed(0)}" stroke="#c8d8ff" stroke-width="${(1 + z * 2.4).toFixed(1)}" stroke-linecap="round" opacity="${((.1 + z * .3) * (o.op ?? 1)).toFixed(2)}"/>`; }
    return s; };
  const snow = (t, seed, n, box, op) => { const [x0, y0, x1, y1] = box, H = y1 - y0; let s = "";
    for (let i = 0; i < n; i++) { const z = hash(i, seed + 3), r = 2 + z * 6, x = x0 + hash(seed, i + 9) * (x1 - x0) + Math.sin(t * (.6 + z) + i) * 30, y = y0 + ((hash(i, seed) * H + t * (60 + z * 90)) % H);
      s += `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${r.toFixed(1)}" fill="#fff" opacity="${((.35 + z * .5) * op).toFixed(2)}"/>`; }
    return s; };
  // перечёркнутое слово-стикер
  const strike = (h, name, x, y, word, o = {}) => { const t0 = h.at(name); if (h.t < t0) return ""; const k = h.U.back((h.t - t0) / .4), ks = out3((h.t - t0 - .3) / .3), w = word.length * (o.size || 44) * .62 + 50;
    return `<g transform="translate(${x} ${y}) rotate(${o.rot || -3}) scale(${k.toFixed(3)})" filter="url(#soft)"><rect x="${-w / 2}" y="-40" width="${w}" height="80" rx="18" fill="${o.bg || "#f5f1e8"}"/>
      <text y="16" text-anchor="middle" font-family="Mont" font-weight="800" font-size="${o.size || 44}" fill="#1a1d29">${word}</text>
      <path d="M${-w / 2 + 14} 6 L${-w / 2 + 14 + (w - 28) * ks} -4" stroke="#ff3d4f" stroke-width="9" stroke-linecap="round"/></g>`; };
  const coinFly = (h, name, x0, y0, x1, y1, r, o = {}) => { const t0 = h.at(name) + (o.delay || 0); if (h.t < t0) return ""; const k = h.U.lerp(0, 1, out3((h.t - t0) / (o.d || .7)));
    if (o.vanish && k >= 1) return "";
    return A().coin(lerp(x0, x1, k), lerp(y0, y1, k) - (o.arc ?? 140) * bell(k), r, { rot: (h.t - t0) * 300, sx: .6 + .4 * Math.abs(Math.cos((h.t - t0) * 9)) }); };
  // мигание глаз персонажа: раз в ~3,5 с на 0,12 с
  const blink = (t, ph = 0) => ((t + ph) % 3.6) < .12 ? "closed" : "open";
  W.SC_HELP = { T, POP, rain, snow, strike, coinFly, blink, hash, cl, lerp, out3, out5, bell };

  // ── ХУК 2: улица под дождём, камера снизу; курьер идёт к кафе ───────────────────────────────────────────────
  SC.street = {
    bg(d) { const a = A(), VPY = -1500, GY = 800, r = a.rnd(21), CX = 1700, top = (x, h) => x + (CX - x) * (h / (GY - VPY));
      let s = `<linearGradient id="sky2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#05070f"/><stop offset=".6" stop-color="#141d44"/><stop offset="1" stop-color="#2a2f63"/></linearGradient>
        <linearGradient id="fac2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#070a17"/><stop offset=".65" stop-color="#141b3c"/><stop offset="1" stop-color="#2b2b4f"/></linearGradient>
        <linearGradient id="road2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#151b3a"/><stop offset="1" stop-color="#06080f"/></linearGradient>
        <linearGradient id="cone2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffdca0" stop-opacity=".5"/><stop offset="1" stop-color="#ffdca0" stop-opacity="0"/></linearGradient>
        <rect x="-400" y="-300" width="4200" height="1700" fill="url(#sky2)"/><ellipse cx="1700" cy="560" rx="1500" ry="300" fill="#3a3f8a" opacity=".4" filter="url(#b60)"/>`;
      const B = [[-500, 60, 1300], [80, 440, 1550], [460, 890, 1250], [910, 1380, 1500], [1400, 1830, 1150], [1850, 2370, 1000, "cafe"], [2390, 2800, 1350], [2820, 3300, 1200], [3320, 3900, 1400]];
      let refl = "";
      B.forEach(([x0, x1, hh, kind]) => { const q = [[top(x0, hh), GY - hh], [top(x1, hh), GY - hh], [x0, GY], [x1, GY]];
        s += a.poly([q[0], q[1], q[3], q[2]], "url(#fac2)") + a.poly([q[1], [q[1][0] - 10, q[1][1]], [q[3][0] - 10, GY], q[3]], "#3a4580", 'opacity=".5"');
        const cols = Math.max(2, Math.round((x1 - x0) / 95)), rows = Math.round(hh / 125);
        for (let i = 0; i < cols; i++) for (let j = 1; j < rows; j++) { if (kind === "cafe" && j < 3) continue;
          const u0 = (i + .22) / cols, u1 = (i + .78) / cols, v0 = 1 - (j + .72) / rows, v1 = 1 - (j + .22) / rows, z = r();
          const lit = z < .34, c = z < .26 ? "#ffcf87" : lit ? "#7fb6ff" : "#0b1026", op = lit ? (.55 + r() * .4).toFixed(2) : 1;
          const w = [a.quad(q, u0, v0), a.quad(q, u1, v0), a.quad(q, u1, v1), a.quad(q, u0, v1)];
          s += a.poly(w, c, `opacity="${op}"`);
          if (lit) { refl += a.poly(w.map(([x, y]) => [x, 2 * 912 - y]), c, `opacity="${(op * .6).toFixed(2)}"`); if (r() < .45) s += a.poly([w[0], w[1], a.quad(q, u1, v0 + (v1 - v0) * .45), a.quad(q, u0, v0 + (v1 - v0) * .45)], "#0b1026", 'opacity=".6"'); } } });
      const cx = 1870;
      s += `<rect x="${cx}" y="590" width="480" height="210" rx="6" fill="#ff9a4a" opacity=".9"/><rect x="${cx}" y="590" width="480" height="210" fill="#ffd9a8" opacity=".4" filter="url(#b14)"/>
        <g fill="#7a3a1a" opacity=".75"><circle cx="${cx + 100}" cy="690" r="22"/><rect x="${cx + 75}" y="710" width="50" height="90" rx="20"/><circle cx="${cx + 330}" cy="680" r="22"/><rect x="${cx + 305}" y="700" width="50" height="100" rx="20"/><rect x="${cx + 180}" y="730" width="110" height="12" rx="6"/></g>
        <path d="M${cx - 15} 550 h510 l-30 50 h-450z" fill="#d6463a"/>${[0, 1, 2, 3, 4, 5, 6].map(k => `<path d="M${cx + 15 + k * 70} 550 l${-30 + k * 10} 50" stroke="#f4efe6" stroke-width="24" opacity=".92"/>`).join("")}
        <ellipse cx="${cx + 240}" cy="670" rx="440" ry="230" fill="#ff8a3d" opacity=".28" filter="url(#b60)"/>
        <rect x="-500" y="${GY}" width="4400" height="104" fill="#1d2446"/><rect x="-500" y="${GY}" width="4400" height="8" fill="#2e3768"/><rect x="-500" y="904" width="4400" height="8" fill="#3a4580"/>
        <rect x="-500" y="912" width="4400" height="300" fill="url(#road2)"/>
        <g filter="url(#b6)">${refl}<rect x="${cx}" y="${2 * 912 - 800}" width="480" height="210" fill="#ff9a4a" opacity=".55"/></g>
        <rect x="-500" y="912" width="4400" height="300" fill="#06080f" opacity=".35"/>`;
      [600, 1500, 2700].forEach(lx => { s += `<path d="M${lx} ${GY + 70} V560 q0 -36 36 -36 h70" stroke="#0d1226" stroke-width="16" fill="none" stroke-linecap="round"/><rect x="${lx + 86}" y="510" width="84" height="26" rx="10" fill="#0d1226"/>
        <path d="M${lx + 94} 534 L${lx + 162} 534 L${lx + 410} ${GY + 60} L${lx - 130} ${GY + 60}Z" fill="url(#cone2)"/><ellipse cx="${lx + 128}" cy="540" rx="40" ry="13" fill="#fff1c9" filter="url(#glow)"/>
        <ellipse cx="${lx + 140}" cy="${GY + 60}" rx="300" ry="44" fill="#ffdca0" opacity=".25" filter="url(#b30)"/>`; });
      return s; },
    fg(t, d, h) { const a = A(), cx = 1870, x = h.cam.x + 170, rk = lerp(.55, 1, h.k("дождь", .6)), sk = h.k("снег", .8);
      let s = `<g filter="url(#glow)" opacity="${(.85 + .15 * Math.sin(t * 17) * (Math.sin(t * 3.1) > .7 ? 1 : 0)).toFixed(2)}"><rect x="${cx + 125}" y="458" width="230" height="74" rx="37" fill="none" stroke="#ff6aa0" stroke-width="7"/><text x="${cx + 240}" y="514" text-anchor="middle" font-family="Unb" font-weight="900" font-size="46" fill="#ffd1e4">КАФЕ</text></g>`;
      // лужи: круги от капель
      for (let i = 0; i < 10; i++) { const T0 = .9, u = t + i * .37, c = Math.floor(u / T0), k = (u % T0) / T0, px = h.cam.x - 900 + hash(i, c) * 1800, py = 930 + hash(c, i) * 120;
        s += `<ellipse cx="${px.toFixed(0)}" cy="${py.toFixed(0)}" rx="${(8 + 40 * k).toFixed(1)}" ry="${(3 + 10 * k).toFixed(1)}" fill="none" stroke="#9fb6ff" stroke-width="2" opacity="${((1 - k) * .5 * rk).toFixed(2)}"/>`; }
      s += rain(t, 7, Math.round(160 * rk * (1 - .6 * sk)), [h.cam.x - 1100, -100, h.cam.x + 1100, 1100], { op: 1 });
      s += a.courierSide({ x, y: 880, s: 1.5, phase: t * 1.6, bag: true, rim: "#ff8a5a" });
      if (sk > 0) s += snow(t, 5, 120, [h.cam.x - 1100, -50, h.cam.x + 1100, 1100], sk);
      s += rain(t, 99, 18, [h.cam.x - 1100, -100, h.cam.x + 1100, 1100], { op: 1.6 * (1 - sk) }).replace(/stroke-width="[\d.]+"/g, 'stroke-width="9" filter="url(#b6)"');
      return s; },
    hud(t, d, h) { return `<path d="M0 0 H1000 Q840 300 0 520Z" fill="#04060c" opacity=".55" filter="url(#b60)"/>` +
      T(h, "тысячу", 80, 120, [{ t: "1 000 ₽", size: 180, color: "#ffd60a" }]) + T(h, "два", 84, 330, [{ t: "= 2–3 часа", size: 86 }]) +
      T(h, "дождь", 86, 450, [{ t: "в дождь", size: 40, font: "Mont", w: 800, ls: 0, color: "#c9d3f2" }]) + T(h, "снег", 280, 450, [{ t: "в снег", size: 40, font: "Mont", w: 800, ls: 0, color: "#c9d3f2" }]) +
      T(h, "рюкзаком", 440, 450, [{ t: "с рюкзаком", size: 40, font: "Mont", w: 800, ls: 0, color: "#ffd60a" }]) +
      `<text x="84" y="1030" font-family="Mont" font-weight="600" font-size="22" fill="#9fb0dd" opacity="${h.k("тысячу").toFixed(2)}">курьер пешком: 350–500 ₽ в час · hh.ru для Retail.ru, 2026</text>`; },
    events(d) { const at = d.at || {}, E = { whoosh: [], pop: [], swish: [] }; ["тысячу", "два", "рюкзаком"].forEach(k => at[k] != null && E.pop.push(at[k])); ["дождь", "снег"].forEach(k => at[k] != null && E.swish.push(at[k])); return E; },
  };

  // ── ХУК 3: дома на диване, за окном — курьер под дождём; банк платит сам ──────────────────────────────────────
  SC.home = {
    bg(d) { const a = A(); let s = `<linearGradient id="wall3" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2a1a14"/><stop offset="1" stop-color="#140c09"/></linearGradient>
        <linearGradient id="out3" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b1330"/><stop offset="1" stop-color="#1d2a5c"/></linearGradient>
        <linearGradient id="sofa3" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3e6b5e"/><stop offset="1" stop-color="#22433a"/></linearGradient>
        <rect x="-200" y="-200" width="2320" height="1480" fill="url(#wall3)"/>
        <circle cx="1820" cy="300" r="560" fill="#ffb25c" opacity=".3" filter="url(#b60)"/><circle cx="1820" cy="300" r="220" fill="#ffd9a0" opacity=".25" filter="url(#b60)"/>`;
      const r = a.rnd(5); let city = "";
      for (let i = 0; i < 9; i++) { const x = 130 + i * 72, hh = 160 + r() * 260; city += `<rect x="${x}" y="${700 - hh}" width="66" height="${hh}" fill="#0a1026"/>`;
        for (let k = 0; k < 10; k++) if (r() < .5) city += `<rect x="${x + 8 + Math.floor(r() * 4) * 14}" y="${700 - hh + 12 + Math.floor(r() * (hh / 18)) * 16}" width="8" height="9" fill="#ffcf87" opacity="${(.4 + r() * .5).toFixed(2)}"/>`; }
      s += `<clipPath id="win3"><rect x="130" y="150" width="640" height="560" rx="8"/></clipPath>
        <g clip-path="url(#win3)"><rect x="130" y="150" width="640" height="560" fill="url(#out3)"/>${a.bokeh(3, 22, [130, 160, 770, 520], ["#ffcf87", "#7fb6ff", "#ff6aa0"], { blur: "b14", r0: 8, r1: 26 })}${city}<rect x="130" y="640" width="640" height="70" fill="#141b3a"/></g>
        <path d="M1840 980 V360" stroke="#1a0f0a" stroke-width="10"/><path d="M1740 360 h200 l-40 -130 h-120z" fill="#f0c58a"/><path d="M1740 360 h200 l-40 -130 h-120z" fill="#fff3d6" opacity=".4" filter="url(#b14)"/>`;
      const X = 120;
      s += `<rect x="-200" y="930" width="2320" height="350" fill="#1a100c"/><rect x="-200" y="930" width="2320" height="6" fill="#3a2418"/>
        <rect x="${860 + X}" y="560" width="740" height="300" rx="60" fill="url(#sofa3)"/><rect x="${820 + X}" y="720" width="820" height="200" rx="50" fill="#2f574c"/>
        <rect x="${800 + X}" y="640" width="110" height="280" rx="50" fill="#2a4e44"/><rect x="${1550 + X}" y="640" width="110" height="280" rx="50" fill="#2a4e44"/>
        <rect x="${900 + X}" y="600" width="230" height="170" rx="40" fill="#e9b04a" transform="rotate(-8 ${1015 + X} 690)"/><rect x="${1380 + X}" y="610" width="190" height="150" rx="40" fill="#b34a3a" transform="rotate(7 ${1475 + X} 690)"/>`;
      return s; },
    fg(t, d, h) { const a = A(), X = 120, r = a.rnd(9);
      // окно: курьер идёт под дождём, капли стекают по стеклу
      let w = `<g clip-path="url(#win3)"><g transform="translate(${(420 + ((t * 40) % 300)).toFixed(0)} 690) scale(.24)">${a.courierSide({ phase: t * 1.6, rim: "#7fb6ff" })}</g>
        ${rain(t, 3, 80, [130, 150, 770, 710], { ang: 8, v: 1200 })}
        <g stroke="#cfe0ff" stroke-width="3" opacity=".35" fill="none">${Array.from({ length: 14 }, (_, i) => { const x = 140 + hash(i, 4) * 620, y0 = 160 + hash(i, 5) * 200, y = y0 + ((t * (30 + hash(i, 6) * 60)) % 300), L = 40 + hash(i, 7) * 90; return `<path d="M${x.toFixed(0)} ${(y - L).toFixed(0)} q3 ${L / 2} -1 ${L}"/><circle cx="${(x - 1).toFixed(0)}" cy="${y.toFixed(0)}" r="4" fill="#cfe0ff"/>`; }).join("")}</g>
        <path d="M130 150 L420 150 L130 520Z" fill="#fff" opacity=".05"/></g>
        <rect x="120" y="140" width="660" height="580" rx="12" fill="none" stroke="#5a3a26" stroke-width="22"/><path d="M450 140 V720 M120 430 H780" stroke="#5a3a26" stroke-width="14"/>
        <rect x="100" y="712" width="700" height="26" rx="6" fill="#6b452c"/><g transform="translate(250 712)"><rect x="-24" y="-60" width="48" height="60" rx="10" fill="#b8613a"/><path d="M0 -60 C-40 -120 -10 -150 0 -110 C10 -160 50 -120 0 -60" fill="#3f8a5a"/></g>`;
      // герой: дышит, моргает; на пуше улыбается шире
      const got = h.on("переводит"), br = Math.sin(t * 1.7) * 3;
      const hero = a.person({ x: 1250 + X, y: 940 + br * .3, s: 1.32, noShadow: true, pose: { la: [[-60, -196 + br], [-20, -262 + br]], ra: [[60, -200 + br], [10, -258 + br]], ll: [[-40, -150], [-46, 0]], rl: [[40, -150], [48, 0]],
        tilt: -4 + Math.sin(t * .8) * 2, mouth: got ? "open" : "smile", eyes: blink(t), look: -.3 },
        front: `${a.handPhone([-6, -262 + br], -8, got && h.since("переводит") < 1.2 ? "#2ee07a" : "#7fd8ff")}<circle cx="-6" cy="-330" r="70" fill="#7fd8ff" opacity="${(.12 + .2 * bell(h.since("переводит") / 1)).toFixed(2)}" filter="url(#b14)"/>` });
      const table = `<g filter="url(#soft)"><rect x="${1000 + X}" y="806" width="540" height="30" rx="12" fill="#7a5034"/><rect x="${1015 + X}" y="836" width="510" height="26" rx="6" fill="#5e3c27"/>
        <rect x="${1040 + X}" y="860" width="20" height="80" fill="#4a2f1e"/><rect x="${1480 + X}" y="860" width="20" height="80" fill="#4a2f1e"/></g>
        <g transform="translate(${1110 + X} 806)"><rect x="-30" y="-56" width="60" height="56" rx="10" fill="#e8e2d6"/><path d="M30 -44 a16 16 0 0 1 0 30" stroke="#e8e2d6" stroke-width="8" fill="none"/>
        ${[0, 1].map(i => `<path d="M${-10 + i * 20} ${-70 - ((t * 20 + i * 15) % 30)} q-12 -20 4 -36" stroke="#fff" stroke-width="5" fill="none" opacity="${(.35 * (1 - ((t * 20 + i * 15) % 30) / 30)).toFixed(2)}" stroke-linecap="round"/>`).join("")}</g>
        <g transform="translate(${1380 + X} 806) rotate(-6)"><rect x="-80" y="-22" width="160" height="22" rx="4" fill="#3b6fb3"/><rect x="-70" y="-40" width="140" height="18" rx="4" fill="#d6463a"/></g>`;
      // таймер «10 минут», покупка, монеты в телефон
      const timer = POP(h, "десять", 1000, 380, `<circle r="64" fill="#f5f1e8"/><circle r="64" fill="none" stroke="#1a1d29" stroke-width="8"/><path d="M0 0 L0 -42" stroke="#1a1d29" stroke-width="8" stroke-linecap="round" transform="rotate(${(h.since("десять") * 120).toFixed(0)})"/><path d="M0 -64 A64 64 0 0 1 ${(64 * Math.sin(Math.min(1, h.since("десять") / 1.5) * 1.05)).toFixed(1)} ${(-64 * Math.cos(Math.min(1, h.since("десять") / 1.5) * 1.05)).toFixed(1)}" stroke="#ffd60a" stroke-width="10" fill="none"/>
        <g transform="translate(0 112)"><rect x="-90" y="-30" width="180" height="60" rx="30" fill="#ffd60a"/><text y="12" text-anchor="middle" font-family="Mont" font-weight="800" font-size="30" fill="#1a1400">10 минут</text></g>`, { float: 1, out: "Иногда" });
      const buy = POP(h, "покупку", 1720, 560, `<path d="M-50 -30 h100 l-12 80 h-76z" fill="#ff8a3d"/><path d="M-26 -30 v-14 a26 26 0 0 1 52 0 v14" stroke="#ff8a3d" stroke-width="8" fill="none"/>
        <g transform="translate(0 92)"><rect x="-110" y="-28" width="220" height="56" rx="28" fill="#f5f1e8"/><text y="11" text-anchor="middle" font-family="Mont" font-weight="800" font-size="28" fill="#1a1d29">одна покупка</text></g>`, { float: 1, out: "Иногда" });
      const coins = coinFly(h, "переводит", 1960, 120, 1360, 700, 34, { d: .8, vanish: true }) + coinFly(h, "Иногда", 1960, 80, 1360, 700, 34, { d: .8, vanish: true });
      return w + table.replace(/^/, "") + hero + timer + buy + coins; },
    hud(t, d, h) { const a = A(), sum = h.on("Иногда") ? lerp(1000, 2000, out3(h.since("Иногда") / .8)) : 1000;
      let s = `<path d="M0 800 Q440 760 860 1080 H0Z" fill="#05030a" opacity=".6" filter="url(#b60)"/>`;
      if (h.on("переводит")) { const k = h.U.back(h.since("переводит") / .5);
        s += `<g transform="translate(${lerp(1300, 1000, out5(h.since("переводит") / .5))} 0)" opacity="${cl(h.since("переводит") / .2)}">${a.notif(0, 210, 600, { title: `Бонус ${Math.round(sum).toLocaleString("ru-RU").replace(/\s/g, " ")} ₽ зачислен`, sub: "за покупку по акции · пример", h: 160, rot: -3 })}</g>`; }
      s += T(h, "переводит", 80, 770, [{ t: "А банк платит сам", size: 84 }]);
      s += strike(h, "собеседования", 330, 980, "собеседование", { rot: -4 }) + strike(h, "смен", 770, 980, "смены", { rot: 3 }) + strike(h, "опыта", 1080, 980, "опыт", { rot: -2 });
      return s; },
    events(d) { const at = d.at || {}, E = { notif: [], coin: [], pop: [], tick: [] }; if (at["переводит"] != null) { E.coin.push(at["переводит"] + .7); E.notif.push(at["переводит"]); }
      if (at["Иногда"] != null) E.coin.push(at["Иногда"] + .7); ["десять", "покупку", "собеседования", "смен", "опыта"].forEach(k => at[k] != null && E.pop.push(at[k])); return E; },
  };

  // ── ХУК 4: «каждый день читаю условия мелким шрифтом» — стол, лампа, лента условий, лупа ───────────────────────
  SC.reader = {
    bg(d) { return `<radialGradient id="desk5" cx="50%" cy="30%" r="80%"><stop offset="0" stop-color="#2c2140"/><stop offset=".6" stop-color="#120d1f"/><stop offset="1" stop-color="#07060d"/></radialGradient>
      <rect x="-200" y="-200" width="2320" height="1480" fill="url(#desk5)"/><circle cx="960" cy="200" r="520" fill="#ffcf87" opacity=".16" filter="url(#b60)"/>
      <rect x="-200" y="760" width="2320" height="520" fill="#1c1428"/><rect x="-200" y="760" width="2320" height="10" fill="#2d2240"/>
      <path d="M1500 760 l-60 -330 l-120 -40" stroke="#2a2340" stroke-width="16" fill="none" stroke-linecap="round"/><path d="M1240 360 l140 -40 l40 110 l-150 30z" fill="#3a2f58"/><ellipse cx="1330" cy="450" rx="90" ry="22" fill="#fff1c9" filter="url(#glow)" opacity=".7"/>
      <path d="M1260 455 L1400 455 L1700 780 L900 780Z" fill="#ffcf87" opacity=".1"/>`; },
    fg(t, d, h) { const a = A(); let s = "";
      // лента условий: тянется сверху, строки ползут
      s += `<g filter="url(#soft)"><rect x="620" y="-60" width="620" height="860" rx="8" fill="#f3efe6"/></g><clipPath id="rdc"><rect x="620" y="-60" width="620" height="860"/></clipPath><g clip-path="url(#rdc)">`;
      for (let i = 0; i < 40; i++) { const y = ((i * 34 - t * 60) % 1360 + 1360) % 1360 - 100, w = 380 + hash(i, 2) * 160; s += `<rect x="660" y="${y.toFixed(0)}" width="${w.toFixed(0)}" height="11" rx="5" fill="#c9c6bd"/>`;
        if (i % 9 === 4) s += `<rect x="660" y="${(y - 6).toFixed(0)}" width="${(w * .6).toFixed(0)}" height="22" rx="5" fill="#ffd60a" opacity=".45"/>`; }
      s += `</g>`;
      // лупа ездит по строкам
      const mx = 930 + Math.sin(t * .9) * 180, my = 420 + Math.cos(t * .7) * 140;
      s += `<g transform="translate(${mx.toFixed(0)} ${my.toFixed(0)})" filter="url(#soft)"><circle r="120" fill="#cfe7ff" opacity=".22"/><circle r="120" fill="none" stroke="#2a2f3f" stroke-width="22"/><path d="M84 84 l120 120" stroke="#2a2f3f" stroke-width="34" stroke-linecap="round"/>
        <text y="-10" text-anchor="middle" font-family="Mont" font-weight="700" font-size="30" fill="#1a1d29">*кроме</text><text y="30" text-anchor="middle" font-family="Mont" font-weight="700" font-size="30" fill="#1a1d29">переводов</text>
        <path d="M-70 -50 a90 90 0 0 1 60 -50" stroke="#fff" stroke-width="10" fill="none" opacity=".6" stroke-linecap="round"/></g>`;
      // календарь: страницы листаются «каждый день»
      const day = h.on("каждый") ? 1 + Math.floor(h.since("каждый") * 4) : 1;
      s += POP(h, "каждый", 360, 600, `<rect x="-110" y="-130" width="220" height="200" rx="16" fill="#f3efe6"/><rect x="-110" y="-130" width="220" height="50" rx="16" fill="#8a5cf6"/><rect x="-110" y="-96" width="220" height="16" fill="#8a5cf6"/>
        <text y="-94" text-anchor="middle" font-family="Mont" font-weight="800" font-size="24" fill="#fff">ОКТЯБРЬ</text><text y="30" text-anchor="middle" font-family="Unb" font-weight="900" font-size="80" fill="#1a1d29">${((day - 1) % 31) + 1}</text>`, { float: 1 });
      // значок канала
      s += POP(h, "канал", 1580, 600, `<rect x="-200" y="-56" width="400" height="112" rx="56" fill="#141a2e" stroke="#ffd60a" stroke-width="3"/><circle cx="-142" cy="0" r="38" fill="#ffd60a"/><text x="-142" y="14" text-anchor="middle" font-family="Unb" font-weight="900" font-size="34" fill="#1a1400">В</text>
        <text x="-90" y="-6" font-family="Mont" font-weight="800" font-size="30" fill="#fff">Владик Арбузит</text><text x="-90" y="28" font-family="Mont" font-weight="600" font-size="22" fill="#9fb0dd">бонусы банков</text>`, { float: 1 });
      return s; },
    hud(t, d, h) { return T(h, "мелким", 80, 820, [{ t: "Читаю условия", size: 70 }, { t: "мелким шрифтом", size: 70, color: "#ffd60a" }]); },
    events(d) { const at = d.at || {}, E = { pop: [], paper: [] }; ["канал", "каждый", "мелким"].forEach(k => at[k] != null && E.pop.push(at[k])); E.paper.push(.1); return E; },
  };

  // ── ХУК 5: пять способов лесенкой и шестой — красный ──────────────────────────────────────────────────────
  const CARDS = [["#ffb000", "#ff6a00", "Бонус за карту", "1 000–2 000 ₽"], ["#8a5cf6", "#4b2bd1", "Приведи друга", "за каждого"], ["#2ec4b6", "#0f6b8a", "Деньги лежат", "% каждый день"], ["#4a8dff", "#2338b8", "Кэшбэк", "с покупок"], ["#ff5d8f", "#b0174a", "Кредитка", "больше всех"]];
  SC.stairs = {
    bg(d) { return `<radialGradient id="spot4" cx="60%" cy="20%" r="90%"><stop offset="0" stop-color="#26306a"/><stop offset=".55" stop-color="#0d1330"/><stop offset="1" stop-color="#05070f"/></radialGradient>
      <rect x="-300" y="-300" width="2520" height="1680" fill="url(#spot4)"/>${A().bokeh(11, 30, [0, 0, 1920, 1080], ["#ffd60a", "#8a5cf6", "#2ec4b6"], { blur: "b30", r0: 20, r1: 70 })}`; },
    fg(t, d, h) { const a = A(); let s = "";
      // стрелка «по нарастающей»
      if (h.on("нарастающей")) { const k = out3(h.since("нарастающей") / .9), x1 = lerp(180, 1560, k), y1 = lerp(930, 330, k);
        s += `<path d="M180 930 L${x1.toFixed(0)} ${y1.toFixed(0)}" stroke="#ffd60a" stroke-width="6" stroke-dasharray="6 22" stroke-linecap="round" opacity=".5"/>`; }
      CARDS.forEach(([c1, c2, lab, sub], i) => { const t0 = h.at("пять") + i * .16; if (t < t0) return;
        const k = h.U.back((t - t0) / .55), w = 250 + i * 18, x = 300 + i * 285, y = 800 - i * 105 + (1 - k) * 300, hh = w * .63;
        const glow = (i === 0 && h.on("простого") && !h.on("денежного")) || (i === 4 && h.on("денежного") && !h.on("посчитаю")) ? .5 + .5 * Math.sin(t * 8) : 0;
        if (glow) s += `<circle cx="${x}" cy="${y}" r="${w * .7}" fill="${c1}" opacity="${(.3 * glow).toFixed(2)}" filter="url(#b30)"/>`;
        s += `<g transform="translate(0 ${Math.sin(t * 1.4 + i) * 6})">` + a.card(x, y, w, { c1, c2, rot: -6 * k + (1 - k) * 30, big: String(i + 1), num: `000${i + 1}` }) + `</g>`;
        s += `<g opacity="${cl((t - t0 - .3) / .3)}"><text x="${x}" y="${y + hh / 2 + 76}" text-anchor="middle" font-family="Mont" font-weight="800" font-size="30" fill="#f5f1e8">${lab}</text>
          <text x="${x}" y="${y + hh / 2 + 112}" text-anchor="middle" font-family="Mont" font-weight="600" font-size="24" fill="#9fb0dd">${sub}</text></g>`; });
      // весы «посчитаю часы»
      s += POP(h, "посчитаю", 1700, 860, `<rect x="-6" y="-90" width="12" height="110" fill="#e3bf5e"/><rect x="-120" y="-96" width="240" height="12" rx="6" fill="#e3bf5e" transform="rotate(${(Math.sin(t * 2) * 8).toFixed(1)})"/>
        <path d="M-140 -40 h80 a40 14 0 0 1 -80 0z M60 -40 h80 a40 14 0 0 1 -80 0z" fill="#e3bf5e"/><text y="80" text-anchor="middle" font-family="Unb" font-weight="900" font-size="44" fill="#ffd60a">? ч</text>`, { out: "шестой" });
      // шестая — красная: въезжает, дрожит, растёт, трескается, переворачивается замком вниз
      if (h.on("шестой")) { const k = out5(h.since("шестой") / .6), sh = h.on("платишь") ? Math.sin(t * 60) * 6 * (1 - cl(h.since("платишь") / .6)) : Math.sin(t * 30) * 2,
          grow = 1 + .25 * out3(h.since("больше") / .5) * (h.on("больше") ? 1 : 0), fl = h.on("конце2") ? Math.cos(Math.PI * cl(h.since("конце2") / .5)) : 1;
        const back = fl < 0;
        s += `<circle cx="1730" cy="300" r="260" fill="#ff2a3a" opacity="${(.25 + .2 * Math.sin(t * 5)).toFixed(2)}" filter="url(#b60)"/>`;
        s += `<g transform="translate(${lerp(2300, 1730, k) + sh} 300) scale(${(Math.abs(fl) * grow).toFixed(3)} ${grow.toFixed(3)}) translate(-1730 -300)">` +
          (back ? `<g transform="translate(1730 300) rotate(14)"><rect x="-165" y="-104" width="330" height="208" rx="20" fill="#3a0a14" stroke="#ff3d4f" stroke-width="4"/><g transform="scale(1.6)"><rect x="-26" y="-6" width="52" height="40" rx="8" fill="#ff3d4f"/><path d="M-16 -6 v-14 a16 16 0 0 1 32 0 v14" stroke="#ff3d4f" stroke-width="7" fill="none"/></g></g>`
            : a.card(1730, 300, 330, { c1: "#ff2a3a", c2: "#5a0010", rot: 14, big: "6", label: "???", blur: h.on("больше") ? "" : "b2" }) +
              (h.on("телеграме") ? `<g transform="translate(1600 200) rotate(14)"><circle r="34" fill="#2aa3e0"/><path d="M-16 0 L18 -14 L10 16 L2 6Z" fill="#fff"/></g>` : "") +
              (h.on("платишь") ? `<path d="M1660 190 l40 70 l-30 40 l50 80" stroke="#fff" stroke-width="5" fill="none" opacity="${(1 - cl(h.since("платишь") / 2) * .4).toFixed(2)}"/>` : "")) + `</g>`; }
      return s; },
    hud(t, d, h) { let s = T(h, "пять", 80, 60, [{ t: "5 способов,", size: 84 }, { t: "где банк платит тебе", size: 84 }]);
      s += T(h, "платишь", 84, 280, [{ t: "и шестой — где платишь ты", size: 44, color: "#ff5d6c", font: "Mont", w: 800, ls: 0 }]);
      if (h.on("платишь") && h.since("платишь") < .25) s += `<rect width="1920" height="1080" fill="#ff2a3a" opacity="${(.25 * (1 - h.since("платишь") / .25)).toFixed(2)}"/>`;
      return s; },
    events(d) { const at = d.at || {}, E = { pop: [], impact: [], whoosh: [], riser: [] }; if (at["пять"] != null) for (let i = 0; i < 5; i++) E.pop.push(at["пять"] + i * .16);
      if (at["шестой"] != null) E.whoosh.push(at["шестой"]); if (at["платишь"] != null) E.impact.push(at["платишь"]); if (at["посчитаю"] != null) E.pop.push(at["посчитаю"]);
      if (at["конце2"] != null) E.whoosh.push(at["конце2"]); return E; },
  };

  // ── заставка главы: большой номер, название, монеты по орбите ─────────────────────────────────────────────
  SC.chapter = {
    bg(d) { return `<radialGradient id="chg" cx="50%" cy="50%" r="70%"><stop offset="0" stop-color="${d.c2 || "#2a2f63"}"/><stop offset="1" stop-color="#05070f"/></radialGradient><rect x="-300" y="-300" width="2520" height="1680" fill="url(#chg)"/>`; },
    fg(t, d, h) { const a = A(); let s = "";
      for (let i = 0; i < 5; i++) { const ang = t * 1.2 + i * 1.256, rx = 620, ry = 180; s += a.coin(960 + Math.cos(ang) * rx, 560 + Math.sin(ang) * ry, 26 + 10 * (Math.sin(ang) + 1), { rot: t * 200 + i * 40, op: .5 + .25 * (Math.sin(ang) + 1), blur: Math.sin(ang) < 0 ? "b2" : "" }); }
      return s; },
    hud(t, d, h) { const k = out5(t / .6), u = out3((t - .25) / .6);
      return `<g opacity="${cl(t / .2)}"><text x="960" y="${(500 + (1 - k) * 80).toFixed(0)}" text-anchor="middle" font-family="Unb" font-weight="900" font-size="260" fill="${d.color || "#ffd60a"}" letter-spacing="-.04em" filter="url(#soft)">${d.num}</text>
        <text x="960" y="${(640 + (1 - u) * 50).toFixed(0)}" text-anchor="middle" font-family="Unb" font-weight="900" font-size="78" fill="#f5f1e8" opacity="${u.toFixed(2)}" filter="url(#soft)">${d.title}</text>
        <rect x="${960 - 260 * u}" y="680" width="${520 * u}" height="8" rx="4" fill="${d.color || "#ffd60a"}"/>
        <text x="960" y="760" text-anchor="middle" font-family="Mont" font-weight="700" font-size="34" fill="#c9d3f2" opacity="${out3((t - .5) / .5).toFixed(2)}">${d.sub || ""}</text></g>`; },
    events(d) { return { impact: [.05], riser: [] }; },
  };

  // ── СПОСОБ 1: банк ночью; очередь новичков, монеты из двери, реклама в метро дороже ─────────────────────────
  SC.bank = {
    bg(d) { const a = A(); let s = `<linearGradient id="sky5" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#050912"/><stop offset="1" stop-color="#16294a"/></linearGradient>
        <linearGradient id="stone5" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3c4a6e"/><stop offset="1" stop-color="#7a86a8"/></linearGradient>
        <linearGradient id="col5" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#5b6890"/><stop offset=".45" stop-color="#b9c3df"/><stop offset="1" stop-color="#4a5678"/></linearGradient>
        <linearGradient id="spill5" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffcf87" stop-opacity=".75"/><stop offset="1" stop-color="#ffcf87" stop-opacity="0"/></linearGradient>
        <rect x="-1400" y="-300" width="3700" height="1700" fill="url(#sky5)"/>${a.bokeh(8, 40, [-1300, 300, 2000, 700], ["#7fb6ff", "#ffcf87"], { blur: "b14", r0: 6, r1: 22 })}`;
      let b = `<path d="M430 300 L960 110 L1490 300Z" fill="#46557c"/><path d="M500 285 L960 130 L1420 285Z" fill="#33405f"/>
        <rect x="840" y="200" width="240" height="64" rx="10" fill="#0b1124"/><text x="960" y="248" text-anchor="middle" font-family="Unb" font-weight="900" font-size="42" fill="#ffd60a" letter-spacing=".12em" filter="url(#glow)">БАНК</text>
        <rect x="430" y="300" width="1060" height="44" fill="url(#stone5)"/><rect x="470" y="344" width="980" height="440" fill="#141c34"/>
        <g fill="#ffcf87" opacity=".55"><rect x="540" y="420" width="90" height="140" rx="45"/><rect x="1290" y="420" width="90" height="140" rx="45"/><rect x="540" y="600" width="90" height="130" rx="8"/><rect x="1290" y="600" width="90" height="130" rx="8"/></g>`;
      [500, 680, 1180, 1360].forEach(x => { b += `<rect x="${x}" y="344" width="60" height="440" fill="url(#col5)"/><rect x="${x - 10}" y="340" width="80" height="18" rx="4" fill="#9aa6c8"/><rect x="${x - 10}" y="770" width="80" height="18" rx="4" fill="#9aa6c8"/>`; });
      for (let k = 0; k < 6; k++) b += `<rect x="${400 - k * 60}" y="${784 + k * 30}" width="${1120 + k * 120}" height="30" fill="${k % 2 ? "#59658a" : "#66739a"}"/>`;
      s += `<g transform="translate(180 0)">${b}</g><rect x="-1400" y="964" width="3700" height="400" fill="#0b1124"/>`;
      // слева: вход в метро с рекламным щитом
      s += `<g transform="translate(-700 0)"><rect x="-260" y="300" width="520" height="340" rx="14" fill="#0e1428" stroke="#2a3460" stroke-width="10"/>
        <rect x="-240" y="320" width="480" height="300" rx="8" fill="#ff5d8f"/><circle cx="-120" cy="440" r="70" fill="#ffd60a"/><rect x="-20" y="400" width="220" height="30" rx="8" fill="#fff" opacity=".9"/><rect x="-20" y="450" width="160" height="22" rx="8" fill="#fff" opacity=".6"/>
        <text x="0" y="590" text-anchor="middle" font-family="Unb" font-weight="900" font-size="40" fill="#fff">РЕКЛАМА</text><rect x="-20" y="640" width="40" height="324" fill="#1a2140"/>
        <circle cx="330" cy="380" r="56" fill="#d6463a"/><text x="330" y="404" text-anchor="middle" font-family="Unb" font-weight="900" font-size="64" fill="#fff">М</text><rect x="320" y="436" width="20" height="528" fill="#1a2140"/>
        <circle cx="0" cy="470" r="380" fill="#ff5d8f" opacity=".15" filter="url(#b60)"/></g>`;
      return s; },
    fg(t, d, h) { const a = A(), DX = 180; let s = "";
      // дверь светится, свет пульсирует
      const gl = .75 + .25 * Math.sin(t * 2.2);
      s += `<g transform="translate(${DX} 0)"><path d="M860 470 h200 v314 h-200z" fill="#ffcf87"/><path d="M860 470 a100 100 0 0 1 200 0z" fill="#ffd9a0"/><rect x="860" y="470" width="200" height="314" fill="#fff3d6" opacity="${(.5 * gl).toFixed(2)}" filter="url(#b14)"/>
        <circle cx="960" cy="640" r="320" fill="#ffb25c" opacity="${(.3 * gl).toFixed(2)}" filter="url(#b60)"/><path d="M860 784 L1060 784 L1300 964 L620 964Z" fill="url(#spill5)" opacity="${(.8 * gl).toFixed(2)}"/></g>`;
      // очередь новичков на ступенях
      const q = [[860, 960, "#ff8a3d"], [760, 975, "#4a8dff"], [1490, 975, "#8a5cf6"]];
      q.forEach(([x, y, c], i) => { if (!h.on("новым")) return; const k = h.U.back((h.since("новым") - i * .12) / .5);
        s += `<g transform="translate(${x} ${y}) scale(${Math.max(0, k * .62).toFixed(3)})">${a.person({ back: true, c: { top: c, topD: c, topL: "#fff" }, noShadow: false, pose: { la: [[-62, -214], [-60, -150]], ra: [[62, -214], [60, -150]], tilt: Math.sin(t * 2 + i) * 3 } })}</g>`; });
      // герой поднимается по ступеням и тянет руку к монете
      const k = h.io("новым", 2.2), hx = lerp(1700, 1420, k), hy = lerp(1060, 920, k), ph = t * 6 * (k < 1 ? 1 : 0), sw = Math.sin(ph) * 14;
      const reach = h.on("пришли") ? out3(h.since("пришли") / .4) : 0;
      s += a.person({ x: hx, y: hy, s: 1.2, back: true, pose: { la: [[-62, -214], [-64 + sw * .4, -150]], ra: [[lerp(62, 70, reach), lerp(-214, -260, reach)], [lerp(60, 92, reach), lerp(-150, -320, reach)]],
        ll: [[-22, -96 - Math.max(0, sw)], [-30, -6 - Math.max(0, sw) * 2]], rl: [[24, -96 - Math.max(0, -sw)], [30, -6 - Math.max(0, -sw) * 2]] } });
      // монеты из двери к герою
      for (let i = 0; i < 4; i++) s += coinFly(h, "пришли", 1140, 620, hx + 90, hy - 380, 26 + i * 4, { delay: i * .14, d: .7, arc: 160 + i * 20 });
      // три вида бонуса над дверью
      s += POP(h, "Деньгами", 1000, 380, a.coin(0, 0, 50), { float: 1, out: "Реклама" });
      s += POP(h, "баллами", 1140, 330, `<circle r="52" fill="#8a5cf6"/><path d="M0 -30 l9 20 l22 2 l-17 14 l6 22 l-20 -12 l-20 12 l6 -22 l-17 -14 l22 -2z" fill="#ffd60a"/>`, { float: 1, out: "Реклама" });
      s += POP(h, "сертификатом", 1290, 380, `<rect x="-70" y="-44" width="140" height="88" rx="14" fill="#2ec4b6"/><path d="M-70 -6 h140 M-10 -44 v88" stroke="#ffd60a" stroke-width="10"/><circle cx="-10" cy="-6" r="12" fill="#ffd60a"/>`, { float: 1, out: "Реклама" });
      // реклама: ценник качается и горит
      if (h.on("Реклама")) { const sw2 = Math.sin(h.since("Реклама") * 4) * 10 * Math.exp(-h.since("Реклама") * .6);
        s += `<g transform="translate(-460 250) rotate(${sw2.toFixed(1)})"><path d="M0 0 L0 60" stroke="#ddd" stroke-width="4"/><g transform="translate(0 60)" filter="url(#soft)"><rect x="-120" y="0" width="240" height="110" rx="18" fill="#ff3d4f"/><text y="72" text-anchor="middle" font-family="Unb" font-weight="900" font-size="58" fill="#fff">₽₽₽₽</text></g></g>`; }
      if (h.on("дешевле")) s += POP(h, "дешевле", -460, 520, `<path d="M-150 -150 L150 150 M150 -150 L-150 150" stroke="#ff3d4f" stroke-width="26" stroke-linecap="round" opacity=".85"/>`);
      // бесплатная тысяча: монета в руке героя
      if (h.on("бесплатная")) s += POP(h, "бесплатная", hx + 92, hy - 360, a.coin(0, 0, 54) + `<text y="-80" text-anchor="middle" font-family="Unb" font-weight="900" font-size="48" fill="#2ee07a" filter="url(#soft)">+1 000 ₽</text>`);
      return s; },
    hud(t, d, h) { let s = `<path d="M0 560 Q420 640 640 1080 H0Z" fill="#03050b" opacity=".6" filter="url(#b60)"/>`;
      s += T(h, "пришли", 80, 640, [{ t: "Банк платит", size: 96 }, { t: "за то, что ты пришёл", size: 58, color: "#ffd60a" }], { out: "Реклама" });
      if (h.on("тысячи")) s += POP(h, "тысячи", 1640, 150, A().pill(-200, 0, "+1 000–2 000 ₽", { size: 44 }) + A().note(-192, 80, "бонус новичку · пример, октябрь 2026", { size: 22 }), { out: "Реклама" });
      s += T(h, "Зачем", 960, 380, [{ t: "Зачем банку это?", size: 90 }], { anchor: "middle", out: "Реклама" });
      s += T(h, "дорого", 80, 760, [{ t: "Реклама — дорого", size: 80, color: "#ff8fa0" }], { out: "тому" });
      s += T(h, "дешевле", 80, 760, [{ t: "Бонус — дешевле", size: 80, color: "#2ee07a" }, { t: "баннера в метро", size: 50 }], { out: "бесплатная" });
      s += T(h, "бесплатная", 80, 800, [{ t: "Тебе — бесплатная тысяча", size: 70, color: "#ffd60a" }]);
      s += A().foot();
      return s; },
    events(d) { const at = d.at || {}, E = { pop: [], coin: [], whoosh: [], thud: [] }; if (at["пришли"] != null) for (let i = 0; i < 4; i++) E.coin.push(at["пришли"] + .7 + i * .14);
      ["тысячи", "Деньгами", "баллами", "сертификатом", "Зачем", "бесплатная"].forEach(k => at[k] != null && E.pop.push(at[k])); ["Реклама", "тому"].forEach(k => at[k] != null && E.whoosh.push(at[k]));
      if (at["дешевле"] != null) E.thud.push(at["дешевле"]); return E; },
  };
})();
