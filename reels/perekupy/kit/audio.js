// Звук рилса из партитуры render.js: две дорожки — музыка и эффекты (их по-разному приглушает голос).
// node audio.js <score.json> <music.wav> <sfx.wav>
// Всё синтезируется в коде: никаких чужих семплов и вопросов с авторскими правами.
const fs = require("fs");
const [scorePath, musicOut, sfxOut] = process.argv.slice(2);
const SC = JSON.parse(fs.readFileSync(scorePath));
const SR = 48000, DUR = SC.dur, N = Math.ceil(SR * DUR);
const TAU = Math.PI * 2;
const mtof = m => 440 * Math.pow(2, (m - 69) / 12);
let seed = 1; const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296 * 2 - 1; };

function Bus() { return { L: new Float32Array(N), R: new Float32Array(N) }; }
const music = Bus(), sfx = Bus(), verb = Bus();     // verb — посыл в ревербератор
const put = (bus, i, v, pan = 0) => { if (i >= 0 && i < N) { bus.L[i] += v * Math.min(1, 1 - pan); bus.R[i] += v * Math.min(1, 1 + pan); } };
// двухполюсный резонансный фильтр (Чемберлен): lp/bp/hp за один проход
function SVF() { let lo = 0, bd = 0; return (x, f, q = .7) => { const F = 2 * Math.sin(Math.PI * Math.min(f, SR / 6) / SR); lo += F * bd; const hi = x - lo - bd / q; bd += F * hi; return { lo, bd, hi }; }; }
const env = (t, a, d) => t < 0 ? 0 : t < a ? t / a : Math.exp(-(t - a) * d);

