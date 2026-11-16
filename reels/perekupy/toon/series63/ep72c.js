// «ШИНОМОНТАЖ: ПЕРВЫЙ СНЕГ» (ep72, киношный формат ../cine.js, отдельный ролик, с матом — владелец 15.11; в облачках — со звёздочками).
// ОБЛОЖКА: Настя с ботом (Lexus NX −10%) + плашка «ШИНОМОНТАЖ: / ПЕРВЫЙ СНЕГ» → очередь до горизонта (талон №48) → «резина новая» → «ей лет пятнадцать»
// → четыре разные шины (карточки) → «выставка» → протектор 0 мм → Жора: «продаём!» → «в конец очереди» (№112) → бот: Лексус → «первая нормальная за сезон» → финал Лиса.
$("#title .a").textContent = E.rubric; $("#title .b").textContent = E.subtitle; $("#title .a").style.fontSize = "76px"; $("#tag span").textContent = "шиномонтаж";
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
const K = (p, x, foot, h, o = {}, pose = {}, extra = {}) => ch("perekup", spk(p, "kol"), x, foot, h, { ...KOL, ...o }, pose, extra);
const N = (p, x, foot, h, pose = {}, extra = {}) => NSC(ch("vika", spk(p, "nas"), x, foot, h, null, pose, extra));
const PIP = (inner, id, ring = "#ffd23f", left = 380, top = 1560, bgc = "#5a6070") => `<div id="${id}" class="grp" style="position:absolute;left:${left}px;top:${top}px;width:320px;height:320px;border-radius:50%;overflow:hidden;border:9px solid ${ring};z-index:45;background:${bgc};box-shadow:0 10px 30px #0008">${inner}</div>`;
const HANDTIRE = (x, y, id = "ht", z = 12) => `<div id="${id}" style="position:absolute;left:${x}px;top:${y}px;z-index:${z}">${TIREPIC("summer", 300)}</div>`;
const SM_L = glow(540, 700, 380, "#ffffff", .25);
const BX_L = glow(800, 410, 260, "#e8eef4", .35);
const OC_L = glow(540, 760, 380, "#ffd27a", .25);

// 1. обложка: Настя с ботом, снег
{ const H = HOLDPHONE("vika", spk("np", "nas"), 540, 2090, 1680, null, LXCARD(), { rim: "#ffffff", side: 1 });
  mount("s1", { bg: "shinomontazh", farBlur: 8, mid: NSC(H.mid), over: SNOW(50, "sn1"), lights: H.lights + SM_L }, { x: 540, y: 960, s: 1 }); }
// 2. очередь до горизонта, талон №48
mount("s2", { bg: "ochered", over: SNOW(70, "sn2") + TICKET(80, 1420, 48), lights: OC_L }, { x: 540, y: 1100, s: 1.04 });
// 3. «резина новая»
mount("s3", { bg: "shinomontazh", mid: car(PRW, 200, 1620, 760, { z: 5, sheen: .4 }) + K("ka", 160, 1880, 840, {}, { armR: -60 }, { rim: "#ffffff", side: 1, z: 7 }) + N("na", 900, 1880, 820, { armL: 50 }, { rim: "#ffffff", side: -1, z: 7 }), over: SNOW(50, "sn3"), lights: SM_L,
  bubbles: [{ id: "k0", p: "ka", html: "Следующий!<br><em>Девушка, что у вас?</em>", fs: 38 }, { id: "n0", p: "na", html: "Купила у Жоры.<br><em>Сказал — резина новая.</em>", fs: 38 }] }, { x: 540, y: 1150, s: 1.04 });
// 4. «ей лет пятнадцать»
mount("s4", { bg: "shinobox", farBlur: 3, mid: K("kb", 420, 1900, 980, {}, { armR: -100 }, { rim: "#e8eef4", side: 1, z: 7 }) + HANDTIRE(560, 1000), lights: BX_L,
  bubbles: [{ id: "k1", p: "kb", html: "Новая, бл*дь.<br><em>Ей лет пятнадцать.</em>", fs: 46 }] }, { x: 540, y: 1150, s: 1.06 });
