// Режим «Карта» (владелец 11.10: «при фразе „курьер пешком зарабатывает 350–500 ₽ в час“ показать модельку курьера на карте,
// как он ходит за заказами и отдаёт их — и так почти к каждой фразе»). Плоская иллюстрация без 3D: ночной город сверху
// (кварталы, парк, река, улицы), курьер-человечек с жёлтым термокоробом идёт по улицам (шаги, качание рук), оставляет пунктир,
// забирает заказ у кафе и отдаёт у дома («+ ₽» всплывает), камера ведёт его с запаздыванием, часы и заработок в углу, дождь.
// data: { grid: 300, route: [[i, j, "pick"|"drop"|null], …] (перекрёстки), speed (px/с), pause, earn: [суммы на каждой выдаче],
//   clock: {from, to} (минуты), rain: true, park: [[i, j]] — кварталы-парки, river: ряд реки, lines: [[текст, класс, t]] — подпись в кино-стиле, capOut — когда подпись уходит }
(function () {
  // идёт только по улицам: если соседние точки не на одной улице, вставляем угол (сначала по горизонтали)
  const expand = (route) => route.reduce((o, r) => { const a = o[o.length - 1];
    if (a && a[0] !== r[0] && a[1] !== r[1]) o.push([r[0], a[1], null]); o.push(r); return o; }, []);
  YT.mode("map", {
    css: `
    .yt-map { background: #0a0f1e; }
    .yt-map .world { position: absolute; left: 0; top: 0; transform-origin: 0 0; }
    .yt-map .pin { position: absolute; width: 96px; height: 96px; margin: -110px 0 0 -48px; }
    .yt-map .pin b { position: absolute; inset: 0; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); box-shadow: 0 12px 24px rgba(0,0,0,.5); }
    .yt-map .pin svg { position: absolute; left: 24px; top: 22px; }
    .yt-map .pop { position: absolute; padding: 10px 20px; border-radius: 30px; font: 800 34px "Mont"; white-space: nowrap; box-shadow: 0 10px 24px rgba(0,0,0,.4); }
    .yt-map .cour { position: absolute; left: 0; top: 0; width: 0; height: 0; }
    .yt-map .cour .halo { position: absolute; width: 170px; height: 170px; margin: -85px; border-radius: 50%; background: radial-gradient(closest-side, rgba(255,214,10,.35), transparent); }
    .yt-map .cour svg { position: absolute; left: -60px; top: -112px; overflow: visible; }
    .yt-map .hud { position: absolute; right: 70px; top: 60px; display: flex; gap: 18px; }
    .yt-map .hud div { padding: 16px 26px; border-radius: 20px; background: rgba(8,12,26,.85); border: 1.5px solid rgba(143,162,214,.3); color: #fff; font: 800 40px "Mont"; display: flex; align-items: center; gap: 14px; white-space: nowrap; }
    .yt-map .hud small { font: 600 22px "Mont"; color: #8fa2d6; display: block; } .yt-map .hud .g { color: #2ee07a; }
    .yt-map .rain { position: absolute; inset: -200px; pointer-events: none; opacity: .5;
      background-image: repeating-linear-gradient(105deg, transparent 0 22px, rgba(170,200,255,.18) 22px 24px, transparent 24px 61px); }
    .yt-map .cap { position: absolute; left: 90px; bottom: 120px; color: #f3efe6; }
    .yt-map .cap .ln { display: block; white-space: nowrap; overflow: hidden; } .yt-map .cap .ln span { display: inline-block; }
    .yt-map .cap .a { font: 900 76px/1.05 "Unb"; letter-spacing: -.03em; } .yt-map .cap .b { font: 900 92px/1.1 "Unb"; color: #ffd60a; letter-spacing: -.03em; }
    .yt-map .shade { position: absolute; inset: 0; pointer-events: none; background: linear-gradient(0deg, rgba(5,8,18,.85), transparent 45%), radial-gradient(ellipse at 50% 45%, transparent 55%, rgba(0,0,0,.55)); }
    `,
    build(root, d, ctx) {
      const { U } = ctx, P = root._p = {}, G = d.grid || 300, NX = d.nx || 14, NY = d.ny || 10, WW = NX * G, HH = NY * G, rnd = U.rnd(d.seed || 9);
      const w = P.w = U.el("div", "world", null, root); w.style.width = WW + "px"; w.style.height = HH + "px";
      // город: кварталы между улицами, парк и река; улицы — светлые линии с осевой разметкой
      let svg = `<svg width="${WW}" height="${HH}" viewBox="0 0 ${WW} ${HH}"><rect width="${WW}" height="${HH}" fill="#0b1020"/>`;
      for (let i = 0; i < NX; i++) for (let j = 0; j < NY; j++) {
        const x = i * G + 26, y = j * G + 26, s = G - 52, park = (d.park || [[6, 0], [6, 1], [6, 2], [7, 0], [7, 1], [7, 2]]).some(([a, b]) => a === i && b === j), water = j === (d.river ?? 7);
        if (water) { svg += `<rect x="${i * G}" y="${j * G + 40}" width="${G}" height="${G - 80}" fill="#0f2a4d"/>`; continue; }
        if (park) { svg += `<rect x="${x}" y="${y}" width="${s}" height="${s}" rx="26" fill="#11351f"/>` + Array.from({ length: 6 }, () => `<circle cx="${x + 30 + rnd() * (s - 60)}" cy="${y + 30 + rnd() * (s - 60)}" r="${16 + rnd() * 18}" fill="#1a4d2c"/>`).join(""); continue; }
        // в квартале 2–4 дома разной высоты (светлее — выше), окна светятся
        const n = 2 + Math.floor(rnd() * 3);
        for (let k = 0; k < n; k++) { const bw = s / n - 10, bx = x + k * (s / n) + 5, bh = s * (.55 + rnd() * .45), by = y + (s - bh), c = ["#16203f", "#1a2550", "#141c38", "#1d2a58"][Math.floor(rnd() * 4)];
          svg += `<rect x="${bx}" y="${by}" width="${bw}" height="${bh}" rx="10" fill="${c}"/>`;
          for (let q = 0; q < 4; q++) if (rnd() < .5) svg += `<rect x="${bx + 10 + rnd() * (bw - 30)}" y="${by + 12 + rnd() * (bh - 30)}" width="12" height="12" rx="2" fill="rgba(255,214,140,${(.25 + rnd() * .5).toFixed(2)})"/>`; }
      }
      for (let i = 0; i <= NX; i++) svg += `<line x1="${i * G}" y1="0" x2="${i * G}" y2="${HH}" stroke="#222c4f" stroke-width="44"/><line x1="${i * G}" y1="0" x2="${i * G}" y2="${HH}" stroke="#39457a" stroke-width="3" stroke-dasharray="26 30"/>`;
      for (let j = 0; j <= NY; j++) svg += `<line x1="0" y1="${j * G}" x2="${WW}" y2="${j * G}" stroke="#222c4f" stroke-width="44"/><line x1="0" y1="${j * G}" x2="${WW}" y2="${j * G}" stroke="#39457a" stroke-width="3" stroke-dasharray="26 30"/>`;
      svg += `<path class="trail" d="" fill="none" stroke="#ffd60a" stroke-width="8" stroke-linecap="round" stroke-dasharray="2 22" opacity=".9"/></svg>`;
      U.el("div", null, svg, w); P.trail = w.querySelector(".trail");
      // маршрут: ключевые точки по времени (идёт со скоростью speed, на остановках стоит pause)
      const pts = expand(d.route).map(([i, j, k]) => ({ x: i * G, y: j * G, k })), V = d.speed || 900, PA = d.pause ?? .55;
      let tt = d.t0 || .3; P.keys = [{ t: tt, x: pts[0].x, y: pts[0].y }]; P.stops = [];
      for (let n = 1; n < pts.length; n++) { const a = pts[n - 1], b = pts[n]; tt += Math.hypot(b.x - a.x, b.y - a.y) / V; P.keys.push({ t: tt, x: b.x, y: b.y });
        if (b.k) { P.stops.push({ t: tt, k: b.k, x: b.x, y: b.y }); tt += PA; P.keys.push({ t: tt, x: b.x, y: b.y }); } }
      P.pts = pts;
      // точки: кафе (вилка) и дома (домик)
      const ICON = { pick: '<svg width="48" height="48" viewBox="0 0 48 48"><path d="M16 6v14a6 6 0 0 0 12 0V6 M22 6v36 M34 6c-6 4-6 16 0 18v18" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"/></svg>',
        drop: '<svg width="48" height="48" viewBox="0 0 48 48"><path d="M6 22L24 8l18 14 M12 18v22h24V18" fill="none" stroke="#fff" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/></svg>' };
      P.pins = P.stops.map(s => { const e = U.el("div", "pin", `<b style="background:${s.k === "pick" ? "#ff8a3d" : "#2b8cff"}"></b>${ICON[s.k]}`, w);
        Object.assign(e.style, { left: (s.x + 95) + "px", top: (s.y - 30) + "px" }); return e; });   // на углу квартала, чтобы не перекрывать курьера
      let earned = 0, ei = 0;
      P.pops = P.stops.map(s => { let txt, bg;
        if (s.k === "pick") { txt = "заказ взят"; bg = "#ff8a3d"; } else { const v = (d.earn || [])[ei++] ?? 100; earned += v; s.v = v; s.sum = earned; txt = `+${v} ₽`; bg = "#2ee07a"; }
        const e = U.el("div", "pop", txt, w); Object.assign(e.style, { left: (s.x + 150) + "px", top: (s.y - 215) + "px", background: bg, color: "#06140b" }); return e; });
      // курьер: человечек сбоку с термокоробом; руки и ноги качаются от пройденного пути
      const c = P.c = U.el("div", "cour", `<div class="halo"></div><svg width="120" height="150" viewBox="-60 -10 120 150">
        <g class="lg1"><rect x="-8" y="78" width="15" height="48" rx="7" fill="#26324f"/><rect x="-10" y="120" width="22" height="10" rx="4" fill="#0e1220"/></g>
        <g class="lg2"><rect x="-8" y="78" width="15" height="48" rx="7" fill="#1d2740"/><rect x="-10" y="120" width="22" height="10" rx="4" fill="#0e1220"/></g>
        <rect x="-36" y="20" width="44" height="52" rx="8" fill="#ffd60a"/><rect x="-36" y="34" width="44" height="6" fill="#d6b000"/>
        <rect x="-14" y="30" width="34" height="56" rx="14" fill="#2c3a63"/>
        <g class="ar"><rect x="0" y="36" width="12" height="44" rx="6" fill="#2c3a63"/><circle cx="6" cy="82" r="7" fill="#f2c8a0"/></g>
        <circle cx="6" cy="14" r="16" fill="#f2c8a0"/><path d="M-10 10 a16 16 0 0 1 32 -2 L22 4 L-10 6Z" fill="#1d2740"/><rect x="14" y="4" width="14" height="5" rx="2" fill="#1d2740"/></svg>`, w);
      P.lg1 = c.querySelector(".lg1"); P.lg2 = c.querySelector(".lg2"); P.ar = c.querySelector(".ar"); P.fig = c.querySelector("svg");
      // HUD: часы смены и заработок
      const hud = U.el("div", "hud", `<div><svg width="44" height="44" viewBox="0 0 64 64"><circle cx="32" cy="32" r="26" fill="none" stroke="#8fa2d6" stroke-width="5"/><path class="hand" d="M32 32 L32 14" stroke="#ffd60a" stroke-width="5" stroke-linecap="round"/></svg><span><small>смена</small><b class="clk">0:00</b></span></div>
        <div><span><small>заработано · пример</small><b class="g ern">0 ₽</b></span></div>`, root);
      P.hand = hud.querySelector(".hand"); P.clk = hud.querySelector(".clk"); P.ern = hud.querySelector(".ern");
      if (d.rain) P.rain = U.el("div", "rain", null, root);
      U.el("div", "shade", null, root);
      if (d.lines) { const cap = U.el("div", "cap", null, root); P.cap = d.lines.map(([txt, cls, t]) => { const l = U.el("span", "ln " + cls, null, cap); return { s: U.el("span", null, txt, l), t }; }); }
    },
    render(root, t, d, ctx) {
      const { U, W, H } = ctx, P = root._p, K = P.keys;
      const pos = (tt) => { if (tt <= K[0].t) return { x: K[0].x, y: K[0].y, dir: 1, mv: 0 };
        for (let n = 1; n < K.length; n++) if (tt < K[n].t) { const a = K[n - 1], b = K[n], k = (tt - a.t) / (b.t - a.t);
          return { x: U.lerp(a.x, b.x, k), y: U.lerp(a.y, b.y, k), dir: b.x < a.x ? -1 : 1, mv: a.x !== b.x || a.y !== b.y ? 1 : 0 }; }
        const z = K[K.length - 1]; return { x: z.x, y: z.y, dir: 1, mv: 0 }; };
      const p = pos(t), lag = pos(t - .35), S = d.zoom || 1.25;
      // камера ведёт курьера с запаздыванием, медленно отъезжает к концу
      const s = S * (1 - .12 * U.io3((t - (d.zoomOutT ?? 1e9)) / 1.5));
      P.w.style.transform = `translate(${W / 2}px, ${H / 2 - 30}px) scale(${s.toFixed(4)}) translate(${(-lag.x).toFixed(1)}px, ${(-lag.y).toFixed(1)}px) rotate(${Math.sin(t * .2) * .4}deg)`;
      P.c.style.transform = `translate(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px)`;
      // шаг: фаза от времени в движении; на остановке — стоит, рука протягивает заказ
      const ph = t * 11 * p.mv, sw = Math.sin(ph) * 28 * p.mv;
      P.lg1.setAttribute("transform", `rotate(${sw} 0 80)`); P.lg2.setAttribute("transform", `rotate(${-sw} 0 80)`);
      P.ar.setAttribute("transform", p.mv ? `rotate(${-sw * .8} 6 38)` : `rotate(-70 6 38)`);
      P.fig.style.transform = `scaleX(${p.dir}) translateY(${(-Math.abs(Math.sin(ph)) * 5).toFixed(1)}px)`;
      // пунктир пройденного пути
      let dpath = `M${K[0].x},${K[0].y}`; for (let n = 1; n < K.length && K[n].t <= t; n++) dpath += ` L${K[n].x},${K[n].y}`; dpath += ` L${p.x.toFixed(1)},${p.y.toFixed(1)}`;
      P.trail.setAttribute("d", dpath);
      P.pins.forEach((e, i) => { const st = P.stops[i], k = U.back((t - (st.t - 1.2)) / .45); e.style.opacity = t < st.t - 1.2 ? 0 : (t > st.t + 1.2 ? .45 : 1);
        e.style.transform = `scale(${U.lerp(.3, 1, k)})`; });
      P.pops.forEach((e, i) => { const st = P.stops[i], k = U.out5((t - st.t) / .4); e.style.opacity = t < st.t ? 0 : 1 - U.clamp((t - st.t - 1.1) / .3);
        e.style.transform = `translateY(${((1 - k) * 30 - U.clamp((t - st.t) / 1.4) * 30).toFixed(1)}px) scale(${U.lerp(.6, 1, U.back((t - st.t) / .35))})`; });
      // часы смены (ускоренно) и заработок по выдачам
      const cl = d.clock || { from: 0, to: 60 }, T = (d.clockT || 0), Tend = (K[K.length - 1].t), mins = U.lerp(cl.from, cl.to, U.clamp((t - T) / (Tend - T)));
      P.clk.textContent = `${Math.floor(mins / 60)}:${String(Math.floor(mins % 60)).padStart(2, "0")}`; P.hand.setAttribute("transform", `rotate(${mins * 6} 32 32)`);
      const done = P.stops.filter(s => s.k === "drop" && t >= s.t).pop(); P.ern.textContent = (done ? done.sum : 0) + " ₽";
      if (P.rain) P.rain.style.transform = `translate(${(t * 140) % 61}px, ${(t * 900) % 400}px)`;
      if (P.cap) P.cap.forEach(({ s, t: tw }) => { const k = U.out5((t - tw) / .5); s.style.transform = `translateY(${((1 - k) * 110).toFixed(1)}%)`; const o = U.in3(U.clamp((t - (d.capOut ?? 1e9)) / .5));
        s.style.filter = `blur(${(10 * (1 - k) + 14 * o).toFixed(1)}px)`; s.style.opacity = 1 - o; });
    },
    events(d) {   // шаги не озвучиваем (шум), остальное: «заказ взят» — chip, «+ ₽» — coin, перелёт камеры нет
      const E = { chip: [], coin: [] }, G = d.grid || 300, V = d.speed || 900, PA = d.pause ?? .55; let tt = d.t0 || .3;
      const R = expand(d.route);
      R.forEach(([i, j, k], n) => { if (n) { const [a, b] = R[n - 1]; tt += Math.hypot(i - a, j - b) * G / V; } if (k) { (k === "pick" ? E.chip : E.coin).push(tt); tt += PA; } });
      return E;
    },
  });
})();
