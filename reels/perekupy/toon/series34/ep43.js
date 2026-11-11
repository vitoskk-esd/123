// «ТОЛЯН: СО СТА ТЫСЯЧ · 8» — «Школьная парковка». Капитал 350 000 (итог части 7). Физрук Ильдар из части 7 зовёт к учителям.
// Приёмы (новые): школьный звонок между сценами и «линейка» машин учителей; мел на доске (Caveat, буквы проявляются со скрипом); классный журнал
// с оценками Толяну; расписание уроков → фильтры бота. Поворот: Толян сам поднимает цену трудовику → заказ всей учительской. Крючок: место директора.
// Машины владельца: Лансер Эволюшн (физрук), белая Гранта (математику находит бот). Фоны новые: shkpark, kabinet, masterskaya, uchitelskaya.
$("#title .a").textContent = E.rubric; $("#title .b").textContent = E.subtitle; $("#tag span").textContent = "школьная парковка";
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
const hero = (p, l, t, s, o, z = 6, kind = "perekup") => `<div class="c" id="${p.toUpperCase()}" style="left:${l}px;top:${t}px;z-index:${z};transform-origin:0 0;transform:scale(${s})">${CHARS[kind](p, o)}</div>`;
const tol = (p, l, t, s, z = 6) => hero(p, l, t, s, undefined, z, "tolyan");
const stamp = (id, text, l, t, bg, fg = "#fff", fs = 60, rot = -4) => `<div class="stamp2" id="${id}" style="left:${l}px;top:${t}px;background:${bg};color:${fg};font-size:${fs}px;transform:rotate(${rot}deg)">${text}</div>`;
const CAR = (id, img, l, t, w, z = 5) => `<img class="pcar" id="${id}" src="../../kit/img/${img}" style="left:${l}px;top:${t}px;width:${w}px;z-index:${z}">`;
const PHONE = (id, l, t, w, inner) => `<div class="el" id="${id}" style="left:${l}px;top:${t}px;width:${w}px;z-index:12;background:#0d0e12;border:8px solid #2a2d34;border-radius:44px;padding:22px;box-shadow:0 0 70px rgba(120,180,255,.4);opacity:0">${inner}</div>`;
const BOT = (body, fs = 30) => `<div style="font-family:Onest;font-weight:700;font-size:24px;color:#8b93a3">ПЕРЕХВАТ · бот</div><div style="background:#1c1f26;border-radius:22px;padding:16px 20px;margin-top:10px;font-family:Onest;color:#fff;font-size:${fs}px;line-height:1.42">${body}</div>`;
const SIGN = (id, l, t, text) => `<div class="el sign" id="${id}" style="left:${l}px;top:${t}px">${text}</div>`;
// мел: блок проявляется слева направо (clip-path), как будто пишут рукой
const CHALK = (id, l, t, html, fs = 70) => `<div class="el chalk" id="${id}" style="left:${l}px;top:${t}px;font-size:${fs}px">${html}</div>`;
const JOURNAL = (id, rows, l, t) => `<div class="el jrn" id="${id}" style="left:${l}px;top:${t}px"><div class="jh">КЛАССНЫЙ ЖУРНАЛ · 8 «Т»</div>
  ${rows.map(([w, g], k) => `<div class="jr"><span>${w}</span><b id="${id}_g${k}">${g}</b></div>`).join("")}</div>`;
const ILDAR = { jacket: "#1f4fb8", pants: "#1f4fb8", hair: "#1d1d1f", cap: "#fff" };
const LEV = { jacket: "#7a5a3a", pants: "#4a3a2a", hair: "#aeb4bb", glasses: true, tie: "#2f6db5", mustache: true };
const EGOR = { coat: "#2f5d9c", jacket: "#2f5d9c", pants: "#2b2f37", hair: "#c9ccd1", beard: true };
const DIR = { jacket: "#2b2f37", pants: "#2b2f37", hair: "#3a2d22", tie: "#c0392b" };
const Q = (id, l, t, fs = 200) => `<div class="el qmark" id="${id}" style="left:${l}px;top:${t}px;font-size:${fs}px">?</div>`;

