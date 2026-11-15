// «МАСТЕР ГАВРИЛЫЧ» (ep67, киношный формат ../cine.js, отдельный ролик). Сцены — как в утверждённой раскадровке board.html.
// Настоящий мат в озвучке (решение владельца 15.11), в облачках — со звёздочками. ОБЛОЖКА: Стас с ботом (Camry −13%) + плашка «МАСТЕР / ГАВРИЛЫЧ».
// ГСК «Мотор» → Гранта Жоры на яме → вид снизу: пена в порогах → толщиномер 900 → рассада Саныча вянет → мат-о-метр в красной → «п*здец на колёсах»
// → Стас на Камри из бота → 40 минут молча (часы) → «мне даже материться не на что» → «впервые за сорок лет!» → финал Лиса.
$("#title .a").textContent = E.rubric; $("#title .b").textContent = E.subtitle; $("#tag span").textContent = "гараж";
document.querySelector("#cam > svg#bg")?.remove();
const W = (line, pre, n = 0) => {
  const norm = s => s.toLowerCase().replace(/ё/g, "е").replace(/[^а-я0-9a-z]/g, "");
  const hits = (TT.words[line] || []).filter(w => w[1] >= st[line] - .7 && w[2] <= en[line] + .05 && norm(w[0]).startsWith(norm(pre)));
  if (!hits[n]) console.warn("W miss", line, pre);
  return hits[n] ? Math.max(hits[n][1], st[line] - .05) : st[line];
};
const root = $("#scene"), SC = {}, SPK = {};
const mount = (name, def, sh) => (SC[name] = C.mount(root, def, sh));
const spk = (p, v) => (SPK[p] = v, p);
const Z = (p, x, foot, h, o = {}, pose = {}, extra = {}) => ch("perekup", spk(p, "zhora"), x, foot, h, { ...ZHORA, ...o }, pose, extra);
const G = (p, x, foot, h, o = {}, pose = {}, extra = {}) => ch("perekup", spk(p, "gav"), x, foot, h, { ...GAV, ...o }, pose, extra);
const SN = (p, x, foot, h, o = {}, pose = {}, extra = {}) => ch("perekup", spk(p, "san"), x, foot, h, { ...SAN, ...o }, pose, extra);
const ST = (p, x, foot, h, o = {}, pose = {}, extra = {}) => ch("perekup", spk(p, "stas"), x, foot, h, { ...STAS, ...o }, pose, extra);
const grp = (id, html) => `<div class="grp" id="${id}" style="position:absolute;left:0;top:0;width:1080px;height:1920px">${html}</div>`;
const GV_L = glow(885, 404, 220, "#ffd27a", .5);
const BX_L = glow(540, 180, 380, "#fff6d0", .45);
const YM_L = glow(760, 720, 300, "#fff6d0", .35);

// 1. обложка: Стас с ботом
{ const H = HOLDPHONE("perekup", spk("sp", "stas"), 540, 2090, 1680, STAS, CAMCARD(), { rim: "#fff6d0", side: 1 });
  mount("s1", { bg: "yamaboks", farBlur: 8, mid: H.mid, lights: H.lights + BX_L }, { x: 540, y: 960, s: 1 }); }
// 2. въезд в ГСК: Гранта Жоры
mount("s2", { bg: "gskvorota", mid: grp("gr2", car(GRS, 330, 1560, 700, { z: 5, sheen: .4 })) + Z("za", 190, 1820, 820, { look: "grin" }, { armR: -100 }, { rim: "#ffd27a", side: 1, z: 7 }) + G("ga", 870, 1790, 800, {}, { armL: 20 }, { rim: "#ffd27a", side: -1, z: 7 }), lights: GV_L,
  bubbles: [{ id: "z0", p: "za", html: "Гаврилыч, глянь!<br><em>Взял за четыреста — подарок!</em>", fs: 38 }, { id: "v1", p: "ga", html: "Подарок, б**ть…<br><em>Ну, загоняй на яму.</em>", fs: 40 }] }, { x: 540, y: 1100, s: 1.04 });
