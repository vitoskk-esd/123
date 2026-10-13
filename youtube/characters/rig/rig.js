/* Риг Арбузова: состояние персонажа как функция времени t (детерминированно — для покадрового рендера движка).
   ArbuzovRig.state(t, track) → { svg-опции для Arbuzov.svg, css transform тела }
   track = {
     words: [{w, s, e}]       — слова голоса с временами (arbuzov_voice.py → words.json), рот по буквам;
     acts:  [{t, mood, arm, look}] — смены эмоции/жеста (держатся до следующей), переход «рывком» с отскоком;
     offset: 0                 — сдвиг слов (если перед голосом заставка)
   }
   Рот: гласные а/я → A, о/ё/у/ю → O, е/э/и/ы → E, м/б/п → M, прочие согласные → S; в паузах — закрыт (M) или рот эмоции.
   Моргание: псевдослучайно каждые ~2,6–4,2 с, 0,16 с. Тело: дыхание, кивок на начале слова, лёгкий наклон. */
(function () {
  const V = { а: "A", я: "A", о: "O", ё: "O", у: "O", ю: "O", е: "E", э: "E", и: "E", ы: "E", м: "M", б: "M", п: "M" };
  const ease = (x) => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 3);
  function viseme(t, words) {
    for (let i = 0; i < words.length; i++) {
      const w = words[i];
      if (t < w.s) return (w.s - t < .05 && i) ? "S" : null;              // перед словом — уже приоткрываем
      if (t <= w.e) {
        const L = w.w.toLowerCase().replace(/[^а-яё]/g, "");
        if (!L) return "S";
        const f = (t - w.s) / Math.max(.05, w.e - w.s), ch = L[Math.min(L.length - 1, Math.floor(f * L.length))];
        return V[ch] || "S";
      }
    }
    return null;
  }
  function blink(t) {
    // моменты моргания: детерминированная «случайность» от номера
    for (let k = 0; k < 400; k++) {
      const tk = .9 + k * 3.1 + ((k * 7919) % 11) * .1 - .5;
      if (t < tk) return 0;
      const d = t - tk;
      if (d < .16) return d < .08 ? d / .08 : (.16 - d) / .08;
    }
    return 0;
  }
  function state(t, tr) {
    const words = (tr.words || []).map(w => ({ ...w, s: w.s + (tr.offset || 0), e: w.e + (tr.offset || 0) }));
    const acts = tr.acts || [];
    let a = { t: -1e9, mood: "talk", arm: "down" }, prev = null;
    for (const x of acts) if (x.t <= t) { prev = a; a = { ...a, ...x }; }
    const sinceAct = t - a.t;
    const vis = viseme(t, words), speaking = vis !== null;
    // кивок на начале каждого слова, затухает 0,18 с
    let nod = 0;
    for (const w of words) if (t >= w.s && t - w.s < .18) nod = Math.max(nod, 1 - (t - w.s) / .18);
    const breathe = Math.sin(t * 2 * Math.PI / 1.7);
    const pop = sinceAct < .35 ? Math.sin(ease(sinceAct / .35) * Math.PI) : 0;          // отскок при смене жеста
    const y = breathe * 4 - nod * 7 - pop * 14, sx = 1 + nod * .012 + pop * .03, sy = 1 - nod * .018 + breathe * .006 - pop * .02;
    const rot = Math.sin(t * .7) * 1.4 + (speaking ? Math.sin(t * 5.3) * .6 : 0);
    return {
      opts: { mood: a.mood, arm: a.arm, look: a.look ?? (a.mood === "talk" ? 6 : 0), blink: blink(t), mouth: speaking ? vis : (a.mood === "talk" ? "M" : null) },
      transform: `translateY(${y.toFixed(2)}px) rotate(${rot.toFixed(2)}deg) scale(${sx.toFixed(4)},${sy.toFixed(4)})`,
      speaking,
    };
  }
  (typeof window !== "undefined" ? window : globalThis).ArbuzovRig = { state, viseme, blink };
})();
