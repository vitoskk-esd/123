// МИНИ-СЕРИАЛ «ТОЛЯН: СО СТА ТЫСЯЧ», часть 5 «Бот против бота», v2 (владелец 09.11: «однообразно — нужны уникальные события»).
// Приёмы: разделённый экран, карта гонки (точки едут), стоп-кадр (обесцвечивание), банкомат с Валерьичем, двойной твист («беру не глядя»).
// Фоны новые: pekarnya, spalnya, prospekt, chastnik, bankomat, kampus. Новые герои: Рустам, Валерьич; Жора — сквозной соперник.
$("#title .a").textContent = E.rubric; $("#title .b").textContent = E.subtitle; $("#tag span").textContent = "со ста тысяч · 5";
$("#title .a").style.cssText = "font-size:96px;background:#ffd23f;color:#151515"; $("#title .b").style.cssText = "font-size:70px;background:#151515;color:#fff";
document.querySelector("#cam > svg#bg")?.remove();
const W = (line, pre, n = 0) => {
  const norm = s => s.toLowerCase().replace(/ё/g, "е").replace(/[^а-я0-9a-z]/g, "");
  const hits = (TT.words[line] || []).filter(w => norm(w[0]).startsWith(norm(pre)));
  return hits[n] ? hits[n][1] : st[line];
};
const SCN = {};
const bgOf = (bg, id) => BGS[bg].replace('id="bg"', `id="bg_${id}"`);
function scene(name, bg) {
  const d = document.createElement("div"); d.className = "scn"; d.id = "sc_" + name;
  d.innerHTML = bg ? bgOf(bg, name) : "";
  $("#scene").appendChild(d); SCN[name] = d; return d;
}
const add = (sc, html) => { SCN[sc].insertAdjacentHTML("beforeend", html); };
const hero = (kind, p, l, t, s = 1, z = 6, o) => `<div class="c" id="${p.toUpperCase()}" style="left:${l}px;top:${t}px;z-index:${z};transform-origin:0 0;transform:scale(${s})">${CHARS[kind](p, o)}</div>`;
const stamp = (id, text, l, t, bg, fg = "#fff", fs = 60, rot = -4) => `<div class="stamp2" id="${id}" style="left:${l}px;top:${t}px;background:${bg};color:${fg};font-size:${fs}px;transform:rotate(${rot}deg)">${text}</div>`;
const CAR = (id, img, l, t, w, z = 3) => `<img class="pcar" id="${id}" src="../../kit/img/${img}" style="left:${l}px;top:${t}px;width:${w}px;z-index:${z}">`;
const CASH = (id, l, t, n = 4) => `<div class="el" id="${id}" style="left:${l}px;top:${t}px;width:300px;height:160px;z-index:8;opacity:0">` + Array.from({ length: n }, (_, i) => `<div style="position:absolute;left:${i * 26}px;top:${60 - i * 10}px;width:150px;height:76px;background:#8fd17a;border:5px solid #151515;border-radius:8px;transform:rotate(${-10 + i * 5}deg)"></div>`).join("") + `</div>`;
const PHONE = (id, l, t, w, inner) => `<div class="el" id="${id}" style="left:${l}px;top:${t}px;width:${w}px;z-index:9;background:#0d0e12;border:8px solid #2a2d34;border-radius:44px;padding:22px;box-shadow:0 0 70px rgba(120,180,255,.4);opacity:0">${inner}</div>`;
const BOT = (body, fs = 30) => `<div style="font-family:Onest;font-weight:700;font-size:24px;color:#8b93a3">ПЕРЕХВАТ · бот</div><div style="background:#1c1f26;border-radius:22px;padding:16px 20px;margin-top:10px;font-family:Onest;color:#fff;font-size:${fs}px;line-height:1.45">${body}</div>`;
const PING = (id, l, t, text) => `<div class="el" id="${id}" style="left:${l}px;top:${t}px;z-index:14;background:#0d0e12;border:5px solid #2a2d34;border-radius:22px;padding:12px 18px;font-family:Onest;font-weight:800;font-size:30px;color:#fff;box-shadow:0 0 30px rgba(120,180,255,.5);white-space:nowrap;opacity:0">${text}</div>`;
const BLANKET = (l, t, w) => `<div class="el" style="left:${l}px;top:${t}px;width:${w}px;height:300px;z-index:8;background:#e0b25a radial-gradient(circle,#5a3a1a 0 9px,transparent 10px) 0 0/46px 40px;border:7px solid #151515;border-radius:26px 26px 0 0"></div>`;
const ZHORA = { jacket: "#1d1d1f", pants: "#2b2f37", cap: "#c0392b", mustache: true, chain: true, hair: "#1d1d1f", item: "phone", look: "grin" };
const RUSTAM = { jacket: "#4f6b3a", pants: "#3b3f46", beard: true, hair: "#1d1d1f" };
const VALERICH = { coat: "#f2a0c0", pants: "#f2a0c0", hair: "#8a8a8a", mustache: true, look: "o" };
const TOLS = ["t", "t2", "t3", "t4", "t5"];

