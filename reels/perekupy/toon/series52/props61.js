// ep61 «Рыбалка: клюёт только у Стаса»: герои и реквизит (базовые помощники — props.js)
const ZHORA_W = { ...ZHORA, jacket: "#4a5a3a", pants: "#2b2f37", ushanka: "#6b4a2a", cap: null };               // Жора на рыбалке: ватник, ушанка
const STAS_W = { jacket: "#c0392b", pants: "#2b2f37", ushanka: "#3a3f46", hair: "#8a5a33", look: "grin" };       // Стас в пуховике
const PALYCH = { coat: "#6a6a52", jacket: "#6a6a52", pants: "#3a3a3a", hair: "#d4d4d4", beard: true, ushanka: "#8a6a4a", look: "grin" };   // дед Палыч, продаёт Прадо
const NIVA = "niva/niva_34.png", PRADO = "prado/prado_34.png", PRADO_S = "prado/prado_side.png";
Object.assign(CINE.SIZES, { [NIVA]: [669, 361], [PRADO]: [732, 366], [PRADO_S]: [744, 294] });
const INHAND = (x, foot, h, arm, w, html, z = 8, rot = 0, id = "") => {
  const s = h / 740, l = x - 210 * s, t = foot - 740 * s, A = arm * Math.PI / 180;
  const hx = l + (292 + 26 * Math.cos(A) - 130 * Math.sin(A)) * s, hy = t + (400 + 26 * Math.sin(A) + 130 * Math.cos(A)) * s;
  return `<div class="prop"${id ? ` id="${id}"` : ""} style="left:${hx - w / 2}px;top:${hy - w / 2}px;width:${w}px;height:${w}px;z-index:${z};transform:rotate(${rot}deg)">${html}</div>`;
};
// точка руки (для лески)
const HANDPT = (x, foot, h, arm) => { const s = h / 740, l = x - 210 * s, t = foot - 740 * s, A = arm * Math.PI / 180;
  return [l + (292 + 26 * Math.cos(A) - 130 * Math.sin(A)) * s, t + (400 + 26 * Math.sin(A) + 130 * Math.cos(A)) * s]; };
// обложка (кадр 0) — плашка названия как у #title шаблона
const TITLE = (a, b) => `<div style="position:absolute;left:0;right:0;top:300px;text-align:center;font-family:Unbounded;font-weight:900;line-height:1;letter-spacing:-3px;z-index:50">
  <span style="display:inline-block;padding:10px 28px 18px;border:8px solid #151515;border-radius:22px;box-shadow:0 12px 0 #151515;font-size:82px;background:#ffd23f;color:#151515;transform:rotate(-3deg)">${a}</span><br>
  <span style="display:inline-block;padding:10px 28px 18px;border:8px solid #151515;border-radius:22px;box-shadow:0 12px 0 #151515;font-size:96px;background:#ff3b30;color:#fff;margin-top:26px;transform:rotate(2deg)">${b}</span></div>`;
// лунка во льду
const HOLE = (x, y, w = 200, z = 3) => `<div style="left:${x - w / 2}px;top:${y - w * .18}px;width:${w}px;height:${w * .36}px;z-index:${z}"><svg viewBox="0 0 200 72" style="overflow:visible">
  <ellipse cx="100" cy="36" rx="100" ry="34" fill="#e8f2f8" stroke="#9fc2d6" stroke-width="5"/><ellipse cx="100" cy="38" rx="70" ry="22" fill="#163650" stroke="#151515" stroke-width="5"/>
  <path d="M40 38 q20 -10 40 -4" stroke="#3f6f90" stroke-width="5" fill="none"/>${[[14, 20], [176, 24], [30, 60], [170, 56]].map(([a, b]) => `<path d="M${a} ${b} l10 -6 l6 10 z" fill="#fff" stroke="#9fc2d6" stroke-width="3"/>`).join("")}</svg></div>`;
// зимняя удочка в руке: короткое удилище вниз-вперёд + кивок; леска от кончика до лунки — отдельной линией LINE
const ROD = `<svg viewBox="0 0 100 100" style="overflow:visible"><rect x="40" y="38" width="26" height="40" rx="8" fill="#2b2f37" stroke="#151515" stroke-width="5"/>
  <path d="M60 52 L190 150" stroke="#151515" stroke-width="9" stroke-linecap="round"/><path d="M60 52 L190 150" stroke="#e6b422" stroke-width="4" stroke-linecap="round"/></svg>`;
