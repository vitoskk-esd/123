// Панель на страницах kwork.ru и пошаговая выкладка. После «Готово» Kwork уходит на другую
// страницу, поэтому состояние хранится в chrome.storage и продолжается на каждой загрузке.

const KW = {queue: "kw_queue", state: "kw_state", cover: (id) => "kw_cover_" + id};
const KW_VERSION = chrome.runtime.getManifest().version;
const KW_TITLE = "Kwork — выкладка";

// "0.1.10" новее "0.1.9"
function kwNewer(a, b) {
  const x = String(a || "0").split(".").map(Number), y = String(b || "0").split(".").map(Number);
  for (let i = 0; i < Math.max(x.length, y.length); i++) if ((x[i] || 0) !== (y[i] || 0)) return (x[i] || 0) > (y[i] || 0);
  return false;
}
const NEW_URL = "https://kwork.ru/new";

const store = {
  get: async (key, fallback) => (await chrome.storage.local.get(key))[key] ?? fallback,
  set: (key, value) => chrome.storage.local.set({[key]: value}),
};

function defaultState() {
  return {running: false, mode: "publish", covers: null, index: 0, runStart: 0, manual: 3, limit: 6, pause: 30, phase: "idle",
          done: [], failed: [], log: [], message: "", attempts: 0, coverDone: null, navs: 0};
}

// Страница формы — там, где есть сама форма: kwork.ru/new или черновик «Изменить».
async function onFormPage() {
  if (/\/login|\/signin/.test(location.pathname)) return false;
  return !!(await kwWaitFor(() => document.querySelector("#step1-name"), location.pathname === "/new" ? 15000 : 4000));
}

async function getState() { return Object.assign(defaultState(), await store.get(KW.state, {})); }
async function saveState(st) { await store.set(KW.state, st); render(); }

// Изменения состояния идут строго по очереди: одновременные чтение-запись затирали друг друга
// (терялись строки журнала, три настройки подряд сохранялись как одна).
let stateChain = Promise.resolve();
function updateState(change) {
  const run = stateChain.then(async () => { const st = await getState(); await change(st); await saveState(st); return st; });
  stateChain = run.catch(() => {});
  return run;
}

function log(text) {
  const d = new Date(), hhmm = String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0");
  return updateState((st) => { st.log = [hhmm + " " + text, ...st.log].slice(0, 12); });
}

// --- Загрузка kwork.zip ----------------------------------------------------------------------

function toB64(bytes) {
  let s = "";
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
  return btoa(s);
}

function fromB64(b64) {
  const s = atob(b64), out = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) out[i] = s.charCodeAt(i);
  return out;
}

async function loadZip(file) {
  const files = await kwUnzip(await file.arrayBuffer());
  if (!files["listings.json"]) {
    throw new Error(Object.keys(files).some((n) => n.endsWith("manifest.json"))
      ? "это архив самого расширения — выберите kwork.zip, который прислал бот («📦 Скачать всё архивом»)"
      : "в архиве нет listings.json — выберите kwork.zip из бота");
  }
  if (files["kwork_meta.json"]) { // бот пишет, для какой версии расширения собран архив
    const meta = JSON.parse(new TextDecoder().decode(await kwEntryBytes(files["kwork_meta.json"])));
    if (kwNewer(meta.extension_version, KW_VERSION)) {
      throw new Error(`архив собран для расширения v${meta.extension_version}, а у вас v${KW_VERSION}. ` +
        "Обновите расширение: в боте «🧩 Расширение для выкладки» — там написано, как");
    }
  }
  const listings = JSON.parse(new TextDecoder().decode(await kwEntryBytes(files["listings.json"])));
  const old = await store.get(KW.queue, []);
  await chrome.storage.local.remove(old.map((l) => KW.cover(l.id)));
  const covers = {};
  for (const l of listings) {
    const entry = files[`covers/${l.id}.jpg`] || files[`covers/${l.id}.png`];
    if (entry) covers[KW.cover(l.id)] = toB64(await kwEntryBytes(entry));
  }
  await chrome.storage.local.set(covers);
  await store.set(KW.queue, listings.map((l) => ({
    id: l.id, title: l.title, description: l.description, requirements: l.requirements,
    price_rub: l.price_rub, days: l.days, category_hint: l.category_hint,
    section_id: l.section_id, category_id: l.category_id, type_hint: l.type_hint || "", volume: l.volume || "",
    attribute_hints: l.attribute_hints || [], attributes: l.attributes || [], attributes_guessed: l.attributes_guessed || [],
  })));
  await updateState((st) => Object.assign(st, defaultState(),
    {manual: st.manual, limit: st.limit, pause: st.pause, message: `Загружено кворков: ${listings.length}`}));
}

