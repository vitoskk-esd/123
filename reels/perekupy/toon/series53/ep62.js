// «ЧЁРНАЯ ПЯТНИЦА: СКИДКИ ОТ ЖОРЫ» (ep62, киношный формат ../cine.js, отдельный ролик). Сцены — как в утверждённой раскадровке board.html.
// ОБЛОЖКА (кадр 0, владелец 15.11: «как в истории с Толяном — человек держит телефон с ботом»): Марина с телефоном + плашка (гаснет к 1,6 с)
// → площадка ночью: неон зажигается по буквам, «всё за полцены!» → ценник ×2 → будка: «было — стало — минус 50» → утро: очередь из одного
// → Марина с калькулятором → калькулятор крупно → «вчера столько же» / «курс доллара!» → бот у Марины → «а скидка?» — «нашла раньше всех»
// → баннер гаснет, буква «Я» падает на капот RX-7 → «киберпонедельник» → финальная фраза Лиса про бот + карточка.
$("#title .a").textContent = E.rubric; $("#title .b").textContent = E.subtitle; $("#title .a").style.fontSize = "72px"; $("#title .b").style.fontSize = "104px"; $("#tag span").textContent = "чёрная пятница";
document.querySelector("#cam > svg#bg")?.remove();
const W = (line, pre, n = 0) => {
  const norm = s => s.toLowerCase().replace(/ё/g, "е").replace(/[^а-я0-9a-z]/g, "");
  const hits = (TT.words[line] || []).filter(w => w[1] >= st[line] - .7 && w[2] <= en[line] + .05 && norm(w[0]).startsWith(norm(pre)));
  if (!hits[n]) console.warn("W miss", line, pre);
  return hits[n] ? Math.max(hits[n][1], st[line] - .05) : st[line];
};
const G = (id, html, z = 5) => `<div class="grp" id="${id}" style="left:0;top:0;width:1080px;height:1920px;z-index:${z}">${html}</div>`;
const root = $("#scene"), SC = {}, SPK = {};
const mount = (name, def, sh) => (SC[name] = C.mount(root, def, sh));
const spk = (p, v) => (SPK[p] = v, p);
const Z = (p, x, foot, h, o = {}, pose = {}, extra = {}) => ch("perekup", spk(p, "zhora"), x, foot, h, { ...ZHORA, ...o }, pose, extra);
const MR = (p, x, foot, h, pose = {}, extra = {}) => MRC(ch("vika", spk(p, "marina"), x, foot, h, null, pose, extra));
const BF_L = glow(540, 560, 420, "#ff3bd0", .3) + glow(40, 750, 160, "#fff6c8", .5) + glow(600, 750, 160, "#fff6c8", .5);
const BU_L = glow(200, 560, 380, "#fff2c8", .45);
const BK_L = glow(760, 700, 300, "#ffe8a8", .5) + glow(770, 340, 220, "#ff3bd0", .3);
const CALCMINI = `<svg viewBox="0 0 80 100" style="overflow:visible"><rect x="4" y="4" width="72" height="92" rx="10" fill="#2b2f37" stroke="#151515" stroke-width="5"/><rect x="12" y="12" width="56" height="20" rx="4" fill="#b9d4a6"/>${[0, 1, 2].map(j => [0, 1, 2].map(i => `<rect x="${12 + i * 20}" y="${40 + j * 18}" width="14" height="12" rx="3" fill="#e8e6ef"/>`).join("")).join("")}</svg>`;

// 1. обложка: Марина с ботом
{ const H = HOLDPHONE("vika", spk("mr", "marina"), 540, 2090, 1680, null, VSCARD(), { rim: "#ffd9b8", side: 1 });
  mount("s1", { bg: "bfutro", grade: "dawn", farBlur: 8, mid: MRC(H.mid), lights: H.lights + BU_L }, { x: 540, y: 960, s: 1 }); }
