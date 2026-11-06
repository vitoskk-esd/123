// «СХЕМЫ · МАРАФЕТ ЗА НОЧЬ» — новая структура «на переходы» (владелец 06.11): бот на экране с первой секунды, призыв на ~60% ролика,
// развязка через «Перехват», один призыв в финале — «ссылка в шапке» (без «пиши в комментариях»: владелец 06.11 — зрители устали от таких призывов).
// 8 сцен: кухня Вики (карточка бота), бокс Толяна ночью, мотор (мойка + присадка), приборка и прогрев, призыв, показ в паркинге, развязка, финал.
$("#title .a").textContent = E.rubric; $("#title .b").textContent = E.subtitle; $("#tag span").textContent = "марафет за ночь";
$("#title .a").style.cssText = "font-size:90px;background:#ffd23f;color:#151515"; $("#title .b").style.cssText = "font-size:80px;background:#151515;color:#fff";
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
const el = (html, l, t, w, h, z = 5, id = "", extra = "") => `<div class="el"${id ? ` id="${id}"` : ""} style="left:${l}px;top:${t}px;width:${w}px;height:${h}px;z-index:${z};${extra}">${html}</div>`;
const hero = (kind, p, l, t, s = 1, z = 6, o) => `<div class="c" id="${p.toUpperCase()}" style="left:${l}px;top:${t}px;z-index:${z};transform-origin:0 0;transform:scale(${s})">${CHARS[kind](p, o)}</div>`;
const stamp = (id, text, l, t, bg, fg = "#fff", fs = 60, rot = -4) => `<div class="stamp2" id="${id}" style="left:${l}px;top:${t}px;background:${bg};color:${fg};font-size:${fs}px;transform:rotate(${rot}deg)">${text}</div>`;
const CAM = (id, v, l, t, w, z = 3) => `<img class="pcar" id="${id}" src="../../kit/img/camry/${v}.png" style="left:${l}px;top:${t}px;width:${w}px;z-index:${z}">`;
const BOT = (id, time, car, price, delta, ago, l, t, sc = 1) => `<div class="botcard" id="${id}" style="left:${l}px;top:${t}px;transform-origin:0 0;--s:${sc}"><div class="bh">ПЕРЕХВАТ · бот · ${time}</div><div class="bb"><b style="color:#ff7a1a">${delta}</b><br><b>${car} · ${price}</b><br>📍 твой город<br>⏱ ${ago} после публикации</div></div>`;
const ENGINE = (dirty, w = 860) => `<svg viewBox="0 0 860 620" style="width:${w}px;height:${w * 620 / 860}px"><rect x="6" y="6" width="848" height="608" rx="40" fill="#1c1d21" stroke="#000" stroke-width="10"/>
  <rect x="230" y="120" width="400" height="300" rx="30" fill="${dirty ? "#5b5148" : "#8e9aa6"}" stroke="#000" stroke-width="8"/>
  ${[0, 1, 2, 3].map(i => `<rect x="${270 + i * 90}" y="150" width="60" height="80" rx="10" fill="${dirty ? "#3f3830" : "#c9d3dc"}" stroke="#000" stroke-width="6"/>`).join("")}
  <rect x="60" y="80" width="140" height="190" rx="14" fill="#151515" stroke="#000" stroke-width="7"/><rect x="80" y="60" width="30" height="24" fill="#c0392b" stroke="#000" stroke-width="5"/><rect x="150" y="60" width="30" height="24" fill="#2b2b2e" stroke="#000" stroke-width="5"/>
  <circle cx="720" cy="190" r="70" fill="${dirty ? "#4a4038" : "#d9e1e8"}" stroke="#000" stroke-width="8"/><rect x="660" y="360" width="130" height="150" rx="16" fill="#2e86de" stroke="#000" stroke-width="7"/>
  <path d="M230 300 h-60 q-30 0 -30 30 v160 M630 300 h40" stroke="#151515" stroke-width="18" fill="none"/>
  ${dirty ? `<path d="M300 420 q10 60 -6 120 q30 10 40 -20 q-10 -50 6 -100 z M520 420 q-10 80 10 140 q24 -6 20 -40 q-16 -40 -8 -100 z" fill="#1a120c" opacity=".95"/>
    ${[[330, 250, 40], [480, 300, 56], [560, 230, 30], [400, 380, 46]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * .6}" fill="#1a120c" opacity=".95"/>`).join("")}`
    : `${[[300, 160], [520, 180], [700, 150], [420, 320]].map(([x, y]) => `<path d="M${x} ${y} l10 -26 l10 26 l26 10 l-26 10 l-10 26 l-10 -26 l-26 -10 z" fill="#fff"/>`).join("")}`}</svg>`;
