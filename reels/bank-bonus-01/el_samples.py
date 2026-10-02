#!/usr/bin/env python3
"""Подбор голоса ElevenLabs для ролика. Нужен ключ в ELEVENLABS_API_KEY.

python3 el_samples.py list [N]      превью N русских мужских голосов из библиотеки
                                    -> out/el_samples/NN_имя.mp3 + index.txt (бесплатно)
python3 el_samples.py try ID [ID…]  отрывок из сценария выбранными голосами
                                    -> out/el_samples/try_имя.mp3 (~150 символов на голос)

ID — voice_id из index.txt. Голос из библиотеки сначала добавляется в аккаунт
(«My Voices»), иначе API им не озвучивает. Потом весь ролик:
ELEVENLABS_VOICE_ID=<id> VOICE_ENGINE=elevenlabs ./build.sh
"""
import os
import re
import sys

import requests

import voice as V

API = "https://api.elevenlabs.io/v1"
H = {"xi-api-key": os.environ.get("ELEVENLABS_API_KEY", "")}
DST = os.path.join(V.OUT, "el_samples")
EXCERPT = ("Стоп! Банки прямо сейчас раздают деньги, и почти никто их не забирает. "
           "А теперь честно: ты платишь за обслуживание?")
safe = lambda s: re.sub(r"[^\w-]+", "_", s).strip("_")[:40]


def shared(n):
    r = requests.get(f"{API}/shared-voices", headers=H, timeout=60, params={
        "language": "ru", "gender": "male", "page_size": n, "sort": "usage_character_count_1y"})
    r.raise_for_status()
    return r.json()["voices"]


def cmd_list(n=20):
    os.makedirs(DST, exist_ok=True)
    rows = []
    for i, v in enumerate(shared(n), 1):
        name = f"{i:02d}_{safe(v['name'])}"
        if v.get("preview_url"):
            with open(os.path.join(DST, name + ".mp3"), "wb") as f:
                f.write(requests.get(v["preview_url"], timeout=60).content)
        rows.append(f"{name}\t{v['voice_id']}\t{v['public_owner_id']}\t{v.get('age')}\t"
                    f"{v.get('descriptive')}\t{v.get('use_case')}\t{v.get('description', '')[:80]}")
    with open(os.path.join(DST, "index.txt"), "w") as f:
        f.write("\n".join(rows) + "\n")
    print("\n".join(rows))


def ensure_in_account(voice_id):
    """Голос из библиотеки -> «My Voices». Возвращает voice_id, которым можно озвучивать."""
    mine = requests.get(f"{API}/voices", headers=H, timeout=60).json().get("voices", [])
    if any(v["voice_id"] == voice_id for v in mine):
        return voice_id, next(v["name"] for v in mine if v["voice_id"] == voice_id)
    idx = open(os.path.join(DST, "index.txt")).read().splitlines()
    row = next(r.split("\t") for r in idx if r.split("\t")[1] == voice_id)
    r = requests.post(f"{API}/voices/add/{row[2]}/{voice_id}", headers=H, timeout=60,
                      json={"new_name": row[0][3:]})
    r.raise_for_status()
    return r.json()["voice_id"], row[0]


def cmd_try(ids):
    os.makedirs(DST, exist_ok=True)
    for vid in ids:
        vid, name = ensure_in_account(vid)
        path = os.path.join(DST, f"try_{safe(name)}.mp3")
        V.elevenlabs(EXCERPT, path, voice=vid)
        print(path, vid)


if __name__ == "__main__":
    if not H["xi-api-key"]:
        sys.exit("нет ELEVENLABS_API_KEY")
    if len(sys.argv) > 1 and sys.argv[1] == "try":
        cmd_try(sys.argv[2:])
    else:
        cmd_list(int(sys.argv[2]) if len(sys.argv) > 2 else 20)
