// «ПЕРВЫЙ СНЕГ» — 8 сцен, 4 новые локации (салон, шиномонтаж, яма, кювет) и новые ракурсы: из-за руля, из багажника, макро шины, снизу из ямы.
// Машины: белая ВАЗ-2114 (Вика, из ep15), чёрная Приора Толяна (ep14), вишнёвая девятка владельца (kit/img/vaz2109).
$("#title .a").textContent = E.rubric; $("#title .b").textContent = E.subtitle; $("#tag span").textContent = "первый снег";
$("#title .a").style.cssText = "font-size:84px;background:#fff"; $("#title .b").style.cssText = "font-size:120px;background:#2e86de";
document.querySelector("#cam > svg#bg")?.remove();
const W = (line, pre, n = 0) => {
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
const IMG = { vaz14: "../../kit/img/vaz2114/vaz2114_white.png", priora: "../../kit/img/priora/priora_black.png", vaz09: "../../kit/img/vaz2109/vaz2109.png" };
const car = (id, k, l, t, w, z = 6, extra = "") => `<img class="pcar${k === "priora" ? " dark" : ""}" id="${id}" src="${IMG[k]}" style="left:${l}px;top:${t}px;width:${w}px;z-index:${z};${extra}">`;
const person = (sc, kind, p, l, t, s = 1, z = 7) => add(sc, `<div class="c" id="${p.toUpperCase()}" style="left:${l}px;top:${t}px;z-index:${z};transform:scale(${s})">${CHARS[kind](p)}</div>`);
const stamp = (id, text, l, t, bg, fg = "#fff", fs = 60, rot = -4) => `<div class="stamp2" id="${id}" style="left:${l}px;top:${t}px;background:${bg};color:${fg};font-size:${fs}px;transform:rotate(${rot}deg)">${text}</div>`;
const drift = (id, l, t, w, h, z = 8) => `<div class="el" id="${id}" style="left:${l}px;top:${t}px;width:${w}px;height:${h}px;z-index:${z}"><svg viewBox="0 0 400 120" preserveAspectRatio="none"><path d="M0 120 C10 70 50 50 90 62 C120 26 180 18 220 48 C260 22 320 30 350 62 C380 70 398 96 400 120 Z" fill="#eef3fa" stroke="#000" stroke-width="6" vector-effect="non-scaling-stroke"/><path d="M60 90 q40 -18 80 0 M240 84 q40 -16 80 0" stroke="#bcc8da" stroke-width="5" fill="none" vector-effect="non-scaling-stroke"/></svg></div>`;
const wipers = p => `<div class="wiper" id="${p}w1" style="left:150px;top:1102px"></div><div class="wiper" id="${p}w2" style="left:560px;top:1102px"></div>`;
const TREAD = `<svg viewBox="0 0 960 600"><rect x="0" y="0" width="960" height="600" rx="60" fill="#1c1c20" stroke="#000" stroke-width="10"/>
  ${[0, 1, 2, 3, 4, 5, 6].map(i => `<path d="M${-40 + i * 150} 0 l70 150 l-70 150 l70 150 l-70 150" stroke="#0b0b0d" stroke-width="34" fill="none"/>`).join("")}
  <path d="M0 300 H960" stroke="#0b0b0d" stroke-width="30"/>${[[180, 120], [560, 420], [770, 200], [330, 500]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="13" fill="#b9bfca" stroke="#000" stroke-width="4"/>`).join("")}</svg>`;
const COIN = `<svg viewBox="0 0 260 260"><circle cx="130" cy="130" r="122" fill="#d4a93a" stroke="#000" stroke-width="9"/><circle cx="130" cy="130" r="98" fill="none" stroke="#a37c1f" stroke-width="6"/>
  <text x="130" y="170" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="110" fill="#7a5a10">10</text></svg>`;
const SIDE = `<svg viewBox="0 0 1000 600"><circle cx="500" cy="900" r="860" fill="#232327" stroke="#000" stroke-width="10"/><circle cx="500" cy="900" r="640" fill="#8b929c" stroke="#000" stroke-width="10"/>
  <circle cx="500" cy="900" r="610" fill="none" stroke="#5c626b" stroke-width="20"/><circle cx="500" cy="900" r="820" fill="none" stroke="#2d2d33" stroke-width="10"/>
  <text x="500" y="168" text-anchor="middle" font-family="JetBrains Mono" font-weight="800" font-size="72" fill="#4a4a52" stroke="#111" stroke-width="2">DOT X3 BV 2312</text>
  <text x="500" y="232" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="38" fill="#45454c">WINTER · 195/65 R15</text></svg>`;
// колесо в багажнике: шина с шипами, 4 оставшихся подсвечиваются
const STUDS = Array.from({ length: 18 }, (_, i) => [Math.cos(i / 18 * 6.283) * 200, Math.sin(i / 18 * 6.283) * 200]);
const WHEEL = `<svg viewBox="-260 -260 520 520"><circle r="250" fill="#1c1c20" stroke="#000" stroke-width="10"/><circle r="140" fill="#8b929c" stroke="#000" stroke-width="10"/><circle r="40" fill="#5c626b" stroke="#000" stroke-width="6"/>
  ${STUDS.map(([x, y], i) => `<circle id="stud${i}" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="11" fill="${[2, 7, 11, 15].includes(i) ? "#b9bfca" : "#0d0d0f"}" stroke="#000" stroke-width="3"/>`).join("")}</svg>`;

// 1. из-за руля, первый снег
scene("hook", "interior"); add("hook", wipers("h"));
// 2. шиномонтаж: очередь, Вика с четыркой
scene("queue", "tireshop");
add("queue", car("qCar", "vaz14", 240, 1190, 640) + stamp("half1", "ПОЛГОРОДА — В ОЧЕРЕДИ", 60, 400, "#151515", "#fff", 46, -3)
  + stamp("half2", "ВТОРАЯ ПОЛОВИНА — В КЮВЕТЕ", 90, 510, "#ff3b30", "#fff", 42, 2)
  + stamp("same", "ТА САМАЯ ЧЕТЫРКА ↓", 200, 1020, "#ffd23f", "#151515", 44, -3) + stamp("ded", "ОДИН ВЛАДЕЛЕЦ, ДЕД", 120, 1110, "#151515", "#fff", 34, 2));
person("queue", "vika", "v", 740, 900, .9);
// 3. из багажника: крышка, Толян, колесо с четырьмя шипами
scene("trunk", "tireshop");
add("trunk", `<div class="trunkframe"></div><div class="trunkfloor"></div><div class="el" id="wheel" style="left:300px;top:1420px;width:480px;height:480px;z-index:9">${WHEEL}</div>`
  + `<div id="lid" style="position:absolute;inset:0;background:#0b0b0d;z-index:12"></div>` + stamp("studs", "ШИПОВ: <span id=\"studN\">0</span>", 600, 1300, "#ffd23f", "#151515", 54, -4));
person("trunk", "tolyan", "t", 330, 820, 1.05, 5);
// 4. макро: протектор и монетка
scene("coin", "tireshop");
add("coin", `<div id="coinBlur" style="position:absolute;inset:0;backdrop-filter:blur(10px);background:rgba(10,12,18,.35);z-index:4"></div>`
  + `<div class="el" id="tread" style="left:60px;top:820px;width:960px;height:595px;z-index:5">${TREAD}</div>`
  + `<div class="el" id="coinC" style="left:360px;top:880px;width:240px;height:240px;z-index:6">${COIN}</div><div class="el" style="left:330px;top:1080px;width:300px;height:80px;background:#0b0b0d;z-index:7"></div>`
  + `<div class="ruler" id="ruler"><i style="top:0">0</i><i style="top:33%">2 мм</i><i style="top:66%">4 мм</i><b id="rulerMark"></b></div>`
  + stamp("mm", "2 ММ · ЗИМОЙ НУЖНО ОТ 4", 100, 1480, "#ff3b30", "#fff", 44, -2) + stamp("hope", "+ НАДЕЖДА", 560, 1580, "#151515", "#ffd23f", 44, 3));
// 5. макро: боковина, год
scene("side", "tireshop");
add("side", `<div style="position:absolute;inset:0;backdrop-filter:blur(10px);background:rgba(10,12,18,.35);z-index:4"></div>`
  + `<div class="el" id="sideW" style="left:40px;top:900px;width:1000px;height:600px;z-index:5">${SIDE}</div>`
  + `<div class="el" id="ring" style="left:650px;top:990px;width:250px;height:110px;border:9px solid #ffd23f;border-radius:50%;z-index:8;opacity:0"></div>`
  + stamp("y2012", "23-Я НЕДЕЛЯ 2012-ГО", 170, 1560, "#ffd23f", "#151515", 46, -3) + stamp("cognac", "КАК КОНЬЯК 🥃", 560, 1660, "#151515", "#fff", 46, 3)
  + stamp("oak", "ДУБОВАЯ 🪵", 300, 1700, "#ff3b30", "#fff", 60, -4));
// 6. из ямы: днище над головой, ржавчина сыплется
scene("pit", "pit");
add("pit", Array.from({ length: 16 }, (_, i) => `<div class="rust" id="ru${i}" style="left:${200 + (i * 53) % 680}px;top:${300 + (i * 37) % 300}px"></div>`).join("")
  + `<div class="drop" id="drop"></div>` + stamp("rip", "ДНИЩЕ: 🕯", 560, 1240, "#151515", "#fff", 50, 3));
person("pit", "mihalych", "m", 330, 880, 1.05, 5);
// 7. кювет: Приора Толяна, потом девятка
scene("ditch", "ditch");
add("ditch", car("dPri", "priora", 590, 1150, 540, 5) + drift("dr1", 540, 1280, 600, 130, 6)
  + car("d09", "vaz09", 230, 1090, 440, 5) + drift("dr2", 200, 1260, 520, 120, 6)
  + stamp("clr", "КЛИРЕНС: 0", 520, 860, "#ffd23f", "#151515", 50, 4) + stamp("two", "В КЮВЕТЕ: 2", 140, 520, "#ff3b30", "#fff", 56, -3));
person("ditch", "tolyan", "t2", -60, 900, .9, 9);
// 8. мораль: снова из-за руля
scene("moral", "interior"); add("moral", wipers("m") + `<div class="card" id="moralCard" style="top:330px;z-index:20"><h3>ЗИМНЯЯ РЕЗИНА</h3>
  <div class="li" id="mo0">🪙 Протектор — от 4 мм</div><div class="li" id="mo1">📅 Год — 4 цифры на боковине</div><div class="li" id="mo2">🔩 Шипы — считай до покупки</div>
  <div class="rule" id="mo3">🔔 Машины без перекупов — бот «Перехват»</div></div>`);
// снег во всех уличных сценах
const flakes = [];
$$(".snowfx").forEach((sn, k) => { for (let i = 0; i < 60; i++) { const d = document.createElement("div"); d.className = "snow"; const r = 4 + (i * 7) % 9;
  d.style.width = d.style.height = r + "px"; d.style.opacity = .5 + (i % 5) * .1; sn.appendChild(d); flakes.push([d, (i * 137 + k * 50) % 1080, (i * 251) % 1920, 60 + (i * 31) % 90]); } });
["t", "t2"].forEach(p => { const s = document.getElementById(p + "-shades"); if (s) s.style.display = ""; });
$("#end h2").innerHTML = E.end;
bubble("t1", "Зимняя резина, почти новая!<br><em>Шипы — как родные!</em>", 60, 640, 420);
bubble("v1", "Толян, монетка торчит<br>целиком. <em>Тут протектора нет.</em>", 60, 560, 160);
bubble("v2", "Двенадцатый год.<br><em>Она старше моего стажа.</em>", 60, 640, 160);
bubble("t2", "Сестрёнка, выдержанная,<br><em>как коньяк!</em>", 120, 640, 600);
bubble("m1", "Резину поменяем.<br>А вот днище, дочка,<br><em>только отпевать.</em>", 60, 380, 420);
bubble("v3", "Продавали — один<br>владелец, <em>дед…</em>", 380, 640, 500);
bubble("m2", "Ну вот.<br><em>Оба отъездились.</em>", 120, 420, 420);
bubble("t3", "Брат…<br><em>вытащи, а?</em>", 40, 640, 140);

window.build = R => {
  const tl = R.tl, cam = R.camera($("#cam"), { hand: .6 });
  R.grain(.03);
  gsap.set(".scn", { opacity: 0 }); gsap.set("#sc_hook", { opacity: 1 });
  const { pop } = common(R, cam, { mood: (k, t) => k === "vika" ? (t > st.v3 ? "o" : "meh") : k === "tolyan" ? "grin" : "meh" });
  R.hooks.push(t => { const f = Math.floor(t * 30), lv = (LIP.tolyan || [])[f] || 0;
    if (document.getElementById("t2")) mouth("t2", lv > .28 && !(lv < .55 && f % 3 === 2) ? "talk" : "meh");
    flakes.forEach(([d, x, y, v]) => { d.style.transform = `translate(${x + Math.sin(t * .8 + y) * 30}px, ${(y + t * v) % 1960 - 40}px)`; }); });
  const swap = (from, to, at, kind = "swipe") => {
    if (kind === "cut") { tl.set(`#sc_${from}`, { opacity: 0 }, at).set(`#sc_${to}`, { opacity: 1, x: 0, filter: "none" }, at); R.sfx("hit", at, .4); return; }
    tl.set(`#sc_${to}`, { opacity: 1, x: 1080, filter: "blur(14px)" }, at)
      .to(`#sc_${from}`, { x: -1080, filter: "blur(14px)", duration: .35, ease: "power3.in" }, at)
      .to(`#sc_${to}`, { x: 0, filter: "blur(0px)", duration: .38, ease: "power3.out" }, at + .12)
      .set(`#sc_${from}`, { opacity: 0, x: 0, filter: "none" }, at + .5);
    R.sfx("whoosh", at, .6);
  };
  const wipe = (p, at) => { [1, 2].forEach(k => tl.fromTo(`#${p}w${k}`, { rotation: -8 }, { rotation: -78, duration: .32, yoyo: true, repeat: 1, ease: "power1.inOut", immediateRender: false }, at)); R.sfx("swish", at, .5); };
  window.MUSIC = { style: "bed", bpm: 90, end: R.dur - 1.2, mute: [[en.v3 + .1, en.m2 + .6], [en.l5 + .3, en.t3 + .8]] };
  for (const l of ["t1", "v1", "v2", "t2", "m1", "v3", "m2", "t3"]) { const nx = E.lines[E.lines.findIndex(x => x.id === l) + 1]; pop("#b_" + l, st[l] - .05, Math.min(en[l] + .9, st[nx.id] - .1)); }
  const slam = (sel, at, sfx = "impact") => { tl.fromTo(sel, { opacity: 0, scale: 2 }, { opacity: 1, scale: 1, duration: .18, ease: "power4.out", immediateRender: false }, at); R.sfx(sfx, at + .02, .7); };
  const hide = (sel, at) => tl.to(sel, { opacity: 0, duration: .15 }, at);

  // 1. из-за руля: дворники на каждом ударе, на «урожай» смахивают титр
  R.hooks.push(t => { if (t < st.q1) $("#cam").style.transform += ` translateY(${Math.sin(t * 13) * 2}px)`; });
  wipe("h", .2); wipe("h", W("h", "внезап")); wipe("h", W("h", "урожай") - .1);
  tl.to("#title", { x: -900, rotation: -12, opacity: 0, duration: .35, ease: "power2.in" }, W("h", "урожай") + .1);
  // 2. очередь
  swap("hook", "queue", st.q1 - .6);
  tl.fromTo(cam, { s: 1 }, { s: 1.07, duration: st.t1 - st.q1, ease: "none", immediateRender: false }, st.q1).set(cam, { s: 1 }, st.t1 - .7);
  slam("#half1", W("q1", "полгор"), "pop"); slam("#half2", W("q1", "втора"), "impact");
  hide("#half1, #half2", st.q2 - .1);
  tl.fromTo("#qCar", { x: -900 }, { x: 0, duration: .8, ease: "power3.out", immediateRender: false }, st.q2 - .4);
  tl.fromTo("#V", { x: 500 }, { x: 0, duration: .6, ease: "back.out(1.4)", immediateRender: false }, st.q2);
  slam("#same", W("q2", "четырк"), "pop"); slam("#ded", W("q2", "владел"), "clack");
  // 3. из багажника: темнота, крышка уезжает вверх, Толян раскидывает руки, шипы считаются
  swap("queue", "trunk", st.t1 - .7, "cut");
  tl.fromTo("#lid", { y: 0 }, { y: -1920, duration: .55, ease: "power2.inOut", immediateRender: false }, st.t1 - .5); R.sfx("riser", st.t1 - .5, .5); R.flash(st.t1 - .1, .4, .2);
  tl.to("#t-armL", { rotation: 40, duration: .3 }, st.t1).to("#t-armR", { rotation: -40, duration: .3 }, st.t1);
  [2, 7, 11, 15].forEach((s, i) => { const at = W("l1", "четыр") + i * .22;
    tl.fromTo(`#stud${s}`, { attr: { r: 11 } }, { attr: { r: 26 }, fill: "#ffd23f", duration: .15, immediateRender: false }, at); R.sfx("ping", at, .5); });
  R.hooks.push(t => { const at0 = W("l1", "четыр"); $("#studN").textContent = t < at0 ? "?" : Math.min(4, 1 + Math.floor((t - at0) / .22)); });
  slam("#studs", W("l1", "четыр") - .2, "pop");
  tl.fromTo("#wheel", { rotation: 0 }, { rotation: 40, duration: st.v1 - st.t1, ease: "none", immediateRender: false }, st.t1);
  // 4. монетка
  swap("trunk", "coin", st.v1 - .5);
  tl.fromTo("#coinC", { y: -500 }, { y: 0, duration: .5, ease: "bounce.out", immediateRender: false }, st.v1 - .2); R.sfx("clack", st.v1 + .2, .9);
  tl.fromTo("#ruler", { opacity: 0, x: 80 }, { opacity: 1, x: 0, duration: .3, immediateRender: false }, st.l2 - .2);
  tl.fromTo("#rulerMark", { height: "0%" }, { height: "33%", duration: .5, immediateRender: false }, W("l2", "тут"));
  slam("#mm", W("l2", "четыр"), "pop"); slam("#hope", W("l2", "надежд"), "impact");
  // 5. боковина: панорама, код года, «тук-тук»
  swap("coin", "side", st.v2 - .6);
  tl.fromTo("#sideW", { x: 320 }, { x: -60, duration: st.l4 - st.v2, ease: "none", immediateRender: false }, st.v2 - .4);
  tl.fromTo("#ring", { opacity: 0, scale: 1.6 }, { opacity: 1, scale: 1, duration: .25, ease: "back.out(2)", immediateRender: false }, W("v2", "двенадц")); R.sfx("ping", W("v2", "двенадц"), .7);
  slam("#y2012", W("v2", "двенадц") + .3, "pop"); hide("#y2012", st.t2 - .1);
  slam("#cognac", W("t2", "коньяк"), "pop"); hide("#cognac", st.l3 + .2);
  const knock = W("l3", "дубеет");
  R.sfx("tap", knock, 1); R.sfx("tap", knock + .18, 1); R.shake(cam, knock, .5, .2); R.shake(cam, knock + .18, .5, .2);
  slam("#oak", knock + .1, "hit");
  // 6. яма: снизу вверх, ржавчина сыплется на «отпевать», капля на «отъездились»
  swap("side", "pit", st.l4 - .6);
  tl.fromTo(cam, { s: 1.12, y: 80 }, { s: 1, y: 0, duration: 2.2, ease: "power2.out", immediateRender: false }, st.l4 - .3);
  tl.to("#m-armR", { rotation: -60, duration: .2, yoyo: true, repeat: 3 }, st.m1 + .2); R.sfx("tap", st.m1 + .3, .8); R.sfx("tap", st.m1 + .7, .8);
  for (let i = 0; i < 16; i++) { const at = st.m1 + .3 + i * .07;
    tl.fromTo(`#ru${i}`, { opacity: 1, y: 0, rotation: 0 }, { opacity: 0, y: 900 + (i % 4) * 120, rotation: 200, duration: 1.4, ease: "power2.in", immediateRender: false }, at); }
  slam("#rip", W("m1", "отпев"), "boom");
  hide("#rip", st.v3 - .1);
  tl.fromTo("#drop", { opacity: 1, y: 0 }, { y: 1000, duration: .6, ease: "power2.in", immediateRender: false }, en.m2 + .1).to("#drop", { opacity: 0, duration: .05 }, en.m2 + .7);
  R.sfx("tap", en.m2 + .7, .6);
  // 7. кювет: Приора разворачивается и садится; потом девятка
  swap("pit", "ditch", st.l5 - .7);
  const slide = W("l5", "постав");
  gsap.set("#d09, #dr2, #T2", { opacity: 0 });
  tl.fromTo("#dPri", { x: -900, y: -120, rotation: 0 }, { x: 0, y: -120, rotation: 0, duration: .9, ease: "none", immediateRender: false }, st.l5 - .5)
    .to("#dPri", { rotation: 200, duration: .6, ease: "power1.in" }, slide - .4)
    .to("#dPri", { rotation: 351, y: 0, duration: .6, ease: "power2.out" }, slide + .2);
  tl.fromTo("#dr1", { scaleY: .3, transformOrigin: "50% 100%" }, { scaleY: 1, duration: .25, ease: "back.out(2)", immediateRender: false }, slide + .7);
  R.sfx("swish", slide - .4, .8); R.sfx("boom", slide + .75, .7); R.shake(cam, slide + .8, .8, .4);
  tl.to("#T2", { opacity: 1, duration: .01 }, st.t3 - .6).fromTo("#T2", { x: -300 }, { x: 0, duration: .5, ease: "back.out(1.4)", immediateRender: false }, st.t3 - .6);
  const stop = W("l6", "останов");
  tl.to("#d09, #dr2", { opacity: 1, duration: .01 }, stop - .3);
  tl.fromTo("#d09", { x: 700, y: -170, scale: .55 }, { x: 0, y: -60, scale: 1, duration: 1, ease: "power2.out", immediateRender: false }, stop - .3)
    .to("#d09", { y: 0, rotation: 6, duration: .3, ease: "power3.in" }, W("l6", "занижен") + .3);
  tl.fromTo("#dr2", { scaleY: .3, transformOrigin: "50% 100%" }, { scaleY: 1, duration: .25, ease: "back.out(2)", immediateRender: false }, W("l6", "занижен") + .55);
  R.sfx("riser", stop - .3, .5); R.sfx("clack", W("l6", "занижен") + .6, .9);
  slam("#clr", W("l6", "занижен") + .5, "pop"); slam("#two", W("l6", "двое"), "impact");
  tl.to(cam, { s: 1.08, duration: en.l6b - st.l6b + 1, ease: "power1.inOut" }, st.l6b - .2).set(cam, { s: 1 }, st.rule - .7);
  // 8. мораль из-за руля
  swap("ditch", "moral", st.rule - .7); wipe("m", st.rule - .3);
  tl.fromTo("#moralCard", { opacity: 0, y: 160 }, { opacity: 1, y: 0, duration: .4, ease: "expo.out", immediateRender: false }, st.rule);
  [W("rule", "протект"), W("rule", "год"), W("rule", "шипы"), W("rule", "машин")].forEach((at, i) => { tl.fromTo(`#mo${i}`, { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: .22, immediateRender: false }, at); R.sfx("pop", at, .5); });
  ending(R, st.end - .15);
};
