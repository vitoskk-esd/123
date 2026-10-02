// Общая анимационная обвязка для видео.
// Страница задаёт window.DEFAULT_STARTS (начала сцен, сек), window.DEFAULT_DURATION и функцию draw(t, S, D).
// render-video.js подменяет тайминги под длину озвучки через window.setTimeline().
const $ = (id) => document.getElementById(id);
const clamp = (x) => Math.max(0, Math.min(1, x));
const ease = (x) => 1 - Math.pow(1 - clamp(x), 3);
const back = (x) => { x = clamp(x); const c = 1.7; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };

// Появление в [a, a+0.45], исчезновение в [b-0.3, b]
function show(el, t, a, b, dy = 60, pop = false) {
  const i = (t - a) / 0.45, o = (b - t) / 0.3;
  const k = Math.min(clamp(i), clamp(o));
  const s = pop ? 0.6 + 0.4 * back(i) : 1;
  el.style.opacity = k;
  el.style.transform = `translateY(${(1 - ease(i)) * dy - (1 - clamp(o)) * 40}px) scale(${s})`;
}

const TL = {};
window.setTimeline = function (starts, duration) {
  TL.S = starts;
  TL.D = duration;
  window.DURATION = duration;
  window.render(0);
};
window.render = function (t) {
  const bar = $("bar");
  if (bar) bar.style.width = (t / TL.D) * 100 + "%";
  draw(t, TL.S, TL.D);
};
window.addEventListener("load", () => window.setTimeline(window.DEFAULT_STARTS, window.DEFAULT_DURATION));
