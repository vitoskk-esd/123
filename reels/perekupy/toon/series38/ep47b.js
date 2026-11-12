// «ТОЛЯН: СО СТА ТЫСЯЧ · 10» — «Жора просит о помощи». Первая серия в «киношном» формате (../cine.js): каждая сцена — слои глубины
// (дальний фон, герои, передний план, свет поверх грейда), камера — план {x, y, s, r}, который двигается по таймлайну; параллакс, расфокус,
// дождь, блики, пылинки — в хуке на каждом кадре. Сцены и реквизит — те же, что в утверждённой раскадровке board.html (props.js).
// Капитал 570 000 → 640 000. Приёмы: звонок в час ночи; расчёт пальцем по запотевшему стеклу; гонка на рассвете по уведомлению бота.
$("#title .a").textContent = E.rubric; $("#title .b").textContent = E.subtitle; $("#tag span").textContent = "жора просит о помощи";
document.querySelector("#cam > svg#bg")?.remove();
const W = (line, pre, n = 0) => {
  const norm = s => s.toLowerCase().replace(/ё/g, "е").replace(/[^а-я0-9a-z]/g, "");
  const hits = (TT.words[line] || []).filter(w => w[1] >= st[line] - .05 && w[2] <= en[line] + .05 && norm(w[0]).startsWith(norm(pre)));
  if (!hits[n]) console.warn("W miss", line, pre);
  return hits[n] ? hits[n][1] : st[line];
};
const G = (id, html, z = 5) => `<div class="grp" id="${id}" style="left:0;top:0;width:1080px;height:1920px;z-index:${z}">${html}</div>`;
const root = $("#scene"), SC = {};
const mount = (name, def, sh) => (SC[name] = C.mount(root, def, sh));
const SPK = {};            // префикс героя → голос (для губ)
const spk = (p, v) => (SPK[p] = v, p);

// ---------- 1. общага ночью: звонок
mount("s1", { bg: "obshaga", grade: "night",
  mid: ch("tolyan", spk("ta", "tolyan"), 330, 1560, 720, null, { phone: true, head: -6 }, { rim: "#9fc3ff", side: 1 }),
  lights: beam([[560, 860], [980, 860], [1080, 1800], [380, 1800]], "#9fb6ff", .35, "180deg") + `<div id="ph1">${glow(420, 1060, 170, "#7fd0ff", .6)}</div>` + glow(760, 600, 260, "#6f8cff", .35),
  fg: `<div class="prop" style="left:760px;top:1500px;width:420px;height:520px"><svg viewBox="0 0 420 520"><path d="M40 0 h320 q20 0 20 20 v260 h-360 v-260 q0 -20 20 -20 z" fill="#5a3a22" stroke="#151515" stroke-width="12"/><path d="M60 40 q120 60 300 -10 v200 h-300 z" fill="#2f6db5"/></svg></div>`,
  bubbles: [{ id: "t1", p: "ta", html: "Жора?!<br><em>Ты время видел?</em>" }, { id: "z1", at: [430, 880], html: "📞 Студент… <em>выручай.</em><br>Я на площадке.", fs: 44 }] }, { x: 540, y: 960, s: 1 });

// ---------- 2. площадка под дождём
const SOL = (sheen, dim) => car("hyundai/hyundai.png", 360, 1720, 820, { z: 5, refl: 1, sheen, dim });
mount("s2", { bg: "zhlot", grade: "rain", fx: C.rain(170, 11) + C.lens(4, 6),
  mid: LOTROW(1190, [], 1) + SOL(.62, .72) + C.tag(680, 1490, "950 000", "SOLARIS · 2017", -4, 7)
    + `<div class="hand wr" id="d94" style="left:610px;top:1580px;z-index:8;font-size:40px;color:#ff3b30;transform:rotate(-6deg)">стоит 94-й день</div>`
    + ch("perekup", spk("zb", "zhora"), 230, 1700, 760, { ...ZHORA, look: "o" }, { armR: -35, head: 7 }, { rim: "#ffc46a", side: 1 }) + UMB(230, 1700, 760, -35),
  lights: BULBS(), bubbles: [{ id: "z2", at: [330, 690], html: "Шесть машин стоят<br>по три месяца.<br><em>Никто не берёт!</em>", fs: 42 }] }, { x: 540, y: 1100, s: 1.04 });

