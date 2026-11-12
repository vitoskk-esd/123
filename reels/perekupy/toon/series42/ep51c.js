// «ТОРГ · ДУЭЛЬ» (ep51, «Простой ролик 2», киношный формат ../cine.js). Сцены — как в утверждённой раскадровке board.html.
// Вестерн в гаражном кооперативе: Слава приехал за Lexus LS 400, дед Аркадий просит 800 000. Табло цены падает: пороги → 760, бот → 720.
// Дуэль глаз, перекати-поле. Поворот: дед тоже в «Перехвате» — «семьсот и твою пятёрку в зачёт». Без фоновой музыки.
$("#title .a").textContent = E.rubric; $("#title .b").textContent = E.subtitle; $("#tag span").textContent = "торг · дуэль";
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
const NOON_L = glow(540, 160, 260, "#fff6c8", .5);
const GAR_L = glow(540, 222, 280, "#fff6c8", .55) + beam([[480, 210], [600, 210], [900, 1700], [180, 1700]], "#fff6c8", .16);
const ZAK_L = glow(540, 820, 360, "#ffd08a", .55);
const BARS = `<div style="position:absolute;left:0;right:0;top:0;height:560px;background:#000;z-index:57"></div><div style="position:absolute;left:0;right:0;bottom:0;height:560px;background:#000;z-index:57"></div>`;
const DUEL = (a, b, ao = {}, bo = {}) => P(a, "slava", { ...SLAVA, ...ao }, 260, 1500, 560, {}, { rim: "#fff2c0", side: 1 }) + P(b, "arkady", { ...ARKADY, ...bo }, 820, 1500, 560, {}, { rim: "#fff2c0", side: -1 });
const GAR = (a, b, ao = {}, bo = {}, apose = {}, bpose = {}) => car(E30, 330, 1600, 700, { z: 4, sheen: .5 })
  + P(a, "arkady", { ...ARKADY, ...ao }, 200, 1720, 760, apose, { rim: "#fff6c8", side: 1, z: 7 }) + P(b, "slava", { ...SLAVA, ...bo }, 880, 1740, 740, bpose, { rim: "#fff6c8", side: -1, z: 7 });
const SIDE = (sheen, extra = "") => car(E30S, 140, 1640, 780, { z: 4, sheen }) + RUST(140, 1640 - 238 * .97, 780) + extra;
const LEXCARDS = `<div id="n4">${[["Lexus LS 400 · 1995", "690 000 ₽", "твой город · 2 дня"], ["Lexus LS 400 · 1996", "720 000 ₽", "твой город · сегодня"], ["Lexus LS 400 · 1994", "740 000 ₽", "твой город · ⏱ 1 с"]].map(c => CARD(...c)).join("")}</div>`;
const END_MID = (a, b, apose, bpose) => car(V05, 430, 1230, 230, { z: 3, sheen: .4 }) + car(E30, 290, 1560, 500, { z: 4, sheen: .6 })
  + P(a, "slava", SLAVA, 400, 1760, 740, apose, { rim: "#ffc46a", side: 1, z: 7 }) + P(b, "arkady", ARKADY, 700, 1760, 740, bpose, { rim: "#ffc46a", side: -1, z: 7 });

// 1. аллея в полдень: дуэль, перекати-поле → глаза Славы
mount("s1", { bg: "duelpolden", grade: "day", mid: DUEL("sa", "ar") + TUMBLE(470, 1400, 120, "tw1"), lights: NOON_L }, { x: 540, y: 1150, s: 1.04 });
mount("s1b", { bg: "duelpolden", grade: "day", over: BARS, mid: DUEL("sa2", "ar2", { look: "flat" }), lights: NOON_L }, { x: 262, y: 1104, s: 7 });
// 2. гараж деда: «восемьсот, легенда» → мысли облачками
mount("s2", { bg: "boksarkady", grade: "warm", over: PRICE("800 000", "pr2"), mid: GAR("ag", "sg", {}, {}, { armR: -80 }), lights: GAR_L,
  bubbles: [{ id: "a1", p: "ag", html: "Восемьсот тысяч.<br><em>Машина — легенда!</em>", fs: 44 }] }, { x: 540, y: 1200, s: 1.06 });
