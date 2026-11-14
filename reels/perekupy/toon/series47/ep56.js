// «ТОЛЯН: СО СТА ТЫСЯЧ · ФИНАЛ» — «Миллион», часть 15 (киношный формат ../cine.js). Сцены — как в утверждённой раскадровке board.html.
// НОВОЕ НАЧАЛО: без плашки серии и телефона — холодный старт из будущего в кинорамке (эстакада, вишнёвый Mark II, фары, рёв мотора)
// → VHS-перемотка −7 дней: полароиды прошлых частей, счётчик откатывается к 930 000 → дача: Семёныч, W124 за 430 → ЗАГС: Артур, 520
// → табло 1 020 000, конфетти → фильтр «для себя»: Mark II за 900 → Макс → было/стало → ключи, 120 000 → эстакада: «два миллиона, брат» → карточка бота.
// Последний кадр — только карточка бота. Без фоновой музыки.
$("#title .a").textContent = E.rubric; $("#title .b").textContent = E.subtitle; $("#tag span").textContent = "финал";
document.querySelector("#cam > svg#bg")?.remove();
const W = (line, pre, n = 0) => {
  const norm = s => s.toLowerCase().replace(/ё/g, "е").replace(/[^а-я0-9a-z]/g, "");
  const hits = (TT.words[line] || []).filter(w => w[1] >= st[line] - .7 && w[2] <= en[line] + .05 && norm(w[0]).startsWith(norm(pre)));
  if (!hits[n]) console.warn("W miss", line, pre);
  return hits[n] ? Math.max(hits[n][1], st[line] - .05) : st[line];
};
const G = (id, html, z = 5) => `<div class="grp" id="${id}" style="left:0;top:0;width:1080px;height:1920px;z-index:${z}">${html}</div>`;
const root = $("#scene"), SC = {}, SPK = {};
const mount = (name, def, sh) => (SC[name] = C.mount(root, def, sh));
const spk = (p, v) => (SPK[p] = v, p);
const T = (p, x, foot, h, pose = {}, extra = {}) => ch("tolyan", spk(p, "tolyan"), x, foot, h, null, pose, extra);
const Z = (p, x, foot, h, o = {}, pose = {}, extra = {}) => ch("perekup", spk(p, "zhora"), x, foot, h, { ...ZHORA, ...o }, pose, extra);
const ES_L = glow(230, 660, 260, "#ffb84a", .45) + glow(790, 660, 260, "#ffb84a", .45) + glow(540, 1500, 520, "#5a5ad0", .18);
const DA_L = glow(880, 180, 380, "#fff3c4", .45);
const ZG_L = glow(820, 200, 380, "#fff6d0", .5);
const JDM_L = glow(540, 250, 380, "#ff3bd0", .35) + glow(540, 1400, 420, "#ff3bd0", .12);
const MKL = [[.12, .62, 90], [.4, .64, 90]];

// 1. холодный старт: эстакада в кинорамке → VHS-перемотка
mount("s1", { bg: "estakada", grade: "night", over: LETTERBOX("15 частей назад — 100 000 ₽", "ТОЛЯН · ФИНАЛ"),
  mid: car(MK, 40, 1560, 780, { z: 4, sheen: .6, refl: 1 }) + G("hl1", glow(134, 1420, 110, "#fff6c8", 0, 6) + glow(352, 1427, 110, "#fff6c8", 0, 6), 6)
    + T("tc", 880, 1600, 600, { armR: -30 }, { rim: "#ffb84a", side: -1, z: 7 }) + INHAND(880, 1600, 600, -30, 90, KEYS, 9), lights: ES_L,
  bubbles: [{ id: "t0", p: "tc", html: "Слышишь,<br><em>как дышит?</em>", fs: 46 }] }, { x: 540, y: 1140, s: 1.0 });
mount("s1b", { far: REW(), farBlur: 0 }, { x: 540, y: 960, s: 1 });
// 2. дача: бот → Семёныч
{ const H = HOLDPHONE("tolyan", spk("tn", "tolyan"), 540, 1960, 1680, null, W124CARD(), { rim: "#fff2c0", side: 1 });
  mount("s2", { bg: "dachakoop", grade: "day", farBlur: 9, mid: H.mid, lights: H.lights }, { x: 540, y: 960, s: 1 }); }
