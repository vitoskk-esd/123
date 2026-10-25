"""Выгрузка готовых кворков одним архивом: таблица для Excel, JSON для загрузчика и обложки."""

from __future__ import annotations

import csv
import io
import json
import zipfile

from . import db

HOW_TO = """КАК ВЫЛОЖИТЬ КВОРКИ

kworks.csv — все кворки таблицей (открывается в Excel / Google Таблицах).
covers/    — обложки 660×440, имя файла = колонка «id».
listings.json — тот же список для автозагрузчика.

Вручную: Kwork → «Создать кворк», копируйте поля из таблицы, загрузите обложку.

Автоматически (на своём компьютере, нужен Python):
  python -m kwork_agent login            # один раз войти в Kwork
  python -m kwork_agent import kwork.zip # добавить эти кворки в очередь
  python -m kwork_agent publish 3        # выложить 3 штуки для проверки

Выкладывайте партиями по 10–20 в день: Kwork проверяет каждый кворк вручную,
а массовая публикация за один день может выглядеть как спам.
"""

COLUMNS = [
    ("id", "id"), ("title", "Название"), ("category_hint", "Рубрика"), ("description", "Описание"),
    ("requirements", "Что нужно от покупателя"), ("price_rub", "Цена, ₽"), ("days", "Срок, дней"),
    ("tags", "Теги"),
]


def build_zip(uid: int) -> bytes:
    listings = db.load_listings(uid)
    table = io.StringIO()
    # Точка с запятой и BOM — чтобы русский Excel открыл файл двойным щелчком без «кракозябр».
    writer = csv.writer(table, delimiter=";")
    writer.writerow(["№", *(name for _, name in COLUMNS)])
    for n, l in enumerate(listings, 1):
        writer.writerow([n, *(", ".join(l[k]) if k == "tags" else l[k] for k, _ in COLUMNS)])

    buf = io.BytesIO()
    with zipfile.ZipFile(buf, "w", zipfile.ZIP_DEFLATED) as z:
        z.writestr("kworks.csv", "﻿" + table.getvalue())
        z.writestr("listings.json", json.dumps(listings, ensure_ascii=False, indent=2))
        z.writestr("КАК_ВЫЛОЖИТЬ.txt", HOW_TO)
        for l in listings:
            cover = db.cover_path(uid, l["id"])
            if cover.exists():
                z.write(cover, f"covers/{cover.name}")
    return buf.getvalue()
