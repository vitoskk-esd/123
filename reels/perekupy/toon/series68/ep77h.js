// «ТОЛЯН · 16: СВОЙ АВТОСАЛОН» (ep77) — продолжение мини-сериала «Толян: со ста тысяч», первая часть сезона «Свой автосалон». Без мата.
// ОБЛОЖКА (Толян с ботом + плашка) → флешбэк финала 15-й → площадка «СДАЁТСЯ» и Марк II → Римма Захаровна → договор (маркер) → бот: «пятёрка»
// → гараж Палыча: брезент долой → комиссия → площадка вечером 1/10 → баннер «ЖОРА МОТОРС» → финал Лиса + карточка бота.
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
const Z = (p, x, foot, h, o = {}, pose = {}, extra = {}) => ch("perekup", spk(p, "zhora"), x, foot, h, { ...ZHORA, ...o }, pose, extra);
const grp = (id, html, z = "") => `<div class="grp" id="${id}" style="position:absolute;left:0;top:0;width:1080px;height:1920px${z !== "" ? `;z-index:${z}` : ""}">${html}</div>`;
const DL = glow(540, 300, 480, "#ffffff", .22), GL = glow(540, 262, 420, "#fff2b0", .35), VL = glow(540, 520, 520, "#ffd9a0", .3);
const CTA77 = CTA.replace('<div style="position:absolute;', '<div id="cta" style="opacity:0;position:absolute;');

// 1. обложка: Толян с ботом
{ const H = HOLDPHONE("tolyan", spk("ta", "tolyan"), 540, 2090, 1680, {}, V05CARD(), { rim: "#ffffff", side: 1 });
  mount("s1", { bg: "ploshchadkasdam", farBlur: 8, mid: H.mid, lights: H.lights + DL }, { x: 540, y: 960, s: 1 }); }
// 2. флешбэк: финал 15-й части
mount("i1", { bg: "ploshchadkasdam", over: FLASH() }, { x: 540, y: 960, s: 1 });
// 3. площадка «СДАЁТСЯ» и Марк II
mount("s2", { bg: "ploshchadkasdam", mid: car(MK2, 380, 1640, 660, { z: 5, sheen: .5 }) + T("tb", 230, 1880, 880, { armR: -100 }, { rim: "#fff", side: 1, z: 7 }), lights: DL,
  bubbles: [{ id: "t0", p: "tb", html: "Свой салон, брат.<br><em>С вывеской.</em>", fs: 48 }] }, { x: 540, y: 1150, s: 1.02 });
// 4. Римма Захаровна
mount("s3", { bg: "ploshchadkasdam", mid: grp("rg", RI("ra", 760, 1880, 820, { armR: -40 }, { rim: "#fff", side: -1, z: 7 }), 7) + T("tc", 240, 1900, 840, {}, { rim: "#fff", side: 1, z: 7 }), lights: DL,
  bubbles: [{ id: "r0", p: "ra", html: "Сто тысяч в месяц. Через восемь недель —<br><em>десять машин. Нет — площадка Жоры.</em>", fs: 34 }] }, { x: 540, y: 1150, s: 1.02 });
// 5. договор аренды крупно
mount("i2", { bg: "ploshchadkasdam", over: LEASE() + PIPS(T("td", 160, 640, 640, {}, { z: 2 }), "td", "pp1", "#ffd23f", 700, 1560),
  bubbles: [{ id: "t1", p: "td", html: "Десять так десять.", fs: 46 }] }, { x: 540, y: 960, s: 1 });
// 6. бот: «пятёрка»
{ const H = HOLDPHONE("tolyan", spk("te", "tolyan"), 540, 2000, 1400, {}, V05CARD("vcc2"), { rim: "#ffffff", side: 1 });
  mount("s4", { bg: "ploshchadkasdam", farBlur: 5, mid: grp("h4", H.mid, 20), lights: H.lights + DL }, { x: 540, y: 1000, s: 1.02 }); }
// 7. гараж Палыча
mount("s5", { bg: "garazhpalycha", mid: car(V05, 330, 1620, 700, { z: 5 }) + TARP(330, 1630, 700, "tarp1") + PA("pa", 200, 1880, 820, {}, { armR: -60 }, { rim: "#fff2b0", side: 1, z: 9 }), lights: GL,
  bubbles: [{ id: "p0", p: "pa", html: "Перекупам не отдам.<br><em>Они её на запчасти распилят.</em>", fs: 40 }] }, { x: 540, y: 1150, s: 1.02 });
