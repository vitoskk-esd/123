// ep70 «Детектив: дело утопленницы» (без мата): герои и реквизит (базовые помощники — props.js)
const GOR = { jacket: "#a8865a", pants: "#4a3f35", cap: "#6b4a2a", hair: "#5a4030", mustache: true, scarf: "#8a2a2a", look: "flat" };   // частный детектив Горохов (новый герой)
// клиентка Ольга (новая героиня): из «vika» — бирюзовое пальто, светлые волосы
const OLC = html => html.replaceAll("#8e1f3a", "#2f8a8a").replaceAll("#5c1426", "#1f6a6a").replaceAll("#2b1a14", "#d8b060").replaceAll("#2c3e66", "#2b2f37");
const CAMS = "camry/camry_side_c.png", VES = "vesta/vesta_34.png";
Object.assign(CINE.SIZES, { [CAMS]: [1302, 395], [VES]: [781, 375] });
const TITLE = (a, b) => `<div style="position:absolute;left:0;right:0;top:300px;text-align:center;font-family:Unbounded;font-weight:900;line-height:1;letter-spacing:-3px;z-index:50">
  <span style="display:inline-block;padding:10px 28px 18px;border:8px solid #151515;border-radius:22px;box-shadow:0 12px 0 #151515;font-size:82px;background:#ffd23f;color:#151515;transform:rotate(-3deg)">${a}</span><br>
  <span style="display:inline-block;padding:10px 28px 18px;border:8px solid #151515;border-radius:22px;box-shadow:0 12px 0 #151515;font-size:76px;background:#ff3b30;color:#fff;margin-top:26px;transform:rotate(2deg)">${b}</span></div>`;
// карась (рисунок)
const CARP = (w = 200, rot = 0) => `<svg viewBox="0 0 200 110" style="width:${w}px;transform:rotate(${rot}deg);overflow:visible"><path d="M20 55 Q70 5 140 40 L190 15 L180 55 L190 95 L140 70 Q70 105 20 55 Z" fill="#e0b040" stroke="#151515" stroke-width="6" stroke-linejoin="round"/>
  <circle cx="50" cy="48" r="8" fill="#151515"/><path d="M80 30 q10 25 0 50 M100 32 q10 23 0 46" stroke="#a87a20" stroke-width="4" fill="none"/></svg>`;
// приём 1 — лупа: в линзе крупно коврик — ил, песок и живой карась (#<id>f шевелится)
const LOUPE = (x, y, id = "lp", r = 230, z = 30) => `<div id="${id}" style="position:absolute;left:${x - r}px;top:${y - r}px;width:${2 * r}px;height:${2 * r}px;z-index:${z}">
  <div style="position:absolute;left:${r * 1.55}px;top:${r * 1.55}px;width:${r * .3}px;height:${r * 1.1}px;background:#5a3820;border:7px solid #151515;border-radius:20px;transform:rotate(-45deg);transform-origin:50% 0"></div>
  <div style="position:absolute;inset:0;border-radius:50%;overflow:hidden;border:16px solid #2b2f37;box-shadow:0 0 0 6px #151515,0 14px 30px #0008;background:repeating-linear-gradient(45deg,#3a3d46 0 10px,#33363d 10px 20px)">
    <svg viewBox="0 0 460 460" style="position:absolute;inset:0;width:100%;height:100%"><ellipse cx="200" cy="330" rx="200" ry="70" fill="#6a5a3a" opacity=".85"/>${Array.from({ length: 40 }, (_, k) => `<circle cx="${(k * 97) % 440 + 10}" cy="${280 + (k * 53) % 140}" r="${3 + k % 4}" fill="#d8c08a"/>`).join("")}
    <path d="M60 120 q40 -30 80 0 t80 0" stroke="#4a6a3a" stroke-width="8" fill="none"/></svg>
    <div id="${id}f" style="position:absolute;left:${r * .55}px;top:${r * .7}px">${CARP(r * 1.05, -8)}</div>
    <div style="position:absolute;inset:0;border-radius:50%;background:radial-gradient(circle at 30% 25%,#ffffff55,#ffffff00 40%)"></div></div></div>`;
