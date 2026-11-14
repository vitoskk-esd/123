// «СВИДАНИЕ: ЖОРА И КАМРИ» (ep59, киношный формат ../cine.js, отдельный ролик). Сцены — как в утверждённой раскадровке board.html.
// ОБЛОЖКА (кадр 0): Жора с телефоном — анкета Вики «Продаю Камри 2017» + плашка «СВИДАНИЕ: / ЖОРА И КАМРИ» (гаснет к 1,6 с; правило владельца 14.11)
// → прихожая: рубашка и цена Камри → ресторан, шкала романтики падает → салфетка с торгом → «ты со мной или с машиной?» → Стасу бот прислал
// объявление → звонок → парковка: деньги на капот → счёт 4 800 → Камри уезжает → «Стас… опять бот» → финальная фраза Лиса про бот + карточка.
$("#title .a").textContent = E.rubric; $("#title .b").textContent = E.subtitle; $("#tag span").textContent = "свидание";
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
const VK = (p, x, foot, h, pose = {}, extra = {}) => ch("vika", spk(p, "vika"), x, foot, h, null, pose, extra);
const PR_L = glow(180, 360, 220, "#ffe8a8", .45) + glow(900, 360, 220, "#ffe8a8", .45);
const RS_L = glow(540, 1290, 260, "#ffb84a", .45) + glow(90, 600, 160, "#ffb84a", .4) + glow(990, 600, 160, "#ffb84a", .4);
const RP_L = glow(540, 470, 420, "#ff3bd0", .25) + glow(40, 870, 160, "#fff6c8", .5) + glow(1040, 870, 160, "#fff6c8", .5);
const DATE = (k, vpose = {}, zo = {}, extra = "") => VK("vk" + k, 300, 1650, 760, vpose, { rim: "#ffb84a", side: 1, z: 7 }) + Z("zr" + k, 790, 1660, 760, zo, {}, { rim: "#ffb84a", side: -1, z: 7 }) + RTABLE(9) + extra;
const SPEEDL = () => `<div id="spd" style="position:absolute;inset:0;z-index:9">${Array.from({ length: 12 }, (_, k) => `<div style="position:absolute;left:${(k * 173) % 1000}px;top:${1100 + (k * 97) % 500}px;width:${160 + (k * 53) % 200}px;height:6px;border-radius:3px;background:#ffffffaa"></div>`).join("")}</div>`;

// 1. обложка: анкета → Жора у зеркала
{ const H = HOLDPHONE("perekup", spk("zh", "zhora"), 540, 1960, 1680, ZHORA, DATING(), { rim: "#ffe8a8", side: 1 });
  mount("s1", { bg: "prihozhaya", grade: "warm", farBlur: 8, mid: H.mid, lights: H.lights }, { x: 540, y: 960, s: 1 }); }
mount("s1b", { bg: "prihozhaya", grade: "warm", mid: Z("zm", 540, 1820, 820, { look: "grin" }, { armR: -60 }, { rim: "#ffe8a8", side: 1, z: 7 })
  + G("mkt", C.tag(560, 640, "Камри 2017", "рынок ≈ 2 150 000", 4, 9), 9), lights: PR_L }, { x: 540, y: 1150, s: 1.04 });
// 2. ресторан: шкала романтики
mount("s2", { bg: "restoran", grade: "warm", over: LOVEMETER(830, 420, 1, "love"), mid: DATE("a", { armR: -40 }, { look: "grin" }), lights: RS_L,
  bubbles: [{ id: "v1", p: "vka", html: "Расскажи о себе,<br><em>Жора.</em>", fs: 46 }, { id: "z1", p: "zra", html: "А пробег какой?<br><em>Крашеная?</em>", fs: 48 },
    { id: "v1b", p: "vka", html: "Я вообще-то<br><em>про себя спрашивала.</em>", fs: 42 }] }, { x: 520, y: 1180, s: 1.06 });
// 3. салфетка с торгом
mount("s3", { far: NAPKIN(), farBlur: 0, bubbles: [{ id: "z2", at: [540, 1500], html: "Торг — сто пятьдесят.<br><em>И ужин за мой счёт!</em>", fs: 44 }] }, { x: 540, y: 960, s: 1 });
// 4. «ты со мной или с машиной?»
mount("s4", { bg: "restoran", grade: "warm", over: LOVEMETER(830, 420, .3, "love2"), mid: VK("vkc", 420, 1880, 1000, { armR: -150 }, { rim: "#ffb84a", side: 1, z: 7 }), lights: RS_L,
  bubbles: [{ id: "v2", p: "vkc", html: "Жора, ты сейчас со мной<br><em>или с машиной?</em>", fs: 44 }, { id: "z4", at: [700, 1150], html: "С тобой, конечно!<br><em>А ПТС оригинал?</em>", fs: 42 }] }, { x: 540, y: 1150, s: 1.1 });