// ===================== ЭФФЕКТЫ =====================
const S = {
  hit(t0, g) {           // вспышка: шумовой удар + низ
    const s = Math.floor(t0 * SR), f = SVF(); let ph = 0;
    for (let i = 0; i < SR * .7; i++) { const t = i / SR; ph += TAU * (40 + 90 * Math.exp(-t * 20)) / SR;
      const n = f(rnd(), 2500 * Math.exp(-t * 6) + 300).lo;
      const v = (Math.sin(ph) * .8 * env(t, .002, 6) + n * 1.4 * env(t, .001, 9)) * g * .8;
      put(sfx, s + i, v); put(verb, s + i, v * .3); }
  },
  impact(t0, g) {        // удар слова: саб + щелчок
    const s = Math.floor(t0 * SR); let ph = 0; const f = SVF();
    for (let i = 0; i < SR * .6; i++) { const t = i / SR; ph += TAU * (38 + 70 * Math.exp(-t * 25)) / SR;
      const click = f(rnd(), 4000).bd * env(t, .0005, 80);
      const v = (Math.tanh(Math.sin(ph) * 2) * env(t, .002, 7) * .9 + click * .9) * g * .75;
      put(sfx, s + i, v); put(verb, s + i, v * .15); }
  },
  boom(t0, g) {          // 808-бум на дроп/отсчёт
    const s = Math.floor(t0 * SR); let ph = 0;
    for (let i = 0; i < SR * 1.4; i++) { const t = i / SR; ph += TAU * (36 + 60 * Math.exp(-t * 14)) / SR;
      put(sfx, s + i, Math.tanh(Math.sin(ph) * 3) * env(t, .003, 2.6) * g * .7); }
  },
  glitch(t0, g) {        // цифровой срыв: рваные кусочки шума с понижением разрядности
    const s = Math.floor(t0 * SR), len = SR * .16; let hold = 0;
    for (let i = 0; i < len; i++) { if (i % 9 === 0) hold = Math.round(rnd() * 3) / 3;
      const gate = (Math.floor(i / (SR * .018)) % 3) !== 1 ? 1 : 0;
      put(sfx, s + i, hold * gate * .22 * Math.min(1, g) * (1 - i / len), (i % 400 < 200 ? .4 : -.4)); }
  },
  swish(t0, g) {
    const s = Math.floor(t0 * SR), len = SR * .28, f = SVF();
    for (let i = 0; i < len; i++) { const x = i / len; const v = f(rnd(), 600 + 5000 * x, 2).bd * Math.sin(Math.PI * x) ** 2 * .35 * g; put(sfx, s + i, v, x - .5); }
  },
  whoosh(t0, g) {
    const len = SR * .55, s = Math.floor(t0 * SR - len * .55), f = SVF();
    for (let i = 0; i < len; i++) { const x = i / len; const v = f(rnd(), 300 + 3500 * Math.sin(Math.PI * x), 1.2).bd * Math.sin(Math.PI * x) ** 2 * .7 * g;
      put(sfx, s + i, v, (x - .5) * 1.6); put(verb, s + i, v * .2); }
  },
  tick(t0, g) { const s = Math.floor(t0 * SR); for (let i = 0; i < SR * .025; i++) { const t = i / SR; put(sfx, s + i, Math.sin(TAU * 2600 * t) * Math.exp(-t * 220) * .3 * g, .25); } },
  type(t0, g) { const s = Math.floor(t0 * SR), f = SVF(); for (let i = 0; i < SR * .03; i++) { const t = i / SR; put(sfx, s + i, f(rnd(), 3500, 1.5).bd * Math.exp(-t * 160) * .5 * g, -.2); } },
  tap(t0, g) { const s = Math.floor(t0 * SR), f = SVF(); for (let i = 0; i < SR * .05; i++) { const t = i / SR; put(sfx, s + i, f(rnd(), 1200, 2).bd * Math.exp(-t * 90) * .7 * g); } },
  pop(t0, g) { const s = Math.floor(t0 * SR); let ph = 0; for (let i = 0; i < SR * .1; i++) { const t = i / SR; ph += TAU * (380 + 900 * t / .1) / SR; put(sfx, s + i, Math.sin(ph) * Math.exp(-t * 40) * .35 * g, .1); } },
  clack(t0, g) {         // перекидное табло: щелчок пластины + стук
    const s = Math.floor(t0 * SR), f = SVF(); const pan = rnd() * .5;
    for (let i = 0; i < SR * .04; i++) { const t = i / SR; put(sfx, s + i, (f(rnd(), 2200, 3).bd * 1.2 + Math.sin(TAU * 180 * t) * .5) * Math.exp(-t * 110) * .4 * g, pan); }
  },
  ping(t0, g) {          // уведомление: два колокольчика
    [[0, 88], [.11, 93]].forEach(([d, m]) => { const s = Math.floor((t0 + d) * SR), f0 = mtof(m);
      for (let i = 0; i < SR * .9; i++) { const t = i / SR; const v = (Math.sin(TAU * f0 * t) + .35 * Math.sin(TAU * f0 * 2.76 * t) * Math.exp(-t * 9)) * env(t, .002, 5) * .26 * g;
        put(sfx, s + i, v, .1); put(verb, s + i, v * .5); } });
  },
  lock(t0, g) { [[0, 81], [.07, 88]].forEach(([d, m]) => { const s = Math.floor((t0 + d) * SR); for (let i = 0; i < SR * .12; i++) { const t = i / SR;
      put(sfx, s + i, Math.sign(Math.sin(TAU * mtof(m) * t)) * Math.exp(-t * 30) * .12 * g); } }); S.impact(t0, .5 * g); },
  drop(t0, g) {          // мусорные посты падают: нисходящий свист + глухие удары
    const s = Math.floor(t0 * SR); let ph = 0;
    for (let i = 0; i < SR * .7; i++) { const t = i / SR; ph += TAU * (1400 * Math.exp(-t * 3)) / SR; put(sfx, s + i, Math.sin(ph) * .08 * (1 - t / .7) * g, .3); }
    [.25, .4, .52].forEach(d => S.impact(t0 + d, .35 * g));
  },
  scan(t0, dur) {        // радар: соно-пинги и гул
    const s = Math.floor(t0 * SR), len = Math.floor(dur * SR);
    for (let i = 0; i < len; i++) { const t = i / SR, p = t % .55;
      const v = Math.sin(TAU * 1250 * t) * Math.exp(-p * 9) * .1 + Math.sin(TAU * 55 * t) * .05 * Math.min(1, t * 3, (dur - t) * 3);
      put(sfx, s + i, v); put(verb, s + i, v * .6); }
  },
  ring(t0, dur) {        // гудок исходящего вызова 425 Гц: 0,8 с звук / пауза
    const s = Math.floor(t0 * SR), len = Math.floor(dur * SR);
    for (let i = 0; i < len; i++) { const t = i / SR, p = t % 2.2; const on = p < .8 ? Math.min(1, p * 50, (.8 - p) * 50) : 0;
      put(sfx, s + i, Math.sin(TAU * 425 * t) * on * .13); }
  },
  bleep(t0, dur) {       // цензура: тон 1 кГц на месте мата
    const s0 = Math.floor(t0 * SR), len = Math.floor(dur * SR);
    for (let i = 0; i < len; i++) put(sfx, s0 + i, Math.sin(TAU * 1000 * i / SR) * .32 * Math.min(1, i / 240, (len - i) / 240));
  },
  riser(t0, dur) {
    const s = Math.floor(t0 * SR), len = Math.floor(dur * SR), f = SVF(); let ph = 0;
    for (let i = 0; i < len; i++) { const x = i / len; ph += TAU * (180 + 1500 * x * x) / SR;
      const v = (f(rnd(), 400 + 7000 * x * x, 2).bd * .6 + Math.sin(ph) * .06) * x * x; put(sfx, s + i, v); put(verb, s + i, v * .3); }
  },
};
for (const e of SC.events) (S[e.type] || (() => console.error("нет звука", e.type)))(e.at, e.gain);

