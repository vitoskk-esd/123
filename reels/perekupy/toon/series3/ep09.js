// «УГАДАЙ ЦЕНУ»: парковка ТЦ ночью. Машина, три варианта цены, Серёга и Вика угадывают, отсчёт, ответ — рынок;
// в конце — такая же машина ниже рынка, пойманная в канале (карточка как у бота).
$("#title .a").textContent = E.rubric; $("#title .b").textContent = E.subtitle; $("#tag span").textContent = "угадай цену";
$("#title .a").style.fontSize = "76px"; $("#title .b").style.fontSize = "84px";
const fmt = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
$("#scene").insertAdjacentHTML("afterbegin", `<div id="carbox" style="position:absolute;left:90px;top:1040px;width:900px;height:360px;z-index:2">${CHARS.car("k", .55, "#c0392b", "#0b0d12")}</div>`);
const S = place("s", "seryoga", -30, 960, .92, 4), V = place("v", "vika", 690, 960, .92, 4);
const ov = $("#over"), L = ["A", "B", "C"];
ov.insertAdjacentHTML("beforeend", `<div id="lot"><h3>${E.car}</h3><div class="chips">${E.specs.map(x => `<span>${x}</span>`).join("")}</div></div>
 <div class="opts">${E.options.map((p, i) => `<div class="opt" id="o${i}"><b>${L[i]}</b><div>${fmt(p)}</div><span class="who" id="w${i}"></span><span class="dv" id="d${i}"></span></div>`).join("")}</div>
 <div id="cnt"></div><div id="mkt">рынок ≈ ${fmt(E.market)} ₽ · медиана ${E.samples} объявлений</div>
 <div id="botcard"><div class="hd"><img src="../../kit/img/fox.png">Перехват · бот</div><div class="hot">🔥 −${Math.round((E.market - E.deal) / E.market * 100)}% к рынку</div>
  <b>${E.car} · ${fmt(E.deal)} ₽</b><br>🛣 ${E.specs[0]} · 📍 ${E.specs[2]}<br>📊 рынок ≈ ${fmt(E.market)} ₽ (${E.samples} объявл.)<br>📢 канал с машинами · ⏱ ${E.deal_sec} с
  <div class="tm">через ${E.deal_sec} с после публикации</div></div>`);
$("#end h2").innerHTML = E.end;
const LINES = { s1: "Миллион двести пятьдесят!<br><em>Она ж как новая.</em>", v1: "Восемьсот девяносто.<br>Это Веста, <em>а не Мерседес.</em>", s2: "То есть я переплатил бы<br><em>двести тысяч?</em>",
  v2: "А я бы недоплатила.<br><em>Так никто не продаст.</em>", s3: "И кто её <em>забрал?</em>", v3: "Тот, кто<br><em>увидел первым.</em>" };
const POS = { s: [40, 760, 140], v: [230, 760, 620] };
for (const [line, html] of Object.entries(LINES)) { const p = POS[line[0]]; bubble(line, html, p[0], p[1], p[2]); }

