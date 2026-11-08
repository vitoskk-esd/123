// МИНИ-СЕРИАЛ «ТОЛЯН: СО СТА ТЫСЯЧ», часть 2 «Приора и первая ошибка». Все фоны новые (barber, bizpark, gibdd, razbor), второстепенные герои новые
// (продавец Эдуард, инспектор, покупатель Олег, разборщик Михей). Ошибка — купил «не глядя», на машине запрет на регистрацию; мораль: бот находит, проверяешь ты.
$("#title .a").textContent = E.rubric; $("#title .b").textContent = E.subtitle; $("#tag span").textContent = "со ста тысяч · 2";
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
const PRI = (id, l, t, w, z = 3) => `<img class="pcar" id="${id}" src="../../kit/img/priora/priora_white.png" style="left:${l}px;top:${t}px;width:${w}px;z-index:${z}">`;
const CASH = (id, l, t, n = 4) => `<div class="el" id="${id}" style="left:${l}px;top:${t}px;width:300px;height:160px;z-index:8;opacity:0">` + Array.from({ length: n }, (_, i) => `<div style="position:absolute;left:${i * 26}px;top:${60 - i * 10}px;width:150px;height:76px;background:#8fd17a;border:5px solid #151515;border-radius:8px;transform:rotate(${-10 + i * 5}deg)"></div>`).join("") + `</div>`;
const PHONE = (id, l, t, w, inner) => `<div class="el" id="${id}" style="left:${l}px;top:${t}px;width:${w}px;z-index:9;background:#0d0e12;border:8px solid #2a2d34;border-radius:44px;padding:22px;box-shadow:0 0 70px rgba(120,180,255,.4);opacity:0">${inner}</div>`;
const EDUARD = { jacket: "#2b2f37", pants: "#2b2f37", tie: "#c0392b", glasses: true, hair: "#5b4636", item: "phone" };
const OLEG = { jacket: "#8e5a3a", pants: "#3d4a5c", hair: "#3a2d22", beard: true };
const INSP = { police: true, jacket: "#2a3a5a", pants: "#1f2a44", glasses: true };
const MIHEY = { jacket: "#d68a1a", pants: "#3b3f46", cap: "#2b2b2e", beard: true, hair: "#6b4a2a" };
const TOLS = ["t2", "t3", "t4", "t5", "t6"];

// 1. барбершоп: карточка бота, «беру не глядя»
scene("barber", "barber");
add("barber", hero("tolyan", "t", 520, 860, .86, 7)
  + PHONE("bot1", 30, 760, 430, `<div style="font-family:Onest;font-weight:700;font-size:24px;color:#8b93a3">ПЕРЕХВАТ · бот</div><div style="background:#1c1f26;border-radius:22px;padding:16px 20px;margin-top:10px;font-family:Onest;color:#fff;font-size:28px;line-height:1.45"><b style="color:#ff7a1a">🔥 −30% к рынку · хозяин</b><br><b>Lada Priora 2012 · 110 000 ₽</b><br>⏱ 1 с после публикации</div>`)
  + stamp("p1", "«НЕ ГЛЯДЯ» = ОШИБКА", 60, 1420, "#ff3b30", "#fff", 40, -3));
// 2. парковка БЦ: Эдуард торопится
scene("biz", "bizpark");
add("biz", PRI("car1", 250, 1250, 720) + hero("perekup", "ed", -10, 860, .84, 7, EDUARD) + hero("tolyan", "t2", 800, 880, .76, 7)
  + stamp("b1", "−110 000 ₽", 380, 1120, "#ff3b30", "#fff", 50, 3)
  + `<div class="el" id="door" style="left:400px;top:860px;width:280px;height:160px;background:#151515;z-index:2;opacity:0"></div>`);
// 3. ГИБДД: запрет
scene("gibdd", "gibdd");
add("gibdd", hero("perekup", "ol", -10, 880, .78, 7, OLEG) + hero("perekup", "in", 420, 840, .78, 6, INSP) + hero("tolyan", "t3", 800, 890, .72, 7)
  + stamp("g1", "ПРОДАЛ ЗА 140 000", 200, 560, "#4cd964", "#151515", 46, -3) + stamp("g2", "ЗАПРЕТ!", 330, 1360, "#ff3b30", "#fff", 60, -2));
