// Заполнение формы «Создать кворк» (kwork.ru/new). Селекторы сняты с настоящей страницы
// 25.10.2026: шаги .js-step[data-step=N], кнопки .js-next-step-btn и .js-save-kwork,
// рубрика .js-category_parent / .js-category_sub, обложка .js-kwork-photo-input-first.

const kwSleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function kwWaitFor(fn, timeout = 15000, step = 250) {
  const t = Date.now();
  while (Date.now() - t < timeout) {
    try { const v = fn(); if (v) return v; } catch (e) { /* элемент ещё не готов */ }
    await kwSleep(step);
  }
  return null;
}

function kwShown(el) {
  if (!el || el.offsetParent === null) return false;
  const st = getComputedStyle(el);
  return st.visibility !== "hidden" && st.display !== "none";
}

// Действие в мире страницы (через background.js). В тестах подменяется window.kwMainOverride.
async function kwMain(action, selector, value) {
  if (window.kwMainOverride) return window.kwMainOverride(action, selector, value);
  const r = await chrome.runtime.sendMessage({type: "main", action, selector, value});
  if (!r || !r.ok) throw new Error("не удалось выполнить действие на странице: " + (r && r.error));
  if (r.result !== "ok") throw new Error(r.result);
  return r.result;
}

function kwToHtml(text) {
  const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return String(text || "").trim().split(/\n\s*\n/).map((p) => "<p>" + esc(p).replace(/\n/g, "<br>") + "</p>").join("");
}

function kwStepErrors(scope) {
  const root = typeof scope === "string" ? document.querySelector(scope) : scope || document;
  if (!root) return "";
  const texts = [...root.querySelectorAll('[class*="error"]')]
    .filter(kwShown).map((e) => e.innerText.trim()).filter((t) => t && t.length < 300);
  return [...new Set(texts)].join("; ");
}

async function kwNext(n, log) {
  const step = `.js-step[data-step="${n}"]`;
  const btn = await kwWaitFor(() => { const b = document.querySelector(step + " .js-next-step-btn"); return kwShown(b) && b; }, 20000);
  if (!btn) throw new Error(`шаг ${n}: Kwork не даёт продолжить — ` + (kwStepErrors(step) || "проверьте поля шага"));
  btn.click();
  log(`шаг ${n} заполнен`);
  await kwSleep(1500);
}

// Основа слова: «боты»/«бота» → «бот», «скрипты»/«скрипт» → «скри», «парсеры»/«парсинг» → «парс».
function kwStems(s) {
  return new Set((String(s || "").toLowerCase().match(/[а-яёa-z]{3,}/g) || []).map((w) => w.slice(0, w.length <= 4 ? 3 : 4)));
}

// Выбор «Типа» рубрики: сначала по подсказке бота (type_hint, например «Чат-боты»), потом по
// словам названия и описания. Совпадений нет — первый вариант.
function kwPickAttribute(radios, text, hint) {
  const want = kwStems(text), wantHint = kwStems(hint);
  let best = radios[0], score = 0;
  for (const r of radios) {
    const label = (document.querySelector(`label[for="${r.id}"]`) || r.parentElement || {}).innerText || "";
    const words = [...kwStems(label)];
    const s = 3 * words.filter((w) => wantHint.has(w)).length + words.filter((w) => want.has(w)).length;
    if (s > score) { best = r; score = s; }
  }
  return best;
}

// «Тип» стоит в шаге 1 сразу после рубрики и подгружается после её выбора; у некоторых рубрик
// бывает вложенный (после выбора появляется следующий) или ещё один на шаге 3.
async function kwChooseAttributes(listing, log, step, waitMs) {
  const text = listing.title + " " + listing.description;
  const sel = `.js-step[data-step="${step}"] input[type="radio"][name^="attribute["]`;
  if (waitMs) await kwWaitFor(() => document.querySelector(sel), waitMs);
  const done = new Set();
  for (let level = 0; level < 4; level++) {
    const groups = {};
    for (const r of document.querySelectorAll(sel)) {
      if (!done.has(r.name) && (kwShown(r) || kwShown(r.parentElement))) (groups[r.name] = groups[r.name] || []).push(r);
    }
    const names = Object.keys(groups);
    if (!names.length) return;
    for (const name of names) {
      done.add(name);
      if (groups[name].some((r) => r.checked)) continue;
      const pick = kwPickAttribute(groups[name], text, listing.type_hint);
      const label = document.querySelector(`label[for="${pick.id}"]`);
      (label || pick).click();
      log("тип: " + ((label && label.innerText.trim()) || pick.value));
      await kwSleep(1200);
    }
  }
}

function kwBestOption(select, wanted, mode) {
  const values = [...select.options].map((o) => Number(o.value)).filter((v) => v > 0).sort((a, b) => a - b);
  if (!values.length) return null;
  if (mode === "max") return values.filter((v) => v <= wanted).pop() || values[0];
  return values.find((v) => v >= wanted) || values[values.length - 1];
}

