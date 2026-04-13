# 6. Модуль данных

## Обзор

Модуль `collegeData.ts` — центральное хранилище данных приложения. Содержит интерфейсы TypeScript, статические данные и функции асинхронной загрузки новостей и афиш из Markdown-файлов.

**Путь:** `src/data/collegeData.ts`

---

## Интерфейсы

### Teacher
```typescript
export interface Teacher {
  id: string;
  name: string;
  position: string;
  specialty: string;
  image?: string;
  bio?: string;
}
```

### Graduate
```typescript
export interface Graduate {
  id: string;
  name: string;
  graduationYear: number;
  position: string;
  workplace?: string;
  image?: string;
  bio?: string;
  isFeatured?: boolean; // Для блока "Наша гордость"
}
```

### Concert
```typescript
export interface Concert {
  id: string;
  title: string;
  date: string;
  time?: string;
  venue: string;
  description: string;
  image?: string;
  isFree?: boolean;
}
```

### NewsItem
```typescript
export interface NewsItem {
  id: string;
  title: string;
  date: string;
  description: string;
  image?: string;
}
```

### ExtendedNewsItem (расширенный)
```typescript
export interface ExtendedNewsItem extends NewsItem {
  content?: string;       // Полный текст
  category?: string;      // konzert, konkurs, masterclass, announcement
  cover?: string;         // Путь к обложке
  gallery?: string[];     // Массив путей к фото галереи
}
```

### AfishaItem
```typescript
export interface AfishaItem {
  id: string;
  title: string;
  date: string;
  time?: string;          // Время начала
  venue?: string;         // Место проведения
  cover?: string;         // Постер
  content: string;        // Описание
  gallery?: string[];     // Фото
  tags?: string[];        // Теги
}
```

### NavigationItem
```typescript
export interface NavigationItem {
  id: string;
  label: string;
  href: string;
}
```

---

## Загрузка данных из Markdown

### loadNews()
```typescript
export async function loadNews(): Promise<ExtendedNewsItem[]>
```
Загружает все `.md` файлы из `src/news/**/*.md`. Парсит frontmatter и тело. Сортирует по дате (новые сверху).

### loadAfisha()
```typescript
export async function loadAfisha(): Promise<AfishaItem[]>
```
Загружает все `.md` файлы из `src/afisha/**/*.md`. Парсит frontmatter с полями `time`, `venue`. Сортирует по дате.

---

## Экспортируемые данные

### navigation
```typescript
export const navigation: NavigationItem[] = [
  { id: "about", label: "Об отделении", href: "#about" },
  { id: "specialties", label: "Специальности", href: "#specialties" },
  { id: "teachers", label: "Преподаватели", href: "#teachers" },
  { id: "afisha", label: "Афиша", href: "/afisha" },
  { id: "news", label: "Новости", href: "/news" },
  { id: "graduates", label: "Выпускники", href: "/graduates" },
  { id: "dai", label: "ДАИ", href: "/dai" },
  { id: "admin", label: "Администрация", href: "/admin" },
  { id: "photos", label: "Фото", href: "/photos" },
  { id: "videos", label: "Видео", href: "/videos" },
  { id: "contacts", label: "Контакты", href: "#contacts" }
];
```

### graduates (блок «Наша гордость»)
```typescript
{
  id: "featured-1",
  name: "Мельников Денис",
  graduationYear: 2015,
  position: "Саксофонист, аранжировщик, бэнд-лидер, педагог",
  workplace: "Академия джаза (г. Москва)",
  image: "/foto_nasha_gordost/Melnikov.jpg",
  isFeatured: true
}
```

---

## Использование в компонентах

### Асинхронная загрузка
```typescript
const [newsData, setNewsData] = useState<ExtendedNewsItem[]>([]);

useEffect(() => {
  loadNews().then(setNewsData);
}, []);
```

### Импорт статических данных
```typescript
import {
  navigation,
  collegeInfo,
  estradaDepartment,
  teachers,
  graduates
} from './data/collegeData';
```