// 4. парковка БЦ без Эдуарда: абонент не в сети
scene("biz2", "bizpark");
add("biz2", PRI("car2", 250, 1250, 720) + hero("tolyan", "t4", -20, 880, .82, 7)
  + PHONE("off", 420, 760, 560, `<div style="font-family:Onest;color:#fff;font-size:34px;text-align:center;padding:24px 0"><div style="font-size:90px">📵</div><b>Эдуард Олегович</b><br><span style="color:#ff3b30">абонент не в сети</span></div>`)
  + stamp("o1", "−140 000 ₽ ОЛЕГУ", 300, 560, "#ff3b30", "#fff", 46, 3));
// 5. барбершоп: проверка — после покупки
scene("check", "barber");
add("check", hero("tolyan", "t5", 560, 880, .82, 7)
  + PHONE("gai", 30, 760, 460, `<div style="font-family:Onest;font-weight:700;font-size:22px;color:#8b93a3">Проверка автомобиля · сайт Госавтоинспекции</div><div style="font-family:Onest;color:#fff;font-size:30px;line-height:1.5;margin-top:10px">Ограничения: <b style="color:#ff3b30">2</b><br>⛔ запрет на рег. действия<br><span style="color:#8b93a3">основание: судебные приставы</span></div>`)
  + stamp("k1", "1 МИНУТА · БЕСПЛАТНО", 60, 1420, "#4cd964", "#151515", 40, -3) + stamp("k2", "…ПОСЛЕ ПОКУПКИ 🤦", 520, 1520, "#151515", "#fff", 36, 3));
// 6. разборка: Михей
scene("razbor", "razbor");
add("razbor", PRI("car3", 250, 1250, 720) + hero("perekup", "mi", 790, 860, .8, 7, MIHEY) + hero("tolyan", "t6", -20, 880, .8, 7)
  + CASH("cash1", 440, 1480, 3) + stamp("r1", "−50 000 ₽", 60, 1600, "#ff3b30", "#fff", 50, -3));
// 7. мораль одной строкой + крючок + финальная карточка
scene("next", "gibdd");
add("next", `<div class="el" style="inset:0;background:rgba(10,12,16,.55);z-index:2"></div><div class="el" id="nx" style="left:60px;right:60px;top:520px;z-index:20;background:#0d0e12;border:6px solid #fff;border-radius:30px;padding:24px 26px;color:#fff;font-family:Unbounded;font-weight:900;font-size:40px;line-height:1.3;text-align:center;opacity:0">Бот находит быстро —<br><span style="color:#ffd23f">проверять всё равно тебе</span><div id="nx2" style="font-size:32px;color:#ff3b30;margin-top:12px;opacity:0">ЧАСТЬ 3: конкурент</div></div>
  <div class="ctab" id="cta2" style="top:1040px"><div class="cbig">Бот <span>«Перехват»</span><br>— ссылка в шапке</div><div class="csm">свежие объявления по бюджету и городу</div></div>`);

$(".stage").insertAdjacentHTML("beforeend", `<div id="cnt" style="opacity:0">💸 128 000 ₽</div>`);
["t"].concat(TOLS).forEach(p => { const s = document.getElementById(p + "-shades"); if (s) s.style.display = ""; });
$("#end h2").innerHTML = E.end;
const bub = (line, html, l, t, tx, fs) => { const b = bubble(line, html, l, t, tx); if (fs) b.style.fontSize = fs + "px"; return b; };
bub("t1", "Брат, беру<br><em>не глядя!</em>", 520, 720, 180, 48);
bub("e1", "ПТС оригинал. Только быстро —<br><em>у меня совещание.</em>", 60, 720, 110, 40);
bub("i1", "На машине запрет на регистрацию.<br><em>Долги прошлого владельца.</em>", 120, 690, 460, 36);
bub("o1", "Брат…<br><em>верни деньги.</em>", 40, 740, 120, 46);
bub("m1", "С запретом? Шестьдесят.<br><em>На запчасти — нормально.</em>", 380, 720, 560, 40);