// 1. разделённый экран: пекарня | спальня Жоры
scene("split", "pekarnya");
add("split", hero("tolyan", "t", 90, 900, .72, 7) + PING("pg1", 30, 1250, "📲 Corolla · 145 000 ₽")
  + `<div class="el" id="half" style="left:540px;top:0;width:540px;height:1920px;overflow:hidden;z-index:5"><div style="position:absolute;left:-270px;top:0;width:1080px;height:1920px">${bgOf("spalnya", "half")}</div>`
  + hero("perekup", "zh", 150, 860, .72, 6, { ...ZHORA, look: "o" }) + BLANKET(30, 1240, 520) + PING("pg2", 40, 1250, "📲 Corolla · 145 000 ₽") + `</div>`
  + `<div class="el" id="divider" style="left:532px;top:0;width:16px;height:1920px;background:#fff;z-index:12;box-shadow:0 0 0 5px #151515"></div>`
  + stamp("p1", "ЧАСТЬ 5 · БОТ ПРОТИВ БОТА", 150, 1600, "#ff2da6", "#fff", 36, -3));
// 2. карта гонки на проспекте
scene("race", "prospekt");
add("race", CAR("car1", "w124/w124_34.png", 420, 1200, 560) + hero("perekup", "zh2", 640, 860, .8, 7, { ...ZHORA, look: "angry" })
  + `<div class="el" id="map" style="left:30px;top:410px;width:620px;z-index:14;background:#0d0e12;border:6px solid #fff;border-radius:28px;padding:12px;box-shadow:0 12px 0 #151515;opacity:0">
    <svg viewBox="0 0 600 380" style="width:100%;height:auto;display:block;border-radius:18px;background:#e9efe6">
     <path d="M0 250 q150 -60 300 0 t300 -20 v40 q-150 40 -300 -10 t-300 20 z" fill="#9fc8e8"/>
     <g stroke="#fff" stroke-width="14">${[60, 150, 330, 470].map(x => `<path d="M${x} 0 V380"/>`).join("")}${[80, 170, 320].map(y => `<path d="M0 ${y} H600"/>`).join("")}</g>
     <path d="M150 80 H330 V170" stroke="#ffd23f" stroke-width="10" stroke-dasharray="18 12" fill="none"/><path d="M560 350 L470 320 V170 H330" stroke="#ff3b30" stroke-width="10" stroke-dasharray="18 12" fill="none"/>
     <circle cx="330" cy="170" r="24" fill="#4cd964" stroke="#151515" stroke-width="5"/><text x="330" y="181" text-anchor="middle" font-size="26">🚗</text>
     <g id="dotT"><circle r="22" fill="#ffd23f" stroke="#151515" stroke-width="5"/><text y="8" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="22">Т</text></g>
     <g id="dotZ"><circle r="22" fill="#ff3b30" stroke="#151515" stroke-width="5"/><text y="8" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="22" fill="#fff">Ж</text></g>
     <g id="jam" opacity="0"><rect x="430" y="250" width="90" height="30" rx="6" fill="#ff3b30"/><text x="475" y="271" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="17" fill="#fff">ПРОБКА</text></g>
    </svg>
    <div style="display:flex;justify-content:space-between;margin-top:8px;font-family:'JetBrains Mono';font-weight:800;font-size:28px"><span style="color:#ffd23f">Т · 3 км</span><span style="color:#ff3b30">Ж · 9 км</span></div></div>`);