// ===================== МУЗЫКА =====================
const M = SC.music || { style: "tech", bpm: 110, start: 0 };
const B = 60 / M.bpm;
function kick(t0, g = 1) { const s = Math.floor(t0 * SR); let ph = 0;
  for (let i = 0; i < SR * .35; i++) { const t = i / SR; ph += TAU * (48 + 120 * Math.exp(-t * 30)) / SR; put(music, s + i, Math.tanh(Math.sin(ph) * 2.5) * env(t, .001, 9) * .6 * g); } }
function snare(t0, g = 1) { const s = Math.floor(t0 * SR), f = SVF();
  for (let i = 0; i < SR * .25; i++) { const t = i / SR; const v = (f(rnd(), 2200, .8).bd * 1.3 + Math.sin(TAU * 190 * t) * .4) * env(t, .001, 16) * .32 * g;
    put(music, s + i, v); put(verb, s + i, v * .35); } }
function hat(t0, g = 1, open = false) { const s = Math.floor(t0 * SR), f = SVF();
  for (let i = 0; i < SR * (open ? .22 : .05); i++) { const t = i / SR; put(music, s + i, f(rnd(), 9000, .7).hi * env(t, .0005, open ? 14 : 75) * .11 * g, .3); } }
function bass808(t0, m0, len, g = 1, m1 = null) {    // 808 с глиссандо к m1
  const s = Math.floor(t0 * SR); let ph = 0;
  for (let i = 0; i < SR * len; i++) { const t = i / SR, x = t / len;
    const m = m1 == null ? m0 : m0 + (m1 - m0) * Math.min(1, Math.max(0, (x - .55) / .3));
    ph += TAU * mtof(m) / SR;
    put(music, s + i, Math.tanh(Math.sin(ph) * 1.8) * env(t, .004, .9 / len) * Math.min(1, (len - t) * 30) * .42 * g); } }
function pluck(t0, m, g = 1, pan = 0) { const s = Math.floor(t0 * SR), f = SVF(); let ph = 0;
  for (let i = 0; i < SR * .35; i++) { const t = i / SR; ph += mtof(m) / SR;
    const v = f(((ph % 1) * 2 - 1), 400 + 3800 * Math.exp(-t * 14), 1.4).lo * env(t, .002, 9) * .16 * g; put(music, s + i, v, pan); put(verb, s + i, v * .45); } }
function cowbell(t0, m, g = 1) {                      // фонк-ковбелл: два квадрата через полосовой
  const s = Math.floor(t0 * SR), f = SVF(), f0 = mtof(m); let a = 0, b = 0;
  for (let i = 0; i < SR * .32; i++) { const t = i / SR; a += f0 / SR; b += f0 * 1.48 / SR;
    const sq = (a % 1 < .5 ? 1 : -1) + (b % 1 < .5 ? 1 : -1);
    const v = f(sq, f0 * 1.6, 2.5).bd * env(t, .001, 11) * .2 * g; put(music, s + i, v, -.15); put(verb, s + i, v * .4); } }
function pad(a, b, notes, g = 1, bright = .03) { const s = Math.floor(a * SR), len = Math.floor((b - a) * SR), f = SVF(); const ph = new Float64Array(notes.length * 2);
  for (let i = 0; i < len; i++) { const t = i / SR; let v = 0;
    notes.forEach((m, k) => { for (let d = 0; d < 2; d++) { ph[k * 2 + d] += mtof(m) * (d ? 1.005 : .995) / SR; v += (ph[k * 2 + d] % 1) * 2 - 1; } });
    const o = f(v, 300 + bright * 20000, .8).lo * .05 * g * Math.min(1, t * 2, (len / SR - t) * 2); put(music, s + i, o, .2); put(music, s + i, o * .9, -.2); put(verb, s + i, o * .4); } }

