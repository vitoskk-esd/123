// «ТОЛЯН · 17: УЧЁБА В МОСКВЕ» (ep78) — сезон «Свой автосалон», без мата. Толян едет в Москву к Лёхе (лысый, татуировки, кожанка, Rolls-Royce Cullinan).
// ОБЛОЖКА → карта поездки → Москва-Сити (камера сверху вниз по башням) → Cullinan подъезжает, Лёха → 60-й этаж: маркер на доске → «чужими деньгами»
// → экзамен ботом на секундомере (40 с) → Лёха берёт в долю: 2/10 → фото «2009 · Лёха и Жорик» → Сити ночью → финал Лиса + карточка бота.
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
const L = (p, x, foot, h, o = {}, pose = {}, extra = {}) => LEHA(ch("perekup", spk(p, "leha"), x, foot, h, { ...LEHA_O, ...o }, pose, extra));
const Z = (p, x, foot, h, o = {}, pose = {}, extra = {}) => ch("perekup", p, x, foot, h, { ...ZHORA, ...o }, pose, extra);
const grp = (id, html, z = "") => `<div class="grp" id="${id}" style="position:absolute;left:0;top:0;width:1080px;height:1920px${z !== "" ? `;z-index:${z}` : ""}">${html}</div>`;
const ML = glow(540, 300, 480, "#ffffff", .22), OL = glow(540, 500, 560, "#ffffff", .2), NL = glow(540, 1200, 600, "#ffb84a", .2);
const CTA78 = CTA.replace('<div style="position:absolute;', '<div id="cta" style="opacity:0;position:absolute;');

// 1. обложка: Толян с ботом на фоне Сити
{ const H = HOLDPHONE("tolyan", spk("ta", "tolyan"), 540, 2090, 1680, {}, SOLCARD(), { rim: "#ffffff", side: 1 });
  mount("s1", { bg: "moskvasiti", farBlur: 8, mid: H.mid, lights: H.lights + ML }, { x: 540, y: 960, s: 1 }); }
// 2. карта поездки
mount("i1", { bg: "moskvasiti", over: ROUTE() + PIPS(T("tb", 160, 640, 640, {}, { z: 2 }), "tb", "pp1", "#ffd23f", 700, 1580),
  bubbles: [{ id: "t0", p: "tb", html: "Поеду учиться, брат.<br><em>К лучшим.</em>", fs: 46 }] }, { x: 540, y: 960, s: 1 });
// 3. Москва-Сити: камера сверху вниз
mount("s2", { bg: "moskvasiti", mid: T("tc", 300, 1900, 760, { armR: -150 }, { rim: "#fff", side: 1, z: 7 }), lights: ML }, { x: 540, y: 1000, s: 1 });
// 4. Cullinan подъезжает, Лёха
mount("s3", { bg: "moskvasiti", farBlur: 3, mid: grp("cg", car(CULL, 300, 1700, 760, { z: 5, sheen: .6 }), 5) + grp("lg", L("la", 190, 1900, 900, {}, { armR: -60 }, { rim: "#fff", side: 1, z: 8 }), 8), lights: ML,
  bubbles: [{ id: "x0", p: "la", html: "Толян? Пошли.<br><em>У меня на всё — пятнадцать минут.</em>", fs: 38 }] }, { x: 540, y: 1150, s: 1.02 });
// 5. 60-й этаж: доска
mount("s4", { bg: "ofis60", mid: BOARD78() + L("lb", 330, 1900, 880, {}, { armR: -100 }, { rim: "#fff", side: 1, z: 7 }), lights: OL,
  bubbles: [{ id: "x1", p: "lb", html: "Стоят — это склад.<br><em>Крутятся — это салон.</em>", fs: 44 }] }, { x: 540, y: 1100, s: 1.02 });
// 6. «чужими деньгами»
mount("s5", { bg: "ofis60", farBlur: 2, mid: T("td", 250, 1920, 860, {}, { rim: "#fff", side: 1, z: 7 }) + L("lc", 820, 1920, 880, {}, { armL: -60 }, { rim: "#fff", side: -1, z: 7 }), lights: OL,
  bubbles: [{ id: "t1", p: "td", html: "И как их крутить,<br><em>если денег нет?</em>", fs: 42 }, { id: "x2", p: "lc", html: "Чужими деньгами. Найди машину ниже рынка,<br><em>пока я пью кофе. Время пошло.</em>", fs: 34 }] }, { x: 540, y: 1120, s: 1.02 });
