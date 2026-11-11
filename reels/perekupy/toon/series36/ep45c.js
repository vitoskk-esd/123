// «ТОЛЯН: СО СТА ТЫСЯЧ · 9» — «Машина директора». Капитал 440 000 (итог части 8). У школы всегда пустое место директора: у него отцовский
// Мерседес W124 1994 года — 30 лет под чехлом в школьном гараже; перекупы давали «250, ведро». Толян честно оценивает по боту (вся Россия),
// устраивает торги по телефону — последним звонит Жора (соперник из частей 3–6) и берёт за 1 300 000. Бот находит директору Камри. Комиссия 10%.
// Приёмы (новые): приказ с печатью «УТВЕРЖДАЮ» / «ОБЪЯВИТЬ БЛАГОДАРНОСТЬ»; гараж — капсула времени (чехол слетает, пыль, календарь 1994);
// табло ставок с тремя звонками; поворот — Жора. Фоны новые: kabdir, garazh, stadion.
$("#title .a").textContent = E.rubric; $("#title .b").textContent = E.subtitle; $("#tag span").textContent = "машина директора";
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
const hero = (p, l, t, s, o, z = 6, kind = "perekup") => `<div class="c" id="${p.toUpperCase()}" style="left:${l}px;top:${t}px;z-index:${z};transform-origin:0 0;transform:scale(${s})">${CHARS[kind](p, o)}</div>`;
const tol = (p, l, t, s, z = 6) => hero(p, l, t, s, undefined, z, "tolyan");
const stamp = (id, text, l, t, bg, fg = "#fff", fs = 60, rot = -4) => `<div class="stamp2" id="${id}" style="left:${l}px;top:${t}px;background:${bg};color:${fg};font-size:${fs}px;transform:rotate(${rot}deg)">${text}</div>`;
const CAR = (id, img, l, t, w, z = 5) => `<img class="pcar" id="${id}" src="../../kit/img/${img}" style="left:${l}px;top:${t}px;width:${w}px;z-index:${z}">`;
const PHONE = (id, l, t, w, inner) => `<div class="el" id="${id}" style="left:${l}px;top:${t}px;width:${w}px;z-index:12;background:#0d0e12;border:8px solid #2a2d34;border-radius:44px;padding:22px;box-shadow:0 0 70px rgba(120,180,255,.4);opacity:0">${inner}</div>`;
const BOT = (body, fs = 30) => `<div style="font-family:Onest;font-weight:700;font-size:24px;color:#8b93a3">ПЕРЕХВАТ · бот</div><div style="background:#1c1f26;border-radius:22px;padding:16px 20px;margin-top:10px;font-family:Onest;color:#fff;font-size:${fs}px;line-height:1.42">${body}</div>`;
const ORDER = (id, l, t, rows) => `<div class="el order" id="${id}" style="left:${l}px;top:${t}px"><div class="oh">ПРИКАЗ № 1</div><div class="os">по школе № 12</div>
  ${rows.map((r, k) => `<div class="or" id="${id}_r${k}">${r}</div>`).join("")}<div class="ost" id="${id}_s1">УТВЕРЖДАЮ</div><div class="ost ost2" id="${id}_s2">ОБЪЯВИТЬ<br>БЛАГОДАРНОСТЬ</div></div>`;
const CARDS = () => [["Mercedes W124 · 1994 · «в идеале»", "1 450 000 ₽", "Москва"], ["Mercedes W124 · 1995 · 90 тыс. км", "1 200 000 ₽", "Казань"], ["Mercedes W124 · 1993 · гаражный", "980 000 ₽", "Самара"]]
  .map(([t, p, c], k) => `<div class="el wcard" id="wc${k}" style="left:${430 + k * 30}px;top:${850 + k * 140}px;z-index:${12 + k};transform:rotate(${-4 + k * 4}deg)">
    <small>ПЕРЕХВАТ · вся Россия</small><div>${t}</div><b>${p}</b><i>📍 ${c}</i></div>`).join("");
const ILDAR = { jacket: "#1f4fb8", pants: "#1f4fb8", hair: "#1d1d1f", cap: "#fff" };
const DIR = { jacket: "#2b2f37", pants: "#2b2f37", hair: "#3a2d22", tie: "#c0392b" };
const ZHORA = { jacket: "#1d1d1f", pants: "#2b2f37", cap: "#c0392b", mustache: true, chain: true, hair: "#1d1d1f", item: "phone", look: "grin" };

