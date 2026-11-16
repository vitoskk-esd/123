// «РЖАВЧИНА: ЗАСЕЛЯЕМСЯ» (ep76) — сценка без рассказчика по референсу владельца 16.11, мат только в 3 местах-панчах.
// Склейка 1,5–2,5 с; вставки-гэги на весь экран с говорящим в кружке; бот — в середине (t2), в конце рекламы и концовки нет.
$("#title .a").textContent = E.rubric; $("#title .b").textContent = E.subtitle; $("#title .b").style.fontSize = "80px"; $("#tag span").textContent = "сценка";
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
const T = (p, x, foot, h, pose = {}, extra = {}) => ch("tolyan", spk(p, "tol"), x, foot, h, {}, pose, extra);
const RZ = (p, x, foot, h, o = {}, pose = {}, extra = {}) => ch("rzha", spk(p, "rzh"), x, foot, h, { ...RZH, ...o }, pose, extra);
const RY = (p, x, foot, h, o = {}, pose = {}, extra = {}) => ch("rzha", spk(p, "ryz"), x, foot, h, { ...RYZ, ...o }, pose, extra);
const grp = (id, html, z = "") => `<div class="grp" id="${id}" style="position:absolute;left:0;top:0;width:1080px;height:1920px${z !== "" ? `;z-index:${z}` : ""}">${html}</div>`;
const GL = glow(540, 160, 520, "#fff6c8", .3), VL = glow(540, 300, 480, "#ffffff", .25);
const PT = (p, ring, l, t, pose = {}) => p[0] === "t" ? T(p, 160, 640, 640, pose, { z: 2 }) : p[0] === "r" ? RZ(p, 160, 640, 640, {}, pose, { z: 2 }) : RY(p, 160, 640, 640, {}, pose, { z: 2 });
const IP = (p, id, ring, l, t, pose) => PIPS(PT(p, ring, l, t, pose), p, id, ring, l, t);

// 1. обложка: Ржавчина с сумками у новой Камри
mount("s1", { bg: "garazhtolyana", mid: car(CAMRY, 330, 1560, 740, { z: 5, sheen: .4 }) + grp("w1", RZ("ra", 200, 1820, 760, {}, { armR: 20 }, { rim: "#fff", side: 1, z: 7 }) + BAG(250, 1830, 230, "b1") + RY("ya", 980, 1860, 600, {}, { armL: -20 }, { rim: "#fff", side: -1, z: 7 }) + BAG(820, 1870, 190, "b2"), 7), lights: GL }, { x: 540, y: 1050, s: 1 });
// 2. вставка: кнопка подогрева «ЖОПА»
mount("i1", { bg: "garazhtolyana", over: SEATBTN() + IP("rp1", "pp1", "#ff7a1a", 700, 1500),
  bubbles: [{ id: "r0", p: "rp1", html: "О, у него тут и подогрев<br><em>ж*пы есть.</em>", fs: 40 }] }, { x: 540, y: 960, s: 1 });
// 3. салон
mount("s2", { bg: "salontolyana", mid: RZ("rb", 820, 2120, 1000, {}, { armL: 30 }, { z: 6 }) + RY("yb", 260, 2160, 820, {}, {}, { z: 6 }), lights: GL,
  bubbles: [{ id: "r0b", p: "rb", html: "Богато живёт.", fs: 44 }, { id: "y0", p: "yb", html: "И ёлочка с девятнадцатого<br><em>года висит.</em>", fs: 38 }] }, { x: 540, y: 1150, s: 1 });
// 4. вставка: ёлочка 2019
mount("i2", { bg: "garazhtolyana", over: ELKA() + IP("yp1", "pp2", "#ff7a1a", 60, 1500),
  bubbles: [{ id: "y0b", p: "yp1", html: "Ванилью пахнет…<br><em>девятнадцатым годом.</em>", fs: 40 }] }, { x: 540, y: 960, s: 1 });
