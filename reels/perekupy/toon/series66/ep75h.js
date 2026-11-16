// «ДЕРЕВНЯ: ЗВЕРЬ, А НЕ МАШИНА» (ep75, киношный формат ../cine.js, отдельный ролик, с матом — владелец 15.11; в облачках — со звёздочками).
// ОБЛОЖКА: внук с ботом (Прадо −9%) + плашка → д. Грязево: «проверим зверя» (куры) → лужа: грязь по двери, брызги → глубиномер «по двери»
// → «раздатка молчит» → трактор Митяя → трос → бампер уехал с трактором → бот: Прадо → «вот это зверь» → финал Лиса.
$("#title .a").textContent = E.rubric; $("#title .b").textContent = E.subtitle; $("#title .b").style.fontSize = "74px"; $("#tag span").textContent = "деревня";
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
const E2 = (p, x, foot, h, o = {}, pose = {}, extra = {}) => ch("perekup", spk(p, "ego"), x, foot, h, { ...EGO, ...o }, pose, extra);
const A = (p, x, foot, h, o = {}, pose = {}, extra = {}) => ch("perekup", spk(p, "art"), x, foot, h, { ...ART, ...o }, pose, extra);
const M = (p, x, foot, h, o = {}, pose = {}, extra = {}) => ch("perekup", spk(p, "mit"), x, foot, h, { ...MIT, ...o }, pose, extra);
const grp = (id, html, z = "") => `<div class="grp" id="${id}" style="position:absolute;left:0;top:0;width:1080px;height:1920px${z !== "" ? `;z-index:${z}` : ""}">${html}</div>`;
const SG_L = glow(540, 300, 420, "#ffffff", .2);
const LG_L = glow(540, 250, 460, "#ffffff", .15);
const DV_L = glow(540, 300, 420, "#fff6d0", .25);

// 1. обложка: внук с ботом
{ const H = HOLDPHONE("perekup", spk("ap", "art"), 540, 2090, 1680, ART, PRCARD(), { rim: "#ffffff", side: 1 });
  mount("s1", { bg: "selogryaz", farBlur: 8, mid: H.mid, lights: H.lights + SG_L }, { x: 540, y: 960, s: 1 }); }
// 2. д. Грязево: «проверим зверя»
mount("s2", { bg: "selogryaz", mid: grp("c2", car(NIVA, 330, 1600, 640, { z: 5, sheen: .4 }), 5) + E2("ea", 190, 1880, 860, {}, { armR: -60 }, { rim: "#ffffff", side: 1, z: 7 }) + HENS(640, 1700), lights: SG_L,
  bubbles: [{ id: "e0", p: "ea", html: "Ну, проверим<br><em>твоего зверя.</em>", fs: 48 }] }, { x: 540, y: 1150, s: 1.04 });
// 3. лужа: грязь поднимается
mount("s3", { bg: "lugkoleya", mid: grp("c3", car(NIVS, 200, 1640, 700, { z: 5, sheen: .3 }), 5) + MUD(1480) + SPLASH(100, 1300) + SPLASH(700, 1320, "sp2"), lights: LG_L }, { x: 540, y: 1150, s: 1.04 });
// 4. «по самые двери» + глубиномер
mount("s4", { bg: "lugkoleya", farBlur: 2, mid: E2("eb", 210, 1900, 880, { look: "o" }, { armL: 40, armR: -60 }, { rim: "#ffffff", side: 1, z: 7 }) + A("aa", 880, 1900, 780, {}, { armL: 50 }, { rim: "#ffffff", side: -1, z: 7 }) + MUD(1640, "md2", 9) + DEPTH(470, 1020), lights: LG_L,
  bubbles: [{ id: "e1", p: "eb", html: "Еб*ть-копать…<br><em>Грязь до дверей!</em>", fs: 40 }, { id: "a0", p: "aa", html: "Дед, а полный привод<br><em>ты включал?</em>", fs: 38 }] }, { x: 540, y: 1150, s: 1.04 });
// 5. «раздатка молчит»
mount("s5", { bg: "lugkoleya", farBlur: 4, mid: E2("ec", 540, 1960, 1050, {}, { armR: -100 }, { rim: "#ffffff", side: 1, z: 7 }) + MUD(1700, "md3", 9), lights: LG_L,
  bubbles: [{ id: "e2", p: "ec", html: "Включил.<br><em>А раздатка, с*ка, молчит.</em>", fs: 44 }] }, { x: 540, y: 1100, s: 1.06 });
