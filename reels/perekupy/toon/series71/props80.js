// ep80 «Толян · 19: открытие у Жоры» (сезон «Свой автосалон», без мата): герои и реквизит (базовые помощники — props.js)
// Новая героиня: ведущая открытия Снежана (из «vika»: розовый жакет, светлые волосы). Возвращаются: Римма; дед Егорыч и тракторист Митяй —
// из отдельной серии «Деревня» (ep75: Жора продал деду «Ниву»-«зверя», бампер уехал на тракторе) — отсылка-награда.
const RIM = html => html.replaceAll("#8e1f3a", "#4a4f63").replaceAll("#5c1426", "#33374a").replaceAll("#2b1a14", "#7a2a1a").replaceAll("#2c3e66", "#2b2f37")
  .replace(/fill="#ff3b30" stroke="#151515" stroke-width="4" transform="rotate\(-20/g, 'fill="#f4f0e8" stroke="#151515" stroke-width="4" transform="rotate(-20');
const EGO = { jacket: "#4a5a3a", pants: "#2b2f37", cap: "#5a4a3a", hair: "#e0e0e0", mustache: true, skin: "#eaa286", look: "flat" };   // дед Егорыч (новый герой)
const MIT = { jacket: "#3a3f46", vest: true, pants: "#2f4f8a", cap: "#ff7a1a", hair: "#5a3a1a", look: "flat" };                      // тракторист Митяй (новый герой)
const TRACTOR = (x, ground, w = 620, id = "tr", z = 6) => { const s = w / 620, t = ground - 520 * s;
  return `<div id="${id}" style="position:absolute;left:${x}px;top:${t}px;width:${w}px;height:${520 * s}px;z-index:${z}"><svg viewBox="0 0 620 520" style="overflow:visible">
  <rect x="80" y="200" width="300" height="140" rx="16" fill="#c0392b" stroke="#151515" stroke-width="8"/><rect x="330" y="60" width="210" height="240" rx="14" fill="#c0392b" stroke="#151515" stroke-width="8"/>
  <rect x="352" y="84" width="166" height="120" fill="#a8cfe8" stroke="#151515" stroke-width="6"/><path d="M120 200 V110" stroke="#2b2f37" stroke-width="22"/>
  <circle cx="160" cy="400" r="90" fill="#26282e" stroke="#151515" stroke-width="8"/><circle cx="160" cy="400" r="38" fill="#ffd23f" stroke="#151515" stroke-width="6"/>
  <circle cx="460" cy="380" r="130" fill="#26282e" stroke="#151515" stroke-width="8"/><circle cx="460" cy="380" r="56" fill="#ffd23f" stroke="#151515" stroke-width="6"/>
  <text x="230" y="290" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="34" fill="#fff">МТЗ</text></svg></div>`; };
const TOWROPE = (x1, y1, x2, y2, id = "rp", z = 7) => `<svg id="${id}" style="position:absolute;left:0;top:0;width:1080px;height:1920px;overflow:visible;z-index:${z}" viewBox="0 0 1080 1920"><path d="M${x1} ${y1} Q${(x1 + x2) / 2} ${Math.max(y1, y2) + 40} ${x2} ${y2}" stroke="#151515" stroke-width="12" fill="none"/><path d="M${x1} ${y1} Q${(x1 + x2) / 2} ${Math.max(y1, y2) + 40} ${x2} ${y2}" stroke="#ffd23f" stroke-width="5" stroke-dasharray="18 14" fill="none"/></svg>`;
const NBUMP = (x, y, id = "nb", z = 9) => `<div id="${id}" style="position:absolute;left:${x}px;top:${y}px;width:280px;height:70px;z-index:${z}"><svg viewBox="0 0 280 70"><rect x="8" y="10" width="264" height="44" rx="8" fill="#26282e" stroke="#151515" stroke-width="7"/><rect x="30" y="20" width="40" height="18" fill="#f4f0e8"/><rect x="210" y="20" width="40" height="18" fill="#f4f0e8"/></svg></div>`;
const CNT77 = (money, cars) => `<div id="cnt77" style="position:absolute;left:40px;top:250px;z-index:60;font-family:'JetBrains Mono';font-weight:800;font-size:46px;color:#fff;background:#151515;border:6px solid #4cd964;border-radius:22px;padding:10px 22px;line-height:1.25">
  💰 <span id="cv">${money}</span> ₽<br>🚗 <span id="cc">${cars}</span>/10 <span style="font-size:30px;color:#8b93a3">на площадке</span></div>`;
const SIGN77 = (x = 300, y = 590, z = 3, sc = 1) => `<div style="position:absolute;left:${x}px;top:${y}px;z-index:${z};transform-origin:0 0;scale:${sc};background:#ffd23f;border:8px solid #151515;box-shadow:0 10px 0 #151515;padding:8px 26px 12px;font-family:Unbounded;font-weight:900;font-size:44px;color:#151515;transform:rotate(-2deg);white-space:nowrap">АВТОСАЛОН ТОЛЯНА</div>`;
const PIP = (inner, id, ring = "#ffd23f", left = 700, top = 1440, bgc = "#2b2f37") => `<div id="${id}" class="grp" style="position:absolute;left:${left}px;top:${top}px;width:320px;height:320px;border-radius:50%;overflow:hidden;border:9px solid ${ring};z-index:45;background:${bgc};box-shadow:0 10px 30px #0008">${inner}</div>`;
const PIPS = (inner, p, id, ring, left, top) => { const out = PIP(inner, id, ring, left, top); CINE.ANCH[p] = [left + 160, top + 30, .8]; return out; };
const TITLE = (a, b) => `<div style="position:absolute;left:0;right:0;top:300px;text-align:center;font-family:Unbounded;font-weight:900;line-height:1;letter-spacing:-3px;z-index:50">
  <span style="display:inline-block;padding:10px 28px 18px;border:8px solid #151515;border-radius:22px;box-shadow:0 12px 0 #151515;font-size:82px;background:#ffd23f;color:#151515;transform:rotate(-3deg)">${a}</span><br>
  <span style="display:inline-block;padding:10px 28px 18px;border:8px solid #151515;border-radius:22px;box-shadow:0 12px 0 #151515;font-size:70px;background:#ff3b30;color:#fff;margin-top:26px;transform:rotate(2deg)">${b}</span></div>`;
const SNZ = html => html.replaceAll("#8e1f3a", "#ff6fae").replaceAll("#5c1426", "#d94c8a").replaceAll("#2b1a14", "#f0c860").replaceAll("#2c3e66", "#f4f0e8");
const NIVS = "niva/niva_side_r.png", VES = "vesta/vesta_34.png", LEX = "lexus/lexus_34.png";
Object.assign(CINE.SIZES, { [NIVS]: [675, 287], [VES]: [781, 375], [LEX]: [808, 347] });
const VESCARD = (id = "vsc") => BOTH("Ниже рынка 15%+", `<div id="${id}">${CARD("Lada Vesta · 2019 · 1 владелец", "690 000 ₽", "рынок ≈ 840 000 ₽ · твой город", "🔥 −18% к рынку · ⏱ 1 с после публикации")}</div>`);
const LEXCARD = (id = "lxc") => BOTH("Ниже рынка 15%+", `<div id="${id}">${CARD("Lexus LS 400 · 1996 · «для души»", "420 000 ₽", "рынок ≈ 520 000 ₽ · твой город", "🔥 −19% к рынку · ⏱ 1 с после публикации")}</div>`);
// баннер-растяжка Жоры над дорожкой (#zb2 — разворачивается сверху)
const ZB2 = (id = "zb2", z = 6) => `<div id="${id}" style="position:absolute;left:90px;top:730px;width:900px;height:160px;white-space:nowrap;z-index:${z};transform-origin:50% 0;background:#ffd23f;border:9px solid #151515;
  box-shadow:0 12px 0 #151515;font-family:Unbounded;font-weight:900;color:#151515;text-align:center;line-height:1.05;padding-top:18px;box-sizing:border-box">
  <div style="font-size:44px">ДЕШЕВЛЕ, ЧЕМ У СТУДЕНТА!</div><div style="font-size:44px;color:#c0392b">−10% НА ВСЁ</div></div>`;
// микрофон в руке (рядом с кистью героя: x, y — центр)
const MIC = (x, y, id = "mic", z = 12) => `<div id="${id}" style="position:absolute;left:${x - 30}px;top:${y - 70}px;width:60px;height:150px;z-index:${z}"><svg viewBox="0 0 60 150">
  <circle cx="30" cy="30" r="26" fill="#3a3c42" stroke="#151515" stroke-width="6"/><path d="M14 22 h32 M14 34 h32" stroke="#6a6c72" stroke-width="4"/><rect x="20" y="54" width="20" height="90" rx="8" fill="#1d1d1f" stroke="#151515" stroke-width="5"/></svg></div>`;
// конфетти (#cf — разлетаются: scale/opacity)
const CONFETTI = (id = "cf", z = 35) => { let s = 11; const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
  return `<svg id="${id}" style="position:absolute;left:0;top:0;width:1080px;height:1920px;z-index:${z};pointer-events:none;transform-origin:540px 700px" viewBox="0 0 1080 1920">
  ${Array.from({ length: 90 }, () => `<rect x="${(r() * 1080).toFixed(0)}" y="${(r() * 1300 + 200).toFixed(0)}" width="${(10 + r() * 14).toFixed(0)}" height="${(18 + r() * 16).toFixed(0)}"
    fill="${["#ff3b30", "#ffd23f", "#2f6db5", "#4cd964", "#ff6fae"][Math.floor(r() * 5)]}" transform="rotate(${(r() * 180).toFixed(0)})" transform-origin="center"/>`).join("")}</svg>`; };
// толпа покупателей (силуэты; #crowd — идут через дорогу: x)
const CROWD = (x, foot, n = 7, id = "crowd", z = 8, gap = 92) => `<div id="${id}" style="position:absolute;left:0;top:0;width:1080px;height:1920px;z-index:${z}"><svg viewBox="0 0 1080 1920" style="position:absolute;inset:0;overflow:visible">
  ${Array.from({ length: n }, (_, k) => { const cx = x + k * gap, h = 210 + (k * 37) % 60, c = ["#5a6a8a", "#8a5a6a", "#6a8a5a", "#8a7a5a", "#5a7a8a"][k % 5];
    return `<g><circle cx="${cx}" cy="${foot - h}" r="${h * .13}" fill="${c}" stroke="#151515" stroke-width="5"/><path d="M${cx - h * .17} ${foot - h * .82} q${h * .17} -${h * .1} ${h * .34} 0 l${h * .04} ${h * .5} h-${h * .42} z" fill="${c}" stroke="#151515" stroke-width="5"/>
      <path d="M${cx - h * .08} ${foot - h * .32} v${h * .32} M${cx + h * .08} ${foot - h * .32} v${h * .32}" stroke="#151515" stroke-width="${h * .07}" stroke-linecap="round"/></g>`; }).join("")}</svg></div>`;
// «ХА-ХА-ХА» над толпой
const LAUGH = (x, y, id = "lol", z = 40) => `<div id="${id}" style="position:absolute;left:${x}px;top:${y}px;z-index:${z};font-family:Unbounded;font-weight:900;font-size:72px;color:#ffd23f;-webkit-text-stroke:10px #151515;paint-order:stroke fill;transform:rotate(-8deg)">ХА-ХА-ХА!</div>`;
// телефон крупно: две карточки бота подряд
const TWOCARDS2 = () => `<div style="position:absolute;left:0;top:0;width:1080px;height:1920px;z-index:40;background:radial-gradient(circle at 50% 40%,#3a4a5e,#121722)">
  <div style="position:absolute;left:230px;top:300px;width:620px;height:1320px;border-radius:72px;background:#0d0e12;border:14px solid #2a2d34;box-shadow:0 30px 80px #000c;overflow:hidden">
    <div style="position:absolute;left:0;top:0;width:580px;padding:40px 30px;transform:scale(1.02);transform-origin:0 0">${VESCARD("vsc2")}<div style="height:26px"></div>${LEXCARD("lxc2")}</div></div></div>`;
