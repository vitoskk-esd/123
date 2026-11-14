#!/usr/bin/env python3
"""Поиск автомобильных сообществ ВКонтакте по всем субъектам РФ — запускается не в боте, а отсюда (владелец 14.11: «мне нужно,
чтобы именно ты занялся поиском»). Ключ ВК в скрипте не нужен: его подставляет прокси окружения (заголовок Authorization).
  python3 tools/vk_regions.py OUT_DIR [--per 100] [--members 1000]
Шаги (каждый сохраняется в OUT_DIR/state.json — после «Flood control» или перезапуска продолжаем с того же места):
  1) поиск: «авто / авторынок / продажа авто / авто с пробегом / барахолка + город» по городам каждого региона словаря бота;
  2) открытые группы с автомобильным названием → подписчики (groups.getById);
  3) от --members подписчиков → стена (40 постов): посты за неделю, доля «машина с ценой», импорт, новые авто — finder.judge;
  4) по каждому региону до --per лучших → OUT_DIR/vk_regiony.xlsx (Сводка · Группы · Отсеяны)."""
import json, sys, time
from datetime import datetime, timezone
from pathlib import Path

import requests

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
import finder                                          # noqa: E402
from vk import CAR_NAME, post_text, _regions           # noqa: E402
from words import load_dictionary                      # noqa: E402

API, V = "https://api.vk.com/method/", "5.199"
WORDS = ("авто", "авторынок", "продажа авто", "авто с пробегом", "барахолка")
S = requests.Session()
last = [0.0]


def log(*a):
    print(time.strftime("%H:%M:%S"), *a, flush=True)


def call(method, **params):
    """Один запрос к ВК: 3 в секунду; «Flood control»/«слишком часто» — ждём и повторяем; ключ ставит прокси."""
    for attempt in range(60):
        wait = last[0] + .36 - time.monotonic()
        if wait > 0:
            time.sleep(wait)
        last[0] = time.monotonic()
        try:
            js = S.post(API + method, data={**params, "v": V}, timeout=40).json()
        except Exception as e:
            log("сеть:", e); time.sleep(10); continue
        err = js.get("error")
        if not err:
            return js
        if err.get("error_code") in (6, 9, 29):
            pause = 60 if err.get("error_code") != 29 else 600
            log(f"ВК: {err.get('error_msg')} — жду {pause} с"); time.sleep(pause); continue
        raise RuntimeError(f"ВК {err.get('error_code')}: {err.get('error_msg')}")
    raise RuntimeError("ВК не отвечает час подряд")


def many(method, plist, per=25):
    """execute-пачки по per вызовов; ошибка внутри пачки → None (если не прошёл ни один вызов — показываем ошибку ВК)."""
    out = []
    for i in range(0, len(plist), per):
        code = "return [" + ",".join(f"API.{method}({json.dumps(p, ensure_ascii=False)})" for p in plist[i:i + per]) + "];"
        js = call("execute", code=code)
        resp, errs = js.get("response") or [], js.get("execute_errors") or []
        if resp and all(r is False for r in resp) and errs:
            e = errs[0]
            if e.get("error_code") in (6, 9):
                log("ВК внутри пачки: flood control — жду 60 с"); time.sleep(60)
                out += many(method, plist[i:i + per], per); continue
            raise RuntimeError(f"ВК {e.get('error_code')}: {e.get('method')}: {e.get('error_msg')}")
        out += [r if r is not False else None for r in resp]
    return out


