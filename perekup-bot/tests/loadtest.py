"""Нагрузочный тест без Telegram: 100 активных людей (PRO / «Простой» / пробный день, 1–3 фильтра), 500 источников
(300 каналов Telegram + 200 сообществ ВК) и плотный поток постов, плюс одновременно люди жмут кнопки в боте.
Сеть Telegram подменена: каждый запрос бота «идёт» 60–180 мс, как в жизни. ИИ выключен (у него свои лимиты).

    python tests/loadtest.py [постов в секунду] [секунд]      # по умолчанию 10 постов/с 60 с — в разы больше реального потока
"""
import asyncio
import random
import resource
import statistics
import sys
import tempfile
import time
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT)); sys.path.insert(0, str(ROOT / "tests"))

from aiogram import Bot
from aiogram.fsm.storage.memory import MemoryStorage
from aiogram.methods import AnswerCallbackQuery, CopyMessage, EditMessageReplyMarkup, GetMe, SendMessage, SendPhoto
from aiogram.types import Chat, Message, MessageId, PhotoSize, User

from config import Config
from ctx import Ctx
from db import DB
from main import build_dispatcher
from pipeline import RawPost, process
from test_flow import FakePay, cb, msg
from words import load_dictionary

RATE = float(sys.argv[1]) if len(sys.argv) > 1 else 10
SECONDS = int(sys.argv[2]) if len(sys.argv) > 2 else 60
random.seed(1)
CARS = [("Toyota Camry", 900, 2600), ("Hyundai Solaris", 500, 1300), ("Kia Rio", 500, 1400), ("Lada Vesta", 600, 1300),
        ("Lada Granta", 350, 900), ("Lada Priora", 180, 450), ("Volkswagen Polo", 500, 1300), ("Skoda Octavia", 600, 2200),
        ("Kia Sportage", 1200, 3200), ("Hyundai Creta", 1200, 2600), ("Renault Logan", 300, 900), ("BMW X5", 1500, 6000),
        ("Toyota RAV4", 1300, 3800), ("Nissan Qashqai", 800, 2500), ("Mazda 6", 800, 2600), ("Chevrolet Lanos", 120, 300)]
CITIES = ["Москва", "Казань", "Самара", "Екатеринбург", "Новосибирск", "Краснодар", "Ростов", "Уфа"]
FILTERS = ["камри до 1,5 млн", "солярис или рио до 1 млн, от 2015", "любая тойота до 2 млн", "веста до 1,1 млн, Москва",
           "приора до 300 тыс", "поло или октавия до 1,2 млн, без битых", "кроссовер до 2,5 млн", "любые до 600 тыс",
           "спортейдж от 2016", "икс5 до 3 млн", "гранта до 700к, без такси", "логан до 600 тыс, Казань", "любые ниже рынка"]


class NetSession:
    """Telegram с задержкой сети: считает запросы и время ответа."""
    def __init__(self):
        from aiogram.client.session.base import BaseSession
        class S(BaseSession):
            async def make_request(s, bot, method, timeout=None):
                await asyncio.sleep(random.uniform(.06, .18))
                self.calls += 1
                if isinstance(method, (AnswerCallbackQuery, EditMessageReplyMarkup)):
                    return True
                if isinstance(method, CopyMessage):
                    return MessageId(message_id=self.calls)
                if isinstance(method, GetMe):
                    return User(id=42, is_bot=True, first_name="Перехват", username="perekhvat_bot")
                if isinstance(method, (SendMessage, SendPhoto)):
                    self.sends += 1
                    photo = [PhotoSize(file_id="plans", file_unique_id="u", width=1080, height=1240)] if isinstance(method, SendPhoto) else None
                    return Message(message_id=self.calls, date=datetime.now(), chat=Chat(id=method.chat_id or 1, type="private"), text="x", photo=photo)
                return True
            async def stream_content(s, *a, **k):
                yield b""
            async def close(s):
                pass
        self.calls = self.sends = 0
        self.session = S()


def post_text(i: int) -> str:
    car, lo, hi = random.choice(CARS)
    year = random.randint(2008, 2023)
    price = random.randint(lo, hi) * 1000
    km = random.randint(20, 280) * 1000
    extra = random.choice(["", "Торг у капота.", "Не бит, не крашен.", "Срочно!", "Один владелец.", "Два ключа, ПТС оригинал."])
    if i % 9 == 0:
        return f"Друзья, новый выпуск обзора уже на канале! Подписывайтесь #{i}"      # не продажа — должно отсеяться
    return f"Продам {car} {year} г., пробег {km:,} км, {random.choice(CITIES)}. {extra} Цена {price:,} ₽. Тел. 8900{i:07d}".replace(",", " ")


