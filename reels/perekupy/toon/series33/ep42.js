// ОТДЕЛЬНАЯ СЕРИЯ (не про Толяна, владелец 10.11): «Семейный чат». Гена три месяца выбирает первую машину — точнее, выбирает семейный чат:
// тесть Палыч («только японец»), дядя Боря («только Мерседес»), Вован («Лада!»). Гена ставит «Перехват»; первое уведомление — Мерседес дяди Бори
// дороже рынка, через секунду — салатовая Нива владельца (kit/img/niva) на 80 000 ниже рынка; голубятник Семёныч; опрос в чате; «на дачу подвезёшь?».
// Приёмы (новые): кружочки Telegram (активный — крупно, с пузырём у головы, потом уезжает в ряд миниатюр), «документалка» (REC, титр, ручная камера),
// двери лифта как переход, опрос в чате с полосками голосов. Фоны новые: ostanovka, lift, golubyatnya.
$("#title .a").textContent = E.rubric; $("#title .b").textContent = E.subtitle; $("#tag span").textContent = "семейный чат";
$("#title .a").style.cssText = "font-size:100px;background:#5ac8fa;color:#151515"; $("#title .b").style.cssText = "font-size:120px;background:#ff3b30;color:#fff";
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
const hero = (p, l, t, s, o, z = 6) => `<div class="c" id="${p.toUpperCase()}" style="left:${l}px;top:${t}px;z-index:${z};transform-origin:0 0;transform:scale(${s})">${CHARS.perekup(p, o)}</div>`;
const stamp = (id, text, l, t, bg, fg = "#fff", fs = 60, rot = -4) => `<div class="stamp2" id="${id}" style="left:${l}px;top:${t}px;background:${bg};color:${fg};font-size:${fs}px;transform:rotate(${rot}deg)">${text}</div>`;
const CAR = (id, img, l, t, w, z = 5) => `<img class="pcar" id="${id}" src="../../kit/img/${img}" style="left:${l}px;top:${t}px;width:${w}px;z-index:${z}">`;
const PHONE = (id, l, t, w, inner) => `<div class="el" id="${id}" style="left:${l}px;top:${t}px;width:${w}px;z-index:12;background:#0d0e12;border:8px solid #2a2d34;border-radius:44px;padding:22px;box-shadow:0 0 70px rgba(120,180,255,.4);opacity:0">${inner}</div>`;
const BOT = (body, fs = 30) => `<div style="font-family:Onest;font-weight:700;font-size:24px;color:#8b93a3">ПЕРЕХВАТ · бот</div><div style="background:#1c1f26;border-radius:22px;padding:16px 20px;margin-top:10px;font-family:Onest;color:#fff;font-size:${fs}px;line-height:1.42">${body}</div>`;
const GENA = { jacket: "#3fa34d", pants: "#2b2f37", hair: "#6b4a2b", glasses: true, item: "phone" };
const PALYCH = { jacket: "#6d7f8f", pants: "#3b3f46", hair: "#c9ccd1", mustache: true, ushanka: "#8a6d48" };
const BORYA = { jacket: "#2b2b2e", pants: "#232c47", cap: "#151515", chain: true, hair: "#3a2d22" };
const VOVAN = { jacket: "#1f4fb8", pants: "#151515", hair: "#d9a441", scarf: "#ffd23f" };
const SEMEN = { jacket: "#e8e2d0", pants: "#4f5b3a", hair: "#b0b4ba", beard: true, vest: true };
// кружочек Telegram: обёртка #k_<p> (круг + подпись), масштабируем целиком; голова героя — по центру круга
const KR = (p, o, l, t, d, name, dur, ring = "#5ac8fa", z = 30) => {
  const s = d / 230;
  return `<div class="kr" id="k_${p}" style="left:${l}px;top:${t}px;width:${d}px;z-index:${z}">
    <div class="krc" style="width:${d}px;height:${d}px;border-color:${ring}"><div class="c" style="left:${d / 2 - 210 * s}px;top:${d / 2 - 222 * s}px;transform-origin:0 0;transform:scale(${s})">${CHARS.perekup(p, o)}</div></div>
    <div class="krn">${name} · ▶ ${dur}</div></div>`;
};
const PIGEON = (id, l, t, s = 1, flip = false) => `<svg class="pg" id="${id}" viewBox="-50 -30 100 60" style="left:${l}px;top:${t}px;width:${100 * s}px;${flip ? "transform:scaleX(-1)" : ""}"><g><ellipse cx="0" cy="0" rx="26" ry="16" fill="#8f98a6" stroke="#151515" stroke-width="4"/><circle cx="22" cy="-12" r="10" fill="#7a8494" stroke="#151515" stroke-width="4"/><path d="M30 -12 l10 3 -10 3" fill="#ffb02e"/><path d="M-26 0 l-16 -8 v16 z" fill="#6f7886" stroke="#151515" stroke-width="3"/></g></svg>`;

