# Сборка и развёртывание

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
  plugins: [react()],
  build: {
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: false,
  },
})
```

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

## Развёртывание

### Требования к хостингу

- Поддержка статических файлов
- HTTPS (рекомендуется)
- Gzip/Brotli сжатие
- Кэширование статических активов

---

## Деплой на платформы

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

### GitHub Pages

**Установка:**
```bash
npm install --save-dev gh-pages
```

**package.json:**
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  },
  "homepage": "https://username.github.io/repo-name"
}
```

**Запуск:**
```bash
npm run deploy
```

**vite.config.js:**
```javascript
export default defineConfig({
  base: '/repo-name/',
  plugins: [react()],
})
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
```

### Режимы

- `.env` — все режимы
- `.env.development` — разработка
- `.env.production` — production

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
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
      - run: npm run lint
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

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

---

## Чеклист перед деплоем

- [ ] Сборка без ошибок
- [ ] Линтинг без ошибок
- [ ] Проверка типов без ошибок
- [ ] Локальный просмотр успешен
- [ ] Все ссылки работают
- [ ] Изображения оптимизированы
- [ ] Favicon добавлен
