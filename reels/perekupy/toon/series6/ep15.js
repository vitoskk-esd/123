// «ОДИН ДЕНЬ ПЕРЕКУПА» — день Толяна по часам: 9 сцен, 8 локаций, сквозные часы в углу, петля 05:30 → 05:30.
// Машина — белая ВАЗ-2114 владельца (kit/img/vaz2114/vaz2114_white.png).
$("#title .a").textContent = E.rubric; $("#title .b").textContent = E.subtitle; $("#tag span").textContent = "один день перекупа";
$("#title .a").style.fontSize = "84px"; $("#title .b").style.fontSize = "112px";
document.querySelector("#cam > svg#bg")?.remove();
const W = (line, pre, n = 0) => {          // время слова в реплике (по Whisper); нет — начало реплики
  const norm = s => s.toLowerCase().replace(/ё/g, "е").replace(/[^а-я0-9]/g, "");
  const hits = (TT.words[line] || []).filter(w => norm(w[0]).startsWith(norm(pre)));
  return hits[n] ? hits[n][1] : st[line];
};
const SCN = {};
function scene(name, bg) {
  const d = document.createElement("div"); d.className = "scn"; d.id = "sc_" + name;
  d.innerHTML = bg ? BGS[bg].replace('id="bg"', `id="bg_${name}"`).replace('id="rainfx"', 'class="rainfx"').replace('id="snowfx"', 'class="snowfx"') : "";
  $("#scene").appendChild(d); SCN[name] = d; return d;
}
const add = (sc, html) => { SCN[sc].insertAdjacentHTML("beforeend", html); };
const car = (id, l, t, w = 760, z = 6) => `<img class="pcar" id="${id}" src="../../kit/img/vaz2114/vaz2114_white.png" style="left:${l}px;top:${t}px;width:${w}px;z-index:${z}">`;
const person = (sc, kind, p, l, t, s = 1, z = 7) => add(sc, `<div class="c" id="${p.toUpperCase()}" style="left:${l}px;top:${t}px;z-index:${z};transform:scale(${s})">${CHARS[kind](p)}</div>`);
const stamp = (id, text, l, t, bg, fg = "#fff", fs = 60, rot = -4) => `<div class="stamp2" id="${id}" style="left:${l}px;top:${t}px;background:${bg};color:${fg};font-size:${fs}px;transform:rotate(${rot}deg)">${text}</div>`;
const puffs = (sc, pre, n) => add(sc, Array.from({ length: n }, (_, i) => `<div class="puff2" id="${pre}${i}"></div>`).join(""));
const TOL = ["t0", "t", "t2", "t3", "t4", "t5", "t6"];       // Толян в каждой сцене свой

// 1. 05:30, ночь: будильник, фонарик
scene("hook", "night");
add("hook", `<div id="dark" style="position:absolute;inset:0;background:#05060a;opacity:.72;z-index:5"></div>`
  + `<div id="beam" style="position:absolute;left:0;top:0;width:1080px;height:1920px;z-index:6;opacity:0;background:linear-gradient(200deg,rgba(255,240,180,0) 30%,rgba(255,240,180,.35) 52%,rgba(255,240,180,0) 70%);clip-path:polygon(600px 1180px,1080px 640px,1080px 1100px)"></div>`
  + `<div class="alarm" id="alarm1">05:30</div>` + `<div class="el" id="torch" style="left:560px;top:1150px;font-size:96px;z-index:9;opacity:0">🔦</div>`
  + stamp("chips1", "ДНЁМ ВИДНО СКОЛЫ", 160, 1690, "#ffd23f", "#151515", 58, -3));
person("hook", "tolyan", "t0", 330, 880, .95);
// 2. 06:40, гаражи: баба Галя, «под яблоней»
scene("garage", "garages");
add("garage", `<div id="gin" style="position:absolute;left:500px;top:700px;width:200px;height:360px;background:#0c0d10;z-index:1"></div>`
  + `<div id="gdoor" style="position:absolute;left:500px;top:700px;width:200px;height:360px;background:#3f6e5a;border:6px solid #000;transform-origin:50% 0;z-index:2"></div>`
  + car("gCar", 280, 1150) + stamp("p180", "180 000 ₽", 120, 420, "#151515", "#fff", 64, -3)
  + stamp("apple", "+ ЯБЛОНЯ В ПОДАРОК 🌳", 150, 540, "#4cd964", "#151515", 46, 2));