const DASH = `<svg viewBox="0 0 900 420" style="width:900px;height:420px"><rect x="6" y="6" width="888" height="408" rx="60" fill="#0d0e12" stroke="#000" stroke-width="10"/>
  <circle cx="250" cy="210" r="150" fill="#16181d" stroke="#ff7a1a" stroke-width="10"/><circle cx="650" cy="210" r="150" fill="#16181d" stroke="#ff7a1a" stroke-width="10"/>
  <path d="M250 210 L180 120 M650 210 L720 140" stroke="#ff3b30" stroke-width="10" stroke-linecap="round"/>
  <g id="chk" transform="translate(410 280)"><circle cx="40" cy="20" r="70" fill="#ffb300" opacity=".25"/><path d="M0 40 h80 v-40 h-12 v-14 h-56 v14 h-12 z" fill="#ffb300" stroke="#000" stroke-width="5"/></g>
  <text x="450" y="390" text-anchor="middle" font-family="JetBrains Mono" font-weight="800" font-size="30" fill="#8b93a3">CHECK</text></svg>`;
const smoke = (sc, n, l, t) => add(sc, Array.from({ length: n }, (_, i) => `<div class="smk" id="${sc}_sm${i}" style="left:${l}px;top:${t}px;width:${110 + i * 20}px;height:${80 + i * 14}px"></div>`).join(""));
const TOL = ["t0", "t"];

// 1. хук: кухня Вики, карточка бота
scene("hook", "kitchen");
add("hook", BOT("bot1", "07:12", "Toyota Camry 2018", "1 590 000 ₽", "🔥 −12% к рынку", "0,9 с", 440, 760) + hero("vika", "v", 20, 860, .9, 7));
// 2. бокс Толяна ночью
scene("box", "box");
add("box", CAM("car1", "camry", 370, 1200, 640) + hero("tolyan", "t0", -20, 860, .9, 7));
// 3. мотор: мойка (шторка до/после) + присадка
scene("eng", "box");
add("eng", el(ENGINE(false), 110, 800, 860, 620, 5) + el(ENGINE(true), 110, 800, 860, 620, 6, "dirty", "clip-path:inset(0 0 0 0)")
  + el("", 110, 780, 12, 660, 7, "wipe", "background:#fff;box-shadow:0 0 20px #7cc8ff;opacity:0")
  + `<div class="el" id="bottle" style="left:640px;top:520px;font-size:120px;z-index:8;opacity:0;transform-origin:50% 100%">🧴</div>`
  + Array.from({ length: 10 }, (_, i) => `<div class="foam" id="fm${i}" style="left:${150 + (i * 83) % 700}px;top:${860 + (i * 57) % 500}px;width:${70 + (i * 13) % 50}px;height:${70 + (i * 13) % 50}px"></div>`).join("")
  + stamp("e1", "БЫЛО МАСЛО → БЛЕСК ✨", 60, 1460, "#4cd964", "#151515", 42, -3) + stamp("e2", "ПРИСАДКА «ТИШИНА» 🤫", 300, 640, "#151515", "#fff", 42, 3)
  + stamp("e3", "СТУК — ДО 1000 КМ", 380, 1560, "#ff3b30", "#fff", 40, 2));
