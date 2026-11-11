// ОТДЕЛЬНАЯ СЕРИЯ (не про Толяна, владелец 12.11): «Продаю сам» — рубрика «Схемы»: перекуп под видом собственника.
// Таксист Лёха → «Солярис, продаю сам, один хозяин» → по телефону Эрик оговаривается «вам какой из них?» → перемотка ⏪ → на стоянке пять
// одинаковых Солярисов → ПТС-гармошка: шесть владельцев, Эрика нет → Лёха ставит «Перехват», ночью на смене — свежий Солярис от лётчика Максима,
// в ПТС один владелец. Приёмы (новые): перемотка назад; пять одинаковых машин; ПТС-гармошка; монтаж вперемешку «такси ↔ стоянка».
// Фоны новые: taxiin, stoyanka, ploshchadka.
$("#title .a").textContent = E.rubric; $("#title .b").textContent = E.subtitle; $("#tag span").textContent = "схемы";
$("#title .a").style.cssText = "font-size:96px;background:#ffd23f;color:#151515"; $("#title .b").style.cssText = "font-size:92px;background:#ff3b30;color:#fff";
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
const hero = (p, l, t, s, o, z = 6) => `<div class="c" id="${p.toUpperCase()}" style="left:${l}px;top:${t}px;z-index:${z};transform-origin:0 0;transform:scale(${s})">${CHARS.perekup(p, o)}</div>`;
const stamp = (id, text, l, t, bg, fg = "#fff", fs = 60, rot = -4) => `<div class="stamp2" id="${id}" style="left:${l}px;top:${t}px;background:${bg};color:${fg};font-size:${fs}px;transform:rotate(${rot}deg)">${text}</div>`;
const CAR = (id, img, l, t, w, z = 5, extra = "") => `<img class="pcar" id="${id}" src="../../kit/img/${img}" style="left:${l}px;top:${t}px;width:${w}px;z-index:${z};${extra}">`;
const PHONE = (id, l, t, w, inner) => `<div class="el" id="${id}" style="left:${l}px;top:${t}px;width:${w}px;z-index:12;background:#0d0e12;border:8px solid #2a2d34;border-radius:44px;padding:22px;box-shadow:0 0 70px rgba(120,180,255,.4);opacity:0">${inner}</div>`;
const BOT = (body, fs = 30) => `<div style="font-family:Onest;font-weight:700;font-size:24px;color:#8b93a3">ПЕРЕХВАТ · бот</div><div style="background:#1c1f26;border-radius:22px;padding:16px 20px;margin-top:10px;font-family:Onest;color:#fff;font-size:${fs}px;line-height:1.42">${body}</div>`;
const AD = `<div style="background:#fff;border-radius:22px;padding:14px;font-family:Onest;color:#151515"><div style="height:120px;border-radius:14px;background:#cfe3f2;display:flex;align-items:center;justify-content:center"><img src="../../kit/img/hyundai/hyundai.png" style="width:86%"></div>
  <div style="font-family:Unbounded;font-weight:900;font-size:28px;margin-top:10px">Hyundai Solaris 2017</div><div style="font-family:Unbounded;font-weight:900;font-size:34px">790 000 ₽</div>
  <div style="font-weight:800;font-size:24px;margin-top:6px">«Продаю сам, один хозяин» 📞</div></div>`;
// руль и край приборки — поверх водителя
const DASH = (id, t) => `<svg class="el" id="${id}" style="left:0;top:0;width:1080px;height:1920px;z-index:9" viewBox="0 0 1080 1920"><path d="M0 1400 Q540 1300 1080 1400 L1080 1920 L0 1920 Z" fill="#23262d" stroke="#000" stroke-width="8"/>
  <circle cx="540" cy="1420" r="250" fill="none" stroke="#151515" stroke-width="56"/><path d="M540 1420 v170 M360 1440 h-110 M720 1440 h110" stroke="#151515" stroke-width="40"/><circle cx="540" cy="1420" r="64" fill="#2b2f37" stroke="#000" stroke-width="6"/>
  <rect x="60" y="1460" width="250" height="80" rx="14" fill="#0d0e12" stroke="#3a3d46" stroke-width="5"/><text x="185" y="1513" text-anchor="middle" font-family="JetBrains Mono" font-weight="800" font-size="36" fill="#5ac8fa">${t}</text></svg>`;
