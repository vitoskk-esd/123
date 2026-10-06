"""Claude отбирает новости и пишет посты; здесь же сборка текста для Telegram и Instagram."""

from __future__ import annotations

import html
import re

from . import storage
from .article import Photo, thumbnail_b64
from .config import CONFIG
from .llm import LLM
from .sources import NewsItem

TELEGRAM_CAPTION_MAX = 1024  # лимит подписи к фото в Telegram
INSTAGRAM_CAPTION_MAX = 2200
INSTAGRAM_HASHTAGS_MAX = 30
HEADLINE_MAX = 120

SELECT_SCHEMA = {
    "type": "object",
    "additionalProperties": False,
    "required": ["picks"],
    "properties": {
        "picks": {
            "type": "array",
            "items": {
                "type": "object",
                "additionalProperties": False,
                "required": ["id", "topic"],
                "properties": {
                    "id": {"type": "integer", "description": "Номер новости из списка"},
                    "topic": {
                        "type": "string",
                        "description": "Коротко о чём новость: бренд, модель/коллекция, событие",
                    },
                },
            },
        }
    },
}

POST_SCHEMA = {
    "type": "object",
    "additionalProperties": False,
    "required": [
        "suitable", "reject_reason", "headline", "telegram_text",
        "instagram_text", "hashtags", "image_indexes",
    ],
    "properties": {
        "suitable": {"type": "boolean"},
        "reject_reason": {"type": "string"},
        "headline": {"type": "string"},
        "telegram_text": {"type": "string"},
        "instagram_text": {"type": "string"},
        "hashtags": {"type": "array", "items": {"type": "string"}},
        "image_indexes": {"type": "array", "items": {"type": "integer"}},
    },
}


