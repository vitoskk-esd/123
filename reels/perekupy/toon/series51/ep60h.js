// «ШКОЛА ПЕРЕКУПОВ: ЭКЗАМЕН ЗА МИНУТУ» (ep60, киношный формат ../cine.js, отдельный ролик). Сцены — как в утверждённой раскадровке board.html.
// ОБЛОЖКА (кадр 0): двор курсов, жёлтая Эво IX Михалыча, Михалыч рядом + плашка «ШКОЛА: / ЭКЗАМЕН ЗА МИНУТУ» (гаснет к 1,6 с; без телефона — владелец 14.11)
// → класс: мел «газета, обзвон, рынок в 5 утра» → Ваня тянет руку → «телефон на парту!» → звонок + таймер → задание мелом → газета, обводит Гранты
// → дисковый телефон «продана?!» → газета: кресты → «и эта…» → Ваня: «уже договорился» → двор: тётя Галя, таймер 0:47 → бот прислал через секунду
// → дневник «5» → у Эво: «а теперь ты меня учи» → финальная фраза Лиса про бот + карточка.
$("#title .a").textContent = E.rubric; $("#title .b").textContent = E.subtitle; $("#tag span").textContent = "школа";
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
const M = (p, x, foot, h, o = {}, pose = {}, extra = {}) => ch("perekup", spk(p, "mihalych"), x, foot, h, { ...MIH, ...o }, pose, extra);
const V = (p, x, foot, h, o = {}, pose = {}, extra = {}) => ch("perekup", spk(p, "vanya"), x, foot, h, { ...VANYA, ...o }, pose, extra);
const KL_L = glow(60, 1080, 260, "#fff6d0", .45) + glow(540, 120, 420, "#fff6d0", .3);
const UC_L = glow(540, 200, 300, "#ffe8a8", .5);
const DV_L = glow(900, 200, 380, "#fff6d0", .35);
const PTR = (x, foot, h, arm = -120, id = "") => INHAND(x, foot, h, arm, 200, POINTER.replace("L-120 -150", "L200 -170").replace("M-110 -138 L-124 -155", "M190 -160 L206 -176"), 10).replace('<div class="prop"', `<div class="prop"${id ? ` id="${id}"` : ""}`);
const DIARYMINI = `<svg viewBox="0 0 120 100" style="overflow:visible"><g transform="rotate(-8 60 50)"><rect x="0" y="10" width="120" height="84" rx="6" fill="#2f5a8a" stroke="#151515" stroke-width="5"/><rect x="8" y="14" width="104" height="76" fill="#fbf8ef" stroke="#151515" stroke-width="3"/><path d="M60 14 V90" stroke="#151515" stroke-width="3"/><text x="86" y="78" text-anchor="middle" font-family="Caveat" font-weight="700" font-size="64" fill="#e0261a">5</text></g></svg>`;
const CH1 = [["Урок 1. Как найти машину", 74, "#ffd9a0"], ["1. Газета"], ["2. Обзвон"], ["3. Рынок в 5 утра"]];
const CH2 = [["ЭКЗАМЕН", 120, "#ffd23f"], ["Найти Гранту"], ["ниже рынка"], ["за 1 минуту!", 92, "#ff9a8a"]];

// 1. обложка: двор, жёлтая Эво Михалыча
mount("s1", { bg: "shkolnyidvor", grade: "day", farBlur: 2, mid: car(EVO, 10, 1620, 830, { z: 4, sheen: .55 }) + M("mo", 930, 1740, 860, { look: "grin" }, { armL: 30, armR: -30 }, { rim: "#fff6d0", side: -1, z: 7 }),
  lights: DV_L }, { x: 540, y: 1000, s: 1 });
// 2. класс: мел на доске
mount("s2", { bg: "klass", grade: "day", farBlur: 0, far: CHALK(CH1, "ch"), mid: M("ma", 250, 1900, 900, {}, { armR: -120 }, { rim: "#fff6d0", side: 1, z: 7 }) + PTR(250, 1900, 900, -120, "ptr"), lights: KL_L,
  bubbles: [{ id: "m1", p: "ma", html: "Записывайте!<br><em>Газета. Обзвон. Рынок в пять утра.</em>", fs: 42 }] }, { x: 540, y: 1000, s: 1 });
