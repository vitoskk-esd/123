// Подбор темпа и старта музыки под акценты голоса (reels/lab/experiments/2026-10-07-beat-grid).
// node fit_tempo.js -> печатает BPM и M0 для audio.js: BPM=… M0=… node audio.js
const T = require("./timeline.js");
const acc = [...T.sfx.impact, ...T.sfx.whoosh, ...T.sfx.coin].filter(t => t >= T.sfx.musicStart - .3).sort((a, b) => a - b);
let best = null;
for (let bpm = 100; bpm <= 140; bpm++) {
  const step = 30 / bpm; // сетка восьмыми
  for (let ph = 0; ph < step; ph += .005) {
    const e = acc.map(t => { const x = ((t - ph) % step + step) % step; return Math.min(x, step - x); });
    const hit = e.filter(x => x <= .04).length, mean = e.reduce((s, x) => s + x, 0) / e.length;
    if (!best || hit > best.hit || (hit === best.hit && Math.abs(bpm - 120) < Math.abs(best.bpm - 120) && mean <= best.mean + .005)) best = { bpm, ph, hit, mean };
  }
}
// старт ударных — ближайшая к началу сцены 1 сильная доля сетки (кратно целому биту от фазы)
const beat = 60 / best.bpm, s1 = T.sfx.musicStart;
const m0 = best.ph + Math.round((s1 - best.ph) / beat) * beat;
const base = acc.map(t => { const s = 30 / 120, x = ((t - s1) % s + s) % s; return Math.min(x, s - x); });
console.log(`акцентов ${acc.length}; 120 BPM от сцены 1: в ±40 мс ${base.filter(x => x <= .04).length}/${acc.length}`);
console.log(`подбор: ${best.bpm} BPM, в ±40 мс ${best.hit}/${acc.length}, средний промах ${Math.round(best.mean * 1000)} мс`);
console.log(`BPM=${best.bpm} M0=${m0.toFixed(3)}`);
