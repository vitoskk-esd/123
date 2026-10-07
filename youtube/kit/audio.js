// Музыкальная подложка и SFX для длинного ролика (синтез, без чужих семплов — без проблем с Content ID).
// node ../kit/audio.js [timeline.js] [имя.wav] -> out/music_sfx.wav (или имя) рядом с timeline.js
// TL.music: [{ t, part }] — смена частей: "intro" (только пэд), "main" (бит), "break" (тишина ударных), "outro";
// TL.sfx: { whoosh:[], pop:[], impact:[], coin:[], tick:[] } — моменты эффектов.
// v4 («рабочий стол», тихий тактильный звук лонга): ui, pan, notif, mark, click, thud, chip, sting, ticks:[[a,b]];
// часть "stop" — музыка замолкает (выделить момент), "intro" — только пэд.
const fs = require("fs");
const path = require("path");
const tlPath = path.resolve(process.argv[2] || "timeline.js");
global.window = {};
require(tlPath);
const TL = window.TL, DIR = path.dirname(tlPath);

const SR = 44100, DUR = TL.duration, N = Math.ceil(SR * DUR);
const L = new Float32Array(N), R = new Float32Array(N);
const BPM = TL.bpm || 96, BEAT = 60 / BPM, BAR = BEAT * 4;
let seed = 11; const noise = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 2147483648 - 1; };
const add = (i, v, pan = 0) => { if (i >= 0 && i < N) { L[i] += v * (1 - pan); R[i] += v * (1 + pan); } };
const mtof = m => 440 * Math.pow(2, (m - 69) / 12);
const PARTS = (TL.music || [{ t: 0, part: "main" }]).slice().sort((a, b) => a.t - b.t);
const partAt = t => { let p = PARTS[0]; for (const x of PARTS) if (t >= x.t) p = x; return p; };
const drumsOn = t => partAt(t).part === "main";

function kick(t0, g = 1) {
  const s = Math.floor(t0 * SR); let ph = 0;
  for (let i = 0; i < SR * .4; i++) { const t = i / SR, f = 42 + 100 * Math.exp(-t * 26); ph += 2 * Math.PI * f / SR; add(s + i, Math.tanh(Math.sin(ph) * 2) * Math.exp(-t * 7) * .5 * g); }
}
function snare(t0, g = 1) {
  const s = Math.floor(t0 * SR); let lp = 0;
  for (let i = 0; i < SR * .22; i++) { const t = i / SR, n = noise(); const hp = n - lp; lp += (n - lp) * .3; add(s + i, (hp * .9 + Math.sin(2 * Math.PI * 190 * t) * .4) * Math.exp(-t * 16) * .18 * g, .1); }
}
function hat(t0, g = 1) {
  const s = Math.floor(t0 * SR); let lp = 0;
  for (let i = 0; i < SR * .045; i++) { const t = i / SR, n = noise(); const hp = n - lp; lp += (n - lp) * .6; add(s + i, hp * Math.exp(-t * 80) * .07 * g, .3); }
}
// тёмная гармония: Am – F – Dm – E (минор, «финансовый» саспенс без пафоса)
const chords = [[57, 60, 64], [53, 57, 60], [50, 53, 57], [52, 56, 59]];
const roots = [33, 29, 26, 28];
function tonal() {
  let lp1 = 0, lp2 = 0, bph = 0, gs = 0, bs = 0; const phs = new Float64Array(8);
  for (let i = 0; i < N; i++) {
    const t = i / SR, part = partAt(t).part, ci = Math.floor(t / BAR) % 4;
    const since = t % BEAT, duck = drumsOn(t) ? Math.min(1, .3 + since * 4) : 1;
    bph += 2 * Math.PI * mtof(roots[ci]) / SR;
    bs += ((part === "main" ? 1 : 0) - bs) * .0005;
    const bass = (Math.sin(bph) + .25 * Math.sin(bph * 2)) * .18 * duck * bs;
    let pad = 0;
    chords[ci].forEach((m, k) => { for (let d = 0; d < 2; d++) { const j = k * 2 + d; phs[j] += mtof(m + 12) * (d ? 1.005 : .995) / SR; pad += (phs[j] % 1) * 2 - 1; } });
    const cut = part === "main" ? .045 : .02;
    lp1 += (pad - lp1) * cut; lp2 += (lp1 - lp2) * cut;
    gs += ((part === "stop" ? 0 : part === "break" ? .035 : .05) - gs) * .0005;   // плавно, без щелчков на смене частей
    const g = gs * duck;
    add(i, bass); L[i] += lp2 * g; R[i] += lp2 * g * .85;
  }
}
function impact(t0) {
  const s = Math.floor(t0 * SR); let ph = 0, lp = 0;
  for (let i = 0; i < SR * 1.1; i++) { const t = i / SR, f = 28 + 60 * Math.exp(-t * 6); ph += 2 * Math.PI * f / SR; const n = noise(); lp += (n - lp) * .08;
    add(s + i, (Math.sin(ph) * .75 * Math.exp(-t * 3) + lp * Math.exp(-t * 9)) * .6); }
}
function whoosh(t0) {
  const len = .38, s = Math.floor((t0 - len * .65) * SR); let lp = 0;
  for (let i = 0; i < SR * len; i++) { const x = i / (SR * len), env = Math.sin(Math.PI * x) ** 2, n = noise(); lp += (n - lp) * (.03 + .25 * x); add(s + i, lp * env * .55, (x - .5) * 1.2); }
}
function pop(t0) {
  const s = Math.floor(t0 * SR); let ph = 0;
  for (let i = 0; i < SR * .09; i++) { const t = i / SR; ph += 2 * Math.PI * (900 - 4000 * t) / SR; add(s + i, Math.sin(ph) * Math.exp(-t * 45) * .16, -.15); }
}
function coin(t0) {
  const s = Math.floor(t0 * SR);
  for (let i = 0; i < SR * .7; i++) { const t = i / SR, a = Math.sin(2 * Math.PI * 1975 * t) * Math.exp(-t * 9), b = t > .07 ? Math.sin(2 * Math.PI * 2637 * (t - .07)) * Math.exp(-(t - .07) * 6) : 0;
    add(s + i, (a * .5 + b * .6) * .15, .2); }
}
function tick(t0, g = 1) { const s = Math.floor(t0 * SR); for (let i = 0; i < SR * .035; i++) { const t = i / SR; add(s + i, Math.sin(2 * Math.PI * 1300 * t) * Math.exp(-t * 120) * .18 * g, -.2); } }