window.build = R => {
  const tl = R.tl, cam = R.camera($("#cam"), { hand: .5 });
  R.grain(.03);
  gsap.set("#s-armR", { svgOrigin: "284 404" }); gsap.set("#v-armL", { svgOrigin: "140 404" });
  const { pop } = common(R, cam, { mood: (k, t) => k === "vika" ? "grin" : t > st.r + .5 && t < st.d ? "o" : t > st.d ? "grin" : "flat" });
  window.MUSIC = { style: "bed", bpm: 100, end: R.dur - 1.2, mute: [] };
  R.punch(cam, .05, .03);
  tl.to("#title", { opacity: 0, y: -50, duration: .25 }, en.h - .6);
  tl.fromTo("#lot", { opacity: 0, y: -60 }, { opacity: 1, y: 0, duration: .35, ease: "back.out(1.6)", immediateRender: false }, en.h - .4); R.sfx("impact", en.h - .38, .6);
  [0, 1, 2].forEach(i => { tl.fromTo(`#o${i}`, { opacity: 0, y: 40, scale: .8 }, { opacity: 1, y: 0, scale: 1, duration: .25, ease: "back.out(2)", immediateRender: false }, en.h + i * .18); R.sfx("pop", en.h + i * .18, .6); });
  for (const l of Object.keys(LINES)) { const next = E.lines[E.lines.findIndex(x => x.id === l) + 1]; pop("#b_" + l, st[l] - .05, Math.min(en[l] + .9, st[next.id] - .1)); }
  // выбор героев
  const pick = (i, who, color, at) => { tl.set(`#w${i}`, { textContent: who, background: color, color: "#151515" }, at)
    .fromTo(`#w${i}`, { opacity: 0, scale: 1.8 }, { opacity: 1, scale: 1, duration: .18, ease: "power4.out", immediateRender: false }, at)
    .fromTo(`#o${i}`, { scale: 1 }, { scale: 1.08, duration: .12, yoyo: true, repeat: 1, immediateRender: false }, at); R.sfx("tick", at, .8); };
  pick(2, "Серёга", "#25b39b", st.s1 + .2); pick(0, "Вика", "#ff7aa8", st.v1 + .2);
  tl.to("#s-armR", { rotation: -70, duration: .2 }, st.s1 + .1).to("#s-armR", { rotation: 0, duration: .3 }, en.s1);
  tl.to("#v-armL", { rotation: 70, duration: .2 }, st.v1 + .1).to("#v-armL", { rotation: 0, duration: .3 }, en.v1);
  // отсчёт по словам «три… два… один»
  const c0 = st.c, cd = (en.c - st.c) / 3;
  ["3", "2", "1"].forEach((n, k) => { const at = c0 + k * cd;
    tl.set("#cnt", { textContent: n }, at).fromTo("#cnt", { opacity: 1, scale: 2.2 }, { opacity: 1, scale: 1, duration: .25, ease: "power4.out", immediateRender: false }, at);
    R.sfx("hit", at, .7); R.shake(cam, at, .4, .2); });
  tl.to("#cnt", { opacity: 0, duration: .15 }, en.c + .2);
  tl.to("#scene", { filter: "blur(4px) brightness(.7)", duration: .2 }, st.c - .1);
  // ответ: B — рынок; у героев — на сколько промахнулись
  const ra = st.r + .2;
  tl.set("#o1", { className: "opt ok" }, ra).set("#o2", { className: "opt no" }, ra + .4).set("#o0", { className: "opt no" }, ra + .6);
  R.flash(ra, .35, .15); R.sfx("ring", ra, .6);
  tl.to("#lot", { opacity: 0, duration: .15 }, ra + .1);
  tl.fromTo("#mkt", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: .3, ease: "back.out(2)", immediateRender: false }, ra + .2);
  const diff = i => E.options[i] - E.market;
  [[2, "+" + fmt(diff(2))], [0, "−" + fmt(-diff(0))], [1, "в точку"]].forEach(([i, tx], k) => {
    tl.set(`#d${i}`, { textContent: tx }, ra + .4 + k * .25).fromTo(`#d${i}`, { opacity: 0, scale: 1.6 }, { opacity: 1, scale: 1, duration: .16, immediateRender: false }, ra + .4 + k * .25); R.sfx("clack", ra + .4 + k * .25, .6); });
  // такая же — ниже рынка в канале
  tl.to("#lot, .opts, #mkt", { opacity: 0, duration: .2 }, st.d - .15).to(".opt", { opacity: 0, duration: .2 }, st.d - .15)
    .fromTo("#botcard", { opacity: 0, y: 120, rotation: 2 }, { opacity: 1, y: 0, rotation: -1, duration: .4, ease: "back.out(1.6)", immediateRender: false }, st.d);
  R.sfx("ping", st.d, .8);
  tl.fromTo("#botcard .tm", { opacity: 0, scale: 2 }, { opacity: 1, scale: 1, duration: .18, ease: "power4.out", immediateRender: false }, st.d + 2.2); R.sfx("impact", st.d + 2.22, .7);
  tl.to("#botcard", { y: -10, duration: .01 }, st.s3);
  tl.to("#botcard", { opacity: 0, duration: .2 }, st.end - .3);
  ending(R, st.end - .15);
};
