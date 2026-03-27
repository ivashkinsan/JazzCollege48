# Компоненты React

## Обзор

Приложение состоит из 13 функциональных компонентов с TypeScript. Каждый компонент имеет собственный CSS Module.

## Структура компонента

```tsx
import styles from './ComponentName.module.css';

interface ComponentNameProps {
  propertyName: Type;
}

function ComponentName({ prop }: ComponentNameProps) {
  return (
    <section className={styles.component}>
      {/* JSX */}
    </section>
  );
}

export default ComponentName;
```

**Особенности:**
- CSS Modules импортируются как объекты
- Классы в camelCase: `styles.headerNav`
- Глобальные классы (`section`, `container`, `btn`) — обычные

---

## Компоненты

### Header

**Файл:** `src/components/Header.tsx`

**Пропсы:**
```typescript
interface HeaderProps {
  shortName: string;
  navigation: NavigationItem[];
}
```

**Структура:**
```tsx
<header className={styles.header}>
  <div className={styles.headerContainer}>
    <div className={styles.headerLogo}>
      <span className={styles.headerLogoText}>{shortName}</span>
      <span className={styles.headerLogoSubtext}>Эстрадное отделение</span>
    </div>
    <nav className={styles.headerNav}>
      {navigation.map((item) => (
        <a key={item.id} href={item.href} className={styles.headerNavLink}>
          {item.label}
        </a>
      ))}
    </nav>
  </div>
</header>
```

---

### Footer

**Файл:** `src/components/Footer.tsx`

**Пропсы:** `FooterProps` (аналогично Header)

**Структура:**
- Левая колонка: название и навигация
- Правая колонка: контактная информация

---

### Hero

**Файл:** `src/components/Hero.tsx`

**Пропсы:** Отсутствуют

**Структура:**
```tsx
<section className={styles.hero}>
  <div className={styles.heroContent}>
    <p className={styles.heroSubtitle}>С 1981 года • Программа углубленной подготовки</p>
    <h1 className={styles.heroTitle}>Эстрадное отделение</h1>
    <p className={styles.heroDescription}>Готовим профессиональных музыкантов...</p>
    <div className={styles.heroCta}>
      <a href="#admission" className="btn btn--primary">Поступить</a>
      <a href="#about" className="btn btn--outline">Узнать больше</a>
    </div>
  </div>
  <div className={styles.heroImageWrapper}>
    <img src="/foto/Full.png" alt="Преподаватели и студенты" />
  </div>
</section>
```

---

### About

**Файл:** `src/components/About.tsx`

**Пропсы:**
```typescript
interface AboutProps {
  department: EstradaDepartment;
}
```

**Используемые данные:**
- `department.description`
- `department.features`
- `department.established`

---

### Specialties

**Файл:** `src/components/Specialties.tsx`

**Пропсы:** `SpecialtiesProps { department: EstradaDepartment }`

**Структура:**
- Карточка специальности (код, название)
- Квалификация, срок, форма обучения
- Список профилей подготовки
- Сетка инструментов по категориям:
  - 🎹 Клавишные
  - 🎺 Духовые
  - 🥁 Ударные
  - 🎸 Струнные

---

### Teachers

**Файл:** `src/components/Teachers.tsx`

**Пропсы:**
```typescript
interface TeachersProps {
  teachers: Teacher[];
}
```

**Структура:**
```tsx
<section className={styles.teachers}>
  <div className={styles.teachersGrid}>
    {teachers.map((teacher) => (
      <div key={teacher.id} className={styles.teacherCard}>
        <img src={teacher.image} alt={teacher.name} />
        <h3>{teacher.name}</h3>
        <p className={styles.teacherCardPosition}>{teacher.position}</p>
        <p className={styles.teacherCardSpecialty}>{teacher.specialty}</p>
      </div>
    ))}
  </div>
</section>
```

**Преподаватели (10):**
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

**Пропсы:** `EnsemblesProps { ensembles: Ensemble[] }`

**Коллективы (3):**
1. Эстрадный оркестр ЛОКИ
2. Вокальный ансамбль
3. Инструментальные ансамбли

---

### Achievements

**Файл:** `src/components/Achievements.tsx`

**Пропсы:** `AchievementsProps { achievements: Achievement[] }`

**Достижения (6):**
- Лауреат I степени — Всероссийский конкурс
- Гран-при фестиваля «Эстрадный голос»
- Лауреат II степени — Региональный конкурс джаза

---

### Graduates

**Файл:** `src/components/Graduates.tsx`

**Пропсы:** `GraduatesProps { graduates: Graduate[] }`

**Выпускники (10):**
Города: Москва, Санкт-Петербург, Ростов-на-Дону, Екатеринбург

---

### Concerts

**Файл:** `src/components/Concerts.tsx`

**Пропсы:** `ConcertsProps { concerts: Concert[] }`

**Мероприятия (5):**
1. Отчётный концерт эстрадного отделения
2. «Камертон регионов»
3. «Земля Липецкая — Константину Игумнову»
4. Творческая смена «Мечтай, дерзай, твори!»
5. «Молодёжный квартал»

---

### News

**Файл:** `src/components/News.tsx`

**Пропсы:** `NewsProps { news: NewsItem[] }`

**Темы новостей (5):**
- Приёмная кампания
- Выступления в Москве
- Мастер-классы
- Творческие смены
- Совещания руководителей

---

### Admission

**Файл:** `src/components/Admission.tsx`

**Пропсы:** `AdmissionProps { collegeInfo: CollegeInfo }`

**Структура:**
- Требования к поступлению
- Информация о специальности
- Контакты для связи

---

### Contacts

**Файл:** `src/components/Contacts.tsx`

**Пропсы:** `ContactsProps { collegeInfo: CollegeInfo }`

**Структура:**
- Адрес
- Телефон
- Email
- Сайт

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
