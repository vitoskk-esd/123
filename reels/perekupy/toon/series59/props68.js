// ep68 «Автошкола: Тамара Павловна»: герои и реквизит (базовые помощники — props.js)
// инструктор Тамара Павловна (новая героиня): из «vika» — сиреневый кардиган, седые волосы, бант → пучок, очки
const TGLASS = `<g><rect x="150" y="200" width="56" height="36" rx="14" fill="#cfe8f5" fill-opacity=".25" stroke="#151515" stroke-width="6"/><rect x="214" y="200" width="56" height="36" rx="14" fill="#cfe8f5" fill-opacity=".25" stroke="#151515" stroke-width="6"/><path d="M206 214 h8 M150 212 l-16 -6 M270 212 l16 -6" stroke="#151515" stroke-width="5"/><path d="M134 206 q-6 60 20 90 M286 206 q6 60 -20 90" stroke="#c9a06a" stroke-width="4" fill="none"/></g>`;
const TPC = html => html.replaceAll("#8e1f3a", "#7a4a9a").replaceAll("#5c1426", "#56306e").replaceAll("#2b1a14", "#b4aea6").replaceAll("#2c3e66", "#3a3f46")
  .replaceAll('fill="#ff3b30" stroke="#151515" stroke-width="4" transform="rotate(-20', 'fill="#b4aea6" stroke="#151515" stroke-width="4" transform="rotate(-20')
  .replace('<path d="M210 232 q-10 22 2 28"', TGLASS + '<path d="M210 232 q-10 22 2 28"');
const KIR = { jacket: "#ffd23f", pants: "#2c3e66", hair: "#3a2a1a", look: "o" };      // ученик Кирилл (новый герой)
const V10 = "vaz2110/vaz2110_side_r.png", ELN = "hyundai/hyundai.png";
Object.assign(CINE.SIZES, { [V10]: [741, 249], [ELN]: [1138, 360] });
const TITLE = (a, b) => `<div style="position:absolute;left:0;right:0;top:300px;text-align:center;font-family:Unbounded;font-weight:900;line-height:1;letter-spacing:-3px;z-index:50">
  <span style="display:inline-block;padding:10px 28px 18px;border:8px solid #151515;border-radius:22px;box-shadow:0 12px 0 #151515;font-size:80px;background:#ffd23f;color:#151515;transform:rotate(-3deg)">${a}</span><br>
  <span style="display:inline-block;padding:10px 28px 18px;border:8px solid #151515;border-radius:22px;box-shadow:0 12px 0 #151515;font-size:78px;background:#ff3b30;color:#fff;margin-top:26px;transform:rotate(2deg)">${b}</span></div>`;
// знак «У» на крышу учебной машины
const USIGN = (x, y, id = "", z = 6) => `<div${id ? ` id="${id}"` : ""} style="position:absolute;left:${x}px;top:${y}px;width:110px;height:100px;z-index:${z}"><svg viewBox="0 0 110 100"><path d="M55 6 L104 92 H6 Z" fill="#ff3b30" stroke="#151515" stroke-width="6" stroke-linejoin="round"/><path d="M55 26 L86 80 H24 Z" fill="#fff"/><text x="55" y="76" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="34" fill="#151515">У</text></svg></div>`;
// торпеда учебки (передний план салона): прячет героев ниже груди; руль перед учеником (#<id>w), копилка за мат — отдельно (JAR)
const DASH = (wx = 760, id = "ds", wheel = true) => `<div id="${id}" style="position:absolute;left:0;top:1440px;width:1080px;height:600px;z-index:20">
  <div style="position:absolute;left:-20px;right:-20px;top:40px;height:600px;background:#26282e;border-top:10px solid #151515;border-radius:60px 60px 0 0"></div>
  <div style="position:absolute;left:400px;top:90px;width:280px;height:120px;background:#1b1c20;border:6px solid #151515;border-radius:16px"><div style="margin:18px auto;width:200px;height:60px;border-radius:10px;background:#2f6db5;opacity:.6"></div></div>
  ${wheel ? `<div id="${id}w" style="position:absolute;left:${wx - 190}px;top:-60px;width:380px;height:380px"><svg viewBox="0 0 420 420"><circle cx="210" cy="210" r="180" fill="none" stroke="#151515" stroke-width="44"/><circle cx="210" cy="210" r="180" fill="none" stroke="#33363d" stroke-width="30"/><path d="M40 230 H380 M210 230 V390" stroke="#33363d" stroke-width="34"/><circle cx="210" cy="230" r="54" fill="#26282e" stroke="#151515" stroke-width="8"/><text x="210" y="244" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="34" fill="#9aa4ae">ВАЗ</text></svg></div>` : ""}</div>`;
