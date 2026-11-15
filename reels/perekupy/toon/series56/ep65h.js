// «СТРИМ: ЖОРА В ЭФИРЕ» (ep65, киношный формат ../cine.js, отдельный ролик). Сцены — как в раскадровке board.html.
// ОБЛОЖКА (кадр 0; владелец 15.11: «измени первый кадр» — вместо салона машины): Стас на осенней парковке с телефоном (бот: Mark II −17%),
// за ним размыт вишнёвый Марк + плашка «СТРИМ: / ЖОРА В ЭФИРЕ» (гаснет к 1,6 с)
// → студия ZHORA TV, LIVE 37 → чат «а бот быстрее» → «только опыт!» → донат «не спеши» → эфир на бегу → Люда: «продала» → Стас у Марка
// → «ты же в чате сидел!» → 37 → 12 400 зрителей → «постановочный эфир!» → «и бота ставьте» → Стас: «ссылку скинул» → финал Лиса + карточка.
$("#title .a").textContent = E.rubric; $("#title .b").textContent = E.subtitle; $("#title .b").style.fontSize = "104px"; $("#tag span").textContent = "стрим";
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
const ST = (p, x, foot, h, o = {}, pose = {}, extra = {}) => ch("perekup", spk(p, "stas"), x, foot, h, { ...STAS, ...o }, pose, extra);
const LD = (p, x, foot, h, pose = {}, extra = {}) => LRC(ch("vika", spk(p, "luda"), x, foot, h, null, pose, extra));
const SG_L = glow(540, 620, 300, "#fff6e0", .55) + glow(540, 230, 300, "#ff3bd0", .3);
const PO_L = glow(900, 300, 360, "#fff6d0", .3);
const SA_L = glow(540, 500, 420, "#fff6d0", .3);
const CH1 = [["kolya_drift", "#3fd0ff", "дед, а бот быстрее 😂"], ["vika_auto", "#ff7ae6", "скинь ссылку на бота"], ["serega77", "#4cd964", "это 2010 год?"], ["Стас_88", "#ffd23f", "Марк 2 на Ленина за 790!"]];

// 1. обложка: Стас на парковке с ботом, за ним Марк
{ const H = HOLDPHONE("perekup", spk("sp", "stas"), 540, 2090, 1680, STAS, MKCARD(), { rim: "#fff6d0", side: 1 });
  mount("s1", { bg: "parkovkaosen", grade: "day", farBlur: 7, far: car(MK, 380, 1330, 700, { z: 2 }), mid: H.mid, lights: H.lights + PO_L }, { x: 540, y: 960, s: 1 }); }
// 2. студия: LIVE 37
mount("s2", { bg: "strimgarazh", farBlur: 2, mid: Z("za", 540, 1880, 960, { look: "grin" }, { armL: -150, armR: -40 }, { rim: "#ff7ae6", side: 1, z: 7 }), over: LIVE(37, "lv1"), lights: SG_L,
  bubbles: [{ id: "z1", p: "za", html: "Всем привет! Покажу, как перекуп<br><em>находит машину ниже рынка!</em>", fs: 38 }] }, { x: 540, y: 1150, s: 1.05 });
// 3. чат
mount("s3", { bg: "strimgarazh", farBlur: 8, mid: Z("zb", 540, 1700, 1000, { look: "o" }, {}, { z: 5 }), over: LIVE(41, "lv2") + CHAT(CH1, "ct", 1340), lights: SG_L }, { x: 540, y: 960, s: 1 });
// 4. «только опыт!»
mount("s4", { bg: "strimgarazh", farBlur: 6, mid: Z("zc", 540, 1900, 1000, { look: "grin" }, { armL: 40 }, { rim: "#ff7ae6", side: 1, z: 7 }), over: LIVE(41, "lv3"), lights: SG_L,
  bubbles: [{ id: "z2", p: "zc", html: "Какой бот? Только опыт!<br><em>Марк на Ленина — еду!</em>", fs: 44 }] }, { x: 540, y: 1150, s: 1.08 });
