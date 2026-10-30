# Hacker News Client

Веб-интерфейс для [Hacker News](https://news.ycombinator.com/) на React и TypeScript:
список 100 самых свежих новостей, страницы новостей с лениво загружаемым деревом
комментариев и принудительное обновление данных. Данные приходят напрямую с
официального [Hacker News API](https://github.com/HackerNews/API) с фронтенда.

## Стек

- **React 19 + TypeScript**
- **TanStack Query** — серверное состояние: кэширование, статусы загрузки, инвалидация
- **React Router v7** (декларативный режим, API уровня v6) — маршрутизация `/` и `/news/:id`
- **Ant Design 6** + CSS Modules — интерфейс
- **axios** — HTTP-транспорт
- **Vite** — сборка, dev-сервер на порту 3000

## Запуск

```bash
npm install
npm start        # http://localhost:3000