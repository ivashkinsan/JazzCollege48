# Руководство по разработке

## Введение

Это руководство предназначено для разработчиков, работающих над проектом Lipetsk College Arts. Оно описывает лучшие практики, соглашения и процессы разработки.

---

## Начало работы

### Предварительные требования

- **Node.js:** версия 18.x или выше
- **npm:** версия 9.x или выше
- **Git:** для работы с репозиторием

**Проверка версий:**
```bash
node --version  # v18.x.x или выше
npm --version   # 9.x.x или выше
```

### Установка

```bash
# Клонировать репозиторий
git clone <repository-url>
cd JazzCollege48

# Установить зависимости
npm install
```

### Запуск проекта

```bash
# Сервер разработки
npm run dev

# Открыть в браузере
# http://localhost:5173
```

---

## Структура коммитов

### Формат коммитов

Проект использует соглашение Conventional Commits:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Типы коммитов:**
- `feat` — новая функциональность
- `fix` — исправление ошибки
- `docs` — изменение документации
- `style` — форматирование, отступы (не влияющие на код)
- `refactor` — рефакторинг кода
- `test` — добавление тестов
- `chore` — изменение конфигурации, зависимостей

**Примеры:**
```bash
feat(components): добавить компонент VideoGallery
fix(data): исправить опечатку в описании преподавателя
docs: обновить README.md
refactor(styles): вынести общие стили в variables.css
```

### Ветвление

**Основная ветка:**
- `main` — основная ветка для production

**Ветки функций:**
```bash
git checkout -b feature/add-video-gallery
git checkout -b fix/teacher-photo-path
git checkout -b docs/update-readme
```

---

## Стандарты кода

### TypeScript

**Общие правила:**

1. **Использовать строгую типизацию:**
```typescript
// ✅ Правильно
interface Teacher {
  id: string;
  name: string;
  email?: string;  // Опциональное поле
}

// ❌ Неправильно
const teacher: any = { id: "1", name: "Имя" };
```

2. **Избегать `any`:**
```typescript
// ✅ Правильно
function getTeacher(id: string): Teacher | undefined {
  return teachers.find(t => t.id === id);
}

// ❌ Неправильно
function getTeacher(id: any): any {
  return teachers.find(t => t.id === id);
}
```

3. **Использовать типы для пропсов:**
```typescript
// ✅ Правильно
interface HeaderProps {
  shortName: string;
  navigation: NavigationItem[];
}

function Header({ shortName, navigation }: HeaderProps) {
  // ...
}

// ❌ Неправильно
function Header({ shortName, navigation }) {
  // ...
}
```

### React

**Функциональные компоненты:**

```typescript
// ✅ Правильно
function ComponentName({ prop }: ComponentProps) {
  return <div className="component-name">{prop}</div>;
}

export default ComponentName;
```

**Именование:**
- Компоненты: PascalCase (`TeacherCard`, `NewsList`)
- Файлы: PascalCase для компонентов (`TeacherCard.tsx`)
- Утилиты: camelCase (`collegeData.ts`)

**Хуки:**

```typescript
import { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState<number>(0);
  
  useEffect(() => {
    // side effects
  }, []);
  
  return <div>{count}</div>;
}
```

### CSS

**BEM-именование:**

```css
/* ✅ Правильно */
.teacher-card { }
.teacher-card__name { }
.teacher-card__name--highlighted { }

/* ❌ Неправильно */
.teacherCard { }
.name { }
.highlighted { }
```

**Использование переменных:**

```css
/* ✅ Правильно */
.card {
  background-color: var(--color-bg-tertiary);
  padding: var(--spacing-lg);
}

/* ❌ Неправильно */
.card {
  background-color: #1a1a1a;
  padding: 2rem;
}
```

---

## Создание нового компонента

### Шаг 1: Создать файлы

```bash
# Создать файлы компонента
touch src/components/NewComponent.tsx
touch src/components/NewComponent.css
```

### Шаг 2: Реализовать компонент

