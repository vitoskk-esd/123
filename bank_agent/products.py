"""Каталог продуктов (что продвигаем) и построение отслеживаемых ссылок.

Все факты об условиях агент берёт только отсюда: модель не выдумывает ставки
и бонусы, а ссылки в посты и в бота подставляет код, а не модель.
"""

from __future__ import annotations

import datetime as dt
import json
import re
import urllib.parse
from dataclasses import dataclass, field
from pathlib import Path

from .config import CONFIG, ROOT

EXAMPLE_FILE = ROOT / "bank_agent" / "products.example.json"
CATALOGS_DIR = ROOT / "bank_agent" / "catalogs"  # готовые наборы: python -m bank_agent init <имя>
TYPES = ("debit", "credit", "business", "savings", "invest", "other")
# Источник трафика в subid: только латиница и цифры, чтобы пережить любую партнёрку.
_SOURCE_RE = re.compile(r"^[a-z0-9]{1,16}$")


@dataclass
class Product:
    id: str
    bank: str                      # юрлицо банка, как в маркировке: «АО «Альфа-Банк»»
    name: str                      # название продукта
    type: str                      # debit | credit | business | savings | invest | other
    referral_url: str
    conditions_url: str            # страница с тарифами/условиями
    key_benefits: list[str]
    target_action: str             # что должен сделать клиент, чтобы банк засчитал
    client_bonus: str = ""         # что получает клиент (бонус банка), если есть
    important_terms: str = ""      # плата за обслуживание, ограничения и т. п.
    restrictions: list[str] = field(default_factory=list)  # «только новые клиенты», «18+»
    audiences: list[str] = field(default_factory=list)
    payout_rub: float = 0
    erid: str = ""
    advertiser: str = ""           # текст маркировки; по умолчанию — bank
    credit_disclosure: str = ""    # для кредитных: ставка, ПСК, льготный период
    subid_param: str = ""          # параметр subid партнёрки (sub1, utm_content…)
    selling_notes: str = ""        # как подавать продукт: углы, акценты, чего не говорить
    # Правила текста для этого продукта: {"pattern": regex, "require": regex, "why": ...}.
    # Без require — фраза запрещена; с require — если есть pattern, обязано быть и require.
    claim_rules: list[dict] = field(default_factory=list)
    # Конверсии продукта, если отличаются от общих допущений (0 — брать из настроек).
    cr_click_to_app: float = 0
    cr_app_to_conv: float = 0
    # Через сколько часов после согласия напомнить о шагах к засчитыванию.
    reminder_hours: list[int] = field(default_factory=lambda: [24, 120])
    reminder_tip: str = ""         # практичный совет в напоминании
    # Срок действия условий (ГГГГ-ММ-ДД). После него продукт не рекламируется, пока
    # условия не сверят заново: реклама с устаревшими условиями недостоверна.
    terms_valid_until: str = ""
    # Страница банка с юридическим текстом и фразы, которые на ней обязаны быть.
    # Агент проверяет их каждый день; если фразы пропали — условия изменились.
    terms_check_url: str = ""
    terms_must_contain: list[str] = field(default_factory=list)
    active: bool = True

    @property
    def cr(self) -> float:
        """Клик → засчитанное оформление (допущение, пока нет фактических данных)."""
        return (self.cr_click_to_app or CONFIG.cr_click_to_app) * (self.cr_app_to_conv or CONFIG.cr_app_to_conv)

    @property
    def ad_label(self) -> str:
        parts = ["Реклама", self.advertiser or self.bank]
        if self.erid:
            parts.append(f"erid: {self.erid}")
        return ". ".join(parts)

    def fact_sheet(self) -> str:
        lines = [
            f"id: {self.id}",
            f"Продукт: {self.name} ({self.bank}), тип: {self.type}",
            "Преимущества: " + "; ".join(self.key_benefits),
            f"Что сделать клиенту для засчитывания: {self.target_action}",
        ]
        if self.client_bonus:
            lines.append(f"Бонус клиенту от банка: {self.client_bonus}")
        if self.important_terms:
            lines.append(f"Важные условия: {self.important_terms}")
        if self.restrictions:
            lines.append("Ограничения: " + "; ".join(self.restrictions))
        if self.audiences:
            lines.append("Кому подходит: " + "; ".join(self.audiences))
        if self.credit_disclosure:
            lines.append(f"Стоимость кредита: {self.credit_disclosure}")
        if self.selling_notes:
            lines.append(f"Как подавать: {self.selling_notes}")
        rules = [r["why"] for r in self.claim_rules]
        if rules:
            lines.append("Обязательные правила текста: " + "; ".join(rules))
        return "\n".join(lines)


