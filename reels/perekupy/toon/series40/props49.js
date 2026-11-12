// ep49 «Толян: со ста тысяч · 11 — Партнёры»: герои и реквизит (базовые помощники — props.js)
const NOTARY = { coat: "#4a3a5a", jacket: "#4a3a5a", pants: "#2b2f37", hair: "#d9a03a", glasses: true, scarf: "#e8e4d8", look: "flat" };
const VITALIK = { jacket: "#2f6db5", pants: "#2f6db5", cap: "#151515", chain: true, hair: "#1d1d1f", look: "grin" };
const CLSW = "cls/cls_34.png", CLSB = "cls/cls_34_black.png";
CINE.SIZES[CLSW] = [787, 338]; CINE.SIZES[CLSB] = [787, 338];
const HUD49 = (cap, d, lis) => ({ tag: "партнёры", cap, d, lis });
// предмет в правой руке героя (по повороту руки, как зонт в ep47): html — svg 100×100 с центром-хваткой в (50, 50)
const INHAND = (x, foot, h, arm, w, html, z = 8, rot = 0) => {
  const s = h / 740, l = x - 210 * s, t = foot - 740 * s, A = arm * Math.PI / 180;
  const hx = l + (292 + 26 * Math.cos(A) - 130 * Math.sin(A)) * s, hy = t + (400 + 26 * Math.sin(A) + 130 * Math.cos(A)) * s;
  return `<div class="prop" style="left:${hx - w / 2}px;top:${hy - w / 2}px;width:${w}px;height:${w}px;z-index:${z};transform:rotate(${rot}deg)">${html}</div>`;
};
const BALL = `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="44" fill="#c0392b" stroke="#151515" stroke-width="7"/><circle cx="38" cy="36" r="7" fill="#151515"/><circle cx="56" cy="32" r="7" fill="#151515"/><circle cx="50" cy="52" r="7" fill="#151515"/><path d="M24 30 q10 -14 26 -16" stroke="#ff8a7a" stroke-width="6" fill="none" stroke-linecap="round"/></svg>`;
const GAUGE = `<svg viewBox="0 0 100 100"><rect x="26" y="4" width="48" height="74" rx="10" fill="#ffd23f" stroke="#151515" stroke-width="6"/><rect x="33" y="12" width="34" height="24" rx="3" fill="#cfe9c4" stroke="#151515" stroke-width="3"/>
  <path d="M50 78 v16" stroke="#151515" stroke-width="8" stroke-linecap="round"/><circle cx="50" cy="96" r="5" fill="#9aa3ab" stroke="#151515" stroke-width="3"/></svg>`;
// кегли разлетаются (страйк)
const PINS = (cx, cy, s = 1, spread = 0) => [[0, 0], [-1, 1], [1, 1], [-2, 2], [0, 2], [2, 2], [-3, 3], [-1, 3], [1, 3], [3, 3]].map(([dx, dy], k) =>
  `<div class="prop pin" style="left:${cx + dx * 26 * s + spread * dx * 40}px;top:${cy - dy * 14 * s - spread * (60 + (k % 3) * 40)}px;width:${30 * s}px;height:${70 * s}px;z-index:4;transform:rotate(${spread * (dx * 40 + (k % 2 ? 30 : -30))}deg)">
    <svg viewBox="0 0 30 70"><path d="M15 2 q8 0 8 12 q0 8 -4 14 q10 14 10 28 q0 12 -14 12 q-14 0 -14 -12 q0 -14 10 -28 q-4 -6 -4 -14 q0 -12 8 -12 z" fill="#fff" stroke="#151515" stroke-width="3"/><path d="M8 22 h14" stroke="#c0392b" stroke-width="4"/></svg></div>`).join("");
