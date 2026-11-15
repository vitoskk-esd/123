// «ДЕТЕКТИВ: ДЕЛО УТОПЛЕННИЦЫ» (ep70, киношный формат ../cine.js, отдельный ролик, БЕЗ мата). Сцены — как в утверждённой раскадровке board.html.
// ОБЛОЖКА: Ольга с ботом (Lada Vesta −10%) + плашка «ДЕТЕКТИВ: / ДЕЛО УТОПЛЕННИЦЫ» → контора → лупа: карась → флешбэк: Камри на дне
// → доска улик (нити сходятся на Жоре) → допрос под лампой → бот: Веста → «Дело закрыто» (печать) → Веста на берегу → финал Лиса.
$("#title .a").textContent = E.rubric; $("#title .b").textContent = E.subtitle; $("#title .b").style.fontSize = "76px"; $("#tag span").textContent = "детектив";
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
const Z = (p, x, foot, h, o = {}, pose = {}, extra = {}) => ch("perekup", spk(p, "zhora"), x, foot, h, { ...ZHORA, ...o }, pose, extra);
const G = (p, x, foot, h, o = {}, pose = {}, extra = {}) => ch("perekup", spk(p, "gor"), x, foot, h, { ...GOR, ...o }, pose, extra);
const O = (p, x, foot, h, pose = {}, extra = {}) => OLC(ch("vika", spk(p, "olga"), x, foot, h, null, pose, extra));
const DB_L = glow(780, 1380, 260, "#ffd27a", .45) + glow(710, 470, 160, "#ff4fa0", .3);
const DP_L = glow(540, 520, 300, "#fff6d0", .45);
const PR_L = glow(540, 300, 420, "#ffffff", .2);

// 1. обложка: Ольга с ботом
{ const H = HOLDPHONE("vika", spk("op", "olga"), 540, 2090, 1680, null, VSCARD(), { rim: "#ffd27a", side: 1 });
  mount("s1", { bg: "detbyuro", farBlur: 8, mid: OLC(H.mid), lights: H.lights + DB_L }, { x: 540, y: 960, s: 1 }); }
// 2. контора: «пахнет рекой»
mount("s2", { bg: "detbyuro", mid: G("ga", 760, 1700, 900, {}, { armL: 30 }, { rim: "#ffd27a", side: -1, z: 7 }) + DESK(1560) + O("oa", 250, 1880, 860, { armR: -60 }, { rim: "#ff4fa0", side: 1, z: 10 }), lights: DB_L,
  bubbles: [{ id: "o0", p: "oa", html: "Купила Камри у Жоры.<br><em>А в салоне пахнет рекой.</em>", fs: 38 }, { id: "g0", p: "ga", html: "Рекой, говорите?<br><em>Интересно.</em>", fs: 40 }] }, { x: 540, y: 1150, s: 1.04 });
// 3. лупа: карась
mount("s3", { bg: "detbyuro", farBlur: 8, mid: G("gb", 300, 2000, 1050, { look: "o" }, { armR: -60 }, { rim: "#ffd27a", side: 1, z: 7 }) + LOUPE(640, 1150, "lp", 300), lights: DB_L,
  bubbles: [{ id: "g1", p: "gb", html: "Ил. Песок.<br><em>И… карась. Живой.</em>", fs: 44 }] }, { x: 540, y: 1100, s: 1.04 });
// 4. «Карась?! В машине?!»
mount("s4", { bg: "detbyuro", farBlur: 3, mid: G("gc", 330, 1880, 880, {}, { armR: -150 }, { rim: "#ffd27a", side: 1, z: 7 }) + CARPHAND(380, 860) + O("ob", 820, 1880, 860, { armL: 60 }, { rim: "#ff4fa0", side: -1, z: 7 }), lights: DB_L,
  bubbles: [{ id: "o1", p: "ob", html: "Карась?!<br><em>В машине?!</em>", fs: 50 }] }, { x: 540, y: 1150, s: 1.04 });
// 5. флешбэк: Камри на дне
mount("s5", { bg: "prichaltuman", farFilter: "sepia(.35)", mid: car(CAMS, 60, 1500, 960, { z: 5, sheen: .3 }) + WATER(1330) + PIP(G("gpip", 160, 800, 900, {}, {}, { noShadow: 1 }), "pip1", "#ffd27a", 700, 1500), lights: PR_L,
  bubbles: [{ id: "g2", at: [860, 1530], html: "Ваша Камри не «не бита».<br><em>Она — утопленница.</em>", fs: 40 }] }, { x: 540, y: 1150, s: 1.04 });
