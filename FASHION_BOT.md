# Бот модного канала (Telegram + Instagram)

Бот сам ведёт канал магазина брендовой оригинальной одежды и обуви:

1. **Мониторит новости.** Каждый проход читает RSS-ленты модных изданий
   (Hypebeast, Highsnobiety, Sneaker News, Vogue, GQ, WWD, Buro 24/7 и др.) и
   публичные Telegram-каналы. Список — в [`fashion_bot/sources.txt`](fashion_bot/sources.txt),
   туда можно дописать любые свои источники.
2. **Выбирает, о чём написать.** Claude смотрит свежие новости (за последние 36 часов)
   и отбирает самые интересные для покупателя брендовой одежды: релизы, коллаборации,
   дропы, новые коллекции. Распродажи чужих магазинов, светскую хронику и повторы тем,
   о которых уже был пост, пропускает.
3. **Пишет пост.** Открывает статью, читает её целиком и пишет два текста: короткий для
   Telegram (влезает в подпись к фото) и подлиннее для Instagram — с вопросом подписчикам
   и хэштегами. Только факты из источника: цены, даты и артикулы не выдумываются.
4. **Берёт фото из новости.** Скачивает все фото статьи, отбрасывает мелкие, дубли и
   вытянутые баннеры. Claude смотрит на сами картинки и выбирает подходящие (товар,
   лукбук, кампания), отбрасывая логотипы, скриншоты и фото с чужими водяными знаками.
5. **Ставит водяной знак магазина** — ваш PNG-логотип или название текстом. Для
   Instagram фото дополнительно приводится к формату ленты 4:5 (1080×1350).
6. **Публикует** в Telegram-канал (фото или альбом) и в Instagram (фото или карусель).
   Если одна площадка дала сбой, вторая всё равно получит пост, а вам придёт сообщение.

## Быстрый старт

Нужен Python 3.10+.

```bash
pip install -r requirements.txt
cp .env.example .env        # впишите ключи (см. ниже)
python -m fashion_bot check     # проверит Telegram, Instagram и источники
python -m fashion_bot collect   # покажет свежие новости (без Claude, бесплатно)
python -m fashion_bot preview   # подготовит 1 пост и пришлёт вам в личку, ничего не публикуя
```

Готовые картинки и тексты каждого поста лежат в `data/fashion_bot/images/<дата-тема>/`.
Когда посты на проверке понравятся — поставьте `FASHION_DRY_RUN=0` и запускайте:

```bash
python -m fashion_bot run       # работать постоянно: пост раз в 2 часа с 9 до 22 по Москве
python -m fashion_bot cycle     # или один проход (для cron)
python -m fashion_bot status    # последние посты
```

Обязательная настройка — ключ Claude: `ANTHROPIC_API_KEY` (console.anthropic.com).

## Telegram

