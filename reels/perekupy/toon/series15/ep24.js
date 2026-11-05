// «ТАКСИ ПОД ПРИКРЫТИЕМ» — 7 сцен: авторынок (продажа + осмотр), таксопарк (флешбэк), покрасочная, СТО Михалыча, разборки, поликлиника, мораль.
// Hyundai владельца: белый — «одна хозяйка», жёлтый с шашкой — он же в такси. Каждый, кто говорит, — в кадре.
$("#title .a").textContent = E.rubric; $("#title .b").style.display = "none"; $("#tag span").textContent = "такси";
$("#title .a").style.cssText = "font-size:76px;background:#f5c400;color:#151515";
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
// Hyundai мордой влево; taxi — жёлтый с шашкой (id шашки: <id>k), белый — с двумя дырками на крыше
const car = (id, l, t, w, z = 3, taxi = false, extra = "") => `<div class="hy" id="${id}" style="left:${l}px;top:${t}px;width:${w}px;height:${w * .316}px;z-index:${z};${extra}">
  <img src="../../kit/img/hyundai/hyundai${taxi ? "_taxi" : ""}.png">
  ${taxi ? `<div class="shk" id="${id}k" style="left:46%;top:${-w * .05}px;width:${w * .13}px;height:${w * .045}px;--c:${w * .0217}px"></div>`
    : `<i class="hole" style="left:47%;top:${w * .006}px;width:${w * .012}px;height:${w * .012}px"></i><i class="hole" style="left:57%;top:${w * .006}px;width:${w * .012}px;height:${w * .012}px"></i>`}</div>`;
const zoom = (id, svg, l, t, d, cap) => `<div class="zm" id="${id}" style="left:${l}px;top:${t}px;width:${d}px;height:${d}px">${svg}</div>`
  + `<div class="zcap" id="${id}c" style="left:${l - 20}px;top:${t + d - 30}px">${cap}</div>`;
const odo = (id, v, l, t, c = "#ffd23f", fs = 54) => `<div class="odo2" id="${id}" style="left:${l}px;top:${t}px;color:${c};font-size:${fs}px">${v}</div>`;
const WHEEL = `<svg viewBox="0 0 300 300"><rect width="300" height="300" fill="#2a2d34"/><circle cx="150" cy="160" r="110" fill="none" stroke="#151515" stroke-width="40"/>
  <circle cx="150" cy="160" r="110" fill="none" stroke="#5a5f6a" stroke-width="28"/><path d="M95 95 a80 80 0 0 1 110 0" stroke="#fff" stroke-width="12" fill="none" opacity=".9"/>
  <path d="M60 170 a95 95 0 0 0 40 70" stroke="#fff" stroke-width="10" fill="none" opacity=".8"/><circle cx="150" cy="160" r="38" fill="#151515"/><path d="M150 160 L60 175 M150 160 L240 175 M150 160 L150 260" stroke="#151515" stroke-width="26"/>
  <text x="150" y="40" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="26" fill="#ffd23f">✨ ✨ ✨</text></svg>`;
const ROOF = `<svg viewBox="0 0 300 300"><rect width="300" height="300" fill="#bfe3ff"/><path d="M-10 150 q160 -70 320 0 v160 h-320 z" fill="#f4f6f8" stroke="#151515" stroke-width="8"/>
  <circle cx="105" cy="140" r="20" fill="#151515"/><circle cx="195" cy="140" r="20" fill="#151515"/><circle cx="105" cy="140" r="30" fill="none" stroke="#c9ced6" stroke-width="5"/><circle cx="195" cy="140" r="30" fill="none" stroke="#c9ced6" stroke-width="5"/></svg>`;
const SEAL = `<svg viewBox="0 0 300 300"><rect width="300" height="300" fill="#f4f6f8"/><path d="M0 120 h300 v40 h-300 z" fill="#151515"/><path d="M20 160 q60 30 130 0 q70 -26 140 6 v30 h-270 z" fill="#f5c400" stroke="#151515" stroke-width="5"/>
  <path d="M120 110 q30 -60 60 -10" stroke="#151515" stroke-width="8" fill="none"/></svg>`;
const SER = ["s2", "s3", "s4"], TOL = ["t", "t2"];

