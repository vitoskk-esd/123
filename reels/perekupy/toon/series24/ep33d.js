// МИНИ-СЕРИАЛ «ТОЛЯН: СО СТА ТЫСЯЧ», часть 1 — как Толян со ста тысячами решил стать перекупом и как продавал первую машину (владелец 07.11:
// «поподробнее, как клиента находил, как приезжали и не забирали»). Все фоны новые (coffee, kiosk, shed, podezd, vokzal), второстепенные герои новые
// (дядя Валера, Гоша-перекуп, «эксперт», курьер Дима). Бот — рабочий инструмент (фильтр + карточка). Сквозной счётчик капитала. Машина — ВАЗ-2105 владельца.
$("#title .a").textContent = E.rubric; $("#title .b").textContent = E.subtitle; $("#tag span").textContent = "со ста тысяч · 1";
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
const V05 = (id, l, t, w, z = 3) => `<img class="pcar" id="${id}" src="../../kit/img/vaz2105/vaz2105_34.png" style="left:${l}px;top:${t}px;width:${w}px;z-index:${z}">`;
const CASH = (id, l, t, n = 5, hide = false) => `<div class="el" id="${id}" style="left:${l}px;top:${t}px;width:300px;height:160px;z-index:8;${hide ? "opacity:0" : ""}">` + Array.from({ length: n }, (_, i) => `<div style="position:absolute;left:${i * 26}px;top:${60 - i * 10}px;width:150px;height:76px;background:#8fd17a;border:5px solid #151515;border-radius:8px;transform:rotate(${-10 + i * 5}deg)"></div>`).join("") + `</div>`;
const VALERA = { jacket: "#3f6e5a", pants: "#2b2f37", cap: "#5b4636", mustache: true, hair: "#bdbdbd" };
const GOSHA = { jacket: "#2e86de", pants: "#2e86de", cap: "#151515", chain: true, item: "phone" };
const EXPERT = { jacket: "#6b8e23", pants: "#3b3f46", glasses: true, hair: "#3a2d22", scarf: "#ffd23f", item: "gauge" };
const DIMA = { jacket: "#ffd23f", pants: "#2b2f37", cap: "#ffd23f", hair: "#2b1d14", item: "bag" };
const TOLS = ["t2", "t3", "t4", "t5", "t6", "t7"];
const HALF = (bg, inner) => `<div class="el" style="left:540px;top:0;width:540px;height:1920px;overflow:hidden;z-index:5;border-left:8px solid #151515"><div style="position:absolute;left:-540px;top:0;width:1080px;height:1920px">${BGS[bg].replace('id="bg"', "")}</div>${inner}</div>`;

// 1. кофейня: сто тысяч и мечта
scene("coffee", "coffee");
add("coffee", hero("tolyan", "t", -10, 880, .86, 7) + CASH("cash1", 560, 1250)
  + `<div class="el" id="dream" style="left:500px;top:880px;width:500px;height:300px;z-index:8;opacity:0"><div style="position:absolute;inset:0 0 30px 0;background:#fff;border:7px solid #151515;border-radius:50%;box-shadow:0 10px 0 #151515"></div>
     <img src="../../kit/img/gelik/gelik_34.png" style="position:absolute;left:110px;top:20px;width:260px"><div style="position:absolute;left:100px;top:200px;font-family:Unbounded;font-weight:900;font-size:32px;color:#151515;white-space:nowrap">1 000 000 ₽ 🤑</div></div>`
  + stamp("pt1", "ЧАСТЬ 1 · СТО ТЫСЯЧ", 420, 1420, "#ffd23f", "#151515", 36, 3));
// 2. 03:00, ночной ларёк: фильтр и карточка бота
scene("kiosk", "kiosk");
add("kiosk", hero("tolyan", "t2", -20, 880, .84, 7)
  + `<div class="botcard" id="bot1" style="left:400px;top:760px;width:620px"><div class="bh">ПЕРЕХВАТ · фильтр · 03:00</div><div style="font-family:Onest;color:#fff;font-size:28px;line-height:1.5;margin:0 0 12px">💰 до 100 000 ₽ · 📍 твой город</div>
     <div class="bb" id="bot1c" style="opacity:0"><b style="color:#ff7a1a">🔥 −25% к рынку · хозяин</b><br><b>ВАЗ-2105 · 85 000 ₽</b><br>⏱ 1 с после публикации</div></div>`);
