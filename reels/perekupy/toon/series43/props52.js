// ep52 «Толян: со ста тысяч · 12 — Пункт седьмой»: герои и реквизит (базовые помощники — props.js)
const VITALIK = { jacket: "#2f6db5", pants: "#2f6db5", cap: "#151515", chain: true, hair: "#1d1d1f", look: "grin" };   // из части 11
const ARTUR = { jacket: "#3a6a5a", pants: "#2b2f37", hair: "#3a2a1a", beard: true, glasses: true, look: "flat" };     // покупатель с толщиномером
const GRISHA = { jacket: "#e8e4d8", vest: "#2f6db5", pants: "#2f6db5", cap: "#f4f6f8", hair: "#8a5a33", mustache: true, look: "grin" };  // маляр
const CLSW = "cls/cls_34.png";
CINE.SIZES[CLSW] = [787, 338];
const HUD52 = (cap, d, lis) => ({ tag: "пункт седьмой", cap, d, lis });
// предмет в правой руке героя (по повороту руки): html — svg 100×100 с центром-хваткой в (50, 50)
const INHAND = (x, foot, h, arm, w, html, z = 8, rot = 0) => {
  const s = h / 740, l = x - 210 * s, t = foot - 740 * s, A = arm * Math.PI / 180;
  const hx = l + (292 + 26 * Math.cos(A) - 130 * Math.sin(A)) * s, hy = t + (400 + 26 * Math.sin(A) + 130 * Math.cos(A)) * s;
  return `<div class="prop" style="left:${hx - w / 2}px;top:${hy - w / 2}px;width:${w}px;height:${w}px;z-index:${z};transform:rotate(${rot}deg)">${html}</div>`;
};
const GAUGE = `<svg viewBox="0 0 100 100"><rect x="26" y="4" width="48" height="74" rx="10" fill="#ffd23f" stroke="#151515" stroke-width="6"/><rect x="33" y="12" width="34" height="24" rx="3" fill="#cfe9c4" stroke="#151515" stroke-width="3"/>
  <path d="M50 78 v16" stroke="#151515" stroke-width="8" stroke-linecap="round"/><circle cx="50" cy="96" r="5" fill="#9aa3ab" stroke="#151515" stroke-width="3"/></svg>`;
const CASH = `<svg viewBox="0 0 100 100">${[0, 1, 2].map(j => `<rect x="${10 + j * 4}" y="${34 - j * 10}" width="76" height="38" rx="5" fill="#8fd17a" stroke="#151515" stroke-width="4"/>`).join("")}<circle cx="56" cy="33" r="10" fill="none" stroke="#3f7a32" stroke-width="4"/></svg>`;
const SHAWA = `<svg viewBox="0 0 100 100"><path d="M22 18 q28 -16 56 0 l-10 74 h-36 z" fill="#f4e2b8" stroke="#151515" stroke-width="5"/><path d="M26 24 q24 12 48 0" stroke="#b8742a" stroke-width="8" fill="none"/><path d="M28 34 q22 8 44 0" stroke="#4f9d48" stroke-width="5" fill="none"/><path d="M34 62 h32 M36 76 h28" stroke="#d9d0b0" stroke-width="4"/></svg>`;
// то же для левой руки (armL > 0 — рука влево): зеркально относительно центра героя
const INHANDL = (x, foot, h, arm, w, html, z = 8, rot = 0) => INHAND(x, foot, h, -arm, w, html, z, rot).replace(/left:([\d.-]+)px/, (_, v) => `left:${2 * x - (+v + w / 2) - w / 2}px`);
const PHONE = (who = "Виталик") => `<svg viewBox="0 0 100 100" style="overflow:visible"><rect x="30" y="6" width="40" height="80" rx="9" fill="#151515" stroke="#151515" stroke-width="4"/><rect x="34" y="14" width="32" height="60" rx="4" fill="#4cd964"/>
  <text x="50" y="50" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="9" fill="#151515">${who}</text><path d="M80 20 q10 10 0 22 M88 14 q16 16 0 34" stroke="#ffd23f" stroke-width="5" fill="none" stroke-linecap="round"/></svg>`;
// приём 1 — флешбэк: всё в ч/б (freeze) + сепия, зерно, царапины плёнки и плашка «ДВЕ НЕДЕЛИ НАЗАД»
const FLASH = (label = "ДВЕ НЕДЕЛИ НАЗАД") => `<div style="position:absolute;inset:0;z-index:57;backdrop-filter:brightness(1.9)"></div><div style="position:absolute;inset:0;z-index:57;background:#c9a06a;mix-blend-mode:multiply;opacity:.3"></div>
  <div style="position:absolute;inset:0;z-index:58;background:radial-gradient(ellipse 70% 60% at 50% 50%,transparent 62%,rgba(20,12,4,.55) 100%)"></div>
  ${Array.from({ length: 7 }, (_, k) => `<div class="scr" style="position:absolute;left:${80 + k * 150 + (k % 3) * 23}px;top:0;width:${k % 2 ? 2 : 3}px;height:1920px;background:rgba(255,246,220,.35);z-index:58"></div>`).join("")}
  <div class="fbl" style="position:absolute;left:60px;top:400px;z-index:61;font-family:'JetBrains Mono';font-weight:800;font-size:46px;color:#151515;background:#f4e2b8;border:6px solid #151515;padding:6px 20px;transform:rotate(-3deg)">◀◀ ${label}</div>`;