// 8. брезент долой
mount("s6", { bg: "garazhpalycha", mid: car(V05, 330, 1620, 700, { z: 5, sheen: .6 }) + TARP(330, 1630, 700, "tarp2") + PA("pb", 160, 1880, 780, { look: "o" }, {}, { z: 9 }) + T("tf", 900, 1900, 840, { armL: -120 }, { rim: "#fff2b0", side: -1, z: 9 }), lights: GL,
  bubbles: [{ id: "t2", p: "tf", html: "Я не перекуп, отец.<br><em>Я — автосалон.</em>", fs: 44 }] }, { x: 540, y: 1150, s: 1.02 });
// 9. договариваются
mount("s7", { bg: "garazhpalycha", farBlur: 3, mid: PA("pc", 300, 1940, 960, {}, { armR: -40 }, { rim: "#fff2b0", side: 1, z: 7 }) + T("tg", 800, 1960, 980, { armL: -40 }, { rim: "#fff2b0", side: -1, z: 7 }), lights: GL,
  bubbles: [{ id: "p1", p: "pc", html: "Салон?<br><em>А деньги где?</em>", fs: 46 }, { id: "t3", p: "tg", html: "Деньги — когда продам. Ставим на комиссию:<br><em>витрина, мойка, лучшее место.</em>", fs: 34 }] }, { x: 540, y: 1100, s: 1.04 });
// 10. площадка вечером: 1/10
mount("s8", { bg: "ploshchadkavecher", mid: SIGN77(240, 600) + grp("c8", car(V05, 300, 1640, 720, { z: 5, sheen: .5 }) + KOMIS(560, 1330), 5) + RI("rb", 170, 1900, 780, { armL: -30 }, { rim: "#ffd9a0", side: 1, z: 7 }), lights: VL,
  bubbles: [{ id: "r1", p: "rb", html: "Одна.<br><em>Осталось девять, Анатолий.</em>", fs: 42 }] }, { x: 540, y: 1060, s: 1.02 });
// 11. баннер Жоры через дорогу
mount("s9", { bg: "ploshchadkavecher", mid: SIGN77(30, 610, 3, .7) + ZBANNER() + Z("za", 820, 1900, 820, {}, { armR: -150 }, { rim: "#ffd9a0", side: -1, z: 7 }), lights: VL,
  bubbles: [{ id: "z0", p: "za", html: "Студент, салон — это не гараж.<br><em>Посмотрим, кто первым.</em>", fs: 38 }] }, { x: 540, y: 1080, s: 1.04 });
// 12. карточка бота
mount("s10", { bg: "ploshchadkavecher", farBlur: 6, over: CTA77, lights: VL }, { x: 540, y: 1000, s: .98 });

$(".stage").insertAdjacentHTML("beforeend", CNT77("120 000", 0));
$("#end h2").innerHTML = E.end;

