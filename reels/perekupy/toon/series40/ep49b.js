// «ТОЛЯН: СО СТА ТЫСЯЧ · 11» — «Партнёры» (киношный формат ../cine.js). Сцены — как в утверждённой раскадровке board.html.
// Боулинг (страйк) → нотариус, пункт 7 (стоп-кадр в ч/б) → разделённый экран: CLS Виталика vs CLS из бота → толщиномер: шпаклёвка
// → чёрный CLS из бота: родная краска, +180 на двоих → капитал 730 → Жора тайком звонит Виталику. Без фоновой музыки.
$("#title .a").textContent = E.rubric; $("#title .b").textContent = E.subtitle; $("#tag span").textContent = "партнёры";
document.querySelector("#cam > svg#bg")?.remove();
const W = (line, pre, n = 0) => {
  const norm = s => s.toLowerCase().replace(/ё/g, "е").replace(/[^а-я0-9a-z]/g, "");
  const hits = (TT.words[line] || []).filter(w => w[1] >= st[line] - .05 && w[2] <= en[line] + .05 && norm(w[0]).startsWith(norm(pre)));
  if (!hits[n]) console.warn("W miss", line, pre);
  return hits[n] ? hits[n][1] : st[line];
};
const G = (id, html, z = 5) => `<div class="grp" id="${id}" style="left:0;top:0;width:1080px;height:1920px;z-index:${z}">${html}</div>`;
const root = $("#scene"), SC = {}, SPK = {};
const mount = (name, def, sh, parent = root) => (SC[name] = C.mount(parent, def, sh));
const spk = (p, v) => (SPK[p] = v, p);
const T = (p, x, foot, h, pose = {}, extra = {}) => ch("tolyan", spk(p, "tolyan"), x, foot, h, null, pose, extra);
const Z = (p, o, x, foot, h, pose = {}, extra = {}) => ch("perekup", spk(p, "zhora"), x, foot, h, { ...ZHORA, ...o }, pose, extra);
const NEON = glow(270, 127, 220, "#ff3bd0", .45) + glow(800, 167, 220, "#5ad0ff", .45) + glow(540, 267, 300, "#ff3bd0", .35);
const BOWL_L = glow(150, 210, 140, "#ff3bd0", .5) + glow(690, 210, 140, "#ffd23f", .4) + glow(540, 680, 300, "#ff3bd0", .3);
const BOT49 = () => BOTH("CLS · вся Россия", `<div id="n3">${CARD("Mercedes CLS · 2012 · одна хозяйка", "1 200 000 ₽", "родная краска · твой город", "🔥 −8% к рынку · ⏱ 1 с после публикации")}</div>`);

// 1. боулинг: ставка и страйк
mount("s1", { bg: "bowling", grade: "night",
  mid: Z("zb", { look: "grin" }, 380, 1700, 780, { armR: -150 }, { rim: "#ff3bd0", side: 1 }) + G("ball1", INHAND(380, 1700, 780, -150, 120, BALL, 9), 9)
    + T("tb", 820, 1740, 740, {}, { rim: "#5ad0ff", side: -1, z: 7 }),
  lights: BOWL_L, bubbles: [{ id: "z1", p: "zb", html: "Студент, выбью страйк —<br><em>и мы партнёры. 50 на 50!</em>", fs: 40 }] }, { x: 560, y: 1160, s: 1.1 });
mount("s1b", { bg: "bowling", grade: "night",
  mid: G("pins", PINS(600, 700, 1.3, 0), 4) + T("tc", 820, 1740, 740, { head: -6 }, { rim: "#ff3bd0", side: -1, z: 7 }),
  lights: BOWL_L + G("flash1", glow(600, 650, 260, "#ffffff", .6), 31),
  bubbles: [{ id: "t1", p: "tc", html: "…Ладно. Но по-честному.<br><em>На бумаге.</em>", fs: 44 }] }, { x: 780, y: 1060, s: 1.8, r: -2 });
