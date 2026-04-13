# 8. Сборка и деплой

## Обзор

Проект использует Vite для сборки. Обеспечивает быструю разработку с HMR и оптимизированную production-сборку.

## Скрипты npm

| Команда | Описание |
|---------|----------|
| `npm run dev` | Сервер разработки (порт 5173) |
| `npm run build` | Production-сборка |
| `npm run preview` | Просмотр сборки (порт 4173) |
| `npm run lint` | Проверка ESLint |
| `npm run type-check` | Проверка TypeScript |

---

## Разработка

### Запуск сервера

```bash
npm run dev
```

**Параметры:**
- Порт: 5173
- HMR: включён
- Source maps: включены

**Вывод:**
```
VITE v8.0.1  ready in 250 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### Горячая замена (HMR)

Vite автоматически обновляет компоненты при изменении кода без перезагрузки страницы.

---

## Production-сборка

### Создание сборки

```bash
npm run build
```

**Процесс:**
1. Компиляция TypeScript → JavaScript
2. Сборка модулей в бандлы
3. Минификация кода
4. Оптимизация активов
5. Генерация source maps (опционально)

**Результат:**
```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── [assets]-[hash].[ext]
```

### Настройка сборки

**vite.config.js:**
```javascript
export default defineConfig({
  base: '/JazzCollege48/',  // Важно для GitHub Pages!
  plugins: [react()],
  build: {
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: false,
  },
})
```

> **ВАЖНО:** Для деплоя на GitHub Pages обязательно указать `base: '/repo-name/'` в vite.config.js. Без этого пути к ресурсам будут неверными.

---

## Предварительный просмотр

```bash
npm run preview
```

Сервирует файлы из `dist/` на порту 4173.

---

## Проверка качества

### Линтинг

```bash
npm run lint
```

**Инструмент:** ESLint 9.39.4
**Плагины:** `@eslint/js`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`

### Проверка типов

```bash
npm run type-check
```

**Инструмент:** TypeScript Compiler (`--noEmit`)

---

## Развёртывание на GitHub Pages

### Настройка репозитория

1. **vite.config.js** — указать `base`:
```javascript
base: '/JazzCollege48/',
```

2. **BrowserRouter** в `App.tsx` — добавить `basename`:
```tsx
const baseName = import.meta.env.BASE_URL;

function App() {
  return (
    <BrowserRouter basename={baseName}>
      {/* Routes */}
    </BrowserRouter>
  );
}
```

3. **Пути к изображениям** — использовать функцию `asset()`:
```tsx
import { asset } from './data/collegeData';

<img src={asset('/foto/teacher.jpg')} alt="..." />
```

4. **Якорные ссылки** в Header — **НЕ** добавлять `baseName` вручную.

> ⚠️ **ВАЖНО про якорные ссылки:**
>
> В компоненте Header якорные ссылки (`#contacts`, `#about` и т.д.) формируются так:
> - На главной странице: `#contacts` (как есть)
> - На внутренних страницах: `/#contacts` (с ведущим слэшем)
>
> **НЕЛЬЗЯ** вручную добавлять `baseName` (`import.meta.env.BASE_URL`) к пути — React Router уже добавит `basename` автоматически. Иначе получится дублирование: `/JazzCollege48/JazzCollege48/#contacts`.
>
> ```tsx
> // ПРАВИЛЬНО — basename добавится сам:
> const linkPath = isHomePage ? item.href : `/${item.href}`;
> <Link to={linkPath}>Контакты</Link>
>
> // НЕПРАВИЛЬНО — дублирование пути:
> const linkPath = baseName + item.href; // ❌ /JazzCollege48/#contacts + basename = /JazzCollege48/JazzCollege48/#contacts
> ```

### GitHub Actions workflow

Проект использует автоматическую сборку через GitHub Actions:

**.github/workflows/deploy.yml:**
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: ['main']
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - uses: actions/deploy-pages@v4

env:
  FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: true
```

**Настройки на GitHub:**
- Settings → Pages → Source: **GitHub Actions**
- URL сайта: `https://ivashkinsan.github.io/JazzCollege48/`

### Процесс деплоя

1. Пуш в ветку `main`:
```bash
git add -A
git commit -m "..."
git push
```

2. GitHub Actions автоматически:
   - Установит зависимости (`npm ci`)
   - Соберёт проект (`npm run build`)
   - Задеплоит на GitHub Pages

3. Сайт доступен через 1-2 минуты после пуша.

---

## Деплой на другие платформы

### Vercel

