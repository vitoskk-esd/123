// «АРБИТРАЖНИКИ» ep03 «Никита: ролик → 12 заявок» — герои и реквизит (общие помощники — из ep02; базовые — props.js)
const NIKITA = { jacket: "#2f8f3a", pants: "#2b2f37", hair: "#c9a26a", look: "grin" };
const N_ = (p, x, foot, h, o = {}, pose = {}, extra = {}) => ch("nikita", p, x, foot, h, { ...o }, pose, extra);   // Никита — свой персонаж по фото владельца (../charsA.js)
const TITLE = (a, b, fs = 80) => `<div style="position:absolute;left:0;right:0;top:300px;text-align:center;font-family:Unbounded;font-weight:900;line-height:1;letter-spacing:-3px;z-index:50">
  <span style="display:inline-block;padding:10px 28px 18px;border:8px solid #151515;border-radius:22px;box-shadow:0 12px 0 #151515;font-size:66px;background:#ffd23f;color:#151515;transform:rotate(-3deg)">${a}</span><br>
  <span style="display:inline-block;padding:10px 28px 18px;border:8px solid #151515;border-radius:22px;box-shadow:0 12px 0 #151515;font-size:${fs}px;white-space:nowrap;background:#ff3b30;color:#fff;margin-top:26px;transform:rotate(2deg)">${b}</span></div>`;

// узел схемы (карточка с иконкой)
const NODE = (x, y, w, icon, t, sub, bg = "#fbfaf3", id = "") => `<div${id ? ` id="${id}"` : ""} style="position:absolute;left:${x}px;top:${y}px;width:${w}px;z-index:40;background:${bg};border:7px solid #151515;border-radius:24px;box-shadow:0 10px 0 #151515;text-align:center;padding:14px 8px;font-family:Unbounded;font-weight:900;color:#151515">
  <div style="font-size:${w * .28}px;line-height:1">${icon}</div><div style="font-size:${w * .13}px;margin-top:6px">${t}</div>${sub ? `<div style="font-family:Onest;font-weight:800;font-size:${w * .1}px;color:#2f8f3a;margin-top:4px">${sub}</div>` : ""}</div>`;
const ARROW = (x, y, w, label, rot = 0, c = "#4cd964", id = "") => `<div${id ? ` id="${id}"` : ""} style="position:absolute;left:${x}px;top:${y}px;width:${w}px;z-index:41;transform:rotate(${rot}deg);text-align:center">
  <div style="font-family:Unbounded;font-weight:900;font-size:30px;color:#fff;-webkit-text-stroke:7px #151515;paint-order:stroke fill">${label}</div>
  <svg viewBox="0 0 200 40" style="width:100%;height:40px;overflow:visible"><path d="M6 20 H170" stroke="#151515" stroke-width="20" stroke-linecap="round"/><path d="M6 20 H170" stroke="${c}" stroke-width="10" stroke-linecap="round"/><path d="M160 2 L196 20 L160 38 Z" fill="${c}" stroke="#151515" stroke-width="6" stroke-linejoin="round"/></svg></div>`;
// схема денег: БАНК → НИКИТА → ДРУЗЬЯ (обложка и объяснение)
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
const PAYOUT = (sum = "+7 500 ₽", id = "po") => `<div id="${id}" style="font-family:Onest;color:#fff">
  <div style="font-family:'JetBrains Mono';font-weight:800;font-size:26px;color:#8b93a3">ПАРТНЁРСКИЙ КАБИНЕТ</div>
  <div style="background:#1c1f26;border-radius:22px;padding:18px 22px;margin-top:12px"><div style="font-size:26px;color:#b9bfca">Новых клиентов</div><div style="font-family:Unbounded;font-weight:900;font-size:48px">5</div></div>
  <div style="background:#123a1e;border-radius:22px;padding:18px 22px;margin-top:12px;border:4px solid #4cd964"><div style="font-size:26px;color:#b9f5c4">Выплата партнёру</div><div style="font-family:Unbounded;font-weight:900;font-size:58px;color:#4cd964">${sum}</div></div></div>`;
