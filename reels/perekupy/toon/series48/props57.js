// ep57 «Суд: перекупы против бота»: герои и реквизит (базовые помощники — props.js)
const JUDGE = { jacket: "#151515", pants: "#151515", hair: "#d9d9d9", glasses: true, beard: true, look: "flat" };              // судья Аркадий Палыч
const NINA = { coat: "#4a6a8a", jacket: "#4a6a8a", pants: "#3a3f56", hair: "#d9d9d9", scarf: "#e04a3a", look: "grin" };      // баба Нина, продавала «пятёрку»
const STAS = { jacket: "#3a3f46", pants: "#2b2f37", cap: "#2f6db5", hair: "#8a5a33", look: "o" };                            // перекуп Стас, три дня жал F5
const V5 = "vaz2105/vaz2105_34.png", V5S = "vaz2105/vaz2105_side.png";
Object.assign(CINE.SIZES, { [V5]: [775, 352], [V5S]: [756, 266] });
const HUD57 = () => ({ tag: "суд" });
const INHAND = (x, foot, h, arm, w, html, z = 8, rot = 0) => {
  const s = h / 740, l = x - 210 * s, t = foot - 740 * s, A = arm * Math.PI / 180;
  const hx = l + (292 + 26 * Math.cos(A) - 130 * Math.sin(A)) * s, hy = t + (400 + 26 * Math.sin(A) + 130 * Math.cos(A)) * s;
  return `<div class="prop" style="left:${hx - w / 2}px;top:${hy - w / 2}px;width:${w}px;height:${w}px;z-index:${z};transform:rotate(${rot}deg)">${html}</div>`;
};
// судейская трибуна поверх судьи (в фоне она есть, но персонаж стоит в среднем слое — перекрываем его ноги)
const BENCH = (z = 8) => `<div style="left:160px;top:760px;width:760px;height:480px;z-index:${z};background:#5a3820;border:7px solid #000;box-sizing:border-box"></div>
  <div style="left:140px;top:730px;width:800px;height:50px;z-index:${z};background:#7a4e2c;border:7px solid #000;box-sizing:border-box"></div>
  ${[200, 440, 680].map(x => `<div style="left:${x}px;top:820px;width:200px;height:360px;z-index:${z};border:6px solid #3e2614;border-radius:8px;box-sizing:border-box"></div>`).join("")}
  <div style="left:410px;top:850px;width:260px;height:70px;z-index:${z};background:#e6b422;border:5px solid #000;border-radius:8px;box-sizing:border-box;text-align:center;font-family:Unbounded;font-weight:900;font-size:34px;line-height:60px;color:#151515">СУДЬЯ</div>`;
// трибуна свидетеля / истца (перед нижней частью героя)
const TRIBUNE = (x, top, w = 360, z = 9, label = "") => `<div style="left:${x - w / 2}px;top:${top}px;width:${w}px;height:${1920 - top}px;z-index:${z};background:linear-gradient(#7a4e2c,#5a3820);border:7px solid #000;border-radius:10px 10px 0 0;box-sizing:border-box">
  <div style="position:absolute;left:-20px;right:-20px;top:-34px;height:40px;background:#8a5a33;border:7px solid #000;border-radius:8px"></div>
  ${label ? `<div style="position:absolute;left:30px;right:30px;top:60px;background:#e6b422;border:5px solid #000;border-radius:8px;text-align:center;font-family:Unbounded;font-weight:900;font-size:30px;padding:6px 0;color:#151515">${label}</div>` : ""}</div>`;
// приём 2 — молоток: удар, ударные кольца
const GAVEL = `<svg viewBox="0 0 120 120" style="overflow:visible"><rect x="58" y="40" width="12" height="80" rx="5" fill="#8a5a33" stroke="#151515" stroke-width="5" transform="rotate(-30 64 80)"/><rect x="20" y="10" width="80" height="42" rx="12" fill="#6b4423" stroke="#151515" stroke-width="6" transform="rotate(-30 60 31)"/></svg>`;
const RINGS = (x, y, id = "rings") => `<div id="${id}" style="position:absolute;left:${x - 200}px;top:${y - 200}px;width:400px;height:400px;z-index:40;pointer-events:none">
  ${[0, 1, 2].map(k => `<div class="rg" style="position:absolute;inset:0;border-radius:50%;border:${12 - k * 3}px solid #fff6c8;opacity:0"></div>`).join("")}</div>`;
