/* Рилс 18 «Твой кэшбэк сгорает» — раскадровка. Факты: ролик №6, script.md → «Проверка фактов»
   (бонусы у одного из банков действуют 12 месяцев; кэшбэк не начисляется за СБП/QR, переводы своих средств, наличные, связь — у части банков;
   у многих есть потолок кэшбэка в месяц). Банки не называем. */
const FIRECOIN = (K, x, y, s = 1, t = "₽") => K.div(x, y, `width:${120 * s}px;height:${190 * s}px`,
  `<div class="a" style="left:${10 * s}px;top:0;width:${100 * s}px;height:${130 * s}px;border-radius:50% 50% 45% 45%/60% 60% 40% 40%;background:radial-gradient(circle at 50% 75%,#fff3a0,#ffb02e 45%,#ff5a2e 75%,rgba(255,60,30,0) 76%);filter:blur(${1.5 * s}px)"></div>` +
  `<div class="a" style="left:0;top:${70 * s}px;width:${120 * s}px;height:${120 * s}px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff6c0,#f0b72f 55%,#a86d00);border:${6 * s}px solid ${K.OL};display:flex;align-items:center;justify-content:center;font:900 ${54 * s}px Unb;color:#7a4a00">${t}</div>`);
var STORY = { title: "Твой кэшбэк сгорает", frames: [
  { time: "0:00", voice: "Твой кэшбэк может сгореть, и банк тебе об этом не напомнит.", cap: "банк *не напомнит*",
    note: "Хук: магазин, вокруг Арбузова горят монетки-баллы, заголовок «ТВОЙ КЭШБЭК СГОРАЕТ».",
    build: (K) => K.BG.store() + K.shadow(540, 1330, 280) + K.hero(150, 580, 780, { mood: "shock", arm: "shrug", look: 0 }) +
      FIRECOIN(K, 80, 640, 1.1) + FIRECOIN(K, 860, 600, 1) + FIRECOIN(K, 820, 980, .8) + K.title(250, [["ТВОЙ КЭШБЭК"], ["СГОРАЕТ", "#ff4a4a", "#5a0b0b"]], 140) },
  { time: "0:04", big: "12 месяцев", voice: "У многих банков баллы живут ограниченное время, например двенадцать месяцев.", cap: "живут *12 месяцев*",
    note: "Крупно: приложение банка — «Баллы: 3 450», строка «сгорят 31.10: 1 200» красным.",
    build: (K) => K.BG.desk() + K.phone(250, 220, -4, K.appHead("Мои баллы", "#7a3cff", "кэшбэк баллами") +
      `<div class="a nw" style="left:0;right:0;top:270px;text-align:center;font:900 110px Unb;color:${K.OL}">3 450</div><div class="a nw" style="left:0;right:0;top:400px;text-align:center;font:700 30px I;color:#6b7280">баллов на счёте</div>` +
      K.row(480, "Сгорят 31.10", "−1 200", "#e2283f", true) + K.row(590, "Срок жизни", "12 мес"), 1) + K.stamp(560, 1060, -8, "СРОК ГОДНОСТИ", "#e2283f", 54) },
  { time: "0:09", big: "−1 200 баллов", voice: "Не потратил вовремя — они просто исчезают.", cap: "просто *исчезают*",
    note: "Крупно: монетки-баллы горят и рассыпаются в дым, плашка «−1 200 баллов».",
    build: (K) => K.BG.burst("#ff8a5b", "#c8142b", "#ffe066") + FIRECOIN(K, 160, 360, 2) + FIRECOIN(K, 560, 300, 1.6) + FIRECOIN(K, 640, 700, 1.3) + FIRECOIN(K, 240, 820, 1) +
      K.pill(250, 1080, "−1 200 БАЛЛОВ", "#1e1717", "#ff5a5a", 64, -3) },
  { time: "0:12", voice: "Второе: оплата по QR и через систему быстрых платежей часто идёт без кэшбэка.", cap: "по QR — *без кэшбэка*",
    note: "Касса: терминал с QR, штамп «БЕЗ КЭШБЭКА», Арбузов разводит руками.",
    build: (K) => K.BG.store() + K.shadow(260, 1240, 200) + K.hero(-80, 640, 640, { mood: "shock", arm: "shrug", look: 18 }) +
      K.div(620, 560, `width:330px;height:430px;border-radius:30px;background:#2b2b35;border:7px solid ${K.OL};box-shadow:0 26px 40px rgba(0,0,0,.4)`,
        `<div class="a" style="left:26px;right:26px;top:26px;height:250px;border-radius:16px;background:#fff;display:flex;align-items:center;justify-content:center"><div style="width:190px;height:190px;background:repeating-conic-gradient(${K.OL} 0 25%,#fff 0 50%) 0 0/38px 38px"></div></div><div class="a nw" style="left:0;right:0;bottom:50px;text-align:center;font:700 52px O;color:#9be26b">ОПЛАТА ПО QR</div>`) +
      K.stamp(540, 1060, -8, "БЕЗ КЭШБЭКА", "#e2283f", 62) },
  { time: "0:18", big: "кэшбэк 0 ₽", voice: "На кассе это выглядит как обычная покупка, а кэшбэка нет.", cap: "а кэшбэка *нет*",
    note: "Крупно: чек «Оплата по QR 2 300 ₽ · Кэшбэк 0 ₽» — ноль выделен красным.",
    build: (K) => K.BG.desk("#8a5a36") + K.receipt(140, 260, -4, [["Продукты", "2 300 ₽"], ["Способ: QR / СБП", ""], ["Кэшбэк", "0 ₽", "#ffd4d4"]], "2 300 ₽", { title: "КАССОВЫЙ ЧЕК", s: 1.5 }) },
  { time: "0:22", voice: "Переводы, наличные и оплата связи у многих банков тоже без кэшбэка.", cap: "*тоже* без кэшбэка",
    note: "Крупно: список — переводы ✕, наличные ✕, связь ✕, покупка картой ✓.",
    build: (K) => K.BG.burst("#ffd27a", "#f08a3c", "#fff") + K.checklist(110, 280, 860, [["Переводы", false], ["Снятие наличных", false], ["Оплата связи", false], ["Покупка картой", true]]) +
      K.hero(620, 880, 440, { mood: "smirk", arm: "point", look: -20 }) },
  { time: "0:27", big: "ЕСТЬ ПОТОЛОК", voice: "И у кэшбэка обычно есть потолок в месяц: сверх него ничего не начислят.", cap: "есть *потолок* в месяц",
    note: "Крупно: приложение — шкала «Кэшбэк в октябре: 3 000 из 3 000 ₽», штамп «ЛИМИТ».",
    build: (K) => K.BG.desk() + K.phone(250, 220, 3, K.appHead("Кэшбэк", "#2fa84f", "октябрь") +
      `<div class="a" style="left:30px;right:30px;top:290px;font:700 30px I;color:#6b7280">Начислено в этом месяце</div><div class="a nw" style="left:30px;top:340px;font:900 76px Unb;color:${K.OL}">3 000 ₽</div>
       <div class="a" style="left:30px;right:30px;top:470px;height:46px;border-radius:23px;background:#e3e7ee;border:4px solid ${K.OL};overflow:hidden"><div style="width:100%;height:100%;background:repeating-linear-gradient(45deg,#2fa84f 0 20px,#47c46a 20px 40px)"></div></div>
       <div class="a nw" style="left:30px;top:540px;font:700 30px I;color:#e2283f">лимит 3 000 ₽ — дальше 0</div>`, 1) + K.stamp(600, 1110, -8, "ПОТОЛОК", "#e2283f", 66) },
  { time: "0:32", voice: "Открой приложение и проверь, сколько баллов у тебя сгорит. Подпишись на Арбузова.", cap: "проверь, *сколько сгорит*",
    note: "Финал: Арбузов машет, заголовок «ПРОВЕРЬ СВОИ БАЛЛЫ», кнопка «Подписаться».",
    build: (K) => K.BG.burst("#ff8a5b", "#e2283f", "#ffe066") + K.shadow(540, 1300, 280) + K.hero(160, 600, 760, { mood: "smirk", arm: "wave" }) +
      K.title(250, [["ПРОВЕРЬ"], ["СВОИ БАЛЛЫ", "#ffe066"]], 140) + K.pill(560, 1110, "+ ПОДПИСАТЬСЯ", "#fff", "#e2283f", 48, -6) },
] };
