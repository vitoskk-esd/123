// Стиль «Тетрадь Никиты» (17.11, владелец: «не 1в1 как у референса, добавь нового, главный герой — парень с моих фото»).
// Отличия от референса: светлая тетрадь в клетку вместо тёмного холста; камера едет по тетради от «станции» к «станции»;
// всё — наклейки с белой высечкой и скотчем; цифры и стрелки написаны маркером от руки (Caveat); штампы;
// пуш-уведомления «Зачисление +… ₽» сверху; ведущий — Никита (как на фото владельца) в углу кадра, говорит от первого лица.
// Использует buildTimeline/IC/ease/cl/fmt/arrowSVG из engine.js.
const THM = (typeof window !== "undefined" && window.THEME) || {};
const INK = THM.ink || "#1d3fbf", RED = THM.red || "#e2412f", GRN = THM.grn || "#1f9a4a", PEN = THM.pen || "#1b1b1b";

// ---------- Никита: по фото владельца — пышные каштановые кудри, вытянутое лицо, голубые глаза, длинный прямой нос,
// широкая улыбка; голубой вязаный свитер на молнии со стойкой, белая футболка. Бюст (низ обрезан краем кадра), viewBox 400×560.
CH.nikita = (o = {}) => {
  const hr = "#8a5528", hl = "#b47a3e", sk = "#f3cdb0", sd = "#dcae8c", sw = "#9cc3dc", swd = "#7ea6c2", pose = o.pose || "idle";
  const curls = [[96, 250, 40], [88, 196, 42], [104, 142, 44], [140, 100, 46], [190, 78, 48], [244, 82, 46], [290, 108, 46], [318, 156, 42], [322, 210, 40], [314, 256, 38], [70, 230, 30], [336, 236, 30], [216, 62, 36], [160, 70, 34]];
  const cloud = curls.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${hr}" stroke="${PEN}" stroke-width="7"/>`).join("") + curls.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r - 3.5}" fill="${hr}"/>`).join("");
  const swirl = [[120, 130], [180, 92], [250, 96], [300, 150], [100, 210], [316, 216], [96, 262]].map(([x, y]) => `<path d="M${x - 14} ${y + 6} q4 -18 20 -14 q12 4 6 16" fill="none" stroke="${hl}" stroke-width="6" stroke-linecap="round"/>`).join("");
  const fringe = [[150, 150, 30], [190, 136, 32], [234, 140, 30], [270, 160, 26], [126, 172, 22]];
  const fr = fringe.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${hr}" stroke="${PEN}" stroke-width="7"/>`).join("") + fringe.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r - 3.5}" fill="${hr}"/>`).join("") +
    `<path d="M170 140 q10 -14 24 -8 M222 142 q10 -12 22 -4" fill="none" stroke="${hl}" stroke-width="6" stroke-linecap="round"/>`;
  const armR = { // рука справа (со стороны зрителя)
    idle: "",
    point: `<path d="M300 430 q60 -40 70 -150 l40 6 q-4 140 -84 196 z" fill="${sw}" stroke="${PEN}" stroke-width="7" stroke-linejoin="round"/>
      <g transform="translate(392 262)"><circle r="24" fill="${sk}" stroke="${PEN}" stroke-width="6"/><rect x="-8" y="-62" width="16" height="48" rx="8" fill="${sk}" stroke="${PEN}" stroke-width="6"/><circle r="20" fill="${sk}"/></g>`,
    phone: `<path d="M300 440 q30 40 -10 70 l-50 -10" fill="none" stroke="${PEN}" stroke-width="7"/>
      <g transform="translate(250 452) rotate(-8)"><rect x="-38" y="-70" width="76" height="132" rx="14" fill="#222" stroke="${PEN}" stroke-width="6"/><rect x="-30" y="-60" width="60" height="104" rx="6" fill="#5fb7e8"/><circle cx="0" cy="-30" r="12" fill="#fff" opacity=".8"/></g>
      <circle cx="268" cy="500" r="22" fill="${sk}" stroke="${PEN}" stroke-width="6"/>`,
    shrug: `<path d="M308 430 q50 -10 66 -70 l34 14 q-16 80 -92 100 z" fill="${sw}" stroke="${PEN}" stroke-width="7" stroke-linejoin="round"/><circle cx="392" cy="352" r="24" fill="${sk}" stroke="${PEN}" stroke-width="6"/>`,
  }[pose] || "";
  const armL = pose === "shrug" ? `<path d="M92 430 q-50 -10 -66 -70 l-34 14 q16 80 92 100 z" fill="${sw}" stroke="${PEN}" stroke-width="7" stroke-linejoin="round"/><circle cx="8" cy="352" r="24" fill="${sk}" stroke="${PEN}" stroke-width="6"/>`
    : "";
  const mouths = `<g class="m-grin"><path d="M146 316 q54 58 108 0 q-54 12 -108 0 z" fill="#7a2a2a" stroke="${PEN}" stroke-width="6" stroke-linejoin="round"/><path d="M152 318 q48 9 96 0 l-5 12 q-43 8 -86 0 z" fill="#fff"/></g>
    <g class="m-open" style="display:none"><path d="M160 314 q40 66 80 0 q-40 8 -80 0 z" fill="#7a2a2a" stroke="${PEN}" stroke-width="6" stroke-linejoin="round"/><path d="M164 316 q36 7 72 0 l-4 10 q-32 6 -64 0 z" fill="#fff"/><ellipse cx="200" cy="344" rx="16" ry="7" fill="#d9706a"/></g>
    <g class="m-mid" style="display:none"><path d="M156 316 q44 38 88 0 q-44 8 -88 0 z" fill="#7a2a2a" stroke="${PEN}" stroke-width="6" stroke-linejoin="round"/><path d="M160 318 q40 7 80 0 l-4 9 q-36 6 -72 0 z" fill="#fff"/></g>`;
  return `<svg viewBox="-20 0 440 560" width="${o.w || 460}">
    ${cloud}${swirl}
    <path d="M60 560 q0 -150 140 -170 q140 20 140 170 z" fill="${sw}" stroke="${PEN}" stroke-width="7" stroke-linejoin="round"/>
    ${[110, 135, 160, 240, 265, 290].map(x => `<path d="M${x} ${x < 200 ? 420 + (160 - x) * .3 : 420 + (x - 240) * .3} v140" stroke="${swd}" stroke-width="5" opacity=".8"/>`).join("")}
    ${armL}${armR.includes("idle") ? "" : ""}
    <rect x="176" y="330" width="48" height="62" fill="${sk}" stroke="${PEN}" stroke-width="6"/>
    <path d="M184 392 h32 v20 h-32 z" fill="#f4f4f4" stroke="${PEN}" stroke-width="5"/>
    <path d="M150 384 q50 -22 100 0 l-6 40 q-44 -14 -88 0 z" fill="${swd}" stroke="${PEN}" stroke-width="7" stroke-linejoin="round"/>
    <path d="M200 388 v172" stroke="#e6ebef" stroke-width="6"/><rect x="192" y="420" width="16" height="26" rx="4" fill="#e6ebef" stroke="${PEN}" stroke-width="4"/>
    <ellipse cx="108" cy="236" rx="20" ry="28" fill="${sk}" stroke="${PEN}" stroke-width="6"/><ellipse cx="292" cy="236" rx="20" ry="28" fill="${sk}" stroke="${PEN}" stroke-width="6"/>
    <path d="M118 200 q0 -96 82 -96 q82 0 82 96 q0 92 -26 128 q-24 32 -56 32 q-32 0 -56 -32 q-26 -36 -26 -128 z" fill="${sk}" stroke="${PEN}" stroke-width="7"/>
    ${fr}
    <path d="M144 206 q22 -12 44 -2 M212 204 q22 -10 44 2" fill="none" stroke="#5a3418" stroke-width="9" stroke-linecap="round"/>
    <g class="blink" style="transform-origin:200px 236px">
      <ellipse cx="166" cy="236" rx="22" ry="17" fill="#fff" stroke="${PEN}" stroke-width="6"/><ellipse cx="234" cy="236" rx="22" ry="17" fill="#fff" stroke="${PEN}" stroke-width="6"/>
      <circle cx="${168 + (o.look || 0)}" cy="237" r="11" fill="#5f93c4"/><circle cx="${232 + (o.look || 0)}" cy="237" r="11" fill="#5f93c4"/>
      <circle cx="${168 + (o.look || 0)}" cy="237" r="5.5" fill="${PEN}"/><circle cx="${232 + (o.look || 0)}" cy="237" r="5.5" fill="${PEN}"/>
      <circle cx="${172 + (o.look || 0)}" cy="233" r="3" fill="#fff"/><circle cx="${236 + (o.look || 0)}" cy="233" r="3" fill="#fff"/></g>
    <path d="M204 230 q-10 44 -12 62 q8 10 24 2" fill="${sd}" stroke="${PEN}" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/>
    <circle cx="140" cy="290" r="12" fill="#f0a49a" opacity=".45"/><circle cx="262" cy="290" r="12" fill="#f0a49a" opacity=".45"/>
    ${mouths}
    ${pose === "idle" ? "" : armR}${pose === "idle" ? armR : ""}
  </svg>`;
};