if (M.style === "tech") {          // тёмный трэп-грув: бочка, клэп на 3, хэты 1/8 с дробями, 808 по корню, плак-арпеджио
  const roots = [38, 38, 34, 36], arp = [[62, 65, 69, 72], [62, 65, 69, 74], [58, 62, 65, 70], [60, 64, 67, 72]];
  const end = DUR - 1.2;
  for (let bar = 0; M.start + bar * 4 * B < end; bar++) {
    const t = M.start + bar * 4 * B, ci = bar % 4;
    pad(t, t + 4 * B, [roots[ci] + 24, roots[ci] + 27 + (ci === 3 ? 1 : 0), roots[ci] + 31], .8, bar < 1 ? .02 : .04);
    if (bar === 0) continue;                   // первый такт — только пэд: голос слышен в хуке
    kick(t); kick(t + 2.5 * B, .8); snare(t + 2 * B);
    bass808(t, roots[ci], 2.4 * B, .9); bass808(t + 2.5 * B, roots[ci], 1.4 * B, .8, roots[ci] + (ci === 1 ? 3 : 0));
    for (let k = 0; k < 8; k++) hat(t + k * B / 2, k % 2 ? .6 : 1);
    if (bar % 2) for (let k = 0; k < 4; k++) hat(t + 3.5 * B + k * B / 8, .5);
    for (let k = 0; k < 16; k++) if (k % 3 !== 2) pluck(t + k * B / 4, arp[ci][k % 4], .7, (k % 2 ? .3 : -.3));
  }
}
if (M.style === "show") {          // викторина: пульс на одной ноте, на отсчёте — нарастание, на раскрытии — разрешение в мажор
  const [ta, tb] = M.tension, end = DUR - 1;
  for (let t = M.start, k = 0; t < end; t += B / 2, k++) {
    const inT = t >= ta && t < tb, after = t >= tb;
    const m = inT ? 38 + Math.floor((t - ta) / B) : after ? 43 : 38;
    bass808(t, m, B * .45, after ? .8 : .7);
    hat(t, inT ? 1 : .6); if (inT) hat(t + B / 4, .7);
    if (k % 4 === 0 && !inT) kick(t, .8);
    if (k % 8 === 4 && !inT) snare(t, .7);
    if (k % 2 === 0) pluck(t, (after ? [67, 71, 74, 79] : [62, 65, 69, 65])[(k / 2) % 4], after ? .8 : .5);
  }
  pad(M.start, ta, [50, 53, 57], .7); pad(ta, tb, [50, 53, 58], .9, .05); pad(tb, end, [55, 59, 62], .9, .05);
}
if (M.style === "phonk") {         // дрифт-фонк: ковбелл-мелодия, 808 с глиссандо, дроби хэтов, клэп на 3
  const D = M.drop, E = M.end;
  const mel = [[0, 73], [.75, 73], [1.5, 76], [2, 73], [2.75, 71], [3.5, 69], [4, 73], [4.75, 73], [5.5, 76], [6, 78], [6.5, 76], [7, 73], [7.5, 71]];
  for (let t = 0.05; t < D; t += 8 * B * .5) mel.forEach(([b, m]) => { const at = t + b * B * .5; if (at < D - .1) cowbell(at, m - 12, .55); });   // интро: тише и в полтемпа
  for (let bar = 0; D + bar * 4 * B < E; bar++) {
    const t = D + bar * 4 * B;
    kick(t, 1.1); kick(t + 1.5 * B, .9); snare(t + 2 * B, 1.1); snare(t + 3.75 * B, .5);
    const r = [37, 37, 40, 35][bar % 4];
    bass808(t, r, 1.4 * B, 1.1); bass808(t + 1.5 * B, r, 2.4 * B, 1, r + (bar % 2 ? 5 : -2));
    for (let k = 0; k < 8; k++) hat(t + k * B / 2, k % 2 ? .6 : 1);
    for (let k = 0; k < 3; k++) hat(t + 3 * B + k * B / 3, .7);            // триоль
    if (bar % 2) for (let k = 0; k < 6; k++) hat(t + 3.5 * B + k * B / 12, .45);
    mel.forEach(([b, m]) => cowbell(t + b * B / 2, m, .9));
  }
  pad(E, DUR, [49, 52, 56], 1, .03);          // финал под голос: мягкий аккорд
  bass808(E, 37, 2.4, .8);
}