mount("s2b", { bg: "dachakoop", grade: "day",
  mid: car(W1, 40, 1600, 660, { z: 4, sheen: .6 }) + ch("perekup", spk("sm", "semenych"), 860, 1770, 740, SEMENYCH, { armR: -50 }, { rim: "#fff2c0", side: -1, z: 7 })
    + T("td", 560, 1800, 700, { armL: 50 }, { rim: "#fff2c0", side: 1, z: 8 }), lights: DA_L,
  bubbles: [{ id: "s1", p: "sm", html: "Бочка вечная.<br><em>Отдаю в руки, а не на запчасти.</em>", fs: 38 }, { id: "t1", p: "td", html: "В надёжные руки,<br><em>товарищ полковник.</em>", fs: 40 }] }, { x: 600, y: 1200, s: 1.08 });
// 3. ЗАГС: Артур → миллион
mount("s3", { bg: "zags", grade: "day",
  mid: car(W1, 60, 1600, 660, { z: 4, sheen: .7 }) + WEDDING(60, 1600, 660) + ch("perekup", spk("ar", "artur"), 860, 1770, 740, ARTUR, { armR: -60 }, { rim: "#fff6d0", side: -1, z: 7 }), lights: ZG_L,
  bubbles: [{ id: "a1", p: "ar", html: "Ретро для свадеб — мечта!<br><em>Пятьсот двадцать, беру.</em>", fs: 40 }] }, { x: 580, y: 1200, s: 1.08 });
mount("s3b", { bg: "zags", grade: "day", over: MILLION(80, 250) + CONFETTI(),
  mid: T("tz", 300, 1780, 720, { armL: 150, armR: -150 }, { rim: "#fff6d0", side: 1, z: 7 }) + Z("zz", 790, 1790, 740, { look: "grin" }, { armL: 140, armR: -140 }, { rim: "#fff6d0", side: -1, z: 7 }), lights: ZG_L,
  bubbles: [{ id: "z1", p: "zz", html: "Студент…<br><em>миллион! Ты сделал это!</em>", fs: 44 }] }, { x: 540, y: 1150, s: 1.02 });
// 4. фильтр для себя → Макс
{ const H = HOLDPHONE("tolyan", spk("tm", "tolyan"), 540, 1960, 1680, null, MKFILTER(), { rim: "#ff7ae6", side: 1 });
  mount("s4", { bg: "jdmgarazh", grade: "night", farBlur: 9, mid: H.mid, lights: H.lights }, { x: 540, y: 960, s: 1 }); }
mount("s4b", { bg: "jdmgarazh", grade: "night",
  mid: car(MK, 60, 1640, 760, { z: 4, sheen: .5, lights: MKL }) + ch("perekup", spk("mx", "max"), 880, 1780, 740, MAX, { armR: -60 }, { rim: "#ff7ae6", side: -1, z: 7 }), lights: JDM_L,
  bubbles: [{ id: "m1", p: "mx", html: "Ты написал первым.<br><em>Девятьсот — и он твой.</em>", fs: 42 }] }, { x: 560, y: 1200, s: 1.08 });
// 5. было / стало → ключи
mount("s5", { bg: "garages", grade: "night",
  over: BA(BAPANE("garages", T("tb1", 290, 1800, 760, { armR: -40 }, { z: 7 }) + INHAND(290, 1800, 760, -40, 130, ENVELOPE, 9) + BIGTAG(40, 1560, "ЧАСТЬ 1", "100 000 ₽", -5)),
    BAPANE("jdmgarazh", car(MK, 330, 1610, 660, { z: 4, sheen: .5 }) + T("tb2", 920, 1820, 700, { armR: -40 }, { rim: "#ff7ae6", side: -1, z: 7 }) + INHAND(920, 1820, 700, -40, 100, KEYS, 9) + BIGTAG(600, 1600, "ЧАСТЬ 15", "Mark II · 1JZ", 4, "#ff7ae6"))) }, { x: 540, y: 960, s: 1 });
