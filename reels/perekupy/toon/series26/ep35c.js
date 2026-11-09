// МИНИ-СЕРИАЛ «ТОЛЯН: СО СТА ТЫСЯЧ», часть 3 «Конкурент». Все фоны новые (pochta, shaurma, laundry, sad, most), второстепенные герои новые
// (конкурент Жора, дед Семёныч, Нина Петровна, курьер Тимур). Жора берёт скоростью звонков; Толян — фильтром бота (~1 с) и проверкой на сайте Госавтоинспекции.
$("#title .a").textContent = E.rubric; $("#title .b").textContent = E.subtitle; $("#tag span").textContent = "со ста тысяч · 3";
$("#title .a").style.cssText = "font-size:96px;background:#ffd23f;color:#151515"; $("#title .b").style.cssText = "font-size:70px;background:#151515;color:#fff";
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
const CAR = (id, img, l, t, w, z = 3) => `<img class="pcar" id="${id}" src="../../kit/img/${img}" style="left:${l}px;top:${t}px;width:${w}px;z-index:${z}">`;
const CASH = (id, l, t, n = 4) => `<div class="el" id="${id}" style="left:${l}px;top:${t}px;width:300px;height:160px;z-index:8;opacity:0">` + Array.from({ length: n }, (_, i) => `<div style="position:absolute;left:${i * 26}px;top:${60 - i * 10}px;width:150px;height:76px;background:#8fd17a;border:5px solid #151515;border-radius:8px;transform:rotate(${-10 + i * 5}deg)"></div>`).join("") + `</div>`;
const PHONE = (id, l, t, w, inner) => `<div class="el" id="${id}" style="left:${l}px;top:${t}px;width:${w}px;z-index:9;background:#0d0e12;border:8px solid #2a2d34;border-radius:44px;padding:22px;box-shadow:0 0 70px rgba(120,180,255,.4);opacity:0">${inner}</div>`;
const BOT = (body, fs = 30) => `<div style="font-family:Onest;font-weight:700;font-size:24px;color:#8b93a3">ПЕРЕХВАТ · бот</div><div style="background:#1c1f26;border-radius:22px;padding:16px 20px;margin-top:10px;font-family:Onest;color:#fff;font-size:${fs}px;line-height:1.45">${body}</div>`;
const ZHORA = { jacket: "#1d1d1f", pants: "#2b2f37", cap: "#c0392b", mustache: true, chain: true, hair: "#1d1d1f", item: "phone", look: "grin" };
const SEMEN = { coat: "#5b4a3a", pants: "#3b3f46", ushanka: true, beard: true, hair: "#d9d9d9", scarf: "#c0392b" };
const TIMUR = { jacket: "#2ec4b6", pants: "#2b2f37", cap: "#3fae4f", hair: "#1d1d1f", item: "bag" };
const TOLS = ["t", "t2", "t3", "t4", "t5", "t6", "t7"];

// 1. почта: Жора уже забрал машину у Семёныча
scene("pochta", "pochta");
add("pochta", CAR("car1", "vaz2115/vaz2115.png", 330, 1130, 620) + hero("perekup", "zh", 520, 860, .8, 7, ZHORA) + hero("perekup", "se", 230, 880, .76, 6, SEMEN)
  + hero("tolyan", "t", -40, 900, .74, 7) + stamp("p1", "ЧАСТЬ 3 · КОНКУРЕНТ", 60, 1500, "#ff2da6", "#fff", 50, -3));
// 2. шаурмичная: кто такой Жора
scene("shaurma", "shaurma");
add("shaurma", hero("perekup", "zh2", 560, 860, .82, 7, ZHORA) + hero("tolyan", "t2", 20, 900, .74, 7)
  + [[600, 1210, -14], [700, 1250, 8], [810, 1200, -4]].map(([l, t, r], i) => `<div class="mph" id="ph${i}" style="left:${l}px;top:${t}px;transform:rotate(${r}deg)"><i></i></div>`).join("")
  + stamp("s1", "3 ТЕЛЕФОНА · 40 ЧАТОВ", 80, 1560, "#151515", "#ffd23f", 44, -2));
// 3. прачечная: фильтр бота на ночь
scene("laundry", "laundry");
add("laundry", hero("tolyan", "t3", 620, 880, .8, 7)
  + PHONE("flt", 30, 720, 560, BOT(`<b>⚙️ Фильтр</b><br>🏙 Город: мой<br>💰 Бюджет: до 80 000 ₽<br>🔔 Новое объявление → сразу, ~1 с`))
  + stamp("mid", "БОТ «ПЕРЕХВАТ» — ССЫЛКА В ШАПКЕ", 50, 1560, "#ffd23f", "#151515", 36, -2));
