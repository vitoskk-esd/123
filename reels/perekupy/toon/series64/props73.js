// ep73 «Кулинарное шоу: блюдо от шефа» (без мата): герои и реквизит (базовые помощники — props.js)
// ведущая Марго (новая героиня): из «vika» — красное платье, светлые волосы
const MGC = html => html.replaceAll("#8e1f3a", "#e0302a").replaceAll("#5c1426", "#a01a1a").replaceAll("#2b1a14", "#f0c060").replaceAll("#2c3e66", "#2b2f37");
const GLEB = { jacket: "#6a3a8a", pants: "#2b2f37", hair: "#2b1a14", glasses: true, look: "o" };   // покупатель Глеб (новый герой)
const V10 = "vaz2110/vaz2110_side_r.png", MZ6 = "mazda6/mazda6_side_r.png";
Object.assign(CINE.SIZES, { [V10]: [741, 249], [MZ6]: [722, 244] });
const TITLE = (a, b) => `<div style="position:absolute;left:0;right:0;top:300px;text-align:center;font-family:Unbounded;font-weight:900;line-height:1;letter-spacing:-3px;z-index:50">
  <span style="display:inline-block;padding:10px 28px 18px;border:8px solid #151515;border-radius:22px;box-shadow:0 12px 0 #151515;font-size:66px;background:#ffd23f;color:#151515;transform:rotate(-3deg)">${a}</span><br>
  <span style="display:inline-block;padding:10px 28px 18px;border:8px solid #151515;border-radius:22px;box-shadow:0 12px 0 #151515;font-size:80px;background:#ff3b30;color:#fff;margin-top:26px;transform:rotate(2deg)">${b}</span></div>`;
const FR = (x, foot, h) => { const s = h / 740; return { s, l: x - 210 * s, t: foot - 740 * s }; };
// поварской колпак поверх кепки героя
const CHEFHAT = (x, foot, h, id = "", z = 9) => { const { s, l, t } = FR(x, foot, h);
  return `<div${id ? ` id="${id}"` : ""} style="position:absolute;left:${l}px;top:${t}px;width:${420 * s}px;height:${800 * s}px;z-index:${z};pointer-events:none"><svg viewBox="0 0 420 800" style="overflow:visible">
  <path d="M110 150 Q80 40 160 30 Q210 -20 260 30 Q340 40 310 150 Z" fill="#ffffff" stroke="#151515" stroke-width="7"/><rect x="112" y="130" width="196" height="50" rx="10" fill="#ffffff" stroke="#151515" stroke-width="7"/>
  <path d="M170 60 q10 40 0 70 M250 60 q-10 40 0 70" stroke="#d8dce0" stroke-width="6" fill="none"/></svg></div>`; };
// приём 1 — ингредиенты: карточки-банки (#<id>)
const INGRED = (x, y, id, title, amount, color, rot = 0, z = 30) => `<div id="${id}" style="position:absolute;left:${x}px;top:${y}px;width:300px;height:340px;z-index:${z};transform:rotate(${rot}deg)">
  <div style="position:absolute;left:30px;right:30px;top:0;height:40px;background:#8a8e94;border:6px solid #151515;border-radius:10px"></div>
  <div style="position:absolute;left:10px;right:10px;top:34px;bottom:0;background:${color};border:7px solid #151515;border-radius:20px 20px 30px 30px;box-shadow:0 10px 0 #151515"></div>
  <div style="position:absolute;left:24px;right:24px;top:110px;padding:10px 6px;background:#fbf6ec;border:5px solid #151515;border-radius:12px;text-align:center;font-family:Unbounded;font-weight:900;color:#151515">
    <div style="font-size:30px">${title}</div><div style="font-size:26px;color:#c0392b;margin-top:6px">${amount}</div></div></div>`;
// приём 2 — духовка: в окошке машина (#<id>c), таймер (#<id>t)
const OVEN = (x, y, id = "ov", w = 760, z = 20) => `<div id="${id}" style="position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${w * .78}px;z-index:${z}">
  <div style="position:absolute;inset:0;background:#c8ccd0;border:9px solid #151515;border-radius:30px;box-shadow:0 14px 0 #151515"></div>
  <div style="position:absolute;left:5%;right:5%;top:4%;height:14%;background:#2b2f37;border:6px solid #151515;border-radius:12px"></div>
  <div id="${id}t" style="position:absolute;left:8%;top:5.5%;font-family:'JetBrains Mono';font-weight:800;font-size:${w * .07}px;color:#ff7a1a">40:00</div>
  ${[.62, .74, .86].map(p => `<div style="position:absolute;left:${p * 100}%;top:7%;width:${w * .06}px;height:${w * .06}px;border-radius:50%;background:#8a8e94;border:5px solid #151515"></div>`).join("")}
  <div class="grp" style="position:absolute;left:8%;right:8%;top:24%;bottom:8%;background:radial-gradient(circle,#ffb04a,#c0501a);border:8px solid #151515;border-radius:18px;overflow:hidden">
    <div id="${id}c" style="position:absolute;left:8%;bottom:6%;width:84%">${`<img src="${C.IMG}${V10}" style="width:100%;display:block">`}</div>
    <div style="position:absolute;left:0;right:0;bottom:2%;height:6px;background:#151515"></div></div></div>`;
