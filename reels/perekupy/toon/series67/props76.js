// ep76 «Ржавчина: заселяемся» (сценка без рассказчика по референсу владельца 16.11, с матом): герои и реквизит (базовые помощники — props.js)
// Новые герои: Ржавчина — живые пятна ржавчины в армейском: сержант Ржавый (каска, усы, ремень) и рядовой Рыжик (пилотка, тельняшка).
(() => {
  const K = "#151515", W = 7;
  CHARS.rzha = (p, o = {}) => {
    const c1 = o.c || "#b8561e", c2 = "#7a3312", c3 = "#e39042";
    const blob = "M210 112 q92 -8 122 62 q42 32 30 112 q32 62 8 140 q22 80 -40 150 q-42 42 -120 42 q-78 0 -120 -42 q-62 -70 -40 -150 q-24 -78 8 -140 q-12 -80 30 -112 q30 -70 122 -62 z";
    const pits = [[150, 420, 26], [270, 470, 20], [180, 540, 16], [262, 380, 14], [128, 330, 12], [300, 300, 13], [222, 600, 18]]
      .map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * .75}" fill="${c2}" opacity=".8"/>`).join("")
      + [[110, 260], [318, 410], [96, 470], [330, 540]].map(([x, y]) => `<path d="M${x} ${y} l14 -8 l6 14 z" fill="${c3}" stroke="${K}" stroke-width="3"/>`).join("");
    const mouths = [["grin", `<path d="M160 318 q50 42 100 0 q-50 16 -100 0 z" fill="#fff" stroke="${K}" stroke-width="6" stroke-linejoin="round"/>`],
      ["talk", `<path d="M166 314 q44 62 88 0 z" fill="#4a1408" stroke="${K}" stroke-width="6" stroke-linejoin="round"/><path d="M168 316 h84 v10 h-84 z" fill="#fff"/>`],
      ["o", `<ellipse cx="210" cy="330" rx="18" ry="22" fill="#4a1408" stroke="${K}" stroke-width="6"/>`],
      ["flat", `<path d="M174 328 h72" stroke="${K}" stroke-width="8" stroke-linecap="round"/>`]]
      .map(([n, d]) => `<g class="mouth" id="${p}-mouth-${n}"${n === (o.look || "grin") ? "" : ' style="display:none"'}>${d}</g>`).join("");
    const helmet = o.helmet ? `<path d="M104 196 q0 -126 106 -128 q106 2 106 128 z" fill="#4f5d36" stroke="${K}" stroke-width="${W}" stroke-linejoin="round"/>
      <path d="M92 196 q118 -26 236 0 l-6 22 q-112 -24 -224 0 z" fill="#3e4a2a" stroke="${K}" stroke-width="6" stroke-linejoin="round"/>
      <path d="M210 104 l9 20 h21 l-17 13 l7 21 l-20 -13 l-20 13 l7 -21 l-17 -13 h21 z" fill="#d93a2b" stroke="${K}" stroke-width="3"/><ellipse cx="270" cy="150" rx="14" ry="9" fill="#9a4a1a" opacity=".8"/>` : "";
    const pilotka = o.pilotka ? `<path d="M128 170 q80 -70 168 -8 l-10 26 q-74 -16 -148 6 z" fill="#5f6e3d" stroke="${K}" stroke-width="6" stroke-linejoin="round"/>
      <path d="M180 150 l5 11 h12 l-10 7 l4 12 l-11 -7 l-11 7 l4 -12 l-10 -7 h12 z" fill="#d93a2b" stroke="${K}" stroke-width="2"/>` : "";
    const tel = o.tel ? `<path d="M168 392 h84 l-14 100 h-56 z" fill="#f4f6f8" stroke="${K}" stroke-width="5"/>${[408, 428, 448, 468].map(y => `<path d="M${172 + (y - 392) * .14} ${y} h${76 - (y - 392) * .28}" stroke="#1f4fb8" stroke-width="9"/>`).join("")}` : "";
    const belt = o.belt ? `<path d="M74 520 q136 40 272 0 l2 30 q-138 40 -276 0 z" fill="#5a3a1a" stroke="${K}" stroke-width="5"/><rect x="190" y="524" width="44" height="34" rx="4" fill="#f5c542" stroke="${K}" stroke-width="5"/>` : "";
    const must = o.mustache ? `<path d="M154 300 q28 -20 56 -6 q28 -14 56 6 q-26 16 -56 6 q-30 10 -56 -6 z" fill="#5a2208" stroke="${K}" stroke-width="4"/>` : "";
    const brows = o.angry ? `<path d="M140 200 l58 18 M280 200 l-58 18" stroke="${K}" stroke-width="12" stroke-linecap="round"/>`
      : `<path d="M140 210 q30 -16 58 -2 M222 208 q28 -14 58 2" stroke="${K}" stroke-width="12" stroke-linecap="round" fill="none"/>`;
    return `<svg viewBox="0 0 420 800" class="char" id="${p}">
 <g id="${p}-body">
  <path d="M150 600 v100 M270 600 v100" stroke="${c2}" stroke-width="40" stroke-linecap="round"/>
  <path d="M112 740 q0 -54 40 -54 h28 q20 0 20 54 z M220 740 q0 -54 20 -54 h28 q40 0 40 54 z" fill="#1d1d1f" stroke="${K}" stroke-width="${W}" stroke-linejoin="round"/>
  <path d="${blob}" fill="${c1}" stroke="${K}" stroke-width="${W}" stroke-linejoin="round"/>${pits}${tel}${belt}
 </g>
 <g id="${p}-armL" style="transform-origin:96px 400px"><path d="M96 396 q-40 50 -36 130" stroke="${K}" stroke-width="34" fill="none" stroke-linecap="round"/><path d="M96 396 q-40 50 -36 130" stroke="${c1}" stroke-width="20" fill="none" stroke-linecap="round"/><circle cx="60" cy="534" r="20" fill="${c2}" stroke="${K}" stroke-width="${W}"/></g>
 <g id="${p}-armR" style="transform-origin:324px 400px"><path d="M324 396 q40 50 36 130" stroke="${K}" stroke-width="34" fill="none" stroke-linecap="round"/><path d="M324 396 q40 50 36 130" stroke="${c1}" stroke-width="20" fill="none" stroke-linecap="round"/><circle cx="360" cy="534" r="20" fill="${c2}" stroke="${K}" stroke-width="${W}"/></g>
 <g id="${p}-head" style="transform-origin:210px 380px">
  ${brows}
  <ellipse cx="170" cy="250" rx="30" ry="34" fill="#fff" stroke="${K}" stroke-width="6"/><circle cx="176" cy="256" r="12" fill="${K}"/>
  <ellipse cx="250" cy="250" rx="30" ry="34" fill="#fff" stroke="${K}" stroke-width="6"/><circle cx="256" cy="256" r="12" fill="${K}"/>
  ${mouths}${must}${helmet}${pilotka}
 </g>
</svg>`;
  };
})();
const RZH = { helmet: true, mustache: true, belt: true, look: "grin" };                 // сержант Ржавый (новый герой)
const RYZ = { pilotka: true, tel: true, c: "#c9662a", look: "grin" };                    // рядовой Рыжик (новый герой)
const CAMRY = "camry/camry.png", CAMS = "camry/camry_side_c.png";
Object.assign(CINE.SIZES, { [CAMRY]: [1317, 627], [CAMS]: [1302, 395] });
const TITLE = (a, b) => `<div style="position:absolute;left:0;right:0;top:300px;text-align:center;font-family:Unbounded;font-weight:900;line-height:1;letter-spacing:-3px;z-index:50">
  <span style="display:inline-block;padding:10px 28px 18px;border:8px solid #151515;border-radius:22px;box-shadow:0 12px 0 #151515;font-size:82px;background:#ffd23f;color:#151515;transform:rotate(-3deg)">${a}</span><br>
  <span style="display:inline-block;padding:10px 28px 18px;border:8px solid #151515;border-radius:22px;box-shadow:0 12px 0 #151515;font-size:74px;background:#ff3b30;color:#fff;margin-top:26px;transform:rotate(2deg)">${b}</span></div>`;
