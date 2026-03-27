# Модуль данных

## Обзор

Модуль `collegeData.ts` является центральным хранилищем данных приложения. Он содержит все интерфейсы TypeScript и статические данные, используемые компонентами.

**Путь:** `src/data/collegeData.ts`

## Интерфейсы

### Teacher

Описывает преподавателя отделения.

```typescript
export interface Teacher {
  id: string;           // Уникальный идентификатор
  name: string;         // ФИО
  position: string;     // Должность
  specialty: string;    // Специализация (инструмент)
  image?: string;       // Путь к фото (опционально)
  bio?: string;         // Биография (опционально)
}
```

**Пример:**
```typescript
{
  id: "1",
  name: "Кокшин Дмитрий Николаевич",
  position: "Преподаватель духовых инструментов",
  specialty: "Саксофон",
  image: "/foto/Kokshin.jpg",
  bio: "Известный музыкант города, преподаватель по классу саксофона"
}
```

---

### Achievement

Описывает достижение студента в конкурсе или фестивале.

```typescript
export interface Achievement {
  id: string;
  title: string;              // Название награды
  studentName?: string;       // Имя студента (опционально)
  competition: string;        // Название конкурса
  date: string;               // Дата (YYYY-MM)
  place: string;              // Место (I место, Гран-при, etc.)
  category: string;           // Категория (инструмент/номинация)
  image?: string;             // Путь к фото диплома (опционально)
}
```

---

### Graduate

Описывает выпускника отделения.

```typescript
export interface Graduate {
  id: string;
  name: string;               // ФИО
  graduationYear: number;     // Год выпуска
  city: string;               // Город проживания
  position: string;           // Должность/род деятельности
  workplace?: string;         // Место работы (опционально)
  image?: string;             // Фото (опционально)
  bio?: string;               // Биография (опционально)
}
```

---

### Concert

Описывает концертное мероприятие.

```typescript
export interface Concert {
  id: string;
  title: string;              // Название концерта
  date: string;               // Дата (YYYY-MM-DD)
  time?: string;              // Время (опционально)
  venue: string;              // Место проведения
  description: string;        // Описание
  image?: string;             // Фото (опционально)
  isFree?: boolean;           // Бесплатный вход (опционально)
}
```

---

### Ensemble

Описывает творческий коллектив.

```typescript
export interface Ensemble {
  id: string;
  name: string;               // Название коллектива
  type: string;               // Тип (Оркестр, Вокальная группа, etc.)
  description: string;        // Описание
  members?: string[];         // Участники/состав (опционально)
}
```

---

### NewsItem

Описывает новостную запись.

```typescript
export interface NewsItem {
  id: string;
  title: string;              // Заголовок
  date: string;               // Дата (YYYY-MM-DD)
  description: string;        // Краткое описание
  image?: string;             // Фото (опционально)
}
```

---

### Specialty

Описывает образовательную специальность.

```typescript
export interface Specialty {
  code: string;               // Код специальности (53.02.02)
  name: string;               // Полное название
  profiles: string[];         // Профили подготовки
  description: string;        // Описание
  qualification?: string;     // Квалификация (опционально)
  studyDuration?: string;     // Срок обучения (опционально)
  studyForm?: string;         // Форма обучения (опционально)
}
```

---

### Instrument

Описывает музыкальный инструмент.

```typescript
export interface Instrument {
  id: string;
  name: string;               // Название группы инструментов
  category: 'клавишные' | 'духовые' | 'ударные' | 'струнные';
  description: string;        // Описание
}
```

**Категории:**
- `клавишные` — Фортепиано, синтезаторы, электроорган
- `духовые` — Саксофон, труба, тромбон
- `ударные` — Ударная установка, перкуссия
- `струнные` — Электрогитара, бас-гитара, контрабас

---

### EstradaDepartment

Описывает эстрадное отделение колледжа.

```typescript
export interface EstradaDepartment {
  name: string;               // Название отделения
  established: number;        // Год основания
  description: string;        // Описание
  headName: string;           // Название должности заведующего
  specialties: Specialty[];   // Специальности
  features: string[];         // Особенности/преимущества
  instruments: Instrument[];  // Инструменты
}
```

---

### NavigationItem

Описывает элемент навигации.

```typescript
export interface NavigationItem {
  id: string;
  label: string;              // Текст ссылки
  href: string;               // URL/якорь
}
```

---

### CollegeInfo

Описывает информацию о колледже.

