// «АРБИТРАЖНИКИ» ep02 «Никита: друзья → +5 000 ₽» — герои и реквизит (базовые помощники — props.js)
// Владелец 16.11: показать людям, как зарабатывают, приводя банкам новых клиентов. Никита прошёл бесплатный урок в ТГ-канале, отправил друзьям
// ссылку, объяснил выгоду (бонус банка новым клиентам + часть своей выплаты), банк заплатил Никите — он поделился. Цифры — пример.
const NIKITA = { jacket: "#2f8f3a", pants: "#2b2f37", hair: "#c9a26a", look: "grin" };
const DIMA = { jacket: "#e0302a", pants: "#1d1d1f", hair: "#2b1a14", cap: "#151515", look: "o" };
const LESHA = { jacket: "#ffb03a", pants: "#2b2f37", hair: "#5a3a1a", glasses: true, look: "grin" };
const KATYA = html => html.replaceAll("#8e1f3a", "#7a4ad8").replaceAll("#5c1426", "#4e2a9a").replaceAll("#2b1a14", "#e0a050");
const N_ = (p, x, foot, h, o = {}, pose = {}, extra = {}) => ch("nikita", p, x, foot, h, { ...o }, pose, extra);   // Никита — свой персонаж по фото владельца (../charsA.js)
const D_ = (p, x, foot, h, o = {}, pose = {}, extra = {}) => ch("perekup", p, x, foot, h, { ...DIMA, ...o }, pose, extra);
const L_ = (p, x, foot, h, o = {}, pose = {}, extra = {}) => ch("perekup", p, x, foot, h, { ...LESHA, ...o }, pose, extra);
const K_ = (p, x, foot, h, pose = {}, extra = {}) => KATYA(ch("vika", p, x, foot, h, null, pose, extra));

// плашка-название (правило владельца: видна с кадра 0, гаснет к ~1,6 с)
const TITLE = (a, b) => `<div style="position:absolute;left:0;right:0;top:300px;text-align:center;font-family:Unbounded;font-weight:900;line-height:1;letter-spacing:-3px;z-index:50">
  <span style="display:inline-block;padding:10px 28px 18px;border:8px solid #151515;border-radius:22px;box-shadow:0 12px 0 #151515;font-size:66px;background:#ffd23f;color:#151515;transform:rotate(-3deg)">${a}</span><br>
  <span style="display:inline-block;padding:10px 28px 18px;border:8px solid #151515;border-radius:22px;box-shadow:0 12px 0 #151515;font-size:80px;background:#ff3b30;color:#fff;margin-top:26px;transform:rotate(2deg)">${b}</span></div>`;

// узел схемы (карточка с иконкой)
const NODE = (x, y, w, icon, t, sub, bg = "#fbfaf3", id = "") => `<div${id ? ` id="${id}"` : ""} style="position:absolute;left:${x}px;top:${y}px;width:${w}px;z-index:40;background:${bg};border:7px solid #151515;border-radius:24px;box-shadow:0 10px 0 #151515;text-align:center;padding:14px 8px;font-family:Unbounded;font-weight:900;color:#151515">
  <div style="font-size:${w * .28}px;line-height:1">${icon}</div><div style="font-size:${w * .13}px;margin-top:6px">${t}</div>${sub ? `<div style="font-family:Onest;font-weight:800;font-size:${w * .1}px;color:#2f8f3a;margin-top:4px">${sub}</div>` : ""}</div>`;
const ARROW = (x, y, w, label, rot = 0, c = "#4cd964", id = "") => `<div${id ? ` id="${id}"` : ""} style="position:absolute;left:${x}px;top:${y}px;width:${w}px;z-index:41;transform:rotate(${rot}deg);text-align:center">
  <div style="font-family:Unbounded;font-weight:900;font-size:30px;color:#fff;-webkit-text-stroke:7px #151515;paint-order:stroke fill">${label}</div>
  <svg viewBox="0 0 200 40" style="width:100%;height:40px;overflow:visible"><path d="M6 20 H170" stroke="#151515" stroke-width="20" stroke-linecap="round"/><path d="M6 20 H170" stroke="${c}" stroke-width="10" stroke-linecap="round"/><path d="M160 2 L196 20 L160 38 Z" fill="${c}" stroke="#151515" stroke-width="6" stroke-linejoin="round"/></svg></div>`;
