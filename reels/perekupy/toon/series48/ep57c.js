// «СУД: ПЕРЕКУПЫ ПРОТИВ БОТА» (ep57, киношный формат ../cine.js, отдельный ролик). Сцены — как в утверждённой раскадровке board.html.
// НАЧАЛО: судебный рисунок карандашом (весь кадр — серый штрих на бумаге, подпись от руки) → удар молотка, кадр оживает в цвете → «Встать, суд идёт!»
// → истец Жора → ответчик: телефон с ботом в клетке → баба Нина + воспоминание на веранде → перекуп Стас + воспоминание с F5
// → улика №1 (доска, красная нить) → «бот просто быстрее вас?» → «иск отклонить» → «ссылку на бот — секретарю. Камри ищу» → карточка бота.
// Последний кадр — только карточка бота. Без фоновой музыки.
$("#title .a").textContent = E.rubric; $("#title .b").textContent = E.subtitle; $("#tag span").textContent = "суд";
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
const Z = (p, x, foot, h, o = {}, pose = {}, extra = {}) => ch("perekup", spk(p, "zhora"), x, foot, h, { ...ZHORA, ...o }, pose, extra);
const J = (p, x, foot, h, pose = {}, extra = {}) => ch("perekup", spk(p, "judge"), x, foot, h, JUDGE, pose, extra);
const GV = (id, x, foot, h) => INHAND(x, foot, h, -120, 170, GAVEL, 7, -20).replace('class="prop"', `class="prop" id="${id}"`);
const SUD_L = glow(870, 380, 300, "#fff6d0", .35) + glow(540, 260, 220, "#e6b422", .2);
const VR_L = glow(900, 160, 380, "#fff3c4", .5);
const KN_L = glow(700, 860, 260, "#9fd6ff", .5) + glow(810, 420, 220, "#ffc46a", .15);
const COURT = k => J("jw" + k, 540, 1060, 700, {}, { z: 6 }) + BENCH(8) + Z("zw" + k, 190, 1700, 760, { look: "o" }, {}, { z: 10 }) + TRIBUNE(190, 1420, 330, 11, "ИСТЕЦ")
  + KLETKA(650, 1080, 370, 720, V5CARD().replace('id="nv5"', ""), "kl" + k);

// 1. судебный рисунок → цвет → «Встать, суд идёт!»
mount("s1", { bg: "zalsuda", grade: "day", over: SKETCH() + SKCAP("Перекупы против бота", "зал № 3 · дело № 1"), mid: COURT("a"), lights: SUD_L }, { x: 540, y: 1100, s: 1.0 });
mount("s1b", { bg: "zalsuda", grade: "day", over: RINGS(640, 640, "rg1"),
  mid: J("jg", 540, 1060, 700, { armR: -120 }, { z: 6 }) + GV("gv1", 540, 1060, 700) + BENCH(8), lights: SUD_L,
  bubbles: [{ id: "j1", p: "jg", html: "Встать, суд идёт!<br><em>Перекупы против бота «Перехват».</em>", fs: 38 }] }, { x: 540, y: 760, s: 1.45 });
// 2. истец → ответчик в клетке
mount("s2", { bg: "zalsuda", grade: "day",
  mid: Z("zt", 540, 1860, 900, { look: "o" }, { armL: 150, armR: -150 }, { rim: "#fff6d0", side: 1, z: 7 }) + TRIBUNE(540, 1470, 420, 9, "ИСТЕЦ"), lights: SUD_L,
  bubbles: [{ id: "z1", p: "zt", html: "Ваша честь! Объявление выходит —<br><em>а машину уже забрали!</em>", fs: 40 }] }, { x: 540, y: 1160, s: 1.04 });
mount("s2b", { bg: "zalsuda", grade: "day", farBlur: 6,
  mid: KLETKA(250, 820, 580, 1020, V5CARD(), "klc", 380) + G("otv", C.tag(330, 700, "ОТВЕТЧИК", "бот «Перехват»", -4, 9), 9), lights: SUD_L }, { x: 540, y: 1200, s: 1.05 });