// 5. Стасу бот прислал объявление → звонок
{ const H = HOLDPHONE("perekup", spk("sp", "stas"), 540, 1960, 1680, STAS, CAMCARD(), { rim: "#ff7ae6", side: 1 });
  mount("s5", { bg: "restoranpark", grade: "night", farBlur: 9, mid: H.mid, lights: H.lights,
    bubbles: [{ id: "s1", p: "sp", html: "Добрый вечер! Камри ещё продаётся?<br><em>Еду!</em>", fs: 38 }] }, { x: 540, y: 960, s: 1 }); }
mount("s6", { bg: "restoran", grade: "warm", mid: DATE("d", { phone: 1 }, { look: "o" }), lights: RS_L,
  bubbles: [{ id: "v3", p: "vkd", html: "Жора, извини —<br><em>покупатель приехал.</em>", fs: 44 }] }, { x: 540, y: 1180, s: 1.06 });
// 6. парковка: деньги на капот
mount("s7", { bg: "restoranpark", grade: "night",
  mid: car(CAM, 0, 1640, 740, { z: 4, sheen: .6 }) + `<div class="prop" id="money" style="left:330px;top:1330px;width:150px;height:125px;z-index:6;transform:rotate(-8deg)">${MONEY}</div>`
    + ch("perekup", spk("sk", "stas"), 880, 1780, 740, STAS, { armR: -60 }, { rim: "#ff7ae6", side: -1, z: 7 }) + VK("vke", 600, 1790, 720, {}, { rim: "#ff7ae6", side: 1, z: 7 }), lights: RP_L,
  bubbles: [{ id: "s2", p: "sk", html: "Беру без торга.<br><em>Подвезти вас?</em>", fs: 44 }, { id: "v4", p: "vke", html: "С удовольствием!", fs: 48 }] }, { x: 560, y: 1200, s: 1.06 });
// 7. счёт → Камри уезжает → Жора один
mount("s8", { bg: "restoran", grade: "warm",
  mid: Z("zf", 790, 1660, 760, { look: "o" }, {}, { rim: "#ffb84a", side: -1, z: 7 }) + RTABLE(9) + ch("perekup", spk("wt", "waiter"), 190, 1900, 940, WAITER, { armR: -70 }, { rim: "#ffb84a", side: 1, z: 11 })
    + INHAND(190, 1900, 940, -70, 170, BILL, 12), lights: RS_L,
  bubbles: [{ id: "w1", p: "wt", html: "Ваш счёт —<br><em>четыре восемьсот.</em>", fs: 44 }] }, { x: 540, y: 1180, s: 1.06 });
mount("s9", { bg: "restoranpark", grade: "night", mid: G("drive", car(CAM, 100, 1600, 820, { z: 4, sheen: .8 }), 4) + SPEEDL(), lights: RP_L }, { x: 540, y: 1150, s: 1 });
mount("s10", { bg: "restoran", grade: "warm", mid: Z("zg", 540, 1900, 1000, { look: "o" }, { armL: 30 }, { rim: "#ffb84a", side: 1, z: 7 }), lights: RS_L,
  bubbles: [{ id: "z3", p: "zg", html: "Стас…<br><em>опять бот.</em>", fs: 52 }] }, { x: 540, y: 1150, s: 1.1 });
mount("s11", { bg: "restoranpark", grade: "night", over: CTA59.replace('<div style="position:absolute;', '<div id="cta" style="opacity:0;position:absolute;'), lights: RP_L }, { x: 540, y: 1000, s: .98 });

$("#end h2").innerHTML = E.end;

