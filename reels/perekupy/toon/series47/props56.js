// ep56 «Толян: со ста тысяч · 15 — Миллион» (финал): герои и реквизит (базовые помощники — props.js)
const SEMENYCH = { jacket: "#5a6a3a", pants: "#3a4a2a", cap: "#3a4a2a", hair: "#d9d9d9", mustache: true, look: "flat" };   // полковник в отставке, продаёт W124 на даче
const ARTUR = { jacket: "#f4f6f8", tie: true, pants: "#f4f6f8", hair: "#1d1d1f", beard: true, look: "grin" };              // свадебный кортеж
const MAX = { jacket: "#151515", vest: "#ff3bd0", pants: "#2b2f37", cap: "#ff3bd0", hair: "#1d1d1f", look: "grin" };        // японщик-дрифтер, продаёт Mark II
const MK = "markii/markii_cherry.png", W1 = "w124/w124_34.png", W1S = "w124/w124_side.png";
Object.assign(CINE.SIZES, { [MK]: [983, 467], [W1]: [746, 327], [W1S]: [732, 233] });
const HUD56 = (cap, d, lis) => ({ tag: "финал", cap, d, lis });
const INHAND = (x, foot, h, arm, w, html, z = 8, rot = 0) => {
  const s = h / 740, l = x - 210 * s, t = foot - 740 * s, A = arm * Math.PI / 180;
  const hx = l + (292 + 26 * Math.cos(A) - 130 * Math.sin(A)) * s, hy = t + (400 + 26 * Math.sin(A) + 130 * Math.cos(A)) * s;
  return `<div class="prop" style="left:${hx - w / 2}px;top:${hy - w / 2}px;width:${w}px;height:${w}px;z-index:${z};transform:rotate(${rot}deg)">${html}</div>`;
};
const INHANDL = (x, foot, h, arm, w, html, z = 8, rot = 0) => INHAND(x, foot, h, -arm, w, html, z, rot).replace(/left:([\d.-]+)px/, (_, v) => `left:${2 * x - (+v + w / 2) - w / 2}px`);
const KEYS = `<svg viewBox="0 0 100 100"><circle cx="34" cy="30" r="18" fill="none" stroke="#c9ced6" stroke-width="7"/><rect x="40" y="40" width="34" height="56" rx="12" fill="#151515" stroke="#000" stroke-width="4"/><ellipse cx="57" cy="60" rx="10" ry="7" fill="none" stroke="#c9ced6" stroke-width="3"/></svg>`;
const ENVELOPE = `<svg viewBox="0 0 100 100"><rect x="8" y="26" width="84" height="54" rx="4" fill="#f1e6d2" stroke="#151515" stroke-width="5"/><path d="M8 28 L50 58 L92 28" fill="none" stroke="#151515" stroke-width="4"/><rect x="22" y="14" width="56" height="20" fill="#8fd17a" stroke="#151515" stroke-width="3"/></svg>`;
// приём 1 — холодный старт в «кинорамке»: чёрные полосы сверху и снизу, текст в полосах (вместо обычной плашки серии)
const LETTERBOX = (top, bot, id = "lbx") => `<div id="${id}" style="position:absolute;inset:0;z-index:75;pointer-events:none">
  <div class="lbt" style="position:absolute;left:0;right:0;top:0;height:250px;background:#000;display:flex;align-items:flex-end;justify-content:center;padding-bottom:34px;font-family:Unbounded;font-weight:900;font-size:50px;color:#fff;letter-spacing:1px">${top}</div>
  <div class="lbb" style="position:absolute;left:0;right:0;bottom:0;height:250px;background:#000;display:flex;align-items:flex-start;justify-content:center;padding-top:40px;font-family:'JetBrains Mono';font-weight:800;font-size:36px;color:#ffd23f;letter-spacing:4px">${bot}</div></div>`;
// приём 2 — VHS-перемотка: полоски помех, «◀◀ ПЕРЕМОТКА», полароиды прошлых сделок, счётчик капитала бежит (вставка на весь кадр)
const POLS = [["ч.3", "vaz2109/vaz2109.png", "ВАЗ-2109"], ["ч.4", "vaz2110/vaz2110_34.png", "ВАЗ-2110"], ["ч.6", "camry/camry.png", "Camry"],
  ["ч.8", "evo/evo_34.png", "Lancer Evo"], ["ч.13", "prado/prado_34.png", "Prado"], ["ч.14", "lexusnx/lexusnx_34.png", "Lexus NX"]];