window.build = R => {
  const tl = R.tl, cam = R.camera($("#cam"), { hand: .6 });
  R.grain(.03);
  gsap.set(".scn", { opacity: 0 }); gsap.set("#sc_barber", { opacity: 1 });
  const { pop } = common(R, cam, { mood: () => "grin" });
  const talk = (lv, f) => lv > .28 && !(lv < .55 && f % 3 === 2);
  const SW = { biz: st.e1 - .7, gibdd: st.l3 - .7, biz2: st.l4 - .7, check: st.l5 - .7, razbor: st.m1 - .7, next: st.end - .7 };
  const STEPS = [[0, 128000, 0], [W("l2", "110"), 18000, 1], [W("l3", "140"), 158000, 0], [W("l4", "верн"), 18000, 1], [en.m1, 78000, 0]];
  const fmt = v => Math.round(v).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  const SP = [["ed", "eduard"], ["in", "insp"], ["ol", "oleg"], ["mi", "mihey"]];
  R.hooks.push(t => { const f = Math.floor(t * 30), lt = (LIP.tolyan || [])[f] || 0;
    TOLS.forEach(p => { if (document.getElementById(p)) mouth(p, talk(lt, f) ? "talk" : (p === "t3" || p === "t4" || p === "t5" ? "o" : "grin")); });
    SP.forEach(([p, k]) => { if (document.getElementById(p)) mouth(p, talk((LIP[k] || [])[f] || 0, f) ? "talk" : "flat"); });
    let v = 0, prev = 0, car = 0; for (const [at, to, c] of STEPS) { if (t < at) break; v = prev + (to - prev) * Math.min(1, (t - at) / .7); prev = to; car = c; }
    $("#cnt").textContent = `💸 ${fmt(v)} ₽${car ? " + 🚗" : ""}`; });
  tl.to("#cnt", { opacity: 1, duration: .3 }, 1.6); tl.to("#cnt", { opacity: 0, duration: .2 }, st.end + 1.5);
  STEPS.slice(1).forEach(([at]) => { tl.fromTo("#cnt", { scale: 1.35 }, { scale: 1, duration: .3, ease: "back.out(2)", immediateRender: false }, at); R.sfx("tick", at, .9); });
  const swap = (from, to, at) => {
    tl.set(`#sc_${to}`, { opacity: 1, x: 1080, filter: "blur(14px)" }, at)
      .to(`#sc_${from}`, { x: -1080, filter: "blur(14px)", duration: .35, ease: "power3.in" }, at)
      .to(`#sc_${to}`, { x: 0, filter: "blur(0px)", duration: .38, ease: "power3.out" }, at + .12)
      .set(`#sc_${from}`, { opacity: 0, x: 0, filter: "none" }, at + .5);
    R.sfx("whoosh", at, .6);
  };
  window.MUSIC = { style: "story", bpm: 100, end: R.dur - 1.2, mute: [[st.i1 - .2, en.o1 + .3]] };
  const ids = E.lines.map(l => l.id), SWT = Object.values(SW);
  for (const l of ["t1", "e1", "i1", "o1", "m1"]) { const nx = ids[ids.indexOf(l) + 1]; const ns = SWT.filter(x => x > st[l]).sort((a, b) => a - b)[0] ?? 1e9;
    pop("#b_" + l, st[l] - .05, Math.min(en[l] + .9, st[nx] - .1, ns - .05)); }
  const slam = (sel, at, sfx = "impact") => { tl.fromTo(sel, { opacity: 0, scale: 2 }, { opacity: 1, scale: 1, duration: .18, ease: "power4.out", immediateRender: false }, at); R.sfx(sfx, at + .02, .7); };
  const show = (sel, at) => { tl.fromTo(sel, { opacity: 0, scale: .7, y: 60 }, { opacity: 1, scale: 1, y: 0, duration: .35, ease: "back.out(1.8)", immediateRender: false }, at); R.sfx("ping", at - .03, 1); };

  // 1. барбершоп
  tl.to("#title", { opacity: 0, y: -50, duration: .25 }, 1.4);
  show("#bot1", W("l0", "приор") - .3);
  R.punch(cam, st.t1 + .1, .05); slam("#p1", W("l1", "ошиб"), "impact");
  // 2. парковка БЦ
  swap("barber", "biz", SW.biz);
  slam("#b1", W("l2", "110"), "clack");
  tl.to("#ED", { x: 380, opacity: 0, duration: .8, ease: "power2.in" }, W("l2", "исчез")); R.sfx("whoosh", W("l2", "исчез"), .4);
  // 3. ГИБДД
  swap("biz", "gibdd", SW.gibdd);
  slam("#g1", W("l3", "140"), "pop"); tl.to("#g1", { opacity: 0, duration: .2 }, st.i1 - .2);
  slam("#g2", W("i1", "запрет"), "impact"); R.shake(cam, W("i1", "запрет"), .6, .4); R.sfx("boom", W("i1", "запрет"), .5);
  // 4. Эдуард не в сети
  swap("gibdd", "biz2", SW.biz2);
  slam("#o1", W("l4", "верн"), "pop"); show("#off", W("l4", "эдуард"));
  // 5. проверка — после покупки
  swap("biz2", "check", SW.check);
  show("#gai", SW.check + .4); slam("#k1", W("l5", "минут"), "pop"); slam("#k2", W("l5", "после"), "impact");
  // 6. разборка
  swap("check", "razbor", SW.razbor);
  tl.fromTo("#cash1", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: .3, ease: "back.out(2)", immediateRender: false }, en.m1); R.sfx("ping", en.m1, .5);
  slam("#r1", W("l6", "50"), "impact"); R.punch(cam, W("l6", "кажд"), .05);
  // 7. мораль + крючок + финальная карточка
  swap("razbor", "next", SW.next);
  tl.fromTo("#nx", { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: .4, ease: "back.out(1.6)", immediateRender: false }, st.end); R.sfx("impact", st.end + .05, .6);
  tl.to("#nx2", { opacity: 1, duration: .25 }, W("end", "следующ"));
  tl.fromTo("#cta2", { opacity: 0, y: 80, scale: .9 }, { opacity: 1, y: 0, scale: 1, duration: .4, ease: "back.out(1.6)", immediateRender: false }, W("end", "подпиш") - .2);
  ending(R, en.end + .3);
};