// 5. четыре разные шины, Колян в кружке
mount("s5", { bg: "shinobox", farBlur: 10, mid: TIRES4(380) + PIP(K("kpip", 160, 800, 900, { look: "o" }, {}, { noShadow: 1 }), "pip1") }, { x: 540, y: 960, s: 1 });
// 6. «выставка» → «подешевле?»
mount("s6", { bg: "shinobox", farBlur: 2, mid: K("kc", 300, 1880, 900, {}, { armL: 30, armR: -120 }, { rim: "#e8eef4", side: 1, z: 7 }) + N("nb", 820, 1880, 840, { armL: 40 }, { rim: "#e8eef4", side: -1, z: 7 }), lights: BX_L,
  bubbles: [{ id: "k2", p: "kc", html: "Ё* твою мать,<br><em>это не машина — выставка.</em>", fs: 38 }, { id: "n1", p: "nb", html: "А можно<br><em>подешевле?</em>", fs: 42 }] }, { x: 540, y: 1150, s: 1.04 });
// 7. протектор 0 мм
mount("s7", { bg: "shinobox", farBlur: 3, mid: K("kd", 330, 1900, 980, {}, { armR: -100 }, { rim: "#e8eef4", side: 1, z: 7 }) + TREAD(560, 1050), lights: BX_L,
  bubbles: [{ id: "k3", p: "kd", html: "Протектор — ноль.<br><em>Подешевле — это пешком.</em>", fs: 42 }] }, { x: 540, y: 1150, s: 1.06 });
// 8. Жора: «продаём!» → «в конец очереди»
mount("s8", { bg: "shinomontazh", farBlur: 2, mid: K("ke", 280, 1880, 880, {}, { armR: -150 }, { rim: "#ffffff", side: 1, z: 7 }) + Z("za", 820, 1880, 860, { look: "grin" }, { armL: 60 }, { rim: "#ffffff", side: -1, z: 7 }), over: SNOW(50, "sn4") + TICKET(640, 1420, 112, "tk2"), lights: SM_L,
  bubbles: [{ id: "z0", p: "za", html: "Колян, привет!<br><em>Резину не меняем — продаём!</em>", fs: 36 }, { id: "k4", p: "ke", html: "Жора, иди на**й.<br><em>В конец очереди.</em>", fs: 40 }] }, { x: 540, y: 1150, s: 1.04 });
// 9. бот: Лексус
{ const H = HOLDPHONE("vika", spk("nf", "nas"), 540, 2000, 1400, null, LXCARD("lcc2"), { rim: "#ffffff", side: 1 });
  mount("s9", { bg: "shinomontazh", farBlur: 5, mid: NSC(H.mid), over: SNOW(40, "sn5"), lights: H.lights + SM_L,
    bubbles: [{ id: "n2", p: "nf", html: "Взяла Лексус: один хозяин,<br><em>ниже рынка. И зимняя резина!</em>", fs: 36 }] }, { x: 540, y: 1000, s: 1.02 }); }
// 10. «первая нормальная машина за сезон»
mount("s10", { bg: "shinomontazh", mid: car(LXN, 260, 1640, 640, { z: 5, sheen: .5 }) + K("kf", 170, 1880, 840, { look: "o" }, { armL: 30 }, { rim: "#ffffff", side: 1, z: 7 }) + N("nc", 920, 1880, 800, {}, { rim: "#ffffff", side: -1, z: 7 }), over: SNOW(40, "sn6"), lights: SM_L,
  bubbles: [{ id: "k5", p: "kf", html: "Оху*ть. Первая нормальная<br><em>машина за сезон.</em>", fs: 40 }] }, { x: 540, y: 1150, s: 1.04 });
// 11. карточка бота
mount("s11", { bg: "shinomontazh", over: CTA72.replace('<div style="position:absolute;', '<div id="cta" style="opacity:0;position:absolute;') + SNOW(40, "sn7"), lights: SM_L }, { x: 540, y: 1000, s: .98 });

$("#end h2").innerHTML = E.end;

