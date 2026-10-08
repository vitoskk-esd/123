// node shot11.js -> thumb11_a|b|c.png
const { chromium } = require("playwright"); const path = require("path");
(async () => { const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1280, height: 720 } });
  for (const v of (process.env.V || "a,b,c").split(",")) { await pg.goto("file://" + path.join(__dirname, "thumb11.html") + "?v=" + v);
    await pg.evaluate(() => document.fonts.ready); await pg.waitForTimeout(300); await pg.screenshot({ path: path.join(__dirname, `thumb11_${v}.png`) }); }
  await b.close(); })();
