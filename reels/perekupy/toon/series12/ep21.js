// «ЗАЛОГ» — Марк из 18-й серии продан Серёге, а он в залоге у банка: штрафстоянка, рынок, ночной город, подъезд (через глазок),
// банк, экран реестра, петля на рынке. Машина — рисунок владельца (kit/img/markii).
$("#title .a").textContent = E.rubric; $("#title .b").style.display = "none"; $("#tag span").textContent = "залог";
$("#title .a").style.cssText = "font-size:130px;background:#ff3b30;color:#fff";
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
const mark = (id, l, t, w, z = 4) => `<img class="pcar" id="${id}" src="../../kit/img/markii/markii.png" style="left:${l}px;top:${t}px;width:${w}px;z-index:${z}">`;
const person = (sc, kind, p, l, t, s = 1, z = 7) => add(sc, `<div class="c" id="${p.toUpperCase()}" style="left:${l}px;top:${t}px;z-index:${z};transform:scale(${s})">${CHARS[kind](p)}</div>`);
const stamp = (id, text, l, t, bg, fg = "#fff", fs = 60, rot = -4) => `<div class="stamp2" id="${id}" style="left:${l}px;top:${t}px;background:${bg};color:${fg};font-size:${fs}px;transform:rotate(${rot}deg)">${text}</div>`;
const reestr = id => `<div class="reestr" id="${id}"><div class="rs"><h5>Реестр уведомлений о залоге</h5><div class="vin">VIN: JZX100-0012345</div>
  <div class="load" id="${id}L">Поиск…</div><div class="found" id="${id}F">Найдено: 1 уведомление<br><small>Залогодержатель: банк «Надёжный»</small></div>
  <div class="tm">⏱ 1 минута · бесплатно</div></div></div>`;
const SER = ["s", "s2", "s3", "s4", "s5"], TOL = ["t", "t2"];

// 1. штрафстоянка ночью: Марк за сеткой, луч прожектора
scene("hook", "impound");
add("hook", mark("m1", 160, 1150, 760) + `<div class="el" id="beam1" style="left:0;top:0;width:1080px;height:1920px;z-index:6;pointer-events:none;
  background:radial-gradient(circle 260px at 50% 66%, rgba(255,246,214,.35), rgba(255,246,214,0) 70%)"></div>`);
person("hook", "seryoga", "s", 640, 900, .85, 6);
// 2. рынок: продажа
scene("sale", "market");
add("sale", mark("m2", 250, 1140, 640) + stamp("pts", "ПТС ОРИГИНАЛ ✓", 300, 1080, "#4cd964", "#151515", 44, 3)
  + stamp("owner", "ХОЗЯИН: БАНК 🏦", 330, 470, "#ff3b30", "#fff", 52, -3));
person("sale", "tolyan", "t", -30, 900, .9, 6); person("sale", "seryoga", "s2", 700, 900, .9, 6);
// 3. ночной город: три месяца счастья
scene("happy", "city");
add("happy", mark("m3", 120, 1140, 820) + stamp("joy", "ТРИ МЕСЯЦА СЧАСТЬЯ", 140, 470, "#ffd23f", "#151515", 50, -3)
  + Array.from({ length: 8 }, (_, i) => `<div class="streak" id="sk${i}" style="top:${1220 + (i * 53) % 240}px;width:${120 + (i * 37) % 160}px"></div>`).join(""));
// 4. подъезд: через глазок (рыбий глаз), стук
scene("door", "stairs");
add("door", `<div id="peep" class="peep"></div>` + `<div class="el" id="knock" style="left:300px;top:1000px;font-size:120px;z-index:9;opacity:0">👊</div>`
  + `<div class="el" id="paper" style="left:120px;top:1120px;width:300px;height:200px;z-index:8;background:#fff;border:6px solid #151515;transform:rotate(-8deg);opacity:0;
    font-family:Unbounded;font-weight:900;font-size:26px;padding:20px;box-sizing:border-box">ПОСТАНОВЛЕНИЕ<br><span style="color:#ff3b30">ИЗЪЯТИЕ ТС</span></div>`);
person("door", "seryoga", "s3", 620, 900, .9, 6);
// 5. банк: звёздочка на плакате растёт
scene("bank", "bank");
add("bank", `<div class="el" id="star" style="left:1010px;top:380px;font-family:Unbounded;font-weight:900;font-size:60px;color:#151515;z-index:9">*</div>`
  + `<div class="el" id="starnote" style="left:80px;top:1500px;right:80px;z-index:9;opacity:0;font-family:Onest;font-size:30px;color:#151515;background:#fff;border:5px solid #151515;border-radius:16px;padding:14px 20px">
    * залог переходит к новому владельцу вместе с машиной (ст. 353 ГК РФ)</div>` + stamp("cat", "ЗАЛОГ = КОТ 🐈", 560, 1160, "#151515", "#ffd23f", 50, 4));
