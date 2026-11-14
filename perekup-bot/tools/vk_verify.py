#!/usr/bin/env python3
"""Проверка групп ВК, найденных через Яндекс (yandex_vk_harvest.py → yandex_state.json), сервисным ключом приложения ВК
(владелец 14.11: ключ страницы под «Flood control»; просил беречь личный аккаунт — сервисный ключ действует от имени приложения,
ничего не публикует и ни во что не вступает; темп ≤ 2 запроса в секунду, на «слишком часто» — пауза).
  python3 tools/vk_verify.py OUT_DIR [--members 1000]
1) groups.getById: настоящее название, подписчики, открыта ли → 2) открытые от --members с автомобильным названием/описанием →
3) стена (40 постов): посты за неделю, доля «машина с ценой», импорт, новые — finder.judge → 4) субъект: по городам из объявлений,
иначе по городу в названии, иначе по фразе поиска → OUT_DIR/vk_gruppy_regiony.xlsx (Сводка · Группы · Отсеяны)."""
import json, sys, time
from collections import Counter, defaultdict
from datetime import datetime, timezone
from pathlib import Path
import re

import requests

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
import finder                                          # noqa: E402
from vk import CAR_NAME, post_text, _regions           # noqa: E402
from words import load_dictionary                      # noqa: E402

API, V = "https://api.vk.com/method/", "5.199"
S = requests.Session()
last = [0.0]


def log(*a):
    print(time.strftime("%H:%M:%S"), *a, flush=True)


def call(method, **params):
    for attempt in range(30):
        wait = last[0] + .5 - time.monotonic()           # не больше 2 запросов в секунду
        if wait > 0:
            time.sleep(wait)
        last[0] = time.monotonic()
        try:
            js = S.post(API + method, data={**params, "v": V}, timeout=40).json()
        except Exception as e:
            log("сеть:", e); time.sleep(10); continue
        err = js.get("error")
        if not err:
            return js["response"]
        if err.get("error_code") in (6, 9, 29):
            log(f"ВК просит притормозить ({err.get('error_msg')}) — пауза 120 с"); time.sleep(120); continue
        raise RuntimeError(f"ВК {err.get('error_code')}: {err.get('error_msg')}")
    raise RuntimeError("ВК не отвечает")


def main():
    out = Path(sys.argv[1])
    members = int(sys.argv[sys.argv.index("--members") + 1]) if "--members" in sys.argv else 1000
    hits = json.loads((out / "yandex_state.json").read_text())["hits"]
    st_path = out / "verify_state.json"
    st = json.loads(st_path.read_text()) if st_path.exists() else {"info": {}, "judged": {}}
    save = lambda: st_path.write_text(json.dumps(st, ensure_ascii=False))
    regs = _regions()
    alias = {code: [a for a in al if len(a) > 3 and not a.isascii()] for code, (_, al) in regs.items()}
    by_name = {name: code for code, (name, _) in regs.items()}
    d = load_dictionary(ROOT / "cars.yaml")
    # 1) кто это: название, подписчики (по 400 за запрос)
    keys = [k for k in hits if k not in st["info"]]
    for i in range(0, len(keys), 400):
        part = keys[i:i + 400]
        ids = ",".join(k[4:] if k.startswith("club") and k[4:].isdigit() else k for k in part)
        try:
            res = call("groups.getById", group_ids=ids, fields="members_count,description")
        except RuntimeError as e:                       # среди коротких имён есть не-группы — тогда по одному
            log("пачка:", e); res = {"groups": []}
            for k in part:
                try:
                    res["groups"] += call("groups.getById", group_ids=k[4:] if k.startswith("club") and k[4:].isdigit() else k,
                                          fields="members_count,description")["groups"]
                except RuntimeError:
                    st["info"][k] = None
        got = {str(g["id"]): g for g in res.get("groups", [])}
        sn = {(g.get("screen_name") or "").lower(): g for g in res.get("groups", [])}
        for k in part:
            g = got.get(k[4:]) if k.startswith("club") else sn.get(k.lower())
            st["info"][k] = None if not g else {"id": g["id"], "name": g.get("name", ""), "sn": g.get("screen_name") or "", "n": g.get("members_count") or 0,
                                                "closed": g.get("is_closed", 0), "dead": bool(g.get("deactivated")), "about": (g.get("description") or "")[:400]}
        save(); log(f"кто это: {min(i + 400, len(keys))}/{len(keys)}")
    # 2) кандидаты
    seen, cand = set(), []
    for k, g in st["info"].items():
        if not g or g["dead"] or g["closed"] or g["id"] in seen or g["n"] < members:
            continue
        if not CAR_NAME.search(f"{g['name']} {g['about'][:200]}"):
            continue
        seen.add(g["id"]); cand.append(k)
    log(f"открытых от {members} подписчиков с автомобильным названием/описанием: {len(cand)}")
    # 3) стены: execute по 10 стен за запрос
    todo = [k for k in cand if k not in st["judged"]]
    for i in range(0, len(todo), 10):
        part = todo[i:i + 10]
        code = "return [" + ",".join(f'API.wall.get({{"owner_id": -{st["info"][k]["id"]}, "count": 40}})' for k in part) + "];"
        try:
            walls = call("execute", code=code)
        except RuntimeError as e:
            log("стены:", e); walls = [None] * len(part)
        for k, w in zip(part, walls):
            g = st["info"][k]
            posts = [(datetime.fromtimestamp(it.get("date", 0), timezone.utc), post_text(it)) for it in ((w or {}).get("items", []) if w else [])
                     if not it.get("is_pinned")]
            st["judged"][k] = finder.judge(posts, d, title=g["name"], about=g["about"], subs=g["n"], min_subs=members, min_week=3, min_days=0)
        if i % 100 == 0:
            save(); log(f"стены: {min(i + 10, len(todo))}/{len(todo)} — подходят {sum(1 for j in st['judged'].values() if j['ok'])}")
    save()
    # 4) субъект и таблица
    rows, rej = [], []
    for k in cand:
        g, j = st["info"][k], st["judged"][k]
        low = f"{g['name']} {g['about'][:150]}".lower()
        code = by_name.get(j.get("region")) or next((c for c, al in alias.items()
                                                    if any(re.search(r"(?<![а-яё])" + re.escape(a) + r"(?![а-яё])", low) for a in al[:10])), None) \
            or max(hits[k]["regions"], key=hits[k]["regions"].get)
        row = dict(j, subject=regs[code][0], link=f"https://vk.com/{g['sn'] or 'club' + str(g['id'])}", title=g["name"])
        (rows if j["ok"] else rej).append(row)
    rows.sort(key=lambda r: (r["subject"], -r["week"], -r["subs"]))
    per = Counter(r["subject"] for r in rows)
    count = {name: per.get(name, 0) for name, _ in regs.values()}
    (out / "vk_gruppy_regiony.xlsx").write_bytes(finder.region_table(rows, [r for r in rej if r["car_share"] >= .3], count))
    log(f"ГОТОВО: проверено {len(cand)}, подходят {len(rows)} в {sum(1 for v in count.values() if v)} регионах → {out / 'vk_gruppy_regiony.xlsx'}")


if __name__ == "__main__":
    main()
