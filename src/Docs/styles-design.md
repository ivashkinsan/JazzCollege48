# Стили и дизайн-система

## Обзор

Приложение использует **CSS Modules** с CSS-переменными для создания согласованной дизайн-системы. Каждый компонент имеет собственный CSS-файл с изолированными стилями, что предотвращает конфликты имён классов.

## CSS Modules

### Что такое CSS Modules

CSS Modules — это подход, при котором CSS-файлы обрабатываются как модули. Классы в таких файлах становятся локальными по умолчанию и получают уникальные имена при сборке.

### Подключение в Vite

Конфигурация CSS Modules находится в `vite.config.js`:

```javascript
export default defineConfig({
  plugins: [react()],
  css: {
    modules: {
      localsConvention: 'camelCaseOnly',  // camelCase для имён классов
      scopeBehaviour: 'local',            // Локальная область видимости
      generateScopedName: '[name]__[local]--[hash:base64:5]',
    },
  },
})
```

**Параметры:**
- `localsConvention: 'camelCaseOnly'` — классы доступны в camelCase (`styles.headerNav`)
- `scopeBehaviour: 'local'` — все классы локальные по умолчанию
- `generateScopedName` — шаблон генерации уникальных имён (например, `Header__headerNav--a3f2b`)

### Использование в компонентах

```tsx
// Импорт CSS Module
import styles from './Header.module.css';

// Использование классов
function Header() {
  return (
    <header className={styles.header}>
      <nav className={styles.headerNav}>
        <a className={styles.headerNavLink}>Главная</a>
      </nav>
    </header>
  );
}
```

**Преимущества:**
- ✅ Изоляция стилей — классы не конфликтуют
- ✅ Явные зависимости — импорты показывают используемые стили
- ✅ Автоматическая генерация уникальных имён
- ✅ Поддержка TypeScript через vite-env.d.ts
- ✅ Tree-shaking — неиспользуемые классы удаляются

### Правила именования классов

Проект использует **camelCase** для имён классов в CSS Modules (согласно `localsConvention: 'camelCaseOnly'`):

```css
/* ✅ Правильно: camelCase */
.headerNav { }
.headerNavLink { }
.teacherCard { }
.teacherCardImage { }
.heroImageWrapper { }

/* ❌ Избегайте: kebab-case (не будет работать в TypeScript) */
.header-nav { }
.header-nav-link { }
```

**Почему camelCase:**
- При использовании `localsConvention: 'camelCaseOnly'`, классы с дефисами (`header-nav`) не будут доступны через `styles.headerNav`
- TypeScript не распознает классы с дефисами без дополнительных настроек
- Единый стиль кода во всём проекте

### Динамические классы

Для условного применения классов используйте template literals или библиотеки вроде `clsx`:

```tsx
// Template literals
<div className={`${styles.teacherCard} ${styles[modifierClass]}`} />

// clsx (рекомендуется)
import clsx from 'clsx';

<div className={clsx(styles.teacherCard, {
  [styles.teacherCardFeatured]: isFeatured,
  [styles.teacherCardHidden]: !isVisible,
})} />
```

### Композиция классов

CSS Modules поддерживают композицию через `composes`:

```css
/* Базовый класс кнопки */
.btn {
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--border-radius);
}

/* Наследование стилей */
.btnPrimary {
  composes: btn;
  background-color: var(--color-accent);
  color: var(--color-black);
}
```

```tsx
// В компоненте
<button className={styles.btnPrimary}>Кнопка</button>
// Сгенерирует: class="btn--a3f2b btnPrimary--b4g3c"
```

### Глобальные стили

Для глобальных стилей (сброс, переменные, утилиты) используются обычные CSS-файлы:

```tsx
// main.tsx
import './styles/variables.css'  // Глобальные переменные
import './styles/global.css'     // Глобальные стили
```

## Файловая структура

```
src/
├── styles/
│   ├── variables.css      # Глобальные CSS-переменные
│   └── global.css         # Глобальные стили (reset, container, section)
├── components/
│   ├── Header.module.css
│   ├── Footer.module.css
│   ├── Hero.module.css
│   ├── About.module.css
│   ├── Specialties.module.css
│   ├── Teachers.module.css
│   ├── Ensembles.module.css
│   ├── Achievements.module.css
│   ├── Graduates.module.css
│   ├── Concerts.module.css
│   ├── News.module.css
│   ├── Admission.module.css
│   └── Contacts.module.css
├── App.tsx
└── main.tsx
```

