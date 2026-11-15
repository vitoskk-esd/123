// ep63 «Викторина: вопрос на миллион»: герои и реквизит (базовые помощники — props.js)
const STAS = { jacket: "#3a3f46", pants: "#2b2f37", cap: "#2f6db5", hair: "#8a5a33", look: "grin" };                  // перекуп Стас
const HOST = { jacket: "#151515", tie: true, pants: "#151515", hair: "#2b1a14", look: "grin" };       // ведущий Аркадий (новый герой)
const CAM = "camry/camry.png";
Object.assign(CINE.SIZES, { [CAM]: [1317, 627] });
const INHAND = (x, foot, h, arm, w, html, z = 8, rot = 0, id = "") => {
  const s = h / 740, l = x - 210 * s, t = foot - 740 * s, A = arm * Math.PI / 180;
  const hx = l + (292 + 26 * Math.cos(A) - 130 * Math.sin(A)) * s, hy = t + (400 + 26 * Math.sin(A) + 130 * Math.cos(A)) * s;
  return `<div class="prop"${id ? ` id="${id}"` : ""} style="left:${hx - w / 2}px;top:${hy - w / 2}px;width:${w}px;height:${w}px;z-index:${z};transform:rotate(${rot}deg)">${html}</div>`;
};
const HALF = (frameHtml, side) => `<div class="half" style="position:absolute;left:0;top:0;width:1080px;height:1920px;clip-path:inset(0 270px 0 270px);transform:translateX(${side * 270}px)">${frameHtml}</div>`;
const TITLE = (a, b) => `<div style="position:absolute;left:0;right:0;top:300px;text-align:center;font-family:Unbounded;font-weight:900;line-height:1;letter-spacing:-3px;z-index:50">
  <span style="display:inline-block;padding:10px 28px 18px;border:8px solid #151515;border-radius:22px;box-shadow:0 12px 0 #151515;font-size:82px;background:#ffd23f;color:#151515;transform:rotate(-3deg)">${a}</span><br>
  <span style="display:inline-block;padding:10px 28px 18px;border:8px solid #151515;border-radius:22px;box-shadow:0 12px 0 #151515;font-size:96px;background:#ff3b30;color:#fff;margin-top:26px;transform:rotate(2deg)">${b}</span></div>`;
// стойка игрока с табличкой имени (поверх ног)
const PODIUM = (x, foot, w = 420, name = "ЖОРА", z = 9) => `<div style="left:${x - w / 2}px;top:${foot - w * .78}px;width:${w}px;height:${w * .8}px;z-index:${z}"><svg viewBox="0 0 420 336" style="overflow:visible">
  <path d="M30 40 H390 L360 336 H60 Z" fill="#141a5a" stroke="#151515" stroke-width="8"/><path d="M30 40 H390" stroke="#7a8cff" stroke-width="10"/>
  <rect x="90" y="110" width="240" height="80" rx="14" fill="#0b1040" stroke="#ffd23f" stroke-width="6"/><text x="210" y="166" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="44" fill="#ffd23f">${name}</text>
  <path d="M80 250 H340" stroke="#7a8cff" stroke-width="8" opacity=".6"/></svg></div>`;
// приём 1 — табло: вопрос и 4 ответа (А Б В Г); состояния — классы через gsap (цвет фона)
const ANS = [["А", "Авторынок в 5 утра"], ["Б", "Объявление в газете"], ["В", "Спросить у тёщи"], ["Г", "Бот — через 1 секунду"]];
const PLATE = (id, l, t, w, html, fs = 34) => `<div id="${id}" style="position:absolute;left:${l}px;top:${t}px;width:${w}px;height:100px;background:#0b1040;border:6px solid #ffd23f;border-radius:50px;box-shadow:0 0 24px #5a7aff88;
  font-family:Onest;font-weight:800;font-size:${fs}px;color:#fff;display:flex;align-items:center;padding:0 26px;box-sizing:border-box;white-space:nowrap">${html}</div>`;
const BOARD = (top = 1300, id = "") => `<div${id ? ` id="${id}"` : ""} style="position:absolute;left:0;top:0;width:1080px;height:1920px;z-index:45">
  ${PLATE(id + "q", 40, top, 1000, `<span style="width:100%;text-align:center;font-family:Unbounded;font-weight:900;font-size:40px">Где найти Камри ниже рынка?</span>`)}
  ${ANS.map(([k, t], i) => PLATE(`${id}a${i}`, i % 2 ? 550 : 40, top + 130 + Math.floor(i / 2) * 124, 490, `<b style="color:#ffd23f;font-family:Unbounded;margin-right:12px">${k}:</b>${t}`, 32)).join("")}</div>`;
