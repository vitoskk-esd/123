// «Студия» v6 — премиальный язык длинного ролика (2026-10-08, владелец: «монтаж как у монтажёра с 10 годами стажа»).
// Не окна на столе, а полноэкранные сцены: кинетическая типографика по словам голоса, 3D-карта и телефон,
// данные-герои (растущий счётчик, гонка столбиков), свет (цветные пятна, свечение, зерно), переходы в ритм.
// TL = { duration, fps, scenes: [{t0, t1, type, tin, tout, acc, ...}], beats: [t] }
// Всё детерминировано от t: window.renderAt(t). Приёмы — из навыков HyperFrames (kinetic-type-beats, dataviz-countup,
// velocity-matched transitions), Эмиля Ковальски (кривые) и правил retention-editing.
(function () {
  const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  const out5 = (x) => 1 - Math.pow(1 - clamp(x), 5);
  const out3 = (x) => 1 - Math.pow(1 - clamp(x), 3);
  const in3 = (x) => Math.pow(clamp(x), 3);
  const io3 = (x) => { x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
  const lerp = (a, b, k) => a + (b - a) * k;
  const hsh = (n) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
  const $ = (h) => { const d = document.createElement("div"); d.innerHTML = h.trim(); return d.firstElementChild; };
  const fmt = (v) => Math.round(Math.abs(v)).toLocaleString("ru-RU").replace(/\s/g, " ");
  const ACC = { g: "#3ddc84", r: "#ff4d5e", y: "#ffd84a", b: "#4aa8ff", v: "#b77cff", w: "#eef2f6" };
  const acc = (c) => ACC[c] || c || ACC.g;

  // ---------- сцены ----------
  const S = {};
  // кинетическая типографика: s.lines [[{w, at, c, big}]], s.size, s.align; слова выезжают из-под маски в момент at
  S.kinetic = {
    build: (s) => $(`<div class="sc kin ${s.align || ""}" style="--fs:${s.size || 150}px">${s.lines.map(l => `<div class="ln">${l.map(w =>
      `<span class="m"><span class="w ${w.c ? "ac" : ""}" style="${w.c ? `--c:${acc(w.c)}` : ""}${w.big ? `;font-size:${w.big}em` : ""}" data-a="${w.at}">${w.w}</span></span>`).join(" ")}</div>`).join("")}${s.sub ? `<div class="sub" data-a="${s.sub.at}">${s.sub.t}</div>` : ""}</div>`),
    tick: (el, s, t) => {
      if (!el.dataset.fit) {   // подгонка: самая длинная строка не шире 1600 px
        el.dataset.fit = 1; let fs = s.size || 150;
        for (let i = 0; i < 6; i++) { const mx = Math.max(...[...el.querySelectorAll(".ln")].map(l => l.scrollWidth)); if (mx <= 1600) break;
          fs = Math.floor(fs * Math.min(.97, 1600 / mx)); el.style.setProperty("--fs", `${fs}px`); } }
      el.querySelectorAll(".w").forEach((w, i) => { const a = +w.dataset.a, k = out5((t - a) / .5);
        w.style.transform = `translateY(${(1 - k) * 105}%) rotate(${(1 - k) * 4}deg)`; w.style.opacity = t < a ? 0 : 1;
        if (w.classList.contains("ac")) { const g = out3((t - a - .15) / .5); w.style.textShadow = `0 0 ${40 * g}px color-mix(in srgb, var(--c) ${60 * g}%, transparent)`; } });
      const sub = el.querySelector(".sub"); if (sub) { const a = +sub.dataset.a, k = out5((t - a) / .5); sub.style.opacity = clamp((t - a) / .3); sub.style.transform = `translateY(${(1 - k) * 20}px)`; }
    },
  };
  // число-герой: растёт вместе со значением (counting-dynamic-scale). s.from, s.to, s.a, s.b, s.dec, s.unit, s.label, s.c
  S.count = {
    build: (s) => $(`<div class="sc cnt" style="--c:${acc(s.c)}"><div class="rays"></div><div class="big"><span class="v"></span><span class="u">${s.unit || ""}</span></div><div class="lab" data-a="${s.labelAt ?? s.b}">${s.label || ""}</div></div>`),
    tick: (el, s, t) => {
      const k = io3((t - s.a) / (s.b - s.a)), v = lerp(s.from, s.to, k);
      el.querySelector(".v").textContent = s.dec ? v.toFixed(s.dec).replace(".", ",") : fmt(v);
      const big = el.querySelector(".big"); big.style.transform = `scale(${lerp(.35, 1, out3(k))})`; big.style.opacity = t < s.a ? 0 : 1;
      const land = out5((t - s.b) / .4); big.style.textShadow = `0 0 ${20 + 60 * land}px color-mix(in srgb, var(--c) ${30 + 40 * land}%, transparent)`;
      el.querySelector(".rays").style.opacity = .55 * land; el.querySelector(".rays").style.transform = `rotate(${t * 8}deg) scale(${.8 + .2 * land})`;
      const lab = el.querySelector(".lab"), la = +lab.dataset.a; lab.style.opacity = clamp((t - la) / .3); lab.style.transform = `translateY(${(1 - out5((t - la) / .5)) * 24}px)`;
    },
  };
  // телефон в 3D со списаниями: s.rows [{t, am, c, at, strike}], s.total {from,to,a,b,c,label}
  S.phone = {
    build: (s) => $(`<div class="sc ph3"><div class="phw"><div class="phone3"><div class="isl"></div><div class="tot"><small>${s.total.label}</small><b></b></div>${s.rows.map(r =>
      `<div class="r" data-a="${r.at}" ${r.strike ? `data-s="${r.strike}"` : ""}><span class="i" style="--c:${acc(r.c)}">${r.i || "₽"}</span><span class="t">${r.t}</span><span class="am" style="color:${acc(r.c)}">${r.am}</span></div>`).join("")}</div></div>
      ${s.side ? `<div class="side">${s.side.map(x => `<div class="sd" data-a="${x.at}" style="--c:${acc(x.c)}">${x.t}</div>`).join("")}</div>` : ""}</div>`),
    tick: (el, s, t) => {
      const lt = t - s.t0, ph = el.querySelector(".phw");
      ph.style.transform = `perspective(1800px) rotateY(${lerp(-28, -14, out3(lt / 3)) + 2 * Math.sin(t * .7)}deg) rotateX(${6 + 1.5 * Math.sin(t * .5)}deg) translateY(${(1 - out5(lt / .8)) * 140}px)`;
      el.querySelectorAll(".r").forEach(r => { const a = +r.dataset.a, k = out5((t - a) / .45);
        r.style.opacity = t < a ? 0 : 1; r.style.transform = `translateX(${(1 - k) * 80}px) scale(${lerp(.94, 1, k)})`;
        if (r.dataset.s) r.classList.toggle("dead", t >= +r.dataset.s); });
      const T = s.total, k = io3((t - T.a) / (T.b - T.a)); el.querySelector(".tot b").textContent = (T.to < 0 ? "−" : "") + fmt(lerp(T.from, T.to, k)) + " ₽";
      el.querySelector(".tot b").style.color = acc(T.c);
      el.querySelectorAll(".sd").forEach(d => { const a = +d.dataset.a, k2 = out5((t - a) / .5); d.style.opacity = clamp((t - a) / .3); d.style.transform = `translateY(${(1 - k2) * 40}px)`; });
    },
  };
  // 3D-карта с бликом металла + заголовок главы: s.n, s.title, s.c, s.flip (t перекраски)
  S.card = {
    build: (s) => $(`<div class="sc crd" style="--c:${acc(s.c)}"><div class="cw"><div class="card3"><div class="chip"></div><div class="num">2200  ••••  ••••  2026</div><div class="brand">${s.brand || "CREDIT"}</div><div class="sheen"></div></div></div>
      <div class="ttl">${s.n ? `<div class="n">${s.n}</div>` : ""}<div class="tx"><small>${s.kicker || "способ"}</small><span>${s.title}</span></div></div></div>`),
    tick: (el, s, t) => {
      const lt = t - s.t0, cw = el.querySelector(".cw"), k = out5(lt / 1.1);
      const ry = lerp(-75, -18, k) + 6 * Math.sin(t * .6), rx = lerp(30, 10, k) + 3 * Math.sin(t * .4);
      cw.style.transform = `perspective(1600px) translateX(${lerp(260, 0, k)}px) rotateY(${ry}deg) rotateX(${rx}deg) rotateZ(${lerp(-18, -8, k)}deg)`;
      el.querySelector(".sheen").style.backgroundPosition = `${lerp(-60, 160, ((ry + 75) / 70 + t * .08) % 1.2)}% 0`;
      const tt = el.querySelector(".ttl"), a = s.titleAt ?? s.t0 + .25, k2 = out5((t - a) / .55);
      tt.style.opacity = clamp((t - a) / .25); tt.style.transform = `translateX(${(1 - k2) * -80}px)`;
      const n = el.querySelector(".n"); if (n) n.style.transform = `scale(${lerp(1.6, 1, out5((t - a) / .4))})`;
    },
  };
  // гонка столбиков: s.bars [{label, v, c, at}], s.max, s.unit
  S.bars = {
    build: (s) => $(`<div class="sc brs">${s.title ? `<div class="bt">${s.title}</div>` : ""}${s.bars.map(b => `<div class="br" data-a="${b.at}" data-v="${b.v}" style="--c:${acc(b.c)}"><span class="bl">${b.label}</span><span class="track"><i></i></span><span class="bv"></span></div>`).join("")}${s.note ? `<div class="bn">${s.note}</div>` : ""}</div>`),
    tick: (el, s, t) => { const mx = s.max || 50;
      el.querySelectorAll(".br").forEach(b => { const a = +b.dataset.a, v = +b.dataset.v, k = io3((t - a) / 1.0);
        b.style.opacity = clamp((t - a + .2) / .3); b.querySelector("i").style.width = `${(v / mx) * 100 * k}%`;
        b.querySelector(".bv").textContent = (v * k).toFixed(s.dec || 0).replace(".", ",") + (s.unit || " %") + (b.dataset.plus && k >= 1 ? "+" : ""); });
      const bt = el.querySelector(".bt"); if (bt) { const k = out5((t - s.t0) / .5); bt.style.opacity = k; bt.style.transform = `translateY(${(1 - k) * -20}px)`; } },
  };

  // сравнение двух колонок: s.l {k, v, c, at}, s.r {…}, s.mid (текст между), s.title
  S.split = {
    build: (s) => $(`<div class="sc spl">${s.title ? `<div class="st">${s.title}</div>` : ""}<div class="cols">${[s.l, s.r].map((c, i) => `<div class="col" data-a="${c.at}" style="--c:${acc(c.c)}${c.vs ? `;--vs:${c.vs}px` : ""}"><small>${c.k}</small><b>${c.v}</b>${c.sub ? `<span>${c.sub}</span>` : ""}</div>${i === 0 ? `<div class="mid" data-a="${s.midAt ?? s.r.at}">${s.mid || "→"}</div>` : ""}`).join("")}</div></div>`),
    tick: (el, s, t) => { el.querySelectorAll("[data-a]").forEach(c => { const a = +c.dataset.a, k = out5((t - a) / .5); c.style.opacity = clamp((t - a) / .25); c.style.transform = `translateY(${(1 - k) * 60}px) scale(${lerp(.92, 1, k)})`; });
      const st = el.querySelector(".st"); if (st) { const k = out5((t - s.t0) / .5); st.style.opacity = k; } },
  };
  // список с отметками: s.title, s.items [{t, at, mk: ok|no|n, c}]
  S.list = {
    build: (s) => $(`<div class="sc lst">${s.title ? `<div class="lt">${s.title}</div>` : ""}${s.items.map((it, i) => `<div class="li" data-a="${it.at}" style="--c:${acc(it.c || (it.mk === "no" ? "r" : "g"))}"><span class="mk">${it.mk === "no" ? "✕" : it.mk === "ok" ? "✓" : i + 1}</span><span>${it.t}</span></div>`).join("")}</div>`),
    tick: (el, s, t) => { el.querySelectorAll(".li").forEach(li => { const a = +li.dataset.a, k = out5((t - a) / .45); li.style.opacity = clamp((t - a) / .2); li.style.transform = `translateX(${(1 - k) * -90}px)`;
        const mk = li.querySelector(".mk"), km = out5((t - a - .12) / .3); mk.style.transform = `scale(${t < a + .12 ? 0.5 : lerp(1.5, 1, km)})`; });
      const lt = el.querySelector(".lt"); if (lt) lt.style.opacity = out5((t - s.t0) / .4); },
  };
  // календарь (полноэкранный): s.days, s.from, s.to, s.a, s.b, s.marks [{d, text, c, at}]
  S.cal = {
    build: (s) => $(`<div class="sc scal"><div class="grid">${Array.from({ length: s.days || 35 }, (_, i) => `<i data-d="${i + 1}">${(i % 31) + 1}</i>`).join("")}</div>${(s.marks || []).map(m => `<div class="cm" data-a="${m.at}" data-d="${m.d}" style="--c:${acc(m.c)}">${m.text}</div>`).join("")}${s.title ? `<div class="ct">${s.title}</div>` : ""}</div>`),
    tick: (el, s, t) => { const n = Math.round((s.to - s.from + 1) * io3((t - s.a) / (s.b - s.a)));
      el.querySelectorAll("i").forEach(e => { const d = +e.dataset.d; e.className = d >= s.from && d < s.from + n ? "on" : (d === s.to + 1 && t >= s.b ? "end" : ""); });
      el.querySelectorAll(".cm").forEach(m => { const a = +m.dataset.a, k = out5((t - a) / .4), d = +m.dataset.d - 1; m.style.left = `${560 + (d % 7) * 116}px`; m.style.top = `${190 + Math.floor(d / 7) * 116 - 40}px`;
        m.style.opacity = clamp((t - a) / .2); m.style.transform = `translateY(${(1 - k) * -30}px) scale(${lerp(1.3, 1, k)})`; }); },
  };
  // расчёт: s.lines [{t, at}], s.res {v, at, c}
  S.calc = {
    build: (s) => $(`<div class="sc calc2">${s.lines.map(l => `<div class="cl" data-a="${l.at}">${l.t}</div>`).join("")}${s.res ? `<div class="cr" data-a="${s.res.at}" style="--c:${acc(s.res.c)}">${s.res.v}</div>` : ""}${s.note ? `<div class="cn">${s.note}</div>` : ""}</div>`),
    tick: (el, s, t) => { el.querySelectorAll(".cl").forEach(l => { const a = +l.dataset.a, k = out5((t - a) / .4); l.style.opacity = clamp((t - a) / .2); l.style.transform = `translateY(${(1 - k) * 30}px)`; });
      const r = el.querySelector(".cr"); if (r) { const a = +r.dataset.a, k = out5((t - a) / .45); r.style.opacity = t < a ? 0 : 1; r.style.transform = `scale(${lerp(1.6, 1, k)})`; r.style.textShadow = `0 0 ${50 * k}px color-mix(in srgb, var(--c) 50%, transparent)`; } },
  };
  // чат/мем: s.msgs [{t, at, me}]
  S.chat = {
    build: (s) => $(`<div class="sc cht">${s.msgs.map(m => `<div class="bb ${m.me ? "me" : ""}" data-a="${m.at}" style="--c:${acc(m.c || (m.me ? "b" : "w"))}">${m.who ? `<small>${m.who}</small>` : ""}${m.t}</div>`).join("")}</div>`),
    tick: (el, s, t) => el.querySelectorAll(".bb").forEach(b => { const a = +b.dataset.a, k = out5((t - a) / .4); b.style.opacity = clamp((t - a) / .15); b.style.transform = `translateY(${(1 - k) * 50}px) scale(${lerp(.85, 1, k)})`; }),
  };
  // таблица итогов: s.head [l, r], s.rows [{l, r, at, ra}]
  S.table = {
    build: (s) => $(`<div class="sc tbl2"><div class="th"><span>${s.head[0]}</span><span></span><span>${s.head[1]}</span></div>${s.rows.map(r => `<div class="tr" data-a="${r.at}" data-ra="${r.ra ?? r.at + .35}"><span class="l">${r.l}</span><span class="ar">→</span><span class="r">${r.r}</span></div>`).join("")}</div>`),
    tick: (el, s, t) => el.querySelectorAll(".tr").forEach(r => { const a = +r.dataset.a, ra = +r.dataset.ra, k = out5((t - a) / .4), kr = out5((t - ra) / .4);
      r.style.opacity = clamp((t - a) / .2); r.style.transform = `translateX(${(1 - k) * -60}px)`; const rr = r.querySelector(".r"); rr.style.filter = `blur(${12 * (1 - kr)}px)`; rr.style.opacity = t < ra ? .3 : 1; }),
  };
  // штамп-предупреждение: s.text, s.at, s.c, s.sub
  S.stamp = {
    build: (s) => $(`<div class="sc stp" style="--c:${acc(s.c || "r")}"><div class="sbox"><b>${s.text}</b>${s.sub ? `<span>${s.sub}</span>` : ""}</div></div>`),
    tick: (el, s, t) => { const k = out5((t - s.at) / .22), b = el.querySelector(".sbox"); b.style.opacity = t < s.at ? 0 : 1; b.style.transform = `rotate(-4deg) scale(${lerp(2.2, 1, k)})`; },
  };
  // пост Telegram (CTA): s.name, s.post, s.items [{t, at}], s.link
  S.tg = {
    build: (s) => $(`<div class="sc tgs"><div class="tgc"><div class="hd"><div class="av">₽</div><div><b>${s.name}</b><small>канал · ссылка в описании</small></div></div><div class="pst">${s.post}</div>${(s.items || []).map(i => `<div class="it" data-a="${i.at}">${i.t}</div>`).join("")}</div>${s.link ? `<div class="lk" data-a="${s.link.at}">${s.link.t}</div>` : ""}</div>`),
    tick: (el, s, t) => { const c = el.querySelector(".tgc"), k = out5((t - s.t0) / .6); c.style.transform = `perspective(1600px) rotateX(${(1 - k) * 25}deg) rotateY(-8deg) translateY(${(1 - k) * 160}px)`; c.style.opacity = k;
      el.querySelectorAll("[data-a]").forEach(i => { const a = +i.dataset.a, kk = out5((t - a) / .4); i.style.opacity = clamp((t - a) / .2); i.style.transform = `translateY(${(1 - kk) * 24}px)`; }); },
  };

  // схема-поток: s.nodes [{t, sub, at, c}], s.arrows [{t, at, c}] (между соседними узлами), s.title
  // стрелка «рисуется» слева направо, по ней бежит импульс — деньги текут
  S.flow = {
    build: (s) => $(`<div class="sc flw">${s.title ? `<div class="ft">${s.title}</div>` : ""}<div class="row">${s.nodes.map((n, i) =>
      `<div class="nd" data-a="${n.at}" style="--c:${acc(n.c || "w")}"><b>${n.t}</b>${n.sub ? `<small>${n.sub}</small>` : ""}</div>${i < s.nodes.length - 1 ? `<div class="ar" data-a="${s.arrows[i].at}" style="--c:${acc(s.arrows[i].c)}"><span>${s.arrows[i].t}</span><i><em></em></i></div>` : ""}`).join("")}</div></div>`),
    tick: (el, s, t) => {
      el.querySelectorAll(".nd").forEach(n => { const a = +n.dataset.a, k = out5((t - a) / .5); n.style.opacity = clamp((t - a) / .2); n.style.transform = `scale(${lerp(.7, 1, k)}) translateY(${(1 - k) * 40}px)`; });
      el.querySelectorAll(".ar").forEach(r => { const a = +r.dataset.a, k = io3((t - a) / .6); r.querySelector("i").style.clipPath = `inset(-30px ${(1 - k) * 100}% -30px 0)`;
        r.querySelector("span").style.opacity = clamp((t - a - .3) / .3); const e = r.querySelector("em"); e.style.left = `${((t - a) * 45) % 100}%`; e.style.opacity = k >= 1 ? 1 : 0; });
      const ft = el.querySelector(".ft"); if (ft) ft.style.opacity = out5((t - s.t0) / .4);
    },
  };

  // ---------- фон, свет, переходы ----------
  function bg(t, c1, c2) {
    const o1 = document.getElementById("orb1"), o2 = document.getElementById("orb2");
    o1.style.background = `radial-gradient(closest-side, ${c1}, transparent)`; o2.style.background = `radial-gradient(closest-side, ${c2}, transparent)`;
    o1.style.transform = `translate(${-200 + 160 * Math.sin(t * .17)}px, ${-120 + 90 * Math.cos(t * .21)}px) scale(${1 + .08 * Math.sin(t * .3)})`;
    o2.style.transform = `translate(${1100 + 140 * Math.cos(t * .13)}px, ${380 + 110 * Math.sin(t * .19)}px) scale(${1 + .1 * Math.cos(t * .27)})`;
    document.getElementById("grain").style.backgroundPosition = `${(hsh(Math.floor(t * 24)) * 200) | 0}px ${(hsh(Math.floor(t * 24) + 9) * 200) | 0}px`;
  }
  const mix = (a, b, k) => { const h = (c) => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16)); const x = h(a), y = h(b); return `rgb(${x.map((v, i) => Math.round(v + (y[i] - v) * k)).join(",")})`; };

  // шрифты грузятся лениво: без этого первая подгонка меряет текст запасным шрифтом (уже) — запрашиваем заранее,
  // и document.fonts.ready в render.js дождётся их
  ["900 100px Unb", "700 40px Mont", "800 40px Mono"].forEach(f => document.fonts.load(f));
  const ELS = new Map();
  window.renderAt = (t) => {
    const TL = window.TL, stage = document.getElementById("stage");
    let cur = null;
    for (const s of TL.scenes) {
      const on = t >= s.t0 - (s.pre || 0) && t < s.t1 + (s.post || 0);
      let el = ELS.get(s);
      if (!on) { if (el) { el.remove(); ELS.delete(s); } continue; }
      if (!el) { el = S[s.type].build(s); stage.appendChild(el); ELS.set(s, el); }
      S[s.type].tick(el, s, t);
      // камера сцены: никогда не стоит — медленный наезд и дрейф
      const lt = t - s.t0, d = s.t1 - s.t0, push = lerp(1, s.push ?? 1.05, lt / d);
      let sc = push, x = 6 * Math.sin(t * .4 + d), y = 4 * Math.cos(t * .33), bl = 0, op = 1;
      // вход: zoom (из 0.8 и размытия), whip (сбоку), cut; выход: zoom (в 1.3 и размытие), whip
      const ti = lt, to = s.t1 - t;
      if (s.tin === "zoom" && ti < .45) { const k = out3(ti / .45); sc *= lerp(.8, 1, k); bl += 18 * (1 - k); op *= clamp(ti / .12); }
      if (s.tin === "whip" && ti < .3) { const k = out3(ti / .3); x += 700 * (1 - k); bl += 22 * (1 - k); }
      if (s.tout === "zoom" && to < .25) { const k = in3(1 - to / .25); sc *= lerp(1, 1.35, k); bl += 20 * k; op *= 1 - k * .6; }
      if (s.tout === "whip" && to < .25) { const k = in3(1 - to / .25); x -= 700 * k; bl += 22 * k; }
      el.style.transform = `translate(${x}px, ${y}px) scale(${sc})`; el.style.filter = bl > .3 ? `blur(${bl.toFixed(1)}px)` : ""; el.style.opacity = op;
      if (t >= s.t0 && t < s.t1) cur = s;
    }
    // цвет света — от сцены, плавно
    const c = cur ? acc(cur.acc || "g") : ACC.g;
    window.__glow = window.__glow || c; bg(t, cur && cur.acc === "r" ? "rgba(255,77,94,.38)" : cur && cur.acc === "y" ? "rgba(255,216,74,.32)" : "rgba(61,220,132,.30)", "rgba(74,168,255,.22)");
    // вспышки и аберрация на ударах (TL.hits [{t, kind}])
    let fl = 0, ab = 0;
    for (const h of TL.hits || []) { const d = t - h.t; if (d >= -.03 && d < .35) { const e = d < 0 ? 1 : 1 - out3(d / .35); if (h.kind === "flash") fl = Math.max(fl, e); ab = Math.max(ab, e); } }
    document.getElementById("flash").style.opacity = fl * fl * .5;
    stage.style.filter = ab > .05 ? `drop-shadow(${6 * ab}px 0 0 rgba(255,40,80,.55)) drop-shadow(${-6 * ab}px 0 0 rgba(40,160,255,.55))` : "";
    // общий толчок камеры на долях (TL.kick)
    let kick = 1; for (const k of TL.kick || []) { const d = t - k.t; if (d >= 0 && d < .4) kick *= 1 + (k.a || .04) * (1 - out3(d / .4)); }
    stage.style.transform = `scale(${kick})`;
  };
})();