// 3. частный сектор + стоп-кадр
scene("cha", "chastnik");
add("cha", CAR("car2", "corolla/corolla.png", 260, 1180, 700) + hero("perekup", "ru", 620, 860, .8, 7, RUSTAM) + hero("tolyan", "t2", -20, 900, .76, 7)
  + `<div class="el" id="frz" style="left:40px;top:1180px;z-index:30;font-family:Unbounded;font-weight:900;font-size:90px;color:#fff;-webkit-text-stroke:12px #151515;paint-order:stroke fill;transform:rotate(-4deg);opacity:0">СТОП-КАДР</div>`
  + stamp("f1", "ЭТО ТОЛЯН. НАЛИЧКИ — 0 ₽", 40, 1560, "#ffd23f", "#151515", 44, -3));
// 4. банкомат и Валерьич
scene("bank", "bankomat");
add("bank", hero("perekup", "vl", 560, 860, .8, 7, VALERICH) + hero("tolyan", "t3", -20, 900, .76, 7)
  + [0, 1, 2, 3].map(i => `<div class="el" style="left:${790 + i * 8}px;top:${1210 - i * 10}px;width:110px;height:70px;z-index:8;background:#fff;border:4px solid #151515;border-radius:4px;transform:rotate(${-8 + i * 6}deg)"></div>`).join("")
  + stamp("km", "ЖОРА: 2 КМ", 60, 1560, "#ff3b30", "#fff", 56, -3));
// 5. частный сектор: по рукам, Жора опоздал
scene("cha2", "chastnik");
add("cha2", CAR("car3", "w124/w124_34.png", 600, 1200, 480, 2) + hero("perekup", "ru2", 330, 880, .74, 6, RUSTAM) + hero("perekup", "zh3", 700, 860, .78, 7, { ...ZHORA, look: "angry" })
  + hero("tolyan", "t4", -20, 900, .76, 7) + CASH("cash1", 200, 1440, 4) + stamp("s1", "−10 000 ЗА СКОЛ", 40, 1560, "#ff7a1a", "#151515", 50, -3));
// 6. твист: снова спальня Жоры, снова 7:02
scene("bed2", "spalnya");
add("bed2", hero("perekup", "zh4", 560, 860, .8, 6, ZHORA) + BLANKET(420, 1240, 660)
  + PHONE("bot2", 30, 760, 500, BOT(`<b style="color:#ff7a1a">🔥 −10% к рынку</b><br><b>Toyota Corolla 2003 · 200 000 ₽</b><br>⏱ 1 с после публикации`, 28))
  + stamp("b1", "«НЕ ГЛЯДЯ» — ЗНАКОМО?", 40, 1580, "#ff2da6", "#fff", 46, -3));
// 7. кампус: продавец — Толян; крючок и финальная карточка
scene("kam", "kampus");
add("kam", CAR("car4", "corolla/corolla.png", 260, 1190, 700) + hero("perekup", "zh5", 640, 860, .8, 7, { ...ZHORA, look: "o" }) + hero("tolyan", "t5", -20, 900, .76, 7)
  + `<div class="el" id="nx" style="left:60px;right:60px;top:300px;z-index:20;background:#0d0e12;border:6px solid #fff;border-radius:30px;padding:22px 26px;color:#fff;font-family:Unbounded;font-weight:900;font-size:42px;line-height:1.25;text-align:center;opacity:0">ЧАСТЬ 6:<br><span style="color:#ffd23f">первая машина</span> за <span style="color:#ff3b30">полмиллиона</span></div>
  <div class="ctab" id="cta2" style="top:1300px"><div class="cbig">Бот <span>«Перехват»</span><br>— ссылка в шапке</div><div class="csm">свой город · бюджет · ниже рынка · ~1 с</div></div>`);