// 5. Толян в воротах
mount("s3", { bg: "garazhtolyana", mid: car(CAMRY, -120, 1560, 740, { z: 5, sheen: .4 }) + grp("pk3", RY("yc", 300, 1500, 360, { look: "o" }, {}, { z: 4 }), 4) + T("ta", 800, 1900, 900, { armL: 40, armR: -40 }, { rim: "#fff", side: -1, z: 8 }), lights: GL,
  bubbles: [{ id: "t0", p: "ta", html: "Не понял.<br><em>Вы кто такие, н*хуй?</em>", fs: 44 }] }, { x: 540, y: 1150, s: 1.02 });
// 6. «Здравия желаем!» (и потом — ответы Ржавого)
mount("s4", { bg: "garazhtolyana", mid: car(CAMRY, 300, 1520, 700, { z: 4, sheen: .4 }) + RZ("rc", 330, 1880, 860, {}, { armR: -150 }, { rim: "#fff", side: 1, z: 7 }) + BAG(380, 1890, 230, "b3") + RY("yd", 790, 1880, 680, {}, { armR: -150 }, { rim: "#fff", side: -1, z: 7 }) + BAG(640, 1890, 190, "b4"), lights: GL,
  bubbles: [{ id: "r1", p: "rc", html: "Здравия желаем!<br><em>Ржавчина. Заселяемся.</em>", fs: 44 }, { id: "r2", p: "rc", html: "Вот и мы через секунду. Ты — в объявление,<br><em>мы — в пороги.</em>", fs: 36 },
    { id: "r4", p: "rc", html: "Ну всё, соседи.<br><em>Заносим вещи, Рыжик.</em>", fs: 42 }] }, { x: 540, y: 1150, s: 1.02 });
// 7. Толян средний план
mount("s5", { bg: "garazhtolyana", farBlur: 3, mid: car(CAMRY, 560, 1520, 640, { z: 3, sheen: .4 }) + T("te", 420, 2080, 1300, { armL: 30, armR: -60 }, { rim: "#fff", side: 1, z: 8 }), lights: GL,
  bubbles: [{ id: "t1", p: "te", html: "Куда вы заселяетесь?<br><em>Я её вчера купил!</em>", fs: 44 }, { id: "t3", p: "te", html: "Хер вам.", fs: 54 }] }, { x: 540, y: 1100, s: 1.04 });
// 8. Рыжик крупно
mount("s6", { bg: "garazhtolyana", farBlur: 4, mid: RY("yf", 540, 2080, 1150, {}, { armR: -40 }, { rim: "#fff", side: 1, z: 7 }), lights: GL,
  bubbles: [{ id: "y1", p: "yf", html: "Так поэтому и заселяемся.", fs: 44 }, { id: "y2", p: "yf", html: "Чё за антикор?<br><em>Ты химик, что ли?</em>", fs: 46 }] }, { x: 540, y: 1100, s: 1.04 });
// 9. вставка: предписание
mount("i3", { bg: "garazhtolyana", over: ORDER() + IP("yp2", "pp3", "#ff7a1a", 700, 1500),
  bubbles: [{ id: "y1b", p: "yp2", html: "Нас к тебе<br><em>прикомандировали.</em>", fs: 42 }] }, { x: 540, y: 960, s: 1 });
// 10. бот (середина ролика)
{ const H = HOLDPHONE("tolyan", spk("tb", "tol"), 540, 2040, 1450, {}, CMCARD(), { rim: "#fff6c8", side: 1 });
  mount("s7", { bg: "garazhtolyana", farBlur: 6, mid: grp("h7", H.mid, 20), lights: H.lights + GL,
    bubbles: [{ id: "t2", p: "tb", html: "Какое предписание? Я её через бота «Перехват» взял:<br><em>через секунду и ниже рынка!</em>", fs: 34 }] }, { x: 540, y: 1000, s: 1.02 }); }
// 11. вставка: антикор
mount("i4", { bg: "garazhtolyana", over: ANTIKOR() + IP("tp1", "pp4", "#ffd23f", 700, 1500),
  bubbles: [{ id: "t3b", p: "tp1", html: "У меня<br><em>антикор есть.</em>", fs: 44 }] }, { x: 540, y: 960, s: 1 });
