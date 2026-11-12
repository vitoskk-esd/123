// «ЖИЗНЬ ОДНОЙ ЭВО» (ep50, отдельная серия, киношный формат ../cine.js). Сцены — как в утверждённой раскадровке board.html.
// 17 лет одной Lancer Evolution IX: Токио 2007 → кран и автовоз, Владивосток 2013 → трек-дэй 2016 → сугроб 2019 → гараж Семёныча
// → сегодня: «один хозяин, не битая», бот присылает Диме за 1 с → отчёт по VIN: ДТП 2019 → честный Семёныч, 1 450 000. Без фоновой музыки.
$("#title .a").textContent = E.rubric; $("#title .b").textContent = E.subtitle; $("#tag span").textContent = "жизнь одной эво";
document.querySelector("#cam > svg#bg")?.remove();
const W = (line, pre, n = 0) => {
  const norm = s => s.toLowerCase().replace(/ё/g, "е").replace(/[^а-я0-9a-z]/g, "");
  const hits = (TT.words[line] || []).filter(w => w[1] >= st[line] - .05 && w[2] <= en[line] + .05 && norm(w[0]).startsWith(norm(pre)));
  if (!hits[n]) console.warn("W miss", line, pre);
  return hits[n] ? hits[n][1] : st[line];
};
const G = (id, html, z = 5) => `<div class="grp" id="${id}" style="left:0;top:0;width:1080px;height:1920px;z-index:${z}">${html}</div>`;
const root = $("#scene"), SC = {}, SPK = {};
const mount = (name, def, sh) => (SC[name] = C.mount(root, def, sh));
const P = (p, v, o, x, foot, h, pose = {}, extra = {}) => (SPK[p] = v, ch("perekup", p, x, foot, h, o, pose, extra));
const TOKIO_L = glow(200, 400, 220, "#ff3bd0", .4) + glow(800, 500, 260, "#5ad0ff", .4) + glow(540, 1520, 420, "#ff3bd0", .25);
const GAR_L = glow(540, 250, 300, "#fff6c8", .55) + glow(225, 920, 220, "#ff7a1a", .6) + beam([[490, 236], [590, 236], [900, 1700], [180, 1700]], "#fff6c8", .16);
const WRENCH = `<svg viewBox="0 0 100 100"><path d="M50 10 v70" stroke="#8a929b" stroke-width="12" stroke-linecap="round"/><path d="M36 10 q14 -14 28 0 v10 h-8 v-6 h-12 v6 h-8 z" fill="#8a929b" stroke="#151515" stroke-width="4"/></svg>`;
const CRASHED = `<div class="grp" style="left:0;top:0;width:1080px;height:1920px;transform:rotate(7deg);transform-origin:640px 1420px;z-index:5">${car(EVO, 230, 1440, 700, { z: 5, sheen: .3 }) + CRASH(230, 1440 - 371 * .88 * .97, 700)}</div>`;
const HUDE = (n, km, y, c) => ODO(km, "odo" + n) + YEAR(y, c, "yr" + n);