// клетчатая «челночная» сумка
const BAG = (x, foot, w = 220, id = "bg0", z = 9) => { const h = w * .7;
  return `<div id="${id}" style="position:absolute;left:${x}px;top:${foot - h}px;width:${w}px;height:${h}px;z-index:${z}"><svg viewBox="0 0 220 154" style="overflow:visible">
  <defs><pattern id="ck${id}" width="30" height="30" patternUnits="userSpaceOnUse"><rect width="30" height="30" fill="#f4f0e8"/><rect width="15" height="30" fill="#2f6db5" opacity=".7"/><rect width="30" height="15" fill="#d93a2b" opacity=".6"/></pattern></defs>
  <path d="M60 30 q50 -50 100 0" fill="none" stroke="#151515" stroke-width="9"/><rect x="6" y="28" width="208" height="122" rx="14" fill="url(#ck${id})" stroke="#151515" stroke-width="7"/><path d="M10 50 h200" stroke="#151515" stroke-width="5"/></svg></div>`; };
// полноэкранная вставка-гэг (как в референсе: крупный предмет на однотонном фоне)
const INS = (bgc, inner, id = "") => `<div ${id ? `id="${id}" ` : ""}style="position:absolute;left:0;top:0;width:1080px;height:1920px;z-index:40;background:${bgc};overflow:hidden">${inner}</div>`;
const SEATBTN = () => INS("radial-gradient(circle at 50% 45%,#3a3c42,#16171b)", `<div style="position:absolute;left:290px;top:700px;width:500px;height:360px;border-radius:60px;background:#26282e;border:10px solid #0d0e11;box-shadow:inset 0 -14px 0 #1a1b20,0 30px 60px #000a">
  <svg viewBox="0 0 500 360" style="position:absolute;inset:0"><path d="M170 250 q-10 -90 30 -150 l40 8 q-20 50 -10 112 h90 q20 0 20 20 v20 z" fill="#c9cdd2"/>${[0, 1, 2].map(k => `<path d="M${300 + k * 36} 120 q-14 -20 0 -40 q14 -20 0 -40" stroke="#ff7a1a" stroke-width="10" fill="none" stroke-linecap="round"/>`).join("")}
  <circle cx="420" cy="300" r="14" fill="#ff7a1a"/></svg></div>
  <div style="position:absolute;left:330px;top:1110px;transform:rotate(-4deg);background:#f4f0c8;border:5px solid #151515;padding:10px 26px;font-family:Unbounded;font-weight:900;font-size:58px;color:#151515">ЖОПА 🔥</div>`);
