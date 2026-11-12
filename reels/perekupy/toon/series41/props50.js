// ep50 «ЖИЗНЬ ОДНОЙ ЭВО» — герои и реквизит (базовые помощники — props.js)
const GOSHA = { jacket: "#c0392b", pants: "#151515", cap: "#f4f6f8", hair: "#3a2d22", look: "grin" };
const SEMEN = { jacket: "#2f4f8a", pants: "#2f4f8a", hair: "#9a9a9a", mustache: true, glasses: true, vest: true, look: "grin" };
const KIRILL = { jacket: "#e8e4d8", coat: "#d9cdb4", pants: "#3a3f46", hair: "#c9a24a", scarf: "#7a4a8a", look: "grin" };
const DIMA = { jacket: "#151515", pants: "#2b2f37", cap: "#2f6db5", hair: "#1d1d1f", look: "grin" };
const EVO = "evo/evo_34.png", EVOR = "evo/evo_34r.png", EVOS = "evo/evo_side.png";
Object.assign(CINE.SIZES, { [EVO]: [796, 371], [EVOR]: [655, 352], [EVOS]: [766, 251] });
const HUD50 = (lis) => ({ tag: "жизнь одной эво", lis });
// одометр вместо капитала: пробег по годам
const ODO = (km, id = "odo") => `<div id="${id}" style="position:absolute;left:60px;top:290px;z-index:52;font-family:'JetBrains Mono';font-weight:800;font-size:54px;color:#fff;background:#0d0e12;border:6px solid #ff7a1a;border-radius:18px;padding:2px 20px;box-shadow:0 0 26px #ff7a1a66,0 8px 0 #151515;font-variant-numeric:tabular-nums">⏲ <span>${km}</span> км</div>`;
// год крупно — штамп-плашка
const YEAR = (y, c = "#ffd23f", id = "yr") => `<div id="${id}" style="position:absolute;right:50px;top:300px;z-index:52;font-family:Unbounded;font-weight:900;font-size:88px;color:#151515;background:${c};border:8px solid #151515;border-radius:22px;padding:0 24px;box-shadow:0 10px 0 #151515;transform:rotate(4deg)">${y}</div>`;
// стропы крана к машине
const SLINGS = (hx, hy, l, t, w) => `<svg class="prop" style="left:0;top:0;width:1080px;height:1920px;z-index:6;overflow:visible" viewBox="0 0 1080 1920">
  <path d="M${hx} 315 V${hy}" stroke="#151515" stroke-width="6"/><path d="M${hx} ${hy} L${l + w * .18} ${t + 40} M${hx} ${hy} L${l + w * .82} ${t + 40}" stroke="#151515" stroke-width="6"/><circle cx="${hx}" cy="${hy}" r="16" fill="#e8a33a" stroke="#151515" stroke-width="5"/></svg>`;
// следы скорости (трек)
const SPEED = (y0, y1, n = 14) => Array.from({ length: n }, (_, k) => `<div class="spd" style="left:${(k * 137) % 1000 - 100}px;top:${y0 + (k * 53) % (y1 - y0)}px;width:${200 + (k % 4) * 90}px;height:8px;border-radius:4px;background:#fff;opacity:.35;z-index:3"></div>`).join("");
// разбитая морда: смятый капот, трещины, пар, снег на бампере (поверх evo_34 в координатах машины l, t, w)
const CRASH = (l, t, w) => { const k = w / 796; return `<svg class="prop" style="left:${l}px;top:${t}px;width:${w}px;height:${373 * k}px;z-index:7;overflow:visible" viewBox="0 0 796 373">
  <!-- капот вздыбился «домиком» -->
  <path d="M50 182 L190 70 L250 96 L430 150 L420 188 L250 150 L60 205 Z" fill="#6a7482" stroke="#151515" stroke-width="7" stroke-linejoin="round"/>
  <path d="M190 72 L230 160 M120 128 L160 178 M300 112 L310 170" stroke="#151515" stroke-width="5"/><path d="M200 84 L240 98" stroke="#c9d2dc" stroke-width="6" stroke-linecap="round"/>
  <!-- разбитые фары и решётка -->
  <path d="M18 182 L70 178 L74 226 L22 230 Z" fill="#1d1d1f" stroke="#151515" stroke-width="5"/><path d="M28 188 l30 30 M60 186 l-24 36" stroke="#e8eef5" stroke-width="4"/>
  <path d="M262 190 L432 188 L430 236 L270 240 Z" fill="#1d1d1f" stroke="#151515" stroke-width="5"/><path d="M280 196 l60 36 M350 192 l-30 44 M380 196 l40 36 M300 232 l90 -40" stroke="#e8eef5" stroke-width="4"/>
  <path d="M80 194 L262 196 L250 242 L96 244 Z" fill="#151515"/><path d="M100 204 l40 30 l30 -28 l40 30 l30 -26" stroke="#5a6070" stroke-width="6" fill="none"/>
  <!-- бампер оторван и висит -->
  <path d="M0 262 L300 268 L330 300 L260 352 L120 366 L10 330 Z" fill="#5a6370" stroke="#151515" stroke-width="7" stroke-linejoin="round" transform="rotate(8 0 262)"/>
  <path d="M30 300 l80 12 M160 316 l70 -6" stroke="#151515" stroke-width="5" transform="rotate(8 0 262)"/>
  <!-- снег набился в морду -->
  <path d="M-20 340 q120 -70 300 -30 q120 24 160 70 H-20 z" fill="#f4f8fc" stroke="#151515" stroke-width="5"/></svg>
  ${[0, 1, 2, 3, 4].map(i => `<div class="steam" style="left:${l + (120 + i * 70) * k}px;top:${t + (30 - i * 60) * k}px;width:${(170 + i * 50) * k}px;height:${(130 + i * 40) * k}px;z-index:8;border-radius:50%;background:radial-gradient(#e8eef5,#e8eef500 70%);opacity:.8"></div>`).join("")}`; };
