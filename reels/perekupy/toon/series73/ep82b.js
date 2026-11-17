// «ТОЛЯН · 21: КТО ПЕРВЫЙ» (ep82) — сезон «Свой автосалон», без мата.
// ОБЛОЖКА (Мазда −17%) → перекидной таймер 7 → 6 дней → обратно к телефону → разделённый экран «ВЫЗОВ…» / «ЗАНЯТО» → блогер Кирилл берёт трубку
// → стрим (REC, зрители, сердечки, комментарии): «как ты так быстро?» — «бот через секунду» → Жора опоздал → «тот самый, с трактором» + «👁 1 000 000»
// → Толян: «тебе бы тоже бота» → телефон: Королла и Приора → площадка ночью 23:58, 8 → 10/10, конфетти, Римма → Жора у ноутбука → финал.
$("#title .a").textContent = E.rubric; $("#title .b").textContent = E.subtitle; $("#title .b").style.fontSize = "74px"; $("#tag span").textContent = "сезон: свой автосалон";
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
const T = (p, x, foot, h, pose = {}, extra = {}, o = {}) => ch("tolyan", spk(p, "tolyan"), x, foot, h, o, pose, extra);
const RI = (p, x, foot, h, pose = {}, extra = {}) => RIM(ch("vika", spk(p, "rimma"), x, foot, h, null, pose, extra));
const K = (p, x, foot, h, o = {}, pose = {}, extra = {}) => ch("perekup", spk(p, "kirill"), x, foot, h, { ...KIRILL, ...o }, pose, extra);
const Z = (p, x, foot, h, o = {}, pose = {}, extra = {}) => ch("perekup", spk(p, "zhora"), x, foot, h, { ...ZHORA, ...o }, pose, extra);
const grp = (id, html, z = "") => `<div class="grp" id="${id}" style="position:absolute;left:0;top:0;width:1080px;height:1920px${z !== "" ? `;z-index:${z}` : ""}">${html}</div>`;
const SL = glow(540, 300, 520, "#fff4d0", .25), LL = glow(880, 760, 520, "#fff6d0", .3), ZL = glow(760, 1200, 480, "#ffd98a", .3), NL = glow(540, 760, 560, "#ffd98a", .18);
const CTA82 = CTA.replace('<div style="position:absolute;', '<div id="cta" style="opacity:0;position:absolute;');
const CM = [["auto_max", "это же Толян с площадки!"], ["marina_v", "как так быстро? 😳"], ["dimon77", "перекуп в кадре 🔥"], ["vitya_k", "через секунду?! что за бот"], ["auto_max", "мне такой надо"]];
const C3 = [["dimon77", "ЗВЕРЬ 😂😂"], ["vitya_k", "дед с трактором легенда"], ["marina_v", "Жора, гарантия кончилась?"]];
const MZ = car(MAZ, -40, 1700, 700, { z: 4, sheen: .4 });

// 1. обложка: Толян с ботом — «Мазда» −17%
{ const H = HOLDPHONE("tolyan", spk("ta", "tolyan"), 540, 2090, 1680, {}, MAZCARD(), { rim: "#ffffff", side: 1 });
  mount("s1", { bg: "ploshchadkasolnce", farBlur: 8, mid: H.mid, lights: H.lights + SL }, { x: 540, y: 960, s: 1 }); }
// 2. перекидной таймер
mount("i1", { bg: "ploshchadkasolnce", over: FLIPCLOCK("7") }, { x: 540, y: 960, s: 1 });
// 3. разделённый экран: «ВЫЗОВ…» / «ЗАНЯТО»
{ const o = SPLIT2("ploshchadkasolnce", T("tb", 540, 1950, 980, { armR: -150 }, { rim: "#fff", side: 1, z: 7 }, { item: "phone" }) + STAMP("📞 ВЫЗОВ…", "#2e9e4a", 290, 330, "stA"),
    "ofiszhorynoch", Z("za", 540, 1950, 980, { item: "phone", look: "o" }, { armR: -150 }, { rim: "#ffd98a", side: -1, z: 7 }) + STAMP("ЗАНЯТО", "#d0302a", 330, 330, "stB", 6));
  CINE.ANCH.za = [813, CINE.ANCH.za[1], CINE.ANCH.za[2]];
  mount("i2", { bg: "ploshchadkasolnce", over: o, bubbles: [{ id: "z0", p: "za", html: "Занято?! Кто ему<br><em>звонит раньше меня?</em>", fs: 34 }] }, { x: 540, y: 960, s: 1 }); }