const ELKA = () => INS("radial-gradient(circle at 50% 40%,#5a6a5a,#232a24)", `<svg viewBox="0 0 1080 1920" style="position:absolute;inset:0"><path d="M540 0 V520" stroke="#e8e0c8" stroke-width="8"/>
  <path d="M540 520 l-170 330 h80 l-110 220 h80 l-90 200 h420 l-90 -200 h80 l-110 -220 h80 z" fill="#3a7a3a" stroke="#151515" stroke-width="10" stroke-linejoin="round"/>
  <rect x="420" y="1200" width="240" height="120" rx="10" fill="#f4f0e8" stroke="#151515" stroke-width="7" transform="rotate(6 540 1260)"/>
  <text x="540" y="1250" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="38" fill="#151515" transform="rotate(6 540 1260)">ВАНИЛЬ</text><text x="540" y="1300" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="40" fill="#c0392b" transform="rotate(6 540 1260)">2019</text>
  ${[...Array(18)].map((_, k) => `<circle cx="${380 + (k * 97) % 330}" cy="${700 + (k * 211) % 520}" r="${4 + k % 4}" fill="#d8d0b8" opacity=".7"/>`).join("")}</svg>`);
const ORDER = () => INS("#efe6d6", `<div style="position:absolute;left:150px;top:420px;width:780px;height:1020px;background:#fbfaf3;border:6px solid #151515;box-shadow:16px 18px 0 #0003;transform:rotate(-2deg);padding:60px 64px;box-sizing:border-box;font-family:Onest;color:#151515">
  <div style="text-align:center;font-family:Unbounded;font-weight:900;font-size:56px">ПРЕДПИСАНИЕ</div><div style="text-align:center;font-size:28px;color:#666;margin-bottom:46px">№ 47-РЖ · срочно</div>
  <div style="font-size:40px;line-height:1.55;font-weight:700">Ржавчина — 2 ед.<br>Направить: <u>арки, пороги</u><br>новой машины Толяна.<br><span style="color:#c0392b">Хозяину не сообщать.</span></div>
  <div style="margin-top:60px;font-size:28px;color:#666">подпись: ________ Коррозия М. П.</div></div>
  <div id="stamp" style="position:absolute;left:470px;top:1110px;width:420px;height:200px;border:12px solid #d93a2b;border-radius:24px;color:#d93a2b;font-family:Unbounded;font-weight:900;font-size:66px;display:flex;align-items:center;justify-content:center;transform:rotate(-14deg);opacity:.85">ЗАСЕЛИТЬ</div>`);