// 2. нотариус → стоп-кадр
const NOT_MID = (a, b, c) => ch("perekup", spk(a, "notary"), 470, 1300, 600, NOTARY, { armR: -40 }, { rim: "#fff2c0", side: 1, z: 4 }) + T(b, 210, 1760, 760, {}, { rim: "#fff2c0", side: 1, z: 7 })
  + Z(c, {}, 880, 1740, 760, {}, { rim: "#fff2c0", side: -1, z: 7 });
const NOT_L = glow(810, 430, 320, "#fff6d8", .4) + beam([[640, 220], [1000, 220], [900, 1700], [300, 1700]], "#fff6d8", .14);
mount("s2", { bg: "notarius", grade: "day", mid: NOT_MID("nt", "tn", "zn"), lights: NOT_L,
  bubbles: [{ id: "n1", p: "nt", html: "Пункт седьмой: машины<br>покупаете <em>только вдвоём.</em>", fs: 38 }] }, { x: 540, y: 1160, s: 1.06 });
mount("s2f", { bg: "notarius", grade: "day", freeze: 1, mid: NOT_MID("nf", "tf", "zf"), lights: NOT_L,
  over: `<div style="position:absolute;inset:0;z-index:60"><div id="ctr" style="position:absolute;left:0;top:0">${CONTRACT(250, 1220, 560)}</div>
    <div id="stop" style="position:absolute;left:60px;top:420px;font-family:Unbounded;font-weight:900;font-size:90px;color:#ff3b30;border:10px solid #ff3b30;border-radius:20px;padding:0 24px;transform:rotate(-8deg)">СТОП</div>
    <div class="hand wr" id="ub" style="left:60px;top:590px;font-size:96px;color:#ff3b30;-webkit-text-stroke:3px #151515;transform:rotate(-4deg)">50 / 50 —<br>и убытки тоже!</div></div>` }, { x: 540, y: 1160, s: 1.06 });
// 3. разделённый экран (две сцены в одном кадре) → неоновый гараж
root.insertAdjacentHTML("beforeend", `<div id="split"><div class="divider"></div></div>`);
const SPLIT = $("#split");
{ const H = HOLDPHONE("tolyan", spk("tl", "tolyan"), 540, 1960, 1680, null, BOT49(), { rim: "#fff2c0", side: 1, head: -4 });
  mount("s3L", { bg: "biblioteka", grade: "day", farBlur: 8, mid: H.mid, lights: H.lights, bx: [300, 780],
    bubbles: [{ id: "t2", p: "tl", html: "Бот нашёл такой же:<br><em>1 200 000,<br>одна хозяйка.</em>", fs: 32 }] }, { x: 540, y: 980, s: 1.02 }, SPLIT); }
mount("s3R", { bg: "neongarazh", grade: "night", bx: [300, 780],
  mid: car(CLSW, 250, 1640, 700, { z: 4, sheen: .6, refl: 1 }) + ch("perekup", spk("vg", "vitalik"), 420, 1680, 720, VITALIK, { armL: 40 }, { rim: "#ff3bd0", side: 1, z: 5 })
    + Z("zg", { item: "phone" }, 650, 1760, 780, {}, { rim: "#5ad0ff", side: -1, z: 7 }), lights: NEON,
  bubbles: [{ id: "z2", p: "zg", html: "Виталик отдаёт CLS!<br><em>В идеале!<br>1 250 000.</em>", fs: 32 }] }, { x: 560, y: 1200, s: 1.08 }, SPLIT);
SC.s3L.style.transform = "translateX(-270px)"; SC.s3R.style.transform = "translateX(270px)"; SC.s3L.style.opacity = SC.s3R.style.opacity = 1;
SPLIT.insertBefore(SC.s3L, SPLIT.firstChild); SPLIT.insertBefore(SC.s3R, SPLIT.firstChild.nextSibling);
const GARAGE = (v, t, vpose, tpose, vlook) => car(CLSW, 250, 1640, 700, { z: 4, sheen: .4, refl: 1 }) + ch("perekup", spk(v, "vitalik"), 420, 1700, 760, { ...VITALIK, look: vlook || "grin" }, vpose, { rim: "#ff3bd0", side: 1, z: 6 })
  + T(t, 860, 1760, 740, tpose, { rim: "#5ad0ff", side: -1, z: 7 }) + INHAND(860, 1760, 740, -60, 90, GAUGE, 9);
