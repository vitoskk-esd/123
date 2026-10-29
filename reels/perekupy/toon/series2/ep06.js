// Рубрика «СХЕМЫ»: двор панелек зимой. Серёга переписывается с «продавцом», Вика останавливает, Лис ставит флаги.
$("#title .a").textContent = E.rubric; $("#title .b").textContent = E.subtitle; $("#tag span").textContent = "схемы · " + E.subtitle.toLowerCase();
$("#title .b").style.fontSize = "76px";
const S = place("s", "seryoga", 40, 860, 1, 4), V = place("v", "vika", 1180, 860, 1, 4);
$("#scene").insertAdjacentHTML("afterbegin", `<div class="carbox" id="carbox" style="position:absolute;left:300px;top:1010px;width:900px;height:360px;z-index:2">${CHARS.car("k", .55, "#596273", "#0b0d12")}</div>`);
const ov = $("#over");
ov.insertAdjacentHTML("beforeend", `<div class="phone" id="phone"><div class="hd"><div class="av">П</div><div class="nm">${E.chat_title}<small>${E.chat_price} · был(а) недавно</small></div></div><div class="msgs" id="msgs"></div></div>`);
const msgs = $("#msgs"); let mid = 0;
const addMsg = (cls, text) => { const d = document.createElement("div"); d.className = "msg " + cls; d.id = "msg" + (mid++); d.innerHTML = text; msgs.appendChild(d); return d; };
E.flags.forEach(([at, text], i) => ov.insertAdjacentHTML("beforeend", `<div class="flag" id="flag${i}"><b>🚩 ${i + 1}</b>${text}</div>`));
ov.insertAdjacentHTML("beforeend", `<div class="card" id="sum" style="top:470px"><h3>СХЕМА «БРОНЬ»: 3 ФЛАГА</h3>${E.flags.map(([a, t], i) => `<div class="li" id="li${i}">🚩 ${t}</div>`).join("")}<div class="rule" id="rule">${E.rule}</div></div>`);
$("#end h2").innerHTML = E.end;
const LINES = { s1: "О, пригонит сам —<br><em>удобно!</em>", v1: "Стоп. Ты её<br><em>даже не видел.</em>", s2: "Надо успеть,<br><em>щас переведу!</em>", v2: "Срочность —<br>это <em>крючок</em>, Серёж.",
  s3: "Ну это же<br>карта <em>жены</em>…", v3: "А потом номер —<br><em>в блоке.</em>", s4: "<em>#@%!</em>…<br>заблокировал." };
const POS = { s: [50, 1380, 110], v: [430, 640, 330] };
for (const [line, html] of Object.entries(LINES)) { const p = POS[line[0]]; bubble(line, html, p[0], p[1], p[2]); }
// снег
const snow = $("#snowfx"); const flakes = [];
for (let i = 0; i < 90; i++) { const d = document.createElement("div"); d.className = "snow"; const r = 4 + (i * 7) % 9; d.style.width = d.style.height = r + "px"; d.style.opacity = .5 + (i % 5) * .1; snow.appendChild(d); flakes.push([d, (i * 137) % 1080, (i * 251) % 1920, 60 + (i * 31) % 90, r]); }

