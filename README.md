# AppFreeze Pro — лендинг и воронка

Минималистичная посадочная страница ([index.html](index.html)) для воронки
App Store (Lite) ➔ Web (Pro). Полная стратегия — в [../docs/ТЗ-Lite.md](../docs/ТЗ-Lite.md).

## Как это связано с приложением

В коде Lite зашит **только** короткий редирект `ProUpsell.storeURL`
(сейчас `https://dub.sh/appfreeze-pro`). Цепочка:

```
кнопка в Lite → https://dub.sh/appfreeze-pro (Dub.co)
   → этот лендинг (GitHub Pages)
      → Setapp (подписка)  |  Lemon Squeezy (разовая лицензия)
```

Адрес лендинга можно менять в панели Dub.co без обновления приложения.

## Что подставить (плейсхолдеры в index.html)

- **Setapp** — `href` кнопки «Open in Setapp» → реальный URL приложения в каталоге.
- **Lemon Squeezy** — `href` кнопки «Buy lifetime license» → checkout/buy-URL продукта.
- Цена `$4.99` — при необходимости поправить.

## Скриншоты Pro (секция «What AppFreeze Pro does»)

Секция функционала ждёт **retina (2×) PNG** в `landing/img/`. Пока их нет — на
странице показаны пунктирные плейсхолдеры с именем нужного файла.

Нужные файлы:

| Файл | Что снять |
|------|-----------|
| `img/switch-apps.png` | клик по строке выводит приложение вперёд / сворачивает |
| `img/freeze-toggles.png` | верх панели: свитчи Freeze All / Freeze Selected |
| `img/smart-mode.png` | приложение размораживается при фокусе / морозится при уходе |
| `img/energy-monitor.png` | строка с %CPU и точкой Low/Med/High |
| `img/shortcut-login.png` | меню «Shortcut» / «Launch at Login» |
| `img/safety.png` | защищённые: активное приложение / Finder / системные |

### Как снять в высоком разрешении

> ⚠️ Поповер строки меню нельзя открыть скриптом и нельзя снять офлайн-рендером
> (`ImageRenderer` рисует нативные свитчи заглушками). Снимаем живьём.

1. Собрать и запустить **Pro** (без песочницы):
   ```bash
   xcodebuild -project AppFreeze.xcodeproj -scheme AppFreeze \
     -configuration Debug -destination 'platform=macOS' -derivedDataPath build build
   open build/Build/Products/Debug/AppFreeze.app
   ```
2. Кликнуть иконку в строке меню — открыть панель.
3. Снять **окно** панели в retina (на Retina-маке масштаб 2× автоматически),
   без тени:
   ```bash
   screencapture -i -o ~/Desktop/shot.png
   # нажать ПРОБЕЛ (режим окна) → кликнуть по панели
   ```
4. Положить файл в `landing/img/` под нужным именем из таблицы.
5. В `index.html` заменить плейсхолдер на картинку:
   ```html
   <div class="shot"><img src="img/freeze-toggles.png" alt="Freeze toggles" loading="lazy"></div>
   ```

Рекомендация: ширина исходника ≥ 700 px (панель ~250 pt × 2–3×). CSS сам
впишет по ширине колонки, retina-чёткость сохранится.

## Деплой на GitHub Pages

Pages умеет раздавать из ветки + папки. Варианты:

1. **Отдельная ветка `gh-pages`** (рекомендуется, чтобы не мешать основному репо):
   ```bash
   git subtree push --prefix landing origin gh-pages
   ```
   Затем Settings → Pages → Source: `gh-pages` / `/ (root)`.

2. **Папка `/landing` в основной ветке** не поддерживается напрямую (Pages умеет
   только `/` или `/docs`). Если хочется из main — переименуй папку в `docs/` или
   используй вариант 1.

После публикации страница будет на `https://<user>.github.io/<repo>/`.

## Настройка «вечного» редиректа (Dub.co)

1. Завести короткую ссылку с тем же slug, что в `ProUpsell.storeURL`
   (`appfreeze-pro`), указывающую на URL Pages.
2. При смене хостинга/домена — менять только destination в Dub.co (~5 сек),
   приложение не трогать.
3. Если финальный slug будет другим — обновить `ProUpsell.storeURL` и тест
   `test_proUpsell_usesEternalRedirectOnly` (проверяет host `dub.sh`).

## Комплаенс (App Store 3.1.1)

Лендинг — информационный. В самом приложении нельзя зазывать на внешнюю оплату
напрямую или словами «дешевле/купить напрямую» — только нейтральное
«Learn more about Pro» со ссылкой на этот лендинг (где уже выбор оплаты).