// 12. граница антикором
mount("s8", { bg: "garazhtolyana", mid: car(CAMRY, 380, 1460, 640, { z: 3, sheen: .4 }) + RZ("rd", 640, 1680, 640, { angry: true }, {}, { z: 5 }) + RY("yg", 900, 1680, 500, { look: "o" }, {}, { z: 5 }) + SPRAYLINE(380, 1080, 1730) + T("td", 210, 1960, 860, { armR: -100 }, { rim: "#fff", side: 1, z: 9 }), lights: GL,
  bubbles: [{ id: "t4", p: "td", html: "Всё. Граница.<br><em>Съ*бали отсюда.</em>", fs: 44 }, { id: "r3", p: "rd", html: "Это у тебя в голове граница.<br><em>Мы перешагнём.</em>", fs: 38 }] }, { x: 540, y: 1150, s: 1.02 });
// 13. вставка: толщиномер
mount("i5", { bg: "garazhtolyana", over: GAUGE76() + IP("yp3", "pp5", "#ff7a1a", 60, 1580),
  bubbles: [{ id: "y3", p: "yp3", html: "Да тут до нас уже шпаклёвка живёт.<br><em>Пятый год.</em>", fs: 38 }] }, { x: 540, y: 960, s: 1 });
// 14. Толян в шоке крупно
mount("s9", { bg: "garazhtolyana", farBlur: 6, mid: T("tf", 540, 2350, 1700, { armL: -120, armR: -120 }, { rim: "#fff", side: 1, z: 8 }), lights: GL,
  bubbles: [{ id: "t5", p: "tf", html: "Чего?! А продавец говорил:<br><em>не бита, не крашена!</em>", fs: 42 }] }, { x: 540, y: 1050, s: 1.04 });
// 15. «На выход, с вещами!» — уходят с сумками
mount("s10", { bg: "garazhtolyana", mid: car(CAMRY, 380, 1500, 660, { z: 3, sheen: .4 }) + grp("w10", RZ("rh", 260, 1880, 740, {}, {}, { z: 6 }) + BAG(300, 1890, 220, "b5") + RY("yh", 520, 1880, 580, {}, {}, { z: 6 }) + BAG(450, 1890, 180, "b6"), 6) + T("tg", 860, 1940, 900, { armL: -100 }, { rim: "#fff", side: -1, z: 9 }), lights: GL,
  bubbles: [{ id: "t6", p: "tg", html: "Не можете вы!<br><em>На выход, с вещами!</em>", fs: 44 }] }, { x: 540, y: 1150, s: 1.02 });
// 16. титр «ВЕСНА» → гаражи весной → Ржавчина выглядывает из арки
mount("i6", { bg: "garazhtolyana", over: SPRING() }, { x: 540, y: 960, s: 1 });
mount("s11", { bg: "vorotavesna", mid: "", lights: VL }, { x: 540, y: 1000, s: 1 });
mount("s12", { bg: "garazhtolyana", farBlur: 6, mid: CARBODY(4) + grp("pk12", RY("yi", 660, 1360, 660, {}, { armR: -150 }, { z: 6 }) + RZ("rf", 860, 1330, 700, {}, { armL: -150 }, { z: 5 }), 5) + WHEELFG(8) + IP("tp2", "pp6", "#ffd23f", 70, 560, { armL: -150, armR: -150 }), lights: GL,
  bubbles: [{ id: "y4", p: "yi", html: "Здравия желаем.<br><em>Мы вернулись.</em>", fs: 44 }, { id: "t7", p: "tp2", html: "Да ёб твою мать…", fs: 46 }] }, { x: 540, y: 1100, s: 1 });