// 1. остановка под дождём: Гена мокнет, родня спорит кружочками
scene("stop", "ostanovka");
add("stop", hero("gn1", 30, 880, .8, GENA)
  + KR("pl1", PALYCH, 470, 880, 360, "Палыч", "0:07") + KR("br1", BORYA, 470, 880, 360, "дядя Боря", "0:12", "#ff7a1a") + KR("vv1", VOVAN, 470, 880, 360, "Вован", "0:04", "#4cd964")
  + `<div class="chat" id="chat" style="left:420px;top:1650px">👨‍👩‍👧 СЕМЬЯ · <span id="unr" style="color:#ff3b30">147</span> новых</div>`
  + `<div id="rain1" class="rain"></div>`);
// 2. «документалка» в лифте
scene("doc", "lift");
add("doc", hero("gn2", 330, 840, .9, { ...GENA, item: "", look: "o" })
  + `<div class="recf"></div><div class="recd" id="recd">● REC</div>`
  + `<div class="lower" id="lower">ГЕНА, 32 года<div>ищет первую машину · <b id="days">94</b>-й день</div></div>`);
// 3. лифт: бот, Мерседес дяди Бори, Нива
scene("lift", "lift");
add("lift", hero("gn3", -10, 880, .8, GENA)
  + PHONE("flt", 470, 760, 540, BOT(`<b>⚙️ Фильтр</b><br>🚗 любая машина<br>💰 до 800 000 ₽ · 🏙 мой город<br>🔔 новое объявление → сразу<br><span style="color:#ffd23f">🎁 пробный день — бесплатно</span>`, 28))
  + PHONE("mers", 450, 740, 580, BOT(`<b>Mercedes W124 · 1994 · 690 000 ₽</b><br>📊 рынок ≈ 480 000 ₽ (27 объявл.)<br>👤 продавец: <b id="bname" style="color:#ff7a1a;display:inline-block">Борис</b><br>📞 контакт — из описания закрытого канала`, 27))
  + stamp("over", "+210 000 К РЫНКУ", 420, 1210, "#ff3b30", "#fff", 50, 3)
  + CAR("w124", "w124/w124_34.png", 560, 1250, 480, 8) + KR("br2", BORYA, 560, 780, 300, "дядя Боря", "0:09", "#ff7a1a")
  + PHONE("niva", 450, 700, 580, BOT(`<b style="color:#ff7a1a">🔥 −11% к рынку</b><br><b>Lada Niva 4×4 · 2018 · 650 000 ₽</b><br>📍 двор на Садовой · голубятня<br>⏱ 1 с после публикации<br><img src="../../kit/img/niva/niva_34.png" style="width:100%;margin-top:8px;border-radius:12px;background:#e8ecf0">`, 28))
  + stamp("m80", "−80 000 ₽", 520, 1420, "#4cd964", "#151515", 64, -3)
  + `<div class="clock" id="clock">07:40</div>`);
