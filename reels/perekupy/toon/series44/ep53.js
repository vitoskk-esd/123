// «ОГРАБЛЕНИЕ ВЕКА» (ep53, «Простой ролик 3», киношный формат ../cine.js). Сцены — как в утверждённой раскадровке board.html.
// Банда (Гена — мозг, Валера — водила, Костик — технарь) планирует «увести» Lexus NX за 1,9 млн при рынке 2,6: карточки ролей на стоп-кадре →
// гаджеты → часы 07:59:58 → 08:00 → на сайте объявление только в 08:00:31 → погоня по карте дворами → 08:06 → у Лексуса уже дед Фёдор с ключами
// («бот прислал через секунду, я тут с 08:01») → стоп-кадр «ПЛАН ПРОВАЛЕН» → «План Б: поставить бот». Последний кадр — только карточка бота. Без музыки.
$("#title .a").textContent = E.rubric; $("#title .b").textContent = E.subtitle; $("#tag span").textContent = "ограбление века";
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
const P = (p, v, o, x, foot, h, pose = {}, extra = {}) => (SPK[p] = v, ch("perekup", p, x, foot, h, o, pose, extra));
const LAIR_L = glow(540, 172, 320, "#fff6c8", .6) + beam([[490, 176], [590, 176], [960, 1300], [120, 1300]], "#fff6c8", .2) + glow(540, 1500, 520, "#fff6c8", .25);
const CREW3 = (g, v, k, go = {}, vo = {}, ko = {}) => P(g, "gena", { ...GENA, ...go }, 540, 1720, 760, {}, { rim: "#fff6c8", side: 1, z: 7 })
  + P(v, "valera", { ...VALERA, ...vo }, 180, 1780, 760, {}, { rim: "#fff6c8", side: 1, z: 8 }) + P(k, "kostik", { ...KOSTIK, ...ko }, 900, 1790, 740, {}, { rim: "#fff6c8", side: -1, z: 8 });
const SITE = () => `<div style="font-family:Onest;color:#fff"><div style="font-weight:800;font-size:34px;color:#8b93a3">авто-сайт · Lexus NX</div>
  <div id="refresh" style="display:inline-block;margin-top:20px;font-family:'JetBrains Mono';font-weight:800;font-size:40px;color:#151515;background:#ffd23f;border-radius:14px;padding:6px 18px">⟳ обновить</div>
  <div style="margin-top:24px;background:#1c1f26;border-radius:20px;padding:20px;font-size:30px;color:#8b93a3">Новых объявлений нет<br><span style="font-size:24px">обновление — раз в минуту</span></div></div>`;
const DVOR_L = glow(880, 200, 360, "#fff3c4", .45);

// 1. логово: стоп-кадр с карточками ролей → доска → Гена
mount("s1", { bg: "logovo", grade: "warm", freeze: 1,
  over: ROLE("ГЕНА", "мозг", 360, 760, -3, "rG") + ROLE("ВАЛЕРА", "водила", 30, 1060, 4, "rV") + ROLE("КОСТИК", "технарь", 640, 1080, -5, "rK"),
  mid: CREW3("g1", "v1", "k1"), lights: LAIR_L }, { x: 540, y: 1200, s: 1.04 });
mount("s1c", { bg: "logovo", grade: "warm", mid: CREW3("g1c", "v1c", "k1c"), lights: LAIR_L }, { x: 540, y: 600, s: 1.7 });
mount("s1b", { bg: "logovo", grade: "warm", mid: P("g2", "gena", GENA, 760, 1700, 760, { armL: 120 }, { rim: "#fff6c8", side: -1, z: 7 }), lights: LAIR_L,
  bubbles: [{ id: "g1", p: "g2", html: "Объявление выйдет в 08:00.<br><em>Мы будем там в 08:07.</em>", fs: 42 }] }, { x: 560, y: 900, s: 1.5 });
