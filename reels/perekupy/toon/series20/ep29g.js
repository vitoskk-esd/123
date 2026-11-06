// «ПЕРЕГОН ИЗ ЯКУТСКА» (по образцу ep18 «Перегон 9000 км»): ночью «Перехват» присылает Толяну Прадо на треть дешевле — в Якутске.
// 8 сцен: комната (карточка бота), Якутск −48 (продавец Саня), ледовая переправа, ночной зимник (солярка-холодец), пост ДПС, СТО Михалыча, чек, мораль.
// Прадо — картинка владельца (kit/img/prado). Каждый, кто говорит, — в кадре; Лис — за кадром. Сквозной счётчик расходов 💸 — как в ep18.
$("#title .a").textContent = E.rubric; $("#title .b").textContent = E.subtitle; $("#tag span").textContent = "перегон из якутска";
$("#title .a").style.cssText = "font-size:96px;background:#7cc8ff;color:#151515"; $("#title .b").style.cssText = "font-size:100px;background:#151515;color:#fff";
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
const hero = (kind, p, l, t, s = 1, z = 6, o) => `<div class="c" id="${p.toUpperCase()}" style="left:${l}px;top:${t}px;z-index:${z};transform-origin:0 0;transform:scale(${s})">${CHARS[kind](p, o)}</div>`;
const stamp = (id, text, l, t, bg, fg = "#fff", fs = 60, rot = -4) => `<div class="stamp2" id="${id}" style="left:${l}px;top:${t}px;background:${bg};color:${fg};font-size:${fs}px;transform:rotate(${rot}deg)">${text}</div>`;
const PR = (id, v, l, t, w, z = 4) => `<img class="pcar" id="${id}" src="../../kit/img/prado/prado_${v}.png" style="left:${l}px;top:${t}px;width:${w}px;z-index:${z}">`;
const SANYA = { coat: "#5b4636", jacket: "#5b4636", pants: "#2b2f37", ushanka: "#8a6a4a", scarf: "#c0392b", beard: true, hair: "#3a2d22" };
const DPS = { police: true, jacket: "#2a3a5a", pants: "#1f2a44" };
const snow = (sc, n) => add(sc, Array.from({ length: n }, (_, i) => `<div class="snow2" id="${sc}_sn${i}"></div>`).join(""));
const TOL = ["t0", "t", "t2", "t3"];

// 1. комната ночью: карточка бота
scene("room", "room");
add("room", `<div class="botcard" id="botcard" style="top:420px"><div class="bh">ПЕРЕХВАТ · бот · 03:02</div><div class="bb"><b style="color:#ff7a1a">🔥 −30% к рынку</b><br><b>Toyota Land Cruiser Prado · 2 900 000 ₽</b><br>📍 Якутск<br>⏱ 1,2 с после публикации</div></div>`
  + hero("tolyan", "t0", -20, 900, .95, 7));
// 2. Якутск, −48
scene("yak", "winter");
add("yak", PR("car1", "34", 330, 1120, 660) + `<div class="steam" id="steam1" style="left:860px;top:1110px;width:220px;height:170px"></div>`
  + hero("perekup", "sa", 690, 860, .82, 7, SANYA) + hero("tolyan", "t", -10, 860, .85, 7)
  + `<div class="frost" id="frost" style="left:115px;top:1028px;width:115px;height:36px"></div>`
  + `<div class="el" id="thermo2" style="left:720px;top:420px;z-index:9;font-family:'JetBrains Mono';font-weight:800;font-size:90px;color:#7cc8ff;background:#0d0e12;border:7px solid #7cc8ff;border-radius:20px;padding:0 24px;box-shadow:0 0 30px rgba(124,200,255,.6);opacity:0">−48°</div>`
  + stamp("p29", "2 900 000 ₽", 90, 560, "#151515", "#fff", 60, -3) + stamp("sock", "НОСКИ — НЕТ 🧦", 140, 680, "#ffd23f", "#151515", 44, 2));
snow("yak", 40);
// 3. ледовая переправа
scene("ice", "icecross");
add("ice", PR("car2", "side", 240, 1150, 600)
  + `<svg class="crack" id="crk" style="left:0;top:1100px;width:1080px;height:600px" viewBox="0 0 1080 600"><path d="M80 560 L220 420 L200 330 L340 250 L360 140 L470 60 M220 420 L120 360 M340 250 L460 300 L600 260 M600 260 L720 330 L860 300 L1000 380 M720 330 L760 460 L700 560"
     fill="none" stroke="#2b5a80" stroke-width="7" stroke-linejoin="round"/></svg>`
  + stamp("i1", "ЛЁД ТРЕЩИТ", 560, 980, "#1f4fb8", "#fff", 44, 3) + stamp("i2", "ТОЛЯН МОЛИТСЯ 🙏", 80, 1420, "#151515", "#fff", 42, -2) + stamp("i3", "ПРАДО = ЛОДКА 🚤", 300, 560, "#ffd23f", "#151515", 50, -3));
