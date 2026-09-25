"""Публикация кворков на Kwork через браузер (Playwright), которым управляет Claude.

Жёстко прописанных селекторов нет: на каждом шаге агент получает список
интерактивных элементов страницы (и скриншот) и сам решает, что заполнить и куда
нажать. Поэтому публикация переживает изменения вёрстки Kwork.
"""

from __future__ import annotations

import base64
import json
import time
from pathlib import Path
from urllib.parse import urlparse

from . import storage
from .config import CONFIG
from .cover import make_cover
from .llm import LLM

SNAPSHOT_JS = r"""
() => {
  document.querySelectorAll('[data-agent-id]').forEach(e => e.removeAttribute('data-agent-id'));
  const sel = 'input, textarea, select, button, a[href], [contenteditable="true"], [role="button"], ' +
              '[role="option"], [role="combobox"], [role="listbox"] li, [role="checkbox"], ' +
              '[class*="option"], [class*="dropdown"] li, [class*="select"] li';
  const visible = e => {
    if (e.type === 'file') return true;           // скрытые file-input'ы тоже нужны
    const r = e.getBoundingClientRect();
    const s = getComputedStyle(e);
    return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none';
  };
  const labelOf = e => {
    if (e.labels && e.labels[0]) return e.labels[0].innerText;
    const l = e.closest('label'); if (l) return l.innerText;
    let p = e.parentElement;
    for (let i = 0; i < 3 && p; i++, p = p.parentElement) {
      const t = (p.querySelector('label, .label, [class*="title"], [class*="label"]') || {}).innerText;
      if (t) return t;
    }
    return '';
  };
  const clip = (s, n) => (s || '').replace(/\s+/g, ' ').trim().slice(0, n);
  const out = [];
  let n = 0;
  for (const e of document.querySelectorAll(sel)) {
    if (!visible(e) || out.length >= 220) continue;
    e.setAttribute('data-agent-id', String(++n));
    const item = {id: n, tag: e.tagName.toLowerCase()};
    for (const a of ['type', 'name', 'placeholder', 'aria-label', 'role']) {
      const v = e.getAttribute(a); if (v) item[a] = clip(v, 60);
    }
    const label = clip(labelOf(e), 60); if (label) item.label = label;
    const text = clip(e.innerText, 80); if (text) item.text = text;
    if ('value' in e && e.value && e.type !== 'password') item.value = clip(e.value, 60);
    if (e.tagName === 'SELECT') item.options = [...e.options].slice(0, 40).map(o => clip(o.text, 40));
    if (e.checked) item.checked = true;
    if (e.disabled) item.disabled = true;
    out.push(item);
  }
  const errors = [...document.querySelectorAll('[class*="error"], [class*="invalid"], .alert, [role="alert"]')]
      .filter(visible).map(e => clip(e.innerText, 150)).filter(Boolean).slice(0, 10);
  return {url: location.href, title: document.title,
          page_text: clip(document.body.innerText, 1500), errors, elements: out};
}
"""


def _tool(name: str, description: str, props: dict, required: list[str]) -> dict:
    return {
        "name": name,
        "description": description,
        "strict": True,
        "input_schema": {
            "type": "object",
            "additionalProperties": False,
            "properties": props,
            "required": required,
        },
    }


_ID = {"type": "integer", "description": "id элемента из снимка страницы"}
TOOLS = [
    _tool("fill", "Очистить поле (input/textarea/contenteditable) и ввести текст.",
          {"element_id": _ID, "text": {"type": "string"}}, ["element_id", "text"]),
    _tool("click", "Кликнуть по элементу.", {"element_id": _ID}, ["element_id"]),
    _tool("select_option", "Выбрать вариант в нативном <select> по видимому тексту.",
          {"element_id": _ID, "label": {"type": "string"}}, ["element_id", "label"]),
    _tool("type_text", "Напечатать текст в элемент посимвольно (для поиска в выпадающих списках).",
          {"element_id": _ID, "text": {"type": "string"}}, ["element_id", "text"]),
    _tool("upload_cover", "Загрузить обложку кворка в input[type=file].", {"element_id": _ID}, ["element_id"]),
    _tool("press_key", "Нажать клавишу (Enter, Escape, Tab, ArrowDown…).",
          {"key": {"type": "string"}}, ["key"]),
    _tool("goto", "Перейти по адресу на kwork.ru.", {"url": {"type": "string"}}, ["url"]),
    _tool("wait", "Подождать, пока страница обновится (1–5 секунд).",
          {"seconds": {"type": "integer"}}, ["seconds"]),
    _tool("finish", "Завершить работу с этим кворком.",
          {"status": {"type": "string", "enum": ["submitted", "draft_saved", "blocked", "failed"]},
           "note": {"type": "string"}},
          ["status", "note"]),
]

