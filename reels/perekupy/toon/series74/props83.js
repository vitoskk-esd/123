// ep83 «Толян · 22: Жора на паузе» (сезон «Свой автосалон», без мата): герои и реквизит (базовые помощники — props.js)
// Новая героиня: мама Жоры Галина Петровна (из «vika»: розовый халат в горошек, седые волосы, бигуди). Жора дома — без кепки, в застиранной футболке.
// Приёмы: экран игры на весь кадр (своя пародия «ПЕРЕКУП-СИТИ», не копия чужой игры: закат, пальмы, неон; полосы развёртки и блик стекла),
// меню паузы поверх игры, штамп «ПРОДАНО» на карточке бота, приставка (белые изогнутые панели, чёрный корпус, синяя подсветка) и геймпад — без логотипов.
const RIM = html => html.replaceAll("#8e1f3a", "#4a4f63").replaceAll("#5c1426", "#33374a").replaceAll("#2b1a14", "#7a2a1a").replaceAll("#2c3e66", "#2b2f37")
  .replace(/fill="#ff3b30" stroke="#151515" stroke-width="4" transform="rotate\(-20/g, 'fill="#f4f0e8" stroke="#151515" stroke-width="4" transform="rotate(-20');
const CNT77 = (money, cars) => `<div id="cnt77" style="position:absolute;left:40px;top:250px;z-index:60;font-family:'JetBrains Mono';font-weight:800;font-size:46px;color:#fff;background:#151515;border:6px solid #4cd964;border-radius:22px;padding:10px 22px;line-height:1.25">
  💰 <span id="cv">${money}</span> ₽<br>🚗 <span id="cc">${cars}</span>/10 <span style="font-size:30px;color:#8b93a3">на площадке</span></div>`;
const SIGN77 = (x = 300, y = 590, z = 3, sc = 1) => `<div style="position:absolute;left:${x}px;top:${y}px;z-index:${z};transform-origin:0 0;scale:${sc};background:#ffd23f;border:8px solid #151515;box-shadow:0 10px 0 #151515;padding:8px 26px 12px;font-family:Unbounded;font-weight:900;font-size:44px;color:#151515;transform:rotate(-2deg);white-space:nowrap">АВТОСАЛОН ТОЛЯНА</div>`;
const PIP = (inner, id, ring = "#ffd23f", left = 700, top = 1440, bgc = "#2b2f37") => `<div id="${id}" class="grp" style="position:absolute;left:${left}px;top:${top}px;width:320px;height:320px;border-radius:50%;overflow:hidden;border:9px solid ${ring};z-index:45;background:${bgc};box-shadow:0 10px 30px #0008">${inner}</div>`;
const PIPS = (inner, p, id, ring, left, top) => { const out = PIP(inner, id, ring, left, top); CINE.ANCH[p] = [left + 160, top + 30, .8]; return out; };
const TITLE = (a, b) => `<div style="position:absolute;left:0;right:0;top:300px;text-align:center;font-family:Unbounded;font-weight:900;line-height:1;letter-spacing:-3px;z-index:50">
  <span style="display:inline-block;padding:10px 28px 18px;border:8px solid #151515;border-radius:22px;box-shadow:0 12px 0 #151515;font-size:82px;background:#ffd23f;color:#151515;transform:rotate(-3deg)">${a}</span><br>
  <span style="display:inline-block;padding:10px 28px 18px;border:8px solid #151515;border-radius:22px;box-shadow:0 12px 0 #151515;font-size:70px;background:#ff3b30;color:#fff;margin-top:26px;transform:rotate(2deg)">${b}</span></div>`;
const STAMP = (text, color, x, y, id, rot = -8) => `<div id="${id}" style="position:absolute;left:${x}px;top:${y}px;z-index:30;transform:rotate(${rot}deg);padding:10px 26px;border:9px solid ${color};border-radius:18px;
  font-family:Unbounded;font-weight:900;font-size:58px;color:${color};background:#ffffffd0;white-space:nowrap">${text}</div>`;
const MAMA = html => html.replaceAll("#8e1f3a", "#e07aa0").replaceAll("#5c1426", "#c25a82").replaceAll("#2b1a14", "#c8c8cc").replaceAll("#2c3e66", "#e07aa0");
const ZHOME = { ...ZHORA, cap: null, jacket: "#7d8fa6", hair: "#1d1d1f" };
// бигуди на голове мамы (x, y — макушка)
const CURLERS = (x, y, s = 1, id = "cur", z = 12) => `<svg id="${id}" style="position:absolute;left:${x - 110 * s}px;top:${y - 30 * s}px;width:${220 * s}px;height:${90 * s}px;z-index:${z};overflow:visible" viewBox="0 0 220 90">
  ${[[30, 50], [75, 26], [120, 18], [165, 28], [200, 54]].map(([cx, cy], k) => `<rect x="${cx - 20}" y="${cy - 14}" width="40" height="28" rx="12" fill="${["#5ab0ff", "#ffd23f", "#ff6fae", "#4cd964", "#5ab0ff"][k]}" stroke="#151515" stroke-width="5"/>`).join("")}</svg>`;
const CAM2 = "camry/camry.png";
const CAMCARD2 = (id = "c2c") => BOTH("Камри · до 1,2 млн", `<div id="${id}">${CARD("Toyota Camry · 2015 · 1 владелец", "1 050 000 ₽", "рынок ≈ 1 250 000 ₽ · твой город", "🔥 −16% к рынку · ⏱ 1 с после публикации")}</div>`);
// пародийная игра на экране (своя, не копия): закат, полосатое солнце, океан, пальмы, неоновый город, название рукописным неоном
const GAME = (w, h, id = "gm") => `<div id="${id}" style="position:absolute;left:0;top:0;width:${w}px;height:${h}px;overflow:hidden;background:linear-gradient(#2a1a5a 0%,#c23a8a 45%,#ff8a4a 70%,#ffd27a 82%)">
  <svg viewBox="0 0 1000 560" preserveAspectRatio="xMidYMid slice" style="position:absolute;inset:0;width:100%;height:100%">
    <defs><linearGradient id="${id}sun" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe46a"/><stop offset="1" stop-color="#ff4a7a"/></linearGradient></defs>
    <circle cx="500" cy="330" r="150" fill="url(#${id}sun)"/>${[0, 1, 2, 3, 4].map(k => `<rect x="340" y="${300 + k * 24}" width="320" height="${4 + k * 2}" fill="#c23a8a"/>`).join("")}
    ${[[40, 70, 160], [120, 50, 210], [190, 80, 140], [700, 60, 190], [770, 90, 240], [860, 70, 170], [930, 60, 120]].map(([x, wd, hh]) => `<rect x="${x}" y="${400 - hh}" width="${wd}" height="${hh}" fill="#2a1a4a"/>${Array.from({ length: Math.floor(hh / 26) }, (_, j) => `<rect x="${x + 10}" y="${400 - hh + 10 + j * 26}" width="${wd - 20}" height="6" fill="${j % 2 ? "#ff4fd8" : "#4ff0ff"}" opacity=".8"/>`).join("")}`).join("")}
    <rect y="400" width="1000" height="160" fill="#2a2a7a"/>${[0, 1, 2, 3, 4, 5].map(k => `<path d="M${120 + k * 140} ${430 + (k % 3) * 30} h${60 + (k % 2) * 40}" stroke="#ff9ad0" stroke-width="5" opacity=".7"/>`).join("")}
    ${[[90, 1], [930, -1]].map(([x, f]) => `<g transform="translate(${x} 560) scale(${f} 1)"><path d="M0 0 q20 -160 10 -300" stroke="#1a0f2a" stroke-width="22" fill="none"/>
      ${[-70, -30, 10, 50, 90].map(a => `<path d="M10 -300 q${60 * Math.cos(a / 57)} ${-20 + 40 * Math.sin(a / 57)} ${120 * Math.cos(a / 57)} ${30 + 60 * Math.sin(a / 57)}" stroke="#1a0f2a" stroke-width="18" fill="none" stroke-linecap="round"/>`).join("")}</g>`).join("")}
  </svg>
  <div style="position:absolute;left:0;right:0;top:${h * .12}px;text-align:center;font-family:Caveat,cursive;font-weight:700;font-size:${h * .25}px;line-height:1;color:#fff0fb;text-shadow:0 0 ${h * .02}px #ff4fd8,0 0 ${h * .05}px #ff4fd8,0 0 ${h * .09}px #c23a8a;transform:rotate(-6deg)">Перекуп</div>
  <div style="position:absolute;left:0;right:0;top:${h * .40}px;text-align:center;font-family:Unbounded;font-weight:900;font-size:${h * .13}px;letter-spacing:${h * .02}px;color:#4ff0ff;text-shadow:0 0 ${h * .03}px #4ff0ff,0 ${h * .012}px 0 #1a0f2a">СИТИ</div>
  <div id="${id}k" style="position:absolute;left:0;right:0;bottom:${h * .06}px;text-align:center;font-family:Onest;font-weight:800;font-size:${h * .055}px;color:#fff;letter-spacing:2px;text-shadow:0 2px 6px #000">НАЖМИТЕ ЛЮБУЮ КНОПКУ</div>
  <div style="position:absolute;inset:0;background:repeating-linear-gradient(0deg,rgba(0,0,0,.12) 0 2px,transparent 2px 5px)"></div>
  <div style="position:absolute;left:-20%;top:-40%;width:70%;height:120%;background:linear-gradient(115deg,rgba(255,255,255,.18),rgba(255,255,255,0) 60%);transform:rotate(8deg)"></div></div>`;
// меню паузы поверх игры (#pz)
const PAUSE = (w, h, id = "pz") => `<div id="${id}" style="position:absolute;left:0;top:0;width:${w}px;height:${h}px;background:#0a0618b8;font-family:Unbounded;font-weight:900;color:#fff;text-align:center;padding-top:${h * .18}px;box-sizing:border-box">
  <div style="font-size:${h * .14}px;color:#ff4fd8;text-shadow:0 0 ${h * .03}px #ff4fd8">ПАУЗА</div>
  ${["Продолжить", "Мой автосалон: 100 машин", "Выйти в реальность"].map((t, k) => `<div style="margin-top:${h * .04}px;font-size:${h * .06}px;color:${k === 2 ? "#ffd23f" : "#fff"}">${k === 2 ? "▶ " : ""}${t}</div>`).join("")}</div>`;
// телевизор на тумбе (x, y — левый верх экрана; w — ширина экрана)
const TV = (x, y, w, inner, id = "tv", z = 4) => { const h = w * .5625;
  return `<div id="${id}" style="position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px;z-index:${z};border:${w * .02}px solid #0d0d10;border-radius:${w * .012}px;background:#000;box-shadow:0 0 ${w * .08}px rgba(255,90,180,.35)">
    <div style="position:absolute;inset:0;overflow:hidden">${inner}</div></div>
    <div style="position:absolute;left:${x + w * .42}px;top:${y + h + w * .02}px;width:${w * .16}px;height:${w * .05}px;z-index:${z};background:#1d1d22;border:4px solid #000"></div>`; };
const TUMBA = (x, y, w, h, id = "tb", z = 3) => `<div id="${id}" style="position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px;z-index:${z};background:#5a3a22;border:7px solid #000;box-sizing:border-box">
  <div style="position:absolute;left:4%;right:52%;top:18%;bottom:12%;border:5px solid #3a2414"></div><div style="position:absolute;left:52%;right:4%;top:18%;bottom:12%;border:5px solid #3a2414"></div></div>`;
// приставка вертикально (x — левый край, foot — низ подставки, s — масштаб: высота ≈ 400·s): белые изогнутые панели, чёрный корпус, синяя подсветка
const PS5 = (x, foot, s = 1, id = "ps5", z = 5) => `<svg id="${id}" style="position:absolute;left:${x}px;top:${foot - 420 * s}px;width:${170 * s}px;height:${420 * s}px;z-index:${z};overflow:visible" viewBox="0 0 170 420">
  <defs><linearGradient id="${id}w" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffffff"/><stop offset=".6" stop-color="#f1f2f5"/><stop offset="1" stop-color="#d3d6dc"/></linearGradient>
    <linearGradient id="${id}b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a2c33"/><stop offset=".5" stop-color="#0d0e12"/><stop offset="1" stop-color="#22242a"/></linearGradient></defs>
  <ellipse cx="88" cy="414" rx="70" ry="8" fill="#000" opacity=".35"/>
  <rect x="40" y="396" width="96" height="16" rx="6" fill="#16171b" stroke="#000" stroke-width="4"/>
  <path d="M54 22 h64 v374 h-64 z" fill="url(#${id}b)" stroke="#000" stroke-width="5"/>
  ${Array.from({ length: 9 }, (_, k) => `<path d="M60 ${34 + k * 7} h52" stroke="#3c3f48" stroke-width="3"/>`).join("")}
  <path d="M60 140 h52" stroke="#3a3d45" stroke-width="3"/><path d="M62 150 v100" stroke="#1d1f25" stroke-width="5"/>
  <rect x="66" y="300" width="18" height="10" rx="2" fill="#2b2e36" stroke="#5a5e68" stroke-width="2"/><rect x="92" y="300" width="12" height="9" rx="4" fill="#2b2e36" stroke="#5a5e68" stroke-width="2"/>
  <path d="M30 8 q-14 140 -6 286 q4 70 22 102 h12 v-382 q-14 -14 -28 -6 z" fill="url(#${id}w)" stroke="#000" stroke-width="5" stroke-linejoin="round"/>
  <path d="M140 8 q14 140 6 286 q-4 70 -22 102 h-12 v-382 q14 -14 28 -6 z" fill="url(#${id}w)" stroke="#000" stroke-width="5" stroke-linejoin="round"/>
  <path d="M34 30 q-8 130 -2 250" stroke="#ffffff" stroke-width="5" fill="none" opacity=".9"/><path d="M132 40 q6 120 2 240" stroke="#c4c8cf" stroke-width="4" fill="none"/>
  <g id="${id}led"><path d="M58 26 v368" stroke="#4aa8ff" stroke-width="5"/><path d="M114 26 v368" stroke="#4aa8ff" stroke-width="5"/>
    <path d="M58 26 v368 M114 26 v368" stroke="#7cc4ff" stroke-width="14" opacity=".35"/></g>
  <path d="M42 120 h4 M42 200 h4" stroke="#b9bdc4" stroke-width="3"/>
  <circle cx="86" cy="276" r="4" fill="#4aa8ff"/></svg>`;
// геймпад в руках (x, y — центр)
const PAD = (x, y, s = 1, id = "pad", z = 14, rot = 0) => `<svg id="${id}" style="position:absolute;left:${x - 110 * s}px;top:${y - 70 * s}px;width:${220 * s}px;height:${140 * s}px;z-index:${z};overflow:visible;transform:rotate(${rot}deg)" viewBox="0 0 220 140">
  <path d="M40 30 q70 -26 140 0 q30 10 34 60 q4 44 -26 46 q-18 2 -34 -30 h-96 q-16 32 -34 30 q-30 -2 -26 -46 q4 -50 42 -60 z" fill="#f4f5f8" stroke="#000" stroke-width="6" stroke-linejoin="round"/>
  <path d="M60 40 q50 -14 100 0 l-8 52 h-84 z" fill="#16171b" stroke="#000" stroke-width="4"/>
  <rect x="80" y="30" width="60" height="30" rx="8" fill="#e8e9ee" stroke="#000" stroke-width="4"/><path d="M80 32 q30 -6 60 0" stroke="#4aa8ff" stroke-width="5" fill="none"/>
  <circle cx="84" cy="82" r="11" fill="#2b2c31" stroke="#000" stroke-width="3"/><circle cx="136" cy="82" r="11" fill="#2b2c31" stroke="#000" stroke-width="3"/>
  <path d="M42 64 h18 M51 55 v18" stroke="#2b2c31" stroke-width="7" stroke-linecap="round"/>
  ${[[170, 54], [182, 66], [170, 78], [158, 66]].map(([cx, cy]) => `<circle cx="${cx}" cy="${cy}" r="6" fill="none" stroke="#2b2c31" stroke-width="3.5"/>`).join("")}</svg>`;
// диван: спинка (под героем) и передняя подушка (поверх ног героя)
const SOFA_B = (x, y, w, id = "sfb", z = 6) => `<div id="${id}" style="position:absolute;left:${x}px;top:${y}px;width:${w}px;height:420px;z-index:${z};background:#6a7a4a;border:8px solid #000;border-radius:60px 60px 0 0;box-sizing:border-box">
  <div style="position:absolute;left:6%;right:52%;top:12%;height:60%;border-radius:40px;background:#7a8a5a;border:5px solid #4a5a2a"></div><div style="position:absolute;left:52%;right:6%;top:12%;height:60%;border-radius:40px;background:#7a8a5a;border:5px solid #4a5a2a"></div></div>`;
const SOFA_F = (x, y, w, id = "sff", z = 20) => `<div id="${id}" style="position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${1920 - y + 40}px;z-index:${z}">
  <div style="position:absolute;left:0;right:0;top:0;height:200px;background:#7a8a5a;border:8px solid #000;border-radius:40px;box-sizing:border-box"></div>
  <div style="position:absolute;left:-40px;top:-140px;width:120px;height:340px;background:#5a6a3a;border:8px solid #000;border-radius:50px;box-sizing:border-box"></div>
  <div style="position:absolute;right:-40px;top:-140px;width:120px;height:340px;background:#5a6a3a;border:8px solid #000;border-radius:50px;box-sizing:border-box"></div>
  <div style="position:absolute;left:0;right:0;top:190px;bottom:0;background:#4a5a2a;border:8px solid #000;box-sizing:border-box"></div></div>`;
// журнальный столик: банки энергетика и коробка пиццы
const SNACKS = (x, y, id = "snk", z = 22) => `<svg id="${id}" style="position:absolute;left:${x}px;top:${y}px;width:420px;height:240px;z-index:${z};overflow:visible" viewBox="0 0 420 240">
  <rect x="0" y="120" width="420" height="34" rx="6" fill="#8a5a3a" stroke="#000" stroke-width="6"/><path d="M30 154 v86 M390 154 v86" stroke="#5a3a22" stroke-width="16"/>
  <path d="M200 120 l20 -40 h170 l20 40 z" fill="#d8b07a" stroke="#000" stroke-width="5"/><path d="M230 90 l60 20 M300 86 l50 30" stroke="#c0392b" stroke-width="10" stroke-linecap="round"/>
  ${[30, 80, 130].map((cx, k) => `<g transform="rotate(${k === 1 ? 70 : 0} ${cx} 100)"><rect x="${cx - 18}" y="44" width="36" height="76" rx="8" fill="${k === 1 ? "#4cd964" : "#151515"}" stroke="#000" stroke-width="5"/><path d="M${cx - 18} 70 h36" stroke="#4cd964" stroke-width="7"/></g>`).join("")}</svg>`;
// бутылка кваса в подарок
const KVAS = (x, y, s = 1, id = "kv", z = 14) => `<svg id="${id}" style="position:absolute;left:${x}px;top:${y}px;width:${70 * s}px;height:${190 * s}px;z-index:${z}" viewBox="0 0 70 190">
  <rect x="24" y="0" width="22" height="18" fill="#c0392b" stroke="#000" stroke-width="4"/><path d="M24 18 h22 v20 q20 14 20 40 v100 q0 10 -10 10 h-42 q-10 0 -10 -10 v-100 q0 -26 20 -40 z" fill="#6a3a12" stroke="#000" stroke-width="5"/>
  <rect x="8" y="90" width="54" height="50" fill="#ffd23f" stroke="#000" stroke-width="4"/><text x="35" y="122" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="15" fill="#151515">КВАС</text></svg>`;
// телефон крупно с карточкой бота и штампом «ПРОДАНО» (#sold)
const PHONEBIG = (inner, stamp = true) => `<div style="position:absolute;left:0;top:0;width:1080px;height:1920px;z-index:40;background:radial-gradient(circle at 50% 40%,#3a4a5e,#121722)">
  <div style="position:absolute;left:230px;top:360px;width:620px;height:1200px;border-radius:72px;background:#0d0e12;border:14px solid #2a2d34;box-shadow:0 30px 80px #000c;overflow:hidden">
    <div style="position:absolute;left:0;top:0;width:580px;padding:60px 30px;transform:scale(1.02);transform-origin:0 0">${inner}</div></div>
  ${stamp ? `<div id="sold" style="position:absolute;left:250px;top:880px;z-index:45;transform:rotate(-14deg);padding:16px 34px;border:12px solid #d0302a;border-radius:24px;font-family:Unbounded;font-weight:900;font-size:92px;color:#d0302a;background:#ffffffe0;white-space:nowrap;line-height:1">ПРОДАНО<div style="font-size:40px;text-align:center;margin-top:8px">через 3 минуты</div></div>` : ""}</div>`;
// экран игры на весь кадр (телевизор крупно)
const GAMEFULL = (pause = false) => `<div style="position:absolute;left:0;top:0;width:1080px;height:1920px;z-index:40;background:#0d0d10">
  <div style="position:absolute;left:-180px;top:560px;width:1440px;height:810px;border:24px solid #0d0d10;border-radius:16px;overflow:hidden;box-shadow:0 0 120px rgba(255,90,180,.45)">${GAME(1440, 810, "gmf")}${pause ? PAUSE(1440, 810, "pzf") : ""}</div>
  <div style="position:absolute;left:0;right:0;top:300px;text-align:center;font-family:Onest;font-weight:800;font-size:44px;color:#b9bfca">третий день у Жоры на экране:</div></div>`;