// 3. бокс: Гранта на яме, Гаврилыч в яме, мат-о-метр
mount("s3", { bg: "yamaboks", mid: car(GRS, 380, 1500, 700, { z: 5, sheen: .4 }) + G("gb", 250, 2010, 960, {}, { armR: -60 }, { rim: "#fff6d0", side: 1, z: 7 }) + PITFRONT(1610), over: MATOMETR(740, 190, "mm1"), lights: BX_L }, { x: 540, y: 1200, s: 1.04 });
// 4. вид из ямы: пена в порогах
mount("s4", { bg: "podyamoy", mid: UNDER(true) + LAMP(760, 380) + G("gc", 420, 2080, 1180, { look: "o" }, { armR: -150 }, { rim: "#fff6d0", side: 1, z: 20 }), over: MATOMETR(740, 190, "mm2"), lights: YM_L,
  bubbles: [{ id: "v2", p: "gc", html: "Ё* твою мать…<br><em>У неё пороги из монтажной пены!</em>", fs: 40 }] }, { x: 540, y: 1100, s: 1.04 });
// 5. Жора: «краска родная!»
mount("s5", { bg: "yamaboks", farBlur: 6, mid: Z("zb", 540, 1900, 1000, { look: "o" }, { armL: 50 }, { rim: "#fff6d0", side: 1, z: 7 }), lights: BX_L,
  bubbles: [{ id: "z1", p: "zb", html: "Да ладно!<br><em>Продавец сказал — краска родная!</em>", fs: 42 }] }, { x: 540, y: 1150, s: 1.08 });
// 6. толщиномер
mount("s6", { bg: "yamaboks", farBlur: 3, mid: G("gd", 320, 1920, 1000, {}, { armR: -100 }, { rim: "#fff6d0", side: 1, z: 7 }) + GAUGE(680, 1000, "tq", "110", "ЗАВОД", "#4cd964"), over: MATOMETR(740, 190, "mm3"), lights: BX_L,
  bubbles: [{ id: "v3", p: "gd", html: "Родная? Девятьсот!<br><em>Шпаклёвки на палец, на**й!</em>", fs: 42 }] }, { x: 540, y: 1150, s: 1.04 });
// 7. Саныч: рассада вянет
mount("s7", { bg: "gskvorota", farBlur: 2, mid: SN("sa", 620, 1820, 880, {}, { armL: 60 }, { rim: "#ffd27a", side: -1, z: 7 }) + SEEDS(150, 1600), lights: GV_L,
  bubbles: [{ id: "s0", p: "sa", html: "Гаврилыч, потише!<br><em>У меня рассада вянет!</em>", fs: 44 }] }, { x: 540, y: 1100, s: 1.05 });
// 8. мат-о-метр крупно (Лис)
mount("s8", { bg: "yamaboks", farBlur: 10, mid: MATOMETR(240, 720, "mm6", 2), lights: BX_L + glow(540, 940, 420, "#ff3b30", .25) }, { x: 540, y: 960, s: 1 });
// 9. «п*здец на колёсах» + Жора
mount("s9", { bg: "yamaboks", farBlur: 3, mid: G("ge", 300, 1880, 920, {}, { armL: 40 }, { rim: "#ff3b30", side: 1, z: 7 }) + Z("zc", 800, 1880, 900, { look: "o" }, {}, { rim: "#fff6d0", side: -1, z: 7 }), over: MATOMETR(390, 160, "mm4"), lights: BX_L,
  bubbles: [{ id: "v4", p: "ge", html: "Одиннадцать косяков, Жора.<br><em>Это п*здец на колёсах.</em>", fs: 38 }, { id: "z2", p: "zc", html: "И что мне<br><em>теперь делать?..</em>", fs: 42 }] }, { x: 540, y: 1180, s: 1.04 });
// 10. Стас на Камри
mount("s10", { bg: "gskvorota", mid: grp("cm10", car(CAM, 40, 1600, 900, { z: 5, sheen: .5 })) + ST("sb", 900, 1850, 820, {}, { armL: 60 }, { rim: "#ffd27a", side: -1, z: 7 }) + Z("zd", 170, 1880, 760, { look: "o" }, {}, { z: 8 }), lights: GV_L,
  bubbles: [{ id: "t1", p: "sb", html: "Гаврилыч, глянь мою Камри.<br><em>Через бота взял — ниже рынка.</em>", fs: 38 }] }, { x: 540, y: 1100, s: 1.04 });
// 11. 40 минут молча: чистое днище, часы
mount("s11", { bg: "podyamoy", mid: UNDER(false, "un2") + LAMP(760, 380, "lp2") + CLOCK(40, 1120, "ck", 110) + G("gf", 560, 2080, 1180, { look: "flat" }, {}, { rim: "#fff6d0", side: 1, z: 20 }), over: MATOMETR(740, 190, "mm5"), lights: YM_L,
  bubbles: [{ id: "v5", p: "gf", html: "Стас…<br><em>мне даже материться не на что.</em>", fs: 44 }] }, { x: 540, y: 1100, s: 1.04 });