window.build = R => {
  const tl = R.tl;
  const { pop } = common(R, { shake: 0 });
  for (const el of Object.values(SC)) {
    el.sheens = [...el.querySelectorAll(".sheen")];
    el.glows = [...el.querySelectorAll(".lights .glow")].map(g => ({ g, o: +g.style.opacity }));
    el.snow = [...el.querySelectorAll(".snowf")].map(f => ({ f, x: parseFloat(f.style.left), y: parseFloat(f.style.top), k: +f.dataset.k }));
  }
  const talk = (lv, f) => lv > .28 && !(lv < .55 && f % 3 === 2);
  const MOOD = { kpip: "o", kf: "o", kb: "flat", kc: "flat", kd: "flat", ke: "flat" };
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
      // снег: падает и чуть качается
      el.snow.forEach(({ f: s, x, y, k: n }) => { s.style.transform = `translate(${(Math.sin(t * 1.3 + n) * 18).toFixed(1)}px, ${(((y + t * (90 + (n % 5) * 25)) % 1980) - y).toFixed(1)}px)`; });
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
  const popIn = (sel, at, s = 1) => { tl.fromTo(sel, { scale: 0, opacity: 0 }, { scale: s, opacity: 1, duration: .3, ease: "back.out(2.2)", immediateRender: true }, at); R.sfx("ping", at, .5); };

  // 1. обложка: плашка видна с первого кадра и гаснет к 1,6 с; карточка бота — с кадра 0
  gsap.set(SC.s1, { opacity: 1 }); SC.s1.style.display = "";
  gsap.set("#cnt", { opacity: 0 });
  tl.set(SC.s1, { opacity: 1 }, 0); tl.to("#title", { opacity: 0, y: -50, duration: .25 }, 1.6);
  move("s1", { s: 1.06, y: 1000 }, 0, 3, "none");
  tl.fromTo("#lcc", { scale: 1 }, { scale: 1.06, duration: .15, yoyo: true, repeat: 1, ease: "power2.out", immediateRender: false }, 1.9); R.sfx("ping", 1.9, .6);
  // 2. очередь до горизонта
  const SW2 = Math.max(2.3, Wd("l0", "очеред", .6) - .3); swap("s1", "s2", SW2); move("s2", { s: 1.2, y: 900 }, SW2, st.k0 - SW2 + .2, "power1.inOut");
  popIn("#tk", SW2 + .6);
  // 3. «резина новая»
  const SW3 = st.k0 - .3; swap("s2", "s3", SW3); move("s3", { s: 1.1 }, SW3, en.n0 - SW3 + .3, "none"); bub("k0", st.n0 - .1); bub("n0", st.k1 - .2);
  // 4. «ей лет пятнадцать»
  cut("s3", "s4", st.k1 - .2); move("s4", { s: 1.14 }, st.k1 - .2, en.k1 - st.k1 + .4, "none"); bub("k1", st.l1 - .2);
  tl.fromTo("#ht", { rotation: -20 }, { rotation: 0, duration: .4, ease: "back.out(2)", immediateRender: false }, st.k1);
  // 5. четыре шины по словам Коляна
  const SW5 = st.l1 - .25; swap("s4", "s5", SW5); move("s5", { s: 1.04 }, SW5, Wd("k2", "еб", .5) - SW5, "none");
  ["летн", "зимн", "шип", "докат"].forEach((w, i) => popIn(`#t4${i}`, Wd("k2", w, .1 + i * .12) - .05));
  tl.fromTo("#pip1", { scale: 0 }, { scale: 1, duration: .3, ease: "back.out(2)", immediateRender: true }, st.k2 - .15);
  // 6. «выставка» → «подешевле?»
  const SW6 = Wd("k2", "еб", .5) - .2; cut("s5", "s6", SW6); move("s6", { s: 1.1 }, SW6, en.n1 - SW6 + .4, "none");
  pop("#b_k2", SW6, st.n1 - .1); bub("n1", st.k3 - .2);
  // 7. протектор: 8 → 3 → 0 мм
  cut("s6", "s7", st.k3 - .2); move("s7", { s: 1.12 }, st.k3 - .2, en.k3 - st.k3 + .4, "none"); bub("k3", st.l2 - .2);
  const T0 = Wd("k3", "ноль", .3);
  tl.set("#tgv", { textContent: "8 мм", color: "#2f8a4a" }, st.k3 - .2).set("#tgv", { textContent: "3 мм", color: "#c08a20" }, (st.k3 + T0) / 2).set("#tgv", { textContent: "0 мм", color: "#c0392b" }, T0);
  tl.fromTo("#tg", { scale: 1 }, { scale: 1.1, duration: .15, yoyo: true, repeat: 1, ease: "power2.out", immediateRender: false }, T0); R.sfx("bleep", T0, .2);
  // 8. Жора → «в конец очереди» (талон №112)
  const SW8 = st.l2 - .3; swap("s7", "s8", SW8); move("s8", { s: 1.08 }, SW8, en.k4 - SW8 + .4, "none"); bub("z0", st.k4 - .1); bub("k4", st.l3 - .2);
  gsap.set("#tk2", { opacity: 0 }); popIn("#tk2", Wd("k4", "конец", .7));
  // 9. бот: Лексус
  const SW9 = st.l3 - .25; swap("s8", "s9", SW9); move("s9", { s: 1.08 }, SW9, en.n2 - SW9 + .4, "none");
  tl.fromTo("#lcc2", { scale: 1 }, { scale: 1.07, duration: .15, yoyo: true, repeat: 1, ease: "power2.out", immediateRender: false }, Wd("n2", "лекс", .1)); R.sfx("ping", Wd("n2", "лекс", .1), .8);
  bub("n2", st.k5 - .2);
  // 10–11. «первая нормальная за сезон» → финальная фраза Лиса → карточка
  const SW10 = st.k5 - .3, SW11 = Math.min(st.l4 + 2.2, en.l4 - 2.5);
  swap("s9", "s10", SW10); move("s10", { s: 1.1 }, SW10, SW11 - SW10 + .5, "none"); bub("k5", st.l4 + .4);
  swap("s10", "s11", SW11); tl.to("#tag", { opacity: 0, duration: .2 }, SW11);
  tl.fromTo("#cta", { opacity: 0, y: 80, scale: .9 }, { opacity: 1, y: 0, scale: 1, duration: .4, ease: "back.out(1.6)", immediateRender: false }, SW11 + .6);
  ending(R, en.l4 + .3);
};

