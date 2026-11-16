// ep75 «Деревня: зверь, а не машина» (с матом): герои и реквизит (базовые помощники — props.js)
const EGO = { jacket: "#4a5a3a", pants: "#2b2f37", cap: "#5a4a3a", hair: "#e0e0e0", mustache: true, skin: "#eaa286", look: "flat" };   // дед Егорыч (новый герой)
const ART = { jacket: "#2f6db5", pants: "#2c3e66", hair: "#c98a3a", look: "grin" };                                                   // внук Артём (новый герой)
const MIT = { jacket: "#3a3f46", vest: true, pants: "#2f4f8a", cap: "#ff7a1a", hair: "#5a3a1a", look: "flat" };                      // тракторист Митяй (новый герой)
const NIVA = "niva/niva_34.png", NIVS = "niva/niva_side_r.png", PRADO = "prado/prado_34.png";
Object.assign(CINE.SIZES, { [NIVA]: [669, 361], [NIVS]: [675, 287], [PRADO]: [732, 366] });
const TITLE = (a, b) => `<div style="position:absolute;left:0;right:0;top:300px;text-align:center;font-family:Unbounded;font-weight:900;line-height:1;letter-spacing:-3px;z-index:50">
  <span style="display:inline-block;padding:10px 28px 18px;border:8px solid #151515;border-radius:22px;box-shadow:0 12px 0 #151515;font-size:82px;background:#ffd23f;color:#151515;transform:rotate(-3deg)">${a}</span><br>
  <span style="display:inline-block;padding:10px 28px 18px;border:8px solid #151515;border-radius:22px;box-shadow:0 12px 0 #151515;font-size:74px;background:#ff3b30;color:#fff;margin-top:26px;transform:rotate(2deg)">${b}</span></div>`;
// приём 1 — грязь поверх машины: машина «сидит» в луже по двери (#<id> — уровень поднимается), брызги
const MUD = (y, id = "md", z = 8) => `<div id="${id}" style="position:absolute;left:-60px;top:${y}px;width:1200px;height:${2300 - y}px;z-index:${z}">
  <svg viewBox="0 0 1200 600" preserveAspectRatio="none" style="position:absolute;left:0;top:0;width:100%;height:600px;overflow:visible"><path d="M0 60 Q150 0 300 50 T600 40 T900 55 T1200 40 V600 H0 Z" fill="#5a4630" stroke="#2e2418" stroke-width="10"/>
  ${[120, 380, 640, 900].map((x, k) => `<ellipse cx="${x}" cy="${110 + (k % 2) * 30}" rx="90" ry="16" fill="#7a8a98" opacity=".5"/>`).join("")}</svg>
  <div style="position:absolute;left:0;top:590px;width:100%;height:2000px;background:#5a4630"></div></div>`;
