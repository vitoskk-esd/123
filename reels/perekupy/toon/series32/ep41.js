// МОУШН-ОБЗОР «Как работает Перехват» (владелец 10.11: «вариант только с инфографикой, со вставками и красивыми переходами»).
// Под готовую озвучку Achird (1:27). Один холст, 13 глав (~6–7 с), на каждую мысль свой образ; переходы — наезд «сквозь», шторка-круг,
// сдвиг со смазом; рамка «монитора» (уголки, номер главы, прогресс). Места под видео владельца — экраны телефона (#scr1, #scr2).
document.querySelector("#cam > svg#bg")?.remove();
["#tag", "#lisb", "#title"].forEach(s => { const e = $(s); if (e) e.style.display = "none"; });
const W = (line, pre, n = 0) => {
  const norm = s => s.toLowerCase().replace(/ё/g, "е").replace(/[^а-я0-9a-z]/g, "");
  const hits = (TT.words[line] || []).filter(w => norm(w[0]).startsWith(norm(pre)));
  return hits[n] ? hits[n][1] : st[line];
};
const O = "#ff7a1a", Y = "#ffd23f", G = "#4cd964", R_ = "#ff3b30", INK = "#0c0d10", CARD = "#1a1d24";
const SC = document.createElement("div"); SC.id = "canvas"; SC.style.cssText = "position:absolute;inset:0"; $("#scene").appendChild(SC);
SC.insertAdjacentHTML("beforeend", BGS.ink.replace('id="bg"', 'id="bg_ink"'));
const grp = (id, html) => SC.insertAdjacentHTML("beforeend", `<div class="g" id="${id}" style="position:absolute;inset:0;opacity:0">${html}</div>`);
const el = (id, css, html = "") => `<div id="${id}" style="position:absolute;${css}">${html}</div>`;
const H = (id, text, top, fs = 92, color = "#fff", extra = "") => el(id, `left:50px;right:50px;top:${top}px;text-align:center;font-family:Unbounded;font-weight:900;font-size:${fs}px;line-height:1.05;color:${color};opacity:0;${extra}`, text);
const MONO = "font-family:'JetBrains Mono';font-weight:800";
const chip = (id, text, l, t, bg = CARD, fg = "#fff", fs = 34, bd = "#2a2e38") => el(id, `left:${l}px;top:${t}px;background:${bg};color:${fg};border:4px solid ${bd};border-radius:20px;padding:12px 22px;font-family:Unbounded;font-weight:800;font-size:${fs}px;white-space:nowrap;opacity:0`, text);
const phone = (id, l, t, w, inner) => el(id, `left:${l}px;top:${t}px;width:${w}px;height:${w * 2}px;background:#000;border:12px solid #2a2e38;border-radius:${w * .14}px;box-shadow:0 0 90px rgba(255,122,26,.35);overflow:hidden;opacity:0`, inner);
const botcard = (id, body, fs = 30) => `<div id="${id}" style="margin:14px;background:${CARD};border-radius:22px;padding:16px 20px;font-family:Onest;color:#fff;font-size:${fs}px;line-height:1.45">${body}</div>`;

// ── 1. титул
grp("g1", el("logo", "left:390px;top:330px;width:300px;height:300px;border-radius:50%;overflow:hidden;border:10px solid " + O + ";box-shadow:0 0 80px rgba(255,122,26,.5);opacity:0", `<img src="../../brand/fox_cut.png" style="width:100%;height:100%;object-fit:cover;background:#000">`)
  + H("t1a", "КАК РАБОТАЕТ", 720, 84, "#fff", "white-space:nowrap") + H("t1b", "«ПЕРЕХВАТ»", 840, 100, O, "white-space:nowrap")
  + H("t1c", "и почему машины<br>приходят <span style='color:" + Y + "'>не сразу</span>", 1040, 56, "#c9ced8"));