const REW = () => `<div style="left:0;top:0;width:1080px;height:1920px;background:radial-gradient(circle at 50% 45%,#23263a,#07080c 75%)"></div>
  ${POLS.map(([p, img, n], k) => { const x = 70 + (k % 2) * 490, y = 330 + Math.floor(k / 2) * 400, r = [-6, 5, 4, -5, -3, 6][k];
    return `<div class="pol" id="pol${k}" style="left:${x}px;top:${y}px;width:450px;height:360px;background:#fbfaf3;border:6px solid #151515;transform:rotate(${r}deg);box-shadow:0 18px 0 #00000088">
      <div style="position:absolute;left:18px;top:18px;width:402px;height:240px;background:#c9d6e3;overflow:hidden"><img src="../../kit/img/${img}" style="position:absolute;left:12px;top:30px;width:378px"></div>
      <div style="position:absolute;left:18px;top:270px;font-family:Caveat;font-weight:700;font-size:44px;color:#151515">${p} · ${n}</div></div>`; }).join("")}
  <div style="left:0;top:0;width:1080px;height:1920px;background:repeating-linear-gradient(#ffffff0a 0 2px,transparent 2px 6px)"></div>
  ${[[520, 26], [980, 14], [1460, 34]].map(([y, h], k) => `<div class="trk" id="trk${k}" style="left:0;top:${y}px;width:1080px;height:${h}px;background:linear-gradient(90deg,#ffffff00,#ffffff55,#ffffff22,#ffffff66,#ffffff00);mix-blend-mode:screen"></div>`).join("")}
  <div style="left:60px;top:120px;font-family:'JetBrains Mono';font-weight:800;font-size:58px;color:#fff;text-shadow:0 0 18px #9fd0ff">◀◀ ПЕРЕМОТКА</div>
  <div style="left:700px;top:132px;font-family:'JetBrains Mono';font-weight:800;font-size:40px;color:#fff">−7 ДНЕЙ</div>
  <div style="left:90px;top:1560px;width:900px;height:200px;border-radius:30px;background:#000c;border:6px solid #4cd964;text-align:center;font-family:'JetBrains Mono';font-weight:800;font-size:120px;line-height:190px;color:#4cd964"><span id="rewc">930 000</span> ₽</div>`;
// приём 3 — миллион: табло прокручивается за 1 000 000, золото, конфетти
const MILLION = (x, y, id = "mil") => `<div id="${id}" style="position:absolute;left:${x}px;top:${y}px;z-index:64;width:920px;text-align:center">
  <div style="display:inline-block;padding:10px 34px;border-radius:30px;background:linear-gradient(#ffe27a,#e6b422);border:10px solid #151515;box-shadow:0 14px 0 #151515;font-family:'JetBrains Mono';font-weight:800;font-size:116px;color:#151515"><span id="${id}n">1 020 000</span> ₽</div>
  <div style="margin-top:24px;font-family:Unbounded;font-weight:900;font-size:60px;color:#fff;-webkit-text-stroke:3px #151515">МИЛЛИОН ЕСТЬ</div></div>`;
const CONFETTI = (id = "conf", n = 70, seed = 7) => { let r = seed; const rnd = () => (r = (r * 9301 + 49297) % 233280) / 233280;
  return `<div id="${id}" style="position:absolute;inset:0;z-index:30;pointer-events:none">${Array.from({ length: n }, () => {
    const c = ["#ffd23f", "#ff3b30", "#4cd964", "#2f6db5", "#ff6fae", "#fff"][Math.floor(rnd() * 6)];
    return `<div class="cf1" style="position:absolute;left:${Math.round(rnd() * 1060)}px;top:${Math.round(rnd() * 1500) + 120}px;width:${14 + Math.round(rnd() * 14)}px;height:${26 + Math.round(rnd() * 16)}px;background:${c};border:3px solid #151515;transform:rotate(${Math.round(rnd() * 360)}deg)"></div>`; }).join("")}</div>`; };
// приём 4 — было / стало: кадр разрезан, слева сепия «часть 1», справа цвет «часть 15»
const BA = (leftHtml, rightHtml) => `<div class="ba" id="baL" style="position:absolute;inset:0;z-index:20;clip-path:inset(0 540px 0 0);filter:grayscale(1) sepia(.6) contrast(1.05)">${leftHtml}</div>
  <div class="ba" id="baR" style="position:absolute;inset:0;z-index:20;clip-path:inset(0 0 0 540px)">${rightHtml}</div>
  <div id="baD" style="position:absolute;left:532px;top:0;width:16px;height:1920px;background:#fff;box-shadow:0 0 30px #000;z-index:21"></div>
  <div style="position:absolute;left:40px;top:300px;z-index:22;font-family:Unbounded;font-weight:900;font-size:56px;color:#fff;background:#151515;padding:6px 22px;border-radius:16px">БЫЛО</div>
  <div style="position:absolute;left:580px;top:300px;z-index:22;font-family:Unbounded;font-weight:900;font-size:56px;color:#ffd23f;background:#151515;padding:6px 22px;border-radius:16px">СТАЛО</div>`;
