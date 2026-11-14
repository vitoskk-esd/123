// «РЫБАЛКА: КЛЮЁТ ТОЛЬКО У СТАСА» (ep61, киношный формат ../cine.js, отдельный ролик). Сцены — как в утверждённой раскадровке board.html.
// ОБЛОЖКА (кадр 0): Жора с удочкой у лунки, за ним Нива + плашка «РЫБАЛКА: / КЛЮЁТ ТОЛЬКО У СТАСА» (гаснет к 1,6 с; без телефона — владелец 14.11)
// → теория Жоры → подо льдом: рыбы к «телефону-приманке» → поплавок-уведомление: Прадо −300 тыс. → Жора замерзает (−27) → продавец в 300 м
// → Палыч с соседней лунки → Прадо на базе → «клюёт!» → сапог → Стас едет по льду → «а на что клюёт?» — «на бота» → финальная фраза Лиса + карточка.
$("#title .a").textContent = E.rubric; $("#title .b").textContent = E.subtitle; $("#title .b").style.fontSize = "96px"; $("#tag span").textContent = "рыбалка";
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
const Z = (p, x, foot, h, o = {}, pose = {}, extra = {}) => ch("perekup", spk(p, "zhora"), x, foot, h, { ...ZHORA_W, ...o }, pose, extra);
const ST = (p, x, foot, h, o = {}, pose = {}, extra = {}) => ch("perekup", spk(p, "stas"), x, foot, h, { ...STAS_W, ...o }, pose, extra);
const PL = (p, x, foot, h, o = {}, pose = {}, extra = {}) => ch("perekup", spk(p, "palych"), x, foot, h, { ...PALYCH, ...o }, pose, extra);
const OZ_L = glow(820, 420, 320, "#fff6d0", .4);
const RB_L = glow(355, 835, 200, "#ffd27a", .5) + glow(540, 300, 380, "#fff6d0", .25);
const FISHER = (mk, p, x, foot, h, o = {}, extra = {}, arm = -30, hole = true, rid = "") => { const [hx, hy] = HANDPT(x, foot, h, arm), w = 200 * h / 820, tx = hx - w / 2 + 1.9 * w, ty = hy - w / 2 + 1.5 * w;
  return mk(p, x, foot, h, o, { armR: arm }, extra) + INHAND(x, foot, h, arm, w, ROD, (extra.z || 7) + 1, 0, rid) + (hole ? HOLE(tx + 10, foot + 20 * h / 820, 200 * h / 820) + LINE(tx, ty, tx + 10, foot + 24 * h / 820) : ""); };

// 1. обложка: озеро, Жора с удочкой, Нива, Стас вдали
mount("s1", { bg: "ozero", grade: "day", farBlur: 2, mid: car(NIVA, -40, 1220, 560, { z: 3, sheen: .5 }) + FISHER(Z, "za", 560, 1700, 860, { look: "grin" }, { rim: "#fff6d0", side: 1, z: 7 })
  + ST("sa", 960, 1560, 540, {}, {}, { z: 5 }), lights: OZ_L }, { x: 540, y: 1000, s: 1 });
// 2. теория Жоры
mount("s2", { bg: "ozero", grade: "day", farBlur: 5, mid: FISHER(Z, "zb", 460, 1880, 1000, { look: "grin" }, { rim: "#fff6d0", side: 1, z: 7 }), lights: OZ_L,
  bubbles: [{ id: "z1", p: "zb", html: "Машина — как рыба, студент.<br><em>Её высидеть надо.</em>", fs: 42 }] }, { x: 540, y: 1150, s: 1.08 });
mount("s2b", { bg: "ozero", grade: "day", farBlur: 3, mid: FISHER(Z, "zb2", 330, 1800, 820, { look: "flat" }, { rim: "#fff6d0", side: 1, z: 7 }) + ST("sb0", 860, 1800, 800, { look: "grin" }, {}, { rim: "#fff6d0", side: -1, z: 7 }), lights: OZ_L,
  bubbles: [{ id: "s0", p: "sb0", html: "Жора, ты эту теорию<br><em>с девяносто восьмого высиживаешь.</em>", fs: 38 }] }, { x: 560, y: 1180, s: 1.05 });
