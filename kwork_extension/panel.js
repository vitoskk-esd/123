// Панель на страницах kwork.ru и пошаговая выкладка. После «Готово» Kwork уходит на другую
// страницу, поэтому состояние хранится в chrome.storage и продолжается на каждой загрузке.

const KW = {queue: "kw_queue", state: "kw_state", cover: (id) => "kw_cover_" + id};
const NEW_URL = "https://kwork.ru/new";

const store = {
  get: async (key, fallback) => (await chrome.storage.local.get(key))[key] ?? fallback,
  set: (key, value) => chrome.storage.local.set({[key]: value}),
};

function defaultState() {
  return {running: false, index: 0, runStart: 0, manual: 3, limit: 6, pause: 30, phase: "idle",
          done: [], failed: [], log: [], message: ""};
}

async function getState() { return Object.assign(defaultState(), await store.get(KW.state, {})); }
async function saveState(st) { await store.set(KW.state, st); render(); }

// Записи журнала идут по очереди: одновременные чтение-запись теряли строки.
let logChain = Promise.resolve();
function log(text) {
  logChain = logChain.then(async () => {
    const st = await getState();
    const d = new Date(), hhmm = String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0");
    st.log = [hhmm + " " + text, ...st.log].slice(0, 12);
    await saveState(st);
  });
  return logChain;
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
  if (!files["listings.json"]) throw new Error("в архиве нет listings.json — это точно kwork.zip из бота?");
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
    section_id: l.section_id, category_id: l.category_id,
  })));
  const st = defaultState();
  const prev = await getState();
  Object.assign(st, {manual: prev.manual, limit: prev.limit, pause: prev.pause, message: `Загружено кворков: ${listings.length}`});
  await saveState(st);
}

// --- Выкладка ------------------------------------------------------------------------------------

async function stop(message) {
  const st = await getState();
  st.running = false; st.phase = "idle"; st.message = message;
  await saveState(st);
}

async function fail(st, item, reason) {
  st.failed.push({id: item.id, title: item.title, reason});
  st.running = false; st.phase = "idle";
  st.message = `Остановлено на «${item.title.slice(0, 40)}»: ${reason}`;
  await saveState(st);
}

function isManual(st) { return st.index - st.runStart < st.manual; }