// 2. площадка ночью: неон, Веста и RX-7, «всё за полцены!»
mount("s2", { bg: "blackfriday", farBlur: 1, far: BANNER("bn"), mid: car(RX7, 470, 1560, 600, { z: 3, sheen: .5 }) + car(VESTA, -60, 1720, 620, { z: 5, sheen: .5 }) + Z("za", 560, 1820, 820, { look: "grin" }, { armL: -150 }, { rim: "#ff7ae6", side: -1, z: 7 }), lights: BF_L,
  bubbles: [{ id: "z1", p: "za", html: "Чёрная пятница!<br><em>Всё — за полцены!</em>", fs: 48 }] }, { x: 540, y: 1100, s: 1.02 });
// 3. ценник ×2
mount("s3", { far: PRICETAG(), farBlur: 0 }, { x: 540, y: 960, s: 1 });
// 4. будка: «было — стало»
mount("s4", { bg: "budkazhory", grade: "warm", farBlur: 3, mid: Z("zb", 480, 1900, 1000, { look: "grin" }, { armR: -60 }, { rim: "#ffe8a8", side: 1, z: 7 }) + INHAND(480, 1900, 1000, -60, 180, MARKER, 9, 0, "mkr"), lights: BK_L,
  bubbles: [{ id: "z2", p: "zb", html: "Было миллион пятьдесят — стало два сто!<br><em>А теперь — минус пятьдесят!</em>", fs: 40 }] }, { x: 540, y: 1150, s: 1.06 });
// 5. утро: очередь из одного
mount("s5", { bg: "bfutro", grade: "dawn", farBlur: 1, mid: MR("mc0", 540, 1520, 420, {}, { z: 6 }) + TUMBLE(1100, 1420), lights: BU_L }, { x: 540, y: 1100, s: 1.02 });
// 6. Марина с калькулятором; Жора: «считайте!»
mount("s6", { bg: "bfutro", grade: "dawn", farBlur: 6, mid: MR("mc", 520, 1900, 1000, { armR: -60 }, { rim: "#ffd9b8", side: 1, z: 7 }) + INHAND(520, 1900, 1000, -60, 150, CALCMINI, 9), lights: BU_L,
  bubbles: [{ id: "m1", p: "mc", html: "Веста со скидкой?<br><em>Я бухгалтер. Я посчитаю.</em>", fs: 44 }] }, { x: 540, y: 1150, s: 1.08 });
mount("s6b", { bg: "bfutro", grade: "dawn", farBlur: 3, mid: Z("zc", 540, 1900, 1000, { look: "grin" }, { armL: 40 }, { rim: "#ffd9b8", side: 1, z: 7 }), lights: BU_L,
  bubbles: [{ id: "z1b", p: "zc", html: "Считайте, считайте!<br><em>Скидка самая настоящая!</em>", fs: 44 }] }, { x: 540, y: 1150, s: 1.1 });
// 7. калькулятор крупно
mount("s7", { far: CALC(), farBlur: 0 }, { x: 540, y: 960, s: 1 });
// 8. «вчера столько же» — «курс доллара!»
mount("s8", { bg: "bfutro", grade: "dawn", farBlur: 3, mid: MR("md", 300, 1820, 860, { armR: -60 }, { rim: "#ffd9b8", side: 1, z: 7 }) + INHAND(300, 1820, 860, -60, 130, CALCMINI, 9) + Z("zd", 790, 1820, 880, { look: "o" }, {}, { rim: "#ffd9b8", side: -1, z: 7 }) + SWEAT(880, 1060), lights: BU_L,
  bubbles: [{ id: "m2", p: "md", html: "Миллион пятьдесят.<br><em>Вчера — столько же, без скидки.</em>", fs: 40 }, { id: "z3", p: "zd", html: "Это…<br><em>курс доллара вырос!</em>", fs: 48 }] }, { x: 540, y: 1180, s: 1.05 });