// ── ep72c «Неон»: быстрая уникализация — меняется только заставка ──
$("#title .a").textContent = "ЧЕТЫРЕ ШИНЫ:"; $("#title .a").style.cssText = "font-size:110px;background:#ffd23f;color:#151515";
$("#title .b").textContent = "И ВСЕ РАЗНЫЕ"; $("#title .b").style.cssText = "font-size:60px;background:#151515;color:#ffd23f";
const ORIG = [...document.querySelectorAll("#lbx .lbt, #lbx .lbb")].map(e => e.textContent), HEADT = 2.4;
{ const L = document.querySelector("#lbx"); if (L) { const a = L.querySelector(".lbt"), b = L.querySelector(".lbb");   // кинорамка вместо плашки (ep56)
  a.textContent = "ЧЕТЫРЕ ШИНЫ:"; b.textContent = "И ВСЕ РАЗНЫЕ"; a.style.background = b.style.background = "#ffd23f"; a.style.color = b.style.color = "#151515"; } }
{ const K = document.querySelector("#ballc"); if (K) { const orig = K.innerHTML, col = K.style.color;   // надпись над хрустальным шаром (ep58)
  K.innerHTML = "ЧЕТЫРЕ ШИНЫ:"; K.style.color = "#ffd23f";
  const B = window.build; window.build = R => { B(R); R.tl.to(K, { opacity: 0, duration: .15 }, HEADT - .6);
    R.tl.set(K, { innerHTML: orig, color: col }, HEADT - .45); R.tl.to(K, { opacity: 1, duration: .15 }, HEADT - .4); }; } }
{ const K = document.querySelector("#skc"); if (K) { const [a, b] = K.children, orig = [a.textContent, b.textContent], bg = K.style.background, col = K.style.color;   // подпись судебного рисунка (ep57)
  a.textContent = "ЧЕТЫРЕ ШИНЫ:"; b.textContent = "И ВСЕ РАЗНЫЕ"; K.style.background = "#ffd23f"; K.style.color = "#151515";
  const B = window.build; window.build = R => { B(R); R.tl.to(K, { opacity: 0, duration: .15 }, HEADT - .6);
    R.tl.set(a, { textContent: orig[0] }, HEADT - .45).set(b, { textContent: orig[1] }, HEADT - .45).set(K, { background: bg, color: col }, HEADT - .45);
    R.tl.to(K, { opacity: 1, duration: .15 }, HEADT - .4); }; } }
{ const L = document.querySelector("#lbx"); if (L) { const B = window.build; window.build = R => { B(R);   // до склейки с основным видео (HEAD) рамка возвращается к исходной
  const bars = [L.querySelector(".lbt"), L.querySelector(".lbb")], col = ["#fff", "#ffd23f"];
  R.tl.to(bars, { opacity: 0, duration: .15 }, HEADT - .6);
  bars.forEach((el, i) => R.tl.set(el, { textContent: ORIG[i], background: "#000", color: col[i] }, HEADT - .45));
  R.tl.to(bars, { opacity: 1, duration: .15 }, HEADT - .4); }; } }
