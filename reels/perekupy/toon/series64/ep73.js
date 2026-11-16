// «КУЛИНАРНОЕ ШОУ: БЛЮДО ОТ ЖОРЫ» (ep73, киношный формат ../cine.js, отдельный ролик, БЕЗ мата). Сцены — как в утверждённой раскадровке board.html.
// ОБЛОЖКА: Глеб с ботом (Mazda 6 −18%) + плашка → ТВ-кухня: «что в меню?» → ингредиенты → духовка 40:00 → студия: «беру!» → тест-драйв: бампер
// → дверь в руках: «это подача!» → бот: Мазда → Мазда на тарелке, «АПЛОДИСМЕНТЫ» → финал Лиса.
$("#title .a").textContent = E.rubric; $("#title .b").textContent = E.subtitle; $("#title .a").style.fontSize = "66px"; $("#tag span").textContent = "кулинарное шоу";
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
const Z = (p, x, foot, h, o = {}, pose = {}, extra = {}) => ch("perekup", spk(p, "zhora"), x, foot, h, { ...ZHORA, ...o }, pose, extra) + CHEFHAT(x, foot, h, "", (extra.z || 7) + 1);
const M = (p, x, foot, h, pose = {}, extra = {}) => MGC(ch("vika", spk(p, "margo"), x, foot, h, null, pose, extra));
const G = (p, x, foot, h, o = {}, pose = {}, extra = {}) => ch("perekup", spk(p, "gleb"), x, foot, h, { ...GLEB, ...o }, pose, extra);
const grp = (id, html, z = "") => `<div class="grp" id="${id}" style="position:absolute;left:0;top:0;width:1080px;height:1920px${z !== "" ? `;z-index:${z}` : ""}">${html}</div>`;
const KS_L = glow(540, 300, 420, "#fff6d0", .35);
const KZ_L = glow(540, 120, 420, "#fff6d0", .3);
const TD_L = glow(540, 300, 420, "#ffffff", .2);

// 1. обложка: Глеб с ботом
{ const H = HOLDPHONE("perekup", spk("gp", "gleb"), 540, 2090, 1680, GLEB, MZCARD(), { rim: "#fff6d0", side: 1 });
  mount("s1", { bg: "kulinarshow", farBlur: 8, mid: H.mid, lights: H.lights + KS_L }, { x: 540, y: 960, s: 1 }); }
// 2. ТВ-кухня: «что в меню?»
mount("s2", { bg: "kulinarshow", mid: M("ma", 260, 1860, 860, { armR: -60 }, { rim: "#fff6d0", side: 1, z: 7 }) + Z("za", 790, 1860, 880, { look: "grin" }, { armL: 60 }, { rim: "#fff6d0", side: -1, z: 7 }), over: LOWER3("ШЕФ ЖОРА", "«Десятка по-перекупски»"), lights: KS_L,
  bubbles: [{ id: "m0", p: "ma", html: "Жора, что у нас<br><em>сегодня в меню?</em>", fs: 38 }, { id: "z0", p: "za", html: "Битая «десятка»<br><em>по-перекупски!</em>", fs: 40 }, { id: "m1", p: "ma", html: "А что<br><em>добавляем?</em>", fs: 42 }] }, { x: 540, y: 1150, s: 1.04 });
// 3. ингредиенты
mount("s3", { bg: "kulinarshow", farBlur: 2, mid: Z("zb", 540, 1880, 880, { look: "grin" }, { armR: -150 }, { rim: "#fff6d0", side: 1, z: 7 }) + INGRED(20, 1180, "ig1", "ШПАКЛЁВКА", "2 ведра", "#c8ccd0", -6) + INGRED(760, 1180, "ig2", "ПОЛИРОЛЬ", "щепотка", "#ffd23f", 5) + INGRED(390, 1430, "ig3", "ПРОБЕГ", "÷ 3", "#ff7a1a", -2, 9), lights: KS_L,
  bubbles: [{ id: "z1", p: "zb", html: "Два ведра шпаклёвки, полироль<br><em>и пробег — убавить в три раза!</em>", fs: 38 }] }, { x: 540, y: 1150, s: 1.04 });
// 4. духовка: 40 минут под феном
mount("s4", { bg: "kulinarshow", farBlur: 4, mid: OVEN(160, 900) + M("mb", 880, 1900, 820, { armL: 40 }, { rim: "#ffb04a", side: -1, z: 22 }), lights: KS_L + glow(540, 1250, 360, "#ff9a4a", .4),
  bubbles: [{ id: "m2", p: "mb", html: "Выглядит аппетитно!<br><em>Кто попробует?</em>", fs: 42 }] }, { x: 540, y: 1150, s: 1.04 });