// 9. бот у Марины
{ const H = HOLDPHONE("vika", spk("me", "marina"), 380, 1960, 1250, null, VSCARD().replace('id="vcc"', 'id="vcc2"'), { rim: "#ffd9b8", side: 1 });
  mount("s9", { bg: "bfutro", grade: "dawn", farBlur: 5, mid: MRC(H.mid) + Z("ze", 860, 1800, 900, { look: "o" }, {}, { z: 5 }), lights: H.lights + BU_L,
    bubbles: [{ id: "m3", p: "me", html: "А мне бот прислал такую же —<br><em>девятьсот двадцать.</em>", fs: 40 }] }, { x: 560, y: 1080, s: 1.05 }); }
// 10. «а скидка?» — «нашла раньше всех»
mount("s10", { bg: "bfutro", grade: "dawn", farBlur: 3, mid: Z("zf", 300, 1820, 880, { look: "o" }, { armR: -100 }, { rim: "#ffd9b8", side: 1, z: 7 }) + MR("mf", 820, 1800, 840, {}, { rim: "#ffd9b8", side: -1, z: 7 }), lights: BU_L,
  bubbles: [{ id: "z4", p: "zf", html: "Женщина,<br><em>а как же скидка?!</em>", fs: 46 }, { id: "m4", p: "mf", html: "Скидка — это когда<br><em>нашла раньше всех.</em>", fs: 44 }] }, { x: 540, y: 1180, s: 1.05 });
// 11. баннер гаснет, буква падает на RX-7
mount("s11", { bg: "blackfriday", farBlur: 1, far: BANNER("bn2"), mid: car(RX7, -20, 1700, 680, { z: 4, sheen: .5 }) + NEONCHAR(150, 1300, "Я", "nch", 16) + SPARKS(240, 1440)
  + Z("zg", 850, 1840, 900, { look: "o" }, { armR: -100 }, { rim: "#ff7ae6", side: -1, z: 7 }), lights: BF_L,
  bubbles: [{ id: "z5", p: "zg", html: "Только не<br><em>на Мазду!</em>", fs: 54 }, { id: "z6", p: "zg", html: "Ладно.<br><em>Перенесу на киберпонедельник.</em>", fs: 44 }] }, { x: 540, y: 900, s: 1.1 });
// 12. карточка бота
mount("s12", { bg: "blackfriday", over: CTA62.replace('<div style="position:absolute;', '<div id="cta" style="opacity:0;position:absolute;'), lights: BF_L }, { x: 540, y: 1000, s: .98 });

$("#end h2").innerHTML = E.end;

