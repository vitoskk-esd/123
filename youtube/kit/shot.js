// Кадры стиля: node shot.js -> out/style_01..11.jpg + out/style_sheet.jpg
const { chromium } = require("playwright");
const path = require("path");
const fs = require("fs");
const { execFileSync } = require("child_process");
(async () => {
  const out = path.join(__dirname, "out"); fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch();
  const pg = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  const files = [];
  const shots = [...Array.from({ length: 11 }, (_, i) => `s=${i + 1}`), "s=12&o=0"];
  for (const [i, q] of shots.entries()) {
    const s = i + 1;
    await pg.goto("file://" + path.join(__dirname, "style.html") + "?" + q);
    await pg.evaluate(() => document.fonts.ready);
    const f = path.join(out, `style_${String(s).padStart(2, "0")}.jpg`);
    await pg.screenshot({ path: f, type: "jpeg", quality: 88 });
    files.push(f);
  }
  await b.close();
  // лист 3×4 по 640×360
  const inputs = files.flatMap(f => ["-i", f]);
  const n = files.length, pads = 12 - n; // 12 слотов 3×4
  const scale = files.map((_, i) => `[${i}:v]scale=640:360[v${i}]`).join(";");
  const blank = Array.from({ length: pads }, (_, k) => `color=c=black:s=640x360:d=1[e${k}]`).join(";");
  const all = [...files.map((_, i) => `[v${i}]`), ...Array.from({ length: pads }, (_, k) => `[e${k}]`)].join("");
  const layout = Array.from({ length: 12 }, (_, i) => `${(i % 3) * 640}_${Math.floor(i / 3) * 360}`).join("|");
  execFileSync("ffmpeg", ["-v", "error", "-y", ...inputs, "-filter_complex",
    `${scale}${blank ? ";" + blank : ""};${all}xstack=inputs=12:layout=${layout}`, "-frames:v", "1", path.join(out, "style_sheet.jpg")]);
})();
