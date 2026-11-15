// ep62 «Чёрная пятница: скидки от Жоры»: герои и реквизит (базовые помощники — props.js)
const VESTA = "vesta/vesta_34.png", RX7 = "rx7/rx7_34.png";        // RX-7 — гордость Жоры (лист владельца 15.11)
Object.assign(CINE.SIZES, { [VESTA]: [781, 375], [RX7]: [781, 363] });
const INHAND = (x, foot, h, arm, w, html, z = 8, rot = 0, id = "") => {
  const s = h / 740, l = x - 210 * s, t = foot - 740 * s, A = arm * Math.PI / 180;
  const hx = l + (292 + 26 * Math.cos(A) - 130 * Math.sin(A)) * s, hy = t + (400 + 26 * Math.sin(A) + 130 * Math.cos(A)) * s;
  return `<div class="prop"${id ? ` id="${id}"` : ""} style="left:${hx - w / 2}px;top:${hy - w / 2}px;width:${w}px;height:${w}px;z-index:${z};transform:rotate(${rot}deg)">${html}</div>`;
};
// Марина — покупательница-бухгалтер (новая героиня): из героини «vika» — синий пиджак, русые волосы, очки
const MGLASS = `<g><rect x="150" y="198" width="56" height="40" rx="12" fill="#cfe8f5" fill-opacity=".25" stroke="#151515" stroke-width="6"/><rect x="214" y="198" width="56" height="40" rx="12" fill="#cfe8f5" fill-opacity=".25" stroke="#151515" stroke-width="6"/><path d="M206 214 h8 M150 212 l-16 -6 M270 212 l16 -6" stroke="#151515" stroke-width="5"/></g>`;
const MRC = html => html.replaceAll("#8e1f3a", "#34557a").replaceAll("#5c1426", "#22405f").replaceAll("#2b1a14", "#a0663a").replaceAll('fill="#ff3b30" stroke="#151515" stroke-width="4" transform="rotate(-20', 'fill="#2f6db5" stroke="#151515" stroke-width="4" transform="rotate(-20')
  .replace('<path d="M210 232 q-10 22 2 28"', MGLASS + '<path d="M210 232 q-10 22 2 28"');
// обложка (кадр 0) — плашка названия как у #title шаблона
const TITLE = (a, b) => `<div style="position:absolute;left:0;right:0;top:300px;text-align:center;font-family:Unbounded;font-weight:900;line-height:1;letter-spacing:-3px;z-index:50">
  <span style="display:inline-block;padding:10px 28px 18px;border:8px solid #151515;border-radius:22px;box-shadow:0 12px 0 #151515;font-size:72px;background:#ffd23f;color:#151515;transform:rotate(-3deg)">${a}</span><br>
  <span style="display:inline-block;padding:10px 28px 18px;border:8px solid #151515;border-radius:22px;box-shadow:0 12px 0 #151515;font-size:104px;background:#ff3b30;color:#fff;margin-top:26px;transform:rotate(2deg)">${b}</span></div>`;
// неоновый баннер в раме фона bg_blackfriday (90..990 × 430): буквы — span с id (мигают и гаснут по одной)
const BANNER = (id = "bn") => `<div id="${id}" style="position:absolute;left:100px;top:440px;width:880px;height:240px;z-index:3;background:#0b0b12;border:8px solid #151515;transform-origin:0 0;text-align:center;font-family:Unbounded;font-weight:900">
  <div style="margin-top:34px;font-size:64px;white-space:nowrap;color:#ff7ae6;text-shadow:0 0 12px #ff3bd0,0 0 30px #ff3bd0;letter-spacing:-2px">${[..."ЧЁРНАЯ ПЯТНИЦА"].map((c, k) => `<span id="${id}c${k}">${c}</span>`).join("")}</div>
  <div style="margin-top:6px;font-size:64px;color:#ffd23f;text-shadow:0 0 12px #ffb000,0 0 26px #ffb000">−50% НА ВСЁ</div></div>`;
