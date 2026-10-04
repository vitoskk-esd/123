# Рилс №3 — «Если бы твой банк был человеком»

Формат: ИИ-скетч (клипы Kling) + озвучка владельца с тембром варианта 5 + титры и финальная графика кодом.
Персонаж «Банк» молчит и играет мимикой — без липсинка. Банк собирательный: без названий, логотипов и фирменных цветов.

## Сценарий (~28 с)

| # | Голос | Текст на экране | Клип |
|---|---|---|---|
| 1 | Если бы твой банк был человеком… | ЕСЛИ БЫ БАНК БЫЛ ЧЕЛОВЕКОМ | «Банк» за стойкой, слишком широкая улыбка |
| 2 | …каждый месяц он брал бы с тебя деньги — просто за то, что ты его клиент. | ЗА ОБСЛУЖИВАНИЕ | вынимает купюру из кошелька парня |
| 3 | Ещё немного — за смс о твоих же деньгах. | ЗА СМС | показывает уведомление, забирает монету |
| 4 | А потом гордо возвращал бы тебе один процент. Как чаевые. | КЭШБЭК 1% 🙃 | кладёт крошечную монетку, кланяется |
| 5 | И ты бы с ним дружил. Годами. | И ТАК ГОДАМИ | селфи, рука «Банка» в кармане парня |
| 6 | А другие банки в это время платят новым клиентам — бонусами и кэшбэком, просто за карту. | ДРУГИЕ ПЛАТЯТ ТЕБЕ | светлый зал, светящаяся карта, монеты |
| 7 | Где и сколько — подробный гайд у меня в телеграме. Ссылка в шапке профиля. | ГАЙД В ТГ ↑ ССЫЛКА В ШАПКЕ | парень уходит, «Банк» ошарашен → графика TG |

Дисклеймер в финале: «Реклама. Размер бонусов и условия зависят от банка».

## Клипы (генерирует владелец в Kling вручную)

Главная идея — переходы «зашиты» в генерацию: каждый клип заканчивается тем, из чего начинается следующий
(камера влетает в предмет, монета → монета, «Банк» рассыпается в золото). При монтаже они усиливаются
вспышками, размытием, глитчем и звуком; поверх клипов — голографические ценники и HUD-элементы.

**Кадр-образец героев** (генерация изображения, 9:16):

```
Cinematic photo, vertical 9:16. A charming middle-aged banker, about 45, slicked-back silver hair, navy pinstripe three-piece suit, gold tie clip, exaggerated customer-service smile, standing behind a glossy black bank counter. Opposite him a young man, about 20, grey hoodie, white sneakers, holding a phone. Cold modern bank lobby, teal and amber lighting, shallow depth of field, 35mm lens, realistic skin texture, subtle film grain. No logos, no text, no brand colors.
```

Сцены 1, 3, 5 — «изображение → видео» с образцом как стартовым кадром. Сцены 2, 4, 6, 7 начинаются с крупного плана,
поэтому для них образец подаётся как **референс персонажей** (Elements / Multi-reference), а не как первый кадр.
Все клипы — 9:16, 5 с. Начало каждого промпта: `Same characters as the reference, same lighting and style, cinematic, realistic.`

| # | Промпт (после общего начала) | Переход в следующую сцену |
|---|---|---|
| 1 | `Slow dolly-in on the banker's face, his smile slowly widens a bit too much. At the end the camera pushes extremely close into a bright glint on his gold tie clip until the glint fills the frame with white light.` | **влёт в блик** → белая вспышка |
| 2 | `Starts as an extreme close-up of a banknote, the camera pulls back to reveal the banker gently taking the banknote out of the young man's open wallet with two fingers, smiling and nodding as if it is a favor. At the end the camera makes a fast whip pan to the right with strong motion blur.` | **резкий свайп камеры** |
| 3 | `Starts with a fast whip pan arriving from the left with motion blur. The banker shows the young man a phone with a notification, then takes a coin from the young man's palm. Final shot: extreme close-up of the coin falling into the banker's suit pocket, centered in frame.` | **монета → монета** (склейка по форме) |
| 4 | `Starts with an extreme close-up of a tiny coin falling, centered in frame, landing in the young man's open palm. The banker bows theatrically, like giving a tip. At the end the banker raises a phone toward the camera for a selfie.` | **вспышка камеры** + глитч |
| 5 | `The banker and the young man take a friendly selfie; the banker's hand is slipped into the young man's hoodie pocket. Suddenly the banker freezes and shatters into thousands of golden coins that swirl and fly straight toward the camera, filling the frame.` | **«Банк» рассыпается в монеты** — главный вау-момент |
| 6 | `Golden coins rain down and clear to reveal a bright futuristic bank hall with warm light. A friendly smiling woman in a light suit hands the young man a glowing card. At the end the camera pushes into the glowing card until its light fills the frame.` | **влёт в свет карты** |
| 7 | `Starts from bright white light that fades to reveal the young man walking away holding the glowing card; behind him the silver-haired banker, whole again, freezes with a shocked expression. Camera stays on the banker.` | → стоп-кадр и переход в графику Telegram |

**Негативный промпт** (во всех сценах): `text, subtitles, letters, logo, watermark, brand colors, distorted hands, extra fingers, deformed face, blurry, low quality, cartoon`

Если в Kling есть режим **«первый и последний кадр»**, для сцены 5 он даёт самый эффектный результат: первый кадр — селфи,
последний — кадр, заполненный летящими монетами.

## Нейрографика поверх клипов (монтаж, кодом)

- голографические ценники «−150 ₽», «−₽ за смс», «+1%» возле рук и кошелька — со свечением, сканлайнами и мерцанием;
- глитч и RGB-сдвиг на ключевых словах, титры с «кинетикой» (вылет, дрожь, неон);
- вспышки, размытие движения и «влёт» на склейках, световые блики, зерно и единая цветокоррекция всех клипов;
- звук: свист на свайпе, звон монет, щелчок затвора, «рассыпание» в сцене 5, нарастание перед развязкой;
- финал: стоп-кадр «Банка» трескается и уходит в 3D-пост канала в Telegram со стрелкой «ссылка в шапке».

Готовые клипы — `clips/scene1.mp4` … `clips/scene7.mp4` (без водяного знака Kling).