// 6. трактор Митяя
mount("s6", { bg: "lugkoleya", farBlur: 2, mid: grp("tg6", TRACTOR(470, 1640, 600), 6) + M("ma", 330, 1900, 860, {}, { armR: -100 }, { rim: "#ffffff", side: 1, z: 8 }) + E2("ed", 120, 1920, 780, {}, {}, { z: 8 }) + MUD(1700, "md4", 9), lights: LG_L,
  bubbles: [{ id: "m0", p: "ma", html: "Егорыч, ты где<br><em>этот п*здец купил?</em>", fs: 38 }, { id: "e3", p: "ed", html: "У Жоры.<br><em>Сказал — зверь.</em>", fs: 38 }] }, { x: 540, y: 1150, s: 1.04 });
// 7. трос: «цепляй!»
mount("s7", { bg: "lugkoleya", mid: car(NIVS, -40, 1640, 560, { z: 5, sheen: .3 }) + MUD(1560) + grp("tg7", TRACTOR(600, 1640, 500, "tr2") + TOWROPE(505, 1545, 650, 1575), 6)
    + PIP(M("mb", 160, 640, 640, {}, {}, { z: 2 }), "pp7", "#ff7a1a", 680, 620), lights: LG_L,
  bubbles: [{ id: "m1", p: "mb", html: "Зверь — это я на тракторе.<br><em>Цепляй!</em>", fs: 40 }] }, { x: 540, y: 1150, s: 1.0 });
// 8. бампер уехал с трактором
mount("s8", { bg: "lugkoleya", mid: car(NIVS, -40, 1640, 560, { z: 5, sheen: .3 }) + MUD(1560) + grp("tg8", TRACTOR(760, 1640, 500, "tr3") + TOWROPE(745, 1580, 810, 1585, "rp2") + NBUMP(470, 1545), 6), lights: LG_L }, { x: 540, y: 1150, s: 1.0 });
mount("s8e", { bg: "lugkoleya", farBlur: 3, mid: car(NIVS, 480, 1560, 560, { z: 3, sheen: .3 }) + MUD(1560, "md5", 4) + E2("ee", 330, 1960, 1000, { look: "flat" }, { armR: -150 }, { rim: "#ffffff", side: 1, z: 10 }), lights: LG_L,
  bubbles: [{ id: "e4", p: "ee", html: "Ну, Жора…<br><em>найду я тебя, мать твою.</em>", fs: 42 }] }, { x: 540, y: 1100, s: 1.04 });
// 9. бот: Прадо
{ const H = HOLDPHONE("perekup", spk("aph", "art"), 540, 2000, 1400, ART, PRCARD("pcc2"), { rim: "#fff6d0", side: 1 });
  mount("s9", { bg: "dvoregorych", farBlur: 5, mid: grp("h9", H.mid, 20), lights: H.lights + DV_L,
    bubbles: [{ id: "a1", p: "aph", html: "Дед, нашёл Тойоту Прадо!<br><em>Полный привод, один хозяин.</em>", fs: 38 }] }, { x: 540, y: 1000, s: 1.02 }); }
// 10. «вот это зверь»
mount("s10", { bg: "dvoregorych", mid: grp("c10", car(PRADO, 240, 1680, 680, { z: 5, sheen: .5 }), 5) + E2("ef", 160, 1900, 820, { look: "o" }, { armR: -150 }, { rim: "#fff6d0", side: 1, z: 7 }) + A("ab", 940, 1900, 760, {}, {}, { rim: "#fff6d0", side: -1, z: 7 }) + HENS(380, 1760, "hn2"), lights: DV_L,
  bubbles: [{ id: "e5", p: "ef", html: "Оху*ть.<br><em>Вот это зверь.</em>", fs: 50 }] }, { x: 540, y: 1150, s: 1.04 });
// 11. карточка бота
mount("s11", { bg: "dvoregorych", over: CTA75.replace('<div style="position:absolute;', '<div id="cta" style="opacity:0;position:absolute;'), lights: DV_L }, { x: 540, y: 1000, s: .98 });

$("#end h2").innerHTML = E.end;

