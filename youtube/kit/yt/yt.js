// YouTube-движок «режимы» (Y0). Ролик = таймлайн из отрезков {mode, t0, t1, data, tin}; каждый режим — модуль в modes/*.js,
// который строит свой слой (build) и рисует его детерминированно от локального времени (render). Между отрезками — переходы
// без 3D: засветка (flash), пролёт сквозь экран (zoom), склейка по предмету (match), просто склейка (cut).
// Правило ритма (владелец 09.10): один режим не дольше ~90 с подряд, «Ночной офис» — 1–2 отрезка на ролик.
// Подключение: <link yt.css> <script yt.js> <script modes/*.js> … YT.play({size, foot, chapters, segs}).
// Отрезок: {mode, t0, t1, data, tin: {type: "flash"|"zoom"|"match"|"cut", dur, at: [x, y], key}, marks: {ключ: селектор}}.
// ?label=1 — подпись режима и времени в углу (для каруселей-раскадровок).
(function () {
  const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x)), lerp = (a, b, k) => a + (b - a) * k;
  const U = {
    clamp, lerp,
    seg: (t, a, d) => clamp((t - a) / d),                         // доля пройденного отрезка [a, a+d]
    io3: (x) => { x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; },
    out3: (x) => 1 - Math.pow(1 - clamp(x), 3),
    out5: (x) => 1 - Math.pow(1 - clamp(x), 5),
    in3: (x) => Math.pow(clamp(x), 3),
    // пружина «прилетел и встал»: 0 → 1 с одним мягким перелётом (детерминированно, без состояния)
    back: (x, s = 1.4) => { x = clamp(x) - 1; return x * x * ((s + 1) * x + s) + 1; },
    bell: (x) => Math.sin(Math.PI * clamp(x)),
    rnd: (seed) => { let s = seed % 2147483647 || 1; return () => (s = (s * 16807) % 2147483647) / 2147483647; },
    el: (tag, cls, html, parent) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; if (parent) parent.appendChild(e); return e; },
    // текст по словам: оборачивает слова в <span class="w">, сохраняя разметку (<b>, <span class=hl> и т. п.)
    words: (root) => {
      const out = [], walk = (n) => { [...n.childNodes].forEach(c => {
        if (c.nodeType === 3) { const parts = c.textContent.split(/(\s+)/); const f = document.createDocumentFragment();
          parts.forEach(p => { if (!p) return; if (/^\s+$/.test(p)) f.appendChild(document.createTextNode(p)); else { const s = document.createElement("span"); s.className = "w"; s.textContent = p; f.appendChild(s); out.push(s); } });
          c.replaceWith(f); }
        else if (c.nodeType === 1) walk(c); }); };
      walk(root); return out;
    },
    showWords: (ws, n) => ws.forEach((w, i) => { w.style.opacity = i < n ? 1 : 0; }),
    // печать строки: n символов + мигающая каретка (мигание от t — детерминированно)
    typed: (s, k) => s.slice(0, Math.round(clamp(k) * s.length)),
    blink: (t) => (Math.floor(t * 2.2) % 2 === 0 ? 1 : 0),
    // отрисовка линии SVG: path.style по доле k
    draw: (p, k) => { const L = p._len || (p._len = p.getTotalLength()); p.style.strokeDasharray = L; p.style.strokeDashoffset = L * (1 - clamp(k)); },
    fmt: (v) => Math.round(v).toLocaleString("ru-RU").replace(/\s/g, " "),
  };
  const MODES = {};
  const NAMES = { office: "Ночной офис", editorial: "Журнальная инфографика", phone: "Телефон крупно", board: "Маркерная доска",
    search: "Поиск", scrap: "Коллаж-скрапбук", swipe: "Свайп-карточки", voice: "Голосовое сообщение", ai: "ИИ-ассистент" };

  function mode(name, def) {
    MODES[name] = def;
    if (def.css) { const s = document.createElement("style"); s.textContent = def.css; document.head.appendChild(s); }
  }

  // проверка ритма по правилам владельца; возвращает список предупреждений
  function lint(segs) {
    const w = [], fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
    let run = null;
    segs.forEach((s, i) => {
      const d = s.t1 - s.t0;
      if (!MODES[s.mode]) w.push(`${fmt(s.t0)} неизвестный режим «${s.mode}»`);
      if (i && Math.abs(s.t0 - segs[i - 1].t1) > 1e-6) w.push(`${fmt(s.t0)} разрыв или наложение отрезков`);
      if (d < 2) w.push(`${fmt(s.t0)} отрезок короче 2 с (${d.toFixed(1)} с) — мелькание`);
      if (run && run.mode === s.mode) run.d += d; else run = { mode: s.mode, t0: s.t0, d };
      if (run.d > 90) w.push(`${fmt(run.t0)} режим «${NAMES[s.mode] || s.mode}» идёт ${run.d.toFixed(0)} с подряд (> 90 с)`);
    });
    const office = segs.filter(s => s.mode === "office").length;
    if (office > 2) w.push(`«Ночной офис» — ${office} отрезка (правило: 1–2 на ролик)`);
    return [...new Set(w)];
  }

  function play(tl) {
    const [W, H] = tl.size || [1920, 1080], segs = tl.segs;
    document.documentElement.style.setProperty("--W", W + "px"); document.documentElement.style.setProperty("--H", H + "px");
    const stage = U.el("div", "yt-stage", null, document.body);
    stage.style.width = W + "px"; stage.style.height = H + "px";
    segs.forEach((s, i) => {
      const def = MODES[s.mode]; if (!def) throw new Error("нет режима " + s.mode);
      s.i = i; s.dur = s.t1 - s.t0; s.root = U.el("div", "yt-layer yt-" + s.mode, null, stage);
      s.ctx = { W, H, U, seg: s, dur: s.dur };
      def.build(s.root, s.data || {}, s.ctx);
      // метки для склейки по предмету: marks: {ключ: CSS-селектор внутри слоя}
      Object.entries(s.marks || {}).forEach(([key, sel]) => { const e = s.root.querySelector(sel); if (e) e.dataset.match = key; });
      s.root.style.visibility = "hidden";
    });
    // оверлеи: свет перехода, виньетка, зерно, плашка-дисклеймер, подпись главы, отладочная подпись режима
    const leak = U.el("div", "yt-leak", null, stage), vig = U.el("div", "yt-vig", null, stage), grain = U.el("div", "yt-grain", null, stage);
    const foot = tl.foot ? U.el("div", "yt-foot", tl.foot, stage) : null;
    const chap = U.el("div", "yt-chap", "<i></i><span></span>", stage);
    const q = new URLSearchParams(location.search), LABEL = q.get("label");
    const lab = LABEL ? U.el("div", "yt-label", "", stage) : null;
    const T = segs[segs.length - 1].t1;
    window.TL = { duration: T, fps: tl.fps || 30, size: [W, H] };
    window.YT_LINT = lint(segs); window.YT_LINT.forEach(m => console.warn("ритм:", m));

    const half = (s) => (s && s.tin && s.tin.type !== "cut" && s.tin.type !== "match" ? (s.tin.dur || .6) / 2 : 0);
    const matchCache = {};
    function renderSeg(s, lt) { const r = s.root; r.style.transform = ""; r.style.opacity = ""; r.style.filter = ""; r.style.transformOrigin = "";
      MODES[s.mode].render(r, lt, s.data || {}, s.ctx); }

    window.renderAt = (t) => {
      let cur = segs.findIndex(s => t < s.t1); if (cur < 0) cur = segs.length - 1;
      segs.forEach(s => { s.root.style.visibility = "hidden"; }); stage.style.background = "";
      leak.style.opacity = 0;
      const s = segs[cur], prev = segs[cur - 1], next = segs[cur + 1];
      // какие слои видны: текущий; предыдущий — пока идёт вторая половина перехода в текущий; следующий — первая половина перехода
      const show = [[s, t - s.t0]];
      let tr = null;   // активный переход {a, b, k, type, tin}
      if (prev && s.tin && t - s.t0 < half(s)) tr = { a: prev, b: s, k: .5 + (t - s.t0) / (2 * half(s)), tin: s.tin };
      else if (next && next.tin && s.t1 - t < half(next)) tr = { a: s, b: next, k: .5 - (s.t1 - t) / (2 * half(next)), tin: next.tin };
      if (tr) {
        const { a, b, k, tin } = tr, B = b.t0;
        if (tin.type === "flash") {
          const on = k < .5 ? a : b; show.length = 0; show.push([on, t - on.t0]);
          renderSeg(on, t - on.t0); on.root.style.visibility = "visible";
          const e = U.bell(k); leak.style.opacity = e; leak.style.background = tin.color ||
            "radial-gradient(1200px 900px at 70% 30%, rgba(255,236,200,1), rgba(255,170,90,.85) 45%, rgba(255,90,60,.0) 80%), rgba(255,240,220,.55)";
          on.root.style.filter = `brightness(${1 + 1.1 * e}) saturate(${1 - .4 * e}) blur(${(4 * e).toFixed(1)}px)`;
        } else if (tin.type === "zoom") {
          // пролёт сквозь точку (экран телефона / монитора): старый слой разгоняется в точку, новый вылетает из неё и тормозит
          const [ox, oy] = tin.at || [W / 2, H / 2], on = k < .5 ? a : b; renderSeg(on, t - on.t0); on.root.style.visibility = "visible";
          on.root.style.transformOrigin = `${ox}px ${oy}px`;
          if (k < .5) { const e = U.in3(k / .5); on.root.style.transform = `scale(${lerp(1, 7, e)})`; on.root.style.filter = `blur(${(14 * e).toFixed(1)}px) brightness(${1 + .8 * e})`; on.root.style.opacity = 1 - U.clamp((k - .38) / .12); }
          else { const e = U.out3((k - .5) / .5); on.root.style.transform = `scale(${lerp(.55, 1, e)})`; on.root.style.filter = `blur(${(10 * (1 - e)).toFixed(1)}px) brightness(${1 + .6 * (1 - e)})`; on.root.style.opacity = U.clamp((k - .5) / .1); }
          leak.style.opacity = .35 * U.bell(k); leak.style.background = "radial-gradient(600px 600px at " + ox + "px " + oy + "px, rgba(220,240,255,1), transparent 70%)";
        }
      } else {
        renderSeg(s, t - s.t0); s.root.style.visibility = "visible";
        // склейка по предмету: первые tin.dur секунд новый слой «садится» от положения предмета прошлого кадра к своему
        if (prev && s.tin && s.tin.type === "match" && t - s.t0 < (s.tin.dur || .7)) {
          const key = s.i; let m = matchCache[key];
          if (!m) {
            renderSeg(prev, prev.dur); prev.root.style.visibility = "visible";
            const pe = prev.root.querySelector(`[data-match="${s.tin.key}"]`), pr = pe && pe.getBoundingClientRect();
            prev.root.style.visibility = "hidden";
            renderSeg(s, 0); const ne = s.root.querySelector(`[data-match="${s.tin.key}"]`), nr = ne && ne.getBoundingClientRect();
            m = matchCache[key] = pr && nr ? { sc: pr.width / nr.width, tx: pr.left + pr.width / 2, ty: pr.top + pr.height / 2, nx: nr.left + nr.width / 2, ny: nr.top + nr.height / 2 } : { none: 1 };
            renderSeg(s, t - s.t0);
          }
          if (!m.none) {
            const e = U.out5((t - s.t0) / (s.tin.dur || .7)), sc = lerp(m.sc, 1, e);
            const dx = lerp(m.tx - m.sc * m.nx, 0, e), dy = lerp(m.ty - m.sc * m.ny, 0, e);
            s.root.style.transformOrigin = "0 0"; s.root.style.transform = `translate(${dx}px, ${dy}px) scale(${sc})`;
            s.root.style.filter = `blur(${(3 * (1 - e)).toFixed(1)}px)`;
            stage.style.background = getComputedStyle(s.root).backgroundColor;   // если слой меньше кадра — поля цвета его фона
          }
        }
      }
      // подпись главы: въезжает на 3,2 с после начала главы
      const ch = (tl.chapters || []).filter(c => c.t <= t).pop();
      if (ch && !MODES[segs[cur].mode].ownTitle) { const k = t - ch.t, e = U.out5(k / .5), o = U.clamp(k / .3) * (1 - U.clamp((k - 3.2) / .5));
        chap.style.opacity = o; chap.style.transform = `translateX(${(1 - e) * -40}px)`; chap.querySelector("span").textContent = ch.label;
        chap.querySelector("i").style.width = `${54 * e}px`; } else chap.style.opacity = 0;
      grain.style.transform = `translate(${(Math.sin(t * 91) * 40) | 0}px, ${(Math.cos(t * 77) * 40) | 0}px)`;
      if (lab) { const on = segs[cur]; lab.textContent = `${NAMES[on.mode] || on.mode} · ${Math.floor(t / 60)}:${(t % 60).toFixed(1).padStart(4, "0")}` + (tr ? ` · переход: ${({ flash: "засветка", zoom: "пролёт сквозь экран" })[tr.tin.type]}` : (prev && s.tin && s.tin.type === "match" && t - s.t0 < (s.tin.dur || .7) ? " · склейка по предмету" : "")); }
    };
    document.fonts.ready.then(() => { window.renderAt(0); window.__ready = true; });
  }

  window.YT = { mode, play, lint, U, NAMES, MODES };
})();
