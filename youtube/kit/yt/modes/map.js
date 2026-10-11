// Режим «Карта» (владелец 11.10: «при фразе „курьер пешком зарабатывает 350–500 ₽ в час“ показать модельку курьера на карте,
// как он ходит за заказами и отдаёт их — и так почти к каждой фразе»). Плоская иллюстрация без 3D-моделей: ночной город
// (кварталы, парк, река, улицы, фонари), курьер с жёлтым термокоробом идёт по улицам, оставляет пунктир, забирает заказ у кафе
// (пакет летит в короб) и отдаёт у дома (выходит клиент, пакет летит ему, монеты летят в счётчик), камера ведёт с запаздыванием.
// Жизнь города: машины с фарами, прохожие с зонтами, брызги дождя, карточка заказа со статусом.
// v2 (владелец: «ролик курьера неплохо, сделать более живым и вид на него снизу»): view "nav" — как в навигаторе: карта
// наклонена, курьер внизу кадра идёт от нас (вид со спины), камера разворачивается по ходу движения; фигуры стоят вертикально.
// data: { view: "nav"|"top", grid: 300, nx, ny, seed, route: [[i, j, "pick"|"drop"|null], …] (перекрёстки; углы вставляются сами),
//   speed (px/с), pause, t0, earn: [суммы на каждой выдаче], clock: {from, to} (минуты), clockT, rain, park: [[i, j]], river: ряд,
//   zoom, zoomOutT, tilt (°, для nav), lines: [[текст, класс, t]] — подпись, capOut — когда подпись уходит, cars, people, order }
(function () {
  // идёт только по улицам: если соседние точки не на одной улице, вставляем угол (сначала по горизонтали)
  const expand = (route) => route.reduce((o, r) => { const a = o[o.length - 1];
    if (a && a[0] !== r[0] && a[1] !== r[1]) o.push([r[0], a[1], null]); o.push(r); return o; }, []);
  // ключевые точки маршрута по времени (общие для render и events)
  const plan = (d) => { const G = d.grid || 300, V = d.speed || 900, PA = d.pause ?? .55, pts = expand(d.route).map(([i, j, k]) => ({ x: i * G, y: j * G, k }));
    let tt = d.t0 ?? .3; const keys = [{ t: tt, x: pts[0].x, y: pts[0].y }], stops = [];
    for (let n = 1; n < pts.length; n++) { const a = pts[n - 1], b = pts[n]; tt += Math.hypot(b.x - a.x, b.y - a.y) / V; keys.push({ t: tt, x: b.x, y: b.y });
      if (b.k) { const L = Math.hypot(b.x - a.x, b.y - a.y) || 1; stops.push({ t: tt, k: b.k, x: b.x, y: b.y, dx: (b.x - a.x) / L, dy: (b.y - a.y) / L }); tt += PA; keys.push({ t: tt, x: b.x, y: b.y }); } }
    return { keys, stops }; };
  const hash = (a, b) => { const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return s - Math.floor(s); };
  // курьер сбоку (вид сверху) и со спины (навигатор): короб, руки и ноги двигаются от фазы шага
  const SIDE = `<svg class="fig" width="120" height="150" viewBox="-60 -10 120 150" style="left:-60px;top:-140px">
    <g class="lg1"><rect x="-8" y="78" width="15" height="48" rx="7" fill="#26324f"/><rect x="-10" y="120" width="22" height="10" rx="4" fill="#0e1220"/></g>
    <g class="lg2"><rect x="-8" y="78" width="15" height="48" rx="7" fill="#1d2740"/><rect x="-10" y="120" width="22" height="10" rx="4" fill="#0e1220"/></g>
    <rect x="-36" y="20" width="44" height="52" rx="8" fill="#ffd60a"/><rect x="-36" y="34" width="44" height="6" fill="#d6b000"/>
    <rect x="-14" y="30" width="34" height="56" rx="14" fill="#2c3a63"/>
    <g class="ar"><rect x="0" y="36" width="12" height="44" rx="6" fill="#2c3a63"/><circle cx="6" cy="82" r="7" fill="#f2c8a0"/></g>
    <circle cx="6" cy="14" r="16" fill="#f2c8a0"/><path d="M-10 10 a16 16 0 0 1 32 -2 L22 4 L-10 6Z" fill="#1d2740"/><rect x="14" y="4" width="14" height="5" rx="2" fill="#1d2740"/></svg>`;
  const BACK = `<svg class="fig" width="150" height="210" viewBox="-75 -205 150 210" style="left:-75px;top:-205px">
    <g class="lg1"><rect x="-24" y="-78" width="20" height="74" rx="9" fill="#232d4a"/><rect x="-27" y="-12" width="26" height="14" rx="6" fill="#0b0f1c"/></g>
    <g class="lg2"><rect x="4" y="-78" width="20" height="74" rx="9" fill="#1b2440"/><rect x="1" y="-12" width="26" height="14" rx="6" fill="#0b0f1c"/></g>
    <g class="bd">
      <g class="a1"><rect x="-44" y="-150" width="16" height="66" rx="8" fill="#2a3760"/><circle cx="-36" cy="-82" r="9" fill="#e9bd94"/></g>
      <g class="a2"><rect x="28" y="-150" width="16" height="66" rx="8" fill="#2a3760"/><circle cx="36" cy="-82" r="9" fill="#e9bd94"/></g>
      <rect x="-32" y="-158" width="64" height="86" rx="18" fill="#2c3a63"/>
      <circle cx="0" cy="-176" r="22" fill="#e9bd94"/><path d="M-23 -178 a23 23 0 0 1 46 0 v4 h-46z" fill="#141b30"/>
      <rect x="-40" y="-164" width="80" height="76" rx="10" fill="#ffd60a"/><rect x="-40" y="-164" width="80" height="12" rx="6" fill="#ffe55c"/>
      <rect x="-40" y="-130" width="80" height="7" fill="#d6b000"/><rect x="-12" y="-110" width="24" height="12" rx="3" fill="#d6b000"/>
      <rect class="lid" x="-40" y="-170" width="80" height="12" rx="5" fill="#ffe55c" style="transform-box:view-box;transform-origin:-40px -164px"/>
    </g></svg>`;
  const BAG = `<svg width="52" height="60" viewBox="0 0 52 60"><path d="M6 18h40l-4 40H10z" fill="#c98b4a"/><path d="M6 18h40l-2 8H8z" fill="#a8703a"/><path d="M17 20v-6a9 9 0 0 1 18 0v6" fill="none" stroke="#7a4f27" stroke-width="4"/></svg>`;
  const GUEST = `<svg width="110" height="190" viewBox="-55 -185 110 190" style="position:absolute;left:-55px;top:-185px;overflow:visible">
    <rect x="-20" y="-70" width="17" height="68" rx="8" fill="#3b2a52"/><rect x="3" y="-70" width="17" height="68" rx="8" fill="#33244a"/>
    <rect x="-28" y="-140" width="56" height="80" rx="18" fill="#8a5cf6"/>
    <g class="wave"><rect x="22" y="-140" width="14" height="56" rx="7" fill="#8a5cf6"/><circle cx="29" cy="-84" r="8" fill="#f2c8a0"/></g>
    <rect x="-36" y="-140" width="14" height="56" rx="7" fill="#7a4fe6"/><circle cx="-29" cy="-84" r="8" fill="#f2c8a0"/>
    <circle cx="0" cy="-160" r="20" fill="#f2c8a0"/><path d="M-21 -160 a21 21 0 0 1 42 0 q-10 -8 -21 -6 q-12 -2 -21 6z" fill="#3a2414"/>
    <circle cx="-7" cy="-160" r="2.6" fill="#1a1a1a"/><circle cx="7" cy="-160" r="2.6" fill="#1a1a1a"/><path d="M-6 -150 q6 5 12 0" fill="none" stroke="#1a1a1a" stroke-width="2.4" stroke-linecap="round"/></svg>`;
  const ICON = { pick: '<svg width="48" height="48" viewBox="0 0 48 48"><path d="M16 6v14a6 6 0 0 0 12 0V6 M22 6v36 M34 6c-6 4-6 16 0 18v18" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"/></svg>',
    drop: '<svg width="48" height="48" viewBox="0 0 48 48"><path d="M6 22L24 8l18 14 M12 18v22h24V18" fill="none" stroke="#fff" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/></svg>' };

  YT.mode("map", {
    css: `
    .yt-map { background: #070b17; }
    .yt-map .world { position: absolute; left: 0; top: 0; transform-origin: 0 0; }
    .yt-map.nav .world { transform-style: preserve-3d; }
    .yt-map .bb { position: absolute; left: 0; top: 0; width: 0; height: 0; transform-origin: 0 0; }
    .yt-map .pin { position: absolute; width: 96px; height: 96px; left: -48px; top: -118px; }
    .yt-map .pin b { position: absolute; inset: 0; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); box-shadow: 0 12px 24px rgba(0,0,0,.5); }
    .yt-map .pin svg { position: absolute; left: 24px; top: 22px; }
    .yt-map .pop { position: absolute; left: 0; bottom: 0; padding: 10px 20px; border-radius: 30px; font: 800 34px "Mont"; white-space: nowrap; box-shadow: 0 10px 24px rgba(0,0,0,.4); color: #06140b; }
    .yt-map .fig { position: absolute; overflow: visible; }
    .yt-map .halo { position: absolute; left: 0; top: 0; width: 190px; height: 190px; margin: -95px; border-radius: 50%; background: radial-gradient(closest-side, rgba(255,214,10,.35), transparent); }
    .yt-map .shadow { position: absolute; left: 0; top: 0; width: 80px; height: 80px; margin: -40px; border-radius: 50%; background: radial-gradient(closest-side, rgba(0,0,0,.65), transparent); }
    .yt-map .bag { position: absolute; left: -26px; top: -60px; }
    .yt-map .car { position: absolute; left: 0; top: 0; width: 64px; height: 34px; margin: -17px -32px; border-radius: 10px; }
    .yt-map .car i { position: absolute; left: 62px; top: -30px; width: 230px; height: 94px; background: radial-gradient(ellipse at 0 50%, rgba(255,240,190,.38), transparent 70%); }
    .yt-map .car u { position: absolute; left: -4px; top: 5px; width: 6px; height: 24px; border-radius: 3px; background: #ff3d4f; box-shadow: 0 0 14px #ff3d4f; }
    .yt-map .umb { position: absolute; left: 0; top: 0; border-radius: 50%; box-shadow: 0 6px 10px rgba(0,0,0,.45); }
    .yt-map .spl { position: absolute; left: 0; top: 0; width: 40px; height: 40px; margin: -20px; border-radius: 50%; border: 2px solid rgba(190,215,255,.7); }
    .yt-map .coin { position: absolute; left: 0; top: 0; width: 46px; height: 46px; margin: -23px; border-radius: 50%; background: radial-gradient(circle at 35% 35%, #fff3a8, #ffd60a 55%, #c99a00); box-shadow: 0 0 18px rgba(255,214,10,.7); font: 900 24px/46px "Unb"; color: #8a6400; text-align: center; }
    .yt-map .hud { position: absolute; right: 70px; top: 60px; display: flex; gap: 18px; }
    .yt-map .hud > div { padding: 16px 26px; border-radius: 20px; background: rgba(8,12,26,.85); border: 1.5px solid rgba(143,162,214,.3); color: #fff; font: 800 40px "Mont"; display: flex; align-items: center; gap: 14px; white-space: nowrap; }
    .yt-map .hud small { font: 600 22px "Mont"; color: #8fa2d6; display: block; } .yt-map .hud .g { color: #2ee07a; display: inline-block; transform-origin: 0 50%; }
    .yt-map .order { position: absolute; left: 70px; bottom: 110px; width: 430px; padding: 20px 26px; border-radius: 22px; background: rgba(8,12,26,.88); border: 1.5px solid rgba(143,162,214,.3); color: #fff; }
    .yt-map .order small { font: 600 22px "Mont"; color: #8fa2d6; } .yt-map .order b { display: block; font: 800 34px "Mont"; margin: 6px 0 14px; }
    .yt-map .order .bar { height: 10px; border-radius: 5px; background: #1b2442; overflow: hidden; } .yt-map .order .bar i { display: block; height: 100%; background: #ffd60a; border-radius: 5px; }
    .yt-map .rain { position: absolute; inset: -200px; pointer-events: none; opacity: .55;
      background-image: repeating-linear-gradient(100deg, transparent 0 22px, rgba(170,200,255,.2) 22px 24px, transparent 24px 61px); }
    .yt-map .fog { position: absolute; left: 0; right: 0; top: 0; height: 50%; pointer-events: none; background: linear-gradient(180deg, #070b17 0%, rgba(7,11,23,.9) 30%, rgba(20,30,62,.3) 72%, transparent); }
    .yt-map .cap { position: absolute; left: 90px; bottom: 120px; color: #f3efe6; }
    .yt-map .cap.top { bottom: auto; top: 70px; }
    .yt-map .cap .ln { display: block; white-space: nowrap; overflow: hidden; } .yt-map .cap .ln span { display: inline-block; }
    .yt-map .cap .c { font: 600 30px/1.6 "Mont"; color: #9fb0dd; } .yt-map .cap .a { font: 900 70px/1.08 "Unb"; letter-spacing: -.03em; } .yt-map .cap .b { font: 900 86px/1.12 "Unb"; color: #ffd60a; letter-spacing: -.03em; }
    .yt-map .shade { position: absolute; inset: 0; pointer-events: none; background: radial-gradient(ellipse at 50% 60%, transparent 55%, rgba(0,0,0,.6)); }
    `,
    build(root, d, ctx) {
      const { U } = ctx, P = root._p = {}, G = d.grid || 300, NX = d.nx || 14, NY = d.ny || 10, WW = NX * G, HH = NY * G, rnd = U.rnd(d.seed || 9);
      const nav = P.nav = d.view === "nav"; if (nav) root.classList.add("nav");
      const w = P.w = U.el("div", "world", null, root); w.style.width = WW + "px"; w.style.height = HH + "px";
      // город: кварталы между улицами, парк и река; улицы с осевой разметкой; фонари на перекрёстках
      let svg = `<svg width="${WW}" height="${HH}" viewBox="0 0 ${WW} ${HH}" style="position:absolute;left:0;top:0"><defs><radialGradient id="lmp"><stop offset="0" stop-color="#ffcf7a" stop-opacity=".5"/><stop offset="1" stop-color="#ffcf7a" stop-opacity="0"/></radialGradient></defs><rect width="${WW}" height="${HH}" fill="#0b1020"/>`;
      const parks = d.park || [[6, 0], [6, 1], [6, 2], [7, 0], [7, 1], [7, 2]];
      for (let i = 0; i < NX; i++) for (let j = 0; j < NY; j++) {
        const x = i * G + 26, y = j * G + 26, s = G - 52, park = parks.some(([a, b]) => a === i && b === j), water = j === (d.river ?? 7);
        if (water) { svg += `<rect x="${i * G}" y="${j * G + 40}" width="${G}" height="${G - 80}" fill="#0f2a4d"/><path d="M${i * G} ${j * G + 110} q75 -14 150 0 t150 0 M${i * G} ${j * G + 190} q75 -14 150 0 t150 0" stroke="rgba(120,170,255,.22)" stroke-width="4" fill="none"/>`; continue; }
        if (park) { svg += `<rect x="${x}" y="${y}" width="${s}" height="${s}" rx="26" fill="#11351f"/>` + Array.from({ length: 6 }, () => `<circle cx="${x + 30 + rnd() * (s - 60)}" cy="${y + 30 + rnd() * (s - 60)}" r="${16 + rnd() * 18}" fill="#1a4d2c"/>`).join(""); continue; }
        // в квартале 2–4 дома: тень, крыша с бликом, светящиеся окна
        const n = 2 + Math.floor(rnd() * 3);
        for (let k = 0; k < n; k++) { const bw = s / n - 10, bx = x + k * (s / n) + 5, bh = s * (.55 + rnd() * .45), by = y + (s - bh), c = ["#16203f", "#1a2550", "#141c38", "#1d2a58"][Math.floor(rnd() * 4)];
          svg += `<rect x="${bx + 8}" y="${by + 10}" width="${bw}" height="${bh}" rx="10" fill="rgba(0,0,0,.35)"/><rect x="${bx}" y="${by}" width="${bw}" height="${bh}" rx="10" fill="${c}"/><rect x="${bx + 6}" y="${by + 6}" width="${bw - 12}" height="8" rx="4" fill="rgba(255,255,255,.05)"/>`;
          for (let q = 0; q < 5; q++) if (rnd() < .55) svg += `<rect x="${bx + 10 + rnd() * (bw - 30)}" y="${by + 16 + rnd() * (bh - 34)}" width="12" height="12" rx="2" fill="rgba(255,214,140,${(.25 + rnd() * .55).toFixed(2)})"/>`; }
      }
      for (let i = 0; i <= NX; i++) svg += `<line x1="${i * G}" y1="0" x2="${i * G}" y2="${HH}" stroke="#222c4f" stroke-width="44"/><line x1="${i * G}" y1="0" x2="${i * G}" y2="${HH}" stroke="#39457a" stroke-width="3" stroke-dasharray="26 30"/>`;
      for (let j = 0; j <= NY; j++) svg += `<line x1="0" y1="${j * G}" x2="${WW}" y2="${j * G}" stroke="#222c4f" stroke-width="44"/><line x1="0" y1="${j * G}" x2="${WW}" y2="${j * G}" stroke="#39457a" stroke-width="3" stroke-dasharray="26 30"/>`;
      for (let i = 0; i <= NX; i++) for (let j = 0; j <= NY; j++) svg += `<circle cx="${i * G + 30}" cy="${j * G - 30}" r="80" fill="url(#lmp)"/><circle cx="${i * G + 30}" cy="${j * G - 30}" r="6" fill="#ffe2a8"/>`;
      svg += `<path class="trail" d="" fill="none" stroke="#ffd60a" stroke-width="8" stroke-linecap="round" stroke-dasharray="2 22" opacity=".9"/></svg>`;
      U.el("div", null, svg, w); P.trail = w.querySelector(".trail");
      Object.assign(P, plan(d));
      // машины по улицам (плоские, с фарами) и прохожие с зонтами
      const r2 = U.rnd((d.seed || 9) + 5);
      P.cars = Array.from({ length: d.cars ?? 18 }, () => { const hz = r2() < .5, line = Math.floor(r2() * ((hz ? NY : NX) + 1)), dir = r2() < .5 ? 1 : -1;
        const e = U.el("div", "car", "<i></i><u></u>", w); e.style.background = ["#e8eefc", "#ff6b4a", "#4a7dff", "#3a4566", "#ffd60a"][Math.floor(r2() * 5)];
        return { e, hz, line, dir, v: 380 + r2() * 320, ph: r2() * 5000, L: hz ? WW : HH }; });
      P.people = Array.from({ length: d.people ?? 30 }, () => { const hz = r2() < .5, line = Math.floor(r2() * ((hz ? NY : NX) + 1)), side = r2() < .5 ? -32 : 32, s = 26 + r2() * 12;
        const e = U.el("div", "umb", null, w); Object.assign(e.style, { width: s + "px", height: s + "px", margin: -s / 2 + "px", background: ["#ff4d6d", "#4dabff", "#3a4566", "#ffd60a", "#7bd88f", "#c38bff"][Math.floor(r2() * 6)] });
        return { e, hz, line, side, v: (r2() < .5 ? 1 : -1) * (40 + r2() * 40), ph: r2() * 4000, L: hz ? WW : HH }; });
      P.spl = Array.from({ length: 14 }, () => U.el("div", "spl", null, w));
      // точки: кафе (вилка) и дома (домик) — на углу квартала; у домов — клиент, выходит к выдаче
      const bb = (html) => U.el("div", "bb", html, w);
      // точка — справа по ходу (в навигаторе) или на углу квартала (сверху); клиент — между курьером и точкой
      P.pins = P.stops.map(s => { if (nav) { const rx = -s.dy, ry = s.dx; s.px = s.x + rx * 190 - s.dx * 10; s.py = s.y + ry * 190 - s.dy * 10; s.gx = s.x + rx * 105 + s.dx * 25; s.gy = s.y + ry * 105 + s.dy * 25; }
        else { s.px = s.x + 95; s.py = s.y - 30; s.gx = s.px + 70; s.gy = s.py + 40; } return bb(`<div class="pin"><b style="background:${s.k === "pick" ? "#ff8a3d" : "#2b8cff"}"></b>${ICON[s.k]}</div>`); });
      P.sh = U.el("div", "shadow", null, w); P.halo = U.el("div", "halo", null, w);
      P.guests = P.stops.map(s => s.k === "drop" ? bb(GUEST) : null);
      let earned = 0, ei = 0;
      P.pops = P.stops.map(s => { let txt, bg;
        if (s.k === "pick") { txt = "заказ взят"; bg = "#ff8a3d"; } else { const v = (d.earn || [])[ei++] ?? 100; earned += v; s.v = v; s.sum = earned; txt = `+${v} ₽`; bg = "#2ee07a"; }
        return bb(`<div class="pop" style="background:${bg}">${txt}</div>`); });
      // курьер: тень и свечение лежат на земле, фигура стоит (в навигаторе — вид со спины)
      const c = P.c = bb(nav ? BACK : SIDE);
      ["lg1", "lg2", "ar", "a1", "a2", "bd", "lid"].forEach(k => P[k] = c.querySelector("." + k)); P.fig = c.querySelector(".fig");
      P.bags = P.stops.map(() => bb(`<div class="bag">${BAG}</div>`));
      if (nav) U.el("div", "fog", null, root);
      if (d.rain) P.rain = U.el("div", "rain", null, root);
      U.el("div", "shade", null, root);
      // HUD: часы смены и заработок; карточка текущего заказа
      const hud = U.el("div", "hud", `<div><svg width="44" height="44" viewBox="0 0 64 64"><circle cx="32" cy="32" r="26" fill="none" stroke="#8fa2d6" stroke-width="5"/><path class="hand" d="M32 32 L32 14" stroke="#ffd60a" stroke-width="5" stroke-linecap="round"/></svg><span><small>смена</small><b class="clk">0:00</b></span></div>
        <div><span><small>заработано · пример</small><b class="g ern">0 ₽</b></span></div>`, root);
      P.hand = hud.querySelector(".hand"); P.clk = hud.querySelector(".clk"); P.ern = hud.querySelector(".ern");
      if (d.order !== false) { P.ord = U.el("div", "order", `<small class="on">заказ</small><b class="st"></b><div class="bar"><i></i></div>`, root); P.ordN = P.ord.querySelector(".on"); P.ordS = P.ord.querySelector(".st"); P.ordB = P.ord.querySelector("i"); }
      P.coins = P.stops.filter(s => s.k === "drop").flatMap(s => [0, 1, 2].map(q => ({ s, q, e: U.el("div", "coin", "₽", root) })));
      if (d.lines) { const cap = U.el("div", "cap" + (nav ? " top" : ""), null, root); P.cap = d.lines.map(([txt, cls, t]) => { const l = U.el("span", "ln " + cls, null, cap); return { s: U.el("span", null, txt, l), t }; }); }
    },
    render(root, t, d, ctx) {
      const { U, W, H } = ctx, P = root._p, K = P.keys, nav = P.nav, TILT = nav ? (d.tilt ?? 54) : 0;
      // позиция; n — номер отрезка маршрута
      const pos = (tt) => { if (tt <= K[0].t) return { x: K[0].x, y: K[0].y, mv: 0, n: 1 };
        for (let n = 1; n < K.length; n++) if (tt < K[n].t) { const a = K[n - 1], b = K[n], k = (tt - a.t) / (b.t - a.t);
          return { x: U.lerp(a.x, b.x, k), y: U.lerp(a.y, b.y, k), mv: a.x !== b.x || a.y !== b.y ? 1 : 0, n }; }
        const z = K[K.length - 1]; return { x: z.x, y: z.y, mv: 0, n: K.length - 1 }; };
      // угол движения: от последнего отрезка с движением; на поворотах плавно доворачивает за .6 с
      const segA = (n) => { for (let m = Math.min(n, K.length - 1); m >= 1; m--) { const a = K[m - 1], b = K[m]; if (a.x !== b.x || a.y !== b.y) return { a: Math.atan2(b.y - a.y, b.x - a.x), t: a.t, m }; }
        const a = K[0], b = K[1]; return { a: Math.atan2(b.y - a.y, b.x - a.x), t: -1, m: 0 }; };
      const heading = (tt) => { const cur = segA(pos(tt).n), prev = cur.m > 1 ? segA(cur.m - 1) : cur; let da = cur.a - prev.a;
        while (da > Math.PI) da -= 2 * Math.PI; while (da < -Math.PI) da += 2 * Math.PI; return prev.a + da * U.io3((tt - cur.t + .15) / .6); };
      const p = pos(t), lag = pos(t - .3), S = d.zoom || (nav ? 1.15 : 1.25), hd = heading(t);
      const rot = nav ? (-hd * 180 / Math.PI - 90) : Math.sin(t * .2) * .4;
      const s = S * (1 - .14 * U.io3((t - (d.zoomOutT ?? 1e9)) / 1.5)), cy = nav ? H * .74 : H / 2 - 30;
      P.w.style.transform = `translate(${W / 2}px, ${cy}px) perspective(1500px) rotateX(${TILT}deg) scale(${s.toFixed(4)}) rotate(${rot.toFixed(2)}deg) translate(${(-lag.x).toFixed(1)}px, ${(-lag.y).toFixed(1)}px)`;
      // фигуры стоят вертикально: поворот карты и наклон гасим
      const up = (x, y, extra = "") => `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) rotate(${(-rot).toFixed(2)}deg) rotateX(${-TILT}deg) ${extra}`;
      const ph = t * 10 * p.mv, sw = Math.sin(ph);
      if (nav) {   // шаг со спины: ноги по очереди поднимаются, руки ходят, корпус качается; у кафе крышка короба открывается
        P.lg1.setAttribute("transform", `translate(0 ${(-Math.max(0, sw) * 12).toFixed(1)})`); P.lg2.setAttribute("transform", `translate(0 ${(-Math.max(0, -sw) * 12).toFixed(1)})`);
        P.a1.setAttribute("transform", `translate(0 ${(sw * 6).toFixed(1)})`); P.a2.setAttribute("transform", `translate(0 ${(-sw * 6).toFixed(1)})`);
        P.bd.setAttribute("transform", `translate(0 ${(-Math.abs(Math.cos(ph)) * 6 * p.mv).toFixed(1)}) rotate(${(sw * 2.5).toFixed(2)} 0 -80)`);
        const pk = P.stops.find(st => st.k === "pick" && t >= st.t - .1 && t < st.t + .7); P.lid.style.transform = `rotate(${pk ? (-40 * U.bell((t - pk.t + .1) / .8)).toFixed(1) : 0}deg)`;
        P.c.style.transform = up(p.x, p.y, `scale(${(S / s).toFixed(3)})`);
      } else {
        const swd = sw * 28;
        P.lg1.setAttribute("transform", `rotate(${swd} 0 80)`); P.lg2.setAttribute("transform", `rotate(${-swd} 0 80)`);
        P.ar.setAttribute("transform", p.mv ? `rotate(${-swd * .8} 6 38)` : `rotate(-70 6 38)`);
        P.fig.style.transform = `scaleX(${Math.cos(hd) < -.1 ? -1 : 1}) translateY(${(-Math.abs(sw) * 5).toFixed(1)}px)`;
        P.c.style.transform = up(p.x, p.y);
      }
      P.sh.style.transform = P.halo.style.transform = `translate(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px)`;
      // пунктир пройденного пути
      let dpath = `M${K[0].x},${K[0].y}`; for (let n = 1; n < K.length && K[n].t <= t; n++) dpath += ` L${K[n].x},${K[n].y}`; dpath += ` L${p.x.toFixed(1)},${p.y.toFixed(1)}`;
      P.trail.setAttribute("d", dpath);
      // машины и прохожие (по кругу вдоль своей улицы, правостороннее движение)
      const G = d.grid || 300;
      P.cars.forEach(c => { const u = (((c.ph + c.v * t * c.dir) % c.L) + c.L) % c.L, off = c.dir * 12;
        const x = c.hz ? u : c.line * G - off, y = c.hz ? c.line * G + off : u, a = c.hz ? (c.dir > 0 ? 0 : 180) : (c.dir > 0 ? 90 : -90);
        c.e.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) rotate(${a}deg)`; });
      P.people.forEach(q => { const u = (((q.ph + q.v * t) % q.L) + q.L) % q.L, x = q.hz ? u : q.line * G + q.side, y = q.hz ? q.line * G + q.side : u;
        q.e.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) scale(${(1 + .05 * Math.sin(t * 6 + q.ph)).toFixed(3)})`; });
      // брызги дождя вокруг курьера: каждое кольцо живёт .8 с и появляется в новом месте
      if (d.rain) P.spl.forEach((e, i) => { const T = .8, u = t + i * T / P.spl.length, c = Math.floor(u / T), k = (u % T) / T;
        const x = lag.x + (hash(i, c) - .5) * 900, y = lag.y + (hash(c, i + 7) - .5) * 900;
        e.style.transform = `translate(${x.toFixed(0)}px, ${y.toFixed(0)}px) scale(${(.3 + k * 1.2).toFixed(2)})`; e.style.opacity = ((1 - k) * .8).toFixed(2); });
      // точки, клиенты, пакеты, всплывашки
      P.pins.forEach((e, i) => { const st = P.stops[i], k = U.back((t - (st.t - 1.4)) / .45); e.style.opacity = t < st.t - 1.4 ? 0 : (nav ? 1 - U.clamp((t - st.t - (d.pause ?? .55)) / .3) : (t > st.t + 1.4 ? .4 : 1));
        e.style.transform = up(st.px, st.py, `scale(${U.lerp(.3, 1, k).toFixed(3)})`); });
      P.guests.forEach((e, i) => { if (!e) return; const st = P.stops[i], k = U.back((t - (st.t - .5)) / .4), out = U.clamp((t - st.t - (d.pause ?? .55) + .2) / .3);
        e.style.opacity = t < st.t - .5 ? 0 : 1 - out; e.style.transform = up(st.gx, st.gy, `scale(${(U.lerp(.2, 1, k) * (1 - .3 * out)).toFixed(3)})`);
        e.querySelector(".wave").setAttribute("transform", t > st.t + .35 ? `rotate(${(-150 + 18 * Math.sin(t * 14)).toFixed(1)} 29 -136)` : ""); });
      P.bags.forEach((e, i) => { const st = P.stops[i], a0 = st.k === "pick" ? st.t - .1 : st.t, k = U.io3((t - a0) / .45);
        e.style.opacity = t < a0 || k >= 1 ? 0 : 1;
        const [fx, fy, tx, ty] = st.k === "pick" ? [st.px, st.py, p.x, p.y] : [p.x, p.y, st.gx, st.gy];
        e.style.transform = up(U.lerp(fx, tx, k), U.lerp(fy, ty, k), `translateY(${(-80 - 180 * U.bell(k)).toFixed(1)}px) rotate(${(k * 360).toFixed(0)}deg)`); });
      P.pops.forEach((e, i) => { const st = P.stops[i], k = U.out5((t - st.t) / .4); e.style.opacity = t < st.t ? 0 : 1 - U.clamp((t - st.t - Math.min(1.2, (d.pause ?? .55) - .1)) / .3);
        e.style.transform = up(st.px, st.py, `translate(-40px, ${nav ? -270 : -150}px) translateY(${((1 - k) * 30 - U.clamp((t - st.t) / 1.4) * 40).toFixed(1)}px) scale(${U.lerp(.6, 1, U.back((t - st.t) / .35)).toFixed(3)})`); });
      // монеты от курьера летят в счётчик заработка
      P.coins.forEach(({ s: st, q, e }) => { const a0 = st.t + .25 + q * .12, k = U.io3((t - a0) / .7);
        e.style.opacity = t < a0 || k >= 1 ? 0 : 1; const x0 = W / 2, y0 = nav ? H * .6 : H / 2 - 120, x1 = W - 250, y1 = 140;
        e.style.transform = `translate(${U.lerp(x0, x1, k).toFixed(0)}px, ${(U.lerp(y0, y1, k) - 160 * U.bell(k)).toFixed(0)}px) scale(${(1.2 - .5 * k).toFixed(2)})`; });
      // часы смены (ускоренно) и заработок: счётчик «подпрыгивает», когда в него прилетают монеты
      const cl = d.clock || { from: 0, to: 60 }, T = d.clockT ?? (d.t0 ?? .3), Tend = K[K.length - 1].t, mins = U.lerp(cl.from, cl.to, U.clamp((t - T) / (Tend - T)));
      P.clk.textContent = `${Math.floor(mins / 60)}:${String(Math.floor(mins % 60)).padStart(2, "0")}`; P.hand.setAttribute("transform", `rotate(${mins * 6} 32 32)`);
      const done = P.stops.filter(st => st.k === "drop" && t >= st.t + .9).pop(); P.ern.textContent = (done ? done.sum : 0) + " ₽";
      P.ern.style.transform = done ? `scale(${(1 + .35 * U.bell((t - done.t - .9) / .35)).toFixed(3)})` : "";
      // карточка заказа: куда идёт и сколько пути осталось
      if (P.ord) { const nx = P.stops.find(st => st.t > t - .3), prv = [...P.stops].reverse().find(st => st.t <= t - .3), picks = P.stops.filter(st => st.k === "pick");
        P.ordN.textContent = `заказ ${Math.max(1, picks.filter(st => st.t <= (nx ? nx.t : 1e9)).length)} из ${picks.length}`;
        P.ordS.textContent = !nx ? "смена закрыта" : nx.k === "pick" ? "иду в кафе" : "несу клиенту";
        const a = prv ? prv.t : (d.t0 ?? .3), b = nx ? nx.t : a + 1; P.ordB.style.width = (nx ? 100 * U.clamp((t - a) / (b - a)) : 100).toFixed(1) + "%"; }
      if (P.rain) P.rain.style.transform = `translate(${(t * 140) % 61}px, ${(t * 900) % 400}px)`;
      if (P.cap) P.cap.forEach(({ s: sp, t: tw }) => { const k = U.out5((t - tw) / .5), o = U.in3(U.clamp((t - (d.capOut ?? 1e9)) / .5));
        sp.style.transform = `translateY(${((1 - k) * 110).toFixed(1)}%)`; sp.style.filter = `blur(${(10 * (1 - k) + 14 * o).toFixed(1)}px)`; sp.style.opacity = 1 - o; });
    },
    events(d) {   // «заказ взят» — chip, выдача — coin (и второй, когда монеты долетают до счётчика), шаги не озвучиваем
      const E = { chip: [], coin: [] }; plan(d).stops.forEach(s => { if (s.k === "pick") E.chip.push(s.t); else E.coin.push(s.t + .25, s.t + .9); });
      return E;
    },
  });
})();