async function resume() {
  render();
  let st = await getState();
  if (!st.running) return;
  const queue = await store.get(KW.queue, []);
  const onNew = location.pathname === "/new";
  if (/\/login|\/signin/.test(location.pathname)) return stop("Войдите в аккаунт Kwork и нажмите «Старт» снова.");

  if (st.phase === "submitted") {
    const item = queue[st.index];
    if (onNew) { // снова форма — Kwork не принял кворк
      return fail(st, item, kwFormErrors() || "Kwork вернул форму — проверьте кворк вручную");
    }
    st.done.push(item.id); st.index += 1; st.phase = "wait";
    st.message = `Выложен: «${item.title.slice(0, 40)}»`;
    await saveState(st);
  }

  const end = Math.min(queue.length, st.runStart + st.limit);
  if (st.index >= end) return stop(`Готово: выложено ${st.done.length}. ` + (st.index < queue.length ? "Нажмите «Старт», чтобы продолжить." : "Все кворки из архива выложены."));

  if (!onNew) {
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
  st.phase = "filling"; st.message = `Заполняю ${st.index + 1} из ${end}: «${item.title.slice(0, 40)}»`;
  await saveState(st);
  try {
    const cover = await store.get(KW.cover(item.id), null);
    await kwFill(item, cover ? fromB64(cover) : null, (t) => log(t));
  } catch (e) {
    return fail(await getState(), item, e.message);
  }
  st = await getState();
  if (!st.running) return;
  if (isManual(st)) {
    st.phase = "review";
    st.message = `Проверьте кворк ${st.index + 1} и нажмите «Готово» на странице (проверка вручную: ${st.index - st.runStart + 1} из ${st.manual}).`;
    await saveState(st);
    const save = document.querySelector(".js-save-kwork");
    if (save) {
      save.style.outline = "4px solid #f5a623";
      save.addEventListener("click", () => afterSubmit(), {once: true});
    }
    return;
  }
  try {
    await afterSubmit(true);
  } catch (e) {
    return fail(await getState(), item, e.message);
  }
}

async function afterSubmit(clickSave) {
  const st = await getState();
  st.phase = "submitted";
  await saveState(st);
  if (clickSave) await kwClickSave();
  // Если через 30 с мы всё ещё на форме — Kwork показал ошибки или ждёт действия.
  await kwSleep(30000);
  const now = await getState();
  if (now.phase === "submitted" && location.pathname === "/new") {
    const queue = await store.get(KW.queue, []);
    await fail(now, queue[now.index], kwFormErrors() || "после «Готово» Kwork остался на форме — проверьте вручную");
  }
}

// --- Панель --------------------------------------------------------------------------------------

let ui = null;

function setStatus(text) { if (ui) ui.querySelector("#status").textContent = text; }

async function render() {
  if (!ui) return;
  const st = await getState();
  const queue = await store.get(KW.queue, []);
  const $ = (id) => ui.querySelector(id);
  $("#count").textContent = queue.length ? `В архиве: ${queue.length} · выложено: ${st.done.length} · следующий: №${Math.min(st.index + 1, queue.length)}` : "Архив не загружен";
  $("#status").textContent = st.message || (st.running ? "Работаю…" : "");
  $("#manual").value = st.manual; $("#limit").value = st.limit; $("#pause").value = st.pause;
  $("#start").disabled = st.running || !queue.length || st.index >= queue.length;
  $("#stop").disabled = !st.running;
  $("#skip").disabled = st.running || st.index >= queue.length;
  $("#log").textContent = st.log.join("\n");
  $("#failed").textContent = st.failed.slice(-3).map((f) => `✗ ${f.title.slice(0, 30)}: ${f.reason}`).join("\n");
}

function buildPanel() {
  const host = document.createElement("div");
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
    </style>
    <div class="p">
      <div class="h"><span>🧩 Kwork — выкладка</span><a id="fold" href="#">свернуть</a></div>
      <div id="body">
        <div id="count"></div>
        <div class="row"><input type="file" id="zip" accept=".zip"></div>
        <div class="row"><label>Проверять вручную первых</label><input type="number" id="manual" min="0" max="300"></div>
        <div class="row"><label>Всего за запуск</label><input type="number" id="limit" min="1" max="300"></div>
        <div class="row"><label>Пауза между кворками, с</label><input type="number" id="pause" min="0" max="600"></div>
        <div class="row"><button class="go" id="start">▶ Старт</button><button id="stop">■ Стоп</button><button id="skip">Пропустить</button><button id="reset">Сначала</button></div>
        <div id="status"></div><div id="failed"></div><div id="log"></div>
      </div>
    </div>`;
  document.documentElement.appendChild(host);
  ui = root;
  const $ = (id) => root.querySelector(id);
  $("#fold").onclick = (e) => { e.preventDefault(); $("#body").classList.toggle("hide"); };
  $("#zip").onchange = async () => {
    setStatus("Читаю архив…");
    try { await loadZip($("#zip").files[0]); } catch (e) { setStatus("Не получилось: " + e.message); }
  };
  for (const id of ["manual", "limit", "pause"]) {
    $("#" + id).onchange = async () => { const st = await getState(); st[id] = Math.max(0, Number($("#" + id).value) || 0); await saveState(st); };
  }
  $("#start").onclick = async () => {
    const st = await getState();
    Object.assign(st, {running: true, runStart: st.index, phase: "start", message: "Начинаю…"});
    await saveState(st);
    resume();
  };
  $("#stop").onclick = () => stop("Остановлено вами.");
  $("#skip").onclick = async () => {
    const st = await getState();
    const queue = await store.get(KW.queue, []);
    if (st.running || st.index >= queue.length) return;
    st.index += 1; st.message = `Пропущен кворк №${st.index}. Нажмите «Старт», чтобы продолжить.`;
    await saveState(st);
  };
  $("#reset").onclick = async () => {
    const st = await getState();
    Object.assign(st, {running: false, index: 0, runStart: 0, phase: "idle", done: [], failed: [], log: [], message: "Начнём с первого кворка."});
    await saveState(st);
  };
}

if (window.top === window && !window.__kwPanel) {
  window.__kwPanel = true;
  buildPanel();
  resume();
}
