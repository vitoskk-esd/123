// Общее для форматов рилса #12 по референсам владельца (fmt/*.html): время, сцены, слова голоса. Всё детерминировано от t.
window.F = (function () {
  const TL = window.TL, $ = (id) => document.getElementById(id);
  const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x)), lerp = (a, b, k) => a + (b - a) * k;
  const out3 = (x) => 1 - Math.pow(1 - clamp(x), 3), out5 = (x) => 1 - Math.pow(1 - clamp(x), 5);
  const io3 = (x) => { x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
  const back = (x, s = 1.6) => { x = clamp(x) - 1; return x * x * ((s + 1) * x + s) + 1; };
  // сцена в момент t: локальное время и события от начала сцены
  function scene(t) {
    let i = TL.scenes.findIndex(s => t < s.t1); if (i < 0) i = TL.scenes.length - 1;
    const s = TL.scenes[i];
    return { i, s, id: s.id, lt: t - s.t0, d: s.t1 - s.t0, last: i === TL.scenes.length - 1,
      ev: Object.fromEntries(Object.entries(s.ev || {}).map(([k, v]) => [k, v - s.t0])), clicks: (s.clicks || []).map(c => ({ ...c, t: c.t - s.t0 })) };
  }
  // слова текущего куска: el перестраивается при смене куска; style(span, k, out, word, j) — вид слова
  // (k — 0…1 появление слова, out — 0…1 уход куска). Ещё не прозвучавшие слова не занимают места.
  const cache = new WeakMap();
  function words(el, t, style) {
    const ci = TL.chunks.findIndex(c => t >= c.t0 && t < c.t1);
    let st = cache.get(el); if (!st) cache.set(el, st = { ci: -2, spans: [] });
    if (ci !== st.ci) {
      st.ci = ci; el.innerHTML = ""; st.spans = [];
      if (ci >= 0) { const c = TL.chunks[ci];
        TL.words.slice(c.i0, c.i1 + 1).forEach((w, j) => { const s = document.createElement("span"); s.className = "w " + (w.c || ""); s.textContent = w.w;
          el.appendChild(s); st.spans.push({ s, w }); if (j < c.i1 - c.i0) el.appendChild(document.createTextNode(" ")); }); }
    }
    if (ci < 0) return null;
    const c = TL.chunks[ci], out = clamp((t - (c.t1 - .18)) / .18);
    st.spans.forEach(({ s, w }, j) => { const at = ci === 0 && j < 2 ? -1 : w.a - .05, k = clamp((t - at) / .3);
      s.style.display = t < at ? "none" : ""; style(s, k, out, w, j); });
    return c;
  }
  return { TL, $, clamp, lerp, out3, out5, io3, back, scene, words };
})();