SYSTEM = """Ты управляешь браузером, в котором открыт личный кабинет продавца на Kwork.
Твоя единственная задача — создать ОДИН новый кворк с данными, которые дал пользователь,
и отправить его на модерацию.

Правила:
- После каждого действия ты получаешь свежий снимок страницы: список элементов с id.
  Обращайся к элементам только по id из ПОСЛЕДНЕГО снимка.
- Заполни все обязательные поля: название, рубрику/подрубрику (выбери самую подходящую
  из доступных), описание, что нужно от покупателя, цену, срок, обложку (upload_cover).
  Если форма многошаговая — проходи шаги по порядку. Если поле с ограничением длины
  не принимает текст — аккуратно сократи его без потери смысла.
- Если форма показывает ошибки — исправь их.
- Никогда не меняй настройки аккаунта, не удаляй и не редактируй другие кворки,
  не пиши сообщения покупателям, ничего не покупай.
- Если видишь капчу, запрос кода из SMS/почты, страницу входа или блокировку —
  вызови finish со статусом "blocked" и опиши, что увидел.
- {submit_rule}
- Когда кворк отправлен на модерацию (или сохранён по правилу выше) — вызови finish."""

SUBMIT_LIVE = "Когда всё заполнено — нажми кнопку отправки кворка на модерацию и дождись подтверждения."
SUBMIT_DRY = ("РЕЖИМ ПРОВЕРКИ: заполни всю форму, но НЕ отправляй на модерацию. Если есть кнопка "
              "«Сохранить черновик» — нажми её и заверши со статусом draft_saved; иначе просто "
              "заверши со статусом draft_saved.")


