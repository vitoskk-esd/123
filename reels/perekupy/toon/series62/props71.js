// ep71 «Эвакуатор: постоянный клиент» (с матом): герои и реквизит (базовые помощники — props.js)
const VIT = { jacket: "#2b2f37", vest: "#ff7a1a", pants: "#2f4f8a", cap: "#ffd23f", hair: "#7a5a3a", mustache: true, skin: "#eaa286", look: "flat" };   // эвакуаторщик Витя (новый герой)
const PASH = { jacket: "#c0392b", pants: "#2c3e66", hair: "#e0c070", look: "o" };                                                                    // покупатель Пашка (новый герой)
const V15 = "vaz2115/vaz2115_c.png", HYC = "hyundai/hyundai_c.png", GEL = "gelik/gelik_side.png";   // Гелик — у дачи Вити (владелец 15.11: «добавь в видео гелик»)
Object.assign(CINE.SIZES, { [V15]: [1305, 375], [HYC]: [1138, 360], [GEL]: [616, 302] });
const TITLE = (a, b) => `<div style="position:absolute;left:0;right:0;top:300px;text-align:center;font-family:Unbounded;font-weight:900;line-height:1;letter-spacing:-3px;z-index:50">
  <span style="display:inline-block;padding:10px 28px 18px;border:8px solid #151515;border-radius:22px;box-shadow:0 12px 0 #151515;font-size:80px;background:#ffd23f;color:#151515;transform:rotate(-3deg)">${a}</span><br>
  <span style="display:inline-block;padding:10px 28px 18px;border:8px solid #151515;border-radius:22px;box-shadow:0 12px 0 #151515;font-size:74px;background:#ff3b30;color:#fff;margin-top:26px;transform:rotate(2deg)">${b}</span></div>`;
// эвакуатор-платформа (кабина справа). Верх платформы — ground − 188·s, платформа от x+20·s до x+640·s; мигалка #<id>b
const TOWTRUCK = (x, ground, w = 900, id = "tt", z = 4) => { const s = w / 900, t = ground - 420 * s;
  return `<div id="${id}" style="position:absolute;left:${x}px;top:${t}px;width:${w}px;height:${420 * s}px;z-index:${z}"><svg viewBox="0 0 900 420" style="overflow:visible">
  <rect x="10" y="232" width="640" height="34" fill="#c8ccd0" stroke="#151515" stroke-width="7"/>${[0, 1, 2, 3, 4, 5, 6].map(k => `<path d="M${40 + k * 88} 236 v26" stroke="#8a8e94" stroke-width="6"/>`).join("")}
  <rect x="40" y="266" width="800" height="70" fill="#2b2f37" stroke="#151515" stroke-width="7"/>
  <path d="M640 330 V120 Q640 90 670 90 H800 Q860 90 880 150 L890 330 Z" fill="#ff7a1a" stroke="#151515" stroke-width="8"/>
  <path d="M690 120 H790 Q830 120 846 170 L852 210 H690 Z" fill="#a8cfe8" stroke="#151515" stroke-width="6"/>
  <rect x="700" y="60" width="90" height="30" rx="8" fill="#2b2f37" stroke="#151515" stroke-width="5"/><g id="${id}b"><path d="M720 60 q25 -40 50 0 z" fill="#ffd23f" stroke="#151515" stroke-width="5"/></g>
  <text x="760" y="290" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="26" fill="#151515">ЭВАКУАТОР 24/7</text>
  ${[160, 380, 760].map(cx => `<circle cx="${cx}" cy="350" r="56" fill="#151515" stroke="#151515" stroke-width="4"/><circle cx="${cx}" cy="350" r="24" fill="#9aa4ae" stroke="#151515" stroke-width="5"/>`).join("")}</svg></div>`; };
