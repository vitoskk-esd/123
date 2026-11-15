// «АВТОШКОЛА: ТАМАРА ПАВЛОВНА» (ep68, киношный формат ../cine.js, отдельный ролик). Сцены — как в утверждённой раскадровке board.html.
// Настоящий мат в озвучке (владелец 15.11) — естественный, между делом, мягким учительским тоном; в облачках — со звёздочками.
// ОБЛОЖКА: Тамара Павловна с ботом (Elantra −15%) + плашка «АВТОШКОЛА: / ТАМАРА ПАВЛОВНА» → автодром → «как новая» от Жоры → руль в руках
// → вставка «вторая педаль» → «тормози, бл*дь» → копилка 150 ₽ → «иди-ка ты на*уй» → Элантра в боте → «ни разу не ругнулись» → финал Лиса.
$("#title .a").textContent = E.rubric; $("#title .b").textContent = E.subtitle; $("#title .b").style.fontSize = "80px"; $("#tag span").textContent = "автошкола";
document.querySelector("#cam > svg#bg")?.remove();
const W = (line, pre, n = 0) => {
  const norm = s => s.toLowerCase().replace(/ё/g, "е").replace(/[^а-я0-9a-z]/g, "");
  const hits = (TT.words[line] || []).filter(w => w[1] >= st[line] - .7 && w[2] <= en[line] + .05 && norm(w[0]).startsWith(norm(pre)));
  if (!hits[n]) console.warn("W miss", line, pre);
  return hits[n] ? Math.max(hits[n][1], st[line] - .05) : null;
};
const Wd = (line, pre, frac) => W(line, pre) ?? st[line] + (en[line] - st[line]) * frac;   // слово или доля реплики, если Whisper записал иначе
const root = $("#scene"), SC = {}, SPK = {};
const mount = (name, def, sh) => (SC[name] = C.mount(root, def, sh));
const spk = (p, v) => (SPK[p] = v, p);
const Z = (p, x, foot, h, o = {}, pose = {}, extra = {}) => ch("perekup", spk(p, "zhora"), x, foot, h, { ...ZHORA, ...o }, pose, extra);
const T = (p, x, foot, h, pose = {}, extra = {}) => TPC(ch("vika", spk(p, "tamara"), x, foot, h, null, pose, extra));
const KR = (p, x, foot, h, o = {}, pose = {}, extra = {}) => ch("perekup", spk(p, "kirill"), x, foot, h, { ...KIR, ...o }, pose, extra);
const grp = (id, html) => `<div class="grp" id="${id}" style="position:absolute;left:0;top:0;width:1080px;height:1920px">${html}</div>`;
const AD_L = glow(540, 160, 420, "#fff6d0", .35);
const PK_L = glow(980, 642, 160, "#ff3b30", .35);
const UC_L = glow(540, 520, 360, "#cfe8f5", .3);
const CAB = (tp, kp, tpose = {}, kpose = {}, ko = {}, rim = "#cfe8f5") => T(tp, 300, 2070, 1250, tpose, { rim, side: 1, z: 7 }) + KR(kp, 790, 2070, 1230, ko, kpose, { rim: "#cfe8f5", side: -1, z: 7 });

// 1. обложка: Тамара Павловна с ботом
{ const H = HOLDPHONE("vika", spk("tp", "tamara"), 540, 2090, 1680, null, ELCARD(), { rim: "#fff6d0", side: 1 });
  mount("s1", { bg: "avtodrom", farBlur: 8, mid: TPC(H.mid), lights: H.lights + AD_L }, { x: 540, y: 960, s: 1 }); }
// 2. автодром: первое занятие
mount("s2", { bg: "avtodrom", mid: grp("c2", car(V10, 300, 1560, 640, { z: 5, sheen: .4 }) + USIGN(560, 1290)) + T("ta", 190, 1840, 820, { armR: -60 }, { rim: "#fff6d0", side: 1, z: 7 }) + KR("ka", 900, 1840, 760, {}, { armL: 30 }, { rim: "#fff6d0", side: -1, z: 7 }), lights: AD_L,
  bubbles: [{ id: "k0", p: "ka", html: "Здравствуйте!<br><em>Я на первое занятие.</em>", fs: 38 }, { id: "t0", p: "ta", html: "Садись, солнышко.<br><em>Пристегнись, зеркала настрой.</em>", fs: 38 }] }, { x: 540, y: 1150, s: 1.04 });
