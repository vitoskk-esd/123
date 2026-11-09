// МИНИ-СЕРИАЛ «ТОЛЯН: СО СТА ТЫСЯЧ», часть 4 «Партнёр или ловушка». Все фоны новые (bilyard, zhk, tramvai, elektrik, park, fitnes), второстепенные герои новые
// (продавец Арсен, автоэлектрик Вадик, дядя Коля, тренер Артур); Жора — сквозной соперник. Ловушка: бывшее такси со скрученным пробегом; машина Толяна — ВАЗ-2110 владельца.
$("#title .a").textContent = E.rubric; $("#title .b").textContent = E.subtitle; $("#tag span").textContent = "со ста тысяч · 4";
$("#title .a").style.cssText = "font-size:96px;background:#ffd23f;color:#151515"; $("#title .b").style.cssText = "font-size:70px;background:#151515;color:#fff";
document.querySelector("#cam > svg#bg")?.remove();
const W = (line, pre, n = 0) => {
  const norm = s => s.toLowerCase().replace(/ё/g, "е").replace(/[^а-я0-9a-z]/g, "");
  const hits = (TT.words[line] || []).filter(w => norm(w[0]).startsWith(norm(pre)));
  return hits[n] ? hits[n][1] : st[line];
};
const SCN = {};
function scene(name, bg) {
  const d = document.createElement("div"); d.className = "scn"; d.id = "sc_" + name;
  d.innerHTML = bg ? BGS[bg].replace('id="bg"', `id="bg_${name}"`) : "";
  $("#scene").appendChild(d); SCN[name] = d; return d;
}
const add = (sc, html) => { SCN[sc].insertAdjacentHTML("beforeend", html); };
const hero = (kind, p, l, t, s = 1, z = 6, o) => `<div class="c" id="${p.toUpperCase()}" style="left:${l}px;top:${t}px;z-index:${z};transform-origin:0 0;transform:scale(${s})">${CHARS[kind](p, o)}</div>`;
const stamp = (id, text, l, t, bg, fg = "#fff", fs = 60, rot = -4) => `<div class="stamp2" id="${id}" style="left:${l}px;top:${t}px;background:${bg};color:${fg};font-size:${fs}px;transform:rotate(${rot}deg)">${text}</div>`;
const CAR = (id, img, l, t, w, z = 3) => `<img class="pcar" id="${id}" src="../../kit/img/${img}" style="left:${l}px;top:${t}px;width:${w}px;z-index:${z}">`;
const CASH = (id, l, t, n = 4) => `<div class="el" id="${id}" style="left:${l}px;top:${t}px;width:300px;height:160px;z-index:8;opacity:0">` + Array.from({ length: n }, (_, i) => `<div style="position:absolute;left:${i * 26}px;top:${60 - i * 10}px;width:150px;height:76px;background:#8fd17a;border:5px solid #151515;border-radius:8px;transform:rotate(${-10 + i * 5}deg)"></div>`).join("") + `</div>`;
const PHONE = (id, l, t, w, inner) => `<div class="el" id="${id}" style="left:${l}px;top:${t}px;width:${w}px;z-index:9;background:#0d0e12;border:8px solid #2a2d34;border-radius:44px;padding:22px;box-shadow:0 0 70px rgba(120,180,255,.4);opacity:0">${inner}</div>`;
const BOT = (body, fs = 30) => `<div style="font-family:Onest;font-weight:700;font-size:24px;color:#8b93a3">ПЕРЕХВАТ · бот</div><div style="background:#1c1f26;border-radius:22px;padding:16px 20px;margin-top:10px;font-family:Onest;color:#fff;font-size:${fs}px;line-height:1.45">${body}</div>`;
const MARKS = (l, t) => [[0, 0], [150, 6]].map(([dx, dy], i) => `<div class="el mk" id="mk${i}" style="left:${l + dx}px;top:${t + dy}px;width:110px;height:60px;z-index:4;border:5px dashed #ff7a1a;background:rgba(255,255,255,.7);border-radius:6px"></div>`).join("");
const ZHORA = { jacket: "#1d1d1f", pants: "#2b2f37", cap: "#c0392b", mustache: true, chain: true, hair: "#1d1d1f", item: "phone", look: "grin" };
const ARSEN = { jacket: "#5b3a26", pants: "#2b2f37", cap: "#151515", beard: true, hair: "#1d1d1f", item: "phone" };
const VADIK = { jacket: "#2e86de", pants: "#2e86de", glasses: true, cap: "#ffd23f", hair: "#c9a06b", item: "gauge" };
const KOLYA = { jacket: "#6b8e5a", pants: "#3b3f46", vest: true, cap: "#e8ecf0", mustache: true, hair: "#d9d9d9" };
const ARTUR = { jacket: "#ff3b30", pants: "#151515", hair: "#1d1d1f", item: "bag" };
const TOLS = ["t", "t2", "t3", "t4", "t5", "t6", "t7", "t8"];