// --- Выкладка ------------------------------------------------------------------------------------

function stop(message) {
  return updateState((st) => { st.running = false; st.phase = "idle"; st.message = message; });
}

function fail(_st, item, reason) {
  return updateState((st) => {
    st.failed.push({id: item.id, title: item.title, reason});
    st.running = false; st.phase = "idle";
    st.message = `Остановлено на «${item.title.slice(0, 40)}»: ${reason}`;
  });
}

// «Проверять вручную первых N» — первые N выложенных кворков, а не N с каждого нажатия «Старт».
function isManual(st) { return st.done.length < st.manual; }

async function resume() {
  render();
  let st = await getState();
  if (!st.running) return;
  const queue = await store.get(KW.queue, []);
  if (/\/login|\/signin/.test(location.pathname)) return stop("Войдите в аккаунт Kwork и нажмите «Старт» снова.");
  if (st.mode === "covers") return resumeCovers();
  const onNew = await onFormPage();
  st = await getState();
  if (!st.running) return;

  if (st.phase === "review" && !onNew) {
    // Ждали «Готово», а страница уже не форма: Kwork сохранил кворк и ушёл со страницы раньше,
    // чем записалась отметка о нажатии.
    st = await updateState((s) => { s.phase = "submitted"; });
  }
  if (st.phase === "submitted") {
    const item = queue[st.index];
    if (onNew) { // снова форма — Kwork не принял кворк
      return fail(st, item, kwFormErrors() || "Kwork вернул форму — проверьте кворк вручную");
    }
    st = await updateState((s) => {
      s.done.push(item.id); s.index += 1; s.phase = "wait"; s.attempts = 0; s.coverDone = null;
      s.message = `Выложен: «${item.title.slice(0, 40)}»`;
    });
  }

  const end = Math.min(queue.length, st.runStart + st.limit);
  if (st.index >= end) return stop(`Готово: выложено ${st.done.length}. ` + (st.index < queue.length ? "Нажмите «Старт», чтобы продолжить." : "Все кворки из архива выложены."));

  if (!onNew) {
    st = await updateState((s) => { s.navs = (s.navs || 0) + 1; });
    if (st.navs > 3) return stop("Не открывается форма «Создать кворк» — откройте её вручную и нажмите «Старт».");
    if (st.phase === "wait" && st.pause > 0 && !isManual(st)) { // пауза между кворками, чтобы не выглядеть как бот
      for (let s = st.pause; s > 0; s--) {
        if (!(await getState()).running) return;
        setStatus(`Следующий кворк через ${s} с…`);
        await kwSleep(1000);
      }
    }
    if ((await getState()).running) location.href = NEW_URL;
    return;
  }

  const item = queue[st.index];
  if (st.phase === "review") return waitForHuman(); // страницу обновили, пока кворк ждал «Готово» — правки не трогаем
  const reloaded = st.phase === "filling"; // страница перезагрузилась посреди заполнения (Kwork сохранил черновик)
  // Новый кворк — только на чистой форме: на открытом черновике мы бы переписали другой кворк.
  if (!reloaded && /draft_id|[?&]id=/.test(location.search) && !st.navs) {
    await updateState((s) => { s.navs = 1; });
    location.href = NEW_URL;
    return;
  }
  st = await updateState((s) => {
    if (reloaded) s.attempts = (s.attempts || 0) + 1;
    else { s.attempts = 0; s.coverDone = null; }
    s.phase = "filling"; s.navs = 0; s.message = `Заполняю ${s.index + 1} из ${end}: «${item.title.slice(0, 40)}»`;
  });
  if (st.attempts > 3) return fail(st, item, "страница всё время перезагружается при заполнении — пришлите скриншот разработчику");
  if (reloaded) log("страница перезагрузилась — продолжаю");
  let filled = {};
  try {
    const cover = await store.get(KW.cover(item.id), null);
    filled = await kwFill(item, cover ? fromB64(cover) : null, (t) => log(t), {
      coverDone: st.coverDone === item.id,
      onCover: () => updateState((s) => { s.coverDone = item.id; }),
    });
  } catch (e) {
    return fail(await getState(), item, e.message);
  }
  st = await getState();
  if (!st.running) return;
  const guessed = [...new Set(filled.guessed || [])];
  if (isManual(st) || filled.needsPortfolio || guessed.length) {
    await updateState((s) => {
      s.phase = "review";
      const parts = [];
      if (filled.needsPortfolio) parts.push(`рубрика «${item.category_hint}» требует работы в портфолио — добавьте их на шаге 4`);
      if (guessed.length) parts.push(`проверьте поля «${guessed.join("», «")}»: подходящего варианта не нашлось, выбран «Другие» или первый`);
      s.message = parts.length
        ? `Кворк ${s.index + 1}: ${parts.join("; ")}. Затем нажмите «Готово» — дальше расширение продолжит само.`
        : `Проверьте кворк ${s.index + 1} и нажмите «Готово» на странице (проверка вручную: ${s.done.length + 1} из ${s.manual}).`;
    });
    return waitForHuman();
  }
  try {
    await afterSubmit(true);
  } catch (e) {
    return fail(await getState(), item, e.message);
  }
}

