#!/usr/bin/env python3
"""Сбор групп ВКонтакте с продажей авто по всем субъектам РФ через официальный Yandex Search API (владелец 14.11: ВК ограничил
страницу «Flood control», обычные поисковики блокируют автоматические запросы). Ключ подставляет прокси окружения.
  python3 tools/yandex_vk_harvest.py OUT_DIR FOLDER_ID [--q 6] [--pages 1]
Для каждого региона словаря бота — фразы «барахолка авто / продажа авто / авторынок … + город site:vk.com» → из ссылок выдачи
(стена, альбом, обсуждение, сама группа) достаём группу → название из заголовка → регион: город в названии важнее фразы поиска.
Результат: OUT_DIR/vk_kandidaty.xlsx (Сводка · Группы). Подписчики и активность здесь НЕ проверены — это делает vk_regions.py,
когда ВК снимет ограничение. Промежуточное — OUT_DIR/yandex_state.json (перезапуск продолжает с того же места)."""
import base64, html, json, re, sys, time
from collections import defaultdict
from pathlib import Path

import requests

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
from vk import CAR_NAME, _regions          # noqa: E402

URL = "https://searchapi.api.cloud.yandex.net/v2/web/search"
PHRASES = ("барахолка авто {c}", "продажа авто {c}", "авторынок {c}", "авто с пробегом {c}", "авто объявления {c}", "купить авто бу {c}")
# не барахолки Б/У: запчасти, разбор, пригон под заказ, мото, такси, автосервис
BAD = re.compile(r"запчаст|разбор|авторазбор|шиномонтаж|автосервис|сто\b|ремонт|тюнинг|под заказ|из япон|из коре|из китая|пригон|"
                 r"мото|такси|автошкол|эвакуатор|грузоперевоз|аренда|прокат|страхован|дтп|подслушано|новости", re.I)
GID = re.compile(r"vk\.com/(?:wall|album|topic|photo|video|board|market)-(\d+)|vk\.com/(?:club|public|event)(\d+)|vk\.com/([A-Za-z][\w.]{2,40})(?:[/?#]|$)")
SKIP_NAMES = {"id", "feed", "search", "groups", "im", "friends", "app", "apps", "video", "audio", "music", "clips", "away", "login", "join",
              "about", "support", "terms", "dev", "blog", "jobs", "wall", "photo", "album", "topic", "market", "page", "note", "doc", "story"}


def log(*a):
    print(time.strftime("%H:%M:%S"), *a, flush=True)


def search(folder, text, page=0):
    body = {"query": {"searchType": "SEARCH_TYPE_RU", "queryText": text, "page": str(page)}, "folderId": folder, "responseFormat": "FORMAT_XML",
            "groupSpec": {"groupMode": "GROUP_MODE_DEEP", "groupsOnPage": "50", "docsInGroup": "1"}, "maxPassages": "1"}
    for attempt in range(5):
        try:
            r = requests.post(URL, json=body, timeout=60)
            js = r.json()
        except Exception as e:
            log("сеть:", e); time.sleep(5); continue
        if "rawData" in js:
            x = base64.b64decode(js["rawData"]).decode("utf-8", "ignore")
            out = []
            for d in re.findall(r"<doc[ >].*?</doc>", x, re.S):
                u = re.search(r"<url>([^<]+)", d)
                t = re.search(r"<title>(.*?)</title>", d, re.S)
                if u:
                    out.append((html.unescape(u.group(1)), html.unescape(re.sub("<[^>]+>", "", t.group(1))) if t else ""))
            return out
        log("Яндекс:", str(js)[:200]); time.sleep(5 * (attempt + 1))
    return []


def group_of(url):
    m = GID.search(url)
    if not m:
        return None
    if m.group(1) or m.group(2):
        return "club" + (m.group(1) or m.group(2))
    name = m.group(3).lower()
    if name in SKIP_NAMES or name.startswith(("id", "wall", "album", "topic", "photo", "video", "@")) and re.match(r"(id|wall|album|topic|photo|video)\d", name):
        return None
    return name


def clean_title(t):
    t = re.sub(r"\s*\|\s*ВКонтакте.*$", "", t)
    t = re.sub(r":\s*записи сообщества.*$|– \d+ фотограф.*$|Фотографии со страницы сообщества\s*", "", t)
    return t.strip(" «»\"|")


