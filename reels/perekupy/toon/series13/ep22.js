// «ДВОЙНИК» — 10 сцен: перекрёсток, паркинг (флешбэк), подпольный гараж, экспертиза, кабинет следователя, тройной сплит,
// развязка на перекрёстке, ДПС, эвакуатор на штрафстоянку, мораль. Камри — рисунки владельца (kit/img/camry), ДПС и эвакуатор — chars4.js.
$("#title .a").textContent = E.rubric; $("#title .b").style.display = "none"; $("#tag span").textContent = "двойник";
$("#title .a").style.cssText = "font-size:120px;background:#151515;color:#fff";
document.querySelector("#cam > svg#bg")?.remove();
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
const cam34 = (id, l, t, w, z = 4) => `<img class="pcar" id="${id}" src="../../kit/img/camry/camry.png" style="left:${l}px;top:${t}px;width:${w}px;z-index:${z}">`;
const camSide = (id, l, t, w, z = 4) => `<img class="pcar" id="${id}" src="../../kit/img/camry/camry_side.png" style="left:${l}px;top:${t}px;width:${w}px;z-index:${z}">`;
const person = (sc, kind, p, l, t, s = 1, z = 7) => add(sc, `<div class="c" id="${p.toUpperCase()}" style="left:${l}px;top:${t}px;z-index:${z};transform:scale(${s})">${CHARS[kind](p)}</div>`);
const stamp = (id, text, l, t, bg, fg = "#fff", fs = 60, rot = -4) => `<div class="stamp2" id="${id}" style="left:${l}px;top:${t}px;background:${bg};color:${fg};font-size:${fs}px;transform:rotate(${rot}deg)">${text}</div>`;
const plate = (id, l, t, rot) => `<div class="plate" id="${id}" style="left:${l}px;top:${t}px;transform:rotate(${rot}deg)">Р 777 АА</div>`;
const panel = (id, bg, l) => `<div class="pan" id="${id}" style="left:${l}px"><div class="pin" style="left:${-(1080 - 330) / 2}px">${BGS[bg].replace('id="bg"', "")}</div>
  <img class="pcar" id="${id}c" src="../../kit/img/camry/camry_side.png" style="left:10px;bottom:30px;width:300px;z-index:3"><div class="gone" id="${id}g">ТОЛЬКО УЕХАЛ</div></div>`;
const TOL = ["t", "t2"], SER = ["s", "s2", "s3"];

// 1. перекрёсток: две одинаковые Камри на красный
scene("hook", "cross");
add("hook", cam34("a1", 20, 1140, 520) + cam34("a2", 540, 1140, 520) + plate("p1", 160, 1080, -3) + plate("p2", 690, 1080, 3)
  + `<div class="el" id="eq" style="left:500px;top:1180px;font-family:Unbounded;font-weight:900;font-size:110px;color:#ffd23f;-webkit-text-stroke:10px #151515;paint-order:stroke fill;z-index:9;opacity:0">=</div>`);
// 2. паркинг B2: продажа, «месяц назад»
scene("park", "parkade");
add("park", cam34("b", 250, 1120, 620) + stamp("ago", "⏪ МЕСЯЦ НАЗАД", 380, 520, "#ffd23f", "#151515", 44, 3)
  + `<div class="vhs" id="vhs"></div>` + stamp("warm", "ЕЩЁ ТЁПЛЫЕ 🔥", 150, 640, "#ff3b30", "#fff", 50, -3));
person("park", "tolyan", "t", -30, 900, .9, 6); person("park", "seryoga", "s", 720, 900, .9, 6);
// 3. подпольный гараж: клейма, искры, «Ж»
scene("forge", "numgarage");
add("forge", `<div class="vin" id="vin1">${"JTNBK4".split("").map((c, i) => `<i id="vc${i}">${c}</i>`).join("")}<i id="vcZh" class="zh">Ж</i></div>`
  + `<div class="el" id="hammer" style="left:520px;top:1060px;font-size:130px;z-index:9;transform-origin:80% 80%">🔨</div>`
  + Array.from({ length: 12 }, (_, i) => `<div class="spark" id="fs${i}" style="left:${560 + (i * 37) % 200}px;top:${1230 + (i * 23) % 60}px"></div>`).join("")
  + stamp("witness", "ПРОГРАММА ЗАЩИТЫ СВИДЕТЕЛЕЙ 🕵", 60, 520, "#151515", "#ffd23f", 34, -3));
