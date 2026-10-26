"""Поля рубрик Kwork («Тип», «Вид», «Язык разработки», «Платформа»…) и выбор вариантов для кворка.

Kwork отдаёт поля рубрики без входа в аккаунт: /api/attribute/loadclassification?categoryId=…
(верхний уровень) и …&attributeId=<вариант> (поля, которые появляются после выбора варианта).
Дерево рубрики кешируется на неделю. ИИ выбирает в нём варианты под каждый кворк, а расширение
отмечает их по номерам (attribute_ids) — без угадывания по словам.
"""

from __future__ import annotations

import html as html_lib
import json
import re
import time
import urllib.parse
import urllib.request
from pathlib import Path

from .config import BOT_CONFIG

API = "https://kwork.ru/api/attribute/loadclassification"
CACHE_DAYS = 7
MAX_DEPTH = 9
_FIELD_RE = re.compile(r'<div class="js-field-block[^"]*" data-attribute-id="(\d+)" data-parent-id="(\d*)"')
_INPUT_RE = re.compile(r'<input id="(attribute_item_\d+)" type="(radio|checkbox)"([^>]*?)value="(\d+)"')


def _get(category_id: int, attribute_id: str = "") -> str:
    query = urllib.parse.urlencode({"categoryId": category_id, "lang": "ru", "attributeId": attribute_id})
    req = urllib.request.Request(f"{API}?{query}", headers={"User-Agent": "Mozilla/5.0", "X-Requested-With": "XMLHttpRequest"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        body = resp.read().decode("utf-8", "replace").strip()
    if not body:  # у варианта без вложенных полей Kwork иногда отвечает пустым телом
        return ""
    try:
        data = json.loads(body)
    except ValueError:
        raise RuntimeError("Kwork ответил не JSON: " + body[:120]) from None
    return (data.get("html") or "") if data.get("success") else ""


def parse_fields(html: str) -> list[dict]:
    """HTML полей Kwork → [{"id", "title", "required", "multiple", "max", "options": [{"id", "label", "child"}]}]."""
    fields = []
    starts = list(_FIELD_RE.finditer(html))
    for n, m in enumerate(starts):
        seg = html[m.end(): starts[n + 1].start() if n + 1 < len(starts) else len(html)]
        title = re.search(r'field-label-name">([^<]*)', seg)
        head = re.search(r'<div class="attribute-list[^>]*>', seg)
        attrs = dict(re.findall(r'(data-[\w-]+)="([^"]*)"', head.group(0))) if head else {}
        options = []
        for om in _INPUT_RE.finditer(seg):
            label = re.search(r'<label for="%s"[^>]*>(.*?)</label>' % om.group(1), seg, re.S)
            has_child = re.search(r'data-has-child="(\d)"', om.group(3))
            options.append({
                "id": om.group(4),
                "label": html_lib.unescape(re.sub(r"<[^>]+>", "", label.group(1))).strip() if label else "",
                # у кружков Kwork признак не пишет — вложенные поля бывают у любого
                "child": om.group(2) == "radio" or (has_child is not None and has_child.group(1) == "1"),
            })
        if options:
            fields.append({
                "id": m.group(1),
                "title": html_lib.unescape(title.group(1)).strip() if title else "",
                "required": attrs.get("data-required") == "1",
                "multiple": attrs.get("data-allow-multiple") == "1",
                "max": int(attrs.get("data-multiple-max-count") or 0),
                "options": options,
            })
    return fields


def fetch_tree(category_id: int, pause: float = 0.2) -> list[dict]:
    """Всё дерево полей рубрики: у вариантов — вложенные поля в "fields"."""
    def walk(fields: list[dict], depth: int) -> None:
        for field in fields:
            for opt in field["options"]:
                children = []
                if opt.pop("child") and depth < MAX_DEPTH:
                    for attempt in range(2):  # изредка Kwork отвечает страницей вместо JSON — повторяем раз
                        time.sleep(pause * (1 + 10 * attempt))
                        try:
                            children = parse_fields(_get(category_id, opt["id"]))
                            break
                        except RuntimeError:
                            children = []
                    walk(children, depth + 1)
                if children:
                    opt["fields"] = children
    tree = parse_fields(_get(category_id))
    walk(tree, 1)
    return tree


SNAPSHOT = Path(__file__).with_name("kwork_fields.json")
_snapshot: dict | None = None


def tree_for(category_id: int | None) -> list[dict]:
    """Дерево полей рубрики из снимка (обход всех рубрик — ~900 запросов, а за частые запросы
    Kwork отвечает 403, поэтому снимок обновляется вручную: refresh_snapshot())."""
    global _snapshot
    if _snapshot is None:
        _snapshot = json.loads(SNAPSHOT.read_text(encoding="utf-8"))["categories"]
    return _snapshot.get(str(category_id), []) if category_id else []


def refresh_snapshot(pause: float = 0.3) -> None:
    """Заново скачать поля всех рубрик в kwork_fields.json (долго, запускать вручную)."""
    from .kwork_rules import sections

    cats = {str(c["id"]): fetch_tree(c["id"], pause) for s in sections() for c in s["subs"]}
    SNAPSHOT.write_text(json.dumps({"source": f"{API}, {time.strftime('%d.%m.%Y')}", "categories": cats},
                                   ensure_ascii=False, separators=(",", ":")) + "\n", encoding="utf-8")


def describe(tree: list[dict], depth: int = 0) -> str:
    """Дерево для промпта: номер и название варианта, под вариантом — поля, которые он открывает."""
    lines = []
    pad = "  " * depth
    for f in tree:
        how = (f"несколько, до {f['max']}" if f["max"] else "несколько") if f["multiple"] else "один"
        lines.append(f"{pad}Поле «{f['title']}» ({how}{', обязательно' if f['required'] else ''}):")
        for o in f["options"]:
            lines.append(f"{pad}  {o['id']} {o['label']}")
            if o.get("fields"):
                lines.append(describe(o["fields"], depth + 2))
    return "\n".join(lines)


def _fallback(options: list[dict]) -> dict:
    return next((o for o in options if re.match(r"(друг|проч|ин(ое|ые)\b)", o["label"], re.I)), options[0])


def resolve(tree: list[dict], chosen: list[str]) -> tuple[list[dict], list[str]]:
    """Проверяет выбор ИИ по дереву: в каждом показанном поле — допустимые варианты, у одиночного
    поля — один, у множественного — не больше лимита; пустое обязательное поле получает «Другие»
    (или первый вариант) и попадает в список «проверить». Возвращает (поля с выбором, проверить)."""
    want = [str(c) for c in chosen]
    result, guessed = [], []

    def walk(fields: list[dict]) -> None:
        for f in fields:
            picked = sorted((o for o in f["options"] if o["id"] in want), key=lambda o: want.index(o["id"]))
            if f["multiple"]:
                picked = picked[:f["max"] or 5]
            else:
                picked = picked[:1]
            if not picked:
                if not f["required"]:
                    continue
                picked = [_fallback(f["options"])]
                if len(f["options"]) > 1:
                    guessed.append(f["title"])
            result.append({"field": f["title"], "ids": [o["id"] for o in picked], "labels": [o["label"] for o in picked]})
            for o in picked:
                walk(o.get("fields", []))

    walk(tree)
    return result, guessed


CHOICE_SCHEMA = {
    "type": "object",
    "additionalProperties": False,
    "required": ["kworks"],
    "properties": {"kworks": {"type": "array", "items": {
        "type": "object", "additionalProperties": False, "required": ["no", "ids"],
        "properties": {"no": {"type": "integer"},
                       "ids": {"type": "array", "items": {"type": "string"},
                               "description": "Номера выбранных вариантов во всех нужных полях"}}}}},
}

BATCH = 15


def choose(listings: list[dict], llm, system: str = "") -> int:
    """Подбирает варианты полей рубрики кворкам без них (listing["attributes"]). Возвращает, скольким."""
    todo: dict[int, list[dict]] = {}
    for l in listings:
        if l.get("attributes_cat") != l.get("category_id") and tree_for(l.get("category_id")):
            todo.setdefault(l["category_id"], []).append(l)
    done = 0
    for cat, items in todo.items():
        tree = tree_for(cat)
        text = describe(tree)
        for i in range(0, len(items), BATCH):
            chunk = items[i:i + BATCH]
            kworks = "\n\n".join(
                f"{n}. {l['title']}\n{l['description'][:400]}\nОбъём: {l.get('volume', '')}"
                + (f"\nПодсказки: {', '.join(l.get('attribute_hints') or [])}" if l.get("attribute_hints") else "")
                for n, l in enumerate(chunk, 1))
            data = llm.ask(
                "Это поля рубрики Kwork. Для каждого кворка выбери варианты по смыслу услуги: в каждом "
                "обязательном поле, которое показывается при сделанном выборе (вложенные поля открываются "
                "только под выбранным вариантом). Где можно несколько — отметь все, что правда относятся "
                "к услуге, но не больше лимита. Верни номера вариантов.\n\n"
                f"ПОЛЯ РУБРИКИ:\n{text}\n\nКВОРКИ:\n{kworks}",
                system=system, schema=CHOICE_SCHEMA, effort="low", max_tokens=8000)
            by_no = {k["no"]: k.get("ids", []) for k in data.get("kworks", [])}
            for n, l in enumerate(chunk, 1):
                attributes, guessed = resolve(tree, by_no.get(n, []))
                l.update(attributes=attributes, attributes_guessed=guessed, attributes_cat=cat)
                done += 1
    return done