// 3. подо льдом
mount("s3", { bg: "podlyod", farBlur: 0, mid: UNDER() }, { x: 540, y: 960, s: 1 });
// 4. поплавок-уведомление
{ const H = HOLDPHONE("perekup", spk("sb", "stas"), 540, 2090, 1680, STAS_W, PRCARD(), { rim: "#fff6d0", side: 1 });
  mount("s4", { bg: "ozero", grade: "day", farBlur: 8, mid: H.mid, lights: H.lights + OZ_L, over: BOBBER(860, 250),
    bubbles: [{ id: "s1", at: [300, 700], html: "О, клюёт! Ленд Крузер —<br><em>на триста ниже рынка.</em>", fs: 42 }] }, { x: 540, y: 960, s: 1 }); }
// 5. Жора замерзает
mount("s5", { bg: "ozero", grade: "day", farBlur: 6, mid: Z("zc", 480, 1900, 1000, { look: "flat" }, {}, { rim: "#d8f0ff", side: 1, z: 7 }) + FROST(480, 1900, 1000), over: THERMO(860, 420, -5), lights: OZ_L,
  bubbles: [{ id: "z2", p: "zc", html: "Терпение, студент…<br><em>Сейчас пойдёт…</em>", fs: 46 }] }, { x: 540, y: 1150, s: 1.08 });
// 6. продавец в 300 м
mount("s6", { bg: "ozero", grade: "day", farBlur: 2, mid: ST("sc", 270, 1880, 900, {}, { phone: 1 }, { rim: "#fff6d0", side: 1, z: 7 }) + FISHER(PL, "pc", 840, 1160, 300, {}, { z: 4 }, -30)
  + `<div id="m300" style="position:absolute;left:760px;top:760px;z-index:9;font-family:Unbounded;font-weight:900;font-size:40px;color:#c0392b;background:#fff;border:5px solid #151515;border-radius:12px;padding:2px 14px;transform:rotate(-4deg)">300 м</div>`, lights: OZ_L,
  bubbles: [{ id: "s2", p: "sc", html: "Погоди… продавец —<br><em>в трёхстах метрах от нас.</em>", fs: 42 }] }, { x: 540, y: 1120, s: 1.05 });
// 7. Палыч на льду
mount("s7", { bg: "ozero", grade: "day", farBlur: 3, mid: FISHER(PL, "pd", 700, 1800, 860, {}, { rim: "#fff6d0", side: -1, z: 7 }, -30) + ST("sd", 230, 1820, 820, {}, { armR: -100 }, { rim: "#fff6d0", side: 1, z: 7 }), lights: OZ_L,
  bubbles: [{ id: "s3", p: "sd", html: "Дед Палыч,<br><em>я по объявлению!</em>", fs: 46 }, { id: "p1", p: "pd", html: "Так ты ж с соседней лунки!<br><em>Внучка научила — сфоткал и в интернет!</em>", fs: 36 }] }, { x: 520, y: 1180, s: 1.06 });
// 8. база: Прадо, ключи
mount("s8", { bg: "rybbaza", grade: "day", mid: car(PRADO, 0, 1640, 660, { z: 4, sheen: .5 }) + ST("se", 600, 1800, 800, {}, { armR: -60 }, { rim: "#ffd27a", side: 1, z: 7 }) + PL("pe", 900, 1780, 800, {}, { armL: 40 }, { rim: "#ffd27a", side: -1, z: 7 }), lights: RB_L,
  bubbles: [{ id: "s4", p: "se", html: "Беру<br><em>без торга.</em>", fs: 50 }] }, { x: 540, y: 1200, s: 1.05 });
// 9. «клюёт!» — подсечка
mount("s9", { bg: "ozero", grade: "day", farBlur: 3, mid: Z("zf", 460, 1820, 900, { look: "o" }, { armR: -150 }, { rim: "#fff6d0", side: 1, z: 7 }) + INHAND(460, 1820, 900, -150, 240, ROD, 8, -95, "rodf") + HOLE(700, 1850, 230) + SPLASH(700, 1840), lights: OZ_L,
  bubbles: [{ id: "z3", p: "zf", html: "Клюёт!<br><em>Клюёт!!</em>", fs: 58 }] }, { x: 540, y: 1180, s: 1.05 });
// 10. сапог; за спиной по льду едет Прадо
mount("s10", { bg: "ozero", grade: "day", farBlur: 2, mid: G("pdrv", car(PRADO_S, 640, 1150, 360, { z: 2, sheen: .5 }), 2) + Z("zg", 440, 1880, 960, { look: "o" }, { armR: -70 }, { rim: "#fff6d0", side: 1, z: 7 }) + INHAND(440, 1880, 960, -70, 230, BOOT, 9, 0, "boot"), lights: OZ_L,
  bubbles: [{ id: "z4", p: "zg", html: "Сапог.<br><em>Сорок пятого размера.</em>", fs: 50 }, { id: "z4b", p: "zg", html: "Ну хоть что-то<br><em>клюнуло.</em>", fs: 50 }] }, { x: 540, y: 1150, s: 1.06 });
