// ep66 «Музей: перекуп обыкновенный»: герои и реквизит (базовые помощники — props.js)
const KID = { jacket: "#ff7a1a", pants: "#2f6db5", hair: "#3a2a1a", look: "grin" };                   // школьник Тимур (новый герой)
const KID2 = { jacket: "#4cd964", pants: "#2b2f37", hair: "#e0c070", cap: "#c0392b", look: "o" };       // школьник Петя (массовка)
const V05 = "vaz2105/vaz2105_34.png";
Object.assign(CINE.SIZES, { [V05]: [775, 352] });
// экскурсовод Ирина Сергеевна (новая героиня): из героини «vika» — серый жакет, тёмные волосы, очки
const GGLASS = `<g><rect x="152" y="200" width="56" height="38" rx="8" fill="#cfe8f5" fill-opacity=".25" stroke="#151515" stroke-width="6"/><rect x="214" y="200" width="56" height="38" rx="8" fill="#cfe8f5" fill-opacity=".25" stroke="#151515" stroke-width="6"/><path d="M208 216 h6" stroke="#151515" stroke-width="5"/></g>`;
const GRC = html => html.replaceAll("#8e1f3a", "#4a4f5a").replaceAll("#5c1426", "#33373f").replaceAll("#2b1a14", "#3a3030").replaceAll("#2c3e66", "#2b2f37")
  .replace('<path d="M210 232 q-10 22 2 28"', GGLASS + '<path d="M210 232 q-10 22 2 28"');
const WAX = "filter:sepia(.5) saturate(.7) brightness(1.07) contrast(.92)";   // «восковая фигура»
const INHAND = (x, foot, h, arm, w, html, z = 8, rot = 0, id = "") => {
  const s = h / 740, l = x - 210 * s, t = foot - 740 * s, A = arm * Math.PI / 180;
  const hx = l + (292 + 26 * Math.cos(A) - 130 * Math.sin(A)) * s, hy = t + (400 + 26 * Math.sin(A) + 130 * Math.cos(A)) * s;
  return `<div class="prop"${id ? ` id="${id}"` : ""} style="left:${hx - w / 2}px;top:${hy - w / 2}px;width:${w}px;height:${w}px;z-index:${z};transform:rotate(${rot}deg)">${html}</div>`;
};
const TITLE = (a, b) => `<div style="position:absolute;left:0;right:0;top:300px;text-align:center;font-family:Unbounded;font-weight:900;line-height:1;letter-spacing:-3px;z-index:50">
  <span style="display:inline-block;padding:10px 28px 18px;border:8px solid #151515;border-radius:22px;box-shadow:0 12px 0 #151515;font-size:82px;background:#ffd23f;color:#151515;transform:rotate(-3deg)">${a}</span><br>
  <span style="display:inline-block;padding:10px 28px 18px;border:8px solid #151515;border-radius:22px;box-shadow:0 12px 0 #151515;font-size:88px;background:#ff3b30;color:#fff;margin-top:26px;transform:rotate(2deg)">${b}</span></div>`;
// приём 1 — «моргание»: накладные веки поверх глаз героя-перекупа (глаза у него на 176/244 × 216 в кадре 420×800)
const BLINK = (x, foot, h, id = "bl", skin = "#e8b48c") => { const s = h / 740, l = x - 210 * s, t = foot - 740 * s;
  return `<div id="${id}" style="position:absolute;left:${l}px;top:${t}px;width:${420 * s}px;height:${800 * s}px;z-index:12;opacity:0"><svg viewBox="0 0 420 800" style="overflow:visible">
  ${[176, 244].map(c => `<ellipse cx="${c}" cy="216" rx="31" ry="27" fill="${skin}" stroke="#151515" stroke-width="5"/><path d="M${c - 28} 222 q28 10 56 0" stroke="#151515" stroke-width="5" fill="none"/>`).join("")}</svg></div>`; };
// латунная табличка
const PLAQUE = (x, y, w, t, sub, id = "", z = 20) => `<div${id ? ` id="${id}"` : ""} style="position:absolute;left:${x}px;top:${y}px;width:${w}px;z-index:${z};background:linear-gradient(135deg,#e6c88a,#b8904a);border:6px solid #6b4a1a;border-radius:10px;padding:12px 18px;text-align:center;box-shadow:0 8px 0 #3a2a10">
  <div style="font-family:Unbounded;font-weight:900;font-size:34px;color:#2a1a08;line-height:1.1">${t}</div>${sub ? `<div style="font-family:Onest;font-weight:800;font-size:26px;color:#3a2a10;margin-top:6px">${sub}</div>` : ""}</div>`;