// 4. СНТ на рассвете: Толян первый
scene("sad", "sad");
add("sad", CAR("car2", "vaz2109/vaz2109.png", 300, 1150, 640) + hero("galya", "ni", 590, 870, .8, 6) + hero("tolyan", "t4", 20, 900, .76, 7)
  + PHONE("bot2", 30, 1330, 470, BOT(`<b style="color:#ff7a1a">🔥 −28% к рынку</b><br><b>ВАЗ-2109 · 75 000 ₽</b><br>⏱ 1 с после публикации`, 28))
  + stamp("ok1", "✅ ОГРАНИЧЕНИЙ НЕТ", 40, 1650, "#4cd964", "#151515", 42, 3) + stamp("d1", "−68 000 ₽", 600, 1360, "#ff3b30", "#fff", 50, -3));
// 5. СНТ, 8:02: Жора опоздал
scene("sad2", "sad");
add("sad2", CAR("car3", "w124/w124_34.png", 520, 1180, 560) + hero("perekup", "zh3", 640, 860, .8, 7, { ...ZHORA, look: "angry" }) + hero("galya", "ni2", 230, 880, .76, 6)
  + hero("tolyan", "t5", -40, 900, .74, 7) + stamp("z1", "ПОЗДНО, МИЛОК", 200, 1560, "#4cd964", "#151515", 50, 3)
  + [0, 1, 2, 3].map(i => `<div class="puff2" id="pf${i}" style="left:${900 + i * 40}px;top:${1340 - i * 30}px;width:${110 + i * 30}px;height:${80 + i * 20}px"></div>`).join(""));
// 6. под мостом: продажа Тимуру
scene("most", "most");
add("most", CAR("car4", "vaz2109/vaz2109.png", 280, 1160, 640) + hero("perekup", "ti", 600, 870, .78, 7, TIMUR) + hero("tolyan", "t6", -20, 900, .76, 7)
  + CASH("cash1", 420, 1420, 4) + stamp("m1", "+30 000 ₽", 80, 1560, "#4cd964", "#151515", 56, -3));
// 7. мост: Жора приходит сам + крючок + финальная карточка
scene("most2", "most");
add("most2", hero("perekup", "zh4", 640, 860, .8, 7, ZHORA) + hero("tolyan", "t7", -20, 900, .76, 7)
  + `<div class="el" id="nx" style="left:60px;right:60px;top:300px;z-index:20;background:#0d0e12;border:6px solid #fff;border-radius:30px;padding:22px 26px;color:#fff;font-family:Unbounded;font-weight:900;font-size:46px;line-height:1.25;text-align:center;opacity:0">ЧАСТЬ 4:<br><span style="color:#ffd23f">партнёр</span> или <span style="color:#ff3b30">ловушка?</span></div>
  <div class="ctab" id="cta2" style="top:1300px"><div class="cbig">Бот <span>«Перехват»</span><br>— ссылка в шапке</div><div class="csm">новые объявления через ~1 с · город и бюджет</div></div>`);

$(".stage").insertAdjacentHTML("beforeend", `<div id="cnt" style="opacity:0">💸 78 000 ₽</div><div id="score">ЖОРА 1 : 0 ТОЛЯН</div><div id="clk2">23:40</div>`);
TOLS.forEach(p => { const s = document.getElementById(p + "-shades"); if (s) s.style.display = ""; });
$("#end h2").innerHTML = E.end;
const bub = (line, html, l, t, tx, fs) => { const b = bubble(line, html, l, t, tx); if (fs) b.style.fontSize = fs + "px"; return b; };
bub("z1", "Опоздал, студент.<br><em>Машина моя.</em>", 500, 700, 188, 46);
bub("z2", "Ты ещё читаешь —<br><em>а я уже звоню.</em>", 540, 700, 188, 44);
bub("t1", "Посмотрим,<br><em>кто быстрее.</em>", 600, 720, 188, 48);
bub("n1", "Сынок, ты первый.<br><em>Остальные — с восьми.</em>", 480, 700, 278, 40);
bub("z3", "Мать, даю<br><em>восемьдесят!</em>", 540, 700, 268, 48);
bub("n2", "Поздно, милок.<br><em>Уже продала.</em>", 160, 720, 230, 44);
bub("ti1", "Первая машина!<br><em>Проверю — и беру.</em>", 520, 700, 244, 42);
bub("z4", "Студент…<br><em>давай работать вместе?</em>", 440, 700, 368, 42);