// ── 2. сотни каналов
const CH = ["✈️ Авто Москва", "🟦 Авторынок ВК", "✈️ Перекупы РФ", "✈️ Тачки 77", "🟦 Барахолка авто", "✈️ Авто за 300к", "✈️ Пригон ДВ", "🟦 Машины СПб", "✈️ Битые авто", "🟦 Авто Казань", "✈️ Срочный выкуп", "✈️ Авто с пробегом"];
grp("g2", H("t2a", "СОТНИ<br><span style='color:" + O + "'>КАНАЛОВ</span>", 300, 110)
  + CH.map((c, i) => chip("ch" + i, c, 40 + (i % 2) * 510, 640 + Math.floor(i / 2) * 120, CARD, "#fff", 28)).join("")
  + H("t2b", "TELEGRAM + ВКОНТАКТЕ", 1420, 52, Y));
// ── 3. объявление → фильтр → тебе
grp("g3", H("t3a", "ЗА <span style='color:" + O + "'>1 СЕКУНДУ</span>", 260, 96)
  + el("post", `left:60px;top:560px;width:420px;background:${CARD};border:4px solid #2a2e38;border-radius:24px;padding:18px;opacity:0`, `<div style="height:170px;border-radius:14px;background:linear-gradient(135deg,#3a4152,#22262f)"></div><div style="margin-top:12px;font-family:Onest;font-weight:800;font-size:30px;color:#fff">Toyota Camry 2012</div><div style="${MONO};font-size:30px;color:${Y}">950 000 ₽</div>`)
  + el("funnel", `left:120px;top:1010px;width:300px;opacity:0`, `<svg viewBox="0 0 300 260" style="width:100%"><path d="M10 10 H290 L180 150 V250 H120 V150 Z" fill="${O}" stroke="#000" stroke-width="8"/></svg><div style="position:absolute;left:0;right:0;top:36px;text-align:center;font-family:Unbounded;font-weight:900;font-size:25px;color:#151515">ТВОЙ<br>ФИЛЬТР</div>`)
  + phone("ph1", 560, 600, 440, `<div id="scr1" style="position:absolute;inset:0;background:#0d0e12"></div>` + `<div id="nt1" style="position:absolute;left:0;right:0;top:120px;opacity:0">` + botcard("bc1", `<div style="font-size:22px;color:#8b93a3;font-weight:700">ПЕРЕХВАТ · бот</div><b style="color:${O}">🔥 −22% к рынку</b><br><b>Toyota Camry 2012</b><br>950 000 ₽ · 📍 Москва<br>⏱ 1 с после публикации`, 28) + `</div>`)
  + el("tm1", `left:600px;top:1540px;${MONO};font-size:64px;color:${G};opacity:0`, "⏱ 0:01"));
// ── 4. только новые
grp("g4", H("t4a", "ТОЛЬКО<br><span style='color:" + Y + "'>НОВЫЕ</span>", 260, 120)
  + el("tline", `left:60px;top:1000px;width:960px;height:10px;background:#2a2e38;border-radius:5px;opacity:0`)
  + el("mark", `left:520px;top:860px;width:40px;height:300px;opacity:0`, `<div style="margin:0 auto;width:10px;height:300px;background:${O};border-radius:5px"></div>`)
  + el("markt", `left:340px;top:1180px;width:400px;text-align:center;font-family:Unbounded;font-weight:900;font-size:34px;color:${O};opacity:0`, "ТЫ НАСТРОИЛ<br>ФИЛЬТР")
  + [["o1", 70, 760, "вчера"], ["o2", 270, 900, "3 дня назад"]].map(([id, l, t, txt]) => el(id, `left:${l}px;top:${t}px;width:190px;background:${CARD};border:4px solid #3a3f4b;border-radius:18px;padding:14px;text-align:center;font-family:Onest;font-weight:800;font-size:24px;color:#8b93a3;opacity:0`, `🚗<br>${txt}<div class="x" style="font-size:60px;color:${R_};opacity:0">✕</div>`)).join("")
  + [["n1", 620, 760, "через 2 мин"], ["n2", 820, 900, "через 3 часа"]].map(([id, l, t, txt]) => el(id, `left:${l}px;top:${t}px;width:190px;background:${CARD};border:4px solid ${G};border-radius:18px;padding:14px;text-align:center;font-family:Onest;font-weight:800;font-size:24px;color:#fff;opacity:0`, `🚗<br>${txt}<div style="font-size:52px">✅</div>`)).join("")
  + H("t4b", "старые посты бот <span style='color:" + R_ + "'>не пересылает</span>", 1420, 46, "#c9ced8"));
