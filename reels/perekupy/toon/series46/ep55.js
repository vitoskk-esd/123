// «ТОЛЯН: СО СТА ТЫСЯЧ · 14» — «Ва-банк» (киношный формат ../cine.js). Сцены — как в утверждённой раскадровке board.html.
// Крыша ночью: бот прислал Lexus NX 1 600 000 (рынок 2 100 000), все деньги — фишки, ВА-БАНК → Аркаша улетает, машинка считает 1 600 000, капитал 0 →
// утром Check Engine, «мы всё потеряли!» → автоэлектрик: P0340, датчик 3 000 ₽ → Олегу бот прислал Лексус через секунду: 1 830 000 → капитал 930 000.
// Последний кадр — только карточка бота. Без фоновой музыки.
$("#title .a").textContent = E.rubric; $("#title .b").textContent = E.subtitle; $("#tag span").textContent = "ва-банк";
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
const spk = (p, v) => (SPK[p] = v, p);
const T = (p, x, foot, h, pose = {}, extra = {}) => ch("tolyan", spk(p, "tolyan"), x, foot, h, null, pose, extra);
const Z = (p, x, foot, h, o = {}, pose = {}, extra = {}) => ch("perekup", spk(p, "zhora"), x, foot, h, { ...ZHORA, ...o }, pose, extra);
const ROOF_L = glow(830, 230, 260, "#f4f0d8", .35) + glow(540, 1000, 500, "#5a5ad0", .2);
const KOT_L = glow(880, 200, 360, "#fff3c4", .45);
const EL_L = glow(780, 190, 300, "#fff6c8", .5) + glow(720, 830, 160, "#5ab0e8", .4);
const BC_L = glow(540, 700, 480, "#ffb36a", .3);

// 1. крыша: бот → ва-банк
{ const H = HOLDPHONE("tolyan", spk("tn", "tolyan"), 540, 1960, 1680, null, NXCARD(), { rim: "#9fb0ff", side: 1 });
  mount("s1", { bg: "kryshanoch", grade: "night", farBlur: 9, mid: H.mid, lights: H.lights }, { x: 540, y: 960, s: 1 }); }
mount("s1b", { bg: "kryshanoch", grade: "night", over: STAMP("ВА-БАНК", 120, 340, "stamp", -8),
  mid: T("tr", 260, 1760, 740, {}, { rim: "#9fb0ff", side: 1, z: 7 }) + Z("zr", 820, 1770, 760, { look: "o" }, {}, { rim: "#9fb0ff", side: -1, z: 7 }) + CHIPS(360, 1440), lights: ROOF_L,
  bubbles: [{ id: "z1", p: "zr", html: "Студент…<br><em>или пан, или пропал.</em>", fs: 46 }, { id: "t1", p: "tr", html: "Пан.<br><em>Берём.</em>", fs: 54 }] }, { x: 540, y: 1200, s: 1.08 });
// 2. коттеджи: Аркаша → машинка для денег
mount("s2", { bg: "kottedzh", grade: "day",
  mid: car(NX, 60, 1600, 660, { z: 4, sheen: .7 }) + ch("perekup", spk("ak", "arkasha"), 860, 1760, 740, ARKASHA, { armR: -40 }, { rim: "#fff2c0", side: -1, z: 7 }) + INHAND(860, 1760, 740, -40, 140, SUITCASE, 9), lights: KOT_L,
  bubbles: [{ id: "a1", p: "ak", html: "Улетаю через три часа —<br><em>нужно срочно. Миллион шестьсот.</em>", fs: 38 }] }, { x: 580, y: 1200, s: 1.08 });
mount("s2b", { bg: "kottedzh", grade: "day", farBlur: 8, over: COUNTER(280, 900),
  mid: T("tk", 230, 1780, 720, {}, { rim: "#fff2c0", side: 1, z: 5 }) + Z("zk", 850, 1780, 740, { look: "o" }, {}, { rim: "#fff2c0", side: -1, z: 5 }), lights: KOT_L }, { x: 540, y: 1160, s: 1.04 });
