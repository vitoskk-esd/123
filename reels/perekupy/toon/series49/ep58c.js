// «ЭКСТРАСЕНС» (ep58, киношный формат ../cine.js, отдельный ролик с Вестой). Сцены — как в утверждённой раскадровке board.html.
// НАЧАЛО: хрустальный шар на весь кадр, в тумане проявляется белая Веста, подпись «Жора ищет Весту. Без бота.» → салон мага → карты таро
// → автобаза (такси, 412 000 км) → маятник над картой → Тамбов, толщиномер 1200 → Стасу бот прислал Весту → «просто не вам» → фильтр в боте
// → шар с карточкой бота → финальная фраза Лиса про бот + карточка. Без фоновой музыки.
$("#title .a").textContent = E.rubric; $("#title .b").textContent = E.subtitle; $("#tag span").textContent = "экстрасенс";
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
const MG = (p, x, foot, h, pose = {}, extra = {}) => ch("perekup", spk(p, "mag"), x, foot, h, MAG, pose, extra) + TURBAN(x, foot, h, (extra.z || 7) + 1);
const SAL_L = glow(160, 740, 200, "#ffb84a", .45) + glow(940, 740, 200, "#ffb84a", .45) + glow(540, 1260, 260, "#9fd6ff", .35);
const AB_L = glow(880, 160, 360, "#fff6d0", .45);
const TT_L = glow(540, 700, 480, "#ffb36a", .3);
const DV_L = glow(880, 180, 380, "#fff3c4", .45);
const VEIN = `<img src="../../kit/img/vesta/vesta_side.png" style="position:absolute;left:80px;top:270px;width:540px;opacity:.9;filter:blur(1px) drop-shadow(0 0 20px #ffffff)">`;
const SALON = (k, mpose = {}, zo = {}) => MG("mg" + k, 300, 1640, 760, mpose, { rim: "#ffb84a", side: 1, z: 7 }) + Z("zs" + k, 790, 1660, 760, zo, {}, { rim: "#ffb84a", side: -1, z: 7 }) + TABLE(9);

// 1. шар → салон
mount("s1", { far: BALL(`<div id="vein" style="position:absolute;inset:0">${VEIN}</div>`, "ball", "Жора ищет Весту.<br>Без бота."), farBlur: 0 }, { x: 540, y: 960, s: 1 });
mount("s1b", { bg: "salonmaga", grade: "night", mid: SALON("a", { armL: 120, armR: -120 }, { look: "o" }), lights: SAL_L,
  bubbles: [{ id: "e1", p: "mga", html: "Вижу… белая Веста…<br><em>одна хозяйка… ниже рынка!</em>", fs: 40 }, { id: "z1", p: "zsa", html: "Где?!<br><em>Говори, где!</em>", fs: 48 }] }, { x: 540, y: 1180, s: 1.06 });
// 2. карты таро → автобаза
mount("s2", { far: TAROT(false), farBlur: 0, bubbles: [{ id: "e2", at: [540, 560], html: "Шашечки — к удаче.<br><em>Езжай на автобазу!</em>", fs: 42 }] }, { x: 540, y: 960, s: 1 });
mount("s2b", { bg: "avtobaza", grade: "day",
  mid: car(VE, 20, 1600, 620, { z: 4, sheen: .6 }) + TAXI(20, 1600, 620) + Z("zb", 660, 1790, 720, { look: "o" }, {}, { rim: "#fff6d0", side: 1, z: 7 })
    + ch("perekup", spk("ru", "rustam"), 910, 1780, 740, RUSTAM, { armR: -50 }, { rim: "#fff6d0", side: -1, z: 7 }) + TAG(60, 1180, "ПРОБЕГ", "412 000 км", -5, "#ff7a6a", "probeg"), lights: AB_L,
  bubbles: [{ id: "r1", p: "ru", html: "Одна хозяйка, брат!<br><em>Фирма!</em>", fs: 44 }, { id: "z2", p: "zb", html: "Это не хозяйка,<br><em>это конвейер!</em>", fs: 42 }] }, { x: 560, y: 1200, s: 1.06 });
// 3. маятник → Тамбов
mount("s3", { far: MAP(0), farBlur: 0, bubbles: [{ id: "e3", at: [540, 470], html: "Маятник говорит —<br><em>Тамбов!</em>", fs: 46 }] }, { x: 540, y: 960, s: 1 });
mount("s3b", { bg: "trassatambov", grade: "dawn",
  mid: car(VE, 30, 1620, 640, { z: 4, sheen: .4 }) + ch("perekup", spk("vl", "valera"), 870, 1780, 740, VALERA, { armR: -60 }, { rim: "#ffb36a", side: -1, z: 7 }) + GAUGE(110, 1100), lights: TT_L,
  bubbles: [{ id: "v1", p: "vl", html: "Не бита, не крашена!<br><em>Ну… чуть-чуть.</em>", fs: 42 }] }, { x: 560, y: 1200, s: 1.06 });