const CMCARD = (id = "cmc") => BOTH("Camry · до 2,5 млн", `<div id="${id}">${CARD("Toyota Camry · 2019", "2 190 000 ₽", "рынок ≈ 2 400 000 ₽ · 1 владелец", "🔥 −9% к рынку · ⏱ 1 с после публикации")}</div>`);
const ANTIKOR = () => INS("radial-gradient(circle at 50% 45%,#1f5a5a,#0c1d22)", `<svg viewBox="0 0 1080 1920" style="position:absolute;inset:0">
  ${[...Array(14)].map((_, k) => `<path d="M${200 + (k * 173) % 700} ${400 + (k * 263) % 1100} l10 24 l24 10 l-24 10 l-10 24 l-10 -24 l-24 -10 l24 -10 z" fill="#ffd23f" opacity=".8"/>`).join("")}
  <rect x="400" y="540" width="280" height="840" rx="60" fill="#e9eef2" stroke="#151515" stroke-width="10"/><rect x="470" y="440" width="140" height="110" rx="20" fill="#c0392b" stroke="#151515" stroke-width="9"/><rect x="520" y="400" width="40" height="50" fill="#151515"/>
  <rect x="400" y="760" width="280" height="420" fill="#151515"/><text x="540" y="880" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="58" fill="#ffd23f">АНТИ</text><text x="540" y="950" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="58" fill="#ffd23f">КОР</text>
  <text x="540" y="1040" text-anchor="middle" font-family="Onest" font-weight="800" font-size="26" fill="#fff">граница</text><text x="540" y="1075" text-anchor="middle" font-family="Onest" font-weight="800" font-size="26" fill="#fff">от ржавчины</text>
  <path d="M440 1110 h200" stroke="#ff7a1a" stroke-width="8"/></svg>`);
// линия антикором на полу (рисуется: #<id> path stroke-dashoffset)
const SPRAYLINE = (x1, x2, y, id = "sl", z = 7) => `<svg id="${id}" style="position:absolute;left:0;top:0;width:1080px;height:1920px;overflow:visible;z-index:${z}" viewBox="0 0 1080 1920"><path d="M${x1} ${y} Q${(x1 + x2) / 2} ${y + 14} ${x2} ${y - 6}" stroke="#151515" stroke-width="22" fill="none" stroke-linecap="round" stroke-dasharray="1200" stroke-dashoffset="0"/></svg>`;
// толщиномер на пороге — «1200 мкм»
const GAUGE76 = () => INS("#f4f4f2", `<svg viewBox="0 0 1080 1920" style="position:absolute;inset:0"><rect y="1400" width="1080" height="200" fill="#2b2c31"/><path d="M0 1400 H1080" stroke="#151515" stroke-width="8"/>
  <ellipse cx="560" cy="1420" rx="120" ry="30" fill="#9a4a1a" opacity=".55"/>
  <rect x="380" y="680" width="360" height="620" rx="50" fill="#ffd23f" stroke="#151515" stroke-width="12"/><rect x="420" y="730" width="280" height="240" rx="16" fill="#cfe9c4" stroke="#151515" stroke-width="8"/>
  <text x="560" y="860" text-anchor="middle" font-family="JetBrains Mono" font-weight="800" font-size="96" fill="#151515">1200</text><text x="560" y="930" text-anchor="middle" font-family="JetBrains Mono" font-weight="800" font-size="44" fill="#151515">мкм</text>
  <path d="M560 1300 V1390" stroke="#151515" stroke-width="22" stroke-linecap="round"/><circle cx="560" cy="1396" r="20" fill="#9aa3ab" stroke="#151515" stroke-width="7"/>
  <rect x="420" y="1640" width="480" height="110" rx="16" fill="#c0392b" stroke="#151515" stroke-width="8" transform="rotate(-3 660 1695)"/><text x="660" y="1718" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="58" fill="#fff" transform="rotate(-3 660 1695)">ШПАКЛЁВКА</text></svg>`);
