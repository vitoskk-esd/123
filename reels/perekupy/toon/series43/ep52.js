// «ТОЛЯН: СО СТА ТЫСЯЧ · 12» — «Пункт седьмой» (киношный формат ../cine.js). Сцены — как в утверждённой раскадровке board.html.
// Флешбэк (ч/б + сепия): мойка, Жора тайком берёт белый CLS → объявление: просмотры растут, звонков 0, календарь 1 → 14 → парковка ТЦ: Артур со своим
// толщиномером — «650» → шаурма: «пополам?» (щенячьи глаза) → «пункт 7: машина твоя» → честное объявление, бот присылает его маляру Грише → Жора −80,
// «пункт восьмой» → звонит Виталик (крючок). Без фоновой музыки.
$("#title .a").textContent = E.rubric; $("#title .b").textContent = E.subtitle; $("#tag span").textContent = "пункт седьмой";
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
const WASH_L = glow(540, 130, 300, "#5ad0ff", .5) + glow(540, 900, 380, "#5ad0ff", .22);
const KITCH_L = glow(540, 300, 320, "#fff6d8", .35);
const SHAW_L = glow(540, 600, 420, "#ffd23f", .4) + glow(760, 880, 200, "#ff7a1a", .45);
const SUNSET_L = glow(760, 760, 360, "#ffd08a", .55);
const PARK_L = glow(880, 200, 360, "#fff3c4", .45);
const MARKET52 = () => BOTH("CLS · крашеные · твой город", `<div id="n5">${[["Mercedes CLS · 2012", "990 000 ₽", "крашены 2 элемента"], ["Mercedes CLS · 2011", "1 030 000 ₽", "дверь в шпаклёвке"], ["Mercedes CLS · 2013", "1 050 000 ₽", "крыло крашено"]].map(c => CARD(...c)).join("")}</div>`);
const GRISHABOT = () => BOTH("CLS · до 1,1 млн", `<div id="n5b">${CARD("Mercedes CLS · 2012", "1 020 000 ₽", "дверь в шпаклёвке, остальное родное", "⏱ 1 с после публикации")}</div>`);

// 1. флешбэк: мойка ночью
mount("s1", { bg: "moyka", grade: "night", freeze: 1, over: FLASH(),
  mid: car(CLSW, 200, 1640, 720, { z: 4, sheen: .4, refl: 1 }) + ch("perekup", spk("vm", "vitalik"), 300, 1740, 740, VITALIK, { armR: -70 }, { rim: "#5ad0ff", side: 1, z: 6 })
    + Z("zm", 820, 1760, 760, {}, { armL: 70 }, { rim: "#5ad0ff", side: -1, z: 7 }) + G("cash1", INHAND(300, 1740, 740, -70, 120, CASH, 9), 9), lights: WASH_L }, { x: 560, y: 1200, s: 1.08 });
mount("s1b", { bg: "moyka", grade: "night", freeze: 1, over: FLASH(),
  mid: car(CLSW, 200, 1640, 720, { z: 4, sheen: .4, refl: 1 }) + Z("zm2", 820, 1760, 760, { look: "grin" }, {}, { rim: "#5ad0ff", side: -1, z: 7 }), lights: WASH_L,
  bubbles: [{ id: "z1", p: "zm2", html: "Студент не узнает.<br><em>Продам за миллион четыреста — всё мне!</em>", fs: 38 }] }, { x: 800, y: 1120, s: 1.9, r: 3 });
// 2. кухня: объявление → календарь
{ const H = HOLDPHONE("perekup", spk("zl", "zhora"), 540, 1960, 1680, ZHORA, LISTING("12", "0"), { rim: "#fff6d8", side: 1 });
  mount("s2", { bg: "zhorakuhnya", grade: "warm", farBlur: 9, mid: H.mid, lights: H.lights }, { x: 540, y: 960, s: 1 }); }
