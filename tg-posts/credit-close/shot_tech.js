// Обложки «tech» на рисунке №2: NODE_PATH=$(npm root -g) node tg-posts/credit-close/shot_tech.js → cover_tech_v1..3.png
const { chromium } = require("playwright"), path = require("path");
(async () => { const b = await chromium.launch({ args: ["--allow-file-access-from-files"] }), pg = await b.newPage({ viewport: { width: 1280, height: 1280 } });
  for (const v of ["1", "2", "3"]) { await pg.goto("file://" + path.join(__dirname, "cover_tech.html") + "?v=" + v); await pg.waitForFunction(() => window.__ready === true);
    await pg.screenshot({ path: path.join(__dirname, `cover_tech_v${v}.png`) }); }
  await b.close(); })();