// 4. Стасу бот прислал Весту
{ const H = HOLDPHONE("perekup", spk("sp", "stas"), 540, 1960, 1680, STAS, VCARD(), { rim: "#fff2c0", side: 1 });
  mount("s4", { bg: "dvorutro", grade: "day", farBlur: 9, mid: H.mid, lights: H.lights }, { x: 540, y: 960, s: 1 }); }
mount("s4b", { bg: "dvorutro", grade: "day",
  mid: car(VE, 40, 1620, 680, { z: 4, sheen: .7 }) + ch("perekup", spk("sv", "stas"), 880, 1780, 740, STAS, { armR: -70 }, { rim: "#fff2c0", side: -1, z: 7 }), lights: DV_L,
  bubbles: [{ id: "s1", p: "sv", html: "Белая, одна хозяйка, ниже рынка.<br><em>Как в гороскопе.</em>", fs: 38 }] }, { x: 560, y: 1200, s: 1.06 });
// 5. «просто не вам» → фильтр в боте
mount("s5", { bg: "salonmaga", grade: "night", mid: SALON("b", { armR: -60 }, { look: "o" }), lights: SAL_L,
  bubbles: [{ id: "e4", p: "mgb", html: "Я же говорил — белая Веста.<br><em>Просто не вам.</em>", fs: 40 }] }, { x: 540, y: 1180, s: 1.06 });
{ const H = HOLDPHONE("perekup", spk("zp", "zhora"), 540, 1960, 1680, ZHORA, VFILTER(), { rim: "#ffb84a", side: 1, id: "zph" });
  mount("s5b", { bg: "salonmaga", grade: "night", farBlur: 9, mid: H.mid, lights: H.lights }, { x: 540, y: 960, s: 1 }); }
// 6. шар с карточкой бота → карточка «Перехвата»
mount("s6", { far: BALL(`<div id="bcard" style="position:absolute;left:150px;top:200px;width:400px">${BOTH("Веста · 1 хозяйка", CARD("Lada Vesta · 2021", "990 000 ₽", "1 хозяйка · ниже рынка", "⏱ 1 с после публикации"))}</div>`, "ball2"), farBlur: 0 }, { x: 540, y: 960, s: 1 });
mount("s6b", { far: BALL(VEIN, "ball3"), farBlur: 0, over: CTA58.replace('<div style="position:absolute;', '<div id="cta" style="opacity:0;position:absolute;') }, { x: 540, y: 960, s: 1 });

$("#end h2").innerHTML = E.end;

