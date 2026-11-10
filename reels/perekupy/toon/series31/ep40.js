// МИНИ-СЕРИАЛ «ТОЛЯН: СО СТА ТЫСЯЧ», часть 7 «Машина-двойник». Приёмы: «найди 5 отличий» (две фото рядом, кружки по словам),
// флешбэк в сепии «месяц назад» со вспышкой фотоаппарата, мигалки и погоня-гэг (клонер спотыкается о мешок цемента — «ПЛЮХ!»).
// Фоны новые: kino, shkola, stroyka. Новые герои: физрук Ильдар, клонер Кирилл, инспектор. Бот: две карточки за ночь — один номер, цена вдвое разная.
$("#title .a").textContent = E.rubric; $("#title .b").textContent = E.subtitle; $("#tag span").textContent = "со ста тысяч · 7";
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
const MK = (id, l, t, w, z = 3) => `<img class="pcar" id="${id}" src="../../kit/img/markii/markii_cherry.png" style="left:${l}px;top:${t}px;width:${w}px;z-index:${z}">`;
const PHONE = (id, l, t, w, inner) => `<div class="el" id="${id}" style="left:${l}px;top:${t}px;width:${w}px;z-index:9;background:#0d0e12;border:8px solid #2a2d34;border-radius:44px;padding:22px;box-shadow:0 0 70px rgba(120,180,255,.4);opacity:0">${inner}</div>`;
const CARD = (id, body, fs = 26) => `<div id="${id}" style="background:#1c1f26;border-radius:22px;padding:14px 18px;margin-top:10px;font-family:Onest;color:#fff;font-size:${fs}px;line-height:1.45">${body}</div>`;
const PLATE = `<div style="position:absolute;left:180px;top:268px;width:96px;background:#fff;border:3px solid #151515;font-family:'JetBrains Mono';font-weight:800;font-size:14px;text-align:center;color:#151515">О777ОР 69</div>`;
// фото «двойника»: свои диски, наклейка, скол, без антенны; у настоящей — антенна
const PHOTO = (id, l, label, fake) => `<div class="el" id="${id}" style="left:${l}px;top:640px;width:480px;height:380px;z-index:14;background:#e8ecf0;border:10px solid #fff;box-shadow:0 0 0 6px #151515, 0 16px 0 6px rgba(0,0,0,.4);overflow:hidden;opacity:0">`
  + `<div style="position:absolute;inset:0;background:linear-gradient(#bfe0f5 0 58%,#8d949c 58%)"></div><img src="../../kit/img/markii/markii_cherry.png" style="position:absolute;left:20px;top:110px;width:440px">` + PLATE
  + (fake ? `<div style="position:absolute;left:318px;top:150px;width:44px;height:30px;background:#ffd23f;border:3px solid #151515;transform:rotate(12deg)"></div>`
      + [100, 352].map(x => `<div style="position:absolute;left:${x}px;top:252px;width:54px;height:54px;border-radius:50%;background:radial-gradient(#2b2b2e 0 40%,#ffd23f 41% 52%,#2b2b2e 53%)"></div>`).join("")
      + `<path></path><div style="position:absolute;left:30px;top:250px;width:60px;height:6px;background:#fff;transform:rotate(-20deg)"></div><div style="position:absolute;left:40px;top:275px;width:22px;height:14px;background:#151515;border-radius:4px"></div>`
    : `<div style="position:absolute;left:300px;top:70px;width:5px;height:66px;background:#151515"></div>`)
  + `<div style="position:absolute;left:10px;top:10px;background:#151515;color:#fff;font-family:Unbounded;font-weight:900;font-size:24px;padding:4px 12px">${label}</div></div>`;