// приём 1 — копилка «ЗА МАТ · 50 ₽»: уровень монет #<id>f (высота, %), сумма #<id>c
const JAR = (x, y, id = "jar", pct = 10, sum = "0 ₽", z = 24) => `<div id="${id}" style="position:absolute;left:${x}px;top:${y}px;width:220px;height:300px;z-index:${z}">
  <div style="position:absolute;left:30px;right:30px;top:0;height:34px;background:#c9a06a;border:6px solid #151515;border-radius:8px"></div>
  <div style="position:absolute;left:10px;right:10px;top:34px;bottom:0;border:7px solid #151515;border-radius:26px 26px 34px 34px;background:#cfe8f533;overflow:hidden">
    <div id="${id}f" style="position:absolute;left:0;right:0;bottom:0;height:${pct}%;background:repeating-linear-gradient(0deg,#e6c88a 0 14px,#c9a06a 14px 18px);border-top:5px solid #8a6a2a"></div>
    <div style="position:absolute;left:14px;right:14px;top:56px;padding:6px 0;background:#fbf6ec;border:5px solid #151515;border-radius:10px;text-align:center;font-family:Unbounded;font-weight:900;font-size:20px;line-height:1.15;color:#c0392b">ЗА МАТ<br><span style="color:#151515">50 ₽</span></div></div>
  <div id="${id}c" style="position:absolute;left:-30px;right:-30px;top:-70px;text-align:center;font-family:Unbounded;font-weight:900;font-size:40px;color:#ffd23f;-webkit-text-stroke:8px #151515;paint-order:stroke">${sum}</div></div>`;
// приём 2 — оторванный руль в руках ученика
const WHEEL = (x, y, id = "wh", d = 330, z = 30) => `<div id="${id}" style="position:absolute;left:${x - d / 2}px;top:${y - d / 2}px;width:${d}px;height:${d}px;z-index:${z}"><svg viewBox="0 0 420 420" style="overflow:visible"><circle cx="210" cy="210" r="180" fill="none" stroke="#151515" stroke-width="44"/><circle cx="210" cy="210" r="180" fill="none" stroke="#33363d" stroke-width="30"/><path d="M40 230 H380 M210 230 V390" stroke="#33363d" stroke-width="34"/><circle cx="210" cy="230" r="54" fill="#26282e" stroke="#151515" stroke-width="8"/><path d="M210 284 v60 l-14 30 M210 344 l16 26" stroke="#9aa4ae" stroke-width="10" stroke-linecap="round"/></svg></div>`;
// приём 3 — вставка «вторая педаль тормоза»: туфля инструктора жмёт педаль, педаль отламывается (#<id>p падает)
const PEDAL = (id = "pd") => `<div id="${id}" style="position:absolute;left:0;top:0;width:1080px;height:1920px;z-index:15;background:radial-gradient(circle at 50% 55%,#3a3d46,#151518 75%)">
  <svg viewBox="0 0 1080 1920" style="position:absolute;inset:0;overflow:visible">
    <path d="M0 1500 Q540 1400 1080 1500 V1920 H0 Z" fill="#1d1e22"/>
    <g id="${id}p"><path d="M560 560 Q600 900 560 1150" stroke="#9aa4ae" stroke-width="44" fill="none" stroke-linecap="round"/><rect x="420" y="1120" width="300" height="200" rx="30" fill="#2b2f37" stroke="#151515" stroke-width="10"/>${[0, 1, 2, 3].map(k => `<path d="M450 ${1160 + k * 40} H690" stroke="#151515" stroke-width="8"/>`).join("")}</g>
    <path d="M520 560 l30 -20 l30 20 l-30 20 z" fill="#ff3b30" stroke="#151515" stroke-width="6"/>
    <g id="${id}s"><path d="M-60 500 L460 990" stroke="#151515" stroke-width="196" stroke-linecap="round"/><path d="M-60 500 L460 990" stroke="#6a5a8a" stroke-width="172" stroke-linecap="round"/><path d="M40 560 L380 890" stroke="#7d6c9e" stroke-width="40" stroke-linecap="round"/>
      <path d="M380 930 q60 -70 150 -20 l170 120 q40 40 0 70 l-240 40 q-60 6 -100 -40 z" fill="#5a1a2e" stroke="#151515" stroke-width="12" stroke-linejoin="round"/>
      <path d="M400 1050 l-10 110 h40 l20 -96 z" fill="#151515"/><path d="M470 960 q60 -20 120 30" stroke="#8a3a52" stroke-width="10" fill="none"/></g>
    <text x="540" y="420" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="64" fill="#ffd23f" stroke="#151515" stroke-width="12" paint-order="stroke">ВТОРАЯ ПЕДАЛЬ</text></svg></div>`;
// наклейка «КАК НОВАЯ» на стекле десятки
const NEWTAG = (x, y, id = "nt") => `<div id="${id}" style="position:absolute;left:${x}px;top:${y}px;z-index:8;transform:rotate(-6deg);background:#ffd23f;border:5px solid #151515;border-radius:10px;padding:6px 14px;font-family:Unbounded;font-weight:900;font-size:30px;color:#151515;white-space:nowrap">КАК НОВАЯ!</div>`;
// бот у Тамары Павловны
const ELCARD = (id = "ecc") => BOTH("Elantra · до 1,3 млн", `<div id="${id}">${CARD("Hyundai Elantra · 2020", "1 190 000 ₽", "рынок ≈ 1 400 000 ₽ · 1 владелец", "🔥 −15% к рынку · ⏱ 1 с после публикации")}</div>`);
const CTA68 = `<div style="position:absolute;left:60px;right:60px;top:1330px;z-index:70;background:#ffd23f;border:8px solid #151515;border-radius:34px;padding:26px 30px;box-shadow:0 14px 0 #151515;font-family:Unbounded;font-weight:900;color:#151515;text-align:center">
  <div style="font-size:52px;line-height:1.12">Бот <span style="color:#c0392b">«Перехват»</span><br>— ссылка в шапке</div><div style="margin-top:12px;font-size:30px;font-family:Onest;font-weight:800">объявления по всей России · через ~1 с после публикации</div></div>`;