// 5. донат
mount("s5", { bg: "strimgarazh", farBlur: 6, mid: Z("zd", 540, 1900, 1000, { look: "grin" }, {}, { rim: "#ff7ae6", side: 1, z: 7 }), over: LIVE(44, "lv4") + DONATE("Стас_88", "100 ₽", "Жора, не спеши 😉", "dn"), lights: SG_L,
  bubbles: [{ id: "z3", p: "zd", html: "О, донат!<br><em>Спасибо, Стас!</em>", fs: 48 }] }, { x: 540, y: 1150, s: 1.08 });
// 6. эфир на бегу
mount("s6", { bg: "parkovkaosen", grade: "day", farBlur: 3, mid: Z("ze", 540, 1980, 1100, { look: "o" }, { armR: -100 }, { rim: "#fff6d0", side: 1, z: 7 }) + INHAND(540, 1980, 1100, -100, 220, SELFIE, 9), over: LIVE(52, "lv5", true), lights: PO_L,
  bubbles: [{ id: "z3r", p: "ze", html: "Бегу!<br><em>Эфир не выключаем!</em>", fs: 48 }] }, { x: 540, y: 1150, s: 1.1, r: -4 });
// 7. Люда
mount("s7", { bg: "parkovkaosen", grade: "day", mid: LD("la", 300, 1820, 840, { armR: -60 }, { rim: "#fff6d0", side: 1, z: 7 }) + Z("zf", 800, 1820, 860, { look: "o" }, { armR: -100 }, { rim: "#fff6d0", side: -1, z: 7 }) + INHAND(800, 1820, 860, -100, 200, SELFIE, 9), over: LIVE(58, "lv6", true), lights: PO_L,
  bubbles: [{ id: "d1", p: "la", html: "Марк? Продала пять минут назад —<br><em>парень по боту приехал.</em>", fs: 38 }, { id: "z3b", p: "zf", html: "Как пять минут?!<br><em>Я же в прямом эфире!</em>", fs: 42 }] }, { x: 540, y: 1180, s: 1.05 });
// 8. Стас у Марка
mount("s8", { bg: "parkovkaosen", grade: "day", mid: G("mkdrv", car(MK, -40, 1700, 800, { z: 4, sheen: .5 }), 4) + ST("sg", 880, 1760, 760, {}, { armR: -150 }, { rim: "#fff6d0", side: -1, z: 7 }), over: LIVE(63, "lv7", true), lights: PO_L,
  bubbles: [{ id: "s1", p: "sg", html: "Жора, привет зрителям!<br><em>Я же писал — не спеши!</em>", fs: 42 }] }, { x: 540, y: 1250, s: 1.05 });
// 9. «ты же в чате сидел!»
mount("s9", { bg: "parkovkaosen", grade: "day", farBlur: 5, mid: Z("zg", 540, 1900, 1000, { look: "o" }, { armL: 40 }, { rim: "#fff6d0", side: 1, z: 7 }), over: LIVE(71, "lv8", true), lights: PO_L,
  bubbles: [{ id: "z4", p: "zg", html: "Стас?!<br><em>Ты же в чате сидел!</em>", fs: 50 }] }, { x: 540, y: 1150, s: 1.1 });
// 10. зрителей 12 400
mount("s10", { far: VIRAL("vr"), farBlur: 0 }, { x: 540, y: 960, s: 1 });
// 11. «постановочный эфир!»
mount("s11", { bg: "parkovkaosen", grade: "day", farBlur: 5, mid: Z("zh", 540, 1900, 1000, { look: "o" }, { armL: 40 }, { rim: "#fff6d0", side: 1, z: 7 }), over: LIVE("12 400", "lv9", true) + CHAT([["kolya_drift", "#3fd0ff", "АХАХАХА"], ["bot_fan", "#4cd964", "бот 1:0 Жора"], ["vika_auto", "#ff7ae6", "не верим 😂"]], "cb", 1300), lights: PO_L,
  bubbles: [{ id: "z5", p: "zh", html: "Это был…<br><em>постановочный эфир!</em>", fs: 48 }] }, { x: 540, y: 1150, s: 1.08 });