// ---------- 3. пальцем по стеклу
mount("s3", { bg: "zhlot", grade: "rain", fx: C.rain(170, 12) + C.lens(9, 5),
  mid: LOTROW(1190, [], 1) + SOL(.5, .72)
    + ch("tolyan", spk("tc", "tolyan"), 520, 1760, 760, null, { armR: -70, head: 4 }, { rim: "#ffc46a", side: -1, z: 7 })
    + ch("perekup", spk("zc", "zhora"), 170, 1700, 740, { ...ZHORA, look: "o" }, { armR: -35 }, { rim: "#ffc46a", side: 1 }) + UMB(170, 1700, 740, -35, 540),
  lights: BULBS(), bubbles: [{ id: "t2", p: "tc", html: "Жора, ты берёшь<br>у перекупов.<br><em>Дороже рынка!</em>", fs: 42 }] }, { x: 470, y: 1180, s: 1.18 });
mount("s3w", { grade: "rain", fx: C.lens(21, 9), far: WINDSHIELD(), farBlur: 0,
  mid: `<div class="hand wr" id="hw0" style="left:150px;top:560px;font-size:150px;color:rgba(20,26,48,.85);transform:rotate(-5deg)">купил 900</div>`
    + `<div class="hand wr" id="hw1" style="left:170px;top:760px;font-size:150px;color:rgba(20,26,48,.85);transform:rotate(-3deg)">рынок 850</div>`
    + `<div class="hand wr" id="hw2" style="left:150px;top:990px;font-size:190px;color:#ff3b30;transform:rotate(-4deg)">−50 × 6</div>`
    + `<svg style="left:110px;top:950px;width:860px;height:330px;overflow:visible" viewBox="0 0 860 330"><path id="hwc" d="M40 170 Q30 30 420 26 Q820 30 820 170 Q810 310 400 300 Q60 300 70 150" fill="none" stroke="#ff3b30" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/></svg>`
    + `<div id="fing" style="left:0;top:0;width:1px;height:1px;z-index:22">${FINGER(760, 1140)}</div>` }, { x: 540, y: 960, s: 1 });

// ---------- 4. вагончик: сделка (кадр через плечо ↔ Жора крупно)
mount("s4", { bg: "vagonchik", grade: "warm",
  mid: ch("tolyan", spk("td", "tolyan"), 700, 1600, 780, null, { armL: 25, head: -4 }, { rim: "#ff9a3c", side: -1 }),
  lights: `<div id="heat4">${glow(140, 1080, 260, "#ff7a1a", .7)}</div>` + glow(540, 140, 300, "#f4f6e8", .45) + beam([[340, 150], [740, 150], [1000, 1700], [100, 1700]], "#fff6dc", .16) + glow(920, 930, 120, "#ffd27a", .25),
  fg: OTS_ZHORA(-140, 1180, 640),
  bubbles: [{ id: "t3", p: "td", html: "Помогу.<br><em>Десять тысяч<br>с каждой проданной.</em>", fs: 42 }, { id: "t4", p: "td", html: "Десять.<br><em>Или стой дальше<br>под дождём.</em>", fs: 42 }] }, { x: 600, y: 1150, s: 1.15 });
mount("s4z", { bg: "vagonchik", grade: "warm",
  mid: ch("perekup", spk("zd", "zhora"), 400, 1640, 800, { ...ZHORA, look: "angry" }, { armR: -20, head: 8 }, { rim: "#ff9a3c", side: 1 }),
  lights: glow(140, 1080, 260, "#ff7a1a", .75) + glow(540, 140, 300, "#f4f6e8", .4),
  bubbles: [{ id: "z3", p: "zd", html: "Пять!", fs: 70 }, { id: "z4", p: "zd", html: "Ладно…<br><em>десять.</em>", fs: 56 }] }, { x: 420, y: 1100, s: 2.05, r: -6 });

