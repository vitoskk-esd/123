"""Служебная страница ВКонтакте, которая читает сообщества с машинами — как служебный аккаунт Telegram (userbot.py).

Подключается из чата с ботом: админ пишет /vk, открывает ссылку под служебной страницей ВК, жмёт «Разрешить»
и присылает боту адрес из браузера (в нём ключ). Ключ хранится в базе; можно задать и переменной VK_TOKEN.
Посты приходят двумя путями, что раньше — то и уходит (второй раз тот же пост не обрабатывается):
• лента служебной страницы (newsfeed.get) раз в VK_POLL секунд — в ней новые посты всех сообществ сразу;
• запасной опрос стен сообществ по кругу (VK_WALL_RPS сообществ в секунду) — если лента что-то пропустила.
Вступление в сообщества — по одному с паузой VK_JOIN_INTERVAL: на частые вступления ВК отвечает капчей.
ВК разрешает не больше 3 запросов в секунду с одного ключа — запросы идут через общую очередь.
"""
import asyncio
import json
import logging
import re
import time
from collections import deque
from urllib.parse import parse_qs

import aiohttp
from aiogram import Bot

import texts as T
from ctx import VK_KEY, Ctx
from links import channel_name
from pipeline import HISTORY, RawPost, learn_history, process
from userbot import APPROVAL_CHECK, APPROVAL_WAIT, batch_done, notify

log = logging.getLogger(__name__)
API, V = "https://api.vk.com/method/", "5.199"
FLOOD = (6, 9)                 # «слишком часто» / «flood control» — ключ рабочий, ВК просит притормозить
FLOOD_PAUSE = 60               # на сколько притормаживаем опрос после такого ответа
PAUSE_CAPTCHA = 900            # ВК попросил капчу или «слишком часто» — следующее вступление через 15 минут
MENTION = re.compile(r"\[(?:id|club|public)\d+\|([^\]]*)\]")
ERRORS = {100: "сообщество не найдено", 15: "нет доступа к сообществу", 203: "нет доступа к сообществу",
          103: "служебная страница уже в 5000 сообществ — это лимит ВК"}


FIND_MEMBERS = 5000
FIND_CARS = .25                # доля постов «машина с ценой» — меньше, значит барахолка не про авто
CAR_NAME = re.compile(r"авто|машин|тачк|рынок|рынк|барахол|перекуп|продаж|купл|бу\b|б/у|cars?\b|auto|avto|drive|колес|тачек|ваз|лада|"
                      r"toyota|тойот|ниже\s+рынка|подбор|пробег", re.I)
FIND_QUERIES = ["авто барахолка", "автобарахолка", "барахолка авто", "авторынок", "продажа авто", "продам авто", "купить авто",
                "авто с пробегом", "авто бу", "перекуп авто", "авто ниже рынка", "срочный выкуп авто", "авто объявления",
                "продажа автомобилей", "продажа машин", "машины с пробегом", "тачки ниже рынка", "авто россия", "продажа авто россия",
                "авто дешево", "автомобили бу", "барахолка машин", "авторынок россии", "авто срочно продажа", "лада продажа"]
FIND_CITIES = ["москва", "санкт-петербург", "новосибирск", "екатеринбург", "казань", "нижний новгород", "челябинск", "самара",
               "омск", "ростов", "уфа", "красноярск", "воронеж", "пермь", "волгоград", "краснодар", "саратов", "тюмень",
               "тольятти", "ижевск", "барнаул", "ульяновск", "иркутск", "хабаровск", "ярославль", "владивосток", "махачкала",
               "томск", "оренбург", "кемерово", "новокузнецк", "рязань", "астрахань", "пенза", "липецк", "киров", "чебоксары",
               "тула", "калининград", "курск", "ставрополь", "сочи", "белгород", "владимир", "брянск", "чита", "сургут",
               "архангельск", "смоленск", "кострома", "тверь", "иваново", "набережные челны", "грозный", "якутск"]