window.build = R => {
  const tl = R.tl;
  const { pop } = common(R, { shake: 0 });
  for (const el of Object.values(SC)) {
    el.sheens = [...el.querySelectorAll(".sheen")];
    el.glows = [...el.querySelectorAll(".lights .glow")].map(g => ({ g, o: +g.style.opacity }));
  }
  const talk = (lv, f) => lv > .28 && !(lv < .55 && f % 3 === 2);
  const MOOD = { eb: "o", ef: "o", ec: "flat", ee: "flat", ed: "flat" };
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
    // куры клюют (качаются)
    document.querySelectorAll('[id^="hn"]').forEach((h, j) => { if (!h.dataset.run) h.style.transform = `rotate(${(Math.sin(t * 5 + j * 2) * 8).toFixed(1)}deg)`; });
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

  // 1. обложка: плашка видна с первого кадра и гаснет к 1,6 с; карточка бота — с кадра 0
  gsap.set(SC.s1, { opacity: 1 }); SC.s1.style.display = "";
  gsap.set("#cnt", { opacity: 0 });
  tl.set(SC.s1, { opacity: 1 }, 0); tl.to("#title", { opacity: 0, y: -50, duration: .25 }, 1.6);
  move("s1", { s: 1.06, y: 1000 }, 0, 3, "none");
  tl.fromTo("#pcc", { scale: 1 }, { scale: 1.06, duration: .15, yoyo: true, repeat: 1, ease: "power2.out", immediateRender: false }, 1.9); R.sfx("ping", 1.9, .6);
  // 2. Грязево: «Нива» подъезжает, куры разбегаются
  const SW2 = Math.max(2.4, Wd("l0", "дед", .3) - .3); swap("s1", "s2", SW2); move("s2", { s: 1.1 }, SW2, en.e0 - SW2 + .3, "none");
  tl.fromTo("#c2", { x: 900 }, { x: 0, duration: 1.4, ease: "power2.out", immediateRender: true }, SW2 + .2);
  [0, 1, 2].forEach(k => tl.to(`#hn${k}`, { x: 400 + k * 80, y: -40 * k, duration: .8, ease: "power2.in", onStart: () => { const h = document.getElementById(`hn${k}`); if (h) h.dataset.run = 1; } }, SW2 + .9 + k * .1));
  R.sfx("bleep", SW2 + .95, .15); bub("e0", st.l1 - .2);
  // 3. лужа: «Нива» въезжает и тонет по двери
  const SW3 = st.l1 - .3; swap("s2", "s3", SW3); move("s3", { s: 1.1 }, SW3, en.l1 - SW3 + .6, "none");
  tl.fromTo("#c3", { x: -700 }, { x: 0, duration: 1.1, ease: "power2.out", immediateRender: true }, SW3 + .1);
  tl.fromTo("#md", { y: 260 }, { y: 0, duration: .9, ease: "power2.out", immediateRender: true }, SW3 + .9);
  ["#sp", "#sp2"].forEach((s, k) => tl.fromTo(s, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: .3, ease: "back.out(2.5)", immediateRender: true }, SW3 + 1.0 + k * .1));
  R.sfx("clack", SW3 + 1.0, .6);
  // 4. «по самые двери» — стрелка глубиномера поднимается
  cut("s3", "s4", st.e1 - .2); move("s4", { s: 1.08 }, st.e1 - .2, en.a0 - st.e1 + .4, "none"); bub("e1", st.a0 - .1); bub("a0", st.e2 - .2);
  tl.fromTo("#dpp", { y: 0 }, { y: -215, duration: .9, ease: "power2.out", immediateRender: true }, Wd("e1", "двер", .6) - .6); R.sfx("ping", Wd("e1", "двер", .6), .5);
  // 5. «раздатка молчит»
  cut("s4", "s5", st.e2 - .2); move("s5", { s: 1.14 }, st.e2 - .2, en.e2 - st.e2 + .4, "none"); bub("e2", st.l2 - .2);
  // 6. трактор подъезжает
  const SW6 = st.l2 - .3; swap("s5", "s6", SW6); move("s6", { s: 1.08 }, SW6, en.e3 - SW6 + .4, "none");
  tl.fromTo("#tg6", { x: 700 }, { x: 0, duration: 1.4, ease: "power2.out", immediateRender: true }, SW6 + .1);
  bub("m0", st.e3 - .1); bub("e3", st.m1 - .2);
  // 7. трос натягивается
  cut("s6", "s7", st.m1 - .2); move("s7", { s: 1.1 }, st.m1 - .2, en.m1 - st.m1 + .4, "none"); bub("m1", st.l3 - .2);
  tl.fromTo("#pp7", { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: .3, ease: "back.out(2)", immediateRender: true }, st.m1 - .1);
  tl.fromTo("#tg7", { x: 0 }, { x: 16, duration: .1, yoyo: true, repeat: 5, ease: "none", immediateRender: false }, en.m1 - .2);
  // 8. трактор уезжает с бампером
  const SW8 = st.l3 - .25; cut("s7", "s8", SW8); move("s8", { s: 1.05 }, SW8, en.l3 - SW8 + .4, "none");
  tl.fromTo("#tg8", { x: 0 }, { x: 700, duration: Math.max(2.4, en.l3 - SW8 - .2), ease: "power1.in", immediateRender: true }, SW8 + .3); R.sfx("clack", SW8 + .4, .8);
  tl.fromTo("#nb", { rotation: 0 }, { rotation: -12, duration: .2, ease: "power2.out", immediateRender: true }, SW8 + .4);
  cut("s8", "s8e", st.e4 - .2); move("s8e", { s: 1.1 }, st.e4 - .2, en.e4 - st.e4 + .4, "none"); bub("e4", st.l4 - .2);
  // 9. бот: Прадо
  const SW9 = st.l4 - .25; swap("s8e", "s9", SW9); move("s9", { s: 1.08 }, SW9, en.a1 - SW9 + .4, "none");
  tl.fromTo("#pcc2", { scale: 1 }, { scale: 1.07, duration: .15, yoyo: true, repeat: 1, ease: "power2.out", immediateRender: false }, Wd("a1", "прад", .2)); R.sfx("ping", Wd("a1", "прад", .2), .8);
  bub("a1", st.e5 - .2);
  // 10–11. «вот это зверь» → финальная фраза Лиса → карточка
  const SW10 = st.e5 - .35, SW11 = Math.min(st.l5 + 2.2, en.l5 - 2.5);
  swap("s9", "s10", SW10); move("s10", { s: 1.08 }, SW10, SW11 - SW10 + .5, "none"); bub("e5", st.l5 + .3);
  tl.fromTo("#c10", { x: -900 }, { x: 0, duration: 1.0, ease: "power3.out", immediateRender: true }, SW10 + .05);
  swap("s10", "s11", SW11); tl.to("#tag", { opacity: 0, duration: .2 }, SW11);
  tl.fromTo("#cta", { opacity: 0, y: 80, scale: .9 }, { opacity: 1, y: 0, scale: 1, duration: .4, ease: "back.out(1.6)", immediateRender: false }, SW11 + .6);
  ending(R, en.l5 + .3);
};