// ---------- 5. та же площадка утром: цены по рынку; Толян держит телефон с ботом
mount("s5", { bg: "zhlotday", grade: "day",
  mid: LOTROW(1190) + SOL(.35) + G("tg5o", C.tag(680, 1490, "950 000", "SOLARIS · 2017", -4, 7), 7) + G("tg5n", C.tag(680, 1490, "850 000", "SOLARIS · 2017", -4, 8)
      + `<div class="hand wr" id="tg5h" style="left:700px;top:1410px;z-index:8;font-size:54px;color:#c0392b;transform:rotate(-6deg)"><s>950 000</s></div>`, 8)
    + ch("tolyan", spk("te", "tolyan"), 300, 1740, 780, null, { armR: -80 }, { rim: "#fff2c0", side: 1 }),
  lights: glow(880, 300, 380, "#fff3c4", .55) + beam([[820, 260], [980, 300], [700, 1800], [200, 1700]], "#fff6d8", .14),
  bubbles: [{ id: "t5", p: "te", html: "Ставим по рынку.<br><em>Не дороже ни на рубль.</em>", fs: 42 }] }, { x: 520, y: 1180, s: 1.12 });
{ const H = HOLDPHONE("tolyan", spk("tf", "tolyan"), 540, 1960, 1680, null, BOTH("Solaris 2017 · вся Россия",
    [["Hyundai Solaris · 2017", "840 000 ₽", "Тверь"], ["Hyundai Solaris · 2017", "860 000 ₽", "Казань"], ["Hyundai Solaris · 2018", "880 000 ₽", "Пермь"]].map((c, k) => `<div id="c5_${k}">${CARD(...c)}</div>`).join("")),
    { rim: "#fff2c0", side: 1, head: -4, id: "ph5" });
  mount("s5p", { bg: "zhlotday", grade: "day", farBlur: 10,
    far: `<div style="left:0;top:0;width:1080px;height:1920px">${LOTROW(1190) + car("hyundai/hyundai.png", 360, 1720, 820, { z: 5, sheen: .35 })}</div>`,
    mid: H.mid, lights: H.lights + glow(880, 300, 380, "#fff3c4", .4) }, { x: 540, y: 960, s: 1 }); }

// ---------- 6. 06:00: уведомление → Мерседес Жоры у калитки, бабушка, фары опоздавших
{ const H = HOLDPHONE("perekup", spk("zf", "zhora"), 540, 1960, 1680, { ...ZHORA, look: "o" }, BOTH("⏰ 06:00", `<div id="n6">${CARD("Lada Granta · 2019 · 15 000 км", "520 000 ₽", "ул. Садовая, 7 · хозяйка", "🔥 −19% к рынку · ⏱ 1 с после публикации")}
    <div style="margin-top:16px;background:#2f6db5;border-radius:22px;padding:16px;text-align:center;font-family:Unbounded;font-weight:900;font-size:30px;color:#fff">📍 Маршрут · 7 мин</div></div>`),
    { rim: "#ffe2a0", side: -1, head: 5, id: "ph6" });
  mount("s6p", { bg: "rassvet", grade: "dawn", farBlur: 10, mid: H.mid, lights: H.lights + glow(700, 720, 420, "#fff2c0", .5),
    fx: `<div class="fx">${C.fog(1050, 200, "#fff2dc", .35)}</div>` }, { x: 540, y: 960, s: 1 }); }
mount("s6", { bg: "rassvet", grade: "dawn", haze: "linear-gradient(transparent 40%, rgba(255,236,200,.35) 52%, transparent 70%)",
  fx: `<div class="fx">${C.fog(980, 180, "#fff2dc", .45)}${C.fog(1500, 220, "#fff2dc", .25)}</div>`,
  mid: car("granta/granta_34.png", 600, 1140, 380, { z: 3, sheen: .4 }) + C.tag(700, 1010, "520 000", "", -3, 4)
    + G("hl6", glow(170, 1040, 46, "#fff6c8", .95) + glow(250, 1042, 42, "#fff6c8", .95) + glow(390, 1030, 30, "#fff6c8", .8) + glow(440, 1031, 28, "#fff6c8", .8), 3)
    + G("w6", car("w124/w124_34.png", -40, 1720, 700, { z: 5, sheen: .55 }), 5)
    + G("zg6", ch("perekup", spk("zg", "zhora"), 760, 1720, 760, { ...ZHORA, look: "o" }, {}, { rim: "#ffe2a0", side: -1 }), 6)
    + ch("perekup", spk("bb", "baba"), 560, 1180, 420, BABA, {}, { rim: "#ffe2a0", side: -1, z: 4 }) + C.motes(80, 700, 900, 900, 30, 8),
  lights: glow(700, 720, 420, "#fff2c0", .6) + glow(980, 1300, 200, "#ffd27a", .25),
  bubbles: [{ id: "b1", p: "bb", html: "Ой, сынок, ты первый!<br><em>Остальные ещё звонят.</em>", fs: 40 },
    { id: "z5", p: "zg", html: "Я первый?!<br><em>Я двадцать лет<br>вторым приезжал!</em>", fs: 42 }] }, { x: 560, y: 1250, s: 1 });

