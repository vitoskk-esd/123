"""Отчёты владельцу и импорт конверсий из кабинета партнёрки."""

from __future__ import annotations

import csv
import datetime as dt
import io
from pathlib import Path

from . import storage
from .channels import VK, Max, Outgoing, Telegram
from .config import CONFIG
from .db import DB, iso, now
from .funnel import GoalStatus, goal_status, performance
from .products import Product, parse_subid, problems

# Как называются колонки в выгрузках разных партнёрок (сравниваем в нижнем регистре).
COLUMNS = {
    "ext_id": ("id", "lead_id", "conversion_id", "action_id", "order_id", "id лида", "id конверсии", "id заявки"),
    "subid": ("subid", "sub_id", "sub1", "subid1", "utm_content", "sub", "aff_sub", "метка", "субаккаунт"),
    "status": ("status", "статус", "state"),
    "payout": ("payout", "reward", "commission", "сумма", "вознаграждение", "выплата", "доход"),
    "product": ("offer", "offer_id", "product", "оффер", "продукт"),
    "date": ("date", "created", "created_at", "дата", "время"),
}
APPROVED = ("approved", "accepted", "confirmed", "paid", "одобр", "подтвержд", "принят", "выплач", "засчитан")
PENDING = ("pending", "hold", "processing", "wait", "в обработке", "ожида", "холд", "на проверке")


def _num(value: str) -> float | None:
    value = (value or "").replace(" ", "").replace(" ", "").replace("₽", "").replace(",", ".")
    try:
        return float(value)
    except ValueError:
        return None


def _date(value: str) -> str | None:
    """Дата конверсии из выгрузки, чтобы она попала в свой месяц, а не в месяц импорта."""
    value = (value or "").strip()[:10]
    for fmt in ("%Y-%m-%d", "%d.%m.%Y", "%d/%m/%Y"):
        try:
            return iso(dt.datetime.strptime(value, fmt).replace(hour=12, tzinfo=dt.timezone.utc))
        except ValueError:
            continue
    return None


def import_conversions(db: DB, path: Path, catalog: list[Product]) -> dict:
    """Импорт CSV из кабинета партнёрки. Повторный импорт того же файла безопасен (по id)."""
    raw = path.read_bytes()
    text = raw.decode("utf-8-sig", errors="replace")
    try:
        dialect = csv.Sniffer().sniff(text[:4000], delimiters=",;\t")
    except csv.Error:
        dialect = csv.excel
    reader = csv.DictReader(io.StringIO(text), dialect=dialect)
    cols = {}
    for field in reader.fieldnames or []:
        low = field.strip().lower()
        for key, names in COLUMNS.items():
            if key not in cols and low in names:
                cols[key] = field
    if "status" not in cols:
        raise ValueError(f"не нашёл колонку статуса среди {reader.fieldnames}")
    by_name = {p.id.lower(): p.id for p in catalog} | {p.name.lower(): p.id for p in catalog}
    stats = {"added": 0, "pending": 0, "skipped": 0, "duplicates": 0}
    for row in reader:
        status = row.get(cols["status"], "").strip().lower()
        if any(s in status for s in APPROVED):
            st = "approved"
        elif any(s in status for s in PENDING):
            st = "pending"
        else:
            stats["skipped"] += 1   # отклонённые и непонятные
            continue
        source, post_id = parse_subid(row.get(cols.get("subid", ""), "").strip())
        product_id = by_name.get(row.get(cols.get("product", ""), "").strip().lower())
        if not product_id and post_id:
            post = db.one("SELECT product_id FROM posts WHERE id=?", (post_id,))
            product_id = post["product_id"] if post else None
        ext = row.get(cols.get("ext_id", ""), "").strip() or None
        added = db.add_conversion(product_id=product_id, source=source, post_id=post_id,
                                  payout_rub=_num(row.get(cols.get("payout", ""), "")), ext_id=ext, status=st,
                                  ts=_date(row.get(cols.get("date", ""), "")))
        if not added:
            stats["duplicates"] += 1
        elif st == "pending":
            stats["pending"] += 1
        else:
            stats["added"] += 1
    storage.log(f"Импорт конверсий из {path.name}: {stats}")
    return stats


def avg_payout(catalog: list[Product]) -> float:
    paid = [p.payout_rub for p in catalog if p.active and p.payout_rub]
    return sum(paid) / len(paid) if paid else 1000.0