mount("s3b", { bg: "neongarazh", grade: "night", mid: GARAGE("vh", "th", { armL: 150 }, { armR: -60 }), lights: NEON,
  bubbles: [{ id: "v1", p: "vh", html: "Пацаны, машина — как с завода!<br><em>Не битая, не крашеная.</em>", fs: 38 }] }, { x: 560, y: 1180, s: 1.08 });
// 4. толщиномер крупно → Толян
mount("s4", { grade: "day", far: GAUGEINSERT(), farBlur: 0,
  over: `<div class="hand wr" id="g1" style="left:60px;top:430px;z-index:60;font-size:64px;color:#2f6db5;transform:rotate(-5deg)">крыша — 110 ✓</div><div class="hand wr" id="g2" style="left:560px;top:1300px;z-index:60;font-size:96px;color:#ff3b30;transform:rotate(-6deg)">шпаклёвка!</div>` }, { x: 540, y: 960, s: 1 });
mount("s4b", { bg: "neongarazh", grade: "night", mid: GARAGE("vi", "ti", {}, { armR: -60, head: -6 }, "o"), lights: NEON,
  bubbles: [{ id: "t3", p: "ti", html: "Виталик, «как с завода» —<br><em>это с какого?</em>", fs: 42 }] }, { x: 760, y: 1120, s: 1.7, r: 2 });
// 5. чёрный CLS из бота → продано
mount("s5", { bg: "promzona", grade: "dawn",
  mid: car(CLSB, 140, 1600, 760, { z: 4, sheen: .5, refl: 1 }) + T("tp", 830, 1760, 740, { armR: -60 }, { rim: "#ffc46a", side: -1, z: 7 }) + INHAND(830, 1760, 740, -60, 90, GAUGE, 9)
    + `<div class="hand wr" id="rod" style="left:180px;top:1080px;z-index:9;font-size:72px;color:#4cd964;-webkit-text-stroke:2px #151515;transform:rotate(-5deg)">105 · 110 · 108 — родная!</div>`,
  lights: glow(980, 545, 120, "#fff6c8", .6) + glow(700, 700, 420, "#ffb36a", .35) }, { x: 540, y: 1220, s: 1.06 });
mount("s5b", { bg: "promzona", grade: "dawn",
  mid: car(CLSB, 140, 1600, 760, { z: 4, sheen: .7, refl: 1 }) + G("sold", C.tag(470, 1250, "ПРОДАНО", "+180 000", -6, 6, "#4cd964"), 6) + G("cash", CASHSPLIT(), 14)
    + Z("zp", { look: "grin" }, 300, 1760, 760, { armL: 150, armR: -150 }, { rim: "#ffc46a", side: 1, z: 7 }) + T("tq", 830, 1760, 740, {}, { rim: "#ffc46a", side: -1, z: 7 }),
  lights: glow(700, 700, 420, "#ffb36a", .35), bubbles: [{ id: "z3", p: "zp", html: "Студент… пункт седьмой —<br><em>гениальный пункт.</em>", fs: 40 }] }, { x: 540, y: 1220, s: 1.06 });
// 6. итог: Жора тайком звонит Виталику → карточка
const SOFA = `<div class="prop" style="left:-40px;top:1460px;width:520px;height:360px;z-index:9"><svg viewBox="0 0 520 360"><path d="M0 360 V120 q0 -60 60 -60 h400 q60 0 60 60 V360 z" fill="#6a2a8a" stroke="#151515" stroke-width="10"/><path d="M0 200 h520" stroke="#4a1a6a" stroke-width="14"/></svg></div>`;
mount("s6", { bg: "bowling", grade: "night",
  mid: T("tz", 760, 1500, 560, { armR: -150 }, { rim: "#5ad0ff", side: -1, z: 4 }) + G("ball6", INHAND(760, 1500, 560, -150, 90, BALL, 5), 5)
    + Z("zz", { item: "phone", look: "o" }, 300, 1760, 780, { head: 12 }, { rim: "#ff3bd0", side: 1, z: 7 }) + SOFA, lights: BOWL_L,
  bubbles: [{ id: "z4", p: "zz", html: "<span style='font-size:28px;color:#8b93a3'>(шёпотом)</span><br>Виталик… белый ещё продаёшь?<br><em>Только тихо.</em>", fs: 36 }] }, { x: 480, y: 1180, s: 1.12 });
