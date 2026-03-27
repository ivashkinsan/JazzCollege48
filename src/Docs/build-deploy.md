# Сборка и развёртывание

## Обзор

Проект использует Vite в качестве сборщика. Vite обеспечивает быструю разработку с горячей заменой модулей (HMR) и оптимизированную production-сборку.

## Скрипты npm

### Доступные команды

| Команда | Описание |
|---------|----------|
| `npm run dev` | Запуск сервера разработки |
| `npm run build` | Production-сборка |
| `npm run preview` | Предварительный просмотр сборки |
| `npm run lint` | Проверка кода ESLint |
| `npm run type-check` | Проверка типов TypeScript |

---

## Разработка

### Запуск сервера разработки

```bash
npm run dev
```

**Параметры:**
- Порт: 5173 (по умолчанию)
- HMR: включён
- Source maps: включены

**Пример вывода:**
```
  VITE v8.0.1  ready in 250 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### Горячая замена модулей (HMR)

Vite автоматически обновляет компоненты при изменении кода без полной перезагрузки страницы.

**Особенности:**
- Мгновенное обновление
- Сохранение состояния компонентов
- Отладка без потери контекста

---

## Production-сборка

### Создание сборки

```bash
npm run build
```

**Процесс:**
1. Компиляция TypeScript в JavaScript
2. Сборка всех модулей в бандлы
3. Минификация кода
4. Оптимизация активов
5. Генерация source maps

**Результат:**
```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── [assets]-[hash].[ext]
└── [static files]
```

### Параметры сборки

**По умолчанию:**
- Target: ES2020
- Minification: esbuild
- Source maps: отключены
- Code splitting: включён

### Настройка сборки

Для изменения параметров отредактируйте `vite.config.js`:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext',
    minify: 'terser',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom']
        }
      }
    }
  },
})
```

---

## Предварительный просмотр

### Локальный просмотр сборки

```bash
npm run preview
```

**Параметры:**
- Порт: 4173 (по умолчанию)
- Сервирует файлы из `dist/`

**Пример вывода:**
```
  ➜  Local:   http://localhost:4173/
  ➜  Network: use --host to expose
```

---

## Проверка качества кода

### Линтинг

```bash
npm run lint
```

**Инструмент:** ESLint 9.39.4

**Плагины:**
- `@eslint/js` — базовые правила
- `eslint-plugin-react-hooks` — правила для хуков
- `eslint-plugin-react-refresh` — правила для React Refresh

### Проверка типов

```bash
npm run type-check
```

**Инструмент:** TypeScript Compiler (tsc)

**Режим:** `--noEmit` (только проверка, без генерации файлов)

---

## Развёртывание

### Подготовка к деплою

1. **Запустить сборку:**
   ```bash
   npm run build
   ```

2. **Проверить сборку локально:**
   ```bash
   npm run preview
   ```

3. **Протестировать функциональность**

### Требования к хостингу

- Поддержка статических файлов (HTML, CSS, JS)
- HTTPS (рекомендуется)
- Gzip/Brotli сжатие
- Кэширование статических активов

---

## Деплой на популярные платформы

### Vercel

**Автоматический деплой:**

1. Установить CLI:
   ```bash
   npm i -g vercel
   ```

2. Развернуть:
   ```bash
   vercel
   ```

**Конфигурация не требуется** — Vercel автоматически определяет Vite-проект.

