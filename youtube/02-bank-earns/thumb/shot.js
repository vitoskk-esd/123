// Превью: node shot.js -> thumb_v1..6.png (1280×720) + glance.jpg (как в ленте: 320×180 и 168×94)
const { chromium } = require("playwright");
const path = require("path");
const { execFileSync } = require("child_process");
(async () => {
  const b = await chromium.launch();
  const pg = await b.newPage({ viewport: { width: 1280, height: 720 } });
  for (const v of (process.env.V || "1,2,3,4,5,6,7,8,9").split(",")) {
    await pg.goto("file://" + path.join(__dirname, "thumb.html") + "?v=" + v);
    await pg.evaluate(() => document.fonts.ready);
    await pg.waitForTimeout(300);
    await pg.screenshot({ path: path.join(__dirname, `thumb_v${v}.png`) });
  }
  await b.close();
  const f = v => path.join(__dirname, `thumb_v${v}.png`);
  // лента: 6 превью по 320×180 (2 ряда) + те же в 168×94
  const big = [1, 2, 3].map(v => ["-i", f(v)]).flat();
  let fc = "color=c=0x0f0f0f:s=1060x420:d=1[bg];", last = "bg";
  [1, 2, 3].forEach((v, i) => {
    fc += `[${i}]split[s${i}][t${i}];[s${i}]scale=320:180[a${i}];[t${i}]scale=168:94[b${i}];`;
  });
  [1, 2, 3].forEach((v, i) => {
    const x = 20 + (i % 3) * 345, y = 20 + Math.floor(i / 3) * 200;
    fc += `[${last}][a${i}]overlay=${x}:${y}[o${i}];`; last = `o${i}`;
  });
  [1, 2, 3].forEach((v, i) => {
    const x = 20 + i * 175, y = 300;
    fc += `[${last}][b${i}]overlay=${x}:${y}${i < 2 ? `[p${i}];` : ""}`; last = `p${i}`;
  });
  execFileSync("ffmpeg", ["-v", "error", "-y", ...big, "-filter_complex", fc, "-frames:v", "1", path.join(__dirname, "glance.jpg")]);
})();
