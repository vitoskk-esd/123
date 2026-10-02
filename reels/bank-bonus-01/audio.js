// Синтез музыкальной подложки и звуковых эффектов под таймлайн. Без внешних семплов.
// node audio.js -> out/music_sfx.wav
const fs = require("fs");
const path = require("path");
const TL = require("./timeline.js");

const SR = 44100, DUR = TL.duration, N = Math.ceil(SR * DUR);
const L = new Float32Array(N), R = new Float32Array(N);
const BPM = 120, BEAT = 60 / BPM, BAR = BEAT * 4;
let seed = 7; const noise = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 2147483648 - 1; };
const add = (i, v, pan = 0) => { if (i >= 0 && i < N) { L[i] += v * (1 - pan) ; R[i] += v * (1 + pan); } };
const mtof = m => 440 * Math.pow(2, (m - 69) / 12);

function inBreak(t) { const [a, b] = TL.sfx.breakAt; return t >= a && t < b; }
const drumsOn = t => t >= 1.0 && !inBreak(t) && !(t >= 23.0 && t < 24.0);

// --- барабаны ---
function kick(t0, g = 1) {
  const s = Math.floor(t0 * SR);
  let ph = 0;
  for (let i = 0; i < SR * .45; i++) {
    const t = i / SR, f = 45 + 110 * Math.exp(-t * 28);
    ph += 2 * Math.PI * f / SR;
    const env = Math.exp(-t * 7);
    add(s + i, Math.tanh(Math.sin(ph) * 2.2) * env * .55 * g);
  }
}
function clap(t0, g = 1) {
  const s = Math.floor(t0 * SR); let lp = 0;
  for (let i = 0; i < SR * .25; i++) {
    const t = i / SR;
    const env = (t < .03 ? (Math.floor(t * 300) % 3 === 0 ? 1 : .5) : 1) * Math.exp(-t * 18);
    const n = noise(); const hp = n - lp; lp += (n - lp) * .25;
    add(s + i, hp * env * .22 * g, (i % 2 ? .25 : -.25));
  }
}
function hat(t0, g = 1, open = false) {
  const s = Math.floor(t0 * SR); let lp = 0;
  for (let i = 0; i < SR * (open ? .2 : .05); i++) {
    const t = i / SR, n = noise(); const hp = n - lp; lp += (n - lp) * .6;
    add(s + i, hp * Math.exp(-t * (open ? 14 : 70)) * .1 * g, .35);
  }
}

// --- бас и пэд: Am F C G ---
const chords = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]];
const roots = [33, 29, 36, 31];
function renderTonal() {
  let lp1 = 0, lp2 = 0;
  const phs = new Float64Array(8); let bph = 0;
  for (let i = 0; i < N; i++) {
    const t = i / SR;
    const ci = Math.floor(t / (BAR)) % 4;
    // бас: восьмые с «сайдчейном» от бочки
    const sinceBeat = t % BEAT;
    const duck = drumsOn(t) ? Math.min(1, .25 + sinceBeat * 4) : 1;
    bph += 2 * Math.PI * mtof(roots[ci]) / SR;
    const bassOn = t >= 1.0 && !inBreak(t) && t < 27.4;
    const bass = bassOn ? (Math.sin(bph) + .3 * Math.sin(bph * 2)) * .22 * duck : 0;
    // пэд: расстроенные пилы через фильтр
    let pad = 0;
    chords[ci].forEach((m, k) => {
      for (let d = 0; d < 2; d++) {
        const idx = k * 2 + d;
        phs[idx] += mtof(m + 12) * (d ? 1.006 : .994) / SR;
        pad += (phs[idx] % 1) * 2 - 1;
      }
    });
    const cutoff = t < 1 ? .02 : (t >= 24 ? .09 : .05);
    lp1 += (pad - lp1) * cutoff; lp2 += (lp1 - lp2) * cutoff;
    const padG = (t < 1 ? .05 : .06) * duck;
    add(i, bass, 0);
    L[i] += lp2 * padG * 1.0; R[i] += lp2 * padG * .8;
  }
}