const RING = (id, l, t, r = 44) => `<div class="el ring" id="${id}" style="left:${l - r}px;top:${t - r}px;width:${2 * r}px;height:${2 * r}px;border:8px solid #ff3b30;border-radius:50%;z-index:16;box-shadow:0 0 14px #ff3b30;opacity:0"></div>`;
const ZHORA = null;
const ILDAR = { jacket: "#1f4fb8", pants: "#1f4fb8", hair: "#1d1d1f", cap: "#fff" };
const KIRILL = { jacket: "#2b2f37", pants: "#151515", cap: "#151515", beard: true, hair: "#3a2d22", item: "phone", look: "grin" };
const COP = { police: true, jacket: "#2a3a5a", pants: "#1f2a44", mustache: true };
const TOLS = ["t", "t2", "t3", "t4"];

// 1. у кинотеатра ночью: две карточки, один номер
scene("kino", "kino");
add("kino", hero("tolyan", "t", 620, 880, .78, 7)
  + PHONE("ph1", 30, 700, 560, `<div style="font-family:Onest;font-weight:700;font-size:24px;color:#8b93a3">ПЕРЕХВАТ · бот</div>`
    + CARD("c1", `<b style="color:#ff7a1a">🔥 −35% к рынку</b><br><b>Toyota Mark II 2002 · 330 000 ₽</b><br>🚘 О777ОР 69`)
    + CARD("c2", `<b>Toyota Mark II 2002 · 690 000 ₽</b><br>🚘 О777ОР 69 · <span style="color:#ff3b30">тот же номер?!</span>`))
  + stamp("p1", "ЧАСТЬ 7 · МАШИНА-ДВОЙНИК", 60, 1580, "#ff2da6", "#fff", 40, -3));
// 2. найди 5 отличий
scene("diff", "kino");
add("diff", `<div class="el" style="left:0;top:0;width:1080px;height:1920px;z-index:12;background:rgba(10,8,20,.72)"></div>`
  + PHOTO("pa", 40, "330 000 ₽", true) + PHOTO("pb", 560, "690 000 ₽", false)
  + RING("r1", 40 + 10 + 127, 640 + 10 + 279) + RING("r2", 40 + 10 + 379, 640 + 10 + 279) + RING("r3", 40 + 10 + 340, 640 + 10 + 165, 40) + RING("r4", 40 + 10 + 60, 640 + 10 + 262, 40)
  + RING("r5", 560 + 10 + 302, 640 + 10 + 100, 40)
  + `<div class="el" id="d5" style="left:40px;right:40px;top:1110px;z-index:16;text-align:center;font-family:Unbounded;font-weight:900;font-size:66px;color:#fff;-webkit-text-stroke:11px #151515;paint-order:stroke fill;opacity:0">НАЙДИ 5 ОТЛИЧИЙ</div>`
  + stamp("dv", "ДВОЙНИК?", 120, 1250, "#ff3b30", "#fff", 60, -6));
// 3. школа № 12: настоящий владелец
scene("shk", "shkola");
add("shk", MK("car1", 300, 1170, 660) + hero("perekup", "il", 620, 860, .8, 7, ILDAR) + hero("tolyan", "t2", -20, 900, .76, 7));
// 4. флешбэк: месяц назад
scene("flash", "shkola");
add("flash", MK("car2", 300, 1170, 660) + hero("perekup", "ki", 620, 860, .8, 7, KIRILL)
  + `<div class="el" style="left:0;top:0;width:1080px;height:1920px;z-index:12;background:repeating-linear-gradient(0deg, rgba(60,40,10,.06) 0 3px, transparent 3px 7px)"></div>`
  + `<div class="el" id="fb" style="left:40px;top:470px;z-index:16;font-family:Unbounded;font-weight:900;font-size:76px;color:#f4e3c8;-webkit-text-stroke:11px #3a2a10;paint-order:stroke fill;transform:rotate(-3deg);opacity:0">МЕСЯЦ НАЗАД…</div>`
  + `<div class="el" id="flashw" style="left:0;top:0;width:1080px;height:1920px;z-index:15;background:#fff;opacity:0"></div>`
  + `<div class="el" id="cam1" style="left:740px;top:930px;z-index:16;font-size:90px;opacity:0">📸</div>`);