mount("s2b", { bg: "zhorakuhnya", grade: "warm", over: CAL(1), mid: Z("zk", 840, 1780, 760, { look: "flat" }, { head: 10 }, { rim: "#fff6d8", side: -1, z: 7 }), lights: KITCH_L }, { x: 540, y: 1100, s: 1.04 });
// 3. парковка ТЦ: Артур с толщиномером
const PARK = (a, z, apose, zo, zpose, gauge) => car(CLSW, 120, 1620, 720, { z: 4, sheen: .5 }) + ch("perekup", spk(a, "artur"), 600, 1740, 740, ARTUR, apose, { rim: "#fff2c0", side: -1, z: 6 })
  + (gauge ? INHANDL(600, 1740, 740, 60, 90, GAUGE, 9) : "") + Z(z, 920, 1770, 760, zo, zpose, { rim: "#fff2c0", side: -1, z: 7 });
mount("s3", { bg: "parkovkatc", grade: "day", mid: PARK("ar", "zp", { armL: 60 }, {}, {}, 1), lights: PARK_L,
  bubbles: [{ id: "a1", p: "ar", html: "Дверь — тысяча двести.<br>«Как с завода»?<br><em>Шестьсот пятьдесят.</em>", fs: 40 }] }, { x: 600, y: 1200, s: 1.08 });
mount("s3b", { bg: "parkovkatc", grade: "day", mid: PARK("ar2", "zp2", {}, { look: "angry" }, { armL: 150 }), lights: PARK_L,
  bubbles: [{ id: "z2", p: "zp2", html: "Шестьсот пятьдесят?!<br><em>Я за миллион сто брал!</em>", fs: 42 }, { id: "a2", p: "ar2", html: "Вот и зря.", fs: 44 }] }, { x: 800, y: 1150, s: 1.7, r: -3 });
// 4. шаурма: признание → щенячьи глаза → пункт 7
const SHAW = (t, z, tpose, zo, food) => T(t, 300, 1760, 740, tpose, { rim: "#ffd23f", side: 1, z: 7 }) + (food ? INHAND(300, 1760, 740, -60, 150, SHAWA, 9) : "")
  + Z(z, 800, 1770, 760, zo, { head: 8 }, { rim: "#ff7a1a", side: -1, z: 7 });
mount("s4", { bg: "shaurma", grade: "night", mid: SHAW("ts", "zs", { armR: -60 }, { look: "flat" }, 1) + G("pup", PUPPY(786, 840, 1236, 22), 12), lights: SHAW_L,
  bubbles: [{ id: "z3", p: "zs", html: "Студент… я нарушил пункт седьмой.<br><em>Минус четыреста пятьдесят. Пополам?</em>", fs: 36 }] }, { x: 560, y: 1180, s: 1.08 });
mount("s4b", { bg: "shaurma", grade: "night", mid: SHAW("ts2", "zs2", {}, { look: "o" }) + G("pup2", PUPPY(786, 840, 1236, 22), 12), lights: SHAW_L,
  bubbles: [{ id: "t1", p: "ts2", html: "Пункт седьмой: покупаем только вдвоём.<br><em>Купил один — машина не наша. Твоя.</em>", fs: 34 }] }, { x: 560, y: 1180, s: 1.08 });
// 5. честное объявление: рынок у Толяна → бот присылает Грише
{ const H = HOLDPHONE("tolyan", spk("tm", "tolyan"), 540, 1960, 1680, null, MARKET52(), { rim: "#ffd23f", side: 1 });
  mount("s5", { bg: "shaurma", grade: "night", farBlur: 9, mid: H.mid, lights: H.lights,
    bubbles: [{ id: "t2", p: "tm", html: "Ладно, помогу. Пишем честно:<br><em>дверь в шпаклёвке. Цена — по рынку.</em>", fs: 36 }] }, { x: 540, y: 960, s: 1 }); }
{ const H = HOLDPHONE("perekup", spk("gb", "grisha"), 540, 1960, 1680, GRISHA, GRISHABOT(), { rim: "#fff2c0", side: 1 });
  mount("s5b", { bg: "parkovkatc", grade: "day", farBlur: 9, mid: H.mid, lights: H.lights,
    bubbles: [{ id: "g1", p: "gb", html: "Шпаклёвку переделаю сам — я маляр.<br><em>Беру за миллион двадцать.</em>", fs: 36 }] }, { x: 540, y: 960, s: 1 }); }
