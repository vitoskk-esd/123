// ep64 «Тёща: машина на дачу»: герои и реквизит (базовые помощники — props.js)
// тёща Зинаида Петровна (новая героиня): из героини «vika» — сливовое пальто, рыжая «хна», очки
const TGLASS = `<g><circle cx="181" cy="219" r="27" fill="#cfe8f5" fill-opacity=".25" stroke="#151515" stroke-width="6"/><circle cx="243" cy="219" r="27" fill="#cfe8f5" fill-opacity=".25" stroke="#151515" stroke-width="6"/><path d="M208 219 h8 M154 214 l-18 -6 M270 214 l18 -6" stroke="#151515" stroke-width="5"/></g>`;
const TSC = html => html.replaceAll("#8e1f3a", "#8a3a5a").replaceAll("#5c1426", "#6a2a46").replaceAll("#2b1a14", "#c96a2a").replaceAll("#2c3e66", "#4a3a5a").replaceAll("#4a5f8f", "#5a4a6a")
  .replace('<path d="M210 232 q-10 22 2 28"', TGLASS + '<path d="M210 232 q-10 22 2 28"');
const PRIORA = "priora/priora_white.png", NIVA = "niva/niva_34.png";
Object.assign(CINE.SIZES, { [PRIORA]: [1263, 410], [NIVA]: [669, 361] });
const INHAND = (x, foot, h, arm, w, html, z = 8, rot = 0, id = "") => {
  const s = h / 740, l = x - 210 * s, t = foot - 740 * s, A = arm * Math.PI / 180;
  const hx = l + (292 + 26 * Math.cos(A) - 130 * Math.sin(A)) * s, hy = t + (400 + 26 * Math.sin(A) + 130 * Math.cos(A)) * s;
  return `<div class="prop"${id ? ` id="${id}"` : ""} style="left:${hx - w / 2}px;top:${hy - w / 2}px;width:${w}px;height:${w}px;z-index:${z};transform:rotate(${rot}deg)">${html}</div>`;
};
const TITLE = (a, b) => `<div style="position:absolute;left:0;right:0;top:300px;text-align:center;font-family:Unbounded;font-weight:900;line-height:1;letter-spacing:-3px;z-index:50">
  <span style="display:inline-block;padding:10px 28px 18px;border:8px solid #151515;border-radius:22px;box-shadow:0 12px 0 #151515;font-size:82px;background:#ffd23f;color:#151515;transform:rotate(-3deg)">${a}</span><br>
  <span style="display:inline-block;padding:10px 28px 18px;border:8px solid #151515;border-radius:22px;box-shadow:0 12px 0 #151515;font-size:104px;background:#ff3b30;color:#fff;margin-top:26px;transform:rotate(2deg)">${b}</span></div>`;
// праздничный стол: скатерть, оливье, селёдка под шубой, графин компота (поверх ног)
const DTABLE = (z = 9) => `<div style="left:100px;top:1380px;width:880px;height:560px;z-index:${z}"><svg viewBox="0 0 880 560" style="overflow:visible">
  <ellipse cx="440" cy="50" rx="430" ry="50" fill="#fbf6ec" stroke="#151515" stroke-width="7"/><path d="M10 50 Q0 300 40 560 H840 Q880 300 870 50 Q440 140 10 50 Z" fill="#f1e6d2" stroke="#151515" stroke-width="7"/>
  ${[80, 200, 320, 440, 560, 680, 800].map(x => `<circle cx="${x}" cy="${120 + Math.abs(440 - x) * .06}" r="8" fill="#c0392b" opacity=".6"/>`).join("")}
  <ellipse cx="250" cy="20" rx="90" ry="26" fill="#fff" stroke="#151515" stroke-width="5"/><ellipse cx="250" cy="10" rx="70" ry="18" fill="#ffe08a"/>${[220, 250, 280].map(x => `<circle cx="${x}" cy="8" r="6" fill="#4cd964"/>`).join("")}
  <ellipse cx="620" cy="20" rx="90" ry="26" fill="#fff" stroke="#151515" stroke-width="5"/><ellipse cx="620" cy="10" rx="70" ry="18" fill="#a83a6a"/>
  <path d="M430 -70 q-20 0 -20 40 v50 h60 v-50 q0 -40 -20 -40 z" fill="#ff8a6a" fill-opacity=".7" stroke="#151515" stroke-width="5"/></svg></div>`;