// 5. стройка ночью: клонер
scene("str", "stroyka");
add("str", MK("car3", 300, 1170, 660) + `<div class="el" style="left:560px;top:1362px;width:150px;z-index:6;background:#fff;border:4px solid #151515;border-radius:6px;text-align:center;font-family:'JetBrains Mono';font-weight:800;font-size:24px;color:#151515">О777ОР 69</div>`
  + hero("perekup", "ki2", 620, 860, .8, 7, KIRILL) + hero("tolyan", "t3", -20, 900, .76, 7));
// 6. стройка: мигалки, инспектор, погоня-гэг
scene("cop", "stroyka");
add("cop", MK("car4", 300, 1170, 660) + hero("perekup", "cp", 640, 860, .8, 7, COP) + hero("perekup", "ki3", 380, 880, .76, 8, { ...KIRILL, look: "o" })
  + [0, 1].map(i => `<div class="el" style="left:${30 + i * 120}px;top:${1430 - i * 40}px;width:150px;height:80px;z-index:7;background:#c9ced4;border:6px solid #151515;border-radius:16px 16px 10px 10px"><div style="margin:20px auto 0;width:90px;font-family:Unbounded;font-weight:900;font-size:16px;color:#6b7280;text-align:center">ЦЕМЕНТ</div></div>`).join("")
  + `<div class="el" id="siren" style="left:0;top:0;width:1080px;height:1920px;z-index:5;background:radial-gradient(circle at 85% 35%, rgba(46,134,222,.45), transparent 50%), radial-gradient(circle at 15% 35%, rgba(255,59,48,.4), transparent 50%);opacity:0"></div>`
  + stamp("plux", "ПЛЮХ!", 80, 1300, "#ffd23f", "#151515", 90, -8) + stamp("cg", "ПОЙМАН", 560, 1560, "#4cd964", "#151515", 56, 4));
// 7. школа: приглашение, крючок, финальная карточка
scene("fin", "shkola");
add("fin", MK("car5", 300, 1170, 660) + hero("perekup", "il2", 620, 860, .8, 7, ILDAR) + hero("tolyan", "t4", -20, 900, .76, 7)
  + `<div class="el" id="nx" style="left:60px;right:60px;top:420px;z-index:20;background:#0d0e12;border:6px solid #fff;border-radius:30px;padding:22px 26px;color:#fff;font-family:Unbounded;font-weight:900;font-size:46px;line-height:1.25;text-align:center;opacity:0">ЧАСТЬ 8:<br><span style="color:#ffd23f">школьная</span> <span style="color:#ff3b30">парковка</span></div>
  <div class="ctab" id="cta2" style="top:1300px"><div class="cbig">Бот <span>«Перехват»</span><br>— ссылка в шапке</div><div class="csm">новые объявления через ~1 с · ниже рынка</div></div>`);

$(".stage").insertAdjacentHTML("beforeend", `<div id="cnt" style="opacity:0">💸 350 000 ₽</div><div id="clk2">23:12</div>`);
TOLS.forEach(p => { const s = document.getElementById(p + "-shades"); if (s) s.style.display = ""; });
$("#end h2").innerHTML = E.end;
const bub = (line, html, l, t, tx, fs) => { const b = bubble(line, html, l, t, tx); if (fs) b.style.fontSize = fs + "px"; return b; };
bub("t1", "Так не бывает,<br><em>брат.</em>", 600, 720, 184, 48);
bub("i1", "Моя машина под окном стоит!<br><em>И номер мой!</em>", 340, 720, 448, 38);
bub("k1", "Документы в порядке, брат.<br><em>Только наличкой и быстро.</em>", 360, 720, 428, 38);
bub("t2", "Деньги в машине.<br><em>Сейчас…</em>", 40, 740, 100, 44);
bub("c1", "Гражданин,<br><em>документы на машину.</em>", 520, 720, 288, 42);
bub("i2", "Брат, у нас все учителя<br><em>машины меняют. Приходи!</em>", 320, 720, 468, 40);