// 3. гараж дяди Валеры
scene("shed", "shed");
add("shed", V05("car1", 300, 1210, 680) + hero("perekup", "va", -10, 860, .86, 7, VALERA) + hero("tolyan", "t3", 800, 880, .76, 7)
  + stamp("g1", "−85 000 ₽", 330, 1080, "#ff3b30", "#fff", 50, 3) + stamp("g2", "ПЕРВАЯ МАШИНА 🚗", 200, 560, "#ffd23f", "#151515", 50, -3));
// 4. двор у подъезда: мойка из ведра, фото, объявление
scene("podezd", "podezd");
add("podezd", V05("car2", 330, 1210, 660) + hero("tolyan", "t4", -20, 880, .8, 7)
  + Array.from({ length: 10 }, (_, i) => `<div class="foam" id="fm${i}" style="left:${360 + (i * 61) % 560}px;top:${1190 + (i * 37) % 240}px;width:${60 + (i * 13) % 50}px;height:${60 + (i * 13) % 50}px"></div>`).join("")
  + `<div class="el" id="flash" style="inset:0;background:#fff;z-index:30;opacity:0"></div>`
  + `<div class="el" id="ad" style="left:470px;top:740px;width:560px;z-index:9;background:#fff;border:8px solid #151515;border-radius:30px;padding:18px 22px;font-family:Onest;color:#151515;box-shadow:0 12px 0 #151515;opacity:0">
     <div style="height:170px;border-radius:18px;background:linear-gradient(#f6b26b,#fde3c3);position:relative;overflow:hidden"><img src="../../kit/img/vaz2105/vaz2105_34.png" style="position:absolute;left:60px;bottom:4px;width:380px"></div>
     <div style="font-family:Unbounded;font-weight:900;font-size:30px;margin-top:10px">ВАЗ-2105 · 120 000 ₽</div><div style="font-size:24px;font-weight:800;color:#2f7a3a">без скрутки · аккумулятор новый</div></div>`
  + stamp("p1", "АККУМУЛЯТОР И ШАМПУНЬ −7 000", 40, 1600, "#151515", "#fff", 32, -3));
// 5. звонок: Толян у подъезда | Гоша-перекуп на своей точке
scene("call", "podezd");
add("call", hero("tolyan", "t5", 40, 880, .8, 7) + HALF("kiosk", hero("perekup", "go", 110, 880, .76, 7, GOSHA))
  + stamp("c1", "«ТЫ КТО?» — «ПЕРЕКУП»", 60, 1600, "#ff3b30", "#fff", 36, -3));
// 6. вокзал: «эксперт»
scene("vok1", "vokzal");
add("vok1", V05("car3", 280, 1220, 660) + hero("tolyan", "t6", -20, 880, .8, 7) + hero("perekup", "ex", 790, 880, .76, 7, EXPERT)
  + [["x1", "📏 толщиномер", 680, 400], ["x2", "🔦 эндоскоп", 700, 480], ["x3", "🧲 магнит", 720, 560]].map(([id, t, l, tp]) => stamp(id, t, l, tp, "#fff", "#151515", 32, 2)).join("")
  + stamp("x4", "40 МИНУТ ОСМОТРА", 60, 1620, "#ffd23f", "#151515", 36, -2) + stamp("x5", "🚌 УЕХАЛ НА АВТОБУСЕ", 120, 1500, "#151515", "#fff", 40, -2));