// 4. приборка (лампа «чек») + прогрев в паркинге
scene("dash", "parkade");
add("dash", CAM("car2", "camry_side", 200, 1260, 720) + el(DASH, 90, 680, 900, 420, 8, "dashb", "transform:scale(.7);transform-origin:50% 0")
  + `<div class="el" id="hand" style="left:900px;top:820px;font-size:110px;z-index:9;opacity:0">🪛</div>`
  + stamp("d1", "ЛАМПА «ЧЕК» — В КАРМАН", 70, 1080, "#ff3b30", "#fff", 40, -3) + stamp("d2", "07:00 · ПРОГРЕВ 🔥", 520, 1170, "#ff7a1a", "#151515", 40, 3));
smoke("dash", 6, 160, 1360);
// 5. призыв в середине
scene("cta", "box");
add("cta", `<div class="ctab" id="cta1" style="top:560px"><div class="cbig">Каждую такую машину<br>перекуп купил у хозяина.<br><span>Первым.</span></div><div class="csm">🔔 Свежие объявления — через секунду после публикации · бот «Перехват»</div></div>`
  + BOT("bot2", "неделю назад", "Toyota Camry 2018", "1 350 000 ₽", "🔥 −25% к рынку · хозяин", "1,1 с", 240, 1110));
// 6–7. показ в паркинге и развязка
scene("show", "parkade");
add("show", CAM("car3", "camry", 250, 1010, 600) + hero("tolyan", "t", -20, 880, .82, 7) + hero("vika", "v2", 560, 860, .84, 7) + hero("seryoga", "s", 800, 900, .74, 6)
  + stamp("p1", "НА СОЛНЫШКЕ? В ПАРКИНГЕ?", 120, 1580, "#ffd23f", "#151515", 40, -2)
  + BOT("bot3", "08:06", "Toyota Camry 2018", "1 690 000 ₽", "✅ хозяин · по рынку", "2 с", 30, 520) + stamp("p2", "ПЕРЕКУПЫ ЕЩЁ СПЯТ 😴", 300, 1600, "#4cd964", "#151515", 42, 2));
// 8. финал: чек-лист + один призыв
scene("moral", "box");
add("moral", `<div class="card" id="moralCard" style="top:330px;z-index:20"><h3>ПРОТИВ МАРАФЕТА</h3>
  <div class="li" id="mo0">🖐 Капот холодный — пуск при тебе</div><div class="li" id="mo1">💡 При зажигании все лампы загораются</div>
  <div class="li" id="mo2">✨ Мытый мотор — смотри внимательнее</div></div>
  <div class="ctab" id="cta2" style="top:1060px"><div class="cbig">Бот <span>«Перехват»</span><br>— ссылка в шапке профиля</div><div class="csm">свежие объявления по твоему городу через секунду после публикации — раньше перекупов</div></div>`);

$("#over").insertAdjacentHTML("beforeend", `<div id="tmr">⏳ 08:00</div><div id="rew"><b>⏪ −8 ЧАСОВ</b></div>`);
TOL.forEach(p => { const s = document.getElementById(p + "-shades"); if (s) s.style.display = ""; });
$("#end h2").innerHTML = E.end;
const bub = (line, html, l, t, tx, fs) => { const b = bubble(line, html, l, t, tx); if (fs) b.style.fontSize = fs + "px"; return b; };
bub("v1", "Ниже рынка на двести?<br><em>Или повезло, или марафет.</em>", 300, 1160, 120, 42);
bub("t1", "Брат, за ночь сделаем<br><em>из неё невесту!</em>", 140, 700, 110, 46);
bub("v2", "Капот тёплый.<br><em>Вы её уже грели?</em>", 420, 690, 300, 46);
bub("t2", "Сестрёнка, она<br><em>на солнышке стояла!</em>", 40, 700, 140, 44);
bub("s1", "Зато мотор<br><em>какой чистый!</em>", 560, 720, 360, 46);
bub("v3", "Чистый мотор на 200 тысячах —<br><em>это не забота. Это улика.</em>", 200, 680, 520, 38);
bub("v4", "Хозяин выложил 2 секунды назад.<br><em>Перекупы ещё спят. Едем!</em>", 360, 750, 370, 36);