// приём 3 — отвалившаяся дверь «десятки» в руках (#<id>) и бампер (#<id>)
const DOORP = (x, y, id = "dr", w = 300, z = 30) => `<div id="${id}" style="position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${w * .8}px;z-index:${z};transform:rotate(-8deg)"><svg viewBox="0 0 300 240" style="overflow:visible">
  <path d="M10 60 L60 10 H290 V230 H10 Z" fill="#6aa8e0" stroke="#151515" stroke-width="8"/><path d="M40 70 L80 30 H270 V110 H40 Z" fill="#a8cfe8" stroke="#151515" stroke-width="6"/><rect x="200" y="140" width="60" height="16" rx="8" fill="#26282e"/></svg></div>`;
const BUMPER = (x, y, id = "bp", z = 8) => `<div id="${id}" style="position:absolute;left:${x}px;top:${y}px;width:260px;height:70px;z-index:${z}"><svg viewBox="0 0 260 70"><path d="M10 10 H230 Q255 20 250 50 L240 60 H20 Q5 40 10 10 Z" fill="#2a4a9a" stroke="#151515" stroke-width="7"/></svg></div>`;
// плашка эфира внизу
const LOWER3 = (t, s, id = "l3", z = 55) => `<div id="${id}" style="position:absolute;left:40px;right:40px;top:1700px;z-index:${z};display:flex;font-family:Unbounded;font-weight:900">
  <div style="background:#c0392b;color:#fff;padding:14px 20px;border:6px solid #151515;font-size:28px">● В ЭФИРЕ</div>
  <div style="flex:1;background:#fbf6ec;color:#151515;padding:10px 20px;border:6px solid #151515;border-left:none"><div style="font-size:30px">${t}</div><div style="font-family:Onest;font-weight:800;font-size:24px;color:#5a3820">${s}</div></div></div>`;
// табло «АПЛОДИСМЕНТЫ» загорается (#<id>)
const APPL = (id = "ap", z = 40) => `<div id="${id}" style="position:absolute;left:240px;top:180px;width:600px;height:110px;z-index:${z};border-radius:14px;background:#ff3b30;border:7px solid #151515;box-shadow:0 0 60px #ff3b30;text-align:center;font-family:Unbounded;font-weight:900;font-size:44px;line-height:96px;color:#fff;opacity:0">АПЛОДИСМЕНТЫ</div>`;
// финал — машина на гигантской тарелке
const PLATE = (y = 1520, z = 4) => `<div style="position:absolute;left:-40px;top:${y}px;width:1160px;height:260px;z-index:${z}"><svg viewBox="0 0 1160 260"><ellipse cx="580" cy="130" rx="570" ry="120" fill="#fbf6ec" stroke="#151515" stroke-width="10"/><ellipse cx="580" cy="120" rx="440" ry="80" fill="#ffffff" stroke="#d8d2c4" stroke-width="6"/><path d="M140 60 q30 -20 60 0 M960 60 q30 -20 60 0" stroke="#4cd964" stroke-width="12" fill="none"/></svg></div>`;
// бот у Глеба (красная Mazda 6 владельца)
const MZCARD = (id = "mcc") => BOTH("Mazda 6 · до 700 тыс.", `<div id="${id}">${CARD("Mazda 6 · 2008", "640 000 ₽", "рынок ≈ 780 000 ₽ · 1 владелец", "🔥 −18% к рынку · ⏱ 1 с после публикации")}</div>`);
const CTA73 = `<div style="position:absolute;left:60px;right:60px;top:1330px;z-index:70;background:#ffd23f;border:8px solid #151515;border-radius:34px;padding:26px 30px;box-shadow:0 14px 0 #151515;font-family:Unbounded;font-weight:900;color:#151515;text-align:center">
  <div style="font-size:52px;line-height:1.12">Бот <span style="color:#c0392b">«Перехват»</span><br>— ссылка в шапке</div><div style="margin-top:12px;font-size:30px;font-family:Onest;font-weight:800">объявления по всей России · через ~1 с после публикации</div></div>`;