window.build = R => {
  const tl = R.tl;
  const { pop } = common(R, { shake: 0 });
  for (const el of Object.values(SC)) {
    el.sheens = [...el.querySelectorAll(".sheen")];
    el.glows = [...el.querySelectorAll(".lights .glow")].map(g => ({ g, o: +g.style.opacity }));
  }
  const talk = (lv, f) => lv > .28 && !(lv < .55 && f % 3 === 2);
  const MOOD = { yc: "o", yg: "o", tf: "o", rd: "flat", tp2: "flat", td: "flat" };
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
  window.MUSIC = { style: "bed", bpm: 96, end: R.dur - 1.2 };   // фоновой музыки нет (MUSIC_VOL=0)

  const cam = n => SC[n].cam;
  const show = (n, at, c) => { if (c) tl.set(cam(n), c, at); };
  let cur = "s1";
  const cut = (to, at, c) => { show(to, at, c); tl.set(SC[cur], { opacity: 0 }, at).set(SC[to], { opacity: 1 }, at); R.sfx("tick", at, .35); cur = to; };
  const swap = (to, at, c) => { const from = cur; show(to, at, c);
    tl.set(SC[to], { opacity: 1, x: 1080, filter: "blur(14px)" }, at)
      .to(SC[from], { x: -1080, filter: "blur(14px)", duration: .3, ease: "power3.in" }, at)
      .to(SC[to], { x: 0, filter: "blur(0px)", duration: .32, ease: "power3.out" }, at + .1)
      .set(SC[from], { opacity: 0, x: 0, filter: "none" }, at + .45).set(SC[to], { filter: "none" }, at + .46);
    R.sfx("whoosh", at, .55); cur = to; };
  const ins = (to, at) => { cut(to, at); tl.fromTo(SC[to].querySelector(".cf > div:last-child") || SC[to], { scale: 1.08 }, { scale: 1, duration: .35, ease: "power2.out", immediateRender: false }, at); R.sfx("pop", at, .5); };
  const push = (n, at, d, to = { s: "+=0.06" }) => tl.to(cam(n), { ...to, duration: d, ease: "none" }, at);
  const bub = (id, a, b) => pop("#b_" + id, a - .05, b);
  const pipIn = (id, at) => tl.fromTo("#" + id, { scale: .5, opacity: 0 }, { scale: 1, opacity: 1, duration: .28, ease: "back.out(2)", immediateRender: true }, at + .05);

  // 1. обложка: плашка видна с кадра 0, гаснет к 1,6 с
  gsap.set(SC.s1, { opacity: 1 }); SC.s1.style.display = "";
  gsap.set("#cnt", { opacity: 0 });
  tl.set(SC.s1, { opacity: 1 }, 0); tl.to("#title", { opacity: 0, y: -50, duration: .25 }, 1.6);
  push("s1", 0, 2.2, { s: 1.07, y: 1100 });
  tl.fromTo("#w1", { x: -30 }, { x: 30, duration: 2.2, ease: "none", immediateRender: true }, 0);
  // r0 «подогрев ж*пы» → вставка-кнопка
  const I1 = Math.max(1.75, Wd("r0", "подогрев", .3) - .25); ins("i1", I1); pipIn("pp1", I1); bub("r0", I1, Wd("r0", "богат", .7) - .1);
  R.sfx("ping", I1 + .3, .5);
  const S2 = Wd("r0", "богат", .7) - .15; cut("s2", S2); push("s2", S2, 3); bub("r0b", S2 + .05, en.r0 + .4); bub("y0", st.y0, Wd("y0", "ванил", .55) - .1);
  const I2 = Wd("y0", "ванил", .55) - .2; ins("i2", I2); pipIn("pp2", I2); bub("y0b", I2 + .05, en.y0 + .4);
  // t0 → r1 → t1
  cut("s3", st.t0 - .25); push("s3", st.t0 - .25, en.t0 - st.t0 + .6, { s: 1.1 }); bub("t0", st.t0, en.t0 + .5);
  tl.fromTo("#pk3", { y: 120 }, { y: 0, duration: .3, ease: "back.out(2)", immediateRender: true }, st.t0 + .3);
  cut("s4", st.r1 - .2, { s: 1.02, x: 540, y: 1150 }); push("s4", st.r1 - .2, en.r1 - st.r1 + .5, { s: 1.08 }); bub("r1", st.r1, en.r1 + .45); R.sfx("impact", Wd("r1", "здрав", 0) + .05, .45);
  cut("s5", st.t1 - .2, { s: 1.04, x: 540, y: 1100 }); push("s5", st.t1 - .2, en.t1 - st.t1 + .5); bub("t1", st.t1, en.t1 + .45);
  // y1 → предписание (печать в паузе) → бот
  cut("s6", st.y1 - .2, { s: 1.04 }); push("s6", st.y1 - .2, 2); bub("y1", st.y1, Wd("y1", "нас", .5) - .05);
  const I3 = Wd("y1", "нас", .5) - .15; ins("i3", I3); pipIn("pp3", I3); bub("y1b", I3 + .05, st.t2 - .15);
  tl.fromTo("#stamp", { scale: 2.6, opacity: 0, rotation: -24 }, { scale: 1, opacity: .85, rotation: -14, duration: .18, ease: "power4.in", immediateRender: true }, en.y1 + .15); R.sfx("hit", en.y1 + .33, .8);
  swap("s7", st.t2 - .3); push("s7", st.t2 - .3, en.t2 - st.t2 + .5, { s: 1.08 }); bub("t2", st.t2, en.t2 + .4);
  tl.fromTo("#cmc", { scale: 1 }, { scale: 1.07, duration: .15, yoyo: true, repeat: 1, ease: "power2.out", immediateRender: false }, Wd("t2", "перехв", .3)); R.sfx("ping", Wd("t2", "перехв", .3), .7);
  cut("s4", st.r2 - .2, { s: 1.35, x: 380, y: 1250 }); push("s4", st.r2 - .2, en.r2 - st.r2 + .5, { s: 1.42 }); bub("r2", st.r2, en.r2 + .45);
  // t3 «антикор» → вставка
  cut("s5", st.t3 - .2, { s: 1.15, x: 470, y: 1000 }); bub("t3", st.t3, Wd("t3", "у", .4) - .05);
  const I4 = Wd("t3", "у", .4) - .15; ins("i4", I4); pipIn("pp4", I4); bub("t3b", I4 + .05, en.t3 + .5);
  cut("s6", st.y2 - .2, { s: 1.12, y: 1000 }); push("s6", st.y2 - .2, en.y2 - st.y2 + .5, { s: 1.18 }); bub("y2", st.y2, en.y2 + .45);
  // t4 граница → r3
  cut("s8", st.t4 - .2, { s: 1.02, x: 540, y: 1150 }); bub("t4", st.t4, en.t4 + .4); R.sfx("swish", Wd("t4", "гран", .3) - .2, .7);
  tl.fromTo("#sl path", { strokeDashoffset: 1200 }, { strokeDashoffset: 0, duration: .7, ease: "power1.inOut", immediateRender: true }, Wd("t4", "гран", .3) - .25);
  tl.to(cam("s8"), { s: 1.22, x: 720, y: 1300, duration: .5, ease: "power2.inOut" }, st.r3 - .3); bub("r3", st.r3, en.r3 + .45);
  tl.to('[data-p="rd"]', { y: 90, x: 30, duration: .45, ease: "power2.inOut" }, Wd("r3", "переш", .7) - .1); R.sfx("tap", Wd("r3", "переш", .7) + .3, .6);
  // y3 толщиномер → t5 шок → r4 → t6 выгоняет
  ins("i5", st.y3 - .2); pipIn("pp5", st.y3 - .2); bub("y3", st.y3, en.y3 + .6);
  tl.fromTo(SC.i5.querySelectorAll("svg rect")[3] ? [SC.i5.querySelectorAll("svg rect")[3], SC.i5.querySelectorAll("svg text")[2]] : [], { scale: 0 }, { scale: 1, transformOrigin: "50% 50%", duration: .25, ease: "back.out(3)", immediateRender: true }, Wd("y3", "шпакл", .4)); R.sfx("ping", Wd("y3", "шпакл", .4), .6);
  cut("s9", st.t5 - .2); push("s9", st.t5 - .2, en.t5 - st.t5 + .5, { s: 1.1 }); bub("t5", st.t5, en.t5 + .45); R.sfx("impact", st.t5, .5);
  cut("s4", st.r4 - .2, { s: 1.02, x: 540, y: 1150 }); push("s4", st.r4 - .2, en.r4 - st.r4 + .5, { s: 1.06 }); bub("r4", st.r4, en.r4 + .45);
  cut("s10", st.t6 - .2); bub("t6", st.t6, en.t6 + .3);
  tl.to("#w10", { x: -1100, duration: 1.0, ease: "power2.in" }, en.t6 + .05); R.sfx("swish", en.t6 + .2, .5);
  // ВЕСНА → гаражи → «мы вернулись» → финал
  const V = en.t6 + .85;
  ins("i6", V); R.sfx("drop", V + .2, .6);
  cut("s11", Math.min(V + .9, st.y4 - .8)); push("s11", V + .9, 1, { s: 1.06 });
  cut("s12", st.y4 - .35); pipIn("pp6", st.t7 - .4);
  tl.fromTo("#pk12", { y: 320 }, { y: 0, duration: .45, ease: "back.out(1.8)", immediateRender: true }, st.y4 - .3); bub("y4", st.y4, st.t7 - .1);
  bub("t7", st.t7, R.dur + 1);
};

