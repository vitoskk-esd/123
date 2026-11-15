// ep65 «Стрим: Жора в эфире»: герои и реквизит (базовые помощники — props.js)
const STAS = { jacket: "#3a3f46", pants: "#2b2f37", cap: "#2f6db5", hair: "#8a5a33", look: "grin" };                  // перекуп Стас
const MK = "markii/markii_cherry.png";
Object.assign(CINE.SIZES, { [MK]: [983, 467] });
// Люда — продавщица Марка (новая героиня): из героини «vika» — зелёная куртка, светлые волосы
const LRC = html => html.replaceAll("#8e1f3a", "#2f8a5a").replaceAll("#5c1426", "#1f6a42").replaceAll("#2b1a14", "#e6c070");
const INHAND = (x, foot, h, arm, w, html, z = 8, rot = 0, id = "") => {
  const s = h / 740, l = x - 210 * s, t = foot - 740 * s, A = arm * Math.PI / 180;
  const hx = l + (292 + 26 * Math.cos(A) - 130 * Math.sin(A)) * s, hy = t + (400 + 26 * Math.sin(A) + 130 * Math.cos(A)) * s;
  return `<div class="prop"${id ? ` id="${id}"` : ""} style="left:${hx - w / 2}px;top:${hy - w / 2}px;width:${w}px;height:${w}px;z-index:${z};transform:rotate(${rot}deg)">${html}</div>`;
};
const TITLE = (a, b) => `<div style="position:absolute;left:0;right:0;top:300px;text-align:center;font-family:Unbounded;font-weight:900;line-height:1;letter-spacing:-3px;z-index:50">
  <span style="display:inline-block;padding:10px 28px 18px;border:8px solid #151515;border-radius:22px;box-shadow:0 12px 0 #151515;font-size:82px;background:#ffd23f;color:#151515;transform:rotate(-3deg)">${a}</span><br>
  <span style="display:inline-block;padding:10px 28px 18px;border:8px solid #151515;border-radius:22px;box-shadow:0 12px 0 #151515;font-size:104px;background:#ff3b30;color:#fff;margin-top:26px;transform:rotate(2deg)">${b}</span></div>`;
// телефон на палке в руке (селфи на бегу)
const SELFIE = `<svg viewBox="0 0 100 100" style="overflow:visible"><path d="M50 60 L50 -40" stroke="#151515" stroke-width="10"/><rect x="22" y="-120" width="56" height="96" rx="10" fill="#151515" stroke="#2a2d34" stroke-width="5"/><circle cx="50" cy="-108" r="5" fill="#3fd0ff"/></svg>`;
// приём 1 — интерфейс прямого эфира: LIVE, зрители, лайки (экранный слой)
const LIVE = (viewers, id = "lv", rec = false) => `<div id="${id}" style="position:absolute;inset:0;z-index:48;pointer-events:none">
  <div style="position:absolute;left:40px;top:300px;display:flex;gap:14px;align-items:center;font-family:Unbounded;font-weight:900">
    <span style="background:#ff3b30;color:#fff;border-radius:12px;padding:6px 18px;font-size:38px">● LIVE</span>
    <span style="background:#000a;color:#fff;border-radius:12px;padding:6px 18px;font-size:38px">👁 <span id="${id}n">${viewers}</span></span></div>
  ${rec ? `<div style="position:absolute;inset:60px 40px 120px;border:0 solid #fff">${["left:0;top:0;border-width:8px 0 0 8px", "right:0;top:0;border-width:8px 8px 0 0", "left:0;bottom:0;border-width:0 0 8px 8px", "right:0;bottom:0;border-width:0 8px 8px 0"].map(c => `<div style="position:absolute;${c};width:90px;height:90px;border-style:solid;border-color:#fff"></div>`).join("")}</div>` : ""}
  <div id="${id}h" style="position:absolute;right:50px;bottom:300px;font-size:70px">❤️</div></div>`;
// приём 2 — чат стрима: комментарии всплывают снизу (id — для появления по одной)
const CHAT = (rows, id = "ct", top = 1120) => `<div style="position:absolute;left:40px;top:${top}px;width:760px;z-index:47;font-family:Onest;font-weight:800;font-size:34px;line-height:1.25">
  ${rows.map(([nick, col, t], k) => `<div id="${id}${k}" style="display:flex;gap:14px;align-items:flex-start;margin-bottom:16px;background:#000b;border-radius:18px;padding:10px 18px;color:#fff">
    <span style="flex:none;width:46px;height:46px;border-radius:50%;background:${col}"></span><span><b style="color:${col}">${nick}</b> ${t}</span></div>`).join("")}</div>`;
// приём 3 — донат: всплывающее окно
const DONATE = (nick, sum, text, id = "dn") => `<div id="${id}" style="position:absolute;left:90px;right:90px;top:520px;z-index:60;background:linear-gradient(135deg,#7a3aff,#ff3bd0);border:8px solid #151515;border-radius:34px;box-shadow:0 14px 0 #151515,0 0 60px #ff3bd0aa;padding:26px 30px;text-align:center;color:#fff">
  <div style="font-size:90px;line-height:1">💸</div><div style="font-family:Unbounded;font-weight:900;font-size:50px;margin-top:8px">${nick} · ${sum}</div>
  <div style="font-family:Onest;font-weight:800;font-size:36px;margin-top:10px">${text}</div></div>`;
// приём 4 — счётчик зрителей взлетает (крупно)
const VIRAL = (id = "vr") => `<div style="left:0;top:0;width:1080px;height:1920px;background:radial-gradient(circle at 50% 40%,#3a1a5a,#0b0820 80%)"></div>
  <div style="position:absolute;left:0;right:0;top:520px;text-align:center;font-family:Unbounded;font-weight:900;color:#fff">
    <div style="font-size:60px;color:#ff7ae6">👁 зрителей</div><div id="${id}" style="font-size:210px;letter-spacing:-6px;font-variant-numeric:tabular-nums">37</div>
    <svg viewBox="0 0 200 120" style="width:360px;height:216px"><path d="M10 110 L70 80 L110 90 L190 10" stroke="#4cd964" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M190 10 l-36 4 M190 10 l-4 36" stroke="#4cd964" stroke-width="12" stroke-linecap="round"/></svg></div>
  ${["❤️", "😂", "🔥", "❤️", "😂", "🔥", "😂"].map((e, k) => `<div id="${id}e${k}" style="position:absolute;left:${120 + k * 130}px;top:${1500 + (k % 3) * 60}px;font-size:80px">${e}</div>`).join("")}`;
// бот на экране у Стаса
const MKCARD = () => BOTH("Mark II · до 900 тыс", `<div id="mcc">${CARD("Toyota Mark II · 2003", "790 000 ₽", "рынок ≈ 950 000 ₽ · ул. Ленина", "🔥 −17% к рынку · ⏱ 1 с после публикации")}</div>`);
const CTA65 = `<div style="position:absolute;left:60px;right:60px;top:1330px;z-index:70;background:#ffd23f;border:8px solid #151515;border-radius:34px;padding:26px 30px;box-shadow:0 14px 0 #151515;font-family:Unbounded;font-weight:900;color:#151515;text-align:center">
  <div style="font-size:52px;line-height:1.12">Бот <span style="color:#c0392b">«Перехват»</span><br>— ссылка в шапке</div><div style="margin-top:12px;font-size:30px;font-family:Onest;font-weight:800">объявления по всей России · через ~1 с после публикации</div></div>`;
