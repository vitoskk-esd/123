// ОТДЕЛЬНАЯ СЕРИЯ (не про Толяна, владелец 11.11): «Столб, газета и бот». Фермер Фёдор полгода ищет машину по столбу у магазина и газете —
// всегда опаздывает. Племянник Савва ставит «Перехват»; в 5 утра — Прадо ниже рынка, петух опоздал на секунду. Продавец — сосед Митрич за забором
// (внук выложил в Telegram). Развязка: почтальон Гриша привозит газету с тем же объявлением, а Фёдор уже на Прадо.
// Приёмы (новые): отрывные листочки на столбе; петух-будильник; разговор через забор (голова над забором); газета-развязка со штампом «УЖЕ НЕТ».
// Фоны новые: derevnya, dvor, izba. Машина — Прадо.
$("#title .a").textContent = E.rubric; $("#title .b").textContent = E.subtitle; $("#tag span").textContent = "деревенская история";
$("#title .a").style.cssText = "font-size:92px;background:#ffd23f;color:#151515"; $("#title .b").style.cssText = "font-size:120px;background:#4cd964;color:#151515";
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
const hero = (p, l, t, s, o, z = 6, extra = "") => `<div class="c" id="${p.toUpperCase()}" style="left:${l}px;top:${t}px;z-index:${z};transform-origin:0 0;transform:scale(${s});${extra}">${CHARS.perekup(p, o)}</div>`;
const stamp = (id, text, l, t, bg, fg = "#fff", fs = 60, rot = -4) => `<div class="stamp2" id="${id}" style="left:${l}px;top:${t}px;background:${bg};color:${fg};font-size:${fs}px;transform:rotate(${rot}deg)">${text}</div>`;
const CAR = (id, img, l, t, w, z = 5, extra = "") => `<img class="pcar" id="${id}" src="../../kit/img/${img}" style="left:${l}px;top:${t}px;width:${w}px;z-index:${z};${extra}">`;
const PHONE = (id, l, t, w, inner) => `<div class="el" id="${id}" style="left:${l}px;top:${t}px;width:${w}px;z-index:12;background:#0d0e12;border:8px solid #2a2d34;border-radius:44px;padding:22px;box-shadow:0 0 70px rgba(120,180,255,.4);opacity:0">${inner}</div>`;
const BOT = (body, fs = 30) => `<div style="font-family:Onest;font-weight:700;font-size:24px;color:#8b93a3">ПЕРЕХВАТ · бот</div><div style="background:#1c1f26;border-radius:22px;padding:16px 20px;margin-top:10px;font-family:Onest;color:#fff;font-size:${fs}px;line-height:1.42">${body}</div>`;
const STRIPS = (n, torn, k) => `<div class="strips">${Array.from({ length: n }, (_, i) => `<i class="${i < torn ? "torn" : ""}" id="st${k}_${i}"></i>`).join("")}</div>`;
const POLE = (id, l, t) => `<div class="el pole" id="${id}" style="left:${l}px;top:${t}px"><div class="post"></div>
  ${[["ПРОДАМ УАЗ", "#fff", -3, 8, 8], ["Продам Ниву, 2010", "#fff8d8", 2, 7, 7], ["КУПЛЮ НАВОЗ", "#e8f4ff", -1, 6, 0]].map(([t, c, r, n, torn], k) =>
    `<div class="ad" style="margin-left:${k % 2 ? 20 : 0}px;background:${c};transform:rotate(${r}deg)">${t}${STRIPS(n, torn, k)}</div>`).join("")}</div>`;
const ROOSTER = (id, l, t, s = 1) => `<div class="el" id="${id}" style="left:${l}px;top:${t}px;width:${200 * s}px;z-index:14"><svg viewBox="0 0 200 200" style="width:100%;overflow:visible">
  <path d="M60 150 q-40 -60 20 -90 q10 -30 40 -20 q30 10 20 50 q30 -20 50 10 q-10 40 -60 50 z" fill="#c0392b" stroke="#151515" stroke-width="6"/>
  <path d="M150 100 q30 -40 40 -10 q0 30 -30 30" fill="#2f6db5" stroke="#151515" stroke-width="5"/><path d="M95 40 q5 -25 15 -5 q8 -22 15 0" fill="#ff3b30" stroke="#151515" stroke-width="4"/>
  <circle cx="110" cy="62" r="5" fill="#151515"/><g id="${id}_shut"><path d="M86 66 l-18 4 l18 6 z" fill="#ffb02e" stroke="#151515" stroke-width="4"/></g>
  <g id="${id}_open" style="display:none"><path d="M86 64 l-26 -8 l4 6 l-4 8 l26 4 z" fill="#ffb02e" stroke="#151515" stroke-width="4"/></g>
  <path d="M90 160 v30 M110 160 v30" stroke="#e3a33a" stroke-width="7"/></svg><div class="kuka" id="${id}_cry">КУ-КА-РЕ-КУ!</div></div>`;