// схема денег: БАНК → НИКИТА → ДРУЗЬЯ (обложка и объяснение)
const FLOW = (y = 640, k = 1) => NODE(40, y, 250 * k, "🏦", "БАНК", "", "#fbfaf3", "fl0") + ARROW(285, y + 40, 230, "+1 500 ₽", 0, "#4cd964", "fl1")
  + NODE(520, y, 230 * k, "😎", "НИКИТА", "", "#ffd23f", "fl2") + ARROW(745, y + 40, 150, "+500", 0, "#5ac8fa", "fl3") + NODE(880, y, 170 * k, "👥", "ДРУГ", "", "#9fd6ff", "fl4");
// крупная сумма (обложка)
const BIG = (txt, y = 1060, c = "#4cd964", id = "big") => `<div id="${id}" style="position:absolute;left:0;right:0;top:${y}px;text-align:center;z-index:45;font-family:Unbounded;font-weight:900;font-size:150px;letter-spacing:-6px;color:${c};-webkit-text-stroke:16px #151515;paint-order:stroke fill;transform:rotate(-3deg)">${txt}</div>`;

// экран: Телеграм-канал с бесплатным уроком (на ноутбуке/телефоне; внутр. ширина 560). Название канала — ждём от владельца.
const TGPOST = (id = "tg") => `<div id="${id}" style="font-family:Onest;color:#fff">
  <div style="display:flex;align-items:center;gap:16px;background:#17212b;border-radius:22px;padding:14px 16px">
    <img src="../../brand/arbuz_cut.png" style="width:74px;height:74px;border-radius:50%">
    <div><div style="font-weight:800;font-size:30px">Арбитраж на банки</div><div style="font-size:24px;color:#6ab3f3">Телеграм-канал</div></div></div>
  <div style="background:#182533;border-radius:22px;padding:18px 20px;margin-top:14px">
    <div style="font-weight:800;font-size:31px;line-height:1.2">🎁 Бесплатный урок:<br>арбитраж трафика на банки</div>
    <div style="font-size:25px;color:#b9c4cf;margin-top:10px;line-height:1.3">урок 1 · банк платит партнёру за нового клиента</div>
    <div style="margin-top:16px;background:#2b9bf0;border-radius:16px;text-align:center;padding:12px 0;font-weight:800;font-size:28px">▶ Смотреть урок</div></div></div>`;
// ноутбук на столе (экран — любой html шириной 560)
const LAPTOP = (x, y, w, inner, id = "lp", z = 20) => `<div id="${id}" style="position:absolute;left:${x}px;top:${y}px;width:${w}px;z-index:${z}">
  <div style="height:${w * .64}px;background:#0d0e12;border:${w * .02}px solid #2a2d34;border-radius:18px;box-shadow:0 0 90px rgba(120,255,220,.35);overflow:hidden">
    <div style="width:560px;padding:22px 30px;transform:scale(${w / 620});transform-origin:0 0">${inner}</div></div>
  <div style="height:${w * .06}px;margin:0 -${w * .06}px;background:#8a8e94;border:7px solid #151515;border-radius:0 0 14px 14px"></div></div>`;

