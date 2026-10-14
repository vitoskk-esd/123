/* Сцены ролика №6 (раскадровка, утверждена владельцем 14.10) — общий код для board.html (кадры) и video6.html (ролик).
   Вызывающая страница задаёт P (куда добавлять HTML) и F (номер сцены), затем reseed(F) и S[F](). */
var F = 1, P = () => {};
const OL = "#1e1717", st = (w = 6) => `stroke="${OL}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
var seed = 3; const reseed = (f) => { seed = f * 97 + 3; }; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const noise = (op) => `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 ${op} 0'/></filter><rect width='300' height='300' filter='url(#n)'/></svg>`)}")`;

/* ---------- общие детали в стиле кухни ---------- */
const DEFS = `<defs>
  <radialGradient id="lamp" cx="30%" cy="10%" r="75%"><stop offset="0" stop-color="#ffd27a" stop-opacity=".5"/><stop offset="1" stop-color="#ffd27a" stop-opacity="0"/></radialGradient>
  <radialGradient id="vig" cx="50%" cy="50%" r="75%"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".6"/></radialGradient>
  <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b1230"/><stop offset="1" stop-color="#2a2550"/></linearGradient>
  <linearGradient id="day" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7cc4f2"/><stop offset="1" stop-color="#d6efff"/></linearGradient>
  <pattern id="oil" width="60" height="60" patternUnits="userSpaceOnUse"><rect width="60" height="60" fill="#f3e9d8"/><rect width="30" height="30" fill="#d9493f" opacity=".85"/><rect x="30" y="30" width="30" height="30" fill="#d9493f" opacity=".85"/><circle cx="45" cy="15" r="5" fill="#2f8f4a" opacity=".6"/><circle cx="15" cy="45" r="5" fill="#2f8f4a" opacity=".6"/></pattern>
  <pattern id="tiles" width="80" height="80" patternUnits="userSpaceOnUse"><rect width="80" height="80" fill="#d9d4c7"/><rect width="40" height="40" fill="#c9c3b4"/><rect x="40" y="40" width="40" height="40" fill="#c9c3b4"/></pattern>
  <pattern id="paper" width="44" height="44" patternUnits="userSpaceOnUse"><path d="M22 4 l4 8 -4 8 -4 -8z" fill="#000" opacity=".08"/></pattern>
  <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff3b0"/><stop offset=".5" stop-color="#e5b232"/><stop offset="1" stop-color="#fff3b0"/></linearGradient>
  <filter id="blur"><feGaussianBlur stdDeviation="8"/></filter></defs>`;
const wall = (c1, c2) => `<linearGradient id="w${F}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient><rect width="1920" height="1080" fill="url(#w${F})"/><rect width="1920" height="1080" fill="url(#paper)"/>`;
const windowNight = (x, y, w, h) => { let s = `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#sky)"/><circle cx="${x + w - 90}" cy="${y + 70}" r="30" fill="#f6efd0"/>`;
  for (let b = 0; b < 3; b++) { const bx = x + 40 + b * (w / 3), bh = h * (.5 + rnd() * .3); s += `<rect x="${bx}" y="${y + h - bh}" width="${w / 3 - 30}" height="${bh}" fill="#141a33"/>`;
    for (let r = y + h - bh + 16; r < y + h - 10; r += 28) for (let c = bx + 10; c < bx + w / 3 - 40; c += 24) if (rnd() < .35) s += `<rect x="${c}" y="${r}" width="12" height="14" fill="#ffcf6b"/>`; }
  return s + `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="#e9e1cf" stroke-width="22"/><path d="M${x + w / 2} ${y} V ${y + h} M${x} ${y + h * .45} H ${x + w}" stroke="#e9e1cf" stroke-width="14"/>`; };
const windowDay = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#day)"/><ellipse cx="${x + w * .3}" cy="${y + h * .35}" rx="90" ry="26" fill="#fff" opacity=".8"/><rect x="${x}" y="${y + h * .7}" width="${w}" height="${h * .3}" fill="#9bc79a" opacity=".7"/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="#f1ece0" stroke-width="22"/><path d="M${x + w / 2} ${y} V ${y + h}" stroke="#f1ece0" stroke-width="14"/>`;
const table = (y, pat = "oil") => `<path d="M0 ${y} L 1920 ${y - 30} L 1920 1080 L 0 1080 Z" fill="url(#${pat})"/><path d="M0 ${y} L 1920 ${y - 30}" stroke="#2b1f1a" stroke-width="10"/><path d="M0 ${y} L 1920 ${y - 30} L 1920 ${y + 10} L 0 ${y + 40} Z" fill="#000" opacity=".22"/>`;
const floor = (y, c = "#6b4a32") => `<rect y="${y}" width="1920" height="${1080 - y}" fill="${c}"/>${Array.from({ length: 12 }, (_, k) => `<path d="M${k * 170} ${y} L ${k * 170 - 80} 1080" stroke="#000" stroke-width="3" opacity=".18"/>`).join("")}<rect y="${y}" width="1920" height="14" fill="#000" opacity=".25"/>`;
const frame = (x, y, w, h, inner, c = "#efe7d3") => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="${c}" ${st(5)}/>${inner}`;
const clock = (x, y) => `<circle cx="${x}" cy="${y}" r="62" fill="#f1ece0" ${st(7)}/><path d="M${x} ${y} L ${x} ${y - 42} M${x} ${y} L ${x + 30} ${y + 12}" ${st(7)}/>`;
const plant = (x, y) => `<rect x="${x - 34}" y="${y - 56}" width="68" height="56" rx="6" fill="#c46a3c" ${st(5)}/><path d="M${x} ${y - 56} q -40 -60 -10 -120 M${x} ${y - 56} q 40 -50 20 -110 M${x} ${y - 56} q -6 -80 6 -150" fill="none" stroke="#3f8c4a" stroke-width="16" stroke-linecap="round"/>`;
const vign = `<rect width="1920" height="1080" fill="url(#vig)"/>`;
const lampLight = `<rect width="1920" height="1080" fill="url(#lamp)"/>`;

/* ---------- предметы ---------- */
const phone = (x, y, r, inner, s = 1) => `<div class="a" style="left:${x}px;top:${y}px;width:300px;height:600px;transform:rotate(${r}deg) scale(${s});transform-origin:0 0;border-radius:46px;background:#16161c;border:6px solid ${OL};box-shadow:0 30px 60px rgba(0,0,0,.5);padding:14px">
  <div style="width:100%;height:100%;border-radius:32px;background:linear-gradient(180deg,#eef5ff,#d6e4f5);position:relative;overflow:hidden">${inner}</div></div>`;
const push = (app, big, sub, c = "#2fa84f") => `<div class="a" style="left:14px;right:14px;top:66px;padding:18px;border-radius:22px;background:#fff;box-shadow:0 6px 16px rgba(0,0,0,.12)">
  <div class="nw" style="font:700 18px I;color:${c}">● ${app} · сейчас</div><div class="nw" style="font:900 38px/1.1 Unb;letter-spacing:-.03em;color:${OL};margin-top:10px">${big}</div><div style="font:700 18px/1.25 I;color:#6b7280;margin-top:6px">${sub}</div></div>`;
const tag = (x, y, r, k, v, yellow, s = 1) => `<div class="a" style="left:${x}px;top:${y}px;transform:rotate(${r}deg) scale(${s});transform-origin:0 0;padding:14px 26px 16px;background:${yellow ? "linear-gradient(135deg,#ffe066,#f2c230)" : "linear-gradient(135deg,#fff,#e9e9ee)"};border-radius:10px;box-shadow:0 16px 30px rgba(0,0,0,.4)">
  <div class="nw" style="font:700 30px/1 O;color:${OL}">${k}</div><div class="nw" style="font:900 60px/1.05 Unb;letter-spacing:-.04em;color:${OL}">${v}</div></div>`;
const chapter = (n, t) => `<div class="a" style="left:60px;top:54px;display:flex;align-items:stretch;box-shadow:0 14px 30px rgba(0,0,0,.4);transform:rotate(-1.5deg)">
  <div style="padding:14px 22px;background:#ff3b3b;font:700 34px/1 O;color:#fff">ГЛАВА ${n}</div><div class="nw" style="padding:14px 26px;background:#fff;font:700 34px/1 O;color:${OL}">${t}</div></div>`;
const bubble = (x, y, t, w = 420, tail = "left") => `<div class="a" style="left:${x}px;top:${y}px;width:${w}px;padding:22px 28px;background:#fff;border:6px solid ${OL};border-radius:34px;font:700 34px/1.2 I;color:${OL};box-shadow:8px 8px 0 rgba(0,0,0,.25)">${t}
  <div class="a" style="${tail}:60px;bottom:-30px;width:40px;height:40px;background:#fff;border-right:6px solid ${OL};border-bottom:6px solid ${OL};transform:rotate(45deg)"></div></div>`;
const coin = (x, y, s = 1) => `<div class="a" style="left:${x}px;top:${y}px;width:${90 * s}px;height:${90 * s}px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff6c0,#f0b72f 55%,#a86d00);border:${5 * s}px solid ${OL};display:flex;align-items:center;justify-content:center;font:900 ${44 * s}px Unb;color:#8a5200">₽</div>`;
const envelope = (x, y, r, label, glow, s = 1) => `<div class="a" style="left:${x}px;top:${y}px;transform:rotate(${r}deg) scale(${s});transform-origin:0 0;${glow ? "filter:drop-shadow(0 0 30px #ffd84d)" : ""}"><svg width="300" height="230" viewBox="0 0 300 230">
  <rect x="50" y="6" width="190" height="96" rx="8" fill="#f2c49a" ${st(5)}/><text x="145" y="68" text-anchor="middle" font-family="Unb" font-weight="900" font-size="36" fill="#8a3a14">5000</text>
  <path d="M8 76 H 292 V 222 H 8 Z" fill="#f4ead6" ${st(7)}/><path d="M8 76 L 150 166 L 292 76" fill="#e8dcc0" ${st(7)}/>
  <text x="150" y="212" text-anchor="middle" font-family="O" font-weight="700" font-size="28" fill="#c23b2f">${label}</text></svg></div>`;
const card = (x, y, r, c1, c2, s = 1) => `<div class="a" style="left:${x}px;top:${y}px;width:330px;height:208px;transform:rotate(${r}deg) scale(${s});transform-origin:0 0;border-radius:22px;border:5px solid ${OL};background:linear-gradient(135deg,${c1},${c2});box-shadow:0 20px 34px rgba(0,0,0,.4);overflow:hidden">
  <div class="a" style="inset:0;background:linear-gradient(115deg,rgba(255,255,255,.35),transparent 40%)"></div><div class="a" style="left:28px;top:64px;width:56px;height:42px;border-radius:9px;background:linear-gradient(135deg,#fff3b0,#d9a632);border:3px solid ${OL}"></div>
  <div class="a nw" style="left:28px;bottom:26px;font:700 22px I;letter-spacing:.14em;color:rgba(255,255,255,.95)">2200 •••• 2026</div></div>`;
// x, y, w — рамка головы (как раньше, 600×640); руки и ноги дорисовываются вокруг (владелец 14.10: «сделаем руки и ноги»)
const hero = (x, y, w, mood, look = 0, rim = "#ffd27a", arm = "down", legs = true) => { if (window.HERO_HOOK) return window.HERO_HOOK({ x, y, w, mood, look, rim, arm, legs }); const k = w / 600;
  return `<div class="a" style="left:${x - 130 * k}px;top:${y + 50 * k - (legs ? 55 : 0)}px;filter:drop-shadow(0 30px 30px rgba(0,0,0,.35))">${ArbuzHD.svg({ mood, look, rim, limbs: true, arm, w: 860 * k, h: 820 * k }).replace(legs ? "@@" : /<path d="M232 618[\s\S]*?stroke="#ff3b4f" stroke-width="8"\/>[\s\S]*?stroke="#ff3b4f" stroke-width="8"\/>/, "")}</div>`; };
const hand = (x, y) => `<div class="a" style="left:${x - 30}px;top:${y - 30}px;width:60px;height:60px;border-radius:50%;background:#fff;border:6px solid ${OL}"></div>`;
const arm = (d, w = 18) => `<svg class="a" style="left:0;top:0" width="1920" height="1080"><path d="${d}" fill="none" ${st(w)}/></svg>`;
const label = (n, t, time) => window.HERO_HOOK ? "" : `<div class="a" style="left:0;right:0;bottom:0;padding:16px 40px;background:rgba(10,8,12,.86);display:flex;gap:24px;align-items:center;font:700 26px I;color:#fff">
  <span style="padding:6px 14px;border-radius:8px;background:#ff3b3b;font:700 26px O">КАДР ${n}</span><span class="nw" style="opacity:.6">${time}</span><span>${t}</span></div>`;
const svg = (inner) => `<svg class="a" style="left:0;top:0" width="1920" height="1080" viewBox="0 0 1920 1080">${DEFS}${inner}</svg>`;
const grain = `<div class="a" style="inset:0;background:${noise(.22)};mix-blend-mode:multiply;pointer-events:none"></div>`;

const S = {
  1: () => {   // хук: та же кухня, что понравилась
    P(`<img class="a" src="${window.KITCHEN || "../../characters/hybrid/bg/kitchen.jpg"}" style="left:0;top:0;width:1920px;height:1080px">`);
    P(hero(600, 150, 700, "smirk", 16, "#ffd27a", "phone", false));
    P(phone(1225, 360, 8, push("Налоговая", "+19 500 ₽", "возврат за учёбу"), .62));   // телефон поверх руки — рука за телефоном (владелец 14.10)
    P(`<div class="a" style="left:1196px;top:540px;width:36px;height:56px;border-radius:18px;background:#fff;border:6px solid ${OL};transform:rotate(14deg)"></div>`);
    P(bubble(120, 380, "Тебе уже должны деньги. Ты просто их не забираешь.", 520));
    P(label(1, "Хук: Арбузов на кухне, пуш «+19 500 ₽». Фраза: «Пока ты ищешь подработку, у тебя под носом лежат деньги…»", "0:00–0:30"));
  },
  2: () => {   // глава 1: отделение банка
    P(svg(`${wall("#cfe2ea", "#9fbfcc")}<rect y="0" width="1920" height="130" fill="#2a3a48"/>${[0, 1, 2, 3, 4, 5].map(k => `<rect x="${80 + k * 310}" y="40" width="200" height="40" rx="8" fill="#ffe9a8" opacity=".85"/>`).join("")}
      ${windowDay(1380, 200, 460, 420)}${plant(1260, 760)}
      <rect x="80" y="520" width="1060" height="260" rx="14" fill="#f4f1ea" ${st(7)}/><rect x="80" y="500" width="1060" height="40" rx="10" fill="#d7d2c6" ${st(6)}/>
      <rect x="140" y="230" width="140" height="260" rx="12" fill="#2a3a48" ${st(6)}/><rect x="160" y="260" width="100" height="70" rx="6" fill="#7fd6ff"/><text x="210" y="306" text-anchor="middle" font-family="O" font-weight="700" font-size="30" fill="#0b2a3a">А012</text><rect x="175" y="360" width="70" height="14" rx="4" fill="#ffe9a8"/>
      ${floor(780, "#8a7a6a")}${lampLight}`));
    P(hero(560, 210, 560, "happy", 0, "#ffd27a", "wave"));
    P(card(1000, 380, -10, "#ffcf3f", "#e9a400", .8) + card(1150, 470, 8, "#ff5a4a", "#c8140b", .8));
    P(tag(980, 230, -8, "БОНУС НОВИЧКУ", "+1 000 ₽", true, .8) + tag(1300, 330, 7, "БОНУС НОВИЧКУ", "+2 000 ₽", false, .8));
    P(chapter(1, "БАНК ПЛАТИТ ЗА ЗНАКОМСТВО"));
    P(label(2, "Глава 1: отделение банка, на стойке карты с ценниками бонусов. Арбузов радуется.", "0:30–1:10"));
  },
  3: () => {   // глава 1: правило 180 дней
    P(svg(`${wall("#f2d39a", "#d9a35c")}${clock(1640, 180)}${frame(1460, 330, 340, 230, `<text x="1630" y="420" text-anchor="middle" font-family="O" font-weight="700" font-size="44" fill="#c23b2f">ЗАЯВКА</text><text x="1630" y="480" text-anchor="middle" font-family="O" font-weight="700" font-size="34" fill="#3a3030">брошена весной</text><path d="M1490 520 L 1770 360" stroke="#c23b2f" stroke-width="10"/>`)}
      ${floor(820)}${lampLight}
      <g transform="translate(330 300)"><path d="M0 0 H 260 V 30 Q 260 160 150 230 Q 260 300 260 430 V 460 H 0 V 430 Q 0 300 110 230 Q 0 160 0 30 Z" fill="#e8f4ff" fill-opacity=".7" ${st(9)}/><path d="M40 60 H 220 Q 210 150 130 200 Q 50 150 40 60 Z" fill="#e9b45a"/><path d="M60 420 Q 130 330 200 420 Z" fill="#e9b45a"/><rect x="-20" y="-24" width="300" height="30" rx="8" fill="#8a5a2b" ${st(6)}/><rect x="-20" y="454" width="300" height="30" rx="8" fill="#8a5a2b" ${st(6)}/></g>
      <text x="460" y="880" text-anchor="middle" font-family="Unb" font-weight="900" font-size="64" fill="${OL}">180 ДНЕЙ</text>`));
    P(hero(800, 230, 560, "shock", -10, "#ffd27a", "shrug"));
    P(bubble(1180, 640, "Я для вас новый клиент?", 470, "left"));
    P(label(3, "Глава 1: ловушка «новый клиент» — песочные часы 180 дней и брошенная анкета. Совет: спроси поддержку до оформления.", "1:10–1:50"));
  },
  4: () => {   // глава 2: друзья
    P(svg(`${wall("#c9b6e8", "#8e72c4")}${windowNight(1300, 140, 520, 420)}
      <rect x="60" y="220" width="420" height="300" rx="10" fill="#2b2050" ${st(6)}/>${[0, 1, 2].map(k => `<rect x="${90 + k * 130}" y="250" width="110" height="160" fill="${["#ff6b78", "#7fd6ff", "#ffe066"][k]}" opacity=".85"/>`).join("")}
      <path d="M0 760 Q 960 700 1920 760 V 1080 H 0 Z" fill="#4a3a6e"/><rect x="0" y="800" width="900" height="280" rx="30" fill="#ff8a5b" ${st(7)}/><rect x="20" y="760" width="860" height="80" rx="30" fill="#ffa57a" ${st(6)}/>
      ${lampLight}`));
    P(hero(260, 220, 560, "smirk", 18, "#ffd27a", "phone"));
    P(phone(860, 220, -6, `<div class="a" style="left:16px;right:16px;top:60px;font:700 20px I;color:#6b7280">Чат «Общага 4 этаж»</div>
      <div class="a" style="left:16px;right:60px;top:110px;padding:14px;border-radius:18px;background:#fff;font:700 22px/1.25 I;color:${OL}">Кто хотел карту? Вот ссылка 👇 <span style="color:#2f5bea">bank.ru/ref/arbuz</span></div>
      <div class="a" style="left:60px;right:16px;top:270px;padding:14px;border-radius:18px;background:#d9f7c8;font:700 22px/1.25 I;color:${OL}">О, как раз собирался!</div>`, .95));
    P(tag(1230, 560, 8, "ТЕБЕ ЗА ДРУГА", "+1 500 ₽", true, .85) + tag(1290, 760, -6, "ДРУГУ", "+500 ₽", false, .7));
    P(chapter(2, "ТВОИ ДРУЗЬЯ СТОЯТ ДЕНЕГ"));
    P(label(4, "Глава 2: «Приведи друга» — ссылка в чат общаги, ценники «тебе +1 500, другу +500» (суммы — пример, персональные).", "2:30–3:30"));
  },
  5: () => {   // глава 2: анти-дроп
    P(svg(`<rect width="1920" height="1080" fill="#15121c"/><rect x="0" y="0" width="760" height="1080" fill="#221c2c"/><rect x="1300" y="0" width="620" height="1080" fill="#1d1826"/>
      <path d="M760 0 V 1080 M1300 0 V 1080" stroke="#000" stroke-width="10"/>${[0, 1, 2, 3].map(k => `<rect x="${820 + k * 110}" y="${300 + (k % 2) * 40}" width="70" height="90" fill="#0b0a10"/>`).join("")}
      <ellipse cx="1060" cy="120" rx="300" ry="180" fill="#ffd27a" opacity=".22" filter="url(#blur)"/><path d="M1000 0 L 900 760 L 1220 760 L 1120 0 Z" fill="#ffd27a" opacity=".08"/>
      <rect y="900" width="1920" height="180" fill="#0d0b12"/>
      <!-- тень в капюшоне -->
      <g transform="translate(1340 320)"><path d="M0 560 Q -30 240 120 160 Q 270 240 240 560 Z" fill="#0a0910" ${st(6)}/><path d="M40 170 Q 120 40 200 170 Q 200 260 120 270 Q 40 260 40 170 Z" fill="#0a0910" ${st(6)}/><circle cx="96" cy="210" r="8" fill="#ff3b3b"/><circle cx="144" cy="210" r="8" fill="#ff3b3b"/></g>`));
    P(hero(260, 200, 600, "smirk", 30, "#ff6b6b", "shrug"));
    P(bubble(1160, 170, "Дай карту на недельку — 5 000 ₽", 470, "right"));
    P(`<div class="a nw" style="left:820px;top:640px;transform:rotate(-10deg);padding:10px 26px;border:10px solid #ff3b3b;color:#ff3b3b;font:700 72px O;letter-spacing:.06em">ДО 3 ЛЕТ</div>`);
    P(label(5, "Глава 2: анти-дроп — «дай карту за процент» = статья (передача карты за вознаграждение — до 3 лет). Арбузов отказывается.", "4:00–4:30"));
  },
  6: () => {   // реклама своего Telegram посередине (как у амоБлога)
    P(svg(`${wall("#7fd6ff", "#2f8fd8")}${Array.from({ length: 30 }, (_, k) => `<path d="M${960 + Math.cos(k / 30 * 6.28) * 2000} ${540 + Math.sin(k / 30 * 6.28) * 2000} L 960 540 L ${960 + Math.cos((k + .5) / 30 * 6.28) * 2000} ${540 + Math.sin((k + .5) / 30 * 6.28) * 2000} Z" fill="#fff" opacity=".1"/>`).join("")}`));
    P(hero(220, 190, 600, "happy", 20, "#fff2a8", "point"));
    P(phone(900, 170, 6, `<div class="a" style="left:0;right:0;top:0;height:120px;background:#2aa3e0"></div><div class="a" style="left:20px;top:56px;width:60px;height:60px;border-radius:50%;background:#ff3b3b;border:4px solid #fff;overflow:hidden">${ArbuzHD.svg({ mood: "smirk", w: 60, h: 64 })}</div>
      <div class="a nw" style="left:94px;top:62px;font:900 22px Unb;color:#fff">Арбузов</div><div class="a nw" style="left:94px;top:92px;font:700 15px I;color:#d9f0ff">канал · акции банков</div>
      <div class="a" style="left:16px;right:16px;top:150px;padding:14px;border-radius:16px;background:#fff;font:700 19px/1.3 I;color:${OL}">Свежие бонусы этой недели: <b>5 акций</b>, сроки и условия — в одном посте</div>
      <div class="a" style="left:16px;right:16px;top:290px;padding:14px;border-radius:16px;background:#fff;font:700 19px/1.3 I;color:${OL}">Ставки накопительных счетов на октябрь 📈</div>`, 1));
    P(`<div class="a" style="left:1360px;top:330px;width:300px;height:300px;padding:18px;border-radius:24px;background:#fff;border:6px solid ${OL};box-shadow:0 20px 40px rgba(0,0,0,.35)"><div style="width:100%;height:100%;background:repeating-conic-gradient(${OL} 0 25%,#fff 0 50%) 0 0/36px 36px;opacity:.9"></div></div>
       <div class="a" style="left:1330px;top:660px;width:360px;text-align:center;font:700 44px/1.1 O;color:#fff;text-shadow:0 4px 0 ${OL}">ТЕЛЕГРАМ<br>ССЫЛКА В ОПИСАНИИ</div>`);
    P(label(6, "Реклама своего Telegram посередине ролика (как у амоБлога): телефон с каналом + QR-код, 15–20 с.", "6:20–6:40"));
  },
  7: () => {   // глава 3: деньги спят
    P(svg(`${wall("#9ec7f0", "#5f8fd0")}${windowNight(1360, 140, 460, 380)}
      <rect x="40" y="640" width="1100" height="200" rx="30" fill="#fff4e0" ${st(7)}/><rect x="40" y="560" width="300" height="140" rx="40" fill="#fff" ${st(7)}/><rect x="40" y="800" width="1100" height="280" fill="#6a85c8" ${st(7)}/>
      ${floor(980, "#4a3a5e")}${lampLight}`));
    P(card(240, 600, -4, "#2b2b35", "#0d0d12", 1.1));
    P(`<div class="a" style="left:300px;top:520px;font:900 70px Unb;color:#fff;text-shadow:0 4px 0 ${OL}">z z Z</div>`);
    [[260, 560, -8], [400, 580, 10]].forEach(([x, y, r]) => P(`<div class="a" style="left:${x}px;top:${y}px;width:200px;height:96px;transform:rotate(${r}deg);border-radius:10px;background:linear-gradient(135deg,#f6c49a,#e48a5a);border:5px solid ${OL};display:flex;align-items:center;justify-content:center;font:900 40px Unb;color:#8a3a14">5000</div>`));
    P(hero(820, 260, 520, "smirk", -16, "#ffd27a", "point"));
    P(`<div class="a" style="left:1320px;top:560px;width:300px;height:300px;border-radius:40px 40px 60px 60px;background:linear-gradient(180deg,rgba(200,240,255,.6),rgba(120,200,255,.5));border:7px solid ${OL}"><div class="a" style="left:20px;right:20px;bottom:20px;height:150px;border-radius:30px;background:repeating-linear-gradient(0deg,#f0b72f 0 18px,#ffd84d 18px 36px);border:4px solid ${OL}"></div></div>`);
    P(tag(1250, 380, -8, "НАКОПИТЕЛЬНЫЙ", "≈15 %", true, .85) + tag(1560, 870, 6, "ЗА 3 МЕС · ПРИМЕР", "+1 162 ₽", false, .7));
    P(chapter(3, "ТВОИ ДЕНЬГИ СПЯТ"));
    P(label(7, "Глава 3: купюры спят на карте («z z Z»), Арбузов будит и переселяет в банку-накопительный. 30 000 × 15,5 % × 3 мес ≈ 1 162 ₽ (пример).", "4:30–6:20"));
  },
  8: () => {   // глава 4: кэшбэк сгорает — касса
    P(svg(`${wall("#ffe6a8", "#ffc46b")}${[0, 1, 2, 3].map(r => `<rect x="80" y="${150 + r * 140}" width="1760" height="16" fill="#8a5a2b"/>${Array.from({ length: 22 }, (_, k) => `<rect x="${100 + k * 78}" y="${70 + r * 140}" width="56" height="80" rx="6" fill="${["#ff6b78", "#7fd6ff", "#9be26b", "#ffd84d", "#c79bff"][(k + r) % 5]}" ${st(3)}/>`).join("")}`).join("")}
      <rect x="0" y="700" width="1920" height="380" fill="#3a3f4a"/><rect x="0" y="690" width="1920" height="30" fill="#2b2f38"/>${table(800, "tiles")}
      <rect x="1220" y="560" width="200" height="240" rx="20" fill="#2b2b35" ${st(6)}/><rect x="1240" y="580" width="160" height="90" rx="8" fill="#9be26b"/><text x="1320" y="640" text-anchor="middle" font-family="O" font-weight="700" font-size="40" fill="#0b2a0b">QR</text>${lampLight}`));
    P(hero(440, 230, 560, "shock", 20, "#ffd27a", "shrug"));
    [[1000, 360, "годен до 31.10"], [1120, 470, "сгорит"], [1500, 330, "12 мес"]].forEach(([x, y, t]) => P(`<div class="a" style="left:${x}px;top:${y}px">${coin(0, 0, 1.2).replace('class="a"', 'class="a" ').replace(/left:0px;top:0px;/, "position:relative;")}<div class="nw" style="margin-top:6px;padding:4px 10px;background:#ff3b3b;color:#fff;font:700 22px O;border-radius:6px;transform:rotate(-4deg)">${t}</div></div>`));
    P(`<div class="a nw" style="left:1180px;top:840px;transform:rotate(-6deg);padding:8px 20px;border:8px solid #ff3b3b;color:#ff3b3b;font:700 52px O;background:rgba(255,255,255,.85)">QR — БЕЗ КЭШБЭКА</div>`);
    P(chapter(4, "КЭШБЭК С ДАТОЙ ПОРЧИ"));
    P(label(8, "Глава 4: касса магазина, баллы-монетки с наклейками «годен до», штамп «QR — без кэшбэка» (у части банков). Арбузов в шоке.", "6:40–8:30"));
  },
  9: () => {   // глава 5: налоговая — три двери
    P(svg(`${wall("#d9e6d0", "#a9c49a")}${[0, 1, 2].map(k => { const x = 260 + k * 520; return `<rect x="${x}" y="200" width="300" height="600" rx="10" fill="${["#c46a3c", "#3f6fb0", "#5aa86a"][k]}" ${st(7)}/><circle cx="${x + 250}" cy="520" r="16" fill="#ffd84d" ${st(4)}/><rect x="${x + 40}" y="150" width="220" height="60" rx="8" fill="#fff" ${st(5)}/><text x="${x + 150}" y="194" text-anchor="middle" font-family="O" font-weight="700" font-size="40" fill="${OL}">${["УЧЁБА", "СПОРТ", "ВРАЧ"][k]}</text>`; }).join("")}
      ${floor(800, "#b9a98a")}${lampLight}`));
    P(hero(700, 280, 520, "happy", 0, "#ffd27a", "point"));
    P(`<div class="a" style="left:1360px;top:250px;width:440px;padding:24px;border-radius:26px;background:#2b2f38;border:6px solid ${OL};box-shadow:0 24px 40px rgba(0,0,0,.4)">
      <div style="padding:16px;border-radius:12px;background:#b9f5a3;font:900 46px/1.1 Unb;color:#0b2a0b;text-align:right">19 500 ₽</div>
      <div style="margin-top:14px;font:700 28px I;color:#fff">150 000 × 13 % = 19 500</div></div>`);
    P(tag(80, 820, -6, "ЗА РЕБЁНКА ДО 24", "до 14 300 ₽", true, .75));
    P(chapter(5, "НАЛОГОВАЯ ТЕБЕ ДОЛЖНА"));
    P(label(9, "Глава 5: три двери «учёба / спорт / врач», калькулятор 150 000 × 13 % = 19 500 ₽. Вычет за автошколу — отдельная сцена (Арбузов за рулём).", "8:30–11:00"));
  },
  10: () => {  // глава 6: деньги из прошлого
    P(svg(`<rect width="1920" height="1080" fill="#2a1450"/>${Array.from({ length: 24 }, (_, k) => `<circle cx="960" cy="540" r="${60 + k * 60}" fill="none" stroke="${k % 2 ? "#7a3cff" : "#ff5ab4"}" stroke-width="20" opacity="${.5 - k * .018}"/>`).join("")}`));
    [[160, 160, -14, "2023"], [1440, 150, 12, "2024"], [1500, 640, -8, "2025"]].forEach(([x, y, r, yr]) => P(`<div class="a" style="left:${x}px;top:${y}px;width:260px;transform:rotate(${r}deg);border:6px solid ${OL};border-radius:10px;overflow:hidden;box-shadow:0 20px 30px rgba(0,0,0,.4)"><div style="background:#c23b2f;padding:10px;font:700 48px O;color:#fff;text-align:center">${yr}</div><div style="background:#efe7d3;height:150px;background-image:linear-gradient(#bfb6a0 2px,transparent 2px),linear-gradient(90deg,#bfb6a0 2px,transparent 2px);background-size:40px 40px"></div></div>`));
    P(`<div class="a" style="left:560px;top:250px;width:800px;height:640px;border-radius:50%;background:radial-gradient(circle,#e9eef5,#9aa6b8);border:10px solid ${OL};box-shadow:0 0 80px #ff5ab4"></div><div class="a" style="left:690px;top:330px;width:540px;height:480px;border-radius:50%;background:radial-gradient(circle,#2a1450,#7a3cff);border:8px solid ${OL}"></div>`);
    P(hero(720, 330, 480, "shock", 0, "#ff5ab4", "up"));
    P(envelope(140, 560, -10, "ВЫЧЕТ 2023", true, .9) + envelope(300, 760, 8, "ВЫЧЕТ 2024", true, .8));
    P(chapter(6, "ДЕНЬГИ ИЗ ПРОШЛОГО"));
    P(label(10, "Глава 6: Арбузов в «машине времени» из барабана стиральной машины, календари 2023–2025 и конверты — вычет за 3 прошлых года.", "11:00–12:30"));
  },
  11: () => {  // итог: конверты на столе
    P(`<img class="a" src="${window.KITCHEN || "../../characters/hybrid/bg/kitchen.jpg"}" style="left:0;top:0;width:1920px;height:1080px;filter:brightness(.8)">`);
    P(hero(650, 120, 620, "happy", 0, "#ffd27a", "up", false));
    P(envelope(120, 760, -8, "БОНУСЫ", true, .9) + envelope(420, 790, 4, "НАКОПИТЕЛЬНЫЙ", true, .9) + envelope(1180, 780, -4, "ВЫЧЕТ", true, .9) + envelope(1480, 760, 9, "КЭШБЭК", false, .9));
    P(`<div class="a" style="left:60px;top:60px;padding:16px 28px;background:#fff;border:6px solid ${OL};border-radius:20px;font:700 40px/1.3 O;color:${OL};transform:rotate(-2deg)">1. НОВИЧКУ ПЛАТЯТ<br>2. ДЕНЬГИ НЕ ДОЛЖНЫ СПАТЬ<br>3. НАЛОГОВАЯ ВЕРНЁТ</div>`);
    P(label(11, "Итог: 3 пункта, конверты на столе загораются по очереди. «Сохрани ролик и отправь другу».", "12:30–13:10"));
  },
  12: () => {  // финал
    P(svg(`${wall("#ff8a5b", "#e2283f")}${Array.from({ length: 30 }, (_, k) => `<path d="M${960 + Math.cos(k / 30 * 6.28) * 2000} ${540 + Math.sin(k / 30 * 6.28) * 2000} L 960 600 L ${960 + Math.cos((k + .5) / 30 * 6.28) * 2000} ${540 + Math.sin((k + .5) / 30 * 6.28) * 2000} Z" fill="#ffe066" opacity=".12"/>`).join("")}`));
    P(hero(650, 170, 620, "smirk", 0, "#ffe066", "wave"));
    P(`<div class="a nw" style="left:960px;top:60px;transform:translateX(-50%);font:700 150px/1 O;color:#fff;text-shadow:0 8px 0 #7a0f12,0 16px 30px rgba(0,0,0,.4)">ЗАБИРАЙ СВОЁ</div>`);
    P(coin(380, 420, 1.4) + coin(1420, 380, 1.2) + coin(1500, 640, .9) + coin(300, 700, 1));
    P(label(12, "Финал: «Я Арбузов. Забирай своё». Ссылка на Telegram в описании, концовка 5 с под рекомендации.", "13:10–13:30"));
  },
};
