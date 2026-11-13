// ep53 «ОГРАБЛЕНИЕ ВЕКА» («Простой ролик 3»): герои и реквизит (базовые помощники — props.js)
const GENA = { jacket: "#3a3f46", vest: "#151515", tie: true, pants: "#2b2f37", hair: "#1d1d1f", glasses: true, look: "flat" };     // мозг
const VALERA = { jacket: "#c0392b", pants: "#2b2f37", cap: "#151515", chain: true, hair: "#3a2a1a", shades: true, look: "grin" };  // водила
const KOSTIK = { jacket: "#4f9d48", pants: "#2f6db5", hair: "#e8a33a", glasses: true, look: "grin" };                              // технарь
const DED = { coat: "#6b4a2b", jacket: "#6b4a2b", pants: "#3a3f46", cap: "#3a3f46", hair: "#e8e4d8", mustache: true, glasses: true, look: "grin" };  // дед Фёдор
const TARGET = "lexusnx/lexusnx_34.png", TARGETS = "lexusnx/lexusnx_side.png", CREW = "w124/w124_34.png", CREWS = "w124/w124_side.png";   // цель — Lexus NX (лист владельца 13.11)
Object.assign(CINE.SIZES, { [TARGET]: [755, 359], [TARGETS]: [756, 266], [CREW]: [746, 327], [CREWS]: [732, 233] });
const HUD53 = (lis) => ({ tag: "ограбление века", lis });
// карточка героя, как в фильмах про ограбление: стоп-кадр + имя и роль
const ROLE = (name, role, l, t, rot = -4, id = "") => `<div${id ? ` id="${id}"` : ""} style="position:absolute;left:${l}px;top:${t}px;z-index:62;transform:rotate(${rot}deg);background:#151515;border:6px solid #ffd23f;padding:10px 22px 14px;box-shadow:0 10px 0 rgba(0,0,0,.4)">
  <div style="font-family:Unbounded;font-weight:900;font-size:56px;color:#ffd23f;line-height:1">${name}</div><div style="font-family:'JetBrains Mono';font-weight:800;font-size:30px;color:#fff;margin-top:6px">${role}</div></div>`;
// большой отсчёт времени
const CLOCK = (txt = "07:59:58", id = "clk", c = "#ff3b30") => `<div id="${id}" style="position:absolute;left:90px;right:90px;top:620px;z-index:62;text-align:center;font-family:'JetBrains Mono';font-weight:800;font-size:150px;color:${c};
  background:#0d0e12;border:10px solid ${c};border-radius:30px;padding:10px 0;box-shadow:0 0 50px ${c}66,0 14px 0 #151515;font-variant-numeric:tabular-nums">${txt}</div>`;
// карта маршрута погони: дворы, «без светофоров», точка-цель
const MAP = () => `<div style="left:0;top:0;width:1080px;height:1920px;background:#e8e4d8"></div>
  ${Array.from({ length: 9 }, (_, k) => `<div style="left:${k * 130 - 40}px;top:0;width:34px;height:1920px;background:#fbfaf3"></div>`).join("")}
  ${Array.from({ length: 13 }, (_, k) => `<div style="left:0;top:${k * 150 + 20}px;width:1080px;height:30px;background:#fbfaf3"></div>`).join("")}
  ${Array.from({ length: 14 }, (_, k) => `<div style="left:${(k % 4) * 270 + 40}px;top:${Math.floor(k / 4) * 450 + 70}px;width:${150 + (k % 3) * 40}px;height:${200 + (k % 2) * 80}px;background:#cfc8b6;border-radius:12px"></div>`).join("")}
  <svg viewBox="0 0 1080 1920" style="left:0;top:0;width:1080px;height:1920px;overflow:visible"><path id="route" d="M150 1650 L150 1370 L410 1370 L410 1070 L670 1070 L670 770 L930 770 L930 470" fill="none" stroke="#c0392b" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="40 26"/></svg>
  <div style="left:880px;top:390px;width:100px;height:100px;border-radius:50%;background:#c0392b;border:8px solid #151515;color:#fff;font-family:Unbounded;font-weight:900;font-size:44px;text-align:center;line-height:84px">✕</div>
  <div style="left:620px;top:310px;font-family:Unbounded;font-weight:900;font-size:40px;color:#151515;background:#ffd23f;border:5px solid #151515;padding:4px 14px;transform:rotate(-4deg)">ЦЕЛЬ · LEXUS NX</div>`;
