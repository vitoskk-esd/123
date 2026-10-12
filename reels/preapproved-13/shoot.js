// Снимки раскадровки рилса #13: node reels/preapproved-13/shoot.js → carousel/{dark,illu}_0N.jpg и сводки dark.jpg / illu.jpg
const http = require("http"), fs = require("fs"), path = require("path"), { execFileSync } = require("child_process"), { chromium } = require("playwright");
const ROOT = path.resolve(__dirname, "../.."), OUT = path.join(__dirname, "carousel"); fs.mkdirSync(OUT, { recursive: true });
const T = { ".html": "text/html", ".ttf": "font/ttf", ".js": "text/javascript", ".png": "image/png" };
const srv = http.createServer((q, r) => { const f = path.join(ROOT, decodeURIComponent(q.url.split("?")[0]));
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); return r.end(); }
  r.writeHead(200, { "Content-Type": T[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(r);
}).listen(0, "127.0.0.1", async () => {
  const b = await chromium.launch({ args: ["--disable-gpu"] }), p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  p.on("pageerror", e => console.error("pageerror:", e.message));
  for (const st of ["dark", "illu"]) {
    for (let f = 1; f <= 6; f++) {
      await p.goto(`http://127.0.0.1:${srv.address().port}/reels/preapproved-13/frames.html?style=${st}&f=${f}`);
      await p.waitForFunction(() => window.__ready === true);
      await p.screenshot({ path: path.join(OUT, `${st}_0${f}.jpg`), type: "jpeg", quality: 90 });
    }
    execFileSync("ffmpeg", ["-v", "error", "-y", "-i", path.join(OUT, `${st}_%02d.jpg`), "-vf", "scale=360:-1,tile=6x1:padding=12:color=0x111111", path.join(OUT, `${st}.jpg`)]);
    console.log(st);
  }
  await b.close(); srv.close();
});
