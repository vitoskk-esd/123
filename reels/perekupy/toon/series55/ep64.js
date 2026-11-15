// «ТЁЩА: МАШИНА НА ДАЧУ» (ep64, киношный формат ../cine.js, отдельный ролик). Сцены — как в утверждённой раскадровке board.html.
// ОБЛОЖКА (кадр 0, правило владельца 15.11): тёща держит телефон с ботом (Нива −16%) + плашка «ТЁЩА: / МАШИНА НА ДАЧУ» (гаснет к 1,6 с)
// → ужин: «машину на дачу» → Жора: «моя Приора, почти даром» → двор: очки → рентген (тёща в кружке-врезке) → «рынок такой!» → тетрадь
// → «внук бота поставил» → дача: Нива и рассада → «а можно мне бота?» — «внука попроси» → финальная фраза Лиса про бот + карточка.
$("#title .a").textContent = E.rubric; $("#title .b").textContent = E.subtitle; $("#title .b").style.fontSize = "104px"; $("#tag span").textContent = "тёща";
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
const TS = (p, x, foot, h, pose = {}, extra = {}) => TSC(ch("vika", spk(p, "tesha"), x, foot, h, null, pose, extra));
const ZL_L = glow(540, 150, 300, "#fff6d0", .5) + glow(910, 860, 160, "#9fd6ff", .3);
const DV_L = glow(900, 200, 380, "#fff6d0", .3);
const DA_L = glow(880, 230, 360, "#fff6c8", .45);
// кружок-врезка с лицом тёщи (говорящий в кадре поверх вставки)
const PIP = (p, id, ring = "#7fffd4") => `<div id="${id}" class="grp" style="position:absolute;left:700px;top:1480px;width:320px;height:320px;border-radius:50%;overflow:hidden;border:9px solid ${ring};z-index:30;background:#e9dcc6;box-shadow:0 10px 30px #0008">
  ${TS(p, 160, 800, 900, {}, { noShadow: 1 })}${GLINT(160, 800, 900, id + "g")}</div>`;
const BOX = (l, t, w, id = "") => `<div class="prop"${id ? ` id="${id}"` : ""} style="left:${l}px;top:${t}px;width:${w}px;height:${w * .64}px;z-index:9">${SEEDBOX()}</div>`;

// 1. обложка: тёща с ботом
{ const H = HOLDPHONE("vika", spk("tp", "tesha"), 540, 2090, 1680, null, NVCARD(), { rim: "#fff6d0", side: 1 });
  mount("s1", { bg: "zalteshi", grade: "warm", farBlur: 8, mid: TSC(H.mid), lights: H.lights + ZL_L }, { x: 540, y: 960, s: 1 }); }
// 2. ужин
mount("s2", { bg: "zalteshi", grade: "warm", mid: TS("ta", 300, 1650, 760, { armR: -40 }, { rim: "#fff6d0", side: 1, z: 7 }) + Z("za", 790, 1660, 760, { look: "grin" }, {}, { rim: "#fff6d0", side: -1, z: 7 }) + DTABLE(9), lights: ZL_L,
  bubbles: [{ id: "t1", p: "ta", html: "Жора, мне машину<br><em>на дачу надо.</em>", fs: 46 }, { id: "z0", p: "za", html: "Мама, для вас —<br><em>всё что угодно!</em>", fs: 44 }] }, { x: 540, y: 1180, s: 1.06 });
// 3. «моя Приора»
mount("s3", { bg: "zalteshi", grade: "warm", farBlur: 6, mid: Z("zb", 540, 1900, 1000, { look: "grin" }, { armL: 40 }, { rim: "#fff6d0", side: 1, z: 7 }), lights: ZL_L,
  bubbles: [{ id: "z1", p: "zb", html: "Мама, моя Приора!<br><em>Почти даром — четыреста.</em>", fs: 44 }] }, { x: 540, y: 1150, s: 1.08 });
