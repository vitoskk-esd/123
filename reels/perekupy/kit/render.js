// node render.js <вариант.html> stills <t1,t2,...> <out_dir>
// node render.js <вариант.html> events <out.json>             — только звуковая партитура
// node render.js <вариант.html> video <out.mp4> [fps=30] [sub=1]   — sub>1: моушн-блюр усреднением подкадров
const { chromium } = require("playwright");
const { spawn } = require("child_process");
const path = require("path"), fs = require("fs");
const [html, mode, a1, a2 = "30", a3 = "1"] = process.argv.slice(2);
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  page.on("pageerror", e => { console.error("PAGE", e.message); process.exit(1); });
  page.on("console", m => { if (m.type() === "error") console.error("CONSOLE", m.text()); });
  await page.goto("file://" + path.resolve(html));
  await page.waitForFunction(() => window.READY === true, null, { timeout: 30000 });
  await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map(i => i.decode().catch(() => {}))); });
  const dur = await page.evaluate(() => R.dur);
  if (mode === "events" || mode === "video") {   // звуковая партитура для audio.js
    const ev = await page.evaluate(() => ({ dur: R.dur, events: R.events, music: window.MUSIC || null, lead: window.LEAD || 0, split: window.SPLIT || null }));
    fs.writeFileSync(mode === "events" ? a1 : a1.replace(/\.mp4$/, ".events.json"), JSON.stringify(ev, null, 1));
    if (mode === "events") { await browser.close(); console.log("events", ev.events.length); return; }
  }
  if (mode === "stills") {
    fs.mkdirSync(a2, { recursive: true });
    for (const t of a1.split(",").map(Number)) {
      await page.evaluate(t => seek(t), t);
      await page.screenshot({ path: path.join(a2, `f_${t.toFixed(2)}.jpg`), type: "jpeg", quality: 90 });
    }
  } else {
    const fps = +a2, sub = +a3, n = Math.round(dur * fps);
    const vf = sub > 1 ? ["-vf", `tmix=frames=${sub}:weights=${Array(sub).fill(1).join(" ")},select='not(mod(n\\,${sub}))',setpts=N/${fps}/TB`] : [];
    const ff = spawn("ffmpeg", ["-v", "error", "-y", "-f", "image2pipe", "-framerate", String(fps * sub), "-c:v", "mjpeg", "-i", "-", ...vf,
      "-r", String(fps), "-c:v", "libx264", "-preset", "medium", "-crf", "16", "-pix_fmt", "yuv420p", a1], { stdio: ["pipe", "inherit", "inherit"] });
    for (let f = 0; f < n * sub; f++) {
      // подкадры внутри интервала кадра, центр — на времени кадра
      await page.evaluate(t => seek(t), Math.max(0, f / (fps * sub) - (sub - 1) / (2 * fps * sub)));
      const buf = await page.screenshot({ type: "jpeg", quality: 93 });
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once("drain", r));
      if (f % (fps * sub * 3) === 0) console.log("t", (f / (fps * sub)).toFixed(1), "/", dur);
    }
    ff.stdin.end(); await new Promise(r => ff.on("close", r));
  }
  await browser.close();
  console.log("done");
})();
