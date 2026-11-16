// «АРБИТРАЖНИКИ» ep02 «НИКИТА: ДРУЗЬЯ → +5 000 ₽» (киношный формат ../cine.js). Сцены — как в утверждённой раскадровке board.html (16.11).
// ОБЛОЖКА: схема денег + Никита с купюрами + плашка → коворкинг: урок → схема оживает → футбол: «у кого нет карты?» → выгода друзьям →
// Катя по видеозвонку → чат «Оформил ✅» ×5 → Лёша: «где мои 500?» → выплата +7 500 ₽ → расчёт → пиццерия «все в плюсе» → карточка урока.
$("#title .a").textContent = E.rubric; $("#title .b").textContent = E.subtitle; $("#title .a").style.fontSize = "66px"; $("#title .b").style.fontSize = "70px"; $("#title .b").style.whiteSpace = "nowrap"; $("#tag span").textContent = "друзья → выплата";
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
const Nk = (p, x, foot, h, o = {}, pose = {}, extra = {}) => N_(spk(p, "nikita"), x, foot, h, o, pose, extra);
const Dm = (p, x, foot, h, o = {}, pose = {}, extra = {}) => D_(spk(p, "dima"), x, foot, h, o, pose, extra);
const Ls = (p, x, foot, h, o = {}, pose = {}, extra = {}) => L_(spk(p, "lesha"), x, foot, h, o, pose, extra);
const Kt = (p, x, foot, h, pose = {}, extra = {}) => K_(spk(p, "katya"), x, foot, h, pose, extra);
const KV_L = glow(540, 980, 420, "#fff2b0", .35) + glow(540, 240, 380, "#2ff5c4", .18);
const FT_L = glow(540, 520, 520, "#ffb070", .3);
const PZ_L = glow(330, 860, 360, "#ff7a1a", .35) + glow(540, 200, 520, "#ffd36a", .2);

// 1. ОБЛОЖКА: схема денег + Никита с купюрами, друзья ликуют
mount("s1", { bg: "minifutbol", farBlur: 5, mid: FLOW(700) + Nk("na", 540, 2010, 1040, { cash: 1 }, { armR: -125, armL: 10 }, { rim: "#ffd27a", side: 1, z: 8 })
  + Dm("da", 130, 1990, 700, { look: "grin" }, { armR: -150 }, { rim: "#ffd27a", side: 1, z: 6, dim: .9 }) + Kt("ka", 950, 1990, 700, { armL: 150 }, { rim: "#ffd27a", side: -1, z: 6, dim: .9 }),
  lights: FT_L }, { x: 540, y: 960, s: 1 });
// 2. коворкинг: урок на ноутбуке
mount("s2", { bg: "kovorking", mid: LAPTOP(70, 880, 460, TGPOST()) + Nk("nb", 800, 1900, 860, { look: "o" }, { armL: 60 }, { rim: "#2ff5c4", side: -1, z: 22 }), lights: KV_L,
  bubbles: [{ id: "n0", p: "nb", html: "Банк платит партнёру за клиента!<br><em>А у меня полно друзей без карты!</em>", fs: 34 }] }, { x: 540, y: 1120, s: 1.04 });
// 3. схема оживает (Арбузов объясняет)
mount("s3", { bg: "kovorking", farBlur: 6, mid: FLOW(560) + Nk("nc", 540, 1960, 900, {}, { armR: -150 }, { rim: "#2ff5c4", side: -1, z: 8 }), lights: KV_L }, { x: 540, y: 1100, s: 1.02 });
// 4. футбол: «у кого нет карты?»
mount("s4", { bg: "minifutbol", mid: Nk("nd", 540, 1880, 860, {}, { armR: -150, armL: 40 }, { rim: "#ffd27a", side: 1, z: 8 }) + Dm("dd", 170, 1900, 820, {}, {}, { rim: "#ffd27a", side: 1, z: 7 }) + Ls("ld", 910, 1900, 820, {}, {}, { rim: "#ffd27a", side: -1, z: 7 }), lights: FT_L,
  bubbles: [{ id: "n1", p: "nd", html: "Пацаны, у кого нет<br><em>карты этого банка?</em>", fs: 38 }, { id: "d0", p: "dd", html: "У меня нет.<br><em>А мне-то что с этого?</em>", fs: 36 }] }, { x: 540, y: 1150, s: 1.04 });
