// Рендер статичных креативов в PNG: node render-images.js
const { chromium } = require("playwright");
const path = require("path");
const jobs = [
  { file: "post.html", out: "post-1080x1080.png", w: 1080, h: 1080 },
  { file: "stories.html", out: "stories-1080x1920.png", w: 1080, h: 1920 },
];
(async () => {
  const browser = await chromium.launch();
  for (const j of jobs) {
    const page = await browser.newPage({ viewport: { width: j.w, height: j.h } });
    await page.goto("file://" + path.join(__dirname, j.file));
    await page.screenshot({ path: path.join(__dirname, "..", "output", j.out) });
    await page.close();
    console.log("ok", j.out);
  }
  await browser.close();
})();
