// ep69 «Свадьба: тесть-полковник»: герои и реквизит (базовые помощники — props.js)
const DIMA = { jacket: "#2b2f37", pants: "#2b2f37", hair: "#c98a3a", tie: true, look: "grin" };                                     // жених Дима (новый герой)
const POLK = { jacket: "#3f5a3a", pants: "#2f3f2a", hair: "#c8c8c8", mustache: true, tie: true, skin: "#eaa88a", look: "flat" };     // тесть-полковник Виктор Степанович (новый герой)
// невеста Лена (новая героиня): из «vika» — белое платье, бант → белый
const LNC = html => html.replaceAll("#8e1f3a", "#fbf6f0").replaceAll("#5c1426", "#e0d6cc").replaceAll("#2c3e66", "#fbf6f0")
  .replaceAll('fill="#ff3b30" stroke="#151515" stroke-width="4" transform="rotate(-20', 'fill="#ffffff" stroke="#151515" stroke-width="4" transform="rotate(-20');
const W24 = "w124/w124_side.png", MZ6 = "mazda6/mazda6_side_r.png";
Object.assign(CINE.SIZES, { [W24]: [732, 233], [MZ6]: [717, 240] });
const TITLE = (a, b) => `<div style="position:absolute;left:0;right:0;top:300px;text-align:center;font-family:Unbounded;font-weight:900;line-height:1;letter-spacing:-3px;z-index:50">
  <span style="display:inline-block;padding:10px 28px 18px;border:8px solid #151515;border-radius:22px;box-shadow:0 12px 0 #151515;font-size:82px;background:#ffd23f;color:#151515;transform:rotate(-3deg)">${a}</span><br>
  <span style="display:inline-block;padding:10px 28px 18px;border:8px solid #151515;border-radius:22px;box-shadow:0 12px 0 #151515;font-size:80px;background:#ff3b30;color:#fff;margin-top:26px;transform:rotate(2deg)">${b}</span></div>`;
// рамка героя (как у ch: кадр 420×800 при росте 740) — для накладок
const FR = (x, foot, h) => { const s = h / 740; return { s, l: x - 210 * s, t: foot - 740 * s }; };
// фата невесты — за героиней (z ниже), развевается (#<id>)
const VEIL = (x, foot, h, id = "vl", z = 6) => { const { s, l, t } = FR(x, foot, h);
  return `<div id="${id}" style="position:absolute;left:${l}px;top:${t}px;width:${420 * s}px;height:${800 * s}px;z-index:${z};transform-origin:${210 * s}px ${110 * s}px"><svg viewBox="0 0 420 800" style="overflow:visible">
  <path d="M150 96 Q300 60 330 150 Q420 380 380 600 Q300 640 250 560 Q290 360 230 160 Z" fill="#ffffff" fill-opacity=".8" stroke="#151515" stroke-width="5"/>
  <path d="M130 110 q80 -60 170 -10" stroke="#ffd23f" stroke-width="12" fill="none" stroke-linecap="round"/></svg></div>`; };