// групповой чат «ДРУЗЬЯ ⚽» на весь экран (новый приём монтажа): сообщения появляются по одному (#ch0..)
const CHAT = (n = 7, id = "ch") => { const M = [
  ["Никита", "#2f8f3a", "Пацаны, ссылка на карту банка 👇<br><u style='color:#6ab3f3'>ссылка-приглашение</u>", 1],
  ["Никита", "#2f8f3a", "Новым клиентам — бонус от банка.<br>И +500 ₽ от меня каждому 🤝", 1],
  ["Дима", "#e0302a", "Оформил ✅"], ["Катя", "#7a4ad8", "Я тоже ✅ кэшбэк на продукты — топ"], ["Лёша", "#ffb03a", "✅ И покупку сделал"],
  ["Саня", "#2f6db5", "✅"], ["Миша", "#c0392b", "✅ го ещё в футбол"]].slice(0, n);
  return `<div id="${id}" style="position:absolute;left:0;top:0;width:1080px;height:1920px;z-index:30;background:#0e1621;font-family:Onest;color:#fff">
  <div style="height:200px;background:#17212b;display:flex;align-items:center;gap:22px;padding:0 40px;border-bottom:4px solid #0a0f15">
    <div style="width:120px;height:120px;border-radius:50%;background:#3fa34d;display:flex;align-items:center;justify-content:center;font-size:70px">⚽</div>
    <div><div style="font-weight:800;font-size:52px">ДРУЗЬЯ ⚽</div><div style="font-size:34px;color:#6ab3f3">7 участников</div></div></div>
  <div style="padding:30px 40px">${M.map(([w, c, t, me], k) => `<div id="${id}${k}" style="display:flex;justify-content:${me ? "flex-end" : "flex-start"};margin-top:22px">
    <div style="max-width:780px;background:${me ? "#2b5278" : "#182533"};border-radius:30px;padding:18px 26px;font-size:40px;line-height:1.25">
      <div style="font-weight:800;font-size:32px;color:${c}">${w}</div>${t}</div></div>`).join("")}</div></div>`; };

// расчёт (карточка-формула): строки появляются по одной (#mt0..)
const MATH = (y = 560, id = "mt") => `<div id="${id}" style="position:absolute;left:60px;right:60px;top:${y}px;z-index:40;background:#fbfaf3;border:9px solid #151515;border-radius:34px;box-shadow:0 14px 0 #151515;padding:30px 38px;font-family:Unbounded;font-weight:900;color:#151515">
  <div id="${id}0" style="font-size:46px">5 друзей × 1 500 ₽ <span style="color:#2f8f3a">= 7 500 ₽</span></div>
  <div id="${id}1" style="font-size:42px;margin-top:18px;color:#5a5f6a">друзьям 5 × 500 ₽ <span style="color:#c0392b">= −2 500 ₽</span></div>
  <div style="height:7px;background:#151515;margin:20px 0;border-radius:4px"></div>
  <div id="${id}2" style="font-size:64px">Никите: <span style="color:#2f8f3a">5 000 ₽</span></div>
  <div style="font-family:Onest;font-weight:700;font-size:26px;color:#8b93a3;margin-top:10px">цифры — пример; выплаты зависят от банка и продукта</div></div>`;

// уведомление о выплате (на телефоне)
const PAYOUT = (sum = "+7 500 ₽", id = "po") => `<div id="${id}" style="font-family:Onest;color:#fff">
  <div style="font-family:'JetBrains Mono';font-weight:800;font-size:26px;color:#8b93a3">ПАРТНЁРСКИЙ КАБИНЕТ</div>
  <div style="background:#1c1f26;border-radius:22px;padding:18px 22px;margin-top:12px"><div style="font-size:26px;color:#b9bfca">Новых клиентов</div><div style="font-family:Unbounded;font-weight:900;font-size:48px">5</div></div>
  <div style="background:#123a1e;border-radius:22px;padding:18px 22px;margin-top:12px;border:4px solid #4cd964"><div style="font-size:26px;color:#b9f5c4">Выплата партнёру</div><div style="font-family:Unbounded;font-weight:900;font-size:58px;color:#4cd964">${sum}</div></div></div>`;
