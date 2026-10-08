// Общий рендер «Студии» — и для YouTube (16:9), и для рилсов (9:16): размер кадра берётся из TL.size.
// node ../kit/render.js --page video.html --stills t1,t2   -> out/still_<t>.jpg рядом со страницей
// node ../kit/render.js --page video.html --from A --to B --out file.mp4
const { chromium } = require("playwright");
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
(async () => {
  const pagePath = path.resolve(arg("--page", "video.html")), DIR = path.dirname(pagePath);
  fs.mkdirSync(path.join(DIR, "out"), { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.goto("file://" + pagePath);
  const TL = await page.evaluate(() => ({ duration: window.TL.duration, fps: window.TL.fps || 30, size: window.TL.size || [1920, 1080] }));
  await page.setViewportSize({ width: TL.size[0], height: TL.size[1] });
  await page.evaluate(() => window.renderAt(0));
  await page.evaluate(() => document.fonts.ready);
  const stills = arg("--stills");
  if (stills) {
    for (const t of stills.split(",").map(Number)) {
      await page.evaluate(t => window.renderAt(t), t);
      await page.waitForTimeout(50);
      await page.screenshot({ path: path.join(DIR, "out", `still_${t}.jpg`), type: "jpeg", quality: 80 });
    }
    await browser.close(); return;
  }
  const from = +arg("--from", 0), to = Math.min(+arg("--to", TL.duration), TL.duration);
  const out = path.resolve(arg("--out", path.join(DIR, "out", "frames.mp4")));
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
