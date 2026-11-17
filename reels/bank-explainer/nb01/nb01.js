// «Тетрадь Никиты», серия 1: за что банки платят Никите — арбитраж трафика на банки на простой арифметике.
// Никита (по фото владельца) ведёт от первого лица из левого нижнего угла; камера едет по тетради между станциями.
// line — субтитры (цифры одним словом через неразрывный пробел), say — текст для озвучки.
const NB = " ", ORANGE = "#f08a2c", DEB = "#1f7a62";
const X = [540, 1740, 2940], Y = [960, 2260, 3560, 4860];
const card = (c, w, label, r = 0) => IC.card({ c, w, label, kind: "МИР" });
const tgCard = (title, sub, lines = []) => note(`<div style="display:flex;align-items:center;gap:22px">${IC.tg(110)}<div><div style="font:800 44px Manrope">${title}</div><div style="font:700 30px Manrope;color:#777">${sub}</div></div></div>
  ${lines.map(l => `<div style="margin-top:20px;height:20px;border-radius:10px;background:#e7e2d6;width:${l}%"></div>`).join("")}`, 620);
const chk = t => `<div style="display:flex;align-items:center;gap:20px"><svg viewBox="0 0 60 60" width="60"><rect x="6" y="6" width="48" height="48" rx="6" fill="none" stroke="${PEN}" stroke-width="5"/><path class="tick" d="M14 30 l12 12 l26 -32" fill="none" stroke="${GRN}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/></svg>${hand(t, 64, PEN)}</div>`;
const phoneReel = `<div style="width:400px;height:760px;border-radius:54px;background:#151a1c;border:8px solid #2a2f33;position:relative;overflow:hidden">
  <div style="position:absolute;inset:0;background:linear-gradient(170deg,#9cc3dc,#4f7f9c)"></div>
  <div style="position:absolute;left:0;right:0;top:70px;text-align:center;font:700 58px/1.02 Oswald;color:#fff;text-shadow:0 4px 0 rgba(0,0,0,.25)">КАКУЮ КАРТУ<br>ВЫБРАТЬ <span style="color:#ffe14d">СТУДЕНТУ?</span></div>
  <div style="position:absolute;left:20px;top:260px">${CH.nikita({ w: 360, pose: "point" })}</div>
  <div style="position:absolute;right:24px;top:24px;font:800 24px Manrope;color:#fff;background:#e2412f;border-radius:10px;padding:4px 12px">● REC</div>
  <div style="position:absolute;left:0;right:0;bottom:0;padding:18px 22px 26px;background:linear-gradient(transparent,rgba(0,0,0,.65));font:800 24px Manrope;color:#fff">@nikita · ссылка в описании ↓</div></div>`;
const profile = note(`<div style="display:flex;align-items:center;gap:28px"><div style="width:160px;height:160px;border-radius:50%;overflow:hidden;background:#9cc3dc;border:5px solid ${ORANGE}">
   <div style="margin:6px 0 0 -10px">${CH.nikita({ w: 180 })}</div></div>
   <div style="flex:1"><div style="height:30px;width:70%;border-radius:15px;background:#d9d3c5"></div><div style="height:20px;width:92%;margin-top:18px;border-radius:10px;background:#e7e2d6"></div><div style="height:20px;width:60%;margin-top:12px;border-radius:10px;background:#e7e2d6"></div></div></div>
   <div style="margin-top:26px;display:flex;align-items:center;gap:16px;padding:14px 20px;border-radius:18px;border:5px solid ${RED};background:rgba(226,65,47,.07)">${IC.tg(60)}<span style="font:800 40px Manrope;color:${RED}">бесплатный урок →</span></div>`, 720);

