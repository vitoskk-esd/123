// ep81 «Толян · 20: подстава» (сезон «Свой автосалон», без мата): герои и реквизит (базовые помощники — props.js)
// Новый герой: Вадик — племянник Жоры (красная кепка «как у дяди», тонкие усики, спортивная куртка, цепь). Возвращаются: Лёха (видеосвязь), Римма.
// Приёмы: вставка-мышеловка с ключом от Камри вместо сыра (#trap — дуга захлопывается), входящий звонок «ДЯДЯ ЖОРА» на весь экран,
// дубликат ПТС, торчащий из кармана Вадика.
const RIM = html => html.replaceAll("#8e1f3a", "#4a4f63").replaceAll("#5c1426", "#33374a").replaceAll("#2b1a14", "#7a2a1a").replaceAll("#2c3e66", "#2b2f37")
  .replace(/fill="#ff3b30" stroke="#151515" stroke-width="4" transform="rotate\(-20/g, 'fill="#f4f0e8" stroke="#151515" stroke-width="4" transform="rotate(-20');
const LEHA_O = { jacket: "#151515", pants: "#1d1d22", hair: "#e8b48d", chain: true, look: "flat" };
// лысина (убираем причёску) + татуировки: шея, висок, кисти
const LEHA = html => html
  .replace(/<path d="M124 186 q-4 -102 86 -104 q90 2 86 104 q-26 -46 -86 -46 q-60 0 -86 46 z" fill="#e8b48d"[^>]*\/>/g, '<path d="M150 120 q60 -40 120 0" stroke="#f4d0b0" stroke-width="10" fill="none" opacity=".7" stroke-linecap="round"/>')
  .replace(/(<path d="M188 330 h44 v40 h-44 z"[^>]*\/>)/g, '$1<path d="M194 340 q8 10 0 20 M206 336 l6 10 l6 -10 l6 10 M222 344 q6 8 0 18" stroke="#1f2f55" stroke-width="6" fill="none"/>'
    + '<path d="M196 368 l14 -18 l14 18" stroke="#1f2f55" stroke-width="6" fill="none"/>')
  .replace(/(<ellipse cx="298" cy="232" rx="20" ry="28"[^>]*\/>)/g, '$1<path d="M262 120 q22 10 24 40 q-14 -10 -26 -6 q14 14 10 34 q-12 -16 -26 -18" stroke="#1f2f55" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M110 250 q-8 14 2 26" stroke="#1f2f55" stroke-width="5" fill="none"/>')
  .replace(/(<circle cx="106" cy="532" r="17"[^>]*\/>)/g, '$1<path d="M96 524 l10 10 l10 -10 M98 542 h16" stroke="#1f2f55" stroke-width="4" fill="none"/>');
const CNT77 = (money, cars) => `<div id="cnt77" style="position:absolute;left:40px;top:250px;z-index:60;font-family:'JetBrains Mono';font-weight:800;font-size:46px;color:#fff;background:#151515;border:6px solid #4cd964;border-radius:22px;padding:10px 22px;line-height:1.25">
  💰 <span id="cv">${money}</span> ₽<br>🚗 <span id="cc">${cars}</span>/10 <span style="font-size:30px;color:#8b93a3">на площадке</span></div>`;
const SIGN77 = (x = 300, y = 590, z = 3, sc = 1) => `<div style="position:absolute;left:${x}px;top:${y}px;z-index:${z};transform-origin:0 0;scale:${sc};background:#ffd23f;border:8px solid #151515;box-shadow:0 10px 0 #151515;padding:8px 26px 12px;font-family:Unbounded;font-weight:900;font-size:44px;color:#151515;transform:rotate(-2deg);white-space:nowrap">АВТОСАЛОН ТОЛЯНА</div>`;
const SPLIT2 = (lbg, lhtml, rbg, rhtml) => {
  const fix = h => h.replaceAll('style="left:', 'style="position:absolute;left:');
  const half = (x, bg, html) => `<div style="position:absolute;left:${x}px;top:0;width:534px;height:1920px;overflow:hidden"><div style="position:absolute;left:-273px;top:0;width:1080px;height:1920px">${BGS[bg]}${fix(html)}</div></div>`;
  return `<div style="position:absolute;left:0;top:0;width:1080px;height:1920px;z-index:40;background:#fff">${half(0, lbg, lhtml)}${half(546, rbg, rhtml)}
    <div style="position:absolute;left:527px;top:0;width:26px;height:1920px;background:#fff;box-shadow:0 0 30px #000;z-index:5"></div></div>`; };
const PIP = (inner, id, ring = "#ffd23f", left = 700, top = 1440, bgc = "#2b2f37") => `<div id="${id}" class="grp" style="position:absolute;left:${left}px;top:${top}px;width:320px;height:320px;border-radius:50%;overflow:hidden;border:9px solid ${ring};z-index:45;background:${bgc};box-shadow:0 10px 30px #0008">${inner}</div>`;
const PIPS = (inner, p, id, ring, left, top) => { const out = PIP(inner, id, ring, left, top); CINE.ANCH[p] = [left + 160, top + 30, .8]; return out; };
const TITLE = (a, b) => `<div style="position:absolute;left:0;right:0;top:300px;text-align:center;font-family:Unbounded;font-weight:900;line-height:1;letter-spacing:-3px;z-index:50">
  <span style="display:inline-block;padding:10px 28px 18px;border:8px solid #151515;border-radius:22px;box-shadow:0 12px 0 #151515;font-size:82px;background:#ffd23f;color:#151515;transform:rotate(-3deg)">${a}</span><br>
  <span style="display:inline-block;padding:10px 28px 18px;border:8px solid #151515;border-radius:22px;box-shadow:0 12px 0 #151515;font-size:70px;background:#ff3b30;color:#fff;margin-top:26px;transform:rotate(2deg)">${b}</span></div>`;
const VADIK = { jacket: "#2f6db5", pants: "#1d1d22", cap: "#c0392b", mustache: true, chain: true, hair: "#1d1d1f", look: "grin" };
const CAM = "camry/camry_side_c.png", V15 = "vaz2115/vaz2115_c.png", ELA = "hyundai/hyundai_c.png";
Object.assign(CINE.SIZES, { [CAM]: [1302, 395], [V15]: [1305, 375], [ELA]: [1138, 360] });
// приманка: процента нет — бот не ставит скидку, если цена неправдоподобно низкая (больше 55% от рынка)
const CAMCARD = (id = "cmc") => BOTH("Седан · до 900 тыс", `<div id="${id}">${CARD("Toyota Camry · 2018 · «срочно, переезд»", "790 000 ₽", "рынок ≈ 1 950 000 ₽ · твой город", "⏱ 1 с после публикации")}</div>`);
const V15CARD = (id = "v5c") => BOTH("Ниже рынка 15%+", `<div id="${id}">${CARD("ВАЗ-2115 · 2011 · 1 владелец", "150 000 ₽", "рынок ≈ 185 000 ₽ · твой город", "🔥 −19% к рынку · ⏱ 1 с после публикации")}</div>`);
const ELACARD = (id = "elc") => BOTH("Ниже рынка 15%+", `<div id="${id}">${CARD("Hyundai Elantra · 2017 · сервисная книжка", "890 000 ₽", "рынок ≈ 1 050 000 ₽ · твой город", "🔥 −15% к рынку · ⏱ 1 с после публикации")}</div>`);
const TWOCARDS3 = () => `<div style="position:absolute;left:0;top:0;width:1080px;height:1920px;z-index:40;background:radial-gradient(circle at 50% 40%,#3a4a5e,#121722)">
  <div style="position:absolute;left:230px;top:300px;width:620px;height:1320px;border-radius:72px;background:#0d0e12;border:14px solid #2a2d34;box-shadow:0 30px 80px #000c;overflow:hidden">
    <div style="position:absolute;left:0;top:0;width:580px;padding:40px 30px;transform:scale(1.02);transform-origin:0 0">${V15CARD("v5c2")}<div style="height:26px"></div>${ELACARD("elc2")}</div></div></div>`;
// вставка: мышеловка на весь экран, вместо сыра — ключ от «Тойоты» с ценником (#trapbar — дуга, в хуке захлопывается: rotate)
const MOUSETRAP = () => `<div style="position:absolute;left:0;top:0;width:1080px;height:1920px;z-index:40;background:radial-gradient(circle at 50% 55%,#4a3a2e,#16110d)">
  <svg viewBox="0 0 1080 1920" style="position:absolute;inset:0">
    <ellipse cx="540" cy="1500" rx="470" ry="70" fill="#000" opacity=".45"/>
    <path d="M120 1150 L960 1150 L1000 1430 L80 1430 Z" fill="#d9a35e" stroke="#151515" stroke-width="12" stroke-linejoin="round"/>
    <path d="M80 1430 h920 v60 h-920 z" fill="#a8763e" stroke="#151515" stroke-width="12"/>
    ${[260, 420, 640, 820].map(x => `<path d="M${x} 1180 q20 120 -10 240" stroke="#b88446" stroke-width="6" fill="none"/>`).join("")}
    <path d="M300 1300 h480" stroke="#8a8f96" stroke-width="16" stroke-linecap="round"/>
    <circle cx="300" cy="1300" r="34" fill="#c4c8ce" stroke="#151515" stroke-width="8"/><circle cx="780" cy="1300" r="34" fill="#c4c8ce" stroke="#151515" stroke-width="8"/>
    <rect x="470" y="1250" width="190" height="90" rx="10" fill="#c4c8ce" stroke="#151515" stroke-width="8"/>
    <g id="key81">
      <rect x="520" y="1150" width="120" height="150" rx="40" fill="#1d1d1f" stroke="#151515" stroke-width="8"/>
      <ellipse cx="580" cy="1205" rx="34" ry="22" fill="none" stroke="#c4c8ce" stroke-width="7"/><path d="M580 1183 v44 M556 1200 q24 -14 48 0" stroke="#c4c8ce" stroke-width="6" fill="none"/>
      <path d="M570 1300 h20 v110 h-14 v-14 h-10 z" fill="#c4c8ce" stroke="#151515" stroke-width="6"/>
      <path d="M630 1190 q-10 -40 -40 -125" stroke="#151515" stroke-width="5" fill="none"/>
      <g transform="rotate(8 675 1010)"><rect x="560" y="960" width="230" height="100" rx="14" fill="#fff8e1" stroke="#151515" stroke-width="7"/><circle cx="582" cy="1010" r="10" fill="#151515"/>
      <text x="680" y="1028" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="34" fill="#c0392b">790 000</text></g>
    </g>
  </svg>
  <svg id="trapbar" viewBox="0 0 1080 1920" style="position:absolute;inset:0;transform-origin:540px 1300px">
    <path d="M200 1300 L200 760 L880 760 L880 1300" stroke="#c4c8ce" stroke-width="26" fill="none" stroke-linejoin="round"/>
    <path d="M200 1300 L200 760 L880 760 L880 1300" stroke="#151515" stroke-width="8" fill="none" stroke-linejoin="round" transform="translate(0 14)" opacity=".35"/></svg>
  <div style="position:absolute;left:0;right:0;top:330px;text-align:center;font-family:Caveat,cursive;font-weight:700;font-size:96px;color:#ffd23f;transform:rotate(-4deg)">сыр для перекупа</div></div>`;
// входящий звонок на весь экран: «ДЯДЯ ЖОРА» (аватар — Жора в кругу; .char внутри over — position:absolute)
const CALL = avatar => `<div style="position:absolute;left:0;top:0;width:1080px;height:1920px;z-index:40;background:radial-gradient(circle at 50% 40%,#3a2a2a,#120c0c)">
  <div style="position:absolute;left:230px;top:240px;width:620px;height:1400px;border-radius:72px;background:linear-gradient(#2a1d24,#0d0e12);border:14px solid #2a2d34;box-shadow:0 30px 80px #000c;overflow:hidden;font-family:Onest;color:#fff;text-align:center">
    <div style="margin-top:110px;font-size:34px;color:#b9bfca">входящий вызов…</div>
    <div id="callav" style="position:relative;margin:50px auto 0;width:300px;height:300px;border-radius:50%;overflow:hidden;border:8px solid #fff;background:#5a6a7a">${avatar.replaceAll('style="left:', 'style="position:absolute;left:')}</div>
    <div style="margin-top:50px;font-family:Unbounded;font-weight:900;font-size:66px;line-height:1.05">ДЯДЯ<br>ЖОРА</div>
    <div style="margin-top:16px;font-size:30px;color:#b9bfca">мобильный · «ЖОРА МОТОРС»</div>
    <div style="position:absolute;left:0;right:0;bottom:120px;display:flex;justify-content:space-around">
      <div style="width:140px;height:140px;border-radius:50%;background:#ff3b30;font-size:70px;line-height:140px">✕</div><div id="callok" style="width:140px;height:140px;border-radius:50%;background:#4cd964;font-size:70px;line-height:140px">✆</div></div></div></div>`;
// дубликат ПТС из кармана
const DUP = (x, y, id = "dup", z = 14) => `<div id="${id}" style="position:absolute;left:${x}px;top:${y}px;width:150px;height:110px;z-index:${z};transform:rotate(-12deg);background:#cfe3c4;border:6px solid #151515;border-radius:8px;
  font-family:Unbounded;font-weight:900;text-align:center;line-height:1.05;padding-top:12px;box-sizing:border-box"><div style="font-size:30px;color:#151515">ПТС</div><div style="font-size:18px;color:#c0392b">ДУБЛИКАТ</div></div>`;
