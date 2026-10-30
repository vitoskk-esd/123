// Серия «Перекупы · в объявлении / на деле» по сценарию window.EP (ep04.json …) и таймлайну озвучки window.TT (place.py).
// Блоки «НА ДЕЛЕ» (EP.reveals[].type): gauge — толщиномер по машине, doc — документ построчно, stat — счётчик,
// chart — цены похожих машин и рынок, dash — приборка с лампами ошибок.
const $ = s => document.querySelector(s);
const E = window.EP;
document.getElementById("T").innerHTML = CHARS.tolyan("t");
document.getElementById("S").innerHTML = CHARS.seryoga("s");
document.getElementById("carbox").innerHTML = CHARS.car("k", .55, "#262a31", "#0b0d12");
document.getElementById("t-shades").style.display = ""; document.getElementById("t-pick").style.display = "";

$("#ad").innerHTML = `<div class="ch"><i></i>Толян · авто под ключ</div>${E.car}<br>` +
  E.claims.map((c, i) => `<span class="ln" id="a${i + 1}"><span class="hl"></span>✅ ${c}</span><br>`).join("") + `<span class="pr">${E.price}</span>`;
E.bubbles.forEach((b, i) => { $(`#b${i}`).innerHTML = b; });
E.checks.forEach((c, i) => { $(`#k${i + 1} span`).textContent = c; });
$("#sum").innerHTML = `<div class="row hd"><div>В ОБЪЯВЛЕНИИ</div><div>НА ДЕЛЕ</div></div>` +
  E.sum.map((r, i) => `<div class="row" id="m${i + 1}"><div>${r[0]}</div><div>${r[1]}</div></div>`).join("") + `<div class="ft" id="mf">${E.sumfoot}</div>`;

const rvs = $("#rvs");
E.reveals.forEach((r, i) => {
  const k = i + 1, d = document.createElement("div");
  d.id = `rv${k}`; d.className = "rv" + (r.type === "doc" ? " paper" : "");
  if (r.type === "gauge") d.innerHTML = `<h3>${r.title}</h3><div class="carw">${CHARS.car("g" + k, .9, "#3a404a", "#0b0d12")}` +
      r.points.map((p, j) => `<div class="pt${p[3] ? " bad" : ""}" id="pt${k}_${j}" style="left:${p[0]}px;top:${p[1]}px">${p[2]}</div>`).join("") +
      `</div><div class="big"><span id="big${k}">0</span><small>${r.unit}</small></div><div class="note">${r.note}</div>`;
  if (r.type === "doc") d.innerHTML = `<h3 style="text-align:center">${r.title}</h3><div class="sub" style="text-align:center">${r.sub}</div>` +
      r.rows.map((x, j) => `<div class="row${j === r.bad ? " bad" : ""}" id="row${k}_${j}"><span>${x[0]}</span><b>${x[1]}</b></div>`).join("");
  if (r.type === "stat") d.innerHTML = `<h3 style="text-align:center">${r.title}</h3><div class="big"><span id="big${k}">0</span><small>${r.unit}</small></div>` +
      r.lines.map((l, j) => `<div class="ln" id="ln${k}_${j}">${l}</div>`).join("");
  if (r.type === "chart") {
    const all = [...r.bars, r.mine], lo = Math.min(...all) * .8, hi = Math.max(...all) * 1.04, h = v => (v - lo) / (hi - lo) * 100;
    d.innerHTML = `<h3>${r.title}</h3><div class="bars">` +
      r.bars.map((v, j) => `<div class="bar" id="bar${k}_${j}" style="height:${h(v)}%"><span>${v}к</span></div>`).join("") +
      `<div class="bar mine" id="bar${k}_m" style="height:${h(r.mine)}%"><span>${r.mine >= 1000 ? (r.mine / 1000).toFixed(2).replace(".", ",") + " млн" : r.mine + "к"}</span></div>` +
      `<div class="mkt" id="mkt${k}" style="bottom:${h(r.market)}%"><i>рынок ≈ ${r.market} 000 ₽</i></div></div>` +
      `<div class="barlbl">${r.bars.map(() => "<div>похожие</div>").join("")}<div style="color:#ff6b5e">Толян</div></div>`;
  }
  if (r.type !== "dash") { d.innerHTML += `<div class="stamp" id="st${k}">${r.stamp}</div>`; rvs.appendChild(d); }
});