// 1. Токио 2007: поворотный круг
mount("s1", { bg: "tokiosalon", grade: "night", over: HUDE(1, "0", "2007"), mid: car(EVO, 150, 1570, 780, { z: 5, sheen: .5, refl: 1 }), lights: TOKIO_L }, { x: 540, y: 1180, s: 1.06 });
mount("s1b", { bg: "tokiosalon", grade: "night", over: HUDE(12, "0", "2007"), mid: car(EVOR, 220, 1570, 660, { z: 5, sheen: .3, refl: 1 }), lights: TOKIO_L }, { x: 560, y: 1280, s: 1.3, r: -2 });
// 2. Владивосток 2013: кран опускает машину на причал
mount("s2", { bg: "rorosudno", grade: "dawn", over: HUDE(2, "0", "2013"), mid: G("hang", SLINGS(400, 430, 130, 520, 540) + car(EVOS, 130, 700, 540, { z: 5, sheen: .5 }), 5) + G("hsh", C.shadow(400, 1180, 480, 50, .45), 2) }, { x: 520, y: 880, s: 1.04 });
mount("s2b", { bg: "rorosudno", grade: "dawn", over: HUDE(3, "48 000", "2013"), mid: car(EVO, 180, 1600, 720, { z: 5, sheen: .6 }) + C.tag(420, 1340, "ВЛАДИВОСТОК", "2013 · ввоз", -4, 7) }, { x: 540, y: 1250, s: 1.12 });
// 3. трек 2016
mount("s3", { bg: "trek", grade: "day", over: HUDE(4, "48 000", "2016"),
  mid: car(EVO, 380, 1650, 680, { z: 5, sheen: .5 }) + P("gs", "gosha", GOSHA, 250, 1730, 770, { armR: -80 }, { rim: "#fff2c0", side: 1, z: 7 }), lights: glow(880, 200, 380, "#fff3c4", .5),
  bubbles: [{ id: "g1", p: "gs", html: "Эво — это не машина.<br><em>Это характер!</em>", fs: 46 }] }, { x: 540, y: 1200, s: 1.08 });
mount("s3b", { bg: "trek", grade: "day", over: HUDE(5, "96 000", "2016"), farBlur: 6, mid: SPEED(1180, 1560) + G("evos", car(EVOS, 160, 1520, 820, { z: 5, sheen: .7 }), 5), lights: glow(880, 200, 380, "#fff3c4", .5) }, { x: 540, y: 1330, s: 1.18 });
// 4. сугроб 2019
mount("s4", { bg: "sugrob", grade: "night", over: HUDE(6, "140 000", "2019", "#9fc3ff"), fx: SNOWFX(110, 21),
  mid: CRASHED + P("gc", "gosha", { ...GOSHA, look: "o" }, 860, 1740, 760, { armL: 150, armR: -150 }, { rim: "#9fc3ff", side: -1, z: 7 }),
  lights: glow(770, 385, 120, "#ffe2a0", .8) + beam([[750, 392], [790, 392], [1000, 1500], [500, 1500]], "#ffe2a0", .18),
  bubbles: [{ id: "g2", p: "gc", html: "Брат…<br><em>она сама.</em>", fs: 60 }] }, { x: 560, y: 1250, s: 1.06 });
mount("s4b", { bg: "sugrob", grade: "night", over: HUDE(7, "140 000", "2019", "#9fc3ff"), fx: SNOWFX(110, 23, 1.3), mid: CRASHED, lights: glow(770, 385, 120, "#ffe2a0", .8) }, { x: 430, y: 1260, s: 2.1, r: 4 });
// 5. гараж Семёныча 2020–2023
mount("s5", { bg: "bokssemen", grade: "warm", over: HUDE(8, "140 000", "2020", "#ff9a3c"),
  mid: G("evocrash", `<div class="grp" style="left:0;top:0;width:1080px;height:1920px">${car(EVO, 380, 1620, 700, { z: 5, sheen: .2, dim: .8 }) + CRASH(380, 1620 - 371 * .88 * .97, 700)}</div>`, 5)
    + G("evofix", car(EVO, 380, 1620, 700, { z: 5, sheen: .4 }), 5)
    + P("sm", "semen", SEMEN, 260, 1730, 760, { armR: -70 }, { rim: "#ffb36a", side: 1, z: 7 }) + G("wr", INHAND(260, 1730, 760, -70, 100, WRENCH, 9), 9),
  lights: GAR_L + G("sparks", C.motes(380, 1300, 500, 260, 16, 9), 31),
  bubbles: [{ id: "s1", p: "sm", html: "Три зимы по вечерам.<br><em>Собрал как было — даже лучше.</em>", fs: 40 }] }, { x: 540, y: 1200, s: 1.08 });
