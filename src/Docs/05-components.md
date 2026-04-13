# 5. Компоненты

## Обзор

Приложение состоит из функциональных компонентов с TypeScript. Каждый компонент имеет собственный CSS Module. Используется React Router для маршрутизации.

## Компоненты главной страницы

| Компонент | Файл | Назначение |
|-----------|------|------------|
| Header | Header.tsx | Шапка с навигацией и переключением темы |
| Footer | Footer.tsx | Подвал с навигацией |
| Hero | Hero.tsx | Главный экран |
| About | About.tsx | Информация об отделении |
| Specialties | Specialties.tsx | Специальности и инструменты |
| Teachers | Teachers.tsx | Карточки преподавателей |
| Ensembles | Ensembles.tsx | Творческие коллективы |
| Achievements | Achievements.tsx | Достижения |
| Graduates | Graduates.tsx | Блок «Наша гордость» |
| **ConcertsPreview** | ConcertsPreview.tsx | 3 последних афиши |
| **NewsPreview** | NewsPreview.tsx | 3 последних новости |
| Admission | Admission.tsx | Поступающим |
| Contacts | Contacts.tsx | Контакты |

## Страницы

| Страница | Файл | Назначение |
|----------|------|------------|
| **NewsPage** | pages/NewsPage.tsx | Все новости с фильтрацией |
| **AfishaPage** | pages/AfishaPage.tsx | Афиша (предстоящие + прошедшие) |
| GraduatesPage | pages/GraduatesPage.tsx | Все выпускники |
| PhotosPage | pages/PhotosPage.tsx | Фотогалерея |
| VideosPage | pages/VideosPage.tsx | Видеозаписи |
| DaiPage | pages/DaiPage.tsx | Детская академия искусств |
| AdminPage | pages/AdminPage.tsx | Администрация |

## Общие компоненты

### Lightbox

**Файл:** `src/components/Lightbox.tsx`

Полноэкранный просмотр фотографий. Используется на страницах `/news`, `/afisha`, `/photos`.

**Пропсы:**
```typescript
interface LightboxProps {
  images: string[];       // Массив путей к фото
  initialIndex: number;   // Начальный индекс
  isOpen: boolean;
  onClose: () => void;
}
```

**Управление:**
- Стрелки ‹ › — навигация
- ← → — клавиатура
- Esc — закрыть
- Миниатюры внизу

---

## Graduates (блок «Наша гордость»)

**Файл:** `src/components/Graduates.tsx`

- Фильтрует выпускников по `isFeatured: true`
- Фото: `public/foto_nasha_gordost/`
- Высота фото: 340px, `object-fit: contain`
- Карточки выровнены (flex-колонка, `flex: 1` для текста)

**Выпускники блока:**
1. Мельников Денис (2015) — Академия джаза
2. Окунев Владислав (2003) — Kim Nazaretov Big Band
3. Чага Иван (2023) — Академия музыки им. Гнесиных

---

## ConcertsPreview (афиша на главной)

**Файл:** `src/components/ConcertsPreview.tsx`

- Загружает афиши через `loadAfisha()`
- Фильтрует предстоящие события
- Показывает 3 ближайших (сортировка по дате)
- Кнопка «Вся афиша →» на `/afisha`

---

## NewsPreview (новости на главной)

**Файл:** `src/components/NewsPreview.tsx`

- Загружает новости через `loadNews()`
- Показывает 3 последних
- Кнопка «Читать далее →» для раскрытия текста
- Кнопка «Все новости →» на `/news`

---

## Общие паттерны

### Ключи в списках

```tsx
{items.map((item) => (
  <div key={item.id}>{item.name}</div>
))}
```

### BEM-классы

```css
.component { }
.component__element { }
.component--modifier { }
```

### Типизация пропсов

```typescript
interface ComponentProps {
  propertyName: Type;
  optionalProperty?: Type;
}
```

---

## Расширение

### Добавление компонента

1. Создать `src/components/NewComponent.tsx`
2. Создать `src/components/NewComponent.module.css`
3. Добавить типизацию в `collegeData.ts` (если нужно)
4. Импортировать в `App.tsx`

### Пример

```tsx
import { Video } from '../data/collegeData';
import styles from './VideoGallery.module.css';

interface VideoGalleryProps {
  videos: Video[];
}

function VideoGallery({ videos }: VideoGalleryProps) {
  return (
    <section className={styles.videoGallery}>
      <h2>Видеогалерея</h2>
      <div className={styles.videoGrid}>
        {videos.map((video) => (
          <div key={video.id} className={styles.videoCard}>
            <video src={video.url} controls />
            <p>{video.title}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default VideoGallery;
```