// 6. доска улик
mount("s6", { bg: "detbyuro", farBlur: 3, mid: EVID(110, 560) + G("gd", 870, 1900, 900, {}, { armL: 100 }, { rim: "#ffd27a", side: -1, z: 10 }), lights: DB_L,
  bubbles: [{ id: "g3", p: "gd", html: "Жора. Продал машину,<br><em>которая месяц жила на дне.</em>", fs: 38 }] }, { x: 540, y: 1150, s: 1.04 });
// 7. допрос: «она сама поплыла!»
mount("s7", { bg: "dopros", mid: Z("za", 540, 1860, 900, { look: "o" }, { armL: 60, armR: -60 }, { rim: "#fff6d0", side: 1, z: 7 }) + `<div style="position:absolute;left:120px;top:1560px;width:840px;height:400px;z-index:9;background:#3a3d46;border:8px solid #151515"></div>`, over: QLAMP(540), lights: DP_L,
  bubbles: [{ id: "z0", p: "za", html: "Я её не топил!<br><em>Она сама поплыла!</em>", fs: 48 }] }, { x: 540, y: 1150, s: 1.04 });
// 8. «карась сам сел за руль?» → «это бонус!»
mount("s8", { bg: "dopros", farBlur: 2, mid: G("ge", 260, 1880, 900, {}, { armR: -100 }, { rim: "#fff6d0", side: 1, z: 7 }) + Z("zb", 820, 1880, 860, { look: "grin" }, { armL: 70 }, { rim: "#fff6d0", side: -1, z: 7 }) + CARPHAND(330, 980, "ch2", 180), over: QLAMP(540, "ql2"), lights: DP_L,
  bubbles: [{ id: "g4", p: "ge", html: "Сама поплыла.<br><em>А карась сам сел за руль?</em>", fs: 38 }, { id: "z1", p: "zb", html: "Карась — это бонус!<br><em>Как ароматизатор!</em>", fs: 40 }] }, { x: 540, y: 1150, s: 1.04 });
// 9. бот: Веста
{ const H = HOLDPHONE("vika", spk("of", "olga"), 540, 2000, 1400, null, VSCARD("vcc2"), { rim: "#ffd27a", side: 1 });
  mount("s9", { bg: "detbyuro", farBlur: 5, mid: OLC(H.mid), lights: H.lights + DB_L,
    bubbles: [{ id: "o2", p: "of", html: "Веста, один хозяин,<br><em>ниже рынка. Без карасей.</em>", fs: 40 }] }, { x: 540, y: 1000, s: 1.02 }); }
// 10. «Дело закрыто»
mount("s10", { bg: "detbyuro", farBlur: 3, mid: G("gf", 330, 1700, 900, {}, { armR: -150 }, { rim: "#ffd27a", side: 1, z: 7 }) + DESK(1560) + FOLDER(440, 1380), lights: DB_L,
  bubbles: [{ id: "g5", p: "gf", html: "Дело<br><em>закрыто.</em>", fs: 60 }] }, { x: 540, y: 1150, s: 1.04 });
// 11. Веста на берегу
mount("s11", { bg: "prichaltuman", mid: SHORE(1420) + car(VES, 330, 1640, 700, { z: 5, sheen: .5 }) + O("oc", 200, 1860, 820, { armR: -150 }, { rim: "#ffffff", side: 1, z: 7 }) + G("gg", 900, 1860, 840, { look: "grin" }, { armL: 30 }, { rim: "#ffffff", side: -1, z: 7 }), lights: PR_L }, { x: 540, y: 1150, s: 1.04 });
// 12. карточка бота
mount("s12", { bg: "detbyuro", over: CTA70.replace('<div style="position:absolute;', '<div id="cta" style="opacity:0;position:absolute;'), lights: DB_L }, { x: 540, y: 1000, s: .98 });

$("#end h2").innerHTML = E.end;