// дождь (локация «трасса»): косые капли поверх сцены
const rainfx = document.getElementById("rainfx"), drops = [];
if (rainfx) for (let i = 0; i < 70; i++) { const d = document.createElement("div");
  d.style.cssText = `position:absolute;width:3px;height:${40 + (i * 13) % 40}px;background:rgba(190,215,240,.45);border-radius:2px;transform-origin:0 0`;
  rainfx.appendChild(d); drops.push([d, (i * 157) % 1180 - 100, (i * 263) % 1920, 900 + (i * 37) % 500]); }

window.build = R => {
  if (drops.length) R.hooks.push(t => drops.forEach(([d, x, y, v]) => { const yy = (y + t * v) % 2000 - 60;
    d.style.transform = `translate(${x - yy * .18}px, ${yy}px) rotate(10deg)`; }));
  const tl = R.tl, cam = R.camera($("#cam"), { hand: .5 });
  R.grain(.035);
  gsap.set("#t-armR", { svgOrigin: "292 400" }); gsap.set("#t-armL", { svgOrigin: "128 400" });
  gsap.set("#s-armR", { svgOrigin: "284 404" }); gsap.set("#s-armL", { svgOrigin: "136 404" });
  gsap.set(".pill", { xPercent: -50 });
  const T = TT.T, st = TT.start, en = TT.end;
  window.MUSIC = { style: "bed", bpm: 92, end: R.dur - 1.2, mute: [1, 2, 3].map(k => [T["r" + k] - .05, T["r" + k] + .55]) };
  R.hooks.push(t => {
    const f = Math.floor(t * 30), lv = LIP.tolyan[f] || 0;
    mouth("t", lv > .28 && !(lv < .55 && f % 3 === 2) ? "talk" : t > T.r1 && t < T.sum ? "nerv" : "grin");
    mouth("s", t > T.r1 && t < T.sum ? "meh" : "flat");
    $("#t-body").style.transform = `translateY(${Math.sin(t * 2.4) * 3}px)`;
    $("#s-body").style.transform = `translateY(${Math.sin(t * 2.1 + 1) * 3}px)`;
    $("#s-lids").style.transform = `scaleY(${((t + 1.4) % 3.1) < .12 ? 1 : 0})`;
    $("#t-head").style.transform = `rotate(${t > 1.25 ? Math.sin(t * Math.PI * 140 / 60) * 3 : 0}deg) translateY(${t > 1.25 ? Math.abs(Math.sin(t * Math.PI * 140 / 60)) * 5 : 0}px)`;
  });
  const pop = (sel, at, until) => { tl.fromTo(sel, { opacity: 0, scale: .6 }, { opacity: 1, scale: 1, duration: .3, ease: "back.out(2.2)", immediateRender: false }, at);
    if (until) tl.to(sel, { opacity: 0, duration: .15 }, until); R.sfx("pop", at, .6); };
  const pill = (id, at, until) => { tl.fromTo(id, { opacity: 0, scale: 1.8, rotation: id === "#pReal" ? -12 : 0 }, { opacity: 1, scale: 1, rotation: id === "#pReal" ? -4 : -2, duration: .18, ease: "power4.out", immediateRender: false }, at)
    .to(id, { opacity: 0, duration: .15 }, until); R.sfx(id === "#pReal" ? "hit" : "pop", at, id === "#pReal" ? .5 : .6); };
  const stamp = (sel, at) => { tl.fromTo(sel, { opacity: 0, scale: 2.2 }, { opacity: 1, scale: 1, duration: .18, ease: "power4.out", immediateRender: false }, at); R.sfx("impact", at + .02, .8); R.shake(cam, at + .04, .5, .25); };

  // 0. хук: формат крупно, Толян хвастается
  R.punch(cam, .05, .03);
  tl.to("#t-armR", { rotation: -60, duration: .3, ease: "back.out(2)" }, .2);
  pop("#b0", .35, T.p1 - .15);
  tl.to("#title", { opacity: 0, y: -50, duration: .25 }, T.p1 - .2);

  // фраза k: карточка объявления → подсветка строки → «НА ДЕЛЕ»
  const phrase = (k, p, r) => {
    tl.to("#scene", { filter: "blur(5px) brightness(.75)", duration: .25 }, p)
      .fromTo("#ad", { opacity: 0, x: 0, y: 120, rotation: -2 }, { opacity: 1, x: 0, y: 0, rotation: 0, duration: .35, ease: "back.out(1.6)", immediateRender: false }, p)
      .fromTo(`#a${k} .hl`, { opacity: 0, scaleX: 0 }, { opacity: 1, scaleX: 1, transformOrigin: "0 50%", duration: .3, ease: "power3.out", immediateRender: false }, p + .35)
      .to(`#a${k}`, { color: "#151515", duration: .1 }, p + .4)
      .to(`#a${k}`, { color: "#ffffff", duration: .01 }, r)
      .to(`#a${k} .hl`, { opacity: 0, duration: .01 }, r)
      .to("#ad", { opacity: 0, x: -1300, rotation: -8, duration: .25, ease: "power3.in" }, r - .05);
    pill("#pAd", p + .05, r - .05); pill("#pReal", r, r + 1.1);
    R.shake(cam, r + .05, .7, .3); R.flash(r, .4, .15);
  };

  // реальность k
  const reveal = (k, rv) => {
    const r = T["r" + k], next = k < 3 ? T["p" + (k + 1)] : T.sum, L = `L${k}`;
    const card = `#rv${k}`;
    if (rv.type !== "dash") {
      tl.to("#scene", { filter: "blur(7px) brightness(.5)", duration: .01 }, r)
        .fromTo(card, { opacity: 0, y: 200, rotation: 3 }, { opacity: 1, y: 0, rotation: -1, duration: .4, ease: "back.out(1.6)", immediateRender: false }, r + .1)
        .to(card, { opacity: 0, duration: .15 }, next - .1);
    }
    if (rv.type === "gauge") {
      rv.points.forEach((p, j) => { const at = r + .5 + j * .22;
        tl.fromTo(`#pt${k}_${j}`, { opacity: 0, scale: 1.8 }, { opacity: 1, scale: 1, duration: .16, ease: "power4.out", immediateRender: false }, at); R.sfx(p[3] ? "clack" : "tick", at, .8); });
      R.sfx("scan", r + .4, 1.2);
      R.count($(`#big${k}`), r + .5, 0, rv.big, 1.1);
      stamp(`#st${k}`, st[L] - .45);
    }
    if (rv.type === "doc") {
      rv.rows.forEach((x, j) => { const at = r + .4 + j * .26;
        tl.fromTo(`#row${k}_${j}`, { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: .2, ease: "power3.out", immediateRender: false }, at); R.sfx("clack", at, .7); });
      stamp(`#st${k}`, st[L] - .45);
    }
    if (rv.type === "stat") {
      if (rv.dec) {                         // дробное число: «1,4 мм»
        const o = { v: 0 }; tl.fromTo(o, { v: 0 }, { v: rv.big, duration: 1.2, ease: "power2.out", immediateRender: false,
          onUpdate: () => { $(`#big${k}`).textContent = o.v.toFixed(rv.dec).replace(".", ","); } }, r + .35);
      } else R.count($(`#big${k}`), r + .35, 0, rv.big, 1.2);
      for (let j = 0; j < 12; j++) R.sfx("tick", r + .35 + 1.2 * (1 - Math.pow(1 - j / 12, 1.8)), .6);
      rv.lines.forEach((l, j) => tl.fromTo(`#ln${k}_${j}`, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: .25, ease: "power3.out", immediateRender: false }, r + 1.0 + j * .3));
      stamp(`#st${k}`, st[L] - .45);
    }
    if (rv.type === "chart") {
      rv.bars.forEach((v, j) => { const at = r + .35 + j * .12;
        tl.fromTo(`#bar${k}_${j}`, { scaleY: 0 }, { scaleY: 1, duration: .3, ease: "power3.out", immediateRender: false }, at); R.sfx("tap", at, .6); });
      tl.fromTo(`#mkt${k}`, { opacity: 0, scaleX: 0 }, { opacity: 1, scaleX: 1, transformOrigin: "0 50%", duration: .35, ease: "power3.out", immediateRender: false }, r + 1.05);
      tl.fromTo(`#bar${k}_m`, { scaleY: 0 }, { scaleY: 1, duration: .45, ease: "back.out(1.4)", immediateRender: false }, r + 1.45); R.sfx("riser", r + 1.2, .5);
      stamp(`#st${k}`, st[L] - .45);
    }
    if (rv.type === "dash") {
      tl.to("#dash", { opacity: 1, duration: .01 }, r).to("#dash", { opacity: 0, duration: .15 }, next - .1);
      tl.fromTo("#needleL", { rotation: -40, svgOrigin: "300 900" }, { rotation: 10, duration: .8, ease: "elastic.out(1,.4)", immediateRender: false }, r + .2);
      rv.lights.forEach((n, j) => { const at = r + .5 + j * .25;
        tl.set(`#L-${n}`, { opacity: 1 }, at); R.sfx("ping", at, .5);
        for (let b = 1; b < 9; b++) tl.set(`#L-${n}`, { opacity: b % 2 ? .35 : 1 }, at + b * .4); });
      $("#dashStamp .stamp").textContent = rv.stamp;
      if (rv.odo !== undefined) $("#odo").textContent = rv.odo;
      tl.fromTo("#dashStamp", { opacity: 0, scale: 2.2 }, { opacity: 1, scale: 1, duration: .18, ease: "power4.out", immediateRender: false }, st[L] - .45)
        .to("#dashStamp", { opacity: 0, duration: .15 }, next - .1);
      R.sfx("impact", st[L] - .43, .8); R.shake(cam, st[L] - .4, .5, .25);
    }
    pop(`#b${k}`, st[L], next - .2);
    tl.fromTo(`#k${k}`, { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: .3, ease: "expo.out", immediateRender: false }, en[L] + .05).to(`#k${k}`, { opacity: 0, duration: .15 }, next - .1);
    if (rv.type !== "dash") tl.to("#scene", { filter: "blur(5px) brightness(.75)", duration: .01 }, next - .1);
  };
  [1, 2, 3].forEach(k => { phrase(k, T["p" + k], T["r" + k]); reveal(k, E.reveals[k - 1]); });

  // сводка
  tl.to("#scene", { filter: "blur(6px) brightness(.7)", duration: .25 }, T.sum)
    .fromTo("#sum", { opacity: 0, y: 160 }, { opacity: 1, y: 0, duration: .4, ease: "expo.out", immediateRender: false }, T.sum + .05);
  ["#m1", "#m2", "#m3", "#mf"].forEach((id, k) => { const at = k < 3 ? T.sum + .35 + k * .3 : st.N4 - .35;
    tl.fromTo(id, { opacity: 0, x: -60 }, { opacity: 1, x: 0, duration: .25, ease: "power3.out", immediateRender: false }, at); R.sfx(k < 3 ? "pop" : "impact", at, .6); });

  // цензура: «пииип» и стикер над репликой
  TT.bleeps.forEach(([a, b, line]) => {
    R.sfx("bleep", a, b - a);
    tl.set("#bleep", { left: 560, top: 1150 }, a - .01)
      .fromTo("#bleep", { opacity: 0, scale: 1.8, rotation: -14 }, { opacity: 1, scale: 1, rotation: -6, duration: .12, ease: "power4.out", immediateRender: false }, a)
      .to("#bleep", { opacity: 0, duration: .12 }, b + .25);
    R.shake(cam, a + .05, .5, .25);
  });

  // финал
  tl.to("#end", { opacity: 1, duration: .25 }, T.end);
  tl.fromTo("#end .fox", { scale: .4, rotation: -20 }, { scale: 1, rotation: 0, duration: .5, ease: "back.out(2.2)", immediateRender: false }, T.end + .1);
  R.rise($("#end h2"), T.end + .4); R.rise($("#end p"), T.end + 1.2); R.slam($("#end .logo"), T.end + 1.8, { from: 1.6 });
};