mount("s5b", { bg: "bokssemen", grade: "warm", over: HUDE(9, "140 000", "2023", "#ff9a3c"),
  mid: car(EVO, 300, 1640, 780, { z: 5, sheen: .55 }) + P("sm2", "semen", SEMEN, 200, 1740, 760, { armR: -150 }, { rim: "#ffb36a", side: 1, z: 7 }) + C.motes(300, 1100, 700, 400, 20, 4),
  lights: GAR_L + glow(700, 1450, 260, "#fff6c8", .3) }, { x: 560, y: 1260, s: 1.2 });
// 6. сегодня: бот → двор
{ const H = HOLDPHONE("perekup", "dp", 540, 1960, 1680, DIMA, BOTH("Evolution IX · вся Россия", `<div id="n6">${CARD("Mitsubishi Lancer Evolution IX · 2007", "1 600 000 ₽", "«один хозяин, не битая»", "⏱ 1 с после публикации")}</div>`), { rim: "#ffd27a", side: 1 });
  SPK.dp = "dima"; mount("s6", { bg: "osendvor", grade: "day", farBlur: 9, over: YEAR("СЕГОДНЯ", "#4cd964", "yr10"), mid: H.mid, lights: H.lights }, { x: 540, y: 960, s: 1 }); }
const YARD = (k, d, s, ko, so, spose = {}) => car(EVO, 300, 1620, 720, { z: 5, sheen: .5 }) + (k ? P(k, "kirill", { ...KIRILL, ...ko }, s ? 150 : 220, s ? 1720 : 1730, s ? 740 : 760, s ? {} : { armR: -80 }, { rim: "#fff2c0", side: 1, z: 6 }) : "")
  + (s ? P(s, "semen", { ...SEMEN, ...so }, 560, 1750, 760, spose, { rim: "#fff2c0", side: 1, z: 7 }) : "") + P(d, "dima", DIMA, s ? 900 : 880, 1760, 740, {}, { rim: "#fff2c0", side: -1, z: 7 });
mount("s6b", { bg: "osendvor", grade: "day", over: YEAR("СЕГОДНЯ", "#4cd964", "yr11"), mid: YARD("kr", "dm", null, {}), lights: glow(880, 300, 380, "#fff3c4", .4),
  bubbles: [{ id: "k1", p: "kr", html: "Один хозяин, не битая!<br><em>Миллион шестьсот.</em>", fs: 44 }, { id: "d0", p: "dm", html: "Красивая.<br><em>Но сначала — отчёт по VIN.</em>", fs: 42 }] }, { x: 560, y: 1200, s: 1.08 });
// 7. отчёт по VIN → Семёныч честно
{ const H = HOLDPHONE("perekup", "dv", 540, 1960, 1680, { ...DIMA, look: "o" }, VINREP(), { rim: "#ffd27a", side: 1, head: 6 });
  SPK.dv = "dima"; mount("s7", { bg: "osendvor", grade: "day", farBlur: 9, mid: H.mid, lights: H.lights,
    bubbles: [{ id: "d1", p: "dv", html: "Не битая, говорите?<br><em>По отчёту — ДТП, 2019.</em>", fs: 42 }] }, { x: 540, y: 960, s: 1 }); }
mount("s7b", { bg: "osendvor", grade: "day", mid: YARD("kr2", "dm2", "sm3", { look: "o" }, {}, { armL: 30 }), lights: glow(880, 300, 380, "#fff3c4", .4),
  bubbles: [{ id: "s2", p: "sm3", html: "Битая. Но собрал я её на совесть.<br><em>Миллион четыреста пятьдесят — и по рукам.</em>", fs: 36 }] }, { x: 560, y: 1200, s: 1.08 });
