// «ЖИЗНЬ ОДНОЙ ЧЕТЫРКИ» (формат ep14) — 8 сцен: рынок-хук, салон 2008 (дед Петрович), двор 2013 (внук: чёрная, тонировка в ноль, наклейка),
// гаражи 2016 (сварили из двух), аэродром 2021 (дрифт, каркас), рынок 2024 (Толян + баба Галя), СТО (Михалыч + Серёга), мораль.
// Четырка — картинка владельца (kit/img/vaz2114t); цвет кузова каждой «жизни» — CSS-фильтр, колёса всегда родные. Каждый, кто говорит, — в кадре.
$("#title .a").textContent = E.rubric; $("#title .b").textContent = E.subtitle; $("#tag span").textContent = "жизнь одной четырки";
$("#title .a").style.fontSize = "76px"; $("#title .b").style.fontSize = "120px";
document.querySelector("#cam > svg#bg")?.remove();
BGS.yard = BGS.yard.replace(/<g><path d="M120 1320[\s\S]*?<\/g>/, "");   // двор без качелей
const W = (line, pre, n = 0) => {
  const norm = s => s.toLowerCase().replace(/ё/g, "е").replace(/[^а-я0-9a-z]/g, "");
  const hits = (TT.words[line] || []).filter(w => norm(w[0]).startsWith(norm(pre)));
  return hits[n] ? hits[n][1] : st[line];
};
const SCN = {};
function scene(name, bg) {
  const d = document.createElement("div"); d.className = "scn"; d.id = "sc_" + name;
  d.innerHTML = bg ? BGS[bg].replace('id="bg"', `id="bg_${name}"`) : "";
  $("#scene").appendChild(d); SCN[name] = d; return d;
}
const add = (sc, html) => { SCN[sc].insertAdjacentHTML("beforeend", html); };
const hero = (kind, p, l, t, s = 1, z = 6, o) => `<div class="c" id="${p.toUpperCase()}" style="left:${l}px;top:${t}px;z-index:${z};transform-origin:0 0;transform:scale(${s})">${CHARS[kind](p, o)}</div>`;
const stamp = (id, text, l, t, bg, fg = "#fff", fs = 60, rot = -4) => `<div class="stamp2" id="${id}" style="left:${l}px;top:${t}px;background:${bg};color:${fg};font-size:${fs}px;transform:rotate(${rot}deg)">${text}</div>`;
const DED = { jacket: "#6b5a3a", pants: "#3b3f46", hair: "#d9d9d9", mustache: true, glasses: true };
const IMG = "../../kit/img/vaz2114t/vaz2114t_", SIDE = IMG + "side.png";
const PAINT = { silver: "grayscale(1) brightness(1.45) contrast(1.05)", black: "grayscale(.6) brightness(.42) contrast(1.25)", cherry: "sepia(1) saturate(4.2) hue-rotate(-38deg) brightness(.8)", own: "none" };
const WHEELS = [[18.2, 77.5], [80.3, 77.5]];
// четырка сбоку: слои кузова [id, цвет, clip, тонировка] + родные колёса поверх + наклейка (по желанию)
const T14S = (id, l, t, w, layers, z = 4, sticker = false) => `<div class="t14" id="${id}" style="left:${l}px;top:${t}px;width:${w}px;height:${w * 244 / 725}px;z-index:${z}">
  ${layers.map(([lid, p, clip, tint]) => `<img id="${lid}" src="${tint ? IMG + "side_tint.png" : SIDE}" style="filter:${PAINT[p]};${clip ? `clip-path:${clip};` : ""}">`).join("")}
  ${WHEELS.map(([x, y]) => `<img src="${SIDE}" style="clip-path:circle(10.8% at ${x}% ${y}%)">`).join("")}
  ${sticker ? `<img id="${id}_stk" src="../../kit/img/sticker.png" style="left:30.5%;top:13%;width:9.5%">` : ""}</div>`;
const T34 = (id, l, t, w, z = 4, extra = "") => `<img class="pcar" id="${id}" src="${IMG}34.png" style="left:${l}px;top:${t}px;width:${w}px;z-index:${z};${extra}">`;

// 1. хук: рынок, «одна хозяйка»
scene("hook", "market");
add("hook", T34("car0", 150, 1130, 760) + stamp("pr0", "450 000 ₽ · ОДНА ХОЗЯЙКА", 120, 990, "#ffd23f", "#151515", 44, -4)
  + `<div class="big" id="five" style="top:700px;font-size:96px">ПЯТЬ<br><span>ЖИЗНЕЙ</span></div>`);
// 2. салон, 2008: дед Петрович и новая серебристая
scene("dealer", "dealer");
add("dealer", T14S("car1", 320, 1180, 700, [["c1s", "silver"]]) + hero("perekup", "d", 30, 820, .95, 6, DED)
  + stamp("pr1", "НОВАЯ · 280 000 ₽", 470, 1050, "#4cd964", "#151515", 44, -3)
  + stamp("n1a", "ЧЕХЛЫ", 560, 560, "#fff", "#151515", 44, 3) + stamp("n1b", "ЁЛОЧКА 🌲", 600, 660, "#4cd964", "#151515", 44, -3) + stamp("n1c", "РАССАДА 🌱", 560, 760, "#ffd23f", "#151515", 44, 2));
// 3. двор, 2013: внук — чёрная, тонировка в ноль, занижение, пушка
scene("yard", "yard");
add("yard", T14S("car2", 200, 930, 700, [["c2s", "silver"], ["c2b", "black"], ["c2t", "black", "", true]], 4, true)
  + `<div class="el" id="boom2" style="left:100px;top:1030px;font-size:140px;z-index:9;opacity:0">💥</div>`
  + stamp("n2a", "ТОНИРОВКА В НОЛЬ", 60, 770, "#151515", "#fff", 40, -4) + stamp("n2b", "ЗАНИЖЕНИЕ", 620, 790, "#151515", "#fff", 40, 3)
  + stamp("n2c", "ПУШКА В ВЫХЛОП", 300, 1330, "#ff3b30", "#fff", 40, -2) + stamp("n2d", "РАССАДА ✗", 380, 540, "#ffd23f", "#151515", 52, 3));
// 4. гаражи, 2016: отбойник, сварили из двух
scene("garage", "garages");
add("garage", T14S("car3", 190, 1200, 700, [["c3c", "cherry", "inset(0 0 0 50%)"], ["c3b", "black", "inset(0 50% 0 0)"], ["c3o", "own"]])
  + `<div class="weld" id="weld" style="left:532px;top:1188px;height:240px;opacity:0"></div>`
  + Array.from({ length: 12 }, (_, i) => `<div class="spark" id="sp${i}" style="left:${500 + (i * 23) % 80}px;top:${1190 + (i * 41) % 230}px"></div>`).join("")
  + stamp("n3a", "ПЕРЕД — ВИШНЁВЫЙ", 520, 1020, "#a8302b", "#fff", 34, 3) + stamp("n3b", "ЗАД — ЧЁРНЫЙ", 60, 1020, "#151515", "#fff", 34, -3)
  + stamp("n3c", "ОТБОЙНИК 1 : 0", 200, 560, "#ff3b30", "#fff", 56, -3) + stamp("n3d", "ШОВ ЗАКРАШЕН", 300, 1500, "#4cd964", "#151515", 44, 2));
// 5. аэродром, 2021: дрифт
scene("drift", "airfield");
add("drift", T34("car4", 160, 1130, 760, 4) + Array.from({ length: 8 }, (_, i) => `<div class="smk" id="sm${i}" style="left:${640 + (i * 61) % 260}px;top:${1300 + (i * 37) % 120}px;width:${120 + (i * 29) % 90}px;height:${80 + (i * 17) % 50}px"></div>`).join("")
  + stamp("n4a", "КАРКАС", 80, 940, "#ffd23f", "#151515", 44, -4) + stamp("n4b", "РАСТЯЖКА", 640, 920, "#ffd23f", "#151515", 44, 3)
  + stamp("n4c", "ОПЯТЬ.", 380, 560, "#ff3b30", "#fff", 70, -3));
// 6. рынок, 2024: Толян продаёт, баба Галя проходит мимо
scene("market", "market");
add("market", T34("car5", 260, 1180, 620) + hero("tolyan", "t", 0, 820, .9) + hero("galya", "g", 780, 880, .78)
  + stamp("pr5", "450 000 ₽", 600, 1080, "#ffd23f", "#151515", 44, 4) + stamp("n5a", "ДАЧА — 4 ЖИЗНИ НАЗАД", 140, 560, "#151515", "#ffd23f", 46, -3));
// 7. СТО: шов посередине кузова
scene("sto", "sto");
add("sto", T14S("car6", 240, 1220, 600, [["c6o", "own"]]) + hero("mihalych", "m", 10, 820, .9) + hero("seryoga", "s", 780, 860, .8)
  + `<div class="el" id="seam" style="left:536px;top:1208px;width:10px;height:200px;z-index:5;background:repeating-linear-gradient(180deg,#ff3b30 0 14px,transparent 14px 24px);opacity:0"></div>`
  + stamp("n6a", "ПОД КРАСКОЙ — ВИШНЁВЫЙ", 200, 1440, "#a8302b", "#fff", 36, -2));
// 8. мораль
scene("moral", "market");
add("moral", T34("car7", 160, 1150, 760, 3) + `<div class="card" id="moralCard" style="top:360px;z-index:20"><h3>У КАЖДОЙ ЧЕТЫРКИ ЕСТЬ ПРОШЛОЕ</h3>
  <div class="li" id="mo0">📄 Автотека — ДТП, владельцы, пробег</div><div class="li" id="mo1">🖼 Старые объявления по VIN — цвет</div>
  <div class="li" id="mo2">📏 Толщиномер и шов посередине</div><div class="li" id="mo3">🔩 Каркас — это прошлое</div>
  <div class="rule" id="mo4">🔔 Свежие объявления — бот «Перехват»</div></div>`);

$("#over").insertAdjacentHTML("beforeend", `<div id="yr">2024</div><div id="rew"><b>⏪</b></div>`);
$("#end h2").innerHTML = E.end;
const bub = (line, html, l, t, tx, fs) => { const b = bubble(line, html, l, t, tx); if (fs) b.style.fontSize = fs + "px"; return b; };
bub("d1", "Ласточка! Только на дачу<br><em>и обратно. Рассаду возить.</em>", 120, 660, 150, 40);
bub("t1", "Брат, одна хозяйка!<br><em>Бабушка на дачу ездила!</em>", 120, 640, 140, 44);
bub("g1", "Сынок, я на такой<br><em>даже не сидела.</em>", 420, 700, 470, 44);
bub("m1", "От родной тут — номер.<br><em>И то не факт.</em>", 60, 640, 160, 44);
bub("s1", "А каркас<br><em>зачем?</em>", 560, 660, 360, 48);
bub("m2", "Чтобы кузов не развалился,<br><em>пока ты платишь.</em>", 60, 640, 160, 40);

window.build = R => {
  const tl = R.tl, cam = R.camera($("#cam"), { hand: .6 });
  R.grain(.03);
  gsap.set(".scn", { opacity: 0 }); gsap.set("#sc_hook", { opacity: 1 });
  const { pop } = common(R, cam, { mood: () => "grin" });
  const SW = { d1: st.d1 - .7, l2: st.l2 - .7, l3: st.l3 - .7, l4: st.l4 - .7, t1: st.t1 - .7, m1: st.m1 - .7, rule: st.rule - .7 };
  const YR = [[0, "2024"], [SW.d1 + .25, "2008"], [SW.l2 + .25, "2013"], [SW.l3 + .25, "2016"], [SW.l4 + .25, "2021"], [SW.t1 + .25, "2024"], [SW.m1 + .25, ""]];
  R.hooks.push(t => { const f = Math.floor(t * 30), lv = (LIP.ded || [])[f] || 0;
    if (document.getElementById("d")) mouth("d", lv > .28 && !(lv < .55 && f % 3 === 2) ? "talk" : "grin");
    const y = YR.filter(([a]) => t >= a).pop()[1]; $("#yr").textContent = y; $("#yr").style.display = y && t > W("h", "пят") - .1 && t < st.end - .2 ? "" : "none";
    const dr = t > SW.l4 && t < SW.t1 ? t - SW.l4 : 0;                          // дрифт: машина ходит маятником
    if (dr) $("#car4").style.transform = `translate(${Math.sin(dr * 1.6) * 60}px,${Math.sin(dr * 3.2) * 8}px) rotate(${-6 + Math.sin(dr * 1.6 + .6) * 7}deg)`;
    for (let i = 0; i < 8; i++) { const s = document.getElementById("sm" + i), p = dr ? ((dr * .7 + i / 8) % 1) : 0;
      s.style.opacity = dr ? (1 - p) * .9 : 0; s.style.transform = `translate(${p * 240}px,${-p * 160}px) scale(${.5 + p * 1.4})`; }
    for (let i = 0; i < 12; i++) { const s = document.getElementById("sp" + i), w = t > W("l3", "свар") && t < W("l3", "шов") + .3;
      s.style.opacity = w && ((f + i * 7) % 9 < 4) ? 1 : 0; s.style.transform = `translate(${Math.sin(f * 1.3 + i) * 50}px,${Math.cos(f * .9 + i * 2) * 40}px)`; } });
  const swap = (from, to, at, kind = "swipe") => {
    if (kind === "cut") { tl.set(`#sc_${from}`, { opacity: 0 }, at).set(`#sc_${to}`, { opacity: 1, x: 0, filter: "none" }, at); R.sfx("hit", at, .4); return; }
    tl.set(`#sc_${to}`, { opacity: 1, x: 1080, filter: "blur(14px)" }, at)
      .to(`#sc_${from}`, { x: -1080, filter: "blur(14px)", duration: .35, ease: "power3.in" }, at)
      .to(`#sc_${to}`, { x: 0, filter: "blur(0px)", duration: .38, ease: "power3.out" }, at + .12)
      .set(`#sc_${from}`, { opacity: 0, x: 0, filter: "none" }, at + .5);
    R.sfx("whoosh", at, .6);
  };
  const yrPop = at => { tl.fromTo("#yr", { scale: 1.6 }, { scale: 1, duration: .25, ease: "back.out(2)", immediateRender: false }, at); R.sfx("tick", at, .5); };
  window.MUSIC = { style: "bed", bpm: 96, end: R.dur - 1.2 };
  const ids = E.lines.map(l => l.id);
  for (const l of ["d1", "t1", "g1", "m1", "s1", "m2"]) {
    const nx = ids[ids.indexOf(l) + 1]; const ns = SW[nx] ? SW[nx] - .05 : 1e9;
    pop("#b_" + l, st[l] - .05, Math.min(en[l] + .9, st[nx] - .1, ns)); }
  const slam = (sel, at, sfx = "impact") => { tl.fromTo(sel, { opacity: 0, scale: 2 }, { opacity: 1, scale: 1, duration: .18, ease: "power4.out", immediateRender: false }, at); R.sfx(sfx, at + .02, .7); };
  const fadeIn = (sel, at, d = .35) => tl.fromTo(sel, { opacity: 0 }, { opacity: 1, duration: d, immediateRender: false }, at);

  // 1. хук
  tl.set("#c2b, #c2t, #car2_stk, #c3o", { opacity: 0 }, 0);
  tl.to("#title", { opacity: 0, y: -50, duration: .25 }, W("h", "пят") - .3);
  tl.fromTo("#car0", { scale: .9 }, { scale: 1.04, duration: SW.d1, ease: "none", immediateRender: false }, 0);
  slam("#pr0", .3, "pop"); slam("#five", W("h", "пят"), "impact"); R.punch(cam, W("h", "дорож"), .06); R.sfx("ping", W("h", "дорож"), .5);
  // 2. ⏪ назад в 2008: салон
  tl.fromTo("#rew", { opacity: 0 }, { opacity: 1, duration: .1, immediateRender: false }, SW.d1 - .2).to("#rew", { opacity: 0, duration: .15 }, SW.d1 + .5); R.sfx("glitch", SW.d1 - .2, .6);
  swap("hook", "dealer", SW.d1); yrPop(SW.d1 + .25);
  tl.fromTo("#car1", { x: 520 }, { x: 0, duration: 1.1, ease: "power2.out", immediateRender: false }, SW.d1 + .2);
  slam("#pr1", st.d1 + .3, "pop");
  [["#n1a", "чехл"], ["#n1b", "елоч"], ["#n1c", "расс"]].forEach(([s, w]) => slam(s, W("l1", w), "pop"));
  // 3. двор, 2013: серебристая → чёрная → тонировка в ноль → занижение → пушка
  swap("dealer", "yard", SW.l2); yrPop(SW.l2 + .25);
  fadeIn("#c2b", W("l2", "внук"), .4);
  slam("#n2a", W("l2", "тонир"), "pop"); fadeIn("#c2t", W("l2", "тонир"), .3); fadeIn("#car2_stk", W("l2", "тонир") + .3, .2);
  slam("#n2b", W("l2", "заниж"), "pop"); tl.to("#car2", { y: 26, duration: .25, ease: "power3.in" }, W("l2", "заниж"));
  slam("#n2c", W("l2", "пушк"), "pop");
  tl.fromTo("#boom2", { opacity: 0, scale: .4 }, { opacity: 1, scale: 1.2, duration: .12, immediateRender: false }, W("l2", "выхл")).to("#boom2", { opacity: 0, duration: .2 }, W("l2", "выхл") + .3);
  R.sfx("boom", W("l2", "выхл"), .6); R.shake(cam, W("l2", "выхл"), .5, .25);
  slam("#n2d", W("l2", "помещ"), "impact");
  // 4. гаражи, 2016: удар, сварка, закрасили
  swap("yard", "garage", SW.l3); yrPop(SW.l3 + .25);
  slam("#n3c", W("l3", "отбой"), "boom"); R.shake(cam, W("l3", "отбой"), .8, .35);
  fadeIn("#weld", W("l3", "свар"), .15); R.sfx("riser", W("l3", "свар"), .3);
  slam("#n3a", W("l3", "перед"), "pop"); slam("#n3b", W("l3", "зад"), "pop");
  fadeIn("#c3o", W("l3", "закрас"), .5); tl.to("#weld", { opacity: 0, duration: .4 }, W("l3", "закрас")); slam("#n3d", W("l3", "закрас") + .2, "pop");
  // 5. аэродром, 2021: дрифт
  swap("garage", "drift", SW.l4); yrPop(SW.l4 + .25); R.sfx("riser", SW.l4 + .3, .4);
  slam("#n4a", W("l4", "карка"), "impact"); slam("#n4b", W("l4", "сложил"), "pop");
  slam("#n4c", W("l4", "опят"), "impact"); R.punch(cam, W("l4", "опят"), .08);
  // 6. рынок, 2024
  swap("drift", "market", SW.t1); yrPop(SW.t1 + .25);
  slam("#pr5", st.t1 + .4, "ping");
  R.punch(cam, W("g1", "сид"), .05);
  slam("#n5a", W("l5", "четыр"), "impact");
  // 7. СТО
  swap("market", "sto", SW.m1);
  tl.to("#seam", { opacity: 1, duration: .3 }, W("m1", "номер")); R.sfx("ping", W("m1", "номер"), .5);
  slam("#n6a", W("m2", "кузов"), "pop");
  // 8. мораль
  swap("sto", "moral", SW.rule);
  tl.fromTo("#moralCard", { opacity: 0, y: 160 }, { opacity: 1, y: 0, duration: .4, ease: "expo.out", immediateRender: false }, st.rule - .4);
  [st.rule + .1, W("rule", "объявл"), W("rule", "толщ"), W("rule", "карка"), W("rule", "перехв") - .2].forEach((at, i) => { tl.fromTo(`#mo${i}`, { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: .22, immediateRender: false }, at); R.sfx("pop", at, .5); });
  ending(R, st.end - .15);
};
