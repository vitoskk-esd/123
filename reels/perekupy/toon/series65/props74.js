// ep74 «Футбол: матч за Камри» (без мата): герои и реквизит (базовые помощники — props.js)
const VAD = { jacket: "#2f6db5", pants: "#2b2f37", hair: "#3a2a1a", tie: true, look: "o" };                     // комментатор Вадим (новый герой)
const REF = { jacket: "#ffd23f", pants: "#151515", hair: "#151515", mustache: true, look: "flat" };              // судья (новый герой)
const STAS = { jacket: "#3a3f46", pants: "#2b2f37", cap: "#2f6db5", hair: "#8a5a33", look: "grin" };
const CAMS = "camry/camry_side_c.png", CAM3 = "camry/camry.png";
Object.assign(CINE.SIZES, { [CAMS]: [1302, 395], [CAM3]: [1317, 627] });
const TITLE = (a, b) => `<div style="position:absolute;left:0;right:0;top:300px;text-align:center;font-family:Unbounded;font-weight:900;line-height:1;letter-spacing:-3px;z-index:50">
  <span style="display:inline-block;padding:10px 28px 18px;border:8px solid #151515;border-radius:22px;box-shadow:0 12px 0 #151515;font-size:82px;background:#ffd23f;color:#151515;transform:rotate(-3deg)">${a}</span><br>
  <span style="display:inline-block;padding:10px 28px 18px;border:8px solid #151515;border-radius:22px;box-shadow:0 12px 0 #151515;font-size:80px;background:#ff3b30;color:#fff;margin-top:26px;transform:rotate(2deg)">${b}</span></div>`;
const FR = (x, foot, h) => { const s = h / 740; return { s, l: x - 210 * s, t: foot - 740 * s }; };
// гарнитура комментатора поверх головы
const HEADSET = (x, foot, h, z = 9) => { const { s, l, t } = FR(x, foot, h);
  return `<div style="position:absolute;left:${l}px;top:${t}px;width:${420 * s}px;height:${800 * s}px;z-index:${z};pointer-events:none"><svg viewBox="0 0 420 800" style="overflow:visible">
  <path d="M110 220 Q110 70 210 70 Q310 70 310 220" stroke="#151515" stroke-width="16" fill="none"/><rect x="88" y="190" width="40" height="70" rx="14" fill="#2b2f37" stroke="#151515" stroke-width="6"/><rect x="292" y="190" width="40" height="70" rx="14" fill="#2b2f37" stroke="#151515" stroke-width="6"/>
  <path d="M110 250 Q120 320 190 320" stroke="#151515" stroke-width="8" fill="none"/><circle cx="196" cy="320" r="14" fill="#151515"/></svg></div>`; };
// приём 1 — табло: «ПЕРЕХВАТ 0 : 0 ПЕРЕКУПЫ», счёт #<id>a / #<id>b
const SCOREB = (x, y, id = "sb", w = 760, z = 40) => `<div id="${id}" style="position:absolute;left:${x}px;top:${y}px;width:${w}px;z-index:${z};background:#151515;border:8px solid #ffd23f;border-radius:20px;box-shadow:0 12px 0 #000;display:flex;align-items:center;justify-content:space-between;padding:18px 26px;font-family:Unbounded;font-weight:900">
  <div style="font-size:${w * .042}px;color:#ff7a1a;white-space:nowrap">ПЕРЕХВАТ</div>
  <div style="font-family:'JetBrains Mono';font-size:${w * .1}px;color:#fff;line-height:1;white-space:nowrap;flex:none"><span id="${id}a">0</span><span style="color:#ffd23f"> : </span><span id="${id}b">0</span></div>
  <div style="font-size:${w * .042}px;color:#9aa4ae;white-space:nowrap">ПЕРЕКУПЫ</div></div>`;
