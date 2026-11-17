// node shoot_t.js <ep_dir> <out.png> t1,t2,... — кадры в заданные секунды, склейка в ряд (проверка динамики)
const { chromium } = require("playwright"); const path = require("path");
(async () => {
  const [ep, out, ts] = process.argv.slice(2);
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  pg.on("pageerror", e => console.log("ERR", e.message));
  await pg.goto("file://" + path.resolve(__dirname, "page_nb.html"));
  await pg.addScriptTag({ path: path.resolve(ep, path.basename(ep) + ".js") });
  await pg.evaluate(() => document.fonts.ready); await pg.evaluate(() => mountNB(EP));
  const T = ts.split(",").map(Number); let i = 0;
  for (const t of T) { await pg.evaluate(t => setT(t), t); await pg.waitForTimeout(40); await pg.screenshot({ path: out.replace(".png", `_${i++}.png`) }); }
  console.log(await pg.evaluate(() => JSON.stringify(TL.T.slice(0, 5).map(x => [x.t0.toFixed(2), x.t1.toFixed(2)]))));
  await b.close();
})();
