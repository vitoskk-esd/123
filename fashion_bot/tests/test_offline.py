"""Офлайн-тесты: проверяют логику без обращения к Claude, Telegram, Instagram и сайтам.

    python -m unittest discover -s fashion_bot/tests -t .
"""

from __future__ import annotations

import datetime as dt
import io
import json
import sys
import tempfile
import types
import unittest
from pathlib import Path
from unittest import mock

# Позволяет запускать тесты без установленного SDK.
sys.modules.setdefault("anthropic", types.SimpleNamespace(Anthropic=lambda: None))

from PIL import Image  # noqa: E402

from fashion_bot import pipeline, storage, watermark, writer  # noqa: E402
from fashion_bot.article import Photo, download_photos, parse_article  # noqa: E402
from fashion_bot.config import CONFIG  # noqa: E402
from fashion_bot.instagram import Instagram  # noqa: E402
from fashion_bot.sources import (  # noqa: E402
    NewsItem, canonical_url, fresh_items, parse_rss, parse_telegram, read_sources,
)
from fashion_bot.telegram import Telegram  # noqa: E402

RSS = b"""<?xml version="1.0"?>
<rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/">
<channel><title>Fashion News and Trends: Designers, Models, Style Guides - Vogue</title>
<item>
  <title>Nike Air Max 1 &quot;Big Bubble&quot; Returns</title>
  <link>https://example.com/news/air-max-1?utm_source=rss&amp;id=5</link>
  <pubDate>Tue, 06 Oct 2026 10:00:00 +0000</pubDate>
  <description><![CDATA[<p>The classic is back.</p><img src="/img/am1.jpg">]]></description>
  <media:content url="https://cdn.example.com/am1-main.jpg" medium="image"/>
</item>
<item><title>No link item</title></item>
</channel></rss>"""

TG_HTML = """<html><head><meta property="og:title" content="Sneaker Channel"></head><body>
<div class="tgme_widget_message" data-post="sneakchan/101">
  <a class="tgme_widget_message_photo_wrap" style="width:600px;background-image:url('https://cdn4.telesco.pe/file/a.jpg')"></a>
  <a class="tgme_widget_message_photo_wrap" style="background-image:url('https://cdn4.telesco.pe/file/b.jpg')"></a>
  <div class="tgme_widget_message_text">Adidas Samba OG в новой расцветке<br>Релиз 10 октября</div>
  <div class="tgme_widget_message_footer"><a class="tgme_widget_message_date"><time datetime="2026-10-06T09:00:00+00:00"></time></a></div>
</div>
<div class="tgme_widget_message" data-post="sneakchan/102">
  <div class="tgme_widget_message_text">Пост без фото — пропускаем</div>
</div>
</body></html>"""

ARTICLE_HTML = """<html><head>
<meta property="og:image" content="https://cdn.example.com/hero.jpg?w=1200">
</head><body>
<header><img src="/logo.png"></header>
<article>
  <h1>New Balance 990v6 Made in USA</h1>
  <p>New Balance представила новую расцветку модели 990v6 из линейки Made in USA.</p>
  <img srcset="https://cdn.example.com/g1-400.jpg 400w, https://cdn.example.com/g1-1600.jpg 1600w" src="https://cdn.example.com/g1-400.jpg">
  <img src="https://cdn.example.com/author-avatar.jpg">
  <img src="https://cdn.example.com/tiny.jpg" width="120">
  <img data-src="https://cdn.example.com/g2.jpg" src="data:image/gif;base64,AAA">
  <p>Кроссовки поступят в продажу 15 октября по цене 200 долларов.</p>
</article>
<footer><p>Подпишитесь на рассылку, чтобы ничего не пропустить</p></footer>
</body></html>"""


def jpeg(w: int, h: int, color=(200, 30, 30)) -> bytes:
    buf = io.BytesIO()
    Image.new("RGB", (w, h), color).save(buf, "JPEG")
    return buf.getvalue()


def size_of(path: Path) -> tuple[int, int]:
    with Image.open(path) as img:
        return img.size


