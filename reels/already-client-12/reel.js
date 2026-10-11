// Рилс #12, версия 2 — кадр в момент t: window.renderAt(t). Время — timeline.js (build.py по словам голоса). Всё детерминировано от t.
// Сцены с разным светом (небо / космос / белый / тёплый), слова-герои, карточки слоями, пролёт камеры внутрь предмета как переход,
// барабан цифр, пиксельная монетка, конфетти, курсор; слова голоса появляются по одному из размытия.
(function () {
  const TL = window.TL, $ = (id) => document.getElementById(id);
  const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x)), lerp = (a, b, k) => a + (b - a) * k;
  const out3 = (x) => 1 - Math.pow(1 - clamp(x), 3), out5 = (x) => 1 - Math.pow(1 - clamp(x), 5);
  const io3 = (x) => { x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
  const back = (x, s = 1.6) => { x = clamp(x) - 1; return x * x * ((s + 1) * x + s) + 1; };
  let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  // «шлепок»: из большого и размытого в свой размер с перелётом
  const pop = (e, t, at, from = 1.4, r = 0, blur = 12) => { const k = clamp((t - at) / .35); e.style.opacity = t < at ? 0 : clamp(k * 3);
    e.style.transform = `rotate(${r}deg) scale(${lerp(from, 1, back(k))})`; e.style.filter = `blur(${(blur * (1 - out3(k))).toFixed(1)}px)`; };
  // подъём снизу из размытия
  const rise = (e, t, at, dy = 60) => { const k = out5((t - at) / .5); e.style.opacity = clamp((t - at) / .2); e.style.transform = `translateY(${(1 - k) * dy}px)`;
    e.style.filter = `blur(${(10 * (1 - k)).toFixed(1)}px)`; };
  let shake = 0, flash = 0;
  // тема (?theme=dark|paper|mono) — взрослые стили без мультяшности (владелец: «выглядит так, как будто рилс для детей»)
  const THEME = new URLSearchParams(location.search).get("theme") || "";
  if (THEME) document.body.classList.add("th-" + THEME);
  const PAL = {
    "": { gosOn: "#12a150", gosOnTx: "#fff", gosOff: "#e7eefc", gosTx: "#2b5bd7", ok: "18,161,80", btn: "#3d6cff", btnOn: "#2b5bd7", btnTx: "#fff", ring: "61,108,255" },
    dark: { gosOn: "#c8ff3d", gosOnTx: "#07080a", gosOff: "rgba(255,255,255,.08)", gosTx: "#f2f3f5", ok: "200,255,61", btn: "#c8ff3d", btnOn: "#a6e01f", btnTx: "#07080a", ring: "200,255,61" },
    paper: { gosOn: "#111", gosOnTx: "#efe9dd", gosOff: "#fffdf8", gosTx: "#111", ok: "215,38,30", btn: "#111", btnOn: "#d7261e", btnTx: "#efe9dd", ring: "215,38,30" },
    aurora: { gosOn: "linear-gradient(90deg,#7c5cff,#00c8ff)", gosOnTx: "#fff", gosOff: "rgba(255,255,255,.1)", gosTx: "#fff", ok: "125,227,255", btn: "linear-gradient(90deg,#7c5cff,#00c8ff)", btnOn: "linear-gradient(90deg,#6a48ff,#00b0e0)", btnTx: "#fff", ring: "125,227,255" },
    poster: { gosOn: "#111", gosOnTx: "#ffe14d", gosOff: "#fff", gosTx: "#111", ok: "17,17,17", btn: "#ffe14d", btnOn: "#ff3d00", btnTx: "#111", ring: "255,225,77" },
    wrapped: { gosOn: "#111", gosOnTx: "#c6ff00", gosOff: "#f1f1f1", gosTx: "#111", ok: "198,255,0", btn: "#c6ff00", btnOn: "#a8e000", btnTx: "#111", ring: "198,255,0" },
    mono: { gosOn: "#1d1d1f", gosOnTx: "#fff", gosOff: "#f2f2f4", gosTx: "#0071e3", ok: "0,113,227", btn: "#0071e3", btnOn: "#0060c0", btnTx: "#fff", ring: "0,113,227" },
  }[THEME] || {};   // выставляют сцены, применяет renderAt

  // ---------- фоны: облака и звёзды ----------
  const clouds = [];
  for (let i = 0; i < 16; i++) { const e = document.createElement("i"), w = 300 + rnd() * 420;
    Object.assign(e.style, { width: w + "px", height: w * .42 + "px", top: (80 + rnd() * 1650) + "px", opacity: (.45 + rnd() * .45).toFixed(2) });
    $("bg_sky").appendChild(e); clouds.push({ e, w, x0: rnd() * 1800, v: 8 + rnd() * 26 }); }
  const stars = [];
  for (let i = 0; i < 90; i++) { const e = document.createElement("b");
    Object.assign(e.style, { left: (rnd() * 1080) + "px", top: (rnd() * 1450) + "px", transform: `scale(${(.5 + rnd() * 1.3).toFixed(2)})` });
    $("bg_space").appendChild(e); stars.push({ e, f: .6 + rnd() * 2.2, ph: rnd() * 6 }); }

  // ---------- пиксельная монетка ----------
  const COIN = { o: "#8a5a00", y: "#ffd23f", h: "#fff6c8", e: "#1b1b1b", m: "#1b1b1b", t: "#4aa3ff", c: "#ff8fa3" };
  const TOP = ["...oooooo...", "..oyyyyyyo..", ".oyhyyyyyyo.", "oyhyyyyyyyyo", "oyyeyyyyeyyo", "oyyeyyyyeyyo"];
  const FACE = {
    sad: TOP.concat(["oyytyyyyyyyo", "oyyymmmmyyyo", "oyymyyyymyyo", ".oyyyyyyyyo.", "..oyyyyyyo..", "...oooooo..."]),
    happy: TOP.concat(["oycyyyyyycyo", "oyymyyyymyyo", "oyyymmmmyyyo", ".oyyyyyyyyo.", "..oyyyyyyo..", "...oooooo..."]),
  };
  function mascot(el, face) { FACE[face].join("").split("").forEach(ch => { const i = document.createElement("i"); i.style.background = COIN[ch] || "transparent"; el.appendChild(i); }); }
  mascot($("p_mascot"), "sad"); mascot($("k_mascot"), "happy");

  // ---------- конфетти ----------
  const CC = ["#3d6cff", "#ffcf4a", "#12a150", "#e5484d", "#c06bff", "#3df5ff"], conf = [];
  for (let i = 0; i < 46; i++) { const e = document.createElement("div"); e.className = "conf"; e.style.background = CC[i % CC.length]; $("conf").appendChild(e);
    const a = -Math.PI / 2 + (rnd() * 2 - 1) * 1.2, v = 900 + rnd() * 900; conf.push({ e, vx: Math.cos(a) * v, vy: Math.sin(a) * v, r: rnd() * 720 - 360, d: rnd() * .25 }); }

  // ---------- барабан «2014» ----------
  const slot = [];
  "2014".split("").forEach((d, i) => { const sp = document.createElement("span"), col = document.createElement("div"), n = 9 + i * 3;
    for (let j = 0; j < n; j++) { const x = document.createElement("i"); x.textContent = j === n - 1 ? d : Math.floor(rnd() * 10); col.appendChild(x); }
    sp.appendChild(col); $("t_slot").appendChild(sp); slot.push({ col, n, i }); });

  // ---------- кинетический текст ----------
  const txt = $("txt"), TOPS = { low: 1290, mid: 820, top: 1380 }; let chunkCur = -1, spans = [];
  function renderText(t, light) {
    txt.className = light ? "light" : "";
    const ci = TL.chunks.findIndex(c => t >= c.t0 && t < c.t1);
    if (ci !== chunkCur) {
      chunkCur = ci; txt.innerHTML = ""; spans = [];
      if (ci >= 0) { const c = TL.chunks[ci];
        TL.words.slice(c.i0, c.i1 + 1).forEach((w, j) => { const s = document.createElement("span"); s.className = "w " + (w.c || ""); s.textContent = w.w;
          txt.appendChild(s); spans.push({ s, a: w.a }); if (j < c.i1 - c.i0) txt.appendChild(document.createTextNode(" ")); });
        txt.style.top = (TOPS[c.pos] || 1290) + "px"; }
    }
    if (ci < 0) return;
    const c = TL.chunks[ci], out = clamp((t - (c.t1 - .2)) / .2);
    spans.forEach(({ s, a }, j) => {
      const at = ci === 0 && j < 2 ? -1 : a - .06;   // кадр 0 — уже с первыми словами
      const k = out3((t - at) / .3);
      s.style.display = t < at ? "none" : "";   // ещё не прозвучавшие слова не занимают места — строка всегда по центру
      s.style.opacity = t < at ? 0 : clamp(k * 1.4) * (1 - out);
      s.style.filter = `blur(${(14 * (1 - k) + 12 * out).toFixed(1)}px)`;
      s.style.transform = `translateY(${((1 - k) * 34 - out * 26).toFixed(1)}px) scale(${lerp(1.12, 1, k).toFixed(3)})`;
    });
  }

  // ---------- курсор ----------
  const cur = $("cur"), ring = $("ring");
  function centerOf(id) { const r = $(id).getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; }
  function renderCursor(t, clicks) {
    cur.style.opacity = 0; ring.style.opacity = 0;
    if (!clicks.length) return;
    const i = clicks.findIndex(c => t < c.t + .6); if (i < 0) return;
    const c = clicks[i], [tx, ty] = centerOf(c.id), prev = i > 0 ? centerOf(clicks[i - 1].id) : [tx + 260, ty + 340];
    const startMove = i > 0 ? Math.max(clicks[i - 1].t + .15, c.t - .7) : c.t - .8;
    if (t < startMove - (i > 0 ? 0 : .2)) return;
    const k = io3((t - startMove) / Math.max(.2, c.t - startMove - .05));
    const x = lerp(prev[0], tx, k), y = lerp(prev[1], ty, k);
    const press = c.click === false ? 0 : Math.sin(Math.PI * clamp((t - c.t + .08) / .2));
    cur.style.opacity = clamp((t - startMove + .2) / .2) * (1 - clamp((t - c.t - .45) / .15));
    cur.style.transform = `translate(${x - 8}px, ${y - 6}px) scale(${1 - .18 * press})`; cur.style.transformOrigin = "8px 6px";
    if (c.click !== false) { const kr = clamp((t - c.t) / .45); ring.style.left = tx + "px"; ring.style.top = ty + "px";
      ring.style.opacity = t >= c.t && kr < 1 ? 1 - kr : 0; ring.style.transform = `scale(${.4 + .9 * kr})`; }
  }

  // ---------- сцены (t и события — от начала сцены) ----------
  const impact = (t, at, amp = 22, fl = .55) => { const d = t - at; if (d < 0) return; shake = Math.max(shake, amp * Math.exp(-d * 9)); flash = Math.max(flash, fl * (1 - clamp(d / .2))); };
  const SC = {
    s_card(t, e, s) {
      $("c_back").style.transform = `translate(${(-t * 14).toFixed(1)}px, ${(t * 6).toFixed(1)}px) scale(${1 + t * .01})`;
      $("c_front").style.transform = `translateY(${(Math.sin(t * 1.6) * 10).toFixed(1)}px) rotate(${(-3 + Math.sin(t * .9) * 1.5).toFixed(2)}deg)`;
      const b = $("c_bank"); rise(b, t, s.t0 === 0 ? -1 : e.card, 120);   // кадр 0 — карта уже на месте
      const g = clamp((t - e.old - .3) / .4); b.style.filter = (b.style.filter || "") + ` grayscale(${g.toFixed(2)}) brightness(${(1 - .25 * g).toFixed(2)})`;
      pop($("c_hero"), t, e.old, 1.5, -4, 16);
      const st = $("c_stamp"), k = clamp((t - e.old - .3) / .16);
      st.style.opacity = t < e.old + .3 ? 0 : 1; st.style.transform = `rotate(-8deg) scale(${lerp(2.4, 1, out5(k))})`;
      impact(t, e.old + .3);
    },
    s_push(t, e) {
      const p = $("p_card"), k = out5((t - e.no) / .55); p.style.opacity = clamp((t - e.no) / .15);
      p.style.transform = `translateY(${((1 - k) * -260).toFixed(1)}px)`; p.style.filter = `blur(${(10 * (1 - k)).toFixed(1)}px)`;
      const z = $("p_zero"); pop(z, t, e.no + .35, 1.8, 0, 20); if (t > e.no + .7) z.style.transform += ` scale(${1 + Math.sin((t - e.no) * 3) * .015})`;
      const m = $("p_mascot"); pop(m, t, e.sad, 1.6, 0, 8); if (t > e.sad + .35) m.style.transform += ` translateY(${(Math.sin((t - e.sad) * 4) * 8).toFixed(1)}px)`;
      impact(t, e.no + .35, 10, .25);
    },
    s_list(t, e) {
      const h = $("l_hero"); pop(h, t, 0, 1.3, -2, 14);
      const up = out5((t - e.a) / .6); h.style.transform += ` translateY(${(-60 * up).toFixed(1)}px) scale(${lerp(1, .8, up).toFixed(3)})`;
      // карты сначала лежат стопкой рубашкой к зрителю (размыты), на «карта для / зарплатная / детская» разлетаются веером
      const POS = [[-190, -30, -14], [0, 40, 2], [190, 110, 15]];
      ["l1", "l2", "l3"].forEach((id, i) => { const at = [e.a, e.b, e.c][i], k = back((t - at) / .55, 1.3), el = $(id), [x, y, r] = POS[i];
        const sx = (i - 1) * 14, sy = 60 - i * 16, sr = (i - 1) * 5, kin = out5((t - .15 - i * .08) / .6), fl = Math.sin(t * 1.4 + i * 1.7) * 6;
        el.style.opacity = clamp((t - .15 - i * .08) / .25);
        el.style.filter = `blur(${(lerp(14, 5, kin) * (1 - out3((t - at) / .4))).toFixed(1)}px) brightness(${lerp(.8, 1, clamp((t - at) / .3)).toFixed(2)})`;
        el.style.transform = `translate(${lerp(sx, x, k).toFixed(1)}px, ${(lerp(sy + (1 - kin) * 500, y, k) + fl).toFixed(1)}px) rotate(${lerp(sr, r, k).toFixed(2)}deg) scale(${lerp(.74, .82, k).toFixed(3)})`;
        el.style.zIndex = t >= at ? 10 + i : 3 - i; });
    },
    s_search(t, e) {
      const bar = $("q_bar"), kb = out5(t / .55); bar.style.opacity = clamp(t / .15);
      bar.style.transform = `scale(${lerp(2.4, 1, kb).toFixed(3)})`; bar.style.filter = `blur(${(16 * (1 - kb)).toFixed(1)}px)`;
      const q = TL.query, t1 = Math.max(.7, e.min - .45), n = Math.round(clamp((t - .3) / (t1 - .3)) * q.length);
      $("q_tx").textContent = q.slice(0, n); $("q_car").style.opacity = t < t1 + .1 || Math.floor(t * 2.2) % 2 ? 1 : 0;
      pop($("q_chip"), t, e.min, 1.6, -4, 12);
      $("q_hand").setAttribute("transform", `rotate(${(Math.max(0, t - e.min) * 300).toFixed(1)} 28 28)`);
    },
    s_cab(t, e) {
      const w = $("cab_win"); rise(w, t, 0, 160); if (t > .5) w.style.transform = `translateY(${(Math.sin(t * 1.3) * 6).toFixed(1)}px)`;
      const gb = $("c_gos"), on = t > e.gos;
      gb.style.background = on ? PAL.gosOn : PAL.gosOff; gb.style.color = on ? PAL.gosOnTx : PAL.gosTx; gb.textContent = on ? "Вход выполнен ✓" : "Войти через Госуслуги";
      gb.style.transform = `scale(${1 - .06 * Math.sin(Math.PI * clamp((t - e.gos + .05) / .25))})`;
      const it = $("c_item"); it.className = t > e.open ? "on" : ""; it.style.transform = `scale(${1 + .05 * back(clamp((t - e.open) / .35)) * (t > e.open ? 1 : 0)})`;
    },
    s_tbl(t, e) {
      rise($("t_card"), t, 0, 120);
      ["t1", "t2", "t3", "t4"].forEach((id, i) => rise($(id), t, e.banks + .15 + i * .22, 30));
      rise($("t_lbl"), t, e.year - .1, 30);
      const sl = $("t_slot"); sl.style.opacity = t < e.year ? 0 : 1;
      slot.forEach(({ col, n, i }) => { const k = out5((t - e.year) / (.7 + i * .18)); col.style.transform = `translateY(${(-(n - 1) * 230 * k).toFixed(1)}px)`;
        col.style.filter = `blur(${(k < 1 ? 6 * (1 - k) : 0).toFixed(1)}px)`; });
      if (t > e.year) impact(t, e.year + 1.24, 8, 0);
    },
    s_ok(t, e) {
      rise($("k1"), t, .05, 30); rise($("k2"), t, .25, 30); rise($("k3"), t, Math.max(.45, e.new - .25), 30);
      const g = $("k3"), p = Math.sin(Math.PI * clamp((t - e.new) / .45));
      g.style.transform += ` scale(${1 + .06 * p})`; g.style.boxShadow = t > e.new ? `0 0 0 5px rgb(${PAL.ok}), 0 24px 60px rgba(${PAL.ok},.35)` : "";
      pop($("k_hero"), t, e.mine, 1.6, -3, 16);
      const m = $("k_mascot"); pop(m, t, e.new, 1.5, 0, 8);
      if (t > e.new + .35) m.style.transform += ` translateY(${(-Math.abs(Math.sin((t - e.new) * 6)) * 60).toFixed(1)}px)`;
      conf.forEach(({ e: c, vx, vy, r, d }) => { const dt = t - e.mine - d;
        if (dt < 0) { c.style.opacity = 0; return; }
        c.style.opacity = 1 - clamp((dt - 1.4) / .5);
        c.style.transform = `translate(${(540 + vx * dt).toFixed(1)}px, ${(980 + vy * dt + 750 * dt * dt).toFixed(1)}px) rotate(${(r * dt * 2).toFixed(1)}deg)`; });
      impact(t, e.mine, 12, .3);
    },
    s_end(t, e) {
      const a = document.querySelector("#s_end .ava"); pop(a, t, 0, .4, 0, 10);
      const o = $("e_orbit"); o.style.opacity = clamp((t - .2) / .3); o.style.transform = `rotate(${(t * 90).toFixed(1)}deg)`;
      const b = $("e_btn"), pr = Math.sin(Math.PI * clamp((t - e.link) / .3)), ring = (t * 1.2) % 1;
      b.style.transform = `scale(${1 - .06 * pr})`; b.style.background = t > e.link ? PAL.btnOn : PAL.btn; b.style.color = PAL.btnTx;
      b.style.boxShadow = `0 0 0 ${(ring * 40).toFixed(1)}px rgba(${PAL.ring},${(.5 * (1 - ring)).toFixed(2)}), 0 20px 60px rgba(${PAL.ring},.45)`;
    },
    s_none() {},
  };
  // выход: пролёт камеры внутрь предмета (масштаб и точка), по умолчанию — небольшой наезд
  const EXIT = { s_search: { s: 3.6, o: "50% 36%" }, s_cab: { s: 2.4, o: "50% 47%" } };
  const BGS = ["sky", "space", "white", "warm"];

  window.renderAt = (t) => {
    let i = TL.scenes.findIndex(s => t < s.t1); if (i < 0) i = TL.scenes.length - 1;
    TL.scenes.forEach((s, k) => { $(s.id).style.visibility = k === i ? "visible" : "hidden"; });
    const s = TL.scenes[i], lt = t - s.t0, d = s.t1 - s.t0, root = $(s.id), last = i === TL.scenes.length - 1;
    // фон: плавная смена за 0,45 с
    const pb = i > 0 ? TL.scenes[i - 1].bg : s.bg, kb = s.t0 > 0 ? io3(lt / .45) : 1;
    BGS.forEach(b => { $("bg_" + b).style.opacity = b === s.bg ? (pb === s.bg ? 1 : kb) : (b === pb ? 1 - kb : 0); });
    clouds.forEach(({ e, w, x0, v }) => { e.style.left = (((x0 + v * t) % (1080 + 2 * w)) - w).toFixed(1) + "px"; });
    stars.forEach(({ e, f, ph }) => { e.style.opacity = (.3 + .7 * Math.abs(Math.sin(t * f + ph))).toFixed(2); });
    const light = ["dark", "aurora", "wrapped"].includes(THEME) || s.bg === "space"; $("foot").className = "foot" + (light ? " light" : "");
    shake = 0; flash = 0;
    const ev = Object.fromEntries(Object.entries(s.ev || {}).map(([k, v]) => [k, v - s.t0]));
    SC[s.id](lt, ev, s);
    // вход: из 0,9 с размытием; выход за 0,32 с: пролёт вперёд (или внутрь предмета); внутри — медленный наезд
    const kin = s.t0 > 0 ? out5(lt / .4) : 1, kout = last ? 0 : io3(clamp((lt - (d - .32)) / .32)), ex = EXIT[s.id] || { s: 1.14, o: "50% 42%" };
    const sc = lerp(.9, 1, kin) * (1 + .03 * clamp(lt / d)) * lerp(1, ex.s, kout);
    const sx = shake ? Math.sin(t * 97) * shake : 0, sy = shake ? Math.cos(t * 83) * shake : 0;
    root.style.transformOrigin = kout > 0 ? ex.o : "50% 42%";
    root.style.transform = `translate(${sx.toFixed(1)}px, ${sy.toFixed(1)}px) scale(${sc.toFixed(4)})`;
    root.style.opacity = Math.min(clamp(kin * 1.6), 1 - clamp((kout - .4) / .6));
    root.style.filter = `blur(${(12 * (1 - kin) + 16 * kout).toFixed(1)}px)`;
    $("flash").style.opacity = flash.toFixed(2);
    renderText(t, light);
    renderCursor(lt, (s.clicks || []).map(c => ({ ...c, t: c.t - s.t0 })));
    $("grain").style.transform = `translate(${(Math.sin(t * 91) * 40) | 0}px, ${(Math.cos(t * 77) * 40) | 0}px)`;
  };
  document.fonts.ready.then(() => { window.renderAt(0); window.__ready = true; });
})();
