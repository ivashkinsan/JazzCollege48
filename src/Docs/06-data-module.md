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

Логика загрузки новостей и афиши использует веб-стандарты для получения контента во время работы приложения. Это позволяет добавлять новый контент без пересборки проекта.

Процесс устроен следующим образом:

1.  **Манифест контента**: В папке `public/media/` находится файл `manifest.json`, который содержит список путей ко всем `.md` файлам контента. Этот манифест автоматически обновляется при запуске скрипта `scripts/add-content.js`.

2.  **Загрузчики (`newsLoader.ts`, `afishaLoader.ts`)**:
    - При первом вызове, загрузчик (например, `loadNews`) сначала запрашивает (`fetch`) файл `/media/manifest.json`.
    - Затем он асинхронно запрашивает (`fetch`) каждый `.md` файл из списка, полученного из манифеста.
    - Каждый файл парсится, и его метаданные проверяются. Например, `loadNews` отбирает только те файлы, у которых в `category` указано `"news"`.
    - Результаты кешируются, чтобы избежать повторных сетевых запросов при навигации по сайту.

### `newsLoader.ts`
- **`loadNews(): Promise<ExtendedNewsItem[]>`**: Асинхронно загружает все `.md` файлы, перечисленные в `public/media/manifest.json`, отбирает новости, парсит их и кэширует результат.

### `afishaLoader.ts`
- **`loadAfisha(): Promise<AfishaItem[]>`**: Аналогично загружает и парсит данные для афиши.

### Использование в компонентах
Импорт и использование в компонентах не изменились.

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