// 1–2. авторынок: продажа и осмотр
scene("mk", "market");
add("mk", car("c1", 230, 1150, 620) + hero("tolyan", "t", 10, 800, .9) + hero("seryoga", "s", 760, 840, .8) + odo("od1", "ПРОБЕГ 40 000", 330, 1080, "#4cd964", 36)
  + zoom("zW", WHEEL, 300, 900, 240, "РУЛЬ КАК ЗЕРКАЛО") + zoom("zR", ROOF, 560, 1040, 200, "ДЫРКИ НА КРЫШЕ"));
// 3. таксопарк, три года назад
scene("tp", "taxipark");
add("tp", car("c2", 200, 1200, 680, 6, true) + odo("od2", "40 000 КМ", 300, 1080, "#ff3b30", 46) + stamp("rate", "★ 4.97 · 18 432 ПОЕЗДКИ", 540, 1000, "#f5c400", "#151515", 30, 3)
  + stamp("ago1", "⏪ ТРИ ГОДА НАЗАД", 60, 560, "#151515", "#ffd23f", 40, -3) + `<div class="vhs" id="vhs"></div>`);
// 4. покрасочная камера
scene("pb", "paintbooth");
add("pb", car("c3", 170, 1200, 680, 4, true) + car("c4", 170, 1200, 680, 5, false, "clip-path:inset(0 0 0 100%)")
  + hero("perekup", "x1", 820, 860, .75, 6, { jacket: "#f4f6f8", cap: "#2e86de" }) + odo("od3", "612 000", 120, 960, "#ffd23f", 46)
  + stamp("garage", "ШАШКА — В ГАРАЖ", 560, 1100, "#151515", "#ffd23f", 30, 4) + stamp("ago2", "⏪ МЕСЯЦ НАЗАД", 60, 560, "#151515", "#ffd23f", 40, -3));
// 5. СТО у Михалыча
scene("sto", "sto");
add("sto", car("c5", 240, 1220, 600) + hero("mihalych", "m", 10, 820, .9) + hero("seryoga", "s2", 780, 860, .8) + zoom("zS", SEAL, 420, 900, 240, "ЖЁЛТОЕ ПОД УПЛОТНИТЕЛЕМ"));
// 6. разборки на рынке
scene("mk3", "market");
add("mk3", car("c6", 230, 1150, 620) + `<div class="shk ghost" id="ghost" style="left:${230 + 620 * .46}px;top:${1150 - 620 * .05}px;width:${620 * .13}px;height:${620 * .045}px;--c:${620 * .0217}px"></div>`
  + hero("seryoga", "s3", 20, 820, .85) + hero("tolyan", "t2", 700, 800, .9));
// 7. поликлиника № 3
scene("cl", "clinic");
add("cl", car("c7", 40, 1180, 560) + hero("seryoga", "s4", 470, 860, .8) + hero("galya", "g", 760, 840, .8)
  + stamp("back", "НА ЗАДНЕМ СИДЕНЬЕ", 140, 1500, "#ff3b30", "#fff", 44, -3));
// 8. мораль
scene("moral", "sto");
add("moral", `<div class="card" id="moralCard" style="top:400px;z-index:20"><h3>БЫВШЕЕ ТАКСИ ВИДНО</h3>
  <div class="li" id="mo0">🔩 Следы крепления шашки на крыше</div><div class="li" id="mo1">🎯 Стёртый руль и сиденье при «малом» пробеге</div>
  <div class="li" id="mo2">🟡 Чужая краска под уплотнителями</div><div class="li" id="mo3">📋 Номер — в реестр такси, в ПТС — не юрлицо ли</div>
  <div class="rule" id="mo4">🔔 Свежие объявления — бот «Перехват»</div></div>`);

