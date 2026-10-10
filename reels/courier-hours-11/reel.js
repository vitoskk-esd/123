// Рилс #11: кадр в момент t — window.renderAt(t). Всё время — из timeline.js (build.py по словам голоса), анимация детерминирована.
// Смена плана каждые 1,5–2 с: кроме склеек между кадрами — «скачок» камеры (+4,5 % за 0,2 с) на каждом ключевом слове (ev).
(function () {
  const TL = window.TL, $ = (id) => document.getElementById(id);
  const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x)), lerp = (a, b, k) => a + (b - a) * k;
  const out3 = (x) => 1 - Math.pow(1 - clamp(x), 3), out5 = (x) => 1 - Math.pow(1 - clamp(x), 5);
  const io3 = (x) => { x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
  const back = (x, s = 1.6) => { x = clamp(x) - 1; return x * x * ((s + 1) * x + s) + 1; };
  const pop = (e, t, at, r = 0, from = 1.3) => { const k = clamp((t - at) / .3); e.style.opacity = t < at ? 0 : 1; e.style.transform = `rotate(${r}deg) scale(${lerp(from, 1, back(k))})`; };
  const wipe = (e, t, at, d = .5) => { e.style.clipPath = `inset(-20% ${(100 * (1 - clamp((t - at) / d))).toFixed(1)}% -20% -5%)`; };
  const draw = (p, k) => { const L = p._L || (p._L = p.getTotalLength()); p.style.strokeDasharray = L; p.style.strokeDashoffset = L * (1 - clamp(k)); };
  const typed = (s, k) => s.slice(0, Math.round(clamp(k) * s.length));
  // слова ответа ИИ — по одному
  const aw = []; (function wrap(n) { [...n.childNodes].forEach(c => { if (c.nodeType === 3) { const f = document.createDocumentFragment();
    c.textContent.split(/(\s+)/).forEach(p => { if (!p) return; if (/^\s+$/.test(p)) f.appendChild(document.createTextNode(p)); else { const s = document.createElement("span"); s.textContent = p; aw.push(s); f.appendChild(s); } });
    c.replaceWith(f); } else if (c.nodeType === 1) wrap(c); }); })($("a_ans"));
  const Q = "сколько получает курьер в час";
  const foot = $("foot"); foot.textContent = TL.foot;
  const caps = TL.caps, cap = $("cap"); let capCur = -1;

  const SHOT = {
    hook(t, e, s) {
      const first = s.t0 === 0;   // кадр 0: вырезка и сумма уже на месте
      if (!first) { pop($("h_cut"), t, 0, -4, 1.15); pop($("h_big"), t, .08, -4, 1.25); }
      pop($("h_six"), t, e.six, 5); wipe($("h_kur"), t, e.kur, .55);
      draw($("h_clk"), (t - e.kur - .2) / .5); draw($("h_hand"), (t - e.kur - .6) / .3);
    },
    push(t, e) {
      const p = $("p_push"), k = out5((t - e.same) / .45); p.style.opacity = t < e.same ? 0 : 1; p.style.transform = `translateY(${(1 - k) * -260}px)`;
      pop($("p_card"), t, e.card, -4); pop($("p_buy"), t, e.buy, 5);
    },
    search(t, e, s) {
      const tq = .1, te = Math.max(tq + .6, e.ans - .25);
      $("q_tx").textContent = typed(Q, (t - tq) / (te - tq)); $("q_car").style.opacity = t < te + .1 ? 1 : (Math.floor(t * 2.2) % 2 ? 0 : 1);
      const r = $("q_res"), k = out5((t - e.ans) / .45); r.style.opacity = clamp((t - e.ans) / .15); r.style.transform = `translateY(${(1 - k) * 40}px)`;
      $("q_src").style.opacity = clamp((t - e.src) / .3);
    },
    edit(t, e, s) {
      const k1 = out5((t - .25) / .7), k2 = out5((t - e.bonus) / .8), h1 = 150 * k1, h2 = 480 * k2;
      $("e_b1").style.height = h1 + "px"; $("e_v1").style.top = (1080 - h1 - 90) + "px"; $("e_v1").style.opacity = clamp(k1 * 3);
      $("e_b2").style.height = h2 + "px"; $("e_v2").style.top = (1080 - h2 - 90) + "px"; $("e_v2").style.opacity = clamp(k2 * 3);
    },
    ai(t, e, s) {
      const q = $("a_q"), kq = out5(t / .35); q.style.opacity = clamp(t / .15); q.style.transform = `translateY(${(1 - kq) * 30}px)`;
      const a0 = .45, a1 = Math.max(a0 + 1, e.buy + .2), n = Math.floor(clamp((t - a0) / (a1 - a0)) * aw.length);
      aw.forEach((w, i) => { w.style.opacity = i < n ? 1 : 0; });
      document.querySelectorAll("#a_ans .hlx").forEach(h => { h.style.opacity = h.querySelector("span").style.opacity; });   // подсветка — вместе со своими словами
    },
    office(t, e, s) {
      $("o_h1").style.width = `${100 * out3((t - e.new) / .5)}%`;
      $("o_h2").style.width = `${100 * out3((t - e.buy) / .5)}%`;
      $("o_st").style.width = `${100 * io3((t - e.tr) / .35)}%`;
      pop($("o_note"), t, e.new + .25, -8);
    },
    stamp(t, e, s) {
      const st = $("s_stamp"), at = e.eat, k = clamp((t - at) / .18);
      st.style.opacity = t < at ? 0 : .92; st.style.transform = `rotate(-14deg) scale(${lerp(2.2, 1, out5(k))})`;
      pop($("s_free"), t, e.free, -5);
    },
    tg(t, e, s) {
      // как в утверждённом кадре: телефон всплывает, лента прокручивается, тап по «Подписаться» на «ссылка в профиле»
      const iph = $("iph"), feed = $("feed"), join = $("join"), tap = $("tap"), d = s.t1 - s.t0, bs = feed.querySelectorAll(".b");
      const u = out3(t / .5); iph.style.transform = `translateY(${(1 - u) * 70}px) rotate(${2 - u}deg) scale(.93)`;
      const y1 = bs[2].offsetTop - 262 - 60; feed.style.transform = `translateY(${-io3((t - .5) / Math.max(1, e.link - .7)) * y1}px)`;
      const ta = e.link, k = clamp((t - ta) / .6), p = Math.sin(Math.PI * k);
      tap.style.opacity = t > ta && t < ta + .6 ? p : 0; tap.style.transform = `scale(${1 - .25 * p})`;
      join.style.transform = `scale(${1 - .04 * p})`; join.style.background = `rgba(${32 + 40 * p},${31 + 60 * p},${36 + 90 * p},.78)`;
      const l = $("t_link"), kl = out5((t - ta) / .4); l.style.opacity = clamp((t - ta + .1) / .2); l.style.transform = `translateY(${(1 - kl) * 20}px)`;
    },
    loop(t, e, s) {
      const d = s.t1 - s.t0, ac = e.cut;
      pop($("l_bag"), t, .05, -5); wipe($("l_hand"), t, e.hand + .35, .6);
      // вырезка «2 000 ₽» въезжает справа и встаёт ровно туда, где она в кадре 0 — склейка в начало незаметна
      const k = out5((t - ac) / Math.max(.3, d - ac - .05)), x = (1 - k) * 1150;
      $("l_cut").style.transform = `translateX(${x}px) rotate(${-4 - (1 - k) * 8}deg)`; $("l_big").style.transform = `translateX(${x}px) rotate(${-4 - (1 - k) * 8}deg)`;
      $("l_bag").style.opacity = t < .05 ? 0 : 1 - clamp((t - ac - .2) / .25); $("l_hand").style.opacity = 1 - clamp((t - ac - .2) / .25);
    },
  };

  window.renderAt = (t) => {
    let i = TL.shots.findIndex(s => t < s.t1); if (i < 0) i = TL.shots.length - 1;
    TL.shots.forEach((s, k) => { $(s.id).style.visibility = k === i ? "visible" : "hidden"; });
    const s = TL.shots[i], lt = t - s.t0, d = s.t1 - s.t0, root = $(s.id), cam = root.querySelector(".cam");
    // камера: медленный наезд + «скачок» на каждом ключевом слове; вход нового плана — с 1,06 за 0,22 с; петля — без наезда
    let sc = s.id === "loop" ? 1 : 1 + .035 * clamp(lt / d);
    const J = { loop: 0, tg: 0, edit: .02 }[s.id] ?? .045;   // в инфографике скачки меньше: подписи у краёв
    Object.values(s.ev).forEach(a => { sc += J * out5((t - a) / .2); });
    if (s.t0 > 0) sc *= lerp(1.06, 1, out5(lt / .22));
    const shake = s.id === "stamp" ? Math.max(0, 1 - Math.abs(t - s.ev.eat) / .25) * (t >= s.ev.eat ? 1 : 0) * Math.sin(t * 90) * 6 : 0;
    if (cam) cam.style.transform = `translate(${shake}px, ${shake * .6}px) scale(${sc})`;
    SHOT[s.id](lt, Object.fromEntries(Object.entries(s.ev).map(([k, v]) => [k, v - s.t0])), s);
    $("flash").style.opacity = s.t0 > 0 ? .35 * (1 - clamp(lt / .12)) : 0;
    // субтитры v2: 2–3 слова, ключевое крупнее; в финале с каналом своя подпись
    const ci = s.capOff ? -1 : caps.findIndex(c => t >= c.t0 && t < c.t1);
    if (ci !== capCur) { cap.innerHTML = ci >= 0 ? caps[ci].html : ""; capCur = ci; }
    cap.className = s.dark ? "dark" : "";
    if (ci >= 0) { const k = clamp((t - caps[ci].t0) / .14); cap.style.opacity = caps[ci].t0 <= 0 ? 1 : clamp((t - caps[ci].t0) / .05); /* кадр 0 — уже с подписью */ cap.style.transform = `scale(${lerp(1.12, 1, out3(k))})`; }
    foot.className = "foot" + (s.dark ? " dark" : "");
    $("grain").style.transform = `translate(${(Math.sin(t * 91) * 40) | 0}px, ${(Math.cos(t * 77) * 40) | 0}px)`;
  };
  document.fonts.ready.then(() => { window.renderAt(0); window.__ready = true; });
})();
