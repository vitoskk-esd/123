// «ЭВАКУАТОР: ПОСТОЯННЫЙ КЛИЕНТ» (ep71, киношный формат ../cine.js, отдельный ролик, с матом — владелец 15.11; в облачках — со звёздочками).
// ОБЛОЖКА: Пашка с ботом (Hyundai −13%) + плашка «ЭВАКУАТОР: / ПОСТОЯННЫЙ КЛИЕНТ» → кабина: Жора по рации → 5 км: «БАХ!» → погрузка на платформу
// → «гарантия — это я» → счётчик 7 вызовов → дача «им. Жоры» и Гелик → бот: Хёндай → «месяц без вызовов» → Хёндай едет мимо → финал Лиса.
$("#title .a").textContent = E.rubric; $("#title .b").textContent = E.subtitle; $("#title .b").style.fontSize = "74px"; $("#tag span").textContent = "эвакуатор";
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
const V = (p, x, foot, h, o = {}, pose = {}, extra = {}) => ch("perekup", spk(p, "vitya"), x, foot, h, { ...VIT, ...o }, pose, extra);
const P = (p, x, foot, h, o = {}, pose = {}, extra = {}) => ch("perekup", spk(p, "pash"), x, foot, h, { ...PASH, ...o }, pose, extra);
const grp = (id, html, z = "") => `<div class="grp" id="${id}" style="position:absolute;left:0;top:0;width:1080px;height:1920px${z !== "" ? `;z-index:${z}` : ""}">${html}</div>`;
const TS_L = glow(760, 880, 300, "#ffe08a", .45);
const KB_L = glow(760, 560, 260, "#ffe08a", .35);
const DV_L = glow(540, 400, 420, "#ffd8a0", .3);
const CAB_SH = { x: 540, y: 1000, s: 1.08 };

// 1. обложка: Пашка с ботом
{ const H = HOLDPHONE("perekup", spk("pp", "pash"), 540, 2090, 1680, PASH, HYCARD(), { rim: "#ffe08a", side: 1 });
  mount("s1", { bg: "trassa5km", farBlur: 8, mid: H.mid, lights: H.lights + TS_L }, { x: 540, y: 960, s: 1 }); }
// 2. кабина: Жора по рации
mount("s2", { bg: "kabinaevak", mid: V("va", 360, 1960, 1250, {}, { armL: -40, armR: -40 }, { rim: "#ffe08a", side: 1, z: 7 }) + KDASH(360) + RADIO(780, 1150) + TALLY(600, 300, "tl", 3) + PIP(Z("zpip", 160, 800, 900, { look: "o" }, {}, { noShadow: 1 }), "pip1", "#ffd23f", 690, 560, "#ff9a6a"), lights: KB_L,
  bubbles: [{ id: "z0", at: [850, 600], html: "Витёк, выручай!<br><em>Опять встала!</em>", fs: 40 }, { id: "v0", p: "va", html: "Жора, бл*дь,<br><em>это третий раз за день.</em>", fs: 40 }] }, CAB_SH);
// 3. 5 км: «БАХ!»
mount("s3", { bg: "trassa5km", mid: grp("c3", car(V15, 120, 1640, 860, { z: 5, sheen: .4 })) + BANG(0, 1300) + P("pa", 900, 1880, 800, {}, { armL: 60 }, { rim: "#ffe08a", side: -1, z: 7 }), lights: TS_L,
  bubbles: [{ id: "p0", p: "pa", html: "Дядя Витя, она дымит<br><em>и… стреляет!</em>", fs: 42 }] }, { x: 540, y: 1150, s: 1.04 });
// 4. погрузка на платформу
mount("s4", { bg: "trassa5km", mid: TOWTRUCK(40, 1720, 960) + grp("ld", car(V15, 90, 1515, 640, { z: 6, sheen: .4 }), 6) + V("vb", 920, 1900, 820, {}, { armR: -120 }, { rim: "#ffe08a", side: -1, z: 9 }), lights: TS_L,
  bubbles: [{ id: "v1", p: "vb", html: "Ё* твою мать, глушак отвалился.<br><em>Грузим.</em>", fs: 40 }] }, { x: 540, y: 1150, s: 1.04 });
// 5. «гарантия — это я»
mount("s5", { bg: "trassa5km", farBlur: 3, mid: TOWTRUCK(200, 1500, 760, "tt2", 3) + P("pb", 270, 1880, 820, { look: "o" }, { armR: -60 }, { rim: "#ffe08a", side: 1, z: 7 }) + V("vc", 800, 1880, 860, {}, { armL: 50 }, { rim: "#ffe08a", side: -1, z: 7 }), lights: TS_L,
  bubbles: [{ id: "p1", p: "pb", html: "А гарантия?", fs: 48 }, { id: "v2", p: "vc", html: "Гарантия, Паша, — это я.<br><em>Каждые пять километров.</em>", fs: 40 }] }, { x: 540, y: 1150, s: 1.04 });
