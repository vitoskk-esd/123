// «ТРИ ПРОДАВЦА» — разнообразие (владелец 07.11): без уведомления в хуке, без плашки-призыва в середине, без «угадай цену».
// Набережная вечером (фон впервые), три Mercedes CLS владельца (kit/img/cls, чёрный/вишнёвый — перекраска по пикселям, диски родные).
// Продают перекуп Толян, мошенник Аркадий и хозяин Костя (новый герой); Вика сверяет цену в карточке «Перехвата» — это приём конверсии серии.
$("#title .a").textContent = E.rubric; $("#title .b").textContent = E.subtitle; $("#tag span").textContent = "три продавца";
$("#title .a").style.cssText = "font-size:86px;background:#ffd23f;color:#151515"; $("#title .b").style.cssText = "font-size:76px;background:#151515;color:#fff";
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
const hero = (kind, p, l, t, s = 1, z = 6, o) => `<div class="c" id="${p.toUpperCase()}" style="left:${l}px;top:${t}px;z-index:${z};transform-origin:0 0;transform:scale(${s})">${CHARS[kind](p, o)}</div>`;
const stamp = (id, text, l, t, bg, fg = "#fff", fs = 60, rot = -4) => `<div class="stamp2" id="${id}" style="left:${l}px;top:${t}px;background:${bg};color:${fg};font-size:${fs}px;transform:rotate(${rot}deg)">${text}</div>`;
const CLS = (id, p, l, t, w, z = 3) => `<img class="pcar" id="${id}" src="../../kit/img/cls/cls_34${p === "white" ? "" : "_" + p}.png" style="left:${l}px;top:${t}px;width:${w}px;z-index:${z}">`;
const TAG = (id, txt, n, l, t, bg) => `<div class="ptag" id="${id}" style="left:${l}px;top:${t}px;background:${bg}"><span>№${n}</span> ${txt}</div>`;
const ARK = { coat: "#c69c6d", jacket: "#c69c6d", glasses: true, mustache: true, hair: "#2b1d14", tie: "#8e1b1b", item: "phone" };
const KOS = { jacket: "#4a6b8a", pants: "#2b2f37", glasses: true, hair: "#6b4a2a", item: "bag" };
const VIKAS = ["v0", "v2", "v3", "v4"], TOLS = ["t2"], KOSS = ["k", "k2"];
const ROW = (pre) => CLS(pre + "1", "black", -40, 1240, 420) + CLS(pre + "2", "white", 330, 1260, 420) + CLS(pre + "3", "cherry", 690, 1240, 420);

// 1. хук: три CLS на набережной
scene("hook", "embank");
add("hook", ROW("r") + TAG("g1", "1 450 000", 1, 20, 1120, "#ff7a1a") + TAG("g2", "890 000", 2, 390, 1150, "#ffd23f") + TAG("g3", "1 190 000", 3, 720, 1120, "#4cd964")
  + hero("vika", "v0", 400, 760, .56, 2));
// 2. №1 Толян
scene("p1", "embank");
add("p1", CLS("c1", "black", 280, 1230, 660) + hero("tolyan", "t", -20, 860, .84, 7) + hero("vika", "v", 800, 880, .74, 7)
  + `<div class="el" id="ring1" style="left:700px;top:1250px;width:180px;height:120px;border:8px solid #ffd23f;border-radius:50%;z-index:8;opacity:0"></div>`
  + stamp("q1", "КРАСИЛИ 2 РАЗА", 80, 1560, "#151515", "#fff", 42, -3) + stamp("q2", "ПУШКА = ГЛУШИТЕЛЬ", 380, 1660, "#ff3b30", "#fff", 40, 2));
// 3. №2 Аркадий — машины нет, это фото
scene("p2", "embank");
add("p2", CLS("c2", "white", 280, 1230, 660) + hero("vika", "v2", -10, 880, .74, 7) + hero("perekup", "a", 740, 860, .82, 7, ARK)
  + stamp("q3", "−25% К РЫНКУ + ПРЕДОПЛАТА", 60, 1560, "#ff3b30", "#fff", 36, -2) + stamp("q4", "ТОЛЬКО НА ФОТО 📷", 300, 1660, "#151515", "#fff", 40, 2));
// 4. №3 Костя
scene("p3", "embank");
add("p3", CLS("c3", "cherry", 280, 1230, 660) + hero("perekup", "k", -10, 870, .84, 7, KOS) + hero("vika", "v3", 800, 880, .74, 7)
  + `<div class="el" id="docs" style="left:150px;top:1180px;width:180px;height:130px;z-index:9;opacity:0;font-size:110px">📄</div>`
  + stamp("q5", "СКУЧНО. ПОДОЗРИТЕЛЬНО СКУЧНО", 140, 1580, "#ffd23f", "#151515", 36, -2));
