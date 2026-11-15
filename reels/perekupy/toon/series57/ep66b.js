// «МУЗЕЙ: ПЕРЕКУП ОБЫКНОВЕННЫЙ» (ep66, киношный формат ../cine.js, отдельный ролик). Сцены — как в утверждённой раскадровке board.html.
// ОБЛОЖКА (кадр 0, правило владельца 15.11): школьник Тимур с телефоном (бот: Vesta EV 2037 −17%) + плашка «МУЗЕЙ: / ПЕРЕКУП ОБЫКНОВЕННЫЙ»
// → вход в музей → витрина (газета, пейджер, телефон) → «а зачем?» → ВАЗ-2105 «пробег скручивали 4 раза» → диорама: восковой Жора
// → «он моргнул!» → «пацан, а что за бот?» → Тимур показывает бота → Жора через канат → сигнализация → «надо было бота поставить» → финал Лиса.
$("#title .a").textContent = E.rubric; $("#title .b").textContent = E.subtitle; $("#title .b").style.fontSize = "88px"; $("#tag span").textContent = "музей";
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
const ZW = (p, x, foot, h, o = {}, pose = {}, extra = {}) => Z(p, x, foot, h, o, pose, { ...extra, style: WAX });
const K1 = (p, x, foot, h, o = {}, pose = {}, extra = {}) => ch("perekup", spk(p, "timur"), x, foot, h, { ...KID, ...o }, pose, extra);
const K2 = (p, x, foot, h, o = {}, pose = {}, extra = {}) => ch("perekup", spk(p, "petya"), x, foot, h, { ...KID2, ...o }, pose, extra);
const GD = (p, x, foot, h, pose = {}, extra = {}) => GRC(ch("vika", spk(p, "guide"), x, foot, h, null, pose, extra));
const MZ_L = glow(180, 300, 260, "#fff6d0", .35) + glow(540, 300, 300, "#fff6d0", .4) + glow(900, 300, 260, "#fff6d0", .35);
const DI_L = glow(150, 690, 200, "#ffd27a", .5) + glow(930, 690, 200, "#ffd27a", .5);
const MV_L = glow(540, 200, 380, "#fff6d0", .3);

// 1. обложка: Тимур с ботом
{ const H = HOLDPHONE("perekup", spk("kp", "timur"), 540, 2090, 1680, KID, KDCARD(), { rim: "#fff6d0", side: 1 });
  mount("s1", { bg: "muzeyzal", farBlur: 8, mid: H.mid, lights: H.lights + MZ_L }, { x: 540, y: 960, s: 1 }); }
// 2. вход в музей
mount("s2", { bg: "muzeyvhod", grade: "day", mid: GD("ga", 260, 1760, 820, { armR: -100 }, { rim: "#fff6d0", side: 1, z: 7 }) + K1("ka", 620, 1820, 600, {}, {}, { z: 7 }) + K2("kb", 800, 1830, 580, {}, {}, { z: 7 })
  + ch("perekup", "kc", 960, 1840, 560, { jacket: "#7a3aa8", pants: "#2b2f37", hair: "#8a5a33", look: "grin" }, {}, { z: 7 }), lights: MV_L,
  bubbles: [{ id: "g1", p: "ga", html: "Дети, сегодня зал<br><em>«Как покупали машины раньше».</em>", fs: 40 }, { id: "p0", p: "kb", html: "А там что —<br><em>газеты?!</em>", fs: 44 }] }, { x: 540, y: 1200, s: 1.05 });
// 3. витрина
mount("s3", { bg: "muzeyzal", farBlur: 2, mid: SHOWCASE(20, 980, 820) + PLAQUE(110, 1540, 640, "ПОИСК МАШИНЫ, 2005 г.", "газета · пейджер · проводной телефон") + GD("gb", 975, 1900, 780, { armL: 60 }, { rim: "#fff6d0", side: -1, z: 9 }),
  lights: MZ_L + glow(430, 1150, 360, "#fff6d0", .45), bubbles: [{ id: "g2", p: "gb", html: "Машины искали в газете<br><em>и звонили по проводному телефону.</em>", fs: 38 }] }, { x: 540, y: 1200, s: 1.05 });