// 4. блогер берёт трубку
mount("s2", { bg: "loftblogera", mid: K("ka", 540, 1900, 900, { item: "phone" }, { armR: -150 }, { rim: "#ffd6f6", side: 1, z: 7 }), lights: LL,
  bubbles: [{ id: "k0", p: "ka", html: "Алло! Свободна. Приезжайте —<br><em>только я вас сниму для канала!</em>", fs: 34 }] }, { x: 540, y: 1150, s: 1.02 });
// 5. стрим: Толян и Кирилл у «Мазды»
mount("s3", { bg: "loftblogera", mid: MZ + T("tc", 300, 1910, 860, { armR: -110 }, { rim: "#ffd6f6", side: 1, z: 8 }, { item: "phone" }) + K("kb", 800, 1910, 880, {}, { armL: -120 }, { rim: "#ffd6f6", side: -1, z: 8 }), over: STREAM(CM, "12 400", "strm"), lights: LL,
  bubbles: [{ id: "k1", p: "kb", html: "Друзья, у нас перекуп!<br><em>Брат, как ты так быстро?</em>", fs: 36 }, { id: "t0", p: "tc", html: "Бот прислал через секунду<br><em>после публикации.</em>", fs: 36 },
            { id: "k2", p: "kb", html: "Через секунду?!<br><em>Народ, вы это слышали?</em>", fs: 38 }] }, { x: 540, y: 1150, s: 1.02 });
// 6. Жора опоздал
mount("s4", { bg: "loftblogera", mid: K("kd", 300, 1910, 880, {}, {}, { rim: "#ffd6f6", side: 1, z: 8 }) + grp("zg", Z("zb", 800, 1910, 860, { look: "flat" }, { armR: -100 }, { rim: "#ffd6f6", side: -1, z: 8 }), 8), over: STREAM(C3.slice(0, 0), "21 300", "st3"), lights: LL,
  bubbles: [{ id: "z1", p: "zb", html: "Я тоже звонил!", fs: 50 }] }, { x: 540, y: 1150, s: 1.02 });
// 7. «тот самый, с трактором» + миллион просмотров
mount("s5", { bg: "loftblogera", mid: K("ke", 300, 1910, 880, {}, { armR: -150 }, { rim: "#ffd6f6", side: 1, z: 8 }) + Z("zc", 800, 1910, 860, { look: "o" }, {}, { rim: "#ffd6f6", side: -1, z: 8 }), over: STREAM(C3, "34 700", "st4") + VIEWS("1 000 000", 250, 280), lights: LL,
  bubbles: [{ id: "k3", p: "ke", html: "А вы тот самый, с трактором?<br><em>Миллион просмотров!</em>", fs: 36 }] }, { x: 540, y: 1150, s: 1.02 });
// 8. Толян: «тебе бы тоже бота»
mount("s6", { bg: "loftblogera", farBlur: 3, mid: MZ + T("td", 420, 1910, 1000, { armR: -110 }, { rim: "#ffd6f6", side: 1, z: 8 }, { item: "phone" }), lights: LL,
  bubbles: [{ id: "t1", p: "td", html: "Жора, тебе тоже<br><em>нужен бот.</em>", fs: 46 }] }, { x: 540, y: 1100, s: 1.04 });
