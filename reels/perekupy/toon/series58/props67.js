// ep67 «Гараж: мастер без цензуры»: герои и реквизит (базовые помощники — props.js)
const GAV = { jacket: "#5a6a3a", pants: "#2b2f37", cap: "#2b2f37", hair: "#d8d8d8", mustache: true, skin: "#eaa286", look: "flat" };   // мастер Гаврилыч (новый герой)
const SAN = { jacket: "#2f6db5", pants: "#3a3f46", hair: "#c8c8c8", glasses: true, scarf: "#c0392b", look: "o" };                       // сосед по гаражу Саныч (новый герой)
const STAS = { jacket: "#3a3f46", pants: "#2b2f37", cap: "#2f6db5", hair: "#8a5a33", look: "grin" };
const GRS = "granta/granta_side.png", CAM = "camry/camry_side_c.png";
Object.assign(CINE.SIZES, { [GRS]: [777, 266], [CAM]: [1302, 395] });
const TITLE = (a, b) => `<div style="position:absolute;left:0;right:0;top:300px;text-align:center;font-family:Unbounded;font-weight:900;line-height:1;letter-spacing:-3px;z-index:50">
  <span style="display:inline-block;padding:10px 28px 18px;border:8px solid #151515;border-radius:22px;box-shadow:0 12px 0 #151515;font-size:82px;background:#ffd23f;color:#151515;transform:rotate(-3deg)">${a}</span><br>
  <span style="display:inline-block;padding:10px 28px 18px;border:8px solid #151515;border-radius:22px;box-shadow:0 12px 0 #151515;font-size:86px;background:#ff3b30;color:#fff;margin-top:26px;transform:rotate(2deg)">${b}</span></div>`;
// ближний край смотровой ямы: прячет ноги героя, стоящего в яме (герой ставится ногами ниже пола)
const PITFRONT = (y = 1600, z = 9) => `<div style="position:absolute;left:0;top:${y}px;width:1080px;height:${2700 - y}px;z-index:${z};background:#8a8680;border-top:18px dashed #ffd23f;box-shadow:inset 0 7px 0 #151515"></div>`;
// приём 1 — мат-о-метр: полукруглая шкала (зелёная → жёлтая → красная), стрелка #<id>n крутится от −90° до +90°
const MATOMETR = (x, y, id = "mm", s = 1) => `<div id="${id}" style="position:absolute;left:${x}px;top:${y}px;width:${300 * s}px;height:${210 * s}px;z-index:60">
  <div style="position:absolute;inset:0;background:#151515;border:6px solid #ffd23f;border-radius:${24 * s}px;box-shadow:0 ${8 * s}px 0 #000"></div>
  <svg viewBox="0 0 300 210" style="position:absolute;inset:0;width:100%;height:100%;overflow:visible">
    <path d="M50 160 A100 100 0 0 1 110 70" stroke="#4cd964" stroke-width="26" fill="none"/><path d="M110 70 A100 100 0 0 1 190 70" stroke="#ffd23f" stroke-width="26" fill="none"/><path d="M190 70 A100 100 0 0 1 250 160" stroke="#ff3b30" stroke-width="26" fill="none"/>
    <g id="${id}n" style="transform-origin:150px 160px;transform:rotate(-80deg)"><path d="M150 160 L150 62" stroke="#fff" stroke-width="9" stroke-linecap="round"/></g><circle cx="150" cy="160" r="14" fill="#fff" stroke="#151515" stroke-width="5"/>
    <text x="150" y="200" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="26" fill="#ffd23f">МАТ-О-МЕТР</text></svg></div>`;
// приём 2 — толщиномер краски крупно: число #<id>v, вердикт #<id>s
const GAUGE = (x, y, id = "tq", val = "120", st = "ЗАВОД", col = "#4cd964") => `<div id="${id}" style="position:absolute;left:${x}px;top:${y}px;width:340px;height:500px;z-index:40;transform:rotate(-8deg)">
  <div style="position:absolute;inset:0;background:#2b2f37;border:8px solid #151515;border-radius:46px;box-shadow:0 12px 0 #151515"></div>
  <div style="position:absolute;left:34px;right:34px;top:40px;height:230px;background:#cfe8c4;border:6px solid #151515;border-radius:16px;text-align:center;font-family:'JetBrains Mono';font-weight:800;color:#151515">
    <div id="${id}v" style="font-size:110px;line-height:150px">${val}</div><div style="font-size:34px">мкм</div></div>
  <div id="${id}s" style="position:absolute;left:34px;right:34px;top:300px;padding:10px 0;border-radius:14px;background:${col};border:5px solid #151515;text-align:center;font-family:Unbounded;font-weight:900;font-size:34px;color:#151515">${st}</div>
  <div style="position:absolute;left:120px;top:400px;width:100px;height:60px;border-radius:30px;background:#ffd23f;border:5px solid #151515"></div>
  <div style="position:absolute;left:150px;top:-70px;width:40px;height:80px;background:#9aa4ae;border:5px solid #151515;border-radius:10px"></div></div>`;