const PTS = (id, l, t, w, rows, ok) => `<div class="el pts" id="${id}" style="left:${l}px;top:${t}px;width:${w}px"><div class="ph2">ПТС · владельцы</div>
  ${rows.map((r, k) => `<div class="pr2" id="${id}_r${k}" style="background:${k % 2 ? "#e4f0de" : "#d6e9cf"};transform:skewY(${k % 2 ? 2 : -2}deg)">${k + 1}. ${r}</div>`).join("")}
  <div class="pv" id="${id}_v" style="background:${ok ? "#4cd964" : "#ff3b30"};color:${ok ? "#151515" : "#fff"}">${ok || "Эрика в ПТС — нет"}</div></div>`;
const FIVE = ["", "filter:brightness(.35)", "filter:grayscale(1) brightness(.75)", "filter:sepia(1) saturate(5) hue-rotate(-30deg) brightness(.85)", "filter:sepia(1) saturate(4) hue-rotate(180deg) brightness(.8)"];
const LYOHA = { jacket: "#ffd23f", pants: "#2b2f37", hair: "#3a2d22", cap: "#151515", item: "phone" };
const ERIK = { jacket: "#5a2a6a", pants: "#151515", shades: true, chain: true, hair: "#151515", item: "phone" };
const MAKSIM = { jacket: "#1f2f5a", pants: "#1f2f5a", police: true, tie: "#151515", hair: "#6b4a2b" };

// такси: два захода (23:47 и 03:10) — разные слои часов
scene("taxi", "taxiin");
add("taxi", hero("ly1", 330, 700, 1.0, LYOHA, 5) + DASH("d1", "23:47") + DASH("d2", "03:10")
  + PHONE("ad", 650, 680, 400, AD)
  + PHONE("ping", 650, 680, 410, BOT(`<b style="color:#ff7a1a">🔥 −9% к рынку</b><br><b>Hyundai Solaris 2018 · 760 000 ₽</b><br>«продаю сам, в ПТС я, переезжаю»<br>⏱ 1 с после публикации`, 24)));
// стоянка: Эрик и «его» Солярис → перемотка → пять машин → ПТС
scene("lot", "stoyanka");
add("lot", FIVE.map((f, k) => CAR("s" + k, "hyundai/hyundai.png", -10 + k * 220, 1250 + (k % 2) * 30, 280, 4 + (k % 2), f)).join("")
  + CAR("s_one", "hyundai/hyundai.png", 400, 1180, 560, 3) + hero("er", 600, 760, .85, ERIK) + hero("ly2", -10, 800, .8, { ...LYOHA, item: "" })
  + PTS("pts1", 300, 720, 450, ["Иванов", "Ахметов", "ООО «Лизинг»", "Петров", "Сидорова", "Кузин"])
  + stamp("five", "ОДИН ХОЗЯИН — ПЯТЬ МАШИН", 40, 1480, "#ff3b30", "#fff", 44, -3)
  + stamp("gap", "КУПИЛ 600 → ПРОДАЁТ 790 · +190 000", 30, 1440, "#ffd23f", "#151515", 36, -2)
  + stamp("dtp", "ИСТОРИЯ АВАРИЙ — ?", 60, 1550, "#ff3b30", "#fff", 40, 2)
  + `<div class="el vhs" id="vhs"></div><div class="el rew" id="rew">⏪ REW</div>`);
// рассвет: лётчик Максим, ПТС один владелец; финал
scene("dawn", "ploshchadka");
add("dawn", CAR("mx_car", "hyundai/hyundai.png", 360, 1180, 640, 3) + hero("mx", 640, 760, .82, MAKSIM) + hero("ly3", 20, 780, .8, { ...LYOHA, item: "" })
  + PTS("pts2", 330, 1250, 460, ["Громов Максим"], "✅ владелец — продавец")
  + `<div class="ctab" id="cta2" style="top:1330px"><div class="cbig">Бот <span>«Перехват»</span><br>— ссылка в шапке</div><div class="csm">свежие объявления за ~1 с · даже ночью</div></div>`);
$("#end h2").innerHTML = E.end;

