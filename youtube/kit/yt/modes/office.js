// Режим «Ночной офис» (Y1, из experiments/2026-10-09-yt-directions/a_doc.html?theme=night): один большой стол-мир ночью,
// предметы (договор, телефон, выписка, карточка-вывод, монитор, стикер), камера перелетает между ними по кадрам shots.
// Моушн-блюр — по скорости камеры (считается аналитически из cam(t) и cam(t − 1/30), без состояния между кадрами),
// глубина резкости — предметы далеко от центра кадра мягче. Все события — в секундах от начала отрезка.
// data: { objects: [{id, type, x, y, w, h, r, match, ...}] (mon: head, big, sub, line, draw; doc: title, sub, key{text, hl, circle, note}; phone; ledger; card; sticky;
//   receipt: title, lines [[l, r, green]], total [l, r], linesT, gap, totalT; calendar: title, sub, first, days, marks [{day, t, label, lx, ly, color}];
//   letter: from, title, text, textT, wps), shots: [{t, to: id | [x, y], s, r, dx, dy, push, dolly: [dx, dy]}], fly }
// Y2 (11.10): doc key.strike — зачёркивание; phone ops [[подпись, сумма, зелёная]] с opsT/opsGap — история операций;
//   mon count {from, to, t0, t1, prefix, suffix} — счётчик в большой цифре, mon color — цвет цифры и графика.
// Y3 (11.10) — свет: мониторы светят на бумаги (цвет mon.glow или data.light [{t, color, i}] — смена по сцене), лампа data.lamp
//   {x, y, r, i} тёплым пятном, блик на экране телефона едет при движении камеры.
// Y4 (11.10) — камера-оператор: shot.push — сила наезда при удержании (0,03 по умолчанию; деталь — 0,1), shot.dolly — проезд вдоль
//   стола за время удержания; data.fg [{kind: pen|cup|cable|plant, x, y, w, h, r}] — предметы переднего плана (ближе к камере,
//   размыты, едут быстрее стола); data.shake — ручная тряска в px (0,4 по умолчанию, 0 — выкл.).
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
  .yt-office .receipt { padding: 50px 46px 70px; background: #f4f6fa; color: #1d2230; font: 700 30px "Mono"; border-radius: 6px 6px 0 0;
    box-shadow: 0 40px 80px rgba(0,0,0,.7); clip-path: polygon(0 0, 100% 0, 100% 97%, 95% 100%, 90% 97%, 85% 100%, 80% 97%, 75% 100%, 70% 97%, 65% 100%, 60% 97%, 55% 100%, 50% 97%, 45% 100%, 40% 97%, 35% 100%, 30% 97%, 25% 100%, 20% 97%, 15% 100%, 10% 97%, 5% 100%, 0 97%); }
  .yt-office .receipt .t { text-align: center; font: 800 34px "Mono"; letter-spacing: .1em; margin-bottom: 26px; }
  .yt-office .receipt .ln { display: flex; justify-content: space-between; margin-top: 16px; opacity: 0; } .yt-office .receipt .ln b { color: #1a8a4c; }
  .yt-office .receipt hr { border: 0; border-top: 3px dashed #9aa3b4; margin: 26px 0 8px; }
  .yt-office .receipt .tot { display: flex; justify-content: space-between; font: 800 40px "Mono"; margin-top: 14px; opacity: 0; } .yt-office .receipt .tot b { color: #1a8a4c; }
  .yt-office .calendar { padding: 46px; background: #f4f6fa; color: #1d2230; border-radius: 18px; box-shadow: 0 40px 80px rgba(0,0,0,.7); }
  .yt-office .calendar .t { font: 800 40px "Mont"; margin-bottom: 20px; display: flex; justify-content: space-between; } .yt-office .calendar .t span { color: #6f7a8e; font-weight: 600; }
  .yt-office .calendar .g { display: grid; grid-template-columns: repeat(7, 1fr); gap: 8px; }
  .yt-office .calendar .g div { height: 86px; border-radius: 12px; background: #e3e8f1; font: 700 28px "Mont"; padding: 10px 12px; position: relative; color: #4d5568; }
  .yt-office .calendar .g div i { position: absolute; inset: -4px; border: 6px solid #d42a2a; border-radius: 50%; opacity: 0; }
  .yt-office .calendar .lab { position: absolute; font: 800 italic 40px "Mont"; color: #d42a2a; white-space: nowrap; opacity: 0; }
  .yt-office .letter { padding: 70px 80px; background: #fbfcfe; color: #1d2230; font: 500 30px/1.55 "Mont"; box-shadow: 0 40px 80px rgba(0,0,0,.7); border-top: 18px solid #2b6bff; }
  .yt-office .letter .from { font: 700 24px "Mono"; color: #6f7a8e; letter-spacing: .08em; } .yt-office .letter h3 { font: 800 46px/1.15 "Mont"; margin: 20px 0 26px; }
  .yt-office .letter .w { opacity: 0; }
  .yt-office .lit { position: absolute; inset: 0; pointer-events: none; border-radius: inherit; mix-blend-mode: screen; z-index: 6; }
  .yt-office .shade { position: absolute; inset: 0; pointer-events: none; border-radius: inherit; mix-blend-mode: multiply; z-index: 6; }
  .yt-office .glint { position: absolute; inset: 0; pointer-events: none; z-index: 8; border-radius: inherit;
    background: linear-gradient(115deg, transparent 38%, rgba(255,255,255,.22) 47%, rgba(255,255,255,.06) 52%, transparent 60%); background-size: 320% 100%; }
  .yt-office .lampglow { position: absolute; border-radius: 50%; pointer-events: none; mix-blend-mode: screen; }
  .yt-office .fg { position: absolute; left: 0; top: 0; width: 4400px; height: 2600px; transform-origin: 0 0; pointer-events: none; }
  .yt-office .fg > div { position: absolute; }
  .yt-office .key s { position: relative; text-decoration: none; } .yt-office .key .strk { position: absolute; left: -6px; top: 50%; overflow: visible; }
  .yt-office .scr .op { display: flex; justify-content: space-between; margin: 0 24px; padding: 18px 8px; border-bottom: 1px solid #e1e5ea; font: 600 24px "Mont"; color: #4a515b; opacity: 0; }
  .yt-office .scr .op b { color: #c42424; } .yt-office .scr .op.g b { color: #1a8a4c; }
  .yt-office .scan { position: absolute; inset: 0; pointer-events: none; background: repeating-linear-gradient(0deg, rgba(255,255,255,.025) 0 2px, transparent 2px 4px); }
  .yt-office .lamp { position: absolute; inset: 0; pointer-events: none; background: radial-gradient(ellipse at 50% 45%, transparent 50%, rgba(0,4,12,.75)); }
  `,
  // Y5: звуки предметов по событиям отрезка (секунды от начала отрезка) — без DOM, вызывается из yt/sfx.js
  events(d, dur) {
    const E = { mark: [], pen: [], notif: [], chip: [], thud: [], ticks: [], keys: [], paper: [], slide: [], pan: [], hum: [[0, dur]] };
    (d.objects || []).forEach(o => {
      if (o.type === "doc" && o.key) { if (o.key.hl != null) E.mark.push(o.key.hl); if (o.key.circle != null) E.pen.push([o.key.circle, .5]);
        if (o.key.strike != null) E.pen.push([o.key.strike, .35]); if (o.key.note) E.pen.push([o.key.note.t, .3]); }
      if (o.type === "phone") { if (o.push) E.notif.push(o.push.t); (o.ops || []).forEach((_, i) => E.chip.push((o.opsT ?? 0) + i * (o.opsGap ?? .35))); }
      if (o.type === "ledger") { (o.rows || []).forEach((_, i) => E.chip.push((o.rowsT ?? 0) + i * (o.rowsGap ?? .25))); if (o.stamp) E.thud.push(o.stamp.t); if (o.sum) E.ticks.push([o.sum.t0, o.sum.t1]); }
      if (o.type === "mon" && o.count) E.ticks.push([o.count.t0, o.count.t1]);
      if (o.type === "card" && o.strike != null) E.pen.push([o.strike, .35]);
      if (o.type === "sticky") E.slide.push(o.t ?? 0);
      if (o.type === "receipt") (o.lines || []).forEach((_, i) => E.chip.push((o.linesT ?? 0) + i * (o.gap ?? .3)));
      if (o.type === "calendar") (o.marks || []).forEach(m => E.pen.push([m.t, .45]));
      if (o.type === "letter") { const n = (o.text || "").split(/\s+/).length; E.keys.push([o.textT ?? 0, (o.textT ?? 0) + n / (o.wps || 8)]); E.paper.push(Math.max(0, (o.textT ?? 0) - .4)); }
    });
    const sh = d.shots || [], fly = d.fly || .6;
    sh.slice(1).forEach(s => { E.pan.push(s.t - Math.min(fly, .6) / 2); E.paper.push(s.t - .05); });   // перелёт камеры: воздух + лист «лёг» в кадр
    return E;
  },
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
        if (o.color) { P.big.style.color = o.color; P.big.style.textShadow = `0 0 40px ${o.color}99`; P.ln.setAttribute("stroke", o.color);   // цвет графика (зелёный — деньги растут)
          e.querySelectorAll("stop").forEach((st, j) => st.setAttribute("stop-color", o.color + (j ? "00" : "73"))); }
      }
      if (o.type === "sticky") e.innerHTML = o.text;
      if (o.type === "receipt") {   // чек: строки появляются по очереди, итог — отдельно
        e.innerHTML = `<div class="t">${o.title || "КАССОВЫЙ ЧЕК"}</div>`;
        P.lines = (o.lines || []).map(([l, r, g]) => U.el("div", "ln", `<span>${l}</span>${g ? `<b>${r}</b>` : `<span>${r}</span>`}`, e));
        if (o.total) { U.el("hr", null, null, e); P.tot = U.el("div", "tot", `<span>${o.total[0]}</span><b>${o.total[1]}</b>`, e); }
      }
      if (o.type === "calendar") {  // календарь месяца: обводки дат и подписи от руки
        const first = o.first ?? 3, days = o.days ?? 31;
        e.innerHTML = `<div class="t">${o.title}<span>${o.sub || ""}</span></div><div class="g">` + Array.from({ length: first }, () => '<div style="background:none"></div>').join("") +
          Array.from({ length: days }, (_, i) => `<div>${i + 1}<i></i></div>`).join("") + "</div>";
        P.marks = (o.marks || []).map(m => ({ m, ring: e.querySelectorAll(".g div")[first + m.day - 1].querySelector("i"),
          lab: (() => { const l = U.el("div", "lab", m.label || "", e); Object.assign(l.style, { left: (m.lx ?? 60) + "px", top: (m.ly ?? 700) + "px", color: m.color || "" }); return l; })() }));
      }
      if (o.type === "letter") {    // письмо банка: текст проявляется по словам
        e.innerHTML = `<div class="from">${o.from || "ОТ: БАНК · УВЕДОМЛЕНИЕ"}</div><h3>${o.title}</h3><p>${o.text}</p>`;
        P.ws = U.words(e.querySelector("p"));
      }
      if (o.type === "doc" && o.key && o.key.strike != null) {   // Y2: зачёркивание ключевой фразы
        const k = e.querySelector(".key span[style]"); k.insertAdjacentHTML("beforeend", `<svg class="strk" width="10" height="10"><path d="M0,4 C200,-6 ${o.w * .6},10 ${o.w - 220},-4" fill="none" stroke="#d42a2a" stroke-width="9" stroke-linecap="round"/></svg>`);
        P.strk = k.querySelector(".strk path"); }
      if (o.type === "phone") {
        if (o.ops) P.ops = o.ops.map(([l, v, g]) => U.el("div", "op" + (g ? " g" : ""), `<span>${l}</span><b>${v}</b>`, e.firstChild));
        P.glint = U.el("div", "glint", null, e.firstChild);   // Y3: блик на стекле
      }
      if (["doc", "ledger", "card", "receipt", "calendar", "letter", "sticky"].includes(o.type)) { P.lit = U.el("div", "lit", null, e); P.shade = U.el("div", "shade", null, e); }
      root._objs[o.id] = { o, e, P, cx: o.x + o.w / 2, cy: o.y + (o.h || 600) / 2 };
    });
    if (d.lamp) { const L = d.lamp, g = U.el("div", "lampglow", null, w), R = L.r || 900;   // Y3: тёплое пятно настольной лампы
      Object.assign(g.style, { left: (L.x - R) + "px", top: (L.y - R) + "px", width: 2 * R + "px", height: 2 * R + "px",
        background: `radial-gradient(closest-side, rgba(255,190,110,${.32 * (L.i ?? 1)}), rgba(255,160,80,${.12 * (L.i ?? 1)}) 55%, transparent)` }); root._lampEl = g; }
    if (d.fg) { const f = U.el("div", "fg", null, root); root._fg = f;   // Y4: передний план
      const ART = {
        pen: (o) => `<div style="width:100%;height:100%;border-radius:${o.h / 2}px;background:linear-gradient(180deg,#3a3f4a,#16181d 60%,#0b0c0f);box-shadow:0 30px 60px rgba(0,0,0,.6)"><i style="position:absolute;left:12%;top:-18%;width:22%;height:46%;border-radius:6px;background:linear-gradient(180deg,#e6ebf2,#8d96a3)"></i><i style="position:absolute;right:-2%;top:30%;width:8%;height:40%;border-radius:0 40% 40% 0;background:#c9a44a"></i></div>`,
        cup: (o) => `<div style="width:100%;height:100%;border-radius:50%;background:radial-gradient(circle at 50% 50%,#3a2414 0 52%,#efe9df 53% 66%,#d7d0c4 67% 70%,transparent 71%);box-shadow:0 40px 80px rgba(0,0,0,.6)"></div>`,
        cable: (o) => `<svg width="${o.w}" height="${o.h}" viewBox="0 0 ${o.w} ${o.h}"><path d="M0,${o.h * .7} C${o.w * .3},${o.h * .1} ${o.w * .6},${o.h * 1.1} ${o.w},${o.h * .3}" fill="none" stroke="#0d0f14" stroke-width="${o.thick || 40}" stroke-linecap="round"/></svg>`,
        plant: (o) => `<div style="width:100%;height:100%;border-radius:50%;background:radial-gradient(circle at 40% 40%,#2f6b3a,#123a1e 60%,transparent 72%)"></div>`,
      };
      d.fg.forEach(o => { const e = U.el("div", null, ART[o.kind](o), f);
        Object.assign(e.style, { left: o.x + "px", top: o.y + "px", width: o.w + "px", height: o.h + "px", transform: `rotate(${o.r || 0}deg)`, filter: `blur(${o.blur ?? 16}px)`, opacity: o.o ?? .95 }); }); }
    U.el("div", "scan", null, root); U.el("div", "lamp", null, root);
    root._w = w;
  },
  render(root, t, d, ctx) {
    const { U, W, H } = ctx, O = root._objs, shots = (d.shots || []).map(s => {
      const o = typeof s.to === "string" ? O[s.to] : null;
      return { t: s.t, x: (o ? o.cx : s.to[0]) + (s.dx || 0), y: (o ? o.cy : s.to[1]) + (s.dy || 0), s: s.s || 1, r: s.r ?? (o ? o.o.r || 0 : 0), push: s.push, dolly: s.dolly };
    });
    const FLY = d.fly || .6;
    const cam = (t) => {
      if (shots.length === 1) return { ...shots[0] };
      let i = shots.findIndex((s, k) => k + 1 < shots.length && t < shots[k + 1].t); if (i < 0) i = shots.length - 2;
      const a = shots[i], b = shots[i + 1], fly = Math.min(FLY, b.t - a.t);
      const k = U.io3((t - (b.t - fly)) / fly), drift = U.io3(U.clamp((t - a.t) / Math.max(.1, b.t - a.t - fly)));
      const s0 = a.s * (1 + (a.push ?? .03) * drift);   // наезд, пока держим кадр (деталь — push 0,1)
      const ax = a.x + (a.dolly ? a.dolly[0] * drift : 0), ay = a.y + (a.dolly ? a.dolly[1] * drift : 0);   // проезд вдоль стола
      return { x: U.lerp(ax, b.x, k), y: U.lerp(ay, b.y, k), s: U.lerp(s0, b.s, k), r: U.lerp(a.r, b.r, k) * .35 };
    };
    const c = cam(t), p = cam(t - 1 / 30), v = Math.hypot(c.x - p.x, c.y - p.y) * c.s + Math.abs(c.s - p.s) * 900;
    const w = root._w;
    // ручная тряска: сумма медленных синусов, доли пикселя — «держит оператор», а не штатив
    const A = d.shake ?? .4, hx = A * (Math.sin(t * 1.7) + .6 * Math.sin(t * 3.1 + 1) + .3 * Math.sin(t * 7.3 + 2)) / 1.9,
      hy = A * (Math.cos(t * 1.3 + .5) + .6 * Math.sin(t * 2.7 + 2) + .3 * Math.cos(t * 6.1)) / 1.9, hr = A * .02 * Math.sin(t * 1.1);
    w.style.transform = `translate(${W / 2 + hx}px, ${H / 2 + hy}px) rotate(${-c.r + hr}deg) scale(${c.s}) translate(${-c.x}px, ${-c.y}px)`;
    w.style.filter = v > 6 ? `blur(${Math.min(8, v / 14).toFixed(1)}px)` : "";
    if (root._fg) {   // передний план ближе к камере: крупнее и едет в 1,6 раза быстрее стола
      const P = 1.6; root._fg.style.transform = `translate(${W / 2 + hx * 2}px, ${H / 2 + hy * 2}px) rotate(${-c.r}deg) scale(${c.s * P}) translate(${-c.x}px, ${-c.y}px)`;
      root._fg.style.filter = v > 6 ? `blur(${Math.min(10, v / 10).toFixed(1)}px)` : ""; }
    // Y3: источники света — мониторы (их цвет может меняться по сцене) и лампа
    const lightAt = (L) => { if (!L.t) return { color: L.color, i: L.i ?? 1 };
      let cur = L.t[0]; L.t.forEach(p => { if (t >= p.t) cur = p; }); const prev = L.t[Math.max(0, L.t.indexOf(cur) - 1)], k = U.clamp((t - cur.t) / .6);
      const mix = (a, b) => { const pa = a.match(/\w\w/g).map(h => parseInt(h, 16)), pb = b.match(/\w\w/g).map(h => parseInt(h, 16)); return pa.map((v, j) => Math.round(U.lerp(v, pb[j], k))); };
      return { rgb: mix(prev.color.slice(1), cur.color.slice(1)), i: U.lerp(prev.i ?? 1, cur.i ?? 1, k) }; };
    const LS = Object.values(O).filter(x => x.o.type === "mon").map(x => ({ x: x.cx, y: x.cy, r: x.o.lightR || 2200, ...(d.light ? lightAt({ t: d.light }) : lightAt({ color: x.o.glow || "#3c8cff" })) }));
    if (d.lamp) LS.push({ x: d.lamp.x, y: d.lamp.y, r: d.lamp.r || 900, color: "#ffb36b", i: .8 * (d.lamp.i ?? 1) });
    const rgbOf = (L) => L.rgb || L.color.slice(1).match(/\w\w/g).map(h => parseInt(h, 16));
    Object.values(O).forEach(({ o, e, P, cx, cy }) => {
      const dd = Math.hypot(cx - c.x, cy - c.y) * c.s;
      e.style.filter = c.s > .6 && dd > 900 ? `blur(${Math.min(6, (dd - 900) / 160).toFixed(1)}px)` : "";
      if (P.lit) {   // свет падает со стороны источника: светлое пятно у ближнего края, тень у дальнего
        const g = [], sh = [];
        LS.forEach(L => { const dx = L.x - cx, dy = L.y - cy, dist = Math.hypot(dx, dy), f = U.clamp(1 - dist / L.r) * L.i; if (f <= .02) return;
          const a = Math.atan2(dy, dx) - (o.r || 0) * Math.PI / 180, px = 50 + Math.cos(a) * 75, py = 50 + Math.sin(a) * 75, [R, G, B] = rgbOf(L);
          g.push(`radial-gradient(120% 120% at ${px.toFixed(0)}% ${py.toFixed(0)}%, rgba(${R},${G},${B},${(.42 * f).toFixed(3)}), transparent 70%)`);
          sh.push(`radial-gradient(130% 130% at ${(100 - px).toFixed(0)}% ${(100 - py).toFixed(0)}%, rgba(10,16,40,${(.28 * f).toFixed(3)}), transparent 70%)`); });
        P.lit.style.background = g.join(",") || "none"; P.shade.style.background = sh.join(",") || "none";
      }
      if (P.glint) P.glint.style.backgroundPosition = `${(50 + (c.x - cx) / 18 + t * 2).toFixed(1)}% 0`;
      if (o.type === "doc" && o.key) {
        if (P.hl) P.hl.style.width = `${100 * U.out3((t - (o.key.hl ?? 1e9)) / .55)}%`;
        if (P.circ) U.draw(P.circ, U.io3((t - (o.key.circle ?? 1e9)) / .5));
        if (P.strk) U.draw(P.strk, U.io3((t - o.key.strike) / .35));
        if (P.note) { const kn = U.out5((t - o.key.note.t) / .3); P.note.style.opacity = t < o.key.note.t ? 0 : 1; P.note.style.transform = `rotate(-8deg) scale(${U.lerp(1.4, 1, kn)})`; }
      }
      if (o.type === "phone" && P.ops) { const t0 = o.opsT ?? 0, gap = o.opsGap ?? .35;
        P.ops.forEach((r, i) => { const k = U.out3((t - t0 - i * gap) / .3); r.style.opacity = k; r.style.transform = `translateX(${(1 - k) * 40}px)`; }); }
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
      if (o.type === "mon") { const k = U.io3((t - (o.draw ?? 0)) / (o.drawDur || 1.4)); U.draw(P.ln, k); P.ar.setAttribute("opacity", U.clamp((k - .6) / .4));
        if (o.count) { const q = o.count, kc = U.io3((t - q.t0) / (q.t1 - q.t0)); P.big.textContent = (q.prefix || "") + U.fmt(U.lerp(q.from, q.to, kc)) + (q.suffix ?? " ₽"); } }
      if (o.type === "sticky") { const k = U.back((t - (o.t ?? 0)) / .45); e.style.opacity = t < (o.t ?? 0) ? 0 : 1; e.style.transform = `rotate(${o.r || 0}deg) scale(${U.lerp(1.3, 1, k)})`; }
      if (o.type === "receipt") {
        const t0 = o.linesT ?? 0, gap = o.gap ?? .3;
        P.lines.forEach((l, i) => { const k = U.out3((t - t0 - i * gap) / .25); l.style.opacity = k; l.style.transform = `translateY(${(1 - k) * -12}px)`; });
        if (P.tot) { const k = U.out5((t - (o.totalT ?? t0 + P.lines.length * gap + .3)) / .35); P.tot.style.opacity = k; P.tot.style.transform = `scale(${U.lerp(1.15, 1, k)})`; }
      }
      if (o.type === "calendar") P.marks.forEach(({ m, ring, lab }) => { const k = U.out5((t - m.t) / .4);
        ring.style.opacity = t < m.t ? 0 : 1; ring.style.transform = `scale(${U.lerp(1.6, 1, k)}) rotate(${-8 * (1 - k)}deg)`; ring.style.borderColor = m.color || "";
        lab.style.opacity = U.clamp((t - m.t - .2) / .25); lab.style.clipPath = `inset(-20% ${(100 * (1 - U.clamp((t - m.t - .2) / .5))).toFixed(1)}% -20% -5%)`; });
      if (o.type === "letter") U.showWords(P.ws, Math.floor((t - (o.textT ?? 0)) * (o.wps || 8)));
    });
  },
});