// 1. парковка: Толян и Ильдар; 2. линейка машин
scene("park", "shkpark");
add("park", tol("t1", 600, 860, .8) + hero("il1", 120, 870, .8, ILDAR));
scene("line", "shkpark");
add("line", CAR("c_evo", "evo/evo_side.png", 5, 1318, 300, 6) + CAR("c_cor", "corolla/corolla.png", 290, 1330, 300, 6) + CAR("c_5", "vaz2105/vaz2105_side.png", 560, 1328, 290, 6)
  + hero("il2", 75, 1062, .5, ILDAR, 4) + hero("lv1", 355, 1062, .5, LEV, 4) + hero("eg1", 615, 1062, .5, EGOR, 4)
  + SIGN("s1", 20, 1450, "1 «А» · Эволюшн") + SIGN("s2", 300, 1450, "2 «Б» · Королла") + SIGN("s3", 580, 1450, "3 «В» · «пятёрка»") + Q("q1", 890, 1130));
// 3. кабинет математики: доска
scene("kab", "kabinet");
add("kab", CHALK("ch1", 120, 370, "Королла 2012<br>= <span class='strk'>1 000 000 ₽<i id='strike'></i></span>", 76) + CHALK("ch2", 150, 540, "(аксиома)", 58)
  + CHALK("ch3", 600, 380, "≈ 820 000 ₽<br><span style='font-size:46px'>(31 объявл.)</span>", 66)
  + hero("lv2", 650, 640, .78, LEV) + tol("t2", 80, 660, .78)
  + PHONE("mkt", 300, 860, 360, BOT(`<b>Toyota Corolla 2012</b><br>📊 рынок ≈ 820 000 ₽<br>(31 объявл.)`, 26))
  + JOURNAL("j1", [["Королла · расчёт", "5"]], 280, 1380));
// 4. мастерская: Егорыч и «пятёрка»
scene("mast", "masterskaya");
add("mast", CAR("c_5b", "vaz2105/vaz2105_34.png", 380, 1050, 600, 3) + hero("eg2", 700, 780, .8, EGOR) + tol("t3", 20, 800, .8)
  + stamp("mk180", "РЫНОК ≈ 180 000", 60, 1420, "#ffd23f", "#151515", 50, -3)
  + JOURNAL("j2", [["Королла · расчёт", "5"], ["«пятёрка» · честность", "5+"]], 280, 1500));
// 5. учительская: заявка; 6. расписание = фильтры
scene("uch", "uchitelskaya");
add("uch", hero("dr", 360, 840, .82, DIR, 7) + hero("lv3", 680, 880, .7, LEV, 5) + hero("il3", 830, 880, .7, ILDAR, 5) + hero("eg3", 160, 880, .7, EGOR, 5) + tol("t4", -40, 900, .78));
scene("rasp", "uchitelskaya");
add("rasp", `<div class="el tt" id="tt">${[["1 урок · Ларгус до 700", "Ильдар"], ["2 урок · Гранта до 800", "Лев М."], ["3 урок · Нива до 600", "Егорыч"],
    ["4 урок · Веста до 1 млн", "завуч"], ["5 урок · Рио до 900", "химичка"], ["6 урок · Солярис", "библиотекарь"]].map(([a, b], k) => `<div id="tr${k}">${a} — <b>${b}</b><i>🔔</i></div>`).join("")}</div>`
  + tol("t5", 650, 880, .8)
  + PHONE("pn1", 40, 1060, 580, BOT(`🔔 <b>Lada Largus 2017 · 690 000 ₽</b><br>фильтр «1 урок» · ⏱ 1 с после публикации`, 27))
  + PHONE("pn2", 40, 1060, 580, BOT(`🔔 <b>Lada Granta 2020 · 780 000 ₽</b><br>фильтр «2 урок» · ⏱ 1 с после публикации<br><img src="../../kit/img/granta/granta_34.png" style="width:100%;margin-top:8px;border-radius:12px;background:#e8ecf0">`, 27)));
