/* Рилс 19 «Бонус не пришёл? Банк обязан ответить за 15 дней» (тема 5, одобрена владельцем 14.10 взамен «Деньги спят»).
   Факты: ролик №6, script.md → «Проверка фактов» (бонус — в течение 60 дней; СБП/QR не считаются покупкой в акции у части банков;
   банк отвечает на обращение за 15 рабочих дней; жалоба в ЦБ — через интернет-приёмную, cbr.ru). Банки не называем. */
var STORY = { title: "Бонус не пришёл", frames: [
  { time: "0:00", voice: "Всё выполнил, а бонус от банка так и не пришёл? Не спеши ругаться.", cap: "бонус *не пришёл?*",
    note: "Хук: Арбузов в шоке смотрит в телефон, на экране «Бонус: 0 ₽», заголовок «БОНУС НЕ ПРИШЁЛ?».",
    build: (K) => K.BG.kitchen() + K.shadow(540, 1330, 280) + K.hero(150, 580, 780, { mood: "shock", arm: "phone", look: 10 }) +
      K.phone(690, 640, 10, K.lock(K.push("Банк", "Бонус: 0 ₽", "акция для новых клиентов", 380, "#e2283f")), .5, false) +
      K.title(250, [["БОНУС"], ["НЕ ПРИШЁЛ?", "#ff4a4a", "#5a0b0b"]], 150) },
  { time: "0:05", voice: "Сначала проверь сроки: бонус обычно приходит в течение шестидесяти дней.", cap: "до *60 дней*",
    note: "Крупно: календарь, отсчёт дней с покупки, песочные часы; плашка «ЖДИ ДО 60 ДНЕЙ».",
    build: (K) => K.BG.burst("#ffd27a", "#f08a3c", "#fff") + K.calendar(150, 260, -3, "НОЯБРЬ", "2026", { 3: "o", 4: "x", 5: "x", 6: "x", 7: "x", 10: "x", 11: "x", 12: "x" }, 1, 6, 30) +
      K.hourglass(760, 860, .55, .6) + K.pill(170, 1030, "ЖДИ ДО 60 ДНЕЙ", "#1e1717", "#ffe066", 56, -2) },
  { time: "0:10", voice: "Потом условия: покупки по QR и переводы часто не засчитываются.", cap: "QR и переводы — *не в счёт*",
    note: "Крупно: чек-лист условий акции: покупки картой ✓, по QR ✕, переводы ✕.",
    build: (K) => K.BG.store() + K.checklist(110, 280, 860, [["Покупки картой", true], ["Оплата по QR", false], ["Переводы", false]]) + K.hero(600, 760, 480, { mood: "smirk", arm: "point", look: -20 }) },
  { time: "0:14", voice: "Если всё честно выполнено — пиши официальное обращение в приложении или на сайте банка.", cap: "пиши *официальное обращение*",
    note: "Крупно: телефон, форма «Обращение»: тема «Не начислен бонус», кнопка «Отправить».",
    build: (K) => K.BG.desk() + K.phone(250, 220, -3, K.appHead("Обращение", "#2f5bea", "в банк") +
      `<div class="a" style="left:22px;right:22px;top:270px;padding:22px;border-radius:20px;background:#fff;border:4px solid #c9d3e3;font:700 26px/1.35 I;color:#6b7280">Тема<div style="font:700 32px I;color:${K.OL}">Не начислен бонус за акцию</div></div>
       <div class="a" style="left:22px;right:22px;top:430px;height:160px;padding:22px;border-radius:20px;background:#fff;border:4px solid #c9d3e3;font:700 26px/1.35 I;color:#6b7280">Текст<div style="font:700 28px/1.3 I;color:${K.OL}">Условия выполнены, бонус не пришёл…</div></div>
       <div class="a" style="left:22px;right:22px;top:630px;padding:24px;border-radius:24px;background:#2f5bea;color:#fff;text-align:center;font:900 34px Unb">ОТПРАВИТЬ</div>`, 1) },
  { time: "0:20", voice: "Опиши акцию, даты покупок и приложи скриншоты.", cap: "даты и *скриншоты*",
    note: "Крупно: обращение на бумаге — акция, даты покупок (выделены), скрепкой приколоты скриншоты.",
    build: (K) => K.BG.desk("#8a5a36") + K.paper(110, 280, 860, -3, "ОБРАЩЕНИЕ", [["Акция: бонус новому клиенту", 0], ["Покупки картой: 03.11, 15.11", true], ["Сумма покупок: 5 200 ₽", true], ["Скриншоты условий — во вложении", 0]], { fs: 40, ts: 60 }) +
      K.div(620, 900, `width:260px;height:400px;transform:rotate(8deg);border-radius:24px;background:#eef3fb;border:6px solid ${K.OL};box-shadow:0 20px 30px rgba(0,0,0,.35)`, `<div class="a" style="left:20px;right:20px;top:40px;height:60px;border-radius:10px;background:#2fa84f"></div><div class="a" style="left:20px;right:20px;top:120px;height:30px;border-radius:8px;background:#c9d3e3"></div><div class="a" style="left:20px;right:60px;top:170px;height:30px;border-radius:8px;background:#c9d3e3"></div>`) +
      K.div(560, 860, `width:60px;height:150px;border:10px solid #9aa6b8;border-radius:30px;transform:rotate(8deg)`) },
  { time: "0:24", voice: "Банк обязан ответить на обращение в течение пятнадцати рабочих дней.", cap: "ответ за *15 рабочих дней*",
    note: "Крупно: календарь, 15 рабочих дней отмечены, штамп «ОБЯЗАН ОТВЕТИТЬ».",
    build: (K) => K.BG.burst("#9be26b", "#2f8a3c", "#fff") + K.calendar(150, 260, 3, "НОЯБРЬ", "2026", { 20: "o", 23: "x", 24: "x", 25: "x", 26: "x", 27: "x", 30: "x" }, 1, 6, 30) +
      K.stamp(140, 1020, -6, "15 РАБОЧИХ ДНЕЙ", "#2f8a3c", 66) },
  { time: "0:29", voice: "Нет ответа или отказали без причины — жалуйся в Банк России через интернет-приёмную.", cap: "жалоба в *Банк России*",
    note: "Банк России: жалоба через интернет-приёмную — экран формы, Арбузов решительно показывает.",
    build: (K) => K.BG.bank() + K.phone(80, 220, -4, K.appHead("Жалоба в ЦБ", "#1e3a5f", "интернет-приёмная Банка России") + K.row(280, "Тип", "Жалоба") + K.row(390, "На кого", "Банк") + K.row(500, "Суть", "не начислен бонус") +
      `<div class="a" style="left:22px;right:22px;top:640px;padding:24px;border-radius:24px;background:#1e3a5f;color:#fff;text-align:center;font:900 34px Unb">ОТПРАВИТЬ</div>`, .9) +
      K.hero(600, 760, 480, { mood: "smirk", arm: "point", look: -20 }) },
  { time: "0:36", voice: "Сохрани, пригодится, и подпишись на Арбузова.", cap: "*сохрани*, пригодится",
    note: "Финал: Арбузов машет, кнопки «Сохранить» и «Подписаться».",
    build: (K) => K.BG.burst("#ff8a5b", "#e2283f", "#ffe066") + K.shadow(540, 1300, 280) + K.hero(160, 600, 760, { mood: "smirk", arm: "wave" }) +
      K.title(250, [["ЗАБЕРИ"], ["СВОЙ БОНУС", "#ffe066"]], 140) + K.pill(90, 1110, "🔖 СОХРАНИТЬ", "#fff", "#1e1717", 48, 4) + K.pill(560, 1110, "+ ПОДПИСАТЬСЯ", "#fff", "#e2283f", 48, -6) },
] };
