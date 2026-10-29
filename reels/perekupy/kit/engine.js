// «Перехват»-движок: сцена 1080×1920 на GSAP, детерминированная перемотка seek(t) для покадрового рендера.
// Вариант рилса подключает этот файл и объявляет window.build(R) — там строит таймлайн R.tl.
(function () {
  const R = (window.R = {});
  R.W = 1080; R.H = 1920; R.FPS = 30;
  R.tl = gsap.timeline({ paused: true });
  R.hooks = [];                       // функции (t) => void, вызываются на каждом кадре после tl.seek
  R.events = [];                     // звук: {type, at, gain}
  R.sfx = (type, at, gain = 1) => { R.events.push({ type, at: +at.toFixed(3), gain }); };
  R.$ = s => document.querySelector(s);
  R.$$ = s => [...document.querySelectorAll(s)];
  R.clamp = x => Math.max(0, Math.min(1, x));
  R.lerp = (a, b, x) => a + (b - a) * x;

  // ---- слова озвучки: R.w("приора") → время начала слова (n — номер вхождения)
  const norm = s => s.toLowerCase().replace(/ё/g, "е").replace(/[^а-я0-9]/g, "");
  R.words = window.WORDS || [];
  R.w = (pre, n = 0, end = false) => {
    const hits = R.words.filter(x => norm(x.w).startsWith(norm(pre)));
    if (!hits[n]) throw new Error(`нет слова «${pre}» #${n}`);
    return end ? hits[n].t1 : hits[n].t0;
  };
  R.dur = window.DURATION || 20;

  // ---- детерминированный шум
  R.hash = (a, b = 0) => { let n = (a * 374761393 + b * 668265263) | 0; n = Math.imul(n ^ (n >>> 13), 1274126177); return ((n ^ (n >>> 16)) >>> 0) / 4294967296; };
  R.noise = t => { const i = Math.floor(t), f = t - i, s = f * f * (3 - 2 * f); return R.lerp(R.hash(i, 7), R.hash(i + 1, 7), s) * 2 - 1; };

  // ---- камера: «живая» рука оператора + управляемые наезды. cam — элемент-обёртка сцены
  R.camera = (el, opt = {}) => {
    const st = { x: 0, y: 0, s: 1, r: 0, shake: 0, hand: opt.hand ?? 1 };
    R.hooks.push(t => {
      const h = st.hand, k = st.shake;
      const hx = (R.noise(t * .6) * 10 + R.noise(t * 1.7 + 40) * 3) * h + (R.hash(Math.floor(t * 60), 1) - .5) * 26 * k;
      const hy = (R.noise(t * .5 + 9) * 12 + R.noise(t * 1.9 + 70) * 3) * h + (R.hash(Math.floor(t * 60), 2) - .5) * 26 * k;
      const hr = R.noise(t * .4 + 20) * .35 * h + (R.hash(Math.floor(t * 60), 3) - .5) * 1.2 * k;
      el.style.transform = `translate(${st.x + hx}px, ${st.y + hy}px) rotate(${st.r + hr}deg) scale(${st.s})`;
    });
    return st;
  };
  // наезд-панч: +amp за 4 кадра, назад за ~10
  R.punch = (cam, at, amp = .1) => {
    R.tl.to(cam, { s: `+=${amp}`, duration: .13, ease: "power3.out" }, at)
        .to(cam, { s: `-=${amp}`, duration: .4, ease: "power2.inOut" }, at + .13);
  };
  R.shake = (cam, at, amp = 1, dur = .3) => {
    R.tl.fromTo(cam, { shake: amp }, { shake: 0, duration: dur, ease: "power2.out", immediateRender: false }, at);
  };

  // ---- вспышка и плёнка
  R.flash = (at, a = .85, dur = .2) => {
    const f = R.$("#fx-flash"); R.sfx("hit", at, a);
    R.tl.fromTo(f, { opacity: a }, { opacity: 0, duration: dur, ease: "power2.out", immediateRender: false }, at);
  };
  R.grain = (amount = .07) => {
    const c = R.$("#fx-grain"), g = c.getContext("2d"), w = 270, h = 480;
    c.width = w; c.height = h;
    const img = g.createImageData(w, h);
    R.hooks.push(t => {
      const fr = Math.floor(t * 30);
      for (let i = 0; i < w * h; i++) { const v = R.hash(i, fr) * 255; img.data[i * 4] = img.data[i * 4 + 1] = img.data[i * 4 + 2] = v; img.data[i * 4 + 3] = 255; }
      g.putImageData(img, 0, 0);
      c.style.opacity = amount;
    });
  };

  // ---- RGB-расслоение на элементе (для ударов): drop-shadow красный/бирюзовый
  R.rgb = (el, at, px = 14, dur = .25) => {
    const o = { v: 0 }; R.sfx("glitch", at, px / 20);
    R.tl.fromTo(o, { v: px }, { v: 0, duration: dur, ease: "power2.out", immediateRender: false,
      onUpdate: () => { el.style.filter = o.v > .3 ? `drop-shadow(${o.v}px 0 0 rgba(255,40,80,.85)) drop-shadow(${-o.v}px 0 0 rgba(0,230,255,.85))` : ""; } }, at);
  };

  // ---- слово-удар: влетает из крупного с размытием, дрожь
  R.slam = (el, at, opt = {}) => {
    const from = opt.from ?? 2.2; if (at > .05) R.sfx("impact", at + .04, opt.from >= 2 ? 1 : .7);
    R.tl.fromTo(el, { scale: from, opacity: 0, filter: "blur(18px)" },
      { scale: 1, opacity: 1, filter: "blur(0px)", duration: opt.dur ?? .22, ease: "power4.out", immediateRender: false }, at);
    if (opt.rot != null) R.tl.set(el, { rotation: opt.rot }, at);
  };
  // подъём со смазом
  R.rise = (el, at, opt = {}) => {
    R.sfx("swish", at, .6);
    R.tl.fromTo(el, { y: opt.dy ?? 60, opacity: 0, filter: "blur(10px)" },
      { y: 0, opacity: 1, filter: "blur(0px)", duration: opt.dur ?? .35, ease: "power3.out", immediateRender: false }, at);
  };
  R.out = (el, at, opt = {}) => {
    R.tl.to(el, { opacity: 0, y: opt.dy ?? -40, filter: "blur(10px)", duration: opt.dur ?? .2, ease: "power2.in" }, at);
  };
  // счётчик чисел: «125 000»
  R.fmt = n => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  R.count = (el, at, from, to, dur = .7, suffix = "") => {
    const o = { v: from };
    R.tl.fromTo(o, { v: from }, { v: to, duration: dur, ease: "power2.out", immediateRender: false,
      onUpdate: () => { el.textContent = R.fmt(o.v) + suffix; } }, at);
  };
  // «барабан» цифр: прокрутка случайных сумм и остановка на нужной
  R.slot = (el, at, to, dur = 1.2, suffix = "") => {
    for (let k = 0; k < 14; k++) R.sfx("tick", at + dur * (1 - Math.pow(1 - k / 14, 1.6)), .7);
    const o = { p: 0 };
    R.tl.fromTo(o, { p: 0 }, { p: 1, duration: dur, ease: "power2.out", immediateRender: false,
      onUpdate: () => {
        if (o.p >= 1) { el.textContent = R.fmt(to) + suffix; return; }
        const step = Math.floor(o.p * 28);
        el.textContent = R.fmt(Math.round((50 + R.hash(step, 99) * 450) * 1000 / 1000) * 1000) + suffix;
      } }, at);
  };

  // ---- кадр готов к рендеру
  window.seek = t => { R.tl.seek(t, false); R.hooks.forEach(h => h(t)); };
  window.addEventListener("DOMContentLoaded", () => {
    for (const id of ["fx-grain", "fx-flash", "fx-vignette"]) if (!R.$("#" + id)) {
      const el = document.createElement(id === "fx-grain" ? "canvas" : "div"); el.id = id; document.body.appendChild(el);
    }
    window.build(R);
    R.tl.set({}, {}, R.dur);   // таймлайн не короче ролика
    window.READY = true;
  });
})();