// 1. стадион: пустое место директора
scene("st1", "stadion");
add("st1", hero("il1", 560, 860, .8, ILDAR) + tol("t1", 40, 860, .8) + stamp("empty", "МЕСТО «ДИРЕКТОР» — ПУСТО", 40, 1440, "#c0392b", "#fff", 44, -3)
  + [0, 1, 2].map(k => `<div class="el runner" id="rn${k}" style="left:${-200 - k * 140}px;top:${900 + k * 20}px">🏃</div>`).join(""));
// 2. кабинет: приказ
scene("kab", "kabdir");
add("kab", hero("dr1", 600, 840, .82, DIR) + tol("t2", 20, 880, .78) + ORDER("ord", 40, 1220, ["1. Продать отцовский Мерседес — честно.", "2. Купить машину, на которой не стыдно."]));
// 3. гараж: капсула времени и веер объявлений
scene("gar", "garazh");
add("gar", CAR("w1", "w124/w124_34.png", 330, 1130, 700, 4) + `<div class="el cover" id="cover"></div>`
  + [0, 1, 2, 3, 4].map(i => `<div class="el dust" id="du${i}" style="left:${300 + i * 110}px;top:${1100 - (i % 2) * 40}px;width:${130 + i * 12}px;height:${96 + i * 8}px"></div>`).join("")
  + hero("dr2", 20, 870, .8, DIR) + tol("t3", 20, 870, .8, 7) + stamp("years", "1994 · 61 000 КМ · 30 ЛЕТ ПОД ЧЕХЛОМ", 90, 1440, "#ffd23f", "#151515", 32, -2) + CARDS());
// 4. стадион: торги; поворот — Жора
scene("st2", "stadion");
add("st2", `<div class="el bids" id="bids"><small>ТОРГИ · Mercedes W124</small>
    ${[["Казань", "1 000 000"], ["Сочи", "1 150 000"], ["???", "1 300 000"]].map(([w, v], k) => `<div id="bd${k}">📞 <span id="bw${k}">${w}</span><b>${v}</b></div>`).join("")}</div>`
  + tol("t4", 600, 860, .8) + hero("zh", 640, 860, .78, ZHORA));
// 5. кабинет: Камри директору; 6. стадион: директор на машине
scene("kab2", "kabdir");
add("kab2", hero("dr3", 600, 840, .82, { ...DIR, look: "grin" }) + tol("t5", 20, 880, .78) + ORDER("ord2", 40, 1220, ["1. Продать отцовский Мерседес — честно.", "2. Купить машину, на которой не стыдно."])
  + PHONE("cping", 300, 1060, 560, BOT(`<b style="color:#ff7a1a">🔥 −8% к рынку</b><br><b>Toyota Camry 2014 · 1 090 000 ₽</b><br>📍 твой город · ⏱ 1 с после публикации`, 28)));
// финал — задний двор частного дома директора (владелец 12.11: «камри на стадион — нелогично»): Камри заезжает через ворота к гаражу,
// Толян ждёт у беседки с мангалом — они подружились
scene("dd", "dvordir");
add("dd", CAR("cm", "camry/camry.png", 360, 1080, 700, 3) + hero("dr4", 640, 880, .78, { ...DIR, look: "grin" }, 6) + tol("t6", 40, 900, .78)
  + `<div class="ctab" id="cta2" style="top:1330px"><div class="cbig">Бот <span>«Перехват»</span><br>— ссылка в шапке</div><div class="csm">фильтр по всей России · свежие объявления за ~1 с</div></div>`);
$(".stage").insertAdjacentHTML("beforeend", `<div id="cnt">💰 <span id="cv">440 000</span> ₽ <em id="cd"></em></div>`);
$("#end h2").innerHTML = E.end;

const bub = (line, html, l, t, tx, fs) => { const b = bubble(line, html, l, t, tx); if (fs) b.style.fontSize = fs + "px"; return b; };
bub("i1", "Брат, директор пешком ходит.<br><em>Двадцать лет!</em>", 330, 700, 400, 34);
bub("d1", "Машина у меня есть. Отцовская.<br><em>Перекупы дали двести пятьдесят — «ведро».</em>", 230, 680, 500, 28);
bub("t1", "Виктор Андреевич, это не ведро.<br><em>Это — миллион двести.</em>", 20, 700, 140, 30);
bub("t2", "Звонок за звонком —<br><em>а я ещё чай не допил.</em>", 380, 700, 380, 34);
bub("z1", "Студент, миллион триста!<br><em>Это ж кабан в идеале!</em>", 380, 700, 410, 34);
bub("d2", "Анатолий… приказом<br><em>объявляю благодарность.</em>", 330, 680, 380, 34);
bub("d3", "Двадцать лет пешком ходил.<br><em>Анатолий, заходи — шашлык готов.</em>", 300, 700, 470, 32);