// 3. ученики за партами, Ваня тянет руку
mount("s3", { bg: "klass", grade: "day", farBlur: 3, far: CHALK(CH1, "chb"),
  mid: ch("perekup", "gs", 190, 1700, 640, GOSHA, {}, { z: 7 }) + DESK(190, 1730, 360) + HANDUP(V("vb", 540, 1700, 640, {}, {}, { z: 7 }), "vb", 540, 1700, 640, VANYA.jacket) + DESK(540, 1730, 360)
    + ch("perekup", "pt", 890, 1700, 640, PETYA, {}, { z: 7 }) + DESK(890, 1730, 360), lights: KL_L,
  bubbles: [{ id: "v1", p: "vb", html: "Михал Михалыч,<br><em>а можно через телефон?</em>", fs: 44 }] }, { x: 540, y: 1300, s: 1.12 });
// 4. Михалыч сердится
mount("s4", { bg: "klass", grade: "day", farBlur: 6, mid: M("mb", 540, 1900, 1000, { look: "angry" }, { armL: 40 }, { rim: "#fff6d0", side: 1, z: 7 }), lights: KL_L,
  bubbles: [{ id: "m2", p: "mb", html: "Телефон — на парту!<br><em>Экзамен!</em>", fs: 54 }] }, { x: 540, y: 1150, s: 1.1 });
// 5. звонок + таймер
mount("s5", { far: BELLRING("bell"), farBlur: 0, over: TIMER(390, 1060, 60, "tm0") }, { x: 540, y: 960, s: 1 });
// 6. задание мелом, таймер пошёл
mount("s6", { bg: "klass", grade: "day", farBlur: 0, far: CHALK(CH2, "chc"), mid: M("mc", 250, 1900, 900, {}, { armR: -120 }, { rim: "#fff6d0", side: 1, z: 7 }) + PTR(250, 1900, 900),
  over: TIMER(780, 1060, 60, "tm1", 250), lights: KL_L,
  bubbles: [{ id: "m3", p: "mc", html: "Гранта ниже рынка.<br><em>Время пошло!</em>", fs: 46 }] }, { x: 540, y: 1000, s: 1 });
// 7. газета: Михалыч обводит Гранты
mount("s7", { far: NEWS(0).replace(/id="nx(\d)"/g, 'id="na$1"'), farBlur: 0, over: TIMER(80, 1640, 60, "tm5", 200) }, { x: 540, y: 960, s: 1 });
// 8. дисковый телефон
const PHONE = (k, look) => M("md" + k, 470, 1820, 920, { look }, { armR: -150 }, { rim: "#ffe8a8", side: 1, z: 7 }) + HANDSET2(598, 1180, 548, 1300, 930, 860) + ROTARY(840, 780, 190, 6);
mount("s8", { bg: "uchitelskaya2", grade: "warm", farBlur: 3, mid: PHONE("", "o"), over: TIMER(790, 1180, 60, "tm2", 230), lights: UC_L,
  bubbles: [{ id: "m4", p: "md", html: "Алло! Гранта ещё есть?..<br><em>Продана?!</em>", fs: 46 }] }, { x: 540, y: 1150, s: 1.05 });
// 9. газета крупно: кресты «продана!»
mount("s9", { far: NEWS(0), farBlur: 0, over: TIMER(80, 1640, 60, "tm3", 200) }, { x: 540, y: 960, s: 1 });
// 10. «и эта продана…»
mount("s10", { bg: "uchitelskaya2", grade: "warm", farBlur: 3, mid: PHONE("2", "flat"), over: TIMER(790, 1180, 60, "tm6", 230), lights: UC_L,
  bubbles: [{ id: "m5", p: "md2", html: "И эта продана…<br><em>И эта!</em>", fs: 50 }] }, { x: 560, y: 1080, s: 1.18 });
