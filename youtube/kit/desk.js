// «Рабочий стол» — движок длинного ролика v4 (язык лонгов, не рилсов: youtube/references/tutorials.md).
// Один холст на весь ролик; объекты (окна, телефон, текст, счётчики, курсор) живут на нём с t0 по t1,
// двигаются по ключевым кадрам и сохраняют место между «кадрами» — непрерывность взгляда.
// Камера переезжает между объектами. Всё детерминировано от t: window.renderAt(t).
// TL = { duration, fps, objs: [{id, k, t0, t1, kf:[{t, d, x, y, w, h, s, r, ry, o}], in, out, z, fixed, ...}],
//        cam: [{t, d, x, y, s}], glow: [{t, c}] }
(function () {
  const $ = (h) => { const d = document.createElement("div"); d.innerHTML = h.trim(); return d.firstElementChild; };
  const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  const out3 = (x) => 1 - Math.pow(1 - clamp(x), 3);
  const io3 = (x) => { x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
  const back = (x) => { x = clamp(x); const c = 1.4; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
  const fmt = (v) => Math.round(Math.abs(v)).toLocaleString("ru-RU").replace(/\s/g, " ");
  const PENDING = [];
  const LOGO = {
    alfa: '<img src="../assets/logos/alfa.svg">', otp: '<img src="../assets/logos/otp.svg">',
    tbank: '<img class="tb" src="../assets/logos/tbank.svg">',
    uralsib: '<img class="ic" src="../assets/logos/uralsib_icon.png"><span class="wm">УРАЛСИБ</span>',
  };
  const PLOGO = { alfa: "alfa.svg", otp: "otp.svg", tbank: "tbank.svg", uralsib: "uralsib_icon.png" };
  const ICON = {
    rub: '<svg viewBox="0 0 24 24" fill="none" stroke="#3ddc84" stroke-width="2.4" stroke-linecap="round"><path d="M8 20V4h6a4 4 0 0 1 0 8H6M6 16h9"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="#ffd84a" stroke-width="2.4" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    risk: '<svg viewBox="0 0 24 24" fill="none" stroke="#ff4d5e" stroke-width="2.4" stroke-linejoin="round"><path d="M12 3 2 20h20L12 3z"/><path d="M12 10v4M12 17v.5" stroke-linecap="round"/></svg>',
  };
  const fade = (el, t, at, dur = .35, dy = 18) => {              // мягкое появление (без «подскока»)
    const k = at == null ? 1 : out3((t - at) / dur);
    el.style.opacity = at == null ? 1 : clamp((t - at) / (dur * .6));
    el.style.transform = `translateY(${dy * (1 - k)}px)`;
  };

  // ---------- содержимое окон ----------
  const B = {};
  B.html = { build: (b) => $(`<div style="position:absolute;inset:0">${b.html}</div>`), tick: () => {} };
  // документ: <mark data-a data-d>…</mark> протягивается маркером; b.scroll {from,to,a,b}
  B.doc = {
    build: (b) => $(`<div class="doc">${b.html}</div>`),
    tick: (el, b, t) => {
      el.querySelectorAll("mark").forEach(m => { const a = +m.dataset.a, d = +(m.dataset.d || .6); m.style.backgroundSize = `${100 * io3((t - a) / d)}% 78%`; });
      if (b.scroll) { const p = io3((t - b.scroll.a) / (b.scroll.b - b.scroll.a)); el.style.transform = `translateY(${-(b.scroll.from + (b.scroll.to - b.scroll.from) * p)}px)`; }
      if (b.zoom) { const p = io3((t - b.zoom.a) / (b.zoom.b - b.zoom.a)); el.style.transformOrigin = b.zoom.origin || "50% 50%"; el.style.transform = `scale(${1 + (b.zoom.s - 1) * p})`; }
    },
  };
  // видео: кадры out/bfr/<id>/00001.jpg… (30 к/с), медленный наезд, подпись источника
  const pad5 = (n) => String(n).padStart(5, "0");
  B.frames = {
    build: (b) => $(`<div style="position:absolute;inset:0"><img class="frames" src="out/bfr/${b.id}/00001.jpg">${b.credit ? `<div class="credit">${b.credit}</div>` : ""}</div>`),
    tick: (el, b, t, o) => {
      const f = Math.max(0, Math.floor((t - o.t0) * 30)), m = Math.max(1, b.n - 1), q = f % (2 * m);   // туда-обратно, если клип короче окна
      const n = (q < m ? q : 2 * m - q) + 1, img = el.querySelector("img"), src = `out/bfr/${b.id}/${pad5(n)}.jpg`;
      if (img.getAttribute("src") !== src) { img.setAttribute("src", src); PENDING.push(img.decode().catch(() => {})); }
      img.style.transform = `scale(${1.02 + .05 * clamp((t - o.t0) / (o.t1 - o.t0))})`;
      if (b.gray) img.style.filter = "grayscale(1) contrast(1.1)";
    },
  };
  B.img = { build: (b) => $(`<div style="position:absolute;inset:0"><img class="imgfit" src="${b.src}">${b.labels || ""}</div>`), tick: (el, b, t) => el.querySelectorAll("[data-a]").forEach(e => fade(e, t, +e.dataset.a, .25, 0)) };
  // лента роликов: b.cards [{title, bg, tag:{text, at}}]
  B.yt = {
    build: (b) => $(`<div class="yt">${b.cards.map(c => `<div class="v"><div class="th" style="background:${c.bg}">${c.title}</div><div class="ln"></div><div class="ln"></div>
      ${c.tag ? `<div class="tag" data-a="${c.tag.at}">${c.tag.text}</div>` : ""}</div>`).join("")}</div>`),
    tick: (el, b, t) => el.querySelectorAll(".tag").forEach(e => { const a = +e.dataset.a, k = back((t - a) / .22);
      e.style.opacity = clamp((t - a) / .06); e.style.transform = `translate(-50%,-50%) rotate(-8deg) scale(${1.8 - .8 * k})`; }),
  };
  // Telegram: b.msgs [{html, at}]
  B.tg = {
    build: (b) => $(`<div class="tg"><div class="hd"><div class="av">₽</div><div><div class="nm">${b.name}</div><div class="sb">${b.sub}</div></div></div>
      ${b.msgs.map(m => `<div class="msg" data-a="${m.at}">${m.html}</div>`).join("")}</div>`),
    tick: (el, b, t) => el.querySelectorAll(".msg").forEach(e => fade(e, t, +e.dataset.a, .35, 24)),
  };
  // доска: b.rows {D:[{t|bank, at}]}, b.blur [{t, v}] (px), b.focus {row, at}
  B.board = {
    build: (b) => $(`<div class="board ${b.big ? "big" : ""}">${(b.only || "SABCD").split("").map(T => `<div class="row" data-r="${T}"><b style="--c:var(--${T})">${T}</b>
      ${(b.rows[T] || []).map(c => `<div class="chip" data-a="${c.at}">${c.bank ? `<div class="logo">${LOGO[c.bank]}</div>` : c.t}</div>`).join("")}</div>`).join("")}</div>`),
    tick: (el, b, t) => {
      el.querySelectorAll(".chip").forEach(e => { const a = +e.dataset.a, k = out3((t - a) / .4); e.style.opacity = clamp((t - a) / .2); e.style.transform = `translateX(${60 * (1 - k)}px)`;
        let bl = 0; for (const x of b.blur || []) if (t >= x.t) bl = x.v;
        const ub = b.unblur && b.unblur[e.closest(".row").dataset.r]; if (ub != null) bl *= 1 - io3((t - ub) / .5);   // уровень разобран — строка открывается
        e.style.filter = bl > .05 ? `blur(${bl}px)` : "none"; });
      el.querySelectorAll(".row").forEach(r => { let on = 1; if (b.focus && t >= b.focus.at) on = r.dataset.r === b.focus.row ? 1 : .25 + .75 * (1 - out3((t - b.focus.at) / .5)); r.style.opacity = on; });
    },
  };
  // критерии: b.items [{ic, t, at}]
  B.crit = {
    build: (b) => $(`<div class="crit"><h4>${b.title}</h4>${b.items.map(i => `<div class="it" data-a="${i.at}"><div class="ic">${ICON[i.ic]}</div>${i.t}</div>`).join("")}</div>`),
    tick: (el, b, t) => el.querySelectorAll(".it").forEach(e => { const a = +e.dataset.a, k = out3((t - a) / .4); e.style.opacity = clamp((t - a) / .2); e.style.transform = `translateX(${-50 * (1 - k)}px)`; }),
  };
  // «толпа»: b.n точек, появляются с a по b; b.gold {i, at}
  B.dots = {
    build: (b) => $(`<div class="dotsgrid" style="grid-template-columns:repeat(${b.cols},18px)">${Array.from({ length: b.n }, (_, i) => `<i${b.gold && b.gold.i === i ? ' class="g0"' : ""}></i>`).join("")}</div>`),
    tick: (el, b, t) => {
      const ds = el.children, m = Math.floor(b.n * io3((t - b.a) / (b.b - b.a)));
      // порядок появления — псевдослучайный, но детерминированный
      for (let i = 0; i < b.n; i++) { const r = (i * 7919) % b.n; ds[r].style.opacity = i < m ? 1 : 0; }
      if (b.gold) { const g = ds[b.gold.i], on = t >= b.gold.at; g.classList.toggle("gold", on); g.style.opacity = 1; g.style.transform = on ? `scale(${1 + .8 * (1 - out3((t - b.gold.at) / .5))})` : "none"; }
      if (b.dim) el.querySelectorAll("i:not(.gold)").forEach(e => { if (t >= b.dim) e.style.opacity = Math.min(+e.style.opacity, .35); });
    },
  };
  // шкала шанса: стрелка от 50 к b.val (0..100) в момент b.at
  B.gauge = {
    build: (b) => $(`<div class="gauge"><svg viewBox="0 0 520 290"><path d="M40 270 A220 220 0 0 1 480 270" fill="none" stroke="#263040" stroke-width="34" stroke-linecap="round"/>
      <path d="M40 270 A220 220 0 0 1 120 100" fill="none" stroke="#ff4d5e" stroke-width="34" stroke-linecap="round"/>
      <g class="nd"><line x1="260" y1="270" x2="260" y2="90" stroke="#eef2f6" stroke-width="10" stroke-linecap="round"/></g><circle cx="260" cy="270" r="22" fill="#eef2f6"/></svg><div class="gl">${b.label}</div></div>`),
    tick: (el, b, t) => { const v = 50 + (b.val - 50) * back((t - b.at) / .7), a = (v - 50) * 1.8 + 2 * Math.sin(t * 9) * clamp((t - b.at) / .7);
      el.querySelector(".nd").setAttribute("transform", `rotate(${a} 260 270)`); },
  };

  // строки с отметками: b.title, b.items [{l, r, c, at, mark:{at, ok}}]
  B.rows = {
    build: (b) => $(`<div class="rows">${b.title ? `<h4>${b.title}</h4>` : ""}${b.items.map(i => `<div class="rw" data-a="${i.at}"><span class="l">${i.l}</span><span class="val ${i.c || ""}">${i.r || ""}</span>
      ${i.mark ? `<b class="mk ${i.mark.ok ? "ok" : "no"}" data-a="${i.mark.at}">${i.mark.ok ? "✓" : "✕"}</b>` : ""}</div>`).join("")}${b.note ? `<div class="note">${b.note}</div>` : ""}</div>`),
    tick: (el, b, t) => {
      el.querySelectorAll(".rw").forEach(e => fade(e, t, +e.dataset.a, .35, 16));
      el.querySelectorAll(".mk").forEach(e => { const a = +e.dataset.a, k = back((t - a) / .3); e.style.opacity = clamp((t - a) / .08); e.style.transform = `scale(${t < a ? 0 : .3 + .7 * k})`; });
    },
  };
  // категории кэшбэка: b.items [{name, p, at, img, bad}], b.sel [{i, at}], b.hl {i, at}
  B.cats = {
    build: (b) => $(`<div class="cats">${b.items.map((c, i) => `<div class="ct ${c.bad ? "bad" : ""}" data-a="${c.at}" data-i="${i}">${c.img ? `<img src="${c.img}">` : `<div class="ph">${c.name[0]}</div>`}
      <div class="nm">${c.name}</div><div class="pc">${c.p}</div><div class="tg"></div></div>`).join("")}</div>`),
    tick: (el, b, t) => el.querySelectorAll(".ct").forEach(e => {
      fade(e, t, +e.dataset.a, .4, 24); const i = +e.dataset.i;
      const sel = (b.sel || []).find(x => x.i === i && t >= x.at); e.classList.toggle("on", !!sel);
      if (sel) e.style.transform += ` scale(${1 + .06 * (1 - out3((t - sel.at) / .3))})`;
      const hl = (b.hl || []).find(x => x.i === i && t >= x.at); e.classList.toggle("hl", !!hl);
    }),
  };
  // потолок: шкала растёт с a до b и упирается в лимит на доле b.cap (0..1); b.at2 — подпись суммы
  B.cap = {
    build: (b) => $(`<div class="capw"><div class="cl">${b.label}</div><div class="bar"><i></i><b></b><span>лимит</span></div><div class="cv"></div><div class="cs" data-a="${b.at2}">${b.sub}</div></div>`),
    tick: (el, b, t) => {
      const p = clamp((t - b.a) / (b.b - b.a)), f = Math.min(p / b.cap, 1) * .8, hit = p >= b.cap;
      el.querySelector(".bar i").style.width = `${f * 100}%`; el.querySelector(".bar i").classList.toggle("hit", hit);
      el.querySelector(".cv").textContent = hit ? (b.stop || "дальше — 0 ₽ кэшбэка") : (b.grow || "кэшбэк растёт…"); el.querySelector(".cv").classList.toggle("r", hit);
      fade(el.querySelector(".cs"), t, b.at2, .4, 16);
    },
  };

  // схема потока: b.nodes [{id, x, y, t, sub, c, at}] (координаты в px окна), b.edges [{a, b, t, at, c}] — стрелка «прорисовывается»
  B.flow = {
    build: (b) => {
      const N = Object.fromEntries(b.nodes.map(n => [n.id, n]));
      const ed = b.edges.map((e, i) => { const A = N[e.a], Bn = N[e.b]; const dx = Bn.x - A.x, dy = Bn.y - A.y, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L;
        const x1 = A.x + ux * 95, y1 = A.y + uy * 60, x2 = Bn.x - ux * 95, y2 = Bn.y - uy * 60, len = Math.hypot(x2 - x1, y2 - y1);
        return `<g class="ed" data-a="${e.at}" data-l="${len}"><line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${e.c || "#8b96a5"}" stroke-width="6" stroke-linecap="round" stroke-dasharray="${len}" stroke-dashoffset="${len}"/>
          <polygon points="${x2},${y2} ${x2 - ux * 22 - uy * 12},${y2 - uy * 22 + ux * 12} ${x2 - ux * 22 + uy * 12},${y2 - uy * 22 - ux * 12}" fill="${e.c || "#8b96a5"}" opacity="0"/>
          ${e.t ? `<text x="${(x1 + x2) / 2 - uy * 26}" y="${(y1 + y2) / 2 + ux * 26 + 8}" text-anchor="middle" fill="${e.c || "#cfd6df"}" font-family="Mont" font-weight="800" font-size="26" opacity="0">${e.t}</text>` : ""}</g>`; }).join("");
      return $(`<div style="position:absolute;inset:0"><svg style="position:absolute;inset:0;width:100%;height:100%">${ed}</svg>
        ${b.nodes.map(n => `<div class="fn" data-a="${n.at}" style="left:${n.x}px;top:${n.y}px;--c:${n.c || "var(--line)"}"><b>${n.t}</b>${n.sub ? `<small>${n.sub}</small>` : ""}</div>`).join("")}</div>`);
    },
    tick: (el, b, t) => {
      el.querySelectorAll(".fn").forEach(e => { const a = +e.dataset.a, k = back((t - a) / .35); e.style.opacity = clamp((t - a) / .12); e.style.transform = `translate(-50%,-50%) scale(${t < a ? .6 : .6 + .4 * k})`; });
      el.querySelectorAll(".ed").forEach(g => { const a = +g.dataset.a, L = +g.dataset.l, p = io3((t - a) / .5);
        g.querySelector("line").setAttribute("stroke-dashoffset", L * (1 - p)); g.querySelector("polygon").setAttribute("opacity", p > .9 ? 1 : 0);
        const tx = g.querySelector("text"); if (tx) tx.setAttribute("opacity", clamp((t - a - .3) / .3)); });
    },
  };
  // график роста: b.pts [[x,y]] в долях, рисуется с a по b; b.label, b.mark {i, text, at}
  B.chart = {
    build: (b) => { const W = 900, H = 420, P = b.pts.map(([x, y]) => [40 + x * (W - 80), H - 40 - y * (H - 90)]);
      const d = "M" + P.map(p => p.join(",")).join(" L"); let len = 0; for (let i = 1; i < P.length; i++) len += Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]);
      return $(`<div style="position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;padding:20px 30px"><svg viewBox="0 0 ${W} ${H}" style="width:100%;height:auto">
        <line x1="40" y1="${H - 40}" x2="${W - 40}" y2="${H - 40}" stroke="#263040" stroke-width="3"/><line x1="40" y1="30" x2="40" y2="${H - 40}" stroke="#263040" stroke-width="3"/>
        ${(b.ticks || []).map(([x, s]) => `<text x="${40 + x * (W - 80)}" y="${H - 8}" text-anchor="middle" fill="#8b96a5" font-family="Mont" font-weight="700" font-size="22">${s}</text>`).join("")}
        <path class="ln" d="${d}" fill="none" stroke="${b.c || "#3ddc84"}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="${len}" stroke-dashoffset="${len}" data-l="${len}"/>
        <circle class="dot" r="13" fill="${b.c || "#3ddc84"}" opacity="0"/></svg><div class="chl">${b.label || ""}</div></div>`); },
    tick: (el, b, t) => { const p = io3((t - b.a) / (b.b - b.a)), ln = el.querySelector(".ln"), L = +ln.dataset.l; ln.setAttribute("stroke-dashoffset", L * (1 - p));
      const pt = ln.getPointAtLength(L * p), d = el.querySelector(".dot"); d.setAttribute("cx", pt.x); d.setAttribute("cy", pt.y); d.setAttribute("opacity", p > .01 ? 1 : 0); },
  };
  // предложение банка (финальный подсчёт): b.bank, b.card, b.bonus, b.cond, b.at
  B.offer = {
    build: (b) => $(`<div class="ofr"><div class="bank sm">${LOGO[b.bank]}</div><div class="ot"><small>${b.card}</small><b>${b.bonus}</b><span>${b.cond}</span></div></div>`),
    tick: () => {},
  };

  // ---------- виды объектов ----------
  const K = {};
  K.win = {
    build: (o) => { const el = $(`<div class="win ${o.paper ? "paper" : ""}" style="--acc:${o.acc || "var(--glow)"}"><div class="bar"><i></i><i></i><i></i><span>${o.title || ""}</span><div class="acc"></div></div><div class="body"></div></div>`);
      el.querySelector(".body").appendChild(B[o.body.type].build(o.body)); return el; },
    tick: (el, o, t) => B[o.body.type].tick(el.querySelector(".body").firstElementChild, o.body, t, o),
  };
  // телефон: o.bal {from, to, a, b, c}, o.rows [{ico, t, am, c, at}], o.pushes [{at, bank, title, html}], o.banner {at, html}, o.btn {at, text}
  K.phone = {
    build: (o) => $(`<div class="phone"><div class="scr"><div class="isl"></div><div class="app" style="${o.appTop ? `top:${o.appTop}px` : ""}">
      ${o.bal || o.balText ? `<div class="lbl">${o.balLabel || "Баланс"}</div><div class="bal ${(o.bal && o.bal.c) || o.balC || ""}"></div>` : ""}
      ${(o.rows || []).map(r => `<div class="row" data-a="${r.at}"><div class="ico">${r.ico}</div>${r.t}<div class="am ${r.c || ""}">${r.am}</div></div>`).join("")}</div>
      ${o.banner ? `<div class="banner" style="top:${o.banner.top || 200}px" data-a="${o.banner.at}" data-u="${o.banner.until || 1e9}">${o.banner.html}</div>` : ""}
      ${o.btn ? `<div class="btn" data-a="${o.btn.at}" data-u="${o.btn.until || 1e9}">${o.btn.text}</div>` : ""}
      ${(o.pushes || []).map(p => `<div class="push" data-a="${p.at}"><div class="pl">${p.bank ? `<img src="../assets/logos/${PLOGO[p.bank]}">` : p.ico || ""}</div><div><div class="pt">${p.title}</div><div class="pm">${p.html}</div></div></div>`).join("")}
      </div></div>`),
    tick: (el, o, t) => {
      if (o.balText && !o.bal) el.querySelector(".bal").textContent = o.balText;
      if (o.bal && o.balText && o.bal.steps && t < o.bal.steps[0][0]) el.querySelector(".bal").textContent = o.balText;   // до первого шага — «?? ??? ₽» (отсылка к хуку)
      else if (o.bal) { const b = o.bal; let v;
        if (b.steps) { v = b.from; for (const [st, val] of b.steps) { if (t < st) break; v = v + (val - v) * io3((t - st) / .6); } }   // ступеньками: каждое предложение банка
        else { const p = io3((t - b.a) / (b.b - b.a)); v = b.from + (b.to - b.from) * p; } el.querySelector(".bal").textContent = (b.sign ? (v < 0 ? "−" : "+") : "") + fmt(v) + " ₽"; }
      el.querySelectorAll(".row").forEach(e => fade(e, t, +e.dataset.a, .35, 20));
      const ps = [...el.querySelectorAll(".push")];
      ps.forEach((e, i) => {  // новые уведомления сверху, старые съезжают вниз
        const a = +e.dataset.a; if (t < a) { e.style.opacity = 0; return; }
        const newer = ps.filter(x => +x.dataset.a <= t && +x.dataset.a > a).map(x => out3((t - x.dataset.a) / .4)).reduce((s, k) => s + k, 0);
        const k = out3((t - a) / .45); e.style.opacity = clamp((t - a) / .15) * (newer > 2.5 ? clamp(3.5 - newer) : 1);
        e.style.transform = `translateY(${66 - 110 * (1 - k) + newer * 104}px) scale(${.92 + .08 * k})`;
      });
      el.querySelectorAll(".banner,.btn").forEach(e => { fade(e, t, +e.dataset.a, .4, 30); const u = +e.dataset.u; if (t > u) e.style.opacity = 1 - clamp((t - u) / .3); });
    },
  };
  // текст: o.html, слова <span class="w" data-a>; o.cls (m|s)
  K.text = {
    build: (o) => $(`<div class="tx ${o.cls || ""}">${o.html}</div>`),
    tick: (el, o, t) => el.querySelectorAll("[data-a]").forEach(e => fade(e, t, +e.dataset.a, .4, 26)),
  };
  // счётчик: o.from, o.to, o.a, o.b, o.c (g|r), o.sign, o.unit, o.label
  K.num = {
    build: (o) => $(`<div class="num ${o.c || ""}"><span></span>${o.label ? `<small>${o.label}</small>` : ""}</div>`),
    tick: (el, o, t) => { const v = o.from + (o.to - o.from) * io3((t - o.a) / (o.b - o.a));
      el.firstElementChild.textContent = o.text && t >= o.b ? o.text : (o.sign ? (v < 0 || o.to < 0 ? "−" : "+") : "") + fmt(v) + (o.unit ?? " ₽"); },
  };
  // курсор: позиция — из kf; o.clicks [t]
  K.cursor = {
    build: () => $(`<div class="cur"><svg viewBox="0 0 24 24"><path d="M4 2l15 11-6.5 1.2L16 21l-3 1.4-3.6-6.8L4 20z" fill="#fff" stroke="#000" stroke-width="1.2"/></svg><div class="rp"></div></div>`),
    tick: (el, o, t) => { const rp = el.querySelector(".rp"); let k = 9; for (const c of o.clicks || []) if (t >= c) k = t - c;
      rp.style.opacity = k < .45 ? 1 - k / .45 : 0; rp.style.transform = `scale(${.3 + 1.2 * out3(k / .45)})`;
      const press = (o.clicks || []).some(c => t >= c - .05 && t < c + .1); el.querySelector("svg").style.transform = press ? "scale(.85)" : "none"; },
  };
  K.stamp = {
    build: (o) => $(`<div class="stamp" style="--c:${o.c || "var(--red)"}">${o.text}</div>`),
    tick: (el, o, t) => { const k = out3((t - o.at) / .18); el.style.opacity = t < o.at ? 0 : 1; el.style.transform = `rotate(${o.rot ?? -8}deg) scale(${1.9 - .9 * k})`; },
  };
  // карточка банка: o.bank; o.hide [a, b] — закрыта «?» до b (открытая петля)
  K.bank = {
    build: (o) => $(`<div class="bank">${LOGO[o.bank]}${o.hidden ? `<div class="q">?</div>` : ""}</div>`),
    tick: (el, o, t) => { const q = el.querySelector(".q"); if (q && o.reveal) q.style.opacity = 1 - clamp((t - o.reveal) / .3); if (o.blur) el.style.filter = `blur(${o.blur}px)`; },
  };
  // заставка главы (fixed): o.tier, o.title, o.sub
  K.sting = {
    build: (o) => $(`<div class="sting" style="--c:var(--${o.tier})"><div class="big">${o.tier}</div><div class="tt"><small>${o.sub || "уровень"}</small><span>${o.title}</span><div class="ln"></div></div></div>`),
    tick: (el, o, t) => {
      const lt = t - o.t0, rest = o.t1 - t, kin = io3(lt / .35), kout = io3(1 - rest / .3);
      el.style.clipPath = `inset(0 ${100 * (1 - kin)}% 0 ${100 * kout}%)`;
      el.querySelector(".big").style.transform = `scale(${1.12 - .12 * out3(lt / 1.2)})`;
      el.querySelector(".ln").style.width = `${420 * out3((lt - .3) / .6)}px`;
      fade(el.querySelector(".tt span"), t, o.t0 + .15, .45, 30);
    },
  };
  // плашка-ярлык (тяжёлый стиль типографики): o.kicker, o.text, o.items [{t, at}], o.at, o.c
  K.label = {
    build: (o) => $(`<div class="label" style="--c:${o.c || "var(--yel)"}"><small>${o.kicker || "приём"}</small><div class="lt">${o.text}</div>
      ${o.items ? `<div class="li">${o.items.map(i => `<span data-a="${i.at}">${i.t}</span>`).join("")}</div>` : ""}</div>`),
    tick: (el, o, t) => {
      const lt = t - o.at; el.style.opacity = t < o.at ? 0 : 1;
      el.querySelector(".lt").style.clipPath = `inset(0 ${100 * (1 - io3(lt / .35))}% 0 0)`;
      el.style.transform = `rotate(${o.rot ?? -2}deg) scale(${1.15 - .15 * out3(lt / .3)})`;
      el.querySelectorAll(".li span").forEach(e => fade(e, t, +e.dataset.a, .35, 14));
    },
  };
  // вывод блока: o.html
  K.takeaway = {
    build: (o) => $(`<div class="take"><small>вывод</small><div>${o.html}</div></div>`),
    tick: (el, o, t) => el.querySelectorAll("[data-a]").forEach(e => fade(e, t, +e.dataset.a, .35, 12)),
  };
  K.lower = {
    build: (o) => $(`<div class="lower" style="--c:${o.c || "var(--green)"}"><i></i><div><b>${o.text}</b>${o.sub ? `<br><span>${o.sub}</span>` : ""}</div></div>`),
    tick: (el, o, t) => { const lt = t - o.t0, rest = o.t1 - t; el.style.clipPath = `inset(0 ${100 * (1 - io3(lt / .4))}% 0 0)`; if (rest < .3) el.style.opacity = rest / .3; },
  };

  // ---------- раскладка, вход/выход, камера ----------
  const DEF = { x: 960, y: 540, w: 800, h: 500, s: 1, r: 0, ry: 0, rx: 0, o: 1 };
  function layout(o, t) {
    const L = { ...DEF, ...o.kf[0] };
    for (let i = 1; i < o.kf.length; i++) {
      const k = o.kf[i]; if (t < k.t) break;
      const p = io3((t - k.t) / (k.d || .7));
      for (const key in k) if (key !== "t" && key !== "d") L[key] += (k[key] - L[key]) * p;
    }
    return L;
  }
  function enterExit(o, t, L) {
    const lt = t - o.t0, rest = o.t1 - t, di = o.ind || .55, dout = o.outd || .4;
    const e = 1 - out3(lt / di), x = o.out === "none" ? 0 : io3(1 - rest / dout);
    let dx = 0, dy = 0, sc = 1, op = 1;
    switch (o.in || "up") {
      case "up": dy += 90 * e; op *= 1 - e; break;
      case "down": dy -= 90 * e; op *= 1 - e; break;
      case "left": dx -= 260 * e; op *= 1 - e; break;
      case "right": dx += 260 * e; op *= 1 - e; break;
      case "scale": sc *= .82 + .18 * (1 - e); op *= 1 - e; break;
      case "fade": op *= 1 - e; break;
      case "none": break;
    }
    switch (o.out || "fade") {
      case "down": dy += 90 * x; op *= 1 - x; break;
      case "left": dx -= 260 * x; op *= 1 - x; break;
      case "right": dx += 260 * x; op *= 1 - x; break;
      case "scale": sc *= 1 - .1 * x; op *= 1 - x; break;
      case "none": break;
      default: op *= 1 - x;
    }
    return { dx, dy, sc, op };
  }
  function camera(t, TL) {
    const C = { x: 960, y: 540, s: 1 }, cs = TL.cam || [];
    for (const k of cs) { if (t < k.t) break; const p = io3((t - k.t) / (k.d || 1)); for (const key of ["x", "y", "s"]) if (k[key] != null) C[key] += (k[key] - C[key]) * p; }
    C.x += 5 * Math.sin(t * .31); C.y += 4 * Math.sin(t * .23 + 1); C.s *= 1 + .006 * Math.sin(t * .19);   // «дыхание» камеры
    return C;
  }
  const hex = (c) => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16));
  function glowAt(t, TL) {
    const g = TL.glow || [{ t: 0, c: "#3ddc84" }]; let prev = g[0], cur = g[0];
    for (const x of g) if (t >= x.t) { prev = cur; cur = x; }
    const p = io3((t - cur.t) / 1.2), a = hex(prev.c), b = hex(cur.c);
    return `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * p)).join(",")})`;
  }

  const ELS = new Map();
  window.renderAt = (t) => {
    const TL = window.TL, world = document.getElementById("world"), hud = document.getElementById("hud");
    for (const o of TL.objs) {
      const on = t >= o.t0 && t < o.t1;
      let el = ELS.get(o.id);
      if (!on) { if (el) { el.remove(); ELS.delete(o.id); } continue; }
      if (!el) {
        el = document.createElement("div"); el.className = "o"; el.style.zIndex = o.z || 1;
        el.appendChild(K[o.k].build(o)); (o.fixed ? hud : world).appendChild(el); ELS.set(o.id, el);
        el.querySelectorAll("img").forEach(im => PENDING.push(im.decode().catch(() => {})));
      }
      const L = layout(o, t), E = enterExit(o, t, L);
      el.style.left = L.x + "px"; el.style.top = L.y + "px";
      if (!["text", "num", "stamp", "lower", "cursor", "label", "takeaway"].includes(o.k)) { el.style.width = L.w + "px"; el.style.height = L.h + "px"; }
      const anchor = o.k === "cursor" ? "translate(-4px,-4px)" : (o.k === "lower" || o.anchor === "left") ? "translate(0,-50%)" : o.anchor === "right" ? "translate(-100%,-50%)" : "translate(-50%,-50%)";
      el.style.transform = `${anchor} translate(${E.dx}px,${E.dy}px) perspective(1600px) rotateY(${L.ry}deg) rotateX(${L.rx}deg) rotate(${L.r}deg) scale(${L.s * E.sc})`;
      el.style.opacity = L.o * E.op;
      if (o.k === "sting") { el.style.left = "0px"; el.style.top = "0px"; el.style.width = "1920px"; el.style.height = "1080px"; el.style.transform = "none"; el.style.opacity = 1; }
      K[o.k].tick(el.firstElementChild, o, t);
    }
    // порядок слоёв по z
    const C = camera(t, TL);
    world.style.transform = `translate(960px,540px) scale(${C.s}) translate(${-C.x}px,${-C.y}px)`;
    const dots = document.querySelector("#bg .dots");
    dots.style.transform = `translate(${-(C.x - 960) * .25 % 34}px, ${-(C.y - 540) * .25 % 34}px) scale(${1 + (C.s - 1) * .3})`;
    document.body.style.setProperty("--glow", glowAt(t, TL));
    const fr = Math.floor(t * 30), h = (n) => ((Math.imul(n ^ 61, 0x27d4eb2d) >>> 0) % 200);
    document.getElementById("grain").style.backgroundPosition = `${h(fr)}px ${h(fr + 7)}px`;
    const wait = PENDING.splice(0); return wait.length ? Promise.all(wait) : null;
  };
})();