// ── ep34d «Холодная»: та же история и озвучка, другая «съёмка» ──
(() => {
  const C = {"t1": "ЗАПРЕТ!", "t2": "И МИНУС 50 000", "c1": "#1d4fb8", "c2": "#fff", "cam": "out", "music": {"style": "tech", "bpm": 116}};
  const orig = window.build;
  window.build = R => {
    orig(R);
    const tl = R.tl;
    $("#title .a").textContent = C.t1; $("#title .a").style.cssText = `font-size:110px;background:${C.c1};color:${C.c2}`;
    const b = $("#title .b"); b.style.display = ""; b.textContent = C.t2; b.style.cssText = `font-size:60px;background:${C.c2};color:${C.c1}`;
    tl.set("#title", { opacity: 1, y: 0 }, 0).to("#title", { opacity: 0, y: -50, duration: .3 }, 1.2);
    const S = [["barber", 0, st.e1 - .7, "60% 55%"], ["biz", st.e1 - .7, st.l3 - .7, "45% 60%"], ["gibdd", st.l3 - .7, st.l4 - .7, "50% 55%"],
               ["biz2", st.l4 - .7, st.l5 - .7, "45% 55%"], ["check", st.l5 - .7, st.m1 - .7, "55% 55%"], ["razbor", st.m1 - .7, st.end - .7, "50% 60%"],
               ["next", st.end - .7, en.end + .3, "50% 40%"]];
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
