// «УТОПЛЕННИК» — машина после ливня в тоннеле продаётся как «не бита, не крашена»: тоннель, сушилка, объявление,
// парковка, пол под ковриком, макро фары и разъёмов, петля в тот же тоннель. Машина — рисунок владельца (kit/img/hyundai).
$("#title .a").textContent = E.rubric; $("#title .b").style.display = "none"; $("#tag span").textContent = "утопленник";
$("#title .a").style.cssText = "font-size:100px;background:#2e86de;color:#fff";
document.querySelector("#cam > svg#bg")?.remove();
const W = (line, pre, n = 0) => {
  const norm = s => s.toLowerCase().replace(/ё/g, "е").replace(/[^а-я0-9]/g, "");
  const hits = (TT.words[line] || []).filter(w => norm(w[0]).startsWith(norm(pre)));
  return hits[n] ? hits[n][1] : st[line];
};
const SCN = {};
function scene(name, bg) {
  const d = document.createElement("div"); d.className = "scn"; d.id = "sc_" + name;
  d.innerHTML = bg ? BGS[bg].replace('id="bg"', `id="bg_${name}"`).replace('id="rainfx"', 'class="rainfx"') : "";
  $("#scene").appendChild(d); SCN[name] = d; return d;
}
const add = (sc, html) => { SCN[sc].insertAdjacentHTML("beforeend", html); };
const car = (id, l, t, w, z = 4) => `<img class="pcar" id="${id}" src="../../kit/img/hyundai/hyundai.png" style="left:${l}px;top:${t}px;width:${w}px;z-index:${z}">`;
const water = (id, top, z = 5) => `<div class="water" id="${id}" style="top:${top}px;z-index:${z}"></div>`;
const person = (sc, kind, p, l, t, s = 1, z = 7) => add(sc, `<div class="c" id="${p.toUpperCase()}" style="left:${l}px;top:${t}px;z-index:${z};transform:scale(${s})">${CHARS[kind](p)}</div>`);
const stamp = (id, text, l, t, bg, fg = "#fff", fs = 60, rot = -4) => `<div class="stamp2" id="${id}" style="left:${l}px;top:${t}px;background:${bg};color:${fg};font-size:${fs}px;transform:rotate(${rot}deg)">${text}</div>`;
const bubbles = (pre, n, x, y) => Array.from({ length: n }, (_, i) => `<div class="bubl" id="${pre}${i}" style="left:${x + (i * 37) % 140}px;top:${y}px;width:${18 + (i % 3) * 10}px;height:${18 + (i % 3) * 10}px"></div>`).join("");
const TOL = ["t", "t2", "t3"];

// 1. тоннель: машина по окна в воде
scene("hook", "flood");
add("hook", car("c1", 130, 1050, 820) + water("w1", 1240) + bubbles("hb", 8, 560, 1230));
// 2. сушилка
scene("dry", "dryroom");
add("dry", car("c2", 80, 1150, 700) + `<div class="el" id="blow" style="left:620px;top:1170px;font-size:90px;z-index:9;opacity:0">💨</div>`
  + Array.from({ length: 5 }, (_, i) => `<div class="drip" id="dr${i}" style="left:${200 + i * 110}px;top:1380px"></div>`).join("")
  + stamp("almost", "ПОЧТИ", 360, 520, "#151515", "#ffd23f", 80, -4));
person("dry", "tolyan", "t", 640, 880, .9, 6);
// 3. объявление крупно
scene("ad", "dryroom");
add("ad", `<div style="position:absolute;inset:0;backdrop-filter:blur(12px);background:rgba(0,0,0,.45);z-index:4"></div>
  <div class="adphone" id="adp"><div class="scr2"><div class="pic2"><img src="../../kit/img/hyundai/hyundai.png"></div>
  <div class="ttl2">Hyundai 2017 · 690 000 ₽</div>
  <div class="ck" id="ck0">✅ Не бита</div><div class="ck" id="ck1">✅ Не крашена</div><div class="ck" id="ck2">✅ Один владелец</div>
  <div class="ck swam" id="ck3">🌊 Плавала: —</div></div></div>`);
