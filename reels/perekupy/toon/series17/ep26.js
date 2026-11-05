// «ПОДБОРЩИК» — 7 сцен: кабинка колеса обозрения, мойка самообслуживания, парилка, слежка через бинокль у бани, вид из смотровой ямы,
// верхняя точка колеса, мораль. Машины владельца: Мерседес W124 (продаёт Толян), синий BMW X6 (Вика). Каждый, кто говорит, — в кадре.
$("#title .a").textContent = E.rubric; $("#title .b").style.display = "none"; $("#tag span").textContent = "подборщик";
$("#title .a").style.cssText = "font-size:110px;background:#151515;color:#fff";
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
const STAS = { jacket: "#e67e22", pants: "#3b3f46", cap: "#151515", hair: "#3a2d22", item: "gauge" };
const TOW = { towel: "#f4f6f8", shades: true, chain: true, saunaHat: true };
const STAS_SAUNA = { towel: "#2e86de", saunaHat: true, hair: "#3a2d22" };
const gauge = (id, v, l, t) => `<div class="el gauge2" id="${id}" style="left:${l}px;top:${t}px">${v}</div>`;
const env = (id, l, t, rot = -8) => `<div class="el env" id="${id}" style="left:${l}px;top:${t}px;transform:rotate(${rot}deg)"><i></i></div>`;
const NEXT = `<div class="el" id="nextcab" style="left:222px;top:582px;width:156px;height:92px;overflow:hidden;z-index:4;border-radius:14px">
  <div style="position:absolute;left:28px;top:-6px;width:420px;height:800px;transform:scale(.24);transform-origin:0 0">${CHARS.tolyan("tn")}</div></div>`;
const BINO = `<div class="el" id="bino" style="left:90px;top:650px;width:640px;height:330px;z-index:10;overflow:hidden;border-radius:30px">
  <div style="position:absolute;left:-250px;top:-640px;width:1080px;height:1920px;transform:scale(1.2);transform-origin:520px 900px">${BGS.banya.replace('id="bg"', "")}</div>
  <div id="binoT" style="position:absolute;left:150px;top:70px;width:420px;height:800px;transform:scale(.33);transform-origin:0 0">${CHARS.tolyan("tb")}</div>
  <div id="binoS" style="position:absolute;left:360px;top:76px;width:420px;height:800px;transform:scale(.31);transform-origin:0 0">${CHARS.perekup("pb", { jacket: "#e67e22", pants: "#3b3f46", cap: "#151515" })}</div>
  <div id="binoE" style="position:absolute;left:300px;top:200px;width:70px;height:44px;transform:rotate(10deg);background:#f4e7c3;border:4px solid #151515;border-radius:5px"></div>
  <svg viewBox="0 0 640 330" style="position:absolute;inset:0;width:100%;height:100%"><path fill="#05070f" fill-rule="evenodd" d="M0 0H640V330H0Z M332 165a150 150 0 1 0 0 .1Z M608 165a150 150 0 1 0 0 .1Z"/>
    <circle cx="182" cy="165" r="150" fill="none" stroke="#2b2f37" stroke-width="12"/><circle cx="458" cy="165" r="150" fill="none" stroke="#2b2f37" stroke-width="12"/></svg></div>`;
const STASES = ["p", "p2", "p3", "p4"], VIKAS = ["v2", "v3", "v4"];

// 1. кабинка колеса обозрения: в соседней — Толян
scene("fw1", "ferris");
add("fw1", NEXT + hero("perekup", "p", 560, 880, .78, 6, STAS) + hero("vika", "v", 60, 900, .78));
// 2. мойка: пена, другой оттенок двери
scene("wash", "carwash");
add("wash", `<img class="pcar" src="../../kit/img/w124/w124_34.png" style="left:150px;top:1020px;width:720px;z-index:3">`
  + `<div class="el" id="door" style="left:${150 + 720 * .665}px;top:${1020 + 720 * .438 * .3}px;width:${720 * .135}px;height:${720 * .438 * .45}px;z-index:4;background:#e2cfa5;border:4px dashed #ff3b30;border-radius:6px"></div>`
  + Array.from({ length: 10 }, (_, i) => `<div class="foam2" id="fm${i}" style="left:${630 + (i * 37) % 110}px;top:${1100 + (i * 29) % 140}px;width:${46 + (i * 13) % 30}px;height:${46 + (i * 13) % 30}px"></div>`).join("")
  + stamp("shade", "ДРУГОЙ ОТТЕНОК", 520, 1215, "#ff3b30", "#fff", 30, -3) + gauge("g1", "1200 мкм", 430, 930)
  + hero("tolyan", "t", 0, 800, .88) + hero("perekup", "p2", 700, 830, .8, 6, STAS));