window.build = R => {
  const tl = R.tl;
  const { pop } = common(R, { shake: 0 });
  for (const el of Object.values(SC)) {
    el.sheens = [...el.querySelectorAll(".sheen")];
    el.glows = [...el.querySelectorAll(".lights .glow")].map(g => ({ g, o: +g.style.opacity }));
  }
  const talk = (lv, f) => lv > .28 && !(lv < .55 && f % 3 === 2);
  const MOOD = { gb: "o", ob: "o", za: "o", ga: "flat", gc: "flat", gd: "flat", ge: "flat", gf: "flat", gpip: "flat" };
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
    // лампа допроса качается, карась шевелит хвостом
    for (const id of ["ql", "ql2"]) { const e = document.getElementById(id); if (e) e.style.transform = `rotate(${(Math.sin(t * 1.4 + (id === "ql2" ? 1 : 0)) * 9).toFixed(2)}deg)`; }
    for (const id of ["lpf", "ch", "ch2"]) { const e = document.getElementById(id); if (e) e.style.transform = `rotate(${(Math.sin(t * 9) * (id === "lpf" ? 6 : 10)).toFixed(2)}deg)`; }
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
  move("s1", { s: 1.06, y: 1000 }, 0, en.l0 + .3, "none");
  tl.fromTo("#vcc", { scale: 1 }, { scale: 1.06, duration: .15, yoyo: true, repeat: 1, ease: "power2.out", immediateRender: false }, 2.0); R.sfx("ping", 2.0, .6);
  // 2. контора
  const SW2 = st.o0 - .35; swap("s1", "s2", SW2); move("s2", { s: 1.1 }, SW2, en.g0 - SW2 + .3, "none"); bub("o0", st.g0 - .1); bub("g0", st.l1 - .2);
  // 3. лупа: линза наезжает, в ней карась
  const SW3 = st.l1 - .25; swap("s2", "s3", SW3); move("s3", { s: 1.14 }, SW3, en.g1 - SW3 + .4, "none"); bub("g1", st.o1 - .2);
  tl.fromTo("#lp", { scale: .3, opacity: 0 }, { scale: 1, opacity: 1, duration: .5, ease: "back.out(1.6)", immediateRender: true }, st.l1 + .2);
  tl.fromTo("#lpf", { opacity: 0, scale: .6 }, { opacity: 1, scale: 1, duration: .3, ease: "back.out(2)", immediateRender: true }, Wd("g1", "кар", .6)); R.sfx("ping", Wd("g1", "кар", .6), .7);
  // 4. «Карась?! В машине?!»
  cut("s3", "s4", st.o1 - .2); move("s4", { s: 1.12 }, st.o1 - .2, en.o1 - st.o1 + .4, "none"); bub("o1", st.g2 - .2);
  // 5. флешбэк: вода поднимается до крыши
  const SW5 = st.g2 - .3; swap("s4", "s5", SW5); move("s5", { s: 1.1 }, SW5, en.g2 - SW5 + .4, "none"); bub("g2", st.l2 - .2);
  tl.fromTo("#wt", { y: 260 }, { y: 0, duration: 1.6, ease: "power1.inOut", immediateRender: true }, SW5 + .3);
  tl.fromTo("#pip1", { scale: 0 }, { scale: 1, duration: .3, ease: "back.out(2)", immediateRender: true }, st.g2 - .1);
  // 6. доска улик: нити прорисовываются и сходятся на Жоре
  const SW6 = st.l2 - .3; swap("s5", "s6", SW6); move("s6", { s: 1.08 }, SW6, en.g3 - SW6 + .4, "none"); bub("g3", st.l3 - .2);
  document.querySelectorAll("#evs path").forEach(p => { p.style.strokeDasharray = 600; p.style.strokeDashoffset = 600; });
  tl.to("#evs path", { strokeDashoffset: 0, duration: .6, stagger: .45, ease: "power1.inOut" }, st.l2 + .6);
  tl.fromTo("#ev g:last-child", { scale: 1 }, { scale: 1.08, duration: .2, yoyo: true, repeat: 1, svgOrigin: "430 420", immediateRender: false }, Wd("g3", "жор", .05));
  // 7. допрос
  const SW7 = st.l3 - .25; swap("s6", "s7", SW7); move("s7", { s: 1.12 }, SW7, en.z0 - SW7 + .4, "none"); bub("z0", st.g4 - .2);
  // 8. «сам сел за руль?» → «бонус!»
  cut("s7", "s8", st.g4 - .2); move("s8", { s: 1.1 }, st.g4 - .2, en.z1 - st.g4 + .4, "none"); bub("g4", st.z1 - .1); bub("z1", st.l4 - .2);
  // 9. бот: Веста
  const SW9 = st.l4 - .25; swap("s8", "s9", SW9); move("s9", { s: 1.08 }, SW9, en.o2 - SW9 + .4, "none");
  tl.fromTo("#vcc2", { scale: 1 }, { scale: 1.07, duration: .15, yoyo: true, repeat: 1, ease: "power2.out", immediateRender: false }, Wd("o2", "вест", .05)); R.sfx("ping", Wd("o2", "вест", .05), .8);
  bub("o2", st.g5 - .2);
  // 10. «Дело закрыто» — печать
  cut("s9", "s10", st.g5 - .25); move("s10", { s: 1.1 }, st.g5 - .25, en.g5 - st.g5 + .6, "none"); bub("g5", st.l5 - .1);
  const STAMP = Wd("g5", "закр", .5);
  tl.fromTo("#fds", { scale: 2.8, opacity: 0 }, { scale: 1, opacity: 1, duration: .18, ease: "power4.in", immediateRender: true }, STAMP);
  tl.fromTo(SC.s10, { y: -8 }, { y: 0, duration: .25, ease: "bounce.out", immediateRender: false }, STAMP + .18); R.sfx("clack", STAMP + .16, 1);
  // 11–12. финальная фраза Лиса: Веста на берегу → карточка
  const SW11 = st.l5 - .2, SW12 = Math.min(st.l5 + 2.2, en.l5 - 2.5);
  swap("s10", "s11", SW11); move("s11", { s: 1.08 }, SW11, SW12 - SW11 + .5, "none");
  swap("s11", "s12", SW12); tl.to("#tag", { opacity: 0, duration: .2 }, SW12);
  tl.fromTo("#cta", { opacity: 0, y: 80, scale: .9 }, { opacity: 1, y: 0, scale: 1, duration: .4, ease: "back.out(1.6)", immediateRender: false }, SW12 + .6);
  ending(R, en.l5 + .3);
};