// 7. вокзал: курьер Дима
scene("vok2", "vokzal");
add("vok2", V05("car4", 280, 1220, 660) + hero("tolyan", "t7", -20, 880, .8, 7) + hero("perekup", "di", 800, 880, .76, 7, DIMA)
  + CASH("cash2", 420, 1480, 4, true) + stamp("y1", "+28 000 ₽ ЗА НЕДЕЛЮ", 200, 560, "#4cd964", "#151515", 50, -3));
// 8. крючок на часть 2 + одна финальная карточка
scene("next", "kiosk");
add("next", `<div class="el" style="inset:0;background:rgba(10,12,16,.5);z-index:2"></div><div class="el" id="nx" style="left:60px;right:60px;top:560px;z-index:20;background:#0d0e12;border:6px solid #fff;border-radius:30px;padding:26px 28px;color:#fff;font-family:Unbounded;font-weight:900;font-size:44px;line-height:1.25;text-align:center;opacity:0">ЧАСТЬ 2:<br><span style="color:#ff3b30">Приора и первая ошибка</span></div>
  <div class="ctab" id="cta2" style="top:1000px"><div class="cbig">Бот <span>«Перехват»</span><br>— ссылка в шапке</div><div class="csm">фильтр по бюджету и городу · ниже рынка — видно сразу</div></div>`);

$(".stage").insertAdjacentHTML("beforeend", `<div id="cnt" style="opacity:0">💸 100 000 ₽</div>`);
["t"].concat(TOLS).forEach(p => { const s = document.getElementById(p + "-shades"); if (s) s.style.display = ""; });
$("#end h2").innerHTML = E.end;
const bub = (line, html, l, t, tx, fs) => { const b = bubble(line, html, l, t, tx); if (fs) b.style.fontSize = fs + "px"; return b; };
bub("t1", "Всё, брат. Сто тысяч есть —<br><em>становлюсь перекупом!</em>", 40, 700, 160, 42);
bub("t2", "Брат,<br><em>беру!</em>", 60, 720, 100, 50);
bub("v1", "Сынок, только аккумулятор сел.<br><em>А так — зверь.</em>", 60, 720, 110, 40);
bub("g1", "Последняя цена? Шестьдесят —<br><em>и забираю сегодня.</em>", 380, 720, 430, 38);
bub("t3", "Брат, ты кто<br><em>вообще?</em>", 40, 730, 150, 46);
bub("g2", "Перекуп.", 640, 780, 170, 50);
bub("e1", "Толщиномер, эндоскоп, магнит…<br><em>Но я думал, она синяя.</em>", 300, 840, 650, 38);
bub("d1", "Сколько?", 700, 780, 250, 48);
bub("t4", "Сто двадцать.<br><em>Всё честно.</em>", 40, 730, 110, 46);
bub("d2", "Беру.", 740, 790, 210, 50);