```tsx
// src/components/NewComponent.tsx
import { DataType } from '../data/collegeData';
import './NewComponent.css';

interface NewComponentProps {
  data: DataType[];
}

function NewComponent({ data }: NewComponentProps) {
  return (
    <section className="new-component">
      <h2>Заголовок</h2>
      <div className="new-component__grid">
        {data.map((item) => (
          <div key={item.id} className="new-component__item">
            {item.name}
          </div>
        ))}
      </div>
    </section>
  );
}

export default NewComponent;
```

### Шаг 3: Добавить стили

```css
/* src/components/NewComponent.css */
.new-component {
  padding: var(--spacing-xxl) 0;
}

.new-component__grid {
  display: grid;
  gap: var(--spacing-lg);
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}

.new-component__item {
  background-color: var(--color-bg-tertiary);
  padding: var(--spacing-lg);
  border-radius: var(--border-radius);
}
```

### Шаг 4: Добавить в App.tsx

```tsx
// src/App.tsx
import NewComponent from './components/NewComponent';

function App() {
  return (
    <div className="app">
      {/* ... другие компоненты */}
      <NewComponent data={someData} />
      {/* ... другие компоненты */}
    </div>
  );
}
```

---

## Добавление новых данных

### Шаг 1: Определить интерфейс

```typescript
// src/data/collegeData.ts
export interface Video {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  duration: string;
  date: string;
}
```

### Шаг 2: Создать массив данных

```typescript
export const videos: Video[] = [
  {
    id: "1",
    title: "Отчётный концерт 2025",
    url: "https://youtube.com/watch?v=...",
    thumbnail: "/thumbnails/concert-2025.jpg",
    duration: "1:30:00",
    date: "2025-05-27"
  }
];
```

### Шаг 3: Экспортировать

```typescript
// В конце файла collegeData.ts
export { videos };
```

---

## Работа с изображениями

### Размещение файлов

**Публичные изображения** (доступны по URL):
```
public/
├── foto/
│   ├── Kokshin.jpg
│   └── Full.png
└── achievements/
    └── diploma.jpg
```

**Использование:**
```tsx
<img src="/foto/Kokshin.jpg" alt="Кокшин Д.Н." />
```

**Импорт изображений** (для оптимизации):
```typescript
import heroImage from '../assets/hero.png';

<img src={heroImage} alt="Hero" />
```

### Оптимизация изображений

**Рекомендации:**
1. Сжимать изображения перед добавлением
2. Использовать современные форматы (WebP)
3. Указывать `alt` для доступности
4. Оптимизировать размеры под разные экраны

