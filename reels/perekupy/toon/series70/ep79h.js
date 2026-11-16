// «ТОЛЯН · 18: ТЕСТ-ДРАЙВ С ДЕДОМ» (ep79) — сезон «Свой автосалон», без мата.
// ОБЛОЖКА (Толян с ботом, дождь) → Гоша и Палыч у «пятёрки» → тест-драйв в салоне (дед командует сзади) → торг с банкой огурцов
// → +25 000, но 1/10 (Римма) → «деньги крутятся» → бот: две машины → видеосвязь с Лёхой (разделённый экран) → 3/10 → Жора в бинокль → финал.
$("#title .a").textContent = E.rubric; $("#title .b").textContent = E.subtitle; $("#title .b").style.fontSize = "74px"; $("#tag span").textContent = "сезон: свой автосалон";
document.querySelector("#cam > svg#bg")?.remove();
const W = (line, pre, n = 0) => {
  const norm = s => s.toLowerCase().replace(/ё/g, "е").replace(/[^а-я0-9a-z]/g, "");
  const hits = (TT.words[line] || []).filter(w => w[1] >= st[line] - .7 && w[2] <= en[line] + .05 && norm(w[0]).startsWith(norm(pre)));
  if (!hits[n]) console.warn("W miss", line, pre);
  return hits[n] ? Math.max(hits[n][1], st[line] - .05) : null;
};
const Wd = (line, pre, frac) => W(line, pre) ?? st[line] + (en[line] - st[line]) * frac;
const root = $("#scene"), SC = {}, SPK = {};
const mount = (name, def, sh) => (SC[name] = C.mount(root, def, sh));
const spk = (p, v) => (SPK[p] = v, p);
const T = (p, x, foot, h, pose = {}, extra = {}) => ch("tolyan", spk(p, "tolyan"), x, foot, h, {}, pose, extra);
const RI = (p, x, foot, h, pose = {}, extra = {}) => RIM(ch("vika", spk(p, "rimma"), x, foot, h, null, pose, extra));
const PA = (p, x, foot, h, o = {}, pose = {}, extra = {}) => ch("perekup", spk(p, "palych"), x, foot, h, { ...PAL, ...o }, pose, extra);
const G = (p, x, foot, h, o = {}, pose = {}, extra = {}) => ch("perekup", spk(p, "gosha"), x, foot, h, { ...GOSHA, ...o }, pose, extra);
const L = (p, x, foot, h, o = {}, pose = {}, extra = {}) => LEHA(ch("perekup", spk(p, "leha"), x, foot, h, { ...LEHA_O, ...o }, pose, extra));
const Z = (p, x, foot, h, o = {}, pose = {}, extra = {}) => ch("perekup", spk(p, "zhora"), x, foot, h, { ...ZHORA, ...o }, pose, extra);
const grp = (id, html, z = "") => `<div class="grp" id="${id}" style="position:absolute;left:0;top:0;width:1080px;height:1920px${z !== "" ? `;z-index:${z}` : ""}">${html}</div>`;
const RL = glow(540, 300, 480, "#ffffff", .15), SL = glow(540, 600, 520, "#ffffff", .2);
const CTA79 = CTA.replace('<div style="position:absolute;', '<div id="cta" style="opacity:0;position:absolute;');
const SG = SIGN77(250, 605, 3, .7);

// 1. обложка: Толян с ботом под дождём
{ const H = HOLDPHONE("tolyan", spk("ta", "tolyan"), 540, 2090, 1680, {}, GRCARD(), { rim: "#ffffff", side: 1 });
  mount("s1", { bg: "ploshchadkadozhd", farBlur: 8, mid: H.mid, over: RAIN("r1"), lights: H.lights + RL }, { x: 540, y: 960, s: 1 }); }
// 2. Гоша и Палыч у «пятёрки»
mount("s2", { bg: "ploshchadkadozhd", mid: SG + car(V05, 320, 1600, 640, { z: 5, sheen: .5 }) + G("ga", 170, 1880, 820, {}, { armR: -60 }, { rim: "#fff", side: 1, z: 7 }) + PA("pa", 900, 1880, 760, {}, { armL: -100 }, { rim: "#fff", side: -1, z: 7 }), over: RAIN("r2"), lights: RL,
  bubbles: [{ id: "g0", p: "ga", html: "Можно тест-драйв?", fs: 46 }, { id: "p0", p: "pa", html: "Только со мной.<br><em>Я на ней двадцать шесть лет езжу.</em>", fs: 36 }] }, { x: 540, y: 1150, s: 1.02 });
