// «ЖИЗНЬ ОДНОЙ ПРИОРЫ» — мини-фильм с чёрным юмором: 9 сцен, 6 локаций, переходы, движение.
// Приора сбоку — рисунок владельца (kit/img/priora/priora_*.png), крупно спереди — CHARS.prioraFront.
$("#title .a").textContent = E.rubric; $("#title .b").textContent = E.subtitle; $("#tag span").textContent = "жизнь одной приоры";
$("#title .a").style.fontSize = "76px"; $("#title .b").style.fontSize = "120px";
document.querySelector("#cam > svg#bg")?.remove();
const W = (line, pre, n = 0) => {          // время слова в реплике (по Whisper); нет — начало реплики
  const norm = s => s.toLowerCase().replace(/ё/g, "е").replace(/[^а-я0-9]/g, "");
  const hits = (TT.words[line] || []).filter(w => norm(w[0]).startsWith(norm(pre)));
  return hits[n] ? hits[n][1] : st[line];
};
const IMGSRC = v => `../../kit/img/priora/priora_${v}.png`;
const SCN = {};
function scene(name, bg) {
  const d = document.createElement("div"); d.className = "scn"; d.id = "sc_" + name;
  d.innerHTML = bg ? BGS[bg].replace('id="bg"', `id="bg_${name}"`).replace('id="rainfx"', 'class="rainfx"').replace('id="snowfx"', 'class="snowfx"') : "";
  $("#scene").appendChild(d); SCN[name] = d; return d;
}
const add = (sc, html) => { SCN[sc].insertAdjacentHTML("beforeend", html); };
const car = (id, v, l, t, w = 900, z = 6) => `<img class="pcar${v === "black" ? " dark" : ""}" id="${id}" src="${IMGSRC(v)}" style="left:${l}px;top:${t}px;width:${w}px;z-index:${z}">`;
const person = (sc, kind, p, l, t, s = 1, z = 7) => add(sc, `<div class="c" id="${p.toUpperCase()}" style="left:${l}px;top:${t}px;z-index:${z};transform:scale(${s})">${CHARS[kind](p)}</div>`);
const stamp = (id, text, l, t, bg, fg = "#fff", fs = 60, rot = -4) => `<div class="stamp2" id="${id}" style="left:${l}px;top:${t}px;background:${bg};color:${fg};font-size:${fs}px;transform:rotate(${rot}deg)">${text}</div>`;

// 1. хук: ночной авторынок, «морда» пацанской Приоры
scene("hook", "night");
add("hook", `<div class="el" id="front1" style="left:190px;top:930px;width:700px;height:607px;z-index:6">${CHARS.prioraFront("prf1", { pacan: true, eye: "sly" })}</div>`);
// 2. такси: город едет фоном, Приора-такси на месте, одометр
scene("taxi", null);
add("taxi", `<div id="cityStrip" style="position:absolute;left:0;top:0;width:2160px;height:1920px">${BGS.city.replace('id="bg"', 'style="position:absolute;left:0;top:0"')}${BGS.city.replace('id="bg"', 'style="position:absolute;left:1080px;top:0"')}</div>`
  + car("taxiCar", "yellow", 90, 1040) + `<div class="el" id="tree" style="left:520px;top:1130px;font-size:64px;z-index:7;transform-origin:50% 0">🌲</div>`
  + Array.from({ length: 8 }, (_, i) => `<div class="streak" id="sk${i}" style="top:${1180 + (i * 53) % 260}px;width:${120 + (i * 37) % 160}px"></div>`).join("")
  + stamp("y2014", "2014", 60, 300, "#151515", "#ffd23f", 70) + `<div class="odo" id="odo1" style="top:470px"><small>ОДОМЕТР</small><b id="odo1n">0</b></div>`);
