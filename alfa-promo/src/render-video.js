// Покадровый рендер video.html в MP4: node render-video.js
const { chromium } = require("playwright");
const { execFileSync } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const FPS = 30;
const OUT = path.join(__dirname, "..", "output", "video-1080x1920.mp4");

(async () => {
  const frames = fs.mkdtempSync(path.join(os.tmpdir(), "frames-"));
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  await page.goto("file://" + path.join(__dirname, "video.html"));
  const duration = await page.evaluate(() => window.DURATION);
  const total = Math.round(duration * FPS);
  for (let i = 0; i < total; i++) {
    await page.evaluate((t) => window.render(t), i / FPS);
    await page.screenshot({ path: path.join(frames, `f${String(i).padStart(4, "0")}.jpg`), type: "jpeg", quality: 92 });
  }
  await browser.close();
  execFileSync("ffmpeg", [
    "-y", "-loglevel", "error", "-framerate", String(FPS),
    "-i", path.join(frames, "f%04d.jpg"),
    "-f", "lavfi", "-i", "anullsrc=r=44100:cl=stereo", "-shortest",
    "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "20", "-preset", "medium",
    "-c:a", "aac", "-movflags", "+faststart", OUT,
  ]);
  fs.rmSync(frames, { recursive: true });
  console.log("ok", OUT, total, "frames");
})();