// 11. Ваня: «я уже договорился»
{ const H = HOLDPHONE("perekup", spk("ve", "vanya"), 380, 1960, 1250, VANYA, GRCARD(), { rim: "#fff6d0", side: 1 });
  mount("s11", { bg: "klass", grade: "day", farBlur: 5, mid: H.mid + M("me", 860, 1800, 900, { look: "o" }, {}, { z: 5 }), lights: H.lights + KL_L, over: TIMER(800, 300, 60, "tm7", 200),
    bubbles: [{ id: "v2", p: "ve", html: "Михал Михалыч,<br><em>я уже договорился.</em>", fs: 44 }] }, { x: 560, y: 1080, s: 1.05 }); }
// 12. двор: тётя Галя у Гранты, таймер Вани остановился на 0:47
mount("s12", { bg: "shkolnyidvor", grade: "day", mid: car(GR, 20, 1680, 640, { z: 4, sheen: .5 }) + ch("perekup", spk("gl", "galya"), 840, 1740, 780, GALYA, {}, { rim: "#fff6d0", side: -1, z: 7 }),
  over: TIMER(70, 1640, 47, "tm4", 230) + `<div id="r13" style="position:absolute;left:320px;top:1720px;z-index:41;transform:rotate(-4deg);background:#ffd23f;border:6px solid #151515;border-radius:14px;padding:6px 18px;font-family:Unbounded;font-weight:900;font-size:40px;color:#151515;box-shadow:0 8px 0 #151515">ВАНЯ — 13 СЕК</div>`,
  lights: DV_L, bubbles: [{ id: "g1", p: "gl", html: "Ты первый позвонил —<br><em>через минуту после объявления!</em>", fs: 40 }] }, { x: 540, y: 1200, s: 1.05 });
// 13. бот прислал объявление через секунду (телефон Вани крупно)
{ const H = HOLDPHONE("perekup", spk("vp", "vanya"), 540, 2090, 1680, VANYA, GRCARD().replace('id="gcc"', 'id="gcc2"'), { rim: "#fff6d0", side: 1 });
  mount("s13", { bg: "shkolnyidvor", grade: "day", farBlur: 8, mid: H.mid, lights: H.lights + DV_L }, { x: 540, y: 960, s: 1 }); }
// 14. дневник крупно: «5»
mount("s14", { far: DIARY(), farBlur: 0 }, { x: 540, y: 960, s: 1 });
// 15. у Эво: «а теперь ты меня учи»
mount("s15", { bg: "shkolnyidvor", grade: "day", farBlur: 3, far: car(EVO, 360, 1330, 680, { z: 2, sheen: .4 }),
  mid: M("mf", 300, 1820, 880, { look: "grin" }, { armR: -70 }, { rim: "#fff6d0", side: 1, z: 7 }) + INHAND(300, 1820, 880, -70, 230, DIARYMINI, 9) + V("vf", 780, 1820, 820, {}, {}, { rim: "#fff6d0", side: -1, z: 7 }), lights: DV_L,
  bubbles: [{ id: "m6", p: "mf", html: "Ставлю пять. А теперь ты меня учи —<br><em>найди мне Эво дешевле рынка!</em>", fs: 42 }] }, { x: 540, y: 1180, s: 1.05 });
// 16. карточка бота
mount("s16", { bg: "shkolnyidvor", grade: "day", over: CTA60.replace('<div style="position:absolute;', '<div id="cta" style="opacity:0;position:absolute;'), lights: DV_L }, { x: 540, y: 1000, s: .98 });

$("#end h2").innerHTML = E.end;

