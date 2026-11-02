// «ПЕРЕГОН · 9000 КМ» — Толян гонит Toyota Mark II из Владивостока: комната, плацкарт, двор, заправка, пост, въезд в Москву, чек, мораль.
// Сквозной приём — счётчик расходов 💸 в углу, растёт по сценам. Машина — рисунок владельца (kit/img/markii).
$("#title .a").textContent = E.rubric; $("#title .b").textContent = E.subtitle; $("#tag span").textContent = "перегон из владика";
$("#title .a").style.cssText = "font-size:96px;background:#ffd23f"; $("#title .b").style.cssText = "font-size:110px;background:#ff3b30;color:#fff";
document.querySelector("#cam > svg#bg")?.remove();
const W = (line, pre, n = 0) => {
  const norm = s => s.toLowerCase().replace(/ё/g, "е").replace(/[^а-я0-9]/g, "");
  const hits = (TT.words[line] || []).filter(w => norm(w[0]).startsWith(norm(pre)));
  return hits[n] ? hits[n][1] : st[line];
};
const SCN = {};
function scene(name, bg) {
  const d = document.createElement("div"); d.className = "scn"; d.id = "sc_" + name;
  d.innerHTML = bg ? BGS[bg].replace('id="bg"', `id="bg_${name}"`).replace('id="trainLights"', 'class="trainLights"') : "";
  $("#scene").appendChild(d); SCN[name] = d; return d;
}
const add = (sc, html) => { SCN[sc].insertAdjacentHTML("beforeend", html); };
const mark = (id, l, t, w, z = 6, flip = false) => `<img class="pcar" id="${id}" src="../../kit/img/markii/markii.png" style="left:${l}px;top:${t}px;width:${w}px;z-index:${z};${flip ? "transform:scaleX(-1)" : ""}">`;
const person = (sc, kind, p, l, t, s = 1, z = 7) => add(sc, `<div class="c" id="${p.toUpperCase()}" style="left:${l}px;top:${t}px;z-index:${z};transform:scale(${s})">${CHARS[kind](p)}</div>`);
const stamp = (id, text, l, t, bg, fg = "#fff", fs = 60, rot = -4) => `<div class="stamp2" id="${id}" style="left:${l}px;top:${t}px;background:${bg};color:${fg};font-size:${fs}px;transform:rotate(${rot}deg)">${text}</div>`;
const puffs = (sc, pre, n) => add(sc, Array.from({ length: n }, (_, i) => `<div class="puff2" id="${pre}${i}"></div>`).join(""));
const TOL = ["t0", "t", "t2", "t3"];

// 1. комната ночью: карточка бота в телефоне
scene("room", "room");
add("room", `<div class="botcard" id="botcard"><div class="bh">ПЕРЕХВАТ · бот · 03:02</div><div class="bb"><b style="color:#ff7a1a">🔥 −35% к рынку</b><br><b>Toyota Mark II · 560 000 ₽</b><br>📍 Владивосток<br>⏱ 1,2 с после публикации</div></div>`);
person("room", "tolyan", "t0", -20, 900, .95);
// 2. плацкарт
scene("train", "train");
add("train", stamp("days", "СУТКИ <span id=\"dayN\">1</span> / 7", 620, 1260, "#151515", "#ffd23f", 46, 3));
person("train", "tolyan", "t", 330, 920, .85);
// 3. двор во Владивостоке
scene("yard", "yard");
add("yard", mark("yMark", 250, 1100, 600) + `<div class="el" id="hand" style="left:700px;top:880px;font-size:90px;z-index:9">👋</div>`
  + Array.from({ length: 10 }, (_, i) => `<div class="spark" id="sk${i}" style="left:${330 + i * 22}px;top:${1350 + (i % 3) * 8}px"></div>`).join("")
  + stamp("p560", "560 000 ₽", 120, 470, "#151515", "#fff", 66, -3) + stamp("rhd", "РУЛЬ СПРАВА · ДЕНЬГИ — НЕТ", 90, 590, "#ffd23f", "#151515", 40, 2));
person("yard", "tolyan", "t2", -40, 880, .9, 8);
// 4. ночная заправка
scene("azs", "azs");
add("azs", mark("aMark", 380, 1080, 600) + `<div class="pump" id="pump"><small>К ОПЛАТЕ</small><b id="pumpN">0</b></div>`
  + stamp("l15", "15 Л / 100 КМ", 110, 470, "#ff3b30", "#fff", 50, -3));