// 4. парковка
scene("park", "parking");
add("park", car("c3", 200, 1160, 700));
person("park", "vika", "v", -30, 900, .9, 6); person("park", "tolyan", "t2", 680, 900, .9, 6);
// 5. пол салона сверху: коврик отгибается
scene("floor", "parking");
add("floor", `<div class="floorbox"><div class="sand"></div>
  ${[[260, 300], [380, 360], [500, 280], [330, 430], [560, 410]].map(([x, y]) => `<i style="left:${x}px;top:${y}px"></i>`).join("")}
  <b id="shell">🐚</b><div class="rug" id="rug"></div></div>` + stamp("sea", "🌊 НА МОРЕ. ВНУТРИ МАШИНЫ", 120, 1540, "#2e86de", "#fff", 44, -3));
// 6. макро: фара, разъёмы, салазки
scene("macro", "parking");
add("macro", `<div style="position:absolute;inset:0;backdrop-filter:blur(10px);background:rgba(0,0,0,.4);z-index:4"></div>
  <div class="mac" id="mac0"><div class="lamp2"><div class="bulb"></div></div><span>ПОЛОСА ВОДЫ В ФАРЕ</span></div>
  <div class="mac" id="mac1"><div class="plug">${[0, 1, 2, 3].map(() => "<i></i>").join("")}</div><span>ЗЕЛЁНЫЕ РАЗЪЁМЫ</span></div>
  <div class="mac" id="mac2"><div class="rail"></div><span>РЖАВЫЕ САЛАЗКИ</span></div>`);
// 7. снова тоннель, ливень, Толян глохнет
scene("rain", "flood");
add("rain", car("c4", 60, 1080, 760) + water("w2", 1290) + bubbles("rb", 8, 300, 1280)
  + `<div class="el" id="tree1" style="left:420px;top:1300px;font-size:70px;z-index:9;opacity:0">🌲</div><div class="el" id="tree2" style="left:560px;top:1300px;font-size:60px;z-index:9;opacity:0">🌲</div>`);
person("rain", "tolyan", "t3", 700, 920, .8, 3);
const drops = [];
$$(".rainfx").forEach((rf, k) => { for (let i = 0; i < 70; i++) { const d = document.createElement("div");
  d.style.cssText = `position:absolute;width:3px;height:${40 + (i * 13) % 40}px;background:rgba(190,215,240,.5);border-radius:2px`;
  rf.appendChild(d); drops.push([d, (i * 157 + k * 60) % 1180 - 100, (i * 263) % 1920, 900 + (i * 37) % 500]); } });
// 8. мораль
scene("moral", "parking");
add("moral", `<div class="card" id="moralCard" style="top:380px;z-index:20"><h3>ПРИЗНАКИ УТОПЛЕННИКА</h3>
  <div class="li" id="mo0">🏖 Песок и ил под ковриками и в запаске</div><div class="li" id="mo1">🔩 Ржавые салазки и болты внизу</div>
  <div class="li" id="mo2">💡 Полоса воды в фарах, зелёные разъёмы</div><div class="li" id="mo3">📄 История по VIN</div>
  <div class="rule" id="mo4">🔔 Свежие объявления — бот «Перехват»</div></div>`);

TOL.forEach(p => { const s = document.getElementById(p + "-shades"); if (s) s.style.display = ""; });
$("#end h2").innerHTML = E.end;
bubble("t1", "Два фена, десять ёлочек —<br><em>и как новая!</em>", 60, 700, 520);
bubble("t2", "Сестрёнка, машина — огонь!<br><em>Сухая, как пустыня!</em>", 300, 700, 560);
bubble("v1", "Толян, почему под ковриком<br><em>песок и ракушка?</em>", 60, 520, 160);
bubble("t3", "С пляжа!<br><em>Хозяин на море ездил!</em>", 520, 1330, 300);
bubble("t4", "Брат…<br><em>она опять плывёт!</em>", 60, 700, 560);