// 1. бильярдная: Жора предлагает дело
scene("bil", "bilyard");
add("bil", hero("perekup", "zh", 600, 860, .8, 7, ZHORA) + hero("tolyan", "t", 20, 900, .76, 7)
  + stamp("p1", "ЧАСТЬ 4 · ПАРТНЁР ИЛИ ЛОВУШКА?", 40, 1520, "#ff2da6", "#fff", 40, -3));
// 2. двор новостройки: Солярис «не такси»
scene("zhk", "zhk");
add("zhk", CAR("car1", "hyundai/hyundai.png", 300, 1150, 640) + MARKS(330, 1268) + hero("perekup", "ar", 560, 870, .78, 7, ARSEN) + hero("perekup", "zh2", 760, 860, .78, 6, ZHORA)
  + hero("tolyan", "t2", -20, 900, .74, 7) + stamp("z1", "СЛЕДЫ НАКЛЕЕК?", 60, 1540, "#ffd23f", "#151515", 50, -3));
// 3. трамвай: реестр такси
scene("tram", "tramvai");
add("tram", hero("tolyan", "t3", 600, 880, .8, 7)
  + PHONE("reg", 30, 700, 540, `<div style="font-family:Onest;font-weight:700;font-size:24px;color:#8b93a3">Реестр такси · проверка по номеру</div><div style="font-family:Onest;color:#fff;font-size:30px;line-height:1.5;margin-top:10px">Hyundai Solaris · белый<br>Разрешение: <b style="color:#ff3b30">найдено</b><br>2019 → 2023 · 4 года</div>`)
  + stamp("r1", "4 ГОДА В ТАКСИ", 60, 1540, "#ff3b30", "#fff", 56, -3));
// 4. мастерская автоэлектрика: пробег в блоке
scene("el", "elektrik");
add("el", CAR("car2", "hyundai/hyundai.png", 360, 1160, 620) + hero("perekup", "va", 600, 860, .8, 7, VADIK) + hero("tolyan", "t4", -20, 900, .76, 7)
  + `<div class="odo" id="odo" style="top:470px"><small>ПРОБЕГ В БЛОКЕ</small><b>470 000</b></div>`
  + stamp("e1", "СКРУТКА −350 000 КМ", 60, 1540, "#ff3b30", "#fff", 50, -3));
// 5. снова бильярдная: отказ
scene("bil2", "bilyard");
add("bil2", hero("perekup", "zh3", 600, 860, .8, 7, { ...ZHORA, look: "angry" }) + hero("tolyan", "t5", 20, 900, .76, 7)
  + stamp("b1", "ЛОВУШКА НЕ СРАБОТАЛА", 200, 1540, "#4cd964", "#151515", 46, 3));
// 6. парк: десятка дяди Коли
scene("park", "park");
add("park", CAR("car3", "vaz2110/vaz2110_34.png", 300, 1120, 600) + hero("perekup", "ko", 620, 860, .78, 7, KOLYA) + hero("tolyan", "t6", -20, 900, .76, 7)
  + PHONE("bot3", 30, 1360, 470, BOT(`<b style="color:#ff7a1a">🔥 −20% к рынку</b><br><b>ВАЗ-2110 · 95 000 ₽</b><br>⏱ 1 с после публикации`, 26))
  + stamp("k1", "✅ ОГРАНИЧЕНИЙ НЕТ", 40, 1660, "#4cd964", "#151515", 40, 3));
// 7. фитнес-клуб: продажа Артуру
scene("fit", "fitnes");
add("fit", CAR("car4", "vaz2110/vaz2110_side.png", 280, 1190, 660) + hero("perekup", "au", 620, 860, .8, 7, ARTUR) + hero("tolyan", "t7", -20, 900, .76, 7)
  + CASH("cash1", 420, 1440, 4) + stamp("f1", "+40 000 ₽", 60, 1560, "#4cd964", "#151515", 56, -3));
