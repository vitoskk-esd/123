// «БАЙКИ РЫНКА · бабушкина машина»: гаражный кооператив. Баба Галя «первая хозяйка», Серёга ловит на пробеге и ПТС,
// из гаража выскакивает Толян — перекуп под видом собственника.
$("#title .a").textContent = E.rubric; $("#title .b").textContent = E.subtitle; $("#tag span").textContent = "байки рынка";
$("#title .a").style.fontSize = "70px"; $("#title .b").style.fontSize = "84px";
$("#scene").insertAdjacentHTML("afterbegin", `<div id="gin"></div><div id="gdoor">${Array.from({ length: 8 }, (_, i) => `<i style="top:${40 + i * 40}px"></i>`).join("")}</div>
  <div id="carbox" style="position:absolute;left:150px;top:1030px;width:900px;height:360px;z-index:2">${CHARS.car("k", .6, "#d8c9a8", "#0b0d12")}</div>`);
const G = place("g", "galya", -10, 900, .98, 4), S = place("s", "seryoga", 690, 880, 1, 4), T = place("t", "tolyan", 400, 700, .62, 1);
document.getElementById("t-shades").style.display = ""; gsap.set("#T", { opacity: 0 });
const ov = $("#over");
ov.insertAdjacentHTML("beforeend", `
 <div class="doc" id="doc1"><h3>АВТОТЕКА</h3><div class="sub">${E.car} · история пробега</div>
  <div class="row" id="r1_0"><span>2019 · ТО</span><b>64 000 км</b></div><div class="row" id="r1_1"><span>2021 · техосмотр</span><b>151 000 км</b></div>
  <div class="row bad" id="r1_2"><span>2026 · объявление</span><b>240 000 км</b></div><div class="st" id="st1">ЦЕРКОВЬ В СОЧИ</div></div>
 <div class="doc" id="doc2"><h3>ПТС · СОБСТВЕННИКИ</h3><div class="sub">кто и сколько владел</div>
  <div class="row" id="r2_0"><span>Иванов И.</span><b>2018–2022</b></div><div class="row" id="r2_1"><span>ООО «Авто-Трейд»</span><b>2022–2026</b></div>
  <div class="row bad" id="r2_2"><span>Галина П.</span><b>с 15.10.2026</b></div><div class="st" id="st2">2 НЕДЕЛИ</div></div>
 <div class="flag" id="scheme" style="top:300px;font-size:46px"><b>СХЕМА</b>Перекуп под видом собственника</div>
 <div class="card" id="sum" style="top:470px"><h3>ПЕРЕД СДЕЛКОЙ ПРОВЕРЬ</h3>
  <div class="li" id="li0">📄 Сколько продавец владеет машиной по ПТС</div><div class="li" id="li1">🛣 Пробег по автотеке</div><div class="li" id="li2">🧾 Продаёт ли он ещё машины</div>
  <div class="rule" id="rule">«Одна хозяйка» с ПТС на 2 недели — это перекуп</div></div>`);
$("#end h2").innerHTML = E.end;
const LINES = { g1: "Сынок, одна хозяйка!<br>Только <em>в церковь</em> ездила.", s1: "Бабуль, а пробег —<br><em>240 тысяч?</em>", g2: "Так церковь-то…<br><em>в Сочи</em>, милок.",
  s2: "А в ПТС вы —<br>всего <em>две недели.</em>", g3: "Ой… Толик!<br><em>Толик, иди сюда!</em>", t1: "Баба Галя, <em>#@%!</em>,<br>про ПТС молчим!" };
const POS = { g: [40, 640, 150], s: [400, 640, 480], t: [140, 520, 330] };
for (const [line, html] of Object.entries(LINES)) { const p = POS[line[0]]; bubble(line, html, p[0], p[1], p[2]); }

