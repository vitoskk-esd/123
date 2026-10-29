// Рубрика «ТОРГ»: СТО «У Михалыча». Машина на подъёмнике, Михалыч находит дефекты, Серёга переводит их в рубли.
$("#title .a").textContent = E.rubric; $("#title .b").textContent = E.subtitle; $("#tag span").textContent = "торг · " + E.subtitle.toLowerCase();
$("#title .b").style.fontSize = "80px";
const fmt = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
$("#scene").insertAdjacentHTML("afterbegin", `<svg id="lift" viewBox="0 0 1080 1920">
  <g stroke="#151515" stroke-width="8"><rect x="70" y="440" width="60" height="640" fill="#ffd23f"/><rect x="950" y="440" width="60" height="640" fill="#ffd23f"/>
  <path d="M130 832 L330 832 M950 832 L750 832" stroke="#7f8c8d" stroke-width="22" stroke-linecap="round"/><rect x="300" y="818" width="80" height="26" rx="6" fill="#151515"/><rect x="700" y="818" width="80" height="26" rx="6" fill="#151515"/></g>
  <ellipse cx="540" cy="1075" rx="380" ry="26" fill="rgba(0,0,0,.35)"/>
  <g fill="#151515"><rect x="60" y="1070" width="80" height="20"/><rect x="940" y="1070" width="80" height="20"/></g></svg>
  <div id="carbox" style="position:absolute;left:90px;top:470px;width:900px;height:360px;z-index:2">${CHARS.car("k", .6, "#b8c2cc", "#0b0d12")}</div>`);
const T = place("t", "tolyan", -50, 920, .92, 4), M = place("m", "mihalych", 330, 960, .92, 3), S = place("s", "seryoga", 710, 920, .92, 4);
document.getElementById("t-shades").style.display = "";
const ICON = {
  brake: `<svg viewBox="0 0 170 170"><circle cx="85" cy="85" r="70" fill="#9aa1a8" stroke="#151515" stroke-width="8"/><circle cx="85" cy="85" r="26" fill="#5b6270" stroke="#151515" stroke-width="6"/>
    ${[0, 1, 2, 3, 4].map(i => `<circle cx="${85 + 46 * Math.cos(i * 1.256)}" cy="${85 + 46 * Math.sin(i * 1.256)}" r="7" fill="#151515"/>`).join("")}<path d="M120 30 q40 30 30 80 l-24 -6 q6 -40 -20 -60 z" fill="#ff3b30" stroke="#151515" stroke-width="6"/>
    <path d="M40 70 q20 -10 30 6" stroke="#c0392b" stroke-width="6" fill="none"/></svg>`,
  susp: `<svg viewBox="0 0 170 170"><path d="M85 10 v20" stroke="#151515" stroke-width="12"/><path d="M50 40 l70 14 l-70 14 l70 14 l-70 14 l70 14 l-70 14" fill="none" stroke="#e67e22" stroke-width="12" stroke-linejoin="round"/>
    <rect x="60" y="130" width="50" height="30" rx="8" fill="#5b6270" stroke="#151515" stroke-width="6"/><path d="M130 30 l20 -14 M138 50 l24 -4" stroke="#ff3b30" stroke-width="7" stroke-linecap="round"/></svg>`,
  oil: `<svg viewBox="0 0 170 170"><path d="M85 14 q50 66 50 96 a50 50 0 0 1 -100 0 q0 -30 50 -96 z" fill="#2b2418" stroke="#151515" stroke-width="8"/><path d="M62 106 q4 22 24 28" stroke="#c9b37a" stroke-width="8" fill="none" stroke-linecap="round"/></svg>`
};
const ov = $("#over");
ov.insertAdjacentHTML("beforeend", `<div id="price"><small>${E.car} · цена Толяна</small><div class="num" id="pnum">${fmt(E.start_price)} ₽</div><div class="stampd" id="pdeal">СДЕЛКА</div></div>`);
E.finds.forEach((f, i) => ov.insertAdjacentHTML("beforeend", `<div class="find" id="find${i}">${ICON[f.icon]}<div class="tx"><small>Михалыч нашёл:</small>${f.text}</div><div class="mn">−${fmt(f.minus)} ₽</div></div><div class="fly" id="fly${i}">−${fmt(f.minus)}</div>`));
const total = E.finds.reduce((a, f) => a + f.minus, 0);
ov.insertAdjacentHTML("beforeend", `<div class="card" id="sum" style="top:470px"><h3>ТОРГ ФАКТАМИ</h3>${E.finds.map((f, i) => `<div class="li" id="li${i}" style="justify-content:space-between"><span>${f.text}</span><span style="color:#ff6b5e">−${fmt(f.minus)}</span></div>`).join("")}
  <div class="li" id="li3" style="justify-content:space-between;color:#4cd964"><span>Итого</span><span>−${fmt(total)} ₽</span></div><div class="rule" id="rule">${E.rule}</div></div>`);