async def main() -> None:
    tmp = Path(tempfile.mkdtemp())
    cfg = Config(token="1:x", admins=frozenset({999}), db_path=tmp / "load.db", cars_path=ROOT / "cars.yaml",
                 rk_login="shop", rk_pass1="p1", rk_pass2="p2", basic_delay=5)
    ctx = Ctx(db=await DB(cfg.db_path).open(), cfg=cfg, dict=load_dictionary(cfg.cars_path), pay=FakePay())
    for i in range(300):
        cid, _ = await ctx.db.add_channel(username=f"cars_tg_{i}", base=True)
        await ctx.db.channel_joined(cid, -1001000000000 - i, f"Авто ТГ {i}", f"cars_tg_{i}", "main")
    for i in range(200):
        cid, _ = await ctx.db.add_channel(vk=f"club{50000 + i}", base=True)
        await ctx.db.vk_joined(cid, 50000 + i, f"Авто ВК {i}")
    await ctx.refresh_channels()
    dp = build_dispatcher(ctx); dp["ctx"] = ctx; dp.fsm.storage = MemoryStorage()
    net = NetSession(); bot = Bot("1:x", session=net.session)

    # 100 человек: старт, 1–3 фильтра, тарифы
    users = list(range(10_000, 10_100))
    t0 = time.perf_counter()
    async def onboard(uid, k):
        await dp.feed_update(bot, msg(f"/start {'inst' if k % 2 else 'threads'}", uid))
        for f in random.sample(FILTERS, random.randint(1, 3)):
            await dp.feed_update(bot, msg(f, uid)); await dp.feed_update(bot, cb("f:save", uid))
        plan = "pro" if k < 60 else "basic" if k < 90 else "trial"
        await ctx.db.set_user(uid, paid_until=time.time() + 30 * 86400, plan=plan)
    await asyncio.gather(*(onboard(u, k) for k, u in enumerate(users)))
    print("онбординг готов", flush=True)
    onboard_s = time.perf_counter() - t0
    filters = 0
    for u in users:
        filters += len(await ctx.db.filters(u))

    # поток постов + люди жмут кнопки одновременно
    chans = list(ctx.channels)
    results, ui_times, started = [], [], time.perf_counter()
    async def one_post(i, at):
        await asyncio.sleep(max(0, at - (time.perf_counter() - started)))
        raw = RawPost(random.choice(chans), i, post_text(i), time.time(), None, recv=time.time())
        t = time.perf_counter()
        r = await process(bot, ctx, raw)
        results.append((time.perf_counter() - t, r))
    async def clicker(uid):
        for _ in range(SECONDS // 6):
            await asyncio.sleep(random.uniform(3, 9))
            t = time.perf_counter()
            await dp.feed_update(bot, msg(random.choice(["📊 Статистика", "🚘 Фильтры", "📢 Каналы", "💳 Подписка"]), uid))
            ui_times.append(time.perf_counter() - t)
    n_posts = int(RATE * SECONDS)
    await asyncio.gather(*(one_post(i, i / RATE) for i in range(n_posts)), *(clicker(u) for u in users))
    flow_s = time.perf_counter() - started
    await asyncio.gather(*ctx.background)                 # отложенные «Простого» досылаются
    total_s = time.perf_counter() - started

    proc = sorted(x for x, _ in results)
    lat = sorted(r.latency_ms for _, r in results if r.latency_ms is not None)
    sent = sum(len(r.sent) for _, r in results); delayed = sum(len(r.delayed) for _, r in results)
    cars = sum(1 for _, r in results if r.post_id)
    pct = lambda xs, p: xs[min(len(xs) - 1, int(len(xs) * p))] if xs else 0
    print(f"люди: {len(users)}, фильтров: {filters}, онбординг всех сразу: {onboard_s:.1f} с")
    print(f"источников: {len(chans)} (ТГ 300 + ВК 200)")
    print(f"постов: {n_posts} за {flow_s:.0f} с ({RATE:g}/с), машин с ценой: {cars}")
    print(f"доставлено сразу (PRO/пробный): {sent}, отложено «Простому»: {delayed}, всего запросов к Telegram: {net.calls}")
    print(f"обработка поста (разбор, база, рассылка): медиана {statistics.median(proc) * 1000:.0f} мс, 95% {pct(proc, .95) * 1000:.0f} мс, "
          f"макс {proc[-1] * 1000:.0f} мс")
    if lat:
        print(f"от публикации до первого сообщения: медиана {lat[len(lat) // 2] / 1000:.2f} с, 95% {pct(lat, .95) / 1000:.2f} с, макс {lat[-1] / 1000:.2f} с")
    print(f"кнопки в боте под нагрузкой: {len(ui_times)} нажатий, медиана {statistics.median(ui_times) * 1000:.0f} мс, "
          f"95% {pct(sorted(ui_times), .95) * 1000:.0f} мс, макс {max(ui_times) * 1000:.0f} мс")
    print(f"память процесса: {resource.getrusage(resource.RUSAGE_SELF).ru_maxrss / 1024:.0f} МБ, база: {cfg.db_path.stat().st_size / 1e6:.1f} МБ, "
          f"всего с досылкой: {total_s:.0f} с")
    await ctx.db.close()


if __name__ == "__main__":
    import os
    asyncio.run(main())
    os._exit(0)                                           # поток aiosqlite не держит процесс
