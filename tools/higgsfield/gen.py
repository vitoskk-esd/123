#!/usr/bin/env python3
"""Кадры и живые вставки рилса через Higgsfield по заданиям <рилс>/hf_jobs.json (designs → brand: аватарка и шапка → images → clips).
Без --go ничего не отправляет и ничего не списывает: печатает, что будет сгенерировано.
  <python с higgsfield-client> tools/higgsfield/gen.py reels/arb-story-20                 # план, бесплатно
  <python с higgsfield-client> tools/higgsfield/gen.py reels/arb-story-20 --go f01,f03    # ПЛАТНО: только эти задания
Кадры — xai/grok-imagine-image-2.0 (картинки Арбузова и фона как образцы), вставки — bytedance/seedance-2.5/image-to-video
из готового кадра. Результат: <рилс>/hf/<id>.png|.mp4 и hf/log.json (id запросов, без ключа). Готовые файлы повторно не генерируются.
Ключ — HF_KEY (key-id:key-secret) из окружения или .env.local; скрипт его не печатает.
"""
import json, os, sys, time
from pathlib import Path

from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / ".env.local", override=False)

import httpx
import higgsfield_client
from higgsfield_client.exceptions import HiggsfieldClientError

IMG, VID = "xai/grok-imagine-image-2.0", "bytedance/seedance-2.5/image-to-video"


def first_url(x):
    """Первая ссылка на результат в ответе (images[0].url, video.url и т. п.)."""
    if isinstance(x, str): return x if x.startswith("http") else None
    if isinstance(x, dict):
        for k in ("url", "images", "image", "video", "videos", "output"):
            if k in x and (u := first_url(x[k])): return u
        for v in x.values():
            if (u := first_url(v)): return u
    if isinstance(x, list):
        for v in x:
            if (u := first_url(v)): return u
    return None


def main():
    reel = (ROOT / sys.argv[1]).resolve(); go = sys.argv[sys.argv.index("--go") + 1].split(",") if "--go" in sys.argv else []
    J = json.load(open(reel / "hf_jobs.json", encoding="utf-8")); out = reel / "hf"; out.mkdir(exist_ok=True)
    logf = out / "log.json"; log = json.load(open(logf)) if logf.exists() else {}
    jobs = [("img", j) for j in J.get("designs", []) + J.get("brand", []) + J["images"]] + [("vid", j) for j in J["clips"]]
    for kind, j in jobs:
        dst = out / (j["id"] + (".png" if kind == "img" else ".mp4"))
        what = "кадр" if kind == "img" else "видео %d с" % j["duration"]
        state = "готово" if dst.exists() else ("В РАБОТУ" if j["id"] in go else "ждёт")
        print(f"{j['id']}  {what}  [{state}]  {j['prompt'][:70]}…")
    if not go: print("\nПлан. Ничего не отправлено, деньги не списаны. Запуск: --go id1,id2"); return
    if not os.environ.get("HF_KEY"): sys.exit("HF_KEY не задан")
    os.environ.setdefault("HF_CREDENTIALS", os.environ["HF_KEY"])
    ups = log.setdefault("_uploads", {})

    def upload(rel):
        if rel == "@design":   # образец персонажа — дизайн, который выбрал владелец (поле "design" в hf_jobs.json)
            if not J.get("design"): raise SystemExit("Дизайн Арбузова не выбран: впишите путь в \"design\" в hf_jobs.json")
            rel = J["design"]
        if rel not in ups: ups[rel] = higgsfield_client.upload_file(ROOT / rel); print(f"  загружен образец {rel}")
        return ups[rel]

    for kind, j in jobs:
        dst = out / (j["id"] + (".png" if kind == "img" else ".mp4"))
        if j["id"] not in go or dst.exists(): continue
        if kind == "img":
            style = J["style"] if j.get("ar", "9:16") == "9:16" else J["style"].replace(J.get("style_vertical", ""), "")   # для аватарки и шапки — без «вертикально, персонаж внизу»
            app, args = IMG, dict(prompt=style + " " + j["prompt"], image_urls=[upload(r) for r in j["refs"]], aspect_ratio=j.get("ar", "9:16"), resolution="2k", quality="medium")
        else:
            src = out / (j["from"] + ".png")
            if not src.exists(): print(f"{j['id']}: нет кадра {src.name}, пропуск"); continue
            app, args = VID, dict(prompt=j["prompt"], image_url=upload(str(src.relative_to(ROOT))), duration=j["duration"], resolution="720p", generate_audio=False)
        t0 = time.time(); print(f"{j['id']}: отправляю в {app}")
        try:
            res = higgsfield_client.subscribe(app, arguments=args, on_enqueue=lambda rid, i=j["id"]: log.setdefault(i, {}).update(request_id=rid))
        except HiggsfieldClientError as e:
            print(f"{j['id']}: ошибка API — {type(e).__name__}: {e}"); break
        st = res.get("status") if isinstance(res, dict) else None
        url = first_url(res)
        if st not in (None, "completed") or not url:
            print(f"{j['id']}: не получилось (статус {st}); за неудачные и NSFW деньги не списываются"); log.setdefault(j["id"], {})["status"] = st; continue
        dst.write_bytes(httpx.get(url, timeout=300, follow_redirects=True).content)
        log.setdefault(j["id"], {}).update(status="completed", app=app, sec=round(time.time() - t0))
        print(f"{j['id']}: готово за {time.time() - t0:.0f} с → {dst.relative_to(ROOT)}")
        json.dump(log, open(logf, "w"), ensure_ascii=False, indent=1)
    json.dump(log, open(logf, "w"), ensure_ascii=False, indent=1)


if __name__ == "__main__":
    main()
