# 2. Технический стек

## Обзор технологий

Проект построен на современном стеке для разработки React-приложений с TypeScript.

## Основные технологии

### React 19.2.4

**Назначение:** UI-библиотека для построения пользовательских интерфейсов

**Ключевые особенности:**
- Компонентный подход
- Виртуальный DOM
- Хуки для управления состоянием
- Строгая типизация через TypeScript

**Использование:**
```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

### TypeScript 6.0.2

**Назначение:** Статически типизированный язык

**Преимущества:**
- Раннее обнаружение ошибок
- Улучшенная автодополнение в IDE
- Самодокументирующийся код

**Конфигурация:**
- Target: ES2020
- Module: ESNext
- JSX: react-jsx
- Strict mode: включён

### Vite 8.0.1

**Назначение:** Современный сборщик проектов

**Преимущества:**
- Мгновенный запуск сервера разработки
- Горячая замена модулей (HMR)
- Оптимизированная production-сборка

**Плагины:**
- `@vitejs/plugin-react` — интеграция с React

---

## Инструменты разработки

### ESLint 9.39.4

**Назначение:** Статический анализ кода

**Конфигурация:**
- `@eslint/js` — базовые правила
- `eslint-plugin-react-hooks` — правила для хуков
- `eslint-plugin-react-refresh` — правила для React Refresh

**Команды:**
```bash
npm run lint  # Проверка кода
```

### Типизация React

**Пакеты:**
- `@types/react` ^19.2.14
- `@types/react-dom` ^19.2.3

---

## Структура зависимостей

### Production-зависимости

| Пакет | Версия | Назначение |
|-------|--------|------------|
| react | ^19.2.4 | UI-библиотека |
| react-dom | ^19.2.4 | DOM-рендерер |

### Development-зависимости

| Пакет | Версия | Назначение |
|-------|--------|------------|
| typescript | ^6.0.2 | Компилятор TypeScript |
| vite | ^8.0.1 | Сборщик проектов |
| @vitejs/plugin-react | ^6.0.1 | Плагин React для Vite |
| eslint | ^9.39.4 | Линтер |
| eslint-plugin-react-hooks | ^7.0.1 | Правила для хуков |
| eslint-plugin-react-refresh | ^0.5.2 | Правила для React Refresh |
| @types/react | ^19.2.14 | Типы для React |
| @types/react-dom | ^19.2.3 | Типы для React DOM |
| globals | ^17.4.0 | Глобальные переменные |

---

## Конфигурация TypeScript

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### Ключевые настройки

| Настройка | Значение | Описание |
|-----------|----------|----------|
| `strict` | true | Строгая типизация |
| `noUnusedLocals` | true | Ошибка для неиспользуемых переменных |
| `noUnusedParameters` | true | Ошибка для неиспользуемых параметров |
| `noFallthroughCasesInSwitch` | true | Запрет провала в switch |
| `moduleResolution` | bundler | Оптимизировано для сборщиков |

---

## Конфигурация Vite

### vite.config.js

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
})
```

### Настройки

| Настройка | Значение | Описание |
|-----------|----------|----------|
| `plugins` | [react()] | Плагин для поддержки React |
| `resolve.extensions` | ['.ts', '.tsx', '.js', '.jsx'] | Автоматическое разрешение расширений |

---

## Браузерная поддержка

Проект ориентируется на современные браузеры:

- ES2020
- CSS-переменные
- Modern JavaScript API

**Минимальные версии:**
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

---

## Производительность

### Оптимизации Vite

- **Code splitting** — автоматическое разделение кода
- **Tree shaking** — удаление неиспользуемого кода
- **Minification** — минификация CSS и JS
- **Asset optimization** — оптимизация статических ресурсов

### Рекомендации

1. Использовать ленивую загрузку для крупных компонентов
2. Оптимизировать изображения перед добавлением
3. Использовать React.memo для тяжёлых компонентов

---

## Безопасность

### Встроенные механизмы

- Strict Mode в React для выявления проблем
- TypeScript для предотвращения ошибок типов
- ESLint для соблюдения лучших практик

### Рекомендации

- Не хранить чувствительные данные в коде
- Использовать HTTPS для production
- Регулярно обновлять зависимости