// --- SFX ---
function impact(t0) {
  const s = Math.floor(t0 * SR); let ph = 0, lp = 0;
  for (let i = 0; i < SR * 1.2; i++) {
    const t = i / SR; const f = 30 + 70 * Math.exp(-t * 6); ph += 2 * Math.PI * f / SR;
    const n = noise(); lp += (n - lp) * .08;
    add(s + i, (Math.sin(ph) * .7 * Math.exp(-t * 3.2) + lp * 1.2 * Math.exp(-t * 9)) * .7);
  }
}
function whoosh(t0) {
  const len = .45, s = Math.floor((t0 - len * .7) * SR); let lp = 0;
  for (let i = 0; i < SR * len; i++) {
    const x = i / (SR * len); const env = Math.sin(Math.PI * x) ** 2;
    const n = noise(); lp += (n - lp) * (.03 + .25 * x);
    add(s + i, lp * env * .9, (x - .5) * 1.4);
  }
}
function coin(t0) {
  const s = Math.floor(t0 * SR);
  for (let i = 0; i < SR * .7; i++) {
    const t = i / SR;
    const a = Math.sin(2 * Math.PI * 1975 * t) * Math.exp(-t * 9);
    const b = t > .07 ? Math.sin(2 * Math.PI * 2637 * (t - .07)) * Math.exp(-(t - .07) * 6) : 0;
    add(s + i, (a * .5 + b * .6 + Math.sin(2 * Math.PI * 5274 * t) * .15 * Math.exp(-t * 20)) * .17, .2);
  }
}
function tick(t0) {
  const s = Math.floor(t0 * SR);
  for (let i = 0; i < SR * .04; i++) { const t = i / SR; add(s + i, Math.sin(2 * Math.PI * 1300 * t) * Math.exp(-t * 120) * .22, -.2); }
}
function riser(a, b) {
  const s = Math.floor(a * SR), len = Math.floor((b - a) * SR); let lp = 0, ph = 0;
  for (let i = 0; i < len; i++) {
    const x = i / len; const n = noise(); lp += (n - lp) * (.01 + .5 * x * x);
    ph += 2 * Math.PI * (200 + 1400 * x * x) / SR;
    add(s + i, (lp * .55 + Math.sin(ph) * .05) * x * x);
  }
  // дробь клэпа ускоряется
  for (let k = 0, t = a; t < b - .02; k++) { clap(t, .4 + .6 * (t - a) / (b - a)); t += Math.max(.0625, .25 * (1 - (t - a) / (b - a))); }
}

renderTonal();
for (let t = 1.0; t < 27.5; t += BEAT / 2) {
  if (!drumsOn(t)) continue;
  const beat = Math.round((t - 1.0) / BEAT * 2);
  if (beat % 2 === 0) kick(t);
  if (beat % 4 === 2) clap(t);
  hat(t, beat % 2 ? 1 : .6, beat % 8 === 7);
}
TL.sfx.impact.forEach(impact);
TL.sfx.whoosh.forEach(whoosh);
TL.sfx.coin.forEach(coin);
TL.sfx.tick.forEach(tick);
riser(...TL.sfx.riser);

// мягкий фейд и лимитер
let peak = 0;
for (let i = 0; i < N; i++) {
  const t = i / SR; const fade = Math.min(1, t / .01, (DUR - t) / .6);
  L[i] = Math.tanh(L[i] * 1.1) * fade; R[i] = Math.tanh(R[i] * 1.1) * fade;
  peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
}
const norm = .89 / peak;
const buf = Buffer.alloc(44 + N * 4);
buf.write("RIFF", 0); buf.writeUInt32LE(36 + N * 4, 4); buf.write("WAVEfmt ", 8);
buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22); buf.writeUInt32LE(SR, 24);
buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34); buf.write("data", 36); buf.writeUInt32LE(N * 4, 40);
for (let i = 0; i < N; i++) {
  buf.writeInt16LE(Math.round(L[i] * norm * 32767), 44 + i * 4);
  buf.writeInt16LE(Math.round(R[i] * norm * 32767), 46 + i * 4);
}
fs.mkdirSync(path.join(__dirname, "out"), { recursive: true });
fs.writeFileSync(path.join(__dirname, "out", "music_sfx.wav"), buf);
console.log("ok", (N / SR).toFixed(2) + "s");
