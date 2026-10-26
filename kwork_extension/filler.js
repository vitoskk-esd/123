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
  if (r.result !== "ok" && !String(r.result).startsWith("ok:")) throw new Error(r.result);
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

// Когда видна «Готово» (черновик, все шаги уже открыты), Kwork прячет все «Продолжить» —
// тогда шаг просто считается пройденным, ошибки полей покажет «Готово».
const kwSaveShown = () => kwShown(document.querySelector(".js-save-kwork"));

async function kwNext(n, log) {
  const step = `.js-step[data-step="${n}"]`;
  const nextBtn = () => document.querySelector(step + " .js-next-step-btn");
  const ready = await kwWaitFor(() => (kwShown(nextBtn()) && "next") || (kwSaveShown() && "open"), 20000);
  if (!ready) throw new Error(`шаг ${n}: Kwork не даёт продолжить — ` + (kwStepErrors(step) || "проверьте поля шага"));
  if (ready === "next") nextBtn().click();
  log(`шаг ${n} заполнен`);
  await kwSleep(1500);
}

// Основа слова: «боты»/«бота» → «бот», «скрипты»/«скрипт» → «скри», «парсеры»/«парсинг» → «парс».
function kwStems(s) {
  return new Set((String(s || "").toLowerCase().match(/[а-яёa-z]{3,}/g) || []).map((w) => w.slice(0, w.length <= 4 ? 3 : 4)));
}