// 5. пост ДПС ночью: луч фонарика
scene("dps", "dps");
add("dps", mark("dMark", 40, 1100, 560) + `<div class="el" id="torch" style="left:0;top:0;width:1080px;height:1920px;z-index:9;opacity:0;pointer-events:none;
  background:radial-gradient(circle 170px at 800px 1080px, rgba(255,245,200,.55), rgba(255,245,200,0) 70%)"></div>`
  + stamp("fine", "ШТРАФ 800 ₽", 160, 470, "#ff3b30", "#fff", 60, -3));
person("dps", "tolyan", "t3", 560, 880, .9, 8);
// 6. рассвет, «МОСКВА 10 км»
scene("city", "citysign");
add("city", mark("cMark", 160, 1090, 560)); puffs("city", "cp", 6);
add("city", stamp("x1", "+30 000 НОЧЁВКИ", 90, 420, "#151515", "#fff", 40, -3) + stamp("x2", "+15 000 ЭВАКУАТОР", 140, 510, "#151515", "#fff", 40, 2)
  + stamp("x3", "+280 000 МОТОР И АКПП", 60, 600, "#ff3b30", "#fff", 44, -2));
person("city", "mihalych", "m", 680, 860, .95, 8);
// 7. чек сверху
scene("check", "desk");
add("check", `<div class="receipt" id="receipt"><h4>ЧЕК · ПЕРЕГОН</h4>${[["Mark II", "560 000"], ["Плацкарт, 7 суток", "15 000"], ["Бензин, 9 000 км", "81 000"],
  ["Ночёвки и шаурма", "30 000"], ["Штраф", "800"], ["Эвакуатор", "15 000"], ["Мотор и АКПП", "280 000"]].map(([a, b], i) => `<div class="row" id="r${i}"><span>${a}</span><span>${b}</span></div>`).join("")}
  <div class="tot" id="tot"><span>ИТОГО</span><span>981 800</span></div><div class="mk2" id="mkt">рынок ≈ 860 000 · +121 800</div></div>`);
// 8. мораль
scene("moral", "desk");
add("moral", `<div class="card" id="moralCard" style="top:400px;z-index:20"><h3>ПЕРЕД ПЕРЕГОНОМ</h3>
  <div class="li" id="mo0">🧮 Дорога, бензин, ночёвки, ремонт — в цену</div><div class="li" id="mo1">🔧 Диагностика — до оплаты, на месте</div><div class="li" id="mo2">📄 ОСАГО — до выезда</div>
  <div class="rule" id="mo3">🔔 В «Перехвате» поставь свой город</div></div>`);

$(".stage").insertAdjacentHTML("beforeend", `<div id="cnt" style="opacity:0">💸 0 ₽</div>`);
TOL.forEach(p => { const s = document.getElementById(p + "-shades"); if (s) s.style.display = ""; });
$("#end h2").innerHTML = E.end;
bubble("t1", "Брат, никому не отдавай,<br><em>я в пути! Пятые сутки!</em>", 60, 700, 420);
bubble("s1", "Забирай, брат! Он только<br>с виду низкий — <em>по жизни высокий!</em>", 260, 700, 560);
bubble("d1", "Страховку покажите.<br><em>ОСАГО есть?</em>", 560, 680, 300);
bubble("t2", "Брат, он застрахован…<br><em>молитвой.</em>", 40, 900, 620);
bubble("m1", "Довёз? Почти.<br><em>Мотор приехал отдельно.</em>", 300, 700, 520);

