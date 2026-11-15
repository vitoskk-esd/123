// «СВАДЬБА: ТЕСТЬ-ПОЛКОВНИК» (ep69, киношный формат ../cine.js, отдельный ролик). Сцены — как в утверждённой раскадровке board.html.
// Настоящий мат в озвучке (владелец 15.11) — по-военному, как часть команды; в облачках — со звёздочками. Машина из бота — красная Mazda 6 владельца.
// ОБЛОЖКА: Дима с ботом (Mazda 6 −18%) + плашка «СВАДЬБА: / ТЕСТЬ-ПОЛКОВНИК» → Дворец → заглох → «ПРИКАЗ № 1» → под капотом скотч
// → «не ругайся при гостях» → «ПРИКАЗ № 2» → невеста толкает (счётчик) → Жора: «винтаж» → «ПРИКАЗ № 3» → бот → «объявляю благодарность» → финал Лиса.
$("#title .a").textContent = E.rubric; $("#title .b").textContent = E.subtitle; $("#title .b").style.fontSize = "80px"; $("#tag span").textContent = "свадьба";
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
const D = (p, x, foot, h, o = {}, pose = {}, extra = {}) => ch("perekup", spk(p, "dima"), x, foot, h, { ...DIMA, ...o }, pose, extra);
const P = (p, x, foot, h, o = {}, pose = {}, extra = {}) => ch("perekup", spk(p, "polk"), x, foot, h, { ...POLK, ...o }, pose, extra) + MEDALS(x, foot, h, (extra.z || 7) + 1);
const L = (p, x, foot, h, pose = {}, extra = {}) => VEIL(x, foot, h, "vl" + p, (extra.z || 7) - 1) + LNC(ch("vika", spk(p, "lena"), x, foot, h, null, pose, extra));
const grp = (id, html) => `<div class="grp" id="${id}" style="position:absolute;left:0;top:0;width:1080px;height:1920px">${html}</div>`;
const DB_L = glow(540, 200, 420, "#fff6d0", .3);
const KZ_L = glow(90, 778, 160, "#4cd964", .3);
const GV_L = glow(220, 160, 260, "#ffe6a8", .45) + glow(860, 160, 260, "#ffe6a8", .45);

// 1. обложка: Дима с ботом
{ const H = HOLDPHONE("perekup", spk("dp", "dima"), 540, 2090, 1680, DIMA, MZCARD(), { rim: "#fff6d0", side: 1 });
  mount("s1", { bg: "dvorbraka", farBlur: 8, mid: H.mid, lights: H.lights + DB_L }, { x: 540, y: 960, s: 1 }); }
// 2. Дворец: «Мерседес как у министра»
mount("s2", { bg: "dvorbraka", mid: grp("c2", car(W24, 330, 1600, 700, { z: 5, sheen: .4 }) + RINGS(600, 1290)) + D("da", 190, 1860, 820, {}, { armR: -60 }, { rim: "#fff6d0", side: 1, z: 7 }) + P("pa", 890, 1860, 840, {}, { armL: 10 }, { rim: "#fff6d0", side: -1, z: 7 }), lights: DB_L,
  bubbles: [{ id: "d0", p: "da", html: "Виктор Степанович,<br><em>ну как вам машина?</em>", fs: 38 }, { id: "p0", p: "pa", html: "Если не заглохнет —<br><em>с меня ящик.</em>", fs: 40 }] }, { x: 540, y: 1150, s: 1.04 });
// 3. заглох на светофоре
mount("s3", { bg: "kortezh", mid: car(W24, 220, 1560, 740, { z: 5, sheen: .4 }) + RINGS(520, 1240) + STEAM(760, 1110), lights: KZ_L }, { x: 540, y: 1180, s: 1.04 });
// 4. «ПРИКАЗ № 1»
mount("s4", { bg: "kortezh", farBlur: 3, mid: P("pb", 300, 1900, 980, {}, { armR: -120 }, { rim: "#fff6d0", side: 1, z: 7 }), over: ORDER(470, 1180, "or1", 1, "Отставить панику.<br>Двигатель —<br>к осмотру."), lights: KZ_L,
  bubbles: [{ id: "p1", p: "pb", html: "Отставить панику!<br><em>Двигатель, бл*дь, к осмотру!</em>", fs: 40 }] }, { x: 540, y: 1150, s: 1.04 });
