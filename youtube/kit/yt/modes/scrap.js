// Режим «Коллаж-скрапбук» (образец modes3.html?mode=scrap): бумажный фон в точку, вырезки с полутоном, скотч, стикеры,
// стрелки и подписи от руки. Каждый элемент «шлёпается» на стол в свой момент (пружина без отскока назад, лёгкий доворот).
// data: { items: [{k: "cut"|"big"|"stk"|"hand"|"tape"|"arrow", x, y, w, h, r, html, bg, color, t, d}] }
//   cut — вырезка (bg: "ht" — полутон, или CSS-фон); big — огромное число; stk — круглый стикер; hand — подпись от руки;
//   tape — скотч; arrow — стрелка (d — путь SVG в координатах кадра, рисуется за 0,4 с).
YT.mode("scrap", {
  css: `
  .yt-scrap { background: #e9e3d6; background-image: radial-gradient(rgba(0,0,0,.06) 1px, transparent 1px); background-size: 6px 6px; }
  .yt-scrap .cam { position: absolute; inset: 0; transform-origin: 50% 50%; }
  .yt-scrap .cut { position: absolute; box-shadow: 0 14px 26px rgba(0,0,0,.25); padding: 40px; font-family: "Mont"; }
  .yt-scrap .ht { background: radial-gradient(circle, #1b1b1b 34%, transparent 36%) 0 0 / 12px 12px, #ffd84a; }
  .yt-scrap .tape { position: absolute; width: 170px; height: 46px; background: rgba(255,240,170,.75); z-index: 5; }
  .yt-scrap .big { position: absolute; font: 900 170px/.9 "Unb"; letter-spacing: -.05em; color: #1b1b1b; white-space: nowrap; }
  .yt-scrap .stk { position: absolute; padding: 16px 26px; border-radius: 999px; font: 900 34px "Unb"; box-shadow: 0 10px 20px rgba(0,0,0,.25); z-index: 6; white-space: nowrap; }
  .yt-scrap .hand { position: absolute; font: 800 italic 44px "Mont"; color: #d42a2a; z-index: 7; white-space: nowrap; }
  .yt-scrap svg { position: absolute; left: 0; top: 0; overflow: visible; z-index: 7; }
  `,
  build(root, d, ctx) {
    const { U } = ctx, cam = root._cam = U.el("div", "cam", null, root);
    const ns = "http://www.w3.org/2000/svg", svg = document.createElementNS(ns, "svg"); svg.setAttribute("width", ctx.W); svg.setAttribute("height", ctx.H);
    root._items = (d.items || []).map(it => {
      if (it.k === "arrow") { const p = document.createElementNS(ns, "path"); p.setAttribute("d", it.d); p.setAttribute("fill", "none"); p.setAttribute("stroke", it.color || "#d42a2a");
        p.setAttribute("stroke-width", it.w || 7); p.setAttribute("stroke-linecap", "round"); p.setAttribute("stroke-linejoin", "round"); svg.appendChild(p); return { it, p }; }
      const e = U.el("div", it.k === "cut" && it.bg === "ht" ? "cut ht" : it.k, it.html || "", cam);
      Object.assign(e.style, { left: it.x + "px", top: it.y + "px" });
      if (it.w) e.style.width = it.w + "px"; if (it.h) e.style.height = it.h + "px";
      if (it.bg && it.bg !== "ht") e.style.background = it.bg; if (it.color) e.style.color = it.color;
      return { it, e };
    });
    cam.appendChild(svg);
  },
  render(root, t, d, ctx) {
    const { U, dur } = ctx;
    root._cam.style.transform = `scale(${1.04 - .04 * U.clamp(t / dur)}) rotate(${-.4 + .8 * U.clamp(t / dur)}deg)`;
    root._items.forEach(({ it, e, p }) => {
      if (p) { U.draw(p, U.io3((t - it.t) / .4)); return; }
      const k = U.clamp((t - it.t) / .35), r = it.r || 0;
      e.style.opacity = t < it.t ? 0 : 1;
      if (it.k === "hand") { e.style.clipPath = `inset(-20% ${(100 * (1 - U.clamp((t - it.t) / .5))).toFixed(1)}% -20% -5%)`; e.style.transform = `rotate(${r}deg)`; return; }
      const s = U.lerp(it.k === "tape" ? 1.08 : 1.35, 1, U.out5(k));
      e.style.transform = `rotate(${r + (1 - U.out3(k)) * (r >= 0 ? 6 : -6)}deg) scale(${s})`;
      e.style.boxShadow = it.k === "cut" || it.k === "stk" ? `0 ${14 + 26 * (1 - k)}px ${26 + 30 * (1 - k)}px rgba(0,0,0,${.25 + .15 * (1 - k)})` : "";
    });
  },
});