def _age(item: NewsItem) -> str:
    if not item.published:
        return "время неизвестно"
    hours = int((storage.now() - item.published).total_seconds() // 3600)
    return "меньше часа назад" if hours < 1 else f"{hours} ч назад"


def select_news(llm: LLM, items: list[NewsItem], n: int) -> list[tuple[NewsItem, str]]:
    """Выбирает до n новостей для публикации, самые интересные первыми."""
    items = items[:60]
    recent = [p.get("topic") or p.get("headline", "") for p in storage.load_posts()[-40:]]
    recent_txt = "\n".join(f"- {t}" for t in recent if t) or "(пока ничего)"
    news_txt = "\n\n".join(
        f"[{i}] {it.source} · {_age(it)}\n{it.title}\n{it.summary[:300]}"
        for i, it in enumerate(items, 1)
    )
    prompt = f"""Ты — редактор Telegram-канала и Instagram магазина «{CONFIG.shop_name}».
Тематика: {CONFIG.focus}.

Ниже свежие новости из модных изданий и каналов. Выбери до {n} лучших для публикации,
в порядке убывания приоритета.

Берём: релизы и коллаборации, новые коллекции и кампании, дропы, громкие новости брендов
из тематики — то, что интересно покупателю брендовой одежды и обуви.
Не берём: распродажи и подборки скидок других магазинов, обзоры товаров не по теме,
светскую хронику без акцента на одежде, политику, некрологи, рекламу, вакансии.
Если несколько новостей об одном и том же — бери одну, самую информативную.
Не бери то, о чём уже был пост:
{recent_txt}

Если подходящих новостей нет — верни пустой список.

Новости:

{news_txt}"""
    data = llm.ask(prompt, schema=SELECT_SCHEMA, effort="low")
    picks, used = [], set()
    for p in data["picks"]:
        idx = p["id"] - 1
        if 0 <= idx < len(items) and idx not in used:
            used.add(idx)
            picks.append((items[idx], p["topic"]))
    return picks[:n]


def _write_prompt(item: NewsItem, text: str, n_photos: int, feedback: str) -> str:
    tags = max(CONFIG.telegram_hashtags, CONFIG.instagram_hashtags)
    if CONFIG.source_credit:
        signature = "подпись магазина и источник\n  добавятся автоматически."
    else:
        signature = (
            "подпись магазина\n  добавится автоматически. Не упоминай издание или канал, откуда взята "
            "новость\n  (никаких «как сообщает Hypebeast»)."
        )
    prompt = f"""Ты ведёшь Telegram-канал и Instagram магазина брендовой оригинальной одежды и обуви
«{CONFIG.shop_name}». Тематика: {CONFIG.focus}.

Напиши пост по новости ниже. Язык поста: {CONFIG.language}.

- headline: цепкий заголовок до 90 символов, без кликбейта и капслока, можно один эмодзи в начале.
- telegram_text: 2–4 коротких абзаца, всего 350–700 символов. Суть новости и детали
  (модель, расцветка, материалы, дата и цена релиза — только если они есть в источнике),
  и почему это интересно.
- instagram_text: тот же смысл, 500–1300 символов, живее, с абзацами, до 4 эмодзи;
  в конце — вопрос подписчикам.
- В текстах без ссылок, без хэштегов и без призывов купить: {signature}
- Только факты из источника. Не выдумывай цены, даты, артикулы и цитаты; цены оставляй
  в валюте источника.
- Бренды и модели пиши в оригинальном написании (Nike Air Jordan 1, Louis Vuitton).
- hashtags: {tags} хэштегов без знака #, самые важные первыми: бренд, модель, тема
  (sneakers, streetwear…) и русскоязычные (кроссовки, мода…).

Фото: выше {n_photos} фото-кандидатов. В image_indexes перечисли номера подходящих фото
в порядке показа, первое — самое эффектное (обложка), не больше {CONFIG.images_per_post}.
Бери только фото по теме новости: товар, лукбук, кампания, показ. Не бери логотипы,
баннеры, скриншоты, фото с чужими водяными знаками или текстом поверх, портреты авторов.

suitable=false, если новость не по тематике, это реклама/распродажа или нет ни одного
подходящего фото; тогда объясни причину в reject_reason, остальные поля оставь пустыми.

Источник: {item.source}
Заголовок: {item.title}

Текст новости:
{text}"""
    if feedback:
        prompt += f"\n\nПредыдущий вариант не прошёл проверку: {feedback}. Исправь это."
    return prompt


def validate(post: dict, n_photos: int, item: NewsItem) -> list[str]:
    errors = []
    if not post["suitable"]:
        return errors
    if not post["headline"].strip():
        errors.append("пустой заголовок")
    if len(post["headline"]) > HEADLINE_MAX:
        errors.append(f"заголовок длиннее {HEADLINE_MAX} символов")
    if not post["telegram_text"].strip() or not post["instagram_text"].strip():
        errors.append("пустой текст поста")
    _, tg_len = telegram_html(post, item)
    if tg_len > TELEGRAM_CAPTION_MAX:
        errors.append(
            f"пост для Telegram вместе с подписью {tg_len} символов, а лимит {TELEGRAM_CAPTION_MAX}: "
            f"сократи telegram_text примерно на {tg_len - TELEGRAM_CAPTION_MAX + 50} символов"
        )
    if len(instagram_caption(post, item, trim=False)) > INSTAGRAM_CAPTION_MAX:
        errors.append(f"подпись для Instagram длиннее {INSTAGRAM_CAPTION_MAX} символов — сократи instagram_text")
    if not [i for i in post["image_indexes"] if 1 <= i <= n_photos]:
        errors.append("не выбрано ни одного фото из списка")
    return errors


def write_post(llm: LLM, item: NewsItem, text: str, photos: list[Photo]) -> dict:
    """Пишет пост и выбирает фото. Возвращает словарь по POST_SCHEMA."""
    images: list[dict] = []
    for i, photo in enumerate(photos, 1):
        images.append({"type": "text", "text": f"Фото {i}:"})
        images.append({
            "type": "image",
            "source": {"type": "base64", "media_type": "image/jpeg", "data": thumbnail_b64(photo)},
        })
    feedback = ""
    post: dict = {}
    for _ in range(2):
        content = images + [{"type": "text", "text": _write_prompt(item, text, len(photos), feedback)}]
        post = llm.ask(content, schema=POST_SCHEMA, effort="medium")
        errors = validate(post, len(photos), item)
        if not errors:
            break
        feedback = "; ".join(errors)
        storage.log(f"Пост не прошёл проверку ({feedback}), переписываю")
    # Отбрасываем несуществующие и повторяющиеся номера фото.
    seen: list[int] = []
    for i in post.get("image_indexes", []):
        if 1 <= i <= len(photos) and i not in seen:
            seen.append(i)
    post["image_indexes"] = seen[: CONFIG.images_per_post]
    if post.get("suitable") and not seen:
        post["suitable"], post["reject_reason"] = False, "нет подходящих фото"
    return post


# --- Сборка текста ---------------------------------------------------------------

def clean_hashtags(tags: list[str], limit: int) -> list[str]:
    out, seen = [], set()
    for t in tags:
        t = re.sub(r"[^\w]", "", t.replace(" ", "_")).strip("_")
        if t and t.lower() not in seen:
            seen.add(t.lower())
            out.append("#" + t)
    return out[:limit]


def telegram_html(post: dict, item: NewsItem) -> tuple[str, int]:
    """HTML-подпись для Telegram и её длина в видимых символах (лимит считается по ним)."""
    blocks_html = [f"<b>{html.escape(post['headline'].strip())}</b>", html.escape(post["telegram_text"].strip())]
    blocks_text = [post["headline"].strip(), post["telegram_text"].strip()]
    if CONFIG.shop_cta:
        blocks_html.append(html.escape(CONFIG.shop_cta))
        blocks_text.append(CONFIG.shop_cta)
    if CONFIG.source_credit:
        label = f"Источник: {item.source}"
        blocks_html.append(f'<a href="{html.escape(item.url, quote=True)}">{html.escape(label)}</a>')
        blocks_text.append(label)
    tags = " ".join(clean_hashtags(post["hashtags"], CONFIG.telegram_hashtags))
    if tags:
        blocks_html.append(tags)
        blocks_text.append(tags)
    return "\n\n".join(blocks_html), len("\n\n".join(blocks_text))


def _trim(text: str, limit: int) -> str:
    """Обрезает текст по границе предложения."""
    if len(text) <= limit:
        return text
    cut = text[:limit]
    end = max(cut.rfind(". "), cut.rfind("! "), cut.rfind("? "), cut.rfind("\n"))
    return (cut[: end + 1] if end > limit // 2 else cut.rstrip() + "…").strip()


def instagram_caption(post: dict, item: NewsItem, *, trim: bool = True) -> str:
    tail = []
    if CONFIG.shop_cta:
        tail.append(CONFIG.shop_cta)
    if CONFIG.source_credit:
        tail.append(f"Источник: {item.source}")
    tags = " ".join(clean_hashtags(post["hashtags"], min(CONFIG.instagram_hashtags, INSTAGRAM_HASHTAGS_MAX)))
    if tags:
        tail.append(tags)
    head = post["headline"].strip()
    body = post["instagram_text"].strip()
    caption = "\n\n".join([head, body] + tail)
    if trim and len(caption) > INSTAGRAM_CAPTION_MAX:
        room = INSTAGRAM_CAPTION_MAX - (len(caption) - len(body))
        caption = "\n\n".join([head, _trim(body, max(0, room))] + tail)
    return caption