// 5. студия: Глеб — «беру!»
mount("s5", { bg: "kulinarzal", mid: grp("gw", G("ga", 280, 1880, 860, {}, { armR: -150 }, { rim: "#fff6d0", side: 1, z: 7 })) + Z("zc", 800, 1880, 860, { look: "grin" }, { armL: 60 }, { rim: "#fff6d0", side: -1, z: 7 }), lights: KZ_L,
  bubbles: [{ id: "g0", p: "ga", html: "Беру! А можно<br><em>тест-драйв?</em>", fs: 40 }, { id: "z2", p: "zc", html: "Только аккуратно —<br><em>оно ещё горячее.</em>", fs: 38 }] }, { x: 540, y: 1150, s: 1.04 });
// 6. тест-драйв: отваливается бампер
mount("s6", { bg: "testdraiv", mid: grp("c6", car(V10, 180, 1640, 760, { z: 5, sheen: .4 }) + BUMPER(820, 1560), 5), lights: TD_L }, { x: 540, y: 1150, s: 1.04 });
// 7. дверь в руках
mount("s7", { bg: "testdraiv", farBlur: 2, mid: G("gb", 300, 1880, 880, { look: "o" }, { armL: -40, armR: -40 }, { rim: "#ffffff", side: 1, z: 7 }) + DOORP(150, 1400) + Z("zd", 820, 1880, 860, { look: "grin" }, { armL: 60 }, { rim: "#ffffff", side: -1, z: 7 }), lights: TD_L,
  bubbles: [{ id: "g1", p: "gb", html: "Жора! У меня<br><em>дверь в руках!</em>", fs: 40 }, { id: "z3", p: "zd", html: "Это подача!<br><em>Ресторанная!</em>", fs: 42 }] }, { x: 540, y: 1150, s: 1.04 });
// 8. бот: Мазда
{ const H = HOLDPHONE("perekup", spk("gd", "gleb"), 540, 2000, 1400, GLEB, MZCARD("mcc2"), { rim: "#ffffff", side: 1 });
  mount("s8", { bg: "testdraiv", farBlur: 5, mid: H.mid, lights: H.lights + TD_L,
    bubbles: [{ id: "g2", p: "gd", html: "Взял Мазду: один хозяин, ниже рынка.<br><em>Без шпаклёвки и без фена.</em>", fs: 34 }] }, { x: 540, y: 1000, s: 1.02 }); }
// 9. Мазда на тарелке, «АПЛОДИСМЕНТЫ»
mount("s9", { bg: "kulinarzal", mid: PLATE(1540) + car(MZ6, 190, 1650, 700, { z: 5, sheen: .5 }) + M("mc", 120, 1900, 760, { armR: -150 }, { rim: "#fff6d0", side: 1, z: 7 }) + G("gc", 980, 1900, 740, { look: "grin" }, { armL: -150 }, { rim: "#fff6d0", side: -1, z: 7 }), over: APPL().replace("top:180px", "top:360px"), lights: KZ_L,
  bubbles: [{ id: "m3", p: "mc", html: "Вот это —<br><em>блюдо от шефа!</em>", fs: 44 }] }, { x: 540, y: 1150, s: 1.04 });
// 10. карточка бота
mount("s10", { bg: "kulinarshow", over: CTA73.replace('<div style="position:absolute;', '<div id="cta" style="opacity:0;position:absolute;'), lights: KS_L }, { x: 540, y: 1000, s: .98 });

$("#end h2").innerHTML = E.end;

