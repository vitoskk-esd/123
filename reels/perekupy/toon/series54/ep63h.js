// «ВИКТОРИНА: ВОПРОС НА МИЛЛИОН» (ep63, киношный формат ../cine.js, отдельный ролик). Сцены — как в утверждённой раскадровке board.html.
// ОБЛОЖКА (кадр 0, владелец 15.11: человек держит телефон с ботом): Стас на кухне — в боте Камри −14% + плашка (гаснет к 1,6 с)
// → студия: вопрос и ответы выезжают → «это просто — рынок!» → 50:50 → помощь зала (столбики) → звонок другу (сплит-экран, таймер 30)
// → «окончательный — А» → неверно, Г — бот → утешительный чайник → финальная фраза Лиса про бот + карточка.
$("#title .a").textContent = E.rubric; $("#title .b").textContent = E.subtitle; $("#title .b").style.fontSize = "96px"; $("#tag span").textContent = "викторина";
document.querySelector("#cam > svg#bg")?.remove();
const W = (line, pre, n = 0) => {
  const norm = s => s.toLowerCase().replace(/ё/g, "е").replace(/[^а-я0-9a-z]/g, "");
  const hits = (TT.words[line] || []).filter(w => w[1] >= st[line] - .7 && w[2] <= en[line] + .05 && norm(w[0]).startsWith(norm(pre)));
  if (!hits[n]) console.warn("W miss", line, pre);
  return hits[n] ? Math.max(hits[n][1], st[line] - .05) : st[line];
};
const root = $("#scene"), SC = {}, SPK = {};
const mount = (name, def, sh) => (SC[name] = C.mount(root, def, sh));
const spk = (p, v) => (SPK[p] = v, p);
const Z = (p, x, foot, h, o = {}, pose = {}, extra = {}) => ch("perekup", spk(p, "zhora"), x, foot, h, { ...ZHORA, ...o }, pose, extra);
const ST = (p, x, foot, h, o = {}, pose = {}, extra = {}) => ch("perekup", spk(p, "stas"), x, foot, h, { ...STAS, ...o }, pose, extra);
const HS = (p, x, foot, h, o = {}, pose = {}, extra = {}) => ch("perekup", spk(p, "host"), x, foot, h, { ...HOST, ...o }, pose, extra);
const KS_L = glow(540, 420, 360, "#ffd23f", .25) + glow(540, 1640, 420, "#5a7aff", .35);
const KZ_L = glow(540, 200, 400, "#ff3bd0", .25);
const KH_L = glow(590, 400, 320, "#fff6d0", .45);
const STAGE = (k, hpose = {}, zo = {}, extra = "") => HS("h" + k, 270, 1250, 760, {}, hpose, { rim: "#9fb4ff", side: 1, z: 7 }) + Z("z" + k, 790, 1250, 760, zo, {}, { rim: "#9fb4ff", side: -1, z: 7 }) + PODIUM(790, 1260, 420) + extra;
const OFFS = (html, ids) => ids.reduce((h, id) => h.replace(`id="${id}" style="`, `id="${id}" style="opacity:0;`), html);

// 1. обложка: Стас с ботом
{ const H = HOLDPHONE("perekup", spk("sp", "stas"), 540, 2090, 1680, STAS, STCARD(), { rim: "#fff6d0", side: 1 });
  mount("s1", { bg: "kuhnyastasa", grade: "day", farBlur: 8, mid: H.mid, lights: H.lights + KH_L }, { x: 540, y: 960, s: 1 }); }
// 2. студия: вопрос, Жора, варианты
mount("s2", { bg: "kvizstudiya", farBlur: 1, mid: STAGE("a", { armR: -60 }, { look: "grin" }), over: BOARD(1360, "b1"), lights: KS_L,
  bubbles: [{ id: "h1", p: "ha", html: "Вопрос на миллион:<br><em>где найти Камри ниже рынка?</em>", fs: 38 }, { id: "z0", p: "za", html: "Давайте!<br><em>Я тридцать лет в теме.</em>", fs: 40 },
    { id: "h2", p: "ha", html: "А — рынок, Б — газета,<br><em>В — тёща, Г — бот.</em>", fs: 38 }] }, { x: 540, y: 960, s: 1 });