def problems(p: Product) -> list[str]:
    """Что мешает законно продвигать продукт. Пустой список — всё в порядке."""
    out = []
    if p.type not in TYPES:
        out.append(f"{p.id}: неизвестный тип «{p.type}» (допустимо: {', '.join(TYPES)})")
    if not p.referral_url.startswith("https://"):
        out.append(f"{p.id}: referral_url должен начинаться с https://")
    if not p.conditions_url.startswith("https://"):
        out.append(f"{p.id}: нужна ссылка на условия банка (conditions_url)")
    if CONFIG.require_erid and not p.erid:
        out.append(f"{p.id}: нет токена erid — возьмите его в кабинете партнёрки (без него реклама незаконна)")
    if p.type == "credit" and not p.credit_disclosure:
        out.append(f"{p.id}: для кредитного продукта заполните credit_disclosure (ставка, ПСК) — ст. 28 закона о рекламе")
    if not p.key_benefits or not p.target_action:
        out.append(f"{p.id}: заполните key_benefits и target_action")
    if p.terms_valid_until and dt.date.today() > dt.date.fromisoformat(p.terms_valid_until):
        out.append(f"{p.id}: условия предложения действовали до {p.terms_valid_until} — сверьте их на странице "
                   "банка и обновите каталог (ставку, ПСК, срок)")
    changed = terms_changes().get(p.id)
    if changed:
        out.append(f"{p.id}: условия на странице банка изменились — не найдено: "
                   + "; ".join(f"«{x}»" for x in changed) + ". Сверьте и обновите каталог")
    for r in p.claim_rules:
        try:
            re.compile(r["pattern"])
            re.compile(r.get("require") or "")
        except (re.error, KeyError) as e:
            out.append(f"{p.id}: ошибка в claim_rules ({e})")
    return out


def _norm(text: str) -> str:
    return re.sub(r"\s+", " ", re.sub(r"[\u2010-\u2015\-]", "-", text.replace("\u00a0", " "))).lower()


def terms_changes() -> dict[str, list[str]]:
    """Последний результат проверки условий: {id продукта: фразы, которых нет на странице}."""
    path = CONFIG.data_dir / "terms_status.json"
    if not path.exists():
        return {}
    return json.loads(path.read_text(encoding="utf-8")).get("missing", {})


def check_terms(catalog: list["Product"], fetch=None) -> dict[str, list[str]]:
    """Сверяет юридический текст на странице банка с каталогом. Ошибку сети не считает изменением."""
    from . import net

    fetch = fetch or net.fetch_text
    missing: dict[str, list[str]] = {}
    errors: dict[str, str] = {}
    for p in catalog:
        if not (p.active and p.terms_check_url and p.terms_must_contain):
            continue
        try:
            page = _norm(fetch(p.terms_check_url))
        except Exception as e:  # noqa: BLE001
            errors[p.id] = f"{type(e).__name__}: {e}"
            continue
        lost = [x for x in p.terms_must_contain if _norm(x) not in page]
        if lost:
            missing[p.id] = lost
    old = terms_changes()
    for pid in errors:  # страница не открылась — оставляем прошлый вердикт
        if pid in old:
            missing[pid] = old[pid]
    CONFIG.data_dir.mkdir(parents=True, exist_ok=True)
    (CONFIG.data_dir / "terms_status.json").write_text(json.dumps(
        {"date": dt.date.today().isoformat(), "missing": missing, "errors": errors},
        ensure_ascii=False, indent=2), encoding="utf-8")
    return missing


def load_catalog(path: Path | None = None) -> list[Product]:
    path = path or CONFIG.products_file
    if not path.exists():
        raise FileNotFoundError(
            f"Нет каталога продуктов {path}. Скопируйте {EXAMPLE_FILE.name} в это место "
            "и впишите свои партнёрские ссылки, erid и условия."
        )
    raw = json.loads(path.read_text(encoding="utf-8"))
    known = set(Product.__dataclass_fields__)
    items = [Product(**{k: v for k, v in item.items() if k in known}) for item in raw["products"]]
    ids = [p.id for p in items]
    if len(ids) != len(set(ids)):
        raise ValueError("id продуктов в каталоге повторяются")
    return items


def sellable(catalog: list[Product]) -> list[Product]:
    """Активные продукты без блокирующих проблем."""
    return [p for p in catalog if p.active and not problems(p)]


def subid(source: str, post_id: str | None) -> str:
    return f"{source}-{post_id or '0'}"


def parse_subid(value: str) -> tuple[str | None, str | None]:
    if not value or "-" not in value:
        return None, None
    source, post = value.split("-", 1)
    return source or None, (None if post == "0" else post)


def _with_param(url: str, key: str, value: str) -> str:
    parts = urllib.parse.urlsplit(url)
    query = urllib.parse.parse_qsl(parts.query, keep_blank_values=True)
    query = [(k, v) for k, v in query if k != key] + [(key, value)]
    return urllib.parse.urlunsplit(parts._replace(query=urllib.parse.urlencode(query)))


def destination(p: Product, source: str, post_id: str | None) -> str:
    """Конечная партнёрская ссылка (с subid, если партнёрка его поддерживает)."""
    if p.subid_param:
        return _with_param(p.referral_url, p.subid_param, subid(source, post_id))
    return p.referral_url


def link(p: Product, source: str, post_id: str | None = None, user_hash: str | None = None) -> str:
    """Ссылка для поста/бота: через трекер (считаем клики) или напрямую."""
    if not _SOURCE_RE.match(source):
        raise ValueError(f"источник «{source}»: только строчная латиница и цифры")
    if not CONFIG.tracker_url:
        return destination(p, source, post_id)
    query = {"s": source}
    if post_id:
        query["p"] = post_id
    if user_hash:
        query["u"] = user_hash
    return f"{CONFIG.tracker_url}/go/{urllib.parse.quote(p.id)}?{urllib.parse.urlencode(query)}"