window.build = R => {
  const tl = R.tl, cam = R.camera($("#cam"), { hand: .6 });
  R.grain(.03);
  gsap.set(".scn", { opacity: 0 }); gsap.set("#sc_hook", { opacity: 1 });
  const { pop } = common(R, cam, { mood: k => k === "vika" ? "flat" : "grin" });
  const talk = (lv, f) => lv > .28 && !(lv < .55 && f % 3 === 2);
  const SW = { box: st.t1 - .9, eng: st.l2 - .7, dash: st.l3 - .7, cta: st.l4 - .7, show: st.v2 - .7, moral: st.rule - .7 };
  R.hooks.push(t => { const f = Math.floor(t * 30);
    if (document.getElementById("t0")) mouth("t0", talk((LIP.tolyan || [])[f] || 0, f) ? "talk" : "grin");
    if (document.getElementById("v2")) mouth("v2", talk((LIP.vika || [])[f] || 0, f) ? "talk" : "flat");
    // таймер «до показа»: 08:00 → 00:00 за ночь (сцены 2–4), на показе — 00:00
    const a = SW.box, b = SW.show, k = Math.min(1, Math.max(0, (t - a) / (b - a))), mins = Math.round(480 * (1 - k));
    $("#tmr").textContent = `⏳ ${String(Math.floor(mins / 60)).padStart(2, "0")}:${String(mins % 60).padStart(2, "0")}`;
    $("#tmr").style.opacity = t > a + .3 && t < b + 1.5 ? 1 : 0;
    // пена на моторе, дым прогрева
    for (let i = 0; i < 10; i++) { const d = document.getElementById("fm" + i), on = t > W("l2", "мойк") && t < W("l2", "масло", 1);
      d.style.opacity = on ? .95 : 0; d.style.transform = `translateY(${Math.sin(t * 3 + i) * 10}px) scale(${.8 + .3 * Math.sin(t * 2 + i)})`; }
    for (let i = 0; i < 6; i++) { const d = document.getElementById("dash_sm" + i), on = t > W("l3", "прогр") - .2 && t < SW.cta, p = ((t * .8 + i / 6) % 1);
      d.style.opacity = on ? (1 - p) * .9 : 0; d.style.transform = `translate(${-p * 200}px,${-p * 150}px) scale(${.5 + p * 1.3})`; }
    if (t > W("l3", "прогр") && t < SW.cta) $("#car2").style.transform = `translateY(${Math.sin(t * 40) * 1.5}px)`; });
  const swap = (from, to, at, kind = "swipe") => {
    if (kind === "cut") { tl.set(`#sc_${from}`, { opacity: 0 }, at).set(`#sc_${to}`, { opacity: 1, x: 0, filter: "none" }, at); R.sfx("hit", at, .4); return; }
    tl.set(`#sc_${to}`, { opacity: 1, x: 1080, filter: "blur(14px)" }, at)
      .to(`#sc_${from}`, { x: -1080, filter: "blur(14px)", duration: .35, ease: "power3.in" }, at)
      .to(`#sc_${to}`, { x: 0, filter: "blur(0px)", duration: .38, ease: "power3.out" }, at + .12)
      .set(`#sc_${from}`, { opacity: 0, x: 0, filter: "none" }, at + .5);
    R.sfx("whoosh", at, .6);
  };
  window.MUSIC = { style: "bed", bpm: 98, end: R.dur - 1.2 };
  const ids = E.lines.map(l => l.id), SWT = Object.values(SW);
  for (const l of ["v1", "t1", "v2", "t2", "s1", "v3", "v4"]) { const nx = ids[ids.indexOf(l) + 1]; const ns = SWT.filter(x => x > st[l]).sort((a, b) => a - b)[0] ?? 1e9;
    pop("#b_" + l, st[l] - .05, Math.min(en[l] + .9, st[nx] - .1, ns - .05)); }
  const slam = (sel, at, sfx = "impact") => { tl.fromTo(sel, { opacity: 0, scale: 2 }, { opacity: 1, scale: 1, duration: .18, ease: "power4.out", immediateRender: false }, at); R.sfx(sfx, at + .02, .7); };
  const popIn = (sel, at) => { tl.fromTo(sel, { opacity: 0, scale: .6, y: 60 }, { opacity: 1, scale: 1, y: 0, duration: .35, ease: "back.out(1.8)", immediateRender: false }, at); R.sfx("ping", at - .03, 1); };

  // 1. хук: бот с первой секунды
  gsap.set("#bot1", { opacity: 1 }); R.sfx("ping", .05, 1);
  tl.fromTo("#bot1", { scale: .85 }, { scale: 1, duration: .3, ease: "back.out(2)", immediateRender: false }, 0);
  tl.to("#title", { opacity: 0, y: -50, duration: .25 }, 1.3);
  R.punch(cam, W("v1", "марафет"), .06);
  // ⏪ на 8 часов назад
  tl.fromTo("#rew", { opacity: 0 }, { opacity: 1, duration: .1, immediateRender: false }, W("l0", "вернем") - .1).to("#rew", { opacity: 0, duration: .15 }, SW.box + .5); R.sfx("glitch", W("l0", "вернем"), .6);
  // 2. бокс
  swap("hook", "box", SW.box);
  tl.fromTo("#car1", { x: 500 }, { x: 0, duration: .9, ease: "power3.out", immediateRender: false }, SW.box + .2);
  // 3. мотор: пена, шторка, присадка
  swap("box", "eng", SW.eng);
  tl.set("#wipe", { opacity: 1, x: 0 }, W("l2", "смыт") - .4).to("#wipe", { x: 860, duration: .9, ease: "power2.inOut" }, W("l2", "смыт") - .4).to("#wipe", { opacity: 0, duration: .1 }, W("l2", "смыт") + .55);
  tl.fromTo("#dirty", { clipPath: "inset(0 0 0 0px)" }, { clipPath: "inset(0 0 0 860px)", duration: .9, ease: "power2.inOut", immediateRender: false }, W("l2", "смыт") - .4); R.sfx("swish", W("l2", "смыт") - .4, .6);
  slam("#e1", W("l2", "смыт") + .5, "pop");
  tl.fromTo("#bottle", { opacity: 0, rotation: 0 }, { opacity: 1, rotation: -110, duration: .4, immediateRender: false }, W("l2", "присад") - .2); slam("#e2", W("l2", "присад"), "pop");
  slam("#e3", W("l2", "тысяч"), "impact");
  // 4. приборка + прогрев
  swap("eng", "dash", SW.dash);
  tl.fromTo("#hand", { opacity: 0, x: 120 }, { opacity: 1, x: -380, duration: .5, ease: "power2.out", immediateRender: false }, W("l3", "лампоч") - .4);
  tl.to("#chk", { opacity: 0, duration: .05 }, W("l3", "карман")); R.sfx("clack", W("l3", "карман"), .7); slam("#d1", W("l3", "карман"), "pop");
  tl.to("#hand", { opacity: 0, duration: .2 }, W("l3", "карман") + .4);
  slam("#d2", W("l3", "прогр"), "pop"); R.sfx("riser", W("l3", "прогр"), .3);
  // 5. призыв в середине
  swap("dash", "cta", SW.cta);
  tl.fromTo("#cta1", { opacity: 0, y: 80, scale: .9 }, { opacity: 1, y: 0, scale: 1, duration: .4, ease: "back.out(1.6)", immediateRender: false }, SW.cta + .3);
  popIn("#bot2", W("l4", "свеж"));
  R.punch(cam, W("l4", "первый"), .06);
  // 6. показ
  swap("cta", "show", SW.show);
  R.punch(cam, W("v2", "грел"), .05);
  slam("#p1", W("l5", "подзем"), "impact"); tl.to("#p1", { opacity: 0, duration: .2 }, st.s1 - .1);
  // 7. развязка через бота
  R.sfx("ping", en.v3 + .25, 1);
  tl.fromTo("#bot3", { opacity: 0, scale: .6, y: 60 }, { opacity: 1, scale: .9, y: 0, duration: .35, ease: "back.out(1.8)", immediateRender: false }, en.v3 + .3);
  tl.to("#T", { opacity: .0, x: -300, duration: .6, ease: "power2.in" }, W("v4", "едем"));
  slam("#p2", W("v4", "спят"), "pop");
  // 8. финал: один призыв
  swap("show", "moral", SW.moral);
  tl.fromTo("#moralCard", { opacity: 0, y: 160 }, { opacity: 1, y: 0, duration: .4, ease: "expo.out", immediateRender: false }, st.rule - .4);
  [st.rule + .1, W("rule", "лампы"), W("rule", "мыт")].forEach((at, i) => { tl.fromTo(`#mo${i}`, { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: .22, immediateRender: false }, at); R.sfx("pop", at, .5); });
  tl.fromTo("#cta2", { opacity: 0, y: 80, scale: .9 }, { opacity: 1, y: 0, scale: 1, duration: .4, ease: "back.out(1.6)", immediateRender: false }, W("rule", "перв")); R.sfx("impact", W("rule", "перв"), .6);
  tl.fromTo("#cta2", { scale: 1 }, { scale: 1.05, duration: .25, yoyo: true, repeat: 3, immediateRender: false }, W("rule", "перехват"));
  ending(R, st.end - .15);
};


