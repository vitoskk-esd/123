// Живые сцены глав 4–7 ролика №3: кэшбэк, кредитка, план на первый месяц, шестой способ, финал.
(function () {
  const W = typeof window !== "undefined" ? window : global, SC = W.SCENES = W.SCENES || {}, A = () => W.A, H = () => W.SC_HELP;
  const cl = (x) => Math.max(0, Math.min(1, x)), lerp = (a, b, k) => a + (b - a) * k, out3 = (x) => 1 - Math.pow(1 - cl(x), 3), out5 = (x) => 1 - Math.pow(1 - cl(x), 5), bell = (x) => Math.sin(Math.PI * cl(x));
  const fmt = (v) => Math.round(v).toLocaleString("ru-RU").replace(/\s/g, " ");
  const ev = (d, map) => { const at = d.at || {}, E = {}; Object.entries(map).forEach(([snd, keys]) => keys.forEach(k => { if (at[k] != null) (E[snd] = E[snd] || []).push(at[k]); })); return E; };
  const bgR = (id, c1, c2, extra = "") => `<radialGradient id="${id}" cx="50%" cy="35%" r="85%"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></radialGradient><rect x="-1200" y="-800" width="4400" height="2800" fill="url(#${id})"/>${extra}`;
  const chip = (txt, bg, fg = "#1a1400", fs = 32) => { const w = txt.length * fs * .6 + fs * 1.3; return `<rect x="${-w / 2}" y="${-fs * .95}" width="${w}" height="${fs * 1.9}" rx="${fs * .95}" fill="${bg}"/><text y="${fs * .36}" text-anchor="middle" font-family="Mont" font-weight="800" font-size="${fs}" fill="${fg}">${txt}</text>`; };
  const terminal = (ok = true) => `<rect x="-110" y="-60" width="220" height="80" rx="16" fill="#151b24"/><rect x="-90" y="-330" width="180" height="300" rx="26" fill="#1f2731"/><rect x="-70" y="-306" width="140" height="120" rx="12" fill="${ok ? "#2ee07a" : "#ff3d4f"}"/>
    ${ok ? `<path d="M-22 -250 l18 18 l36 -40" stroke="#06140b" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` : `<path d="M-26 -272 l52 52 M26 -272 l-52 52" stroke="#fff" stroke-width="10" stroke-linecap="round"/>`}
    ${[0, 1, 2].map(i => `<circle cx="${-40 + i * 40}" cy="-110" r="12" fill="#2c3644"/><circle cx="${-40 + i * 40}" cy="-74" r="12" fill="#2c3644"/>`).join("")}`;
  const nodeBox = (x, y, label, icon, c) => `<g transform="translate(${x} ${y})" filter="url(#soft)"><rect x="-130" y="-110" width="260" height="220" rx="30" fill="#141a2e" stroke="${c}" stroke-width="4"/>${icon}<text y="86" text-anchor="middle" font-family="Mont" font-weight="800" font-size="32" fill="#fff">${label}</text></g>`;
  const ICON = { shop: `<g transform="translate(0 -20)"><path d="M-60 -30 h120 l-10 -30 h-100z" fill="#ff8a3d"/><rect x="-54" y="-30" width="108" height="70" fill="#ffd9a0"/><rect x="-16" y="0" width="32" height="40" fill="#ff8a3d"/></g>`,
    bank: `<g transform="translate(0 -20) scale(.5)"><path d="M-110 -10 L0 -70 L110 -10Z" fill="#ffd60a"/><rect x="-100" y="-10" width="200" height="16" fill="#ffd60a"/>${[-70, -25, 25, 70].map(x => `<rect x="${x - 10}" y="10" width="20" height="80" fill="#ffd60a"/>`).join("")}</g>`,
    you: `<g transform="translate(0 -24)"><circle cy="-22" r="24" fill="#f1c48f"/><path d="M-40 40 q0 -46 40 -46 q40 0 40 46z" fill="#2ec4b6"/></g>` };

  // ── 4а. Кэшбэк: касса; кто платит — магазин → банк → ты ──────────────────────────────────────────────────
  SC.checkout = {
    bg(d) { return `<linearGradient id="bg9" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a1a2a"/><stop offset="1" stop-color="#14304a"/></linearGradient>
      <rect x="-800" y="-600" width="3520" height="2400" fill="url(#bg9)"/>
      <g opacity=".45" filter="url(#b6)">${[0, 1, 2, 3, 4, 5].map(i => `<rect x="${80 + i * 300}" y="120" width="260" height="440" rx="10" fill="#0e2338"/>${[0, 1, 2, 3].map(k => `<rect x="${95 + i * 300}" y="${150 + k * 100}" width="230" height="70" rx="6" fill="${["#ff8a3d", "#2ec4b6", "#ffd60a", "#ff5d8f", "#4a8dff"][(i + k) % 5]}" opacity=".35"/>`).join("")}`).join("")}</g>
      <rect x="-800" y="640" width="3520" height="1400" fill="#1c2733"/><rect x="-800" y="640" width="3520" height="18" fill="#2c3b4b"/>
      <rect x="-800" y="700" width="1700" height="120" rx="10" fill="#0d1218"/>`; },
    fg(t, d, h) { const a = A(), S = H(); let s = "";
      for (let i = 0; i < 20; i++) s += `<rect x="${((i * 52 + t * 80) % 1040) - 140}" y="700" width="4" height="120" fill="#1e2630"/>`;
      // продукты едут по ленте
      const belt = (t * 80) % 400;
      s += `<g transform="translate(${(100 + belt * .2).toFixed(0)} 0)" filter="url(#soft)"><path d="M140 700 q-10 -70 70 -90 q90 -10 110 50 q6 30 -10 40z" fill="#d9944a"/><rect x="380" y="560" width="110" height="140" rx="8" fill="#e8eef5"/><path d="M380 560 l55 -40 l55 40z" fill="#4a8dff"/><rect x="380" y="610" width="110" height="40" fill="#4a8dff"/><circle cx="600" cy="660" r="44" fill="#ff4d4d"/><circle cx="680" cy="668" r="36" fill="#7bd88f"/></g>`;
      // терминал, рука с картой (подлетает и касается)
      const tapK = h.on("покупки") ? bell((h.since("покупки") % 2.4) / 1.2) : 0;
      s += `<g transform="translate(1250 700)" filter="url(#soft)">${terminal(true)}</g>`;
      s += `<g fill="none" stroke="#bfe9ff" stroke-width="7" stroke-linecap="round" opacity="${(.3 + .5 * tapK).toFixed(2)}"><path d="M1380 430 a60 60 0 0 1 0 80"/><path d="M1410 405 a95 95 0 0 1 0 130"/><path d="M1440 380 a130 130 0 0 1 0 180"/></g>`;
      s += `<g transform="translate(${(1560 - 60 * tapK).toFixed(0)} 470) rotate(-18)">${a.limb([[260, 140], [150, 60]], 70, "#2ec4b6")}<circle cx="140" cy="58" r="40" fill="#f1c48f"/>${a.card(60, 30, 230, { c1: "#4a8dff", c2: "#2338b8", num: "0004" }).replace('filter="url(#soft)"', "")}<rect x="96" y="20" width="70" height="34" rx="16" fill="#f1c48f"/></g>`;
      // схема: магазин → банк → ты
      if (h.on("магазин")) { s += S.POP(h, "магазин", 420, 300, nodeBox(0, 0, "магазин", ICON.shop, "#ff8a3d"));
        s += S.POP(h, "комиссию", 960, 300, nodeBox(0, 0, "банк", ICON.bank, "#ffd60a"));
        if (h.on("комиссию")) for (let i = 0; i < 3; i++) s += S.coinFly({ ...h, at: (n) => h.at(n) + i * .25 }, "комиссию", 560, 300, 820, 300, 24, { d: .7, arc: 80, vanish: true });
        s += S.POP(h, "часть", 1500, 300, nodeBox(0, 0, "ты", ICON.you, "#2ec4b6"));
        if (h.on("часть")) for (let i = 0; i < 2; i++) s += S.coinFly({ ...h, at: (n) => h.at(n) + .3 + i * .3 }, "часть", 1100, 300, 1360, 300, 20, { d: .7, arc: 80, vanish: true }); }
      return s; },
    hud(t, d, h) { const S = H(); return `<path d="M0 760 Q700 820 1000 1080 H0Z" fill="#05090f" opacity=".6" filter="url(#b60)"/>` +
      S.T(h, "покупки", 80, 830, [{ t: "Кэшбэк — часть денег", size: 58 }, { t: "с каждой покупки", size: 58, color: "#ffd60a" }], { out: "магазин" }) +
      S.T(h, "магазин", 80, 830, [{ t: "Платит не банк, а магазин:", size: 52 }, { t: "банк делится с тобой", size: 52, color: "#ffd60a" }]) + A().foot(); },
    events(d) { return ev(d, { click: ["покупки"], pop: ["магазин", "комиссию", "часть"], coin: ["комиссию", "часть"] }); },
  };

  // ── 4б. Банки стали жаднее: ≈200 млрд, −10 %; урезали категории, лимиты, подписки; «процент на всё» умер ─────
  SC.greedy = {
    bg(d) { return bgR("bgGr", "#2a1a3a", "#08050f"); },
    fg(t, d, h) { const a = A(), S = H(); let s = "";
      // два столбика: год назад и I полугодие 2026
      if (h.on("ВТБ")) { const k = out3(h.since("ВТБ") / 1), k2 = out3((h.since("ВТБ") - .3) / 1), base = 820;
        s += `<rect x="300" y="${base - 520 * k}" width="220" height="${520 * k}" rx="14" fill="#5a5f80"/><text x="410" y="${base + 50}" text-anchor="middle" font-family="Mont" font-weight="700" font-size="30" fill="#c9d3f2">год назад</text>
          <rect x="620" y="${base - 468 * k2}" width="220" height="${468 * k2}" rx="14" fill="#ffd60a"/><text x="730" y="${base + 50}" text-anchor="middle" font-family="Mont" font-weight="700" font-size="30" fill="#c9d3f2">I пол. 2026</text>
          <text x="730" y="${base - 468 * k2 - 30}" text-anchor="middle" font-family="Unb" font-weight="900" font-size="46" fill="#ffd60a" opacity="${k2}">≈ 200 млрд ₽</text>`;
        if (h.on("десять")) s += S.POP(h, "десять", 960, 470, chip("−10 %", "#ff3d4f", "#fff", 56)); }
      // ножницы режут категории, лимит, подписка
      if (h.on("урезали")) { const k = cl(h.since("урезали") / .6);
        s += `<g transform="translate(1400 260)">${chip("рестораны 10 %", "#ff8fa0", "#1a1d29", 34)}<path d="M-180 0 h${360 * k}" stroke="#ff3d4f" stroke-width="8"/></g>
          <g transform="translate(${1180 + 300 * k} 260) rotate(${(Math.sin(t * 20) * 15).toFixed(0)})"><circle cx="-20" cy="-20" r="20" fill="none" stroke="#f5f1e8" stroke-width="8"/><circle cx="-20" cy="20" r="20" fill="none" stroke="#f5f1e8" stroke-width="8"/><path d="M0 -10 L60 10 M0 10 L60 -10" stroke="#f5f1e8" stroke-width="8" stroke-linecap="round"/></g>`; }
      s += S.POP(h, "лимиты", 1400, 400, chip("лимит: 3 000 ₽ в месяц", "#f5f1e8", "#1a1d29", 32), { rot: -2 });
      s += S.POP(h, "подписки", 1400, 540, chip("подписка 299 ₽/мес", "#c9b0ff", "#1c1240", 32), { rot: 2 });
      // надгробие «процент на всё»
      if (h.on("умер")) s += S.POP(h, "умер", 1400, 880, `<path d="M-160 120 v-180 a160 160 0 0 1 320 0 v180z" fill="#5a5f80"/><text y="-60" text-anchor="middle" font-family="Mont" font-weight="800" font-size="34" fill="#1a1d29">кэшбэк</text><text y="0" text-anchor="middle" font-family="Unb" font-weight="900" font-size="42" fill="#1a1d29">«на всё»</text><text y="50" text-anchor="middle" font-family="Mont" font-weight="700" font-size="28" fill="#1a1d29">1 %</text>`);
      return s; },
    hud(t, d, h) { const S = H(); return S.T(h, "жаднее", 80, 60, [{ t: "Банки стали жаднее", size: 76 }], { out: "другое" }) +
      S.T(h, "ВТБ", 84, 160, [{ t: "данные ВТБ · Т—Ж, 27.07.2026", size: 26, font: "Mont", w: 600, ls: 0, color: "#9fb0dd" }], { out: "другое" }) +
      S.T(h, "другое", 80, 60, [{ t: "Работает другое:", size: 70 }, { t: "2–3 категории, где ты и так тратишь", size: 46, font: "Mont", w: 800, ls: 0, color: "#2ee07a" }]) + A().foot(); },
    events(d) { return ev(d, { pop: ["ВТБ", "лимиты", "подписки", "другое"], thud: ["десять", "умер"], swish: ["урезали"] }); },
  };

  // ── 4в. Пример: чек «еда 6 000 ₽ × 5 % = 300 ₽», плюс транспорт — набегает несколько сотен ───────────────────
  SC.calc = {
    bg(d) { return bgR("bgCa", "#16324a", "#050d16"); },
    fg(t, d, h) { const S = H(); let s = "";
      // чек выезжает из терминала и печатает строки
      const k = h.on("примере") ? out3(h.since("примере") / 1.2) : 0, L = [["еда", "6 000 ₽ × 5 %", "300 ₽", "шесть"], ["транспорт", "2 000 ₽ × 7 %", "140 ₽", "транспорт"], ["итого в месяц", "", "≈ 440 ₽", "Набегает"]];
      let r = `<rect width="700" height="${200 + 120 * 3}" fill="#f7f4ec"/><path d="M0 ${200 + 360} ${Array.from({ length: 14 }, (_, i) => `l25 20 l25 -20`).join(" ")} V0z" fill="#f7f4ec"/>
        <text x="350" y="80" text-anchor="middle" font-family="Mono" font-size="34" fill="#1a1d29">КЭШБЭК · ПРИМЕР</text><path d="M40 120 h620" stroke="#1a1d29" stroke-width="3" stroke-dasharray="8 8"/>`;
      L.forEach(([a1, b, c, key], i) => { if (!h.on(key)) return; const o = cl(h.since(key) / .3), y = 200 + i * 120;
        r += `<g opacity="${o}"><text x="40" y="${y}" font-family="Mono" font-size="34" fill="#1a1d29">${a1}</text><text x="40" y="${y + 44}" font-family="Mono" font-size="28" fill="#6a6f80">${b}</text>
          <text x="660" y="${y + 20}" text-anchor="end" font-family="Unb" font-weight="900" font-size="${i === 2 ? 48 : 40}" fill="${i === 2 ? "#18a957" : "#1a1d29"}">${c}</text></g>`; });
      s += `<g transform="translate(860 ${(1100 - 870 * k).toFixed(0)}) rotate(-2)" filter="url(#soft)">${r}</g>`;
      // монеты падают в копилку справа
      if (h.on("Набегает")) for (let i = 0; i < 5; i++) s += S.coinFly({ ...h, at: (n) => h.at(n) + i * .3 }, "Набегает", 1400, 200, 1560, 760, 28, { d: .7, arc: 40, vanish: true });
      s += S.POP(h, "Набегает", 1560, 800, `<ellipse rx="150" ry="110" fill="#ff8fa0"/><circle cx="110" cy="-40" r="34" fill="#ff8fa0"/><rect x="-30" y="-110" width="60" height="12" rx="6" fill="#7a2a3a"/><circle cx="60" cy="-20" r="8" fill="#1a1d29"/><rect x="-80" y="90" width="30" height="40" fill="#ff8fa0"/><rect x="50" y="90" width="30" height="40" fill="#ff8fa0"/>`);
      return s; },
    hud(t, d, h) { const S = H(); return S.T(h, "примере", 80, 60, [{ t: "Смотри на примере", size: 70 }], { out: "Набегает" }) +
      S.T(h, "Набегает", 80, 60, [{ t: "Несколько сотен в месяц —", size: 60 }, { t: "за покупки, которые ты сделал бы всё равно", size: 40, font: "Mont", w: 800, ls: 0, color: "#2ee07a" }]); },
    events(d) { return ev(d, { paper: ["примере"], pop: ["шесть", "транспорт", "Набегает"], coin: ["Набегает"] }); },
  };

  // ── 4г. Как выбрать категории: диаграмма трат в приложении, две самые большие доли; две карты ─────────────────
  SC.pie = {
    bg(d) { return bgR("bgPie", "#1a2a5a", "#060914"); },
    fg(t, d, h) { const a = A(), S = H(); let s = "";
      const SL = [["еда", .34, "#2ee07a"], ["транспорт", .22, "#4a8dff"], ["подписки", .14, "#8a5cf6"], ["одежда", .12, "#ff8a3d"], ["рестораны", .06, "#ff5d8f"], ["другое", .12, "#5a5f80"]];
      const grow = h.on("диаграмма") ? out3(h.since("диаграмма") / 1) : 0, hl = h.on("доли"), cut = h.on("ресторанов");
      let ang = -Math.PI / 2, pie = "";
      SL.forEach(([lab, f, c], i) => { const a0 = ang, a1 = ang + f * 2 * Math.PI * grow; ang = a1; const big = hl && i < 2, r = big ? 270 : 240, mid = (a0 + a1) / 2, off = big ? 26 : 0;
        const ox = Math.cos(mid) * off, oy = Math.sin(mid) * off, la = a1 - a0 > Math.PI ? 1 : 0;
        pie += `<path d="M${ox} ${oy} L${(ox + r * Math.cos(a0)).toFixed(1)} ${(oy + r * Math.sin(a0)).toFixed(1)} A${r} ${r} 0 ${la} 1 ${(ox + r * Math.cos(a1)).toFixed(1)} ${(oy + r * Math.sin(a1)).toFixed(1)}Z" fill="${c}" opacity="${hl && !big ? .35 : 1}"/>`;
        if (grow > .9) pie += `<text x="${(ox + (r + 70) * Math.cos(mid)).toFixed(0)}" y="${(oy + (r + 70) * Math.sin(mid) + 10).toFixed(0)}" text-anchor="middle" font-family="Mont" font-weight="800" font-size="30" fill="#f5f1e8" opacity="${hl && !big ? .4 : 1}" ${lab === "рестораны" && cut ? 'text-decoration="line-through"' : ""}>${lab}</text>`;
        if (lab === "рестораны" && cut) pie += `<path d="M${(r + 20) * Math.cos(mid) - 90} ${(r + 70) * Math.sin(mid)} h180" stroke="#ff3d4f" stroke-width="7"/>`; });
      s += `<g transform="translate(700 560)"><circle r="300" fill="#141a2e"/>${pie}<circle r="110" fill="#141a2e"/><text y="14" text-anchor="middle" font-family="Mont" font-weight="800" font-size="34" fill="#c9d3f2">траты</text></g>`;
      // две карты разных банков
      if (h.on("две2")) { s += `<g transform="translate(1450 420) rotate(-6)">${a.card(0, 0, 360, { c1: "#2ee07a", c2: "#0f6b4a", num: "0001", label: "ЕДА 5 %" })}</g><g transform="translate(1520 700) rotate(5)">${a.card(0, 0, 360, { c1: "#4a8dff", c2: "#2338b8", num: "0002", label: "ТАКСИ 7 %" })}</g>`; }
      return s; },
    hud(t, d, h) { const S = H(); return S.T(h, "категории", 80, 60, [{ t: "Как выбрать категории", size: 70 }], { out: "доли" }) +
      S.T(h, "доли", 80, 60, [{ t: "2 самые большие доли —", size: 64 }, { t: "твои категории", size: 64, color: "#2ee07a" }], { out: "две2" }) +
      S.T(h, "две2", 80, 60, [{ t: "Две карты — плати той,", size: 64 }, { t: "где процент выше", size: 64, color: "#ffd60a" }]); },
    events(d) { return ev(d, { pop: ["категории", "доли"], swish: ["диаграмма"], thud: ["ресторанов"], whoosh: ["две2"] }); },
  };

  // ── 4д. Три ловушки кэшбэка: баллы, лимит, платная подписка; тизер кредитки ───────────────────────────────────
  SC.traps = {
    bg(d) { return bgR("bgTr", "#3a1a2a", "#0a0508"); },
    fg(t, d, h) { const a = A(), S = H(); let s = "";
      const P = [[400, "баллы", "#ff8a3d"], [960, "лимит", "#4a8dff"], [1520, "подписка", "#8a5cf6"]];
      P.forEach(([x, key, c], i) => { if (!h.on(key)) return; const k = h.U.back(h.since(key) / .5);
        let ic = "";
        if (i === 0) { const m = cl((h.since(key) - .6) / .8); ic = `${a.coin(-50, -20, 46, { op: 1 - m })}<g opacity="${m}" transform="translate(-50 -20)"><path d="M0 -40 l12 26 l28 3 l-21 19 l7 28 l-26 -15 l-26 15 l7 -28 l-21 -19 l28 -3z" fill="#ffd60a"/></g><text x="50" y="0" font-family="Mont" font-weight="800" font-size="30" fill="#fff">→ ?</text>`; }
        if (i === 1) { const fl = h.since(key) < 1.5; ic = `<rect x="-80" y="-80" width="60" height="30" rx="8" fill="#c9d3f2"/><path d="M-20 -65 h60 v30" stroke="#c9d3f2" stroke-width="22" fill="none"/>${fl ? [0, 1, 2].map(j => a.coin(40, -10 + ((h.since(key) * 160 + j * 40) % 120), 16)).join("") : ""}<text x="0" y="90" text-anchor="middle" font-family="Unb" font-weight="900" font-size="34" fill="#ff8fa0">стоп</text>`; }
        if (i === 2) ic = `<rect x="-90" y="-80" width="180" height="120" rx="20" fill="#8a5cf6"/><text y="-8" text-anchor="middle" font-family="Unb" font-weight="900" font-size="40" fill="#fff">₽/мес</text><text y="80" text-anchor="middle" font-family="Mont" font-weight="800" font-size="30" fill="#ffd60a">окупится?</text>`;
        s += `<g transform="translate(${x} 560) scale(${Math.max(0, k).toFixed(3)})" filter="url(#soft)"><rect x="-240" y="-260" width="480" height="520" rx="36" fill="#141a2e" stroke="${c}" stroke-width="5"/><circle cx="-170" cy="-190" r="40" fill="${c}"/><text x="-170" y="-176" text-anchor="middle" font-family="Unb" font-weight="900" font-size="44" fill="#0b0f1c">${i + 1}</text>
          <g transform="translate(0 -20)">${ic}</g><text y="200" text-anchor="middle" font-family="Mont" font-weight="800" font-size="38" fill="#fff">${["баллы ≠ рубли", "лимит в месяц", "платная подписка"][i]}</text></g>`; });
      // тизер: красная кредитка выглядывает
      if (h.on("последний")) { const k = out5(h.since("последний") / .8); s += `<g transform="translate(${lerp(2300, 1700, k)} 930)">${a.card(0, 0, 300, { c1: "#ff5d8f", c2: "#b0174a", rot: -12, num: "0005" })}</g><circle cx="1700" cy="930" r="${200 + 30 * Math.sin(t * 6)}" fill="#ff3d4f" opacity=".2" filter="url(#b60)"/>`; }
      return s; },
    hud(t, d, h) { const S = H(); return S.T(h, "ловушки", 960, 60, [{ t: "Три ловушки кэшбэка", size: 72 }], { anchor: "middle", out: "последний" }) +
      S.T(h, "последний", 80, 60, [{ t: "Последний способ:", size: 64 }, { t: "платит больше всех", size: 64, color: "#ffd60a" }], { out: "минус" }) +
      S.T(h, "минус", 80, 60, [{ t: "и только на нём", size: 64 }, { t: "можно уйти в минус", size: 64, color: "#ff5d6c" }]); },
    events(d) { return ev(d, { pop: ["ловушки", "баллы", "лимит", "подписка"], whoosh: ["последний"], impact: ["минус"] }); },
  };

  // ── 5а. Кредитка: за друга с кредиткой платят вдвое больше; банк ждёт, что не уложишься; ~50 % годовых ─────────
  SC.credit = {
    bg(d) { return `<linearGradient id="sea10" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b4a5c"/><stop offset=".5" stop-color="#062634"/><stop offset="1" stop-color="#020a10"/></linearGradient>
      <rect x="-800" y="-600" width="3520" height="2400" fill="url(#sea10)"/>${[[700, 360], [900, 300], [1150, 420], [1350, 260]].map(([x, w]) => `<path d="M${x} -20 l${w / 2} 0 l${w} 1100 l${-w * 1.2} 0z" fill="#7ff0e4" opacity=".05" filter="url(#b14)"/>`).join("")}`; },
    fg(t, d, h) { const a = A(), S = H(); let s = A().bokeh(41, 40, [-200, (200 - t * 40) % 1080, 2100, 1300 - t * 40], ["#7ff0e4", "#2ec4b6"], { blur: "b6", r0: 3, r1: 10 });
      // столбики выплат за друга
      if (h.on("Посмотри")) { const k1 = out3(h.since("Посмотри") / .8), k2 = out3((h.since("Посмотри") - .5) / .9);
        s += `<rect x="300" y="${860 - 300 * k1}" width="260" height="${300 * k1}" rx="14" fill="#4a8dff"/><text x="430" y="${860 - 300 * k1 - 24}" text-anchor="middle" font-family="Unb" font-weight="900" font-size="40" fill="#bfe9ff">1 500–1 800 ₽</text><text x="430" y="910" text-anchor="middle" font-family="Mont" font-weight="700" font-size="28" fill="#c9d3f2">друг с обычной картой</text>
          <rect x="680" y="${860 - 520 * k2}" width="260" height="${520 * k2}" rx="14" fill="#ff5d8f"/><text x="810" y="${860 - 520 * k2 - 24}" text-anchor="middle" font-family="Unb" font-weight="900" font-size="40" fill="#ffd1e4">2 500–4 000 ₽</text><text x="810" y="910" text-anchor="middle" font-family="Mont" font-weight="700" font-size="28" fill="#c9d3f2">друг с кредиткой</text>`; }
      s += S.POP(h, "двух", 1020, 300, chip("×2", "#ffd60a", "#1a1400", 64));
      // кредитка на крючке справа
      const sw = Math.sin(t * 1.3) * 6;
      s += `<g transform="rotate(${sw.toFixed(1)} 1500 -10)"><path d="M1500 -10 V330" stroke="#d8f1ff" stroke-width="3" opacity=".8"/>${a.card(1480, 600, 420, { c1: "#ff5d8f", c2: "#b0174a", rot: 10, num: "0005" })}
        <circle cx="1512" cy="452" r="12" fill="#3a0a1a"/><path d="M1500 330 v120 a36 36 0 0 1 -72 0 v-26" stroke="#dfe6f0" stroke-width="11" fill="none" stroke-linecap="round"/></g>`;
      if (h.on("проценты")) { const k = cl(h.since("проценты") / 2); s += `<g transform="translate(1480 900)"><path d="M-160 0 a160 160 0 0 1 320 0" stroke="#1d3a44" stroke-width="30" fill="none"/><path d="M-160 0 a160 160 0 0 1 ${(160 - 160 * Math.cos(Math.PI * .5 * k * (h.on("пятьдесят") ? 2 : 1)) - 160 + 160).toFixed(0)} 0" stroke="none"/>
          <path d="M-160 0 A160 160 0 0 1 ${(-160 * Math.cos(Math.PI * k * (h.on("пятьдесят") ? .5 : .25))).toFixed(1)} ${(-160 * Math.sin(Math.PI * k * (h.on("пятьдесят") ? .5 : .25))).toFixed(1)}" stroke="#ff3d4f" stroke-width="30" fill="none" stroke-linecap="round"/>
          <text y="-40" text-anchor="middle" font-family="Unb" font-weight="900" font-size="54" fill="#ff8fa0">${h.on("пятьдесят") ? "~50 %" : "%"}</text></g>`; }
      return s; },
    hud(t, d, h) { const S = H(); return S.T(h, "выгоднее", 80, 60, [{ t: "Клиент с кредиткой —", size: 64 }, { t: "самый выгодный для банка", size: 64, color: "#ff8fa0" }], { out: "пятьдесят" }) +
      S.T(h, "пятьдесят", 80, 60, [{ t: "Средняя ПСК по кредиткам ~50 %", size: 56, color: "#ff8fa0" }, { t: "≈ 48 % · ОКБ, 16.02.2026", size: 28, font: "Mont", w: 600, ls: 0, color: "#bfe9ff" }]) +
      `<text x="960" y="1050" text-anchor="middle" font-family="Mont" font-weight="500" font-size="22" fill="#c9d3f2" opacity=".55">Пример реферальной программы · 1000bankov, 28.09.2026 · Не реклама конкретного банка</text>`; },
    events(d) { return ev(d, { pop: ["Посмотри", "двух", "выгоднее"], swish: ["проценты"], thud: ["пятьдесят"] }); },
  };

  // ── 5б. Льготный период 100+ дней: вернул всё до конца — 0 ₽ процентов ─────────────────────────────────────
  SC.grace = {
    bg(d) { return SC.credit.bg(d); },
    fg(t, d, h) { const a = A(), S = H(); let s = "";
      // шкала дней
      const k = h.on("льготный") ? out3(h.since("льготный") / 2.5) : 0, days = Math.round(100 * k);
      s += `<rect x="260" y="520" width="1400" height="40" rx="20" fill="#0d2a33"/><rect x="260" y="520" width="${1400 * k}" height="40" rx="20" fill="#2ee07a"/>
        <text x="${260 + 1400 * k}" y="490" text-anchor="middle" font-family="Unb" font-weight="900" font-size="54" fill="#2ee07a" opacity="${k ? 1 : 0}">${days}${h.on("больше") ? "+" : ""} дн.</text>
        <text x="260" y="620" font-family="Mont" font-weight="700" font-size="30" fill="#bfe9ff">покупка</text><text x="1660" y="620" text-anchor="end" font-family="Mont" font-weight="700" font-size="30" fill="#bfe9ff">конец срока</text>`;
      s += S.POP(h, "Вернул", 1480, 760, `<circle r="80" fill="#2ee07a"/><path d="M-34 4 l22 22 l46 -50" stroke="#06140b" stroke-width="14" fill="none" stroke-linecap="round" stroke-linejoin="round"/><text y="150" text-anchor="middle" font-family="Unb" font-weight="900" font-size="48" fill="#2ee07a">0 ₽ процентов</text>`);
      [["бонус", "бонус за кредитку", "#ffd60a"], ["кэшбэк", "кэшбэк за покупки", "#4a8dff"], ["бесплатно", "деньги банка бесплатно", "#2ee07a"]].forEach(([n, lab, c], i) =>
        s += S.POP(h, n, 420 + i * 540, 820, chip(lab, c, "#06140b", 32), { float: 1 }));
      return s; },
    hud(t, d, h) { const S = H(); return S.T(h, "льготный", 80, 60, [{ t: "Льготный период", size: 76 }, { t: "пользуешься деньгами банка бесплатно", size: 42, font: "Mont", w: 800, ls: 0, color: "#2ee07a" }]) +
      `<text x="960" y="1050" text-anchor="middle" font-family="Mont" font-weight="500" font-size="22" fill="#c9d3f2" opacity=".55">100+ дней — у ряда карт, без наличных · finuslugi.ru, 2026 · Условия на дату записи</text>`; },
    events(d) { return ev(d, { swish: ["льготный"], pop: ["Вернул", "бонус", "кэшбэк", "бесплатно"], coin: ["Вернул"] }); },
  };

  // ── 5в. Жёсткие правила: наличные и переводы — проценты сразу; минимальный платёж ≠ всё нормально; не бери ────
  SC.rules5 = {
    bg(d) { return bgR("bgR5", "#2a0f1a", "#080306"); },
    fg(t, d, h) { const a = A(), S = H(); let s = "";
      // капкан: банкомат и перевод захлопываются
      if (h.on("наличных") && !h.on("бери")) { const snap = h.since("наличных") > .8 ? 1 : 0;
        s += `<g transform="translate(560 600)"><rect x="-140" y="-260" width="280" height="420" rx="20" fill="#2c3644"/><rect x="-100" y="-220" width="200" height="120" rx="10" fill="#7fd8ff"/><rect x="-80" y="20" width="160" height="16" rx="8" fill="#0b0f1c"/>
          <text y="230" text-anchor="middle" font-family="Mont" font-weight="800" font-size="34" fill="#fff">наличные</text></g>
          <g transform="translate(560 860)"><path d="M-160 0 ${Array.from({ length: 8 }, (_, i) => `l20 ${snap ? -30 : -60} l20 ${snap ? 30 : 60}`).join(" ")}" stroke="#c9d3e0" stroke-width="8" fill="none"/></g>`; }
      if (!h.on("бери")) s += S.POP(h, "переводы", 1000, 600, `<rect x="-140" y="-70" width="280" height="140" rx="28" fill="#2aa3e0"/><text y="14" text-anchor="middle" font-family="Mont" font-weight="800" font-size="40" fill="#fff">перевод</text>`);
      if (h.on("капают")) for (let i = 0; i < 4; i++) { const k = ((h.since("капают") + i * .35) % 1.4) / 1.4; s += `<text x="${(780 + i * 40).toFixed(0)}" y="${(380 + k * 300).toFixed(0)}" font-family="Unb" font-weight="900" font-size="54" fill="#ff3d4f" opacity="${(1 - k).toFixed(2)}">%</text>`; }
      // минимальный платёж
      if (h.on("Минимальный") && !h.on("бери")) { const k = out3(h.since("Минимальный") / .8);
        s += `<g transform="translate(1440 520)" filter="url(#soft)"><rect x="-300" y="-200" width="600" height="400" rx="30" fill="#141a2e" stroke="#ffd60a" stroke-width="4"/>
          <text y="-110" text-anchor="middle" font-family="Mont" font-weight="700" font-size="34" fill="#9fb0dd">долг 5 000 ₽</text><rect x="-240" y="-60" width="480" height="40" rx="20" fill="#2c3644"/><rect x="-240" y="-60" width="${48 * k}" height="40" rx="20" fill="#ffd60a"/>
          <text y="40" text-anchor="middle" font-family="Mont" font-weight="800" font-size="34" fill="#ffd60a">минимальный платёж</text><text y="120" text-anchor="middle" font-family="Unb" font-weight="900" font-size="46" fill="#ff8fa0">≠ «всё нормально»</text></g>`; }
      s += S.POP(h, "бери", 960, 560, `<circle r="230" fill="#ff3d4f"/><text y="-20" text-anchor="middle" font-family="Unb" font-weight="900" font-size="70" fill="#fff">не уверен —</text><text y="70" text-anchor="middle" font-family="Unb" font-weight="900" font-size="70" fill="#fff">не бери</text>`, { out: "календарь" });
      s += S.POP(h, "календарь", 960, 520, `<rect x="-240" y="-200" width="480" height="380" rx="24" fill="#f3efe6"/><rect x="-240" y="-200" width="480" height="80" rx="24" fill="#ff5d6c"/><rect x="-240" y="-140" width="480" height="20" fill="#ff5d6c"/>
        <text y="-145" text-anchor="middle" font-family="Mont" font-weight="800" font-size="34" fill="#fff">НАПОМНИТЬ</text><text y="10" text-anchor="middle" font-family="Mont" font-weight="800" font-size="38" fill="#1a1d29">за неделю до конца</text><text y="70" text-anchor="middle" font-family="Mont" font-weight="800" font-size="38" fill="#1a1d29">льготного периода</text>`);
      return s; },
    hud(t, d, h) { const S = H(); return S.T(h, "жёсткие", 80, 60, [{ t: "Правила тут жёсткие", size: 72 }], { out: "Серьёзно" }) +
      S.T(h, "Серьёзно", 80, 60, [{ t: "Только если гасишь всё", size: 64 }, { t: "до конца срока", size: 64, color: "#2ee07a" }]) + A().foot(); },
    events(d) { return ev(d, { thud: ["наличных", "бери"], pop: ["переводы", "Минимальный", "календарь"], tick: ["капают"] }); },
  };

  // ── 5г. Цена ошибки: 5 000 ₽ под ~50 % ≈ 200 ₽ в месяц — съедает весь кэшбэк; в первый месяц кредитку не брать ──
  SC.interest = {
    bg(d) { return bgR("bgIn", "#2a1020", "#070205"); },
    fg(t, d, h) { const a = A(), S = H(); let s = "";
      if (h.on("пять")) { const v = h.on("двести") ? lerp(0, 200, out3(h.since("двести") / 1.2)) : 0;
        s += S.POP(h, "пять", 560, 520, `<rect x="-320" y="-200" width="640" height="400" rx="30" fill="#141a2e" stroke="#ff3d4f" stroke-width="4"/><text y="-100" text-anchor="middle" font-family="Mont" font-weight="700" font-size="34" fill="#9fb0dd">не вернул 5 000 ₽ · ~50 % годовых</text>
          <text y="40" text-anchor="middle" font-family="Unb" font-weight="900" font-size="100" fill="#ff8fa0">≈ ${fmt(v)} ₽</text><text y="120" text-anchor="middle" font-family="Mont" font-weight="800" font-size="34" fill="#ff8fa0">процентов каждый месяц</text>`); }
      // копилка кэшбэка пустеет
      if (h.on("пропуск")) { const k = cl(h.since("пропуск") / 1.5), n = Math.round(6 * (1 - k)); let st = ""; for (let i = 0; i < n; i++) st += a.coin(0, -i * 22, 40, { sx: 1 });
        s += `<g transform="translate(1400 760)">${st}<text y="120" text-anchor="middle" font-family="Mont" font-weight="800" font-size="34" fill="#c9d3f2">кэшбэк за месяц</text>${k >= 1 ? `<text y="-40" text-anchor="middle" font-family="Unb" font-weight="900" font-size="80" fill="#ff3d4f">0 ₽</text>` : ""}</g>`; }
      if (h.on("первый")) s += S.POP(h, "первый", 1400, 420, `${a.card(0, 0, 340, { c1: "#ff5d8f", c2: "#b0174a", num: "0005" })}<path d="M-200 -140 L200 140" stroke="#ff3d4f" stroke-width="24" stroke-linecap="round"/><text y="200" text-anchor="middle" font-family="Mont" font-weight="800" font-size="34" fill="#fff">не в первый месяц</text>`);
      return s; },
    hud(t, d, h) { const S = H(); return S.T(h, "пропуск", 80, 60, [{ t: "Один пропуск съедает", size: 64 }, { t: "весь кэшбэк", size: 64, color: "#ff5d6c" }], { out: "первый" }) +
      S.T(h, "первый", 80, 60, [{ t: "Сначала обычная карта", size: 60 }, { t: "и накопительный", size: 60, color: "#2ee07a" }], { out: "соберём" }) +
      S.T(h, "соберём", 80, 60, [{ t: "Соберём всё в один план", size: 70, color: "#ffd60a" }]) + `<text x="960" y="1050" text-anchor="middle" font-family="Mont" font-weight="500" font-size="22" fill="#c9d3f2" opacity=".55">Грубый расчёт, пример · Условия на дату записи</text>`; },
    events(d) { return ev(d, { pop: ["пять", "первый"], ticks: [], thud: ["пропуск"], whoosh: ["соберём"] }); },
  };

  // ── 6а. План на первый месяц: весы — бонусы за месяц против часов курьером ───────────────────────────────────
  SC.plan = {
    bg(d) { return `<radialGradient id="bg11" cx="50%" cy="35%" r="85%"><stop offset="0" stop-color="#1e2a5c"/><stop offset=".6" stop-color="#0a0f26"/><stop offset="1" stop-color="#04060f"/></radialGradient>
      <rect x="-800" y="-600" width="3520" height="2400" fill="url(#bg11)"/><circle cx="960" cy="380" r="420" fill="#ffd60a" opacity=".08" filter="url(#b60)"/><rect x="-800" y="930" width="3520" height="900" fill="#070a18"/>`; },
    fg(t, d, h) { const a = A(), S = H(); let s = "";
      // сколько «весит» правая чаша: по словам добавляются предметы; весы выравниваются, когда появляются часы курьера
      const items = ["карта", "друга", "Кэшбэк", "накопительном"].filter(k => h.on(k)).length, hrs = h.on("семи");
      const tilt = hrs ? lerp(-8, 0, out3(h.since("семи") / .8)) : -2 * items + Math.sin(t * 2) * .6;
      const L = 500, cx = 960, cy = 290, dx = Math.cos(tilt * Math.PI / 180) * L, dy = Math.sin(tilt * Math.PI / 180) * L;
      const lx = cx - dx, ly = cy - dy, rx = cx + dx, ry = cy + dy;
      s += `<g filter="url(#soft)"><path d="M860 930 h200 l-40 -50 h-120z" fill="#c9a24a"/><rect x="948" y="300" width="24" height="590" rx="10" fill="#e3bf5e"/><circle cx="960" cy="290" r="30" fill="#ffd60a"/>
        <path d="M${lx} ${ly} L${rx} ${ry}" stroke="#e3bf5e" stroke-width="18" stroke-linecap="round"/>
        <path d="M${lx} ${ly} L${lx - 120} ${ly + 300} M${lx} ${ly} L${lx + 120} ${ly + 300} M${rx} ${ry} L${rx - 120} ${ry + 300} M${rx} ${ry} L${rx + 120} ${ry + 300}" stroke="#c9a24a" stroke-width="5"/>
        <path d="M${lx - 150} ${ly + 300} h300 a150 46 0 0 1 -300 0z" fill="#e3bf5e"/><path d="M${rx - 150} ${ry + 300} h300 a150 46 0 0 1 -300 0z" fill="#e3bf5e"/></g>`;
      // правая чаша: карта, друзья, кэшбэк, накопительный
      const R = [["карта", a.card(0, -40, 160, { c1: "#ffb000", c2: "#ff6a00", rot: -8 })], ["друга", a.card(40, -60, 160, { c1: "#8a5cf6", c2: "#4b2bd1", rot: 6 })], ["Кэшбэк", a.coin(-60, -30, 34)], ["накопительном", a.coin(60, -36, 34) + a.coin(20, -70, 30)]];
      R.forEach(([k, g]) => { if (!h.on(k)) return; const kk = out5(h.since(k) / .5); s += `<g transform="translate(${rx} ${ry + 300 - 200 * (1 - kk)})" opacity="${kk}">${g}</g>`; });
      if (hrs) { const kk = out5(h.since("семи") / .5); s += `<g transform="translate(${lx} ${ly + 300 - 200 * (1 - kk)})" opacity="${kk}"><g transform="rotate(-4)"><rect x="-110" y="-150" width="160" height="150" rx="14" fill="url(#boxG)"/><rect x="-110" y="-150" width="160" height="24" rx="10" fill="#fff07a"/></g>
        <g transform="translate(90 -70)"><circle r="62" fill="#f3efe6"/><circle r="62" fill="none" stroke="#1a1d29" stroke-width="8"/><path d="M0 0 V-40" stroke="#1a1d29" stroke-width="8" stroke-linecap="round" transform="rotate(${(t * 180).toFixed(0)})"/></g></g>`; }
      // суммы под чашами
      const sum = [0, 1500, 3500, 3900, 4000][items];
      if (items) s += `<text x="${rx}" y="${ry + 440}" text-anchor="middle" font-family="Unb" font-weight="900" font-size="54" fill="#2ee07a">${h.on("Выходит") ? "3 500–5 500 ₽" : "≈ " + fmt(sum) + " ₽"}</text>`;
      if (hrs) s += `<text x="${lx}" y="${ly + 440}" text-anchor="middle" font-family="Unb" font-weight="900" font-size="54" fill="#f5f1e8">7–16 часов</text><text x="${lx}" y="${ly + 490}" text-anchor="middle" font-family="Mont" font-weight="700" font-size="28" fill="#c9d3f2">курьером пешком</text>`;
      if (h.on("семи")) s += `<g filter="url(#glow)" opacity="${out3(h.since("семи") / .6)}"><text x="960" y="560" text-anchor="middle" font-family="Unb" font-weight="900" font-size="120" fill="#ffd60a">=</text></g>`;
      // «представь: 18 и ноль на карте»
      if (!h.on("карта")) s += S.POP(h, "восемнадцать", 960, 600, `${a.card(0, 0, 360, { c1: "#5a5f80", c2: "#2a2f45", num: "0000" })}<text y="20" text-anchor="middle" font-family="Unb" font-weight="900" font-size="90" fill="#fff">0 ₽</text>`);
      return s; },
    hud(t, d, h) { const S = H(); return S.T(h, "восемнадцать", 960, 60, [{ t: "Тебе 18, на карте ноль", size: 70 }], { anchor: "middle", out: "карта" }) +
      S.T(h, "карта", 960, 60, [{ t: "Первый месяц · пример", size: 70 }], { anchor: "middle", out: "пример" }) +
      S.T(h, "пример", 960, 60, [{ t: "Пример, а не обещание", size: 64, color: "#ffd60a" }, { t: "суммы у каждого банка свои и меняются каждый месяц", size: 30, font: "Mont", w: 700, ls: 0, color: "#c9d3f2" }], { anchor: "middle" }) + A().foot(); },
    events(d) { return ev(d, { pop: ["восемнадцать"], thud: ["карта", "друга", "Кэшбэк", "накопительном", "семи"], coin: ["Выходит"] }); },
  };

  // ── 6б. Порядок по неделям ──────────────────────────────────────────────────────────────────────────────
  SC.weeks = {
    bg(d) { return bgR("bgWk", "#1a2a5c", "#05070f"); },
    fg(t, d, h) { const a = A(), S = H(); let s = "";
      const Wk = [["Первая", "неделя 1", "карта + покупка", "#ff8a3d"], ["Вторая", "неделя 2", "накопительный + напоминание", "#2ec4b6"], ["Третья", "неделя 3", "ссылка 2–3 друзьям", "#8a5cf6"], ["Четвёртая", "неделя 4", "категории кэшбэка", "#4a8dff"]];
      Wk.forEach(([k, a1, b, c], i) => { s += S.POP(h, k, 300 + i * 440, 520, `<rect x="-200" y="-220" width="400" height="440" rx="34" fill="#141a2e" stroke="${c}" stroke-width="5"/><rect x="-200" y="-220" width="400" height="90" rx="34" fill="${c}"/><rect x="-200" y="-160" width="400" height="30" fill="${c}"/>
        <text y="-160" text-anchor="middle" font-family="Unb" font-weight="900" font-size="40" fill="#0b0f1c">${a1}</text>${b.split(" + ").map((x, j) => `<text y="${-20 + j * 60}" text-anchor="middle" font-family="Mont" font-weight="800" font-size="34" fill="#fff">${x}</text>`).join("")}
        <circle cy="140" r="36" fill="${c}"/><path d="M-14 140 l10 10 l20 -22" stroke="#0b0f1c" stroke-width="7" fill="none" stroke-linecap="round"/>`, { float: 1 }); });
      s += S.POP(h, "Кредитку", 960, 900, `${chip("кредитка — не раньше второго месяца", "#ff5d8f", "#fff", 36)}`);
      return s; },
    hud(t, d, h) { const S = H(); return S.T(h, "порядок", 960, 60, [{ t: "И порядок", size: 76 }], { anchor: "middle", out: "меньше" }) +
      S.T(h, "меньше", 960, 60, [{ t: "Меньше часа действий в месяц", size: 64, color: "#2ee07a" }], { anchor: "middle" }); },
    events(d) { return ev(d, { pop: ["порядок", "Первая", "Вторая", "Третья", "Четвёртая", "Кредитку"], whoosh: ["меньше"] }); },
  };

  // ── 6в. Шестой способ: «оформи карту и передай нам» → решётка и статья ──────────────────────────────────────
  SC.drop = {
    bg(d) { return `<radialGradient id="bg12" cx="35%" cy="45%" r="85%"><stop offset="0" stop-color="#3a0a14"/><stop offset=".6" stop-color="#16040a"/><stop offset="1" stop-color="#070104"/></radialGradient>
      <rect x="-800" y="-600" width="3520" height="2400" fill="url(#bg12)"/><circle cx="640" cy="520" r="460" fill="#ff2a3a" opacity=".12" filter="url(#b60)"/>`; },
    fg(t, d, h) { const S = H(); let s = "";
      let ph = `<rect x="-250" y="-470" width="500" height="940" rx="60" fill="#0b0d14"/><rect x="-230" y="-450" width="460" height="900" rx="46" fill="#151a26"/>
        <rect x="-230" y="-450" width="460" height="110" rx="46" fill="#1d2433"/><rect x="-230" y="-380" width="460" height="40" fill="#1d2433"/>
        <circle cx="-160" cy="-385" r="30" fill="#ff8a3d"/><text x="-160" y="-375" text-anchor="middle" font-family="Unb" font-weight="900" font-size="26" fill="#1a0d00">₽</text>
        <text x="-115" y="-392" font-family="Mont" font-weight="800" font-size="26" fill="#fff">Подработка | Карты</text><text x="-115" y="-360" font-family="Mont" font-weight="600" font-size="20" fill="#7f8bb0">был(а) недавно</text>`;
      const msg = (y, lines, w, key) => { if (!h.on(key)) return ""; const k = out5(h.since(key) / .4); return `<g transform="translate(0 ${(20 * (1 - k)).toFixed(0)})" opacity="${k}"><rect x="-205" y="${y}" width="${w}" height="${lines.length * 40 + 30}" rx="24" fill="#262e40"/>` + lines.map((tx, i) => `<text x="-180" y="${y + 48 + i * 40}" font-family="Mont" font-weight="600" font-size="28" fill="#eef1fa">${tx}</text>`).join("") + `</g>`; };
      ph += msg(-300, ["Привет! Есть подработка"], 360, "напишут") + msg(-200, ["Оформи карту на себя", "и передай нам"], 380, "Оформи") + msg(-60, ["Заплатим несколько", "десятков тысяч ₽"], 360, "заплатим");
      if (!h.on("подработка")) ph += `<rect x="-205" y="90" width="120" height="56" rx="24" fill="#262e40"/><g fill="#7f8bb0">${[0, 1, 2].map(i => `<circle cx="${-170 + i * 26}" cy="${118 - Math.abs(Math.sin(t * 6 + i)) * 6}" r="7"/>`).join("")}</g>`;
      s += `<g transform="translate(620 540) rotate(-6)" filter="url(#soft)">${ph}</g>`;
      // решётка опускается
      if (h.on("уголовная")) { const k = out3(h.since("уголовная") / .6); s += `<g opacity=".6" transform="translate(0 ${(-1100 * (1 - k)).toFixed(0)})">${Array.from({ length: 9 }, (_, i) => `<rect x="${980 + i * 110}" y="-40" width="34" height="1160" fill="#000" filter="url(#b6)"/>`).join("")}</g>`; }
      // штамп
      if (h.on("уголовная")) { const k = h.since("уголовная"), sc = k < .25 ? lerp(2.2, 1, k / .25) : 1;
        s += `<g transform="translate(1400 620) rotate(-12) scale(${sc.toFixed(3)})" opacity="${cl(k / .1)}"><rect x="-330" y="-120" width="660" height="240" rx="22" fill="none" stroke="#ff3d4f" stroke-width="12"/><rect x="-310" y="-100" width="620" height="200" rx="14" fill="none" stroke="#ff3d4f" stroke-width="4"/>
          <text x="0" y="-12" text-anchor="middle" font-family="Unb" font-weight="900" font-size="86" fill="#ff3d4f" letter-spacing=".06em">ДРОППЕР</text><text x="0" y="62" text-anchor="middle" font-family="Mont" font-weight="800" font-size="38" fill="#ff3d4f">ст. 187 УК РФ · до 3 лет</text></g>`; }
      s += S.POP(h, "шести", 1400, 870, chip("схемы с чужими картами — до 6 лет", "#ff3d4f", "#fff", 30));
      s += S.POP(h, "законные", 1400, 300, chip("способы 1–5 — законные", "#2ee07a", "#06140b", 40), { out: "Шестой" });
      return s; },
    hud(t, d, h) { const S = H(); return S.T(h, "шестой", 1020, 60, [{ t: "Шестой способ", size: 80 }, { t: "единственный, где платишь ты", size: 40, color: "#ff8fa0", font: "Mont", w: 800, ls: 0 }], { out: "Деньги" }) +
      S.T(h, "июля", 1026, 980, [{ t: "176-ФЗ, в силе с 05.07.2025", size: 26, font: "Mont", w: 600, ls: 0, color: "#ffc2c8" }]) +
      S.T(h, "Деньги", 1020, 60, [{ t: "Деньги — один раз,", size: 60 }, { t: "проблемы — надолго", size: 60, color: "#ff5d6c" }], { out: "законные" }); },
    events(d) { return ev(d, { notif: ["напишут", "Оформи", "заплатим"], impact: ["уголовная"], thud: ["шести"], pop: ["законные"] }); },
  };

  // ── 7. Финал: три правила, телеграм, вопрос в комментарии, следующий ролик ──────────────────────────────────
  SC.final = {
    bg(d) { return bgR("bgFi", "#20306a", "#05070f", A().bokeh(51, 40, [-200, 0, 2100, 1080], ["#ffd60a", "#2ec4b6", "#8a5cf6"], { blur: "b30", r0: 20, r1: 70 })); },
    fg(t, d, h) { const a = A(), S = H(); let s = "";
      const R = [["Первое", "1", "банк платит новичкам —", "правило трёх галочек", "#ff8a3d"], ["Второе", "2", "постоянные деньги —", "за друзей", "#8a5cf6"], ["Третье", "3", "кредитка — только если", "гасишь всё до срока", "#ff5d8f"]];
      R.forEach(([k, n, l1, l2, c], i) => { s += S.POP(h, k, 340 + i * 620, 520, `<rect x="-280" y="-240" width="560" height="480" rx="40" fill="#141a2e" stroke="${c}" stroke-width="6"/><circle cy="-150" r="60" fill="${c}"/><text y="-122" text-anchor="middle" font-family="Unb" font-weight="900" font-size="76" fill="#0b0f1c">${n}</text>
        <text y="10" text-anchor="middle" font-family="Mont" font-weight="800" font-size="34" fill="#c9d3f2">${l1}</text><text y="70" text-anchor="middle" font-family="Mont" font-weight="800" font-size="40" fill="#fff">${l2}</text>`, { out: "Актуальные" }); });
      if (h.on("Актуальные")) { s += S.POP(h, "Актуальные", 640, 540, `<rect x="-260" y="-300" width="520" height="600" rx="50" fill="#0b0d14"/><rect x="-240" y="-280" width="480" height="560" rx="38" fill="#0f1726"/><circle cx="0" cy="-160" r="70" fill="#ffd60a"/><text y="-136" text-anchor="middle" font-family="Unb" font-weight="900" font-size="70" fill="#1a1400">В</text>
        <text y="-40" text-anchor="middle" font-family="Mont" font-weight="800" font-size="40" fill="#fff">Владик Арбузит</text><text y="10" text-anchor="middle" font-family="Mont" font-weight="600" font-size="28" fill="#7f8bb0">акции на этот месяц</text>
        <rect x="-200" y="120" width="400" height="80" rx="40" fill="#2aa3e0"/><text y="172" text-anchor="middle" font-family="Mont" font-weight="800" font-size="34" fill="#fff">Подписаться</text>`); }
      if (h.on("комментариях")) s += S.POP(h, "комментариях", 1360, 420, `<path d="M-300 -110 h600 a30 30 0 0 1 30 30 v160 a30 30 0 0 1 -30 30 h-480 l-60 60 v-60 h-60 a30 30 0 0 1 -30 -30 v-160 a30 30 0 0 1 30 -30z" fill="#f5f1e8"/><text y="-10" text-anchor="middle" font-family="Mont" font-weight="800" font-size="40" fill="#1a1d29">Какой способ</text><text y="50" text-anchor="middle" font-family="Mont" font-weight="800" font-size="40" fill="#1a1d29">попробуешь первым?</text>`);
      if (h.on("Следующий")) s += S.POP(h, "Следующий", 1360, 800, `<rect x="-330" y="-110" width="660" height="220" rx="30" fill="#141a2e" stroke="#ffd60a" stroke-width="4"/><text y="-30" text-anchor="middle" font-family="Mont" font-weight="700" font-size="30" fill="#9fb0dd">следующий ролик</text><text y="40" text-anchor="middle" font-family="Unb" font-weight="900" font-size="44" fill="#ffd60a">Почему бонус не пришёл</text>`);
      return s; },
    hud(t, d, h) { const S = H(); return S.T(h, "три", 960, 60, [{ t: "Если запомнить только три вещи", size: 64 }], { anchor: "middle", out: "Актуальные" }); },
    events(d) { return ev(d, { pop: ["три", "Первое", "Второе", "Третье", "Актуальные", "комментариях", "Следующий"] }); },
  };
})();