// «БАХ!» из глушителя: вспышка и дым (#<id>)
const BANG = (x, y, id = "bang", z = 30) => `<div id="${id}" style="position:absolute;left:${x}px;top:${y}px;width:360px;height:260px;z-index:${z}"><svg viewBox="0 0 360 260" style="overflow:visible">
  ${[[60, 190, 46], [120, 150, 56], [40, 120, 40]].map(([cx, cy, r]) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#9aa4ae" fill-opacity=".85" stroke="#151515" stroke-width="4"/>`).join("")}
  <path d="M230 30 L255 95 L320 70 L280 125 L345 160 L275 165 L290 235 L240 180 L190 230 L200 160 L130 150 L195 120 L160 60 L220 95 Z" fill="#ffd23f" stroke="#151515" stroke-width="7" stroke-linejoin="round"/>
  <text x="245" y="152" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="44" fill="#c0392b" transform="rotate(-8 245 140)">БАХ!</text></svg></div>`;
// рация на торпеде: волны #<id>w
const RADIO = (x, y, id = "rd", z = 26) => `<div id="${id}" style="position:absolute;left:${x}px;top:${y}px;width:170px;height:260px;z-index:${z}"><svg viewBox="0 0 170 260" style="overflow:visible">
  <rect x="100" y="0" width="16" height="70" fill="#151515"/><rect x="20" y="60" width="130" height="190" rx="22" fill="#2b2f37" stroke="#151515" stroke-width="6"/><rect x="40" y="84" width="90" height="50" rx="8" fill="#9ad08a" stroke="#151515" stroke-width="4"/>
  ${[0, 1, 2, 3].map(k => `<path d="M44 ${160 + k * 18} H126" stroke="#151515" stroke-width="6"/>`).join("")}
  <g id="${id}w" stroke="#ffd23f" stroke-width="7" fill="none" stroke-linecap="round"><path d="M128 20 q22 20 0 40"/><path d="M142 6 q36 34 0 68"/></g></svg></div>`;
// приём — счётчик вызовов: наклейка «ЖОРА» с палочками (#<id>m0…m9 — по одной), число #<id>c
const TALLY = (x, y, id = "tl", n = 3, z = 26) => `<div id="${id}" style="position:absolute;left:${x}px;top:${y}px;width:380px;height:190px;z-index:${z};transform:rotate(3deg);background:#fbf6ec;border:6px solid #151515;border-radius:10px;box-shadow:0 8px 0 #151515">
  <div style="position:absolute;left:18px;top:10px;font-family:Unbounded;font-weight:900;font-size:30px;color:#c0392b">ВЫЗОВЫ: ЖОРА</div>
  <svg viewBox="0 0 380 110" style="position:absolute;left:0;top:60px;width:380px;height:110px">${Array.from({ length: 10 }, (_, k) => k % 5 === 4
    ? `<path id="${id}m${k}" d="M${30 + Math.floor(k / 5) * 150} 80 L${120 + Math.floor(k / 5) * 150} 20" stroke="#151515" stroke-width="9" stroke-linecap="round" opacity="${k < n ? 1 : 0}"/>`
    : `<path id="${id}m${k}" d="M${40 + (k % 5) * 22 + Math.floor(k / 5) * 150} 14 V90" stroke="#151515" stroke-width="9" stroke-linecap="round" opacity="${k < n ? 1 : 0}"/>`).join("")}</svg>
  <div id="${id}c" style="position:absolute;right:16px;top:58px;font-family:Unbounded;font-weight:900;font-size:64px;color:#151515">${n}</div></div>`;
// торпеда кабины (передний план): руль перед водителем
const KDASH = (wx = 360, y = 1330, z = 20) => `<div style="position:absolute;left:-20px;top:${y}px;width:1120px;height:${2300 - y}px;z-index:${z};background:#1f2228;border-top:10px solid #151515;border-radius:80px 80px 0 0"></div>
  <div style="position:absolute;left:${wx - 230}px;top:${y - 210}px;width:460px;height:460px;z-index:${z + 1}"><svg viewBox="0 0 460 460"><circle cx="230" cy="230" r="200" fill="none" stroke="#151515" stroke-width="50"/><circle cx="230" cy="230" r="200" fill="none" stroke="#33363d" stroke-width="34"/><path d="M40 250 H420 M230 250 V430" stroke="#33363d" stroke-width="38"/><circle cx="230" cy="250" r="60" fill="#26282e" stroke="#151515" stroke-width="8"/></svg></div>`;
// круг «картинка в картинке» с говорящим (детей — абсолютом: class grp)
const PIP = (inner, id, ring = "#ffd23f", left = 700, top = 1440, bgc = "#2b2f37") => `<div id="${id}" class="grp" style="position:absolute;left:${left}px;top:${top}px;width:320px;height:320px;border-radius:50%;overflow:hidden;border:9px solid ${ring};z-index:45;background:${bgc};box-shadow:0 10px 30px #0008">${inner}</div>`;
// бот у Пашки
const HYCARD = (id = "hcc") => BOTH("Hyundai · до 1,2 млн", `<div id="${id}">${CARD("Hyundai · 2019", "1 090 000 ₽", "рынок ≈ 1 250 000 ₽ · 1 владелец", "🔥 −13% к рынку · ⏱ 1 с после публикации")}</div>`);
const CTA71 = `<div style="position:absolute;left:60px;right:60px;top:1330px;z-index:70;background:#ffd23f;border:8px solid #151515;border-radius:34px;padding:26px 30px;box-shadow:0 14px 0 #151515;font-family:Unbounded;font-weight:900;color:#151515;text-align:center">
  <div style="font-size:52px;line-height:1.12">Бот <span style="color:#c0392b">«Перехват»</span><br>— ссылка в шапке</div><div style="margin-top:12px;font-size:30px;font-family:Onest;font-weight:800">объявления по всей России · через ~1 с после публикации</div></div>`;