// договор у нотариуса: пункт 7 обведён маркером
const CONTRACT = (l, t, w = 520, rot = -3) => `<div style="position:absolute;left:${l}px;top:${t}px;width:${w}px;z-index:14;transform:rotate(${rot}deg);background:#fbfaf3;border:6px solid #151515;box-shadow:0 14px 0 rgba(0,0,0,.3);padding:22px 26px;font-family:Onest;color:#222">
  <div style="text-align:center;font-family:Unbounded;font-weight:900;font-size:28px">ДОГОВОР<br>О ПАРТНЁРСТВЕ</div>
  <div style="font-size:22px;margin-top:12px;line-height:1.5">1. Прибыль — 50 / 50.<br>2. Убытки — 50 / 50.<br>…<br><b style="font-size:26px">7. Машины покупаем<br>только вдвоём.</b></div>
  <svg viewBox="0 0 300 80" style="position:absolute;left:4px;bottom:6px;width:${w - 30}px;overflow:visible"><path d="M10 40 Q10 4 150 4 Q292 6 290 40 Q286 78 150 76 Q14 74 16 30" fill="none" stroke="#ff3b30" stroke-width="5" stroke-linecap="round"/></svg></div>`;
// экран толщиномера на двери белого CLS (вставка)
const GAUGEINSERT = () => `<div style="left:0;top:0;width:1080px;height:1920px;background:linear-gradient(170deg,#f4f6f8,#cfd6de 60%,#aeb7c2)"></div>
  <div style="left:-40px;top:1080px;width:1200px;height:18px;background:#8a929b;transform:rotate(-4deg)"></div><div style="left:760px;top:600px;width:24px;height:200px;background:#151515;border-radius:12px;transform:rotate(-4deg)"></div>
  <div style="left:200px;top:760px;width:300px;height:180px;border-radius:50%;background:radial-gradient(#c9b48a,#c9b48a00 70%);opacity:.6"></div>
  <div style="left:300px;top:420px;width:480px;height:760px;background:#ffd23f;border:12px solid #151515;border-radius:70px;transform:rotate(-8deg);box-shadow:0 30px 0 rgba(0,0,0,.25)">
    <div style="position:absolute;left:50px;top:60px;width:356px;height:250px;background:#cfe9c4;border:8px solid #151515;border-radius:18px;text-align:center;font-family:'JetBrains Mono';font-weight:800">
      <div style="font-size:34px;color:#4a5a4a;margin-top:18px">мкм</div><div id="gnum" style="font-size:120px;line-height:1.1;color:#c0392b">1200</div></div>
    <div style="position:absolute;left:150px;bottom:-150px;width:40px;height:160px;background:#151515;border-radius:20px"></div></div>`;
const CASHSPLIT = () => `${[0, 1].map(k => `<div style="left:${250 + k * 330}px;top:1640px;width:260px;height:160px;z-index:14;transform:rotate(${k ? 5 : -5}deg)">${[0, 1, 2, 3].map(j =>
  `<div style="position:absolute;left:${j * 6}px;top:${-j * 14}px;width:250px;height:120px;background:#8fd17a;border:6px solid #151515;border-radius:12px"><div style="position:absolute;left:90px;top:20px;width:70px;height:70px;border-radius:50%;border:6px solid #3f7a32;font-family:Unbounded;font-weight:900;font-size:40px;color:#3f7a32;text-align:center;line-height:60px">₽</div></div>`).join("")}</div>`).join("")}`;
const CTA49 = `<div style="position:absolute;left:60px;right:60px;top:1330px;z-index:70;background:#ffd23f;border:8px solid #151515;border-radius:34px;padding:26px 30px;box-shadow:0 14px 0 #151515;font-family:Unbounded;font-weight:900;color:#151515;text-align:center">
  <div style="font-size:52px;line-height:1.12">Бот <span style="color:#c0392b">«Перехват»</span><br>— ссылка в шапке</div><div style="margin-top:12px;font-size:30px;font-family:Onest;font-weight:800">объявления по всей России · через ~1 с после публикации</div></div>`;
// половинка разделённого экрана: кадр 1080×1920, видна полоса 270…810 → встаёт слева (side −1) или справа (+1)
const HALF = (frameHtml, side) => `<div class="half" style="position:absolute;left:0;top:0;width:1080px;height:1920px;clip-path:inset(0 270px 0 270px);transform:translateX(${side * 270}px)">${frameHtml}</div>`;
