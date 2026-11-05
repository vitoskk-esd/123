// «ЯПОНСКИЙ АУКЦИОН» — 7 сцен: комната Серёги (аукцион на ноутбуке), сплит-звонок с Геной, порт Владивостока (Королла выезжает из контейнера),
// аукционный лист крупно, СТО Михалыча, сплит-звонок «R — это Россия», мораль. Каждый, кто говорит, — в кадре; Лис — за кадром.
$("#title .a").textContent = E.rubric; $("#title .b").style.display = "none"; $("#tag span").textContent = "аукцион";
$("#title .a").style.cssText = "font-size:78px;background:#c0392b;color:#fff";
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
const panel = (id, bg, l, bx, inner) => `<div class="pan2" id="${id}" style="left:${l}px"><div class="pin2" style="left:${-bx}px">${BGS[bg].replace('id="bg"', "")}</div>${inner}</div>`;
const GENA = { vest: true, jacket: "#2b3a55", pants: "#2b2f37", cap: "#1d1d1f", hair: "#3a2d22", beard: true, item: "phone" };
const COR = (id, l, t, w, z = 3) => `<img class="pcar" id="${id}" src="../../kit/img/corolla/corolla.png" style="left:${l}px;top:${t}px;width:${w}px;z-index:${z}">`;
const AUC = `<div class="auc" id="auc"><div class="ah">JAPAN AUCTION · LOT 51288</div>
  <div class="ab"><div class="ap"><img src="../../kit/img/corolla/corolla.png"></div><div class="ai">Toyota Corolla<br>Пробег: 38 000 км<br><b>ОЦЕНКА 4.5</b></div></div>
  <div class="at">СТАВКА ¥ 480 000 · <span id="aucT">00:12</span></div></div>`;
const MARK = (id, t, x, y) => `<text id="${id}" x="${x}" y="${y}" font-family="JetBrains Mono" font-weight="800" font-size="34" fill="#ff3b30">${t}</text>`;
const SHEET = `<div class="el" id="sheet" style="left:160px;top:640px;width:760px;height:640px;z-index:8"><svg viewBox="0 0 760 640" style="width:100%;height:100%">
  <rect x="6" y="6" width="748" height="628" fill="#fbf7ec" stroke="#151515" stroke-width="8"/>
  <rect x="6" y="6" width="748" height="64" fill="#e8e1cf" stroke="#151515" stroke-width="6"/><text x="30" y="50" font-family="Unbounded" font-weight="900" font-size="28">AUCTION SHEET · 51288</text>
  <g id="gradeR"><circle cx="660" cy="150" r="64" fill="none" stroke="#ff3b30" stroke-width="10"/><text x="660" y="182" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="90" fill="#ff3b30">R</text></g>
  <g fill="none" stroke="#151515" stroke-width="6"><rect x="120" y="120" width="300" height="480" rx="90"/><path d="M150 230 h240 M150 470 h240 M120 330 h300 M120 380 h300"/>
    <rect x="160" y="250" width="220" height="70" rx="16"/><rect x="160" y="400" width="220" height="60" rx="16"/></g>
  ${MARK("mA", "A2", 200, 175)}${MARK("mU", "U3", 330, 205)}${MARK("mX", "XX", 60, 300)}${MARK("mW", "W2", 440, 300)}${MARK("mX2", "XX", 440, 420)}${MARK("mA2", "A3", 60, 430)}${MARK("mU2", "U2", 230, 560)}${MARK("mW2", "W3", 330, 540)}
  <text x="500" y="560" font-family="Onest" font-weight="800" font-size="24" fill="#6b7280">mileage 38 000 km?</text></svg></div>`;