$(".stage").insertAdjacentHTML("beforeend", `<div id="cnt" style="opacity:0">💸 148 000 ₽</div><div id="clk2">07:02</div>`);
TOLS.forEach(p => { const s = document.getElementById(p + "-shades"); if (s) s.style.display = ""; });
$("#end h2").innerHTML = E.end;
const bub = (line, html, l, t, tx, fs) => { const b = bubble(line, html, l, t, tx); if (fs) b.style.fontSize = fs + "px"; return b; };
bub("z1", "Моя!", 720, 740, 121, 56);
bub("t1", "Моя!", 150, 760, 91, 56);
bub("z2", "Пропустите,<br><em>я перекуп!</em>", 600, 700, 208, 46);
bub("r1", "Только наличкой.<br><em>Переводы не признаю.</em>", 440, 700, 348, 40);
bub("v1", "Подождёшь.<br><em>У меня сорок квитанций.</em>", 420, 700, 308, 40);
bub("t2", "Отец, у меня<br><em>машина уезжает!</em>", 40, 740, 100, 42);
bub("z3", "Опять ты?!", 700, 720, 164, 50);
bub("z4", "О! Беру<br><em>не глядя!</em>", 600, 700, 128, 50);
bub("z5", "Студент?!", 660, 720, 148, 50);
bub("t3", "Глядеть надо,<br><em>брат.</em>", 40, 740, 100, 46);

