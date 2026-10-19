#!/usr/bin/env python3
"""Кадры и живые вставки рилса через Higgsfield по заданиям <рилс>/hf_jobs.json (designs → brand: аватарка и шапка → images → clips).
Без --go ничего не отправляет и ничего не списывает: печатает, что будет сгенерировано.
  <python с higgsfield-client> tools/higgsfield/gen.py reels/arb-story-20                 # план, бесплатно
  <python с higgsfield-client> tools/higgsfield/gen.py reels/arb-story-20 --go f01,f03    # ПЛАТНО: только эти задания
Кадры — xai/grok-imagine-image-2.0 (картинки Арбузова и фона как образцы), вставки — bytedance/seedance-2.5/image-to-video
или модель из "clip_app" (Kling 2.5 Turbo Pro: 5 с ≈ $0,30 против ≈ $1,85 за 4 с у Seedance 720p — по /estimate 15.10) из готового кадра. Результат: <рилс>/hf/<id>.png|.mp4 и hf/log.json (id запросов, без ключа). Готовые файлы повторно не генерируются.
Ключ — HF_KEY (key-id:key-secret) из окружения или .env.local; скрипт его не печатает.
"""
import json, os, re, sys, time
from pathlib import Path

from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / ".env.local", override=False)

import httpx
import higgsfield_client
from higgsfield_client.exceptions import HiggsfieldClientError

IMG, VID = "xai/grok-imagine-image-2.0", "bytedance/seedance-2.5/image-to-video"
QWEN = "alibaba/qwen-image-3/edit"   # вторая модель картинок (проба детализации 16.10); выбор — "app" у задания или "img_app" у рилса


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


def save(log, f):
    json.dump(log, open(f, "w"), ensure_ascii=False, indent=1)


def retry(fn, *a):
    """Сеть через прокси иногда рвёт соединение (15.10 так потеряли номер оплаченного запроса c09) — повторяем, а не падаем."""
    for k in range(8):
        try: return fn(*a)
        except (httpx.TransportError, httpx.HTTPStatusError) as e:
            if k == 7: raise
            print(f"  сеть: {type(e).__name__}, повтор через {5 * (k + 1)} с", flush=True); time.sleep(5 * (k + 1))


def wait(rid):
    """Ждём готовности запроса по его номеру; ответ — как у subscribe (dict со status и ссылками)."""
    while not isinstance(retry(higgsfield_client.status, rid), higgsfield_client.DONE_STATUSES): time.sleep(4)
    return retry(higgsfield_client.result, rid)


# Плавность (владелец 19.10 о пробе v_box: «движения не плавные, когда кладёт вещи — очень размыты»). Замер reels/arb-kit/clip_qa.py:
# каждый второй кадр повторял предыдущий (анимация «на двойках», 12 рисунков в секунду — её вызвали слова «hand-drawn animation»),
# а 4 действия за 8 с дали резкие взмахи рук со смазом. Поэтому: действия — списком "beats", не чаще одного на BEAT_S секунд,
# запрещённые слова в промпте не пропускаем, к каждому промпту Kling 3.0 добавляем MOTION.
BEAT_S = 3.0
BANNED = ("hand-drawn animation", "hand drawn animation", "cartoon animation", "limited animation", "stop motion", "fast", "quickly")
MOTION = ("Motion: smooth, fluid, continuous movement with a new unique drawing on every frame at full 24 fps — not limited animation, "
          "not animated on twos, no held or repeated frames. Slow, deliberate, unhurried movements; hands move calmly along short clear arcs "
          "and never flail; objects and hands stay crisp and fully drawn while moving — no motion blur, no smearing, no morphing, no ghosting. "
          "Each action is finished before the next one starts. The final second is a calm hold with subtle breathing and blinking, not a freeze. "
          "Keep the exact art style, character design, colors and lighting of the start frame. No text.")


def motion_check(j):
    """Ошибка задания клипа Kling 3.0 или None: на действие — не меньше BEAT_S секунд, без слов, которые ломают плавность."""
    beats = j.get("beats", [])
    if beats and j["duration"] < BEAT_S * len(beats):
        return f"{len(beats)} действия за {j['duration']} с — нужно не меньше {BEAT_S * len(beats):.0f} с (по {BEAT_S:.0f} с на действие) или меньше действий"
    text = (j.get("prompt", "") + " " + " ".join(beats)).lower()
    if (w := next((b for b in BANNED if re.search(rf"\b{b}\b", text)), None)): return f"в промпте «{w}» — даёт рывки/смаз, уберите"
    return None


def motion_prompt(j):
    """Промпт Kling 3.0: сцена + действия по порядку («beats», медленно, по одному) + правила плавности MOTION."""
    p = j.get("prompt", "").strip()
    if j.get("beats"): p += " Actions, slowly and strictly one after another: " + " Then ".join(f"{b.rstrip('.')}." for b in j["beats"])
    return (p + " " + MOTION).strip()