window.build = R => {
  const tl = R.tl;
  const { pop } = common(R, { shake: 0 });
  for (const el of Object.values(SC)) {
    el.sheens = [...el.querySelectorAll(".sheen")];
    el.glows = [...el.querySelectorAll(".lights .glow")].map(g => ({ g, o: +g.style.opacity }));
  }
  const talk = (lv, f) => lv > .28 && !(lv < .55 && f % 3 === 2);
  const MOOD = { mb: "flat", me: "o", md2: "flat", gs: "o", md: "o" };
  // экзаменационный таймер: идёт с «время пошло» до слов Вани, быстрее реального (комедия): 60 → 20
  const T0 = W("m3", "пошло") + .3, TEND = st.v2 + .4, K = 40 / (TEND - T0), LEN = 2 * Math.PI * 120;
  const RUN = ["tm1", "tm5", "tm2", "tm3", "tm6", "tm7"];
  const setT = (id, sec) => { const r = document.getElementById(id + "r"), x = document.getElementById(id + "t"); if (!r) return;
    r.setAttribute("stroke-dashoffset", (LEN * (1 - sec / 60)).toFixed(1)); x.textContent = sec >= 60 ? "1:00" : "0:" + String(sec).padStart(2, "0"); };
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
    const sec = t < T0 ? 60 : Math.max(20, 60 - Math.floor((t - T0) * K));
    RUN.forEach(id => setT(id, sec));
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
  const wipe = (sel, at, d = .45, snd = "chalk") => { gsap.set(sel, { clipPath: "inset(-20% 100% -20% -5%)" });
    tl.to(sel, { clipPath: "inset(-20% -5% -20% -5%)", duration: d, ease: "none" }, at); if (snd) R.sfx(snd, at, d); };
  const xpop = (sel, at) => { gsap.set(sel, { opacity: 0 }); tl.fromTo(sel, { opacity: 0, scale: 1.6 }, { opacity: 1, scale: 1, duration: .18, ease: "back.out(2)", immediateRender: false }, at); R.sfx("clack", at, .7); };

  // 1. обложка: плашка видна с первого кадра и гаснет к 1,6 с
  gsap.set(SC.s1, { opacity: 1 }); SC.s1.style.display = "";
  gsap.set("#cnt", { opacity: 0 });
  show("s1", 0); tl.to("#title", { opacity: 0, y: -50, duration: .25 }, 1.6);
  move("s1", { s: 1.06, y: 1060 }, 0, W("l0", "и") + .2, "none");
  // 2. класс: мел — строки появляются под голос
  const SW2 = W("l0", "открыл") - .25; swap("s1", "s2", SW2); move("s2", { s: 1.06 }, SW2, en.m1 - SW2 + .3, "none");
  wipe("#ch0", SW2 + .45, .7); wipe("#ch1", W("m1", "газет"), .4); wipe("#ch2", W("m1", "обзвон"), .4); wipe("#ch3", W("m1", "рынок"), .55);
  ["газет", "обзвон", "рынок"].forEach(w => { tl.fromTo("#ptr", { rotation: 0 }, { rotation: -6, duration: .08, yoyo: true, repeat: 1, ease: "power1.out", immediateRender: false }, W("m1", w)); R.sfx("tap", W("m1", w), .6); });
  bub("m1", st.v1 - .3);
  // 3. ученики: Ваня тянет руку
  cut("s2", "s3", st.v1 - .3); move("s3", { s: 1.18 }, st.v1 - .3, en.v1 - st.v1 + .6, "none"); bub("v1", st.m2 - .2);
  // 4. «телефон — на парту!» — кадр вздрагивает
  cut("s3", "s4", st.m2 - .15); move("s4", { s: 1.18 }, st.m2 - .15, en.m2 - st.m2 + .3, "none"); bub("m2", st.l1 - .3);
  const EX = W("m2", "экзам"); tl.fromTo(SC.s4, { y: 0 }, { y: 14, duration: .05, yoyo: true, repeat: 5, ease: "none", immediateRender: false }, EX); R.sfx("impact", EX, .7);
  // 5. звонок + таймер
  const SW5 = st.l1 - .3; swap("s4", "s5", SW5); move("s5", { s: 1.06 }, SW5, en.l1 - SW5 + .3, "none");
  R.sfx("bell", SW5 + .2, 1.9);
  tl.fromTo("#bell", { rotation: -7 }, { rotation: 7, duration: .045, yoyo: true, repeat: 40, ease: "none", immediateRender: false, transformOrigin: "50% 8%" }, SW5 + .2);
  gsap.set("#tm0", { opacity: 0 }); tl.fromTo("#tm0", { opacity: 0, scale: .4 }, { opacity: 1, scale: 1, duration: .3, ease: "back.out(2)", immediateRender: false }, W("l1", "минут") - .1); R.sfx("pop", W("l1", "минут"), .7);
  // 6. задание мелом
  cut("s5", "s6", st.m3 - .35); move("s6", { s: 1.06 }, st.m3 - .35, en.m3 - st.m3 + .6, "none");
  wipe("#chc0", st.m3 - .2, .45); wipe("#chc1", W("m3", "найти"), .45); wipe("#chc2", W("m3", "ниже"), .4); wipe("#chc3", W("m3", "рынк") + .3, .4);
  bub("m3", st.l2 - .2);
  for (let n = 1; n <= 40; n++) R.sfx("tick", T0 + n / K, .16);                      // тиканье таймера
  // 7. газета: обводит Гранты
  const SW7 = st.l2 - .3; swap("s6", "s7", SW7); move("s7", { s: 1.08 }, SW7, en.l2 - SW7 + .4, "none");
  // 8. дисковый телефон
  cut("s7", "s8", en.l2 + .05); R.sfx("dial", en.l2 + .05, .8); move("s8", { s: 1.12 }, en.l2 + .05, en.m4 - en.l2 + .3, "none"); bub("m4", st.l3 - .2);
  // 9. газета: кресты «продана!»
  cut("s8", "s9", st.l3 - .2); move("s9", { s: 1.12, y: 900 }, st.l3 - .2, en.l3 - st.l3 + .5, "none");
  xpop("#nx0", W("l3", "газет") + .2); xpop("#nx1", W("l3", "забира"));
  // 10. «и эта продана…»
  cut("s9", "s10", st.m5 - .25); move("s10", { s: 1.26 }, st.m5 - .25, en.m5 - st.m5 + .4, "none"); bub("m5", st.v2 - .3);
  // 11. Ваня: «я уже договорился»
  const SW11 = st.v2 - .3; swap("s10", "s11", SW11); move("s11", { s: 1.12 }, SW11, en.v2 - SW11 + .3, "none");
  tl.fromTo("#gcc", { scale: 1 }, { scale: 1.06, duration: .15, yoyo: true, repeat: 1, ease: "power2.out", immediateRender: false }, W("v2", "гранта")); R.sfx("ping", W("v2", "гранта"), .7);
  bub("v2", st.g1 - .3);
  // 12. двор: тётя Галя, таймер Вани — 0:47
  const SW12 = st.g1 - .3; swap("s11", "s12", SW12); move("s12", { s: 1.1 }, SW12, en.g1 - SW12 + .4, "none"); bub("g1", st.l4 - .1);
  gsap.set("#r13", { opacity: 0 }); tl.fromTo("#r13", { opacity: 0, scale: 1.8 }, { opacity: 1, scale: 1, duration: .2, ease: "back.out(2)", immediateRender: false }, SW12 + .7); R.sfx("clack", SW12 + .7, .6);
  move("s12", { s: 1.3, x: 330, y: 1500 }, st.l4 - .1, 1.1);                       // «Ване хватило тринадцати секунд» — наезд на таймер
  // 13. бот прислал объявление через секунду
  const SW13 = W("l4", "бот") - .2; cut("s12", "s13", SW13); move("s13", { s: 1.08, y: 1000 }, SW13, 2.2, "none");
  gsap.set("#gcc2", { opacity: 0 }); const NC = W("l4", "присл");
  tl.fromTo("#gcc2", { opacity: 0, y: -50 }, { opacity: 1, y: 0, duration: .3, ease: "back.out(1.8)", immediateRender: false }, NC); R.sfx("ping", NC, .9);
  // 14. дневник: «5» и подпись
  const SW14 = W("l4", "как") - .1; swap("s13", "s14", SW14); move("s14", { s: 1.06 }, SW14, 2, "none");
  wipe("#d5", SW14 + .45, .4, "type"); R.sfx("impact", SW14 + .85, .5); wipe("#dsig", SW14 + .95, .5, "type");
  // 15. у Эво: «а теперь ты меня учи»
  cut("s14", "s15", st.m6 - .1); move("s15", { s: 1.12 }, st.m6 - .1, en.m6 - st.m6 + .3, "none"); bub("m6", st.l5 - .2);
  // 16. финальная фраза Лиса про бот → карточка
  const SW16 = st.l5 - .2; swap("s15", "s16", SW16); tl.to("#tag", { opacity: 0, duration: .2 }, SW16);
  tl.fromTo("#cta", { opacity: 0, y: 80, scale: .9 }, { opacity: 1, y: 0, scale: 1, duration: .4, ease: "back.out(1.6)", immediateRender: false }, SW16 + .6);
  ending(R, en.l5 + .3);
};

