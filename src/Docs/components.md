# Компоненты React

## Обзор

Приложение состоит из 13 компонентов, каждый из которых отвечает за отдельную секцию сайта. Все компоненты являются функциональными и используют TypeScript для типизации.

## Структура компонента

Каждый компонент следует единому шаблону:

```tsx
// Импорт типов (если нужны)
import { InterfaceName } from '../data/collegeData';

// Импорт CSS Module
import styles from './ComponentName.module.css';

// Определение интерфейса пропсов
interface ComponentNameProps {
  // пропсы
}

// Компонент
function ComponentName({ prop1, prop2 }: ComponentNameProps) {
  return (
    <section className={styles.component}>
      {/* JSX */}
    </section>
  );
}

export default ComponentName;
```

### Важные особенности

1. **CSS Modules** — все стили компонентов импортируются как объекты:
   ```tsx
   import styles from './Header.module.css';
   ```

2. **Имена классов** — используются в camelCase благодаря настройке `localsConvention: 'camelCaseOnly'`:
   ```tsx
   className={styles.headerNav}
   className={styles.headerNavLink}
   ```

3. **Глобальные классы** — для общих классов (`section`, `container`, `btn`) используются обычные классы:
   ```tsx
   <section className="section section--dark">
     <div className="container">
   ```

---

## Компоненты

### Header

**Файл:** `src/components/Header.tsx`

**Назначение:** Шапка сайта с логотипом и навигацией.

**Пропсы:**
```typescript
interface HeaderProps {
  shortName: string;              // Краткое название колледжа
  navigation: NavigationItem[];   // Массив навигационных элементов
}
```

**Структура:**
```tsx
<header className="header">
  <div className="header__container">
    <div className="header__logo">
      <span className="header__logo-text">{shortName}</span>
      <span className="header__logo-subtext">Эстрадное отделение</span>
    </div>
    <nav className="header__nav">
      {navigation.map((item) => (
        <a key={item.id} href={item.href} className="header__nav-link">
          {item.label}
        </a>
      ))}
    </nav>
  </div>
</header>
```

**Особенности:**
- Фиксированная высота (70px)
- Якорные ссылки для навигации по странице
- Адаптивная структура

---

### Footer

**Файл:** `src/components/Footer.tsx`

**Назначение:** Подвал сайта с контактной информацией и навигацией.

**Пропсы:**
```typescript
interface FooterProps {
  shortName: string;
  navigation: NavigationItem[];
}
```

**Структура:**
- Левая колонка: название и навигация
- Правая колонка: контактная информация

---

### Hero

**Файл:** `src/components/Hero.tsx`

**Назначение:** Главный экран с призывом к действию.

**Пропсы:** Отсутствуют (использует статический контент)

**Структура:**
```tsx
<section className="hero">
  <div className="hero__content">
    <p className="hero__subtitle">С 1981 года • Программа углубленной подготовки</p>
    <h1 className="hero__title">Эстрадное отделение</h1>
    <p className="hero__description">Готовим профессиональных музыкантов...</p>
    <div className="hero__cta">
      <a href="#admission" className="btn btn--primary">Поступить</a>
      <a href="#about" className="btn btn--outline">Узнать больше</a>
    </div>
  </div>
  <div className="hero__image-wrapper">
    <img src="/foto/Full.png" alt="Преподаватели и студенты" />
  </div>
</section>
```

**Особенности:**
- Двухколоночная структура
- Кнопки с призывом к действию
- Фоновое изображение

---

### About

**Файл:** `src/components/About.tsx`

**Назначение:** Информация об эстрадном отделении.

**Пропсы:**
```typescript
interface AboutProps {
  department: EstradaDepartment;
}
```

**Структура:**
- Заголовок секции
- Описание отделения
- Список особенностей (features)

**Используемые данные:**
- `department.description`
- `department.features`
- `department.established`

---

### Specialties

**Файл:** `src/components/Specialties.tsx`

**Назначение:** Информация о специальности и профилях подготовки.

**Пропсы:**
```typescript
interface SpecialtiesProps {
  department: EstradaDepartment;
}
```

**Структура:**
- Карточка специальности с кодом и названием
- Информация о квалификации, сроке и форме обучения
- Список профилей подготовки
- Сетка карточек инструментов

**Используемые данные:**
- `department.specialties[0]`
- `department.instruments`

**Особенности:**
- Отображение иконок инструментов по категориям:
  - 🎹 Клавишные
  - 🎺 Духовые
  - 🥁 Ударные
  - 🎸 Струнные

---

### Teachers

**Файл:** `src/components/Teachers.tsx`

**Назначение:** Карточки преподавателей отделения.

**Пропсы:**
```typescript
interface TeachersProps {
  teachers: Teacher[];
}
```

**Структура:**
```tsx
<section className="teachers">
  <div className="teachers__grid">
    {teachers.map((teacher) => (
      <div key={teacher.id} className="teacher-card">
        <img src={teacher.image} alt={teacher.name} />
        <h3>{teacher.name}</h3>
        <p className="teacher-card__position">{teacher.position}</p>
        <p className="teacher-card__specialty">{teacher.specialty}</p>
      </div>
    ))}
  </div>
</section>
```

**Используемые данные:**
- `teachers: Teacher[]` (10 преподавателей)

**Преподаватели в базе:**
1. Кокшин Дмитрий Николаевич (Саксофон)
2. Ивашкин Александр Владимирович (Фортепиано)
3. Данилов Дмитрий Александрович (Гитара)
4. Катрук Максим Николаевич (Бас-гитара)
5. Реннер Людмила Арнольдовна (Саксофон)
6. Колупаев Вячеслав Иванович (Фортепиано)
7. Игнаткин Олег Александрович (Ударные)
8. Волкова Наталья Викторовна (Вокал)
9. Бережная Василина Евгеньевна (Вокал)
10. Темникова Дарья Викторовна (Вокал)

