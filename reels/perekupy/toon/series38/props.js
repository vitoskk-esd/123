// ep47: реквизит и помощники сцен (общие для раскадровки board.html и видео ep47.js)
const C = CINE, ch = C.ch, car = C.car, glow = C.glow, beam = C.beam;
const ZHORA = { jacket: "#1d1d1f", pants: "#2b2f37", cap: "#c0392b", mustache: true, chain: true, hair: "#1d1d1f" };
const BABA = { coat: "#7a4a8a", jacket: "#7a4a8a", pants: "#4a3a5a", hair: "#d9d9d9", scarf: "#c0392b", look: "grin" };
const HUD = (cap, d, lis) => ({ tag: "жора просит о помощи", cap, d, lis });
// зонт над героем: hand — точка ладони в мире
const UMB = (x, y, w, z = 8) => `<div class="prop" style="left:${x - w / 2}px;top:${y - w * .62}px;width:${w}px;height:${w * .7}px;z-index:${z}"><svg viewBox="0 0 400 280">
  <path d="M200 20 V270 q0 10 -14 10 q-12 0 -12 -12" fill="none" stroke="#151515" stroke-width="10" stroke-linecap="round"/>
  <path d="M10 120 Q200 -70 390 120 q-30 -24 -63 0 q-30 -24 -63 0 q-32 -24 -64 0 q-32 -24 -64 0 q-30 -24 -63 0 q-30 -24 -63 0 z" fill="#7a1f1a" stroke="#151515" stroke-width="7" stroke-linejoin="round"/>
  <path d="M200 22 Q120 40 73 120 M200 22 Q170 50 137 120 M200 22 Q230 50 264 120 M200 22 Q280 40 327 120" fill="none" stroke="#151515" stroke-width="5"/>
  <path d="M60 70 Q140 10 220 26" fill="none" stroke="#ff8a7a" stroke-width="7" opacity=".7" stroke-linecap="round"/></svg></div>`;
// гирлянда площадки: те же точки, что в bg_zhlot (горит каждая, кроме i%4==0)
const BULBS = (night = true) => { let s = "";
  for (const [x0, x1, y, sag] of [[0, 540, 590, 90], [540, 1080, 600, 80]]) for (let i = 1; i < 11; i++) { const t = i / 11, x = x0 + (x1 - x0) * t, yy = y + sag * 4 * t * (1 - t) + 14;
    if ((i - 1) % 4) s += glow(x, yy, 46, "#ffc46a", .95); }
  return s + glow(555, 440, 360, "#ff4a3a", .35) + glow(860, 855, 110, "#ffb347", .8); };
// ряд машин на площадке (задний план) — тусклые, с ценниками
const LOTROW = (g = 1190, sold = [], night = false) => [["vaz2114/vaz2114_white.png", -60], ["priora/priora_white.png", 250], ["markii/markii.png", 560], ["corolla/corolla.png", 820]]
  .map(([im, l], k) => car(im, l, g, 380, { z: 3, dim: night ? .62 : .95, refl: 1 }) + (sold.includes(k) ? C.tag(l + 110, g - 120, "ПРОДАНО", "", -8, 4, "#4cd964") : C.tag(l + 140, g - 108, ["620", "540", "790", "910"][k], "", -5, 4))).join("");