mount("s2b", { bg: "boksarkady", grade: "warm", over: PRICE("800 000", "pr2b"), mid: GAR("ag2", "sg2", { look: "grin" }, { look: "flat" }), lights: GAR_L,
  bubbles: [{ id: "t1", p: "ag2", cls: "think", html: "Отдам<br><em>и за шестьсот…</em>", fs: 40 }, { id: "t2", p: "sg2", cls: "think", html: "Больше семисот<br><em>не дам.</em>", fs: 40 }] }, { x: 540, y: 1200, s: 1.06 });
// 3. пороги → крупно ржавчина, табло 760
mount("s3", { bg: "boksarkady", grade: "warm", over: PRICE("800 000", "pr3"), mid: SIDE(.5, P("sp", "slava", SLAVA, 900, 1760, 740, { armL: 80 }, { rim: "#fff6c8", side: -1, z: 7 })), lights: GAR_L,
  bubbles: [{ id: "s1", p: "sp", html: "Легенда — это мотор.<br><em>А пороги — в рыжиках.</em>", fs: 42 }] }, { x: 560, y: 1260, s: 1.08 });
mount("s3b", { bg: "boksarkady", grade: "warm", over: PRICE("800 000", "pr3b"),
  mid: SIDE(.3, `<div class="hand" id="ryz" style="left:280px;top:1440px;z-index:9;font-size:60px;color:#ff3b30;transform:rotate(-5deg)">рыжики!</div>`), lights: GAR_L }, { x: 420, y: 1540, s: 2.4 });
// 4. бот как рычаг торга → дед возмущается, табло 720
{ const H = HOLDPHONE("perekup", "sb", 540, 1960, 1680, SLAVA, BOTH("Lexus LS 400 · твой город", LEXCARDS), { rim: "#fff6c8", side: 1 });
  SPK.sb = "slava"; mount("s4", { bg: "boksarkady", grade: "warm", farBlur: 9, over: PRICE("760 000", "pr4"), mid: H.mid, lights: H.lights,
    bubbles: [{ id: "s2", p: "sb", html: "Такие же в городе —<br><em>от шестисот девяноста.</em>", fs: 42 }] }, { x: 540, y: 960, s: 1 }); }
mount("s4b", { bg: "boksarkady", grade: "warm", over: PRICE("760 000", "pr4b"), mid: GAR("aa", "sa3", { look: "angry" }, {}), lights: GAR_L,
  bubbles: [{ id: "a2", p: "aa", html: "Это сарай, а не машина!<br><em>Ладно. Семьсот двадцать.</em>", fs: 42 }] }, { x: 240, y: 1120, s: 2.0, r: -5 });
// 5. дуэль взглядов: разделённый экран (два кадра, каждый обрезан до половины) → перекати-поле замирает
mount("s5l", { bg: "duelpolden", grade: "day", over: BARS, mid: DUEL("se", "ae", { look: "flat" }, { look: "flat" }), lights: NOON_L }, { x: 262, y: 1104, s: 7 });
mount("s5r", { bg: "duelpolden", grade: "day", over: BARS, mid: DUEL("se2", "ae2", { look: "flat" }, { look: "flat" }), lights: NOON_L }, { x: 822, y: 1104, s: 7 });
SC.s5l.style.clipPath = SC.s5r.style.clipPath = "inset(0 270px 0 270px)"; SC.s5l.style.translate = "-270px 0"; SC.s5r.style.translate = "270px 0";
root.insertAdjacentHTML("beforeend", `<div id="split" style="position:absolute;left:532px;top:0;width:16px;height:1920px;background:#fff;box-shadow:0 0 30px #000;z-index:80;opacity:0"></div>`);
mount("s5b", { bg: "duelpolden", grade: "day", over: PRICE("720 000", "pr5"), mid: DUEL("sw", "aw", { look: "flat" }, { look: "flat" }) + TUMBLE(480, 1420, 140, "tw5"), lights: NOON_L }, { x: 540, y: 1200, s: 1.12 });
// 6. поворот: у деда тот же бот, вчера пришла Славина «пятёрка» → «семьсот и пятёрку в зачёт»
{ const H = HOLDPHONE("perekup", "ap", 540, 1960, 1680, ARKADY, BOTH("ВАЗ-2105 · твой город", `<div id="n6">${CARD("ВАЗ-2105 · 2008", "200 000 ₽", "продаёт: Слава", "⏱ 1 с после публикации")}</div>`), { rim: "#fff6c8", side: 1 });
  SPK.ap = "arkady"; mount("s6", { bg: "boksarkady", grade: "warm", farBlur: 9, over: PRICE("720 000", "pr6"), mid: H.mid, lights: H.lights,
    bubbles: [{ id: "a3", p: "ap", html: "Внучок, я тоже в «Перехвате».<br><em>Твою пятёрку мне бот вчера прислал.</em>", fs: 38 }] }, { x: 540, y: 960, s: 1 }); }
