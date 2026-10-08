// Проверка читаемости кадров «рабочего стола»: node ../kit/lint_desk.js [desk.html] [шаг_с] [порог_px]
// Каждые N секунд ролика меряет реальный размер текста на экране (с учётом зума камеры и масштаба объектов)
// и вылезание текста из своей плашки. Правило из HyperFrames (video-composition / typography):
// на 1920×1080 текст < 24 px требует причины, < 20 px не читается с телефона.
const { chromium } = require("playwright");
const path = require("path");
const page_ = process.argv[2] || "desk.html", STEP = +(process.argv[3] || .5), MIN = +(process.argv[4] || 22);
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.goto("file://" + path.resolve(page_));
  await page.evaluate(() => document.fonts.ready);
  const dur = await page.evaluate(() => window.TL.duration);
  const small = new Map(), over = new Map();
  for (let t = 0; t < dur; t += STEP) {
    await page.evaluate(t => window.renderAt(t), t);
    const r = await page.evaluate(({ MIN }) => {
      const res = { small: [], over: [] };
      const vis = (e) => { let o = 1; for (let p = e; p && p !== document.body; p = p.parentElement) o *= +getComputedStyle(p).opacity; return o; };
      for (const e of document.querySelectorAll("#world *, #hud *")) {
        const own = [...e.childNodes].filter(n => n.nodeType === 3 && n.textContent.trim()).map(n => n.textContent.trim()).join(" ");
        if (!own) continue;
        const b = e.getBoundingClientRect();
        if (b.right < 0 || b.left > 1920 || b.bottom < 0 || b.top > 1080 || !e.offsetHeight) continue;
        if (vis(e) < .6) continue;
        const px = parseFloat(getComputedStyle(e).fontSize) * (b.height / e.offsetHeight);
        const key = own.slice(0, 40);
        if (px < MIN) res.small.push([key, Math.round(px)]);
        if (e.scrollWidth > e.clientWidth + 3 && getComputedStyle(e).overflow !== "visible") res.over.push([key, e.scrollWidth - e.clientWidth]);
      }
      return res;
    }, { MIN });
    for (const [k, px] of r.small) { const s = small.get(k) || { n: 0, px: 99, t: t }; s.n++; s.px = Math.min(s.px, px); small.set(k, s); }
    for (const [k, d] of r.over) { const s = over.get(k) || { n: 0, d: 0, t: t }; s.n++; s.d = Math.max(s.d, d); over.set(k, s); }
  }
  await browser.close();
  const rows = [...small].filter(([, s]) => s.n * STEP >= 1).sort((a, b) => a[1].px - b[1].px);
  console.log(`Мелкий текст (< ${MIN}px на экране, держится ≥ 1 с): ${rows.length}`);
  for (const [k, s] of rows) console.log(`  ${String(s.px).padStart(3)}px  ${(s.n * STEP).toFixed(1).padStart(5)} с  с ${s.t.toFixed(1)} с  «${k}»`);
  console.log(`Текст вылезает из плашки: ${over.size}`);
  for (const [k, s] of over) console.log(`  +${s.d}px  с ${s.t.toFixed(1)} с  «${k}»`);
})();
