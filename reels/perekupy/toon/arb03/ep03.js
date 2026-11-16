// «АРБИТРАЖНИКИ» ep03 «НИКИТА: РОЛИК → 12 ЗАЯВОК» (киношный формат ../cine.js). Сцены — как в утверждённой раскадровке board.html (16.11).
// Обложка (студия, штатив, итог) → «сниму ролик» → интерфейс Reels → мама: «с лампой разговариваешь?» → эскалатор: 0 → 40 000 просмотров →
// метро: Оля и Артём идут по ссылке → схема метки → 12 заявок → расчёт 18 000 ₽ → мама «научишь?» → «урок бесплатный» → финал в стиле Телеграма.
// Без бейджа Арбузова (ep03.css) и без тёмного #end «Перекупов»: последний кадр — ENDTG.
$("#title .a").textContent = E.rubric; $("#title .b").textContent = E.subtitle; $("#title .a").style.fontSize = "66px"; $("#title .b").style.fontSize = "62px"; $("#title .b").style.whiteSpace = "nowrap";
$("#tag span").textContent = "ролик → заявки";
document.querySelector("#cam > svg#bg")?.remove();
const W = (line, pre, n = 0) => {
  const norm = s => s.toLowerCase().replace(/ё/g, "е").replace(/[^а-я0-9a-z]/g, "");
  const hits = (TT.words[line] || []).filter(w => w[1] >= st[line] - .7 && w[2] <= en[line] + .05 && norm(w[0]).startsWith(norm(pre)));
  if (!hits[n]) console.warn("W miss", line, pre);
  return hits[n] ? Math.max(hits[n][1], st[line] - .05) : null;
};
const Wd = (line, pre, frac) => W(line, pre) ?? st[line] + (en[line] - st[line]) * frac;
const root = $("#scene"), SC = {}, SPK = {};
const mount = (name, def, sh) => (SC[name] = C.mount(root, def, sh));
const spk = (p, v) => (SPK[p] = v, p);
const fix = h => h.replaceAll('style="left:', 'style="position:absolute;left:');
const Nk = (p, x, foot, h, o = {}, pose = {}, extra = {}) => N_(spk(p, "nikita"), x, foot, h, o, pose, extra);
const Mm = (p, x, foot, h, pose = {}, extra = {}) => M_(spk(p, "mama"), x, foot, h, pose, extra);
const DS_L = glow(200, 820, 300, "#fffbe0", .45) + glow(800, 420, 300, "#ffb070", .25);
const MV_L = glow(540, 200, 520, "#ffffff", .25);
const ES_L = glow(540, 300, 520, "#fff6c8", .25);
const STAT = (y = 720) => `<div style="position:absolute;left:0;right:0;top:${y}px;text-align:center;z-index:45"><span style="display:inline-block;background:#0d0e12;color:#fff;border:7px solid #151515;border-radius:30px;box-shadow:0 10px 0 #151515;padding:14px 30px;font-family:Unbounded;font-weight:900;font-size:46px">👁 40 000 · <span style="color:#4cd964">✅ 12 заявок</span></span></div>`;
const PH = (t1, t2, c) => `<div style="font-family:Onest;color:#fff"><div style="height:300px;border-radius:24px;background:radial-gradient(circle at 40% 40%,#ffd27a,#7a5a8a 60%,#2a1e30);display:flex;align-items:center;justify-content:center;font-size:120px">▶</div><div style="font-weight:800;font-size:46px;line-height:1.2;margin-top:18px">${t1}</div><div style="font-weight:800;font-size:42px;color:${c};margin-top:8px">${t2}</div></div>`;

// 1. обложка
mount("s1", { bg: "domstudiya", mid: TRIPOD(240, 1180) + Nk("na", 650, 2010, 1040, {}, { armR: -120 }, { rim: "#fffbe0", side: -1, z: 8 }), lights: DS_L, over: STAT(720) }, { x: 540, y: 960, s: 1 });
// 2. «сниму ролик»
mount("s2", { bg: "domstudiya", mid: TRIPOD(240, 1180) + Nk("nb", 720, 1900, 900, {}, { armR: -150 }, { rim: "#fffbe0", side: -1, z: 8 }), lights: DS_L,
  bubbles: [{ id: "n0", p: "nb", html: "Значит, сниму ролик.<br><em>Пусть сами находят ссылку!</em>", fs: 36 }] }, { x: 540, y: 1150, s: 1.04 });