// 8. фитнес-клуб: Жора сам ставит бота + крючок + финальная карточка
scene("fit2", "fitnes");
add("fit2", hero("perekup", "zh4", 640, 860, .8, 7, ZHORA) + hero("tolyan", "t8", -20, 900, .76, 7)
  + `<div class="el" id="nx" style="left:60px;right:60px;top:300px;z-index:20;background:#0d0e12;border:6px solid #fff;border-radius:30px;padding:22px 26px;color:#fff;font-family:Unbounded;font-weight:900;font-size:46px;line-height:1.25;text-align:center;opacity:0">ЧАСТЬ 5:<br><span style="color:#ffd23f">бот</span> против <span style="color:#ff3b30">бота</span></div>
  <div class="ctab" id="cta2" style="top:1300px"><div class="cbig">Бот <span>«Перехват»</span><br>— ссылка в шапке</div><div class="csm">новые объявления через ~1 с · город и бюджет</div></div>`);

$(".stage").insertAdjacentHTML("beforeend", `<div id="cnt" style="opacity:0">💸 108 000 ₽</div>`);
TOLS.forEach(p => { const s = document.getElementById(p + "-shades"); if (s) s.style.display = ""; });
$("#end h2").innerHTML = E.end;
const bub = (line, html, l, t, tx, fs) => { const b = bubble(line, html, l, t, tx); if (fs) b.style.fontSize = fs + "px"; return b; };
bub("z1", "Солярис за 260: ты — сто,<br><em>продаём — и пополам.</em>", 380, 700, 388, 38);
bub("t1", "Звучит красиво,<br><em>брат.</em>", 40, 720, 140, 46);
bub("a1", "Пробег 120. Не такси —<br><em>сам ездил.</em>", 440, 700, 284, 40);
bub("t2", "Сам ездил,<br><em>значит…</em>", 600, 720, 168, 48);
bub("v1", "На приборке 120.<br><em>В блоке — 470 тысяч.</em>", 470, 700, 298, 40);
bub("t3", "Жора, катайся на своём<br><em>такси сам.</em>", 40, 720, 140, 40);
bub("z2", "Ну ты…<br><em>студент.</em>", 600, 720, 168, 48);
bub("k1", "Езжу только на рыбалку.<br><em>Проверяй хоть до винтика.</em>", 360, 700, 424, 38);
bub("ar1", "Беру! Без сюрпризов —<br><em>это главное.</em>", 440, 700, 348, 40);
bub("z3", "Я тоже поставлю<br><em>этого вашего бота.</em>", 480, 700, 328, 42);