// 4. экспертиза: Камри боком на подъёмнике, лупа, «Ж»
scene("exp", "expert");
add("exp", camSide("d", 110, 862, 860) + `<div class="vin" id="vin2" style="top:1320px;left:200px">JTN…К<i class="zh">Ж</i>4…</div>`
  + `<div class="el" id="loupe" style="left:620px;top:1250px;font-size:130px;z-index:9">🔍</div>`
  + `<div class="bigzh" id="bigzh">Ж?</div>`);
person("exp", "seryoga", "s2", 760, 1010, .6, 6);
// 5. кабинет следователя: доска, нитки, «оригинал?»
scene("det", "detective");
add("det", `<svg class="el" id="threads" viewBox="0 0 1080 1920" style="left:0;top:0;width:1080px;height:1920px;z-index:3;pointer-events:none">
  <path id="thr" d="M160 316 L420 256 L700 296 L900 376" stroke="#e53935" stroke-width="6" fill="none" stroke-dasharray="900" stroke-dashoffset="900"/></svg>`
  + stamp("orig", "ОРИГИНАЛ ?", 640, 1100, "#ff3b30", "#fff", 48, 4) + stamp("legal", "ТОЛЬКО ЗАКОННО", 300, 860, "#151515", "#4cd964", 44, -3));
person("det", "seryoga", "s3", -30, 900, .9, 6);
// 6. тройной сплит: мойка, заправка, салон — «только уехал»
scene("split", "night");
add("split", panel("q0", "mall", 30) + panel("q1", "azs", 375) + panel("q2", "dealer", 720) + stamp("step", "НА ШАГ ВПЕРЕДИ. КАК ПЕРЕКУП", 80, 1340, "#ffd23f", "#151515", 40, -3));
// 7. перекрёсток: из соседней Камри выходит Толян
scene("cross2", "cross");
add("cross2", cam34("g1", 20, 1140, 520) + cam34("g2", 540, 1140, 520) + stamp("soul", "ОРИГИНАЛ — ДЛЯ ДУШИ 💛", 60, 520, "#ff3b30", "#fff", 46, -3));
person("cross2", "tolyan", "t2", 640, 880, .9, 6);
// 8. ДПС сзади, отсветы мигалки
scene("dps", "cross");
add("dps", `<div class="el" id="police" style="left:280px;top:1000px;width:520px;height:198px;z-index:3">${CHARS.sedan("pol", { color: "#f4f6f8", rim: "#9aa3ab", police: true })}</div>`
  + cam34("h1", 20, 1140, 500, 5) + cam34("h2", 530, 1140, 500, 5)
  + `<div class="el" id="flashR" style="left:0;top:0;width:1080px;height:1920px;z-index:2;background:radial-gradient(circle 420px at 30% 58%, rgba(255,59,48,.35), transparent);opacity:0"></div>`
  + `<div class="el" id="flashB" style="left:0;top:0;width:1080px;height:1920px;z-index:2;background:radial-gradient(circle 420px at 70% 58%, rgba(46,134,222,.35), transparent);opacity:0"></div>`
  + stamp("smile", "ПЕРВАЯ УЛЫБКА ЗА СМЕНУ 🙂", 90, 520, "#1d4fb8", "#fff", 42, -3));
