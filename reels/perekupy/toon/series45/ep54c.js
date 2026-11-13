// «ТОЛЯН: СО СТА ТЫСЯЧ · 13» — «Виталик звонит» (киношный формат ../cine.js). Сцены — как в утверждённой раскадровке board.html.
// Звонок в столовой → Виталик у Прадо «не топлёная» → Жора «пункт 7 — берём вдвоём!» → пустырь: «ёлочка», волны запаха → детектор лжи: «ЛОЖЬ» →
// бот: тот же Прадо вчера в Краснодаре «после потопа, 700» → вода до окон, Виталик с феном → бот: Нива дяди Миши 520 → авторынок: 690, +85 →
// капитал 815 000. Последний кадр — только карточка бота. Без фоновой музыки.
$("#title .a").textContent = E.rubric; $("#title .b").textContent = E.subtitle; $("#tag span").textContent = "виталик звонит";
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
const V = (p, x, foot, h, o = {}, pose = {}, extra = {}) => ch("perekup", spk(p, "vitalik"), x, foot, h, { ...VITALIK, ...o }, pose, extra);
const CANT_L = glow(540, 300, 360, "#fff6d8", .35);
const PUST_L = glow(830, 665, 200, "#fff6c8", .6) + glow(540, 800, 420, "#ffb36a", .3);
const REKA_L = glow(800, 300, 380, "#fff3c4", .45);
const RYN_L = glow(880, 200, 360, "#fff3c4", .45);
const PHONE_V = `<svg viewBox="0 0 100 100"><rect x="34" y="10" width="32" height="70" rx="8" fill="#151515"/><rect x="38" y="16" width="24" height="54" rx="3" fill="#4cd964"/></svg>`;

// 1. столовая: входящий звонок → Виталик у Прадо
{ const H = HOLDPHONE("tolyan", spk("tc", "tolyan"), 540, 1960, 1680, null, CALL(), { rim: "#fff6d8", side: 1 });
  mount("s1", { bg: "stolovaya", grade: "day", farBlur: 9, mid: H.mid, lights: H.lights }, { x: 540, y: 960, s: 1 }); }
mount("s1b", { bg: "pustyr", grade: "dawn",
  mid: car(PRADO, 60, 1600, 700, { z: 4, sheen: .7 }) + V("vc", 820, 1760, 760, {}, { armR: -150 }, { rim: "#ffb36a", side: -1, z: 7 }) + INHAND(820, 1760, 760, -150, 90, PHONE_V, 9), lights: PUST_L,
  bubbles: [{ id: "v1", p: "vc", html: "Студент, есть Прадо — по-братски,<br><em>миллион четыреста. Не топлёная!</em>", fs: 36 }] }, { x: 600, y: 1180, s: 1.1 });
// 2. Жора в столовой → пустырь: ёлочка и запах
mount("s2", { bg: "stolovaya", grade: "day",
  mid: T("ts", 300, 1760, 740, {}, { rim: "#fff6d8", side: 1, z: 7 }) + Z("zs", 800, 1770, 760, { look: "grin" }, { armL: 150, armR: -150 }, { rim: "#fff6d8", side: -1, z: 7 }), lights: CANT_L,
  bubbles: [{ id: "z1", p: "zs", html: "Студент, это же Прадо!<br><em>Пункт седьмой — берём вдвоём!</em>", fs: 40 }] }, { x: 560, y: 1180, s: 1.08 });
mount("s2b", { bg: "pustyr", grade: "dawn",
  mid: car(PRADO, 60, 1600, 700, { z: 4, sheen: .8 }) + TREE(380, 1160, .7) + SMELL(300, 960) + V("vp", 860, 1770, 740, {}, { armL: 60 }, { rim: "#ffb36a", side: -1, z: 7 })
    + T("tp", 600, 1780, 720, {}, { rim: "#ffb36a", side: -1, z: 7 }), lights: PUST_L }, { x: 520, y: 1220, s: 1.12 });
// 3. допрос → детектор лжи
mount("s3", { bg: "pustyr", grade: "dawn",
  mid: car(PRADO, 60, 1600, 700, { z: 4, sheen: .5 }) + V("vq", 860, 1770, 740, {}, {}, { rim: "#ffb36a", side: -1, z: 7 }) + T("tq", 600, 1780, 720, { head: -6 }, { rim: "#ffb36a", side: -1, z: 7 }), lights: PUST_L,
  bubbles: [{ id: "t1", p: "tq", html: "Виталик, повтори:<br><em>не топлёная?</em>", fs: 46 }] }, { x: 640, y: 1100, s: 1.7, r: 2 });