if (M.style === "detective") {     // расследование: глубокий пульс, сухой клик-ритм, остинато баса, редкий тёмный мотив; на призыве светлеет
  const roots = [33, 33, 29, 28], motif = [[0, 76], [1.5, 74], [2, 72], [3, 71]];
  const end = DUR - .8, BR = M.bright ?? end;
  for (let bar = 0; M.start + bar * 4 * B < end; bar++) {
    const t = M.start + bar * 4 * B, ci = bar % 4, lit = t >= BR - .01;
    pad(t, Math.min(t + 4 * B, end), lit ? [57, 60, 64] : [roots[ci] + 24, roots[ci] + 27, roots[ci] + 31], .7, lit ? .05 : .025);
    for (let k = 0; k < 8; k++) {
      const at = t + k * B / 2; if (at >= end) break;
      bass808(at, lit ? 45 : roots[ci], B * .38, k % 2 ? .45 : .7);   // остинато восьмыми
      hat(at, k % 2 ? .35 : .55);
    }
    if (bar === 0) continue;                    // первый такт без ударных: хук слышен чисто
    kick(t, .75); kick(t + 2 * B, .6);
    snare(t + B, .35); snare(t + 3 * B, .45);
    if (bar % 2 === 1) motif.forEach(([b, m]) => pluck(t + b * B, lit ? m + 5 : m, .55, .2));
  }
}

if (M.style === "story") {         // история: до «прозрения» мягкий лоу-фай в миноре, после — плотнее и светлее
  const D = M.drop ?? DUR, E = M.end ?? DUR - .5;
  const prog = [[45, [57, 60, 64, 67]], [41, [53, 57, 60, 64]], [36, [55, 60, 64, 67]], [43, [55, 59, 62, 66]]];
  for (let bar = 0; M.start + bar * 4 * B < E; bar++) {
    const t = M.start + bar * 4 * B, [r, ch] = prog[bar % 4], after = t >= D - .01;
    pad(t, Math.min(t + 4 * B, E), ch.map(m => m - 12), after ? .9 : .7, after ? .05 : .022);
    bass808(t, r - 12, 1.8 * B, after ? .9 : .6); bass808(t + 2.5 * B, r - 12, 1.2 * B, after ? .8 : .5);
    if (bar === 0) continue;
    kick(t, after ? .9 : .6); if (after) kick(t + 2.5 * B, .7);
    snare(t + 2 * B, after ? .7 : .4);
    for (let k = 0; k < 8; k++) hat(t + k * B / 2 + (k % 2 ? B * .06 : 0), (k % 2 ? .4 : .6) * (after ? 1 : .7));   // свинг
    const arp = after ? [0, 2, 1, 3, 2, 1, 3, 0] : [0, 2, 1, 2];
    arp.forEach((n, k) => pluck(t + k * (4 * B / arp.length), ch[n] + (after ? 12 : 0), after ? .6 : .4, k % 2 ? .25 : -.25));
  }
  bass808(E, 33, 2, .6);
}

if (M.style === "toon") {          // мультик: «умпа» туба + аккорд на слабую долю, мелодия-ксилофон; mute — комедийная тишина, soft — тише
  const inR = (rs, t) => (rs || []).some(([a, b]) => t >= a && t < b);
  const E = M.end ?? DUR - .4;
  const prog = [[48, [60, 64, 67]], [43, [59, 62, 67]], [45, [60, 64, 69]], [43, [59, 62, 65]]];
  const mel = [72, 76, 79, 76, 77, 74, 71, 74, 72, 76, 79, 84, 83, 79, 74, 76];
  const wood = (t0, g) => { const s0 = Math.floor(t0 * SR); for (let i = 0; i < SR * .06; i++) { const x = i / SR; put(music, s0 + i, (Math.sin(TAU * 1250 * x) + .5 * Math.sin(TAU * 2100 * x)) * Math.exp(-x * 70) * .16 * g, -.3); } };
  for (let k = 0, t = M.start; t < E; k++, t = M.start + k * B) {
    if (inR(M.mute, t)) continue;
    const soft = inR(M.soft, t), g = soft ? .45 : 1, [r, ch] = prog[Math.floor(k / 4) % 4];
    if (k % 2 === 0) bass808(t, r - 12 + (k % 4 === 2 ? 7 : 0), B * .45, .8 * g);       // «ум»
    else ch.forEach(m => pluck(t, m, .35 * g, 0));                                   // «па»
    if (!soft) { wood(t + B / 2, 1); if (k % 4 === 3) snare(t + B / 2, .25); }
    if (!soft || k % 2 === 0) pluck(t, mel[k % 16] + 12, (soft ? .3 : .55), .3);      // ксилофон
  }
}