mount("s6b", { bg: "boksarkady", grade: "warm", over: PRICE("720 000", "pr6b"), mid: GAR("at", "st", { look: "grin" }, { look: "o" }, { armR: -60 }), lights: GAR_L,
  bubbles: [{ id: "a4", p: "at", html: "Давай так: семьсот —<br><em>и твою пятёрку в зачёт.</em>", fs: 42 }] }, { x: 540, y: 1200, s: 1.06 });
// 7. закат: по рукам → финальная карточка
mount("s7", { bg: "duelzakat", grade: "dawn", over: PRICE("700 000 + пятёрка", "pr7"), mid: END_MID("sz", "az", { armR: -70 }, { armL: 70 }), lights: ZAK_L,
  bubbles: [{ id: "s3", p: "sz", html: "По рукам!", fs: 56 }] }, { x: 560, y: 1260, s: 1.08 });
mount("s7b", { bg: "duelzakat", grade: "dawn", over: CTA51.replace('<div style="position:absolute;', '<div id="cta" style="opacity:0;position:absolute;'), mid: END_MID("sz2", "az2", {}, {}), lights: ZAK_L }, { x: 560, y: 1260, s: 1.08 });

$("#end h2").innerHTML = E.end;

window.build = R => {
  const tl = R.tl;
  const { pop } = common(R, { shake: 0 });
  for (const el of Object.values(SC)) {
    el.sheens = [...el.querySelectorAll(".sheen")];
    el.glows = [...el.querySelectorAll(".lights .glow")].map(g => ({ g, o: +g.style.opacity }));
  }
  const talk = (lv, f) => lv > .28 && !(lv < .55 && f % 3 === 2);
  const MOOD = { aa: "angry", st: "o" };
  R.hooks.push(t => {
    const f = Math.floor(t * 30);
    for (const el of Object.values(SC)) {
      if (!(+el.style.opacity > 0)) continue;
      const k = el.cam.s > 1.6 ? .55 : 1;
      C.apply(el, [(R.noise(t * .6) * 9 + R.noise(t * 1.7 + 40) * 3) * k, (R.noise(t * .5 + 9) * 10 + R.noise(t * 1.9 + 70) * 3) * k, R.noise(t * .4 + 20) * .3 * k]);
      el.sheens.forEach((s, j) => { s.style.backgroundPosition = `${(130 - ((t * 14 + j * 45) % 160)).toFixed(1)}% 0`; });
      el.glows.forEach(({ g, o }, j) => { g.style.opacity = (o * (.88 + .12 * R.noise(t * 2.5 + j * 3.1))).toFixed(3); });
    }
    for (const [p, v] of Object.entries(SPK)) {
      if (!document.getElementById(p)) continue;
      const lv = (LIP[v] || [])[f] || 0;
      mouth(p, talk(lv, f) ? "talk" : (MOOD[p] || (/^(sa2|se|ae|sw|aw|sg2)/.test(p) ? "flat" : "grin")));
    }
  });
  window.MUSIC = { style: "bed", bpm: 90, end: R.dur - 1.2 };   // фоновой музыки нет (MUSIC_VOL=0)

  const cam = n => SC[n].cam;
  const show = (n, at) => tl.set(SC[n], { opacity: 1 }, at);
  const hide = (n, at) => tl.set(SC[n], { opacity: 0 }, at);
  const cut = (from, to, at) => { hide(from, at); show(to, at); R.sfx("tick", at, .4); };
  const swap = (from, to, at) => {
    tl.set(SC[to], { opacity: 1, x: 1080, filter: "blur(14px)" }, at)
      .to(SC[from], { x: -1080, filter: "blur(14px)", duration: .35, ease: "power3.in" }, at)
      .to(SC[to], { x: 0, filter: "blur(0px)", duration: .38, ease: "power3.out" }, at + .12)
      .set(SC[from], { opacity: 0, x: 0, filter: "none" }, at + .5).set(SC[to], { filter: "none" }, at + .51);
    R.sfx("whoosh", at, .6);
  };
  const move = (n, to, at, d, ease = "power2.inOut") => tl.to(cam(n), { ...to, duration: d, ease }, at);
  const price = (id, v, at) => { tl.set(`#${id} span`, { textContent: v }, at);
    tl.fromTo(`#${id}`, { scale: 1.25 }, { scale: 1, duration: .35, ease: "back.out(2)", immediateRender: false }, at); R.sfx("clack", at, .6); };
  const ids = E.lines.map(l => l.id), nxt = l => ids[ids.indexOf(l) + 1];
  const bub = (l, until) => pop("#b_" + l, st[l] - .05, until ?? Math.min(en[l] + .8, nxt(l) ? st[nxt(l)] - .1 : en[l] + 1));

  // 1. аллея: перекати-поле катится между героями → глаза Славы
  show("s1", 0); tl.to("#title", { opacity: 0, y: -50, duration: .25 }, 1.8);
  tl.fromTo("#tw1", { x: -760, rotation: 0 }, { x: 760, rotation: 1080, duration: en.l0b, ease: "none" }, 0);
  move("s1", { s: 1.14 }, 0, en.l0 + .3, "power1.inOut");
  R.sfx("whoosh", st.l0 + .2, .35);
  cut("s1", "s1b", st.l0b - .1); move("s1b", { s: 6.4, x: 270 }, st.l0b - .1, en.l0b - st.l0b + .3, "none");
  // 2. гараж: «восемьсот» → мысли
  const SW2 = st.a1 - .4; swap("s1b", "s2", SW2); move("s2", { s: 1.12 }, SW2, en.a1 - SW2 + .3, "none"); bub("a1", st.l1 - .15);
  tl.fromTo("#pr2", { scale: 1.6, opacity: 0 }, { scale: 1, opacity: 1, duration: .25, ease: "power4.out", immediateRender: false }, W("a1", "8")); R.sfx("impact", W("a1", "8"), .5);
  cut("s2", "s2b", st.l1 - .1); move("s2b", { s: 1.12 }, st.l1 - .1, en.l1 - st.l1 + .3, "none");
  pop("#b_t1", W("l1", "дед") - .05, en.l1 + .4); pop("#b_t2", W("l1", "слава") - .05, en.l1 + .4);
  // 3. пороги → крупно ржавчина, табло 800 → 760
  const SW3 = st.s1 - .4; swap("s2b", "s3", SW3); move("s3", { x: 520, s: 1.12 }, SW3, en.s1 - SW3 + .3, "none"); bub("s1", st.l1b - .15);
  cut("s3", "s3b", st.l1b - .1); move("s3b", { s: 2.6, x: 460 }, st.l1b - .1, en.l1b - st.l1b + .3, "none");
  gsap.set("#ryz", { opacity: 0 }); tl.fromTo("#ryz", { opacity: 0, scale: 1.4 }, { opacity: 1, scale: 1, duration: .2, ease: "power4.out", immediateRender: false }, st.l1b + .1); R.sfx("impact", st.l1b + .12, .5);
  price("pr3b", "760 000", W("l1b", "минус"));
  // 4. бот → дед: «сарай!», табло 760 → 720
  const SW4 = st.s2 - .4; swap("s3b", "s4", SW4); move("s4", { s: 1.07, y: 1000 }, SW4, en.s2 - SW4, "none");
  gsap.set("#n4", { opacity: 0 }); const N4 = W("s2", "бо") - .1;
  tl.fromTo("#n4", { opacity: 0, y: -50 }, { opacity: 1, y: 0, duration: .3, ease: "back.out(1.8)", immediateRender: false }, N4); R.sfx("ping", N4, .9);
  bub("s2", st.a2 - .15);
  cut("s4", "s4b", st.a2 - .1); R.shake(cam("s4b"), st.a2, 1, .35); move("s4b", { s: 2.15, r: -6 }, st.a2 - .1, en.a2 - st.a2 + .3, "none"); bub("a2", st.l2 - .15);
  price("pr4b", "720 000", W("a2", "72"));
  // 5. дуэль взглядов → перекати-поле замирает
  const SP = st.l2 - .1; hide("s4b", SP); show("s5l", SP); show("s5r", SP); tl.set("#split", { opacity: 1 }, SP); R.sfx("whoosh", SP, .5);
  move("s5l", { s: 7.6 }, SP, 2.4, "none"); move("s5r", { s: 7.6 }, SP, 2.4, "none");
  const C5 = W("l2", "даже") - .15; hide("s5l", C5); hide("s5r", C5); tl.set("#split", { opacity: 0 }, C5); show("s5b", C5); R.sfx("tick", C5, .4);
  tl.fromTo("#tw5", { x: -420, rotation: 0 }, { x: 0, rotation: 540, duration: Math.max(.8, en.l2 - C5 - .2), ease: "power2.out", immediateRender: false }, C5);
  move("s5b", { s: 1.2 }, C5, en.l2 - C5 + .3, "none");
  // 6. поворот: бот у деда → «семьсот и пятёрку»
  const SW6 = st.a3 - .4; swap("s5b", "s6", SW6); move("s6", { s: 1.07, y: 1000 }, SW6, en.l3 - SW6, "none");
  gsap.set("#n6", { opacity: 0 }); const N6 = W("a3", "бот") - .1;
  tl.fromTo("#n6", { opacity: 0, y: -50 }, { opacity: 1, y: 0, duration: .3, ease: "back.out(1.8)", immediateRender: false }, N6); R.sfx("ping", N6, .9);
  bub("a3", st.a4 - .15);
  cut("s6", "s6b", st.a4 - .1); move("s6b", { s: 1.14 }, st.a4 - .1, en.a4 - st.a4 + .3, "none"); bub("a4", st.s3 - .15);
  price("pr6b", "700 000", W("a4", "70"));
  // 7. закат: по рукам → финал
  const SW7 = st.s3 - .4; swap("s6b", "s7", SW7); move("s7", { s: 1.14 }, SW7, en.s3 - SW7 + .3, "none"); bub("s3", st.end - .15); R.sfx("clack", st.s3 + .2, .5);
  cut("s7", "s7b", st.end - .1); move("s7b", { s: 1.14, y: 1180 }, st.end - .1, en.end - st.end + .5, "none");
  tl.fromTo("#cta", { opacity: 0, y: 80, scale: .9 }, { opacity: 1, y: 0, scale: 1, duration: .4, ease: "back.out(1.6)", immediateRender: false }, st.end + .3);
  ending(R, en.end + .8);
};

// ── ep51c «Неон»: быстрая уникализация — меняется только заставка ──
$("#title .a").textContent = "ДЕД"; $("#title .a").style.cssText = "font-size:110px;background:#ffd23f;color:#151515";
$("#title .b").textContent = "ПРОТИВ ВНУКА"; $("#title .b").style.cssText = "font-size:60px;background:#151515;color:#ffd23f";