window.build = R => {
  const tl = R.tl, cam = R.camera($("#cam"), { hand: .6 });
  R.grain(.03);
  gsap.set(".scn", { opacity: 0 }); gsap.set("#sc_coffee", { opacity: 1 });
  const { pop } = common(R, cam, { mood: () => "grin" });
  const talk = (lv, f) => lv > .28 && !(lv < .55 && f % 3 === 2);
  const SW = { kiosk: st.l1 - .7, shed: st.v1 - .7, podezd: st.l3 - .7, call: st.g1 - .7, vok1: st.e1 - .7, vok2: st.d1 - .7, next: st.end - .7 };
  const STEPS = [[0, 100000, 0], [W("l2", "85"), 15000, 1], [W("l3", "сем"), 8000, 1], [en.d2, 128000, 0]];
  const fmt = v => Math.round(v).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  const SP = [["va", "valera"], ["go", "gosha"], ["ex", "expert"], ["di", "dima"]];
  R.hooks.push(t => { const f = Math.floor(t * 30), lt = (LIP.tolyan || [])[f] || 0;
    TOLS.forEach(p => { if (document.getElementById(p)) mouth(p, talk(lt, f) ? "talk" : "grin"); });
    SP.forEach(([p, k]) => { if (document.getElementById(p)) mouth(p, talk((LIP[k] || [])[f] || 0, f) ? "talk" : "grin"); });
    let v = 0, prev = 0, car = 0; for (const [at, to, c] of STEPS) { if (t < at) break; v = prev + (to - prev) * Math.min(1, (t - at) / .7); prev = to; car = c; }
    $("#cnt").textContent = `💸 ${fmt(v)} ₽${car ? " + 🚗" : ""}`;
    for (let i = 0; i < 10; i++) { const d = document.getElementById("fm" + i), on = t > W("l3", "мойк") - .2 && t < W("l3", "фото");
      d.style.opacity = on ? .95 : 0; d.style.transform = `translateY(${Math.sin(t * 3 + i) * 10}px) scale(${.8 + .3 * Math.sin(t * 2 + i)})`; } });
  tl.to("#cnt", { opacity: 1, duration: .3 }, en.t1); tl.to("#cnt", { opacity: 0, duration: .2 }, st.end + 1.5);
  STEPS.slice(1).forEach(([at]) => { tl.fromTo("#cnt", { scale: 1.35 }, { scale: 1, duration: .3, ease: "back.out(2)", immediateRender: false }, at); R.sfx("tick", at, .9); });
  const swap = (from, to, at, kind) => {
    if (kind === "cut") { tl.set(`#sc_${from}`, { opacity: 0 }, at).set(`#sc_${to}`, { opacity: 1, x: 0, filter: "none" }, at); R.sfx("hit", at, .4); return; }
    tl.set(`#sc_${to}`, { opacity: 1, x: 1080, filter: "blur(14px)" }, at)
      .to(`#sc_${from}`, { x: -1080, filter: "blur(14px)", duration: .35, ease: "power3.in" }, at)
      .to(`#sc_${to}`, { x: 0, filter: "blur(0px)", duration: .38, ease: "power3.out" }, at + .12)
      .set(`#sc_${from}`, { opacity: 0, x: 0, filter: "none" }, at + .5);
    R.sfx("whoosh", at, .6);
  };
  window.MUSIC = { style: "toon", bpm: 108, end: R.dur - 1.2 };
  const ids = E.lines.map(l => l.id), SWT = Object.values(SW);
  for (const l of ["t1", "t2", "v1", "g1", "t3", "g2", "e1", "d1", "t4", "d2"]) { const nx = ids[ids.indexOf(l) + 1]; const ns = SWT.filter(x => x > st[l]).sort((a, b) => a - b)[0] ?? 1e9;
    pop("#b_" + l, st[l] - .05, Math.min(en[l] + .9, st[nx] - .1, ns - .05)); }
  const slam = (sel, at, sfx = "impact") => { tl.fromTo(sel, { opacity: 0, scale: 2 }, { opacity: 1, scale: 1, duration: .18, ease: "power4.out", immediateRender: false }, at); R.sfx(sfx, at + .02, .7); };

  // 1. кофейня
  tl.to("#title", { opacity: 0, y: -50, duration: .25 }, en.t1 - .3);
  tl.fromTo("#dream", { opacity: 0, scale: .5, transformOrigin: "0% 100%" }, { opacity: 1, scale: 1, duration: .4, ease: "back.out(1.8)", immediateRender: false }, W("t1", "перекуп")); R.sfx("pop", W("t1", "перекуп"), .6);
  slam("#pt1", W("l0", "чест"), "pop");
  // 2. ночной ларёк, бот
  swap("coffee", "kiosk", SW.kiosk);
  tl.fromTo("#bot1", { opacity: 0, scale: .7, y: 60 }, { opacity: 1, scale: 1, y: 0, duration: .35, ease: "back.out(1.8)", immediateRender: false }, SW.kiosk + .3);
  tl.to("#bot1c", { opacity: 1, duration: .2 }, W("l1", "три") - .1); R.sfx("ping", W("l1", "три") - .1, 1); R.punch(cam, W("l1", "четвер"), .05);
  tl.fromTo("#T2", { y: 60 }, { y: 0, duration: .35, ease: "back.out(2.5)", immediateRender: false }, st.t2 - .1);
  // 3. гараж Валеры
  swap("kiosk", "shed", SW.shed);
  slam("#g1", W("l2", "85"), "clack"); slam("#g2", W("l2", "перв"), "pop");
  // 4. двор: мойка, фото-вспышка, объявление
  swap("shed", "podezd", SW.podezd);
  tl.fromTo("#flash", { opacity: 0 }, { opacity: .9, duration: .05, yoyo: true, repeat: 1, immediateRender: false }, W("l3", "фото")); R.sfx("tap", W("l3", "фото"), .8);
  tl.fromTo("#ad", { opacity: 0, y: -60 }, { opacity: 1, y: 0, duration: .35, ease: "back.out(1.6)", immediateRender: false }, W("l3", "объявл")); R.sfx("pop", W("l3", "объявл"), .6);
  slam("#p1", W("l3", "аккум"), "pop");
  // 5. звонок Гоши
  swap("podezd", "call", SW.call); R.sfx("ring", SW.call + .1, .6);
  slam("#c1", st.g2, "impact"); R.punch(cam, st.g2 + .1, .06);
  // 6. «эксперт»
  swap("call", "vok1", SW.vok1);
  [["#x1", "толщ"], ["#x2", "эндо"], ["#x3", "магн"]].forEach(([s, w]) => slam(s, W("e1", w), "pop"));
  R.punch(cam, W("e1", "син"), .06); slam("#x4", st.l5, "pop");
  tl.to("#EX", { x: 500, duration: .9, ease: "power2.in" }, W("l5", "уехал")); slam("#x5", W("l5", "автоб"), "impact");
  // 7. курьер Дима
  swap("vok1", "vok2", SW.vok2);
  tl.fromTo("#cash2", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: .3, ease: "back.out(2)", immediateRender: false }, en.d2); R.sfx("ping", en.d2, .6);
  slam("#y1", W("l6", "плюс"), "impact"); R.punch(cam, W("l6", "шок"), .06);
  // 8. крючок + финальная карточка
  swap("vok2", "next", SW.next);
  tl.fromTo("#nx", { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: .4, ease: "back.out(1.6)", immediateRender: false }, st.end); R.sfx("impact", st.end + .05, .6);
  tl.fromTo("#cta2", { opacity: 0, y: 80, scale: .9 }, { opacity: 1, y: 0, scale: 1, duration: .4, ease: "back.out(1.6)", immediateRender: false }, W("end", "подпиш") - .2);
  ending(R, en.end + .3);
};