def item(**kw) -> NewsItem:
    base = dict(
        url="https://example.com/news/1", title="Nike Air Max 1 returns", summary="The classic is back.",
        source="Sneaker News", published=storage.now(), images=["https://cdn.example.com/1.jpg"],
    )
    base.update(kw)
    return NewsItem(**base)


def post_data(**kw) -> dict:
    base = dict(
        suitable=True, reject_reason="", headline="👟 Nike Air Max 1 возвращается",
        telegram_text="Классика снова в продаже. Релиз 10 октября, цена $150.",
        instagram_text="Классика снова в продаже! Релиз 10 октября. А вы ждали?",
        hashtags=["nike", "#Air Max", "кроссовки", "nike"], image_indexes=[2, 1],
    )
    base.update(kw)
    return base


class FakeLLM:
    def __init__(self, answers):
        self.answers = list(answers)
        self.calls = []

    def ask(self, content, **kw):
        self.calls.append((content, kw))
        return self.answers.pop(0)


class Base(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.saved = {k: getattr(CONFIG, k) for k in vars(CONFIG)}
        CONFIG.data_dir = Path(self.tmp.name)
        CONFIG.shop_cta = ""
        CONFIG.source_credit = True
        CONFIG.watermark_logo = ""
        CONFIG.watermark_font = ""

    def tearDown(self):
        for k, v in self.saved.items():
            setattr(CONFIG, k, v)
        self.tmp.cleanup()


class SourcesTests(Base):
    def test_canonical_url(self):
        self.assertEqual(
            canonical_url("https://Example.com/a/b/?utm_source=x&id=5&fbclid=1#top"),
            "https://example.com/a/b?id=5",
        )

    def test_read_sources(self):
        f = Path(self.tmp.name) / "s.txt"
        f.write_text("# комментарий\nhttps://a.com/feed | A Mag\n\n@chan_one\nhttps://t.me/chan_two | Два\n", encoding="utf-8")
        rss, channels = read_sources(f)
        self.assertEqual(rss, [("https://a.com/feed", "A Mag")])
        self.assertEqual(channels, [("chan_one", ""), ("chan_two", "Два")])

    def test_default_sources_file_is_valid(self):
        rss, channels = read_sources()
        self.assertGreater(len(rss), 5)
        self.assertTrue(all(url.startswith("https://") and name for url, name in rss))
        self.assertTrue(channels)

    def test_parse_rss(self):
        items = parse_rss(RSS, "https://www.vogue.com/feed/rss")
        self.assertEqual(len(items), 1)
        it = items[0]
        self.assertEqual(it.source, "Vogue")  # длинное название ленты сокращено
        self.assertEqual(it.url, "https://example.com/news/air-max-1?id=5")
        self.assertEqual(it.title, 'Nike Air Max 1 "Big Bubble" Returns')
        self.assertEqual(it.summary, "The classic is back.")
        self.assertEqual(it.images, ["https://cdn.example.com/am1-main.jpg", "https://example.com/img/am1.jpg"])
        self.assertEqual(it.published, dt.datetime(2026, 10, 6, 10, tzinfo=dt.timezone.utc))
        self.assertEqual(parse_rss(RSS, "https://x.com/rss", "Мой источник")[0].source, "Мой источник")

    def test_parse_telegram(self):
        items = parse_telegram(TG_HTML, "sneakchan")
        self.assertEqual(len(items), 1)
        it = items[0]
        self.assertEqual(it.url, "https://t.me/sneakchan/101")
        self.assertEqual(it.source, "Sneaker Channel")
        self.assertEqual(it.title, "Adidas Samba OG в новой расцветке")
        self.assertIn("Релиз 10 октября", it.summary)
        self.assertEqual(len(it.images), 2)
        self.assertTrue(it.is_telegram)

    def test_fresh_items(self):
        now = storage.now()
        items = [
            item(url="https://a/1", published=now - dt.timedelta(hours=1)),
            item(url="https://a/2", published=now - dt.timedelta(hours=100)),  # старая
            item(url="https://a/3", published=now - dt.timedelta(hours=2)),
            item(url="https://a/4", published=None),  # без даты — считается свежей при первом появлении
        ]
        fresh = fresh_items(items, {"https://a/3": {"status": "posted"}}, max_age_hours=36)
        self.assertEqual([i.url for i in fresh], ["https://a/4", "https://a/1"])


class ArticleTests(Base):
    def test_parse_article(self):
        text, images = parse_article(ARTICLE_HTML, "https://example.com/news/990")
        self.assertIn("990v6", text)
        self.assertIn("15 октября", text)
        self.assertNotIn("рассылку", text)
        self.assertEqual(images, [
            "https://cdn.example.com/hero.jpg?w=1200",
            "https://cdn.example.com/g1-1600.jpg",
            "https://cdn.example.com/g2.jpg",
        ])

    def test_download_filters_small_and_duplicates(self):
        files = {
            "https://c/big.jpg": jpeg(1200, 900),
            "https://c/big-copy.jpg": jpeg(800, 600),  # то же фото поменьше
            "https://c/small.jpg": jpeg(300, 300, (0, 0, 255)),
            "https://c/other.jpg": jpeg(1000, 1000, (20, 200, 20)),
            "https://c/strip.jpg": jpeg(3000, 400, (0, 0, 0)),
        }
        def fake_download(url, referer):
            data = files.get(url)
            if data is None:
                return None
            w, h = Image.open(io.BytesIO(data)).size
            return Photo(url=url, data=data, width=w, height=h)

        img = Image.new("RGB", (1000, 1000), (255, 255, 255))
        img.paste((0, 0, 0), (0, 0, 500, 1000))
        buf = io.BytesIO()
        img.save(buf, "JPEG")
        files["https://c/other.jpg"] = buf.getvalue()

        with mock.patch("fashion_bot.article._download", side_effect=fake_download):
            photos = download_photos(list(files), "https://example.com")
        self.assertEqual([p.url for p in photos], ["https://c/big.jpg", "https://c/other.jpg"])


class WatermarkTests(Base):
    def test_watermark_bottom_right(self):
        CONFIG.shop_name = "SNEAKER VAULT"
        CONFIG.watermark_position = "bottom-right"
        img = Image.new("RGB", (1200, 800), (120, 120, 120))
        out = watermark.apply_watermark(img)
        self.assertEqual(out.size, (1200, 800))
        changed = [(x, y) for x in range(0, 1200, 4) for y in range(0, 800, 4) if out.getpixel((x, y)) != (120, 120, 120)]
        self.assertTrue(changed)
        self.assertTrue(all(x > 600 and y > 600 for x, y in changed))

    def test_watermark_logo_and_tile(self):
        logo = Path(self.tmp.name) / "logo.png"
        Image.new("RGBA", (200, 100), (255, 0, 0, 255)).save(logo)
        CONFIG.watermark_logo = str(logo)
        CONFIG.watermark_opacity = 1.0
        CONFIG.watermark_position = "top-left"
        out = watermark.apply_watermark(Image.new("RGB", (1000, 1000), (0, 0, 0)))
        self.assertEqual(out.getpixel((60, 60)), (255, 0, 0))
        self.assertEqual(out.getpixel((900, 900)), (0, 0, 0))
        tiled = watermark.apply_watermark(Image.new("RGB", (1000, 1000), (0, 0, 0)), position="tile")
        red = sum(1 for x in range(0, 1000, 10) for y in range(0, 1000, 10) if tiled.getpixel((x, y))[0] > 128)
        self.assertGreater(red, 50)

    def test_cyrillic_font(self):
        font = watermark._font(40, "Магазин")
        self.assertTrue(watermark._supports(font, "Магазин"))

    def test_fit_instagram(self):
        for fit in ("pad", "blur", "crop"):
            CONFIG.instagram_fit = fit
            out = watermark.fit_instagram(Image.new("RGB", (1600, 900), (10, 200, 10)))
            self.assertEqual(out.size, (1080, 1350))
        CONFIG.instagram_fit = "pad"
        out = watermark.fit_instagram(Image.new("RGB", (1600, 900), (10, 200, 10)))
        self.assertEqual(out.getpixel((540, 5)), (10, 200, 10))  # поля залиты цветом края
        CONFIG.instagram_format = "square"
        self.assertEqual(watermark.fit_instagram(Image.new("RGB", (500, 900))).size, (1080, 1080))

    def test_prepare_images(self):
        tg, ig = watermark.prepare_images([jpeg(3000, 2000), jpeg(900, 1200)], Path(self.tmp.name) / "out")
        self.assertEqual(len(tg), 2)
        self.assertEqual(size_of(tg[0]), (2048, 1365))
        self.assertEqual(size_of(ig[1]), (1080, 1350))
        with Image.open(ig[0]) as img:
            self.assertEqual(img.format, "JPEG")


class WriterTests(Base):
    def test_hashtags(self):
        self.assertEqual(writer.clean_hashtags(["nike", "#Air Max", "кроссовки!", "NIKE", ""], 10),
                         ["#nike", "#Air_Max", "#кроссовки"])

    def test_telegram_html(self):
        CONFIG.shop_cta = "Оригиналы в наличии — @shop"
        CONFIG.telegram_hashtags = 2
        it = item(url="https://example.com/a?x=1&y=<2>", source="Sneaker <News>")
        html, length = writer.telegram_html(post_data(telegram_text="Цена < $150 & скоро"), it)
        self.assertTrue(html.startswith("<b>👟 Nike Air Max 1 возвращается</b>"))
        self.assertIn("Цена &lt; $150 &amp; скоро", html)
        self.assertIn('<a href="https://example.com/a?x=1&amp;y=&lt;2&gt;">Источник: Sneaker &lt;News&gt;</a>', html)
        self.assertIn("Оригиналы в наличии — @shop", html)
        self.assertTrue(html.endswith("#nike #Air_Max"))
        self.assertLess(length, len(html))  # теги не считаются в лимит

    def test_no_source_credit(self):
        CONFIG.source_credit = False
        it = item(source="Hypebeast")
        html, _ = writer.telegram_html(post_data(), it)
        caption = writer.instagram_caption(post_data(), it)
        self.assertNotIn("Источник", html)
        self.assertNotIn(it.url, html)
        self.assertNotIn("Источник", caption)
        prompt = writer._write_prompt(it, "текст", 2, "")
        self.assertIn("Не упоминай издание", prompt)
        CONFIG.source_credit = True
        self.assertNotIn("Не упоминай издание", writer._write_prompt(it, "текст", 2, ""))

    def test_instagram_caption_trim(self):
        CONFIG.instagram_hashtags = 50
        body = "Предложение номер один. " * 200
        caption = writer.instagram_caption(post_data(instagram_text=body, hashtags=[f"t{i}" for i in range(40)]), item())
        self.assertLessEqual(len(caption), writer.INSTAGRAM_CAPTION_MAX)
        self.assertEqual(caption.count("#"), writer.INSTAGRAM_HASHTAGS_MAX)
        self.assertIn("Источник: Sneaker News", caption)

    def test_validate(self):
        it = item()
        self.assertEqual(writer.validate(post_data(), 3, it), [])
        errs = writer.validate(post_data(telegram_text="x" * 1500, image_indexes=[7]), 3, it)
        self.assertTrue(any("Telegram" in e for e in errs))
        self.assertTrue(any("фото" in e for e in errs))
        self.assertEqual(writer.validate(post_data(suitable=False, headline=""), 3, it), [])

    def test_write_post_retries_and_cleans_indexes(self):
        photos = [Photo(url=f"u{i}", data=jpeg(800, 800), width=800, height=800) for i in range(3)]
        llm = FakeLLM([post_data(telegram_text="x" * 1500), post_data(image_indexes=[3, 3, 9, 1])])
        data = writer.write_post(llm, item(), "текст", photos)
        self.assertEqual(len(llm.calls), 2)
        self.assertEqual(data["image_indexes"], [3, 1])
        retry_prompt = llm.calls[1][0][-1]["text"]
        self.assertIn("не прошёл проверку", retry_prompt)
        self.assertEqual(sum(1 for b in llm.calls[0][0] if b["type"] == "image"), 3)

    def test_select_news(self):
        items = [item(url=f"https://a/{i}", title=f"News {i}") for i in range(5)]
        llm = FakeLLM([{"picks": [{"id": 3, "topic": "t3"}, {"id": 3, "topic": "dup"}, {"id": 99, "topic": "x"},
                                  {"id": 1, "topic": "t1"}]}])
        picks = writer.select_news(llm, items, 5)
        self.assertEqual([(i.url, t) for i, t in picks], [("https://a/2", "t3"), ("https://a/0", "t1")])


class FakePublisher:
    def __init__(self, name, fail=False):
        self.name, self.fail, self.posts = name, fail, []

    def publish(self, post):
        if self.fail:
            raise RuntimeError("API недоступен")
        self.posts.append(post)
        return {"id": len(self.posts)}


class PipelineTests(Base):
    def run_cycle(self, items, answers, publishers, **kw):
        photos = [Photo(url=f"p{i}", data=jpeg(1200, 900, (i * 40, 50, 50)), width=1200, height=900) for i in range(3)]
        with mock.patch.object(pipeline, "collect_all", return_value=items), \
             mock.patch.object(pipeline, "fetch_article", return_value=("текст статьи", ["p0", "p1", "p2"])), \
             mock.patch.object(pipeline, "download_photos", return_value=photos):
            return pipeline.run_cycle(FakeLLM(answers), publishers=publishers, **kw)

    def test_cycle_publishes_and_skips_rejected(self):
        CONFIG.max_posts_per_day = 10
        now = storage.now()  # список новостей сортируется от новых к старым
        items = [item(url="https://a/1", title="Распродажа", published=now),
                 item(url="https://a/2", title="Релиз", published=now - dt.timedelta(hours=1))]
        answers = [
            {"picks": [{"id": 1, "topic": "sale"}, {"id": 2, "topic": "release"}]},
            post_data(suitable=False, reject_reason="распродажа"),
            post_data(),
        ]
        tg, ig = FakePublisher("telegram"), FakePublisher("instagram", fail=True)
        with mock.patch("fashion_bot.telegram.notify_admin") as notify:
            done = self.run_cycle(items, answers, [tg, ig], posts=1, dry_run=False)
        self.assertEqual(done, 1)
        self.assertEqual(len(tg.posts), 1)
        post = tg.posts[0]
        self.assertEqual(len(post.tg_images), 2)
        self.assertEqual(size_of(post.ig_images[0]), (1080, 1350))
        hist = storage.load_history()
        self.assertEqual(hist["https://a/1"]["status"], "rejected")
        self.assertEqual(hist["https://a/2"]["status"], "posted")
        posts = storage.load_posts()
        self.assertEqual(len(posts), 1)
        self.assertIn("error", posts[0]["results"]["instagram"])
        notify.assert_called_once()

    def test_daily_limit(self):
        CONFIG.max_posts_per_day = 1
        storage.add_post({"at": storage.now().isoformat(), "headline": "x", "results": {"telegram": {"message_ids": [1]}}})
        storage.add_post({"at": storage.now().isoformat(), "headline": "y", "results": {"telegram": {"error": "x"}}})
        self.assertEqual(storage.posts_since(storage.now() - dt.timedelta(hours=1)), 1)
        done = self.run_cycle([item()], [], [FakePublisher("telegram")], dry_run=False)
        self.assertEqual(done, 0)

    def test_dry_run_ignores_limit_and_marks_preview(self):
        CONFIG.max_posts_per_day = 0
        pub = FakePublisher("preview")
        done = self.run_cycle([item()], [{"picks": [{"id": 1, "topic": "t"}]}, post_data()], [pub], dry_run=True)
        self.assertEqual(done, 1)
        self.assertEqual(storage.load_history()["https://example.com/news/1"]["status"], "preview")
        self.assertTrue(storage.load_posts()[0]["dry_run"])
        self.assertEqual(storage.posts_since(storage.now() - dt.timedelta(days=1)), 0)


class FakeResponse:
    def __init__(self, payload, status=200):
        self.payload, self.status_code, self.text = payload, status, json.dumps(payload)

    def json(self):
        return self.payload

    def raise_for_status(self):
        pass


class TelegramTests(Base):
    def test_album_and_long_caption(self):
        imgs = []
        for i in range(2):
            p = Path(self.tmp.name) / f"{i}.jpg"
            p.write_bytes(jpeg(100, 100))
            imgs.append(p)
        calls = []

        def fake_post(url, data=None, files=None, timeout=None):
            calls.append((url.rsplit("/", 1)[-1], data, files))
            if url.endswith("sendMediaGroup"):
                return FakeResponse({"ok": True, "result": [{"message_id": 1}, {"message_id": 2}]})
            return FakeResponse({"ok": True, "result": {"message_id": 3}})

        with mock.patch("fashion_bot.telegram.requests.post", side_effect=fake_post):
            ids = Telegram("T").send_post("@chan", imgs, "<b>короткий</b>", 8)
            self.assertEqual(ids, [1, 2])
            media = json.loads(calls[0][1]["media"])
            self.assertEqual(media[0]["caption"], "<b>короткий</b>")
            self.assertEqual(set(calls[0][2]), {"p0", "p1"})

            calls.clear()
            ids = Telegram("T").send_post("@chan", imgs[:1], "x" * 2000, 2000)
            self.assertEqual([c[0] for c in calls], ["sendPhoto", "sendMessage"])
            self.assertNotIn("caption", calls[0][1])
            self.assertEqual(ids, [3, 3])


class InstagramTests(Base):
    def test_carousel_flow(self):
        CONFIG.instagram_host = "graph.facebook.com"
        requests_log = []

        class Uploader:
            def upload(self, path):
                return f"https://img.host/{path.name}"

        def fake_post(url, data=None, timeout=None):
            requests_log.append(("POST", url.rsplit("/", 1)[-1], data))
            if url.endswith("media_publish"):
                return FakeResponse({"id": "MEDIA1"})
            return FakeResponse({"id": f"C{len(requests_log)}"})

        def fake_get(url, params=None, timeout=None):
            return FakeResponse({"status_code": "FINISHED"})

        with mock.patch("fashion_bot.instagram.requests.post", side_effect=fake_post), \
             mock.patch("fashion_bot.instagram.requests.get", side_effect=fake_get):
            ig = Instagram(user_id="42", token="TOKEN", uploader=Uploader())
            media_id = ig.publish([Path("a.jpg"), Path("b.jpg")], "подпись")
        self.assertEqual(media_id, "MEDIA1")
        children = [r for r in requests_log if r[2].get("is_carousel_item") == "true"]
        self.assertEqual([c[2]["image_url"] for c in children], ["https://img.host/a.jpg", "https://img.host/b.jpg"])
        carousel = next(r for r in requests_log if r[2].get("media_type") == "CAROUSEL")
        self.assertEqual(carousel[2]["children"], "C1,C2")
        self.assertEqual(carousel[2]["caption"], "подпись")
        self.assertEqual(requests_log[-1][2]["creation_id"], "C3")

    def test_token_refresh_is_stored(self):
        CONFIG.instagram_host = "graph.instagram.com"
        CONFIG.instagram_token = "OLD"
        from fashion_bot import instagram

        with mock.patch("fashion_bot.instagram.requests.get",
                        return_value=FakeResponse({"access_token": "NEW", "expires_in": 5184000})) as get:
            self.assertEqual(instagram.current_token(), "NEW")
            self.assertEqual(instagram.current_token(), "NEW")  # второй раз — без запроса
            self.assertEqual(get.call_count, 1)
        CONFIG.instagram_token = "REPLACED"  # пользователь вставил новый токен
        with mock.patch("fashion_bot.instagram.requests.get",
                        return_value=FakeResponse({"access_token": "REPLACED2"})):
            self.assertEqual(instagram.current_token(), "REPLACED2")


if __name__ == "__main__":
    unittest.main()
