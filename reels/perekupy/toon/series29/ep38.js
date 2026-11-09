// МИНИ-СЕРИАЛ «ТОЛЯН: СО СТА ТЫСЯЧ», часть 6 «Первая машина за полмиллиона» (кредит как риск, владелец 09.11).
// Приёмы: ангел и чёрт на плечах, счётчик кредита «−240 ₽/день» поверх всех сцен, отрывной календарь + переписка, поворот-отсылка (покупатель — Валерьич из части 5).
// Функция бота: пометка «❗ кредит/залог» отсекает первую Камри. Фоны новые: balkon, stomat, mangal, pereezd. Новый герой — стоматолог Станислав.
$("#title .a").textContent = E.rubric; $("#title .b").textContent = E.subtitle; $("#tag span").textContent = "со ста тысяч · 6";
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
const CARD = (id, body, fs = 26) => `<div id="${id}" style="background:#1c1f26;border-radius:22px;padding:14px 18px;margin-top:10px;font-family:Onest;color:#fff;font-size:${fs}px;line-height:1.45">${body}</div>`;
const CAL = (id, day, l = 40, t = 1180) => `<div class="el" id="${id}" style="left:${l}px;top:${t}px;width:220px;z-index:15;background:#fff;border:6px solid #151515;border-radius:14px;box-shadow:0 10px 0 #151515;text-align:center;overflow:hidden"><div style="background:#ff3b30;color:#fff;font-family:Unbounded;font-weight:900;font-size:24px;padding:6px">ДЕНЬ</div><div class="cd" style="font-family:Unbounded;font-weight:900;font-size:96px;line-height:1.1;color:#151515">${day}</div></div>`;
const MINI = (p, l, t, halo) => `<div class="el" id="m_${p}" style="left:0;top:0;width:1080px;height:1920px;z-index:12;opacity:0">` + hero("tolyan", p, l, t, .3, 12) + (halo
  ? `<div class="el" style="left:${l + 30}px;top:${t - 4}px;width:66px;height:18px;border:6px solid #ffd23f;border-radius:50%;z-index:13;box-shadow:0 0 14px #ffd23f"></div>`
  : `<div class="el" style="left:${l + 26}px;top:${t + 2}px;width:0;height:0;border-left:12px solid transparent;border-right:12px solid transparent;border-bottom:30px solid #ff3b30;z-index:13"></div><div class="el" style="left:${l + 76}px;top:${t + 2}px;width:0;height:0;border-left:12px solid transparent;border-right:12px solid transparent;border-bottom:30px solid #ff3b30;z-index:13"></div>`) + `</div>`;
const ZHORA = { jacket: "#1d1d1f", pants: "#2b2f37", cap: "#c0392b", mustache: true, chain: true, hair: "#1d1d1f", item: "phone", look: "grin" };
const STAS = { coat: "#f4f6f8", pants: "#2b2f37", glasses: true, hair: "#3a2d22" };
const VALERICH = { coat: "#f2a0c0", pants: "#f2a0c0", hair: "#8a8a8a", mustache: true, item: "bag" };
const TOLS = ["t", "t2", "t3", "t4", "t5", "t6", "t7"];

// 1. балкон ночью: две Камри, первую отсекает «кредит/залог»
scene("bal", "balkon");
add("bal", hero("tolyan", "t", 600, 880, .8, 7)
  + PHONE("ph1", 30, 700, 560, `<div style="font-family:Onest;font-weight:700;font-size:24px;color:#8b93a3">ПЕРЕХВАТ · бот</div>`
    + CARD("c1", `<span id="c1t">Toyota Camry 2008 · 480 000 ₽</span><br><b style="color:#ff3b30">❗ кредит/залог</b>`)
    + CARD("c2", `<b style="color:#ff7a1a">🔥 −22% к рынку</b><br><b>Toyota Camry 2008 · 500 000 ₽</b><br>⏱ 1 с · ✅ без ограничений`))
  + stamp("p1", "ЧАСТЬ 6 · ПЕРВАЯ МАШИНА ЗА ПОЛМИЛЛИОНА", 60, 1600, "#ff2da6", "#fff", 32, -3) + stamp("x1", "МИМО", 380, 820, "#ff3b30", "#fff", 50, -8));
