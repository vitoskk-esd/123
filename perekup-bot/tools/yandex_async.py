#!/usr/bin/env python3
"""Широкий проход по группам ВК с продажей авто через ОТЛОЖЕННЫЙ режим Yandex Search API (25 ₽ за 1000 запросов вместо 480 ₽,
владелец 15.11). Ключи подставляет прокси (searchapi.* и operation.api.cloud.yandex.net).
  python3 tools/yandex_async.py OUT_DIR FOLDER_ID [--cities 6] [--pages 3]
Шаг 1 — отправить все запросы (searchAsync), id операций — в OUT_DIR/async_state.json; шаг 2 — забрать готовые результаты
(operations/{id}) и сложить группы в OUT_DIR/yandex_state.json (тот же формат, что у yandex_vk_harvest.py) — дальше vk_verify.py."""
import base64, json, re, sys, time
from pathlib import Path

import requests

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(ROOT / "tools"))
from vk import _regions                                    # noqa: E402
from yandex_vk_harvest import group_of, clean_title, log  # noqa: E402
import html as H                                           # noqa: E402

SUBMIT = "https://searchapi.api.cloud.yandex.net/v2/web/searchAsync"
OPS = "https://operation.api.cloud.yandex.net/operations/"
PHRASES = ("барахолка авто {c}", "продажа авто {c}", "авторынок {c}", "авто с пробегом {c}", "авто объявления {c}", "купить авто бу {c}",
           "продам авто {c}", "авто бу {c}")


def main():
    out, folder = Path(sys.argv[1]), sys.argv[2]
    ncity = int(sys.argv[sys.argv.index("--cities") + 1]) if "--cities" in sys.argv else 6
    pages = int(sys.argv[sys.argv.index("--pages") + 1]) if "--pages" in sys.argv else 3
    ap = out / "async_state.json"
    st = json.loads(ap.read_text()) if ap.exists() else {"ops": {}, "done": []}     # ops: id → [код региона, фраза, страница]
    yp = out / "yandex_state.json"
    ys = json.loads(yp.read_text()) if yp.exists() else {"done": [], "hits": {}}
    regs = _regions()
    plan = []
    for code, (name, aliases) in regs.items():
        cities = [a for a in aliases if len(a) > 3 and not a.isascii()][:ncity] or [name]
        plan += [(code, p.format(c=c) + " site:vk.com", pg) for c in cities for p in PHRASES for pg in range(pages)]
    sent = {(v[0], v[1], v[2]) for v in st["ops"].values()}
    todo = [x for x in plan if x not in sent]
    log(f"план: {len(plan)} запросов, отправить ещё {len(todo)} (≈ {len(plan) * 25 / 1000:.0f} ₽ за весь план)")
    s = requests.Session()
    for i, (code, q, pg) in enumerate(todo, 1):
        body = {"query": {"searchType": "SEARCH_TYPE_RU", "queryText": q, "page": str(pg)}, "folderId": folder, "responseFormat": "FORMAT_XML",
                "groupSpec": {"groupMode": "GROUP_MODE_DEEP", "groupsOnPage": "50", "docsInGroup": "1"}}
        for attempt in range(5):
            try:
                js = s.post(SUBMIT, json=body, timeout=60).json()
            except Exception as e:
                log("сеть:", e); time.sleep(5); continue
            if js.get("id"):
                st["ops"][js["id"]] = [code, q, pg]; break
            log("Яндекс:", str(js)[:160]); time.sleep(5 * (attempt + 1))
        time.sleep(.15)
        if i % 200 == 0:
            ap.write_text(json.dumps(st, ensure_ascii=False)); log(f"отправлено {i}/{len(todo)}")
    ap.write_text(json.dumps(st, ensure_ascii=False))
    # шаг 2 — забираем готовые
    for rnd in range(60):
        left = [op for op in st["ops"] if op not in st["done"]]
        if not left:
            break
        got = 0
        for op in left:
            try:
                js = s.get(OPS + op, timeout=60).json()
            except Exception as e:
                log("сеть:", e); time.sleep(3); continue
            time.sleep(.1)
            if not js.get("done"):
                continue
            code = st["ops"][op][0]
            raw = (js.get("response") or {}).get("rawData")
            if raw:
                x = base64.b64decode(raw).decode("utf-8", "ignore")
                for d in re.findall(r"<doc[ >].*?</doc>", x, re.S):
                    u = re.search(r"<url>([^<]+)", d); t = re.search(r"<title>(.*?)</title>", d, re.S)
                    g = group_of(H.unescape(u.group(1))) if u else None
                    if not g:
                        continue
                    h = ys["hits"].setdefault(g, {"titles": [], "regions": {}, "urls": []})
                    tt = clean_title(H.unescape(re.sub("<[^>]+>", "", t.group(1)))) if t else ""
                    if tt and tt not in h["titles"] and len(h["titles"]) < 6:
                        h["titles"].append(tt)
                    h["regions"][code] = h["regions"].get(code, 0) + 1
                    if len(h["urls"]) < 2:
                        h["urls"].append(H.unescape(u.group(1)))
            st["done"].append(op); got += 1
            if len(st["done"]) % 300 == 0:
                ap.write_text(json.dumps(st, ensure_ascii=False)); yp.write_text(json.dumps(ys, ensure_ascii=False))
                log(f"забрано {len(st['done'])}/{len(st['ops'])} — групп всего {len(ys['hits'])}")
        ap.write_text(json.dumps(st, ensure_ascii=False)); yp.write_text(json.dumps(ys, ensure_ascii=False))
        log(f"круг {rnd + 1}: забрано {len(st['done'])}/{len(st['ops'])}, групп всего {len(ys['hits'])}")
        if got == 0:
            time.sleep(60)
    log(f"ГОТОВО: операций {len(st['ops'])}, забрано {len(st['done'])}, групп всего {len(ys['hits'])}")


if __name__ == "__main__":
    main()
