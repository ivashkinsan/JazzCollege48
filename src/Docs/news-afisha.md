# Новости и Афиши

## Обзор

Система управления новостями и афишами мероприятий эстрадного отделения. Новости хранятся в формате Markdown с frontmatter, афиши — аналогично, но с дополнительными полями (время, место проведения).

---

## Структура файлов

### Новости

```
src/news/
├── 2025/
│   ├── 2025-10-06-valeriya-baranova-rossiyskaya-studencheskaya-vesna.md
│   ├── 2025-10-29-30-sentyabrya-studenty-i-prepodavatel-spetsialnosti.md
│   ├── 2025-11-23-21noyabrya-studenty-spetsialnosti-muzykalnoe-iskuss.md
│   └── 2025-12-17-v-kolledzhe-iskusstv-sostoyalsya-master-klass-ivana-ch.md
└── 2026/
    ├── 2026-01-26-25-yanvarya-v-dome-muzyki-sostoyalas-jazz-vecherinka.md
    ├── 2026-01-28-glotok-svezhego-dzhaza-v-polden.md
    ├── 2026-03-06-vesna-prishla-v-ritme-dzhaza.md
    ├── 2026-03-10-11-12-marta-v-1230-my-priglashaem-na-kontsert-ves.md
    ├── 2026-03-12-12marta-zavershilsya-nash-dzhazovyy-marafonna-kontsert.md
    ├── 2026-03-23-pozdravlyaem-pobediteley.md
    └── 2026-10-30-na-spetsialnosti-muzykalnoe-iskusstvo-estrady.md

public/news/images/{год}/{дата}-{slug}/
├── cover.jpg          # Обложка новости
├── gallery-1.jpg      # Дополнительные фото
└── gallery-2.jpg
```

### Афиши

```
src/afisha/
├── 2024-04-22-dzhazovyy-festival-soberet-molodezhnye-kollektivy-rossii-v-l.md
├── 2026-03-06-vesna-zhenshchina-i-lyubov.md
├── 2026-03-31-dzhazovyy-dzhem-seyshn-v-biblioteke.md
└── 2026-04-08-jazz-vecherinka.md

public/afisha/images/{год}/{дата}-{slug}/
└── cover.jpg          # Постер-афиша (портрет А4)
```

---

## Формат Markdown файлов

### Новость

```markdown
---
title: "Заголовок новости"
date: 2026-03-06
category: konzert
cover: /news/images/2026/2026-03-06-vesna-prishla-v-ritme-dzhaza/cover.jpg
tags: []
---

Текст новости...

<!-- gallery -->
- /news/images/2026/2026-03-06-vesna-prishla-v-ritme-dzhaza/gallery-1.jpg
- /news/images/2026/2026-03-06-vesna-prishla-v-ritme-dzhaza/gallery-2.jpg
```

### Афиша

```markdown
---
title: "Название мероприятия"
date: 2026-03-31
time: "19:00"
venue: Библиотека, Октябрьская, 28, 3 этаж
cover: /afisha/images/2026/2026-03-31-dzhazovyy-dzhem-seyshn-v-biblioteke/cover.jpg
tags: []
---

Описание мероприятия...
```

### Категории новостей

| Значение | Иконка | Описание |
|----------|--------|----------|
| `konzert` | 🎵 | Концерт |
| `konkurs` | 🏆 | Конкурс/фестиваль |
| `masterclass` | 🎓 | Мастер-класс |
| `announcement` | 📢 | Объявление |

---

## Как добавить новость

### Быстрый способ (скрипт)

1. Положи файлы в `public/new_for_sort/`:
   - **Фото**: `NewsName_1.jpg`, `NewsName_2.jpg`...
   - **Текст**: `NewsName.txt` (первая строка = заголовок, остальное = текст)
2. Запусти: `node scripts/add-news.js`
3. Скрипт автоматически:
   - Создаст папку для изображений
   - Переименует фото (`cover.jpg`, `gallery-1.jpg`...)
   - Создаст `.md` файл в `src/news/{год}/`
   - Удалит обработанные файлы из `new_for_sort/`

### Ручной способ

1. Создай папку: `public/news/images/{год}/{дата}-{slug}/`
2. Скопируй фото: `cover.jpg`, `gallery-1.jpg`...
3. Создай `.md`: `src/news/{год}/{дата}-{slug}.md`

