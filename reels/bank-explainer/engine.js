// Движок объясняющих мультроликов в стиле «плоская инфографика на тёмном холсте» (референс владельца 17.11 — @mone.tariij):
// тёмный сине-зелёный фон с еле заметной сеткой, простые плоские персонажи с толстым контуром, иконки (банк, карты, деньги),
// огромные цифры Oswald, зелёные суммы, субтитры снизу с оранжевыми акцентами, круглый значок рассказчика справа сверху.
// Один непрерывный холст без склеек: элементы появляются «поп»-ом, стрелки рисуются, суммы считаются.
// Персонажи и рассказчик — свои (Макс, Лера, сова-рассказчик), чужих героев не копируем.
const K = "#161616";
const PAL = { green: "#8be37a", orange: "#f5a524", yellow: "#f7c948", red: "#ef5b4c", cream: "#f2dca4", white: "#f4f4f2", grey: "#9aa6ad", tg: "#2aa3e0" };

// ---------- персонажи (viewBox 260×400, низ ботинок ≈ y 378) ----------
function legs(pants) {
  return `<rect x="96" y="296" width="30" height="66" fill="${pants}" stroke="${K}" stroke-width="6"/><rect x="134" y="296" width="30" height="66" fill="${pants}" stroke="${K}" stroke-width="6"/>
  <ellipse cx="104" cy="368" rx="32" ry="14" fill="${K}"/><ellipse cx="158" cy="368" rx="32" ry="14" fill="${K}"/>`;
}
function eyes(id, look = 0) {
  return `<g class="blink" style="transform-origin:130px 120px">
    <ellipse cx="104" cy="118" rx="27" ry="31" fill="#fff" stroke="${K}" stroke-width="6"/><ellipse cx="156" cy="118" rx="27" ry="31" fill="#fff" stroke="${K}" stroke-width="6"/>
    <circle cx="${107 + look}" cy="122" r="7" fill="${K}"/><circle cx="${153 + look}" cy="122" r="7" fill="${K}"/></g>`;
}
const CH = {
  max(o = {}) {
    const sk = "#f5d0b0", hood = "#e9a93b", hd = "#c98b25";
    return `<svg viewBox="0 0 260 400" width="${o.w || 300}">
    ${legs("#3b4250")}
    <path d="M58 302 q-6 -88 72 -98 q78 10 72 98 z" fill="${hood}" stroke="${K}" stroke-width="6" stroke-linejoin="round"/>
    <path d="M70 230 q-22 30 -18 74" fill="none" stroke="${K}" stroke-width="6"/><path d="M190 230 q22 30 18 74" fill="none" stroke="${K}" stroke-width="6"/>
    <rect x="96" y="256" width="68" height="34" rx="8" fill="${hd}" stroke="${K}" stroke-width="5"/>
    <path d="M100 206 q30 24 60 0" fill="${hd}" stroke="${K}" stroke-width="6"/>
    <path d="M116 218 v34 M144 218 v34" stroke="#fff" stroke-width="5" stroke-linecap="round"/>
    ${o.phone ? `<g transform="translate(196 252) rotate(-12)"><rect x="-20" y="-40" width="40" height="72" rx="8" fill="#222" stroke="${K}" stroke-width="5"/><rect x="-14" y="-32" width="28" height="52" rx="3" fill="#5fb7e8"/></g>` : ""}
    <circle cx="56" cy="304" r="13" fill="${sk}" stroke="${K}" stroke-width="5"/><circle cx="204" cy="304" r="13" fill="${sk}" stroke="${K}" stroke-width="5"/>
    <circle cx="48" cy="128" r="16" fill="${sk}" stroke="${K}" stroke-width="6"/><circle cx="212" cy="128" r="16" fill="${sk}" stroke="${K}" stroke-width="6"/>
    <circle cx="130" cy="122" r="84" fill="${sk}" stroke="${K}" stroke-width="6"/>
    <path d="M46 116 L54 62 L78 80 L90 38 L112 64 L130 26 L148 62 L172 36 L180 72 L206 56 L214 112 Q196 76 130 74 Q66 76 46 116 Z" fill="#2b211d" stroke="${K}" stroke-width="6" stroke-linejoin="round"/>
    <path d="M90 82 l-6 -16 M150 78 l8 -14" stroke="#4a3a33" stroke-width="5" stroke-linecap="round"/>
    ${eyes("m", o.look || 0)}
    <path d="M84 84 q18 -10 36 -2 M140 82 q18 -8 36 2" fill="none" stroke="${K}" stroke-width="7" stroke-linecap="round"/>
    <circle cx="74" cy="160" r="5" fill="#d9a07c"/><circle cx="84" cy="168" r="4" fill="#d9a07c"/><circle cx="186" cy="160" r="5" fill="#d9a07c"/>
    ${o.wow ? `<ellipse cx="130" cy="172" rx="14" ry="17" fill="#7a2a2a" stroke="${K}" stroke-width="6"/>` : `<path d="M104 164 q26 26 52 0 q-26 8 -52 0 z" fill="#7a2a2a" stroke="${K}" stroke-width="6" stroke-linejoin="round"/>`}
    </svg>`;
  },
  lera(o = {}) {
    const sk = "#f6d6bf", sw = "#8a63d2", hr = "#272333";
    return `<svg viewBox="0 0 260 400" width="${o.w || 300}">
    <path d="M40 126 Q36 34 130 32 Q224 34 220 126 L226 262 Q130 278 34 262 Z" fill="${hr}" stroke="${K}" stroke-width="6" stroke-linejoin="round"/>
    ${legs("#2f3440")}
    <path d="M60 302 q-6 -88 70 -98 q76 10 70 98 z" fill="${sw}" stroke="${K}" stroke-width="6" stroke-linejoin="round"/>
    <path d="M104 206 l26 22 l26 -22 l-8 -6 l-18 14 l-18 -14 z" fill="#fff" stroke="${K}" stroke-width="5" stroke-linejoin="round"/>
    <path d="M130 228 v66" stroke="${K}" stroke-width="4" opacity=".5"/><circle cx="130" cy="246" r="4" fill="${K}"/><circle cx="130" cy="268" r="4" fill="${K}"/>
    <path d="M72 230 q-22 30 -16 74" fill="none" stroke="${K}" stroke-width="6"/><path d="M188 230 q22 30 16 74" fill="none" stroke="${K}" stroke-width="6"/>
    ${o.phone ? `<g transform="translate(196 252) rotate(-12)"><rect x="-20" y="-40" width="40" height="72" rx="8" fill="#222" stroke="${K}" stroke-width="5"/><rect x="-14" y="-32" width="28" height="52" rx="3" fill="${PAL.tg}"/></g>` : ""}
    <circle cx="58" cy="304" r="13" fill="${sk}" stroke="${K}" stroke-width="5"/><circle cx="202" cy="304" r="13" fill="${sk}" stroke="${K}" stroke-width="5"/>
    <circle cx="130" cy="122" r="82" fill="${sk}" stroke="${K}" stroke-width="6"/>
    <path d="M48 118 Q52 40 130 40 Q208 40 212 118 L196 96 L182 112 L168 90 L150 106 L134 86 L116 104 L98 88 L82 108 L66 92 Z" fill="${hr}" stroke="${K}" stroke-width="6" stroke-linejoin="round"/>
    <path d="M150 52 q30 4 46 26" fill="none" stroke="#4b4560" stroke-width="6" stroke-linecap="round"/>
    ${eyes("l", o.look || 0)}
    <path d="M78 98 l12 -8 M182 98 l-12 -8" stroke="${K}" stroke-width="5" stroke-linecap="round"/>
    <path d="M86 138 l-8 -4 M174 138 l8 -4" stroke="${K}" stroke-width="4" stroke-linecap="round"/>
    <circle cx="80" cy="158" r="9" fill="#f2a7a0" opacity=".7"/><circle cx="180" cy="158" r="9" fill="#f2a7a0" opacity=".7"/>
    <path d="M110 166 q20 16 40 0" fill="none" stroke="${K}" stroke-width="6" stroke-linecap="round"/>
    <circle cx="48" cy="150" r="5" fill="${PAL.yellow}" stroke="${K}" stroke-width="3"/><circle cx="212" cy="150" r="5" fill="${PAL.yellow}" stroke="${K}" stroke-width="3"/>
    </svg>`;
  },
  // рассказчик — сова-аналитик в круглых очках (значок справа сверху, как у референса — свой персонаж)
  owl(o = {}) {
    return `<svg viewBox="0 0 200 200" width="${o.w || 170}">
    <circle cx="100" cy="100" r="92" fill="#cfd9b6" stroke="#e9eedc" stroke-width="6"/>
    <clipPath id="oc${o.k || ""}"><circle cx="100" cy="100" r="89"/></clipPath>
    <g clip-path="url(#oc${o.k || ""})">
      <path d="M36 210 q4 -70 64 -76 q60 6 64 76 z" fill="#3a5a46" stroke="${K}" stroke-width="5"/>
      <path d="M84 136 l16 22 l16 -22 z" fill="#fff" stroke="${K}" stroke-width="4"/><path d="M95 150 l5 -6 l5 6 l-3 30 h-4 z" fill="${PAL.orange}" stroke="${K}" stroke-width="3"/>
      <path d="M48 96 q-4 -44 20 -64 l12 22 q20 -8 40 0 l12 -22 q24 20 20 64 q0 44 -52 46 q-52 -2 -52 -46 z" fill="#8a6a4a" stroke="${K}" stroke-width="5" stroke-linejoin="round"/>
      <ellipse cx="100" cy="112" rx="34" ry="26" fill="#c9ab84"/>
      <circle cx="78" cy="88" r="20" fill="#fff" stroke="${K}" stroke-width="6"/><circle cx="122" cy="88" r="20" fill="#fff" stroke="${K}" stroke-width="6"/>
      <path d="M98 88 h4" stroke="${K}" stroke-width="6"/>
      <circle cx="80" cy="90" r="6" fill="${K}"/><circle cx="120" cy="90" r="6" fill="${K}"/>
      <path d="M92 104 l8 14 l8 -14 z" fill="${PAL.orange}" stroke="${K}" stroke-width="4" stroke-linejoin="round"/>
    </g></svg>`;
  },
  // маленький человечек-силуэт (клиенты / трафик)
  dude(o = {}) {
    const c = o.c || "#cfd6da";
    return `<svg viewBox="0 0 60 80" width="${o.w || 60}"><circle cx="30" cy="20" r="15" fill="${c}"/><path d="M6 78 q0 -40 24 -40 q24 0 24 40 z" fill="${c}"/></svg>`;
  },
};