def main():
    out, folder = Path(sys.argv[1]), sys.argv[2]
    out.mkdir(parents=True, exist_ok=True)
    nq = int(sys.argv[sys.argv.index("--q") + 1]) if "--q" in sys.argv else 6
    pages = int(sys.argv[sys.argv.index("--pages") + 1]) if "--pages" in sys.argv else 1
    st_path = out / "yandex_state.json"
    st = json.loads(st_path.read_text()) if st_path.exists() else {"done": [], "hits": {}}
    regs = _regions()
    alias = {code: [a for a in al if len(a) > 3 and not a.isascii()] for code, (_, al) in regs.items()}
    asked = 0
    for n, (code, (name, _)) in enumerate(regs.items(), 1):
        if code in st["done"]:
            continue
        cities = alias[code][:2] or [name]
        qs = [p.format(c=c) + " site:vk.com" for c in cities for p in PHRASES][:nq]
        k = 0
        for q in qs:
            for page in range(pages):
                res = search(folder, q, page); asked += 1
                for url, title in res:
                    g = group_of(url)
                    if not g:
                        continue
                    h = st["hits"].setdefault(g, {"titles": [], "regions": {}, "urls": []})
                    t = clean_title(title)
                    if t and t not in h["titles"]:
                        h["titles"].append(t)
                    h["regions"][code] = h["regions"].get(code, 0) + 1
                    if len(h["urls"]) < 2:
                        h["urls"].append(url)
                    k += 1
                time.sleep(.4)
        st["done"].append(code)
        st_path.write_text(json.dumps(st, ensure_ascii=False))
        log(f"{n}/{len(regs)} {name}: запросов {len(qs) * pages}, ссылок на группы {k}, всего групп {len(st['hits'])}")
    # регион группы: город из названия важнее фразы поиска; отбор по названию
    rows = []
    for g, h in st["hits"].items():
        title = max(h["titles"], key=len) if h["titles"] else ""
        low = " ".join(h["titles"]).lower()
        by_name = [code for code, al in alias.items() if any(re.search(r"(?<![а-яё])" + re.escape(a) + r"(?![а-яё])", low) for a in al[:10])]
        code = by_name[0] if by_name else max(h["regions"], key=h["regions"].get)
        car = bool(CAR_NAME.search(low)); bad = bool(BAD.search(low))
        rows.append({"subject": regs[code][0], "link": f"https://vk.com/{g}", "title": title, "hits": sum(h["regions"].values()),
                     "city_in_name": "да" if by_name else "", "fit": "подходит по названию" if car and not bad else
                     ("не барахолка (запчасти/сервис/пригон…)" if bad else "название не про авто"), "example": h["urls"][0] if h["urls"] else ""})
    from openpyxl import Workbook
    from openpyxl.styles import Font, PatternFill
    wb = Workbook(); s = wb.active; s.title = "Сводка"
    good = [r for r in rows if r["fit"] == "подходит по названию"]
    per = defaultdict(int)
    for r in good:
        per[r["subject"]] += 1
    s.append(["Субъект", "Групп с продажей авто (по названию)"])
    for name, _ in sorted(((nm, 0) for nm, _ in regs.values()), key=lambda x: -per[x[0]]):
        s.append([name, per[name]])
        if not per[name]:
            s.cell(s.max_row, 2).fill = PatternFill("solid", fgColor="FCE4D6")
    s.append(["Всего", len(good)])
    s.column_dimensions["A"].width = 40; s.column_dimensions["B"].width = 34
    cols = [("subject", "Субъект"), ("link", "Ссылка"), ("title", "Название (из выдачи Яндекса)"), ("city_in_name", "Город в названии"),
            ("hits", "Сколько раз нашлась"), ("fit", "Отбор по названию"), ("example", "Пример ссылки")]
    for title, data in (("Группы", sorted(good, key=lambda r: (r["subject"], -r["hits"]))), ("Отсеяны", [r for r in rows if r not in good])):
        ws = wb.create_sheet(title)
        ws.append([c[1] for c in cols])
        for r in data:
            ws.append([r[k] for k, _ in cols])
        for col, w in zip("ABCDEFG", (30, 34, 50, 12, 12, 30, 60)):
            ws.column_dimensions[col].width = w
        ws.freeze_panes = "A2"; ws.auto_filter.ref = ws.dimensions
    for ws in wb.worksheets:
        for c in ws[1]:
            c.font = Font(bold=True)
    wb.save(out / "vk_kandidaty.xlsx")
    log(f"ГОТОВО: запросов {asked}, групп всего {len(rows)}, подходят по названию {len(good)} → {out / 'vk_kandidaty.xlsx'}")


if __name__ == "__main__":
    main()
