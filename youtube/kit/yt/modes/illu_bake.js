// Режим «Живая иллюстрация» (ролик №3, владелец 11.10: «карусель мне нравится, собирай ролик»; «хочу, чтобы всё было
// максимально круто и в движении… модельку курьера на карте… и так почти к каждой фразе»). Сцена — иллюстрация в стиле
// одобренной карусели (youtube/03-banks-pay-you/carousel/art.js), которая живёт: камера ездит между частями сцены, предметы и
// подписи появляются на словах голоса, персонажи двигаются, дождь, монеты, свет. Без 3D.
// Сцены описывает ролик: window.SCENES[name] = { bg(d) → статичный SVG (строится один раз), fg(t, d, h) → живой SVG (каждый кадр,
//   под камерой), hud(t, d, h) → подписи поверх (не двигаются с камерой), events(d, dur) → звуки }.
// data: { scene, at: {метка: локальная секунда} (из слов голоса), cam: [{at|t, x, y, s, d}] — куда смотрит камера (точка сцены
//   в центре кадра, масштаб), с какого момента и за сколько секунд переезжает }.
(function () {
  const ease = (x) => { x = Math.max(0, Math.min(1, x)); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
  YT.mode("illu", {
    css: `
    .yt-illu { background: #070b17; overflow: hidden; }
    .yt-illu .cam { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; transform-origin: 0 0; will-change: transform; }
    .yt-illu .bgL { will-change: transform; }   /* запекание: неподвижный фон — свой слой, растрируется один раз */
    .yt-illu svg { position: absolute; left: 0; top: 0; overflow: visible; }
    `,
    build(root, d, ctx) {
      const S = window.SCENES[d.scene]; if (!S) throw new Error("нет сцены " + d.scene);
      const P = root._p = { S };
      P.cam = ctx.U.el("div", "cam", null, root);
      P.cam.innerHTML = `<svg class="bgL" width="1920" height="1080">${A.defs()}${S.bg ? S.bg(d) : ""}</svg><svg class="fg" width="1920" height="1080"></svg>`;
      P.fg = P.cam.querySelector(".fg");
      root.insertAdjacentHTML("beforeend", `<svg class="hud" width="1920" height="1080"></svg><svg width="1920" height="1080" style="pointer-events:none"><radialGradient id="vigI" cx="50%" cy="50%" r="75%"><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".55"/></radialGradient><rect width="1920" height="1080" fill="url(#vigI)"/></svg>`);
      P.hud = root.querySelector(".hud");
      // камера: ключевые точки по времени
      P.cam0 = (d.cam || [{ t: 0, x: 960, y: 540, s: 1 }]).map(c => ({ ...c, t: c.at != null ? (d.at || {})[c.at] ?? c.t ?? 0 : c.t ?? 0 })).sort((a, b) => a.t - b.t);
    },
    render(root, t, d, ctx) {
      const P = root._p, S = P.S, U = ctx.U, at = d.at || {};
      // помощники для сцен: время метки, доля после метки, «выпрыгивание», печать текста
      const h = {
        t, dur: ctx.dur, at: (n, def = 1e9) => (typeof n === "number" ? n : at[n] ?? def),
        k: (n, dd = .5, e = U.out3) => e((t - h.at(n)) / dd),
        io: (n, dd = .8) => ease((t - h.at(n)) / dd),
        pop: (n, dd = .45) => U.back((t - h.at(n)) / dd),
        on: (n) => t >= h.at(n), since: (n) => t - h.at(n), U,
      };
      // камера: от прошлой точки к следующей за c.d секунд, плюс медленный наезд и дыхание
      const K = P.cam0; let cur = { ...K[0] };
      for (let i = 1; i < K.length; i++) { const c = K[i]; if (t < c.t) break; const e = ease((t - c.t) / (c.d || 1.2));
        cur = { x: c.x != null ? U.lerp(cur.x, c.x, e) : cur.x, y: c.y != null ? U.lerp(cur.y, c.y, e) : cur.y, s: c.s != null ? U.lerp(cur.s, c.s, e) : cur.s }; }
      const s = cur.s * (1 + .012 * Math.min(t, 20) / 20 * (d.push ?? 1)), dx = Math.sin(t * .31) * 6, dy = Math.cos(t * .27) * 4;
      h.cam = { x: cur.x, y: cur.y, s };
      P.cam.style.transform = `translate(${960 + dx}px, ${540 + dy}px) scale(${s.toFixed(4)}) translate(${-cur.x}px, ${-cur.y}px)`;
      P.fg.innerHTML = S.fg ? S.fg(t, d, h) : "";
      P.hud.innerHTML = S.hud ? S.hud(t, d, h) : "";
    },
    events(d, dur) { const S = (window.SCENES || {})[d.scene]; return S && S.events ? S.events(d, dur) : {}; },
  });
})();
