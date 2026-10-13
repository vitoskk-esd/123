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
  /* живые фоны (bg: aurora | grid | rays | rings | spot) и частицы */
  .yt-premium .bg { position: absolute; inset: 0; overflow: hidden; }
  .yt-premium .blob { position: absolute; width: 1300px; height: 1300px; margin: -650px 0 0 -650px; border-radius: 50%; }
  .yt-premium .gridw { position: absolute; left: -50%; right: -50%; top: 52%; height: 140%; transform-origin: 50% 0;
    background-image: linear-gradient(rgba(255,255,255,.09) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,.09) 2px, transparent 2px); background-size: 120px 120px; }
  .yt-premium .horizon { position: absolute; left: 0; right: 0; top: 46%; height: 260px; margin-top: -130px; }
  .yt-premium .rays { position: absolute; left: 50%; top: 40%; width: 3200px; height: 3200px; margin: -1600px 0 0 -1600px; border-radius: 50%;
    -webkit-mask-image: radial-gradient(circle, #000 0%, transparent 62%); mask-image: radial-gradient(circle, #000 0%, transparent 62%); }
  .yt-premium .ringsv { position: absolute; left: 50%; top: 50%; width: 1800px; height: 1800px; margin: -900px 0 0 -900px; }
  .yt-premium .dust i { position: absolute; border-radius: 50%; background: #fff; }
  .yt-premium .deco { position: absolute; pointer-events: none; }
  .yt-premium .coin { width: 120px; height: 120px; border-radius: 50%; background: radial-gradient(circle at 35% 30%, #fff6c8, #f2c14e 45%, #a8720f 100%);
    box-shadow: inset 0 0 0 8px rgba(255,255,255,.18), 0 20px 40px rgba(0,0,0,.5); display: flex; align-items: center; justify-content: center; font: 900 60px "Unb"; color: #7a4f05; }
  .yt-premium .pct { font: 900 150px "Unb"; color: transparent; -webkit-text-stroke: 3px rgba(255,107,107,.75); }
  .yt-premium .orb { width: 220px; height: 220px; border-radius: 50%; background: radial-gradient(circle, var(--acc, #7d8bff) 0%, rgba(125,139,255,.0) 70%); opacity: .35; }
  .yt-premium .streak { position: absolute; left: -40%; top: -20%; width: 40%; height: 140%; transform: rotate(18deg); pointer-events: none;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,.10), rgba(255,255,255,.22), rgba(255,255,255,.10), transparent); mix-blend-mode: screen; }
  /* 3D-карта: лицо и оборот */
  .yt-premium .c3 { position: absolute; width: 640px; height: 404px; transform-style: preserve-3d; }
  .yt-premium .c3 > .card { left: 0; top: 0; backface-visibility: hidden; -webkit-backface-visibility: hidden; }
  .yt-premium .c3 > .back { transform: rotateY(180deg); }
  .yt-premium .back .stripe { position: absolute; left: 0; right: 0; top: 54px; height: 76px; background: #0a0a0c; }
  .yt-premium .back .bv { position: absolute; left: 54px; bottom: 54px; font: 800 120px/1 "Unb"; letter-spacing: -.04em; }
  .yt-premium .back .bl { position: absolute; left: 58px; top: 170px; font: 700 30px "Mont"; opacity: .85; letter-spacing: .04em; text-transform: uppercase; }
  /* крупный акцент значения (сцены строк без карты и телефона) */
  .yt-premium .callout { position: absolute; left: 1010px; top: 300px; width: 820px; height: 480px; border-radius: 40px; overflow: hidden;
    background: linear-gradient(160deg, rgba(255,255,255,.08), rgba(255,255,255,.02)); border: 1px solid rgba(255,255,255,.14); box-shadow: 0 60px 120px rgba(0,0,0,.5); }
  .yt-premium .callout .cg { position: absolute; inset: -30%; background: radial-gradient(circle at 70% 30%, var(--acc, #7d8bff) 0%, transparent 55%); opacity: .45; }
  .yt-premium .callout .ck { position: absolute; left: 56px; top: 56px; right: 56px; font: 700 34px "Mont"; color: #c9ccd3; }
  .yt-premium .callout .cv { position: absolute; left: 50px; right: 40px; bottom: 60px; font: 800 120px/1 "Unb"; letter-spacing: -.045em; color: #fff; white-space: nowrap; }
  .yt-premium .callout .cv.red { color: #ff6b6b; } .yt-premium .callout .cv.green { color: #4ee39a; } .yt-premium .callout .cv.gold { color: #ffd36b; }
  .yt-premium .callout .cn { position: absolute; right: 50px; top: 46px; font: 800 30px "Mono"; color: rgba(255,255,255,.5); }
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
    // живой фон — вид из d.bg (build-скрипт чередует), цвет — акцент сцены
    const acc = d.accent || (d.hero && d.hero.card.c1) || "#7d8bff", acc2 = d.accent2 || (d.hero && (d.hero.card.c3 || d.hero.card.c2)) || "#c86bff";
    P.acc = acc; root.style.setProperty("--acc", acc); P.bgk = d.bg || "spot"; P.bg = U.el("div", "bg", null, root);
    if (P.bgk === "aurora") P.blobs = [acc, acc2, "#2a3cff"].map((c, i) => { const e = U.el("div", "blob", null, P.bg); e.style.background = `radial-gradient(circle, ${c}55 0%, ${c}22 35%, transparent 68%)`; return e; });
    if (P.bgk === "grid") { P.grid = U.el("div", "gridw", null, P.bg); P.hz = U.el("div", "horizon", null, P.bg); P.hz.style.background = `radial-gradient(ellipse at 50% 50%, ${acc}66, transparent 70%)`; }
    if (P.bgk === "rays") { P.rays = U.el("div", "rays", null, P.bg); P.rays.style.background = `repeating-conic-gradient(from 0deg, ${acc}26 0deg 5deg, transparent 5deg 18deg)`; }
    if (P.bgk === "rings") { P.rings = U.el("div", "ringsv", `<svg viewBox="0 0 1800 1800" width="1800" height="1800">${[260, 420, 580, 740, 880].map((r, i) =>
      `<circle cx="900" cy="900" r="${r}" fill="none" stroke="${i % 2 ? acc : "#ffffff"}" stroke-opacity="${.10 + .05 * (i % 2)}" stroke-width="${i % 2 ? 3 : 2}" stroke-dasharray="${[6, 18, 2, 40, 10][i]} ${[14, 22, 18, 30, 26][i]}"/>`).join("")}</svg>`, P.bg); P.ringEls = [...P.rings.querySelectorAll("circle")]; }
    const rnd = U.rnd(Math.round((d.seed || 1) * 977) + 3);
    P.dust = U.el("div", "dust", null, root); P.motes = Array.from({ length: 34 }, () => { const e = U.el("i", null, null, P.dust), z = .3 + rnd() * .9, r = 2 + rnd() * 4;
      Object.assign(e.style, { width: r + "px", height: r + "px", opacity: (.08 + rnd() * .3).toFixed(2) }); return { e, x: rnd() * 1920, y: rnd() * 1080, z, sp: 8 + rnd() * 26 }; });
    // летающие объекты по краям кадра (decor: coins | pct | orbs)
    if (d.decor) { const kinds = { coins: () => `<div class="coin">₽</div>`, pct: () => `<div class="pct">%</div>`, orbs: () => `<div class="orb"></div>` };
      const spots = [[30, 20], [1760, 70], [40, 900], [1770, 860], [980, 10], [1480, 960]];
      P.deco = spots.slice(0, d.decor === "orbs" ? 6 : 5).map(([x, y], i) => { const e = U.el("div", "deco", kinds[d.decor](), root); Object.assign(e.style, { left: x + "px", top: y + "px" });
        return { e, x, y, ph: rnd() * 6, z: .5 + rnd() * .8, sc: .6 + rnd() * .7 }; }); }
    P.streak = U.el("div", "streak", null, root);
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
    if (d.hero) { const hc = d.hero.card; P.hero = U.el("div", "c3", null, P.cam); const f = card(hc, P.hero);
      const bk = U.el("div", "card back", `<div class="grain"></div><div class="stripe"></div><div class="bl">${hc.small || "дней без %"}</div><div class="bv">${hc.big || ""}</div>`, P.hero);
      bk.style.background = `linear-gradient(135deg, ${hc.c2} 0%, ${hc.c1} 70%, ${hc.c3 || hc.c1} 100%)`; P.heroFace = f;
      P.glow.style.background = hc.glow || "rgba(200,205,220,.16)"; }
    if (d.fan) P.fan = d.fan.cards.map(c => card(c, P.cam));
    if (d.quote) { const q = d.quote; P.q = U.el("div", "q" + (q.red ? " red" : ""), q.text, P.cam); P.qw = U.words(P.q);
      if (q.sub) P.qsub = U.el("div", "qsub", q.sub, P.cam); }
    if (d.rows) { const r = d.rows; P.rows = U.el("div", "rows", r.title ? `<div class="rt silver">${r.title}</div>` : "", P.cam);
      P.rowEls = r.items.map(it => U.el("div", "row" + (it.c ? " " + it.c : ""), `<b>${it.k}</b><span>${it.v || ""}</span>`, P.rows));
      if (r.src) P.src = U.el("div", "src", r.src, P.cam);
      if (!d.hero && !d.phone) { P.co = U.el("div", "callout", `<div class="cg"></div><div class="cn"></div><div class="ck"></div><div class="cv"></div>`, P.cam);
        [P.coN, P.coK, P.coV] = [P.co.querySelector(".cn"), P.co.querySelector(".ck"), P.co.querySelector(".cv")]; } }
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
    P.glow.style.filter = `blur(90px) brightness(${1 + .6 * pz})`;
    // фон живёт всегда
    if (P.blobs) P.blobs.forEach((e, i) => { e.style.left = (960 + Math.sin(t * (.21 + i * .07) + i * 2) * 520) + "px"; e.style.top = (540 + Math.cos(t * (.17 + i * .05) + i) * 300) + "px"; });
    if (P.grid) { P.grid.style.transform = `perspective(700px) rotateX(74deg)`; P.grid.style.backgroundPosition = `${Math.sin(t * .2) * 60}px ${(t * 90) % 120}px`; P.hz.style.opacity = .7 + .3 * Math.sin(t * .8); }
    if (P.rays) P.rays.style.transform = `rotate(${t * 4}deg)`;
    if (P.ringEls) P.ringEls.forEach((c, i) => { c.setAttribute("transform", `rotate(${(i % 2 ? -1 : 1) * t * (6 + i * 3)} 900 900)`); });
    // камера-оператор: смена плана каждые 2–3 с (shots), плавные переходы, лёгкий дрейф между ними
    const F = { center: [960, 540], co: [1420, 540], rowsL: [520, 520], hero: [470, 532], heroC: [960, 500], rows: [1400, 560], quote: [960, 430], phone: [960, 580], phoneL: [565, 580], fan: [960, 560], line: [960, 540] };
    const shots = P.shots || (P.shots = (() => { const ts = [0], add = (x) => { if (typeof x === "number" && x > .3 && x < dur - .6) ts.push(x); };
      (d.pulses || []).forEach(add); if (d.rows) d.rows.items.forEach(it => add(it.at)); if (d.phone) d.phone.rows.forEach(r => add(r.at)); if (d.line) (d.line.dots || []).forEach(o => add(o.at));
      if (d.compare) (d.compare.tags || []).forEach(g => add(g.at)); ts.sort((a, b) => a - b);
      const out = []; ts.forEach(x => { if (!out.length || x - out[out.length - 1] >= 1.7) out.push(x); });
      for (let i = 0; i + 1 < out.length; i++) if (out[i + 1] - out[i] > 3.4) out.splice(i + 1, 0, out[i] + (out[i + 1] - out[i]) / 2);
      if (dur - out[out.length - 1] > 3.4) out.push(out[out.length - 1] + (dur - out[out.length - 1]) / 2);
      const fs = []; if (d.hero) fs.push(hasHeroSide() ? "hero" : "heroC"); if (d.rows) { if (!d.hero && !d.phone) fs.push("rowsL", "co"); else fs.push("rows"); } if (d.phone) fs.push(d.rows ? "phoneL" : "phone");
      if (d.quote && !d.hero) fs.push("quote"); if (d.fan) fs.push("fan"); if (d.line) fs.push("line"); if (!fs.length) fs.push("center");
      const seed = Math.round((d.seed || 1) * 31);
      return out.map((x, i) => { const kind = ["wide", "push", "detail", "pan", "push", "tilt"][(i + seed) % 6], f = i === 0 ? "center" : fs[(i + seed) % fs.length];
        const sc = { wide: 1.0, push: 1.09, detail: 1.2, pan: 1.06, tilt: 1.08 }[kind];
        return { t: x, f: F[f], s: sc, dx: kind === "pan" ? ((i % 2) ? 70 : -70) : 0, r: kind === "tilt" ? ((i % 2) ? .9 : -.9) : 0 }; }); })());
    function hasHeroSide() { return !!(d.rows || d.phone) && !(d.hero && d.hero.side === "center"); }
    let si = 0; while (si + 1 < shots.length && shots[si + 1].t <= t) si++;
    const A = shots[Math.max(0, si - 1)], B = shots[si], e = si === 0 ? 1 : U.io3((t - B.t) / .9);
    const cx = U.lerp(A.f[0], B.f[0], e), cy = U.lerp(A.f[1], B.f[1], e), cs = U.lerp(A.s, B.s, e) + .02 * U.clamp((t - B.t) / 3) + .012 * pz,
      cdx = U.lerp(A.dx, B.dx, e) + Math.sin(t * .23) * 8, cr = U.lerp(A.r, B.r, e);
    P.cam.style.transformOrigin = `${cx}px ${cy}px`;
    P.cam.style.transform = `translate(${((960 - cx) * (cs - 1) * .9 + cdx).toFixed(1)}px, ${((540 - cy) * (cs - 1) * .9 + Math.cos(t * .19) * 5).toFixed(1)}px) scale(${cs.toFixed(4)}) rotate(${cr.toFixed(3)}deg)`;
    // частицы и объекты — параллакс от камеры
    P.motes.forEach(m => { const y = ((m.y - t * m.sp) % 1080 + 1080) % 1080; m.e.style.transform = `translate(${(m.x + (960 - cx) * (cs - 1) * m.z * .6).toFixed(1)}px, ${y.toFixed(1)}px)`; });
    if (P.deco) P.deco.forEach((o, i) => { const kk = U.out5(k(.2 + i * .15, .9));
      o.e.style.opacity = (.85 * kk).toFixed(3); o.e.style.transform = `translate(${(Math.sin(t * .5 + o.ph) * 22 + (960 - cx) * (cs - 1) * o.z).toFixed(1)}px, ${(Math.cos(t * .4 + o.ph) * 26 + (1 - kk) * 120).toFixed(1)}px) rotate(${(Math.sin(t * .3 + o.ph) * 18).toFixed(1)}deg) scale(${o.sc})`; });
    // световой проблеск на начале фразы
    { let ks = -1; (d.pulses || []).forEach(p => { const x = (t - p) / .9; if (x >= 0 && x <= 1) ks = x; }); P.streak.style.opacity = ks < 0 ? 0 : U.bell(ks) * .9; P.streak.style.left = (-40 + 180 * U.clamp(ks)) + "%"; }
    const hasSide = !!(d.rows || d.phone);
    if (P.hero) { const h = d.hero, kh = k(h.at, .9), side = h.side || (hasSide ? "left" : "center");
      const x = side === "left" ? 150 : 640, y = side === "left" ? 330 : 300, ry = (h.tilt ?? (side === "left" ? 20 : 0)) - 6 * U.clamp(t / 8);
      P.hero.style.left = x + "px"; P.hero.style.top = y + "px"; P.hero.style.opacity = U.out3(kh * 1.4);
      // переворот: на первой строке показываем оборот с крупной цифрой, через пару строк — обратно
      const its = d.rows ? d.rows.items.map(i => i.at).filter(x => typeof x === "number") : [];
      const f0 = h.flip ?? (its.length ? its[0] + .15 : (dur > 6 ? 2.2 : 1e9)), f1 = h.unflip ?? (its.length > 2 ? its[2] : f0 + 2.6);
      const flip = 180 * (U.io3((t - f0) / .9) - U.io3((t - f1) / .9));
      P.hero.style.transform = `perspective(1800px) translateY(${(1 - U.out5(kh)) * 120}px) rotateY(${ry + flip}deg) rotateX(${6 + Math.sin(t * .6) * 1.5}deg) scale(${.94 + .06 * U.out5(kh)})`;
      sheen(P.heroFace); Object.assign(P.glow.style, { left: x - 60 + "px", top: y - 80 + "px", width: "760px", height: "560px", opacity: U.out3(kh) }); }
    else P.glow.style.opacity = 0;
    if (P.place) { const kp = k((d.hero && d.hero.at || 0) + .25, .4); Object.assign(P.place.style, { left: "150px", top: "220px" }); rise(P.place, kp, 20); }
    if (P.fan) { const n = P.fan.length; P.fan.forEach((e, i) => { const kk = k((d.fan.at || 0) + i * .12, .7), a = (i - (n - 1) / 2);
      Object.assign(e.style, { left: 640 + a * 110 + "px", top: 360 + Math.abs(a) * 26 + "px", zIndex: 10 - Math.abs(Math.round(a)) });
      e.style.opacity = U.out3(kk * 1.3); e.style.transform = `perspective(1600px) translateY(${(1 - U.out5(kk)) * 160}px) rotateZ(${a * 7 * U.out5(kk)}deg) rotateY(${-a * 6}deg) scale(.72)`; sheen(e, i * .2); }); }
    if (P.q) { const q = d.quote, pos = q.pos || (P.hero || P.fan || P.ph || P.ln || P.cmp || P.pods ? "top" : "center");
      P.q.style.top = pos === "top" ? "90px" : pos === "bottom" ? "800px" : "380px"; if (pos !== "center") P.q.style.fontSize = "70px";
      const n = P.qw.length, kq = k(q.at, Math.max(.45, n * .12)); P.qw.forEach((w, i) => { const kw = U.clamp(kq * n - i); w.style.opacity = U.out3(kw); w.style.transform = `translateY(${(1 - U.out5(kw)) * 40}px) scale(${(1.25 - .25 * U.out5(kw)).toFixed(3)})`; w.style.filter = kw < 1 ? `blur(${((1 - U.out3(kw)) * 14).toFixed(1)}px)` : ""; });
      if (P.qsub) { P.qsub.style.top = (P.q.offsetTop + P.q.offsetHeight + (pos === "center" ? 50 : 26)) + "px"; rise(P.qsub, k((q.at || 0) + .4, .5), 16); } }
    if (P.rows) { const r = d.rows; Object.assign(P.rows.style, { left: (P.hero || P.ph ? 1020 : P.co ? 130 : 580) + "px", top: (P.q ? 300 : r.title ? 190 : 330) + "px" });
      if (P.co) { // акцент: последняя появившаяся строка — крупно, с перелётом при смене
        let ci = -1; r.items.forEach((it, i) => { const a0 = it.at ?? (r.at || 0) + .3 + i * .35; if (t >= a0) ci = i; });
        const kc = k((r.items[0].at ?? (r.at || 0) + .3) - .1, .7); P.co.style.opacity = U.out3(kc * 1.3);
        P.co.style.transform = `perspective(1600px) translateY(${(1 - U.out5(kc)) * 80}px) rotateY(${-10 + 4 * Math.sin(t * .4)}deg)`;
        if (ci >= 0) { const it = r.items[ci], a0 = it.at ?? (r.at || 0) + .3 + ci * .35, ks = k(a0, .55), v = it.v || "", m = v.match(/^(\D*?)(\d[\d ]*)(?![\d,])(.*)$/);
          P.coN.textContent = String(ci + 1).padStart(2, "0") + " / " + String(r.items.length).padStart(2, "0"); P.coK.textContent = it.k;
          P.coV.className = "cv" + (it.c ? " " + it.c : ""); P.coV.textContent = m && !/[,.]\d/.test(v) ? m[1] + U.fmt(+m[2].replace(/ /g, "") * U.out3(k(a0, .8))).replace(/\s/g, " ") + m[3] : v;
          const fit = Math.min(1, 720 / Math.max(1, P.coV.scrollWidth)); P.coV.style.transformOrigin = "0 100%";
          P.coV.style.transform = `translateY(${(1 - U.out5(ks)) * 60}px) scale(${fit})`; P.coV.style.opacity = U.out3(ks * 1.4); P.coV.style.filter = ks < 1 ? `blur(${((1 - U.out3(ks)) * 10).toFixed(1)}px)` : "";
          P.coK.style.opacity = U.out3(ks * 1.6); } }
      const rt = P.rows.querySelector(".rt"); if (rt) rise(rt, k(r.at, .5), 30);
      P.rowEls.forEach((e, i) => { const a0 = r.items[i].at ?? (r.at || 0) + .3 + i * .35; rise(e, k(a0, .45), 26);
        // счётчик: первое целое число в значении «бежит» от нуля
        const sp = e.lastChild, v = r.items[i].v || "", m = v.match(/^(\D*?)(\d[\d ]*)(?![\d,])(.*)$/);
        if (m && !/[,.]\d/.test(v)) { const n = +m[2].replace(/ /g, ""), kk = U.out3(k(a0 + .05, .8)); sp.textContent = m[1] + U.fmt(n * kk).replace(/\s/g, " ") + m[3]; }
        e.style.transform += ` scale(${1 + .04 * U.bell(k(a0, .6))})`; });
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