// ── 5. в чате тихо
grp("g5", H("t5a", "В ЧАТЕ ТИХО —<br><span style='color:" + G + "'>ЭТО НОРМАЛЬНО</span>", 260, 80)
  + el("chat", `left:90px;top:620px;width:900px;height:460px;background:${CARD};border:5px solid #2a2e38;border-radius:36px;opacity:0`, `<div style="padding:22px 30px;font-family:Onest;font-weight:800;font-size:30px;color:#8b93a3;border-bottom:3px solid #2a2e38">ПЕРЕХВАТ · бот</div><div id="dots" style="margin:120px auto 0;width:200px;text-align:center;font-family:Unbounded;font-weight:900;font-size:110px;color:#5b6068;letter-spacing:12px">···</div>`)
  + el("clock", `left:390px;top:1140px;width:300px;height:300px;border-radius:50%;border:14px solid ${O};opacity:0`, `<div id="hand" style="position:absolute;left:136px;top:30px;width:14px;height:120px;background:#fff;border-radius:7px;transform-origin:50% 100%"></div><div style="position:absolute;left:128px;top:128px;width:30px;height:30px;border-radius:50%;background:#fff"></div>`)
  + chip("w1", "ПАРА МИНУТ", 60, 1500, Y, "#151515", 40, "#000") + chip("w2", "…ИЛИ ПАРА ЧАСОВ", 520, 1500, O, "#fff", 40, "#000"));
// ── 6. фильтр шире
grp("g6", H("t6a", "СДЕЛАЙ ФИЛЬТР<br><span style='color:" + O + "'>ПОШИРЕ</span>", 260, 88)
  + chip("f1", "🔎 Камри 2012 · до 900 000 ₽", 60, 620, CARD, "#8b93a3", 34) + chip("f2", "🔎 Камри от 2012 · до 1 000 000 ₽", 60, 760, CARD, "#fff", 34, G)
  + el("bars", `left:140px;top:960px;width:800px;height:460px;opacity:0`, `<div style="position:absolute;left:80px;bottom:60px;width:240px;height:400px;display:flex;align-items:flex-end"><div id="b1" style="width:100%;height:12%;background:#5b6068;border-radius:16px 16px 0 0"></div></div><div style="position:absolute;left:480px;bottom:60px;width:240px;height:400px;display:flex;align-items:flex-end"><div id="b2" style="width:100%;height:12%;background:${G};border-radius:16px 16px 0 0"></div></div><div style="position:absolute;left:0;right:0;bottom:0;display:flex;justify-content:space-around;font-family:Unbounded;font-weight:800;font-size:28px;color:#c9ced8"><span>узкий</span><span>широкий</span></div>`)
  + H("t6b", "ЧЕМ УЖЕ — ТЕМ <span style='color:" + R_ + "'>РЕЖЕ</span>", 1480, 54) + el("ex", `right:60px;top:1440px;${MONO};font-size:24px;color:#5b6068;opacity:0`, "пример"));
