// Режим «Ночной офис» (Y1, из experiments/2026-10-09-yt-directions/a_doc.html?theme=night): один большой стол-мир ночью,
// предметы (договор, телефон, выписка, карточка-вывод, монитор, стикер), камера перелетает между ними по кадрам shots.
// Моушн-блюр — по скорости камеры (считается аналитически из cam(t) и cam(t − 1/30), без состояния между кадрами),
// глубина резкости — предметы далеко от центра кадра мягче. Все события — в секундах от начала отрезка.
// data: { objects: [{id, type, x, y, w, h, r, match, ...}] (mon: head, big, sub, line, draw; doc: title, sub, key{text, hl, circle, note}; phone; ledger; card; sticky), shots: [{t, to: id | [x, y], s, r, dx, dy}], fly }
YT.mode("office", {
  css: `
  .yt-office { background: #04070d; }
  .yt-office .world { position: absolute; left: 0; top: 0; width: 4400px; height: 2600px; transform-origin: 0 0;
    background: radial-gradient(1500px 900px at 1800px 700px, rgba(60,140,255,.22), transparent 70%), radial-gradient(900px 600px at 900px 1900px, rgba(0,229,190,.10), transparent 70%),
      repeating-linear-gradient(92deg, rgba(255,255,255,.012) 0 3px, transparent 3px 11px), linear-gradient(180deg, #0c1220, #070b14); }
  .yt-office .o { position: absolute; transform-origin: 50% 50%; }
  .yt-office .paper { background: #dfe6f2; color: #1d2230; border-radius: 6px; background-image: radial-gradient(rgba(0,0,0,.035) 1px, transparent 1px); background-size: 3px 3px;
    box-shadow: 0 0 0 1px rgba(120,170,255,.3), 0 40px 80px rgba(0,0,0,.7), 0 0 60px rgba(60,140,255,.18); }
  .yt-office .doc { padding: 80px 90px; font: 500 26px/1.55 "Mont"; }
  .yt-office .doc h1 { font: 800 34px "Mont"; letter-spacing: .06em; margin-bottom: 8px; }
  .yt-office .doc .sub { font: 600 20px "Mono"; color: #6f7a8e; margin-bottom: 40px; }
  .yt-office .bar { height: 14px; background: #c3ccdb; border-radius: 3px; margin: 18px 0; }
  .yt-office .key { position: relative; font: 700 34px/1.3 "Mont"; margin: 34px 0; padding: 4px 6px; }
  .yt-office .key .hl { position: absolute; left: 0; top: 6px; height: 88%; width: 0; background: rgba(0,255,190,.55); mix-blend-mode: multiply; border-radius: 3px; }
  .yt-office .key svg { position: absolute; left: -50px; top: -46px; overflow: visible; }
  .yt-office .note { position: absolute; right: 60px; font: 800 italic 54px "Mont"; color: #d42a2a; transform: rotate(-8deg); opacity: 0; }
  .yt-office .phone { border-radius: 70px; background: #0c0d10; padding: 16px; box-shadow: 0 0 0 3px #2a3550, 0 0 80px rgba(60,140,255,.35), 0 60px 120px rgba(0,0,0,.7); }
  .yt-office .scr { position: relative; width: 100%; height: 100%; border-radius: 56px; overflow: hidden; background: linear-gradient(180deg, #f6f7f9, #eceff3); }
  .yt-office .scr .isl { position: absolute; left: 50%; top: 14px; width: 130px; height: 36px; margin-left: -65px; background: #000; border-radius: 20px; z-index: 5; }
  .yt-office .scr .top { padding: 90px 34px 20px; } .yt-office .scr .top small { font: 600 20px "Mont"; color: #7b828c; }
  .yt-office .scr .top b { display: block; font: 800 54px "Mont"; color: #13161b; margin-top: 6px; white-space: nowrap; }
  .yt-office .scr .tile { margin: 14px 24px; padding: 24px 26px; background: #fff; border-radius: 24px; box-shadow: 0 4px 14px rgba(0,0,0,.06); font: 600 22px "Mont"; color: #4a515b; }
  .yt-office .scr .tile b { display: block; font: 800 34px "Mont"; color: #13161b; margin-top: 4px; }
  .yt-office .push { position: absolute; left: 18px; right: 18px; top: 70px; padding: 20px 22px; border-radius: 26px; background: rgba(255,255,255,.94);
    box-shadow: 0 18px 40px rgba(0,0,0,.25); font: 600 21px/1.35 "Mont"; color: #20242a; z-index: 4; opacity: 0; }
  .yt-office .push .h { display: flex; align-items: center; gap: 10px; font: 700 17px "Mont"; color: #7b828c; margin-bottom: 6px; }
  .yt-office .push .h i { width: 30px; height: 30px; border-radius: 8px; background: linear-gradient(135deg, #3ddc84, #1a9d57); }
  .yt-office .ledger { padding: 70px 80px; font: 600 30px "Mont"; }
  .yt-office .ledger h2 { font: 800 30px "Mont"; letter-spacing: .08em; color: #4d5568; margin-bottom: 30px; }
  .yt-office .ledger .row { display: flex; justify-content: space-between; padding: 14px 0; border-bottom: 2px dashed #b9c3d3; font: 700 28px "Mono"; opacity: 0; }
  .yt-office .ledger .row .r { color: #c42424; } .yt-office .ledger .row.ok .r { color: #1a8a4c; }
  .yt-office .ledger .sum { margin-top: 26px; display: flex; justify-content: space-between; align-items: baseline; font: 800 40px "Mont"; }
  .yt-office .ledger .sum b { font: 900 92px "Unb"; color: #c42424; } .yt-office .ledger .sum small { display: block; font: 600 22px "Mont"; color: #6f7a8e; }
  .yt-office .stamp { position: absolute; right: 70px; top: 30px; padding: 18px 34px; border: 8px solid #1a8a4c; color: #1a8a4c; border-radius: 14px;
    font: 900 50px "Unb"; opacity: 0; mix-blend-mode: multiply; }
  .yt-office .card { padding: 70px 80px; background: #f4f7fc; }
  .yt-office .card .q { font: 800 64px/1.15 "Mont"; color: #151a24; } .yt-office .card .q s { position: relative; text-decoration: none; white-space: nowrap; }
  .yt-office .card .q s svg { position: absolute; left: -10px; top: 50%; overflow: visible; }
  .yt-office .card .a { margin-top: 40px; font: 700 46px/1.25 "Mont"; color: #c42424; opacity: 0; }
  .yt-office .mon { border-radius: 26px; background: #0b1424; border: 18px solid #1a2230; padding: 50px 60px; color: #cfe1ff;
    box-shadow: 0 0 0 2px #2b3548, 0 0 140px rgba(60,140,255,.35), 0 60px 120px rgba(0,0,0,.8); }
  .yt-office .mon h4 { font: 700 30px "Mono"; color: #6fb8ff; letter-spacing: .06em; }
  .yt-office .mon .big { font: 900 120px "Unb"; color: #ff5a6e; text-shadow: 0 0 40px rgba(255,90,110,.6); margin: 20px 0 10px; white-space: nowrap; }
  .yt-office .mon .sub { font: 600 30px "Mont"; color: #8fa6c8; }
  .yt-office .mon svg { position: absolute; left: 60px; bottom: 60px; }
  .yt-office .sticky { padding: 40px 44px; background: #ffe873; color: #1d1a10; font: 800 44px/1.2 "Mont"; box-shadow: 0 20px 40px rgba(0,0,0,.5); }
  .yt-office .scan { position: absolute; inset: 0; pointer-events: none; background: repeating-linear-gradient(0deg, rgba(255,255,255,.025) 0 2px, transparent 2px 4px); }
  .yt-office .lamp { position: absolute; inset: 0; pointer-events: none; background: radial-gradient(ellipse at 50% 45%, transparent 50%, rgba(0,4,12,.75)); }
  `,
  build(root, d, ctx) {
    const { U } = ctx, w = U.el("div", "world", null, root); this._w = w;
    root._objs = {};
    (d.objects || []).forEach(o => {
      const e = U.el("div", "o " + o.type + (["doc", "ledger", "card"].includes(o.type) ? " paper" : ""), null, w);
      Object.assign(e.style, { left: o.x + "px", top: o.y + "px", width: o.w + "px", height: o.h ? o.h + "px" : "", transform: `rotate(${o.r || 0}deg)` });
      if (o.match) e.dataset.match = o.match;
      const P = {};
      if (o.type === "doc") {
        e.innerHTML = `<h1>${o.title}</h1><div class="sub">${o.sub || ""}</div>` + '<div class="bar"></div>'.repeat(o.before ?? 4);
        if (o.key) { const k = U.el("div", "key", `<span class="hl"></span><span style="position:relative">${o.key.text}</span>`, e);
          k.insertAdjacentHTML("beforeend", `<svg width="${o.w - 80}" height="200"><path d="M30,90 C40,10 ${o.w * .45},-10 ${o.w - 160},30 C${o.w - 100},40 ${o.w - 110},150 ${o.w - 240},160 C${o.w * .5},180 120,190 40,140 C10,120 20,100 60,80" fill="none" stroke="#d42a2a" stroke-width="7" stroke-linecap="round"/></svg>`);
          P.hl = k.querySelector(".hl"); P.circ = k.querySelector("path"); }
        e.insertAdjacentHTML("beforeend", '<div class="bar"></div>'.repeat(o.after ?? 8));
        if (o.key && o.key.note) { P.note = U.el("div", "note", o.key.note.text, e); P.note.style.top = (o.key.note.y || 250) + "px"; }
        e.querySelectorAll(".bar").forEach((b, i) => b.style.width = (60 + ((i * 37) % 32)) + "%");
      }
      if (o.type === "phone") {
        e.innerHTML = `<div class="scr"><div class="isl"></div><div class="top"><small>${o.small || ""}</small><b>${o.big || ""}</b></div>` +
          (o.tiles || []).map(([l, v]) => `<div class="tile">${l}<b>${v}</b></div>`).join("") + "</div>";
        if (o.push) P.push = U.el("div", "push", `<div class="h"><i></i>${o.push.from || "БАНК · сейчас"}</div>${o.push.html}`, e.firstChild);
      }
      if (o.type === "ledger") {
        e.innerHTML = `<h2>${o.title}</h2>`; P.rows = (o.rows || []).map(([l, r, ok]) => U.el("div", "row" + (ok ? " ok" : ""), `<span>${l}</span><span class="r">${r}</span>`, e));
        if (o.sum) { const s = U.el("div", "sum", `<div>${o.sum.label}<small>${o.sum.small || ""}</small></div><b></b>`, e); P.sum = s.querySelector("b"); }
        if (o.stamp) P.stamp = U.el("div", "stamp", o.stamp.text, e);
      }
      if (o.type === "card") {
        e.innerHTML = `<div class="q">${o.q}</div>`; const s = e.querySelector("s");
        if (s) { s.insertAdjacentHTML("beforeend", `<svg width="600" height="40"><path d="M0,10 C150,0 380,20 ${s.textContent.length * 30},-6" fill="none" stroke="#d42a2a" stroke-width="12" stroke-linecap="round"/></svg>`); P.strike = s.querySelector("path"); }
        if (o.a) P.a = U.el("div", "a", o.a.text, e);
      }
      if (o.type === "mon") {
        const W = o.w - 156, H = 330;
        e.innerHTML = `<h4>${o.head}</h4><div class="big">${o.big}</div><div class="sub">${o.sub || ""}</div>
          <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><defs><linearGradient id="g${o.id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="rgba(255,90,110,.45)"/><stop offset="1" stop-color="rgba(255,90,110,0)"/></linearGradient></defs>
          ${[0, 1, 2, 3].map(i => `<line x1="0" x2="${W}" y1="${60 + i * 80}" y2="${60 + i * 80}" stroke="rgba(111,184,255,.12)"/>`).join("")}
          <path class="ar" d="${o.line || `M0,40 C${W * .25},60 ${W * .45},120 ${W * .6},170 C${W * .75},220 ${W * .85},250 ${W},290`} L${W},${H} L0,${H}Z" fill="url(#g${o.id})" opacity="0"/>
          <path class="ln" d="${o.line || `M0,40 C${W * .25},60 ${W * .45},120 ${W * .6},170 C${W * .75},220 ${W * .85},250 ${W},290`}" fill="none" stroke="#ff5a6e" stroke-width="6"/></svg>`;
        P.ln = e.querySelector(".ln"); P.ar = e.querySelector(".ar"); P.big = e.querySelector(".big");
      }
      if (o.type === "sticky") e.innerHTML = o.text;
      root._objs[o.id] = { o, e, P, cx: o.x + o.w / 2, cy: o.y + (o.h || 600) / 2 };
    });
    U.el("div", "scan", null, root); U.el("div", "lamp", null, root);
    root._w = w;
  },
  render(root, t, d, ctx) {
    const { U, W, H } = ctx, O = root._objs, shots = (d.shots || []).map(s => {
      const o = typeof s.to === "string" ? O[s.to] : null;
      return { t: s.t, x: (o ? o.cx : s.to[0]) + (s.dx || 0), y: (o ? o.cy : s.to[1]) + (s.dy || 0), s: s.s || 1, r: s.r ?? (o ? o.o.r || 0 : 0) };
    });
    const FLY = d.fly || .6;
    const cam = (t) => {
      if (shots.length === 1) return { ...shots[0] };
      let i = shots.findIndex((s, k) => k + 1 < shots.length && t < shots[k + 1].t); if (i < 0) i = shots.length - 2;
      const a = shots[i], b = shots[i + 1], fly = Math.min(FLY, b.t - a.t);
      const k = U.io3((t - (b.t - fly)) / fly), drift = U.clamp((t - a.t) / Math.max(.1, b.t - a.t - fly));
      const s0 = a.s * (1 + .03 * drift);   // медленный наезд, пока держим кадр
      return { x: U.lerp(a.x, b.x, k), y: U.lerp(a.y, b.y, k), s: U.lerp(s0, b.s, k), r: U.lerp(a.r, b.r, k) * .35 };
    };
    const c = cam(t), p = cam(t - 1 / 30), v = Math.hypot(c.x - p.x, c.y - p.y) * c.s + Math.abs(c.s - p.s) * 900;
    const w = root._w;
    w.style.transform = `translate(${W / 2}px, ${H / 2}px) rotate(${-c.r}deg) scale(${c.s}) translate(${-c.x}px, ${-c.y}px)`;
    w.style.filter = v > 6 ? `blur(${Math.min(8, v / 14).toFixed(1)}px)` : "";
    Object.values(O).forEach(({ o, e, P, cx, cy }) => {
      const dd = Math.hypot(cx - c.x, cy - c.y) * c.s;
      e.style.filter = c.s > .6 && dd > 900 ? `blur(${Math.min(6, (dd - 900) / 160).toFixed(1)}px)` : "";
      if (o.type === "doc" && o.key) {
        if (P.hl) P.hl.style.width = `${100 * U.out3((t - (o.key.hl ?? 1e9)) / .55)}%`;
        if (P.circ) U.draw(P.circ, U.io3((t - (o.key.circle ?? 1e9)) / .5));
        if (P.note) { const kn = U.out5((t - o.key.note.t) / .3); P.note.style.opacity = t < o.key.note.t ? 0 : 1; P.note.style.transform = `rotate(-8deg) scale(${U.lerp(1.4, 1, kn)})`; }
      }
      if (o.type === "phone" && P.push) { const kp = U.out5((t - o.push.t) / .45); P.push.style.transform = `translateY(${(1 - kp) * -220}px)`; P.push.style.opacity = t < o.push.t ? 0 : 1; }
      if (o.type === "ledger") {
        const r0 = o.rowsT ?? 0, gap = o.rowsGap ?? .25; P.rows.forEach((r, i) => { const k = U.out3((t - r0 - i * gap) / .3); r.style.opacity = k; r.style.transform = `translateX(${(1 - k) * 30}px)`; });
        if (P.sum) { const k = U.io3((t - o.sum.t0) / (o.sum.t1 - o.sum.t0)); P.sum.textContent = (o.sum.prefix || "") + U.fmt(U.lerp(o.sum.from, o.sum.to, k)) + (o.sum.suffix || " ₽"); }
        if (P.stamp) { const ks = U.out5((t - o.stamp.t) / .2); P.stamp.style.opacity = t < o.stamp.t ? 0 : .9; P.stamp.style.transform = `rotate(-12deg) scale(${U.lerp(2, 1, ks)})`; }
      }
      if (o.type === "card") {
        if (P.strike) U.draw(P.strike, U.io3((t - (o.strike ?? 1e9)) / .35));
        if (P.a) { const ka = U.out5((t - o.a.t) / .5); P.a.style.opacity = U.clamp((t - o.a.t) / .3); P.a.style.transform = `translateY(${(1 - ka) * 30}px)`; }
      }
      if (o.type === "mon") { const k = U.io3((t - (o.draw ?? 0)) / (o.drawDur || 1.4)); U.draw(P.ln, k); P.ar.setAttribute("opacity", U.clamp((k - .6) / .4)); }
      if (o.type === "sticky") { const k = U.back((t - (o.t ?? 0)) / .45); e.style.opacity = t < (o.t ?? 0) ? 0 : 1; e.style.transform = `rotate(${o.r || 0}deg) scale(${U.lerp(1.3, 1, k)})`; }
    });
  },
});
