// Живые сцены глав 2–3 ролика №3: «приведи друга» (друзья, ссылка, сообщение) и «деньги лежат» (банка, ставка, переезд, телеграм).
(function () {
  const W = typeof window !== "undefined" ? window : global, SC = W.SCENES = W.SCENES || {}, A = () => W.A, H = () => W.SC_HELP;
  const cl = (x) => Math.max(0, Math.min(1, x)), lerp = (a, b, k) => a + (b - a) * k, out3 = (x) => 1 - Math.pow(1 - cl(x), 3), out5 = (x) => 1 - Math.pow(1 - cl(x), 5), bell = (x) => Math.sin(Math.PI * cl(x));
  const fmt = (v) => Math.round(v).toLocaleString("ru-RU").replace(/\s/g, " ");
  const ev = (d, map) => { const at = d.at || {}, E = {}; Object.entries(map).forEach(([snd, keys]) => keys.forEach(k => { if (at[k] != null) (E[snd] = E[snd] || []).push(at[k]); })); return E; };
  const purpleBg = (id) => `<radialGradient id="${id}" cx="50%" cy="30%" r="85%"><stop offset="0" stop-color="#3b2a8a"/><stop offset=".55" stop-color="#16123d"/><stop offset="1" stop-color="#07061a"/></radialGradient>
    <rect x="-1200" y="-800" width="4400" height="2800" fill="url(#${id})"/>${A().bokeh(14, 40, [-600, -200, 2600, 760], ["#8a5cf6", "#ffd60a", "#2ec4b6"], { blur: "b14", r0: 6, r1: 30 })}<rect x="-1200" y="905" width="4400" height="900" fill="#0d0a26"/>`;
  const FRIEND = { top: "#8a5cf6", topD: "#6a3fd8", topL: "#c9b0ff", pants: "#2b2140", pantsD: "#211833", hair: "#5a3a22", skin: "#f3c9a4", skinD: "#dda57c" };
  const bankIcon = (s = 1, col = "#ffd60a") => `<g transform="scale(${s})"><path d="M-110 -10 L0 -70 L110 -10Z" fill="${col}"/><rect x="-100" y="-10" width="200" height="16" fill="${col}"/>${[-70, -25, 25, 70].map(x => `<rect x="${x - 10}" y="10" width="20" height="80" fill="${col}" opacity=".85"/>`).join("")}<rect x="-110" y="92" width="220" height="18" rx="4" fill="${col}"/></g>`;
  const plane = (x, y, r = 8) => `<g transform="translate(${x.toFixed(0)} ${y.toFixed(0)}) rotate(${r})" filter="url(#soft)"><path d="M-56 0 L56 -26 L10 34 L0 8Z" fill="#fff"/><path d="M0 8 L56 -26 L10 34Z" fill="#cfd6ef"/></g>`;
  const walkPose = (t, mv = 1, o = {}) => { const sw = Math.sin(t * 7) * 14 * mv; return Object.assign({ ll: [[-22, -96 - Math.max(0, sw)], [-30, -6 - Math.max(0, sw) * 2]], rl: [[24, -96 - Math.max(0, -sw)], [30, -6 - Math.max(0, -sw) * 2]] }, o); };

  // ── 2а. Банк платит обоим: ссылка-самолётик, монеты обоим, суммы, «один раз» против «много раз», пять друзей ────
  SC.friends = {
    bg(d) { return purpleBg("bgFr"); },
    fg(t, d, h) { const a = A(), S = H(); let s = "";
      s += `<g transform="translate(960 250)">${bankIcon(1)}</g><circle cx="960" cy="260" r="${200 + 20 * Math.sin(t * 2)}" fill="#ffd60a" opacity=".12" filter="url(#b60)"/>`;
      // ряд банков «почти у всех крупных»
      for (let i = 0; i < 5; i++) s += S.POP({ ...h, at: (n) => h.at(n) + i * .1 }, "крупных", 560 + i * 200, 110, bankIcon(.32, "#c9b0ff"), { out: "ссылку" });
      // герой и друг
      const wave = h.on("обоим") ? Math.sin(t * 9) * 12 : 0;
      s += a.person({ x: 520, y: 905, s: 1.2, phone: "ra", phoneScreen: "#ffd60a", pose: { ra: [[70, -228], [96, -262]], mouth: h.on("обоим") ? "open" : "smile", eyes: S.blink(t), look: .4 } });
      s += a.person({ x: 1400, y: 905, s: 1.16, hair: "long", c: FRIEND, pose: { la: [[-70, -250], [-96 + wave, -322]], mouth: h.on("покупку") ? "open" : "smile", eyes: S.blink(t, 1.3), look: -.4 } });
      // самолётик: от телефона героя к другу
      if (h.on("ссылку")) { const k = out3(h.since("ссылку") / 1.1); if (k < 1) s += plane(lerp(640, 1290, k), lerp(600, 600, k) - 140 * bell(k), 8 - 20 * (k - .5));
        s += `<path d="M640 600 Q965 ${600 - 280} 1290 600" stroke="#fff" stroke-width="4" stroke-dasharray="2 16" stroke-linecap="round" fill="none" opacity="${(.5 * out3(h.since("ссылку") / .8)).toFixed(2)}"/>`; }
      s += S.POP(h, "оформляет", 1530, 520, a.card(0, 0, 160, { c1: "#8a5cf6", c2: "#4b2bd1", num: "0002" }), { float: 1 });
      s += S.POP(h, "покупку", 1270, 520, `<path d="M-40 -24 h80 l-10 64 h-60z" fill="#ff8a3d"/><path d="M-20 -24 v-12 a20 20 0 0 1 40 0 v12" stroke="#ff8a3d" stroke-width="7" fill="none"/>`, { float: 1 });
      // монеты от банка обоим
      if (h.on("обоим")) for (let i = 0; i < 3; i++) { s += S.coinFly(h, "обоим", 900, 360, 560, 440, 26, { delay: i * .18, d: .8, arc: 60 }); s += S.coinFly(h, "обоим", 1020, 360, 1380, 440, 24, { delay: i * .18 + .1, d: .8, arc: 60 }); }
      // один раз / много раз
      if (h.on("один")) s += S.POP(h, "один", 300, 330, a.coin(0, 0, 50) + `<text y="100" text-anchor="middle" font-family="Mont" font-weight="800" font-size="34" fill="#f5f1e8">1 раз</text>`, { out: "Пять" });
      if (h.on("много")) { const n = Math.min(6, 1 + Math.floor(h.since("много") * 6)); let st = ""; for (let i = 0; i < n; i++) st += a.coin(0, -i * 22, 46, { sx: 1 });
        s += S.POP(h, "много", 1640, 360, st + `<text y="100" text-anchor="middle" font-family="Mont" font-weight="800" font-size="34" fill="#f5f1e8">много раз</text>`, { out: "Пять" }); }
      return s; },
    hud(t, d, h) { const S = H(), a = A(); let s = "";
      s += S.POP(h, "тысячи", 430, 200, a.pill(-250, 0, "+1 000–1 800 ₽ тебе", { size: 38, rot: -3 }), { out: "лучше" }) + S.POP(h, "пятисот", 1560, 200, a.pill(-170, 0, "+≈500 ₽ другу", { size: 38, rot: 3, bg: "#c9b0ff", fg: "#1c1240" }), { out: "лучше" });
      s += S.T(h, "Точная", 960, 935, [{ t: "точная сумма — в приложении перед отправкой", size: 34, font: "Mont", w: 800, ls: 0, color: "#c9d3f2" }], { anchor: "middle", out: "лучше" });
      s += S.T(h, "лучше", 960, 935, [{ t: "Почему это лучше первого способа", size: 48 }], { anchor: "middle", out: "Пять" });
      s += S.T(h, "Пять", 960, 930, [{ t: "5 друзей — 5 выплат", size: 54, color: "#ffd60a" }], { anchor: "middle", out: "разница" });
      s += S.T(h, "разница", 960, 935, [{ t: "разовая тысяча → постоянный доход", size: 48 }], { anchor: "middle" });
      s += `<text x="960" y="1050" text-anchor="middle" font-family="Mont" font-weight="500" font-size="22" fill="#c9d3f2" opacity=".55">Суммы персональные · 1000bankov, 28.09.2026 · Не реклама конкретного банка</text>`;
      return s; },
    events(d) { const E = ev(d, { pop: ["крупных", "оформляет", "покупку", "тысячи", "пятисот", "один", "много"], whoosh: ["ссылку", "лучше"], coin: ["обоим"], chip: ["Точная"] }); return E; },
  };

  // ── 2б. Пять друзей: каждый получает свою первую карту, тебе капает за каждого ───────────────────────────────
  SC.crowd = {
    bg(d) { return purpleBg("bgCr"); },
    fg(t, d, h) { const a = A(), S = H(); let s = "";
      const F = [[300, "#ff8a3d", "друзья", "Друзья"], [650, "#2ec4b6", "однокурсники", "однокурсники"], [1270, "#4a8dff", "брат", "брат"], [1620, "#ff5d8f", "девушка", "девушка"], [960, "#8a5cf6", "", "Друзья"]];
      // герой в центре сзади, друзья вокруг выходят по словам
      F.forEach(([x, c, lab, key], i) => { const n = i === 4 ? "вопрос" : key; if (!h.on(n)) return; const k = h.U.back(h.since(n) / .5), happy = h.on("соглашаются") || h.on("заплатит");
        s += `<g transform="translate(${x} 905) scale(${Math.max(0, k).toFixed(3)})">${a.person({ s: i === 4 ? 1.15 : .9, hair: i % 2 ? "long" : undefined, c: i === 4 ? {} : { top: c, topD: c, topL: "#fff" }, phone: i === 4 ? "ra" : undefined, phoneScreen: "#ffd60a",
          pose: { la: happy && i !== 4 ? [[-70, -250], [-90, -320 + Math.sin(t * 8 + i) * 10]] : [[-62, -214], [-60, -150]], ra: i === 4 ? [[70, -228], [96, -262]] : [[62, -214], [60, -150]], mouth: happy ? "open" : "smile", eyes: S.blink(t, i), look: (960 - x) / 900 } })}</g>`;
        if (lab) s += `<text x="${x}" y="975" text-anchor="middle" font-family="Mont" font-weight="800" font-size="32" fill="#f5f1e8" opacity="${cl(h.since(n) / .3)}">${lab}</text>`;
        // карта каждому «банк сам заплатит»
        if (i < 4 && h.on("заплатит")) s += S.POP({ ...h, at: (q) => h.at(q) + i * .12 }, "заплатит", x, 470, a.card(0, 0, 130, { c1: c, c2: "#1a1d29", num: "000" + i }) + `<text y="-70" text-anchor="middle" font-family="Unb" font-weight="900" font-size="30" fill="#2ee07a">+бонус</text>`, { float: 1 }); });
      s += S.strike(h, "продаёшь", 760, 260, "продаёшь", { rot: -4 });
      s += S.POP(h, "делишься", 1180, 260, `<rect x="-170" y="-44" width="340" height="88" rx="44" fill="#2ee07a"/><text y="15" text-anchor="middle" font-family="Mont" font-weight="800" font-size="40" fill="#06140b">делишься</text>`, { rot: 3, out: "честно" });
      s += S.POP(h, "честно", 960, 260, `<rect x="-380" y="-50" width="760" height="100" rx="24" fill="#f5f1e8"/><text y="16" text-anchor="middle" font-family="Mont" font-weight="800" font-size="38" fill="#1a1d29">честно: «бонус получу и я»</text>`, { rot: -2 });
      return s; },
    hud(t, d, h) { const S = H(); return S.T(h, "вопрос", 960, 70, [{ t: "Где взять столько друзей?", size: 72 }], { anchor: "middle", out: "продаёшь" }) +
      S.T(h, "лучше", 960, 960, [{ t: "так честнее — и работает лучше", size: 40, font: "Mont", w: 800, ls: 0, color: "#2ee07a" }], { anchor: "middle" }); },
    events(d) { return ev(d, { pop: ["вопрос", "Друзья", "однокурсники", "брат", "девушка", "делишься", "честно"], coin: ["заплатит"], thud: ["продаёшь"] }); },
  };

  // ── 2в. Одно сообщение другу; без спама; напомни через неделю; без покупки — никому ───────────────────────────
  SC.chat = {
    bg(d) { return purpleBg("bgCh"); },
    fg(t, d, h) { const a = A(), S = H(); let s = "";
      // телефон крупно с перепиской: сообщение печатается
      const msg = ["Банк даёт тебе +500 ₽ сверху", "за карту по моей ссылке —", "мне тоже заплатят.", "Нужна одна покупка от 500 ₽", "в течение месяца."];
      let scr = `<rect width="460" height="900" fill="#151a26"/><rect width="460" height="110" fill="#1d2433"/><circle cx="60" cy="58" r="30" fill="#8a5cf6"/><text x="108" y="66" font-family="Mont" font-weight="800" font-size="28" fill="#fff">Лёша</text>`;
      if (h.on("сообщение")) { const ch = Math.floor(h.since("сообщение") * 26); let left = ch; let y = 190;
        scr += `<rect x="70" y="140" width="370" height="${msg.length * 40 + 40}" rx="24" fill="#2ec4b6"/>`;
        msg.forEach(L => { const sh = L.slice(0, Math.max(0, left)); left -= L.length; scr += `<text x="94" y="${y}" font-family="Mont" font-weight="600" font-size="22" fill="#06140b">${sh}</text>`; y += 40; });
        scr += `<text x="400" y="${140 + msg.length * 40 + 30}" text-anchor="end" font-family="Mont" font-size="18" fill="#06140b" opacity=".6">пример</text>`; }
      if (h.on("соглашаются")) scr += `<rect x="20" y="430" width="250" height="70" rx="22" fill="#262e40"/><text x="44" y="474" font-family="Mont" font-weight="600" font-size="26" fill="#eef1fa">Давай, кидай 👌</text>`.replace(" 👌", "!");
      if (h.on("напомни")) scr += `<rect x="70" y="530" width="370" height="70" rx="22" fill="#2ec4b6"/><text x="94" y="574" font-family="Mont" font-weight="600" font-size="25" fill="#06140b">Неделя прошла — купил?</text>`;
      s += `<g transform="translate(960 560) rotate(${(-3 + Math.sin(t * .7) * 1.2).toFixed(2)})" filter="url(#soft)"><rect x="-250" y="-470" width="500" height="940" rx="60" fill="#0b0d14"/><g transform="translate(-230 -450)"><clipPath id="chs"><rect width="460" height="900" rx="46"/></clipPath><g clip-path="url(#chs)">${scr}</g></g></g>`;
      // без спама: общий чат зачёркнут, «срочно» зачёркнуто
      s += S.POP(h, "спама", 360, 380, `<rect x="-170" y="-110" width="340" height="220" rx="26" fill="#1d2433"/><g fill="#7f8bb0">${[0, 1, 2, 3].map(i => `<rect x="-130" y="${-80 + i * 44}" width="${200 + (i % 2) * 60}" height="28" rx="14"/>`).join("")}</g>
        <text y="150" text-anchor="middle" font-family="Mont" font-weight="800" font-size="30" fill="#f5f1e8">спам в общих чатах</text><path d="M-150 -90 L150 90" stroke="#ff3d4f" stroke-width="14" stroke-linecap="round"/>`, { float: 1 });
      s += S.strike(h, "срочно", 1450, 380, "срочно, акция сгорает!", { rot: 4, size: 34 });
      // напоминание-колокольчик
      s += S.POP(h, "напомни", 1480, 760, `<g transform="rotate(${(Math.sin(t * 14) * 14 * Math.exp(-h.since("напомни") * .8)).toFixed(1)})"><path d="M-50 30 q0 -90 50 -90 q50 0 50 90 l14 18 h-128z" fill="#ffd60a"/><circle cy="62" r="14" fill="#ffd60a"/></g>
        <text y="140" text-anchor="middle" font-family="Mont" font-weight="800" font-size="32" fill="#f5f1e8">через неделю</text>`);
      // без покупки — никому: монеты гаснут
      if (h.on("никому")) { const k = cl(h.since("никому") / 1); s += `<g opacity="${(1 - k * .7).toFixed(2)}">${a.coin(300, 780, 50, { op: 1 - k })}${a.coin(420, 790, 40, { op: 1 - k })}</g><text x="360" y="900" text-anchor="middle" font-family="Unb" font-weight="900" font-size="54" fill="#ff5d6c" opacity="${k}">0 ₽ обоим</text>`; }
      return s; },
    hud(t, d, h) { const S = H(); return S.T(h, "сообщение", 80, 70, [{ t: "Одно сообщение", size: 70 }], { out: "спама" }) +
      S.T(h, "разовые", 960, 860, [{ t: "Но это разовые деньги…", size: 60 }], { anchor: "middle", out: "каждый" }) +
      S.T(h, "каждый", 960, 860, [{ t: "А теперь — банк платит каждый день", size: 60, color: "#2ee07a" }], { anchor: "middle" }); },
    events(d) { const at = d.at || {}, E = ev(d, { pop: ["спама", "напомни"], thud: ["срочно", "никому"], whoosh: ["разовые", "каждый"] }); if (at["сообщение"] != null) E.keys = [[at["сообщение"], at["сообщение"] + 4]]; return E; },
  };

  // ── 3а. Банка на подоконнике: проценты каждый день, ставка новичка 15,5 %, «почти 400 ₽», больше часа курьером ──
  SC.jar = {
    bg(d) { const a = A(); return `<linearGradient id="night8" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#06122a"/><stop offset="1" stop-color="#0f2e4a"/></linearGradient>
      <rect x="-800" y="-600" width="3520" height="2400" fill="url(#night8)"/>${a.bokeh(31, 70, [-600, -200, 2500, 760], ["#ffcf87", "#7fb6ff", "#2ec4b6"], { blur: "b14", r0: 8, r1: 34 })}
      <rect x="-800" y="830" width="3520" height="40" fill="#e9e4da"/><rect x="-800" y="870" width="3520" height="900" fill="#141d2c"/>`; },
    fg(t, d, h) { const a = A(), S = H(), jx = 1180, jy = 830; let s = S.rain(t, 13, 70, [-400, -100, 2400, 830], { ang: 6, v: 900, op: .6 });
      // уровень монет растёт со временем сцены; после «падает» — банка уезжает в соседний банк (в конце сцены «переезд»)
      const lvl = Math.min(46, 14 + Math.floor(t * 1.2)); let coins = "";
      for (let k = 0; k < lvl; k++) { const row = Math.floor(k / 9), x = jx - 150 + (k % 9) * 37 + (row % 2) * 16 + S.hash(k, 1) * 8, y = jy - 26 - row * 26 - S.hash(k, 2) * 6;
        coins += `<ellipse cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" rx="26" ry="11" fill="#c48f00"/><ellipse cx="${x.toFixed(0)}" cy="${(y - 4).toFixed(0)}" rx="26" ry="11" fill="url(#coinG)"/>`; }
      const jar = `<ellipse cx="${jx}" cy="${jy + 4}" rx="220" ry="24" fill="#000" opacity=".5" filter="url(#b14)"/><circle cx="${jx}" cy="${jy - 120}" r="260" fill="#ffd60a" opacity="${(.14 + .05 * Math.sin(t * 2)).toFixed(2)}" filter="url(#b60)"/>
        <clipPath id="jc8${d.idsfx || ""}"><path d="M${jx - 190} ${jy - 330} q0 -30 30 -40 h320 q30 10 30 40 v300 q0 30 -40 30 h-300 q-40 0 -40 -30z"/></clipPath><g clip-path="url(#jc8${d.idsfx || ""})">${coins}</g>
        <path d="M${jx - 190} ${jy - 330} q0 -30 30 -40 h320 q30 10 30 40 v300 q0 30 -40 30 h-300 q-40 0 -40 -30z" fill="#bfe9ff" fill-opacity=".1" stroke="#d8f1ff" stroke-opacity=".5" stroke-width="4"/>
        <rect x="${jx - 150}" y="${jy - 420}" width="300" height="50" rx="12" fill="#c9b37a"/><path d="M${jx - 160} ${jy - 300} v220" stroke="#fff" stroke-width="12" stroke-linecap="round" opacity=".35"/>`;
      s += jar;
      // капли-монеты «каждый день»
      for (let i = 0; i < 3; i++) { const T0 = 1.4, u = t + i * .47, k = (u % T0) / T0, x = jx - 60 + i * 60; if (k < .7) s += a.coin(x, lerp(-60, jy - 300, k / .7), 22, { sx: .8, rot: u * 200 }); }
      // ценник ставки
      if (h.on("пятнадцать")) { const sw = Math.sin(h.since("пятнадцать") * 5) * 12 * Math.exp(-h.since("пятнадцать")) , drop = h.on("падает") ? out3(h.since("падает") / .6) : 0;
        s += `<g transform="translate(${jx + 250} ${jy - 380 + drop * 60}) rotate(${(10 + sw + drop * 30).toFixed(1)})" filter="url(#soft)"><path d="M0 0 l40 -50 h250 v170 h-250z" fill="${drop ? "#ff8a3d" : "#2ee07a"}"/><circle cx="34" cy="0" r="10" fill="#0f2e4a"/>
          <text x="168" y="16" text-anchor="middle" font-family="Unb" font-weight="900" font-size="50" fill="#06140b">${drop ? "10 %" : "15,5 %"}</text><text x="168" y="66" text-anchor="middle" font-family="Mont" font-weight="700" font-size="24" fill="#06140b">${drop ? "потом" : "первые 3 мес"}</text></g>`; }
      // кошелёк: «снять в любой момент»
      s += S.POP(h, "Снять", 520, 640, `<rect x="-130" y="-80" width="260" height="160" rx="30" fill="#2ec4b6"/><rect x="40" y="-30" width="110" height="60" rx="20" fill="#1f9a8f"/><circle cx="80" cy="0" r="12" fill="#ffd60a"/><text y="140" text-anchor="middle" font-family="Mont" font-weight="800" font-size="30" fill="#bfe9ff">снять — в любой момент</text>`, { out: "правило" });
      // расчёт и часы курьера
      if (h.on("Десять")) { const v = lerp(0, 387, out3(h.since("Десять") / 2)); s += S.POP(h, "Десять", 520, 520, `<rect x="-300" y="-120" width="600" height="240" rx="30" fill="#141a2e" stroke="#2ee07a" stroke-width="3"/>
        <text y="-40" text-anchor="middle" font-family="Mont" font-weight="700" font-size="30" fill="#9fb0dd">10 000 ₽ × 15,5 % × 3/12</text><text y="60" text-anchor="middle" font-family="Unb" font-weight="900" font-size="80" fill="#2ee07a">≈ ${fmt(v)} ₽</text>`, { out: "смотри" }); }
      if (h.on("смотри")) s += S.POP(h, "смотри", 520, 560, `<circle r="110" fill="#f3efe6"/><circle r="110" fill="none" stroke="#1a1d29" stroke-width="12"/><path d="M0 0 V-70" stroke="#1a1d29" stroke-width="10" stroke-linecap="round" transform="rotate(${(h.since("смотри") * 200).toFixed(0)})"/>
        <g transform="translate(150 60) scale(.3)">${a.courierSide({ phase: t * 1.6 })}</g><text y="180" text-anchor="middle" font-family="Unb" font-weight="900" font-size="44" fill="#ffd60a">> 1 часа курьером</text>`);
      return s; },
    hud(t, d, h) { const S = H(); return `<path d="M0 0 H900 Q760 380 0 560Z" fill="#030812" opacity=".55" filter="url(#b60)"/>` +
      S.T(h, "накопительный", 90, 90, [{ t: "Накопительный счёт", size: 76 }, { t: "кошелёк, на который капают %", size: 40, font: "Mont", w: 800, ls: 0, color: "#2ee07a" }], { out: "правило" }) +
      S.T(h, "правило", 90, 90, [{ t: "Снова правило новичка", size: 70 }, { t: "повышенная ставка на 2–3 месяца", size: 40, font: "Mont", w: 800, ls: 0, color: "#2ee07a" }], { out: "Сколько" }) +
      S.T(h, "пятнадцать", 96, 330, [{ t: "пример: «Халва», впервые открывающим · Т—Ж, 30.09.2026", size: 24, font: "Mont", w: 600, ls: 0, color: "#9fb0dd" }], { out: "Сколько" }) +
      S.T(h, "Сколько", 90, 90, [{ t: "Сколько это в деньгах?", size: 70 }], { out: "смотри" }) +
      S.T(h, "смотри", 90, 90, [{ t: "Ты для этого", size: 70 }, { t: "ничего не делал", size: 70, color: "#2ee07a" }]) + A().foot(); },
    events(d) { return ev(d, { pop: ["накопительный", "Снять", "правило", "пятнадцать", "Десять", "смотри"], whoosh: ["падает"], coin: ["полежали"], ticks: [] }); },
  };

  // ── 3б. «У меня нет десяти тысяч»: 3 000 → ~40 ₽, привычка, бонусы из способов 1–2 стекаются сюда ──────────────
  SC.habit = {
    bg(d) { return SC.jar.bg(d); },
    fg(t, d, h) { const a = A(), S = H(); let s = SC.jar.fg(Math.min(t, 1.5), { at: {}, idsfx: "h" }, { ...h, on: () => false, at: () => 1e9, since: () => -1 });
      // голосовое-возражение
      if (!h.on("Нормально") || h.since("Нормально") < .6) { let wv = ""; for (let i = 0; i < 30; i++) wv += `<rect x="${130 + i * 16}" y="${-(8 + Math.abs(Math.sin(i * 1.3 + t * 6)) * 34)}" width="9" height="${(16 + Math.abs(Math.sin(i * 1.3 + t * 6)) * 68).toFixed(0)}" rx="4" fill="#ff8a3d"/>`;
        s += S.POP(h, "скажешь", 600, 380, `<rect x="0" y="-70" width="660" height="140" rx="70" fill="#1d2433"/><circle cx="70" cy="0" r="46" fill="#ff8a3d"/>${wv}<g transform="translate(0 130)"><rect width="660" height="90" rx="24" fill="#f5f1e8"/><text x="330" y="60" text-anchor="middle" font-family="Mont" font-weight="800" font-size="38" fill="#1a1d29">«У меня нет 10 000»</text></g>`, { out: "Нормально" }); }
      if (h.on("Нормально")) s += S.POP(h, "Нормально", 560, 520, `<rect x="-300" y="-110" width="600" height="220" rx="30" fill="#141a2e" stroke="#ffd60a" stroke-width="3"/><text y="-30" text-anchor="middle" font-family="Mont" font-weight="700" font-size="32" fill="#9fb0dd">с 3 000 ₽</text>
        <text y="60" text-anchor="middle" font-family="Unb" font-weight="900" font-size="72" fill="#ffd60a">≈ 40 ₽/мес</text>`, { out: "смысл" });
      // привычка: стрелка от карты к банке
      if (h.on("смысл")) { s += `<g transform="translate(420 600) rotate(-6)">${a.card(0, 0, 300, { c1: "#4a8dff", c2: "#2338b8", num: "0000" })}</g>`;
        const k = (h.since("смысл") % 1.4) / 1.4; s += a.coin(lerp(420, 1100, out3(k)), lerp(560, 450, k) - 160 * bell(k), 30, { rot: k * 400 });
        s += `<path d="M560 520 Q800 300 1000 470" stroke="#ffd60a" stroke-width="5" stroke-dasharray="4 16" fill="none" opacity=".6"/>`; }
      // бонусы из способов 1 и 2 летят в банку
      if (h.on("кстати")) [0, 1].forEach(i => { s += S.POP({ ...h, at: (n) => h.at(n) + i * .25 }, "кстати", 1650, 330 + i * 230, `<rect x="-150" y="-60" width="300" height="120" rx="24" fill="${i ? "#8a5cf6" : "#ff8a3d"}"/><text y="14" text-anchor="middle" font-family="Mont" font-weight="800" font-size="34" fill="#fff">способ ${i + 1}</text>`);
        s += S.coinFly({ ...h, at: (n) => h.at(n) + .5 + i * .3 }, "кстати", 1500, 330 + i * 230, 1180, 520, 28, { d: .8, vanish: true }); });
      return s; },
    hud(t, d, h) { const S = H(); return S.T(h, "смысл", 90, 80, [{ t: "Смысл — в привычке:", size: 64 }, { t: "деньги лежат там, где за них платят", size: 40, font: "Mont", w: 800, ls: 0, color: "#2ee07a" }]) + A().foot(); },
    events(d) { return ev(d, { notif: ["скажешь"], pop: ["Нормально", "смысл", "кстати"], coin: ["кстати"] }); },
  };

  // ── 3в. Переезд без хаоса: напоминание за неделю, банка переезжает в банк, где ты новичок; страховка АСВ ──────
  SC.move = {
    bg(d) { return `<radialGradient id="bgMv" cx="50%" cy="40%" r="85%"><stop offset="0" stop-color="#103a4a"/><stop offset="1" stop-color="#04121a"/></radialGradient><rect x="-800" y="-600" width="3520" height="2400" fill="url(#bgMv)"/>
      <rect x="-800" y="880" width="3520" height="900" fill="#082028"/>
      <g transform="translate(420 520)">${'<path d="M-160 -40 L0 -130 L160 -40Z" fill="#3c6e7a"/><rect x="-150" y="-40" width="300" height="300" fill="#24505c"/><rect x="-60" y="120" width="120" height="140" fill="#ffcf87" opacity=".7"/>'}<text y="-160" text-anchor="middle" font-family="Unb" font-weight="900" font-size="42" fill="#9fdbe6">БАНК А</text></g>
      <g transform="translate(1500 520)">${'<path d="M-160 -40 L0 -130 L160 -40Z" fill="#3c7a5c"/><rect x="-150" y="-40" width="300" height="300" fill="#245c44"/><rect x="-60" y="120" width="120" height="140" fill="#ffcf87"/>'}<text y="-160" text-anchor="middle" font-family="Unb" font-weight="900" font-size="42" fill="#9fe6bf">БАНК Б</text></g>`; },
    fg(t, d, h) { const a = A(), S = H(); let s = "";
      // календарь с напоминанием
      s += S.POP(h, "календарь", 960, 330, `<rect x="-200" y="-170" width="400" height="330" rx="22" fill="#f3efe6"/><rect x="-200" y="-170" width="400" height="70" rx="22" fill="#ff5d6c"/><rect x="-200" y="-120" width="400" height="20" fill="#ff5d6c"/>
        <text y="-120" text-anchor="middle" font-family="Mont" font-weight="800" font-size="30" fill="#fff">НАПОМНИТЬ</text><text y="10" text-anchor="middle" font-family="Mont" font-weight="800" font-size="34" fill="#1a1d29">за неделю до конца</text><text y="70" text-anchor="middle" font-family="Mont" font-weight="800" font-size="34" fill="#1a1d29">ставки новичка</text>
        ${h.on("сработало") ? `<g transform="rotate(${(Math.sin(t * 20) * 10 * Math.exp(-h.since("сработало"))).toFixed(1)} 0 -170)"><circle cx="170" cy="-170" r="40" fill="#ffd60a"/></g>` : ""}`, { out: "Пять" });
      // банка едет из банка А в банк Б
      const k = h.on("переводишь") ? h.io("переводишь", 1.6) : 0, x = lerp(420, 1500, k), y = 760 - 160 * bell(k);
      s += `<g transform="translate(${x.toFixed(0)} ${y.toFixed(0)}) scale(.5)"><path d="M-190 -330 q0 -30 30 -40 h320 q30 10 30 40 v300 q0 30 -40 30 h-300 q-40 0 -40 -30z" fill="#bfe9ff" fill-opacity=".14" stroke="#d8f1ff" stroke-width="5"/>${Array.from({ length: 5 }, (_, i) => `<ellipse cx="0" cy="${-40 - i * 40}" rx="140" ry="22" fill="url(#coinG)"/>`).join("")}<rect x="-150" y="-420" width="300" height="50" rx="12" fill="#c9b37a"/></g>`;
      if (k > 0) s += `<path d="M420 760 Q960 ${760 - 320} 1500 760" stroke="#ffd60a" stroke-width="5" stroke-dasharray="4 16" fill="none" opacity=".5"/>`;
      s += S.POP(h, "Пять", 960, 330, `<circle r="80" fill="#f3efe6"/><circle r="80" fill="none" stroke="#1a1d29" stroke-width="10"/><path d="M0 0 V-52" stroke="#1a1d29" stroke-width="9" stroke-linecap="round" transform="rotate(${(h.since("Пять") * 300).toFixed(0)})"/><text y="130" text-anchor="middle" font-family="Unb" font-weight="900" font-size="40" fill="#ffd60a">5 минут раз в 3 месяца</text>`, { out: "застрахованы" });
      s += S.POP(h, "застрахованы", 960, 360, `<path d="M0 -150 l130 44 v86 c0 100 -66 160 -130 186 c-64 -26 -130 -86 -130 -186 v-86z" fill="#2ec4b6"/><path d="M-48 14 l34 34 l64 -74" stroke="#06140b" stroke-width="18" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        <text y="230" text-anchor="middle" font-family="Unb" font-weight="900" font-size="46" fill="#bfe9ff">до 1,4 млн ₽ в одном банке</text>`);
      return s; },
    hud(t, d, h) { const S = H(); return S.T(h, "переезжать", 80, 70, [{ t: "Переезд без хаоса", size: 70 }], { out: "застрахованы" }) +
      S.T(h, "застрахованы", 80, 70, [{ t: "Застраховано государством (АСВ)", size: 60, color: "#2ec4b6" }]) + A().foot(); },
    events(d) { return ev(d, { pop: ["календарь", "Пять", "застрахованы"], notif: ["сработало"], whoosh: ["переводишь"], coin: [] }); },
  };

  // ── 3г. Телеграм-канал: «собираю акции и ставки», закреп «С чего начать», тизер «посчитаю в конце» ─────────────
  SC.tg = {
    bg(d) { return `<radialGradient id="bgTg" cx="50%" cy="40%" r="85%"><stop offset="0" stop-color="#1b4a7a"/><stop offset="1" stop-color="#061426"/></radialGradient><rect x="-800" y="-600" width="3520" height="2400" fill="url(#bgTg)"/>${A().bokeh(41, 30, [-400, 0, 2400, 1080], ["#2aa3e0", "#ffd60a"], { blur: "b30", r0: 20, r1: 60 })}`; },
    fg(t, d, h) { const a = A(), S = H(); let s = "";
      // телефон: канал, посты листаются, закреп; палец нажимает «Подписаться»
      let scr = `<rect width="460" height="900" fill="#0f1726"/><rect width="460" height="120" fill="#17212f"/><circle cx="64" cy="62" r="36" fill="#ffd60a"/><text x="64" y="76" text-anchor="middle" font-family="Unb" font-weight="900" font-size="36" fill="#1a1400">В</text>
        <text x="116" y="56" font-family="Mont" font-weight="800" font-size="28" fill="#fff">Владик Арбузит</text><text x="116" y="90" font-family="Mont" font-weight="600" font-size="20" fill="#7f8bb0">канал · бонусы банков</text>`;
      if (h.on("закреп")) scr += `<rect x="0" y="120" width="460" height="64" fill="#1d2a3a"/><text x="24" y="160" font-family="Mont" font-weight="800" font-size="24" fill="#ffd60a">📌 С ЧЕГО НАЧАТЬ</text>`.replace("📌 ", "");
      const off = (t * 40) % 220;
      for (let i = 0; i < 6; i++) { const y = 210 + i * 220 - off; scr += `<rect x="24" y="${y}" width="412" height="190" rx="22" fill="#1d2433"/><rect x="48" y="${y + 30}" width="260" height="22" rx="11" fill="#2aa3e0" opacity=".8"/>${[0, 1, 2].map(k => `<rect x="48" y="${y + 74 + k * 32}" width="${300 - k * 40}" height="16" rx="8" fill="#7f8bb0" opacity=".6"/>`).join("")}`; }
      scr += `<rect x="24" y="810" width="412" height="66" rx="33" fill="#2aa3e0"/><text x="230" y="852" text-anchor="middle" font-family="Mont" font-weight="800" font-size="28" fill="#fff">Подписаться</text>`;
      s += `<g transform="translate(1260 560) rotate(${(4 + Math.sin(t * .7)).toFixed(2)})" filter="url(#soft)"><rect x="-250" y="-470" width="500" height="940" rx="60" fill="#0b0d14"/><g transform="translate(-230 -450)"><clipPath id="tgs"><rect width="460" height="900" rx="46"/></clipPath><g clip-path="url(#tgs)">${scr}</g></g></g>`;
      if (h.on("ссылка")) { const k = h.since("ссылка"); s += `<circle cx="1270" cy="${(985).toFixed(0)}" r="${(20 + 30 * ((k * 1.5) % 1)).toFixed(0)}" fill="#fff" opacity="${(.5 * (1 - (k * 1.5) % 1)).toFixed(2)}"/>`; }
      // слева — карточки акций и ставок «летят в канал»
      [["ставки", "#2ee07a", "15,5 %"], ["акции", "#ff8a3d", "2 000 ₽"], ["кэшбэк", "#4a8dff", "5 %"]].forEach(([lab, c, v], i) => {
        s += S.POP({ ...h, at: (n) => h.at(n) + i * .2 }, "собираю", 520, 300 + i * 220, `<rect x="-200" y="-80" width="400" height="160" rx="26" fill="#141a2e" stroke="${c}" stroke-width="4"/><text x="-160" y="-10" font-family="Mont" font-weight="700" font-size="30" fill="#9fb0dd">${lab}</text><text x="-160" y="50" font-family="Unb" font-weight="900" font-size="50" fill="${c}">${v}</text>`, { float: 1, out: "Сколько" }); });
      // тизер: часы курьера и «?»
      s += S.POP(h, "Сколько", 520, 560, `<g transform="scale(.9)">${a.courierSide({ phase: t * 1.6 })}</g><text x="0" y="-460" text-anchor="middle" font-family="Unb" font-weight="900" font-size="80" fill="#ffd60a">? ч</text>`);
      return s; },
    hud(t, d, h) { const S = H(); return S.T(h, "собираю", 80, 60, [{ t: "Актуальные акции и ставки —", size: 52 }, { t: "в телеграме, ссылка в описании", size: 52, color: "#2aa3e0" }], { out: "Сколько" }) +
      S.T(h, "Сколько", 80, 60, [{ t: "Сколько это в часах подработки —", size: 52 }, { t: "посчитаю в конце", size: 52, color: "#ffd60a" }], { out: "пока" }) +
      S.T(h, "пока", 80, 60, [{ t: "А пока — способ, на котором", size: 52 }, { t: "ты теряешь деньги каждый день", size: 52, color: "#ff8fa0" }]); },
    events(d) { return ev(d, { notif: ["Кстати"], pop: ["собираю", "закреп", "Сколько"], click: ["ссылка"], whoosh: ["пока"] }); },
  };
})();