const VINREP = () => `<div style="font-family:Onest;font-weight:700;font-size:34px;color:#8b93a3">Отчёт по VIN</div>
  <div style="background:#1c1f26;border-radius:26px;padding:18px 22px;margin-top:14px;font-family:Onest;color:#fff">
    <div style="font-weight:800;font-size:32px">Mitsubishi Lancer Evolution IX · 2007</div>
    ${[["Владельцев", "3"], ["Пробег", "140 000 км"], ["Ввоз", "2013 · Владивосток"]].map(([a, b]) => `<div style="display:flex;justify-content:space-between;font-size:28px;margin-top:10px;color:#b9bfca"><span>${a}</span><b style="color:#fff">${b}</b></div>`).join("")}
    <div id="dtp" style="margin-top:16px;background:#3a1418;border:4px solid #ff3b30;border-radius:18px;padding:12px 16px;font-weight:800;font-size:32px;color:#ff6a5a">⚠ ДТП · 2019 · передняя часть</div></div>`;
const KEYS = (x, y, s = 1) => `<div class="prop" style="left:${x}px;top:${y}px;width:${90 * s}px;height:${120 * s}px;z-index:12"><svg viewBox="0 0 90 120"><circle cx="30" cy="30" r="22" fill="none" stroke="#c9ced6" stroke-width="8"/><rect x="40" y="44" width="34" height="70" rx="12" fill="#151515" stroke="#000" stroke-width="4"/><rect x="48" y="56" width="18" height="14" rx="3" fill="#c0392b"/></svg></div>`;
const CTA50 = `<div style="position:absolute;left:60px;right:60px;top:1330px;z-index:70;background:#ffd23f;border:8px solid #151515;border-radius:34px;padding:26px 30px;box-shadow:0 14px 0 #151515;font-family:Unbounded;font-weight:900;color:#151515;text-align:center">
  <div style="font-size:52px;line-height:1.12">Бот <span style="color:#c0392b">«Перехват»</span><br>— ссылка в шапке</div><div style="margin-top:12px;font-size:30px;font-family:Onest;font-weight:800">объявления по всей России · через ~1 с после публикации</div></div>`;
const SNOWFX = (n = 140, seed = 3, big = 1) => { let s = "", r = seed; const rnd = () => (r = (r * 16807) % 2147483647) / 2147483647;
  for (let i = 0; i < n; i++) { const d = (3 + rnd() * 8) * big; s += `<i style="left:${(rnd() * 1120 - 20).toFixed(0)}px;top:${(rnd() * 1960 - 20).toFixed(0)}px;width:${d.toFixed(1)}px;height:${d.toFixed(1)}px;opacity:${(.45 + rnd() * .5).toFixed(2)}"></i>`; }
  return `<div class="fx snowfx">${s}</div>`; };

// предмет в правой руке героя (по повороту руки, как зонт в ep47): html — svg 100×100 с центром-хваткой в (50, 50)
const INHAND = (x, foot, h, arm, w, html, z = 8, rot = 0) => {
  const s = h / 740, l = x - 210 * s, t = foot - 740 * s, A = arm * Math.PI / 180;
  const hx = l + (292 + 26 * Math.cos(A) - 130 * Math.sin(A)) * s, hy = t + (400 + 26 * Math.sin(A) + 130 * Math.cos(A)) * s;
  return `<div class="prop" style="left:${hx - w / 2}px;top:${hy - w / 2}px;width:${w}px;height:${w}px;z-index:${z};transform:rotate(${rot}deg)">${html}</div>`;
};
