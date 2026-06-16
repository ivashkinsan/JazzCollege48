# 6. Модуль данных

## Обзор

Модуль данных (`src/data`) отвечает за предоставление всей информации для приложения. Он разделен на несколько частей:
- **Статические данные** (`src/data/static`): Массивы с данными, которые не изменяются во время работы приложения (например, список преподавателей, видео, навигация).
- **Динамические загрузчики** (`src/data/loaders`): Функции для асинхронной загрузки и парсинга данных из Markdown-файлов (новости, афиша).
- **Типы** (`src/types`): Интерфейсы TypeScript, описывающие структуру всех данных.

---

## Структура модуля `src/data`

- `src/data/`
  - `index.ts`: Главный файл, который реэкспортирует динамически загружаемые данные для удобного импорта в компонентах.
  - `parser.ts`: Содержит общие функции `parseMarkdown` и `parseGallery` для разбора `.md` файлов.
  - `newsLoader.ts`: Логика для загрузки новостей (`loadNews`).
  - `afishaLoader.ts`: Логика для загрузки афиши (`loadAfisha`).
  - `static/`: Папка со статическими данными.
    - `videos.ts`: Данные для страницы "Видео".
    - `teachers.ts`: Список преподавателей.
    - `navigation.ts`: Элементы навигации.
    - `...` (и другие статические файлы)

---

## Загрузка динамических данных

Логика загрузки новостей и афиши вынесена в отдельные файлы для лучшей организации.

### `newsLoader.ts`
- **`loadNews(): Promise<ExtendedNewsItem[]>`**: Асинхронно загружает все `.md` файлы из `src/news/**/*.md`, парсит их и кэширует результат.

### `afishaLoader.ts`
- **`loadAfisha(): Promise<AfishaItem[]>`**: Аналогично загружает и парсит данные для афиши из `src/afisha/**/*.md`.

### Использование в компонентах
Импорт происходит из `src/data`, который использует `index.ts` для предоставления нужных функций.

```typescript
import { loadNews } from '../data'; // Импорт из папки data

const [newsData, setNewsData] = useState<ExtendedNewsItem[]>([]);

useEffect(() => {
  loadNews().then(setNewsData);
}, []);
```

---

## Статические данные

Статические данные импортируются напрямую из файлов в `src/data/static`.

### `videos.ts`
Содержит массив `videos` с объектами типа `Video`. Эта страница не использует динамическую загрузку.

```typescript
import type { Video } from "../../types/college";

export const videos: Video[] = [
  {
    id: "v0",
    title: "Видео с эстрадного отделения",
    description: "Видеозапись выступления...",
    videoUrl: "https://rutube.ru/video/private/...",
    date: "2025-04-01",
    source: "rutube",
  },
  // ...
];
```

### Использование в компонентах

```typescript
import { videos } from '../data/static/videos';
import type { Video } from '../types/college';

function VideosPage() {
  const [videoList, setVideoList] = useState<Video[]>([]);

  useEffect(() => {
    setVideoList(videos);
  }, []);
  // ...
}
```
---

## Типы данных

Все интерфейсы перенесены в `src/types/college.ts` для централизованного управления.
```typescript
// src/types/college.ts

export interface Video {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  date: string;
  source: 'rutube' | 'youtube' | 'vk';
}

export interface ExtendedNewsItem {
  // ...
}

// ... и другие типы
```