async function kwUploadCover(bytes, name, log) {
  log("загружаю обложку…");
  // Kwork принимает файл только больше 30 КБ (size > 30720) и от 660×440.
  if (bytes.length <= 30720) throw new Error(`обложка весит ${Math.round(bytes.length / 1024)} КБ, а Kwork принимает больше 30 КБ — скачайте kwork.zip из бота заново`);
  const input = document.querySelector('input.js-kwork-photo-input-first[data-pre-upload="true"]')
    || document.querySelector("input.js-kwork-photo-input-first");
  if (!input) throw new Error("не нашёл поле обложки");
  const pathInput = () => document.querySelector('input[name="first_photo_path"]');
  const before = pathInput() ? pathInput().value : "";
  const dt = new DataTransfer();
  dt.items.add(new File([bytes], name, {type: "image/jpeg"}));
  input.files = dt.files;
  input.dispatchEvent(new Event("change", {bubbles: true}));
  const ok = await kwWaitFor(() => pathInput() && pathInput().value && pathInput().value !== before, 60000, 500);
  if (!ok) {
    const kworkError = [...document.querySelectorAll(".js-add-photo_error")].map((e) => e.innerText.trim()).filter(Boolean).join("; ");
    throw new Error("обложка не загрузилась — " + (kworkError || kwStepErrors('.js-step[data-step="1"]') || "Kwork не ответил на загрузку"));
  }
  log("обложка загружена");
}

// Заполняет все шаги и останавливается перед «Готово». coverDone — обложка этого кворка уже
// загружена (Kwork после загрузки сохраняет черновик и может перезагрузить страницу).
async function kwFill(listing, coverBytes, log, opts = {}) {
  if (!await kwWaitFor(() => document.querySelector("#step1-name"), 20000)) throw new Error("форма «Создать кворк» не открылась");

  // Шаг 1: название, рубрика, тип, обложка
  log("заполняю название и рубрику…");
  await kwMain("text", "#step1-name", listing.title.slice(0, 70));
  if (!listing.section_id || !listing.category_id) throw new Error("у кворка нет рубрики Kwork — пересоберите архив в боте");
  await kwMain("select", ".js-category_parent", listing.section_id);
  const sub = await kwWaitFor(() => document.querySelector(`.js-category_sub option[value="${listing.category_id}"]`), 15000);
  if (!sub) throw new Error("подрубрика " + listing.category_hint + " не появилась в списке");
  await kwMain("select", ".js-category_sub", listing.category_id);
  log("рубрика: " + listing.category_hint);
  await kwChooseAttributes(listing, log, 1, 6000);
  const path = document.querySelector('input[name="first_photo_path"]');
  if (opts.coverDone && path && path.value) log("обложка уже загружена");
  else if (coverBytes) { await kwUploadCover(coverBytes, listing.id + ".jpg", log); if (opts.onCover) await opts.onCover(); }
  await kwNext(1, log);

  // Шаг 2: описание и «От покупателя нужно»
  await kwMain("html", "#step1-description", kwToHtml(listing.description));
  await kwMain("html", "#step1-instruction", kwToHtml(listing.requirements));
  await kwNext(2, log);

  // Шаг 3: цена, срок (и «Тип», если он есть здесь)
  await kwChooseAttributes(listing, log, 3, 0);
  const priceSel = await kwWaitFor(() => document.querySelector("#typicalPriceSelect"), 10000);
  if (!priceSel) throw new Error("не нашёл выбор цены — у этой рубрики, видимо, только пакеты; укажите цену вручную");
  const price = kwBestOption(priceSel, listing.price_rub, "min");
  await kwMain("select", "#typicalPriceSelect", price);
  log(`цена: ${price} ₽`);
  const daysSel = document.querySelector("#step2-work-time");
  if (daysSel) {
    const days = kwBestOption(daysSel, listing.days || 1, "max");
    await kwMain("select", "#step2-work-time", days);
    log(`срок: ${days} дн.`);
  }
  await kwNext(3, log);

  // Шаг 4 (портфолио) есть не у всех рубрик
  const step4 = document.querySelector('.js-step[data-step="4"]');
  if (step4 && kwShown(step4) && !step4.classList.contains("hidden")) {
    const b = step4.querySelector(".js-next-step-btn");
    if (kwShown(b)) { b.click(); await kwSleep(1000); }
  }
}

async function kwClickSave() {
  const btn = await kwWaitFor(() => { const b = document.querySelector(".js-save-kwork"); return kwShown(b) && b; }, 15000);
  if (!btn) throw new Error("кнопка «Готово» недоступна — " + (kwFormErrors() || "проверьте форму"));
  btn.click();
}

function kwFormErrors() {
  return kwStepErrors(document.querySelector(".kwork-save-page") || document.body);
}