def status_text(st: GoalStatus) -> str:
    pace = "✅ успеваем" if st.on_track else "⚠️ отстаём"
    return (
        f"🎯 Цель: {st.goal} до {st.deadline:%d.%m} — сейчас {st.done} ({st.done / st.goal:.0%}), "
        f"в обработке {st.pending}.\n"
        f"Осталось {max(0, st.goal - st.done)} за {st.days_left} дн. → {st.conv_needed_per_day:.1f}/день "
        f"≈ {st.clicks_needed_per_day} кликов в день.\n"
        f"Конверсия клик→оформление: {st.cr:.1%} ({'факт' if st.cr_is_measured else 'пока допущение'}).\n"
        f"Прогноз к дедлайну: {st.projection} — {pace}.\n"
        f"Клик окупается, если стоит дешевле {st.break_even_cpc:.0f} ₽. "
        f"Добрать остаток посевами ≈ {st.budget_for_rest:,} ₽.".replace(",", " ")
    )


def daily_report(db: DB, catalog: list[Product], today: dt.date | None = None) -> str:
    today = today or dt.date.today()
    st = goal_status(db, today, avg_payout(catalog))
    since = iso(now() - dt.timedelta(days=1))
    clicks = db.all("SELECT source, COUNT(*) n FROM clicks WHERE ts>=? GROUP BY source ORDER BY n DESC", (since,))
    posts = db.all("SELECT status, COUNT(*) n FROM posts WHERE created_at>=? GROUP BY status", (since,))
    lines = [f"📊 Отчёт агента за {today:%d.%m.%Y}", "", status_text(st), ""]
    no_clicks = "нет" if CONFIG.tracker_url else "не считаются — не настроен BANK_TRACKER_URL"
    lines.append("Клики за сутки: " + (", ".join(f"{r['source']} {r['n']}" for r in clicks) or no_clicks))
    lines.append("Посты за сутки: " + (", ".join(f"{r['status']} {r['n']}" for r in posts) or "нет"))
    by_source = performance(db, "source")
    best = sorted(((k, v) for k, v in by_source.items() if v["clicks"] >= 20),
                  key=lambda kv: -(kv[1]["revenue"] / kv[1]["clicks"]))[:3]
    if best:
        lines.append("Лучшие каналы (доход с клика за 30 дн.): " + ", ".join(
            f"{k} {v['revenue'] / v['clicks']:.1f} ₽" for k, v in best))

    todo = []
    for p in catalog:
        if p.active:
            todo += problems(p)
    outbox = storage.outbox_dir()
    drafts = sorted(outbox.glob("*.md"))
    if drafts:
        todo.append(f"опубликуйте вручную {len(drafts)} черновиков (Дзен, видео): {outbox}")
    failed = db.one("SELECT COUNT(*) n FROM posts WHERE status='failed' AND created_at>=?", (since,))["n"]
    if failed:
        todo.append(f"{failed} постов не опубликовались — см. логи")
    actions = storage.load_json("today_actions.json", {})
    if actions.get("date") == storage.today():
        todo += actions.get("owner_actions", [])
        if actions.get("actions_today"):
            lines += ["", "Приоритеты агента сегодня:"] + [f"• {a}" for a in actions["actions_today"]]
    if not db.one("SELECT 1 x FROM conversions LIMIT 1"):
        todo.append("загрузите выгрузку конверсий из кабинета партнёрки: "
                    "python -m bank_agent conversions файл.csv (или /conv в боте)")
    if todo:
        lines += ["", "Нужно от вас:"] + [f"• {t}" for t in todo]
    return "\n".join(lines)


def notify_owner(text: str) -> int:
    """Отправляет текст владельцу во все настроенные мессенджеры. Возвращает число доставок."""
    sent = 0
    targets = []
    if CONFIG.telegram_bot_token:
        targets += [(Telegram(CONFIG.telegram_bot_token), uid) for uid in CONFIG.admin_telegram]
    if CONFIG.max_bot_token:
        targets += [(Max(CONFIG.max_bot_token, CONFIG.max_api_base), uid) for uid in CONFIG.admin_max]
    if CONFIG.vk_group_token:
        targets += [(VK(CONFIG.vk_group_token, CONFIG.vk_group_id), uid) for uid in CONFIG.admin_vk]
    for client, uid in targets:
        for chunk in [text[i:i + 3500] for i in range(0, len(text), 3500)]:
            try:
                client.send(uid, Outgoing(chunk))
                sent += 1
            except Exception as e:  # noqa: BLE001
                storage.log(f"Не удалось отправить отчёт в {client.platform}: {e}")
                break
    return sent