// 6. ночь: счётчик 7 вызовов
mount("s6", { bg: "kabinaevak", farFilter: "brightness(.55) hue-rotate(200deg)", mid: V("vd", 360, 1960, 1250, { look: "o" }, { armL: -40, armR: -40 }, { rim: "#a8cfe8", side: 1, z: 7 }) + KDASH(360) + TALLY(330, 360, "tl2", 3).replace("width:380px;height:190px;z-index:26;transform:rotate(3deg)", "width:380px;height:190px;z-index:26;transform:rotate(3deg) scale(1.5)") }, CAB_SH);
// 7. дача «им. Жоры» и Гелик
mount("s7", { bg: "dachavity", mid: car(GEL, 430, 1700, 620, { z: 5, sheen: .5 }) + V("ve", 250, 1880, 900, { look: "grin" }, { armR: -150 }, { rim: "#ffd8a0", side: 1, z: 7 }) + PIP(Z("zpip2", 160, 800, 900, { look: "grin" }, {}, { noShadow: 1 }), "pip2", "#ffd23f", 720, 640, "#ffb07a"), lights: DV_L,
  bubbles: [{ id: "v3", p: "ve", html: "На твоих тачках дачу достроил<br><em>и Гелик взял. Спасибо, на**й.</em>", fs: 38 }, { id: "z1", at: [880, 660], html: "Обращайся!", fs: 44 }] }, { x: 540, y: 1150, s: 1.04 });
// 8. бот: Хёндай
{ const H = HOLDPHONE("perekup", spk("pd", "pash"), 540, 2000, 1400, PASH, HYCARD("hcc2"), { rim: "#ffe08a", side: 1 });
  mount("s8", { bg: "trassa5km", farBlur: 5, mid: H.mid, lights: H.lights + TS_L,
    bubbles: [{ id: "p2", p: "pd", html: "Взял Хёндай: один хозяин, ниже рынка.<br><em>Месяц — ни одной поломки.</em>", fs: 38 }] }, { x: 540, y: 1000, s: 1.02 }); }
// 9. месяц без вызовов
mount("s9", { bg: "kabinaevak", mid: V("vf", 360, 1960, 1250, { look: "flat" }, { armL: -40, armR: -40 }, { rim: "#ffe08a", side: 1, z: 7 }) + KDASH(360) + RADIO(780, 1150, "rd2").replace('stroke="#ffd23f" stroke-width="7"', 'stroke="#ffd23f" stroke-width="7" opacity="0"') + TALLY(600, 300, "tl3", 0), lights: KB_L,
  bubbles: [{ id: "v4", p: "vf", html: "Месяц без вызовов.<br><em>Оху*ть. Пойду в такси.</em>", fs: 42 }] }, CAB_SH);
// 10. Хёндай едет мимо эвакуатора
mount("s10", { bg: "trassa5km", mid: grp("c10", car(HYC, 180, 1680, 760, { z: 6, sheen: .5 }), 6) + TOWTRUCK(20, 1300, 520, "tt3", 3), lights: TS_L }, { x: 540, y: 1150, s: 1.04 });
// 11. карточка бота
mount("s11", { bg: "trassa5km", over: CTA71.replace('<div style="position:absolute;', '<div id="cta" style="opacity:0;position:absolute;'), lights: TS_L }, { x: 540, y: 1000, s: .98 });

$("#end h2").innerHTML = E.end;