puffs("garage", "gd", 5);
person("garage", "galya", "g", -20, 860, .95); person("garage", "tolyan", "t", 700, 870, .9, 8);
// 3. 09:00, СТО: скрутка
scene("sto", "sto");
add("sto", car("sCar", 140, 1150) + `<div class="odo" id="odo" style="top:400px"><small>ОДОМЕТР</small><b id="odoN">200 000</b></div>`
  + stamp("young", "МАШИНА ПОМОЛОДЕЛА ✨", 100, 640, "#4cd964", "#151515", 50, -3)
  + stamp("ded", "ДЕД — НЕТ 🕯", 330, 760, "#151515", "#fff", 60, 3));
person("sto", "tolyan", "t2", -40, 870, .9, 8); person("sto", "mihalych", "m", 660, 860, .95);
// 4. 11:00, мойка: пена, баллончик, коврик на дыре
scene("wash", "mall");
add("wash", car("wCar", 160, 1130, 780)
  + Array.from({ length: 26 }, (_, i) => { const r = 70 + (i * 37) % 70; return `<div class="foam" id="fo${i}" style="left:${170 + (i * 97) % 700}px;top:${1110 + (i * 53) % 220}px;width:${r}px;height:${r}px"></div>`; }).join("")
  + Array.from({ length: 6 }, (_, i) => `<div class="el" id="sh${i}" style="left:${220 + i * 110}px;top:${1120 + (i % 2) * 90}px;font-size:${60 + (i % 3) * 16}px;z-index:9;opacity:0">✨</div>`).join("")
  + `<div class="el" id="can" style="left:780px;top:880px;font-size:120px;z-index:9;opacity:0">🧴</div>`
  + `<div class="mist" id="mist"></div>`
  + `<div class="matcard" id="matCard"><div class="hole"></div><div class="mat" id="mat"></div><span>ПОД КОВРИКОМ</span></div>`
  + stamp("smell", "ЗАПАХ НОВОЙ МАШИНЫ · 99 ₽", 70, 380, "#4cd964", "#151515", 42, -3)
  + stamp("mats", "КОВРИКИ = ШТОРКИ", 300, 1000, "#ff3b30", "#fff", 50, 3));
// 5. 13:00, авторынок: Серёга с толщиномером
scene("market", "market");
add("market", car("mCar", 260, 1150) + `<div class="gauge" id="gauge"><small>ТОЛЩИНОМЕР</small><b id="gaugeN">90</b><i>мкм</i></div>`
  + stamp("zip", "ПРО ЯБЛОНЮ — НИ СЛОВА 🤐", 90, 420, "#151515", "#fff", 44, -3)
  + `<div class="polar" id="polar"><img src="../../kit/img/priora/priora_black.png"><span>«ОДНА ХОЗЯЙКА» · БЫЛО</span></div>`);
person("market", "tolyan", "t3", -30, 870, .9, 8); person("market", "seryoga", "s", 700, 870, .9, 8);
// 6. 15:30, трасса: «чек» и изолента
scene("road", "highway");
add("road", car("rCar", 140, 1130, 800) + Array.from({ length: 8 }, (_, i) => `<div class="streak" id="rk${i}" style="top:${1200 + (i * 53) % 240}px;width:${120 + (i * 37) % 160}px"></div>`).join("")
  + `<div class="dash" id="dsh"><div class="dial"><b>90</b><small>км/ч</small></div><div class="lamp" id="lamp">⚠<small>CHECK</small></div><div class="tape" id="tape"></div></div>`
  + stamp("med", "ЛЕЧЕНИЕ: ИЗОЛЕНТА", 140, 520, "#4cd964", "#151515", 52, -3));
puffs("road", "rp", 6);
const rain = SCN.road.querySelector(".rainfx"), drops = [];
if (rain) for (let i = 0; i < 70; i++) { const d = document.createElement("div");
  d.style.cssText = `position:absolute;width:3px;height:${40 + (i * 13) % 40}px;background:rgba(190,215,240,.45);border-radius:2px`;
  rain.appendChild(d); drops.push([d, (i * 157) % 1180 - 100, (i * 263) % 1920, 900 + (i * 37) % 500]); }