// 3. интерфейс Reels
mount("s3", { bg: "domstudiya", over: REELS(fix(`<div style="position:absolute;inset:0;background:radial-gradient(circle at 30% 40%,#fffbe0 0,#7a5a8a 35%,#2a1e30 80%)"></div>` + N_("rn", 540, 2150, 1500, {}, { armR: -120 }, { z: 5 }))) }, { x: 540, y: 960, s: 1 });
// 4. мама
mount("s4", { bg: "domstudiya", mid: TRIPOD(380, 1180) + Mm("ma", 150, 1900, 860, { armL: 20 }, { rim: "#fffbe0", side: 1, z: 7 }) + Nk("nc", 870, 1900, 860, { look: "o" }, { armL: 60 }, { rim: "#fffbe0", side: -1, z: 8 }), lights: DS_L,
  bubbles: [{ id: "m0", p: "ma", html: "Опять с лампой<br><em>разговариваешь?</em>", fs: 36 }, { id: "n1", p: "nc", html: "Мам, я работаю!<br><em>Это лампа такая!</em>", fs: 36 }] }, { x: 540, y: 1150, s: 1.04 });
// 5. эскалатор: счётчик просмотров
mount("s5", { bg: "eskalator", farBlur: 2, over: VIEWS(760), lights: ES_L }, { x: 540, y: 960, s: 1 });
// 6. метро: Оля и Артём с телефонами
{ const H1 = HOLDPHONE("vika", spk("oa", "olya"), 270, 1960, 1040, null, PH("🎁 Бонус новым клиентам", "ссылка в шапке 👆", "#ffd23f"), { rim: "#ffffff", side: 1 });
  const H2 = HOLDPHONE("perekup", spk("ab", "artem"), 820, 1960, 1040, ARTEM, PH("nikita.arb", "▶ Оформить карту", "#4cd964"), { rim: "#ffffff", side: -1 });
  mount("s6", { bg: "metrovagon", farBlur: 3, mid: OLYA(H1.mid) + H2.mid, lights: OLYA(H1.lights) + H2.lights + MV_L,
    bubbles: [{ id: "o0", p: "oa", html: "О, бонус новым!<br><em>Мне нужна карта.</em>", fs: 34 }, { id: "a0", p: "ab", html: "Ссылка в шапке.<br><em>Оформлю!</em>", fs: 34 }] }, { x: 540, y: 1100, s: 1.02 }); }
// 7. схема метки
mount("s7", { bg: "domstudiya", farBlur: 6, mid: TRACK(560) + Nk("nd", 540, 1990, 880, {}, { armR: -150 }, { rim: "#fffbe0", side: 1, z: 8 }), lights: DS_L }, { x: 540, y: 1100, s: 1.02 });
// 8. заявки
{ const H = HOLDPHONE("nikita", spk("ne", "nikita"), 540, 2000, 1400, {}, LEADS(4), { rim: "#fffbe0", side: 1 });
  mount("s8", { bg: "domstudiya", farBlur: 6, mid: H.mid, lights: H.lights + DS_L,
    bubbles: [{ id: "n2", p: "ne", html: "Двенадцать заявок!<br><em>И никого не уговаривал!</em>", fs: 36 }] }, { x: 540, y: 1000, s: 1.02 }); }
// 9. расчёт
mount("s9", { bg: "domstudiya", farBlur: 6, mid: CALC(600) + Nk("nf", 540, 1990, 860, {}, { armR: -150 }, { rim: "#fffbe0", side: 1, z: 8 }), lights: DS_L }, { x: 540, y: 1100, s: 1.02 });
// 10. мама: «сколько?!»
mount("s10", { bg: "domstudiya", mid: Mm("mb", 300, 1900, 900, { armL: 150, armR: -150 }, { rim: "#fffbe0", side: 1, z: 8 }) + Nk("ng", 820, 1900, 860, {}, { armL: 30 }, { rim: "#fffbe0", side: -1, z: 7 }), lights: DS_L,
  bubbles: [{ id: "m1", p: "mb", html: "Сколько?! Никита…<br><em>а меня научишь?</em>", fs: 38 }] }, { x: 540, y: 1150, s: 1.04 });
// 11. «урок бесплатный»
mount("s11", { bg: "domstudiya", mid: Mm("mc", 300, 1900, 860, {}, { rim: "#fffbe0", side: 1, z: 7 }) + Nk("nh", 780, 1900, 900, {}, { armL: 60 }, { rim: "#fffbe0", side: -1, z: 8 }), lights: DS_L,
  bubbles: [{ id: "n3", p: "nh", html: "Мам, урок бесплатный.<br><em>Ссылку скину!</em>", fs: 38 }] }, { x: 540, y: 1150, s: 1.04 });