**Инструменты:**
- [TinyPNG](https://tinypng.com/) — сжатие PNG/JPG
- [Squoosh](https://squoosh.app/) — конвертация форматов
- [ImageOptim](https://imageoptim.com/) — оптимизация для Mac

---

## Отладка

### React DevTools

**Установка:**
- [Chrome Extension](https://chrome.google.com/webstore/detail/react-developer-tools)
- [Firefox Add-on](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)

**Возможности:**
- Просмотр дерева компонентов
- Инспекция пропсов и состояния
- Профилирование производительности

### Консоль браузера

```typescript
// Отладочный вывод
console.log('Teacher:', teacher);
console.table(teachers);

// Трассировка
console.trace('Component render');
```

### Source Maps

Vite генерирует source maps автоматически в режиме разработки.

**Настройка в vite.config.js:**
```javascript
export default defineConfig({
  build: {
    sourcemap: true  // Включить source maps для production
  }
});
```

---

## Тестирование

### Ручное тестирование

**Чеклист:**
- [ ] Все ссылки работают
- [ ] Изображения загружаются
- [ ] Адаптивность на разных экранах
- [ ] Консоль без ошибок
- [ ] Навигация работает

### Автоматические тесты (потенциально)

**Установка Vitest:**
```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom
```

**Пример теста:**
```typescript
// src/components/__tests__/Header.test.tsx
import { render, screen } from '@testing-library/react';
import Header from '../Header';

test('отображает название колледжа', () => {
  render(<Header shortName="ЛОКИ" navigation={[]} />);
  expect(screen.getByText('ЛОКИ')).toBeInTheDocument();
});
```

**Запуск тестов:**
```bash
npx vitest
```

---

## Производительность

### Оптимизация рендеринга

**React.memo для тяжёлых компонентов:**
```typescript
import { memo } from 'react';

const TeacherCard = memo(function TeacherCard({ teacher }: TeacherCardProps) {
  return (
    <div className="teacher-card">
      {teacher.name}
    </div>
  );
});
```

**useMemo для вычислений:**
```typescript
import { useMemo } from 'react';

function Component({ items }: ComponentProps) {
  const filteredItems = useMemo(() => {
    return items.filter(item => item.active);
  }, [items]);
  
  return <div>{filteredItems.map(...)}</div>;
}
```

### Lazy loading

```typescript
import { lazy, Suspense } from 'react';

const LazyComponent = lazy(() => import('./LazyComponent'));

function App() {
  return (
    <Suspense fallback={<div>Загрузка...</div>}>
      <LazyComponent />
    </Suspense>
  );
}
```

---

## Доступность (A11y)

### Семантический HTML

```html
<!-- ✅ Правильно -->
<nav aria-label="Основная навигация">
  <ul>
    <li><a href="#about">Об отделении</a></li>
  </ul>
</nav>

<!-- ❌ Неправильно -->
<div class="nav">
  <div onclick="navigate()">Об отделении</div>
</div>
```

### Alt-текст для изображений

```tsx
<!-- ✅ Правильно -->
<img src="/foto/teacher.jpg" alt="Кокшин Дмитрий Николаевич, преподаватель саксофона" />

<!-- ❌ Неправильно -->
<img src="/foto/teacher.jpg" />
<img src="/foto/teacher.jpg" alt="image" />
```

### ARIA-атрибуты

```tsx
<button 
  aria-expanded={isOpen}
  aria-controls="menu-content"
>
  Меню
</button>
```

---

## Документирование

### JSDoc для функций

```typescript
/**
 * Находит преподавателя по ID
 * @param id - Уникальный идентификатор преподавателя
 * @returns Объект преподавателя или undefined
 */
function findTeacherById(id: string): Teacher | undefined {
  return teachers.find(teacher => teacher.id === id);
}
```

### Комментарии в коде

```typescript
// ✅ Правильно: объясняет "почему"
// Используем useMemo для оптимизации, т.к. фильтрация дорогая
const filtered = useMemo(() => expensiveFilter(items), [items]);

// ❌ Неправильно: объясняет "что"
// Фильтруем элементы
const filtered = items.filter(item => item.active);
```

---

## Git Workflow

### Создание pull request

1. **Создать ветку:**
   ```bash
   git checkout -b feature/new-component
   ```

2. **Внести изменения:**
   ```bash
   git add .
   git commit -m "feat(components): добавить новый компонент"
   ```

3. **Отправить ветку:**
   ```bash
   git push origin feature/new-component
   ```

4. **Создать PR на GitHub**

### Code Review Checklist

- [ ] Код следует стандартам проекта
- [ ] Типизация TypeScript корректна
- [ ] Компоненты переиспользуемы
- [ ] Стили используют переменные
- [ ] Нет console.log в production-коде
- [ ] Коммиты имеют понятные сообщения

---

## Устранение проблем

### Частые ошибки

**"Module not found":**
```bash
# Проверить путь импорта
import Component from './Component';  // ✅
import Component from '../Component'; // ❌

# Очистить кэш
rm -rf node_modules
npm install
```

**"Type 'X' is not assignable to type 'Y'":**
```typescript
// Проверить соответствие типов
interface A { id: string; }
interface B { id: number; }

const a: A = { id: "1" };
const b: B = a;  // ❌ Ошибка типа

// Исправить:
const b: B = { id: 1 };  // ✅
```

**HMR не работает:**
```bash
# Перезапустить сервер
# Ctrl+C, затем npm run dev

# Очистить кэш браузера
# Проверить расширения браузера
```

---

## Ресурсы

### Документация

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [Vite](https://vitejs.dev/guide/)
- [CSS Variables](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)

### Инструменты

- [ESLint Playground](https://eslint.org/play/)
- [TypeScript Playground](https://www.typescriptlang.org/play)
- [CSS Triggers](https://csstriggers.com/)

### Расширения VS Code

- ESLint
- Prettier
- CSS Variables
- React Refactor
- Auto Rename Tag
