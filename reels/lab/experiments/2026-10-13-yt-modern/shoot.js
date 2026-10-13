// Снимки 4 стилей ролика №4: node reels/lab/experiments/2026-10-13-yt-modern/shoot.js → out/<style>_<f>.jpg и сводки
const http = require("http"), fs = require("fs"), path = require("path"), { execFileSync } = require("child_process"), { chromium } = require("playwright");
const ROOT = path.resolve(__dirname, "../../../.."), OUT = path.join(__dirname, "out"); fs.mkdirSync(OUT, { recursive: true });
const T = { ".html": "text/html", ".ttf": "font/ttf", ".woff2": "font/woff2", ".js": "text/javascript" };
const srv = http.createServer((q, r) => { const f = path.join(ROOT, decodeURIComponent(q.url.split("?")[0]));
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); return r.end(); }
  r.writeHead(200, { "Content-Type": T[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(r);
}).listen(0, "127.0.0.1", async () => {
  const b = await chromium.launch({ args: ["--disable-gpu"] }), p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  p.on("pageerror", e => console.error("pageerror:", e.message));
  const styles = (process.argv[2] || "premium,bento,broadcast,kinetic").split(",");
  for (const st of styles) for (let f = 1; f <= 3; f++) {
    await p.goto(`http://127.0.0.1:${srv.address().port}/reels/lab/experiments/2026-10-13-yt-modern/styles.html?style=${st}&f=${f}`);
    await p.waitForFunction(() => window.__ready === true);
    await p.screenshot({ path: path.join(OUT, `${st}_${f}.jpg`), type: "jpeg", quality: 90 });
  }
  await b.close(); srv.close();
  for (const st of styles) execFileSync("ffmpeg", ["-v", "error", "-y", "-i", path.join(OUT, `${st}_1.jpg`), "-i", path.join(OUT, `${st}_2.jpg`), "-i", path.join(OUT, `${st}_3.jpg`),
    "-filter_complex", "[0][1][2]hstack=3,scale=2400:-1", path.join(OUT, `${st}_sheet.jpg`)]);
  console.log("ok", styles.join(" "));
});