// 4. ночной зимник: солярка — холодец
scene("zim", "zimnik");
add("zim", PR("car3", "side", 180, 1140, 600) + `<div class="el" id="lamp" style="left:520px;top:1330px;font-size:90px;z-index:8;opacity:0">🔥</div>`
  + stamp("z1", "СОЛЯРКА — ЛЕТНЯЯ", 120, 940, "#ff3b30", "#fff", 44, -3) + stamp("z2", "= ХОЛОДЕЦ", 560, 1030, "#ffd23f", "#151515", 50, 3)
  + stamp("z3", "48 ЧАСОВ 🕓", 300, 560, "#151515", "#fff", 56, -2));
snow("zim", 40);
// 5. пост ДПС: фонарик
scene("dps", "dps");
add("dps", PR("car4", "side_r", 20, 1140, 560) + hero("perekup", "dp", 600, 860, .82, 7, DPS) + hero("tolyan", "t2", 340, 880, .8, 8)
  + `<div class="el" id="torch" style="left:0;top:0;width:1080px;height:1920px;z-index:9;opacity:0;pointer-events:none;background:radial-gradient(circle 170px at 280px 1240px, rgba(255,245,200,.55), rgba(255,245,200,0) 70%)"></div>`
  + stamp("fine", "ШТРАФ 1 500 ₽", 120, 560, "#ff3b30", "#fff", 60, -3));
// 6. СТО: блок треснул
scene("sto", "sto");
add("sto", PR("car5", "34", 260, 1180, 600) + hero("mihalych", "m", 10, 820, .9, 7) + hero("tolyan", "t3", 790, 870, .78, 7)
  + stamp("w1", "ВОДА ВМЕСТО АНТИФРИЗА", 60, 1440, "#ff3b30", "#fff", 40, -2) + stamp("w2", "МОТОР — 1 150 000 ₽", 160, 560, "#151515", "#ffd23f", 52, 3));
// 7. чек
scene("check", "desk");
add("check", `<div class="receipt" id="receipt"><h4>ЧЕК · ПЕРЕГОН</h4>${[["Prado", "2 900 000"], ["Самолёт", "40 000"], ["Солярка, 8 000 км", "72 000"], ["Ночёвки", "35 000"],
  ["Паяльная лампа и тягач", "25 000"], ["Штраф", "1 500"], ["Мотор с работой", "1 150 000"]].map(([a, b], i) => `<div class="row" id="r${i}"><span>${a}</span><span>${b}</span></div>`).join("")}
  <div class="tot" id="tot"><span>ИТОГО</span><span>4 223 500</span></div><div class="mk2" id="mkt">рынок ≈ 4 100 000 · +123 500</div></div>`);
// 8. мораль
scene("moral", "desk");
add("moral", `<div class="card" id="moralCard" style="top:400px;z-index:20"><h3>ПЕРЕД ПЕРЕГОНОМ</h3>
  <div class="li" id="mo0">🧮 Билеты, топливо, ночёвки, ремонт — в цену</div><div class="li" id="mo1">🔧 Зимой: антифриз, солярка, пуск на холодную</div>
  <div class="li" id="mo2">📄 На учёт — за 10 дней</div><div class="rule" id="mo3">🔔 В «Перехвате» поставь свой город</div></div>`);

$(".stage").insertAdjacentHTML("beforeend", `<div id="cnt" style="opacity:0">💸 0 ₽</div>`);
TOL.forEach(p => { const s = document.getElementById(p + "-shades"); if (s) s.style.display = ""; });
$("#end h2").innerHTML = E.end;
const bub = (line, html, l, t, tx, fs) => { const b = bubble(line, html, l, t, tx); if (fs) b.style.fontSize = fs + "px"; return b; };
bub("t1", "Брат, никому не отдавай,<br><em>я уже в аэропорту!</em>", 60, 760, 120, 44);
bub("s1", "Забирай, брат! Заводится<br>с полпинка. <em>С третьего.</em>", 300, 620, 520, 42);
bub("d1", "Договор от 15-го, сегодня 30-е.<br><em>На учёт не поставили — протокол.</em>", 120, 700, 620, 36);
bub("t2", "Брат, я её не ставил —<br><em>я её гнал!</em>", 220, 720, 250, 44);
bub("m1", "Довёз? Молодец. Только в системе<br>вода вместо антифриза.<br><em>Блок треснул ещё в Якутске.</em>", 60, 640, 140, 36);

