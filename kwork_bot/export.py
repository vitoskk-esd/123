"""Выгрузка готовых кворков одним архивом: таблица для Excel, JSON для загрузчика и обложки."""

from __future__ import annotations

import csv
import io
import json
import zipfile
from pathlib import Path

from . import db
from .images import MIN_COVER_BYTES, save_cover_jpeg
from .kwork_rules import fit_volume

HOW_TO = """КАК ВЫЛОЖИТЬ КВОРКИ

kworks.csv — все кворки таблицей (открывается в Excel / Google Таблицах).
covers/    — обложки 660×440, имя файла = колонка «id».
listings.json — тот же список для автозагрузчика.

Расширением (проще всего): установите расширение «Kwork — выкладка кворков» (бот пришлёт его
по кнопке «🧩 Расширение»), откройте kwork.ru — справа внизу появится панель. Выберите в ней
этот kwork.zip и нажмите «Старт». В рубриках, где Kwork требует портфолио, добавьте свои
работы на шаге «Портфолио» и нажмите «Готово» — расширение продолжит само.

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
    ("volume", "Объём услуг в 1 кворке"), ("tags", "Теги"),
]


EXTENSION_DIR = Path(__file__).resolve().parent.parent / "kwork_extension"

EXTENSION_HELP = (
    "🧩 <b>Расширение для выкладки кворков</b>\n\n"
    "<b>Установка (один раз, Chrome или Яндекс Браузер):</b>\n"
    "1. Распакуйте этот архив в любую папку.\n"
    "2. Откройте адрес <code>chrome://extensions</code> (в Яндекс Браузере — <code>browser://extensions</code>).\n"
    "3. Включите «Режим разработчика» (переключатель справа вверху).\n"
    "4. Нажмите «Загрузить распакованное расширение» и выберите распакованную папку.\n\n"
    "<b>Выкладка:</b> откройте kwork.ru — справа внизу появится панель. Выберите в ней kwork.zip из бота, "
    "задайте «Проверять вручную первых» и «Всего за запуск» и нажмите «Старт».\n"
    "При ручной проверке расширение заполняет форму и ждёт, пока вы нажмёте «Готово»; дальше — само.\n"
    "В рубриках, где Kwork требует портфолио (дизайн, сайты, видео, аудио), расширение остановится на шаге "
    "«Портфолио»: добавьте свои работы и нажмите «Готово».\n\n"
    "<b>Обновление:</b> замените файлы в папке расширения новыми и нажмите ↻ у расширения на странице "
    "расширений. Номер версии виден в заголовке панели."
)


def extension_zip() -> bytes:
    """Архив расширения из папки kwork_extension (всегда текущая версия)."""
    buf = io.BytesIO()
    with zipfile.ZipFile(buf, "w", zipfile.ZIP_DEFLATED) as z:
        for f in sorted(EXTENSION_DIR.iterdir()):
            if f.is_file():
                z.write(f, f"kwork_extension/{f.name}")
    return buf.getvalue()


def build_zip(uid: int) -> bytes:
    listings = db.load_listings(uid)
    for l in listings:  # у кворков, созданных до появления поля, объёма нет — Kwork его требует
        l["volume"] = fit_volume(l.get("volume", ""))
    table = io.StringIO()
    # Точка с запятой и BOM — чтобы русский Excel открыл файл двойным щелчком без «кракозябр».
    writer = csv.writer(table, delimiter=";")
    writer.writerow(["№", *(name for _, name in COLUMNS)])
    for n, l in enumerate(listings, 1):
        writer.writerow([n, *(", ".join(l[k]) if k == "tags" else l[k] for k, _ in COLUMNS)])

    buf = io.BytesIO()
    with zipfile.ZipFile(buf, "w", zipfile.ZIP_DEFLATED) as z:
        z.writestr("kworks.csv", "﻿" + table.getvalue())
        # listings.json и обложки — без сжатия: расширение читает архив без сторонних библиотек
        # (JPEG всё равно не сжимается).
        z.writestr("listings.json", json.dumps(listings, ensure_ascii=False, indent=2), compress_type=zipfile.ZIP_STORED)
        z.writestr("КАК_ВЫЛОЖИТЬ.txt", HOW_TO)
        for l in listings:
            cover = db.cover_path(uid, l["id"])
            if cover.exists() and cover.stat().st_size <= MIN_COVER_BYTES:  # обложки старых партий
                from PIL import Image

                save_cover_jpeg(Image.open(cover), cover)
            if cover.exists():
                z.write(cover, f"covers/{cover.name}", compress_type=zipfile.ZIP_STORED)
    return buf.getvalue()