// 2. гаджеты: Костик и сайт → Валера и W124
{ const H = HOLDPHONE("perekup", "k2", 540, 1960, 1680, KOSTIK, SITE(), { rim: "#fff6c8", side: 1 }); SPK.k2 = "kostik";
  mount("s2", { bg: "logovo", grade: "warm", farBlur: 9, mid: H.mid, lights: H.lights,
    bubbles: [{ id: "k1", p: "k2", html: "Обновляю сайт каждую секунду.<br><em>Палец не устанет.</em>", fs: 38 }] }, { x: 540, y: 960, s: 1 }); }
mount("s2b", { bg: "logovo", grade: "warm",
  mid: car(CREW, 60, 1640, 760, { z: 4, sheen: .5 }) + P("v2", "valera", VALERA, 860, 1770, 760, { armR: -60 }, { rim: "#fff6c8", side: -1, z: 7 }) + G("keys2", INHAND(860, 1770, 760, -60, 90, KEYS, 9), 9), lights: LAIR_L,
  bubbles: [{ id: "v1", p: "v2", html: "Я знаю все дворы.<br><em>Ни одного светофора.</em>", fs: 42 }] }, { x: 560, y: 1220, s: 1.08 });
// 3. часы-отсчёт → «Вышло!»
mount("s3", { bg: "logovo", grade: "warm", over: CLOCK("07:59:58"), mid: CREW3("g3", "v3", "k3", { look: "o" }, { look: "flat" }, { look: "o" }), lights: LAIR_L }, { x: 540, y: 1260, s: 1.08 });
mount("s3b", { bg: "logovo", grade: "warm", over: CLOCK("08:00:31", "clk2", "#4cd964"),
  mid: P("k3b", "kostik", { ...KOSTIK, look: "o" }, 540, 1760, 780, { armL: 150, armR: -150 }, { rim: "#fff6c8", side: 1, z: 7 }), lights: LAIR_L,
  bubbles: [{ id: "k2", p: "k3b", html: "ВЫШЛО!<br><em>Погнали!!</em>", fs: 60 }] }, { x: 540, y: 1100, s: 1.3, r: -4 });
// 4. погоня: карта → проспект
mount("s4", { grade: "day", far: MAP(), farBlur: 0,
  over: `<div class="hand wr" id="h1" style="left:120px;top:1480px;z-index:60;font-size:64px;color:#c0392b;transform:rotate(-6deg)">дворами!</div><div class="hand wr" id="h2" style="left:520px;top:900px;z-index:60;font-size:56px;color:#2f6db5;transform:rotate(-4deg)">через стройку</div>`
    + CLOCK("08:01", "clk3", "#ffd23f").replace("top:620px", "top:1660px").replace("font-size:150px", "font-size:90px")
    + `<div id="dot" style="position:absolute;left:126px;top:1626px;width:48px;height:48px;border-radius:50%;background:#2f6db5;border:6px solid #fff;box-shadow:0 0 0 5px #151515;z-index:61"></div>` }, { x: 540, y: 960, s: 1 });
mount("s4b", { bg: "gorodutro", grade: "dawn", farBlur: 6,
  mid: SPEED(1250, 1560) + G("crew4", car(CREWS, 160, 1560, 820, { z: 5, sheen: .7 }), 5), lights: glow(820, 760, 360, "#fff2c0", .5),
  over: `<div id="radio" style="position:absolute;left:80px;top:700px;z-index:60;background:#0d0e12;border:6px solid #fff;border-radius:34px;padding:22px 30px;font-family:Unbounded;font-weight:800;font-size:44px;color:#fff;opacity:0">ВАЛЕРА (по рации):<br><em style="font-style:normal;color:#ff3b30">08:06 — рекорд района!</em></div>` }, { x: 540, y: 1300, s: 1.12 });
