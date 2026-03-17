# Task Tracker (Fullstack)

Task Tracker — небольшое fullstack-приложение для управления задачами и обсуждения задач в комментариях.

## Возможности

- **JWT-авторизация**: регистрация, логин, получение профиля
- **CRUD задач**: создать, посмотреть список, обновить статус/поля, удалить
- **Комментарии к задачам**: добавить, посмотреть, удалить (удаление доступно автору комментария)

## Стек

- **Backend**: Node.js, Express, PostgreSQL, JWT
- **Frontend**: React, Vite, Tailwind CSS, TypeScript, Axios

---

## Требования к окружению

- Node.js (LTS) + npm
- Docker Desktop (для запуска всего проекта через `docker compose`)

---

## Запуск всего проекта одной командой (Docker Compose)

В корне репозитория:

```bash
docker compose up -d --build
```

### Миграции (после поднятия контейнеров)

Миграции выполняются внутри контейнера backend (он уже знает `DATABASE_URL` до контейнера `db`):

```bash
docker compose exec backend npm run migrate
```

### Проверка работы

- **Backend health-check**:

```bash
curl http://localhost:3000/health
```

- **Frontend в браузере**: откройте `http://localhost:5173`

---

## Открытые порты и как фронт ходит к backend

- **PostgreSQL**: `localhost:5432` → контейнер `db:5432`
- **Backend API**: `localhost:3000` → контейнер `backend:3000`
- **Frontend (Vite)**: `localhost:5173` → контейнер `frontend:5173`

Фронтенд работает в браузере пользователя, поэтому запросы Axios идут на:

```text
http://localhost:3000
```

Это задаётся переменной `VITE_API_URL` (в docker compose она выставлена в `http://localhost:3000`), а JWT автоматически добавляется ко всем запросам через Axios interceptor.

---

## Запуск Backend

Перейдите в папку backend:

```bash
cd task-tracker-backend
```

### 1) Установка зависимостей

```bash
npm install
```

### 2) Настройка переменных окружения

```bash
cp .env.example .env
```

Проверьте, что в `.env` указан `DATABASE_URL`. По умолчанию подходит значение из примера:

```text
DATABASE_URL=postgres://postgres:postgres@localhost:5432/task_tracker
```

### 3) Запуск PostgreSQL

```bash
docker compose up -d
```

### 4) Миграции

```bash
npm run migrate
```

### 5) Запуск сервера

```bash
npm run dev
```

### 6) Проверка работоспособности

Проверка health-check:

```bash
curl http://localhost:3000/health
```

Ожидаемый ответ:

```json
{ "ok": true }
```

---

## Запуск Frontend

Перейдите в папку frontend:

```bash
cd ../task-tracker-frontend
```

### 1) Установка зависимостей

```bash
npm install
```

### 2) Настройка переменных окружения

```bash
cp .env.example .env
```

По умолчанию фронт ходит в backend по:

```text
VITE_API_URL=http://localhost:3000
```

### 3) Запуск Vite dev server

```bash
npm run dev
```

### 4) Открыть в браузере

Обычно Vite поднимается на:

- `http://localhost:5173`

### 5) Проверка связи с backend

1. Откройте `http://localhost:5173`
2. Зарегистрируйтесь или войдите
3. Создайте задачу и добавьте комментарий — это подтверждает, что **Axios** ходит в backend, а **JWT** добавляется к запросам автоматически.

---

## Тестовые сценарии (ручные)

Ниже — быстрый чек-лист для демонстрации проекта.

### 1) Регистрация

- Откройте страницу **Регистрация**
- Заполните поля:
  - Почта: `test@example.com`
  - Пароль: минимум 8 символов
  - Имя: опционально
- Нажмите **Создать аккаунт**
- Ожидаемо: вы попадёте на страницу **Задачи**, токен сохранится в `localStorage`

### 2) Логин

- Выйдите (**Выйти** в navbar)
- Откройте страницу **Вход**
- Введите почту/пароль
- Ожидаемо: переход на страницу **Задачи**

### 3) Создание задачи

- На странице **Задачи** в блоке **Новая задача** заполните:
  - Название (обязательно)
  - Описание (опционально)
- Нажмите **Создать задачу**
- Ожидаемо: новая задача появится в списке

### 4) Редактирование задачи (обновление)

- В карточке задачи смените статус через селект:
  - **Сделать** → **В процессе** → **Готово**
- Ожидаемо: статус изменится, в мета-информации обновится поле “Обновлено”

### 5) Удаление задачи

- Нажмите **Удалить** в карточке задачи
- Ожидаемо: задача исчезнет из списка

### 6) Добавление комментария

- В карточке задачи нажмите **Показать комментарии**
- Введите текст и нажмите **Добавить**
- Ожидаемо: комментарий появится в списке, счетчик комментариев увеличится

### 7) Удаление комментария

- У своего комментария нажмите **Удалить**
- Ожидаемо: комментарий исчезнет (на backend удалять может только автор)

---

## Структура проекта

```text
Task_jira/
  task-tracker-backend/
  task-tracker-frontend/
```

### Backend (`task-tracker-backend/`)

- `src/app.js` — сборка Express приложения (middlewares + routes)
- `src/server.js` — запуск сервера
- `src/config/` — env + подключение к PostgreSQL
- `src/db/migrations/` — SQL-миграции (users/tasks/comments)
- `src/routes/` — роуты (`auth`, `tasks` + nested `comments`)
- `src/controllers/` — обработчики запросов (req/res)
- `src/services/` — бизнес-логика
- `src/repositories/` — SQL-доступ к PostgreSQL
- `src/middlewares/` — JWT auth, валидация, обработчик ошибок
- `scripts/migrate.js` — запуск миграций

### Frontend (`task-tracker-frontend/`)

- `src/app/router.tsx` — маршрутизация (`/login`, `/register`, `/tasks`)
- `src/api/axios.ts` — Axios instance + JWT interceptor
- `src/store/auth.store.tsx` — auth state, `me`, `login`, `register`, `logout`
- `src/pages/` — страницы (Вход, Регистрация, Задачи)
- `src/components/` — компоненты (`Navbar`, `TaskCard`, `Comment`)
- `src/hooks/` — хуки для задач/комментариев
- `src/styles/index.css` — Tailwind directives

---