// 3. столб
scene("pole", "city");
add("pole", car("poleCar", "yellow", 0, 1040) + `<div class="el" id="poleS" style="left:840px;top:640px;width:200px;height:700px;z-index:5">${CHARS.pole(false)}</div>`
  + `<div class="el" id="poleB" style="left:840px;top:640px;width:200px;height:700px;z-index:5;opacity:0">${CHARS.pole(true)}</div>`
  + `<div class="el" id="boom" style="left:760px;top:930px;font-size:200px;z-index:9;opacity:0">💥</div>`
  + `<div class="el" id="candle" style="left:960px;top:1240px;font-size:70px;z-index:9;opacity:0">🕯</div>`
  + stamp("y2019", "2019", 60, 300, "#151515", "#ffd23f", 70) + stamp("rip", "СТОЛБ НЕ ВЫЖИЛ", 150, 520, "#ff3b30", "#fff", 62, 3));
// 4. гараж: три куска в одну
scene("garage", "garages");
add("garage", `<div id="gin2" style="position:absolute;left:500px;top:700px;width:200px;height:360px;background:#0c0d10;z-index:1"></div>`
  + `<div id="gdoor2" style="position:absolute;left:500px;top:700px;width:200px;height:360px;background:#3f6e5a;border:6px solid #000;transform-origin:50% 0;z-index:2"></div>`
  + [0, 1, 2].map(i => car("part" + i, "patch", 90, 1060, 900, 6).replace('style="', `style="clip-path:inset(0 ${[66, 33, 0][i]}% 0 ${[0, 33, 66][i]}%);`)).join("")
  + Array.from({ length: 14 }, (_, i) => `<div class="spark" id="sp${i}" style="left:${360 + (i * 47) % 360}px;top:${1120 + (i * 31) % 160}px"></div>`).join("")
  + stamp("two3", "2 ИЗ 3 — ПРИОРЫ", 140, 520, "#ffd23f", "#151515", 62, -3) + stamp("gsk", "ГСК №7", 60, 300, "#151515", "#fff", 56));
// 5. авторынок: тюнинг за 3 секунды, Толян, скрутка пробега
scene("market", "night");
add("market", car("mPatch", "patch", 300, 1110, 760) + car("mWhite", "white", 300, 1110, 760).replace('z-index:6', 'z-index:6;opacity:0')
  + car("mBlack", "black", 300, 1110, 760).replace('z-index:6', 'z-index:6;opacity:0')
  + `<div class="el" id="stkRing" style="left:432px;top:1150px;width:110px;height:110px;border:8px solid #ffd23f;border-radius:50%;z-index:8;opacity:0"></div>`
  + stamp("tTon", "ТОНИРОВКА В НОЛЬ", 400, 820, "#151515", "#fff", 44, -3) + stamp("tLow", "ЗАНИЖЕНИЕ", 520, 900, "#151515", "#fff", 44, 3)
  + stamp("tStk", "НАКЛЕЙКА", 600, 980, "#ffd23f", "#151515", 44, -2)
  + `<div class="odo" id="odo2" style="top:300px"><small>ОДОМЕТР</small><b id="odo2n">400 000</b></div>`
  + stamp("f1", "СВЕЖАЯ КРАСКА", 120, 560, "#4cd964", "#151515", 50, -4) + stamp("f2", "СВЕЖИЙ ПРОБЕГ", 260, 660, "#4cd964", "#151515", 50, 3)
  + stamp("f3", "СВЕЖАЯ БАБУШКА", 140, 760, "#ff3b30", "#fff", 54, -2));
person("market", "tolyan", "t", -420, 870, .95);
// 6. трасса в дождь: умирает
scene("highway", "highway");
add("highway", car("hCar", "black", -900, 1060) + Array.from({ length: 6 }, (_, i) => `<div class="puff2" id="pf${i}"></div>`).join("")
  + stamp("chih", "ЧИХ… ЧИХ…", 560, 560, "#151515", "#fff", 60, -6)
  + `<div class="el" id="tow" style="left:1200px;top:930px;width:1100px;height:420px;z-index:5">${CHARS.tow()}</div>`);
