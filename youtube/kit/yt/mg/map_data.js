// Демо «Карта» под фразу ролика №3 «курьер пешком зарабатывает 350–500 ₽ в час» (hh.ru для Retail.ru, 20.04.2026).
// Три доставки за ускоренный час: кафе → дом ×3, суммы за заказы — пример (в HUD подписано).
// v2: вид «навигатор» (по умолчанию) и вид сверху (?view=top).
window.SEGS = [{ mode: "map", t0: 0, t1: 18, data: { view: typeof location !== "undefined" && /view=top/.test(location.search) ? "top" : "nav",
  nx: 22, ny: 19, park: [[12, 8], [12, 9], [13, 8], [13, 9], [6, 10]], river: 13, route: [[6, 9], [8, 9, "pick"], [8, 13, "drop"], [11, 13, "pick"], [13, 10, "drop"], [15, 10, "pick"], [15, 8, "drop"]],
  speed: 600, pause: 1.1, t0: .6, earn: [120, 110, 120], clock: { from: 0, to: 60 }, clockT: .6, rain: true, zoom: 1.25, zoomOutT: 15.3,
  lines: [["Курьер пешком", "a", .4], ["350–500 ₽ в час", "b", 1.0]], capOut: 5.2 } }];