window.build = R => {
  const tl = R.tl, cam = R.camera($("#cam"), { hand: .6 });
  R.grain(.03);
  gsap.set(".scn", { opacity: 0 }); gsap.set("#sc_bil", { opacity: 1 });
  const { pop } = common(R, cam, { mood: () => "grin" });
  const talk = (lv, f) => lv > .28 && !(lv < .55 && f % 3 === 2);
  const FIT = W("l4", "через") - .3;
  const SW = { zhk: st.a1 - .7, tram: st.l2 - .7, el: st.v1 - .7, bil2: st.t3 - .7, park: st.l3 - .7, fit: FIT, fit2: st.z3 - .7 };
  const STEPS = [[0, 108000, 0], [W("l3", "95"), 13000, 1], [W("l5", "капитал"), 148000, 0]];
  const fmt = v => Math.round(v).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  const SP = [["zh", "zhora"], ["zh2", "zhora"], ["zh3", "zhora"], ["zh4", "zhora"], ["ar", "arsen"], ["va", "vadik"], ["ko", "kolya"], ["au", "artur"]];
  R.hooks.push(t => { const f = Math.floor(t * 30), lt = (LIP.tolyan || [])[f] || 0;
    TOLS.forEach(p => { if (document.getElementById(p)) mouth(p, talk(lt, f) ? "talk" : (p === "t3" || p === "t4" ? "o" : "grin")); });
    SP.forEach(([p, k]) => { if (document.getElementById(p)) mouth(p, talk((LIP[k] || [])[f] || 0, f) ? "talk" : (k === "zhora" && p !== "zh3" ? "grin" : "flat")); });
    let v = 0, prev = 0, car = 0; for (const [at, to, c] of STEPS) { if (t < at) break; v = prev + (to - prev) * Math.min(1, (t - at) / .7); prev = to; car = c; }
    $("#cnt").textContent = `💸 ${fmt(v)} ₽${car ? " + 🚗" : ""}`; });
  tl.to("#cnt", { opacity: 1, duration: .3 }, 1.6); tl.to("#cnt", { opacity: 0, duration: .2 }, st.end - .2);
  STEPS.slice(1).forEach(([at]) => { tl.fromTo("#cnt", { scale: 1.35 }, { scale: 1, duration: .3, ease: "back.out(2)", immediateRender: false }, at); R.sfx("tick", at, .9); });
  const swap = (from, to, at) => {
    tl.set(`#sc_${to}`, { opacity: 1, x: 1080, filter: "blur(14px)" }, at)
      .to(`#sc_${from}`, { x: -1080, filter: "blur(14px)", duration: .35, ease: "power3.in" }, at)
      .to(`#sc_${to}`, { x: 0, filter: "blur(0px)", duration: .38, ease: "power3.out" }, at + .12)
      .set(`#sc_${from}`, { opacity: 0, x: 0, filter: "none" }, at + .5);
    R.sfx("whoosh", at, .6);
  };
  window.MUSIC = { style: "story", bpm: 104, end: R.dur - 1.2 };
  const ids = E.lines.map(l => l.id), SWT = Object.values(SW);
  for (const l of ["z1", "t1", "a1", "t2", "v1", "t3", "z2", "k1", "ar1", "z3"]) { const nx = ids[ids.indexOf(l) + 1]; const ns = SWT.filter(x => x > st[l]).sort((a, b) => a - b)[0] ?? 1e9;
    pop("#b_" + l, st[l] - .05, Math.min(en[l] + .9, st[nx] - .1, ns - .05)); }
  const slam = (sel, at, sfx = "impact") => { tl.fromTo(sel, { opacity: 0, scale: 2 }, { opacity: 1, scale: 1, duration: .18, ease: "power4.out", immediateRender: false }, at); R.sfx(sfx, at + .02, .7); };
  const show = (sel, at) => { tl.fromTo(sel, { opacity: 0, scale: .7, y: 60 }, { opacity: 1, scale: 1, y: 0, duration: .35, ease: "back.out(1.8)", immediateRender: false }, at); R.sfx("ping", at - .03, 1); };

  // 1. бильярдная
  tl.to("#title", { opacity: 0, y: -50, duration: .25 }, 1.4);
  slam("#p1", W("l0", "конкур"), "impact");
  R.punch(cam, W("z1", "пополам") , .05); R.sfx("ping", W("z1", "пополам"), .5);
  // 2. ЖК
  swap("bil", "zhk", SW.zhk); tl.to("#p1", { opacity: 0, duration: .1 }, SW.zhk);
  tl.fromTo(".mk", { opacity: 0, scale: .6 }, { opacity: 1, scale: 1, duration: .25, stagger: .1, ease: "back.out(2)", immediateRender: false }, W("l1", "квадрат"));
  tl.to(".mk", { scale: 1.12, duration: .25, yoyo: true, repeat: 3 }, W("l1", "квадрат") + .3);
  slam("#z1", W("l1", "наклеек"), "pop");
  tl.to("#AR", { x: 60, duration: .4, ease: "power2.out" }, W("l1", "обним")).to("#ZH2", { x: -60, duration: .4, ease: "power2.out" }, W("l1", "обним"));
  // 3. трамвай
  swap("zhk", "tram", SW.tram);
  show("#reg", W("l2", "реестр")); slam("#r1", W("l2", "четыре"), "impact"); R.shake(cam, W("l2", "четыре"), .4, .3);
  // 4. автоэлектрик
  swap("tram", "el", SW.el);
  tl.fromTo("#odo", { opacity: 0, y: -40 }, { opacity: 1, y: 0, duration: .3, ease: "back.out(2)", immediateRender: false }, W("v1", "блок")); R.sfx("clack", W("v1", "блок"), .8);
  slam("#e1", W("v1", "скрут"), "impact"); R.shake(cam, W("v1", "скрут"), .6, .4); R.sfx("boom", W("v1", "скрут"), .4);
  // 5. бильярдная: отказ
  swap("el", "bil2", SW.bil2);
  R.punch(cam, st.t3 + .2, .05); slam("#b1", en.z2 + .1, "pop");
  // 6. парк
  swap("bil2", "park", SW.park);
  show("#bot3", W("l3", "прислал")); R.sfx("ping", W("l3", "95"), .6);
  slam("#k1", W("l4", "огранич"), "pop");
  // 7. фитнес-клуб: продажа
  swap("park", "fit", SW.fit);
  tl.fromTo("#cash1", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: .3, ease: "back.out(2)", immediateRender: false }, W("l4", "135")); R.sfx("ping", W("l4", "135"), .5);
  slam("#f1", W("l5", "капитал"), "impact");
  // 8. Жора ставит бота, крючок, финальная карточка
  swap("fit", "fit2", SW.fit2);
  tl.from("#ZH4", { x: 420, duration: .6, ease: "power2.out" }, SW.fit2 + .2);
  R.punch(cam, W("z3", "бота"), .06);
  tl.fromTo("#nx", { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: .4, ease: "back.out(1.6)", immediateRender: false }, st.end); R.sfx("impact", st.end + .05, .6);
  tl.fromTo("#cta2", { opacity: 0, y: 80, scale: .9 }, { opacity: 1, y: 0, scale: 1, duration: .4, ease: "back.out(1.6)", immediateRender: false }, W("end", "подпиш") - .2);
  ending(R, en.end + .3);
};


