// «ТОЛЯН · 20: ПОДСТАВА» (ep81) — сезон «Свой автосалон», без мата.
// ОБЛОЖКА (Камри за 790 без процента) → кухня: «даже бот процент не поставил» → видеосвязь с Лёхой → вставка-мышеловка (дуга захлопывается)
// → гаражи на Заводской: Камри, Вадик «деньги сразу» → «документы сейчас» / «документы дома» → входящий «ДЯДЯ ЖОРА» → «он не ведётся!»
// → бот: две настоящие карточки → «пятнашка» и Элантра на площадке, 5 → 7/10 → Римма: «двойная аренда, неделя» → Толян: «хватит» → финал.
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
const V = (p, x, foot, h, o = {}, pose = {}, extra = {}) => ch("perekup", spk(p, "vadik"), x, foot, h, { ...VADIK, ...o }, pose, extra);
const Z = (p, x, foot, h, o = {}, pose = {}, extra = {}) => ch("perekup", p, x, foot, h, { ...ZHORA, ...o }, pose, extra);
const L = (p, x, foot, h, o = {}, pose = {}, extra = {}) => LEHA(ch("perekup", spk(p, "leha"), x, foot, h, { ...LEHA_O, ...o }, pose, extra));
const grp = (id, html, z = "") => `<div class="grp" id="${id}" style="position:absolute;left:0;top:0;width:1080px;height:1920px${z !== "" ? `;z-index:${z}` : ""}">${html}</div>`;
const UL = glow(700, 640, 520, "#ffd8a0", .28), GL = glow(645, 1000, 460, "#ffe7a0", .3), OL = glow(780, 480, 520, "#ffffff", .2), VL = glow(540, 500, 520, "#ffc890", .2);
const CTA81 = CTA.replace('<div style="position:absolute;', '<div id="cta" style="opacity:0;position:absolute;');

// 1. обложка: Толян с ботом — Камри за 790 без процента
{ const H = HOLDPHONE("tolyan", spk("ta", "tolyan"), 540, 2090, 1680, {}, CAMCARD(), { rim: "#ffffff", side: 1 });
  mount("s1", { bg: "utrotolyana", farBlur: 8, mid: H.mid, lights: H.lights + UL }, { x: 540, y: 960, s: 1 }); }
// 2. кухня: «даже бот процент не поставил»
mount("s2", { bg: "utrotolyana", mid: T("tb", 400, 1900, 900, { armR: -110 }, { rim: "#fff", side: 1, z: 7 }), lights: UL,
  bubbles: [{ id: "t0", p: "tb", html: "При рынке почти два миллиона?<br><em>Даже бот процент не поставил.</em>", fs: 38 }] }, { x: 540, y: 1150, s: 1.02 });
// 3. видеосвязь: Толян | Лёха в «Роллс-Ройсе»
{ const o = SPLIT2("utrotolyana", T("tc", 540, 1950, 980, { armR: -150 }, { rim: "#fff", side: 1, z: 7 }), "rollssalon", L("la", 540, 1950, 980, {}, { armL: -40 }, { rim: "#bfc8ff", side: -1, z: 7 }));
  CINE.ANCH.la = [813, CINE.ANCH.la[1], CINE.ANCH.la[2]]; CINE.ANCH.tc = [267, CINE.ANCH.tc[1], CINE.ANCH.tc[2]];
  mount("i1", { bg: "utrotolyana", over: o,
    bubbles: [{ id: "x0", p: "la", html: "Бесплатный сыр —<br><em>только в мышеловке.</em>", fs: 34 }, { id: "x0b", p: "la", html: "Езжай, но денег<br><em>с собой не бери.</em>", fs: 34 },
              { id: "t1", p: "tc", html: "Понял. Еду<br><em>с пустыми карманами.</em>", fs: 34 }] }, { x: 540, y: 960, s: 1 }); }
// 4. вставка: мышеловка с ключом от «Тойоты»
mount("i2", { bg: "utrotolyana", over: MOUSETRAP() }, { x: 540, y: 960, s: 1 });
// 5. гаражи: Камри и Вадик
mount("s3", { bg: "garazhizavodskaya", mid: grp("cg0", car(CAM, -80, 1660, 820, { z: 5, sheen: .4 }), 5) + V("va", 820, 1910, 840, {}, { armR: -60 }, { rim: "#ffe7a0", side: -1, z: 8 }) + DUP(905, 1390), lights: GL,
  bubbles: [{ id: "v0", p: "va", html: "Деньги сразу, документы потом.<br><em>Ещё трое едут!</em>", fs: 36 }] }, { x: 540, y: 1150, s: 1.02 });