// 4. Тимур: «а зачем?»
mount("s4", { bg: "muzeyzal", farBlur: 6, mid: K1("kd", 540, 1900, 1000, {}, { armL: 40 }, { rim: "#fff6d0", side: 1, z: 7 }), lights: MZ_L,
  bubbles: [{ id: "t1", p: "kd", html: "А зачем так сложно?<br><em>Бот присылает за секунду!</em>", fs: 44 }] }, { x: 540, y: 1150, s: 1.08 });
// 5. ВАЗ-2105 на подиуме
mount("s5", { bg: "muzeyzal", farBlur: 2, mid: car(V05, 140, 1600, 800, { z: 4, sheen: .5 }) + `<div style="position:absolute;left:100px;top:1590px;width:880px;height:90px;z-index:3;background:#2b2f37;border:7px solid #151515;border-radius:12px"></div>`
  + PLAQUE(220, 1720, 640, "МАШИНА ПЕРЕКУПА · ВАЗ-2105", "пробег скручивали 4 раза", "pl5") + ROPE(110, 970, 1560) + GD("gc", 900, 1880, 760, { armR: -100 }, { rim: "#fff6d0", side: -1, z: 11 })
  + K1("ke5", 180, 1900, 640, {}, {}, { z: 12 }), lights: MZ_L,
  bubbles: [{ id: "g3", p: "gc", html: "А это — машина перекупа.<br><em>Пробег скручивали четыре раза.</em>", fs: 38 }, { id: "t3", p: "ke5", html: "Четыре раза?!<br><em>Это же нечестно!</em>", fs: 42 }] }, { x: 540, y: 1250, s: 1.04 });
// 6. диорама: восковой Жора
mount("s6", { bg: "diorama", farBlur: 1, mid: ZW("zw", 540, 1700, 900, { look: "flat" }, { armL: 30, armR: -40 }, { z: 7 }) + ROPE(140, 940, 1700) + PLAQUE(190, 1800, 700, "ПЕРЕКУП ОБЫКНОВЕННЫЙ", "вставал в 5 утра · торговался до хрипоты"), lights: DI_L }, { x: 540, y: 1200, s: 1.04 });
// 7. «он моргнул!»
mount("s7", { bg: "diorama", farBlur: 2, mid: ZW("zx", 640, 1800, 1000, { look: "flat" }, {}, { z: 6 }) + BLINK(640, 1800, 1000, "bl1") + K2("ke", 230, 1960, 760, {}, { armR: -110 }, { rim: "#ffd27a", side: 1, z: 9 }), lights: DI_L,
  bubbles: [{ id: "p1", p: "ke", html: "Он<br><em>моргнул!</em>", fs: 56 }] }, { x: 540, y: 1150, s: 1.06 });
// 8. «пацан, а что за бот?» — воск уходит
mount("s8", { bg: "diorama", farBlur: 4, mid: ZW("zy", 540, 1900, 1000, { look: "o" }, { armR: -70 }, { z: 7 }), lights: DI_L,
  bubbles: [{ id: "z1", p: "zy", html: "Пацан…<br><em>а что за бот?</em>", fs: 54 }] }, { x: 540, y: 1150, s: 1.1 });
// 9. Тимур показывает бота
{ const H = HOLDPHONE("perekup", spk("kf", "timur"), 380, 1960, 1250, KID, KDCARD().replace('id="kcc"', 'id="kcc2"'), { rim: "#ffd27a", side: 1 });
  mount("s9", { bg: "diorama", farBlur: 5, mid: H.mid + Z("zz", 860, 1800, 900, { look: "o" }, { armR: -100 }, { z: 5 }) + ROPE(640, 1080, 1560, 6), lights: H.lights + DI_L,
    bubbles: [{ id: "t2", p: "kf", html: "Вот — Веста ниже рынка.<br><em>Через секунду пришла.</em>", fs: 42 }] }, { x: 560, y: 1080, s: 1.05 }); }