window.build = R => {
  const tl = R.tl, cam = R.camera($("#cam"), { hand: .5 });
  R.grain(.03);
  gsap.set("#s-armR", { svgOrigin: "284 404" }); gsap.set("#v-armL", { svgOrigin: "140 404" }); gsap.set("#v-armR", { svgOrigin: "280 404" });
  const flagAt = E.flags.map(f => st[f[0]]);
  const { pop } = common(R, cam, { mood: (k, t) => k === "vika" ? "grin" : t > st.s4 ? "meh" : flagAt.some(a => t > a - 1.5 && t < a + 2.2) ? "o" : "flat" });
  window.MUSIC = { style: "bed", bpm: 88, end: R.dur - 1.2, mute: [] };
  R.hooks.push(t => flakes.forEach(([d, x, y, v, r]) => { d.style.transform = `translate(${x + Math.sin(t * .8 + y) * 30}px, ${(y + t * v) % 1960 - 40}px)`; }));

  // хук
  R.punch(cam, .05, .03);
  tl.to("#title", { opacity: 0, y: -50, duration: .25 }, st.s1 - 2.0);
  tl.to("#s-armR", { rotation: -40, duration: .3 }, .4);       // Серёга с телефоном в руке

  // телефон: появляется перед сообщением «продавца», уходит, когда вступает Вика
  const phoneUp = at => { tl.to("#scene", { filter: "blur(6px) brightness(.6)", duration: .2 }, at).fromTo("#phone", { opacity: 0, y: 260 }, { opacity: 1, y: 0, duration: .35, ease: "back.out(1.4)", immediateRender: false }, at); R.sfx("swish", at, .5); };
  const phoneDown = at => { tl.to("#phone", { opacity: 0, y: 300, duration: .25, ease: "power3.in" }, at).to("#scene", { filter: "none", duration: .2 }, at); };
  const show = (el, at, sfx = "ping") => { tl.set(el, { display: "block" }, at).fromTo(el, { opacity: 0, y: 30, scale: .9 }, { opacity: 1, y: 0, scale: 1, duration: .22, ease: "back.out(2)", immediateRender: false }, at); R.sfx(sfx, at, .5); };
  const typing = (at, dur) => { const d = addMsg("in typing", "•••"); show(d, at, "tap"); tl.set(d, { display: "none" }, at + dur); };
  E.chat.forEach((m, k) => {
    const at = st[m.at] - m.lead, up = at - .9;
    phoneUp(up); typing(up + .3, .55); show(addMsg("in", m.text), at);
    const rep = E.replies.find(r => r.at === m.at); if (rep) show(addMsg("out", rep.text), en[m.at] + .05, "tick");
  });
  // блок после перевода
  const blockAt = st.s4 - .9;
  phoneUp(blockAt - .5); show(addMsg("sys", "⛔ Пользователь ограничил<br>круг лиц, которые могут ему писать"), blockAt, "hit");
  phoneDown(en.s4 + .2);
  ["v1", "v2", "v3"].forEach(l => phoneDown(st[l] - .3));

  // Вика входит на первой реплике и стоит дальше рядом
  tl.to("#V", { left: 600, duration: .45, ease: "back.out(1.3)" }, st.v1 - .35); R.sfx("whoosh", st.v1 - .35, .5);
  tl.to("#v-armR", { rotation: -70, duration: .2, ease: "back.out(3)" }, st.v1 - .05).to("#v-armR", { rotation: 0, duration: .3 }, en.v1 + .2);
  R.shake(cam, st.v1, .4, .2);

  // реплики-пузыри
  for (const l of Object.keys(LINES)) { const next = E.lines[E.lines.findIndex(x => x.id === l) + 1]; pop("#b_" + l, st[l] - .05, Math.min(en[l] + .9, st[next.id] - .1)); }

  // флаги Лиса
  E.flags.forEach(([line], i) => {
    const at = st[line], until = i < 2 ? st[E.chat[i + 1].at] - E.chat[i + 1].lead - 1.0 : st.rule - .1;
    tl.fromTo(`#flag${i}`, { opacity: 0, scale: 2, rotation: -6 }, { opacity: 1, scale: 1, rotation: -2, duration: .2, ease: "power4.out", immediateRender: false }, at)
      .to(`#flag${i}`, { opacity: 0, duration: .15 }, until);
    R.sfx("impact", at + .02, .8); R.punch(cam, at, .05); R.flash(at, .3, .12);
  });

  // сводка и правило
  tl.to("#scene", { filter: "blur(6px) brightness(.6)", duration: .25 }, st.rule - .1)
    .fromTo("#sum", { opacity: 0, y: 160 }, { opacity: 1, y: 0, duration: .4, ease: "expo.out", immediateRender: false }, st.rule - .1);
  E.flags.forEach((f, i) => { tl.fromTo(`#li${i}`, { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: .22, ease: "power3.out", immediateRender: false }, st.rule + .1 + i * .25); R.sfx("pop", st.rule + .1 + i * .25, .5); });
  tl.fromTo("#rule", { opacity: 0, scale: 1.3 }, { opacity: 1, scale: 1, duration: .25, ease: "back.out(2)", immediateRender: false }, st.rule + .9); R.sfx("impact", st.rule + .9, .6);
  ending(R, st.end - .15);
};
