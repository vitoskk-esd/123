// Кадры карусели ролика №3. Каждый — функция, возвращающая SVG-содержимое 1920×1080 (фон, иллюстрация, типографика).
// Цифры — из сценария (script.md, «Источники цифр»), примеры подписаны «пример».
(function () {
  const F = {}, { lerp } = A;
  const g = (x, y, s, inner, extra = "") => `<g transform="translate(${x} ${y}) scale(${s})" ${extra}>${inner}</g>`;

  // ── 2. Хук: улица под дождём, камера снизу — курьер идёт к кафе ─────────────────────────────────────────────
  F[2] = () => {
    const VPY = -1500, GY = 800, r = A.rnd(21);
    const top = (x, h) => x + (960 - x) * (h / (GY - VPY));
    let s = `<linearGradient id="sky2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#05070f"/><stop offset=".6" stop-color="#141d44"/><stop offset="1" stop-color="#2a2f63"/></linearGradient>
      <linearGradient id="fac2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#070a17"/><stop offset=".65" stop-color="#141b3c"/><stop offset="1" stop-color="#2b2b4f"/></linearGradient>
      <linearGradient id="road2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#151b3a"/><stop offset="1" stop-color="#06080f"/></linearGradient>
      <linearGradient id="cone2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffdca0" stop-opacity=".5"/><stop offset="1" stop-color="#ffdca0" stop-opacity="0"/></linearGradient>
      <rect width="1920" height="1080" fill="url(#sky2)"/><ellipse cx="960" cy="560" rx="700" ry="300" fill="#3a3f8a" opacity=".4" filter="url(#b60)"/>`;
    // фасады: к верху сходятся к точке схода — взгляд снизу
    const B = [[-200, 360, 1300], [380, 740, 1550], [760, 1190, 1250], [1210, 1730, 1000, "cafe"], [1750, 2140, 1200]];
    let refl = "";
    B.forEach(([x0, x1, h, kind]) => {
      const q = [[top(x0, h), GY - h], [top(x1, h), GY - h], [x0, GY], [x1, GY]];
      s += A.poly([q[0], q[1], q[3], q[2]], "url(#fac2)") + A.poly([q[1], [q[1][0] - 10, q[1][1]], [q[3][0] - 10, GY], q[3]], "#3a4580", 'opacity=".5"');
      const cols = Math.max(2, Math.round((x1 - x0) / 95)), rows = Math.round(h / 125);
      for (let i = 0; i < cols; i++) for (let j = 1; j < rows; j++) {
        if (kind === "cafe" && j < 3) continue;
        const u0 = (i + .22) / cols, u1 = (i + .78) / cols, v0 = 1 - (j + .72) / rows, v1 = 1 - (j + .22) / rows, z = r();
        const lit = z < .34, c = z < .26 ? "#ffcf87" : lit ? "#7fb6ff" : "#0b1026", op = lit ? (.55 + r() * .4).toFixed(2) : 1;
        const w = [A.quad(q, u0, v0), A.quad(q, u1, v0), A.quad(q, u1, v1), A.quad(q, u0, v1)];
        s += A.poly(w, c, `opacity="${op}"`);
        if (lit) { refl += A.poly(w.map(([x, y]) => [x, 2 * 912 - y]), c, `opacity="${(op * .6).toFixed(2)}"`); if (r() < .45) s += A.poly([w[0], w[1], A.quad(q, u1, v0 + (v1 - v0) * .45), A.quad(q, u0, v0 + (v1 - v0) * .45)], "#0b1026", 'opacity=".6"'); }
      }
    });
    // кафе: витрина, маркиза, неон
    const cx = 1230;
    s += `<rect x="${cx}" y="590" width="480" height="210" rx="6" fill="#ff9a4a" opacity=".9"/><rect x="${cx}" y="590" width="480" height="210" fill="#ffd9a8" opacity=".4" filter="url(#b14)"/>
      <g fill="#7a3a1a" opacity=".75"><circle cx="${cx + 100}" cy="690" r="22"/><rect x="${cx + 75}" y="710" width="50" height="90" rx="20"/><circle cx="${cx + 330}" cy="680" r="22"/><rect x="${cx + 305}" y="700" width="50" height="100" rx="20"/><rect x="${cx + 180}" y="730" width="110" height="12" rx="6"/></g>
      <path d="M${cx - 15} 550 h510 l-30 50 h-450z" fill="#d6463a"/>${[0, 1, 2, 3, 4, 5, 6].map(k => `<path d="M${cx + 15 + k * 70} 550 l${-30 + k * 10} 50" stroke="#f4efe6" stroke-width="24" opacity=".92"/>`).join("")}
      <g filter="url(#glow)"><rect x="${cx + 125}" y="458" width="230" height="74" rx="37" fill="none" stroke="#ff6aa0" stroke-width="7"/><text x="${cx + 240}" y="514" text-anchor="middle" font-family="Unb" font-weight="900" font-size="46" fill="#ffd1e4">КАФЕ</text></g>
      <ellipse cx="${cx + 240}" cy="670" rx="440" ry="230" fill="#ff8a3d" opacity=".28" filter="url(#b60)"/>`;
    // тротуар и мокрая дорога с отражениями
    s += `<rect x="0" y="${GY}" width="1920" height="104" fill="#1d2446"/><rect x="0" y="${GY}" width="1920" height="8" fill="#2e3768"/><rect x="0" y="904" width="1920" height="8" fill="#3a4580"/>
      <rect x="0" y="912" width="1920" height="168" fill="url(#road2)"/>
      <g filter="url(#b6)">${refl}<rect x="${cx}" y="${2 * 912 - 800}" width="480" height="210" fill="#ff9a4a" opacity=".55"/><rect x="${cx + 125}" y="${2 * 912 - 532}" width="230" height="74" rx="37" fill="#ff6aa0" opacity=".5"/></g>
      <rect x="0" y="912" width="1920" height="168" fill="#06080f" opacity=".35"/>`;
    // фонарь слева со световым конусом
    s += `<path d="M150 ${GY + 70} V560 q0 -36 36 -36 h70" stroke="#0d1226" stroke-width="16" fill="none" stroke-linecap="round"/><rect x="236" y="510" width="84" height="26" rx="10" fill="#0d1226"/>
      <path d="M244 534 L312 534 L560 ${GY + 60} L20 ${GY + 60}Z" fill="url(#cone2)"/><ellipse cx="278" cy="540" rx="40" ry="13" fill="#fff1c9" filter="url(#glow)"/>
      <ellipse cx="290" cy="${GY + 60}" rx="300" ry="44" fill="#ffdca0" opacity=".25" filter="url(#b30)"/>`;
    s += A.rain(7, 230, { ang: 14 });
    // курьер: контровой свет от неона кафе, брызги под ногами
    s += A.courierSide({ x: 960, y: 880, s: 1.5, phase: .28, bag: true, rim: "#ff8a5a" });
    s += `<g fill="#cfe0ff" opacity=".7">${[[1010, 868, 5], [1040, 856, 4], [1068, 864, 3], [890, 870, 4], [868, 860, 3]].map(([x, y, rr]) => `<ellipse cx="${x}" cy="${y}" rx="${rr}" ry="${rr * 1.6}"/>`).join("")}</g>
      <ellipse cx="980" cy="930" rx="180" ry="14" fill="#9fb6ff" opacity=".2" filter="url(#b6)"/>`;
    s += A.rain(99, 22, { ang: 14, blur: "b6" }).replace(/stroke-width="[\d.]+"/g, 'stroke-width="9"');
    // типографика
    s += `<path d="M0 0 H980 Q820 300 0 500Z" fill="#04060c" opacity=".6" filter="url(#b60)"/>`;
    s += A.title(80, 150, [{ t: "1 000 ₽", size: 180, color: "#ffd60a" }, { t: "= 2–3 часа", size: 86 }, { t: "в дождь, в снег, с рюкзаком", size: 36, font: "Mont", w: 700, ls: 0, color: "#c9d3f2" }]);
    s += A.note(84, 1030, "курьер пешком: 350–500 ₽ в час · hh.ru для Retail.ru, 2026", { size: 22 });
    s += A.chapter("ХУК", "Сколько стоит тысяча", "0:08");
    return s;
  };

  // ── 3. Хук: тепло дома против дождя за окном — банк платит сам ─────────────────────────────────────────────
  F[3] = () => {
    let s = `<linearGradient id="wall3" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2a1a14"/><stop offset="1" stop-color="#140c09"/></linearGradient>
      <linearGradient id="out3" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b1330"/><stop offset="1" stop-color="#1d2a5c"/></linearGradient>
      <linearGradient id="sofa3" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3e6b5e"/><stop offset="1" stop-color="#22433a"/></linearGradient>
      <rect width="1920" height="1080" fill="url(#wall3)"/>
      <circle cx="1820" cy="300" r="560" fill="#ffb25c" opacity=".3" filter="url(#b60)"/><circle cx="1820" cy="300" r="220" fill="#ffd9a0" opacity=".25" filter="url(#b60)"/>`;
    // окно: ночной город, дождь, внизу маленький курьер с жёлтым коробом
    const r = A.rnd(5); let city = "";
    for (let i = 0; i < 9; i++) { const x = 130 + i * 72, h = 160 + r() * 260; city += `<rect x="${x}" y="${700 - h}" width="66" height="${h}" fill="#0a1026"/>`;
      for (let k = 0; k < 10; k++) if (r() < .5) city += `<rect x="${x + 8 + Math.floor(r() * 4) * 14}" y="${700 - h + 12 + Math.floor(r() * (h / 18)) * 16}" width="8" height="9" fill="#ffcf87" opacity="${(.4 + r() * .5).toFixed(2)}"/>`; }
    s += `<clipPath id="win3"><rect x="130" y="150" width="640" height="560" rx="8"/></clipPath>
      <g clip-path="url(#win3)"><rect x="130" y="150" width="640" height="560" fill="url(#out3)"/>${A.bokeh(3, 22, [130, 160, 770, 520], ["#ffcf87", "#7fb6ff", "#ff6aa0"], { blur: "b14", r0: 8, r1: 26 })}${city}
        <rect x="130" y="640" width="640" height="70" fill="#141b3a"/>
        ${g(560, 690, .24, A.courierSide({ phase: .7, rim: "#7fb6ff" }))}
        <ellipse cx="545" cy="690" rx="44" ry="6" fill="#ffd60a" opacity=".35" filter="url(#b6)"/>
        ${A.rain(3, 120, { ang: 8 })}
        <g stroke="#cfe0ff" stroke-width="3" opacity=".35" fill="none">${Array.from({ length: 16 }, () => { const x = 140 + r() * 620, y = 160 + r() * 300, L = 60 + r() * 200; return `<path d="M${x} ${y} q4 ${L / 2} -2 ${L}"/><circle cx="${x - 2}" cy="${y + L}" r="4" fill="#cfe0ff"/>`; }).join("")}</g>
        <path d="M130 150 L420 150 L130 520Z" fill="#fff" opacity=".05"/></g>
      <rect x="120" y="140" width="660" height="580" rx="12" fill="none" stroke="#5a3a26" stroke-width="22"/><path d="M450 140 V720 M120 430 H780" stroke="#5a3a26" stroke-width="14"/>
      <rect x="100" y="712" width="700" height="26" rx="6" fill="#6b452c"/>
      <g transform="translate(250 712)"><rect x="-24" y="-60" width="48" height="60" rx="10" fill="#b8613a"/><path d="M0 -60 C-40 -120 -10 -150 0 -110 C10 -160 50 -120 0 -60" fill="#3f8a5a"/></g>`;
    // торшер (частично за кадром)
    s += `<path d="M1840 980 V360" stroke="#1a0f0a" stroke-width="10"/><path d="M1740 360 h200 l-40 -130 h-120z" fill="#f0c58a"/><path d="M1740 360 h200 l-40 -130 h-120z" fill="#fff3d6" opacity=".4" filter="url(#b14)"/>`;
    // диван, герой с телефоном, журнальный столик перед ним
    const X = 120;
    s += `<rect x="0" y="930" width="1920" height="150" fill="#1a100c"/><rect x="0" y="930" width="1920" height="6" fill="#3a2418"/>
      <rect x="${860 + X}" y="560" width="740" height="300" rx="60" fill="url(#sofa3)"/><rect x="${820 + X}" y="720" width="820" height="200" rx="50" fill="#2f574c"/>
      <rect x="${800 + X}" y="640" width="110" height="280" rx="50" fill="#2a4e44"/><rect x="${1550 + X}" y="640" width="110" height="280" rx="50" fill="#2a4e44"/>
      <rect x="${900 + X}" y="600" width="230" height="170" rx="40" fill="#e9b04a" transform="rotate(-8 ${1015 + X} 690)"/><rect x="${1380 + X}" y="610" width="190" height="150" rx="40" fill="#b34a3a" transform="rotate(7 ${1475 + X} 690)"/>`;
    s += A.person({ x: 1250 + X, y: 940, s: 1.32, pose: { la: [[-60, -196], [-20, -262]], ra: [[60, -200], [10, -258]], ll: [[-40, -150], [-46, 0]], rl: [[40, -150], [48, 0]], tilt: -4, mouth: "open", look: -.3 }, noShadow: true,
      front: `${A.handPhone([-6, -262], -8, "#7fd8ff")}<circle cx="-6" cy="-330" r="70" fill="#7fd8ff" opacity=".12" filter="url(#b14)"/>` });
    s += `<g filter="url(#soft)"><rect x="${1000 + X}" y="806" width="540" height="30" rx="12" fill="#7a5034"/><rect x="${1015 + X}" y="836" width="510" height="26" rx="6" fill="#5e3c27"/>
        <rect x="${1040 + X}" y="860" width="20" height="80" fill="#4a2f1e"/><rect x="${1480 + X}" y="860" width="20" height="80" fill="#4a2f1e"/></g>
      <g transform="translate(${1110 + X} 806)"><rect x="-30" y="-56" width="60" height="56" rx="10" fill="#e8e2d6"/><path d="M30 -44 a16 16 0 0 1 0 30" stroke="#e8e2d6" stroke-width="8" fill="none"/>
        <path d="M-10 -70 q-12 -20 4 -36 M10 -70 q-12 -20 4 -36" stroke="#fff" stroke-width="5" fill="none" opacity=".35" stroke-linecap="round"/></g>
      <g transform="translate(${1380 + X} 806) rotate(-6)"><rect x="-80" y="-22" width="160" height="22" rx="4" fill="#3b6fb3"/><rect x="-70" y="-40" width="140" height="18" rx="4" fill="#d6463a"/></g>`;
    // уведомление и монеты
    s += A.notif(1000, 210, 600, { title: "Бонус 1 000 ₽ зачислен", sub: "за покупку по акции · пример", h: 160, rot: -3 });
    s += A.coin(980, 470, 42, { rot: -14 }) + A.coin(1650, 440, 30, { rot: 18, op: .9 }) + A.coin(1600, 140, 22, { op: .7, blur: "b2" });
    s += `<path d="M0 800 Q440 760 860 1080 H0Z" fill="#05030a" opacity=".6" filter="url(#b60)"/>`;
    s += A.title(80, 770, [{ t: "А банк платит сам", size: 84 }, { t: "10 минут на карту и одна покупка", size: 38, font: "Mont", w: 700, color: "#ffd60a", ls: 0 }]);
    s += A.chapter("ХУК", "Другая работа", "0:15");
    return s;
  };

  // ── 4. План ролика: пять способов по нарастающей и шестой — красный ─────────────────────────────────────────
  F[4] = () => {
    let s = `<radialGradient id="spot4" cx="60%" cy="20%" r="90%"><stop offset="0" stop-color="#26306a"/><stop offset=".55" stop-color="#0d1330"/><stop offset="1" stop-color="#05070f"/></radialGradient>
      <rect width="1920" height="1080" fill="url(#spot4)"/>
      ${A.bokeh(11, 30, [0, 0, 1920, 1080], ["#ffd60a", "#8a5cf6", "#2ec4b6"], { blur: "b30", r0: 20, r1: 70 })}
      <path d="M180 930 L1560 330" stroke="#ffd60a" stroke-width="6" stroke-dasharray="6 22" stroke-linecap="round" opacity=".45"/><path d="M1560 330 l-46 4 m46 -4 l-22 40" stroke="#ffd60a" stroke-width="6" stroke-linecap="round" opacity=".45"/>`;
    const C = [["#ffb000", "#ff6a00", "Бонус за карту", "1", "1 000–2 000 ₽"], ["#8a5cf6", "#4b2bd1", "Приведи друга", "2", "за каждого"], ["#2ec4b6", "#0f6b8a", "Деньги лежат", "3", "% каждый день"], ["#4a8dff", "#2338b8", "Кэшбэк", "4", "с покупок"], ["#ff5d8f", "#b0174a", "Кредитка", "5", "больше всех"]];
    C.forEach(([c1, c2, lab, n, sub], i) => { const w = 250 + i * 18, x = 300 + i * 285, y = 800 - i * 105, h = w * .63;
      s += `<ellipse cx="${x}" cy="${y + h / 2 + 30}" rx="${w * .45}" ry="14" fill="#000" opacity=".5" filter="url(#b14)"/>`;
      s += A.card(x, y, w, { c1, c2, rot: -6, big: n, num: `000${n}` });
      s += `<text x="${x}" y="${y + h / 2 + 76}" text-anchor="middle" font-family="Mont" font-weight="800" font-size="30" fill="#f5f1e8">${lab}</text>
        <text x="${x}" y="${y + h / 2 + 112}" text-anchor="middle" font-family="Mont" font-weight="600" font-size="24" fill="#9fb0dd">${sub}</text>`; });
    s += `<circle cx="1770" cy="250" r="230" fill="#ff2a3a" opacity=".25" filter="url(#b60)"/>` + A.card(1770, 250, 300, { c1: "#ff2a3a", c2: "#5a0010", rot: 14, big: "6", label: "???", blur: "b6" });
    s += A.title(80, 60, [{ t: "5 способов,", size: 84 }, { t: "где банк платит тебе", size: 84 }, { t: "и шестой — где платишь ты", size: 44, color: "#ff5d6c", font: "Mont", w: 800, ls: 0 }]);
    return s;
  };

  // ── 5. Способ 1: банк платит за то, что ты пришёл ───────────────────────────────────────────────────────────
  F[5] = () => {
    let s = `<linearGradient id="sky5" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#050912"/><stop offset="1" stop-color="#16294a"/></linearGradient>
      <linearGradient id="stone5" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3c4a6e"/><stop offset="1" stop-color="#7a86a8"/></linearGradient>
      <linearGradient id="col5" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#5b6890"/><stop offset=".45" stop-color="#b9c3df"/><stop offset="1" stop-color="#4a5678"/></linearGradient>
      <linearGradient id="spill5" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffcf87" stop-opacity=".75"/><stop offset="1" stop-color="#ffcf87" stop-opacity="0"/></linearGradient>
      <rect width="1920" height="1080" fill="url(#sky5)"/>${A.bokeh(8, 26, [0, 300, 1920, 700], ["#7fb6ff", "#ffcf87"], { blur: "b14", r0: 6, r1: 22 })}`;
    // здание банка (сдвинуто вправо): фронтон, колонны, свет из двери
    let b = `<path d="M430 300 L960 110 L1490 300Z" fill="#46557c"/><path d="M500 285 L960 130 L1420 285Z" fill="#33405f"/>
      <g filter="url(#glow)"><rect x="840" y="200" width="240" height="64" rx="10" fill="#0b1124"/><text x="960" y="248" text-anchor="middle" font-family="Unb" font-weight="900" font-size="42" fill="#ffd60a" letter-spacing=".12em">БАНК</text></g>
      <rect x="430" y="300" width="1060" height="44" fill="url(#stone5)"/><rect x="470" y="344" width="980" height="440" fill="#141c34"/>
      <path d="M860 470 h200 v314 h-200z" fill="#ffcf87"/><path d="M860 470 a100 100 0 0 1 200 0z" fill="#ffd9a0"/><rect x="860" y="470" width="200" height="314" fill="#fff3d6" opacity=".5" filter="url(#b14)"/>
      <circle cx="960" cy="640" r="320" fill="#ffb25c" opacity=".3" filter="url(#b60)"/>
      <g fill="#ffcf87" opacity=".55"><rect x="540" y="420" width="90" height="140" rx="45"/><rect x="1290" y="420" width="90" height="140" rx="45"/><rect x="540" y="600" width="90" height="130" rx="8"/><rect x="1290" y="600" width="90" height="130" rx="8"/></g>`;
    [500, 680, 1180, 1360].forEach(x => { b += `<rect x="${x}" y="344" width="60" height="440" fill="url(#col5)"/><rect x="${x - 10}" y="340" width="80" height="18" rx="4" fill="#9aa6c8"/><rect x="${x - 10}" y="770" width="80" height="18" rx="4" fill="#9aa6c8"/>`; });
    for (let k = 0; k < 6; k++) b += `<rect x="${400 - k * 60}" y="${784 + k * 30}" width="${1120 + k * 120}" height="30" fill="${k % 2 ? "#59658a" : "#66739a"}"/>`;
    b += `<path d="M860 784 L1060 784 L1300 964 L620 964Z" fill="url(#spill5)" opacity=".8"/>`;
    s += `<g transform="translate(180 0)">${b}</g><rect x="0" y="964" width="1920" height="116" fill="#0b1124"/>`;
    // монеты вылетают из двери к герою
    const pts = [[1140, 600], [1240, 520], [1340, 500], [1430, 540], [1500, 620]];
    s += `<path d="M1140 620 C1260 470 1420 470 1510 640" stroke="#ffd60a" stroke-width="5" stroke-dasharray="4 18" stroke-linecap="round" fill="none" opacity=".6"/>`;
    pts.forEach(([x, y], i) => { s += A.coin(x, y, 22 + i * 6, { rot: i * 14, sx: i % 2 ? .78 : 1, op: .55 + i * .11, blur: i < 2 ? "b2" : "" }); });
    // герой со спины поднимается по ступеням, рука тянется к монете
    s += A.person({ x: 1420, y: 920, s: 1.2, back: true, pose: { la: [[-62, -214], [-64, -150]], ra: [[70, -260], [92, -320]], ll: [[-22, -96], [-30, -6]], rl: [[24, -110], [30, -40]] } });
    s += A.pill(1440, 120, "+1 000–2 000 ₽", { size: 44, rot: -3 });
    s += A.note(1448, 200, "бонус новичку · пример, октябрь 2026", { size: 22 });
    s += `<path d="M0 560 Q420 640 640 1080 H0Z" fill="#03050b" opacity=".7" filter="url(#b60)"/>`;
    s += A.title(80, 640, [{ t: "Банк платит", size: 96 }, { t: "за то, что ты пришёл", size: 58, color: "#ffd60a" }]);
    s += A.chapter("СПОСОБ 1", "Бонус за карту", "0:45");
    return s + A.foot();
  };

  // ── 6. Правило трёх галочек: правила акции под лампой ───────────────────────────────────────────────────────
  F[6] = () => {
    let s = `<radialGradient id="desk6" cx="35%" cy="35%" r="80%"><stop offset="0" stop-color="#3a2a1e"/><stop offset=".6" stop-color="#1a120d"/><stop offset="1" stop-color="#0a0706"/></radialGradient>
      <rect width="1920" height="1080" fill="url(#desk6)"/><circle cx="560" cy="420" r="620" fill="#ffcf87" opacity=".16" filter="url(#b60)"/>
      `;
    // лист правил с мелким шрифтом
    let p = `<rect x="0" y="0" width="860" height="1040" rx="10" fill="#f3efe6"/><rect x="0" y="0" width="860" height="1040" rx="10" fill="url(#glass)" opacity=".4"/>
      <text x="60" y="100" font-family="Unb" font-weight="900" font-size="42" fill="#1a1d29">ПРАВИЛА АКЦИИ</text><text x="60" y="140" font-family="Mont" font-weight="600" font-size="22" fill="#7a7f90">для новых клиентов · пример</text>`;
    const rr = A.rnd(4); for (let k = 0; k < 26; k++) { const y = 190 + k * 30; if ([4, 5, 11, 12, 18, 19].includes(k)) continue; p += `<rect x="60" y="${y}" width="${520 + rr() * 220}" height="10" rx="5" fill="#c9c6bd"/>`; }
    [["Ты новый клиент банка", 300], ["Настоящая покупка, не перевод", 510], ["Карта — по странице акции", 720]].forEach(([t, y], i) => {
      p += `<path d="M120 ${y - 30} h${t.length * 19.5 + 20}" stroke="#ffd60a" stroke-width="44" stroke-linecap="round" opacity=".55"/>
        <rect x="60" y="${y - 58}" width="52" height="52" rx="10" fill="none" stroke="#1a1d29" stroke-width="5"/>
        <path d="M66 ${y - 34} l16 18 l34 -50" stroke="#18a957" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        <text x="132" y="${y - 18}" font-family="Mont" font-weight="800" font-size="36" fill="#1a1d29">${t}</text>`; });
    s += `<g transform="translate(230 175) rotate(-4) scale(.84)" filter="url(#soft)">${p}</g>`;
    // маркер и лупа
    s += `<g transform="translate(1010 900) rotate(-30)" filter="url(#soft)"><rect x="-30" y="-180" width="60" height="300" rx="20" fill="#ffd60a"/><rect x="-30" y="-180" width="60" height="90" rx="20" fill="#1a1d29"/><path d="M-20 120 h40 l-10 40 h-20z" fill="#e8c400"/></g>
      <g transform="translate(300 900) scale(.85)" filter="url(#soft)"><circle r="120" fill="#cfe7ff" opacity=".25"/><circle r="120" fill="none" stroke="#2a2f3f" stroke-width="22"/><path d="M84 84 l120 120" stroke="#2a2f3f" stroke-width="34" stroke-linecap="round"/><path d="M-70 -50 a90 90 0 0 1 60 -50" stroke="#fff" stroke-width="10" fill="none" opacity=".6" stroke-linecap="round"/></g>`;
    s += A.title(1130, 300, [{ t: "Правило", size: 80 }, { t: "трёх галочек", size: 80, color: "#ffd60a" }, { t: "все три — бонус придёт", size: 40, font: "Mont", w: 800, color: "#2ee07a", ls: 0 }]);
    s += A.note(1136, 610, "каждый банк платит так только один раз", { size: 26, color: "#c9b8a6" });
    s += A.chapter("СПОСОБ 1", "Бонус за карту", "2:50");
    return s + A.foot();
  };

  // ── 7. Способ 2: приведи друга — банк платит обоим ──────────────────────────────────────────────────────────
  F[7] = () => {
    let s = `<radialGradient id="bg7" cx="50%" cy="30%" r="85%"><stop offset="0" stop-color="#3b2a8a"/><stop offset=".55" stop-color="#16123d"/><stop offset="1" stop-color="#07061a"/></radialGradient>
      <rect width="1920" height="1080" fill="url(#bg7)"/>${A.bokeh(14, 34, [0, 0, 1920, 760], ["#8a5cf6", "#ffd60a", "#2ec4b6"], { blur: "b14", r0: 6, r1: 30 })}
      <ellipse cx="960" cy="960" rx="900" ry="120" fill="#000" opacity=".4" filter="url(#b30)"/><rect x="0" y="905" width="1920" height="175" fill="#0d0a26"/>`;
    // банк сверху — два потока монет вниз, к герою и к другу
    s += `<g transform="translate(960 250)" filter="url(#soft)"><path d="M-110 -10 L0 -70 L110 -10Z" fill="#ffd60a"/><rect x="-100" y="-10" width="200" height="16" fill="#ffd60a"/>
        ${[-70, -25, 25, 70].map(x => `<rect x="${x - 10}" y="10" width="20" height="80" fill="#ffe55c"/>`).join("")}<rect x="-110" y="92" width="220" height="18" rx="4" fill="#ffd60a"/></g>
      <circle cx="960" cy="260" r="200" fill="#ffd60a" opacity=".12" filter="url(#b60)"/>
      <path d="M900 380 C820 470 700 480 600 560" stroke="#ffd60a" stroke-width="5" stroke-dasharray="4 18" stroke-linecap="round" fill="none" opacity=".7"/>
      <path d="M1020 380 C1100 470 1220 480 1320 560" stroke="#c9b0ff" stroke-width="5" stroke-dasharray="4 18" stroke-linecap="round" fill="none" opacity=".7"/>`;
    [[860, 420], [760, 480], [660, 530]].forEach(([x, y], i) => { s += A.coin(x, y, 22 + i * 5, { rot: -10 * i, op: .6 + i * .18 }); });
    [[1060, 420], [1160, 480]].forEach(([x, y], i) => { s += A.coin(x, y, 20 + i * 5, { rot: 10 * i, op: .6 + i * .2 }); });
    // ссылка-самолётик от героя к другу
    s += `<path d="M640 640 C820 560 1100 560 1270 640" stroke="#fff" stroke-width="4" stroke-dasharray="2 16" stroke-linecap="round" fill="none" opacity=".55"/>
      <g transform="translate(1000 582) rotate(8)" filter="url(#soft)"><path d="M-56 0 L56 -26 L10 34 L0 8Z" fill="#fff"/><path d="M0 8 L56 -26 L10 34Z" fill="#cfd6ef"/><path d="M0 8 L10 34 L-6 20Z" fill="#a9b2d6"/></g>
      ${A.pill(1000, 680, "ссылка", { size: 26, bg: "#ffffff", fg: "#1a1d29", center: true })}`;
    s += A.person({ x: 520, y: 905, s: 1.2, phone: "ra", phoneScreen: "#ffd60a", pose: { la: [[-62, -214], [-58, -150]], ra: [[70, -228], [96, -262]], mouth: "smile", look: .4 } });
    s += A.person({ x: 1400, y: 905, s: 1.16, hair: "long", c: { top: "#8a5cf6", topD: "#6a3fd8", topL: "#c9b0ff", pants: "#2b2140", pantsD: "#211833", hair: "#5a3a22", skin: "#f3c9a4", skinD: "#dda57c" },
      pose: { la: [[-70, -250], [-96, -322]], ra: [[62, -214], [58, -150]], mouth: "open", look: -.4 } });
    s += A.pill(180, 250, "+1 000–1 800 ₽ тебе", { size: 38, rot: -3 }) + A.pill(1400, 250, "+≈500 ₽ другу", { size: 38, rot: 3, bg: "#c9b0ff", fg: "#1c1240" });
    s += A.title(960, 922, [{ t: "Приведи друга — банк платит обоим", size: 54, anchor: "middle" }]);
    s += A.note(960, 1046, "суммы персональные — смотри в приложении · 1000bankov, 28.09.2026", { anchor: "middle", size: 22 });
    s += A.chapter("СПОСОБ 2", "Бонус за друга", "3:10");
    return s;
  };

  // ── 8. Способ 3: банка с монетами на подоконнике — деньги лежат, процент капает ───────────────────────────
  F[8] = () => {
    let s = `<linearGradient id="night8" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#06122a"/><stop offset="1" stop-color="#0f2e4a"/></linearGradient>
      <linearGradient id="jar8" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#bfe9ff" stop-opacity=".35"/><stop offset=".25" stop-color="#bfe9ff" stop-opacity=".08"/><stop offset=".8" stop-color="#bfe9ff" stop-opacity=".05"/><stop offset="1" stop-color="#bfe9ff" stop-opacity=".3"/></linearGradient>
      <rect width="1920" height="1080" fill="url(#night8)"/>${A.bokeh(31, 60, [0, 0, 1920, 760], ["#ffcf87", "#7fb6ff", "#2ec4b6"], { blur: "b14", r0: 8, r1: 34 })}
      ${A.rain(13, 120, { ang: 6, blur: "b2" })}
      <rect x="0" y="0" width="70" height="1080" fill="#0b1626"/><rect x="1850" y="0" width="70" height="1080" fill="#0b1626"/>
      <rect x="0" y="830" width="1920" height="40" fill="#e9e4da"/><rect x="0" y="870" width="1920" height="210" fill="#141d2c"/>`;
    // банка: стекло, монеты внутри, монеты падают сверху
    const jx = 1180, jy = 830;
    let coins = ""; const r = A.rnd(8);
    for (let k = 0; k < 46; k++) { const row = Math.floor(k / 9), x = jx - 150 + (k % 9) * 37 + (row % 2) * 16 + r() * 8, y = jy - 26 - row * 26 - r() * 6;
      coins += `<ellipse cx="${x}" cy="${y}" rx="26" ry="11" fill="#c48f00"/><ellipse cx="${x}" cy="${y - 4}" rx="26" ry="11" fill="url(#coinG)"/>`; }
    s += `<ellipse cx="${jx}" cy="${jy + 4}" rx="220" ry="24" fill="#000" opacity=".5" filter="url(#b14)"/>
      <circle cx="${jx}" cy="${jy - 120}" r="260" fill="#ffd60a" opacity=".16" filter="url(#b60)"/>
      <clipPath id="jc8"><path d="M${jx - 190} ${jy - 330} q0 -30 30 -40 h320 q30 10 30 40 v300 q0 30 -40 30 h-300 q-40 0 -40 -30z"/></clipPath>
      <g clip-path="url(#jc8)">${coins}</g>
      <path d="M${jx - 190} ${jy - 330} q0 -30 30 -40 h320 q30 10 30 40 v300 q0 30 -40 30 h-300 q-40 0 -40 -30z" fill="url(#jar8)" stroke="#d8f1ff" stroke-opacity=".5" stroke-width="4"/>
      <rect x="${jx - 150}" y="${jy - 420}" width="300" height="50" rx="12" fill="#c9b37a"/><rect x="${jx - 150}" y="${jy - 420}" width="300" height="14" rx="7" fill="#e6d29a"/>
      <path d="M${jx - 160} ${jy - 300} v220" stroke="#fff" stroke-width="12" stroke-linecap="round" opacity=".35"/>`;
    [[jx - 40, 250, 34], [jx + 50, 120, 28], [jx - 10, 20, 22]].forEach(([x, y, rr], i) => { s += A.coin(x, y - rr * 1.6, rr, { sx: .85, rot: i * 20 - 10, op: .18, blur: "b6" }) + A.coin(x, y - rr * .8, rr, { sx: .85, rot: i * 20 - 10, op: .3, blur: "b2" }) + A.coin(x, y, rr, { sx: .85, rot: i * 20 - 10 }); });
    // ценник ставки на нитке, календарь, щит страховки
    s += `<path d="M${jx + 150} ${jy - 405} C${jx + 200} ${jy - 400} ${jx + 230} ${jy - 390} ${jx + 250} ${jy - 380}" stroke="#e9e4da" stroke-width="3" fill="none"/>
      <g transform="translate(${jx + 250} ${jy - 380}) rotate(10)" filter="url(#soft)"><path d="M0 0 l40 -50 h250 v170 h-250z" fill="#2ee07a"/><circle cx="34" cy="0" r="10" fill="#0f2e4a"/>
        <text x="168" y="16" text-anchor="middle" font-family="Unb" font-weight="900" font-size="50" fill="#06140b">15,5 %</text><text x="168" y="66" text-anchor="middle" font-family="Mont" font-weight="700" font-size="24" fill="#06140b">первые 3 мес</text></g>
      <g transform="translate(560 830)" filter="url(#soft)"><rect x="-150" y="-210" width="300" height="210" rx="16" fill="#f3efe6"/><rect x="-150" y="-210" width="300" height="56" rx="16" fill="#ff5d6c"/><rect x="-150" y="-170" width="300" height="16" fill="#ff5d6c"/>
        <text x="0" y="-168" text-anchor="middle" font-family="Mont" font-weight="800" font-size="26" fill="#fff">НАПОМНИТЬ</text><text x="0" y="-70" text-anchor="middle" font-family="Unb" font-weight="900" font-size="58" fill="#1a1d29">3 мес</text>
        <text x="0" y="-22" text-anchor="middle" font-family="Mont" font-weight="700" font-size="22" fill="#7a7f90">потом — в другой банк</text></g>
      <g transform="translate(1700 700)"><path d="M0 -70 l60 20 v40 c0 46 -30 74 -60 86 c-30 -12 -60 -40 -60 -86 v-40z" fill="#2ec4b6"/><path d="M-22 6 l16 16 l30 -34" stroke="#06140b" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>
      ${A.note(1700, 805, "АСВ: до 1,4 млн ₽", { anchor: "middle", size: 24, color: "#bfe9ff" })}`;
    s += `<path d="M0 0 H900 Q760 380 0 560Z" fill="#030812" opacity=".6" filter="url(#b60)"/>`;
    s += A.title(110, 140, [{ t: "Деньги лежат —", size: 80 }, { t: "банк платит", size: 80, color: "#2ee07a" }]);
    s += A.note(116, 400, "10 000 ₽ × 15,5 % × 3/12 ≈ 387 ₽ — пример, без капитализации", { size: 26, color: "#c9d3f2" });
    s += A.note(116, 440, "«Халва»: для впервые открывающих накопительный · Т—Ж, 30.09.2026", { size: 22 });
    s += A.chapter("СПОСОБ 3", "Накопительный счёт", "5:20").replace("translate(80 70)", "translate(110 50)");
    return s + A.foot();
  };

  // ── 9. Способ 4: касса — магазин платит банку, банк делится с тобой ─────────────────────────────────────────
  F[9] = () => {
    let s = `<linearGradient id="bg9" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a1a2a"/><stop offset="1" stop-color="#14304a"/></linearGradient>
      <rect width="1920" height="1080" fill="url(#bg9)"/>
      <g opacity=".5">${[0, 1, 2, 3, 4, 5].map(i => `<rect x="${80 + i * 300}" y="120" width="260" height="440" rx="10" fill="#0e2338"/>${[0, 1, 2, 3].map(k => `<rect x="${95 + i * 300}" y="${150 + k * 100}" width="230" height="70" rx="6" fill="${["#ff8a3d", "#2ec4b6", "#ffd60a", "#ff5d8f", "#4a8dff"][(i + k) % 5]}" opacity=".35"/>`).join("")}`).join("")}</g>
      <rect width="1920" height="600" fill="#0a1a2a" opacity=".55" filter="url(#b6)"/>
      <rect x="0" y="640" width="1920" height="440" fill="#1c2733"/><rect x="0" y="640" width="1920" height="18" fill="#2c3b4b"/>
      <rect x="0" y="700" width="900" height="120" rx="10" fill="#0d1218"/>${Array.from({ length: 18 }, (_, i) => `<rect x="${i * 52}" y="700" width="4" height="120" fill="#1e2630"/>`).join("")}`;
    // продукты на ленте
    s += `<g filter="url(#soft)"><path d="M140 700 q-10 -70 70 -90 q90 -10 110 50 q6 30 -10 40z" fill="#d9944a"/><path d="M170 660 l20 -30 M220 650 l20 -30 M270 650 l14 -26" stroke="#b36f2a" stroke-width="8" stroke-linecap="round"/>
      <rect x="380" y="560" width="110" height="140" rx="8" fill="#e8eef5"/><path d="M380 560 l55 -40 l55 40z" fill="#4a8dff"/><rect x="380" y="610" width="110" height="40" fill="#4a8dff"/>
      <circle cx="600" cy="660" r="44" fill="#ff4d4d"/><path d="M600 616 q6 -20 24 -24" stroke="#3f8a5a" stroke-width="7" fill="none" stroke-linecap="round"/><circle cx="680" cy="668" r="36" fill="#7bd88f"/></g>`;
    // терминал и рука с картой, волны бесконтакта
    s += `<g transform="translate(1250 700)" filter="url(#soft)"><rect x="-110" y="-60" width="220" height="80" rx="16" fill="#151b24"/><rect x="-90" y="-330" width="180" height="300" rx="26" fill="#1f2731"/>
        <rect x="-70" y="-306" width="140" height="120" rx="12" fill="#2ee07a"/><path d="M-22 -250 l18 18 l36 -40" stroke="#06140b" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        <text x="0" y="-150" text-anchor="middle" font-family="Mont" font-weight="800" font-size="22" fill="#cfe7d8">Оплачено</text>
        ${[0, 1, 2].map(i => `<circle cx="${-40 + (i % 3) * 40}" cy="-110" r="12" fill="#2c3644"/><circle cx="${-40 + (i % 3) * 40}" cy="-74" r="12" fill="#2c3644"/>`).join("")}</g>
      <g fill="none" stroke="#bfe9ff" stroke-width="7" stroke-linecap="round" opacity=".7"><path d="M1380 430 a60 60 0 0 1 0 80"/><path d="M1410 405 a95 95 0 0 1 0 130"/><path d="M1440 380 a130 130 0 0 1 0 180"/></g>
      <g transform="translate(1560 470) rotate(-18)">${A.limb([[260, 140], [150, 60]], 70, "#2ec4b6")}<circle cx="140" cy="58" r="40" fill="#f1c48f"/>
        ${A.card(60, 30, 230, { c1: "#4a8dff", c2: "#2338b8", num: "0004" }).replace('filter="url(#soft)"', "")}<rect x="96" y="20" width="70" height="34" rx="16" fill="#f1c48f"/></g>`;
    // монеты возвращаются из терминала к человеку
    s += `<path d="M1250 380 C1320 200 1520 180 1640 300" stroke="#ffd60a" stroke-width="5" stroke-dasharray="4 18" stroke-linecap="round" fill="none" opacity=".6"/>`;
    [[1290, 300], [1380, 220], [1480, 200], [1580, 240]].forEach(([x, y], i) => { s += A.coin(x, y, 20 + i * 5, { rot: i * 18, sx: i % 2 ? .8 : 1, op: .6 + i * .13 }); });
    s += A.pill(1660, 330, "+ кэшбэк", { size: 28, bg: "#2ee07a", center: true });
    s += A.pill(1440, 110, "Супермаркеты 5 %", { size: 30, bg: "#ffd60a", fg: "#1a1400" }) + A.pill(1530, 190, "Транспорт 7 %", { size: 30, bg: "#ffd60a", fg: "#1a1400" })
      + A.pill(1100, 120, "Всё остальное 1 %", { size: 26, bg: "rgba(255,255,255,.12)", fg: "#9fb0dd", noshadow: true });
    s += `<path d="M0 760 Q700 820 1000 1080 H0Z" fill="#05090f" opacity=".7" filter="url(#b60)"/>`;
    s += A.title(80, 820, [{ t: "Кэшбэк: магазин платит банку,", size: 54 }, { t: "банк делится с тобой", size: 54, color: "#ffd60a" }]);
    s += A.note(84, 1000, "еда 6 000 ₽ в месяц × 5 % = 300 ₽ — пример", { size: 24, color: "#c9d3f2" });
    s += A.chapter("СПОСОБ 4", "Кэшбэк", "7:40");
    return s;
  };

  // ── 10. Способ 5: кредитка как наживка на крючке ────────────────────────────────────────────────────────────
  F[10] = () => {
    let s = `<linearGradient id="sea10" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b4a5c"/><stop offset=".5" stop-color="#062634"/><stop offset="1" stop-color="#020a10"/></linearGradient>
      <rect width="1920" height="1080" fill="url(#sea10)"/>
      ${[[700, 360], [900, 300], [1150, 420], [1350, 260]].map(([x, w]) => `<path d="M${x} -20 l${w / 2} 0 l${w} 1100 l${-w * 1.2} 0z" fill="#7ff0e4" opacity=".05" filter="url(#b14)"/>`).join("")}
      ${A.bokeh(41, 50, [0, 200, 1920, 1080], ["#7ff0e4", "#2ec4b6"], { blur: "b6", r0: 3, r1: 12 })}
      <g fill="#021018" opacity=".7"><path d="M200 780 q60 -40 120 0 q-60 40 -120 0z M320 780 l30 -20 v40z"/><path d="M1600 640 q50 -34 100 0 q-50 34 -100 0z M1700 640 l26 -16 v32z"/><path d="M1460 900 q40 -26 80 0 q-40 26 -80 0z M1540 900 l20 -12 v24z"/></g>`;
    // леска, крючок, карта-наживка
    s += `<path d="M960 -10 V440" stroke="#d8f1ff" stroke-width="3" opacity=".8"/>

      <circle cx="960" cy="640" r="300" fill="#ff5d8f" opacity=".2" filter="url(#b60)"/>`;
    s += A.card(940, 700, 470, { c1: "#ff5d8f", c2: "#b0174a", rot: 10, num: "0005" });
    s += `<circle cx="972" cy="548" r="13" fill="#3a0a1a"/><path d="M960 430 v130 a40 40 0 0 1 -80 0 v-30" stroke="#dfe6f0" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M880 528 l-14 24 l28 -8z" fill="#dfe6f0"/><path d="M956 440 v100" stroke="#fff" stroke-width="3" opacity=".6"/>`;
    s += `<g fill="#bfe9ff" opacity=".6">${[[1120, 520, 10], [1150, 450, 7], [1130, 390, 5], [780, 600, 8], [760, 540, 5]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="#bfe9ff" stroke-width="2.5"/>`).join("")}</g>`;
    s += A.pill(200, 420, "100+ дней без процентов", { size: 34, bg: "#2ee07a" }) + A.note(206, 490, "если вернул всё до конца льготного периода", { size: 22, color: "#bfe9ff" });
    s += A.pill(1300, 520, "не вернул — ~50 % годовых", { size: 34, bg: "#ff3d4f", fg: "#fff" }) + A.note(1306, 590, "средняя ПСК по кредиткам ~48 % · ОКБ, 2026", { size: 22, color: "#ffc2c8" });
    s += `<path d="M0 760 Q600 800 900 1080 H0Z" fill="#010508" opacity=".7" filter="url(#b60)"/>`;
    s += A.title(80, 800, [{ t: "Кредитка", size: 96 }, { t: "самый денежный и самый опасный", size: 44, color: "#ff8fa0", font: "Mont", w: 800, ls: 0 }]);
    s += A.chapter("СПОСОБ 5", "Кредитка", "9:50");
    return s + A.foot();
  };

  // ── 11. Сборка: весы — бонусы за месяц против часов курьером ────────────────────────────────────────────────
  F[11] = () => {
    let s = `<radialGradient id="bg11" cx="50%" cy="35%" r="85%"><stop offset="0" stop-color="#1e2a5c"/><stop offset=".6" stop-color="#0a0f26"/><stop offset="1" stop-color="#04060f"/></radialGradient>
      <rect width="1920" height="1080" fill="url(#bg11)"/><circle cx="960" cy="380" r="420" fill="#ffd60a" opacity=".08" filter="url(#b60)"/>
      <rect x="0" y="930" width="1920" height="150" fill="#070a18"/><ellipse cx="960" cy="932" rx="400" ry="30" fill="#000" opacity=".5" filter="url(#b14)"/>`;
    // весы в равновесии
    s += `<g filter="url(#soft)"><path d="M860 930 h200 l-40 -50 h-120z" fill="#c9a24a"/><rect x="948" y="300" width="24" height="590" rx="10" fill="#e3bf5e"/><circle cx="960" cy="290" r="30" fill="#ffd60a"/>
        <rect x="460" y="282" width="1000" height="18" rx="9" fill="#e3bf5e"/>
        <path d="M500 300 L380 600 M500 300 L620 600 M1420 300 L1300 600 M1420 300 L1540 600" stroke="#c9a24a" stroke-width="5"/>
        <path d="M350 600 h300 a150 46 0 0 1 -300 0z" fill="#e3bf5e"/><path d="M1270 600 h300 a150 46 0 0 1 -300 0z" fill="#e3bf5e"/></g>`;
    // левая чаша: короб курьера и часы; правая: карты и монеты
    s += `<g transform="translate(500 600)"><g transform="rotate(-4)"><rect x="-110" y="-150" width="160" height="150" rx="14" fill="url(#boxG)"/><rect x="-110" y="-150" width="160" height="24" rx="10" fill="#fff07a"/><rect x="-60" y="-70" width="56" height="20" rx="5" fill="#c99a00" opacity=".6"/></g>
        <g transform="translate(90 -70)"><circle r="62" fill="#f3efe6"/><circle r="62" fill="none" stroke="#1a1d29" stroke-width="8"/><path d="M0 0 V-40 M0 0 L28 16" stroke="#1a1d29" stroke-width="8" stroke-linecap="round"/></g></g>`;
    s += A.card(1390, 560, 220, { c1: "#ffb000", c2: "#ff6a00", rot: -8 }) + A.card(1440, 530, 220, { c1: "#8a5cf6", c2: "#4b2bd1", rot: 6 });
    [[1330, 575], [1380, 585], [1470, 590], [1520, 578], [1420, 560]].forEach(([x, y], i) => { s += A.coin(x, y, 30, { sx: 1, rot: i * 20 }); });
    s += `<g filter="url(#glow)"><text x="960" y="560" text-anchor="middle" font-family="Unb" font-weight="900" font-size="120" fill="#ffd60a">=</text></g>`;
    s += A.title(500, 700, [{ t: "7–16 часов", size: 64, anchor: "middle" }, { t: "курьером пешком", size: 30, anchor: "middle", font: "Mont", w: 700, ls: 0, color: "#c9d3f2" }]);
    s += A.title(1420, 700, [{ t: "3 500–5 500 ₽", size: 64, anchor: "middle", color: "#2ee07a" }, { t: "от банков за первый месяц", size: 30, anchor: "middle", font: "Mont", w: 700, ls: 0, color: "#c9d3f2" }]);
    s += A.title(960, 60, [{ t: "План на первый месяц", size: 76, anchor: "middle" }]);
    s += A.note(960, 200, "пример, а не обещание: суммы у каждого банка свои и меняются каждый месяц", { anchor: "middle", size: 24 });
    s += A.chapter("СБОРКА", "План на месяц", "12:00").replace("translate(80 70)", "translate(80 880)");
    return s + A.foot();
  };

  // ── 12. Шестой способ: «оформи карту и передай нам» — и решётка ────────────────────────────────────────────
  F[12] = () => {
    let s = `<radialGradient id="bg12" cx="35%" cy="45%" r="85%"><stop offset="0" stop-color="#3a0a14"/><stop offset=".6" stop-color="#16040a"/><stop offset="1" stop-color="#070104"/></radialGradient>
      <rect width="1920" height="1080" fill="url(#bg12)"/><circle cx="640" cy="520" r="460" fill="#ff2a3a" opacity=".12" filter="url(#b60)"/>`;
    // телефон с перепиской
    let ph = `<rect x="-250" y="-470" width="500" height="940" rx="60" fill="#0b0d14"/><rect x="-230" y="-450" width="460" height="900" rx="46" fill="#151a26"/>
      <rect x="-230" y="-450" width="460" height="110" rx="46" fill="#1d2433"/><rect x="-230" y="-380" width="460" height="40" fill="#1d2433"/>
      <circle cx="-160" cy="-385" r="30" fill="#ff8a3d"/><text x="-160" y="-375" text-anchor="middle" font-family="Unb" font-weight="900" font-size="26" fill="#1a0d00">₽</text>
      <text x="-115" y="-392" font-family="Mont" font-weight="800" font-size="26" fill="#fff">Подработка | Карты</text><text x="-115" y="-360" font-family="Mont" font-weight="600" font-size="20" fill="#7f8bb0">был(а) недавно</text>`;
    const msg = (y, lines, w) => `<rect x="-205" y="${y}" width="${w}" height="${lines.length * 40 + 30}" rx="24" fill="#262e40"/>` + lines.map((t, i) => `<text x="-180" y="${y + 48 + i * 40}" font-family="Mont" font-weight="600" font-size="28" fill="#eef1fa">${t}</text>`).join("");
    ph += msg(-300, ["Привет! Есть подработка"], 360) + msg(-200, ["Оформи карту на себя", "и передай нам"], 380) + msg(-60, ["Платим десятки", "тысяч ₽ сразу"], 330);
    ph += `<rect x="-205" y="90" width="120" height="56" rx="24" fill="#262e40"/><g fill="#7f8bb0">${[0, 1, 2].map(i => `<circle cx="${-170 + i * 26}" cy="118" r="7"/>`).join("")}</g>
      <rect x="-210" y="370" width="420" height="60" rx="30" fill="#1d2433"/><text x="-180" y="408" font-family="Mont" font-weight="600" font-size="24" fill="#5c6788">Сообщение…</text>`;
    s += `<g transform="translate(620 540) rotate(-6)" filter="url(#soft)">${ph}</g>`;
    // тени решётки поверх кадра
    s += `<g opacity=".55" filter="url(#b14)">${Array.from({ length: 9 }, (_, i) => `<rect x="${980 + i * 110}" y="-40" width="34" height="1160" fill="#000"/>`).join("")}<rect x="960" y="300" width="1000" height="26" fill="#000"/></g>`;
    // штамп
    s += `<g transform="translate(1400 620) rotate(-12)" opacity=".95"><rect x="-330" y="-120" width="660" height="240" rx="22" fill="none" stroke="#ff3d4f" stroke-width="12"/><rect x="-310" y="-100" width="620" height="200" rx="14" fill="none" stroke="#ff3d4f" stroke-width="4"/>
        <text x="0" y="-12" text-anchor="middle" font-family="Unb" font-weight="900" font-size="86" fill="#ff3d4f" letter-spacing=".06em">ДРОППЕР</text>
        <text x="0" y="62" text-anchor="middle" font-family="Mont" font-weight="800" font-size="38" fill="#ff3d4f">ст. 187 УК РФ · до 3 лет</text></g>`;
    s += A.title(1020, 60, [{ t: "Шестой способ", size: 80 }, { t: "единственный, где платишь ты", size: 40, color: "#ff8fa0", font: "Mont", w: 800, ls: 0 }]);
    s += A.note(1026, 930, "176-ФЗ, в силе с 05.07.2025 · схемы с чужими картами — до 6 лет", { size: 24, color: "#ffc2c8" });
    return s;
  };

  window.FRAMES = F;
})();