// полосы скорости (погоня)
const SPEED = (y0, y1, n = 14) => Array.from({ length: n }, (_, k) => `<div class="spd" style="left:${(k * 137) % 1000 - 100}px;top:${y0 + (k * 53) % (y1 - y0)}px;width:${200 + (k % 4) * 90}px;height:8px;border-radius:4px;background:#fff;opacity:.35;z-index:3"></div>`).join("");
// штамп поверх стоп-кадра
const STAMP = (txt, l, t, id = "stamp", rot = -10) => `<div id="${id}" style="position:absolute;left:${l}px;top:${t}px;z-index:63;font-family:Unbounded;font-weight:900;font-size:96px;color:#ff3b30;border:12px solid #ff3b30;border-radius:22px;padding:0 26px;transform:rotate(${rot}deg);background:rgba(255,255,255,.08)">${txt}</div>`;
const RADIO = `<svg viewBox="0 0 100 100"><rect x="30" y="20" width="40" height="72" rx="8" fill="#2b2f37" stroke="#151515" stroke-width="5"/><path d="M60 20 V2" stroke="#151515" stroke-width="6" stroke-linecap="round"/><rect x="36" y="30" width="28" height="18" rx="3" fill="#4cd964"/>${[0, 1, 2].map(k => `<path d="M38 ${60 + k * 9} h24" stroke="#8a929b" stroke-width="4"/>`).join("")}</svg>`;
const KEYS = `<svg viewBox="0 0 100 100"><circle cx="34" cy="34" r="20" fill="none" stroke="#8a929b" stroke-width="8"/><rect x="44" y="44" width="16" height="44" rx="5" fill="#151515" transform="rotate(-40 52 66)"/><path d="M58 52 l26 26 l-6 6 l-6 -6 l-4 4 l-6 -6" fill="#c9ced6" stroke="#151515" stroke-width="3"/></svg>`;
const CTA53 = `<div style="position:absolute;left:60px;right:60px;top:1330px;z-index:70;background:#ffd23f;border:8px solid #151515;border-radius:34px;padding:26px 30px;box-shadow:0 14px 0 #151515;font-family:Unbounded;font-weight:900;color:#151515;text-align:center">
  <div style="font-size:52px;line-height:1.12">Бот <span style="color:#c0392b">«Перехват»</span><br>— ссылка в шапке</div><div style="margin-top:12px;font-size:30px;font-family:Onest;font-weight:800">объявления по всей России · через ~1 с после публикации</div></div>`;
const INHAND = (x, foot, h, arm, w, html, z = 8, rot = 0) => {
  const s = h / 740, l = x - 210 * s, t = foot - 740 * s, A = arm * Math.PI / 180;
  const hx = l + (292 + 26 * Math.cos(A) - 130 * Math.sin(A)) * s, hy = t + (400 + 26 * Math.sin(A) + 130 * Math.cos(A)) * s;
  return `<div class="prop" style="left:${hx - w / 2}px;top:${hy - w / 2}px;width:${w}px;height:${w}px;z-index:${z};transform:rotate(${rot}deg)">${html}</div>`;
};
const INHANDL = (x, foot, h, arm, w, html, z = 8, rot = 0) => INHAND(x, foot, h, -arm, w, html, z, rot).replace(/left:([\d.-]+)px/, (_, v) => `left:${2 * x - (+v + w / 2) - w / 2}px`);
const HALF = (frameHtml, side) => `<div class="half" style="position:absolute;left:0;top:0;width:1080px;height:1920px;clip-path:inset(0 270px 0 270px);transform:translateX(${side * 270}px)">${frameHtml}</div>`;
