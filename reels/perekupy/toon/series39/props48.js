// ep48 «ПЕРЕГОН · 900 км за ночь» — герои и реквизит (общие для раскадровки и видео; базовые помощники — props.js)
const KOSTYA = { jacket: "#3a7d5a", pants: "#2b2f37", hair: "#6b4a2b", scarf: "#ffd23f", glasses: true };
const DENIS = { coat: "#3a2a2a", jacket: "#1d1d1f", pants: "#1d1d1f", hair: "#1d1d1f", shades: true, chain: true, look: "grin" };
const LYUBA = { coat: "#f4f1e8", jacket: "#f4f1e8", pants: "#4a3a5a", hair: "#a0522d", scarf: "#c0392b", look: "grin" };
const INSP = { police: true, jacket: "#2f3f5a", pants: "#1f2a3a", look: "flat" };
const MARK = "markii/markii_cherry.png";
CINE.SIZES[MARK] = [983, 467];
const HUDP = (lis) => ({ tag: "перегон · 900 км", lis });
// часы на экране (отсчёт ночи)
const CLOCK = (t, c = "#ff3b30") => `<div style="position:absolute;left:60px;top:290px;z-index:52;font-family:'JetBrains Mono';font-weight:800;font-size:58px;color:${c};background:#0d0e12;
  border:6px solid ${c};border-radius:18px;padding:2px 20px;box-shadow:0 0 26px ${c}88,0 8px 0 #151515">🕒 ${t}</div>`;
// спинка кресла автобуса перед героем — он «сидит»
const SEAT = (x, y, w, z = 8) => `<div class="prop" style="left:${x}px;top:${y}px;width:${w}px;height:${w * 1.1}px;z-index:${z}"><svg viewBox="0 0 300 330">
  <path d="M10 330 V70 q0 -60 140 -60 q140 0 140 60 V330 z" fill="#2f5b9a" stroke="#151515" stroke-width="10"/><path d="M50 40 h200 v80 h-200 z" fill="#f4f1e8" stroke="#151515" stroke-width="7"/>
  <path d="M40 200 h220" stroke="#244a80" stroke-width="8"/></svg></div>`;
// спящий пассажир впереди (видна макушка в кепке над спинкой)
const SLEEPER = (x, y, w, cap = "#8a929b") => `<div class="prop" style="left:${x}px;top:${y}px;width:${w}px;height:${w * .6}px;z-index:7"><svg viewBox="0 0 200 120">
  <ellipse cx="100" cy="90" rx="60" ry="56" fill="#d9a07a" stroke="#151515" stroke-width="7"/><path d="M40 80 q0 -70 60 -70 q60 0 60 70 z" fill="${cap}" stroke="#151515" stroke-width="7"/>
  <text x="150" y="30" font-family="Caveat" font-weight="700" font-size="40" fill="#cfe2ff">z z</text></svg></div>`;
const BOTCARD48 = () => BOTH("", CARD("Toyota Mark II · 2000 · 1JZ", "790 000 ₽", "Казань · 900 км от тебя", "🔥 −17% к рынку · ⏱ 1 с после публикации"));
// скрин объявления с красным кругом маркером вокруг цены
const SCREEN48 = () => BOTH("скрин · 22:03", `<div style="position:relative">${CARD("Toyota Mark II · 2000 · 1JZ", "790 000 ₽", "Казань · опубликовано 22:03")}
  <svg viewBox="0 0 300 120" style="position:absolute;left:-14px;top:70px;width:330px;overflow:visible"><path d="M20 60 Q20 8 150 8 Q290 10 286 60 Q280 112 150 110 Q24 108 30 50" fill="none" stroke="#ff3b30" stroke-width="7" stroke-linecap="round"/></svg>
  <div style="font-family:Caveat;font-weight:700;font-size:52px;color:#ff3b30;transform:rotate(-6deg);margin-top:6px">← вот цена!</div></div>`);
// капот с документами крупно + чек-лист маркером
const HOOD = () => `<div style="left:0;top:0;width:1080px;height:1920px;background:radial-gradient(ellipse at 50% 30%, #c41f3c, #7a0f22 70%)"></div>
  <div style="left:-40px;top:1500px;width:1200px;height:500px;background:#0d0f16;transform:rotate(3deg)"></div>
  <div style="left:120px;top:620px;width:560px;height:720px;background:#fbfaf3;border:6px solid #151515;transform:rotate(-7deg);box-shadow:0 20px 0 rgba(0,0,0,.35);padding:30px;font-family:Onest;color:#222">
    <div style="font-family:Unbounded;font-weight:900;font-size:30px;text-align:center">ДОГОВОР<br>КУПЛИ-ПРОДАЖИ</div>
    ${Array.from({ length: 11 }, (_, k) => `<div style="height:12px;margin-top:${k ? 24 : 34}px;background:#c9c4b4;width:${k % 3 === 2 ? 70 : 100}%"></div>`).join("")}
    <div style="position:absolute;right:40px;bottom:50px;font-family:Caveat;font-weight:700;font-size:60px;color:#2f4fb8;transform:rotate(-8deg)">Костя</div></div>
  <div style="left:640px;top:880px;width:300px;height:520px;background:#0d0e12;border:10px solid #2a2d34;border-radius:44px;transform:rotate(9deg);padding:30px 22px;font-family:Onest;color:#fff">
    <div style="font-size:26px;color:#8b93a3;font-weight:700">ОСАГО</div><div style="font-family:Unbounded;font-weight:900;font-size:34px;color:#4cd964;margin-top:16px">оформлен ✓</div>
    <div style="font-size:24px;color:#b9bfca;margin-top:14px">онлайн · 5 минут</div></div>
  <svg viewBox="0 0 200 200" style="left:520px;top:1340px;width:200px;height:200px"><circle cx="60" cy="60" r="34" fill="none" stroke="#c9ced6" stroke-width="12"/><rect x="80" y="80" width="40" height="110" rx="10" fill="#151515" stroke="#000" stroke-width="5" transform="rotate(-40 100 135)"/></svg>`;
