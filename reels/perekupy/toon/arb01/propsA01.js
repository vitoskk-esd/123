// «АРБИТРАЖНИКИ» ep01 «Инфоцыган: курс за 150 000» — герои и реквизит (базовые помощники — props.js)
// Новая тема (владелец 16.11): арбитраж трафика на банки; продукт — Телеграм-канал с бесплатным уроком. Рассказчик — Арбузов (за кадром).
const STAS = { jacket: "#2f6db5", pants: "#2b2f37", hair: "#2b1a14", look: "grin" };                                   // Стас — новичок в арбитраже
const GURU = { jacket: "#f4f1ea", pants: "#f4f1ea", hair: "#151515", tie: "#c0392b", chain: true, glasses: true, look: "grin" }; // гуру Аркадий
const GALYA = { coat: "#7a4a8a", jacket: "#7a4a8a", pants: "#4a3a5a", hair: "#d9d9d9", scarf: "#e0302a", look: "o" };   // баба Галя (деревня)
const GLK = "gelik/gelik_side.png";
Object.assign(CINE.SIZES, { [GLK]: [616, 302] });
const S_ = (p, x, foot, h, o = {}, pose = {}, extra = {}) => ch("perekup", p, x, foot, h, { ...STAS, ...o }, pose, extra);
const G_ = (p, x, foot, h, o = {}, pose = {}, extra = {}) => ch("perekup", p, x, foot, h, { ...GURU, ...o }, pose, extra);
const B_ = (p, x, foot, h, o = {}, pose = {}, extra = {}) => ch("perekup", p, x, foot, h, { ...GALYA, ...o }, pose, extra);

// обложка: жёлтая рубрика + красная плашка (как во всех сериях)
const TITLE = (a, b) => `<div style="position:absolute;left:0;right:0;top:300px;text-align:center;font-family:Unbounded;font-weight:900;line-height:1;letter-spacing:-3px;z-index:50">
  <span style="display:inline-block;padding:10px 28px 18px;border:8px solid #151515;border-radius:22px;box-shadow:0 12px 0 #151515;font-size:66px;background:#ffd23f;color:#151515;transform:rotate(-3deg)">${a}</span><br>
  <span style="display:inline-block;padding:10px 28px 18px;border:8px solid #151515;border-radius:22px;box-shadow:0 12px 0 #151515;font-size:80px;background:#ff3b30;color:#fff;margin-top:26px;transform:rotate(2deg)">${b}</span></div>`;

// экран телефона: Телеграм-канал с бесплатным уроком (внутренние координаты 560 px). Название канала — ждём от владельца (не выдумываем).
const TGPOST = (id = "tg") => `<div id="${id}" style="font-family:Onest;color:#fff">
  <div style="display:flex;align-items:center;gap:16px;background:#17212b;border-radius:22px;padding:14px 16px">
    <img src="../../brand/arbuz_cut.png" style="width:74px;height:74px;border-radius:50%">
    <div><div style="font-weight:800;font-size:30px">Арбитраж на банки</div><div style="font-size:24px;color:#6ab3f3">Телеграм-канал</div></div></div>
  <div style="background:#182533;border-radius:22px;padding:18px 20px;margin-top:14px">
    <div style="font-weight:800;font-size:31px;line-height:1.2">🎁 Бесплатный урок:<br>арбитраж трафика на банки</div>
    <div style="font-size:25px;color:#b9c4cf;margin-top:10px;line-height:1.3">какой оффер выбрать · кому показывать рекламу · первая выплата</div>
    <div style="margin-top:16px;background:#2b9bf0;border-radius:16px;text-align:center;padding:12px 0;font-weight:800;font-size:28px">▶ Смотреть урок</div></div></div>`;

// рекламный кабинет: потрачено / заявок (bad — красный минус)
const ADSTATS = (spent, leads, bad, id = "ads") => `<div id="${id}" style="font-family:Onest;color:#fff">
  <div style="font-family:'JetBrains Mono';font-weight:800;font-size:26px;color:#8b93a3">РЕКЛАМНЫЙ КАБИНЕТ</div>
  <div style="background:#1c1f26;border-radius:22px;padding:18px 22px;margin-top:12px">
    <div style="font-size:26px;color:#b9bfca">Аудитория</div><div style="font-weight:800;font-size:32px">${bad ? "ВСЕ · 18–99 лет · вся Россия" : "18–35 · интересы: финансы, кэшбэк"}</div></div>
  <div style="display:flex;gap:12px;margin-top:12px">
    <div style="flex:1;background:#1c1f26;border-radius:22px;padding:16px 18px"><div style="font-size:24px;color:#b9bfca">Потрачено</div><div style="font-family:Unbounded;font-weight:900;font-size:40px;color:${bad ? "#ff4d4d" : "#fff"}">${spent}</div></div>
    <div style="flex:1;background:#1c1f26;border-radius:22px;padding:16px 18px"><div style="font-size:24px;color:#b9bfca">Заявок</div><div style="font-family:Unbounded;font-weight:900;font-size:40px;color:${bad ? "#ff4d4d" : "#4cd964"}">${leads}</div></div></div></div>`;

