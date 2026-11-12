// ep51 «ТОРГ · Дуэль» («Простой ролик 2») — герои и реквизит (базовые помощники — props.js)
const SLAVA = { jacket: "#4f6d8a", pants: "#2b2f37", hair: "#6b4a2b", look: "grin" };
const ARKADY = { jacket: "#6b4a2b", pants: "#3a3f46", hair: "#e8e4d8", mustache: true, glasses: true, cap: "#3a3f46", look: "grin" };
const E30 = "bmw/bmw_34.png", E30S = "bmw/bmw_side.png", V05 = "vaz2105/vaz2105_34.png";
Object.assign(CINE.SIZES, { [E30]: [696, 280], [E30S]: [719, 230], [V05]: [775, 352] });
const HUD51 = (lis) => ({ tag: "торг · дуэль", lis });
// табло цены — падает по ходу торга
const PRICE = (v, id = "pr") => `<div id="${id}" style="position:absolute;left:60px;top:290px;z-index:52;font-family:'JetBrains Mono';font-weight:800;font-size:54px;color:#fff;background:#0d0e12;border:6px solid #ff3b30;border-radius:18px;padding:2px 20px;box-shadow:0 0 26px #ff3b3066,0 8px 0 #151515;font-variant-numeric:tabular-nums">💬 <span>${v}</span> ₽</div>`;
// перекати-поле
const TUMBLE = (x, y, w, id = "") => `<div class="prop"${id ? ` id="${id}"` : ""} style="left:${x}px;top:${y}px;width:${w}px;height:${w}px;z-index:9"><svg viewBox="0 0 100 100">
  ${Array.from({ length: 9 }, (_, k) => `<ellipse cx="50" cy="50" rx="${44 - k * 2}" ry="${30 + k * 2}" transform="rotate(${k * 21} 50 50)" fill="none" stroke="${k % 2 ? "#8a6a3a" : "#a8844a"}" stroke-width="3"/>`).join("")}</svg></div>`;
// ржавчина на пороге (поверх bmw_side в координатах машины)
const RUST = (l, t, w) => { const k = w / 719; return [[160, 168, 40], [250, 172, 28], [420, 170, 46], [540, 166, 26]].map(([x, y, r]) =>
  `<div style="left:${l + x * k}px;top:${t + y * k}px;width:${2 * r * k}px;height:${r * k}px;z-index:6;border-radius:50%;background:radial-gradient(#8a3a10,#b85a20 50%,#b85a2000 75%)"></div>`).join(""); };
const CTA51 = `<div style="position:absolute;left:60px;right:60px;top:1330px;z-index:70;background:#ffd23f;border:8px solid #151515;border-radius:34px;padding:26px 30px;box-shadow:0 14px 0 #151515;font-family:Unbounded;font-weight:900;color:#151515;text-align:center">
  <div style="font-size:52px;line-height:1.12">Бот <span style="color:#c0392b">«Перехват»</span><br>— ссылка в шапке</div><div style="margin-top:12px;font-size:30px;font-family:Onest;font-weight:800">объявления по всей России · через ~1 с после публикации</div></div>`;
// предмет в правой руке героя (по повороту руки, как зонт в ep47): html — svg 100×100 с центром-хваткой в (50, 50)
const INHAND = (x, foot, h, arm, w, html, z = 8, rot = 0) => {
  const s = h / 740, l = x - 210 * s, t = foot - 740 * s, A = arm * Math.PI / 180;
  const hx = l + (292 + 26 * Math.cos(A) - 130 * Math.sin(A)) * s, hy = t + (400 + 26 * Math.sin(A) + 130 * Math.cos(A)) * s;
  return `<div class="prop" style="left:${hx - w / 2}px;top:${hy - w / 2}px;width:${w}px;height:${w}px;z-index:${z};transform:rotate(${rot}deg)">${html}</div>`;
};
const HALF = (frameHtml, side) => `<div class="half" style="position:absolute;left:0;top:0;width:1080px;height:1920px;clip-path:inset(0 270px 0 270px);transform:translateX(${side * 270}px)">${frameHtml}</div>`;