window.build = R => {
  const tl = R.tl, cam = R.camera($("#cam"), { hand: .6 });
  R.grain(.03);
  gsap.set(".scn", { opacity: 0 }); gsap.set("#sc_pochta", { opacity: 1 });
  const { pop } = common(R, cam, { mood: () => "grin" });
  const talk = (lv, f) => lv > .28 && !(lv < .55 && f % 3 === 2);
  const SW = { shaurma: st.l1 - .7, laundry: st.l2 - .7, sad: st.l3 - .7, sad2: st.z3 - .7, most: st.l6 - .7, most2: st.z4 - .7 };
  const STEPS = [[0, 78000, 0], [W("l4", "68"), 10000, 1], [W("l7", "капитал"), 108000, 0]];
  const fmt = v => Math.round(v).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  const SP = [["zh", "zhora"], ["zh2", "zhora"], ["zh3", "zhora"], ["zh4", "zhora"], ["ni", "nina"], ["ni2", "nina"], ["ti", "timur"], ["se", "_"]];
  const sad = ["t", "t2"];
  R.hooks.push(t => { const f = Math.floor(t * 30), lt = (LIP.tolyan || [])[f] || 0;
    TOLS.forEach(p => { if (document.getElementById(p)) mouth(p, talk(lt, f) ? "talk" : (sad.includes(p) ? "o" : "grin")); });
    SP.forEach(([p, k]) => { if (document.getElementById(p)) mouth(p, talk((LIP[k] || [])[f] || 0, f) ? "talk" : (k === "zhora" && p !== "zh3" ? "grin" : "flat")); });
    let v = 0, prev = 0, car = 0; for (const [at, to, c] of STEPS) { if (t < at) break; v = prev + (to - prev) * Math.min(1, (t - at) / .7); prev = to; car = c; }
    $("#cnt").textContent = `💸 ${fmt(v)} ₽${car ? " + 🚗" : ""}`; });
  tl.to("#cnt", { opacity: 1, duration: .3 }, 1.6); tl.to("#cnt", { opacity: 0, duration: .2 }, st.end - .2);
  STEPS.slice(1).forEach(([at]) => { tl.fromTo("#cnt", { scale: 1.35 }, { scale: 1, duration: .3, ease: "back.out(2)", immediateRender: false }, at); R.sfx("tick", at, .9); });
  const swap = (from, to, at) => {
    tl.set(`#sc_${to}`, { opacity: 1, x: 1080, filter: "blur(14px)" }, at)
      .to(`#sc_${from}`, { x: -1080, filter: "blur(14px)", duration: .35, ease: "power3.in" }, at)
      .to(`#sc_${to}`, { x: 0, filter: "blur(0px)", duration: .38, ease: "power3.out" }, at + .12)
      .set(`#sc_${from}`, { opacity: 0, x: 0, filter: "none" }, at + .5);
    R.sfx("whoosh", at, .6);
  };
  window.MUSIC = { style: "story", bpm: 104, end: R.dur - 1.2 };
  const ids = E.lines.map(l => l.id), SWT = Object.values(SW);
  for (const l of ["z1", "z2", "t1", "n1", "z3", "n2", "ti1", "z4"]) { const nx = ids[ids.indexOf(l) + 1]; const ns = SWT.filter(x => x > st[l]).sort((a, b) => a - b)[0] ?? 1e9;
    pop("#b_" + l, st[l] - .05, Math.min(en[l] + .9, st[nx] - .1, ns - .05)); }
  const slam = (sel, at, sfx = "impact") => { tl.fromTo(sel, { opacity: 0, scale: 2 }, { opacity: 1, scale: 1, duration: .18, ease: "power4.out", immediateRender: false }, at); R.sfx(sfx, at + .02, .7); };
  const show = (sel, at) => { tl.fromTo(sel, { opacity: 0, scale: .7, y: 60 }, { opacity: 1, scale: 1, y: 0, duration: .35, ease: "back.out(1.8)", immediateRender: false }, at); R.sfx("ping", at - .03, 1); };
  const score = (text, at) => { tl.set("#score", { textContent: text }, at); tl.fromTo("#score", { scale: 1.4 }, { scale: 1, duration: .3, ease: "back.out(2)", immediateRender: false }, at); R.sfx("clack", at, .7); };
  const clock = (text, at, until) => { tl.set("#clk2", { textContent: text }, at); tl.fromTo("#clk2", { opacity: 0, y: -30 }, { opacity: 1, y: 0, duration: .25, immediateRender: false }, at); tl.to("#clk2", { opacity: 0, duration: .15 }, until); R.sfx("tick", at, .8); };

  // 1. почта: Толян прибегает — Жора уже жмёт руку
  tl.to("#title", { opacity: 0, y: -50, duration: .25 }, 1.4);
  tl.from("#T", { x: -500, duration: .6, ease: "power2.out" }, 1.2); R.sfx("whoosh", 1.2, .4);
  slam("#p1", W("l0", "конкур"), "impact");
  tl.to("#score", { opacity: 1, duration: .2 }, st.z1 - .1); R.sfx("clack", st.z1 - .1, .7);
  R.punch(cam, st.z1 + .1, .05);
  // 2. шаурмичная
  swap("pochta", "shaurma", SW.shaurma); tl.to("#p1", { opacity: 0, duration: .1 }, SW.shaurma);
  [0, 1, 2].forEach(i => tl.fromTo("#ph" + i, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: .25, ease: "back.out(2)", immediateRender: false }, W("l1", "тр") + i * .12));
  slam("#s1", W("l1", "чат"), "pop");
  score("ЖОРА 3 : 0 ТОЛЯН", W("l1", "трет")); R.shake(cam, W("l1", "трет"), .4, .3);
  // 3. прачечная: фильтр
  swap("shaurma", "laundry", SW.laundry);
  clock("23:40", SW.laundry + .4, SW.sad);
  show("#flt", W("l2", "настро")); slam("#mid", W("l2", "спать"), "pop");
  R.punch(cam, st.t1 + .1, .05);
  // 4. СНТ, 5:47
  swap("laundry", "sad", SW.sad);
  clock("05:47", SW.sad + .4, SW.sad2);
  show("#bot2", W("l3", "уведом")); R.sfx("ping", W("l3", "секунд"), .8);
  slam("#ok1", W("l3", "чисто"), "pop");
  slam("#d1", W("l4", "68"), "clack");
  // 5. СНТ, 8:02: «Мерседес» Жоры подлетает в пыли
  swap("sad", "sad2", SW.sad2);
  clock("08:02", SW.sad2 + .3, st.l6 - .7);
  tl.from("#car3", { x: 700, duration: .7, ease: "power3.out" }, SW.sad2 + .2); R.sfx("whoosh", SW.sad2 + .2, .5);
  [0, 1, 2, 3].forEach(i => tl.fromTo("#pf" + i, { opacity: 0, scale: .4 }, { opacity: .9, scale: 1, duration: .3, immediateRender: false }, SW.sad2 + .6 + i * .06).to("#pf" + i, { opacity: 0, x: 120, duration: .8 }, SW.sad2 + 1.1 + i * .06));
  tl.from("#ZH3", { x: 300, opacity: 0, duration: .35, ease: "power2.out" }, SW.sad2 + .7);
  R.shake(cam, st.z3 + .1, .5, .3);
  slam("#z1", W("n2", "поздн"), "impact");
  score("ЖОРА 3 : 1 ТОЛЯН", W("l5", "втор"));
  // 6. под мостом: продажа
  swap("sad2", "most", SW.most);
  tl.to("#score", { opacity: 0, duration: .2 }, SW.most);
  tl.fromTo("#cash1", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: .3, ease: "back.out(2)", immediateRender: false }, W("l6", "98")); R.sfx("ping", W("l6", "98"), .5);
  slam("#m1", W("l7", "капитал"), "impact");
  // 7. мост: Жора приходит сам, крючок, финальная карточка
  swap("most", "most2", SW.most2);
  tl.from("#ZH4", { x: 420, duration: .6, ease: "power2.out" }, SW.most2 + .2);
  R.punch(cam, W("z4", "давай"), .06);
  tl.fromTo("#nx", { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: .4, ease: "back.out(1.6)", immediateRender: false }, st.end); R.sfx("impact", st.end + .05, .6);
  tl.fromTo("#cta2", { opacity: 0, y: 80, scale: .9 }, { opacity: 1, y: 0, scale: 1, duration: .4, ease: "back.out(1.6)", immediateRender: false }, W("end", "подпиш") - .2);
  ending(R, en.end + .3);
};