// 9. бот: Королла и Приора
mount("i3", { bg: "ploshchadkanoch", over: TWOCARDS4() }, { x: 540, y: 960, s: 1 });
// 10. площадка ночью, 23:58: 10/10, Римма
mount("s7", { bg: "ploshchadkanoch", mid: car(MAZ, -60, 1560, 560, { z: 4, sheen: .4 }) + grp("cg2", car(COR, 440, 1600, 660, { z: 5, sheen: .4 }), 5) + grp("cg3", car(PRI, 120, 1800, 640, { z: 6, sheen: .4 }), 6)
    + grp("rg", RI("ra", 900, 1910, 760, { armL: -60 }, { rim: "#ffd98a", side: -1, z: 8 }), 8), over: CONFETTI(), lights: NL,
  bubbles: [{ id: "r0", p: "ra", html: "Десять машин.<br><em>Договор ваш, Анатолий.</em>", fs: 38 }] }, { x: 540, y: 1150, s: 1.02 });
// 11. Жора ночью у ноутбука
mount("s8", { bg: "ofiszhorynoch", mid: Z("zd", 540, 2150, 1500, { look: "flat" }, { armR: -60 }, { rim: "#9fd6ff", side: 1, z: 8 }), lights: ZL + glow(540, 1500, 420, "#9fd6ff", .35),
  bubbles: [{ id: "z2", p: "zd", html: "Миллион просмотров…<br><em>Ну, студент, держись.</em>", fs: 48 }] }, { x: 540, y: 1000, s: 1.04 });
// 12. карточка бота
mount("s9", { bg: "ploshchadkanoch", farBlur: 6, over: CTA82, lights: NL }, { x: 540, y: 1000, s: .98 });

$(".stage").insertAdjacentHTML("beforeend", CNT77("45 000", 7));
$("#end h2").innerHTML = E.end;