// рука с телефоном (вставка-крупный план)
const HANDPHONE = (l, t, w, inner, rot = -6) => `<div style="position:absolute;left:${l}px;top:${t}px;width:${w}px;z-index:62;transform:rotate(${rot}deg)">
  <svg viewBox="0 0 700 900" style="position:absolute;left:${w * .18}px;top:${w * 1.05}px;width:${w * .9}px;overflow:visible">
    <path d="M120 0 q-40 160 -20 330 l-60 600 h520 l-40 -620 q20 -150 -40 -310 z" fill="#e8b48c" stroke="#151515" stroke-width="12" stroke-linejoin="round"/>
    <path d="M60 520 l-30 400 h560 l-30 -400 q-250 60 -500 0 z" fill="#1d1d1f" stroke="#151515" stroke-width="12" stroke-linejoin="round"/></svg>
  <div style="position:relative;background:#0d0e12;border:12px solid #2a2d34;border-radius:64px;padding:34px 30px 60px;box-shadow:0 0 140px rgba(120,180,255,.55)">${inner}</div>
  <svg viewBox="0 0 100 600" style="position:absolute;left:-40px;top:${w * .55}px;width:90px;overflow:visible">${[0, 150, 300].map(y => `<rect x="0" y="${y}" width="96" height="120" rx="48" fill="#e8b48c" stroke="#151515" stroke-width="10"/><path d="M70 ${y + 30} q16 30 0 60" stroke="#c99b78" stroke-width="8" fill="none"/>`).join("")}</svg>
  <svg viewBox="0 0 140 420" style="position:absolute;left:${w - 70}px;top:${w * .9}px;width:130px;overflow:visible"><path d="M60 0 q70 20 70 120 q0 110 -50 200 l-80 60 v-300 q0 -60 60 -80 z" fill="#e8b48c" stroke="#151515" stroke-width="10" stroke-linejoin="round"/>
    <path d="M58 20 q40 20 36 70" stroke="#c99b78" stroke-width="8" fill="none"/></svg></div>`;
// герой по пояс держит телефон обеими руками, экран к зрителю (владелец 12.11: «человек держит телефон, на экране — бот»)
// возвращает { mid, lights }: тело — в mid (под грейдом), телефон, свечение и кисти — в lights (над грейдом)
const HOLDPHONE = (kind, p, x, foot, h, o, inner, extra = {}) => {
  const s = h / 740, l = x - 210 * s, t = foot - 740 * s, pl = l + 100 * s, pt = t + 368 * s, pw = 220 * s, ph = 345 * s, k = pw / 560;
  const hand = (hx) => `<div style="left:${hx - 26 * s}px;top:${t + 488 * s}px;width:${52 * s}px;height:${92 * s}px;z-index:33;background:#e8b48c;border:${7 * s}px solid #151515;border-radius:${30 * s}px"></div>`;
  return { mid: ch(kind, p, x, foot, h, o, { head: extra.head ?? 0 }, { rim: extra.rim, side: extra.side, noShadow: 1 }),
    lights: glow(x, t + 260 * s, 240 * s, "#9fd6ff", .35, 31)
      + `<div${extra.id ? ` id="${extra.id}"` : ""} style="left:${pl}px;top:${pt}px;width:${pw}px;height:${ph}px;z-index:32;background:#0d0e12;border:${9 * s}px solid #2a2d34;border-radius:${40 * s}px;overflow:hidden;box-shadow:0 0 ${60 * s}px rgba(120,180,255,.55)">
        <div style="position:absolute;left:0;top:0;width:560px;padding:30px 52px;transform:scale(${k});transform-origin:0 0">${inner}</div></div>`
      + hand(l + 96 * s) + hand(l + 324 * s) };
};
const BOTH = (title, body) => `<div style="font-family:Onest;font-weight:700;font-size:34px;color:#8b93a3">ПЕРЕХВАТ · бот</div>${title ? `<div style="font-family:'JetBrains Mono';font-weight:800;font-size:30px;color:#ffd23f;margin-top:8px">${title}</div>` : ""}${body}`;
const CARD = (t, p, c, hot) => `<div style="background:#1c1f26;border-radius:26px;padding:18px 22px;margin-top:14px;font-family:Onest;color:#fff">${hot ? `<div style="font-weight:800;font-size:30px;color:#ff7a1a">${hot}</div>` : ""}
  <div style="font-weight:800;font-size:32px">${t}</div><div style="font-family:Unbounded;font-weight:900;font-size:46px;color:#ffd23f">${p}</div><div style="font-size:28px;color:#b9bfca">📍 ${c}</div></div>`;
