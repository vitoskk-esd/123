// ep58 «Экстрасенс»: герои и реквизит (базовые помощники — props.js)
const MAG = { jacket: "#5a2a7a", pants: "#2a1630", hair: "#1d1d1f", beard: true, look: "flat" };       // магистр Эдуард, экстрасенс
const RUSTAM = { jacket: "#3a3f46", pants: "#2b2f37", cap: "#ffd23f", hair: "#1d1d1f", mustache: true, look: "grin" };   // продаёт Весту из таксопарка
const VALERA = { jacket: "#6b4a2b", pants: "#3a3f46", hair: "#8a5a33", look: "grin" };                   // продаёт битую Весту под Тамбовом
const STAS = { jacket: "#3a3f46", pants: "#2b2f37", cap: "#2f6db5", hair: "#8a5a33", look: "grin" };    // перекуп Стас (из «Суда»)
const VE = "vesta/vesta_34.png", VES = "vesta/vesta_side.png";
Object.assign(CINE.SIZES, { [VE]: [781, 375], [VES]: [776, 259] });
const INHAND = (x, foot, h, arm, w, html, z = 8, rot = 0) => {
  const s = h / 740, l = x - 210 * s, t = foot - 740 * s, A = arm * Math.PI / 180;
  const hx = l + (292 + 26 * Math.cos(A) - 130 * Math.sin(A)) * s, hy = t + (400 + 26 * Math.sin(A) + 130 * Math.cos(A)) * s;
  return `<div class="prop" style="left:${hx - w / 2}px;top:${hy - w / 2}px;width:${w}px;height:${w}px;z-index:${z};transform:rotate(${rot}deg)">${html}</div>`;
};
// тюрбан с камнем — поверх головы героя (x, foot, h — как у ch)
const TURBAN = (x, foot, h, z = 9) => { const s = h / 740, t = foot - 740 * s;
  return `<div class="prop" style="left:${x - 125 * s}px;top:${t - 10 * s}px;width:${250 * s}px;height:${150 * s}px;z-index:${z}"><svg viewBox="0 0 250 150">
    <path d="M10 120 Q0 30 125 10 Q250 30 240 120 Q125 150 10 120 Z" fill="#7a3aa8" stroke="#151515" stroke-width="8"/>
    <path d="M30 100 Q125 40 220 100 M40 70 Q125 20 210 70" stroke="#5a2a7a" stroke-width="10" fill="none"/>
    <ellipse cx="125" cy="78" rx="22" ry="28" fill="#4cd9a0" stroke="#151515" stroke-width="6"/><path d="M125 50 v-30" stroke="#e6b422" stroke-width="8"/>
    <circle cx="125" cy="18" r="10" fill="#e6b422" stroke="#151515" stroke-width="4"/></svg></div>`; };
// круглый стол со скатертью и маленьким шаром (поверх ног героев)
const TABLE = (z = 9) => `<div style="left:150px;top:1330px;width:780px;height:600px;z-index:${z}"><svg viewBox="0 0 780 600">
  <ellipse cx="390" cy="60" rx="380" ry="56" fill="#3a1240" stroke="#151515" stroke-width="7"/>
  <path d="M10 60 Q0 400 40 600 H740 Q780 400 770 60 Q390 150 10 60 Z" fill="#5a1a4a" stroke="#151515" stroke-width="7"/>
  ${[0, 1, 2, 3, 4, 5, 6].map(k => `<path d="M${70 + k * 100} 120 q12 240 -6 470" stroke="#4a1240" stroke-width="6" fill="none"/>`).join("")}
  <path d="M10 60 Q390 150 770 60" stroke="#e6b422" stroke-width="10" fill="none" stroke-dasharray="4 18" stroke-linecap="round"/>
  <rect x="330" y="-6" width="120" height="40" rx="8" fill="#e6b422" stroke="#151515" stroke-width="5"/>
  <circle cx="390" cy="-60" r="70" fill="#9fd6ff" fill-opacity=".55" stroke="#151515" stroke-width="6"/><ellipse cx="365" cy="-85" rx="18" ry="12" fill="#fff" opacity=".8"/></svg></div>`;
