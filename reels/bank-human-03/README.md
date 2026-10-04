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

**Кадр-образец героев** (генерация изображения, 9:16) — потом стартовый кадр всех видео:

```
Cinematic photo, vertical 9:16. A charming middle-aged banker, about 45, slicked-back silver hair, navy pinstripe three-piece suit, gold tie clip, exaggerated customer-service smile, standing behind a glossy black bank counter. Opposite him a young man, about 20, grey hoodie, white sneakers, holding a phone. Cold modern bank lobby, teal and amber lighting, shallow depth of field, 35mm lens, realistic skin texture, subtle film grain. No logos, no text, no brand colors.
```

**Видео по сценам** (изображение → видео, 9:16, 5 с):

1. `Same characters as the reference image, same lighting and style. Slow dolly-in on the banker's face, his smile slowly widens a bit too much, he tilts his head politely.`
2. `Same characters as the reference image, same lighting and style. The banker gently takes a banknote out of the young man's open wallet with two fingers, smiling and nodding as if it is a favor. The young man looks confused. Medium shot.`
3. `Same characters as the reference image, same lighting and style. The banker shows the young man a phone screen with a notification, then calmly takes a coin from the young man's palm and puts it in his own pocket. Close-up on hands, then faces.`
4. `Same characters as the reference image, same lighting and style. The banker ceremoniously places one tiny coin into the young man's open palm and bows theatrically, like giving a tip. The young man stares at the tiny coin. Close-up.`
5. `Same characters as the reference image, same lighting and style. The banker and the young man take a friendly selfie together; while smiling at the camera, the banker's hand is slipped into the young man's hoodie pocket. Playful, slightly absurd mood.`
6. `Same characters as the reference image, same lighting and style. A bright futuristic bank hall with warm light. A friendly smiling woman in a light suit hands the young man a glowing card; golden coins softly fall from above like confetti. The young man smiles, amazed. Wide shot, slow push-in.`
7. `Same characters as the reference image, same lighting and style. The young man turns and walks away from the counter holding a glowing card; behind him the silver-haired banker freezes with a shocked expression. Camera stays on the banker.`

**Негативный промпт** (во всех сценах): `text, subtitles, letters, logo, watermark, brand colors, distorted hands, extra fingers, deformed face, blurry, low quality, cartoon`

Готовые клипы кладутся в `clips/scene1.mp4` … `clips/scene7.mp4` (без водяного знака Kling).
