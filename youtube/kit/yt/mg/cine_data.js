// Демо «Кино-титры» на хуке ролика №3 (владелец: «киношный моушен с текстами, который живёт и двигается»). Цифры — из сценария:
// курьер 350–500 ₽/ч (hh.ru для Retail.ru, 20.04.2026), бонус новичку до 2 000 ₽ — пример.
window.SEGS = [{ mode: "cine", t0: 0, t1: 20, data: { cards: [
  { t0: 0, t1: 4.1, drift: [-50, 0], echo: [{ text: "ДОЖДЬ · СНЕГ · РЮКЗАК · ДОЖДЬ · СНЕГ", y: 760, speed: 50 }], lines: [
    { text: "ПОДРАБОТКА · МОСКВА · 2026", font: "caps", size: 30, y: 300, color: "#b9c3dc", ls: ".4", stagger: .02 },
    { text: "Курьер пешком", font: "big", size: 120, y: 390, d: .3 },
    { text: "350–500 ₽ в час", font: "serif", size: 116, y: 570, color: "#ffd18a", d: .9 }] },
  { t0: 3.9, t1: 7.7, drift: [50, 0], echo: [{ text: "СМЕНА · СМЕНА · СМЕНА · СМЕНА", y: 150, speed: -45, x: -600 }], lines: [
    { text: "2–3 часа", font: "big", size: 190, y: 360 },
    { text: "ЧТОБЫ ЗАРАБОТАТЬ ТЫСЯЧУ", font: "caps", size: 44, y: 620, ls: ".25", color: "#b9c3dc", d: .8, stagger: .025 }] },
  { t0: 7.5, t1: 11.3, drift: [0, -24], sweep: 1.5, lines: [
    { text: "А банк", font: "serif", size: 150, y: 330 },
    { text: "платит сам", font: "big", size: 176, y: 520, color: "#2ee07a", glow: "rgba(46,224,122,.45)", d: .6 }] },
  { t0: 11.1, t1: 15.3, drift: [0, 0], flare: 1.6, flareY: 470, lines: [
    { text: "+0 ₽", font: "num", size: 260, y: 330, glow: "rgba(46,224,122,.55)" },
    { text: "ЗА ОДНУ ПОКУПКУ · ПРИМЕР", font: "caps", size: 36, y: 640, ls: ".3", color: "#b9c3dc", d: 1.2, stagger: .02 }],
    count: { line: 0, from: 0, to: 2000, t0: .4, t1: 1.6, prefix: "+" } },
  { t0: 15.1, t1: 20, drift: [0, 0], flare: 2.2, flareY: 545, sweep: 2.6, lines: [
    { text: "ХВАТИТ ИСКАТЬ ПОДРАБОТКУ", font: "caps", size: 34, y: 290, ls: ".4", color: "#b9c3dc", stagger: .02 },
    { text: "5 способов,", font: "big", size: 150, y: 370, d: .4 },
    { text: "где банк платит тебе", font: "serif", size: 124, y: 560, d: 1.0, color: "#ffd18a" }] }] } }];
window.TLX = { music: [{ t: 0, part: "intro" }, { t: 11.1, part: "main" }], bpm: 90 };