mount("s6b", { bg: "bowling", grade: "night",
  over: CTA49.replace('<div style="position:absolute;', '<div id="cta" style="opacity:0;position:absolute;')
    + `<div class="hand wr" id="hook" style="left:70px;top:520px;z-index:62;font-size:84px;color:#ffd23f;-webkit-text-stroke:3px #151515;transform:rotate(-5deg)">Часть 12:<br>Жора нарушает пункт 7</div>`,
  mid: T("tz2", 760, 1500, 560, {}, { rim: "#5ad0ff", side: -1, z: 4 }) + Z("zz2", { item: "phone", look: "grin" }, 300, 1760, 780, { head: 12 }, { rim: "#ff3bd0", side: 1, z: 7 }) + SOFA,
  lights: BOWL_L }, { x: 480, y: 1180, s: 1.12 });

$(".stage").insertAdjacentHTML("beforeend", `<div id="cnt">💰 <span id="cv">640 000</span> ₽ <em id="cd"></em></div>`);
$("#end h2").innerHTML = E.end;

window.build = R => {
  const tl = R.tl;
  const { pop } = common(R, { shake: 0 });
  for (const el of Object.values(SC)) {
    el.sheens = [...el.querySelectorAll(".sheen")];
    el.glows = [...el.querySelectorAll(".lights .glow")].map(g => ({ g, o: +g.style.opacity }));
  }
  const talk = (lv, f) => lv > .28 && !(lv < .55 && f % 3 === 2);
  const MOOD = { zz: "o", vi: "o" };
  R.hooks.push(t => {
    const f = Math.floor(t * 30), splitOn = +getComputedStyle(SPLIT).opacity > 0;
    for (const [n, el] of Object.entries(SC)) {
      const vis = n.startsWith("s3L") || n.startsWith("s3R") ? splitOn : +el.style.opacity > 0;
      if (!vis) continue;
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
  window.MUSIC = { style: "bed", bpm: 90, end: R.dur - 1.2 };   // фоновой музыки нет (MUSIC_VOL=0)

  const cam = n => SC[n].cam;
  const show = (n, at) => tl.set(SC[n], { opacity: 1 }, at);
  const cut = (from, to, at) => { tl.set(SC[from] || from, { opacity: 0 }, at).set(SC[to] || to, { opacity: 1 }, at); R.sfx("tick", at, .4); };
  const swap = (from, to, at) => {
    const A = SC[from] || from, B = SC[to] || to;
    tl.set(B, { opacity: 1, x: 1080, filter: "blur(14px)" }, at)
      .to(A, { x: -1080, filter: "blur(14px)", duration: .35, ease: "power3.in" }, at)
      .to(B, { x: 0, filter: "blur(0px)", duration: .38, ease: "power3.out" }, at + .12)
      .set(A, { opacity: 0, x: 0, filter: "none" }, at + .5).set(B, { filter: "none" }, at + .51);
    R.sfx("whoosh", at, .6);
  };
  const move = (n, to, at, d, ease = "power2.inOut") => tl.to(cam(n), { ...to, duration: d, ease }, at);
  const write = (sel, at, d = .5) => { tl.fromTo(sel, { clipPath: "inset(-20% 100% -20% -5%)" }, { clipPath: "inset(-20% -5% -20% -5%)", duration: d, ease: "power1.inOut", immediateRender: false }, at); R.sfx("type", at, .5); R.sfx("type", at + d * .5, .4); };
  const slam = (sel, at, sfx = "impact", from = 1.8, origin) => { if (origin) gsap.set(sel, { transformOrigin: origin });
    tl.fromTo(sel, { opacity: 0, scale: from }, { opacity: 1, scale: 1, duration: .18, ease: "power4.out", immediateRender: false }, at); R.sfx(sfx, at + .02, .7); };
  const ids = E.lines.map(l => l.id), nxt = l => ids[ids.indexOf(l) + 1];
  const bub = (l, until) => pop("#b_" + l, st[l] - .05, until ?? Math.min(en[l] + .8, nxt(l) ? st[nxt(l)] - .1 : en[l] + 1));

  // 1. боулинг
  show("s1", 0); tl.to("#title", { opacity: 0, y: -50, duration: .25 }, 1.8); tl.to("#cnt", { opacity: 1, duration: .3 }, 2.0);
  move("s1", { x: 520, s: 1.16 }, 0, en.z1, "power1.inOut");
  bub("z1", en.z1 + .2);
  const ROLL = en.z1 - .4;                       // шар катится по дорожке к кеглям
  tl.to("#ball1", { x: 180, y: -820, scale: .25, transformOrigin: "440px 1400px", duration: .8, ease: "power1.in" }, ROLL); R.sfx("riser", ROLL, .4);
  const HIT = ROLL + .8; cut("s1", "s1b", HIT - .05);
  gsap.set("#flash1", { opacity: 0 }); tl.fromTo("#flash1", { opacity: 1 }, { opacity: 0, duration: .6, immediateRender: false }, HIT); R.sfx("boom", HIT, .8); R.shake(cam("s1b"), HIT, .8, .4);
  [...document.querySelectorAll("#pins .pin")].forEach((p, k) => { const dx = [0, -1, 1, -2, 0, 2, -3, -1, 1, 3][k];
    tl.to(p, { x: dx * 70 + (k % 2 ? 30 : -30), y: -(120 + (k % 3) * 90), rotation: dx * 60 + (k % 2 ? 140 : -140), duration: .7, ease: "power2.out" }, HIT)
      .to(p, { y: 120, duration: .5, ease: "power2.in" }, HIT + .7); });
  move("s1b", { s: 1.9 }, HIT, en.t1 - HIT + .3, "none");
  bub("t1", st.n1 - .45);
  // 2. нотариус → стоп-кадр
  const SW2 = st.n1 - .4; swap("s1b", "s2", SW2);
  move("s2", { x: 500, y: 1100, s: 1.14 }, SW2, en.n1 - SW2 + .3, "none"); bub("n1", st.l1 - .15);
  cut("s2", "s2f", st.l1 - .1); tl.set(cam("s2f"), { x: 500, y: 1100, s: 1.14 }, st.l1 - .1); R.sfx("hit", st.l1 - .1, .8);
  gsap.set(["#stop", "#ctr"], { opacity: 0 });
  slam("#stop", st.l1 + .05, "impact", 2.2, "200px 470px");
  tl.fromTo("#ctr", { opacity: 0, y: 200, rotation: 8 }, { opacity: 1, y: 0, rotation: 0, duration: .4, ease: "back.out(1.6)", immediateRender: false }, W("l1", "прибыл")); R.sfx("swish", W("l1", "прибыл"), .5);
  write("#ub", W("l1", "убыт"), .7);
  // 3. разделённый экран → гараж Виталика
  const SW3 = st.z2 - .4; swap("s2f", SPLIT, SW3);
  move("s3R", { s: 1.14 }, SW3, en.t2 - SW3, "none"); move("s3L", { s: 1.08, y: 1000 }, SW3, en.t2 - SW3, "none");
  gsap.set("#n3", { opacity: 0 }); tl.fromTo("#n3", { opacity: 0, y: -40 }, { opacity: 1, y: 0, duration: .3, ease: "back.out(1.8)", immediateRender: false }, st.t2 - .3); R.sfx("ping", st.t2 - .3, .8);
  bub("z2", st.t2 - .1); bub("t2", st.v1 - .45);
  const SW3b = st.v1 - .4; swap(SPLIT, "s3b", SW3b);
  move("s3b", { x: 520, s: 1.14 }, SW3b, en.v1 - SW3b + .3, "none"); bub("v1", st.l2 - .15);
  // 4. толщиномер
  cut("s3b", "s4", st.l2 - .1); move("s4", { s: 1.08, y: 1000 }, st.l2 - .1, en.l2 - st.l2 + .3, "none");
  tl.set("#gnum", { textContent: "110", color: "#2f6db5" }, st.l2 - .1); write("#g1", W("l2", "110") + .1, .5);
  R.count($("#gnum"), W("l2", "1200") - .5, 110, 1200, .6); tl.set("#gnum", { color: "#c0392b" }, W("l2", "1200")); R.sfx("ping", W("l2", "1200"), .7);
  write("#g2", W("l2", "шпакл"), .6);
  cut("s4", "s4b", st.t3 - .1); move("s4b", { s: 1.8 }, st.t3 - .1, en.t3 - st.t3 + .4, "none"); bub("t3", st.l3 - .45);
  // 5. чёрный CLS из бота → продано
  const SW5 = st.l3 - .4; swap("s4b", "s5", SW5);
  move("s5", { s: 1.12, y: 1200 }, SW5, 3, "none"); write("#rod", W("l3", "родн") - .1, .7);
  const C5 = W("l3", "продал") - .2; cut("s5", "s5b", C5); tl.set(cam("s5b"), { s: 1.12, y: 1200 }, C5);
  gsap.set(["#sold", "#cash"], { opacity: 0 }); slam("#sold", C5 + .25, "clack", 2, "560px 1280px");
  tl.fromTo("#cash", { opacity: 0, y: 80 }, { opacity: 1, y: 0, duration: .35, ease: "back.out(1.8)", immediateRender: false }, C5 + .6); R.sfx("pop", C5 + .6, .6);
  move("s5b", { s: 1.16 }, C5, en.z3 - C5 + .3, "none"); bub("z3", st.e1 - .45);
  // 6. итог и поворот
  const SW6 = st.e1 - .4; swap("s5b", "s6", SW6);
  R.count($("#cv"), W("e1", "730"), 640000, 730000, .9); tl.set("#cd", { textContent: "+90 000" }, W("e1", "730")); R.sfx("clack", W("e1", "730"), .6);
  tl.fromTo("#cnt", { scale: 1.25 }, { scale: 1, duration: .4, ease: "back.out(2)", immediateRender: false }, W("e1", "730"));
  tl.to("#ball6", { x: 60, y: -420, scale: .3, transformOrigin: "790px 1250px", duration: 1, ease: "power1.in" }, SW6 + 1.2);
  move("s6", { x: 360, y: 1260, s: 1.45 }, W("e1", "тем") - .2, 1.2);      // наезд на Жору за диванчиком
  bub("z4", st.end - .15);
  cut("s6", "s6b", st.end - .1); tl.set(cam("s6b"), { x: 360, y: 1260, s: 1.45 }, st.end - .1); move("s6b", { x: 480, y: 1180, s: 1.12 }, st.end - .1, .8);
  write("#hook", st.end + .2, .9);
  tl.fromTo("#cta", { opacity: 0, y: 80, scale: .9 }, { opacity: 1, y: 0, scale: 1, duration: .4, ease: "back.out(1.6)", immediateRender: false }, W("end", "подпиш") - .3);
  tl.to("#cnt", { opacity: 0, duration: .2 }, en.end + .1);
  ending(R, en.end + .3);
};

// ── ep49b «Архив»: быстрая уникализация — меняется только заставка ──
$("#title .a").textContent = "ПУНКТ 7"; $("#title .a").style.cssText = "font-size:110px;background:#2f4fb8;color:#fbfaf3";
$("#title .b").textContent = "ДОГОВОРА"; $("#title .b").style.cssText = "font-size:60px;background:#fbfaf3;color:#2f4fb8";
