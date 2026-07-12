# Документация проекта JazzCollege48

Веб-сайт эстрадного отделения Липецкого областного колледжа искусств им. К.Н. Игумнова

---

## Оглавление

| № | Документ | Файл | Описание |
|---|----------|------|----------|
| 1 | [Обзор проекта](./01-overview.md) | `01-overview.md` | Назначение, цели, целевая аудитория, структура сайта |
| 2 | [Технический стек](./02-tech-stack.md) | `02-tech-stack.md` | React, TypeScript, Vite, ESLint, зависимости |
| 3 | [Структура проекта](./03-project-structure.md) | `03-project-structure.md` | Файловая структура, именование, точки входа |
| 4 | [Архитектура приложения](./04-architecture.md) | `04-architecture.md` | Компонентная иерархия, поток данных, модули |
| 5 | [Компоненты](./05-components.md) | `05-components.md` | Документация всех React-компонентов |
| 6 | [Модуль данных](./06-data-module.md) | `06-data-module.md` | Интерфейсы, данные, загрузка из Markdown |
| 7 | [Стили и дизайн](./07-styles-design.md) | `07-styles-design.md` | CSS-модули, дизайн-система, переменные |
| 8 | [Сборка и деплой](./08-build-deploy.md) | `08-build-deploy.md` | GitHub Pages, asset(), устранение проблем |
| 9 | [Парсинг данных](./09-data-parsing.md) | `09-data-parsing.md` | Детальное описание логики парсинга Markdown |
| 10 | [Реализация SQL](./10-sql-implementation.md) | `10-sql-implementation.md` | Переход на SQLite, структура БД, CRUD |
| 11 | [Недавние изменения](./11-recent-changes.md) | `11-recent-changes.md` | Обновления за июнь 2026 |
| 12 | [Админ-панель](./12-admin-panel-updates.md) | `12-admin-panel-updates.md` | Обновления админ-панели |
| 13 | [Бэкенд-рефакторинг](./13-backend-refactoring-and-features.md) | `13-backend-refactoring-and-features.md` | Улучшения и новые функции бэкенда |
| 14 | [Миграция на NestJS](./14-backend-nestjs-migration.md) | `14-backend-nestjs-migration.md` | Переход бэкенда на NestJS |
| 15 | [Управление контентом](./15-content-media-workflow.md) | `15-content-media-workflow.md` | Рабочий процесс с контентом и медиа |
| 16 | [Фильтры новостей](./16-news-page-filters.md) | `16-news-page-filters.md` | Реализация UI и поведения фильтров |
| 17 | [Роутинг API админки](./17-admin-api-routing.md) | `17-admin-api-routing.md` | Архитектура получения списков в админ-панели |

---

## О проекте

**JazzCollege48** — современный SPA-сайт эстрадного отделения ЛОКИ им. К.Н. Игумнова.

### Ключевые технологии

- **React 19** + **TypeScript 6**
- **Vite 8** — сборщик
- **React Router 7** — маршрутизация
- **CSS Modules** — стилизация

### Основные разделы

- Главная страница с секциями (Hero, About, Specialties, Teachers и др.)
- Страницы: новости, афиша, выпускники, фото, видео, ДАИ, администрация
- Темизация: тёмная тема с золотыми акцентами

---

**Версия:** 2.0 — Апрель 2026