// приём 2 — видеоповтор: одометр крутится назад (#<id>v), плашка «ПОВТОР ▶ 0,25×»
const VARMON = (x, y, id = "vm", w = 860, z = 30) => `<div id="${id}" style="position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${w * .62}px;z-index:${z}">
  <div style="position:absolute;inset:0;background:#151a26;border:10px solid #2f6db5;border-radius:20px;box-shadow:0 0 50px #2f6db588"></div>
  <div style="position:absolute;left:5%;top:6%;padding:6px 16px;background:#c0392b;border:5px solid #151515;border-radius:10px;font-family:Unbounded;font-weight:900;font-size:${w * .04}px;color:#fff">ПОВТОР ▶ 0,25×</div>
  <div style="position:absolute;left:10%;right:10%;top:28%;height:44%;border-radius:50% 50% 12px 12px;background:radial-gradient(circle at 50% 100%,#2b2f37,#151515);border:8px solid #9aa4ae">
    <div style="position:absolute;left:12%;right:12%;bottom:14%;padding:8px 0;background:#000;border:5px solid #4a4f5a;border-radius:10px;text-align:center"><span id="${id}v" style="font-family:'JetBrains Mono';font-weight:800;font-size:${w * .075}px;color:#ffd27a">300 000</span><span style="font-family:Onest;font-weight:800;font-size:${w * .035}px;color:#9aa4ae"> км</span></div></div>
  <div style="position:absolute;left:5%;bottom:6%;font-family:Unbounded;font-weight:900;font-size:${w * .035}px;color:#2f6db5">VAR · ПРОВЕРКА ПРОБЕГА</div></div>`;
// приём 3 — судейская карточка (жёлтая / красная), #<id>
const REFCARD = (x, y, color = "#ff3b30", id = "rc", z = 32) => `<div id="${id}" style="position:absolute;left:${x}px;top:${y}px;width:170px;height:240px;z-index:${z};background:${color};border:7px solid #151515;border-radius:14px;box-shadow:0 10px 0 #151515;transform:rotate(-8deg)"></div>`;
// плашка эфира
const LOWER3 = (t, s, id = "l3", z = 55) => `<div id="${id}" style="position:absolute;left:40px;right:40px;top:1700px;z-index:${z};display:flex;font-family:Unbounded;font-weight:900">
  <div style="background:#c0392b;color:#fff;padding:14px 20px;border:6px solid #151515;font-size:26px">● ПРЯМОЙ ЭФИР</div>
  <div style="flex:1;background:#fbf6ec;color:#151515;padding:10px 20px;border:6px solid #151515;border-left:none"><div style="font-size:28px">${t}</div><div style="font-family:Onest;font-weight:800;font-size:24px;color:#5a3820">${s}</div></div></div>`;
// мяч
const BALL = (x, y, id = "ball", d = 120, z = 35) => `<div id="${id}" style="position:absolute;left:${x}px;top:${y}px;width:${d}px;height:${d}px;z-index:${z}"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="54" fill="#fff" stroke="#151515" stroke-width="7"/><path d="M60 34 l24 18 -9 28 h-30 l-9 -28 z" fill="#151515"/><path d="M60 6 V34 M84 52 L112 44 M75 80 L92 108 M45 80 L28 108 M36 52 L8 44" stroke="#151515" stroke-width="5"/></svg></div>`;
// бот у Стаса
const CAMCARD = (id = "ccc") => BOTH("Camry · до 2 млн", `<div id="${id}">${CARD("Toyota Camry · 2018", "1 950 000 ₽", "рынок ≈ 2 150 000 ₽ · 1 владелец", "🔥 −9% к рынку · ⏱ 1 с после публикации")}</div>`);
const CTA74 = `<div style="position:absolute;left:60px;right:60px;top:1330px;z-index:70;background:#ffd23f;border:8px solid #151515;border-radius:34px;padding:26px 30px;box-shadow:0 14px 0 #151515;font-family:Unbounded;font-weight:900;color:#151515;text-align:center">
  <div style="font-size:52px;line-height:1.12">Бот <span style="color:#c0392b">«Перехват»</span><br>— ссылка в шапке</div><div style="margin-top:12px;font-size:30px;font-family:Onest;font-weight:800">объявления по всей России · через ~1 с после публикации</div></div>`;