**Автоматический деплой:**
```bash
npm i -g vercel
vercel
```

Vercel автоматически определяет Vite-проект.

**vercel.json (опционально):**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

---

### Netlify

**Ручной деплой:** Перетащить `dist/` в Netlify Drop

**Автоматический через Git:**
1. Подключить репозиторий в Netlify
2. Настройки:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`

**netlify.toml:**
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

### Традиционный хостинг (FTP)

1. Собрать: `npm run build`
2. Загрузить содержимое `dist/` на сервер через FTP

---

## Docker (опционально)

**Dockerfile:**
```dockerfile
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Сборка и запуск:**
```bash
docker build -t lipetsk-college-arts .
docker run -p 80:80 lipetsk-college-arts
```

---

## Переменные окружения

### .env файл

```env
VITE_API_URL=https://api.example.com
VITE_APP_TITLE=ЛОКИ Эстрада
```

**Правила:**
- Переменные должны начинаться с `VITE_`
- Доступ через `import.meta.env`

### Использование

```typescript
const apiUrl = import.meta.env.VITE_API_URL;
const baseName = import.meta.env.BASE_URL;  // '/JazzCollege48/' на GitHub Pages
```

### Режимы

- `.env` — все режимы
- `.env.development` — разработка
- `.env.production` — production

---

## Утилита `asset()` для путей

**Определение:** `src/data/collegeData.ts`

```typescript
export function asset(path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return import.meta.env.BASE_URL + cleanPath;
}
```

**Назначение:** Добавляет `BASE_URL` ко всем путям к изображениям, обеспечивая корректную работу на GitHub Pages.

**Использование:**
```tsx
import { asset } from './data/collegeData';

// В компонентах:
<img src={asset('/foto/teacher.jpg')} alt="..." />
<img src={graduate.image || asset('/foto/graduates/default.jpg')} alt="..." />

// В CSS background-image — использовать inline-style:
<section style={{ backgroundImage: `url(${asset('/foto/Full.png')})` }}>
```

> **ВАЖНО:** ВСЕ пути к изображениям должны быть обёрнуты в `asset()`. Это включает:
> - Статические данные в `collegeData.ts` (teachers, graduates, achievements и т.д.)
> - Пути из Markdown (cover, gallery в новостях и афишах)
> - Логотипы и фоновые изображения в компонентах
> - Fallback-пути (default изображения)

---

## CI/CD

### GitHub Actions

Автоматическая сборка и деплой при каждом пуше в `main`.

---

## Оптимизация

### Анализ бандла

```bash
npm install --save-dev rollup-plugin-visualizer
```

**vite.config.js:**
```javascript
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [react(), visualizer({ open: true })],
})
```

### Рекомендации

1. **Code splitting** — разделение vendor-библиотек
2. **Оптимизация изображений** — сжатие, WebP
3. **Кэширование** — hash в именах файлов
4. **Минификация** — включена по умолчанию

---

## Устранение проблем

### "Build failed with errors"

```bash
# Очистить кэш
rm -rf node_modules
rm package-lock.json
npm install
npm run build
```

### Ошибка типов TypeScript

```bash
npm run type-check
# Исправить ошибки в выводе
```

### HMR не работает

```bash
# Перезапустить сервер
# Очистить кэш браузера
```

### 404 на GitHub Pages

**Причины:**
1. Не указан `base: '/repo-name/'` в `vite.config.js`
2. Не указан `basename` в `BrowserRouter`
3. Пути к фото без `asset()`

**Решение:** Проверить все три пункта выше, пересобрать и запушить.

### Дублирование пути (/JazzCollege48/JazzCollege48/...)

**Причина:** Вручную добавлен `baseName` к пути в `<Link to={...}>`, но React Router уже добавляет `basename` автоматически.

**Решение:** Убрать ручное добавление `baseName`/`BASE_URL`. Для якорных ссылок использовать `/#anchor` вместо `baseName + '#anchor'`.

---

## Чеклист перед деплоем

- [ ] Сборка без ошибок (`npm run build`)
- [ ] Линтинг без ошибок (`npm run lint`)
- [ ] Проверка типов без ошибок (`npm run type-check`)
- [ ] Локальный просмотр успешен
- [ ] Все ссылки работают
- [ ] `base` указан в `vite.config.js`
- [ ] `basename` указан в `BrowserRouter`
- [ ] Все пути к фото через `asset()`
- [ ] Изображения оптимизированы
- [ ] Favicon добавлен
- [ ] GitHub Actions workflow настроен
