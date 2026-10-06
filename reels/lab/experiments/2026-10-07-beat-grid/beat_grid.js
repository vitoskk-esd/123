// Эксперимент 2026-10-07: попадают ли визуальные акценты (удары, свайпы, монеты) в долю музыки.
// node beat_grid.js -> таблица по рилсам 4–6: средний промах до ближайшей доли (1/8 такта) и как его
// уменьшает сдвиг фазы музыки (musicStart) — без изменения голоса и картинки.
const BPM = 120, BEAT = 60 / BPM, STEP = BEAT / 2; // сетка восьмыми — как бочка/хэт в audio.js
const reels = ["bank-calc-04", "cashback-cats-05", "drop-price-06"];
const err = (ts, m0) => ts.map(t => { const x = ((t - m0) % STEP + STEP) % STEP; return Math.min(x, STEP - x); });
const ms = a => Math.round(a.reduce((s, x) => s + x, 0) / a.length * 1000);
for (const r of reels) {
  const T = require(`../../../${r}/timeline.js`);
  const acc = [...(T.sfx.impact || []), ...(T.sfx.whoosh || []), ...(T.sfx.coin || []).slice(0, 1)].filter(t => t >= T.sfx.musicStart);
  const m0 = T.sfx.musicStart;
  let best = { d: 0, e: 1e9 };
  for (let d = -STEP / 2; d <= STEP / 2; d += 0.005) { const e = ms(err(acc, m0 + d)); if (e < best.e) best = { d, e }; }
  const now = err(acc, m0);
  console.log(`${r}: акцентов ${acc.length}; сейчас средний промах ${ms(now)} мс (макс ${Math.round(Math.max(...now) * 1000)}), ` +
              `в окне ±60 мс: ${now.filter(x => x <= .06).length}/${acc.length}; ` +
              `сдвиг фазы музыки ${Math.round(best.d * 1000)} мс → ${best.e} мс, в окне ±60 мс: ${err(acc, m0 + best.d).filter(x => x <= .06).length}/${acc.length}`);
}

// Вариант 2: подобрать темп (100–140 BPM) и фазу под акценты голоса — как монтажёр выбирает трек под речь.
console.log("\nПодбор темпа и фазы под акценты (сетка восьмыми):");
for (const r of reels) {
  const T = require(`../../../${r}/timeline.js`);
  const acc = [...(T.sfx.impact || []), ...(T.sfx.whoosh || []), ...(T.sfx.coin || []).slice(0, 1)].filter(t => t >= T.sfx.musicStart);
  let best = null;
  for (let bpm = 100; bpm <= 140; bpm += 1) {
    const step = 30 / bpm;
    for (let ph = 0; ph < step; ph += 0.005) {
      const e = acc.map(t => { const x = ((t - ph) % step + step) % step; return Math.min(x, step - x); });
      const hit = e.filter(x => x <= .04).length, mean = e.reduce((s, x) => s + x, 0) / e.length;
      if (!best || hit > best.hit || (hit === best.hit && mean < best.mean)) best = { bpm, ph, hit, mean };
    }
  }
  console.log(`${r}: ${best.bpm} BPM, фаза ${Math.round(best.ph * 1000)} мс → в окне ±40 мс ${best.hit}/${acc.length}, средний промах ${Math.round(best.mean * 1000)} мс`);
}

// Контроль: столько же случайных акцентов на том же отрезке — сколько попаданий даёт подбор темпа «на шум».
console.log("\nКонтроль на случайных акцентах (200 прогонов):");
let seed = 1; const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
for (const n of [6, 7, 10]) {
  let sum = 0;
  for (let k = 0; k < 200; k++) {
    const acc = Array.from({ length: n }, () => 3 + rand() * 20);
    let bestHit = 0;
    for (let bpm = 100; bpm <= 140; bpm++) { const step = 30 / bpm;
      for (let ph = 0; ph < step; ph += 0.005) { const h = acc.filter(t => { const x = ((t - ph) % step + step) % step; return Math.min(x, step - x) <= .04; }).length; if (h > bestHit) bestHit = h; } }
    sum += bestHit;
  }
  console.log(`${n} случайных акцентов: в среднем ${(sum / 200).toFixed(1)}/${n} в окне ±40 мс`);
}