// маленький человечек-наклейка (клиенты, трафик): цвет худи и волос
CH.person = (o = {}) => {
  const c = o.c || "#f08a2c", h = o.h || "#2b211d", sk = o.sk || "#f5d0b0";
  return `<svg viewBox="0 0 120 170" width="${o.w || 110}">
    <path d="M14 170 q0 -64 46 -66 q46 2 46 66 z" fill="${c}" stroke="${PEN}" stroke-width="5"/>
    <circle cx="60" cy="62" r="40" fill="${sk}" stroke="${PEN}" stroke-width="5"/>
    <path d="M20 58 q2 -42 40 -42 q38 0 40 42 q-18 -18 -40 -16 q-24 -2 -40 16 z" fill="${h}" stroke="${PEN}" stroke-width="5" stroke-linejoin="round"/>
    <circle cx="46" cy="66" r="5" fill="${PEN}"/><circle cx="74" cy="66" r="5" fill="${PEN}"/>
    <path d="M48 84 q12 10 24 0" fill="none" stroke="${PEN}" stroke-width="5" stroke-linecap="round"/></svg>`;
};

// ---------- помощники для эпизодов ----------
const hand = (t, px, c = INK, extra = "") => `<div class="hand" style="font-size:${px}px;color:${c};${extra}">${t}</div>`;
const handCnt = (px, c = GRN, pre = "", post = "") => `<div class="hand" style="font-size:${px}px;color:${c}">${pre}<span class="num">0</span>${post}</div>`;
const stamp = (t, c = RED, px = 56) => `<div class="stamp" style="color:${c};border-color:${c};font-size:${px}px">${t}</div>`;
const note = (inner, w = 560, bg = "#fff") => `<div class="note" style="width:${w}px;background:${bg}">${inner}</div>`;
const notif = (title, text) => `<div class="notif"><div class="ap">₽</div><div style="flex:1"><div class="nt"><b>${title}</b><span>сейчас</span></div><div class="nx">${text}</div></div></div>`;
// рукописная стрелка (маркер, лёгкая «дрожь»): экранные координаты станции
function inkArrow(x1, y1, x2, y2, bend = 0, c = INK, w = 7) {
  const mx = (x1 + x2) / 2 - (y2 - y1) * bend, my = (y1 + y2) / 2 + (x2 - x1) * bend;
  const ang = Math.atan2(y2 - my, x2 - mx), L = 34;
  const h1 = [x2 - L * Math.cos(ang - .55), y2 - L * Math.sin(ang - .55)], h2 = [x2 - L * Math.cos(ang + .45), y2 - L * Math.sin(ang + .45)];
  return `<svg width="1080" height="1920" viewBox="0 0 1080 1920" style="position:absolute;left:0;top:0;overflow:visible">
  <path class="dr" d="M${x1} ${y1} Q${mx + 6} ${my - 4} ${x2} ${y2}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>
  <path class="hd" d="M${h1[0]} ${h1[1]} L${x2} ${y2} L${h2[0]} ${h2[1]}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}
// обводка маркером (эллипс от руки) и подчёркивание
const inkCircle = (cx, cy, rx, ry, c = RED) => `<svg width="1080" height="1920" viewBox="0 0 1080 1920" style="position:absolute;left:0;top:0;overflow:visible"><path class="dr" d="M${cx + rx * .9} ${cy - ry * .7} C${cx + rx * 1.15} ${cy + ry * .9} ${cx - rx * 1.1} ${cy + ry * 1.15} ${cx - rx} ${cy} C${cx - rx * .95} ${cy - ry * 1.1} ${cx + rx * .8} ${cy - ry * 1.2} ${cx + rx * 1.05} ${cy - ry * .2}" fill="none" stroke="${c}" stroke-width="7" stroke-linecap="round"/></svg>`;
const inkLine = (x1, y1, x2, y2, c = RED, w = 8) => `<svg width="1080" height="1920" viewBox="0 0 1080 1920" style="position:absolute;left:0;top:0;overflow:visible"><path class="dr" d="M${x1} ${y1} Q${(x1 + x2) / 2} ${y1 + 10} ${x2} ${y2}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/></svg>`;

// ---------- плеер «тетради»: станции + камера, HUD (Никита, уведомления), новые анимации write/stamp/cut ----------
function mountNB(EP, wordTimes, mouth) {
  const TL = buildTimeline(EP, wordTimes); const stage = document.getElementById("stage"), world = document.getElementById("world");
  const ST = EP.stations;
  (EP.margins || []).forEach(x => { const m = document.createElement("div"); m.className = "margin"; m.style.left = x + "px"; world.appendChild(m); });
  // какая станция у каждой сцены (наследуется)
  let cur = null; const scSt = EP.scenes.map(sc => (cur = sc.st || cur));
  // ключи камеры: старт каждой сцены со сменой станции
  const cams = []; scSt.forEach((s, i) => { if (i === 0 || s !== scSt[i - 1]) { const b = ST[s], sh = EP.camShift || [0, 0, 1]; cams.push({ t: i === 0 ? -1 : TL.T[i].t0 - .25, c: [b[0] + sh[0], b[1] + sh[1], (b[2] || 1) * sh[2], b[3] || 0] }); } });
  TL.els.forEach(e => { if (!e.hud && e.outw == null && e.outScene == null) e.out = null; });
  let k = 0;
  EP.scenes.forEach((sc, i) => (sc.els || []).forEach(() => { const e = TL.els[k++]; e.st = e.st || scSt[i]; }));
  TL.els.forEach(e => {
    const d = document.createElement("div"); d.className = "el" + (e.a === "draw" ? " full" : "") + (e.hud ? " hud" : "");
    d.innerHTML = (e.stk ? `<div class="stk">${e.html}</div>` : e.html) + (e.tape ? `<div class="tape" style="transform:translateX(-50%) rotate(${e.tape}deg)"></div>` : ""); e.node = d;
    const S = e.hud ? [540, 960] : ST[e.st]; e.ox = S[0] - 540; e.oy = S[1] - 960;
    if (e.a === "draw") { d.style.left = e.ox + "px"; d.style.top = e.oy + "px"; } else { d.style.left = e.x + e.ox + "px"; d.style.top = e.y + e.oy + "px"; }
    d.style.zIndex = e.z || (e.hud ? 70 : 5);
    (e.hud ? stage : world).appendChild(d);
    if (e.a === "draw") e.paths = [...d.querySelectorAll(".dr")].map(p => { const L = p.getTotalLength(); p.style.strokeDasharray = L; return [p, L]; }), e.heads = [...d.querySelectorAll(".hd")];
    if (e.count) e.num = d.querySelector(".num");
  });
  // Никита-ведущий (HUD, левый нижний угол): позы по сценам
  const NK = EP.nikita, nk = document.createElement("div"); nk.id = "nik"; nk.style.cssText = `left:${NK.x}px;top:${NK.y}px`;
  const poses = [...new Set(["idle", ...NK.poses.map(p => p[2])])];
  nk.innerHTML = poses.map(p => `<div class="pz stk" data-p="${p}">${CH.nikita({ pose: p, w: NK.w })}</div>`).join(""); stage.appendChild(nk);
  const pz = NK.poses.map(([si, w, p]) => [TL.T[si].wt[Math.min(w, TL.T[si].wt.length - 1)], p]).sort((a, b) => a[0] - b[0]);
  const sub = document.getElementById("sub");
  const shakes = TL.els.filter(e => e.shake).map(e => [e.at + (e.a === "stamp" ? .2 : .05), e.shake]);
  const heroEnd = NK.hero ? TL.T[NK.hero.until[0]].wt[NK.hero.until[1]] : -1;
  window.setT = t => {
    let sh = 0; for (const [st, a] of shakes) if (t >= st && t < st + .35) sh += a * (1 - (t - st) / .35);
    stage.style.transform = sh ? `translate(${(Math.sin(t * 97) * 9 * sh).toFixed(1)}px,${(Math.cos(t * 83) * 9 * sh).toFixed(1)}px) scale(${1 + .015 * Math.min(1, sh)})` : "none";
    // камера
    let c = cams[0].c, prev = c;
    for (const ck of cams) if (t >= ck.t) { const r = ease.io(cl((t - ck.t) / .8)); const a = prev; c = [a[0] + (ck.c[0] - a[0]) * r, a[1] + (ck.c[1] - a[1]) * r, (a[2] || 1) + ((ck.c[2] || 1) - (a[2] || 1)) * r, (a[3] || 0) + ((ck.c[3] || 0) - (a[3] || 0)) * r]; prev = ck.c; }
    const drift = Math.sin(t * .5) * 6;
    world.style.transform = `translate(540px,960px) rotate(${-(c[3] || 0)}deg) scale(${(c[2] || 1) * (1 + .01 * Math.sin(t * .35))}) translate(${-c[0] + drift}px,${-c[1]}px)`;
    for (const e of TL.els) {
      const d = e.node, dur = e.dur || ({ pop: .45, write: .7, stamp: .22, cut: .01 }[e.a] || .5);
      let p = cl((t - e.at) / dur), q = e.out != null ? cl((t - e.out) / .25) : 0;
      if (t < e.at || q >= 1) { d.style.display = "none"; continue; }
      d.style.display = "block";
      let x = e.x, y = e.y, s = e.s || 1;
      if (e.mv) { let px = x, py = y, ps = s; for (const [kt, kx, ky, ks] of e.mv) if (t >= kt) { const r = ease.io(cl((t - kt) / (e.mvd || .6))); x = px + (kx - px) * r; y = py + (ky - py) * r; s = ps + ((ks ?? ps) - ps) * r; px = x; py = y; ps = s; } }
      let sc = 1, op = 1, dx = 0, dy = 0, rot = e.r || 0;
      if (e.a === "pop" || e.a === "count") { sc = .25 + .75 * ease.back(p); op = cl(p * 3); rot += (1 - p) * -8; }
      else if (e.a === "fade") op = ease.out(p);
      else if (e.a === "up") { dy = 90 * (1 - ease.out(p)); op = ease.out(p); }
      else if (e.a === "down") { dy = -140 * (1 - ease.out(p)); op = ease.out(p); }
      else if (e.a === "left") { dx = -300 * (1 - ease.out(p)); op = ease.out(p); }
      else if (e.a === "right") { dx = 300 * (1 - ease.out(p)); op = ease.out(p); }
      else if (e.a === "stamp") { sc = 1.9 - .9 * ease.out(p); op = cl(p * 2.5); if (p >= 1) { const k = cl((t - e.at - dur) / .18); dx = Math.sin(k * 30) * 6 * (1 - k); } }
      else if (e.a === "write") d.firstElementChild.style.clipPath = `inset(-40px calc(${((1 - p) * 100).toFixed(1)}% - ${(60 * p).toFixed(0)}px) -40px -40px)`;
      else if (e.a === "draw") { const r = ease.io(cl((t - e.at) / (e.dur || .55))); e.paths.forEach(([pp, L]) => pp.style.strokeDashoffset = L * (1 - r)); e.heads.forEach(h => h.style.opacity = r > .92 ? 1 : 0); }
      if (e.count && e.num) { const cc = e.count; let v; if (cc.steps) { let pv = cc.from, cv = cc.from, st = e.at; for (const [sd, sv] of cc.steps) if (t >= e.at + sd) { pv = cv; cv = sv; st = e.at + sd; } v = pv + (cv - pv) * ease.out(cl((t - st) / .18)); } else v = cc.from + (cc.to - cc.from) * ease.out(cl((t - e.at) / (cc.d || .9))); e.num.innerHTML = (cc.pre || "") + fmt(v).split(/\D+/).join('<span style="display:inline-block;width:.2em"></span>') + (cc.post || ""); }
      if (e.bob) dy += Math.sin(t * 2.2 + e.x * .01) * 4;
      if (q > 0) { op *= 1 - q; if (e.hud) dy -= 60 * q; else sc *= 1 - .1 * q; }
      d.style.opacity = op;
      if (e.a === "draw") continue;
      if (e.mv) { d.style.left = x + e.ox + "px"; d.style.top = y + e.oy + "px"; }
      d.style.transform = `translate(-50%,-50%) translate(${dx}px,${dy}px) scale(${s * sc}) rotate(${rot}deg)`;
    }
    // Никита: поза, дыхание, моргание, рот по громкости голоса (mouth[кадр] 0..1)
    let pose = NK.hero ? NK.poses[0][2] : "idle"; for (const [pt, p] of pz) if (t >= pt) pose = p;
    nk.querySelectorAll(".pz").forEach(n => n.style.display = n.dataset.p === pose ? "block" : "none");
    const enter = NK.hero ? 1 : ease.out(cl((t - .05) / .6));
    let nx = NK.x, ny = NK.y, ns = 1;
    if (NK.hero) { const r = ease.io(cl((t - heroEnd) / .7)); nx = NK.hero.x + (NK.x - NK.hero.x) * r; ny = NK.hero.y + (NK.y - NK.hero.y) * r; ns = NK.hero.s + (1 - NK.hero.s) * r; }
    nk.style.left = nx + "px"; nk.style.top = ny + "px";
    nk.style.transform = `translate(-50%,0) translateY(${(1 - enter) * 500 + Math.sin(t * 2) * 5}px) scale(${ns}) rotate(${Math.sin(t * 1.1) * 1.2}deg)`;
    const bl = ((t + 1.6) % 3.7) < .11; nk.querySelectorAll(".blink").forEach(b => b.style.transform = bl ? "scaleY(.12)" : "none");
    const lv = mouth ? (mouth[Math.round(t * 30)] || 0) : -1;
    const m = lv < 0 ? "m-grin" : lv > .55 ? "m-open" : lv > .18 ? "m-mid" : "m-grin";
    nk.querySelectorAll(".m-grin,.m-open,.m-mid").forEach(g => g.style.display = g.classList.contains(m) ? "inline" : "none");
    // субтитры
    let cs = null; for (const s of TL.subs) if (t >= s.s0 && t < s.s1) cs = s;
    if (cs) { if (sub.dataset.k !== String(cs.s0)) { sub.innerHTML = `<span>${cs.html}</span>`; sub.dataset.k = cs.s0; } sub.style.opacity = 1; } else sub.style.opacity = 0;
  };
  window.TL = TL; window.DUR = EP.dur;
  return TL;
}