// 3. тест-драйв: салон изнутри
mount("s3", { bg: "salon2105", mid: grp("pk3", PA("pb", 540, 1500, 620, { look: "o" }, { armR: -120 }, { z: 6 }), 6) + T("tb", 230, 2100, 1050, {}, {}, { z: 9 }) + G("gb", 850, 2100, 1050, { look: "o" }, {}, { z: 9 }) + DASH05(20), lights: SL,
  bubbles: [{ id: "p1", p: "pb", html: "Плавнее! Сцепление отпускай,<br><em>как будто кота гладишь!</em>", fs: 38 }] }, { x: 540, y: 1100, s: 1 });
// 4. торг с огурцами
mount("s4", { bg: "ploshchadkadozhd", farBlur: 2, mid: G("gc", 260, 1940, 920, {}, { armR: -60 }, { rim: "#fff", side: 1, z: 7 }) + PA("pc", 800, 1940, 880, {}, { armL: -80 }, { rim: "#fff", side: -1, z: 7 }) + JAR(560, 1380, 1.1), over: RAIN("r4"), lights: RL,
  bubbles: [{ id: "g1", p: "gc", html: "Беру! Но за<br><em>сто восемьдесят тысяч.</em>", fs: 42 }, { id: "p2", p: "pc", html: "Двести. И банку огурцов<br><em>в подарок.</em>", fs: 40 }, { id: "g2", p: "gc", html: "По рукам!", fs: 52 }] }, { x: 540, y: 1120, s: 1.03 });
// 5. Римма: машин меньше
mount("s5", { bg: "ploshchadkadozhd", mid: SG + T("tc", 260, 1900, 860, { armR: -60 }, { rim: "#fff", side: 1, z: 7 }) + RI("ra", 800, 1900, 820, { armL: -40 }, { rim: "#fff", side: -1, z: 7 }), over: RAIN("r5"), lights: RL,
  bubbles: [{ id: "r0", p: "ra", html: "Машин стало меньше,<br><em>Анатолий.</em>", fs: 46 }] }, { x: 540, y: 1150, s: 1.02 });
// 6. «деньги крутятся»
mount("s6", { bg: "ploshchadkadozhd", farBlur: 3, mid: T("td", 540, 2000, 1080, { armR: -140 }, { rim: "#fff", side: 1, z: 7 }), over: RAIN("r6"), lights: RL,
  bubbles: [{ id: "t0", p: "td", html: "Зато деньги крутятся,<br><em>Римма Захаровна.</em>", fs: 46 }] }, { x: 540, y: 1080, s: 1.04 });
// 7. бот: две карточки
mount("i1", { bg: "ploshchadkadozhd", over: TWOCARDS() }, { x: 540, y: 960, s: 1 });
// 8. видеосвязь: разделённый экран
{ const left = T("te", 540, 1950, 980, { armR: -150 }, { rim: "#fff", side: 1, z: 7 }) + RAIN("r8"), right = L("la", 540, 1950, 980, {}, { armL: -40 }, { rim: "#bfc8ff", side: -1, z: 7 });
  CINE.ANCH.te = [267, CINE.ANCH.te[1], CINE.ANCH.te[2]]; CINE.ANCH.la = [813, CINE.ANCH.la[1], CINE.ANCH.la[2]];
  mount("i2", { bg: "ploshchadkadozhd", over: SPLIT2("ploshchadkadozhd", left, "rollssalon", right),
    bubbles: [{ id: "t1", p: "te", html: "Лёха, бот прислал две:<br><em>обе ниже рынка!</em>", fs: 34 }, { id: "x0", p: "la", html: "Бери обе. Деньги мои,<br><em>прибыль пополам.</em>", fs: 34 }] }, { x: 540, y: 960, s: 1 }); }
// 9. две машины заезжают
mount("s7", { bg: "ploshchadkadozhd", mid: SG + grp("cg1", car(GRA, -40, 1600, 600, { z: 5, sheen: .5 }), 5) + grp("cg2", car(V10, 480, 1700, 600, { z: 6, sheen: .5 }), 6), over: RAIN("r7"), lights: RL }, { x: 540, y: 1150, s: 1.02 });
// 10. Жора в бинокль
mount("s8", { bg: "ploshchadkadozhd", mid: SG + car(GRA, -40, 1600, 600, { z: 5 }) + car(V10, 480, 1700, 600, { z: 6 }) + T("tf", 900, 1900, 700, {}, { z: 7 }), over: RAIN("r9") + BINO() + PIPS(Z("za", 160, 640, 640, {}, { armR: -150 }, { z: 2 }), "za", "pp1", "#c0392b", 380, 1560), lights: RL,
  bubbles: [{ id: "z0", p: "za", html: "Студент вырос. Ну-ну.<br><em>Завтра у него будет сюрприз.</em>", fs: 38 }] }, { x: 540, y: 1480, s: 1.02 });