// 10. сигнализация
mount("s10", { bg: "muzeyzal", farBlur: 3, mid: GD("gg", 300, 1820, 860, { armR: -150 }, { rim: "#ff3b30", side: 1, z: 7 }) + Z("zg", 800, 1820, 880, { look: "o" }, { armL: 60 }, { rim: "#ff3b30", side: -1, z: 7 }) + ROPE(560, 1060, 1500, 9),
  over: ALARM(475, 330, "al"), lights: MZ_L, bubbles: [{ id: "g4", p: "gg", html: "Экспонаты<br><em>руками не трогать!</em>", fs: 48 }] }, { x: 540, y: 1180, s: 1.05 });
// 11. «надо было бота поставить» → «Жора, на место!»
mount("s11", { bg: "muzeyzal", farBlur: 4, mid: Z("zh", 540, 1900, 1000, { look: "o" }, { armL: 40 }, { rim: "#ff3b30", side: 1, z: 7 }), over: ALARM(800, 330, "al2"), lights: MZ_L,
  bubbles: [{ id: "z2", p: "zh", html: "Тридцать лет простоял…<br><em>надо было бота поставить.</em>", fs: 42 }] }, { x: 540, y: 1150, s: 1.08 });
mount("s11b", { bg: "muzeyzal", farBlur: 3, mid: GD("gh", 300, 1820, 860, { armR: -60 }, { rim: "#fff6d0", side: 1, z: 7 }) + ZW("zj", 800, 1820, 880, { look: "flat" }, {}, { z: 7 }) + ROPE(560, 1060, 1500, 9), lights: MZ_L,
  bubbles: [{ id: "g5", p: "gh", html: "Жора, на место!<br><em>Экскурсия не закончена!</em>", fs: 44 }] }, { x: 540, y: 1180, s: 1.05 });
// 12. карточка бота
mount("s12", { bg: "muzeyzal", over: CTA66.replace('<div style="position:absolute;', '<div id="cta" style="opacity:0;position:absolute;'), lights: MZ_L }, { x: 540, y: 1000, s: .98 });

$("#end h2").innerHTML = E.end;

