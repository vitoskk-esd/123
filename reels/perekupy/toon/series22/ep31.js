// «СХЕМЫ · ПРОДАЮ САМ» — перекуп под видом собственника. Структура «на переходы» (как ep30): бот с первой секунды, бот в сюжете (опоздал → перекуп;
// назавтра успел первым), призыв на ~40% ролика, в финале одна плашка «Бот «Перехват» — ссылка в шапке профиля» (без призывов в комментарии).
// 8 сцен: спальня Серёги 07:00, дача Гали 07:25, улица 12:00 («продаю сам»), призыв, у метро (показ), документы, дача назавтра, финал.
$("#title .a").textContent = E.rubric; $("#title .b").textContent = E.subtitle; $("#tag span").textContent = "продаю сам";
$("#title .a").style.cssText = "font-size:90px;background:#ffd23f;color:#151515"; $("#title .b").style.cssText = "font-size:84px;background:#151515;color:#fff";
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
const CAR = (id, l, t, w, z = 3) => `<img class="pcar" id="${id}" src="../../kit/img/hyundai/hyundai.png" style="left:${l}px;top:${t}px;width:${w}px;z-index:${z}">`;
const BOT = (id, time, car, price, delta, ago, l, t) => `<div class="botcard" id="${id}" style="left:${l}px;top:${t}px;transform-origin:0 0"><div class="bh">ПЕРЕХВАТ · бот · ${time}</div><div class="bb"><b style="color:#ff7a1a">${delta}</b><br><b>${car} · ${price}</b><br>📍 твой город<br>⏱ ${ago}</div></div>`;
const FAKE = { jacket: "#1d1d1f", pants: "#232c47", cap: "#6b5a3a", mustache: true, hair: "#3a2d22", shades: true };
const TOLS = ["t2", "t3", "t4"], SERS = ["s0", "s2"];

// 1. спальня Серёги, 07:00: карточка бота
scene("room", "room");
add("room", BOT("bot1", "07:00", "Hyundai Elantra 2017", "690 000 ₽", "🔥 −14% к рынку · хозяйка", "1 с после публикации", 440, 1000) + hero("seryoga", "s0", 0, 880, .9, 7));
// 2. дача Гали, 07:25: Толян уже тут
scene("dacha", "dacha");
add("dacha", CAR("car1", 330, 1210, 700) + hero("tolyan", "t", -20, 880, .82, 7) + hero("galya", "g", 800, 900, .74, 7)
  + stamp("d1", "690 000 ₽ · НАЛИЧКОЙ", 60, 1500, "#4cd964", "#151515", 40, -3) + stamp("d2", "20 МИНУТ ⏱", 360, 560, "#151515", "#fff", 52, 3));
// 3. улица, 12:00: «продаю сам»
scene("street", "street");
add("street", CAR("car2", 300, 1220, 700) + hero("perekup", "t2", 0, 880, .82, 7, FAKE)
  + `<div class="adcard" id="ad" style="left:400px;top:760px"><div class="t">Hyundai Elantra 2017</div><div class="p">820 000 ₽</div><div class="o">✅ Продаю сам · один владелец</div><div class="s">не бита, не крашена, срочно</div></div>`
  + stamp("u1", "+130 000 ₽", 60, 1500, "#ff3b30", "#fff", 54, -3) + stamp("u2", "УСЫ НАКЛАДНЫЕ 🥸", 420, 1100, "#ffd23f", "#151515", 40, 3));
// 4. призыв в середине
scene("cta", "street");
add("cta", `<div class="el" style="inset:0;background:rgba(10,12,16,.55);z-index:2"></div><div class="ctab" id="cta1" style="top:600px"><div class="cbig">Хозяйка выложила в 07:00.<br>В 07:20 — <span>уже перекуп.</span></div><div class="csm">🔔 Свежие объявления — через секунду после публикации · бот «Перехват»</div></div>`
  + BOT("bot2", "07:00", "Hyundai Elantra 2017", "690 000 ₽", "🔥 −14% к рынку · хозяйка", "1 с после публикации", 240, 1080));
