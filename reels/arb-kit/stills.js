// Кадры монтажа без рендера всего ролика: node arb-kit/stills.js <папка рилса> <выход.jpg> t1 t2 … — лист превью (по 4 в ряд, 270×480)
// Нужен для проверки экранов телефонов, пометок и камеры перед долгим рендером.
const http = require("http"), fs = require("fs"), path = require("path");
const { chromium } = require(require.resolve("playwright", { paths: [path.join(__dirname, "../../youtube/kit/yt")] }));
const ROOT = path.resolve(__dirname, "../.."), [reel, out, ...ts] = process.argv.slice(2);
const MIME = { ".html": "text/html", ".js": "text/javascript", ".jpg": "image/jpeg", ".png": "image/png", ".woff2": "font/woff2", ".ttf": "font/ttf" };
const srv = http.createServer((q, r) => { const f = path.join(ROOT, decodeURIComponent(q.url.split("?")[0])); fs.readFile(f, (e, d) => { if (e) { r.writeHead(404); r.end(); return; } r.writeHead(200, { "Content-Type": MIME[path.extname(f)] || "application/octet-stream" }); r.end(d); }); });
srv.listen(0, async () => {
  const b = await chromium.launch({ args: ["--disable-gpu"] }), p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  p.on("pageerror", (e) => console.error("стр:", e.message)); p.on("console", (m) => m.type() === "error" && console.error("консоль:", m.text()));
  await p.goto(`http://127.0.0.1:${srv.address().port}/reels/arb-kit/cut3.html?r=${path.basename(path.resolve(reel))}`);
  await p.waitForFunction(() => window.__ready, null, { timeout: 20000 });
  const shots = [];
  for (const t of ts) { await p.evaluate((t) => renderAt(+t), t); await p.waitForTimeout(80); shots.push(await p.screenshot({ type: "jpeg", quality: 80 })); }
  // склеиваем лист в той же странице
  const data = shots.map(s => "data:image/jpeg;base64," + s.toString("base64"));
  const cols = Math.min(4, data.length), rows = Math.ceil(data.length / cols);
  await p.setViewportSize({ width: cols * 280, height: rows * 510 });
  await p.setContent(`<body style="margin:0;background:#111;display:grid;grid-template-columns:repeat(${cols},280px)">${data.map((d, j) => `<div style="padding:5px;color:#eee;font:14px sans-serif"><img src="${d}" width="270" height="480"><div>${ts[j]} с</div></div>`).join("")}</body>`);
  await p.waitForTimeout(200); await p.screenshot({ path: out, type: "jpeg", quality: 85, fullPage: true });
  await b.close(); srv.close();
});
