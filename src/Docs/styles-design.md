# Стили и дизайн-система

## Обзор

Приложение использует **CSS Modules** с CSS-переменными.

## CSS Modules

### Подключение

```javascript
// vite.config.js
export default defineConfig({
  css: {
    modules: {
      localsConvention: 'camelCaseOnly',
      scopeBehaviour: 'local',
    },
  },
})
```

### Использование

```tsx
import styles from './Header.module.css';

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
- ✅ Изоляция стилей
- ✅ Автоматическая генерация имён
- ✅ Поддержка TypeScript

### Правила именования

```css
/* ✅ Правильно: camelCase */
.headerNav { }
.teacherCard { }

/* ❌ Избегайте: kebab-case */
.header-nav { }
```

---

## Дизайн-токены

### Цветовая палитра

```css
:root {
  --color-bg: #0a0a0a;
  --color-bg-secondary: #141414;
  --color-bg-tertiary: #1a1a1a;

  --color-text: #f5f5f5;
  --color-text-secondary: #b0b0b0;

  --color-accent: #D4AF37;
  --color-accent-hover: #E8C85A;

  --color-white: #FFFFFF;
  --color-black: #000000;
}
```

| Назначение | Переменная | Значение |
|------------|------------|----------|
| Основной фон | `--color-bg` | #0a0a0a |
| Фон секций | `--color-bg-secondary` | #141414 |
| Акцент | `--color-accent` | #D4AF37 |

---

### Размеры

```css
:root {
  --header-height: 70px;
  --container-width: 1200px;
  --border-radius: 4px;

  --spacing-xs: 0.5rem;   /* 8px */
  --spacing-sm: 1rem;     /* 16px */
  --spacing-md: 1.5rem;   /* 24px */
  --spacing-lg: 2rem;     /* 32px */
  --spacing-xl: 3rem;     /* 48px */
  --spacing-xxl: 5rem;    /* 80px */
}
```

---

### Тени и переходы

```css
:root {
  --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 8px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 8px 16px rgba(0, 0, 0, 0.5);

  --transition-fast: 0.2s ease;
  --transition-normal: 0.3s ease;
  --border-color: #333;
}
```

---

## Глобальные стили

### index.css

```css
* { margin: 0; padding: 0; box-sizing: border-box; }

html { scroll-behavior: smooth; }

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  background-color: var(--color-bg);
  color: var(--color-text);
  line-height: 1.6;
}

.container {
  max-width: var(--container-width);
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
}

.section { padding: var(--spacing-xxl) 0; }
.section--black { background-color: var(--color-bg-secondary); }
```

### App.css

```css
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.main { flex: 1; }
```

---

## БЭМ-методология

| Классический БЭМ | CSS Modules |
|------------------|-------------|
| `.header__logo` | `.headerLogo` |
| `.btn--primary` | `.btnPrimary` |

### Пример

```css
.header { }
.headerLogo { }
.headerNav { }
.headerNavLink { }
```

```tsx
<header className={styles.header}>
  <div className={styles.headerLogo}>ЛОКИ</div>
  <nav className={styles.headerNav}>
    <a className={styles.headerNavLink}>Главная</a>
  </nav>
</header>
```

---

## Компонентные стили

### Header.module.css

```css
.header {
  position: fixed;
  top: 0;
  width: 100%;
  height: var(--header-height);
  background-color: var(--color-bg-secondary);
  border-bottom: 1px solid var(--border-color);
  z-index: 1000;
}

.headerContainer {
  max-width: var(--container-width);
  padding: 0 var(--spacing-lg);
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.headerLogo { display: flex; flex-direction: column; }

.headerLogoText {
  font-size: 1.25rem;
  font-weight: bold;
  color: var(--color-accent);
}

.headerNav { display: flex; gap: var(--spacing-lg); }

.headerNavLink {
  color: var(--color-text);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.headerNavLink:hover { color: var(--color-accent); }
```

---

### Кнопки

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
.btnPrimary:hover { background-color: var(--color-accent-hover); }

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

---

### Карточки

```css
.teacherCard {
  background-color: var(--color-bg-tertiary);
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  transition: transform var(--transition-fast);
}
.teacherCard:hover { transform: translateY(-4px); }

.teacherCard img {
  width: 100%;
  height: 300px;
  object-fit: cover;
}

.teacherCardContent { padding: var(--spacing-lg); }
.teacherCardName { font-size: 1.25rem; margin-bottom: var(--spacing-xs); }
.teacherCardPosition { color: var(--color-text-secondary); }
.teacherCardSpecialty { color: var(--color-accent); }
```

---

## Адаптивность

```css
/* Мобильные */
.headerNav { display: none; }

/* Планшеты */
@media (min-width: 768px) {
  .headerNav { display: flex; }
}

/* Десктоп */
@media (min-width: 1024px) {
  .teachersGrid { grid-template-columns: repeat(3, 1fr); }
}
```

### Сетка

```css
.teachersGrid {
  display: grid;
  gap: var(--spacing-lg);
  grid-template-columns: 1fr;
}

@media (min-width: 640px) {
  .teachersGrid { grid-template-columns: repeat(2, 1fr); }
}
@media (min-width: 1024px) {
  .teachersGrid { grid-template-columns: repeat(3, 1fr); }
}
```

---

## Типографика

```css
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
}
```

| Элемент | Размер | Вес |
|---------|--------|-----|
| H1 | 3rem | 700 |
| H2 | 2.5rem | 600 |
| H3 | 1.25rem | 500 |
| Body | 1rem | 400 |

---

## Лучшие практики

### Переменные

✅ **Правильно:**
```css
.card {
  background-color: var(--color-bg-tertiary);
  padding: var(--spacing-lg);
}
```

❌ **Неправильно:**
```css
.card {
  background-color: #1a1a1a;
  padding: 2rem;
}
```

### Структура

```css
/* Layout */
.header { }
/* Elements */
.headerLogo { }
.headerNav { }
/* Modifiers */
.headerNavActive { }
/* Media */
@media (max-width: 768px) { .headerNav { } }
```

---

## Устранение проблем

### Классы не применяются

```tsx
// ❌ Неправильно
import './Header.module.css';
<div className="header" />

// ✅ Правильно
import styles from './Header.module.css';
<div className={styles.header} />
```

### TypeScript не распознаёт

Файл должен быть `.module.css`.

---

**См. также:** [components.md](./components.md)