// 4. двор: Приора, тёща надевает очки
mount("s4", { bg: "dvorteshi", grade: "day", mid: car(PRIORA, -20, 1680, 860, { z: 4, sheen: .5 }) + TS("tc", 880, 1760, 760, { armR: -150 }, { rim: "#fff6d0", side: -1, z: 7 }) + GLINT(880, 1760, 760, "glc"), lights: DV_L,
  bubbles: [{ id: "t2", p: "tc", html: "Сейчас посмотрим,<br><em>что ты мне продаёшь.</em>", fs: 44 }] }, { x: 540, y: 1200, s: 1.05 });
// 5. рентген + тёща в кружке
mount("s5", { far: XRAY(), farBlur: 0, mid: PIP("tx", "pip1"),
  bubbles: [{ id: "t3", at: [540, 1500], html: "Пробег скручен, пороги в шпаклёвке.<br><em>Сто пятьдесят, Жора, не больше.</em>", fs: 38 }] }, { x: 540, y: 960, s: 1 });
// 6. «рынок такой!»
mount("s6", { bg: "dvorteshi", grade: "day", farBlur: 6, mid: Z("zd", 540, 1900, 1000, { look: "o" }, { armR: -100 }, { rim: "#fff6d0", side: 1, z: 7 }), lights: DV_L,
  bubbles: [{ id: "z2", p: "zd", html: "Мама,<br><em>рынок сейчас такой!</em>", fs: 48 }] }, { x: 540, y: 1150, s: 1.08 });
// 7. тетрадь + тёща в кружке
mount("s7", { far: NOTEBOOK(), farBlur: 0, mid: PIP("ty", "pip2", "#e6b422"),
  bubbles: [{ id: "t3b", at: [440, 1560], html: "Рынок, Жора,<br><em>у меня в тетрадке.</em>", fs: 42 }] }, { x: 540, y: 960, s: 1 });
// 8. «внук бота поставил»
{ const H = HOLDPHONE("vika", spk("te", "tesha"), 380, 1960, 1250, null, NVCARD().replace('id="ncc"', 'id="ncc2"'), { rim: "#fff6d0", side: 1 });
  mount("s8", { bg: "dvorteshi", grade: "day", farBlur: 5, mid: TSC(H.mid) + Z("ze", 860, 1800, 900, { look: "o" }, {}, { z: 5 }), lights: H.lights + DV_L,
    bubbles: [{ id: "t4", p: "te", html: "Мне внук бота поставил.<br><em>Нива — пятьсот девяносто.</em>", fs: 40 }] }, { x: 560, y: 1080, s: 1.05 }); }
// 9. дача: Нива, рассада
mount("s9", { bg: "dachaogorod", grade: "day", mid: car(NIVA, 20, 1640, 640, { z: 4, sheen: .5 }) + TS("tf", 860, 1760, 760, { armR: -100 }, { rim: "#fff6d0", side: -1, z: 7 }) + Z("zf", 560, 1820, 800, { look: "o" }, { armL: 60, armR: -60 }, { rim: "#fff6d0", side: 1, z: 8 })
  + BOX(465, 1440, 190, "bx1") + BOX(475, 1345, 170, "bx2"), lights: DA_L,
  bubbles: [{ id: "t5", p: "tf", html: "Жора, аккуратнее!<br><em>Это помидоры!</em>", fs: 46 }, { id: "z2b", p: "zf", html: "Это же мой<br><em>выходной…</em>", fs: 46 }] }, { x: 540, y: 1200, s: 1.05 });
// 10. «а можно мне бота?»
mount("s10", { bg: "dachaogorod", grade: "day", farBlur: 5, mid: Z("zg", 540, 1900, 1000, { look: "o" }, { armL: 60, armR: -60 }, { rim: "#fff6d0", side: 1, z: 7 }) + BOX(390, 1420, 300, "bx3"), lights: DA_L,
  bubbles: [{ id: "z3", p: "zg", html: "Мама… а можно мне<br><em>тоже такого бота?</em>", fs: 46 }] }, { x: 540, y: 1150, s: 1.08 });