const CONT = `<div class="el" id="cont" style="left:160px;top:930px;width:640px;height:330px;z-index:5"><svg viewBox="0 0 640 330" style="width:100%;height:100%;overflow:visible">
  <rect id="contDoor" x="470" y="10" width="40" height="300" fill="#a93226" stroke="#151515" stroke-width="6" transform="skewY(-12)" transform-origin="470 10"/>
  <rect x="0" y="10" width="470" height="300" fill="#c0392b" stroke="#151515" stroke-width="8"/>
  ${Array.from({ length: 12 }, (_, i) => `<path d="M${20 + i * 38} 26 v268" stroke="#151515" stroke-width="3" opacity=".35"/>`).join("")}
  <rect x="440" y="10" width="30" height="300" fill="#151515" opacity=".55"/><path d="M470 310 L560 330 H470 Z" fill="#5b6068" stroke="#151515" stroke-width="5"/>
  <text x="60" y="70" font-family="JetBrains Mono" font-weight="800" font-size="28" fill="#f4e7c3" opacity=".8">MOLU 451288-1</text></svg></div>`;
const SER = ["s", "s2", "s3", "s4"], GEN = ["g", "g2", "g3"];

// 1. комната: аукцион на ноутбуке
scene("flat", "flat");
add("flat", AUC + hero("seryoga", "s", 700, 900, .85, 9));
// 2. звонок Гене
scene("call", null);
add("call", `<div class="el" style="inset:0;background:#0b0c10"></div>` + panel("pL", "flat", 20, 260, hero("seryoga", "s2", 40, 200, .8)) + panel("pR", "port", 548, 120, hero("perekup", "g", 60, 200, .85, 6, GENA)));
// 3. порт: Королла выезжает из контейнера
scene("port", "port");
add("port", CONT + COR("car1", 470, 1066, 520, 4) + hero("perekup", "g2", 10, 760, .65, 6, GENA) + stamp("gradeSt", "ОЦЕНКА… R", 620, 900, "#ff3b30", "#fff", 50, 4)
  + `<div class="el" id="gull" style="left:900px;top:600px;width:80px;height:40px;z-index:7"><svg viewBox="0 0 80 40"><path d="M4 30 q18 -26 36 0 q18 -26 36 0" fill="none" stroke="#151515" stroke-width="6" stroke-linecap="round"/></svg></div>`);
// 4. аукционный лист
scene("sheet", "desk");
add("sheet", SHEET + stamp("nA", "A — ЦАРАПИНА", 60, 540, "#ffd23f", "#151515", 32, -4) + stamp("nU", "U — ВМЯТИНА", 600, 530, "#ffd23f", "#151515", 32, 3)
  + stamp("nW", "W — ШПАКЛЁВКА", 40, 1400, "#ffd23f", "#151515", 32, 3) + stamp("nX", "XX — ЗАМЕНА", 640, 1420, "#ffd23f", "#151515", 32, -3)
  + stamp("nR", "R — БЫЛА В ДТП", 300, 1520, "#ff3b30", "#fff", 40, -2));
// 5. СТО
scene("sto", "sto");
add("sto", COR("car2", 240, 1210, 600) + hero("mihalych", "m", 10, 820, .9) + hero("seryoga", "s3", 780, 860, .8)
  + `<div class="el" id="seam" style="left:528px;top:1196px;width:10px;height:150px;z-index:4;background:repeating-linear-gradient(180deg,#ff3b30 0 14px,transparent 14px 24px);opacity:0"></div>`);
// 6. звонок: «R — это Россия»
scene("call2", null);
add("call2", `<div class="el" style="inset:0;background:#0b0c10"></div>` + panel("qL", "sto", 20, 300, hero("seryoga", "s4", 40, 200, .8)) + panel("qR", "port", 548, 120, hero("perekup", "g3", 60, 200, .85, 6, GENA)));
// 7. мораль
scene("moral", "port");
add("moral", `<div class="card" id="moralCard" style="top:380px;z-index:20"><h3>АУКЦИОН БЕЗ СЮРПРИЗОВ</h3>
  <div class="li" id="mo0">📄 Перевод листа — до ставки</div><div class="li" id="mo1">🅡 «R» и «RA» — была в ДТП</div>
  <div class="li" id="mo2">🔤 Буквы на схеме — это ремонт</div><div class="li" id="mo3">🤝 Посредник — по договору</div>
  <div class="rule" id="mo4">🔔 Свежие объявления — бот «Перехват»</div></div>`);

