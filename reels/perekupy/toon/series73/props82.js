// ep82 «Толян · 21: кто первый» (сезон «Свой автосалон», без мата): герои и реквизит (базовые помощники — props.js)
// Новый герой: автоблогер Кирилл («KIRILL DRIVE»: оранжевое худи, осветлённые волосы, борода, тёмные очки). Возвращаются: Римма, Жора.
// Приёмы: перекидной таймер «ДНЕЙ ДО ВОСКРЕСЕНЬЯ» (#fc — цифра переворачивается), штампы «ВЫЗОВ…» / «ЗАНЯТО» на разделённом экране,
// интерфейс стрима поверх кадра (● REC, зрители, летящие сердечки #hearts, комментарии #cmts), счётчик просмотров.
const RIM = html => html.replaceAll("#8e1f3a", "#4a4f63").replaceAll("#5c1426", "#33374a").replaceAll("#2b1a14", "#7a2a1a").replaceAll("#2c3e66", "#2b2f37")
  .replace(/fill="#ff3b30" stroke="#151515" stroke-width="4" transform="rotate\(-20/g, 'fill="#f4f0e8" stroke="#151515" stroke-width="4" transform="rotate(-20');
const LEHA_O = { jacket: "#151515", pants: "#1d1d22", hair: "#e8b48d", chain: true, look: "flat" };
// лысина (убираем причёску) + татуировки: шея, висок, кисти
const LEHA = html => html
  .replace(/<path d="M124 186 q-4 -102 86 -104 q90 2 86 104 q-26 -46 -86 -46 q-60 0 -86 46 z" fill="#e8b48d"[^>]*\/>/g, '<path d="M150 120 q60 -40 120 0" stroke="#f4d0b0" stroke-width="10" fill="none" opacity=".7" stroke-linecap="round"/>')
  .replace(/(<path d="M188 330 h44 v40 h-44 z"[^>]*\/>)/g, '$1<path d="M194 340 q8 10 0 20 M206 336 l6 10 l6 -10 l6 10 M222 344 q6 8 0 18" stroke="#1f2f55" stroke-width="6" fill="none"/>'
    + '<path d="M196 368 l14 -18 l14 18" stroke="#1f2f55" stroke-width="6" fill="none"/>')
  .replace(/(<ellipse cx="298" cy="232" rx="20" ry="28"[^>]*\/>)/g, '$1<path d="M262 120 q22 10 24 40 q-14 -10 -26 -6 q14 14 10 34 q-12 -16 -26 -18" stroke="#1f2f55" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M110 250 q-8 14 2 26" stroke="#1f2f55" stroke-width="5" fill="none"/>')
  .replace(/(<circle cx="106" cy="532" r="17"[^>]*\/>)/g, '$1<path d="M96 524 l10 10 l10 -10 M98 542 h16" stroke="#1f2f55" stroke-width="4" fill="none"/>');
const CNT77 = (money, cars) => `<div id="cnt77" style="position:absolute;left:40px;top:250px;z-index:60;font-family:'JetBrains Mono';font-weight:800;font-size:46px;color:#fff;background:#151515;border:6px solid #4cd964;border-radius:22px;padding:10px 22px;line-height:1.25">
  💰 <span id="cv">${money}</span> ₽<br>🚗 <span id="cc">${cars}</span>/10 <span style="font-size:30px;color:#8b93a3">на площадке</span></div>`;
const SIGN77 = (x = 300, y = 590, z = 3, sc = 1) => `<div style="position:absolute;left:${x}px;top:${y}px;z-index:${z};transform-origin:0 0;scale:${sc};background:#ffd23f;border:8px solid #151515;box-shadow:0 10px 0 #151515;padding:8px 26px 12px;font-family:Unbounded;font-weight:900;font-size:44px;color:#151515;transform:rotate(-2deg);white-space:nowrap">АВТОСАЛОН ТОЛЯНА</div>`;
const SPLIT2 = (lbg, lhtml, rbg, rhtml) => {
  const fix = h => h.replaceAll('style="left:', 'style="position:absolute;left:');
  const half = (x, bg, html) => `<div style="position:absolute;left:${x}px;top:0;width:534px;height:1920px;overflow:hidden"><div style="position:absolute;left:-273px;top:0;width:1080px;height:1920px">${BGS[bg]}${fix(html)}</div></div>`;
  return `<div style="position:absolute;left:0;top:0;width:1080px;height:1920px;z-index:40;background:#fff">${half(0, lbg, lhtml)}${half(546, rbg, rhtml)}
    <div style="position:absolute;left:527px;top:0;width:26px;height:1920px;background:#fff;box-shadow:0 0 30px #000;z-index:5"></div></div>`; };
const PIP = (inner, id, ring = "#ffd23f", left = 700, top = 1440, bgc = "#2b2f37") => `<div id="${id}" class="grp" style="position:absolute;left:${left}px;top:${top}px;width:320px;height:320px;border-radius:50%;overflow:hidden;border:9px solid ${ring};z-index:45;background:${bgc};box-shadow:0 10px 30px #0008">${inner}</div>`;
const PIPS = (inner, p, id, ring, left, top) => { const out = PIP(inner, id, ring, left, top); CINE.ANCH[p] = [left + 160, top + 30, .8]; return out; };
const TITLE = (a, b) => `<div style="position:absolute;left:0;right:0;top:300px;text-align:center;font-family:Unbounded;font-weight:900;line-height:1;letter-spacing:-3px;z-index:50">
  <span style="display:inline-block;padding:10px 28px 18px;border:8px solid #151515;border-radius:22px;box-shadow:0 12px 0 #151515;font-size:82px;background:#ffd23f;color:#151515;transform:rotate(-3deg)">${a}</span><br>
  <span style="display:inline-block;padding:10px 28px 18px;border:8px solid #151515;border-radius:22px;box-shadow:0 12px 0 #151515;font-size:70px;background:#ff3b30;color:#fff;margin-top:26px;transform:rotate(2deg)">${b}</span></div>`;
const CONFETTI = (id = "cf", z = 35) => { let s = 11; const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
  return `<svg id="${id}" style="position:absolute;left:0;top:0;width:1080px;height:1920px;z-index:${z};pointer-events:none;transform-origin:540px 700px" viewBox="0 0 1080 1920">
  ${Array.from({ length: 90 }, () => `<rect x="${(r() * 1080).toFixed(0)}" y="${(r() * 1300 + 200).toFixed(0)}" width="${(10 + r() * 14).toFixed(0)}" height="${(18 + r() * 16).toFixed(0)}"
    fill="${["#ff3b30", "#ffd23f", "#2f6db5", "#4cd964", "#ff6fae"][Math.floor(r() * 5)]}" transform="rotate(${(r() * 180).toFixed(0)})" transform-origin="center"/>`).join("")}</svg>`; };
const KIRILL = { jacket: "#ff7a1a", pants: "#2b2f37", hair: "#f0d060", beard: true, shades: true, look: "grin" };
const MAZ = "mazda6/mazda6_side_r.png", COR = "corolla/corolla.png", PRI = "priora/priora_white.png";
Object.assign(CINE.SIZES, { [MAZ]: [722, 244], [COR]: [1358, 462], [PRI]: [1263, 410] });
const MAZCARD = (id = "mzc") => BOTH("Ниже рынка 15%+", `<div id="${id}">${CARD("Mazda 6 · 2016 · от блогера", "1 160 000 ₽", "рынок ≈ 1 400 000 ₽ · твой город", "🔥 −17% к рынку · ⏱ 1 с после публикации")}</div>`);
const CORCARD = (id = "crc") => BOTH("Ниже рынка 15%+", `<div id="${id}">${CARD("Toyota Corolla · 2012 · 1 владелец", "890 000 ₽", "рынок ≈ 1 050 000 ₽ · твой город", "🔥 −15% к рынку · ⏱ 1 с после публикации")}</div>`);
const PRICARD = (id = "prc") => BOTH("Ниже рынка 15%+", `<div id="${id}">${CARD("Lada Priora · 2013 · не такси", "260 000 ₽", "рынок ≈ 320 000 ₽ · твой город", "🔥 −19% к рынку · ⏱ 1 с после публикации")}</div>`);
const TWOCARDS4 = () => `<div style="position:absolute;left:0;top:0;width:1080px;height:1920px;z-index:40;background:radial-gradient(circle at 50% 40%,#3a4a5e,#121722)">
  <div style="position:absolute;left:230px;top:300px;width:620px;height:1320px;border-radius:72px;background:#0d0e12;border:14px solid #2a2d34;box-shadow:0 30px 80px #000c;overflow:hidden">
    <div style="position:absolute;left:0;top:0;width:580px;padding:40px 30px;transform:scale(1.02);transform-origin:0 0">${CORCARD("crc2")}<div style="height:26px"></div>${PRICARD("prc2")}</div></div></div>`;
// приём: перекидной таймер на весь экран (#fc — карточка с цифрой, #fcl — подпись)
const FLIPCLOCK = (n, label = "ДНЕЙ ДО ВОСКРЕСЕНЬЯ", id = "fc") => `<div style="position:absolute;left:0;top:0;width:1080px;height:1920px;z-index:40;background:radial-gradient(circle at 50% 45%,#3a2a2e,#110c10)">
  <div style="position:absolute;left:0;right:0;top:470px;text-align:center;font-family:Unbounded;font-weight:900;font-size:58px;color:#ffd23f;letter-spacing:-1px">ДЕДЛАЙН</div>
  <div id="${id}" style="position:absolute;left:290px;top:580px;width:500px;height:640px;border-radius:40px;background:linear-gradient(#26262c 50%,#1c1c21 50%);border:10px solid #0b0b0d;box-shadow:0 30px 80px #000c;
    font-family:Unbounded;font-weight:900;font-size:480px;line-height:640px;text-align:center;color:#f4f0e8;transform-origin:50% 50%"><span id="${id}n">${n}</span>
    <div style="position:absolute;left:0;right:0;top:315px;height:10px;background:#0b0b0d"></div></div>
  <div id="${id}l" style="position:absolute;left:0;right:0;top:1290px;text-align:center;font-family:Unbounded;font-weight:900;font-size:56px;color:#fff;line-height:1.1">${label}</div>
  <div style="position:absolute;left:0;right:0;top:1460px;text-align:center;font-family:Onest;font-weight:700;font-size:40px;color:#b9bfca">три машины — или площадка уходит Жоре</div></div>`;
// штамп поверх половины разделённого экрана
const STAMP = (text, color, x, y, id, rot = -8) => `<div id="${id}" style="position:absolute;left:${x}px;top:${y}px;z-index:30;transform:rotate(${rot}deg);padding:10px 26px;border:9px solid ${color};border-radius:18px;
  font-family:Unbounded;font-weight:900;font-size:58px;color:${color};background:#ffffffd0;white-space:nowrap">${text}</div>`;
// приём: интерфейс стрима поверх кадра — REC, зрители, сердечки, комментарии
const STREAM = (cmts, viewers = "12 400", id = "st") => `<div id="${id}" style="position:absolute;left:0;top:0;width:1080px;height:1920px;z-index:38;pointer-events:none;font-family:Onest">
  <div style="position:absolute;left:44px;top:420px;display:flex;gap:14px;align-items:center">
    <div style="background:#ff2d55;color:#fff;font-weight:800;font-size:34px;padding:6px 18px;border-radius:12px">● REC</div>
    <div style="background:#000a;color:#fff;font-weight:700;font-size:32px;padding:6px 18px;border-radius:12px">👁 <span id="${id}v">${viewers}</span></div></div>
  <div id="${id}h" style="position:absolute;right:50px;top:900px;width:120px;height:600px">${[0, 1, 2, 3, 4, 5].map(k => `<div class="hrt" style="position:absolute;left:${(k * 37) % 70}px;top:${500 - k * 90}px;font-size:${54 + (k % 3) * 10}px">${["❤️", "🔥", "😂"][k % 3]}</div>`).join("")}</div>
  <div id="${id}c" style="position:absolute;left:40px;bottom:120px;width:720px">${cmts.map(([n, t], k) => `<div class="cmt" style="display:flex;gap:14px;align-items:center;margin-top:14px">
    <div style="width:56px;height:56px;border-radius:50%;background:${["#5ab0ff", "#ffd23f", "#4cd964", "#ff6fae"][k % 4]};border:4px solid #fff"></div>
    <div style="background:#000b;border-radius:18px;padding:8px 18px;color:#fff;font-size:32px;line-height:1.2"><b style="color:#ffd23f">${n}</b> ${t}</div></div>`).join("")}</div></div>`;
const VIEWS = (count, x = 230, y = 640, id = "vw") => `<div id="${id}" style="position:absolute;left:${x}px;top:${y}px;z-index:42;transform:rotate(-4deg);background:#ff2d55;color:#fff;border:8px solid #151515;border-radius:24px;
  box-shadow:0 12px 0 #151515;padding:10px 30px;font-family:Unbounded;font-weight:900;font-size:64px;white-space:nowrap">👁 <span id="${id}n">${count}</span></div>`;
