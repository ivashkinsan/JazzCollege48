# 8. Сборка и деплой

## Обзор

Проект использует Vite для сборки. Обеспечивает быструю разработку с HMR и оптимизированную production-сборку.

## Скрипты npm

| Команда | Описание |
|---------|----------|
| `npm run dev` | Сервер разработки (порт 5173) |
| `npm run build` | Production-сборка с оптимизацией изображений |
| `npm run preview` | Просмотр сборки (порт 4173) |
| `npm run deploy` | **Сборка и развертывание проекта на FTP-хостинг** |
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
2. **Оптимизация изображений (кэшируется)**
3. Сборка модулей в бандлы
4. Минификация кода
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
  base: '/',
  plugins: [
    react(),
    Imagemin({
      mode: 'squoosh',
      cache: true
    }),
  ],
  build: {
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: false,
  },
})
```

> **ВАЖНО:** Параметр `base: '/'` указывает, что сайт будет развернут в корне домена. Это критично для корректной работы React Router и путей к ресурсам.

---

## Локальное развертывание по FTP

Это основной способ развертывания проекта на рабочий сервер.

### 1. Настройка окружения

Перед первым развертыванием необходимо создать файл `.env` в корне проекта.

1.  Создайте файл с именем `.env`.
2.  Скопируйте в него следующее содержимое и подставьте свои данные:

```env
# Учетные данные для FTP
FTP_HOST="АДРЕС_ВАШЕГО_FTP_СЕРВЕРА"
FTP_USER="ВАШ_ЛОГИН"
FTP_PASSWORD="ВАШ_ПАРОЛЬ"
FTP_REMOTE_PATH="/путь/к/папке/сайта/на/сервере/"
```

> **Безопасность:** Файл `.env` находится в `.gitignore` и не должен никогда попадать в репозиторий, так как содержит секретные данные.

### 2. Запуск развертывания

Для сборки и развертывания проекта выполните одну команду:

```bash
npm run deploy
```

### 3. Как это работает

Команда `npm run deploy` запускает два последовательных шага:
1.  `npm run build`: Собирает проект в папку `dist/`, включая оптимизацию изображений.
2.  `node scripts/deploy.js`: Запускает специальный скрипт, который:
    -   Читает учетные данные из файла `.env`.
    -   Подключается к FTP-серверу.
    -   **Полностью очищает** указанную в `FTP_REMOTE_PATH` директорию на сервере.
    -   Загружает все содержимое папки `dist/` на сервер.

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

### Проверка типов

```bash
npm run type-check
```

**Инструмент:** TypeScript Compiler (`--noEmit`)

---

## Развёртывание на GitHub Pages (Альтернативный способ)

Хотя основной метод развертывания - по FTP, в проекте сохранена возможность развертывания на GitHub Pages, например, для демонстрации.

### Настройка репозитория

1. **vite.config.js** — для GitHub Pages нужно изменить `base`:
```javascript
base: '/JazzCollege48/',
```

2. **BrowserRouter** в `App.tsx` — уже настроен и использует `import.meta.env.BASE_URL`, поэтому менять ничего не нужно.

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

---

## Переменные окружения

### .env файл

Для локального развертывания по FTP используется файл `.env` (см. секцию "Локальное развертывание по FTP").

Для других целей (например, ключи API) переменные должны начинаться с `VITE_`.
```env
VITE_API_URL=https://api.example.com
```
Доступ к ним осуществляется через `import.meta.env.VITE_API_URL`.

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

1. **Автоматическая оптимизация изображений** — выполняется при сборке (`npm run build`) с помощью `unplugin-imagemin`. Повторная обработка неизмененных изображений пропускается благодаря кэшированию.
2. **Code splitting** — разделение vendor-библиотек.
3. **Кэширование** — hash в именах файлов.
4. **Минификация** — включена по умолчанию.