$("#end h2").innerHTML = E.end;
const LINES = { t0: "Брат, девятьсот —<br><em>и ни рублём меньше!</em>", t1: "Это, <em>#@%!</em>,<br>расходник!", s1: "Расходник за мой счёт?<br>Тогда <em>минус 25.</em>",
  t2: "Она не стучит —<br>она <em>разговаривает!</em>", s2: "Разговаривает —<br><em>минус сорок.</em>", s3: "Минус двадцать.<br>Итого <em>815.</em>", t3: "Восемьсот пятнадцать…<br>Ладно, <em>#@%!</em>, забирай." };
const POS = { t: [40, 640, 110], s: [330, 640, 520] };
for (const [line, html] of Object.entries(LINES)) { const p = POS[line[0]]; bubble(line, html, p[0], p[1], p[2]); }

window.build = R => {
  const tl = R.tl, cam = R.camera($("#cam"), { hand: .5 });
  R.grain(.03);
  gsap.set("#m-armR", { svgOrigin: "292 404" }); gsap.set("#t-armR", { svgOrigin: "292 400" }); gsap.set("#s-armR", { svgOrigin: "284 404" });
  const firstFind = st[E.finds[0].at];
  const { pop } = common(R, cam, { mood: (k, t) => k === "tolyan" ? (t > firstFind ? "nerv" : "grin") : k === "seryoga" ? (t > st.s1 ? "flat" : "o") : "flat" });
  window.MUSIC = { style: "bed", bpm: 96, end: R.dur - 1.2, mute: [] };
  R.punch(cam, .05, .03);
  tl.to("#title", { opacity: 0, y: -50, duration: .25 }, st.t0 - .4);
  tl.fromTo("#price", { opacity: 0, y: -60 }, { opacity: 1, y: 0, duration: .35, ease: "back.out(1.6)", immediateRender: false }, st.t0 - .2); R.sfx("impact", st.t0 - .18, .6);
  tl.to("#t-armR", { rotation: -60, duration: .3, ease: "back.out(2)" }, st.t0);
  for (const l of Object.keys(LINES)) { const next = E.lines[E.lines.findIndex(x => x.id === l) + 1]; pop("#b_" + l, st[l] - .05, Math.min(en[l] + .8, st[next.id] - .1)); }
  let price = E.start_price;
  E.finds.forEach((f, i) => {
    const at = st[f.at], drop = st[f.drop], next = E.lines[E.lines.findIndex(x => x.id === f.at) + 1].id;
    tl.to("#m-armR", { rotation: -50, duration: .25, ease: "back.out(2)" }, at - .1).to("#m-armR", { rotation: 0, duration: .3 }, en[f.at]);
    R.sfx("clack", at - .05, .6); R.sfx("scan", at, .8);
    tl.fromTo(`#find${i}`, { opacity: 0, y: 120, rotation: 2 }, { opacity: 1, y: 0, rotation: -1, duration: .35, ease: "back.out(1.6)", immediateRender: false }, at)
      .to(`#find${i}`, { opacity: 0, scale: .4, y: -300, duration: .3, ease: "power3.in" }, st[next] - .15);
    // минус влетает в ценник, когда Серёга называет сумму
    gsap.set(`#fly${i}`, { left: 740, top: 480 });
    tl.fromTo(`#fly${i}`, { opacity: 1, x: 0, y: 0, scale: 1.2 }, { opacity: 0, x: 0, y: -40, scale: .9, duration: .8, ease: "power2.in", immediateRender: false }, drop + .3);
    const from = price; price -= f.minus;
    { const o = { v: from }, to = price;     // счётчик цены — шагами по тысяче
      tl.fromTo(o, { v: from }, { v: to, duration: .6, ease: "power2.out", immediateRender: false, onUpdate: () => { $("#pnum").textContent = fmt(Math.round(o.v / 1000) * 1000) + " ₽"; } }, drop + .75); } R.sfx("hit", drop + .75, .5); R.shake(cam, drop + .8, .4, .2);
    tl.fromTo("#price", { scale: 1 }, { scale: 1.08, duration: .12, yoyo: true, repeat: 1, immediateRender: false }, drop + .75);
  });
  tl.fromTo("#pdeal", { opacity: 0, scale: 2.2 }, { opacity: 1, scale: 1, duration: .18, ease: "power4.out", immediateRender: false }, en.t3 - .3); R.sfx("impact", en.t3 - .28, .8);
  tl.to("#s-armR", { rotation: -70, duration: .3, ease: "back.out(2)" }, en.t3 - .2);
  // сводка и правило
  tl.to("#scene", { filter: "blur(6px) brightness(.6)", duration: .25 }, st.rule - .1).to("#price", { opacity: 0, duration: .2 }, st.rule - .1)
    .fromTo("#sum", { opacity: 0, y: 160 }, { opacity: 1, y: 0, duration: .4, ease: "expo.out", immediateRender: false }, st.rule - .1);
  [0, 1, 2, 3].forEach(i => { tl.fromTo(`#li${i}`, { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: .22, ease: "power3.out", immediateRender: false }, st.rule + .1 + i * .25); R.sfx("pop", st.rule + .1 + i * .25, .5); });
  tl.fromTo("#rule", { opacity: 0, scale: 1.3 }, { opacity: 1, scale: 1, duration: .25, ease: "back.out(2)", immediateRender: false }, st.rule + 1.2); R.sfx("impact", st.rule + 1.2, .6);
  ending(R, st.end - .15);
};
