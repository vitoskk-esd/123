// Режим «Телефон крупно» (образец modes.html?mode=phone): телефон на весь кадр, малая глубина резкости (верх и низ кадра
// размыты), палец и круг нажатия, пуши. Без 3D: только поворот в плоскости и медленный наезд.
// data: { side: {small, big, sub}, screen: "promo"|"order"|"stats"|"html", ...поля экрана, pushes: [{t, from, html}], tap: {t, at} }
//   promo: {title, offers: [{h, v, s}], hl: {i, t}}   order: {item, price, card, note, pay, paid}   stats: {title, total, cats: [{l, v, c}], hl: {i, t}}
//   html: {html} — свой экран; tap.at — CSS-селектор цели нажатия внутри экрана; tap.finger — показать палец (по умолчанию только круг).
YT.mode("phone", {
  css: `
  .yt-phone { background: radial-gradient(900px 700px at 60% 50%, rgba(60,140,255,.22), transparent 70%), #04060b; }
  .yt-phone .bk { position: absolute; border-radius: 50%; filter: blur(30px); }
  .yt-phone .ph { position: absolute; left: 640px; top: -120px; width: 760px; height: 1500px; border-radius: 110px; background: #0b0c10; padding: 24px; border: 4px solid #2a2f3a;
    box-shadow: 0 0 120px rgba(60,140,255,.25), 0 80px 160px rgba(0,0,0,.85); transform-origin: 50% 40%; }
  .yt-phone .scr { width: 100%; height: 100%; border-radius: 88px; background: #f5f6f8; overflow: hidden; position: relative; padding: 230px 46px 0; font-family: "Mont"; }
  .yt-phone .scr h3 { font: 800 38px "Mont"; color: #7b828c; }
  .yt-phone .off { margin-top: 26px; padding: 30px 34px; border-radius: 34px; background: #fff; box-shadow: 0 10px 30px rgba(0,0,0,.08); position: relative; }
  .yt-phone .off small { font: 700 26px "Mont"; color: #7b828c; } .yt-phone .off b { display: block; font: 900 64px "Unb"; color: #13161b; letter-spacing: -.03em; margin: 6px 0; white-space: nowrap; }
  .yt-phone .off span { font: 600 28px/1.3 "Mont"; color: #4a515b; }
  .yt-phone .off .ring2 { position: absolute; inset: -6px; border-radius: 40px; border: 6px solid #1a9d57; opacity: 0; }
  .yt-phone .item { margin-top: 26px; display: flex; gap: 26px; align-items: center; }
  .yt-phone .img { width: 170px; height: 170px; border-radius: 32px; background: linear-gradient(135deg, #2a2f3a, #4c5566); flex: none; }
  .yt-phone .nm { font: 700 40px/1.2 "Mont"; color: #13161b; } .yt-phone .pr { white-space: nowrap; font: 900 60px "Unb"; color: #13161b; letter-spacing: -.03em; margin-top: 8px; }
  .yt-phone .card { margin-top: 50px; padding: 30px 34px; border-radius: 34px; background: #fff; box-shadow: 0 10px 30px rgba(0,0,0,.08); font: 600 32px "Mont"; color: #4a515b; }
  .yt-phone .card b { color: #13161b; } .yt-phone .card .g { color: #1a9d57; font-weight: 800; }
  .yt-phone .pay { position: absolute; left: 46px; right: 46px; bottom: 520px; height: 150px; border-radius: 40px; background: #13161b; color: #fff; font: 800 46px "Mont"; display: flex; align-items: center; justify-content: center; }
  .yt-phone .donut { margin: 40px auto 0; width: 420px; height: 420px; position: relative; }
  .yt-phone .donut .c { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; font: 700 28px "Mont"; color: #7b828c; }
  .yt-phone .donut .c b { font: 900 56px "Unb"; color: #13161b; letter-spacing: -.03em; }
  .yt-phone .lg { margin-top: 30px; } .yt-phone .lg div { display: flex; justify-content: space-between; align-items: center; padding: 14px 6px; font: 700 32px "Mont"; color: #13161b; border-radius: 18px; }
  .yt-phone .lg i { width: 26px; height: 26px; border-radius: 8px; margin-right: 18px; display: inline-block; vertical-align: -3px; }
  .yt-phone .push { position: absolute; left: 30px; right: 30px; top: 70px; padding: 26px 30px; border-radius: 36px; background: rgba(255,255,255,.95); z-index: 4;
    box-shadow: 0 24px 50px rgba(0,0,0,.28); font: 600 30px/1.35 "Mont"; color: #20242a; opacity: 0; }
  .yt-phone .push .h { display: flex; align-items: center; gap: 12px; font: 700 24px "Mont"; color: #7b828c; margin-bottom: 8px; }
  .yt-phone .push .h i { width: 40px; height: 40px; border-radius: 11px; background: linear-gradient(135deg, #3ddc84, #1a9d57); }
  .yt-phone .ring { position: absolute; width: 180px; height: 180px; margin: -90px 0 0 -90px; border-radius: 50%; border: 8px solid rgba(255,255,255,.85); z-index: 6; opacity: 0; }
  .yt-phone .finger { position: absolute; width: 260px; height: 360px; margin: -20px 0 0 -40px; border-radius: 130px 130px 110px 110px; z-index: 7; opacity: 0;
    background: radial-gradient(circle at 40% 30%, #e9b896, #b97c58 70%); filter: blur(10px); transform: rotate(-24deg); transform-origin: 30% 10%; }
  .yt-phone .dof { position: absolute; inset: 0; z-index: 8; pointer-events: none; backdrop-filter: blur(9px);
    -webkit-mask-image: linear-gradient(180deg, #000 0%, transparent 24%, transparent 70%, #000 100%); mask-image: linear-gradient(180deg, #000 0%, transparent 24%, transparent 70%, #000 100%); }
  .yt-phone .side { position: absolute; left: 110px; top: 380px; z-index: 9; color: #eaf2ff; width: 520px; }
  .yt-phone .side small { display: block; font: 700 26px "Mont"; color: #8fb3e8; letter-spacing: .12em; }
  .yt-phone .side b { display: block; font: 900 92px/1 "Unb"; letter-spacing: -.03em; text-shadow: 0 0 40px rgba(60,140,255,.5); margin: 10px 0; }
  .yt-phone .side span { font: 600 30px/1.3 "Mont"; color: #cfe1ff; }
  `,
  build(root, d, ctx) {
    const { U } = ctx, P = root._P = {};
    U.el("div", "bk", null, root).style.cssText = "left:120px;top:120px;width:220px;height:220px;background:rgba(255,190,110,.35)";
    U.el("div", "bk", null, root).style.cssText = "left:1600px;top:700px;width:260px;height:260px;background:rgba(60,204,255,.3)";
    if (d.side) P.side = U.el("div", "side", `<small>${d.side.small || ""}</small><b>${d.side.big || ""}</b><span>${d.side.sub || ""}</span>`, root);
    P.ph = U.el("div", "ph", null, root); if (d.match) P.ph.dataset.match = d.match;
    const s = P.scr = U.el("div", "scr", null, P.ph);
    if (d.screen === "promo") {
      s.innerHTML = `<h3>${d.title || "Акции"}</h3>` + d.offers.map(o => `<div class="off"><small>${o.h}</small><b>${o.v}</b><span>${o.s || ""}</span><i class="ring2"></i></div>`).join("");
    } else if (d.screen === "order") {
      s.innerHTML = `<h3>Оформление заказа</h3><div class="item"><div class="img"></div><div><div class="nm">${d.item}</div><div class="pr">${d.price}</div></div></div>
        <div class="card">Оплата<br><b>${d.card}</b><br><span class="g">${d.note || ""}</span></div><div class="pay">${d.pay}</div>`;
    } else if (d.screen === "stats") {
      const tot = d.cats.reduce((a, c) => a + c.v, 0); let acc = 0;
      s.innerHTML = `<h3>${d.title || "Траты за месяц"}</h3><div class="donut"><svg width="420" height="420" viewBox="0 0 420 420" style="transform:rotate(-90deg)">` +
        d.cats.map(c => { const L = 2 * Math.PI * 170, a = acc; acc += c.v; return `<circle cx="210" cy="210" r="170" fill="none" stroke="${c.c}" stroke-width="56" data-a="${a / tot}" data-f="${c.v / tot}" stroke-dasharray="0 ${L}"/>`; }).join("") +
        `</svg><div class="c">всего<b>${d.total}</b></div></div><div class="lg">` + d.cats.map(c => `<div><span><i style="background:${c.c}"></i>${c.l}</span><span>${U.fmt(c.v)} ₽</span></div>`).join("") + "</div>";
    } else s.innerHTML = d.html || "";
    P.pushes = (d.pushes || []).map(p => U.el("div", "push", `<div class="h"><i></i>${p.from || "БАНК · сейчас"}</div>${p.html}`, s));
    if (d.tap) { P.ring = U.el("div", "ring", null, P.ph); if (d.tap.finger) P.finger = U.el("div", "finger", null, P.ph); }
    U.el("div", "dof", null, root);
  },
  render(root, t, d, ctx) {
    const { U, dur } = ctx, P = root._P;
    const e = U.out5(t / .8);
    P.ph.style.transform = `translateY(${(1 - e) * 160}px) rotate(${-8 + 2 * U.clamp(t / dur)}deg) scale(${1 + .05 * U.clamp(t / dur)})`;
    if (P.side) { const k = U.out5((t - .2) / .6); P.side.style.opacity = k; P.side.style.transform = `translateX(${(1 - k) * -40}px)`; }
    P.pushes.forEach((p, i) => { const pt = d.pushes[i].t, k = U.out5((t - pt) / .45); p.style.opacity = t < pt ? 0 : 1; p.style.transform = `translateY(${(1 - k) * -260}px)`; });
    if (d.screen === "promo" && d.hl) {
      P.scr.querySelectorAll(".off").forEach((o, i) => { const on = i === d.hl.i, k = U.out5((t - d.hl.t) / .4);
        o.querySelector(".ring2").style.opacity = on ? k : 0; o.style.transform = on ? `scale(${1 + .04 * U.bell(U.clamp((t - d.hl.t) / .5))})` : ""; o.style.opacity = on || t < d.hl.t ? 1 : 1 - .45 * k; });
    }
    if (d.screen === "stats") {
      const L = 2 * Math.PI * 170, k = U.io3((t - .4) / 1.2);
      P.scr.querySelectorAll("circle").forEach((c, i) => { const a = +c.dataset.a, f = +c.dataset.f, vis = U.clamp((k - a) / f) * f;
        c.setAttribute("stroke-dasharray", `${(vis * L).toFixed(1)} ${L}`); c.setAttribute("stroke-dashoffset", (-a * L).toFixed(1)); });
      if (d.hl) P.scr.querySelectorAll(".lg div").forEach((r, i) => { r.style.background = i === d.hl.i && t > d.hl.t ? `rgba(26,157,87,${.16 * U.out3((t - d.hl.t) / .3)})` : ""; });
    }
    if (d.screen === "order" && d.paid) { const pay = P.scr.querySelector(".pay"), on = d.tap && t > d.tap.t + .15;
      pay.textContent = on ? d.paid : d.pay; pay.style.background = on ? "#1a9d57" : "#13161b"; }
    if (d.tap) {
      const tgt = P.scr.querySelector(d.tap.at || ".pay") || P.scr, x = tgt.offsetLeft + tgt.offsetWidth / 2 + 24, y = tgt.offsetTop + tgt.offsetHeight / 2 + 24;
      const k = (t - d.tap.t) / .5, fk = U.out3((t - d.tap.t + .6) / .5);
      P.ring.style.left = x + "px"; P.ring.style.top = y + "px"; P.ring.style.opacity = k > 0 && k < 1 ? 1 - k : 0; P.ring.style.transform = `scale(${.5 + .8 * U.clamp(k)})`;
      if (P.finger) { P.finger.style.left = x + "px"; P.finger.style.top = y + "px";
        P.finger.style.opacity = U.clamp((t - d.tap.t + .6) / .3) * (1 - U.clamp((t - d.tap.t - .5) / .4)) * .92;
        P.finger.style.transform = `translate(${(1 - fk) * 160}px, ${(1 - fk) * 220 + (k > 0 && k < .3 ? 10 : 0)}px) rotate(-24deg)`; }
      // нажатие: цель чуть «проседает»
      if (k > 0 && k < 1) tgt.style.transform = `scale(${1 - .03 * U.bell(k)})`;   // вне нажатия transform цели не трогаем (им управляет подсветка)
    }
  },
});
