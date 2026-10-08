// node shotalt.js -> thumbalt_f..i.png
const { chromium } = require("playwright"); const path = require("path");
(async () => { const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1280, height: 720 } });
  for (const v of (process.env.V || "f,g,h,i").split(",")) { await pg.goto("file://" + path.join(__dirname, "thumb_alt.html") + "?v=" + v);
    await pg.evaluate(() => document.fonts.ready); await pg.waitForTimeout(300); await pg.screenshot({ path: path.join(__dirname, `thumbalt_${v}.png`) }); }
  await b.close(); })();
