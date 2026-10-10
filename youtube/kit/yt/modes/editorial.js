// Режим «Журнальная инфографика» (образец styles.html?style=editorial): светлая бумага, красная метка, заголовок как в журнале,
// столбики со счётчиками и источник внизу. Вход: метка → заголовок по словам → линейка → столбики по очереди → источник.
// data: { kick, title, bars: [{v, label, color, fmt}], stats: [{label, v, color, prefix, suffix, text}], src, t0 }
//   stats.text — показать готовой строкой без счётчика (диапазоны «1 000–2 000 ₽»); t0 < 0 — всё уже на месте (для склейки по предмету).
//   bars — сравнение столбиками (высота от максимума; v — число, fmt — подпись, если нужна не v); stats — 2–3 крупных числа.
YT.mode("editorial", {
  ownTitle: true,   // своя метка главы (kick) — общую подпись главы не показываем
  css: `
  .yt-editorial { background: #f2ede3; color: #14161a; }
  .yt-editorial .bar0 { position: absolute; left: 110px; top: 0; width: 120px; height: 18px; background: #e3120b; transform-origin: 0 0; }
  .yt-editorial .kick { position: absolute; left: 110px; top: 80px; font: 800 26px "Mont"; letter-spacing: .14em; color: #e3120b; }
  .yt-editorial h1 { position: absolute; left: 110px; top: 128px; width: 1300px; font: 800 64px/1.08 "Mont"; letter-spacing: -.02em; }
  .yt-editorial h1 .w { display: inline-block; }
  .yt-editorial .rule { position: absolute; left: 110px; right: 110px; top: 330px; height: 2px; background: #14161a; transform-origin: 0 0; }
  .yt-editorial .chart { position: absolute; left: 220px; top: 440px; width: 1480px; height: 400px; }
  .yt-editorial .b { position: absolute; bottom: 0; width: 230px; }
  .yt-editorial .v { position: absolute; left: -40px; right: -40px; text-align: center; font: 900 54px "Unb"; letter-spacing: -.03em; white-space: nowrap; }
  .yt-editorial .n { position: absolute; left: -40px; right: -40px; top: 100%; margin-top: 18px; text-align: center; font: 600 24px/1.25 "Mont"; color: #3b3a36; }
  .yt-editorial .stats { position: absolute; left: 110px; top: 420px; display: flex; gap: 120px; }
  .yt-editorial .st small { display: block; font: 600 28px "Mont"; color: #6b6458; } .yt-editorial .st b { display: block; font: 900 96px "Unb"; letter-spacing: -.04em; white-space: nowrap; }
  .yt-editorial .src { position: absolute; left: 110px; bottom: 70px; width: 1500px; font: 500 22px/1.4 "Mont"; color: #6b6458; }
  `,
  build(root, d, ctx) {
    const { U } = ctx;
    root._P = { bar0: U.el("div", "bar0", null, root), kick: U.el("div", "kick", d.kick || "", root), h1: U.el("h1", null, d.title || "", root), rule: U.el("div", "rule", null, root) };
    root._P.ws = U.words(root._P.h1);
    if (d.bars) {
      const ch = U.el("div", "chart", null, root), max = Math.max(...d.bars.map(b => b.v)) || 1, step = 1480 / d.bars.length;
      root._P.bars = d.bars.map((b, i) => { const e = U.el("div", "b", `<div class="v" style="color:${b.color || "#14161a"}"></div><div class="n">${b.label}</div>`, ch);
        Object.assign(e.style, { left: i * step + (step - 230) / 2 + "px", background: b.color || "#9b9486" });
        return { b, e, v: e.querySelector(".v"), h: Math.max(4, 400 * b.v / max) }; });
    }
    if (d.stats) { const s = U.el("div", "stats", null, root);
      root._P.stats = d.stats.map(st => { const e = U.el("div", "st", `<small>${st.label}</small><b style="color:${st.color || "#14161a"}"></b>`, s); return { st, e, b: e.querySelector("b") }; }); }
    root._P.src = U.el("div", "src", d.src || "", root);
  },
  render(root, t, d, ctx) {
    const { U } = ctx, P = root._P, t0 = d.t0 || 0;
    P.bar0.style.transform = `scaleX(${U.out5((t - t0) / .4)})`;
    P.kick.style.opacity = U.clamp((t - t0 - .1) / .3); P.kick.style.transform = `translateY(${(1 - U.out3((t - t0 - .1) / .4)) * 14}px)`;
    P.ws.forEach((w, i) => { const k = U.out5((t - t0 - .25 - i * .06) / .45); w.style.opacity = k; w.style.transform = `translateY(${(1 - k) * 34}px)`; });
    const tb = t0 + .45 + P.ws.length * .06;
    P.rule.style.transform = `scaleX(${U.io3((t - tb) / .6)})`;
    (P.bars || []).forEach(({ b, e, v, h }, i) => {
      const k = U.out5((t - tb - .3 - i * .35) / .8);
      e.style.height = Math.max(4, h * k) + "px"; v.style.top = "-74px"; v.style.opacity = U.clamp(k * 3);
      v.textContent = b.fmt ? b.fmt : U.fmt(b.v * k) + (b.suffix || "");
      e.querySelector(".n").style.opacity = U.clamp((k - .3) * 2);
    });
    (P.stats || []).forEach(({ st, e, b }, i) => { const k = U.out5((t - tb - .2 - i * .45) / .9);
      e.style.opacity = U.clamp(k * 2); e.style.transform = `translateY(${(1 - k) * 40}px)`;
      b.textContent = st.text || (st.prefix || "") + U.fmt(st.v * k) + (st.suffix || ""); });
    // медленный наезд на всю страницу, чтобы кадр не стоял (переход движка поверх может заменить transform)
    root.style.transformOrigin = "40% 50%"; root.style.transform = `scale(${1 + .025 * U.clamp(t / ctx.dur)})`;
    P.src.style.opacity = U.clamp((t - tb - 1.2) / .4);
  },
});
