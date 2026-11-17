// Серия 1: «За что банки платят Максу и Лере» — арбитраж трафика на банки на простой арифметике.
// line — субтитры (цифры в одно слово через неразрывный пробел), say — текст для озвучки (цифры словами).
// w — индекс слова в line, когда элемент появляется; outScene — через сколько сцен уходит; keep — до конца.
const NB = " ";
const big = (t, px, c = "") => `<div class="big ${c}" style="font-size:${px}px">${t}</div>`;
const lbl = (t, px, c = "") => `<div class="lbl ${c}" style="font-size:${px}px">${t}</div>`;
const cnt = (px, c = "g", pre = "") => `<div class="big ${c}" style="font-size:${px}px">${pre}<span class="num">0</span></div>`;
const chip = (inner, px = 40, st = "") => `<div class="chip" style="font-size:${px}px;${st}">${inner}</div>`;
const mini = (c, w = 120) => IC.card({ c, w });
const ORANGE = "#f08a2c", DEB = "#1f7a62", DARK = "#2b3940";

const phone = `<div style="width:420px;height:800px;border-radius:56px;background:#0d1214;border:8px solid #3a474d;box-shadow:0 20px 60px rgba(0,0,0,.45);position:relative;overflow:hidden">
  <div style="position:absolute;inset:0;background:linear-gradient(170deg,#2c4a52,#13272c)"></div>
  <div style="position:absolute;left:0;right:0;top:120px;text-align:center" class="big" ><span style="font-size:64px;line-height:1.05">КАКУЮ КАРТУ<br>ВЫБРАТЬ<br><span class="o">СТУДЕНТУ?</span></span></div>
  <div style="position:absolute;left:60px;top:420px;transform:rotate(-10deg)">${IC.card({ c: DEB, w: 200, label: "ДЕБЕТ" })}</div>
  <div style="position:absolute;left:170px;top:470px;transform:rotate(8deg)">${IC.card({ c: ORANGE, w: 200, label: "КЭШБЭК" })}</div>
  <div style="position:absolute;left:155px;top:330px">${IC.play(110)}</div>
  <div style="position:absolute;left:26px;bottom:34px;font:800 26px Manrope;color:#fff;opacity:.85">@max · 0:42</div></div>`;

const tgCard = (title, sub, lines) => `<div class="box" style="width:600px;background:#1f2b30;border-color:#2f4148">
  <div style="display:flex;align-items:center;gap:22px">${IC.tg(110)}<div><div class="lbl" style="font-size:44px;text-align:left">${title}</div><div class="lbl mut" style="font-size:30px;text-align:left;font-weight:700">${sub}</div></div></div>
  ${lines.map(l => `<div style="margin-top:22px;height:22px;border-radius:11px;background:rgba(255,255,255,.12);width:${l}%"></div>`).join("")}</div>`;