if (M.style === "bed") {           // тихая тёмная подложка: глубокий гул + мягкий пульс бочки, без мелодии — только фон под голос
  const E = M.end ?? DUR - .5, roots = [33, 33, 31, 28];
  for (let bar = 0; bar * 4 * B < E; bar++) {
    const t = bar * 4 * B, r = roots[bar % 4];
    pad(t, Math.min(t + 4 * B, E), [r + 12, r + 19], .9, .012);       // тёмный пэд без верхов
    bass808(t, r, 3.6 * B, .55);                                      // долгий саб на такт
    if (bar > 0) { kick(t, .35); kick(t + 2 * B, .25); for (let k = 0; k < 4; k++) hat(t + k * B + B / 2, .25); }
  }
}

// обрывы музыки (комедийный стоп) для любого стиля: M.mute = [[a, b], …], края — 20 мс
for (const [a, b] of (M.mute || [])) {
  const i0 = Math.floor(a * SR), i1 = Math.floor(b * SR), f = Math.floor(.02 * SR);
  for (let i = Math.max(0, i0 - f); i < Math.min(N, i1 + f); i++) {
    const g = i < i0 ? (i0 - i) / f : i >= i1 ? (i - i1) / f : 0;
    music.L[i] *= g; music.R[i] *= g;
  }
}

// ===================== РЕВЕРБ (Шрёдер) и запись =====================
function reverb(src, dst, mix) {
  const combs = [1557, 1617, 1491, 1422, 1277, 1356].map(d => ({ d: Math.round(d * SR / 44100), buf: null, i: 0, lp: 0 }));
  const aps = [225, 556, 441].map(d => ({ d: Math.round(d * SR / 44100), buf: null, i: 0 }));
  for (const ch of ["L", "R"]) {
    combs.forEach((c, k) => { c.buf = new Float32Array(c.d + (ch === "R" ? 23 * k : 0)); c.i = 0; c.lp = 0; });
    aps.forEach(a => { a.buf = new Float32Array(a.d); a.i = 0; });
    const x = src[ch], y = dst[ch];
    for (let n = 0; n < N; n++) {
      let o = 0;
      for (const c of combs) { const v = c.buf[c.i]; c.lp = v * .6 + c.lp * .4; c.buf[c.i] = x[n] + c.lp * .8; c.i = (c.i + 1) % c.buf.length; o += v; }
      o /= combs.length;
      for (const a of aps) { const v = a.buf[a.i]; const w = o + v * .5; a.buf[a.i] = w; o = v - w * .5; a.i = (a.i + 1) % a.buf.length; }
      y[n] += o * mix;
    }
  }
}
reverb(verb, sfx, .9);
function write(bus, path) {
  let peak = 1e-9; for (let i = 0; i < N; i++) peak = Math.max(peak, Math.abs(bus.L[i]), Math.abs(bus.R[i]));
  const k = .89 / peak, buf = Buffer.alloc(44 + N * 4);
  buf.write("RIFF", 0); buf.writeUInt32LE(36 + N * 4, 4); buf.write("WAVEfmt ", 8); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22);
  buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34); buf.write("data", 36); buf.writeUInt32LE(N * 4, 40);
  for (let i = 0; i < N; i++) { const f = Math.min(1, i / 480, (N - i) / (SR * .4));
    buf.writeInt16LE(Math.round(Math.tanh(bus.L[i] * k) * f * 32767), 44 + i * 4); buf.writeInt16LE(Math.round(Math.tanh(bus.R[i] * k) * f * 32767), 46 + i * 4); }
  fs.writeFileSync(path, buf);
}
write(music, musicOut); write(sfx, sfxOut);
console.log("audio ok", M.style, SC.events.length, "events", DUR + "s");