// 11. карточка бота
mount("s9", { bg: "ploshchadkadozhd", farBlur: 6, over: CTA79, lights: RL }, { x: 540, y: 1000, s: .98 });

$(".stage").insertAdjacentHTML("beforeend", CNT77("20 000", 2));
$("#end h2").innerHTML = E.end;

window.build = R => {
  const tl = R.tl;
  const { pop } = common(R, { shake: 0 });
  for (const el of Object.values(SC)) {
    el.sheens = [...el.querySelectorAll(".sheen")];
    el.glows = [...el.querySelectorAll(".lights .glow")].map(g => ({ g, o: +g.style.opacity }));
    el.rains = [...el.querySelectorAll(".rainfx")];
  }
  const talk = (lv, f) => lv > .28 && !(lv < .55 && f % 3 === 2);
  const MOOD = { pb: "o", gb: "o", pa: "flat", la: "flat", za: "flat" };
  R.hooks.push(t => {
    const f = Math.floor(t * 30);
    for (const el of Object.values(SC)) {
      const on = +el.style.opacity > 0;
      el.style.display = on ? "" : "none";
      if (!on) continue;
      const k = el.cam.s > 1.6 ? .55 : 1, bump = el === SC.s3 ? 2.6 : 1;     // в салоне машину потряхивает
      C.apply(el, [(R.noise(t * .6) * 9 + R.noise(t * 1.7 + 40) * 3) * k, (R.noise(t * .5 + 9) * 10 + R.noise(t * 1.9 + 70) * 3 * bump + (bump > 1 ? R.noise(t * 9) * 6 : 0)) * k, R.noise(t * .4 + 20) * .3 * k]);
      el.sheens.forEach((s, j) => { s.style.backgroundPosition = `${(130 - ((t * 14 + j * 45) % 160)).toFixed(1)}% 0`; });
      el.glows.forEach(({ g, o }, j) => { g.style.opacity = (o * (.88 + .12 * R.noise(t * 2.5 + j * 3.1))).toFixed(3); });
      el.rains.forEach(r => { r.style.transform = `translateY(${((t * 1500) % 1920).toFixed(0)}px)`; });
    }
    for (const [p, v] of Object.entries(SPK)) {
      if (!document.getElementById(p)) continue;
      const lv = (LIP[v] || [])[f] || 0;
      mouth(p, talk(lv, f) ? "talk" : (MOOD[p] || "grin"));
    }
  });
  window.MUSIC = { style: "bed", bpm: 92, end: R.dur - 1.2 };   // фоновой музыки нет (MUSIC_VOL=0)

  const cam = n => SC[n].cam;
  let cur = "s1";
  const cut = (to, at, c) => { if (c) tl.set(cam(to), c, at); tl.set(SC[cur], { opacity: 0 }, at).set(SC[to], { opacity: 1 }, at); R.sfx("tick", at, .35); cur = to; };
  const swap = (to, at) => { const from = cur;
    tl.set(SC[to], { opacity: 1, x: 1080, filter: "blur(14px)" }, at)
      .to(SC[from], { x: -1080, filter: "blur(14px)", duration: .32, ease: "power3.in" }, at)
      .to(SC[to], { x: 0, filter: "blur(0px)", duration: .35, ease: "power3.out" }, at + .1)
      .set(SC[from], { opacity: 0, x: 0, filter: "none" }, at + .47).set(SC[to], { filter: "none" }, at + .48);
    R.sfx("whoosh", at, .55); cur = to; };
  const push = (n, at, d, to = { s: "+=0.06" }) => tl.to(cam(n), { ...to, duration: d, ease: "none" }, at);
  const ids = E.lines.map(l => l.id), nxt = l => ids[ids.indexOf(l) + 1];
  const bub = (l, until) => pop("#b_" + l, st[l] - .05, until ?? Math.min(en[l] + .8, nxt(l) ? st[nxt(l)] - .1 : en[l] + 1));
  const bump = (sel, at) => tl.fromTo(sel, { scale: 1.3 }, { scale: 1, duration: .4, ease: "back.out(2)", immediateRender: false }, at);

  // 1. обложка: плашка с кадра 0, гаснет к 1,6 с
  gsap.set(SC.s1, { opacity: 1 }); SC.s1.style.display = "";
  gsap.set(["#cnt", "#cnt77"], { opacity: 0 });
  tl.set(SC.s1, { opacity: 1 }, 0); tl.to("#title", { opacity: 0, y: -50, duration: .25 }, 1.6);
  push("s1", 0, 2.2, { s: 1.06, y: 1000 });
  tl.fromTo("#gcc", { scale: 1 }, { scale: 1.06, duration: .15, yoyo: true, repeat: 1, ease: "power2.out", immediateRender: false }, 1.0); R.sfx("ping", 1.0, .5);
  // 2. Гоша и Палыч
  const SW2 = Math.max(2.2, Wd("l0", "первый", .6) - .3); swap("s2", SW2); tl.to("#cnt77", { opacity: 1, duration: .25 }, SW2 + .3);
  push("s2", SW2, en.p0 - SW2 + .5, { s: 1.08 }); bub("g0"); bub("p0", st.l1 + .2);
  // 3. тест-драйв в салоне
  const SW3 = st.l1 - .1; swap("s3", SW3); tl.to("#cnt77", { opacity: 0, duration: .15 }, SW3); R.sfx("rev", SW3 + .2, .5);
  push("s3", SW3, en.p1 - SW3 + .5, { s: 1.06 }); bub("p1", st.g1 - .1);
  tl.fromTo("#pk3", { y: 60 }, { y: 0, duration: .35, ease: "back.out(2)", immediateRender: true }, st.p1 - .2);
  // 4. торг с огурцами
  cut("s4", st.g1 - .2); tl.to("#cnt77", { opacity: 1, duration: .2 }, st.g1 - .2); push("s4", st.g1 - .2, en.g2 - st.g1 + .5);
  bub("g1", st.p2 - .1); bub("p2", st.g2 - .05); bub("g2", st.l2 + .3);
  tl.fromTo("#jar", { scale: 0, rotation: -20 }, { scale: 1, rotation: 0, duration: .4, ease: "back.out(2.5)", immediateRender: true }, Wd("p2", "банку", .4) - .1); R.sfx("pop", Wd("p2", "банку", .4), .6);
  // 5. +25 000, но 1/10 → Римма
  const SW5 = st.l2 - .2; cut("s5", SW5); push("s5", SW5, en.r0 - SW5 + .5, { s: 1.08 });
  const MONEY = Wd("l2", "плюс", .1); R.count($("#cv"), MONEY, 20000, 45000, .7); bump("#cnt77", MONEY); R.sfx("clack", MONEY, .6);
  const ONE = Wd("l2", "одна", .8); tl.set("#cc", { textContent: "1" }, ONE); bump("#cnt77", ONE); R.sfx("tick", ONE, .6);
  bub("r0", st.t0 - .1);
  // 6. «деньги крутятся»
  cut("s6", st.t0 - .2); push("s6", st.t0 - .2, en.t0 - st.t0 + .4, { s: 1.12 }); bub("t0", st.l3 - .1);
  // 7. бот: две карточки
  const SW7 = st.l3 - .1; swap("i1", SW7); tl.to("#cnt77", { opacity: 0, duration: .15 }, SW7);
  tl.fromTo("#gcc2", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: .3, ease: "back.out(2)", immediateRender: true }, SW7 + .5); R.sfx("ping", SW7 + .5, .7);
  tl.fromTo("#tcc2", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: .3, ease: "back.out(2)", immediateRender: true }, SW7 + 1.1); R.sfx("ping", SW7 + 1.1, .7);
  // 8. видеосвязь
  const SW8 = st.t1 - .2; cut("i2", SW8); R.sfx("ring", SW8, .4); bub("t1", st.x0 - .1); bub("x0", st.l4 - .1);
  // 9. две машины заезжают: 3/10
  const SW9 = st.l4 - .2; swap("s7", SW9); tl.to("#cnt77", { opacity: 1, duration: .25 }, SW9 + .3); push("s7", SW9, en.l4 - SW9 + .4);
  tl.fromTo("#cg1", { x: -900 }, { x: 0, duration: 1.0, ease: "power3.out", immediateRender: true }, SW9 + .3);
  tl.fromTo("#cg2", { x: 1100 }, { x: 0, duration: 1.0, ease: "power3.out", immediateRender: true }, SW9 + .9); R.sfx("whoosh", SW9 + .3, .4); R.sfx("whoosh", SW9 + .9, .4);
  const CARS = Wd("l4", "три", .55); tl.set("#cc", { textContent: "3" }, CARS); bump("#cnt77", CARS); R.sfx("clack", CARS, .7);
  // 10. Жора в бинокль
  const SW10 = st.z0 - .3; cut("s8", SW10); tl.to("#cnt77", { opacity: 0, duration: .15 }, SW10);
  tl.fromTo("#pp1", { scale: .5, opacity: 0 }, { scale: 1, opacity: 1, duration: .28, ease: "back.out(2)", immediateRender: true }, SW10 + .1);
  tl.fromTo(cam("s8"), { x: 400 }, { x: 640, duration: Math.max(1.5, en.z0 - SW10), ease: "sine.inOut", immediateRender: false }, SW10);
  bub("z0", st.l5 + .4);
  // 11. финал: фраза Лиса → карточка
  const SW11 = Math.min(st.l5 + 2.2, en.l5 - 2.3);
  swap("s9", SW11); tl.to("#tag", { opacity: 0, duration: .2 }, SW11);
  tl.fromTo("#cta", { opacity: 0, y: 80, scale: .9 }, { opacity: 1, y: 0, scale: 1, duration: .4, ease: "back.out(1.6)", immediateRender: false }, SW11 + .5);
  ending(R, en.l5 + .3);
};