person("highway", "seryoga", "s", -20, 880, .95, 8);
const rain = SCN.highway.querySelector(".rainfx"), drops = [];
for (let i = 0; i < 80; i++) { const d = document.createElement("div");
  d.style.cssText = `position:absolute;width:3px;height:${40 + (i * 13) % 40}px;background:rgba(190,215,240,.5);border-radius:2px`;
  rain.appendChild(d); drops.push([d, (i * 157) % 1180 - 100, (i * 263) % 1920, 900 + (i * 37) % 500]); }
// 7. СТО: «тут легче перечислить, что родное»
scene("sto", "sto");
add("sto", `<div class="el" id="front2" style="left:20px;top:960px;width:640px;height:555px;z-index:6">${CHARS.prioraFront("prf2", { pacan: true, eye: "sad", mouth: "sad", plate: "Р 001 КА" })}</div>`
  + `<div class="chips" id="chips"><h3>НЕ РОДНОЕ:</h3>${["капот", "крыло", "дверь", "бампер", "фары", "пробег"].map((c, i) => `<span class="chip" id="ch${i}">${c} ✗</span>`).join("")}
     <span class="chip ok" id="chOk">номер ✓</span></div>`
  + `<div class="el" id="plateRing" style="left:150px;top:1400px;width:380px;height:110px;border:9px solid #4cd964;border-radius:24px;z-index:8;opacity:0"></div>`);
person("sto", "mihalych", "m", 620, 860, .95);
// 8. круг замкнулся
scene("circle", "night");
add("circle", car("cCar", "black", 300, 1110, 760) + stamp("buy", "КУПИЛ ЗА 150 000", 100, 330, "#151515", "#fff", 54, -3)
  + stamp("sell", "ПРОДАЮ ЗА 650 000", 260, 450, "#ff3b30", "#fff", 54, 3)
  + `<div class="big" id="reborn">ПРИОРА<br>НЕ УМИРАЕТ.<br><span>ОНА<br>ПЕРЕРОЖДАЕТСЯ.</span></div>`);
person("circle", "tolyan", "t2", -10, 870, .95);
// 9. мораль: зима, проверь историю
scene("moral", "winter");
add("moral", car("wCar", "black", 90, 1110) + `<div class="card" id="moralCard" style="top:470px;z-index:20"><h3>ПЕРЕД ПОКУПКОЙ ПРОВЕРЬ</h3>
  <div class="li" id="mo0">📄 Автотека — пробег и история</div><div class="li" id="mo1">📑 ПТС — сколько владельцев</div><div class="li" id="mo2">📏 Толщиномер — что красили</div></div>`);
const snow = SCN.moral.querySelector(".snowfx"), flakes = [];
for (let i = 0; i < 70; i++) { const d = document.createElement("div"); d.className = "snow"; const r = 4 + (i * 7) % 9; d.style.width = d.style.height = r + "px";
  d.style.opacity = .5 + (i % 5) * .1; snow.appendChild(d); flakes.push([d, (i * 137) % 1080, (i * 251) % 1920, 60 + (i * 31) % 90]); }
document.getElementById("t-shades").style.display = ""; document.getElementById("t2-shades").style.display = "";
$("#over").insertAdjacentHTML("beforeend", `<div id="rew"><b>⏪</b></div>`);
$("#end h2").innerHTML = E.end;
bubble("t1", "Брат, одна хозяйка!<br><em>Бабушка, в церковь!</em>", 40, 640, 140);
bubble("s1", "Ну ты чего,<br><em>родная?!</em>", 60, 700, 120);
bubble("m1", "Тут легче перечислить,<br><em>что родное…</em>", 230, 650, 560);
bubble("m2", "Номер.<br><em>Номер родной.</em>", 420, 650, 380);
bubble("t2", "Одна хозяйка! Не бита,<br>не крашена! <em>650, брат.</em>", 40, 640, 140);