// кружок видеозвонка (PIP): внутри — герой крупно (html героя), рамка
const PIP = (x, y, r, inner, id = "pip", z = 60) => `<div id="${id}" style="position:absolute;left:${x - r}px;top:${y - r}px;width:${2 * r}px;height:${2 * r}px;z-index:${z};border-radius:50%;overflow:hidden;border:10px solid #fbfaf3;box-shadow:0 0 0 7px #151515,0 16px 40px rgba(0,0,0,.5);background:#f4e6d0">${inner.replaceAll('style="left:', 'style="position:absolute;left:')}</div>`;
// пицца на столе
const PIZZA = (x, y, w = 320, id = "pz", z = 26) => `<div id="${id}" style="position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${w * .5}px;z-index:${z}"><svg viewBox="0 0 320 160" style="overflow:visible">
  <ellipse cx="160" cy="80" rx="156" ry="74" fill="#d8a050" stroke="#151515" stroke-width="7"/><ellipse cx="160" cy="76" rx="130" ry="58" fill="#e0402a"/>
  ${[[110, 60], [190, 50], [150, 95], [230, 85], [90, 95]].map(([a, b]) => `<ellipse cx="${a}" cy="${b}" rx="18" ry="11" fill="#9a1f14" stroke="#151515" stroke-width="3"/>`).join("")}
  ${[[130, 40], [210, 100], [70, 70]].map(([a, b]) => `<ellipse cx="${a}" cy="${b}" rx="14" ry="8" fill="#ffe27a"/>`).join("")}</svg></div>`;
// финальная карточка (последний кадр — только она)
const CTAA = `<div style="position:absolute;left:60px;right:60px;top:1260px;z-index:70;background:#ffd23f;border:8px solid #151515;border-radius:34px;padding:26px 30px;box-shadow:0 14px 0 #151515;font-family:Unbounded;font-weight:900;color:#151515;text-align:center">
  <div style="font-size:48px;line-height:1.12">Бесплатный урок<br><span style="color:#c0392b">по арбитражу на банки</span></div>
  <div style="margin-top:12px;font-size:32px;font-family:Onest;font-weight:800">Телеграм-канал · ссылка в шапке</div></div>`;
// стол пиццерии (передний план; герои — за ним): столешница + ножки; верх столешницы — y
const TABLE = (x, y, w = 760, z = 24) => `<div style="position:absolute;left:${x}px;top:${y}px;width:${w}px;height:420px;z-index:${z}"><svg viewBox="0 0 ${w} 420" style="overflow:visible">
  <rect x="0" y="0" width="${w}" height="46" rx="10" fill="#b8763a" stroke="#151515" stroke-width="8"/><rect x="0" y="40" width="${w}" height="26" fill="#8a5428" stroke="#151515" stroke-width="7"/>
  <path d="M60 66 V420 M${w - 60} 66 V420" stroke="#151515" stroke-width="22"/><path d="M60 66 V420 M${w - 60} 66 V420" stroke="#5a3418" stroke-width="12"/>
  <rect x="${w * .62}" y="-70" width="44" height="74" rx="8" fill="#ffd23f" stroke="#151515" stroke-width="6"/><rect x="${w * .74}" y="-58" width="40" height="62" rx="8" fill="#e8e4f0" stroke="#151515" stroke-width="6"/></svg></div>`;
