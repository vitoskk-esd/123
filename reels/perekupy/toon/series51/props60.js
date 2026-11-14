// ep60 «Школа перекупов: экзамен за минуту»: герои и реквизит (базовые помощники — props.js)
const MIH = { jacket: "#6b5a44", pants: "#4a3f35", hair: "#d4d4d4", mustache: true, glasses: true, tie: true, look: "flat" };   // Михалыч, перекуп старой школы
const VANYA = { jacket: "#2f9a6a", pants: "#232c47", hair: "#c98a3a", look: "grin" };                                      // новичок Ваня
const GOSHA = { jacket: "#8a3a2a", pants: "#2b2f37", hair: "#1d1d1f", cap: "#2f6db5", look: "o" };                          // ученик Гоша (массовка)
const PETYA = { jacket: "#5a4a8a", pants: "#2b2f37", hair: "#e0c070", glasses: true, look: "flat" };                       // ученик Петя (массовка)
const GALYA = { coat: "#c06a8a", jacket: "#c06a8a", pants: "#4a3a5a", hair: "#8a4a2a", scarf: "#e6b422", look: "grin" };    // тётя Галя, продаёт Гранту
const GR = "granta/granta_34.png";
const EVO = "evo9/evo9_34.png";                                     // жёлтая Эво IX — машина Михалыча (лист владельца 14.11)
Object.assign(CINE.SIZES, { [GR]: [791, 366], [EVO]: [771, 358] });
const INHAND = (x, foot, h, arm, w, html, z = 8, rot = 0) => {
  const s = h / 740, l = x - 210 * s, t = foot - 740 * s, A = arm * Math.PI / 180;
  const hx = l + (292 + 26 * Math.cos(A) - 130 * Math.sin(A)) * s, hy = t + (400 + 26 * Math.sin(A) + 130 * Math.cos(A)) * s;
  return `<div class="prop" style="left:${hx - w / 2}px;top:${hy - w / 2}px;width:${w}px;height:${w}px;z-index:${z};transform:rotate(${rot}deg)">${html}</div>`;
};
// обложка (кадр 0) — плашка названия как у #title шаблона (владелец 14.11: «такой первый кадр во всех роликах»)
const TITLE = (a, b) => `<div style="position:absolute;left:0;right:0;top:300px;text-align:center;font-family:Unbounded;font-weight:900;line-height:1;letter-spacing:-3px;z-index:50">
  <span style="display:inline-block;padding:10px 28px 18px;border:8px solid #151515;border-radius:22px;box-shadow:0 12px 0 #151515;font-size:82px;background:#ffd23f;color:#151515;transform:rotate(-3deg)">${a}</span><br>
  <span style="display:inline-block;padding:10px 28px 18px;border:8px solid #151515;border-radius:22px;box-shadow:0 12px 0 #151515;font-size:112px;background:#ff3b30;color:#fff;margin-top:26px;transform:rotate(2deg)">${b}</span></div>`;
// приём 1 — мел на доске (рукописные строки внутри доски фона bg_klass: 62..1018 × 352..868); id строк — для появления по одной
const CHALK = (lines, id = "ch") => `<div style="position:absolute;left:100px;top:376px;width:900px;font-family:Caveat;font-weight:700;color:#f2f6ee;text-shadow:0 0 2px #fff8,0 0 1px #fff;line-height:1.02;z-index:3">
  ${lines.map(([t, fs = 80, c = "#f2f6ee"], k) => `<div id="${id}${k}" style="font-size:${fs}px;color:${c}">${t}</div>`).join("")}</div>`;
// парта (поверх ног учеников)
const DESK = (x, foot, w = 380, z = 9) => `<div style="left:${x - w / 2}px;top:${foot - w * .42}px;width:${w}px;height:${w * .5}px;z-index:${z}"><svg viewBox="0 0 380 190" style="overflow:visible">
  <path d="M0 20 L380 20 L364 54 L16 54 Z" fill="#c98a4a" stroke="#151515" stroke-width="7"/><rect x="26" y="54" width="328" height="110" fill="#3a6a9a" stroke="#151515" stroke-width="7"/>
  <path d="M40 164 v26 M340 164 v26" stroke="#151515" stroke-width="10"/></svg></div>`;