// 11. «внука попроси»
mount("s11", { bg: "dachaogorod", grade: "day", farBlur: 3, mid: TS("th", 540, 1900, 1000, { armL: 40 }, { rim: "#fff6d0", side: 1, z: 7 }) + GLINT(540, 1900, 1000, "glh"), lights: DA_L,
  bubbles: [{ id: "t6", p: "th", html: "Внука<br><em>попроси.</em>", fs: 56 }] }, { x: 540, y: 1150, s: 1.08 });
// 12. карточка бота
mount("s12", { bg: "dachaogorod", grade: "day", over: CTA64.replace('<div style="position:absolute;', '<div id="cta" style="opacity:0;position:absolute;'), lights: DA_L }, { x: 540, y: 1000, s: .98 });

$("#end h2").innerHTML = E.end;

window.build = R => {
  const tl = R.tl;
  const { pop } = common(R, { shake: 0 });
  for (const el of Object.values(SC)) {
    el.sheens = [...el.querySelectorAll(".sheen")];
    el.glows = [...el.querySelectorAll(".lights .glow")].map(g => ({ g, o: +g.style.opacity }));
  }
  const talk = (lv, f) => lv > .28 && !(lv < .55 && f % 3 === 2);
  const MOOD = { zd: "o", ze: "o", zf: "o", zg: "o", tx: "flat", ty: "grin" };
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
  const glint = (sel, at) => { gsap.set(sel, { opacity: 0 }); tl.fromTo(sel, { opacity: 0 }, { opacity: 1, duration: .08, yoyo: true, repeat: 1, immediateRender: false }, at); R.sfx("ping", at, .5); };
  const ping = (sel, at, snd = "clack") => { gsap.set(sel, { opacity: 0 }); tl.fromTo(sel, { opacity: 0, scale: 1.7 }, { opacity: 1, scale: 1, duration: .2, ease: "back.out(2)", immediateRender: false }, at); if (snd) R.sfx(snd, at, .6); };
  const wipe = (sel, at, d = .45, snd = "type") => { gsap.set(sel, { clipPath: "inset(-20% 100% -20% -5%)" }); tl.to(sel, { clipPath: "inset(-20% -5% -20% -5%)", duration: d, ease: "none" }, at); if (snd) R.sfx(snd, at, .5); };
  const pipIn = (sel, at) => { gsap.set(sel, { opacity: 0 }); tl.fromTo(sel, { opacity: 0, scale: .3 }, { opacity: 1, scale: 1, duration: .3, ease: "back.out(2)", immediateRender: false }, at); };

  // 1. обложка: плашка видна с первого кадра и гаснет к 1,6 с; карточка бота — с кадра 0
  gsap.set(SC.s1, { opacity: 1 }); SC.s1.style.display = "";
  gsap.set("#cnt", { opacity: 0 });
  show("s1", 0); tl.to("#title", { opacity: 0, y: -50, duration: .25 }, 1.6);
  move("s1", { s: 1.06, y: 1000 }, 0, en.l0 + .4, "none");
  tl.fromTo("#ncc", { scale: 1 }, { scale: 1.06, duration: .15, yoyo: true, repeat: 1, ease: "power2.out", immediateRender: false }, W("l0", "реш")); R.sfx("ping", W("l0", "реш"), .6);
  // 2. ужин
  const SW2 = st.t1 - .4; swap("s1", "s2", SW2); move("s2", { s: 1.12 }, SW2, en.z0 - SW2 + .3, "none"); bub("t1", st.z0 - .1); bub("z0", st.z1 - .2);
  // 3. «моя Приора»
  cut("s2", "s3", st.z1 - .2); move("s3", { s: 1.16 }, st.z1 - .2, en.z1 - st.z1 + .4, "none"); bub("z1", st.l1 - .2);
  // 4. двор: очки
  const SW4 = st.l1 - .3; swap("s3", "s4", SW4); move("s4", { s: 1.12, x: 640 }, SW4, en.t2 - SW4 + .4, "none"); glint("#glc", W("l1", "очк") + .2); bub("t2", st.l2 - .2);
  // 5. рентген: линия сканирования, метки дефектов под слова тёщи
  const SW5 = st.l2 - .2; swap("s4", "s5", SW5); move("s5", { s: 1.04 }, SW5, en.t3 - SW5 + .4, "none");
  tl.fromTo("#xscan", { y: 0 }, { y: 700, duration: 1.6, yoyo: true, repeat: 3, ease: "sine.inOut", immediateRender: false }, SW5 + .3); R.sfx("riser", SW5 + .3, 1.2);
  ["#xr0", "#xr1", "#xr2", "#xr3"].forEach(s => gsap.set(s, { opacity: 0 }));
  ping("#xr3", W("l2", "тех")); ping("#xr0", W("t3", "проб")); ping("#xr1", W("t3", "порог")); ping("#xr2", W("t3", "крыл"));
  pipIn("#pip1", st.t3 - .5); glint("#pip1g", st.t3 - .2); bub("t3", st.z2 - .2);
  // 6. «рынок такой!»
  cut("s5", "s6", st.z2 - .2); move("s6", { s: 1.16 }, st.z2 - .2, en.z2 - st.z2 + .4, "none"); bub("z2", st.t3b - .2);
  // 7. тетрадь
  const SW7 = st.t3b - .2; swap("s6", "s7", SW7); move("s7", { s: 1.05 }, SW7, en.t3b - SW7 + .5, "none"); pipIn("#pip2", SW7 + .3); bub("t3b", st.t4 - .2);
  [0, 1, 2, 3, 4].forEach(k => wipe(`#nb${k}`, SW7 + .4 + k * .45, .4, "type"));
  // 8. «внук бота поставил»
  const SW8 = st.t4 - .2; swap("s7", "s8", SW8); move("s8", { s: 1.12 }, SW8, en.t4 - SW8 + .4, "none");
  tl.fromTo("#ncc2", { scale: 1 }, { scale: 1.07, duration: .15, yoyo: true, repeat: 1, ease: "power2.out", immediateRender: false }, W("t4", "бот")); R.sfx("ping", W("t4", "бот"), .8);
  bub("t4", st.l4 - .2);
  // 9. дача: ящики качаются
  const SW9 = st.l4 - .2; swap("s8", "s9", SW9); move("s9", { s: 1.12 }, SW9, en.z2b - SW9 + .4, "none"); bub("t5", st.z2b - .1); bub("z2b", st.z3 - .2);
  tl.fromTo(["#bx1", "#bx2"], { rotation: -4 }, { rotation: 4, duration: .4, yoyo: true, repeat: 9, ease: "sine.inOut", immediateRender: false }, SW9);
  // 10. «а можно мне бота?»
  cut("s9", "s10", st.z3 - .2); move("s10", { s: 1.18 }, st.z3 - .2, en.z3 - st.z3 + .4, "none"); bub("z3", st.t6 - .1);
  // 11. «внука попроси»
  cut("s10", "s11", st.t6 - .1); move("s11", { s: 1.18 }, st.t6 - .1, en.t6 - st.t6 + .6, "none"); glint("#glh", en.t6 + .05); bub("t6", st.l5 - .2);
  // 12. финальная фраза Лиса про бот → карточка
  const SW12 = st.l5 - .2; swap("s11", "s12", SW12); tl.to("#tag", { opacity: 0, duration: .2 }, SW12);
  tl.fromTo("#cta", { opacity: 0, y: 80, scale: .9 }, { opacity: 1, y: 0, scale: 1, duration: .4, ease: "back.out(1.6)", immediateRender: false }, SW12 + .6);
  ending(R, en.l5 + .3);
};