// карась в руке героя (держит за хвост)
const CARPHAND = (x, y, id = "ch", w = 220, z = 12) => `<div id="${id}" style="position:absolute;left:${x}px;top:${y}px;z-index:${z};transform-origin:90% 30%">${CARP(w, 70)}</div>`;
// приём 2 — доска улик: фото и красные нити (#<id>s — для анимации прорисовки)
const EVID = (x, y, id = "ev", z = 8) => { const ph = (px, py, t, c, inner) => `<g transform="translate(${px} ${py})"><rect x="0" y="0" width="190" height="170" fill="#fbf6ec" stroke="#151515" stroke-width="5"/><rect x="14" y="14" width="162" height="110" fill="${c}"/>${inner}<text x="95" y="155" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="22" fill="#151515">${t}</text><circle cx="95" cy="6" r="10" fill="#c0392b" stroke="#151515" stroke-width="3"/></g>`;
  return `<div id="${id}" style="position:absolute;left:${x}px;top:${y}px;width:860px;height:640px;z-index:${z}"><svg viewBox="0 0 860 640" style="overflow:visible">
  <rect x="0" y="0" width="860" height="640" rx="10" fill="#b98a5a" stroke="#5a3820" stroke-width="16"/>${Array.from({ length: 60 }, (_, k) => `<circle cx="${(k * 131) % 840 + 10}" cy="${(k * 71) % 620 + 10}" r="3" fill="#8a6a3a"/>`).join("")}
  <g id="${id}s" fill="none" stroke="#e02020" stroke-width="7"><path d="M185 140 L430 400"/><path d="M675 140 L430 400"/><path d="M185 140 L675 140"/><path d="M185 470 L430 400"/></g>
  ${ph(90, 60, "КАМРИ", "#cfd8dc", `<path d="M30 100 q20 -40 70 -44 h50 q30 4 40 44 z" fill="#f4f0e8" stroke="#151515" stroke-width="4"/>`)}
  ${ph(580, 60, "РЕКА", "#5a7a8a", `<path d="M14 80 q40 -20 80 0 t82 0" stroke="#cfe0ea" stroke-width="6" fill="none"/>`)}
  ${ph(90, 390, "КАРАСЬ", "#e8dcc0", `<g transform="translate(40 40) scale(.55)">${CARP(200).replace(/<\/?svg[^>]*>/g, "")}</g>`)}
  ${ph(335, 330, "ЖОРА", "#d8c8b8", `<circle cx="95" cy="70" r="34" fill="#e8b48c" stroke="#151515" stroke-width="4"/><path d="M58 50 q37 -40 74 0 z" fill="#c0392b" stroke="#151515" stroke-width="4"/><path d="M80 82 q15 8 30 0" stroke="#151515" stroke-width="6"/>`)}
  </svg></div>`; };
// приём 3 — лампа допроса: качается (#<id>), конус света
const QLAMP = (x, id = "ql", z = 40) => `<div id="${id}" style="position:absolute;left:${x - 300}px;top:0;width:600px;height:1500px;z-index:${z};transform-origin:300px 0;pointer-events:none">
  <svg viewBox="0 0 600 1500" style="overflow:visible"><path d="M300 0 V420" stroke="#151515" stroke-width="8"/><path d="M220 420 h160 l60 90 h-280 z" fill="#2b2f37" stroke="#151515" stroke-width="7"/><ellipse cx="300" cy="512" rx="140" ry="18" fill="#fff6d0"/>
  <path d="M160 512 L-60 1500 H660 L440 512 Z" fill="#fff6d0" opacity=".16"/></svg></div>`;
