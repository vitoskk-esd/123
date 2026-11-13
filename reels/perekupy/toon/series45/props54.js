// ep54 «Толян: со ста тысяч · 13 — Виталик звонит»: герои и реквизит (базовые помощники — props.js)
const VITALIK = { jacket: "#2f6db5", pants: "#2f6db5", cap: "#151515", chain: true, hair: "#1d1d1f", look: "grin" };   // из частей 11–12
const MISHA = { jacket: "#6b6b4a", vest: "#4f6d3a", pants: "#3a3f46", cap: "#3a5a3a", hair: "#b8b0a0", beard: true, look: "grin" };   // дядя Миша, рыбак
const PRADO = "prado/prado_34.png", PRADOS = "prado/prado_side.png", NIVA = "niva/niva_34.png";
Object.assign(CINE.SIZES, { [PRADO]: [732, 366], [PRADOS]: [744, 294], [NIVA]: [669, 361] });
const HUD54 = (cap, d, lis) => ({ tag: "виталик звонит", cap, d, lis });
const INHAND = (x, foot, h, arm, w, html, z = 8, rot = 0) => {
  const s = h / 740, l = x - 210 * s, t = foot - 740 * s, A = arm * Math.PI / 180;
  const hx = l + (292 + 26 * Math.cos(A) - 130 * Math.sin(A)) * s, hy = t + (400 + 26 * Math.sin(A) + 130 * Math.cos(A)) * s;
  return `<div class="prop" style="left:${hx - w / 2}px;top:${hy - w / 2}px;width:${w}px;height:${w}px;z-index:${z};transform:rotate(${rot}deg)">${html}</div>`;
};
const INHANDL = (x, foot, h, arm, w, html, z = 8, rot = 0) => INHAND(x, foot, h, -arm, w, html, z, rot).replace(/left:([\d.-]+)px/, (_, v) => `left:${2 * x - (+v + w / 2) - w / 2}px`);
// приём 1 — экран входящего звонка (на телефоне Толяна)
const CALL = (name = "Виталик (тюнинг)") => `<div style="font-family:Onest;color:#fff;text-align:center;padding-top:30px">
  <div style="font-size:30px;color:#8b93a3">входящий вызов…</div>
  <div style="width:170px;height:170px;margin:30px auto 0;border-radius:50%;background:#2f6db5;border:6px solid #fff;font-family:Unbounded;font-weight:900;font-size:90px;line-height:160px">В</div>
  <div style="margin-top:22px;font-family:Unbounded;font-weight:900;font-size:40px">${name}</div>
  <div style="display:flex;justify-content:space-around;margin-top:70px">
    <div style="width:110px;height:110px;border-radius:50%;background:#ff3b30;font-size:56px;line-height:110px">✕</div>
    <div id="callok" style="width:110px;height:110px;border-radius:50%;background:#4cd964;font-size:56px;line-height:110px">✆</div></div></div>`;
// приём 2 — «ёлочка» на зеркале и запах волнами (салон сушили — пахнет очень сильно)
const TREE = (x, y, s = 1, id = "tree") => `<div class="prop" id="${id}" style="left:${x}px;top:${y}px;width:${120 * s}px;height:${220 * s}px;z-index:9;transform-origin:50% 0">
  <svg viewBox="0 0 120 220"><path d="M60 0 v40" stroke="#151515" stroke-width="4"/><path d="M60 40 l40 50 h-20 l30 40 h-24 l30 46 h-112 l30 -46 h-24 l30 -40 h-20 z" fill="#2e9d48" stroke="#151515" stroke-width="5"/><rect x="52" y="176" width="16" height="30" fill="#8a5a33" stroke="#151515" stroke-width="4"/></svg></div>`;
const SMELL = (x, y, id = "smell") => `<div id="${id}" style="position:absolute;left:${x}px;top:${y}px;z-index:9;width:300px;height:260px">
  <svg viewBox="0 0 300 260" style="overflow:visible">${[0, 1, 2].map(k => `<path d="M${30 + k * 90} 250 q-30 -40 0 -80 q30 -40 0 -80 q-30 -40 0 -80" stroke="#4cd964" stroke-width="10" fill="none" stroke-linecap="round" opacity=".75"/>`).join("")}</svg></div>`;