// 3. баба Нина → воспоминание на веранде
mount("s3", { bg: "zalsuda", grade: "day",
  mid: ch("perekup", spk("nn", "nina"), 540, 1860, 880, NINA, { armR: -40 }, { rim: "#fff6d0", side: 1, z: 7 }) + TRIBUNE(540, 1480, 420, 9, "СВИДЕТЕЛЬ"), lights: SUD_L,
  bubbles: [{ id: "n1", p: "nn", html: "Выложила машину в двенадцать.<br><em>Через минуту: «бабушка, я уже еду!»</em>", fs: 36 }] }, { x: 540, y: 1160, s: 1.04 });
mount("s3b", { bg: "veranda", grade: "warm", over: MEMORY("12:00 · вспоминает баба Нина", "mem1"),
  mid: car(V5, 380, 1640, 640, { z: 4, sheen: .6 }) + ch("perekup", spk("nf", "nina"), 250, 1720, 720, NINA, { phone: 1 }, { rim: "#fff2c0", side: 1, z: 7 }), lights: VR_L }, { x: 560, y: 1200, s: 1.06 });
// 4. перекуп Стас → воспоминание с F5
mount("s4", { bg: "zalsuda", grade: "day",
  mid: ch("perekup", spk("st", "stas"), 540, 1860, 880, STAS, { armR: -150 }, { rim: "#fff6d0", side: 1, z: 7 }) + INHAND(540, 1860, 880, -150, 120, BANDAGE, 8).replace('class="prop"', 'class="prop" id="bnd"')
    + TRIBUNE(540, 1480, 420, 9, "СВИДЕТЕЛЬ"), lights: SUD_L,
  bubbles: [{ id: "s1", p: "st", html: "Я три дня обновлял объявления!<br><em>Палец стёр!</em>", fs: 40 }] }, { x: 540, y: 1160, s: 1.04 });
mount("s4b", { bg: "komnatanoch", grade: "night", over: MEMORY("три дня назад", "mem2", "#0b0e1c") + F5(500, 420),
  mid: ch("perekup", spk("sf", "stas"), 300, 1780, 720, STAS, { armR: -60 }, { rim: "#9fd6ff", side: -1, z: 7 }), lights: KN_L }, { x: 540, y: 1160, s: 1.04 });
// 5. улика №1 → «бот просто быстрее вас?»
mount("s5", { far: EVIDENCE(), farBlur: 0 }, { x: 540, y: 960, s: 1 });
mount("s5b", { bg: "zalsuda", grade: "day", mid: COURT("b"), lights: SUD_L,
  bubbles: [{ id: "j2", p: "jwb", html: "То есть бот<br><em>просто быстрее вас?</em>", fs: 42 }, { id: "z2", p: "zwb", html: "Ну…<br><em>получается, да.</em>", fs: 44 }] }, { x: 520, y: 1100, s: 1.04 });
// 6. приговор → «Камри ищу» → карточка бота
mount("s6", { bg: "zalsuda", grade: "day", over: VERDICT() + RINGS(540, 700, "rg2"),
  mid: J("jv", 540, 1060, 700, { armR: -120 }, { z: 6 }) + GV("gv2", 540, 1060, 700) + BENCH(8) + Z("zv", 190, 1700, 760, { look: "o" }, {}, { z: 10 }) + TRIBUNE(190, 1420, 330, 11, "ИСТЕЦ"), lights: SUD_L,
  bubbles: [{ id: "j4", p: "jv", html: "А ссылку на бот —<br><em>секретарю.</em>", fs: 42 }, { id: "z3", p: "zv", html: "Ваша честь,<br><em>а вам-то зачем?</em>", fs: 42 },
    { id: "j5", p: "jv", html: "Камри ищу.", fs: 52 }] }, { x: 540, y: 840, s: 1.1 });