// приём 3 — днище над ямой (вид снизу): у Гранты — ржавые дыры и монтажная пена в порогах, у Камри — чистое
const UNDER = (rusty, id = "un") => `<div id="${id}" style="position:absolute;left:40px;top:-40px;width:1000px;height:620px;z-index:5"><svg viewBox="0 0 1000 620" style="overflow:visible">
  <rect x="20" y="40" width="960" height="520" rx="60" fill="${rusty ? "#4a3a2e" : "#2f3238"}" stroke="#151515" stroke-width="8"/>
  <rect x="440" y="40" width="120" height="520" fill="${rusty ? "#3a2a20" : "#26292e"}" stroke="#151515" stroke-width="6"/>
  <path d="M120 300 H880" stroke="${rusty ? "#6a4a2a" : "#5b6670"}" stroke-width="22" stroke-linecap="round"/>
  ${[[150, 150], [850, 150], [150, 460], [850, 460]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="70" fill="#1d1d1f" stroke="#151515" stroke-width="6"/>`).join("")}
  ${rusty ? `${[[300, 120, 46], [690, 470, 38], [260, 430, 30], [760, 160, 26]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r + 16}" fill="#b0562a" opacity=".85"/><circle cx="${x}" cy="${y}" r="${r}" fill="#0e0c0a" stroke="#6a2a10" stroke-width="5"/>`).join("")}
  <g id="${id}p">${[90, 210, 330, 560, 690, 830].map((x, k) => `<path d="M${x} 560 q${k % 2 ? 30 : -20} ${40 + k * 6} ${k % 2 ? -10 : 30} ${70 + k * 5} q30 20 50 -10 q-6 -50 -10 -60 z" fill="#f2d16a" stroke="#151515" stroke-width="5"/>`).join("")}</g>` : ""}</svg></div>`;
// переноска: лампа в решётке на проводе (качается)
const LAMP = (x, y, id = "lp", z = 30) => `<div id="${id}" style="position:absolute;left:${x}px;top:${y}px;width:120px;height:420px;z-index:${z};transform-origin:60px 0">
  <svg viewBox="0 0 120 420" style="overflow:visible"><path d="M60 0 V250" stroke="#151515" stroke-width="7"/><rect x="40" y="246" width="40" height="40" fill="#2b2f37" stroke="#151515" stroke-width="5"/>
  <ellipse cx="60" cy="330" rx="36" ry="48" fill="#fff6d0" stroke="#151515" stroke-width="5"/><path d="M28 300 H92 M24 330 H96 M28 360 H92 M60 284 V378" stroke="#151515" stroke-width="5"/></svg></div>
  <div style="position:absolute;left:${x - 200}px;top:${y + 130}px;width:520px;height:520px;border-radius:50%;z-index:${z - 1};background:radial-gradient(circle,#fff6d055,#fff6d000 70%);pointer-events:none"></div>`;
// приём 4 — настенные часы для таймлапса «40 минут молча»: стрелки #<id>m и #<id>h
const CLOCK = (x, y, id = "ck", r = 120) => `<div style="position:absolute;left:${x}px;top:${y}px;width:${2 * r}px;height:${2 * r}px;z-index:40"><svg viewBox="0 0 240 240" style="overflow:visible">
  <circle cx="120" cy="120" r="112" fill="#fbf6ec" stroke="#151515" stroke-width="10"/>${Array.from({ length: 12 }, (_, k) => `<path d="M120 22 V40" stroke="#151515" stroke-width="7" transform="rotate(${k * 30} 120 120)"/>`).join("")}
  <g id="${id}h" style="transform-origin:120px 120px;transform:rotate(60deg)"><path d="M120 120 V70" stroke="#151515" stroke-width="12" stroke-linecap="round"/></g>
  <g id="${id}m" style="transform-origin:120px 120px"><path d="M120 120 V36" stroke="#c0392b" stroke-width="8" stroke-linecap="round"/></g><circle cx="120" cy="120" r="10" fill="#151515"/></svg></div>`;
// рассада Саныча: ящик со стаканчиками
const SEEDS = (x, y, id = "sd", z = 12) => `<div id="${id}" style="position:absolute;left:${x}px;top:${y}px;width:300px;height:170px;z-index:${z}"><svg viewBox="0 0 300 170" style="overflow:visible">
  ${[30, 100, 170, 240].map((cx, k) => `<path d="M${cx} 90 q${k % 2 ? 10 : -12} -50 ${k % 2 ? -6 : 8} -80" stroke="#3f8a3a" stroke-width="7" fill="none"/><ellipse cx="${cx + (k % 2 ? -10 : 14)}" cy="${30 + k * 3}" rx="22" ry="11" fill="#4cd964" stroke="#151515" stroke-width="4"/><path d="M${cx - 26} 80 h52 l-8 50 h-36 z" fill="#ff7a1a" stroke="#151515" stroke-width="5"/>`).join("")}
  <rect x="0" y="120" width="300" height="46" rx="6" fill="#8a5a33" stroke="#151515" stroke-width="6"/></svg></div>`;
// бот у Стаса
const CAMCARD = (id = "kcc") => BOTH("Camry · до 2 млн", `<div id="${id}">${CARD("Toyota Camry · 2019", "1 790 000 ₽", "рынок ≈ 2 050 000 ₽ · 1 владелец", "🔥 −13% к рынку · ⏱ 1 с после публикации")}</div>`);
const CTA67 = `<div style="position:absolute;left:60px;right:60px;top:1330px;z-index:70;background:#ffd23f;border:8px solid #151515;border-radius:34px;padding:26px 30px;box-shadow:0 14px 0 #151515;font-family:Unbounded;font-weight:900;color:#151515;text-align:center">
  <div style="font-size:52px;line-height:1.12">Бот <span style="color:#c0392b">«Перехват»</span><br>— ссылка в шапке</div><div style="margin-top:12px;font-size:30px;font-family:Onest;font-weight:800">объявления по всей России · через ~1 с после публикации</div></div>`;
