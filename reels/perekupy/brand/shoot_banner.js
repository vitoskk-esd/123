// node shoot_banner.js → youtube_banner.png (2560×1440) и проверка безопасной зоны youtube_banner_guide.jpg
const { chromium } = require("playwright"); const path = require("path");
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 2560, height: 1440 } });
  for (const [q, out, type] of [["", "youtube_banner.png", "png"], ["?guide", "youtube_banner_guide.jpg", "jpeg"]]) {
    await p.goto("file://" + path.resolve("youtube_banner.html") + q); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(300);
    await p.screenshot({ path: out, type, ...(type === "jpeg" ? { quality: 85 } : {}) });
  }
  await b.close(); console.log("ok");
})();