**vercel.json (опционально):**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "framework": "vite"
}
```

---

### Netlify

**Ручной деплой:**

1. Собрать проект:
   ```bash
   npm run build
   ```

2. Перетащить папку `dist/` в Netlify Drop

**Автоматический деплой через Git:**

1. Подключить репозиторий в Netlify
2. Настройки сборки:
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

### GitHub Pages

**Шаги:**

1. Установить gh-pages:
   ```bash
   npm install --save-dev gh-pages
   ```

2. Добавить скрипты в `package.json`:
   ```json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     },
     "homepage": "https://username.github.io/repo-name"
   }
   ```

3. Развернуть:
   ```bash
   npm run deploy
   ```

**Настройка vite.config.js:**
```javascript
export default defineConfig({
  base: '/repo-name/',
  plugins: [react()],
})
```

---

### Традиционный хостинг (FTP)

**Шаги:**

1. Собрать проект:
   ```bash
   npm run build
   ```

2. Загрузить содержимое папки `dist/` на сервер через FTP

**Требования:**
- PHP/Apache/Nginx не требуются
- Достаточно статического веб-сервера

---

## Docker (опционально)

### Создание Docker-образа

**Dockerfile:**
```dockerfile
# Build stage
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
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

## Оптимизация производительности

### Анализ размера бандла

```bash
npm install --save-dev rollup-plugin-visualizer
```

**vite.config.js:**
```javascript
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    react(),
    visualizer({ open: true })
  ],
})
```

### Рекомендации

1. **Code splitting:**
   - Разделение vendor-библиотек
   - Lazy loading для крупных компонентов

2. **Оптимизация изображений:**
   - Сжатие перед добавлением
   - Использование современных форматов (WebP)

3. **Кэширование:**
   - Hash в именах файлов
   - Long-term кэш для статических активов

4. **Минификация:**
   - Включена по умолчанию в Vite
   - Использование Terser для лучшей минификации

---

## Переменные окружения

### Создание .env файла

```env
VITE_API_URL=https://api.example.com
VITE_APP_TITLE=ЛОКИ Эстрада
```

**Правила:**
- Переменные должны начинаться с `VITE_`
- Доступ через `import.meta.env`

### Использование в коде

```typescript
const apiUrl = import.meta.env.VITE_API_URL;
const appTitle = import.meta.env.VITE_APP_TITLE;
```

### Режимы

**Файлы:**
- `.env` — все режимы
- `.env.development` — разработка
- `.env.production` — production
- `.env.test` — тесты

**Пример:**
```env
# .env.production
VITE_API_URL=https://api.production.com
VITE_ANALYTICS_ID=UA-XXXXX-Y
```

---

## CI/CD

### GitHub Actions

**.github/workflows/deploy.yml:**
```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Lint
        run: npm run lint
      
      - name: Type check
        run: npm run type-check
      
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

---

## Мониторинг и аналитика

### Добавление аналитики

**Яндекс.Метрика:**
```html
<!-- index.html -->
<head>
  <!-- Yandex.Metrika counter -->
  <script type="text/javascript">
    (function(m,e,t,r,i,k,a){
      m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
      // ...
    })(window, 0, "metrika", "counter", "ym", "XXXXXXXXX");
  </script>
  <!-- /Yandex.Metrika counter -->
</head>
```

### Performance monitoring

**Web Vitals:**
```bash
npm install web-vitals
```

```typescript
// src/metrics.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

---

## Устранение проблем

### Ошибка: "Build failed with errors"

**Решение:**
```bash
# Очистить кэш
rm -rf node_modules
rm package-lock.json
npm install

# Запустить сборку заново
npm run build
```

### Ошибка типов TypeScript

**Решение:**
```bash
# Проверить типы
npm run type-check

# Исправить ошибки в выводе
```

### Проблемы с путями к активам

**Решение:**
- Проверить `base` в vite.config.js
- Использовать абсолютные пути для активов

### HMR не работает

**Решение:**
```bash
# Перезапустить сервер
# Очистить кэш браузера
# Проверить совместимость расширений браузера
```

---

## Чеклист перед деплоем

- [ ] Сборка проходит без ошибок
- [ ] Все тесты проходят (если есть)
- [ ] Линтинг без ошибок
- [ ] Проверка типов без ошибок
- [ ] Локальный просмотр сборки успешен
- [ ] Все ссылки работают
- [ ] Изображения оптимизированы
- [ ] Мета-теги заполнены
- [ ] Favicon добавлен
- [ ] Robots.txt настроен
- [ ] SSL-сертификат установлен