// ── ep75h «Пастель»: быстрая уникализация — меняется только заставка ──
$("#title .a").textContent = "ТРАКТОРИСТ:"; $("#title .a").style.cssText = "font-size:110px;background:#ff6fae;color:#151515";
$("#title .b").textContent = "ЗВЕРЬ — ЭТО Я"; $("#title .b").style.cssText = "font-size:60px;background:#151515;color:#ff6fae";
const ORIG = [...document.querySelectorAll("#lbx .lbt, #lbx .lbb")].map(e => e.textContent), HEADT = 2.4;
{ const L = document.querySelector("#lbx"); if (L) { const a = L.querySelector(".lbt"), b = L.querySelector(".lbb");   // кинорамка вместо плашки (ep56)
  a.textContent = "ТРАКТОРИСТ:"; b.textContent = "ЗВЕРЬ — ЭТО Я"; a.style.background = b.style.background = "#ff6fae"; a.style.color = b.style.color = "#151515"; } }
{ const K = document.querySelector("#ballc"); if (K) { const orig = K.innerHTML, col = K.style.color;   // надпись над хрустальным шаром (ep58)
  K.innerHTML = "ТРАКТОРИСТ:"; K.style.color = "#ff6fae";
  const B = window.build; window.build = R => { B(R); R.tl.to(K, { opacity: 0, duration: .15 }, HEADT - .6);
    R.tl.set(K, { innerHTML: orig, color: col }, HEADT - .45); R.tl.to(K, { opacity: 1, duration: .15 }, HEADT - .4); }; } }
{ const K = document.querySelector("#skc"); if (K) { const [a, b] = K.children, orig = [a.textContent, b.textContent], bg = K.style.background, col = K.style.color;   // подпись судебного рисунка (ep57)
  a.textContent = "ТРАКТОРИСТ:"; b.textContent = "ЗВЕРЬ — ЭТО Я"; K.style.background = "#ff6fae"; K.style.color = "#151515";
  const B = window.build; window.build = R => { B(R); R.tl.to(K, { opacity: 0, duration: .15 }, HEADT - .6);
    R.tl.set(a, { textContent: orig[0] }, HEADT - .45).set(b, { textContent: orig[1] }, HEADT - .45).set(K, { background: bg, color: col }, HEADT - .45);
    R.tl.to(K, { opacity: 1, duration: .15 }, HEADT - .4); }; } }
{ const L = document.querySelector("#lbx"); if (L) { const B = window.build; window.build = R => { B(R);   // до склейки с основным видео (HEAD) рамка возвращается к исходной
  const bars = [L.querySelector(".lbt"), L.querySelector(".lbb")], col = ["#fff", "#ffd23f"];
  R.tl.to(bars, { opacity: 0, duration: .15 }, HEADT - .6);
  bars.forEach((el, i) => R.tl.set(el, { textContent: ORIG[i], background: "#000", color: col[i] }, HEADT - .45));
  R.tl.to(bars, { opacity: 1, duration: .15 }, HEADT - .4); }; } }
