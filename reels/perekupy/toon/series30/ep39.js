// ОТДЕЛЬНАЯ СЕРИЯ (не про Толяна, владелец 10.11): «60 секунд на осмотр». Начало (владелец): Вика полгода ищет машину сыну Дане и ставит бот «Перехват».
// Дальше — аэропорт: продавец Арнольд улетает, у Вики 60 секунд. Приёмы: таймер обратного отсчёта, круглые «лупы» крупного плана (шина, VIN, магнит),
// чек-лист, табло вылетов как поворот, финал — ключи Дане. Бот: как нашла машину + рычаг торга («рынок ≈ … по 41 объявлению»). Фоны новые: gostinaya, aeroport.
$("#title .a").textContent = E.rubric; $("#title .b").textContent = E.subtitle; $("#tag span").textContent = "осмотр за минуту";
$("#title .a").style.cssText = "font-size:104px;background:#ff3b30;color:#fff"; $("#title .b").style.cssText = "font-size:74px;background:#151515;color:#fff";
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
const PHONE = (id, l, t, w, inner) => `<div class="el" id="${id}" style="left:${l}px;top:${t}px;width:${w}px;z-index:9;background:#0d0e12;border:8px solid #2a2d34;border-radius:44px;padding:22px;box-shadow:0 0 70px rgba(120,180,255,.4);opacity:0">${inner}</div>`;
const BOT = (body, fs = 30) => `<div style="font-family:Onest;font-weight:700;font-size:24px;color:#8b93a3">ПЕРЕХВАТ · бот</div><div style="background:#1c1f26;border-radius:22px;padding:16px 20px;margin-top:10px;font-family:Onest;color:#fff;font-size:${fs}px;line-height:1.45">${body}</div>`;
const SUIT = (id, l, t) => `<div class="el" id="${id}" style="left:${l}px;top:${t}px;width:150px;height:200px;z-index:7;background:#c0392b;border:7px solid #151515;border-radius:22px;box-shadow:inset 0 -18px 0 rgba(0,0,0,.18)"><div style="position:absolute;left:45px;top:-44px;width:46px;height:44px;border:7px solid #151515;border-bottom:none;border-radius:12px 12px 0 0"></div></div>`;
const LENS = (id, inner, ring) => `<div class="el" id="${id}" style="left:330px;top:960px;width:400px;height:400px;z-index:14;border-radius:50%;border:12px solid ${ring};box-shadow:0 0 0 8px #151515, 0 18px 0 8px rgba(0,0,0,.35);overflow:hidden;background:#2b2f37;opacity:0">${inner}</div>`;
const TIRE = `<div style="position:absolute;inset:0;background:radial-gradient(circle at 50% 50%, #9aa3ad 0 22%, #151515 23% 60%, #2b2b2e 61%)"></div><div style="position:absolute;left:60px;top:250px;font-family:'JetBrains Mono';font-weight:800;font-size:44px;color:#e8ecf0;transform:rotate(-8deg)">DOT <b style="color:#ff3b30">2219</b></div>`;
const VIN = `<div style="position:absolute;inset:0;background:#d6dde4"></div><div style="position:absolute;left:40px;top:90px;right:40px;background:#9aa3ad;border:5px solid #151515;border-radius:10px;padding:14px;font-family:'JetBrains Mono';font-weight:800;font-size:30px;color:#151515">VIN<br>WBAPH5…77310</div><div style="position:absolute;left:50px;top:240px;right:50px;background:#f4e7c3;border:5px solid #151515;border-radius:10px;padding:10px;font-family:'JetBrains Mono';font-weight:800;font-size:24px;color:#151515">СТС: …77310 ✅</div>`;
const MAGNET = `<div style="position:absolute;inset:0;background:linear-gradient(160deg,#e8ecf0,#b9c2c9)"></div><div style="position:absolute;left:70px;top:80px;font-family:Unbounded;font-weight:900;font-size:28px;color:#c0392b">ШПАКЛЁВКА ↓</div><div id="mag" style="position:absolute;left:140px;top:150px;width:120px;height:90px;background:#c0392b;border:6px solid #151515;border-radius:14px 14px 40px 40px"></div>`;
const ARNOLD = { coat: "#c9a06b", pants: "#2b2f37", shades: true, hair: "#8a6d48", item: "phone" };
const SON = { jacket: "#ff7a1a", pants: "#2b2f37", hair: "#5b4636", look: "o" };

