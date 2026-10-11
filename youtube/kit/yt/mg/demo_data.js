// Демо режима «Моушн-графика» на материале хука ролика №3 (общие данные для demo.html и yt/sfx.js). Цифры — из сценария
// (курьер 350–500 ₽/ч — hh.ru для Retail.ru, 20.04.2026; бонус новичку до 2 000 ₽; план месяца — пример).
window.SEGS = [
  { mode: "motion", t0: 0, t1: 4.4, data: { scene: "kinetic", title: "Подработка · Москва, 2026",
    lines: [[["Курьер", "", .2], ["пешком", "", .45]], [["350–500 ₽", "g", .9]], [["в час", "", 1.3]]], under: { line: 1, t: 1.6 },
    icon: { k: "bag", t: .4, x: 1360, y: 280, size: 380, color: "#8fa2d6" },
    lower: { t: 2.2, title: "Источник: hh.ru для Retail.ru", sub: "20.04.2026 · до вычета расходов" } } },
  { mode: "motion", t0: 4.4, t1: 9.4, tin: { type: "wipe", dur: .7, color: "#2ee07a" }, data: { scene: "bars", title: "Сколько за один раз",
    max: 2000, bars: [{ label: "1 час<br>курьером", value: 350, color: "#8fa2d6", t: .5 }, { label: "1 покупка<br>по новой карте", value: 2000, color: "#2ee07a", t: 1.2 }],
    base: { x: 560, y: 840, h: 520, w: 300, gap: 300 }, arrow: { from: 0, to: 1, t: 2.4, text: "в 5,7 раза больше" }, burst: { bar: 1, t: 2.0 },
    lower: { t: 3.2, title: "Бонус новому клиенту", sub: "пример · условия у каждого банка свои" } } },
  { mode: "motion", t0: 9.4, t1: 13.6, tin: { type: "iris", dur: .8, color: "#ffd60a", at: [1300, 720] }, data: { scene: "scale", title: "Сколько времени",
    rows: [{ label: "6 часов", sub: "смены курьером", n: 6, icon: "clock", color: "#ff5a6e", t: .3, y: 230 },
      { label: "10 минут", sub: "оформить карту и купить", n: 1, icon: "card", color: "#2ee07a", t: 2.0, y: 600 }] } },
  { mode: "motion", t0: 13.6, t1: 18, tin: { type: "wipe", dur: .7, color: "#ffd60a" }, data: { scene: "donut", title: "План на месяц · пример",
    parts: [{ label: "Бонус за карту", value: 2000, color: "#2ee07a", text: "2 000 ₽" }, { label: "Приведи друга", value: 1000, color: "#2b8cff", text: "1 000 ₽" },
      { label: "Проценты, 3 мес.", value: 387, color: "#ffd60a", text: "387 ₽" }], t0: .4, gap: .45, total: { t0: .6, t1: 2.2, to: 3387, label: "за месяц · пример" },
    note: "суммы — примеры из ролика, условия у каждого банка свои" } },
  { mode: "motion", t0: 18, t1: 22, tin: { type: "iris", dur: .8, color: "#2ee07a", at: [960, 540] }, data: { scene: "icons", title: "5 способов, где банк платит",
    items: [{ k: "card", label: "Бонус<br>за карту" }, { k: "friend", label: "Приведи<br>друга" }, { k: "percent", label: "Деньги<br>на счёте" },
      { k: "cart", label: "Кэшбэк<br>за покупки" }, { k: "credit", label: "Кредитка<br>с умом", color: "#ff5a6e" }], t0: .4, gap: .35, y: 300,
    lower: { t: 2.4, title: "Способ 1 · бонус за карту", sub: "дальше — подробно" } } },
];
window.TLX = { music: [{ t: 0, part: "main" }], bpm: 100 };
