// Режим «Свайп-карточки» (образец modes5.html?mode=swipe): стопка карточек как в приложении знакомств; на каждую — штамп
// «ДА»/«НЕТ», и карточка улетает вправо или влево, кнопка снизу «нажимается». В конце — «мэтч»: правило главы.
// data: { cap: {small, big}, cards: [{title, text, ok, t}], match: {small, big, t} }   t — момент свайпа карточки.
YT.mode("swipe", {
  css: `
  .yt-swipe { background: radial-gradient(900px 700px at 50% 50%, #2a1530, #0c0710); }
  .yt-swipe .c { position: absolute; left: 750px; top: 130px; width: 420px; height: 680px; border-radius: 40px; padding: 40px; color: #fff; box-shadow: 0 40px 80px rgba(0,0,0,.6);
    display: flex; flex-direction: column; justify-content: flex-end; transform-origin: 50% 120%; }
  .yt-swipe .c b { font: 900 42px/1.08 "Unb"; overflow-wrap: anywhere; hyphens: auto; } .yt-swipe .c span { font: 600 26px/1.35 "Mont"; opacity: .88; margin-top: 14px; }
  .yt-swipe .c .no-1 { position: absolute; top: 34px; left: 40px; font: 800 24px "Mont"; letter-spacing: .14em; opacity: .7; }
  .yt-swipe .stamp { position: absolute; top: 90px; padding: 10px 22px; border: 6px solid; border-radius: 14px; font: 900 48px "Unb"; opacity: 0; }
  .yt-swipe .btn { position: absolute; top: 860px; width: 130px; height: 130px; border-radius: 50%; background: #1b1220; display: flex; align-items: center; justify-content: center;
    font: 900 60px "Mont"; box-shadow: 0 16px 30px rgba(0,0,0,.5); }
  .yt-swipe .cap { position: absolute; color: #eef1f6; } .yt-swipe .cap small { display: block; font: 700 26px "Mont"; letter-spacing: .14em; color: #9aa5b1; }
  .yt-swipe .cap b { display: block; font: 900 54px/1.05 "Unb"; letter-spacing: -.02em; margin-top: 12px; }
  `,
  build(root, d, ctx) {
    const { U } = ctx;
    if (d.cap) root._cap = U.el("div", "cap", `<small>${d.cap.small || ""}</small><b>${d.cap.big || ""}</b>`, root), Object.assign(root._cap.style, { left: "90px", top: "820px", width: "600px" });
    const n = d.cards.length;
    root._cards = d.cards.slice().reverse().map((c, ri) => { const i = n - 1 - ri;
      const e = U.el("div", "c", `<div class="no-1">${c.tag || `${i + 1} / ${n}`}</div><div class="stamp" style="${c.ok ? "left:30px;border-color:#9dffc8;color:#9dffc8" : "right:30px;border-color:#fff;color:#fff"}">${c.ok ? "ДА" : "НЕТ"}</div><b>${c.title}</b><span>${c.text || ""}</span>`, root);
      e.style.background = c.ok ? "linear-gradient(180deg,#123a26,#1a9d57)" : (c.ok === false ? "linear-gradient(180deg,#5a2030,#c42a45)" : "linear-gradient(180deg,#1d2440,#3d4f8a)");
      return { c, e, i, st: e.querySelector(".stamp") }; });
    root._no = U.el("div", "btn", "✕", root); root._no.style.cssText += "left:790px;color:#ff5a6e";
    root._yes = U.el("div", "btn", "✓", root); root._yes.style.cssText += "left:1000px;color:#5cf0a0";
    if (d.match) { root._m = U.el("div", "cap", `<small style="color:#5cf0a0">${d.match.small || "МЭТЧ"}</small><b>${d.match.big}</b>`, root); Object.assign(root._m.style, { left: "1310px", top: "330px", width: "540px" }); }
  },
  render(root, t, d, ctx) {
    const { U } = ctx;
    if (root._cap) root._cap.style.opacity = U.clamp(t / .4);
    let front = 0; d.cards.forEach((c, i) => { if (t > c.t + .45) front = i + 1; });
    const press = { no: 0, yes: 0 };
    root._cards.forEach(({ c, e, i, st }) => {
      const k = U.clamp((t - c.t) / .45), depth = i - front;
      if (t >= c.t) { const dir = c.ok ? 1 : -1, e3 = U.in3(k);
        e.style.transform = `translateX(${dir * 1100 * e3}px) rotate(${dir * (4 + 26 * e3)}deg)`; e.style.opacity = 1 - U.clamp((k - .7) / .3);
        press[c.ok ? "yes" : "no"] = Math.max(press[c.ok ? "yes" : "no"], U.bell(k)); }
      else if (depth >= 0) {
        const lift = depth === 0 ? 1 : U.out3((t - (d.cards[i - 1] || { t: -1 }).t - .1) / .4);   // следующая карточка поднимается, когда улетает предыдущая
        const s = depth === 0 ? 1 : U.lerp(.94, 1, depth === 1 ? lift : 0), y = depth === 0 ? 0 : U.lerp(26, 0, depth === 1 ? lift : 0);
        const wob = depth === 0 ? Math.sin(t * 2.1 + i) * 1.2 : 0, lean = depth === 0 ? (c.ok ? 1 : -1) * 6 * U.out3((t - c.t + .5) / .5) : 0;
        e.style.transform = `translateY(${y}px) scale(${s}) rotate(${wob + lean}deg)`; e.style.opacity = depth > 2 ? 0 : 1;
      }
      st.style.opacity = U.clamp((t - c.t + .5) / .25); st.style.transform = `rotate(${c.ok ? -14 : 14}deg) scale(${U.lerp(1.6, 1, U.out5((t - c.t + .5) / .25))})`;
    });
    root._no.style.transform = `scale(${1 - .12 * press.no})`; root._yes.style.transform = `scale(${1 - .12 * press.yes})`;
    root._no.style.background = press.no > .1 ? "#3a1824" : ""; root._yes.style.background = press.yes > .1 ? "#163a28" : "";
    if (root._m) { const k = U.out5((t - d.match.t) / .5); root._m.style.opacity = U.clamp((t - d.match.t) / .25); root._m.style.transform = `translateY(${(1 - k) * 30}px)`; }
  },
});
