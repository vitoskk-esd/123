// «ФУТБОЛ: МАТЧ ЗА КАМРИ» (ep74, киношный формат ../cine.js, отдельный ролик, БЕЗ мата). Сцены — как в утверждённой раскадровке board.html.
// ОБЛОЖКА: Стас с ботом (Camry −9%) + плашка «ФУТБОЛ: / МАТЧ ЗА КАМРИ» → кабина: «мяч в игре!» → Стас звонит, мяч в сетку → «гол! 1:0» → Жора через 40 минут
// → «поздно, продано!» → Жора продаёт свою Камри, судья: VAR → одометр крутится назад → красная карточка → Стас: Камри ниже рынка, 2:0 → «какой матч!» → финал Лиса.
$("#title .a").textContent = E.rubric; $("#title .b").textContent = E.subtitle; $("#tag span").textContent = "футбол";
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
const V = (p, x, foot, h, o = {}, pose = {}, extra = {}) => ch("perekup", spk(p, "vad"), x, foot, h, { ...VAD, ...o }, pose, extra) + HEADSET(x, foot, h, (extra.z || 7) + 1);
const RF = (p, x, foot, h, o = {}, pose = {}, extra = {}) => ch("perekup", spk(p, "ref"), x, foot, h, { ...REF, ...o }, pose, extra);
const ST = (p, x, foot, h, o = {}, pose = {}, extra = {}) => ch("perekup", spk(p, "stas"), x, foot, h, { ...STAS, ...o }, pose, extra);
const PIP = (inner, id, ring = "#ffd23f", left = 380, top = 1460, bgc = "#3a3d52") => `<div id="${id}" class="grp" style="position:absolute;left:${left}px;top:${top}px;width:320px;height:320px;border-radius:50%;overflow:hidden;border:9px solid ${ring};z-index:45;background:${bgc};box-shadow:0 10px 30px #0008">${inner}</div>`;
const grp = (id, html, z = "") => `<div class="grp" id="${id}" style="position:absolute;left:0;top:0;width:1080px;height:1920px${z !== "" ? `;z-index:${z}` : ""}">${html}</div>`;
const FP_L = glow(120, 120, 260, "#fff6d0", .4) + glow(960, 120, 260, "#fff6d0", .4);
const KM_L = glow(540, 500, 420, "#2f6db5", .2);
const VR_L = glow(540, 900, 520, "#2f6db5", .3);
const sb = (a, b, id, x = 160, y = 340, w = 760) => SCOREB(x, y, id, w).replace(`id="${id}a">0<`, `id="${id}a">${a}<`).replace(`id="${id}b">0<`, `id="${id}b">${b}<`);
const CAB_SH = { x: 540, y: 1100, s: 1.04 };

// 1. обложка: Стас с ботом
{ const H = HOLDPHONE("perekup", spk("sp", "stas"), 540, 2090, 1680, STAS, CAMCARD(), { rim: "#fff6d0", side: 1 });
  mount("s1", { bg: "futbolpole", farBlur: 8, mid: H.mid, lights: H.lights + FP_L }, { x: 540, y: 960, s: 1 }); }
// 2. кабина: «мяч в игре!»
mount("s2", { bg: "kommentatorka", mid: V("va", 540, 2000, 1150, {}, { armR: -120 }, { rim: "#2f6db5", side: 1, z: 7 }), over: sb(0, 0, "sb1", 160, 330) + LOWER3("ФИНАЛ СЕЗОНА", "«Перехват» — «Перекупы» · разыгрывается Камри"), lights: KM_L,
  bubbles: [{ id: "k0", p: "va", html: "Объявление вышло!<br><em>Мяч в игре!</em>", fs: 48 }] }, CAB_SH);
