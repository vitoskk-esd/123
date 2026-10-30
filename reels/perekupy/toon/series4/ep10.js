// «ОСМОТР ЗА МИНУТУ · следы ДТП без приборов»: СТО. Михалыч учит Серёгу: зазоры, болты крыла, оттенок.
$("#title .a").textContent = E.rubric; $("#title .b").textContent = E.subtitle; $("#tag span").textContent = "осмотр за минуту";
$("#title .a").style.fontSize = "64px"; $("#title .b").style.fontSize = "70px";
$("#scene").insertAdjacentHTML("afterbegin", `<div id="carbox" style="position:absolute;left:120px;top:1010px;width:900px;height:360px;z-index:2">${CHARS.car("k", .55, "#c9cfd6", "#0b0d12")}</div>`);
const M = place("m", "mihalych", -20, 930, .95, 4), S = place("s", "seryoga", 700, 910, .95, 4);
const ov = $("#over"), K2 = "#151515";
const GAP = `<svg viewBox="0 0 900 380">
  <rect x="40" y="30" width="400" height="320" rx="16" fill="#c9cfd6" stroke="${K2}" stroke-width="8"/><rect x="460" y="30" width="400" height="320" rx="16" fill="#c9cfd6" stroke="${K2}" stroke-width="8"/>
  <text x="240" y="200" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="40" fill="#8a929c">ДВЕРЬ</text>
  <text x="660" y="200" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="40" fill="#8a929c">КРЫЛО</text>
  <path d="M446 30 L456 30 L478 350 L440 350 Z" fill="#151515"/>
  <g id="g_top"><rect x="330" y="50" width="220" height="56" rx="12" fill="#4cd964" stroke="${K2}" stroke-width="5"/><text x="440" y="90" text-anchor="middle" font-family="JetBrains Mono" font-weight="800" font-size="34">3 мм</text></g>
  <g id="g_bot"><rect x="330" y="270" width="220" height="56" rx="12" fill="#ff3b30" stroke="${K2}" stroke-width="5"/><text x="440" y="310" text-anchor="middle" font-family="JetBrains Mono" font-weight="800" font-size="34" fill="#fff">8 мм</text></g></svg>`;
const bolt = (x, ok) => `<g transform="translate(${x} 60)"><circle cx="150" cy="150" r="120" fill="#c9cfd6" stroke="${K2}" stroke-width="8"/>
  <polygon points="150,70 220,110 220,190 150,230 80,190 80,110" fill="#9aa1a8" stroke="${K2}" stroke-width="7"/>
  ${ok ? "" : `<path d="M86 104 l20 12 M210 96 l-14 18 M214 196 l-22 -8 M92 196 l18 -14 M150 66 v20" stroke="#e8e8e8" stroke-width="8" stroke-linecap="round"/><circle cx="150" cy="150" r="98" fill="none" stroke="#e8e8e8" stroke-width="5" stroke-dasharray="14 10"/>`}
  <circle cx="150" cy="150" r="22" fill="#5b6270"/><text x="150" y="300" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="34" fill="${ok ? "#1f7a3a" : "#c0392b"}">${ok ? "родной ✓" : "крутили ✗"}</text></g>`;
const BOLTS = `<svg viewBox="0 0 900 380">${bolt(60, true)}${bolt(500, false)}</svg>`;
const SHADE = `<svg viewBox="0 0 900 380"><circle cx="790" cy="70" r="46" fill="#ffd23f" stroke="${K2}" stroke-width="6"/>
  <g stroke="#ffd23f" stroke-width="8" stroke-linecap="round"><path d="M790 0 v10 M720 70 h-10 M740 20 l8 8 M840 20 l-8 8"/></g>
  <g transform="translate(20 20) scale(.9)">${CHARS.car("sh", .6, "#c9cfd6", "#0b0d12")}</g>
  <path d="M434 162 h176 v106 h-176 z" fill="#d9c3a5" opacity=".75" transform="translate(20 20) scale(.9)"/>
  <text x="430" y="372" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="34" fill="#c0392b">дверь другого оттенка</text></svg>`;