// 3. флешбэк: «как новая» от Жоры
mount("s3", { bg: "avtodrom", farBlur: 2, farFilter: "sepia(.35)", mid: car(V10, 260, 1600, 700, { z: 5, sheen: .4 }) + NEWTAG(560, 1330) + Z("za", 180, 1880, 860, { look: "grin" }, { armR: -150 }, { rim: "#fff6d0", side: 1, z: 7 }), lights: AD_L }, { x: 540, y: 1180, s: 1.05 });
// 4. салон: руль в руках
mount("s4", { bg: "uchebka", mid: CAB("tb", "kb", { armR: -30 }, { armL: -60, armR: -60 }, { look: "o" }) + WHEEL(790, 1430, "wh", 300) + DASH(760, "ds", false) + JAR(420, 1190, "jar", 4, "0 ₽"), lights: UC_L,
  bubbles: [{ id: "k1", p: "kb", html: "А руль так и должен…<br><em>отваливаться?</em>", fs: 40 }, { id: "t1", p: "tb", html: "Ё* твою налево…<br><em>Спокойно. Х*йня вопрос.</em>", fs: 40 }] }, { x: 540, y: 1150, s: 1.04 });
// 5. вставка: вторая педаль
mount("s5", { bg: "uchebka", farBlur: 10, mid: PEDAL("pd") }, { x: 540, y: 960, s: 1 });
// 6. паника: «тормози!»
mount("s6", { bg: "uchebka", mid: CAB("tc", "kc", { armL: 80, armR: -150 }, {}, { look: "o" }, "#ff3b30") + DASH(760, "ds2") + JAR(420, 1190, "jar2", 22, "100 ₽"), lights: UC_L + glow(540, 500, 420, "#ff3b30", .2),
  bubbles: [{ id: "t2", p: "tc", html: "Тормози!<br><em>Тормози, бл*дь, родной!</em>", fs: 42 }, { id: "k2", p: "kc", html: "Я торможу-у-у!", fs: 46 }] }, { x: 540, y: 1150, s: 1.04 });
// 7. остановились: копилка
mount("s7", { bg: "uchebka", farBlur: 2, mid: CAB("td", "kd", { armR: -100 }, {}, { look: "o" }) + DASH(760, "ds3") + JAR(420, 1190, "jar3", 30, "150 ₽"), lights: UC_L,
  bubbles: [{ id: "t3", p: "td", html: "Так. Сто пятьдесят в копилку.<br><em>А теперь — к Жоре.</em>", fs: 40 }] }, { x: 540, y: 1150, s: 1.04 });
// 8. перекрёсток: Жора
mount("s8", { bg: "perekrestok", mid: Z("zb", 760, 1840, 860, { look: "grin" }, { armL: 60 }, { rim: "#ffd27a", side: -1, z: 7 }) + T("te", 270, 1840, 860, { armR: -100 }, { rim: "#ffd27a", side: 1, z: 7 }), lights: PK_L,
  bubbles: [{ id: "z0", p: "zb", html: "Тамара Павловна!<br><em>Ну как машинка, летает?</em>", fs: 38 }, { id: "t4", p: "te", html: "Жорочка, солнце моё…<br><em>Иди-ка ты на*уй.</em>", fs: 40 }] }, { x: 540, y: 1150, s: 1.04 });
// 9. бот: Элантра
{ const H = HOLDPHONE("vika", spk("tf", "tamara"), 540, 2000, 1400, null, ELCARD("ecc2"), { rim: "#fff6d0", side: 1 });
  mount("s9", { bg: "avtodrom", farBlur: 5, mid: TPC(H.mid), lights: H.lights + AD_L,
    bubbles: [{ id: "t5", p: "tf", html: "Элантра, ниже рынка…<br><em>Оху*ть. А так можно было?</em>", fs: 40 }] }, { x: 540, y: 1000, s: 1.02 }); }