mount("s6b", { bg: "zalsuda", grade: "day", over: CTA57.replace('<div style="position:absolute;', '<div id="cta" style="opacity:0;position:absolute;'), mid: COURT("c"), lights: SUD_L }, { x: 540, y: 1000, s: .98 });
SC.s1.style.filter = SKF;

$("#end h2").innerHTML = E.end;
window.DURATION = +(TT.end.j5 + .25 + 1.5 + 1.4).toFixed(2);   // финал: карточка бота после последней реплики

window.build = R => {
  const tl = R.tl;
  const { pop } = common(R, { shake: 0 });
  for (const el of Object.values(SC)) {
    el.sheens = [...el.querySelectorAll(".sheen")];
    el.glows = [...el.querySelectorAll(".lights .glow")].map(g => ({ g, o: +g.style.opacity }));
  }
  const talk = (lv, f) => lv > .28 && !(lv < .55 && f % 3 === 2);
  const MOOD = { zt: "o", zwa: "o", zwb: "o", zwc: "o", zv: "o", sf: "o" };
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
  const memIn = (from, to, at) => {      // в воспоминание — через белую вспышку
    tl.set(SC[from], { opacity: 0 }, at).set(SC[to], { opacity: 1 }, at);
    tl.fromTo(SC[to], { filter: "brightness(2.4) blur(10px)" }, { filter: "brightness(1) blur(0px)", duration: .5, ease: "power2.out", immediateRender: false }, at)
      .set(SC[to], { filter: "none" }, at + .51);
    R.sfx("riser", at - .35, .4); R.sfx("swish", at, .6);
  };
  const move = (n, to, at, d, ease = "power2.inOut") => tl.to(cam(n), { ...to, duration: d, ease }, at);
  const ids = E.lines.map(l => l.id), nxt = l => ids[ids.indexOf(l) + 1];
  const bub = (l, until) => pop("#b_" + l, st[l] - .05, until ?? Math.min(en[l] + .8, nxt(l) ? st[nxt(l)] - .1 : en[l] + 1));
  const slam = (gv, rings, camN, at) => {
    tl.fromTo(gv, { rotation: -70 }, { rotation: -20, duration: .12, ease: "power4.in", immediateRender: false }, at - .12);
    document.querySelectorAll(`#${rings} .rg`).forEach((r, k) => tl.fromTo(r, { scale: .3, opacity: .9 }, { scale: 1.6 + k * .4, opacity: 0, duration: .55, ease: "power2.out", immediateRender: false }, at + k * .07));
    R.sfx("impact", at, 1); R.sfx("hit", at, .6); R.shake(cam(camN), at, 1, .35);
  };

  // 1. судебный рисунок → цвет
  gsap.set(SC.s1, { opacity: 1 }); SC.s1.style.display = "";        // первый кадр (обложка) — сразу судебный рисунок с подписью, без плашки серии
  gsap.set(["#title", "#tag", "#cnt"], { opacity: 0 });
  show("s1", 0); move("s1", { s: 1.08, y: 1060 }, 0, st.j1, "none");
  const COL = st.j1 - .55;
  tl.to(SC.s1, { filter: "grayscale(0) contrast(1) brightness(1) sepia(0)", duration: .35, ease: "power2.out" }, COL)
    .to(["#sk", "#skc"], { opacity: 0, duration: .3 }, COL); R.sfx("impact", COL, .9); R.sfx("hit", COL, .5); R.shake(cam("s1"), COL, .8, .3);
  cut("s1", "s1b", st.j1 - .15); tl.set(SC.s1, { filter: "none" }, st.j1 - .1);
  tl.to("#tag", { opacity: 1, duration: .3 }, st.j1);
  slam("#gv1", "rg1", "s1b", st.j1 + .05); move("s1b", { s: 1.55 }, st.j1 - .15, en.j1 - st.j1 + .4, "none"); bub("j1", st.z1 - .45);
  // 2. истец → ответчик
  const SW2 = st.z1 - .4; swap("s1b", "s2", SW2); move("s2", { s: 1.12 }, SW2, en.z1 - SW2 + .3, "none"); bub("z1", st.l1 - .15);
  cut("s2", "s2b", st.l1 - .1); move("s2b", { s: 1.12, y: 1160 }, st.l1 - .1, en.l1 - st.l1 + .5, "none");
  const scr = SC.s2b.querySelector("#klcp"), card = SC.s2b.querySelector("#nv5");
  gsap.set(card, { opacity: 0 }); const PG = W("l1", "явил") - .1;
  tl.fromTo(card, { opacity: 0, y: -50 }, { opacity: 1, y: 0, duration: .3, ease: "back.out(1.8)", immediateRender: false }, PG); R.sfx("ping", PG, .9);
  tl.fromTo(scr, { boxShadow: "0 0 70px rgba(120,180,255,.6)" }, { boxShadow: "0 0 160px rgba(120,180,255,1)", duration: .3, yoyo: true, repeat: 1, immediateRender: false }, PG);
  tl.fromTo("#otv", { opacity: 0, y: -30 }, { opacity: 1, y: 0, duration: .25, immediateRender: false }, st.l1 + .1);
  // 3. баба Нина → воспоминание
  const SW3 = st.n1 - .4; swap("s2b", "s3", SW3); move("s3", { s: 1.12 }, SW3, en.n1 - SW3 + .3, "none"); bub("n1", st.l2 - .15);
  memIn("s3", "s3b", st.l2 - .1); move("s3b", { s: 1.14, x: 600 }, st.l2 - .1, en.l2 - st.l2 + .4, "none");
  // 4. Стас → воспоминание с F5
  const SW4 = st.s1 - .4; swap("s3b", "s4", SW4); move("s4", { s: 1.12 }, SW4, en.s1 - SW4 + .3, "none"); bub("s1", st.l3 - .15);
  tl.fromTo("#bnd", { rotation: -20 }, { rotation: 20, duration: .2, yoyo: true, repeat: 5, ease: "sine.inOut", immediateRender: false }, W("s1", "палец"));
  memIn("s4", "s4b", st.l3 - .1); move("s4b", { s: 1.1 }, st.l3 - .1, en.l3 - st.l3 + .4, "none");
  $("#f5n").textContent = "0";
  for (let k = 0; k < 12; k++) { const at = st.l3 + k * .24;
    tl.fromTo("#f5k", { scale: 1, y: 0 }, { scale: .9, y: 16, duration: .08, yoyo: true, repeat: 1, ease: "power2.out", immediateRender: false }, at); R.sfx("tap", at, .7); }
  R.count($("#f5n"), st.l3, 0, 4812, 2.6);
  // 5. улика №1: карточки по одной, красная нить тянется
  const SW5 = st.l4 - .4; swap("s4b", "s5", SW5); tl.to("#tag", { opacity: 0, duration: .15 }, SW5 + .1); move("s5", { s: 1.06 }, SW5, en.l4 - SW5 + .3, "none");
  gsap.set(["#ev0", "#ev1", "#ev2", "#ev3"], { opacity: 0 }); gsap.set("#evline", { strokeDasharray: 1400, strokeDashoffset: 1400 });
  const EV = [W("l4", "публик"), W("l4", "бот"), W("l4", "звон"), en.l4 - .2];
  EV.forEach((at, k) => { tl.fromTo("#ev" + k, { opacity: 0, scale: 1.4 }, { opacity: 1, scale: 1, duration: .2, ease: "back.out(2)", immediateRender: false }, at - .1); R.sfx(k === 1 ? "ping" : "clack", at - .1, .7); });
  [[EV[0], EV[1], 956], [EV[1], EV[2], 487], [EV[2], EV[3], 0]].forEach(([a, b, off]) => tl.to("#evline", { strokeDashoffset: off, duration: Math.max(.3, b - a - .1), ease: "none" }, a));
  cut("s5", "s5b", st.j2 - .1); tl.to("#tag", { opacity: 1, duration: .2 }, st.j2 - .1); move("s5b", { s: 1.1 }, st.j2 - .1, en.z2 - st.j2 + .4, "none");
  bub("j2", st.z2 - .1); bub("z2", st.j3 - .45);
  // 6. приговор: лист решения, штамп с ударом молотка → «секретарю… Камри ищу» → карточка бота
  const SW6 = st.j3 - .4; swap("s5b", "s6", SW6); move("s6", { s: 1.16 }, SW6, en.j5 - SW6 + .3, "none");
  gsap.set("#vers", { opacity: 0 });
  tl.fromTo("#ver", { y: -900, rotation: 8 }, { y: 0, rotation: -2, duration: .45, ease: "power3.out", immediateRender: false }, SW6 + .3); R.sfx("swish", SW6 + .3, .6);
  const ST = W("j3", "иск") - .05;
  tl.fromTo("#vers", { opacity: 0, scale: 2.4 }, { opacity: 1, scale: 1, duration: .16, ease: "power4.out", immediateRender: false }, ST); slam("#gv2", "rg2", "s6", ST);
  tl.to("#ver", { y: -1100, rotation: 6, duration: .4, ease: "power3.in" }, st.j4 - .35);
  bub("j4", st.z3 - .1); bub("z3", st.j5 - .1); bub("j5", en.j5 + .25);
  const CT = en.j5 + .25; cut("s6", "s6b", CT); tl.to("#tag", { opacity: 0, duration: .2 }, CT);
  tl.fromTo("#cta", { opacity: 0, y: 80, scale: .9 }, { opacity: 1, y: 0, scale: 1, duration: .4, ease: "back.out(1.6)", immediateRender: false }, CT + .2);
  ending(R, CT + 1.5);
};