// брызги грязи (#<id>)
const SPLASH = (x, y, id = "sp", z = 9) => `<div id="${id}" style="position:absolute;left:${x}px;top:${y}px;width:300px;height:200px;z-index:${z}"><svg viewBox="0 0 300 200" style="overflow:visible">
  ${[[40, 120, 22], [90, 60, 16], [150, 30, 20], [210, 70, 14], [260, 130, 18], [120, 150, 12]].map(([cx, cy, r]) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#5a4630" stroke="#2e2418" stroke-width="4"/>`).join("")}</svg></div>`;
// приём 2 — «глубиномер лужи»: рейка с отметками, стрелка #<id>p
const DEPTH = (x, y, id = "dp", z = 30) => `<div id="${id}" style="position:absolute;left:${x}px;top:${y}px;width:330px;height:560px;z-index:${z}">
  <div style="position:absolute;left:0;top:0;width:110px;height:560px;background:repeating-linear-gradient(#fbf6ec 0 70px,#c0392b 70px 140px);border:7px solid #151515;border-radius:10px"></div>
  ${[["ПО КРЫШУ", 30], ["ПО ДВЕРИ", 210], ["ПО КОЛЕНО", 390]].map(([t, yy]) => `<div style="position:absolute;left:126px;top:${yy}px;font-family:Unbounded;font-weight:900;font-size:28px;color:#151515;background:#ffd23f;border:5px solid #151515;border-radius:10px;padding:4px 10px;white-space:nowrap">${t}</div>`).join("")}
  <div id="${id}p" style="position:absolute;left:-60px;top:420px;width:0;height:0;border-top:26px solid transparent;border-bottom:26px solid transparent;border-left:50px solid #ff3b30;transform:translateY(-215px)"></div></div>`;
// приём 3 — трактор (кабина справа), трос #<id>r тянется к машине слева
const TRACTOR = (x, ground, w = 620, id = "tr", z = 6) => { const s = w / 620, t = ground - 520 * s;
  return `<div id="${id}" style="position:absolute;left:${x}px;top:${t}px;width:${w}px;height:${520 * s}px;z-index:${z}"><svg viewBox="0 0 620 520" style="overflow:visible">
  <rect x="80" y="200" width="300" height="140" rx="16" fill="#c0392b" stroke="#151515" stroke-width="8"/><rect x="330" y="60" width="210" height="240" rx="14" fill="#c0392b" stroke="#151515" stroke-width="8"/>
  <rect x="352" y="84" width="166" height="120" fill="#a8cfe8" stroke="#151515" stroke-width="6"/><path d="M120 200 V110" stroke="#2b2f37" stroke-width="22"/>
  <circle cx="160" cy="400" r="90" fill="#26282e" stroke="#151515" stroke-width="8"/><circle cx="160" cy="400" r="38" fill="#ffd23f" stroke="#151515" stroke-width="6"/>
  <circle cx="460" cy="380" r="130" fill="#26282e" stroke="#151515" stroke-width="8"/><circle cx="460" cy="380" r="56" fill="#ffd23f" stroke="#151515" stroke-width="6"/>
  <text x="230" y="290" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="34" fill="#fff">МТЗ</text></svg></div>`; };
// трос между двумя точками (#<id>)
const TOWROPE = (x1, y1, x2, y2, id = "rp", z = 7) => `<svg id="${id}" style="position:absolute;left:0;top:0;width:1080px;height:1920px;overflow:visible;z-index:${z}" viewBox="0 0 1080 1920"><path d="M${x1} ${y1} Q${(x1 + x2) / 2} ${Math.max(y1, y2) + 40} ${x2} ${y2}" stroke="#151515" stroke-width="12" fill="none"/><path d="M${x1} ${y1} Q${(x1 + x2) / 2} ${Math.max(y1, y2) + 40} ${x2} ${y2}" stroke="#ffd23f" stroke-width="5" stroke-dasharray="18 14" fill="none"/></svg>`;
// оторванный бампер «Нивы» (#<id>)
const NBUMP = (x, y, id = "nb", z = 9) => `<div id="${id}" style="position:absolute;left:${x}px;top:${y}px;width:280px;height:70px;z-index:${z}"><svg viewBox="0 0 280 70"><rect x="8" y="10" width="264" height="44" rx="8" fill="#26282e" stroke="#151515" stroke-width="7"/><rect x="30" y="20" width="40" height="18" fill="#f4f0e8"/><rect x="210" y="20" width="40" height="18" fill="#f4f0e8"/></svg></div>`;
// куры (#<id>0…2)
const HENS = (x, y, id = "hn", z = 12) => [0, 1, 2].map(k => `<div id="${id}${k}" style="position:absolute;left:${x + k * 120}px;top:${y + (k % 2) * 40}px;width:110px;height:110px;z-index:${z}"><svg viewBox="0 0 110 110">
  <ellipse cx="55" cy="66" rx="40" ry="30" fill="#f4f0e8" stroke="#151515" stroke-width="6"/><circle cx="84" cy="36" r="18" fill="#f4f0e8" stroke="#151515" stroke-width="6"/><path d="M80 18 q6 -12 12 0 q6 -10 10 4" fill="#e0302a" stroke="#151515" stroke-width="3"/>
  <path d="M100 38 l12 4 l-12 4 z" fill="#ffd23f" stroke="#151515" stroke-width="3"/><circle cx="88" cy="34" r="3" fill="#151515"/><path d="M45 96 v12 M65 96 v12" stroke="#ff9a2a" stroke-width="6"/></svg></div>`).join("");
// бот у внука
const PRCARD = (id = "pcc") => BOTH("Прадо · до 3,5 млн", `<div id="${id}">${CARD("Toyota Land Cruiser Prado · 2017", "3 290 000 ₽", "рынок ≈ 3 600 000 ₽ · 1 владелец", "🔥 −9% к рынку · ⏱ 1 с после публикации")}</div>`);
const CTA75 = `<div style="position:absolute;left:60px;right:60px;top:1330px;z-index:70;background:#ffd23f;border:8px solid #151515;border-radius:34px;padding:26px 30px;box-shadow:0 14px 0 #151515;font-family:Unbounded;font-weight:900;color:#151515;text-align:center">
  <div style="font-size:52px;line-height:1.12">Бот <span style="color:#c0392b">«Перехват»</span><br>— ссылка в шапке</div><div style="margin-top:12px;font-size:30px;font-family:Onest;font-weight:800">объявления по всей России · через ~1 с после публикации</div></div>`;
const PIP = (inner, id, ring = "#ffd23f", left = 700, top = 1440, bgc = "#2b2f37") => `<div id="${id}" class="grp" style="position:absolute;left:${left}px;top:${top}px;width:320px;height:320px;border-radius:50%;overflow:hidden;border:9px solid ${ring};z-index:45;background:${bgc};box-shadow:0 10px 30px #0008">${inner}</div>`;