TOL.forEach(p => { const s = document.getElementById(p + "-shades"); if (s) s.style.display = ""; });
$("#end h2").innerHTML = E.end;
const bub = (line, html, l, t, tx, fs) => { const b = bubble(line, html, l, t, tx); if (fs) b.style.fontSize = fs + "px"; return b; };
bub("t1", "Одна хозяйка! Ездила<br><em>в поликлинику и обратно!</em>", 140, 620, 120, 44);
bub("s1", "А почему руль<br><em>блестит, как лысина?</em>", 400, 640, 520, 44);
bub("t2", "Хозяйка руль любила.<br><em>Полировала!</em>", 20, 640, 150);
bub("s2", "А дырки<br><em>на крыше?</em>", 500, 640, 420);
bub("t3", "Антенна! Бабушка<br><em>радио слушала!</em>", 20, 640, 150);
bub("m1", "Это такси, сынок.<br><em>Тысяч шестьсот.</em>", 60, 640, 120);
bub("s3", "А как же<br><em>поликлиника?</em>", 420, 640, 500);
bub("m2", "Возила.<br><em>Всех подряд.</em>", 60, 640, 120);
bub("s4", "Толян,<br><em>это же такси!</em>", 30, 640, 150);
bub("t4", "Брат, зато опытная!<br><em>Дорогу сама знает!</em>", 300, 640, 580, 44);
bub("g1", "Это ж моя ласточка! Три года<br><em>меня в поликлинику возила!</em>", 60, 640, 830, 40);
bub("s5", "Так вот кто<br><em>«одна хозяйка»…</em>", 260, 640, 380);

