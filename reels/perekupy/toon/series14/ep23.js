// «ПЕРВАЯ ЦЕНА» — 10 сцен: кухня Гали, штаб перекупов, сплит-звонок, 47 пропущенных, очередь во дворе, маршрутка (флешбэк),
// подъезд, «продано», сплит-звонок Серёги, мораль. Секундомер идёт через всю серию. Каждый, кто говорит, — в кадре.
$("#title .a").textContent = E.rubric; $("#title .b").style.display = "none"; $("#tag span").textContent = "первая цена";
$("#title .a").style.cssText = "font-size:104px;background:#151515;color:#fff";
document.querySelector("#cam > svg#bg")?.remove();
// двор без качелей: у подъезда на асфальте стоит BMW
BGS.yard = BGS.yard.replace(/<g><path d="M120 1320[\s\S]*?<\/g>/, "");
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
// герой как на раскадровке: левый верхний угол l,t и масштаб s (от угла)
const hero = (kind, p, l, t, s = 1, z = 6, o) => `<div class="c" id="${p.toUpperCase()}" style="left:${l}px;top:${t}px;z-index:${z};transform-origin:0 0;transform:scale(${s})">${CHARS[kind](p, o)}</div>`;
const stamp = (id, text, l, t, bg, fg = "#fff", fs = 60, rot = -4) => `<div class="stamp2" id="${id}" style="left:${l}px;top:${t}px;background:${bg};color:${fg};font-size:${fs}px;transform:rotate(${rot}deg)">${text}</div>`;
const bmw = (id, l, t, w, z = 3) => `<img class="pcar" id="${id}" src="../../kit/img/bmw/bmw_side.png" style="left:${l}px;top:${t}px;width:${w}px;z-index:${z}">`;
const ladder = (id, l, t, h) => `<div class="ladder" id="${id}" style="left:${l}px;top:${t}px;height:${h}px"></div>`;
const panel = (id, bg, l, bx, inner) => `<div class="pan2" id="${id}" style="left:${l}px"><div class="pin2" style="left:${-bx}px">${BGS[bg].replace('id="bg"', "")}</div>${inner}</div>`;
const phone = (id, l, t, w, inner) => `<div class="ph" id="${id}" style="left:${l}px;top:${t}px;width:${w}px;height:${w * 1.9}px"><div class="scr">${inner}</div></div>`;
const AD = `<div class="adpic"><img src="../../kit/img/bmw/bmw_34.png"></div><div class="adt">BMW E34, 1991</div><div class="adp">300 000 ₽</div>
  <div class="add">Одна хозяйка. Ездила на дачу и в поликлинику. Гараж.</div><div class="pub"><b id="pub0">ОПУБЛИКОВАТЬ</b><b id="pub1">✓ ОПУБЛИКОВАНО</b></div>`;
const NAMES = ["Не перекуп", "Частник Вадим", "Срочный выкуп 24/7", "Без посредников", "Сергей (не перекуп)", "Автоэксперт Женя", "Не перекуп 2", "Куплю дорого"];
const CALLS = `<div class="miss"><span id="missN">0</span> пропущенных</div>` + NAMES.map((n, i) => `<div class="cl" id="cl${i}"><span>📞 ${n}</span><i>0:0${(i * 7 + 3) % 9}</i></div>`).join("");
const BOT = `<div class="botw"><div class="bh">🦊 Перехват · 3 сек назад</div><div class="bc"><img src="../../kit/img/bmw/bmw_34.png">
  <div class="adt">BMW E34 · 300 000 ₽</div><div class="ok">✅ собственник · рынок ≈ 400 000</div><div class="lo">⚡ ниже рынка на 100 000</div></div></div>`;
const GAL = ["g", "g2", "g3", "g4", "g5"], TOL = ["t", "t2", "t4", "t5"], VIK = ["v", "v2"];

// 1. кухня Гали: «Опубликовать»
scene("kit", "kitchen");
add("kit", hero("galya", "g", 80, 860, .95) + phone("phA", 560, 760, 300, AD));
// 2. штаб перекупов
scene("hq", "hq");
add("hq", `<div class="el" id="siren"></div>` + hero("perekup", "x1", 600, 900, .85, 4, { jacket: "#6b3a1f", cap: "#1d1d1f", item: "phone" })
  + hero("perekup", "x2", 790, 920, .8, 4, { jacket: "#2b4c7e", hair: "#151515", beard: true, item: "phone" }) + hero("tolyan", "t", 150, 860, 1, 6)
  + stamp("newad", "НОВОЕ: BMW E34 · 300 000 · СОБСТВЕННИК", 50, 560, "#ff3b30", "#fff", 32, -2));
// 3. сплит-звонок Толян ↔ Галя
scene("call", null);
add("call", `<div class="el" style="inset:0;background:#0b0c10"></div>` + panel("pL", "kitchen", 20, 40, hero("galya", "g2", -20, 200, .8))
  + panel("pR", "hq", 548, 120, hero("tolyan", "t2", 60, 200, .85)) + stamp("tax", "ЦЕНА ДЛЯ НАЛОГОВОЙ", 470, 1320, "#ffd23f", "#151515", 32, 3));
// 4. 47 пропущенных
scene("kit2", "kitchen");
add("kit2", hero("galya", "g3", 60, 860, .95) + phone("phB", 560, 760, 320, CALLS));
// 5. очередь во дворе, Толян на лестнице
scene("yard", "yard");
add("yard", bmw("car1", 10, 1095, 470) + ladder("lad1", 440, 640, 640)
  + hero("perekup", "y1", 640, 1000, .55, 5, { jacket: "#6b3a1f", cap: "#1d1d1f", item: "cash" }) + hero("perekup", "y2", 780, 1010, .54, 5, { jacket: "#4a6b3a", hair: "#151515", item: "flowers" })
  + hero("perekup", "y3", 910, 1020, .52, 5, { jacket: "#2b4c7e", beard: true, cap: "#c0392b", item: "phone" }) + hero("tolyan", "t4", 330, 580, .7, 6));
// 6. маршрутка: перемотка к 00:03, пуш бота
scene("bus", "minibus");
add("bus", Array.from({ length: 6 }, (_, i) => `<div class="streak2" id="sk${i}" style="top:${300 + i * 60}px"></div>`).join("")
  + hero("vika", "v", 120, 860, .95) + phone("phC", 600, 820, 300, BOT) + `<div class="vhs" id="vhs"></div>`);
// 7. подъезд: Вика первая у двери
scene("door", "stairs");
add("door", hero("galya", "g4", 170, 800, .95) + hero("vika", "v2", 640, 820, .95));
// 8. продано: BMW уезжает, очередь сдувается
scene("sold", "yard");
add("sold", bmw("car2", 10, 1095, 430) + stamp("soldst", "ПРОДАНО", 60, 1050, "#ff3b30", "#fff", 54, -6) + ladder("lad2", 440, 640, 640)
  + hero("perekup", "z1", 690, 1000, .6, 5, { jacket: "#6b3a1f", cap: "#1d1d1f", item: "cash", look: "angry" })
  + hero("perekup", "z2", 850, 1010, .58, 5, { jacket: "#4a6b3a", hair: "#151515", item: "flowers", look: "o" }) + hero("tolyan", "t5", 420, 900, .75, 6));
// 9. час спустя: сплит-звонок Серёга ↔ Галя
scene("call2", null);
add("call2", `<div class="el" style="inset:0;background:#0b0c10"></div>` + panel("qL", "parking", 20, 40, hero("seryoga", "s", 40, 200, .8))
  + panel("qR", "kitchen", 548, 300, hero("galya", "g5", 60, 200, .8)) + stamp("n48", "№ 48", 70, 1320, "#ff3b30", "#fff", 64, -5));
// 10. мораль
scene("moral", "kitchen");
add("moral", `<div class="card" id="moralCard" style="top:400px;z-index:20"><h3>ХОРОШАЯ МАШИНА ЖИВЁТ МИНУТЫ</h3>
  <div class="li" id="mo0">💰 Первая цена — от собственника</div><div class="li" id="mo1">⏱ Перекупы звонят через 8 секунд</div>
  <div class="li" id="mo2">📊 Сравни с рынком — и звони первым</div><div class="rule" id="mo3">🔔 Свежие объявления — бот «Перехват»</div></div>`);

$("#over").insertAdjacentHTML("beforeend", `<div id="clk"><span id="clkT">00:00</span></div>`);
TOL.forEach(p => { const s = document.getElementById(p + "-shades"); if (s) s.style.display = ""; });
$("#end h2").innerHTML = E.end;
const bub = (line, html, l, t, tx, fs) => { const b = bubble(line, html, l, t, tx); if (fs) b.style.fontSize = fs + "px"; return b; };
bub("g1", "Ну, к выходным, может,<br><em>кто и позвонит…</em>", 40, 560, 150, 44);
bub("t1", "Бабушкина бэха!<br><em>Все на телефоны!</em>", 360, 690, 90);
bub("t2", "Мать, ещё продаёте? Даю сто —<br><em>забираю прямо сейчас!</em>", 60, 620, 680, 40);
bub("g2", "Так там триста<br>написано…", 40, 680, 150);
bub("t3", "Это цена<br><em>для налоговой!</em>", 500, 560, 287, 42);
bub("g3", "Сынок, у вас там что —<br><em>слёт «не перекупов»?</em>", 40, 560, 150, 42);
bub("t4", "Мать! Наличкой —<br><em>прямо в форточку!</em>", 560, 600, 40, 46);
bub("v1", "Остановите<br><em>у пятиэтажки!</em>", 60, 640, 170);
bub("v2", "Я по БМВ. Осмотр, договор —<br><em>и триста, без торга.</em>", 280, 600, 500, 42);
bub("g4", "Вот! <em>Культурный<br>человек!</em>", 60, 620, 220);
bub("t5", "Опять этот бот,<br><em>#@%!</em>", 520, 720, 60);
bub("s1", "Здравствуйте! БМВ<br><em>ещё продаётся?</em>", 40, 640, 150, 44);
bub("g5", "Продана, милок.<br><em>Ты сорок восьмой.</em>", 440, 640, 330, 46);

window.build = R => {
  const tl = R.tl, cam = R.camera($("#cam"), { hand: .6 });
  R.grain(.03);
  gsap.set(".scn", { opacity: 0 }); gsap.set("#sc_kit", { opacity: 1 });
  const { pop } = common(R, cam, { mood: (k, t) => "grin" });
  R.hooks.push(t => { const f = Math.floor(t * 30), talk = lv => lv > .28 && !(lv < .55 && f % 3 === 2);
    const lg = (LIP.galya || [])[f] || 0, lt = (LIP.tolyan || [])[f] || 0, lv = (LIP.vika || [])[f] || 0;
    GAL.forEach(p => { if (p !== "g" && document.getElementById(p)) mouth(p, talk(lg) ? "talk" : "flat"); });
    TOL.forEach(p => { if (p !== "t" && document.getElementById(p)) mouth(p, talk(lt) ? "talk" : (p === "t5" ? "nerv" : "grin")); });
    VIK.forEach(p => { if (p !== "v" && document.getElementById(p)) mouth(p, talk(lv) ? "talk" : "flat"); }); });
  const swap = (from, to, at, kind = "swipe") => {
    if (kind === "cut") { tl.set(`#sc_${from}`, { opacity: 0 }, at).set(`#sc_${to}`, { opacity: 1, x: 0, filter: "none" }, at); R.sfx("hit", at, .4); return; }
    tl.set(`#sc_${to}`, { opacity: 1, x: 1080, filter: "blur(14px)" }, at)
      .to(`#sc_${from}`, { x: -1080, filter: "blur(14px)", duration: .35, ease: "power3.in" }, at)
      .to(`#sc_${to}`, { x: 0, filter: "blur(0px)", duration: .38, ease: "power3.out" }, at + .12)
      .set(`#sc_${from}`, { opacity: 0, x: 0, filter: "none" }, at + .5);
    R.sfx("whoosh", at, .6);
  };
  window.MUSIC = { style: "bed", bpm: 104, end: R.dur - 1.2, mute: [[st.t2 - .7, en.t2 + .1]] };
  const ids = E.lines.map(l => l.id);
  for (const l of ["g1", "t1", "t2", "g2", "t3", "g3", "t4", "v1", "v2", "g4", "t5", "s1", "g5"]) { const nx = ids[ids.indexOf(l) + 1]; pop("#b_" + l, st[l] - .05, Math.min(en[l] + .9, st[nx] - .1)); }
  const slam = (sel, at, sfx = "impact") => { tl.fromTo(sel, { opacity: 0, scale: 2 }, { opacity: 1, scale: 1, duration: .18, ease: "power4.out", immediateRender: false }, at); R.sfx(sfx, at + .02, .7); };

  // секундомер: опорные точки [время ролика, секунды на часах]
  const pub = W("h", "угадай") - .2, ring = st.t2 - .45, rew = st.l4 - .8;
  const K = [[0, 0], [pub, 0], [ring, 8], [st.l2 - .7, 21], [st.l2 + .2, 21], [W("l2", "звонков") + .3, 60], [st.l3 - .75, 75], [st.l3 - .45, 600], [rew, 640],
    [rew + 1.1, 3], [W("l4", "бот") + .8, 3], [st.v2 - .75, 40], [st.v2 - .45, 540], [st.l5 - .75, 560], [st.l5 - .45, 900], [st.s1 - .75, 920], [st.s1 - .45, 3600], [st.rule, 3610]];
  const fmt = s => { s = Math.max(0, Math.round(s)); const h = Math.floor(s / 3600), m = Math.floor(s / 60) % 60, x = s % 60, p = n => String(n).padStart(2, "0");
    return h ? `${h}:${p(m)}:${p(x)}` : `${p(m)}:${p(x)}`; };
  R.hooks.push(t => { let v = 0; for (let i = 1; i < K.length; i++) if (t <= K[i][0]) { const [a, va] = K[i - 1], [b, vb] = K[i]; v = va + (vb - va) * Math.min(1, Math.max(0, (t - a) / Math.max(.001, b - a))); break; } else v = K[i][1];
    $("#clkT").textContent = (t > rew && t < st.v2 - .75 ? "⏪ " : "") + fmt(v) + (t > ring && t < st.l2 - .7 ? " 📞" : "");
    // пропущенные: растут во время l2
    const n = Math.round(47 * Math.min(1, Math.max(0, (t - st.l2 + .2) / Math.max(.5, W("l2", "звонков") + .3 - st.l2 + .2))));
    $("#missN").textContent = n;
    NAMES.forEach((_, i) => { document.getElementById("cl" + i).style.opacity = n > i * 6 ? 1 : 0; });
    if (t > st.l2 - .2 && t < en.g3) $("#phB").style.transform = `translate(${Math.sin(t * 90) * 4}px,${Math.cos(t * 70) * 2}px) rotate(${Math.sin(t * 9) * 1.2}deg)`;
    // за окном маршрутки бежит город
    for (let i = 0; i < 6; i++) { const e = document.getElementById("sk" + i); e.style.transform = `translateX(${1200 - ((t * (900 + i * 130) + i * 400) % 1600)}px)`; }
    // красный маячок штаба
    $("#siren").style.opacity = .25 + .25 * Math.max(0, Math.sin(t * 7)); });
  tl.fromTo("#clk", { opacity: 0, scale: .6 }, { opacity: 1, scale: 1, duration: .3, ease: "back.out(2)", immediateRender: false }, pub).to("#clk", { opacity: 0, duration: .3 }, st.rule - .5);

  // 1. кухня: «Опубликовать» → часы пошли
  tl.to("#title", { opacity: 0, y: -50, duration: .25 }, pub - .3);
  tl.fromTo("#pub0", { scale: 1 }, { scale: .9, duration: .1, yoyo: true, repeat: 1, immediateRender: false }, pub - .2).set("#pub0", { opacity: 0 }, pub).set("#pub1", { opacity: 1 }, pub);
  R.sfx("tap", pub - .2, .8); R.sfx("ping", pub, .6);
  tl.fromTo(cam, { s: 1, x: 0, y: 0 }, { s: 1.12, x: -55, y: -50, duration: 1.4, ease: "power2.inOut", immediateRender: false }, pub).to(cam, { s: 1, x: 0, y: 0, duration: .6 }, st.g1 - .2);
  // 2. штаб: маячок, «НОВОЕ», все к телефонам
  swap("kit", "hq", st.l1 - .5);
  slam("#newad", st.l1 + .3, "ping");
  R.punch(cam, W("t1", "все"), .1); R.sfx("boom", W("t1", "все"), .5);
  tl.fromTo("#X1, #X2", { y: 30 }, { y: 0, duration: .25, ease: "back.out(3)", stagger: .08, immediateRender: false }, W("t1", "все"));
  // 3. звонок: 00:08, сплит
  swap("hq", "call", ring - .2, "cut"); R.sfx("ring", ring, .8);
  tl.fromTo("#pL", { x: -560 }, { x: 0, duration: .35, ease: "power3.out", immediateRender: false }, ring - .2).fromTo("#pR", { x: 560 }, { x: 0, duration: .35, ease: "power3.out", immediateRender: false }, ring - .2);
  tl.fromTo("#pL", { rotation: -1.5 }, { rotation: 1.5, duration: .06, yoyo: true, repeat: 7, immediateRender: false }, ring + .2).set("#pL", { rotation: 0 }, ring + .7);
  slam("#tax", W("t3", "налог") + .1);
  // 4. 47 пропущенных
  swap("call", "kit2", st.l2 - .6);
  for (let k = 0; k < 8; k++) R.sfx("tick", st.l2 + .1 + k * .3, .4);
  // 5. двор: очередь, Толян лезет по лестнице
  swap("kit2", "yard", st.l3 - .7);
  ["#Y1", "#Y2", "#Y3"].forEach((s, i) => { const at = [st.l3 + .2, W("l3", "цвет"), W("l3", "цвет") + .4][i]; tl.fromTo(s, { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: .3, ease: "back.out(2)", immediateRender: false }, at); R.sfx("pop", at, .5); });
  tl.fromTo("#T4", { y: 360 }, { y: 0, duration: .9, ease: "power2.out", immediateRender: false }, W("l3", "лестниц") - .2);
  tl.fromTo("#lad1", { opacity: 0, y: 120 }, { opacity: 1, y: 0, duration: .3, immediateRender: false }, W("l3", "лестниц") - .35); R.sfx("clack", W("l3", "лестниц"), .7);
  // 6. маршрутка: перемотка назад, пуш бота
  swap("yard", "bus", rew, "cut");
  tl.fromTo("#vhs", { opacity: 1 }, { opacity: 0, duration: .6, immediateRender: false }, rew + .5); R.sfx("glitch", rew, 1);
  tl.fromTo("#phC", { opacity: 0, y: 120, rotation: 6 }, { opacity: 1, y: 0, rotation: 0, duration: .4, ease: "back.out(1.8)", immediateRender: false }, W("l4", "бот"));
  R.sfx("ping", W("l4", "бот") + .1, .8);
  tl.fromTo("#phC .bc", { scale: .8, opacity: 0 }, { scale: 1, opacity: 1, duration: .3, ease: "back.out(2)", immediateRender: false }, W("l4", "бот") + .3);
  // 7. подъезд: звонок в дверь
  swap("bus", "door", st.v2 - .7); R.sfx("ring", st.v2 - .4, .5);
  // 8. продано: BMW уезжает, очередь сдувается
  swap("door", "sold", st.l5 - .7);
  slam("#soldst", st.l5 + .1);
  tl.to("#car2, #soldst", { x: -720, duration: 1.1, ease: "power2.in" }, W("l5", "уехал") + .3); R.sfx("whoosh", W("l5", "уехал") + .7, .7);
  tl.to("#Z1", { y: 30, rotation: -4, duration: .5 }, W("l5", "очеред") + .2).to("#Z2", { y: 40, rotation: 5, duration: .5 }, W("l5", "очеред") + .35);
  tl.fromTo("#lad2", { scale: 1 }, { scale: 1.06, duration: .15, yoyo: true, repeat: 1, immediateRender: false }, W("l5", "лестниц")); R.sfx("tap", W("l5", "лестниц"), .6);
  // 9. час спустя: Серёга звонит
  swap("sold", "call2", st.s1 - .6, "cut"); R.sfx("ring", st.s1 - .5, .6);
  tl.fromTo("#qL", { x: -560 }, { x: 0, duration: .35, ease: "power3.out", immediateRender: false }, st.s1 - .6).fromTo("#qR", { x: 560 }, { x: 0, duration: .35, ease: "power3.out", immediateRender: false }, st.s1 - .6);
  slam("#n48", W("g5", "сорок") + .1);
  // 10. мораль
  swap("call2", "moral", st.rule - .7);
  tl.fromTo("#moralCard", { opacity: 0, y: 160 }, { opacity: 1, y: 0, duration: .4, ease: "expo.out", immediateRender: false }, st.rule - .4);
  [W("rule", "собствен"), W("rule", "перекуп"), W("rule", "рынк"), W("rule", "перехват") - .2].forEach((at, i) => { tl.fromTo(`#mo${i}`, { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: .22, immediateRender: false }, at); R.sfx("pop", at, .5); });
  ending(R, st.end - .15);
};
