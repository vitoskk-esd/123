// «ТЕСТ-ДРАЙВ» — 7 сцен: улица (продажа, залог), «кукла» на лавочке, кабинет участкового, сплит-звонок (Перехват), парковка ТЦ, мораль.
// Гелик владельца (kit/img/gelik). Каждый, кто говорит, — в кадре: Толян, Аркадий, участковый, Серёга; Лис — за кадром.
$("#title .a").textContent = E.rubric; $("#title .b").style.display = "none"; $("#tag span").textContent = "тест-драйв";
$("#title .a").style.cssText = "font-size:110px;background:#151515;color:#fff";
document.querySelector("#cam > svg#bg")?.remove();
BGS.mall = BGS.mall.replace('<g fill="#ff2ea6" opacity=".18">', '<g fill="#ff2ea6" opacity="0">');   // без розового блика за Геликом
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
// Гелик 3/4: l,t,w — как на раскадровке (низ колёс там же, где был у Камри)
const gelik = (id, l, t, w, z = 3) => `<img class="pcar" id="${id}" src="../../kit/img/gelik/gelik_34.png" style="left:${l - w * .08}px;top:${t + w * .476 - w * 1.16 * .69}px;width:${w * 1.16}px;z-index:${z}">`;
const panel = (id, bg, l, bx, inner) => `<div class="pan2" id="${id}" style="left:${l}px"><div class="pin2" style="left:${-bx}px">${BGS[bg].replace('id="bg"', "")}</div>${inner}</div>`;
const phone = (id, l, t, w, inner) => `<div class="ph" id="${id}" style="left:${l}px;top:${t}px;width:${w}px;height:${w * 1.9}px"><div class="scr">${inner}</div></div>`;
const ARK = { coat: "#c69c6d", jacket: "#c69c6d", glasses: true, mustache: true, hair: "#2b1d14", tie: "#8e1b1b" };
const COP = { police: true, jacket: "#1f2f5a", pants: "#1f2f5a", mustache: true, hair: "#5a4636", look: "angry" };
const BOT = `<div class="botw"><div class="bh">🦊 Перехват · 2 сек назад</div><div class="bc"><img src="../../kit/img/gelik/gelik_34.png">
  <div class="adt">Mercedes G 63 · 9 900 000 ₽</div><div class="lo">⚡ ниже рынка на 4 млн</div><div class="ok" style="color:#151515">«Одна хозяйка. Срочно. Торг.»</div></div></div>`;
const DOLL = `<div class="el" id="doll" style="left:590px;top:880px;width:340px;height:221px;z-index:9"><svg viewBox="0 0 400 260" style="overflow:visible">
  <rect x="10" y="40" width="380" height="210" rx="20" fill="#1f2a44" stroke="#151515" stroke-width="8"/><path d="M10 90 h380" stroke="#3b4a6b" stroke-width="6"/>
  <g id="paper"><rect x="60" y="20" width="280" height="110" rx="6" fill="#f4e7c3" stroke="#151515" stroke-width="6"/><g stroke="#9a8a6a" stroke-width="4">${[40, 56, 72, 88, 104].map(y => `<path d="M80 ${y} h240"/>`).join("")}</g></g>
  <g id="bill"><rect x="60" y="6" width="280" height="30" rx="6" fill="#e07a5f" stroke="#151515" stroke-width="6"/><text x="200" y="28" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="20" fill="#fff">5000</text></g></svg></div>`;
const TOL = ["t", "t2", "t3", "t4", "t5", "t6"], ARKS = ["a", "a2", "a3"], COPS = ["c", "c2"];

// 1. улица: «дай прокатиться»
scene("st1", "street");
add("st1", gelik("g1", 260, 1130, 560) + hero("tolyan", "t", 10, 800, .9) + hero("perekup", "a", 760, 800, .85, 6, ARK));
// 2. залог и отъезд
scene("st2", "street");
add("st2", gelik("g2", 400, 1130, 560) + hero("tolyan", "t2", 10, 800, .9) + hero("perekup", "a2", 760, 800, .85, 7, Object.assign({ item: "bag" }, ARK)));
// 3. «кукла» на лавочке
scene("st3", "street");
add("st3", hero("tolyan", "t3", 40, 820, .9) + DOLL + stamp("doll_st", "«КУКЛА»", 640, 1230, "#ff3b30", "#fff", 44, 4));
// 4. кабинет участкового
scene("pol", "police");
add("pol", hero("perekup", "c", 640, 800, .9, 6, COP) + hero("tolyan", "t4", 30, 820, .9));
// 5. сплит-звонок: Серёга получил пуш
scene("call", null);
add("call", `<div class="el" style="inset:0;background:#0b0c10"></div>` + panel("pL", "minibus", 20, 40, hero("seryoga", "s", 40, 200, .8) + phone("phS", 290, 360, 200, BOT))
  + panel("pR", "police", 548, 20, hero("tolyan", "t5", 60, 200, .85)));