window.build = R => {
  const tl = R.tl, cam = R.camera($("#cam"), { hand: .6 });
  R.grain(.03);
  gsap.set(".scn", { opacity: 0 }); gsap.set("#sc_kino", { opacity: 1 });
  const { pop } = common(R, cam, { mood: () => "grin" });
  const talk = (lv, f) => lv > .28 && !(lv < .55 && f % 3 === 2);
  const SW = { diff: st.l1 - .7, shk: st.l2 - .7, flash: st.l3 - .7, str: st.k1 - .7, cop: st.c1 - .9, fin: st.i2 - .7 };
  const SP = [["il", "ildar"], ["il2", "ildar"], ["ki", "kirill"], ["ki2", "kirill"], ["ki3", "kirill"], ["cp", "cop"]];
  const ZERO = W("end", "потер");
  R.hooks.push(t => { const f = Math.floor(t * 30), lt = (LIP.tolyan || [])[f] || 0;
    TOLS.forEach(p => { if (document.getElementById(p)) mouth(p, talk(lt, f) ? "talk" : (p === "t" || p === "t3" ? "o" : "grin")); });
    SP.forEach(([p, k]) => { if (document.getElementById(p)) mouth(p, talk((LIP[k] || [])[f] || 0, f) ? "talk" : (k === "kirill" ? (p === "ki3" ? "o" : "grin") : "flat")); });
    $("#cnt").textContent = t > ZERO ? "💸 350 000 ₽ ±0" : "💸 350 000 ₽"; });
  tl.to("#cnt", { opacity: 1, duration: .3 }, 1.6); tl.to("#cnt", { opacity: 0, duration: .2 }, W("end", "восьм") - .2);
  tl.fromTo("#cnt", { scale: 1.35 }, { scale: 1, duration: .3, ease: "back.out(2)", immediateRender: false }, ZERO); R.sfx("tick", ZERO, .9);
  const swap = (from, to, at) => {
    tl.set(`#sc_${to}`, { opacity: 1, x: 1080, filter: "blur(14px)" }, at)
      .to(`#sc_${from}`, { x: -1080, filter: "blur(14px)", duration: .35, ease: "power3.in" }, at)
      .to(`#sc_${to}`, { x: 0, filter: "blur(0px)", duration: .38, ease: "power3.out" }, at + .12)
      .set(`#sc_${from}`, { opacity: 0, x: 0, filter: "none" }, at + .5);
    R.sfx("whoosh", at, .6);
  };
  window.MUSIC = { style: "detective", bpm: 96, end: R.dur - 1.2 };
  const ids = E.lines.map(l => l.id), SWT = Object.values(SW);
  for (const l of ["t1", "i1", "k1", "t2", "c1", "i2"]) { const nx = ids[ids.indexOf(l) + 1]; const ns = SWT.filter(x => x > st[l]).sort((a, b) => a - b)[0] ?? 1e9;
    pop("#b_" + l, st[l] - .05, Math.min(en[l] + .9, st[nx] - .1, ns - .05)); }
  const slam = (sel, at, sfx = "impact") => { tl.fromTo(sel, { opacity: 0, scale: 2 }, { opacity: 1, scale: 1, duration: .18, ease: "power4.out", immediateRender: false }, at); R.sfx(sfx, at + .02, .7); };
  const show = (sel, at) => { tl.fromTo(sel, { opacity: 0, scale: .7, y: 60 }, { opacity: 1, scale: 1, y: 0, duration: .35, ease: "back.out(1.8)", immediateRender: false }, at); R.sfx("ping", at - .03, 1); };
  const ring = (sel, at) => { tl.fromTo(sel, { opacity: 0, scale: 2 }, { opacity: 1, scale: 1, duration: .25, ease: "back.out(2)", immediateRender: false }, at); R.sfx("pop", at, .6); };

  // 1. кинотеатр: две карточки, один номер
  tl.to("#title", { opacity: 0, y: -50, duration: .25 }, 1.4);
  tl.fromTo("#clk2", { opacity: 0, y: -30 }, { opacity: 1, y: 0, duration: .25, immediateRender: false }, .5); tl.to("#clk2", { opacity: 0, duration: .15 }, SW.diff);
  show("#ph1", W("l0", "бот") - .1);
  tl.set("#c2", { opacity: 0 }, 0).to("#c2", { opacity: 1, duration: .2 }, W("l0", "номер")); R.sfx("ping", W("l0", "номер"), .8);
  tl.fromTo("#c2", { x: 40 }, { x: 0, duration: .3, ease: "back.out(2)", immediateRender: false }, W("l0", "номер"));
  slam("#p1", W("l0", "вдвое"), "impact"); R.punch(cam, st.t1 + .1, .05);
  // 2. найди 5 отличий: кружки на словах
  swap("kino", "diff", SW.diff); tl.to("#p1", { opacity: 0, duration: .1 }, SW.diff);
  tl.fromTo(["#pa", "#pb"], { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: .3, stagger: .12, immediateRender: false }, SW.diff + .4);
  tl.to("#d5", { opacity: 1, duration: .2 }, SW.diff + .7);
  ring("#r1", W("l1", "диск")); ring("#r2", W("l1", "диск") + .2); ring("#r5", W("l1", "антен")); ring("#r4", W("l1", "скол")); ring("#r3", W("l1", "разн"));
  slam("#dv", W("l1", "двойник"), "boom"); R.shake(cam, W("l1", "двойник"), .4, .3);
  // 3. школа: настоящий владелец
  swap("diff", "shk", SW.shk);
  R.punch(cam, st.i1 + .1, .06);
  // 4. флешбэк в сепии
  swap("shk", "flash", SW.flash);
  tl.set("#sc_flash", { filter: "sepia(1) contrast(1.1) brightness(.92)" }, SW.flash + .5);
  tl.to("#fb", { opacity: 1, duration: .3 }, SW.flash + .5);
  tl.to("#cam1", { opacity: 1, duration: .2 }, W("l3", "сфот") - .3);
  tl.fromTo("#flashw", { opacity: 0 }, { opacity: .95, duration: .05, yoyo: true, repeat: 1, immediateRender: false }, W("l3", "сфот") + .2); R.sfx("clack", W("l3", "сфот") + .2, .9);
  // 5. стройка: Кирилл торопит, Толян тянет время
  swap("flash", "str", SW.str);
  // 6. мигалки, инспектор, погоня-гэг
  swap("str", "cop", SW.cop);
  tl.to("#siren", { opacity: 1, duration: .15, repeat: 9, yoyo: true }, SW.cop + .3);
  const run = W("l5", "побеж");
  tl.to("#KI3", { x: -260, duration: .8, ease: "power1.in" }, run).to("#KI3", { rotation: -78, y: 520, x: -200, duration: .25, ease: "power2.in" }, W("l5", "мешк") - .1);
  slam("#plux", W("l5", "мешк") + .1, "boom"); R.shake(cam, W("l5", "мешк") + .1, .8, .45);
  slam("#cg", W("l5", "нашли"), "impact");
  // 7. школа: приглашение, ±0, крючок, финальная карточка
  swap("cop", "fin", SW.fin);
  tl.fromTo("#nx", { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: .4, ease: "back.out(1.6)", immediateRender: false }, W("end", "восьм")); R.sfx("impact", W("end", "восьм") + .05, .6);
  tl.fromTo("#cta2", { opacity: 0, y: 80, scale: .9 }, { opacity: 1, y: 0, scale: 1, duration: .4, ease: "back.out(1.6)", immediateRender: false }, W("end", "подпиш") - .3);
  ending(R, en.end + .3);
};