// 7. экзамен: бот на секундомере
mount("i2", { bg: "ofis60", over: EXAM() + PIPS(T("te", 160, 640, 640, {}, { z: 2 }), "te", "pp2", "#ffd23f", 60, 1580) }, { x: 540, y: 960, s: 1 });
// 8. Лёха удивлён: в долю
mount("s6", { bg: "ofis60", farBlur: 2, mid: L("ld", 560, 1980, 1000, { look: "o" }, { armR: -40 }, { rim: "#fff", side: 1, z: 7 }), lights: OL,
  bubbles: [{ id: "x3", p: "ld", html: "Сорок секунд? Беру в долю:<br><em>мои деньги, твоя площадка, прибыль пополам.</em>", fs: 34 }] }, { x: 540, y: 1080, s: 1.04 });
// 9. фото на стене: 2009
mount("i3", { bg: "ofis60", over: PHOTO(L("lp", 230, 760, 600, { jacket: "#3a3f46", hair: "#3a2d22", chain: false }, {}, { z: 2 }) + Z("zp", 500, 760, 560, { mustache: false, hair: "#2b1a14" }, { armL: -100 }, { z: 2 }))
  + PIPS(T("tf", 160, 640, 640, {}, { z: 2 }), "tf", "pp3", "#ffd23f", 700, 1580),
  bubbles: [{ id: "t2", p: "tf", html: "Лёха, а это кто<br><em>на фото?</em>", fs: 44 }] }, { x: 540, y: 960, s: 1 });
// 10. Сити ночью
mount("s7", { bg: "sitinoch", mid: car(CULS, 200, 1600, 680, { z: 5, sheen: .6 }) + L("le", 130, 1920, 780, {}, { armR: -40 }, { rim: "#ffb84a", side: 1, z: 8 }) + T("tg", 960, 1920, 740, {}, { rim: "#ffb84a", side: -1, z: 8 }), lights: NL,
  bubbles: [{ id: "x4", p: "le", html: "Жора? Мой первый ученик.<br><em>Говорил ему: не жадничай.</em>", fs: 40 }] }, { x: 540, y: 1150, s: 1.02 });
// 11. карточка бота
mount("s8", { bg: "sitinoch", farBlur: 6, over: CTA78, lights: NL }, { x: 540, y: 1000, s: .98 });

$(".stage").insertAdjacentHTML("beforeend", CNT77("20 000", 1));
$("#end h2").innerHTML = E.end;