const PAPER = (id, l, t, w) => `<div class="el paper" id="${id}" style="left:${l}px;top:${t}px;width:${w}px">
  <div class="ph">СЕЛЬСКАЯ НОВЬ <span>№ 44 · вторник</span></div>
  <div class="pb"><div class="lines"></div><div class="adv">ПРОДАМ Toyota Prado 2008, 1 650 000 ₽. Сосновка, ул. Лесная, 12. Митрич<b id="${id}_sold">УЖЕ НЕТ</b></div></div></div>`;
const FEDOR = { jacket: "#5b6b3a", pants: "#2b2f37", hair: "#6b4a2b", beard: true, cap: "#3b3f46" };
const SAVVA = { jacket: "#ff7a1a", pants: "#2b2f37", hair: "#d9a441", item: "phone" };
const MITRICH = { jacket: "#8a6d48", pants: "#3b3f46", hair: "#c9ccd1", mustache: true, ushanka: "#6b6b6b" };
const GRISHA = { jacket: "#2f6db5", pants: "#2b2f37", hair: "#3a2d22", cap: "#2f6db5", item: "bag" };

// 1. улица: столб у магазина, почтальон
scene("ul", "derevnya");
add("ul", POLE("pole1", 440, 820) + hero("fd1", 20, 880, .8, FEDOR) + hero("gr1", 600, 870, .8, GRISHA)
  + `<div class="el paper" id="pp0" style="left:300px;top:1240px;width:520px;opacity:0"><div class="ph">СЕЛЬСКАЯ НОВЬ <span>№ 43</span></div><div class="pb"><div class="lines" style="flex:2"></div></div></div>`
  + stamp("pol", "ПОЛГОДА ПОИСКОВ", 40, 1460, "#ff2da6", "#fff", 46, -3) + stamp("gz3", "ГАЗЕТА: +3 ДНЯ", 520, 1580, "#ffd23f", "#151515", 46, 3));
// 2. изба: племянник ставит бота; ночь, 5:00, петух
scene("izba", "izba");
add("izba", hero("sv", 600, 880, .78, SAVVA) + hero("fd2", 20, 880, .8, FEDOR)
  + PHONE("flt", 430, 1180, 560, BOT(`<b>⚙️ Фильтр</b><br>🚙 внедорожник · до 1 800 000 ₽<br>📍 мой район · 🔔 сразу`, 28))
  + `<div class="el" id="night" style="left:0;top:0;width:1080px;height:1920px;z-index:8;background:rgba(10,20,50,.55);opacity:0"></div>`
  + PHONE("ping", 400, 720, 600, BOT(`<b style="color:#ff7a1a">🔥 −12% к рынку</b><br><b>Toyota Prado 2008 · 1 650 000 ₽</b><br>📍 Сосновка, ул. Лесная<br>⏱ 1 с после публикации`, 30))
  + ROOSTER("roo", 780, 1260, 1.1) + stamp("t500", "05:00", 40, 1380, "#151515", "#ff3b30", 64, -2));
// 3. двор: забор, сосед Митрич, его Прадо
scene("dvor", "dvor");
add("dvor", CAR("pr1", "prado/prado_34.png", 470, 700, 580, 2, "clip-path:inset(0 0 152px 0)")
  + hero("mt", 640, 600, .62, MITRICH, 3, "clip-path:inset(0 0 412px 0)") + hero("fd3", 20, 740, .8, FEDOR)
  + stamp("addr", "ул. Лесная, 12 = СОСЕД", 300, 1130, "#ffd23f", "#151515", 44, -3)
  + `<div class="chat" id="miss" style="left:560px;top:1110px">📞 Митричу: <span id="mcnt" style="color:#ff3b30">0</span> пропущенных</div>`
  + `<div class="el hen" id="hen">🐔</div>`);
// 4. улица через два дня: газета-развязка; 5. финал
scene("ul2", "derevnya");
add("ul2", CAR("pr2", "prado/prado_34.png", 280, 1090, 640, 3) + hero("fd4", 760, 880, .8, { ...FEDOR, item: "cash" }) + hero("gr2", 20, 870, .8, GRISHA) + PAPER("pp1", 40, 1400, 560));
scene("fin", "derevnya");
add("fin", CAR("pr3", "prado/prado_34.png", 330, 1080, 700, 3)
  + `<div class="el cmp" id="cmp"><span id="c1">СТОЛБ — 5 ДНЕЙ</span><span id="c2">ГАЗЕТА — 3 ДНЯ</span><span id="c3" class="ok">БОТ — 1 СЕКУНДА</span></div>`
  + `<div class="ctab" id="cta2" style="top:1330px"><div class="cbig">Бот <span>«Перехват»</span><br>— ссылка в шапке</div><div class="csm">свежие объявления за ~1 с · твой город и бюджет</div></div>`);