window.build = R => {
  const tl = R.tl;
  const { pop } = common(R, { shake: 0 });
  for (const el of Object.values(SC)) {
    el.sheens = [...el.querySelectorAll(".sheen")];
    el.glows = [...el.querySelectorAll(".lights .glow")].map(g => ({ g, o: +g.style.opacity }));
  }
  const talk = (lv, f) => lv > .28 && !(lv < .55 && f % 3 === 2);
  const MOOD = { zw: "flat", zx: "flat", zj: "flat", zz: "o", zg: "o", zh: "o", kb: "o", ke: "o" };
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
  const alarm = (beacon, at, d) => { tl.fromTo(beacon, { rotation: -12 }, { rotation: 12, duration: .12, yoyo: true, repeat: Math.round(d / .12), ease: "none", immediateRender: false, transformOrigin: "50% 90%" }, at);
    tl.fromTo(beacon + "f", { opacity: 0 }, { opacity: 1, duration: .25, yoyo: true, repeat: Math.round(d / .25), ease: "none", immediateRender: false }, at); };

  // 1. обложка: плашка видна с первого кадра и гаснет к 1,6 с; карточка бота — с кадра 0
  gsap.set(SC.s1, { opacity: 1 }); SC.s1.style.display = "";
  gsap.set("#cnt", { opacity: 0 });
  show("s1", 0); tl.to("#title", { opacity: 0, y: -50, duration: .25 }, 1.6);
  move("s1", { s: 1.06, y: 1000 }, 0, en.l0 + .4, "none");
  tl.fromTo("#kcc", { scale: 1 }, { scale: 1.06, duration: .15, yoyo: true, repeat: 1, ease: "power2.out", immediateRender: false }, 2.2); R.sfx("ping", 2.2, .6);
  // 2. вход
  const SW2 = st.g1 - .4; swap("s1", "s2", SW2); move("s2", { s: 1.12 }, SW2, en.p0 - SW2 + .3, "none"); bub("g1", st.p0 - .1); bub("p0", st.g2 - .2);
  // 3. витрина: прожектор скользит по экспонатам
  const SW3 = st.g2 - .3; swap("s2", "s3", SW3); move("s3", { s: 1.12, x: 470 }, SW3, en.g2 - SW3 + .4, "none"); bub("g2", st.t1 - .2);
  tl.fromTo("#sc", { filter: "brightness(.8)" }, { filter: "brightness(1.12)", duration: .6, yoyo: true, repeat: 3, ease: "sine.inOut", immediateRender: false }, SW3 + .3);
  // 4. «а зачем?»
  cut("s3", "s4", st.t1 - .2); move("s4", { s: 1.16 }, st.t1 - .2, en.t1 - st.t1 + .4, "none"); bub("t1", st.g3 - .2);
  // 5. ВАЗ-2105 → «нечестно!»
  const SW5 = st.g3 - .3; swap("s4", "s5", SW5); move("s5", { s: 1.1 }, SW5, en.t3 - SW5 + .4, "none"); bub("g3", st.t3 - .1); bub("t3", st.l2 - .2);
  tl.fromTo("#pl5", { scale: 1 }, { scale: 1.08, duration: .2, yoyo: true, repeat: 1, ease: "power2.out", immediateRender: false }, W("g3", "проб")); R.sfx("clack", W("g3", "проб"), .5);
  // 6. диорама: медленный наезд на воскового Жору
  const SW6 = st.l2 - .2; swap("s5", "s6", SW6); move("s6", { s: 1.3, y: 1080 }, SW6, en.l2 - SW6 + .5, "power1.inOut");
  // 7. «он моргнул!»: веки — щелчок
  cut("s6", "s7", st.p1 - .5); move("s7", { s: 1.12 }, st.p1 - .5, en.l3 - st.p1 + .8, "none");
  const BL = st.p1 - .3; gsap.set("#bl1", { opacity: 0 });
  tl.set("#bl1", { opacity: 1 }, BL).set("#bl1", { opacity: 0 }, BL + .14).set("#bl1", { opacity: 1 }, W("l3", "жора")).set("#bl1", { opacity: 0 }, W("l3", "жора") + .14);
  R.sfx("tap", BL, .7); bub("p1", st.l3 + .4);
  // 8. «пацан, а что за бот?» — воск уходит
  cut("s7", "s8", st.z1 - .2); move("s8", { s: 1.18 }, st.z1 - .2, en.z1 - st.z1 + .4, "none"); bub("z1", st.t2 - .2);
  tl.to('[data-p="zy"]', { filter: "sepia(0) saturate(1) brightness(1) contrast(1)", duration: 1.6, ease: "power1.out" }, st.z1);
  // 9. Тимур показывает бота; Жора тянется через канат
  const SW9 = st.t2 - .2; swap("s8", "s9", SW9); move("s9", { s: 1.12 }, SW9, en.l4 - SW9 + .4, "none");
  tl.fromTo("#kcc2", { scale: 1 }, { scale: 1.07, duration: .15, yoyo: true, repeat: 1, ease: "power2.out", immediateRender: false }, W("t2", "вес")); R.sfx("ping", W("t2", "вес"), .8);
  bub("t2", st.l4 + .3); tl.to('[data-p="zz"]', { x: -120, duration: .8, ease: "power2.inOut" }, st.l4);
  // 10. сигнализация
  cut("s9", "s10", st.g4 - .3); move("s10", { s: 1.1 }, st.g4 - .3, en.g4 - st.g4 + .5, "none"); bub("g4", st.z2 - .2);
  alarm("#al", st.g4 - .3, en.z2 - st.g4 + .5); for (let k = 0; k < 6; k++) R.sfx("bleep", st.g4 - .3 + k * .5, .08);
  // 11. «надо было бота поставить» → «Жора, на место!»
  cut("s10", "s11", st.z2 - .2); move("s11", { s: 1.16 }, st.z2 - .2, en.z2 - st.z2 + .4, "none"); bub("z2", st.g5 - .2); alarm("#al2", st.z2 - .2, en.z2 - st.z2 + .2);
  cut("s11", "s11b", st.g5 - .2); move("s11b", { s: 1.1 }, st.g5 - .2, en.g5 - st.g5 + .4, "none"); bub("g5", st.l5 - .2);
  // 12. финальная фраза Лиса про бот → карточка
  const SW12 = st.l5 - .2; swap("s11b", "s12", SW12); tl.to("#tag", { opacity: 0, duration: .2 }, SW12);
  tl.fromTo("#cta", { opacity: 0, y: 80, scale: .9 }, { opacity: 1, y: 0, scale: 1, duration: .4, ease: "back.out(1.6)", immediateRender: false }, SW12 + .6);
  ending(R, en.l5 + .3);
};

