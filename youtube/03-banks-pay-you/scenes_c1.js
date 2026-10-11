// Живые сцены главы 1 ролика №3 (способ 1 — бонус за карту): телефон с акцией, плата за обслуживание, «бонус не пришёл» —
// четыре причины, правило трёх галочек. Помощники — W.SC_HELP из scenes.js.
(function () {
  const W = typeof window !== "undefined" ? window : global, SC = W.SCENES = W.SCENES || {}, A = () => W.A;
  const H = () => W.SC_HELP;
  const cl = (x) => Math.max(0, Math.min(1, x)), lerp = (a, b, k) => a + (b - a) * k, out3 = (x) => 1 - Math.pow(1 - cl(x), 3), out5 = (x) => 1 - Math.pow(1 - cl(x), 5), bell = (x) => Math.sin(Math.PI * cl(x));
  const nightBg = (id, c1, c2, extra = "") => `<radialGradient id="${id}" cx="50%" cy="40%" r="85%"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></radialGradient><rect x="-1200" y="-800" width="4400" height="2800" fill="url(#${id})"/>${extra}`;
  const ev = (d, map) => { const at = d.at || {}, E = {}; Object.entries(map).forEach(([snd, keys]) => keys.forEach(k => { if (at[k] != null) (E[snd] = E[snd] || []).push(at[k]); })); return E; };

  // телефон в руке: рамка, экран (inner — содержимое 360×740 с началом в левом верхнем углу экрана)
  const phone = (x, y, s, inner, o = {}) => `<g transform="translate(${x} ${y}) scale(${s}) rotate(${o.rot || 0})" filter="url(#soft)">
    <path d="M-60 520 C-80 420 -40 380 20 360 L120 340 C180 330 230 380 220 460 L200 640 L-40 640Z" fill="#f1c48f"/>
    <rect x="-200" y="-400" width="400" height="800" rx="56" fill="#0b0d14"/><rect x="-182" y="-382" width="364" height="764" rx="42" fill="#f4f6fb"/>
    <clipPath id="scr${o.id || 0}"><rect x="-182" y="-382" width="364" height="764" rx="42"/></clipPath><g clip-path="url(#scr${o.id || 0})"><g transform="translate(-182 -382)">${inner}</g></g>
    <rect x="-50" y="-372" width="100" height="22" rx="11" fill="#0b0d14"/>
    <path d="M-120 520 C-140 470 -110 430 -60 440 L60 470 C90 480 90 520 60 530Z" fill="#e8b47e"/></g>`;
  const tap = (h, name, x, y) => { if (!h.on(name) || h.since(name) > .6) return ""; const k = h.since(name) / .6; return `<circle cx="${x}" cy="${y}" r="${18 + 40 * k}" fill="#2aa3e0" opacity="${(.5 * (1 - k)).toFixed(2)}"/>`; };

  // ── 1а. Как это выглядит: акция в приложении → карта → покупка → бонус; где искать; правила акции; две минуты ──
  SC.app = {
    bg(d) { return nightBg("bgApp", "#1f2a5c", "#060814", A().bokeh(21, 30, [-400, 0, 2600, 1080], ["#2ec4b6", "#ffd60a", "#8a5cf6"], { blur: "b30", r0: 20, r1: 60 })); },
    fg(t, d, h) { const a = A(), S = H(); let s = "";
      // экран приложения: список акций едет, одна карточка подсвечена; после «оформляешь» — экран карты; после «недель» — пуш
      const sc = h.on("недель") ? 2 : h.on("оформляешь") ? 1 : 0;
      let scr = `<rect width="364" height="764" fill="#f4f6fb"/><rect width="364" height="90" fill="#1f6bff"/><text x="24" y="62" font-family="Mont" font-weight="800" font-size="30" fill="#fff">${sc === 0 ? "Акции" : "Мои карты"}</text>`;
      if (sc === 0) { const off = -Math.min(1, h.since("находишь") / 1.2) * 120 * (h.on("находишь") ? 1 : 0);
        ["Кэшбэк 5 % на кафе", "Новым клиентам — 2 000 ₽", "Подписка −50 %", "Ставка 15 %", "Переводы без комиссии"].forEach((txt, i) => { const y = 120 + i * 130 + off, hl = i === 1;
          scr += `<rect x="20" y="${y}" width="324" height="110" rx="18" fill="${hl ? "#ffd60a" : "#fff"}" stroke="${hl ? "#e0b800" : "#e3e6ef"}" stroke-width="2"/><text x="40" y="${y + 48}" font-family="Mont" font-weight="800" font-size="${hl ? 21 : 22}" fill="#1a1d29">${txt}</text>
            <text x="40" y="${y + 82}" font-family="Mont" font-weight="600" font-size="18" fill="#7a7f90">${hl ? "за покупку · пример" : "подробнее"}</text>`; });
        scr += `<rect x="20" y="660" width="324" height="70" rx="35" fill="#1f6bff" opacity="${h.on("находишь") ? 1 : 0}"/><text x="182" y="704" text-anchor="middle" font-family="Mont" font-weight="800" font-size="24" fill="#fff" opacity="${h.on("находишь") ? 1 : 0}">Оформить карту</text>`; }
      else { scr += `<g transform="translate(182 260)">${a.card(0, 0, 300, { c1: "#ffb000", c2: "#ff6a00", num: "2026" }).replace('filter="url(#soft)"', "")}</g>
          <text x="182" y="430" text-anchor="middle" font-family="Mont" font-weight="800" font-size="26" fill="#1a1d29">Карта без кредита</text><text x="182" y="466" text-anchor="middle" font-family="Mont" font-weight="600" font-size="20" fill="#2ee07a">обслуживание 0 ₽</text>`;
        if (sc === 2) { const k = out5(h.since("недель") / .5); scr += `<g transform="translate(0 ${(-120 + 140 * k).toFixed(0)})"><rect x="14" y="0" width="336" height="100" rx="22" fill="#141a2e"/><circle cx="58" cy="50" r="26" fill="#2ee07a"/><text x="58" y="60" text-anchor="middle" font-family="Unb" font-weight="900" font-size="26" fill="#06140b">₽</text>
          <text x="96" y="42" font-family="Mont" font-weight="600" font-size="18" fill="#9fb0dd">Банк · сейчас</text><text x="96" y="74" font-family="Mont" font-weight="800" font-size="24" fill="#fff">+2 000 ₽ бонус</text></g>`; } }
      s += phone(560, 560, 1.05, scr + tap(h, "оформляешь", 182, 695), { id: 1, rot: -4 + Math.sin(t * .8) * 1.5 });
      // покупки: хлеб, кроссовки, подписка — справа, по словам
      const item = (n, x, y, svg) => S.POP(h, n, x, y, `<circle r="92" fill="#fff" opacity=".08"/>${svg}`, { float: 1, out: "недель" });
      s += item("Хлеб", 1180, 380, `<path d="M-70 30 q-14 -80 70 -90 q84 10 70 90z" fill="#d9944a"/><path d="M-30 -20 l16 -26 M10 -30 l16 -26 M44 -20 l14 -22" stroke="#b36f2a" stroke-width="8" stroke-linecap="round"/>`);
      s += item("кроссовки", 1460, 380, `<path d="M-80 30 q0 -60 40 -60 q20 30 60 30 q40 0 60 20 v10z" fill="#f5f1e8"/><path d="M-80 30 h160 v14 h-160z" fill="#ff5d6c"/><path d="M-30 -14 l20 14 M-10 -22 l20 14" stroke="#4a8dff" stroke-width="6"/>`);
      s += item("подписка", 1740, 380, `<rect x="-62" y="-50" width="124" height="100" rx="20" fill="#8a5cf6"/><path d="M-14 -22 l40 22 l-40 22z" fill="#fff"/>`);
      if (h.on("покупка") && !h.on("недель")) s += S.POP(h, "покупка", 1460, 560, `<rect x="-170" y="-40" width="340" height="80" rx="40" fill="#2ee07a"/><text y="14" text-anchor="middle" font-family="Mont" font-weight="800" font-size="36" fill="#06140b">это покупка ✓</text>`);
      // календарь листает 2 недели
      if (h.on("недель") && !h.on("искать")) { const day = Math.min(14, 1 + Math.floor(h.since("недель") * 10));
        s += S.POP(h, "недель", 1400, 520, `<rect x="-130" y="-150" width="260" height="240" rx="18" fill="#f3efe6"/><rect x="-130" y="-150" width="260" height="60" rx="18" fill="#2ec4b6"/><rect x="-130" y="-110" width="260" height="20" fill="#2ec4b6"/>
          <text y="-108" text-anchor="middle" font-family="Mont" font-weight="800" font-size="28" fill="#06140b">ДЕНЬ</text><text y="40" text-anchor="middle" font-family="Unb" font-weight="900" font-size="110" fill="#1a1d29">${day}</text>`); }
      // где искать: три источника
      [["сайте", "сайт банка", "#1f6bff", 0], ["агрегаторы", "агрегаторы", "#ff8a3d", 1], ["телеграм", "телеграм-каналы", "#2aa3e0", 2]].forEach(([n, lab, c, i]) => {
        s += S.POP(h, n, 1180 + i * 290, 420, `<rect x="-130" y="-110" width="260" height="220" rx="26" fill="#141a2e" stroke="${c}" stroke-width="4"/><circle cy="-30" r="44" fill="${c}"/>
          <text y="80" text-anchor="middle" font-family="Mont" font-weight="800" font-size="28" fill="#fff">${lab}</text>`, { float: 1, out: "правила" }); });
      // правила акции: три подсветки
      if (h.on("правила")) { const k = out5(h.since("правила") / .6);
        let p = `<rect width="620" height="700" rx="12" fill="#f3efe6"/><text x="44" y="80" font-family="Unb" font-weight="900" font-size="36" fill="#1a1d29">ПРАВИЛА АКЦИИ</text>`;
        for (let i = 0; i < 16; i++) p += `<rect x="44" y="${130 + i * 34}" width="${360 + (i * 37) % 160}" height="10" rx="5" fill="#c9c6bd"/>`;
        [["сумму", "сумма покупки — от 500 ₽", 196], ["срок", "срок — 30 дней", 366], ["новым", "кто считается новым клиентом", 536]].forEach(([n, txt, y]) => { const kk = out3(h.since(n) / .4) * (h.on(n) ? 1 : 0);
          p += `<rect x="36" y="${y - 30}" width="${548 * kk}" height="44" rx="10" fill="#ffd60a" opacity=".6"/>${kk > 0 ? `<text x="52" y="${y + 2}" font-family="Mont" font-weight="800" font-size="27" fill="#1a1d29">${txt}</text>` : ""}`; });
        s += `<g transform="translate(${lerp(2100, 1150, k)} 200) rotate(-3)" filter="url(#soft)">${p}</g>`; }
      if (h.on("две")) s += S.POP(h, "две", 1700, 900, `<circle r="70" fill="#f5f1e8"/><circle r="70" fill="none" stroke="#1a1d29" stroke-width="8"/><path d="M0 0 V-46" stroke="#1a1d29" stroke-width="8" stroke-linecap="round" transform="rotate(${(h.since("две") * 180).toFixed(0)})"/><text y="120" text-anchor="middle" font-family="Unb" font-weight="900" font-size="40" fill="#ffd60a">2 минуты</text>`);
      return s; },
    hud(t, d, h) { const S = H();
      return S.T(h, "пятисот", 1080, 640, [{ t: "покупка 500–3 000 ₽", size: 54, color: "#ffd60a" }], { out: "недель" }) +
        S.T(h, "искать", 1080, 120, [{ t: "Где искать акции", size: 64 }], { out: "правила" }) +
        S.T(h, "Важно", 1080, 900, [{ t: "открой правила акции", size: 44, color: "#ffd60a", font: "Mont", w: 800, ls: 0 }], { out: "две" }) +
        S.T(h, "решают", 980, 960, [{ t: "решают, придут ли деньги", size: 44, color: "#2ee07a", font: "Mont", w: 800, ls: 0 }]) + A().foot(); },
    events(d) { return ev(d, { click: ["оформляешь"], pop: ["Хлеб", "кроссовки", "подписка", "покупка", "сайте", "агрегаторы", "телеграм", "две"], notif: ["недель"], paper: ["правила"], pen: [], chip: ["сумму", "срок", "новым"] }); },
  };

  // ── 1б. Обслуживание: карта за 200 ₽/мес съедает бонус за полгода ──────────────────────────────────────────
  SC.fee = {
    bg(d) { return nightBg("bgFee", "#2a1430", "#0a0610"); },
    fg(t, d, h) { const a = A(), S = H(); let s = "";
      // банка с бонусом слева, карта-«едок» справа; каждый «месяц» монета уходит из банки в карту
      const months = h.on("двести") ? Math.min(6, Math.floor(h.since("двести") * 2.2)) : 0, left = 1200 - months * 200;
      s += `<g transform="translate(620 600)"><ellipse cy="250" rx="220" ry="26" fill="#000" opacity=".4" filter="url(#b14)"/>
        <path d="M-180 -200 q0 -30 30 -40 h300 q30 10 30 40 v400 q0 30 -40 30 h-280 q-40 0 -40 -30z" fill="#bfe9ff" opacity=".12" stroke="#d8f1ff" stroke-opacity=".5" stroke-width="4"/>
        ${Array.from({ length: 6 - months }, (_, i) => `<g transform="translate(0 ${200 - i * 50})">${a.coin(0, 0, 46, { sx: 1 })}</g>`).join("")}
        <text y="-280" text-anchor="middle" font-family="Unb" font-weight="900" font-size="60" fill="${months >= 6 ? "#ff3d4f" : "#2ee07a"}">${months >= 6 ? "0 ₽" : `${left.toLocaleString("ru-RU").replace(/\s/g, " ")} ₽`}</text>
        <text y="-220" text-anchor="middle" font-family="Mont" font-weight="700" font-size="28" fill="#c9b8d6">твой бонус</text></g>`;
      if (h.on("двести")) { const k = (h.since("двести") * 2.2) % 1; if (months < 6) s += a.coin(lerp(620, 1300, out3(k)), lerp(500, 520, k) - 160 * bell(k), 34, { rot: k * 360 }); }
      // карта с «ртом»
      const chew = h.on("двести") && months < 6 ? Math.abs(Math.sin(t * 8)) : 0;
      s += `<g transform="translate(1320 560) rotate(${(Math.sin(t * 1.5) * 4).toFixed(1)})">${a.card(0, 0, 420, { c1: "#ff5d8f", c2: "#8a1340", num: "0200" })}
        <circle cx="-70" cy="-30" r="18" fill="#fff"/><circle cx="70" cy="-30" r="18" fill="#fff"/><circle cx="-64" cy="-26" r="8" fill="#1a1d29"/><circle cx="76" cy="-26" r="8" fill="#1a1d29"/>
        <path d="M-60 ${40 - chew * 10} q60 ${20 + chew * 30} 120 0" stroke="#1a1d29" stroke-width="10" fill="${chew > .3 ? "#3a0a14" : "none"}" stroke-linecap="round"/></g>`;
      s += S.POP(h, "бесплатное", 1320, 260, `<rect x="-240" y="-46" width="480" height="92" rx="46" fill="#f5f1e8"/><text y="16" text-anchor="middle" font-family="Mont" font-weight="800" font-size="40" fill="#1a1d29">обслуживание 0 ₽?</text>`, { rot: 4, out: "двести" });
      s += S.POP(h, "двести", 1320, 860, `<rect x="-160" y="-44" width="320" height="88" rx="44" fill="#ff3d4f"/><text y="16" text-anchor="middle" font-family="Unb" font-weight="900" font-size="42" fill="#fff">200 ₽/мес</text>`);
      if (h.on("двести")) s += `<text x="1320" y="960" text-anchor="middle" font-family="Mont" font-weight="800" font-size="34" fill="#c9b8d6">месяц ${Math.max(1, months)} из 6</text>`;
      return s; },
    hud(t, d, h) { const S = H(); return S.T(h, "съест", 80, 70, [{ t: "За полгода съест", size: 76 }, { t: "весь бонус", size: 76, color: "#ff5d6c" }], { out: "заплатил" }) +
      S.T(h, "заплатил", 80, 70, [{ t: "Это ты заплатил банку,", size: 70 }, { t: "а не он тебе", size: 70, color: "#ff5d6c" }]) + A().foot(); },
    events(d) { const at = d.at || {}, E = ev(d, { pop: ["бесплатное", "двести"], thud: ["заплатил"] }); if (at["двести"] != null) { E.coin = []; for (let i = 0; i < 6; i++) E.coin.push(at["двести"] + (i + .5) / 2.2); } return E; },
  };

  // ── 1в. «Это развод» — голосовое, потом 4 причины (кадр 2×2, камера заходит в каждую) ───────────────────────
  SC.reasons = {
    bg(d) { const a = A(); let s = nightBg("bgRs", "#16203f", "#05070f");
      // 4 панели в мире 3840×2160: (0,0) (1920,0) (0,1080) (1920,1080), у каждой рамка и номер
      [[0, 0, "#ff8a3d"], [1920, 0, "#4a8dff"], [0, 1080, "#8a5cf6"], [1920, 1080, "#ff5d6c"]].forEach(([x, y, c], i) => {
        s += `<g transform="translate(${x} ${y})"><rect x="40" y="40" width="1840" height="1000" rx="40" fill="#0d1330" stroke="${c}" stroke-width="6"/><circle cx="150" cy="150" r="70" fill="${c}"/><text x="150" y="180" text-anchor="middle" font-family="Unb" font-weight="900" font-size="84" fill="#0b0f1c">${i + 1}</text></g>`; });
      // 1: окно банка, сотрудник за стойкой
      s += `<g transform="translate(0 0)"><rect x="560" y="260" width="900" height="560" rx="20" fill="#1c2750"/><rect x="600" y="300" width="820" height="320" rx="14" fill="#2a3a70"/><rect x="560" y="740" width="900" height="80" fill="#3a4580"/>
        <g transform="translate(1010 760) scale(.9)">${a.person({ c: { top: "#1f6bff", topD: "#1650c0", topL: "#9fc0ff", hair: "#3a2414" }, pose: { la: [[-60, -220], [-40, -170]], ra: [[60, -220], [40, -170]], mouth: "flat" }, noShadow: true })}</g></g>`;
      // 2: терминал и перевод
      s += `<g transform="translate(1920 0)"><g transform="translate(1250 760)"><rect x="-110" y="-60" width="220" height="80" rx="16" fill="#151b24"/><rect x="-90" y="-330" width="180" height="300" rx="26" fill="#1f2731"/><rect x="-70" y="-306" width="140" height="120" rx="12" fill="#ff3d4f"/>
        <path d="M-30 -276 l60 60 M30 -276 l-60 60" stroke="#fff" stroke-width="12" stroke-linecap="round"/></g></g>`;
      // 3: две двери
      s += `<g transform="translate(0 1080)"><rect x="420" y="300" width="420" height="600" rx="20" fill="#2a2f45"/><rect x="460" y="340" width="340" height="560" rx="12" fill="#3a3f5a"/><text x="630" y="270" text-anchor="middle" font-family="Mont" font-weight="800" font-size="40" fill="#9fb0dd">просто приложение</text>
        <rect x="1080" y="300" width="420" height="600" rx="20" fill="#2ee07a"/><rect x="1120" y="340" width="340" height="560" rx="12" fill="#ffd9a0"/><circle cx="1290" cy="600" r="280" fill="#ffd9a0" opacity=".25" filter="url(#b60)"/><text x="1290" y="270" text-anchor="middle" font-family="Mont" font-weight="800" font-size="40" fill="#2ee07a">страница акции</text></g>`;
      // 4: ящик стола
      s += `<g transform="translate(1920 1080)"><rect x="400" y="560" width="1100" height="380" rx="20" fill="#5e3c27"/><rect x="460" y="620" width="980" height="260" rx="14" fill="#4a2f1e"/><rect x="860" y="730" width="180" height="30" rx="15" fill="#c9a24a"/></g>`;
      return s; },
    fg(t, d, h) { const a = A(), S = H(); let s = "";
      // голосовое сообщение до «трёх»
      if (!h.on("трёх") || h.since("трёх") < .8) { const o = h.on("трёх") ? 1 - h.since("трёх") / .8 : 1;
        let wav = ""; for (let i = 0; i < 40; i++) { const hh = 10 + Math.abs(Math.sin(i * 1.7 + t * 6)) * 50 * (h.since("половина") < 3 ? 1 : .3); wav += `<rect x="${200 + i * 16}" y="${-hh / 2}" width="9" height="${hh.toFixed(0)}" rx="4" fill="#2aa3e0"/>`; }
        s += `<g transform="translate(1920 1080) scale(1.8)" opacity="${o.toFixed(2)}"><g transform="translate(-460 -120)" filter="url(#soft)"><rect x="0" y="-80" width="920" height="160" rx="80" fill="#1d2433"/><circle cx="90" cy="0" r="54" fill="#2aa3e0"/><path d="M76 -26 l40 26 l-40 26z" fill="#fff"/>${wav}</g>
          ${h.on("развод") ? `<g transform="translate(-460 100)"><rect x="0" y="-60" width="920" height="120" rx="30" fill="#f5f1e8"/><text x="460" y="16" text-anchor="middle" font-family="Mont" font-weight="800" font-size="44" fill="#1a1d29">«Это развод, мне ничего не пришло»</text></g>` : ""}</g>`; }
      // 1: экран у сотрудника — «клиент с 2021»
      s += S.POP(h, "Первая", 1010, 370, `<text text-anchor="middle" font-family="Mont" font-weight="800" font-size="56" fill="#ffd9a0">Вы у нас с 2021 года</text>`);
      s += S.POP(h, "новичкам", 1010, 600, `<g transform="rotate(-8)"><rect x="-240" y="-60" width="480" height="120" rx="14" fill="none" stroke="#ff3d4f" stroke-width="10"/><text y="22" text-anchor="middle" font-family="Unb" font-weight="900" font-size="54" fill="#ff3d4f">УЖЕ КЛИЕНТ</text></g>`);
      // 2: перевод летит в терминал и отскакивает
      if (h.on("Вторая")) { const k = (h.since("Вторая") % 1.6) / 1.6, x = k < .5 ? lerp(2300, 3100, k * 2) : lerp(3100, 2500, (k - .5) * 2), y = 560 - 120 * bell(k < .5 ? k * 2 : (k - .5) * 2);
        s += `<g transform="translate(${x.toFixed(0)} ${y.toFixed(0)})"><rect x="-90" y="-50" width="180" height="100" rx="20" fill="#2aa3e0"/><text y="14" text-anchor="middle" font-family="Mont" font-weight="800" font-size="34" fill="#fff">перевод</text></g>`; }
      s += S.POP(h, "телефон", 2420, 300, `<rect x="-120" y="-40" width="240" height="80" rx="40" fill="#f5f1e8"/><text y="12" text-anchor="middle" font-family="Mont" font-weight="800" font-size="32" fill="#1a1d29">телефон</text>`, { rot: -6 });
      s += S.POP(h, "коммуналку", 2760, 260, `<rect x="-150" y="-40" width="300" height="80" rx="40" fill="#f5f1e8"/><text y="12" text-anchor="middle" font-family="Mont" font-weight="800" font-size="32" fill="#1a1d29">коммуналка</text>`, { rot: 5 });
      // 3: герой идёт не в ту дверь
      if (h.on("Третья")) { const k = h.io("Третья", 1.6), sw = Math.sin(t * 7) * 12 * (k < 1 ? 1 : 0);
        s += a.person({ x: lerp(200, 630, k), y: 2040, s: 1.1, back: true, pose: { ll: [[-22, -96 - Math.max(0, sw)], [-30, -6]], rl: [[24, -96 - Math.max(0, -sw)], [30, -6]] } }); }
      if (h.on("незачем")) s += S.POP(h, "незачем", 630, 1300, `<circle r="90" fill="#ff3d4f"/><path d="M-40 -40 l80 80 M40 -40 l-80 80" stroke="#fff" stroke-width="16" stroke-linecap="round"/>`);
      // 4: карта в ящике, календарь 6 недель, бонус сгорает
      if (h.on("ящик")) s += `<g transform="translate(2870 1830) rotate(-4)">${a.card(0, 0, 300, { c1: "#ffb000", c2: "#ff6a00", num: "0001" })}</g>`;
      if (h.on("шесть")) { const wk = Math.min(6, 1 + Math.floor(h.since("шесть") * 4));
        s += `<g transform="translate(3420 1420)"><rect x="-150" y="-150" width="300" height="250" rx="18" fill="#f3efe6"/><rect x="-150" y="-150" width="300" height="60" rx="18" fill="#ff5d6c"/><text y="-108" text-anchor="middle" font-family="Mont" font-weight="800" font-size="28" fill="#fff">НЕДЕЛЯ</text><text y="50" text-anchor="middle" font-family="Unb" font-weight="900" font-size="120" fill="#1a1d29">${wk}</text></g>`; }
      if (h.on("сгорел")) { const k = h.since("сгорел"); s += `<g transform="translate(2540 1420)">${a.coin(0, 0, 70, { op: Math.max(0, 1 - k / 1.2) })}${[0, 1, 2, 3, 4].map(i => `<path d="M${-40 + i * 20} 40 q${-10 + i * 5} ${-60 - 30 * Math.sin(t * 12 + i)} ${10} -120" stroke="${i % 2 ? "#ff8a3d" : "#ffd60a"}" stroke-width="16" fill="none" stroke-linecap="round" opacity="${Math.min(1, k * 2).toFixed(2)}"/>`).join("")}</g>`; }
      if (h.on("тот")) s += S.POP(h, "тот", 2870, 1560, `<rect x="-330" y="-50" width="660" height="100" rx="50" fill="#2ee07a"/><text y="16" text-anchor="middle" font-family="Mont" font-weight="800" font-size="40" fill="#06140b">покупка — в день, как карта пришла</text>`);
      return s; },
    hud(t, d, h) { const S = H();
      return S.T(h, "трёх", 960, 470, [{ t: "Почти всегда — одна из трёх причин", size: 64 }], { anchor: "middle", out: "Первая" }) +
        S.T(h, "Первая", 80, 900, [{ t: "Ты уже был клиентом", size: 64, color: "#ff8a3d" }], { out: "Вторая" }) +
        S.T(h, "Вторая", 80, 900, [{ t: "Перевод ≠ покупка", size: 64, color: "#4a8dff" }], { out: "Третья" }) +
        S.T(h, "Третья", 80, 900, [{ t: "Не по странице акции", size: 64, color: "#c9b0ff" }], { out: "четвёртая" }) +
        S.T(h, "четвёртая", 80, 900, [{ t: "Не успел: срок — обычно месяц", size: 60, color: "#ff8fa0" }]) + A().foot(); },
    events(d) { return ev(d, { notif: ["половина"], whoosh: ["трёх", "Первая", "Вторая", "Третья", "четвёртая"], thud: ["новичкам", "незачем"], pop: ["Первая", "телефон", "коммуналку", "тот"], impact: ["сгорел"] }); },
  };

  // ── 1г. Правило трёх галочек: лист правил под лампой, галочки рисуются на словах ──────────────────────────────
  SC.ticks = {
    bg(d) { let s = `<radialGradient id="desk6" cx="35%" cy="35%" r="80%"><stop offset="0" stop-color="#3a2a1e"/><stop offset=".6" stop-color="#1a120d"/><stop offset="1" stop-color="#0a0706"/></radialGradient>
      <rect x="-600" y="-400" width="3100" height="1900" fill="url(#desk6)"/><circle cx="560" cy="420" r="620" fill="#ffcf87" opacity=".16" filter="url(#b60)"/>`;
      let p = `<rect x="0" y="0" width="860" height="1040" rx="10" fill="#f3efe6"/><text x="60" y="100" font-family="Unb" font-weight="900" font-size="42" fill="#1a1d29">ПРАВИЛА АКЦИИ</text><text x="60" y="140" font-family="Mont" font-weight="600" font-size="22" fill="#7a7f90">для новых клиентов · пример</text>`;
      const rr = A().rnd(4); for (let k = 0; k < 26; k++) { const y = 190 + k * 30; if ([4, 5, 11, 12, 18, 19].includes(k)) continue; p += `<rect x="60" y="${y}" width="${520 + rr() * 220}" height="10" rx="5" fill="#c9c6bd"/>`; }
      [["Ты новый клиент банка", 300], ["Настоящая покупка, не перевод", 510], ["Карта — по странице акции", 720]].forEach(([tx, y]) => { p += `<rect x="60" y="${y - 58}" width="52" height="52" rx="10" fill="none" stroke="#1a1d29" stroke-width="5"/><text x="132" y="${y - 18}" font-family="Mont" font-weight="800" font-size="36" fill="#1a1d29">${tx}</text>`; });
      return s + `<g transform="translate(230 175) rotate(-4) scale(.84)" filter="url(#soft)">${p}</g>`; },
    fg(t, d, h) { let p = "";
      [["новый", 300, 21], ["настоящая", 510, 30], ["оформление", 720, 26]].forEach(([n, y, len]) => { if (!h.on(n)) return; const kh = out3(h.since(n) / .4), kc = out3((h.since(n) - .15) / .35);
        p += `<path d="M120 ${y - 30} h${(len * 19.5 + 20) * kh}" stroke="#ffd60a" stroke-width="44" stroke-linecap="round" opacity=".5"/>`;
        const L = 90 * kc; p += `<path d="M66 ${y - 34} l16 18 l34 -50" stroke="#18a957" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="${L} 200"/>`; });
      let s = `<g transform="translate(230 175) rotate(-4) scale(.84)">${p}</g>`;
      // маркер ездит к текущей строке
      const tgt = h.on("оформление") ? 720 : h.on("настоящая") ? 510 : h.on("новый") ? 300 : 900, my = 175 + tgt * .84;
      s += `<g transform="translate(${(1000 + Math.sin(t * 6) * 10).toFixed(0)} ${my.toFixed(0)}) rotate(-30)" filter="url(#soft)"><rect x="-30" y="-180" width="60" height="300" rx="20" fill="#ffd60a"/><rect x="-30" y="-180" width="60" height="90" rx="20" fill="#1a1d29"/><path d="M-20 120 h40 l-10 40 h-20z" fill="#e8c400"/></g>`;
      s += H().POP(h, "один", 1500, 800, `<g transform="rotate(-10)"><circle r="130" fill="none" stroke="#ff8a3d" stroke-width="12"/><text y="34" text-anchor="middle" font-family="Unb" font-weight="900" font-size="96" fill="#ff8a3d">1×</text></g>`);
      return s; },
    hud(t, d, h) { const S = H();
      return S.T(h, "правило", 1130, 300, [{ t: "Правило", size: 80 }, { t: "трёх галочек", size: 80, color: "#ffd60a" }]) +
        S.T(h, "Все", 1136, 560, [{ t: "все три — бонус придёт", size: 40, color: "#2ee07a", font: "Mont", w: 800, ls: 0 }]) +
        S.T(h, "следующий", 1136, 960, [{ t: "а следующий способ — нет →", size: 40, color: "#c9b0ff", font: "Mont", w: 800, ls: 0 }]) + A().foot(); },
    events(d) { const E = ev(d, { pop: ["правило", "Все", "один"], whoosh: ["следующий"] }), at = d.at || {}; E.pen = ["новый", "настоящая", "оформление"].filter(k => at[k] != null).map(k => [at[k], .5]); return E; },
  };
})();
