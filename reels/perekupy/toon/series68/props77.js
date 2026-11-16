// ep77 «Толян · 16: свой автосалон» (продолжение мини-сериала «Толян: со ста тысяч», без мата): герои и реквизит (базовые помощники — props.js)
// Новые герои: хозяйка площадки Римма Захаровна (из «vika»: серый костюм, тёмно-рыжее каре), дед Палыч (продаёт «пятёрку» 1998 года).
const RIM = html => html.replaceAll("#8e1f3a", "#4a4f63").replaceAll("#5c1426", "#33374a").replaceAll("#2b1a14", "#7a2a1a").replaceAll("#2c3e66", "#2b2f37")
  .replace(/fill="#ff3b30" stroke="#151515" stroke-width="4" transform="rotate\(-20/g, 'fill="#f4f0e8" stroke="#151515" stroke-width="4" transform="rotate(-20');
const PAL = { jacket: "#6a4a2a", pants: "#3a3f46", hair: "#e8e8e8", mustache: true, glasses: true, cap: "#3a4a3a", look: "flat" };   // дед Палыч (новый герой)
const V05 = "vaz2105/vaz2105_34.png", V05S = "vaz2105/vaz2105_side_r.png", MK2 = "markii/markii_cherry.png";
Object.assign(CINE.SIZES, { [MK2]: [983, 467] });
Object.assign(CINE.SIZES, { [V05]: [775, 352], [V05S]: [724, 267], [MK2]: [983, 467] });
const TITLE = (a, b) => `<div style="position:absolute;left:0;right:0;top:300px;text-align:center;font-family:Unbounded;font-weight:900;line-height:1;letter-spacing:-3px;z-index:50">
  <span style="display:inline-block;padding:10px 28px 18px;border:8px solid #151515;border-radius:22px;box-shadow:0 12px 0 #151515;font-size:82px;background:#ffd23f;color:#151515;transform:rotate(-3deg)">${a}</span><br>
  <span style="display:inline-block;padding:10px 28px 18px;border:8px solid #151515;border-radius:22px;box-shadow:0 12px 0 #151515;font-size:66px;background:#ff3b30;color:#fff;margin-top:26px;transform:rotate(2deg)">${b}</span></div>`;
const V05CARD = (id = "vcc") => BOTH("ВАЗ · до 200 тыс", `<div id="${id}">${CARD("ВАЗ-2105 · 1998 · 31 000 км", "160 000 ₽", "рынок ≈ 210 000 ₽ · 1 владелец", "🔥 −24% к рынку · ⏱ 1 с после публикации")}</div>`);
// счётчик сериала: капитал + машин на площадке (две строки)
const CNT77 = (money, cars) => `<div id="cnt77" style="position:absolute;left:40px;top:250px;z-index:60;font-family:'JetBrains Mono';font-weight:800;font-size:46px;color:#fff;background:#151515;border:6px solid #4cd964;border-radius:22px;padding:10px 22px;line-height:1.25">
  💰 <span id="cv">${money}</span> ₽<br>🚗 <span id="cc">${cars}</span>/10 <span style="font-size:30px;color:#8b93a3">на площадке</span></div>`;
// приём: договор аренды крупно, маркер выделяет главный пункт (#hl — ширина растёт)
const LEASE = () => `<div style="position:absolute;left:0;top:0;width:1080px;height:1920px;z-index:40;background:#3a3f52">
  <div style="position:absolute;left:110px;top:430px;width:860px;height:1080px;background:#fbfaf3;border:6px solid #151515;box-shadow:18px 20px 0 #0005;transform:rotate(1.5deg);padding:60px 64px;box-sizing:border-box;font-family:Onest;color:#151515">
    <div style="text-align:center;font-family:Unbounded;font-weight:900;font-size:50px">ДОГОВОР АРЕНДЫ</div><div style="text-align:center;font-size:28px;color:#666;margin-bottom:40px">площадки бывшей АЗС · 8 недель</div>
    <div style="font-size:34px;line-height:1.6">1. Арендная плата — <b>100 000 ₽</b> в месяц.<br>2. Арендатор: А. Толян.<br>
      <span style="position:relative;display:inline-block"><span id="hl" style="position:absolute;left:-8px;top:6px;height:44px;width:0;background:#ffd23f;z-index:-1"></span>3. Через 8 недель на площадке — <b>10 автомобилей.</b></span><br>
      <span style="position:relative;display:inline-block"><span id="hl2" style="position:absolute;left:-8px;top:6px;height:44px;width:0;background:#ff9b9b;z-index:-1"></span>4. Иначе площадка переходит <b>Г. Жоре.</b></span></div>
    <div style="margin-top:70px;font-size:28px;color:#666">Арендодатель: ______ Р. З.&nbsp;&nbsp;&nbsp; Арендатор: <span style="font-family:'Caveat',cursive;font-size:46px;color:#1f4fb8">Толян</span></div></div></div>`;
// приём: брезент на машине — сдёргивают (#tarp уезжает вбок и вверх)
const TARP = (l, ground, w, id = "tarp", z = 8) => { const h = w * .5; return `<div id="${id}" style="position:absolute;left:${l - 20}px;top:${ground - h}px;width:${w + 40}px;height:${h + 10}px;z-index:${z}"><svg viewBox="0 0 400 200" preserveAspectRatio="none" style="width:100%;height:100%;overflow:visible">
  <path d="M10 196 Q20 70 120 40 Q200 10 290 40 Q380 70 392 196 Z" fill="#5a6a4a" stroke="#151515" stroke-width="6" stroke-linejoin="round"/>
  <path d="M80 190 Q100 120 140 70 M200 190 Q210 110 220 30 M320 190 Q300 120 270 60" stroke="#46543a" stroke-width="6" fill="none"/></svg></div>`; };
// табличка «КОМИССИЯ» на лобовом стекле
const KOMIS = (x, y, id = "km", z = 9) => `<div id="${id}" style="position:absolute;left:${x}px;top:${y}px;z-index:${z};background:#fff;border:6px solid #151515;border-radius:14px;padding:8px 18px;font-family:Unbounded;font-weight:900;font-size:30px;color:#c0392b;transform:rotate(-4deg);text-align:center;line-height:1.15">КОМИССИЯ<br><span style="color:#151515;font-size:38px">195 000 ₽</span></div>`;
// баннер Жоры на пустом щите через дорогу (щит фона ploshchadkavecher: 580,600 440×110) — разворачивается сверху (#zb scaleY)
const ZBANNER = (id = "zb", z = 3) => `<div id="${id}" style="position:absolute;left:580px;top:600px;width:440px;height:110px;z-index:${z};transform-origin:50% 0;background:#c0392b;border:6px solid #151515;box-sizing:border-box;font-family:Unbounded;font-weight:900;color:#fff;text-align:center;line-height:1.05;padding-top:10px">
  <div style="font-size:38px">ЖОРА МОТОРС</div><div style="font-size:24px;color:#ffd23f">СКОРО ОТКРЫТИЕ</div></div>`;
const PIP = (inner, id, ring = "#ffd23f", left = 700, top = 1440, bgc = "#2b2f37") => `<div id="${id}" class="grp" style="position:absolute;left:${left}px;top:${top}px;width:320px;height:320px;border-radius:50%;overflow:hidden;border:9px solid ${ring};z-index:45;background:${bgc};box-shadow:0 10px 30px #0008">${inner}</div>`;
const PIPS = (inner, p, id, ring, left, top) => { const out = PIP(inner, id, ring, left, top); CINE.ANCH[p] = [left + 160, top + 30, .8]; return out; };
// приём: флешбэк — кадр из финала прошлого сезона (ep56, «А дальше — два миллиона, брат») в сепии, с плёночной рамкой
const FLASH = (id = "fb") => `<div id="${id}" style="position:absolute;left:0;top:0;width:1080px;height:1920px;z-index:40;background:#1a140c;overflow:hidden">
  <img src="fb_finale.jpg" style="position:absolute;left:60px;top:200px;width:960px;height:1707px;filter:sepia(.8) brightness(1.45) contrast(1.1);border:14px solid #f4ead2;box-shadow:0 20px 60px #000;transform:rotate(-1.5deg)">
  <div style="position:absolute;left:0;right:0;top:120px;text-align:center"><span style="font-family:Unbounded;font-weight:900;font-size:52px;color:#151515;background:#f4ead2;border:6px solid #151515;padding:6px 26px 12px;transform:rotate(-3deg);display:inline-block">ЧАСТЬ 15 · ФИНАЛ</span></div></div>`;