// 6. парковка ТЦ: показ
scene("mall", "mall");
add("mall", gelik("g3", 220, 1150, 540) + hero("perekup", "c2", 230, 885, .75, 5, COP) + hero("tolyan", "t6", 10, 840, .85) + hero("perekup", "a3", 740, 830, .8, 6, ARK));
// 7. мораль
scene("moral", "police");
add("moral", `<div class="card" id="moralCard" style="top:400px;z-index:20"><h3>ТЕСТ-ДРАЙВ БЕЗ СЮРПРИЗОВ</h3>
  <div class="li" id="mo0">🚗 Только вместе с тобой в машине</div><div class="li" id="mo1">🪪 Фото паспорта и прав — до поездки</div>
  <div class="li" id="mo2">🔑 Ключи и документы из рук не выпускай</div><div class="li" id="mo3">💵 «Залог» — пересчитай при нём</div>
  <div class="rule" id="mo4">🔔 Свежие объявления — бот «Перехват»</div></div>`);

$("#over").insertAdjacentHTML("beforeend", `<div id="clk"><span id="clkT">00:00</span></div>`);
TOL.forEach(p => { const s = document.getElementById(p + "-shades"); if (s) s.style.display = ""; });
$("#end h2").innerHTML = E.end;
const bub = (line, html, l, t, tx, fs) => { const b = bubble(line, html, l, t, tx); if (fs) b.style.fontSize = fs + "px"; return b; };
bub("a1", "Беру не глядя. Только дай<br><em>прокатиться — пять минут.</em>", 300, 620, 600, 40);
bub("t1", "Для хорошего человека —<br><em>хоть десять!</em>", 20, 640, 150, 44);
bub("a2", "В залог — сумка.<br><em>Там миллион.</em>", 420, 640, 500);
bub("t2", "…Газета «Из рук в руки».<br><em>Две тысячи третий год.</em>", 60, 640, 170, 42);
bub("c1", "Паспорт его видели?", 380, 660, 440);
bub("t3", "Он сказал —<br><em>Аркадий.</em>", 40, 640, 170);
bub("c2", "У меня таких Аркадиев —<br><em>полрайона.</em>", 320, 640, 500, 42);
bub("s1", "Толян! Твой Гелик продают!<br><em>Ниже рынка!</em>", 40, 620, 140, 42);
bub("t4", "Где?!", 700, 660, 120);
bub("t5", "Тест-драйв окончен,<br><em>Аркадий.</em>", 40, 640, 150);
bub("a3", "…А до угла<br><em>прокатиться можно?</em>", 460, 640, 440, 44);

