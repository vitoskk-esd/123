// Режим «Голосовое сообщение» (образец modes5.html?mode=voice): окно мессенджера, «записывает голосовое…», приходит пузырь
// с волной, волна закрашивается по мере «проигрывания», ниже — расшифровка по словам (как автотранскрипция).
// data: { name, len: "0:14", text (HTML расшифровки), tIn, play, tTr, wps }
YT.mode("voice", {
  css: `
  .yt-voice { background: radial-gradient(900px 700px at 50% 40%, rgba(60,140,255,.2), transparent 70%), #070a10; }
  .yt-voice .win { position: absolute; left: 330px; top: 150px; width: 1260px; height: 780px; border-radius: 40px; background: #0f1520; border: 1px solid #22304a; padding: 50px;
    box-shadow: 0 50px 100px rgba(0,0,0,.6); transform-origin: 50% 50%; }
  .yt-voice .hd { display: flex; gap: 18px; align-items: center; margin-bottom: 40px; }
  .yt-voice .av { width: 70px; height: 70px; border-radius: 50%; background: linear-gradient(135deg, #ffb06b, #ff6b8b); }
  .yt-voice .hd b { display: block; font: 800 32px "Mont"; color: #fff; } .yt-voice .hd small { font: 600 22px "Mont"; color: #6fd39a; }
  .yt-voice .msg { display: flex; gap: 26px; align-items: center; padding: 30px 36px; border-radius: 36px; background: #2b6bff; width: 1000px; margin-left: auto; opacity: 0; }
  .yt-voice .play { width: 100px; height: 100px; border-radius: 50%; background: #fff; flex: none; position: relative; }
  .yt-voice .play::after { content: ""; position: absolute; left: 40px; top: 30px; border-left: 34px solid #2b6bff; border-top: 20px solid transparent; border-bottom: 20px solid transparent; }
  .yt-voice .play.on::after { left: 34px; top: 32px; width: 10px; height: 36px; border: 0; background: #2b6bff; box-shadow: 22px 0 0 #2b6bff; }
  .yt-voice .wave { display: flex; gap: 7px; align-items: center; height: 100px; flex: 1; overflow: hidden; } .yt-voice .wave i { width: 9px; border-radius: 5px; background: rgba(255,255,255,.45); }
  .yt-voice .msg span { font: 700 28px "Mono"; color: #dfe8ff; }
  .yt-voice .tr { margin: 30px 0 0 auto; width: 1000px; padding: 30px 36px; border-radius: 30px; background: #18233a; font: 600 36px/1.4 "Mont"; color: #e6edf8; opacity: 0; }
  .yt-voice .tr small { display: block; font: 700 22px "Mont"; color: #7f9cc8; margin-bottom: 10px; letter-spacing: .1em; } .yt-voice .tr b { color: #ff8a9c; }
  `,
  build(root, d, ctx) {
    const { U } = ctx, w = root._win = U.el("div", "win", null, root);
    root._hd = U.el("div", "hd", `<div class="av"></div><div><b>${d.name || "Друг"}</b><small>записывает голосовое…</small></div>`, w);
    const m = root._msg = U.el("div", "msg", `<div class="play"></div><div class="wave"></div><span>${d.len || "0:12"}</span>`, w);
    const rnd = U.rnd(5), wv = m.querySelector(".wave"); root._bars = [];
    for (let i = 0; i < 46; i++) { const b = U.el("i", null, null, wv); b.style.height = (14 + Math.abs(Math.sin(i * .5)) * 50 + rnd() * 30) + "px"; root._bars.push(b); }
    root._tr = U.el("div", "tr", `<small>РАСШИФРОВКА</small><p>${d.text}</p>`, w); root._ws = U.words(root._tr.querySelector("p"));
  },
  render(root, t, d, ctx) {
    const { U, dur } = ctx, tIn = d.tIn ?? .6, play = d.play ?? Math.max(1.5, dur - tIn - .6), tTr = d.tTr ?? tIn + .4;
    root._win.style.transform = `scale(${1.03 - .03 * U.out5(t / .8) + .02 * U.clamp(t / dur)})`;
    root._hd.querySelector("small").textContent = t < tIn ? "записывает голосовое…" : "в сети";
    const k = U.out5((t - tIn) / .4); root._msg.style.opacity = U.clamp((t - tIn) / .15); root._msg.style.transform = `translateY(${(1 - k) * 40}px) scale(${U.lerp(.92, 1, k)})`;
    const pk = U.clamp((t - tIn - .3) / play), n = Math.round(pk * root._bars.length);
    root._bars.forEach((b, i) => { b.style.background = i < n ? "#fff" : "rgba(255,255,255,.45)"; });
    root._msg.querySelector(".play").className = "play" + (pk > 0 && pk < 1 ? " on" : "");
    const kt = U.out5((t - tTr) / .4); root._tr.style.opacity = U.clamp((t - tTr) / .2); root._tr.style.transform = `translateY(${(1 - kt) * 24}px)`;
    U.showWords(root._ws, Math.floor((t - tTr - .1) * (d.wps || 7)));
  },
});