// ── ep76h «Пастель»: быстрая уникализация — меняется только заставка ──
$("#title .a").textContent = "АНТИКОР:"; $("#title .a").style.cssText = "font-size:110px;background:#ff6fae;color:#151515";
$("#title .b").textContent = "ГРАНИЦА ОТ РЖАВЧИНЫ"; $("#title .b").style.cssText = "font-size:60px;background:#151515;color:#ff6fae";
const ORIG = [...document.querySelectorAll("#lbx .lbt, #lbx .lbb")].map(e => e.textContent), HEADT = 2.4;
{ const L = document.querySelector("#lbx"); if (L) { const a = L.querySelector(".lbt"), b = L.querySelector(".lbb");   // кинорамка вместо плашки (ep56)
  a.textContent = "АНТИКОР:"; b.textContent = "ГРАНИЦА ОТ РЖАВЧИНЫ"; a.style.background = b.style.background = "#ff6fae"; a.style.color = b.style.color = "#151515"; } }
{ const K = document.querySelector("#ballc"); if (K) { const orig = K.innerHTML, col = K.style.color;   // надпись над хрустальным шаром (ep58)
  K.innerHTML = "АНТИКОР:"; K.style.color = "#ff6fae";
  const B = window.build; window.build = R => { B(R); R.tl.to(K, { opacity: 0, duration: .15 }, HEADT - .6);
    R.tl.set(K, { innerHTML: orig, color: col }, HEADT - .45); R.tl.to(K, { opacity: 1, duration: .15 }, HEADT - .4); }; } }
{ const K = document.querySelector("#skc"); if (K) { const [a, b] = K.children, orig = [a.textContent, b.textContent], bg = K.style.background, col = K.style.color;   // подпись судебного рисунка (ep57)
  a.textContent = "АНТИКОР:"; b.textContent = "ГРАНИЦА ОТ РЖАВЧИНЫ"; K.style.background = "#ff6fae"; K.style.color = "#151515";
  const B = window.build; window.build = R => { B(R); R.tl.to(K, { opacity: 0, duration: .15 }, HEADT - .6);
    R.tl.set(a, { textContent: orig[0] }, HEADT - .45).set(b, { textContent: orig[1] }, HEADT - .45).set(K, { background: bg, color: col }, HEADT - .45);
    R.tl.to(K, { opacity: 1, duration: .15 }, HEADT - .4); }; } }
{ const L = document.querySelector("#lbx"); if (L) { const B = window.build; window.build = R => { B(R);   // до склейки с основным видео (HEAD) рамка возвращается к исходной
  const bars = [L.querySelector(".lbt"), L.querySelector(".lbb")], col = ["#fff", "#ffd23f"];
  R.tl.to(bars, { opacity: 0, duration: .15 }, HEADT - .6);
  bars.forEach((el, i) => R.tl.set(el, { textContent: ORIG[i], background: "#000", color: col[i] }, HEADT - .45));
  R.tl.to(bars, { opacity: 1, duration: .15 }, HEADT - .4); }; } }