window.build = R => {
  const tl = R.tl, cam = R.camera($("#cam"), { hand: .6 });
  R.grain(.03);
  gsap.set(".scn", { opacity: 0 }); gsap.set("#sc_st1", { opacity: 1 });
  const { pop } = common(R, cam);
  const talk = (lv, f) => lv > .28 && !(lv < .55 && f % 3 === 2);
  const SP = { t1: "tolyan", t2: "tolyan", t3: "tolyan", t4: "tolyan", t5: "tolyan", t6: "tolyan", il1: "ildar", dr1: "dir", dr2: "dir", dr3: "dir", dr4: "dir", zh: "zhora" };
  const mood = (k, t) => k === "tolyan" && t > st.z1 - .3 && t < st.l4 + 1 ? "o" : "grin";
  R.hooks.push(t => { const f = Math.floor(t * 30);
    for (const [p, k] of Object.entries(SP)) if (document.getElementById(p)) mouth(p, talk((LIP[k] || [])[f] || 0, f) ? "talk" : mood(k, t)); });
  window.MUSIC = { style: "toon", bpm: 112, end: R.dur - 1.2 };
  const ids = E.lines.map(l => l.id), nxt = l => ids[ids.indexOf(l) + 1];
  const SW = { kab: st.d1 - .5, gar: st.l1 - .35, st2: st.l3 - .35, kab2: st.l5 - .35, dd: st.d3 - 1.6 };
  const ends = Object.values(SW).sort((a, b) => a - b);
  for (const l of ["i1", "d1", "t1", "t2", "z1", "d2", "d3"]) {
    const cap = ends.find(x => x > st[l]) ?? 1e9, n = nxt(l);
    pop("#b_" + l, st[l] - .05, Math.min(en[l] + .9, n ? st[n] - .1 : en[l] + 1, cap - .05));
  }
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
  const cnt = (from, to, at, d) => { R.count($("#cv"), at, from, to, .9); tl.set("#cd", { textContent: d, color: "#4cd964" }, at); R.sfx("clack", at, .6);
    tl.fromTo("#cnt", { scale: 1.25 }, { scale: 1, duration: .4, ease: "back.out(2)", immediateRender: false }, at); };
  gsap.set(["#ZH", "#T3", "#bids", ".wcard", ".ost", ".or", ".dust", "#cnt"], { opacity: 0 }); gsap.set("#DR2", { opacity: 1 });

  // 1. стадион
  tl.to("#title", { opacity: 0, y: -50, duration: .25 }, 1.8);
  tl.to("#cnt", { opacity: 1, duration: .3 }, 2.0);
  [0, 1, 2].forEach(k => tl.fromTo("#rn" + k, { x: 0 }, { x: 1600, duration: 4.5, ease: "none", immediateRender: false }, .3 + k * .4));
  slam("#empty", W("l0", "пуст"), "impact"); hide("#empty", st.i1 + .3);
  // 2. кабинет: пункты приказа и печать
  swap("st1", "kab", SW.kab);
  tl.fromTo("#ord", { opacity: 0, y: 80, rotation: 6 }, { opacity: 1, y: 0, rotation: -2, duration: .35, ease: "back.out(1.6)", immediateRender: false }, W("d1", "отцовск"));
  tl.to("#ord_r0", { opacity: 1, duration: .2 }, W("d1", "отцовск") + .3).to("#ord_r1", { opacity: 1, duration: .2 }, W("d1", "отцовск") + .8);
  slam("#ord_s1", W("d1", "ведро"), "boom"); R.shake(cam, W("d1", "ведро") + .05, .6, .35);
  // 3. гараж: чехол слетает → пыль → цифры; веер объявлений
  swap("kab", "gar", SW.gar);
  tl.fromTo("#cover", { x: 0, y: 0, rotation: 0 }, { x: 900, y: -300, rotation: 18, duration: .7, ease: "power3.in", immediateRender: false }, st.l1 + 1.3); R.sfx("swish", st.l1 + 1.3, .8);
  tl.fromTo(".dust", { opacity: 0, scale: .4 }, { opacity: .85, scale: 1.4, duration: .6, stagger: .06, ease: "power2.out", immediateRender: false }, st.l1 + 1.5)
    .to(".dust", { opacity: 0, y: -120, duration: 1.4, ease: "power1.out" }, st.l1 + 2.2);
  tl.fromTo(cam, { s: 1 }, { s: 1.12, duration: 3, ease: "power1.inOut", immediateRender: false }, st.l1 + .4).to(cam, { s: 1, duration: .4 }, st.t1 - .3);
  slam("#years", W("l1", "30"), "impact"); hide("#years", st.t1 - .2);
  tl.to("#DR2", { opacity: 0, duration: .2 }, st.t1 - .3).to("#T3", { opacity: 1, duration: .2 }, st.t1 - .3);
  [0, 1, 2].forEach(k => { tl.fromTo("#wc" + k, { opacity: 0, x: 200 }, { opacity: 1, x: 0, duration: .3, ease: "back.out(1.6)", immediateRender: false }, st.l2 + .3 + k * .45); R.sfx("ping", st.l2 + .3 + k * .45, .6); });
  // 4. торги: звонки один за другим, «???» → «Жора»
  swap("gar", "st2", SW.st2);
  tl.fromTo("#bids", { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: .3, immediateRender: false }, W("l3", "торг") - .2);
  gsap.set(["#bd0", "#bd1", "#bd2"], { opacity: 0 });
  [0, 1, 2].forEach(k => { const at = st.t2 + .2 + k * .9; tl.to("#bd" + k, { opacity: 1, duration: .15 }, at); R.sfx("ring", at, .4); R.punch(cam, at, .03); });
  tl.to("#T4", { x: -560, duration: .5, ease: "power2.inOut" }, st.z1 - .7);
  tl.fromTo("#ZH", { opacity: 0, x: 400 }, { opacity: 1, x: 0, duration: .5, ease: "power2.out", immediateRender: false }, st.z1 - .6); R.sfx("whoosh", st.z1 - .6, .5);
  tl.set("#bw2", { textContent: "Жора" }, st.z1 - .1); tl.set("#bd2", { color: "#4cd964" }, st.z1 - .1); R.sfx("impact", st.z1, .7);
  // 5. кабинет: Камри и вторая печать
  swap("st2", "kab2", SW.kab2);
  gsap.set(["#ord2", "#ord2 .or"], { opacity: 1 }); gsap.set("#ord2_s1", { opacity: 1 });
  show("#cping", W("l5", "камр")); hide("#cping", st.d2 - .15);
  slam("#ord2_s2", W("d2", "благодар"), "boom");
  // 6. стадион: директор на машине; итог
  swap("kab2", "dd", SW.dd);
  // Камри заезжает во двор через ворота и тормозит у гаража; директор выходит из машины к своей реплике
  tl.fromTo("#cm", { x: 760, y: 260, scale: .8 }, { x: 0, y: 0, scale: 1, duration: 1.2, ease: "power3.out", immediateRender: false }, SW.dd + .2); R.sfx("whoosh", SW.dd + .3, .6);
  R.sfx("drop", SW.dd + 1.3, .5);
  tl.fromTo("#DR4", { opacity: 0, x: -60 }, { opacity: 1, x: 0, duration: .4, ease: "power2.out", immediateRender: false }, st.d3 - .4); gsap.set("#DR4", { opacity: 0 });
  cnt(440000, 570000, W("end", "130"), "+130 000");
  tl.fromTo("#cta2", { opacity: 0, y: 80, scale: .9 }, { opacity: 1, y: 0, scale: 1, duration: .4, ease: "back.out(1.6)", immediateRender: false }, W("end", "подпиш") - .3);
  tl.to("#cnt", { opacity: 0, duration: .2 }, en.end + .1);
  ending(R, en.end + .3);
};