$("#end h2").innerHTML = E.end;
const bub = (line, html, l, t, tx, fs) => { const b = bubble(line, html, l, t, tx); if (fs) b.style.fontSize = fs + "px"; return b; };
bub("s1", "Оценка четыре с половиной!<br><em>Почти пятёрка!</em>", 140, 730, 580, 44);
bub("g1", "Брат, четыре с половиной — как с завода.<br><em>Предоплата сто процентов.</em>", 40, 620, 720, 34);
bub("s2", "А лист аукционный<br><em>покажете?</em>", 40, 620, 170, 44);
bub("g2", "Там всё по-японски.<br><em>Тебе не надо.</em>", 480, 620, 280, 44);
bub("g3", "Брат, приплыла!<br><em>Почти целая!</em>", 40, 600, 150);
bub("m1", "Перед — от одной, зад — от другой.<br><em>Японцы тоже собирают из двух.</em>", 40, 640, 140, 36);
bub("s3", "Так там же четыре<br><em>с половиной было!</em>", 480, 640, 400, 42);
bub("m2", "Четыре с половиной — это сколько<br><em>раз её красили.</em>", 40, 640, 140, 36);
bub("s4", "Гена, в листе<br><em>была «R»!</em>", 40, 620, 170, 46);
bub("g4", "Брат, «R» — это «Россия».<br><em>Значит, к нам ехала.</em>", 340, 620, 440, 40);