window.build = R => {
  const tl = R.tl;
  const { pop } = common(R, { shake: 0 });
  for (const el of Object.values(SC)) {
    el.sheens = [...el.querySelectorAll(".sheen")];
    el.glows = [...el.querySelectorAll(".lights .glow")].map(g => ({ g, o: +g.style.opacity }));
  }
  const talk = (lv, f) => lv > .28 && !(lv < .55 && f % 3 === 2);
  const MOOD = { zpip: "o", pa: "o", pb: "o", vd: "o", vf: "flat", va: "flat" };
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
    // мигалки эвакуаторов мигают, рация «шипит» волнами
    for (const id of ["ttb", "tt2b", "tt3b"]) { const e = document.getElementById(id); if (e) e.style.opacity = (Math.floor(t * 4) % 2 ? .35 : 1); }
    const w = document.getElementById("rdw"); if (w) w.style.opacity = (.4 + .6 * Math.abs(Math.sin(t * 6))).toFixed(2);
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

  // 1. обложка: плашка видна с первого кадра и гаснет к 1,6 с; карточка бота — с кадра 0
  gsap.set(SC.s1, { opacity: 1 }); SC.s1.style.display = "";
  gsap.set("#cnt", { opacity: 0 });
  tl.set(SC.s1, { opacity: 1 }, 0); tl.to("#title", { opacity: 0, y: -50, duration: .25 }, 1.6);
  move("s1", { s: 1.06, y: 1000 }, 0, en.l0 + .3, "none");
  tl.fromTo("#hcc", { scale: 1 }, { scale: 1.06, duration: .15, yoyo: true, repeat: 1, ease: "power2.out", immediateRender: false }, 2.0); R.sfx("ping", 2.0, .6);
  // 2. кабина: рация, кружок с Жорой
  const SW2 = st.z0 - .35; swap("s1", "s2", SW2); move("s2", { s: 1.12 }, SW2, en.v0 - SW2 + .3, "none");
  tl.fromTo("#pip1", { scale: 0 }, { scale: 1, duration: .3, ease: "back.out(2)", immediateRender: true }, st.z0 - .15); R.sfx("bleep", st.z0 - .15, .15);
  bub("z0", st.v0 - .1); bub("v0", st.l1 - .2);
  // 3. 5 км: «пятнашка» встаёт, «БАХ!»
  const SW3 = st.l1 - .25; swap("s2", "s3", SW3); move("s3", { s: 1.1 }, SW3, en.p0 - SW3 + .4, "none");
  tl.fromTo("#c3", { x: -900 }, { x: 0, duration: 1.3, ease: "power2.out", immediateRender: false }, SW3 + .1);
  const BG = Wd("p0", "стрел", .7);
  tl.fromTo("#bang", { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: .2, ease: "back.out(3)", immediateRender: true, transformOrigin: "70% 60%" }, BG)
    .fromTo(SC.s3, { x: -12 }, { x: 0, duration: .3, ease: "elastic.out(1,.3)", immediateRender: false }, BG); R.sfx("clack", BG, 1);
  bub("p0", st.v1 - .2);
  // 4. погрузка: «пятнашка» въезжает на платформу
  const SW4 = st.v1 - .3; swap("s3", "s4", SW4); move("s4", { s: 1.08 }, SW4, en.v1 - SW4 + .5, "none"); bub("v1", st.p1 - .2);
  const LD = SW4 + .5, LDD = Math.max(1.4, en.v1 - LD - .1);   // погрузка — с начала реплики, к её концу машина на платформе
  tl.fromTo("#ld", { x: 520, y: 200, rotation: 0 }, { x: 0, y: 0, duration: LDD, ease: "power2.inOut", immediateRender: true }, LD)
    .to("#ld", { rotation: -5, duration: LDD / 4, yoyo: true, repeat: 1, ease: "sine.inOut", transformOrigin: "40% 80%" }, LD + LDD * .35);
  R.sfx("whoosh", LD + .2, .5);
  // 5. «гарантия — это я»
  const SW5 = st.p1 - .3; swap("s4", "s5", SW5); move("s5", { s: 1.1 }, SW5, en.v2 - SW5 + .4, "none"); bub("p1", st.v2 - .1); bub("v2", st.l2 - .2);
  // 6. ночь: палочки дорисовываются до семи
  cut("s5", "s6", st.l2 - .2); move("s6", { s: 1.14, y: 960 }, st.l2 - .2, en.l2 - st.l2 + .6, "none");
  const T7 = Wd("l2", "сем", .5);
  [3, 4, 5, 6].forEach((k, j) => { const at = st.l2 + .4 + j * (T7 - st.l2 - .4) / 4;
    tl.fromTo(`#tl2m${k}`, { opacity: 0 }, { opacity: 1, duration: .08, immediateRender: true }, at).set("#tl2c", { textContent: String(k + 1) }, at); R.sfx("tick", at, .5); });
  tl.fromTo("#tl2c", { scale: 1 }, { scale: 1.5, duration: .2, yoyo: true, repeat: 1, ease: "power2.out", immediateRender: false }, T7);
  // 7. дача и Гелик
  const SW7 = st.v3 - .3; swap("s6", "s7", SW7); move("s7", { s: 1.1 }, SW7, en.z1 - SW7 + .4, "none");
  tl.fromTo("#pip2", { scale: 0 }, { scale: 1, duration: .3, ease: "back.out(2)", immediateRender: true }, st.z1 - .2);
  bub("v3", st.z1 - .1); bub("z1", st.l3 - .2);
  // 8. бот: Хёндай
  const SW8 = st.l3 - .25; swap("s7", "s8", SW8); move("s8", { s: 1.08 }, SW8, en.p2 - SW8 + .4, "none");
  tl.fromTo("#hcc2", { scale: 1 }, { scale: 1.07, duration: .15, yoyo: true, repeat: 1, ease: "power2.out", immediateRender: false }, Wd("p2", "хен", .15)); R.sfx("ping", Wd("p2", "хен", .15), .8);
  bub("p2", st.v4 - .2);
  // 9. месяц без вызовов
  const SW9 = st.v4 - .3; swap("s8", "s9", SW9); move("s9", { s: 1.14 }, SW9, en.v4 - SW9 + .5, "none"); bub("v4", st.l4 - .1);
  // 10–11. финальная фраза Лиса: Хёндай едет мимо эвакуатора → карточка
  const SW10 = st.l4 - .2, SW11 = Math.min(st.l4 + 2.2, en.l4 - 2.5);
  swap("s9", "s10", SW10); move("s10", { s: 1.08 }, SW10, SW11 - SW10 + .5, "none");
  tl.fromTo("#c10", { x: 420 }, { x: -260, duration: SW11 - SW10 + .4, ease: "none", immediateRender: false }, SW10);
  swap("s10", "s11", SW11); tl.to("#tag", { opacity: 0, duration: .2 }, SW11);
  tl.fromTo("#cta", { opacity: 0, y: 80, scale: .9 }, { opacity: 1, y: 0, scale: 1, duration: .4, ease: "back.out(1.6)", immediateRender: false }, SW11 + .6);
  ending(R, en.l4 + .3);
};