// ── ep36h «Пастель»: та же история и озвучка, другая «съёмка» ──
(() => {
  const C = {"t1": "ПАРТНЁР", "t2": "ИЛИ ЛОВУШКА?", "c1": "#ff6fae", "c2": "#151515", "cam": "alt", "music": {"style": "bed", "bpm": 110}};
  const orig = window.build;
  window.build = R => {
    orig(R);
    const tl = R.tl;
    $("#title .a").textContent = C.t1; $("#title .a").style.cssText = `font-size:110px;background:${C.c1};color:${C.c2}`;
    const b = $("#title .b"); b.style.display = ""; b.textContent = C.t2; b.style.cssText = `font-size:60px;background:${C.c2};color:${C.c1}`;
    tl.set("#title", { opacity: 1, y: 0 }, 0).to("#title", { opacity: 0, y: -50, duration: .3 }, 1.2);
    const FIT = W("l4", "через") - .3;
    const S = [["bil", 0, st.a1 - .7, "55% 55%"], ["zhk", st.a1 - .7, st.l2 - .7, "50% 60%"], ["tram", st.l2 - .7, st.v1 - .7, "45% 55%"],
               ["el", st.v1 - .7, st.t3 - .7, "55% 55%"], ["bil2", st.t3 - .7, st.l3 - .7, "50% 55%"], ["park", st.l3 - .7, FIT, "50% 60%"],
               ["fit", FIT, st.z3 - .7, "55% 55%"], ["fit2", st.z3 - .7, en.end + .3, "50% 45%"]];
    S.forEach(([n, a, z, o], i) => {
      const sel = `#sc_${n}`, d = z - a;
      if (C.cam === "in") tl.fromTo(sel, { scale: 1 }, { scale: 1.12, transformOrigin: o, duration: d, ease: "none", immediateRender: false }, a);
      else if (C.cam === "out") tl.fromTo(sel, { scale: 1.12 }, { scale: 1, transformOrigin: o, duration: d, ease: "none", immediateRender: false }, a);
      else if (C.cam === "tilt") tl.fromTo(sel, { scale: 1.06, rotation: i % 2 ? -.8 : .8 }, { scale: 1.1, rotation: 0, transformOrigin: o, duration: d, ease: "none", immediateRender: false }, a);
      else if (C.cam === "punch") tl.fromTo(sel, { scale: 1 }, { scale: 1.09, transformOrigin: o, duration: .45, ease: "back.out(2)", immediateRender: false }, a + .5);
      else if (C.cam === "pan") tl.fromTo(sel, { scale: 1.1, xPercent: i % 2 ? 2.5 : -2.5 }, { scale: 1.1, xPercent: i % 2 ? -2.5 : 2.5, transformOrigin: "50% 50%", duration: d, ease: "none", immediateRender: false }, a);
      else if (C.cam === "vpan") tl.fromTo(sel, { scale: 1.1, yPercent: 2 }, { scale: 1.1, yPercent: -2, transformOrigin: "50% 50%", duration: d, ease: "none", immediateRender: false }, a);
      else tl.fromTo(sel, { scale: i % 2 ? 1 : 1.1 }, { scale: i % 2 ? 1.1 : 1, transformOrigin: o, duration: d, ease: "none", immediateRender: false }, a);
    });
    window.MUSIC = Object.assign({}, window.MUSIC, C.music);
  };
})();
