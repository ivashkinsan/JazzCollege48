# Структура проекта

## Общая структура

```
JazzCollege48/
├── .git/                          # Git-репозиторий
├── .qwen/                         # Настройки IDE
├── dist/                          # Production-сборка (генерируется)
├── node_modules/                  # Зависимости npm
├── public/                        # Статические ресурсы
│   └── favicon.svg                # Иконка сайта
├── src/                           # Исходный код приложения
│   ├── Docs/                      # Документация проекта
│   ├── assets/                    # Графические ресурсы
│   │   ├── hero.png               # Изображение для Hero-секции
│   │   ├── react.svg              # SVG React (шаблон)
│   │   └── vite.svg               # SVG Vite (шаблон)
│   ├── components/                # React-компоненты
│   ├── data/                      # Модули с данными
│   ├── pages/                     # Страницы (резерв)
│   ├── styles/                    # Глобальные стили
│   ├── App.css                    # Стили приложения
│   ├── App.tsx                    # Корневой компонент
│   ├── index.css                  # Глобальные стили
│   ├── main.tsx                   # Точка входа
│   └── vite-env.d.ts              # Типы для Vite
├── lipetsk-college-arts/          # Дополнительные материалы
├── Reference/                     # Референсы и изображения
├── .gitattributes                 # Настройки Git
├── .gitignore                     # Игнорируемые файлы Git
├── eslint.config.js               # Конфигурация ESLint
├── index.html                     # HTML-шаблон
├── package.json                   # Зависимости и скрипты
├── package-lock.json              # Заблокированные версии зависимостей
├── programma_podgotovki_spezialistov_estrada_uglub.txt  # Программа подготовки
├── README.md                      # Описание проекта
├── tsconfig.json                  # Конфигурация TypeScript
├── tsconfig.node.json             # Конфигурация TypeScript для Node
└── vite.config.js                 # Конфигурация Vite
```

## Детальное описание директорий

### /src — Исходный код

Основная директория с исходным кодом приложения.

#### /src/components — React-компоненты

Содержит все компоненты приложения. Каждый компонент состоит из TypeScript-файла и CSS-файла со стилями.

| Компонент | Файлы | Назначение |
|-----------|-------|------------|
| Header | Header.tsx, Header.css | Шапка сайта с навигацией |
| Footer | Footer.tsx, Footer.css | Подвал сайта |
| Hero | Hero.tsx, Hero.css | Главный экран |
| About | About.tsx, About.css | Информация об отделении |
| Specialties | Specialties.tsx, Specialties.css | Специальности и профили |
| Teachers | Teachers.tsx, Teachers.css | Карточки преподавателей |
| Ensembles | Ensembles.tsx, Ensembles.css | Творческие коллективы |
| Achievements | Achievements.tsx, Achievements.css | Достижения студентов |
| Graduates | Graduates.tsx, Graduates.css | Выпускники |
| Concerts | Concerts.tsx, Concerts.css | Афиша концертов |
| News | News.tsx, News.css | Новости |
| Admission | Admission.tsx, Admission.css | Информация для поступающих |
| Contacts | Contacts.tsx, Contacts.css | Контакты |

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
| hero.png | Изображение для главного экрана |
| react.svg | SVG-логотип React (шаблонный) |
| vite.svg | SVG-логотип Vite (шаблонный) |

#### /src/styles — Глобальные стили

| Файл | Описание |
|------|----------|
| variables.css | CSS-переменные для темизации |

#### /src/pages — Страницы

Пустая директория, зарезервирована для будущего расширения (маршрутизация).

#### /src/Docs — Документация

Документация проекта в формате Markdown.

### /public — Публичные ресурсы

Статические файлы, копируемые в сборку без изменений.

| Файл | Описание |
|------|----------|
| favicon.svg | Иконка сайта в формате SVG |

### /Reference — Референсы

Изображения и материалы для дизайна.

| Файл | Описание |
|------|----------|
| 2-music-themes.jpg | Референс музыкальной темы |
| 3-music-themes.jpg | Референс музыкальной темы |
| darl_theme.jpg | Референс темы |
| music20.jpg | Музыкальное изображение |
| music22.jpg | Музыкальное изображение |
| /web | Веб-референсы |

## Конфигурационные файлы

### Корневые конфиги

| Файл | Назначение |
|------|------------|
| package.json | Зависимости, скрипты, метаданные |
| tsconfig.json | Настройки компилятора TypeScript |
| tsconfig.node.json | Настройки TypeScript для Node-окружения |
| vite.config.js | Настройки сборщика Vite |
| eslint.config.js | Правила линтинга |
| .gitignore | Игнорируемые Git-файлы |
| .gitattributes | Атрибуты Git |

### HTML-шаблон

**index.html** — главный HTML-файл приложения:

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

Корневой компонент, собирающий все части приложения:

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
        <Ensembles ensembles={ensembles} />
        <Achievements achievements={achievements} />
        <Graduates graduates={graduates} />
        <Concerts concerts={concerts} />
        <News news={news} />
        <Admission collegeInfo={collegeInfo} />
        <Contacts collegeInfo={collegeInfo} />
      </main>
      <Footer shortName={collegeInfo.shortName} navigation={navigation} />
    </div>
  );
}
```

## Именование файлов

### Компоненты

- **PascalCase** для имён файлов компонентов: `Header.tsx`, `Footer.tsx`
- **kebab-case** для имён CSS-файлов: `Header.css`, `Footer.css`

### Утилиты и данные

- **camelCase** для файлов с данными: `collegeData.ts`

### Конфигурации

- Точка в начале для скрытых файлов: `.gitignore`, `.gitattributes`
- Расширение `.json` для JSON-конфигов
- Расширение `.js` для JS-конфигов
- Расширение `.ts` / `.tsx` для TypeScript-файлов

## Генерируемые директории

### /dist

Создаётся при выполнении `npm run build`. Содержит оптимизированную production-сборку:

- Минифицированные JS и CSS файлы
- Статические ресурсы из /public
- HTML-файлы с подключёнными бандлами

### /node_modules

Создаётся при выполнении `npm install`. Содержит все зависимости проекта. Не коммитится в Git.

## Расширяемость

### Зарезервированные директории

- `/src/pages` — для будущей маршрутизации
- `/src/hooks` — для кастомных хуков (рекомендуется создать)
- `/src/utils` — для утилитных функций (рекомендуется создать)
- `/src/types` — для общих TypeScript-типов (рекомендуется создать)
- `/src/api` — для API-клиентов (рекомендуется создать)