// 9. эвакуатор на штрафстоянку: обе Камри на платформе, Марк у сетки
scene("tow", "impound");
add("tow", `<img class="pcar" id="mk" src="../../kit/img/markii/markii.png" style="left:690px;top:1095px;width:340px;z-index:3;filter:grayscale(.3)">`
  + `<div id="truck" style="position:absolute;left:0;top:0;width:1080px;height:1920px;z-index:4">
     <div class="el" style="left:-150px;top:1070px;width:1000px;height:350px">${CHARS.flatbed("fb")}</div>
     <img class="pcar" src="../../kit/img/camry/camry.png" style="left:-10px;top:1141px;width:300px;z-index:1">
     <img class="pcar" src="../../kit/img/camry/camry.png" style="left:290px;top:1141px;width:300px;z-index:1"></div>`
  + stamp("hi", "ПРИВЕТ, СЕРЁГА 👋", 560, 960, "#ffd23f", "#151515", 34, 4) + stamp("twice", "СПРАВЕДЛИВОСТЬ × 2", 120, 520, "#151515", "#fff", 50, -3));
// 10. мораль
scene("moral", "expert");
add("moral", `<div class="card" id="moralCard" style="top:380px;z-index:20"><h3>VIN — В ТРЁХ МЕСТАХ</h3>
  <div class="li" id="mo0">🚗 На кузове · 📄 в ПТС · 🖥 в базе ГИБДД</div><div class="li" id="mo1">🔍 Шрифт, сварка, свежая краска у номера</div>
  <div class="li" id="mo2">🚓 Розыск — до оплаты, не после</div><div class="rule" id="mo3">🔔 Свежие объявления — бот «Перехват»</div></div>`);

TOL.forEach(p => { const s = document.getElementById(p + "-shades"); if (s) s.style.display = ""; });
$("#end h2").innerHTML = E.end;
bubble("t1", "Камри, четырнадцатый год,<br>девятьсот! <em>Документы — свежие!</em>", 40, 700, 140);
bubble("k1", "Буква<br><em>какая?</em>", 560, 700, 300);
bubble("k2", "Да<br><em>любую!</em>", 60, 760, 140);
bubble("k3", "Ставлю<br><em>«Ж».</em>", 560, 760, 300);
bubble("e1", "Номер перебит. А буквы «Ж»<br>в VIN не бывает. <em>У японцев<br>её просто нет.</em>", 40, 600, 420);
bubble("s1", "А может, это<br><em>японская «Ж»?</em>", 520, 960, 420);
bubble("d1", "Машина в розыске.<br>Угнана в Самаре.<br><em>Оригинал ездит по городу.</em>", 330, 640, 300);
bubble("t2", "Брат…<br><em>мир тесен.</em>", 420, 680, 420);