// ── ep30c «Ночь»: та же история и озвучка, другая «съёмка» ──
(() => {
  const C = {"t1": "ЛАМПОЧКУ «ЧЕК»", "t2": "— В КАРМАН", "c1": "#ffd23f", "c2": "#151515", "cam": "in", "music": {"style": "phonk", "bpm": 120}};
  const orig = window.build;
  window.build = R => {
    orig(R);
    const tl = R.tl;
    $("#title .a").textContent = C.t1; $("#title .a").style.cssText = `font-size:110px;background:${C.c1};color:${C.c2}`;
    const b = $("#title .b"); b.style.display = ""; b.textContent = C.t2; b.style.cssText = `font-size:60px;background:${C.c2};color:${C.c1}`;
    tl.set("#title", { opacity: 1, y: 0 }, 0).to("#title", { opacity: 0, y: -50, duration: .3 }, 1.2);
    const S = [["hook", 0, st.t1 - .9, "40% 55%"], ["box", st.t1 - .9, st.l2 - .7, "50% 60%"], ["eng", st.l2 - .7, st.l3 - .7, "50% 55%"],
               ["dash", st.l3 - .7, st.l4 - .7, "50% 55%"], ["cta", st.l4 - .7, st.v2 - .7, "50% 45%"], ["show", st.v2 - .7, st.rule - .7, "50% 55%"],
               ["moral", st.rule - .7, st.end - .15, "50% 40%"]];
    S.forEach(([n, a, z, o], i) => {
      const sel = `#sc_${n}`, d = z - a;
      if (C.cam === "in") tl.fromTo(sel, { scale: 1 }, { scale: 1.12, transformOrigin: o, duration: d, ease: "none", immediateRender: false }, a);
      else if (C.cam === "out") tl.fromTo(sel, { scale: 1.12 }, { scale: 1, transformOrigin: o, duration: d, ease: "none", immediateRender: false }, a);
      else if (C.cam === "tilt") tl.fromTo(sel, { scale: 1.06, rotation: i % 2 ? -.8 : .8 }, { scale: 1.1, rotation: 0, transformOrigin: o, duration: d, ease: "none", immediateRender: false }, a);
      else if (C.cam === "punch") tl.fromTo(sel, { scale: 1 }, { scale: 1.09, transformOrigin: o, duration: .45, ease: "back.out(2)", immediateRender: false }, a + .5);
      else if (C.cam === "pan") tl.fromTo(sel, { scale: 1.1, xPercent: i % 2 ? 2.5 : -2.5 }, { scale: 1.1, xPercent: i % 2 ? -2.5 : 2.5, transformOrigin: "50% 50%", duration: d, ease: "none", immediateRender: false }, a);
      else if (C.cam === "vpan") tl.fromTo(sel, { scale: 1.1, yPercent: 2 }, { scale: 1.1, yPercent: -2, transformOrigin: "50% 50%", duration: d, ease: "none", immediateRender: false }, a);
      else tl.fromTo(sel, { scale: i % 2 ? 1 : 1.1 }, { scale: i % 2 ? 1.1 : 1, transformOrigin: o, duration: d, ease: "none", immediateRender: false }, a);
    });
    window.MUSIC = Object.assign({}, window.MUSIC, C.music);
  };
})();