// ── 7. несколько фильтров + пауза
const FL = [["🚘 Камри от 2012 · до 1 млн", "🟢"], ["🚘 Солярис · до 700 000", "🟢"], ["🚘 Приора · до 300 000", "🟢"]];
grp("g7", H("t7a", "НЕСКОЛЬКО<br><span style='color:" + Y + "'>ФИЛЬТРОВ</span>", 300, 96)
  + FL.map(([t, s], i) => el("fr" + i, `left:70px;right:70px;top:${700 + i * 170}px;background:${CARD};border:4px solid #2a2e38;border-radius:26px;padding:26px 30px;font-family:Onest;font-weight:800;font-size:36px;color:#fff;display:flex;justify-content:space-between;opacity:0`, `<span>${t}</span><span id="fs${i}">${s}</span>`)).join("")
  + chip("pz", "⏸ ПАУЗА ФИЛЬТРА", 300, 1260, Y, "#151515", 42, "#000"));
// ── 8. что в карточке
grp("g8", H("t8a", "ЧТО В <span style='color:" + O + "'>КАРТОЧКЕ</span>", 230, 92)
  + phone("ph2", 290, 420, 500, `<div id="scr2" style="position:absolute;inset:0;background:#0d0e12"></div><div style="position:absolute;left:0;right:0;top:80px">` + botcard("bc2",
    `<div style="height:200px;border-radius:14px;background:linear-gradient(135deg,#3a4152,#22262f);margin-bottom:12px"></div><b>Toyota Camry 2012</b><br><span id="k1">💰 950 000 ₽</span><br><span id="k2">🛣 180 000 км</span> · <span id="k3">📍 Москва</span><br><span id="k4">📞 +7 999 123-45-67</span>`, 28) + `</div>`)
  + chip("lb1", "ЦЕНА", 40, 1000, Y, "#151515", 36, "#000") + chip("lb2", "ПРОБЕГ", 40, 1120, Y, "#151515", 36, "#000")
  + chip("lb3", "ГОРОД", 830, 1000, Y, "#151515", 36, "#000") + chip("lb4", "КОНТАКТЫ", 760, 1120, Y, "#151515", 36, "#000"));
// ── 9. ПРО: ниже рынка
grp("g9", el("badge", `left:140px;top:640px;width:800px;text-align:center;background:${O};border:10px solid #000;border-radius:40px;padding:40px 0;box-shadow:0 18px 0 #000;font-family:Unbounded;font-weight:900;font-size:110px;color:#fff;opacity:0`, "🔥 −22%")
  + H("t9a", "ДЕШЕВЛЕ <span style='color:" + O + "'>РЫНКА</span>", 1000, 80) + chip("pro", "ТАРИФ ПРО", 360, 380, "#fff", "#151515", 44, "#000")
  + H("t9b", "по похожим объявлениям", 1150, 44, "#8b93a3"));
// ── 10. без дублей
grp("g10", H("t10a", "ОДНА МАШИНА —<br><span style='color:" + G + "'>ОДИН РАЗ</span>", 260, 88)
  + [0, 1, 2].map(i => el("du" + i, `left:${90 + i * 310}px;top:700px;width:280px;background:${CARD};border:4px solid #2a2e38;border-radius:22px;padding:16px;text-align:center;font-family:Onest;font-weight:800;font-size:26px;color:#fff;opacity:0`, `<div style="height:120px;border-radius:12px;background:linear-gradient(135deg,#3a4152,#22262f)"></div>Camry 2012<div style="${MONO};font-size:22px;color:#8b93a3">канал ${i + 1}</div>`)).join("")
  + el("one", `left:380px;top:1180px;${MONO};font-size:120px;color:${G};opacity:0`, "×1"));
// ── 11. Простой vs ПРО
grp("g11", H("t11a", "ПРОСТОЙ <span style='color:#5b6068'>vs</span> <span style='color:" + O + "'>ПРО</span>", 300, 92)
  + [["s", "ПРОСТОЙ", "#5b6068", "⏱ +1 мин"], ["p", "ПРО", O, "⚡ мгновенно"]].map(([k, name, c, tag], i) => el("ln" + k, `left:60px;right:60px;top:${700 + i * 330}px;opacity:0`,
    `<div style="font-family:Unbounded;font-weight:900;font-size:48px;color:#fff">${name} <span style="font-size:36px;color:${c}">${tag}</span></div><div style="margin-top:20px;height:70px;background:${CARD};border:4px solid #2a2e38;border-radius:35px;overflow:hidden"><div id="pb_${k}" style="width:0%;height:100%;background:${c}"></div></div>`)).join(""));