// ── ep33d «Холодная»: та же история и озвучка, другая «съёмка» ──
(() => {
  const C = {"t1": "100 000 ₽", "t2": "И ОДНА ПЯТЁРКА", "c1": "#1d4fb8", "c2": "#fff", "cam": "out", "music": {"style": "tech", "bpm": 116}};
  const orig = window.build;
  window.build = R => {
    orig(R);
    const tl = R.tl;
    $("#title .a").textContent = C.t1; $("#title .a").style.cssText = `font-size:110px;background:${C.c1};color:${C.c2}`;
    const b = $("#title .b"); b.style.display = ""; b.textContent = C.t2; b.style.cssText = `font-size:60px;background:${C.c2};color:${C.c1}`;
    tl.set("#title", { opacity: 1, y: 0 }, 0).to("#title", { opacity: 0, y: -50, duration: .3 }, 1.2);
    const S = [["coffee", 0, st.l1 - .7, "40% 55%"], ["kiosk", st.l1 - .7, st.v1 - .7, "45% 55%"], ["shed", st.v1 - .7, st.l3 - .7, "50% 60%"],
               ["podezd", st.l3 - .7, st.g1 - .7, "50% 60%"], ["call", st.g1 - .7, st.e1 - .7, "50% 50%"], ["vok1", st.e1 - .7, st.d1 - .7, "50% 60%"],
               ["vok2", st.d1 - .7, st.end - .7, "50% 60%"], ["next", st.end - .7, en.end + .3, "50% 40%"]];
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