window.build = R => {
  const tl = R.tl;
  const { pop } = common(R, { shake: 0 });
  for (const el of Object.values(SC)) {
    el.sheens = [...el.querySelectorAll(".sheen")];
    el.glows = [...el.querySelectorAll(".lights .glow")].map(g => ({ g, o: +g.style.opacity }));
  }
  const talk = (lv, f) => lv > .28 && !(lv < .55 && f % 3 === 2);
  const MOOD = { zd: "o", ze: "o", zf: "o", zg: "o", mc0: "flat" };
  // калькулятор: что на дисплее в каждый момент
  const C0 = W("l3", "кальк"), CSEQ = [[0, "2100000"], [C0 + .3, "2100000×"], [C0 + .7, "0,5"], [C0 + 1.1, "1050000"]];
  const disp = document.getElementById("calcd");
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
    disp.textContent = CSEQ.filter(([a]) => t >= a).pop()[1];
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
  const ping = (sel, at, snd = "clack", sc = 1.7) => { gsap.set(sel, { opacity: 0 }); tl.fromTo(sel, { opacity: 0, scale: sc }, { opacity: 1, scale: 1, duration: .2, ease: "back.out(2)", immediateRender: false }, at); if (snd) R.sfx(snd, at, .6); };
  const wipe = (sel, at, d = .4, snd = "type") => { gsap.set(sel, { clipPath: "inset(-20% 100% -20% -5%)" }); tl.to(sel, { clipPath: "inset(-20% -5% -20% -5%)", duration: d, ease: "none" }, at); if (snd) R.sfx(snd, at, .5); };

  // 1. обложка: плашка видна с первого кадра и гаснет к 1,6 с
  gsap.set(SC.s1, { opacity: 1 }); SC.s1.style.display = "";
  gsap.set("#cnt", { opacity: 0 });
  show("s1", 0); tl.to("#title", { opacity: 0, y: -50, duration: .25 }, 1.6);
  move("s1", { s: 1.06, y: 1000 }, 0, en.l0 + .4, "none");
  tl.fromTo("#vcc", { scale: 1 }, { scale: 1.06, duration: .15, yoyo: true, repeat: 1, ease: "power2.out", immediateRender: false }, W("l0", "черн")); R.sfx("ping", W("l0", "черн"), .6);   // карточка видна с кадра 0
  // 2. неон зажигается по буквам → «всё за полцены!»
  const SW2 = st.z1 - .7; swap("s1", "s2", SW2); move("s2", { s: 1.08 }, SW2, en.z1 - SW2 + .4, "none");
  const BL = [...Array(14).keys()].map(k => `#bnc${k}`);
  gsap.set(BL, { opacity: .08 }); BL.forEach((s, k) => tl.to(s, { opacity: 1, duration: .03 }, SW2 + .45 + k * .05)); R.sfx("bleep", SW2 + .45, .05); R.sfx("pop", SW2 + 1.1, .5);
  bub("z1", st.l1 - .2);
  // 3. ценник ×2: старая цена зачёркнута, новая маркером, звезда «−50%»
  const SW3 = st.l1 - .2; swap("s2", "s3", SW3); move("s3", { s: 1.08 }, SW3, en.l1 - SW3 + .6, "none");
  wipe("#ptx", W("l1", "подн"), .35, "swish"); wipe("#pt1", W("l1", "два"), .5, "type");
  gsap.set("#pt2", { opacity: 0 }); tl.fromTo("#pt2", { opacity: 0, scale: 2.2, rotation: -30 }, { opacity: 1, scale: 1, rotation: 0, duration: .22, ease: "back.out(2)", immediateRender: false }, en.l1 + .05); R.sfx("impact", en.l1 + .1, .6);
  // 4. будка: «было — стало»
  cut("s3", "s4", st.z2 - .2); move("s4", { s: 1.16 }, st.z2 - .2, en.z2 - st.z2 + .4, "none"); bub("z2", st.l2 - .3);
  tl.fromTo("#mkr", { rotation: 0 }, { rotation: -14, duration: .1, yoyo: true, repeat: 5, ease: "none", immediateRender: false }, W("z2", "стало"));
  // 5. утро: очередь из одного, перекати-поле
  const SW5 = st.l2 - .3; swap("s4", "s5", SW5); move("s5", { s: 1.14, y: 1250 }, SW5, en.l2 - SW5 + .4, "none");
  tl.fromTo("#tw", { x: 0, rotation: 0 }, { x: -1300, rotation: -540, duration: 3.2, ease: "none", immediateRender: false }, W("l2", "очеред") - .3); R.sfx("whoosh", W("l2", "очеред"), .4);
  // 6. Марина с калькулятором → Жора: «считайте!»
  cut("s5", "s6", st.m1 - .2); move("s6", { s: 1.16 }, st.m1 - .2, en.m1 - st.m1 + .4, "none"); bub("m1", st.z1b - .1);
  cut("s6", "s6b", st.z1b - .1); move("s6b", { s: 1.18 }, st.z1b - .1, en.z1b - st.z1b + .4, "none"); bub("z1b", st.l3 - .2);
  // 7. калькулятор: клавиши и лента
  const SW7 = st.l3 - .2; swap("s6b", "s7", SW7); move("s7", { s: 1.05 }, SW7, en.l3 - SW7 + .4, "none");
  [.3, .55, .7, .9, 1.1].forEach(d => R.sfx("tap", C0 + d, .7));
  wipe("#ct0", C0 + .2, .3, null); wipe("#ct1", C0 + .7, .3, null); wipe("#ct2", C0 + 1.1, .35, null); wipe("#ct3", W("l3", "не") , .5, "type");
  // 8. «вчера — столько же» — «курс доллара!»
  cut("s7", "s8", st.m2 - .2); move("s8", { s: 1.12 }, st.m2 - .2, en.z3 - st.m2 + .4, "none"); bub("m2", st.z3 - .1); bub("z3", st.m3 - .3);
  gsap.set("#sw", { opacity: 0 }); tl.to("#sw", { opacity: 1, duration: .2 }, st.z3).fromTo("#sw", { y: -20 }, { y: 30, duration: .6, repeat: 2, ease: "power1.in", immediateRender: false }, st.z3);
  // 9. бот у Марины
  const SW9 = st.m3 - .3; swap("s8", "s9", SW9); move("s9", { s: 1.12 }, SW9, en.m3 - SW9 + .4, "none");
  tl.fromTo("#vcc2", { scale: 1 }, { scale: 1.07, duration: .15, yoyo: true, repeat: 1, ease: "power2.out", immediateRender: false }, W("m3", "бот")); R.sfx("ping", W("m3", "бот"), .8);
  bub("m3", st.z4 - .2);
  // 10. «а скидка?» — «нашла раньше всех», Марина уходит
  cut("s9", "s10", st.z4 - .2); move("s10", { s: 1.1 }, st.z4 - .2, en.m4 - st.z4 + .8, "none"); bub("z4", st.m4 - .1); bub("m4", st.l4 - .1);
  tl.to('[data-p="mf"]', { x: 520, duration: 1.4, ease: "power1.in" }, en.m4 + .1);
  // 11. баннер гаснет по буквам, «Я» падает на капот RX-7
  const SW11 = st.l4 - .1; swap("s10", "s11", SW11);
  gsap.set("#nch", { opacity: 0 }); gsap.set("#spk", { opacity: 0 });
  [[2, W("l4", "бан")], [9, W("l4", "бан") + .25], [12, W("l4", "жор")]].forEach(([k, at]) => { tl.to(`#bn2c${k}`, { opacity: .12, duration: .05, repeat: 3, yoyo: true }, at).set(`#bn2c${k}`, { opacity: .12 }, at + .25); R.sfx("glitch", at, .3); });
  tl.to("#bn2", { rotation: 7, duration: .35, ease: "bounce.out" }, W("l4", "выдерж"));
  const FALL = W("l4", "выдерж") + .4;
  tl.set("#bn2c5", { opacity: 0 }, FALL);
  tl.fromTo("#nch", { opacity: 1, x: 140, y: -820, rotation: -10 }, { opacity: 1, x: 0, y: 0, rotation: 16, duration: .55, ease: "power2.in", immediateRender: false }, FALL);
  move("s11", { y: 1250, s: 1.06 }, FALL - .1, .6, "power2.inOut");
  tl.fromTo("#spk", { opacity: 1, scale: .2 }, { opacity: 0, scale: 1.4, duration: .5, ease: "power2.out", immediateRender: false }, FALL + .55); R.sfx("impact", FALL + .55, .9); R.sfx("glitch", FALL + .6, .4);
  tl.fromTo(SC.s11, { x: 0 }, { x: 12, duration: .04, yoyo: true, repeat: 5, ease: "none", immediateRender: false }, FALL + .55);
  bub("z5", st.l5 - .1); bub("z6", st.l6 - .2); move("s11", { s: 1.16 }, st.z6 - .2, en.z6 - st.z6 + .4, "none");
  // 12. финальная фраза Лиса про бот → карточка
  const SW12 = st.l6 - .2; swap("s11", "s12", SW12); tl.to("#tag", { opacity: 0, duration: .2 }, SW12);
  tl.fromTo("#cta", { opacity: 0, y: 80, scale: .9 }, { opacity: 1, y: 0, scale: 1, duration: .4, ease: "back.out(1.6)", immediateRender: false }, SW12 + .6);
  ending(R, en.l6 + .3);
};