// 12. «и бота ставьте»
mount("s12", { bg: "strimgarazh", farBlur: 3, mid: Z("zi", 540, 1880, 960, { look: "grin" }, { armR: -60 }, { rim: "#ff7ae6", side: 1, z: 7 }), over: LIVE("12 400", "lv10"), lights: SG_L,
  bubbles: [{ id: "z6", p: "zi", html: "Подписывайтесь…<br><em>и бота тоже ставьте.</em>", fs: 46 }] }, { x: 540, y: 1150, s: 1.05 });
// 13. Стас у своего Марка: «ссылку скинул»
mount("s13", { bg: "parkovkaosen", grade: "day", farBlur: 6, far: car(MK, 300, 1330, 700, { z: 2 }), mid: ST("sj", 600, 1980, 1050, {}, { phone: 1 }, { rim: "#fff6d0", side: -1, z: 7 }), lights: PO_L,
  bubbles: [{ id: "s2", p: "sj", html: "Жора, ссылку на бота<br><em>я тебе в чат скинул.</em>", fs: 42 }] }, { x: 600, y: 1150, s: 1.05 });
// 14. карточка бота
mount("s14", { bg: "strimgarazh", over: CTA65.replace('<div style="position:absolute;', '<div id="cta" style="opacity:0;position:absolute;'), lights: SG_L }, { x: 540, y: 1000, s: .98 });

$("#end h2").innerHTML = E.end;