// 3. утро: панель → паника
mount("s3", { grade: "day", far: DASH(), farBlur: 0 }, { x: 540, y: 960, s: 1 });
mount("s3b", { bg: "bcparking", grade: "dawn",
  mid: car(NX, 60, 1600, 660, { z: 4, sheen: .3 }) + Z("zp", 850, 1780, 760, { look: "o" }, { armL: 150, armR: -150 }, { rim: "#ffb36a", side: -1, z: 7 }) + T("tp", 560, 1770, 720, {}, { rim: "#ffb36a", side: -1, z: 6 }), lights: BC_L,
  bubbles: [{ id: "z2", p: "zp", html: "Студент,<br><em>мы всё потеряли!</em>", fs: 52 }] }, { x: 640, y: 1160, s: 1.5, r: 3 });
// 4. автоэлектрик: сканер → «заводи»
{ const H = HOLDPHONE("perekup", spk("rs", "rinat"), 540, 1960, 1680, RINAT, SCAN(), { rim: "#5ab0e8", side: 1 });
  mount("s4", { bg: "avtoelektrika", grade: "night", farBlur: 9, mid: H.mid, lights: H.lights }, { x: 540, y: 960, s: 1 }); }
mount("s4b", { bg: "avtoelektrika", grade: "night",
  mid: car(NX, 160, 1640, 680, { z: 4, sheen: .5 }) + G("hl", glow(250, 1450, 90, "#fff6c8", 0, 6) + glow(560, 1450, 90, "#fff6c8", 0, 6), 6)
    + ch("perekup", spk("rn", "rinat"), 240, 1760, 740, RINAT, { armR: -150 }, { rim: "#5ab0e8", side: 1, z: 7 }) + T("te", 880, 1780, 720, {}, { rim: "#5ab0e8", side: -1, z: 7 }), lights: EL_L,
  bubbles: [{ id: "r1", p: "rn", html: "Датчик за три тысячи.<br><em>Ерунда. Заводи.</em>", fs: 44 }] }, { x: 560, y: 1200, s: 1.08 });
// 5. покупатель из бота → продано
{ const H = HOLDPHONE("perekup", spk("ob", "oleg"), 540, 1960, 1680, OLEG, BUYCARD(), { rim: "#ffb36a", side: 1 });
  mount("s5", { bg: "bcparking", grade: "dawn", farBlur: 9, mid: H.mid, lights: H.lights,
    bubbles: [{ id: "o1", p: "ob", html: "Мне бот прислал ваш Лексус<br><em>через секунду. Беру!</em>", fs: 40 }] }, { x: 540, y: 960, s: 1 }); }
mount("s5b", { bg: "bcparking", grade: "dawn",
  mid: car(NX, 60, 1600, 660, { z: 4, sheen: .7 }) + G("sold", C.tag(300, 1260, "ПРОДАНО", "1 830 000", -6, 6, "#4cd964"), 6) + ch("perekup", spk("ol", "oleg"), 600, 1770, 740, OLEG, { armR: -60 }, { rim: "#ffb36a", side: 1, z: 7 })
    + T("to", 880, 1780, 720, { armL: 60 }, { rim: "#ffb36a", side: -1, z: 7 }), lights: BC_L }, { x: 600, y: 1200, s: 1.08 });
// 6. крыша: итог → карточка бота (другой план, без скачка)
mount("s6", { bg: "kryshanoch", grade: "night",
  mid: T("tf", 300, 1760, 740, {}, { rim: "#9fb0ff", side: 1, z: 7 }) + Z("zf", 780, 1770, 760, { look: "grin" }, { armR: -70 }, { rim: "#9fb0ff", side: -1, z: 7 }), lights: ROOF_L,
  bubbles: [{ id: "z3", p: "zf", html: "Студент…<br><em>я чуть не поседел.</em>", fs: 46 }] }, { x: 540, y: 1200, s: 1.08 });
mount("s6b", { bg: "kryshanoch", grade: "night", over: CTA55.replace('<div style="position:absolute;', '<div id="cta" style="opacity:0;position:absolute;'),
  mid: T("tf2", 300, 1760, 740, {}, { rim: "#9fb0ff", side: 1, z: 7 }) + Z("zf2", 780, 1770, 760, { look: "grin" }, {}, { rim: "#9fb0ff", side: -1, z: 7 }), lights: ROOF_L }, { x: 540, y: 1100, s: .96 });