// уведомления о заявках (выплаты — пример, цифры условные)
const NOTIFS = (n = 3, id = "nt") => `<div id="${id}">${[["Новая заявка", "карта оформлена · +1 200 ₽"], ["Новая заявка", "карта оформлена · +1 200 ₽"], ["Выплата партнёру", "+2 400 ₽ на счёт"]].slice(0, n)
  .map(([a, b], k) => `<div id="${id}${k}" style="display:flex;gap:14px;align-items:center;background:#1c1f26;border-radius:22px;padding:14px 16px;margin-top:12px;font-family:Onest;color:#fff">
    <div style="width:56px;height:56px;border-radius:14px;background:#4cd964;display:flex;align-items:center;justify-content:center;font-size:32px">✓</div>
    <div><div style="font-weight:800;font-size:28px">${a}</div><div style="font-size:25px;color:#4cd964;font-weight:700">${b}</div></div></div>`).join("")}</div>`;

// доска «ТЕОРИЯ» (рукописная, Caveat): шаги появляются по одному (#<id>0..3)
const DOSKA = (x, y, w = 900, steps = 4, id = "dk", z = 30) => `<div id="${id}" style="position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${w * .78}px;z-index:${z}">
  <div style="position:absolute;inset:0;background:#fbfaf3;border:12px solid #8a5a33;border-radius:18px;box-shadow:0 14px 0 #151515"></div>
  <div style="position:absolute;left:30px;top:16px;font-family:Caveat;font-weight:700;font-size:${w * .09}px;color:#c0392b;transform:rotate(-2deg)">ТЕОРИЯ</div>
  ${[["РЕКЛАМА", "#2f6db5"], ["КЛИК ПО ССЫЛКЕ", "#151515"], ["КАРТА ОФОРМЛЕНА", "#151515"], ["БАНК ПЛАТИТ ТЕБЕ ₽", "#2f8f3a"]].slice(0, steps)
    .map(([t, c], k) => `<div id="${id}${k}" style="position:absolute;left:${60 + (k % 2) * 40}px;top:${w * (.2 + k * .14)}px;font-family:Caveat;font-weight:700;font-size:${w * .072}px;color:${c};transform:rotate(${k % 2 ? 1.5 : -1.5}deg)">${k ? "↓ " : ""}${t}</div>`).join("")}</div>`;

// табличка на лобовом «Гелика»
const RENT = (x, y, txt = "АРЕНДА · 1 ЧАС", id = "rt", z = 9) => `<div id="${id}" style="position:absolute;left:${x}px;top:${y}px;z-index:${z};transform:rotate(-6deg);background:#ffd23f;border:6px solid #151515;border-radius:12px;padding:8px 18px;font-family:Unbounded;font-weight:900;font-size:34px;color:#151515;white-space:nowrap">${txt}</div>`;

// ноутбук на столе со «Запустить рекламу»
const LAPTOP = (x, y, w = 420, id = "lp", z = 20) => `<div id="${id}" style="position:absolute;left:${x}px;top:${y}px;width:${w}px;z-index:${z}">
  <div style="height:${w * .6}px;background:#0d0e12;border:9px solid #2a2d34;border-radius:18px;box-shadow:0 0 80px rgba(120,180,255,.45);padding:18px;font-family:Onest;color:#fff">
    <div style="font-family:'JetBrains Mono';font-weight:800;font-size:${w * .05}px;color:#8b93a3">РЕКЛАМА · КАРТА БАНКА</div>
    <div style="margin-top:${w * .06}px;background:#ff3b30;border-radius:14px;text-align:center;padding:${w * .03}px 0;font-weight:900;font-size:${w * .07}px">ЗАПУСТИТЬ</div></div>
  <div style="height:${w * .06}px;margin:0 -${w * .06}px;background:#8a8e94;border:7px solid #151515;border-radius:0 0 14px 14px"></div></div>`;

// финальная карточка (последний кадр — только она): Арбузов + бесплатный урок
const CTAA = `<div style="position:absolute;left:60px;right:60px;top:1260px;z-index:70;background:#ffd23f;border:8px solid #151515;border-radius:34px;padding:26px 30px;box-shadow:0 14px 0 #151515;font-family:Unbounded;font-weight:900;color:#151515;text-align:center">
  <img src="../../brand/arbuz_cut.png" style="width:150px;height:150px;border-radius:50%;border:7px solid #151515;margin-top:-110px;background:#0f1210">
  <div style="font-size:48px;line-height:1.12;margin-top:6px">Бесплатный урок<br><span style="color:#c0392b">по арбитражу на банки</span></div>
  <div style="margin-top:12px;font-size:32px;font-family:Onest;font-weight:800">Телеграм-канал · ссылка в шапке</div></div>`;
// платок бабы Гали поверх головы (координаты как у ch(): x — центр, foot — низ, h — рост; рисуется над героем)
const PLATOK = (x, foot, h, z = 9, c = "#e0302a") => { const s = h / 740, l = x - 210 * s, t = foot - 740 * s;
  return `<div style="position:absolute;left:${l}px;top:${t}px;width:${420 * s}px;height:${800 * s}px;z-index:${z};pointer-events:none"><svg viewBox="0 0 420 800" style="overflow:visible">
  <path d="M96 230 Q100 70 210 62 Q320 70 324 230 Q330 300 300 330 Q296 250 270 150 Q210 120 150 150 Q124 250 120 330 Q90 300 96 230 Z" fill="${c}" stroke="#151515" stroke-width="7" stroke-linejoin="round"/>
  ${[[150, 110], [210, 92], [270, 110], [130, 200], [292, 200], [180, 140], [240, 140]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r="9" fill="#fbfaf3"/>`).join("")}
  <path d="M190 336 l-26 40 l46 -14 l46 14 l-26 -40 z" fill="${c}" stroke="#151515" stroke-width="6" stroke-linejoin="round"/></svg></div>`; };
