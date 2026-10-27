"""Общие объекты: база, справочник (меняется по /reload), настройки, кэш каналов. Передаются в обработчики через dispatcher."""
from dataclasses import dataclass, field

from config import Config
from db import DB
from words import Dictionary, load_dictionary


@dataclass
class Ctx:
    db: DB
    cfg: Config
    dict: Dictionary
    channels: dict[int, dict] = field(default_factory=dict)   # tg_id → строка channels (быстрый поиск на каждом посте)
    pay: object = None                                         # payments.Robokassa
    reader: object = None                                      # userbot.Reader
    pending: set = field(default_factory=set)                 # (человек, пост) в очереди «Простого» — не дублировать
    background: set = field(default_factory=set)              # отложенные отправки
    buffer_chat: int = 0                                       # закрытый канал с фото машин (id для бота), 0 — без фото

    def reload(self) -> Dictionary:
        self.dict = load_dictionary(self.cfg.cars_path)
        return self.dict

    async def refresh_channels(self) -> None:
        self.channels = {r["tg_id"]: dict(r) for r in await self.db.joined_channels()}