const EP = {
  lead: .25, tail: 1.8,
  scenes: [
    { line: "У Макса и Леры нет работы в банке.", say: "У Макса и Леры нет работы в банке.",
      els: [
        { id: "badge", w: 0, x: 930, y: 180, a: "pop", html: CH.owl({ w: 180 }), keep: true, z: 40 },
        { id: "bank", w: 0, x: 540, y: 440, a: "pop", html: IC.bank(300), outScene: 2 },
        { id: "max", w: 1, x: 300, y: 1090, a: "pop", html: CH.max({ w: 330 }), bob: 1, blink: 1, outScene: 4 },
        { id: "lera", w: 3, x: 780, y: 1090, a: "pop", html: CH.lera({ w: 330 }), bob: 1, blink: 1, outScene: 4 },
        { id: "nocross", w: 4, x: 690, y: 360, a: "pop", html: IC.cross(100) },
      ] },
    { line: `Но за прошлый месяц банки перевели им *87${NB}000* рублей на двоих.`, say: "Но за прошлый месяц банки перевели им восемьдесят семь тысяч рублей на двоих.",
      els: [
        ...[[470, 1200], [610, 1215], [540, 1170]].map(([x, y], k) => ({ w: 4, dl: k * .15, x: 540, y: 560, a: "pop", html: IC.coin(70), mv: [[5, x, y, 1]], mvd: .5, outScene: 2 })),
        { w: 5, x: 540, y: 1250, a: "pop", html: IC.cash(270), outScene: 2 },
        { w: 7, x: 540, y: 745, a: "count", html: cnt(170, "g", "≈ "), count: { from: 0, to: 87000, post: " ₽", d: 1 }, outScene: 1 },
      ] },
    { line: "Они ничего не продают и не берут кредиты. Так за что им *платят*?", say: "Они ничего не продают и не берут кредиты. Так за что им платят?",
      els: [
        { w: 8, x: 540, y: 660, a: "pop", html: big("?", 300, "y"), pulse: 1.2 },
      ] },
    { line: "Сейчас разберу их цифры *по шагам*.", say: "Сейчас разберу их цифры по шагам.",
      els: [
        ...[1, 2, 3].map((n, k) => ({ w: 3, dl: k * .25, x: 300 + k * 240, y: 640, a: "pop", html: `<div class="big" style="width:150px;height:150px;border-radius:50%;background:${k == 2 ? "#f5a524" : "#f4f4f2"};color:#1d2a2f;display:flex;align-items:center;justify-content:center;font-size:90px">${n}</div>` })),
        ...[0, 1].map(k => ({ w: 3, dl: .15 + k * .25, x: 420 + k * 240, y: 640, a: "fade", html: `<div style="width:60px;height:8px;border-radius:4px;background:rgba(244,244,242,.5)"></div>` })),
      ] },
    { line: "Банкам постоянно нужны *новые клиенты*.", say: "Банкам постоянно нужны новые клиенты.",
      els: [
        { w: 0, x: 540, y: 820, a: "pop", html: IC.bank(380), outScene: 1 },
        ...[[200, 560], [880, 560], [160, 900], [920, 900], [260, 1210], [820, 1210]].map(([x, y], k) => ({ w: 3, dl: k * .12, x, y, a: "pop", html: `<div style="position:relative">${CH.dude({ w: 110 })}<div class="big g" style="position:absolute;right:-34px;top:-20px;font-size:64px">+</div></div>` })),
      ] },
    { line: "На рекламу они тратят миллиарды, но выгоднее платить *за результат*.", say: "На рекламу они тратят миллиарды, но выгоднее платить за результат.",
      els: [
        { w: 0, x: 540, y: 560, a: "pop", html: IC.tv(300) },
        { w: 3, x: 540, y: 770, a: "up", html: lbl("миллиарды на рекламу", 50, "mut") },
        { w: 5, x: 700, y: 520, a: "pop", html: IC.cross(110) },
        { w: 7, x: 540, y: 1020, a: "pop", html: `<div class="box" style="display:flex;align-items:center;gap:26px;padding:30px 40px">${lbl("Оплата за клиента", 52)}${IC.check(80)}</div>` },
      ] },
    { line: "Человек сам оформил карту, а тот, кто его привёл, получает *вознаграждение*.", say: "Человек сам оформил карту, а тот, кто его привёл, получает вознаграждение.",
      els: [
        { w: 0, x: 200, y: 760, a: "pop", html: CH.dude({ w: 150 }) },
        { w: 2, a: "draw", html: arrowSVG(270, 760, 380, 760, 0) },
        { w: 2, x: 545, y: 760, a: "pop", html: IC.card({ c: DEB, w: 300, label: "КАРТА" }) },
        { w: 3, x: 670, y: 660, a: "pop", html: IC.check(80) },
        { w: 6, a: "draw", html: arrowSVG(560, 880, 800, 1050, -.25) },
        { w: 6, x: 860, y: 1180, a: "pop", html: CH.max({ w: 230 }), blink: 1 },
        { w: 9, x: 640, y: 1220, a: "pop", html: IC.cash(200) },
        { w: 10, x: 860, y: 920, a: "pop", html: lbl("партнёр", 40, "o") },
      ] },
    { line: `За дебетовую карту около *1${NB}500${NB}₽*. За кредитную до *4${NB}000${NB}₽*.`, say: "За дебетовую карту около полутора тысяч рублей. За кредитную до четырёх тысяч.",
      els: [
        { w: 0, x: 290, y: 700, a: "left", html: IC.card({ c: DEB, w: 400, label: "ДЕБЕТОВАЯ", kind: "MIR" }) },
        { w: 4, x: 290, y: 960, a: "count", html: cnt(110, "g", "≈ "), count: { from: 0, to: 1500, post: " ₽", d: .7 } },
        { w: 5, x: 790, y: 700, a: "right", html: IC.card({ c: ORANGE, w: 400, label: "КРЕДИТНАЯ", kind: "MIR" }) },
        { w: 7, x: 790, y: 960, a: "count", html: cnt(110, "g", "до "), count: { from: 0, to: 4000, post: " ₽", d: .7 } },
        { w: 2, x: 540, y: 1150, a: "fade", html: lbl("банк платит партнёру за клиента", 40, "mut") },
      ] },
    { line: "Макс зарегистрировался в *партнёрской программе* и получил свою ссылку.", say: "Макс зарегистрировался в партнёрской программе и получил свою ссылку.",
      els: [
        { w: 0, x: 270, y: 1110, a: "pop", html: CH.max({ w: 330, phone: 1 }), bob: 1, blink: 1, outScene: 2 },
        { w: 3, x: 640, y: 560, a: "pop", html: `<div class="box" style="width:560px;text-align:center"><div style="display:flex;justify-content:center">${IC.bank(150)}</div>${lbl("ПАРТНЁРСКАЯ<br>ПРОГРАММА", 50)}</div>` },
        { w: 6, a: "draw", html: arrowSVG(700, 780, 700, 880, 0) },
        { w: 7, x: 700, y: 960, a: "pop", html: chip(`${IC.link(56)}<span>ссылка Макса</span>`, 44), outScene: 2 },
      ] },
    { line: "Дальше нужен *трафик*: люди, которые и так ищут карту.", say: "Дальше нужен трафик: люди, которые и так ищут карту.",
      els: [
        { w: 2, x: 640, y: 520, a: "pop", html: big("ТРАФИК", 150, "o") },
        ...[0, 1, 2, 3, 4].map(k => ({ w: 3, dl: k * .14, x: 560 + k * 100, y: 1250, a: "up", html: CH.dude({ w: 80, c: k == 2 ? "#f5a524" : "#cfd6da" }) })),
        { w: 6, a: "draw", html: arrowSVG(760, 1180, 720, 1040, .15) },
      ] },
    { line: "Макс снимает короткие ролики о том, какую карту выбрать студенту. Ссылка в описании.", say: "Макс снимает короткие ролики о том, какую карту выбрать студенту. Ссылка — в описании.",
      els: [
        { w: 0, x: 540, y: 800, a: "up", html: phone, outScene: 1 },
        { w: 10, x: 540, y: 1270, a: "pop", html: chip(`${IC.link(50)}<span>ссылка в описании</span>`, 42, "background:#f5a524") },
      ] },
    { line: `Ролик набрал *50${NB}000* просмотров.`, say: "Ролик набрал пятьдесят тысяч просмотров.",
      els: [
        { w: 0, x: 540, y: 600, a: "pop", html: IC.eye(170) },
        { w: 1, x: 540, y: 800, a: "count", html: cnt(190, ""), count: { from: 0, to: 50000, d: 1 }, mv: [["s", 540, 470, .5, 1]], outScene: 3 },
        { w: 3, x: 540, y: 950, a: "up", html: lbl("просмотров", 50, "mut"), mv: [["s", 540, 550, .7, 1]], outScene: 3 },
      ] },
    { line: "По ссылке перешёл один процент, это *500* человек.", say: "По ссылке перешёл один процент — это пятьсот человек.",
      els: [
        { w: 0, a: "draw", html: arrowSVG(540, 600, 540, 700, 0), outScene: 2 },
        { w: 2, x: 690, y: 650, a: "pop", html: big("1%", 80, "o"), outScene: 2 },
        { w: 5, x: 540, y: 820, a: "count", html: cnt(150, ""), count: { from: 0, to: 500, d: .7 }, outScene: 2 },
        { w: 7, x: 540, y: 930, a: "up", html: lbl("переходов", 44, "mut"), outScene: 2 },
      ] },
    { line: "Карту оформили и активировали *30*.", say: "Карту оформили и активировали тридцать.",
      els: [
        { w: 0, a: "draw", html: arrowSVG(540, 975, 540, 1040, 0) },
        ...Array.from({ length: 30 }, (_, n) => { const c = n % 6, r = Math.floor(n / 6); return { w: 2, dl: (r * 6 + c) * .035, x: 200 + c * 136, y: 1110 + r * 82, a: "pop", dur: .3, html: mini(n % 3 == 2 ? ORANGE : DEB, 120) }; }),
      ] },
    { line: `30 на 1${NB}500, это *45${NB}000${NB}₽*.`, say: "Тридцать на полторы тысячи — это сорок пять тысяч рублей.",
      els: [
        { w: 0, x: 540, y: 620, a: "pop", html: big(`30 × 1${NB}500 ₽`, 120) },
        { w: 3, x: 540, y: 860, a: "count", html: cnt(180, "g", "= "), count: { from: 0, to: 45000, post: " ₽", d: .9 } },
        { w: 4, x: 540, y: 1180, a: "pop", html: IC.cash(300) },
      ] },
    { line: "Его подруга Лера ведёт Телеграм-канал про *кэшбэк*.", say: "Его подруга Лера ведёт Телеграм-канал про кэшбэк.",
      els: [
        { w: 1, x: 260, y: 1110, a: "pop", html: CH.lera({ w: 330, phone: 1 }), bob: 1, blink: 1, outScene: 5 },
        { w: 3, x: 640, y: 640, a: "pop", html: tgCard("Кэшбэк без воды", `8${NB}400 подписчиков`, [92, 70, 84]), outScene: 2 },
      ] },
    { line: "Через её ссылку за месяц оформили *12 кредиток*.", say: "Через её ссылку за месяц оформили двенадцать кредиток.",
      els: [
        { w: 1, x: 700, y: 960, a: "pop", html: chip(`${IC.link(50)}<span>ссылка Леры</span>`, 40) },
        ...Array.from({ length: 12 }, (_, n) => { const c = n % 4, r = Math.floor(n / 4); return { w: 5, dl: n * .05, x: 505 + c * 130, y: 1110 + r * 88, a: "pop", dur: .3, html: mini(ORANGE, 118) }; }),
      ] },
    { line: `12 на 3${NB}500, это ещё *42${NB}000${NB}₽*.`, say: "Двенадцать на три с половиной тысячи — это ещё сорок две тысячи.",
      els: [
        { w: 0, x: 680, y: 640, a: "pop", html: big(`12 × 3${NB}500 ₽`, 100) },
        { w: 4, x: 680, y: 840, a: "count", html: cnt(150, "g", "= "), count: { from: 0, to: 42000, post: " ₽", d: .9 } },
      ] },
    { line: "Никакой магии. Обычная *арифметика*.", say: "Никакой магии. Обычная арифметика.",
      els: [
        { w: 0, x: 540, y: 430, a: "pop", html: big(`45${NB}000 ₽`, 96), outScene: 1 },
        { w: 1, x: 540, y: 545, a: "pop", html: big(`+ 42${NB}000 ₽`, 96), outScene: 1 },
        { w: 2, x: 540, y: 625, a: "fade", html: `<div style="width:520px;height:8px;border-radius:4px;background:rgba(244,244,242,.6)"></div>`, outScene: 1 },
        { w: 2, x: 540, y: 750, a: "count", html: cnt(170, "g", "≈ "), count: { from: 45000, to: 87000, post: " ₽", d: .8 }, outScene: 1 },
        { w: 0, x: 790, y: 1110, a: "pop", html: CH.max({ w: 330 }), bob: 1, blink: 1, outScene: 2 },
      ] },
    { line: "Банк платит только за *настоящего клиента*, который сам выбрал карту.", say: "Банк платит только за настоящего клиента, который сам выбрал карту.",
      els: [
        { w: 3, x: 540, y: 640, a: "pop", html: `<div class="box" style="display:flex;align-items:center;gap:24px">${IC.check(76)}${lbl("реальный клиент", 46)}</div>` },
      ] },
    { line: "Это и есть *арбитраж трафика* на банки.", say: "Это и есть арбитраж трафика на банки.",
      els: [
        { w: 2, x: 540, y: 560, a: "pop", html: big("АРБИТРАЖ ТРАФИКА", 110, "o") },
        { w: 5, x: 540, y: 690, a: "pop", html: big("НА БАНКИ", 110) },
        ...[[CH.dude({ w: 90 }), 220], [`<div style="width:110px;height:110px;border-radius:50%;background:#f4f4f2;display:flex;align-items:center;justify-content:center">${IC.link(64)}</div>`, 430], [IC.bank(140), 650], [IC.coin(110), 860]]
          .map(([h, x], k) => ({ w: 0, dl: .3 + k * .3, x, y: 930, a: "pop", html: h })),
        ...[0, 1, 2].map(k => ({ w: 1, dl: .45 + k * .3, a: "draw", dur: .3, html: arrowSVG(285 + k * 215, 930, 360 + k * 215, 930, 0) })),
      ] },
    { line: "Где взять партнёрку и как найти первый трафик, разбираю на *бесплатном уроке*.", say: "Где взять партнёрку и как найти первый трафик — разбираю на бесплатном уроке.",
      els: [
        { w: 0, x: 540, y: 640, a: "pop", html: tgCard("Бесплатный урок", "арбитраж трафика на банки", []), outScene: 1 },
        { w: 1, x: 540, y: 880, a: "left", html: `<div style="display:flex;align-items:center;gap:20px;width:600px">${IC.check(60)}${lbl("где взять партнёрку", 44)}</div>`, outScene: 1 },
        { w: 5, x: 540, y: 980, a: "left", html: `<div style="display:flex;align-items:center;gap:20px;width:600px">${IC.check(60)}${lbl("где найти первый трафик", 44)}</div>`, outScene: 1 },
        { w: 9, x: 540, y: 1080, a: "left", html: `<div style="display:flex;align-items:center;gap:20px;width:600px">${IC.check(60)}${lbl("первые выплаты", 44)}</div>`, outScene: 1 },
      ] },
    { line: "Ссылка на Телеграм *в шапке профиля*.", say: "Ссылка на Телеграм — в шапке профиля.",
      els: [
        { w: 0, x: 540, y: 640, a: "pop", html: `<div class="box" style="width:700px;background:#1f2b30;border-color:#2f4148">
          <div style="display:flex;align-items:center;gap:28px"><div style="width:150px;height:150px;border-radius:50%;background:#33434a;border:5px solid #f5a524"></div>
          <div style="flex:1"><div style="height:30px;width:70%;border-radius:15px;background:rgba(255,255,255,.25)"></div><div style="height:22px;width:90%;margin-top:18px;border-radius:11px;background:rgba(255,255,255,.12)"></div><div style="height:22px;width:60%;margin-top:14px;border-radius:11px;background:rgba(255,255,255,.12)"></div></div></div>
          <div style="margin-top:30px;display:flex;align-items:center;gap:16px;padding:16px 22px;border-radius:18px;border:4px solid #f5a524;background:rgba(245,165,36,.12)">${IC.tg(60)}<span class="lbl o" style="font-size:40px">бесплатный урок →</span></div></div>`, keep: true },
        { w: 2, x: 540, y: 1030, a: "pop", html: `<div class="lbl" style="font-size:48px;padding:28px 70px;border-radius:22px;background:#2aa3e0;color:#fff">Подписаться</div>`, outw: 5 },
        { w: 5, dl: .2, x: 540, y: 1030, a: "pop", dur: .3, html: `<div class="lbl" style="font-size:48px;padding:28px 70px;border-radius:22px;background:#3a474d;color:#f4f4f2">Вы подписаны ✓</div>`, keep: true },
        { w: 2, x: 820, y: 1260, a: "fade", html: IC.cursor(80), mv: [[4, 640, 1070, 1]], keep: true },
      ] },
  ],
};