window.build = R => {
  const tl = R.tl;
  const { pop } = common(R, { shake: 0 });
  for (const el of Object.values(SC)) {
    el.sheens = [...el.querySelectorAll(".sheen")];
    el.glows = [...el.querySelectorAll(".lights .glow")].map(g => ({ g, o: +g.style.opacity }));
  }
  const talk = (lv, f) => lv > .28 && !(lv < .55 && f % 3 === 2);
  const MOOD = { gb: "o", gp: "grin" };
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
    // дверь дрожит в руках у Глеба
    const dr = document.getElementById("dr"); if (dr) dr.style.transform = `rotate(${(-8 + Math.sin(t * 14) * 3).toFixed(2)}deg)`;
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
  const popIn = (sel, at) => { tl.fromTo(sel, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: .3, ease: "back.out(2.2)", immediateRender: true }, at); R.sfx("ping", at, .5); };

  // 1. обложка: плашка видна с первого кадра и гаснет к 1,6 с; карточка бота — с кадра 0
  gsap.set(SC.s1, { opacity: 1 }); SC.s1.style.display = "";
  gsap.set("#cnt", { opacity: 0 });
  tl.set(SC.s1, { opacity: 1 }, 0); tl.to("#title", { opacity: 0, y: -50, duration: .25 }, 1.6);
  move("s1", { s: 1.06, y: 1000 }, 0, en.l0 + .3, "none");
  tl.fromTo("#mcc", { scale: 1 }, { scale: 1.06, duration: .15, yoyo: true, repeat: 1, ease: "power2.out", immediateRender: false }, 1.9); R.sfx("ping", 1.9, .6);
  // 2. кухня: плашка эфира выезжает
  const SW2 = Math.max(2.4, Wd("l0", "сегод", .5) - .3); swap("s1", "s2", SW2); move("s2", { s: 1.1 }, SW2, en.m1 - SW2 + .3, "none");
  tl.fromTo("#l3", { x: -1100 }, { x: 0, duration: .45, ease: "power3.out", immediateRender: true }, SW2 + .4);
  bub("m0", st.z0 - .1); bub("z0", st.m1 - .1); bub("m1", st.z1 - .2);
  // 3. ингредиенты под слова
  cut("s2", "s3", st.z1 - .2); move("s3", { s: 1.08 }, st.z1 - .2, en.z1 - st.z1 + .4, "none"); bub("z1", st.l1 - .2);
  [["#ig1", "шпак", .2], ["#ig2", "полир", .45], ["#ig3", "проб", .7]].forEach(([s, w, fr]) => popIn(s, Wd("z1", w, fr) - .05));
  // 4. духовка: таймер 40:00 → 00:00, жар
  const SW4 = st.l1 - .3; swap("s3", "s4", SW4); move("s4", { s: 1.08 }, SW4, en.m2 - SW4 + .4, "none"); bub("m2", st.l2 - .2);
  const OV = { m: 40 }; tl.to(OV, { m: 0, duration: en.l1 - st.l1 + .6, ease: "power1.in", onUpdate: () => { const e = document.getElementById("ovt"); if (e) e.textContent = String(Math.ceil(OV.m)).padStart(2, "0") + ":00"; } }, st.l1);
  tl.fromTo("#ovc", { y: 0 }, { y: -6, duration: .2, yoyo: true, repeat: Math.round((en.l1 - st.l1) / .2), ease: "sine.inOut", immediateRender: false }, st.l1);
  R.sfx("bleep", en.l1 + .5, .4);
  // 5. студия: Глеб выходит
  const SW5 = st.l2 - .3; swap("s4", "s5", SW5); move("s5", { s: 1.08 }, SW5, en.z2 - SW5 + .4, "none");
  tl.fromTo("#gw", { x: -600 }, { x: 0, duration: 1.0, ease: "power2.out", immediateRender: true }, st.l2 + .2);
  bub("g0", st.z2 - .1); bub("z2", st.l3 - .2);
  // 6. тест-драйв: подпрыгнула на лежачем — бампер отвалился
  const SW6 = st.l3 - .3; swap("s5", "s6", SW6); move("s6", { s: 1.08 }, SW6, en.l3 - SW6 + .6, "none");
  const BR = Wd("l3", "развал", .7);
  tl.fromTo("#c6", { x: -700 }, { x: 0, duration: BR - SW6, ease: "power1.out", immediateRender: true }, SW6)
    .to("#c6", { y: -40, duration: .12, yoyo: true, repeat: 1, ease: "power2.out" }, BR - .05)
    .fromTo("#bp", { y: 0, rotation: 0 }, { y: 110, rotation: 25, duration: .45, ease: "bounce.out", immediateRender: false }, BR + .1);
  R.sfx("clack", BR + .1, .9);
  // 7. дверь в руках: «это подача!»
  cut("s6", "s7", st.g1 - .2); move("s7", { s: 1.1 }, st.g1 - .2, en.z3 - st.g1 + .4, "none"); bub("g1", st.z3 - .1); bub("z3", st.l4 - .2);
  // 8. бот: Мазда
  const SW8 = st.l4 - .25; swap("s7", "s8", SW8); move("s8", { s: 1.08 }, SW8, en.g2 - SW8 + .4, "none");
  tl.fromTo("#mcc2", { scale: 1 }, { scale: 1.07, duration: .15, yoyo: true, repeat: 1, ease: "power2.out", immediateRender: false }, Wd("g2", "мазд", .1)); R.sfx("ping", Wd("g2", "мазд", .1), .8);
  bub("g2", st.m3 - .2);
  // 9–10. Мазда на тарелке, табло загорается → финальная фраза Лиса → карточка
  const SW9 = st.m3 - .35, SW10 = Math.min(st.l5 + 2.2, en.l5 - 2.5);
  swap("s8", "s9", SW9); move("s9", { s: 1.08 }, SW9, SW10 - SW9 + .5, "none"); bub("m3", st.l5 + .3);
  tl.fromTo("#ap", { opacity: 0 }, { opacity: 1, duration: .1, yoyo: true, repeat: 7, ease: "none", immediateRender: true }, st.m3 + .2).set("#ap", { opacity: 1 }, st.m3 + 1.1);
  swap("s9", "s10", SW10); tl.to("#tag", { opacity: 0, duration: .2 }, SW10);
  tl.fromTo("#cta", { opacity: 0, y: 80, scale: .9 }, { opacity: 1, y: 0, scale: 1, duration: .4, ease: "back.out(1.6)", immediateRender: false }, SW10 + .6);
  ending(R, en.l5 + .3);
};
