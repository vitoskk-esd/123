// Рендер HTML-макетов в JPG для Авито (1200×900 → 2400×1800).
// Запуск: NODE_PATH="$(npm root -g)" node avito/tester-remote/render.cjs [cover details photo]
const path = require("path");
const fs = require("fs");
const { chromium } = require("playwright");

const dir = __dirname;
const outDir = path.join(dir, "out");
// [ключ для фильтра, HTML-файл, параметры, имя результата]
const pages = [
  ["cover", "cover.html", "", "1-oblozhka"],
  ["details", "details.html", "", "2-podrobnosti"],
  ["photo", "photo.html", "?img=photos/man.jpg&pos=50%25", "3-foto-paren"],
  ["photo", "photo.html", "?img=photos/woman.jpg&pos=62%25", "3-foto-devushka"],
];
const only = process.argv.slice(2);

(async () => {
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch(
    fs.existsSync("/opt/pw-browsers/chromium") ? { executablePath: "/opt/pw-browsers/chromium" } : {}
  );
  const page = await browser.newPage({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 2 });

  for (const [name, file, query, outName] of pages) {
    if (only.length && !only.includes(name)) continue;
    await page.goto("file://" + path.join(dir, file) + query, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    // Заголовочный шрифт есть на всех картинках; остальные — только там, где они используются.
    const missing = await page.evaluate(() => [
      ...(document.fonts.check("800 40px Unbounded", "Тест") ? [] : ["Unbounded"]),
      ...[...document.fonts].filter((f) => f.status === "error").map((f) => f.family),
    ]);
    if (missing.length) console.warn(`[${name}] шрифты не загрузились: ${missing.join(", ")}`);
    const out = path.join(outDir, outName + ".jpg");
    await page.screenshot({ path: out, type: "jpeg", quality: 92 });
    console.log("saved", path.relative(process.cwd(), out));
  }
  await browser.close();
})();
