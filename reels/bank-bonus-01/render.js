// Рендер reel.html в кадры и в видео.
// node render.js            -> out/frames.mp4 (без звука)
// node render.js --stills   -> out/still_*.jpg (контрольные кадры)
const { chromium } = require("playwright");
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");
const TL = require("./timeline.js");

(async () => {
  const stills = process.argv.includes("--stills");
  fs.mkdirSync(path.join(__dirname, "out"), { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  await page.goto("file://" + path.join(__dirname, "reel.html"));
  await page.evaluate(() => document.fonts.ready);

  if (stills) {
    for (const t of [0.1, 1.9, 4.2, 7.2, 11.6, 15.5, 17.6, 22.8, 26.8]) {
      await page.evaluate(t => window.renderAt(t), t);
      await page.screenshot({ path: path.join(__dirname, "out", `still_${t}.jpg`), type: "jpeg", quality: 80 });
    }
    await browser.close();
    return;
  }

  const ff = spawn("ffmpeg", ["-y", "-f", "image2pipe", "-framerate", String(TL.fps), "-i", "-",
    "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "18", "-preset", "medium",
    path.join(__dirname, "out", "frames.mp4")], { stdio: ["pipe", "inherit", "inherit"] });
  const n = Math.round(TL.duration * TL.fps);
  for (let i = 0; i < n; i++) {
    await page.evaluate(t => window.renderAt(t), i / TL.fps);
    const buf = await page.screenshot({ type: "jpeg", quality: 95 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once("drain", r));
    if (i % 60 === 0) process.stderr.write(`frame ${i}/${n}\n`);
  }
  ff.stdin.end();
  await new Promise(r => ff.on("close", r));
  await browser.close();
})();
