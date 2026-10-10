// node shot.js [сумма] -> ad_v1.png, ad_v2.png, ad_v3.png (1080×1350)
const { chromium } = require("playwright"), path = require("path");
(async () => {
  const sum = encodeURIComponent(process.argv[2] || "1 000");
  const b = await chromium.launch(), pg = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  for (const v of ["1", "2", "3"]) {
    await pg.goto("file://" + path.join(__dirname, "ad.html") + `?v=${v}&sum=${sum}`);
    await pg.evaluate(() => document.fonts.ready);
    await pg.screenshot({ path: path.join(__dirname, `ad_v${v}.png`) });
  }
  await b.close();
})();
