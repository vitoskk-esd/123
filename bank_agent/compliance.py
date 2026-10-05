"""Проверка постов на соответствие закону о рекламе и правилам партнёрок.

Почему это важно: реферальная ссылка — это реклама (нужна маркировка с erid),
реклама финансовых услуг обязана раскрывать условия (ст. 28 38-ФЗ), а банки
снимают выплаты и отключают партнёров за недостоверные обещания и спам.
"""

from __future__ import annotations

import re

from .products import Product

# Обещания, которые нельзя давать в рекламе финансовых услуг.
FORBIDDEN = [
    (r"гарантир\w*", "нельзя гарантировать одобрение или доход"),
    (r"100\s*%\s*одобр\w*", "нельзя обещать 100% одобрение"),
    (r"одобр\w*\s+(?:всем|каждому|любому)", "нельзя обещать одобрение всем"),
    (r"без\s+(?:отказ\w*|проверк\w*)", "нельзя обещать отсутствие отказа/проверки"),
    (r"мгновенн\w*\s+одобр\w*", "нельзя обещать мгновенное одобрение"),
    (r"бесплатн\w*\s+деньг\w*|л[её]гк\w*\s+деньг\w*|халяв\w*", "нельзя обещать «бесплатные/лёгкие деньги»"),
    (r"без\s+последствий", "нельзя преуменьшать последствия долга"),
    (r"(?:официальн\w*\s+(?:представител|сайт|партн[её]р\w*\s+банк))|от\s+имени\s+банка|наш\s+банк",
     "нельзя выдавать себя за банк или его представителя"),
    (r"instagram|инстаграм|facebook|фейсбук", "реклама в ресурсах Meta запрещена с 1.09.2025 — не упоминаем"),
    (r"\b(?:я|мы)\s+(?:сам\w*\s+)?(?:польз\w+|оформил\w*|получил\w*)", "выдуманный личный опыт недопустим"),
    (r"отзыв\w*\s+(?:клиент|покупател|пользовател)", "нельзя приводить отзывы, которых нет"),
    (r"паспорт\w*\s+(?:данн|номер)|номер\w*\s+карт|cvv|cvc|код\w*\s+из\s+смс",
     "нельзя просить паспортные/карточные данные и коды"),
]
_FORBIDDEN_RE = [(re.compile(p, re.IGNORECASE), why) for p, why in FORBIDDEN]
# Ссылки в тексте ставит только код, иначе модель может подставить чужую или выдуманную.
_URL_RE = re.compile(r"https?://|www\.|\bt\.me/|\bvk\.(?:cc|com|ru)/|\bmax\.ru/", re.IGNORECASE)

_MINORS_RE = re.compile(r"школьн\w*|подрост\w*|несовершеннолетн\w*|до\s+18\s+лет", re.IGNORECASE)

# Тело поста; ссылка и маркировка добавят ещё ~300 знаков (лимит Telegram — 4096, MAX — 4000).
LIMITS = {"telegram": 3400, "max": 3400, "vk": 8000, "dzen": 15000, "shorts": 4000}


def check_body(body: str, product: Product, channel: str) -> list[str]:
    """Ошибки в тексте, написанном моделью (до добавления ссылки и маркировки)."""
    issues = []
    for rx, why in _FORBIDDEN_RE:
        m = rx.search(body)
        if m:
            issues.append(f"{why}: «{m.group(0)}»")
    if _URL_RE.search(body):
        issues.append("в тексте не должно быть ссылок — ссылку добавит агент")
    if product.type == "credit" and not re.search(r"ПСК|полн\w+ стоимост", body, re.IGNORECASE):
        # Маркировка с ПСК добавится автоматически, но и в тексте нельзя
        # говорить о выгоде кредита, не упомянув его стоимость.
        if re.search(r"\d+\s*(?:дн|%)|без\s+процент|льготн", body, re.IGNORECASE):
            issues.append("кредит: упомянуты условия, но нет ПСК — добавьте фразу про полную стоимость")
    if product.type == "credit" and _MINORS_RE.search(body):
        issues.append("реклама кредита не может обращаться к несовершеннолетним")
    for rule in product.claim_rules:
        m = re.search(rule["pattern"], body, re.IGNORECASE)
        if m and not (rule.get("require") and re.search(rule["require"], body, re.IGNORECASE)):
            issues.append(f"{rule['why']}: «{m.group(0)}»")
    limit = LIMITS.get(channel)
    if limit and len(body) > limit:
        issues.append(f"слишком длинно для {channel}: {len(body)} > {limit} символов")
    if len(body.strip()) < 80:
        issues.append("слишком коротко")
    return issues


def assemble(body: str, product: Product, url: str, cta: str) -> str:
    """Финальный текст: тело + призыв со ссылкой + обязательная маркировка и условия."""
    footer = [product.ad_label + "."]
    if product.credit_disclosure:
        footer.append(product.credit_disclosure)
    footer.append(f"Условия: {product.conditions_url}")
    return f"{body.strip()}\n\n👉 {cta.strip()}: {url}\n\n" + "\n".join(footer)


def check_final(text: str, product: Product) -> list[str]:
    """Последний рубеж перед публикацией — независимо от того, кто собрал текст."""
    issues = []
    if "Реклама" not in text:
        issues.append("нет пометки «Реклама»")
    if product.erid and f"erid: {product.erid}" not in text:
        issues.append("нет токена erid")
    if product.conditions_url not in text:
        issues.append("нет ссылки на условия")
    if product.type == "credit" and product.credit_disclosure not in text:
        issues.append("нет раскрытия стоимости кредита")
    return issues
