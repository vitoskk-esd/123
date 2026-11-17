// «ТОЛЯН · 19: ОТКРЫТИЕ У ЖОРЫ» (ep80) — сезон «Свой автосалон», без мата.
// ОБЛОЖКА → открытие «ЖОРА МОТОРС» (растяжка, конфетти, Снежана, Жора с микрофоном) → толпа уходит к Жоре → Римма давит → бот: «ниже рынка 15%+»,
// Веста и Лексус → 5/10 → трактор Митяя с «Нивой» на красной дорожке (отсылка к «Деревне») → «ваш бампер» → толпа обратно → «тогда по-другому» → финал.
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
const SN = (p, x, foot, h, pose = {}, extra = {}) => SNZ(ch("vika", spk(p, "snezhana"), x, foot, h, null, pose, extra));
const Z = (p, x, foot, h, o = {}, pose = {}, extra = {}) => ch("perekup", spk(p, "zhora"), x, foot, h, { ...ZHORA, ...o }, pose, extra);
const E2 = (p, x, foot, h, o = {}, pose = {}, extra = {}) => ch("perekup", spk(p, "ego"), x, foot, h, { ...EGO, ...o }, pose, extra);
const M = (p, x, foot, h, o = {}, pose = {}, extra = {}) => ch("perekup", spk(p, "mit"), x, foot, h, { ...MIT, ...o }, pose, extra);
const grp = (id, html, z = "") => `<div class="grp" id="${id}" style="position:absolute;left:0;top:0;width:1080px;height:1920px${z !== "" ? `;z-index:${z}` : ""}">${html}</div>`;
const SL = glow(540, 300, 520, "#fff4d0", .25), OL = glow(540, 400, 520, "#ffffff", .2);
const CTA80 = CTA.replace('<div style="position:absolute;', '<div id="cta" style="opacity:0;position:absolute;');
const SG = SIGN77(250, 605, 3, .7);

// 1. обложка: Толян с ботом
{ const H = HOLDPHONE("tolyan", spk("ta", "tolyan"), 540, 2090, 1680, {}, VESCARD(), { rim: "#ffffff", side: 1 });
  mount("s1", { bg: "ploshchadkasolnce", farBlur: 8, mid: H.mid, lights: H.lights + SL }, { x: 540, y: 960, s: 1 }); }
// 2. открытие «ЖОРА МОТОРС»
mount("s2", { bg: "otkrytiezhory", mid: ZB2() + Z("za", 520, 1920, 760, {}, { armR: -60 }, { rim: "#fff", side: 1, z: 9 }) + MIC(733, 1624) + SN("sa", 880, 1900, 700, { armL: -100 }, { rim: "#fff", side: -1, z: 8 }), over: CONFETTI(), lights: OL,
  bubbles: [{ id: "s0", p: "sa", html: "Встречайте!<br><em>Открытие «Жора Моторс»!</em>", fs: 38 }, { id: "z0", p: "za", html: "Всё на десять процентов дешевле,<br><em>чем через дорогу!</em>", fs: 36 }] }, { x: 540, y: 1150, s: 1.02 });
// 3. толпа уходит к Жоре
mount("s3", { bg: "dvasalona", mid: CROWD(80, 1560, 6) + T("tb", 160, 1880, 640, { armR: -40 }, { rim: "#fff", side: 1, z: 9 }), lights: OL }, { x: 540, y: 1150, s: 1.02 });
// 4. Римма
mount("s4", { bg: "ploshchadkasolnce", mid: SG + T("tc", 260, 1900, 860, {}, { rim: "#fff", side: 1, z: 7 }) + RI("ra", 800, 1900, 820, { armL: -40 }, { rim: "#fff", side: -1, z: 7 }), lights: SL,
  bubbles: [{ id: "r0", p: "ra", html: "Пятая неделя, Анатолий. Три машины.<br><em>А покупатели — у Жоры.</em>", fs: 36 }] }, { x: 540, y: 1150, s: 1.02 });