// 1. дом Вики вечером → рассвет: Даня и автобусы, Вика ставит бот, уведомление
scene("home", "gostinaya");
add("home", hero("perekup", "sn", 640, 880, .76, 7, SON) + hero("vika", "v", -10, 880, .8, 7)
  + `<div class="el" id="dawn" style="left:0;top:0;width:1080px;height:1920px;z-index:2;background:linear-gradient(#ffb37a55,#ffe2b822);opacity:0"></div>`
  + PHONE("flt", 540, 760, 500, BOT(`<b>⚙️ Фильтр</b><br>🚗 BMW E30 · до 1 000 000 ₽<br>🏙 Город: мой<br>🔔 Новое объявление → сразу`, 26))
  + PHONE("ping", 520, 760, 520, BOT(`<b style="color:#ff7a1a">🔥 −3% к рынку</b><br><b>BMW E30 1990 · 950 000 ₽</b><br>📍 парковка аэропорта · «улетаю, срочно»<br>⏱ 1 с после публикации`, 26))
  + stamp("h1", "ПОЛГОДА ПОИСКОВ", 60, 1560, "#ff2da6", "#fff", 50, -3));
// 2. парковка у терминала: 60 секунд
scene("air", "aeroport");
add("air", CAR("car1", "bmw/bmw_34.png", 300, 1190, 640) + hero("perekup", "ar", 640, 860, .8, 7, ARNOLD) + SUIT("suit", 900, 1330) + hero("vika", "v2", -10, 880, .8, 7)
  + hero("perekup", "sn2", 700, 880, .76, 6, { ...SON, look: "grin" })
  + LENS("ln1", TIRE, "#ffd23f") + LENS("ln2", VIN, "#4cd964") + LENS("ln3", MAGNET, "#ff3b30")
  + `<div class="el" id="chk" style="left:40px;top:1600px;z-index:20;background:#0d0e12;border:5px solid #fff;border-radius:18px;padding:10px 18px;font-family:Onest;font-weight:800;font-size:32px;color:#fff;line-height:1.5;opacity:0"><div id="ck1" style="opacity:0">❗ шины 2019</div><div id="ck2" style="opacity:0">✅ VIN = СТС</div><div id="ck3" style="opacity:0">❗ крыло в шпаклёвке</div></div>`
  + PHONE("mkt", 30, 1180, 540, BOT(`<b>BMW E30 1990 · 950 000 ₽</b><br>📊 рынок ≈ 980 000 ₽ (41 объявл.)`, 28))
  + `<div class="el" id="flip" style="left:60px;right:60px;top:420px;z-index:16;background:#0d0e12;border:8px solid #151515;outline:5px solid #3a3d46;border-radius:20px;padding:16px 22px;font-family:'JetBrains Mono';font-weight:800;font-size:46px;color:#ffd23f;box-shadow:0 14px 0 #151515;opacity:0">SU 1402 СОЧИ<br><span id="fl2" style="color:#4cd964">ПОСАДКА</span></div>`
  + stamp("a1s", "ОСМОТР ЗА 60 СЕКУНД", 60, 1560, "#ff2da6", "#fff", 50, -3) + stamp("deal", "−60 000 ₽ ЗА 60 СЕКУНД", 40, 1180, "#4cd964", "#151515", 50, 3)
  + `<div class="ctab" id="cta2" style="top:1300px"><div class="cbig">Бот <span>«Перехват»</span><br>— ссылка в шапке</div><div class="csm">рынок по похожим объявлениям · ~1 с</div></div>`);

$(".stage").insertAdjacentHTML("beforeend", `<div id="clk2">06:04</div>
  <div id="tmr" style="position:absolute;left:620px;right:auto;width:400px;box-sizing:border-box;text-align:center;top:290px;z-index:53;font-family:'JetBrains Mono';font-weight:800;font-size:84px;color:#ff3b30;background:#0d0e12;border:7px solid #ff3b30;border-radius:22px;padding:0 22px;box-shadow:0 0 30px rgba(255,59,48,.6), 0 8px 0 #000;font-variant-numeric:tabular-nums;opacity:0">⏱ 0:60</div>`);
$("#end h2").innerHTML = E.end;
const bub = (line, html, l, t, tx, fs) => { const b = bubble(line, html, l, t, tx); if (fs) b.style.fontSize = fs + "px"; return b; };
bub("d1", "Мам, я опять полтора часа<br><em>на автобусе…</em>", 380, 700, 420, 40);
bub("v0", "Всё.<br><em>Ставлю «Перехват».</em>", 30, 700, 128, 44);
bub("a1", "У меня самолёт!<br><em>Минута — и я уехал.</em>", 420, 720, 388, 42);
bub("v1", "Шины 2019 года.<br><em>Минус двадцать.</em>", 40, 720, 118, 44);
bub("a2", "Сорок секунд!", 600, 740, 208, 48);
bub("v2", "Номер совпадает.<br><em>Дальше.</em>", 40, 720, 118, 44);
bub("v3", "Магнит не держится.<br><em>Крыло крашеное.</em>", 40, 720, 118, 42);
bub("v4", "С крылом и шинами —<br><em>восемьсот девяносто.</em>", 40, 720, 118, 40);
bub("a3", "Да вы что?!", 620, 740, 188, 50);
bub("a4", "…Ладно. Может,<br><em>ещё поторгуемся?</em>", 540, 720, 268, 42);
bub("v5", "Восемьсот девяносто.<br><em>По рукам.</em>", 40, 720, 118, 44);
bub("d2", "Мам…<br><em>это E30?!</em>", 600, 740, 220, 50);

