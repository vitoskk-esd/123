// ep59 «Свидание»: герои и реквизит (базовые помощники — props.js)
const WAITER = { jacket: "#151515", vest: "#f4f6f8", tie: true, pants: "#151515", hair: "#1d1d1f", look: "flat" };     // официант
const STAS = { jacket: "#3a3f46", pants: "#2b2f37", cap: "#2f6db5", hair: "#8a5a33", look: "grin" };                  // перекуп Стас
const CAM = "camry/camry.png";
Object.assign(CINE.SIZES, { [CAM]: [1317, 627] });
const INHAND = (x, foot, h, arm, w, html, z = 8, rot = 0) => {
  const s = h / 740, l = x - 210 * s, t = foot - 740 * s, A = arm * Math.PI / 180;
  const hx = l + (292 + 26 * Math.cos(A) - 130 * Math.sin(A)) * s, hy = t + (400 + 26 * Math.sin(A) + 130 * Math.cos(A)) * s;
  return `<div class="prop" style="left:${hx - w / 2}px;top:${hy - w / 2}px;width:${w}px;height:${w}px;z-index:${z};transform:rotate(${rot}deg)">${html}</div>`;
};
// обложка (кадр 0) — плашка названия как у #title шаблона: жёлтая рубрика + крупная красная плашка (владелец 14.11: «такой первый кадр во всех роликах»)
const TITLE = (a, b) => `<div style="position:absolute;left:0;right:0;top:300px;text-align:center;font-family:Unbounded;font-weight:900;line-height:1;letter-spacing:-3px;z-index:50">
  <span style="display:inline-block;padding:10px 28px 18px;border:8px solid #151515;border-radius:22px;box-shadow:0 12px 0 #151515;font-size:82px;background:#ffd23f;color:#151515;transform:rotate(-3deg)">${a}</span><br>
  <span style="display:inline-block;padding:10px 28px 18px;border:8px solid #151515;border-radius:22px;box-shadow:0 12px 0 #151515;font-size:112px;background:#ff3b30;color:#fff;margin-top:26px;transform:rotate(2deg)">${b}</span></div>`;
// приём 1 — анкета в приложении знакомств (экран телефона)
const DATING = () => `<div style="font-family:Onest;color:#fff">
  <div style="display:flex;justify-content:space-between;font-weight:800;font-size:30px;color:#ff6fae"><span>♥ знакомства</span><span style="color:#8b93a3">2 км</span></div>
  <div style="margin-top:14px;height:300px;border-radius:24px;background:linear-gradient(160deg,#ff9ac8,#7a3aa8);position:relative;overflow:hidden">
    <div style="position:absolute;left:118px;top:28px;width:224px;height:250px;border-radius:112px 112px 40px 40px;background:#5a2a1a;border:6px solid #151515"></div>
    <div style="position:absolute;left:150px;top:70px;width:160px;height:170px;border-radius:50%;background:#f1c7a8;border:6px solid #151515"></div>
    <div style="position:absolute;left:150px;top:62px;width:160px;height:60px;border-radius:80px 80px 10px 10px;background:#5a2a1a"></div>
    <div style="position:absolute;left:190px;top:140px;width:16px;height:16px;border-radius:50%;background:#151515"></div><div style="position:absolute;left:254px;top:140px;width:16px;height:16px;border-radius:50%;background:#151515"></div>
    <div style="position:absolute;left:204px;top:184px;width:52px;height:22px;border-bottom:6px solid #c0392b;border-radius:0 0 30px 30px"></div>
    <div style="position:absolute;left:0;right:0;bottom:0;height:90px;background:linear-gradient(transparent,#000a)"></div>
    <div style="position:absolute;left:22px;bottom:16px;font-family:Unbounded;font-weight:900;font-size:40px">Вика, 26</div></div>
  <div id="bio" style="margin-top:16px;padding:16px 20px;border-radius:20px;background:#1c1f26;font-weight:700;font-size:32px;line-height:1.3">Продаю Камри 2017 😉<br><span style="color:#8b93a3">ищу серьёзного</span></div>
  <div style="display:flex;justify-content:space-around;margin-top:20px">
    <div style="width:100px;height:100px;border-radius:50%;background:#2a2d34;font-size:52px;line-height:100px;text-align:center">✕</div>
    <div id="like" style="width:100px;height:100px;border-radius:50%;background:#ff3b6b;font-size:52px;line-height:100px;text-align:center">♥</div></div></div>`;
// приём 2 — шкала романтики: столбик из сердец, уровень падает с каждым вопросом про машину
const LOVEMETER = (x, y, lvl = 1, id = "love") => `<div id="${id}" style="position:absolute;left:${x}px;top:${y}px;z-index:30;width:150px;text-align:center">
  <div style="font-family:Caveat;font-weight:700;font-size:44px;color:#ffd1e0">романтика</div>
  <div style="position:relative;margin:8px auto 0;width:80px;height:460px;border-radius:40px;background:#2a1018;border:7px solid #151515;overflow:hidden">
    <div id="${id}f" style="position:absolute;left:0;right:0;bottom:0;height:${Math.round(lvl * 100)}%;background:linear-gradient(#ff8fb0,#ff3b6b)"></div></div>
  <div style="margin-top:-30px;font-size:70px">❤️</div></div>`;
