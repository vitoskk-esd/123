// МИНИ-СЕРИАЛ «ТОЛЯН: СО СТА ТЫСЯЧ», часть 1 — как Толян со ста тысячами решил стать перекупом (владелец 07.11). Бот — рабочий инструмент
// (фильтр «до 100 000 · свой город», карточка −25% к рынку). Сквозной счётчик капитала в углу; в конце — крючок на часть 2. Машина — ВАЗ-2105 владельца.
$("#title .a").textContent = E.rubric; $("#title .b").textContent = E.subtitle; $("#tag span").textContent = "со ста тысяч · 1";
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
const V05 = (id, l, t, w, z = 3) => `<img class="pcar" id="${id}" src="../../kit/img/vaz2105/vaz2105_34.png" style="left:${l}px;top:${t}px;width:${w}px;z-index:${z}">`;
const DED = { jacket: "#6b5a3a", pants: "#3b3f46", hair: "#d9d9d9", mustache: true, glasses: true };
const CASH = (id, l, t, n = 5) => `<div class="el" id="${id}" style="left:${l}px;top:${t}px;width:300px;height:160px;z-index:8">` + Array.from({ length: n }, (_, i) => `<div style="position:absolute;left:${i * 26}px;top:${60 - i * 10}px;width:150px;height:76px;background:#8fd17a;border:5px solid #151515;border-radius:8px;transform:rotate(${-10 + i * 5}deg)"></div>`).join("") + `</div>`;
const TOLS = ["t2", "t3", "t4", "t5"];

// 1. хук: комната, сто тысяч и мечта
scene("room", "room");
add("room", hero("tolyan", "t", 40, 880, .88, 7) + CASH("cash1", 600, 1260)
  + `<div class="el" id="dream" style="left:470px;top:870px;width:570px;height:330px;z-index:8;opacity:0">
      <div style="position:absolute;left:0;top:0;width:570px;height:300px;background:#fff;border:7px solid #151515;border-radius:50%;box-shadow:0 10px 0 #151515"></div>
      <div style="position:absolute;left:-60px;top:280px;width:40px;height:40px;background:#fff;border:6px solid #151515;border-radius:50%"></div>
      <img src="../../kit/img/gelik/gelik_34.png" style="position:absolute;left:130px;top:25px;width:290px"><div style="position:absolute;left:120px;top:225px;font-family:Unbounded;font-weight:900;font-size:36px;color:#151515;white-space:nowrap">1 000 000 ₽ 🤑</div></div>`
  + stamp("pt1", "ЧАСТЬ 1 · СТО ТЫСЯЧ", 420, 1290, "#ffd23f", "#151515", 36, 3));
// 2. 03:00: фильтр бота и карточка
scene("phone", "room");
add("phone", hero("tolyan", "t2", -20, 880, .84, 7)
  + `<div class="botcard" id="bot1" style="left:400px;top:700px;width:620px"><div class="bh">ПЕРЕХВАТ · фильтр · 03:00</div><div style="font-family:Onest;color:#fff;font-size:28px;line-height:1.5;margin:0 0 12px">💰 до 100 000 ₽ · 📍 твой город</div>
     <div class="bb" id="bot1c" style="opacity:0"><b style="color:#ff7a1a">🔥 −25% к рынку · хозяин</b><br><b>ВАЗ-2105 · 85 000 ₽</b><br>⏱ 1 с после публикации</div></div>`);
// 3. гараж деда Петровича
scene("garage", "garages");
add("garage", V05("car1", 300, 1210, 680) + hero("perekup", "d", -10, 860, .86, 7, DED) + hero("tolyan", "t3", 800, 880, .76, 7)
  + stamp("g1", "−85 000 ₽", 330, 1080, "#ff3b30", "#fff", 50, 3) + stamp("g2", "ПЕРВАЯ МАШИНА 🚗", 200, 560, "#ffd23f", "#151515", 50, -3));
// 4. мойка: честная предпродажка
scene("wash", "carwash");
add("wash", V05("car2", 260, 1220, 680) + hero("tolyan", "t4", -20, 880, .8, 7)
  + Array.from({ length: 12 }, (_, i) => `<div class="foam" id="fm${i}" style="left:${300 + (i * 61) % 600}px;top:${1180 + (i * 37) % 260}px;width:${60 + (i * 13) % 50}px;height:${60 + (i * 13) % 50}px"></div>`).join("")
  + stamp("w1", "АККУМУЛЯТОР −6 000", 430, 960, "#151515", "#fff", 36, 3) + stamp("w2", "МОЙКА −1 000", 520, 1060, "#151515", "#fff", 36, -2) + stamp("w3", "СКРУТКА — НЕТ ❌", 60, 1560, "#4cd964", "#151515", 40, -3));