window.build = R => {
  const tl = R.tl;
  const { pop } = common(R, { shake: 0 });
  for (const el of Object.values(SC)) {
    el.sheens = [...el.querySelectorAll(".sheen")];
    el.glows = [...el.querySelectorAll(".lights .glow")].map(g => ({ g, o: +g.style.opacity }));
  }
  const talk = (lv, f) => lv > .28 && !(lv < .55 && f % 3 === 2);
  const MOOD = { ld: "o", la: "flat", lb: "flat", lc: "flat", le: "grin" };
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
  const pipIn = (id, at) => tl.fromTo("#" + id, { scale: .5, opacity: 0 }, { scale: 1, opacity: 1, duration: .28, ease: "back.out(2)", immediateRender: true }, at + .05);

  // 1. обложка: плашка с кадра 0, гаснет к 1,6 с
  gsap.set(SC.s1, { opacity: 1 }); SC.s1.style.display = "";
  gsap.set(["#cnt", "#cnt77"], { opacity: 0 });
  tl.set(SC.s1, { opacity: 1 }, 0); tl.to("#title", { opacity: 0, y: -50, duration: .25 }, 1.6);
  push("s1", 0, 2.2, { s: 1.06, y: 1000 });
  tl.fromTo("#scc", { scale: 1 }, { scale: 1.06, duration: .15, yoyo: true, repeat: 1, ease: "power2.out", immediateRender: false }, 1.0); R.sfx("ping", 1.0, .5);
  // 2. карта: линия рисуется, машинка едет к Москве
  const M1 = Math.max(1.9, (W("l0", "талян") ?? Wd("l0", "толян", .45)) - .2); cut("i1", M1); tl.to("#cnt77", { opacity: 1, duration: .25 }, M1);
  tl.fromTo("#route", { strokeDashoffset: 1400 }, { strokeDashoffset: 0, duration: Math.max(2, en.t0 - M1), ease: "power1.inOut", immediateRender: true }, M1 + .1);
  tl.fromTo("#rcar", { x: 0, y: 0 }, { x: 590, y: -950, duration: Math.max(2, en.t0 - M1), ease: "power1.inOut", immediateRender: true }, M1 + .1); R.sfx("rev", M1 + .2, .4);
  pipIn("pp1", st.t0 - .4); bub("t0", st.l1 - .05);
  // 3. Сити: камера сверху вниз
  swap("s2", st.l1 - .3); tl.set(cam("s2"), { y: 560, s: 1.15 }, st.l1 - .3); tl.to(cam("s2"), { y: 1080, s: 1.02, duration: en.l1 - st.l1 + .4, ease: "power2.inOut" }, st.l1 - .1);
  // 4. Cullinan подъезжает, выходит Лёха
  const SW3 = Math.max(en.l1 - .2, st.x0 - 1.4); cut("s3", SW3); push("s3", SW3, en.x0 - SW3 + .5, { s: 1.08 });
  tl.fromTo("#cg", { x: 1100 }, { x: 0, duration: 1.0, ease: "power3.out", immediateRender: true }, SW3); R.sfx("whoosh", SW3, .5);
  tl.fromTo("#lg", { opacity: 0, x: 60 }, { opacity: 1, x: 0, duration: .35, ease: "power2.out", immediateRender: true }, SW3 + .9);
  bub("x0", st.l2 - .1);
  // 5. доска: маркер пишет
  swap("s4", st.l2 - .3); push("s4", st.l2 - .3, en.x1 - st.l2 + .5, { s: 1.08 }); bub("x1", st.t1 - .1);
  [["#wb1", Wd("x1", "стоят", .2)], ["#wb2", Wd("x1", "крутят", .7)], ["#wb3", en.x1 - .1]].forEach(([s, at]) => {
    tl.fromTo(s, { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: .55, ease: "none", immediateRender: true }, at - .1); R.sfx("swish", at - .1, .35); });
  // 6. «чужими деньгами»
  cut("s5", st.t1 - .2); push("s5", st.t1 - .2, en.x2 - st.t1 + .4); bub("t1", st.x2 - .1); bub("x2", st.l3 - .1);
  // 7. экзамен: секундомер 0 → 40, приходит карточка
  const EX = en.x2 + .15; cut("i2", EX); pipIn("pp2", EX);
  const sw = { v: 0 }; const CARD = Wd("l3", "солярис", .4);
  tl.fromTo(sw, { v: 0 }, { v: 40, duration: Math.max(1.2, CARD - EX - .1), ease: "power1.in", immediateRender: false, onUpdate: () => { $("#sw").textContent = "00:" + String(Math.round(sw.v)).padStart(2, "0"); } }, EX + .1);
  for (let k = 0; k < 10; k++) R.sfx("tick", EX + .2 + k * (CARD - EX - .2) / 10, .35);
  tl.fromTo("#scc2", { scale: .6, opacity: 0 }, { scale: 1, opacity: 1, duration: .35, ease: "back.out(2)", immediateRender: true }, CARD); R.sfx("ping", CARD, .9);
  // 8. Лёха удивлён → в долю → 2/10
  cut("s6", st.x3 - .2); push("s6", st.x3 - .2, en.l4 - st.x3 + .5, { s: 1.12 }); bub("x3", st.l4 + .3);
  const CAR2 = Wd("l4", "вторая", .1); tl.set("#cc", { textContent: "2" }, CAR2);
  tl.fromTo("#cnt77", { scale: 1.3 }, { scale: 1, duration: .4, ease: "back.out(2)", immediateRender: false }, CAR2); R.sfx("clack", CAR2, .7);
  // 9. фото на стене
  cut("i3", st.t2 - .3); pipIn("pp3", st.t2 - .3); bub("t2", st.x4 - .1);
  // 10. Сити ночью
  swap("s7", st.x4 - .3); push("s7", st.x4 - .3, Math.min(st.l5 + 2.4, en.l5 - 2.3) - st.x4 + .5, { s: 1.1 }); bub("x4", st.l5 + .5);
  // 11. финал: фраза Лиса → карточка
  const SW8 = Math.min(st.l5 + 2.4, en.l5 - 2.3); tl.to("#cnt77", { opacity: 0, duration: .15 }, SW8 - .2);
  swap("s8", SW8); tl.to("#tag", { opacity: 0, duration: .2 }, SW8);
  tl.fromTo("#cta", { opacity: 0, y: 80, scale: .9 }, { opacity: 1, y: 0, scale: 1, duration: .4, ease: "back.out(1.6)", immediateRender: false }, SW8 + .5);
  ending(R, en.l5 + .3);
};

