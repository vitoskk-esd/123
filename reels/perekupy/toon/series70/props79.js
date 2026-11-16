// ep79 «Толян · 18: тест-драйв с дедом» (сезон «Свой автосалон», без мата): герои и реквизит (базовые помощники — props.js)
// Новый герой: покупатель Гоша (айтишник: худи, очки, борода). Возвращаются: дед Палыч, Римма Захаровна, Лёха (по видеосвязи), Жора (бинокль).
const RIM = html => html.replaceAll("#8e1f3a", "#4a4f63").replaceAll("#5c1426", "#33374a").replaceAll("#2b1a14", "#7a2a1a").replaceAll("#2c3e66", "#2b2f37")
  .replace(/fill="#ff3b30" stroke="#151515" stroke-width="4" transform="rotate\(-20/g, 'fill="#f4f0e8" stroke="#151515" stroke-width="4" transform="rotate(-20');
const PAL = { jacket: "#6a4a2a", pants: "#3a3f46", hair: "#e8e8e8", mustache: true, glasses: true, cap: "#3a4a3a", look: "flat" };   // дед Палыч (новый герой)
const GOSHA = { jacket: "#5a7a3a", pants: "#2c3e66", hair: "#6a4a2a", beard: true, glasses: true, look: "grin" };   // покупатель Гоша (новый герой)
const LEHA_O = { jacket: "#151515", pants: "#1d1d22", hair: "#e8b48d", chain: true, look: "flat" };
// лысина (убираем причёску) + татуировки: шея, висок, кисти
const LEHA = html => html
  .replace(/<path d="M124 186 q-4 -102 86 -104 q90 2 86 104 q-26 -46 -86 -46 q-60 0 -86 46 z" fill="#e8b48d"[^>]*\/>/g, '<path d="M150 120 q60 -40 120 0" stroke="#f4d0b0" stroke-width="10" fill="none" opacity=".7" stroke-linecap="round"/>')
  .replace(/(<path d="M188 330 h44 v40 h-44 z"[^>]*\/>)/g, '$1<path d="M194 340 q8 10 0 20 M206 336 l6 10 l6 -10 l6 10 M222 344 q6 8 0 18" stroke="#1f2f55" stroke-width="6" fill="none"/>'
    + '<path d="M196 368 l14 -18 l14 18" stroke="#1f2f55" stroke-width="6" fill="none"/>')
  .replace(/(<ellipse cx="298" cy="232" rx="20" ry="28"[^>]*\/>)/g, '$1<path d="M262 120 q22 10 24 40 q-14 -10 -26 -6 q14 14 10 34 q-12 -16 -26 -18" stroke="#1f2f55" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M110 250 q-8 14 2 26" stroke="#1f2f55" stroke-width="5" fill="none"/>')
  .replace(/(<circle cx="106" cy="532" r="17"[^>]*\/>)/g, '$1<path d="M96 524 l10 10 l10 -10 M98 542 h16" stroke="#1f2f55" stroke-width="4" fill="none"/>');
const V05 = "vaz2105/vaz2105_34.png", V05S = "vaz2105/vaz2105_side_r.png", GRA = "granta/granta_34.png", V10 = "vaz2110/vaz2110_34.png";
Object.assign(CINE.SIZES, { [V05]: [775, 352], [V05S]: [724, 267], [GRA]: [791, 366], [V10]: [735, 342] });
const GRCARD = (id = "gcc") => BOTH("Седан · до 400 тыс", `<div id="${id}">${CARD("Lada Granta · 2017 · 1 владелец", "330 000 ₽", "рынок ≈ 400 000 ₽ · твой город", "🔥 −18% к рынку · ⏱ 1 с после публикации")}</div>`);
const V10CARD = (id = "tcc") => BOTH("Седан · до 400 тыс", `<div id="${id}">${CARD("ВАЗ-2110 · 2006 · капот другого цвета", "110 000 ₽", "рынок ≈ 150 000 ₽ · твой город", "🔥 −27% к рынку · ⏱ 1 с после публикации")}</div>`);
const CNT77 = (money, cars) => `<div id="cnt77" style="position:absolute;left:40px;top:250px;z-index:60;font-family:'JetBrains Mono';font-weight:800;font-size:46px;color:#fff;background:#151515;border:6px solid #4cd964;border-radius:22px;padding:10px 22px;line-height:1.25">
  💰 <span id="cv">${money}</span> ₽<br>🚗 <span id="cc">${cars}</span>/10 <span style="font-size:30px;color:#8b93a3">на площадке</span></div>`;
const SIGN77 = (x = 300, y = 590, z = 3, sc = 1) => `<div style="position:absolute;left:${x}px;top:${y}px;z-index:${z};transform-origin:0 0;scale:${sc};background:#ffd23f;border:8px solid #151515;box-shadow:0 10px 0 #151515;padding:8px 26px 12px;font-family:Unbounded;font-weight:900;font-size:44px;color:#151515;transform:rotate(-2deg);white-space:nowrap">АВТОСАЛОН ТОЛЯНА</div>`;
const ZBANNER = (id = "zb", z = 3) => `<div id="${id}" style="position:absolute;left:580px;top:600px;width:440px;height:110px;z-index:${z};transform-origin:50% 0;background:#c0392b;border:6px solid #151515;box-sizing:border-box;font-family:Unbounded;font-weight:900;color:#fff;text-align:center;line-height:1.05;padding-top:10px">
  <div style="font-size:38px">ЖОРА МОТОРС</div><div style="font-size:24px;color:#ffd23f">СКОРО ОТКРЫТИЕ</div></div>`;
// дождь поверх сцены: косые струи (#rain — сдвигаем фон, чтобы капли падали)
const RAIN = (id = "rain", z = 30) => `<div id="${id}" style="position:absolute;left:-200px;top:-400px;width:1480px;height:2720px;z-index:${z};pointer-events:none;opacity:.35;
  background-image:repeating-linear-gradient(105deg, transparent 0 22px, rgba(220,232,240,.55) 22px 25px, transparent 25px 64px);transform:translateY(0)"></div>`;
// торпеда «пятёрки» на переднем плане поверх героев (вид из салона назад)
const DASH05 = (z = 20) => `<svg style="position:absolute;left:0;top:0;width:1080px;height:1920px;z-index:${z}" viewBox="0 0 1080 1920">
  <path d="M-20 1620 Q540 1540 1100 1620 V1940 H-20 Z" fill="#3a2e28" stroke="#000" stroke-width="8"/><path d="M-20 1620 Q540 1540 1100 1620" stroke="#5a4a40" stroke-width="18" fill="none"/>
  <circle cx="820" cy="1900" r="250" fill="none" stroke="#151515" stroke-width="26"/><path d="M570 1900 h500" stroke="#151515" stroke-width="20"/><circle cx="820" cy="1900" r="56" fill="#2b2c31" stroke="#000" stroke-width="5"/>
  <rect x="120" y="1660" width="220" height="90" rx="12" fill="#2b2c31" stroke="#000" stroke-width="5"/><rect x="140" y="1676" width="180" height="56" fill="#151515"/>
  <text x="230" y="1716" text-anchor="middle" font-family="JetBrains Mono" font-weight="800" font-size="30" fill="#4cd964">МАЯК 103.4</text></svg>`;
// банка огурцов (подарок деда к машине)
const JAR = (x, y, s = 1, id = "jar", z = 12) => `<div id="${id}" style="position:absolute;left:${x}px;top:${y}px;width:${150 * s}px;height:${210 * s}px;z-index:${z}"><svg viewBox="0 0 150 210">
  <rect x="25" y="0" width="100" height="30" rx="6" fill="#c9a03a" stroke="#151515" stroke-width="6"/><path d="M15 34 h120 q12 0 12 14 v140 q0 18 -18 18 h-108 q-18 0 -18 -18 v-140 q0 -14 12 -14 z" fill="#dff0e6" fill-opacity=".85" stroke="#151515" stroke-width="7"/>
  ${[[40, 70], [80, 60], [110, 90], [50, 120], [95, 130], [60, 170], [105, 170]].map(([cx, cy]) => `<ellipse cx="${cx}" cy="${cy}" rx="16" ry="34" fill="#4a8a3a" stroke="#2a5a1a" stroke-width="3" transform="rotate(${cx % 30 - 15} ${cx} ${cy})"/>`).join("")}
  <rect x="35" y="100" width="80" height="40" fill="#f4f0e8" stroke="#151515" stroke-width="4"/><text x="75" y="127" text-anchor="middle" font-family="Caveat,cursive" font-size="22" fill="#151515">огурцы</text></svg></div>`;
// приём: разделённый экран — две половины со своими фонами (видеосвязь: Толян под дождём | Лёха в «Роллс-Ройсе»)
const SPLIT2 = (lbg, lhtml, rbg, rhtml) => {
  const fix = h => h.replaceAll('style="left:', 'style="position:absolute;left:');
  const half = (x, bg, html) => `<div style="position:absolute;left:${x}px;top:0;width:534px;height:1920px;overflow:hidden"><div style="position:absolute;left:-273px;top:0;width:1080px;height:1920px">${BGS[bg]}${fix(html)}</div></div>`;
  return `<div style="position:absolute;left:0;top:0;width:1080px;height:1920px;z-index:40;background:#fff">${half(0, lbg, lhtml)}${half(546, rbg, rhtml)}
    <div style="position:absolute;left:527px;top:0;width:26px;height:1920px;background:#fff;box-shadow:0 0 30px #000;z-index:5"></div></div>`; };
// приём: вид в бинокль (Жора подглядывает) — два круга, остальное чёрное
const BINO = () => `<svg style="position:absolute;left:0;top:0;width:1080px;height:1920px;z-index:45;pointer-events:none" viewBox="0 0 1080 1920">
  <defs><mask id="bm"><rect width="1080" height="1920" fill="#fff"/><circle cx="340" cy="960" r="330" fill="#000"/><circle cx="740" cy="960" r="330" fill="#000"/></mask></defs>
  <rect width="1080" height="1920" fill="#000" mask="url(#bm)"/><circle cx="340" cy="960" r="330" fill="none" stroke="#151515" stroke-width="24"/><circle cx="740" cy="960" r="330" fill="none" stroke="#151515" stroke-width="24"/></svg>`;
// телефон крупно: две карточки бота подряд
const TWOCARDS = () => `<div style="position:absolute;left:0;top:0;width:1080px;height:1920px;z-index:40;background:radial-gradient(circle at 50% 40%,#3a4a5e,#121722)">
  <div style="position:absolute;left:230px;top:300px;width:620px;height:1320px;border-radius:72px;background:#0d0e12;border:14px solid #2a2d34;box-shadow:0 30px 80px #000c;overflow:hidden">
    <div style="position:absolute;left:0;top:0;width:580px;padding:40px 30px;transform:scale(1.02);transform-origin:0 0">${GRCARD("gcc2")}<div style="height:26px"></div>${V10CARD("tcc2")}</div></div></div>`;
const PIP = (inner, id, ring = "#ffd23f", left = 700, top = 1440, bgc = "#2b2f37") => `<div id="${id}" class="grp" style="position:absolute;left:${left}px;top:${top}px;width:320px;height:320px;border-radius:50%;overflow:hidden;border:9px solid ${ring};z-index:45;background:${bgc};box-shadow:0 10px 30px #0008">${inner}</div>`;
const PIPS = (inner, p, id, ring, left, top) => { const out = PIP(inner, id, ring, left, top); CINE.ANCH[p] = [left + 160, top + 30, .8]; return out; };
const TITLE = (a, b) => `<div style="position:absolute;left:0;right:0;top:300px;text-align:center;font-family:Unbounded;font-weight:900;line-height:1;letter-spacing:-3px;z-index:50">
  <span style="display:inline-block;padding:10px 28px 18px;border:8px solid #151515;border-radius:22px;box-shadow:0 12px 0 #151515;font-size:82px;background:#ffd23f;color:#151515;transform:rotate(-3deg)">${a}</span><br>
  <span style="display:inline-block;padding:10px 28px 18px;border:8px solid #151515;border-radius:22px;box-shadow:0 12px 0 #151515;font-size:70px;background:#ff3b30;color:#fff;margin-top:26px;transform:rotate(2deg)">${b}</span></div>`;