// запотевшее лобовое стекло крупно (вставка): боке гирлянды за стеклом, капли, надписи пальцем
const WINDSHIELD = () => `<div style="left:0;top:0;width:1080px;height:1920px;background:#141a30"></div>
  ${[[180, 520, 90, "#ffc46a"], [430, 470, 70, "#ffc46a"], [700, 560, 110, "#ff4a3a"], [920, 480, 80, "#ffc46a"], [300, 900, 60, "#9fc3ff"], [820, 980, 90, "#ffb347"], [560, 760, 50, "#ffc46a"]]
    .map(([x, y, r, c]) => `<div style="left:${x - r}px;top:${y - r}px;width:${2 * r}px;height:${2 * r}px;border-radius:50%;background:${c};opacity:.55;filter:blur(6px)"></div>`).join("")}
  <div style="left:0;top:0;width:1080px;height:1920px;background:linear-gradient(170deg,rgba(210,220,235,.62),rgba(180,195,215,.5));backdrop-filter:blur(4px)"></div>
  <div style="left:-40px;top:1500px;width:1200px;height:500px;background:#0d0f16;border-top:14px solid #151515;transform:rotate(-4deg)"></div>`;
const FINGER = (x, y) => `<div class="prop" style="left:${x}px;top:${y}px;width:300px;height:420px;z-index:22"><svg viewBox="0 0 300 420">
  <path d="M40 30 q20 -30 46 -10 l40 150 q40 -20 80 10 q50 40 60 140 l20 120 h-200 l-40 -150 q-20 -40 -10 -80 z" fill="#e8b48c" stroke="#151515" stroke-width="10" stroke-linejoin="round"/>
  <path d="M120 300 h160 l20 120 h-200 z" fill="#1d1d1f" stroke="#151515" stroke-width="10"/></svg></div>`;
const STREAK = (x, y, w, h, rot) => `<div style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;transform:rotate(${rot}deg);background:#0f1426;opacity:.35;border-radius:20px;z-index:12"></div>`;
const OTS_ZHORA = (x, y, w) => `<div class="prop" style="left:${x}px;top:${y}px;width:${w}px;height:${w * 1.1}px;z-index:30"><svg viewBox="0 0 400 440">
  <path d="M-40 440 q10 -170 140 -200 h200 q130 30 140 200 z" fill="#1d1d1f" stroke="#151515" stroke-width="10"/>
  <ellipse cx="200" cy="150" rx="110" ry="130" fill="#d9a07a" stroke="#151515" stroke-width="10"/><ellipse cx="88" cy="170" rx="22" ry="34" fill="#d9a07a" stroke="#151515" stroke-width="8"/>
  <path d="M90 120 q0 -110 110 -110 q110 0 110 110 q-110 -20 -220 0 z" fill="#c0392b" stroke="#151515" stroke-width="10"/><path d="M110 128 q90 -14 180 0 l-6 26 q-84 -14 -168 0 z" fill="#8e2a20" stroke="#151515" stroke-width="6"/>
  <path d="M150 250 q50 40 100 0" fill="none" stroke="#f5c542" stroke-width="12"/></svg></div>`;
const CTA = `<div style="position:absolute;left:60px;right:60px;top:1330px;z-index:70;background:#ffd23f;border:8px solid #151515;border-radius:34px;padding:26px 30px;box-shadow:0 14px 0 #151515;font-family:Unbounded;font-weight:900;color:#151515;text-align:center">
  <div style="font-size:52px;line-height:1.12">Бот <span style="color:#c0392b">«Перехват»</span><br>— ссылка в шапке</div><div style="margin-top:12px;font-size:30px;font-family:Onest;font-weight:800">свежие объявления за ~1 с · вся Россия</div></div>`;