// 3. «это просто!»
mount("s3", { bg: "kvizstudiya", farBlur: 6, mid: Z("zc", 540, 1900, 1000, { look: "grin" }, { armL: 40 }, { rim: "#9fb4ff", side: 1, z: 7 }) + PODIUM(540, 1910, 640), lights: KS_L,
  bubbles: [{ id: "z1", p: "zc", html: "Это просто!<br><em>Авторынок в пять утра!</em>", fs: 48 }] }, { x: 540, y: 1150, s: 1.08 });
// 4. подсказки: «уверены?» → 50:50
mount("s4", { bg: "kvizstudiya", farBlur: 1, mid: STAGE("d", { armR: -100 }, { look: "o" }), over: BOARD(1360, "b2") + LIFELINES("l2"), lights: KS_L,
  bubbles: [{ id: "h3", p: "hd", html: "Уверены?<br><em>У вас есть подсказки.</em>", fs: 42 }, { id: "z2", p: "zd", html: "Пятьдесят<br><em>на пятьдесят!</em>", fs: 48 }] }, { x: 540, y: 960, s: 1 });
// 5. помощь зала
mount("s5", { bg: "kvizzal", farBlur: 1, over: POLL("pl"), mid: Z("ze", 260, 2200, 1000, { look: "angry" }, {}, { rim: "#ff7ae6", side: 1, z: 7 }), lights: KZ_L,
  bubbles: [{ id: "z3", p: "ze", html: "Зал<br><em>купили!</em>", fs: 56 }] }, { x: 540, y: 960, s: 1 });
// 6. «звонок другу»
mount("s6", { bg: "kvizstudiya", farBlur: 1, mid: STAGE("f", { armR: -60 }, { look: "o" }), over: OFFS(BOARD(1360, "b3"), ["b3a1", "b3a2"]) + LIFELINES("l3", [0]), lights: KS_L,
  bubbles: [{ id: "h4", p: "hf", html: "Звонок другу.<br><em>Тридцать секунд.</em>", fs: 44 }] }, { x: 540, y: 960, s: 1 });
// 7. сплит-экран: Жора ↔ Стас
mount("sL", { bg: "kvizstudiya", farBlur: 2, mid: Z("zg", 540, 1900, 1000, { look: "o" }, { phone: 1 }, { rim: "#9fb4ff", side: 1, z: 7 }) + PODIUM(540, 1910, 640), lights: KS_L,
  bubbles: [{ id: "z4", p: "zg", html: "Стас, где Камри<br><em>ниже рынка?</em>", fs: 36 }] }, { x: 540, y: 1100, s: 1.05 });
mount("sR", { bg: "kuhnyastasa", grade: "day", farBlur: 2, mid: ST("sg", 540, 1900, 1000, {}, { phone: 1 }, { rim: "#fff6d0", side: -1, z: 7 }), lights: KH_L,
  bubbles: [{ id: "s1", p: "sg", html: "Ответ Г.<br><em>Камри я уже купил.</em>", fs: 36 }] }, { x: 540, y: 1100, s: 1.05 });
root.insertAdjacentHTML("beforeend", `<div id="splitui" style="position:absolute;inset:0;z-index:95;opacity:0;pointer-events:none"><div style="position:absolute;left:532px;top:0;width:16px;height:1920px;background:#fff;box-shadow:0 0 30px #000"></div>${CTIMER(430, 250, 30, "ct", 220)}</div>`);
// 8. «окончательный ответ — А»
mount("s8", { bg: "kvizstudiya", farBlur: 4, mid: Z("zh", 540, 1900, 1000, { look: "grin" }, { armL: 40 }, { rim: "#9fb4ff", side: 1, z: 7 }) + PODIUM(540, 1910, 640), over: OFFS(BOARD(1360, "b4"), ["b4a1", "b4a2"]), lights: KS_L,
  bubbles: [{ id: "z5", p: "zh", html: "Окончательный ответ —<br><em>А! Рынок!</em>", fs: 48 }] }, { x: 540, y: 1150, s: 1.08 });
// 9. неверно → чайник
mount("s9", { bg: "kvizstudiya", farBlur: 1, mid: STAGE("i", {}, { look: "o" }), over: OFFS(BOARD(1360, "b5"), ["b5a1", "b5a2"]).replace('id="b5a0" style="', 'id="b5a0" style="background:#ff7a1a;') + `<div id="redf" style="position:absolute;inset:0;z-index:44;opacity:0;background:radial-gradient(circle,#ff3b3000 40%,#ff3b3088)"></div>`, lights: KS_L,
  bubbles: [{ id: "h5", p: "hi", html: "Неверно.<br><em>Правильный ответ — Г: бот.</em>", fs: 40 }] }, { x: 540, y: 960, s: 1 });