mount("s3b", { grade: "night", far: POLY(), farBlur: 0,
  over: `<div id="vlie" style="position:absolute;left:150px;top:1480px;z-index:60;background:#0d0e12;border:6px solid #fff;border-radius:34px;padding:20px 30px;font-family:Unbounded;font-weight:800;font-size:46px;color:#fff;opacity:0">ВИТАЛИК: <em style="font-style:normal;color:#ff3b30">Не топлёная!</em></div>` }, { x: 540, y: 960, s: 1 });
// 4. бот: Краснодар → вода до окон
{ const H = HOLDPHONE("tolyan", spk("tf", "tolyan"), 540, 1960, 1680, null, FLOODCARD(), { rim: "#ffb36a", side: 1 });
  mount("s4", { bg: "pustyr", grade: "dawn", farBlur: 9, mid: H.mid, lights: H.lights }, { x: 540, y: 960, s: 1 }); }
mount("s4b", { bg: "pustyr", grade: "dawn",
  mid: car(PRADOS, 100, 1560, 820, { z: 4, sheen: .4 }) + WATER(100, 1560, 820) + V("vf", 820, 1790, 700, { look: "o" }, { armL: 70 }, { rim: "#ffb36a", side: -1, z: 7 }) + G("dryer", INHANDL(820, 1790, 700, 70, 120, DRYER, 9), 9),
  lights: PUST_L, bubbles: [{ id: "t2", p: "vf", html: "<span style='font-size:28px;color:#8b93a3'>ТОЛЯН:</span><br>Ты её за семьсот взял<br><em>и сушил феном?</em>", fs: 38 }] }, { x: 540, y: 1300, s: 1.08 });
// 5. бот: Нива → дядя Миша у реки
{ const H = HOLDPHONE("tolyan", spk("tn", "tolyan"), 540, 1960, 1680, null, NIVACARD(), { rim: "#fff6d8", side: 1 });
  mount("s5", { bg: "stolovaya", grade: "day", farBlur: 9, mid: H.mid, lights: H.lights }, { x: 540, y: 960, s: 1 }); }
mount("s5b", { bg: "reka", grade: "day",
  mid: car(NIVA, 380, 1620, 640, { z: 4, sheen: .6 }) + ch("perekup", spk("mm", "misha"), 230, 1740, 740, MISHA, { armR: -150 }, { rim: "#fff2c0", side: 1, z: 7 }) + G("rod", INHAND(230, 1740, 740, -150, 120, ROD, 9), 9),
  lights: REKA_L, bubbles: [{ id: "m1", p: "mm", html: "Сынок, на рыбалку ездил — и всё.<br><em>Документы чистые.</em>", fs: 40 }] }, { x: 520, y: 1220, s: 1.08 });
// 6. авторынок → карточка бота
const RYN = (t, z, zpose, extra = "") => car(NIVA, 300, 1620, 600, { z: 4, sheen: .6 }) + extra + T(t, 200, 1770, 720, {}, { rim: "#fff2c0", side: 1, z: 7 })
  + Z(z, 860, 1780, 740, { look: "grin" }, zpose, { rim: "#fff2c0", side: -1, z: 7 });
mount("s6", { bg: "rynokavto", grade: "day", mid: RYN("tr", "zr", { armL: 60 }, G("sold", C.tag(420, 1260, "ПРОДАНО", "690 000", -6, 6, "#4cd964"), 6)), lights: RYN_L,
  bubbles: [{ id: "z2", p: "zr", html: "Студент, пункт девятый:<br><em>Виталику больше не звоним.</em>", fs: 40 }] }, { x: 540, y: 1220, s: 1.08 });
mount("s6b", { bg: "rynokavto", grade: "day", over: CTA54.replace('<div style="position:absolute;', '<div id="cta" style="opacity:0;position:absolute;'), mid: RYN("tr2", "zr2", {}), lights: RYN_L }, { x: 540, y: 1100, s: .96 });   // другой план (общий), а не тот же — без «скачка»

$(".stage").insertAdjacentHTML("beforeend", `<div id="cnt">💰 <span id="cv">730 000</span> ₽ <em id="cd"></em></div>`);
$("#end h2").innerHTML = E.end;

