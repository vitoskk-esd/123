// Режим «Маркерная доска» (образец modes.html?mode=board): доска в переговорке ночью, схема рисуется маркером по времени,
// надписи «пишутся» шторкой слева направо, камера медленно наезжает (или по кадрам focus).
// data: { paths: [{d, c, w, t, dur}], texts: [{x, y, html, c, size, t, dur, r}], focus: [{t, x, y, s}] }
//   координаты — в системе доски 1500×830; c — цвет: "blue" | "green" | "red" | любой CSS.
YT.mode("board", {
  css: `
  .yt-board { background: linear-gradient(90deg, #04060b, #0a1222 40%, #04060b); }
  .yt-board .win { position: absolute; left: 0; top: 0; width: 360px; height: 1080px; filter: blur(5px); opacity: .7;
    background: repeating-linear-gradient(0deg, rgba(255,210,140,.35) 0 6px, transparent 6px 34px), linear-gradient(180deg, #0b1630, #050a14); }
  .yt-board .cam { position: absolute; inset: 0; transform-origin: 50% 50%; }
  .yt-board .wb { position: absolute; left: 210px; top: 110px; width: 1500px; height: 830px; border-radius: 10px; border: 18px solid #b9c0c8;
    background: linear-gradient(160deg, #f4f6f8, #dfe3e8); box-shadow: 0 50px 100px rgba(0,0,0,.7), inset 0 0 120px rgba(0,0,0,.08); }
  .yt-board .wb::after { content: ""; position: absolute; inset: 0; background: linear-gradient(110deg, transparent 30%, rgba(255,255,255,.5) 42%, transparent 52%); pointer-events: none; }
  .yt-board svg { position: absolute; inset: 0; overflow: visible; }
  .yt-board .hw { position: absolute; font: 800 italic 40px/1.2 "Mont"; white-space: nowrap; }
  .yt-board .tray { position: absolute; left: 240px; top: 950px; width: 1440px; height: 26px; background: #9aa2ab; border-radius: 6px; }
  .yt-board .mk { position: absolute; top: 925px; width: 150px; height: 30px; border-radius: 10px; }
  `,
  build(root, d, ctx) {
    const { U } = ctx, C = { blue: "#1d2b55", green: "#1a8a4c", red: "#d42a2a" }, col = (c) => C[c] || c || C.blue;
    U.el("div", "win", null, root);
    const cam = root._cam = U.el("div", "cam", null, root), wb = U.el("div", "wb", null, cam);
    U.el("div", "tray", null, cam);
    [["#1a8a4c", 480], ["#d42a2a", 680], ["#1d2b55", 880]].forEach(([c, x]) => { U.el("div", "mk", null, cam).style.cssText = `left:${x}px;background:linear-gradient(90deg,${c} 0 30%,#e9edf2 30%)`; });
    const ns = "http://www.w3.org/2000/svg", svg = document.createElementNS(ns, "svg"); svg.setAttribute("width", 1500); svg.setAttribute("height", 830); wb.appendChild(svg);
    root._paths = (d.paths || []).map(p => { const e = document.createElementNS(ns, "path"); e.setAttribute("d", p.d); e.setAttribute("fill", "none");
      e.setAttribute("stroke", col(p.c)); e.setAttribute("stroke-width", p.w || 9); e.setAttribute("stroke-linecap", "round"); e.setAttribute("stroke-linejoin", "round"); svg.appendChild(e); return { p, e }; });
    root._texts = (d.texts || []).map(x => { const e = U.el("div", "hw", x.html, wb);
      Object.assign(e.style, { left: x.x + "px", top: x.y + "px", color: col(x.c), fontSize: (x.size || 40) + "px", transform: `rotate(${x.r || 0}deg)` }); return { x, e }; });
  },
  render(root, t, d, ctx) {
    const { U, dur } = ctx;
    root._paths.forEach(({ p, e }) => U.draw(e, U.io3((t - p.t) / (p.dur || .6))));
    root._texts.forEach(({ x, e }) => { const k = U.clamp((t - x.t) / (x.dur || .5)); e.style.clipPath = `inset(-20% ${(100 * (1 - k)).toFixed(1)}% -20% -5%)`; });
    let c = { x: 960, y: 540, s: 1 + .05 * U.clamp(t / dur) };
    if (d.focus && d.focus.length) {
      const f = d.focus; let i = f.findIndex((q, k) => k + 1 < f.length && t < f[k + 1].t); if (i < 0) i = f.length - 1;
      const a = f[i], b = f[Math.min(i + 1, f.length - 1)], k = b === a ? 0 : U.io3((t - (b.t - .7)) / .7);
      c = { x: U.lerp(a.x, b.x, k), y: U.lerp(a.y, b.y, k), s: U.lerp(a.s, b.s, k) };
    }
    root._cam.style.transform = `translate(${960 - c.x * c.s}px, ${540 - c.y * c.s}px) scale(${c.s})`;
    root._cam.style.transformOrigin = "0 0";
  },
});