// 12. финал в стиле Телеграма (последний кадр)
mount("s12", { bg: "domstudiya", over: ENDTG() + ENDNIK(spk("nz", "nikita")) }, { x: 540, y: 960, s: 1 });

window.build = R => {
  const tl = R.tl;
  const { pop } = common(R, { shake: 0 });
  for (const el of Object.values(SC)) el.glows = [...el.querySelectorAll(".lights .glow")].map(g => ({ g, o: +g.style.opacity }));
  const talk = (lv, f) => lv > .28 && !(lv < .55 && f % 3 === 2);
  const MOOD = { nc: "o", ab: "o" };
  R.hooks.push(t => {
    const f = Math.floor(t * 30);
    for (const el of Object.values(SC)) {
      const on = +el.style.opacity > 0;
      el.style.display = on ? "" : "none";
      if (!on) continue;
      const k = el.cam.s > 1.6 ? .55 : 1;
      C.apply(el, [(R.noise(t * .6) * 9 + R.noise(t * 1.7 + 40) * 3) * k, (R.noise(t * .5 + 9) * 10 + R.noise(t * 1.9 + 70) * 3) * k, R.noise(t * .4 + 20) * .3 * k]);
      el.glows.forEach(({ g, o }, j) => { g.style.opacity = (o * (.88 + .12 * R.noise(t * 2.5 + j * 3.1))).toFixed(3); });
    }
    for (const [p, v] of Object.entries(SPK)) {
      if (!document.getElementById(p)) continue;
      const lv = (LIP[v] || [])[f] || 0;
      mouth(p, talk(lv, f) ? "talk" : (MOOD[p] || "grin"));
    }
    // стрелка на финале прыгает
    const ar = document.getElementById("etga"); if (ar) ar.style.transform = `translateY(${(-Math.abs(Math.sin(t * 5)) * 14).toFixed(1)}px)`;
  });
  window.MUSIC = { style: "bed", bpm: 96, end: R.dur - 1.2 };   // без фоновой музыки (MUSIC_VOL=0)

  const cam = n => SC[n].cam;
  const cut = (from, to, at) => { tl.set(SC[from], { opacity: 0 }, at).set(SC[to], { opacity: 1 }, at); R.sfx("tick", at, .4); };
  const swap = (from, to, at) => {
    tl.set(SC[to], { opacity: 1, x: 1080, filter: "blur(14px)" }, at)
      .to(SC[from], { x: -1080, filter: "blur(14px)", duration: .35, ease: "power3.in" }, at)
      .to(SC[to], { x: 0, filter: "blur(0px)", duration: .38, ease: "power3.out" }, at + .12)
      .set(SC[from], { opacity: 0, x: 0, filter: "none" }, at + .5).set(SC[to], { filter: "none" }, at + .51);
    R.sfx("whoosh", at, .6);
  };
  const move = (n, to, at, d, ease = "power2.inOut") => tl.to(cam(n), { ...to, duration: d, ease }, at);
  const ids = E.lines.map(l => l.id), nxt = l => ids[ids.indexOf(l) + 1];
  const bub = (l, until) => pop("#b_" + l, st[l] - .05, until ?? Math.min(en[l] + .8, nxt(l) ? st[nxt(l)] - .1 : en[l] + 1));
  const popIn = (el, at, snd = "ping") => { tl.fromTo(el, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: .3, ease: "back.out(2.2)", immediateRender: true }, at); R.sfx(snd, at, .5); };
  const count = (el, to, at, d, fmt = v => Math.round(v).toLocaleString("ru-RU").replace(/,/g, " ")) => { const o = { v: 0 };
    tl.to(o, { v: to, duration: d, ease: "power2.out", onUpdate: () => { if (el) el.textContent = fmt(o.v); } }, at); };

  // 1. обложка: плашка с кадра 0, гаснет к 1,6 с
  gsap.set(SC.s1, { opacity: 1 }); SC.s1.style.display = "";
  tl.set(SC.s1, { opacity: 1 }, 0); tl.to("#title", { opacity: 0, y: -50, duration: .25 }, 1.6);
  move("s1", { s: 1.06, y: 1000 }, 0, 3, "none");
  // 2. «сниму ролик»
  const SW2 = Math.max(2.6, st.n0 - .3); swap("s1", "s2", SW2); move("s2", { s: 1.1 }, SW2, en.n0 - SW2 + .3, "none"); bub("n0", st.l1 - .1);
  // 3. интерфейс Reels: просмотры и лайки растут
  cut("s2", "s3", st.l1 - .15); tl.to("#tag", { opacity: 0, duration: .15 }, st.l1 - .15);
  count(SC.s3.querySelector("#rlv"), 1240, st.l1, en.l1 - st.l1 + .3); count(SC.s3.querySelector("#rlk"), 3214, st.l1, en.l1 - st.l1 + .3);
  // 4. мама
  const SW4 = st.m0 - .3; swap("s3", "s4", SW4); tl.to("#tag", { opacity: 1, duration: .2 }, SW4 + .3); move("s4", { s: 1.08 }, SW4, en.n1 - SW4 + .3, "none"); bub("m0", st.n1 - .1); bub("n1", st.l2 - .15);
  // 5. эскалатор: 0 → 40 000
  const SW5 = st.l2 - .3; swap("s4", "s5", SW5); move("s5", { s: 1.06 }, SW5, en.l2 - SW5 + .4, "none");
  count(SC.s5.querySelector("#vwn"), 40000, Wd("l2", "набрал", .3), Math.max(1, en.l2 - Wd("l2", "набрал", .3))); R.sfx("riser", Wd("l2", "набрал", .3), .9); R.sfx("ping", en.l2, .7);
  // 6. метро
  const SW6 = st.o0 - .3; swap("s5", "s6", SW6); move("s6", { s: 1.06 }, SW6, en.a0 - SW6 + .3, "none"); bub("o0", st.a0 - .1); bub("a0", st.l3 - .15);
  // 7. схема метки по словам
  const SW7 = st.l3 - .3; swap("s6", "s7", SW7); move("s7", { s: 1.06 }, SW7, en.l3 - SW7 + .4, "none");
  const S7 = SC.s7; [["#tk1", "банк", .15], ["#tk2", "клиент", .3], ["#tk0", "ссылк", .7]].forEach(([s, w, fr]) => popIn(S7.querySelector(s), Wd("l3", w, fr) - .05));
  // 8. заявки сыплются, счётчик 1 → 12
  cut("s7", "s8", st.n2 - .15); move("s8", { s: 1.06 }, st.n2 - .15, en.n2 - st.n2 + .4, "none"); bub("n2", st.l4 - .2);
  const S8 = SC.s8; for (let k = 0; k < 4; k++) popIn(S8.querySelector("#ld" + k), st.n2 - .1 + k * .35, "pop");
  count(S8.querySelector("#ldc"), 12, st.n2, Math.min(1.6, en.n2 - st.n2));
  // 9. расчёт
  const SW9 = st.l4 - .3; swap("s8", "s9", SW9); move("s9", { s: 1.06 }, SW9, en.l4 - SW9 + .4, "none");
  popIn(SC.s9.querySelector("#cl0"), Wd("l4", "двенадцат", .1) - .05); popIn(SC.s9.querySelector("#cl1"), Wd("l4", "восемнадцат", .6) - .05, "bell");
  // 10. мама: «сколько?!»
  const SW10 = st.m1 - .3; swap("s9", "s10", SW10); move("s10", { s: 1.1 }, SW10, en.m1 - SW10 + .3, "none"); bub("m1", st.n3 - .1);
  // 11. «урок бесплатный»
  cut("s10", "s11", st.n3 - .15); move("s11", { s: 1.08 }, st.n3 - .15, en.n3 - st.n3 + .4, "none"); bub("n3", st.l5 + .1);
  // 12. финал в стиле Телеграма: заголовок, телефон, кнопка, палец, плашка (последний кадр)
  const SW12 = Math.min(st.l5 + .4, en.l5 - 3); swap("s11", "s12", SW12); tl.to("#tag", { opacity: 0, duration: .2 }, SW12);
  const E12 = SC.s12, q = s => E12.querySelector(s);
  tl.fromTo(q("#etgt"), { y: -80, opacity: 0 }, { y: 0, opacity: 1, duration: .45, ease: "back.out(1.6)", immediateRender: true }, SW12 + .3);
  tl.fromTo(q("#etgp"), { y: 500 }, { y: 0, duration: .55, ease: "power3.out", immediateRender: true }, SW12 + .45);
  tl.fromTo(q("#etgf"), { y: 160, opacity: 0 }, { y: 0, opacity: 1, duration: .4, ease: "power2.out", immediateRender: true }, SW12 + 1.2);
  for (let k = 0; k < 3; k++) { const at = SW12 + 1.7 + k * 1.1;
    tl.to(q("#etgf"), { y: -14, duration: .12, yoyo: true, repeat: 1, ease: "power2.out" }, at).to(q("#etgb"), { scale: .95, duration: .12, yoyo: true, repeat: 1, ease: "power2.out" }, at); R.sfx("tap", at, .6); }
  popIn(q("#etgl"), SW12 + 1.0, "pop");
};
