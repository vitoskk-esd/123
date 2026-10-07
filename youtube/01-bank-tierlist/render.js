// Рендер video.html: node render.js --stills t1,t2,...  -> out/still_<t>.jpg
//                    node render.js --from A --to B --out file.mp4  -> кадры [A, B) в видео (без звука)
const { chromium } = require("playwright");
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
(async () => {
  fs.mkdirSync(path.join(__dirname, "out"), { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.goto("file://" + path.join(__dirname, "video.html"));
  await page.evaluate(() => document.fonts.ready);
  const TL = await page.evaluate(() => ({ duration: window.TL.duration, fps: window.TL.fps }));
  const stills = arg("--stills");
  if (stills) {
    for (const t of stills.split(",").map(Number)) {
      await page.evaluate(t => window.renderAt(t), t);
      await page.waitForTimeout(50);
      await page.screenshot({ path: path.join(__dirname, "out", `still_${t}.jpg`), type: "jpeg", quality: 80 });
    }
    await browser.close(); return;
  }
  const from = +arg("--from", 0), to = Math.min(+arg("--to", TL.duration), TL.duration);
  const out = arg("--out", path.join(__dirname, "out", "frames.mp4"));
  const ff = spawn("ffmpeg", ["-y", "-v", "error", "-f", "image2pipe", "-framerate", String(TL.fps), "-i", "-",
    "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "19", "-preset", "veryfast", out], { stdio: ["pipe", "inherit", "inherit"] });
  const n0 = Math.round(from * TL.fps), n1 = Math.round(to * TL.fps);
  for (let i = n0; i < n1; i++) {
    await page.evaluate(t => window.renderAt(t), i / TL.fps);
    const buf = await page.screenshot({ type: "jpeg", quality: 92 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once("drain", r));
    if ((i - n0) % 300 === 0) process.stderr.write(`frame ${i - n0}/${n1 - n0}\n`);
  }
  ff.stdin.end();
  await new Promise(r => ff.on("close", r));
  await browser.close();
})();