def main():
    reel = (ROOT / sys.argv[1]).resolve(); go = sys.argv[sys.argv.index("--go") + 1].split(",") if "--go" in sys.argv else []
    J = json.load(open(reel / "hf_jobs.json", encoding="utf-8")); out = reel / "hf"; out.mkdir(exist_ok=True)
    logf = out / "log.json"; log = json.load(open(logf)) if logf.exists() else {}
    jobs = [("img", j) for j in J.get("designs", []) + J.get("brand", []) + J["images"]] + [("vid", j) for j in J["clips"]]
    for kind, j in jobs:
        dst = out / (j["id"] + (".png" if kind == "img" else ".mp4"))
        what = "кадр" if kind == "img" else "видео %d с" % j["duration"]
        state = "готово" if dst.exists() else ("В РАБОТУ" if j["id"] in go else "ждёт")
        warn = motion_check(j) if kind == "vid" and j.get("app", J.get("clip_app", VID)).startswith("kling-video/v3") else None
        print(f"{j['id']}  {what}  [{state}]  {j['prompt'][:70]}…" + (f"\n   ⚠ {warn}" if warn else ""))
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
            if j.get("raw"): style = ""   # точечная правка готового кадра («положи гречку в тарелку») — без длинного стилевого префикса
            app = j.get("app", J.get("img_app", IMG)); refs = [upload(r) for r in j["refs"]]
            if app == QWEN:   # Qwen Image 3 edit: до 3 образцов, без quality; ≈ $0,075 против $0,09 у Grok (по /estimate 16.10)
                args = dict(prompt=style + " " + j["prompt"], image_urls=refs[:3], aspect_ratio=j.get("ar", "9:16"), resolution="2k",
                            negative_prompt="text, letters, words, garbled writing, watermark, deformed hands, extra fingers, blurry")
            else:
                args = dict(prompt=style + " " + j["prompt"], image_urls=refs, aspect_ratio=j.get("ar", "9:16"), resolution="2k", quality="medium")
        else:
            src = out / (j["from"] + ".png")
            if not src.exists(): print(f"{j['id']}: нет кадра {src.name}, пропуск"); continue
            app = j.get("app", J.get("clip_app", VID)); url = upload(str(src.relative_to(ROOT)))
            if app.startswith("kling-video/v3"):   # Kling 3.0 (17.10): первый + последний кадр — действие задаём ключевыми кадрами, а не надеждой на промпт
                if (err := motion_check(j)): print(f"{j['id']}: {err} — не отправляю"); continue
                args = dict(prompt=motion_prompt(j), image_url=url, duration=j["duration"], sound="off")
                if j.get("to"):
                    dst_to = out / (j["to"] + ".png")
                    if not dst_to.exists(): print(f"{j['id']}: нет конечного кадра {dst_to.name}, пропуск"); continue
                    args["last_image_url"] = upload(str(dst_to.relative_to(ROOT)))
            elif app == VID: args = dict(prompt=j["prompt"], image_url=url, duration=j["duration"], resolution="720p", generate_audio=False)
            else: args = dict(prompt=j["prompt"], image_url=url, duration=j["duration"], negative_prompt="text, letters, watermark, deformed face, extra limbs")
        t0 = time.time(); rec = log.setdefault(j["id"], {})
        try:
            if rec.get("request_id") and rec.get("status") not in ("completed", "failed", "nsfw", "canceled"):
                rid = rec["request_id"]; print(f"{j['id']}: продолжаю ждать запрос {rid} (уже оплачен, повторно не отправляю)")
            else:
                print(f"{j['id']}: отправляю в {app}")
                rid = higgsfield_client.submit(app, arguments=args).request_id
                rec.update(request_id=rid, app=app, status="queued"); save(log, logf)   # номер запроса — на диск сразу
            res = wait(rid)
        except HiggsfieldClientError as e:
            print(f"{j['id']}: ошибка API — {type(e).__name__}: {e}"); save(log, logf); break
        st = res.get("status") if isinstance(res, dict) else None
        url = first_url(res)
        if st not in (None, "completed") or not url:
            print(f"{j['id']}: не получилось (статус {st}); за неудачные и NSFW деньги не списываются"); log.setdefault(j["id"], {})["status"] = st; continue
        dst.write_bytes(retry(lambda: httpx.get(url, timeout=300, follow_redirects=True).raise_for_status().content))
        log.setdefault(j["id"], {}).update(status="completed", app=app, sec=round(time.time() - t0))
        print(f"{j['id']}: готово за {time.time() - t0:.0f} с → {dst.relative_to(ROOT)}")
        json.dump(log, open(logf, "w"), ensure_ascii=False, indent=1)
    json.dump(log, open(logf, "w"), ensure_ascii=False, indent=1)


if __name__ == "__main__":
    main()