// 5. выгода друзьям
mount("s5", { bg: "minifutbol", farBlur: 2, mid: Nk("ne", 700, 1900, 900, {}, { armL: 60, armR: -100 }, { rim: "#ffd27a", side: -1, z: 8 }) + Dm("de", 260, 1900, 840, { look: "grin" }, {}, { rim: "#ffd27a", side: 1, z: 7 })
  + NODE(120, 560, 360, "🎁", "БОНУС БАНКА", "новым клиентам", "#fbfaf3", "bn") + NODE(600, 560, 360, "🤝", "+500 ₽", "от Никиты", "#ffd23f", "pl"), lights: FT_L,
  bubbles: [{ id: "n2", p: "ne", html: "Банк даёт новым бонус.<br><em>И 500 ₽ от меня!</em>", fs: 38 }] }, { x: 540, y: 1150, s: 1.04 });
// 6. Катя по видеозвонку
mount("s6", { bg: "minifutbol", farBlur: 3, mid: Nk("nf", 300, 1900, 900, { item: "phone" }, {}, { rim: "#ffd27a", side: 1, z: 8 }),
  over: PIP(820, 820, 180, `<div style="position:absolute;left:0;top:0;width:360px;height:360px">${Kt("kf", 180, 920, 1040, {}, { noShadow: 1 })}</div>`), lights: FT_L,
  bubbles: [{ id: "k0", at: [820, 630], html: "А мне можно? Хотела<br><em>кэшбэк на продукты!</em>", fs: 32 }, { id: "n3", p: "nf", html: "Конечно!<br><em>Ссылку кинул в чат.</em>", fs: 36 }] }, { x: 540, y: 1150, s: 1.04 });
// 7. чат на весь экран
mount("s7", { bg: "kovorking", over: CHAT(7) }, { x: 540, y: 960, s: 1 });
// 8. Лёша: «где мои 500?»
mount("s8", { bg: "minifutbol", farBlur: 2, mid: Ls("lg", 210, 1900, 860, { item: "phone" }, {}, { rim: "#ffd27a", side: 1, z: 8 }) + Nk("ng", 870, 1900, 860, {}, { armL: 60 }, { rim: "#ffd27a", side: -1, z: 8 }), lights: FT_L,
  bubbles: [{ id: "a0", p: "lg", html: "Оформил, купил.<br><em>Где мои пятьсот?</em>", fs: 32 }, { id: "n4", p: "ng", html: "Ждём выплату —<br><em>сразу переведу.</em>", fs: 32 }] }, { x: 540, y: 1150, s: 1.04 });
// 9. выплата: телефон с партнёрским кабинетом
{ const H = HOLDPHONE("nikita", spk("nh", "nikita"), 540, 2000, 1400, {}, PAYOUT("+0 ₽", "po"), { rim: "#2ff5c4", side: 1 });
  mount("s9", { bg: "kovorking", farBlur: 6, mid: H.mid, lights: H.lights + KV_L }, { x: 540, y: 1000, s: 1.02 }); }
// 10. расчёт
mount("s10", { bg: "kovorking", farBlur: 6, mid: MATH(520) + Nk("ni", 540, 1980, 900, { look: "grin" }, { armR: -150 }, { rim: "#2ff5c4", side: 1, z: 8 }), lights: KV_L,
  bubbles: [{ id: "n5", p: "ni", html: "Каждому по пятьсот.<br><em>Мне — пять тысяч.</em>", fs: 38 }] }, { x: 540, y: 1050, s: 1.02 });
// 11. пиццерия
mount("s11", { bg: "pizzeria", mid: TABLE(150, 1610, 780) + PIZZA(330, 1520, 380, "pz", 27) + Dm("dj", 150, 1900, 800, { look: "o" }, { armR: -100 }, { rim: "#ffb070", side: 1, z: 7 }) + Kt("kj", 610, 1880, 780, {}, { rim: "#ffb070", side: 1, z: 7 })
  + Nk("nj", 900, 1900, 840, { look: "grin" }, { armL: 150 }, { rim: "#ffb070", side: -1, z: 7 }), lights: PZ_L,
  bubbles: [{ id: "d1", p: "dj", html: "Ты что,<br><em>заработал на нас?</em>", fs: 34 }, { id: "k1", p: "kj", html: "И что?<br><em>Все в плюсе!</em>", fs: 38 }, { id: "n6", p: "nj", html: "Пицца<br><em>за мой счёт!</em>", fs: 40 }] }, { x: 540, y: 1150, s: 1.04 });