const BAPANE = (bg, inner) => `<div class="grp" style="position:absolute;inset:0">${C.bgSvg(bg)}${inner}</div>`;
// свадебный декор на W124: кольца на крыше и бант на капоте (l, ground, w — как у car)
const WEDDING = (l, ground, w) => { const h = w * 327 / 746, t = ground - h;
  return `<div class="prop" style="left:${l + w * .5}px;top:${t - 70}px;width:150px;height:110px;z-index:6"><svg viewBox="0 0 150 110"><circle cx="55" cy="55" r="38" fill="none" stroke="#e6b422" stroke-width="12"/><circle cx="95" cy="55" r="38" fill="none" stroke="#e6b422" stroke-width="12"/><path d="M75 105 v-20" stroke="#151515" stroke-width="6"/></svg></div>
    <div class="prop" style="left:${l + w * .2}px;top:${t + h * .38}px;width:120px;height:80px;z-index:6"><svg viewBox="0 0 120 80"><path d="M60 40 L10 10 L14 70 Z M60 40 L110 10 L106 70 Z" fill="#fff" stroke="#151515" stroke-width="5"/><circle cx="60" cy="40" r="13" fill="#ff6fae" stroke="#151515" stroke-width="5"/></svg></div>`; };
// линии скорости (Mark II едет)
const SPEED = (y0 = 1100, y1 = 1700, id = "spd") => `<div id="${id}" style="position:absolute;inset:0;z-index:9;pointer-events:none">${Array.from({ length: 14 }, (_, k) =>
  `<div style="position:absolute;left:${(k * 173) % 1000}px;top:${y0 + (k * 97) % (y1 - y0)}px;width:${160 + (k * 53) % 200}px;height:6px;border-radius:3px;background:#ffffffaa"></div>`).join("")}</div>`;
const W124CARD = () => BOTH("Mercedes · до 500 тыс", `<div id="nwc">${CARD("Mercedes W124 · 1993", "430 000 ₽", "рынок ≈ 520 000 ₽ · 1 хозяин · дача", "🔥 −17% к рынку · ⏱ 1 с после публикации")}</div>`);
const ARTCARD = () => BOTH("Ретро для свадеб", `<div id="nac">${CARD("Mercedes W124 · 1993", "520 000 ₽", "продаёт: Толян", "⏱ 1 с после публикации")}</div>`);
const MKFILTER = () => `<div style="font-family:Onest;color:#fff"><div style="font-weight:700;font-size:34px;color:#8b93a3">ПЕРЕХВАТ · бот</div>
  <div style="margin-top:14px;padding:18px 22px;border-radius:22px;background:#1c1f26;font-weight:800;font-size:34px">Фильтр: <span style="color:#ffd23f">Mark II · JZX100<br>Tourer V</span> · для себя</div>
  <div id="nmk">${CARD("Toyota Mark II Tourer V · 1999", "900 000 ₽", "рынок ≈ 1 150 000 ₽ · 1JZ-GTE · ручка", "🔥 −22% к рынку · ⏱ 1 с после публикации")}</div></div>`;
const CTA56 = `<div style="position:absolute;left:60px;right:60px;top:1330px;z-index:70;background:#ffd23f;border:8px solid #151515;border-radius:34px;padding:26px 30px;box-shadow:0 14px 0 #151515;font-family:Unbounded;font-weight:900;color:#151515;text-align:center">
  <div style="font-size:52px;line-height:1.12">Бот <span style="color:#c0392b">«Перехват»</span><br>— ссылка в шапке</div><div style="margin-top:12px;font-size:30px;font-family:Onest;font-weight:800">объявления по всей России · через ~1 с после публикации</div></div>`;
const HALF = (frameHtml, side) => `<div class="half" style="position:absolute;left:0;top:0;width:1080px;height:1920px;clip-path:inset(0 270px 0 270px);transform:translateX(${side * 270}px)">${frameHtml}</div>`;
const BIGTAG = (x, y, big, small, rot = -4, bg = "#ffd23f") => `<div style="position:absolute;left:${x}px;top:${y}px;z-index:9;transform:rotate(${rot}deg);background:${bg};border:6px solid #151515;border-radius:14px;padding:8px 18px;box-shadow:0 8px 0 #151515;font-family:Unbounded;font-weight:900;font-size:44px;color:#151515;line-height:1.1">${big}<div style="font-family:'JetBrains Mono';font-weight:800;font-size:32px">${small}</div></div>`;
