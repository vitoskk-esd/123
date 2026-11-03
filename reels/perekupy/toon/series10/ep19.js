// «ШРОТ» — авторазборка: контрактный мотор «из Японии» с наклейкой «40 000» поверх «340 000», машины прошлых серий в рядах,
// Королла по частям дороже целой, петля — Толян сам за кассой. Машина — рисунок владельца (kit/img/corolla).
$("#title .a").textContent = E.rubric; $("#title .b").textContent = E.subtitle; $("#tag span").textContent = "шрот";
$("#title .a").style.cssText = "font-size:120px;background:#ffd23f"; $("#title .b").style.cssText = "font-size:72px;background:#151515;color:#fff";
document.querySelector("#cam > svg#bg")?.remove();
const W = (line, pre, n = 0) => {
  const norm = s => s.toLowerCase().replace(/ё/g, "е").replace(/[^а-я0-9]/g, "");
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
const person = (sc, kind, p, l, t, s = 1, z = 7) => add(sc, `<div class="c" id="${p.toUpperCase()}" style="left:${l}px;top:${t}px;z-index:${z};transform:scale(${s})">${CHARS[kind](p)}</div>`);
const stamp = (id, text, l, t, bg, fg = "#fff", fs = 60, rot = -4) => `<div class="stamp2" id="${id}" style="left:${l}px;top:${t}px;background:${bg};color:${fg};font-size:${fs}px;transform:rotate(${rot}deg)">${text}</div>`;
const ptag = (id, text, l, t, rot = -4) => `<div class="ptag" id="${id}" style="left:${l}px;top:${t}px;transform:rotate(${rot}deg)">${text}</div>`;
const wreck = (id, src, l, t, w, rot, extra = "") => `<img class="el" id="${id}" src="../../kit/img/${src}" style="left:${l}px;top:${t}px;width:${w}px;z-index:4;transform:rotate(${rot}deg);filter:grayscale(.55) sepia(.35) brightness(.85);${extra}">`;
// мотор: блок 4A-FE, ржавые потёки; наклейка «40 000» (pre — префикс id) поверх «340 000»
const ENGINE = pre => `<svg viewBox="0 0 700 490" style="width:100%;height:100%;overflow:visible">
  <rect x="80" y="170" width="520" height="260" rx="30" fill="#8b929c" stroke="#000" stroke-width="10"/>
  <rect x="110" y="70" width="460" height="120" rx="40" fill="#1c1c20" stroke="#000" stroke-width="10"/>
  ${[0, 1, 2, 3, 4, 5].map(i => `<path d="M${150 + i * 72} 90 v80" stroke="#3a3a40" stroke-width="10"/>`).join("")}
  <text x="340" y="150" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="44" fill="#c0392b">4A-FE</text>
  <circle cx="60" cy="300" r="60" fill="#5c626b" stroke="#000" stroke-width="8"/><circle cx="60" cy="300" r="22" fill="#2b2b2e"/>
  <path d="M600 230 q60 0 60 60 v80" stroke="#7a4f2a" stroke-width="22" fill="none"/>
  ${[0, 1, 2, 3].map(i => `<ellipse cx="${200 + i * 100}" cy="360" rx="30" ry="14" fill="#8a4a1c" opacity=".7"/>`).join("")}
  <g transform="rotate(-6 300 260)"><rect x="200" y="215" width="240" height="90" fill="#fff" stroke="#000" stroke-width="5"/>
    <text x="320" y="252" text-anchor="middle" font-family="JetBrains Mono" font-weight="800" font-size="26" fill="#555">ПРОБЕГ</text>
    <text x="320" y="290" text-anchor="middle" font-family="JetBrains Mono" font-weight="800" font-size="34" fill="#c0392b">340 000</text></g>
  <g id="${pre}stk" style="transform-origin:460px 200px"><g transform="rotate(4 330 250)"><rect x="210" y="200" width="250" height="100" fill="#ffd23f" stroke="#000" stroke-width="6"/>
    <text x="335" y="240" text-anchor="middle" font-family="JetBrains Mono" font-weight="800" font-size="26" fill="#151515">ПРОБЕГ</text>
    <text x="335" y="282" text-anchor="middle" font-family="JetBrains Mono" font-weight="800" font-size="38" fill="#151515">40 000 км</text></g></g></svg>`;
const TOL = ["t0", "t", "t2"];

// 1. разборка: кран роняет кузов
scene("hook", "shrot");
add("hook", `<div class="el" id="drop" style="left:600px;top:560px;width:420px;height:170px;z-index:5">${CHARS.car("dropcar", 1, "#8e44ad")}</div>`);
person("hook", "tolyan", "t0", 330, 900, .95, 6);
// 2. контейнер: продавец за кадром, рука над кассой
scene("cont", "container");
add("cont", `<div class="el" id="hand1" style="left:780px;top:1220px;font-size:100px;z-index:9">🤝</div>`
  + stamp("japan", "ИЗ ЯПОНИИ ≠ «ИЗ ЯПОНИИ»", 90, 470, "#151515", "#ffd23f", 46, -3));
person("cont", "tolyan", "t", -30, 900, .9, 6);
// 3. мотор крупно
scene("eng", "container");
add("eng", `<div class="el" id="engBig" style="left:140px;top:820px;width:800px;height:560px;z-index:5">${ENGINE("a")}</div>`
  + stamp("p70", "70 000 ₽", 120, 460, "#151515", "#fff", 70, -4) + `<div class="el" id="shine" style="left:560px;top:1000px;font-size:90px;z-index:9;opacity:0">✨</div>`);
// 4. ряды разборки: машины прошлых серий
scene("aisle", "shrot");
add("aisle", `<div id="row" style="position:absolute;left:0;top:0;width:1600px;height:1920px;z-index:4">`
  + wreck("w09", "vaz2109/vaz2109.png", 20, 1130, 480, 8) + wreck("w14", "vaz2114/vaz2114_white.png", 560, 1120, 460, 4, "clip-path:inset(0 0 0 50%)")
  + wreck("wpr", "priora/priora_black.png", 1000, 1180, 560, -10, "clip-path:inset(0 45% 0 0)")
  + ptag("tg09", "ДЕВЯТКА ИЗ КЮВЕТА · 16", 40, 1040, -5) + ptag("tg14", "ЧЕТЫРКА ДЕДА · 17", 640, 1000, -3) + ptag("tgpr", "ПРИОРА — ЧАСТЯМИ · 14", 1020, 1420, 4) + `</div>`);
// 5. из-под капота: Михалыч, наклейка отклеивается
scene("hood", "hood");
add("hood", `<div class="el" id="engHood" style="left:470px;top:1080px;width:580px;height:406px;z-index:5">${ENGINE("b")}</div>`);
person("hood", "mihalych", "m", -80, 760, 1.15, 6);
// 6. Королла по частям
scene("parts", "shrot");
add("parts", `<img class="pcar" id="cor" src="../../kit/img/corolla/corolla.png" style="left:140px;top:1080px;width:800px;z-index:4">`
  + ptag("pt0", "ФАРЫ · 12 000", 80, 980, -6) + ptag("pt1", "ДВЕРИ · 4 × 8 000", 600, 960, 5) + ptag("pt2", "ДИСКИ · 40 000", 120, 1400, 3)
  + ptag("pt3", "МОТОР «КОНТРАКТНЫЙ» · 70 000", 240, 1460, -3) + stamp("dearer", "ПО ЧАСТЯМ — ДОРОЖЕ", 150, 470, "#4cd964", "#151515", 54, -3));
// 7. петля: Толян за кассой, Серёга покупает
scene("loop", "container");
add("loop", stamp("learns", "СЕРЁГА УЧИТСЯ ✓", 160, 470, "#4cd964", "#151515", 56, -3));
person("loop", "tolyan", "t2", 600, 900, .9, 6); person("loop", "seryoga", "s", -30, 900, .9, 6);
// 8. мораль
scene("moral", "container");
add("moral", `<div class="card" id="moralCard" style="top:400px;z-index:20"><h3>КОНТРАКТНЫЙ МОТОР</h3>
  <div class="li" id="mo0">🔦 Компрессия и эндоскоп — до покупки</div><div class="li" id="mo1">📄 Номер мотора и гарантия — в договор</div>
  <div class="li" id="mo2">🏷️ Наклейка с пробегом — не пробег</div><div class="rule" id="mo3">🔔 Целые машины ниже рынка — бот «Перехват»</div></div>`);

TOL.forEach(p => { const s = document.getElementById(p + "-shades"); if (s) s.style.display = ""; });
$("#end h2").innerHTML = E.end;
bubble("t1", "Брат, мне мотор на Короллу.<br><em>Чтобы как новый.</em>", 40, 700, 140);
bubble("s1", "Контрактный, из Японии!<br>Пробег — <em>сорок тысяч!</em><br>Гарантия — пока не уехал.", 380, 940, 420);
bubble("m1", "Мотор японский. И пробег<br>японский — <em>триста сорок тысяч.</em><br>А наклейка — наша.", 300, 330, 160);
bubble("t2", "Контрактный, из Японии!<br>Пробег — <em>сорок тысяч!</em>", 440, 700, 300);
bubble("s2", "А почему наклейка<br>новая, <em>а мотор ржавый?</em>", 40, 960, 140);

window.build = R => {
  const tl = R.tl, cam = R.camera($("#cam"), { hand: .6 });
  R.grain(.03);
  gsap.set(".scn", { opacity: 0 }); gsap.set("#sc_hook", { opacity: 1 });
  const { pop } = common(R, cam, { mood: (k, t) => k === "mihalych" ? "meh" : k === "seryoga" ? "flat" : "grin" });
  R.hooks.push(t => { const f = Math.floor(t * 30), lv = (LIP.tolyan || [])[f] || 0;
    TOL.forEach(p => { if (p !== "t" && document.getElementById(p)) mouth(p, lv > .28 && !(lv < .55 && f % 3 === 2) ? "talk" : "grin"); }); });
  const swap = (from, to, at, kind = "swipe") => {
    if (kind === "cut") { tl.set(`#sc_${from}`, { opacity: 0 }, at).set(`#sc_${to}`, { opacity: 1, x: 0, filter: "none" }, at); R.sfx("hit", at, .4); return; }
    tl.set(`#sc_${to}`, { opacity: 1, x: 1080, filter: "blur(14px)" }, at)
      .to(`#sc_${from}`, { x: -1080, filter: "blur(14px)", duration: .35, ease: "power3.in" }, at)
      .to(`#sc_${to}`, { x: 0, filter: "blur(0px)", duration: .38, ease: "power3.out" }, at + .12)
      .set(`#sc_${from}`, { opacity: 0, x: 0, filter: "none" }, at + .5);
    R.sfx("whoosh", at, .6);
  };
  window.MUSIC = { style: "bed", bpm: 96, end: R.dur - 1.2, mute: [[W("m1", "триста") - .2, en.m1 + .5]] };
  for (const l of ["t1", "s1", "m1", "t2", "s2"]) { const nx = E.lines[E.lines.findIndex(x => x.id === l) + 1]; pop("#b_" + l, st[l] - .05, Math.min(en[l] + .9, st[nx.id] - .1)); }
  const slam = (sel, at, sfx = "impact") => { tl.fromTo(sel, { opacity: 0, scale: 2 }, { opacity: 1, scale: 1, duration: .18, ease: "power4.out", immediateRender: false }, at); R.sfx(sfx, at + .02, .7); };

  // 1. кран роняет кузов на слове «разбирают»
  const crash = W("h", "разбира");
  tl.fromTo("#drop", { y: 0, rotation: 0 }, { y: 520, rotation: 12, duration: .45, ease: "power2.in", immediateRender: false }, crash - .2);
  R.sfx("boom", crash + .25, 1); R.shake(cam, crash + .25, 1.2, .5);
  tl.to("#title", { opacity: 0, y: -50, duration: .25 }, W("h", "продают") - .1);
  tl.fromTo(cam, { s: 1 }, { s: 1.06, duration: st.t1 - 1, ease: "none", immediateRender: false }, 0).set(cam, { s: 1 }, st.t1 - .7);
  // 2. контейнер
  swap("hook", "cont", st.t1 - .7);
  tl.fromTo("#hand1", { y: 120, opacity: 0 }, { y: 0, opacity: 1, duration: .3, ease: "back.out(2)", immediateRender: false }, st.s1 - .2);
  R.sfx("ping", W("s1", "гарант"), .7);
  slam("#japan", W("l1", "двух"), "pop");
  // 3. мотор крупно: наезд на наклейку, блеск
  swap("cont", "eng", st.l2 - .7);
  tl.fromTo(cam, { s: 1, y: 0 }, { s: 1.25, y: -60, duration: en.l2 - st.l2 + .6, ease: "power1.inOut", immediateRender: false }, st.l2 - .3).set(cam, { s: 1, y: 0 }, st.l3 - .7);
  slam("#p70", W("l2", "семьдес"), "clack");
  tl.fromTo("#shine", { opacity: 0, scale: .3 }, { opacity: 1, scale: 1.2, duration: .25, yoyo: true, repeat: 1, immediateRender: false }, W("l2", "наклейк")); R.sfx("ping", W("l2", "наклейк"), .5);
  // 4. ряды разборки: камера плывёт вдоль, бирки по словам
  swap("eng", "aisle", st.l3 - .7);
  tl.fromTo("#row", { x: 0 }, { x: -260, duration: en.l3 - st.l3 + .6, ease: "none", immediateRender: false }, st.l3 - .3);
  [["#tg09", "девятк"], ["#tg14", "четырк"], ["#tgpr", "приор"]].forEach(([s, w]) => slam(s, W("l3", w), "pop"));
  // 5. из-под капота: Михалыч поддевает наклейку — под ней 340 000
  swap("aisle", "hood", st.m1 - .7, "cut");
  tl.fromTo(cam, { s: 1.12, y: 80 }, { s: 1, y: 0, duration: 1.6, ease: "power2.out", immediateRender: false }, st.m1 - .6);
  const peel = W("m1", "триста") - .4;
  tl.to("#bstk", { x: 170, y: -80, rotation: -22, duration: .5, ease: "power2.inOut" }, peel); R.sfx("swish", peel, .9); R.sfx("tap", peel + .45, .6);
  tl.to("#m-armR", { rotation: -40, duration: .25, yoyo: true, repeat: 1 }, peel - .1);
  // 6. Королла по частям: ценники по одному
  swap("hood", "parts", st.l4 - .7);
  ["#pt0", "#pt1", "#pt2", "#pt3"].forEach((s, i) => slam(s, st.l4 + .4 + i * .45, "clack"));
  slam("#dearer", W("l4", "дороже"), "impact");
  // 7. петля
  swap("parts", "loop", st.l5 - .6);
  tl.to("#s-gauge", { opacity: 1, duration: .2 }, st.s2 - .3);
  slam("#learns", W("l6", "учит"), "ping");
  // 8. мораль
  swap("loop", "moral", st.rule - .7);
  tl.fromTo("#moralCard", { opacity: 0, y: 160 }, { opacity: 1, y: 0, duration: .4, ease: "expo.out", immediateRender: false }, st.rule - .4);
  [W("rule", "компресс"), W("rule", "номер"), W("rule", "наклейк"), W("rule", "целые")].forEach((at, i) => { tl.fromTo(`#mo${i}`, { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: .22, immediateRender: false }, at); R.sfx("pop", at, .5); });
  ending(R, st.end - .15);
};