---

## Дизайн-токены (CSS-переменные)

### Цветовая палитра

**Основные цвета (тёмная тема):**

```css
:root {
  /* Фоновые цвета */
  --color-bg: #0a0a0a;           /* Основной фон */
  --color-bg-secondary: #141414; /* Вторичный фон */
  --color-bg-tertiary: #1a1a1a;  /* Третичный фон */

  /* Цвета текста */
  --color-text: #f5f5f5;         /* Основной текст */
  --color-text-secondary: #b0b0b0; /* Вторичный текст */
  --color-text-muted: #666666;   /* Приглушённый текст */

  /* Акцентные цвета (золотой) */
  --color-accent: #D4AF37;       /* Основной акцент */
  --color-accent-hover: #E8C85A; /* Акцент при наведении */
  --color-accent-dark: #B8942E;  /* Тёмный акцент */

  /* Нейтральные цвета */
  --color-white: #FFFFFF;
  --color-black: #000000;
  --color-gray: #333333;
  --color-gray-light: #444444;
}
```

**Цветовая схема:**

| Назначение | Переменная | Значение |
|------------|------------|----------|
| Основной фон | `--color-bg` | #0a0a0a |
| Фон секций | `--color-bg-secondary` | #141414 |
| Фон карточек | `--color-bg-tertiary` | #1a1a1a |
| Основной текст | `--color-text` | #f5f5f5 |
| Вторичный текст | `--color-text-secondary` | #b0b0b0 |
| Акцент | `--color-accent` | #D4AF37 (золотой) |
| Акцент hover | `--color-accent-hover` | #E8C85A |

---

### Размеры и отступы

```css
:root {
  /* Размеры */
  --header-height: 70px;
  --container-width: 1200px;
  --border-radius: 4px;

  /* Отступы */
  --spacing-xs: 0.5rem;   /* 8px */
  --spacing-sm: 1rem;     /* 16px */
  --spacing-md: 1.5rem;   /* 24px */
  --spacing-lg: 2rem;     /* 32px */
  --spacing-xl: 3rem;     /* 48px */
  --spacing-xxl: 5rem;    /* 80px */
}
```

**Шкала отступов:**

| Переменная | Значение | Использование |
|------------|----------|---------------|
| `--spacing-xs` | 0.5rem | Маленькие элементы |
| `--spacing-sm` | 1rem | Стандартные отступы |
| `--spacing-md` | 1.5rem | Отступы между секциями |
| `--spacing-lg` | 2rem | Большие отступы |
| `--spacing-xl` | 3rem | Отступы секций |
| `--spacing-xxl` | 5rem | Разделители страниц |

---

### Тени

```css
:root {
  --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 8px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 8px 16px rgba(0, 0, 0, 0.5);
}
```

**Уровни теней:**

| Переменная | Использование |
|------------|---------------|
| `--shadow-sm` | Карточки, кнопки |
| `--shadow-md` | Выпадающие меню |
| `--shadow-lg` | Модальные окна |

---

### Переходы (Transitions)

```css
:root {
  --transition-fast: 0.2s ease;
  --transition-normal: 0.3s ease;
  --transition-slow: 0.5s ease;
}
```

---

### Границы

```css
:root {
  --border-color: #333;
  --border-light: #444;
}
```

---

## Глобальные стили

### index.css

Базовые стили для всего приложения:

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: var(--color-bg);
  color: var(--color-text);
  line-height: 1.6;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;
}

/* Утилитарные классы */
.container {
  max-width: var(--container-width);
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
}

.section {
  padding: var(--spacing-xxl) 0;
}

.section--black {
  background-color: var(--color-bg-secondary);
}
```

**Ключевые особенности:**
- Сброс margin/padding
- Плавная прокрутка к якорям
- Системные шрифты
- Контейнер с максимальной шириной
- Базовые классы секций

---

### App.css

Стили корневого компонента:

```css
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main {
  flex: 1;
}
```

**Назначение:**
- Растягивание приложения на всю высоту экрана
- Flexbox-структура для прижатия footer к низу

---

## БЭМ-методология

Проект использует **BEM-подобную структуру** имён классов с адаптацией для CSS Modules (camelCase):

### Блок

Самостоятельный компонент:
```css
/* ✅ Правильно: camelCase для CSS Modules */
.header { }
.teacherCard { }
.btn { }
```

### Элемент

Часть блока, обозначается заглавной буквой (CamelCase):
```css
/* ✅ Правильно: CamelCase вместо __ */
.headerLogo { }
.headerNav { }
.teacherCardName { }
.btnIcon { }
```

### Модификатор

Вариация блока/элемента, обозначается заглавной буквой:
```css
/* ✅ Правильно: CamelCase для модификаторов */
.btnPrimary { }
.btnOutline { }
.sectionBlack { }
.teacherCardFeatured { }
```

### Пример использования

```html
<!-- Блок -->
<button class="btn btnPrimary">Текст</button>

