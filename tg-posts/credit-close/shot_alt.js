// Другие форматы заголовка на рисунке №2: NODE_PATH=$(npm root -g) node tg-posts/credit-close/shot_alt.js → cover_alt_v1..4.png
const { chromium } = require("playwright"), path = require("path");
(async () => { const b = await chromium.launch({ args: ["--allow-file-access-from-files"] }), pg = await b.newPage({ viewport: { width: 1280, height: 1280 } });
  for (const v of ["1", "2", "3", "4"]) { await pg.goto("file://" + path.join(__dirname, "cover_alt.html") + "?v=" + v); await pg.waitForFunction(() => window.__ready === true);
    await pg.screenshot({ path: path.join(__dirname, `cover_alt_v${v}.png`) }); }
  await b.close(); })();