// 7. 17:00, салон: Эдик
scene("dealer", "dealer");
add("dealer", car("dCar", 250, 1150) + `<div class="price" id="price"><small>ТРЕЙД-ИН</small><b id="priceN">180 000</b></div>`
  + stamp("minus", "−60 000 ₽", 230, 640, "#ff3b30", "#fff", 110, -4) + stamp("pp", "ПЕРЕКУПА ПЕРЕКУПИЛИ", 120, 820, "#151515", "#ffd23f", 48, 3));
person("dealer", "tolyan", "t4", -30, 870, .9, 8); person("dealer", "edik", "e", 680, 860, .95);
// 8. 21:00, город: объявление
scene("phone", "city");
add("phone", `<div class="phone" id="phone"><div class="scr"><div class="pic"><img src="../../kit/img/vaz2114/vaz2114_white.png"></div>
  <div class="ttl">ВАЗ-2114</div><div class="pr" id="phPr">390 000 ₽</div>
  <div class="ds"><span id="d1">Один владелец.</span> <span id="d2">Дед.</span><br><span id="d3">Ездил только на дачу.</span></div>
  <div class="sl">Салон «Эдик Моторс» · сегодня</div></div></div>`
  + `<div class="el" id="tree" style="left:700px;top:1260px;font-size:190px;z-index:4;opacity:0">🌳</div><div class="el" id="apl" style="left:790px;top:1300px;font-size:56px;z-index:5;opacity:0">🍎</div>`);
person("phone", "tolyan", "t5", -20, 880, .9, 8);
// 9. снова 05:30: мораль
scene("moral", "night");
add("moral", `<div class="alarm small" id="alarm2">05:30</div>`
  + `<div class="card" id="moralCard" style="top:430px;z-index:20"><h3>ПРОБЕГ — ПО ИСТОРИИ,<br>А НЕ ПО ПРИБОРКЕ</h3>
  <div class="li" id="mo0">📄 Автотека — пробег и владельцы</div><div class="li" id="mo1">📏 Толщиномер — что красили</div><div class="li" id="mo2">🔎 Диагностика — а не изолента</div>
  <div class="rule" id="mo3">🔔 Свежие объявления раньше перекупов — бот «Перехват»</div></div>`);
person("moral", "tolyan", "t6", 600, 1060, .75, 8);

$(".stage").insertAdjacentHTML("beforeend", `<div id="clk" style="opacity:0">06:40</div>`);
TOL.forEach(p => { const s = document.getElementById(p + "-shades"); if (s) s.style.display = ""; });
$("#end h2").innerHTML = E.end;
bubble("g1", "Сынок, дед на ней<br>только <em>на дачу</em> ездил.", 40, 640, 140);
bubble("t1", "А дед<br><em>сейчас где?</em>", 560, 660, 300);
bubble("g2", "На даче.<br><em>Под яблоней.</em>", 40, 660, 140);
bubble("t2", "Михалыч, скрути<br><em>до девяноста.</em>", 40, 640, 140);
bubble("m1", "Скрутить могу.<br>А совесть у тебя<br><em>уже в ноль.</em>", 300, 600, 520);
bubble("t3", "Брат, дед ездил<br><em>только на дачу!</em>", 40, 640, 140);
bubble("s1", "Толщиномер пищит.<br><em>Краска на краске.</em>", 330, 640, 520);
bubble("e1", "Рынок падает.<br><em>Сто двадцать</em> —<br>из уважения.", 330, 600, 520);
bubble("t4", "Брат, ты чё,<br><em>я сам такой!</em>", 40, 660, 140);
bubble("e2", "Поэтому<br><em>и сто двадцать.</em>", 420, 660, 440);

