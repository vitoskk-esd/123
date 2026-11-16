// ep72 «Шиномонтаж: первый снег» (с матом): герои и реквизит (базовые помощники — props.js)
const KOL = { jacket: "#2f4f8a", pants: "#2f4f8a", cap: "#151515", hair: "#3a2a1a", mustache: true, skin: "#e8a888", look: "flat" };   // шиномонтажник Колян (новый герой)
// Настя (новая героиня): из «vika» — мятный пуховик, рыжие волосы
const NSC = html => html.replaceAll("#8e1f3a", "#4ac0a0").replaceAll("#5c1426", "#2f8a74").replaceAll("#2b1a14", "#a0482a");
const PRW = "priora/priora_white.png", LXN = "lexusnx/lexusnx_34.png";
Object.assign(CINE.SIZES, { [PRW]: [1263, 410], [LXN]: [755, 359] });
const TITLE = (a, b) => `<div style="position:absolute;left:0;right:0;top:300px;text-align:center;font-family:Unbounded;font-weight:900;line-height:1;letter-spacing:-3px;z-index:50">
  <span style="display:inline-block;padding:10px 28px 18px;border:8px solid #151515;border-radius:22px;box-shadow:0 12px 0 #151515;font-size:76px;background:#ffd23f;color:#151515;transform:rotate(-3deg)">${a}</span><br>
  <span style="display:inline-block;padding:10px 28px 18px;border:8px solid #151515;border-radius:22px;box-shadow:0 12px 0 #151515;font-size:84px;background:#ff3b30;color:#fff;margin-top:26px;transform:rotate(2deg)">${b}</span></div>`;
// шина-рисунок: kind — summer / winter / studs / spare
const TIREPIC = (kind, d = 220) => { const tread = { summer: `<path d="M60 110 q50 -30 100 0 M60 150 q50 -30 100 0" stroke="#5b6670" stroke-width="10" fill="none"/>`,
  winter: `${[0, 1, 2, 3, 4].map(k => `<path d="M${40 + k * 32} 90 l16 26 l-16 26 l16 26" stroke="#5b6670" stroke-width="8" fill="none"/>`).join("")}`,
  studs: `${Array.from({ length: 14 }, (_, k) => `<circle cx="${50 + (k % 7) * 20}" cy="${100 + Math.floor(k / 7) * 40}" r="7" fill="#e8eef4" stroke="#151515" stroke-width="3"/>`).join("")}`,
  spare: `<path d="M50 130 H170" stroke="#5b6670" stroke-width="10"/>` }[kind];
  return `<svg viewBox="0 0 220 220" style="width:${d}px;height:${d}px"><circle cx="110" cy="110" r="100" fill="#26282e" stroke="#151515" stroke-width="8"/>${tread}
  <circle cx="110" cy="110" r="${kind === "spare" ? 58 : 46}" fill="${kind === "spare" ? "#ffd23f" : "#9aa4ae"}" stroke="#151515" stroke-width="6"/><circle cx="110" cy="110" r="12" fill="#151515"/></svg>`; };
// приём 1 — четыре разные шины на одной машине: карточки с подписями (#<id>0…3 — появляются по очереди)
const TIRES4 = (y = 560, id = "t4", z = 40) => { const L = [["summer", "ЛЕТНЯЯ", "#ffd23f"], ["winter", "ЗИМНЯЯ", "#4ac0e0"], ["studs", "ШИПЫ", "#e8eef4"], ["spare", "ДОКАТКА", "#ff3b30"]];
  return L.map(([k, t, c], i) => `<div id="${id}${i}" style="position:absolute;left:${40 + (i % 2) * 520}px;top:${y + Math.floor(i / 2) * 540}px;width:480px;height:500px;z-index:${z};background:#fbf6ec;border:8px solid #151515;border-radius:26px;box-shadow:0 12px 0 #151515;transform:rotate(${[-3, 2, 2, -2][i]}deg)">
    <div style="position:absolute;left:0;right:0;top:20px;display:flex;justify-content:center">${TIREPIC(k, 300)}</div>
    <div style="position:absolute;left:30px;right:30px;bottom:24px;padding:10px 0;border-radius:14px;background:${c};border:6px solid #151515;text-align:center;font-family:Unbounded;font-weight:900;font-size:44px;color:#151515">${t}</div></div>`).join(""); };
// приём 2 — протекторомер: «0 мм» (#<id>v), стрелка-шкала
const TREAD = (x, y, id = "tg", z = 40) => `<div id="${id}" style="position:absolute;left:${x}px;top:${y}px;width:420px;height:300px;z-index:${z};transform:rotate(-6deg)">
  <div style="position:absolute;inset:0;background:#e8eef4;border:8px solid #151515;border-radius:24px;box-shadow:0 12px 0 #151515"></div>
  <div style="position:absolute;left:24px;top:20px;font-family:Unbounded;font-weight:900;font-size:28px;color:#151515">ПРОТЕКТОР</div>
  <div id="${id}v" style="position:absolute;left:24px;top:70px;font-family:'JetBrains Mono';font-weight:800;font-size:120px;line-height:1;color:#c0392b">0 мм</div>
  <div style="position:absolute;left:24px;right:24px;bottom:26px;height:24px;border-radius:12px;background:linear-gradient(90deg,#ff3b30 0 20%,#ffd23f 20% 45%,#4cd964 45%);border:4px solid #151515"></div>
  <div style="position:absolute;left:30px;bottom:14px;width:10px;height:48px;background:#151515;border-radius:5px"></div></div>`;
// приём 3 — снегопад (слой, хлопья двигаются в хуке: .snowf)
const SNOW = (n = 70, id = "sn", z = 60) => `<div id="${id}" style="position:absolute;left:0;top:0;width:1080px;height:1920px;z-index:${z};pointer-events:none">${Array.from({ length: n }, (_, k) => `<div class="snowf" data-k="${k}" style="position:absolute;left:${(k * 137) % 1080}px;top:${(k * 293) % 1920}px;width:${8 + (k % 4) * 4}px;height:${8 + (k % 4) * 4}px;border-radius:50%;background:#fff;opacity:.85"></div>`).join("")}</div>`;
// талон очереди (на экране)
const TICKET = (x, y, num, id = "tk", z = 40) => `<div id="${id}" style="position:absolute;left:${x}px;top:${y}px;width:300px;z-index:${z};transform:rotate(5deg);background:#fbf6ec;border:6px dashed #151515;border-radius:12px;padding:16px;text-align:center;font-family:Unbounded;font-weight:900;color:#151515">
  <div style="font-size:26px">ВАША ОЧЕРЕДЬ</div><div style="font-size:84px;color:#c0392b;line-height:1">№${num}</div></div>`;
// бот у Насти
const LXCARD = (id = "lcc") => BOTH("Lexus NX · до 3 млн", `<div id="${id}">${CARD("Lexus NX · 2019", "2 690 000 ₽", "рынок ≈ 3 000 000 ₽ · 1 владелец", "🔥 −10% к рынку · ⏱ 1 с после публикации")}</div>`);
const CTA72 = `<div style="position:absolute;left:60px;right:60px;top:1330px;z-index:70;background:#ffd23f;border:8px solid #151515;border-radius:34px;padding:26px 30px;box-shadow:0 14px 0 #151515;font-family:Unbounded;font-weight:900;color:#151515;text-align:center">
  <div style="font-size:52px;line-height:1.12">Бот <span style="color:#c0392b">«Перехват»</span><br>— ссылка в шапке</div><div style="margin-top:12px;font-size:30px;font-family:Onest;font-weight:800">объявления по всей России · через ~1 с после публикации</div></div>`;