// 5. Вика сверяет цену в «Перехвате»
scene("bot", "embank");
add("bot", CLS("c4", "cherry", 330, 1270, 620) + hero("vika", "v4", -10, 880, .8, 7)
  + `<div class="botcard" id="mkt" style="left:400px;top:1000px;width:640px"><div class="bh">ПЕРЕХВАТ · бот · карточка объявления</div><div class="bb"><b>Mercedes CLS 2008 · 1 190 000 ₽</b><br><b style="color:#4cd964">✅ по рынку</b> · похожие сейчас: <b>1,15–1,25 млн</b><br>📍 твой город</div></div>`
  + stamp("q6", "10 СЕКУНД ⏱", 520, 1580, "#4cd964", "#151515", 46, 3));
// 6. Толян опоздал
scene("late", "embank");
add("late", CLS("c5", "cherry", 300, 1240, 640) + hero("perekup", "k2", -10, 870, .84, 7, KOS) + hero("tolyan", "t2", 790, 880, .76, 7)
  + stamp("q7", "ПРОДАНО ✅", 360, 1580, "#4cd964", "#151515", 56, -3));
// 7. три типа продавцов
scene("rules", "embank");
add("rules", ROW("s") + stamp("w1", "ВЫШЕ РЫНКА + «НЕ БИТ» — ПЕРЕКУП", 40, 900, "#ff7a1a", "#151515", 32, -3)
  + stamp("w2", "НИЖЕ РЫНКА + ПРЕДОПЛАТА — РАЗВОД", 40, 1010, "#ffd23f", "#151515", 32, 2) + stamp("w3", "ПО РЫНКУ + ДОКУМЕНТЫ — СМОТРИ", 60, 1120, "#4cd964", "#151515", 32, -2)
  + `<div class="ctab" id="cta2" style="top:1560px;padding:18px 26px"><div class="cbig" style="font-size:40px">Бот <span>«Перехват»</span> — ссылка в шапке</div><div class="csm" style="font-size:24px">в каждой карточке — насколько ниже или выше рынка</div></div>`);

TOLS.concat(["t"]).forEach(p => { const s = document.getElementById(p + "-shades"); if (s) s.style.display = ""; });
$("#end h2").innerHTML = E.end;
const bub = (line, html, l, t, tx, fs) => { const b = bubble(line, html, l, t, tx); if (fs) b.style.fontSize = fs + "px"; return b; };
bub("t1", "Сестрёнка, не бит, не крашен,<br><em>мотор — пушка!</em>", 40, 740, 120, 40);
bub("v1", "А почему крыло<br><em>другого оттенка?</em>", 470, 760, 480, 44);
bub("t2", "Это…<br><em>освещение!</em>", 40, 760, 120, 46);
bub("a1", "Срочно, уезжаю. Скиньте<br><em>предоплату — придержу.</em>", 330, 740, 570, 40);
bub("v2", "Покажите машину<br><em>вживую.</em>", 40, 760, 110, 44);
bub("a2", "Она… на другом<br><em>берегу.</em>", 420, 740, 480, 44);
bub("k1", "Продаю сам. ПТС на меня,<br><em>чеки по ТО — вот.</em>", 40, 740, 130, 40);
bub("v3", "Миллион сто девяносто —<br><em>по рынку. Беру.</em>", 40, 730, 120, 42);
bub("t3", "Брат, за миллион<br><em>отдашь? Наличкой!</em>", 520, 740, 420, 42);
bub("k2", "Уже продал.<br><em>По рынку.</em>", 40, 740, 130, 46);