---

### Ensembles

**Файл:** `src/components/Ensembles.tsx`

**Назначение:** Информация о творческих коллективах.

**Пропсы:**
```typescript
interface EnsemblesProps {
  ensembles: Ensemble[];
}
```

**Структура:**
- Карточка ансамбля с названием и типом
- Описание коллектива
- Список участников/составов

**Используемые данные:**
- `ensembles: Ensemble[]` (3 коллектива)

**Коллективы:**
1. Эстрадный оркестр ЛОКИ
2. Вокальный ансамбль
3. Инструментальные ансамбли

---

### Achievements

**Файл:** `src/components/Achievements.tsx`

**Назначение:** Достижения студентов в конкурсах и фестивалях.

**Пропсы:**
```typescript
interface AchievementsProps {
  achievements: Achievement[];
}
```

**Структура:**
- Карточка достижения с местом и категорией
- Имя студента
- Название конкурса
- Дата и место

**Используемые данные:**
- `achievements: Achievement[]` (6 достижений)

**Примеры достижений:**
- Лауреат I степени — Всероссийский конкурс исполнителей
- Гран-при фестиваля «Эстрадный голос»
- Лауреат II степени — Региональный конкурс джазовых исполнителей

---

### Graduates

**Файл:** `src/components/Graduates.tsx`

**Назначение:** Истории успеха выпускников.

**Пропсы:**
```typescript
interface GraduatesProps {
  graduates: Graduate[];
}
```

**Структура:**
- Карточка выпускника с фото
- Имя и год выпуска
- Город и место работы
- Краткая биография

**Используемые данные:**
- `graduates: Graduate[]` (10 выпускников)

**Города выпускников:**
- Москва
- Санкт-Петербург
- Ростов-на-Дону
- Екатеринбург

---

### Concerts

**Файл:** `src/components/Concerts.tsx`

**Назначение:** Афиша концертов и мероприятий.

**Пропсы:**
```typescript
interface ConcertsProps {
  concerts: Concert[];
}
```

**Структура:**
- Карточка концерта с датой и временем
- Название и место проведения
- Описание
- Метка бесплатного мероприятия

**Используемые данные:**
- `concerts: Concert[]` (5 концертов)

**Мероприятия:**
1. Отчётный концерт эстрадного отделения
2. «Камертон регионов»
3. «Земля Липецкая — Константину Игумнову»
4. Творческая смена «Мечтай, дерзай, твори!»
5. «Молодёжный квартал»

---

### News

**Файл:** `src/components/News.tsx`

**Назначение:** Новости отделения.

**Пропсы:**
```typescript
interface NewsProps {
  news: NewsItem[];
}
```

**Структура:**
- Карточка новости с датой
- Заголовок
- Краткое описание

**Используемые данные:**
- `news: NewsItem[]` (5 новостей)

**Темы новостей:**
- Приёмная кампания
- Выступления в Москве
- Мастер-классы
- Творческие смены
- Совещания руководителей

---

### Admission

**Файл:** `src/components/Admission.tsx`

**Назначение:** Информация для абитуриентов.

**Пропсы:**
```typescript
interface AdmissionProps {
  collegeInfo: CollegeInfo;
}
```

**Структура:**
- Требования к поступлению
- Информация о специальности
- Контактные данные для связи
- Ссылки на ресурсы

**Используемые данные:**
- `collegeInfo`
- Статический контент о вступительных испытаниях

---

### Contacts

**Файл:** `src/components/Contacts.tsx`

**Назначение:** Контактная информация.

**Пропсы:**
```typescript
interface ContactsProps {
  collegeInfo: CollegeInfo;
}
```

**Структура:**
- Адрес
- Телефон
- Email
- Сайт
- Карта (опционально)

**Используемые данные:**
- `collegeInfo: CollegeInfo`

---

## Общие паттерны

### BEM-классы

Все компоненты используют BEM-подобную структуру классов:

```css
/* Блок */
.component { }

/* Элемент */
.component__element { }

/* Модификатор */
.component--modifier { }
.component__element--modifier { }
```

### Типизация пропсов

Каждый компонент имеет явный интерфейс пропсов:

```typescript
interface ComponentNameProps {
  propertyName: Type;
  optionalProperty?: Type;
}
```

### Ключи в списках

При рендеринге списков используется `id` элемента как ключ:

```tsx
{items.map((item) => (
  <div key={item.id}>{item.name}</div>
))}
```

## Стили компонентов

Каждый компонент имеет собственный CSS-файл со следующими особенностями:

- Использование CSS-переменных из `variables.css`
- Адаптивность через media queries
- Тёмная тема по умолчанию

## Расширение компонентов

### Добавление нового компонента

1. Создать файл компонента: `src/components/NewComponent.tsx`
2. Создать файл стилей: `src/components/NewComponent.css`
3. Добавить типизацию в `collegeData.ts` (если нужно)
4. Импортировать и использовать в `App.tsx`

### Пример нового компонента

```tsx
// src/components/VideoGallery.tsx
import { Video } from '../data/collegeData';
import './VideoGallery.css';

interface VideoGalleryProps {
  videos: Video[];
}

function VideoGallery({ videos }: VideoGalleryProps) {
  return (
    <section className="video-gallery">
      <h2>Видеогалерея</h2>
      <div className="video-gallery__grid">
        {videos.map((video) => (
          <div key={video.id} className="video-card">
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
