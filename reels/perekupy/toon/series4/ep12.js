// «СХЕМЫ · допы в автосалоне»: менеджер Эдик навешивает каско, «пакет защиты» и «выгодный кредит», Вика срезает всё.
$("#title .a").textContent = E.rubric; $("#title .b").textContent = E.subtitle; $("#tag span").textContent = "схемы · допы в салоне";
$("#title .b").style.fontSize = "78px"; $("#tag span").style.color = "#151515";     // светлый салон — подпись тёмная
const fmt = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
const Ed = place("e", "edik", -40, 920, .93, 4), S = place("s", "seryoga", 330, 940, .9, 4), V = place("v", "vika", 700, 930, .92, 4);
const ov = $("#over");
ov.insertAdjacentHTML("beforeend", `<div id="bill"><h3>Счёт · ${E.car}</h3>
  <div class="ln" id="l0" style="opacity:1"><span>Автомобиль</span><b>${fmt(E.price)}</b></div>
  <div class="ln add" id="l1"><span>КАСКО «обязательно»</span><b>+120 000</b><s></s><i class="no">ОТКАЗ</i></div>
  <div class="ln add" id="l2"><span>«Защита кузова»</span><b>+60 000</b><s></s><i class="no">ОТКАЗ</i></div>
  <div class="ln add" id="l3"><span>«Выгодный» кредит</span><b>ПСК?</b><s></s><i class="no">НЕ НАДО</i></div>
  <div class="tot"><span>Итого</span><b id="tot">${fmt(E.price)} ₽</b></div><div class="psk" id="psk">ПСК +40%</div></div>
 <div class="flag" id="dopy" style="top:300px;font-size:46px"><b>ДОПЫ</b>Каско, «пакеты», кредит — можно не брать</div>
 <div class="card" id="sum" style="top:470px"><h3>В САЛОНЕ ПЕРЕД ПОДПИСЬЮ</h3>
  <div class="li" id="li0">🧾 Итоговая цена — письменно</div><div class="li" id="li1">✂️ Допы и «пакеты» — отказ</div><div class="li" id="li2">📑 Кредит — смотри полную стоимость</div>
  <div class="rule" id="rule">Читай каждую строку договора до подписи</div></div>`);
$("#end h2").innerHTML = E.end;
const LINES = { e1: "Машина ваша! Только<br><em>каско обязательно!</em>", v1: "Каско —<br><em>не обязательно.</em>", e2: "Пакет «Защита кузова» —<br><em>без него не отдаём!</em>",
  s1: "А… можно<br><em>без пакета?</em>", v2: "Навязывать услуги<br><em>запрещено.</em>", e3: "Зато кредит выгоднее,<br><em>чем наличка!</em>", v3: "Покажите полную стоимость.<br>Ага — <em>плюс 40%.</em>" };
const POS = { e: [40, 790, 130], s: [180, 790, 330], v: [260, 790, 590] };
for (const [line, html] of Object.entries(LINES)) { const p = POS[line[0]]; bubble(line, html, p[0], p[1], p[2]); }