// 2. балкон: ангел и чёрт
scene("bal2", "balkon");
add("bal2", hero("tolyan", "t2", 330, 880, .8, 7) + MINI("ta", 290, 920, true) + MINI("td", 580, 920, false));
// 3. стоматология: Камри у Станислава
scene("stom", "stomat");
add("stom", CAR("car1", "camry/camry.png", 280, 1150, 680) + hero("perekup", "st", 620, 860, .8, 7, STAS) + hero("tolyan", "t3", -20, 900, .76, 7));
// 4. балкон: дни идут — календарь и переписка
scene("days", "balkon");
add("days", hero("tolyan", "t4", 580, 900, .76, 7) + CAL("cal1", 1)
  + PHONE("chat", 30, 640, 520, `<div style="font-family:Onest;font-weight:700;font-size:22px;color:#8b93a3">Сообщения · Toyota Camry</div>`
    + [["Ещё актуально?", 0], ["Да!", 1], ["А за 300 отдадите?", 0], ["Я подумаю 🤔", 0]].map(([m, me], i) => `<div class="msg" id="mg${i}" style="opacity:0;margin-top:10px;${me ? "margin-left:60px;background:#2e86de" : "margin-right:60px;background:#1c1f26"};border-radius:18px;padding:10px 14px;font-family:Onest;color:#fff;font-size:26px">${m}</div>`).join("")));
// 5. шашлычная у трассы: Жора подкалывает
scene("mang", "mangal");
add("mang", hero("perekup", "zh", 640, 860, .8, 7, ZHORA) + hero("tolyan", "t5", -20, 900, .76, 7) + CAL("cal2", 11));
// 6. переезд: покупатель — Валерьич
scene("pz", "pereezd");
add("pz", CAR("car2", "camry/camry_side.png", 250, 1220, 720) + hero("perekup", "vl", 620, 860, .8, 7, VALERICH) + hero("tolyan", "t6", -20, 900, .76, 7)
  + CASH("cash1", 400, 1440, 5) + CAL("cal3", 12));
// 7. переезд: кредит закрыт, мораль, крючок, финальная карточка
scene("pz2", "pereezd");
add("pz2", hero("tolyan", "t7", -20, 900, .76, 7)
  + PHONE("paid", 560, 640, 460, `<div style="font-family:Onest;color:#fff;font-size:34px;text-align:center;padding:18px 0"><div style="font-size:76px">✅</div><b>Кредит погашен</b><br><span style="color:#8b93a3;font-size:24px">день 12 · проценты 2 880 ₽</span></div>`)
  + stamp("m1", "КРЕДИТ — ЭТО ТАЙМЕР", 330, 1080, "#ff3b30", "#fff", 50, 3)
  + `<div class="el" id="nx" style="left:60px;right:60px;top:300px;z-index:20;background:#0d0e12;border:6px solid #fff;border-radius:30px;padding:22px 26px;color:#fff;font-family:Unbounded;font-weight:900;font-size:44px;line-height:1.25;text-align:center;opacity:0">ЧАСТЬ 7:<br><span style="color:#ffd23f">машина</span>-<span style="color:#ff3b30">двойник</span></div>
  <div class="ctab" id="cta2" style="top:1300px"><div class="cbig">Бот <span>«Перехват»</span><br>— ссылка в шапке</div><div class="csm">пометки «кредит/залог» · ниже рынка · ~1 с</div></div>`);

$(".stage").insertAdjacentHTML("beforeend", `<div id="cnt" style="opacity:0">💸 213 000 ₽</div><div id="clk2">23:48</div>
  <div id="debt" style="position:absolute;left:60px;top:400px;z-index:52;font-family:'JetBrains Mono';font-weight:800;font-size:34px;color:#fff;background:#3a0d0d;border:6px solid #ff3b30;border-radius:18px;padding:4px 18px;white-space:nowrap;box-shadow:0 0 22px rgba(255,59,48,.55), 0 8px 0 #000;opacity:0">🏦 −290 000 · −240 ₽/день <span id="dd"></span></div>`);
TOLS.forEach(p => { const s = document.getElementById(p + "-shades"); if (s) s.style.display = ""; });
["ta", "td"].forEach(p => { const s = document.getElementById(p + "-shades"); if (s) s.style.display = ""; });
$("#end h2").innerHTML = E.end;
const bub = (line, html, l, t, tx, fs) => { const b = bubble(line, html, l, t, tx); if (fs) b.style.fontSize = fs + "px"; return b; };
bub("t1", "Не хватает<br><em>двухсот девяноста…</em>", 300, 720, 196, 42);
bub("ta", "Не бери.<br><em>Это таймер.</em>", 40, 760, 300, 44);
bub("td", "Бери, брат!<br><em>Раз живём!</em>", 600, 760, 44, 44);
bub("s1", "Пятьсот — и она ваша.<br><em>Улыбайтесь, вам идёт.</em>", 420, 700, 368, 40);
bub("z1", "Ну что, студент,<br><em>банк уже звонил?</em>", 480, 700, 328, 42);
bub("v1", "Тридцать лет копил.<br><em>Наличкой можно?</em>", 540, 700, 248, 40);
bub("t2", "Отец…<br><em>вам — можно!</em>", 40, 760, 100, 40);

