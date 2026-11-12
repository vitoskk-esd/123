// «ПЕРЕГОН · 900 км за ночь» (ep48, отдельная серия, киношный формат ../cine.js). Сцены — как в утверждённой раскадровке board.html.
// Костя ловит в боте Mark II за 790 000 (−17% к рынку) в Казани → автобус → продавец Денис поднимает цену, Костя показывает скрин → договор на капоте
// → метель, фура с дальним → кафе 24 часа, кот на капоте → утро, инспектор Соколов: «Где нашёл?». Часы ночи на экране; снег; блики; без музыки.
$("#title .a").textContent = E.rubric; $("#title .b").textContent = E.subtitle; $("#tag span").textContent = "перегон · 900 км";
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
const HP = (p, v, inner, o = KOSTYA, x = 540, extra = {}) => HOLDPHONE("perekup", spk(p, v), x, 1960, 1680, o, inner, extra);
// полосы огней трассы за окнами автобуса (каждое окно — свой «просвет»)
const WINS = [20, 390, 760].map((x, k) => `<div class="win" style="left:${x + 12}px;top:392px;width:276px;height:336px;z-index:1">${Array.from({ length: 6 }, (_, j) =>
  `<i style="top:${170 + j * 26}px;width:${60 + ((k * 7 + j * 13) % 5) * 30}px;background:${["#ffd27a", "#ff7a3a", "#fff6c8"][(j + k) % 3]};opacity:.7" data-ph="${(k * 0.37 + j * 0.21) % 1}" data-sp="${1.1 + (j % 3) * .5}"></i>`).join("")}</div>`).join("");

// 1. автобус: бот в руке (хук) → Костя в кресле
{ const H = HP("ka", "kostya", BOTCARD48().replace("<div style=\"background:#1c1f26", "<div id=\"n1\" style=\"background:#1c1f26"), KOSTYA, 540, { rim: "#5ab0ff", side: 1 });
  mount("s1p", { bg: "avtobus", grade: "night", farBlur: 9, mid: H.mid, lights: H.lights }, { x: 540, y: 960, s: 1 }); }
mount("s1", { bg: "avtobus", grade: "night",
  mid: WINS + SLEEPER(600, 990, 190) + SLEEPER(850, 1010, 180, "#c0392b") + ch("perekup", spk("kb", "kostya"), 330, 1580, 720, KOSTYA, {}, { rim: "#5ab0ff", side: 1 }) + SEAT(100, 1250, 460),
  lights: glow(330, 1120, 160, "#7fd0ff", .4) + [90, 270, 450, 630, 810, 990].map(x => glow(x, 200, 70, "#5ab0ff", .6)).join(""),
  bubbles: [{ id: "k1", p: "kb", html: "Девятьсот километров?<br><em>Уже еду!</em>", fs: 44 }] }, { x: 540, y: 1080, s: 1.05 });
// 2. Казань: продавец поднимает цену → скрин
const LAMP = glow(805, 525, 120, "#fff6c8", .9) + beam([[770, 530], [840, 530], [1080, 1700], [420, 1700]], "#fff6c8", .22);
mount("s2", { bg: "gostinica", grade: "night", fx: SNOWFX(120, 5),
  mid: car(MARK, 420, 1650, 640, { z: 5, sheen: .55 }) + ch("perekup", spk("dn", "denis"), 250, 1700, 770, DENIS, { armR: -30 }, { rim: "#ffd27a", side: 1 })
    + ch("perekup", spk("kc", "kostya"), 860, 1740, 740, KOSTYA, {}, { rim: "#ffd27a", side: -1, z: 7 }),
  lights: LAMP + glow(540, 290, 300, "#ff5a8a", .25),
  bubbles: [{ id: "d1", p: "dn", html: "Тут ещё трое звонили.<br><em>Давай восемьсот пятьдесят.</em>", fs: 40 }] }, { x: 540, y: 1160, s: 1.12 });
{ const H = HP("kp", "kostya", SCREEN48().replace("<svg viewBox=\"0 0 300 120\"", "<svg id=\"circ\" viewBox=\"0 0 300 120\"").replace("<div style=\"font-family:Caveat", "<div id=\"vot\" style=\"font-family:Caveat"),
    KOSTYA, 540, { rim: "#ffd27a", side: -1, head: -4 });
  mount("s2p", { bg: "gostinica", grade: "night", farBlur: 9, fx: SNOWFX(80, 7, 1.4), mid: H.mid, lights: H.lights + glow(805, 525, 160, "#fff6c8", .5),
    bubbles: [{ id: "k2", p: "kp", html: "Ты сам выставил за семьсот девяносто.<br><em>Вот — в 22:03.</em>", fs: 40 }] }, { x: 540, y: 960, s: 1 }); }
// 3. Денис сдаётся → договор на капоте
mount("s3", { bg: "gostinica", grade: "night", fx: SNOWFX(90, 9),
  mid: car(MARK, 420, 1650, 640, { z: 5, sheen: .4 }) + ch("perekup", spk("dm", "denis"), 380, 1700, 780, { ...DENIS, item: "cash", look: "angry" }, { head: 6 }, { rim: "#ffd27a", side: 1 }),
  lights: LAMP, bubbles: [{ id: "d2", p: "dm", html: "…Ладно.<br><em>Семьсот девяносто.</em>", fs: 52 }] }, { x: 420, y: 1150, s: 1.9, r: -4 });
mount("s3h", { grade: "night", far: HOOD(), farBlur: 0, fx: SNOWFX(70, 11),
  over: [["ДКП", 300], ["ОСАГО онлайн", 410], ["10 дней на учёт", 520]].map(([t, y], k) => CHECK(k, t, y).replace("left:560px", "position:absolute;left:90px")).join(""),
  lights: glow(540, 300, 500, "#fff6c8", .3) }, { x: 540, y: 960, s: 1 });
// 4. метель: вид из-за руля → Костя за рулём
mount("s4", { bg: "metel", grade: "night", farBlur: 0, fx: SNOWFX(160, 13, 1.2),
  lights: G("fura", glow(540, 890, 320, "#fff6d8", .75) + glow(540, 890, 90, "#ffffff", .9), 30) }, { x: 540, y: 960, s: 1 });
mount("s4k", { bg: "salonmark", grade: "night", fx: SNOWFX(60, 15),
  mid: ch("perekup", spk("kd", "kostya"), 420, 1760, 920, { ...KOSTYA, look: "angry" }, { armL: -20, armR: 20 }, { rim: "#fff6d8", side: 1 }) + DASH48,
  lights: G("glare", glow(420, 980, 420, "#fff6d8", .55) + glow(700, 700, 300, "#fff6d8", .3), 30),
  bubbles: [{ id: "k3", p: "kd", html: "Так, Марк, не подведи…<br><em>Фура, выключи дальний!</em>", fs: 44 }] }, { x: 480, y: 1100, s: 1.15 });
// 5. кафе 24 часа: тётя Люба, кот Барсик на капоте за окном
const CAFE_FAR = car(MARK, 650, 800, 360, { z: 1 }) + CAT(690, 612, 120);
mount("s5", { bg: "kafe24", grade: "warm", far: CAFE_FAR,
  mid: ch("perekup", spk("ly", "lyuba"), 300, 1320, 720, LYUBA, { armR: -40 }, { rim: "#ffd27a", side: 1, noShadow: 1 })
    + `<div style="left:0;top:940px;width:1080px;height:210px;z-index:7;background:linear-gradient(#8a5a33 0 60px,#6b4422 60px);border-top:7px solid #151515;border-bottom:5px solid #151515"></div>`
    + G("plate", `<div style="left:330px;top:890px;width:110px;height:56px;z-index:8;background:#f4f1e8;border:5px solid #151515;border-radius:0 0 50px 50px"></div>`, 8)
    + ch("perekup", spk("ke", "kostya"), 780, 1760, 760, KOSTYA, {}, { rim: "#ffd27a", side: -1, z: 9 }),
  lights: glow(720, 210, 160, "#ff3b6a", .45) + glow(330, 860, 120, "#fff2c0", .35),
  bubbles: [{ id: "y1", p: "ly", html: "Сынок, ты чего зелёный такой?<br><em>Садись, пельмени горячие.</em>", fs: 38 }, { id: "y2", p: "ly", html: "Это Барсик.<br><em>Капот же тёплый.</em>", fs: 42 }] }, { x: 540, y: 1100, s: 1.06 });
mount("s5b", { bg: "kafe24", grade: "warm", far: CAFE_FAR,
  mid: ch("perekup", spk("kf", "kostya"), 780, 1760, 760, { ...KOSTYA, look: "o" }, { head: -8 }, { rim: "#ffd27a", side: -1, z: 9 }),
  lights: glow(720, 210, 160, "#ff3b6a", .45),
  bubbles: [{ id: "k4", p: "kf", html: "А чей это кот<br><em>на моей машине?</em>", fs: 44 }] }, { x: 800, y: 900, s: 1.55 });
// 6. утро, ДПС
const DPS = POLICECAR(640, 1180, 320) + BATON(612, 1440);
mount("s6", { bg: "obochina", grade: "dawn", fx: `<div class="fx">${C.fog(1000, 160, "#fff2dc", .35)}</div>`,
  mid: car(MARK, 20, 1420, 560, { z: 4, sheen: .5 }) + DPS + ch("perekup", spk("in", "insp"), 760, 1700, 770, INSP, { armL: 30 }, { rim: "#ffe2a0", side: -1 })
    + ch("perekup", spk("kg", "kostya"), 330, 1750, 740, KOSTYA, {}, { rim: "#ffe2a0", side: -1, z: 7 }),
  lights: glow(820, 820, 360, "#fff0c8", .55),
  bubbles: [{ id: "i1", p: "in", html: "Инспектор Соколов.<br><em>Номера казанские — а вы?</em>", fs: 40 }, { id: "k5", p: "kg", html: "Купил вчера.<br><em>Договор, ОСАГО — всё здесь.</em>", fs: 40 },
    { id: "i2", p: "in", html: "Всё верно.<br><em>А взяли за сколько?</em>", fs: 42 }, { id: "k6", p: "kg", html: "Семьсот девяносто.", fs: 46 }] }, { x: 540, y: 1200, s: 1.08 });
mount("s6z", { bg: "obochina", grade: "dawn",
  mid: DPS + ch("perekup", spk("iz", "insp"), 760, 1700, 770, { ...INSP, look: "o" }, { armL: 30 }, { rim: "#ffe2a0", side: -1 }),
  lights: glow(820, 820, 360, "#fff0c8", .5),
  bubbles: [{ id: "i3", p: "iz", html: "Я свой за девятьсот брал!<br><em>Где нашёл?</em>", fs: 48 }] }, { x: 760, y: 1140, s: 2.1, r: 3 });
// 7. итог: Костя показывает бот, инспектор заглядывает → карточка
{ const H = HP("kh", "kostya", BOTCARD48(), KOSTYA, 430, { rim: "#ffe2a0", side: -1 });
  mount("s7", { bg: "obochina", grade: "dawn", farBlur: 8, mid: H.mid + ch("perekup", spk("ip", "insp"), 900, 2300, 1500, { ...INSP, look: "o" }, { head: -14 }, { rim: "#ffe2a0", side: -1, z: 4 }),
    lights: H.lights + glow(820, 820, 360, "#fff0c8", .4) }, { x: 540, y: 960, s: 1 }); }
mount("s7b", { bg: "obochina", grade: "dawn", over: CTA48.replace('<div style="position:absolute;', '<div id="cta" style="opacity:0;position:absolute;'),
  mid: car(MARK, 20, 1420, 560, { z: 4, sheen: .6 }) + POLICECAR(640, 1180, 320) + ch("perekup", spk("iq", "insp"), 760, 1700, 770, { ...INSP, look: "grin", item: "phone" }, {}, { rim: "#ffe2a0", side: -1 })
    + ch("perekup", spk("ki", "kostya"), 330, 1750, 740, KOSTYA, {}, { rim: "#ffe2a0", side: -1, z: 7 }), lights: glow(820, 820, 360, "#fff0c8", .55) }, { x: 540, y: 1200, s: 1.08 });

$(".stage").insertAdjacentHTML("beforeend", `<div id="clk">🕒 <span id="clt">22:03</span></div>`);
$("#end h2").innerHTML = E.end;

window.build = R => {
  const tl = R.tl;
  const { pop } = common(R, { shake: 0 });
  for (const el of Object.values(SC)) {
    el.snow = [...el.querySelectorAll(".snowfx i")].map((i, j) => ({ i, x0: parseFloat(i.style.left), y0: parseFloat(i.style.top), a: R.hash(j, 11) * 2 * Math.PI, ph: R.hash(j, 12) }));
    el.sheens = [...el.querySelectorAll(".sheen")];
    el.glows = [...el.querySelectorAll(".lights .glow")].map(g => ({ g, o: +g.style.opacity }));
    el.fogs = [...el.querySelectorAll(".fog")];
    el.streaks = [...el.querySelectorAll(".win i")];
  }
  const talk = (lv, f) => lv > .28 && !(lv < .55 && f % 3 === 2);
  const MOOD = { dm: "flat", kd: "flat", kf: "o", iz: "o", ip: "o" };
  R.hooks.push(t => {
    const f = Math.floor(t * 30);
    for (const [n, el] of Object.entries(SC)) {
      if (!(+el.style.opacity > 0)) continue;
      const k = el.cam.s > 1.6 ? .55 : 1;
      C.apply(el, [(R.noise(t * .6) * 9 + R.noise(t * 1.7 + 40) * 3) * k, (R.noise(t * .5 + 9) * 10 + R.noise(t * 1.9 + 70) * 3) * k, R.noise(t * .4 + 20) * .3 * k]);
      if (n === "s4") el.snow.forEach(({ i, a, ph }) => {        // метель из-за руля: хлопья летят из точки схода на камеру
        const q = ((t * .55 + ph) % 1), r = q * q * 1300; i.style.left = (540 + Math.cos(a) * r).toFixed(0) + "px"; i.style.top = (900 + Math.sin(a) * r * 1.15).toFixed(0) + "px";
        i.style.transform = `scale(${(.4 + q * 2.2).toFixed(2)})`; });
      else el.snow.forEach(({ i, x0, y0 }, j) => { const dy = ((y0 + 40 + t * (160 + (j % 5) * 30)) % 2000) - 40 - y0; i.style.transform = `translate(${(Math.sin(t * .8 + j) * 30 - dy * .25).toFixed(1)}px,${dy.toFixed(1)}px)`; });
      el.sheens.forEach((s, j) => { s.style.backgroundPosition = `${(130 - ((t * 14 + j * 45) % 160)).toFixed(1)}% 0`; });
      el.glows.forEach(({ g, o }, j) => { g.style.opacity = (o * (.9 + .1 * R.noise(t * 2.5 + j * 3.1))).toFixed(3); });
      el.fogs.forEach((g, j) => { g.style.translate = `${(Math.sin(t * .25 + j * 2) * 80).toFixed(1)}px 0`; });
      el.streaks.forEach(i => { const x = 320 - (((t * +i.dataset.sp + +i.dataset.ph) % 1) * 700); i.style.left = x.toFixed(0) + "px"; });
    }
    for (const [p, v] of Object.entries(SPK)) {
      if (!document.getElementById(p)) continue;
      const lv = (LIP[v] || [])[f] || 0;
      mouth(p, talk(lv, f) ? "talk" : (MOOD[p] || "grin"));
    }
  });
  window.MUSIC = { style: "bed", bpm: 90, end: R.dur - 1.2 };   // фоновой музыки нет (MUSIC_VOL=0, владелец 12.11)

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
  const clock = (txt, at, color) => { tl.set("#clt", { textContent: txt }, at); if (color) tl.set("#clk", { color, borderColor: color }, at);
    tl.fromTo("#clk", { scale: 1.3 }, { scale: 1, duration: .35, ease: "back.out(2)", immediateRender: false }, at); R.sfx("tick", at, .7); };
  const ids = E.lines.map(l => l.id), nxt = l => ids[ids.indexOf(l) + 1];
  const bub = (l, until) => pop("#b_" + l, st[l] - .05, until ?? Math.min(en[l] + .8, nxt(l) ? st[nxt(l)] - .1 : en[l] + 1));

  // 1. хук: бот в руке → автобус
  show("s1p", 0); tl.to("#title", { opacity: 0, y: -50, duration: .25 }, 1.8);
  tl.to("#clk", { opacity: 1, duration: .3 }, 2.0);
  tl.fromTo("#n1", { opacity: 0, y: -50 }, { opacity: 1, y: 0, duration: .3, ease: "back.out(1.8)", immediateRender: false }, .3); R.sfx("ping", .3, .9);
  move("s1p", { s: 1.08, y: 1000 }, 0, en.l0, "none");
  cut("s1p", "s1", st.k1 - .1); clock("23:40", st.k1 - .1);
  move("s1", { x: 470, s: 1.16 }, st.k1 - .1, 3, "power1.inOut");
  bub("k1", st.d1 - .45);
  // 2. Казань
  const SW2 = st.d1 - .4; swap("s1", "s2", SW2); tl.to("#clk", { opacity: 0, duration: .2 }, SW2);
  move("s2", { x: 480, s: 1.2 }, SW2, en.d1 - SW2 + .3, "none");
  bub("d1", st.k2 - .15);
  cut("s2", "s2p", st.k2 - .1); move("s2p", { s: 1.08, y: 1010 }, st.k2 - .1, en.k2 - st.k2 + .3, "none");
  gsap.set("#circ path", { attr: { pathLength: 1 }, strokeDasharray: 1, strokeDashoffset: 1 }); gsap.set("#vot", { opacity: 0 });
  tl.to("#circ path", { strokeDashoffset: 0, duration: .6, ease: "power2.inOut" }, W("k2", "790") - .1); R.sfx("swish", W("k2", "790") - .1, .6);
  tl.to("#vot", { opacity: 1, duration: .2 }, W("k2", "вот")); bub("k2", st.d2 - .15);
  // 3. Денис сдаётся → договор на капоте
  cut("s2p", "s3", st.d2 - .1); move("s3", { s: 2.0, r: -2 }, st.d2 - .1, en.d2 - st.d2 + .4, "none"); R.sfx("clack", st.d2 + .6, .5);
  bub("d2", st.l1 - .15);
  cut("s3", "s3h", st.l1 - .1); move("s3h", { s: 1.08, y: 1000 }, st.l1 - .1, en.l1 - st.l1 + .4, "none");
  [W("l1", "договор"), W("l1", "осаго"), W("l1", "регистрац")].forEach((at, k) => write("#ck" + k, at, .55));
  // 4. метель
  const SW4 = st.l2 - .4; swap("s3h", "s4", SW4); clock("03:00", SW4 + .3); tl.to("#clk", { opacity: 1, duration: .2 }, SW4 + .3);
  move("s4", { s: 1.06 }, SW4, en.l2 - SW4 + .3, "none");
  tl.fromTo("#fura", { scale: .5, transformOrigin: "540px 890px", opacity: .5 }, { scale: 1.6, opacity: 1, duration: en.l2 - SW4 + .2, ease: "power2.in", immediateRender: false }, SW4);
  cut("s4", "s4k", st.k3 - .1); move("s4k", { s: 1.22 }, st.k3 - .1, en.k3 - st.k3 + .3, "none");
  const FU = W("k3", "фура"); tl.fromTo("#glare", { opacity: .3 }, { opacity: 1, duration: .25, immediateRender: false }, FU - .2); R.flash(FU, .7, .35);
  bub("k3", st.y1 - .45);
  // 5. кафе
  const SW5 = st.y1 - .4; swap("s4k", "s5", SW5); clock("03:40", SW5 + .3);
  move("s5", { x: 500, s: 1.12 }, SW5, en.y1 - SW5, "none");
  bub("y1", st.k4 - .15);
  cut("s5", "s5b", st.k4 - .1); move("s5b", { x: 790, s: 1.65 }, st.k4 - .1, en.k4 - st.k4 + .3, "none");
  bub("k4", st.y2 - .15);
  cut("s5b", "s5", st.y2 - .1); tl.set(cam("s5"), { x: 560, y: 1080, s: 1.1 }, st.y2 - .1); bub("y2", st.i1 - .45);
  // 6. ДПС
  const SW6 = st.i1 - .4; swap("s5", "s6", SW6); clock("08:10", SW6 + .3, "#ff7a1a");
  move("s6", { x: 560, s: 1.14 }, SW6, en.k6 - SW6, "none");
  ["i1", "k5", "i2", "k6"].forEach(l => bub(l));
  cut("s6", "s6z", st.i3 - .1); R.punch(cam("s6z"), st.i3, .07); bub("i3", st.end - .45);
  // 7. итог
  const SW7 = st.end - .4; swap("s6z", "s7", SW7); tl.to("#clk", { opacity: 0, duration: .2 }, SW7);
  move("s7", { s: 1.07, y: 990 }, SW7, 3, "none");
  const C7 = W("end", "а") - .2; cut("s7", "s7b", C7); move("s7b", { s: 1.14, y: 1160 }, C7, en.end - C7 + 1, "none");
  tl.fromTo("#cta", { opacity: 0, y: 80, scale: .9 }, { opacity: 1, y: 0, scale: 1, duration: .4, ease: "back.out(1.6)", immediateRender: false }, W("end", "ловит") - .2);
  ending(R, en.end + .3);
};