// 7. итог на парковке
scene("fin", "shkpark");
add("fin", CAR("c_evo2", "evo/evo_34.png", 20, 1150, 330, 3) + CAR("c_gr", "granta/granta_34.png", 330, 1150, 330, 3) + tol("t6", 560, 860, .78) + Q("q2", 880, 1090, 170)
  + JOURNAL("j3", [["Королла · расчёт", "5"], ["«пятёрка» · честность", "5+"], ["подбор · 6 машин", "5"]], 40, 620)
  + `<div class="ctab" id="cta2" style="top:1330px"><div class="cbig">Бот <span>«Перехват»</span><br>— ссылка в шапке</div><div class="csm">сколько фильтров — столько машин · ~1 с</div></div>`);
$(".stage").insertAdjacentHTML("beforeend", `<div id="cnt">💰 <span id="cv">350 000</span> ₽ <em id="cd"></em></div><div id="bell">🔔</div>`);
$("#end h2").innerHTML = E.end;

const bub = (line, html, l, t, tx, fs) => { const b = bubble(line, html, l, t, tx); if (fs) b.style.fontSize = fs + "px"; return b; };
bub("i1", "Брат, построил всех,<br><em>как на линейке!</em>", 40, 720, 218, 40);
bub("m1", "Анатолий, к доске.<br><em>Моя Королла — миллион.</em><br>Это аксиома.", 430, 440, 354, 34);
bub("t1", "Бот говорит — восемьсот двадцать.<br><em>По 31 объявлению.</em>", 30, 545, 184, 32);
bub("m2", "…Садитесь.<br><em>Пять.</em>", 520, 500, 264, 48);
bub("e1", "«Пятёрка». Сам перебирал, каждую гайку.<br><em>Сто двадцать — и забирай.</em>", 250, 640, 588, 32);
bub("t2", "Егорыч… ты продешевил.<br><em>Беру за сто шестьдесят.</em>", 30, 660, 128, 38);
bub("e2", "Ты чего, парень…<br><em>сам цену поднял?</em>", 400, 660, 438, 42);
bub("d1", "Анатолий, у нас к вам…<br><em>коллективная заявка.</em>", 250, 700, 252, 38);

