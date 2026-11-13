// ep55 «Толян: со ста тысяч · 14 — Ва-банк»: герои и реквизит (базовые помощники — props.js)
const ARKASHA = { jacket: "#5a4a8a", pants: "#2b2f37", hair: "#3a2a1a", glasses: true, beard: true, look: "flat" };      // айтишник, улетает
const RINAT = { jacket: "#2f6db5", vest: "#ff7a1a", pants: "#2f6db5", cap: "#151515", hair: "#1d1d1f", mustache: true, look: "grin" };   // автоэлектрик
const OLEG = { jacket: "#3a3f46", tie: true, pants: "#2b2f37", hair: "#8a5a33", look: "grin" };                            // покупатель через бот
const NX = "lexusnx/lexusnx_34.png", NXS = "lexusnx/lexusnx_side.png";
Object.assign(CINE.SIZES, { [NX]: [755, 359], [NXS]: [756, 266] });
const HUD55 = (cap, d, lis) => ({ tag: "ва-банк", cap, d, lis });
const INHAND = (x, foot, h, arm, w, html, z = 8, rot = 0) => {
  const s = h / 740, l = x - 210 * s, t = foot - 740 * s, A = arm * Math.PI / 180;
  const hx = l + (292 + 26 * Math.cos(A) - 130 * Math.sin(A)) * s, hy = t + (400 + 26 * Math.sin(A) + 130 * Math.cos(A)) * s;
  return `<div class="prop" style="left:${hx - w / 2}px;top:${hy - w / 2}px;width:${w}px;height:${w}px;z-index:${z};transform:rotate(${rot}deg)">${html}</div>`;
};
const INHANDL = (x, foot, h, arm, w, html, z = 8, rot = 0) => INHAND(x, foot, h, -arm, w, html, z, rot).replace(/left:([\d.-]+)px/, (_, v) => `left:${2 * x - (+v + w / 2) - w / 2}px`);
// приём 1 — ва-банк: стопки фишек, которые сдвигают на центр, и штамп
const CHIPS = (x, y, id = "chips") => `<div id="${id}" style="position:absolute;left:${x}px;top:${y}px;width:360px;height:220px;z-index:12">
  ${[[0, "#c0392b"], [120, "#151515"], [240, "#2f6db5"]].map(([dx, c], k) => Array.from({ length: 6 + k }, (_, j) =>
    `<div style="position:absolute;left:${dx}px;top:${180 - j * 22}px;width:110px;height:34px;border-radius:50%;background:${c};border:5px solid #151515;box-shadow:inset 0 0 0 8px rgba(255,255,255,.55)"></div>`).join("")).join("")}</div>`;
const STAMP = (txt, l, t, id = "stamp", rot = -10, c = "#ff3b30") => `<div id="${id}" style="position:absolute;left:${l}px;top:${t}px;z-index:63;font-family:Unbounded;font-weight:900;font-size:110px;color:${c};border:12px solid ${c};border-radius:22px;padding:0 28px;transform:rotate(${rot}deg);background:rgba(0,0,0,.25)">${txt}</div>`;
// приём 2 — машинка для счёта денег: пачка пролистывается, на табло бегут цифры
const COUNTER = (x, y, id = "mcount") => `<div style="position:absolute;left:${x}px;top:${y}px;width:520px;height:420px;z-index:12">
  <div style="position:absolute;left:0;top:140px;width:520px;height:280px;border-radius:40px;background:#e8e4d8;border:10px solid #151515"></div>
  <div style="position:absolute;left:60px;top:190px;width:400px;height:110px;border-radius:14px;background:#151515;font-family:'JetBrains Mono';font-weight:800;font-size:74px;color:#4cd964;text-align:center;line-height:110px"><span id="${id}">0</span></div>
  ${Array.from({ length: 6 }, (_, j) => `<div class="bill" style="position:absolute;left:${120 + j * 6}px;top:${40 - j * 10}px;width:280px;height:120px;background:#8fd17a;border:6px solid #151515;border-radius:10px;transform-origin:50% 100%"></div>`).join("")}</div>`;