// 4. двор с голубятней: Семёныч, опрос, «на дачу подвезёшь?»
scene("yard", "golubyatnya");
add("yard", CAR("nv1", "niva/niva_side.png", 200, 1184, 760) + hero("sm", 760, 880, .8, SEMEN) + hero("gn4", -10, 880, .8, GENA)
  + PIGEON("pg1", 560, 1138, 1) + PIGEON("pg2", 690, 1140, .9, true) + PIGEON("pg3", 300, 1640, 1.2, true) + PIGEON("pg4", 900, 1700, 1)
  + `<div class="chat" id="miss" style="left:330px;top:1540px">📞 Семёныч: <span id="mcnt" style="color:#ff3b30">12</span> пропущенных</div>`
  + `<div class="poll" id="poll"><small>СЕМЬЯ · ОПРОС</small><h4>Беру Ниву?</h4>
      <div class="pr"><i id="pyes" style="background:#4cd964"></i><span>✅ Да</span><b id="pyv">0%</b></div>
      <div class="pr"><i id="pno" style="background:#ff3b30"></i><span>❌ Нет</span><b id="pnv">0%</b></div><em id="pvotes">0 голосов</em></div>`
  + stamp("closed", "ОПРОС ЗАКРЫТ", 520, 690, "#151515", "#ffd23f", 44, 5)
  + KR("pl2", PALYCH, 380, 960, 280, "Палыч", "0:02") + KR("br3", BORYA, 380, 960, 280, "дядя Боря", "0:03", "#ff7a1a") + KR("vv2", VOVAN, 380, 960, 280, "Вован", "0:02", "#4cd964"));
scene("fin", "golubyatnya");
add("fin", CAR("nv2", "niva/niva_34.png", 340, 1060, 700) + hero("gn5", 230, 900, .7, { ...GENA, item: "", look: "grin" })
  + PIGEON("pg5", 620, 1050, 1) + PIGEON("pg6", 760, 1056, .9, true)
  + KR("pl3", PALYCH, 40, 760, 230, "Палыч", "0:05")
  + `<div class="ctab" id="cta2" style="top:1330px"><div class="cbig">Бот <span>«Перехват»</span><br>— ссылка в шапке</div><div class="csm">свежие объявления за ~1 с · рынок по похожим</div></div>`);
// двери лифта — переход в двор
$(".stage").insertAdjacentHTML("beforeend", `<div class="door" id="dL" style="left:0"></div><div class="door" id="dR" style="left:540px"></div>`);
$("#end h2").innerHTML = E.end;

const bub = (line, html, l, t, tx, fs) => { const b = bubble(line, html, l, t, tx); if (fs) b.style.fontSize = fs + "px"; return b; };
bub("p1", "Только японца!<br><em>Остальное — металлолом.</em>", 300, 610, 330, 38);
bub("b1", "Только Мерседес!<br><em>Я двадцать лет на нём!</em>", 360, 620, 270, 40);
bub("v1", "Лада!<br><em>Запчасти — копейки!</em>", 420, 620, 210, 44);
bub("g1", "Нашёл Короллу — пока тесть думал,<br><em>продали.</em> Нашёл Октавию —<br>пока голосовали, <em>продали.</em>", 50, 620, 440, 34);
bub("g2", "Всё.<br><em>Без голосования.</em>", 30, 700, 128, 44);
bub("g3", "Дядя<br><em>Боря?!</em>", 30, 700, 128, 54);
bub("b2", "Генка, ну это…<br><em>семейная скидка будет!</em>", 320, 560, 360, 40);
bub("s1", "Ты первый. Мне уже двенадцать звонят.<br><em>Голубей не пугай — они машину охраняют.</em>", 260, 690, 610, 32);
bub("g4", "Беру!", 30, 740, 128, 60);
bub("p2", "Нива?!<br><em>Это ж не японец!</em>", 250, 720, 240, 42);
bub("b3", "А как же<br><em>мой Мерседес?</em>", 250, 720, 240, 44);
bub("v2", "Я же говорил —<br><em>Лада!</em>", 250, 720, 240, 44);
bub("g5", "Опрос закрыт.<br><em>Я уже за рулём.</em>", 30, 700, 128, 40);
bub("p3", "…Слушай, а на дачу подвезёшь?<br><em>Там как раз грязь.</em>", 30, 540, 95, 34);