// 5. продажа Серёге
scene("sale", "street");
add("sale", V05("car3", 300, 1220, 660) + hero("tolyan", "t5", -20, 880, .8, 7) + hero("seryoga", "s", 800, 900, .74, 7) + CASH("cash2", 420, 1520, 4).replace('z-index:8">', 'z-index:8;opacity:0">')
  + stamp("u1", "+28 000 ₽ ЗА НЕДЕЛЮ", 200, 560, "#4cd964", "#151515", 50, -3));
// 6. крючок на часть 2 + финальная карточка
scene("next", "night");
add("next", `<div class="el" style="inset:0;background:rgba(10,12,16,.45);z-index:2"></div><div class="el" id="nx" style="left:60px;right:60px;top:560px;z-index:20;background:#0d0e12;border:6px solid #fff;border-radius:30px;padding:26px 28px;color:#fff;font-family:Unbounded;font-weight:900;font-size:44px;line-height:1.25;text-align:center;opacity:0">ЧАСТЬ 2:<br><span style="color:#ff3b30">Приора и первая ошибка</span></div>
  <div class="ctab" id="cta2" style="top:1000px"><div class="cbig">Бот <span>«Перехват»</span><br>— ссылка в шапке</div><div class="csm">фильтр по бюджету и городу · ниже рынка — видно сразу</div></div>`);

$(".stage").insertAdjacentHTML("beforeend", `<div id="cnt" style="opacity:0">💸 100 000 ₽</div>`);
["t"].concat(TOLS).forEach(p => { const s = document.getElementById(p + "-shades"); if (s) s.style.display = ""; });
$("#end h2").innerHTML = E.end;
const bub = (line, html, l, t, tx, fs) => { const b = bubble(line, html, l, t, tx); if (fs) b.style.fontSize = fs + "px"; return b; };
bub("t1", "Всё, брат. Сто тысяч есть —<br><em>становлюсь перекупом!</em>", 40, 700, 180, 42);
bub("t2", "Брат,<br><em>беру!</em>", 60, 720, 100, 50);
bub("d1", "Сынок, только аккумулятор сел.<br><em>А так — зверь.</em>", 60, 720, 110, 40);
bub("s1", "Сколько?", 680, 780, 260, 48);
bub("t3", "Сто двадцать, брат.<br><em>Аккумулятор новый, всё честно.</em>", 40, 720, 110, 40);
bub("s2", "Беру.", 720, 790, 220, 50);