window.build = R => {
  const tl = R.tl, cam = R.camera($("#cam"), { hand: .6 });
  R.grain(.03);
  gsap.set(".scn", { opacity: 0 }); gsap.set("#sc_st1", { opacity: 1 }); gsap.set("#phS", { opacity: 0 });
  const { pop } = common(R, cam, { mood: () => "grin" });
  R.hooks.push(t => { const f = Math.floor(t * 30), talk = lv => lv > .28 && !(lv < .55 && f % 3 === 2);
    const lt = (LIP.tolyan || [])[f] || 0, la = (LIP.arkady || [])[f] || 0, lc = (LIP.cop || [])[f] || 0;
    TOL.forEach(p => { if (p !== "t" && document.getElementById(p)) mouth(p, talk(lt) ? "talk" : (p === "t3" || p === "t4" ? "flat" : "grin")); });
    ARKS.forEach(p => { if (document.getElementById(p)) mouth(p, talk(la) ? "talk" : (p === "a3" ? "o" : "grin")); });
    COPS.forEach(p => { if (document.getElementById(p)) mouth(p, talk(lc) ? "talk" : "flat"); }); });
  const swap = (from, to, at, kind = "swipe") => {
    if (kind === "cut") { tl.set(`#sc_${from}`, { opacity: 0 }, at).set(`#sc_${to}`, { opacity: 1, x: 0, filter: "none" }, at); R.sfx("hit", at, .4); return; }
    tl.set(`#sc_${to}`, { opacity: 1, x: 1080, filter: "blur(14px)" }, at)
      .to(`#sc_${from}`, { x: -1080, filter: "blur(14px)", duration: .35, ease: "power3.in" }, at)
      .to(`#sc_${to}`, { x: 0, filter: "blur(0px)", duration: .38, ease: "power3.out" }, at + .12)
      .set(`#sc_${from}`, { opacity: 0, x: 0, filter: "none" }, at + .5);
    R.sfx("whoosh", at, .6);
  };
  window.MUSIC = { style: "bed", bpm: 100, end: R.dur - 1.2, mute: [[st.t2 - .3, en.t2 + .3]] };
  const ids = E.lines.map(l => l.id);
  const CUT = { t2: st.c1 - .75, c2: st.l3 - .75, t4: st.t5 - .75 };      // перед сменой сцены пузырь убираем раньше
  for (const l of ["a1", "t1", "a2", "t2", "c1", "t3", "c2", "s1", "t4", "t5", "a3"]) { const nx = ids[ids.indexOf(l) + 1]; pop("#b_" + l, st[l] - .05, Math.min(en[l] + .9, st[nx] - .1, CUT[l] ?? 1e9)); }
  const slam = (sel, at, sfx = "impact") => { tl.fromTo(sel, { opacity: 0, scale: 2 }, { opacity: 1, scale: 1, duration: .18, ease: "power4.out", immediateRender: false }, at); R.sfx(sfx, at + .02, .7); };

  // часы ожидания: 00:00 при залоге → 00:05 на «пять» → 00:40 на «сорок»; видны только пока ждём
  const c0 = st.a2, c5 = W("l1", "пять"), c40 = W("l1", "сорок");
  R.hooks.push(t => { const s = t < c5 ? 300 * Math.max(0, (t - c0) / (c5 - c0)) : t < c40 ? 300 + 2100 * (t - c5) / (c40 - c5) : 2400;
    const m = Math.floor(s / 60), x = Math.floor(s % 60); $("#clkT").textContent = `${String(m).padStart(2, "0")}:${String(x).padStart(2, "0")}`; });
  tl.fromTo("#clk", { opacity: 0, scale: .6 }, { opacity: 1, scale: 1, duration: .3, ease: "back.out(2)", immediateRender: false }, c0).to("#clk", { opacity: 0, duration: .3 }, st.c1 - .8);
  for (let k = 0; k < 6; k++) R.sfx("tick", c5 + k * .25, .35);

  // 1. «дай прокатиться»: ключи
  tl.to("#title", { opacity: 0, y: -50, duration: .25 }, st.t1 - .2);
  tl.fromTo("#t-armR", { rotation: 0, svgOrigin: "292 400" }, { rotation: -30, svgOrigin: "292 400", duration: .3, yoyo: true, repeat: 1, immediateRender: false }, W("t1", "хоть")); R.sfx("clack", W("t1", "хоть") + .2, .6);
  tl.fromTo(cam, { s: 1 }, { s: 1.06, duration: 1.4, ease: "power2.out", immediateRender: false }, st.h).to(cam, { s: 1, duration: .4 }, en.h + .2);
  // 2. залог, Аркадий садится и уезжает
  swap("st1", "st2", st.a2 - .6);
  tl.to("#A2", { opacity: 0, x: -120, duration: .3 }, st.l1 - .2);
  tl.to("#g2", { x: 900, duration: 1.2, ease: "power2.in" }, st.l1 + .1); R.sfx("riser", st.l1, .5); R.sfx("whoosh", st.l1 + .7, .6);
  // 3. «кукла»: купюра слетает — под ней газета
  swap("st2", "st3", W("l1", "потом", 1) - .2);
  tl.to("#bill", { y: -70, rotation: -15, opacity: 0, duration: .5, ease: "power2.out" }, st.t2 - .3); R.sfx("swish", st.t2 - .3, .6);
  slam("#doll_st", W("l2", "кукл") - .1);
  // 4. кабинет участкового
  swap("st3", "pol", st.c1 - .7);
  R.punch(cam, W("c2", "полрайон"), .08); R.sfx("boom", W("c2", "полрайон"), .4);
  // 5. сплит-звонок: пуш бота
  swap("pol", "call", st.l3 - .7, "cut");
  tl.fromTo("#pL", { x: -560 }, { x: 0, duration: .35, ease: "power3.out", immediateRender: false }, st.l3 - .7).fromTo("#pR", { x: 560 }, { x: 0, duration: .35, ease: "power3.out", immediateRender: false }, st.l3 - .7);
  tl.fromTo("#phS", { opacity: 0, y: 80 }, { opacity: 1, y: 0, duration: .35, ease: "back.out(1.8)", immediateRender: false }, W("l3", "прислал")); R.sfx("ping", W("l3", "прислал") + .1, .8);
  R.sfx("ring", st.s1 - .4, .5);
  // 6. показ: Аркадий поднимает руки
  swap("call", "mall", st.t5 - .7);
  tl.to("#a3-armL", { rotation: 150, svgOrigin: "128 400", duration: .5, ease: "back.out(1.6)" }, st.a3).to("#a3-armR", { rotation: -150, svgOrigin: "292 400", duration: .5, ease: "back.out(1.6)" }, st.a3);
  // 7. мораль
  swap("mall", "moral", st.rule - .7);
  tl.fromTo("#moralCard", { opacity: 0, y: 160 }, { opacity: 1, y: 0, duration: .4, ease: "expo.out", immediateRender: false }, st.rule - .4);
  [W("rule", "тест"), W("rule", "фото"), W("rule", "ключ"), W("rule", "залог"), W("rule", "перехват") - .2].forEach((at, i) => { tl.fromTo(`#mo${i}`, { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: .22, immediateRender: false }, at); R.sfx("pop", at, .5); });
  ending(R, st.end - .15);
};