// --- Замена обложек в уже созданных кворках (например, отклонённых модерацией) ------------------

const kwNorm = (s) => String(s || "").toLowerCase().replace(/[«»"…]/g, "").replace(/\s+/g, " ").trim();

// На странице «Мои кворки» находим кворки из архива по названию и адрес их редактирования:
// ссылка «Изменить» в той же карточке, иначе /edit?id=<номер кворка из ссылки на него>.
function findKworksOnPage(queue) {
  const byTitle = new Map(queue.map((l) => [kwNorm(l.title), l]));
  const found = new Map();
  for (const a of document.querySelectorAll("a[href]")) {
    const text = kwNorm(a.innerText);
    if (text.length < 10) continue;
    const l = byTitle.get(text) || queue.find((q) => a.innerText.trim().endsWith("…") && kwNorm(q.title).startsWith(text));
    if (!l || found.has(l.id)) continue;
    // поднимаемся до карточки с одной ссылкой «Изменить»; где их больше — это уже список, не карточка
    let card = a, edit = null;
    for (let up = 0; up < 8 && card && !edit; up++) {
      card = card.parentElement;
      const edits = card ? card.querySelectorAll('a[href*="/edit"]') : [];
      if (edits.length > 1) break;
      if (edits.length === 1) edit = edits[0];
    }
    const id = (a.href.match(/\/(\d{4,})(?:\/|$|\?)/) || [])[1];
    const url = edit ? edit.href : id ? `https://kwork.ru/edit?id=${id}` : null;
    if (url) found.set(l.id, {id: l.id, title: l.title, url});
  }
  return [...found.values()];
}

async function startCoverReplace() {
  const queue = await store.get(KW.queue, []);
  if (!queue.length) return updateState((st) => { st.message = "Сначала выберите kwork.zip — в нём новые обложки."; });
  const list = findKworksOnPage(queue);
  if (!list.length) {
    return updateState((st) => {
      st.message = "На этой странице нет кворков из архива. Откройте «Мои кворки» (вкладку с отклонёнными) и нажмите кнопку снова.";
    });
  }
  await updateState((st) => Object.assign(st, {running: true, mode: "covers", log: [], failed: [],
    covers: {list, i: 0, done: [], failed: [], phase: "open", navs: 0},
    message: `Заменю обложки у ${list.length} кворков: ${list.map((x) => "«" + x.title.slice(0, 25) + "»").join(", ")}`}));
  resumeCovers();
}

async function resumeCovers() {
  let st = await getState();
  if (!st.running || st.mode !== "covers") return;
  let job = st.covers;
  const finish = () => updateState((s) => {
    const j = s.covers;
    Object.assign(s, {running: false, mode: "publish", phase: "idle",
      message: `Обложки заменены: ${j.done.length} из ${j.list.length}.` + (j.failed.length ? ` Не получилось: ${j.failed.length} — причины ниже.` : "")});
  });
  const next = (failed) => updateState((s) => {
    const j = s.covers, item = j.list[j.i];
    if (failed) { j.failed.push({id: item.id, reason: failed}); s.failed.push({id: item.id, title: item.title, reason: failed}); }
    else j.done.push(item.id);
    j.i += 1; j.phase = "open"; j.navs = 0;
  });

  if (job.phase === "review") { // ждали, пока человек проверит первую замену и сохранит
    if (await onFormPage()) return waitForSave();
    await updateState((s) => { s.covers.phase = "saved"; });
    st = await getState(); job = st.covers;
  }
  if (job.phase === "saved") { // после «Сохранить» Kwork уходит со страницы формы
    const stillForm = await onFormPage();
    await next(stillForm ? (kwFormErrors() || "Kwork не сохранил изменения — проверьте кворк") : null);
    st = await getState(); job = st.covers;
    if (!stillForm) log("обложка заменена и отправлена на модерацию");
  }
  if (job.i >= job.list.length) return finish();
  const item = job.list[job.i];
  const target = new URL(item.url);
  const here = location.pathname + location.search === target.pathname + target.search;
  if (!here && !job.navs) {
    await updateState((s) => { s.covers.navs = 1; s.message = `Обложка ${job.i + 1} из ${job.list.length}: «${item.title.slice(0, 40)}»`; });
    location.href = item.url;
    return;
  }
  try {
    const cover = await store.get(KW.cover(item.id), null);
    await kwReplaceCover(item, cover ? fromB64(cover) : null, (t) => log(t));
    if (!job.done.length && st.manual > 0) { // первую замену сохраняет человек — посмотреть, что всё верно
      await updateState((s) => {
        s.covers.phase = "review";
        s.message = `Обложка заменена у «${item.title.slice(0, 40)}». Проверьте и сохраните кворк (кнопка подсвечена) — остальные расширение заменит и сохранит само.`;
      });
      return waitForSave();
    }
    await updateState((s) => { s.covers.phase = "saved"; });
    await kwClickSave();
  } catch (e) {
    await next(e.message);
    return resumeCovers();
  }
  // Через 30 с всё ещё на форме — Kwork не принял изменения (ошибки покажем в причине).
  await kwSleep(30000);
  st = await getState();
  if (st.running && st.mode === "covers" && st.covers.phase === "saved" && document.querySelector("#step1-name")) {
    await next(kwFormErrors() || "после «Сохранить» Kwork остался на странице");
    resumeCovers();
  }
}

// Первая замена обложки: человек жмёт «Сохранить», дальше замена идёт сама.
function waitForSave() {
  const save = document.querySelector(".js-save-kwork");
  if (!save) return;
  save.style.outline = "4px solid #f5a623";
  save.addEventListener("click", async () => {
    await updateState((s) => { if (s.covers) s.covers.phase = "saved"; });
    await kwSleep(30000); // Kwork не ушёл со страницы — не принял изменения
    const st = await getState();
    if (st.running && st.mode === "covers" && st.covers.phase === "saved" && document.querySelector("#step1-name")) {
      await updateState((s) => { s.covers.phase = "review"; s.message = "Kwork не сохранил кворк: " + (kwFormErrors() || "проверьте форму") + ". Исправьте и нажмите «Сохранить» ещё раз."; });
      waitForSave();
    }
  }, {once: true, capture: true});
}

// Кворк ждёт человека: подсвечиваем «Готово», после нажатия выкладка продолжится сама.
function waitForHuman() {
  const save = document.querySelector(".js-save-kwork");
  if (save) {
    save.style.outline = "4px solid #f5a623";
    // capture — отметку «нажато» начинаем писать раньше, чем Kwork начнёт сохранять и уйдёт со страницы
    save.addEventListener("click", () => afterSubmit(false), {once: true, capture: true});
  }
}

async function afterSubmit(clickSave) {
  await updateState((st) => { st.phase = "submitted"; });
  if (clickSave) await kwClickSave();
  // Если через 30 с мы всё ещё на форме — Kwork показал ошибки или ждёт действия.
  await kwSleep(30000);
  const now = await getState();
  if (now.phase !== "submitted" || !document.querySelector("#step1-name")) return;
  const reason = kwFormErrors() || "после «Готово» Kwork остался на форме";
  if (clickSave) {
    const queue = await store.get(KW.queue, []);
    return fail(now, queue[now.index], reason + " — проверьте вручную");
  }
  // «Готово» жал человек: даём исправить и нажать ещё раз, выкладку не останавливаем
  await updateState((st) => {
    st.phase = "review";
    st.message = `Kwork не принял кворк ${st.index + 1}: ${reason}. Исправьте и нажмите «Готово» ещё раз.`;
  });
  waitForHuman();
}

// --- Панель --------------------------------------------------------------------------------------

let ui = null, uiHost = null, duplicate = "";

// Если в браузере осталась ещё одна копия расширения (например, старая папка после обновления),
// на странице две панели и два заполнителя — выкладка ломается. Находим чужую панель по заголовку.
function otherPanels() {
  return [...document.documentElement.children].filter((el) => el !== uiHost && el.shadowRoot
    && (el.shadowRoot.querySelector(".h span")?.textContent || "").includes(KW_TITLE));
}

function checkDuplicates() {
  const others = otherPanels();
  duplicate = others.map((el) => el.dataset.kwVersion ? "v" + el.dataset.kwVersion : "старая, без номера версии").join(", ");
  for (const el of others) {
    const box = el.shadowRoot.querySelector(".p");
    if (box && !el.shadowRoot.querySelector(".kw-old")) {
      const note = document.createElement("div");
      note.className = "kw-old";
      note.style.cssText = "background:#c0392b;color:#fff;padding:8px;border-radius:6px;margin-bottom:8px;font-weight:bold";
      note.textContent = `Это лишняя копия расширения. Удалите её на странице расширений — рабочая панель v${KW_VERSION} слева.`;
      box.prepend(note);
    }
  }
  if (others.length && uiHost) { uiHost.style.right = ""; uiHost.style.left = "16px"; } // чтобы панели не перекрывались
  render();
  return !others.length;
}

function setStatus(text) { if (ui) ui.querySelector("#status").textContent = text; }

async function render() {
  if (!ui) return;
  const st = await getState();
  const queue = await store.get(KW.queue, []);
  const $ = (id) => ui.querySelector(id);
  $("#count").textContent = queue.length ? `В архиве: ${queue.length} · выложено: ${st.done.length} · следующий: №${Math.min(st.index + 1, queue.length)}` : "Архив не загружен";
  $("#status").textContent = st.message || (st.running ? "Работаю…" : "");
  $("#dup").textContent = duplicate ? `⚠️ В браузере включена ещё одна копия этого расширения (${duplicate}). ` +
    "Она мешает выкладке. Откройте страницу расширений (browser://extensions или chrome://extensions), " +
    `удалите «Kwork — выкладка кворков» с версией не ${KW_VERSION} и обновите эту страницу.` : "";
  $("#manual").value = st.manual; $("#limit").value = st.limit; $("#pause").value = st.pause;
  $("#start").disabled = !!duplicate || st.running || !queue.length || st.index >= queue.length;
  $("#stop").disabled = !st.running;
  $("#covers").disabled = st.running || !queue.length;
  $("#skip").disabled = st.running || st.index >= queue.length;
  $("#log").textContent = st.log.join("\n");
  $("#failed").textContent = st.failed.slice(-3).map((f) => `✗ ${f.title.slice(0, 30)}: ${f.reason}`).join("\n");
}

function buildPanel() {
  const host = document.createElement("div");
  host.dataset.kwVersion = KW_VERSION;
  host.style.cssText = "position:fixed;right:16px;bottom:16px;z-index:2147483647";
  const root = host.attachShadow({mode: "open"});
  root.innerHTML = `
    <style>
      .p{width:300px;background:#fff;color:#222;font:13px/1.35 Arial,sans-serif;border:1px solid #ddd;border-radius:10px;
         box-shadow:0 6px 24px rgba(0,0,0,.18);padding:12px}
      .h{display:flex;justify-content:space-between;font-weight:bold;margin-bottom:8px}
      .row{display:flex;gap:6px;align-items:center;margin:6px 0}
      .row label{flex:1} input[type=number]{width:52px}
      button{padding:6px 10px;border:0;border-radius:6px;cursor:pointer;background:#e9ecef}
      button.go{background:#2bae66;color:#fff} button:disabled{opacity:.5;cursor:default}
      #status{margin:8px 0;font-weight:bold;color:#1d6f42;white-space:pre-wrap}
      #failed{color:#c0392b;white-space:pre-wrap;font-size:12px}
      #log{white-space:pre-wrap;font-size:11px;color:#666;max-height:120px;overflow:auto;margin-top:6px}
      .hide{display:none}
      #dup{color:#fff;background:#c0392b;border-radius:6px;font-weight:bold;white-space:pre-wrap}
      #dup:not(:empty){padding:8px;margin-bottom:8px}
    </style>
    <div class="p">
      <div class="h"><span>🧩 ${KW_TITLE} v${KW_VERSION}</span><a id="fold" href="#">свернуть</a></div>
      <div id="dup"></div>
      <div id="body">
        <div id="count"></div>
        <div class="row"><input type="file" id="zip" accept=".zip"></div>
        <div class="row"><label>Проверять вручную первых</label><input type="number" id="manual" min="0" max="300"></div>
        <div class="row"><label>Всего за запуск</label><input type="number" id="limit" min="1" max="300"></div>
        <div class="row"><label>Пауза между кворками, с</label><input type="number" id="pause" min="0" max="600"></div>
        <div class="row"><button class="go" id="start">▶ Старт</button><button id="stop">■ Стоп</button><button id="skip">Пропустить</button><button id="reset">Сначала</button></div>
        <div class="row"><button id="covers" title="Откройте «Мои кворки» и нажмите: обложки кворков из архива заменятся новыми">🖼 Заменить обложки</button></div>
        <div id="status"></div><div id="failed"></div><div id="log"></div>
      </div>
    </div>`;
  document.documentElement.appendChild(host);
  ui = root; uiHost = host;
  const $ = (id) => root.querySelector(id);
  $("#fold").onclick = (e) => { e.preventDefault(); $("#body").classList.toggle("hide"); };
  $("#zip").onchange = async () => {
    setStatus("Читаю архив…");
    try { await loadZip($("#zip").files[0]); } catch (e) {
      // в состояние, а не только на экран: иначе следующая перерисовка панели стирала сообщение
      await updateState((st) => { st.message = "Не получилось: " + e.message; });
      $("#zip").value = "";
    }
  };
  for (const id of ["manual", "limit", "pause"]) {
    $("#" + id).onchange = () => { const v = Math.max(0, Number($("#" + id).value) || 0); updateState((st) => { st[id] = v; }); };
  }
  $("#start").onclick = async () => {
    if (!checkDuplicates()) return;
    // Каждый запуск — с чистой панелью: ошибки и журнал прошлого запуска убираем.
    await updateState((st) => Object.assign(st, {running: true, mode: "publish", runStart: st.index, phase: "start", message: "Начинаю…",
      failed: [], log: [], attempts: 0, coverDone: null, navs: 0}));
    resume();
  };
  $("#stop").onclick = () => stop("Остановлено вами.");
  $("#covers").onclick = () => startCoverReplace();
  $("#skip").onclick = async () => {
    const queue = await store.get(KW.queue, []);
    await updateState((st) => {
      if (st.running || st.index >= queue.length) return;
      st.index += 1; st.message = `Пропущен кворк №${st.index}. Нажмите «Старт», чтобы продолжить.`;
    });
  };
  $("#reset").onclick = () => updateState((st) => Object.assign(st, {running: false, index: 0, runStart: 0, phase: "idle",
    done: [], failed: [], log: [], message: "Начнём с первого кворка."}));
}

if (window.top === window && !window.__kwPanel) {
  window.__kwPanel = true;
  buildPanel();
  // Копии расширения стартуют в любом порядке — проверяем дважды. Пока есть копия, сами не продолжаем.
  setTimeout(() => { if (checkDuplicates()) resume(); else stop("Выкладка на паузе: удалите лишнюю копию расширения."); }, 1200);
  setTimeout(checkDuplicates, 5000);
}