// приём 1 — хрустальный шар на весь кадр: туман клубится, внутри проявляется машина (inner — что в шаре)
const BALL = (inner, id = "ball", cap = "") => `<div style="left:0;top:0;width:1080px;height:1920px;background:radial-gradient(circle at 50% 46%,#4a1a6a,#12081c 75%)"></div>
  ${[[150, 1500], [930, 1480], [80, 1620], [1000, 1640]].map(([x, y], k) => `<div style="left:${x - 18}px;top:${y - 120}px;width:36px;height:${120 + k * 10}px;background:#f1e6d2;border:4px solid #151515"></div>
    <div class="flame" style="left:${x - 14}px;top:${y - 160}px;width:28px;height:44px;border-radius:50% 50% 50% 50% / 60% 60% 40% 40%;background:radial-gradient(#fff6c8,#ffb84a);box-shadow:0 0 40px #ffb84a"></div>`).join("")}
  <div style="left:330px;top:1196px;width:420px;height:140px;background:linear-gradient(#e6b422,#8a6a1a);border:8px solid #151515;border-radius:30px 30px 60px 60px"></div>
  ${cap ? `<div id="${id}c" style="left:40px;top:250px;width:1000px;text-align:center;font-family:Caveat;font-weight:700;font-size:96px;line-height:1;color:#ffd27a;text-shadow:0 0 30px #ff8a1a">${cap}</div>` : ""}
  <div id="${id}" style="left:190px;top:520px;width:700px;height:700px;border-radius:50%;overflow:hidden;border:10px solid #151515;
    background:radial-gradient(circle at 40% 35%,#d8f0ff,#7ab8e8 45%,#3a5aa8 80%);box-shadow:0 0 140px #9fd6ffaa">
    <div id="${id}f1" style="position:absolute;left:-200px;top:180px;width:1100px;height:340px;border-radius:50%;background:radial-gradient(#ffffffcc,#ffffff00 70%);filter:blur(10px)"></div>
    <div style="position:absolute;inset:0">${inner}</div>
    <div id="${id}f2" style="position:absolute;left:-300px;top:330px;width:1200px;height:380px;border-radius:50%;background:radial-gradient(#e8d8ffcc,#ffffff00 70%);filter:blur(12px)"></div>
    <div style="position:absolute;left:120px;top:90px;width:180px;height:110px;border-radius:50%;background:#ffffffaa;filter:blur(6px)"></div></div>`;
// приём 2 — карты таро: три карты рубашкой вверх, средняя переворачивается
const TAROT = (flip = false) => `<div style="left:0;top:0;width:1080px;height:1920px;background:radial-gradient(circle at 50% 50%,#5a1a4a,#1a0818 80%)"></div>
  ${[-1, 0, 1].map(k => { const x = 540 + k * 320 - 140, r = k * 8, id = `tc${k + 1}`;
    return `<div id="${id}" style="left:${x}px;top:700px;width:280px;height:460px;transform:rotate(${r}deg)${flip && k === 0 ? " rotateY(180deg)" : ""};transform-style:preserve-3d">
      <div class="back" style="position:absolute;inset:0;border-radius:22px;border:8px solid #e6b422;background:repeating-linear-gradient(45deg,#3a1240 0 18px,#4a1a50 18px 36px);backface-visibility:hidden">
        <div style="position:absolute;left:90px;top:180px;width:84px;height:84px;border-radius:50%;border:6px solid #e6b422"></div></div>
      <div class="face" style="position:absolute;inset:0;border-radius:22px;border:8px solid #e6b422;background:#fbf3dc;backface-visibility:hidden;transform:rotateY(180deg);text-align:center">
        ${k === 0 ? `<div style="margin:60px auto 0;width:200px;height:200px;background:conic-gradient(#151515 0 25%,#ffd23f 0 50%,#151515 0 75%,#ffd23f 0);background-size:50px 50px;border:6px solid #151515;border-radius:10px"></div>
          <div style="margin-top:40px;font-family:Unbounded;font-weight:900;font-size:32px;color:#5a1a4a">ШАШЕЧКИ</div>` : ""}</div></div>`; }).join("")}
  <div style="left:0;top:1300px;width:1080px;text-align:center;font-family:Caveat;font-weight:700;font-size:72px;color:#e6b422">карта судьбы</div>`;
