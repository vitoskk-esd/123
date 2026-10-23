// Снимки дизайнов v1–v3 (1080×1350) готовым headless Chromium через puppeteer-core из пакета hyperframes.
//   HYPERFRAMES_BROWSER_PATH=<headless_shell> node design/render.mjs
import { createRequire } from "module"; import path from "path"; import { fileURLToPath } from "url";
const puppeteer = createRequire("/opt/node22/lib/node_modules/hyperframes/")("puppeteer-core");
const here = path.dirname(fileURLToPath(import.meta.url));
const b = await puppeteer.launch({ executablePath: process.env.HYPERFRAMES_BROWSER_PATH, timeout: 30000,
  args: ["--no-sandbox", "--allow-file-access-from-files", "--disable-gpu", "--disable-dev-shm-usage"] });
for (const v of ["v1", "v2", "v3"]) {
  const p = await b.newPage(); await p.setViewport({ width: 1080, height: 1350 });
  await p.goto("file://" + path.join(here, v + ".html"), { waitUntil: "domcontentloaded", timeout: 20000 });
  await Promise.race([p.evaluate("document.fonts.ready.then(() => 1)"), new Promise(r => setTimeout(r, 5000))]);   // шрифты, но не дольше 5 с
  await p.screenshot({ path: path.join(here, "..", "info_" + v + ".png") }); await p.close(); console.log(v);
}
await b.close();