// ── 12. поддержка
const MENU = ["🚘 Фильтры", "📢 Каналы", "📊 Статистика", "💳 Подписка", "❓ Помощь", "✉️ Написать в поддержку"];
grp("g12", H("t12a", "ЧТО-ТО <span style='color:" + Y + "'>НЕПОНЯТНО?</span>", 300, 84)
  + MENU.map((m, i) => el("mn" + i, `left:${60 + (i % 2) * 490}px;top:${700 + Math.floor(i / 2) * 150}px;width:470px;background:${i === 5 ? "#fff" : CARD};color:${i === 5 ? "#151515" : "#fff"};border:4px solid #2a2e38;border-radius:22px;padding:28px 0;text-align:center;font-family:Onest;font-weight:800;font-size:${i === 5 ? 28 : 32}px;opacity:0`, m)).join("")
  + el("cur", `left:900px;top:1500px;font-size:100px;opacity:0`, "👆"));
// ── 13. финал
grp("g13", el("logo2", "left:365px;top:420px;width:350px;height:350px;border-radius:50%;overflow:hidden;border:12px solid " + O + ";box-shadow:0 0 90px rgba(255,122,26,.55);opacity:0", `<img src="../../brand/fox_cut.png" style="width:100%;height:100%;object-fit:cover;background:#000">`)
  + H("t13a", "УДАЧНЫХ<br><span style='color:" + O + "'>ПЕРЕХВАТОВ!</span>", 860, 100)
  + el("cta", `left:70px;right:70px;top:1220px;background:${Y};border:8px solid #000;border-radius:34px;padding:26px;text-align:center;box-shadow:0 14px 0 #000;font-family:Unbounded;font-weight:900;font-size:44px;color:#151515;opacity:0`, "Бот <span style='color:#c0392b'>«Перехват»</span><br>— ссылка в шапке"));

// рамка «монитора»: уголки, глава, прогресс
const CHAP = ["ПРИВЕТ", "КАНАЛЫ", "1 СЕКУНДА", "ТОЛЬКО НОВЫЕ", "ТИШИНА", "ФИЛЬТР ШИРЕ", "НЕСКОЛЬКО ФИЛЬТРОВ", "КАРТОЧКА", "НИЖЕ РЫНКА", "БЕЗ ДУБЛЕЙ", "ТАРИФЫ", "ПОДДЕРЖКА", "ФИНАЛ"];
$(".stage").insertAdjacentHTML("beforeend", `<div id="hud" style="position:absolute;inset:0;pointer-events:none;z-index:60">
  ${[["left:36px;top:36px", "border-left", "border-top"], ["right:36px;top:36px", "border-right", "border-top"], ["left:36px;bottom:36px", "border-left", "border-bottom"], ["right:36px;bottom:36px", "border-right", "border-bottom"]].map(([p, a, b]) => `<div style="position:absolute;${p};width:60px;height:60px;${a}:5px solid #5b6068;${b}:5px solid #5b6068"></div>`).join("")}
  <div style="position:absolute;left:70px;top:70px;${MONO};font-size:24px;color:#8b93a3">ПЕРЕХВАТ · ОБЗОР БОТА</div>
  <div id="hudc" style="position:absolute;right:70px;top:70px;${MONO};font-size:24px;color:${O}">01 / 13</div>
  <div id="hudt" style="position:absolute;left:70px;bottom:92px;${MONO};font-size:26px;color:#c9ced8">01 — ПРИВЕТ</div>
  <div style="position:absolute;left:70px;right:70px;bottom:70px;height:6px;background:#2a2e38;border-radius:3px"><div id="prog" style="width:0%;height:100%;background:${O};border-radius:3px"></div></div></div>`);