// Поля рубрики Kwork («Тип», «Вид», «Язык разработки», «Платформа»…): каждое — блок .js-attribute-list,
// варианты — кружки (один) или галочки (несколько, до data-multiple-max-count). После выбора Kwork
// может подгрузить следующие поля. Вариант выбираем по подсказкам бота (type_hint, attribute_hints —
// «Чат-боты», «Telegram», «Python») и словам названия и описания.
const kwStem = (t) => t.slice(0, t.length <= 4 ? 3 : 4);
const kwTokens = (s) => String(s || "").toLowerCase().match(/[a-zа-яё0-9+#]+/g) || [];

function kwLabelOf(input) {
  return ((document.querySelector(`label[for="${input.id}"]`) || input.parentElement || {}).innerText || "").trim();
}

function kwScore(label, ctx) {
  let score = 0;
  for (const t of kwTokens(label)) {
    if (ctx.hints.has(t) || (t.length >= 3 && ctx.hintStems.has(kwStem(t)))) score += 3;
    else if (t.length >= 3 && ctx.textStems.has(kwStem(t))) score += 1;
  }
  return score;
}

// Нет подходящего варианта — «Другие/Другое», если есть, иначе первый.
const kwFallback = (inputs) => inputs.find((i) => /^(друг|проч|ин(ое|ые)\b)/i.test(kwLabelOf(i))) || inputs[0];

// Варианты, которые бот подобрал заранее по настоящим полям рубрики (listing.attributes:
// [{field, ids, labels}]): сначала по номеру варианта, если Kwork поменял номера — по названиям.
function kwPlanned(listing, title, inputs) {
  const plan = listing.attributes || [];
  const ids = new Set(plan.flatMap((a) => a.ids || []));
  const byId = inputs.filter((i) => ids.has(i.value));
  if (byId.length) return byId;
  const norm = (s) => String(s || "").toLowerCase().replace(/\s+/g, " ").trim();
  const field = plan.find((a) => norm(a.field) === norm(title));
  if (!field) return [];
  const labels = new Set((field.labels || []).map(norm));
  return inputs.filter((i) => labels.has(norm(kwLabelOf(i))));
}

// Возвращает названия полей, где вариант выбран без совпадения (их стоит проверить человеку).
async function kwChooseAttributes(listing, log, step, waitMs) {
  const hints = [listing.type_hint, ...(listing.attribute_hints || [])].join(" ");
  const ctx = {hints: new Set(kwTokens(hints)), hintStems: new Set(kwTokens(hints).filter((t) => t.length >= 3).map(kwStem)),
               textStems: new Set(kwTokens(listing.title + " " + listing.description).filter((t) => t.length >= 3).map(kwStem))};
  const sel = `.js-step[data-step="${step}"] .js-attribute-list`;
  if (waitMs) await kwWaitFor(() => document.querySelector(sel + " input"), waitMs);
  const guessed = [];
  const done = new Set();
  for (let level = 0, idle = 0; level < 10 && idle < 2; level++) {
    const lists = [...document.querySelectorAll(sel)].filter((l) => !done.has(l) && (kwShown(l) || kwShown(l.parentElement))
      && !l.querySelector("input:checked"));
    if (!lists.length) { idle++; await kwSleep(1500); continue; } // вдруг Kwork ещё грузит вложенное поле
    idle = 0;
    for (const list of lists) {
      done.add(list);
      const block = list.closest(".js-field-block");
      const title = ((block && block.querySelector(".kwork-save-step__field-label-name")) || {}).innerText?.trim() || "поле рубрики";
      const inputs = [...list.querySelectorAll('input[type="radio"], input[type="checkbox"]')]
        .filter((i) => !i.disabled && !i.closest(".attribute-item-custom"));
      if (!inputs.length) continue;
      const required = list.dataset.required === "1";
      const multiple = inputs[0].type === "checkbox";
      const planned = kwPlanned(listing, title, inputs);
      const scored = inputs.map((i) => ({i, s: kwScore(kwLabelOf(i), ctx)})).filter((x) => x.s > 0).sort((a, b) => b.s - a.s);
      let picks;
      if (planned.length) {
        picks = multiple ? planned.slice(0, Number(list.dataset.multipleMaxCount) || planned.length) : planned.slice(0, 1);
        if ((listing.attributes_guessed || []).includes(title)) guessed.push(title); // бот сам не нашёл подходящий
      } else if (multiple) {
        const max = Math.min(Number(list.dataset.multipleMaxCount) || 3, 3);
        picks = scored.slice(0, max).map((x) => x.i);
        if (!picks.length && !required) continue; // необязательные галочки без совпадений не трогаем
      } else {
        picks = scored.length ? [scored[0].i] : [];
      }
      if (!picks.length) { picks = [kwFallback(inputs)]; if (inputs.length > 1) guessed.push(title); }
      for (const pick of picks) {
        const label = document.querySelector(`label[for="${pick.id}"]`);
        (label || pick).click();
        if (!pick.checked) pick.click(); // подпись без for — жмём сам вариант
        await kwSleep(800);
      }
      log(`${title.toLowerCase()}: ${picks.map(kwLabelOf).join(", ")}`);
      await kwSleep(700);
    }
  }
  return guessed;
}

function kwBestOption(select, wanted, mode) {
  const values = [...select.options].map((o) => Number(o.value)).filter((v) => v > 0).sort((a, b) => a - b);
  if (!values.length) return null;
  if (mode === "max") return values.filter((v) => v <= wanted).pop() || values[0];
  return values.find((v) => v >= wanted) || values[values.length - 1];
}

const KW_DEFAULT_VOLUME = "1 задача в рамках описания кворка";

// «Объём услуг в 1 кворке» — обязательное поле шага 3. У одних рубрик это текст (#step2-service-size),
// у других число с единицей (#step2-volume, единицу Kwork ставит сам по рубрике).
async function kwFillVolume(listing, log) {
  const text = String(listing.volume || "").trim() || KW_DEFAULT_VOLUME;
  const textInput = document.querySelector("#step2-service-size");
  if (textInput && kwShown(document.querySelector("#service-size-block"))) {
    await kwMain("text", "#step2-service-size", text.slice(0, 60));
    log("объём: " + text.slice(0, 60));
  }
  const numInput = document.querySelector("#step2-volume");
  if (numInput && kwShown(numInput)) {
    const num = (text.match(/\d+/) || ["1"])[0];
    await kwMain("value", "#step2-volume", num);
    log("объём: " + num);
  }
}

async function kwUploadCover(bytes, name, log) {
  log("загружаю обложку…");
  // Kwork принимает файл только больше 30 КБ (size > 30720) и от 660×440.
  if (bytes.length <= 30720) throw new Error(`обложка весит ${Math.round(bytes.length / 1024)} КБ, а Kwork принимает больше 30 КБ — скачайте kwork.zip из бота заново`);
  // Первое такое поле — скрытый шаблон Kwork (.js-template-photo-block), к нему загрузчик не
  // подключён. Настоящее поле Kwork добавляет из шаблона в .js-photo__block — берём последнее.
  const inputs = [...document.querySelectorAll(".js-first-photo-block input.js-kwork-photo-input-first, input.js-kwork-photo-input-first")]
    .filter((el, i, all) => all.indexOf(el) === i && !el.closest(".js-template-photo-block"));
  if (!inputs.length) throw new Error("не нашёл поле обложки");
  const pathValue = () => [...document.querySelectorAll('input[name="first_photo_path"]')].map((i) => i.value).filter(Boolean).join("|");
  const kworkError = () => [...document.querySelectorAll(".js-add-photo_error")].map((e) => e.innerText.trim()).filter(Boolean).join("; ");
  // Главный признак — ответ Kwork на сам запрос загрузки (/temp-image-upload): поле пути к файлу
  // на сайте может не измениться (например, при повторной загрузке того же файла путь тот же).
  const uploads = async () => {
    try { return JSON.parse((await kwMain("coverStatus", "body")).slice(3)).uploads || []; } catch (e) { return []; }
  };
  await kwMain("coverWatch", "body");
  const before = pathValue();
  let result = null; // {ok: true} или {error: "..."}
  // Если полей несколько, пробуем с последнего; поле без загрузчика за 10 секунд ничего не отправляет.
  for (const [n, input] of inputs.reverse().entries()) {
    const dt = new DataTransfer();
    dt.items.add(new File([bytes], name, {type: "image/jpeg"}));
    input.files = dt.files;
    input.dispatchEvent(new Event("change", {bubbles: true}));
    const last = n === inputs.length - 1;
    for (const t = Date.now(); !result && Date.now() - t < (last ? 90000 : 10000); await kwSleep(500)) {
      const sent = await uploads();
      const done = sent.find((u) => typeof u.status === "number");
      if (done) {
        let body = {};
        try { body = JSON.parse(done.body || "{}"); } catch (e) { /* не JSON */ }
        if (done.status === 200 && body.success) result = {ok: true};
        else if (done.status === 200 && body.success === false) result = {error: "Kwork отклонил файл: " + ([].concat(body.data || [])[0] || kworkError() || "без пояснений")};
        else if (done.status >= 400 || done.status === 0) result = {error: `сервер Kwork ответил ошибкой ${done.status || "сети"} — попробуйте ещё раз`};
      } else if (pathValue() && pathValue() !== before) {
        result = {ok: true};
      } else if (kworkError()) {
        result = {error: kworkError()};
      } else if (!sent.length && Date.now() - t > 10000 && !last) {
        break; // это поле не запустило загрузку — пробуем следующее
      }
    }
    if (result) break;
  }
  if (!result || result.error) {
    const sent = await uploads();
    const why = result ? result.error : sent.length ? "Kwork не дождался ответа сервера за 90 секунд — попробуйте ещё раз"
      : "Kwork не начал загрузку файла" + (document.querySelector(".js-first-photo-block .thumb-img") ? " (превью есть)" : "");
    throw new Error("обложка не загрузилась — " + why);
  }
  log("обложка загружена");
}

// Заполняет все шаги и останавливается перед «Готово». coverDone — обложка этого кворка уже
// загружена (Kwork после загрузки сохраняет черновик и может перезагрузить страницу).
// Возвращает {needsPortfolio, guessed}: рубрика требует портфолио / поля, где вариант выбран без
// совпадения, — тогда «Готово» жмёт человек.
async function kwFill(listing, coverBytes, log, opts = {}) {
  if (!await kwWaitFor(() => document.querySelector("#step1-name"), 20000)) throw new Error("форма «Создать кворк» не открылась");
  // Kwork запускает форму позже, чем появляется её разметка; до этого выбор рубрики ничего не делает.
  let ready = false, why = "";
  for (let t = Date.now(); !ready && Date.now() - t < 30000; await kwSleep(500)) {
    ready = await kwMain("ready", ".js-category_parent").then(() => true, (e) => { why = e.message; return false; });
  }
  if (!ready) throw new Error("форма Kwork не загрузилась до конца — обновите страницу (" + why + ")");

  // Шаг 1: название, рубрика, тип, обложка
  log("заполняю название и рубрику…");
  await kwMain("text", "#step1-name", listing.title.slice(0, 70));
  if (!listing.section_id || !listing.category_id) throw new Error("у кворка нет рубрики Kwork — пересоберите архив в боте");
  const subOption = () => document.querySelector(`.js-category_sub option[value="${listing.category_id}"]`);
  let sub = null;
  for (let attempt = 0; attempt < 3 && !sub; attempt++) { // список подрубрик Kwork строит по change раздела
    await kwMain("select", ".js-category_parent", listing.section_id);
    sub = await kwWaitFor(subOption, 5000);
  }
  if (!sub) throw new Error("подрубрика " + listing.category_hint + " не появилась в списке");
  await kwMain("select", ".js-category_sub", listing.category_id);
  log("рубрика: " + listing.category_hint);
  const guessed = await kwChooseAttributes(listing, log, 1, 6000);
  const path = document.querySelector('input[name="first_photo_path"]');
  if (opts.coverDone && path && path.value) log("обложка уже загружена");
  else if (coverBytes) { await kwUploadCover(coverBytes, listing.id + ".jpg", log); if (opts.onCover) await opts.onCover(); }
  await kwNext(1, log);

  // Шаг 2: описание и «От покупателя нужно»
  await kwMain("html", "#step1-description", kwToHtml(listing.description));
  await kwMain("html", "#step1-instruction", kwToHtml(listing.requirements));
  await kwNext(2, log);

  // Шаг 3: цена, срок (и «Тип», если он есть здесь)
  guessed.push(...await kwChooseAttributes(listing, log, 3, 0));
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
  await kwFillVolume(listing, log);
  await kwNext(3, log);

  // Шаг 4 — портфолио. В рубриках без портфолио Kwork помечает его disabled-step. Где портфолио
  // необязательно (тексты), проходим «Продолжить». Где обязательно (дизайн, сайты, видео, аудио —
  // для нового продавца 3 работы), заполнить его может только сам продавец своими работами.
  const step4 = document.querySelector('.js-step[data-step="4"]');
  if (step4 && !step4.classList.contains("disabled-step") && !kwSaveShown()) {
    const b = await kwWaitFor(() => { const x = step4.querySelector(".js-next-step-btn"); return kwShown(x) && x; }, 3000);
    if (b) { b.click(); await kwWaitFor(kwSaveShown, 4000); }
    if (!kwSaveShown()) {
      log("рубрике нужны работы в портфолио — добавьте их на шаге 4");
      return {needsPortfolio: true, guessed};
    }
  }
  return {guessed};
}

// Окна Kwork поверх формы (замечание модерации «Обложка кворка — Проблема» и т.п.): жмём «Хорошо».
async function kwCloseModals() {
  for (let n = 0; n < 3; n++) {
    const btn = [...document.querySelectorAll('[class*="modal"] button, [class*="modal"] .kw-button, [class*="modal"] a')]
      .find((b) => kwShown(b) && /^(хорошо|понятно|ок|ok)$/i.test(b.innerText.trim()));
    if (!btn) return;
    btn.click();
    await kwSleep(700);
  }
}

// Замена обложки в уже созданном кворке (страница «Изменить»): сверяем название, грузим обложку.
async function kwReplaceCover(item, coverBytes, log) {
  if (!await kwWaitFor(() => document.querySelector("#step1-name"), 20000)) throw new Error("страница «Изменить» не открылась");
  let ready = false;
  for (let t = Date.now(); !ready && Date.now() - t < 30000; await kwSleep(500)) {
    ready = await kwMain("ready", ".js-category_parent").then(() => true, () => false);
  }
  if (!ready) throw new Error("форма Kwork не загрузилась до конца — обновите страницу");
  await kwCloseModals();
  const norm = (s) => String(s || "").toLowerCase().replace(/[«»"…]/g, "").replace(/\s+/g, " ").trim();
  const title = document.querySelector("#step1-name").value;
  if (norm(title) !== norm(item.title)) throw new Error(`на странице другой кворк («${title.slice(0, 40)}») — обложку не трогаю`);
  if (!coverBytes) throw new Error("в архиве нет обложки этого кворка");
  await kwUploadCover(coverBytes, item.id + ".jpg", log);
  // Кнопка сохранения обычно видна сразу; если нет — проходим шаги «Продолжить» (поля уже заполнены).
  for (let n = 1; n <= 4 && !kwSaveShown(); n++) {
    const b = document.querySelector(`.js-step[data-step="${n}"] .js-next-step-btn`);
    if (kwShown(b)) { b.click(); await kwSleep(1500); }
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