---

## Как добавить афишу

### Быстрый способ (скрипт)

1. Положи файлы в `public/new_for_sort/`:
   - **Фото**: `EventName.jpg` (портрет А4)
   - **Текст**: `EventName.txt`
2. Запусти: `node scripts/add-afisha.js`
3. Скрипт определяет дату, время, место из текста

> **Формат даты в тексте:** `31 марта`, `22 апреля`  
> **Время:** `19:00` или `🕖 19:00`  
> **Место:** `📍 Дворец культуры`

### Ручной способ

1. Создай папку: `public/afisha/images/{год}/{дата}-{slug}/`
2. Скопируй постер: `cover.jpg`
3. Создай `.md`: `src/afisha/{дата}-{slug}.md`

---

## Компоненты

### NewsPreview (главная страница)

**Путь:** `src/components/NewsPreview.tsx`

- Показывает 3 последние новости
- Кнопка «Читать далее →» для раскрытия полного текста
- Кнопка «Все новости →» ведёт на `/news`

### NewsPage (страница новостей)

**Путь:** `src/pages/NewsPage.tsx`

- Все новости с фильтрацией по категориям
- Раскрытие текста, галерея фото
- Lightbox для просмотра фото на весь экран

### ConcertsPreview (главная страница)

**Путь:** `src/components/ConcertsPreview.tsx`

- 3 ближайших мероприятия из афиши
- Сортировка по дате (от ближайших к дальним)
- Кнопка «Вся афиша →» ведёт на `/afisha`

### AfishaPage (страница афиши)

**Путь:** `src/pages/AfishaPage.tsx`

- Разделение на «Предстоящие» и «Прошедшие» события
- Постеры отображаются целиком (`object-fit: contain`)
- Высота обложки: 380px (десктоп), 320px (мобильный)
- Lightbox для просмотра фото на весь экран

---

## Загрузка данных

### collegeData.ts

**Пути:**
- `src/data/collegeData.ts`

**Функции:**
- `loadNews()` — асинхронная загрузка новостей из `src/news/**/*.md`
- `loadAfisha()` — асинхронная загрузка афиш из `src/afisha/**/*.md`

**Интерфейсы:**
```typescript
export interface ExtendedNewsItem extends NewsItem {
  content?: string;
  category?: string;
  cover?: string;
  gallery?: string[];
}

export interface AfishaItem {
  id: string;
  title: string;
  date: string;
  time?: string;
  venue?: string;
  cover?: string;
  content: string;
  gallery?: string[];
  tags?: string[];
}
```

---

## Маршрутизация

| Путь | Компонент | Описание |
|------|-----------|----------|
| `/` | HomePage | Главная страница |
| `/news` | NewsPage | Все новости |
| `/afisha` | AfishaPage | Афиша мероприятий |
| `/photos` | PhotosPage | Фотогалерея |
| `/videos` | VideosPage | Видеозаписи |
| `/graduates` | GraduatesPage | Все выпускники |
| `/dai` | DaiPage | Детская академия искусств |
| `/admin` | AdminPage | Администрация |

---

## Скрипты

| Скрипт | Назначение |
|--------|------------|
| `node scripts/add-news.js` | Обработка новостей из `new_for_sort/` |
| `node scripts/add-afisha.js` | Обработка афиш из `new_for_sort/` |
| `node scripts/migrate-news.js` | Миграция .txt → .md (одноразовый) |

---

## Lightbox

**Путь:** `src/components/Lightbox.tsx`

- Полноэкранный просмотр фото
- Навигация стрелками ‹ › и клавиатурой (← → Esc)
- Миниатюры внизу
- Счётчик фото (1 / 5)
- Используется на: `/news`, `/afisha`, `/photos`

---

## Блок «Наша гордость»

**Путь:** `src/components/Graduates.tsx`

- Фото: `public/foto_nasha_gordost/`
- Высота фото: фиксированная 340px, `object-fit: contain`
- Карточки выровнены по высоте (flex-колонка)
- Текст начинается на одной горизонтали

**Данные:**
```typescript
{
  id: "featured-1",
  name: "Мельников Денис",
  graduationYear: 2015,
  image: "/foto_nasha_gordost/Melnikov.jpg",
  isFeatured: true
}
```