// 12. финальная карточка (последний кадр — только она)
mount("s12", { bg: "pizzeria", over: CTAA.replace('<div style="position:absolute;', '<div id="cta" style="opacity:0;position:absolute;'), lights: PZ_L }, { x: 540, y: 1000, s: .98 });

$("#end h2").innerHTML = E.end;

window.build = R => {
  const tl = R.tl;
  const { pop } = common(R, { shake: 0 });
  for (const el of Object.values(SC)) el.glows = [...el.querySelectorAll(".lights .glow")].map(g => ({ g, o: +g.style.opacity }));
  const talk = (lv, f) => lv > .28 && !(lv < .55 && f % 3 === 2);
  const MOOD = { dj: "o", nb: "o" };
  R.hooks.push(t => {
    const f = Math.floor(t * 30);
    for (const el of Object.values(SC)) {
      const on = +el.style.opacity > 0;
      el.style.display = on ? "" : "none";
      if (!on) continue;
      const k = el.cam.s > 1.6 ? .55 : 1;
      C.apply(el, [(R.noise(t * .6) * 9 + R.noise(t * 1.7 + 40) * 3) * k, (R.noise(t * .5 + 9) * 10 + R.noise(t * 1.9 + 70) * 3) * k, R.noise(t * .4 + 20) * .3 * k]);
      el.glows.forEach(({ g, o }, j) => { g.style.opacity = (o * (.88 + .12 * R.noise(t * 2.5 + j * 3.1))).toFixed(3); });
    }
    for (const [p, v] of Object.entries(SPK)) {
      if (!document.getElementById(p)) continue;
      const lv = (LIP[v] || [])[f] || 0;
      mouth(p, talk(lv, f) ? "talk" : (MOOD[p] || "grin"));
    }
  });
  window.MUSIC = { style: "bed", bpm: 96, end: R.dur - 1.2 };   // без фоновой музыки (MUSIC_VOL=0)

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
  const popIn = (sel, at, snd = "ping") => { tl.fromTo(sel, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: .3, ease: "back.out(2.2)", immediateRender: true }, at); R.sfx(snd, at, .5); };

  // 1. обложка: плашка видна с кадра 0, гаснет к 1,6 с; схема подсвечивается по очереди
  gsap.set(SC.s1, { opacity: 1 }); SC.s1.style.display = "";
  tl.set(SC.s1, { opacity: 1 }, 0); tl.to("#title", { opacity: 0, y: -50, duration: .25 }, 1.6);
  move("s1", { s: 1.06, y: 1000 }, 0, 3, "none");
  ["#fl0", "#fl2", "#fl4"].forEach((s, k) => tl.fromTo(SC.s1.querySelector(s), { scale: 1 }, { scale: 1.12, duration: .14, yoyo: true, repeat: 1, ease: "power2.out", immediateRender: false }, 1.8 + k * .3));
  // 2. коворкинг: Никита и урок
  const SW2 = Math.max(2.6, Wd("l0", "посмотр", .3) - .3); swap("s1", "s2", SW2); move("s2", { s: 1.1 }, SW2, en.n0 - SW2 + .3, "none");
  tl.fromTo("#tg", { scale: 1 }, { scale: 1.05, duration: .15, yoyo: true, repeat: 1, ease: "power2.out", immediateRender: false }, Wd("l0", "урок", .5)); R.sfx("ping", Wd("l0", "урок", .5), .5);
  bub("n0", st.l1 - .1);
  // 3. схема оживает под слова Арбузова
  cut("s2", "s3", st.l1 - .15); move("s3", { s: 1.06 }, st.l1 - .15, en.l1 - st.l1 + .4, "none");
  const S3 = SC.s3, q = s => S3.querySelector(s);
  [["#fl4", "друг", .1], ["#fl1", "карту", .35], ["#fl2", "ссылк", .5], ["#fl0", "банк", .75], ["#fl3", "никит", .9]].forEach(([s, w, fr]) => popIn(q(s), Wd("l1", w, fr) - .05));
  // 4. футбол
  const SW4 = st.n1 - .3; swap("s3", "s4", SW4); move("s4", { s: 1.08 }, SW4, en.d0 - SW4 + .3, "none"); bub("n1", st.d0 - .1); bub("d0", st.n2 - .2);
  // 5. выгода: карточки под слова
  cut("s4", "s5", st.n2 - .15); move("s5", { s: 1.08 }, st.n2 - .15, en.n2 - st.n2 + .4, "none"); bub("n2", st.k0 - .2);
  popIn(SC.s5.querySelector("#bn"), Wd("n2", "бонус", .35) - .05); popIn(SC.s5.querySelector("#pl"), Wd("n2", "пятьсот", .6) - .05, "bell");
  // 6. Катя по видеозвонку: кружок выезжает
  const SW6 = st.k0 - .3; swap("s5", "s6", SW6); move("s6", { s: 1.06 }, SW6, en.n3 - SW6 + .4, "none");
  tl.fromTo(SC.s6.querySelector("#pip"), { scale: 0 }, { scale: 1, duration: .35, ease: "back.out(2)", immediateRender: true }, SW6 + .35); R.sfx("ping", SW6 + .35, .6);
  bub("k0", st.n3 - .1); bub("n3", st.l2 - .15);
  // 7. чат на весь экран: «Оформил ✅» один за другим
  cut("s6", "s7", st.l2 - .1);
  tl.to("#tag", { opacity: 0, duration: .15 }, st.l2 - .1);
  const C7 = SC.s7; for (let k = 0; k < 7; k++) tl.set(C7.querySelector("#ch" + k), { opacity: 0 }, 0);
  popIn(C7.querySelector("#ch0"), st.l2 - .05); popIn(C7.querySelector("#ch1"), st.l2 + .35);
  const span = Math.max(1.6, en.l2 - st.l2 + .6); for (let k = 2; k < 7; k++) popIn(C7.querySelector("#ch" + k), st.l2 + .8 + (k - 2) * span / 5, "pop");
  // 8. Лёша и Никита
  const SW8 = Math.max(st.a0 - .25, st.l2 + .8 + span + .2); swap("s7", "s8", SW8); tl.to("#tag", { opacity: 1, duration: .2 }, SW8 + .3); move("s8", { s: 1.08 }, SW8, en.n4 - SW8 + .3, "none"); bub("a0", st.n4 - .1); bub("n4", st.l3 - .2);
  // 9. выплата: счётчик 0 → 7 500 ₽
  const SW9 = st.l3 - .3; swap("s8", "s9", SW9); move("s9", { s: 1.08 }, SW9, en.l3 - SW9 + .4, "none");
  const PV = { v: 0 }, PT = Wd("l3", "заплат", .4);
  tl.to(PV, { v: 7500, duration: Math.max(.8, en.l3 - PT), ease: "power2.out", onUpdate: () => { const e = SC.s9.querySelector("#po div[style*='58px']"); if (e) e.textContent = "+" + Math.round(PV.v).toLocaleString("ru-RU").replace(/,/g, " ") + " ₽"; } }, PT);
  R.sfx("bell", PT, .8); R.sfx("ping", en.l3, .7);
  // 10. расчёт строками под слова
  cut("s9", "s10", st.n5 - .15); move("s10", { s: 1.06 }, st.n5 - .15, en.n5 - st.n5 + .4, "none"); bub("n5", st.d1 - .2);
  const M10 = SC.s10; [["#mt0", "кажд", .1], ["#mt1", "две", .45], ["#mt2", "пять", .8]].forEach(([s, w, fr], k) => popIn(M10.querySelector(s), Wd("n5", w, fr) - .05, k === 2 ? "bell" : "ping"));
  // 11. пиццерия
  const SW11 = st.d1 - .3; swap("s10", "s11", SW11); move("s11", { s: 1.08 }, SW11, en.n6 - SW11 + .4, "none");
  bub("d1", st.k1 - .1); bub("k1", st.n6 - .1); bub("n6", st.l4 + .2);
  // 12. финальная фраза Арбузова → карточка урока (последний кадр — только она)
  const SW12 = Math.min(st.l4 + 1.4, en.l4 - 2.5);
  swap("s11", "s12", SW12); tl.to("#tag", { opacity: 0, duration: .2 }, SW12);
  tl.fromTo("#cta", { opacity: 0, y: 80, scale: .9 }, { opacity: 1, y: 0, scale: 1, duration: .4, ease: "back.out(1.6)", immediateRender: false }, SW12 + .5);
  ending(R, en.l4 + .3);
};