// 12. «впервые за сорок лет!» + Жора
mount("s12", { bg: "gskvorota", farBlur: 2, mid: SN("sc", 290, 1840, 860, { look: "o" }, { armR: -140 }, { rim: "#ffd27a", side: 1, z: 7 }) + SEEDS(40, 1640, "sd2", 9) + Z("ze", 830, 1840, 860, {}, { armL: 50 }, { rim: "#ffd27a", side: -1, z: 7 }), lights: GV_L,
  bubbles: [{ id: "s1", p: "sc", html: "Впервые<br><em>за сорок лет!</em>", fs: 44 }, { id: "z3", p: "ze", html: "Стас, скинь бота.<br><em>Срочно.</em>", fs: 42 }] }, { x: 540, y: 1100, s: 1.05 });
// 13. карточка бота
mount("s13", { bg: "yamaboks", over: CTA67.replace('<div style="position:absolute;', '<div id="cta" style="opacity:0;position:absolute;'), lights: BX_L }, { x: 540, y: 1000, s: .98 });

$("#end h2").innerHTML = E.end;

window.build = R => {
  const tl = R.tl;
  const { pop } = common(R, { shake: 0 });
  for (const el of Object.values(SC)) {
    el.sheens = [...el.querySelectorAll(".sheen")];
    el.glows = [...el.querySelectorAll(".lights .glow")].map(g => ({ g, o: +g.style.opacity }));
  }
  const talk = (lv, f) => lv > .28 && !(lv < .55 && f % 3 === 2);
  const MOOD = { gc: "o", zb: "o", zc: "o", zd: "o", sa: "o", sc: "o", gf: "flat" };
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
    for (const [p, v] of Object.entries(SPK)) {
      if (!document.getElementById(p)) continue;
      const lv = (LIP[v] || [])[f] || 0;
      mouth(p, talk(lv, f) ? "talk" : (MOOD[p] || "grin"));
    }
    // переноски качаются
    for (const id of ["lp", "lp2"]) { const e = document.getElementById(id); if (e) e.style.transform = `rotate(${(Math.sin(t * 1.6 + (id === "lp2" ? 1 : 0)) * 7).toFixed(2)}deg)`; }
  });
  window.MUSIC = { style: "bed", bpm: 90, end: R.dur - 1.2 };   // фоновой музыки нет (MUSIC_VOL=0)

  const cam = n => SC[n].cam;
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
  // стрелки мат-о-метров и часов: угол в объекте, атрибут transform — в хуке (GSAP путает origin у SVG-групп)
  const NA = Object.fromEntries(["mm1", "mm2", "mm3", "mm4", "mm5", "mm6"].map(id => [id, { a: -80, j: 0 }])), CKA = { m: 0, h: 60 };
  const needle = (id, deg, at, d = .5, ease = "back.out(2)") => tl.to(NA[id], { a: deg, duration: d, ease }, at);
  const jitter = (id, at, d) => tl.fromTo(NA[id], { j: -4 }, { j: 4, duration: .05, yoyo: true, repeat: Math.round(d / .05), ease: "none", immediateRender: false }, at).set(NA[id], { j: 0 }, at + d + .06);
  R.hooks.push(() => {
    for (const [id, v] of Object.entries(NA)) document.getElementById(id + "n")?.setAttribute("transform", `rotate(${(v.a + v.j).toFixed(2)} 150 160)`);
    document.getElementById("ckm")?.setAttribute("transform", `rotate(${CKA.m.toFixed(1)} 120 120)`);
    document.getElementById("ckh")?.setAttribute("transform", `rotate(${CKA.h.toFixed(1)} 120 120)`);
  });

  // 1. обложка: плашка видна с первого кадра и гаснет к 1,6 с; карточка бота — с кадра 0
  gsap.set(SC.s1, { opacity: 1 }); SC.s1.style.display = "";
  gsap.set("#cnt", { opacity: 0 });
  tl.set(SC.s1, { opacity: 1 }, 0); tl.to("#title", { opacity: 0, y: -50, duration: .25 }, 1.6);
  move("s1", { s: 1.06, y: 1000 }, 0, 3, "none");
  tl.fromTo("#kcc", { scale: 1 }, { scale: 1.06, duration: .15, yoyo: true, repeat: 1, ease: "power2.out", immediateRender: false }, 1.9); R.sfx("ping", 1.9, .6);
  // 2. въезд в ГСК: Гранта заезжает
  const SW2 = Math.max(2.4, W("l0", "жора") - .3); swap("s1", "s2", SW2); move("s2", { s: 1.1 }, SW2, en.v1 - SW2 + .3, "none");
  tl.fromTo("#gr2", { x: -900 }, { x: 0, duration: 1.4, ease: "power3.out", immediateRender: false }, SW2 + .1); R.sfx("whoosh", SW2 + .2, .4);
  bub("z0", st.v1 - .1); bub("v1", st.l1 - .2);
  // 3. бокс, Гаврилыч в яме
  const SW3 = st.l1 - .3; swap("s2", "s3", SW3); move("s3", { s: 1.12, x: 470 }, SW3, en.l1 - SW3 + .4, "none");
  // 4. вид из ямы: пена, мат-о-метр в жёлтую
  cut("s3", "s4", st.v2 - .25); move("s4", { s: 1.12, y: 1000 }, st.v2 - .25, en.v2 - st.v2 + .6, "none");
  needle("mm2", 25, W("v2", "еб")); R.sfx("clack", W("v2", "еб"), .5); bub("v2", st.z1 - .2);
  tl.fromTo("#unp", { y: -10 }, { y: 10, duration: .5, yoyo: true, repeat: 5, ease: "sine.inOut", immediateRender: false }, st.v2);
  // 5. Жора: «краска родная!»
  cut("s4", "s5", st.z1 - .2); move("s5", { s: 1.16 }, st.z1 - .2, en.z1 - st.z1 + .4, "none"); bub("z1", st.v3 - .2);
  // 6. толщиномер: 110 → 340 → 900, «ЗАВОД» → «ШПАКЛЁВКА»
  const SW6 = st.v3 - .3; swap("s5", "s6", SW6); move("s6", { s: 1.1 }, SW6, en.v3 - SW6 + .4, "none"); bub("v3", st.s0 - .2);
  const TQ = W("v3", "толщ"), T9 = Math.max(W("v3", "девят"), W("v3", "900"));
  tl.set("#tqv", { textContent: "340" }, TQ + .3).set("#tqv", { textContent: "620" }, (TQ + T9) / 2).set("#tqv", { textContent: "900" }, T9)
    .set("#tqs", { textContent: "ШПАКЛЁВКА", background: "#ff3b30", color: "#fff" }, T9);
  tl.fromTo("#tq", { scale: 1 }, { scale: 1.08, duration: .15, yoyo: true, repeat: 1, ease: "power2.out", immediateRender: false }, T9); R.sfx("bleep", T9, .15);
  needle("mm3", 25, SW6, .01, "none"); needle("mm3", 60, W("v3", "нах")); jitter("mm3", W("v3", "нах"), .8);
  // 7. Саныч: рассада вянет
  cut("s6", "s7", st.s0 - .2); move("s7", { s: 1.12 }, st.s0 - .2, en.s0 - st.s0 + .4, "none"); bub("s0", st.l2 - .2);
  tl.to("#sd path[stroke='#3f8a3a']", { rotation: 55, transformOrigin: "50% 100%", duration: 1.2, ease: "power2.in" }, st.s0 + .3)
    .to("#sd ellipse", { y: 50, fill: "#b8a04a", duration: 1.2, ease: "power2.in" }, st.s0 + .3);
  // 8. мат-о-метр крупно: стрелка в красную, дрожь
  cut("s7", "s8", st.l2 - .2); move("s8", { s: 1.08 }, st.l2 - .2, en.l2 - st.l2 + .5, "none");
  needle("mm6", 30, st.l2 - .2, .01, "none"); needle("mm6", 88, W("l2", "красн"), .45); jitter("mm6", W("l2", "красн"), 1.2);
  tl.fromTo(SC.s8, { x: -8 }, { x: 8, duration: .05, yoyo: true, repeat: 12, ease: "none", immediateRender: false }, W("l2", "красн")); R.sfx("bleep", W("l2", "красн"), .2);
  // 9. «п*здец на колёсах» → «и что мне делать?»
  cut("s8", "s9", st.v4 - .2); move("s9", { s: 1.1 }, st.v4 - .2, en.z2 - st.v4 + .4, "none");
  needle("mm4", 88, st.v4 - .2, .01, "none"); jitter("mm4", st.v4, en.v4 - st.v4); bub("v4", st.z2 - .1); bub("z2", st.l3 - .2);
  // 10. Стас на Камри
  const SW10 = st.l3 - .2; swap("s9", "s10", SW10); move("s10", { s: 1.1 }, SW10, en.t1 - SW10 + .4, "none");
  tl.fromTo("#cm10", { x: -1100 }, { x: 0, duration: 1.5, ease: "power3.out", immediateRender: false }, SW10 + .1); R.sfx("whoosh", SW10 + .3, .4);
  bub("t1", st.l4 - .2);
  // 11. 40 минут молча: часы крутятся, стрелка мат-о-метра на нуле
  const SW11 = st.l4 - .2; swap("s10", "s11", SW11); move("s11", { s: 1.12 }, SW11, en.v5 - SW11 + .5, "none");
  needle("mm5", -86, SW11, .01, "none");
  tl.to(CKA, { m: 240, h: 80, duration: en.l4 - st.l4 + .6, ease: "power1.inOut" }, st.l4);
  for (let k = 0; k < 6; k++) R.sfx("tick", st.l4 + k * .35, .25);
  bub("v5", st.s1 - .2);
  // 12. «впервые за сорок лет!» → «скинь бота»
  const SW12 = st.s1 - .3; swap("s11", "s12", SW12); move("s12", { s: 1.1 }, SW12, en.z3 - SW12 + .4, "none"); bub("s1", st.z3 - .1); bub("z3", st.l5 - .2);
  // 13. финальная фраза Лиса про бот → карточка
  const SW13 = st.l5 - .2; swap("s12", "s13", SW13); tl.to("#tag", { opacity: 0, duration: .2 }, SW13);
  tl.fromTo("#cta", { opacity: 0, y: 80, scale: .9 }, { opacity: 1, y: 0, scale: 1, duration: .4, ease: "back.out(1.6)", immediateRender: false }, SW13 + .6);
  ending(R, en.l5 + .3);
};

