// Таймлайн рилса #5 «Категории кэшбэка» (без голоса: текст + музыка + SFX).
// Используется и в reel.html (картинка), и в audio.js (музыка + SFX).
const CATS = [
  { e: "🐄", name: "Ветклиники для коров", pct: "7%", re: "у меня даже кота нет" },
  { e: "🛥️", name: "Аренда яхт", pct: "10%", re: "ну наконец-то" },
  { e: "🚜", name: "Запчасти для тракторов", pct: "15%", re: "как раз сезон" },
  { e: "🎻", name: "Ремонт арф", pct: "8%", re: "жизненно" },
  { e: "🐪", name: "Покупка верблюда", pct: "20%", re: "давно присматривался" },
  { e: "🎭", name: "Кукольный театр", pct: "5%", re: "каждые выходные хожу" },
  { e: "🐩", name: "Стрижка пуделей", pct: "12%", re: "у соседа есть пудель" },
];
const PUNCH = { e: "🛒", name: "Продукты", pct: "0,01%", re: "…ну спасибо" };

const HOOK = 1.3, STEP = 1.15;
const catStart = i => HOOK + i * STEP;
const PUNCH_AT = catStart(CATS.length);   // 9.35
const TWIST_AT = PUNCH_AT + 2.25;         // 11.6
const CTA_AT = TWIST_AT + 1.4;            // 13.0
const DURATION = 17.0;

const TIMELINE = {
  duration: DURATION,
  fps: 30,
  cats: CATS, punch: PUNCH,
  HOOK, STEP, catStart, PUNCH_AT, TWIST_AT, CTA_AT,
  sfx: {
    swipe: CATS.map((_, i) => catStart(i)),
    impact: [PUNCH_AT, TWIST_AT],
    glitch: [PUNCH_AT + .05],
    ding: [CTA_AT + .5],
  },
};
if (typeof module !== "undefined") module.exports = TIMELINE;
