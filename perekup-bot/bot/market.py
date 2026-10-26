"""«Ниже рынка»: типичная цена — медиана цен той же модели ±1 год за последние недели. Бот копит цены сам
из каждого поста, поэтому оценка становится точнее с каждым днём работы."""
from statistics import median

MIN_SAMPLES = 5        # меньше объявлений — оценку не показываем, чтобы не врать
SHOW_FROM = 5          # «ниже рынка» пишем от 5%
SCAM_FROM = 45         # дешевле рынка почти вдвое — скорее всего мошенники
WINDOW_DAYS = 90


def estimate(prices: list[int]) -> int | None:
    if len(prices) < MIN_SAMPLES:
        return None
    return round(median(prices))


def discount(price: int, market: int | None) -> int | None:
    """На сколько процентов дешевле рынка (отрицательное — дороже)."""
    if not market or not price:
        return None
    return round((market - price) / market * 100)