function riser(a, b) {  // шум с поднимающимся фильтром + тон вверх перед заставкой уровня
  const s = Math.floor(a * SR), len = Math.floor((b - a) * SR); let lp = 0, ph = 0;
  for (let i = 0; i < len; i++) { const x = i / len, n = noise(); lp += (n - lp) * (.01 + .4 * x * x); ph += 2 * Math.PI * (180 + 900 * x * x) / SR;
    add(s + i, (lp * .5 + Math.sin(ph) * .06) * x * x * .8); }
}
function glitch(t0) {  // цифровой «треск»: короткие куски квадратной волны и шума
  const s = Math.floor(t0 * SR);
  for (let i = 0; i < SR * .22; i++) { const t = i / SR, seg = Math.floor(t * 40), on = (seg * 7919 % 5) < 3;
    const sq = Math.sign(Math.sin(2 * Math.PI * (220 + (seg % 4) * 160) * t)); add(s + i, on ? (sq * .08 + noise() * .06) * Math.exp(-t * 6) : 0, (seg % 2 ? .4 : -.4)); }
}
function swish(t0) {  // лёгкий свист на наезде камеры
  const len = .22, s = Math.floor((t0 - .08) * SR); let lp = 0;
  for (let i = 0; i < SR * len; i++) { const x = i / (SR * len), env = Math.sin(Math.PI * x) ** 3, n = noise(); lp += (n - lp) * (.15 + .4 * x); add(s + i, (n - lp) * env * .12, (x - .5) * .8); }
}
// --- v4: тихие тактильные звуки интерфейса ---
function ui(t0) {  // окно «легло» на стол: мягкий тук + шорох
  const s = Math.floor(t0 * SR); let ph = 0, lp = 0;
  for (let i = 0; i < SR * .16; i++) { const t = i / SR, n = noise(); lp += (n - lp) * .12; ph += 2 * Math.PI * (150 - 300 * t) / SR;
    add(s + i, (Math.sin(ph) * .5 * Math.exp(-t * 30) + lp * .5 * Math.exp(-t * 40)) * .22, .1); }
}
function pan(t0) {  // переезд камеры: длинный мягкий воздух
  const len = .7, s = Math.floor((t0 - len * .5) * SR); let lp = 0, lp2 = 0;
  for (let i = 0; i < SR * len; i++) { const x = i / (SR * len), env = Math.sin(Math.PI * x) ** 2, n = noise(); lp += (n - lp) * (.02 + .08 * x); lp2 += (lp - lp2) * .2; add(s + i, lp2 * env * .5, (x - .5) * 1.4); }
}
function notif(t0) {  // пуш телефона: два мягких тона
  const s = Math.floor(t0 * SR);
  for (let i = 0; i < SR * .5; i++) { const t = i / SR, a = Math.sin(2 * Math.PI * 1318.5 * t) * Math.exp(-t * 14), b = t > .09 ? Math.sin(2 * Math.PI * 1975.5 * (t - .09)) * Math.exp(-(t - .09) * 10) : 0;
    add(s + i, (a + b) * .085, -.1); }
}
function mark(t0) {  // маркер по бумаге
  const s = Math.floor(t0 * SR), len = .42; let lp = 0, hp = 0;
  for (let i = 0; i < SR * len; i++) { const x = i / (SR * len), n = noise(); lp += (n - lp) * .5; hp = n - lp; const env = Math.min(1, x * 8) * (1 - x) * (1 + .4 * Math.sin(x * 60));
    add(s + i, hp * env * .07, .15); }
}
function click(t0) { const s = Math.floor(t0 * SR); for (let i = 0; i < SR * .03; i++) { const t = i / SR; add(s + i, (Math.sin(2 * Math.PI * 2600 * t) * .6 + noise() * .4) * Math.exp(-t * 200) * .16, .25); } }
function thud(t0) {  // штамп
  const s = Math.floor(t0 * SR); let ph = 0, lp = 0;
  for (let i = 0; i < SR * .35; i++) { const t = i / SR, n = noise(); lp += (n - lp) * .25; ph += 2 * Math.PI * (95 - 120 * t) / SR;
    add(s + i, (Math.sin(ph) * .8 * Math.exp(-t * 14) + lp * .6 * Math.exp(-t * 35)) * .42); }
}
function chip(t0) { const s = Math.floor(t0 * SR); let ph = 0; for (let i = 0; i < SR * .07; i++) { const t = i / SR; ph += 2 * Math.PI * (700 - 2500 * t) / SR; add(s + i, Math.sin(ph) * Math.exp(-t * 50) * .075, -.2); } }
function ticks(a, b) { for (let t = a; t < b; t += .055) tick(t, .4); }
function sting(t0) {  // заставка уровня: удар + светлый аккорд
  impact(t0);
  const s = Math.floor(t0 * SR);
  for (let i = 0; i < SR * 1.6; i++) { const t = i / SR; let v = 0; for (const f of [440, 554.4, 659.3, 880]) v += Math.sin(2 * Math.PI * f * t) + .3 * Math.sin(4 * Math.PI * f * t);
    add(s + i, v * Math.exp(-t * 2.2) * .03 * Math.min(1, t * 60)); }
}
tonal();
for (let t = 0; t < DUR - .5; t += BEAT / 2) {
  if (!drumsOn(t)) continue;
  const b = Math.round(t / BEAT * 2);
  if (b % 4 === 0 || b % 8 === 3) kick(t);
  if (b % 4 === 2) snare(t);
  hat(t, (b % 2 ? 1 : .55) * (TL.hats ?? 1));
}
const S = TL.sfx || {};
(S.impact || []).forEach(impact); (S.whoosh || []).forEach(whoosh); (S.pop || []).forEach(pop);
(S.coin || []).forEach(coin); (S.tick || []).forEach(tick);
(S.riser || []).forEach(([a, b]) => riser(a, b)); (S.glitch || []).forEach(glitch); (S.swish || []).forEach(swish);
(S.ui || []).forEach(ui); (S.pan || []).forEach(pan); (S.notif || []).forEach(notif); (S.mark || []).forEach(mark); (S.click || []).forEach(click);
(S.thud || []).forEach(thud); (S.chip || []).forEach(chip); (S.sting || []).forEach(sting); (S.ticks || []).forEach(([a, b]) => ticks(a, b));

let peak = 0;
for (let i = 0; i < N; i++) { const t = i / SR, f = Math.min(1, t / .5, (DUR - t) / 1.5); L[i] = Math.tanh(L[i]) * f; R[i] = Math.tanh(R[i]) * f; peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i])); }
const norm = .89 / peak, buf = Buffer.alloc(44 + N * 4);
buf.write("RIFF", 0); buf.writeUInt32LE(36 + N * 4, 4); buf.write("WAVEfmt ", 8); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22);
buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34); buf.write("data", 36); buf.writeUInt32LE(N * 4, 40);
for (let i = 0; i < N; i++) { buf.writeInt16LE(Math.round(L[i] * norm * 32767), 44 + i * 4); buf.writeInt16LE(Math.round(R[i] * norm * 32767), 46 + i * 4); }
fs.mkdirSync(path.join(DIR, "out"), { recursive: true });
fs.writeFileSync(path.join(DIR, "out", process.argv[3] || "music_sfx.wav"), buf);
console.log("ok", DUR.toFixed(1) + "s");