$("#end h2").innerHTML = E.end;
// вставки из видео владельца (запись экрана бота): кадры 15 к/с, все <img> декодируются заранее, в хуке показываем нужный
const SEQ = { a: { n: 129, el: "#scr1", t0: () => st.c03 + .1 }, b: { n: 97, el: "#scr2", t0: () => st.c08 + .1 } };
for (const [k, q] of Object.entries(SEQ)) {
  $(q.el).innerHTML = Array.from({ length: q.n }, (_, i) => `<img data-i="${i}" src="vid/${k}/${String(i + 1).padStart(4, "0")}.jpg" style="position:absolute;left:0;top:0;width:100%;display:${i ? "none" : "block"}">`).join("");
  q.imgs = [...document.querySelectorAll(`${q.el} img`)]; q.cur = 0;
}
["#nt1", "#tm1"].forEach(sel => { const e = $(sel); if (e) e.style.display = "none"; });
$("#ph2 > div:nth-child(2)").style.display = "none";

window.build = R => {
  const tl = R.tl, cam = R.camera($("#cam"), { hand: .4 });
  R.grain(.025);
  const ids = E.lines.map(l => l.id), T0 = ids.map(c => st[c]);
  R.hooks.push(t => { let k = 0; for (let i = 0; i < T0.length; i++) if (t >= T0[i] - .4) k = i;
    $("#hudc").textContent = `${String(k + 1).padStart(2, "0")} / 13`; $("#hudt").textContent = `${String(k + 1).padStart(2, "0")} — ${CHAP[k]}`;
    $("#prog").style.width = `${Math.min(100, t / R.dur * 100)}%`;
    const h = $("#hand"); if (h) h.style.transform = `rotate(${t * 140}deg)`;
    for (const q of Object.values(SEQ)) { const i = Math.max(0, Math.min(q.n - 1, Math.floor((t - q.t0()) * 15)));
      if (i !== q.cur) { q.imgs[q.cur].style.display = "none"; q.imgs[i].style.display = "block"; q.cur = i; } } });
  const pop = (sel, at, d = .35) => { tl.fromTo(sel, { opacity: 0, scale: .6, y: 30 }, { opacity: 1, scale: 1, y: 0, duration: d, ease: "back.out(2)", immediateRender: false }, at); R.sfx("pop", at, .45); };
  const rise = (sel, at) => tl.fromTo(sel, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: .4, ease: "power3.out", immediateRender: false }, at);
  const slam = (sel, at) => { tl.fromTo(sel, { opacity: 0, scale: 1.8 }, { opacity: 1, scale: 1, duration: .22, ease: "power4.out", immediateRender: false }, at); R.sfx("impact", at + .02, .6); };
  // переходы: наезд «сквозь», шторка-круг, сдвиг со смазом
  const zoom = (a, b, at) => { tl.to(`#${a}`, { scale: 2.6, opacity: 0, filter: "blur(10px)", duration: .45, ease: "power3.in" }, at)
      .fromTo(`#${b}`, { opacity: 0, scale: .55, filter: "blur(10px)" }, { opacity: 1, scale: 1, filter: "blur(0px)", duration: .5, ease: "power3.out", immediateRender: false }, at + .3); R.sfx("whoosh", at, .6); };
  const iris = (a, b, at) => { tl.set(`#${b}`, { opacity: 1, clipPath: "circle(0% at 50% 50%)", zIndex: 5 }, at)
      .to(`#${b}`, { clipPath: "circle(80% at 50% 50%)", duration: .6, ease: "power2.inOut" }, at).set(`#${a}`, { opacity: 0 }, at + .6).set(`#${b}`, { clearProps: "clipPath,zIndex" }, at + .62); R.sfx("whoosh", at, .5); };
  const push = (a, b, at, dir = 1) => { tl.to(`#${a}`, { x: -1080 * dir, filter: "blur(16px)", duration: .4, ease: "power3.in" }, at)
      .fromTo(`#${b}`, { opacity: 1, x: 1080 * dir, filter: "blur(16px)" }, { x: 0, filter: "blur(0px)", duration: .42, ease: "power3.out", immediateRender: false }, at + .12).set(`#${a}`, { opacity: 0, x: 0, filter: "none" }, at + .5); R.sfx("whoosh", at, .6); };
  window.MUSIC = { style: "tech", bpm: 112, end: R.dur - 1.2 };

  // 1. титул (кадр 0 уже читается)
  tl.set(["#g1", "#t1a", "#t1b"], { opacity: 1 }, 0); tl.set("#logo", { opacity: 1 }, 0);
  tl.fromTo("#logo", { scale: .9 }, { scale: 1.06, duration: .5, yoyo: true, repeat: 1, ease: "sine.inOut", immediateRender: false }, W("c01", "привет"));
  rise("#t1c", W("c01", "почему"));
  // 2. каналы
  zoom("g1", "g2", st.c02 - .5);
  slam("#t2a", W("c02", "сотни"));
  CH.forEach((_, i) => pop("#ch" + i, W("c02", "телеграм") - .3 + i * .12, .3));
  rise("#t2b", W("c02", "вконт"));
  // 3. объявление → фильтр → тебе
  iris("g2", "g3", st.c03 - .5);
  pop("#post", st.c03 + .1); pop("#funnel", W("c03", "сверя") - .4); pop("#ph1", W("c03", "сверя") - .2);
  slam("#t3a", W("c03", "секунд"));
  tl.to("#post", { x: 40, y: 380, scale: .35, opacity: 0, duration: .55, ease: "power2.in" }, W("c03", "сверя"));
  tl.fromTo("#funnel", { scale: 1 }, { scale: 1.12, duration: .15, yoyo: true, repeat: 3, immediateRender: false }, W("c03", "сверя") + .45);
  tl.to("#nt1", { opacity: 1, y: -20, duration: .35, ease: "back.out(2)" }, W("c03", "присыла")); R.sfx("ping", W("c03", "присыла"), .9);
  tl.to("#tm1", { opacity: 1, duration: .2 }, W("c03", "присыла"));
  // 4. только новые
  push("g3", "g4", st.c04 - .5);
  slam("#t4a", W("c04", "только"));
  tl.to(["#tline", "#mark"], { opacity: 1, duration: .3 }, W("c04", "только") + .4); rise("#markt", W("c04", "настроил"));
  pop("#o1", W("c04", "выложи") - .2); pop("#o2", W("c04", "выложи"));
  pop("#n1", W("c04", "после")); pop("#n2", W("c04", "после") + .3);
  tl.to("#o1 .x, #o2 .x", { opacity: 1, duration: .15 }, W("c04", "старые")); tl.to(["#o1", "#o2"], { opacity: .35, duration: .3 }, W("c04", "старые") + .2); R.sfx("clack", W("c04", "старые"), .7);
  rise("#t4b", W("c04", "старые"));
  // 5. тишина
  zoom("g4", "g5", st.c05 - .5);
  rise("#t5a", st.c05); pop("#chat", W("c05", "чате"));
  tl.fromTo("#dots", { opacity: .3 }, { opacity: 1, duration: .5, yoyo: true, repeat: 9, immediateRender: false }, W("c05", "чате") + .3);
  pop("#clock", W("c05", "ждет")); slam("#w1", W("c05", "пара")); slam("#w2", W("c05", "несколько"));
  // 6. фильтр шире
  iris("g5", "g6", st.c06 - .5);
  slam("#t6a", W("c06", "пошире"));
  pop("#f1", W("c06", "камри")); pop("#f2", W("c06", "камри", 1));
  tl.to(["#bars", "#ex"], { opacity: 1, duration: .3 }, W("c06", "камри", 1) + .3);
  tl.to("#b1", { height: "18%", duration: .6, ease: "power2.out" }, W("c06", "уже")); tl.to("#b2", { height: "92%", duration: .9, ease: "power2.out" }, W("c06", "камри", 1) + .5);
  rise("#t6b", W("c06", "уже"));
  // 7. несколько фильтров + пауза
  push("g6", "g7", st.c07 - .5);
  slam("#t7a", W("c07", "несколько")); [0, 1, 2].forEach(i => pop("#fr" + i, W("c07", "несколько") + .2 + i * .18));
  tl.set("#fs1", { textContent: "⏸" }, W("c07", "паузу")); tl.to("#fr1", { opacity: .45, duration: .25 }, W("c07", "паузу")); slam("#pz", W("c07", "паузу")); R.sfx("clack", W("c07", "паузу"), .7);
  // 8. карточка
  zoom("g7", "g8", st.c08 - .5);
  rise("#t8a", st.c08); pop("#ph2", st.c08 + .1);
  [["#lb1", "#k1", "цена"], ["#lb2", "#k2", "пробег"], ["#lb3", "#k3", "город"], ["#lb4", "#k4", "контакт"]].forEach(([lb, k, w]) => { slam(lb, W("c08", w));
    tl.fromTo(k, { backgroundColor: "rgba(255,210,63,0)" }, { backgroundColor: "rgba(255,210,63,.45)", duration: .2, yoyo: true, repeat: 1, immediateRender: false }, W("c08", w)); });
  // 9. ниже рынка (ПРО)
  iris("g8", "g9", st.c09 - .5);
  slam("#pro", W("c09", "тариф")); slam("#badge", W("c09", "насколько")); R.shake(cam, W("c09", "насколько"), .5, .3);
  rise("#t9a", W("c09", "дешевле")); rise("#t9b", W("c09", "рынка"));
  // 10. без дублей
  push("g9", "g10", st.c10 - .5);
  rise("#t10a", st.c10); [0, 1, 2].forEach(i => pop("#du" + i, W("c10", "разных") + i * .15));
  tl.to("#du0", { x: 310, duration: .5, ease: "power2.inOut" }, W("c10", "только")).to("#du2", { x: -310, duration: .5, ease: "power2.inOut" }, W("c10", "только"));
  tl.to(["#du0", "#du2"], { opacity: 0, duration: .2 }, W("c10", "только") + .45); slam("#one", W("c10", "раз"));
  // 11. Простой vs ПРО
  zoom("g10", "g11", st.c11 - .5);
  rise("#t11a", st.c11); rise("#lns", W("c11", "простой")); rise("#lnp", W("c11", "мгновен") - .4);
  tl.to("#pb_s", { width: "100%", duration: 2.2, ease: "none" }, W("c11", "задерж")); tl.to("#pb_p", { width: "100%", duration: .12, ease: "none" }, W("c11", "мгновен")); R.sfx("ping", W("c11", "мгновен"), .9);
  // 12. поддержка
  iris("g11", "g12", st.c12 - .5);
  slam("#t12a", st.c12 + .1); MENU.forEach((_, i) => pop("#mn" + i, st.c12 + .4 + i * .1, .3));
  tl.fromTo("#cur", { opacity: 0, x: 0, y: 0 }, { opacity: 1, x: -200, y: -400, duration: .7, ease: "power2.inOut", immediateRender: false }, W("c12", "жми") - .3);
  tl.fromTo("#mn5", { scale: 1 }, { scale: .92, duration: .1, yoyo: true, repeat: 1, immediateRender: false }, W("c12", "написать")); R.sfx("clack", W("c12", "написать"), .8);
  // 13. финал
  zoom("g12", "g13", st.c13 - .4);
  pop("#logo2", st.c13 - .1); slam("#t13a", st.c13 + .1); rise("#cta", en.c13 + .2);
};