// ---------- 7. ПРОДАНО; Толян крупно — «7 × 10 000»
const SOLD = [-60, 250, 560, 820].map((l, k) => G("sd" + k, C.tag(l + 110, 1070, "ПРОДАНО", "", -8, 4, "#4cd964"), 6)).join("");
mount("s7", { bg: "zhlotday", grade: "day",
  mid: LOTROW(1190) + SOLD + car("granta/granta_34.png", 300, 1560, 520, { z: 4, sheen: .5, refl: 1 }) + C.tag(520, 1360, "640 000", "GRANTA · 2019", -4, 5)
    + ch("perekup", spk("zh7", "zhora"), 230, 1740, 760, { ...ZHORA, look: "grin" }, {}, { rim: "#fff2c0", side: 1 })
    + ch("tolyan", spk("tg", "tolyan"), 840, 1760, 740, null, {}, { rim: "#fff2c0", side: -1, z: 7 }),
  lights: glow(880, 300, 380, "#fff3c4", .55),
  bubbles: [{ id: "z6", p: "zh7", html: "Студент…<br><em>ты мне площадку спас!</em>", fs: 44 }] }, { x: 560, y: 1180, s: 1.06 });
mount("s7t", { bg: "zhlotday", grade: "day",
  mid: LOTROW(1190, [0, 1, 2, 3]) + ch("tolyan", spk("th", "tolyan"), 600, 1760, 740, null, { armR: -60 }, { rim: "#fff2c0", side: -1, z: 7 }),
  over: `<div class="hand wr" id="x7" style="left:60px;top:400px;z-index:62;font-size:130px;color:#ffd23f;-webkit-text-stroke:3px #151515;transform:rotate(-6deg)">7 × 10 000 ₽</div>` }, { x: 600, y: 1260, s: 1.9, r: 2 });

// ---------- 8. закат, итог, крючок, карточка
mount("s8", { bg: "zhlotday", grade: "dawn", over: CTA.replace('<div style="position:absolute;', '<div id="cta8" style="opacity:0;position:absolute;'),
  mid: LOTROW(1190, [0, 1, 2, 3]) + ch("tolyan", spk("ti", "tolyan"), 340, 1760, 740, null, {}, { rim: "#ffc46a", side: 1 })
    + ch("perekup", spk("zi", "zhora"), 760, 1740, 740, { ...ZHORA, look: "grin", item: "phone" }, {}, { rim: "#ffc46a", side: -1 }),
  lights: glow(880, 300, 420, "#ffb36a", .6) }, { x: 540, y: 1180, s: 1.08 });

$(".stage").insertAdjacentHTML("beforeend", `<div id="cnt">💰 <span id="cv">570 000</span> ₽ <em id="cd"></em></div>`);
$("#end h2").innerHTML = E.end;

