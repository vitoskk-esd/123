// Превью: node shot.js -> thumb_v1..3.png (1280×720) + glance.jpg (как в ленте: 3 шт. по 320×180 и 168×94)
const { chromium } = require("playwright");
const path = require("path");
const { execFileSync } = require("child_process");
(async () => {
  const b = await chromium.launch();
  const pg = await b.newPage({ viewport: { width: 1280, height: 720 } });
  for (const v of ["1", "2", "3"]) {
    await pg.goto("file://" + path.join(__dirname, "thumb.html") + "?v=" + v);
    await pg.evaluate(() => document.fonts.ready);
    await pg.waitForTimeout(300);
    await pg.screenshot({ path: path.join(__dirname, `thumb_v${v}.png`) });
  }
  await b.close();
  const f = v => path.join(__dirname, `thumb_v${v}.png`);
  execFileSync("ffmpeg", ["-v", "error", "-y", "-i", f(1), "-i", f(2), "-i", f(3), "-filter_complex",
    "color=c=0x0f0f0f:s=1040x330:d=1[bg];" +
    "[0]scale=320:180[a];[1]scale=320:180[b];[2]scale=320:180[c];[0]scale=168:94[d];[1]scale=168:94[e];[2]scale=168:94[f];" +
    "[bg][a]overlay=20:20[x1];[x1][b]overlay=360:20[x2];[x2][c]overlay=700:20[x3];" +
    "[x3][d]overlay=96:220[x4];[x4][e]overlay=436:220[x5];[x5][f]overlay=776:220",
    "-frames:v", "1", path.join(__dirname, "glance.jpg")]);
})();