<!-- Элемент -->
<div class="headerLogo">
  <span class="headerLogoText">ЛОКИ</span>
</div>

<!-- Модификатор -->
<section class="section sectionBlack">
```

### Сравнение с классическим БЭМ

| Классический БЭМ | CSS Modules (проект) |
|------------------|----------------------|
| `.header` | `.header` |
| `.header__logo` | `.headerLogo` |
| `.header__nav-item` | `.headerNavItem` |
| `.btn--primary` | `.btnPrimary` |
| `.teacher-card__name` | `.teacherCardName` |

**Почему такая адаптация:**
- `localsConvention: 'camelCaseOnly'` требует camelCase имена
- Удобен в TypeScript: `styles.headerNav` вместо `styles['header__nav']`
- Сохраняет семантику БЭМ без синтаксических символов

---

## Компонентные стили

### Header.module.css

Пример стилей компонента Header с использованием CSS Modules:

```css
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: var(--header-height);
  background-color: var(--color-bg-secondary);
  border-bottom: 1px solid var(--border-color);
  z-index: 1000;
}

.headerContainer {
  max-width: var(--container-width);
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.headerLogo {
  display: flex;
  flex-direction: column;
}

.headerLogoText {
  font-size: 1.25rem;
  font-weight: bold;
  color: var(--color-accent);
}

.headerLogoSubtext {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}

.headerNav {
  display: flex;
  gap: var(--spacing-lg);
}

.headerNavLink {
  color: var(--color-text);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.headerNavLink:hover {
  color: var(--color-accent);
}
```

**Использование в компоненте:**

```tsx
import styles from './Header.module.css';

function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <div className={styles.headerLogo}>
          <span className={styles.headerLogoText}>ЛОКИ</span>
        </div>
        <nav className={styles.headerNav}>
          <a className={styles.headerNavLink}>Главная</a>
        </nav>
      </div>
    </header>
  );
}
```

---

### Hero.module.css

```css
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: var(--spacing-xxl) 0;
  background: linear-gradient(135deg, var(--color-bg) 0%, var(--color-bg-secondary) 100%);
}

.heroContent {
  flex: 1;
  max-width: 600px;
}

.heroSubtitle {
  color: var(--color-accent);
  font-size: 1rem;
  margin-bottom: var(--spacing-md);
}

.heroTitle {
  font-size: 3rem;
  line-height: 1.2;
  margin-bottom: var(--spacing-lg);
}

.heroTitleAccent {
  color: var(--color-accent);
}

.heroDescription {
  font-size: 1.125rem;
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-lg);
}

.heroImageWrapper {
  flex: 1;
  display: flex;
  justify-content: center;
}

.heroImage {
  max-width: 100%;
  height: auto;
  border-radius: var(--border-radius);
}
```

---

### Кнопки (общие стили)

```css
.btn {
  display: inline-block;
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--border-radius);
  text-decoration: none;
  font-weight: 500;
  transition: all var(--transition-fast);
  cursor: pointer;
}

.btnPrimary {
  background-color: var(--color-accent);
  color: var(--color-black);
}

.btnPrimary:hover {
  background-color: var(--color-accent-hover);
}

.btnOutline {
  background-color: transparent;
  border: 2px solid var(--color-accent);
  color: var(--color-accent);
}

.btnOutline:hover {
  background-color: var(--color-accent);
  color: var(--color-black);
}
```

**Использование:**

```tsx
import styles from './Hero.module.css';

<button className={styles.btnPrimary}>Кнопка</button>
<button className={styles.btnOutline}>Контрастная</button>
```

---

### Карточки

```css
/* Карточка преподавателя */
.teacherCard {
  background-color: var(--color-bg-tertiary);
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  transition: transform var(--transition-fast);
}

.teacherCard:hover {
  transform: translateY(-4px);
}

