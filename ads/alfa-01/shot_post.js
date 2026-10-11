// Снимок картинки к посту: node ads/alfa-01/shot_post.js → ads/alfa-01/post.png (1080×1350). Сервер — корень репозитория (шрифты /youtube/kit/fonts).
const http = require("http"), fs = require("fs"), path = require("path"), { chromium } = require("playwright");
const ROOT = path.resolve(__dirname, "../.."), T = { ".html": "text/html", ".ttf": "font/ttf", ".js": "text/javascript" };
const srv = http.createServer((q, r) => { const f = path.join(ROOT, decodeURIComponent(q.url.split("?")[0]));
  if (!f.startsWith(ROOT) || !fs.existsSync(f)) { r.writeHead(404); return r.end(); } r.writeHead(200, { "Content-Type": T[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(r);
}).listen(0, "127.0.0.1", async () => {
  const b = await chromium.launch(), p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  await p.goto(`http://127.0.0.1:${srv.address().port}/ads/alfa-01/post.html`); await p.waitForFunction(() => window.__ready === true);
  await p.screenshot({ path: path.join(__dirname, "post.png") }); await b.close(); srv.close(); console.log("post.png");
});
