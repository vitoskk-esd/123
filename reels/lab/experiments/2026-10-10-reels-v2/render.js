// Рендер прототипа (и с three.js, и без): локальный сервер на корень репозитория — ES-модули не грузятся с file://.
// node render.js <страница.html> --stills 1,5,9 [--query theme=board --suffix board]  -> out/<имя>[_suffix]_still_<t>.jpg
// node render.js <страница.html> --out out/a.mp4 [--from A --to B]
// Страница: window.TL = {duration, fps, size}, window.renderAt(t) (может вернуть Promise), window.__ready = true после загрузки.
const http = require("http"), fs = require("fs"), path = require("path"), { spawn } = require("child_process");
const { chromium } = require("playwright");
const ROOT = path.resolve(__dirname, "../../../..");
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const pagePath = path.resolve(process.argv[2]), QUERY = arg("--query", ""), name = path.basename(pagePath, ".html") + (arg("--suffix", "") ? "_" + arg("--suffix") : "");
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".ttf": "font/ttf", ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".json": "application/json" };
const srv = http.createServer((req, res) => {
  const f = path.join(ROOT, decodeURIComponent(req.url.split("?")[0]));
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { "Content-Type": TYPES[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(res);
}).listen(0, "127.0.0.1", async () => {
  const b = await chromium.launch({ args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  p.on("pageerror", e => console.error("pageerror:", e.message));
  p.on("console", m => { if (m.type() === "error") console.error("console:", m.text()); });
  await p.goto(`http://127.0.0.1:${srv.address().port}/${path.relative(ROOT, pagePath)}${QUERY ? "?" + QUERY : ""}`);
  await p.waitForFunction(() => window.__ready === true, null, { timeout: 180000 });
  await p.evaluate(() => document.fonts.ready);
  const TL = await p.evaluate(() => ({ duration: window.TL.duration, fps: window.TL.fps || 30, size: window.TL.size || [1920, 1080] }));
  await p.setViewportSize({ width: TL.size[0], height: TL.size[1] });
  const dir = path.join(path.dirname(pagePath), "out"); fs.mkdirSync(dir, { recursive: true });
  const stills = arg("--stills");
  if (stills) {
    for (const t of stills.split(",").map(Number)) {
      await p.evaluate(t => window.renderAt(t), t);
      await p.screenshot({ path: path.join(dir, `${name}_still_${t}.jpg`), type: "jpeg", quality: 85 });
    }
  } else {
    const from = +arg("--from", 0), to = Math.min(+arg("--to", TL.duration), TL.duration);
    const out = path.resolve(arg("--out", path.join(dir, `${name}.mp4`)));
    const ff = spawn("ffmpeg", ["-y", "-v", "error", "-f", "image2pipe", "-framerate", String(TL.fps), "-i", "-",
      "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "18", "-preset", "veryfast", out], { stdio: ["pipe", "inherit", "inherit"] });
    const n0 = Math.round(from * TL.fps), n1 = Math.round(to * TL.fps);
    for (let i = n0; i < n1; i++) {
      await p.evaluate(t => window.renderAt(t), i / TL.fps);
      const buf = await p.screenshot({ type: "jpeg", quality: 92 });
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once("drain", r));
      if ((i - n0) % 90 === 0) process.stderr.write(`${name}: кадр ${i - n0}/${n1 - n0}\n`);
    }
    ff.stdin.end(); await new Promise(r => ff.on("close", r));
  }
  await b.close(); srv.close();
});
