// Снимок страницы с WebGL (three.js) — модули ES не грузятся с file://, поэтому поднимаем локальный сервер на папку youtube/.
// node kit/shot3d.js <страница относительно youtube/> <файл.png> [w] [h] [query]
// Страница ставит window.__ready = true, когда кадр отрисован.
const http = require("http"), fs = require("fs"), path = require("path");
const { chromium } = require("playwright");
const ROOT = path.resolve(__dirname, "..");
const [page, out, W = 1280, H = 720, query = ""] = process.argv.slice(2);
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".ttf": "font/ttf", ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml" };
const srv = http.createServer((req, res) => {
  const f = path.join(ROOT, decodeURIComponent(req.url.split("?")[0]));
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { "Content-Type": TYPES[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(res);
}).listen(0, "127.0.0.1", async () => {
  const b = await chromium.launch({ args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
  const p = await b.newPage({ viewport: { width: +W, height: +H } });
  p.on("pageerror", e => console.error("pageerror:", e.message));
  p.on("console", m => { if (m.type() === "error") console.error("console:", m.text()); });
  await p.goto(`http://127.0.0.1:${srv.address().port}/${page}${query ? "?" + query : ""}`);
  await p.waitForFunction(() => window.__ready === true, null, { timeout: 180000 });
  await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: path.resolve(out) });
  await b.close(); srv.close();
});