const LINE = (x1, y1, x2, y2, id = "", z = 9) => `<svg${id ? ` id="${id}"` : ""} style="position:absolute;left:0;top:0;width:1080px;height:1920px;overflow:visible;z-index:${z}" viewBox="0 0 1080 1920"><path d="M${x1} ${y1} Q${(x1 + x2) / 2 + 10} ${(y1 + y2) / 2 + 20} ${x2} ${y2}" stroke="#151515" stroke-width="3" fill="none" opacity=".8"/></svg>`;
// приём 1 — разрез подо льдом: у Жоры — мотыль, рыбы уплывают; у Стаса — светящийся телефон-«приманка», рыбы толпятся
const FISH = (x, y, s = 1, flip = false, id = "", col = "#9aa86a") => `<div class="prop"${id ? ` id="${id}"` : ""} style="left:${x}px;top:${y}px;width:${160 * s}px;height:${80 * s}px;z-index:6;transform:scaleX(${flip ? -1 : 1})"><svg viewBox="0 0 160 80" style="overflow:visible">
  <path d="M10 40 Q60 0 120 40 Q60 80 10 40 Z" fill="${col}" stroke="#151515" stroke-width="5"/><path d="M118 40 L156 14 L150 40 L156 66 Z" fill="${col}" stroke="#151515" stroke-width="5"/>
  <circle cx="34" cy="34" r="7" fill="#fff" stroke="#151515" stroke-width="3"/><circle cx="32" cy="34" r="3" fill="#151515"/><path d="M60 20 q16 20 0 40" stroke="#151515" stroke-width="3" fill="none" opacity=".5"/></svg></div>`;
const WORM = (x, y) => `<div class="prop" style="left:${x - 30}px;top:${y}px;width:60px;height:90px;z-index:6"><svg viewBox="0 0 60 90" style="overflow:visible"><path d="M30 0 V40 q0 18 -14 18" stroke="#c9ccd2" stroke-width="5" fill="none"/><path d="M14 54 q20 -6 22 10 q2 16 18 12" stroke="#c0392b" stroke-width="9" fill="none" stroke-linecap="round"/></svg></div>`;
const LURE = (x, y, id = "lure") => `<div class="prop" id="${id}" style="left:${x - 95}px;top:${y}px;width:190px;height:320px;z-index:6;filter:drop-shadow(0 0 40px #8fe0ff)">
  <div style="position:absolute;left:0;top:0;width:190px;height:320px;border-radius:30px;background:#0d0e12;border:9px solid #2a2d34"><div style="position:absolute;inset:16px;border-radius:14px;background:linear-gradient(#ffd23f,#ff7a1a);font-family:Unbounded;font-weight:900;font-size:36px;color:#151515;text-align:center;padding-top:80px;line-height:1.15">БОТ<br>🎣</div></div></div>`;
const UNDER = () => `${WORM(330, 640)}${LINE(330, 470, 330, 640, "", 5)}${LINE(800, 470, 800, 600, "", 5)}${LURE(800, 600)}
  ${FISH(20, 1150, 1.8, false, "fz1")}${FISH(60, 1520, 1.5, false, "fz2", "#7a9a8a")}
  ${FISH(470, 780, 1.6, true, "fs1")}${FISH(880, 860, 1.6, false, "fs2", "#7a9a8a")}${FISH(480, 1040, 1.8, true, "fs3", "#a8986a")}${FISH(860, 1100, 1.5, false, "fs4")}${FISH(600, 1280, 1.7, true, "fs5", "#7a9a8a")}`;
// приём 2 — поплавок-уведомление: огромный красно-белый поплавок над головой, ныряет на каждое сообщение бота
const BOBBER = (x, y, id = "bob", w = 170) => `<div id="${id}" style="position:absolute;left:${x - w / 2}px;top:${y}px;width:${w}px;height:${w * 1.7}px;z-index:40"><svg viewBox="0 0 100 170" style="overflow:visible">
  <path d="M50 0 V30" stroke="#151515" stroke-width="5"/><path d="M50 30 C90 30 92 90 50 100 C8 90 10 30 50 30 Z" fill="#ff3b30" stroke="#151515" stroke-width="6"/>
  <path d="M50 100 C92 110 88 150 50 168 C12 150 8 110 50 100 Z" fill="#fbfaf3" stroke="#151515" stroke-width="6"/><path d="M30 50 q10 -12 22 -10" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round"/>
  <text x="50" y="146" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="22" fill="#151515">1 с</text></svg>
  <div class="wave" style="position:absolute;left:-60%;right:-60%;top:62%;height:20px;border-bottom:7px solid #8fe0ff;border-radius:50%;opacity:.8"></div></div>`;