class VKError(Exception):
    def __init__(self, code: int, text: str):
        super().__init__(f"{text} (код {code})")
        self.code = code


class VK:
    """Запросы к API ВКонтакте от имени служебной страницы."""

    def __init__(self, token: str):
        self.token = token
        self.session: aiohttp.ClientSession | None = None
        self.lock = asyncio.Lock()
        self.last = 0.0

    async def call(self, method: str, **params):
        async with self.lock:                           # не больше 3 запросов в секунду
            await asyncio.sleep(max(0.0, self.last + 0.34 - time.monotonic()))
            self.last = time.monotonic()
        if self.session is None:
            self.session = aiohttp.ClientSession(trust_env=True, timeout=aiohttp.ClientTimeout(total=20))
        data = {k: v for k, v in params.items() if v is not None} | {"access_token": self.token, "v": V}
        async with self.session.post(API + method, data=data) as r:
            js = await r.json(content_type=None)
        if "error" in js:
            raise VKError(js["error"].get("error_code", 0), js["error"].get("error_msg", ""))
        return js["response"]

    async def many(self, method: str, plist: list[dict], per: int = 25) -> list:
        """Пачка одинаковых запросов через execute: до 25 вызовов за один запрос к ВК (лимит — 3 запроса в секунду
        и «flood control» на частые запросы). Неудачный вызов внутри пачки → None."""
        out = []
        for i in range(0, len(plist), per):
            code = "return [" + ",".join(f"API.{method}({json.dumps(p, ensure_ascii=False)})" for p in plist[i:i + per]) + "];"
            out += [r if r is not False else None for r in await self.call("execute", code=code)]
        return out

    async def close(self) -> None:
        if self.session:
            await self.session.close()


def auth_url(app_id: int) -> str:
    return (f"https://oauth.vk.com/authorize?client_id={app_id}&display=page&redirect_uri=https://oauth.vk.com/blank.html"
            f"&scope=friends,wall,groups,offline&response_type=token&v={V}")


def token_from(text: str) -> str | None:
    """Ключ из адреса «https://oauth.vk.com/blank.html#access_token=…&expires_in=0…» или сам ключ."""
    text = text.strip()
    if "access_token=" in text:
        return (parse_qs(text.split("#", 1)[-1].split("?", 1)[-1]).get("access_token") or [None])[0]
    return text if re.fullmatch(r"[\w.\-]{40,}", text) else None


def post_text(item: dict) -> str:
    """Текст поста; репост — свой текст и текст исходного поста. Упоминания [club1|Имя] → «Имя»."""
    parts = [item.get("text") or ""] + [c.get("text") or "" for c in item.get("copy_history") or []]
    return MENTION.sub(r"\1", "\n\n".join(p for p in parts if p.strip())).strip()


def photo_url(item: dict) -> str | None:
    """Первое фото поста (или репоста) в размере до 1280 px — Telegram скачает его по ссылке."""
    atts = list(item.get("attachments") or []) + [a for c in item.get("copy_history") or [] for a in c.get("attachments") or []]
    for a in atts:
        sizes = sorted((a.get("photo") or {}).get("sizes") or [], key=lambda s: s.get("width", 0)) if a.get("type") == "photo" else []
        if sizes:
            fit = [s for s in sizes if s.get("width", 0) <= 1280]
            return (fit[-1] if fit else sizes[0]).get("url")
    return None


def _ref(vk: str) -> str:
    return vk[4:] if re.fullmatch(r"club\d+", vk) else vk