// указка в руке
const POINTER = `<svg viewBox="0 0 100 100" style="overflow:visible"><path d="M50 50 L-120 -150" stroke="#8a5a33" stroke-width="12" stroke-linecap="round"/><path d="M-110 -138 L-124 -155" stroke="#f4f6f8" stroke-width="14" stroke-linecap="round"/></svg>`;
// приём 2 — школьный звонок + таймер на минуту (вставка крупно)
const BELLRING = (id = "bell") => `<div style="left:0;top:0;width:1080px;height:1920px;background:radial-gradient(circle at 50% 40%,#3a5a8a,#0f1a30 75%)"></div>
  <div id="${id}" style="position:absolute;left:290px;top:300px;width:500px;height:500px;z-index:6"><svg viewBox="0 0 500 500" style="overflow:visible">
    <rect x="200" y="20" width="100" height="60" rx="10" fill="#5b6670" stroke="#151515" stroke-width="8"/>
    <path d="M70 330 Q70 90 250 80 Q430 90 430 330 Z" fill="#e6b422" stroke="#151515" stroke-width="10"/><ellipse cx="250" cy="330" rx="190" ry="40" fill="#c99a12" stroke="#151515" stroke-width="10"/>
    <circle cx="250" cy="370" r="34" fill="#5b6670" stroke="#151515" stroke-width="8"/><path d="M150 140 q-20 60 -10 140" stroke="#fff6c8" stroke-width="16" fill="none" stroke-linecap="round"/>
    ${[[-1, 1], [1, 1]].map(([s]) => [0, 1, 2].map(k => `<path d="M${250 + s * (230 + k * 40)} ${200 - k * 30} q${s * 30} ${60 + k * 20} 0 ${130 + k * 50}" stroke="#ffd23f" stroke-width="12" fill="none" stroke-linecap="round" opacity="${1 - k * .25}"/>`).join("")).join("")}</svg></div>`;
const TIMER = (x, y, sec, id = "tm", w = 300) => { const r = 120, L = 2 * Math.PI * r;
  return `<div id="${id}" style="position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${w}px;z-index:40"><svg viewBox="0 0 300 300">
  <circle cx="150" cy="150" r="140" fill="#fbf6ec" stroke="#151515" stroke-width="10"/><circle cx="150" cy="150" r="${r}" fill="none" stroke="#e8dcc6" stroke-width="26"/>
  <circle id="${id}r" cx="150" cy="150" r="${r}" fill="none" stroke="#ff3b30" stroke-width="26" stroke-dasharray="${L.toFixed(1)}" stroke-dashoffset="${(L * (1 - sec / 60)).toFixed(1)}" transform="rotate(-90 150 150)"/>
  <text id="${id}t" x="150" y="178" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="66" fill="#151515">${sec >= 60 ? "1:00" : "0:" + String(sec).padStart(2, "0")}</text></svg></div>`; };