const CHECK = (k, t, y) => `<div class="hand wr" id="ck${k}" style="left:560px;top:${y}px;z-index:20;font-size:74px;color:#ffd23f;-webkit-text-stroke:2px #151515;transform:rotate(-4deg)">✓ ${t}</div>`;
// руль и край торпедо — перед водителем (камера на торпедо)
const DASH48 = `<div class="prop" style="left:0;top:1380px;width:1080px;height:540px;z-index:12"><svg viewBox="0 0 1080 540">
  <path d="M0 260 Q540 200 1080 260 V540 H0 Z" fill="#1f1d22" stroke="#151515" stroke-width="8"/>
  <ellipse cx="540" cy="250" rx="300" ry="170" fill="none" stroke="#151515" stroke-width="64"/><ellipse cx="540" cy="250" rx="300" ry="170" fill="none" stroke="#2b2b30" stroke-width="48"/>
  <path d="M540 250 V420 M300 250 H780" stroke="#2b2b30" stroke-width="40"/><circle cx="540" cy="260" r="60" fill="#2b2b30" stroke="#151515" stroke-width="8"/>
  <text x="540" y="272" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="26" fill="#c41f3c">MII</text></svg></div>`;
// рыжий кот на капоте
const CAT = (x, y, w) => `<div class="prop" style="left:${x}px;top:${y}px;width:${w}px;height:${w * .6}px;z-index:9"><svg viewBox="0 0 200 120">
  <path d="M20 110 q-10 -60 60 -70 q70 -6 90 40 q10 30 -10 30 z" fill="#e8892a" stroke="#151515" stroke-width="7"/><circle cx="150" cy="56" r="30" fill="#e8892a" stroke="#151515" stroke-width="7"/>
  <path d="M128 36 l6 -26 l14 20 M160 30 l16 -20 l2 28" fill="#e8892a" stroke="#151515" stroke-width="6" stroke-linejoin="round"/>
  <path d="M140 58 q6 -4 10 0 M158 58 q6 -4 10 0" stroke="#151515" stroke-width="5" fill="none"/><path d="M20 110 q-30 -10 -10 -40" stroke="#151515" stroke-width="10" fill="none"/>
  <path d="M60 60 l8 30 M90 52 l6 30" stroke="#c46a1a" stroke-width="7"/></svg></div>`;
// машина ДПС вдали
const POLICECAR = (x, y, w) => `<div class="prop" style="left:${x}px;top:${y}px;width:${w}px;height:${w * .42}px;z-index:3"><svg viewBox="0 0 300 126">
  <path d="M10 100 v-34 q0 -10 14 -12 l40 -6 l30 -34 h110 l34 34 l40 6 q12 2 12 14 v32 z" fill="#f4f6f8" stroke="#151515" stroke-width="6"/>
  <path d="M12 76 h276 v12 h-276 z" fill="#2f6db5"/><rect x="120" y="4" width="60" height="14" rx="4" fill="#ff3b30" stroke="#151515" stroke-width="4"/><rect x="150" y="4" width="30" height="14" fill="#2f6db5"/>
  <circle cx="70" cy="104" r="20" fill="#2b2b30" stroke="#151515" stroke-width="6"/><circle cx="232" cy="104" r="20" fill="#2b2b30" stroke="#151515" stroke-width="6"/>
  <text x="150" y="70" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="22" fill="#2f6db5">ДПС</text></svg></div>`;
// полосатый жезл в руке инспектора
const BATON = (x, y, s = 1) => `<div class="prop" style="left:${x}px;top:${y}px;width:${40 * s}px;height:${220 * s}px;z-index:8;transform:rotate(-20deg)"><svg viewBox="0 0 40 220">
  ${[0, 1, 2, 3, 4, 5].map(k => `<rect x="6" y="${k * 34}" width="28" height="34" fill="${k % 2 ? "#151515" : "#f4f6f8"}"/>`).join("")}<rect x="6" y="0" width="28" height="204" fill="none" stroke="#151515" stroke-width="5"/>
  <rect x="2" y="200" width="36" height="20" rx="6" fill="#151515"/></svg></div>`;
const CTA48 = `<div style="position:absolute;left:60px;right:60px;top:1330px;z-index:70;background:#ffd23f;border:8px solid #151515;border-radius:34px;padding:26px 30px;box-shadow:0 14px 0 #151515;font-family:Unbounded;font-weight:900;color:#151515;text-align:center">
  <div style="font-size:52px;line-height:1.12">Бот <span style="color:#c0392b">«Перехват»</span><br>— ссылка в шапке</div><div style="margin-top:12px;font-size:30px;font-family:Onest;font-weight:800">объявления по всей России · через ~1 с после публикации</div></div>`;
// снег (экранный слой; в видео летит вниз с ветром)
const SNOWFX = (n = 140, seed = 3, big = 1) => { let s = "", r = seed; const rnd = () => (r = (r * 16807) % 2147483647) / 2147483647;
  for (let i = 0; i < n; i++) { const d = (3 + rnd() * 8) * big; s += `<i style="left:${(rnd() * 1120 - 20).toFixed(0)}px;top:${(rnd() * 1960 - 20).toFixed(0)}px;width:${d.toFixed(1)}px;height:${d.toFixed(1)}px;opacity:${(.45 + rnd() * .5).toFixed(2)}"></i>`; }
  return `<div class="fx snow">${s}</div>`; };