// приём 2 — отрывной календарь крупно: день продажи
const CAL = (day, id = "cal") => `<div id="${id}" style="position:absolute;left:250px;top:560px;width:580px;z-index:14;transform:rotate(-2deg)">
  <div style="height:120px;background:#c0392b;border:10px solid #151515;border-bottom:none;font-family:Unbounded;font-weight:900;font-size:56px;color:#fff;text-align:center;line-height:120px">НОЯБРЬ</div>
  <div style="height:520px;background:#fff;border:10px solid #151515;text-align:center;font-family:Unbounded;font-weight:900;color:#151515">
    <div style="font-size:44px;padding-top:30px;color:#8b93a3">день продажи</div><div class="dn" style="font-size:300px;line-height:1.05">${day}</div></div></div>`;
// приём 3 — экран объявления Жоры: просмотры растут, звонков ноль
const LISTING = (views = "3 112", calls = "0", id = "lst") => `<div id="${id}" style="font-family:Onest;color:#fff">
  <div style="font-weight:800;font-size:34px;color:#8b93a3">Моё объявление</div>
  <div style="margin-top:14px;height:270px;border-radius:24px;background:linear-gradient(160deg,#cfe3f2,#8a929b);position:relative;overflow:hidden">
    <img src="${CINE.IMG}${CLSW}" style="position:absolute;left:10px;top:40px;width:440px"></div>
  <div style="font-weight:900;font-size:40px;margin-top:16px">Mercedes CLS · 2012</div>
  <div style="font-size:30px;color:#ffd23f;font-weight:800;margin-top:4px">«как с завода, не крашена»</div>
  <div style="font-family:'JetBrains Mono';font-weight:800;font-size:56px;margin-top:10px">1 400 000 ₽</div>
  <div style="display:flex;gap:18px;margin-top:20px;font-family:'JetBrains Mono';font-weight:800;font-size:34px">
    <div style="flex:1;background:#1c1f26;border-radius:18px;padding:14px 18px;white-space:nowrap">👁 <b class="views">${views}</b></div>
    <div style="flex:1;background:#1c1f26;border-radius:18px;padding:14px 18px;color:#ff3b30;white-space:nowrap">☎ <b class="calls">${calls}</b> звонков</div></div></div>`;
// приём 4 — «щенячьи глаза» Жоры: огромные блестящие зрачки поверх крупного плана
const PUPPY = (x1, x2, y, r = 34) => [x1, x2].map(x => `<div style="position:absolute;left:${x - r}px;top:${y - r}px;width:${2 * r}px;height:${2 * r}px;border-radius:50%;z-index:12;
  background:radial-gradient(circle at 34% 30%,#fff 0 18%,transparent 19%),radial-gradient(circle at 62% 64%,#fff 0 9%,transparent 10%),#151515;box-shadow:0 0 0 4px #151515"></div>`).join("");
// табличка честного объявления на стекле
const HONEST = (l, t) => `<div style="position:absolute;left:${l}px;top:${t}px;z-index:8;transform:rotate(-4deg);background:#fbfaf3;border:5px solid #151515;border-radius:10px;padding:8px 14px;font-family:Onest;font-weight:800;font-size:24px;color:#151515;line-height:1.25">
  CLS 2012 · <span style="color:#c0392b">дверь в шпаклёвке</span><br>остальное родное · 1 020 000 ₽</div>`;
const CTA52 = `<div style="position:absolute;left:60px;right:60px;top:1330px;z-index:70;background:#ffd23f;border:8px solid #151515;border-radius:34px;padding:26px 30px;box-shadow:0 14px 0 #151515;font-family:Unbounded;font-weight:900;color:#151515;text-align:center">
  <div style="font-size:52px;line-height:1.12">Бот <span style="color:#c0392b">«Перехват»</span><br>— ссылка в шапке</div><div style="margin-top:12px;font-size:30px;font-family:Onest;font-weight:800">объявления по всей России · через ~1 с после публикации</div></div>`;
// половинка разделённого экрана (для раскадровки)
const HALF = (frameHtml, side) => `<div class="half" style="position:absolute;left:0;top:0;width:1080px;height:1920px;clip-path:inset(0 270px 0 270px);transform:translateX(${side * 270}px)">${frameHtml}</div>`;