// подсказки: 50:50, звонок другу, помощь зала
const LIFELINES = (id = "ll", used = []) => `<div id="${id}" style="position:absolute;left:0;right:0;top:1150px;z-index:46;display:flex;justify-content:center;gap:36px">
  ${["50:50", "📞", "👥"].map((t, i) => `<div id="${id}${i}" style="position:relative;width:150px;height:96px;border-radius:50%;background:#0b1040;border:6px solid #7a8cff;font-family:Unbounded;font-weight:900;font-size:${i ? 46 : 34}px;color:#fff;text-align:center;line-height:84px">${t}
    <svg id="${id}${i}x" viewBox="0 0 150 96" style="position:absolute;inset:-6px;width:150px;height:96px;opacity:${used.includes(i) ? 1 : 0}"><path d="M20 10 L130 86 M130 10 L20 86" stroke="#ff3b30" stroke-width="10" stroke-linecap="round"/></svg></div>`).join("")}</div>`;
// приём 2 — помощь зала: столбики голосования
const POLL = (id = "pl") => `<div id="${id}" style="position:absolute;left:140px;top:300px;width:800px;height:640px;z-index:45;background:#0b1040ee;border:8px solid #ffd23f;border-radius:30px;box-shadow:0 0 40px #5a7aff88">
  <div style="text-align:center;margin-top:20px;font-family:Unbounded;font-weight:900;font-size:40px;color:#fff">ПОМОЩЬ ЗАЛА</div>
  ${[["А", 9], ["Б", 2], ["В", 2], ["Г", 87]].map(([k, v], i) => `<div style="position:absolute;left:${70 + i * 175}px;bottom:30px;width:120px;text-align:center;font-family:Unbounded;font-weight:900;color:#fff">
    <div id="${id}v${i}" style="font-size:36px">${v}%</div><div id="${id}b${i}" style="margin:8px auto 0;width:90px;height:${Math.max(10, v * 3.6)}px;background:${i === 3 ? "#4cd964" : "#7a8cff"};border:5px solid #151515;border-radius:10px 10px 0 0;transform-origin:50% 100%"></div>
    <div style="font-size:44px;margin-top:8px;color:#ffd23f">${k}</div></div>`).join("")}</div>`;
// таймер звонка другу (30 с)
const CTIMER = (x, y, sec, id = "ct", w = 220) => { const r = 120, L = 2 * Math.PI * r;
  return `<div id="${id}" style="position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${w}px;z-index:60"><svg viewBox="0 0 300 300">
  <circle cx="150" cy="150" r="140" fill="#0b1040" stroke="#ffd23f" stroke-width="10"/><circle id="${id}r" cx="150" cy="150" r="${r}" fill="none" stroke="#5a7aff" stroke-width="26" stroke-dasharray="${L.toFixed(1)}" stroke-dashoffset="${(L * (1 - sec / 30)).toFixed(1)}" transform="rotate(-90 150 150)"/>
  <text id="${id}t" x="150" y="178" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="80" fill="#fff">${sec}</text></svg></div>`; };
// утешительный приз — чайник
const KETTLE = `<svg viewBox="0 0 120 110" style="overflow:visible"><path d="M20 100 Q14 40 60 36 Q106 40 100 100 Z" fill="#c9ccd2" stroke="#151515" stroke-width="6"/><path d="M100 60 q20 0 18 -24" stroke="#151515" stroke-width="7" fill="none"/>
  <path d="M20 66 L-6 46" stroke="#151515" stroke-width="10" stroke-linecap="round"/><rect x="48" y="20" width="24" height="18" rx="6" fill="#2b2f37" stroke="#151515" stroke-width="5"/><path d="M40 78 h40" stroke="#ffd23f" stroke-width="8"/></svg>`;
// бот на экране у Стаса
const STCARD = () => BOTH("Camry · до 2 млн", `<div id="scc">${CARD("Toyota Camry · 2018", "1 850 000 ₽", "рынок ≈ 2 150 000 ₽ · 1 владелец", "🔥 −14% к рынку · ⏱ 1 с после публикации")}</div>`);
const CTA63 = `<div style="position:absolute;left:60px;right:60px;top:1330px;z-index:70;background:#ffd23f;border:8px solid #151515;border-radius:34px;padding:26px 30px;box-shadow:0 14px 0 #151515;font-family:Unbounded;font-weight:900;color:#151515;text-align:center">
  <div style="font-size:52px;line-height:1.12">Бот <span style="color:#c0392b">«Перехват»</span><br>— ссылка в шапке</div><div style="margin-top:12px;font-size:30px;font-family:Onest;font-weight:800">объявления по всей России · через ~1 с после публикации</div></div>`;