person("bank", "seryoga", "s4", -30, 900, .9, 6);
// 6. экран реестра
scene("reg", "bank");
add("reg", `<div style="position:absolute;inset:0;backdrop-filter:blur(10px);background:rgba(0,0,0,.45);z-index:4"></div>` + reestr("r1"));
// 7. петля: рынок, Серёга с телефоном
scene("loop", "market");
add("loop", reestr("r2").replace('class="reestr"', 'class="reestr mini"'));
person("loop", "tolyan", "t2", -30, 900, .9, 6); person("loop", "seryoga", "s5", 700, 900, .9, 6);
// 8. мораль
scene("moral", "bank");
add("moral", `<div class="card" id="moralCard" style="top:380px;z-index:20"><h3>ДО ПОКУПКИ</h3>
  <div class="li" id="mo0">🏦 Реестр залогов — по VIN, бесплатно</div><div class="li" id="mo1">🚓 Ограничения и розыск — сайт ГИБДД</div>
  <div class="li" id="mo2">📄 ПТС оригинал ≠ «без залога»</div><div class="rule" id="mo3">🔔 Свежие объявления — бот «Перехват»</div></div>`);

TOL.forEach(p => { const s = document.getElementById(p + "-shades"); if (s) s.style.display = ""; });
$("#end h2").innerHTML = E.end;
bubble("t1", "Брат, ПТС оригинал!<br><em>Один хозяин!</em>", 40, 730, 140);
bubble("p1", "Сергей Сергеевич? Машина<br>в залоге у банка.<br><em>Ключи, пожалуйста.</em>", 40, 680, 420);
bubble("s1", "Я же её<br><em>купил!</em>", 640, 700, 200);
bubble("p2", "Купили.<br><em>Вместе с залогом.</em>", 40, 700, 420);
bubble("b1", "Залог переходит вместе<br>с машиной. <em>Ничего личного.</em>", 300, 700, 300);
bubble("t2", "Брат,<br><em>залогов нет!</em>", 40, 700, 140);
bubble("t3", "Ну… один.<br><em>Маленький.</em>", 40, 700, 140);

