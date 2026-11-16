// ep78 «Толян · 17: учёба в Москве» (сезон «Свой автосалон», без мата): герои и реквизит (базовые помощники — props.js)
// Новый герой: Лёха — самый серьёзный перекуп Москвы (владелец 16.11): лысый, в татуировках, в кожанке, ездит на Rolls-Royce Cullinan.
const LEHA_O = { jacket: "#151515", pants: "#1d1d22", hair: "#e8b48d", chain: true, look: "flat" };
// лысина (убираем причёску) + татуировки: шея, висок, кисти
const LEHA = html => html
  .replace(/<path d="M124 186 q-4 -102 86 -104 q90 2 86 104 q-26 -46 -86 -46 q-60 0 -86 46 z" fill="#e8b48d"[^>]*\/>/g, '<path d="M150 120 q60 -40 120 0" stroke="#f4d0b0" stroke-width="10" fill="none" opacity=".7" stroke-linecap="round"/>')
  .replace(/(<path d="M188 330 h44 v40 h-44 z"[^>]*\/>)/g, '$1<path d="M194 340 q8 10 0 20 M206 336 l6 10 l6 -10 l6 10 M222 344 q6 8 0 18" stroke="#1f2f55" stroke-width="6" fill="none"/>'
    + '<path d="M196 368 l14 -18 l14 18" stroke="#1f2f55" stroke-width="6" fill="none"/>')
  .replace(/(<ellipse cx="298" cy="232" rx="20" ry="28"[^>]*\/>)/g, '$1<path d="M262 120 q22 10 24 40 q-14 -10 -26 -6 q14 14 10 34 q-12 -16 -26 -18" stroke="#1f2f55" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M110 250 q-8 14 2 26" stroke="#1f2f55" stroke-width="5" fill="none"/>')
  .replace(/(<circle cx="106" cy="532" r="17"[^>]*\/>)/g, '$1<path d="M96 524 l10 10 l10 -10 M98 542 h16" stroke="#1f2f55" stroke-width="4" fill="none"/>');
const CULL = "cullinan/cullinan_34.png", CULS = "cullinan/cullinan_side_r.png";
Object.assign(CINE.SIZES, { [CULL]: [740, 366], [CULS]: [726, 258] });
const SOLCARD = (id = "scc") => BOTH("Седан · до 800 тыс", `<div id="${id}">${CARD("Hyundai Solaris · 2017 · 1 владелец", "690 000 ₽", "рынок ≈ 820 000 ₽ · Москва", "🔥 −16% к рынку · ⏱ 1 с после публикации")}</div>`);
// счётчик сезона: капитал + машин на площадке
const CNT77 = (money, cars) => `<div id="cnt77" style="position:absolute;left:40px;top:250px;z-index:60;font-family:'JetBrains Mono';font-weight:800;font-size:46px;color:#fff;background:#151515;border:6px solid #4cd964;border-radius:22px;padding:10px 22px;line-height:1.25">
  💰 <span id="cv">${money}</span> ₽<br>🚗 <span id="cc">${cars}</span>/10 <span style="font-size:30px;color:#8b93a3">на площадке</span></div>`;
// приём: карта поездки — линия от площадки Толяна до Москвы (#route — stroke-dashoffset), самолётик/машинка едет по линии
const ROUTE = () => `<div style="position:absolute;left:0;top:0;width:1080px;height:1920px;z-index:40;background:#e8e0cc;overflow:hidden"><svg viewBox="0 0 1080 1920" style="position:absolute;inset:0">
  <path d="M-40 1500 q200 -120 380 -40 t420 -60 t360 -20 V1920 H-40 Z" fill="#cfe0b8"/><path d="M-40 520 q260 80 520 0 t600 40 V-40 H-40 Z" fill="#d6e6c0"/>
  ${[...Array(9)].map((_, k) => `<path d="M${k * 130} 0 V1920" stroke="#d8cdb4" stroke-width="3"/>`).join("")}${[...Array(14)].map((_, k) => `<path d="M0 ${k * 140} H1080" stroke="#d8cdb4" stroke-width="3"/>`).join("")}
  <path d="M120 300 q300 -60 500 40 t300 120" stroke="#7ab8d8" stroke-width="18" fill="none"/>
  <path id="route" d="M230 1480 C 330 1200, 760 1220, 700 940 S 560 640, 820 520" stroke="#c0392b" stroke-width="16" fill="none" stroke-linecap="round" stroke-dasharray="1400" stroke-dashoffset="0"/>
  <circle cx="230" cy="1480" r="26" fill="#ffd23f" stroke="#151515" stroke-width="7"/><circle cx="820" cy="520" r="34" fill="#c0392b" stroke="#151515" stroke-width="8"/>
  <text x="230" y="1560" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="40" fill="#151515">ПЛОЩАДКА ТОЛЯНА</text>
  <text x="820" y="460" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="64" fill="#151515">МОСКВА</text></svg>
  <div id="rcar" style="position:absolute;left:200px;top:1440px;width:70px;height:70px;font-size:62px;line-height:70px;text-align:center">🚗</div></div>`;