// 8. по рукам → итог
mount("s8", { bg: "osendvor", grade: "day",
  mid: car(EVO, 300, 1620, 720, { z: 5, sheen: .6 }) + P("sm4", "semen", SEMEN, 430, 1750, 760, { armR: -70 }, { rim: "#fff2c0", side: 1, z: 7 }) + G("keys", KEYS(600, 1360, 1.1), 12)
    + P("dm3", "dima", DIMA, 760, 1760, 740, { armL: 40 }, { rim: "#fff2c0", side: -1, z: 7 }), lights: glow(880, 300, 380, "#fff3c4", .4),
  bubbles: [{ id: "d2", p: "dm3", html: "По рукам.", fs: 56 }] }, { x: 600, y: 1240, s: 1.3 });
mount("s8b", { bg: "osendvor", grade: "dawn", over: CTA50.replace('<div style="position:absolute;', '<div id="cta" style="opacity:0;position:absolute;'),
  mid: car(EVO, 300, 1620, 720, { z: 5, sheen: .7 }) + P("dm4", "dima", { ...DIMA, item: "phone" }, 860, 1760, 740, {}, { rim: "#ffc46a", side: -1, z: 7 }), lights: glow(880, 300, 420, "#ffb36a", .5) }, { x: 560, y: 1200, s: 1.08 });

$("#end h2").innerHTML = E.end;