1. Создайте бота у [@BotFather](https://t.me/BotFather) → токен в `TELEGRAM_BOT_TOKEN`.
2. Добавьте бота в канал **администратором** с правом публиковать сообщения.
3. `TELEGRAM_CHANNEL=@имя_канала` (для закрытого канала — числовой id вида `-100…`).
4. `TELEGRAM_ADMIN_CHAT` — ваш личный chat id (узнать у [@userinfobot](https://t.me/userinfobot)).
   Напишите своему боту `/start`, иначе он не сможет вам писать. Сюда приходят
   посты в режиме проверки и сообщения об ошибках.

## Instagram

Работает через официальный API Instagram — нужен **профессиональный аккаунт** (бизнес
или автор; переключается в настройках Instagram бесплатно). Неофициальные способы
(вход по логину и паролю) не используются: за них Instagram блокирует аккаунты.

1. На [developers.facebook.com](https://developers.facebook.com/apps) создайте приложение
   и добавьте продукт **Instagram** → «API setup with Instagram business login».
2. В разделе «Generate access tokens» добавьте свой аккаунт Instagram и нажмите
   **Generate token** — нужны разрешения `instagram_business_basic` и
   `instagram_business_content_publish`. Токен → `INSTAGRAM_ACCESS_TOKEN`,
   id аккаунта (там же) → `INSTAGRAM_USER_ID`. Приложение можно не отправлять на
   проверку Meta: для собственного аккаунта хватает режима разработки.
3. Instagram скачивает фото по публичной ссылке, поэтому бот сначала выкладывает их на
   хостинг. Проще всего бесплатный [imgbb](https://api.imgbb.com): получите ключ →
   `IMGBB_API_KEY` (фото удаляются с хостинга через сутки). Если у вас есть свой
   веб-сервер: `IMAGE_HOST=local`, `PUBLIC_IMAGE_DIR=/var/www/img`,
   `PUBLIC_IMAGE_BASE_URL=https://ваш-сайт/img`.

Токен живёт 60 дней. При работе на своём сервере бот сам продлевает его раз в неделю.
В GitHub Actions продлённый токен сохранить некуда — обновляйте секрет раз в ~50 дней
(если токен истечёт, бот пришлёт ошибку в `TELEGRAM_ADMIN_CHAT`).

Если вход через Facebook-страницу привычнее: `INSTAGRAM_API_HOST=graph.facebook.com`
и токен страницы (он не истекает).

## Водяной знак

| Переменная | По умолчанию | Что делает |
|---|---|---|
| `WATERMARK_LOGO` | — | Путь к PNG-логотипу с прозрачным фоном (можно положить в репозиторий, например `fashion_bot/logo.png`) |
| `WATERMARK_TEXT` | `SHOP_NAME` | Текст, если логотипа нет |
| `WATERMARK_POSITION` | `bottom-right` | `bottom-right`, `bottom-left`, `top-right`, `top-left`, `center`, `tile` (повтор по всему фото) |
| `WATERMARK_OPACITY` | 0.8 | Непрозрачность, 0–1 |
| `WATERMARK_SCALE` | 0.28 | Ширина знака относительно меньшей стороны фото |
| `WATERMARK_FONT` | — | Свой шрифт .ttf для текстового знака (кириллица подбирается автоматически) |
| `INSTAGRAM_FORMAT` | `portrait` | `portrait` — 1080×1350, `square` — 1080×1080 |
| `INSTAGRAM_FIT` | `pad` | `pad` — фото целиком, поля цветом краёв фото; `blur` — поля из размытого фото; `crop` — обрезка |

Проверить, как выглядит знак, на любом своём фото:

```bash
python -m fashion_bot watermark photo.jpg     # результат в data/fashion_bot/watermark_test/
```

## Где запускать

**Свой компьютер или сервер (VPS):** `python -m fashion_bot run` — бот работает
постоянно. Чтобы он поднимался сам после перезагрузки — systemd-юнит
`/etc/systemd/system/fashion-bot.service`:

```ini
[Unit]
Description=Fashion bot
After=network-online.target

[Service]
WorkingDirectory=/opt/123
ExecStart=/usr/bin/python3 -m fashion_bot run
Restart=always

[Install]
WantedBy=multi-user.target
```

`systemctl enable --now fashion-bot`. Если сервер в России и Instagram оттуда
недоступен — используйте зарубежный сервер или GitHub Actions.

**GitHub Actions (бесплатно, без сервера):** workflow
[`.github/workflows/fashion-bot.yml`](.github/workflows/fashion-bot.yml) запускается
каждые 2 часа с 9:23 до 21:23 по Москве, публикует пост и коммитит историю
(`data/fashion_bot/*.json`), чтобы не повторяться.

1. Смёржите ветку в ветку по умолчанию (расписание GitHub запускает только оттуда).
2. **Settings → Secrets and variables → Actions → Secrets:** `ANTHROPIC_API_KEY`,
   `TELEGRAM_BOT_TOKEN`, `TELEGRAM_ADMIN_CHAT`, `INSTAGRAM_USER_ID`,
   `INSTAGRAM_ACCESS_TOKEN`, `IMGBB_API_KEY`.
3. **Variables:** `TELEGRAM_CHANNEL`, `SHOP_NAME`, `SHOP_CTA`, по желанию
   `WATERMARK_LOGO`, `WATERMARK_POSITION`, `FASHION_FOCUS` и др. По умолчанию включён
   режим проверки — когда всё понравится, задайте `FASHION_DRY_RUN=0`.
4. Запустить вручную: **Actions → Fashion bot → Run workflow** (команды `preview`,
   `check`, `collect`). Картинки каждого прогона лежат в артефактах 7 дней.

## Все настройки

| Переменная | По умолчанию | Что делает |
|---|---|---|
| `SHOP_NAME` | MY BRAND STORE | Название магазина (и текст водяного знака) |
| `SHOP_CTA` | — | Строка в конце каждого поста: «Оригиналы в наличии — @my_shop» |
| `FASHION_FOCUS` | кроссовки, стритвир, люкс… | О чём канал — по этому описанию отбираются новости |
| `FASHION_LANGUAGE` | русский | Язык постов |
| `FASHION_SOURCE_CREDIT` | 0 | 1 — подписывать в посте издание, откуда взята новость |
| `FASHION_POSTS_PER_CYCLE` | 1 | Постов за один проход |
| `FASHION_MAX_POSTS_PER_DAY` | 6 | Потолок постов в сутки |
| `FASHION_MAX_AGE_HOURS` | 36 | Новости старше не берутся |
| `FASHION_INTERVAL_MIN` | 120 | Режим `run`: пауза между постами, минут |
| `FASHION_ACTIVE_HOURS` | 9-22 | Режим `run`: в какие часы публиковать |
| `FASHION_TZ` | Europe/Moscow | Часовой пояс |
| `FASHION_IMAGES_PER_POST` | 4 | Максимум фото в посте (до 10) |
| `FASHION_MIN_IMAGE_SIDE` | 600 | Фото меньше этого (px) не берутся |
| `TELEGRAM_HASHTAGS` / `INSTAGRAM_HASHTAGS` | 3 / 15 | Сколько хэштегов в посте |
| `FASHION_DRY_RUN` | 0 (в `.env.example` — 1) | 1 — ничего не публиковать, присылать посты на проверку |
| `FASHION_SOURCES_FILE` | `fashion_bot/sources.txt` | Свой список источников |
| `FASHION_BOT_MODEL` | `claude-opus-5-5` | Модель Claude |

## Важно знать

- **Авторские права.** Фото и тексты новостей принадлежат изданиям и брендам. Бот
  пересказывает новость своими словами; источник в посте не указывается (включить:
  `FASHION_SOURCE_CREDIT=1`). Водяной знак магазина на чужом фото не делает вас его
  автором: если правообладатель попросит убрать публикацию, удаляйте. Пресс-фото
  брендов (релизы, лукбуки) обычно публикуют свободно, а вот авторские съёмки изданий —
  рискованнее; такие источники лучше убрать из `sources.txt`.
- **Некоторые сайты закрываются от ботов** (например, Hypebeast может отдавать
  заглушку вместо ленты). Такой источник просто пропускается, в логе будет запись.
- **Фото из Telegram-каналов** в веб-превью небольшие (около 600–800 px) — в Instagram
  они выглядят мягче, чем фото с сайтов.
- **Стоимость.** Платите только за Claude: один пост — это выбор новости и написание
  текста с просмотром фото, ориентировочно $0.10–0.20 на модели по умолчанию (точно —
  в консоли Anthropic). При 6 постах в день — порядка $20–35 в месяц. Дешевле:
  `FASHION_BOT_MODEL=claude-sonnet-5-5`.
- **Лимиты Instagram:** до 100 публикаций через API за сутки — с запасом.
- **Где что лежит** (`data/fashion_bot/`): `history.json` — какие новости уже
  использованы, `posts.json` — история постов, `images/` — готовые картинки
  (хранятся 7 дней), `logs/` — логи.

## Тесты

```bash
python -m unittest discover -s fashion_bot/tests -t .
```