// ── ep35c «Ночь»: та же история и озвучка, другая «съёмка» ──
(() => {
  const C = {"t1": "5:47", "t2": "КТО БЫСТРЕЕ?", "c1": "#ffd23f", "c2": "#151515", "cam": "in", "music": {"style": "phonk", "bpm": 120}};
  const orig = window.build;
  window.build = R => {
    orig(R);
    const tl = R.tl;
    $("#title .a").textContent = C.t1; $("#title .a").style.cssText = `font-size:110px;background:${C.c1};color:${C.c2}`;
    const b = $("#title .b"); b.style.display = ""; b.textContent = C.t2; b.style.cssText = `font-size:60px;background:${C.c2};color:${C.c1}`;
    tl.set("#title", { opacity: 1, y: 0 }, 0).to("#title", { opacity: 0, y: -50, duration: .3 }, 1.2);
    const S = [["pochta", 0, st.l1 - .7, "55% 55%"], ["shaurma", st.l1 - .7, st.l2 - .7, "60% 55%"], ["laundry", st.l2 - .7, st.l3 - .7, "45% 55%"],
               ["sad", st.l3 - .7, st.z3 - .7, "50% 60%"], ["sad2", st.z3 - .7, st.l6 - .7, "55% 55%"], ["most", st.l6 - .7, st.z4 - .7, "50% 60%"],
               ["most2", st.z4 - .7, en.end + .3, "50% 45%"]];
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