// ── ep60h «Пастель»: быстрая уникализация — меняется только заставка ──
$("#title .a").textContent = "ЭКЗАМЕН:"; $("#title .a").style.cssText = "font-size:110px;background:#ff6fae;color:#151515";
$("#title .b").textContent = "ГРАНТА ЗА 13 СЕКУНД"; $("#title .b").style.cssText = "font-size:60px;background:#151515;color:#ff6fae";
const ORIG = [...document.querySelectorAll("#lbx .lbt, #lbx .lbb")].map(e => e.textContent), HEADT = 2.4;
{ const L = document.querySelector("#lbx"); if (L) { const a = L.querySelector(".lbt"), b = L.querySelector(".lbb");   // кинорамка вместо плашки (ep56)
  a.textContent = "ЭКЗАМЕН:"; b.textContent = "ГРАНТА ЗА 13 СЕКУНД"; a.style.background = b.style.background = "#ff6fae"; a.style.color = b.style.color = "#151515"; } }
{ const K = document.querySelector("#ballc"); if (K) { const orig = K.innerHTML, col = K.style.color;   // надпись над хрустальным шаром (ep58)
  K.innerHTML = "ЭКЗАМЕН:"; K.style.color = "#ff6fae";
  const B = window.build; window.build = R => { B(R); R.tl.to(K, { opacity: 0, duration: .15 }, HEADT - .6);
    R.tl.set(K, { innerHTML: orig, color: col }, HEADT - .45); R.tl.to(K, { opacity: 1, duration: .15 }, HEADT - .4); }; } }
{ const K = document.querySelector("#skc"); if (K) { const [a, b] = K.children, orig = [a.textContent, b.textContent], bg = K.style.background, col = K.style.color;   // подпись судебного рисунка (ep57)
  a.textContent = "ЭКЗАМЕН:"; b.textContent = "ГРАНТА ЗА 13 СЕКУНД"; K.style.background = "#ff6fae"; K.style.color = "#151515";
  const B = window.build; window.build = R => { B(R); R.tl.to(K, { opacity: 0, duration: .15 }, HEADT - .6);
    R.tl.set(a, { textContent: orig[0] }, HEADT - .45).set(b, { textContent: orig[1] }, HEADT - .45).set(K, { background: bg, color: col }, HEADT - .45);
    R.tl.to(K, { opacity: 1, duration: .15 }, HEADT - .4); }; } }
{ const L = document.querySelector("#lbx"); if (L) { const B = window.build; window.build = R => { B(R);   // до склейки с основным видео (HEAD) рамка возвращается к исходной
  const bars = [L.querySelector(".lbt"), L.querySelector(".lbb")], col = ["#fff", "#ffd23f"];
  R.tl.to(bars, { opacity: 0, duration: .15 }, HEADT - .6);
  bars.forEach((el, i) => R.tl.set(el, { textContent: ORIG[i], background: "#000", color: col[i] }, HEADT - .45));
  R.tl.to(bars, { opacity: 1, duration: .15 }, HEADT - .4); }; } }
