// Выполняет действия в «мире страницы» (MAIN): там живут jQuery, chosen и trumbowyg Kwork.
// Без этого выпадающие списки менялись бы «невидимо», а редакторы текста не видели новый текст.
chrome.runtime.onMessage.addListener((msg, sender, reply) => {
  if (msg.type !== "main") return false;
  chrome.scripting.executeScript({
    target: {tabId: sender.tab.id},
    world: "MAIN",
    func: mainAction,
    args: [msg.action, msg.selector, msg.value],
  }).then(([res]) => reply({ok: true, result: res && res.result}))
    .catch((e) => reply({ok: false, error: String(e)}));
  return true; // ответ асинхронный
});

// Эта функция выполняется внутри страницы Kwork. Она должна быть самодостаточной.
function mainAction(action, selector, value) {
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
  if (action === "text") { // название: видимый редактор #editor-title + скрытый textarea
    const editor = document.querySelector("#editor-title");
    if (editor) { editor.textContent = value; ["input", "keyup", "change"].forEach((t) => fire(editor, t)); }
    el.value = value;
    if ($) $(el).trigger("input").trigger("change").trigger("keyup"); else { fire(el, "input"); fire(el, "change"); }
    return "ok";
  }
  return "неизвестное действие " + action;
}