def main():
    out = Path(sys.argv[1]); out.mkdir(parents=True, exist_ok=True)
    per = int(sys.argv[sys.argv.index("--per") + 1]) if "--per" in sys.argv else 100
    members = int(sys.argv[sys.argv.index("--members") + 1]) if "--members" in sys.argv else 1000
    st_path = out / "state.json"
    st = json.loads(st_path.read_text()) if st_path.exists() else {"search_done": [], "where": {}, "groups": {}, "judged": {}}
    save = lambda: st_path.write_text(json.dumps(st, ensure_ascii=False))
    regs = _regions()
    d = load_dictionary(ROOT / "cars.yaml")
    # 1) поиск по регионам
    for n, (code, (name, aliases)) in enumerate(regs.items(), 1):
        if code in st["search_done"]:
            continue
        places = [a for a in aliases if len(a) > 3 and not a.isascii()][:5]
        qs = [f"{w} {p}" for p in places for w in WORDS]
        res = many("groups.search", [{"q": q, "country_id": 1, "count": 100} for q in qs])
        k = 0
        for r in res:
            for g in (r or {}).get("items", []):
                if g.get("is_closed") or not CAR_NAME.search(g.get("name", "")):
                    continue
                gid, low = str(g["id"]), g.get("name", "").lower()
                if gid not in st["where"] or any(a in low for a in aliases[:8] if len(a) > 3):
                    st["where"][gid] = code; k += 1
        st["search_done"].append(code); save()
        log(f"поиск {n}/{len(regs)} {name}: фраз {len(qs)}, ответов {sum(r is not None for r in res)}, групп +{k} (всего {len(st['where'])})")
    # 2) подписчики
    todo = [g for g in st["where"] if g not in st["groups"]]
    for i in range(0, len(todo), 400):
        res = call("groups.getById", group_ids=",".join(todo[i:i + 400]), fields="members_count,description")["response"]
        for g in (res.get("groups", []) if isinstance(res, dict) else res):
            st["groups"][str(g["id"])] = {"n": g.get("members_count") or 0, "name": g.get("name", ""), "sn": g.get("screen_name") or "",
                                          "about": (g.get("description") or "")[:500], "dead": bool(g.get("deactivated"))}
        save(); log(f"подписчики: {min(i + 400, len(todo))}/{len(todo)}")
    big = [gid for gid, g in st["groups"].items() if g["n"] >= members and not g["dead"]]
    log(f"от {members} подписчиков: {len(big)} из {len(st['groups'])}")
    # 3) стены
    todo = [gid for gid in big if gid not in st["judged"]]
    for i in range(0, len(todo), 50):
        part = todo[i:i + 50]
        walls = many("wall.get", [{"owner_id": -int(gid), "count": 40} for gid in part], 10)
        for gid, res in zip(part, walls):
            g = st["groups"][gid]
            posts = [(datetime.fromtimestamp(it.get("date", 0), timezone.utc), post_text(it)) for it in (res or {}).get("items", [])
                     if not it.get("is_pinned")]
            j = finder.judge(posts, d, title=g["name"], about=g["about"], subs=g["n"], min_subs=members, min_week=3, min_days=0)
            st["judged"][gid] = j
        save()
        ok = sum(1 for j in st["judged"].values() if j["ok"])
        log(f"стены: {min(i + 50, len(todo))}/{len(todo)} — подходят {ok}")
    # 4) таблица
    rows, rej, by = [], [], {}
    for gid, j in st["judged"].items():
        g = st["groups"][gid]
        row = dict(j, link=f"https://vk.com/{g['sn'] or 'club' + gid}", title=g["name"], subject=regs[st["where"][gid]][0])
        (rows if j["ok"] else rej).append(row)
    rows.sort(key=lambda r: (-r["week"], -r["subs"]))
    for r in rows:
        if len(by.setdefault(r["subject"], [])) < per:
            by[r["subject"]].append(r)
    final = [r for name, _ in regs.values() for r in by.get(name, [])]
    count = {name: len(by.get(name, [])) for name, _ in regs.values()}
    (out / "vk_regiony.xlsx").write_bytes(finder.region_table(final, [r for r in rej if r["car_share"] >= .3], count))
    log(f"ГОТОВО: {len(final)} групп в {sum(1 for v in count.values() if v)} регионах → {out / 'vk_regiony.xlsx'}")


if __name__ == "__main__":
    main()