// 5. под капотом: скотч, Дима в кружке
mount("s5", { bg: "kortezh", farBlur: 10, mid: ENGINE("eng") + PIP(D("dpip", 160, 800, 900, { look: "o" }, {}, { noShadow: 1 }), "pip1"),
  bubbles: [{ id: "d1", at: [860, 1470], html: "Тут провода…<br><em>скотчем замотаны.</em>", fs: 42 }] }, { x: 540, y: 960, s: 1 });
// 6. «Ё*аный ты в рот» → «не ругайся при гостях!»
mount("s6", { bg: "kortezh", farBlur: 2, mid: P("pc", 230, 1860, 860, {}, { armR: -80 }, { rim: "#fff6d0", side: 1, z: 7 }) + D("db", 560, 1880, 800, { look: "o" }, {}, { z: 6 }) + L("la", 870, 1860, 820, { armL: 60 }, { rim: "#fff6d0", side: -1, z: 8 }), lights: KZ_L,
  bubbles: [{ id: "p2", p: "pc", html: "Скотчем. На свадьбу.<br><em>Ё*аный ты в рот, Дмитрий.</em>", fs: 38 }, { id: "n0", p: "la", html: "Папа, не ругайся<br><em>при гостях!</em>", fs: 40 }] }, { x: 540, y: 1150, s: 1.04 });
// 7. «ПРИКАЗ № 2»
mount("s7", { bg: "kortezh", farBlur: 4, mid: P("pd", 330, 1900, 1000, {}, { armL: 40 }, { rim: "#fff6d0", side: 1, z: 7 }), over: ORDER(500, 1200, "or2", 2, "Толкать до ЗАГСа.<br>Невесте — тоже.", 3), lights: KZ_L,
  bubbles: [{ id: "p3", p: "pd", html: "Я не ругаюсь, Леночка.<br><em>Я ставлю задачу.</em>", fs: 42 }] }, { x: 540, y: 1150, s: 1.06 });
// 8. невеста толкает «Мерседес»
mount("s8", { bg: "kortezh", mid: grp("c8", car(W24, 380, 1600, 700, { z: 5, sheen: .4 }) + RINGS(660, 1300, "rg8")) + grp("pu8", L("lb", 250, 1840, 760, { armR: -70, armL: -70 }, { rim: "#fff6d0", side: 1, z: 8 }) + D("dc", 90, 1860, 780, { look: "o" }, { armR: -70 }, { z: 7 })), over: PUSHM(560, 300), lights: KZ_L,
  bubbles: [{ id: "n1", p: "lb", html: "Дима, толкай сильнее,<br><em>ёпта!</em>", fs: 44 }] }, { x: 540, y: 1150, s: 1.04 });
// 9. Жора: «это винтаж!» → «ПРИКАЗ № 3»
mount("s9", { bg: "kortezh", farBlur: 2, mid: P("pe", 250, 1860, 860, {}, { armR: -150 }, { rim: "#fff6d0", side: 1, z: 7 }) + Z("za", 840, 1860, 840, { look: "grin" }, { armL: 50 }, { rim: "#fff6d0", side: -1, z: 7 }), over: ORDER(250, 1450, "or3", 3, "Жора — на**й.<br>Шагом марш.", -3), lights: KZ_L,
  bubbles: [{ id: "z0", p: "za", html: "Ребята, это не поломка —<br><em>это винтаж!</em>", fs: 38 }, { id: "p4", p: "pe", html: "Жора. Слушай приказ.<br><em>Пошёл на**й. Шагом марш.</em>", fs: 38 }] }, { x: 540, y: 1150, s: 1.04 });
// 10. бот: Mazda 6
{ const H = HOLDPHONE("perekup", spk("dd", "dima"), 540, 2000, 1400, DIMA, MZCARD("mcc2"), { rim: "#ffe6a8", side: 1 });
  mount("s10", { bg: "godovshina", farBlur: 5, mid: H.mid, lights: H.lights + GV_L,
    bubbles: [{ id: "d2", p: "dd", html: "Мазда шесть, один хозяин,<br><em>ниже рынка на сто сорок тысяч.</em>", fs: 38 }] }, { x: 540, y: 1000, s: 1.02 }); }