// приём 3 — приборная панель: тахометр, спидометр и мигающий Check Engine (вставка на весь кадр)
const DASH = () => `<div style="left:0;top:0;width:1080px;height:1920px;background:radial-gradient(circle at 50% 45%,#2b2f37,#0b0c10 70%)"></div>
  ${[[290, "об/мин ×1000"], [790, "км/ч"]].map(([cx, t]) => `<div style="left:${cx - 210}px;top:620px;width:420px;height:420px;border-radius:50%;background:#151515;border:12px solid #3a3f46;box-shadow:0 0 40px #2f6db566 inset"></div>
    <div style="left:${cx - 6}px;top:660px;width:12px;height:190px;background:#ff3b30;border-radius:6px;transform-origin:50% 100%;transform:rotate(-120deg)"></div>
    <div style="left:${cx - 120}px;top:930px;width:240px;text-align:center;font-family:'JetBrains Mono';font-weight:800;font-size:26px;color:#8b93a3">${t}</div>`).join("")}
  <div id="ce" style="left:390px;top:1120px;width:300px;height:200px;text-align:center;opacity:.25">
    <svg viewBox="0 0 120 80" style="width:220px;height:146px"><path d="M10 30 h20 v-12 h40 v8 h20 v-6 h18 v44 h-18 v-8 h-14 l-10 10 h-36 v-16 h-20 z" fill="#ff9a1a" stroke="#151515" stroke-width="4"/></svg>
    <div style="font-family:Unbounded;font-weight:900;font-size:40px;color:#ff9a1a">CHECK ENGINE</div></div>
  <div style="left:150px;top:1420px;width:780px;text-align:center;font-family:Onest;font-weight:800;font-size:40px;color:#8b93a3">машина не заводится</div>`;
// приём 4 — экран сканера автоэлектрика: код ошибки → цена детали
const SCAN = () => `<div style="font-family:'JetBrains Mono';color:#fff">
  <div style="font-weight:800;font-size:32px;color:#8b93a3">ДИАГНОСТИКА · Lexus NX</div>
  <div id="scan1" style="margin-top:22px;font-weight:800;font-size:64px;color:#ff9a1a">P0340</div>
  <div style="margin-top:6px;font-family:Onest;font-weight:800;font-size:34px">датчик распредвала</div>
  <div id="scan2" style="margin-top:24px;padding:16px 20px;border-radius:18px;background:#1c3a24;font-family:Onest;font-weight:900;font-size:44px;color:#4cd964">деталь — 3 000 ₽</div></div>`;
const SUITCASE = `<svg viewBox="0 0 100 100"><rect x="18" y="34" width="64" height="58" rx="8" fill="#c0392b" stroke="#151515" stroke-width="5"/><path d="M38 34 v-12 h24 v12" fill="none" stroke="#151515" stroke-width="6"/><path d="M18 60 h64" stroke="#151515" stroke-width="4"/></svg>`;
const NXCARD = () => BOTH("Lexus NX · вся Россия", `<div id="nnx">${CARD("Lexus NX 200 · 2016", "1 600 000 ₽", "рынок ≈ 2 100 000 ₽ · срочно", "🔥 −24% к рынку · ⏱ 1 с после публикации")}</div>`);
const BUYCARD = () => BOTH("Lexus NX · до 2 млн", `<div id="nby">${CARD("Lexus NX 200 · 2016", "1 830 000 ₽", "продаёт: Толян", "⏱ 1 с после публикации")}</div>`);
const CTA55 = `<div style="position:absolute;left:60px;right:60px;top:1330px;z-index:70;background:#ffd23f;border:8px solid #151515;border-radius:34px;padding:26px 30px;box-shadow:0 14px 0 #151515;font-family:Unbounded;font-weight:900;color:#151515;text-align:center">
  <div style="font-size:52px;line-height:1.12">Бот <span style="color:#c0392b">«Перехват»</span><br>— ссылка в шапке</div><div style="margin-top:12px;font-size:30px;font-family:Onest;font-weight:800">объявления по всей России · через ~1 с после публикации</div></div>`;
const HALF = (frameHtml, side) => `<div class="half" style="position:absolute;left:0;top:0;width:1080px;height:1920px;clip-path:inset(0 270px 0 270px);transform:translateX(${side * 270}px)">${frameHtml}</div>`;