// приём 1 — ценник за лобовым крупно: старая цена зачёркнута маркером, новая «×2», звезда «−50%»
const PRICETAG = () => `<div style="left:0;top:0;width:1080px;height:1920px;background:linear-gradient(160deg,#1c1438,#3a2a5a 60%,#1c1438)"></div>
  <div style="left:0;top:0;width:1080px;height:1920px;background:repeating-linear-gradient(115deg,transparent 0 140px,#ffffff10 140px 190px)"></div>
  <div style="left:120px;top:560px;width:840px;height:760px;background:#ffd23f;border:10px solid #151515;border-radius:26px;transform:rotate(-3deg);box-shadow:0 20px 40px #0009;font-family:Unbounded;font-weight:900;color:#151515;text-align:center">
    <div style="margin-top:40px;font-size:56px">VESTA · 2019</div>
    <div id="pt0" style="position:relative;display:inline-block;margin-top:40px;font-size:100px">1 050 000<svg id="ptx" viewBox="0 0 100 20" preserveAspectRatio="none" style="position:absolute;left:-3%;top:40%;width:106%;height:22%"><path d="M0 10 L100 8" stroke="#e0261a" stroke-width="5"/></svg></div>
    <div id="pt1" style="margin-top:30px;font-family:Caveat;font-size:170px;color:#1d3a8a;line-height:1">2 100 000</div>
    <div id="pt2" style="position:absolute;right:-110px;top:-170px;width:300px;height:300px"><svg viewBox="0 0 100 100"><path d="${Array.from({ length: 24 }, (_, k) => { const a = k * Math.PI / 12, r = k % 2 ? 36 : 50; return (k ? "L" : "M") + (50 + r * Math.cos(a)).toFixed(1) + " " + (50 + r * Math.sin(a)).toFixed(1); }).join(" ")} Z" fill="#ff3b30" stroke="#151515" stroke-width="3"/>
      <text x="50" y="58" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="20" fill="#fff">−50%</text></svg></div></div>`;
// маркер в руке
const MARKER = `<svg viewBox="0 0 100 100" style="overflow:visible"><g transform="rotate(-35 50 50)"><rect x="40" y="-10" width="22" height="90" rx="6" fill="#1d3a8a" stroke="#151515" stroke-width="5"/><path d="M42 80 L51 100 L60 80 Z" fill="#151515"/></g></svg>`;
// приём 2 — «очередь из одного»: перекати-поле катится мимо стоек
const TUMBLE = (x, y, id = "tw") => `<div class="prop" id="${id}" style="left:${x}px;top:${y}px;width:150px;height:150px;z-index:8"><svg viewBox="0 0 100 100"><g fill="none" stroke="#5a3a1a" stroke-width="6">
  <circle cx="50" cy="50" r="44"/><path d="M10 40 Q50 10 90 50 M14 66 Q50 30 86 70 M30 14 Q60 50 40 90 M70 12 Q40 50 66 90 M20 24 Q60 70 84 30"/></g></svg></div>`;
