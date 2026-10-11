// Рилс #12 — кадр в момент t: window.renderAt(t). Монтаж по референсам владельца: слова голоса на экране по одному (из размытия),
// сцены-карточки сменяются плавным наездом с размытием, курсор кликает по элементам. Всё время — из timeline.js (build.py).
(function () {
  const TL = window.TL, $ = (id) => document.getElementById(id);
  const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x)), lerp = (a, b, k) => a + (b - a) * k;
  const out3 = (x) => 1 - Math.pow(1 - clamp(x), 3), out5 = (x) => 1 - Math.pow(1 - clamp(x), 5);
  const io3 = (x) => { x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
  const back = (x, s = 1.5) => { x = clamp(x) - 1; return x * x * ((s + 1) * x + s) + 1; };
  const appear = (e, t, at, dy = 40, from = .94) => { const k = out5((t - at) / .45); e.style.opacity = clamp((t - at) / .2);
    e.style.transform = `translateY(${(1 - k) * dy}px) scale(${lerp(from, 1, k)})`; e.style.filter = `blur(${(10 * (1 - k)).toFixed(1)}px)`; };

  // ---------- кинетический текст ----------
  const txt = $("txt"); let chunkCur = -1, spans = [];
  function renderText(t) {
    let ci = TL.chunks.findIndex(c => t >= c.t0 && t < c.t1);
    if (ci !== chunkCur) {
      chunkCur = ci; txt.innerHTML = ""; spans = [];
      if (ci >= 0) { const c = TL.chunks[ci];
        TL.words.slice(c.i0, c.i1 + 1).forEach((w, j) => { const s = document.createElement("span"); s.className = "w " + (w.c || ""); s.textContent = w.w;
          txt.appendChild(s); spans.push({ s, a: w.a }); if (j < c.i1 - c.i0) txt.appendChild(document.createTextNode(" ")); });
        txt.style.top = (c.pos === "low" ? 1260 : 820) + "px"; }
    }
    if (ci < 0) return;
    const c = TL.chunks[ci], out = clamp((t - (c.t1 - .2)) / .2);
    spans.forEach(({ s, a }, j) => {
      const at = ci === 0 && j < 2 ? -1 : a - .06;   // кадр 0 — уже с первыми словами
      const k = out3((t - at) / .3);
      s.style.display = t < at ? "none" : "";   // ещё не прозвучавшие слова не занимают места — строка всегда по центру
      s.style.opacity = t < at ? 0 : clamp(k * 1.4) * (1 - out);
      s.style.filter = `blur(${(14 * (1 - k) + 12 * out).toFixed(1)}px)`;
      s.style.transform = `translateY(${((1 - k) * 34 - out * 26).toFixed(1)}px)`;
    });
  }

  // ---------- курсор ----------
  const cur = $("cur"), ring = $("ring");
  function centerOf(id) { const r = $(id).getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; }
  function renderCursor(t, s) {
    cur.style.opacity = 0; ring.style.opacity = 0;
    const cl = (s.clicks || []); if (!cl.length) return;
    let i = cl.findIndex(c => t < c.t + .6); if (i < 0) return;
    const c = cl[i], [tx, ty] = centerOf(c.id), prev = i > 0 ? centerOf(cl[i - 1].id) : [tx + 220, ty + 300];
    const startMove = i > 0 ? Math.max(cl[i - 1].t + .15, c.t - .7) : c.t - .8;
    if (t < startMove - (i > 0 ? 0 : .2)) return;
    const k = io3((t - startMove) / Math.max(.2, c.t - startMove - .05));
    const x = lerp(prev[0], tx, k), y = lerp(prev[1], ty, k);
    const press = c.click === false ? 0 : Math.sin(Math.PI * clamp((t - c.t + .08) / .2));
    cur.style.opacity = clamp((t - startMove + .2) / .2) * (1 - clamp((t - c.t - .45) / .15));
    cur.style.transform = `translate(${x - 8}px, ${y - 6}px) scale(${1 - .18 * press})`; cur.style.transformOrigin = "8px 6px";
    if (c.click !== false) { const kr = clamp((t - c.t) / .45); ring.style.left = tx + "px"; ring.style.top = ty + "px";
      ring.style.opacity = t >= c.t && kr < 1 ? 1 - kr : 0; ring.style.transform = `scale(${.4 + .9 * kr})`; }
  }

  // ---------- сцены ----------
  const SC = {
    s_card(t, e, s) { appear($("c_bank"), t, s.t0 === 0 ? -1 : e.card, 60);   // кадр 0 — карта уже на месте
      const st = $("c_stamp"), k = clamp((t - e.old) / .16);
      st.style.opacity = t < e.old ? 0 : 1; st.style.transform = `rotate(-8deg) scale(${lerp(2.1, 1, out5(k))})`; },
    s_push(t, e) { const p = $("p_card"), k = out5((t - e.no) / .5); p.style.opacity = clamp((t - e.no) / .15); p.style.transform = `translateY(${(1 - k) * -180}px)`; },
    s_list(t, e) { ["l1", "l2", "l3"].forEach((id, i) => { const at = [e.a, e.b, e.c][i]; appear($(id), t, at, 30); $(id).className = "row" + (t >= at && t < at + 1.2 ? " hl" : ""); }); },
    s_search(t, e) { const q = TL.query, t1 = Math.max(.6, e.min - .5), n = Math.round(clamp((t - .1) / (t1 - .1)) * q.length);
      $("q_tx").textContent = q.slice(0, n); $("q_car").style.opacity = t < t1 + .1 || Math.floor(t * 2.2) % 2 ? 1 : 0;
      appear($("q_bar"), t, 0, 30); const b = $("q_badge"), k = back(clamp((t - e.min) / .4)); b.style.opacity = t < e.min ? 0 : 1; b.style.transform = `scale(${lerp(.6, 1, k)})`; },
    s_cab(t, e) { $("c_gos").style.background = t > e.gos ? "#2b5bd7" : "#e7eefc"; $("c_gos").style.color = t > e.gos ? "#fff" : "#2b5bd7";
      $("c_gos").textContent = t > e.gos ? "Вход выполнен ✓" : "Войти через Госуслуги"; $("c_item").className = t > e.open ? "on" : ""; },
    s_tbl(t, e) { ["t1", "t2", "t3", "t4"].forEach((id, i) => appear($(id), t, e.banks + i * .3, 20, 1));
      const b = $("t_badge"), k = back(clamp((t - e.year) / .4)); b.style.opacity = t < e.year ? 0 : 1; b.style.transform = `scale(${lerp(.6, 1, k)}) rotate(-3deg)`; },
    s_ok(t, e) { appear($("k1"), t, .05, 20, 1); appear($("k2"), t, .25, 20, 1); appear($("k3"), t, e.new - .2, 20, 1);
      const p = Math.sin(Math.PI * clamp((t - e.mine) / .45)); $("k3").style.transform += ` scale(${1 + .05 * p})`; $("k3").style.boxShadow = t > e.mine ? "0 0 0 4px #12a150, 0 20px 50px rgba(18,161,80,.25)" : ""; },
    s_end(t, e) { const b = $("e_btn"), p = Math.sin(Math.PI * clamp((t - e.link) / .3)); b.style.transform = `scale(${1 - .05 * p})`;
      b.style.background = t > e.link ? "#2b5bd7" : "#3d6cff"; },
    s_none() {},
  };
  window.renderAt = (t) => {
    let i = TL.scenes.findIndex(s => t < s.t1); if (i < 0) i = TL.scenes.length - 1;
    TL.scenes.forEach((s, k) => { $(s.id).style.visibility = k === i ? "visible" : "hidden"; });
    const s = TL.scenes[i], lt = t - s.t0, d = s.t1 - s.t0, root = $(s.id);
    const ev = Object.fromEntries(Object.entries(s.ev || {}).map(([k, v]) => [k, v - s.t0]));
    SC[s.id](lt, ev, s);
    // вход: наезд из 0,9 с размытием; выход: пролёт вперёд (1 → 1,12) с размытием; внутри — медленный наезд
    const kin = s.t0 > 0 ? out5(lt / .4) : 1, kout = io3(clamp((lt - (d - .3)) / .3)) * (i < TL.scenes.length - 1 ? 1 : 0);
    const sc = lerp(.9, 1, kin) * (1 + .035 * clamp(lt / d)) * lerp(1, 1.12, kout);
    root.style.transform = `scale(${sc})`; root.style.opacity = Math.min(clamp(kin * 1.6), 1 - kout);
    root.style.filter = `blur(${(12 * (1 - kin) + 14 * kout).toFixed(1)}px)`;
    renderText(t); renderCursor(lt, { clicks: (s.clicks || []).map(c => ({ ...c, t: c.t - s.t0 })) });
    // фон медленно дышит
    [...$("bg").children].forEach((b, k) => { b.style.transform = `translate(${Math.sin(t * .3 + k * 2) * 60}px, ${Math.cos(t * .25 + k) * 50}px)`; });
    $("grain").style.transform = `translate(${(Math.sin(t * 91) * 40) | 0}px, ${(Math.cos(t * 77) * 40) | 0}px)`;
  };
  document.fonts.ready.then(() => { window.renderAt(0); window.__ready = true; });
})();
