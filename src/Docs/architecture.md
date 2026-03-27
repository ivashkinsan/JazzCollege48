# Архитектура приложения

## Общая архитектура

Приложение построено по архитектуре **Single Page Application (SPA)** с использованием компонентного подхода React.

## Архитектурный паттерн

Проект использует архитектуру на основе **компонентов с передачей данных через props**:

```
┌─────────────────────────────────────────────────────────┐
│                        App.tsx                          │
│                    (Корневой компонент)                  │
│  ┌───────────────────────────────────────────────────┐  │
│  │                    Header                         │  │
│  └───────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────┐  │
│  │                     Hero                          │  │
│  └───────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────┐  │
│  │                    About                          │  │
│  └───────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────┐  │
│  │                 Specialties                       │  │
│  └───────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────┐  │
│  │                  Teachers                         │  │
│  └───────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────┐  │
│  │                  Ensembles                        │  │
│  └───────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────┐  │
│  │                Achievements                       │  │
│  └───────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────┐  │
│  │                 Graduates                         │  │
│  └───────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────┐  │
│  │                  Concerts                         │  │
│  └───────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────┐  │
│  │                     News                          │  │
│  └───────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────┐  │
│  │                  Admission                        │  │
│  └───────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────┐  │
│  │                   Contacts                        │  │
│  └───────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────┐  │
│  │                     Footer                        │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## Поток данных

### Однонаправленный поток данных

```
┌─────────────────┐
│  collegeData.ts │
│   (Модуль       │
│    данных)      │
└────────┬────────┘
         │
         │ Экспорт констант
         │ (teachers, ensembles,
         │  concerts, news, etc.)
         ▼
┌─────────────────┐
│    App.tsx      │
│ (Импорт данных) │
└────────┬────────┘
         │
         │ Передача через props
         ▼
┌─────────────────┐
│  Компоненты     │
│ (Header, About, │
│  Teachers, etc.)│
└────────┬────────┘
         │
         │ Рендеринг
         ▼
┌─────────────────┐
│       DOM       │
│   (Вывод в      │
│    браузер)     │
└─────────────────┘
```

## Компонентная иерархия

### Уровень 1: Корневой компонент

**App.tsx** — собирает все компоненты вместе, импортирует данные из `collegeData.ts`.

### Уровень 2: Основные секции

| Компонент | Зависимости | Получаемые данные |
|-----------|-------------|-------------------|
| Header | collegeData | shortName, navigation |
| Footer | collegeData | shortName, navigation |
| Hero | — | — |
| About | collegeData | department |
| Specialties | collegeData | department |
| Teachers | collegeData | teachers |
| Ensembles | collegeData | ensembles |
| Achievements | collegeData | achievements |
| Graduates | collegeData | graduates |
| Concerts | collegeData | concerts |
| News | collegeData | news |
| Admission | collegeData | collegeInfo |
| Contacts | collegeData | collegeInfo |

### Уровень 3: Внутренние компоненты

В текущей реализации все компоненты являются конечными (не имеют дочерних компонентов).

## Структура данных

### Интерфейсы

```typescript
// Основные сущности
interface Teacher          // Преподаватель
interface Achievement      // Достижение
interface Graduate         // Выпускник
interface Concert          // Концерт
interface Ensemble         // Коллектив
interface NewsItem         // Новость
interface Specialty        // Специальность
interface Instrument       // Инструмент
interface EstradaDepartment// Отделение
interface NavigationItem   // Элемент навигации
interface CollegeInfo      // Информация о колледже
```

### Схема данных

```
collegeData.ts
│
├── collegeInfo: CollegeInfo
│   ├── name: string
│   ├── shortName: string
│   ├── address: string
│   ├── phone: string
│   ├── email: string
│   └── website: string
│
├── estradaDepartment: EstradaDepartment
│   ├── name: string
│   ├── established: number
│   ├── description: string
│   ├── headName: string
│   ├── specialties: Specialty[]
│   ├── features: string[]
│   └── instruments: Instrument[]
│
├── teachers: Teacher[]
├── ensembles: Ensemble[]
├── concerts: Concert[]
├── news: NewsItem[]
├── achievements: Achievement[]
├── graduates: Graduate[]
└── navigation: NavigationItem[]
```

## Жизненный цикл приложения

### 1. Инициализация

```
1. Загрузка index.html
2. Загрузка main.tsx
3. Создание React root
4. Рендеринг App компонента
```

### 2. Рендеринг

```
1. App импортирует данные из collegeData.ts
2. App передаёт данные в дочерние компоненты через props
3. Каждый компонент рендерит свой JSX
4. React обновляет DOM
```

### 3. Обновление

В текущей реализации (статические данные) обновления происходят только при:
- Изменении кода (HMR в разработке)
- Перезагрузке страницы

## Модульная структура

### Импорт/Экспорт

**collegeData.ts:**
```typescript
// Экспорт интерфейсов
export interface Teacher { ... }