window.build = R => {
  const tl = R.tl, cam = R.camera($("#cam"), { hand: .6 });
  R.grain(.03);
  gsap.set(".scn", { opacity: 0 }); gsap.set("#sc_mk", { opacity: 1 });
  const { pop } = common(R, cam, { mood: (k, t) => (k === "seryoga" ? "flat" : "grin") });
  R.hooks.push(t => { const f = Math.floor(t * 30), talk = lv => lv > .28 && !(lv < .55 && f % 3 === 2);
    const ls = (LIP.seryoga || [])[f] || 0, lt = (LIP.tolyan || [])[f] || 0;
    SER.forEach(p => { if (document.getElementById(p)) mouth(p, talk(ls) ? "talk" : (p === "s4" && t > st.s5 ? "o" : "flat")); });
    TOL.forEach(p => { if (p !== "t" && document.getElementById(p)) mouth(p, talk(lt) ? "talk" : "grin"); }); });
  const swap = (from, to, at, kind = "swipe") => {
    if (kind === "cut") { tl.set(`#sc_${from}`, { opacity: 0 }, at).set(`#sc_${to}`, { opacity: 1, x: 0, filter: "none" }, at); R.sfx("hit", at, .4); return; }
    tl.set(`#sc_${to}`, { opacity: 1, x: 1080, filter: "blur(14px)" }, at)
      .to(`#sc_${from}`, { x: -1080, filter: "blur(14px)", duration: .35, ease: "power3.in" }, at)
      .to(`#sc_${to}`, { x: 0, filter: "blur(0px)", duration: .38, ease: "power3.out" }, at + .12)
      .set(`#sc_${from}`, { opacity: 0, x: 0, filter: "none" }, at + .5);
    R.sfx("whoosh", at, .6);
  };
  window.MUSIC = { style: "bed", bpm: 100, end: R.dur - 1.2, mute: [[st.l3 - .2, st.l3 + .6]] };
  const ids = E.lines.map(l => l.id);
  for (const l of ["t1", "s1", "t2", "s2", "t3", "m1", "s3", "m2", "s4", "t4", "g1", "s5"]) { const nx = ids[ids.indexOf(l) + 1]; pop("#b_" + l, st[l] - .05, Math.min(en[l] + .9, st[nx] - .1)); }
  const slam = (sel, at, sfx = "impact") => { tl.fromTo(sel, { opacity: 0, scale: 2 }, { opacity: 1, scale: 1, duration: .18, ease: "power4.out", immediateRender: false }, at); R.sfx(sfx, at + .02, .7); };
  const zin = (id, at, until) => { tl.fromTo(`#${id}, #${id}c`, { opacity: 0, scale: .4 }, { opacity: 1, scale: 1, duration: .3, ease: "back.out(2)", immediateRender: false }, at).to(`#${id}, #${id}c`, { opacity: 0, duration: .2 }, until); R.sfx("pop", at, .6); };
  // счётчики пробега: [id, от, до, начало, конец]
  const CNT = [["od2", 40000, 612000, st.l1 + .2, W("l1", "заказ") + .4, " КМ"], ["od3", 612000, 40000, W("l2", "600") - .2, W("l2", "40") + .3, ""]];
  R.hooks.push(t => CNT.forEach(([id, a, b, t0, t1, sfx]) => { const k = Math.min(1, Math.max(0, (t - t0) / (t1 - t0))), v = Math.round((a + (b - a) * k) / 1000) * 1000;
    document.getElementById(id).textContent = (id === "od3" ? (k > 0 ? "612 000 → " : "") : "") + v.toLocaleString("ru-RU").replace(/ /g, " ") + sfx; }));

  // 1. продажа
  tl.to("#title", { opacity: 0, y: -50, duration: .25 }, st.h - .2);
  slam("#od1", W("h", "пробег"), "pop");
  tl.fromTo(cam, { s: 1 }, { s: 1.06, duration: 1.2, ease: "power2.out", immediateRender: false }, W("h", "угадай")).to(cam, { s: 1, duration: .4 }, st.s1 - .3);
  // 2. осмотр: лупы
  zin("zW", st.s1 + .3, st.s2 - .2); zin("zR", st.s2 + .1, en.t3 + .3);
  // 3. таксопарк: перемотка
  swap("mk", "tp", st.l1 - .8, "cut");
  tl.fromTo("#vhs", { opacity: 1 }, { opacity: 0, duration: .7, immediateRender: false }, st.l1 - .3); R.sfx("glitch", st.l1 - .8, 1);
  slam("#ago1", st.l1 - .3, "pop");
  tl.fromTo("#c2", { x: -900 }, { x: 0, duration: .9, ease: "power3.out", immediateRender: false }, st.l1 - .2); R.sfx("riser", st.l1 - .2, .5);
  slam("#rate", W("l1", "заказ"), "ping");
  for (let k = 0; k < 6; k++) R.sfx("tick", st.l1 + .3 + k * .45, .35);
  // 4. покрасочная: белая полоса идёт по машине, шашка улетает, пробег скручивают
  swap("tp", "pb", st.l2 - .7);
  slam("#ago2", st.l2 - .3, "pop");
  tl.fromTo("#c4", { clipPath: "inset(0 0 0 100%)" }, { clipPath: "inset(0 0 0 0%)", duration: 1.6, ease: "none", immediateRender: false }, W("l2", "жёлт") - .1)
    .fromTo("#X1", { x: 0 }, { x: -620, duration: 1.6, ease: "none", immediateRender: false }, W("l2", "жёлт") - .1);
  R.sfx("swish", W("l2", "жёлт"), .6); R.sfx("swish", W("l2", "жёлт") + .8, .6);
  tl.to("#c3k", { y: -500, rotation: 40, opacity: 0, duration: .6, ease: "power2.in" }, W("l2", "шашк") + .1); R.sfx("whoosh", W("l2", "шашк") + .2, .6);
  slam("#garage", W("l2", "гараж"), "pop");
  // 5. СТО: лупа на уплотнитель
  swap("pb", "sto", st.m1 - .7);
  zin("zS", W("m1", "уплотн") - .1, W("m1", "это") - .1);
  R.punch(cam, W("m1", "такси"), .08);
  // 6. разборки: призрачная шашка
  swap("sto", "mk3", st.s4 - .6);
  tl.fromTo("#ghost", { opacity: 0, y: 20 }, { opacity: .7, y: 0, duration: .5, immediateRender: false }, W("t4", "дорог")); R.sfx("ping", W("t4", "дорог"), .5);
  // 7. поликлиника: машина подъезжает к остановке
  swap("mk3", "cl", st.g1 - .9);
  tl.fromTo("#c7", { x: -700 }, { x: 0, duration: .8, ease: "power3.out", immediateRender: false }, st.g1 - .8);
  tl.fromTo("#g-armR", { rotation: 0 }, { rotation: -25, duration: .2, yoyo: true, repeat: 3, immediateRender: false }, st.g1);
  slam("#back", W("l3", "заднем"), "impact");
  // 8. мораль
  swap("cl", "moral", st.rule - .7);
  tl.fromTo("#moralCard", { opacity: 0, y: 160 }, { opacity: 1, y: 0, duration: .4, ease: "expo.out", immediateRender: false }, st.rule - .4);
  [W("rule", "крыш"), W("rule", "руль"), W("rule", "уплотн"), W("rule", "реестр"), W("rule", "перехват") - .2].forEach((at, i) => { tl.fromTo(`#mo${i}`, { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: .22, immediateRender: false }, at); R.sfx("pop", at, .5); });
  ending(R, st.end - .15);
};