// ── ep79h «Пастель»: быстрая уникализация — меняется только заставка ──
$("#title .a").textContent = "ТОЛЯН · 18:"; $("#title .a").style.cssText = "font-size:110px;background:#ff6fae;color:#151515";
$("#title .b").textContent = "ЖОРА В БИНОКЛЬ"; $("#title .b").style.cssText = "font-size:60px;background:#151515;color:#ff6fae";
const ORIG = [...document.querySelectorAll("#lbx .lbt, #lbx .lbb")].map(e => e.textContent), HEADT = 2.4;
{ const L = document.querySelector("#lbx"); if (L) { const a = L.querySelector(".lbt"), b = L.querySelector(".lbb");   // кинорамка вместо плашки (ep56)
  a.textContent = "ТОЛЯН · 18:"; b.textContent = "ЖОРА В БИНОКЛЬ"; a.style.background = b.style.background = "#ff6fae"; a.style.color = b.style.color = "#151515"; } }
{ const K = document.querySelector("#ballc"); if (K) { const orig = K.innerHTML, col = K.style.color;   // надпись над хрустальным шаром (ep58)
  K.innerHTML = "ТОЛЯН · 18:"; K.style.color = "#ff6fae";
  const B = window.build; window.build = R => { B(R); R.tl.to(K, { opacity: 0, duration: .15 }, HEADT - .6);
    R.tl.set(K, { innerHTML: orig, color: col }, HEADT - .45); R.tl.to(K, { opacity: 1, duration: .15 }, HEADT - .4); }; } }
{ const K = document.querySelector("#skc"); if (K) { const [a, b] = K.children, orig = [a.textContent, b.textContent], bg = K.style.background, col = K.style.color;   // подпись судебного рисунка (ep57)
  a.textContent = "ТОЛЯН · 18:"; b.textContent = "ЖОРА В БИНОКЛЬ"; K.style.background = "#ff6fae"; K.style.color = "#151515";
  const B = window.build; window.build = R => { B(R); R.tl.to(K, { opacity: 0, duration: .15 }, HEADT - .6);
    R.tl.set(a, { textContent: orig[0] }, HEADT - .45).set(b, { textContent: orig[1] }, HEADT - .45).set(K, { background: bg, color: col }, HEADT - .45);
    R.tl.to(K, { opacity: 1, duration: .15 }, HEADT - .4); }; } }
{ const L = document.querySelector("#lbx"); if (L) { const B = window.build; window.build = R => { B(R);   // до склейки с основным видео (HEAD) рамка возвращается к исходной
  const bars = [L.querySelector(".lbt"), L.querySelector(".lbb")], col = ["#fff", "#ffd23f"];
  R.tl.to(bars, { opacity: 0, duration: .15 }, HEADT - .6);
  bars.forEach((el, i) => R.tl.set(el, { textContent: ORIG[i], background: "#000", color: col[i] }, HEADT - .45));
  R.tl.to(bars, { opacity: 1, duration: .15 }, HEADT - .4); }; } }
