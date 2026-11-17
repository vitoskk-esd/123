// Рендер серии «Тетради Никиты»: кадры 30 к/с → video.mp4 (без звука) + score.json (звуки по событиям) для perekupy/kit/audio.js
// node render_nb.js <ep_dir> <theme A|B|C> <out_dir> [from_s to_s]
// Темы = уникализации: свой цвет и рисунок бумаги, цвета маркеров, стиль субтитров, сторона Никиты, наклон камеры, музыка.
const { chromium } = require("playwright"); const path = require("path"); const fs = require("fs"); const { spawn } = require("child_process");
const THEMES = {
  A: { music: { style: "story", bpm: 92 } },
  B: { ink: "#222222", red: "#d1342f", grn: "#1d8a45", nikX: 830, flipRot: 1, music: { style: "tech", bpm: 100 },
       css: `#world{background-color:#efe2c4!important;background-image:radial-gradient(rgba(60,40,10,.30) 3px,transparent 3.5px)!important;background-size:46px 46px!important}
             .margin{display:none}#stage{background:#e9dcbd}
             #sub span{background:#1b1b1b!important;color:#fff!important;box-shadow:none!important}#sub b{background:none!important;color:#ffd23a!important}` },
  C: { ink: "#5b2bb0", red: "#e2412f", grn: "#178a43", zoom: 1.05, music: { style: "detective", bpm: 96 },
       css: `#world{background-color:#e6f3ec!important;background-image:linear-gradient(rgba(30,140,90,.22) 2px,transparent 2px),linear-gradient(90deg,rgba(30,140,90,.22) 2px,transparent 2px)!important;background-size:40px 40px!important}
             .margin{background:rgba(140,60,200,.45)!important}#stage{background:#dcebe3}
             #sub span{background:none!important;box-shadow:none!important;color:#fff!important;text-shadow:5px 0px 0 #1b1b1b,-5px 0px 0 #1b1b1b,0px 5px 0 #1b1b1b,0px -5px 0 #1b1b1b,4px 4px 0 #1b1b1b,-4px 4px 0 #1b1b1b,4px -4px 0 #1b1b1b,-4px -4px 0 #1b1b1b,0px 8px 0 #1b1b1b;font-size:58px!important;word-spacing:.12em}#sub b{background:none!important;color:#ffd23a!important}` },
};
(async () => {
  const [ep, th, out, a0, a1] = process.argv.slice(2); const T = THEMES[th]; fs.mkdirSync(out, { recursive: true });
  const timing = JSON.parse(fs.readFileSync(path.join(ep, "vo/timing.json"))), mouth = JSON.parse(fs.readFileSync(path.join(ep, "vo/mouth.json")));
  let html = fs.readFileSync(path.join(__dirname, "page_nb.html"), "utf8")
    .replace('<script src="engine.js">', `<script>window.THEME=${JSON.stringify(T)}</script><style>${T.css || ""}</style><script src="engine.js">`);
  const tmp = path.join(__dirname, `_render_${th}.html`); fs.writeFileSync(tmp, html);
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  pg.on("pageerror", e => console.log("ERR", e.message));
  await pg.goto("file://" + tmp); await pg.addScriptTag({ path: path.resolve(ep, path.basename(ep) + ".js") });
  await pg.evaluate(() => document.fonts.ready);
  const info = await pg.evaluate(([wt, mouth, T]) => {
    if (T.nikX) EP.nikita.x = T.nikX;
    if (T.flipRot) for (const k in EP.stations) EP.stations[k][3] = -EP.stations[k][3];
    if (T.zoom) EP.camShift[2] *= T.zoom;
    mountNB(EP, wt, mouth);
    // партитура звуков
    const ev = [], last = {}; const add = (type, at, gain, gap = .07) => { if (at < 0) at = 0; if (last[type] != null && at - last[type] < gap) return; last[type] = at; ev.push({ type, at: +at.toFixed(3), gain }); };
    const els = [...TL.els].sort((x, y) => x.at - y.at);
    for (const e of els) {
      const isNotif = /class="notif"/.test(e.html);
      if (isNotif) { add("buzz", e.at, 1, .05); add("ping", e.at + .04, .75, .05); continue; }
      if (e.a === "stamp") { add("impact", e.at + .2, 1.1); add("hit", e.at + .2, .5); continue; }
      if (e.count && e.count.steps) { e.count.steps.forEach(([d]) => add("tick", e.at + d, .7, .02)); continue; }
      if (e.a === "count") { add("pop", e.at, .55); for (let k = 0; k < 8; k++) add("tick", e.at + .05 + k * .09, .35, .02); continue; }
      if (e.a === "pop") add("pop", e.at, e.stk ? .5 : .4);
      else if (e.a === "write" || e.a === "draw") add("swish", e.at, .28, .15);
      else if (["left", "right", "up", "down"].includes(e.a)) add("swish", e.at, .4, .12);
    }
    // перелёты камеры между станциями
    let prev = null; EP.scenes.forEach((sc, i) => { const s = sc.st || prev; if (prev && s !== prev) add("whoosh", TL.T[i].t0 - .25, .55, .3); prev = s; });
    ev.sort((x, y) => x.at - y.at);
    return { dur: DUR, ev, drop: TL.T[14].t0 };
  }, [timing.wordTimes, mouth, T]);
  const dur = info.dur;
  fs.writeFileSync(path.join(out, "score.json"), JSON.stringify({ dur: +dur.toFixed(3), events: info.ev, music: Object.assign({ start: 0, drop: info.drop }, T.music) }));
  const f0 = Math.round((a0 ? +a0 : 0) * 30), f1 = Math.round((a1 ? +a1 : dur) * 30);
  const ff = spawn("ffmpeg", ["-v", "error", "-y", "-f", "image2pipe", "-framerate", "30", "-c:v", "mjpeg", "-i", "-", "-c:v", "libx264", "-preset", "medium", "-crf", "17", "-pix_fmt", "yuv420p", path.join(out, "video.mp4")], { stdio: ["pipe", "inherit", "inherit"] });
  const t0 = Date.now();
  for (let f = f0; f < f1; f++) {
    await pg.evaluate(t => setT(t), f / 30);
    const buf = await pg.screenshot({ type: "jpeg", quality: 93 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once("drain", r));
    if (f % 300 === 0) console.log(th, "frame", f, "/", f1, ((Date.now() - t0) / 1000).toFixed(0) + "s");
  }
  ff.stdin.end(); await new Promise(r => ff.on("close", r)); await b.close(); fs.unlinkSync(tmp);
  console.log(th, "done", dur.toFixed(2), "s");
})();
