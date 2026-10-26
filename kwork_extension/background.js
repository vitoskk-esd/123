// Выполняет действия в «мире страницы» (MAIN): там живут jQuery, chosen и trumbowyg Kwork.
// Без этого выпадающие списки менялись бы «невидимо», а редакторы текста не видели новый текст.
chrome.runtime.onMessage.addListener((msg, sender, reply) => {
  if (msg.type !== "main") return false;
  chrome.scripting.executeScript({
    target: {tabId: sender.tab.id},
    world: "MAIN",
    func: mainAction,
    args: [msg.action, msg.selector, msg.value === undefined ? null : msg.value], // undefined Chrome не передаёт
  }).then(([res]) => reply({ok: true, result: res && res.result}))
    .catch((e) => reply({ok: false, error: String(e)}));
  return true; // ответ асинхронный
});

// Эта функция выполняется внутри страницы Kwork. Она должна быть самодостаточной.
function mainAction(action, selector, value) {
  if (action === "ready") { // форма Kwork запущена: модуль сохранения есть и список рубрик получил данные
    const $ = window.jQuery;
    const block = $ && $(selector).closest(".js-category-select");
    return window.KworkSaveModule && block && block.length && block.data("options") ? "ok" : "not ready";
  }
  if (action === "coverWatch") { // запоминаем запросы Kwork на загрузку обложки и их ответы
    if (!window.__kwUploads) {
      window.__kwUploads = [];
      const open = XMLHttpRequest.prototype.open, send = XMLHttpRequest.prototype.send;
      XMLHttpRequest.prototype.open = function (method, url) { this.__kwUrl = String(url); return open.apply(this, arguments); };
      XMLHttpRequest.prototype.send = function () {
        if (/temp-image-upload/.test(this.__kwUrl || "")) {
          const rec = {status: "sent"};
          window.__kwUploads.push(rec);
          this.addEventListener("loadend", () => { rec.status = this.status; rec.body = String(this.responseText || "").slice(0, 3000); });
        }
        return send.apply(this, arguments);
      };
    }
    window.__kwUploadsFrom = window.__kwUploads.length;
    return "ok";
  }
  if (action === "coverStatus") {
    return "ok:" + JSON.stringify({uploads: (window.__kwUploads || []).slice(window.__kwUploadsFrom || 0)});
  }
  const el = document.querySelector(selector);
  if (!el) return "нет элемента " + selector;
  const $ = window.jQuery;
  const fire = (node, type) => node.dispatchEvent(new Event(type, {bubbles: true}));
  if (action === "select") {
    if ($) $(el).val(String(value)).trigger("change").trigger("chosen:updated");
    else { el.value = String(value); fire(el, "change"); }
    return el.value === String(value) ? "ok" : "нет варианта " + value;
  }
  if (action === "html") { // редактор trumbowyg: textarea + видимый редактор
    if ($ && $(el).data("trumbowyg")) $(el).trumbowyg("html", value);
    const editor = el.parentElement && el.parentElement.querySelector(".trumbowyg-editor");
    if (editor) { editor.innerHTML = value; ["input", "keyup", "change", "blur"].forEach((t) => fire(editor, t)); }
    el.value = value;
    if ($) $(el).trigger("input").trigger("change").trigger("keyup"); else { fire(el, "input"); fire(el, "change"); }
    return "ok";
  }
  if (action === "text") { // название, объём: видимый редактор (contenteditable) + скрытое поле рядом
    const editor = (el.parentElement && el.parentElement.querySelector('.js-content-editor[contenteditable="true"]'))
      || document.querySelector("#editor-title");
    if (editor) { editor.textContent = value; ["input", "keyup", "change"].forEach((t) => fire(editor, t)); }
    el.value = value;
    if ($) $(el).trigger("input").trigger("change").trigger("keyup"); else { fire(el, "input"); fire(el, "change"); }
    return "ok";
  }
  if (action === "value") { // обычное поле ввода (число объёма)
    el.value = String(value);
    if ($) $(el).trigger("input").trigger("change").trigger("keyup").trigger("blur");
    else ["input", "change", "keyup", "blur"].forEach((t) => fire(el, t));
    return "ok";
  }
  return "неизвестное действие " + action;
}
