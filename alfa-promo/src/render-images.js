// Рендер статичных креативов в PNG: node render-images.js
const { chromium } = require("playwright");
const path = require("path");
const jobs = [
  { file: "red-post.html", out: "post-red-1080x1080.png", w: 1080, h: 1080 },
  { file: "red-stories.html", out: "stories-red-1080x1920.png", w: 1080, h: 1920 },
  { file: "dark-post.html", out: "post-dark-1080x1080.png", w: 1080, h: 1080 },
  { file: "dark-stories.html", out: "stories-dark-1080x1920.png", w: 1080, h: 1920 },
  // Переписка: берём последний кадр видео, высота задаёт раскладку
  { file: "chat-video.html", out: "post-chat-1080x1080.png", w: 1080, h: 1080, lastFrame: true },
  { file: "chat-video.html", out: "stories-chat-1080x1920.png", w: 1080, h: 1920, lastFrame: true },
];
(async () => {
  const browser = await chromium.launch();
  for (const j of jobs) {
    const page = await browser.newPage({ viewport: { width: j.w, height: j.h } });
    await page.goto("file://" + path.join(__dirname, j.file));
    if (j.lastFrame) await page.evaluate(() => window.render(window.DURATION));
    await page.screenshot({ path: path.join(__dirname, "..", "output", j.out) });
    await page.close();
    console.log("ok", j.out);
  }
  await browser.close();
})();