// приём: стеклянная доска, маркер пишет (строки #wb1..#wb3 — clip-path слева направо)
const BOARD78 = (x = 620, y = 520) => `<div style="position:absolute;left:${x}px;top:${y}px;width:420px;height:600px;z-index:4;background:rgba(232,242,244,.88);border:7px solid #151515;box-shadow:12px 14px 0 #0004;font-family:'Caveat','Comic Sans MS',cursive;color:#1f4fb8;padding:30px 24px;box-sizing:border-box;line-height:1.05">
  <div id="wb1" style="font-size:66px;clip-path:inset(0 100% 0 0)">СТОИТ =<br><span style="color:#c0392b">склад</span></div>
  <div id="wb2" style="font-size:66px;margin-top:26px;clip-path:inset(0 100% 0 0)">КРУТИТСЯ =<br><span style="color:#2f8a3a">салон</span></div>
  <div id="wb3" style="font-size:52px;margin-top:30px;clip-path:inset(0 100% 0 0)">→ чужие деньги</div></div>`;
// приём: экзамен на время — телефон с ботом + секундомер (#sw — текст секунд)
const EXAM = () => `<div style="position:absolute;left:0;top:0;width:1080px;height:1920px;z-index:40;background:radial-gradient(circle at 50% 40%,#2a3a5e,#0d1222)">
  <div style="position:absolute;left:250px;top:480px;width:580px;height:1060px;border-radius:70px;background:#0d0e12;border:14px solid #2a2d34;box-shadow:0 30px 80px #000c;overflow:hidden">
    <div style="position:absolute;left:0;top:0;width:560px;padding:40px 40px;transform:scale(.93);transform-origin:0 0">${SOLCARD("scc2")}</div></div>
  <div style="position:absolute;left:330px;top:250px;width:420px;height:150px;border-radius:30px;background:#151515;border:8px solid #ffd23f;display:flex;align-items:center;justify-content:center;font-family:'JetBrains Mono';font-weight:800;font-size:92px;color:#ffd23f">⏱ <span id="sw" style="margin-left:18px">00:00</span></div></div>`;
// приём-поворот: фото на стене — «2009: Лёха и молодой Жора» (герои рисуются внутри рамки, в сепии)
const PHOTO = inner => (inner = inner.replaceAll('style="left:', 'style="position:absolute;left:'), `<div style="position:absolute;left:0;top:0;width:1080px;height:1920px;z-index:40;background:#3a2e28">
  <div style="position:absolute;left:150px;top:420px;width:780px;height:960px;background:#f4ead2;border:18px solid #8a6a3a;box-shadow:0 24px 60px #000a;transform:rotate(-2deg);overflow:hidden">
    <div style="position:absolute;left:30px;top:30px;width:720px;height:780px;background:#cdbb98;overflow:hidden;filter:sepia(.8)">${inner}</div>
    <div style="position:absolute;left:0;right:0;bottom:26px;text-align:center;font-family:'Caveat','Comic Sans MS',cursive;font-size:64px;color:#3a2e28">2009 · Лёха и Жорик</div></div></div>`);
const PIP = (inner, id, ring = "#ffd23f", left = 700, top = 1440, bgc = "#2b2f37") => `<div id="${id}" class="grp" style="position:absolute;left:${left}px;top:${top}px;width:320px;height:320px;border-radius:50%;overflow:hidden;border:9px solid ${ring};z-index:45;background:${bgc};box-shadow:0 10px 30px #0008">${inner}</div>`;
const PIPS = (inner, p, id, ring, left, top) => { const out = PIP(inner, id, ring, left, top); CINE.ANCH[p] = [left + 160, top + 30, .8]; return out; };
const TITLE = (a, b) => `<div style="position:absolute;left:0;right:0;top:300px;text-align:center;font-family:Unbounded;font-weight:900;line-height:1;letter-spacing:-3px;z-index:50">
  <span style="display:inline-block;padding:10px 28px 18px;border:8px solid #151515;border-radius:22px;box-shadow:0 12px 0 #151515;font-size:82px;background:#ffd23f;color:#151515;transform:rotate(-3deg)">${a}</span><br>
  <span style="display:inline-block;padding:10px 28px 18px;border:8px solid #151515;border-radius:22px;box-shadow:0 12px 0 #151515;font-size:70px;background:#ff3b30;color:#fff;margin-top:26px;transform:rotate(2deg)">${b}</span></div>`;