$("#end h2").innerHTML = E.end;

const bub = (line, html, l, t, tx, fs) => { const b = bubble(line, html, l, t, tx); if (fs) b.style.fontSize = fs + "px"; return b; };
bub("f1", "Опять всё<br><em>оборвали.</em>", 40, 720, 128, 48);
bub("g1", "Фёдор, свежая газета!<br><em>Ну… позавчерашняя.</em>", 380, 700, 380, 38);
bub("s1", "Дядь Федь, это каменный век.<br><em>Ставлю тебе бота.</em>", 330, 700, 410, 34);
bub("m1", "Федя, ты чего<br><em>так рано?</em>", 520, 450, 230, 40);
bub("f2", "Митрич… это ж<br><em>твой Прадо?!</em>", 30, 590, 128, 38);
bub("m2", "Внук в телеграм выложил. Сказал —<br><em>на столб уже никто не смотрит.</em>", 330, 450, 420, 30);
bub("f3", "Беру. Скинешь —<br><em>за сено и мёд?</em>", 30, 590, 128, 38);
bub("m3", "Сено — давай.<br><em>Мёд себе оставь.</em>", 520, 450, 230, 40);
bub("g2", "Фёдор, тут Прадо продают —<br><em>по соседству!</em>", 30, 700, 128, 34);
bub("f4", "Знаю, Гриша.<br><em>Я на нём.</em>", 600, 700, 270, 44);