// 3. парилка: конверт
scene("sauna", "sauna");
add("sauna", hero("perekup", "tt", 60, 780, .88, 6, TOW) + hero("perekup", "p3", 600, 790, .88, 6, STAS_SAUNA) + env("env", 330, 1150, -12)
  + stamp("k20", "20 000 — ОТ ВИКИ", 60, 560, "#4cd964", "#151515", 40, -3) + stamp("k30", "30 000 — ОТ ТОЛЯНА", 420, 650, "#ff3b30", "#fff", 40, 3)
  + Array.from({ length: 6 }, (_, i) => `<div class="steam" id="sm${i}" style="left:${(i * 190) % 1000}px;top:${700 + (i * 130) % 500}px"></div>`).join(""));
// 4. слежка у бани: X6, бинокль
scene("spy", "banya");
add("spy", `<img class="pcar" src="../../kit/img/x6/x6_side.png" style="left:30px;top:1150px;width:600px;z-index:3">` + hero("vika", "v2", 680, 860, .85)
  + `<div class="el" id="binocs" style="left:808px;top:1012px;width:110px;height:56px;z-index:7;background:#151515;border-radius:28px;box-shadow:inset 0 0 0 6px #3b3f46"></div>` + BINO);
// 5. смотровая яма
scene("pit", "pit");
add("pit", hero("mihalych", "m", 30, 560, .9) + hero("vika", "v3", 650, 600, .85));
// 6. верхняя точка колеса
scene("fw2", "ferris");
add("fw2", hero("perekup", "p4", 560, 880, .78, 6, Object.assign({}, STAS, { item: "" })) + hero("vika", "v4", 60, 900, .78)
  + stamp("top", "ВЕРХНЯЯ ТОЧКА · 20 МИН", 560, 600, "#151515", "#ffd23f", 30, 3));
// 7. мораль
scene("moral", "ferris");
add("moral", `<div class="card" id="moralCard" style="top:420px;z-index:20"><h3>ПОДБОРЩИК БЕЗ ОТКАТА</h3>
  <div class="li" id="mo0">📄 Договор и оплата — только от тебя</div><div class="li" id="mo1">👀 На осмотре будь сам</div>
  <div class="li" id="mo2">🔧 Второй замер — на своём СТО</div><div class="li" id="mo3">🏆 Спроси, что он забраковал раньше</div>
  <div class="rule" id="mo4">🔔 Машины от собственников — бот «Перехват»</div></div>`);