// финал v2 (владелец 16.11: «замени кадр в конце… чтобы отличался от версии перекупов»): экран в стиле Телеграма —
// голубой градиент с бумажными самолётиками, крупно «БЕСПЛАТНЫЙ УРОК», телефон со страницей канала и кнопкой «Смотреть урок» (палец жмёт),
// плашка «ссылка — в шапке профиля» со стрелкой; Никита сбоку показывает на телефон. Без Арбузова.
const PLANE = (x, y, s = 1, r = 0, o = .18) => `<svg viewBox="0 0 100 100" style="position:absolute;left:${x}px;top:${y}px;width:${100 * s}px;opacity:${o};transform:rotate(${r}deg)"><path d="M6 46 L94 10 L70 90 L48 62 Z M48 62 L94 10 L36 56 Z" fill="#fff"/></svg>`;
const ENDTG = (id = "etg") => `<div id="${id}" style="position:absolute;left:0;top:0;width:1080px;height:1920px;z-index:65;background:linear-gradient(165deg,#36b6f0 0%,#1f86d6 55%,#1563b0 100%);overflow:hidden">
  ${[[60, 140, 1.6, -12], [820, 90, 1.2, 18], [900, 760, 2, -20], [40, 980, 1.3, 25], [760, 1560, 1.7, -8], [120, 1660, 1.1, 14], [480, 60, .9, 30]].map(a => PLANE(...a)).join("")}
  <div id="${id}t" style="position:absolute;left:0;right:0;top:170px;text-align:center;font-family:Unbounded;font-weight:900;color:#fff;letter-spacing:-2px">
    <div style="font-size:88px;line-height:1;text-shadow:0 8px 0 rgba(0,0,0,.25)">БЕСПЛАТНЫЙ<br>УРОК</div>
    <div style="display:inline-block;margin-top:24px;font-size:44px;background:#ffd23f;color:#151515;padding:8px 26px;border-radius:18px;border:6px solid #151515;transform:rotate(-2deg)">по арбитражу на банки</div></div>
  <div id="${id}p" style="position:absolute;left:330px;top:600px;width:580px;height:900px;background:#0e1621;border:16px solid #151515;border-radius:70px;box-shadow:0 30px 60px rgba(0,0,0,.35);overflow:hidden;font-family:Onest;color:#fff">
    <div style="height:150px;background:#17212b;display:flex;align-items:center;gap:18px;padding:0 28px">
      <div style="width:96px;height:96px;border-radius:50%;background:#2aabee;display:flex;align-items:center;justify-content:center;font-size:52px">🏦</div>
      <div><div style="font-weight:800;font-size:36px">Арбитраж на банки</div><div style="font-size:26px;color:#6ab3f3">канал · Telegram</div></div></div>
    <div style="margin:26px 24px 0;background:#182533;border-radius:28px;padding:24px 26px">
      <div style="font-size:24px;color:#6ab3f3;font-weight:700">📌 Закреплено</div>
      <div style="font-weight:800;font-size:38px;line-height:1.2;margin-top:8px">🎁 Бесплатный урок:<br>как банки платят<br>за новых клиентов</div>
      <div style="font-size:27px;color:#b9c4cf;margin-top:12px;line-height:1.3">оффер · ссылка · первая выплата</div></div>
    <div id="${id}b" style="position:absolute;left:24px;right:24px;bottom:60px;background:#2aabee;border-radius:26px;text-align:center;padding:28px 0;font-weight:900;font-size:40px;font-family:Unbounded">▶ СМОТРЕТЬ УРОК</div>
    <svg id="${id}f" viewBox="0 0 120 160" style="position:absolute;left:4px;bottom:-34px;width:150px;overflow:visible"><path d="M40 20 q0 -20 18 -20 q18 0 18 20 v50 q30 -6 34 20 l6 60 h-90 l-14 -50 q-6 -20 12 -24 l16 4 z" fill="#f3cdb0" stroke="#151515" stroke-width="7" stroke-linejoin="round"/></svg></div>
  <div id="${id}l" style="position:absolute;left:360px;right:40px;top:1570px;text-align:center;background:#fbfaf3;border:8px solid #151515;border-radius:40px;box-shadow:0 12px 0 #151515;padding:22px 0;font-family:Unbounded;font-weight:900;font-size:40px;line-height:1.2;color:#151515">
    <span id="${id}a" style="display:inline-block;color:#1f86d6">↑</span> Ссылка — в шапке профиля</div></div>`;
// Никита на финале (поверх ENDTG): внизу слева, правая рука показывает на телефон
const ENDNIK = (p = "nz") => `<div style="position:absolute;left:0;top:0;width:1080px;height:1920px;z-index:66;pointer-events:none">${N_(p, 190, 1990, 760, {}, { armR: -135 }, { rim: "#9fd6ff", side: 1, z: 66 }).replaceAll('style="left:', 'style="position:absolute;left:')}</div>`;