// 5. бот: две карточки
mount("i1", { bg: "ploshchadkasolnce", over: TWOCARDS2() + PIPS(T("td", 160, 640, 640, {}, { z: 2 }), "td", "pp1", "#ffd23f", 60, 1580),
  bubbles: [{ id: "t0", p: "td", html: "Ниже рынка на пятнадцать —<br><em>беру всё.</em>", fs: 42 }] }, { x: 540, y: 960, s: 1 });
// 6. Веста и Лексус заезжают
mount("s5", { bg: "ploshchadkasolnce", mid: SG + grp("cg1", car(VES, -60, 1620, 620, { z: 5, sheen: .5 }), 5) + grp("cg2", car(LEX, 460, 1720, 640, { z: 6, sheen: .5 }), 6), lights: SL }, { x: 540, y: 1150, s: 1.02 });
// 7. трактор с «Нивой» на красной дорожке
mount("s6", { bg: "otkrytiezhory", mid: grp("tg", TRACTOR(560, 1700, 520, "tr1") + TOWROPE(440, 1560, 600, 1600) + car(NIVS, -60, 1700, 520, { z: 5 }), 5) + E2("ea", 200, 1920, 760, {}, { armR: -150 }, { rim: "#fff", side: 1, z: 9 }) + Z("zb", 900, 1920, 720, { look: "o" }, {}, { rim: "#fff", side: -1, z: 9 }), lights: OL,
  bubbles: [{ id: "e0", p: "ea", html: "Жора! Это ты мне<br><em>«зверя» продал?</em>", fs: 44 }, { id: "z2", p: "zb", html: "Дед, это был зверь!<br><em>Гарантия кончилась!</em>", fs: 40 }] }, { x: 540, y: 1180, s: 1.02 });
// 8. «ваш бампер» — толпа хохочет
mount("s7", { bg: "otkrytiezhory", farBlur: 2, mid: M("ma", 380, 1920, 860, {}, { armR: -100 }, { rim: "#fff", side: 1, z: 8 }) + NBUMP(560, 1380, "nb2", 10) + CROWD(620, 1700, 4, "crowd2", 6, 110), over: LAUGH(200, 520), lights: OL,
  bubbles: [{ id: "m0", p: "ma", html: "А это — ваш бампер.<br><em>С доставкой.</em>", fs: 44 }] }, { x: 540, y: 1150, s: 1.02 });
// 9. толпа идёт к Толяну
mount("s8", { bg: "dvasalona", mid: CROWD(620, 1640, 6, "crowd3") + grp("sg8", SN("sb", 900, 1900, 640, { armL: -60 }, { rim: "#fff", side: -1, z: 9 }), 9) + T("te", 140, 1880, 700, { armR: -150 }, { rim: "#fff", side: 1, z: 9 }), lights: OL,
  bubbles: [{ id: "t1", p: "te", html: "Добро пожаловать!<br><em>У нас без сюрпризов.</em>", fs: 44 }, { id: "s1", p: "sb", html: "Ой… а можно мне<br><em>тоже к студенту?</em>", fs: 40 }] }, { x: 540, y: 1150, s: 1.02 });
// 10. Жора крупно
mount("s9", { bg: "otkrytiezhory", farBlur: 6, mid: Z("zc", 540, 2150, 1500, { look: "flat" }, { armR: -60 }, { rim: "#fff", side: 1, z: 8 }), lights: OL,
  bubbles: [{ id: "z1", p: "zc", html: "Ладно, студент.<br><em>Тогда по-другому.</em>", fs: 50 }] }, { x: 540, y: 1000, s: 1.04 });
// 11. карточка бота
mount("s10", { bg: "ploshchadkasolnce", farBlur: 6, over: CTA80, lights: SL }, { x: 540, y: 1000, s: .98 });

$(".stage").insertAdjacentHTML("beforeend", CNT77("45 000", 3));
$("#end h2").innerHTML = E.end;

