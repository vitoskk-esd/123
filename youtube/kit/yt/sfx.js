// Y5: собирает звуки предметов из отрезков ролика (режимы с events(d, dur), сейчас — «Ночной офис») и пишет timeline для audio.js.
// node yt/sfx.js <data.js> <out_timeline.js>   (data.js: window.SEGS = [...] — те же отрезки, что в YT.play; window.TLX = {music, bpm, sfx} — добавки)
const path = require("path"), fs = require("fs");
global.window = {}; global.document = { createElement: () => ({ set textContent(v) {} }), head: { appendChild() {} } };
require("./yt.js"); global.YT = window.YT; fs.readdirSync(path.join(__dirname, "modes")).forEach(f => require("./modes/" + f));
require(path.resolve(process.argv[2]));
const segs = window.SEGS, X = window.TLX || {}, sfx = JSON.parse(JSON.stringify(X.sfx || {}));
segs.forEach(s => { const def = window.YT.MODES[s.mode]; if (!def || !def.events) return;
  const E = def.events(s.data || {}, s.t1 - s.t0);
  Object.entries(E).forEach(([k, v]) => { sfx[k] = (sfx[k] || []).concat(v.map(x => Array.isArray(x) ? (["pen"].includes(k) ? [x[0] + s.t0, x[1]] : x.map(y => y + s.t0)) : x + s.t0)); }); });
const T = segs[segs.length - 1].t1;
fs.writeFileSync(process.argv[3], "window.TL = " + JSON.stringify({ duration: T, music: X.music || [{ t: 0, part: "intro" }], bpm: X.bpm || 96, sfx }) + ";\n");
console.log("событий:", Object.entries(sfx).map(([k, v]) => `${k} ${v.length}`).join(", "));