// ── ep67c «Неон»: быстрая уникализация — меняется только заставка ──
$("#title .a").textContent = "ГАРАЖ:"; $("#title .a").style.cssText = "font-size:110px;background:#ffd23f;color:#151515";
$("#title .b").textContent = "БЕЗ ЦЕНЗУРЫ"; $("#title .b").style.cssText = "font-size:60px;background:#151515;color:#ffd23f";
const ORIG = [...document.querySelectorAll("#lbx .lbt, #lbx .lbb")].map(e => e.textContent), HEADT = 2.4;
{ const L = document.querySelector("#lbx"); if (L) { const a = L.querySelector(".lbt"), b = L.querySelector(".lbb");   // кинорамка вместо плашки (ep56)
  a.textContent = "ГАРАЖ:"; b.textContent = "БЕЗ ЦЕНЗУРЫ"; a.style.background = b.style.background = "#ffd23f"; a.style.color = b.style.color = "#151515"; } }
{ const K = document.querySelector("#ballc"); if (K) { const orig = K.innerHTML, col = K.style.color;   // надпись над хрустальным шаром (ep58)
  K.innerHTML = "ГАРАЖ:"; K.style.color = "#ffd23f";
  const B = window.build; window.build = R => { B(R); R.tl.to(K, { opacity: 0, duration: .15 }, HEADT - .6);
    R.tl.set(K, { innerHTML: orig, color: col }, HEADT - .45); R.tl.to(K, { opacity: 1, duration: .15 }, HEADT - .4); }; } }
{ const K = document.querySelector("#skc"); if (K) { const [a, b] = K.children, orig = [a.textContent, b.textContent], bg = K.style.background, col = K.style.color;   // подпись судебного рисунка (ep57)
  a.textContent = "ГАРАЖ:"; b.textContent = "БЕЗ ЦЕНЗУРЫ"; K.style.background = "#ffd23f"; K.style.color = "#151515";
  const B = window.build; window.build = R => { B(R); R.tl.to(K, { opacity: 0, duration: .15 }, HEADT - .6);
    R.tl.set(a, { textContent: orig[0] }, HEADT - .45).set(b, { textContent: orig[1] }, HEADT - .45).set(K, { background: bg, color: col }, HEADT - .45);
    R.tl.to(K, { opacity: 1, duration: .15 }, HEADT - .4); }; } }
{ const L = document.querySelector("#lbx"); if (L) { const B = window.build; window.build = R => { B(R);   // до склейки с основным видео (HEAD) рамка возвращается к исходной
  const bars = [L.querySelector(".lbt"), L.querySelector(".lbb")], col = ["#fff", "#ffd23f"];
  R.tl.to(bars, { opacity: 0, duration: .15 }, HEADT - .6);
  bars.forEach((el, i) => R.tl.set(el, { textContent: ORIG[i], background: "#000", color: col[i] }, HEADT - .45));
  R.tl.to(bars, { opacity: 1, duration: .15 }, HEADT - .4); }; } }