// 3. Стас звонит — мяч в сетку
mount("s3", { bg: "futbolpole", mid: ST("sa", 260, 1880, 880, {}, { armR: -150 }, { rim: "#fff6d0", side: 1, z: 7 }) + BALL(800, 1600), over: sb(0, 0, "sb2"), lights: FP_L,
  bubbles: [{ id: "s0", p: "sa", html: "Уже звоню<br><em>продавцу!</em>", fs: 48 }] }, { x: 540, y: 1150, s: 1.04 });
// 4. «гол! 1:0»
mount("s4", { bg: "kommentatorka", mid: V("vb", 540, 2000, 1150, { look: "o" }, { armL: -150, armR: -150 }, { rim: "#2f6db5", side: 1, z: 7 }), over: sb(0, 0, "sb3", 160, 330), lights: KM_L,
  bubbles: [{ id: "k1", p: "vb", html: "Гол! Один — ноль!<br><em>Стас уже договорился!</em>", fs: 42 }] }, CAB_SH);
// 5. Жора через 40 минут
mount("s5", { bg: "futbolpole", farBlur: 2, mid: grp("zr", Z("za", 540, 1880, 900, { look: "o" }, { armL: 60, armR: -60 }, { rim: "#fff6d0", side: 1, z: 7 })), over: sb(1, 0, "sb4"), lights: FP_L,
  bubbles: [{ id: "z0", p: "za", html: "Камри моя!<br><em>Беру, не глядя!</em>", fs: 48 }] }, { x: 540, y: 1150, s: 1.04 });
// 6. «поздно, продано!»
mount("s6", { bg: "kommentatorka", mid: V("vc", 540, 2000, 1150, {}, { armR: -60 }, { rim: "#2f6db5", side: 1, z: 7 }), over: sb(1, 0, "sb5", 160, 330), lights: KM_L,
  bubbles: [{ id: "k2", p: "vc", html: "Поздно, Жора!<br><em>Продано!</em>", fs: 52 }] }, CAB_SH);
// 7. Жора продаёт свою Камри — судья: VAR
mount("s7", { bg: "futbolpole", mid: car(CAM3, 300, 1640, 760, { z: 5, sheen: .5 }) + Z("zb", 200, 1880, 860, { look: "grin" }, { armR: -60 }, { rim: "#fff6d0", side: 1, z: 7 }) + RF("ra", 880, 1880, 860, {}, { armL: 60 }, { rim: "#fff6d0", side: -1, z: 7 }), lights: FP_L,
  bubbles: [{ id: "r0", p: "ra", html: "Стоп, игра!<br><em>Смотрим повтор!</em>", fs: 48 }] }, { x: 540, y: 1150, s: 1.04 });
// 8. VAR: одометр назад
mount("s8", { bg: "varkomnata", mid: VARMON(110, 640) + PIP(V("vpip", 160, 800, 900, { look: "o" }, {}, { noShadow: 1 }), "pip1", "#ffd23f", 380, 1460), lights: VR_L,
  bubbles: [{ id: "k3", at: [540, 1480], html: "Пробег скручен<br><em>с трёхсот тысяч до восьмидесяти!</em>", fs: 38 }] }, { x: 540, y: 1100, s: 1.02 });
// 9. красная карточка
mount("s9", { bg: "futbolpole", farBlur: 2, mid: RF("rb", 300, 1880, 900, {}, { armR: -170 }, { rim: "#fff6d0", side: 1, z: 7 }) + REFCARD(250, 860) + Z("zc", 800, 1880, 860, { look: "o" }, { armL: 70 }, { rim: "#fff6d0", side: -1, z: 7 }), lights: FP_L,
  bubbles: [{ id: "r1", p: "rb", html: "Жора — красная карточка!<br><em>Удаление!</em>", fs: 40 }, { id: "z1", p: "zc", html: "Это не я!<br><em>Это одометр сам!</em>", fs: 42 }] }, { x: 540, y: 1150, s: 1.04 });