window.build = R => {
  const tl = R.tl;
  const { pop } = common(R, { shake: 0 });
  for (const el of Object.values(SC)) {
    el.sheens = [...el.querySelectorAll(".sheen")];
    el.glows = [...el.querySelectorAll(".lights .glow")].map(g => ({ g, o: +g.style.opacity }));
  }
  const talk = (lv, f) => lv > .28 && !(lv < .55 && f % 3 === 2);
  const MOOD = { zb: "o", ze: "o", zf: "o", zg: "o", zh: "o" };
  // счётчик зрителей: в студии 37 → 41; в «вирусной» вставке 37 → 12 400
  const V0 = st.l4 - .1, V1 = W("l4", "12") + .6, vr = document.getElementById("vr"), lv1 = document.getElementById("lv1n");
  const fmt = n => n >= 1000 ? Math.floor(n / 1000) + " " + String(n % 1000).padStart(3, "0") : String(n);
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
    lv1.textContent = 37 + Math.floor(4 * Math.min(1, Math.max(0, (t - st.z1) / (en.z1 - st.z1))));
    const x = Math.min(1, Math.max(0, (t - V0) / (V1 - V0)));
    vr.textContent = fmt(Math.round(37 + (12400 - 37) * x * x * x));
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
  const bub = (l, until, from) => pop("#b_" + l, from ?? st[l] - .05, until ?? Math.min(en[l] + .8, nxt(l) ? st[nxt(l)] - .1 : en[l] + 1));
  const rise = (sel, at, snd = "tap") => { gsap.set(sel, { opacity: 0 }); tl.fromTo(sel, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: .25, ease: "back.out(1.6)", immediateRender: false }, at); if (snd) R.sfx(snd, at, .6); };
  const heart = (sel, at) => tl.fromTo(sel, { y: 0, opacity: 1, scale: 1 }, { y: -320, opacity: 0, scale: 1.4, duration: 1.2, ease: "power1.out", immediateRender: false }, at);

  // 1. обложка: плашка видна с первого кадра и гаснет к 1,6 с; карточка бота — с кадра 0
  gsap.set(SC.s1, { opacity: 1 }); SC.s1.style.display = "";
  gsap.set("#cnt", { opacity: 0 });
  show("s1", 0); tl.to("#title", { opacity: 0, y: -50, duration: .25 }, 1.6);
  move("s1", { s: 1.06, y: 1000 }, 0, en.l0 + .4, "none");
  tl.fromTo("#mcc", { scale: 1 }, { scale: 1.06, duration: .15, yoyo: true, repeat: 1, ease: "power2.out", immediateRender: false }, 2.0); R.sfx("ping", 2.0, .6);
  // 2. студия: LIVE
  const SW2 = st.z1 - .5; swap("s1", "s2", SW2); move("s2", { s: 1.12 }, SW2, en.z1 - SW2 + .3, "none"); bub("z1", st.l1 - .2);
  R.sfx("bleep", SW2 + .4, .12); [0, 1.2, 2.6, 4].forEach(d => heart("#lv1h", st.z1 + d));
  // 3. чат: комментарии всплывают по одному
  const SW3 = st.l1 - .2; cut("s2", "s3", SW3); move("s3", { s: 1.04 }, SW3, en.l1 - SW3 + .6, "none");
  [0, 1, 2, 3].forEach(k => rise(`#ct${k}`, SW3 + .35 + k * .55, "tap"));
  // 4. «только опыт!»
  cut("s3", "s4", st.z2 - .2); move("s4", { s: 1.16 }, st.z2 - .2, en.z2 - st.z2 + .4, "none"); bub("z2", st.l2 - .2);
  // 5. донат
  cut("s4", "s5", st.l2 - .2); move("s5", { s: 1.14 }, st.l2 - .2, W("z3", "бег") - st.l2 + .2, "none");
  gsap.set("#dn", { opacity: 0 }); tl.fromTo("#dn", { opacity: 0, scale: .4, y: -80 }, { opacity: 1, scale: 1, y: 0, duration: .35, ease: "back.out(2)", immediateRender: false }, W("l2", "задон"));
  R.sfx("ping", W("l2", "задон"), .9); R.sfx("pop", W("l2", "задон") + .15, .6); tl.to("#dn", { opacity: 0, y: -40, duration: .25 }, en.l2 + .6);
  const RUN = W("z3", "бег") - .1; bub("z3", RUN - .05);
  // 6. эфир на бегу: кадр трясётся
  swap("s5", "s6", RUN); bub("z3r", st.l3 - .1, RUN + .1); R.sfx("whoosh", RUN + .2, .5);
  tl.fromTo(cam("s6"), { r: -5 }, { r: 3, duration: .22, yoyo: true, repeat: Math.round((en.l3 - RUN) / .22), ease: "sine.inOut", immediateRender: false }, RUN);
  tl.fromTo(cam("s6"), { y: 1150 }, { y: 1185, duration: .14, yoyo: true, repeat: Math.round((en.l3 - RUN) / .14), ease: "sine.inOut", immediateRender: false }, RUN);
  // 7. Люда: «продала»
  cut("s6", "s7", st.d1 - .2); move("s7", { s: 1.1 }, st.d1 - .2, en.z3b - st.d1 + .4, "none"); bub("d1", st.z3b - .1); bub("z3b", st.s1 - .2);
  // 8. Стас у Марка машет, Марк уезжает
  cut("s7", "s8", st.s1 - .2); move("s8", { s: 1.1 }, st.s1 - .2, en.s1 - st.s1 + .4, "none"); bub("s1", st.z4 - .1);
  tl.fromTo('[data-p="sg"]', { rotation: -3 }, { rotation: 3, duration: .25, yoyo: true, repeat: 7, transformOrigin: "50% 100%", immediateRender: false }, st.s1);
  // 9. «ты же в чате сидел!»
  cut("s8", "s9", st.z4 - .1); move("s9", { s: 1.2 }, st.z4 - .1, en.z4 - st.z4 + .4, "none"); bub("z4", st.l4 - .2);
  // 10. зрителей 12 400
  const SW10 = st.l4 - .2; swap("s9", "s10", SW10); move("s10", { s: 1.06 }, SW10, en.l4 - SW10 + .4, "none");
  [...Array(7).keys()].forEach(k => { gsap.set(`#vre${k}`, { opacity: 0 }); heart(`#vre${k}`, SW10 + .5 + k * .3); });
  for (let k = 0; k < 10; k++) R.sfx("tick", V0 + (V1 - V0) * Math.sqrt(k / 10), .3); R.sfx("impact", V1, .6);
  // 11. «постановочный эфир!»
  cut("s10", "s11", st.z5 - .2); move("s11", { s: 1.14 }, st.z5 - .2, en.l5 - st.z5 + .4, "none"); bub("z5", st.l5 - .1);
  [0, 1, 2].forEach(k => rise(`#cb${k}`, st.l5 + k * .35, "tap"));
  // 12. «и бота ставьте»
  cut("s11", "s12", st.z6 - .2); move("s12", { s: 1.12 }, st.z6 - .2, en.z6 - st.z6 + .4, "none"); bub("z6", st.s2 - .2);
  // 13. Стас в машине
  cut("s12", "s13", st.s2 - .2); move("s13", { s: 1.12 }, st.s2 - .2, en.s2 - st.s2 + .4, "none"); bub("s2", st.l6 - .2); R.sfx("ping", W("s2", "скин"), .6);
  // 14. финальная фраза Лиса про бот → карточка
  const SW14 = st.l6 - .2; swap("s13", "s14", SW14); tl.to("#tag", { opacity: 0, duration: .2 }, SW14);
  tl.fromTo("#cta", { opacity: 0, y: 80, scale: .9 }, { opacity: 1, y: 0, scale: 1, duration: .4, ease: "back.out(1.6)", immediateRender: false }, SW14 + .6);
  ending(R, en.l6 + .3);
};