// ── ep71b «Архив»: быстрая уникализация — меняется только заставка ──
$("#title .a").textContent = "ВИТЯ:"; $("#title .a").style.cssText = "font-size:110px;background:#2f6db5;color:#fbfaf3";
$("#title .b").textContent = "ГАРАНТИЯ — ЭТО Я"; $("#title .b").style.cssText = "font-size:60px;background:#fbfaf3;color:#2f6db5";
const ORIG = [...document.querySelectorAll("#lbx .lbt, #lbx .lbb")].map(e => e.textContent), HEADT = 2.4;
{ const L = document.querySelector("#lbx"); if (L) { const a = L.querySelector(".lbt"), b = L.querySelector(".lbb");   // кинорамка вместо плашки (ep56)
  a.textContent = "ВИТЯ:"; b.textContent = "ГАРАНТИЯ — ЭТО Я"; a.style.background = b.style.background = "#2f6db5"; a.style.color = b.style.color = "#fbfaf3"; } }
{ const K = document.querySelector("#ballc"); if (K) { const orig = K.innerHTML, col = K.style.color;   // надпись над хрустальным шаром (ep58)
  K.innerHTML = "ВИТЯ:"; K.style.color = "#2f6db5";
  const B = window.build; window.build = R => { B(R); R.tl.to(K, { opacity: 0, duration: .15 }, HEADT - .6);
    R.tl.set(K, { innerHTML: orig, color: col }, HEADT - .45); R.tl.to(K, { opacity: 1, duration: .15 }, HEADT - .4); }; } }
{ const K = document.querySelector("#skc"); if (K) { const [a, b] = K.children, orig = [a.textContent, b.textContent], bg = K.style.background, col = K.style.color;   // подпись судебного рисунка (ep57)
  a.textContent = "ВИТЯ:"; b.textContent = "ГАРАНТИЯ — ЭТО Я"; K.style.background = "#2f6db5"; K.style.color = "#fbfaf3";
  const B = window.build; window.build = R => { B(R); R.tl.to(K, { opacity: 0, duration: .15 }, HEADT - .6);
    R.tl.set(a, { textContent: orig[0] }, HEADT - .45).set(b, { textContent: orig[1] }, HEADT - .45).set(K, { background: bg, color: col }, HEADT - .45);
    R.tl.to(K, { opacity: 1, duration: .15 }, HEADT - .4); }; } }
{ const L = document.querySelector("#lbx"); if (L) { const B = window.build; window.build = R => { B(R);   // до склейки с основным видео (HEAD) рамка возвращается к исходной
  const bars = [L.querySelector(".lbt"), L.querySelector(".lbb")], col = ["#fff", "#ffd23f"];
  R.tl.to(bars, { opacity: 0, duration: .15 }, HEADT - .6);
  bars.forEach((el, i) => R.tl.set(el, { textContent: ORIG[i], background: "#000", color: col[i] }, HEADT - .45));
  R.tl.to(bars, { opacity: 1, duration: .15 }, HEADT - .4); }; } }