// 6. «документы сейчас» — «документы дома»
mount("s4", { bg: "garazhizavodskaya", mid: T("td", 280, 1910, 880, { armL: 60, armR: 60 }, { rim: "#ffe7a0", side: 1, z: 8 }) + V("vb", 820, 1910, 840, {}, {}, { rim: "#ffe7a0", side: -1, z: 8 }) + DUP(905, 1390, "dup2"), lights: GL,
  bubbles: [{ id: "t2", p: "td", html: "Документы сейчас —<br><em>деньги потом.</em>", fs: 40 }, { id: "v1", p: "vb", html: "Документы… дома.<br><em>В другом городе.</em>", fs: 38 }] }, { x: 540, y: 1150, s: 1.02 });
// 7. вставка: входящий «ДЯДЯ ЖОРА»
mount("i3", { bg: "garazhizavodskaya", over: CALL(Z("zav", 150, 420, 380, { look: "grin" }, {}, { z: 2 })) }, { x: 540, y: 960, s: 1 });
// 8. «он не ведётся!» — «передай дяде привет»
mount("s5", { bg: "garazhizavodskaya", mid: T("te", 210, 1910, 880, {}, { rim: "#ffe7a0", side: 1, z: 8 }) + V("vc", 740, 1910, 840, { item: "phone" }, { armR: -150 }, { rim: "#ffe7a0", side: -1, z: 8 }) + DUP(825, 1390, "dup3"), lights: GL,
  bubbles: [{ id: "v2", p: "vc", html: "Дядя Жора,<br><em>он не ведётся!</em>", fs: 42 }, { id: "t3", p: "te", html: "Передай<br><em>дяде привет.</em>", fs: 40 }] }, { x: 540, y: 1150, s: 1.02 });
// 9. бот: две настоящие карточки
mount("i4", { bg: "ploshchadkavecher", over: TWOCARDS3() + PIP(T("tf", 160, 640, 640, {}, { z: 2 }), "pp1", "#ffd23f", 60, 1580) }, { x: 540, y: 960, s: 1 });
// 10. «пятнашка» и Элантра на площадке: 7/10
mount("s6", { bg: "ploshchadkavecher", mid: SIGN77(240, 600) + grp("cg1", car(V15, -70, 1640, 640, { z: 5, sheen: .4 }), 5) + grp("cg2", car(ELA, 470, 1720, 620, { z: 6, sheen: .4 }), 6), lights: VL }, { x: 540, y: 1150, s: 1.02 });
// 11. Римма: «двойная аренда, неделя»
mount("s7", { bg: "ofisrimmy", mid: RI("ra", 560, 1900, 900, { armL: -40 }, { rim: "#fff", side: -1, z: 7 }), lights: OL,
  bubbles: [{ id: "r0", p: "ra", html: "Жора предложил мне двойную аренду, Анатолий.<br><em>У вас неделя.</em>", fs: 34 }] }, { x: 540, y: 1100, s: 1.03 });
// 12. Толян крупно: «Неделя? Хватит.»
mount("s8", { bg: "ploshchadkavecher", farBlur: 6, mid: T("tg", 540, 2150, 1500, {}, { rim: "#fff", side: 1, z: 8 }), lights: VL,
  bubbles: [{ id: "t4", p: "tg", html: "Неделя?<br><em>Хватит.</em>", fs: 56 }] }, { x: 540, y: 1000, s: 1.04 });
// 13. карточка бота
mount("s9", { bg: "ploshchadkavecher", farBlur: 6, over: CTA81, lights: VL }, { x: 540, y: 1000, s: .98 });

$(".stage").insertAdjacentHTML("beforeend", CNT77("45 000", 5));
$("#end h2").innerHTML = E.end;