// приём 3 — газета «Авто-вестник» крупно: объявления, обведённые красным; «продана» — зачёркнуто (id строк — для зачёркивания по одной)
const NEWS = (crossed = 0) => `<div style="left:0;top:0;width:1080px;height:1920px;background:radial-gradient(circle at 50% 50%,#6a5a44,#2a2218 80%)"></div>
  <div style="left:70px;top:330px;width:940px;height:1260px;background:#efe6cc;transform:rotate(-2deg);box-shadow:0 20px 40px #0009;border:4px solid #d4c7a6;font-family:'Times New Roman',serif;color:#2a2620">
    <div style="margin:30px 40px 0;border-bottom:6px double #2a2620;font-family:Unbounded;font-weight:900;font-size:76px;letter-spacing:-2px;text-align:center">АВТО-ВЕСТНИК</div>
    <div style="margin:6px 40px 0;font-size:26px;display:flex;justify-content:space-between;font-weight:700"><span>№ 45 · вторник</span><span>объявления частных лиц</span><span>цена 15 ₽</span></div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px 30px;margin:26px 40px">
      ${[["ВАЗ-2107, 2008 г.", "цвет «баклажан», не гнилая", "89•• •••-12-40"], ["LADA GRANTA, 2020 г.", "600 т.р., торг, 1 хоз.", "89•• •••-77-03"], ["ВАЗ-2114, 2010 г.", "сигнализация, литьё", "89•• •••-15-22"],
         ["LADA GRANTA, 2019 г.", "640 т.р., срочно", "89•• •••-40-18"], ["ДЭУ НЕКСИЯ, 2011 г.", "ГБО, на ходу", "89•• •••-91-60"], ["LADA GRANTA, 2020 г.", "610 т.р., без ДТП", "89•• •••-05-37"]]
        .map(([t, d, p], k) => { const g = /GRANTA/.test(t), n = [1, 3, 5].indexOf(k);
          return `<div style="position:relative;padding:14px 16px;border:3px solid #b9ad90;background:#f6efdc">
            <div style="font-weight:900;font-size:30px;white-space:nowrap">${t}</div><div style="font-size:30px">${d}</div><div style="font-size:31px;font-weight:700">☎ ${p}</div>
            ${g ? `<div style="position:absolute;left:-18px;top:-16px;right:-18px;bottom:-16px;border:7px solid #e0261a;border-radius:50%"></div>` : ""}
            ${g ? `<div id="nx${n}" style="position:absolute;inset:0;opacity:${n < crossed ? 1 : 0}"><svg viewBox="0 0 400 160" preserveAspectRatio="none" style="width:100%;height:100%"><path d="M10 20 L390 140 M390 20 L10 140" stroke="#e0261a" stroke-width="12"/></svg>
              <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(-8deg);font-family:Caveat;font-weight:700;font-size:64px;color:#e0261a;background:#f6efdcdd;padding:0 12px;white-space:nowrap">${["продана!", "продана!", "трубку не берут"][n]}</div></div>` : ""}</div>`; }).join("")}
    </div></div>
  <div style="left:880px;top:1380px;width:60px;height:420px;background:linear-gradient(90deg,#c0392b,#e0261a);border:5px solid #151515;border-radius:10px;transform:rotate(24deg)"></div>`;
// приём 4 — дисковый телефон: аппарат на тумбе + трубка у уха (поза phone у героя — мобильник, здесь своя трубка)
const ROTARY = (x, y, w = 260, z = 8) => `<div class="prop" style="left:${x}px;top:${y}px;width:${w}px;height:${w * .7}px;z-index:${z}"><svg viewBox="0 0 260 180" style="overflow:visible">
  <path d="M20 170 L50 70 H210 L240 170 Z" fill="#c0392b" stroke="#151515" stroke-width="8"/><circle cx="130" cy="122" r="44" fill="#fbf6ec" stroke="#151515" stroke-width="6"/>
  ${Array.from({ length: 10 }, (_, k) => { const a = (k * 30 - 60) * Math.PI / 180; return `<circle cx="${(130 + 30 * Math.cos(a)).toFixed(1)}" cy="${(122 + 30 * Math.sin(a)).toFixed(1)}" r="7" fill="#151515"/>`; }).join("")}
  <circle cx="130" cy="122" r="12" fill="#c0392b" stroke="#151515" stroke-width="4"/><path d="M60 70 q-30 -10 -40 -40" stroke="#151515" stroke-width="6" fill="none"/></svg></div>`;
const HANDSET2 = (x1, y1, x2, y2, x3, y3, z = 9) => { const cx = (x1 + x2) / 2 + 40, cy = (y1 + y2) / 2;
  return `<svg style="position:absolute;left:0;top:0;width:1080px;height:1920px;overflow:visible;z-index:${z}" viewBox="0 0 1080 1920">
  <path d="M${x2} ${y2} C${x2 + 60} ${y2 + 200} ${x3 - 200} ${y3 + 260} ${x3} ${y3}" stroke="#151515" stroke-width="6" fill="none" stroke-dasharray="14 6"/>
  <path d="M${x1} ${y1} Q${cx} ${cy} ${x2} ${y2}" stroke="#151515" stroke-width="44" fill="none" stroke-linecap="round"/><path d="M${x1} ${y1} Q${cx} ${cy} ${x2} ${y2}" stroke="#c0392b" stroke-width="30" fill="none" stroke-linecap="round"/>
  <ellipse cx="${x1}" cy="${y1}" rx="34" ry="24" fill="#c0392b" stroke="#151515" stroke-width="6"/><ellipse cx="${x2}" cy="${y2}" rx="34" ry="24" fill="#c0392b" stroke="#151515" stroke-width="6"/></svg>`; };