// 10. Стас: Камри ниже рынка, 2:0
mount("s10", { bg: "futbolpole", mid: car(CAMS, 60, 1640, 900, { z: 5, sheen: .5 }) + ST("sb", 900, 1880, 820, { look: "grin" }, { armL: -150 }, { rim: "#fff6d0", side: -1, z: 7 }), over: sb(1, 0, "sb6"), lights: FP_L,
  bubbles: [{ id: "s1", p: "sb", html: "Камри, один хозяин,<br><em>ниже рынка на 200 тысяч!</em>", fs: 40 }] }, { x: 540, y: 1150, s: 1.04 });
// 11. «два — ноль в пользу бота!»
mount("s11", { bg: "kommentatorka", mid: V("vd", 540, 2000, 1150, { look: "grin" }, { armL: -150, armR: -150 }, { rim: "#2f6db5", side: 1, z: 7 }), over: sb(2, 0, "sb7", 160, 330), lights: KM_L,
  bubbles: [{ id: "k4", p: "vd", html: "Два — ноль в пользу бота!<br><em>Какой матч!</em>", fs: 44 }] }, CAB_SH);
// 12. карточка бота
mount("s12", { bg: "futbolpole", over: CTA74.replace('<div style="position:absolute;', '<div id="cta" style="opacity:0;position:absolute;'), lights: FP_L }, { x: 540, y: 1000, s: .98 });

$("#end h2").innerHTML = E.end;