// ── ep65h «Пастель»: быстрая уникализация — меняется только заставка ──
$("#title .a").textContent = "ЭФИР:"; $("#title .a").style.cssText = "font-size:110px;background:#ff6fae;color:#151515";
$("#title .b").textContent = "МАРК УЕХАЛ ПО БОТУ"; $("#title .b").style.cssText = "font-size:60px;background:#151515;color:#ff6fae";
const ORIG = [...document.querySelectorAll("#lbx .lbt, #lbx .lbb")].map(e => e.textContent), HEADT = 2.4;
{ const L = document.querySelector("#lbx"); if (L) { const a = L.querySelector(".lbt"), b = L.querySelector(".lbb");   // кинорамка вместо плашки (ep56)
  a.textContent = "ЭФИР:"; b.textContent = "МАРК УЕХАЛ ПО БОТУ"; a.style.background = b.style.background = "#ff6fae"; a.style.color = b.style.color = "#151515"; } }
{ const K = document.querySelector("#ballc"); if (K) { const orig = K.innerHTML, col = K.style.color;   // надпись над хрустальным шаром (ep58)
  K.innerHTML = "ЭФИР:"; K.style.color = "#ff6fae";
  const B = window.build; window.build = R => { B(R); R.tl.to(K, { opacity: 0, duration: .15 }, HEADT - .6);
    R.tl.set(K, { innerHTML: orig, color: col }, HEADT - .45); R.tl.to(K, { opacity: 1, duration: .15 }, HEADT - .4); }; } }
{ const K = document.querySelector("#skc"); if (K) { const [a, b] = K.children, orig = [a.textContent, b.textContent], bg = K.style.background, col = K.style.color;   // подпись судебного рисунка (ep57)
  a.textContent = "ЭФИР:"; b.textContent = "МАРК УЕХАЛ ПО БОТУ"; K.style.background = "#ff6fae"; K.style.color = "#151515";
  const B = window.build; window.build = R => { B(R); R.tl.to(K, { opacity: 0, duration: .15 }, HEADT - .6);
    R.tl.set(a, { textContent: orig[0] }, HEADT - .45).set(b, { textContent: orig[1] }, HEADT - .45).set(K, { background: bg, color: col }, HEADT - .45);
    R.tl.to(K, { opacity: 1, duration: .15 }, HEADT - .4); }; } }
{ const L = document.querySelector("#lbx"); if (L) { const B = window.build; window.build = R => { B(R);   // до склейки с основным видео (HEAD) рамка возвращается к исходной
  const bars = [L.querySelector(".lbt"), L.querySelector(".lbb")], col = ["#fff", "#ffd23f"];
  R.tl.to(bars, { opacity: 0, duration: .15 }, HEADT - .6);
  bars.forEach((el, i) => R.tl.set(el, { textContent: ORIG[i], background: "#000", color: col[i] }, HEADT - .45));
  R.tl.to(bars, { opacity: 1, duration: .15 }, HEADT - .4); }; } }