// ---------- иконки ----------
const IC = {
  bank(w = 260, c = PAL.cream) {
    return `<svg viewBox="0 0 200 170" width="${w}"><path d="M100 6 L190 52 H10 Z" fill="${c}"/><rect x="18" y="58" width="164" height="12" fill="${c}"/>
    ${[34, 74, 114, 154].map(x => `<rect x="${x}" y="78" width="14" height="60" rx="3" fill="${c}"/>`).join("")}<rect x="10" y="146" width="180" height="16" rx="3" fill="${c}"/>
    <circle cx="100" cy="36" r="9" fill="#1d2a2f"/></svg>`;
  },
  coin(w = 60) {
    return `<svg viewBox="0 0 60 60" width="${w}"><circle cx="30" cy="30" r="26" fill="#f1b92c" stroke="#a87410" stroke-width="4"/><circle cx="30" cy="30" r="18" fill="none" stroke="#c98d18" stroke-width="3"/>
    <text x="30" y="40" font-family="Manrope" font-weight="800" font-size="26" text-anchor="middle" fill="#a87410">₽</text></svg>`;
  },
  cash(w = 300) {
    const bill = (x, y, r) => `<g transform="translate(${x} ${y}) rotate(${r})"><rect x="-110" y="-52" width="220" height="104" rx="10" fill="#84d06c" stroke="#3f7a32" stroke-width="5"/>
      <rect x="-96" y="-38" width="192" height="76" rx="6" fill="none" stroke="#5aa648" stroke-width="3"/><circle cx="0" cy="0" r="26" fill="#a9e394" stroke="#3f7a32" stroke-width="4"/>
      <text x="0" y="11" font-family="Manrope" font-weight="800" font-size="32" text-anchor="middle" fill="#3f7a32">₽</text></g>`;
    return `<svg viewBox="0 0 300 200" width="${w}">${bill(150, 140, -4)}${bill(146, 116, 3)}${bill(152, 90, -2)}</svg>`;
  },
  card(o = {}) {
    const c = o.c || "#2e3a40", tx = o.tx || "#fff", w = o.w || 360;
    return `<svg viewBox="0 0 340 214" width="${w}"><rect x="2" y="2" width="336" height="210" rx="18" fill="${c}" stroke="rgba(0,0,0,.35)" stroke-width="3"/>
    <path d="M200 2 h120 a18 18 0 0 1 18 18 v192 h-60 z" fill="rgba(255,255,255,.08)"/>
    <rect x="28" y="70" width="52" height="40" rx="7" fill="#e3c26b"/><path d="M28 90 h52 M54 70 v40" stroke="#b89640" stroke-width="2"/>
    <text x="28" y="44" font-family="Manrope" font-weight="800" font-size="24" fill="${tx}" opacity=".95">${o.label || ""}</text>
    <text x="28" y="160" font-family="Manrope" font-weight="700" font-size="24" letter-spacing="3" fill="${tx}" opacity=".85">2200 •••• •••• ${o.num || "0000"}</text>
    <text x="310" y="196" font-family="Manrope" font-weight="800" font-size="20" text-anchor="end" fill="${tx}" opacity=".7">${o.kind || ""}</text></svg>`;
  },
  check(w = 90, c = PAL.green) {
    return `<svg viewBox="0 0 100 100" width="${w}"><circle cx="50" cy="50" r="44" fill="${c}"/><path d="M28 52 l15 15 l30 -32" fill="none" stroke="#123" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  },
  cross(w = 90) {
    return `<svg viewBox="0 0 100 100" width="${w}"><circle cx="50" cy="50" r="44" fill="${PAL.red}"/><path d="M33 33 l34 34 M67 33 l-34 34" stroke="#fff" stroke-width="10" stroke-linecap="round"/></svg>`;
  },
  tv(w = 220) {
    return `<svg viewBox="0 0 220 180" width="${w}"><path d="M80 20 l30 26 l30 -26" fill="none" stroke="${PAL.grey}" stroke-width="7" stroke-linecap="round"/>
    <rect x="10" y="46" width="200" height="124" rx="16" fill="#33424a" stroke="${PAL.grey}" stroke-width="7"/><rect x="28" y="62" width="164" height="92" rx="8" fill="#4f6670"/>
    <text x="110" y="124" font-family="Oswald" font-weight="700" font-size="44" text-anchor="middle" fill="${PAL.white}">₽₽₽</text></svg>`;
  },
  tg(w = 120) {
    return `<svg viewBox="0 0 100 100" width="${w}"><circle cx="50" cy="50" r="46" fill="${PAL.tg}"/><path d="M22 49 l52 -21 q4 -1 3 4 l-9 42 q-1 4 -5 2 l-14 -10 l-7 7 q-2 2 -3 -1 l1 -12 l25 -23 l-31 19 l-12 -4 q-4 -2 0 -3 z" fill="#fff"/></svg>`;
  },
  eye(w = 120) {
    return `<svg viewBox="0 0 120 80" width="${w}"><path d="M6 40 q54 -64 108 0 q-54 64 -108 0 z" fill="${PAL.white}"/><circle cx="60" cy="40" r="20" fill="#1d2a2f"/><circle cx="66" cy="34" r="6" fill="#fff"/></svg>`;
  },
  link(w = 70, c = "#1d2a2f") {
    return `<svg viewBox="0 0 70 70" width="${w}"><g fill="none" stroke="${c}" stroke-width="8" stroke-linecap="round"><path d="M30 40 l10 -10"/><path d="M26 30 l-8 8 a10 10 0 0 0 14 14 l8 -8"/><path d="M44 40 l8 -8 a10 10 0 0 0 -14 -14 l-8 8"/></g></svg>`;
  },
  cursor(w = 70) {
    return `<svg viewBox="0 0 60 80" width="${w}"><path d="M6 4 L6 64 L20 50 L30 74 L40 70 L30 46 L50 46 Z" fill="#fff" stroke="${K}" stroke-width="4" stroke-linejoin="round"/></svg>`;
  },
  play(w = 110) {
    return `<svg viewBox="0 0 100 100" width="${w}"><circle cx="50" cy="50" r="46" fill="rgba(255,255,255,.9)"/><path d="M40 30 l30 20 l-30 20 z" fill="#1d2a2f"/></svg>`;
  },
};

// стрелка-линия (рисуется): from (x1,y1) to (x2,y2) с изгибом bend, координаты холста
function arrowSVG(x1, y1, x2, y2, bend = 0, c = "rgba(244,244,242,.75)", dash = false) {
  const mx = (x1 + x2) / 2 - (y2 - y1) * bend, my = (y1 + y2) / 2 + (x2 - x1) * bend;
  const ang = Math.atan2(y2 - my, x2 - mx), L = 26;
  const h1 = [x2 - L * Math.cos(ang - .5), y2 - L * Math.sin(ang - .5)], h2 = [x2 - L * Math.cos(ang + .5), y2 - L * Math.sin(ang + .5)];
  return `<svg width="1080" height="1920" viewBox="0 0 1080 1920" style="position:absolute;left:0;top:0;overflow:visible">
  <path class="dr" d="M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}" fill="none" stroke="${c}" stroke-width="7" stroke-linecap="round" ${dash ? 'stroke-dasharray="2 18"' : ""}/>
  <path class="hd" d="M${h1[0]} ${h1[1]} L${x2} ${y2} L${h2[0]} ${h2[1]}" fill="none" stroke="${c}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}

// ---------- плеер таймлайна ----------
// EP = { scenes:[{line, els:[{id,w|dt,out?,x,y,html,a:'pop'|'fade'|'up'|'down'|'left'|'right'|'draw'|'count',count:{from,to,pre,post},bob,mv:[[w|dt,x,y,s]]}]}] }
// Время элемента: w — индекс слова в реплике сцены (синхрон со словом голоса), dt — сдвиг от начала сцены в секундах.
const ease = { out: p => 1 - Math.pow(1 - p, 3), back: p => { const c = 1.9; return 1 + (c + 1) * Math.pow(p - 1, 3) + c * Math.pow(p - 1, 2); }, io: p => p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2 };
const cl = v => Math.max(0, Math.min(1, v));
const fmt = n => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

function buildTimeline(EP, wordTimes) {
  // wordTimes: [[sceneIdx][wordIdx]] = секунды; иначе — оценка 0.4 с на слово
  let t = EP.lead || 0.3; const T = [];
  EP.scenes.forEach((sc, i) => {
    const words = sc.line.split(/[ \n\t]+/).filter(Boolean);
    const wt = wordTimes ? wordTimes[i] : words.map((_, k) => t + k * 0.4);
    const t0 = wt[0], t1 = wordTimes ? (wordTimes[i + 1] ? wordTimes[i + 1][0] : wt[wt.length - 1] + 1.2) : t + words.length * 0.4 + 0.35;
    T.push({ t0, t1, wt, words });
    t = t1;
  });
  EP.dur = T[T.length - 1].t1 + (EP.tail || 1.6);
  const at = (i, e, key = "w", dkey = "dt") => e[key] != null ? T[i].wt[Math.min(e[key], T[i].wt.length - 1)] : T[i].t0 + (e[dkey] || 0);
  const els = [];
  EP.scenes.forEach((sc, i) => (sc.els || []).forEach(e => {
    const o = Object.assign({}, e); o.at = at(i, e) + (e.dl || 0);
    if (e.outw != null) o.out = T[i].wt[Math.min(e.outw, T[i].wt.length - 1)];
    else if (e.outScene != null) o.out = T[Math.min(i + e.outScene, T.length - 1)].t0 + (e.outDt || 0);
    else if (e.keep) o.out = null; else o.out = T[i].t1 - 0.05;
    if (e.mv) o.mv = e.mv.map(k => [k[0] === "s" ? T[Math.min(i + k[4], T.length - 1)].t0 : (typeof k[0] === "string" ? T[i].t0 + parseFloat(k[0]) : T[i].wt[Math.min(k[0], T[i].wt.length - 1)]), k[1], k[2], k[3]]);
    els.push(o);
  }));
  // субтитры: куски по 2–5 слов, акценты *слово* или *несколько слов* (могут переходить между кусками)
  const subs = [];
  EP.scenes.forEach((sc, i) => {
    const raw = sc.line.split(/[ \n\t]+/).filter(Boolean); let open = false;
    const tok = raw.map(w => { let h = "", acc = open || w.startsWith("*"); const clean = w.replace(/\*/g, ""); if (w.startsWith("*")) open = true; if (w.replace(/[.,:;?!»]+$/, "").endsWith("*")) open = false;
      const m = clean.match(/^(.*?)([.,:;?!»]*)$/); return acc ? `<b>${m[1]}</b>${m[2]}` : clean; });
    let k = 0;
    while (k < raw.length) {
      let n = Math.min(4, raw.length - k); if (raw.length - k - n === 1) n++;
      for (let j = k; j < k + n - 1; j++) if (/[.,:?!]$/.test(raw[j].replace(/\*/g, "")) && j - k >= 1) { n = j - k + 1; break; }
      const s0 = T[i].wt[k], s1 = k + n < raw.length ? T[i].wt[k + n] : T[i].t1;
      subs.push({ s0, s1, html: tok.slice(k, k + n).join(" ") });
      k += n;
    }
  });
  return { T, els, subs };
}

function mount(EP, wordTimes) {
  const TL = buildTimeline(EP, wordTimes); const stage = document.getElementById("stage");
  TL.els.forEach((e, n) => {
    const d = document.createElement("div"); d.className = "el" + (e.a === "draw" ? " full" : ""); d.innerHTML = e.html; e.node = d;
    if (e.a !== "draw") { d.style.left = e.x + "px"; d.style.top = e.y + "px"; }
    d.style.zIndex = e.z || 5 + n * 0 ; stage.appendChild(d);
    if (e.a === "draw") { e.paths = [...d.querySelectorAll(".dr")].map(p => { const L = p.getTotalLength(); p.style.strokeDasharray = p.getAttribute("stroke-dasharray") ? p.getAttribute("stroke-dasharray") : L; return [p, L]; }); e.heads = [...d.querySelectorAll(".hd")]; }
    if (e.a === "count") e.num = d.querySelector(".num") || d;
  });
  const sub = document.getElementById("sub");
  window.setT = t => {
    for (const e of TL.els) {
      const d = e.node; const dur = e.dur || (e.a === "pop" ? .45 : .5);
      let p = cl((t - e.at) / dur), q = e.out != null ? cl((t - e.out) / .28) : 0;
      if (t < e.at || q >= 1) { d.style.display = "none"; continue; }
      d.style.display = "block";
      let x = e.x, y = e.y, s = e.s || 1;
      if (e.mv) { let px = x, py = y, ps = s, pt = e.at; for (const [kt, kx, ky, ks] of e.mv) { if (t >= kt) { const r = ease.io(cl((t - kt) / (e.mvd || .6))); x = px + (kx - px) * r; y = py + (ky - py) * r; s = ps + ((ks ?? ps) - ps) * r; px = x; py = y; ps = s; } } }
      let sc = 1, op = 1, dx = 0, dy = 0;
      if (e.a === "pop" || e.a === "count") { sc = .25 + .75 * ease.back(p); op = cl(p * 3); }
      else if (e.a === "fade") op = ease.out(p);
      else if (e.a === "up") { dy = 80 * (1 - ease.out(p)); op = ease.out(p); }
      else if (e.a === "down") { dy = -90 * (1 - ease.out(p)); op = ease.out(p); }
      else if (e.a === "left") { dx = -260 * (1 - ease.out(p)); op = ease.out(p); }
      else if (e.a === "right") { dx = 260 * (1 - ease.out(p)); op = ease.out(p); }
      else if (e.a === "draw") { const r = ease.io(cl((t - e.at) / (e.dur || .55))); e.paths.forEach(([pp, L]) => { if (!pp.getAttribute("stroke-dasharray") || pp.style.strokeDasharray == L) pp.style.strokeDashoffset = L * (1 - r); else pp.style.opacity = r; }); e.heads.forEach(h => h.style.opacity = r > .92 ? 1 : 0); }
      if (e.a === "count" && e.count) { const c = e.count, r = ease.out(cl((t - e.at) / (c.d || .9))); e.num.innerHTML = (c.pre || "") + fmt(c.from + (c.to - c.from) * r).split(/\D+/).join('<span style="display:inline-block;width:.22em"></span>') + (c.post || ""); }
      if (e.bob) dy += Math.sin((t + n2(e)) * 2.2) * 5;
      if (e.blink) { const ph = (t + n2(e) * 3) % 3.4; d.querySelectorAll(".blink").forEach(b => b.style.transform = ph < .12 ? "scaleY(.1)" : "none"); }
      if (e.pulse) { const k = (t - e.at) % e.pulse; sc *= 1 + .06 * Math.max(0, Math.sin(Math.min(1, k / .3) * Math.PI)); }
      if (q > 0) { op *= 1 - q; sc *= 1 - .12 * q; }
      d.style.opacity = op;
      if (e.a !== "draw") { if (e.mv) { d.style.left = x + "px"; d.style.top = y + "px"; } } if (e.a !== "draw") d.style.transform = `translate(-50%,-50%) translate(${dx}px,${dy}px) scale(${s * sc}) rotate(${e.r || 0}deg)`;
      else d.style.opacity = q > 0 ? 1 - q : 1;
    }
    let cur = null; for (const s of TL.subs) if (t >= s.s0 && t < s.s1) cur = s;
    if (cur) { if (sub.dataset.k !== String(cur.s0)) { sub.innerHTML = `<span>${cur.html}</span>`; sub.dataset.k = cur.s0; } sub.style.opacity = 1; } else sub.style.opacity = 0;
  };
  function n2(e) { return (e.x || 0) * .013 + (e.y || 0) * .007; }
  window.TL = TL; window.DUR = EP.dur;
  return TL;
}