window.build = R => {
  const tl = R.tl, cam = R.camera($("#cam"), { hand: .6 });
  R.grain(.03);
  gsap.set(".scn", { opacity: 0 }); gsap.set("#sc_stop", { opacity: 1 });
  const { pop } = common(R, cam);
  const talk = (lv, f) => lv > .28 && !(lv < .55 && f % 3 === 2);
  // говорящие: префикс → голос (кружки — тоже с губами)
  const SP = { gn1: "gena", gn2: "gena", gn3: "gena", gn4: "gena", gn5: "gena", pl1: "palych", pl2: "palych", pl3: "palych", br1: "borya", br2: "borya", br3: "borya",
    vv1: "vovan", vv2: "vovan", sm: "semen" };
  const mood = (k, t) => k === "gena" ? (t > st.g3 - .2 && t < st.l6 ? (t < st.b2 ? "o" : "flat") : "grin") : k === "borya" && t > st.p2 ? "flat" : "grin";
  R.hooks.push(t => { const f = Math.floor(t * 30);
    for (const [p, k] of Object.entries(SP)) if (document.getElementById(p)) mouth(p, talk((LIP[k] || [])[f] || 0, f) ? "talk" : mood(k, t));
    // голуби клюют/покачиваются, REC мигает, дождь
    $$(".pg g").forEach((g, i) => { g.style.transform = `translateY(${Math.abs(Math.sin(t * 3 + i * 1.3)) * -5}px) rotate(${Math.sin(t * 2 + i) * 6}deg)`; });
    $("#recd").style.opacity = Math.floor(t * 2) % 2 ? .25 : 1;
    $("#rain1").style.backgroundPosition = `${-t * 260}px ${t * 1400}px`;
  });
  window.MUSIC = { style: "toon", bpm: 112, end: R.dur - 1.2 };
  const ids = E.lines.map(l => l.id), nxt = l => ids[ids.indexOf(l) + 1];
  const SW = { doc: st.g1 - .45, lift: st.g2 - .4, yard: st.s1 - .7, fin: st.p3 - .55 };
  const swap = (from, to, at) => {
    tl.set(`#sc_${to}`, { opacity: 1, x: 1080, filter: "blur(14px)" }, at)
      .to(`#sc_${from}`, { x: -1080, filter: "blur(14px)", duration: .35, ease: "power3.in" }, at)
      .to(`#sc_${to}`, { x: 0, filter: "blur(0px)", duration: .38, ease: "power3.out" }, at + .12)
      .set(`#sc_${from}`, { opacity: 0, x: 0, filter: "none" }, at + .5);
    R.sfx("whoosh", at, .6);
  };
  const cut = (from, to, at) => { tl.set(`#sc_${to}`, { opacity: 1 }, at).set(`#sc_${from}`, { opacity: 0 }, at); R.sfx("clack", at, .5); R.flash(at, .35, .12); };
  // пузыри: от начала реплики до следующей (не дольше +0,9 с), не переживают смену сцены
  const ends = Object.values(SW).sort((a, b) => a - b);
  for (const l of ["p1", "b1", "v1", "g1", "g2", "g3", "b2", "s1", "g4", "p2", "b3", "v2", "g5", "p3"]) {
    const cap = ends.find(x => x > st[l]) ?? 1e9, n = nxt(l);
    pop("#b_" + l, st[l] - .05, Math.min(en[l] + .9, n ? st[n] - .1 : en[l] + 1, cap - .05));
  }
  const slam = (sel, at, sfx = "impact") => { tl.fromTo(sel, { opacity: 0, scale: 2 }, { opacity: 1, scale: 1, duration: .18, ease: "power4.out", immediateRender: false }, at); R.sfx(sfx, at + .02, .7); };
  const show = (sel, at) => { tl.fromTo(sel, { opacity: 0, scale: .7, y: 60 }, { opacity: 1, scale: 1, y: 0, duration: .35, ease: "back.out(1.8)", immediateRender: false }, at); R.sfx("ping", at - .03, 1); };
  const hide = (sel, at) => tl.to(sel, { opacity: 0, duration: .2 }, at);
  // кружок: выскакивает крупно к реплике, потом уезжает в ряд миниатюр (x, y, scale)
  const krIn = (id, at) => { tl.fromTo(id, { opacity: 0, scale: .2, rotation: -25 }, { opacity: 1, scale: 1, rotation: 0, duration: .35, ease: "back.out(2)", immediateRender: false }, at); R.sfx("pop", at, .8); };
  const krOut = (id, at, x, y, s) => tl.to(id, { x, y, scale: s, duration: .35, ease: "power3.inOut" }, at);
  gsap.set(".kr", { opacity: 0, transformOrigin: "0 0" }); gsap.set("#w124", { opacity: 0 });

  // 1. остановка: Палыч → Боря → Вован, счётчик непрочитанных растёт; Лис
  tl.to("#title", { opacity: 0, y: -50, duration: .25 }, 1.6);
  krIn("#k_pl1", st.p1 - .3); krOut("#k_pl1", st.b1 - .45, 10, 560, .42);
  krIn("#k_br1", st.b1 - .3); krOut("#k_br1", st.v1 - .45, 180, 560, .42);
  krIn("#k_vv1", st.v1 - .3); krOut("#k_vv1", st.l1 + .1, 350, 560, .42);
  R.count($("#unr"), st.b1, 147, 152, .4); R.count($("#unr"), st.v1, 152, 158, .4); R.count($("#unr"), W("l1", "семей"), 158, 213, .9);
  R.shake(cam, st.b1 + .1, .4, .3);
  slam("#chat", st.p1 + .3, "pop"); tl.to("#chat", { scale: 1.25, duration: .25, ease: "back.out(2)" }, W("l1", "семей") - .1);
  R.punch(cam, W("l1", "семей"), .06);
  // 2. «документалка»
  swap("stop", "doc", SW.doc);
  tl.fromTo("#lower", { opacity: 0, x: -80 }, { opacity: 1, x: 0, duration: .35, ease: "power3.out", immediateRender: false }, SW.doc + .4); R.sfx("swish", SW.doc + .4, .6);
  tl.to(cam, { hand: 2.4, duration: .3 }, SW.doc).to(cam, { hand: .6, duration: .3 }, SW.lift);
  R.punch(cam, W("g1", "продал"), .04); R.punch(cam, W("g1", "продал", 1), .06);
  tl.to(cam, { s: 1.12, duration: 2.2, ease: "power1.inOut" }, st.l2).to(cam, { s: 1, duration: .01 }, SW.lift);
  // 3. лифт: фильтр без голосования
  cut("doc", "lift", SW.lift);
  show("#flt", st.g2 + .3); hide("#flt", st.l4);
  tl.fromTo("#clock", { opacity: 0, y: -30 }, { opacity: 1, y: 0, duration: .25, immediateRender: false }, st.l4); R.sfx("tick", st.l4, .8); hide("#clock", st.l6 + .5);
  // первое уведомление — Мерседес; продавец — Борис
  show("#mers", W("l4", "уведом")); R.sfx("ping", W("l4", "уведом") + .1, .7);
  tl.fromTo("#bname", { scale: 1 }, { scale: 1.6, duration: .2, ease: "back.out(3)", repeat: 1, yoyo: true, immediateRender: false }, st.g3 - .15);
  R.punch(cam, st.g3, .08); R.shake(cam, st.g3 + .05, .5, .3);
  slam("#over", W("l5", "двести"), "impact"); hide("#over", st.b2 - .2); hide("#mers", st.b2 - .2);
  krIn("#k_br2", st.b2 - .35); tl.fromTo("#w124", { opacity: 0, x: 300 }, { opacity: 1, x: 0, duration: .4, ease: "power3.out", immediateRender: false }, st.b2 - .2);
  tl.to(["#k_br2", "#w124"], { opacity: 0, duration: .2 }, st.l6 - .1);
  // Нива через 1 с
  show("#niva", W("l6", "нива") - .35); R.sfx("ping", W("l6", "нива") - .2, .9); R.punch(cam, W("l6", "нива"), .07);
  slam("#m80", W("l6", "восемь"), "boom");
  // двери лифта закрываются → двор с голубятней
  tl.fromTo("#dL", { x: -540 }, { x: 0, duration: .28, ease: "power3.in", immediateRender: false }, SW.yard - .3)
    .fromTo("#dR", { x: 540 }, { x: 0, duration: .28, ease: "power3.in", immediateRender: false }, SW.yard - .3)
    .set("#sc_yard", { opacity: 1 }, SW.yard).set("#sc_lift", { opacity: 0 }, SW.yard)
    .to("#dL", { x: -560, duration: .4, ease: "power3.out" }, SW.yard + .15).to("#dR", { x: 560, duration: .4, ease: "power3.out" }, SW.yard + .15);
  gsap.set(["#dL"], { x: -560 }); gsap.set(["#dR"], { x: 560 });
  R.sfx("clack", SW.yard - .02, .9); R.sfx("ring", SW.yard + .2, .4);
  // 4. двор: Семёныч, пропущенные растут, голуби взлетают на «голубей»
  tl.from("#GN4", { x: -420, duration: .5, ease: "power2.out" }, SW.yard + .3);
  slam("#miss", st.s1 + .4, "pop"); R.count($("#mcnt"), W("s1", "двенадц"), 12, 17, 2.4);
  for (let k = 0; k < 4; k++) R.sfx("ring", W("s1", "двенадц") + .6 * k, .25);
  tl.to("#pg1", { y: -70, x: -40, duration: .35, ease: "power2.out", yoyo: true, repeat: 1 }, W("s1", "голуб")); R.sfx("swish", W("s1", "голуб"), .5);
  R.punch(cam, st.g4, .07); R.sfx("impact", st.g4 + .05, .6);
  // опрос: Семёныч уходит, полоски голосов
  tl.to(["#SM", "#miss"], { opacity: 0, x: 200, duration: .4, ease: "power2.in" }, en.g4 + .3);
  show("#poll", en.g4 + .5);
  const vote = (bar, val, at, cnt) => { tl.to(bar, { width: val + "%", duration: .4, ease: "power3.out" }, at);
    tl.set(bar === "#pyes" ? "#pyv" : "#pnv", { textContent: val + "%" }, at + .1).set("#pvotes", { textContent: cnt }, at + .1); R.sfx("tap", at, .7); };
  krIn("#k_pl2", st.p2 - .3); vote("#pno", 100, W("p2", "нив") + .1, "1 голос"); krOut("#k_pl2", st.b3 - .4, 290, -130, .4);
  krIn("#k_br3", st.b3 - .3); vote("#pno", 100, W("b3", "мерс"), "2 голоса"); krOut("#k_br3", st.v2 - .4, 410, -130, .4);
  krIn("#k_vv2", st.v2 - .3); vote("#pno", 67, W("v2", "лад"), "3 голоса"); vote("#pyes", 33, W("v2", "лад"), "3 голоса"); krOut("#k_vv2", st.g5 - .3, 530, -130, .4);
  slam("#closed", W("g5", "закрыт"), "impact"); R.shake(cam, W("g5", "закрыт") + .05, .5, .3);
  // финал: Нива 3/4, кружок Палыча, призыв
  swap("yard", "fin", SW.fin);
  krIn("#k_pl3", st.p3 - .2);
  tl.fromTo("#cta2", { opacity: 0, y: 80, scale: .9 }, { opacity: 1, y: 0, scale: 1, duration: .4, ease: "back.out(1.6)", immediateRender: false }, st.end + .2);
  ending(R, en.end + .3);
};
