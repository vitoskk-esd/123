# Картинки для объявления на Авито: «Тестировщик удалённо»

Готовые файлы лежат в `out/`. Формат 4:3 (2400×1800), как в галерее Авито:

| Файл | Что это |
|------|---------|
| `out/1-oblozhka.jpg` | Обложка: заголовок, окно с прогоном тестов, найденный баг |
| `out/2-podrobnosti.jpg` | Вторая картинка: что входит в работу, инструменты, формат |
| `out/3-foto-paren.jpg` | Вариант с живым человеком и простой подписью |
| `out/3-foto-devushka.jpg` | То же самое с другим фото |

Главный текст стоит по центру, поэтому он не обрежется, если Авито покажет превью квадратом.
Контактов на картинках нет: Авито не разрешает размещать их на фото.

## Как изменить

Макеты сделаны на HTML (`cover.html`, `details.html`, `photo.html`, общие стили в `style.css`).
Поправьте текст и перерисуйте картинки:

```bash
NODE_PATH="$(npm root -g)" node avito/tester-remote/render.cjs            # все
NODE_PATH="$(npm root -g)" node avito/tester-remote/render.cjs photo      # только фото-варианты
```

Чтобы поставить своё фото, положите его в `photos/` и укажите в `render.cjs`
(`?img=photos/ваше.jpg&pos=50%25`, где `pos` сдвигает кадр по горизонтали).

## Фото

Оба фото бесплатные, по [Unsplash License](https://unsplash.com/license): коммерческое использование разрешено, указывать автора не обязательно.

- `photos/man.jpg`: Vitaly Gariev, [unsplash.com/photos/M9gGJqvAMGE](https://unsplash.com/photos/a-man-smiles-while-working-on-a-laptop-M9gGJqvAMGE)
- `photos/woman.jpg`: Vitaly Gariev, [unsplash.com/photos/s3hlZ-gdfdQ](https://unsplash.com/photos/a-smiling-woman-works-on-a-laptop-at-a-desk-s3hlZ-gdfdQ)