window.build = R => {
  const tl = R.tl, cam = R.camera($("#cam"), { hand: .6 });
  R.grain(.03);
  gsap.set(".scn", { opacity: 0 }); gsap.set("#sc_room", { opacity: 1 });
  const { pop } = common(R, cam, { mood: (k, t) => k === "mihalych" ? "grin" : "meh" });
  R.hooks.push(t => { const f = Math.floor(t * 30), lv = (LIP.tolyan || [])[f] || 0;
    TOL.forEach(p => { if (p !== "t" && document.getElementById(p)) mouth(p, lv > .28 && !(lv < .55 && f % 3 === 2) ? "talk" : p === "t3" ? "nerv" : "grin"); }); });
  const swap = (from, to, at, kind = "swipe") => {
    if (kind === "cut") { tl.set(`#sc_${from}`, { opacity: 0 }, at).set(`#sc_${to}`, { opacity: 1, x: 0, filter: "none" }, at); R.sfx("hit", at, .4); return; }
    tl.set(`#sc_${to}`, { opacity: 1, x: 1080, filter: "blur(14px)" }, at)
      .to(`#sc_${from}`, { x: -1080, filter: "blur(14px)", duration: .35, ease: "power3.in" }, at)
      .to(`#sc_${to}`, { x: 0, filter: "blur(0px)", duration: .38, ease: "power3.out" }, at + .12)
      .set(`#sc_${from}`, { opacity: 0, x: 0, filter: "none" }, at + .5);
    R.sfx("whoosh", at, .6);
  };
  // счётчик расходов: плавно доезжает до новой суммы, «щелчок» на каждом шаге
  const STEPS = [[st.t1 - .6, 15000], [W("l2", "пятьсот"), 575000], [W("l3", "восемьдес"), 656000], [W("l4", "восемьсот"), 656800], [en.m1 + .3, 981800]];
  const fmt = v => Math.round(v).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  R.hooks.push(t => { let v = 0, prev = 0;
    for (const [at, to] of STEPS) { if (t < at) break; v = prev + (to - prev) * Math.min(1, (t - at) / .7); prev = to; }
    $("#cnt").textContent = `💸 ${fmt(v)} ₽`; });
  tl.to("#cnt", { opacity: 1, duration: .3 }, st.t1 - .9); tl.to("#cnt", { opacity: 0, duration: .2 }, st.rule - .7);
  STEPS.forEach(([at]) => { tl.fromTo("#cnt", { scale: 1.35 }, { scale: 1, duration: .3, ease: "back.out(2)", immediateRender: false }, at); R.sfx("tick", at, .9); R.sfx("pop", at + .7, .5); });
  window.MUSIC = { style: "bed", bpm: 100, end: R.dur - 1.2, mute: [[W("l5", "мотор") - .1, st.m1 - .1]] };
  for (const l of ["t1", "s1", "d1", "t2", "m1"]) { const nx = E.lines[E.lines.findIndex(x => x.id === l) + 1]; pop("#b_" + l, st[l] - .05, Math.min(en[l] + .9, st[nx.id] - .1)); }
  const slam = (sel, at, sfx = "impact") => { tl.fromTo(sel, { opacity: 0, scale: 2 }, { opacity: 1, scale: 1, duration: .18, ease: "power4.out", immediateRender: false }, at); R.sfx(sfx, at + .02, .7); };

  // 1. комната: телефон вспыхивает, Толян подскакивает
  R.sfx("ping", W("h", "перехват") - .05, 1);
  tl.fromTo("#botcard", { opacity: 0, scale: .6, y: 60 }, { opacity: 1, scale: 1, y: 0, duration: .35, ease: "back.out(1.8)", immediateRender: false }, W("h", "перехват"));
  tl.fromTo("#T0", { y: 80 }, { y: 0, duration: .4, ease: "back.out(2.5)", immediateRender: false }, W("h", "перехват") + .2);
  tl.to("#title", { opacity: 0, y: -50, duration: .25 }, W("h", "перехват") - .2);
  tl.fromTo(cam, { s: 1 }, { s: 1.08, duration: st.t1 - 1, ease: "none", immediateRender: false }, 0).set(cam, { s: 1 }, st.t1 - .7);
  // 2. плацкарт: стук колёс, огни за окном, сутки щёлкают
  swap("room", "train", st.t1 - .7);
  R.hooks.push(t => { const g = SCN.train.querySelector(".trainLights"); if (g) g.setAttribute("transform", `translate(${-((t * 600) % 500)} 0)`);
    if (t > st.t1 - .7 && t < st.s1 - .7) $("#cam").style.transform += ` translateY(${Math.sin(t * 20) * 1.5}px)`; });
  for (let a = st.t1 - .5; a < st.s1 - .8; a += .55) R.sfx("tap", a, .5);
  slam("#days", st.t1 - .2, "pop");
  R.hooks.push(t => { const d0 = st.l1, d1 = en.l1; $("#dayN").textContent = t < d0 ? 5 : Math.min(7, 5 + Math.floor((t - d0) / ((d1 - d0) / 3))); });
  // 3. двор: Марк выезжает, губой по бордюру — искры
  swap("train", "yard", st.s1 - .7);
  tl.fromTo("#yMark", { x: 700 }, { x: 0, duration: 1, ease: "power3.out", immediateRender: false }, st.s1 - .5);
  for (let i = 0; i < 10; i++) tl.fromTo(`#sk${i}`, { opacity: 1, x: 0, y: 0 }, { opacity: 0, x: -60 - i * 8, y: -50 - (i % 4) * 14, duration: .45, immediateRender: false }, st.s1 + .3 + i * .03);
  R.sfx("glitch", st.s1 + .3, .5);
  tl.fromTo("#hand", { rotation: -20 }, { rotation: 20, duration: .2, repeat: 7, yoyo: true, immediateRender: false }, st.s1);
  slam("#p560", W("l2", "пятьсот"), "clack"); slam("#rhd", W("l2", "руль"), "pop");
  // 4. заправка: цифры колонки крутятся
  swap("yard", "azs", st.l3 - .7);
  tl.fromTo("#pump", { opacity: 0, y: -40 }, { opacity: 1, y: 0, duration: .3, immediateRender: false }, st.l3);
  R.count($("#pumpN"), W("l3", "девять"), 0, 81000, en.l3 - W("l3", "девять") - .3);
  for (let a = W("l3", "девять"); a < en.l3 - .3; a += .18) R.sfx("tick", a, .4);
  slam("#l15", W("l3", "пятнадц"), "pop");
  // 5. пост: фонарик по лицу
  swap("azs", "dps", st.d1 - .8);
  tl.to("#torch", { opacity: 1, duration: .2 }, st.d1 - .3);
  tl.fromTo("#torch", { x: -300 }, { x: 0, duration: .8, ease: "power2.out", immediateRender: false }, st.d1 - .3);
  slam("#fine", W("l4", "штраф"), "impact");
  // 6. рассвет: Марк едет, дёргается, дым; Михалыч; расходы рывком
  swap("dps", "city", st.l5 - .7);
  tl.fromTo("#cMark", { x: -700, y: 120, scale: .7 }, { x: 0, y: 0, scale: 1, duration: 1.4, ease: "power2.out", immediateRender: false }, st.l5 - .5);
  const die = W("l5", "мотор");
  tl.to("#cMark", { x: 12, duration: .07, yoyo: true, repeat: 7 }, die + .2);
  R.sfx("boom", die + .3, .5); R.sfx("boom", die + .8, .4);
  for (let i = 0; i < 6; i++) { const at = die + .3 + i * .3, sz = 70 + i * 14;
    gsap.set(`#cp${i}`, { left: 260, top: 1130, width: sz, height: sz });
    tl.fromTo(`#cp${i}`, { opacity: 0, x: 0, y: 0, scale: .3 }, { opacity: .9, x: -30 - i * 10, y: -200, scale: 1.4, duration: 1.1, ease: "power2.out", immediateRender: false }, at).to(`#cp${i}`, { opacity: 0, duration: .3 }, at + .9); }
  tl.fromTo("#M", { x: 500 }, { x: 0, duration: .6, ease: "back.out(1.3)", immediateRender: false }, st.m1 - .6);
  slam("#x1", en.m1 + .3, "pop"); slam("#x2", en.m1 + .55, "pop"); slam("#x3", en.m1 + .8, "impact");
  // 7. чек: строки выезжают с треском кассы
  swap("city", "check", st.l6 - .8);
  tl.fromTo("#receipt", { y: -500 }, { y: 0, duration: .6, ease: "power2.out", immediateRender: false }, st.l6 - .7);
  for (let i = 0; i < 7; i++) { const at = st.l6 - .3 + i * .22; tl.fromTo(`#r${i}`, { opacity: 0 }, { opacity: 1, duration: .05, immediateRender: false }, at); R.sfx("type", at, .6); }
  slam("#tot", W("l6", "дороже"), "impact"); slam("#mkt", W("l6", "сто"), "pop");
  // 8. мораль
  swap("check", "moral", st.rule - .7);
  tl.fromTo("#moralCard", { opacity: 0, y: 160 }, { opacity: 1, y: 0, duration: .4, ease: "expo.out", immediateRender: false }, st.rule);
  [W("rule", "дорог"), W("rule", "диагност"), W("rule", "оформ"), W("rule", "чтобы")].forEach((at, i) => { tl.fromTo(`#mo${i}`, { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: .22, immediateRender: false }, at); R.sfx("pop", at, .5); });
  ending(R, st.end - .15);
};