window.build = R => {
  const tl = R.tl, cam = R.camera($("#cam"), { hand: .6 });
  R.grain(.03);
  gsap.set(".scn", { opacity: 0 }); gsap.set("#sc_split", { opacity: 1 });
  const { pop } = common(R, cam, { mood: () => "grin" });
  const talk = (lv, f) => lv > .28 && !(lv < .55 && f % 3 === 2);
  const SW = { race: st.l1 - .7, cha: st.r1 - .7, bank: st.v1 - .7, cha2: st.l3 - .7, bed2: st.l4 - .7, kam: st.z5 - .7 };
  const STEPS = [[0, 148000, 0], [W("l3", "135"), 13000, 1], [W("end", "капитал"), 213000, 0]];
  const fmt = v => Math.round(v).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  const SP = [["zh", "zhora"], ["zh2", "zhora"], ["zh3", "zhora"], ["zh4", "zhora"], ["zh5", "zhora"], ["ru", "rustam"], ["ru2", "rustam"], ["vl", "valerich"]];
  const FRZ = [W("l2", "стоп") - .05, en.l2 + .1];
  R.hooks.push(t => { const f = Math.floor(t * 30), lt = (LIP.tolyan || [])[f] || 0, frozen = t > FRZ[0] && t < FRZ[1];
    TOLS.forEach(p => { if (document.getElementById(p)) mouth(p, talk(lt, f) ? "talk" : (p === "t2" ? "o" : "grin")); });
    SP.forEach(([p, k]) => { if (document.getElementById(p)) mouth(p, !frozen && talk((LIP[k] || [])[f] || 0, f) ? "talk" : (k === "zhora" && p !== "zh2" && p !== "zh3" ? "grin" : "flat")); });
    let v = 0, prev = 0, car = 0; for (const [at, to, c] of STEPS) { if (t < at) break; v = prev + (to - prev) * Math.min(1, (t - at) / .7); prev = to; car = c; }
    $("#cnt").textContent = `💸 ${fmt(v)} ₽${car ? " + 🚗" : ""}`; });
  tl.to("#cnt", { opacity: 1, duration: .3 }, 1.6); tl.to("#cnt", { opacity: 0, duration: .2 }, W("end", "шест") - .2);
  STEPS.slice(1).forEach(([at]) => { tl.fromTo("#cnt", { scale: 1.35 }, { scale: 1, duration: .3, ease: "back.out(2)", immediateRender: false }, at); R.sfx("tick", at, .9); });
  const swap = (from, to, at) => {
    tl.set(`#sc_${to}`, { opacity: 1, x: 1080, filter: "blur(14px)" }, at)
      .to(`#sc_${from}`, { x: -1080, filter: "blur(14px)", duration: .35, ease: "power3.in" }, at)
      .to(`#sc_${to}`, { x: 0, filter: "blur(0px)", duration: .38, ease: "power3.out" }, at + .12)
      .set(`#sc_${from}`, { opacity: 0, x: 0, filter: "none" }, at + .5);
    R.sfx("whoosh", at, .6);
  };
  window.MUSIC = { style: "story", bpm: 108, end: R.dur - 1.2, mute: [[FRZ[0], FRZ[1]]] };
  const ids = E.lines.map(l => l.id), SWT = Object.values(SW);
  for (const l of ["z1", "t1", "z2", "r1", "v1", "t2", "z3", "z4", "z5", "t3"]) { const nx = ids[ids.indexOf(l) + 1]; const ns = SWT.filter(x => x > st[l]).sort((a, b) => a - b)[0] ?? 1e9;
    const until = l === "z1" || l === "z5" ? Math.min(en[ids[ids.indexOf(l) + 1]] + .6, ns - .05) : Math.min(en[l] + .9, st[nx] - .1, ns - .05);   // «Моя!»/«Студент?!» висят, пока отвечает второй
    pop("#b_" + l, st[l] - .05, until); }
  const slam = (sel, at, sfx = "impact") => { tl.fromTo(sel, { opacity: 0, scale: 2 }, { opacity: 1, scale: 1, duration: .18, ease: "power4.out", immediateRender: false }, at); R.sfx(sfx, at + .02, .7); };
  const show = (sel, at) => { tl.fromTo(sel, { opacity: 0, scale: .7, y: 60 }, { opacity: 1, scale: 1, y: 0, duration: .35, ease: "back.out(1.8)", immediateRender: false }, at); R.sfx("ping", at - .03, 1); };
  const clock = (text, at, until) => { tl.set("#clk2", { textContent: text }, at); tl.fromTo("#clk2", { opacity: 0, y: -30 }, { opacity: 1, y: 0, duration: .25, immediateRender: false }, at); tl.to("#clk2", { opacity: 0, duration: .15 }, until); R.sfx("tick", at, .8); };

  // 1. разделённый экран: шторка-разделитель, два уведомления разом, «Моя!» — «Моя!»
  tl.to("#title", { opacity: 0, y: -50, duration: .25 }, 1.4);
  tl.from("#divider", { scaleY: 0, transformOrigin: "50% 0", duration: .4, ease: "power3.out" }, .2);
  tl.from("#half", { x: 540, duration: .5, ease: "power3.out" }, .2);
  clock("07:02", .5, SW.race);
  const pingAt = W("l0", "прислал");
  ["#pg1", "#pg2"].forEach(sel => tl.fromTo(sel, { opacity: 0, y: 40, scale: .8 }, { opacity: 1, y: 0, scale: 1, duration: .3, ease: "back.out(2)", immediateRender: false }, pingAt));
  R.sfx("ping", pingAt, 1); R.sfx("ping", pingAt + .08, .8);
  tl.to(["#T", "#ZH"], { y: -40, duration: .15, yoyo: true, repeat: 1, ease: "power2.out" }, st.z1);
  slam("#p1", st.t1 + .4, "impact"); R.punch(cam, st.t1 + .05, .06);
  // 2. карта гонки: «Т» едет быстро, «Ж» встаёт в пробку
  swap("split", "race", SW.race); tl.to("#p1", { opacity: 0, duration: .1 }, SW.race);
  tl.set("#dotT", { attr: { transform: "translate(150 80)" } }, 0).set("#dotZ", { attr: { transform: "translate(560 350)" } }, 0);
  show("#map", SW.race + .35);
  const mt = SW.race + .7;
  tl.to("#dotT", { attr: { transform: "translate(330 80)" }, duration: 1.6, ease: "none" }, mt).to("#dotT", { attr: { transform: "translate(330 150)" }, duration: .9, ease: "none" }, mt + 1.6);
  tl.to("#dotZ", { attr: { transform: "translate(480 323)" }, duration: 1.4, ease: "power1.out" }, mt);
  tl.to("#jam", { opacity: 1, duration: .15, repeat: 5, yoyo: true }, mt + 1.4); R.sfx("clack", mt + 1.4, .6);
  R.shake(cam, st.z2 + .1, .4, .3);
  // 3. стоп-кадр: всё серое, «СТОП-КАДР», плашка про ноль налички
  swap("race", "cha", SW.cha);
  tl.set("#sc_cha", { filter: "grayscale(1) contrast(1.15)" }, FRZ[0]).set("#sc_cha", { filter: "none" }, FRZ[1]);
  slam("#frz", FRZ[0], "impact"); R.sfx("boom", FRZ[0], .4); tl.to("#frz", { opacity: 0, duration: .15 }, FRZ[1]);
  slam("#f1", W("l2", "налич"), "clack"); tl.to("#f1", { opacity: 0, duration: .15 }, FRZ[1]);
  tl.fromTo("#sc_cha", { scale: 1 }, { scale: 1.12, transformOrigin: "15% 60%", duration: .5, ease: "power3.out", immediateRender: false }, FRZ[0])
    .to("#sc_cha", { scale: 1, duration: .35, ease: "power2.inOut" }, FRZ[1]);
  // 4. банкомат: Валерьич и сорок квитанций, Жора всё ближе
  swap("cha", "bank", SW.bank);
  slam("#km", st.t2, "clack"); tl.set("#km", { textContent: "ЖОРА: 1 КМ" }, en.t2 + .2); R.sfx("tick", en.t2 + .2, .8);
  R.punch(cam, st.t2 + .1, .05);
  // 5. по рукам, Жора опоздал
  swap("bank", "cha2", SW.cha2);
  slam("#s1", W("l3", "скол"), "pop");
  tl.fromTo("#cash1", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: .3, ease: "back.out(2)", immediateRender: false }, W("l3", "135")); R.sfx("ping", W("l3", "135"), .5);
  tl.from("#car3", { x: 700, duration: .6, ease: "power3.out" }, st.z3 - 1.0).from("#ZH3", { x: 400, opacity: 0, duration: .35, ease: "power2.out" }, st.z3 - .5);
  R.sfx("whoosh", st.z3 - 1.0, .5); R.shake(cam, st.z3 + .05, .5, .3);
  // 6. твист: снова 7:02 у Жоры
  swap("cha2", "bed2", SW.bed2);
  clock("07:02", SW.bed2 + .4, SW.kam);
  show("#bot2", W("l4", "бот")); R.sfx("ping", W("l4", "бот") + .1, .6);
  slam("#b1", en.z4 + .1, "impact");
  // 7. кампус: продавец — Толян; крючок и финальная карточка
  swap("bed2", "kam", SW.kam);
  R.punch(cam, st.z5 + .05, .07); R.sfx("boom", st.z5, .35);
  tl.fromTo("#nx", { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: .4, ease: "back.out(1.6)", immediateRender: false }, W("end", "шест")); R.sfx("impact", W("end", "шест") + .05, .6);
  tl.fromTo("#cta2", { opacity: 0, y: 80, scale: .9 }, { opacity: 1, y: 0, scale: 1, duration: .4, ease: "back.out(1.6)", immediateRender: false }, W("end", "подпиш") - .2);
  ending(R, en.end + .3);
};