// 5. у метро: показ
scene("metro", "metro");
add("metro", CAR("car3", 280, 1180, 660) + hero("perekup", "t3", -20, 880, .82, 7, FAKE) + hero("seryoga", "s", 800, 900, .74, 7)
  + stamp("m1", "«ЖЕНА МАМЫ» 🤨", 300, 1520, "#ff3b30", "#fff", 48, -2));
// 6. документы
scene("docs", "desk");
add("docs", `<div class="doc" id="doc1" style="left:70px;top:620px;transform:rotate(-3deg)"><h4>ПТС</h4>Собственник:<br><span class="hl" id="h1"><b style="color:#c0392b">ПЕТРОВА Г. П.</b></span><br>с 2017 г.</div>
  <div class="doc" id="doc2" style="left:560px;top:680px;transform:rotate(3deg)"><h4>ДОГОВОР</h4>Продавец: Петрова Г. П.<br>подпись: <span class="hl" id="h2"><b style="color:#1d4fb8">✍ Петрова</b></span><br>Покупатель:<br><span class="hl" id="h3"><b style="color:#c0392b">__________</b></span></div>`
  + stamp("k1", "НЕ НА НЁМ", 90, 1080, "#151515", "#fff", 44, -3) + stamp("k2", "ПУСТОЙ ДОГОВОР — ВПИШУТ ТЕБЯ", 80, 1300, "#ff3b30", "#fff", 40, -2));
// 7. назавтра, 07:00: Серёга первый
scene("dacha2", "dacha");
add("dacha2", CAR("car4", 330, 1210, 700) + hero("seryoga", "s2", -10, 900, .76, 7) + hero("galya", "g2", 560, 900, .74, 7) + hero("tolyan", "t4", 1100, 900, .7, 6)
  + BOT("bot3", "07:00", "Lada Granta 2019", "520 000 ₽", "✅ хозяйка · по рынку", "1 с после публикации", 30, 520) + stamp("n1", "ПЕРВЫЙ ✅", 60, 1500, "#4cd964", "#151515", 50, -3));
// 8. финал
scene("moral", "metro");
add("moral", `<div class="el" style="inset:0;background:rgba(10,12,16,.45);z-index:2"></div><div class="card" id="moralCard" style="top:330px;z-index:20"><h3>ПРОДАЁТ ЛИ ХОЗЯИН</h3>
  <div class="li" id="mo0">🪪 Имя в ПТС = паспорт продавца</div><div class="li" id="mo1">👫 «За жену» — встреча с женой или доверенность</div>
  <div class="li" id="mo2">✍ Договор уже подписан прошлым — перекуп</div></div>
  <div class="ctab" id="cta2" style="top:1080px"><div class="cbig">Бот <span>«Перехват»</span><br>— ссылка в шапке профиля</div><div class="csm">объявления по твоему городу через секунду после публикации — успей к хозяину первым</div></div>`);

$("#over").insertAdjacentHTML("beforeend", `<div id="tmr">07:00</div>`);
["t", "t4"].forEach(p => { const s = document.getElementById(p + "-shades"); if (s) s.style.display = ""; });
$("#end h2").innerHTML = E.end;
const bub = (line, html, l, t, tx, fs) => { const b = bubble(line, html, l, t, tx); if (fs) b.style.fontSize = fs + "px"; return b; };
bub("s1", "Потом посмотрю…", 40, 770, 150, 46);
bub("t1", "Мать, беру не глядя!<br><em>Вот наличка!</em>", 40, 760, 110, 44);
bub("g1", "Сынок, так быстро?<br><em>Я ж только выложила!</em>", 330, 790, 620, 40);
bub("s2", "Вы собственник?", 560, 790, 390, 46);
bub("t2", "Конечно, брат!<br><em>Сам езжу, сам продаю!</em>", 40, 760, 110, 44);
bub("s3", "А в ПТС почему<br><em>Петрова Галина?</em>", 480, 770, 470, 44);
bub("t3", "Это… жена. Мамина.<br><em>Жена мамы.</em>", 40, 760, 110, 44);
bub("g2", "Сынок, опять ты первый?<br><em>Паспорт, ПТС — всё на меня.</em>", 300, 770, 420, 40);
bub("t4", "Брат…<br><em>опять ты?</em>", 600, 780, 360, 46);

