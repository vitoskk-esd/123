"""Бот-консультант: подбирает продукт под человека, объясняет условия бонуса,
по согласию напоминает довести оформление до конца. Работает в Telegram, MAX и VK.

Ссылки и маркировку добавляет код по каталогу, модель отвечает только текстом
и выбирает продукты из списка — так она не может подсунуть чужую ссылку или
придумать условия.
"""

from __future__ import annotations

import datetime as dt
import json
import re

from . import storage
from .channels import Button, Incoming, Outgoing
from .config import CONFIG
from .db import DB, anon, iso, now
from .products import Product, link

SOURCE = {"telegram": "bottg", "max": "botmax", "vk": "botvk"}

# Кнопки меню под типы продуктов, которые сейчас продвигаются: (команда, кнопка, вопрос модели).
MENU_BY_TYPE = {
    "credit": [
        ("m:fit", "💳 Подойдёт ли мне кредитка", "Подойдёт ли мне кредитная карта? Расскажи честно про плюсы и минусы"),
        ("m:grace", "📅 Как не платить проценты", "Как работает льготный период и как не платить проценты?"),
        ("m:cash", "💵 Снятие наличных", "Можно ли снимать наличные с кредитки без комиссии?"),
        ("m:activate", "✅ Как активировать карту", "Как активировать кредитную карту после получения?"),
    ],
    "debit": [
        ("m:card", "💳 Подобрать карту", "Помоги подобрать дебетовую карту под мои траты"),
        ("m:bonus", "🎁 Бонус за карту", "Где сейчас можно получить бонус за оформление карты?"),
    ],
    "business": [("m:business", "💼 Для бизнеса", "Нужен счёт для ИП или самозанятого")],
    "savings": [("m:savings", "💰 Накопления", "Куда положить накопления под процент?")],
    "invest": [("m:invest", "📈 Инвестиции", "С чего начать инвестировать?")],
}
MENU_QUESTIONS = {key: q for items in MENU_BY_TYPE.values() for key, _, q in items}

WELCOME = (
    "Привет! Я ИИ-помощник независимого партнёра банков{owner} — не сотрудник банка.\n\n"
    "Помогу честно разобраться в условиях продуктов, которые я рекомендую: подойдут ли они вам, "
    "сколько это стоит и как пользоваться выгодно. Ссылки в моих ответах партнёрские: если "
    "оформите по ним, партнёр получит вознаграждение от банка, для вас условия те же.{credit}\n\n"
    "Никогда не присылайте мне паспортные данные, номер карты и коды из СМС.\n"
    "Команды: /stop — не писать мне первым, /delete — удалить переписку."
)

SCHEMA_TEMPLATE = {
    "type": "object",
    "additionalProperties": False,
    "required": ["reply", "recommend", "quick_replies", "offer_reminder"],
    "properties": {
        "reply": {"type": "string", "description": "ответ человеку, до 700 знаков, без ссылок и разметки"},
        "recommend": {"type": "array", "items": {"type": "string", "enum": []},
                      "description": "id продуктов, на которые дать кнопки (0–2), только если уместно"},
        "quick_replies": {"type": "array", "items": {"type": "string"},
                          "description": "0–3 коротких варианта ответа человека, до 28 знаков"},
        "offer_reminder": {"type": "boolean",
                           "description": "предложить напомнить шаги для бонуса (когда человек выбрал продукт)"},
    },
}