window.build = R => {
  const tl = R.tl, cam = R.camera($("#cam"), { hand: .6 });
  R.grain(.03);
  gsap.set(".scn", { opacity: 0 }); gsap.set("#sc_hook", { opacity: 1 });
  const { pop } = common(R, cam, { mood: (k, t) => k === "vika" ? "meh" : "grin" });
  R.hooks.push(t => { const f = Math.floor(t * 30), lv = (LIP.tolyan || [])[f] || 0;
    TOL.forEach(p => { if (p !== "t" && document.getElementById(p)) mouth(p, lv > .28 && !(lv < .55 && f % 3 === 2) ? "talk" : p === "t3" ? "o" : "grin"); });
    drops.forEach(([d, x, y, v]) => { const yy = (y + t * v) % 2000 - 60; d.style.transform = `translate(${x - yy * .18}px, ${yy}px) rotate(10deg)`; });
    ["w1", "w2"].forEach(w => { const el = document.getElementById(w); if (el) el.style.transform = `translateY(${Math.sin(t * 1.6) * 6}px)`; }); });
  const swap = (from, to, at, kind = "swipe") => {
    if (kind === "cut") { tl.set(`#sc_${from}`, { opacity: 0 }, at).set(`#sc_${to}`, { opacity: 1, x: 0, filter: "none" }, at); R.sfx("hit", at, .4); return; }
    tl.set(`#sc_${to}`, { opacity: 1, x: 1080, filter: "blur(14px)" }, at)
      .to(`#sc_${from}`, { x: -1080, filter: "blur(14px)", duration: .35, ease: "power3.in" }, at)
      .to(`#sc_${to}`, { x: 0, filter: "blur(0px)", duration: .38, ease: "power3.out" }, at + .12)
      .set(`#sc_${from}`, { opacity: 0, x: 0, filter: "none" }, at + .5);
    R.sfx("whoosh", at, .6);
  };
  const rise = (pre, at) => { for (let i = 0; i < 8; i++) tl.fromTo(`#${pre}${i}`, { opacity: 0, y: 0 }, { opacity: .9, y: -90 - i * 12, duration: .9, ease: "power1.out", immediateRender: false }, at + i * .18)
    .to(`#${pre}${i}`, { opacity: 0, duration: .2 }, at + i * .18 + .8); R.sfx("pop", at, .3); };
  window.MUSIC = { style: "bed", bpm: 92, end: R.dur - 1.2, mute: [[en.t3 + .1, en.l3 + .5]] };
  for (const l of ["t1", "t2", "v1", "t3", "t4"]) { const nx = E.lines[E.lines.findIndex(x => x.id === l) + 1]; pop("#b_" + l, st[l] - .05, Math.min(en[l] + .9, st[nx.id] - .1)); }
  const slam = (sel, at, sfx = "impact") => { tl.fromTo(sel, { opacity: 0, scale: 2 }, { opacity: 1, scale: 1, duration: .18, ease: "power4.out", immediateRender: false }, at); R.sfx(sfx, at + .02, .7); };

  // 1. тоннель: камера опускается к воде, пузыри
  tl.fromTo(cam, { s: 1, y: -60 }, { s: 1.08, y: 40, duration: st.t1 - .8, ease: "power1.inOut", immediateRender: false }, 0).set(cam, { s: 1, y: 0 }, st.t1 - .7);
  rise("hb", .3); rise("hb", W("h", "формаль") - .3);
  tl.to("#title", { opacity: 0, y: -50, duration: .25 }, W("h", "осенью") - .1);
  // 2. сушилка: вентиляторы крутятся, капает, «почти»
  swap("hook", "dry", st.t1 - .7);
  R.hooks.push(t => { $$("#sc_dry [id^=fanb]").forEach(f => f.style.transform = `rotate(${t * 900}deg)`); });
  tl.fromTo("#blow", { opacity: 0, x: 0 }, { opacity: 1, x: -80, duration: .4, repeat: 3, yoyo: true, immediateRender: false }, st.t1);
  for (let i = 0; i < 5; i++) tl.fromTo(`#dr${i}`, { opacity: 0, y: 0 }, { opacity: 1, y: 120, duration: .5, repeat: 5, ease: "power2.in", immediateRender: false }, st.t1 + i * .17);
  slam("#almost", W("l1", "почти"), "pop");
  // 3. объявление: галочки по словам, в конце «плавала: —»
  swap("dry", "ad", st.l2 - .7);
  tl.fromTo("#adp", { y: 600 }, { y: 0, duration: .5, ease: "expo.out", immediateRender: false }, st.l2 - .5); R.sfx("swish", st.l2 - .5, .6);
  [[0, W("l2", "бита")], [1, W("l2", "краш")], [2, W("l2", "краш") + .35]].forEach(([i, at]) => { tl.fromTo(`#ck${i}`, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: .2, immediateRender: false }, at); R.sfx("pop", at, .5); });
  tl.fromTo("#ck3", { opacity: 0 }, { opacity: 1, duration: .1, repeat: 5, yoyo: true, immediateRender: false }, W("l2", "проплав")); R.sfx("bleep", W("l2", "проплав"), .15);
  // 4. парковка
  swap("ad", "park", st.t2 - .7);
  tl.fromTo("#V", { x: -400 }, { x: 0, duration: .6, ease: "back.out(1.3)", immediateRender: false }, st.t2 - .4);
  // 5. пол сверху: коврик отгибается, ракушка, звук прибоя
  swap("park", "floor", st.v1 - .5, "cut");
  tl.fromTo("#rug", { x: 0, y: 0, rotation: 0 }, { x: -430, y: -300, rotation: -28, duration: .55, ease: "power2.out", immediateRender: false }, W("v1", "ковр") - .1); R.sfx("swish", W("v1", "ковр"), .7);
  tl.fromTo("#shell", { scale: 0 }, { scale: 1, duration: .3, ease: "back.out(2.5)", immediateRender: false }, W("v1", "ракушк")); R.sfx("ping", W("v1", "ракушк"), .6);
  slam("#sea", st.l3, "drop"); R.sfx("riser", st.l3, .5);
  // 6. макро: три плана жёсткими склейками со «вспышкой»
  swap("floor", "macro", st.l4 - .4, "cut");
  [["#mac0", W("l4", "полоса")], ["#mac1", W("l4", "зелен")], ["#mac2", W("l4", "ржав")]].forEach(([s, at], i, arr) => {
    tl.set(s, { opacity: 1 }, at - .05); if (arr[i + 1]) tl.set(s, { opacity: 0 }, arr[i + 1][1] - .05); R.flash(at - .05, .6, .15); });
  // 7. снова тоннель: ливень, машина глохнет, ёлочки всплывают
  swap("macro", "rain", st.l5 - .6);
  tl.fromTo("#c4", { x: -700 }, { x: 0, duration: 1.2, ease: "power2.out", immediateRender: false }, st.l5 - .4);
  tl.to("#c4", { x: 8, duration: .07, yoyo: true, repeat: 5 }, W("l5", "вспомн")); R.sfx("boom", W("l5", "вспомн") + .1, .5);
  rise("rb", W("l5", "вспомн") + .2);
  tl.fromTo("#tree1, #tree2", { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: .5, ease: "back.out(2)", immediateRender: false }, st.t4); R.sfx("pop", st.t4, .5);
  tl.to(cam, { s: 1.06, duration: en.t4 - st.l5 + .6, ease: "none" }, st.l5).set(cam, { s: 1 }, st.rule - .7);
  // 8. мораль
  swap("rain", "moral", st.rule - .7);
  tl.fromTo("#moralCard", { opacity: 0, y: 160 }, { opacity: 1, y: 0, duration: .4, ease: "expo.out", immediateRender: false }, st.rule - .4);
  [W("rule", "песок"), W("rule", "ржавч"), W("rule", "полоса"), W("rule", "истори"), W("rule", "освеж") - .2].forEach((at, i) => { tl.fromTo(`#mo${i}`, { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: .22, immediateRender: false }, at); R.sfx("pop", at, .5); });
  ending(R, st.end - .15);
};