```typescript
export interface CollegeInfo {
  name: string;               // Полное название
  shortName: string;          // Краткое название
  address: string;            // Адрес
  phone: string;              // Телефон
  email: string;              // Email
  website: string;            // Сайт
}
```

---

## Экспортируемые данные

### collegeInfo

```typescript
export const collegeInfo: CollegeInfo = {
  name: "Липецкий областной колледж искусств им. К.Н. Игумнова",
  shortName: "ЛОКИ им. К.Н. Игумнова",
  address: "Липецкая обл., г. Липецк, ул. Студенческий Городок, д. 6",
  phone: "+7 (474) 241-41-71",
  email: "lokii@yandex.ru",
  website: "lokii.ru"
};
```

---

### estradaDepartment

```typescript
export const estradaDepartment: EstradaDepartment = {
  name: "Эстрадное отделение",
  established: 1981,
  description: "Эстрадное отделение ЛОКИ им. К.Н. Игумнова — одно из ведущих подразделений колледжа...",
  headName: "Заведующий отделением",
  specialties: [
    {
      code: "53.02.02",
      name: "Музыкальное искусство эстрады (по видам)",
      description: "Подготовка артистов эстрадного искусства...",
      qualification: "Артист, преподаватель, руководитель эстрадного коллектива",
      studyDuration: "3 года 10 месяцев",
      studyForm: "Очная",
      profiles: [
        "Инструменты эстрадного оркестра (ударные, духовые, струнные, клавишные)",
        "Эстрадное пение"
      ]
    }
  ],
  features: [
    "Индивидуальные занятия по специальности",
    "Участие в концертах и фестивалях различного уровня",
    "Сотрудничество с филармонией и концертными площадками региона",
    "Современная материально-техническая база",
    "Мастер-классы от известных артистов эстрады",
    "Регулярные отчётные концерты и показы",
    "Участие в проекте «Камертон регионов»",
    "Выступления в Москве в рамках Дней культуры Липецкой области",
    "Творческие смены и интенсивы по креативным проектам"
  ],
  instruments: [
    { id: "keys", name: "Клавишные инструменты", category: "клавишные", description: "Фортепиано, синтезаторы, электроорган" },
    { id: "winds", name: "Духовые инструменты", category: "духовые", description: "Саксофон, труба, тромбон" },
    { id: "percussion", name: "Ударные инструменты", category: "ударные", description: "Ударная установка, перкуссия" },
    { id: "strings", name: "Струнные инструменты", category: "струнные", description: "Электрогитара, бас-гитара, контрабас" }
  ]
};
```

---

### teachers

Массив из 10 преподавателей:

```typescript
export const teachers: Teacher[] = [
  {
    id: "1",
    name: "Кокшин Дмитрий Николаевич",
    position: "Преподаватель духовых инструментов",
    specialty: "Саксофон",
    image: "/foto/Kokshin.jpg",
    bio: "Известный музыкант города, преподаватель по классу саксофона"
  },
  // ... ещё 9 преподавателей
];
```

**Список преподавателей:**

| № | ФИО | Специальность |
|---|-----|---------------|
| 1 | Кокшин Дмитрий Николаевич | Саксофон |
| 2 | Ивашкин Александр Владимирович | Фортепиано |
| 3 | Данилов Дмитрий Александрович | Гитара |
| 4 | Катрук Максим Николаевич | Бас-гитара |
| 5 | Реннер Людмила Арнольдовна | Саксофон |
| 6 | Колупаев Вячеслав Иванович | Фортепиано |
| 7 | Игнаткин Олег Александрович | Ударные |
| 8 | Волкова Наталья Викторовна | Эстрадный вокал |
| 9 | Бережная Василина Евгеньевна | Эстрадный вокал |
| 10 | Темникова Дарья Викторовна | Эстрадный вокал |

---

### ensembles

Массив из 3 творческих коллективов:

```typescript
export const ensembles: Ensemble[] = [
  {
    id: "1",
    name: "Эстрадный оркестр ЛОКИ",
    type: "Оркестр",
    description: "Учебный оркестр для практической отработки навыков ансамблевой игры...",
    members: ["Саксофоны", "Трубы", "Тромбоны", "Фортепиано", "Ударные", "Бас-гитара", "Электрогитара"]
  },
  {
    id: "2",
    name: "Вокальный ансамбль",
    type: "Вокальная группа",
    description: "Коллектив для развития навыков вокального исполнения в группе...",
    members: ["Солисты-вокалисты", "Бэк-вокал"]
  },
  {
    id: "3",
    name: "Инструментальные ансамбли",
    type: "Камерные составы",
    description: "Малые составы: дуэты, трио, квартеты, квинтеты...",
    members: ["Различные инструментальные составы"]
  }
];
```

