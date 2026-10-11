// Режим «Моушн-графика» (владелец 11.10: «можем ли мы добавить моушен графику?» → «делай демо»). Плоская графика без 3D:
// кинетический текст (слова выезжают из-под маски, подчёркивание рисуется), столбики со счётчиком и вылетом монет, шкала
// «часы против минут», круговая диаграмма, иконки, которые рисуются линией, стрелка-выноска, плашка внизу (lower third).
// Всё детерминировано от локального времени t (секунды от начала отрезка).
// data: { scene: "kinetic"|"bars"|"scale"|"donut"|"icons", title?, lower?: {t, title, sub}, ...поля сцены (см. build) }
(function () {
  // иконки — линии в квадрате 64×64 (рисуются обводкой, потом заливаются цветом)
  const ICONS = {
    clock: "M32 8a24 24 0 1 0 0.01 0Z M32 18v15l10 7",
    bag: "M14 22h36v32H14Z M24 22v-6a8 8 0 0 1 16 0v6 M14 34h36",
    card: "M8 18h48v30H8Z M8 27h48 M16 40h12",
    friend: "M24 26a8 8 0 1 0 0.01 0Z M10 52c0-9 6-15 14-15s14 6 14 15 M44 22a6 6 0 1 0 0.01 0Z M40 36c7 0 13 5 13 13",
    percent: "M48 14L16 50 M20 18a5 5 0 1 0 0.01 0Z M44 42a5 5 0 1 0 0.01 0Z",
    cart: "M8 14h8l6 28h26l6-20H20 M26 52a3 3 0 1 0 0.01 0Z M46 52a3 3 0 1 0 0.01 0Z",
    credit: "M8 18h48v30H8Z M8 27h48 M40 34a7 7 0 1 0 0.01 0Z M40 30v4l3 2",
    coin: "M32 10a22 22 0 1 0 0.01 0Z M26 22h9a6 6 0 0 1 0 12h-9V22Z M26 34v12 M22 40h12",
  };
  const icon = (k, size, color, sw = 3.4) => `<svg class="ic" width="${size}" height="${size}" viewBox="0 0 64 64"><path d="${ICONS[k]}" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  YT.mode("motion", {
    css: `
    .yt-motion { background: radial-gradient(1300px 900px at 72% 28%, #18235a, #0b1022 62%, #070a16); }
    .yt-motion .gridbg { position: absolute; inset: -60px; background-image: linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px);
      background-size: 80px 80px; }
    .yt-motion .blob { position: absolute; border-radius: 50%; filter: blur(80px); opacity: .5; }
    .yt-motion .ttl { position: absolute; left: 120px; top: 90px; font: 800 30px "Mont"; letter-spacing: .14em; color: #8fa2d6; text-transform: uppercase; }
    .yt-motion .kin { position: absolute; left: 120px; top: 250px; font: 900 132px/1.06 "Unb"; letter-spacing: -.04em; color: #f4f6fb; }
    .yt-motion .kin .ln { display: block; white-space: nowrap; }
    .yt-motion .kin .m { display: inline-block; overflow: hidden; vertical-align: top; padding-bottom: .08em; margin-right: .22em; }
    .yt-motion .kin .m > span { display: inline-block; }
    .yt-motion .kin .g { color: #2ee07a; } .yt-motion .kin .y { color: #ffd60a; } .yt-motion .kin .r { color: #ff5a6e; }
    .yt-motion .ul { position: absolute; overflow: visible; }
    .yt-motion .ic { overflow: visible; }
    .yt-motion .lower { position: absolute; left: 120px; bottom: 120px; display: flex; align-items: stretch; height: 92px; }
    .yt-motion .lower i { width: 10px; background: #2ee07a; border-radius: 4px; }
    .yt-motion .lower div { margin-left: 18px; padding: 10px 26px; background: rgba(10,14,30,.85); border: 1px solid rgba(143,162,214,.25); border-radius: 12px; overflow: hidden; }
    .yt-motion .lower b { display: block; font: 800 30px "Mont"; color: #fff; white-space: nowrap; } .yt-motion .lower small { display: block; font: 600 20px "Mont"; color: #8fa2d6; margin-top: 4px; white-space: nowrap; }
    .yt-motion .axis { position: absolute; height: 4px; background: rgba(143,162,214,.5); border-radius: 2px; transform-origin: 0 50%; }
    .yt-motion .bar { position: absolute; bottom: 0; border-radius: 18px 18px 6px 6px; transform-origin: 50% 100%; }
    .yt-motion .bar .v { position: absolute; left: 50%; bottom: 100%; transform: translate(-50%, -16px); font: 900 64px "Unb"; color: #fff; white-space: nowrap; letter-spacing: -.03em; }
    .yt-motion .bar .l { position: absolute; left: 50%; top: 100%; transform: translate(-50%, 24px); font: 700 30px/1.2 "Mont"; color: #c9d3ee; text-align: center; white-space: nowrap; }
    .yt-motion .pill { position: absolute; padding: 14px 26px; border-radius: 40px; background: #ffd60a; color: #111; font: 800 34px "Mont"; white-space: nowrap; box-shadow: 0 18px 40px rgba(0,0,0,.35); }
    .yt-motion .coin { position: absolute; width: 54px; height: 54px; margin: -27px; border-radius: 50%; background: radial-gradient(circle at 35% 30%, #fff3b0, #ffd23f 45%, #d99a10);
      box-shadow: inset 0 0 0 4px rgba(150,95,0,.55); display: flex; align-items: center; justify-content: center; font: 900 26px "Unb"; color: #8a5a00; }
    .yt-motion .row { position: absolute; left: 120px; right: 120px; }
    .yt-motion .row .lab { font: 800 40px "Mont"; color: #f4f6fb; } .yt-motion .row .lab small { font: 600 28px "Mont"; color: #8fa2d6; margin-left: 14px; }
    .yt-motion .row .cells { display: flex; gap: 16px; margin-top: 18px; }
    .yt-motion .cell { width: 150px; height: 150px; border-radius: 26px; display: flex; align-items: center; justify-content: center; }
    .yt-motion .donut { position: absolute; }
    .yt-motion .leg { position: absolute; display: flex; align-items: center; gap: 18px; font: 700 34px "Mont"; color: #e6ebf8; white-space: nowrap; }
    .yt-motion .leg i { width: 28px; height: 28px; border-radius: 8px; } .yt-motion .leg b { margin-left: 10px; font: 800 34px "Mont"; }
    .yt-motion .ctr { position: absolute; text-align: center; } .yt-motion .ctr b { display: block; font: 900 92px "Unb"; color: #fff; letter-spacing: -.04em; white-space: nowrap; }
    .yt-motion .ctr small { font: 700 26px "Mont"; color: #8fa2d6; }
    .yt-motion .tile { position: absolute; width: 280px; height: 300px; border-radius: 34px; background: rgba(20,28,60,.8); border: 1.5px solid rgba(143,162,214,.25); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 22px; }
    .yt-motion .tile .n { position: absolute; left: 22px; top: 18px; font: 900 34px "Unb"; color: #2ee07a; }
    .yt-motion .tile span { font: 700 28px/1.2 "Mont"; color: #e6ebf8; text-align: center; }
    .yt-motion .note { position: absolute; font: 600 22px "Mont"; color: rgba(143,162,214,.8); }
    `,
    build(root, d, ctx) {
      const { U, W, H } = ctx, P = root._p = {};
      U.el("div", "gridbg", null, root);
      P.blobs = [["#2b5bff", 900, 1400, 120], ["#2ee07a", 700, 200, 700]].map(([c, s, x, y]) => { const b = U.el("div", "blob", null, root);
        Object.assign(b.style, { width: s + "px", height: s + "px", left: x + "px", top: y + "px", background: c }); return b; });
      if (d.title) P.ttl = U.el("div", "ttl", d.title, root);
      if (d.scene === "kinetic") {   // lines: [[[слово, класс, t], …], …]; under: {line, t, color}; icon: {k, t, x, y, size, color}
        const k = U.el("div", "kin", null, root); P.words = [];
        (d.lines || []).forEach(line => { const ln = U.el("span", "ln", null, k);
          line.forEach(([w, c, t]) => { const m = U.el("span", "m", null, ln), s = U.el("span", c || "", w, m); P.words.push({ s, t }); }); });
        if (d.under) { const ln = k.querySelectorAll(".ln")[d.under.line]; P.under = { el: ln, t: d.under.t, color: d.under.color || "#2ee07a" }; }
        if (d.icon) { const e = U.el("div", null, icon(d.icon.k, d.icon.size || 300, d.icon.color || "#2ee07a", 2.6), root);
          Object.assign(e.style, { position: "absolute", left: d.icon.x + "px", top: d.icon.y + "px" }); P.icon = { path: e.querySelector("path"), e, t: d.icon.t }; }
      }
      if (d.scene === "bars") {   // bars: [{label, value, color, t}]; max; base {x, y, h, w, gap}; arrow {from, to, t, text}; burst {bar, t}
        const B = d.base || { x: 520, y: 860, h: 560, w: 300, gap: 260 };
        P.axis = U.el("div", "axis", null, root); Object.assign(P.axis.style, { left: (B.x - 60) + "px", top: B.y + "px", width: (d.bars.length * (B.w + B.gap) - B.gap + 120) + "px" });
        P.bars = d.bars.map((b, i) => { const e = U.el("div", "bar", `<div class="v"></div><div class="l">${b.label}</div>`, root);
          const hh = B.h * b.value / d.max;
          Object.assign(e.style, { left: (B.x + i * (B.w + B.gap)) + "px", top: (B.y - hh) + "px", width: B.w + "px", height: hh + "px",
            background: `linear-gradient(180deg, ${b.color}, ${b.color}aa)`, boxShadow: `0 0 60px ${b.color}55` });
          return { e, b, v: e.querySelector(".v"), top: B.y - hh, cx: B.x + i * (B.w + B.gap) + B.w / 2 }; });
        if (d.arrow) { const a = d.arrow, f = P.bars[a.from], to = P.bars[a.to];
          const x1 = f.cx + 40, y1 = f.top - 140, x2 = to.cx - 170, y2 = to.top + 40;
          const svg = U.el("div", null, `<svg width="${W}" height="${H}" style="position:absolute;left:0;top:0;overflow:visible"><path d="M${x1},${y1} C${x1 + 60},${y1 - 220} ${x2 - 160},${y2 - 260} ${x2},${y2}" fill="none" stroke="#ffd60a" stroke-width="10" stroke-linecap="round"/>
            <path d="M${x2 - 46},${y2 - 30} L${x2},${y2} L${x2 - 14},${y2 - 54}" fill="none" stroke="#ffd60a" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/></svg>`, root);
          const ps = svg.querySelectorAll("path"); P.arrow = { line: ps[0], head: ps[1], t: a.t };
          P.pill = U.el("div", "pill", a.text, root); Object.assign(P.pill.style, { left: (x1 + (x2 - x1) * .35 - 40) + "px", top: (Math.min(y1, y2) - 260) + "px" }); }
        if (d.burst) { let seed = 5; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647, src = P.bars[d.burst.bar];
          P.coins = Array.from({ length: 16 }, () => { const e = U.el("div", "coin", "₽", root), a = -Math.PI / 2 + (rnd() - .5) * 1.6, v = 700 + rnd() * 700;
            return { e, x0: src.cx, y0: src.top, vx: Math.cos(a) * v, vy: Math.sin(a) * v, r: (rnd() - .5) * 720, d: rnd() * .15 }; }); }
      }
      if (d.scene === "scale") {   // rows: [{label, sub, n, icon, color, t, gap, done}]
        P.rows = (d.rows || []).map((r, i) => { const e = U.el("div", "row", `<div class="lab">${r.label}<small>${r.sub || ""}</small></div><div class="cells"></div>`, root);
          e.style.top = (r.y ?? 250 + i * 320) + "px"; const cells = e.querySelector(".cells");
          const cs = Array.from({ length: r.n }, () => { const c = U.el("div", "cell", icon(r.icon, 92, r.color, 4), cells); c.style.background = r.color + "22"; c.style.border = `2px solid ${r.color}66`; return c; });
          return { r, e, cs }; });
      }
      if (d.scene === "donut") {   // parts: [{label, value, color}]; t0, gap; total {t0, t1, to}; cx, cy, R
        const R = d.R || 260, cx = d.cx || 620, cy = d.cy || 560, C = 2 * Math.PI * R, sum = d.parts.reduce((a, p) => a + p.value, 0);
        let acc = 0; const svg = U.el("div", "donut", `<svg width="${2 * R + 120}" height="${2 * R + 120}" viewBox="${-R - 60} ${-R - 60} ${2 * R + 120} ${2 * R + 120}">
          <circle r="${R}" fill="none" stroke="rgba(143,162,214,.14)" stroke-width="70"/>${d.parts.map(p => { const len = C * p.value / sum - 8, off = acc; acc += C * p.value / sum;
            return `<circle class="arc" r="${R}" fill="none" stroke="${p.color}" stroke-width="70" stroke-dasharray="0 ${C}" data-len="${len}" data-off="${off}" transform="rotate(-90)"/>`; }).join("")}</svg>`, root);
        Object.assign(svg.style, { left: (cx - R - 60) + "px", top: (cy - R - 60) + "px" });
        P.arcs = [...svg.querySelectorAll(".arc")].map(a => ({ a, len: +a.dataset.len, off: +a.dataset.off })); P.C = C;
        P.ctr = U.el("div", "ctr", `<b></b><small>${d.total.label || ""}</small>`, root); Object.assign(P.ctr.style, { left: (cx - 260) + "px", width: "520px", top: (cy - 70) + "px" });
        P.legs = d.parts.map((p, i) => { const e = U.el("div", "leg", `<i style="background:${p.color}"></i>${p.label}<b style="color:${p.color}">${p.text || ""}</b>`, root);
          Object.assign(e.style, { left: (d.legX || 1120) + "px", top: ((d.legY || 330) + i * 92) + "px" }); return e; });
        if (d.note) { P.note = U.el("div", "note", d.note, root); Object.assign(P.note.style, { left: (d.legX || 1120) + "px", top: ((d.legY || 330) + d.parts.length * 92 + 20) + "px" }); }
      }
      if (d.scene === "icons") {   // items: [{k, label}]; t0, gap
        const n = d.items.length, w = 280, gap = 40, x0 = (W - (n * w + (n - 1) * gap)) / 2;
        P.tiles = d.items.map((it, i) => { const e = U.el("div", "tile", `<div class="n">${i + 1}</div>${icon(it.k, 120, it.color || "#2ee07a", 3)}<span>${it.label}</span>`, root);
          Object.assign(e.style, { left: (x0 + i * (w + gap)) + "px", top: (d.y || 330) + "px" }); return { e, path: e.querySelector("path"), span: e.querySelector("span") }; });
      }
      if (d.lower) { P.lower = U.el("div", "lower", `<i></i><div><b>${d.lower.title}</b><small>${d.lower.sub || ""}</small></div>`, root); }
    },
    render(root, t, d, ctx) {
      const { U } = ctx, P = root._p;
      P.blobs.forEach((b, i) => { b.style.transform = `translate(${Math.sin(t * .3 + i * 2) * 60}px, ${Math.cos(t * .25 + i) * 40}px)`; });
      root.querySelector(".gridbg").style.transform = `translate(${(-t * 12) % 80}px, ${(-t * 6) % 80}px)`;
      if (P.ttl) { const k = U.out5(t / .5); P.ttl.style.opacity = U.clamp(t / .3); P.ttl.style.transform = `translateX(${(1 - k) * -30}px)`; P.ttl.style.letterSpacing = `${.3 - .16 * k}em`; }
      if (P.words) P.words.forEach(({ s, t: tw }) => { const k = U.out5((t - tw) / .45); s.style.transform = `translateY(${((1 - k) * 105).toFixed(1)}%) rotate(${(1 - k) * 6}deg)`; });
      if (P.under) { const k = U.io3((t - P.under.t) / .5), ln = P.under.el;
        ln.style.backgroundImage = `linear-gradient(${P.under.color}, ${P.under.color})`; ln.style.backgroundRepeat = "no-repeat"; ln.style.backgroundPosition = "0 92%";
        ln.style.backgroundSize = `${(k * 100).toFixed(1)}% .09em`; }
      if (P.icon) { U.draw(P.icon.path, U.io3((t - P.icon.t) / 1.1)); const kf = U.clamp((t - P.icon.t - 1) / .4);
        P.icon.e.style.transform = `scale(${1 + .04 * Math.sin(Math.max(0, t - P.icon.t) * 2)})`; P.icon.path.style.filter = `drop-shadow(0 0 ${(20 * kf).toFixed(0)}px #2ee07a)`; }
      if (P.bars) {
        P.axis.style.transform = `scaleX(${U.out3(t / .6)})`;
        P.bars.forEach(({ e, b, v }) => { const k = U.out5((t - b.t) / .8); e.style.transform = `scaleY(${Math.max(.001, k)})`; e.style.opacity = t < b.t ? 0 : 1;
          v.textContent = U.fmt(b.value * U.io3((t - b.t) / .9)) + " ₽"; v.style.transform = `translate(-50%, -16px) scaleY(${1 / Math.max(.05, k)})`; v.style.opacity = U.clamp((t - b.t - .15) / .2); });
        if (P.arrow) { U.draw(P.arrow.line, U.io3((t - P.arrow.t) / .6)); U.draw(P.arrow.head, U.clamp((t - P.arrow.t - .55) / .15));
          const kp = U.back((t - P.arrow.t - .5) / .45); P.pill.style.opacity = t < P.arrow.t + .5 ? 0 : 1; P.pill.style.transform = `scale(${U.lerp(.6, 1, kp)}) rotate(-3deg)`; }
        if (P.coins) P.coins.forEach(c => { const dt = t - d.burst.t - c.d; if (dt < 0) { c.e.style.opacity = 0; return; }
          c.e.style.opacity = 1 - U.clamp((dt - 1.1) / .4);
          c.e.style.transform = `translate(${(c.x0 + c.vx * dt).toFixed(1)}px, ${(c.y0 + c.vy * dt + 1400 * dt * dt).toFixed(1)}px) rotate(${(c.r * dt).toFixed(0)}deg) scale(${U.lerp(.4, 1, U.out3(dt / .2))})`; });
      }
      if (P.rows) P.rows.forEach(({ r, e, cs }) => { const ke = U.out5((t - r.t) / .5); e.style.opacity = U.clamp((t - r.t) / .25); e.style.transform = `translateY(${(1 - ke) * 30}px)`;
        cs.forEach((c, i) => { const at = r.t + .25 + i * (r.gap ?? .22), k = U.back((t - at) / .4); c.style.opacity = t < at ? 0 : 1; c.style.transform = `scale(${U.lerp(.5, 1, k)})`;
          U.draw(c.querySelector("path"), U.io3((t - at) / .5)); }); });
      if (P.arcs) {
        P.arcs.forEach(({ a, len, off }, i) => { const at = d.t0 + i * (d.gap ?? .45), k = U.io3((t - at) / .6);
          a.setAttribute("stroke-dasharray", `${(len * k).toFixed(1)} ${P.C}`); a.setAttribute("stroke-dashoffset", (-off).toFixed(1)); });
        P.legs.forEach((e, i) => { const at = d.t0 + i * (d.gap ?? .45), k = U.out5((t - at) / .45); e.style.opacity = U.clamp((t - at) / .2); e.style.transform = `translateX(${(1 - k) * 40}px)`; });
        const q = d.total, kc = U.io3((t - q.t0) / (q.t1 - q.t0)); P.ctr.querySelector("b").textContent = U.fmt(q.to * kc) + " ₽"; P.ctr.style.opacity = U.clamp((t - q.t0) / .3);
        if (P.note) P.note.style.opacity = U.clamp((t - q.t1) / .4);
      }
      if (P.tiles) P.tiles.forEach(({ e, path, span }, i) => { const at = d.t0 + i * (d.gap ?? .35), k = U.out5((t - at) / .5);
        e.style.opacity = U.clamp((t - at) / .2); e.style.transform = `translateY(${(1 - k) * 60}px)`; U.draw(path, U.io3((t - at - .1) / .7)); span.style.opacity = U.clamp((t - at - .4) / .3); });
      if (P.lower) { const L = d.lower, k = U.out5((t - L.t) / .5), ki = U.out5((t - L.t - .15) / .5);
        P.lower.style.opacity = t < L.t ? 0 : 1; P.lower.querySelector("i").style.transform = `scaleY(${k})`;
        const box = P.lower.querySelector("div"); box.style.clipPath = `inset(0 ${((1 - ki) * 100).toFixed(1)}% 0 0)`; }
    },
    // звуки (секунды от начала отрезка): pop — слова/столбики/иконки, ticks — счётчики, coin — монеты, click — плашка, mark — подчёркивание
    events(d, dur) {
      const E = { pop: [], ticks: [], coin: [], click: [], mark: [], chip: [], pen: [] };
      if (d.lines) d.lines.flat().forEach(([, , t]) => E.chip.push(t));
      if (d.under) E.mark.push(d.under.t);
      if (d.icon) E.pen.push([d.icon.t, 1.0]);
      if (d.bars) d.bars.forEach(b => { E.pop.push(b.t); E.ticks.push([b.t, b.t + .9]); });
      if (d.arrow) E.pen.push([d.arrow.t, .6]);
      if (d.burst) E.coin.push(d.burst.t);
      if (d.rows) d.rows.forEach(r => { for (let i = 0; i < r.n; i++) E.chip.push(r.t + .25 + i * (r.gap ?? .22)); });
      if (d.parts) { d.parts.forEach((_, i) => E.pop.push(d.t0 + i * (d.gap ?? .45))); E.ticks.push([d.total.t0, d.total.t1]); }
      if (d.items) d.items.forEach((_, i) => E.pop.push(d.t0 + i * (d.gap ?? .35)));
      if (d.lower) E.click.push(d.lower.t);
      return E;
    },
  });
})();