// ── ep57c «Неон»: быстрая уникализация — меняется только заставка ──
$("#title .a").textContent = "Перекупы в суде"; $("#title .a").style.cssText = "font-size:110px;background:#ffd23f;color:#151515";
$("#title .b").textContent = "кто забирает машины?"; $("#title .b").style.cssText = "font-size:60px;background:#151515;color:#ffd23f";
const ORIG = [...document.querySelectorAll("#lbx .lbt, #lbx .lbb")].map(e => e.textContent), HEADT = 2.4;
{ const L = document.querySelector("#lbx"); if (L) { const a = L.querySelector(".lbt"), b = L.querySelector(".lbb");   // кинорамка вместо плашки (ep56)
  a.textContent = "Перекупы в суде"; b.textContent = "кто забирает машины?"; a.style.background = b.style.background = "#ffd23f"; a.style.color = b.style.color = "#151515"; } }
{ const K = document.querySelector("#skc"); if (K) { const [a, b] = K.children, orig = [a.textContent, b.textContent], bg = K.style.background, col = K.style.color;   // подпись судебного рисунка (ep57)
  a.textContent = "Перекупы в суде"; b.textContent = "кто забирает машины?"; K.style.background = "#ffd23f"; K.style.color = "#151515";
  const B = window.build; window.build = R => { B(R); R.tl.to(K, { opacity: 0, duration: .15 }, HEADT - .6);
    R.tl.set(a, { textContent: orig[0] }, HEADT - .45).set(b, { textContent: orig[1] }, HEADT - .45).set(K, { background: bg, color: col }, HEADT - .45);
    R.tl.to(K, { opacity: 1, duration: .15 }, HEADT - .4); }; } }
{ const L = document.querySelector("#lbx"); if (L) { const B = window.build; window.build = R => { B(R);   // до склейки с основным видео (HEAD) рамка возвращается к исходной
  const bars = [L.querySelector(".lbt"), L.querySelector(".lbb")], col = ["#fff", "#ffd23f"];
  R.tl.to(bars, { opacity: 0, duration: .15 }, HEADT - .6);
  bars.forEach((el, i) => R.tl.set(el, { textContent: ORIG[i], background: "#000", color: col[i] }, HEADT - .45));
  R.tl.to(bars, { opacity: 1, duration: .15 }, HEADT - .4); }; } }