// 6. набережная: итог → звонок Виталика
mount("s6", { bg: "naberezhnaya", grade: "dawn",
  mid: T("tn", 330, 1760, 740, {}, { rim: "#ffc46a", side: 1, z: 7 }) + Z("zn", 760, 1770, 760, { look: "grin" }, { armR: -70 }, { rim: "#ffc46a", side: -1, z: 7 }) + G("gift", INHAND(760, 1770, 760, -70, 90, GAUGE, 9), 9),
  lights: SUNSET_L, bubbles: [{ id: "z4", p: "zn", html: "Студент, пункт восьмой:<br><em>полезу один — бей меня толщиномером.</em>", fs: 36 }] }, { x: 540, y: 1200, s: 1.08 });
mount("s6b", { bg: "naberezhnaya", grade: "dawn",
  over: CTA52.replace('<div style="position:absolute;', '<div id="cta" style="opacity:0;position:absolute;')
    + `<div class="hand wr" id="hook" style="left:70px;top:500px;z-index:62;font-size:80px;color:#ffd23f;-webkit-text-stroke:3px #151515;transform:rotate(-5deg)">Часть 13:<br>Виталик звонит Толяну</div>`,
  mid: T("tn2", 330, 1760, 740, { armR: -150 }, { rim: "#ffc46a", side: 1, z: 7 }) + G("ring", INHAND(330, 1760, 740, -150, 130, PHONE(), 9), 9)
    + Z("zn2", 760, 1770, 760, { look: "o" }, {}, { rim: "#ffc46a", side: -1, z: 7 }), lights: SUNSET_L }, { x: 540, y: 1200, s: 1.08 });

$(".stage").insertAdjacentHTML("beforeend", `<div id="cnt">💰 <span id="cv">730 000</span> ₽ <em id="cd"></em></div>`);
$("#end h2").innerHTML = E.end;