// 11. через год у Дворца: Mazda 6 и «объявляю благодарность»
mount("s11", { bg: "dvorbraka", mid: grp("c11", car(MZ6, 330, 1700, 740, { z: 8, sheen: .5 }) + RINGS(590, 1370, "rg6", 9)) + D("de", 560, 1640, 660, { look: "grin" }, {}, { rim: "#fff6d0", side: 1, z: 5 }) + L("lc", 860, 1640, 650, {}, { rim: "#fff6d0", side: -1, z: 5 }) + P("pf", 190, 1900, 880, { look: "grin" }, { armR: -150 }, { rim: "#fff6d0", side: 1, z: 10 }), lights: DB_L,
  bubbles: [{ id: "p5", p: "pf", html: "Оху*нно. Дмитрий,<br><em>объявляю благодарность!</em>", fs: 42 }] }, { x: 540, y: 1150, s: 1.04 });
// 12. карточка бота
mount("s12", { bg: "godovshina", over: CTA69.replace('<div style="position:absolute;', '<div id="cta" style="opacity:0;position:absolute;'), lights: GV_L }, { x: 540, y: 1000, s: .98 });

$("#end h2").innerHTML = E.end;

window.build = R => {
  const tl = R.tl;
  const { pop } = common(R, { shake: 0 });
  for (const el of Object.values(SC)) {
    el.sheens = [...el.querySelectorAll(".sheen")];
    el.glows = [...el.querySelectorAll(".lights .glow")].map(g => ({ g, o: +g.style.opacity }));
  }
  const talk = (lv, f) => lv > .28 && !(lv < .55 && f % 3 === 2);
  const MOOD = { dpip: "o", db: "o", dc: "o", pc: "flat", pb: "flat", pd: "flat", pe: "flat" };
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
    // фаты развеваются; пар клубится
    document.querySelectorAll('[id^="vl"]').forEach((v, j) => { v.style.transform = `rotate(${(Math.sin(t * 2.2 + j) * 4).toFixed(2)}deg)`; });
    const stm = document.getElementById("stm"); if (stm) stm.style.transform = `translateY(${(-((t * 40) % 60)).toFixed(1)}px) scale(${(1 + .08 * Math.sin(t * 3)).toFixed(3)})`;
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
  // приказ: бланк влетает, печать хлопает
  const order = (id, at, stampAt) => {
    tl.fromTo(`#${id}`, { y: 500, opacity: 0 }, { y: 0, opacity: 1, duration: .4, ease: "back.out(1.6)", immediateRender: true }, at);
    tl.fromTo(`#${id}s`, { scale: 2.6, opacity: 0 }, { scale: 1, opacity: 1, duration: .18, ease: "power4.in", immediateRender: true }, stampAt);
    R.sfx("clack", stampAt + .16, .9);
  };

  // 1. обложка: плашка видна с первого кадра и гаснет к 1,6 с; карточка бота — с кадра 0
  gsap.set(SC.s1, { opacity: 1 }); SC.s1.style.display = "";
  gsap.set("#cnt", { opacity: 0 });
  tl.set(SC.s1, { opacity: 1 }, 0); tl.to("#title", { opacity: 0, y: -50, duration: .25 }, 1.6);
  move("s1", { s: 1.06, y: 1000 }, 0, 3, "none");
  tl.fromTo("#mcc", { scale: 1 }, { scale: 1.06, duration: .15, yoyo: true, repeat: 1, ease: "power2.out", immediateRender: false }, 2.0); R.sfx("ping", 2.0, .6);
  // 2. Дворец: «Мерседес» подъезжает
  const SW2 = Math.max(2.4, Wd("l0", "машин", .3) - .3); swap("s1", "s2", SW2); move("s2", { s: 1.1 }, SW2, en.p0 - SW2 + .3, "none");
  tl.fromTo("#c2", { x: -900 }, { x: 0, duration: 1.3, ease: "power3.out", immediateRender: false }, SW2 + .05);
  bub("d0", st.p0 - .1); bub("p0", st.l1 - .2);
  // 3. заглох: рывок, пар, гудки
  const SW3 = st.l1 - .25; swap("s2", "s3", SW3); move("s3", { s: 1.14, x: 600 }, SW3, en.l1 - SW3 + .5, "none");
  tl.fromTo(SC.s3, { y: -10 }, { y: 0, duration: .3, ease: "bounce.out", immediateRender: false }, Wd("l1", "загл", .2));
  tl.fromTo("#stm", { opacity: 0, scale: .4 }, { opacity: 1, scale: 1, duration: .5, ease: "power2.out", immediateRender: true }, Wd("l1", "загл", .2) + .1);
  R.sfx("clack", Wd("l1", "загл", .2), .7); R.sfx("bleep", en.l1 - .2, .25); R.sfx("bleep", en.l1 + .15, .25);
  // 4. «ПРИКАЗ № 1»
  cut("s3", "s4", st.p1 - .2); move("s4", { s: 1.1 }, st.p1 - .2, en.p1 - st.p1 + .4, "none"); bub("p1", st.d1 - .2);
  order("or1", Wd("p1", "двиг", .5) - .1, en.p1 - .1);
  // 5. под капотом: наезд на скотч
  cut("s4", "s5", st.d1 - .2); move("s5", { s: 1.12, y: 1000 }, st.d1 - .2, en.d1 - st.d1 + .5, "none"); bub("d1", st.p2 - .2);
  tl.fromTo("#pip1", { scale: 0 }, { scale: 1, duration: .3, ease: "back.out(2)", immediateRender: true }, st.d1 - .1);
  // 6. «Ё*аный ты в рот» → «не ругайся при гостях!»
  const SW6 = st.p2 - .3; swap("s5", "s6", SW6); move("s6", { s: 1.1 }, SW6, en.n0 - SW6 + .4, "none"); bub("p2", st.n0 - .1); bub("n0", st.p3 - .2);
  // 7. «ПРИКАЗ № 2»
  cut("s6", "s7", st.p3 - .2); move("s7", { s: 1.14 }, st.p3 - .2, en.p3 - st.p3 + .4, "none"); bub("p3", st.l2 - .2);
  order("or2", Wd("p3", "задач", .7) - .2, en.p3);
  // 8. невеста толкает: «Мерседес» ползёт, счётчик метров
  const SW8 = st.l2 - .3; swap("s7", "s8", SW8); move("s8", { s: 1.08 }, SW8, en.n1 - SW8 + .4, "none");
  const PD = en.n1 - st.l2 + .4;
  tl.to("#c8", { x: 120, duration: PD, ease: "none" }, st.l2).to("#pu8", { x: 120, duration: PD, ease: "none" }, st.l2);
  const PM = { m: 0 }; tl.to(PM, { m: 800, duration: PD, ease: "power1.in", onUpdate: () => { const e = document.getElementById("pmv"); if (e) e.textContent = Math.round(PM.m) + " м"; } }, st.l2);
  tl.fromTo("#pmb", { width: "0%" }, { width: "100%", duration: PD, ease: "power1.in", immediateRender: true }, st.l2);
  tl.fromTo("#pm", { y: -260 }, { y: 0, duration: .4, ease: "back.out(1.6)", immediateRender: true }, SW8 + .3);
  bub("n1", st.z0 - .2);
  // 9. Жора: «винтаж» → «ПРИКАЗ № 3»
  const SW9 = st.z0 - .3; swap("s8", "s9", SW9); move("s9", { s: 1.1 }, SW9, en.p4 - SW9 + .4, "none"); bub("z0", st.p4 - .1); bub("p4", st.l3 - .2);
  order("or3", Wd("p4", "пош", .5) - .1, Wd("p4", "шаг", .8));
  // 10. бот: Mazda 6
  const SW10 = st.l3 - .25; swap("s9", "s10", SW10); move("s10", { s: 1.08 }, SW10, en.d2 - SW10 + .4, "none");
  tl.fromTo("#mcc2", { scale: 1 }, { scale: 1.07, duration: .15, yoyo: true, repeat: 1, ease: "power2.out", immediateRender: false }, Wd("d2", "мазд", .05)); R.sfx("ping", Wd("d2", "мазд", .05), .8);
  bub("d2", st.p5 - .2);
  // 11. через год у Дворца: Mazda подъезжает, «объявляю благодарность»
  const SW11 = st.p5 - .4; swap("s10", "s11", SW11); move("s11", { s: 1.08 }, SW11, en.p5 - SW11 + .4, "none");
  tl.fromTo("#c11", { x: -1000 }, { x: 0, duration: 1.0, ease: "power3.out", immediateRender: false }, SW11 + .05); bub("p5", st.l4 - .15);
  // 12. финальная фраза Лиса → карточка
  const SW12 = st.l4 - .1; swap("s11", "s12", SW12); tl.to("#tag", { opacity: 0, duration: .2 }, SW12);
  tl.fromTo("#cta", { opacity: 0, y: 80, scale: .9 }, { opacity: 1, y: 0, scale: 1, duration: .4, ease: "back.out(1.6)", immediateRender: false }, SW12 + .6);
  ending(R, en.l4 + .3);
};