// бархатный канат на латунных стойках
const ROPE = (x1, x2, y, z = 10) => `<svg style="position:absolute;left:0;top:0;width:1080px;height:1920px;overflow:visible;z-index:${z}" viewBox="0 0 1080 1920">
  ${[x1, x2].map(x => `<path d="M${x} ${y + 160} V${y}" stroke="#c9a06a" stroke-width="16"/><circle cx="${x}" cy="${y}" r="18" fill="#e6c88a" stroke="#6b4a1a" stroke-width="5"/><ellipse cx="${x}" cy="${y + 164}" rx="44" ry="12" fill="#b8904a" stroke="#6b4a1a" stroke-width="4"/>`).join("")}
  <path d="M${x1} ${y + 8} Q${(x1 + x2) / 2} ${y + 90} ${x2} ${y + 8}" stroke="#8a1a2a" stroke-width="20" fill="none" stroke-linecap="round"/></svg>`;
// приём 2 — витрина: газета объявлений, пейджер, дисковый телефон под стеклом, луч прожектора
const SHOWCASE = (x, y, w = 760, id = "sc") => `<div id="${id}" style="position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${w * .62}px;z-index:8">
  <div style="position:absolute;left:0;right:0;bottom:0;height:42%;background:#6b4423;border:7px solid #151515"></div>
  <div style="position:absolute;left:0;right:0;top:0;height:60%;background:linear-gradient(135deg,#e8f6ff33,#e8f6ff10 40%,#ffffff40 55%,#e8f6ff10);border:7px solid #9fb4c8;border-bottom:none"></div>
  <svg viewBox="0 0 760 470" style="position:absolute;inset:0;width:100%;height:100%;overflow:visible">
    <g transform="rotate(-6 150 230)"><rect x="60" y="150" width="190" height="140" fill="#efe6cc" stroke="#151515" stroke-width="4"/>${[0, 1, 2, 3, 4].map(k => `<path d="M76 ${180 + k * 20} h${k % 2 ? 120 : 150}" stroke="#7a7466" stroke-width="5"/>`).join("")}<text x="155" y="172" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="16" fill="#2a2620">ОБЪЯВЛЕНИЯ</text></g>
    <rect x="320" y="200" width="110" height="70" rx="12" fill="#2b2f37" stroke="#151515" stroke-width="5"/><rect x="334" y="212" width="80" height="26" fill="#9ad08a"/><text x="374" y="231" text-anchor="middle" font-family="JetBrains Mono" font-weight="800" font-size="14" fill="#1f2a14">ПРОДАН</text>
    <path d="M500 280 L530 190 H660 L690 280 Z" fill="#c0392b" stroke="#151515" stroke-width="6"/><circle cx="595" cy="245" r="30" fill="#fbf6ec" stroke="#151515" stroke-width="5"/></svg></div>`;
// приём 3 — сигнализация: красный маячок и красная вспышка
const ALARM = (x, y, id = "al") => `<div id="${id}" style="position:absolute;left:${x}px;top:${y}px;width:130px;height:130px;z-index:46"><svg viewBox="0 0 130 130">
  <rect x="25" y="96" width="80" height="26" rx="6" fill="#2b2f37" stroke="#151515" stroke-width="5"/><path d="M30 98 Q30 20 65 20 Q100 20 100 98 Z" fill="#ff3b30" stroke="#151515" stroke-width="6"/><path d="M48 50 q8 -16 20 -16" stroke="#fff" stroke-width="8" fill="none" stroke-linecap="round"/></svg></div>
  <div id="${id}f" style="position:absolute;inset:0;z-index:44;opacity:0;background:radial-gradient(circle,#ff3b3000 35%,#ff3b30aa)"></div>`;
// бот на экране у Тимура (2040 год)
const KDCARD = () => BOTH("Vesta EV · до 1,1 млн", `<div id="kcc">${CARD("Lada Vesta EV · 2037", "990 000 ₽", "рынок ≈ 1 200 000 ₽ · 1 владелец", "🔥 −17% к рынку · ⏱ 1 с после публикации")}</div>`);
const CTA66 = `<div style="position:absolute;left:60px;right:60px;top:1330px;z-index:70;background:#ffd23f;border:8px solid #151515;border-radius:34px;padding:26px 30px;box-shadow:0 14px 0 #151515;font-family:Unbounded;font-weight:900;color:#151515;text-align:center">
  <div style="font-size:52px;line-height:1.12">Бот <span style="color:#c0392b">«Перехват»</span><br>— ссылка в шапке</div><div style="margin-top:12px;font-size:30px;font-family:Onest;font-weight:800">объявления по всей России · через ~1 с после публикации</div></div>`;