// 5. двор: дед Фёдор → стоп-кадр «ПЛАН ПРОВАЛЕН»
const DVOR = (d, g, v, gl, extra = "") => car(TARGET, 80, 1600, 640, { z: 4, sheen: .6 }) + P(d, "ded", DED, 470, 1720, 720, { armR: -70 }, { rim: "#fff2c0", side: -1, z: 6 }) + INHAND(470, 1720, 720, -70, 100, KEYS, 9)
  + P(g, "gena", { ...GENA, look: gl }, 900, 1790, 760, {}, { rim: "#fff2c0", side: -1, z: 7 }) + (v ? P(v, "valera", { ...VALERA, look: "o" }, 1060, 1800, 760, {}, { z: 7 }) : "") + extra;
mount("s5", { bg: "dvorutro", grade: "day", mid: DVOR("dd", "g5", null, "o"), lights: DVOR_L,
  bubbles: [{ id: "g2", p: "g5", html: "Как?!", fs: 64 }, { id: "d1", p: "dd", html: "Внучки, мне бот прислал объявление<br><em>через секунду. Я тут с 08:01.</em>", fs: 36 }] }, { x: 560, y: 1200, s: 1.08 });
mount("s5b", { bg: "dvorutro", grade: "day", freeze: 1,
  over: STAMP("ПЛАН<br>ПРОВАЛЕН", 120, 520) + `<div class="hand wr" id="h3" style="left:70px;top:960px;z-index:64;font-size:66px;color:#ffd23f;-webkit-text-stroke:3px #151515;transform:rotate(-4deg)">сайт: 1 раз в минуту<br>бот: через 1 секунду</div>`,
  mid: DVOR("dd2", "g6", "v6", "o"), lights: "" }, { x: 560, y: 1200, s: 1.08 });
// 6. план Б → финальная карточка
mount("s6", { bg: "logovo", grade: "warm",
  over: `<svg viewBox="0 0 1080 1920" style="position:absolute;left:0;top:0;width:1080px;height:1920px;z-index:59"><path id="x1" d="M130 160 L950 690" stroke="#ff3b30" stroke-width="16" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/><path id="x2" d="M950 160 L130 690" stroke="#ff3b30" stroke-width="16" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/></svg>
    <div class="hand wr" id="planb" style="left:430px;top:470px;z-index:60;font-size:72px;color:#ffd23f;-webkit-text-stroke:3px #151515;transform:rotate(-4deg)">ПЛАН Б:<br>1. поставить бот</div>`,
  mid: P("g7", "gena", GENA, 860, 1760, 760, { armL: 120 }, { rim: "#fff6c8", side: -1, z: 7 }), lights: LAIR_L,
  bubbles: [{ id: "g3", p: "g7", html: "Новый план.<br><em>Пункт первый — поставить бот.</em>", fs: 42 }] }, { x: 540, y: 1060, s: 1.12 });
mount("s6b", { bg: "logovo", grade: "warm", over: CTA53.replace('<div style="position:absolute;', '<div id="cta" style="opacity:0;position:absolute;'),
  mid: CREW3("g8", "v8", "k8"), lights: LAIR_L }, { x: 540, y: 1200, s: 1.04 });

$("#end h2").innerHTML = E.end;