["t", "tn", "tb"].forEach(p => { const s = document.getElementById(p + "-shades"); if (s) s.style.display = ""; });
$("#end h2").innerHTML = E.end;
const bub = (line, html, l, t, tx, fs) => { const b = bubble(line, html, l, t, tx); if (fs) b.style.fontSize = fs + "px"; return b; };
bub("s1", "Подбор под ключ — двадцать<br><em>тысяч. Найду машину мечты.</em>", 260, 720, 520, 40);
bub("v1", "А почему мы<br><em>на колесе обозрения?</em>", 40, 720, 140, 44);
bub("s2", "Чтобы никто<br><em>не подслушал.</em>", 520, 740, 200);
bub("s3", "Родная краска!<br><em>Сто двадцать микрон!</em>", 440, 640, 360, 46);
bub("t1", "Пену не смывай, брат.<br><em>Так блестит.</em>", 20, 640, 160, 46);
bub("t2", "Тридцать — тебе,<br><em>как договаривались.</em>", 40, 640, 150, 46);
bub("s4", "И веник —<br><em>за твой счёт.</em>", 600, 640, 160);
bub("v2", "Ну здравствуй,<br><em>«честность —<br>моё второе имя».</em>", 60, 990, 650, 44);
bub("m1", "Шпаклёвки — на хрущёвку хватит.<br><em>А днище — как дуршлаг.</em>", 40, 260, 140, 38);
bub("v3", "А подборщик сказал —<br><em>идеальная.</em>", 400, 300, 380, 44);
bub("m2", "Стасик? Он и мне подбирал.<br><em>Я с тех пор из ямы не вылезаю.</em>", 40, 260, 140, 38);
bub("v4", "Стас, сколько тебе<br><em>Толян заплатил?</em>", 40, 720, 140, 46);
bub("s5", "…Это бонус<br><em>за лояльность.</em>", 560, 740, 180);
bub("v5", "Колесо крутится ещё двадцать<br><em>минут. Рассказывай.</em>", 40, 720, 140, 40);

