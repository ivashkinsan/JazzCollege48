# 3. Структура проекта

## Общая структура

```
JazzCollege48/
├── .git/                          # Git-репозиторий
├── .qwen/                         # Настройки IDE
├── dist/                          # Production-сборка (генерируется)
├── node_modules/                  # Зависимости npm
├── public/                        # Статические ресурсы
│   ├── afisha/images/             # Постеры афиш (портрет А4)
│   ├── foto/                      # Фотографии преподавателей
│   ├── foto_nasha_gordost/        # Фото выпускников «Наша гордость»
│   ├── new_for_sort/              # Сырые файлы для обработки
│   ├── news/images/               # Фото новостей
│   └── favicon.svg
├── scripts/                       # Скрипты обработки
│   ├── add-news.js                # Добавление новостей
│   ├── add-afisha.js              # Добавление афиш
│   └── migrate-news.js            # Миграция .txt → .md
├── src/                           # Исходный код
│   ├── Docs/                      # Документация
│   ├── afisha/                    # Markdown файлы афиш
│   ├── assets/                    # Графические ресурсы
│   ├── components/                # React-компоненты
│   ├── data/                      # Модули с данными
│   ├── news/                      # Markdown файлы новостей
│   │   ├── 2025/
│   │   └── 2026/
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

### /src — Исходный код

#### /src/components — React-компоненты

| Компонент | Файлы | Назначение |
|-----------|-------|------------|
| Header | Header.tsx, Header.module.css | Шапка с навигацией |
| Footer | Footer.tsx, Footer.module.css | Подвал сайта |
| Hero | Hero.tsx, Hero.module.css | Главный экран |
| About | About.tsx, About.module.css | Информация об отделении |
| Specialties | Specialties.tsx, Specialties.module.css | Специальности |
| Teachers | Teachers.tsx, Teachers.module.css | Карточки преподавателей |
| Ensembles | Ensembles.tsx, Ensembles.module.css | Творческие коллективы |
| Achievements | Achievements.tsx, Achievements.module.css | Достижения |
| Graduates | Graduates.tsx, Graduates.module.css | Выпускники («Наша гордость») |
| ConcertsPreview | ConcertsPreview.tsx, ConcertsPreview.module.css | 3 последних афиши на главной |
| NewsPreview | NewsPreview.tsx, NewsPreview.module.css | 3 последних новости на главной |
| Lightbox | Lightbox.tsx, Lightbox.module.css | Полноэкранный просмотр фото |
| Admission | Admission.tsx, Admission.module.css | Поступающим |
| Contacts | Contacts.tsx, Contacts.module.css | Контакты |

#### /src/pages — Страницы

| Страница | Файлы | Назначение |
|----------|-------|------------|
| NewsPage | NewsPage.tsx, NewsPage.module.css | Все новости |
| AfishaPage | AfishaPage.tsx, AfishaPage.module.css | Афиша мероприятий |
| GraduatesPage | GraduatesPage.tsx, GraduatesPage.module.css | Все выпускники |
| AdminPage | AdminPage.tsx, AdminPage.module.css | Администрация |
| PhotosPage | PhotosPage.tsx, PhotosPage.module.css | Фотогалерея |
| VideosPage | VideosPage.tsx, VideosPage.module.css | Видеозаписи |
| DaiPage | DaiPage.tsx, DaiPage.module.css | Детская академия искусств |

#### /src/data — Модули данных

| Файл | Описание |
|------|----------|
| collegeData.ts | Интерфейсы и данные приложения |

Содержит:
- TypeScript-интерфейсы для всех типов данных
- Экспортируемые константы с данными
- Навигационную структуру

#### /src/assets — Графические ресурсы

| Файл | Описание |
|------|----------|
| hero.png | Изображение для Hero-секции |

#### /src/styles — Глобальные стили

| Файл | Описание |
|------|----------|
| variables.css | CSS-переменные для темизации |
| global.css | Глобальные стили (reset, container) |

#### /src/Docs — Документация

Документация проекта в формате Markdown.

---

### /public — Публичные ресурсы

Статические файлы, копируемые в сборку без изменений.

| Файл | Описание |
|------|----------|
| favicon.svg | Иконка сайта в формате SVG |
| foto/*.jpg | Фотографии преподавателей |

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