window.build = R => {
  const tl = R.tl, cam = R.camera($("#cam"), { hand: .5 });
  R.grain(.03);
  gsap.set("#e-armR", { svgOrigin: "286 404" }); gsap.set("#v-armR", { svgOrigin: "280 404" });
  const { pop } = common(R, cam, { mood: (k, t) => k === "edik" ? (t > st.v3 ? "meh" : "grin") : k === "vika" ? "grin" : t > st.v2 ? "grin" : t > st.e1 ? "o" : "flat" });
  window.MUSIC = { style: "bed", bpm: 96, end: R.dur - 1.2, mute: [] };
  R.punch(cam, .05, .03);
  tl.to("#title", { opacity: 0, y: -50, duration: .25 }, st.e1 - .4);
  tl.fromTo("#bill", { opacity: 0, y: -60 }, { opacity: 1, y: 0, duration: .35, ease: "back.out(1.6)", immediateRender: false }, st.e1 - .3); R.sfx("swish", st.e1 - .3, .5);
  for (const l of Object.keys(LINES)) { const next = E.lines[E.lines.findIndex(x => x.id === l) + 1]; pop("#b_" + l, st[l] - .05, Math.min(en[l] + .9, st[next.id] - .1)); }
  let total = E.price;
  const tot = (at, to) => { const o = { v: total }; tl.fromTo(o, { v: total }, { v: to, duration: .5, ease: "power2.out", immediateRender: false,
      onUpdate: () => { $("#tot").textContent = fmt(Math.round(o.v / 1000) * 1000) + " ₽"; } }, at); total = to; R.sfx("tick", at, .7); };
  const add = (k, at, plus) => { tl.fromTo(`#l${k}`, { opacity: 0, x: 60 }, { opacity: 1, x: 0, duration: .25, ease: "back.out(2)", immediateRender: false }, at); R.sfx("clack", at, .7);
    tl.to("#e-armR", { rotation: -60, duration: .2, ease: "back.out(3)" }, at - .1).to("#e-armR", { rotation: 0, duration: .3 }, at + .8);
    if (plus) tot(at + .25, total + plus); };
  const cut = (k, at, minus) => { tl.to(`#l${k} s`, { scaleX: 1, duration: .25, ease: "power2.out" }, at).fromTo(`#l${k} .no`, { opacity: 0, scale: 2 }, { opacity: 1, scale: 1, duration: .18, immediateRender: false }, at + .15);
    tl.to("#v-armR", { rotation: -70, duration: .2, ease: "back.out(3)" }, at - .1).to("#v-armR", { rotation: 0, duration: .3 }, at + .8);
    R.sfx("hit", at, .6); R.shake(cam, at + .05, .4, .2); if (minus) tot(at + .3, total - minus); };
  add(1, st.e1 + 1.2, 120000); cut(1, st.v1 + .6, 120000);
  add(2, st.e2 + 1.2, 60000); cut(2, en.v2 - .6, 60000);
  add(3, st.e3 + .6, 0);
  tl.fromTo("#psk", { opacity: 0, scale: 2.2 }, { opacity: 1, scale: 1, duration: .18, ease: "power4.out", immediateRender: false }, en.v3 - .5); R.sfx("impact", en.v3 - .48, .8);
  cut(3, en.v3 + .1, 0);
  tl.to("#bill", { opacity: 0, duration: .2 }, st.f - .15);
  tl.to("#scene", { filter: "blur(4px) brightness(.7)", duration: .2 }, st.f - .1)
    .fromTo("#dopy", { opacity: 0, scale: 2, rotation: -6 }, { opacity: 1, scale: 1, rotation: -2, duration: .2, ease: "power4.out", immediateRender: false }, st.f)
    .to("#dopy", { opacity: 0, duration: .15 }, st.rule - .1);
  R.sfx("impact", st.f + .02, .8); R.punch(cam, st.f, .05); R.flash(st.f, .3, .12);
  tl.to("#scene", { filter: "blur(6px) brightness(.6)", duration: .25 }, st.rule - .1)
    .fromTo("#sum", { opacity: 0, y: 160 }, { opacity: 1, y: 0, duration: .4, ease: "expo.out", immediateRender: false }, st.rule - .1);
  [0, 1, 2].forEach(i => { tl.fromTo(`#li${i}`, { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: .22, ease: "power3.out", immediateRender: false }, st.rule + .1 + i * .4); R.sfx("pop", st.rule + .1 + i * .4, .5); });
  tl.fromTo("#rule", { opacity: 0, scale: 1.3 }, { opacity: 1, scale: 1, duration: .25, ease: "back.out(2)", immediateRender: false }, st.rule + 1.7); R.sfx("impact", st.rule + 1.7, .6);
  ending(R, st.end - .15);
};
