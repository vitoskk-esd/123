// Режим «Поиск» (образец modes3.html?mode=search): окно браузера, запрос печатается, выпадают подсказки, затем ответ
// с выделенной главной мыслью проявляется по словам.
// data: { tab, query, sugg: [..], answer: {label, html}, tq, cps, tSug, tAns, wps }
YT.mode("search", {
  css: `
  .yt-search { background: radial-gradient(900px 600px at 50% 30%, rgba(61,108,255,.16), transparent 70%), #0f1115; }
  .yt-search .br { position: absolute; left: 160px; top: 90px; width: 1600px; height: 900px; border-radius: 26px; background: #17191f; overflow: hidden; border: 1px solid #2a2d35;
    box-shadow: 0 50px 120px rgba(0,0,0,.6); transform-origin: 50% 30%; }
  .yt-search .tabs { height: 66px; background: #101217; display: flex; align-items: center; gap: 12px; padding: 0 22px; }
  .yt-search .tabs i { width: 16px; height: 16px; border-radius: 50%; background: #3a3d45; }
  .yt-search .tabs span { margin-left: 30px; padding: 12px 26px; border-radius: 14px 14px 0 0; background: #17191f; font: 600 22px "Mont"; color: #c8ccd4; }
  .yt-search .q { margin: 90px auto 0; width: 1100px; padding: 30px 40px; border-radius: 50px; background: #22252d; border: 2px solid #3d6cff;
    box-shadow: 0 0 0 8px rgba(61,108,255,.15); font: 600 44px "Mont"; color: #eef1f6; display: flex; gap: 22px; align-items: center; min-height: 118px; }
  .yt-search .q .lens { width: 34px; height: 34px; border: 5px solid #8a93a6; border-radius: 50%; flex: none; }
  .yt-search .q i { width: 4px; height: 52px; background: #3d6cff; margin-left: -14px; }
  .yt-search .sg { width: 1100px; margin: 0 auto; background: #1d2027; border-radius: 0 0 30px 30px; overflow: hidden; }
  .yt-search .sg div { padding: 18px 44px; font: 500 34px "Mont"; color: #aab0bb; } .yt-search .sg div b { color: #eef1f6; }
  .yt-search .res { width: 1100px; margin: 40px auto 0; padding: 30px 40px; border-radius: 24px; background: #1d2027; border-left: 8px solid #ff5a6e; opacity: 0; }
  .yt-search .res small { font: 600 24px "Mont"; color: #6fa0ff; } .yt-search .res p { font: 600 34px/1.4 "Mont"; color: #e6e9ef; margin-top: 8px; }
  .yt-search .res p b { background: rgba(255,90,110,.25); color: #fff; padding: 0 4px; } .yt-search .res p .big { display: block; font: 900 72px "Unb"; color: #fff; letter-spacing: -.03em; margin: 6px 0; background: none; padding: 0; }
  `,
  build(root, d, ctx) {
    const { U } = ctx, br = root._br = U.el("div", "br", null, root);
    U.el("div", "tabs", `<i></i><i></i><i></i><span>${d.tab || d.query + " — поиск"}</span>`, br);
    const q = U.el("div", "q", '<span class="lens"></span><span class="tx"></span><i></i>', br); root._tx = q.querySelector(".tx"); root._car = q.querySelector("i");
    root._sg = U.el("div", "sg", null, br); root._sgs = (d.sugg || []).map(s => U.el("div", null, `<b>${d.query}</b> ${s}`, root._sg));
    if (d.answer) { root._res = U.el("div", "res", `<small>${d.answer.label || "Ответ"}</small><p>${d.answer.html}</p>`, br); root._ws = U.words(root._res.querySelector("p")); }
  },
  render(root, t, d, ctx) {
    const { U, dur } = ctx, tq = d.tq ?? .3, cps = d.cps || 16, tEnd = tq + d.query.length / cps;
    root._br.style.transform = `scale(${1.02 - .02 * U.out5(t / .8) + .02 * U.clamp(t / dur)})`;
    root._tx.textContent = U.typed(d.query, (t - tq) / (tEnd - tq));
    root._car.style.opacity = t < tEnd + .1 ? 1 : U.blink(t);
    const tSug = d.tSug ?? tEnd + .1, tAns = d.tAns ?? tSug + 1.2;
    root._sgs.forEach((s, i) => { const k = U.out3((t - tSug - i * .08) / .25); s.style.opacity = k * (t > tAns ? 1 - U.clamp((t - tAns) / .3) * .6 : 1);
      s.style.transform = `translateY(${(1 - k) * -10}px)`; s.style.background = i === 0 && t > tSug + .5 ? "#262a33" : ""; });
    root._sg.style.maxHeight = t < tSug ? "0px" : "";
    if (root._res) { const k = U.out5((t - tAns) / .5); root._res.style.opacity = U.clamp((t - tAns) / .2); root._res.style.transform = `translateY(${(1 - k) * 30}px)`;
      U.showWords(root._ws, Math.floor((t - tAns - .15) * (d.wps || 9))); }
  },
});
