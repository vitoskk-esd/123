// Режим «Премиум» (ролик №4, владелец 13.10: «берём первый стиль» — образец reels/lab/experiments/2026-10-13-yt-modern, style=premium):
// чёрный фон с мягким прожектором, металлические карты с бегущим бликом, серебряные заголовки, строки характеристик моноширинным,
// линия времени, телефон, сравнение карт в ряд и пьедестал. Всё детерминировано от локального времени t.
// data (все части необязательны, времена — секунды от начала отрезка, в build-скрипте пишутся как "@фраза"):
//   place: "№ 7"                                   — метка места над карточкой
//   hero:  { card, at, side: "left"|"center", tilt } — карта крупно; card = { bank, name, big, c1, c2, c3, ink }
//   fan:   { cards: [card…], at }                   — веер карт
//   quote: { text, sub, at, pos: "top"|"center"|"bottom", red }  — серебряный заголовок по словам (<em> — акцент)
//   rows:  { title, at, items: [{ k, v, at, c: "red"|"green"|"gold" }], src }  — строки «характеристика — значение»
//   line:  { at, parts: [{ w, label, c }], dots: [{ x, at, label, c }], cap }   — линия времени (x и w — доли 0..1)
//   phone: { at, rows: [{ at, html, c }] }          — телефон в свете, строки экрана появляются по времени
//   compare: { at, cards: [card…], tags: [{ at, text }] }  — карты в ряд, над ними загораются красные строки
//   podium: { at, cards: [{ card, place, at }] }    — пьедестал 2–1–3
YT.mode("premium", {
  ownTitle: true,
  css: `
  .yt-premium { background: #000; color: #fff; font-family: "Mont"; overflow: hidden; }
  .yt-premium .spot { position: absolute; inset: 0; background: radial-gradient(1100px 680px at 50% 40%, #24262e 0%, #0b0c10 55%, #000 100%); }
  .yt-premium .glow { position: absolute; border-radius: 50%; filter: blur(90px); pointer-events: none; }
  .yt-premium .floor { position: absolute; left: 0; right: 0; bottom: 0; height: 320px; background: linear-gradient(180deg, rgba(255,255,255,.035), transparent); }
  .yt-premium .cam { position: absolute; inset: 0; transform-origin: 50% 45%; }
  .yt-premium .silver { background: linear-gradient(180deg, #fff 0%, #d4d7de 55%, #8b9099 100%); -webkit-background-clip: text; background-clip: text; color: transparent; }
  .yt-premium .eyebrow { font: 700 26px "Mont"; letter-spacing: .2em; text-transform: uppercase; color: #8d929c; }
  .yt-premium .q { position: absolute; left: 140px; right: 140px; text-align: center; font: 800 88px/1.06 "Unb"; letter-spacing: -.035em; }
  .yt-premium .q .w { display: inline-block; background: linear-gradient(180deg, #fff 0%, #d4d7de 55%, #8b9099 100%); -webkit-background-clip: text; background-clip: text; color: transparent; }
  .yt-premium .q em { font-style: normal; color: #ff6b6b; -webkit-text-fill-color: #ff6b6b; }
  .yt-premium .q.red .w { -webkit-text-fill-color: #ff6b6b; }
  .yt-premium .qsub { position: absolute; left: 0; right: 0; text-align: center; font: 500 34px "Mont"; color: #a3a8b2; }
  .yt-premium .place { position: absolute; font: 800 30px "Unb"; letter-spacing: .04em; color: #0b0c10; background: linear-gradient(180deg, #fff, #c9ccd3); padding: 10px 26px; border-radius: 999px; }
  /* карта */
  .yt-premium .card { position: absolute; width: 640px; height: 404px; border-radius: 34px; overflow: hidden; color: #fff;
    box-shadow: 0 60px 120px rgba(0,0,0,.6), 0 12px 30px rgba(0,0,0,.4), inset 0 1px 0 rgba(255,255,255,.28); }
  .yt-premium .card .sheen { position: absolute; top: -40%; bottom: -40%; width: 70%; background: linear-gradient(105deg, transparent 20%, rgba(255,255,255,.32) 48%, rgba(255,255,255,.06) 58%, transparent 80%); }
  .yt-premium .card .grain { position: absolute; inset: 0; opacity: .22; mix-blend-mode: overlay; background-image: radial-gradient(rgba(255,255,255,.5) 1px, transparent 1px); background-size: 3px 3px; }
  .yt-premium .card .chip { position: absolute; left: 54px; top: 132px; width: 84px; height: 64px; border-radius: 12px; background: linear-gradient(135deg, #f3dfa2, #b8913e 55%, #e9cf86); }
  .yt-premium .card .chip::after { content: ""; position: absolute; inset: 12px 20px; border: 2px solid rgba(80,55,10,.35); border-radius: 6px; }
  .yt-premium .card .bank { position: absolute; left: 54px; top: 44px; font: 800 34px "Unb"; letter-spacing: -.01em; }
  .yt-premium .card .nm { position: absolute; left: 54px; top: 88px; font: 600 22px "Mont"; opacity: .8; letter-spacing: .02em; }
  .yt-premium .card .num { position: absolute; left: 54px; bottom: 52px; font: 26px "Mono"; letter-spacing: .14em; opacity: .85; }
  .yt-premium .card .big { position: absolute; right: 48px; bottom: 40px; font: 800 70px "Unb"; letter-spacing: -.03em; line-height: 1; text-align: right; }
  .yt-premium .card .big small { display: block; font: 600 22px "Mont"; letter-spacing: .04em; opacity: .85; margin-bottom: 6px; }
  .yt-premium .card .sys { position: absolute; right: 48px; top: 44px; width: 86px; height: 52px; }
  .yt-premium .card .sys i { position: absolute; top: 0; width: 52px; height: 52px; border-radius: 50%; }
  /* строки */
  .yt-premium .rows { position: absolute; width: 760px; }
  .yt-premium .rows .rt { font: 800 64px/1.05 "Unb"; letter-spacing: -.03em; margin-bottom: 30px; }
  .yt-premium .row { display: flex; justify-content: space-between; align-items: baseline; gap: 30px; border-top: 1px solid rgba(255,255,255,.13); padding: 22px 0; }
  .yt-premium .row:last-child { border-bottom: 1px solid rgba(255,255,255,.13); }
  .yt-premium .row b { font: 500 30px "Mont"; color: #a3a8b2; max-width: 430px; }
  .yt-premium .row span { font: 38px "Mono"; color: #fff; text-align: right; white-space: nowrap; }
  .yt-premium .row.red b, .yt-premium .row.red span { color: #ff6b6b; } .yt-premium .row.green span { color: #4ee39a; } .yt-premium .row.gold span { color: #ffd36b; }
  .yt-premium .src { position: absolute; font: 500 21px "Mont"; color: #6f747e; }
  /* линия */
  .yt-premium .ln { position: absolute; left: 160px; right: 160px; top: 520px; height: 20px; }
  .yt-premium .ln .p { position: absolute; top: 0; height: 20px; border-radius: 10px; transform-origin: 0 50%; }
  .yt-premium .ln .pl { position: absolute; top: 44px; font: 600 26px "Mont"; color: #a3a8b2; white-space: nowrap; }
  .yt-premium .ln .d { position: absolute; top: -18px; width: 56px; height: 56px; margin-left: -28px; border-radius: 50%; border: 6px solid #fff; background: #0b0c10; }
  .yt-premium .ln .dl { position: absolute; top: -110px; font: 700 30px "Mont"; white-space: nowrap; text-align: center; }
  .yt-premium .cap { position: absolute; left: 0; right: 0; top: 700px; text-align: center; font: 600 38px "Mont"; color: #d4d7de; }
  /* телефон */
  .yt-premium .ph { position: absolute; width: 470px; height: 940px; border-radius: 70px; background: #111216; padding: 16px; box-shadow: 0 80px 140px rgba(0,0,0,.7), inset 0 0 0 2px rgba(255,255,255,.12); }
  .yt-premium .ph .scr { width: 100%; height: 100%; border-radius: 56px; background: #f5f5f7; color: #111; overflow: hidden; position: relative; padding: 90px 36px 0; }
  .yt-premium .ph .r { margin-bottom: 22px; padding: 26px 28px; border-radius: 28px; background: #fff; box-shadow: 0 6px 20px rgba(0,0,0,.06); font: 600 26px "Mont"; }
  .yt-premium .ph .r.red { background: #fdecec; color: #c62828; } .yt-premium .ph .r.green { background: #e7f8ef; color: #0a7a4a; } .yt-premium .ph .r.mute { color: #8a8a94; }
  .yt-premium .ph .r big { display: block; font: 800 54px "Unb"; letter-spacing: -.03em; margin-top: 6px; }
  /* сравнение и пьедестал */
  .yt-premium .tag { position: absolute; left: 0; right: 0; text-align: center; font: 800 54px "Unb"; letter-spacing: -.03em; color: #ff6b6b; }
  .yt-premium .pod { position: absolute; width: 420px; border-radius: 24px 24px 0 0; background: linear-gradient(180deg, rgba(255,255,255,.14), rgba(255,255,255,.02)); border-top: 2px solid rgba(255,255,255,.45); }
  .yt-premium .pod b { position: absolute; left: 0; right: 0; top: 30px; text-align: center; font: 800 110px "Unb"; color: rgba(255,255,255,.22); }
  `,
  // звуки сцены для sfx.js (времена от начала отрезка): сдержанно — свист на смену кадра, тик на строку, щелчок на экран телефона
  events(d, dur) {
    const n = (v, def = 0) => (typeof v === "number" ? v : def), E = { whoosh: [0], tick: [], click: [], impact: [], swish: [] };
    if (d.place) E.impact.push(n(d.hero && d.hero.at) + .25);
    if (d.rows) d.rows.items.forEach((it, i) => E.tick.push(n(it.at, n(d.rows.at) + .3 + i * .35)));
    if (d.line) (d.line.dots || []).forEach(o => E.tick.push(n(o.at)));
    if (d.phone) d.phone.rows.forEach((r, i) => E.click.push(n(r.at, n(d.phone.at) + .5 + i * .4)));
    if (d.fan || d.compare) E.swish.push(n((d.fan || d.compare).at) + .1);
    if (d.compare) (d.compare.tags || []).forEach(tg => E.tick.push(n(tg.at)));
    if (d.podium) E.impact.push(n(d.podium.at) + .4);
    Object.keys(E).forEach(k => { E[k] = E[k].filter(x => x >= 0 && x < dur); });
    return E;
  },
  build(root, d, ctx) {
    const { U } = ctx, P = root._P = {};
    U.el("div", "spot", null, root);
    P.glow = U.el("div", "glow", null, root);
    U.el("div", "floor", null, root);
    P.cam = U.el("div", "cam", null, root);
    const card = (c, parent) => {
      const e = U.el("div", "card", `<div class="grain"></div><div class="sheen"></div><div class="bank">${c.bank || ""}</div><div class="nm">${c.name || ""}</div>
        <div class="chip"></div><div class="sys"><i style="left:0;background:${c.s1 || "#e0e2e8"};opacity:.9"></i><i style="left:34px;background:${c.s2 || "#9aa0ab"};opacity:.8"></i></div>
        <div class="num">•••• 2026</div>${c.big ? `<div class="big">${c.small ? `<small>${c.small}</small>` : ""}${c.big}</div>` : ""}`, parent);
      e.style.background = `linear-gradient(135deg, ${c.c1} 0%, ${c.c2} 58%, ${c.c3 || c.c1} 100%)`; if (c.ink) e.style.color = c.ink;
      return e; };
    P.card = card;
    if (d.place) P.place = U.el("div", "place", d.place, P.cam);
    if (d.hero) { P.hero = card(d.hero.card, P.cam); P.glow.style.background = d.hero.card.glow || "rgba(200,205,220,.16)"; }
    if (d.fan) P.fan = d.fan.cards.map(c => card(c, P.cam));
    if (d.quote) { const q = d.quote; P.q = U.el("div", "q" + (q.red ? " red" : ""), q.text, P.cam); P.qw = U.words(P.q);
      if (q.sub) P.qsub = U.el("div", "qsub", q.sub, P.cam); }
    if (d.rows) { const r = d.rows; P.rows = U.el("div", "rows", r.title ? `<div class="rt silver">${r.title}</div>` : "", P.cam);
      P.rowEls = r.items.map(it => U.el("div", "row" + (it.c ? " " + it.c : ""), `<b>${it.k}</b><span>${it.v || ""}</span>`, P.rows));
      if (r.src) P.src = U.el("div", "src", r.src, P.cam); }
    if (d.line) { const l = d.line; P.ln = U.el("div", "ln", null, P.cam);
      P.lp = l.parts.map(p => { const e = U.el("div", "p", null, P.ln); Object.assign(e.style, { left: p.x * 100 + "%", width: p.w * 100 + "%", background: p.c || "#5b5f69" });
        const lb = U.el("div", "pl", p.label, P.ln); lb.style.left = p.x * 100 + "%"; return { e, lb }; });
      P.ld = (l.dots || []).map(o => { const e = U.el("div", "d", null, P.ln); e.style.left = o.x * 100 + "%"; e.style.borderColor = o.c || "#fff";
        const lb = U.el("div", "dl", o.label, P.ln); lb.style.left = o.x * 100 + "%"; lb.style.color = o.c || "#fff";
        lb.style.transform = `translateX(${o.x < .15 ? -8 : o.x > .85 ? -92 : -50}%)`; return { e, lb }; });
      if (l.cap) P.cap = U.el("div", "cap", l.cap, P.cam); }
    if (d.phone) { P.ph = U.el("div", "ph", `<div class="scr"></div>`, P.cam); const s = P.ph.firstChild;
      P.pr = d.phone.rows.map(r => U.el("div", "r" + (r.c ? " " + r.c : ""), r.html, s)); }
    if (d.compare) { P.cmp = d.compare.cards.map(c => card(c, P.cam)); P.tags = (d.compare.tags || []).map(tg => U.el("div", "tag", tg.text, P.cam)); }
    if (d.podium) { P.pods = [[290, 230], [750, 330], [1210, 170]].map(([x, h], i) => { const e = U.el("div", "pod", `<b>${[2, 1, 3][i]}</b>`, P.cam); Object.assign(e.style, { left: x + "px", height: h + "px", bottom: "150px" }); return e; });
      P.pc = d.podium.cards.map(pc => card(pc.card, P.cam)); }
  },
  render(root, t, d, ctx) {
    const { U, dur } = ctx, P = root._P, k = (a, len = .5) => U.clamp((t - (a || 0)) / len);
    const rise = (e, kk, dy = 50) => { e.style.opacity = U.out3(kk * 1.3); e.style.transform = `translateY(${(1 - U.out5(kk)) * dy}px)`; };
    const sheen = (e, phase = 0) => { const s = e.querySelector(".sheen"), p = ((t * .22 + phase) % 1.4); s.style.left = (-80 + p * 160) + "%"; };
    // камера: медленный наезд и дрейф — кадр живёт даже когда ничего не появляется
    // пульс на начале каждой фразы (data.pulses — build-скрипт ставит их сам): лёгкий толчок камеры и вспышка света
    let pz = 0; (d.pulses || []).forEach(p => { pz += U.bell((t - p) / .55); });
    P.cam.style.transform = `scale(${1 + .035 * U.clamp(t / Math.max(dur, 1)) + .018 * pz}) translate(${Math.sin(t * .23) * 6}px, ${Math.cos(t * .19) * 4}px)`;
    P.glow.style.filter = `blur(90px) brightness(${1 + .6 * pz})`;
    const hasSide = !!(d.rows || d.phone);
    if (P.hero) { const h = d.hero, kh = k(h.at, .9), side = h.side || (hasSide ? "left" : "center");
      const x = side === "left" ? 150 : 640, y = side === "left" ? 330 : 300, ry = (h.tilt ?? (side === "left" ? 20 : 0)) - 6 * U.clamp(t / 8);
      P.hero.style.left = x + "px"; P.hero.style.top = y + "px"; P.hero.style.opacity = U.out3(kh * 1.4);
      P.hero.style.transform = `perspective(1600px) translateY(${(1 - U.out5(kh)) * 120}px) rotateY(${ry}deg) rotateX(${6 + Math.sin(t * .6) * 1.5}deg) scale(${.94 + .06 * U.out5(kh)})`;
      sheen(P.hero); Object.assign(P.glow.style, { left: x - 60 + "px", top: y - 80 + "px", width: "760px", height: "560px", opacity: U.out3(kh) }); }
    else P.glow.style.opacity = 0;
    if (P.place) { const kp = k((d.hero && d.hero.at || 0) + .25, .4); Object.assign(P.place.style, { left: "150px", top: "220px" }); rise(P.place, kp, 20); }
    if (P.fan) { const n = P.fan.length; P.fan.forEach((e, i) => { const kk = k((d.fan.at || 0) + i * .12, .7), a = (i - (n - 1) / 2);
      Object.assign(e.style, { left: 640 + a * 110 + "px", top: 360 + Math.abs(a) * 26 + "px", zIndex: 10 - Math.abs(Math.round(a)) });
      e.style.opacity = U.out3(kk * 1.3); e.style.transform = `perspective(1600px) translateY(${(1 - U.out5(kk)) * 160}px) rotateZ(${a * 7 * U.out5(kk)}deg) rotateY(${-a * 6}deg) scale(.72)`; sheen(e, i * .2); }); }
    if (P.q) { const q = d.quote, pos = q.pos || (P.hero || P.fan || P.ph || P.ln || P.cmp || P.pods ? "top" : "center");
      P.q.style.top = pos === "top" ? "90px" : pos === "bottom" ? "800px" : "380px"; if (pos !== "center") P.q.style.fontSize = "70px";
      const n = P.qw.length, kq = k(q.at, Math.max(.45, n * .12)); P.qw.forEach((w, i) => { const kw = U.clamp(kq * n - i); w.style.opacity = U.out3(kw); w.style.transform = `translateY(${(1 - U.out5(kw)) * 30}px)`; });
      if (P.qsub) { P.qsub.style.top = (P.q.offsetTop + P.q.offsetHeight + (pos === "center" ? 50 : 26)) + "px"; rise(P.qsub, k((q.at || 0) + .4, .5), 16); } }
    if (P.rows) { const r = d.rows; Object.assign(P.rows.style, { left: (P.hero || P.ph ? 1020 : 580) + "px", top: (P.q ? 300 : r.title ? 190 : 330) + "px" });
      const rt = P.rows.querySelector(".rt"); if (rt) rise(rt, k(r.at, .5), 30);
      P.rowEls.forEach((e, i) => rise(e, k(r.items[i].at ?? (r.at || 0) + .3 + i * .35, .45), 26));
      if (P.src) { Object.assign(P.src.style, { left: (P.hero || P.ph ? 1020 : 580) + "px", top: "1000px" }); P.src.style.opacity = U.out3(k((r.at || 0) + .8, .5)); } }
    if (P.ln) { const l = d.line; P.ln.style.opacity = U.out3(k(l.at, .4));
      P.lp.forEach((p, i) => { const kk = k((l.at || 0) + .2 + i * .35, .5); p.e.style.transform = `scaleX(${U.out5(kk)})`; p.lb.style.opacity = U.out3(kk); });
      P.ld.forEach((o, i) => { const kk = k(l.dots[i].at, .4); o.e.style.opacity = o.lb.style.opacity = U.out3(kk * 1.4); o.e.style.transform = `scale(${U.back(kk)})`; });
      if (P.cap) rise(P.cap, k(l.capAt ?? (l.at || 0) + 1, .5), 20); }
    if (P.ph) { const kp = k(d.phone.at, .8), x = P.rows ? 330 : 725;
      Object.assign(P.ph.style, { left: x + "px", top: "110px" }); P.ph.style.opacity = U.out3(kp * 1.3);
      P.ph.style.transform = `perspective(1800px) translateY(${(1 - U.out5(kp)) * 160}px) rotateY(${P.rows ? 10 : -6}deg) rotateZ(${P.rows ? -2 : 2}deg) scale(.9)`;
      P.pr.forEach((e, i) => rise(e, k(d.phone.rows[i].at ?? (d.phone.at || 0) + .5 + i * .4, .45), 24)); }
    if (P.cmp) { const n = P.cmp.length, sc = n > 4 ? .36 : .5, w = 640 * sc + 30, x0 = 960 - (n * w - 30) / 2;
      P.cmp.forEach((e, i) => { const kk = k((d.compare.at || 0) + i * .08, .6); Object.assign(e.style, { left: x0 + i * w + "px", top: "380px", transformOrigin: "0 0" });
        e.style.opacity = U.out3(kk * 1.3); e.style.transform = `translateY(${(1 - U.out5(kk)) * 80}px) scale(${sc})`; sheen(e, i * .17); });
      P.tags.forEach((e, i) => { const kk = k(d.compare.tags[i].at, .4), on = U.clamp(((d.compare.tags[i + 1] || {}).at ?? 1e9) - t);
        e.style.top = "720px"; e.style.opacity = U.out3(kk * 1.4) * (P.tags[i + 1] ? U.clamp(on / .2) : 1); e.style.transform = `translateY(${(1 - U.out5(kk)) * 24}px)`; }); }
    if (P.pods) { const kp = k(d.podium.at, .6); P.pods.forEach((e, i) => { e.style.opacity = U.out3(kp); e.style.transform = `translateY(${(1 - U.out5(kp)) * 60}px)`; });
      const slot = { 2: [250, 430], 1: [710, 300], 3: [1170, 490] };
      P.pc.forEach((e, i) => { const pc = d.podium.cards[i], [x, y] = slot[pc.place], kk = k(pc.at ?? (d.podium.at || 0) + .3 + i * .2, .7);
        Object.assign(e.style, { left: x + "px", top: y + "px", transformOrigin: "0 0" }); e.style.opacity = U.out3(kk * 1.3);
        e.style.transform = `translateY(${(1 - U.out5(kk)) * -120}px) scale(${pc.place === 1 ? .78 : .7})`; sheen(e, i * .3); }); }
  },
});