const HANDSET = `<svg viewBox="0 0 100 100" style="overflow:visible"><path d="M8 18 q-10 34 30 62 q40 28 60 -4" stroke="#151515" stroke-width="40" fill="none" stroke-linecap="round"/><path d="M8 18 q-10 34 30 62 q40 28 60 -4" stroke="#c0392b" stroke-width="26" fill="none" stroke-linecap="round"/></svg>`;
// приём 5 — дневник с оценкой (вставка крупно): «5» красной ручкой выводится, подпись Михалыча
const DIARY = () => `<div style="left:0;top:0;width:1080px;height:1920px;background:radial-gradient(circle at 50% 50%,#3a6a9a,#13243a 80%)"></div>
  <div style="left:80px;top:480px;width:920px;height:900px;background:#fbf8ef;transform:rotate(-2deg);box-shadow:0 20px 40px #0009;border-left:30px solid #2f5a8a;
    background-image:repeating-linear-gradient(0deg,transparent 0 76px,#c9d6e6 76px 79px);font-family:Caveat;font-weight:700;color:#1d3a8a">
    <div style="position:absolute;left:30px;top:20px;font-family:Unbounded;font-weight:900;font-size:40px;color:#2f5a8a">ДНЕВНИК · Ваня</div>
    <div style="position:absolute;left:30px;top:100px;width:840px;display:grid;grid-template-columns:2fr 1.2fr 1fr;font-size:52px;line-height:79px">
      <div style="color:#5b6670;font-family:Onest;font-weight:800;font-size:26px">предмет</div><div style="color:#5b6670;font-family:Onest;font-weight:800;font-size:26px">задание</div><div style="color:#5b6670;font-family:Onest;font-weight:800;font-size:26px">оценка</div>
      <div>Газета</div><div>—</div><div></div>
      <div>Обзвон</div><div>—</div><div></div>
      <div>Рынок в 5 утра</div><div>проспал</div><div></div>
      <div style="color:#151515">Поиск машины</div><div style="color:#151515">Гранта, 1 мин</div><div></div></div>
    <div id="d5" style="position:absolute;left:640px;top:330px;font-size:300px;line-height:1;color:#e0261a;transform:rotate(-6deg)">5</div>
    <div id="dsig" style="position:absolute;left:470px;top:720px;font-size:64px;color:#1d3a8a">Михалыч ✍</div></div>`;
// бот на экране у Вани
const GRCARD = () => BOTH("Granta · до 650 тыс", `<div id="gcc">${CARD("Lada Granta · 2020", "615 000 ₽", "рынок ≈ 720 000 ₽ · 1 владелец", "🔥 −15% к рынку · ⏱ 1 с после публикации")}</div>`);
const CTA60 = `<div style="position:absolute;left:60px;right:60px;top:1330px;z-index:70;background:#ffd23f;border:8px solid #151515;border-radius:34px;padding:26px 30px;box-shadow:0 14px 0 #151515;font-family:Unbounded;font-weight:900;color:#151515;text-align:center">
  <div style="font-size:52px;line-height:1.12">Бот <span style="color:#c0392b">«Перехват»</span><br>— ссылка в шапке</div><div style="margin-top:12px;font-size:30px;font-family:Onest;font-weight:800">объявления по всей России · через ~1 с после публикации</div></div>`;
// поднятая рука («можно вопрос?»): прячем обычную правую руку героя и рисуем трубку-руку от плеча вверх
const HANDUP = (html, p, x, foot, h, jacket, z = 8) => { const s = h / 740, l = x - 210 * s, t = foot - 740 * s, sx = l + 300 * s, sy = t + 372 * s, hx = sx + 34 * s, hy = t + 150 * s;
  return html.replace(`id="${p}-armR" style="`, `id="${p}-armR" style="display:none;`)
    + `<svg style="position:absolute;left:0;top:0;width:1080px;height:1920px;overflow:visible;z-index:${z}" viewBox="0 0 1080 1920"><path d="M${sx} ${sy} Q${sx + 50 * s} ${(sy + hy) / 2} ${hx} ${hy}" stroke="#151515" stroke-width="${58 * s}" fill="none" stroke-linecap="round"/>
      <path d="M${sx} ${sy} Q${sx + 50 * s} ${(sy + hy) / 2} ${hx} ${hy}" stroke="${jacket}" stroke-width="${44 * s}" fill="none" stroke-linecap="round"/><circle cx="${hx}" cy="${hy - 18 * s}" r="${26 * s}" fill="#e8b48c" stroke="#151515" stroke-width="${7 * s}"/></svg>`; };