window.build = R => {
  const tl = R.tl, dummy = { shake: 0 };
  const { pop } = common(R, dummy);
  // кэш анимируемых мелочей каждой сцены
  for (const el of Object.values(SC)) {
    el.rain = [...el.querySelectorAll(".rain i")].map(i => ({ i, y0: parseFloat(i.style.top) }));
    el.sheens = [...el.querySelectorAll(".sheen")];
    el.glows = [...el.querySelectorAll(".lights .glow")].map(g => ({ g, o: +g.style.opacity }));
    el.motes = [...el.querySelectorAll(".mote")];
    el.fogs = [...el.querySelectorAll(".fog")];
  }
  const ARMS = {};   // префикс → [время начала, длительность] подъёма рук
  const talk = (lv, f) => lv > .28 && !(lv < .55 && f % 3 === 2);
  const MOOD = { zb: "o", zc: "o", zd: "flat", zf: "o", zg: "o" };
  R.hooks.push(t => {
    const f = Math.floor(t * 30);
    for (const el of Object.values(SC)) {
      if (!(+el.style.opacity > 0)) continue;
      const k = el.cam.s > 1.6 ? .55 : 1;
      C.apply(el, [(R.noise(t * .6) * 9 + R.noise(t * 1.7 + 40) * 3) * k, (R.noise(t * .5 + 9) * 10 + R.noise(t * 1.9 + 70) * 3) * k, R.noise(t * .4 + 20) * .3 * k]);
      el.rain.forEach(({ i, y0 }) => { const dy = ((y0 + 60 + t * 1700) % 2040) - 60 - y0; i.style.transform = `translate(${(-dy * .21).toFixed(1)}px,${dy.toFixed(1)}px) rotate(12deg)`; });
      el.sheens.forEach((s, j) => { s.style.backgroundPosition = `${(130 - ((t * 14 + j * 45) % 160)).toFixed(1)}% 0`; });
      el.glows.forEach(({ g, o }, j) => { g.style.opacity = (o * (.9 + .1 * R.noise(t * 2.5 + j * 3.1))).toFixed(3); });
      el.motes.forEach((m, j) => { m.style.translate = `${(Math.sin(t * .7 + j) * 24).toFixed(1)}px ${(-((t * 22 + j * 40) % 160)).toFixed(1)}px`; });
      el.fogs.forEach((g, j) => { g.style.translate = `${(Math.sin(t * .25 + j * 2) * 80).toFixed(1)}px 0`; });
    }
    for (const [p, v] of Object.entries(SPK)) {
      if (!document.getElementById(p)) continue;
      const lv = (LIP[v] || [])[f] || 0;
      mouth(p, talk(lv, f) ? "talk" : (MOOD[p] || "grin"));
      const lids = document.getElementById(`${p}-lids`); if (lids) lids.style.transform = `scaleY(${((t + p.charCodeAt(0) * .37) % 3.3) < .12 ? 1 : 0})`;
      if (ARMS[p]) { const [a, d] = ARMS[p], x = Math.max(0, Math.min(1, (t - a) / d)), e = 1 - (1 - x) ** 3;
        const L = document.getElementById(`${p}-armL`), Rr = document.getElementById(`${p}-armR`);
        L.style.transform = `rotate(${150 * e + Math.sin(t * 9) * 6 * e}deg)`; Rr.style.transform = `rotate(${-150 * e - Math.sin(t * 9 + 1) * 6 * e}deg)`; }
    }
    // телефон в общаге «дышит» светом
    $("#ph1").style.opacity = (.85 + .15 * Math.sin(t * 6)).toFixed(3);
  });
  window.MUSIC = { style: "story", bpm: 88, start: 0, drop: st.l4 - .3, end: R.dur - 1.2 };

  // ---- монтаж
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

  // 1. общага: звонок
  show("s1", 0); R.sfx("ring", .5, .5); R.sfx("ring", 1.5, .45);
  tl.to("#title", { opacity: 0, y: -50, duration: .25 }, 1.8);
  tl.to("#cnt", { opacity: 1, duration: .3 }, 2.0);
  move("s1", { x: 470, y: 1000, s: 1.14 }, .2, en.l0, "power1.inOut");
  bub("t1", st.z1 - .15);
  tl.set(cam("s1"), { x: 380, y: 1010, s: 2.25, r: -2 }, st.z1 - .12); R.sfx("tick", st.z1 - .12, .4);
  move("s1", { x: 390, y: 1000, s: 2.4 }, st.z1, en.z1 - st.z1 + .3, "none");
  bub("z1", st.z2 - .45);
  // 2. площадка под дождём: Жора под зонтом → наезд на ценник
  const SW2 = st.z2 - .4; swap("s1", "s2", SW2);
  move("s2", { x: 580 }, SW2, en.z2 - SW2, "none");
  bub("z2", st.l1 - .05);
  move("s2", { x: 760, y: 1560, s: 2.6, r: 3 }, st.l1 - .1, 1.5);
  write("#d94", W("l1", "94") + .1, .7);
  // 3. двухплановый под дождём → вставка: стекло
  const SW3 = st.t2 - .4; swap("s2", "s3", SW3);
  move("s3", { s: 1.24, y: 1160 }, SW3, en.t2 - SW3 + .2, "power1.inOut");
  bub("t2", st.l2 - .15);
  cut("s3", "s3w", st.l2 - .1); move("s3w", { s: 1.07, y: 980 }, st.l2 - .1, en.l2 - st.l2 + .3, "none");
  const fx = (x, y, at, d) => tl.to("#fing", { x, y, duration: d, ease: "power1.inOut" }, at);
  gsap.set("#fing", { x: -380, y: -560 });
  [["#hw0", W("l2", "покуп"), [-500, -560], [-60, -560]], ["#hw1", W("l2", "наценк"), [-480, -360], [-40, -360]], ["#hw2", W("l2", "минус"), [-500, -130], [-60, -130]]]
    .forEach(([sel, at, a, b]) => { write(sel, at, .6); tl.set("#fing", { x: a[0], y: a[1] }, at - .02); fx(b[0], b[1], at, .6); });
  tl.to("#hwc", { strokeDashoffset: 0, duration: .6, ease: "power2.inOut" }, W("l2", "300") - .1); R.sfx("swish", W("l2", "300") - .1, .6);
  fx(160, 40, W("l2", "300") - .1, .6);
  // 4. вагончик: через плечо ↔ Жора крупно
  const SW4 = st.t3 - .4; swap("s3w", "s4", SW4);
  move("s4", { x: 640, s: 1.2 }, SW4, en.t4 - SW4, "none");
  bub("t3", st.z3 - .12);
  cut("s4", "s4z", st.z3 - .1); move("s4z", { s: 2.15 }, st.z3 - .1, .5, "power3.out"); R.punch(cam("s4z"), st.z3, .08);
  bub("z3", st.t4 - .15);
  cut("s4z", "s4", st.t4 - .1); bub("t4", st.z4 - .15);
  cut("s4", "s4z", st.z4 - .1); move("s4z", { r: -2, s: 2.0 }, st.z4 - .1, en.z4 - st.z4 + .4);
  bub("z4", st.t5 - .45);
  // 5. утро на площадке: зачёркивает цену; Толян держит телефон, в боте — три карточки
  const SW5 = st.t5 - .4; swap("s4z", "s5", SW5);
  gsap.set(["#tg5n", "#c5_0", "#c5_1", "#c5_2"], { opacity: 0 }); gsap.set("#tg5n", { transformOrigin: "760px 1520px" });
  move("s5", { x: 600, y: 1260, s: 1.3 }, SW5, en.t5 - SW5, "power1.inOut");
  write("#tg5h", W("t5", "рынк") - .1, .45); slam("#tg5n", W("t5", "рынк") + .35, "clack", 1.5); tl.to("#tg5o", { opacity: 0, duration: .1 }, W("t5", "рынк") + .4);
  bub("t5", st.l3 - .15);
  cut("s5", "s5p", st.l3 - .1); move("s5p", { s: 1.06, y: 1000 }, st.l3 - .1, en.l3 - st.l3, "none");
  [W("l3", "бот"), W("l3", "росс"), W("l3", "840")].forEach((at, k) => { tl.fromTo("#c5_" + k, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: .3, ease: "back.out(1.6)", immediateRender: false }, at + .1); R.sfx("ping", at + .1, .6); });
  // 6. 06:00: уведомление в телефоне Жоры → Мерседес у калитки
  const SW6 = st.l4 - .35; swap("s5p", "s6p", SW6);
  gsap.set("#n6", { opacity: 0 });
  move("s6p", { s: 1.07, y: 1000 }, SW6, 4, "none");
  const N6 = st.l4 + .25; tl.fromTo("#n6", { opacity: 0, y: -60 }, { opacity: 1, y: 0, duration: .3, ease: "back.out(1.8)", immediateRender: false }, N6); R.sfx("ping", N6, .9); R.sfx("ring", N6 + .2, .4);
  tl.fromTo("#ph6", { rotation: -2 }, { rotation: 2, duration: .06, repeat: 7, yoyo: true, ease: "none", immediateRender: false }, N6 + .1).set("#ph6", { rotation: 0 }, N6 + .6);
  const C6 = W("l4", "хозяй") - .25; cut("s6p", "s6", C6);
  gsap.set(["#zg6", "#hl6"], { opacity: 0 });
  tl.fromTo("#w6", { x: -900 }, { x: 0, duration: 1.1, ease: "power3.out", immediateRender: false }, C6); R.sfx("whoosh", C6 + .1, .6); R.sfx("drop", C6 + 1.05, .5);
  tl.fromTo("#zg6", { opacity: 0, x: -80 }, { opacity: 1, x: 0, duration: .4, ease: "power2.out", immediateRender: false }, st.b1 - .1);
  move("s6", { s: 1.12, y: 1200, r: -2 }, C6, en.z5 - C6, "power1.inOut");
  bub("b1"); bub("z5", en.z5 + .1);
  ARMS.zg = [st.z5 + .15, .35];
  tl.to("#hl6", { opacity: 1, duration: .8 }, st.z5 + .8);
  // 7. ПРОДАНО
  const SW7 = en.z5 - .05; swap("s6", "s7", SW7);
  gsap.set([0, 1, 2, 3].map(k => "#sd" + k), { opacity: 0 }); [-60, 250, 560, 820].forEach((l, k) => gsap.set("#sd" + k, { transformOrigin: `${l + 180}px 1095px` }));
  [0, 1, 2, 3].forEach(k => slam("#sd" + k, SW7 + .4 + k * .16, "clack", 2.2));
  move("s7", { s: 1.12, y: 1200 }, SW7, en.l5 - SW7, "none");
  ARMS.zh7 = [st.z6 - .1, .35];
  bub("z6");
  const C7 = W("l5", "7") - .3; cut("s7", "s7t", C7); write("#x7", C7 + .3, .7);
  move("s7t", { s: 2.0, y: 1240 }, C7, en.l5 - C7 + .4, "none");
  // 8. итог и карточка
  const SW8 = st.end - .35; swap("s7t", "s8", SW8);
  move("s8", { s: 1.14, y: 1160 }, SW8, en.end - SW8, "none");
  R.count($("#cv"), W("end", "70"), 570000, 640000, .9); tl.set("#cd", { textContent: "+70 000" }, W("end", "70")); R.sfx("clack", W("end", "70"), .6);
  tl.fromTo("#cnt", { scale: 1.25 }, { scale: 1, duration: .4, ease: "back.out(2)", immediateRender: false }, W("end", "70"));
  tl.fromTo("#cta8", { opacity: 0, y: 80, scale: .9 }, { opacity: 1, y: 0, scale: 1, duration: .4, ease: "back.out(1.6)", immediateRender: false }, W("end", "подпиш") - .3);
  tl.to("#cnt", { opacity: 0, duration: .2 }, en.end + .1);
  ending(R, en.end + .3);
};