window.build = R => {
  const tl = R.tl, cam = R.camera($("#cam"), { hand: .6 });
  R.grain(.03);
  gsap.set(".scn", { opacity: 0 }); gsap.set("#sc_park", { opacity: 1 });
  const { pop } = common(R, cam);
  const talk = (lv, f) => lv > .28 && !(lv < .55 && f % 3 === 2);
  const SP = { t1: "tolyan", t2: "tolyan", t3: "tolyan", t4: "tolyan", t5: "tolyan", t6: "tolyan", il1: "ildar", il2: "ildar", il3: "ildar",
    lv1: "lev", lv2: "lev", lv3: "lev", eg1: "egor", eg2: "egor", eg3: "egor", dr: "dir" };
  const mood = (k, t) => k === "egor" && t > st.e2 - .3 && t < st.l4 ? "o" : k === "lev" && t > st.t1 && t < st.m2 ? "o" : "grin";
  R.hooks.push(t => { const f = Math.floor(t * 30);
    for (const [p, k] of Object.entries(SP)) if (document.getElementById(p)) mouth(p, talk((LIP[k] || [])[f] || 0, f) ? "talk" : mood(k, t)); });
  window.MUSIC = { style: "toon", bpm: 116, end: R.dur - 1.2 };
  const ids = E.lines.map(l => l.id), nxt = l => ids[ids.indexOf(l) + 1];
  const SW = { line: st.l1 - .35, kab: st.m1 - .55, mast: W("l2", "мастер") - .3, uch: st.l4 - .4, rasp: st.l5 - .3, fin: st.end - .35 };
  const ends = Object.values(SW).sort((a, b) => a - b);
  for (const l of ["i1", "m1", "t1", "m2", "e1", "t2", "e2", "d1"]) {
    const cap = ends.find(x => x > st[l]) ?? 1e9, n = nxt(l);
    pop("#b_" + l, st[l] - .05, Math.min(en[l] + .9, n ? st[n] - .1 : en[l] + 1, cap - .05));
  }
  // школьный звонок — переход между сценами: колокольчик дребезжит, вспышка, смена сцены
  const bell = (from, to, at) => {
    tl.fromTo("#bell", { opacity: 0, scale: .4, rotation: -30 }, { opacity: 1, scale: 1, rotation: 0, duration: .15, ease: "back.out(3)", immediateRender: false }, at - .2)
      .to("#bell", { rotation: 18, duration: .06, yoyo: true, repeat: 5, ease: "none" }, at - .05).to("#bell", { opacity: 0, duration: .15 }, at + .35);
    tl.set(`#sc_${to}`, { opacity: 1 }, at).set(`#sc_${from}`, { opacity: 0 }, at);
    R.flash(at, .4, .14); R.sfx("ring", at - .2, .55); R.shake(cam, at, .5, .25);
  };
  const swap = (from, to, at) => {
    tl.set(`#sc_${to}`, { opacity: 1, x: 1080, filter: "blur(14px)" }, at)
      .to(`#sc_${from}`, { x: -1080, filter: "blur(14px)", duration: .35, ease: "power3.in" }, at)
      .to(`#sc_${to}`, { x: 0, filter: "blur(0px)", duration: .38, ease: "power3.out" }, at + .12)
      .set(`#sc_${from}`, { opacity: 0, x: 0, filter: "none" }, at + .5);
    R.sfx("whoosh", at, .6);
  };
  const show = (sel, at) => { tl.fromTo(sel, { opacity: 0, scale: .7, y: 60 }, { opacity: 1, scale: 1, y: 0, duration: .35, ease: "back.out(1.8)", immediateRender: false }, at); R.sfx("ping", at - .03, 1); };
  const hide = (sel, at) => tl.to(sel, { opacity: 0, duration: .2 }, at);
  const slam = (sel, at, sfx = "impact") => { tl.fromTo(sel, { opacity: 0, scale: 2 }, { opacity: 1, scale: 1, duration: .18, ease: "power4.out", immediateRender: false }, at); R.sfx(sfx, at + .02, .7); };
  const write = (sel, at, dur) => { tl.fromTo(sel, { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: dur, ease: "none", immediateRender: false }, at);
    for (let k = 0; k < dur * 6; k++) R.sfx("scan", at + k / 6, .25); };
  const grade = (sel, at) => { tl.fromTo(sel, { opacity: 0, scale: 3, rotation: -25 }, { opacity: 1, scale: 1, rotation: 0, duration: .22, ease: "power4.out", immediateRender: false }, at); R.sfx("impact", at + .02, .6); };
  const cnt = (from, to, at, d, col) => { R.count($("#cv"), at, from, to, .8); tl.set("#cd", { textContent: d, color: col }, at); R.sfx("clack", at, .6);
    tl.fromTo("#cnt", { scale: 1.25 }, { scale: 1, duration: .4, ease: "back.out(2)", immediateRender: false }, at); };
  gsap.set(".chalk", { clipPath: "inset(0 100% 0 0)" }); gsap.set(".jrn b", { opacity: 0 }); gsap.set(".jrn", { opacity: 0 }); gsap.set(".tt > div", { opacity: 0 }); gsap.set(".tt i", { opacity: 0 });

  // 1. парковка
  tl.to("#title", { opacity: 0, y: -50, duration: .25 }, 2.2);
  tl.fromTo("#cnt", { opacity: 0, x: 60 }, { opacity: 1, x: 0, duration: .3, immediateRender: false }, .6);
  R.sfx("ring", W("l0", "больш") - .1, .5); tl.fromTo("#bell", { opacity: 0 }, { opacity: 1, duration: .1, immediateRender: false }, W("l0", "больш") - .1)
    .to("#bell", { rotation: 18, duration: .06, yoyo: true, repeat: 7, ease: "none" }, W("l0", "больш")).to("#bell", { opacity: 0, duration: .15 }, W("l0", "двадц") + .5);
  // 2. линейка: камера едет вдоль ряда к пустому месту директора
  bell("park", "line", SW.line);
  tl.fromTo(cam, { s: 1.25, x: 260, y: -330 }, { s: 1.25, x: -230, y: -330, duration: W("l1", "пуст") - SW.line, ease: "power1.inOut", immediateRender: false }, SW.line)
    .to(cam, { s: 1, x: 0, y: 0, duration: .5, ease: "power3.out" }, W("l1", "пуст"));
  ["#s1", "#s2", "#s3"].forEach((s, k) => slam(s, W("l1", ["физрук", "математ", "трудов"][k]) + .1, "pop"));
  slam("#q1", W("l1", "директ"), "boom"); R.punch(cam, W("l1", "директ") + .1, .08);
  // 3. кабинет: мел, бот, «пять»
  bell("line", "kab", SW.kab);
  write("#ch1", st.m1 + .2, 1.6); write("#ch2", W("m1", "аксиом"), .5);
  show("#mkt", st.t1); hide("#mkt", st.m2 + .2);
  tl.fromTo("#strike", { scaleX: 0 }, { scaleX: 1, duration: .3, ease: "power2.out", immediateRender: false }, W("t1", "восемь")); R.sfx("swish", W("t1", "восемь"), .6);
  write("#ch3", W("t1", "восемь") + .3, 1.2);
  tl.fromTo("#j1", { opacity: 0, y: 80, rotation: -8 }, { opacity: 1, y: 0, rotation: -2, duration: .35, ease: "back.out(1.6)", immediateRender: false }, st.m2 - .3);
  grade("#j1_g0", W("m2", "пять"));
  // 4. мастерская: «пятёрка», рынок, честная цена
  swap("kab", "mast", SW.mast);
  slam("#mk180", W("l3", "сто"), "impact"); hide("#mk180", st.t2 + .2);
  cnt(350000, 190000, W("t2", "беру"), "−160 000", "#ff3b30");
  R.punch(cam, W("t2", "шестьд"), .06);
  tl.fromTo("#j2", { opacity: 0, y: 80 }, { opacity: 1, y: 0, duration: .35, ease: "back.out(1.6)", immediateRender: false }, st.e2 + .2);
  tl.set("#j2_g0", { opacity: 1 }, st.e2 + .2); grade("#j2_g1", en.e2 + .1);
  // 5. учительская: заявка
  bell("mast", "uch", SW.uch);
  tl.from(["#LV3", "#IL3", "#EG3"], { x: 400, opacity: 0, duration: .5, stagger: .12, ease: "power2.out" }, st.l4 + .2); R.sfx("whoosh", st.l4 + .2, .4);
  R.punch(cam, W("d1", "коллект"), .07);
  // 6. расписание → фильтры
  swap("uch", "rasp", SW.rasp);
  const rows = [0, 1, 2, 3, 4, 5].map(k => SW.rasp + .5 + k * ((W("l5", "присыл") - SW.rasp - .5) / 6));
  rows.forEach((at, k) => { tl.fromTo("#tr" + k, { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: .2, immediateRender: false }, at); R.sfx("tap", at, .6); });
  show("#pn1", W("l5", "присыл")); tl.to("#tr0 i", { opacity: 1, duration: .1 }, W("l5", "присыл"));
  hide("#pn1", W("l5", "секунд")); show("#pn2", W("l5", "секунд") + .05); tl.to("#tr1 i", { opacity: 1, duration: .1 }, W("l5", "секунд") + .05);
  [2, 3, 4, 5].forEach((k, j) => { tl.to(`#tr${k} i`, { opacity: 1, duration: .1 }, en.l5 + .1 + j * .2); R.sfx("ping", en.l5 + .1 + j * .2, .5); });
  // 7. итог: журнал, капитал, место директора, призыв
  swap("rasp", "fin", SW.fin);
  tl.fromTo("#j3", { opacity: 0, y: -60 }, { opacity: 1, y: 0, duration: .35, immediateRender: false }, SW.fin + .4);
  tl.set(["#j3_g0", "#j3_g1"], { opacity: 1 }, SW.fin + .4); grade("#j3_g2", W("end", "подбор"));
  cnt(190000, 400000, W("end", "двест"), "+210 000", "#4cd964"); cnt(400000, 460000, W("end", "четыр"), "+270 000", "#4cd964");
  slam("#q2", W("end", "директ"), "boom"); R.punch(cam, W("end", "директ") + .1, .08);
  tl.fromTo("#cta2", { opacity: 0, y: 80, scale: .9 }, { opacity: 1, y: 0, scale: 1, duration: .4, ease: "back.out(1.6)", immediateRender: false }, W("end", "подпиш") - .3);
  tl.to("#cnt", { opacity: 0, duration: .2 }, en.end + .1);
  ending(R, en.end + .3);
};