window.build = R => {
  const tl = R.tl;
  const { pop } = common(R, { shake: 0 });
  for (const el of Object.values(SC)) {
    el.sheens = [...el.querySelectorAll(".sheen")];
    el.glows = [...el.querySelectorAll(".lights .glow")].map(g => ({ g, o: +g.style.opacity }));
  }
  const talk = (lv, f) => lv > .28 && !(lv < .55 && f % 3 === 2);
  const MOOD = { vb: "o", vc: "o", tg: "flat" };
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
  const jolt = (n, at) => tl.fromTo(SC[n], { x: -18 }, { x: 0, duration: .35, ease: "elastic.out(1.4, .3)", immediateRender: false }, at);

  // 1. обложка: плашка с кадра 0, гаснет к 1,6 с; на «Камри» карточка вздрагивает
  gsap.set(SC.s1, { opacity: 1 }); SC.s1.style.display = "";
  gsap.set(["#cnt", "#cnt77"], { opacity: 0 });
  tl.set(SC.s1, { opacity: 1 }, 0); tl.to("#title", { opacity: 0, y: -50, duration: .25 }, 1.6);
  push("s1", 0, en.l0 + .3, { s: 1.1, y: 1040 });
  const CAMR = Wd("l0", "камри", .45);
  tl.fromTo("#cmc", { scale: 1 }, { scale: 1.07, duration: .15, yoyo: true, repeat: 1, ease: "power2.out", immediateRender: false }, CAMR); R.sfx("ping", CAMR, .5);
  // 2. кухня: «даже бот процент не поставил»
  cut("s2", st.t0 - .2); cnt(true, st.t0); push("s2", st.t0 - .2, en.t0 - st.t0 + .5, { s: 1.08 }); bub("t0", st.x0 - .1);
  // 3. видеосвязь с Лёхой → мышеловка → обратно
  const SW3 = st.x0 - .3; swap("i1", SW3); cnt(false, SW3);
  const TRAP = Wd("x0", "мышелов", .45), BACK = Wd("x0", "езжай", .55);
  bub("x0", TRAP - .35);
  cut("i2", TRAP - .35); push("i2", TRAP - .35, BACK - TRAP + .4, { s: 1.06 });
  tl.fromTo("#trapbar", { scaleY: 1 }, { scaleY: -.22, duration: .12, ease: "power4.in", immediateRender: false }, TRAP + .15);
  R.sfx("clack", TRAP + .25, .9); R.sfx("boom", TRAP + .27, .4); jolt("i2", TRAP + .27);
  cut("i1", BACK - .15); pop("#b_x0b", BACK - .1, st.t1 - .1); bub("t1", st.l1 - .1);
  // 4. гаражи: Камри подкатывает, Вадик торопит
  const SW4 = st.l1 - .3; swap("s3", SW4); push("s3", SW4, en.v0 - SW4 + .5, { s: 1.08 });
  tl.fromTo("#cg0", { x: -900 }, { x: 0, duration: 1.2, ease: "power3.out", immediateRender: true }, SW4 + .2); R.sfx("rev", SW4 + .3, .5);
  tl.fromTo("#dup", { rotation: -12, y: 0 }, { rotation: -4, y: -14, duration: .5, yoyo: true, repeat: 3, ease: "sine.inOut", immediateRender: false }, st.v0);
  bub("v0", st.t2 - .1);
  // 5. «документы сейчас» — «документы… дома»
  cut("s4", st.t2 - .2); push("s4", st.t2 - .2, en.v1 - st.t2 + .5, { s: 1.08 }); bub("t2", st.v1 - .05); bub("v1", st.l2 - .05);
  bump("#dup2", Wd("v1", "дома", .4));
  // 6. входящий «ДЯДЯ ЖОРА»: телефон дрожит, кнопка пульсирует
  const SW6 = st.l2 - .3; swap("i3", SW6); push("i3", SW6, en.l2 - SW6 + .6, { s: 1.08 });
  const RING = Wd("l2", "зазвон", .6);
  tl.fromTo("#callok", { scale: 1 }, { scale: 1.18, duration: .25, yoyo: true, repeat: 7, ease: "sine.inOut", immediateRender: false }, RING - .2);
  tl.fromTo("#callav", { rotation: -4 }, { rotation: 4, duration: .06, yoyo: true, repeat: 15, ease: "none", immediateRender: false }, RING - .2);
  [0, .5, 1.0].forEach(d => R.sfx("ping", RING - .2 + d, .55));
  // 7. «он не ведётся!» — «передай дяде привет»
  cut("s5", st.v2 - .2); push("s5", st.v2 - .2, en.t3 - st.v2 + .6, { s: 1.08 }); bub("v2", st.t3 - .05); bub("t3", st.l3 - .1);
  jolt("s5", st.v2);
  // 8. бот: две настоящие карточки
  const SW8 = st.l3 - .3; swap("i4", SW8);
  tl.fromTo("#pp1", { scale: .5, opacity: 0 }, { scale: 1, opacity: 1, duration: .28, ease: "back.out(2)", immediateRender: true }, SW8 + .1);
  const C1 = Wd("l3", "пятнаш", .45), C2 = Wd("l3", "хен", .55);
  tl.fromTo("#v5c2", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: .3, ease: "back.out(2)", immediateRender: true }, C1 - .2); R.sfx("ping", C1 - .2, .7);
  tl.fromTo("#elc2", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: .3, ease: "back.out(2)", immediateRender: true }, C2 - .2); R.sfx("ping", C2 - .2, .7);
  // 9. машины на площадке: 5 → 7/10
  const SW9 = Wd("l3", "обе", .78) - .2; swap("s6", SW9); cnt(true, SW9 + .3); push("s6", SW9, en.l3 - SW9 + .6);
  tl.fromTo("#cg1", { x: -900 }, { x: 0, duration: 1.0, ease: "power3.out", immediateRender: true }, SW9 + .2);
  tl.fromTo("#cg2", { x: 1100 }, { x: 0, duration: 1.0, ease: "power3.out", immediateRender: true }, SW9 + .6); R.sfx("whoosh", SW9 + .2, .4); R.sfx("whoosh", SW9 + .6, .4);
  const SEV = Wd("l3", "семь", .9); tl.set("#cc", { textContent: "7" }, SEV); bump("#cnt77", SEV); R.sfx("clack", SEV, .7);
  // 10. Римма
  cut("s7", st.r0 - .2); cnt(false, st.r0 - .2); push("s7", st.r0 - .2, en.r0 - st.r0 + .5, { s: 1.08 }); bub("r0", st.t4 - .1);
  // 11. Толян крупно
  cut("s8", st.t4 - .2); push("s8", st.t4 - .2, en.t4 - st.t4 + .6, { s: 1.12 }); bub("t4", st.l4 + .4);
  // 12. финал: фраза Лиса → карточка
  const SW12 = Math.min(st.l4 + 2.2, en.l4 - 2.3);
  swap("s9", SW12); tl.to("#tag", { opacity: 0, duration: .2 }, SW12);
  tl.fromTo("#cta", { opacity: 0, y: 80, scale: .9 }, { opacity: 1, y: 0, scale: 1, duration: .4, ease: "back.out(1.6)", immediateRender: false }, SW12 + .5);
  ending(R, en.l4 + .3);
};

