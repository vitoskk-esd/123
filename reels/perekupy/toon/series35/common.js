// Общее для серий второго сезона: герои на сцене, губы по голосу, реплики-пузыри, «пииип», бейдж Лиса, финал.
const $ = s => document.querySelector(s);
const E = window.EP, TT = window.TT, st = TT.start, en = TT.end;
const PFX = { tolyan: "t", seryoga: "s", vika: "v", mihalych: "m", galya: "g", edik: "e" };
const who = id => E.lines.find(l => l.id === id).who;
function place(id, kind, left, top, scale = 1, z = 3) {
  const d = document.createElement("div"); d.className = "c"; d.id = id.toUpperCase();
  d.style.cssText = `left:${left}px;top:${top}px;z-index:${z};transform:scale(${scale})`;
  d.innerHTML = CHARS[kind](id); $("#scene").appendChild(d); return d;
}
function common(R, cam, opt = {}) {
  const tl = R.tl;
  // губы: открыт, когда герой звучит; иначе — «настроение» из opt.mood(герой, t)
  R.hooks.push(t => {
    const f = Math.floor(t * 30);
    for (const [k, p] of Object.entries(PFX)) {
      if (!document.getElementById(p)) continue;
      const lv = (LIP[k] || [])[f] || 0;
      mouth(p, lv > .28 && !(lv < .55 && f % 3 === 2) ? "talk" : (opt.mood ? opt.mood(k, t) : "flat"));
      const body = document.getElementById(`${p}-body`); if (body) body.style.transform = `translateY(${Math.sin(t * 2.2 + p.charCodeAt(0)) * 3}px)`;
      const lids = document.getElementById(`${p}-lids`); if (lids) lids.style.transform = `scaleY(${((t + p.charCodeAt(0) * .37) % 3.3) < .12 ? 1 : 0})`;
    }
    // бейдж Лиса: столбики пляшут, пока он говорит
    const lv = (LIP.lis || [])[f] || 0;
    $("#lisb").style.opacity = lv > .05 || (LIP.lis || []).slice(Math.max(0, f - 8), f + 8).some(v => v > .2) ? 1 : 0;
    $$("#lisb .bars i").forEach((b, i) => { b.style.height = `${12 + lv * 48 * (.6 + .4 * Math.sin(t * 20 + i * 1.7))}px`; });
  });
  const pop = (sel, at, until) => { tl.fromTo(sel, { opacity: 0, scale: .6 }, { opacity: 1, scale: 1, duration: .3, ease: "back.out(2.2)", immediateRender: false }, at);
    if (until) tl.to(sel, { opacity: 0, duration: .15 }, until); R.sfx("pop", at, .6); };
  // «пииип»: стикер над пузырём реплики
  TT.bleeps.forEach(([a, b, line]) => {
    R.sfx("bleep", a, b - a);
    const bub = document.getElementById("b_" + line), r = bub ? { left: parseFloat(bub.style.left) + 360, top: parseFloat(bub.style.top) - 90 } : { left: 560, top: 1150 };
    tl.set("#bleep", { left: r.left, top: r.top }, a - .01)
      .fromTo("#bleep", { opacity: 0, scale: 1.8, rotation: -14 }, { opacity: 1, scale: 1, rotation: -6, duration: .12, ease: "power4.out", immediateRender: false }, a)
      .to("#bleep", { opacity: 0, duration: .12 }, b + .25);
    R.shake(cam, a + .05, .5, .25);
  });
  return { pop };
}
// пузырь реплики героя: <div class="bub" id="b_<line>">
function bubble(line, html, left, top, tx = 110) {
  const d = document.createElement("div"); d.className = "bub"; d.id = "b_" + line; d.innerHTML = html;
  d.style.cssText = `left:${left}px;top:${top}px;--tx:${tx}px`; document.body.querySelector(".stage").appendChild(d); return d;
}
const $$ = s => [...document.querySelectorAll(s)];
function ending(R, at) {
  const tl = R.tl;
  tl.to("#end", { opacity: 1, duration: .25 }, at);
  tl.fromTo("#end .fox", { scale: .4, rotation: -20 }, { scale: 1, rotation: 0, duration: .5, ease: "back.out(2.2)", immediateRender: false }, at + .1);
  R.rise($("#end h2"), at + .4); R.rise($("#end p"), at + 1.0); R.slam($("#end .logo"), at + 1.5, { from: 1.6 });
}
