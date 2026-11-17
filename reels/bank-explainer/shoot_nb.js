// node shoot_nb.js <ep_dir> <out_dir> [scenes|all] [shift] — раскадровка стиля «Тетрадь Никиты»
const { chromium } = require("playwright"); const path = require("path"); const fs = require("fs");
(async () => {
  const [ep, out, which = "all", shift = "-0.12"] = process.argv.slice(2); fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  pg.on("pageerror", e => console.log("ERR", e.message));
  await pg.goto("file://" + path.resolve(__dirname, "page_nb.html"));
  await pg.addScriptTag({ path: path.resolve(ep, path.basename(ep) + ".js") });
  await pg.evaluate(() => document.fonts.ready);
  const T = await pg.evaluate(() => { mountNB(EP); return TL.T.map(x => [x.t0, x.t1]); });
  const idx = which === "all" ? T.map((_, i) => i) : which.split(",").map(Number);
  for (const i of idx) { await pg.evaluate(t => setT(t), T[i][1] + Number(shift)); await pg.waitForTimeout(40);
    await pg.screenshot({ path: path.join(out, `s${String(i).padStart(2, "0")}.png`) }); }
  console.log("dur", await pg.evaluate(() => DUR.toFixed(1)));
  await b.close();
})();