window.build = R => {
  const tl = R.tl;
  const { pop } = common(R, { shake: 0 });
  for (const el of Object.values(SC)) {
    el.sheens = [...el.querySelectorAll(".sheen")];
    el.glows = [...el.querySelectorAll(".lights .glow")].map(g => ({ g, o: +g.style.opacity }));
  }
  const talk = (lv, f) => lv > .28 && !(lv < .55 && f % 3 === 2);
  const MOOD = { zb: "o", zc: "flat", ea: "flat", sb: "o" };
  R.hooks.push(t => {
    const f = Math.floor(t * 30);
    for (const el of Object.values(SC)) {
      const on = +el.style.opacity > 0;
      el.style.display = on ? "" : "none";
      if (!on) continue;
      const k = el.cam.s > 1.6 ? .55 : 1;
      C.apply(el, [(R.noise(t * .6) * 9 + R.noise(t * 1.7 + 40) * 3) * k, (R.noise(t * .5 + 9) * 10 + R.noise(t * 1.9 + 70) * 3) * k, R.noise(t * .4 + 20) * .3 * k]);
      el.sheens.forEach((s, j) => { s.style.backgroundPosition = `${(130 - ((t * 14 + j * 45) % 160)).toFixed(1)}% 0`; });
      el.glows.forEach(({ g, o }, j) => { g.style.opacity = (o * (.88 + .12 * R.noise(t * 2.5 + j * 3.1))).toFixed(3); });
    }
    // толпа шагает (покачивание)
    document.querySelectorAll("#crowd g, #crowd2 g, #crowd3 g").forEach((g, j) => { g.setAttribute("transform", `translate(0 ${(Math.abs(Math.sin(t * 7 + j)) * -10).toFixed(1)})`); });
    for (const [p, v] of Object.entries(SPK)) {
      if (!document.getElementById(p)) continue;
      const lv = (LIP[v] || [])[f] || 0;
      mouth(p, talk(lv, f) ? "talk" : (MOOD[p] || "grin"));
    }
  });
  window.MUSIC = { style: "bed", bpm: 96, end: R.dur - 1.2 };   // фоновой музыки нет (MUSIC_VOL=0)

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
  const cnt = (on, at) => tl.to("#cnt77", { opacity: on ? 1 : 0, duration: on ? .25 : .15 }, at);

  // 1. обложка: плашка с кадра 0, гаснет к 1,6 с
  gsap.set(SC.s1, { opacity: 1 }); SC.s1.style.display = "";
  gsap.set(["#cnt", "#cnt77"], { opacity: 0 });
  tl.set(SC.s1, { opacity: 1 }, 0); tl.to("#title", { opacity: 0, y: -50, duration: .25 }, 1.6);
  push("s1", 0, 2.2, { s: 1.06, y: 1000 });
  tl.fromTo("#vsc", { scale: 1 }, { scale: 1.06, duration: .15, yoyo: true, repeat: 1, ease: "power2.out", immediateRender: false }, 1.0); R.sfx("ping", 1.0, .5);
  // 2. открытие: растяжка, конфетти
  const SW2 = Math.max(1.9, st.s0 - .4); swap("s2", SW2); push("s2", SW2, en.z0 - SW2 + .5, { s: 1.08 });
  tl.fromTo("#zb2", { scaleY: 0 }, { scaleY: 1, duration: .6, ease: "bounce.out", immediateRender: true }, SW2 + .3); R.sfx("drop", SW2 + .4, .5);
  tl.fromTo("#cf", { opacity: 0, scale: .3 }, { opacity: 1, scale: 1, duration: .5, ease: "power2.out", immediateRender: true }, Wd("s0", "открыт", .5));
  tl.to("#cf", { y: 300, opacity: 0, duration: 2.6, ease: "power1.in" }, Wd("s0", "открыт", .5) + .5); R.sfx("boom", Wd("s0", "открыт", .5), .5);
  bub("s0", st.z0 - .1); bub("z0", st.l1 + .2);
  // 3. толпа уходит к Жоре
  const SW3 = st.l1 - .2; cut("s3", SW3); cnt(true, SW3 + .2); push("s3", SW3, en.l1 - SW3 + .6);
  tl.fromTo("#crowd", { x: 0 }, { x: 520, duration: Math.max(2.4, st.r0 - SW3 + .4), ease: "none", immediateRender: true }, SW3);
  // 4. Римма
  cut("s4", st.r0 - .2); push("s4", st.r0 - .2, en.r0 - st.r0 + .5, { s: 1.08 }); bub("r0", st.t0 - .1);
  // 5. бот: две карточки
  const SW5 = st.t0 - .3; swap("i1", SW5); cnt(false, SW5);
  tl.fromTo("#pp1", { scale: .5, opacity: 0 }, { scale: 1, opacity: 1, duration: .28, ease: "back.out(2)", immediateRender: true }, SW5 + .1); bub("t0", st.l2 + .5);
  const C1 = Wd("l2", "весту", .15), C2 = Wd("l2", "лексус", .3);
  tl.fromTo("#vsc2", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: .3, ease: "back.out(2)", immediateRender: true }, C1 - .2); R.sfx("ping", C1 - .2, .7);
  tl.fromTo("#lxc2", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: .3, ease: "back.out(2)", immediateRender: true }, C2 - .2); R.sfx("ping", C2 - .2, .7);
  // 6. Веста и Лексус: 5/10
  const SW6 = Wd("l2", "деньги", .45) - .3; swap("s5", SW6); cnt(true, SW6 + .3); push("s5", SW6, 3);
  tl.fromTo("#cg1", { x: -900 }, { x: 0, duration: 1.0, ease: "power3.out", immediateRender: true }, SW6 + .2);
  tl.fromTo("#cg2", { x: 1100 }, { x: 0, duration: 1.0, ease: "power3.out", immediateRender: true }, SW6 + .7); R.sfx("whoosh", SW6 + .2, .4); R.sfx("whoosh", SW6 + .7, .4);
  const FIVE = Wd("l2", "пять", .65); tl.set("#cc", { textContent: "5" }, FIVE); bump("#cnt77", FIVE); R.sfx("clack", FIVE, .7);
  // 7. трактор на красной дорожке
  const SW7 = Wd("l2", "трактор", .9) - .9; swap("s6", SW7); cnt(false, SW7); push("s6", SW7, en.e0 - SW7 + .5, { s: 1.08 });
  tl.fromTo("#tg", { x: -1000 }, { x: 0, duration: 1.4, ease: "power2.out", immediateRender: true }, SW7 + .1); R.sfx("rev", SW7 + .2, .6);
  bub("e0", st.z2 - .1); bub("z2", st.m0 - .1);
  // 8. «ваш бампер» — хохот
  cut("s7", st.m0 - .2); push("s7", st.m0 - .2, en.m0 - st.m0 + 1, { s: 1.08 }); bub("m0", st.l3 - .05);
  tl.fromTo("#nb2", { rotation: -20, y: -40 }, { rotation: 0, y: 0, duration: .4, ease: "back.out(2)", immediateRender: true }, Wd("m0", "бампер", .4) - .1);
  tl.fromTo("#lol", { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: .3, ease: "back.out(3)", immediateRender: true }, en.m0 + .05); R.sfx("pop", en.m0 + .05, .6);
  // 9. толпа обратно к Толяну
  const SW9 = st.l3 - .2; swap("s8", SW9); cnt(true, SW9 + .3); push("s8", SW9, en.s1 - SW9 + .5);
  tl.fromTo("#crowd3", { x: 0 }, { x: -420, duration: Math.max(2.4, en.s1 - SW9), ease: "none", immediateRender: true }, SW9 + .1);
  tl.fromTo("#sg8", { x: 300, opacity: 0 }, { x: 0, opacity: 1, duration: .6, ease: "power2.out", immediateRender: true }, st.s1 - .6);
  bub("t1", st.s1 - .1); bub("s1", st.z1 - .1);
  // 10. Жора крупно
  cut("s9", st.z1 - .2); cnt(false, st.z1 - .2); push("s9", st.z1 - .2, en.z1 - st.z1 + .6, { s: 1.12 }); bub("z1", st.l4 + .5);
  // 11. финал: фраза Лиса → карточка
  const SW10 = Math.min(st.l4 + 2.2, en.l4 - 2.3);
  swap("s10", SW10); tl.to("#tag", { opacity: 0, duration: .2 }, SW10);
  tl.fromTo("#cta", { opacity: 0, y: 80, scale: .9 }, { opacity: 1, y: 0, scale: 1, duration: .4, ease: "back.out(1.6)", immediateRender: false }, SW10 + .5);
  ending(R, en.l4 + .3);
};