// ── ep70c «Неон»: быстрая уникализация — меняется только заставка ──
$("#title .a").textContent = "ЖОРА:"; $("#title .a").style.cssText = "font-size:110px;background:#ffd23f;color:#151515";
$("#title .b").textContent = "ОНА САМА ПОПЛЫЛА!"; $("#title .b").style.cssText = "font-size:60px;background:#151515;color:#ffd23f";
const ORIG = [...document.querySelectorAll("#lbx .lbt, #lbx .lbb")].map(e => e.textContent), HEADT = 2.4;
{ const L = document.querySelector("#lbx"); if (L) { const a = L.querySelector(".lbt"), b = L.querySelector(".lbb");   // кинорамка вместо плашки (ep56)
  a.textContent = "ЖОРА:"; b.textContent = "ОНА САМА ПОПЛЫЛА!"; a.style.background = b.style.background = "#ffd23f"; a.style.color = b.style.color = "#151515"; } }
{ const K = document.querySelector("#ballc"); if (K) { const orig = K.innerHTML, col = K.style.color;   // надпись над хрустальным шаром (ep58)
  K.innerHTML = "ЖОРА:"; K.style.color = "#ffd23f";
  const B = window.build; window.build = R => { B(R); R.tl.to(K, { opacity: 0, duration: .15 }, HEADT - .6);
    R.tl.set(K, { innerHTML: orig, color: col }, HEADT - .45); R.tl.to(K, { opacity: 1, duration: .15 }, HEADT - .4); }; } }
{ const K = document.querySelector("#skc"); if (K) { const [a, b] = K.children, orig = [a.textContent, b.textContent], bg = K.style.background, col = K.style.color;   // подпись судебного рисунка (ep57)
  a.textContent = "ЖОРА:"; b.textContent = "ОНА САМА ПОПЛЫЛА!"; K.style.background = "#ffd23f"; K.style.color = "#151515";
  const B = window.build; window.build = R => { B(R); R.tl.to(K, { opacity: 0, duration: .15 }, HEADT - .6);
    R.tl.set(a, { textContent: orig[0] }, HEADT - .45).set(b, { textContent: orig[1] }, HEADT - .45).set(K, { background: bg, color: col }, HEADT - .45);
    R.tl.to(K, { opacity: 1, duration: .15 }, HEADT - .4); }; } }
{ const L = document.querySelector("#lbx"); if (L) { const B = window.build; window.build = R => { B(R);   // до склейки с основным видео (HEAD) рамка возвращается к исходной
  const bars = [L.querySelector(".lbt"), L.querySelector(".lbb")], col = ["#fff", "#ffd23f"];
  R.tl.to(bars, { opacity: 0, duration: .15 }, HEADT - .6);
  bars.forEach((el, i) => R.tl.set(el, { textContent: ORIG[i], background: "#000", color: col[i] }, HEADT - .45));
  R.tl.to(bars, { opacity: 1, duration: .15 }, HEADT - .4); }; } }