class KworkBrowser:
    def __init__(self, headless: bool | None = None):
        from playwright.sync_api import sync_playwright

        self._pw = sync_playwright().start()
        self.browser = self._pw.chromium.launch(headless=CONFIG.headless if headless is None else headless)
        state = str(CONFIG.state_file) if CONFIG.state_file.exists() else None
        self.context = self.browser.new_context(
            storage_state=state,
            locale="ru-RU",
            viewport={"width": 1366, "height": 900},
        )
        self.page = self.context.new_page()

    def close(self) -> None:
        try:
            self.context.storage_state(path=str(CONFIG.state_file))
        finally:
            self.browser.close()
            self._pw.stop()

    # --- Авторизация ---------------------------------------------------------

    def is_logged_in(self) -> bool:
        self.page.goto(CONFIG.kwork_base_url, wait_until="domcontentloaded")
        self.page.wait_for_timeout(2000)
        # Для гостя в шапке есть ссылка «Вход»; после входа её нет.
        return self.page.locator('a[href*="/login"], a:has-text("Вход")').count() == 0

    def login_with_password(self, llm: LLM) -> bool:
        if not (CONFIG.kwork_login and CONFIG.kwork_password):
            return False
        storage.log("Пробую войти по логину и паролю")
        self.page.goto(f"{CONFIG.kwork_base_url}/login", wait_until="domcontentloaded")
        self.page.wait_for_timeout(2000)
        try:
            self.page.locator('input[name="l_username"], input[name="login"], input[type="email"], '
                              'input[name="email"]').first.fill(CONFIG.kwork_login)
            self.page.locator('input[type="password"]').first.fill(CONFIG.kwork_password)
            self.page.locator('button[type="submit"], input[type="submit"]').first.click()
            self.page.wait_for_timeout(5000)
        except Exception as e:  # noqa: BLE001 — любая ошибка вёрстки = не вошли
            storage.log(f"Автовход не удался: {e}")
            return False
        ok = self.is_logged_in()
        if ok:
            self.context.storage_state(path=str(CONFIG.state_file))
        return ok

    def login_interactive(self) -> None:
        """Открывает видимый браузер: вы входите вручную, агент сохраняет сессию."""
        self.page.goto(f"{CONFIG.kwork_base_url}/login")
        print("Войдите в Kwork в открывшемся окне браузера. После входа нажмите Enter здесь…")
        input()
        self.context.storage_state(path=str(CONFIG.state_file))
        print(f"Сессия сохранена в {CONFIG.state_file}")

    # --- Действия -------------------------------------------------------------

    def snapshot(self) -> dict:
        try:
            self.page.wait_for_load_state("domcontentloaded", timeout=10000)
        except Exception:  # noqa: BLE001
            pass
        return self.page.evaluate(SNAPSHOT_JS)

    def screenshot_b64(self) -> str:
        return base64.standard_b64encode(self.page.screenshot(type="jpeg", quality=60)).decode()

    def _el(self, element_id: int):
        return self.page.locator(f'[data-agent-id="{element_id}"]').first

    def act(self, name: str, args: dict, cover: Path) -> str:
        if name == "fill":
            el = self._el(args["element_id"])
            el.click(timeout=5000)
            el.fill(args["text"], timeout=5000)
        elif name == "type_text":
            el = self._el(args["element_id"])
            el.click(timeout=5000)
            el.press_sequentially(args["text"], delay=40, timeout=15000)
        elif name == "click":
            self._el(args["element_id"]).click(timeout=5000)
        elif name == "select_option":
            self._el(args["element_id"]).select_option(label=args["label"], timeout=5000)
        elif name == "upload_cover":
            self._el(args["element_id"]).set_input_files(str(cover), timeout=10000)
        elif name == "press_key":
            self.page.keyboard.press(args["key"])
        elif name == "goto":
            host = urlparse(args["url"]).hostname or ""
            if not host.endswith("kwork.ru"):
                return "Ошибка: разрешены только адреса kwork.ru"
            self.page.goto(args["url"], wait_until="domcontentloaded")
        elif name == "wait":
            self.page.wait_for_timeout(max(1, min(5, args["seconds"])) * 1000)
        self.page.wait_for_timeout(800)
        return "ok"


def _observation(browser: KworkBrowser, prefix: str) -> list[dict]:
    snap = browser.snapshot()
    content: list[dict] = [{"type": "text", "text": prefix + "\n" + json.dumps(snap, ensure_ascii=False)}]
    if CONFIG.browser_screenshots:
        content.append({
            "type": "image",
            "source": {"type": "base64", "media_type": "image/jpeg", "data": browser.screenshot_b64()},
        })
    return content