// ── ep80b «Архив»: быстрая уникализация — меняется только заставка ──
$("#title .a").textContent = "ТОЛЯН · 19:"; $("#title .a").style.cssText = "font-size:110px;background:#2f6db5;color:#fbfaf3";
$("#title .b").textContent = "ДЕШЕВЛЕ, ЧЕМ У СТУДЕНТА"; $("#title .b").style.cssText = "font-size:60px;background:#fbfaf3;color:#2f6db5";
const ORIG = [...document.querySelectorAll("#lbx .lbt, #lbx .lbb")].map(e => e.textContent), HEADT = 2.4;
{ const L = document.querySelector("#lbx"); if (L) { const a = L.querySelector(".lbt"), b = L.querySelector(".lbb");   // кинорамка вместо плашки (ep56)
  a.textContent = "ТОЛЯН · 19:"; b.textContent = "ДЕШЕВЛЕ, ЧЕМ У СТУДЕНТА"; a.style.background = b.style.background = "#2f6db5"; a.style.color = b.style.color = "#fbfaf3"; } }
{ const K = document.querySelector("#ballc"); if (K) { const orig = K.innerHTML, col = K.style.color;   // надпись над хрустальным шаром (ep58)
  K.innerHTML = "ТОЛЯН · 19:"; K.style.color = "#2f6db5";
  const B = window.build; window.build = R => { B(R); R.tl.to(K, { opacity: 0, duration: .15 }, HEADT - .6);
    R.tl.set(K, { innerHTML: orig, color: col }, HEADT - .45); R.tl.to(K, { opacity: 1, duration: .15 }, HEADT - .4); }; } }
{ const K = document.querySelector("#skc"); if (K) { const [a, b] = K.children, orig = [a.textContent, b.textContent], bg = K.style.background, col = K.style.color;   // подпись судебного рисунка (ep57)
  a.textContent = "ТОЛЯН · 19:"; b.textContent = "ДЕШЕВЛЕ, ЧЕМ У СТУДЕНТА"; K.style.background = "#2f6db5"; K.style.color = "#fbfaf3";
  const B = window.build; window.build = R => { B(R); R.tl.to(K, { opacity: 0, duration: .15 }, HEADT - .6);
    R.tl.set(a, { textContent: orig[0] }, HEADT - .45).set(b, { textContent: orig[1] }, HEADT - .45).set(K, { background: bg, color: col }, HEADT - .45);
    R.tl.to(K, { opacity: 1, duration: .15 }, HEADT - .4); }; } }
{ const L = document.querySelector("#lbx"); if (L) { const B = window.build; window.build = R => { B(R);   // до склейки с основным видео (HEAD) рамка возвращается к исходной
  const bars = [L.querySelector(".lbt"), L.querySelector(".lbb")], col = ["#fff", "#ffd23f"];
  R.tl.to(bars, { opacity: 0, duration: .15 }, HEADT - .6);
  bars.forEach((el, i) => R.tl.set(el, { textContent: ORIG[i], background: "#000", color: col[i] }, HEADT - .45));
  R.tl.to(bars, { opacity: 1, duration: .15 }, HEADT - .4); }; } }