window.build = R => {
  const tl = R.tl;
  const { pop } = common(R, { shake: 0 });
  for (const el of Object.values(SC)) {
    el.sheens = [...el.querySelectorAll(".sheen")];
    el.glows = [...el.querySelectorAll(".lights .glow")].map(g => ({ g, o: +g.style.opacity }));
    el.scr = [...el.querySelectorAll(".scr")].map(s => ({ s, x0: parseFloat(s.style.left) }));
  }
  const talk = (lv, f) => lv > .28 && !(lv < .55 && f % 3 === 2);
  const MOOD = { zk: "flat", zs: "flat", zs2: "o", zp2: "angry", zn2: "o", ar: "flat", ar2: "flat" };
  R.hooks.push(t => {
    const f = Math.floor(t * 30);
    for (const el of Object.values(SC)) {
      if (!(+el.style.opacity > 0)) continue;
      const k = el.cam.s > 1.6 ? .55 : 1;
      C.apply(el, [(R.noise(t * .6) * 9 + R.noise(t * 1.7 + 40) * 3) * k, (R.noise(t * .5 + 9) * 10 + R.noise(t * 1.9 + 70) * 3) * k, R.noise(t * .4 + 20) * .3 * k]);
      el.sheens.forEach((s, j) => { s.style.backgroundPosition = `${(130 - ((t * 14 + j * 45) % 160)).toFixed(1)}% 0`; });
      el.glows.forEach(({ g, o }, j) => { g.style.opacity = (o * (.88 + .12 * R.noise(t * 2.5 + j * 3.1))).toFixed(3); });
      el.scr.forEach(({ s, x0 }, j) => { s.style.left = (x0 + R.noise(t * 3 + j * 7) * 60).toFixed(0) + "px"; s.style.opacity = (.4 + .6 * Math.abs(R.noise(t * 5 + j))).toFixed(2); });   // плёнка «дрожит»
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
  const write = (sel, at, d = .5) => { tl.fromTo(sel, { clipPath: "inset(-20% 100% -20% -5%)" }, { clipPath: "inset(-20% -5% -20% -5%)", duration: d, ease: "power1.inOut", immediateRender: false }, at); R.sfx("type", at, .5); R.sfx("type", at + d * .5, .4); };
  const pulse = (sel, at, sfx = "clack") => { tl.fromTo(sel, { scale: 1.3 }, { scale: 1, duration: .35, ease: "back.out(2)", immediateRender: false }, at); R.sfx(sfx, at, .6); };
  const ids = E.lines.map(l => l.id), nxt = l => ids[ids.indexOf(l) + 1];
  const bub = (l, until) => pop("#b_" + l, st[l] - .05, until ?? Math.min(en[l] + .8, nxt(l) ? st[nxt(l)] - .1 : en[l] + 1));

  // 1. флешбэк: плёнка «перематывается» назад, деньги из рук в руки
  show("s1", 0); tl.to("#title", { opacity: 0, y: -50, duration: .25 }, 1.8); tl.to("#cnt", { opacity: 1, duration: .3 }, 2.0);
  R.sfx("riser", .1, .35);
  move("s1", { s: 1.16, x: 540 }, 0, en.l0b + .3, "power1.inOut");
  tl.fromTo("#cash1", { x: 420, y: 40 }, { x: 0, y: 0, duration: .5, ease: "power2.out", immediateRender: false }, W("l0b", "миллион") - .3); R.sfx("swish", W("l0b", "миллион") - .3, .6);
  cut("s1", "s1b", st.z1 - .1); move("s1b", { s: 2.05 }, st.z1 - .1, en.z1 - st.z1 + .4, "none"); bub("z1", st.l1 - .45);
  // выход из флешбэка — вспышка
  const SW2 = st.l1 - .4; swap("s1b", "s2", SW2); R.flash(SW2 + .1, .6, .25);
  // 2. объявление: просмотры растут, звонков ноль → календарь
  move("s2", { s: 1.07, y: 1000 }, SW2, en.l1 - SW2, "none");
  R.count($("#s2 .views") || document.querySelector(".views"), W("l1", "тр") - .2, 12, 3112, 1.1);
  const CALLS = W("l1", "звон"); tl.fromTo(".calls", { scale: 1 }, { scale: 1.6, duration: .15, yoyo: true, repeat: 3, ease: "power1.inOut", immediateRender: false }, CALLS); R.sfx("bleep", CALLS, .4);
  cut("s2", "s2b", st.l1b - .1); move("s2b", { s: 1.1 }, st.l1b - .1, en.l1b - st.l1b + .4, "none");
  [["7", W("l1b", "седьм")], ["14", W("l1b", "четыр")]].forEach(([d, at]) => {
    tl.fromTo("#cal", { rotationX: 0 }, { rotationX: -80, duration: .12, ease: "power2.in", immediateRender: false }, at - .12)
      .set("#cal .dn", { textContent: d }, at).fromTo("#cal", { rotationX: 80 }, { rotationX: 0, duration: .18, ease: "power2.out", immediateRender: false }, at);
    R.sfx("swish", at - .1, .6); });
  // 3. парковка: Артур с толщиномером → Жора
  const SW3 = st.a1 - .4; swap("s2b", "s3", SW3); move("s3", { x: 560, s: 1.14 }, SW3, en.a1 - SW3 + .3, "none"); bub("a1", st.z2 - .1);
  cut("s3", "s3b", st.z2 - .1); R.shake(cam("s3b"), st.z2, 1, .35); move("s3b", { s: 1.8 }, st.z2 - .1, en.a2 - st.z2 + .3, "none");
  bub("z2", st.a2 - .1); bub("a2", st.z3 - .45);
  // 4. шаурма: «пополам?» — щенячьи глаза → пункт 7
  const SW4 = st.z3 - .4; swap("s3b", "s4", SW4); move("s4", { x: 620, y: 1220, s: 1.3 }, SW4, en.z3 - SW4 + .3, "none"); bub("z3", st.t1 - .15);
  gsap.set("#pup", { opacity: 0 }); const PUP = W("z3", "попол") - .1;
  tl.fromTo("#pup", { opacity: 0, scale: .3, transformOrigin: "813px 1236px" }, { opacity: 1, scale: 1, duration: .25, ease: "back.out(3)", immediateRender: false }, PUP); R.sfx("pop", PUP, .7);
  cut("s4", "s4b", st.t1 - .1); move("s4b", { x: 420, s: 1.2 }, st.t1 - .1, en.t1 - st.t1 + .3, "none"); bub("t1", st.t2 - .45);
  tl.to("#pup2", { opacity: 0, duration: .3 }, W("t1", "тво") - .1);       // «Твоя.» — глаза Жоры гаснут
  // 5. честное объявление → Гриша
  const SW5 = st.t2 - .4; swap("s4b", "s5", SW5); move("s5", { s: 1.07, y: 1000 }, SW5, en.t2 - SW5, "none");
  gsap.set("#n5", { opacity: 0 }); tl.fromTo("#n5", { opacity: 0, y: -40 }, { opacity: 1, y: 0, duration: .3, ease: "back.out(1.8)", immediateRender: false }, W("t2", "цен") - .2); R.sfx("ping", W("t2", "цен") - .2, .7);
  bub("t2", st.l2 - .15);
  const SW5b = st.l2 - .4; swap("s5", "s5b", SW5b); move("s5b", { s: 1.07, y: 1000 }, SW5b, en.g1 - SW5b, "none");
  gsap.set("#n5b", { opacity: 0 }); const N5 = W("l2", "бот") - .1;
  tl.fromTo("#n5b", { opacity: 0, y: -50 }, { opacity: 1, y: 0, duration: .3, ease: "back.out(1.8)", immediateRender: false }, N5); R.sfx("ping", N5, .9);
  bub("g1", st.l3 - .15);
  // 6. итог → пункт восьмой → звонок Виталика
  const SW6 = st.l3 - .4; swap("s5b", "s6", SW6); move("s6", { s: 1.14 }, SW6, en.z4 - SW6 + .3, "none");
  const M80 = W("l3", "минус"); tl.set("#cd", { textContent: "Жора: −80 000", color: "#ff7a1a" }, M80); R.sfx("clack", M80, .5);
  pulse("#cnt", W("l3", "капит"));
  bub("z4", st.end - .15);
  cut("s6", "s6b", st.end - .1); tl.set(cam("s6b"), { s: 1.14 }, st.end - .1);
  tl.fromTo("#ring", { rotation: -6 }, { rotation: 6, duration: .08, yoyo: true, repeat: 15, ease: "none", transformOrigin: "300px 1250px", immediateRender: false }, st.end); R.sfx("ring", st.end, .7);
  write("#hook", st.end + .3, .9);
  tl.fromTo("#cta", { opacity: 0, y: 80, scale: .9 }, { opacity: 1, y: 0, scale: 1, duration: .4, ease: "back.out(1.6)", immediateRender: false }, W("end", "подпиш") - .3);
  tl.to("#cnt", { opacity: 0, duration: .2 }, en.end + .1);
  ending(R, en.end + .3);
};