---

### concerts

Массив из 5 концертов:

```typescript
export const concerts: Concert[] = [
  {
    id: "1",
    title: "Отчётный концерт эстрадного отделения",
    date: "2025-05-27",
    time: "18:00",
    venue: "Концертный зал ЛОКИ им. К.Н. Игумнова",
    description: "Ежегодный отчётный концерт студентов эстрадного отделения...",
    isFree: true
  },
  // ... ещё 4 концерта
];
```

---

### news

Массив из 5 новостей:

```typescript
export const news: NewsItem[] = [
  {
    id: "1",
    title: "Приёмная кампания 2025: высокий конкурс на эстрадные специальности",
    date: "2025-08-15",
    description: "На эстрадные специальности ЛОКИ подано 356 заявлений на 156 бюджетных мест..."
  },
  // ... ещё 4 новости
];
```

---

### achievements

Массив из 6 достижений:

```typescript
export const achievements: Achievement[] = [
  {
    id: "1",
    title: "Лауреат I степени",
    studentName: "Иванов Алексей",
    competition: "Всероссийский конкурс исполнителей эстрадной музыки",
    date: "2025-05",
    place: "I место",
    category: "Саксофон",
    image: "/achievements/saxophone-diploma-1.jpg"
  },
  // ... ещё 5 достижений
];
```

---

### graduates

Массив из 10 выпускников:

```typescript
export const graduates: Graduate[] = [
  {
    id: "1",
    name: "Смирнов Александр",
    graduationYear: 2020,
    city: "Москва",
    position: "Артист эстрады, саксофонист",
    workplace: "Московский джазовый оркестр",
    bio: "Солист Московского джазового оркестра, участник международных фестивалей"
  },
  // ... ещё 9 выпускников
];
```

---

### navigation

Массив навигационных элементов:

```typescript
export const navigation: NavigationItem[] = [
  { id: "about", label: "Об отделении", href: "#about" },
  { id: "specialties", label: "Специальности", href: "#specialties" },
  { id: "teachers", label: "Преподаватели", href: "#teachers" },
  { id: "ensembles", label: "Коллективы", href: "#ensembles" },
  { id: "achievements", label: "Достижения", href: "#achievements" },
  { id: "graduates", label: "Выпускники", href: "#graduates" },
  { id: "concerts", label: "Концерты", href: "#concerts" },
  { id: "news", label: "Новости", href: "#news" },
  { id: "admission", label: "Поступающим", href: "#admission" },
  { id: "contacts", label: "Контакты", href: "#contacts" }
];
```

---

## Использование в компонентах

### Импорт данных

```typescript
// Импорт всех данных
import { 
  navigation, 
  collegeInfo, 
  estradaDepartment, 
  teachers, 
  ensembles,
  concerts,
  news,
  achievements,
  graduates
} from './data/collegeData';
```

### Импорт типов

```typescript
// Импорт только типов
import type { Teacher, Ensemble } from './data/collegeData';
```

### Типизация пропсов

```typescript
interface TeachersProps {
  teachers: Teacher[];
}

function Teachers({ teachers }: TeachersProps) {
  // ...
}
```

---

## Расширение модуля данных

### Добавление нового типа данных

1. Определить интерфейс:
```typescript
export interface Video {
  id: string;
  title: string;
  url: string;
  duration: string;
  date: string;
}
```

2. Создать массив данных:
```typescript
export const videos: Video[] = [
  {
    id: "1",
    title: "Отчётный концерт 2025",
    url: "https://youtube.com/...",
    duration: "1:30:00",
    date: "2025-05-27"
  }
];
```

3. Импортировать в компоненте:
```typescript
import { videos } from './collegeData';
```

### Рекомендации

- Использовать уникальные `id` для каждой записи
- Хранить пути к изображениям относительно `/public`
- Использовать формат ISO для дат (YYYY-MM-DD)
- Добавлять опциональные поля с `?` для гибкости

---

## Источники данных

В текущей реализации данные статические и хранятся непосредственно в файле `collegeData.ts`.

### Потенциальные источники для будущего

1. **JSON-файлы** — вынос данных в отдельные JSON-файлы
2. **CMS** — интеграция с системой управления контентом
3. **REST API** — получение данных с backend-сервера
4. **GraphQL** — гибкие запросы к данным

### Пример загрузки из JSON

```typescript
// В будущем можно заменить на:
const response = await fetch('/data/teachers.json');
const teachers = await response.json();
```
