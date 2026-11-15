// node shoot.js board.html 9 out_dir — скриншоты слайдов раскадровки 1080×1350
const { chromium } = require("playwright"); const path = require("path"); const fs = require("fs");
const [html, count, out] = process.argv.slice(2);
(async () => {
  fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  for (let i = 1; i <= +count; i++) {
    await pg.goto("file://" + path.resolve(html) + "?n=" + i);
    await pg.waitForFunction(() => window.READY === true); await pg.evaluate(() => document.fonts.ready);
    await pg.screenshot({ path: `${out}/slide_${String(i).padStart(2, "0")}.jpg`, type: "jpeg", quality: 90 });
  }
  await b.close(); console.log("ok");
})();