mount("s10", { bg: "kvizstudiya", farBlur: 2, mid: HS("hj", 240, 1820, 860, {}, { armR: -60 }, { rim: "#9fb4ff", side: 1, z: 7 }) + Z("zj", 620, 1820, 880, { look: "o" }, { armR: -70 }, { rim: "#9fb4ff", side: -1, z: 7 }) + INHAND(620, 1820, 880, -70, 200, KETTLE, 9, 0, "ktl"), lights: KS_L,
  bubbles: [{ id: "z6", p: "zj", html: "Чайник…<br><em>Ну хоть без торга.</em>", fs: 48 }] }, { x: 540, y: 1180, s: 1.05 });
// 11. карточка бота
mount("s11", { bg: "kvizstudiya", over: CTA63.replace('<div style="position:absolute;', '<div id="cta" style="opacity:0;position:absolute;'), lights: KS_L }, { x: 540, y: 1000, s: .98 });

$("#end h2").innerHTML = E.end;

window.build = R => {
  const tl = R.tl;
  const { pop } = common(R, { shake: 0 });
  for (const el of Object.values(SC)) {
    el.sheens = [...el.querySelectorAll(".sheen")];
    el.glows = [...el.querySelectorAll(".lights .glow")].map(g => ({ g, o: +g.style.opacity }));
  }
  const talk = (lv, f) => lv > .28 && !(lv < .55 && f % 3 === 2);
  const MOOD = { zd: "o", zf: "o", zg: "o", zi: "o", zj: "o", hi: "flat" };
  // таймер звонка: 30 → 5 за время разговора
  const T0 = st.z4 - .3, T1 = en.s1, LEN = 2 * Math.PI * 120, ctr = document.getElementById("ctr"), ctt = document.getElementById("ctt");
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
    const sec = Math.max(5, Math.round(30 - 25 * Math.min(1, Math.max(0, (t - T0) / (T1 - T0)))));
    ctr.setAttribute("stroke-dashoffset", (LEN * (1 - sec / 30)).toFixed(1)); ctt.textContent = sec;
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
  const slide = (sel, at, snd = "pop") => { gsap.set(sel, { opacity: 0 }); tl.fromTo(sel, { opacity: 0, x: -60 }, { opacity: 1, x: 0, duration: .25, ease: "back.out(1.6)", immediateRender: false }, at); if (snd) R.sfx(snd, at, .5); };
  const glowp = (sel, at) => tl.fromTo(sel, { boxShadow: "0 0 24px #5a7aff88" }, { boxShadow: "0 0 60px #ffd23f", duration: .2, yoyo: true, repeat: 1, immediateRender: false }, at);
  const xmark = (sel, at) => { tl.to(sel, { opacity: 1, duration: .1 }, at); R.sfx("glitch", at, .4); };

  // 1. обложка: плашка видна с первого кадра и гаснет к 1,6 с; карточка бота — с кадра 0
  gsap.set(SC.s1, { opacity: 1 }); SC.s1.style.display = "";
  gsap.set("#cnt", { opacity: 0 });
  show("s1", 0); tl.to("#title", { opacity: 0, y: -50, duration: .25 }, 1.6);
  move("s1", { s: 1.06, y: 1000 }, 0, en.l0 + .4, "none");
  tl.fromTo("#scc", { scale: 1 }, { scale: 1.06, duration: .15, yoyo: true, repeat: 1, ease: "power2.out", immediateRender: false }, W("l0", "вопрос")); R.sfx("ping", W("l0", "вопрос"), .6);
  // 2. студия: вопрос → Жора → варианты выезжают под голос ведущего
  const SW2 = st.h1 - .4; swap("s1", "s2", SW2); move("s2", { s: 1.04 }, SW2, en.h2 - SW2 + .3, "none");
  ["#b1a0", "#b1a1", "#b1a2", "#b1a3"].forEach(s => gsap.set(s, { opacity: 0 }));
  slide("#b1q", st.h1 + .1, "riser");
  bub("h1", st.z0 - .1); bub("z0", st.h2 - .1); bub("h2", st.z1 - .3);
  [[0, st.h2 - .05], [1, W("h2", "объяв") - .4], [2, W("h2", "спрос") - .4], [3, W("h2", "бот") - .4]].forEach(([i, at]) => { slide(`#b1a${i}`, at, "clack"); glowp(`#b1a${i}`, at + .25); });
  // 3. «это просто!»
  cut("s2", "s3", st.z1 - .2); move("s3", { s: 1.16 }, st.z1 - .2, en.z1 - st.z1 + .4, "none"); bub("z1", st.h3 - .2);
  // 4. «уверены?» → 50:50: «Б» и «В» гаснут
  cut("s3", "s4", st.h3 - .2); move("s4", { s: 1.04 }, st.h3 - .2, en.z2 - st.h3 + .6, "none"); bub("h3", st.z2 - .1); bub("z2", st.l1 - .2);
  const FF = en.z2 + .05; xmark("#l20x", FF); tl.to(["#b2a1", "#b2a2"], { opacity: 0, duration: .15, repeat: 2, yoyo: true }, FF + .2).set(["#b2a1", "#b2a2"], { opacity: 0 }, FF + .7);
  // 5. помощь зала: столбики растут, «Г — 87%»
  const SW5 = st.l1 - .2; swap("s4", "s5", SW5); move("s5", { s: 1.04 }, SW5, en.z3 - SW5 + .4, "none");
  const PB = W("l1", "помощ");
  [0, 1, 2, 3].forEach(i => { gsap.set(`#plb${i}`, { scaleY: 0 }); gsap.set(`#plv${i}`, { opacity: 0 });
    tl.to(`#plb${i}`, { scaleY: 1, duration: i === 3 ? 1.1 : .6, ease: "power2.out" }, PB + .1 * i).to(`#plv${i}`, { opacity: 1, duration: .2 }, PB + (i === 3 ? 1.1 : .6)); });
  [0, .15, .3, .45, .6, .75, .9].forEach(d => R.sfx("tap", PB + d, .5)); R.sfx("pop", PB + 1.15, .7);
  bub("z3", st.h4 - .2);
  // 6. «звонок другу»: значок 📞 зачёркнут
  const SW6 = st.h4 - .3; swap("s5", "s6", SW6); move("s6", { s: 1.08 }, SW6, en.h4 - SW6 + .4, "none"); bub("h4", st.z4 - .3);
  xmark("#l31x", W("h4", "звон") + .2); xmark("#l30x", SW6);
  // 7. сплит-экран: Жора слева, Стас справа, таймер
  const SP = st.z4 - .3;
  tl.set(SC.s6, { opacity: 0 }, SP).set([SC.sL, SC.sR], { opacity: 1, clipPath: "inset(0 270px 0 270px)" }, SP).set(SC.sL, { x: -270 }, SP).set(SC.sR, { x: 270 }, SP).set("#splitui", { opacity: 1 }, SP);
  tl.fromTo([SC.sL, SC.sR], { y: 60 }, { y: 0, duration: .3, ease: "power2.out", immediateRender: false }, SP); R.sfx("ring", SP, 1.2); R.sfx("whoosh", SP, .5);
  move("sL", { s: 1.12 }, SP, en.s1 - SP, "none"); move("sR", { s: 1.12 }, SP, en.s1 - SP, "none");
  bub("z4", st.s1 - .1); bub("s1", en.s1 + .3);
  for (let k = 1; k <= 25; k++) R.sfx("tick", T0 + (T1 - T0) * k / 25, .2);
  // 8. «окончательный ответ — А»: «А» горит оранжевым
  const SW8 = en.s1 + .3; tl.set([SC.sL, SC.sR], { opacity: 0, x: 0, clipPath: "none" }, SW8).set("#splitui", { opacity: 0 }, SW8).set(SC.s8, { opacity: 1 }, SW8); R.sfx("tick", SW8, .4);
  move("s8", { s: 1.18 }, SW8, en.z5 - SW8 + .4, "none"); bub("z5", st.h5 - .1);
  tl.to("#b4a0", { backgroundColor: "#ff7a1a", duration: .2 }, W("z5", "а")); R.sfx("clack", W("z5", "а"), .7);
  // 9. неверно: «А» краснеет, «Г» зеленеет, красная вспышка
  cut("s8", "s9", st.h5 - .1); move("s9", { s: 1.04 }, st.h5 - .1, en.h5 - st.h5 + .3, "none");
  [0, .12, .24, .36].forEach(d => R.sfx("tap", st.h5 - .1 + d, .6));   // барабанная дробь
  const NO = W("h5", "неверн"); tl.to("#b5a0", { backgroundColor: "#ff3b30", duration: .15 }, NO).fromTo("#redf", { opacity: 0 }, { opacity: 1, duration: .1, yoyo: true, repeat: 3, immediateRender: false }, NO);
  R.sfx("bleep", NO, .45); R.sfx("impact", NO, .6);
  tl.to("#b5a3", { backgroundColor: "#4cd964", duration: .2 }, W("h5", "бот")); glowp("#b5a3", W("h5", "бот")); R.sfx("ping", W("h5", "бот"), .7);
  bub("h5", W("h5", "ваш") - .1);
  // 10. чайник
  cut("s9", "s10", W("h5", "ваш") - .1); move("s10", { s: 1.12 }, W("h5", "ваш") - .1, en.z6 - W("h5", "ваш") + .5, "none"); bub("z6", st.l2 - .2);
  gsap.set("#ktl", { opacity: 0 }); tl.fromTo("#ktl", { opacity: 0, y: -60, scale: .6 }, { opacity: 1, y: 0, scale: 1, duration: .3, ease: "back.out(2)", immediateRender: false }, W("h5", "чайн")); R.sfx("pop", W("h5", "чайн"), .7);
  // 11. финальная фраза Лиса про бот → карточка
  const SW11 = st.l2 - .2; swap("s10", "s11", SW11); tl.to("#tag", { opacity: 0, duration: .2 }, SW11);
  tl.fromTo("#cta", { opacity: 0, y: 80, scale: .9 }, { opacity: 1, y: 0, scale: 1, duration: .4, ease: "back.out(1.6)", immediateRender: false }, SW11 + .6);
  ending(R, en.l2 + .3);
};

