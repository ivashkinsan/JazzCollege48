# 3. Структура проекта

## Общая структура

```
JazzCollege48/
├── .git/                          # Git-репозиторий
├── dist/                          # Production-сборка (генерируется)
├── node_modules/                  # Зависимости npm
├── public/                        # Статические ресурсы
│   └── media/                     # **ЦЕНТРАЛИЗОВАННЫЙ КОНТЕНТ**
│       ├── 2026/
│       │   └── 2026-01-26-event/  # Папка с контентом события
│       │       ├── cover.jpg
│       │       └── my-event.md    # MD-файл события
│       └── manifest.json          # Манифест для MD-файлов
├── scripts/                       # Скрипты обработки
│   ├── staging/                   # Папка для добавления нового контента
│   │   ├── instructions/
│   │   │   └── README.md          # Инструкция
│   │   └── example-news/          # Пример для добавления новости
│   └── add-content.js             # **ЕДИНЫЙ СКРИПТ ДОБАВЛЕНИЯ КОНТЕНТА**
├── src/                           # Исходный код
│   ├── Docs/                      # Документация
│   ├── assets/                    # Графические ресурсы
│   ├── components/                # React-компоненты
│   ├── data/                      # Модули с данными
│   ├── pages/                     # Страницы приложения
│   ├── styles/                    # Глобальные стили
│   ├── App.tsx                    # Корневой компонент
│   └── main.tsx                   # Точка входа
├── package.json
├── vite.config.js
└── tsconfig.json
```

---

## Детальное описание директорий

### /public — Публичные ресурсы
Статические файлы, копируемые в сборку без изменений.

| Путь | Описание |
|------|----------|
| `/media/` | **Основная папка с контентом.** Здесь хранятся все материалы сайта (новости, афиши), сгруппированные по папкам `год/дата-событие`. Каждая папка содержит `.md` файл и все относящиеся к нему изображения. |
| `/media/manifest.json` | **Манифест контента.** JSON-файл со списком всех `.md` файлов. Используется загрузчиками данных для обнаружения контента. |

### /scripts — Скрипты обработки

| Путь | Описание |
|------|----------|
| `/scripts/staging/` | **Рабочая область для контент-менеджера.** Сюда помещаются папки с новым контентом для обработки. |
| `/scripts/add-content.js` | **Главный скрипт.** Обрабатывает папки в `staging`, создает `.md` файлы и изображения в `public/media`, обновляет манифесты. |

### /src — Исходный код

#### /src/data — Модули данных
Отвечает за предоставление данных приложению.
| Файл | Описание |
|------|----------|
| `newsLoader.ts` | Логика загрузки новостей. |
| `afishaLoader.ts` | Логика загрузки афиши. |
| `parser.ts` | Общие функции для парсинга Markdown. |
| `media-manifest.json` | **Манифест для фото.** JSON-файл, описывающий альбомы и фотографии. Используется страницей "Фотогалерея" и загрузчиками для связи `id` с изображениями. |
| `static/` | Папка со статическими данными (преподаватели, навигация и т.д.), которые не меняются. |

#### Другие папки в `/src`
- `/src/components`: Переиспользуемые React-компоненты.
- `/src/pages`: Компоненты-страницы (например, `NewsPage.tsx`).
- `/src/assets`: Графические ресурсы для UI (иконки, лого и т.д.).
- `/src/styles`: Глобальные стили.
- `/src/Docs`: Документация проекта.

---

## Конфигурационные файлы

### Корневые конфиги

| Файл | Назначение |
|------|------------|
| package.json | Зависимости, скрипты, метаданные |
| tsconfig.json | Настройки TypeScript |
| vite.config.js | Настройки сборщика Vite |
| eslint.config.js | Правила линтинга |
| .gitignore | Игнорируемые Git-файлы |

### HTML-шаблон

**index.html:**
```html
<!doctype html>
<html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Липецкий областной колледж искусств им. К.Н. Игумнова</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

---

## Точки входа

### main.tsx

Точка входа приложения:

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

### App.tsx

Корневой компонент:

```tsx
function App() {
  return (
    <div className="app">
      <Header shortName={collegeInfo.shortName} navigation={navigation} />
      <main className="main">
        <Hero />
        <About department={estradaDepartment} />
        <Specialties department={estradaDepartment} />
        <Teachers teachers={teachers} />
        {/* ... другие компоненты */}
      </main>
      <Footer shortName={collegeInfo.shortName} navigation={navigation} />
    </div>
  );
}
```

---

## Именование файлов

### Компоненты

- **PascalCase** для имён файлов: `Header.tsx`, `Footer.tsx`
- **kebab-case** для CSS-файлов: `Header.module.css`

### Утилиты и данные

- **camelCase**: `collegeData.ts`

### Конфигурации

- Точка в начале: `.gitignore`, `.gitattributes`
- Расширения: `.json`, `.js`, `.ts`, `.tsx`

---

## Генерируемые директории

### /dist

Создаётся при `npm run build`. Содержит оптимизированную production-сборку:
- Минифицированные JS и CSS файлы
- Статические ресурсы из /public
- HTML-файлы с подключёнными бандлами

### /node_modules

Создаётся при `npm install`. Содержит зависимости проекта. Не коммитится в Git.

---

## Расширяемость

### Зарезервированные директории

- `/src/hooks` — для кастомных хуков
- `/src/utils` — для утилитных функций
- `/src/types` — для общих TypeScript-типов
- `/src/api` — для API-клиентов

### Навигация

| Пункт меню | Тип | Путь |
|------------|-----|------|
| Об отделении | Якорь | `#about` |
| Специальности | Якорь | `#specialties` |
| Преподаватели | Якорь | `#teachers` |
| **Афиша** | Страница | `/afisha` |
| **Новости** | Страница | `/news` |
| Выпускники | Страница | `/graduates` |
| ДАИ | Страница | `/dai` |
| Администрация | Страница | `/admin` |
| Фото | Страница | `/photos` |
| Видео | Страница | `/videos` |
| Контакты | Якорь | `#contacts` |