// 11. «а на что клюёт?» — «на бота»
mount("s11", { bg: "rybbaza", grade: "day", mid: car(PRADO, 380, 1600, 640, { z: 4, sheen: .5 }) + Z("zh", 250, 1820, 860, { look: "o" }, { armR: -70 }, { rim: "#ffd27a", side: 1, z: 7 }) + INHAND(250, 1820, 860, -70, 200, BOOT, 9)
  + ST("sh", 860, 1800, 820, {}, { armL: 30 }, { rim: "#ffd27a", side: -1, z: 7 }), lights: RB_L,
  bubbles: [{ id: "z5", p: "zh", html: "Стас…<br><em>а у тебя на что клюёт?</em>", fs: 46 }, { id: "s5", p: "sh", html: "На бота, Жора.<br><em>На бота.</em>", fs: 48 }] }, { x: 540, y: 1180, s: 1.05 });
// 12. карточка бота
mount("s12", { bg: "rybbaza", grade: "day", over: CTA61.replace('<div style="position:absolute;', '<div id="cta" style="opacity:0;position:absolute;'), lights: RB_L }, { x: 540, y: 1000, s: .98 });

$("#end h2").innerHTML = E.end;

window.build = R => {
  const tl = R.tl;
  const { pop } = common(R, { shake: 0 });
  for (const el of Object.values(SC)) {
    el.sheens = [...el.querySelectorAll(".sheen")];
    el.glows = [...el.querySelectorAll(".lights .glow")].map(g => ({ g, o: +g.style.opacity }));
  }
  const talk = (lv, f) => lv > .28 && !(lv < .55 && f % 3 === 2);
  const MOOD = { zb2: "flat", zc: "flat", zf: "o", zg: "o", zh: "o" };
  // термометр: −5° → −27° за реплику Лиса «минус двадцать семь»
  const D0 = st.z2, D1 = W("l2", "жора"), th = document.getElementById("thermoc"), tt = document.getElementById("thermot");
  const setD = d => { th.setAttribute("y", 120 + (30 + d) * 4); th.setAttribute("height", 240 - (30 + d) * 4); tt.textContent = d + "°"; };
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
    setD(Math.round(-5 - 22 * Math.min(1, Math.max(0, (t - D0) / (D1 - D0)))));
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
  const ping = (sel, at, snd = "clack") => { gsap.set(sel, { opacity: 0 }); tl.fromTo(sel, { opacity: 0, scale: 1.7 }, { opacity: 1, scale: 1, duration: .2, ease: "back.out(2)", immediateRender: false }, at); R.sfx(snd, at, .6); };

  // 1. обложка: плашка видна с первого кадра и гаснет к 1,6 с
  gsap.set(SC.s1, { opacity: 1 }); SC.s1.style.display = "";
  gsap.set("#cnt", { opacity: 0 });
  show("s1", 0); tl.to("#title", { opacity: 0, y: -50, duration: .25 }, 1.6);
  move("s1", { s: 1.08, y: 1060 }, 0, en.l0 + .3, "none");
  // 2. теория Жоры → Стас подкалывает
  cut("s1", "s2", st.z1 - .2); move("s2", { s: 1.16 }, st.z1 - .2, en.z1 - st.z1 + .4, "none"); bub("z1", st.s0 - .1);
  cut("s2", "s2b", st.s0 - .1); move("s2b", { s: 1.1 }, st.s0 - .1, en.s0 - st.s0 + .4, "none"); bub("s0", st.l1 - .3);
  // 3. подо льдом: рыбы уплывают от мотыля и толпятся у «приманки»
  const SW3 = st.l1 - .3; swap("s2b", "s3", SW3); move("s3", { s: 1.06 }, SW3, en.l1 - SW3 + .4, "none"); R.sfx("drop", SW3 + .3, .5);
  const DUR3 = en.l1 - SW3 + .4;
  tl.to("#fz1", { left: "-=420", duration: DUR3, ease: "none" }, SW3).to("#fz2", { left: "-=380", duration: DUR3, ease: "none" }, SW3);
  [["#fs1", 150], ["#fs3", 160], ["#fs5", 120], ["#fs2", -110], ["#fs4", -90]].forEach(([s, dx]) => tl.to(s, { left: `+=${dx}`, duration: DUR3, ease: "power1.out" }, SW3));
  tl.fromTo("#lure", { scale: 1 }, { scale: 1.08, duration: .3, yoyo: true, repeat: 7, ease: "sine.inOut", immediateRender: false }, SW3);
  // 4. поплавок-уведомление
  const SW4 = st.s1 - .3; swap("s3", "s4", SW4); move("s4", { s: 1.06, y: 1000 }, SW4, en.s1 - SW4 + .4, "none");
  gsap.set("#pcc", { opacity: 0 }); const BIT = W("s1", "клю");
  tl.fromTo("#bob", { y: 0 }, { y: 60, duration: .14, yoyo: true, repeat: 3, ease: "power2.inOut", immediateRender: false }, BIT - .25); R.sfx("drop", BIT - .25, .9);
  tl.fromTo("#bob .wave", { scale: .5, opacity: 1 }, { scale: 1.6, opacity: 0, duration: .8, ease: "power2.out", immediateRender: false }, BIT - .2);
  tl.fromTo("#pcc", { opacity: 0, y: -50 }, { opacity: 1, y: 0, duration: .3, ease: "back.out(1.8)", immediateRender: false }, BIT); R.sfx("ping", BIT, .8);
  bub("s1", st.z2 - .3);
  // 5. Жора замерзает: снег и сосульки нарастают, термометр падает
  const SW5 = st.z2 - .3; swap("s4", "s5", SW5); move("s5", { s: 1.2 }, SW5, en.l2 - SW5 + .4, "none");
  gsap.set(["#frosts", "#frosti"], { opacity: 0 });
  tl.to("#frosts", { opacity: 1, duration: en.l2 - SW5, ease: "none" }, SW5).to("#frosti", { opacity: 1, duration: (en.l2 - SW5) * .8, ease: "none" }, SW5 + .5);
  tl.fromTo(SC.s5, { x: 0 }, { x: 4, duration: .04, yoyo: true, repeat: 30, ease: "none", immediateRender: false }, st.z2);    // дрожь
  [0, .5, 1].forEach(k => R.sfx("tap", st.l2 + k * .5, .4));
  bub("z2", st.l2 + .6);
  // 6. продавец — в 300 м
  const SW6 = st.s2 - .3; swap("s5", "s6", SW6); move("s6", { s: 1.12 }, SW6, en.l3 - SW6 + .4, "none"); bub("s2", st.l3 + .3);
  ping("#m300", (TT.words.s2 || []).some(w => /^тр[её]х/i.test(w[0])) ? W("s2", "трех") : W("s2", "300"));
  move("s6", { s: 1.6, x: 860, y: 1000 }, W("l3", "с"), 1.2);                       // «с соседней лунки» — наезд на Палыча
  // 7. Палыч на льду
  const SW7 = st.s3 - .3; swap("s6", "s7", SW7); move("s7", { s: 1.12 }, SW7, en.p1 - SW7 + .4, "none"); bub("s3", st.p1 - .1); bub("p1", st.s4 - .3);
  // 8. база: Прадо, «беру без торга»
  cut("s7", "s8", st.s4 - .3); move("s8", { s: 1.14 }, st.s4 - .3, en.s4 - st.s4 + .6, "none"); bub("s4", st.z3 - .3); R.sfx("clack", en.s4, .7);
  // 9. «клюёт!» — подсечка, брызги
  const SW9 = st.z3 - .3; swap("s8", "s9", SW9); move("s9", { s: 1.14 }, SW9, en.z3 - SW9 + .4, "none"); bub("z3", st.z4 - .1);
  gsap.set("#spl", { opacity: 0 });
  tl.fromTo("#spl", { opacity: 0, scale: .3, transformOrigin: "50% 100%" }, { opacity: 1, scale: 1, duration: .25, ease: "back.out(2)", immediateRender: false }, st.z3 + .1); R.sfx("impact", st.z3 + .1, .6); R.sfx("swish", st.z3 + .1, .5);
  tl.fromTo("#rodf", { rotation: -95 }, { rotation: -80, duration: .08, yoyo: true, repeat: 7, ease: "none", immediateRender: false }, st.z3);
  // 10. сапог; за спиной Стас едет по льду на Прадо
  cut("s9", "s10", st.z4 - .1); move("s10", { s: 1.14 }, st.z4 - .1, en.l4 - st.z4 + .4, "none"); bub("z4", st.z4b - .1); bub("z4b", st.l4 + .4);
  tl.fromTo("#boot", { rotation: -10 }, { rotation: 10, duration: .5, yoyo: true, repeat: 5, ease: "sine.inOut", immediateRender: false }, st.z4);
  gsap.set("#pdrv", { x: 700 }); tl.to("#pdrv", { x: -1300, duration: en.l4 - st.l4 + 1, ease: "none" }, st.l4 - .2); R.sfx("rev", st.l4, 2.2);
  // 11. «а на что клюёт?» — «на бота»
  const SW11 = st.z5 - .3; swap("s10", "s11", SW11); move("s11", { s: 1.12 }, SW11, en.s5 - SW11 + .4, "none"); bub("z5", st.s5 - .1); bub("s5", st.l5 - .2);
  // 12. финальная фраза Лиса про бот → карточка
  const SW12 = st.l5 - .2; swap("s11", "s12", SW12); tl.to("#tag", { opacity: 0, duration: .2 }, SW12);
  tl.fromTo("#cta", { opacity: 0, y: 80, scale: .9 }, { opacity: 1, y: 0, scale: 1, duration: .4, ease: "back.out(1.6)", immediateRender: false }, SW12 + .6);
  ending(R, en.l5 + .3);
};