// ── ep63h «Пастель»: быстрая уникализация — меняется только заставка ──
$("#title .a").textContent = "ПРАВИЛЬНЫЙ ОТВЕТ:"; $("#title .a").style.cssText = "font-size:110px;background:#ff6fae;color:#151515";
$("#title .b").textContent = "Г — БОТ"; $("#title .b").style.cssText = "font-size:60px;background:#151515;color:#ff6fae";
const ORIG = [...document.querySelectorAll("#lbx .lbt, #lbx .lbb")].map(e => e.textContent), HEADT = 2.4;
{ const L = document.querySelector("#lbx"); if (L) { const a = L.querySelector(".lbt"), b = L.querySelector(".lbb");   // кинорамка вместо плашки (ep56)
  a.textContent = "ПРАВИЛЬНЫЙ ОТВЕТ:"; b.textContent = "Г — БОТ"; a.style.background = b.style.background = "#ff6fae"; a.style.color = b.style.color = "#151515"; } }
{ const K = document.querySelector("#ballc"); if (K) { const orig = K.innerHTML, col = K.style.color;   // надпись над хрустальным шаром (ep58)
  K.innerHTML = "ПРАВИЛЬНЫЙ ОТВЕТ:"; K.style.color = "#ff6fae";
  const B = window.build; window.build = R => { B(R); R.tl.to(K, { opacity: 0, duration: .15 }, HEADT - .6);
    R.tl.set(K, { innerHTML: orig, color: col }, HEADT - .45); R.tl.to(K, { opacity: 1, duration: .15 }, HEADT - .4); }; } }
{ const K = document.querySelector("#skc"); if (K) { const [a, b] = K.children, orig = [a.textContent, b.textContent], bg = K.style.background, col = K.style.color;   // подпись судебного рисунка (ep57)
  a.textContent = "ПРАВИЛЬНЫЙ ОТВЕТ:"; b.textContent = "Г — БОТ"; K.style.background = "#ff6fae"; K.style.color = "#151515";
  const B = window.build; window.build = R => { B(R); R.tl.to(K, { opacity: 0, duration: .15 }, HEADT - .6);
    R.tl.set(a, { textContent: orig[0] }, HEADT - .45).set(b, { textContent: orig[1] }, HEADT - .45).set(K, { background: bg, color: col }, HEADT - .45);
    R.tl.to(K, { opacity: 1, duration: .15 }, HEADT - .4); }; } }
{ const L = document.querySelector("#lbx"); if (L) { const B = window.build; window.build = R => { B(R);   // до склейки с основным видео (HEAD) рамка возвращается к исходной
  const bars = [L.querySelector(".lbt"), L.querySelector(".lbb")], col = ["#fff", "#ffd23f"];
  R.tl.to(bars, { opacity: 0, duration: .15 }, HEADT - .6);
  bars.forEach((el, i) => R.tl.set(el, { textContent: ORIG[i], background: "#000", color: col[i] }, HEADT - .45));
  R.tl.to(bars, { opacity: 1, duration: .15 }, HEADT - .4); }; } }