mount("s5b", { bg: "jdmgarazh", grade: "night",
  mid: ch("perekup", spk("mk", "max"), 300, 1960, 1000, MAX, { armR: -75 }, { rim: "#ff7ae6", side: 1, z: 7 }) + G("keys", INHAND(300, 1960, 1000, -75, 120, KEYS, 9), 9)
    + T("tk", 800, 1960, 1000, { armL: 60 }, { rim: "#ff7ae6", side: -1, z: 7 }), lights: JDM_L,
  bubbles: [{ id: "z2", at: [540, 900], html: "Жора: «Студент…<br><em>я тебя недооценивал»</em>", fs: 42 }] }, { x: 540, y: 1150, s: 1.1 });
// 6. эстакада: «а дальше?» → Mark II уезжает, карточка бота
mount("s6", { bg: "estakada", grade: "night",
  mid: car(MK, 380, 1600, 740, { z: 4, sheen: .4, refl: 1, flip: 1 }) + T("tf", 310, 1780, 720, {}, { rim: "#ffb84a", side: 1, z: 7 }) + Z("zf", 590, 1800, 700, { look: "grin" }, { armR: -60 }, { rim: "#ffb84a", side: 1, z: 7 }), lights: ES_L,
  bubbles: [{ id: "t2", p: "tf", html: "Сто тысяч. Пятнадцать сделок.<br><em>Один бот.</em>", fs: 40 }, { id: "z3", p: "zf", html: "Студент,<br><em>а дальше?</em>", fs: 48 },
    { id: "t3", p: "tf", html: "А дальше —<br><em>два миллиона, брат.</em>", fs: 44 }] }, { x: 540, y: 1200, s: 1.08 });
mount("s6b", { bg: "estakada", grade: "night", over: CTA56.replace('<div style="position:absolute;', '<div id="cta" style="opacity:0;position:absolute;'),
  mid: G("drive", car(MK, 140, 1500, 820, { z: 4, sheen: .8, lights: MKL }), 4) + SPEED(1050, 1600), lights: ES_L }, { x: 540, y: 1100, s: .98 });

$(".stage").insertAdjacentHTML("beforeend", `<div id="cnt">💰 <span id="cv">930 000</span> ₽ <em id="cd"></em></div>`);
$("#end h2").innerHTML = E.end;
window.DURATION = +(TT.end.t3 + .15 + 2.1 + 1.4).toFixed(2);   // финал: Mark II уезжает + карточка бота после последней реплики