def publish_one(llm: LLM, browser: KworkBrowser, listing: dict) -> tuple[str, str]:
    cover = make_cover(listing)
    browser.page.goto(CONFIG.kwork_new_url, wait_until="domcontentloaded")
    browser.page.wait_for_timeout(2500)

    data = {k: listing[k] for k in ("title", "category_hint", "description", "requirements",
                                    "price_rub", "days", "tags")}
    messages: list[dict] = [{
        "role": "user",
        "content": [
            {"type": "text", "text": "Создай кворк с такими данными:\n" + json.dumps(data, ensure_ascii=False, indent=2)
             + f"\n\nОбложка уже подготовлена: {cover.name} (загружай через upload_cover)."},
            *_observation(browser, "Текущая страница:"),
        ],
    }]
    system = SYSTEM.format(submit_rule=SUBMIT_DRY if CONFIG.dry_run else SUBMIT_LIVE)
    shots = CONFIG.data_dir / "screenshots"
    shots.mkdir(parents=True, exist_ok=True)

    for step in range(CONFIG.browser_max_steps):
        response = llm.create(
            max_tokens=8000,
            system=system,
            tools=TOOLS,
            messages=messages,
            output_config={"effort": "medium"},
        )
        if response.stop_reason == "refusal":
            return "failed", "модель отказалась выполнять шаг"
        messages.append({"role": "assistant", "content": response.content})
        calls = [b for b in response.content if b.type == "tool_use"]
        if not calls:
            messages.append({"role": "user", "content": "Продолжай: используй инструменты или вызови finish."})
            continue

        results = []
        for call in calls:
            if call.name == "finish":
                browser.page.screenshot(path=str(shots / f"{listing['id']}-final.png"))
                return call.input["status"], call.input["note"]
            try:
                outcome = browser.act(call.name, call.input, cover)
                is_error = outcome != "ok"
            except Exception as e:  # noqa: BLE001 — ошибку отдаём модели, она выберет другой путь
                outcome, is_error = f"Ошибка: {str(e)[:300]}", True
            results.append({"type": "tool_result", "tool_use_id": call.id, "content": outcome, "is_error": is_error})
        # Снимок страницы после всех действий прикладываем к последнему результату.
        results[-1]["content"] = _observation(browser, f"Результат: {results[-1]['content']}. Страница сейчас:")
        messages.append({"role": "user", "content": results})
        if step % 5 == 4:
            browser.page.screenshot(path=str(shots / f"{listing['id']}-step{step + 1}.png"))

    return "failed", f"не уложился в {CONFIG.browser_max_steps} шагов"


def publish_pending(llm: LLM, limit: int) -> tuple[int, int]:
    """Публикует очередь (не больше limit за сегодня). Возвращает (попыток, успешных)."""
    listings = storage.load_listings()
    done_today = sum(
        1 for l in listings
        if l.get("published") == storage.today() and l["status"] in ("submitted", "draft_saved")
    )
    # Заполненные в режиме проверки объявления публикуются по-настоящему, когда проверку выключат.
    ready = ("draft", "failed") if CONFIG.dry_run else ("draft", "failed", "draft_saved")
    queue = [l for l in listings if l["status"] in ready and l.get("attempts", 0) < 3]
    queue = queue[: max(0, limit - done_today)]
    if not queue:
        storage.log("Публиковать нечего (или дневной план выполнен)")
        return 0, 0

    deadline = time.monotonic() + CONFIG.publish_time_budget_min * 60
    browser = KworkBrowser()
    attempted = done = 0
    try:
        if not browser.is_logged_in() and not browser.login_with_password(llm):
            storage.log("Нет входа в Kwork. Запустите `python -m kwork_agent login` "
                        "или задайте KWORK_LOGIN/KWORK_PASSWORD.")
            return 0, 0
        for i, listing in enumerate(queue, 1):
            if time.monotonic() > deadline:
                storage.log(f"Время на публикацию вышло, {len(queue) - i + 1} объявлений ждут следующего дня")
                break
            storage.log(f"Публикую {i}/{len(queue)}: «{listing['title']}»")
            if listing["status"] == "draft_saved":
                listing["attempts"] = 0
            listing["attempts"] = listing.get("attempts", 0) + 1
            try:
                status, note = publish_one(llm, browser, listing)
            except Exception as e:  # noqa: BLE001
                status, note = "failed", str(e)[:300]
            storage.log(f"  → {status}: {note}")
            listing["publish_note"] = note
            if status == "blocked":
                # Проблема со входом/капчей/лимитом, а не с объявлением — вернём его в очередь.
                listing["status"] = "draft"
                listing["attempts"] -= 1
                storage.save_listings(listings)
                attempted += 1
                break
            attempted += 1
            listing["status"] = status
            if status in ("submitted", "draft_saved"):
                listing["published"] = storage.today()
                done += 1
            storage.save_listings(listings)
            time.sleep(20)  # пауза между кворками, чтобы не выглядеть как бот-спамер
    finally:
        browser.close()
    return attempted, done
