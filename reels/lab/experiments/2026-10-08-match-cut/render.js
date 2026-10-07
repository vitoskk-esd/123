// Кадры трёх вариантов перехода: node render.js -> frames/<v>_<t>.jpg, <v>.mp4, compare.mp4, sheet.jpg
const { chromium } = require("playwright"); const { execSync } = require("child_process"); const fs = require("fs"); const path = require("path");
(async () => {
  fs.mkdirSync("frames", { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  const KEYS = [1.0, 1.1, 1.2, 1.3, 1.45, 1.7];
  for (const v of ["cut", "whip", "match", "match2"]) {
    await p.goto("file://" + path.join(__dirname, `scene.html?v=${v}`)); await p.evaluate(() => document.fonts.ready);
    for (let i = 0; i < 72; i++) { await p.evaluate(t => renderAt(t), i / 30); await p.screenshot({ path: `frames/${v}_${String(i).padStart(3, "0")}.jpg`, type: "jpeg", quality: 85 }); }
    for (const t of KEYS) { await p.evaluate(t => renderAt(t), t); await p.screenshot({ path: `frames/key_${v}_${t}.jpg`, type: "jpeg", quality: 85 }); }
    execSync(`ffmpeg -v error -y -framerate 30 -i frames/${v}_%03d.jpg -vf scale=540:960 -pix_fmt yuv420p ${v}.mp4`);
  }
  await b.close();
  execSync(`ffmpeg -v error -y -i cut.mp4 -i whip.mp4 -i match.mp4 -i match2.mp4 -filter_complex "[0]scale=270:480[a];[1]scale=270:480[b];[2]scale=270:480[c];[3]scale=270:480[d];[a][b][c][d]hstack=4" compare.mp4`);
  const ins = []; for (const v of ["cut", "whip", "match", "match2"]) for (const t of KEYS) ins.push(`-i frames/key_${v}_${t}.jpg`);
  const n = ins.length, lay = []; for (let r = 0; r < 4; r++) for (let c = 0; c < 6; c++) lay.push(`${c * 270}_${r * 480}`);
  execSync(`ffmpeg -v error -y ${ins.join(" ")} -filter_complex "${Array.from({ length: n }, (_, i) => `[${i}]scale=270:480[s${i}]`).join(";")};${Array.from({ length: n }, (_, i) => `[s${i}]`).join("")}xstack=inputs=${n}:layout=${lay.join("|")}" sheet.jpg`);
  console.log("ok");
})();