window.build = R => {
  const tl = R.tl;
  const { pop } = common(R, { shake: 0 });
  for (const el of Object.values(SC)) {
    el.sheens = [...el.querySelectorAll(".sheen")];
    el.glows = [...el.querySelectorAll(".lights .glow")].map(g => ({ g, o: +g.style.opacity }));
    el.spd = [...el.querySelectorAll(".spd")].map(s => ({ s, x0: parseFloat(s.style.left) }));
  }
  const talk = (lv, f) => lv > .28 && !(lv < .55 && f % 3 === 2);
  const MOOD = { g3: "o", k3: "o", k3b: "o", g5: "o", g6: "o", v6: "o", v3: "flat" };
  R.hooks.push(t => {
    const f = Math.floor(t * 30);
    for (const el of Object.values(SC)) {
      if (!(+el.style.opacity > 0)) continue;
      const k = el.cam.s > 1.6 ? .55 : 1;
      C.apply(el, [(R.noise(t * .6) * 9 + R.noise(t * 1.7 + 40) * 3) * k, (R.noise(t * .5 + 9) * 10 + R.noise(t * 1.9 + 70) * 3) * k, R.noise(t * .4 + 20) * .3 * k]);
      el.sheens.forEach((s, j) => { s.style.backgroundPosition = `${(130 - ((t * 14 + j * 45) % 160)).toFixed(1)}% 0`; });
      el.glows.forEach(({ g, o }, j) => { g.style.opacity = (o * (.88 + .12 * R.noise(t * 2.5 + j * 3.1))).toFixed(3); });
      el.spd.forEach(({ s, x0 }, j) => { s.style.left = (((x0 + 200 - t * 2600 - j * 90) % 1400 + 1400) % 1400 - 300).toFixed(0) + "px"; });
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
  const slam = (sel, at, sfx = "impact", from = 1.8) => { tl.fromTo(sel, { opacity: 0, scale: from }, { opacity: 1, scale: 1, duration: .18, ease: "power4.out", immediateRender: false }, at); R.sfx(sfx, at + .02, .7); };
  const ids = E.lines.map(l => l.id), nxt = l => ids[ids.indexOf(l) + 1];
  const bub = (l, until) => pop("#b_" + l, st[l] - .05, until ?? Math.min(en[l] + .8, nxt(l) ? st[nxt(l)] - .1 : en[l] + 1));

  // 1. банда: карточки ролей шлёпаются на стоп-кадре → доска → Гена
  show("s1", 0); tl.to("#title", { opacity: 0, y: -50, duration: .25 }, 1.8);
  gsap.set(["#rG", "#rV", "#rK"], { opacity: 0 });
  slam("#rG", Math.max(2.0, W("l0", "ген") - .05)); slam("#rV", W("l0", "вал") - .05); slam("#rK", W("l0", "кост") - .05);
  move("s1", { s: 1.1 }, 0, en.l0 + .3, "none");
  cut("s1", "s1c", st.l0b - .1); move("s1c", { s: 1.95, y: 620 }, st.l0b - .1, en.l0b - st.l0b + .3, "none");
  const SW1 = st.g1 - .4; swap("s1c", "s1b", SW1); move("s1b", { s: 1.6, y: 880 }, SW1, en.g1 - SW1 + .3, "none"); bub("g1", st.k1 - .45);
  // 2. гаджеты
  const SW2 = st.k1 - .4; swap("s1b", "s2", SW2); move("s2", { s: 1.07, y: 1000 }, SW2, en.k1 - SW2, "none"); bub("k1", st.v1 - .15);
  for (let t = st.k1 + .2; t < en.k1; t += .45) { tl.fromTo("#refresh", { scale: .85 }, { scale: 1, duration: .2, ease: "back.out(3)", immediateRender: false }, t); R.sfx("tap", t, .35); }
  cut("s2", "s2b", st.v1 - .1); move("s2b", { x: 600, s: 1.16 }, st.v1 - .1, en.v1 - st.v1 + .3, "none"); bub("v1", st.l1 - .45);
  tl.fromTo("#keys2", { rotation: -8 }, { rotation: 8, duration: .2, yoyo: true, repeat: 5, ease: "sine.inOut", transformOrigin: "860px 1500px", immediateRender: false }, st.v1); R.sfx("clack", st.v1 + .1, .4);
  // 3. часы: 07:59:58 → 07:59:59 → 08:00:00 → (сайт молчит) → 08:00:31 «Вышло!»
  const SW3 = st.l1 - .4; swap("s2b", "s3", SW3); move("s3", { s: 1.18 }, SW3, en.l1 - SW3 + .3, "none");
  const T0 = W("l1", "сем"), T1 = W("l1", "тиш");
  tl.set("#clk", { textContent: "07:59:59" }, (T0 + T1) / 2); R.sfx("tick", (T0 + T1) / 2, .7);
  tl.set("#clk", { textContent: "08:00:00" }, T1); R.sfx("tick", T1, .8); tl.fromTo("#clk", { scale: 1.12 }, { scale: 1, duration: .3, immediateRender: false }, T1);
  cut("s3", "s3b", st.k2 - .1); R.shake(cam("s3b"), st.k2, 1, .4); R.sfx("ping", st.k2, .8); move("s3b", { s: 1.4 }, st.k2 - .1, en.k2 - st.k2 + .4, "none"); bub("k2", st.l2 - .1);
  // 4. погоня: маршрут рисуется, точка бежит, часы идут → проспект
  const SW4 = st.l2 - .4; swap("s3b", "s4", SW4);
  const route = document.getElementById("route"), Lr = route.getTotalLength(); gsap.set(route, { strokeDasharray: `${Lr} ${Lr}`, strokeDashoffset: Lr });
  const D4 = en.l2 - st.l2 + .3;
  tl.to(route, { strokeDashoffset: 0, duration: D4, ease: "none" }, st.l2);
  const pts = [[150, 1650], [150, 1370], [410, 1370], [410, 1070], [670, 1070], [670, 770], [930, 770], [930, 470]];
  pts.slice(1).forEach(([x, y], k) => tl.to("#dot", { left: x - 24, top: y - 24, duration: D4 / 7, ease: "none" }, st.l2 + k * D4 / 7));
  [["08:02", .25], ["08:04", .5], ["08:05", .75]].forEach(([tx, f]) => { tl.set("#clk3", { textContent: tx }, st.l2 + D4 * f); R.sfx("tick", st.l2 + D4 * f, .4); });
  write("#h1", W("l2", "двор") - .1, .5); write("#h2", W("l2", "строй") - .1, .5);
  cut("s4", "s4b", st.v2 - .3); R.sfx("whoosh", st.v2 - .3, .8);
  tl.fromTo("#crew4", { x: -900 }, { x: 0, duration: .5, ease: "power3.out", immediateRender: false }, st.v2 - .3);
  tl.fromTo("#radio", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: .25, ease: "back.out(2)", immediateRender: false }, st.v2 - .05); R.sfx("bleep", st.v2 - .05, .5);
  move("s4b", { s: 1.18 }, st.v2 - .3, en.v2 - st.v2 + .6, "none");
  // 5. двор: «Как?!» → дед → стоп-кадр
  const SW5 = st.g2 - .45; swap("s4b", "s5", SW5); move("s5", { x: 600, s: 1.14 }, SW5, en.d1 - SW5 + .3, "none");
  bub("g2", st.d1 - .1); bub("d1", st.l3 - .15);
  cut("s5", "s5b", st.l3 - .1); R.sfx("hit", st.l3 - .1, .8);
  gsap.set("#stamp", { opacity: 0 }); slam("#stamp", st.l3 + .05, "impact", 2.4);
  write("#h3", W("l3", "бот") - .2, .8);
  move("s5b", { s: 1.12 }, st.l3 - .1, en.l3 - st.l3 + .4, "none");
  // 6. план Б → карточка бота (последний кадр — только бот)
  const SW6 = st.g3 - .4; swap("s5b", "s6", SW6); move("s6", { s: 1.16 }, SW6, en.g3 - SW6 + .3, "none");
  tl.to("#x1", { strokeDashoffset: 0, duration: .3, ease: "power2.in" }, SW6 + .5).to("#x2", { strokeDashoffset: 0, duration: .3, ease: "power2.in" }, SW6 + .85); R.sfx("swish", SW6 + .5, .6); R.sfx("swish", SW6 + .85, .6);
  write("#planb", W("g3", "пункт") - .1, .9); bub("g3", st.end - .15);
  cut("s6", "s6b", st.end - .1); move("s6b", { s: 1.1 }, st.end - .1, en.end - st.end + .6, "none");
  tl.fromTo("#cta", { opacity: 0, y: 80, scale: .9 }, { opacity: 1, y: 0, scale: 1, duration: .4, ease: "back.out(1.6)", immediateRender: false }, st.end + .3);
  ending(R, en.end + .3);
};