.teacherCard img {
  width: 100%;
  height: 300px;
  object-fit: cover;
}

.teacherCardContent {
  padding: var(--spacing-lg);
}

.teacherCardName {
  font-size: 1.25rem;
  margin-bottom: var(--spacing-xs);
}

.teacherCardPosition {
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-xs);
}

.teacherCardSpecialty {
  color: var(--color-accent);
}
```

**Использование:**

```tsx
import styles from './Teachers.module.css';

<div className={styles.teacherCard}>
  <img src={photo} alt={name} />
  <div className={styles.teacherCardContent}>
    <h3 className={styles.teacherCardName}>{name}</h3>
    <p className={styles.teacherCardPosition}>{position}</p>
  </div>
</div>
```

---

## Адаптивность

### Media Queries

Проект использует mobile-first подход:

```css
/* Базовые стили для мобильных */
.headerNav {
  display: none;
}

/* Планшеты */
@media (min-width: 768px) {
  .headerNav {
    display: flex;
  }

  .hero {
    flex-direction: row;
  }
}

/* Десктоп */
@media (min-width: 1024px) {
  .container {
    max-width: var(--container-width);
  }

  .teachersGrid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

### Сетки

```css
/* Адаптивная сетка для карточек */
.teachersGrid {
  display: grid;
  gap: var(--spacing-lg);
  grid-template-columns: 1fr;
}

@media (min-width: 640px) {
  .teachersGrid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .teachersGrid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

**Использование в компоненте:**

```tsx
import styles from './Teachers.module.css';

<div className={styles.teachersGrid}>
  {teachers.map(teacher => (
    <div key={teacher.id} className={styles.teacherCard}>
      {/* Контент карточки */}
    </div>
  ))}
</div>
```

---

## Типографика

### Шрифты

```css
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 
    'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 
    'Helvetica Neue', sans-serif;
}
```

**Иерархия заголовков:**

| Элемент | Размер | Вес |
|---------|--------|-----|
| H1 (Hero) | 3rem | 700 |
| H2 (Section) | 2.5rem | 600 |
| H3 (Card) | 1.25rem | 500 |
| Body | 1rem | 400 |
| Small | 0.875rem | 400 |

---

## Темизация

### Тёмная тема (по умолчанию)

Все цвета определены в `:root` и используют тёмную палитру.

### Переключение темы (потенциальное)

```css
/* Светлая тема */
[data-theme="light"] {
  --color-bg: #ffffff;
  --color-bg-secondary: #f5f5f5;
  --color-bg-tertiary: #eeeeee;
  --color-text: #1a1a1a;
  --color-text-secondary: #666666;
  --border-color: #ddd;
}
```

```javascript
// JavaScript для переключения
document.documentElement.setAttribute('data-theme', 'light');
```

---

## Лучшие практики

### 1. Использование переменных

✅ **Правильно:**
```css
.card {
  background-color: var(--color-bg-tertiary);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-md);
}
```

❌ **Неправильно:**
```css
.card {
  background-color: #1a1a1a;
  padding: 2rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
}
```

### 2. Именование классов (CSS Modules)

✅ **Правильно: camelCase для CSS Modules**
```css
.teacherCard { }
.teacherCardName { }
.teacherCardFeatured { }
```

❌ **Неправильно: kebab-case не работает с camelCaseOnly**
```css
.teacher-card { }
.teacher-card__name { }
.teacher-card--featured { }
```

### 3. Адаптивность

✅ **Правильно:**
```css
.grid {
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
```

❌ **Неправильно:**
```css
.grid {
  grid-template-columns: repeat(3, 1fr);
}

@media (max-width: 767px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
```

### 4. Структура CSS Module файла

✅ **Правильно: группировка по назначению**
```css
/* Layout */
.header { }
.headerContainer { }

/* Elements */
.headerLogo { }
.headerNav { }
.headerNavLink { }

/* Modifiers */
.headerNavActive { }

/* Media */
@media (max-width: 768px) {
  .headerNav { }
}
```

### 5. Экспорт и импорт стилей

✅ **Правильно: импорт как объект**
```tsx
import styles from './Header.module.css';

function Header() {
  return <header className={styles.header} />;
}
```

❌ **Неправильно: прямой импорт классов**
```tsx
import './Header.module.css'; // ❌ Не использует CSS Modules

function Header() {
  return <header className="header" />; // ❌ Прямое имя класса
}
```

### 6. Работа с глобальными стилями

✅ **Правильно: :global() для глобальных классов**
```css
/* Локальные стили */
.myComponent { }

/* Глобальные стили (например, для сторонних библиотек) */
:global(.external-library-class) {
  margin: 0;
}
```

### 7. TypeScript и CSS Modules

✅ **Правильно: TypeScript автоматически распознаёт типы**
```tsx
import styles from './Header.module.css';

// TypeScript знает типы всех классов
const className: string = styles.header; // ✅
```

Для ручной типизации:
```tsx
import type { CSSModule } from 'vite/client';

interface Styles {
  readonly header: string;
  readonly headerNav: string;
}

const styles: CSSModule & Styles = {} as CSSModule & Styles;
```

---

## Устранение неполадок (Troubleshooting)

### Классы не применяются

**Проблема:** Классы из CSS Module не применяются к элементам.

**Причина:** Неправильный импорт или использование.

```tsx
// ❌ Неправильно
import './Header.module.css';
<div className="header" />

// ✅ Правильно
import styles from './Header.module.css';
<div className={styles.header} />
```

---

### TypeScript не распознаёт классы

**Проблема:** Ошибка TypeScript: `Property 'header' does not exist on type...`

**Решение 1:** Убедитесь, что файл имеет расширение `.module.css`:
```
Header.module.css  // ✅
Header.css         // ❌ Не будет работать как CSS Module
```

**Решение 2:** Проверьте `vite-env.d.ts`:
```ts
/// <reference types="vite/client" />

declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}
```

**Решение 3:** Перезапустите TypeScript server в VS Code:
- `Ctrl+Shift+P` → "TypeScript: Restart TS Server"

---

### Стили не обновляются при изменении

**Проблема:** Изменения в CSS файлах не отображаются в браузере.

**Решение:**
1. Проверьте, что файл сохранён
2. Очистите кэш браузера (`Ctrl+Shift+R`)
3. Перезапустите dev-сервер:
   ```bash
   # Остановите сервер (Ctrl+C)
   npm run dev
   ```

---

### Конфликты имён классов

**Проблема:** Классы из разных компонентов конфликтуют.

**Причина:** Использование одинаковых имён в разных модулях.

**Решение:** Используйте уникальные префиксы:
```css
/* Header.module.css */
.headerNav { }      /* ✅ Уникально */

/* Footer.module.css */
.footerNav { }      /* ✅ Уникально */
```

---

### Глобальные стили перебивают CSS Modules

**Проблема:** Глобальные стали имеют больший приоритет.

**Решение 1:** Используйте `:global()` осознанно:
```css
/* Локальный стиль с высоким приоритетом */
.myComponent {
  all: initial;
  /* Переопределите глобальные стили */
}
```

**Решение 2:** Увеличьте специфичность селектора:
```css
/* Вместо */
.button { }

/* Используйте */
.componentName .button { }
```

---

## Расширение дизайн-системы

### Добавление нового цвета

1. Добавить переменную в `variables.css`:
```css
:root {
  --color-success: #4caf50;
  --color-error: #f44336;
  --color-warning: #ff9800;
}
```

2. Использовать в CSS Module компонента:
```css
/* Alert.module.css */
.alertSuccess {
  background-color: var(--color-success);
}
```

3. Использовать в компоненте:
```tsx
import styles from './Alert.module.css';

<div className={styles.alertSuccess}>Успех!</div>
```

### Добавление нового размера

```css
:root {
  --spacing-3xl: 6rem;
  --container-width-wide: 1400px;
}
```

### Добавление нового шрифта

```css
:root {
  --font-heading: 'Playfair Display', serif;
  --font-body: 'Inter', sans-serif;
}

h1, h2, h3 {
  font-family: var(--font-heading);
}

body {
  font-family: var(--font-body);
}
```

### Создание нового компонента

1. Создать файл компонента: `src/components/NewComponent.tsx`
2. Создать CSS Module: `src/components/NewComponent.module.css`
3. Использовать camelCase для классов:

```css
/* NewComponent.module.css */
.newComponent { }
.newComponentContent { }
.newComponentTitle { }
.newComponentHighlighted { }
```

```tsx
// NewComponent.tsx
import styles from './NewComponent.module.css';

function NewComponent() {
  return (
    <div className={styles.newComponent}>
      <h2 className={styles.newComponentTitle}>Заголовок</h2>
    </div>
  );
}
```