window.build = R => {
  const tl = R.tl;
  const { pop } = common(R, { shake: 0 });
  for (const el of Object.values(SC)) {
    el.sheens = [...el.querySelectorAll(".sheen")];
    el.glows = [...el.querySelectorAll(".lights .glow")].map(g => ({ g, o: +g.style.opacity }));
  }
  const talk = (lv, f) => lv > .28 && !(lv < .55 && f % 3 === 2);
  const MOOD = { vpip: "o", zc: "o", za: "o", ra: "flat", rb: "flat" };
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
  const score = (id, val, at) => { tl.set(`#${id}`, { textContent: String(val) }, at).fromTo(`#${id}`, { scale: 1.8, color: "#ffd23f" }, { scale: 1, color: "#ffffff", duration: .4, ease: "back.out(3)", immediateRender: false }, at); R.sfx("ping", at, .7); };

  // 1. обложка: плашка видна с первого кадра и гаснет к 1,6 с; карточка бота — с кадра 0
  gsap.set(SC.s1, { opacity: 1 }); SC.s1.style.display = "";
  gsap.set("#cnt", { opacity: 0 });
  tl.set(SC.s1, { opacity: 1 }, 0); tl.to("#title", { opacity: 0, y: -50, duration: .25 }, 1.6);
  move("s1", { s: 1.06, y: 1000 }, 0, en.l0 + .3, "none");
  tl.fromTo("#ccc", { scale: 1 }, { scale: 1.06, duration: .15, yoyo: true, repeat: 1, ease: "power2.out", immediateRender: false }, 1.9); R.sfx("ping", 1.9, .6);
  // 2. кабина
  const SW2 = st.k0 - .35; swap("s1", "s2", SW2); move("s2", { s: 1.1 }, SW2, en.k0 - SW2 + .3, "none");
  tl.fromTo("#l3", { x: -1100 }, { x: 0, duration: .45, ease: "power3.out", immediateRender: true }, SW2 + .3); bub("k0", st.l1 - .2);
  // 3. Стас звонит → мяч в сетку
  const SW3 = st.l1 - .25; swap("s2", "s3", SW3); move("s3", { s: 1.08 }, SW3, en.s0 - SW3 + .4, "none"); bub("s0", st.k1 - .2);
  tl.fromTo("#ball", { x: 0, y: 0, rotation: 0, scale: 1 }, { x: -280, y: -680, rotation: 540, scale: .55, duration: .9, ease: "power2.out", immediateRender: true }, en.s0 - .5);
  R.sfx("whoosh", en.s0 - .5, .6);
  // 4. «гол! 1:0»
  cut("s3", "s4", st.k1 - .2); move("s4", { s: 1.14 }, st.k1 - .2, en.k1 - st.k1 + .4, "none"); bub("k1", st.l2 - .2);
  score("sb3a", 1, Wd("k1", "один", .35));
  // 5. Жора выбегает
  const SW5 = st.l2 - .3; swap("s4", "s5", SW5); move("s5", { s: 1.1 }, SW5, en.z0 - SW5 + .4, "none"); bub("z0", st.k2 - .2);
  tl.fromTo("#zr", { x: 700 }, { x: 0, duration: 1.2, ease: "power2.out", immediateRender: true }, SW5 + .3);
  // 6. «поздно, продано!»
  cut("s5", "s6", st.k2 - .2); move("s6", { s: 1.12 }, st.k2 - .2, en.k2 - st.k2 + .4, "none"); bub("k2", st.l3 - .2);
  // 7. Камри Жоры, свисток
  const SW7 = st.l3 - .3; swap("s6", "s7", SW7); move("s7", { s: 1.08 }, SW7, en.r0 - SW7 + .4, "none"); bub("r0", st.k3 - .2);
  R.sfx("bleep", st.r0 - .05, .5); R.sfx("bleep", st.r0 + .12, .5);
  // 8. VAR: одометр крутится назад 300 000 → 80 000
  const SW8 = st.k3 - .3; swap("s7", "s8", SW8); move("s8", { s: 1.06 }, SW8, en.k3 - SW8 + .4, "none"); bub("k3", st.r1 - .2);
  tl.fromTo("#pip1", { scale: 0 }, { scale: 1, duration: .3, ease: "back.out(2)", immediateRender: true }, st.k3 - .1);
  const OD = { v: 300000 }; tl.to(OD, { v: 80000, duration: Math.max(1.5, en.k3 - st.k3 - .3), ease: "power2.inOut", onUpdate: () => { const e = document.getElementById("vmv"); if (e) e.textContent = Math.round(OD.v / 1000) + " " + String(Math.round(OD.v % 1000)).padStart(3, "0"); } }, st.k3 + .2);
  // 9. красная карточка
  cut("s8", "s9", st.r1 - .2); move("s9", { s: 1.1 }, st.r1 - .2, en.z1 - st.r1 + .4, "none"); bub("r1", st.z1 - .1); bub("z1", st.s1 - .2);
  tl.fromTo("#rc", { y: 260, opacity: 0, rotation: 20 }, { y: 0, opacity: 1, rotation: -8, duration: .3, ease: "back.out(2.5)", immediateRender: true }, Wd("r1", "красн", .3)); R.sfx("clack", Wd("r1", "красн", .3), .8);
  // 10. Стас: Камри ниже рынка, табло 2:0
  const SW10 = st.s1 - .3; swap("s9", "s10", SW10); move("s10", { s: 1.08 }, SW10, en.s1 - SW10 + .4, "none"); bub("s1", st.k4 - .2);
  score("sb6a", 2, Wd("s1", "спасиб", .8));
  // 11–12. «два — ноль!» → финальная фраза Лиса → карточка
  cut("s10", "s11", st.k4 - .2); const SW12 = Math.min(st.l4 + 2.2, en.l4 - 2.5); move("s11", { s: 1.14 }, st.k4 - .2, SW12 - st.k4 + .6, "none"); bub("k4", st.l4 + .3);
  swap("s11", "s12", SW12); tl.to("#tag", { opacity: 0, duration: .2 }, SW12);
  tl.fromTo("#cta", { opacity: 0, y: 80, scale: .9 }, { opacity: 1, y: 0, scale: 1, duration: .4, ease: "back.out(1.6)", immediateRender: false }, SW12 + .6);
  ending(R, en.l4 + .3);
};