// 10. новая машина: копилка пустая
mount("s10", { bg: "uchebka", farFilter: "hue-rotate(160deg) saturate(.7) brightness(1.15)", mid: CAB("tg", "kg", {}, {}, { look: "grin" }) + DASH(760, "ds4") + JAR(420, 1190, "jar4", 0, "0 ₽"), lights: UC_L,
  bubbles: [{ id: "k3", p: "kg", html: "Вы сегодня<br><em>ни разу не ругнулись!</em>", fs: 40 }, { id: "t6", p: "tg", html: "Не каркай, Кирюша.<br><em>Поехали.</em>", fs: 40 }] }, { x: 540, y: 1150, s: 1.04 });
// 11. Элантра на автодроме
mount("s11", { bg: "avtodrom", mid: grp("c11", car(ELN, 140, 1600, 800, { z: 5, sheen: .5, flip: true }) + USIGN(600, 1300)) + T("th", 170, 1880, 760, { armR: -150 }, { rim: "#fff6d0", side: 1, z: 7 }) + KR("kh", 920, 1880, 740, { look: "grin" }, { armL: -150 }, { rim: "#fff6d0", side: -1, z: 7 }), lights: AD_L }, { x: 540, y: 1180, s: 1.04 });
// 12. карточка бота
mount("s12", { bg: "avtodrom", over: CTA68.replace('<div style="position:absolute;', '<div id="cta" style="opacity:0;position:absolute;'), lights: AD_L }, { x: 540, y: 1000, s: .98 });

$("#end h2").innerHTML = E.end;

