// Обложки v2: node tg-posts/credit-grace/shot_fun.js → cover_fun_v1..3.png
const { chromium } = require("playwright"), path = require("path");
(async () => { const b = await chromium.launch({ args: ["--allow-file-access-from-files"] }), pg = await b.newPage({ viewport: { width: 1280, height: 1280 } });
  for (const v of ["1", "2", "3"]) { await pg.goto("file://" + path.join(__dirname, "cover_fun.html") + "?v=" + v); await pg.waitForFunction(() => window.__ready === true);
    await pg.screenshot({ path: path.join(__dirname, `cover_fun_v${v}.png`) }); }
  await b.close(); })();
