"""Общие объекты бота: база, каталог (меняется по /reload), настройки. Передаются в обработчики через dispatcher."""
from dataclasses import dataclass

from .config import Config
from .db import DB
from .offers import Catalog, load_catalog


@dataclass
class Ctx:
    db: DB
    cfg: Config
    catalog: Catalog

    def reload(self) -> Catalog:
        self.catalog = load_catalog(self.cfg.offers_path)
        return self.catalog


HOUR = 3600
NUDGE_DELAYS = [1 * HOUR, 24 * HOUR, 72 * HOUR]   # дожим после «Получить ссылку»
STALL_DELAY = 24 * HOUR                           # не дошёл до квиза
CONDITION_DELAY = 24 * HOUR                       # после заявки: напомнить про условие банка