// титр-перебивка «ВЕСНА»
const SPRING = () => INS("linear-gradient(#bfe3f2,#e8f4ea)", `<svg viewBox="0 0 1080 1920" style="position:absolute;inset:0">${[...Array(10)].map((_, k) => `<path d="M${80 + k * 100} 0 v${200 + (k * 137) % 300}" stroke="#7ab8d8" stroke-width="6"/><ellipse cx="${80 + k * 100}" cy="${210 + (k * 137) % 300}" rx="10" ry="16" fill="#7ab8d8"/>`).join("")}
  <ellipse cx="540" cy="1500" rx="420" ry="60" fill="#7ab8d8" opacity=".6"/></svg>
  <div style="position:absolute;left:0;right:0;top:820px;text-align:center"><span style="display:inline-block;font-family:Unbounded;font-weight:900;font-size:150px;color:#151515;background:#ffd23f;border:10px solid #151515;border-radius:30px;padding:10px 46px 24px;box-shadow:0 16px 0 #151515;transform:rotate(-3deg)">ВЕСНА</span></div>`);
// низ Камри крупно (слоями, без параллакса фона): CARBODY — дверь, порог, тёмная арка (z 4); WHEELFG — колесо поверх Ржавчины (z 8)
const CARBODY = (z = 4) => `<svg style="position:absolute;left:0;top:0;width:1080px;height:1920px;z-index:${z}" viewBox="0 0 1080 1920"><ellipse cx="540" cy="1560" rx="640" ry="44" fill="#000" opacity=".28"/>
  <path d="M-20 520 H1100 V1270 H-20 Z" fill="#f4f4f2" stroke="#000" stroke-width="8"/><path d="M-20 700 H1100" stroke="#c9cdd2" stroke-width="6"/><path d="M420 520 V1180" stroke="#9aa0a6" stroke-width="6"/>
  <rect x="300" y="760" width="90" height="26" rx="12" fill="#c9cdd2" stroke="#000" stroke-width="4"/><path d="M-20 1180 H1100 V1270 H-20 Z" fill="#2b2c31" stroke="#000" stroke-width="6"/>
  <path d="M620 1270 A260 260 0 0 1 1140 1270 Z" fill="#141518" stroke="#000" stroke-width="8"/><ellipse cx="300" cy="1225" rx="70" ry="22" fill="#9a4a1a" opacity=".6"/></svg>`;
const WHEELFG = (z = 8) => `<svg style="position:absolute;left:0;top:0;width:1080px;height:1920px;z-index:${z}" viewBox="0 0 1080 1920"><circle cx="880" cy="1340" r="210" fill="#1d1d1f" stroke="#000" stroke-width="8"/><circle cx="880" cy="1340" r="124" fill="#b9c0c7" stroke="#000" stroke-width="6"/>
  ${[0, 1.26, 2.52, 3.78, 5.04].map(a => `<path d="M880 1340 L${(880 + 118 * Math.cos(a)).toFixed(0)} ${(1340 + 118 * Math.sin(a)).toFixed(0)}" stroke="#7f878f" stroke-width="16"/>`).join("")}<circle cx="880" cy="1340" r="30" fill="#5b6670" stroke="#000" stroke-width="5"/></svg>`;
const PIP = (inner, id, ring = "#ffd23f", left = 700, top = 1440, bgc = "#2b2f37") => `<div id="${id}" class="grp" style="position:absolute;left:${left}px;top:${top}px;width:320px;height:320px;border-radius:50%;overflow:hidden;border:9px solid ${ring};z-index:45;background:${bgc};box-shadow:0 10px 30px #0008">${inner}</div>`;
// кружок с говорящим: облачко — над кружком (якорь героя внутри PIP иначе считается в координатах кружка)
const PIPS = (inner, p, id, ring, left, top) => { const out = PIP(inner, id, ring, left, top); CINE.ANCH[p] = [left + 160, top + 30, .8]; return out; };