// приём 4 — папка «ДЕЛО №…», печать «ЗАКРЫТО» (#<id>s)
const FOLDER = (x, y, id = "fd", z = 40) => `<div id="${id}" style="position:absolute;left:${x}px;top:${y}px;width:520px;height:380px;z-index:${z};transform:rotate(-4deg)">
  <div style="position:absolute;inset:0;background:#e6c88a;border:7px solid #151515;border-radius:10px;box-shadow:0 12px 0 #151515"></div>
  <div style="position:absolute;left:30px;top:30px;font-family:Unbounded;font-weight:900;font-size:44px;color:#151515">ДЕЛО № 70</div>
  <div style="position:absolute;left:30px;top:96px;font-family:'JetBrains Mono';font-weight:800;font-size:30px;line-height:1.35;color:#3a2a10">«Камри-утопленница»<br>подозреваемый: Жора<br>улика: карась (живой)</div>
  <div id="${id}s" style="position:absolute;right:24px;bottom:30px;padding:8px 22px;border:8px solid #c0392b;border-radius:14px;color:#c0392b;font-family:Unbounded;font-weight:900;font-size:46px;transform:rotate(-12deg);background:#e6c88add">ЗАКРЫТО</div></div>`;
// вода поверх «утопленницы» во флешбэке
const WATER = (y, id = "wt", z = 9) => `<div id="${id}" style="position:absolute;left:-40px;top:${y}px;width:1160px;height:${2100 - y}px;z-index:${z};background:linear-gradient(#5a7a8acc,#3a5a6aee);border-top:8px solid #cfe0ea"></div>`;
// круг «картинка в картинке» с говорящим
const PIP = (inner, id, ring = "#ffd23f", left = 700, top = 1440) => `<div id="${id}" class="grp" style="position:absolute;left:${left}px;top:${top}px;width:320px;height:320px;border-radius:50%;overflow:hidden;border:9px solid ${ring};z-index:30;background:#2a2f3e;box-shadow:0 10px 30px #0008">${inner}</div>`;
// песчаный берег (передний план причала) — чтобы машина стояла на земле, а не в реке
const SHORE = (y = 1400, z = 3) => `<div style="position:absolute;left:-60px;top:${y}px;width:1200px;height:${2200 - y}px;z-index:${z};background:linear-gradient(#c8b890,#a89870);border-top:8px solid #151515;border-radius:60% 40% 0 0 / 60px 40px 0 0"></div>`;
// стол детектива с лампой (передний план)
const DESK = (y = 1560, z = 9) => `<div style="position:absolute;left:-20px;top:${y}px;width:1120px;height:600px;z-index:${z};background:#6b4423;border-top:10px solid #151515">
  <div style="position:absolute;left:760px;top:-150px;width:40px;height:150px;background:#2b2f37;border:5px solid #151515"></div><div style="position:absolute;left:700px;top:-210px;width:170px;height:80px;background:#2f8a4a;border:6px solid #151515;border-radius:80px 80px 10px 10px"></div></div>`;
// бот у Ольги
const VSCARD = (id = "vcc") => BOTH("Vesta · до 1 млн", `<div id="${id}">${CARD("Lada Vesta · 2021", "870 000 ₽", "рынок ≈ 970 000 ₽ · 1 владелец", "🔥 −10% к рынку · ⏱ 1 с после публикации")}</div>`);
const CTA70 = `<div style="position:absolute;left:60px;right:60px;top:1330px;z-index:70;background:#ffd23f;border:8px solid #151515;border-radius:34px;padding:26px 30px;box-shadow:0 14px 0 #151515;font-family:Unbounded;font-weight:900;color:#151515;text-align:center">
  <div style="font-size:52px;line-height:1.12">Бот <span style="color:#c0392b">«Перехват»</span><br>— ссылка в шапке</div><div style="margin-top:12px;font-size:30px;font-family:Onest;font-weight:800">объявления по всей России · через ~1 с после публикации</div></div>`;