window.build = R => {
  const tl = R.tl, cam = R.camera($("#cam"), { hand: .6 });
  R.grain(.03);
  gsap.set(".scn", { opacity: 0 }); gsap.set("#sc_room", { opacity: 1 });
  const { pop } = common(R, cam, { mood: (k) => k === "mihalych" ? "flat" : "grin" });
  const talk = (lv, f) => lv > .28 && !(lv < .55 && f % 3 === 2);
  R.hooks.push(t => { const f = Math.floor(t * 30), lt = (LIP.tolyan || [])[f] || 0;
    TOL.forEach(p => { if (p !== "t" && document.getElementById(p)) mouth(p, talk(lt, f) ? "talk" : "grin"); });
    if (document.getElementById("sa")) mouth("sa", talk((LIP.sanya || [])[f] || 0, f) ? "talk" : "grin");
    if (document.getElementById("dp")) mouth("dp", talk((LIP.dps || [])[f] || 0, f) ? "talk" : "flat");
    for (const sc of ["yak", "zim"]) for (let i = 0; i < 40; i++) { const d = document.getElementById(`${sc}_sn${i}`);
      const x = (i * 137) % 1080 + Math.sin(t * 1.3 + i) * 30, y = ((i * 251) % 1920 + t * (80 + (i * 31) % 90)) % 1920; d.style.transform = `translate(${x}px,${y}px)`; }
    const s1 = document.getElementById("steam1"); s1.style.transform = `translate(${Math.sin(t * 1.7) * 14}px,${-((t * 40) % 60)}px) scale(${1 + Math.sin(t * 2) * .12})`;
    $("#lamp").style.transform = `scale(${1 + Math.sin(t * 17) * .1})`;
    if (t > st.l3 - .7 && t < st.l4 - .7) $("#car2").style.transform = `rotate(${Math.sin(t * 2.4) * 1.6}deg) translateY(${Math.sin(t * 2.4 + 1) * 6}px)`; });
  const swap = (from, to, at, kind = "swipe") => {
    if (kind === "cut") { tl.set(`#sc_${from}`, { opacity: 0 }, at).set(`#sc_${to}`, { opacity: 1, x: 0, filter: "none" }, at); R.sfx("hit", at, .4); return; }
    tl.set(`#sc_${to}`, { opacity: 1, x: 1080, filter: "blur(14px)" }, at)
      .to(`#sc_${from}`, { x: -1080, filter: "blur(14px)", duration: .35, ease: "power3.in" }, at)
      .to(`#sc_${to}`, { x: 0, filter: "blur(0px)", duration: .38, ease: "power3.out" }, at + .12)
      .set(`#sc_${from}`, { opacity: 0, x: 0, filter: "none" }, at + .5);
    R.sfx("whoosh", at, .6);
  };
  // счётчик расходов (как в ep18): плавно доезжает до новой суммы, «щелчок» на каждом шаге
  const STEPS = [[st.l1 - .4, 40000], [W("l2", "два"), 2940000], [W("l4", "двое"), 3072000], [W("l5", "штраф"), 3073500], [W("l6", "мотор"), 4223500]];
  const fmt = v => Math.round(v).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  R.hooks.push(t => { let v = 0, prev = 0;
    for (const [at, to] of STEPS) { if (t < at) break; v = prev + (to - prev) * Math.min(1, (t - at) / .7); prev = to; }
    $("#cnt").textContent = `💸 ${fmt(v)} ₽`; });
  tl.to("#cnt", { opacity: 1, duration: .3 }, st.l1 - .7); tl.to("#cnt", { opacity: 0, duration: .2 }, st.rule - .7);
  STEPS.forEach(([at]) => { tl.fromTo("#cnt", { scale: 1.35 }, { scale: 1, duration: .3, ease: "back.out(2)", immediateRender: false }, at); R.sfx("tick", at, .9); R.sfx("pop", at + .7, .5); });
  window.MUSIC = { style: "bed", bpm: 100, end: R.dur - 1.2, mute: [[W("m1", "блок") - .1, en.m1 + .2]] };
  const ids = E.lines.map(l => l.id);
  const SW = { l1: st.l1 - .7, l3: st.l3 - .7, l4: st.l4 - .7, d1: st.d1 - .7, m1: st.m1 - .7, l7: st.l7 - .7, rule: st.rule - .7 };
  for (const l of ["t1", "s1", "d1", "t2", "m1"]) { const nx = ids[ids.indexOf(l) + 1]; const ns = SW[nx] ? SW[nx] - .05 : 1e9; pop("#b_" + l, st[l] - .05, Math.min(en[l] + .9, st[nx] - .1, ns)); }
  const slam = (sel, at, sfx = "impact") => { tl.fromTo(sel, { opacity: 0, scale: 2 }, { opacity: 1, scale: 1, duration: .18, ease: "power4.out", immediateRender: false }, at); R.sfx(sfx, at + .02, .7); };

  // 1. комната: телефон вспыхивает, Толян подскакивает (как в ep18)
  R.sfx("ping", W("h", "перехват") - .05, 1);
  tl.fromTo("#botcard", { opacity: 0, scale: .6, y: 60 }, { opacity: 1, scale: 1, y: 0, duration: .35, ease: "back.out(1.8)", immediateRender: false }, W("h", "перехват"));
  tl.fromTo("#T0", { y: 80 }, { y: 0, duration: .4, ease: "back.out(2.5)", immediateRender: false }, W("h", "перехват") + .2);
  tl.to("#title", { opacity: 0, y: -50, duration: .25 }, W("h", "перехват") - .2);
  tl.fromTo(cam, { s: 1 }, { s: 1.08, duration: SW.l1 - .3, ease: "none", immediateRender: false }, 0).set(cam, { s: 1 }, SW.l1);
  R.punch(cam, W("h", "якуц"), .05);
  // 2. Якутск: −48, очки в инее, Прадо в пару
  swap("room", "yak", SW.l1);
  tl.fromTo("#thermo2", { opacity: 0, scale: 2 }, { opacity: 1, scale: 1, duration: .2, immediateRender: false }, W("l1", "минус") - .05); R.sfx("impact", W("l1", "минус"), .6);
  tl.to("#frost", { opacity: 1, duration: .5 }, W("l1", "очки")); R.sfx("glitch", W("l1", "очки"), .3);
  tl.fromTo("#car1", { x: 600 }, { x: 0, duration: 1, ease: "power3.out", immediateRender: false }, SW.l1 + .3);
  slam("#p29", W("l2", "два"), "clack"); slam("#sock", W("l2", "носк"), "pop");
  // 3. ледовая переправа: трещины, камера дрожит
  swap("yak", "ice", SW.l3);
  tl.fromTo("#car2", { x: 500 }, { x: -60, duration: en.l3 - SW.l3, ease: "none", immediateRender: false }, SW.l3);
  tl.to("#crk", { opacity: 1, duration: .15 }, W("l3", "трещ")); R.sfx("glitch", W("l3", "трещ"), .7); R.shake(cam, W("l3", "трещ"), .6, .5);
  slam("#i1", W("l3", "трещ"), "pop"); slam("#i2", W("l3", "молит"), "pop"); slam("#i3", W("l3", "лодк"), "impact");
  // 4. зимник: встал, паяльная лампа
  swap("ice", "zim", SW.l4);
  slam("#z1", W("l4", "летн"), "pop"); slam("#z2", W("l4", "холод"), "impact");
  tl.to("#lamp", { opacity: 1, duration: .2 }, W("l4", "паяль")); slam("#z3", W("l4", "двое"), "pop");
  // 5. пост ДПС: фонарик
  swap("zim", "dps", SW.d1);
  tl.to("#torch", { opacity: 1, duration: .2 }, SW.d1 + .4);
  tl.fromTo("#torch", { x: 400 }, { x: 0, duration: .8, ease: "power2.out", immediateRender: false }, SW.d1 + .4);
  slam("#fine", W("l5", "штраф"), "impact");
  // 6. СТО
  swap("dps", "sto", SW.m1);
  tl.fromTo("#M", { x: -500 }, { x: 0, duration: .6, ease: "back.out(1.3)", immediateRender: false }, SW.m1 + .1);
  slam("#w1", W("m1", "вода"), "pop"); R.punch(cam, W("m1", "блок"), .07); R.sfx("boom", W("m1", "блок"), .5);
  slam("#w2", W("l6", "мотор"), "impact");
  // 7. чек
  swap("sto", "check", SW.l7);
  tl.fromTo("#receipt", { y: -500 }, { y: 0, duration: .6, ease: "power2.out", immediateRender: false }, SW.l7);
  for (let i = 0; i < 7; i++) { const at = SW.l7 + .4 + i * .22; tl.fromTo(`#r${i}`, { opacity: 0 }, { opacity: 1, duration: .05, immediateRender: false }, at); R.sfx("type", at, .6); }
  slam("#tot", W("l7", "дороже"), "impact"); slam("#mkt", W("l7", "закал") - .4, "pop");
  // 8. мораль
  swap("check", "moral", SW.rule);
  tl.fromTo("#moralCard", { opacity: 0, y: 160 }, { opacity: 1, y: 0, duration: .4, ease: "expo.out", immediateRender: false }, st.rule - .4);
  [W("rule", "билет"), W("rule", "диагност"), W("rule", "учет"), W("rule", "перехват") - .2].forEach((at, i) => { tl.fromTo(`#mo${i}`, { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: .22, immediateRender: false }, at); R.sfx("pop", at, .5); });
  ending(R, st.end - .15);
};