SYSTEM = """Ты — вежливый и честный ИИ-консультант по банковским картам и счетам. Ты работаешь на
независимого партнёра банков (не банк!) и помогаешь человеку выбрать подходящий продукт из каталога.

Как вести диалог:
- Сначала пойми задачу: на что человек тратит (продукты, такси, маркетплейсы, путешествия),
  нужна ли кредитка или дебетовая, ИП ли он, клиентом каких банков уже является (бонусы обычно
  только для новых клиентов). Не больше 1–2 уточняющих вопросов за раз.
- Рекомендуй 1–2 продукта из каталога, объясни, почему именно они подходят, честно назови минусы
  и условия (плата за обслуживание, лимиты кэшбэка). Если ничего из каталога не подходит — так и скажи.
- Объясняй условия бонуса по шагам: что сделать и до какого срока, чтобы банк его начислил.
- Когда человек выбрал продукт — предложи напомнить шаги (offer_reminder=true).

Запреты:
- Факты — только из каталога ниже. Не придумывай ставки, суммы и сроки. Нет данных — скажи, что
  точные условия на странице банка (кнопка будет под сообщением).
- Не обещай одобрение, не давай советов «как обойти проверки банка», не уговаривай брать в долг.
- Не проси паспортные данные, номер карты, коды. Если человек их прислал — предупреди, что так
  делать нельзя, и ничего с ними не делай.
- Не пиши ссылки, @упоминания и Markdown — кнопки добавит система. Пиши коротко, по-человечески.
- На темы, не связанные с банковскими продуктами, отвечай одной фразой и возвращайся к теме.
- Если человек благодарит или доволен — предложи переслать тебя тем, кому тоже пригодится
  (без каких-либо вознаграждений за это).

КАТАЛОГ ПРОДУКТОВ:
"""


def _schema(product_ids: list[str]) -> dict:
    schema = json.loads(json.dumps(SCHEMA_TEMPLATE))
    schema["properties"]["recommend"]["items"]["enum"] = product_ids or ["none"]
    return schema


def _human_delay(hours: int) -> str:
    if hours < 48:
        return "завтра" if hours >= 20 else f"через {hours} ч"
    return f"через {round(hours / 24)} дн."