window.build = R => {
  const tl = R.tl;
  const { pop } = common(R, { shake: 0 });
  for (const el of Object.values(SC)) {
    el.sheens = [...el.querySelectorAll(".sheen")];
    el.glows = [...el.querySelectorAll(".lights .glow")].map(g => ({ g, o: +g.style.opacity }));
    el.flames = [...el.querySelectorAll(".flame")];
  }
  const talk = (lv, f) => lv > .28 && !(lv < .55 && f % 3 === 2);
  const MOOD = { zsa: "o", zb: "o", zsb: "o" };
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
      el.flames.forEach((fl, j) => { fl.style.transform = `scale(${(1 + .12 * R.noise(t * 6 + j * 7)).toFixed(3)},${(1 + .2 * R.noise(t * 5 + j * 3)).toFixed(3)}) rotate(${(6 * R.noise(t * 4 + j)).toFixed(1)}deg)`; });
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
  const mist = (from, to, at) => {       // в «магические» вставки — через фиолетовую дымку
    tl.set(SC[from], { opacity: 0 }, at).set(SC[to], { opacity: 1 }, at);
    tl.fromTo(SC[to], { filter: "brightness(2) hue-rotate(40deg) blur(12px)" }, { filter: "brightness(1) hue-rotate(0deg) blur(0px)", duration: .55, ease: "power2.out", immediateRender: false }, at)
      .set(SC[to], { filter: "none" }, at + .56);
    R.sfx("riser", at - .4, .45); R.sfx("swish", at, .6);
  };
  const tagOn = (on, at) => tl.to("#tag", { opacity: on ? 1 : 0, duration: .2 }, at);
  const move = (n, to, at, d, ease = "power2.inOut") => tl.to(cam(n), { ...to, duration: d, ease }, at);
  const ids = E.lines.map(l => l.id), nxt = l => ids[ids.indexOf(l) + 1];
  const bub = (l, until) => pop("#b_" + l, st[l] - .05, until ?? Math.min(en[l] + .8, nxt(l) ? st[nxt(l)] - .1 : en[l] + 1));
  const fog = (b, at, d) => { tl.fromTo(`#${b}f1`, { x: -120 }, { x: 160, duration: d, ease: "sine.inOut", immediateRender: false }, at);
    tl.fromTo(`#${b}f2`, { x: 140 }, { x: -180, duration: d, ease: "sine.inOut", immediateRender: false }, at); };

  // 1. хрустальный шар: Веста проявляется в тумане → салон
  gsap.set(SC.s1, { opacity: 1 }); SC.s1.style.display = "";        // первый кадр (обложка) — шар с Вестой и подписью, без плашки серии
  gsap.set(["#title", "#tag", "#cnt"], { opacity: 0 });
  gsap.set("#vein", { opacity: .55 });
  show("s1", 0); move("s1", { s: 1.1, y: 900 }, 0, st.e1, "none"); fog("ball", 0, st.e1);
  tl.to("#vein", { opacity: 1, duration: 1.4, ease: "sine.inOut" }, W("l0", "весту") - .3); R.sfx("ping", W("l0", "весту"), .5);
  const SW1 = st.e1 - .4; mist("s1", "s1b", SW1); tagOn(1, SW1 + .3);
  move("s1b", { s: 1.14 }, SW1, en.z1 - SW1 + .3, "none"); bub("e1", st.z1 - .1); bub("z1", st.l1 - .45);
  // 2. карты таро: средняя переворачивается → автобаза
  const SW2 = st.l1 - .4; mist("s1b", "s2", SW2); tagOn(0, SW2);
  ["#tc0", "#tc1", "#tc2"].forEach((c, k) => { tl.fromTo(c, { y: -900, opacity: 0 }, { y: 0, opacity: 1, duration: .35, ease: "power3.out", immediateRender: false }, SW2 + .2 + k * .18); R.sfx("swish", SW2 + .2 + k * .18, .4); });
  const FL = W("e2", "шаш") - .25;
  tl.fromTo("#tc1", { rotationY: 0 }, { rotationY: 180, duration: .45, ease: "power2.inOut", immediateRender: false }, FL); R.sfx("pop", FL + .3, .6);
  move("s2", { s: 1.08 }, SW2, en.e2 - SW2 + .3, "none"); bub("e2", st.l2 - .45);
  const SW3 = st.l2 - .4; swap("s2", "s2b", SW3); tagOn(1, SW3 + .3); move("s2b", { s: 1.14 }, SW3, en.z2 - SW3 + .3, "none");
  gsap.set("#probeg", { opacity: 0 }); const PB = W("l2", "412") - .1;
  tl.fromTo("#probeg", { opacity: 0, scale: 2 }, { opacity: 1, scale: 1, duration: .18, ease: "power4.out", immediateRender: false }, PB); R.sfx("impact", PB, .7);
  bub("r1", st.z2 - .1); bub("z2", st.l3 - .45);
  // 3. маятник качается и замирает над Тамбовом → трасса, толщиномер
  const SW4 = st.l3 - .4; mist("s2b", "s3", SW4); tagOn(0, SW4);
  const ST3 = W("e3", "тамб") - .15;
  gsap.set("#pend", { rotation: -24 });
  let a = SW4 + .3, amp = 24; for (let k = 0; a < ST3 - .55; k++) { const d = .55; tl.to("#pend", { rotation: (k % 2 ? -1 : 1) * amp, duration: d, ease: "sine.inOut" }, a); a += d; amp *= .92; }
  tl.to("#pend", { rotation: 17, duration: .5, ease: "back.out(2)" }, a);
  tl.set("#tamb", { attr: { opacity: 1 } }, ST3).fromTo("#tamb", { scale: 2.2, transformOrigin: "260px 420px" }, { scale: 1, duration: .25, ease: "power3.out", immediateRender: false }, ST3); R.sfx("impact", ST3, .7);
  move("s3", { s: 1.06 }, SW4, en.e3 - SW4 + .3, "none"); bub("e3", st.l4 - .45);
  const SW5 = st.l4 - .4; swap("s3", "s3b", SW5); tagOn(1, SW5 + .3); move("s3b", { s: 1.14 }, SW5, en.v1 - SW5 + .3, "none");
  $("#gaugen").textContent = "0"; gsap.set("#gauge", { opacity: 0 });
  const GA = W("l4", "толщ") - .2;
  tl.fromTo("#gauge", { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: .25, ease: "back.out(1.8)", immediateRender: false }, GA); R.count($("#gaugen"), GA + .2, 0, 1200, 1.2); R.sfx("bleep", GA + 1.4, .4);
  bub("v1", st.l5 - .45);
  // 4. Стасу бот прислал Весту
  const SW6 = st.l5 - .4; swap("s3b", "s4", SW6); move("s4", { s: 1.07, y: 1000 }, SW6, en.l5 - SW6 + .3, "none");
  gsap.set("#nvc", { opacity: 0 }); const NV = W("l5", "бот") - .1;
  tl.fromTo("#nvc", { opacity: 0, y: -50 }, { opacity: 1, y: 0, duration: .3, ease: "back.out(1.8)", immediateRender: false }, NV); R.sfx("ping", NV, .9);
  cut("s4", "s4b", st.s1 - .1); move("s4b", { s: 1.14 }, st.s1 - .1, en.s1 - st.s1 + .4, "none"); bub("s1", st.e4 - .45);
  // 5. «просто не вам» → Жора ставит фильтр
  const SW7 = st.e4 - .4; swap("s4b", "s5", SW7); move("s5", { s: 1.14 }, SW7, en.e4 - SW7 + .3, "none"); bub("e4", st.l6 - .2);
  const SW8 = st.l6 - .3; swap("s5", "s5b", SW8); move("s5b", { s: 1.07, y: 1000 }, SW8, 3.4, "none");
  // 6. шар показывает бота → карточка «Перехвата»
  const SW9 = W("l6", "присыл") + .3; mist("s5b", "s6", SW9); tagOn(0, SW9); fog("ball2", SW9, 3);
  gsap.set("#bcard", { opacity: 0 });
  tl.fromTo("#bcard", { opacity: 0, scale: .7 }, { opacity: 1, scale: 1, duration: .5, ease: "back.out(1.6)", immediateRender: false }, SW9 + .4); R.sfx("ping", SW9 + .5, .8);
  move("s6", { s: 1.08 }, SW9, 3, "none");
  const CT = W("l6", "ссылк") - .4; cut("s6", "s6b", CT); fog("ball3", CT, 3);
  tl.fromTo("#cta", { opacity: 0, y: 80, scale: .9 }, { opacity: 1, y: 0, scale: 1, duration: .4, ease: "back.out(1.6)", immediateRender: false }, CT + .1);
  ending(R, en.l6 + .35);
};

