// Движок длинного ролика: сцены по таймлайну -> кадр в момент t (window.renderAt(t)).
// Детерминированно: всё, что видно в кадре, вычисляется из t и TL (никаких таймеров).
// TL = { duration, fps, scenes: [{ t0, t1, type, ...параметры, at: [времена появлений] }], tier: [[t, "D"], ...] }
(function () {
  const $ = (h) => { const d = document.createElement("div"); d.innerHTML = h.trim(); return d.firstElementChild; };
  const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  const ease = (x) => 1 - Math.pow(1 - clamp(x), 3);              // easeOutCubic
  const back = (x) => { x = clamp(x); const c = 1.70158; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
  const rub = (v) => (v < 0 ? "−" : "+") + Math.abs(Math.round(v)).toLocaleString("ru-RU").replace(/ /g, " ") + " ₽";
  const nb = (t) => String(t).replace(/ (?=₽|\d{3}\b)/g, " ");

  const LOGO = {
    alfa: '<img src="../assets/logos/alfa.svg">',
    otp: '<img src="../assets/logos/otp.svg">',
    tbank: '<img class="tb" src="../assets/logos/tbank.svg">',
    uralsib: '<img class="ic" src="../assets/logos/uralsib_icon.png"><span class="wm">УРАЛСИБ</span>',
  };
  const BANKC = { alfa: "#ef3124", otp: "#52ae30", tbank: "#ffdd2d", uralsib: "#7a3fc4" };
  const logo = (k) => `<div class="logo">${LOGO[k]}</div>`;

  // --- сцены: build(s) -> DOM; tick(el, s, lt) — обновить по локальному времени lt ---
  // s.at — абсолютные моменты появления элементов (по словам озвучки)
  const pop = (el, t, at, dur = .35) => {                         // появление элемента «с подскоком»
    const k = at == null ? 1 : back((t - at) / dur);
    el.style.opacity = at == null ? 1 : clamp((t - at) / .12);
    el.style.transform = `scale(${.6 + .4 * k})`;
  };
  const S = {};

  // крупный текст по словам; s.words: [{w, at, c}] c: g|r|plate
  S.words = {
    build: (s) => $(`<div class="sc sc-words ${s.size || ""}"><h1>${s.words.map(w =>
      `<span class="w ${w.c || ""}">${w.w}</span>`).join(" ")}</h1>${s.sub ? `<div class="sub">${s.sub}</div>` : ""}</div>`),
    tick: (el, s, t) => el.querySelectorAll(".w").forEach((e, i) => pop(e, t, s.words[i].at, .3)),
  };
  // заставка уровня
  S.tier = {
    build: (s) => $(`<div class="sc sc-tier" style="--c:var(--${s.tier})"><div class="L">${s.tier}</div><div class="sub">${s.title}</div></div>`),
    tick: (el, s, t) => {
      const L = el.querySelector(".L"), k = back((t - s.t0) / .45);
      L.style.transform = `scale(${1.6 - .6 * k})`; L.style.opacity = clamp((t - s.t0) / .15);
      const sub = el.querySelector(".sub"); sub.style.opacity = clamp((t - s.t0 - .35) / .25);
      sub.style.transform = `translateY(${30 * (1 - ease((t - s.t0 - .35) / .4))}px)`;
    },
  };
  // перебивка на чёрном
  S.inter = {
    build: (s) => $(`<div class="sc sc-inter"><h1>${s.text}</h1></div>`),
    tick: (el, s, t) => { const h = el.querySelector("h1"); h.style.transform = `scale(${1.25 - .25 * ease((t - s.t0) / .35)})`; h.style.opacity = clamp((t - s.t0) / .12); },
  };
  // доска тир-листа: s.items {D:[..]} ; s.cur — подсветка; s.blur; s.at — появление чипов по порядку s.order
  S.board = {
    build: (s) => $(`<div class="sc sc-board ${s.tilt ? "tilt" : ""} ${s.blur ? "blur" : ""}"><div class="board card">${"SABCD".split("").map(T =>
      `<div class="row ${s.cur ? (s.cur.includes(T) ? "cur" : "dim") : ""}" style="--c:var(--${T})"><div class="t">${T}</div><div class="chips">${
        (s.items[T] || []).map(c => c.startsWith("@") ? `<span class="chip lg">${logo(c.slice(1))}</span>` : `<span class="chip">${c}</span>`).join("")}</div></div>`).join("")}</div></div>`),
    tick: (el, s, t) => {
      const chips = [...el.querySelectorAll(".chip")];
      chips.forEach((c, i) => pop(c, t, s.at ? s.at[i] : null));
      el.querySelector(".board").style.setProperty("--z", 1 + .03 * clamp((t - s.t0) / (s.t1 - s.t0)));
    },
  };
  // список пунктов; текущий подсвечен
  S.list = {
    build: (s) => $(`<div class="sc sc-list" style="--c:var(--${s.color || "B"})">${s.title ? `<div class="ttl">${s.title}</div>` : ""}<div class="list">${s.items.map((x, i) =>
      `<div class="li"><span class="n">${s.icons ? `<span class="emo">${s.icons[i]}</span>` : i + 1}</span><span>${x}</span></div>`).join("")}</div></div>`),
    tick: (el, s, t) => {
      const li = [...el.querySelectorAll(".li")];
      let cur = -1; s.at.forEach((a, i) => { if (t >= a) cur = i; });
      li.forEach((e, i) => { pop(e, t, s.at[i]); e.classList.toggle("on", i === cur && !s.noHi); });
    },
  };
  // крупное число со счётчиком
  S.number = {
    build: (s) => $(`<div class="sc sc-number"><div class="num ${s.red ? "r" : ""}"></div><div class="cap">${s.cap || ""}</div>${s.fine ? `<div class="fine">${s.fine}</div>` : ""}</div>`),
    tick: (el, s, t) => {
      const k = ease((t - s.t0 - .1) / (s.count || .9));
      const v = s.from + (s.to - s.from) * k, v2 = s.to2 != null ? s.from + (s.to2 - s.from) * k : null;
      el.querySelector(".num").textContent = s.prefix ? s.prefix + Math.round(v).toLocaleString("ru-RU").replace(/ /g, " ") + (s.suffix || "") :
        v2 != null ? `${Math.round(v).toLocaleString("ru-RU").replace(/ /g, " ")} – ${Math.round(v2).toLocaleString("ru-RU").replace(/ /g, " ")} ₽` : rub(v);
      const c = el.querySelector(".cap"); c.style.opacity = clamp((t - (s.capAt || s.t0 + .6)) / .2);
    },
  };
  // карточки (категории кэшбэка и т. п.): s.cards [{e, name, p, bad}]
  S.cards = {
    build: (s) => $(`<div class="sc sc-cards"><div class="grid2">${s.cards.map(c =>
      `<div class="cat ${c.bad ? "bad" : ""}"><span class="emo">${c.e}</span><span class="nm">${c.name}</span>${c.p ? `<span class="p">${c.p}</span>` : ""}</div>`).join("")}</div>${s.plate ? `<div class="plate">${s.plate}</div>` : ""}</div>`),
    tick: (el, s, t) => {
      el.querySelectorAll(".cat").forEach((e, i) => pop(e, t, s.at[i]));
      const p = el.querySelector(".plate"); if (p) pop(p, t, s.plateAt);
    },
  };
  // иконка + фраза (универсальная «смысловая» сцена)
  S.icon = {
    build: (s) => $(`<div class="sc sc-icon ${s.tone || ""}"><div class="emo ic">${s.icon}</div><div class="txt"><h2>${s.text}</h2>${s.sub ? `<div class="sub">${s.sub}</div>` : ""}</div></div>`),
    tick: (el, s, t) => {
      const ic = el.querySelector(".ic"); ic.style.transform = `scale(${.5 + .5 * back((t - s.t0) / .4)}) rotate(${-8 + 8 * ease((t - s.t0) / .5)}deg)`;
      ic.style.opacity = clamp((t - s.t0) / .12);
      const tx = el.querySelector(".txt"); tx.style.opacity = clamp((t - s.t0 - .15) / .2); tx.style.transform = `translateX(${40 * (1 - ease((t - s.t0 - .15) / .35))}px)`;
      const sub = el.querySelector(".sub"); if (sub && s.subAt) sub.style.opacity = clamp((t - s.subAt) / .2);
      el.querySelector("h2").style.setProperty("--hl", ease((t - s.t0 - .35) / .45));
    },
  };
  // сравнение 50/50
  S.split = {
    build: (s) => $(`<div class="sc sc-split"><div class="half l"><div class="emo">${s.l.e}</div><h2>${s.l.t}</h2><div class="sub">${s.l.s || ""}</div></div>
      <div class="vs">VS</div><div class="half r"><div class="emo">${s.r.e}</div><h2>${s.r.t}</h2><div class="sub">${s.r.s || ""}</div></div></div>`),
    tick: (el, s, t) => { pop(el.querySelector(".l"), t, s.at[0], .4); pop(el.querySelector(".r"), t, s.at[1], .4); pop(el.querySelector(".vs"), t, s.at[1] - .1); },
  };
  // телефон с правилами акции и подсветкой
  S.phone = {
    build: (s) => $(`<div class="sc sc-phone"><div class="side"><h2>${s.text}</h2>${s.sub ? `<div class="sub">${s.sub}</div>` : ""}</div><div class="phone"><h3>${s.head || "Правила акции"}</h3>
      ${s.lines.map((l, i) => l === "-" ? `<div class="ln" style="width:${[92, 70, 85, 60, 78, 95, 66][i % 7]}%"></div>` : `<div class="hl">${l}</div>`).join("")}</div></div>`),
    tick: (el, s, t) => { el.querySelectorAll(".hl").forEach((e, i) => pop(e, t, s.at ? s.at[i] : s.t0 + .4)); },
  };
  // штамп-предупреждение
  S.warn = {
    build: (s) => $(`<div class="sc sc-warn"><h1>${s.text}</h1>${s.stamp ? `<div class="stamp">${s.stamp}</div>` : ""}${s.fine ? `<div class="fine">${s.fine}</div>` : ""}</div>`),
    tick: (el, s, t) => {
      const st = el.querySelector(".stamp"); if (st) { const k = back((t - s.stampAt) / .3); st.style.opacity = clamp((t - s.stampAt) / .08); st.style.transform = `rotate(-6deg) scale(${2.2 - 1.2 * k})`; }
      el.querySelector("h1").style.opacity = clamp((t - s.t0) / .15);
    },
  };
  // карточка одного предложения банка
  S.offer = {
    build: (s) => $(`<div class="sc sc-offer"><div class="offer card" style="--bc:${BANKC[s.bank]}"><div class="logo">${LOGO[s.bank]}</div><div class="amt">${nb(rub(s.v))}</div>
      <div class="prod">${s.kind} карта <i class="k">18+</i></div><ul>${s.cond.map(c => `<li>${nb(c)}</li>`).join("")}</ul>
      <div class="legal"><b>Реклама.</b> ${s.legal || "[наименование банка, ИНН] · erid: [из партнёрского кабинета]" + (s.kind === "Кредитная" ? " · [ПСК]" : "")} · Условия на 07.10.2026</div></div></div>`),
    tick: (el, s, t) => {
      const c = el.querySelector(".offer"), k = back((t - s.t0) / .45);
      c.style.transform = `translateY(${120 * (1 - k)}px) rotate(${-3 * (1 - k)}deg)`; c.style.opacity = clamp((t - s.t0) / .15);
      el.querySelectorAll("li").forEach((e, i) => pop(e, t, s.at ? s.at[i] : s.t0 + .5 + i * .3));
    },
  };
  // итоговый подсчёт «только телефон»
  S.calc = {
    build: (s) => $(`<div class="sc sc-calc"><div class="who"><div class="emo">📱</div><div class="plate">Только телефон · 18+</div></div><div class="stack">${s.rows.map(r =>
      `<div class="bonus"><div class="logo">${LOGO[r.bank]}</div><i class="k ${r.kind === "кредитная" ? "cr" : ""}">${r.kind}</i><span class="v">${nb(rub(r.v))}</span></div>`).join("")}
      <div class="total"><span>Итого сейчас</span><b></b></div><div class="warnl">⚠ Кредитка = долг: верни в льготный период</div></div></div>`),
    tick: (el, s, t) => {
      const rows = [...el.querySelectorAll(".bonus")];
      let sum = 0;
      rows.forEach((e, i) => { const a = s.at[i]; pop(e, t, a); if (t >= a) sum += s.rows[i].v * ease((t - a) / .5); });
      const tot = el.querySelector(".total"); pop(tot, t, s.totalAt);
      tot.querySelector("b").textContent = nb(rub(t >= s.totalAt ? s.rows.reduce((a, r) => a + r.v, 0) : sum));
      const w = el.querySelector(".warnl"); w.style.opacity = s.warnAt != null ? clamp((t - s.warnAt) / .25) : 0;
    },
  };
  // CTA Telegram
  S.cta = {
    build: (s) => $(`<div class="sc sc-cta"><div class="tg card"><div class="hd"><div class="av">₽</div><div><div class="nm">Бонусы банков</div><div class="sb">Telegram-канал</div></div></div>
      ${s.msgs.map(m => `<div class="msg">${m}</div>`).join("")}</div><div class="right"><h1>${s.text}</h1><div class="sub">ссылка в описании <span class="arrow">↓</span></div></div></div>`),
    tick: (el, s, t) => {
      el.querySelectorAll(".msg").forEach((e, i) => pop(e, t, s.t0 + .3 + i * .5));
      el.querySelector(".arrow").style.transform = `translateY(${10 * Math.sin((t - s.t0) * 6)}px)`;
    },
  };
  // итог из 3 пунктов (переиспользует list)
  S.recap = S.list;

  // --- кадр (v2: камера, переходы, субтитры, стикеры, частицы, тряска, зерно, прогресс) ---
  // Приёмы удержания — .claude/skills/retention-editing/SKILL.md
  const $id = (id) => document.getElementById(id);
  const hash = (n) => { n = (n ^ 61) ^ (n >>> 16); n = (n + (n << 3)) | 0; n ^= n >>> 4; n = Math.imul(n, 0x27d4eb2d); n ^= n >>> 15; return (n >>> 0) / 4294967296; };
  const last = (arr, t) => { let r = null; for (const x of arr || []) { if (x.t <= t) r = x; else break; } return r; };
  let curScene = null, curEl = null, curCap = null;

  // камера: TL.cam — [{t, s, x, y, r}] (снап за 0.14 с) + микродрейф + тряска TL.shake
  function camera(t, TL) {
    const cams = TL.cam || [];
    let i = -1; for (let k = 0; k < cams.length && cams[k].t <= t; k++) i = k;
    const B = { s: 1, x: 0, y: 0, r: 0 }, cur = i >= 0 ? cams[i] : B, prev = i > 0 ? cams[i - 1] : B;
    const k = i >= 0 ? ease((t - cur.t) / (cur.slow ? .9 : .14)) : 1;
    const mix = (a, b) => a + (b - a) * k;
    let s = mix(prev.s, cur.s), x = mix(prev.x, cur.x), y = mix(prev.y, cur.y), r = mix(prev.r, cur.r);
    s *= 1 + .012 * Math.sin(t * .7); x += 6 * Math.sin(t * .53); y += 4 * Math.sin(t * .41 + 1);
    for (const st of TL.shake || []) {
      const d = t - st; if (d < 0 || d > .45) continue;
      const a = (st.a || 16) * Math.exp(-d * 9);
      x += a * Math.sin(d * 70); y += a * .7 * Math.cos(d * 55); r += a * .03 * Math.sin(d * 60);
    }
    return { s, x, y, r };
  }

  // переход входа сцены (первые 0.28 с) и выхода (последние 0.12 с)
  function transition(s, t) {
    const lt = t - s.t0, rest = s.t1 - t, dir = s.dir || 1;
    const kin = clamp(lt / .28), kout = clamp(1 - rest / .12);
    let tf = "", flt = "", op = 1;
    switch (s.tr) {
      case "whip": { const e = 1 - ease(kin); tf = `translateX(${dir * 1400 * e}px)`; if (e > .01) flt = `blur(${30 * e}px)`; break; }
      case "slide": { const e = 1 - ease(kin); tf = `translateY(${dir * 500 * e}px)`; if (e > .01) flt = `blur(${12 * e}px)`; break; }
      case "glitch": {
        if (lt < .26) { const q = Math.floor(lt * 30), j = hash(q + Math.floor(s.t0 * 7)); tf = `translateX(${(j - .5) * 80}px) skewX(${(hash(q * 3) - .5) * 14}deg)`;
          flt = `drop-shadow(${10 + j * 14}px 0 0 rgba(255,0,60,.8)) drop-shadow(-${10 + j * 14}px 0 0 rgba(0,240,255,.8))`; }
        break; }
      case "blur": { const e = 1 - ease(kin); tf = `scale(${1 + .15 * e})`; if (e > .01) flt = `blur(${22 * e}px) brightness(${1 + e})`; break; }
      case "zoom": default: { const e = 1 - ease(kin); tf = `scale(${1 + .5 * e})`; if (e > .01) flt = `blur(${14 * e}px)`; op = clamp(lt / .1); }
    }
    if (kout > 0) { tf += ` scale(${1 - .06 * kout})`; flt = (flt ? flt + " " : "") + `blur(${10 * kout}px)`; op *= 1 - .5 * kout; }
    return { tf, flt, op };
  }

  function captions(t, TL) {
    const cap = $id("cap"); if (!cap) return;
    const c = (TL.caps || []).find(x => t >= x.t0 && t < x.t1);
    if (c !== curCap) {
      cap.innerHTML = c ? `<div class="cl">${c.words.map(w => `<span class="cw">${w.w}</span>`).join(" ")}</div>` : "";
      curCap = c;
    }
    if (!c) return;
    const line = cap.firstElementChild, k = back((t - c.t0) / .22);
    line.style.transform = `scale(${.85 + .15 * k})`; line.style.opacity = clamp((t - c.t0) / .06);
    cap.querySelectorAll(".cw").forEach((e, i) => {
      const w = c.words[i], on = t >= w.a && (i === c.words.length - 1 || t < c.words[i + 1].a);
      e.classList.toggle("on", on); e.classList.toggle("done", t >= w.a);
    });
  }

  // стикеры-реакции: TL.stickers [{t, e, x, y, r}] — живут 1.5 с
  function stickers(t, TL) {
    const fx = $id("fx"); if (!fx) return;
    let h = "";
    for (const st of TL.stickers || []) {
      const d = t - st.t; if (d < 0 || d > 1.5) continue;
      const k = back(d / .3), out = clamp((d - 1.2) / .3), fl = Math.sin(d * 5) * 6;
      h += `<div class="stk emo" style="left:${st.x}px;top:${st.y}px;opacity:${1 - out};transform:translate(-50%,-50%) translateY(${fl - 40 * out}px) rotate(${st.r + 6 * Math.sin(d * 4)}deg) scale(${(.2 + .8 * k) * (st.s || 1)})">${st.e}</div>`;
    }
    // частицы: TL.bursts [{t, e, x, y}] — 16 штук по баллистике, детерминированно
    for (const b of TL.bursts || []) {
      const d = t - b.t; if (d < 0 || d > 1.6) continue;
      for (let i = 0; i < 16; i++) {
        const a = hash(i * 13 + Math.floor(b.t * 10)) * Math.PI * 2, v = 600 + 700 * hash(i * 7 + 3);
        const px = b.x + Math.cos(a) * v * d, py = b.y + Math.sin(a) * v * d * .8 + 900 * d * d;
        h += `<div class="ptc emo" style="left:${px}px;top:${py}px;opacity:${1 - clamp((d - 1) / .6)};transform:translate(-50%,-50%) rotate(${d * 400 * (hash(i) - .5)}deg) scale(${.6 + .6 * hash(i * 5)})">${b.e}</div>`;
      }
    }
    fx.innerHTML = h;
  }

  window.renderAt = (t) => {
    const TL = window.TL;
    const s = TL.scenes.find(x => t >= x.t0 && t < x.t1) || TL.scenes[TL.scenes.length - 1];
    if (s !== curScene) {
      $id("stage").innerHTML = ""; curEl = S[s.type].build(s); $id("stage").appendChild(curEl); curScene = s;
      document.body.classList.toggle("black", !!s.black);
    }
    S[s.type].tick(curEl, s, t);
    const tr = transition(s, t);
    curEl.style.transform = `scale(${1 + .02 * clamp((t - s.t0) / (s.t1 - s.t0))}) ${tr.tf}`;
    curEl.style.filter = tr.flt || "none";
    curEl.style.opacity = tr.op;
    const c = camera(t, TL);
    $id("cam").style.transform = `translate(${c.x}px, ${c.y}px) rotate(${c.r}deg) scale(${c.s})`;
    // фон: сетка едет (параллакс к камере), оттенок уровня
    const g = document.querySelector(".grid");
    g.style.backgroundPosition = `${-c.x * .3}px ${(t * 60) % 120}px`;
    const tint = last(TL.tint, t); document.body.style.setProperty("--tint", tint ? tint.c : "#7a5cff");
    // вспышка: белая на переходах flash и на TL.flash
    let fl = 0;
    if (s.tr === "flash") fl = Math.max(fl, .85 * (1 - clamp((t - s.t0) / .2)));
    for (const f of TL.flash || []) { const d = t - f; if (d >= 0 && d < .2) fl = Math.max(fl, .7 * (1 - d / .2)); }
    $id("flash").style.opacity = fl;
    // зерно: сдвиг текстуры по кадру
    const fr = Math.floor(t * 30); $id("grain").style.backgroundPosition = `${Math.floor(hash(fr) * 200)}px ${Math.floor(hash(fr + 7) * 200)}px`;
    captions(t, TL); stickers(t, TL);
    // прогресс ролика с отметками глав
    const p = $id("prog"); if (p) { p.firstElementChild.style.transform = `scaleX(${clamp(t / TL.duration)})`; }
    let tier = null; (TL.tier || []).forEach(([a, T]) => { if (t >= a) tier = T; });
    $id("tierbar").innerHTML = tier ? "DCBAS".split("").map(T => `<b class="${T === tier ? "on" : ""}" style="--c:var(--${T})">${T}</b>`).join("") : "";
  };
  window.addEventListener("DOMContentLoaded", () => {
    const p = $id("prog"); if (p && window.TL) p.innerHTML = `<i></i>` + (window.TL.chapters || []).map(x => `<b style="left:${x / window.TL.duration * 100}%"></b>`).join("");
  });
})();