window.build = R => {
  const tl = R.tl;
  const { pop } = common(R, { shake: 0 });
  for (const el of Object.values(SC)) {
    el.sheens = [...el.querySelectorAll(".sheen")];
    el.glows = [...el.querySelectorAll(".lights .glow")].map(g => ({ g, o: +g.style.opacity }));
  }
  const talk = (lv, f) => lv > .28 && !(lv < .55 && f % 3 === 2);
  const MOOD = { pb: "o", pa: "flat", pc: "flat" };
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
  const cntOn = at => tl.to("#cnt77", { opacity: 1, duration: .25 }, at), cntOff = at => tl.to("#cnt77", { opacity: 0, duration: .15 }, at);

  // 1. обложка: плашка с кадра 0, гаснет к 1,6 с
  gsap.set(SC.s1, { opacity: 1 }); SC.s1.style.display = "";
  gsap.set(["#cnt", "#cnt77"], { opacity: 0 });
  tl.set(SC.s1, { opacity: 1 }, 0); tl.to("#title", { opacity: 0, y: -50, duration: .25 }, 1.6);
  push("s1", 0, 2.2, { s: 1.06, y: 1000 });
  tl.fromTo("#vcc", { scale: 1 }, { scale: 1.06, duration: .15, yoyo: true, repeat: 1, ease: "power2.out", immediateRender: false }, 1.0); R.sfx("ping", 1.0, .5);
  // 2. флешбэк финала (сепия, медленный наезд)
  const F1 = Math.max(1.9, Wd("l0", "прошлой", .1) + .4);
  cut("i1", F1); R.sfx("rewind", F1, .5);
  tl.fromTo("#fb img", { scale: 1.08 }, { scale: 1, duration: Math.max(2, st.t0 - F1), ease: "none", immediateRender: false }, F1);
  // 3. площадка и Марк
  swap("s2", st.t0 - .5); push("s2", st.t0 - .5, en.t0 - st.t0 + 1); bub("t0", st.l1 + .4); cntOn(st.t0 - .2);
  // 4. Римма входит
  cut("s3", st.l1 + .2); push("s3", st.l1 + .2, en.r0 - st.l1, { s: 1.08 }); bub("r0", st.t1 - .1);
  tl.fromTo("#rg", { x: 500 }, { x: 0, duration: 1.0, ease: "power2.out", immediateRender: true }, st.l1 + .4); R.sfx("tap", st.l1 + .8, .4);
  // 5. договор: маркер по пунктам
  cut("i2", st.t1 - .3); bub("t1", st.l2 + .6);
  tl.fromTo("#pp1", { scale: .5, opacity: 0 }, { scale: 1, opacity: 1, duration: .28, ease: "back.out(2)", immediateRender: true }, st.t1 - .25);
  tl.fromTo("#hl", { width: "0%" }, { width: "100%", duration: .5, ease: "power1.inOut", immediateRender: true }, st.t1 - .2); R.sfx("swish", st.t1 - .2, .4);
  tl.fromTo("#hl2", { width: "0%" }, { width: "100%", duration: .5, ease: "power1.inOut", immediateRender: true }, en.t1 + .1); R.sfx("swish", en.t1 + .1, .4);
  const MONEY = W("l2", "20") ?? Wd("l2", "двадцать", .2);
  R.count($("#cv"), MONEY - .3, 120000, 20000, .7); tl.fromTo("#cnt77", { scale: 1.25 }, { scale: 1, duration: .4, ease: "back.out(2)", immediateRender: false }, MONEY - .3); R.sfx("clack", MONEY - .3, .6);
  // 6. бот: «пятёрка»
  const SW4 = Math.max(MONEY + .9, Wd("l2", "бот", .3) - .3); swap("s4", SW4); push("s4", SW4, 3, { s: 1.08 });
  tl.fromTo("#vcc2", { scale: 1 }, { scale: 1.07, duration: .15, yoyo: true, repeat: 1, ease: "power2.out", immediateRender: false }, SW4 + .45); R.sfx("ping", SW4 + .45, .8);
  // 7. гараж Палыча
  const SW5 = Math.max(SW4 + 2.2, Wd("l2", "продает", .85) - .3); swap("s5", SW5); push("s5", SW5, en.p0 - SW5 + .5, { s: 1.08 }); bub("p0", st.t2 - .3);
  // 8. брезент долой → «Я — автосалон»
  const TP = st.t2 - .75; cut("s6", TP);
  tl.to("#tarp2", { x: 700, y: -420, rotation: 28, opacity: 0, duration: .55, ease: "power2.in" }, TP + .15); R.sfx("whoosh", TP + .15, .8); R.sfx("ping", TP + .55, .5);
  push("s6", TP, en.t2 - TP + .5, { s: 1.08 }); bub("t2", st.p1 - .1);
  // 9. комиссия
  cut("s7", st.p1 - .2); push("s7", st.p1 - .2, en.t3 - st.p1 + .5); bub("p1", st.t3 - .1); bub("t3", st.l3 - .1);
  // 10. площадка вечером: машина заезжает, 1/10
  const SW8 = st.l3 - .3; swap("s8", SW8); push("s8", SW8, en.r1 - SW8 + .5, { s: 1.08 });
  tl.fromTo("#c8", { x: -900 }, { x: 0, duration: 1.1, ease: "power3.out", immediateRender: true }, SW8 + .15);
  tl.fromTo("#km", { scale: 0 }, { scale: 1, duration: .3, ease: "back.out(2.5)", immediateRender: true }, SW8 + 1.3);
  const CAR1 = Wd("l3", "площадке", .5); tl.set("#cc", { textContent: "1" }, CAR1);
  tl.fromTo("#cnt77", { scale: 1.3 }, { scale: 1, duration: .4, ease: "back.out(2)", immediateRender: false }, CAR1); R.sfx("clack", CAR1, .7);
  bub("r1", st.l4 - .1);
  // 11. баннер Жоры
  const SW9 = st.l4 - .2; cut("s9", SW9); push("s9", SW9, en.z0 - SW9 + .5, { s: 1.12 });
  tl.fromTo("#zb", { scaleY: 0 }, { scaleY: 1, duration: .6, ease: "bounce.out", immediateRender: true }, Wd("l4", "баннер", .7) - .2); R.sfx("drop", Wd("l4", "баннер", .7) - .1, .6);
  bub("z0", st.l5 + .4);
  // 12. финал: фраза Лиса → карточка
  const SW10 = Math.min(st.l5 + 2.0, en.l5 - 2.5); cntOff(SW10 - .2);
  swap("s10", SW10); tl.to("#tag", { opacity: 0, duration: .2 }, SW10);
  tl.fromTo("#cta", { opacity: 0, y: 80, scale: .9 }, { opacity: 1, y: 0, scale: 1, duration: .4, ease: "back.out(1.6)", immediateRender: false }, SW10 + .5);
  ending(R, en.l5 + .3);
};