// Экспорт данных
export const teachers: Teacher[] = [...]
export const ensembles: Ensemble[] = [...]
```

**App.tsx:**
```typescript
// Импорт всех данных
import { 
  navigation, 
  collegeInfo, 
  estradaDepartment, 
  teachers, 
  ensembles,
  // ...
} from './data/collegeData';

// Импорт компонентов
import Header from './components/Header';
import Footer from './components/Footer';
// ...
```

**Компоненты:**
```typescript
// Импорт типов
import { NavigationItem } from '../data/collegeData';

// Импорт стилей
import './Header.css';

// Определение пропсов
interface HeaderProps {
  shortName: string;
  navigation: NavigationItem[];
}

// Использование пропсов
function Header({ shortName, navigation }: HeaderProps) { ... }
```

## Стилизация

### CSS-архитектура

Приложение использует **CSS-модули на основе BEM-подобного подхода**:

```css
/* Блок */
.header { }

/* Элемент */
.header__logo { }
.header__nav { }

/* Модификатор */
.btn--primary { }
.btn--outline { }
```

### Глобальные стили

**index.css** — базовые стили для всего приложения:
- Сброс стилей
- Глобальные настройки шрифтов
- Базовые утилитарные классы

**variables.css** — CSS-переменные:
- Цветовая палитра
- Отступы
- Размеры
- Тени
- Переходы

### Локальные стили

Каждый компонент имеет собственный CSS-файл:
- `Header.tsx` → `Header.css`
- `Footer.tsx` → `Footer.css`

## Обработка событий

В текущей реализации приложение статичное, без интерактивных элементов, требующих обработки событий.

### Потенциальные точки расширения

```typescript
// Пример добавления интерактивности
function Teachers({ teachers }: TeachersProps) {
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  
  const handleTeacherClick = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
  };
  
  return (
    <section className="teachers">
      {teachers.map(teacher => (
        <div 
          key={teacher.id} 
          onClick={() => handleTeacherClick(teacher)}
        >
          {teacher.name}
        </div>
      ))}
    </section>
  );
}
```

## Производительность

### Оптимизации

1. **Статические данные** — данные импортируются один раз при загрузке
2. **Отсутствие состояния** — компоненты не используют useState/useEffect
3. **Минимум перерисовок** — статический контент не вызывает обновлений

### Рекомендации для расширения

1. Использовать `React.memo()` для тяжёлых компонентов
2. Применять `useMemo()` для вычислений
3. Реализовать ленивую загрузку компонентов:
   ```typescript
   const LazyComponent = lazy(() => import('./LazyComponent'));
   ```

## Безопасность

### Текущая реализация

- Статические данные без пользовательского ввода
- Нет XSS-уязвимостей (React экранирует вывод)
- Нет запросов к внешним API

### Рекомендации

- Валидировать данные при добавлении динамического контента
- Использовать Content Security Policy (CSP)
- Регулярно обновлять зависимости

## Масштабируемость

### Текущие ограничения

- Все данные в одном файле
- Нет маршрутизации
- Нет разделения кода

### Рекомендации для роста

1. **Разделение данных:**
   - Вынести данные в отдельные JSON-файлы
   - Использовать CMS или backend API

2. **Маршрутизация:**
   - Добавить React Router
   - Разделить на страницы

3. **Управление состоянием:**
   - Для сложного состояния использовать Zustand или Redux Toolkit
   - Для кэширования API — React Query

4. **Code splitting:**
   - Lazy loading для страниц
   - Динамические импорты