window.build = R => {
  const tl = R.tl;
  const { pop } = common(R, { shake: 0 });
  for (const el of Object.values(SC)) {
    el.sheens = [...el.querySelectorAll(".sheen")];
    el.glows = [...el.querySelectorAll(".lights .glow")].map(g => ({ g, o: +g.style.opacity }));
  }
  const talk = (lv, f) => lv > .28 && !(lv < .55 && f % 3 === 2);
  const MOOD = { kb: "o", kc: "o", kd: "o", tc: "o" };
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
  // монета в копилку: уровень, сумма, подпрыгивание счётчика
  const coin = (jar, pct, sum, at) => {
    tl.to(`#${jar}f`, { height: pct + "%", duration: .35, ease: "bounce.out" }, at).set(`#${jar}c`, { textContent: sum }, at + .05)
      .fromTo(`#${jar}c`, { scale: 1.5 }, { scale: 1, duration: .3, ease: "back.out(3)", immediateRender: false }, at + .05)
      .fromTo(`#${jar}`, { rotation: -4 }, { rotation: 0, duration: .3, ease: "elastic.out(1,.4)", immediateRender: false }, at);
    R.sfx("ping", at, .5);
  };

  // 1. обложка: плашка видна с первого кадра и гаснет к 1,6 с; карточка бота — с кадра 0
  gsap.set(SC.s1, { opacity: 1 }); SC.s1.style.display = "";
  gsap.set("#cnt", { opacity: 0 });
  tl.set(SC.s1, { opacity: 1 }, 0); tl.to("#title", { opacity: 0, y: -50, duration: .25 }, 1.6);
  move("s1", { s: 1.06, y: 1000 }, 0, en.l0 + .3, "none");
  tl.fromTo("#ecc", { scale: 1 }, { scale: 1.06, duration: .15, yoyo: true, repeat: 1, ease: "power2.out", immediateRender: false }, 2.0); R.sfx("ping", 2.0, .6);
  // 2. автодром: «десятка» подъезжает
  const SW2 = st.k0 - .35; swap("s1", "s2", SW2); move("s2", { s: 1.1 }, SW2, en.t0 - SW2 + .3, "none");
  tl.fromTo("#c2", { x: -900 }, { x: 0, duration: 1.2, ease: "power3.out", immediateRender: false }, SW2 + .05);
  bub("k0", st.t0 - .1); bub("t0", st.l1 - .2);
  // 3. флешбэк: «как новая»
  const SW3 = st.l1 - .2; swap("s2", "s3", SW3); move("s3", { s: 1.14, x: 500 }, SW3, en.l1 - SW3 + .4, "none");
  tl.fromTo("#nt", { scale: 0, rotation: -30 }, { scale: 1, rotation: -6, duration: .35, ease: "back.out(2.4)", immediateRender: false }, Wd("l1", "как", .6)); R.sfx("clack", Wd("l1", "как", .6), .5);
  // 4. салон: руль в руках, монеты за «ёпт» и «х*йня»
  const SW4 = st.k1 - .3; swap("s3", "s4", SW4); move("s4", { s: 1.1 }, SW4, en.t1 - SW4 + .4, "none");
  tl.fromTo("#wh", { y: -60, rotation: 0 }, { y: 0, rotation: -14, duration: .5, ease: "bounce.out", immediateRender: false }, Wd("k1", "отвал", .7)); R.sfx("clack", Wd("k1", "отвал", .7), .6);
  bub("k1", st.t1 - .1); bub("t1", st.l2 - .2);
  coin("jar", 12, "50 ₽", Wd("t1", "еб", .05) + .25); coin("jar", 20, "100 ₽", Wd("t1", "ху", .85) + .3);
  // 5. вставка: туфля жмёт педаль — педаль отламывается
  cut("s4", "s5", st.l2 - .2); move("s5", { s: 1.08 }, st.l2 - .2, en.l2 - st.l2 + .4, "none");
  const BR = Wd("l2", "отлом", .4);
  tl.fromTo("#pds", { x: -60, y: -60 }, { x: 0, y: 0, duration: .25, ease: "power3.in", immediateRender: false }, BR - .35)
    .to("#pdp", { y: 700, rotation: 35, transformOrigin: "50% 0%", duration: .7, ease: "power2.in" }, BR)
    .to("#pds", { x: 80, y: 220, duration: .5, ease: "power2.in" }, BR + .05);
  R.sfx("clack", BR, .9); R.sfx("whoosh", BR + .1, .5);
  // 6. паника: камеру трясёт и заваливает
  cut("s5", "s6", st.t2 - .2); move("s6", { s: 1.12 }, st.t2 - .2, en.k2 - st.t2 + .5, "none");
  tl.fromTo(cam("s6"), { r: -4 }, { r: 4, duration: .22, yoyo: true, repeat: Math.round((en.k2 - st.t2 + .4) / .22), ease: "sine.inOut", immediateRender: false }, st.t2 - .2);
  tl.fromTo(SC.s6, { y: -6 }, { y: 6, duration: .06, yoyo: true, repeat: Math.round((en.k2 - st.t2) / .06), ease: "none", immediateRender: false }, st.t2);
  bub("t2", st.k2 - .05); bub("k2", st.t3 - .2); coin("jar2", 30, "150 ₽", Wd("t2", "бл", .5) + .25);
  // 7. остановились: копилка
  cut("s6", "s7", st.t3 - .25); move("s7", { s: 1.12 }, st.t3 - .25, en.t3 - st.t3 + .5, "none"); bub("t3", st.z0 - .2);
  tl.fromTo("#jar3", { scale: 1 }, { scale: 1.12, duration: .2, yoyo: true, repeat: 1, ease: "power2.out", immediateRender: false }, Wd("t3", "копил", .5));
  // 8. перекрёсток: Жора
  const SW8 = st.z0 - .3; swap("s7", "s8", SW8); move("s8", { s: 1.1 }, SW8, en.t4 - SW8 + .4, "none"); bub("z0", st.t4 - .1); bub("t4", st.l3 - .2);
  // 9. бот: Элантра
  const SW9 = st.l3 - .2; swap("s8", "s9", SW9); move("s9", { s: 1.08 }, SW9, en.t5 - SW9 + .4, "none");
  tl.fromTo("#ecc2", { scale: 1 }, { scale: 1.07, duration: .15, yoyo: true, repeat: 1, ease: "power2.out", immediateRender: false }, Wd("t5", "элант", .05)); R.sfx("ping", Wd("t5", "элант", .05), .8);
  bub("t5", st.k3 - .2);
  // 10. новая машина: копилка пустая
  const SW10 = st.k3 - .3; swap("s9", "s10", SW10); move("s10", { s: 1.1 }, SW10, en.t6 - SW10 + .4, "none"); bub("k3", st.t6 - .1); bub("t6", st.l4 - .2);
  tl.fromTo("#jar4c", { scale: 1 }, { scale: 1.4, duration: .2, yoyo: true, repeat: 1, ease: "power2.out", immediateRender: false }, Wd("k3", "ругн", .7));
  // 11–12. финальная фраза Лиса: Элантра на автодроме → карточка бота
  const SW11 = st.l4 - .2; swap("s10", "s11", SW11); move("s11", { s: 1.08 }, SW11, 3, "none");
  tl.fromTo("#c11", { x: -1000 }, { x: 0, duration: 1.2, ease: "power3.out", immediateRender: false }, SW11 + .05);
  const SW12 = Math.min(st.l4 + 2.4, en.l4 - 2); swap("s11", "s12", SW12); tl.to("#tag", { opacity: 0, duration: .2 }, SW12);
  tl.fromTo("#cta", { opacity: 0, y: 80, scale: .9 }, { opacity: 1, y: 0, scale: 1, duration: .4, ease: "back.out(1.6)", immediateRender: false }, SW12 + .5);
  ending(R, en.l4 + .3);
};