window.build = R => {
  const tl = R.tl;
  const { pop } = common(R, { shake: 0 });
  for (const el of Object.values(SC)) {
    el.sheens = [...el.querySelectorAll(".sheen")];
    el.glows = [...el.querySelectorAll(".lights .glow")].map(g => ({ g, o: +g.style.opacity }));
  }
  const talk = (lv, f) => lv > .28 && !(lv < .55 && f % 3 === 2);
  const MOOD = { zrd: "o", zf: "o", zg: "o" };
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
  const love = (id, to, at) => { tl.to(`#${id}f`, { height: `${Math.round(to * 100)}%`, duration: .5, ease: "power2.out" }, at); R.sfx("drop", at, .5);
    tl.fromTo(`#${id}`, { x: 0 }, { x: 10, duration: .06, yoyo: true, repeat: 5, ease: "none", immediateRender: false }, at); };

  // 1. обложка: плашка видна с первого кадра и гаснет к 1,6 с; анкета — «лайк»
  gsap.set(SC.s1, { opacity: 1 }); SC.s1.style.display = "";
  gsap.set("#cnt", { opacity: 0 });
  show("s1", 0); tl.to("#title", { opacity: 0, y: -50, duration: .25 }, 1.6);
  move("s1", { s: 1.08, y: 1000 }, 0, st.l0b, "none");
  const LK = W("l0", "камри"); tl.fromTo("#like", { scale: 1 }, { scale: 1.35, duration: .15, yoyo: true, repeat: 1, ease: "power2.out", immediateRender: false }, LK); R.sfx("pop", LK, .6);
  cut("s1", "s1b", st.l0b - .1); move("s1b", { s: 1.12 }, st.l0b - .1, en.l0b - st.l0b + .4, "none");
  gsap.set("#mkt", { opacity: 0 }); tl.fromTo("#mkt", { opacity: 0, scale: 1.6 }, { opacity: 1, scale: 1, duration: .2, ease: "back.out(2)", immediateRender: false, transformOrigin: "640px 680px" }, W("l0b", "цену")); R.sfx("clack", W("l0b", "цену"), .6);
  // 2. ресторан: романтика падает с каждым вопросом про машину
  const SW2 = st.v1 - .4; swap("s1b", "s2", SW2); move("s2", { s: 1.14 }, SW2, en.v1b - SW2 + .3, "none");
  bub("v1", st.z1 - .1); bub("z1", st.v1b - .1); bub("v1b", st.l1 + .6);
  love("love", .55, W("z1", "пробег")); love("love", .3, W("z1", "краш"));
  // 3. салфетка: строчки торга появляются по одной
  const SW3 = W("l1", "жора") - .15; cut("s2", "s3", SW3); R.sfx("swish", SW3, .5); move("s3", { s: 1.08 }, SW3, en.z2 - SW3 + .3, "none");
  gsap.set(["#n1", "#n2", "#n3", "#n4", "#n5", "#n6"], { opacity: 0 });
  [["#n1", SW3 + .3], ["#n2", W("z2", "милл")], ["#n3", W("z2", "торк")], ["#n6", W("z2", "торк") + .4], ["#n4", W("z2", "пятьд") + .3], ["#n5", W("z2", "ужин")]]
    .forEach(([s, at]) => { tl.fromTo(s, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: .2, ease: "power2.out", immediateRender: false }, at); R.sfx("type", at, .5); });
  bub("z2", st.v2 - .45);
  // 4. «ты со мной или с машиной?»
  const SW4 = st.v2 - .4; swap("s3", "s4", SW4); move("s4", { s: 1.16 }, SW4, en.z4 - SW4 + .3, "none");
  bub("v2", st.z4 - .1); bub("z4", st.l2 - .45); love("love2", .03, W("z4", "птс"));
  // 5. Стасу бот прислал объявление → звонок
  const SW5 = st.l2 - .4; swap("s4", "s5", SW5); move("s5", { s: 1.07, y: 1000 }, SW5, en.s1 - SW5 + .3, "none");
  gsap.set("#ncc", { opacity: 0 }); const NC = W("l2", "убот") - .1;
  tl.fromTo("#ncc", { opacity: 0, y: -50 }, { opacity: 1, y: 0, duration: .3, ease: "back.out(1.8)", immediateRender: false }, NC); R.sfx("ping", NC, .9);
  R.sfx("ring", st.s1 - .9, .8); bub("s1", st.v3 - .45);
  cut("s5", "s6", st.v3 - .1); move("s6", { s: 1.12 }, st.v3 - .1, en.v3 - st.v3 + .4, "none"); bub("v3", st.l3 - .45);
  // 6. парковка: деньги на капот
  const SW7 = st.l3 - .4; swap("s6", "s7", SW7); move("s7", { s: 1.14 }, SW7, en.v4 - SW7 + .3, "none");
  gsap.set("#money", { opacity: 0 }); const MN = W("l3", "деньги");
  tl.fromTo("#money", { opacity: 0, y: -400 }, { opacity: 1, y: 0, duration: .3, ease: "bounce.out", immediateRender: false }, MN); R.sfx("impact", MN + .25, .7);
  bub("s2", st.v4 - .1); bub("v4", st.w1 - .45);
  // 7. счёт → Камри уезжает → «опять бот»
  const SW8 = st.w1 - .4; swap("s7", "s8", SW8); move("s8", { s: 1.12 }, SW8, en.w1 - SW8 + .3, "none"); bub("w1", st.l5 - .15);
  const DR = st.l5 - .3; cut("s8", "s9", DR); R.sfx("whoosh", DR + .6, .7);
  tl.fromTo("#drive", { x: 0, scale: 1 }, { x: -1400, scale: 1.2, duration: 2.6, ease: "power2.in", immediateRender: false, transformOrigin: "550px 1300px" }, DR + .4);
  tl.fromTo("#spd", { x: 0 }, { x: -900, duration: 2.6, ease: "none", immediateRender: false }, DR + .4);
  cut("s9", "s10", st.z3 - .1); move("s10", { s: 1.18 }, st.z3 - .1, en.z3 - st.z3 + .4, "none"); bub("z3", st.l4 - .2);
  // 8. финальная фраза Лиса про бот → карточка
  const SW9 = st.l4 - .2; swap("s10", "s11", SW9); tl.to("#tag", { opacity: 0, duration: .2 }, SW9);
  tl.fromTo("#cta", { opacity: 0, y: 80, scale: .9 }, { opacity: 1, y: 0, scale: 1, duration: .4, ease: "back.out(1.6)", immediateRender: false }, SW9 + .6);
  ending(R, en.l4 + .3);
};
