"""Проверка уникальности объявлений: не допускаем почти одинаковых кворков."""

from __future__ import annotations

import re
from difflib import SequenceMatcher

_WORD = re.compile(r"[a-zа-яё0-9]+", re.IGNORECASE)
_STOP = {
    "для", "что", "как", "это", "или", "все", "вас", "ваш", "ваши", "вашего", "вашей",
    "под", "при", "без", "так", "уже", "его", "она", "они", "мне", "меня", "есть",
    "the", "and", "for", "with",
}


def _stems(text: str) -> set[str]:
    # Грубая «основа» слова: первые 6 букв — достаточно, чтобы «автоматизация» и
    # «автоматизирую» считались одним словом.
    return {
        w.lower()[:6]
        for w in _WORD.findall(text)
        if len(w) > 2 and w.lower() not in _STOP
    }


def jaccard(a: str, b: str) -> float:
    sa, sb = _stems(a), _stems(b)
    if not sa or not sb:
        return 0.0
    return len(sa & sb) / len(sa | sb)


def title_similarity(a: str, b: str) -> float:
    return max(
        SequenceMatcher(None, a.lower(), b.lower()).ratio(),
        jaccard(a, b),
    )


def find_duplicate(
    candidate: dict,
    existing: list[dict],
    title_threshold: float = 0.75,
    description_threshold: float = 0.5,
) -> dict | None:
    """Возвращает похожее существующее объявление или None."""
    for other in existing:
        if title_similarity(candidate["title"], other["title"]) >= title_threshold:
            return other
        if jaccard(candidate["description"], other["description"]) >= description_threshold:
            return other
    return None