// ── ep68h «Пастель»: быстрая уникализация — меняется только заставка ──
$("#title .a").textContent = "ИНСТРУКТОР:"; $("#title .a").style.cssText = "font-size:110px;background:#ff6fae;color:#151515";
$("#title .b").textContent = "ИНТЕЛЛИГЕНТКА БЕЗ ЦЕНЗУРЫ"; $("#title .b").style.cssText = "font-size:60px;background:#151515;color:#ff6fae";
const ORIG = [...document.querySelectorAll("#lbx .lbt, #lbx .lbb")].map(e => e.textContent), HEADT = 2.4;
{ const L = document.querySelector("#lbx"); if (L) { const a = L.querySelector(".lbt"), b = L.querySelector(".lbb");   // кинорамка вместо плашки (ep56)
  a.textContent = "ИНСТРУКТОР:"; b.textContent = "ИНТЕЛЛИГЕНТКА БЕЗ ЦЕНЗУРЫ"; a.style.background = b.style.background = "#ff6fae"; a.style.color = b.style.color = "#151515"; } }
{ const K = document.querySelector("#ballc"); if (K) { const orig = K.innerHTML, col = K.style.color;   // надпись над хрустальным шаром (ep58)
  K.innerHTML = "ИНСТРУКТОР:"; K.style.color = "#ff6fae";
  const B = window.build; window.build = R => { B(R); R.tl.to(K, { opacity: 0, duration: .15 }, HEADT - .6);
    R.tl.set(K, { innerHTML: orig, color: col }, HEADT - .45); R.tl.to(K, { opacity: 1, duration: .15 }, HEADT - .4); }; } }
{ const K = document.querySelector("#skc"); if (K) { const [a, b] = K.children, orig = [a.textContent, b.textContent], bg = K.style.background, col = K.style.color;   // подпись судебного рисунка (ep57)
  a.textContent = "ИНСТРУКТОР:"; b.textContent = "ИНТЕЛЛИГЕНТКА БЕЗ ЦЕНЗУРЫ"; K.style.background = "#ff6fae"; K.style.color = "#151515";
  const B = window.build; window.build = R => { B(R); R.tl.to(K, { opacity: 0, duration: .15 }, HEADT - .6);
    R.tl.set(a, { textContent: orig[0] }, HEADT - .45).set(b, { textContent: orig[1] }, HEADT - .45).set(K, { background: bg, color: col }, HEADT - .45);
    R.tl.to(K, { opacity: 1, duration: .15 }, HEADT - .4); }; } }
{ const L = document.querySelector("#lbx"); if (L) { const B = window.build; window.build = R => { B(R);   // до склейки с основным видео (HEAD) рамка возвращается к исходной
  const bars = [L.querySelector(".lbt"), L.querySelector(".lbb")], col = ["#fff", "#ffd23f"];
  R.tl.to(bars, { opacity: 0, duration: .15 }, HEADT - .6);
  bars.forEach((el, i) => R.tl.set(el, { textContent: ORIG[i], background: "#000", color: col[i] }, HEADT - .45));
  R.tl.to(bars, { opacity: 1, duration: .15 }, HEADT - .4); }; } }