$(".stage").insertAdjacentHTML("beforeend", `<div id="cnt">💰 <span id="cv">815 000</span> ₽ <em id="cd"></em></div>`);
$("#end h2").innerHTML = E.end;

window.build = R => {
  const tl = R.tl;
  const { pop } = common(R, { shake: 0 });
  for (const el of Object.values(SC)) {
    el.sheens = [...el.querySelectorAll(".sheen")];
    el.glows = [...el.querySelectorAll(".lights .glow")].map(g => ({ g, o: +g.style.opacity }));
  }
  const talk = (lv, f) => lv > .28 && !(lv < .55 && f % 3 === 2);
  const MOOD = { zr: "o", zk: "o", zp: "o" };
  R.hooks.push(t => {
    const f = Math.floor(t * 30);
    for (const el of Object.values(SC)) {
      const on = +el.style.opacity > 0;
      el.style.display = on ? "" : "none";          // невидимые сцены не держим в отрисовке (id фонов уникальны — C.bgSvg)
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
  const capTo = (from, to, at, d, txt) => { R.count($("#cv"), at, from, to, d); tl.set("#cd", { textContent: txt }, at); tl.fromTo("#cnt", { scale: 1.25 }, { scale: 1, duration: .4, ease: "back.out(2)", immediateRender: false }, at); R.sfx("clack", at, .6); };

  // 1. крыша: карточка бота → фишки «ва-банк»
  gsap.set(SC.s1, { opacity: 1 }); SC.s1.style.display = "";        // первый кадр (обложка) — сразу сцена
  show("s1", 0); tl.to("#title", { opacity: 0, y: -50, duration: .25 }, 1.6); tl.to("#cnt", { opacity: 1, duration: .3 }, 1.8);
  gsap.set("#nnx", { opacity: 0 }); const NX1 = W("l0", "бот") - .1;
  tl.fromTo("#nnx", { opacity: 0, y: -50 }, { opacity: 1, y: 0, duration: .3, ease: "back.out(1.8)", immediateRender: false }, NX1); R.sfx("ping", NX1, .9);
  move("s1", { s: 1.08, y: 1000 }, 0, en.l0 + .3, "none");
  const SW1 = st.l0b - .4; swap("s1", "s1b", SW1); move("s1b", { s: 1.16 }, SW1, en.t1 - SW1 + .3, "none");
  gsap.set("#stamp", { opacity: 0 });
  tl.fromTo("#chips", { x: -300, opacity: 0 }, { x: 0, opacity: 1, duration: .5, ease: "power3.out", immediateRender: false }, W("l0b", "все") - .1); R.sfx("swish", W("l0b", "все"), .6);
  bub("z1", st.t1 - .1); bub("t1", st.a1 - .45);
  const VB = st.t1 + .05; tl.fromTo("#stamp", { opacity: 0, scale: 2.4 }, { opacity: 1, scale: 1, duration: .18, ease: "power4.out", immediateRender: false }, VB); R.sfx("impact", VB, .8); R.shake(cam("s1b"), VB, .8, .35);
  // 2. Аркаша → машинка: 0 → 1 600 000, капитал 815 → 0
  const SW2 = st.a1 - .4; swap("s1b", "s2", SW2); move("s2", { s: 1.14 }, SW2, en.a1 - SW2 + .3, "none"); bub("a1", st.l1 - .15);
  cut("s2", "s2b", st.l1 - .1); move("s2b", { s: 1.1 }, st.l1 - .1, en.l1 - st.l1 + .3, "none");
  R.count($("#mcount"), st.l1, 0, 1600000, 1.6);
  document.querySelectorAll("#scene .bill").forEach((b, j) => { for (let k = 0; k < 4; k++) tl.fromTo(b, { rotationX: 0 }, { rotationX: 80, duration: .1, yoyo: true, repeat: 1, ease: "none", immediateRender: false }, st.l1 + k * .4 + j * .05); });
  R.sfx("type", st.l1 + .1, .5); R.sfx("type", st.l1 + .6, .5); R.sfx("type", st.l1 + 1.1, .5); R.sfx("ping", st.l1 + 1.65, .7);
  capTo(815000, 0, W("l1", "ноль") - .2, .6, "");
  // 3. панель: Check Engine мигает → паника
  const SW3 = st.l2 - .4; swap("s2b", "s3", SW3); move("s3", { s: 1.08 }, SW3, en.l2 - SW3 + .3, "none");
  gsap.set("#ce", { opacity: .25 }); const CE = W("l2", "панел") - .1;
  for (let k = 0; k < 6; k++) tl.set("#ce", { opacity: k % 2 ? .25 : 1 }, CE + k * .25);
  tl.set("#ce", { opacity: 1 }, CE + 1.5); R.sfx("bleep", CE, .6); R.sfx("bleep", CE + .5, .6);
  cut("s3", "s3b", st.z2 - .1); R.shake(cam("s3b"), st.z2, 1, .4); move("s3b", { s: 1.6 }, st.z2 - .1, en.z2 - st.z2 + .4, "none"); bub("z2", st.l3 - .45);
  // 4. автоэлектрик: код → цена → фары зажглись
  const SW4 = st.l3 - .4; swap("s3b", "s4", SW4); move("s4", { s: 1.07, y: 1000 }, SW4, en.l3 - SW4 + .3, "none");
  gsap.set(["#scan1", "#scan2"], { opacity: 0 });
  tl.fromTo("#scan1", { opacity: 0 }, { opacity: 1, duration: .15, immediateRender: false }, W("l3", "код") - .1); R.sfx("bleep", W("l3", "код"), .5);
  cut("s4", "s4b", st.r1 - .1); move("s4b", { s: 1.14 }, st.r1 - .1, en.r1 - st.r1 + .3, "none"); bub("r1", st.l4 - .15);
  tl.set("#hl .glow", { opacity: .9 }, W("r1", "завод") + .3); R.sfx("ping", W("r1", "завод") + .3, .8);
  // 5. покупатель из бота → продано
  const SW5 = st.l4 - .4; swap("s4b", "s5", SW5); move("s5", { s: 1.07, y: 1000 }, SW5, en.o1 - SW5, "none");
  gsap.set("#nby", { opacity: 0 }); const NB = W("l4", "бот") - .1;
  tl.fromTo("#nby", { opacity: 0, y: -50 }, { opacity: 1, y: 0, duration: .3, ease: "back.out(1.8)", immediateRender: false }, NB); R.sfx("ping", NB, .9);
  bub("o1", st.l5 - .15);
  cut("s5", "s5b", st.l5 - .1); move("s5b", { s: 1.14 }, st.l5 - .1, en.l5 - st.l5 + .3, "none");
  gsap.set("#sold", { opacity: 0 });
  tl.fromTo("#sold", { opacity: 0, scale: 2 }, { opacity: 1, scale: 1, duration: .18, ease: "power4.out", immediateRender: false, transformOrigin: "400px 1290px" }, st.l5 + .05); R.sfx("clack", st.l5 + .1, .7);
  capTo(0, 930000, W("l5", "капит"), .9, "+115 000");
  // 6. крыша: Жора выдыхает → карточка бота
  const SW6 = st.z3 - .4; swap("s5b", "s6", SW6); move("s6", { s: 1.14 }, SW6, en.z3 - SW6 + .3, "none"); bub("z3", st.end - .15);
  cut("s6", "s6b", st.end - .1); move("s6b", { s: 1.04, y: 1140 }, st.end - .1, en.end - st.end + .6, "none");
  tl.fromTo("#cta", { opacity: 0, y: 80, scale: .9 }, { opacity: 1, y: 0, scale: 1, duration: .4, ease: "back.out(1.6)", immediateRender: false }, W("end", "подпиш") - .3);
  tl.to("#cnt", { opacity: 0, duration: .2 }, en.end + .1);
  ending(R, en.end + .3);
};