// ── ep61b «Архив»: быстрая уникализация — меняется только заставка ──
$("#title .a").textContent = "РЫБАЛКА:"; $("#title .a").style.cssText = "font-size:110px;background:#2f6db5;color:#fbfaf3";
$("#title .b").textContent = "ЖОРА ПОЙМАЛ САПОГ"; $("#title .b").style.cssText = "font-size:60px;background:#fbfaf3;color:#2f6db5";
const ORIG = [...document.querySelectorAll("#lbx .lbt, #lbx .lbb")].map(e => e.textContent), HEADT = 2.4;
{ const L = document.querySelector("#lbx"); if (L) { const a = L.querySelector(".lbt"), b = L.querySelector(".lbb");   // кинорамка вместо плашки (ep56)
  a.textContent = "РЫБАЛКА:"; b.textContent = "ЖОРА ПОЙМАЛ САПОГ"; a.style.background = b.style.background = "#2f6db5"; a.style.color = b.style.color = "#fbfaf3"; } }
{ const K = document.querySelector("#ballc"); if (K) { const orig = K.innerHTML, col = K.style.color;   // надпись над хрустальным шаром (ep58)
  K.innerHTML = "РЫБАЛКА:"; K.style.color = "#2f6db5";
  const B = window.build; window.build = R => { B(R); R.tl.to(K, { opacity: 0, duration: .15 }, HEADT - .6);
    R.tl.set(K, { innerHTML: orig, color: col }, HEADT - .45); R.tl.to(K, { opacity: 1, duration: .15 }, HEADT - .4); }; } }
{ const K = document.querySelector("#skc"); if (K) { const [a, b] = K.children, orig = [a.textContent, b.textContent], bg = K.style.background, col = K.style.color;   // подпись судебного рисунка (ep57)
  a.textContent = "РЫБАЛКА:"; b.textContent = "ЖОРА ПОЙМАЛ САПОГ"; K.style.background = "#2f6db5"; K.style.color = "#fbfaf3";
  const B = window.build; window.build = R => { B(R); R.tl.to(K, { opacity: 0, duration: .15 }, HEADT - .6);
    R.tl.set(a, { textContent: orig[0] }, HEADT - .45).set(b, { textContent: orig[1] }, HEADT - .45).set(K, { background: bg, color: col }, HEADT - .45);
    R.tl.to(K, { opacity: 1, duration: .15 }, HEADT - .4); }; } }
{ const L = document.querySelector("#lbx"); if (L) { const B = window.build; window.build = R => { B(R);   // до склейки с основным видео (HEAD) рамка возвращается к исходной
  const bars = [L.querySelector(".lbt"), L.querySelector(".lbb")], col = ["#fff", "#ffd23f"];
  R.tl.to(bars, { opacity: 0, duration: .15 }, HEADT - .6);
  bars.forEach((el, i) => R.tl.set(el, { textContent: ORIG[i], background: "#000", color: col[i] }, HEADT - .45));
  R.tl.to(bars, { opacity: 1, duration: .15 }, HEADT - .4); }; } }