// приём 3 — калькулятор бухгалтера крупно: дисплей + бумажная лента со строчками (id для появления по одной)
const CALC = () => `<div style="left:0;top:0;width:1080px;height:1920px;background:radial-gradient(circle at 50% 45%,#5a6a8a,#1c2232 80%)"></div>
  <div style="left:150px;top:640px;width:780px;height:1100px;background:#2b2f37;border:10px solid #151515;border-radius:50px;box-shadow:0 30px 50px #0009">
    <div id="calcd" style="margin:50px 50px 0;height:170px;border-radius:20px;background:#b9d4a6;border:7px solid #151515;font-family:'JetBrains Mono';font-weight:800;font-size:110px;color:#1f2a14;text-align:right;padding:20px 30px;box-sizing:border-box;line-height:1.1">2100000</div>
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:24px;margin:40px 50px">${["7", "8", "9", "÷", "4", "5", "6", "×", "1", "2", "3", "−", "0", ",", "=", "+"].map(k => `<div style="height:130px;border-radius:24px;background:${"÷×−+=".includes(k) ? "#ff7a1a" : "#e8e6ef"};border:6px solid #151515;font-family:Unbounded;font-weight:900;font-size:60px;text-align:center;line-height:120px;color:#151515">${k}</div>`).join("")}</div></div>
  <div style="left:300px;top:110px;width:480px;height:570px;background:#fbfaf3;border:5px solid #c9c4b5;box-shadow:0 10px 20px #0006;font-family:'JetBrains Mono';font-weight:800;font-size:44px;color:#2b2f37;padding:30px 34px;box-sizing:border-box;line-height:1.5;text-align:right">
    <div id="ct0">2 100 000</div><div id="ct1">× 0,5</div><div id="ct2" style="border-top:4px dashed #2b2f37">= 1 050 000</div><div id="ct3" style="color:#c0392b;font-family:Caveat;font-size:56px;white-space:nowrap">вчера: 1 050 000</div></div>`;
// капли пота
const SWEAT = (x, y, id = "sw") => `<div id="${id}" style="position:absolute;left:${x}px;top:${y}px;width:120px;height:160px;z-index:20"><svg viewBox="0 0 60 80" style="overflow:visible">${[[10, 10], [40, 30], [20, 52]].map(([a, b]) => `<path d="M${a} ${b} q-8 14 0 20 q8 -6 0 -20 z" fill="#8fe0ff" stroke="#151515" stroke-width="3"/>`).join("")}</svg></div>`;
// бот на экране у Марины
const VSCARD = () => BOTH("Vesta · до 1 млн", `<div id="vcc">${CARD("Lada Vesta · 2019", "920 000 ₽", "рынок ≈ 1 080 000 ₽ · 1 владелец", "🔥 −15% к рынку · ⏱ 1 с после публикации")}</div>`);
const CTA62 = `<div style="position:absolute;left:60px;right:60px;top:1330px;z-index:70;background:#ffd23f;border:8px solid #151515;border-radius:34px;padding:26px 30px;box-shadow:0 14px 0 #151515;font-family:Unbounded;font-weight:900;color:#151515;text-align:center">
  <div style="font-size:52px;line-height:1.12">Бот <span style="color:#c0392b">«Перехват»</span><br>— ссылка в шапке</div><div style="margin-top:12px;font-size:30px;font-family:Onest;font-weight:800">объявления по всей России · через ~1 с после публикации</div></div>`;
// упавшая неоновая буква (с баннера — на капот RX-7)
const NEONCHAR = (x, y, ch = "Я", id = "nch", rot = 24) => `<div class="prop" id="${id}" style="left:${x}px;top:${y}px;width:200px;height:220px;z-index:9;transform:rotate(${rot}deg);font-family:Unbounded;font-weight:900;font-size:170px;line-height:1;color:#ff9ae8;text-shadow:0 0 10px #ff3bd0,0 0 24px #ff3bd0;-webkit-text-stroke:3px #151515">${ch}</div>`;
const SPARKS = (x, y, id = "spk") => `<div id="${id}" style="position:absolute;left:${x - 120}px;top:${y - 120}px;width:240px;height:240px;z-index:10"><svg viewBox="0 0 240 240">${Array.from({ length: 10 }, (_, k) => { const a = k * Math.PI / 5, r1 = 30, r2 = 90 + (k % 3) * 20; return `<path d="M${120 + r1 * Math.cos(a)} ${120 + r1 * Math.sin(a)} L${120 + r2 * Math.cos(a)} ${120 + r2 * Math.sin(a)}" stroke="#ffd23f" stroke-width="7" stroke-linecap="round"/>`; }).join("")}</svg></div>`;
