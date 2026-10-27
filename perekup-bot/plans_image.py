"""Картинка-сравнение тарифов для экрана «Подписка»: «Простой» против PRO по каждой возможности.
Рисуется из текущих цен и лимитов (меняются переменными), в памяти — без файлов на диске."""
from io import BytesIO

from PIL import Image, ImageDraw, ImageFont

from config import ROOT
from plans import Plan

W, H = 1080, 1240
BG, CARD, LINE = (17, 19, 24), (28, 31, 39), (48, 52, 64)
TEXT, MUTED = (240, 241, 245), (150, 155, 168)
ORANGE, GREEN, GRAY = (255, 122, 26), (52, 199, 89), (110, 114, 126)


def _font(bold: bool, size: int):
    return ImageFont.truetype(str(ROOT / ("Inter-Bold.otf" if bold else "Inter-Regular.otf")), size)


def _check(d: ImageDraw.ImageDraw, cx: int, cy: int, color=GREEN) -> None:
    d.line([(cx - 16, cy + 1), (cx - 5, cy + 12), (cx + 17, cy - 13)], fill=color, width=7, joint="curve")


def _dash(d: ImageDraw.ImageDraw, cx: int, cy: int) -> None:
    d.line([(cx - 14, cy), (cx + 14, cy)], fill=GRAY, width=6)


def _wait(sec: int) -> str:
    return f"через {sec // 60} мин" if sec >= 60 and sec % 60 == 0 else f"через {sec} с"


def render(basic: Plan, pro: Plan, trial: Plan) -> bytes:
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)
    f_title, f_head, f_price = _font(True, 58), _font(True, 44), _font(True, 34)
    f_row, f_cell, f_small = _font(False, 33), _font(True, 33), _font(False, 28)

    d.text((W // 2, 80), "Тарифы «Перехват»", font=f_title, fill=TEXT, anchor="mm")
    col_label, col_basic, col_pro = 70, 640, 890        # центр колонок «Простой» и PRO
    top = 170
    # подсветка колонки PRO
    d.rounded_rectangle((col_pro - 125, top - 10, col_pro + 125, top + 905), radius=28, fill=(40, 30, 22), outline=ORANGE, width=4)
    d.rounded_rectangle((col_pro - 92, top - 32, col_pro + 92, top + 12), radius=20, fill=ORANGE)
    d.text((col_pro, top - 10), "ВЫГОДНЕЕ", font=_font(True, 24), fill=(20, 20, 20), anchor="mm")

    d.text((col_basic, top + 50), basic.title, font=f_head, fill=TEXT, anchor="mm")
    d.text((col_pro, top + 50), pro.title, font=f_head, fill=ORANGE, anchor="mm")
    d.text((col_basic, top + 105), f"{basic.price} ₽", font=f_price, fill=TEXT, anchor="mm")
    d.text((col_pro, top + 105), f"{pro.price} ₽", font=f_price, fill=TEXT, anchor="mm")
    d.text((col_basic, top + 145), "в месяц", font=f_small, fill=MUTED, anchor="mm")
    d.text((col_pro, top + 145), "в месяц", font=f_small, fill=MUTED, anchor="mm")

    filters = "без лимита" if basic.unlimited else str(basic.max_filters)
    own = "до " + str(basic.max_own) if basic.max_own else None
    rows = [
        ("Машины приходят", _wait(basic.delay) if basic.delay else "сразу", "мгновенно"),
        ("Фильтров", filters, "без лимита"),
        ("Общая база каналов", True, True),
        ("Свои каналы, закрытые", own or False, True),
        ("Насколько ниже рынка", basic.market, True),
        ("Фильтр «ниже рынка»", basic.market, True),
        ("ИИ-проверка поста", basic.ai, True),
        ("Фото, метки, число ДТП", True, True),
    ]
    y = top + 215
    for label, b, p in rows:
        d.line((col_label, y - 42, W - 60, y - 42), fill=LINE, width=2)
        d.text((col_label, y), label, font=f_row, fill=TEXT, anchor="lm")
        for cx, val, accent in ((col_basic, b, TEXT), (col_pro, p, ORANGE)):
            if val is True:
                _check(d, cx, y, GREEN)
            elif val is False:
                _dash(d, cx, y)
            else:
                d.text((cx, y), str(val), font=f_cell, fill=accent if cx == col_pro else MUTED, anchor="mm")
        y += 86

    # пробный день
    box_top = top + 935
    d.rounded_rectangle((60, box_top, W - 60, box_top + 120), radius=24, fill=CARD)
    d.text((W // 2, box_top + 42), f"Пробный день — {trial.price} ₽", font=_font(True, 38), fill=ORANGE, anchor="mm")
    d.text((W // 2, box_top + 88), "всё как в PRO, без ограничений, на 24 часа · один раз", font=f_small, fill=MUTED, anchor="mm")

    out = BytesIO()
    img.save(out, "PNG", optimize=True)
    return out.getvalue()