window.build = R => {
  const tl = R.tl, cam = R.camera($("#cam"), { hand: .6 });
  R.grain(.03);
  gsap.set(".scn", { opacity: 0 }); gsap.set("#sc_hook", { opacity: 1 });
  const { pop } = common(R, cam, { mood: (k, t) => k === "tolyan" ? "grin" : k === "seryoga" ? "o" : "flat" });
  R.hooks.push(t => { const f = Math.floor(t * 30), lv = (LIP.tolyan || [])[f] || 0;     // второй Толян — те же губы
    mouth("t2", lv > .28 && !(lv < .55 && f % 3 === 2) ? "talk" : "grin"); });
  // смена сцен: «свайп» (уходящая влево со смазом, новая справа) или жёсткая склейка
  const swap = (from, to, at, kind = "swipe") => {
    if (kind === "cut") { tl.set(`#sc_${from}`, { opacity: 0 }, at).set(`#sc_${to}`, { opacity: 1, x: 0, filter: "none" }, at); R.sfx("hit", at, .4); return; }
    tl.set(`#sc_${to}`, { opacity: 1, x: 1080, filter: "blur(14px)" }, at)
      .to(`#sc_${from}`, { x: -1080, filter: "blur(14px)", duration: .35, ease: "power3.in" }, at)
      .to(`#sc_${to}`, { x: 0, filter: "blur(0px)", duration: .38, ease: "power3.out" }, at + .12)
      .set(`#sc_${from}`, { opacity: 0, x: 0, filter: "none" }, at + .5);
    R.sfx("whoosh", at, .6);
  };
  // музыка тише всего, в «драме» на трассе — тишина и дождь
  window.MUSIC = { style: "bed", bpm: 92, end: R.dur - 1.2, mute: [[W("l5", "посреди") - .1, en.s1 + .3], [st.l2b - 1.1, st.l2b + .1]] };
  pop_lines(); function pop_lines() { for (const l of ["t1", "s1", "m1", "m2", "t2"]) { const nx = E.lines[E.lines.findIndex(x => x.id === l) + 1]; pop("#b_" + l, st[l] - .05, Math.min(en[l] + .9, st[nx.id] - .1)); } }
  const slam = (sel, at, sfx = "impact") => { tl.fromTo(sel, { opacity: 0, scale: 2 }, { opacity: 1, scale: 1, duration: .18, ease: "power4.out", immediateRender: false }, at); R.sfx(sfx, at + .02, .7); };
  const hide = (sel, at) => tl.to(sel, { opacity: 0, duration: .15 }, at);

  // 1. хук
  R.punch(cam, .05, .03);
  tl.fromTo("#front1", { scale: .85, y: 60 }, { scale: 1.05, y: 0, duration: st.l1 - .5, ease: "none", immediateRender: false }, 0);
  tl.to("#title", { opacity: 0, y: -50, duration: .25 }, st.l1 - .7);
  R.sfx("ping", W("h", "пять"), .6);
  // 2. такси
  swap("hook", "taxi", st.l1 - .5);
  tl.fromTo("#cityStrip", { x: 0 }, { x: -1080 * 4, duration: st.l2a - st.l1 + 1, ease: "none", immediateRender: false }, st.l1 - .5);
  R.hooks.push(t => { const x = gsap.getProperty("#cityStrip", "x"); $("#cityStrip").style.transform = `translateX(${((x % 1080) + 1080) % 1080 - 1080}px)`;
    $("#taxiCar").style.transform = `translateY(${Math.abs(Math.sin(t * 9)) * -6}px) rotate(${Math.sin(t * 7) * .5}deg)`;
    $("#tree").style.transform = `rotate(${Math.sin(t * 6) * 14}deg)`;
    for (let i = 0; i < 8; i++) { const d = document.getElementById("sk" + i); d.style.left = `${1100 - ((t * (900 + i * 120) + i * 300) % 1500)}px`; } });
  slam("#y2014", st.l1 + .1);
  tl.fromTo("#odo1", { opacity: 0, y: -40 }, { opacity: 1, y: 0, duration: .3, immediateRender: false }, W("l1", "четыреста") - .3);
  { const o = { v: 0 }; tl.fromTo(o, { v: 0 }, { v: 400000, duration: 1.6, ease: "power2.in", immediateRender: false,
      onUpdate: () => { $("#odo1n").textContent = Math.round(o.v / 1000) * 1000 === 0 ? "0" : (Math.round(o.v / 1000) * 1000).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " "); } }, W("l1", "четыреста"));
    for (let k = 0; k < 14; k++) R.sfx("tick", W("l1", "четыреста") + 1.6 * Math.pow(k / 14, .6), .5); }
  tl.fromTo("#tree", { scale: 1 }, { scale: 1.6, duration: .2, yoyo: true, repeat: 1, immediateRender: false }, W("l1", "елочка"));
  // 3. столб: разгон, удар, тишина, «столб не выжил»
  swap("taxi", "pole", st.l2a - .6);
  slam("#y2019", st.l2a);
  const hit = en.l2a + .5;
  gsap.set("#poleCar", { x: -1000 });
  tl.fromTo("#poleCar", { x: -1000 }, { x: 0, duration: hit - (st.l2a - .3), ease: "power2.in", immediateRender: false }, st.l2a - .3);
  tl.to("#poleCar", { rotation: 6, x: -40, duration: .25, ease: "back.out(3)" }, hit);
  tl.set("#poleS", { opacity: 0 }, hit).set("#poleB", { opacity: 1 }, hit);
  tl.fromTo("#boom", { opacity: 0, scale: .3 }, { opacity: 1, scale: 1.2, duration: .15, immediateRender: false }, hit).to("#boom", { opacity: 0, duration: .4 }, hit + .5);
  R.sfx("boom", hit, 1); R.sfx("impact", hit, 1); R.shake(cam, hit, 1.6, .7); R.flash(hit, .8, .25);
  slam("#rip", st.l2b - .05, "hit"); tl.to("#candle", { opacity: 1, duration: .4 }, st.l2b + .4);
  // 4. гараж
  swap("pole", "garage", st.l3 - .6);
  slam("#gsk", st.l3 - .2, "pop");
  tl.to("#gdoor2", { scaleY: 0, duration: .5, ease: "power2.in" }, st.l3 - .2); R.sfx("riser", st.l3 - .2, .4);
  tl.fromTo("#part0", { x: -700 }, { x: 0, duration: .5, ease: "power3.out", immediateRender: false }, W("l3", "собрали"))
    .fromTo("#part1", { y: -900 }, { y: 0, duration: .5, ease: "bounce.out", immediateRender: false }, W("l3", "собрали") + .3)
    .fromTo("#part2", { x: 800 }, { x: 0, duration: .5, ease: "power3.out", immediateRender: false }, W("l3", "собрали") + .6);
  R.sfx("clack", W("l3", "собрали") + .45, .8); R.sfx("clack", W("l3", "собрали") + .8, .8); R.sfx("clack", W("l3", "собрали") + 1.1, .8);
  for (let i = 0; i < 14; i++) { const at = W("l3", "трех") + i * .12;
    tl.fromTo(`#sp${i}`, { opacity: 1, x: 0, y: 0, scale: 1 }, { opacity: 0, x: (i % 2 ? 1 : -1) * (40 + i * 7), y: -60 - i * 6, scale: .3, duration: .5, immediateRender: false }, at); }
  R.sfx("glitch", W("l3", "трех"), .6); R.flash(W("l3", "трех") + .2, .5, .12);
  slam("#two3", W("l3", "две"));
  // 5. авторынок: тюнинг по словам
  swap("garage", "market", st.l4 - .6);
  tl.to("#mPatch", { opacity: 0, duration: .25 }, W("l4", "взялся")).to("#mWhite", { opacity: 1, duration: .25 }, W("l4", "взялся"));
  R.flash(W("l4", "взялся"), .5, .15); R.sfx("swish", W("l4", "взялся"), .6);
  tl.to("#mWhite", { opacity: 0, duration: .3 }, W("l4", "тонир")).to("#mBlack", { opacity: 1, duration: .3 }, W("l4", "тонир"));
  slam("#tTon", W("l4", "тонир"), "pop");
  tl.to("#mBlack", { y: 22, duration: .2, ease: "power4.in" }, W("l4", "заниж")).to("#mBlack", { y: 14, duration: .3, ease: "elastic.out(1,.4)" }, W("l4", "заниж") + .2);
  slam("#tLow", W("l4", "заниж"), "boom");
  tl.fromTo("#stkRing", { opacity: 1, scale: 2 }, { opacity: 1, scale: 1, duration: .25, ease: "back.out(2)", immediateRender: false }, W("l4", "наклей"))
    .to("#stkRing", { opacity: 0, duration: .3 }, W("l4", "наклей") + 1.2);
  slam("#tStk", W("l4", "наклей"), "ping");
  hide("#tTon, #tLow, #tStk", st.t1 - .3);
  tl.to("#T", { left: -10, duration: .5, ease: "back.out(1.3)" }, st.t1 - .6); R.sfx("whoosh", st.t1 - .6, .5);
  tl.fromTo("#odo2", { opacity: 0, y: -40 }, { opacity: 1, y: 0, duration: .3, immediateRender: false }, en.t1 - .4);
  { const o = { v: 400000 }; tl.fromTo(o, { v: 400000 }, { v: 89000, duration: 1.2, ease: "power2.out", immediateRender: false,
      onUpdate: () => { $("#odo2n").textContent = (Math.round(o.v / 1000) * 1000).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " "); } }, en.t1 - .1);
    R.sfx("riser", en.t1 - .1, .5); }
  hide("#odo2", st.l4b + .2);
  slam("#f1", W("l4b", "краска") - .15, "pop"); slam("#f2", W("l4b", "пробег") - .15, "pop"); slam("#f3", W("l4b", "бабушка") - .15, "impact");
  // 6. трасса: умирает в дождь
  swap("market", "highway", st.l5 - .7);
  R.hooks.push(t => drops.forEach(([d, x, y, v]) => { const yy = (y + t * v) % 2000 - 60; d.style.transform = `translate(${x - yy * .18}px, ${yy}px) rotate(10deg)`; }));
  tl.fromTo("#hCar", { x: 0 }, { x: 1020, duration: 1.4, ease: "power2.out", immediateRender: false }, st.l5 - .3);
  const die = W("l5", "умереть");
  tl.to("#hCar", { x: 1000, duration: .08, yoyo: true, repeat: 7 }, die);
  R.sfx("boom", die + .1, .4); R.sfx("boom", die + .6, .3);
  for (let i = 0; i < 6; i++) { const at = die + .2 + i * .35, sz = 80 + i * 14;
    gsap.set(`#pf${i}`, { left: 880, top: 1080, width: sz, height: sz });
    tl.fromTo(`#pf${i}`, { opacity: 0, x: 0, y: 0, scale: .3 }, { opacity: 1, x: -40 - i * 12, y: -170, scale: 1.4, duration: 1, ease: "power2.out", immediateRender: false }, at)
      .to(`#pf${i}`, { opacity: 0, duration: .3 }, at + .8); }
  slam("#chih", die + .3, "pop"); hide("#chih", W("l5", "драме"));
  tl.to(cam, { s: .9, duration: 2.5, ease: "power1.inOut" }, W("l5", "посреди")).to(cam, { s: 1, duration: .4 }, en.s1 + .6);
  // эвакуатор утаскивает → жёсткая склейка на СТО
  const tow = en.s1 + .4;
  tl.fromTo("#tow", { x: 0 }, { x: -1250, duration: 1.1, ease: "power2.in", immediateRender: false }, tow);
  tl.to("#hCar", { x: -900, duration: .9, ease: "power2.in" }, tow + .45);
  R.sfx("riser", tow, .6);
  swap("highway", "sto", st.m1 - .35, "cut");
  // 7. СТО
  tl.fromTo("#chips", { opacity: 0, y: -60 }, { opacity: 1, y: 0, duration: .3, ease: "back.out(1.6)", immediateRender: false }, st.m1 + .2);
  for (let i = 0; i < 6; i++) { const at = st.m1 + .7 + i * .28; tl.fromTo(`#ch${i}`, { opacity: 0, scale: 1.8 }, { opacity: 1, scale: 1, duration: .14, immediateRender: false }, at); R.sfx("clack", at, .6); }
  tl.to("#m-armR", { rotation: -50, duration: .25 }, st.m2 - .2);
  tl.fromTo("#chOk", { opacity: 0, scale: 2.2 }, { opacity: 1, scale: 1, duration: .2, ease: "power4.out", immediateRender: false }, W("m2", "родной"));
  tl.fromTo("#plateRing", { opacity: 0, scale: 1.4 }, { opacity: 1, scale: 1, duration: .25, ease: "back.out(2)", immediateRender: false }, W("m2", "номер")); R.sfx("ping", W("m2", "номер"), .7);
  R.sfx("impact", W("m2", "родной"), .6);
  // 8. круг замкнулся + «перемотка»
  swap("sto", "circle", st.l6 - .6);
  slam("#buy", W("l6", "150") > st.l6 ? W("l6", "150") : en.l6 - 1, "clack");
  slam("#sell", st.t2 + 1.2, "impact");
  const rw = en.t2 + .4, seq = ["highway", "market", "garage", "pole", "taxi"];
  tl.set("#rew", { opacity: 1 }, rw).set("#rew", { opacity: 0 }, rw + seq.length * .28);
  seq.forEach((s, i) => { tl.set(`#sc_${s}`, { opacity: 1, x: 0, filter: "hue-rotate(40deg) contrast(1.3) blur(1px)", zIndex: 5 }, rw + i * .28)
    .set(`#sc_${s}`, { opacity: 0, filter: "none", zIndex: 0 }, rw + (i + 1) * .28); R.sfx("glitch", rw + i * .28, .4); });
  hide("#buy, #sell", rw);
  tl.fromTo("#reborn", { opacity: 0, scale: 1.6 }, { opacity: 1, scale: 1, duration: .3, ease: "power4.out", immediateRender: false }, st.l7 + .1)
    .to("#reborn", { opacity: 0, duration: .2 }, st.rule - .4);
  R.sfx("impact", st.l7 + .12, .9); R.shake(cam, st.l7 + .15, .6, .3);
  // 9. мораль
  swap("circle", "moral", st.rule - .5);
  R.hooks.push(t => flakes.forEach(([d, x, y, v]) => { d.style.transform = `translate(${x + Math.sin(t * .8 + y) * 30}px, ${(y + t * v) % 1960 - 40}px)`; }));
  tl.fromTo("#moralCard", { opacity: 0, y: 160 }, { opacity: 1, y: 0, duration: .4, ease: "expo.out", immediateRender: false }, st.rule);
  [0, 1, 2].forEach(i => { const at = [W("rule", "автотек"), W("rule", "птс"), W("rule", "толщ")][i];
    tl.fromTo(`#mo${i}`, { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: .22, immediateRender: false }, at); R.sfx("pop", at, .5); });
  tl.to("#wCar", { x: 1300, duration: 2.2, ease: "power2.in" }, st.end - 1.2);
  ending(R, st.end - .15);
};