window.build = R => {
  const tl = R.tl;
  const { pop } = common(R, { shake: 0 });
  for (const el of Object.values(SC)) {
    el.sheens = [...el.querySelectorAll(".sheen")];
    el.glows = [...el.querySelectorAll(".lights .glow")].map(g => ({ g, o: +g.style.opacity }));
  }
  const talk = (lv, f) => lv > .28 && !(lv < .55 && f % 3 === 2);
  const MOOD = { kc: "o", zc: "o", za: "o", zd: "flat", zb: "flat" };
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
    // сердечки стрима летят вверх и гаснут (по кругу)
    document.querySelectorAll(".hrt").forEach((h, j) => { const p = ((t * .45 + j * .17) % 1);
      h.style.transform = `translate(${(Math.sin(t * 3 + j) * 14).toFixed(1)}px, ${(-p * 520).toFixed(1)}px) scale(${(.7 + p * .5).toFixed(2)})`; h.style.opacity = (p < .15 ? p / .15 : 1 - (p - .15) / .85).toFixed(2); });
    for (const [p, v] of Object.entries(SPK)) {
      if (!document.getElementById(p)) continue;
      const lv = (LIP[v] || [])[f] || 0;
      mouth(p, talk(lv, f) ? "talk" : (MOOD[p] || "grin"));
    }
  });
  window.MUSIC = { style: "bed", bpm: 96, end: R.dur - 1.2 };   // фоновой музыки нет (MUSIC_VOL=0)

  const cam = n => SC[n].cam;
  let cur = "s1";
  const cut = (to, at, c) => { if (c) tl.set(cam(to), c, at); tl.set(SC[cur], { opacity: 0 }, at).set(SC[to], { opacity: 1 }, at); R.sfx("tick", at, .35); cur = to; };
  const swap = (to, at) => { const from = cur;
    tl.set(SC[to], { opacity: 1, x: 1080, filter: "blur(14px)" }, at)
      .to(SC[from], { x: -1080, filter: "blur(14px)", duration: .32, ease: "power3.in" }, at)
      .to(SC[to], { x: 0, filter: "blur(0px)", duration: .35, ease: "power3.out" }, at + .1)
      .set(SC[from], { opacity: 0, x: 0, filter: "none" }, at + .47).set(SC[to], { filter: "none" }, at + .48);
    R.sfx("whoosh", at, .55); cur = to; };
  const push = (n, at, d, to = { s: "+=0.06" }) => tl.to(cam(n), { ...to, duration: d, ease: "none" }, at);
  const ids = E.lines.map(l => l.id), nxt = l => ids[ids.indexOf(l) + 1];
  const bub = (l, until) => pop("#b_" + l, st[l] - .05, until ?? Math.min(en[l] + .8, nxt(l) ? st[nxt(l)] - .1 : en[l] + 1));
  const bump = (sel, at) => tl.fromTo(sel, { scale: 1.3 }, { scale: 1, duration: .4, ease: "back.out(2)", immediateRender: false }, at);
  const cnt = (on, at) => tl.to("#cnt77", { opacity: on ? 1 : 0, duration: on ? .25 : .15 }, at);
  const slam = (sel, at) => { tl.fromTo(sel, { scale: 2.4, opacity: 0, rotation: -14 }, { scale: 1, opacity: 1, rotation: sel.includes("stB") ? 6 : -8, duration: .28, ease: "back.out(1.8)", immediateRender: true }, at); R.sfx("clack", at + .1, .7); };

  // 1. обложка: плашка с кадра 0, гаснет к 1,6 с
  gsap.set(SC.s1, { opacity: 1 }); SC.s1.style.display = "";
  gsap.set(["#cnt", "#cnt77"], { opacity: 0 });
  tl.set(SC.s1, { opacity: 1 }, 0); tl.to("#title", { opacity: 0, y: -50, duration: .25 }, 1.6);
  push("s1", 0, 2.2, { s: 1.06, y: 1000 });
  // 2. таймер: 7 → 6 дней
  const SW2 = Math.max(1.9, Wd("l0", "три", .3) - .2); swap("i1", SW2); cnt(true, SW2 + .3); push("i1", SW2, en.l0 - SW2 + .8, { s: 1.05 });
  const FLIP = Wd("l0", "площадк", .7);
  tl.to("#fc", { rotationX: 90, duration: .18, ease: "power2.in" }, FLIP).set("#fcn", { textContent: "6" }, FLIP + .18)
    .fromTo("#fc", { rotationX: -90 }, { rotationX: 0, duration: .22, ease: "back.out(2)", immediateRender: false }, FLIP + .18); R.sfx("clack", FLIP + .18, .8);
  // 3. обратно к телефону: «Мазда» −17%
  const SW3 = st.l1 - .2; cut("s1", SW3, { s: 1.35, y: 1380, x: 540 }); cnt(false, SW3); push("s1", SW3, Wd("l1", "звонил", .8) - SW3, { s: 1.45 });
  const MZP = Wd("l1", "мазду", .2); tl.fromTo("#mzc", { scale: 1 }, { scale: 1.07, duration: .15, yoyo: true, repeat: 1, ease: "power2.out", immediateRender: false }, MZP); R.sfx("ping", MZP, .6);
  // 4. «Звонили двое»: разделённый экран, штампы
  const SW4 = Wd("l1", "звонил", .8) - .25; swap("i2", SW4);
  slam("#stA", SW4 + .45); slam("#stB", st.z0 - .05); bub("z0", st.k0 - .1);
  // 5. блогер берёт трубку
  cut("s2", st.k0 - .2); push("s2", st.k0 - .2, en.k0 - st.k0 + .5, { s: 1.08 }); bub("k0", st.k1 - .1);
  // 6. стрим: зрители растут, комментарии всплывают
  const SW6 = st.k1 - .3; swap("s3", SW6); push("s3", SW6, en.k2 - SW6 + .5, { s: 1.07 });
  const cms = [...SC.s3.querySelectorAll(".cmt")];
  gsap.set(cms, { opacity: 0 });
  const CT = [st.k1 + .6, en.k1 - .2, st.t0 + .8, en.t0 + .05, st.k2 + .8];
  cms.forEach((c, j) => { tl.fromTo(c, { opacity: 0, x: -60 }, { opacity: 1, x: 0, duration: .25, ease: "back.out(2)", immediateRender: false }, CT[j]); R.sfx("pop", CT[j], .3); });
  const vw = { v: 12400 }; tl.to(vw, { v: 18900, duration: en.k2 - SW6, ease: "none", onUpdate: () => { const e = SC.s3.querySelector("#strmv"); if (e) e.textContent = (Math.round(vw.v / 100) * 100).toLocaleString("ru-RU"); } }, SW6);
  bub("k1", st.t0 - .1); bub("t0", st.k2 - .05); bub("k2", st.l2 + .2);
  // 7. Жора влетает
  const SW7 = st.l2 - .3; cut("s4", SW7); push("s4", SW7, en.z1 - SW7 + .5, { s: 1.07 });
  tl.fromTo("#zg", { x: 700 }, { x: 0, duration: .5, ease: "power3.out", immediateRender: true }, Wd("l2", "приехал", .5)); R.sfx("whoosh", Wd("l2", "приехал", .5), .5);
  bub("z1", st.k3 - .1);
  // 8. «тот самый, с трактором» → миллион
  cut("s5", st.k3 - .2); push("s5", st.k3 - .2, en.k3 - st.k3 + .5, { s: 1.08 }); bub("k3", st.t1 - .05);
  const cms5 = [...SC.s5.querySelectorAll(".cmt")]; gsap.set(cms5, { opacity: 0 });
  const MIL = Wd("k3", "миллион", .75);
  tl.fromTo("#vw", { scale: 3, opacity: 0, rotation: -20 }, { scale: 1, opacity: 1, rotation: -4, duration: .3, ease: "back.out(1.8)", immediateRender: true }, MIL - .1); R.sfx("boom", MIL, .5);
  cms5.forEach((c, j) => { tl.fromTo(c, { opacity: 0, x: -60 }, { opacity: 1, x: 0, duration: .25, ease: "back.out(2)", immediateRender: false }, MIL + .3 + j * .35); R.sfx("pop", MIL + .3 + j * .35, .3); });
  // 9. Толян: «тебе бы тоже бота»; «Мазда» куплена — 8/10
  cut("s6", st.t1 - .2); cnt(true, st.t1); push("s6", st.t1 - .2, en.t1 - st.t1 + .6, { s: 1.1 }); bub("t1", st.l3 + .3);
  const EIGHT = en.t1 + .1; tl.set("#cc", { textContent: "8" }, EIGHT); bump("#cnt77", EIGHT); R.sfx("clack", EIGHT, .6);
  // 10. бот: Королла и Приора
  const SW10 = st.l3 - .3; swap("i3", SW10); cnt(false, SW10);
  const C1 = Wd("l3", "королл", .3), C2 = Wd("l3", "приор", .45);
  tl.fromTo("#crc2", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: .3, ease: "back.out(2)", immediateRender: true }, C1 - .2); R.sfx("ping", C1 - .2, .7);
  tl.fromTo("#prc2", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: .3, ease: "back.out(2)", immediateRender: true }, C2 - .2); R.sfx("ping", C2 - .2, .7);
  // 11. площадка ночью: машины заезжают, 10/10, конфетти, Римма
  const SW11 = (W("l3", "23") ?? Wd("l3", "двадцат", .6)) - .3; swap("s7", SW11); cnt(true, SW11 + .3); push("s7", SW11, en.r0 - SW11 + .6, { s: 1.07 });
  gsap.set("#rg", { opacity: 0 });
  tl.fromTo("#cg2", { x: 1100 }, { x: 0, duration: 1.0, ease: "power3.out", immediateRender: true }, SW11 + .2);
  tl.fromTo("#cg3", { x: -1100 }, { x: 0, duration: 1.0, ease: "power3.out", immediateRender: true }, SW11 + .6); R.sfx("whoosh", SW11 + .2, .4); R.sfx("whoosh", SW11 + .6, .4);
  const TEN = (W("l3", "10") ?? Wd("l3", "десять", .9)); tl.set("#cc", { textContent: "10" }, TEN); bump("#cnt77", TEN); R.sfx("clack", TEN, .8);
  tl.fromTo("#cf", { opacity: 0, scale: .3 }, { opacity: 1, scale: 1, duration: .5, ease: "power2.out", immediateRender: true }, TEN + .1);
  tl.to("#cf", { y: 300, opacity: 0, duration: 2.6, ease: "power1.in" }, TEN + .6); R.sfx("boom", TEN + .1, .5);
  tl.to("#rg", { opacity: 1, duration: .3 }, st.r0 - .5); bub("r0", st.z2 - .1);
  // 12. Жора ночью
  cut("s8", st.z2 - .2); cnt(false, st.z2 - .2); push("s8", st.z2 - .2, en.z2 - st.z2 + .6, { s: 1.12 }); bub("z2", st.l4 + .4);
  // 13. финал: фраза Лиса → карточка
  const SW13 = Math.min(st.l4 + 2.2, en.l4 - 2.3);
  swap("s9", SW13); tl.to("#tag", { opacity: 0, duration: .2 }, SW13);
  tl.fromTo("#cta", { opacity: 0, y: 80, scale: .9 }, { opacity: 1, y: 0, scale: 1, duration: .4, ease: "back.out(1.6)", immediateRender: false }, SW13 + .5);
  ending(R, en.l4 + .3);
};

