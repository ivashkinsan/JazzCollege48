# Руководство по разработке

## Введение

Руководство для разработчиков проекта Lipetsk College Arts.

---

## Начало работы

### Требования

- **Node.js:** 18.x+
- **npm:** 9.x+
- **Git**

```bash
node --version
npm --version
```

### Установка и запуск

```bash
git clone <repository-url>
cd JazzCollege48
npm install
npm run dev  # http://localhost:5173
```

---

## Стандарты кода

### TypeScript

**Строгая типизация:**
```typescript
interface Teacher {
  id: string;
  name: string;
  email?: string;
}
```

**Типизация пропсов:**
```typescript
interface HeaderProps {
  shortName: string;
  navigation: NavigationItem[];
}

function Header({ shortName, navigation }: HeaderProps) { }
```

### React

**Компоненты:**
```typescript
function ComponentName({ prop }: ComponentProps) {
  return <div className={styles.component}>{prop}</div>;
}

export default ComponentName;
```

**Именование:**
- Компоненты: PascalCase
- Файлы: PascalCase (`.tsx`), camelCase (`.ts`)

**Хуки:**
```typescript
import { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState<number>(0);
  useEffect(() => { }, []);
  return <div>{count}</div>;
}
```

### CSS

```css
.card {
  background-color: var(--color-bg-tertiary);
  padding: var(--spacing-lg);
}
```

---

## Создание компонента

### Шаг 1: Файлы

```bash
touch src/components/NewComponent.tsx
touch src/components/NewComponent.module.css
```

### Шаг 2: Реализация

```tsx
import { DataType } from '../data/collegeData';
import styles from './NewComponent.module.css';

interface NewComponentProps {
  data: DataType[];
}

function NewComponent({ data }: NewComponentProps) {
  return (
    <section className={styles.section}>
      <h2>Заголовок</h2>
      <div className={styles.grid}>
        {data.map((item) => (
          <div key={item.id} className={styles.item}>
            {item.name}
          </div>
        ))}
      </div>
    </section>
  );
}

export default NewComponent;
```

### Шаг 3: Добавить в App.tsx

```tsx
import NewComponent from './components/NewComponent';

function App() {
  return <NewComponent data={someData} />;
}
```

---

## Добавление данных

```typescript
// collegeData.ts
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
    title: "Концерт 2025",
    url: "https://youtube.com/...",
    duration: "1:30:00",
    date: "2025-05-27"
  }
];
```

---

## Изображения

### Размещение

```
public/
├── foto/
│   ├── Kokshin.jpg
│   └── Full.png
└── achievements/
    └── diploma.jpg
```

### Использование

```tsx
<img src="/foto/Kokshin.jpg" alt="Кокшин Д.Н." />
```

### Оптимизация

1. Сжимать (TinyPNG, Squoosh)
2. WebP формат
3. Указывать `alt`

---

## Отладка

### React DevTools

- [Chrome](https://chrome.google.com/webstore/detail/react-developer-tools)
- [Firefox](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)

### Консоль

```typescript
console.log('Teacher:', teacher);
console.table(teachers);
```

---

## Производительность

### React.memo

```typescript
const TeacherCard = memo(function TeacherCard({ teacher }) {
  return <div className={styles.card}>{teacher.name}</div>;
});
```

### useMemo

```typescript
const filtered = useMemo(() => items.filter(i => i.active), [items]);
```

### Lazy loading

```typescript
const Lazy = lazy(() => import('./LazyComponent'));

<Suspense fallback={<div>Загрузка...</div>}>
  <Lazy />
</Suspense>
```

---

## Доступность (A11y)

```html
<nav aria-label="Основная навигация">
  <ul>
    <li><a href="#about">Об отделении</a></li>
  </ul>
</nav>
```

```tsx
<img src="/foto/teacher.jpg" alt="Кокшин Дмитрий Николаевич, преподаватель" />

<button aria-expanded={isOpen} aria-controls="menu">Меню</button>
```

---

## Git Workflow

### Коммиты

Conventional Commits:
```
<type>(<scope>): <description>
```

**Типы:** `feat`, `fix`, `docs`, `refactor`, `chore`

**Примеры:**
```bash
feat(components): добавить VideoGallery
fix(data): исправить опечатку
docs: обновить README.md
```

### Ветвление

```bash
git checkout -b feature/new-component
git add .
git commit -m "feat(components): добавить компонент"
git push origin feature/new-component
```

### Code Review

- [ ] Код следует стандартам
- [ ] Типизация корректна
- [ ] Стили используют переменные
- [ ] Нет console.log в production

---

## Устранение проблем

### "Module not found"

```bash
rm -rf node_modules
npm install
```

### Ошибка типов

```typescript
interface A { id: string; }
interface B { id: number; }

const a: A = { id: "1" };
const b: B = { id: 1 };  // ✅
```

### HMR не работает

```bash
# Перезапустить сервер
# Очистить кэш браузера
```

---

## Ресурсы

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [Vite](https://vitejs.dev/guide/)
- [ESLint](https://eslint.org/play/)