// медали на кителе полковника
const MEDALS = (x, foot, h, z = 8) => { const { s, l, t } = FR(x, foot, h);
  return `<div style="position:absolute;left:${l + 120 * s}px;top:${t + 400 * s}px;width:${90 * s}px;height:${80 * s}px;z-index:${z}"><svg viewBox="0 0 90 80" style="overflow:visible">
  ${[0, 1, 2].map(k => `<rect x="${k * 30}" y="0" width="24" height="26" fill="${["#c0392b", "#2f6db5", "#ffd23f"][k]}" stroke="#151515" stroke-width="3"/><circle cx="${k * 30 + 12}" cy="42" r="12" fill="#e6b84a" stroke="#151515" stroke-width="3"/>`).join("")}</svg></div>`; };
// кольца и ленты на крыше свадебного «Мерседеса»
const RINGS = (x, y, id = "rg", z = 6) => `<div id="${id}" style="position:absolute;left:${x}px;top:${y}px;width:220px;height:130px;z-index:${z}"><svg viewBox="0 0 220 130" style="overflow:visible">
  <circle cx="80" cy="60" r="44" fill="none" stroke="#e6b84a" stroke-width="16"/><circle cx="140" cy="60" r="44" fill="none" stroke="#e6b84a" stroke-width="16"/><circle cx="80" cy="60" r="44" fill="none" stroke="#151515" stroke-width="3"/><circle cx="140" cy="60" r="44" fill="none" stroke="#151515" stroke-width="3"/>
  <path d="M110 110 q-90 10 -170 70 M110 110 q90 10 170 70" stroke="#ff8fb1" stroke-width="12" fill="none"/></svg></div>`;
// пар из-под капота заглохшей машины
const STEAM = (x, y, id = "stm", z = 9) => `<div id="${id}" style="position:absolute;left:${x}px;top:${y}px;width:260px;height:300px;z-index:${z}"><svg viewBox="0 0 260 300" style="overflow:visible">
  ${[[130, 240, 60], [90, 170, 50], [170, 130, 56], [120, 60, 46]].map(([cx, cy, r]) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#eef2f6" fill-opacity=".85" stroke="#9aa4ae" stroke-width="4"/>`).join("")}</svg></div>`;
// приём 1 — «ПРИКАЗ №…» на бланке, печать «ИСПОЛНИТЬ» (#<id>s) хлопает
const ORDER = (x, y, id, num, lines, rot = -4, z = 40) => `<div id="${id}" style="position:absolute;left:${x}px;top:${y}px;width:560px;z-index:${z};transform:rotate(${rot}deg);background:#fbf6ec;border:6px solid #151515;border-radius:8px;padding:22px 30px 30px;box-shadow:0 12px 0 #151515">
  <div style="font-family:Unbounded;font-weight:900;font-size:40px;color:#151515;text-align:center">ПРИКАЗ № ${num}</div>
  <div style="font-family:'JetBrains Mono';font-weight:800;font-size:30px;line-height:1.35;color:#2a2620;margin-top:12px">${lines}</div>
  <div id="${id}s" style="position:absolute;right:20px;bottom:-30px;padding:6px 18px;border:7px solid #c0392b;border-radius:12px;color:#c0392b;font-family:Unbounded;font-weight:900;font-size:36px;transform:rotate(-12deg);background:#fbf6ecdd">ИСПОЛНИТЬ</div></div>`;
// приём 2 — вставка под капот: провода, замотанные синим скотчем
const ENGINE = (id = "eng") => `<div id="${id}" style="position:absolute;left:0;top:0;width:1080px;height:1920px;z-index:15;background:radial-gradient(circle at 50% 50%,#4a4f5a,#1b1c20 75%)">
  <svg viewBox="0 0 1080 1920" style="position:absolute;inset:0;overflow:visible">
    <rect x="200" y="640" width="680" height="520" rx="40" fill="#3a3d46" stroke="#151515" stroke-width="10"/>${[0, 1, 2, 3, 4, 5].map(k => `<rect x="${250 + k * 105}" y="690" width="70" height="420" rx="14" fill="#5b6670" stroke="#151515" stroke-width="6"/>`).join("")}
    <g id="${id}w">${[[120, 560, 960, 1300, "#c0392b"], [80, 760, 1000, 1460, "#ffd23f"], [140, 980, 940, 1620, "#151515"]].map(([x1, y1, x2, y2, c]) => `<path d="M${x1} ${y1} C 400 ${y1 + 300}, 700 ${y2 - 300}, ${x2} ${y2}" stroke="${c}" stroke-width="22" fill="none"/>`).join("")}
    ${[[330, 820], [560, 1080], [760, 1320], [420, 1240], [650, 900]].map(([x, y], k) => `<rect x="${x - 60}" y="${y - 36}" width="120" height="72" rx="16" fill="#2f8ae8" stroke="#151515" stroke-width="7" transform="rotate(${k * 23 - 30} ${x} ${y})"/><path d="M${x - 40} ${y - 36} v72 M${x} ${y - 36} v72 M${x + 40} ${y - 36} v72" stroke="#1f6ab8" stroke-width="5" transform="rotate(${k * 23 - 30} ${x} ${y})"/>`).join("")}</g>
    <text x="540" y="420" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="66" fill="#ffd23f" stroke="#151515" stroke-width="12" paint-order="stroke">ПОД КАПОТОМ</text></svg></div>`;
// круг «картинка в картинке» с говорящим (детей — абсолютом: class grp)
const PIP = (inner, id, ring = "#ffd23f", left = 700, top = 1440) => `<div id="${id}" class="grp" style="position:absolute;left:${left}px;top:${top}px;width:320px;height:320px;border-radius:50%;overflow:hidden;border:9px solid ${ring};z-index:30;background:#e6f4fb;box-shadow:0 10px 30px #0008">${inner}</div>`;
// приём 3 — счётчик «ТОЛКАЕМ»: метры #<id>v, полоса #<id>b
const PUSHM = (x, y, id = "pm") => `<div id="${id}" style="position:absolute;left:${x}px;top:${y}px;width:420px;z-index:60;background:#151515;border:6px solid #ffd23f;border-radius:22px;padding:16px 22px;box-shadow:0 8px 0 #000;font-family:Unbounded;font-weight:900;color:#ffd23f">
  <div style="font-size:26px">НЕВЕСТА ТОЛКАЕТ</div><div id="${id}v" style="font-size:64px;color:#fff;line-height:1.1">0 м</div>
  <div style="margin-top:8px;height:22px;border-radius:11px;background:#333;overflow:hidden"><div id="${id}b" style="width:0%;height:100%;background:#ff8fb1"></div></div></div>`;
// бот у Димы: красная Mazda 6 (машина владельца, 15.11)
const MZCARD = (id = "mcc") => BOTH("Mazda 6 · до 700 тыс.", `<div id="${id}">${CARD("Mazda 6 · 2008", "640 000 ₽", "рынок ≈ 780 000 ₽ · 1 владелец", "🔥 −18% к рынку · ⏱ 1 с после публикации")}</div>`);
const CTA69 = `<div style="position:absolute;left:60px;right:60px;top:1330px;z-index:70;background:#ffd23f;border:8px solid #151515;border-radius:34px;padding:26px 30px;box-shadow:0 14px 0 #151515;font-family:Unbounded;font-weight:900;color:#151515;text-align:center">
  <div style="font-size:52px;line-height:1.12">Бот <span style="color:#c0392b">«Перехват»</span><br>— ссылка в шапке</div><div style="margin-top:12px;font-size:30px;font-family:Onest;font-weight:800">объявления по всей России · через ~1 с после публикации</div></div>`;