window.build = R => {
  const tl = R.tl, cam = R.camera($("#cam"), { hand: .6 });
  R.grain(.03);
  gsap.set(".scn", { opacity: 0 }); gsap.set("#sc_home", { opacity: 1 });
  const { pop } = common(R, cam, { mood: () => "grin" });
  const talk = (lv, f) => lv > .28 && !(lv < .55 && f % 3 === 2);
  const SW = { air: st.a1 - .7 };
  const SP = [["ar", "arnold"], ["sn", "danya"], ["sn2", "danya"], ["v2", "vika"]];
  // таймер: 60 на «пошло» → 18 на «восемнадцать» → 3 на «три секунды» → стоп; после «по рукам» — «✅ СДЕЛКА»
  const T0 = W("l2", "пошло") + .3, T18 = st.l3 + .2, T3 = st.l4 + .2, TD = en.v5;
  R.hooks.push(t => { const f = Math.floor(t * 30);
    SP.forEach(([p, k]) => { if (document.getElementById(p)) mouth(p, talk((LIP[k] || [])[f] || 0, f) ? "talk" : (k === "arnold" ? (t > st.a4 ? "grin" : "flat") : k === "danya" ? (t > st.d2 - .5 ? "grin" : "o") : "flat")); });
    if (t >= TD) return;
    const v = t < T0 ? 60 : t < T18 ? 60 - 42 * (t - T0) / (T18 - T0) : t < T3 ? 18 - 15 * (t - T18) / (T3 - T18) : 3;
    $("#tmr").textContent = `⏱ 0:${String(Math.ceil(v)).padStart(2, "0")}`; });
  tl.set("#tmr", { textContent: "✅ СДЕЛКА", color: "#4cd964", borderColor: "#4cd964" }, TD); R.sfx("ping", TD, .9);
  const swap = (from, to, at) => {
    tl.set(`#sc_${to}`, { opacity: 1, x: 1080, filter: "blur(14px)" }, at)
      .to(`#sc_${from}`, { x: -1080, filter: "blur(14px)", duration: .35, ease: "power3.in" }, at)
      .to(`#sc_${to}`, { x: 0, filter: "blur(0px)", duration: .38, ease: "power3.out" }, at + .12)
      .set(`#sc_${from}`, { opacity: 0, x: 0, filter: "none" }, at + .5);
    R.sfx("whoosh", at, .6);
  };
  window.MUSIC = { style: "tech", bpm: 118, end: R.dur - 1.2 };
  const ids = E.lines.map(l => l.id);
  for (const l of ["d1", "v0", "a1", "v1", "a2", "v2", "v3", "v4", "a3", "a4", "v5", "d2"]) { const nx = ids[ids.indexOf(l) + 1];
    const cap = l === "v0" || l === "d1" ? SW.air - .05 : 1e9;
    pop("#b_" + l, st[l] - .05, Math.min(en[l] + .9, st[nx] - .1, cap)); }
  const slam = (sel, at, sfx = "impact") => { tl.fromTo(sel, { opacity: 0, scale: 2 }, { opacity: 1, scale: 1, duration: .18, ease: "power4.out", immediateRender: false }, at); R.sfx(sfx, at + .02, .7); };
  const show = (sel, at) => { tl.fromTo(sel, { opacity: 0, scale: .7, y: 60 }, { opacity: 1, scale: 1, y: 0, duration: .35, ease: "back.out(1.8)", immediateRender: false }, at); R.sfx("ping", at - .03, 1); };
  const lens = (sel, at, until) => { tl.fromTo(sel, { opacity: 0, scale: .3, rotation: -20 }, { opacity: 1, scale: 1, rotation: 0, duration: .35, ease: "back.out(2)", immediateRender: false }, at)
    .to(sel, { opacity: 0, scale: .6, duration: .2 }, until); R.sfx("whoosh", at, .5); };

  // 1. дом: Даня и автобусы, «полгода поисков», бот, уведомление на рассвете
  tl.to("#title", { opacity: 0, y: -50, duration: .25 }, 1.4);
  slam("#h1", W("l0", "полгода"), "pop"); tl.to("#h1", { opacity: 0, duration: .15 }, st.v0);
  tl.to("#SN", { x: 500, opacity: 0, duration: .6, ease: "power2.in" }, en.d1 + .4);
  show("#flt", st.v0 + .2); tl.to("#flt", { opacity: 0, duration: .2 }, W("l1", "уведом") - .1);
  tl.to("#dawn", { opacity: 1, duration: .6 }, st.l1);
  tl.fromTo("#clk2", { opacity: 0, y: -30 }, { opacity: 1, y: 0, duration: .25, immediateRender: false }, st.l1 + .3); R.sfx("tick", st.l1 + .3, .8); tl.to("#clk2", { opacity: 0, duration: .15 }, SW.air);
  show("#ping", W("l1", "уведом")); R.sfx("ping", W("l1", "уведом") + .1, .7); R.punch(cam, W("l1", "аэропорт"), .05);
  // 2. аэропорт: старт таймера
  swap("home", "air", SW.air);
  tl.from("#AR", { x: 300, duration: .5, ease: "power2.out" }, SW.air + .3);
  tl.fromTo("#tmr", { opacity: 0, scale: 1.6 }, { opacity: 1, scale: 1, duration: .3, ease: "back.out(2)", immediateRender: false }, W("l2", "60")); R.sfx("impact", W("l2", "60"), .6);
  slam("#a1s", T0 - .3, "boom"); tl.to("#a1s", { opacity: 0, duration: .15 }, st.v1 - .2);
  tl.to("#AR", { x: 120, duration: .4, ease: "power2.out" }, st.v1 - .4);                       // Арнольд отходит — место для луп
  tl.to("#suit", { x: 120, duration: .4, ease: "power2.out" }, st.v1 - .4);
  // проверки: шины → VIN → магнит; чек-лист копится
  tl.to("#chk", { opacity: 1, duration: .2 }, st.v1);
  lens("#ln1", st.v1 - .2, en.v1 + .4); tl.to("#ck1", { opacity: 1, duration: .15 }, W("v1", "минус")); R.sfx("clack", W("v1", "минус"), .6);
  R.punch(cam, st.a2 + .05, .05);
  lens("#ln2", st.v2 - .2, en.v2 + .3); tl.to("#ck2", { opacity: 1, duration: .15 }, W("v2", "совпад")); R.sfx("ping", W("v2", "совпад"), .6);
  lens("#ln3", st.v3 - .2, en.v3 + .4); tl.to("#mag", { y: 130, rotation: 35, duration: .5, ease: "power2.in" }, W("v3", "держ")); R.sfx("pop", W("v3", "держ") + .4, .6);
  tl.to("#ck3", { opacity: 1, duration: .15 }, W("v3", "крыл")); R.sfx("clack", W("v3", "крыл"), .6);
  tl.to("#chk", { opacity: 0, duration: .2 }, st.l3 + .3);
  // торг: бот в кармане
  show("#mkt", W("l3", "откры")); tl.to("#mkt", { opacity: 0, duration: .2 }, st.a3);
  tl.to("#AR", { x: 0, duration: .3 }, st.a3 - .4).to("#suit", { x: 0, duration: .3 }, st.a3 - .4);
  R.shake(cam, st.a3 + .05, .4, .3);
  // табло: рейс задержан
  show("#flip", W("l4", "табло") - .2);
  tl.set("#fl2", { textContent: "ЗАДЕРЖАН · +3 ЧАСА", color: "#ff3b30" }, W("l4", "табло") + .3);
  tl.fromTo("#flip", { rotationX: 0 }, { rotationX: 360, duration: .5, ease: "power2.inOut", immediateRender: false }, W("l4", "табло")); R.sfx("clack", W("l4", "табло") + .3, .9);
  tl.to("#flip", { opacity: 0, duration: .2 }, st.v5);
  // по рукам → Даня; плашка и финальная карточка
  tl.to(["#AR", "#suit"], { x: 520, opacity: 0, duration: .6, ease: "power2.in" }, en.v5 + .2);
  tl.fromTo("#SN2", { x: 500, opacity: 0 }, { x: 0, opacity: 1, duration: .5, ease: "power2.out", immediateRender: false }, st.d2 - .7); R.sfx("whoosh", st.d2 - .7, .4);
  tl.set("#SN2", { opacity: 0 }, 0);
  slam("#deal", W("end", "минус"), "impact");
  tl.fromTo("#cta2", { opacity: 0, y: 80, scale: .9 }, { opacity: 1, y: 0, scale: 1, duration: .4, ease: "back.out(1.6)", immediateRender: false }, W("end", "подпиш") - .3);
  tl.to("#tmr", { opacity: 0, duration: .2 }, en.end + .1);
  ending(R, en.end + .3);
};