const EP = {
  lead: .15, tail: 2,
  margins: [130, 1330, 2530], camShift: [0, 130, .92],
  stations: { A: [X[0], Y[0], 1, -1], B: [X[1], Y[0], 1, 1.2], C: [X[2], Y[0], 1, -.8], D: [X[2], Y[1], 1, 1], E: [X[1], Y[1], 1.04, -1.2], F: [X[0], Y[1], 1, .6],
              G: [X[0], Y[2], 1, -1], H: [X[1], Y[2], 1, 1], I: [X[2], Y[2], 1.03, -.6], J: [X[2], Y[3], 1, 1], K: [X[1], Y[3], 1, -1], L: [X[0], Y[3], 1, .8] },
  nikita: { x: 250, y: 1300, w: 500, hero: { x: 540, y: 1235, s: 1.2, until: [2, 0] }, poses: [[0, 0, "phone"], [1, 3, "point"], [2, 0, "idle"], [3, 3, "shrug"], [4, 0, "idle"], [8, 0, "phone"], [11, 0, "idle"], [14, 3, "point"], [15, 0, "phone"], [17, 0, "idle"], [18, 2, "point"], [19, 0, "idle"], [22, 0, "point"]] },
  scenes: [
    // A — крючок: с первого кадра телефон «взрывается» уведомлениями о зачислениях, кадр трясёт, счётчик скачет до 87 000;
    // Никита крупно по центру с телефоном, на «не работаю» — штамп; потом он «уезжает» в свой угол и начинается тетрадь.
    { st: "A", line: `Банки заплатили мне *87${NB}000${NB}₽* за месяц,`, say: "Банки заплатили мне восемьдесят семь тысяч рублей за месяц,",
      els: [
        { hud: 1, dt: -0.50, x: 540, y: 470, s: .86, r: -3, a: "cut", dur: .22, shake: 0.7, html: notif("Зачисление", `+1${NB}500${NB}₽ · дебетовая карта`), outScene: 2, z: 71+0 },
        { hud: 1, dt: -0.22, x: 560, y: 535, s: .86, r: 4, a: "pop", dur: .22, shake: 0.7, html: notif("Зачисление", `+3${NB}500${NB}₽ · кредитная карта`), outScene: 2, z: 71+1 },
        { hud: 1, dt: 0.06, x: 520, y: 600, s: .86, r: -5, a: "pop", dur: .22, shake: 0.7, html: notif("Зачисление", `+4${NB}000${NB}₽ · кредитная карта`), outScene: 2, z: 71+2 },
        { hud: 1, dt: 0.34, x: 570, y: 665, s: .86, r: 3, a: "pop", dur: .22, shake: 0.7, html: notif("Зачисление", `+1${NB}500${NB}₽ · дебетовая карта`), outScene: 2, z: 71+3 },
        { hud: 1, dt: 0.62, x: 530, y: 730, s: .86, r: -2, a: "pop", dur: .22, shake: 0.7, html: notif("Зачисление", `+3${NB}500${NB}₽ · кредитная карта`), outScene: 2, z: 71+4 },
        { hud: 1, dt: 0.95, x: 550, y: 800, s: .86, r: 5, a: "pop", dur: .22, shake: 1.4, html: notif("Выплата", `+45${NB}000${NB}₽ · партнёрская программа`), outScene: 2, z: 71+5 },
        { hud: 1, dt: 1.30, x: 540, y: 870, s: .86, r: -3, a: "pop", dur: .22, shake: 1.4, html: notif("Выплата", `+28${NB}000${NB}₽ · партнёрская программа`), outScene: 2, z: 71+6 },
        { w: 0, dl: -.5, x: 540, y: 300, a: "cut", html: handCnt(250, GRN, "+", " ₽"), count: { from: 1500, steps: [[0.00, 1500], [0.28, 5000], [0.56, 9000], [0.84, 10500], [1.12, 14000], [1.45, 59000], [1.80, 87000]] }, r: -3 },
        { w: 4, a: "draw", dur: .35, html: inkLine(170, 440, 910, 428, RED, 12) },
      ] },
    { line: "а я у них даже *не работаю*.", say: "а я у них даже не работаю.",
      els: [
        { hud: 1, w: 4, x: 540, y: 1060, a: "stamp", shake: 1.6, html: stamp("в банке не работаю", RED, 70), r: -7, z: 80 },
      ] },
    { line: "Ничего не продаю и не беру кредиты.", say: "Ничего не продаю и не беру кредиты.",
      els: [
        { w: 0, x: 540, y: 880, a: "write", html: hand("ничего не продаю", 76, PEN), r: -2 },
        { w: 2, a: "draw", html: inkLine(300, 885, 780, 875, RED, 9) },
        { w: 4, x: 540, y: 1020, a: "write", html: hand("кредитов не беру", 76, PEN), r: -2 },
        { w: 5, a: "draw", html: inkLine(300, 1025, 780, 1015, RED, 9) },
      ] },
    { line: "Покажу на цифрах, *за что* мне платят.", say: "Покажу на цифрах, за что мне платят.",
      els: [
        { w: 3, x: 900, y: 900, a: "pop", html: hand("?", 260, RED), r: 12 },
      ] },
    // B — банкам нужны клиенты
    { st: "B", line: "Банкам постоянно нужны *новые клиенты*.", say: "Банкам постоянно нужны новые клиенты.",
      els: [
        { w: 0, x: 540, y: 560, a: "pop", stk: 1, tape: -4, html: `<div style="background:#2f5d8a;border-radius:26px;padding:30px 40px">${IC.bank(260, "#fff")}</div>`, r: -2 },
        ...[[190, 380, "#f08a2c", "#2b211d"], [890, 400, "#6cbf5a", "#c98a3c"], [170, 760, "#8a63d2", "#272333"], [910, 760, "#e2412f", "#2b211d"]].map(([x, y, c, h], k) => ({ w: 3, dl: k * .15, x, y, a: "pop", stk: 1, html: CH.person({ c, h, w: 130 }), r: k % 2 ? 6 : -6 })),
        ...[[300, 330], [780, 350], [290, 700], [790, 700]].map(([x, y], k) => ({ w: 3, dl: .1 + k * .15, x, y, a: "pop", html: hand("+1", 70, GRN), r: -8 })),
      ] },
    { line: "Реклама стоит им миллиарды, поэтому они платят *за результат*.", say: "Реклама стоит им миллиарды, поэтому они платят за результат.",
      els: [
        { w: 0, x: 280, y: 1050, a: "pop", stk: 1, html: IC.tv(260), r: -5 },
        { w: 2, x: 290, y: 1220, a: "write", html: hand("млрд ₽ на рекламу", 54, PEN) },
        { w: 3, a: "draw", html: inkLine(170, 980, 400, 1130, RED, 10) },
        { w: 3, a: "draw", html: inkLine(400, 980, 170, 1130, RED, 10) },
        { w: 7, x: 760, y: 1080, a: "stamp", html: stamp("оплата<br>за результат", GRN, 60), r: -8 },
      ] },
    // C — как платят
    { st: "C", line: "Человек сам оформил карту по моей ссылке, и банк платит мне *вознаграждение*.", say: "Человек сам оформил карту по моей ссылке, и банк платит мне вознаграждение.",
      els: [
        { w: 0, x: 150, y: 430, a: "pop", stk: 1, html: CH.person({ c: "#6cbf5a", h: "#c98a3c", w: 140 }) },
        { w: 2, a: "draw", html: inkArrow(230, 430, 320, 430, .1) },
        { w: 3, x: 460, y: 430, a: "pop", stk: 1, html: card(DEB, 240, "КАРТА"), r: -5 },
        { w: 5, x: 470, y: 560, a: "write", html: hand("по моей ссылке", 48, INK) },
        { w: 8, a: "draw", html: inkArrow(600, 430, 690, 430, -.1) },
        { w: 8, x: 830, y: 430, a: "pop", stk: 1, html: `<div style="background:#2f5d8a;border-radius:20px;padding:18px 24px">${IC.bank(150, "#fff")}</div>`, r: 4 },
        { w: 10, a: "draw", html: inkArrow(830, 540, 760, 660, -.2, GRN) },
        { w: 11, x: 640, y: 720, a: "pop", stk: 1, html: IC.cash(220), r: -6 },
        { w: 11, x: 850, y: 740, a: "fade", html: hand("мне", 64, GRN), r: -6 },
      ] },
    { line: `За дебетовую карту около *1${NB}500${NB}₽*. За кредитную до *4${NB}000${NB}₽*.`, say: "За дебетовую карту около полутора тысяч рублей. За кредитную до четырёх тысяч.",
      els: [
        { w: 0, x: 300, y: 970, a: "left", stk: 1, tape: 6, html: card(DEB, 380, "ДЕБЕТОВАЯ"), r: -4 },
        { w: 4, x: 300, y: 1180, a: "count", html: handCnt(96, GRN, "≈", " ₽"), count: { from: 0, to: 1500, d: .7 } },
        { w: 5, x: 790, y: 970, a: "right", stk: 1, tape: -6, html: card(ORANGE, 380, "КРЕДИТНАЯ"), r: 4 },
        { w: 7, x: 790, y: 1180, a: "count", html: handCnt(96, GRN, "до ", " ₽"), count: { from: 0, to: 4000, d: .7 } },
      ] },
    // D — партнёрка + трафик
    { st: "D", line: "Я зарегистрировался в *партнёрской программе* и получил свою ссылку.", say: "Я зарегистрировался в партнёрской программе и получил свою ссылку.",
      els: [
        { w: 1, x: 540, y: 520, a: "pop", stk: 1, html: note(`<div style="font:800 40px Manrope;text-align:center">ПАРТНЁРСКАЯ ПРОГРАММА</div>
          <div style="margin-top:22px;border:4px solid #d9d3c5;border-radius:14px;padding:12px 18px;font:700 34px Manrope;color:#555">Имя: <span style="color:#111">Никита</span></div>
          <div style="margin-top:18px;background:${GRN};color:#fff;border-radius:14px;padding:14px;text-align:center;font:800 36px Manrope">Получить ссылку</div>`, 640), r: -2 },
        { w: 7, x: 540, y: 820, a: "pop", stk: 1, tape: -3, html: `<div style="display:flex;align-items:center;gap:14px;background:#fff;border-radius:999px;padding:16px 30px">${IC.link(56)}<span style="font:800 42px Manrope">моя ссылка</span></div>`, r: 3 },
      ] },
    { line: "Дальше нужен *трафик*: люди, которые и так ищут карту.", say: "Дальше нужен трафик: люди, которые и так ищут карту.",
      els: [
        { w: 2, x: 250, y: 1010, a: "write", html: hand("ТРАФИК =", 96, ORANGE), r: -4 },
        ...[0, 1, 2, 3].map(k => ({ w: 3, dl: k * .14, x: 540 + k * 130, y: 1190, a: "up", stk: 1, html: CH.person({ c: ["#f08a2c", "#8a63d2", "#6cbf5a", "#e2412f"][k], h: ["#2b211d", "#272333", "#c98a3c", "#2b211d"][k], w: 105 }) })),
        { w: 5, x: 735, y: 1025, a: "pop", stk: 1, html: `<div style="background:#fff;border-radius:22px;padding:12px 22px;font:800 34px Manrope">🔍 какую карту выбрать?</div>`, r: -2 },
        { w: 7, a: "draw", html: inkArrow(640, 960, 600, 880, .2) },
      ] },
    // E — ролики
    { st: "E", line: "Я снимаю короткие ролики о том, какую карту выбрать студенту. Ссылка в описании.", say: "Я снимаю короткие ролики о том, какую карту выбрать студенту. Ссылка — в описании.",
      els: [
        { w: 0, x: 620, y: 730, a: "pop", stk: 1, tape: -5, html: phoneReel, r: 3 },
        { w: 10, x: 250, y: 1010, a: "write", html: hand("ссылка тут", 70, RED), r: -6 },
        { w: 10, a: "draw", html: inkArrow(260, 1060, 430, 1110, -.25, RED) },
      ] },
    // F — воронка
    { st: "F", line: `Один ролик набрал *50${NB}000* просмотров.`, say: "Один ролик набрал пятьдесят тысяч просмотров.",
      els: [
        { w: 1, x: 260, y: 420, a: "pop", stk: 1, html: `<div style="background:#1b1b1b;border-radius:24px;padding:20px 26px">${IC.eye(120)}</div>`, r: -6 },
        { w: 3, x: 640, y: 410, a: "count", html: handCnt(150, INK), count: { from: 0, to: 50000, d: 1 } },
        { w: 4, x: 650, y: 510, a: "write", html: hand("просмотров", 56, PEN) },
      ] },
    { line: "По ссылке перешёл один процент, это *500* человек.", say: "По ссылке перешёл один процент — это пятьсот человек.",
      els: [
        { w: 0, a: "draw", html: inkArrow(640, 560, 640, 660, 0) },
        { w: 3, x: 800, y: 610, a: "pop", html: hand("1%", 90, RED), r: -6 },
        { w: 6, x: 640, y: 740, a: "count", html: handCnt(130, INK), count: { from: 0, to: 500, d: .7 } },
        { w: 7, x: 640, y: 830, a: "write", html: hand("переходов", 52, PEN) },
      ] },
    { line: "Карту оформили и активировали *30*.", say: "Карту оформили и активировали тридцать.",
      els: [
        { w: 0, a: "draw", html: inkArrow(640, 870, 640, 940, 0) },
        ...Array.from({ length: 30 }, (_, n) => { const c = n % 6, r = Math.floor(n / 6); return { w: 2, dl: n * .03, x: 330 + c * 104, y: 1000 + r * 58, a: "pop", dur: .3, html: IC.card({ c: n % 3 == 2 ? ORANGE : DEB, w: 92 }), r: (n * 37 % 9) - 4 }; }),
        { w: 4, x: 140, y: 1100, a: "pop", html: hand("30!", 110, RED), r: -10 },
      ] },
    // G — 45 000
    { st: "G", line: `30 на 1${NB}500, это *45${NB}000${NB}₽*.`, say: "Тридцать на полторы тысячи — это сорок пять тысяч рублей.",
      els: [
        { w: 0, x: 540, y: 500, a: "write", html: hand(`30 × 1${NB}500 ₽`, 140, INK), r: -2 },
        { w: 3, x: 560, y: 720, a: "write", html: hand(`= 45${NB}000 ₽`, 170, GRN), r: -2 },
        { w: 4, a: "draw", dur: .5, html: inkCircle(600, 720, 340, 110, RED) },
        { w: 4, x: 780, y: 1030, a: "pop", stk: 1, html: IC.cash(260), r: 8 },
        { hud: 1, w: 4, dl: .2, x: 540, y: 150, a: "down", html: notif("Выплата", `+45${NB}000 ₽ · за 30 клиентов`) },
      ] },
    // H — телеграм-канал
    { st: "H", line: "Ещё у меня Телеграм-канал про *кэшбэк*.", say: "Ещё у меня Телеграм-канал про кэшбэк.",
      els: [
        { w: 3, x: 560, y: 470, a: "pop", stk: 1, tape: 4, html: tgCard("Кэшбэк без воды", `8${NB}400 подписчиков`, [90, 70, 82]), r: -2 },
      ] },
    { line: "Через него за месяц оформили *12 кредиток*.", say: "Через него за месяц оформили двенадцать кредиток.",
      els: [
        ...Array.from({ length: 12 }, (_, n) => { const c = n % 6, r = Math.floor(n / 6); return { w: 4, dl: n * .05, x: 290 + c * 104, y: 760 + r * 64, a: "pop", dur: .3, html: IC.card({ c: ORANGE, w: 94 }), r: (n * 31 % 9) - 4 }; }),
        { w: 6, x: 930, y: 790, a: "pop", html: hand("12", 110, RED), r: 8 },
      ] },
    { line: `12 на 3${NB}500, это ещё *42${NB}000${NB}₽*.`, say: "Двенадцать на три с половиной тысячи — это ещё сорок две тысячи.",
      els: [
        { w: 0, x: 560, y: 1000, a: "write", html: hand(`12 × 3${NB}500 ₽`, 110, INK), r: -2 },
        { w: 4, x: 580, y: 1170, a: "write", html: hand(`= 42${NB}000 ₽`, 140, GRN), r: -2 },
        { hud: 1, w: 5, x: 540, y: 150, a: "down", html: notif("Выплата", `+42${NB}000 ₽ · за 12 клиентов`) },
      ] },
    // I — итог
    { st: "I", line: "Никакой магии. Обычная *арифметика*.", say: "Никакой магии. Обычная арифметика.",
      els: [
        { w: 0, x: 220, y: 600, a: "pop", stk: 1, html: `<svg viewBox="0 0 200 270" width="230"><rect x="6" y="6" width="188" height="258" rx="24" fill="#3b4048"/><rect x="24" y="24" width="152" height="60" rx="10" fill="#cfe8c8"/><text x="164" y="68" font-family="Oswald" font-weight="700" font-size="40" text-anchor="end" fill="#1b1b1b">87000</text>
          ${Array.from({ length: 12 }, (_, n) => `<rect x="${24 + (n % 3) * 54}" y="${100 + Math.floor(n / 3) * 40}" width="44" height="32" rx="8" fill="${n == 11 ? ORANGE : "#e9e4d8"}"/>`).join("")}</svg>`, r: -8 },
        { w: 0, x: 680, y: 420, a: "write", html: hand(`45${NB}000`, 110, INK) },
        { w: 1, x: 650, y: 540, a: "write", html: hand(`+ 42${NB}000`, 110, INK) },
        { w: 2, a: "draw", html: inkLine(450, 620, 890, 615, PEN, 8) },
        { w: 2, x: 670, y: 730, a: "write", html: hand(`87${NB}000 ₽`, 170, GRN) },
        { w: 3, a: "draw", dur: .5, html: inkCircle(670, 730, 280, 100, RED) },
      ] },
    // J — честно + определение
    { st: "J", line: "Банк платит только за *настоящего клиента*, который сам выбрал карту.", say: "Банк платит только за настоящего клиента, который сам выбрал карту.",
      els: [
        { w: 4, x: 560, y: 470, a: "stamp", html: stamp("реальный клиент ✓", GRN, 70), r: -6 },
      ] },
    { line: "Это и есть *арбитраж трафика* на банки.", say: "Это и есть арбитраж трафика на банки.",
      els: [
        { w: 2, x: 540, y: 720, a: "write", html: hand(`<span class="hl">арбитраж трафика</span>`, 110, PEN), r: -2 },
        { w: 5, x: 540, y: 840, a: "write", html: hand(`<span class="hl">на банки</span>`, 110, PEN), r: -2 },
        ...[[CH.person({ w: 100 }), 200], [`<div style="width:100px;height:100px;border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center">${IC.link(60)}</div>`, 420],
            [`<div style="background:#2f5d8a;border-radius:16px;padding:10px 14px">${IC.bank(100, "#fff")}</div>`, 640], [IC.coin(100), 860]]
          .map(([h, x], k) => ({ w: 0, dl: .2 + k * .3, x, y: 1060, a: "pop", stk: 1, html: h })),
        ...[0, 1, 2].map(k => ({ w: 0, dl: .4 + k * .3, a: "draw", dur: .3, html: inkArrow(265 + k * 220, 1060, 345 + k * 220, 1060, 0) })),
      ] },
    // K — призыв
    { st: "K", line: "Как найти партнёрку и первый трафик, показываю на *бесплатном уроке*.", say: "Как найти партнёрку и первый трафик — показываю на бесплатном уроке.",
      els: [
        { w: 0, x: 560, y: 450, a: "pop", stk: 1, tape: -3, html: tgCard("Бесплатный урок", "арбитраж трафика на банки"), r: -2 },
        { w: 2, x: 560, y: 680, a: "write", html: chk("где взять партнёрку") },
        { w: 5, x: 560, y: 790, a: "write", html: chk("где найти первый трафик") },
        { w: 8, x: 560, y: 900, a: "write", html: chk("первые выплаты") },
      ] },
    { st: "L", line: "Ссылка на мой Телеграм *в шапке профиля*.", say: "Ссылка на мой Телеграм — в шапке профиля.",
      els: [
        { w: 0, x: 540, y: 560, a: "pop", stk: 1, tape: 3, html: profile, r: -2 },
        { w: 4, x: 800, y: 940, a: "write", html: hand("жми сюда!", 84, RED), r: -8 },
        { w: 4, a: "draw", html: inkArrow(740, 880, 640, 790, .2, RED) },
      ] },
  ],
};