// ── ep77h «Пастель»: быстрая уникализация — меняется только заставка ──
$("#title .a").textContent = "ТОЛЯН · 16:"; $("#title .a").style.cssText = "font-size:110px;background:#ff6fae;color:#151515";
$("#title .b").textContent = "ЖОРА МОТОРС ЧЕРЕЗ ДОРОГУ"; $("#title .b").style.cssText = "font-size:60px;background:#151515;color:#ff6fae";
const ORIG = [...document.querySelectorAll("#lbx .lbt, #lbx .lbb")].map(e => e.textContent), HEADT = 2.4;
{ const L = document.querySelector("#lbx"); if (L) { const a = L.querySelector(".lbt"), b = L.querySelector(".lbb");   // кинорамка вместо плашки (ep56)
  a.textContent = "ТОЛЯН · 16:"; b.textContent = "ЖОРА МОТОРС ЧЕРЕЗ ДОРОГУ"; a.style.background = b.style.background = "#ff6fae"; a.style.color = b.style.color = "#151515"; } }
{ const K = document.querySelector("#ballc"); if (K) { const orig = K.innerHTML, col = K.style.color;   // надпись над хрустальным шаром (ep58)
  K.innerHTML = "ТОЛЯН · 16:"; K.style.color = "#ff6fae";
  const B = window.build; window.build = R => { B(R); R.tl.to(K, { opacity: 0, duration: .15 }, HEADT - .6);
    R.tl.set(K, { innerHTML: orig, color: col }, HEADT - .45); R.tl.to(K, { opacity: 1, duration: .15 }, HEADT - .4); }; } }
{ const K = document.querySelector("#skc"); if (K) { const [a, b] = K.children, orig = [a.textContent, b.textContent], bg = K.style.background, col = K.style.color;   // подпись судебного рисунка (ep57)
  a.textContent = "ТОЛЯН · 16:"; b.textContent = "ЖОРА МОТОРС ЧЕРЕЗ ДОРОГУ"; K.style.background = "#ff6fae"; K.style.color = "#151515";
  const B = window.build; window.build = R => { B(R); R.tl.to(K, { opacity: 0, duration: .15 }, HEADT - .6);
    R.tl.set(a, { textContent: orig[0] }, HEADT - .45).set(b, { textContent: orig[1] }, HEADT - .45).set(K, { background: bg, color: col }, HEADT - .45);
    R.tl.to(K, { opacity: 1, duration: .15 }, HEADT - .4); }; } }
{ const L = document.querySelector("#lbx"); if (L) { const B = window.build; window.build = R => { B(R);   // до склейки с основным видео (HEAD) рамка возвращается к исходной
  const bars = [L.querySelector(".lbt"), L.querySelector(".lbb")], col = ["#fff", "#ffd23f"];
  R.tl.to(bars, { opacity: 0, duration: .15 }, HEADT - .6);
  bars.forEach((el, i) => R.tl.set(el, { textContent: ORIG[i], background: "#000", color: col[i] }, HEADT - .45));
  R.tl.to(bars, { opacity: 1, duration: .15 }, HEADT - .4); }; } }
