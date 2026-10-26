"""Каталог акций: offers.yaml правится без кода, перечитывается командой /reload."""
from dataclasses import dataclass, field
from pathlib import Path

import yaml


@dataclass(frozen=True)
class Offer:
    id: str
    bank: str          # как показывать: «Альфа-Банк»
    bank_key: str      # для квиза «где уже есть карта»: alfa, tbank…
    title: str         # «Кредитная карта»
    payout: int        # твоя выплата пользователю, ₽
    link: str          # твоя ссылка «Приведи друга»
    bank_bonus: str = ""                 # что даёт сам банк, текстом: «до 1 000 ₽ кэшбэком»
    condition: str = ""                  # условие получения: «5 покупок в день получения»
    steps: tuple[str, ...] = field(default_factory=tuple)
    deadline_days: int = 30              # за сколько дней нужно выполнить условие
    active: bool = True


@dataclass(frozen=True)
class Catalog:
    offers: tuple[Offer, ...]

    @property
    def active(self) -> list[Offer]:
        return [o for o in self.offers if o.active]

    @property
    def banks(self) -> dict[str, str]:
        """bank_key → название, в порядке первого появления (для кнопок квиза)."""
        out: dict[str, str] = {}
        for o in self.active:
            out.setdefault(o.bank_key, o.bank)
        return out

    def get(self, offer_id: str) -> Offer | None:
        return next((o for o in self.offers if o.id == offer_id), None)

    def eligible(self, has_banks: set[str]) -> list[Offer]:
        """Акции, где человек ещё новый клиент: банка нет в его списке."""
        return [o for o in self.active if o.bank_key not in has_banks]


def load_catalog(path: Path) -> Catalog:
    raw = yaml.safe_load(path.read_text(encoding="utf-8")) or {}
    offers = []
    for item in raw.get("offers", []):
        item = dict(item)
        item["steps"] = tuple(item.get("steps") or ())
        offers.append(Offer(**item))
    ids = [o.id for o in offers]
    if len(ids) != len(set(ids)):
        raise ValueError("в offers.yaml повторяются id акций")
    return Catalog(tuple(offers))