// ── ep29g «Ретро»: та же история и озвучка, другая «съёмка» ──
(() => {
  const C = {"t1": "«ЗАВОДИТСЯ", "t2": "С ПОЛПИНКА»", "c1": "#c0392b", "c2": "#f4e7c3", "cam": "pan", "music": {"style": "show", "bpm": 104, "tension": [0.2, 1.6]}};
  const orig = window.build;
  window.build = R => {
    orig(R);
    const tl = R.tl;
    $("#title .a").textContent = C.t1; $("#title .a").style.cssText = `font-size:110px;background:${C.c1};color:${C.c2}`;
    const b = $("#title .b"); b.style.display = ""; b.textContent = C.t2; b.style.cssText = `font-size:60px;background:${C.c2};color:${C.c1}`;
    tl.set("#title", { opacity: 1, y: 0 }, 0).to("#title", { opacity: 0, y: -50, duration: .3 }, 1.2);
    const S = [["room", 0, st.l1 - .7, "40% 55%"], ["yak", st.l1 - .7, st.l3 - .7, "50% 60%"], ["ice", st.l3 - .7, st.l4 - .7, "50% 65%"],
               ["zim", st.l4 - .7, st.d1 - .7, "45% 65%"], ["dps", st.d1 - .7, st.m1 - .7, "50% 55%"], ["sto", st.m1 - .7, st.l7 - .7, "50% 55%"],
               ["check", st.l7 - .7, st.rule - .7, "50% 40%"], ["moral", st.rule - .7, st.end - .15, "50% 40%"]];
    S.forEach(([n, a, z, o], i) => {
      const sel = `#sc_${n}`, d = z - a;
      if (C.cam === "in") tl.fromTo(sel, { scale: 1 }, { scale: 1.12, transformOrigin: o, duration: d, ease: "none", immediateRender: false }, a);
      else if (C.cam === "out") tl.fromTo(sel, { scale: 1.12 }, { scale: 1, transformOrigin: o, duration: d, ease: "none", immediateRender: false }, a);
      else if (C.cam === "tilt") tl.fromTo(sel, { scale: 1.06, rotation: i % 2 ? -.8 : .8 }, { scale: 1.1, rotation: 0, transformOrigin: o, duration: d, ease: "none", immediateRender: false }, a);
      else if (C.cam === "punch") tl.fromTo(sel, { scale: 1 }, { scale: 1.09, transformOrigin: o, duration: .45, ease: "back.out(2)", immediateRender: false }, a + .5);
      else if (C.cam === "pan") tl.fromTo(sel, { scale: 1.1, xPercent: i % 2 ? 2.5 : -2.5 }, { scale: 1.1, xPercent: i % 2 ? -2.5 : 2.5, transformOrigin: "50% 50%", duration: d, ease: "none", immediateRender: false }, a);
      else if (C.cam === "vpan") tl.fromTo(sel, { scale: 1.1, yPercent: 2 }, { scale: 1.1, yPercent: -2, transformOrigin: "50% 50%", duration: d, ease: "none", immediateRender: false }, a);
      else tl.fromTo(sel, { scale: i % 2 ? 1 : 1.1 }, { scale: i % 2 ? 1.1 : 1, transformOrigin: o, duration: d, ease: "none", immediateRender: false }, a);
    });
    window.MUSIC = Object.assign({}, window.MUSIC, C.music);
  };
})();