// ── ep66b «Архив»: быстрая уникализация — меняется только заставка ──
$("#title .a").textContent = "МУЗЕЙ:"; $("#title .a").style.cssText = "font-size:110px;background:#2f6db5;color:#fbfaf3";
$("#title .b").textContent = "ОН МОРГНУЛ!"; $("#title .b").style.cssText = "font-size:60px;background:#fbfaf3;color:#2f6db5";
const ORIG = [...document.querySelectorAll("#lbx .lbt, #lbx .lbb")].map(e => e.textContent), HEADT = 2.4;
{ const L = document.querySelector("#lbx"); if (L) { const a = L.querySelector(".lbt"), b = L.querySelector(".lbb");   // кинорамка вместо плашки (ep56)
  a.textContent = "МУЗЕЙ:"; b.textContent = "ОН МОРГНУЛ!"; a.style.background = b.style.background = "#2f6db5"; a.style.color = b.style.color = "#fbfaf3"; } }
{ const K = document.querySelector("#ballc"); if (K) { const orig = K.innerHTML, col = K.style.color;   // надпись над хрустальным шаром (ep58)
  K.innerHTML = "МУЗЕЙ:"; K.style.color = "#2f6db5";
  const B = window.build; window.build = R => { B(R); R.tl.to(K, { opacity: 0, duration: .15 }, HEADT - .6);
    R.tl.set(K, { innerHTML: orig, color: col }, HEADT - .45); R.tl.to(K, { opacity: 1, duration: .15 }, HEADT - .4); }; } }
{ const K = document.querySelector("#skc"); if (K) { const [a, b] = K.children, orig = [a.textContent, b.textContent], bg = K.style.background, col = K.style.color;   // подпись судебного рисунка (ep57)
  a.textContent = "МУЗЕЙ:"; b.textContent = "ОН МОРГНУЛ!"; K.style.background = "#2f6db5"; K.style.color = "#fbfaf3";
  const B = window.build; window.build = R => { B(R); R.tl.to(K, { opacity: 0, duration: .15 }, HEADT - .6);
    R.tl.set(a, { textContent: orig[0] }, HEADT - .45).set(b, { textContent: orig[1] }, HEADT - .45).set(K, { background: bg, color: col }, HEADT - .45);
    R.tl.to(K, { opacity: 1, duration: .15 }, HEADT - .4); }; } }
{ const L = document.querySelector("#lbx"); if (L) { const B = window.build; window.build = R => { B(R);   // до склейки с основным видео (HEAD) рамка возвращается к исходной
  const bars = [L.querySelector(".lbt"), L.querySelector(".lbb")], col = ["#fff", "#ffd23f"];
  R.tl.to(bars, { opacity: 0, duration: .15 }, HEADT - .6);
  bars.forEach((el, i) => R.tl.set(el, { textContent: ORIG[i], background: "#000", color: col[i] }, HEADT - .45));
  R.tl.to(bars, { opacity: 1, duration: .15 }, HEADT - .4); }; } }