// клетка ответчика: прутья, табурет, на нём телефон с ботом
const KLETKA = (x, y, w, h, inner, id = "klt", pw = w * .6) => `<div id="${id}" style="position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px;z-index:8">
  <div style="position:absolute;left:${w / 2 - 70}px;top:${h - 180}px;width:140px;height:180px"><div style="position:absolute;left:0;top:0;width:140px;height:26px;background:#8a5a33;border:5px solid #000;border-radius:6px"></div>
    <div style="position:absolute;left:14px;top:22px;width:16px;height:158px;background:#6b4423;border:4px solid #000"></div><div style="position:absolute;right:14px;top:22px;width:16px;height:158px;background:#6b4423;border:4px solid #000"></div></div>
  <div id="${id}p" style="position:absolute;left:${w / 2 - pw / 2}px;top:${h - 180 - pw * 1.62}px;width:${pw}px;height:${pw * 1.62}px;z-index:4;background:#0d0e12;border:10px solid #2a2d34;border-radius:36px;overflow:hidden;box-shadow:0 0 70px rgba(120,180,255,.6)">
    <div style="position:absolute;left:0;top:0;width:560px;padding:30px 40px;transform:scale(${(pw - 20) / 560});transform-origin:0 0">${inner}</div></div>
  ${Array.from({ length: 9 }, (_, k) => `<div style="position:absolute;left:${k * (w - 16) / 8}px;top:0;width:16px;height:${h}px;background:linear-gradient(90deg,#8a929b,#e9eef2,#8a929b);border:3px solid #000;z-index:2"></div>`).join("")}
  <div style="position:absolute;left:-10px;right:-10px;top:-10px;height:26px;background:#5b6670;border:5px solid #000;z-index:3"></div>
  <div style="position:absolute;left:-10px;right:-10px;top:${h * .45}px;height:18px;background:#5b6670;border:4px solid #000;z-index:3"></div></div>`;
// приём 1 — судебный рисунок карандашом: всё под ним становится серым штрихом на бумаге
const SKF = "grayscale(1) contrast(1.55) brightness(1.18) sepia(.3)";   // фильтр всего кадра (ставится на .cf)
const SKETCH = (id = "sk") => `<div id="${id}" style="position:absolute;inset:0;z-index:72;pointer-events:none">
  <div style="position:absolute;inset:0;background:repeating-linear-gradient(-48deg,#0000 0 9px,#3a2e2222 9px 11px);mix-blend-mode:multiply"></div>
  <div style="position:absolute;inset:0;box-shadow:inset 0 0 180px 60px #f3ead6"></div></div>`;
const SKCAP = (top, bot, id = "skc") => `<div id="${id}" style="position:absolute;left:50px;right:50px;top:1560px;z-index:74;transform:rotate(-2deg);font-family:Caveat;font-weight:700;color:#2b2218;text-align:center;background:#f3ead6;border:4px solid #2b2218;padding:14px 10px 20px;box-shadow:0 10px 0 #2b221855">
  <div style="font-size:92px;line-height:1">${top}</div><div style="margin-top:10px;font-size:58px">${bot}</div></div>`;
// приём 3 — воспоминание: виньетка-облако, плёночная кромка, подпись времени
const MEMORY = (label, id = "mem", haze = "#fffaf0") => `<div id="${id}" style="position:absolute;inset:0;z-index:60;pointer-events:none">
  <div style="position:absolute;inset:0;box-shadow:inset 0 0 220px 110px ${haze}"></div>
  <div style="position:absolute;left:0;top:0;bottom:0;width:46px;background:repeating-linear-gradient(#151515 0 30px,#fffaf0 30px 52px,#151515 52px 70px);opacity:.85"></div>
  <div style="position:absolute;right:0;top:0;bottom:0;width:46px;background:repeating-linear-gradient(#151515 0 30px,#fffaf0 30px 52px,#151515 52px 70px);opacity:.85"></div>
  <div style="position:absolute;left:90px;top:300px;font-family:Caveat;font-weight:700;font-size:70px;color:#5a3820;transform:rotate(-4deg)">${label}</div></div>`;
// приём 4 — F5: огромная клавиша, счётчик обновлений, «3 дня без сна»
const F5 = (x, y, id = "f5") => `<div id="${id}" style="position:absolute;left:${x}px;top:${y}px;z-index:62;width:520px;text-align:center">
  <div id="${id}k" style="display:inline-block;width:260px;height:240px;border-radius:34px;background:linear-gradient(#f4f6f8,#c9ced6);border:10px solid #151515;box-shadow:0 22px 0 #151515;font-family:Unbounded;font-weight:900;font-size:120px;line-height:230px;color:#151515">F5</div>
  <div style="margin-top:50px;padding:14px 20px;border-radius:20px;background:#000c;font-family:'JetBrains Mono';font-weight:800;font-size:40px;color:#ff7ae6">обновлено: <span id="${id}n">4 812</span> раз</div>
  <div style="margin-top:14px;font-family:Caveat;font-weight:700;font-size:64px;color:#fff">3 дня без сна</div></div>`;