window.build = R => {
  const tl = R.tl, cam = R.camera($("#cam"), { hand: .6 });
  R.grain(.03);
  gsap.set(".scn", { opacity: 0 }); gsap.set("#sc_flat", { opacity: 1 }); gsap.set("#seam", { opacity: 0 });
  const { pop } = common(R, cam, { mood: () => "grin" });
  R.hooks.push(t => { const f = Math.floor(t * 30), talk = lv => lv > .28 && !(lv < .55 && f % 3 === 2);
    const ls = (LIP.seryoga || [])[f] || 0, lg = (LIP.gena || [])[f] || 0;
    SER.forEach(p => { if (p !== "s" && document.getElementById(p)) mouth(p, talk(ls) ? "talk" : "o"); });
    GEN.forEach(p => { if (document.getElementById(p)) mouth(p, talk(lg) ? "talk" : "grin"); });
    const left = Math.max(0, 12 - Math.floor(Math.max(0, t - .5) * 2.2)); $("#aucT").textContent = `00:${String(left).padStart(2, "0")}`;
    $("#gull").style.transform = `translate(${-((t * 70) % 1200)}px,${Math.sin(t * 2) * 20}px)`; });
  const swap = (from, to, at, kind = "swipe") => {
    if (kind === "cut") { tl.set(`#sc_${from}`, { opacity: 0 }, at).set(`#sc_${to}`, { opacity: 1, x: 0, filter: "none" }, at); R.sfx("hit", at, .4); return; }
    tl.set(`#sc_${to}`, { opacity: 1, x: 1080, filter: "blur(14px)" }, at)
      .to(`#sc_${from}`, { x: -1080, filter: "blur(14px)", duration: .35, ease: "power3.in" }, at)
      .to(`#sc_${to}`, { x: 0, filter: "blur(0px)", duration: .38, ease: "power3.out" }, at + .12)
      .set(`#sc_${from}`, { opacity: 0, x: 0, filter: "none" }, at + .5);
    R.sfx("whoosh", at, .6);
  };
  window.MUSIC = { style: "bed", bpm: 96, end: R.dur - 1.2, mute: [[st.g4 - .2, en.g4 + .3]] };
  const ids = E.lines.map(l => l.id);
  const SW = { g1: st.g1 - .7, l1: st.l1 - .7, l3: st.l3 - .7, m1: st.m1 - .7, s4: st.s4 - .7, rule: st.rule - .7 };
  for (const l of ["s1", "g1", "s2", "g2", "g3", "m1", "s3", "m2", "s4", "g4"]) {
    const nx = ids[ids.indexOf(l) + 1]; const ns = SW[nx] ? SW[nx] - .05 : 1e9;
    pop("#b_" + l, st[l] - .05, Math.min(en[l] + .9, st[nx] - .1, ns)); }
  const slam = (sel, at, sfx = "impact") => { tl.fromTo(sel, { opacity: 0, scale: 2 }, { opacity: 1, scale: 1, duration: .18, ease: "power4.out", immediateRender: false }, at); R.sfx(sfx, at + .02, .7); };

  // 1. аукцион: «ставка!» — экран вспыхивает
  tl.to("#title", { opacity: 0, y: -50, duration: .25 }, st.s1 - .1);
  tl.fromTo("#auc", { scale: .9, opacity: 0 }, { scale: 1, opacity: 1, duration: .35, ease: "back.out(1.8)", immediateRender: false }, .2);
  R.punch(cam, W("h", "что"), .06); R.sfx("ping", W("h", "что"), .5);
  for (let k = 0; k < 6; k++) R.sfx("tick", .5 + k * .45, .3);
  // 2. звонок
  swap("flat", "call", st.g1 - .7, "cut"); R.sfx("ring", st.g1 - .6, .5);
  tl.fromTo("#pL", { x: -560 }, { x: 0, duration: .35, ease: "power3.out", immediateRender: false }, st.g1 - .7).fromTo("#pR", { x: 560 }, { x: 0, duration: .35, ease: "power3.out", immediateRender: false }, st.g1 - .7);
  // 3. порт: дверь контейнера, машина выкатывается
  swap("call", "port", st.l1 - .7);
  tl.fromTo("#car1", { x: -330 }, { x: 0, duration: 2.2, ease: "power1.out", immediateRender: false }, st.l1); R.sfx("riser", st.l1, .4);
  slam("#gradeSt", W("l2", "ключ"), "impact");
  // 4. лист: пометки и стикеры по словам
  swap("port", "sheet", st.l3 - .7);
  tl.fromTo("#sheet", { y: 200, rotation: 6 }, { y: 0, rotation: 0, duration: .5, ease: "back.out(1.4)", immediateRender: false }, st.l3 - .5);
  [["#nA", "царап"], ["#nU", "вмят"], ["#nW", "шпакл"], ["#nX", "замен"], ["#nR", "дтп"]].forEach(([s, w]) => slam(s, W("l3", w), "pop"));
  tl.fromTo("#gradeR", { scale: 1 }, { scale: 1.3, svgOrigin: "660 150", duration: .2, yoyo: true, repeat: 1, immediateRender: false }, W("l3", "дтп"));
  R.punch(cam, W("l3", "морск"), .08); R.sfx("boom", W("l3", "убит"), .5);
  // 5. СТО: шов посередине кузова
  swap("sheet", "sto", st.m1 - .7);
  tl.to("#seam", { opacity: 1, duration: .3 }, W("m1", "за")); R.sfx("ping", W("m1", "за"), .5);
  // 6. звонок: R — Россия
  swap("sto", "call2", st.s4 - .7, "cut"); R.sfx("ring", st.s4 - .6, .5);
  tl.fromTo("#qL", { x: -560 }, { x: 0, duration: .35, ease: "power3.out", immediateRender: false }, st.s4 - .7).fromTo("#qR", { x: 560 }, { x: 0, duration: .35, ease: "power3.out", immediateRender: false }, st.s4 - .7);
  R.punch(cam, W("g4", "росси"), .08);
  // 7. мораль
  swap("call2", "moral", st.rule - .7);
  tl.fromTo("#moralCard", { opacity: 0, y: 160 }, { opacity: 1, y: 0, duration: .4, ease: "expo.out", immediateRender: false }, st.rule - .4);
  [st.rule + .1, W("rule", "r"), W("rule", "букв"), W("rule", "посредн"), W("rule", "перехват") - .2].forEach((at, i) => { tl.fromTo(`#mo${i}`, { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: .22, immediateRender: false }, at); R.sfx("pop", at, .5); });
  ending(R, st.end - .15);
};