window.build = R => {
  const tl = R.tl, cam = R.camera($("#cam"), { hand: .6 });
  R.grain(.03);
  gsap.set(".scn", { opacity: 0 }); gsap.set("#sc_ul", { opacity: 1 });
  const { pop } = common(R, cam);
  const talk = (lv, f) => lv > .28 && !(lv < .55 && f % 3 === 2);
  const SP = { fd1: "fedor", fd2: "fedor", fd3: "fedor", fd4: "fedor", gr1: "grisha", gr2: "grisha", sv: "savva", mt: "mitrich" };
  const mood = (k, t) => k === "fedor" && (t < st.l0 || (t > st.l3 && t < st.f3)) ? (t < st.l0 ? "flat" : "o") : "grin";
  R.hooks.push(t => { const f = Math.floor(t * 30);
    for (const [p, k] of Object.entries(SP)) if (document.getElementById(p)) mouth(p, talk((LIP[k] || [])[f] || 0, f) ? "talk" : mood(k, t)); });
  window.MUSIC = { style: "toon", bpm: 108, end: R.dur - 1.2 };
  const ids = E.lines.map(l => l.id), nxt = l => ids[ids.indexOf(l) + 1];
  const SW = { izba: st.s1 - .5, dvor: st.l4 - .35, ul2: W("l5", "через", 1) - .3, fin: st.end - .35 };
  const ends = Object.values(SW).sort((a, b) => a - b);
  for (const l of ["f1", "g1", "s1", "m1", "f2", "m2", "f3", "m3", "g2", "f4"]) {
    const cap = ends.find(x => x > st[l]) ?? 1e9, n = nxt(l);
    pop("#b_" + l, st[l] - .05, Math.min(en[l] + .9, n ? st[n] - .1 : en[l] + 1, cap - .05));
  }
  const swap = (from, to, at) => {
    tl.set(`#sc_${to}`, { opacity: 1, x: 1080, filter: "blur(14px)" }, at)
      .to(`#sc_${from}`, { x: -1080, filter: "blur(14px)", duration: .35, ease: "power3.in" }, at)
      .to(`#sc_${to}`, { x: 0, filter: "blur(0px)", duration: .38, ease: "power3.out" }, at + .12)
      .set(`#sc_${from}`, { opacity: 0, x: 0, filter: "none" }, at + .5);
    R.sfx("whoosh", at, .6);
  };
  const show = (sel, at) => { tl.fromTo(sel, { opacity: 0, scale: .7, y: 60 }, { opacity: 1, scale: 1, y: 0, duration: .35, ease: "back.out(1.8)", immediateRender: false }, at); R.sfx("ping", at - .03, 1); };
  const hide = (sel, at) => tl.to(sel, { opacity: 0, duration: .2 }, at);
  const slam = (sel, at, sfx = "impact") => { tl.fromTo(sel, { opacity: 0, scale: 2 }, { opacity: 1, scale: 1, duration: .18, ease: "power4.out", immediateRender: false }, at); R.sfx(sfx, at + .02, .7); };

  // 1. столб: камера наезжает на оборванные «телефончики», почтальон въезжает
  tl.to("#title", { opacity: 0, y: -50, duration: .25 }, 1.9);
  tl.fromTo(cam, { s: 1.18, x: -120, y: 60 }, { s: 1, x: 0, y: 0, duration: 2.2, ease: "power2.out", immediateRender: false }, .2);
  tl.fromTo("#st2_5", { y: 0, rotation: 0, opacity: 1 }, { y: 260, rotation: 40, opacity: 0, duration: .9, ease: "power2.in", immediateRender: false }, st.f1 + .3);
  slam("#pol", W("l0", "полгод"), "pop"); hide("#pol", st.g1 - .3);
  tl.fromTo("#GR1", { x: 520 }, { x: 0, duration: .7, ease: "power2.out", immediateRender: false }, st.g1 - .9); R.sfx("ring", st.g1 - .8, .4);
  tl.fromTo("#pp0", { opacity: 0, y: 80, rotation: 6 }, { opacity: 1, y: 0, rotation: -3, duration: .35, ease: "back.out(1.6)", immediateRender: false }, W("g1", "газет"));
  slam("#gz3", W("l1", "трет"), "impact");
  // 2. изба: фильтр; ночь → 5:00, уведомление, петух — через секунду
  swap("ul", "izba", SW.izba);
  show("#flt", W("l2", "настро")); hide("#flt", st.l3 - .1);
  tl.to("#night", { opacity: 1, duration: .5 }, st.l3 - .2); tl.to("#SV", { opacity: 0, duration: .3 }, st.l3 - .2);
  slam("#t500", W("l3", "пять"), "tick");
  show("#ping", W("l3", "прислал")); R.sfx("ping", W("l3", "прислал") + .1, .9); R.punch(cam, W("l3", "прислал") + .1, .06);
  const kuka = W("l3", "петух") + .2;
  tl.set("#roo_shut", { display: "none" }, kuka).set("#roo_open", { display: "" }, kuka)
    .fromTo("#roo_cry", { opacity: 0, scale: .4 }, { opacity: 1, scale: 1, duration: .2, ease: "back.out(3)", immediateRender: false }, kuka);
  R.sfx("riser", kuka - .1, .5); R.shake(cam, kuka + .05, .6, .4);
  tl.to("#FD2", { y: -40, duration: .12, yoyo: true, repeat: 1 }, kuka);
  // 3. двор: адрес = сосед; голова над забором; торг
  swap("izba", "dvor", SW.dvor);
  slam("#addr", W("l4", "забор"), "impact"); hide("#addr", st.m1 + .2);
  tl.fromTo("#MT", { y: 200 }, { y: 0, duration: .45, ease: "back.out(1.6)", immediateRender: false }, st.m1 - .6); R.sfx("pop", st.m1 - .5, .6);
  tl.set("#MT", { y: 200 }, 0);
  tl.fromTo("#hen", { x: 0, y: 0, opacity: 1 }, { x: -520, y: -60, duration: 1.1, ease: "power1.inOut", immediateRender: false }, st.f2 + .2); R.sfx("swish", st.f2 + .2, .5);
  R.punch(cam, W("f2", "прадо"), .07);
  tl.fromTo("#miss", { opacity: 0, x: 60 }, { opacity: 1, x: 0, duration: .3, immediateRender: false }, st.l5);
  R.count($("#mcnt"), W("l5", "позвон"), 0, 5, 1.2); for (let k = 0; k < 4; k++) R.sfx("ring", W("l5", "позвон") + .3 * k, .25);
  // 4. через два дня: газета, «УЖЕ НЕТ»
  swap("dvor", "ul2", SW.ul2);
  tl.fromTo("#pp1", { opacity: 0, y: 80, rotation: 6 }, { opacity: 1, y: 0, rotation: -3, duration: .35, ease: "back.out(1.6)", immediateRender: false }, st.g2 - .2);
  slam("#pp1_sold", st.f4 + .6, "boom");
  // 5. финал: сравнение и призыв
  swap("ul2", "fin", SW.fin);
  ["#c1", "#c2", "#c3"].forEach((c, k) => slam(c, W("end", ["столб", "газет", "бот"][k]), k === 2 ? "boom" : "clack"));
  tl.fromTo("#cta2", { opacity: 0, y: 80, scale: .9 }, { opacity: 1, y: 0, scale: 1, duration: .4, ease: "back.out(1.6)", immediateRender: false }, W("end", "подпиш") - .3);
  ending(R, en.end + .3);
};
