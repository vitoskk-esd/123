// Рендер обложек: node shot.js -> cover_v1.png, cover_v2.png
const { chromium } = require("playwright");
const path = require("path");
(async () => {
  const b = await chromium.launch({ executablePath: process.env.PW_CHROMIUM || undefined });
  const pg = await b.newPage({ viewport: { width: 1280, height: 1280 } });
  for (const v of ["1", "2"]) {
    await pg.goto("file://" + path.join(__dirname, "cover.html") + "?v=" + v);
    await pg.evaluate(() => document.fonts.ready);
    await pg.screenshot({ path: path.join(__dirname, `cover_v${v}.png`) });
  }
  await b.close();
})();