window.build = R => {
  const tl = R.tl, cam = R.camera($("#cam"), { hand: .6 });
  R.grain(.03);
  gsap.set(".scn", { opacity: 0 }); gsap.set("#sc_room", { opacity: 1 });
  const { pop } = common(R, cam, { mood: k => k === "galya" ? "grin" : k === "seryoga" ? "o" : "grin" });
  const talk = (lv, f) => lv > .28 && !(lv < .55 && f % 3 === 2);
  const SW = { dacha: st.t1 - .7, street: st.l2 - .7, cta: st.l3 - .7, metro: st.s2 - .7, docs: st.l4 - .7, dacha2: W("l5", "утром") - .4, moral: st.rule - .7 };
  const TIMES = [[0, "07:00"], [SW.dacha + .2, "07:25"], [SW.street + .2, "12:00"], [SW.cta, ""], [SW.metro + .2, "13:30"], [SW.docs, ""], [SW.dacha2 + .2, "07:00 · назавтра"], [SW.moral, ""]];
  R.hooks.push(t => { const f = Math.floor(t * 30), lt = (LIP.tolyan || [])[f] || 0, ls = (LIP.seryoga || [])[f] || 0, lg = (LIP.galya || [])[f] || 0;
    TOLS.forEach(p => { if (document.getElementById(p)) mouth(p, talk(lt, f) ? "talk" : "grin"); });
    SERS.forEach(p => { if (document.getElementById(p)) mouth(p, talk(ls, f) ? "talk" : "o"); });
    if (document.getElementById("g2")) mouth("g2", talk(lg, f) ? "talk" : "grin");
    const tx = TIMES.filter(([a]) => t >= a).pop()[1]; $("#tmr").textContent = "🕖 " + tx; $("#tmr").style.opacity = tx && t > 1.4 && t < st.end - .2 ? 1 : 0; });
  const swap = (from, to, at) => {
    tl.set(`#sc_${to}`, { opacity: 1, x: 1080, filter: "blur(14px)" }, at)
      .to(`#sc_${from}`, { x: -1080, filter: "blur(14px)", duration: .35, ease: "power3.in" }, at)
      .to(`#sc_${to}`, { x: 0, filter: "blur(0px)", duration: .38, ease: "power3.out" }, at + .12)
      .set(`#sc_${from}`, { opacity: 0, x: 0, filter: "none" }, at + .5);
    R.sfx("whoosh", at, .6);
  };
  window.MUSIC = { style: "bed", bpm: 98, end: R.dur - 1.2 };
  const ids = E.lines.map(l => l.id), SWT = Object.values(SW);
  for (const l of ["s1", "t1", "g1", "s2", "t2", "s3", "t3", "g2", "t4"]) { const nx = ids[ids.indexOf(l) + 1]; const ns = SWT.filter(x => x > st[l]).sort((a, b) => a - b)[0] ?? 1e9;
    pop("#b_" + l, st[l] - .05, Math.min(en[l] + .9, st[nx] - .1, ns - .05)); }
  const slam = (sel, at, sfx = "impact") => { tl.fromTo(sel, { opacity: 0, scale: 2 }, { opacity: 1, scale: 1, duration: .18, ease: "power4.out", immediateRender: false }, at); R.sfx(sfx, at + .02, .7); };
  const popIn = (sel, at, sc = 1) => { tl.fromTo(sel, { opacity: 0, scale: .6 * sc, y: 60 }, { opacity: 1, scale: sc, y: 0, duration: .35, ease: "back.out(1.8)", immediateRender: false }, at); R.sfx("ping", at - .03, 1); };
  const hl = (sel, at) => { tl.fromTo(sel, { backgroundSize: "0% 100%" }, { backgroundSize: "100% 100%", duration: .35, ease: "power2.out", immediateRender: false }, at); R.sfx("swish", at, .4); };

  // 1. 07:00 — бот с первой секунды, Серёга спит
  gsap.set("#bot1", { opacity: 1 }); R.sfx("ping", .05, 1);
  tl.fromTo("#bot1", { scale: .85 }, { scale: 1, duration: .3, ease: "back.out(2)", immediateRender: false }, 0);
  tl.to("#title", { opacity: 0, y: -50, duration: .25 }, 1.3);
  tl.to("#S0", { rotation: -4, duration: .4, yoyo: true, repeat: 1, transformOrigin: "50% 100%" }, st.s1 + .2);
  R.punch(cam, W("l0", "купил"), .05);
  // 2. дача: Толян уже тут
  swap("room", "dacha", SW.dacha);
  tl.fromTo("#T", { x: -400 }, { x: 0, duration: .5, ease: "back.out(1.4)", immediateRender: false }, SW.dacha + .2);
  slam("#d1", st.t1 + .6, "pop"); slam("#d2", W("l1", "20"), "pop");
  R.punch(cam, W("l1", "последн"), .05);
  // 3. 12:00: усы, объявление
  swap("dacha", "street", SW.street);
  tl.fromTo("#ad", { opacity: 0, y: -60 }, { opacity: 1, y: 0, duration: .35, ease: "back.out(1.6)", immediateRender: false }, W("l2", "обед")); R.sfx("pop", W("l2", "обед"), .6);
  slam("#u1", W("l2", "плюс"), "impact"); slam("#u2", W("l2", "усы"), "pop");
  R.punch(cam, W("l2", "владел"), .06);
  // 4. призыв в середине
  swap("street", "cta", SW.cta);
  tl.fromTo("#cta1", { opacity: 0, y: 80, scale: .9 }, { opacity: 1, y: 0, scale: 1, duration: .4, ease: "back.out(1.6)", immediateRender: false }, SW.cta + .3);
  popIn("#bot2", W("l3", "перв"));
  // 5. у метро
  swap("cta", "metro", SW.metro);
  R.punch(cam, W("s3", "петров"), .05); R.sfx("hit", W("s3", "петров"), .5);
  slam("#m1", W("t3", "жена", 1), "impact");
  // 6. документы
  swap("metro", "docs", SW.docs);
  tl.fromTo("#doc1", { opacity: 0, y: 200, rotation: -10 }, { opacity: 1, y: 0, rotation: -3, duration: .45, ease: "back.out(1.4)", immediateRender: false }, SW.docs + .3);
  tl.fromTo("#doc2", { opacity: 0, y: 200, rotation: 10 }, { opacity: 1, y: 0, rotation: 3, duration: .45, ease: "back.out(1.4)", immediateRender: false }, SW.docs + .5);
  hl("#h1", W("l4", "птс")); slam("#k1", W("l4", "птс") + .3, "pop");
  hl("#h2", W("l4", "подпис")); hl("#h3", W("l4", "пуст")); slam("#k2", W("l4", "впис"), "impact");
  // 7. назавтра: бот → Серёга первый, Толян опоздал
  swap("docs", "dacha2", SW.dacha2);
  popIn("#bot3", W("l5", "дзынь") - .1, .8);
  slam("#n1", st.g2 - .2, "pop");
  tl.fromTo("#T4", { x: 0 }, { x: -280, duration: .7, ease: "power2.out", immediateRender: false }, en.g2 - .2);
  // 8. финал: один призыв
  swap("dacha2", "moral", SW.moral);
  tl.fromTo("#moralCard", { opacity: 0, y: 160 }, { opacity: 1, y: 0, duration: .4, ease: "expo.out", immediateRender: false }, st.rule - .4);
  [st.rule + .1, W("rule", "жену"), W("rule", "договор")].forEach((at, i) => { tl.fromTo(`#mo${i}`, { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: .22, immediateRender: false }, at); R.sfx("pop", at, .5); });
  tl.fromTo("#cta2", { opacity: 0, y: 80, scale: .9 }, { opacity: 1, y: 0, scale: 1, duration: .4, ease: "back.out(1.6)", immediateRender: false }, W("rule", "успет")); R.sfx("impact", W("rule", "успет"), .6);
  tl.fromTo("#cta2", { scale: 1 }, { scale: 1.05, duration: .25, yoyo: true, repeat: 3, immediateRender: false }, W("rule", "перехват"));
  ending(R, st.end - .15);
};