// кружок видеозвонка (PIP): внутри — герой крупно (html героя), рамка
const PIP = (x, y, r, inner, id = "pip", z = 60) => `<div id="${id}" style="position:absolute;left:${x - r}px;top:${y - r}px;width:${2 * r}px;height:${2 * r}px;z-index:${z};border-radius:50%;overflow:hidden;border:10px solid #fbfaf3;box-shadow:0 0 0 7px #151515,0 16px 40px rgba(0,0,0,.5);background:#f4e6d0">${inner.replaceAll('style="left:', 'style="position:absolute;left:')}</div>`;
// пицца на столе
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
    <svg id="${id}f" viewBox="0 0 120 160" style="position:absolute;left:210px;bottom:-128px;width:150px;overflow:visible"><path d="M40 20 q0 -20 18 -20 q18 0 18 20 v50 q30 -6 34 20 l6 60 h-90 l-14 -50 q-6 -20 12 -24 l16 4 z" fill="#f3cdb0" stroke="#151515" stroke-width="7" stroke-linejoin="round"/></svg></div>
  <div id="${id}l" style="position:absolute;left:360px;right:40px;top:1570px;text-align:center;background:#fbfaf3;border:8px solid #151515;border-radius:40px;box-shadow:0 12px 0 #151515;padding:22px 0;font-family:Unbounded;font-weight:900;font-size:40px;line-height:1.2;color:#151515">
    <span id="${id}a" style="display:inline-block;color:#1f86d6">↑</span> Ссылка — в шапке профиля</div></div>`;
// Никита на финале (поверх ENDTG): внизу слева, правая рука показывает на телефон
const ENDNIK = (p = "nz") => `<div style="position:absolute;left:0;top:0;width:1080px;height:1920px;z-index:66;pointer-events:none">${N_(p, 190, 1990, 760, {}, { armR: -135 }, { rim: "#9fd6ff", side: 1, z: 66 }).replaceAll('style="left:', 'style="position:absolute;left:')}</div>`;

// ---- ep03: новые герои ----
const MAMA = html => html.replaceAll("#8e1f3a", "#7a5a4a").replaceAll("#5c1426", "#5a3e32").replaceAll("#2b1a14", "#b8b0a8").replaceAll("#2c3e66", "#4a4a5a");   // мама Никиты (кардиган, седые волосы)
const OLYA = html => html.replaceAll("#8e1f3a", "#2f8f3a").replaceAll("#5c1426", "#1f6a2a").replaceAll("#2b1a14", "#1d1d1f");                                    // Оля в метро
const ARTEM = { jacket: "#3b3f46", pants: "#2b2f37", hair: "#c9a26a", cap: "#e0302a", look: "o" };                                                              // Артём в метро
const GLS = `<g><rect x="150" y="198" width="60" height="44" rx="16" fill="#cfe8f5" fill-opacity=".3" stroke="#151515" stroke-width="6"/><rect x="214" y="198" width="60" height="44" rx="16" fill="#cfe8f5" fill-opacity=".3" stroke="#151515" stroke-width="6"/><path d="M208 214 h8 M150 212 l-18 -6 M274 212 l18 -6" stroke="#151515" stroke-width="5"/></g>`;
const M_ = (p, x, foot, h, pose = {}, extra = {}) => MAMA(ch("vika", p, x, foot, h, null, pose, extra)).replace(`<g class="mouth" id="${p}-mouth-`, GLS + `<g class="mouth" id="${p}-mouth-`);   // + очки
const O_ = (p, x, foot, h, pose = {}, extra = {}) => OLYA(ch("vika", p, x, foot, h, null, pose, extra));
const A_ = (p, x, foot, h, o = {}, pose = {}, extra = {}) => ch("perekup", p, x, foot, h, { ...ARTEM, ...o }, pose, extra);
// телефон на штативе (Никита снимает себя): экран к зрителю — «запись»
const TRIPOD = (x, y, id = "tp", z = 20) => `<div id="${id}" style="position:absolute;left:${x}px;top:${y}px;width:220px;height:760px;z-index:${z}"><svg viewBox="0 0 220 760" style="overflow:visible">
  <path d="M110 360 V600 M110 600 L30 760 M110 600 L190 760 M110 600 V760" stroke="#2b2f37" stroke-width="14" stroke-linecap="round"/>
  <rect x="40" y="20" width="140" height="250" rx="24" fill="#0d0e12" stroke="#151515" stroke-width="10"/><rect x="54" y="40" width="112" height="200" rx="12" fill="#2a3550"/>
  <circle cx="80" cy="64" r="12" fill="#ff3b30"/><text x="98" y="72" font-family="Unbounded" font-weight="900" font-size="20" fill="#fff">REC</text>
  <path d="M110 270 V360" stroke="#2b2f37" stroke-width="18"/></svg></div>`;
// интерфейс короткого видео (Reels) на весь кадр: внутри — ролик Никиты (html героя), подпись и счётчики (#rv — просмотры)
const REELS = (inner, id = "rl") => `<div id="${id}" style="position:absolute;left:0;top:0;width:1080px;height:1920px;z-index:30;background:#0b0c10;overflow:hidden">
  <div style="position:absolute;left:0;top:0;width:1080px;height:1920px">${inner}</div>
  <div style="position:absolute;z-index:9;left:0;right:0;bottom:0;height:760px;background:linear-gradient(transparent,rgba(0,0,0,.85))"></div>
  <div style="position:absolute;z-index:10;right:40px;bottom:520px;display:flex;flex-direction:column;gap:46px;align-items:center;font-family:Onest;font-weight:800;color:#fff;font-size:32px;text-align:center">
    <div><div style="font-size:84px">♥</div><div id="${id}k">3 214</div></div><div><div style="font-size:72px">💬</div>418</div><div><div style="font-size:72px">➤</div>1 102</div></div>
  <div style="position:absolute;z-index:10;left:44px;right:200px;bottom:240px;font-family:Onest;color:#fff">
    <div style="display:flex;align-items:center;gap:18px"><div style="width:90px;height:90px;border-radius:50%;background:#9cc3dc;border:5px solid #fff"></div><b style="font-size:40px">nikita.arb</b>
      <span style="border:3px solid #fff;border-radius:14px;padding:4px 16px;font-size:28px;font-weight:800">Подписаться</span></div>
    <div style="font-size:38px;line-height:1.3;margin-top:20px;font-weight:600">Какой банк дарит бонус новым клиентам 🎁<br><b style="color:#ffd23f">Ссылка — в шапке профиля 👆</b></div></div>
  <div style="position:absolute;z-index:10;left:44px;top:120px;font-family:Onest;font-weight:800;font-size:36px;color:#fff;background:rgba(0,0,0,.45);border-radius:20px;padding:10px 22px">👁 <span id="${id}v">0</span></div></div>`;
// большой счётчик просмотров (#<id>n — число)
const VIEWS = (y = 700, id = "vw") => `<div id="${id}" style="position:absolute;left:80px;right:80px;top:${y}px;z-index:45;text-align:center;background:#fbfaf3;border:9px solid #151515;border-radius:36px;box-shadow:0 14px 0 #151515;padding:26px 0;font-family:Unbounded;font-weight:900;color:#151515">
  <div style="font-size:40px">👁 ПРОСМОТРЫ</div><div id="${id}n" style="font-size:120px;letter-spacing:-4px;color:#e0302a;font-variant-numeric:tabular-nums">40 000</div><div style="font-family:Onest;font-weight:800;font-size:30px;color:#5a5f6a">за один день</div></div>`;
// схема партнёрской метки: ссылка с меткой → банк → «клиент от Никиты ✓» (#tk0..2 — по очереди)
const TRACK = (y = 560) => `<div style="position:absolute;left:0;right:0;top:${y}px;z-index:40;font-family:Unbounded;font-weight:900;color:#151515">
  <div id="tk0" style="margin:0 60px;background:#fbfaf3;border:8px solid #151515;border-radius:28px;box-shadow:0 10px 0 #151515;padding:20px 26px;font-size:36px">🔗 ссылка<span style="font-family:'JetBrains Mono';font-weight:800;color:#5a5f6a">…?partner=</span><span style="background:#ffd23f;padding:0 8px;border-radius:8px">nikita</span></div>
  <div id="tk1" style="margin:40px auto 0;width:420px;text-align:center;background:#9fd6ff;border:8px solid #151515;border-radius:28px;box-shadow:0 10px 0 #151515;padding:18px 0;font-size:40px">🏦 БАНК</div>
  <div id="tk2" style="margin:40px 100px 0;text-align:center;background:#4cd964;border:8px solid #151515;border-radius:28px;box-shadow:0 10px 0 #151515;padding:18px 0;font-size:38px">✓ клиент от Никиты</div></div>`;
// уведомления о заявках (n штук; последняя — итог)
const LEADS = (n = 4, id = "ld") => `<div id="${id}" style="font-family:Onest;color:#fff"><div style="font-family:'JetBrains Mono';font-weight:800;font-size:26px;color:#8b93a3">ПАРТНЁРСКИЙ КАБИНЕТ</div>
  ${Array.from({ length: n }, (_, k) => `<div id="${id}${k}" style="display:flex;gap:14px;align-items:center;background:#1c1f26;border-radius:22px;padding:14px 16px;margin-top:12px">
    <div style="width:56px;height:56px;border-radius:14px;background:#4cd964;display:flex;align-items:center;justify-content:center;font-size:32px">✓</div>
    <div><div style="font-weight:800;font-size:28px">Новая заявка</div><div style="font-size:25px;color:#4cd964;font-weight:700">из ролика · карта оформлена</div></div></div>`).join("")}
  <div style="margin-top:16px;background:#123a1e;border:4px solid #4cd964;border-radius:22px;padding:14px 18px"><div style="font-size:26px;color:#b9f5c4">Заявок за день</div><div id="${id}c" style="font-family:Unbounded;font-weight:900;font-size:56px;color:#4cd964">12</div></div></div>`;
// расчёт: 12 × 1 500 = 18 000
const CALC = (y = 600, id = "cl") => `<div id="${id}" style="position:absolute;left:60px;right:60px;top:${y}px;z-index:40;background:#fbfaf3;border:9px solid #151515;border-radius:34px;box-shadow:0 14px 0 #151515;padding:30px 38px;font-family:Unbounded;font-weight:900;color:#151515;text-align:center">
  <div id="${id}0" style="font-size:50px">12 клиентов × 1 500 ₽</div><div style="height:7px;background:#151515;margin:20px 0;border-radius:4px"></div>
  <div id="${id}1" style="font-size:84px;color:#2f8f3a">= 18 000 ₽</div>
  <div style="font-family:Onest;font-weight:700;font-size:26px;color:#8b93a3;margin-top:10px">цифры — пример; выплаты зависят от банка и продукта</div></div>`;
