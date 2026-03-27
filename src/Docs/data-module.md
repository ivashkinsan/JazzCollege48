# Модуль данных

## Обзор

Модуль `collegeData.ts` — центральное хранилище данных приложения. Содержит интерфейсы TypeScript и статические данные.

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

### Achievement
```typescript
export interface Achievement {
  id: string;
  title: string;
  studentName?: string;
  competition: string;
  date: string;
  place: string;
  category: string;
  image?: string;
}
```

### Graduate
```typescript
export interface Graduate {
  id: string;
  name: string;
  graduationYear: number;
  city: string;
  position: string;
  workplace?: string;
  image?: string;
  bio?: string;
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

### Ensemble
```typescript
export interface Ensemble {
  id: string;
  name: string;
  type: string;
  description: string;
  members?: string[];
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

### Specialty
```typescript
export interface Specialty {
  code: string;
  name: string;
  profiles: string[];
  description: string;
  qualification?: string;
  studyDuration?: string;
  studyForm?: string;
}
```

### Instrument
```typescript
export interface Instrument {
  id: string;
  name: string;
  category: 'клавишные' | 'духовые' | 'ударные' | 'струнные';
  description: string;
}
```

### EstradaDepartment
```typescript
export interface EstradaDepartment {
  name: string;
  established: number;
  description: string;
  headName: string;
  specialties: Specialty[];
  features: string[];
  instruments: Instrument[];
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

### CollegeInfo
```typescript
export interface CollegeInfo {
  name: string;
  shortName: string;
  address: string;
  phone: string;
  email: string;
  website: string;
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

### estradaDepartment
```typescript
export const estradaDepartment: EstradaDepartment = {
  name: "Эстрадное отделение",
  established: 1981,
  description: "Эстрадное отделение ЛОКИ им. К.Н. Игумнова — одно из ведущих подразделений колледжа...",
  headName: "Заведующий отделением",
  specialties: [{
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
  }],
  features: [
    "Индивидуальные занятия по специальности",
    "Участие в концертах и фестивалях",
    "Сотрудничество с филармонией",
    "Современная материально-техническая база",
    "Мастер-классы от известных артистов",
    "Участие в проекте «Камертон регионов»"
  ],
  instruments: [
    { id: "keys", name: "Клавишные", category: "клавишные", description: "Фортепиано, синтезаторы, электроорган" },
    { id: "winds", name: "Духовые", category: "духовые", description: "Саксофон, труба, тромбон" },
    { id: "percussion", name: "Ударные", category: "ударные", description: "Ударная установка, перкуссия" },
    { id: "strings", name: "Струнные", category: "струнные", description: "Электрогитара, бас-гитара, контрабас" }
  ]
};
```

### teachers (10 преподавателей)
```typescript
export const teachers: Teacher[] = [
  { id: "1", name: "Кокшин Дмитрий Николаевич", position: "Преподаватель духовых инструментов", specialty: "Саксофон", image: "/foto/Kokshin.jpg" },
  { id: "2", name: "Ивашкин Александр Владимирович", position: "Преподаватель фортепиано", specialty: "Фортепиано", image: "/foto/Ivashkin.jpg" },
  { id: "3", name: "Данилов Дмитрий Александрович", position: "Преподаватель гитары", specialty: "Гитара", image: "/foto/Danilov.jpg" },
  { id: "4", name: "Катрук Максим Николаевич", position: "Преподаватель бас-гитары", specialty: "Бас-гитара", image: "/foto/Katruk.jpg" },
  { id: "5", name: "Реннер Людмила Арнольдовна", position: "Преподаватель духовых инструментов", specialty: "Саксофон", image: "/foto/Renner.jpg" },
  { id: "6", name: "Колупаев Вячеслав Иванович", position: "Преподаватель фортепиано", specialty: "Фортепиано", image: "/foto/Kolupaev.jpg" },
  { id: "7", name: "Игнаткин Олег Александрович", position: "Преподаватель ударных инструментов", specialty: "Ударные", image: "/foto/Ignatkin.jpg" },
  { id: "8", name: "Волкова Наталья Викторовна", position: "Преподаватель вокала", specialty: "Эстрадный вокал", image: "/foto/Volkova.jpg" },
  { id: "9", name: "Бережная Василина Евгеньевна", position: "Преподаватель вокала", specialty: "Эстрадный вокал", image: "/foto/Berezhnaya.jpg" },
  { id: "10", name: "Темникова Дарья Викторовна", position: "Преподаватель вокала", specialty: "Эстрадный вокал", image: "/foto/Temnikova.jpg" }
];
```

### ensembles (3 коллектива)
```typescript
export const ensembles: Ensemble[] = [
  { id: "1", name: "Эстрадный оркестр ЛОКИ", type: "Оркестр", description: "Учебный оркестр для практической отработки навыков", members: ["Саксофоны", "Трубы", "Тромбоны", "Фортепиано", "Ударные"] },
  { id: "2", name: "Вокальный ансамбль", type: "Вокальная группа", description: "Коллектив для развития навыков вокального исполнения", members: ["Солисты-вокалисты", "Бэк-вокал"] },
  { id: "3", name: "Инструментальные ансамбли", type: "Камерные составы", description: "Малые составы: дуэты, трио, квартеты", members: ["Различные инструментальные составы"] }
];
```

### concerts (5 концертов)
```typescript
export const concerts: Concert[] = [
  { id: "1", title: "Отчётный концерт эстрадного отделения", date: "2025-05-27", time: "18:00", venue: "Концертный зал ЛОКИ", description: "Ежегодный отчётный концерт", isFree: true },
  { id: "2", title: "«Камертон регионов»", date: "2025-06-15", venue: "Концертный зал ЛОКИ", description: "Фестиваль учебных заведений культуры и искусств" },
  { id: "3", title: "«Земля Липецкая — Константину Игумнову»", date: "2025-04-10", venue: "ЛОКИ", description: "Памяти великого пианиста" },
  { id: "4", title: "Творческая смена «Мечтай, дерзай, твори!»", date: "2025-07-01", venue: "Детский центр", description: "Образовательная смена для одарённых детей" },
  { id: "5", title: "«Молодёжный квартал»", date: "2025-09-01", venue: "Площадь Ленина", description: "Городской фестиваль" }
];
```

### news (5 новостей)
```typescript
export const news: NewsItem[] = [
  { id: "1", title: "Приёмная кампания 2025: высокий конкурс", date: "2025-08-15", description: "356 заявлений на 156 бюджетных мест" },
  { id: "2", title: "Выступление в Москве", date: "2025-05-20", description: "Дни культуры Липецкой области" },
  { id: "3", title: "Мастер-класс от известных артистов", date: "2025-04-15", description: "Гости из Москвы и Санкт-Петербурга" },
  { id: "4", title: "Творческая смена завершена", date: "2025-07-30", description: "Итоговый концерт участников" },
  { id: "5", title: "Совещание руководителей", date: "2025-03-10", description: "Обсуждение развития эстрадного образования" }
];
```

### achievements (6 достижений)
```typescript
export const achievements: Achievement[] = [
  { id: "1", title: "Лауреат I степени", studentName: "Иванов Алексей", competition: "Всероссийский конкурс исполнителей", date: "2025-05", place: "I место", category: "Саксофон" },
  { id: "2", title: "Гран-при", studentName: "Петрова Анна", competition: "Фестиваль «Эстрадный голос»", date: "2025-04", place: "Гран-при", category: "Вокал" },
  { id: "3", title: "Лауреат II степени", studentName: "Сидоров Иван", competition: "Региональный конкурс джаза", date: "2025-03", place: "II место", category: "Фортепиано" },
  { id: "4", title: "Лауреат I степени", studentName: "Козлова Мария", competition: "Конкурс эстрадных исполнителей", date: "2025-02", place: "I место", category: "Гитара" },
  { id: "5", title: "Дипломант", studentName: "Новиков Дмитрий", competition: "Фестиваль ударных инструментов", date: "2025-01", place: "Дипломант", category: "Ударные" },
  { id: "6", title: "Лауреат III степени", studentName: "Фёдорова Елена", competition: "Областной конкурс вокалистов", date: "2024-12", place: "III место", category: "Вокал" }
];
```

### graduates (10 выпускников)
```typescript
export const graduates: Graduate[] = [
  { id: "1", name: "Смирнов Александр", graduationYear: 2020, city: "Москва", position: "Артист эстрады, саксофонист", workplace: "Московский джазовый оркестр" },
  { id: "2", name: "Кузнецова Ольга", graduationYear: 2019, city: "Санкт-Петербург", position: "Вокалистка", workplace: "Театр музыкальной комедии" },
  { id: "3", name: "Васильев Игорь", graduationYear: 2021, city: "Ростов-на-Дону", position: "Преподаватель гитары", workplace: "ДМШ №1" },
  { id: "4", name: "Морозова Анна", graduationYear: 2018, city: "Екатеринбург", position: "Артистка оркестра", workplace: "Филармония" },
  { id: "5", name: "Попов Дмитрий", graduationYear: 2022, city: "Липецк", position: "Руководитель ансамбля", workplace: "ДК Липецк" },
  { id: "6", name: "Лебедева Екатерина", graduationYear: 2020, city: "Москва", position: "Вокалистка", workplace: "Театр «Геликон-опера»" },
  { id: "7", name: "Козлов Андрей", graduationYear: 2019, city: "Казань", position: "Преподаватель фортепиано", workplace: "Музыкальный колледж" },
  { id: "8", name: "Новикова Татьяна", graduationYear: 2021, city: "Липецк", position: "Концертмейстер", workplace: "ЛОКИ" },
  { id: "9", name: "Григорьев Максим", graduationYear: 2018, city: "Сочи", position: "Артист шоу-группы", workplace: "Резиденция" },
  { id: "10", name: "Павлова Юлия", graduationYear: 2022, city: "Воронеж", position: "Преподаватель вокала", workplace: "ДМШ №5" }
];
```

### navigation
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

## Расширение

### Новый тип данных
```typescript
export interface Video {
  id: string;
  title: string;
  url: string;
  duration: string;
  date: string;
}

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

### Рекомендации
- Уникальные `id` для каждой записи
- Пути к изображениям относительно `/public`
- Формат ISO для дат (YYYY-MM-DD)
