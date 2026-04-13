# 4. Архитектура приложения

## Общая архитектура

Приложение построено по архитектуре **Single Page Application (SPA)** с компонентным подходом React.

## Архитектурный паттерн

Проект использует архитектуру на основе **компонентов с передачей данных через props**:

```
┌─────────────────────────────────────────┐
│                  App.tsx                │
│  ┌───────────────────────────────────┐  │
│  │  Header  │  Hero  │  About  │ ... │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │           Footer                  │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

## Поток данных

### Однонаправленный поток данных

```
┌─────────────────┐
│  collegeData.ts │
└────────┬────────┘
         │ Экспорт констант
         ▼
┌─────────────────┐
│    App.tsx      │
└────────┬────────┘
         │ Передача через props
         ▼
┌─────────────────┐
│  Компоненты     │
└────────┬────────┘
         │ Рендеринг
         ▼
┌─────────────────┐
│       DOM       │
└─────────────────┘
```

## Компонентная иерархия

### Уровень 1: Корневой компонент

**App.tsx** — собирает все компоненты вместе, импортирует данные из `collegeData.ts`.

### Уровень 2: Основные секции

| Компонент | Получаемые данные |
|-----------|-------------------|
| Header | shortName, navigation |
| Footer | shortName, navigation |
| About | department |
| Specialties | department |
| Teachers | teachers |
| Ensembles | ensembles |
| Achievements | achievements |
| Graduates | graduates |
| Concerts | concerts |
| News | news |
| Admission | collegeInfo |
| Contacts | collegeInfo |

## Структура данных

### Интерфейсы

```typescript
interface Teacher, Achievement, Graduate, Concert
interface Ensemble, NewsItem, Specialty, Instrument
interface EstradaDepartment, NavigationItem, CollegeInfo
```

### Схема данных

```
collegeData.ts
├── collegeInfo: CollegeInfo
├── estradaDepartment: EstradaDepartment
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
1. Загрузка index.html
2. Загрузка main.tsx
3. Создание React root
4. Рендеринг App компонента

### 2. Рендеринг
1. App импортирует данные из collegeData.ts
2. App передаёт данные в дочерние компоненты через props
3. Каждый компонент рендерит свой JSX
4. React обновляет DOM

## Модульная структура

### collegeData.ts
```typescript
// Экспорт интерфейсов
export interface Teacher { ... }

// Экспорт данных
export const teachers: Teacher[] = [...]
export const ensembles: Ensemble[] = [...]
```

### App.tsx
```typescript
import { collegeInfo, teachers, ensembles } from './data/collegeData';
import Header from './components/Header';
import Teachers from './components/Teachers';

function App() {
  return (
    <div className="app">
      <Header shortName={collegeInfo.shortName} navigation={navigation} />
      <Teachers teachers={teachers} />
    </div>
  );
}
```

### Компоненты
```typescript
import { NavigationItem } from '../data/collegeData';
import styles from './Header.module.css';

interface HeaderProps {
  shortName: string;
  navigation: NavigationItem[];
}

function Header({ shortName, navigation }: HeaderProps) { ... }
```

## Стилизация

### CSS-архитектура

Приложение использует **CSS Modules** с BEM-подобным подходом:

```css
/* Блок */
.header { }

/* Элемент */
.header__logo { }

/* Модификатор */
.btn--primary { }
```

### Глобальные стили

**index.css** — базовые стили:
- Сброс стилей
- Настройки шрифтов
- Утилитарные классы (`.container`, `.section`)

**variables.css** — CSS-переменные:
- Цветовая палитра
- Отступы
- Тени
- Переходы

### Локальные стили

Каждый компонент имеет собственный CSS-файл:
- `Header.tsx` → `Header.module.css`
- `Footer.tsx` → `Footer.module.css`

## Производительность

### Оптимизации

1. **Статические данные** — импортируются один раз при загрузке
2. **Отсутствие состояния** — компоненты не используют useState/useEffect
3. **Минимум перерисовок** — статический контент

### Рекомендации для расширения

1. Использовать `React.memo()` для тяжёлых компонентов
2. Применять `useMemo()` для вычислений
3. Lazy loading компонентов:
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

3. **Code splitting:**
   - Lazy loading для страниц
   - Динамические импорты

4. **Управление состоянием:**
   - Для сложного состояния использовать Zustand или Redux Toolkit