window.build = R => {
  const tl = R.tl, cam = R.camera($("#cam"), { hand: .6 });
  R.grain(.03);
  gsap.set(".scn", { opacity: 0 }); gsap.set("#sc_hook", { opacity: 1 });
  const { pop } = common(R, cam, { mood: (k, t) => k === "seryoga" ? (t > st.e1 ? "o" : "grin") : "grin" });
  R.hooks.push(t => { const f = Math.floor(t * 30), ls = (LIP.seryoga || [])[f] || 0, lt = (LIP.tolyan || [])[f] || 0;
    const talk = lv => lv > .28 && !(lv < .55 && f % 3 === 2);
    SER.forEach(p => { if (p !== "s" && document.getElementById(p)) mouth(p, talk(ls) ? "talk" : "o"); });
    TOL.forEach(p => { if (p !== "t" && document.getElementById(p)) mouth(p, talk(lt) ? "talk" : "grin"); }); });
  const swap = (from, to, at, kind = "swipe") => {
    if (kind === "cut") { tl.set(`#sc_${from}`, { opacity: 0 }, at).set(`#sc_${to}`, { opacity: 1, x: 0, filter: "none" }, at); R.sfx("hit", at, .4); return; }
    tl.set(`#sc_${to}`, { opacity: 1, x: 1080, filter: "blur(14px)" }, at)
      .to(`#sc_${from}`, { x: -1080, filter: "blur(14px)", duration: .35, ease: "power3.in" }, at)
      .to(`#sc_${to}`, { x: 0, filter: "blur(0px)", duration: .38, ease: "power3.out" }, at + .12)
      .set(`#sc_${from}`, { opacity: 0, x: 0, filter: "none" }, at + .5);
    R.sfx("whoosh", at, .6);
  };
  window.MUSIC = { style: "bed", bpm: 100, end: R.dur - 1.2, mute: [[en.e1 - .2, en.s1 + .4], [st.t2 - .3, en.t2 + .3]] };
  for (const l of ["t1", "k1", "k2", "k3", "e1", "s1", "d1", "t2"]) { const nx = E.lines[E.lines.findIndex(x => x.id === l) + 1]; pop("#b_" + l, st[l] - .05, Math.min(en[l] + .9, st[nx.id] - .1)); }
  const slam = (sel, at, sfx = "impact") => { tl.fromTo(sel, { opacity: 0, scale: 2 }, { opacity: 1, scale: 1, duration: .18, ease: "power4.out", immediateRender: false }, at); R.sfx(sfx, at + .02, .7); };

  // 1. перекрёсток: камера мечется между Камри, «=» между номерами
  tl.fromTo(cam, { x: 120, s: 1.08 }, { x: -120, s: 1.08, duration: .9, ease: "power2.inOut", yoyo: true, repeat: 3, immediateRender: false }, .3).set(cam, { x: 0, s: 1 }, W("h", "вопрос") - .1);
  slam("#eq", W("h", "номер"), "pop");
  tl.to("#title", { opacity: 0, y: -50, duration: .25 }, W("h", "за") - .1);
  R.punch(cam, W("h", "какой"), .1); R.sfx("boom", W("h", "какой"), .7);
  // 2. паркинг: перемотка VHS, продажа
  swap("hook", "park", st.t1 - .9, "cut");
  tl.fromTo("#vhs", { opacity: 1 }, { opacity: 0, duration: .6, immediateRender: false }, st.t1 - .9); R.sfx("glitch", st.t1 - .9, .9);
  slam("#ago", st.t1 - .8, "pop");
  slam("#warm", W("l1", "теплы"), "pop");
  // 3. гараж: молоток бьёт буквы, на «Ж» — удар и тишина
  swap("park", "forge", st.l2 - .7);
  const hits = [st.l2 + .4, st.l2 + .9, st.l2 + 1.4, st.l2 + 1.9, st.l2 + 2.4, st.l2 + 2.9];
  hits.forEach((at, i) => { tl.fromTo("#hammer", { rotation: -40 }, { rotation: 10, duration: .12, ease: "power4.in", immediateRender: false }, at - .12)
    .fromTo(`#vc${i}`, { opacity: 0, scale: 1.6 }, { opacity: 1, scale: 1, duration: .1, immediateRender: false }, at); R.sfx("clack", at, .9); });
  const zh = en.k3 - .25;
  tl.fromTo("#hammer", { rotation: -60 }, { rotation: 10, duration: .14, ease: "power4.in", immediateRender: false }, zh - .14)
    .fromTo("#vcZh", { opacity: 0, scale: 2.2 }, { opacity: 1, scale: 1, duration: .12, immediateRender: false }, zh);
  R.sfx("impact", zh, 1); R.shake(cam, zh, 1, .35);
  for (let i = 0; i < 12; i++) tl.fromTo(`#fs${i}`, { opacity: 1, x: 0, y: 0 }, { opacity: 0, x: (i % 2 ? 1 : -1) * (40 + i * 6), y: -50 - i * 5, duration: .45, immediateRender: false }, zh + i * .02);
  slam("#witness", W("l2", "программ"), "pop");
  // 4. экспертиза: лупа по VIN, огромная «Ж?»
  swap("forge", "exp", st.e1 - .7);
  tl.fromTo("#loupe", { x: -300 }, { x: 0, duration: 1.4, ease: "power1.inOut", immediateRender: false }, st.e1);
  tl.fromTo("#bigzh", { opacity: 0, scale: .3 }, { opacity: 1, scale: 1, duration: .3, ease: "back.out(2)", immediateRender: false }, W("e1", "букв") + .3)
    .to("#bigzh", { opacity: 0, duration: .2 }, st.s1 + .1);
  R.sfx("ping", W("e1", "букв") + .3, .7);
  // 5. кабинет: нитка тянется по доске
  swap("exp", "det", st.d1 - .7);
  tl.to("#thr", { attr: { "stroke-dashoffset": 0 }, duration: 1.4, ease: "power1.inOut" }, st.d1);
  slam("#orig", W("d1", "оригинал"), "pop"); slam("#legal", W("d1", "законно"), "impact");
  // 6. сплит: окна по словам, в каждом Камри уезжает
  swap("det", "split", st.l3 - .7);
  [["q0", W("l3", "мойк")], ["q1", W("l3", "заправ")], ["q2", W("l3", "салон")]].forEach(([q, at]) => {
    tl.fromTo(`#${q}`, { opacity: 0, y: 80 }, { opacity: 1, y: 0, duration: .3, ease: "back.out(1.6)", immediateRender: false }, at - .35)
      .fromTo(`#${q}c`, { x: 0 }, { x: 420, duration: .5, ease: "power2.in", immediateRender: false }, at)
      .fromTo(`#${q}g`, { opacity: 0, scale: 1.6 }, { opacity: 1, scale: 1, duration: .18, immediateRender: false }, at + .45);
    R.sfx("whoosh", at, .5); R.sfx("pop", at + .45, .5); });
  slam("#step", W("l3", "перекуп"), "pop");
  // 7. развязка: Толян выходит из Камри
  swap("split", "cross2", st.l4 - .7);
  tl.fromTo("#T2", { x: -260, opacity: 0 }, { x: 0, opacity: 1, duration: .6, ease: "back.out(1.4)", immediateRender: false }, W("l4", "выход"));
  R.sfx("tap", W("l4", "выход"), .7);
  tl.fromTo(cam, { s: 1 }, { s: 1.15, x: -160, duration: .5, ease: "power2.out", immediateRender: false }, st.t2 - .3).to(cam, { s: 1, x: 0, duration: .4 }, en.t2 + .3);
  slam("#soul", W("l5", "души"), "pop");
  // 8. ДПС: въезжает, мигалка
  swap("cross2", "dps", st.l6 - .6, "cut");
  tl.fromTo("#police", { x: -900 }, { x: 0, duration: .9, ease: "power3.out", immediateRender: false }, st.l6 - .5); R.sfx("riser", st.l6 - .5, .6);
  for (let k = 0; k < 12; k++) { const at = st.l6 + k * .4; tl.set("#flashR", { opacity: k % 2 ? 0 : 1 }, at).set("#flashB", { opacity: k % 2 ? 1 : 0 }, at); }
  R.sfx("bleep", st.l6 - .1, .12); R.sfx("bleep", st.l6 + .15, .12);
  slam("#smile", W("l6", "улыбн"), "pop");
  // 9. эвакуатор въезжает на штрафстоянку
  swap("dps", "tow", st.l7 - .7);
  tl.fromTo("#truck", { x: -1100 }, { x: 0, duration: 1.6, ease: "power2.out", immediateRender: false }, st.l7 - .5); R.sfx("riser", st.l7 - .5, .6);
  slam("#twice", W("l7", "справед"), "impact");
  tl.fromTo("#mk", { filter: "grayscale(.3) brightness(1)" }, { filter: "grayscale(.3) brightness(1.6)", duration: .15, yoyo: true, repeat: 3, immediateRender: false }, W("l7", "марк"));
  slam("#hi", W("l7", "марк") + .2, "ping");
  // 10. мораль
  swap("tow", "moral", st.rule - .7);
  tl.fromTo("#moralCard", { opacity: 0, y: 160 }, { opacity: 1, y: 0, duration: .4, ease: "expo.out", immediateRender: false }, st.rule - .4);
  [W("rule", "кузов"), W("rule", "шрифт"), W("rule", "розыск"), W("rule", "свеж", 1) - .2].forEach((at, i) => { tl.fromTo(`#mo${i}`, { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: .22, immediateRender: false }, at); R.sfx("pop", at, .5); });
  ending(R, st.end - .15);
};
