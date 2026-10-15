// Итоговая обложка (владелец 15.10: «на фото с бомбой текст как на штампе ЗАКРЫТО: Разминировано, проценты 0 рублей»)
// NODE_PATH=$(npm root -g) node tg-posts/credit-close/shot_final.js → cover.png
const { chromium } = require("playwright"), path = require("path");
(async () => { const b = await chromium.launch({ args: ["--allow-file-access-from-files"] }), pg = await b.newPage({ viewport: { width: 1280, height: 1280 } });
  await pg.goto("file://" + path.join(__dirname, "cover_alt.html") + "?v=5"); await pg.waitForFunction(() => window.__ready === true);
  await pg.waitForTimeout(300); await pg.screenshot({ path: path.join(__dirname, "cover.png") }); await b.close(); })();