// ── ep45c «Ночь»: та же история и озвучка, другая «съёмка» ──
(() => {
  const C = {"t1": "30 ЛЕТ", "t2": "ПОД ЧЕХЛОМ", "c1": "#ffd23f", "c2": "#151515", "cam": "in", "music": {"style": "phonk", "bpm": 120}};
  const orig = window.build;
  window.build = R => {
    orig(R);
    const tl = R.tl;
    $("#title .a").textContent = C.t1; $("#title .a").style.cssText = `font-size:110px;background:${C.c1};color:${C.c2}`;
    const b = $("#title .b"); b.style.display = ""; b.textContent = C.t2; b.style.cssText = `font-size:60px;background:${C.c2};color:${C.c1}`;
    tl.set("#title", { opacity: 1, y: 0 }, 0).to("#title", { opacity: 0, y: -50, duration: .3 }, 1.2);
    const S = [["st1", 0, st.d1 - .5, "50% 55%"], ["kab", st.d1 - .5, st.l1 - .35, "55% 50%"], ["gar", st.l1 - .35, st.l3 - .35, "60% 65%"],
               ["st2", st.l3 - .35, st.l5 - .35, "45% 60%"], ["kab2", st.l5 - .35, st.d3 - 1.6, "50% 55%"], ["dd", st.d3 - 1.6, en.end + .3, "55% 55%"]];
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