// приём 3 — Жора замерзает: снежная шапка на ушанке, иней, сосульки на усах, термометр
const FROST = (x, foot, h, id = "frost") => { const s = h / 740, l = x - 210 * s, t = foot - 740 * s;
  return `<div id="${id}" style="position:absolute;left:${l}px;top:${t}px;width:${420 * s}px;height:${800 * s}px;z-index:12"><svg viewBox="0 0 420 800" style="overflow:visible">
  <path id="${id}s" transform="translate(0 -58) scale(1 1.15)" d="M118 150 q30 -60 92 -62 q62 2 92 62 q-10 -14 -30 -10 q-20 -24 -62 -22 q-42 -2 -62 22 q-20 -4 -30 10 z" fill="#fbfdff" stroke="#9fc2d6" stroke-width="5"/>
  <g id="${id}i">${[176, 196, 222, 244].map((x, k) => `<path d="M${x} 300 l6 ${22 + (k % 2) * 12} l6 ${-22 - (k % 2) * 12} z" fill="#d8f0ff" stroke="#7fb6d6" stroke-width="3"/>`).join("")}
  ${[[140, 380], [280, 420], [180, 520], [260, 600], [150, 640]].map(([a, b]) => `<path d="M${a} ${b} l14 0 M${a + 7} ${b - 7} l0 14 M${a + 2} ${b - 5} l10 10 M${a + 12} ${b - 5} l-10 10" stroke="#e8f6ff" stroke-width="4"/>`).join("")}</g></svg></div>`; };
const THERMO = (x, y, deg, id = "thermo") => `<div id="${id}" style="position:absolute;left:${x}px;top:${y}px;width:120px;height:420px;z-index:40"><svg viewBox="0 0 120 420">
  <rect x="30" y="10" width="60" height="330" rx="30" fill="#fbfaf3" stroke="#151515" stroke-width="7"/><circle cx="60" cy="360" r="46" fill="#2f8fe0" stroke="#151515" stroke-width="7"/>
  <rect id="${id}c" x="48" y="${120 + (30 + deg) * 4}" width="24" height="${240 - (30 + deg) * 4}" fill="#2f8fe0"/>
  ${[0, 1, 2, 3, 4, 5].map(k => `<path d="M30 ${60 + k * 50} h18" stroke="#151515" stroke-width="5"/>`).join("")}</svg>
  <div id="${id}t" style="position:absolute;left:-60px;top:-96px;width:240px;text-align:center;font-family:Unbounded;font-weight:900;font-size:68px;color:#fff;-webkit-text-stroke:4px #151515;paint-order:stroke">${deg}°</div></div>`;
// приём 4 — сапог на крючке + брызги
const BOOT = `<svg viewBox="0 0 200 220" style="overflow:visible"><path d="M100 0 V40" stroke="#151515" stroke-width="4"/><path d="M60 40 h80 v110 q0 10 10 14 l40 14 q16 8 10 26 v12 H40 q-10 0 -10 -10 V40 z" fill="#3a3f2e" stroke="#151515" stroke-width="7"/>
  <path d="M60 40 h80 v24 h-80 z" fill="#2b2f22" stroke="#151515" stroke-width="5"/><path d="M40 196 H200" stroke="#151515" stroke-width="10"/>
  ${[[50, 230], [120, 250], [180, 232], [80, 270]].map(([a, b]) => `<path d="M${a} ${b} q-8 14 0 20 q8 -6 0 -20 z" fill="#8fe0ff" stroke="#151515" stroke-width="3"/>`).join("")}</svg>`;
const SPLASH = (x, y, id = "spl", w = 360) => `<div id="${id}" style="position:absolute;left:${x - w / 2}px;top:${y - w * .5}px;width:${w}px;height:${w * .6}px;z-index:14"><svg viewBox="0 0 360 216" style="overflow:visible">
  ${[[-70, 110], [-40, 150], [-10, 170], [20, 165], [50, 140], [80, 105]].map(([a, h], k) => `<path d="M180 210 q${a * .6} ${-h * .6} ${a} ${-h} q10 20 ${-a * .4 + (a > 0 ? -10 : 10)} ${h}" fill="#bfe8ff" stroke="#151515" stroke-width="5"/>`).join("")}
  ${[[90, 40], [270, 30], [140, 10], [230, 60]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r="12" fill="#bfe8ff" stroke="#151515" stroke-width="4"/>`).join("")}</svg></div>`;
// бот на экране у Стаса
const PRCARD = () => BOTH("Prado · до 2,5 млн", `<div id="pcc">${CARD("Toyota Land Cruiser Prado · 2013", "2 250 000 ₽", "рынок ≈ 2 550 000 ₽ · 1 владелец · 300 м от вас", "🔥 −12% к рынку · ⏱ 1 с после публикации")}</div>`);
const CTA61 = `<div style="position:absolute;left:60px;right:60px;top:1330px;z-index:70;background:#ffd23f;border:8px solid #151515;border-radius:34px;padding:26px 30px;box-shadow:0 14px 0 #151515;font-family:Unbounded;font-weight:900;color:#151515;text-align:center">
  <div style="font-size:52px;line-height:1.12">Бот <span style="color:#c0392b">«Перехват»</span><br>— ссылка в шапке</div><div style="margin-top:12px;font-size:30px;font-family:Onest;font-weight:800">объявления по всей России · через ~1 с после публикации</div></div>`;