window.build = R => {
  const tl = R.tl;
  const { pop } = common(R, { shake: 0 });
  for (const el of Object.values(SC)) {
    el.snow = [...el.querySelectorAll(".snowfx i")].map(i => ({ i, y0: parseFloat(i.style.top) }));
    el.sheens = [...el.querySelectorAll(".sheen")];
    el.glows = [...el.querySelectorAll(".lights .glow")].map(g => ({ g, o: +g.style.opacity }));
    el.spd = [...el.querySelectorAll(".spd")].map(s => ({ s, x0: parseFloat(s.style.left) }));
    el.steam = [...el.querySelectorAll(".steam")];
    el.motes = [...el.querySelectorAll(".mote")];
  }
  const talk = (lv, f) => lv > .28 && !(lv < .55 && f % 3 === 2);
  const MOOD = { gc: "o", kr2: "o", dv: "o" };
  R.hooks.push(t => {
    const f = Math.floor(t * 30);
    for (const el of Object.values(SC)) {
      if (!(+el.style.opacity > 0)) continue;
      const k = el.cam.s > 1.6 ? .55 : 1;
      C.apply(el, [(R.noise(t * .6) * 9 + R.noise(t * 1.7 + 40) * 3) * k, (R.noise(t * .5 + 9) * 10 + R.noise(t * 1.9 + 70) * 3) * k, R.noise(t * .4 + 20) * .3 * k]);
      el.snow.forEach(({ i, y0 }, j) => { const dy = ((y0 + 40 + t * (160 + (j % 5) * 30)) % 2000) - 40 - y0; i.style.transform = `translate(${(Math.sin(t * .8 + j) * 30 - dy * .2).toFixed(1)}px,${dy.toFixed(1)}px)`; });
      el.sheens.forEach((s, j) => { s.style.backgroundPosition = `${(130 - ((t * 14 + j * 45) % 160)).toFixed(1)}% 0`; });
      el.glows.forEach(({ g, o }, j) => { g.style.opacity = (o * (.88 + .12 * R.noise(t * 2.5 + j * 3.1))).toFixed(3); });
      el.spd.forEach(({ s, x0 }, j) => { s.style.left = (((x0 + 200 - t * 2600 - j * 90) % 1400 + 1400) % 1400 - 300).toFixed(0) + "px"; });
      el.steam.forEach((s, j) => { const q = (t * .35 + j * .2) % 1; s.style.transform = `translateY(${(-q * 160).toFixed(0)}px) scale(${(.7 + q * .8).toFixed(2)})`; s.style.opacity = (.8 * (1 - q)).toFixed(2); });
      el.motes.forEach((m, j) => { m.style.translate = `${(Math.sin(t * .7 + j) * 24).toFixed(1)}px ${(-((t * 22 + j * 40) % 160)).toFixed(1)}px`; });
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
  const odo = (n, from, to, at) => { const el = $(`#odo${n} span`); R.count(el, at, from, to, .9); R.sfx("clack", at, .5);
    tl.fromTo(`#odo${n}`, { scale: 1.2 }, { scale: 1, duration: .4, ease: "back.out(2)", immediateRender: false }, at); };
  const stampY = (sel, at) => { tl.fromTo(sel, { scale: 1.8, opacity: 0 }, { scale: 1, opacity: 1, duration: .2, ease: "power4.out", immediateRender: false }, at); R.sfx("impact", at + .02, .6); };
  const ids = E.lines.map(l => l.id), nxt = l => ids[ids.indexOf(l) + 1];
  const bub = (l, until) => pop("#b_" + l, st[l] - .05, until ?? Math.min(en[l] + .8, nxt(l) ? st[nxt(l)] - .1 : en[l] + 1));

  // 1. Токио: круг поворачивается (3/4 спереди → сзади)
  show("s1", 0); tl.to("#title", { opacity: 0, y: -50, duration: .25 }, 1.8);
  move("s1", { s: 1.16, x: 520 }, 0, 3, "power1.inOut");
  gsap.set(["#yr1", "#yr2", "#yr4", "#yr6", "#yr8", "#yr10"], { opacity: 0 });     // штампы годов в первых кадрах сцен — только когда «ставятся»
  stampY("#yr1", Math.max(2.05, W("l0", "2007") - .1));
  const C1 = W("l0", "проб") - .15; cut("s1", "s1b", C1); move("s1b", { s: 1.2, r: 0 }, C1, en.l0 - C1 + .3, "none");
  // 2. Владивосток: кран опускает, затем причал
  const SW2 = st.l1 - .4; swap("s1b", "s2", SW2);
  gsap.set("#hang", { y: -260 }); tl.to("#hang", { y: 0, duration: 2.4, ease: "power1.inOut" }, SW2 + .2);
  stampY("#yr2", W("l1", "шест") + .2);
  const C2 = W("l1", "проб") - .15; cut("s2", "s2b", C2); odo(3, 0, 48000, C2 + .2); move("s2b", { s: 1.2 }, C2, en.l1 - C2 + .3, "none");
  // 3. трек: Гоша → машина проносится
  const SW3 = st.g1 - .4; swap("s2b", "s3", SW3); stampY("#yr4", SW3 + .5);
  move("s3", { x: 500, s: 1.14 }, SW3, en.g1 - SW3 + .3, "none"); bub("g1", st.l2 - .15);
  cut("s3", "s3b", st.l2 - .1); odo(5, 48000, 96000, st.l2 + .2);
  tl.fromTo("#evos", { x: 900 }, { x: 0, duration: .6, ease: "power3.out", immediateRender: false }, st.l2 - .1); R.sfx("whoosh", st.l2, .8);
  move("s3b", { x: 500 }, st.l2 - .1, en.l2b - st.l2 + .3, "none");
  // 4. сугроб
  const SW4 = st.g2 - .4; swap("s3b", "s4", SW4); R.sfx("boom", SW4 + .1, .7); R.shake(cam("s4"), SW4 + .15, 1, .5); stampY("#yr6", SW4 + .5);
  odo(6, 96000, 140000, SW4 + .3); move("s4", { s: 1.12 }, SW4, en.g2 - SW4 + .3, "none"); bub("g2", st.l3 - .15);
  cut("s4", "s4b", st.l3 - .1); move("s4b", { s: 2.25 }, st.l3 - .1, en.l3 - st.l3 + .3, "none");
  // 5. гараж: разбитая → собранная; год листается
  const SW5 = st.s1 - .4; swap("s4b", "s5", SW5); stampY("#yr8", SW5 + .5);
  gsap.set(["#evofix", "#sparks"], { opacity: 0 });
  tl.to("#sparks", { opacity: 1, duration: .2 }, SW5 + .6).to("#sparks", { opacity: 0, duration: .3 }, en.s1);
  [["2021", W("s1", "зим")], ["2022", W("s1", "собрал")], ["2023", W("s1", "лучш")]].forEach(([y, at]) => { tl.set("#yr8", { textContent: y }, at); stampY("#yr8", at); });
  tl.to("#evocrash", { opacity: 0, duration: .5 }, W("s1", "лучш") - .2).to("#evofix", { opacity: 1, duration: .5 }, W("s1", "лучш") - .2); R.sfx("ping", W("s1", "лучш"), .7);
  move("s5", { s: 1.14 }, SW5, en.s1 - SW5, "none"); bub("s1", st.l5 - .15);
  cut("s5", "s5b", st.l5 - .1); move("s5b", { s: 1.3, x: 600 }, st.l5 - .1, en.l5 - st.l5 + .3, "none");
  // 6. сегодня: бот → двор
  const SW6 = st.l4 - .4; swap("s5b", "s6", SW6); stampY("#yr10", SW6 + .5);
  gsap.set("#n6", { opacity: 0 }); const N6 = W("l4", "бот") - .1;
  tl.fromTo("#n6", { opacity: 0, y: -50 }, { opacity: 1, y: 0, duration: .3, ease: "back.out(1.8)", immediateRender: false }, N6); R.sfx("ping", N6, .9);
  move("s6", { s: 1.07, y: 1000 }, SW6, en.l4 - SW6, "none");
  cut("s6", "s6b", st.k1 - .1); move("s6b", { x: 520, s: 1.14 }, st.k1 - .1, en.d0 - st.k1 + .3, "none"); bub("k1", st.d0 - .1); bub("d0", st.d1 - .45);
  // 7. VIN → Семёныч
  const SW7 = st.d1 - .4; swap("s6b", "s7", SW7);
  gsap.set("#dtp", { opacity: 0 }); tl.fromTo("#dtp", { opacity: 0, scale: 1.3 }, { opacity: 1, scale: 1, duration: .25, ease: "back.out(2)", immediateRender: false }, W("d1", "дтп") - .1); R.sfx("impact", W("d1", "дтп"), .6);
  move("s7", { s: 1.08, y: 1000 }, SW7, en.d1 - SW7, "none"); bub("d1", st.s2 - .15);
  cut("s7", "s7b", st.s2 - .1); move("s7b", { x: 580, s: 1.14 }, st.s2 - .1, en.s2 - st.s2 + .3, "none"); bub("s2", st.d2 - .15);
  // 8. по рукам → итог
  cut("s7b", "s8", st.d2 - .1); gsap.set("#keys", { opacity: 0 }); tl.fromTo("#keys", { opacity: 0, y: -60 }, { opacity: 1, y: 0, duration: .3, ease: "back.out(2)", immediateRender: false }, st.d2); R.sfx("clack", st.d2 + .1, .5);
  bub("d2", st.l6 - .45);
  const SW8 = st.l6 - .4; swap("s8", "s8b", SW8); move("s8b", { s: 1.14, y: 1160 }, SW8, en.end - SW8, "none");
  tl.fromTo("#cta", { opacity: 0, y: 80, scale: .9 }, { opacity: 1, y: 0, scale: 1, duration: .4, ease: "back.out(1.6)", immediateRender: false }, st.end + .3);
  ending(R, en.end + .3);
};

// ── ep50h «Пастель»: быстрая уникализация — меняется только заставка ──
$("#title .a").textContent = "ИСТОРИЯ"; $("#title .a").style.cssText = "font-size:110px;background:#ff6fae;color:#151515";
$("#title .b").textContent = "ОДНОЙ ЭВО"; $("#title .b").style.cssText = "font-size:60px;background:#151515;color:#ff6fae";