window.build = R => {
  const tl = R.tl, cam = R.camera($("#cam"), { hand: .6 });
  R.grain(.03);
  gsap.set(".scn", { opacity: 0 }); gsap.set("#sc_hook", { opacity: 1 });
  const { pop } = common(R, cam, { mood: k => k === "vika" ? "flat" : "grin" });
  const talk = (lv, f) => lv > .28 && !(lv < .55 && f % 3 === 2);
  const SW = { p1: st.t1 - .7, p2: st.a1 - .7, p3: st.k1 - .7, bot: st.v3 - .7, late: st.t3 - .7, rules: st.rule - .7 };
  R.hooks.push(t => { const f = Math.floor(t * 30), lv = (LIP.vika || [])[f] || 0, lt = (LIP.tolyan || [])[f] || 0, la = (LIP.arkady || [])[f] || 0, lk = (LIP.kostya || [])[f] || 0;
    VIKAS.forEach(p => { if (document.getElementById(p)) mouth(p, talk(lv, f) ? "talk" : "flat"); });
    TOLS.forEach(p => { if (document.getElementById(p)) mouth(p, talk(lt, f) ? "talk" : "grin"); });
    KOSS.forEach(p => { if (document.getElementById(p)) mouth(p, talk(lk, f) ? "talk" : "grin"); });
    if (document.getElementById("a")) mouth("a", talk(la, f) ? "talk" : "grin");
    // белый CLS Аркадия «мигает»: его нет, это фото
    const ph = W("l2", "фото"); $("#c2").style.opacity = t > ph - .1 && t < ph + 1.2 ? ((Math.floor(t * 8) % 2) ? .15 : .9) : (t >= ph + 1.2 && t < SW.p3 ? .15 : 1); });
  const swap = (from, to, at) => {
    tl.set(`#sc_${to}`, { opacity: 1, x: 1080, filter: "blur(14px)" }, at)
      .to(`#sc_${from}`, { x: -1080, filter: "blur(14px)", duration: .35, ease: "power3.in" }, at)
      .to(`#sc_${to}`, { x: 0, filter: "blur(0px)", duration: .38, ease: "power3.out" }, at + .12)
      .set(`#sc_${from}`, { opacity: 0, x: 0, filter: "none" }, at + .5);
    R.sfx("whoosh", at, .6);
  };
  window.MUSIC = { style: "bed", bpm: 96, end: R.dur - 1.2 };
  const ids = E.lines.map(l => l.id), SWT = Object.values(SW);
  for (const l of ["t1", "v1", "t2", "a1", "v2", "a2", "k1", "v3", "t3", "k2"]) { const nx = ids[ids.indexOf(l) + 1]; const ns = SWT.filter(x => x > st[l]).sort((a, b) => a - b)[0] ?? 1e9;
    pop("#b_" + l, st[l] - .05, Math.min(en[l] + .9, st[nx] - .1, ns - .05)); }
  const slam = (sel, at, sfx = "impact") => { tl.fromTo(sel, { opacity: 0, scale: 2 }, { opacity: 1, scale: 1, duration: .18, ease: "power4.out", immediateRender: false }, at); R.sfx(sfx, at + .02, .7); };

  // 1. хук: ценники по одному, Вика идёт вдоль машин
  tl.to("#title", { opacity: 0, y: -50, duration: .25 }, W("h", "три") - .2);
  [["#g1", W("h", "перекуп")], ["#g2", W("h", "мошенн")], ["#g3", W("h", "хозя")]].forEach(([s, a]) => slam(s, a, "pop"));
  // Вика просто стоит у машин (владелец 07.11: «очень быстро перемещается» — скачок в начале и скольжение без шагов убраны)
  // 2. Толян: крыло другого оттенка
  swap("hook", "p1", SW.p1);
  tl.fromTo("#ring1", { opacity: 0, scale: .6 }, { opacity: 1, scale: 1, duration: .25, ease: "back.out(2)", immediateRender: false }, W("v1", "крыл")); R.sfx("ping", W("v1", "крыл"), .5);
  slam("#q1", W("l1", "краси"), "pop"); slam("#q2", W("l1", "глуш"), "impact");
  // 3. Аркадий: только на фото
  swap("p1", "p2", SW.p2);
  slam("#q3", W("l2", "четвер"), "pop"); slam("#q4", W("l2", "фото"), "glitch");
  // 4. Костя: документы
  swap("p2", "p3", SW.p3);
  tl.fromTo("#docs", { opacity: 0, y: 40, rotation: -10 }, { opacity: 1, y: 0, rotation: 0, duration: .3, ease: "back.out(2)", immediateRender: false }, W("k1", "чеки")); R.sfx("pop", W("k1", "чеки"), .5);
  slam("#q5", W("l3", "подозр"), "pop");
  // 5. Вика и «Перехват»
  swap("p3", "bot", SW.bot);
  tl.fromTo("#mkt", { opacity: 0, scale: .6, y: 60 }, { opacity: 1, scale: 1, y: 0, duration: .35, ease: "back.out(1.8)", immediateRender: false }, SW.bot + .4); R.sfx("ping", SW.bot + .37, 1);
  R.punch(cam, W("v3", "беру"), .05); slam("#q6", W("l4", "10"), "pop");
  // 6. Толян опоздал
  swap("bot", "late", SW.late);
  tl.fromTo("#T2", { x: 400 }, { x: 0, duration: .5, ease: "back.out(1.4)", immediateRender: false }, SW.late + .2);
  slam("#q7", W("k2", "продал"), "impact");
  // 7. три типа продавцов + одна финальная карточка
  swap("late", "rules", SW.rules);
  [["#w1", st.rule + .1], ["#w2", W("rule", "сильно")], ["#w3", W("rule", "по", 1)]].forEach(([s, a]) => slam(s, a, "pop"));
  tl.fromTo("#cta2", { opacity: 0, y: 80, scale: .9 }, { opacity: 1, y: 0, scale: 1, duration: .4, ease: "back.out(1.6)", immediateRender: false }, W("rule", "свер")); R.sfx("impact", W("rule", "свер"), .6);
  ending(R, st.end - .15);
};