window.build = R => {
  const tl = R.tl, cam = R.camera($("#cam"), { hand: .5 });
  R.grain(.035);
  gsap.set("#g-armR", { svgOrigin: "278 420" }); gsap.set("#s-armR", { svgOrigin: "284 404" }); gsap.set("#t-armR", { svgOrigin: "292 400" });
  const { pop } = common(R, cam, { mood: (k, t) => k === "galya" ? (t < st.s2 ? "grin" : "o") : k === "tolyan" ? "nerv" : t > st.s1 ? "grin" : "flat" });
  window.MUSIC = { style: "bed", bpm: 90, end: R.dur - 1.2, mute: [] };
  R.punch(cam, .05, .03);
  tl.to("#title", { opacity: 0, y: -50, duration: .25 }, st.g1 - .3);
  tl.to("#g-armR", { rotation: -50, duration: .3, ease: "back.out(2)" }, st.g1).to("#g-armR", { rotation: 0, duration: .3 }, en.g1 + .2);
  for (const l of Object.keys(LINES)) { const next = E.lines[E.lines.findIndex(x => x.id === l) + 1]; pop("#b_" + l, st[l] - .05, Math.min(en[l] + .9, st[next.id] - .1)); }
  // документы: автотека после вопроса о пробеге, ПТС — на «две недели»
  const doc = (k, at, until, stampAt) => {
    tl.to("#scene", { filter: "blur(4px) brightness(.7)", duration: .2 }, at)
      .fromTo(`#doc${k}`, { opacity: 0, y: -80, rotation: -2 }, { opacity: 1, y: 0, rotation: 1, duration: .35, ease: "back.out(1.6)", immediateRender: false }, at)
      .to(`#doc${k}`, { opacity: 0, duration: .15 }, until).to("#scene", { filter: "none", duration: .2 }, until);
    [0, 1, 2].forEach(j => { tl.fromTo(`#r${k}_${j}`, { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: .2, immediateRender: false }, at + .3 + j * .25); R.sfx("clack", at + .3 + j * .25, .6); });
    tl.fromTo(`#st${k}`, { opacity: 0, scale: 2.2 }, { opacity: 1, scale: 1, duration: .18, ease: "power4.out", immediateRender: false }, stampAt);
    R.sfx("impact", stampAt + .02, .8); R.shake(cam, stampAt + .04, .5, .25);
  };
  doc(1, en.s1 + .1, st.s2 - .15, st.g2 + .9);
  doc(2, st.s2 + .3, st.g3 - .1, en.s2 + .1);
  // гараж: дверь уезжает вверх, в проёме Толян; выбегает к машине
  const open = st.g3 + .9;
  tl.to("#gdoor", { scaleY: 0, duration: .5, ease: "power2.in" }, open); R.sfx("riser", open, .5); R.sfx("boom", open + .5, .5);
  tl.set("#T", { opacity: 1 }, open + .1).set("#T", { zIndex: 5 }, st.t1 - .2).to("#T", { left: 300, top: 860, scale: .95, duration: .55, ease: "power3.out" }, st.t1 - .5);
  R.sfx("whoosh", st.t1 - .5, .6); R.shake(cam, st.t1 - .1, .5, .3);
  tl.to("#t-armR", { rotation: -70, duration: .2, ease: "back.out(3)" }, st.t1).to("#t-armR", { rotation: 0, duration: .3 }, en.t1);
  // схема
  tl.to("#scene", { filter: "blur(4px) brightness(.7)", duration: .2 }, st.f - .1)
    .fromTo("#scheme", { opacity: 0, scale: 2, rotation: -6 }, { opacity: 1, scale: 1, rotation: -2, duration: .2, ease: "power4.out", immediateRender: false }, st.f)
    .to("#scheme", { opacity: 0, duration: .15 }, st.rule - .1);
  R.sfx("impact", st.f + .02, .8); R.punch(cam, st.f, .05); R.flash(st.f, .3, .12);
  tl.to("#scene", { filter: "blur(6px) brightness(.6)", duration: .25 }, st.rule - .1)
    .fromTo("#sum", { opacity: 0, y: 160 }, { opacity: 1, y: 0, duration: .4, ease: "expo.out", immediateRender: false }, st.rule - .1);
  [0, 1, 2].forEach(i => { tl.fromTo(`#li${i}`, { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: .22, ease: "power3.out", immediateRender: false }, st.rule + .2 + i * .35); R.sfx("pop", st.rule + .2 + i * .35, .5); });
  tl.fromTo("#rule", { opacity: 0, scale: 1.3 }, { opacity: 1, scale: 1, duration: .25, ease: "back.out(2)", immediateRender: false }, st.rule + 1.5); R.sfx("impact", st.rule + 1.5, .6);
  ending(R, st.end - .15);
};