window.build = R => {
  const tl = R.tl, cam = R.camera($("#cam"), { hand: .6 });
  R.grain(.03);
  gsap.set(".scn", { opacity: 0 }); gsap.set("#sc_hook", { opacity: 1 });
  const { pop } = common(R, cam, { mood: (k, t) => k === "seryoga" ? (t > st.p1 ? "o" : "grin") : "grin" });
  R.hooks.push(t => { const f = Math.floor(t * 30), ls = (LIP.seryoga || [])[f] || 0, lt = (LIP.tolyan || [])[f] || 0;
    const talk = lv => lv > .28 && !(lv < .55 && f % 3 === 2);
    SER.forEach(p => { if (p !== "s" && document.getElementById(p)) mouth(p, talk(ls) ? "talk" : t > st.p1 ? "o" : "grin"); });
    TOL.forEach(p => { if (p !== "t" && document.getElementById(p)) mouth(p, talk(lt) ? "talk" : t > st.t3 - .2 ? "nerv" : "grin"); });
    for (let i = 0; i < 8; i++) { const d = document.getElementById("sk" + i); if (d) d.style.left = `${1100 - ((t * (900 + i * 120) + i * 300) % 1500)}px`; } });
  const swap = (from, to, at, kind = "swipe") => {
    if (kind === "cut") { tl.set(`#sc_${from}`, { opacity: 0 }, at).set(`#sc_${to}`, { opacity: 1, x: 0, filter: "none" }, at); R.sfx("hit", at, .4); return; }
    tl.set(`#sc_${to}`, { opacity: 1, x: 1080, filter: "blur(14px)" }, at)
      .to(`#sc_${from}`, { x: -1080, filter: "blur(14px)", duration: .35, ease: "power3.in" }, at)
      .to(`#sc_${to}`, { x: 0, filter: "blur(0px)", duration: .38, ease: "power3.out" }, at + .12)
      .set(`#sc_${from}`, { opacity: 0, x: 0, filter: "none" }, at + .5);
    R.sfx("whoosh", at, .6);
  };
  window.MUSIC = { style: "bed", bpm: 94, end: R.dur - 1.2, mute: [[W("l2", "почти") - .1, st.p1 + .3]] };
  for (const l of ["t1", "p1", "s1", "p2", "b1", "t2", "t3"]) { const nx = E.lines[E.lines.findIndex(x => x.id === l) + 1]; pop("#b_" + l, st[l] - .05, Math.min(en[l] + .9, st[nx.id] - .1)); }
  const slam = (sel, at, sfx = "impact") => { tl.fromTo(sel, { opacity: 0, scale: 2 }, { opacity: 1, scale: 1, duration: .18, ease: "power4.out", immediateRender: false }, at); R.sfx(sfx, at + .02, .7); };
  const search = (id, at) => { tl.fromTo(`#${id}L`, { opacity: 0 }, { opacity: 1, duration: .1, repeat: 3, yoyo: true, immediateRender: false }, at)
    .set(`#${id}L`, { opacity: 0 }, at + .7).fromTo(`#${id}F`, { opacity: 0, scale: 1.4 }, { opacity: 1, scale: 1, duration: .2, ease: "power4.out", immediateRender: false }, at + .75);
    R.sfx("tick", at, .5); R.sfx("tick", at + .25, .5); R.sfx("impact", at + .78, .8); };

  // 1. штрафстоянка: луч прожектора гуляет, на «банк» — удар
  tl.fromTo("#beam1", { x: -260 }, { x: 160, duration: st.t1 - .6, ease: "sine.inOut", immediateRender: false }, 0);
  tl.to("#title", { opacity: 0, y: -50, duration: .25 }, W("h", "через") - .1);
  R.punch(cam, W("h", "банк"), .08); R.sfx("boom", W("h", "банк"), .7);
  // 2. продажа
  swap("hook", "sale", st.t1 - .7);
  slam("#pts", W("t1", "птс"), "pop");
  slam("#owner", W("l1", "банк"), "impact");
  // 3. ночной город: машина покачивается, на «почти» — стоп
  swap("sale", "happy", st.l2 - .7);
  R.hooks.push(t => { const m = document.getElementById("m3"); if (m && t < W("l2", "почти")) m.style.transform = `translateY(${Math.abs(Math.sin(t * 9)) * -5}px)`; });
  slam("#joy", st.l2 + .1, "pop");
  // 4. подъезд: стук, глазок
  swap("happy", "door", st.p1 - 1.1, "cut");
  [0, .25, .5].forEach(d => { R.sfx("tap", st.p1 - 1 + d, 1); R.shake(cam, st.p1 - 1 + d, .5, .15); });
  tl.fromTo("#knock", { opacity: 1, scale: 1.3 }, { opacity: 0, scale: 1, duration: .8, immediateRender: false }, st.p1 - 1);
  tl.set("#peep", { opacity: 1 }, st.p1 - 1.1)
    .to("#peep", { opacity: 0, duration: .3 }, st.p1 + .3);
  tl.fromTo("#paper", { opacity: 0, y: 200 }, { opacity: 1, y: 0, duration: .35, ease: "back.out(1.6)", immediateRender: false }, W("p1", "залог"));
  // 5. банк: звёздочка растёт, сноска
  swap("door", "bank", st.b1 - .7);
  tl.fromTo("#star", { scale: 1 }, { scale: 6, x: -480, y: 300, duration: 1, ease: "power2.in", immediateRender: false }, W("b1", "ничего"))
    .to("#star", { opacity: 0, duration: .2 }, W("b1", "ничего") + 1);
  tl.fromTo("#starnote", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: .3, immediateRender: false }, W("b1", "ничего") + .9);
  slam("#cat", W("l3", "кот"), "pop");
  // 6. реестр: поиск, «найдено»
  swap("bank", "reg", st.l4 - .7);
  tl.fromTo("#r1", { y: 600 }, { y: 0, duration: .5, ease: "expo.out", immediateRender: false }, st.l4 - .5);
  search("r1", W("l4", "минуту"));
  // 7. петля
  swap("reg", "loop", st.l5 - .7);
  tl.fromTo("#r2", { opacity: 0, y: 200 }, { opacity: 1, y: 0, duration: .35, ease: "back.out(1.4)", immediateRender: false }, en.t2 + .1);
  search("r2", en.t2 + .3);
  tl.to("#t2-sweat", { opacity: 1, duration: .2 }, st.t3 - .3);
  // 8. мораль
  swap("loop", "moral", st.rule - .7);
  tl.fromTo("#moralCard", { opacity: 0, y: 160 }, { opacity: 1, y: 0, duration: .4, ease: "expo.out", immediateRender: false }, st.rule - .4);
  [W("rule", "реестр"), W("rule", "огранич"), W("rule", "оригинал"), W("rule", "свеж") - .2].forEach((at, i) => { tl.fromTo(`#mo${i}`, { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: .22, immediateRender: false }, at); R.sfx("pop", at, .5); });
  ending(R, st.end - .15);
};