ov.insertAdjacentHTML("beforeend", `
 <div class="ins" id="c1"><h3>ЗАЗОРЫ<small>между дверью и крылом</small></h3>${GAP}<div class="st" id="st1">КРЫЛО СНИМАЛИ</div></div>
 <div class="ins" id="c2"><h3>БОЛТЫ КРЫЛА<small>под капотом, у края крыла</small></h3>${BOLTS}<div class="st" id="st2">ОТКРУЧИВАЛИ</div></div>
 <div class="ins" id="c3"><h3>ОТТЕНОК<small>смотри на солнце, сбоку</small></h3>${SHADE}<div class="st" id="st3">КРАШЕНО</div></div>
 <div class="card" id="sum" style="top:470px"><h3>СЛЕДЫ ДТП ЗА МИНУТУ</h3>
  <div class="li" id="li0">📏 Зазоры разные сверху и снизу</div><div class="li" id="li1">🔩 Краска на болтах сбита</div><div class="li" id="li2">🎨 Деталь другого оттенка</div>
  <div class="rule" id="rule">Проверь это до того, как платить за толщиномер</div></div>`);
$("#end h2").innerHTML = E.end;
const LINES = { s1: "Михалыч, как понять —<br><em>била или нет?</em>", s2: "А если зазоры<br><em>ровные?</em>", s3: "Минута — и уже<br><em>всё видно!</em>" };
for (const [line, html] of Object.entries(LINES)) bubble(line, html, 330, 660, 520);

window.build = R => {
  const tl = R.tl, cam = R.camera($("#cam"), { hand: .5 });
  R.grain(.03);
  gsap.set("#m-armR", { svgOrigin: "292 404" }); gsap.set("#s-armR", { svgOrigin: "284 404" });
  const { pop } = common(R, cam, { mood: (k, t) => k === "seryoga" ? (t > st.s3 ? "grin" : t > st.m2 ? "o" : "flat") : "grin" });
  window.MUSIC = { style: "bed", bpm: 92, end: R.dur - 1.2, mute: [] };
  R.punch(cam, .05, .03);
  tl.to("#title", { opacity: 0, y: -50, duration: .25 }, st.s1 - .3);
  for (const l of Object.keys(LINES)) { const next = E.lines[E.lines.findIndex(x => x.id === l) + 1]; pop("#b_" + l, st[l] - .05, Math.min(en[l] + .9, st[next.id] - .1)); }
  const card = (k, at, until, stampAt) => {
    tl.to("#scene", { filter: "blur(4px) brightness(.7)", duration: .2 }, at)
      .fromTo(`#c${k}`, { opacity: 0, y: -80, rotation: -2 }, { opacity: 1, y: 0, rotation: 1, duration: .35, ease: "back.out(1.6)", immediateRender: false }, at)
      .to(`#c${k}`, { opacity: 0, duration: .15 }, until).to("#scene", { filter: "none", duration: .2 }, until);
    tl.fromTo(`#st${k}`, { opacity: 0, scale: 2.2 }, { opacity: 1, scale: 1, duration: .18, ease: "power4.out", immediateRender: false }, stampAt);
    R.sfx("impact", stampAt + .02, .8); R.shake(cam, stampAt + .04, .5, .25);
    tl.to("#m-armR", { rotation: -55, duration: .25, ease: "back.out(2)" }, at).to("#m-armR", { rotation: 0, duration: .3 }, until - .3);
  };
  gsap.set("#g_top, #g_bot", { opacity: 0 });
  card(1, st.m1 - .1, st.s2 - .1, en.m2 - .4);
  tl.fromTo("#g_top", { opacity: 0, scale: 1.6, svgOrigin: "440 78" }, { opacity: 1, scale: 1, duration: .2, immediateRender: false }, st.m2 + .2); R.sfx("tick", st.m2 + .2, .8);
  tl.fromTo("#g_bot", { opacity: 0, scale: 1.6, svgOrigin: "440 298" }, { opacity: 1, scale: 1, duration: .2, immediateRender: false }, st.m2 + 1.4); R.sfx("clack", st.m2 + 1.4, .8);
  card(2, st.m3 - .1, st.m4 - .1, en.m3 - .4);
  card(3, st.m4 - .05, st.s3 - .1, en.m4 - .4);
  tl.to("#scene", { filter: "blur(6px) brightness(.6)", duration: .25 }, st.rule - .1)
    .fromTo("#sum", { opacity: 0, y: 160 }, { opacity: 1, y: 0, duration: .4, ease: "expo.out", immediateRender: false }, st.rule - .1);
  [0, 1, 2].forEach(i => { tl.fromTo(`#li${i}`, { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: .22, ease: "power3.out", immediateRender: false }, st.rule + .1 + i * .4); R.sfx("pop", st.rule + .1 + i * .4, .5); });
  tl.fromTo("#rule", { opacity: 0, scale: 1.3 }, { opacity: 1, scale: 1, duration: .25, ease: "back.out(2)", immediateRender: false }, st.rule + 1.6); R.sfx("impact", st.rule + 1.6, .6);
  ending(R, st.end - .15);
};