// стол ресторана: скатерть, свеча, два бокала (поверх ног героев)
const RTABLE = (z = 9) => `<div style="left:140px;top:1360px;width:800px;height:560px;z-index:${z}"><svg viewBox="0 0 800 560" style="overflow:visible">
  <ellipse cx="400" cy="50" rx="390" ry="50" fill="#fbf6ec" stroke="#151515" stroke-width="7"/>
  <path d="M10 50 Q0 300 40 560 H760 Q800 300 790 50 Q400 140 10 50 Z" fill="#f1e6d2" stroke="#151515" stroke-width="7"/>
  <rect x="384" y="-70" width="32" height="90" fill="#fbf6ec" stroke="#151515" stroke-width="5"/><path d="M400 -78 q-12 -24 0 -46 q12 22 0 46 z" fill="#ffb84a"/>
  ${[250, 550].map(x => `<path d="M${x - 26} -40 h52 l-8 50 h-36 z" fill="#c0392b" fill-opacity=".75" stroke="#151515" stroke-width="5"/><path d="M${x} 10 v34 M${x - 20} 44 h40" stroke="#151515" stroke-width="5"/>`).join("")}</svg></div>`;
// приём 3 — салфетка с расчётом торга (вставка крупно)
const NAPKIN = () => `<div style="left:0;top:0;width:1080px;height:1920px;background:radial-gradient(circle at 50% 50%,#6a2a24,#2a0e0c 80%)"></div>
  <div style="left:80px;top:560px;width:920px;height:820px;background:#fbf6ec;border:6px solid #e8dcc6;transform:rotate(-3deg);box-shadow:0 20px 40px #0008;
    background-image:repeating-linear-gradient(0deg,transparent 0 38px,#efe4d0 38px 40px)">
    <div style="position:absolute;left:60px;top:60px;font-family:Caveat;font-weight:700;font-size:96px;line-height:1.15;color:#1d3a8a">
      <div id="n1">Камри 2017</div><div id="n2">1 900 000</div><div id="n3" style="color:#c0392b">− торг 150</div><div id="n4">= 1 750 000 ✔</div>
      <div id="n5" style="font-size:72px;color:#5a3820">+ ужин за мой счёт 🍷</div></div>
    <svg id="n6" viewBox="0 0 400 120" style="position:absolute;left:470px;top:300px;width:400px;height:120px;overflow:visible"><path d="M10 60 q90 -70 180 0 t180 0" stroke="#c0392b" stroke-width="10" fill="none"/></svg></div>
  <div style="left:820px;top:420px;width:60px;height:420px;background:linear-gradient(90deg,#1d3a8a,#2f6db5);border:5px solid #151515;border-radius:10px;transform:rotate(28deg)"></div>`;
const MONEY = `<svg viewBox="0 0 120 100"><g stroke="#151515" stroke-width="5">${[0, 1, 2, 3].map(k => `<rect x="${10 + k * 4}" y="${60 - k * 14}" width="96" height="40" rx="6" fill="#8fd17a"/>`).join("")}<rect x="54" y="18" width="18" height="44" fill="#e6b422"/></g></svg>`;
const BILL = `<svg viewBox="0 0 100 130"><rect x="10" y="10" width="80" height="110" rx="6" fill="#151515" stroke="#e6b422" stroke-width="5"/><rect x="22" y="26" width="56" height="70" fill="#fbf6ec"/><path d="M30 40 h40 M30 54 h40 M30 68 h28" stroke="#5b6670" stroke-width="5"/><text x="50" y="90" text-anchor="middle" font-family="Onest" font-weight="800" font-size="13" fill="#c0392b">4 800 ₽</text></svg>`;
const CAMCARD = () => BOTH("Camry · до 2 млн", `<div id="ncc">${CARD("Toyota Camry · 2017", "1 900 000 ₽", "рынок ≈ 2 150 000 ₽ · 1 хозяйка · срочно", "🔥 −12% к рынку · ⏱ 1 с после публикации")}</div>`);
const CTA59 = `<div style="position:absolute;left:60px;right:60px;top:1330px;z-index:70;background:#ffd23f;border:8px solid #151515;border-radius:34px;padding:26px 30px;box-shadow:0 14px 0 #151515;font-family:Unbounded;font-weight:900;color:#151515;text-align:center">
  <div style="font-size:52px;line-height:1.12">Бот <span style="color:#c0392b">«Перехват»</span><br>— ссылка в шапке</div><div style="margin-top:12px;font-size:30px;font-family:Onest;font-weight:800">объявления по всей России · через ~1 с после публикации</div></div>`;
const HALF = (frameHtml, side) => `<div class="half" style="position:absolute;left:0;top:0;width:1080px;height:1920px;clip-path:inset(0 270px 0 270px);transform:translateX(${side * 270}px)">${frameHtml}</div>`;
