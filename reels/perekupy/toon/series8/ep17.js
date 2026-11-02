// «ДОГОВОР С ТОГО СВЕТА» — 8 сцен: ГИБДД, окно инспектора, договор сверху, разделённый экран, дача (день и закат), город, мораль.
// Хронология: белая четырка Вики (ep15–16) продана от имени покойного деда; финал — пятнашка владельца (kit/img/vaz2115) у Михалыча.
$("#title .a").textContent = E.rubric; $("#title .b").textContent = E.subtitle; $("#tag span").textContent = "договор с того света";
$("#title .a").style.cssText = "font-size:84px;background:#fff"; $("#title .b").style.cssText = "font-size:100px;background:#151515;color:#fff";
document.querySelector("#cam > svg#bg")?.remove();
const W = (line, pre, n = 0) => {
  const norm = s => s.toLowerCase().replace(/ё/g, "е").replace(/[^а-я0-9]/g, "");
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
const IMG = { vaz14: "../../kit/img/vaz2114/vaz2114_white.png", vaz15: "../../kit/img/vaz2115/vaz2115.png" };
const car = (id, k, l, t, w, z = 6) => `<img class="pcar" id="${id}" src="${IMG[k]}" style="left:${l}px;top:${t}px;width:${w}px;z-index:${z}">`;
const person = (sc, kind, p, l, t, s = 1, z = 7) => add(sc, `<div class="c" id="${p.toUpperCase()}" style="left:${l}px;top:${t}px;z-index:${z};transform:scale(${s})">${CHARS[kind](p)}</div>`);
const stamp = (id, text, l, t, bg, fg = "#fff", fs = 60, rot = -4) => `<div class="stamp2" id="${id}" style="left:${l}px;top:${t}px;background:${bg};color:${fg};font-size:${fs}px;transform:rotate(${rot}deg)">${text}</div>`;
const half = (bg, top, h, shift) => `<div style="position:absolute;left:0;top:${top}px;width:1080px;height:${h}px;overflow:hidden">
  <div style="position:absolute;left:0;top:${-shift}px;width:1080px;height:1920px">${BGS[bg].replace('id="bg"', "")}</div></div>`;
const VIKA = ["v", "v2", "v3", "v4"];      // Вика в разных сценах — разные префиксы, губы одни

// 1. ГИБДД: зал, очередь
scene("hook", "mreo");
add("hook", `<div id="flick" style="position:absolute;inset:0;background:#05060a;opacity:0;z-index:20"></div>` + stamp("ticket", "Б-347", 720, 1200, "#fff", "#151515", 54, 6));
person("hook", "vika", "v", 330, 880, .95);
// 2. окно №3: вид от посетителя
scene("win", "window");
add("win", stamp("rip1", "✝ 2023", 600, 940, "#151515", "#fff", 50, -4) + `<div class="el" id="folder" style="left:180px;top:1180px;font-size:120px;z-index:9;transform:rotate(-20deg)">🗂️</div>`
  + stamp("active", "АКТИВНЫЙ БЫЛ ДЕД", 150, 1500, "#ffd23f", "#151515", 52, -3));
// 3. договор сверху
scene("doc", "desk");
add("doc", `<div class="dkp" id="dkp" style="left:110px;top:520px;width:860px;transform:rotate(-3deg)"><h4>ДОГОВОР КУПЛИ-ПРОДАЖИ ТС</h4>
  <div style="display:flex;justify-content:space-between"><span>г. Москва</span><span>12.10.2025</span></div>
  <div style="margin-top:12px"><b>Продавец:</b> Иванов Пётр Иванович</div><div><b>Покупатель:</b> ____________</div>
  <div><b>ТС:</b> ВАЗ-2114, белый</div><div><b>Цена:</b> 390 000 ₽</div>
  <div style="margin-top:22px;display:flex;align-items:center;gap:20px"><b>Подпись продавца:</b>
  <svg width="250" height="80" viewBox="0 0 220 70"><path id="sign" d="M5 50 q20 -50 40 -6 q14 30 30 -10 q14 -34 26 8 q10 30 30 -6 q18 -30 34 0 q10 18 45 -10" stroke="#1d3fb8" stroke-width="5" fill="none" stroke-dasharray="420" stroke-dashoffset="420"/></svg></div></div>`
  + `<div class="el" id="ring" style="left:470px;top:965px;width:420px;height:140px;border:9px solid #ff3b30;border-radius:50%;z-index:8;opacity:0;transform:rotate(-3deg)"></div>`
  + stamp("rip2", "✝ 2023", 600, 1190, "#151515", "#fff", 70, 8));
// 4. разделённый экран: Вика в ГИБДД, Эдик в салоне
scene("split", null);
add("split", half("mreo", 0, 960, 300) + half("dealer", 960, 960, 500) + `<div style="position:absolute;left:0;right:0;top:952px;height:16px;background:#151515;z-index:20"></div>`
  + `<div class="chain" id="chain"><b id="c0">ДЕД ✝</b><i id="a0">→</i><b id="c1">ГАЛЯ</b><i id="a1">→</i><b id="c2">ТОЛЯН</b><i id="a2">→</i><b id="c3">ЭДИК</b><i id="a3">→</i><b id="c4">ВИКА</b></div>`
  + stamp("but", "КРОМЕ ПРОДАВЦА", 380, 1040, "#ff3b30", "#fff", 48, -4) + `<div class="el" id="ph1" style="left:300px;top:640px;font-size:90px;z-index:9">📱</div><div class="el" id="ph2" style="left:300px;top:1560px;font-size:90px;z-index:9">📱</div>`);
person("split", "vika", "v2", 60, 140, .6, 9); person("split", "edik", "e", 60, 1100, .6, 9);
// 5. дача: Галя, яблоня
scene("dacha", "dacha");
add("dacha", `<div class="el" id="apple" style="left:860px;top:780px;font-size:60px;z-index:9">🍎</div>` + `<div class="el" id="can" style="left:780px;top:1420px;font-size:90px;z-index:9">🚿</div>`
  + stamp("forpetya", "ПОДПИСЬ: ГАЛЯ ЗА ПЕТЮ", 120, 470, "#151515", "#ffd23f", 46, -3));
person("dacha", "vika", "v3", -20, 880, .9); person("dacha", "galya", "g", 560, 860, .95);
// 6. та же дача на закате: полгода к деду
scene("dusk", "dacha");
add("dusk", `<div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(255,110,40,.45),rgba(60,20,80,.45));mix-blend-mode:multiply;z-index:2"></div>`
  + car("dCar", "vaz14", 140, 1180, 640, 4) + `<div class="cal" id="cal"><div>НАСЛЕДСТВО</div><b id="calM">НОЯБРЬ</b></div>`
  + `<div class="el" id="flowers" style="left:820px;top:1040px;font-size:70px;z-index:9;opacity:0">💐</div>` + stamp("halfyear", "6 МЕСЯЦЕВ", 140, 520, "#ff3b30", "#fff", 60, -3));
// 7. город, весна: Михалыч продаёт свою пятнашку
scene("spring", "city");
add("spring", car("sCar", "vaz15", 150, 1150, 800, 4) + stamp("pass", "✓ ПАСПОРТ = ПТС", 300, 960, "#4cd964", "#151515", 46, -3)
  + stamp("alive", "ПРОДАВЕЦ ЖИВОЙ ✓", 200, 520, "#ffd23f", "#151515", 54, 3));
person("spring", "vika", "v4", -30, 880, .9, 8); person("spring", "mihalych", "m", 680, 860, .95, 8);
// 8. мораль: тот же стол
scene("moral", "desk");
add("moral", `<div class="card" id="moralCard" style="top:400px;z-index:20"><h3>ПЕРЕД ПОКУПКОЙ</h3>
  <div class="li" id="mo0">🪪 Продавец = собственник в ПТС</div><div class="li" id="mo1">✍️ Договор подписывает при тебе</div><div class="li" id="mo2">🔎 Сайт ГИБДД и реестр залогов</div>
  <div class="rule" id="mo3">🔔 Свежие объявления — бот «Перехват»</div></div>`);

$("#end h2").innerHTML = E.end;
bubble("i1", "Собственник по базе —<br>Пётр Иванович.<br><em>Умер в двадцать третьем.</em>", 60, 520, 420);
bubble("v1", "А договор он<br><em>подписал в этом…</em>", 480, 1280, 300);
bubble("v2", "Эдик, ты продал мне<br><em>машину покойника!</em>", 360, 470, 120);
bubble("e1", "Мы брали у Толяна,<br>Толян — у бабушки.<br><em>Все живы!</em>", 360, 1250, 120);
bubble("v3", "Кроме<br><em>продавца.</em>", 400, 520, 120);
bubble("g1", "Дочка, Петя бы не возражал.<br>Вон он, <em>под яблоней</em>, — спроси.", 60, 640, 640);
bubble("v4", "Михалыч,<br><em>вы собственник?</em>", 40, 660, 140);
bubble("m1", "Живой, дочка.<br><em>Паспорт показать?</em>", 500, 680, 420);

window.build = R => {
  const tl = R.tl, cam = R.camera($("#cam"), { hand: .6 });
  R.grain(.03);
  gsap.set(".scn", { opacity: 0 }); gsap.set("#sc_hook", { opacity: 1 });
  const { pop } = common(R, cam, { mood: (k, t) => k === "galya" ? "grin" : k === "edik" ? "grin" : k === "mihalych" ? "grin" : "meh" });
  R.hooks.push(t => { const f = Math.floor(t * 30), lv = (LIP.vika || [])[f] || 0;
    VIKA.forEach(p => { if (p !== "v" && document.getElementById(p)) mouth(p, lv > .28 && !(lv < .55 && f % 3 === 2) ? "talk" : t > st.l6 ? "grin" : "meh"); }); });
  const swap = (from, to, at, kind = "swipe") => {
    if (kind === "cut") { tl.set(`#sc_${from}`, { opacity: 0 }, at).set(`#sc_${to}`, { opacity: 1, x: 0, filter: "none" }, at); R.sfx("hit", at, .4); return; }
    tl.set(`#sc_${to}`, { opacity: 1, x: 1080, filter: "blur(14px)" }, at)
      .to(`#sc_${from}`, { x: -1080, filter: "blur(14px)", duration: .35, ease: "power3.in" }, at)
      .to(`#sc_${to}`, { x: 0, filter: "blur(0px)", duration: .38, ease: "power3.out" }, at + .12)
      .set(`#sc_${from}`, { opacity: 0, x: 0, filter: "none" }, at + .5);
    R.sfx("whoosh", at, .6);
  };
  window.MUSIC = { style: "bed", bpm: 88, end: R.dur - 1.2, mute: [[W("h", "покойник") - .1, W("h", "покойник") + 1], [en.g1 - .2, st.l3 + .5]] };
  for (const l of ["i1", "v1", "v2", "e1", "v3", "g1", "v4", "m1"]) { const nx = E.lines[E.lines.findIndex(x => x.id === l) + 1]; pop("#b_" + l, st[l] - .05, Math.min(en[l] + .9, st[nx.id] - .1)); }
  const slam = (sel, at, sfx = "impact") => { tl.fromTo(sel, { opacity: 0, scale: 2 }, { opacity: 1, scale: 1, duration: .18, ease: "power4.out", immediateRender: false }, at); R.sfx(sfx, at + .02, .7); };
  const hide = (sel, at) => tl.to(sel, { opacity: 0, duration: .15 }, at);
  const beeps = (from, n, gap) => { for (let k = 0; k < n; k++) R.sfx("bleep", from + k * gap, .07); };

  // 1. ГИБДД: табло пищит, Вика встаёт; на «покойник» — свет мигает
  beeps(.1, 2, .3); slam("#ticket", .3, "pop");
  tl.fromTo(cam, { s: 1 }, { s: 1.06, duration: st.i1 - 1, ease: "none", immediateRender: false }, 0).set(cam, { s: 1 }, st.i1 - .7);
  tl.to("#title", { opacity: 0, y: -50, duration: .25 }, W("h", "через") - .1);
  const dead = W("h", "покойник");
  [0, .12, .3, .38].forEach((d, k) => tl.set("#flick", { opacity: k % 2 ? 0 : .75 }, dead + d)); R.sfx("glitch", dead, .6);
  // 2. окно: папка через щель, на мониторе «✝ 2023»
  swap("hook", "win", st.i1 - .7);
  tl.fromTo(cam, { s: 1 }, { s: 1.08, duration: st.l2 - st.i1, ease: "none", immediateRender: false }, st.i1 - .3).set(cam, { s: 1 }, st.l2 - .7);
  tl.fromTo("#folder", { y: 300, opacity: 0 }, { y: 0, opacity: 1, duration: .4, ease: "power3.out", immediateRender: false }, st.i1 - .1); R.sfx("swish", st.i1, .5);
  slam("#rip1", W("i1", "умер"), "hit");
  slam("#active", W("l1", "активн"), "pop");
  // 3. договор сверху: камера по строкам, подпись рисуется, кольцо, штамп
  swap("win", "doc", st.l2 - .7);
  tl.fromTo("#dkp", { y: 200, rotation: -8 }, { y: 0, rotation: -3, duration: .5, ease: "power3.out", immediateRender: false }, st.l2 - .6);
  tl.fromTo(cam, { s: 1.1, y: 140 }, { s: 1.1, y: -120, duration: 1.6, ease: "power1.inOut", immediateRender: false }, st.l2 - .3).to(cam, { s: 1, y: 0, duration: .4 }, st.l2 + 1.4);
  tl.to("#sign", { attr: { "stroke-dashoffset": 0 }, duration: .7, ease: "none" }, st.l2); R.sfx("type", st.l2 + .1, .6); R.sfx("type", st.l2 + .4, .6);
  tl.fromTo("#ring", { opacity: 0, scale: 1.5 }, { opacity: 1, scale: 1, duration: .25, ease: "back.out(2)", immediateRender: false }, W("l2", "уверен")); R.sfx("ping", W("l2", "уверен"), .6);
  slam("#rip2", W("l2", "покойн"), "impact");
  // 4. разделённый экран + цепочка перепродаж
  swap("doc", "split", st.v2 - .6, "cut");
  tl.fromTo("#ph1", { rotation: -15 }, { rotation: 15, duration: .08, repeat: 7, yoyo: true, immediateRender: false }, st.v2 - .5); R.sfx("ring", st.v2 - .5, .5);
  const chainAt = [st.e1 - .2, st.e1 + .1, W("e1", "талян"), W("e1", "талян", 1), W("e1", "бабушк") + .2];
  ["c4", "c3", "c2", "c1", "c0"].forEach((c, k) => { tl.fromTo(`#${c}`, { opacity: 0, y: -30 }, { opacity: 1, y: 0, duration: .2, ease: "back.out(2)", immediateRender: false }, chainAt[k]); R.sfx("pop", chainAt[k], .5); });
  ["a3", "a2", "a1", "a0"].forEach((a, k) => tl.to(`#${a}`, { opacity: 1, duration: .15 }, chainAt[k + 1]));
  tl.to("#c0", { backgroundColor: "#ff3b30", color: "#fff", duration: .2 }, st.v3);
  slam("#but", en.v3 + .05, "impact"); R.shake(cam, en.v3 + .1, .6, .3);
  // 5. дача: камера на холмик под яблоней, падает яблоко
  swap("split", "dacha", st.g1 - .9);
  tl.fromTo("#can", { rotation: 0 }, { rotation: -25, duration: .4, yoyo: true, repeat: 5, immediateRender: false }, st.g1 - .4);
  const tree = W("g1", "яблон");
  tl.to(cam, { s: 1.25, x: -120, y: 80, duration: .9, ease: "power2.inOut" }, tree - .2).to(cam, { s: 1, x: 0, y: 0, duration: .6, ease: "power2.inOut" }, st.l3 + .3);
  tl.fromTo("#apple", { y: 0 }, { y: 330, duration: .55, ease: "power2.in", immediateRender: false }, en.g1 + .3); R.sfx("tap", en.g1 + .85, .9);
  slam("#forpetya", W("l3", "петю"), "pop");
  // 6. закат: календарь листает месяцы, цветы к яблоне
  swap("dacha", "dusk", st.l4 - .7);
  tl.fromTo("#cal", { opacity: 0, y: -60 }, { opacity: 1, y: 0, duration: .3, ease: "back.out(1.6)", immediateRender: false }, st.l4);
  slam("#halfyear", W("l4", "полгод"), "pop");
  const months = ["НОЯБРЬ", "ДЕКАБРЬ", "ЯНВАРЬ", "ФЕВРАЛЬ", "МАРТ", "АПРЕЛЬ"], m0 = st.l4b - .2;
  R.hooks.push(t => { const k = Math.max(0, Math.min(5, Math.floor((t - m0) / .4))); $("#calM").textContent = t < m0 ? months[0] : months[k]; });
  for (let k = 1; k < 6; k++) R.sfx("tick", m0 + k * .4, .8);
  tl.fromTo("#flowers", { opacity: 0, x: -500 }, { opacity: 1, x: 0, duration: 1.4, ease: "power1.inOut", immediateRender: false }, W("l4b", "ездит"));
  // 7. весна: пятнашка Михалыча
  swap("dusk", "spring", st.l5 - .7);
  tl.fromTo("#sCar", { x: 900 }, { x: 0, duration: .9, ease: "power3.out", immediateRender: false }, st.l5 - .3); R.sfx("riser", st.l5 - .3, .5);
  slam("#pass", W("m1", "паспорт"), "ping");
  slam("#alive", W("l6", "живым"), "pop");
  // 8. мораль
  swap("spring", "moral", st.rule - .7);
  tl.fromTo("#moralCard", { opacity: 0, y: 160 }, { opacity: 1, y: 0, duration: .4, ease: "expo.out", immediateRender: false }, st.rule);
  [W("rule", "продавец"), W("rule", "договор"), W("rule", "машину"), W("rule", "свеж")].forEach((at, i) => { tl.fromTo(`#mo${i}`, { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: .22, immediateRender: false }, at); R.sfx("pop", at, .5); });
  ending(R, st.end - .15);
};
