// Режим «Кино-титры» (владелец 11.10: «я хочу киношный моушен с текстами, который живёт и двигается»). Трейлерная типографика:
// буквы проявляются из размытия по одной, фраза всё время медленно наезжает и «дышит» (трекинг расширяется), фон живёт —
// световые лучи, пыль в луче, отражения-эхо слов на заднем плане с параллаксом; по тексту проходит блик, на ключевых словах —
// анаморфная вспышка; между фразами — перевод фокуса (старая уходит в размытие, новая собирается из него); широкоэкранные
// полосы, зерно. Без 3D. Всё — от локального времени t.
// data: { cards: [{ t0, t1, drift: [dx, dy], lines: [{ text, font: "big"|"serif"|"caps"|"num", size, y, x, color, glow, stagger, d }],
//   echo: [{ text, y, size, speed }], flare: t, sweep: t, count: { line, from, to, t0, t1, suffix } }], letterbox }
(function () {
  const FONTS = { big: (s) => `900 ${s}px/1 "Unb"`, serif: (s) => `italic 600 ${s}px/1.05 "Serif"`, caps: (s) => `700 ${s}px/1 "Mont"`, num: (s) => `900 ${s}px/1 "Unb"` };
  YT.mode("cine", {
    css: `
    @font-face { font-family: "Serif"; src: url("/youtube/kit/fonts/playfair-cyrillic-600-italic.woff2"); font-style: italic; font-weight: 600; unicode-range: U+0400-045F, U+2116; }
    @font-face { font-family: "Serif"; src: url("/youtube/kit/fonts/playfair-latin-600-italic.woff2"); font-style: italic; font-weight: 600; }
    .yt-cine { background: radial-gradient(1400px 900px at 50% 60%, #121a2c, #05070d 70%); }
    .yt-cine .cam { position: absolute; inset: 0; transform-origin: 50% 50%; }
    .yt-cine .beam { position: absolute; width: 900px; height: 2600px; top: -700px; transform-origin: 50% 0; filter: blur(60px); mix-blend-mode: screen; }
    .yt-cine .dust { position: absolute; border-radius: 50%; background: #fff3dc; }
    .yt-cine .card { position: absolute; inset: 0; }
    .yt-cine .ln { position: absolute; left: 0; right: 0; text-align: center; white-space: nowrap; color: #f3efe6; }
    .yt-cine .ln .c { display: inline-block; white-space: pre; }
    .yt-cine .echo { position: absolute; white-space: nowrap; font: 900 220px/1 "Unb"; color: rgba(255,255,255,.035); letter-spacing: .1em; }
    .yt-cine .sweep { position: absolute; inset: 0; pointer-events: none; mix-blend-mode: overlay; }
    .yt-cine .flare { position: absolute; left: 0; right: 0; height: 6px; pointer-events: none; mix-blend-mode: screen; }
    .yt-cine .flare i { position: absolute; left: 50%; top: 50%; width: 260px; height: 260px; margin: -130px; border-radius: 50%; }
    .yt-cine .lb { position: absolute; left: 0; right: 0; height: 112px; background: #000; z-index: 30; }
    `,
    build(root, d, ctx) {
      const { U, W, H } = ctx, P = root._p = { cards: [] };
      const cam = P.cam = U.el("div", "cam", null, root);
      // световые лучи (медленно качаются) и пыль в них
      P.beams = [[-200, 18, "rgba(255,214,150,.30)"], [700, -10, "rgba(120,170,255,.24)"], [1400, 14, "rgba(255,214,150,.20)"]].map(([x, r, c]) => {
        const b = U.el("div", "beam", null, cam); Object.assign(b.style, { left: x + "px", background: `linear-gradient(180deg, ${c}, transparent 75%)` }); return { b, r }; });
      const rnd = U.rnd(17);
      P.dust = Array.from({ length: 90 }, () => { const z = rnd(), e = U.el("div", "dust", null, cam), s = 2 + z * 9;
        Object.assign(e.style, { width: s + "px", height: s + "px", filter: z > .7 ? `blur(${(z - .7) * 14}px)` : "" });
        return { e, x: rnd() * W, y: rnd() * H, z, vx: (rnd() - .5) * 14, vy: -4 - rnd() * 10, ph: rnd() * 6 }; });
      (d.cards || []).forEach(c => {
        const el = U.el("div", "card", null, cam), C = { c, el, lines: [], echo: [] };
        (c.echo || []).forEach(e => { const x = U.el("div", "echo", e.text, el); x.style.top = (e.y ?? 200) + "px"; if (e.size) x.style.fontSize = e.size + "px"; C.echo.push({ x, e }); });
        c.lines.forEach(L => { const ln = U.el("div", "ln", null, el); ln.style.top = L.y + "px"; ln.style.font = FONTS[L.font || "big"](L.size || 120);
          if (L.color) ln.style.color = L.color; if (L.ls) ln.style.letterSpacing = L.ls;
          const chars = [...L.text].map(ch => U.el("span", "c", ch, ln)); C.lines.push({ L, ln, chars }); });
        if (c.sweep != null) C.sweep = U.el("div", "sweep", null, el);
        if (c.flare != null) { C.flare = U.el("div", "flare", "<i></i>", el); C.flare.style.top = (c.flareY ?? 540) + "px"; }
        P.cards.push(C);
      });
      if (d.letterbox !== false) { const a = U.el("div", "lb", null, root), b = U.el("div", "lb", null, root); a.style.top = 0; b.style.bottom = 0; P.lb = [a, b]; }
    },
    render(root, t, d, ctx) {
      const { U, W, H } = ctx, P = root._p;
      // камера всего кадра: очень медленный наезд и покачивание — кадр не бывает статичным
      P.cam.style.transform = `scale(${1.02 + .02 * Math.sin(t * .18)}) translate(${Math.sin(t * .23) * 14}px, ${Math.cos(t * .19) * 8}px) rotate(${Math.sin(t * .11) * .25}deg)`;
      P.beams.forEach(({ b, r }, i) => { b.style.transform = `rotate(${r + Math.sin(t * .25 + i) * 4}deg)`; b.style.opacity = .75 + .25 * Math.sin(t * .6 + i * 2); });
      P.dust.forEach(p => { const x = ((p.x + p.vx * t * (1 + p.z) + Math.sin(t * .7 + p.ph) * 20) % (W + 40) + W + 40) % (W + 40) - 20, y = ((p.y + p.vy * t * (1 + p.z)) % (H + 40) + H + 40) % (H + 40) - 20;
        p.e.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`; p.e.style.opacity = (.15 + .5 * p.z) * (.6 + .4 * Math.sin(t * 1.3 + p.ph)); });
      P.cards.forEach(({ c, el, lines, echo, sweep, flare }) => {
        const lt = t - c.t0, dur = c.t1 - c.t0;
        if (lt < -.5 || lt > dur + .5) { el.style.visibility = "hidden"; return; }
        el.style.visibility = "visible";
        // перевод фокуса: собирается из размытия на входе, уходит в размытие на выходе (выход быстрее входа)
        const kin = U.out3(lt / .7), kout = U.in3(U.clamp((lt - (dur - .45)) / .45));
        const life = U.clamp(lt / dur), [dx, dy] = c.drift || [0, 0];
        el.style.transform = `translate(${(dx * life).toFixed(1)}px, ${(dy * life).toFixed(1)}px) scale(${(1 + .06 * life + .05 * kout).toFixed(4)})`;
        el.style.filter = `blur(${(10 * (1 - kin) + 18 * kout).toFixed(1)}px)`; el.style.opacity = Math.min(1, kin * 1.4) * (1 - kout);
        echo.forEach(({ x, e }) => { x.style.transform = `translateX(${(-lt * (e.speed ?? 40) + (e.x ?? 0)).toFixed(1)}px)`; });
        lines.forEach(({ L, ln, chars }) => {
          const st = L.stagger ?? .035, d0 = L.d ?? 0;
          chars.forEach((ch, i) => { const a = d0 + i * st, k = U.out5((lt - a) / .7);
            ch.style.opacity = U.clamp((lt - a) / .35); ch.style.filter = `blur(${(16 * (1 - k)).toFixed(1)}px)`;
            ch.style.transform = `translateY(${((1 - k) * 34).toFixed(1)}px) scale(${(1 + .25 * (1 - k)).toFixed(3)})`; });
          // «дыхание»: трекинг медленно расширяется всю жизнь фразы
          ln.style.letterSpacing = `${(parseFloat(L.ls || "-0.03") + .05 * U.out3(life)).toFixed(3)}em`;
          if (L.glow) ln.style.textShadow = `0 0 ${(30 + 20 * Math.sin(t * 2)).toFixed(0)}px ${L.glow}`;
        });
        if (c.count) { const q = c.count, ln = lines[q.line], k = U.io3((lt - q.t0) / (q.t1 - q.t0)), txt = (q.prefix || "") + U.fmt(U.lerp(q.from, q.to, k)) + (q.suffix ?? " ₽");
          if (ln.chars.length !== txt.length) { ln.ln.textContent = ""; ln.chars = [...txt].map(ch => U.el("span", "c", ch, ln.ln)); }
          ln.chars.forEach((ch, i) => { if (ch.textContent !== txt[i]) ch.textContent = txt[i]; }); }
        if (sweep) { const k = U.io3((lt - c.sweep) / 1.1); sweep.style.background = `linear-gradient(105deg, transparent ${(k * 140 - 30).toFixed(1)}%, rgba(255,255,255,.55) ${(k * 140 - 20).toFixed(1)}%, transparent ${(k * 140 - 10).toFixed(1)}%)`;
          sweep.style.opacity = lt > c.sweep && k < 1 ? 1 : 0; }
        if (flare) { const k = lt - c.flare, e = k < 0 ? 0 : Math.exp(-k * 2.2) * U.clamp(k / .08);
          flare.style.opacity = e; flare.style.background = `linear-gradient(90deg, transparent, rgba(120,190,255,${.9 * e}) 30%, rgba(255,255,255,${e}) 50%, rgba(120,190,255,${.9 * e}) 70%, transparent)`;
          flare.style.transform = `scaleX(${(.4 + .6 * U.out3(k / .4)).toFixed(3)})`;
          flare.querySelector("i").style.background = `radial-gradient(closest-side, rgba(255,255,255,${.85 * e}), rgba(120,190,255,${.35 * e}), transparent)`; }
      });
    },
    // звук: «вдох» (swish) на каждой фразе, удар на вспышке, подъём (riser) перед финальной картой
    events(d) {
      const E = { swish: [], impact: [], riser: [], ticks: [] }, cs = d.cards || [];
      cs.forEach((c, i) => { E.swish.push(c.t0 + .05); if (c.flare != null) E.impact.push(c.t0 + c.flare);
        if (c.count) E.ticks.push([c.t0 + c.count.t0, c.t0 + c.count.t1]); if (i === cs.length - 1 && i) E.riser.push([c.t0 - 1.4, c.t0]); });
      return E;
    },
  });
})();