// ── ep81b «Архив»: быстрая уникализация — меняется только заставка ──
$("#title .a").textContent = "ТОЛЯН · 20:"; $("#title .a").style.cssText = "font-size:110px;background:#2f6db5;color:#fbfaf3";
$("#title .b").textContent = "ДЕНЬГИ СРАЗУ, ДОКУМЕНТЫ ПОТОМ"; $("#title .b").style.cssText = "font-size:60px;background:#fbfaf3;color:#2f6db5";
const ORIG = [...document.querySelectorAll("#lbx .lbt, #lbx .lbb")].map(e => e.textContent), HEADT = 2.4;
{ const L = document.querySelector("#lbx"); if (L) { const a = L.querySelector(".lbt"), b = L.querySelector(".lbb");   // кинорамка вместо плашки (ep56)
  a.textContent = "ТОЛЯН · 20:"; b.textContent = "ДЕНЬГИ СРАЗУ, ДОКУМЕНТЫ ПОТОМ"; a.style.background = b.style.background = "#2f6db5"; a.style.color = b.style.color = "#fbfaf3"; } }
{ const K = document.querySelector("#ballc"); if (K) { const orig = K.innerHTML, col = K.style.color;   // надпись над хрустальным шаром (ep58)
  K.innerHTML = "ТОЛЯН · 20:"; K.style.color = "#2f6db5";
  const B = window.build; window.build = R => { B(R); R.tl.to(K, { opacity: 0, duration: .15 }, HEADT - .6);
    R.tl.set(K, { innerHTML: orig, color: col }, HEADT - .45); R.tl.to(K, { opacity: 1, duration: .15 }, HEADT - .4); }; } }
{ const K = document.querySelector("#skc"); if (K) { const [a, b] = K.children, orig = [a.textContent, b.textContent], bg = K.style.background, col = K.style.color;   // подпись судебного рисунка (ep57)
  a.textContent = "ТОЛЯН · 20:"; b.textContent = "ДЕНЬГИ СРАЗУ, ДОКУМЕНТЫ ПОТОМ"; K.style.background = "#2f6db5"; K.style.color = "#fbfaf3";
  const B = window.build; window.build = R => { B(R); R.tl.to(K, { opacity: 0, duration: .15 }, HEADT - .6);
    R.tl.set(a, { textContent: orig[0] }, HEADT - .45).set(b, { textContent: orig[1] }, HEADT - .45).set(K, { background: bg, color: col }, HEADT - .45);
    R.tl.to(K, { opacity: 1, duration: .15 }, HEADT - .4); }; } }
{ const L = document.querySelector("#lbx"); if (L) { const B = window.build; window.build = R => { B(R);   // до склейки с основным видео (HEAD) рамка возвращается к исходной
  const bars = [L.querySelector(".lbt"), L.querySelector(".lbb")], col = ["#fff", "#ffd23f"];
  R.tl.to(bars, { opacity: 0, duration: .15 }, HEADT - .6);
  bars.forEach((el, i) => R.tl.set(el, { textContent: ORIG[i], background: "#000", color: col[i] }, HEADT - .45));
  R.tl.to(bars, { opacity: 1, duration: .15 }, HEADT - .4); }; } }