// приём 5 — доска улик: пробковая доска, карточки времени на кнопках, красная нить
const EVIDENCE = () => `<div style="left:0;top:0;width:1080px;height:1920px;background:radial-gradient(circle at 50% 40%,#3a2a1a,#140c06 80%)"></div>
  <div style="left:60px;top:380px;width:960px;height:1180px;background:#b8875a;border:16px solid #5a3820;border-radius:12px;box-shadow:inset 0 0 80px #6b4423"></div>
  <div style="left:60px;top:250px;width:760px;text-align:center;font-family:Unbounded;font-weight:900;font-size:66px;color:#ffd23f">УЛИКА №1</div>
  ${[["12:00:00", "объявление<br>опубликовано", 150, 470, -4], ["12:00:01", "бот прислал<br>покупателю", 560, 640, 3], ["12:00:40", "звонок<br>бабушке", 170, 900, 2], ["12:20", "парень<br>у калитки", 560, 1150, -3]].map(([t, d, x, y, r], k) =>
    `<div id="ev${k}" style="left:${x}px;top:${y}px;width:370px;padding:20px 24px;background:#fbfaf3;border:6px solid #151515;transform:rotate(${r}deg);box-shadow:0 12px 0 #00000055">
      <div style="position:absolute;left:165px;top:-22px;width:36px;height:36px;border-radius:50%;background:#c0392b;border:5px solid #151515"></div>
      <div style="font-family:'JetBrains Mono';font-weight:800;font-size:52px;color:${k === 1 ? "#c0392b" : "#151515"}">${t}</div><div style="font-family:Onest;font-weight:800;font-size:36px;color:#151515;line-height:1.15">${d}</div></div>`).join("")}
  <svg viewBox="0 0 1080 1920" style="left:0;top:0;width:1080px;height:1920px;overflow:visible;z-index:2"><path id="evline" d="M335 470 L745 640 L355 900 L745 1150" fill="none" stroke="#c0392b" stroke-width="8" stroke-linecap="round"/></svg>`;
const VERDICT = (id = "ver") => `<div id="${id}" style="position:absolute;left:150px;top:330px;width:780px;z-index:64;background:#fbfaf3;border:8px solid #151515;border-radius:14px;padding:30px 40px;box-shadow:0 16px 0 #151515;transform:rotate(-2deg);text-align:center">
  <div style="font-family:'JetBrains Mono';font-weight:800;font-size:32px;color:#5b6670">РЕШЕНИЕ СУДА · ДЕЛО №1</div>
  <div style="margin-top:14px;font-family:Onest;font-weight:800;font-size:38px;color:#151515">Перекупы против бота «Перехват»</div>
  <div id="${id}s" style="display:inline-block;margin-top:24px;padding:4px 26px;border:10px solid #c0392b;border-radius:16px;font-family:Unbounded;font-weight:900;font-size:68px;color:#c0392b;transform:rotate(-6deg)">ИСК ОТКЛОНИТЬ</div></div>`;
const V5CARD = () => BOTH("ВАЗ · до 150 тыс", `<div id="nv5">${CARD("ВАЗ-2105 · 1998", "120 000 ₽", "рынок ≈ 160 000 ₽ · 1 хозяйка · деревня", "🔥 −25% к рынку · ⏱ 1 с после публикации")}</div>`);
const NINAPHONE = `<svg viewBox="0 0 100 100"><rect x="30" y="8" width="40" height="84" rx="8" fill="#2b2f37" stroke="#151515" stroke-width="5"/><rect x="36" y="16" width="28" height="28" fill="#8fd17a"/>${[0, 1, 2].map(r => [0, 1, 2].map(c => `<rect x="${37 + c * 10}" y="${52 + r * 11}" width="7" height="7" fill="#c9ced6"/>`).join("")).join("")}</svg>`;
const BANDAGE = `<svg viewBox="0 0 100 100"><rect x="34" y="20" width="32" height="64" rx="14" fill="#fbfaf3" stroke="#151515" stroke-width="5"/><path d="M34 40 h32 M34 52 h32 M34 64 h32" stroke="#c9ced6" stroke-width="4"/><circle cx="50" cy="30" r="6" fill="#e04a3a"/></svg>`;
const CTA57 = `<div style="position:absolute;left:60px;right:60px;top:1330px;z-index:70;background:#ffd23f;border:8px solid #151515;border-radius:34px;padding:26px 30px;box-shadow:0 14px 0 #151515;font-family:Unbounded;font-weight:900;color:#151515;text-align:center">
  <div style="font-size:52px;line-height:1.12">Бот <span style="color:#c0392b">«Перехват»</span><br>— ссылка в шапке</div><div style="margin-top:12px;font-size:30px;font-family:Onest;font-weight:800">объявления по всей России · через ~1 с после публикации</div></div>`;
const HALF = (frameHtml, side) => `<div class="half" style="position:absolute;left:0;top:0;width:1080px;height:1920px;clip-path:inset(0 270px 0 270px);transform:translateX(${side * 270}px)">${frameHtml}</div>`;