// приём 3 — детектор лжи (вставка на весь кадр): лента с самописцем, игла, лампа «ЛОЖЬ»
const POLY = () => `<div style="left:0;top:0;width:1080px;height:1920px;background:linear-gradient(170deg,#2b2f37,#151515)"></div>
  <div style="left:80px;top:560px;width:920px;height:640px;background:#fbfaf3;border:12px solid #151515;border-radius:24px"></div>
  ${Array.from({ length: 8 }, (_, k) => `<div style="left:92px;top:${600 + k * 70}px;width:896px;height:3px;background:#c9d6e3"></div>`).join("")}
  <svg viewBox="0 0 920 640" style="left:80px;top:560px;width:920px;height:640px;overflow:visible"><path id="pline" d="M0 320 L120 320 L160 300 L200 340 L240 310 L300 320 L360 320 L380 120 L400 560 L420 80 L440 600 L460 140 L480 520 L500 200 L520 460 L560 320 L920 320" fill="none" stroke="#c0392b" stroke-width="8" stroke-linejoin="round"/></svg>
  <div id="lamp" style="left:300px;top:1260px;width:480px;height:150px;border-radius:30px;background:#5a1a14;border:10px solid #151515;font-family:Unbounded;font-weight:900;font-size:96px;color:#8a3a30;text-align:center;line-height:132px">ЛОЖЬ</div>
  <div style="left:80px;top:400px;font-family:'JetBrains Mono';font-weight:800;font-size:40px;color:#fff;transform:translateY(60px)">ДЕТЕКТОР ЛЖИ · вопрос 1</div>
  <div style="left:80px;top:470px;font-family:Onest;font-weight:800;font-size:44px;color:#ffd23f;transform:translateY(40px)">«Не топлёная?»</div>`;
const LAMP_ON = "background:#ff3b30;color:#fff;box-shadow:0 0 80px #ff3b30";
// приём 4 — уровень воды на боку Прадо (полоса воды поднимается до окон)
const WATER = (l, ground, w, id = "water") => { const h = w * 294 / 744, t = ground - h * .97;
  return `<div id="${id}" style="position:absolute;left:${l - 20}px;top:${t + h * .42}px;width:${w + 40}px;height:${h * .6}px;z-index:6;background:linear-gradient(#5ab0e8cc,#2f6db5aa);border-top:8px solid #bfe3f5;transform-origin:50% 100%"></div>
  <div id="${id}t" class="hand" style="left:${l + w * .1}px;top:${t + h * .42 - 90}px;z-index:9;font-size:62px;color:#2f6db5;-webkit-text-stroke:2px #151515;transform:rotate(-4deg)">уровень воды ↓</div>`; };
const DRYER = `<svg viewBox="0 0 100 100"><path d="M18 30 h50 a18 18 0 0 1 0 36 h-50 z" fill="#ff6fae" stroke="#151515" stroke-width="5"/><rect x="40" y="62" width="16" height="34" rx="5" fill="#ff6fae" stroke="#151515" stroke-width="5"/><path d="M10 38 v20" stroke="#151515" stroke-width="6"/></svg>`;
const ROD = `<svg viewBox="0 0 100 100" style="overflow:visible"><path d="M50 60 L100 -80" stroke="#6b4a2b" stroke-width="5"/><path d="M100 -80 q20 60 0 140" stroke="#c9ced6" stroke-width="2" fill="none"/><circle cx="56" cy="50" r="8" fill="#3a3f46"/></svg>`;
const FLOODCARD = () => BOTH("Prado · вся Россия", `<div id="nfl">${CARD("Toyota Prado · 2014", "700 000 ₽", "Краснодар · вчера", "⚠️ «после потопа, сушили»")}</div>`);
const NIVACARD = () => BOTH("4x4 до 600 тыс · твой город", `<div id="nnv">${CARD("Lada Niva 4x4 · 2019", "520 000 ₽", "1 хозяин · 38 000 км · деревня", "🔥 −26% к рынку · ⏱ 1 с после публикации")}</div>`);
const CTA54 = `<div style="position:absolute;left:60px;right:60px;top:1330px;z-index:70;background:#ffd23f;border:8px solid #151515;border-radius:34px;padding:26px 30px;box-shadow:0 14px 0 #151515;font-family:Unbounded;font-weight:900;color:#151515;text-align:center">
  <div style="font-size:52px;line-height:1.12">Бот <span style="color:#c0392b">«Перехват»</span><br>— ссылка в шапке</div><div style="margin-top:12px;font-size:30px;font-family:Onest;font-weight:800">объявления по всей России · через ~1 с после публикации</div></div>`;
const HALF = (frameHtml, side) => `<div class="half" style="position:absolute;left:0;top:0;width:1080px;height:1920px;clip-path:inset(0 270px 0 270px);transform:translateX(${side * 270}px)">${frameHtml}</div>`;