window.build = R => {
  const tl = R.tl, cam = R.camera($("#cam"), { hand: .6 });
  R.grain(.03);
  gsap.set(".scn", { opacity: 0 }); gsap.set("#sc_room", { opacity: 1 });
  const { pop } = common(R, cam, { mood: () => "grin" });
  const talk = (lv, f) => lv > .28 && !(lv < .55 && f % 3 === 2);
  const SW = { phone: st.l1 - .7, garage: st.d1 - .7, wash: st.l3 - .7, sale: st.s1 - .7, next: st.end - .7 };
  // капитал: 100 000 → 15 000 + 🚗 → 9 000 → 8 000 → 128 000
  const STEPS = [[0, 100000, 0], [W("l2", "85"), 15000, 1], [W("l3", "6"), 9000, 1], [W("l3", "мойк"), 8000, 1], [en.s2, 128000, 0]];
  const fmt = v => Math.round(v).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  R.hooks.push(t => { const f = Math.floor(t * 30), lt = (LIP.tolyan || [])[f] || 0, ld = (LIP.ded || [])[f] || 0;
    TOLS.forEach(p => { if (document.getElementById(p)) mouth(p, talk(lt, f) ? "talk" : "grin"); });
    if (document.getElementById("d")) mouth("d", talk(ld, f) ? "talk" : "grin");
    let v = 0, prev = 0, car = 0; for (const [at, to, c] of STEPS) { if (t < at) break; v = prev + (to - prev) * Math.min(1, (t - at) / .7); prev = to; car = c; }
    $("#cnt").textContent = `💸 ${fmt(v)} ₽${car ? " + 🚗" : ""}`;
    for (let i = 0; i < 12; i++) { const d = document.getElementById("fm" + i), on = t > W("l3", "мойк") - .2 && t < SW.sale;
      d.style.opacity = on ? .95 : 0; d.style.transform = `translateY(${Math.sin(t * 3 + i) * 10}px) scale(${.8 + .3 * Math.sin(t * 2 + i)})`; } });
  tl.to("#cnt", { opacity: 1, duration: .3 }, en.t1); tl.to("#cnt", { opacity: 0, duration: .2 }, st.end + 1.5);
  STEPS.slice(1).forEach(([at]) => { tl.fromTo("#cnt", { scale: 1.35 }, { scale: 1, duration: .3, ease: "back.out(2)", immediateRender: false }, at); R.sfx("tick", at, .9); });
  const swap = (from, to, at) => {
    tl.set(`#sc_${to}`, { opacity: 1, x: 1080, filter: "blur(14px)" }, at)
      .to(`#sc_${from}`, { x: -1080, filter: "blur(14px)", duration: .35, ease: "power3.in" }, at)
      .to(`#sc_${to}`, { x: 0, filter: "blur(0px)", duration: .38, ease: "power3.out" }, at + .12)
      .set(`#sc_${from}`, { opacity: 0, x: 0, filter: "none" }, at + .5);
    R.sfx("whoosh", at, .6);
  };
  window.MUSIC = { style: "toon", bpm: 108, end: R.dur - 1.2 };
  const ids = E.lines.map(l => l.id), SWT = Object.values(SW);
  for (const l of ["t1", "t2", "d1", "s1", "t3", "s2"]) { const nx = ids[ids.indexOf(l) + 1]; const ns = SWT.filter(x => x > st[l]).sort((a, b) => a - b)[0] ?? 1e9;
    pop("#b_" + l, st[l] - .05, Math.min(en[l] + .9, st[nx] - .1, ns - .05)); }
  const slam = (sel, at, sfx = "impact") => { tl.fromTo(sel, { opacity: 0, scale: 2 }, { opacity: 1, scale: 1, duration: .18, ease: "power4.out", immediateRender: false }, at); R.sfx(sfx, at + .02, .7); };

  // 1. хук
  tl.to("#title", { opacity: 0, y: -50, duration: .25 }, en.t1 - .3);
  tl.fromTo("#dream", { opacity: 0, scale: .5, transformOrigin: "0% 100%" }, { opacity: 1, scale: 1, duration: .4, ease: "back.out(1.8)", immediateRender: false }, W("t1", "перекуп")); R.sfx("pop", W("t1", "перекуп"), .6);
  slam("#pt1", W("l0", "ста"), "pop");
  // 2. 03:00 — карточка бота
  swap("room", "phone", SW.phone);
  tl.fromTo("#bot1", { opacity: 0, scale: .7, y: 60 }, { opacity: 1, scale: 1, y: 0, duration: .35, ease: "back.out(1.8)", immediateRender: false }, SW.phone + .3);
  tl.to("#bot1c", { opacity: 1, duration: .2 }, W("l1", "три") - .1); R.sfx("ping", W("l1", "три") - .1, 1); R.punch(cam, W("l1", "четвер"), .05);
  tl.fromTo("#T2", { y: 60 }, { y: 0, duration: .35, ease: "back.out(2.5)", immediateRender: false }, st.t2 - .1);
  // 3. гараж
  swap("phone", "garage", SW.garage);
  slam("#g1", W("l2", "85"), "clack"); slam("#g2", W("l2", "перв"), "pop");
  // 4. мойка
  swap("garage", "wash", SW.wash);
  slam("#w1", W("l3", "аккум"), "pop"); slam("#w2", W("l3", "мойк"), "pop"); slam("#w3", W("l3", "скрут"), "impact");
  // 5. продажа
  swap("wash", "sale", SW.sale);
  tl.fromTo("#cash2", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: .3, ease: "back.out(2)", immediateRender: false }, en.s2); R.sfx("ping", en.s2, .6);
  slam("#u1", W("l4", "плюс"), "impact"); R.punch(cam, W("l4", "шок"), .06);
  // 6. крючок + одна финальная карточка
  swap("sale", "next", SW.next);
  tl.fromTo("#nx", { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: .4, ease: "back.out(1.6)", immediateRender: false }, W("end", "следующ") - .2); R.sfx("impact", W("end", "следующ"), .6);
  tl.fromTo("#cta2", { opacity: 0, y: 80, scale: .9 }, { opacity: 1, y: 0, scale: 1, duration: .4, ease: "back.out(1.6)", immediateRender: false }, W("end", "подпиш") - .2);
  ending(R, en.end + .3);
};
