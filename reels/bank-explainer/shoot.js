// node shoot.js <ep_dir> <out_dir> [scene indices comma|all]  — кадры раскадровки (конец каждой сцены, всё уже на экране)
const { chromium } = require("playwright"); const path = require("path"); const fs = require("fs");
(async () => {
  const [ep, out, which = "all"] = process.argv.slice(2); fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  pg.on("console", m => console.log("console:", m.text())); pg.on("pageerror", e => console.log("ERR", e.message));
  await pg.goto("file://" + path.resolve(__dirname, "page.html"));
  const name = path.basename(ep); await pg.addScriptTag({ path: path.resolve(ep, name + ".js") });
  await pg.evaluate(() => document.fonts.ready);
  const T = await pg.evaluate(() => { mount(EP); return TL.T.map(x => [x.t0, x.t1]); });
  const idx = which === "all" ? T.map((_, i) => i) : which.split(",").map(Number);
  for (const i of idx) { const t = T[i][1] - 0.12; await pg.evaluate(t => setT(t), t); await pg.waitForTimeout(30);
    await pg.screenshot({ path: path.join(out, `s${String(i).padStart(2, "0")}.png`) }); }
  console.log("dur", await pg.evaluate(() => DUR).then(d => d.toFixed(1)));
  await b.close();
})();