// приём 3 — маятник над картой: карта-силуэт, точки городов, маятник качается и замирает над Тамбовом
const MAP = (angle = 0) => `<div style="left:0;top:0;width:1080px;height:1920px;background:#1a0f2a"></div>
  <div style="left:60px;top:560px;width:960px;height:760px;background:#f1e2b8;border:12px solid #6b4423;border-radius:16px;box-shadow:inset 0 0 80px #c9a26a"></div>
  <svg viewBox="0 0 960 760" style="left:60px;top:560px;width:960px;height:760px"><path d="M60 360 Q90 250 200 230 Q300 150 420 190 Q520 120 640 160 Q760 110 860 200 Q920 300 880 420 Q800 520 640 500 Q520 560 400 520 Q280 600 180 540 Q70 500 60 360 Z" fill="#c9d89a" stroke="#6b4423" stroke-width="6"/>
    ${[["Москва", 200, 330], ["Тамбов", 260, 420], ["Казань", 380, 320], ["Уфа", 470, 380], ["Новосибирск", 690, 380], ["Краснодар", 150, 500]].map(([n, x, y]) => `<circle cx="${x}" cy="${y}" r="10" fill="#c0392b"/><text x="${x + 16}" y="${y + 8}" font-family="Onest" font-weight="800" font-size="26" fill="#3a2010">${n}</text>`).join("")}
    <circle id="tamb" cx="260" cy="420" r="36" fill="none" stroke="#c0392b" stroke-width="8" opacity="${angle ? 1 : 0}"/></svg>
  <div id="pend" style="left:540px;top:260px;width:0;height:0;transform-origin:0 0;transform:rotate(${angle}deg)">
    <div style="position:absolute;left:-3px;top:0;width:6px;height:708px;background:#e6b422"></div>
    <div style="position:absolute;left:-34px;top:700px;width:68px;height:90px;background:linear-gradient(#9fd6ff,#4a7aa8);clip-path:polygon(50% 100%,0 30%,50% 0,100% 30%);border:none"></div></div>
  <div style="left:0;top:1380px;width:1080px;text-align:center;font-family:Caveat;font-weight:700;font-size:72px;color:#e6b422">маятник знает</div>`;
// шашечки такси на крышу и полоса на борт (l, ground, w — как у car с VE)
const TAXI = (l, ground, w) => { const h = w * 375 / 781, t = ground - h;
  return `<div class="prop" style="left:${l + w * .42}px;top:${t - 4}px;width:${w * .2}px;height:${w * .08}px;z-index:6;background:conic-gradient(#151515 0 25%,#ffd23f 0 50%,#151515 0 75%,#ffd23f 0);background-size:${w * .04}px ${w * .04}px;border:5px solid #151515;border-radius:6px"></div>`; };
const TAG = (x, y, big, small, rot = -4, bg = "#ffd23f", id = "") => `<div ${id ? `id="${id}"` : ""} style="position:absolute;left:${x}px;top:${y}px;z-index:20;transform:rotate(${rot}deg);background:${bg};border:6px solid #151515;border-radius:14px;padding:8px 18px;box-shadow:0 8px 0 #151515;font-family:Unbounded;font-weight:900;font-size:44px;color:#151515;line-height:1.1">${big}<div style="font-family:'JetBrains Mono';font-weight:800;font-size:30px">${small}</div></div>`;
// толщиномер: прибор и красное значение
const GAUGE = (x, y, id = "gauge") => `<div id="${id}" style="position:absolute;left:${x}px;top:${y}px;z-index:20;width:300px;height:200px;background:#2b2f37;border:8px solid #151515;border-radius:26px;text-align:center;box-shadow:0 10px 0 #151515">
  <div style="margin:18px auto 0;width:240px;height:96px;background:#151515;border-radius:12px;font-family:'JetBrains Mono';font-weight:800;font-size:62px;line-height:96px;color:#ff3b30" id="${id}n">1200</div>
  <div style="font-family:Onest;font-weight:800;font-size:28px;color:#c9ced6;margin-top:8px">мкм · краска</div></div>`;
const VCARD = () => BOTH("Веста · 1 хозяйка", `<div id="nvc">${CARD("Lada Vesta · 2021", "990 000 ₽", "рынок ≈ 1 150 000 ₽ · 1 хозяйка · 41 000 км", "🔥 −14% к рынку · ⏱ 1 с после публикации")}</div>`);
const VFILTER = () => BOTH("", `<div style="margin-top:14px;padding:18px 22px;border-radius:22px;background:#1c1f26;font-family:Onest;font-weight:800;font-size:34px;color:#fff">Фильтр: <span style="color:#ffd23f">Lada Vesta · 1 хозяйка · до 1 млн</span></div>
  <div style="margin-top:14px;font-family:Onest;font-weight:700;font-size:30px;color:#4cd964">✅ Фильтр сохранён — пришлю через секунду после публикации</div>`);
const CTA58 = `<div style="position:absolute;left:60px;right:60px;top:1330px;z-index:70;background:#ffd23f;border:8px solid #151515;border-radius:34px;padding:26px 30px;box-shadow:0 14px 0 #151515;font-family:Unbounded;font-weight:900;color:#151515;text-align:center">
  <div style="font-size:52px;line-height:1.12">Бот <span style="color:#c0392b">«Перехват»</span><br>— ссылка в шапке</div><div style="margin-top:12px;font-size:30px;font-family:Onest;font-weight:800">объявления по всей России · через ~1 с после публикации</div></div>`;
const HALF = (frameHtml, side) => `<div class="half" style="position:absolute;left:0;top:0;width:1080px;height:1920px;clip-path:inset(0 270px 0 270px);transform:translateX(${side * 270}px)">${frameHtml}</div>`;