window.build = R => {
  const tl = R.tl, cam = R.camera($("#cam"), { hand: .6 });
  R.grain(.03);
  gsap.set(".scn", { opacity: 0 }); gsap.set("#sc_hook", { opacity: 1 });
  const { pop } = common(R, cam, { mood: (k, t) => k === "galya" ? "grin" : k === "edik" ? (t > st.l7 ? "grin" : "meh") : k === "tolyan" ? "grin" : k === "seryoga" ? (t > st.s1 ? "grin" : "flat") : "meh" });
  // Толяны остальных сцен — те же губы; настроение по сцене
  const tMood = (p, t) => p === "t" && t > W("g2", "яблон") ? "o" : p === "t3" && t > st.s1 ? "nerv" : p === "t4" && t > st.l7 - .2 ? "o" : p === "t5" && t > st.l8b - .2 ? "meh" : "grin";
  R.hooks.push(t => { const f = Math.floor(t * 30), lv = (LIP.tolyan || [])[f] || 0;
    TOL.forEach(p => { if (p !== "t" && document.getElementById(p)) mouth(p, lv > .28 && !(lv < .55 && f % 3 === 2) ? "talk" : tMood(p, t)); });
    if (!(lv > .28)) mouth("t", tMood("t", t)); });
  const swap = (from, to, at, kind = "swipe") => {
    if (kind === "cut") { tl.set(`#sc_${from}`, { opacity: 0 }, at).set(`#sc_${to}`, { opacity: 1, x: 0, filter: "none" }, at); R.sfx("hit", at, .4); return; }
    tl.set(`#sc_${to}`, { opacity: 1, x: 1080, filter: "blur(14px)" }, at)
      .to(`#sc_${from}`, { x: -1080, filter: "blur(14px)", duration: .35, ease: "power3.in" }, at)
      .to(`#sc_${to}`, { x: 0, filter: "blur(0px)", duration: .38, ease: "power3.out" }, at + .12)
      .set(`#sc_${from}`, { opacity: 0, x: 0, filter: "none" }, at + .5);
    R.sfx("whoosh", at, .6);
  };
  // часы дня: щелчок цифр на каждой смене сцены
  const CLK = [];
  R.hooks.push(t => { const c = CLK.filter(([a]) => a <= t).pop(); if (c) $("#clk").textContent = c[1]; });
  const clock = (txt, at) => { CLK.push([at, txt]); tl.fromTo("#clk", { scale: 1.5, opacity: 0 }, { scale: 1, opacity: 1, duration: .25, ease: "back.out(2)", immediateRender: false }, at); R.sfx("tick", at, .8); };
  window.MUSIC = { style: "bed", bpm: 96, end: R.dur - 1.2, mute: [[W("l2", "дед") - .15, W("l2", "дед") + 1.2], [st.l8b - .25, en.l8b + .5]] };
  for (const l of ["g1", "t1", "g2", "t2", "m1", "t3", "s1", "e1", "t4", "e2"]) { const nx = E.lines[E.lines.findIndex(x => x.id === l) + 1]; pop("#b_" + l, st[l] - .05, Math.min(en[l] + .9, st[nx.id] - .1)); }
  const slam = (sel, at, sfx = "impact") => { tl.fromTo(sel, { opacity: 0, scale: 2 }, { opacity: 1, scale: 1, duration: .18, ease: "power4.out", immediateRender: false }, at); R.sfx(sfx, at + .02, .7); };
  const hide = (sel, at) => tl.to(sel, { opacity: 0, duration: .15 }, at);
  const beeps = (from, to, gap0, gap1) => { for (let a = from, k = 0; a < to; k++) { R.sfx("bleep", a, .07); a += Math.max(gap1, gap0 * Math.pow(.88, k)); } };

  // 1. хук: будильник орёт, Толян встаёт, фонарик
  beeps(0, 1.6, .26, .26); R.shake(cam, 0, .8, 1.4);
  tl.fromTo("#alarm1", { scale: 1.12 }, { scale: 1, duration: .13, repeat: 5, yoyo: true, immediateRender: false }, 0);
  tl.fromTo("#T0", { y: 60 }, { y: 0, duration: .5, ease: "back.out(2)", immediateRender: false }, W("h", "встает"));
  tl.to("#torch", { opacity: 1, duration: .1 }, W("h", "потому")).to("#beam", { opacity: 1, duration: .15 }, W("h", "потому")).to("#dark", { opacity: .45, duration: .3 }, W("h", "потому"));
  R.sfx("clack", W("h", "потому"), .8);
  tl.to("#title", { opacity: 0, y: -50, duration: .25 }, W("h", "потому") - .1);
  slam("#chips1", W("h", "сколы"));
  tl.fromTo(cam, { s: 1 }, { s: 1.06, duration: st.g1 - .8, ease: "none", immediateRender: false }, 0).set(cam, { s: 1 }, st.g1 - .6);
  // 2. гаражи
  swap("hook", "garage", st.g1 - .6); clock("06:40", st.g1 - .3);
  tl.to("#gdoor", { scaleY: 0, duration: .6, ease: "power2.in" }, st.g1 - .5); R.sfx("riser", st.g1 - .5, .4);
  tl.fromTo("#gCar", { x: 900 }, { x: 0, duration: 1.1, ease: "power3.out", immediateRender: false }, st.g1 - .4);
  for (let i = 0; i < 5; i++) { const at = st.g1 + .3 + i * .12; gsap.set(`#gd${i}`, { left: 900 + i * 30, top: 1330, width: 70 + i * 10, height: 70 + i * 10 });
    tl.fromTo(`#gd${i}`, { opacity: .9, scale: .4, x: 0, y: 0 }, { opacity: 0, scale: 1.6, x: 60 + i * 20, y: -60, duration: .8, immediateRender: false }, at); }
  const apple = W("g2", "яблон");
  tl.set("#t-shades", { display: "none" }, apple); R.punch(cam, apple, .08); R.sfx("hit", apple + .05, .7);
  tl.fromTo("#T", { rotation: 0 }, { rotation: -4, duration: .2, immediateRender: false }, apple);
  slam("#p180", W("l1", "сто"), "clack"); slam("#apple", W("l1", "яблон"), "pop");
  // 3. СТО: пробег назад
  swap("garage", "sto", st.t2 - .6); clock("09:00", st.t2 - .3);
  tl.to("#m-head", { rotation: 6, duration: .25, yoyo: true, repeat: 3, transformOrigin: "50% 90%" }, st.m1 + .1);
  const back = W("l2", "превратил") - .2;
  tl.fromTo("#odo", { opacity: 0, y: -40 }, { opacity: 1, y: 0, duration: .3, immediateRender: false }, st.l2 - .1);
  R.count($("#odoN"), back, 200000, 90000, 1.3); for (let k = 0; k < 16; k++) R.sfx("tick", back + 1.3 * Math.pow(k / 16, .7), .6);
  R.sfx("riser", back, .5);
  slam("#young", W("l2", "помолод"), "pop");
  tl.to("#odo", { opacity: 0, duration: .2 }, W("l2", "дед") - .1);
  slam("#ded", W("l2", "дед"), "boom"); tl.to("#young", { opacity: 0, duration: .2 }, W("l2", "дед"));
  // 4. мойка
  swap("sto", "wash", st.l3 - .6); clock("11:00", st.l3 - .3);
  tl.fromTo(cam, { s: 1 }, { s: 1.08, duration: st.t3 - st.l3, ease: "none", immediateRender: false }, st.l3).set(cam, { s: 1 }, st.t3 - .6);
  for (let i = 0; i < 26; i++) { const at = st.l3 + .1 + i * .035;
    tl.fromTo(`#fo${i}`, { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: .3, ease: "back.out(2)", immediateRender: false }, at)
      .to(`#fo${i}`, { opacity: 0, y: 120, duration: .4, ease: "power2.in" }, W("l3", "чернен") + i * .02); }
  R.sfx("swish", st.l3 + .1, .7); R.sfx("swish", W("l3", "чернен"), .8);
  for (let i = 0; i < 6; i++) tl.fromTo(`#sh${i}`, { opacity: 0, scale: .2 }, { opacity: 1, scale: 1, duration: .25, yoyo: true, repeat: 1, immediateRender: false }, W("l3", "чернен") + .4 + i * .08);
  R.sfx("ping", W("l3", "чернен") + .5, .5);
  const can = W("l3", "баллон") - .3;
  tl.fromTo("#can", { opacity: 0, x: 80 }, { opacity: 1, x: 0, duration: .25, immediateRender: false }, can)
    .fromTo("#mist", { opacity: 0, scale: .3 }, { opacity: .85, scale: 1, duration: .5, ease: "power2.out", immediateRender: false }, can + .3).to("#mist", { opacity: 0, duration: .5 }, can + 1.1)
    .to("#can", { opacity: 0, duration: .2 }, can + 1.3);
  R.sfx("swish", can + .3, .9);
  slam("#smell", W("l3", "запах"), "pop"); hide("#smell", W("l3", "коврик") - .2);
  tl.fromTo("#matCard", { opacity: 0, y: -60 }, { opacity: 1, y: 0, duration: .3, ease: "back.out(1.6)", immediateRender: false }, W("l3", "коврик") - .1)
    .fromTo("#mat", { y: -260, rotation: -14 }, { y: 0, rotation: 0, duration: .35, ease: "bounce.out", immediateRender: false }, W("l3", "видно"));
  R.sfx("tap", W("l3", "видно") + .2, 1); slam("#mats", W("l3", "под"), "impact");
  // 5. авторынок
  swap("wash", "market", st.t3 - .6); clock("13:00", st.t3 - .3);
  slam("#zip", st.l4 + .1, "pop"); hide("#zip", st.s1 - .3);
  tl.to("#s-gauge", { opacity: 1, duration: .2 }, st.l4 + .2);
  tl.fromTo("#gauge", { opacity: 0, scale: .6 }, { opacity: 1, scale: 1, duration: .25, ease: "back.out(2)", immediateRender: false }, st.s1 - .2);
  R.count($("#gaugeN"), st.s1, 90, 480, en.s1 - st.s1, ""); beeps(st.s1, en.s1 + .3, .35, .07);
  tl.to("#gauge", { backgroundColor: "#ff3b30", duration: .3 }, W("s1", "краска"));
  tl.to("#t3-sweat", { opacity: 1, duration: .2 }, st.s1 + .4).to("#t3-sweat", { y: 30, duration: 1.2, repeat: 1 }, st.s1 + .4);
  hide("#gauge", st.l5 - .1);
  tl.fromTo("#polar", { opacity: 0, rotation: -20, scale: .5 }, { opacity: 1, rotation: -6, scale: 1, duration: .35, ease: "back.out(1.8)", immediateRender: false }, W("l5", "одну") - .2);
  R.sfx("clack", W("l5", "одну"), .7);
  tl.to("#polar", { opacity: 0, duration: .2 }, W("l5", "больше"));
  tl.to("#S", { x: 520, duration: .9, ease: "power2.in" }, W("l5", "больше")); R.sfx("whoosh", W("l5", "больше") + .3, .5);
  // 6. трасса: «чек», изолента, дымок
  swap("market", "road", st.l6 - .6); clock("15:30", st.l6 - .3);
  R.hooks.push(t => { drops.forEach(([d, x, y, v]) => { const yy = (y + t * v) % 2000 - 60; d.style.transform = `translate(${x - yy * .18}px, ${yy}px) rotate(10deg)`; });
    $("#rCar").style.transform = `translateY(${Math.abs(Math.sin(t * 9)) * -6}px) rotate(${Math.sin(t * 7) * .4}deg)`;
    for (let i = 0; i < 8; i++) document.getElementById("rk" + i).style.left = `${1100 - ((t * (900 + i * 120) + i * 300) % 1500)}px`; });
  const chk = W("l6", "загорел") - .1, tape = W("l6", "изолент");
  tl.fromTo("#dsh", { opacity: 0, scale: .7 }, { opacity: 1, scale: 1, duration: .25, ease: "back.out(1.6)", immediateRender: false }, chk - .2);
  for (let k = 0; k < 8 && chk + .1 + k * .3 < tape; k++) { tl.set("#lamp", { opacity: 1 }, chk + .1 + k * .3).set("#lamp", { opacity: .25 }, chk + .25 + k * .3); R.sfx("bleep", chk + .1 + k * .3, .1); }
  tl.set("#lamp", { opacity: 1 }, tape - .05);
  tl.fromTo("#tape", { opacity: 0, scale: 1.8, rotation: -30 }, { opacity: 1, scale: 1, rotation: -12, duration: .14, ease: "power4.out", immediateRender: false }, tape);
  R.sfx("clack", tape, 1); R.shake(cam, tape, .6, .25);
  tl.to("#dsh", { opacity: 0, scale: .8, duration: .25 }, st.l6b - .2);
  slam("#med", st.l6b + .1, "pop");
  for (let i = 0; i < 6; i++) { const at = st.l6b + .2 + i * .3, sz = 60 + i * 12;
    gsap.set(`#rp${i}`, { left: 230, top: 1170, width: sz, height: sz });
    tl.fromTo(`#rp${i}`, { opacity: 0, x: 0, y: 0, scale: .3 }, { opacity: .9, x: 80 + i * 30, y: -150, scale: 1.4, duration: 1, ease: "power2.out", immediateRender: false }, at).to(`#rp${i}`, { opacity: 0, duration: .3 }, at + .8); }
  // 7. салон: цена падает с каждым словом
  swap("road", "dealer", st.e1 - .6); clock("17:00", st.e1 - .3);
  tl.fromTo("#price", { opacity: 0, y: -40 }, { opacity: 1, y: 0, duration: .3, immediateRender: false }, st.e1 - .2);
  R.count($("#priceN"), W("e1", "сложн"), 180000, 150000, .4); R.sfx("clack", W("e1", "сложн"), .7);
  R.count($("#priceN"), W("e1", "падает"), 150000, 120000, .4); R.sfx("clack", W("e1", "падает"), .7);
  tl.to("#price", { backgroundColor: "#ff3b30", duration: .2 }, W("e1", "сто")); R.sfx("hit", W("e1", "сто"), .6);
  tl.to("#e-armR", { rotation: -30, duration: .25, yoyo: true, repeat: 1 }, st.e2);
  hide("#price", st.l7 - .2);
  slam("#minus", W("l7", "минус")); R.shake(cam, W("l7", "минус") + .05, 1, .4); R.flash(W("l7", "минус"), .5, .15);
  slam("#pp", st.l7 + .05, "pop");
  // 8. город: объявление Эдика
  swap("dealer", "phone", st.l8 - .5, "cut"); clock("21:00", st.l8 - .4);
  tl.fromTo("#phone", { y: 900 }, { y: 0, duration: .6, ease: "expo.out", immediateRender: false }, st.l8 - .4); R.sfx("swish", st.l8 - .4, .7);
  tl.fromTo("#phPr", { scale: 1 }, { scale: 1.35, duration: .18, yoyo: true, repeat: 1, immediateRender: false }, W("l8", "трист")); R.sfx("impact", W("l8", "трист"), .7);
  [["#d1", "один"], ["#d2", "дед"], ["#d3", "ездил"]].forEach(([s, w]) => { tl.to(s, { backgroundColor: "#ffd23f", duration: .15 }, W("l8", w)); R.sfx("pop", W("l8", w), .4); });
  tl.to(cam, { s: 1.12, y: -60, duration: en.l8b - st.l8b + 1, ease: "power1.inOut" }, st.l8b - .3).set(cam, { s: 1, y: 0 }, st.rule - .7);
  tl.to("#phone", { x: 760, rotation: 8, duration: .5, ease: "power2.in" }, st.l8b - .3).to("#tree", { opacity: 1, duration: .4 }, st.l8b - .2);
  tl.fromTo("#apl", { opacity: 1, y: 0 }, { opacity: 1, y: 300, duration: .5, ease: "power2.in", immediateRender: false }, en.l8b + .1); R.sfx("tap", en.l8b + .6, .8);
  // 9. снова 05:30
  swap("phone", "moral", st.rule - .7); tl.to("#clk", { opacity: 0, duration: .15 }, st.rule - .7);
  beeps(st.rule - .5, st.rule + .5, .26, .26);
  tl.fromTo("#alarm2", { scale: 1.12 }, { scale: 1, duration: .13, repeat: 3, yoyo: true, immediateRender: false }, st.rule - .5);
  tl.fromTo("#moralCard", { opacity: 0, y: 160 }, { opacity: 1, y: 0, duration: .4, ease: "expo.out", immediateRender: false }, st.rule);
  [W("rule", "истори"), W("rule", "приборк"), W("rule", "приборк") + .5, W("rule", "свеж")].forEach((at, i) => { tl.fromTo(`#mo${i}`, { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: .22, immediateRender: false }, at); R.sfx("pop", at, .5); });
  ending(R, st.end - .15);
};