window.build = R => {
  const tl = R.tl, cam = R.camera($("#cam"), { hand: .6 });
  R.grain(.03);
  gsap.set(".scn", { opacity: 0 }); gsap.set("#sc_bal", { opacity: 1 });
  const { pop } = common(R, cam, { mood: () => "grin" });
  const talk = (lv, f) => lv > .28 && !(lv < .55 && f % 3 === 2);
  const SW = { bal2: st.t1 - .7, stom: st.s1 - .7, days: st.l2 - .7, mang: st.z1 - .7, pz: st.l3 - .7, pz2: st.end - .7 };
  const STEPS = [[0, 213000, 0], [st.s1 + .2, 3000, 1], [W("end", "капитал"), 350000, 0]];
  const fmt = v => Math.round(v).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  const SP = [["zh", "zhora"], ["st", "stas"], ["vl", "valerich"], ["ta", "angel"], ["td", "devil"]];
  R.hooks.push(t => { const f = Math.floor(t * 30), lt = (LIP.tolyan || [])[f] || 0;
    TOLS.forEach(p => { if (document.getElementById(p)) mouth(p, talk(lt, f) ? "talk" : (p === "t2" || p === "t4" || p === "t5" ? "o" : "grin")); });
    SP.forEach(([p, k]) => { if (document.getElementById(p)) mouth(p, talk((LIP[k] || [])[f] || 0, f) ? "talk" : (k === "zhora" ? "grin" : "flat")); });
    let v = 0, prev = 0, car = 0; for (const [at, to, c] of STEPS) { if (t < at) break; v = prev + (to - prev) * Math.min(1, (t - at) / .7); prev = to; car = c; }
    $("#cnt").textContent = `💸 ${fmt(v)} ₽${car ? " + 🚗" : ""}`; });
  tl.to("#cnt", { opacity: 1, duration: .3 }, 1.6); tl.to("#cnt", { opacity: 0, duration: .2 }, W("end", "седьм") - .2);
  STEPS.slice(1).forEach(([at]) => { tl.fromTo("#cnt", { scale: 1.35 }, { scale: 1, duration: .3, ease: "back.out(2)", immediateRender: false }, at); R.sfx("tick", at, .9); });
  const swap = (from, to, at) => {
    tl.set(`#sc_${to}`, { opacity: 1, x: 1080, filter: "blur(14px)" }, at)
      .to(`#sc_${from}`, { x: -1080, filter: "blur(14px)", duration: .35, ease: "power3.in" }, at)
      .to(`#sc_${to}`, { x: 0, filter: "blur(0px)", duration: .38, ease: "power3.out" }, at + .12)
      .set(`#sc_${from}`, { opacity: 0, x: 0, filter: "none" }, at + .5);
    R.sfx("whoosh", at, .6);
  };
  window.MUSIC = { style: "story", bpm: 100, end: R.dur - 1.2 };
  const ids = E.lines.map(l => l.id), SWT = Object.values(SW);
  for (const l of ["t1", "ta", "td", "s1", "z1", "v1", "t2"]) { const nx = ids[ids.indexOf(l) + 1]; const ns = SWT.filter(x => x > st[l]).sort((a, b) => a - b)[0] ?? 1e9;
    const until = l === "ta" ? Math.min(en.td + .6, ns - .05) : l === "v1" ? Math.min(en.t2 + .6, ns - .05) : Math.min(en[l] + .9, st[nx] - .1, ns - .05);   // ангел и Валерьич ждут ответа
    pop("#b_" + l, st[l] - .05, until); }
  const slam = (sel, at, sfx = "impact") => { tl.fromTo(sel, { opacity: 0, scale: 2 }, { opacity: 1, scale: 1, duration: .18, ease: "power4.out", immediateRender: false }, at); R.sfx(sfx, at + .02, .7); };
  const show = (sel, at) => { tl.fromTo(sel, { opacity: 0, scale: .7, y: 60 }, { opacity: 1, scale: 1, y: 0, duration: .35, ease: "back.out(1.8)", immediateRender: false }, at); R.sfx("ping", at - .03, 1); };
  const clock = (text, at, until) => { tl.set("#clk2", { textContent: text }, at); tl.fromTo("#clk2", { opacity: 0, y: -30 }, { opacity: 1, y: 0, duration: .25, immediateRender: false }, at); tl.to("#clk2", { opacity: 0, duration: .15 }, until); R.sfx("tick", at, .8); };
  const debt = (txt, at) => { tl.set("#dd", { textContent: txt }, at); tl.fromTo("#debt", { scale: 1.25 }, { scale: 1, duration: .3, ease: "back.out(2)", immediateRender: false }, at); R.sfx("tick", at, .9); };
  const calTo = (sel, day, at) => { tl.to(sel, { rotationX: 90, transformOrigin: "50% 0", duration: .15, ease: "power2.in" }, at).set(`${sel} .cd`, { textContent: day }, at + .15)
    .to(sel, { rotationX: 0, duration: .2, ease: "back.out(2)" }, at + .15); R.sfx("clack", at, .7); };

  // 1. балкон: две карточки, первую — мимо
  tl.to("#title", { opacity: 0, y: -50, duration: .25 }, 1.4);
  clock("23:48", .5, SW.bal2);
  show("#ph1", W("l0", "бот") - .1);
  tl.fromTo("#c2", { opacity: 0 }, { opacity: 1, duration: .01, immediateRender: false }, W("l0", "втор") - .1); tl.set("#c2", { opacity: 0 }, 0);
  tl.set("#c1t", { textDecoration: "line-through", color: "#8b93a3" }, W("l0", "мимо"));
  slam("#x1", W("l0", "мимо"), "impact");
  tl.fromTo("#c2", { scale: .85 }, { scale: 1, duration: .3, ease: "back.out(2)", immediateRender: false }, W("l0", "втор")); R.sfx("ping", W("l0", "втор"), .8);
  slam("#p1", W("l0", "чист") + .2, "pop");
  // 2. ангел и чёрт; кредит — и включается счётчик
  swap("bal", "bal2", SW.bal2); tl.to("#p1", { opacity: 0, duration: .1 }, SW.bal2);
  tl.fromTo("#m_ta", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: .3, ease: "back.out(2)", immediateRender: false }, st.ta - .2); R.sfx("ping", st.ta - .2, .6);
  tl.fromTo("#m_td", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: .3, ease: "back.out(2)", immediateRender: false }, st.td - .2); R.sfx("pop", st.td - .2, .6);
  tl.to(["#m_ta", "#m_td"], { opacity: 0, duration: .25 }, W("l1", "взял"));
  R.punch(cam, W("l1", "взял"), .06);
  tl.fromTo("#debt", { opacity: 0, x: -80 }, { opacity: 1, x: 0, duration: .35, ease: "back.out(2)", immediateRender: false }, W("l1", "счётч")); R.sfx("boom", W("l1", "счётч"), .4);
  // 3. стоматология
  swap("bal2", "stom", SW.stom);
  // 4. дни идут: календарь листается, покупатели пишут, проценты капают
  swap("stom", "days", SW.days);
  show("#chat", SW.days + .4);
  calTo("#cal1", 5, W("l2", "пят")); calTo("#cal1", 9, W("l2", "девят"));
  debt("· −1 200 ₽", W("l2", "пят")); debt("· −2 160 ₽", W("l2", "девят"));
  [0, 1, 2, 3].forEach(i => { const at = W("l2", "перв") + i * ((W("l2", "капа") - W("l2", "перв")) / 4); tl.fromTo("#mg" + i, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: .2, immediateRender: false }, at); R.sfx("pop", at, .4); });
  // 5. шашлычная: Жора подкалывает
  swap("days", "mang", SW.mang); debt("· −2 640 ₽", SW.mang + .4);
  R.shake(cam, en.z1 - .3, .4, .3);
  // 6. переезд: Валерьич с наличкой
  swap("mang", "pz", SW.pz); debt("· −2 880 ₽", SW.pz + .4);
  tl.fromTo("#cash1", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: .3, ease: "back.out(2)", immediateRender: false }, st.t2); R.sfx("ping", st.t2, .5);
  R.punch(cam, st.t2 + .1, .05);
  // 7. кредит закрыт, мораль, крючок, финальная карточка
  swap("pz", "pz2", SW.pz2);
  show("#paid", W("end", "кредит"));
  tl.set("#debt", { textContent: "✅ КРЕДИТ ЗАКРЫТ", background: "#0d3a1a", borderColor: "#4cd964" }, W("end", "закрыт")); R.sfx("ping", W("end", "закрыт"), .8);
  tl.to("#debt", { opacity: 0, duration: .2 }, W("end", "таймер") - .3);
  slam("#m1", W("end", "таймер"), "impact"); tl.to("#m1", { opacity: 0, duration: .15 }, W("end", "седьм") - .1);
  tl.fromTo("#nx", { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: .4, ease: "back.out(1.6)", immediateRender: false }, W("end", "седьм")); R.sfx("impact", W("end", "седьм") + .05, .6);
  tl.to("#paid", { opacity: 0, duration: .2 }, W("end", "седьм"));
  tl.fromTo("#cta2", { opacity: 0, y: 80, scale: .9 }, { opacity: 1, y: 0, scale: 1, duration: .4, ease: "back.out(1.6)", immediateRender: false }, W("end", "подпиш") - .2);
  ending(R, en.end + .3);
};