window.build = R => {
  const tl = R.tl;
  const { pop } = common(R, { shake: 0 });
  for (const el of Object.values(SC)) {
    el.sheens = [...el.querySelectorAll(".sheen")];
    el.glows = [...el.querySelectorAll(".lights .glow")].map(g => ({ g, o: +g.style.opacity }));
  }
  const talk = (lv, f) => lv > .28 && !(lv < .55 && f % 3 === 2);
  const MOOD = {};
  R.hooks.push(t => {
    const f = Math.floor(t * 30);
    for (const el of Object.values(SC)) {
      const on = +el.style.opacity > 0;
      el.style.display = on ? "" : "none";          // невидимые сцены не держим в отрисовке (id фонов уникальны — C.bgSvg)
      if (!on) continue;
      const k = el.cam.s > 1.6 ? .55 : 1;
      C.apply(el, [(R.noise(t * .6) * 9 + R.noise(t * 1.7 + 40) * 3) * k, (R.noise(t * .5 + 9) * 10 + R.noise(t * 1.9 + 70) * 3) * k, R.noise(t * .4 + 20) * .3 * k]);
      el.sheens.forEach((s, j) => { s.style.backgroundPosition = `${(130 - ((t * 14 + j * 45) % 160)).toFixed(1)}% 0`; });
      el.glows.forEach(({ g, o }, j) => { g.style.opacity = (o * (.88 + .12 * R.noise(t * 2.5 + j * 3.1))).toFixed(3); });
    }
    for (const [p, v] of Object.entries(SPK)) {
      if (!document.getElementById(p)) continue;
      const lv = (LIP[v] || [])[f] || 0;
      mouth(p, talk(lv, f) ? "talk" : (MOOD[p] || "grin"));
    }
  });
  window.MUSIC = { style: "bed", bpm: 90, end: R.dur - 1.2 };   // фоновой музыки нет (MUSIC_VOL=0)

  const cam = n => SC[n].cam;
  const show = (n, at) => tl.set(SC[n], { opacity: 1 }, at);
  const cut = (from, to, at) => { tl.set(SC[from], { opacity: 0 }, at).set(SC[to], { opacity: 1 }, at); R.sfx("tick", at, .4); };
  const swap = (from, to, at) => {
    tl.set(SC[to], { opacity: 1, x: 1080, filter: "blur(14px)" }, at)
      .to(SC[from], { x: -1080, filter: "blur(14px)", duration: .35, ease: "power3.in" }, at)
      .to(SC[to], { x: 0, filter: "blur(0px)", duration: .38, ease: "power3.out" }, at + .12)
      .set(SC[from], { opacity: 0, x: 0, filter: "none" }, at + .5).set(SC[to], { filter: "none" }, at + .51);
    R.sfx("whoosh", at, .6);
  };
  const move = (n, to, at, d, ease = "power2.inOut") => tl.to(cam(n), { ...to, duration: d, ease }, at);
  const ids = E.lines.map(l => l.id), nxt = l => ids[ids.indexOf(l) + 1];
  const bub = (l, until) => pop("#b_" + l, st[l] - .05, until ?? Math.min(en[l] + .8, nxt(l) ? st[nxt(l)] - .1 : en[l] + 1));
  const capTo = (from, to, at, d, txt) => { R.count($("#cv"), at, from, to, d); tl.set("#cd", { textContent: txt }, at); tl.fromTo("#cnt", { scale: 1.25 }, { scale: 1, duration: .4, ease: "back.out(2)", immediateRender: false }, at); R.sfx("clack", at, .6); };

  // 1. холодный старт: кинорамка, фары, мотор → перемотка
  gsap.set(SC.s1, { opacity: 1 }); SC.s1.style.display = "";        // первый кадр (обложка) — сразу сцена в кинорамке, без плашки серии
  gsap.set(["#title", "#tag", "#cnt"], { opacity: 0 });
  show("s1", 0); move("s1", { s: 1.12, y: 1180 }, 0, st.t0, "none");
  const IGN = W("l0", "вот") - .1;
  tl.to("#hl1 .glow", { opacity: .95, duration: .12, ease: "none" }, IGN); R.sfx("rev", IGN + .1, Math.max(.8, st.t0 - IGN - .15));   // рёв — в паузе до реплики Толяна, не поверх голоса R.shake(cam("s1"), IGN + .25, .6, .5);
  move("s1", { s: 1.3, x: 640, y: 1260 }, st.t0 - .1, en.t0 - st.t0 + .4); bub("t0", st.l1 - .3);
  // VHS-перемотка: помехи, полароиды «назад», счётчик откатывается к 930 000
  const RW = st.l1 - .35;
  tl.set(SC.s1, { opacity: 0 }, RW).set(SC.s1b, { opacity: 1 }, RW); R.sfx("glitch", RW, .9); R.sfx("rewind", RW + .05, 2.3);
  tl.fromTo(SC.s1b, { filter: "brightness(2.2) contrast(1.6)" }, { filter: "brightness(1) contrast(1)", duration: .25, immediateRender: false }, RW);
  gsap.set("#scene .pol", { opacity: 0 });
  for (let k = 5; k >= 0; k--) { const at = RW + .1 + (5 - k) * .32;
    tl.fromTo("#pol" + k, { opacity: 0, x: 140 }, { opacity: 1, x: 0, duration: .12, ease: "power2.out", immediateRender: false }, at); R.sfx("tick", at, .5); }
  [0, 1, 2].forEach(k => tl.fromTo("#trk" + k, { y: -300 + k * 200 }, { y: 600 + k * 120, duration: 2.2, ease: "none", repeat: 1, immediateRender: false }, RW));
  $("#rewc").textContent = "1 020 000";
  R.count($("#rewc"), RW + .15, 1020000, 930000, W("l1", "930") - RW - .1);
  tl.fromTo("#rewc", { color: "#4cd964" }, { color: "#ffd23f", duration: .2, yoyo: true, repeat: 1, immediateRender: false }, W("l1", "930")); R.sfx("clack", W("l1", "930"), .7);
  move("s1b", { s: 1.06 }, RW, en.l1 - RW + .3, "none");
  // 2. дача: карточка W124 → Семёныч → «в надёжные руки»
  const SW2 = st.l2 - .4; swap("s1b", "s2", SW2); move("s2", { s: 1.07, y: 1000 }, SW2, en.l2 - SW2 + .3, "none");
  tl.to(["#tag", "#cnt"], { opacity: 1, duration: .3 }, SW2 + .4);
  gsap.set("#nwc", { opacity: 0 }); const NW = W("l2", "бот") - .1;
  tl.fromTo("#nwc", { opacity: 0, y: -50 }, { opacity: 1, y: 0, duration: .3, ease: "back.out(1.8)", immediateRender: false }, NW); R.sfx("ping", NW, .9);
  cut("s2", "s2b", st.s1 - .1); move("s2b", { s: 1.16 }, st.s1 - .1, en.t1 - st.s1 + .4, "none");
  bub("s1", st.t1 - .1); bub("t1", st.l3 - .45);
  // 3. ЗАГС: Артур → табло за миллион, конфетти
  const SW3 = st.l3 - .4; swap("s2b", "s3", SW3); move("s3", { s: 1.14 }, SW3, en.a1 - SW3 + .3, "none"); bub("a1", st.l4 - .15);
  const CM = st.l4 - .1; cut("s3", "s3b", CM); tl.to(["#cnt", "#tag"], { opacity: 0, duration: .15 }, CM);
  move("s3b", { s: 1.08 }, CM, en.z1 - CM + .4, "none");
  gsap.set("#milt", { opacity: 0 }); $("#miln").textContent = "930 000";
  tl.fromTo("#mil", { opacity: 0, scale: .6 }, { opacity: 1, scale: 1, duration: .3, ease: "back.out(1.8)", immediateRender: false }, CM + .05); R.sfx("pop", CM + .05, .7);
  const MC = W("l4", "капит"); R.count($("#miln"), MC, 930000, 1020000, .9); R.sfx("type", MC + .1, .5); R.sfx("type", MC + .4, .5); R.sfx("type", MC + .7, .5);
  const MIL = MC + .95;
  tl.fromTo("#milt", { opacity: 0, scale: 2.2 }, { opacity: 1, scale: 1, duration: .2, ease: "power4.out", immediateRender: false }, MIL); R.sfx("impact", MIL, .9); R.sfx("boom", MIL, .6); R.shake(cam("s3b"), MIL, .8, .4);
  gsap.set("#conf", { opacity: 0 }); tl.set("#conf", { opacity: 1 }, MIL);
  document.querySelectorAll("#conf .cf1").forEach((c, j) => {
    const d = 2.6 + (j % 7) * .25, top = parseFloat(c.style.top);
    tl.fromTo(c, { y: -top - 80 - (j % 5) * 90, rotation: (j * 37) % 360 }, { y: 1950 - top, rotation: (j * 37) % 360 + 540, duration: d, ease: "none", immediateRender: false }, MIL + (j % 9) * .06);
  });
  bub("z1", st.l5 - .45);
  tl.set("#cv", { textContent: "1 020 000" }, MIL).set("#cd", { textContent: "+90 000" }, MIL);
  // 4. фильтр для себя → карточка Mark II → Макс
  const SW4 = st.l5 - .4; swap("s3b", "s4", SW4); move("s4", { s: 1.07, y: 1000 }, SW4, en.l5 - SW4 + .3, "none");
  tl.to(["#cnt", "#tag"], { opacity: 1, duration: .3 }, SW4 + .4);
  gsap.set(["#mkf", "#nmk"], { opacity: 0 });
  const FL = W("l5", "фильтр") - .1; tl.fromTo("#mkf", { opacity: 0, x: -60 }, { opacity: 1, x: 0, duration: .3, ease: "power3.out", immediateRender: false }, FL); R.sfx("type", FL, .6); R.sfx("type", FL + .15, .6);
  const NM = W("l5", "бот") - .1; tl.fromTo("#nmk", { opacity: 0, y: -50 }, { opacity: 1, y: 0, duration: .3, ease: "back.out(1.8)", immediateRender: false }, NM); R.sfx("ping", NM, .9);
  cut("s4", "s4b", st.m1 - .1); move("s4b", { s: 1.16 }, st.m1 - .1, en.m1 - st.m1 + .4, "none"); bub("m1", st.l6 - .45);
  // 5. было / стало: полоса уезжает влево, «стало» забирает кадр → ключи, капитал 120 000
  const SW5 = st.l6 - .4; swap("s4b", "s5", SW5); R.sfx("glitch", SW5 + .3, .5); tl.to(["#cnt", "#tag"], { opacity: 0, duration: .15 }, SW5 + .1);
  const BS = W("l6", "марк") - .1;
  tl.to("#baL", { clipPath: "inset(0px 1080px 0px 0px)", duration: .7, ease: "power3.inOut" }, BS)
    .to("#baR", { clipPath: "inset(0px 0px 0px 0px)", duration: .7, ease: "power3.inOut" }, BS)
    .to("#baD", { x: -560, duration: .7, ease: "power3.inOut" }, BS)
    .to("#lbBylo", { opacity: 0, duration: .2 }, BS)
    .to("#lbStalo", { x: -540, duration: .7, ease: "power3.inOut" }, BS)
  R.sfx("swish", BS, .8);
  move("s5", { s: 1.06 }, SW5, BS - SW5 + 1.2, "none");
  const KY = W("l6", "120") - .35; cut("s5", "s5b", KY); tl.to(["#cnt", "#tag"], { opacity: 1, duration: .2 }, KY); move("s5b", { s: 1.2, y: 1120 }, KY, en.z2 - KY + .4, "none");
  tl.fromTo("#keys", { y: 0 }, { y: -26, duration: .25, yoyo: true, repeat: 3, ease: "sine.inOut", immediateRender: false }, KY + .2); R.sfx("tap", KY + .25, .6); R.sfx("tap", KY + .75, .6);
  capTo(1020000, 120000, W("l6", "120") - .2, .8, "−900 000");
  bub("z2", st.t2 - .45);
  // 6. эстакада: итог → Mark II срывается с места → карточка бота
  const SW6 = st.t2 - .4; swap("s5b", "s6", SW6); move("s6", { s: 1.16 }, SW6, en.t3 - SW6 + .3, "none");
  tl.set("#cd", { textContent: "" }, SW6);
  bub("t2", st.z3 - .1); bub("z3", st.t3 - .1); bub("t3", en.t3 + .25);
  const DR = en.t3 + .15; cut("s6", "s6b", DR); tl.to("#cnt", { opacity: 0, duration: .2 }, DR);
  R.sfx("rev", DR, 2); R.shake(cam("s6b"), DR + .1, .7, .4);
  tl.fromTo("#drive", { x: 0, y: 0, scale: 1 }, { x: -1400, y: 160, scale: 1.25, duration: 1.4, ease: "power2.in", immediateRender: false, transformOrigin: "550px 1300px" }, DR + .25);
  tl.fromTo("#spd", { x: 0 }, { x: -900, duration: 1.4, ease: "none", immediateRender: false }, DR + .25);
  R.sfx("whoosh", DR + 1.1, .8);
  tl.fromTo("#cta", { opacity: 0, y: 80, scale: .9 }, { opacity: 1, y: 0, scale: 1, duration: .4, ease: "back.out(1.6)", immediateRender: false }, DR + 1.0);
  ending(R, DR + 2.1);
};