class Consultant:
    def __init__(self, llm, db: DB, products: list[Product], status_fn=None):
        self.llm, self.db = llm, db
        self.set_products(products)
        self.status_fn = status_fn  # () -> str, для команды /stats

    def set_products(self, products: list[Product]) -> None:
        self.products = {p.id: p for p in products}
        self.system = SYSTEM + "\n\n".join(p.fact_sheet() for p in products)
        self.schema = _schema(list(self.products))

    # --- служебное ----------------------------------------------------------
    def _touch(self, inc: Incoming) -> dict:
        ts = iso(now())
        self.db.execute(
            "INSERT INTO users(platform, user_id, created_at, last_seen) VALUES(?,?,?,?) "
            "ON CONFLICT(platform, user_id) DO UPDATE SET last_seen=excluded.last_seen",
            (inc.platform, inc.user_id, ts, ts))
        return self.db.one("SELECT * FROM users WHERE platform=? AND user_id=?", (inc.platform, inc.user_id))

    def _over_limit(self, user: dict) -> bool:
        day = storage.today()
        count = user["day_count"] + 1 if user["day"] == day else 1
        self.db.execute("UPDATE users SET day=?, day_count=? WHERE platform=? AND user_id=?",
                        (day, count, user["platform"], user["user_id"]))
        return count > CONFIG.bot_daily_limit

    def _history(self, inc: Incoming) -> list[dict]:
        rows = self.db.all("SELECT role, text FROM messages WHERE platform=? AND user_id=? ORDER BY id DESC LIMIT ?",
                           (inc.platform, inc.user_id, CONFIG.bot_history))[::-1]
        while rows and rows[0]["role"] != "user":
            rows.pop(0)
        return [{"role": r["role"], "content": r["text"]} for r in rows]

    def _save(self, inc: Incoming, role: str, text: str) -> None:
        self.db.execute("INSERT INTO messages(platform, user_id, ts, role, text) VALUES(?,?,?,?,?)",
                        (inc.platform, inc.user_id, iso(now()), role, text[:4000]))

    def _product_buttons(self, inc: Incoming, ids: list[str]) -> list[list[Button]]:
        user_hash = anon(f"{inc.platform}:{inc.user_id}")
        rows = []
        for pid in ids[:2]:
            p = self.products.get(pid)
            if p:
                rows.append([Button(f"{p.name} — оформить", url=link(p, SOURCE[inc.platform], None, user_hash))])
        return rows

    @staticmethod
    def _disclosure(p: Product) -> str:
        """Маркировка рекламы и, для кредитов, стоимость кредита — под каждой ссылкой."""
        parts = [p.ad_label + "."]
        if p.credit_disclosure:
            parts.append(p.credit_disclosure)
        parts.append(f"Условия: {p.conditions_url}")
        return "\n".join(parts)

    def menu(self) -> list[list[Button]]:
        items: list[tuple[str, str, str]] = []
        for p in self.products.values():
            for item in MENU_BY_TYPE.get(p.type, []):
                if item not in items:
                    items.append(item)
        return [[Button(title, data=key)] for key, title, _ in items[:4]]

    # --- обработка сообщений ------------------------------------------------
    def handle(self, inc: Incoming) -> list[Outgoing]:
        user = self._touch(inc)
        text = (inc.text or "").strip()
        data = inc.data or ""
        is_admin = inc.user_id in CONFIG.admins(inc.platform)

        if data == "start" or text.lower() in ("/start", "start", "начать"):
            owner = f" ({CONFIG.owner_name})" if CONFIG.owner_name else ""
            credit = ("\n\nКредитные карты — только с 18 лет; решение о выдаче и лимите принимает банк."
                      if any(p.type == "credit" for p in self.products.values()) else "")
            return [Outgoing(WELCOME.format(owner=owner, credit=credit), self.menu())]
        if data == "stop" or text.lower() == "/stop":
            self.db.execute("UPDATE users SET stopped=1 WHERE platform=? AND user_id=?", (inc.platform, inc.user_id))
            self.db.execute("DELETE FROM reminders WHERE platform=? AND user_id=? AND sent_at IS NULL",
                            (inc.platform, inc.user_id))
            return [Outgoing("Хорошо, больше не буду писать первым. Если понадоблюсь — просто напишите.")]
        if text.lower() == "/id":
            return [Outgoing(f"Ваш id в {inc.platform}: {inc.user_id}\nЧтобы получать отчёты агента и команды "
                             f"владельца, впишите его в BANK_ADMIN_{inc.platform.upper()} (python -m bank_agent setup).")]
        if text.lower() == "/delete":
            for table in ("messages", "reminders", "users"):
                self.db.execute(f"DELETE FROM {table} WHERE platform=? AND user_id=?", (inc.platform, inc.user_id))
            return [Outgoing("Готово: переписка и напоминания удалены.")]
        if is_admin and text.startswith("/"):
            reply = self._admin(text)
            if reply:
                return [Outgoing(reply)]
        if data.startswith("r:"):
            return [self._remind(inc, data[2:])]
        if data.startswith("q:"):
            options = json.loads(self.db.get(f"qr:{inc.platform}:{inc.user_id}", "[]"))
            idx = int(data[2:]) if data[2:].isdigit() else -1
            text = options[idx] if 0 <= idx < len(options) else ""
        elif data.startswith("m:"):
            text = MENU_QUESTIONS.get(data, "")
        if not text:
            return [Outgoing("Напишите, что ищете — например «карта с кэшбэком на продукты».", self.menu())]
        if self._over_limit(user):
            return [Outgoing("На сегодня я исчерпал лимит ответов для вас — продолжим завтра 🙏")]
        if re.search(r"\b\d{4}[ -]?\d{4}[ -]?\d{4}[ -]?\d{4}\b", text):
            return [Outgoing("Пожалуйста, никогда не отправляйте номер карты в переписке — ни мне, ни кому-либо "
                             "ещё. Я его не сохраняю. Удалите, пожалуйста, это сообщение.")]

        self._save(inc, "user", text)
        try:
            ans = self.llm.chat(self.system, self._history(inc), self.schema)
        except Exception as e:  # noqa: BLE001
            storage.log(f"Бот: ошибка модели для {inc.platform}:{inc.user_id}: {type(e).__name__}: {e}")
            return [Outgoing("Я сейчас не могу ответить — попробуйте, пожалуйста, через минуту.")]
        reply = ans["reply"].strip()
        self._save(inc, "assistant", reply)

        recommended = [pid for pid in ans["recommend"] if pid in self.products][:2]
        buttons = self._product_buttons(inc, recommended)
        if recommended:
            reply += "\n\n" + "\n".join(self._disclosure(self.products[pid]) for pid in recommended)
        if ans["offer_reminder"] and recommended:
            buttons.append([Button("⏰ Напомнить шаги для бонуса", data=f"r:{recommended[0]}")])
        quick = [q.strip()[:28] for q in ans["quick_replies"] if q.strip()][:3]
        if quick:
            self.db.set(f"qr:{inc.platform}:{inc.user_id}", json.dumps(quick, ensure_ascii=False))
            buttons += [[Button(q, data=f"q:{i}")] for i, q in enumerate(quick)]
        return [Outgoing(reply, buttons)]

    def _remind(self, inc: Incoming, product_id: str) -> Outgoing:
        p = self.products.get(product_id)
        if not p:
            return Outgoing("Этот продукт больше недоступен.")
        self.db.execute("UPDATE users SET stopped=0 WHERE platform=? AND user_id=?", (inc.platform, inc.user_id))
        self.db.execute("DELETE FROM reminders WHERE platform=? AND user_id=? AND sent_at IS NULL",
                        (inc.platform, inc.user_id))
        hours = sorted(p.reminder_hours)[:3] or [24]
        for step, h in enumerate(hours, start=1):
            self.db.execute("INSERT INTO reminders(platform, user_id, product_id, step, due_at) VALUES(?,?,?,?,?)",
                            (inc.platform, inc.user_id, p.id, step, iso(now() + dt.timedelta(hours=h))))
        when = ", ".join(_human_delay(h) for h in hours)
        return Outgoing(f"Договорились: напомню про «{p.name}» ({when}). Отключить — /stop.\n\n"
                        f"Что сделать после получения: {p.target_action}"
                        + (f"\nСовет: {p.reminder_tip}" if p.reminder_tip else ""))

    def reminder_message(self, platform: str, user_id: str, product_id: str, step: int) -> Outgoing | None:
        p = self.products.get(product_id)
        if not p:
            return None
        inc = Incoming(platform, user_id)
        last = step >= len(p.reminder_hours)
        text = (f"Напоминаю про «{p.name}». Если карта уже у вас — следующий шаг: {p.target_action}."
                + (f"\nСовет: {p.reminder_tip}" if p.reminder_tip else "")
                + (f"\nБонус от банка: {p.client_bonus}." if p.client_bonus else "")
                + ("\nЭто последнее напоминание. Если я был полезен — перешлите меня тем, кому тоже пригодится 🙌"
                   if last else "\nЕсли что-то непонятно — просто напишите мне."))
        text += "\n\n" + self._disclosure(p)
        return Outgoing(text, self._product_buttons(inc, [p.id]) + [[Button("Больше не напоминать", data="stop")]])

    def due_reminders(self) -> list[tuple[str, str, Outgoing, int]]:
        """(платформа, пользователь, сообщение, id напоминания) — всё, что пора отправить."""
        rows = self.db.all(
            "SELECT r.* FROM reminders r JOIN users u ON u.platform=r.platform AND u.user_id=r.user_id "
            "WHERE r.sent_at IS NULL AND r.due_at<=? AND u.stopped=0 ORDER BY r.due_at LIMIT 50", (iso(now()),))
        out = []
        for r in rows:
            msg = self.reminder_message(r["platform"], r["user_id"], r["product_id"], r["step"])
            if msg:
                out.append((r["platform"], r["user_id"], msg, r["id"]))
            else:
                self.mark_sent(r["id"])
        return out

    def mark_sent(self, reminder_id: int) -> None:
        self.db.execute("UPDATE reminders SET sent_at=? WHERE id=?", (iso(now()), reminder_id))

    # --- команды владельца ---------------------------------------------------
    def _admin(self, text: str) -> str | None:
        parts = text.split()
        cmd = parts[0].lower()
        if cmd == "/stats":
            return self.status_fn() if self.status_fn else "Статистика недоступна."
        if cmd == "/conv":
            # /conv <кол-во> <id продукта> [канал]
            if len(parts) < 3 or not parts[1].isdigit() or parts[2] not in self.products:
                return "Формат: /conv <кол-во> <id продукта> [канал]. Продукты: " + ", ".join(self.products)
            p = self.products[parts[2]]
            source = parts[3] if len(parts) > 3 else None
            self.db.add_conversion(product_id=p.id, source=source, post_id=None, count=int(parts[1]),
                                   payout_rub=p.payout_rub * int(parts[1]))
            return f"Записал {parts[1]} оформл. по «{p.name}»" + (f" из {source}" if source else "") + "."
        return None