const bub = (line, html, l, t, tx, fs) => { const b = bubble(line, html, l, t, tx); if (fs) b.style.fontSize = fs + "px"; return b; };
bub("y1", "Продаю сам, один хозяин…<br><em>Звоню!</em>", 40, 600, 380, 36);
bub("e1", "Да, сам езжу, один хозяин.<br><em>Машина как родная.</em>", 280, 640, 470, 34);
bub("y2", "А цвет какой —<br><em>белый?</em>", 40, 600, 380, 44);
bub("e2", "Белый, серый, чёрный —<br><em>вам какой из них?..</em>", 280, 640, 470, 36);
bub("e3", "…вам какой<br><em>из них?..</em>", 380, 640, 370, 44);
bub("y3", "Спасибо.<br><em>Я подумаю.</em>", 20, 640, 128, 36);
bub("e4", "Брат, да какая разница,<br><em>на кого записан?</em>", 420, 600, 420, 32);
bub("m1", "Лечу в Мурманск.<br><em>В ПТС один владелец — я.</em>", 420, 640, 300, 34);
bub("y4", "Беру!", 40, 660, 128, 60);

window.build = R => {
  const tl = R.tl, cam = R.camera($("#cam"), { hand: .6 });
  R.grain(.03);
  gsap.set(".scn", { opacity: 0 }); gsap.set("#sc_taxi", { opacity: 1 });
  const { pop } = common(R, cam);
  const talk = (lv, f) => lv > .28 && !(lv < .55 && f % 3 === 2);
  const SP = { ly1: "lyoha", ly2: "lyoha", ly3: "lyoha", er: "erik", mx: "maksim" };
  const mood = (k, t) => k === "erik" && t > en.e2 - .2 && t < st.l2 ? "o" : "grin";
  R.hooks.push(t => { const f = Math.floor(t * 30);
    for (const [p, k] of Object.entries(SP)) if (document.getElementById(p)) mouth(p, talk((LIP[k] || [])[f] || 0, f) ? "talk" : mood(k, t)); });
  window.MUSIC = { style: "detective", bpm: 100, end: R.dur - 1.2 };
  const ids = E.lines.map(l => l.id), nxt = l => ids[ids.indexOf(l) + 1];
  // жёсткие склейки такси ↔ стоянка (монтаж вперемешку), потом свайпы
  const CUT = { lot1: st.e1 - .3, taxi2: st.y2 - .25, lot2: st.e2 - .25, taxi3: st.l4 - .35, dawn: st.m1 - .6 };
  const ends = Object.values(CUT).sort((a, b) => a - b);
  for (const l of ["y1", "e1", "y2", "e2", "e3", "y3", "e4", "m1", "y4"]) {
    const cap = ends.find(x => x > st[l]) ?? 1e9, n = nxt(l);
    pop("#b_" + l, st[l] - .05, Math.min(en[l] + .9, n ? st[n] - .1 : en[l] + 1, cap - .05));
  }
  const cut = (from, to, at) => { tl.set(`#sc_${to}`, { opacity: 1 }, at).set(`#sc_${from}`, { opacity: 0 }, at); R.sfx("clack", at, .6); R.flash(at, .3, .1); };
  const swap = (from, to, at) => {
    tl.set(`#sc_${to}`, { opacity: 1, x: 1080, filter: "blur(14px)" }, at)
      .to(`#sc_${from}`, { x: -1080, filter: "blur(14px)", duration: .35, ease: "power3.in" }, at)
      .to(`#sc_${to}`, { x: 0, filter: "blur(0px)", duration: .38, ease: "power3.out" }, at + .12)
      .set(`#sc_${from}`, { opacity: 0, x: 0, filter: "none" }, at + .5);
    R.sfx("whoosh", at, .6);
  };
  const show = (sel, at) => { tl.fromTo(sel, { opacity: 0, scale: .7, y: 60 }, { opacity: 1, scale: 1, y: 0, duration: .35, ease: "back.out(1.8)", immediateRender: false }, at); R.sfx("ping", at - .03, 1); };
  const hide = (sel, at) => tl.to(sel, { opacity: 0, duration: .2 }, at);
  const slam = (sel, at, sfx = "impact") => { tl.fromTo(sel, { opacity: 0, scale: 2 }, { opacity: 1, scale: 1, duration: .18, ease: "power4.out", immediateRender: false }, at); R.sfx(sfx, at + .02, .7); };
  gsap.set(["#d2", "#LY2", ".pts", ".pr2", ".pv", "#vhs", "#rew", ...FIVE.map((_, k) => "#s" + k)], { opacity: 0 });

  // 1. такси 23:47: объявление
  tl.to("#title", { opacity: 0, y: -50, duration: .25 }, 1.7);
  show("#ad", .5); hide("#ad", st.l0 + 1.2);
  // 2–3. стоянка ↔ такси: звонок и оговорка
  cut("taxi", "lot", CUT.lot1);
  cut("lot", "taxi", CUT.taxi2);
  cut("taxi", "lot", CUT.lot2);
  R.shake(cam, W("e2", "вам") + .1, .3, .3);
  // 4. перемотка: VHS-полосы, «⏪ REW», картинка дёргается
  const rw = st.l1 + .1;
  tl.set(["#vhs", "#rew"], { opacity: 1 }, rw).set(["#vhs", "#rew"], { opacity: 0 }, en.e3 + .3);
  tl.fromTo("#sc_lot", { x: 0 }, { x: 14, duration: .05, yoyo: true, repeat: 9, ease: "none", immediateRender: false }, rw);
  R.sfx("glitch", rw, .8); R.sfx("scan", rw + .3, .7);
  tl.fromTo(cam, { s: 1 }, { s: 1.2, duration: (en.e3 - st.e3) + .4, ease: "power1.inOut", immediateRender: false }, st.e3 - .2).to(cam, { s: 1, duration: .3 }, en.e3 + .3);
  // 5. отъезд: пять Солярисов
  tl.to(["#s_one"], { opacity: 0, duration: .2 }, st.l2 - .2);
  tl.to("#ER", { x: -220, y: 40, scale: .82 * .82, duration: .5, ease: "power2.inOut" }, st.l2 - .3);
  FIVE.forEach((_, k) => { tl.fromTo("#s" + k, { opacity: 0, x: 120 }, { opacity: 1, x: 0, duration: .25, ease: "back.out(1.6)", immediateRender: false }, st.l2 + .1 + k * .15); R.sfx("pop", st.l2 + .1 + k * .15, .4); });
  slam("#five", W("l2", "пять"), "boom");
  // 6. ПТС-гармошка: Лёха пришёл, строки раскладываются вниз
  hide("#five", st.l3 + .5); FIVE.forEach((_, k) => hide("#s" + k, st.l3 + .5)); tl.to("#s_one", { opacity: 1, duration: .2 }, st.l3 + .5);
  tl.to("#ER", { x: 160, y: 20, scale: .75 / .85 * .85, duration: .4 }, st.l3 - .3);
  tl.fromTo("#LY2", { opacity: 0, x: -200 }, { opacity: 1, x: 0, duration: .4, immediateRender: false }, st.l3 - .3);
  tl.to("#pts1", { opacity: 1, duration: .15 }, W("l3", "птс") - .1);
  [0, 1, 2, 3, 4, 5].forEach(k => { tl.fromTo("#pts1_r" + k, { opacity: 0, y: -30 }, { opacity: 1, y: 0, duration: .15, immediateRender: false }, W("l3", "шест") + k * .18); R.sfx("tap", W("l3", "шест") + k * .18, .5); });
  slam("#pts1_v", W("l3", "эрик"), "impact");
  // «какая разница?» — разница в деньгах и в истории машины
  tl.to("#pts1", { opacity: 0, duration: .2 }, st.l3b);
  slam("#gap", W("l3b", "600"), "impact"); slam("#dtp", W("l3b", "ездил") - .6, "boom");
  hide(["#gap", "#dtp"], CUT.taxi3 - .05);
  // 7. такси 03:10: бот
  cut("lot", "taxi", CUT.taxi3);
  tl.set("#d1", { opacity: 0 }, CUT.taxi3).set("#d2", { opacity: 1 }, CUT.taxi3);
  tl.fromTo("#sc_taxi", { filter: "brightness(1)" }, { filter: "brightness(.75)", duration: .01, immediateRender: false }, CUT.taxi3);
  show("#ping", W("l4", "солярис")); R.sfx("ping", W("l4", "солярис") + .1, .9); R.punch(cam, W("l4", "секунд"), .06);
  // 8–9. рассвет: Максим, ПТС один владелец; финал
  swap("taxi", "dawn", CUT.dawn);
  tl.to("#pts2", { opacity: 1, duration: .15 }, W("m1", "птс") - .1); tl.fromTo("#pts2_r0", { opacity: 0, y: -30 }, { opacity: 1, y: 0, duration: .2, immediateRender: false }, W("m1", "владел"));
  slam("#pts2_v", W("m1", "я") + .1, "ping");
  hide(["#pts2", "#MX"], st.end - .2);
  tl.fromTo("#cta2", { opacity: 0, y: 80, scale: .9 }, { opacity: 1, y: 0, scale: 1, duration: .4, ease: "back.out(1.6)", immediateRender: false }, W("end", "подпиш") - .3);
  ending(R, en.end + .3);
};