class VKReader:
    def __init__(self, bot: Bot, ctx: Ctx, make_api=VK):
        self.bot, self.ctx, self.make_api = bot, ctx, make_api
        self.api = None
        self.name = ""
        self.error = ""                                        # последняя ошибка ключа — видно в /admin
        self.runner: asyncio.Task | None = None
        self.tasks: set[asyncio.Task] = set()
        self.done: set[tuple[int, int]] = set()                # (сообщество, пост), уже взятые в работу
        self.done_order: deque = deque()
        self.since = 0                                         # с какого времени спрашиваем ленту
        self.last: dict[int, int] = {}                         # сообщество → номер последнего поста на стене

    @property
    def online(self) -> bool:
        return bool(self.runner and not self.runner.done())

    async def resume(self) -> bool:
        env = token_from(self.ctx.cfg.vk_token) if self.ctx.cfg.vk_token else None    # в VK_TOKEN можно вставить и адрес целиком
        token = env or await self.ctx.db.get_setting("vk_token")
        if self.ctx.cfg.vk_token and not env:
            self.error = "в переменной VK_TOKEN нет ключа — вставь адрес со словом access_token целиком"
        if not token:
            return False
        try:
            await self.attach(token)
        except VKError as e:
            self.error = f"ВК не принял ключ: {e}"
            log.warning("служебная страница ВК не подключилась: %s", e)
            return False
        except Exception as e:                  # сеть — пробуем снова, пока не подключимся
            self.error = f"нет связи с ВК: {e} — пробую снова каждые 5 минут"
            log.warning("служебная страница ВК не подключилась: %s", e)
            self.retry_task = asyncio.create_task(self._retry(token))
            return False
        return True

    async def _retry(self, token: str) -> None:
        while True:
            await asyncio.sleep(300)
            try:
                await self.attach(token)
                return
            except Exception as e:
                self.error = f"нет связи с ВК: {e} — пробую снова каждые 5 минут"

    async def attach(self, token: str) -> str:
        """Проверить ключ и начать читать сообщества. Возвращает имя служебной страницы; плохой ключ — VKError."""
        api = self.make_api(token)
        try:
            me = (await api.call("users.get"))[0]
        except VKError as e:
            if e.code not in FLOOD:
                raise
            me = {}                             # ключ рабочий (иначе был бы код 5), просто ВК притормаживает — читаем дальше
        if self.online:
            self.runner.cancel()
        if self.api is not None and self.api is not api and hasattr(self.api, "close"):
            await self.api.close()
        self.api, self.error = api, ""
        self.name = f"{me.get('first_name', '')} {me.get('last_name', '')}".strip() or "служебная страница"
        if self.ctx.cfg.vk_token != token and token_from(self.ctx.cfg.vk_token or "") != token:
            await self.ctx.db.set_setting("vk_token", token)
        self.since = int(time.time())
        await self.ctx.refresh_channels()
        self.runner = asyncio.create_task(self.run())
        log.info("служебная страница ВК «%s» читает сообщества", self.name)
        return self.name

    # ---------- посты ----------
    def groups(self) -> list[int]:
        return [k - VK_KEY for k in self.ctx.channels if k > VK_KEY]

    def _photo(self, url: str):
        async def upload() -> int | None:
            if not self.ctx.buffer_chat:
                return None
            sent = await self.bot.send_photo(self.ctx.buffer_chat, url)    # Telegram сам скачает фото из ВК
            return sent.message_id
        return upload

    def _take(self, gid: int, pid: int, item: dict) -> None:
        """Взять пост в работу — один раз, каким бы путём он ни пришёл первым."""
        key = VK_KEY + gid
        if gid <= 0 or key not in self.ctx.channels or (gid, pid) in self.done:
            return
        self.done.add((gid, pid))
        self.done_order.append((gid, pid))
        if len(self.done_order) > 20000:
            self.done.discard(self.done_order.popleft())
        self.last[gid] = max(self.last.get(gid, 0), pid)
        text = post_text(item)
        if not text:
            return
        url = photo_url(item)
        raw = RawPost(key, pid, text, float(item.get("date") or time.time()), self._photo(url) if url else None, recv=time.time())
        task = asyncio.create_task(self._process(raw))
        self.tasks.add(task)
        task.add_done_callback(self.tasks.discard)

    async def _process(self, raw: RawPost) -> None:
        try:
            await process(self.bot, self.ctx, raw)
        except Exception:
            log.exception("пост ВК %s/%s не обработан", raw.chat_id - VK_KEY, raw.msg_id)

    async def poll_feed(self) -> None:
        """Новые посты из ленты служебной страницы (в ней все сообщества, в которые она вступила)."""
        res = await self.api.call("newsfeed.get", filters="post", start_time=self.since, count=100)
        for it in sorted(res.get("items", []), key=lambda i: i.get("date", 0)):
            self.since = max(self.since, it.get("date", 0))
            self._take(-it.get("source_id", 0), it.get("post_id") or it.get("id"), it)

    async def poll_wall(self, gid: int) -> None:
        """Стена одного сообщества. Первый опрос только запоминает, где мы, — старое не шлём."""
        items = (await self.api.call("wall.get", owner_id=-gid, count=5)).get("items", [])
        if gid not in self.last:
            self.last[gid] = max((it["id"] for it in items), default=0)
            return
        for it in sorted(items, key=lambda i: i["id"]):
            if it["id"] > self.last[gid]:
                self._take(gid, it["id"], it)

    async def poll_loop(self) -> None:
        while True:
            started = time.time()
            try:
                if self.groups():
                    await self.poll_feed()
                    self.error = ""
            except VKError as e:
                self.error = str(e)
                log.warning("лента ВК: %s", e)
                if e.code in FLOOD:
                    await asyncio.sleep(FLOOD_PAUSE)
            except Exception as e:
                log.info("лента ВК: %s", e)
            await asyncio.sleep(max(1.0, self.ctx.cfg.vk_poll - (time.time() - started)))

    async def wall_loop(self) -> None:
        while True:
            groups = self.groups()
            if not groups or self.ctx.cfg.vk_wall_rps <= 0:
                await asyncio.sleep(10)
                continue
            for gid in groups:
                started = time.time()
                try:
                    await self.poll_wall(gid)
                except VKError as e:
                    log.info("стена ВК %s: %s", gid, e)
                    if e.code in FLOOD:
                        await asyncio.sleep(FLOOD_PAUSE)
                except Exception as e:
                    log.info("стена ВК %s: %s", gid, e)
                await asyncio.sleep(max(0.0, 1 / self.ctx.cfg.vk_wall_rps - (time.time() - started)))

    # ---------- поиск новых сообществ ----------
    async def _many(self, method: str, plist: list[dict], per: int) -> list:
        """execute-пачки; «flood control» — ждём и повторяем (3 раза), дальше честная ошибка админу"""
        for attempt in range(4):
            try:
                if hasattr(self.api, "many"):
                    return await self.api.many(method, plist, per)
                out = []
                for p in plist:
                    try:
                        out.append(await self.api.call(method, **p))
                    except VKError as e:
                        if e.code in FLOOD: raise
                        out.append(None)
                return out
            except VKError as e:
                if e.code not in FLOOD or attempt == 3:
                    raise
                log.warning("поиск ВК: %s — жду минуту", e)
                await asyncio.sleep(FLOOD_PAUSE)

    async def find(self, known: set[int], want: int = 50, progress=None) -> tuple[list[dict], dict]:
        """Барахолки с авто по всей России: поиск ВК по фразам и городам → открытые, 5000+ подписчиков →
        стена: в скольких из 7 прошлых дней было 3+ поста и какая доля постов — продажа машины с ценой.
        Запросы — пачками через execute (их около 40 вместо 700). → (подходящие, цифры по каждому шагу)"""
        ids: dict[int, int] = {}
        queries = list(FIND_QUERIES) + [f"{w} {c}" for c in FIND_CITIES for w in ("авто", "авторынок")]
        found = await self._many("groups.search", [{"q": q, "country_id": 1, "count": 100} for q in queries], 25)
        for res in found:
            for g in (res or {}).get("items", []):
                if g["id"] not in known and not g.get("is_closed") and CAR_NAME.search(g.get("name", "")):
                    ids[g["id"]] = ids.get(g["id"], 0) + 1
        stats = {"queries": len(queries), "answered": sum(r is not None for r in found), "found": len(ids)}
        if progress:
            await progress(f"нашёл автомобильных открытых групп: {len(ids)} — смотрю подписчиков")
        groups: list[dict] = []
        idl = list(ids)
        for i in range(0, len(idl), 400):
            res = await self.api.call("groups.getById", group_ids=",".join(map(str, idl[i:i + 400])), fields="members_count")
            groups += res.get("groups", []) if isinstance(res, dict) else res
        groups = sorted((g for g in groups if (g.get("members_count") or 0) >= FIND_MEMBERS and not g.get("deactivated")),
                        key=lambda g: -g["members_count"])
        stats["big"] = len(groups)
        if progress:
            await progress(f"с 5000+ подписчиков: {len(groups)} — смотрю, как часто постят")
        from parse import parse_post
        msk = 3 * 3600
        today = int((time.time() + msk) // 86400)
        out: list[dict] = []
        walls = await self._many("wall.get", [{"owner_id": -g["id"], "count": 100} for g in groups], 10)
        stats["active"] = 0
        for g, res in zip(groups, walls):
            posts = [it for it in (res or {}).get("items", []) if not it.get("is_pinned")]
            per_day: dict[int, int] = {}
            for it in posts:
                day = int((it.get("date", 0) + msk) // 86400)
                if today - 7 <= day < today:                              # 7 полных прошлых дней
                    per_day[day] = per_day.get(day, 0) + 1
            busy = sum(c >= 3 for c in per_day.values())
            if busy < 5:
                continue
            stats["active"] += 1
            texts = [t for t in (post_text(it) for it in posts[:50]) if t]
            cars = sum(bool((L := parse_post(t, self.ctx.dict)).make and L.price) for t in texts)
            share = cars / max(1, len(texts))
            if share >= FIND_CARS:
                out.append({"id": g["id"], "name": g.get("name", ""), "screen": g.get("screen_name") or f"club{g['id']}",
                            "members": g["members_count"], "week": sum(per_day.values()), "busy": busy, "cars": round(share * 100)})
        stats["fit"] = len(out)
        return sorted(out, key=lambda g: (-g["week"], -g["members"]))[:want], stats

    # ---------- вступление в сообщества ----------
    async def group(self, vk: str) -> dict:
        res = await self.api.call("groups.getById", group_id=_ref(vk), fields="is_member")
        groups = res.get("groups", []) if isinstance(res, dict) else res     # 5.199 отвечает {"groups": [...]}
        if not groups:
            raise VKError(100, "сообщество не найдено")
        return groups[0]

    async def join_one(self, row) -> int | None:
        """Вступить в сообщество из очереди. Вернёт паузу до следующего вступления, если ВК просит подождать."""
        try:
            g = await self.group(row["vk"])
            if not g.get("is_member"):
                if g.get("deactivated"):
                    return await self._failed(row, "сообщество удалено или заблокировано")
                if g.get("is_closed") == 2:
                    return await self._failed(row, "частное сообщество — вступить можно только по приглашению")
                await self.api.call("groups.join", group_id=g["id"])
                if g.get("is_closed") == 1:                     # закрытое — заявка ушла админу сообщества
                    return await self._awaiting(row, g)
        except VKError as e:
            if e.code in (6, 9, 14):                            # слишком часто / капча — оставляем в очереди
                log.warning("ВК просит подождать перед вступлением: %s", e)
                return PAUSE_CAPTCHA if e.code != 6 else 5
            if e.code == 5:                                     # ключ отозван
                self.error = str(e)
                return 300
            return await self._failed(row, ERRORS.get(e.code, str(e)))
        await self._joined(row, g)

    async def _joined(self, row, g: dict, approved: bool = False) -> None:
        await self.ctx.db.vk_joined(row["id"], g["id"], g.get("name") or "")
        await self.ctx.refresh_channels()
        ch = await self.ctx.db.channel_by_vk(g["id"])
        name = channel_name(ch)
        if approved:
            for uid in await self.ctx.db.pop_approval_waiters(row["id"]) + (
                    await self.ctx.db.pop_approval_waiters(ch["id"]) if ch["id"] != row["id"] else []):
                await notify(self.bot, uid, T.CHANNEL_APPROVED.format(name=name))
            return
        waiters = await self.ctx.db.pop_waiters(row["id"]) + (await self.ctx.db.pop_waiters(ch["id"]) if ch["id"] != row["id"] else [])
        for uid in waiters:
            await notify(self.bot, uid, T.CHANNEL_JOINED.format(name=name))
            await batch_done(self.bot, self.ctx, uid, ch["id"], 1)

    async def _awaiting(self, row, g: dict) -> None:
        name = "ВК · " + (g.get("name") or row["vk"])
        for uid in await self.ctx.db.channel_awaiting(row["id"], g.get("name")):
            await notify(self.bot, uid, T.CHANNEL_AWAITING.format(name=name))
            await batch_done(self.bot, self.ctx, uid, row["id"], 2)

    async def _failed(self, row, error: str) -> None:
        await self.ctx.db.channel_failed(row["id"], error)
        name = channel_name(row)
        for uid in await self.ctx.db.pop_waiters(row["id"]):
            await notify(self.bot, uid, T.CHANNEL_FAILED.format(name=name, error=error))
            await batch_done(self.bot, self.ctx, uid, row["id"], 0)

    async def check_approvals(self) -> None:
        """Одобрил ли админ закрытого сообщества заявку. Неделю без ответа — сдаёмся и говорим об этом."""
        for row in await self.ctx.db.awaiting_channels("vk"):
            try:
                g = await self.group(row["vk"])
            except Exception as e:
                log.info("заявка в ВК %s: %s", row["vk"], e)
                continue
            if g.get("is_member"):
                await self._joined(row, g, approved=True)
            elif time.time() - (row["awaiting_at"] or time.time()) > APPROVAL_WAIT:
                await self.ctx.db.channel_failed(row["id"], "админ не одобрил заявку")
                for uid in await self.ctx.db.pop_approval_waiters(row["id"]):
                    await notify(self.bot, uid, T.CHANNEL_NOT_APPROVED.format(name=channel_name(row)))

    async def join_loop(self) -> None:
        checked = 0.0
        while True:
            started, queued, pause = time.time(), [], None
            try:
                queued = await self.ctx.db.queued_channels("vk")
                if queued:
                    pause = await self.join_one(queued[0])
                if started - checked > APPROVAL_CHECK:
                    checked = started
                    await self.check_approvals()
            except Exception:
                log.exception("ошибка при вступлении в сообщество ВК")
            wait = (pause or self.ctx.cfg.vk_join_interval) if queued else 15
            await asyncio.sleep(max(5, wait - (time.time() - started)))

    async def history_loop(self) -> None:
        """Один раз на сообщество: последние HISTORY постов со стены — в оценку рынка."""
        await asyncio.sleep(20)
        while True:
            for ch in await self.ctx.db.history_todo("vk"):
                try:
                    items = []
                    for offset in range(0, HISTORY, 100):
                        items += (await self.api.call("wall.get", owner_id=-ch["vk_id"], count=100, offset=offset)).get("items", [])
                    n = await learn_history(self.ctx, dict(ch), [(it["id"], post_text(it), float(it.get("date", 0))) for it in items])
                    log.info("история ВК %s: %d машин с ценой — в оценку рынка", ch["title"], n)
                except Exception as e:
                    log.info("история ВК %s: %s", ch["title"], e)
                    await self.ctx.db.set_history(ch["id"])
                await asyncio.sleep(3)
            await asyncio.sleep(60)

    async def run(self) -> None:
        await asyncio.gather(self.join_loop(), self.poll_loop(), self.wall_loop(), self.history_loop())