// ── ep78c «Неон»: быстрая уникализация — меняется только заставка ──
$("#title .a").textContent = "ТОЛЯН · 17:"; $("#title .a").style.cssText = "font-size:110px;background:#ffd23f;color:#151515";
$("#title .b").textContent = "ЭКЗАМЕН ЗА 40 СЕКУНД"; $("#title .b").style.cssText = "font-size:60px;background:#151515;color:#ffd23f";
const ORIG = [...document.querySelectorAll("#lbx .lbt, #lbx .lbb")].map(e => e.textContent), HEADT = 2.4;
{ const L = document.querySelector("#lbx"); if (L) { const a = L.querySelector(".lbt"), b = L.querySelector(".lbb");   // кинорамка вместо плашки (ep56)
  a.textContent = "ТОЛЯН · 17:"; b.textContent = "ЭКЗАМЕН ЗА 40 СЕКУНД"; a.style.background = b.style.background = "#ffd23f"; a.style.color = b.style.color = "#151515"; } }
{ const K = document.querySelector("#ballc"); if (K) { const orig = K.innerHTML, col = K.style.color;   // надпись над хрустальным шаром (ep58)
  K.innerHTML = "ТОЛЯН · 17:"; K.style.color = "#ffd23f";
  const B = window.build; window.build = R => { B(R); R.tl.to(K, { opacity: 0, duration: .15 }, HEADT - .6);
    R.tl.set(K, { innerHTML: orig, color: col }, HEADT - .45); R.tl.to(K, { opacity: 1, duration: .15 }, HEADT - .4); }; } }
{ const K = document.querySelector("#skc"); if (K) { const [a, b] = K.children, orig = [a.textContent, b.textContent], bg = K.style.background, col = K.style.color;   // подпись судебного рисунка (ep57)
  a.textContent = "ТОЛЯН · 17:"; b.textContent = "ЭКЗАМЕН ЗА 40 СЕКУНД"; K.style.background = "#ffd23f"; K.style.color = "#151515";
  const B = window.build; window.build = R => { B(R); R.tl.to(K, { opacity: 0, duration: .15 }, HEADT - .6);
    R.tl.set(a, { textContent: orig[0] }, HEADT - .45).set(b, { textContent: orig[1] }, HEADT - .45).set(K, { background: bg, color: col }, HEADT - .45);
    R.tl.to(K, { opacity: 1, duration: .15 }, HEADT - .4); }; } }
{ const L = document.querySelector("#lbx"); if (L) { const B = window.build; window.build = R => { B(R);   // до склейки с основным видео (HEAD) рамка возвращается к исходной
  const bars = [L.querySelector(".lbt"), L.querySelector(".lbb")], col = ["#fff", "#ffd23f"];
  R.tl.to(bars, { opacity: 0, duration: .15 }, HEADT - .6);
  bars.forEach((el, i) => R.tl.set(el, { textContent: ORIG[i], background: "#000", color: col[i] }, HEADT - .45));
  R.tl.to(bars, { opacity: 1, duration: .15 }, HEADT - .4); }; } }