window.build = R => {
  const tl = R.tl;
  const { pop } = common(R, { shake: 0 });
  for (const el of Object.values(SC)) {
    el.sheens = [...el.querySelectorAll(".sheen")];
    el.glows = [...el.querySelectorAll(".lights .glow")].map(g => ({ g, o: +g.style.opacity }));
  }
  const smell = $("#smell"), tree = $("#tree");
  const talk = (lv, f) => lv > .28 && !(lv < .55 && f % 3 === 2);
  const MOOD = { vf: "o", tq: "flat" };
  R.hooks.push(t => {
    const f = Math.floor(t * 30);
    for (const el of Object.values(SC)) {
      const on = +el.style.opacity > 0;
      el.style.display = on ? "" : "none";          // невидимые сцены не держим в отрисовке (иначе Chromium падает на длинных роликах)
      if (!on) continue;
      const k = el.cam.s > 1.6 ? .55 : 1;
      C.apply(el, [(R.noise(t * .6) * 9 + R.noise(t * 1.7 + 40) * 3) * k, (R.noise(t * .5 + 9) * 10 + R.noise(t * 1.9 + 70) * 3) * k, R.noise(t * .4 + 20) * .3 * k]);
      el.sheens.forEach((s, j) => { s.style.backgroundPosition = `${(130 - ((t * 14 + j * 45) % 160)).toFixed(1)}% 0`; });
      el.glows.forEach(({ g, o }, j) => { g.style.opacity = (o * (.88 + .12 * R.noise(t * 2.5 + j * 3.1))).toFixed(3); });
    }
    if (smell) smell.style.transform = `translateY(${(-((t * 60) % 80)).toFixed(0)}px)`;     // запах «поднимается» из салона
    if (tree) tree.style.transform = `rotate(${(Math.sin(t * 2.2) * 8).toFixed(1)}deg)`;     // ёлочка качается
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

  // 1. входящий звонок: зелёная кнопка пульсирует → «принять» → Виталик у Прадо
  gsap.set(SC.s1, { opacity: 1 }); SC.s1.style.display = "";        // первый кадр (обложка) — сразу сцена
  show("s1", 0); tl.to("#title", { opacity: 0, y: -50, duration: .25 }, 1.6); tl.to("#cnt", { opacity: 1, duration: .3 }, 1.8);
  for (let t = .2; t < st.v1 - .5; t += .6) { tl.fromTo("#callok", { scale: 1 }, { scale: 1.18, duration: .3, yoyo: true, repeat: 1, ease: "sine.inOut", immediateRender: false }, t); }
  R.sfx("ring", .3, .7); R.sfx("ring", 2.3, .6);
  move("s1", { s: 1.06, y: 1000 }, 0, st.v1, "none");
  const SW1 = st.v1 - .4; swap("s1", "s1b", SW1); move("s1b", { s: 1.18, x: 640 }, SW1, en.v1 - SW1 + .3, "none"); bub("v1", st.z1 - .15);
  // 2. Жора → пустырь: запах ёлочки
  cut("s1b", "s2", st.z1 - .1); move("s2", { s: 1.14 }, st.z1 - .1, en.z1 - st.z1 + .3, "none"); bub("z1", st.l1 - .45);
  const SW2 = st.l1 - .4; swap("s2", "s2b", SW2); move("s2b", { x: 440, y: 1240, s: 1.25 }, SW2, en.l1 - SW2 + .3, "none");
  gsap.set("#smell", { opacity: .4, scale: .8, transformOrigin: "150px 260px" });
  const STRONG = W("l1", "очень") - .1;
  tl.to("#smell", { opacity: 1, scale: 1.5, duration: .6, ease: "back.out(2)" }, STRONG); R.sfx("swish", STRONG, .5);
  // 3. допрос → детектор лжи: игла рисует, лампа ЛОЖЬ
  cut("s2b", "s3", st.t1 - .1); move("s3", { s: 1.85 }, st.t1 - .1, en.t1 - st.t1 + .3, "none"); bub("t1", st.v2 - .1);
  cut("s3", "s3b", st.v2 - .15); R.sfx("hit", st.v2 - .15, .6);
  const pl = document.getElementById("pline"), Lp = pl.getTotalLength(); gsap.set(pl, { strokeDasharray: `${Lp} ${Lp}`, strokeDashoffset: Lp });
  tl.to(pl, { strokeDashoffset: 0, duration: Math.max(.9, en.v2 - st.v2 + .3), ease: "none" }, st.v2 - .1);
  tl.fromTo("#vlie", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: .2, ease: "back.out(2)", immediateRender: false }, st.v2 - .05);
  const LIE = en.v2 + .05;
  tl.set("#lamp", { background: "#ff3b30", color: "#fff", boxShadow: "0 0 80px #ff3b30" }, LIE); R.sfx("bleep", LIE, .9); R.sfx("bleep", LIE + .25, .9); R.shake(cam("s3b"), LIE, .8, .4);
  for (let k = 0; k < 3; k++) tl.to("#lamp", { opacity: .4, duration: .12, yoyo: true, repeat: 1 }, LIE + .3 + k * .3);
  // 4. бот: Краснодар → вода поднимается, фен
  const SW4 = st.l2 - .4; swap("s3b", "s4", SW4); move("s4", { s: 1.07, y: 1000 }, SW4, en.l2 - SW4, "none");
  gsap.set("#nfl", { opacity: 0 }); const NF = W("l2", "показ") - .1;
  tl.fromTo("#nfl", { opacity: 0, y: -50 }, { opacity: 1, y: 0, duration: .3, ease: "back.out(1.8)", immediateRender: false }, NF); R.sfx("ping", NF, .9);
  cut("s4", "s4b", st.t2 - .1); move("s4b", { s: 1.16 }, st.t2 - .1, en.t2 - st.t2 + .5, "none");
  gsap.set(["#water", "#watert"], { opacity: 0 });
  tl.fromTo("#water", { opacity: 1, scaleY: 0 }, { opacity: 1, scaleY: 1, duration: .9, ease: "power2.out", immediateRender: false }, st.t2 - .1); R.sfx("whoosh", st.t2, .5);
  tl.to("#watert", { opacity: 1, duration: .2 }, st.t2 + .7);
  tl.fromTo("#dryer", { rotation: -10 }, { rotation: 10, duration: .1, yoyo: true, repeat: 9, transformOrigin: "760px 1450px", immediateRender: false }, W("t2", "фен") - .2);
  bub("t2", st.l3 - .15);
  // 5. Нива: карточка бота → дядя Миша
  const SW5 = st.l3 - .4; swap("s4b", "s5", SW5); move("s5", { s: 1.07, y: 1000 }, SW5, en.l3 - SW5, "none");
  gsap.set("#nnv", { opacity: 0 }); const NN = W("l3", "бот") - .1;
  tl.fromTo("#nnv", { opacity: 0, y: -50 }, { opacity: 1, y: 0, duration: .3, ease: "back.out(1.8)", immediateRender: false }, NN); R.sfx("ping", NN, .9);
  const SW5b = st.m1 - .4; swap("s5", "s5b", SW5b); move("s5b", { s: 1.14 }, SW5b, en.m1 - SW5b + .3, "none"); bub("m1", st.l4 - .15);
  tl.fromTo("#rod", { rotation: -3 }, { rotation: 3, duration: .9, yoyo: true, repeat: 3, ease: "sine.inOut", transformOrigin: "230px 1400px", immediateRender: false }, SW5b);
  // 6. авторынок: ПРОДАНО, капитал 730 → 815 → карточка бота
  const SW6 = st.l4 - .4; swap("s5b", "s6", SW6); move("s6", { s: 1.14 }, SW6, en.z2 - SW6 + .3, "none");
  gsap.set("#sold", { opacity: 0 }); const SOLD = W("l4", "уш") - .1;
  tl.fromTo("#sold", { opacity: 0, scale: 2 }, { opacity: 1, scale: 1, duration: .18, ease: "power4.out", immediateRender: false, transformOrigin: "520px 1290px" }, SOLD); R.sfx("clack", SOLD, .7);
  bub("z2", st.end - .15);
  cut("s6", "s6b", st.end - .1); move("s6b", { s: 1.04, y: 1140 }, st.end - .1, en.end - st.end + .6, "none");
  const CAP = W("end", "кап");
  R.count($("#cv"), CAP + .3, 730000, 815000, .9); tl.set("#cd", { textContent: "+85 000" }, CAP + .3); R.sfx("clack", CAP + .3, .6);
  tl.fromTo("#cnt", { scale: 1.25 }, { scale: 1, duration: .4, ease: "back.out(2)", immediateRender: false }, CAP + .3);
  tl.fromTo("#cta", { opacity: 0, y: 80, scale: .9 }, { opacity: 1, y: 0, scale: 1, duration: .4, ease: "back.out(1.6)", immediateRender: false }, W("end", "подпиш") - .3);
  tl.to("#cnt", { opacity: 0, duration: .2 }, en.end + .1);
  ending(R, en.end + .3);
};

// ── ep54c «Неон»: быстрая уникализация — меняется только заставка ──
$("#title .a").textContent = "НЕ ТОПЛЁНАЯ!"; $("#title .a").style.cssText = "font-size:110px;background:#ffd23f;color:#151515";
$("#title .b").textContent = "МАМОЙ КЛЯНУСЬ"; $("#title .b").style.cssText = "font-size:60px;background:#151515;color:#ffd23f";