// ── ep47b «Архив»: та же история и озвучка, другая «съёмка» ──
(() => {
  const K = {"t1": "ЖОРА", "t2": "ПРОСИТ О ПОМОЩИ", "c1": "#2f4fb8", "c2": "#fbfaf3", "cam": "vpan"};
  const orig = window.build;
  window.build = R => {
    let T = 0; R.hooks.push(t => { T = t; });          // время кадра — до основного хука, который вызывает C.apply
    // своя камера поверх плана каждой сцены: vpan — медленный проход по вертикали, in — общий наезд, alt — боковой дрейф туда-обратно
    const ap = C.apply;
    C.apply = (el, hand) => {
      const c = el.cam, s0 = c.s, x0 = c.x, y0 = c.y, k = Object.keys(SC).indexOf(Object.keys(SC).find(n => SC[n] === el));
      if (K.cam === "vpan") { c.y = y0 + Math.sin(T * .35 + k) * 40 / s0; c.s = s0 * 1.04; }
      else if (K.cam === "in") { c.s = s0 * (1.03 + .03 * Math.sin(T * .2 + k)); }
      else { c.x = x0 + (k % 2 ? 1 : -1) * Math.sin(T * .3) * 45 / s0; c.s = s0 * 1.05; }
      ap(el, hand); c.s = s0; c.x = x0; c.y = y0;
    };
    orig(R);
    const tl = R.tl;
    $("#title .a").textContent = K.t1; $("#title .a").style.cssText = `font-size:110px;background:${K.c1};color:${K.c2}`;
    const b = $("#title .b"); b.textContent = K.t2; b.style.cssText = `font-size:60px;background:${K.c2};color:${K.c1}`;
  };
})();