// ── ep37b «Детектив»: та же история и озвучка, другая «съёмка» ──
(() => {
  const C = {"t1": "СТОП-КАДР:", "t2": "НАЛИЧКИ — 0 ₽", "c1": "#ff7a1a", "c2": "#151515", "cam": "vpan", "music": {"style": "detective", "bpm": 100}};
  const orig = window.build;
  window.build = R => {
    orig(R);
    const tl = R.tl;
    $("#title .a").textContent = C.t1; $("#title .a").style.cssText = `font-size:110px;background:${C.c1};color:${C.c2}`;
    const b = $("#title .b"); b.style.display = ""; b.textContent = C.t2; b.style.cssText = `font-size:60px;background:${C.c2};color:${C.c1}`;
    tl.set("#title", { opacity: 1, y: 0 }, 0).to("#title", { opacity: 0, y: -50, duration: .3 }, 1.2);
    const S = [["split", 0, st.l1 - .7, "50% 55%"], ["race", st.l1 - .7, st.r1 - .7, "60% 55%"], ["bank", st.v1 - .7, st.l3 - .7, "50% 55%"],
               ["cha2", st.l3 - .7, st.l4 - .7, "50% 60%"], ["bed2", st.l4 - .7, st.z5 - .7, "55% 55%"], ["kam", st.z5 - .7, en.end + .3, "50% 45%"]];
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