// приём 1 — «рентген» тёщи: Приора в негативе, линия сканирования, красные метки дефектов (id — для появления по одной)
const XRAY = () => `<div style="left:0;top:0;width:1080px;height:1920px;background:#04122a"></div>
  <div style="left:0;top:0;width:1080px;height:1920px;background-image:linear-gradient(#1a4a7a55 2px,transparent 2px),linear-gradient(90deg,#1a4a7a55 2px,transparent 2px);background-size:60px 60px"></div>
  <img src="../../kit/img/${PRIORA}" style="position:absolute;left:40px;top:760px;width:1000px;filter:grayscale(1) sepia(1) hue-rotate(150deg) saturate(3) brightness(.95) drop-shadow(0 0 18px #3fd0ff);opacity:.85;mix-blend-mode:screen">
  <div id="xscan" style="position:absolute;left:0;top:700px;width:1080px;height:16px;background:#7fffd4;box-shadow:0 0 40px #7fffd4;opacity:.8"></div>
  <div style="position:absolute;left:60px;top:300px;font-family:'JetBrains Mono';font-weight:800;font-size:44px;color:#7fffd4;letter-spacing:2px">● СКАНИРОВАНИЕ: ПРИОРА ЖОРЫ</div>
  ${[["xr0", 680, 820, "ПРОБЕГ: 380 000<br><small>а не 98 000</small>", 560, 470], ["xr1", 300, 1040, "ПОРОГИ — ШПАКЛЁВКА", 110, 1420], ["xr2", 930, 1010, "КРЫЛО КРАШЕНОЕ", 560, 1300], ["xr3", 140, 860, "РЕМЕНЬ ГРМ — 2012 г.", 60, 560]]
    .map(([id, cx, cy, t, lx, ly]) => `<div id="${id}"><svg style="position:absolute;left:0;top:0;width:1080px;height:1920px;overflow:visible" viewBox="0 0 1080 1920"><circle cx="${cx}" cy="${cy}" r="70" fill="none" stroke="#ff3b30" stroke-width="9"/><path d="M${cx} ${cy + (ly > cy ? 70 : -70)} L${lx + 150} ${ly + (ly > cy ? 0 : 90)}" stroke="#ff3b30" stroke-width="6"/></svg>
      <div style="position:absolute;left:${lx}px;top:${ly}px;background:#ff3b30;color:#fff;border:5px solid #151515;border-radius:14px;padding:8px 16px;font-family:Unbounded;font-weight:900;font-size:34px;line-height:1.1;white-space:nowrap">${t.replace("<small>", '<small style="font-size:26px;font-family:Onest">')}</div></div>`).join("")}`;
// блик в очках (поверх лица крупного плана): две «линзы» вспыхивают
const GLINT = (x, foot, h, id = "gl") => { const s = h / 740, l = x - 210 * s, t = foot - 740 * s;
  return `<div id="${id}" style="position:absolute;left:${l}px;top:${t}px;width:${420 * s}px;height:${800 * s}px;z-index:12;opacity:0"><svg viewBox="0 0 420 800" style="overflow:visible">
  <circle cx="176" cy="216" r="26" fill="#bff6ff"/><circle cx="244" cy="216" r="26" fill="#bff6ff"/>${[176, 244].map(c => `<path d="M${c - 40} 216 H${c + 40} M${c} 176 V256" stroke="#fff" stroke-width="5"/>`).join("")}</svg></div>`; };
// приём 2 — тетрадь тёщи: аккуратные столбики (строки — id для появления по одной)
const NOTEBOOK = () => `<div style="left:0;top:0;width:1080px;height:1920px;background:radial-gradient(circle at 50% 50%,#8a3a5a,#2a1020 80%)"></div>
  <div style="left:90px;top:440px;width:900px;height:1040px;background:#fbfaf3;transform:rotate(-2deg);box-shadow:0 20px 40px #0009;
    background-image:linear-gradient(#c9d6e6 2px,transparent 2px),linear-gradient(90deg,#c9d6e6 2px,transparent 2px);background-size:45px 45px;border-left:40px solid #2f6a3a">
    <div style="position:absolute;left:50px;top:40px;font-family:Caveat;font-weight:700;color:#1d3a8a;line-height:1.35">
      <div id="nb0" style="font-size:80px;color:#c0392b;text-decoration:underline">Машина на дачу</div>
      <div id="nb1" style="font-size:66px">Нива 2019 — рынок 700 т.</div>
      <div id="nb2" style="font-size:66px">Приора Жоры — 400? <span style="color:#c0392b">❌ 150</span></div>
      <div id="nb3" style="font-size:66px">Бот: Нива 590 т. ✔</div>
      <div id="nb4" style="font-size:66px;color:#2f6a3a">Экономия: 110 т. → теплица</div></div></div>`;
// ящик рассады
const SEEDBOX = (id = "") => `<svg${id ? ` id="${id}"` : ""} viewBox="0 0 140 90" style="overflow:visible"><rect x="0" y="40" width="140" height="50" fill="#a8743f" stroke="#151515" stroke-width="5"/>${[18, 46, 74, 102, 126].map(x => `<path d="M${x} 42 q-10 -26 -2 -40 M${x} 42 q10 -22 4 -36" stroke="#3a9a3a" stroke-width="6" fill="none"/><circle cx="${x - 2}" cy="4" r="6" fill="#4cd964"/>`).join("")}</svg>`;
// бот на экране у тёщи
const NVCARD = () => BOTH("Нива · до 650 тыс", `<div id="ncc">${CARD("Lada Niva Legend · 2019", "590 000 ₽", "рынок ≈ 700 000 ₽ · 1 владелец", "🔥 −16% к рынку · ⏱ 1 с после публикации")}</div>`);
const CTA64 = `<div style="position:absolute;left:60px;right:60px;top:1330px;z-index:70;background:#ffd23f;border:8px solid #151515;border-radius:34px;padding:26px 30px;box-shadow:0 14px 0 #151515;font-family:Unbounded;font-weight:900;color:#151515;text-align:center">
  <div style="font-size:52px;line-height:1.12">Бот <span style="color:#c0392b">«Перехват»</span><br>— ссылка в шапке</div><div style="margin-top:12px;font-size:30px;font-family:Onest;font-weight:800">объявления по всей России · через ~1 с после публикации</div></div>`;