// ── ep58c «Неон»: быстрая уникализация — меняется только заставка ──
$("#title .a").textContent = "Веста по гороскопу"; $("#title .a").style.cssText = "font-size:110px;background:#ffd23f;color:";
$("#title .b").textContent = ""; $("#title .b").style.cssText = "font-size:60px;background:;color:#ffd23f";
const ORIG = [...document.querySelectorAll("#lbx .lbt, #lbx .lbb")].map(e => e.textContent), HEADT = 2.4;
{ const L = document.querySelector("#lbx"); if (L) { const a = L.querySelector(".lbt"), b = L.querySelector(".lbb");   // кинорамка вместо плашки (ep56)
  a.textContent = "Веста по гороскопу"; b.textContent = ""; a.style.background = b.style.background = "#ffd23f"; a.style.color = b.style.color = ""; } }
{ const K = document.querySelector("#ballc"); if (K) { const orig = K.innerHTML, col = K.style.color;   // надпись над хрустальным шаром (ep58)
  K.innerHTML = "Веста по гороскопу"; K.style.color = "#ffd23f";
  const B = window.build; window.build = R => { B(R); R.tl.to(K, { opacity: 0, duration: .15 }, HEADT - .6);
    R.tl.set(K, { innerHTML: orig, color: col }, HEADT - .45); R.tl.to(K, { opacity: 1, duration: .15 }, HEADT - .4); }; } }
{ const K = document.querySelector("#skc"); if (K) { const [a, b] = K.children, orig = [a.textContent, b.textContent], bg = K.style.background, col = K.style.color;   // подпись судебного рисунка (ep57)
  a.textContent = "Веста по гороскопу"; b.textContent = ""; K.style.background = "#ffd23f"; K.style.color = "";
  const B = window.build; window.build = R => { B(R); R.tl.to(K, { opacity: 0, duration: .15 }, HEADT - .6);
    R.tl.set(a, { textContent: orig[0] }, HEADT - .45).set(b, { textContent: orig[1] }, HEADT - .45).set(K, { background: bg, color: col }, HEADT - .45);
    R.tl.to(K, { opacity: 1, duration: .15 }, HEADT - .4); }; } }
{ const L = document.querySelector("#lbx"); if (L) { const B = window.build; window.build = R => { B(R);   // до склейки с основным видео (HEAD) рамка возвращается к исходной
  const bars = [L.querySelector(".lbt"), L.querySelector(".lbb")], col = ["#fff", "#ffd23f"];
  R.tl.to(bars, { opacity: 0, duration: .15 }, HEADT - .6);
  bars.forEach((el, i) => R.tl.set(el, { textContent: ORIG[i], background: "#000", color: col[i] }, HEADT - .45));
  R.tl.to(bars, { opacity: 1, duration: .15 }, HEADT - .4); }; } }
