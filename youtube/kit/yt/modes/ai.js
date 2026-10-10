// Режим «ИИ-ассистент» (образец modes5.html?mode=ai): тёмный чат, вопрос пользователя, три точки «думает», ответ печатается
// по словам с кареткой; выделения (.hl — риск, .ok — правильно, .big — крупный итог) проявляются вместе со словами.
// data: { q, a (HTML ответа), tq, ta, wps, inp }
YT.mode("ai", {
  css: `
  .yt-ai { background: #0d0d0f; }
  .yt-ai .col { position: absolute; left: 400px; top: 80px; width: 1120px; }
  .yt-ai .me { margin-left: auto; width: fit-content; max-width: 780px; padding: 26px 32px; border-radius: 30px; background: #2a2a2e; font: 600 36px/1.35 "Mont"; color: #f1f1f3; opacity: 0; }
  .yt-ai .bot { display: flex; gap: 26px; margin-top: 50px; }
  .yt-ai .lg { width: 64px; height: 64px; border-radius: 50%; flex: none; background: conic-gradient(from 0deg, #7c4dff, #00c8ff, #5cf0a0, #ffd84a, #ff5a6e, #7c4dff); opacity: 0; }
  .yt-ai .ans { font: 500 34px/1.5 "Mont"; color: #e8e8ea; position: relative; } .yt-ai .ans b { color: #fff; } .yt-ai .ans li { margin: 10px 0 0 36px; }
  .yt-ai .ans .hl { background: rgba(255,90,110,.22); padding: 0 6px; border-radius: 6px; } .yt-ai .ans .ok { background: rgba(92,240,160,.18); padding: 0 6px; border-radius: 6px; }
  .yt-ai .ans .big { display: block; font: 900 96px "Unb"; color: #5cf0a0; letter-spacing: -.03em; margin: 14px 0 6px; text-shadow: 0 0 40px rgba(92,240,160,.35); white-space: nowrap; }
  .yt-ai .ans .src { display: block; font: 500 24px "Mont"; color: #77777d; margin-top: 14px; }
  .yt-ai .dots { display: flex; gap: 10px; padding-top: 20px; } .yt-ai .dots i { width: 16px; height: 16px; border-radius: 50%; background: #77777d; }
  .yt-ai .caret { display: inline-block; width: 18px; height: 38px; background: #e8e8ea; vertical-align: middle; margin-left: 4px; }
  .yt-ai .inp { position: absolute; left: 400px; bottom: 60px; width: 1120px; padding: 26px 34px; border-radius: 40px; background: #1c1c20; border: 1px solid #333; font: 500 30px "Mont"; color: #77777d; }
  `,
  build(root, d, ctx) {
    const { U } = ctx, col = U.el("div", "col", null, root);
    root._me = U.el("div", "me", d.q, col);
    const bot = U.el("div", "bot", '<div class="lg"></div>', col); root._lg = bot.firstChild;
    root._dots = U.el("div", "dots", "<i></i><i></i><i></i>", bot);
    root._ans = U.el("div", "ans", d.a, bot); root._ws = U.words(root._ans);
    root._car = U.el("span", "caret", null, null);
    U.el("div", "inp", d.inp || "Спросите что-нибудь…", root);
  },
  render(root, t, d, ctx) {
    const { U } = ctx, tq = d.tq ?? .2, ta = d.ta ?? tq + 1.2, wps = d.wps || 8;
    const k = U.out5((t - tq) / .45); root._me.style.opacity = U.clamp((t - tq) / .2); root._me.style.transform = `translateY(${(1 - k) * 30}px)`;
    root._lg.style.opacity = U.clamp((t - tq - .4) / .2); root._lg.style.transform = `rotate(${t * 90}deg)`;
    const thinking = t > tq + .5 && t < ta; root._dots.style.display = thinking ? "flex" : "none";
    [...root._dots.children].forEach((i, n) => { i.style.opacity = .35 + .65 * U.bell(((t * 2.4 - n * .25) % 1 + 1) % 1); });
    root._ans.style.display = t >= ta ? "" : "none";
    const n = Math.floor((t - ta) * wps); U.showWords(root._ws, n);
    const last = root._ws[Math.min(Math.max(n, 1), root._ws.length) - 1];
    if (last && n < root._ws.length) last.after(root._car); else if (root._car.parentNode) root._car.remove();
    // крупный итог «прилетает» вместе со своим словом
    root._ans.querySelectorAll(".big").forEach(b => { const w0 = root._ws.indexOf(b.querySelector(".w")), tb = ta + w0 / wps, kb = U.out5((t - tb) / .4);
      b.style.transform = `scale(${U.lerp(1.25, 1, kb)})`; b.style.transformOrigin = "0 60%"; });
  },
});