window.build = R => {
  const tl = R.tl, cam = R.camera($("#cam"), { hand: .6 });
  R.grain(.03);
  gsap.set(".scn", { opacity: 0 }); gsap.set("#sc_fw1", { opacity: 1 }); gsap.set("#door, #shade, #g1, #k20, #k30, #bino, #top", { opacity: 0 });
  const { pop } = common(R, cam, { mood: () => "grin" });
  R.hooks.push(t => { const f = Math.floor(t * 30), talk = lv => lv > .28 && !(lv < .55 && f % 3 === 2);
    const ls = (LIP.stas || [])[f] || 0, lt = (LIP.tolyan || [])[f] || 0, lv = (LIP.vika || [])[f] || 0;
    STASES.forEach(p => { if (document.getElementById(p)) mouth(p, talk(ls) ? "talk" : (p === "p4" && t > st.s5 ? "o" : "grin")); });
    if (document.getElementById("tt")) mouth("tt", talk(lt) ? "talk" : "grin");
    VIKAS.forEach(p => { if (document.getElementById(p)) mouth(p, talk(lv) ? "talk" : "flat"); });
    for (let i = 0; i < 6; i++) { const e = document.getElementById("sm" + i); e.style.transform = `translate(${Math.sin(t * .5 + i) * 60}px,${-((t * 40 + i * 70) % 260)}px)`; } });
  const swap = (from, to, at, kind = "swipe") => {
    if (kind === "cut") { tl.set(`#sc_${from}`, { opacity: 0 }, at).set(`#sc_${to}`, { opacity: 1, x: 0, filter: "none" }, at); R.sfx("hit", at, .4); return; }
    tl.set(`#sc_${to}`, { opacity: 1, x: 1080, filter: "blur(14px)" }, at)
      .to(`#sc_${from}`, { x: -1080, filter: "blur(14px)", duration: .35, ease: "power3.in" }, at)
      .to(`#sc_${to}`, { x: 0, filter: "blur(0px)", duration: .38, ease: "power3.out" }, at + .12)
      .set(`#sc_${from}`, { opacity: 0, x: 0, filter: "none" }, at + .5);
    R.sfx("whoosh", at, .6);
  };
  window.MUSIC = { style: "bed", bpm: 104, end: R.dur - 1.2, mute: [[st.v5 - .2, en.v5 + .3]] };
  const ids = E.lines.map(l => l.id);
  const CUT = { h: 0, s2: st.h, s4: en.l2, t1: st.l1 + 1.4 };
  const SW = { s3: st.s3 - .7, t2: st.t2 - .7, v2: st.v2 - .7, m1: st.m1 - .7, v4: st.v4 - .7, rule: st.rule - .7 };
  for (const l of ["s1", "v1", "s2", "s3", "t1", "t2", "s4", "v2", "m1", "v3", "m2", "v4", "s5", "v5"]) {
    const nx = ids[ids.indexOf(l) + 1]; const nextSwap = SW[nx] ? SW[nx] - .05 : 1e9;
    pop("#b_" + l, st[l] - .05, Math.min(en[l] + .9, st[nx] - .1, nextSwap)); }
  const slam = (sel, at, sfx = "impact") => { tl.fromTo(sel, { opacity: 0, scale: 2 }, { opacity: 1, scale: 1, duration: .18, ease: "power4.out", immediateRender: false }, at); R.sfx(sfx, at + .02, .7); };

  // 1. колесо: «в соседней кабинке ехал Толян» — камера к соседней кабинке
  tl.to("#title", { opacity: 0, y: -50, duration: .25 }, st.v1 - .2);
  tl.fromTo(cam, { s: 1, x: 0, y: 0 }, { s: 2.2, x: 288, y: 398, duration: .5, ease: "power3.inOut", immediateRender: false }, W("h", "соседн") - .2)
    .to(cam, { s: 1, x: 0, y: 0, duration: .4, ease: "power2.inOut" }, en.h + .4);
  R.sfx("whoosh", W("h", "соседн") - .2, .6); R.sfx("ping", W("h", "толян") + .05, .7);
  tl.fromTo("#tn-armR", { rotation: 0, svgOrigin: "292 400" }, { rotation: -140, svgOrigin: "292 400", duration: .25, yoyo: true, repeat: 3, immediateRender: false }, W("h", "толян"));
  // 2. мойка: пена сползает — под ней другой оттенок
  swap("fw1", "wash", st.s3 - .7);
  slam("#g1", st.s3 + .2, "ping");
  for (let i = 0; i < 10; i++) tl.to(`#fm${i}`, { y: 260, opacity: 0, duration: 1.2, ease: "power1.in" }, W("l1", "толщином") - .6 + i * .05);
  tl.fromTo("#door", { opacity: 0 }, { opacity: 1, duration: .4, immediateRender: false }, W("l1", "толщином") - .2);
  slam("#shade", W("l1", "тысяч"), "impact");
  // 3. парилка: конверт из рук в руки, счёт
  swap("wash", "sauna", st.t2 - .7);
  tl.fromTo("#env", { x: -140, rotation: -20 }, { x: 160, rotation: 8, duration: .6, ease: "power2.inOut", immediateRender: false }, W("t2", "договар")); R.sfx("swish", W("t2", "договар"), .6);
  slam("#k20", W("l2", "двадцать"), "pop"); slam("#k30", W("l2", "тридцать"), "pop");
  // 4. слежка: бинокль
  swap("sauna", "spy", st.v2 - .7);
  tl.fromTo("#bino", { opacity: 0, scale: .6 }, { opacity: 1, scale: 1, duration: .35, ease: "back.out(1.8)", immediateRender: false }, st.v2 - .4); R.sfx("lock", st.v2 - .4, .6);
  tl.fromTo("#binoE", { x: -120 }, { x: 0, duration: .8, ease: "power2.inOut", immediateRender: false }, st.v2);
  // 5. яма
  swap("spy", "pit", st.m1 - .7);
  tl.fromTo(cam, { y: 0 }, { y: 120, duration: 2, ease: "power1.inOut", immediateRender: false }, st.m1).to(cam, { y: 0, duration: .6 }, en.m2);
  // 6. верхняя точка
  swap("pit", "fw2", st.v4 - .7);
  slam("#top", st.v5, "impact"); R.punch(cam, W("v5", "рассказ"), .08);
  // 7. мораль
  swap("fw2", "moral", st.rule - .7);
  tl.fromTo("#moralCard", { opacity: 0, y: 160 }, { opacity: 1, y: 0, duration: .4, ease: "expo.out", immediateRender: false }, st.rule - .4);
  [W("rule", "плати"), W("rule", "осмотр"), W("rule", "замер"), W("rule", "забрак"), W("rule", "перехват") - .2].forEach((at, i) => { tl.fromTo(`#mo${i}`, { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: .22, immediateRender: false }, at); R.sfx("pop", at, .5); });
  ending(R, st.end - .15);
};
