# Synapse — landing (React + Vite)

Технически точная реализация лендинга по исходному техническому промпту:
**React 18 + TypeScript + Vite + Tailwind CSS + motion/react (framer motion)
+ lucide-react**, тёмная кинематографичная эстетика (`bg-[#0c0c0c]`),
зацикленное фоновое видео на весь экран, «блестящий» градиентный заголовок,
строка меню в стиле macOS, реалистичный макет рабочей консоли и авторская
обработка карточек «liquid-glass».

Контент адаптирован под нишу **Synapse** — автоматизация бизнес-процессов
на ИИ, генерация презентаций, парсеры и сбор данных, боты. Название
компании, копирайтинг и семантика мокапа (Inbox → «Автоматизации»)
изменены под нишу; цветовая система, градиенты, noise-фильтры, тайминги
анимаций и структура секций воспроизведены как в исходном промпте.

## Запуск

Зависимости ставятся из npm-реестра — в текущей песочнице сессии Claude
Code исходящий доступ к `registry.npmjs.org` заблокирован политикой сети
(`403 Host not in allowlist`), поэтому `npm install` здесь не выполнялся и
директория `node_modules/` не создана. Собрать и запустить проект нужно в
окружении с доступом в интернет:

```bash
cd app
npm install
npm run dev       # локальный сервер разработки
npm run build      # прод-сборка в dist/
```

## Структура

```
index.html                    Точка входа Vite
tailwind.config.js            brand: '#3D81E3', fontFamily sans: Inter
src/main.tsx                  React root
src/index.css                 Google Fonts Inter, .liquid-glass, @keyframes shiny, .c3-* (pricing)
src/App.tsx                   Сборка секций
src/lib/constants.ts          URL фонового видео, градиент заголовка
src/components/
  primitives.tsx              AppleLogo, LogoMark, AppleButton, SectionEyebrow, noise-фильтры
  BackgroundLayer.tsx          Фиксированное фоновое видео + направляющие линии
  Navbar.tsx                   Навигация
  Hero.tsx                     Заголовок с shiny-градиентом
  MenuBarStrip.tsx             Строка меню в стиле macOS
  ConsoleMockup.tsx            Макет рабочей консоли (аналог Inbox mockup)
  FeatureAutopilot.tsx         Секция «Автопилот» (аналог Feature Triage)
  LogoCloud.tsx                Облако логотипов (вымышленные названия)
  Testimonials.tsx             Отзывы (вымышленные лица/компании)
  Pricing.tsx                  Тарифы — секция на кастомном CSS (.c3-*)
  FinalCTA.tsx                 Финальный призыв к действию
```

## Заметка про вымышленные данные

Логотипы клиентов и отзывы используют вымышленные названия компаний и
имена — как и в исходном шаблоне, это демонстрационный контент для
лендинга, не реальные клиенты. Перед продакшн-запуском замените их на
настоящие кейсы.