// ── ep82b «Архив»: быстрая уникализация — меняется только заставка ──
$("#title .a").textContent = "ТОЛЯН · 19:"; $("#title .a").style.cssText = "font-size:110px;background:#2f6db5;color:#fbfaf3";
$("#title .b").textContent = "ДЕШЕВЛЕ, ЧЕМ У СТУДЕНТА"; $("#title .b").style.cssText = "font-size:60px;background:#fbfaf3;color:#2f6db5";
const ORIG = [...document.querySelectorAll("#lbx .lbt, #lbx .lbb")].map(e => e.textContent), HEADT = 2.4;
{ const L = document.querySelector("#lbx"); if (L) { const a = L.querySelector(".lbt"), b = L.querySelector(".lbb");   // кинорамка вместо плашки (ep56)
  a.textContent = "ТОЛЯН · 19:"; b.textContent = "ДЕШЕВЛЕ, ЧЕМ У СТУДЕНТА"; a.style.background = b.style.background = "#2f6db5"; a.style.color = b.style.color = "#fbfaf3"; } }
{ const K = document.querySelector("#ballc"); if (K) { const orig = K.innerHTML, col = K.style.color;   // надпись над хрустальным шаром (ep58)
  K.innerHTML = "ТОЛЯН · 19:"; K.style.color = "#2f6db5";
  const B = window.build; window.build = R => { B(R); R.tl.to(K, { opacity: 0, duration: .15 }, HEADT - .6);
    R.tl.set(K, { innerHTML: orig, color: col }, HEADT - .45); R.tl.to(K, { opacity: 1, duration: .15 }, HEADT - .4); }; } }
{ const K = document.querySelector("#skc"); if (K) { const [a, b] = K.children, orig = [a.textContent, b.textContent], bg = K.style.background, col = K.style.color;   // подпись судебного рисунка (ep57)
  a.textContent = "ТОЛЯН · 19:"; b.textContent = "ДЕШЕВЛЕ, ЧЕМ У СТУДЕНТА"; K.style.background = "#2f6db5"; K.style.color = "#fbfaf3";
  const B = window.build; window.build = R => { B(R); R.tl.to(K, { opacity: 0, duration: .15 }, HEADT - .6);
    R.tl.set(a, { textContent: orig[0] }, HEADT - .45).set(b, { textContent: orig[1] }, HEADT - .45).set(K, { background: bg, color: col }, HEADT - .45);
    R.tl.to(K, { opacity: 1, duration: .15 }, HEADT - .4); }; } }
{ const L = document.querySelector("#lbx"); if (L) { const B = window.build; window.build = R => { B(R);   // до склейки с основным видео (HEAD) рамка возвращается к исходной
  const bars = [L.querySelector(".lbt"), L.querySelector(".lbb")], col = ["#fff", "#ffd23f"];
  R.tl.to(bars, { opacity: 0, duration: .15 }, HEADT - .6);
  bars.forEach((el, i) => R.tl.set(el, { textContent: ORIG[i], background: "#000", color: col[i] }, HEADT - .45));
  R.tl.to(bars, { opacity: 1, duration: .15 }, HEADT - .4); }; } }
